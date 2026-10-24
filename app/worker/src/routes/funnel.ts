import type { Context } from 'hono';
import type { Env } from '../env';

/**
 * Funnel tracking — the session spine that joins campaign source → quiz →
 * VSL behaviour → CTA email → verification.
 *
 * POST /api/funnel/track
 *   body: {
 *     session_id, visitor_id, entry, vsl_mode, vsl_video, quiz_attempt_id,
 *     source_email, capture_email, landing_path, referrer, utm: {...},
 *     timezone, country?, device?, user_agent?, internal?, video_duration_s,
 *     events: [{ id, name, position_s, watch_ms, value, meta, client_ts }]
 *   }
 *
 * Design notes:
 *   - One session row per browser journey. Quiz submit and VSL heartbeat can
 *     both create it; first-touch fields (source_email, utm_*, referrer)
 *     win, last-write fields (vsl_mode, capture_email) overwrite.
 *   - Event `id` is a client UUID — INSERT OR IGNORE makes beacon retries
 *     idempotent. Counters are therefore never incremented in SQL; the admin
 *     API derives them from funnel_events.
 *   - Session rollups only use MAX/COALESCE so a replayed batch can never
 *     inflate watch time, position, or timestamps.
 *   - IP is never stored; country arrives as a header the Pages proxy sets.
 */

const ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_UTM = 200;
const MAX_EVENTS = 50;
const MAX_META = 500;
const MAX_VALUE = 100;
const MAX_FIELD = 300;
const ALLOWED_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'via'];

export const ALLOWED_EVENTS = [
  'session_start',
  'page_exit',
  'visibility',
  'quiz_answer',
  'quiz_submit',
  'vsl_loaded',
  'vsl_countdown_start',
  'vsl_autoplay_blocked',
  'vsl_play',
  'vsl_pause',
  'vsl_seek_blocked',
  'vsl_heartbeat',
  'vsl_offer_shown',
  'vsl_cta_focus',
  'vsl_cta_submit',
  'vsl_cta_error',
  'vsl_cta_success',
  'vsl_complete',
  'vsl_exit',
] as const;
const ALLOWED_SET = new Set<string>(ALLOWED_EVENTS);

function s(v: unknown, max = MAX_FIELD): string {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

export function id(v: unknown): string | null {
  const raw = s(v, 64);
  return ID_RE.test(raw) ? raw : null;
}

function email(v: unknown): string | null {
  const raw = s(v, 320).toLowerCase();
  return raw && EMAIL_RE.test(raw) ? raw : null;
}

function num(v: unknown): number | null {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function clampTs(v: unknown): number {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  const now = Date.now();
  const day = 48 * 60 * 60 * 1000;
  if (Number.isFinite(n) && Math.abs(n - now) < day) return Math.round(n);
  return now;
}

function deviceOf(ua: string): string | null {
  if (!ua) return null;
  if (/ipad|tablet|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobi|iphone|android.+mobile|windows phone/i.test(ua)) return 'mobile';
  if (/android/i.test(ua)) return 'tablet';
  return 'desktop';
}

/**
 * Referrers and landing paths are stored without their query string: a
 * campaign link carries ?e=<email> and must never leak into stored URLs.
 */
export function cleanUrl(v: unknown): string | null {
  const raw = s(v, 500);
  if (!raw) return null;
  try {
    const u = new URL(raw, 'https://cooktwo.com');
    return `${u.origin}${u.pathname}`;
  } catch {
    const noQuery = raw.split('?')[0] ?? raw;
    const noHash = noQuery.split('#')[0] ?? '';
    return noHash.slice(0, 500) || null;
  }
}

function internalFlag(v: unknown): number {
  return v === true || v === 1 || v === '1' || v === 'true' ? 1 : 0;
}

export interface SessionPayload {
  sessionId: string;
  visitorId: string | null;
  entry: 'quiz' | 'vsl';
  vslMode: string | null;
  vslVideo: string | null;
  quizAttemptId: string | null;
  sourceEmail: string | null;
  captureEmail: string | null;
  landingPath: string | null;
  referrer: string | null;
  utm: Record<string, string>;
  timezone: string | null;
  country: string | null;
  device: string | null;
  userAgent: string | null;
  isInternal: number;
  lastSeenAt: number;
}

/**
 * Insert-or-extend a funnel session. Used by the track endpoint, the quiz
 * submit, and the VSL capture so all three can bootstrap the same row.
 * First-touch attribution keeps the first non-null value it saw.
 */
export async function upsertFunnelSession(db: D1Database, p: SessionPayload): Promise<void> {
  const now = Date.now();
  const utm = p.utm || {};
  await db
    .prepare(
      `INSERT INTO funnel_sessions (
         id, visitor_id, entry, vsl_mode, vsl_video, quiz_attempt_id,
         source_email, capture_email, landing_path, referrer,
         utm_source, utm_medium, utm_campaign, utm_content, via,
         timezone, country, device, user_agent, is_internal,
         started_at, last_seen_at, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         visitor_id = COALESCE(funnel_sessions.visitor_id, excluded.visitor_id),
         vsl_mode = COALESCE(excluded.vsl_mode, funnel_sessions.vsl_mode),
         vsl_video = COALESCE(excluded.vsl_video, funnel_sessions.vsl_video),
         quiz_attempt_id = COALESCE(excluded.quiz_attempt_id, funnel_sessions.quiz_attempt_id),
         source_email = COALESCE(funnel_sessions.source_email, excluded.source_email),
         capture_email = COALESCE(excluded.capture_email, funnel_sessions.capture_email),
         landing_path = COALESCE(funnel_sessions.landing_path, excluded.landing_path),
         referrer = COALESCE(funnel_sessions.referrer, excluded.referrer),
         utm_source = COALESCE(funnel_sessions.utm_source, excluded.utm_source),
         utm_medium = COALESCE(funnel_sessions.utm_medium, excluded.utm_medium),
         utm_campaign = COALESCE(funnel_sessions.utm_campaign, excluded.utm_campaign),
         utm_content = COALESCE(funnel_sessions.utm_content, excluded.utm_content),
         via = COALESCE(funnel_sessions.via, excluded.via),
         timezone = COALESCE(funnel_sessions.timezone, excluded.timezone),
         country = COALESCE(funnel_sessions.country, excluded.country),
         device = COALESCE(funnel_sessions.device, excluded.device),
         user_agent = COALESCE(funnel_sessions.user_agent, excluded.user_agent),
         is_internal = MAX(funnel_sessions.is_internal, excluded.is_internal),
         last_seen_at = MAX(funnel_sessions.last_seen_at, excluded.last_seen_at),
         updated_at = excluded.updated_at`,
    )
    .bind(
      p.sessionId,
      p.visitorId,
      p.entry,
      p.vslMode,
      p.vslVideo,
      p.quizAttemptId,
      p.sourceEmail,
      p.captureEmail,
      p.landingPath,
      p.referrer,
      utm.utm_source ?? null,
      utm.utm_medium ?? null,
      utm.utm_campaign ?? null,
      utm.utm_content ?? null,
      utm.via ?? null,
      p.timezone,
      p.country,
      p.device,
      p.userAgent,
      p.isInternal,
      p.lastSeenAt,
      p.lastSeenAt,
      now,
      now,
    )
    .run();
}

export interface RollupPatch {
  watchMs?: number;
  maxPositionS?: number;
  videoDurationS?: number | null;
  played?: 1;
  completed?: 1;
  quizCompletedAt?: number | null;
  offerRevealedAt?: number | null;
  offerRevealPositionS?: number | null;
  ctaSuccessAt?: number | null;
  ctaVerifiedAt?: number | null;
  endedAt?: number | null;
  wallMs?: number;
  lastSeenAt: number;
}

/** MAX/COALESCE-only session rollups — safe against replayed batches. */
export async function rollupFunnelSession(db: D1Database, sessionId: string, r: RollupPatch): Promise<void> {
  const now = Date.now();
  await db
    .prepare(
      `UPDATE funnel_sessions SET
         watch_ms = MAX(watch_ms, COALESCE(?, 0)),
         max_position_s = MAX(max_position_s, COALESCE(?, 0)),
         video_duration_s = COALESCE(?, video_duration_s),
         played = MAX(played, COALESCE(?, 0)),
         completed = MAX(completed, COALESCE(?, 0)),
         quiz_completed_at = COALESCE(?, quiz_completed_at),
         offer_revealed_at = COALESCE(?, offer_revealed_at),
         offer_reveal_position_s = COALESCE(?, offer_reveal_position_s),
         cta_success_at = COALESCE(?, cta_success_at),
         cta_verified_at = COALESCE(?, cta_verified_at),
         ended_at = COALESCE(?, ended_at),
         wall_ms = MAX(wall_ms, COALESCE(?, 0)),
         last_seen_at = MAX(last_seen_at, ?),
         updated_at = ?
       WHERE id = ?`,
    )
    .bind(
      r.watchMs ?? null,
      r.maxPositionS ?? null,
      r.videoDurationS ?? null,
      r.played ?? null,
      r.completed ?? null,
      r.quizCompletedAt ?? null,
      r.offerRevealedAt ?? null,
      r.offerRevealPositionS ?? null,
      r.ctaSuccessAt ?? null,
      r.ctaVerifiedAt ?? null,
      r.endedAt ?? null,
      r.wallMs ?? null,
      r.lastSeenAt,
      now,
      sessionId,
    )
    .run();
}

interface TrackEvent {
  id: string;
  name: string;
  position_s: number | null;
  watch_ms: number | null;
  value: string | null;
  meta: string | null;
  client_ts: number;
}

function parseEvents(raw: unknown): TrackEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: TrackEvent[] = [];
  for (const item of raw.slice(0, MAX_EVENTS)) {
    if (!item || typeof item !== 'object') continue;
    const e = item as Record<string, unknown>;
    const name = s(e.name, 40);
    if (!ALLOWED_SET.has(name)) continue;
    out.push({
      id: id(e.id) || crypto.randomUUID(),
      name,
      position_s: num(e.position_s),
      watch_ms: num(e.watch_ms),
      value: s(e.value, MAX_VALUE) || null,
      meta: (() => {
        if (typeof e.meta !== 'object' || e.meta === null) return null;
        try {
          const json = JSON.stringify(e.meta).slice(0, MAX_META);
          return json === '{}' ? null : json;
        } catch {
          return null;
        }
      })(),
      client_ts: clampTs(e.client_ts),
    });
  }
  return out;
}

export async function handleFunnelTrack(c: Context<{ Bindings: Env }>): Promise<Response> {
  const raw = await c.req.text();
  let body: Record<string, unknown> = {};
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return c.json({ error: 'Invalid JSON body.' }, 400);
  }

  const sessionId = id(body.session_id) || crypto.randomUUID();
  const visitorId = id(body.visitor_id);
  const entry = body.entry === 'vsl' ? 'vsl' : 'quiz';
  const vslMode = body.vsl_mode === 'solo' ? 'solo' : body.vsl_mode === 'couples' ? 'couples' : null;
  const vslVideo = body.vsl_video === 'solo-finale' || body.vsl_video === 'couples-finale' ? body.vsl_video : null;
  const quizAttemptId = id(body.quiz_attempt_id);

  const utm: Record<string, string> = {};
  const incoming = body.utm && typeof body.utm === 'object' ? (body.utm as Record<string, unknown>) : {};
  for (const k of ALLOWED_PARAMS) {
    const v = s(incoming[k]);
    if (v) utm[k] = v;
  }

  const events = parseEvents(body.events);
  const ua = s(body.user_agent, 300);
  const country = s(c.req.header('x-funnel-country') || body.country, 8) || null;

  // If this batch contains no session-level payload at all and no events,
  // it's a stray beacon — don't create an empty session row for it.
  if (events.length === 0 && !visitorId && !vslMode && !quizAttemptId && !email(body.source_email)) {
    return c.json({ status: 'ok', session_id: sessionId, accepted: 0 });
  }

  try {
    const lastSeen = events.reduce((max, e) => Math.max(max, e.client_ts), 0) || Date.now();

    await upsertFunnelSession(c.env.DB, {
      sessionId,
      visitorId,
      entry,
      vslMode,
      vslVideo,
      quizAttemptId,
      sourceEmail: email(body.source_email),
      captureEmail: email(body.capture_email),
      landingPath: cleanUrl(body.landing_path),
      referrer: cleanUrl(body.referrer),
      utm,
      timezone: s(body.timezone, 60) || null,
      country,
      device: deviceOf(ua),
      userAgent: ua || null,
      isInternal: internalFlag(body.internal),
      lastSeenAt: lastSeen,
    });

    if (events.length > 0) {
      const batch = c.env.DB.batch(
        events.map((e) =>
          c.env.DB.prepare(
            `INSERT OR IGNORE INTO funnel_events
               (id, session_id, event, position_s, watch_ms, value, meta, client_ts, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ).bind(e.id, sessionId, e.name, e.position_s, e.watch_ms, e.value, e.meta, e.client_ts, Date.now()),
        ),
      );
      await batch;

      // Rollups derived from this batch (all MAX/COALESCE — replay-safe).
      let watch = 0;
      let pos = 0;
      let duration: number | null = null;
      let played: 1 | undefined;
      let completed: 1 | undefined;
      let quizCompletedAt: number | null = null;
      let offerAt: number | null = null;
      let offerPos: number | null = null;
      let ctaSuccessAt: number | null = null;
      let endedAt: number | null = null;
      let wallMs = 0;

      for (const e of events) {
        if (e.watch_ms !== null) watch = Math.max(watch, e.watch_ms);
        if (e.position_s !== null) pos = Math.max(pos, e.position_s);
        if (e.name === 'vsl_loaded' && e.value) {
          const d = Number(e.value);
          if (Number.isFinite(d) && d > 0) duration = Math.max(duration ?? 0, d) || null;
        }
        if (e.name === 'vsl_play') played = 1;
        if (e.name === 'vsl_complete') completed = 1;
        if (e.name === 'quiz_submit') quizCompletedAt = Math.max(quizCompletedAt ?? 0, e.client_ts) || null;
        if (e.name === 'vsl_offer_shown') {
          offerAt = Math.max(offerAt ?? 0, e.client_ts) || null;
          if (e.position_s !== null) offerPos = Math.max(offerPos ?? 0, e.position_s) || null;
        }
        if (e.name === 'vsl_cta_success') ctaSuccessAt = Math.max(ctaSuccessAt ?? 0, e.client_ts) || null;
        if (e.name === 'page_exit' || e.name === 'vsl_exit') {
          endedAt = Math.max(endedAt ?? 0, e.client_ts) || null;
          const m = e.meta ? safeWall(e.meta) : null;
          if (m !== null) wallMs = Math.max(wallMs, m);
        }
      }

      await rollupFunnelSession(c.env.DB, sessionId, {
        watchMs: watch,
        maxPositionS: pos,
        videoDurationS: duration,
        played,
        completed,
        quizCompletedAt,
        offerRevealedAt: offerAt,
        offerRevealPositionS: offerPos,
        ctaSuccessAt,
        endedAt,
        wallMs,
        lastSeenAt: lastSeen,
      });
    }

    return c.json({ status: 'ok', session_id: sessionId, accepted: events.length }, 200, {
      'cache-control': 'no-store',
    });
  } catch (err) {
    console.error('funnel track failed:', err);
    return c.json({ error: 'Could not record that.' }, 503);
  }
}

function safeWall(meta: string): number | null {
  try {
    const obj = JSON.parse(meta) as { wall_ms?: unknown };
    return num(obj.wall_ms);
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────
// Admin — same X-Admin-Secret contract as routes/engagement.ts
// ─────────────────────────────────────────────────────────────────────

export function isAdmin(c: Context<{ Bindings: Env }>): boolean {
  const secret = (c.env as unknown as { ADMIN_SECRET?: string }).ADMIN_SECRET;
  if (!secret) return false;
  return c.req.header('X-Admin-Secret') === secret;
}

const NO_STORE = { 'cache-control': 'no-store', 'content-type': 'application/json; charset=utf-8' };

interface Filters {
  where: string;
  binds: unknown[];
}

function parseFilters(q: Record<string, string>): Filters {
  const clauses: string[] = [];
  const binds: unknown[] = [];

  const from = dateParam(q.from);
  if (from !== null) {
    clauses.push('s.started_at >= ?');
    binds.push(from);
  }
  const to = dateParam(q.to);
  if (to !== null) {
    clauses.push('s.started_at <= ?');
    binds.push(to);
  }
  const campaign = (q.campaign || '').trim().slice(0, 200);
  if (campaign) {
    clauses.push('s.utm_campaign = ?');
    binds.push(campaign);
  }
  const content = (q.content || '').trim().slice(0, 200);
  if (content) {
    clauses.push('s.utm_content = ?');
    binds.push(content);
  }
  const mode = (q.mode || '').trim();
  if (mode === 'couples' || mode === 'solo') {
    clauses.push('s.vsl_mode = ?');
    binds.push(mode);
  }
  const search = (q.q || '').trim().slice(0, 320).toLowerCase();
  if (search) {
    clauses.push("(LOWER(COALESCE(s.source_email, '')) LIKE ? OR LOWER(COALESCE(s.capture_email, '')) LIKE ? OR LOWER(COALESCE(s.id, '')) LIKE ?)");
    binds.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (q.internal !== '1') {
    clauses.push('s.is_internal = 0');
  }

  return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', binds };
}

function dateParam(v: string | undefined): number | null {
  if (!v) return null;
  const asNum = Number(v);
  if (Number.isFinite(asNum) && asNum > 1_000_000_000) return Math.round(asNum);
  const t = Date.parse(v.includes('T') ? v : `${v}T00:00:00Z`);
  return Number.isFinite(t) ? t : null;
}

function iso(ms: number | null): string {
  return ms ? new Date(ms).toISOString() : '';
}

const STAGE_SQL = `
  COUNT(*) AS sessions,
  SUM(CASE WHEN s.quiz_completed_at IS NOT NULL THEN 1 ELSE 0 END) AS quiz_completed,
  SUM(CASE WHEN s.vsl_mode IS NOT NULL THEN 1 ELSE 0 END) AS vsl_started,
  SUM(CASE WHEN s.played = 1 THEN 1 ELSE 0 END) AS vsl_played,
  SUM(CASE WHEN s.offer_revealed_at IS NOT NULL THEN 1 ELSE 0 END) AS offer_revealed,
  SUM(CASE WHEN EXISTS (SELECT 1 FROM funnel_events e WHERE e.session_id = s.id AND e.event = 'vsl_cta_submit') THEN 1 ELSE 0 END) AS cta_submitted,
  SUM(CASE WHEN s.cta_success_at IS NOT NULL THEN 1 ELSE 0 END) AS cta_success,
  SUM(CASE WHEN s.cta_verified_at IS NOT NULL THEN 1 ELSE 0 END) AS cta_verified,
  SUM(CASE WHEN s.capture_email IS NOT NULL AND EXISTS (SELECT 1 FROM waitlist w WHERE w.email = s.capture_email) THEN 1 ELSE 0 END) AS app_signup,
  SUM(CASE WHEN s.played = 0 OR (s.watch_ms < 5000 AND s.cta_success_at IS NULL) THEN 1 ELSE 0 END) AS bounced,
  SUM(CASE WHEN s.source_email IS NOT NULL AND s.capture_email IS NOT NULL AND s.source_email <> s.capture_email THEN 1 ELSE 0 END) AS email_mismatch,
  CAST(AVG(CASE WHEN s.played = 1 THEN s.watch_ms END) AS INTEGER) AS avg_watch_ms,
  CAST(AVG(s.wall_ms) AS INTEGER) AS avg_wall_ms`;

export async function handleFunnelSummary(c: Context<{ Bindings: Env }>): Promise<Response> {
  if (!isAdmin(c)) return c.json({ error: 'unauthorized' }, 401);
  const q = c.req.query();
  const f = parseFilters(q);

  try {
    const [totals, byCampaign, byContent, byMode, byDay] = await Promise.all([
      c.env.DB.prepare(`SELECT ${STAGE_SQL} FROM funnel_sessions s ${f.where}`).bind(...f.binds).first(),
      c.env.DB.prepare(
        `SELECT COALESCE(s.utm_campaign, '(none)') AS key, ${STAGE_SQL}
           FROM funnel_sessions s ${f.where ? `${f.where} AND` : 'WHERE'} s.utm_campaign IS NOT NULL
          GROUP BY key ORDER BY sessions DESC LIMIT 50`,
      )
        .bind(...f.binds)
        .all(),
      c.env.DB.prepare(
        `SELECT COALESCE(s.utm_content, '(none)') AS key, ${STAGE_SQL}
           FROM funnel_sessions s ${f.where ? `${f.where} AND` : 'WHERE'} s.utm_content IS NOT NULL
          GROUP BY key ORDER BY sessions DESC LIMIT 50`,
      )
        .bind(...f.binds)
        .all(),
      c.env.DB.prepare(
        `SELECT COALESCE(s.vsl_mode, 'quiz-only') AS key, ${STAGE_SQL}
           FROM funnel_sessions s ${f.where}
          GROUP BY key ORDER BY sessions DESC`,
      )
        .bind(...f.binds)
        .all(),
      c.env.DB.prepare(
        `SELECT date(s.started_at / 1000, 'unixepoch') AS day,
                COUNT(*) AS sessions,
                SUM(CASE WHEN s.quiz_completed_at IS NOT NULL THEN 1 ELSE 0 END) AS quiz_completed,
                SUM(CASE WHEN s.cta_success_at IS NOT NULL THEN 1 ELSE 0 END) AS cta_success
           FROM funnel_sessions s ${f.where}
          GROUP BY day ORDER BY day DESC LIMIT 90`,
      )
        .bind(...f.binds)
        .all(),
    ]);

    return new Response(
      JSON.stringify({
        totals: totals || {},
        by_campaign: byCampaign.results || [],
        by_content: byContent.results || [],
        by_mode: byMode.results || [],
        by_day: byDay.results || [],
      }),
      { status: 200, headers: NO_STORE },
    );
  } catch (err) {
    console.error('funnel summary failed:', err);
    return c.json({ error: 'Query failed.' }, 503);
  }
}

const SESSION_COLUMNS = `
  s.id, s.visitor_id, s.entry, s.vsl_mode, s.vsl_video, s.quiz_attempt_id,
  s.source_email, s.capture_email, s.utm_source, s.utm_medium, s.utm_campaign,
  s.utm_content, s.via, s.country, s.device, s.timezone,
  s.started_at, s.last_seen_at, s.ended_at, s.wall_ms, s.watch_ms,
  s.max_position_s, s.video_duration_s, s.played, s.completed,
  s.quiz_completed_at, s.offer_revealed_at, s.offer_reveal_position_s,
  s.cta_success_at, s.cta_verified_at, s.is_internal,
  qa.goal, qa.blocker, qa.situation, qa.angle,
  (SELECT COUNT(*) FROM funnel_events e WHERE e.session_id = s.id AND e.event = 'vsl_play') AS play_count,
  (SELECT COUNT(*) FROM funnel_events e WHERE e.session_id = s.id AND e.event = 'vsl_pause') AS pause_count,
  (SELECT COUNT(*) FROM funnel_events e WHERE e.session_id = s.id AND e.event = 'quiz_answer') AS quiz_answer_count,
  (SELECT COUNT(*) FROM funnel_events e WHERE e.session_id = s.id AND e.event = 'vsl_cta_submit') AS cta_submit_count,
  (SELECT position_s FROM funnel_events e WHERE e.session_id = s.id AND e.event = 'vsl_cta_submit' ORDER BY e.client_ts DESC LIMIT 1) AS cta_submit_position_s,
  (SELECT position_s FROM funnel_events e WHERE e.session_id = s.id AND e.event = 'vsl_cta_success' ORDER BY e.client_ts DESC LIMIT 1) AS cta_success_position_s,
  CASE WHEN s.played = 0 OR (s.watch_ms < 5000 AND s.cta_success_at IS NULL) THEN 1 ELSE 0 END AS bounced,
  CASE WHEN s.capture_email IS NOT NULL AND EXISTS (SELECT 1 FROM waitlist w WHERE w.email = s.capture_email) THEN 1 ELSE 0 END AS app_signup`;

const SESSION_FROM = 'FROM funnel_sessions s LEFT JOIN quiz_attempts qa ON qa.id = s.quiz_attempt_id';

export async function handleFunnelSessions(c: Context<{ Bindings: Env }>): Promise<Response> {
  if (!isAdmin(c)) return c.json({ error: 'unauthorized' }, 401);
  const q = c.req.query();
  const f = parseFilters(q);
  const limit = Math.min(Math.max(Number(q.limit) || 50, 1), 200);
  const offset = Math.max(Number(q.offset) || 0, 0);

  try {
    const res = await c.env.DB.prepare(
      `SELECT ${SESSION_COLUMNS} ${SESSION_FROM} ${f.where}
        ORDER BY s.started_at DESC LIMIT ? OFFSET ?`,
    )
      .bind(...f.binds, limit, offset)
      .all();
    return new Response(JSON.stringify({ sessions: res.results || [], limit, offset }), {
      status: 200,
      headers: NO_STORE,
    });
  } catch (err) {
    console.error('funnel sessions failed:', err);
    return c.json({ error: 'Query failed.' }, 503);
  }
}

export async function handleFunnelSessionDetail(c: Context<{ Bindings: Env }>): Promise<Response> {
  if (!isAdmin(c)) return c.json({ error: 'unauthorized' }, 401);
  const sessionId = s(c.req.param('id'), 64);
  if (!sessionId) return c.json({ error: 'session id required' }, 400);

  try {
    const session = await c.env.DB.prepare(
      `SELECT ${SESSION_COLUMNS} ${SESSION_FROM} WHERE s.id = ?`,
    )
      .bind(sessionId)
      .first();
    if (!session) return c.json({ error: 'not found' }, 404);

    const [events, lead] = await Promise.all([
      c.env.DB.prepare(
        `SELECT id, event, position_s, watch_ms, value, meta, client_ts, created_at
           FROM funnel_events WHERE session_id = ? ORDER BY created_at ASC LIMIT 500`,
      )
        .bind(sessionId)
        .all(),
      c.env.DB.prepare(
        `SELECT id, email, magnet, vsl_video, via, verified, unsubscribed, verified_at, created_at
           FROM lead_magnets WHERE email = ? ORDER BY created_at DESC LIMIT 1`,
      )
        .bind((session as { capture_email?: string | null }).capture_email ?? '')
        .first()
        .catch(() => null),
    ]);

    return new Response(
      JSON.stringify({ session, events: events.results || [], lead: lead || null }),
      { status: 200, headers: NO_STORE },
    );
  } catch (err) {
    console.error('funnel session detail failed:', err);
    return c.json({ error: 'Query failed.' }, 503);
  }
}

const CSV_COLUMNS = [
  'session_id', 'started_at', 'entry', 'vsl_mode', 'source_email', 'capture_email',
  'email_match', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'via',
  'goal', 'blocker', 'situation', 'angle', 'watch_ms', 'wall_ms', 'max_position_s',
  'video_duration_s', 'progress_pct', 'played', 'completed', 'bounced',
  'offer_revealed_at', 'cta_submitted', 'cta_success_at', 'cta_verified_at',
  'cta_submit_position_s', 'cta_success_position_s',
  'lead_verified', 'app_signup', 'country', 'device', 'is_internal',
];

export async function handleFunnelExport(c: Context<{ Bindings: Env }>): Promise<Response> {
  if (!isAdmin(c)) return c.json({ error: 'unauthorized' }, 401);
  const f = parseFilters(c.req.query());

  try {
    const res = await c.env.DB.prepare(
      `SELECT ${SESSION_COLUMNS},
              (SELECT verified FROM lead_magnets WHERE email = s.capture_email ORDER BY created_at DESC LIMIT 1) AS lead_verified
         ${SESSION_FROM} ${f.where}
        ORDER BY s.started_at DESC LIMIT 10000`,
    )
      .bind(...f.binds)
      .all<Record<string, unknown>>();

    const rows = res.results || [];
    const lines = [CSV_COLUMNS.join(',')];
    for (const r of rows) {
      const match =
        r.source_email && r.capture_email ? (r.source_email === r.capture_email ? 'same' : 'differs') : '';
      const progress =
        r.video_duration_s && Number(r.video_duration_s) > 0 && r.max_position_s
          ? Math.round((Number(r.max_position_s) / Number(r.video_duration_s)) * 100)
          : '';
      const started = r.started_at ? new Date(Number(r.started_at)).toISOString() : '';
      const cells = [
        r.id, started, r.entry, r.vsl_mode, r.source_email, r.capture_email, match,
        r.utm_source, r.utm_medium, r.utm_campaign, r.utm_content, r.via,
        r.goal, r.blocker, r.situation, r.angle,
        r.watch_ms, r.wall_ms, r.max_position_s, r.video_duration_s, progress,
        r.played, r.completed, r.bounced,
        isoTs(r.offer_revealed_at), r.cta_submit_count, isoTs(r.cta_success_at),
        isoTs(r.cta_verified_at), r.cta_submit_position_s, r.cta_success_position_s, r.lead_verified, r.app_signup,
        r.country, r.device, r.is_internal,
      ];
      lines.push(cells.map(csvCell).join(','));
    }

    return new Response(`${lines.join('\r\n')}\r\n`, {
      status: 200,
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': `attachment; filename="funnel-${new Date().toISOString().slice(0, 10)}.csv"`,
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    console.error('funnel export failed:', err);
    return c.json({ error: 'Query failed.' }, 503);
  }
}

function isoTs(v: unknown): string {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? new Date(n).toISOString() : '';
}

function csvCell(v: unknown): string {
  if (v === null || v === undefined) return '';
  const str = String(v);
  return /[",\r\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

/**
 * Daily retention: raw events stay 12 months. Sessions/quiz attempts are the
 * reported record and are kept. Chunked DELETE avoids statement size limits.
 */
export async function pruneFunnelEvents(db: D1Database): Promise<void> {
  const cutoff = Date.now() - 365 * 24 * 60 * 60 * 1000;
  await db
    .prepare(
      `DELETE FROM funnel_events WHERE id IN (
         SELECT id FROM funnel_events WHERE created_at < ? LIMIT 5000
       )`,
    )
    .bind(cutoff)
    .run()
    .catch((err) => console.error('funnel prune failed:', err));
}
