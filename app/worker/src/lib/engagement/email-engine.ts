// CookTwo engagement engine — autonomous brain.
// computeUserState → decideNextEmail → generateAndSendEmail → processAllUsers.
// Guardrails: max 1 email/user/day, no double-send, skip unsubscribed/unverified.

import { writeEmail, type EmailOutput, type EmailType } from './email-writer';
import { sendEngagementEmail, type SenderEnv } from './email-sender';

const DAY_MS = 86400000;
const TWO_DAYS_MS = DAY_MS * 2;
const THREE_DAYS_MS = DAY_MS * 3;
const SEVEN_DAYS_MS = DAY_MS * 7;

export interface UserState {
  userId: string;
  email: string;
  name: string;
  verified: boolean;
  unsubscribed: boolean;
  createdAt: number;
  lastActiveAt: number;
  daysSinceSignup: number;
  daysSinceLastActive: number;
  totalActions: number;
  totalMeals: number;
  mealsLast7Days: number;
  partnerCount: number;
  planLabel: string | null;
  acquisitionSource: string | null;
  acquisitionCountry: string | null;
  hasHousehold: boolean;
  hasPartner: boolean;
  hasMeals: boolean;
}

export interface EmailDecision {
  type: EmailType;
  reason: string;
  contextNote: string;
}

export interface EngineEnv extends SenderEnv {
  DB: D1Database;
  OPENROUTER_API_KEY?: string;
  EMAIL_MODEL?: string;
  ADMIN_SECRET?: string;
  SITE_URL?: string;
  PWA_URL?: string;
}

// ──────────────────────────────────────────────────────────────
// 1. Compute user state from D1
// ──────────────────────────────────────────────────────────────

export async function computeUserState(userId: string, db: D1Database): Promise<UserState | null> {
  const user = await db
    .prepare('SELECT * FROM engagement_users WHERE id = ?')
    .bind(userId)
    .first<{
      id: string; email: string; name: string | null; verified: number;
      unsubscribed: number; created_at: number; last_active_at: number;
      household_id: string | null; acquisition_source: string | null;
      acquisition_country: string | null;
    }>();
  if (!user) return null;

  const now = Date.now();
  const householdId = user.household_id;

  let totalActions = 0;
  let totalMeals = 0;
  let mealsLast7Days = 0;
  let lastActionAt = user.last_active_at;

  if (householdId) {
    const actRes = await db
      .prepare('SELECT action_type, created_at FROM activity_log WHERE household_id = ?')
      .bind(householdId)
      .all<{ action_type: string; created_at: number }>();
    const actions = actRes.results || [];

    totalActions = actions.length;
    for (const a of actions) {
      if (a.created_at > lastActionAt) lastActionAt = a.created_at;
      if (a.action_type && a.action_type.includes('meal')) {
        totalMeals++;
        if (now - a.created_at < SEVEN_DAYS_MS) mealsLast7Days++;
      }
    }
  }

  let partnerCount = 0;
  if (householdId) {
    const partRes = await db
      .prepare('SELECT COUNT(*) as c FROM partners WHERE household_id = ?')
      .bind(householdId)
      .first<{ c: number }>();
    partnerCount = partRes?.c ?? 0;
  }

  let planLabel: string | null = null;
  if (householdId) {
    const sub = await db
      .prepare('SELECT plan FROM household_subscriptions WHERE household_id = ? LIMIT 1')
      .bind(householdId)
      .first<{ plan: string }>();
    planLabel = sub?.plan ?? null;
  }

  return {
    userId: user.id,
    email: user.email,
    name: user.name || '',
    verified: !!user.verified,
    unsubscribed: !!user.unsubscribed,
    createdAt: user.created_at,
    lastActiveAt: lastActionAt,
    daysSinceSignup: Math.floor((now - user.created_at) / DAY_MS),
    daysSinceLastActive: Math.floor((now - lastActionAt) / DAY_MS),
    totalActions,
    totalMeals,
    mealsLast7Days,
    partnerCount,
    planLabel,
    acquisitionSource: user.acquisition_source,
    acquisitionCountry: user.acquisition_country,
    hasHousehold: !!householdId,
    hasPartner: partnerCount >= 2,
    hasMeals: totalMeals > 0,
  };
}

// ──────────────────────────────────────────────────────────────
// 2. Decide which email (if any) is due
// ──────────────────────────────────────────────────────────────

export async function decideNextEmail(state: UserState, db: D1Database): Promise<EmailDecision | null> {
  if (state.unsubscribed || !state.verified) return null;

  const recentRes = await db
    .prepare(`SELECT email_type, created_at FROM engagement_emails WHERE user_id = ? AND status != 'failed' ORDER BY created_at DESC LIMIT 20`)
    .bind(state.userId)
    .all<{ email_type: string; created_at: number }>();
  const recent = recentRes.results || [];

  const now = Date.now();
  const lastSent = recent.length > 0 ? (recent[0] as { created_at: number }).created_at : 0;
  const hoursSinceLastEmail = (now - lastSent) / (1000 * 60 * 60);

  // Guardrail: max 1 email per day
  if (hoursSinceLastEmail < 24) return null;

  const wasRecentlySent = (type: string, withinMs: number) =>
    recent.some((e) => e.email_type === type && now - e.created_at < withinMs);

  // 1. Welcome — first email after signup, always
  if (recent.length === 0) {
    return {
      type: 'welcome',
      reason: 'New user — first email',
      contextNote: `User just signed up${state.name ? ' (' + state.name + ')' : ''} from ${state.acquisitionSource || 'unknown'} source. Send a warm welcome and point them to the app (https://cooktwo.app/PWA) and website (https://cooktwo.com).`,
    };
  }

  // 2. Partner invite — household exists, only one partner, 3+ days
  if (state.hasHousehold && !state.hasPartner && state.daysSinceSignup >= 3 && !wasRecentlySent('partner_invite', THREE_DAYS_MS)) {
    return {
      type: 'partner_invite',
      reason: 'Partner not yet joined after 3+ days',
      contextNote: `User's household has ${state.partnerCount} partner(s). Encourage them to share their invite code so their partner can join.`,
    };
  }

  // 3. First meal logged — celebrate, then set up for habit
  if (state.totalMeals === 1 && !wasRecentlySent('first_meal_logged', TWO_DAYS_MS)) {
    return {
      type: 'first_meal_logged',
      reason: 'First meal logged — celebrate + suggest next',
      contextNote: `User just logged their first meal. Celebrate and encourage a second.`,
    };
  }

  // 4. Meal streak — 3+ meals in last 7 days
  if (state.mealsLast7Days >= 3 && !wasRecentlySent('meal_streak', SEVEN_DAYS_MS)) {
    return {
      type: 'meal_streak',
      reason: `${state.mealsLast7Days} meals in last 7 days — streak`,
      contextNote: `User logged ${state.mealsLast7Days} meals in the last 7 days. Encourage weekly meal planning.`,
    };
  }

  // 5. Premium pitch — power usage without premium
  if (state.totalMeals >= 10 && !state.planLabel && !wasRecentlySent('premium_pitch', SEVEN_DAYS_MS)) {
    return {
      type: 'premium_pitch',
      reason: 'Power usage without premium',
      contextNote: `User has ${state.totalMeals} meals logged but is on the free plan. Mention Premium (70 AI requests/day, $4.99).`,
    };
  }

  // 6. App onboarding — signed up 2+ days, no app activity
  if (state.totalActions === 0 && state.daysSinceSignup >= 2 && !wasRecentlySent('app_onboarding', TWO_DAYS_MS)) {
    return {
      type: 'app_onboarding',
      reason: `${state.daysSinceSignup} days since signup, no app activity`,
      contextNote: `User signed up ${state.daysSinceSignup} days ago but hasn't used the app. Encourage them to open https://cooktwo.app/PWA and set up.`,
    };
  }

  // 7. Inactivity nudge — had activity before, 7+ days inactive
  if (state.totalActions > 0 && state.daysSinceLastActive >= 7 && !wasRecentlySent('inactivity_nudge', SEVEN_DAYS_MS)) {
    return {
      type: 'inactivity_nudge',
      reason: `${state.daysSinceLastActive} days inactive (had ${state.totalActions} actions)`,
      contextNote: `User was active but hasn't used CookTwo in ${state.daysSinceLastActive} days. Warm re-engagement.`,
    };
  }

  // 8. App tip — weekly rotation
  if (state.daysSinceSignup >= 3 && !wasRecentlySent('app_tip', SEVEN_DAYS_MS)) {
    return {
      type: 'app_tip',
      reason: 'Weekly tip rotation',
      contextNote: `Weekly CookTwo tip for ${state.name || 'this user'}. Pick a useful feature tip.`,
    };
  }

  return null;
}

// ──────────────────────────────────────────────────────────────
// 3. Generate + send an email
// ──────────────────────────────────────────────────────────────

export async function generateAndSendEmail(
  env: EngineEnv,
  state: UserState,
  decision: EmailDecision,
): Promise<{ success: boolean; emailId?: string; error?: string }> {
  const llmState = {
    name: state.name,
    daysSinceSignup: state.daysSinceSignup,
    totalActions: state.totalActions,
    totalMeals: state.totalMeals,
    mealsLast7Days: state.mealsLast7Days,
    partnerCount: state.partnerCount,
    hasPartner: state.hasPartner,
    hasMeals: state.hasMeals,
    planLabel: state.planLabel,
    acquisitionSource: state.acquisitionSource,
    acquisitionCountry: state.acquisitionCountry,
  };

  if (!env.OPENROUTER_API_KEY) {
    // Still allow draft-mode sends using fallback templates so the engine
    // can be tested without AI keys.
  }

  const { output, usedFallback } = await writeEmail(
    env.OPENROUTER_API_KEY || '',
    decision.type,
    llmState,
    decision.contextNote,
    env.EMAIL_MODEL || 'openrouter/free',
  );

  const unsubRow = await env.DB
    .prepare('SELECT unsub_token FROM engagement_users WHERE id = ?')
    .bind(state.userId)
    .first<{ unsub_token: string }>();
  const unsubToken = unsubRow?.unsub_token || '';

  const sendResult = await sendEngagementEmail(
    {
      DB: env.DB,
      RESEND_API_KEY: env.RESEND_API_KEY,
      RESEND_FROM: env.RESEND_FROM,
      PWA_URL: env.PWA_URL,
      SITE_URL: env.SITE_URL,
    },
    state.userId,
    decision.type,
    output,
    { ...llmState, decision, usedFallback },
    unsubToken,
  );

  return {
    success: sendResult.success,
    error: sendResult.error,
  };
}

// ──────────────────────────────────────────────────────────────
// 4. Cron processor — scans all users, sends due emails
// ──────────────────────────────────────────────────────────────

export async function processAllUsers(env: EngineEnv): Promise<{
  scanned: number;
  sent: number;
  skipped: number;
  errors: string[];
}> {
  const usersRes = await env.DB
    .prepare('SELECT id FROM engagement_users WHERE verified = 1 AND unsubscribed = 0')
    .all<{ id: string }>();
  const users = usersRes.results || [];

  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const user of users) {
    try {
      const state = await computeUserState(user.id, env.DB);
      if (!state) { skipped++; continue; }
      const decision = await decideNextEmail(state, env.DB);
      if (!decision) { skipped++; continue; }
      const result = await generateAndSendEmail(env, state, decision);
      if (result.success) sent++;
      else errors.push(`User ${user.id}: ${result.error || 'unknown'}`);
    } catch (err: any) {
      errors.push(`User ${user.id}: ${err.message}`);
    }
  }

  return { scanned: users.length, sent, skipped, errors };
}
