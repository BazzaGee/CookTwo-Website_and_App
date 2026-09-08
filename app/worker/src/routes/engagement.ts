// CookTwo engagement routes — signup hook, event logging, unsubscribe, admin.
// Wire these into the main Hono app.

import type { Context } from 'hono';
import type { Env } from '../env';
import { computeUserState, decideNextEmail, generateAndSendEmail, processAllUsers, type EngineEnv } from '../lib/engagement/email-engine';

function engineEnv(c: Context<{ Bindings: Env }>): EngineEnv {
  return {
    DB: c.env.DB,
    OPENROUTER_API_KEY: (c.env as any).OPENROUTER_API_KEY,
    RESEND_API_KEY: c.env.RESEND_API_KEY,
    RESEND_FROM: c.env.RESEND_FROM,
    EMAIL_MODEL: (c.env as any).EMAIL_MODEL,
    ADMIN_SECRET: (c.env as any).ADMIN_SECRET,
    SITE_URL: c.env.SITE_URL,
    PWA_URL: c.env.PWA_URL,
  };
}

// ── POST /api/engagement/signup ───────────────────────────────
// Called by the marketing site after a waitlist subscribe. Creates a user row
// in engagement_users (if not present) and fires the welcome email.
export async function handleEngagementSignup(c: Context<{ Bindings: Env }>): Promise<Response> {
  const body = await c.req.json().catch(() => ({} as Record<string, unknown>));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email) return c.json({ error: 'email required' }, 400);

  const now = Date.now();
  const existing = await c.env.DB
    .prepare('SELECT id FROM engagement_users WHERE email = ?')
    .bind(email)
    .first<{ id: string }>();

  if (!existing) {
    const id = crypto.randomUUID();
    const unsubToken = crypto.randomUUID();
    await c.env.DB
      .prepare(
        `INSERT INTO engagement_users (id, email, verified, unsubscribed, unsub_token, ga_client_id, acquisition_source, acquisition_country, created_at, last_active_at)
         VALUES (?, ?, 0, 0, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id, email, unsubToken,
        body.ga_client_id ? String(body.ga_client_id) : null,
        body.source ? String(body.source) : null,
        body.country ? String(body.country) : null,
        now, now,
      )
      .run();
    await logEngagementEvent(c.env.DB, id, 'signup', { source: body.source || null });
  }

  // Fire welcome email asynchronously if the user is already verified.
  const user = await c.env.DB
    .prepare('SELECT id FROM engagement_users WHERE email = ? AND verified = 1')
    .bind(email)
    .first<{ id: string }>();
  if (user) {
    const state = await computeUserState(user.id, c.env.DB);
    if (state) {
      const decision = await decideNextEmail(state, c.env.DB);
      if (decision) {
        c.executionCtx.waitUntil(
          generateAndSendEmail(engineEnv(c), state, decision).catch(() => {}),
        );
      }
    }
  }

  return c.json({ status: 'ok' });
}

// ── POST /api/engagement/verify ───────────────────────────────
// Called once a waitlist email is verified. Marks verified and logs event.
export async function handleEngagementVerify(c: Context<{ Bindings: Env }>): Promise<Response> {
  const body = await c.req.json().catch(() => ({} as Record<string, unknown>));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email) return c.json({ error: 'email required' }, 400);

  const row = await c.env.DB
    .prepare('SELECT id, household_id FROM engagement_users WHERE email = ?')
    .bind(email)
    .first<{ id: string; household_id: string | null }>();

  if (row) {
    await c.env.DB
      .prepare('UPDATE engagement_users SET verified = 1, last_active_at = ? WHERE id = ?')
      .bind(Date.now(), row.id)
      .run();
    await logEngagementEvent(c.env.DB, row.id, 'email_verified', {});
  }

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

  // Immediate event-driven emails (e.g. first_meal_logged)
  const state = await computeUserState(user.id, c.env.DB);
  if (state) {
    const decision = await decideNextEmail(state, c.env.DB);
    if (decision) {
      c.executionCtx.waitUntil(
        generateAndSendEmail(engineEnv(c), state, decision).catch(() => {}),
      );
    }
  }

  return c.json({ status: 'ok' });
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
    .prepare('SELECT id, email, name, verified, unsubscribed, acquisition_source, acquisition_country, created_at, last_active_at FROM engagement_users ORDER BY created_at DESC LIMIT 100')
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
  const state = await computeUserState(userId, c.env.DB);
  if (!state) return c.json({ error: 'user not found' }, 404);
  const decision = await decideNextEmail(state, c.env.DB);
  if (!decision) return c.json({ error: 'no email due' });
  const result = await generateAndSendEmail(engineEnv(c), state, decision);
  return c.json({ decision, result });
}

async function logEngagementEvent(
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
