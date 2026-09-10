// CookTwo engagement engine — autonomous brain.
// computeUserState → decideNextEmail → generateAndSendEmail → processAllUsers.
//
// Email flow is tiered:
//   Tier 1 — Onboarding series (welcome + 6 feature steps, adaptive skip-ahead,
//            3-day spacing). While the series is incomplete and the user is
//            inside the 35-day onboarding window, ONLY onboarding emails send;
//            lifecycle emails are suppressed.
//   Tier 2 — Lifecycle emails (celebrations, streaks, premium, tips, nudges),
//            unlocked once onboarding completes (or the window expires).
//
// Guardrails: max 1 email/user/day, no double-send windows per type,
// skip unsubscribed/unverified.

import { writeEmail, type EmailOutput, type EmailType } from './email-writer';
import { sendEngagementEmail, type SenderEnv } from './email-sender';
import { TIP_TOPICS } from './email-templates';
import type { ActivityEntry } from '../activity';

const DAY_MS = 86400000;
const TWO_DAYS_MS = DAY_MS * 2;
const THREE_DAYS_MS = DAY_MS * 3;
const SEVEN_DAYS_MS = DAY_MS * 7;

// Onboarding series pacing
const ONBOARDING_SPACING_MS = THREE_DAYS_MS;
export const ONBOARDING_WINDOW_DAYS = 35;
// Activity within this window after household creation is treated as the
// onboarding wizard's initial pantry seed, not deliberate pantry usage.
const SETUP_GRACE_MS = 60 * 60 * 1000;

// Randomized lifecycle pacing
// Tips: min 2-day gap + a daily roll. Activity-aware chance keeps tips for
// engaged users rare and uses them as gentle re-engagement for quiet users.
const TIP_MIN_GAP_MS = TWO_DAYS_MS;
const TIP_CHANCE_BASE = 30;   // ~1-2/week
const TIP_CHANCE_ACTIVE = 15; // used the app within the last day
const TIP_CHANCE_QUIET = 45;  // inactive 4+ days
const TIP_TOPIC_WEEK_MS = SEVEN_DAYS_MS;

// Feedback: eligible ~monthly + a daily roll, so asks land at varied,
// organic times instead of everyone getting one the same day.
const FEEDBACK_MIN_SIGNUP_DAYS = 21;
const FEEDBACK_MIN_GAP_MS = 30 * DAY_MS;
const FEEDBACK_DAILY_CHANCE = 25;

// Deterministic pseudo-random roll in [0, 100) keyed by e.g. `${userId}:tip:2026-09-10`.
// Same key → same result all day (cron re-runs, admin previews, tests are stable).
export function dailyRoll(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % 100;
}

function dateKeyOf(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

export function tipChance(state: UserState): number {
  if (state.daysSinceLastActive <= 1) return TIP_CHANCE_ACTIVE;
  if (state.daysSinceLastActive >= 4) return TIP_CHANCE_QUIET;
  return TIP_CHANCE_BASE;
}

// Deterministic tip topic per user-week — varies week to week and across users.
export function pickTipTopic(userId: string, now: number): (typeof TIP_TOPICS)[number] {
  const week = Math.floor(now / TIP_TOPIC_WEEK_MS);
  const idx = dailyRoll(`${userId}:tip-topic:${week}`) % TIP_TOPICS.length;
  const topic = TIP_TOPICS[idx] ?? TIP_TOPICS[0];
  if (!topic) throw new Error('TIP_TOPICS pool must not be empty');
  return topic;
}

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
  // Feature-usage signals (onboarding + lifecycle decisions)
  groceryAdded: number;
  pantryAddedPostSetup: number;
  mealGenerated: number;
  mealConfirmed: number;
  recipeSaved: number;
  partnersWithGoal: number;
  lastMealAt: number;
  householdCreatedAt: number | null;
  // Onboarding sequence state
  onboardingStep: number;
  onboardingCompletedAt: number | null;
  lastOnboardingEmailAt: number;
  sentOnboardingTypes: string[];
}

export interface EmailDecision {
  type: EmailType;
  reason: string;
  contextNote: string;
  /** Optional template variant (e.g. tip topic key) used by fallback templates */
  variant?: string;
}

export interface EngineEnv extends SenderEnv {
  DB: D1Database;
  HOUSEHOLD_SYNC: DurableObjectNamespace;
  OPENROUTER_API_KEY?: string;
  EMAIL_MODEL?: string;
  ADMIN_SECRET?: string;
  SITE_URL?: string;
  PWA_URL?: string;
}

export function buildEngineEnv(env: any): EngineEnv {
  return {
    DB: env.DB,
    HOUSEHOLD_SYNC: env.HOUSEHOLD_SYNC,
    OPENROUTER_API_KEY: env.OPENROUTER_API_KEY,
    RESEND_API_KEY: env.RESEND_API_KEY,
    RESEND_FROM: env.RESEND_FROM,
    EMAIL_MODEL: env.EMAIL_MODEL,
    ADMIN_SECRET: env.ADMIN_SECRET,
    SITE_URL: env.SITE_URL,
    PWA_URL: env.PWA_URL,
  };
}

// ──────────────────────────────────────────────────────────────
// Onboarding sequence definition
// ──────────────────────────────────────────────────────────────

export interface OnboardingStep {
  type: EmailType;
  /** Nominal schedule day (docs/preview only; real pacing = spacing since last onboarding email) */
  dayOffset: number;
  /** Brief for the AI writer (and fallback understanding) */
  brief: string;
  /** Usage signal meaning the user has already done this step — email is skipped */
  doneWhen: (s: UserState) => boolean;
}

export const ONBOARDING_SEQUENCE: OnboardingStep[] = [
  {
    type: 'welcome',
    dayOffset: 0,
    brief:
      'Welcome email — the first of a short guided series. Tell the story of WHY CookTwo was built (cooking for two is hard: different goals, different appetites, dinner friction). Explain in one breath how it works: one shared grocery list and pantry, and one recipe plated two ways. Set the expectation that a few short emails will follow, one small thing at a time. CTA: open the app and finish setup (about 2 minutes).',
    doneWhen: () => false,
  },
  {
    type: 'onboarding_partner',
    dayOffset: 3,
    brief:
      'Step 1 of the series: invite the partner. Explain the 6-digit invite code (in the app settings) and that the list, pantry and meal plans sync live between them once both are in. Reassure solo users it works fine alone too. CTA: open the app and share the invite code.',
    doneWhen: (s) => s.hasPartner,
  },
  {
    type: 'onboarding_shopping_list',
    dayOffset: 6,
    brief:
      'Step 2: the shared shopping list. Teach typing items like a text ("milk, eggs, 2 bread"), automatic aisle sorting, live sync between partners, checking things off at the store, and that "Done Shopping" moves everything into the pantry automatically. CTA: add tonight\'s ingredients to the list.',
    doneWhen: (s) => s.groceryAdded > 0,
  },
  {
    type: 'onboarding_pantry',
    dayOffset: 9,
    brief:
      'Step 3: the pantry ("Our kitchen"). Teach typing what\'s in the kitchen in plain English — the AI organizes it — and that Done Shopping keeps it topped up automatically. Frame it as 2 minutes today that fuel the next step. CTA: add a few real items to the pantry.',
    doneWhen: (s) => s.pantryAddedPostSetup > 0,
  },
  {
    type: 'onboarding_ai_meals',
    dayOffset: 12,
    brief:
      'Step 4: the payoff — asking "What should we cook?". Explain the two modes: "Cook with what we have" (uses only the pantry, nothing wasted) and "Suggest a meal — I\'ll shop" (missing items go straight to the shared list). Mention it respects both diets and allergies. CTA: ask the app what to cook tonight.',
    doneWhen: (s) => s.mealGenerated > 0,
  },
  {
    type: 'onboarding_two_plates',
    dayOffset: 15,
    brief:
      'Step 5: one prep, two plates — the feature no other app has. Same dinner, each plate portioned for that person\'s calories and goal, from the same pan. Encourage both partners to set a goal (and optional body metrics) in Profiles — under a minute each. CTA: set your goal in Profiles.',
    doneWhen: (s) =>
      s.mealConfirmed > 0 && s.partnerCount >= 1 && s.partnersWithGoal >= Math.min(s.partnerCount, 2),
  },
  {
    type: 'onboarding_habit_loop',
    dayOffset: 18,
    brief:
      'Step 6 (final): the habit loop. After cooking, tap "We cooked it": ingredients leave the pantry automatically, the recipe saves itself, and future suggestions get smarter. Frame it as the one small habit that makes the whole system run itself. Close the series warmly. CTA: cook tonight and confirm it.',
    doneWhen: (s) => s.mealConfirmed > 0 && s.recipeSaved > 0,
  },
];

const ONBOARDING_EMAIL_PREFIX = 'onboarding_';

function isOnboardingType(type: string): boolean {
  // 'app_onboarding' is the deprecated pre-sequence type — treat it as part
  // of the series so legacy sends count toward onboarding progress.
  return type === 'welcome' || type === 'app_onboarding' || type.startsWith(ONBOARDING_EMAIL_PREFIX);
}

// ──────────────────────────────────────────────────────────────
// 1. Compute user state from D1 + HouseholdSync DO
// ──────────────────────────────────────────────────────────────

async function getDoActivity(env: EngineEnv, householdId: string): Promise<ActivityEntry[]> {
  try {
    const stub = env.HOUSEHOLD_SYNC.get(env.HOUSEHOLD_SYNC.idFromName(householdId));
    const res = await stub.fetch('https://do/activity?limit=200');
    if (!res.ok) return [];
    return (await res.json()) as ActivityEntry[];
  } catch (err: any) {
    console.error('Engagement engine: DO activity fetch failed:', err?.message);
    return [];
  }
}

export async function computeUserState(
  env: EngineEnv,
  userId: string,
  db: D1Database,
): Promise<UserState | null> {
  const user = await db
    .prepare('SELECT * FROM engagement_users WHERE id = ?')
    .bind(userId)
    .first<{
      id: string; email: string; name: string | null; verified: number;
      unsubscribed: number; created_at: number; last_active_at: number;
      household_id: string | null; acquisition_source: string | null;
      acquisition_country: string | null;
      onboarding_step: number; onboarding_completed_at: number | null;
    }>();
  if (!user) return null;

  const now = Date.now();
  const householdId = user.household_id;

  // Sent email history — recent (all types) + onboarding progress
  const sentRes = await db
    .prepare(
      `SELECT email_type, created_at FROM engagement_emails
       WHERE user_id = ? AND status != 'failed'
       ORDER BY created_at DESC LIMIT 50`,
    )
    .bind(userId)
    .all<{ email_type: string; created_at: number }>();
  const sent = sentRes.results || [];

  const sentOnboardingTypes = sent.map((e) => e.email_type).filter(isOnboardingType);
  const lastOnboardingEmailAt = sentOnboardingTypes.length > 0
    ? Math.max(
        ...sent
          .filter((e) => isOnboardingType(e.email_type))
          .map((e) => e.created_at),
      )
    : 0;

  // Household-derived signals
  let totalActions = 0;
  let groceryAdded = 0;
  let pantryAddedPostSetup = 0;
  let mealGenerated = 0;
  let mealConfirmed = 0;
  let recipeSaved = 0;
  let lastActionAt = user.last_active_at;
  let lastMealAt = 0;
  let mealsLast7Days = 0;
  let householdCreatedAt: number | null = null;
  let partnerCount = 0;
  let partnersWithGoal = 0;
  let planLabel: string | null = null;

  if (householdId) {
    const hh = await db
      .prepare('SELECT created_at FROM households WHERE id = ?')
      .bind(householdId)
      .first<{ created_at: number }>();
    householdCreatedAt = hh?.created_at ?? null;

    const partRes = await db
      .prepare(
        `SELECT COUNT(*) as c,
                SUM(CASE WHEN goal IS NOT NULL AND goal != '' THEN 1 ELSE 0 END) as with_goal
         FROM partners WHERE household_id = ?`,
      )
      .bind(householdId)
      .first<{ c: number; with_goal: number | null }>();
    partnerCount = partRes?.c ?? 0;
    partnersWithGoal = partRes?.with_goal ?? 0;

    const sub = await db
      .prepare('SELECT plan FROM household_subscriptions WHERE household_id = ? LIMIT 1')
      .bind(householdId)
      .first<{ plan: string }>();
    planLabel = sub?.plan ?? null;

    // Merge D1 activity (meals/recipes/profiles/household) with DO activity
    // (grocery/pantry events live in the HouseholdSync DO).
    const actRes = await db
      .prepare('SELECT action_type, created_at FROM activity_log WHERE household_id = ?')
      .bind(householdId)
      .all<{ action_type: string; created_at: number }>();
    const d1Actions = (actRes.results || []).map((a) => ({
      actionType: a.action_type,
      createdAt: a.created_at,
    }));
    const doActions = (await getDoActivity(env, householdId)).map((e) => ({
      actionType: e.actionType,
      createdAt: e.createdAt,
    }));
    const actions = [...d1Actions, ...doActions];

    const setupCutoff = (householdCreatedAt ?? 0) + SETUP_GRACE_MS;

    totalActions = actions.length;
    for (const a of actions) {
      if (a.createdAt > lastActionAt) lastActionAt = a.createdAt;
      const t = a.actionType;
      if (t === 'item_added' || t === 'items_added') groceryAdded++;
      else if (t === 'pantry_added' || t === 'items_moved_to_pantry') {
        if (a.createdAt > setupCutoff) pantryAddedPostSetup++;
      } else if (t === 'meal_generated' || t === 'week_plan_generated') mealGenerated++;
      else if (t === 'meal_confirmed') mealConfirmed++;
      else if (t === 'recipe_saved') recipeSaved++;

      if (t === 'meal_generated' || t === 'meal_confirmed' || t === 'week_plan_generated') {
        if (a.createdAt > lastMealAt) lastMealAt = a.createdAt;
        if (now - a.createdAt < SEVEN_DAYS_MS) mealsLast7Days++;
      }
    }
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
    totalMeals: mealGenerated + mealConfirmed,
    mealsLast7Days,
    partnerCount,
    planLabel,
    acquisitionSource: user.acquisition_source,
    acquisitionCountry: user.acquisition_country,
    hasHousehold: !!householdId,
    hasPartner: partnerCount >= 2,
    hasMeals: mealGenerated + mealConfirmed > 0,
    groceryAdded,
    pantryAddedPostSetup,
    mealGenerated,
    mealConfirmed,
    recipeSaved,
    partnersWithGoal,
    lastMealAt,
    householdCreatedAt,
    onboardingStep: user.onboarding_step ?? 0,
    onboardingCompletedAt: user.onboarding_completed_at ?? null,
    lastOnboardingEmailAt,
    sentOnboardingTypes,
  };
}

// ──────────────────────────────────────────────────────────────
// 2. Decide which email (if any) is due
// ──────────────────────────────────────────────────────────────

async function markGraduated(db: D1Database, userId: string, now: number): Promise<void> {
  await db
    .prepare('UPDATE engagement_users SET onboarding_completed_at = ? WHERE id = ? AND onboarding_completed_at IS NULL')
    .bind(now, userId)
    .run();
}

async function markStep(db: D1Database, userId: string, step: number): Promise<void> {
  await db
    .prepare('UPDATE engagement_users SET onboarding_step = ? WHERE id = ?')
    .bind(step, userId)
    .run();
}

function onboardingContextNote(step: OnboardingStep, state: UserState): string {
  const position = ONBOARDING_SEQUENCE.findIndex((s) => s.type === step.type) + 1;
  const facts = [
    state.name ? `Name: ${state.name}.` : '',
    `Day ${state.daysSinceSignup} since signup.`,
    state.hasPartner
      ? 'Partner has joined the kitchen.'
      : `Partner has NOT joined yet (${state.partnerCount} partner so far).`,
    `Grocery items/events added: ${state.groceryAdded}.`,
    `Pantry items added since setup: ${state.pantryAddedPostSetup}.`,
    `Meals generated: ${state.mealGenerated}; meals confirmed cooked: ${state.mealConfirmed}; recipes saved: ${state.recipeSaved}.`,
  ]
    .filter(Boolean)
    .join(' ');
  return `[Onboarding series — step ${position} of ${ONBOARDING_SEQUENCE.length}] ${step.brief} Known user state: ${facts}`;
}

async function decideOnboarding(
  state: UserState,
  db: D1Database,
  now: number,
): Promise<EmailDecision | null> {
  // Reconcile the pointer with what was actually sent (protects users who
  // received the old welcome or earlier steps before this engine existed).
  let stepIndex = state.onboardingStep;
  for (const t of state.sentOnboardingTypes) {
    // Legacy 'app_onboarding' maps to the first series step.
    const idx = t === 'app_onboarding'
      ? 0
      : ONBOARDING_SEQUENCE.findIndex((s) => s.type === t);
    if (idx !== -1 && idx + 1 > stepIndex) stepIndex = idx + 1;
  }

  // Skip-ahead: walk past steps the user has already completed.
  while (stepIndex < ONBOARDING_SEQUENCE.length) {
    const next = ONBOARDING_SEQUENCE[stepIndex];
    if (!next || !next.doneWhen(state)) break;
    stepIndex++;
  }

  if (stepIndex !== state.onboardingStep) {
    await markStep(db, state.userId, stepIndex);
  }

  // Early graduation — they completed the full core loop on their own.
  if (state.mealGenerated > 0 && state.mealConfirmed > 0 && state.recipeSaved > 0) {
    await markGraduated(db, state.userId, now);
    return null;
  }

  // Sequence exhausted — graduate silently.
  if (stepIndex >= ONBOARDING_SEQUENCE.length) {
    await markGraduated(db, state.userId, now);
    return null;
  }

  const step = ONBOARDING_SEQUENCE[stepIndex];
  if (!step) return null;

  // Welcome (step 0) goes out immediately — reaching this branch means the
  // reconciliation above found no welcome in the send history.
  if (stepIndex === 0) {
    return {
      type: step.type,
      reason: 'Onboarding step 1: welcome',
      contextNote: onboardingContextNote(step, state),
    };
  }

  // Spacing: 3 days since the last onboarding email (global 1/day is enforced upstream).
  if (state.lastOnboardingEmailAt && now - state.lastOnboardingEmailAt < ONBOARDING_SPACING_MS) {
    return null;
  }

  const position = stepIndex + 1;
  return {
    type: step.type,
    reason: `Onboarding step ${position}/${ONBOARDING_SEQUENCE.length} due`,
    contextNote: onboardingContextNote(step, state),
  };
}

function decideLifecycle(
  state: UserState,
  recent: Array<{ email_type: string; created_at: number }>,
  now: number,
  roll: (key: string) => number,
): EmailDecision | null {
  const wasRecentlySent = (types: string[], withinMs: number) =>
    recent.some((e) => types.includes(e.email_type) && now - e.created_at < withinMs);
  const lastSentOfType = (type: string): number =>
    recent.find((e) => e.email_type === type)?.created_at ?? 0;
  const dateKey = dateKeyOf(now);

  // 1. Partner invite — household exists, only one partner
  if (
    state.hasHousehold && !state.hasPartner && state.daysSinceSignup >= 3 &&
    !wasRecentlySent(['partner_invite', 'onboarding_partner'], THREE_DAYS_MS)
  ) {
    return {
      type: 'partner_invite',
      reason: 'Partner not yet joined (post-onboarding)',
      contextNote: `User's household has ${state.partnerCount} partner(s). Encourage them to share their invite code so their partner can join — mention that everything syncs live once both are in.`,
    };
  }

  // 2. First meal logged — celebrate, but only while it's fresh
  if (
    state.totalMeals === 1 && now - state.lastMealAt < THREE_DAYS_MS &&
    !wasRecentlySent(['first_meal_logged'], TWO_DAYS_MS)
  ) {
    return {
      type: 'first_meal_logged',
      reason: 'First meal logged recently — celebrate + suggest next',
      contextNote: `User just logged their first meal. Celebrate and encourage a second.`,
    };
  }

  // 3. Meal streak — 3+ meals in last 7 days
  if (state.mealsLast7Days >= 3 && !wasRecentlySent(['meal_streak'], SEVEN_DAYS_MS)) {
    return {
      type: 'meal_streak',
      reason: `${state.mealsLast7Days} meals in last 7 days — streak`,
      contextNote: `User logged ${state.mealsLast7Days} meals in the last 7 days. Encourage weekly meal planning.`,
    };
  }

  // 4. Premium pitch — power usage without premium
  if (
    state.totalMeals >= 10 && !state.planLabel &&
    !wasRecentlySent(['premium_pitch'], SEVEN_DAYS_MS)
  ) {
    return {
      type: 'premium_pitch',
      reason: 'Power usage without premium',
      contextNote: `User has ${state.totalMeals} meals logged but is on the free plan. Mention Premium (70 AI requests/day, $4.99).`,
    };
  }

  // 5. Inactivity nudge — had activity before, 7+ days inactive
  if (
    state.totalActions > 0 && state.daysSinceLastActive >= 7 &&
    !wasRecentlySent(['inactivity_nudge'], SEVEN_DAYS_MS)
  ) {
    return {
      type: 'inactivity_nudge',
      reason: `${state.daysSinceLastActive} days inactive (had ${state.totalActions} actions)`,
      contextNote: `User was active but hasn't used CookTwo in ${state.daysSinceLastActive} days. Warm re-engagement.`,
    };
  }

  // 6. Feedback request — early-development feedback ask. Roughly monthly per
  //    user, staggered by a daily roll so sends land at varied, organic times.
  if (
    state.daysSinceSignup >= FEEDBACK_MIN_SIGNUP_DAYS &&
    now - lastSentOfType('feedback_request') >= FEEDBACK_MIN_GAP_MS &&
    roll(`${state.userId}:feedback:${dateKey}`) < FEEDBACK_DAILY_CHANCE
  ) {
    return {
      type: 'feedback_request',
      reason: 'Feedback ask due (randomized, ~monthly)',
      contextNote: `Ask for feedback on CookTwo. Be honest that the app is in early development — not the final product — and that you are actively improving it. Invite feedback of any size (confusing parts, missing features, bugs, ideas) and emphasise it directly shapes what gets built, making the app better for them. Make replying feel zero-effort: "just hit reply" (replies come straight to the team at Krystle@CookTwo.com). Also mention the contact form at https://cooktwo.com/contact (pick "App Feedback"). Warm, founder-to-user tone; no begging, no bribery.`,
    };
  }

  // 7. App tips — randomized, low-frequency, activity-aware. Min 2-day gap,
  //    then a daily roll: ~30%/day baseline, rarer for users active today,
  //    more frequent for quiet users (gentle re-engagement, not spam).
  const lastTipAt = lastSentOfType('app_tip');
  if (
    state.daysSinceSignup >= 3 &&
    now - lastTipAt >= TIP_MIN_GAP_MS &&
    roll(`${state.userId}:tip:${dateKey}`) < tipChance(state)
  ) {
    const topic = pickTipTopic(state.userId, now);
    return {
      type: 'app_tip',
      variant: topic.key,
      reason: `Tip roll passed (${topic.key})`,
      contextNote: `[Tip email — topic: ${topic.key}] ${topic.brief} Cover ONLY this one small thing — name the exact tab and what to do. Two to four sentences plus the CTA. Frame it as "one small thing".`,
    };
  }

  return null;
}

export async function decideNextEmail(
  state: UserState,
  db: D1Database,
  now: number = Date.now(),
  roll: (key: string) => number = dailyRoll,
): Promise<EmailDecision | null> {
  if (state.unsubscribed || !state.verified) return null;

  const recentRes = await db
    .prepare(
      `SELECT email_type, created_at FROM engagement_emails
       WHERE user_id = ? AND status != 'failed'
       ORDER BY created_at DESC LIMIT 20`,
    )
    .bind(state.userId)
    .all<{ email_type: string; created_at: number }>();
  const recent = recentRes.results || [];

  const lastSent = recent.length > 0 ? (recent[0] as { created_at: number }).created_at : 0;
  const hoursSinceLastEmail = (now - lastSent) / (1000 * 60 * 60);

  // Guardrail: max 1 email per day
  if (hoursSinceLastEmail < 24) return null;

  const onboardingActive =
    state.onboardingCompletedAt === null && state.daysSinceSignup <= ONBOARDING_WINDOW_DAYS;

  if (onboardingActive) {
    // TIER 1: onboarding only — lifecycle emails are suppressed.
    return decideOnboarding(state, db, now);
  }

  if (state.onboardingCompletedAt === null) {
    // Onboarding window expired without completion — graduate and pick up
    // lifecycle emails on the next cycle.
    await markGraduated(db, state.userId, now);
    return null;
  }

  // TIER 2: lifecycle emails.
  return decideLifecycle(state, recent, now, roll);
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
    groceryAdded: state.groceryAdded,
    pantryAddedPostSetup: state.pantryAddedPostSetup,
    mealConfirmed: state.mealConfirmed,
    recipeSaved: state.recipeSaved,
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
    decision.variant,
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

// Randomness snapshot for admin preview — shows today's tip/feedback rolls
// and whether each is eligible, without sending anything.
export async function getRandomnessSnapshot(
  state: UserState,
  db: D1Database,
): Promise<{
  dateKey: string;
  tip: { chance: number; roll: number; willSendToday: boolean; lastTipAt: number; daysSinceLastTip: number | null };
  feedback: { chance: number; roll: number; eligible: boolean; willSendToday: boolean; lastFeedbackAt: number; daysSinceLastFeedback: number | null };
}> {
  const now = Date.now();
  const dateKey = dateKeyOf(now);

  const res = await db
    .prepare(
      `SELECT email_type, created_at FROM engagement_emails
       WHERE user_id = ? AND email_type IN ('app_tip', 'feedback_request') AND status != 'failed'
       ORDER BY created_at DESC`,
    )
    .bind(state.userId)
    .all<{ email_type: string; created_at: number }>();
  const rows = res.results || [];
  const lastTipAt = rows.find((r) => r.email_type === 'app_tip')?.created_at ?? 0;
  const lastFeedbackAt = rows.find((r) => r.email_type === 'feedback_request')?.created_at ?? 0;

  const tipRoll = dailyRoll(`${state.userId}:tip:${dateKey}`);
  const tipChanceValue = tipChance(state);
  const tipGapOk = now - lastTipAt >= TIP_MIN_GAP_MS;
  const feedbackRoll = dailyRoll(`${state.userId}:feedback:${dateKey}`);
  const feedbackEligible =
    state.daysSinceSignup >= FEEDBACK_MIN_SIGNUP_DAYS &&
    now - lastFeedbackAt >= FEEDBACK_MIN_GAP_MS;

  return {
    dateKey,
    tip: {
      chance: tipChanceValue,
      roll: tipRoll,
      willSendToday: tipGapOk && tipRoll < tipChanceValue,
      lastTipAt,
      daysSinceLastTip: lastTipAt ? Math.floor((now - lastTipAt) / DAY_MS) : null,
    },
    feedback: {
      chance: FEEDBACK_DAILY_CHANCE,
      roll: feedbackRoll,
      eligible: feedbackEligible,
      willSendToday: feedbackEligible && feedbackRoll < FEEDBACK_DAILY_CHANCE,
      lastFeedbackAt,
      daysSinceLastFeedback: lastFeedbackAt ? Math.floor((now - lastFeedbackAt) / DAY_MS) : null,
    },
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
      const state = await computeUserState(env, user.id, env.DB);
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
