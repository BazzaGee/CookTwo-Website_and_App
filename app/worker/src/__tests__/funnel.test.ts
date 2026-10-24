import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';
import { createTestD1 } from './helpers';
import type { Env } from '../env';
import { handleQuizSubmit } from '../routes/quiz';
import {
  cleanUrl,
  handleFunnelTrack,
  handleFunnelSummary,
  handleFunnelSessions,
  handleFunnelSessionDetail,
  handleFunnelExport,
} from '../routes/funnel';
import { handleVslToolCapture } from '../routes/vslLead';
import { handleLeadVerify } from '../routes/lead';

function buildApp(env: Partial<Env>) {
  const app = new Hono<{ Bindings: Env }>();
  const e = env as Env;
  app.post('/api/quiz/submit', (c) => handleQuizSubmit(c));
  app.post('/api/funnel/track', (c) => handleFunnelTrack(c));
  app.get('/api/admin/funnel/summary', (c) => handleFunnelSummary(c));
  app.get('/api/admin/funnel/sessions', (c) => handleFunnelSessions(c));
  app.get('/api/admin/funnel/sessions/:id', (c) => handleFunnelSessionDetail(c));
  app.get('/api/admin/funnel/export.csv', (c) => handleFunnelExport(c));
  app.post('/api/lead/vsl-tool', (c) => handleVslToolCapture(c));
  app.get('/api/lead/verify', (c) => handleLeadVerify(c));
  return { app, env: e };
}

const BASE = 'http://localhost';

function jsonReq(path: string, body: unknown): Request {
  return new Request(BASE + path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function authReq(path: string, headers: Record<string, string> = {}): Request {
  return new Request(BASE + path, { headers });
}

const uuid = () => crypto.randomUUID();

describe('funnel session helpers', () => {
  it('cleanUrl strips campaign query params (no ?e= leak)', () => {
    expect(cleanUrl('https://cooktwo.com/quiz/?e=a@b.c&utm_source=x')).toBe('https://cooktwo.com/quiz/');
    expect(cleanUrl('/video/couples?fs=abc')).toBe('https://cooktwo.com/video/couples');
    expect(cleanUrl('')).toBeNull();
  });
});

describe('POST /api/quiz/submit', () => {
  it('stores an anonymous attempt and returns a funnel-linked redirect', async () => {
    const db = createTestD1();
    const { app, env } = buildApp({ DB: db });
    const sessionId = uuid();
    const visitorId = uuid();

    const res = await app.request(jsonReq('/api/quiz/submit', {
        goal: 'lose',
        blocker: 'takeaway',
        situation: 'different-goals',
        session_id: sessionId,
        visitor_id: visitorId,
        utm: { utm_campaign: 'winback-2026-q4', utm_content: 'email-3' },
      }), undefined, env);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { redirect: string; session_id: string; attempt_id: string };
    expect(data.session_id).toBe(sessionId);

    // Redirect carries fs + q + UTMs
    expect(data.redirect).toMatch(/^\/video\/couples\?/);
    expect(data.redirect).toContain(`fs=${sessionId}`);
    expect(data.redirect).toContain(`q=${data.attempt_id}`);
    expect(data.redirect).toContain('utm_content=email-3');

    // Attempt stored, anonymous (email null)
    const attempt = await db
      .prepare('SELECT * FROM quiz_attempts WHERE id = ?')
      .bind(data.attempt_id)
      .first<{ email: string | null; goal: string; situation: string; session_id: string }>();
    expect(attempt).toBeTruthy();
    expect(attempt!.email).toBeNull();
    expect(attempt!.goal).toBe('lose');
    expect(attempt!.session_id).toBe(sessionId);

    // Session row linked
    const session = await db
      .prepare('SELECT * FROM funnel_sessions WHERE id = ?')
      .bind(sessionId)
      .first<{ visitor_id: string; quiz_attempt_id: string; entry: string; utm_campaign: string }>();
    expect(session).toBeTruthy();
    expect(session!.visitor_id).toBe(visitorId);
    expect(session!.quiz_attempt_id).toBe(data.attempt_id);
    expect(session!.entry).toBe('quiz');
    expect(session!.utm_campaign).toBe('winback-2026-q4');

    // quiz_responses must NOT be touched for anonymous runs
    const responses = await db.prepare('SELECT COUNT(*) AS n FROM quiz_responses').bind().first<{ n: number }>();
    expect(responses!.n).toBe(0);
  });

  it('mirrors into quiz_responses when a source email is present', async () => {
    const db = createTestD1();
    const { app, env } = buildApp({ DB: db });
    const sessionId = uuid();

    const res = await app.request(jsonReq('/api/quiz/submit', {
        email: 'Source@Example.com',
        goal: 'fitness',
        blocker: 'willpower',
        situation: 'same-goal',
        session_id: sessionId,
      }), undefined, env);
    expect(res.status).toBe(200);

    const row = await db
      .prepare('SELECT * FROM quiz_responses WHERE email = ?')
      .bind('source@example.com')
      .first<{ session_id: string; goal: string }>();
    expect(row).toBeTruthy();
    expect(row!.session_id).toBe(sessionId);
    expect(row!.goal).toBe('fitness');
  });

  it('rejects invalid answers', async () => {
    const db = createTestD1();
    const { app, env } = buildApp({ DB: db });
    const res = await app.request(jsonReq('/api/quiz/submit', { goal: 'nope', blocker: 'time', situation: 'solo' }), undefined, env);
    expect(res.status).toBe(400);
  });
});

describe('POST /api/funnel/track', () => {
  const basePayload = (sessionId: string) => ({
    session_id: sessionId,
    visitor_id: uuid(),
    entry: 'vsl',
    vsl_mode: 'couples',
    vsl_video: 'couples-finale',
    timezone: 'Pacific/Auckland',
    internal: false,
  });

  it('creates a session, applies rollups, and is idempotent on replay', async () => {
    const db = createTestD1();
    const { app, env } = buildApp({ DB: db });
    const sessionId = uuid();
    const now = Date.now();
    const events = [
      { id: uuid(), name: 'vsl_loaded', value: '724.3', client_ts: now },
      { id: uuid(), name: 'vsl_play', client_ts: now + 5000 },
      { id: uuid(), name: 'vsl_heartbeat', watch_ms: 15000, position_s: 15, client_ts: now + 15000 },
      { id: uuid(), name: 'vsl_offer_shown', position_s: 417, client_ts: now + 417000 },
      { id: uuid(), name: 'vsl_cta_success', client_ts: now + 430000 },
    ];
    const payload = { ...basePayload(sessionId), events };

    const res = await app.request(jsonReq('/api/funnel/track', payload), undefined, env);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { session_id: string; accepted: number };
    expect(data.session_id).toBe(sessionId);
    expect(data.accepted).toBe(5);

    const session = await db
      .prepare('SELECT * FROM funnel_sessions WHERE id = ?')
      .bind(sessionId)
      .first<Record<string, unknown>>();
    expect(session).toBeTruthy();
    expect(session!.played).toBe(1);
    expect(session!.watch_ms).toBe(15000);
    // Furthest position across the batch (heartbeat 15, offer_shown 417)
    expect(session!.max_position_s).toBe(417);
    expect(session!.video_duration_s).toBeCloseTo(724.3, 1);
    expect(session!.offer_revealed_at).toBeTruthy();
    expect(session!.offer_reveal_position_s).toBe(417);
    expect(session!.cta_success_at).toBeTruthy();
    expect(session!.vsl_mode).toBe('couples');
    expect(session!.is_internal).toBe(0);

    // Replay the same batch: events dedupe on client id, rollups unchanged.
    const res2 = await app.request(jsonReq('/api/funnel/track', payload), undefined, env);
    expect(res2.status).toBe(200);
    const count = await db
      .prepare("SELECT COUNT(*) AS n FROM funnel_events WHERE session_id = ?")
      .bind(sessionId)
      .first<{ n: number }>();
    expect(count!.n).toBe(5);
    const session2 = await db
      .prepare('SELECT watch_ms, max_position_s FROM funnel_sessions WHERE id = ?')
      .bind(sessionId)
      .first<{ watch_ms: number; max_position_s: number }>();
    expect(session2!.watch_ms).toBe(15000);
    expect(session2!.max_position_s).toBe(417);
  });

  it('rejects unknown event names but keeps valid ones', async () => {
    const db = createTestD1();
    const { app, env } = buildApp({ DB: db });
    const sessionId = uuid();
    const res = await app.request(jsonReq('/api/funnel/track', {
        ...basePayload(sessionId),
        events: [
          { id: uuid(), name: 'not_a_real_event', client_ts: Date.now() },
          { id: uuid(), name: 'vsl_pause', position_s: 30, client_ts: Date.now() },
        ],
      }), undefined, env);
    expect(res.status).toBe(200);
    const events = await db
      .prepare('SELECT event FROM funnel_events WHERE session_id = ?')
      .bind(sessionId)
      .all<{ event: string }>();
    expect(events.results.map((e) => e.event)).toEqual(['vsl_pause']);
  });
});

describe('admin funnel endpoints', () => {
  async function seedFunnel(db: ReturnType<typeof createTestD1>): Promise<string> {
    const sessionId = uuid();
    const now = Date.now();
    await db
      .prepare(
        `INSERT INTO funnel_sessions
           (id, visitor_id, entry, vsl_mode, source_email, capture_email,
            utm_campaign, utm_content, started_at, last_seen_at,
            watch_ms, max_position_s, video_duration_s, played,
            cta_success_at, created_at, updated_at)
         VALUES (?, ?, 'vsl', 'couples', 'src@example.com', 'cap@example.com',
                 'winback-2026-q4', 'email-3', ?, ?, 90000, 600, 724.3, 1, ?, ?, ?)`,
      )
      .bind(sessionId, uuid(), now, now, now, now, now)
      .run();
    await db
      .prepare(
        `INSERT INTO funnel_events (id, session_id, event, position_s, watch_ms, client_ts, created_at)
         VALUES (?, ?, 'vsl_play', 0, 0, ?, ?)`,
      )
      .bind(uuid(), sessionId, now, now)
      .run();
    await db
      .prepare(
        `INSERT INTO lead_magnets (email, magnet, vsl_video, via, verified, unsubscribed, verify_token, session_id)
         VALUES ('cap@example.com', 'kitchen-tool', 'couples-finale', 'vsl-couples', 1, 0, ?, ?)`,
      )
      .bind(uuid(), sessionId)
      .run();
    await db
      .prepare("INSERT INTO waitlist (email, verified, verified_at) VALUES ('cap@example.com', 1, datetime('now'))")
      .bind()
      .run();
    return sessionId;
  }

  it('requires the admin secret', async () => {
    const db = createTestD1();
    const { app, env } = buildApp({ DB: db, ADMIN_SECRET: 'sekret' });
    const res = await app.request('/api/admin/funnel/summary', undefined, env);
    expect(res.status).toBe(401);
  });

  it('summary reports stages, matches, and app signup', async () => {
    const db = createTestD1();
    const sessionId = await seedFunnel(db);
    const { app, env } = buildApp({ DB: db, ADMIN_SECRET: 'sekret' });

    const denied = await app.request('/api/admin/funnel/summary', undefined, env);
    expect(denied.status).toBe(401);

    const res = await app.request(
      new Request(BASE + '/api/admin/funnel/summary', { headers: { 'X-Admin-Secret': 'sekret' } }),
      undefined,
      env,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { totals: Record<string, number>; by_campaign: Array<{ key: string }> };
    expect(body.totals.sessions).toBe(1);
    expect(body.totals.vsl_played).toBe(1);
    expect(body.totals.cta_success).toBe(1);
    expect(body.totals.app_signup).toBe(1);
    expect(body.totals.email_mismatch).toBe(1);
    expect(body.by_campaign[0]!.key).toBe('winback-2026-q4');
    expect(sessionId).toBeTruthy();
  });

  it('sessions list joins quiz answers and detail returns the timeline', async () => {
    const db = createTestD1();
    const sessionId = await seedFunnel(db);
    const attemptId = uuid();
    await db
      .prepare(
        `INSERT INTO quiz_attempts (id, session_id, email, goal, blocker, situation, angle)
         VALUES (?, ?, 'cap@example.com', 'lose', 'takeaway', 'different-goals', 'couples')`,
      )
      .bind(attemptId, sessionId)
      .run();
    await db
      .prepare('UPDATE funnel_sessions SET quiz_attempt_id = ? WHERE id = ?')
      .bind(attemptId, sessionId)
      .run();

    const { app, env } = buildApp({ DB: db, ADMIN_SECRET: 'sekret' });
    const auth = { 'X-Admin-Secret': 'sekret' };

    const list = await app.request(
      new Request(BASE + '/api/admin/funnel/sessions', { headers: auth }),
      undefined,
      env,
    );
    expect(list.status).toBe(200);
    const listBody = (await list.json()) as { sessions: Array<Record<string, unknown>> };
    expect(listBody.sessions[0]!.goal).toBe('lose');
    expect(listBody.sessions[0]!.bounced).toBe(0);

    const detail = await app.request(
      new Request(BASE + `/api/admin/funnel/sessions/${sessionId}`, { headers: auth }),
      undefined,
      env,
    );
    expect(detail.status).toBe(200);
    const detailBody = (await detail.json()) as {
      session: Record<string, unknown>;
      events: Array<{ event: string }>;
      lead: { verified: number } | null;
    };
    expect(detailBody.session.id).toBe(sessionId);
    expect(detailBody.events.map((e) => e.event)).toEqual(['vsl_play']);
    expect(detailBody.lead!.verified).toBe(1);
  });

  it('CSV export has the expected header and row', async () => {
    const db = createTestD1();
    await seedFunnel(db);
    const { app, env } = buildApp({ DB: db, ADMIN_SECRET: 'sekret' });
    const res = await app.request(
      new Request(BASE + '/api/admin/funnel/export.csv', { headers: { 'X-Admin-Secret': 'sekret' } }),
      undefined,
      env,
    );
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/csv');
    const text = await res.text();
    const [header, row] = text.trim().split('\r\n');
    expect(header).toContain('session_id');
    expect(header).toContain('capture_email');
    expect(row).toContain('cap@example.com');
    expect(row).toContain('src@example.com');
  });
});

describe('POST /api/lead/vsl-tool (already-verified capture)', () => {
  it('stamps the session and links the lead row without burning a token', async () => {
    const db = createTestD1();
    const sessionId = uuid();
    const attemptId = uuid();
    await db
      .prepare(
        `INSERT INTO lead_magnets (email, magnet, vsl_video, via, verified, unsubscribed, verify_token)
         VALUES ('cap@example.com', 'kitchen-tool', 'couples-finale', 'vsl-couples', 1, 0, 'tok-1')`,
      )
      .bind()
      .run();
    await db
      .prepare(
        `INSERT INTO funnel_sessions (id, entry, quiz_attempt_id, started_at, last_seen_at, created_at, updated_at)
         VALUES (?, 'vsl', ?, ?, ?, ?, ?)`,
      )
      .bind(sessionId, attemptId, Date.now(), Date.now(), Date.now(), Date.now())
      .run();

    const { app, env } = buildApp({ DB: db });
    const res = await app.request(jsonReq('/api/lead/vsl-tool', {
        email: 'cap@example.com',
        mode: 'couples',
        session_id: sessionId,
        quiz_attempt_id: attemptId,
        source_email: 'src@example.com',
      }), undefined, env);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { status: string; toolUrl: string };
    expect(data.status).toBe('verified');
    expect(data.toolUrl).toContain(`s=${sessionId}`);

    const session = await db
      .prepare('SELECT * FROM funnel_sessions WHERE id = ?')
      .bind(sessionId)
      .first<{ capture_email: string; cta_success_at: number }>();
    expect(session!.capture_email).toBe('cap@example.com');
    expect(session!.cta_success_at).toBeTruthy();

    const lead = await db
      .prepare('SELECT * FROM lead_magnets WHERE email = ?')
      .bind('cap@example.com')
      .first<{ session_id: string; source_email: string | null; quiz_attempt_id: string }>();
    expect(lead!.session_id).toBe(sessionId);
    expect(lead!.source_email).toBe('src@example.com');
    expect(lead!.quiz_attempt_id).toBe(attemptId);
  });
});

describe('GET /api/lead/verify', () => {
  it('stamps cta_verified_at on the session via ?s=', async () => {
    const db = createTestD1();
    const sessionId = uuid();
    const token = uuid();
    const now = Date.now();
    await db
      .prepare(
        `INSERT INTO funnel_sessions (id, entry, started_at, last_seen_at, created_at, updated_at)
         VALUES (?, 'vsl', ?, ?, ?, ?)`,
      )
      .bind(sessionId, now, now, now, now)
      .run();
    await db
      .prepare(
        `INSERT INTO lead_magnets (email, magnet, vsl_video, mode, verified, unsubscribed, verify_token)
         VALUES ('cap@example.com', 'kitchen-tool', 'couples-finale', 'couples', 0, 0, ?)`,
      )
      .bind(token)
      .run();

    const { app, env } = buildApp({ DB: db, SITE_URL: 'https://cooktwo.app' });
    const res = await app.request(
      `/api/lead/verify?token=${token}&email=cap%40example.com&s=${sessionId}`,
      undefined,
      env,
    );
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain('/kitchen-tool');

    const lead = await db
      .prepare('SELECT verified FROM lead_magnets WHERE verify_token = ?')
      .bind(token)
      .first<{ verified: number }>();
    expect(lead!.verified).toBe(1);

    const session = await db
      .prepare('SELECT cta_verified_at FROM funnel_sessions WHERE id = ?')
      .bind(sessionId)
      .first<{ cta_verified_at: number | null }>();
    expect(session!.cta_verified_at).toBeTruthy();
  });
});
