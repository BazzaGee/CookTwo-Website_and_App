import type { Context } from 'hono';
import type { Env } from '../env';
import { cleanUrl, id as funnelId, upsertFunnelSession } from './funnel';
import { later } from '../lib/later';

/**
 * Quiz funnel capture — cooktwo.com/quiz posts here.
 *
 * POST /api/quiz/submit
 *   body: { email?, goal, blocker, situation, utm: { utm_source, ... },
 *           session_id?, visitor_id? }
 *
 * The quiz page no longer asks for an email. It attaches one silently when
 * the link carries ?e={address} (the email campaign links do); without it the
 * submit just routes to the right video. Either way:
 *   1. the answer set is stored in `quiz_attempts` (anonymous allowed), one
 *      row per completion, keyed to the funnel session,
 *   2. when an email is present it is also upserted into `quiz_responses`
 *      (the email-keyed latest record that mirrors onto Resend) and the
 *      contact is tagged into the "Diet & Weight Loss Plans" topic,
 *   3. the funnel session records the attempt + completion timestamps,
 *   4. the response returns a redirect carrying fs=<session_id>,
 *      q=<attempt_id> and the UTMs so the VSL page joins the same journey.
 *
 * No email is sent at this point — the video itself is the response. Nurturing
 * happens in the campaign sequences.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_UTM = 200;

const GOALS = ['lose', 'keep', 'fitness', 'not-sure'] as const;
const BLOCKERS = ['time', 'willpower', 'mixed-house', 'takeaway', 'no-ideas'] as const;
const SITUATIONS = ['solo', 'same-goal', 'different-goals'] as const;

const ALLOWED_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'via'];

const DIET_TOPIC_ID = 'cbcf44ff-1b8a-4efa-aefc-5a400c9b70f0'; // Diet & Weight Loss Plans

function s(v: unknown, max = MAX_UTM): string {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

interface QuizAnswers {
  email: string;
  goal: (typeof GOALS)[number];
  blocker: (typeof BLOCKERS)[number];
  situation: (typeof SITUATIONS)[number];
  angle: 'couples' | 'solo';
  utm: Record<string, string>;
}

function angleOf(situation: QuizAnswers['situation']): QuizAnswers['angle'] {
  return situation === 'solo' ? 'solo' : 'couples';
}

export function redirectFor(angle: QuizAnswers['angle']): string {
  return angle === 'solo' ? '/video/solo' : '/video/couples';
}

export async function handleQuizSubmit(c: Context<{ Bindings: Env }>): Promise<Response> {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = s(body.email, 320).toLowerCase();
  const goal = s(body.goal, 20) as QuizAnswers['goal'];
  const blocker = s(body.blocker, 20) as QuizAnswers['blocker'];
  const situation = s(body.situation, 20) as QuizAnswers['situation'];

  // Email is optional (query/link-append-only). Validated when present so a
  // mangled ?e= never poisons D1 or the Resend mirror.
  if (email && !EMAIL_RE.test(email)) {
    return c.json({ error: 'Please enter a valid email address.' }, 400);
  }
  if (!GOALS.includes(goal)) {
    return c.json({ error: 'Missing or invalid goal answer.' }, 400);
  }
  if (!BLOCKERS.includes(blocker)) {
    return c.json({ error: 'Missing or invalid blocker answer.' }, 400);
  }
  if (!SITUATIONS.includes(situation)) {
    return c.json({ error: 'Missing or invalid situation answer.' }, 400);
  }

  const incoming = (body.utm && typeof body.utm === 'object' ? body.utm : {}) as Record<string, unknown>;
  const utm: Record<string, string> = {};
  for (const k of ALLOWED_PARAMS) {
    const v = s(incoming[k]);
    if (v) utm[k] = v;
  }

  const answers: QuizAnswers = { email, goal, blocker, situation, angle: angleOf(situation), utm };
  const angle = answers.angle;

  const sessionId = funnelId(body.session_id) || crypto.randomUUID();
  const visitorId = funnelId(body.visitor_id);
  const attemptId = crypto.randomUUID();

  // Always store the attempt — this is the anonymous-path fix. Degrades to a
  // plain redirect if the tables are missing rather than stranding the user.
  try {
    await storeAttempt(c.env, { attemptId, sessionId, visitorId, email, goal, blocker, situation, angle, utm });
  } catch (err) {
    console.error('quiz attempt store failed:', err);
  }

  try {
    await upsertFunnelSession(c.env.DB, {
      sessionId,
      visitorId,
      entry: 'quiz',
      vslMode: null,
      vslVideo: null,
      quizAttemptId: attemptId,
      sourceEmail: email || null,
      captureEmail: null,
      landingPath: '/quiz',
      referrer: cleanUrl(c.req.header('referer')),
      utm,
      timezone: null,
      country: s(c.req.header('x-funnel-country') || '', 8) || null,
      device: null,
      userAgent: s(c.req.header('user-agent') || '', 300) || null,
      isInternal: 0,
      lastSeenAt: Date.now(),
    });
  } catch (err) {
    console.error('quiz session upsert failed:', err);
  }

  if (email) {
    try {
      await upsertResponse(c.env, answers, sessionId, visitorId);
    } catch (err) {
      console.error('quiz upsert failed:', err);
      return c.json({ error: 'Could not save your answers — please try again.' }, 503);
    }

    // Best-effort mirror onto Resend; the redirect must not wait on it.
    later(
      c,
      syncResendContact(c.env, answers).then(() =>
        c.env.DB.prepare('UPDATE quiz_responses SET resend_synced = 1 WHERE email = ?')
          .bind(email)
          .run()
          .catch(() => {}),
      ).catch((err) => console.error('resend quiz sync failed:', err)),
    );
  }

  const redirect = withFunnelParams(redirectFor(angle), sessionId, attemptId, utm);
  return c.json({ status: 'ok', redirect, session_id: sessionId, attempt_id: attemptId });
}

/** fs=<session> & q=<attempt> + the UTMs, so the VSL page joins the journey. */
function withFunnelParams(base: string, sessionId: string, attemptId: string, utm: Record<string, string>): string {
  const params = new URLSearchParams();
  params.set('fs', sessionId);
  params.set('q', attemptId);
  for (const k of ALLOWED_PARAMS) {
    if (utm[k]) params.set(k, utm[k]);
  }
  return `${base}?${params.toString()}`;
}

async function storeAttempt(
  env: Env,
  a: {
    attemptId: string;
    sessionId: string;
    visitorId: string | null;
    email: string;
    goal: string;
    blocker: string;
    situation: string;
    angle: string;
    utm: Record<string, string>;
  },
): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO quiz_attempts
       (id, session_id, visitor_id, email, goal, blocker, situation, angle,
        utm_source, utm_medium, utm_campaign, utm_content, via)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      a.attemptId, a.sessionId, a.visitorId, a.email || null,
      a.goal, a.blocker, a.situation, a.angle,
      a.utm.utm_source ?? null, a.utm.utm_medium ?? null,
      a.utm.utm_campaign ?? null, a.utm.utm_content ?? null, a.utm.via ?? null,
    )
    .run();
}

async function upsertResponse(
  env: Env,
  answers: QuizAnswers,
  sessionId: string,
  visitorId: string | null,
): Promise<void> {
  const { email, goal, blocker, situation, angle, utm } = answers;
  await env.DB.prepare(
    `INSERT INTO quiz_responses
       (email, goal, blocker, situation, angle,
        utm_source, utm_medium, utm_campaign, utm_content, via,
        session_id, visitor_id,
        created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
     ON CONFLICT(email) DO UPDATE SET
       goal = excluded.goal,
       blocker = excluded.blocker,
       situation = excluded.situation,
       angle = excluded.angle,
       utm_source = excluded.utm_source,
       utm_medium = excluded.utm_medium,
       utm_campaign = excluded.utm_campaign,
       utm_content = excluded.utm_content,
       via = excluded.via,
       session_id = excluded.session_id,
       visitor_id = excluded.visitor_id,
       resend_synced = 0,
       updated_at = datetime('now')`,
  )
    .bind(
      email, goal, blocker, situation, angle,
      utm.utm_source ?? null, utm.utm_medium ?? null,
      utm.utm_campaign ?? null, utm.utm_content ?? null, utm.via ?? null,
      sessionId, visitorId,
    )
    .run();
}

async function syncResendContact(env: Env, answers: QuizAnswers): Promise<void> {
  if (!env.RESEND_API_KEY) return;

  const headers = {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  };
  const { email, goal, blocker, situation, angle, utm } = answers;

  const properties: Record<string, string> = {
    angle,
    situation,
    goal,
    blocker,
    quiz_completed_at: new Date().toISOString().slice(0, 10),
  };
  for (const k of ['utm_source', 'utm_medium', 'utm_content', 'via']) {
    if (utm[k]) properties[k] = utm[k];
  }
  if (utm.utm_campaign) properties.campaign = utm.utm_campaign;

  const existing = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}`, { headers })
    .then((r) => (r.status === 404 ? null : r))
    .catch(() => null);

  if (existing && existing.ok) {
    const patch = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ properties }),
    });
    if (!patch.ok) throw new Error(`contact patch ${patch.status}: ${await patch.text()}`);
  } else {
    // Only genuinely new traffic creates a contact here — everyone coming
    // from the win-back emails already exists. Best-effort: many lists send
    // quiz links to people who are not on Resend yet.
    const create = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, unsubscribed: false, properties }),
    });
    if (!create.ok && create.status !== 409) {
      throw new Error(`contact create ${create.status}: ${await create.text()}`);
    }
  }

  // Quiz completion is explicit re-engagement on "still interested in weight
  // loss?" — that is consent for the diet-content topic. NOTE: the topics
  // endpoint takes a raw array body — {"topics":[...]} comes back as 422.
  const topicsRes = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}/topics`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify([{ id: DIET_TOPIC_ID, subscription: 'opt_in' }]),
  });
  if (!topicsRes.ok) throw new Error(`topics update ${topicsRes.status}: ${await topicsRes.text()}`);
}
