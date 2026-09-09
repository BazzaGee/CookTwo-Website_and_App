// CookTwo engagement routes — signup hook, event logging, unsubscribe, admin,
// and the shared helpers that connect waitlist/household flows to engagement users.

import type { Context } from 'hono';
import type { Env } from '../env';
import {
  buildEngineEnv,
  computeUserState,
  decideNextEmail,
  generateAndSendEmail,
  processAllUsers,
  ONBOARDING_SEQUENCE,
  ONBOARDING_WINDOW_DAYS,
  type EngineEnv,
} from '../lib/engagement/email-engine';

function engineEnv(c: Context<{ Bindings: Env }>): EngineEnv {
  return buildEngineEnv(c.env);
}

// ── Shared helpers (used by waitlist + household flows) ───────

export async function ensureEngagementUser(
  db: D1Database,
  opts: {
    email: string;
    waitlistId?: number | null;
    source?: string | null;
    country?: string | null;
    gaClientId?: string | null;
  },
): Promise<string> {
  const email = opts.email.trim().toLowerCase();
  const existing = await db
    .prepare('SELECT id FROM engagement_users WHERE email = ?')
    .bind(email)
    .first<{ id: string }>();
  if (existing) return existing.id;

  const id = crypto.randomUUID();
  const now = Date.now();
  await db
    .prepare(
      `INSERT INTO engagement_users
        (id, waitlist_id, email, verified, unsubscribed, unsub_token, ga_client_id,
         acquisition_source, acquisition_country, created_at, last_active_at)
       VALUES (?, ?, ?, 0, 0, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(email) DO NOTHING`,
    )
    .bind(
      id,
      opts.waitlistId ?? null,
      email,
      crypto.randomUUID(),
      opts.gaClientId ?? null,
      opts.source ?? null,
      opts.country ?? null,
      now, now,
    )
    .run();

  // Re-select to win the race when the row already existed.
  const row = await db
    .prepare('SELECT id FROM engagement_users WHERE email = ?')
    .bind(email)
    .first<{ id: string }>();
  return row!.id;
}

export async function markEngagementVerified(db: D1Database, email: string): Promise<string | null> {
  const normalized = email.trim().toLowerCase();
  const userId = await ensureEngagementUser(db, { email: normalized });
  await db
    .prepare('UPDATE engagement_users SET verified = 1, last_active_at = ? WHERE id = ?')
    .bind(Date.now(), userId)
    .run();
  await logEngagementEvent(db, userId, 'email_verified', {});
  return userId;
}

// Resolves a waitlist access token to an engagement user and attaches the
// household (called from household create/join/link).
export async function linkEngagementUserToHousehold(
  db: D1Database,
  opts: { accessToken?: string | null; householdId: string; name?: string | null },
): Promise<boolean> {
  const accessToken = (opts.accessToken || '').trim();
  if (!accessToken) return false;

  const wl = await db
    .prepare('SELECT id, email FROM waitlist WHERE access_token = ? AND verified = 1')
    .bind(accessToken)
    .first<{ id: number; email: string }>();
  if (!wl) return false;

  const userId = await ensureEngagementUser(db, { email: wl.email, waitlistId: wl.id });
  await db
    .prepare(
      `UPDATE engagement_users
       SET household_id = ?, verified = 1,
           name = COALESCE(NULLIF(name, ''), ?),
           waitlist_id = COALESCE(waitlist_id, ?)
       WHERE id = ?`,
    )
    .bind(opts.householdId, opts.name ?? null, wl.id, userId)
    .run();
  await logEngagementEvent(db, userId, 'household_linked', {
    householdId: opts.householdId,
    name: opts.name ?? null,
  });
  return true;
}

// ── POST /api/engagement/signup ───────────────────────────────
// Creates a user row in engagement_users (if not present) and fires the
// welcome email if already verified. (The waitlist subscribe flow calls
// ensureEngagementUser directly; this endpoint remains for external use.)
export async function handleEngagementSignup(c: Context<{ Bindings: Env }>): Promise<Response> {
  const body = await c.req.json().catch(() => ({} as Record<string, unknown>));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email) return c.json({ error: 'email required' }, 400);

  await ensureEngagementUser(c.env.DB, {
    email,
    source: body.source ? String(body.source) : null,
    country: body.country ? String(body.country) : null,
    gaClientId: body.ga_client_id ? String(body.ga_client_id) : null,
  });
  const signupUserId = await getUserIdByEmail(c.env.DB, email);
  if (signupUserId) {
    await logEngagementEvent(c.env.DB, signupUserId, 'signup', {
      source: body.source || null,
    });
  }

  await maybeSendNextEmail(c, email);
  return c.json({ status: 'ok' });
}

// ── POST /api/engagement/verify ───────────────────────────────
// Marks the user verified and logs the event. (The waitlist verify flow
// calls markEngagementVerified directly.)
export async function handleEngagementVerify(c: Context<{ Bindings: Env }>): Promise<Response> {
  const body = await c.req.json().catch(() => ({} as Record<string, unknown>));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email) return c.json({ error: 'email required' }, 400);

  await markEngagementVerified(c.env.DB, email);
  await maybeSendNextEmail(c, email);
  return c.json({ status: 'ok' });
}

// ── POST /api/engagement/events ───────────────────────────────
// Logs app activity per user and optionally triggers an immediate email.
export async function handleEngagementEvent(c: Context<{ Bindings: Env }>): Promise<Response> {
  const body = await c.req.json().catch(() => ({} as Record<string, unknown>));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const eventType = typeof body.eventType === 'string' ? body.eventType : '';
  const metadata = (body.metadata as Record<string, unknown>) || {};

  if (!email || !eventType) return c.json({ error: 'email and eventType required' }, 400);

  const user = await c.env.DB
    .prepare('SELECT id FROM engagement_users WHERE email = ?')
    .bind(email)
    .first<{ id: string }>();
  if (!user) return c.json({ error: 'user not found' }, 404);

  await logEngagementEvent(c.env.DB, user.id, eventType, metadata);
  await c.env.DB
    .prepare('UPDATE engagement_users SET last_active_at = ? WHERE id = ?')
    .bind(Date.now(), user.id)
    .run();

  await maybeSendNextEmail(c, email);
  return c.json({ status: 'ok' });
}

// Runs one engine decision for the user's email (used by event-driven sends).
async function maybeSendNextEmail(c: Context<{ Bindings: Env }>, email: string): Promise<void> {
  const user = await c.env.DB
    .prepare('SELECT id FROM engagement_users WHERE email = ?')
    .bind(email.trim().toLowerCase())
    .first<{ id: string }>();
  if (!user) return;
  const env = engineEnv(c);
  const state = await computeUserState(env, user.id, c.env.DB);
  if (!state) return;
  const decision = await decideNextEmail(state, c.env.DB);
  if (decision) {
    c.executionCtx.waitUntil(
      generateAndSendEmail(env, state, decision).catch(() => {}),
    );
  }
}

async function getUserIdByEmail(db: D1Database, email: string): Promise<string | null> {
  const row = await db
    .prepare('SELECT id FROM engagement_users WHERE email = ?')
    .bind(email.trim().toLowerCase())
    .first<{ id: string }>();
  return row?.id ?? null;
}

// ── GET /api/engagement/unsubscribe ───────────────────────────
export async function handleEngagementUnsubscribe(c: Context<{ Bindings: Env }>): Promise<Response> {
  const token = c.req.query('token');
  if (!token) return c.json({ error: 'missing token' }, 400);
  await c.env.DB
    .prepare('UPDATE engagement_users SET unsubscribed = 1 WHERE unsub_token = ?')
    .bind(token)
    .run();
  return new Response('You have been unsubscribed from CookTwo emails. You can keep using the app.', {
    status: 200,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}

// ── Admin ─────────────────────────────────────────────────────
function isAdmin(c: Context<{ Bindings: Env }>): boolean {
  const secret = (c.env as any).ADMIN_SECRET;
  if (!secret) return false;
  return c.req.header('X-Admin-Secret') === secret;
}

export async function handleAdminEmails(c: Context<{ Bindings: Env }>): Promise<Response> {
  if (!isAdmin(c)) return c.json({ error: 'unauthorized' }, 401);
  const res = await c.env.DB
    .prepare('SELECT id, user_id, email_type, subject, status, created_at FROM engagement_emails ORDER BY created_at DESC LIMIT 100')
    .all();
  return c.json(res.results || []);
}

export async function handleAdminEmailDetail(c: Context<{ Bindings: Env }>): Promise<Response> {
  if (!isAdmin(c)) return c.json({ error: 'unauthorized' }, 401);
  const id = c.req.param('id');
  const row = await c.env.DB
    .prepare('SELECT * FROM engagement_emails WHERE id = ?')
    .bind(id)
    .first();
  return c.json(row || { error: 'not found' }, row ? 200 : 404);
}

export async function handleAdminUsers(c: Context<{ Bindings: Env }>): Promise<Response> {
  if (!isAdmin(c)) return c.json({ error: 'unauthorized' }, 401);
  const res = await c.env.DB
    .prepare('SELECT id, email, name, verified, unsubscribed, household_id, onboarding_step, onboarding_completed_at, acquisition_source, acquisition_country, created_at, last_active_at FROM engagement_users ORDER BY created_at DESC LIMIT 100')
    .all();
  return c.json(res.results || []);
}

export async function handleAdminRunCycle(c: Context<{ Bindings: Env }>): Promise<Response> {
  if (!isAdmin(c)) return c.json({ error: 'unauthorized' }, 401);
  const result = await processAllUsers(engineEnv(c));
  return c.json(result);
}

export async function handleAdminRunCycleForUser(c: Context<{ Bindings: Env }>): Promise<Response> {
  if (!isAdmin(c)) return c.json({ error: 'unauthorized' }, 401);
  const userId = c.req.param('userId') as string;
  const env = engineEnv(c);
  const state = await computeUserState(env, userId, c.env.DB);
  if (!state) return c.json({ error: 'user not found' }, 404);
  const decision = await decideNextEmail(state, c.env.DB);
  if (!decision) return c.json({ error: 'no email due' });
  const result = await generateAndSendEmail(env, state, decision);
  return c.json({ decision, result });
}

// ── GET /api/engagement/admin/sequence/:userId ────────────────
// Dry-run preview: shows the onboarding series state, which steps are
// done/sent, and what the engine would do next (without sending).
export async function handleAdminSequencePreview(c: Context<{ Bindings: Env }>): Promise<Response> {
  if (!isAdmin(c)) return c.json({ error: 'unauthorized' }, 401);
  const userId = c.req.param('userId') as string;
  const env = engineEnv(c);
  const state = await computeUserState(env, userId, c.env.DB);
  if (!state) return c.json({ error: 'user not found' }, 404);

  const steps = ONBOARDING_SEQUENCE.map((s, i) => ({
    position: i + 1,
    type: s.type,
    dayOffset: s.dayOffset,
    done: s.doneWhen(state),
    sent: state.sentOnboardingTypes.includes(s.type),
  }));

  const onboardingActive =
    state.onboardingCompletedAt === null && state.daysSinceSignup <= ONBOARDING_WINDOW_DAYS;

  return c.json({
    email: state.email,
    name: state.name,
    daysSinceSignup: state.daysSinceSignup,
    onboarding: {
      active: onboardingActive,
      completedAt: state.onboardingCompletedAt,
      pointer: state.onboardingStep,
      lastOnboardingEmailAt: state.lastOnboardingEmailAt,
      steps,
    },
    usage: {
      partnerCount: state.partnerCount,
      groceryAdded: state.groceryAdded,
      pantryAddedPostSetup: state.pantryAddedPostSetup,
      mealGenerated: state.mealGenerated,
      mealConfirmed: state.mealConfirmed,
      recipeSaved: state.recipeSaved,
      partnersWithGoal: state.partnersWithGoal,
    },
    nextDecision: await decideNextEmail(state, c.env.DB),
  });
}

export async function logEngagementEvent(
  db: D1Database,
  userId: string,
  eventType: string,
  metadata: Record<string, unknown>,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO engagement_events (id, user_id, event_type, metadata, created_at) VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(crypto.randomUUID(), userId, eventType, JSON.stringify(metadata), Date.now())
    .run()
    .catch((err) => console.error('engagement event log failed:', err));
}
