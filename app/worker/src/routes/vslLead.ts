import type { Context } from 'hono';
import type { Env } from '../env';
import { id as funnelId, rollupFunnelSession, upsertFunnelSession } from './funnel';
import { later } from '../lib/later';

/**
 * VSL lead capture — the box that appears under the video at revealAt.
 *
 * POST /api/lead/vsl-tool
 *   body: { email, mode: 'couples' | 'solo', utm: { utm_source, ... },
 *           session_id?, quiz_attempt_id?, visitor_id?, source_email? }
 *
 * GET+POST /api/lead/unsubscribe?token=<verify_token>
 *
 * Two things this route has to get right, because the whole point of the
 * feature is knowing which video produced the address:
 *
 *   1. D1 carries `vsl_video` (couples-finale / solo-finale) and `via`
 *      (vsl-couples / vsl-solo) — first capture wins, so `via` answers
 *      "which video brought them in" even if they later watch the other one.
 *   2. The Resend contact carries `angle` + `magnet`, which is how the
 *      Audience view gets filtered down to couples-tool vs solo-tool leads.
 *
 * Funnel linkage (see routes/funnel.ts): the captured address is written back
 * onto the session as `capture_email` + `cta_success_at`, the lead row carries
 * `session_id` / `quiz_attempt_id` / `source_email`, and the confirmation
 * link appends `s=<session_id>` so /api/lead/verify can stamp
 * `cta_verified_at` server-side even though the click lands on cooktwo.app.
 *
 * Double opt-in, same shape as the Portion Split flow: the confirm link IS
 * the access link, so one click both verifies the address and opens the tool.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_UTM = 200;

const MAGNET = 'kitchen-tool';
const TOOL_NAME = 'Kitchen Calculator';

const VIDEO_BY_MODE = { solo: 'solo-finale', couples: 'couples-finale' } as const;
type VslMode = keyof typeof VIDEO_BY_MODE;

function isVslMode(v: string): v is VslMode {
  return v === 'solo' || v === 'couples';
}

function s(v: unknown, max = MAX_UTM): string {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

const ALLOWED_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'via'];

/** Where the access link lands after the confirm click. */
function toolPath(vslVideo: string): string {
  return vslVideo === 'solo-finale' ? '/kitchen-tool-solo' : '/kitchen-tool';
}

interface LeadRow {
  id: number;
  email: string;
  magnet: string;
  vsl_video: string | null;
  via: string | null;
  verified: number;
  unsubscribed: number;
  verify_token: string | null;
}

export async function handleVslToolCapture(c: Context<{ Bindings: Env }>): Promise<Response> {
  const body = await c.req.json().catch(() => ({} as Record<string, unknown>));
  const email = s(body.email, 320).toLowerCase();
  const mode = s(body.mode, 10);

  if (!email || !EMAIL_RE.test(email)) {
    return c.json({ error: 'Please enter a valid email address.' }, 400);
  }
  if (!isVslMode(mode)) {
    return c.json({ error: 'Missing video context.' }, 400);
  }

  const vslVideo = VIDEO_BY_MODE[mode];
  const via = `vsl-${mode}`;

  const incoming = (body.utm && typeof body.utm === 'object' ? body.utm : body) as Record<string, unknown>;
  const utm: Record<string, string> = {};
  for (const k of ALLOWED_PARAMS) {
    const v = s(incoming[k]);
    if (v) utm[k] = v;
  }

  const sessionId = funnelId(body.session_id);
  const quizAttemptId = funnelId(body.quiz_attempt_id);
  const visitorId = funnelId(body.visitor_id);
  const rawSource = s(body.source_email, 320).toLowerCase();
  const sourceEmail = rawSource && EMAIL_RE.test(rawSource) ? rawSource : null;

  let existing: LeadRow | null = null;
  try {
    existing = await c.env.DB.prepare(
      'SELECT id, email, magnet, vsl_video, via, verified, unsubscribed, verify_token FROM lead_magnets WHERE email = ?',
    )
      .bind(email)
      .first<LeadRow>();
  } catch (err) {
    console.error('lead capture table not migrated yet:', err);
    return c.json({ error: 'Not available yet — please try again shortly.' }, 503);
  }

  const verifyToken = crypto.randomUUID();

  if (existing && existing.verified && !existing.unsubscribed) {
    // Already confirmed and still opted in — don't burn a fresh token or
    // resend. Tell the page so it can show the link right away. The capture
    // still counts: stamp the session and link the lead row to this visit.
    await recordCtaCapture(c.env, {
      sessionId, quizAttemptId, visitorId, sourceEmail,
      email, mode, vslVideo, utm, leadId: existing.id,
    });
    return c.json({
      status: 'verified',
      message: 'You have already confirmed that address.',
      verified: true,
      toolUrl: withSession(toolPath(existing.vsl_video || vslVideo), sessionId),
    });
  }

  // First capture wins for `vsl_video`/`via`: if they watched both videos,
  // the one that produced the address is the one that answers the question.
  const keepVsl = existing && existing.vsl_video ? existing.vsl_video : vslVideo;
  const keepVia = existing && existing.vsl_video ? existing.via || via : via;

  if (existing) {
    await c.env.DB.prepare(
      `UPDATE lead_magnets
          SET magnet = ?, vsl_video = ?, via = ?,
              utm_source = ?, utm_medium = ?, utm_campaign = ?, utm_content = ?,
              session_id = COALESCE(lead_magnets.session_id, ?),
              quiz_attempt_id = COALESCE(lead_magnets.quiz_attempt_id, ?),
              source_email = COALESCE(lead_magnets.source_email, ?),
              unsubscribed = 0, verify_token = ?
        WHERE id = ?`,
    )
      .bind(MAGNET, keepVsl, keepVia,
            utm.utm_source ?? null, utm.utm_medium ?? null, utm.utm_campaign ?? null,
            utm.utm_content ?? null,
            sessionId, quizAttemptId, sourceEmail,
            verifyToken, existing.id)
      .run();
  } else {
    await c.env.DB.prepare(
      `INSERT INTO lead_magnets
         (email, magnet, vsl_video, via,
          utm_source, utm_medium, utm_campaign, utm_content,
          session_id, quiz_attempt_id, source_email,
          unsubscribed, verify_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
    )
      .bind(email, MAGNET, keepVsl, keepVia,
            utm.utm_source ?? null, utm.utm_medium ?? null, utm.utm_campaign ?? null,
            utm.utm_content ?? null,
            sessionId, quizAttemptId, sourceEmail,
            verifyToken)
      .run();
  }

  const siteUrl = c.env.WEBSITE_URL || 'https://cooktwo.com';
  const verifyUrl = `${siteUrl}/api/lead/verify?token=${verifyToken}&email=${encodeURIComponent(email)}${sessionId ? `&s=${encodeURIComponent(sessionId)}` : ''}`;
  const unsubUrl = `${siteUrl}/api/lead/unsubscribe?token=${verifyToken}`;

  try {
    await sendVslConfirmation(c.env, email, verifyUrl, unsubUrl, keepVsl, sessionId);
  } catch (err) {
    console.error('vsl confirmation send failed:', err);
    return c.json({ error: 'Could not send the confirmation email. Please try again later.' }, 500);
  }

  await recordCtaCapture(c.env, {
    sessionId, quizAttemptId, visitorId, sourceEmail,
    email, mode, vslVideo, utm, leadId: existing ? existing.id : null,
  });

  // Best-effort: put the attribution onto the Resend contact so it shows in
  // the Audience view. The capture itself stands even if this fails.
  later(
    c,
    tagVslContact(c.env, email, { mode, utm, via: keepVia }).catch((err) =>
      console.error('resend contact upsert failed:', err)),
  );

  return c.json({
    status: 'success',
    message: `Check your inbox — the ${TOOL_NAME} link is on its way.`,
    toolUrl: withSession(toolPath(keepVsl), sessionId),
  });
}

function withSession(path: string, sessionId: string | null): string {
  return sessionId ? `${path}?s=${encodeURIComponent(sessionId)}` : path;
}

interface CtaCapture {
  sessionId: string | null;
  quizAttemptId: string | null;
  visitorId: string | null;
  sourceEmail: string | null;
  email: string;
  mode: string;
  vslVideo: string;
  utm: Record<string, string>;
  leadId: number | null;
}

/**
 * Stamp the funnel spine for a capture: capture_email + cta_success_at on
 * the session (COALESCE so retries never move the timestamp backwards), and
 * a first-touch link on the lead row for the early-verified path where the
 * UPDATE branch above didn't run. Best-effort — the capture stands alone.
 */
async function recordCtaCapture(env: Env, x: CtaCapture): Promise<void> {
  const now = Date.now();
  try {
    if (x.sessionId) {
      await upsertFunnelSession(env.DB, {
        sessionId: x.sessionId,
        visitorId: x.visitorId,
        entry: 'vsl',
        vslMode: x.mode === 'solo' ? 'solo' : 'couples',
        vslVideo: x.vslVideo,
        quizAttemptId: x.quizAttemptId,
        sourceEmail: x.sourceEmail,
        captureEmail: x.email,
        landingPath: null,
        referrer: null,
        utm: x.utm,
        timezone: null,
        country: null,
        device: null,
        userAgent: null,
        isInternal: 0,
        lastSeenAt: now,
      });
      await rollupFunnelSession(env.DB, x.sessionId, {
        ctaSuccessAt: now,
        lastSeenAt: now,
      });
    }
    if (x.leadId !== null) {
      await env.DB.prepare(
        `UPDATE lead_magnets
            SET session_id = COALESCE(session_id, ?),
                quiz_attempt_id = COALESCE(quiz_attempt_id, ?),
                source_email = COALESCE(source_email, ?)
          WHERE id = ?`,
      )
        .bind(x.sessionId, x.quizAttemptId, x.sourceEmail, x.leadId)
        .run();
    }
  } catch (err) {
    console.error('funnel capture stamp failed:', err);
  }
}

// ─────────────────────────────────────────────────────────────────────
// Confirmation email — double opt-in, and the confirm link is the link
// ─────────────────────────────────────────────────────────────────────

async function sendVslConfirmation(
  env: Env,
  to: string,
  verifyUrl: string,
  unsubUrl: string,
  vslVideo: string,
  sessionId: string | null,
): Promise<void> {
  const from = env.RESEND_FROM || 'CookTwo <team@cooktwo.com>';
  const siteUrl = env.WEBSITE_URL || 'https://cooktwo.com';
  const toolUrl = `${siteUrl}${withSession(toolPath(vslVideo), sessionId)}`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#FAF6EE;font-family:Inter,system-ui,-apple-system,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;margin-bottom:36px;">
    <h1 style="color:#2C3E2D;font-size:26px;font-weight:700;margin:0 0 4px;">CookTwo</h1>
    <p style="color:#6B7B6C;font-size:14px;margin:0;">One dinner. Two plates. Zero arguments.</p>
  </div>
  <div style="background:#fff;border-radius:16px;padding:40px 32px;border:1px solid #E5E1DA;">
    <h2 style="color:#2C3E2D;font-size:20px;margin:0 0 12px;">Here is your ${TOOL_NAME} link</h2>
    <p style="color:#6B7B6C;font-size:15px;line-height:1.6;margin:0 0 24px;">
      You asked for it while watching the video — here it is. Click the button and it opens
      in your browser. Nothing to install, no account, no card.
    </p>
    <a href="${verifyUrl}" style="display:block;text-align:center;background:#7A9E7E;color:#fff;text-decoration:none;padding:15px 24px;border-radius:12px;font-size:16px;font-weight:600;">
      Open my ${TOOL_NAME}
    </a>
    <p style="color:#6B7B6C;font-size:14px;line-height:1.6;margin:22px 0 0;">
      It is yours to keep — it does not expire on you.
    </p>
    <p style="color:#6B7B6C;font-size:13px;margin:20px 0 0;">
      Or paste this link into your browser:<br/>
      <span style="color:#7A9E7E;word-break:break-all;">${verifyUrl}</span>
    </p>
  </div>

  <div style="margin-top:28px;padding:0 4px;">
    <p style="color:#6B7B6C;font-size:12px;line-height:1.7;margin:0;">
      Barry Grottis &middot; trading as CookTwo<br/>
      47 Mehrtens Crescent, Woodend, Canterbury, New Zealand<br/>
      <a href="${toolUrl}" style="color:#7A9E7E;">${toolUrl}</a>
    </p>
    <p style="color:#6B7B6C;font-size:12px;margin:14px 0 0;">
      Did not ask for this, or want these stopped?
      <a href="${unsubUrl}" style="color:#7A9E7E;">Unsubscribe</a>
    </p>
  </div>
</div>
</body></html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Here is your ${TOOL_NAME} link`,
      html,
      tags: [
        { name: 'category', value: 'lead-magnet' },
        { name: 'magnet', value: MAGNET },
        { name: 'angle', value: vslVideo === 'solo-finale' ? 'solo' : 'couples' },
        { name: 'via', value: vslVideo === 'solo-finale' ? 'vsl-solo' : 'vsl-couples' },
        { name: 'class', value: 'vsl-tool' },
      ],
      // RFC 8058 — one-click in Gmail/Outlook/Yahoo.
      headers: {
        'List-Unsubscribe': `<${unsubUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend API ${res.status}: ${text}`);
  }
}

/**
 * Carry the attribution onto the contact. Every key used here already exists
 * as a Resend contact property — `angle` is the one that answers
 * "couples video or solo video" in the Audience view.
 */
async function tagVslContact(
  env: Env,
  email: string,
  ctx: { mode: VslMode; utm: Record<string, string>; via: string },
): Promise<void> {
  if (!env.RESEND_API_KEY) return;

  const headers = {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const properties: Record<string, string> = {
    angle: ctx.mode === 'solo' ? 'solo' : 'couples',
    magnet: MAGNET,
    funnel_class: 'vsl-tool',
    via: ctx.via,
    unsubscribed: 'false',
    campaign: ctx.utm.utm_campaign || 'winback-2026-q4',
  };
  for (const k of ['utm_source', 'utm_medium']) {
    if (ctx.utm[k]) properties[k] = ctx.utm[k];
  }

  const existing = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}`, { headers })
    .then((r) => (r.status === 404 ? null : r))
    .catch(() => null);

  if (existing && existing.ok) {
    const res = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ properties, unsubscribed: false }),
    });
    if (!res.ok) throw new Error(`contact patch ${res.status}: ${await res.text()}`);
    return;
  }

  const res = await fetch('https://api.resend.com/contacts', {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, unsubscribed: false, properties }),
  });
  if (!res.ok && res.status !== 409) {
    throw new Error(`contact create ${res.status}: ${await res.text()}`);
  }
}

// ─────────────────────────────────────────────────────────────────────
// Unsubscribe — GET (a clicked link) and POST (RFC 8058 one-click)
// ─────────────────────────────────────────────────────────────────────

export async function handleLeadUnsubscribe(c: Context<{ Bindings: Env }>): Promise<Response> {
  const token = c.req.query('token');
  if (!token) return c.text('Missing unsubscribe token.', 400);

  const row = await c.env.DB.prepare(
    'SELECT email FROM lead_magnets WHERE verify_token = ?',
  )
    .bind(token)
    .first<{ email: string }>();

  if (!row) return c.text('This unsubscribe link is invalid or has expired.', 404);

  try {
    await c.env.DB.prepare(
      `UPDATE lead_magnets SET unsubscribed = 1 WHERE verify_token = ?`,
    )
      .bind(token)
      .run();
  } catch (err) {
    console.error('unsubscribe update failed:', err);
  }

  // Stop the two places mail actually leaves from. Both are best-effort:
  // the D1 flag is the record, Resend is the sending layer.
  c.executionCtx.waitUntil(
    (async () => {
      const headers = {
        Authorization: `Bearer ${c.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      };
      await fetch(`https://api.resend.com/contacts/${encodeURIComponent(row.email)}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ unsubscribed: true }),
      }).catch((err) => console.error('resend unsubscribe failed:', err));

      await c.env.DB.prepare(
        'UPDATE engagement_users SET unsubscribed = 1 WHERE email = ?',
      )
        .bind(row.email)
        .run()
        .catch(() => {});
    })(),
  );

  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Unsubscribed &mdash; CookTwo</title>
<style>
  body{margin:0;background:#FAF6EE;color:#2C3E2D;font-family:Inter,system-ui,-apple-system,sans-serif;
       min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:1.5rem}
  main{max-width:32rem;text-align:center}
  h1{font-size:1.5rem;font-weight:700;margin:0 0 .6rem}
  p{color:#6B7B6C;font-size:.95rem;line-height:1.6;margin:0 0 1rem}
  a{color:#7A9E7E;font-weight:600}
</style></head>
<body><main>
  <h1>You have been unsubscribed.</h1>
  <p>We have stopped sending these emails to <strong>${escapeHtml(row.email)}</strong>.
     You can keep using CookTwo.</p>
  <p><a href="https://cooktwo.com/">Back to CookTwo &rarr;</a></p>
</main></body></html>`,
    { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } },
  );
}

function escapeHtml(v: string): string {
  return v.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      default: return '&#39;';
    }
  });
}
