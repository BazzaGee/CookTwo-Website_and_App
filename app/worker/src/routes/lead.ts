import type { Context } from 'hono';
import type { Env } from '../env';
import { rollupFunnelSession } from './funnel';

/**
 * Lead-magnet capture — the funnel's front door.
 *
 * POST /api/lead/portion-split
 *   body: { email, mode, targets, utm: { utm_source, utm_medium, utm_campaign }, via }
 *
 * This route is what makes the free-magnet funnel measurable:
 *   1. stores the address + first-touch attribution,
 *   2. sends a double-opt-in confirmation email that is TAGGED in Resend,
 *   3. upserts the Resend contact so the attribution appears in your stats.
 *
 * It deliberately does NOT touch `waitlist` — that table is the app gate and
 * carries an access_token. Holding them apart keeps "subscribed to the
 * calculator" from silently meaning "unlocked the app".
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_UTM = 200;
const MAX_TARGET = 2000;

/** Anything that comes in as a utm/via field, clamped for sane storage. */
function s(v: unknown, max = MAX_UTM): string {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

const ALLOWED_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'via'];

export async function handleLeadCapture(c: Context<{ Bindings: Env }>): Promise<Response> {
  const body = await c.req.json().catch(() => ({} as Record<string, unknown>));
  const email = s(body.email, 320).toLowerCase();
  const mode = s(body.mode, 20);
  const magnet = s(body.magnet, 40) || 'portion-split';

  if (!email || !EMAIL_RE.test(email)) {
    return c.json({ error: 'Please enter a valid email address.' }, 400);
  }

  // Accept either a nested utm object or flat params (the calculator posts
  // whatever it scraped off the query string).
  const incoming = (body.utm && typeof body.utm === 'object' ? body.utm : body) as Record<string, unknown>;
  const utm: Record<string, string> = {};
  for (const k of ALLOWED_PARAMS) {
    const v = s(incoming[k]);
    if (v) utm[k] = v;
  }

  const targets = s(body.targets, MAX_TARGET);

  // Store the results the reader was shown so the confirm click can re-serve
  // them without a second calculation.
  let existing: { id: number; email: string; verified: number; resend_contact_id: string | null } | null = null;
  try {
    existing = await c.env.DB.prepare(
      'SELECT id, email, verified, resend_contact_id FROM lead_magnets WHERE email = ?',
    )
      .bind(email)
      .first<{ id: number; email: string; verified: number; resend_contact_id: string | null }>();
  } catch (err) {
    console.error('lead capture table not migrated yet:', err);
    return c.json({ error: 'Not available yet — please try again shortly.' }, 503);
  }

  const verifyToken = crypto.randomUUID();

  if (existing) {
    if (existing.verified) {
      // Already confirmed — do NOT burn a new token or re-tag. Tell the
      // caller it's a returning visitor so the UI can show their numbers.
      return c.json({
        status: 'verified',
        message: 'You have already confirmed that address.',
        verified: true,
      });
    }
    await c.env.DB.prepare(
      `UPDATE lead_magnets
          SET magnet = ?, mode = ?, targets_json = ?,
              utm_source = ?, utm_medium = ?, utm_campaign = ?, via = ?,
              verify_token = ?
        WHERE id = ?`,
    )
      .bind(magnet, mode || null, targets || null,
            utm.utm_source ?? null, utm.utm_medium ?? null, utm.utm_campaign ?? null,
            utm.utm_content ?? utm.via ?? viaOf(utm), verifyToken,
            existing.id)
      .run();
  } else {
    await c.env.DB.prepare(
      `INSERT INTO lead_magnets
         (email, magnet, mode, targets_json, utm_source, utm_medium, utm_campaign, via, verify_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(email, magnet, mode || null, targets || null,
            utm.utm_source ?? null, utm.utm_medium ?? null, utm.utm_campaign ?? null,
            utm.utm_content ?? utm.via ?? viaOf(utm), verifyToken)
      .run();
  }

  const siteUrl = c.env.WEBSITE_URL || 'https://cooktwo.com';
  const verifyUrl = `${siteUrl}/api/lead/verify?token=${verifyToken}&email=${encodeURIComponent(email)}`;

  try {
    await sendConfirmation(c.env, email, verifyUrl, { mode, magnet, utm });
  } catch (err) {
    console.error('lead confirmation send failed:', err);
    return c.json({ error: 'Could not send the confirmation email. Please try again later.' }, 500);
  }

  // Best-effort: put the attribution into Resend so it shows in stats. The
  // opt-in itself is still valid even if this fails.
  c.executionCtx.waitUntil(
    tagResendContact(c.env, email, { mode, magnet, utm }).catch((err) =>
      console.error('resend contact upsert failed:', err)),
  );

  return c.json({
    status: 'success',
    message: 'Check your inbox — confirm your email and I will send your numbers.',
  });
}

/** `via` is our own stable key for which asset the click came through. */
function viaOf(utm: Record<string, string>): string | null {
  return utm.utm_content || utm.via || null;
}

export async function handleLeadVerify(c: Context<{ Bindings: Env }>): Promise<Response> {
  const token = c.req.query('token');
  const email = s(c.req.query('email'), 320).toLowerCase();

  if (!token) {
    return c.text('Missing verification token.', 400);
  }

  const row = await c.env.DB.prepare(
    'SELECT * FROM lead_magnets WHERE verify_token = ?',
  )
    .bind(token)
    .first<{
      id: number; email: string; verified: number; magnet: string | null;
      vsl_video: string | null; targets_json: string | null; mode: string | null; via: string | null;
    }>();

  if (!row) {
    return c.text('This confirmation link is invalid or has expired.', 404);
  }

  // Guard the token against being replayed by someone who guessed the email.
  if (email && row.email !== email) {
    return c.text('This confirmation link does not match that address.', 403);
  }

  if (!row.verified) {
    await c.env.DB.prepare(
      `UPDATE lead_magnets SET verified = 1, verified_at = datetime('now') WHERE id = ?`,
    )
      .bind(row.id)
      .run();
  }

  // Funnel stamp: the VSL confirmation link carries ?s=<session_id> so the
  // click — even though it lands on cooktwo.app — records cta_verified_at on
  // the originating session. Best-effort; verification itself never fails.
  const sessionId = s(c.req.query('s'), 64);
  if (sessionId && /^[A-Za-z0-9_-]{8,64}$/.test(sessionId)) {
    // One small UPDATE before the redirect — it must land, so it's awaited
    // rather than waitUntil'd.
    await rollupFunnelSession(c.env.DB, sessionId, { ctaVerifiedAt: Date.now(), lastSeenAt: Date.now() }).catch(
      () => {},
    );
  }

  // Land them back on the thing they asked for. The VSL confirmation link is
  // also the access link, so it has to open the right tool page.
  const siteUrl = c.env.WEBSITE_URL || 'https://cooktwo.com';
  return Response.redirect(`${siteUrl}${landingPath(row)}?verified=1&m=${encodeURIComponent(row.mode ?? '')}`, 302);
}

/**
 * Where the confirm click lands.
 *
 * The VSL lead capture sends this same link as the "open my tool" link, so a
 * kitchen-tool lead has to go to a kitchen-tool page — not the portion-split
 * calculator that used to be hard-coded here (and 404'd, because that page
 * does not exist).
 */
function landingPath(row: { magnet: string | null; vsl_video: string | null; mode: string | null }): string {
  switch (row.magnet) {
    case 'kitchen-tool':
      return row.vsl_video === 'solo-finale' || row.mode === 'solo' ? '/kitchen-tool-solo' : '/kitchen-tool';
    case 'portion-split':
      return '/portion-calculator';
    default:
      return row.mode === 'solo' ? '/kitchen-tool-solo' : '/kitchen-tool';
  }
}

/** Mark a lead as verified without a redirect — used by admin tooling. */
export async function handleLeadStatus(c: Context<{ Bindings: Env }>): Promise<Response> {
  const email = s(c.req.query('email'), 320).toLowerCase();
  if (!email) return c.json({ error: 'email required' }, 400);
  const row = await c.env.DB.prepare(
    'SELECT email, mode, magnet, verified, utm_source, via, created_at FROM lead_magnets WHERE email = ?',
  )
    .bind(email)
    .first();
  if (!row) return c.json({ found: false }, 404);
  return c.json({ found: true, lead: row });
}

// ----------------------------------------------------------------------
// Resend: the tagged confirmation email + the contact that carries attribution
// ----------------------------------------------------------------------

async function sendConfirmation(
  env: Env,
  to: string,
  verifyUrl: string,
  ctx: { mode: string; magnet: string; utm: Record<string, string> },
): Promise<void> {
  const from = env.RESEND_FROM || 'CookTwo <team@cooktwo.com>';

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#FAF6EE;font-family:Inter,system-ui,-apple-system,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;margin-bottom:36px;">
    <h1 style="color:#2C3E2D;font-size:26px;font-weight:700;margin:0 0 4px;">CookTwo</h1>
    <p style="color:#6B7B6C;font-size:14px;margin:0;">One dinner. Two plates. Zero arguments.</p>
  </div>
  <div style="background:#fff;border-radius:16px;padding:40px 32px;border:1px solid #E5E1DA;">
    <h2 style="color:#2C3E2D;font-size:20px;margin:0 0 12px;">Confirm your email</h2>
    <p style="color:#6B7B6C;font-size:15px;line-height:1.6;margin:0 0 28px;">
      Tap the button below and I will send your numbers across — along with the guide
      you downloaded.
    </p>
    <a href="${verifyUrl}" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:16px;font-weight:600;">
      Confirm &amp; get my numbers
    </a>
    <p style="color:#6B7B6C;font-size:13px;margin:24px 0 0;">
      Or copy this link into your browser:<br/>
      <span style="color:#7A9E7E;word-break:break-all;">${verifyUrl}</span>
    </p>
  </div>
  <p style="color:#6B7B6C;font-size:12px;text-align:center;margin-top:28px;">
    If you did not ask for this, you can safely ignore this email.
  </p>
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
      subject: 'Confirm your email — your numbers are ready',
      html,
      // Tags land in Resend as filters on the Messages view.
      tags: leadTags(ctx),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend API ${res.status}: ${text}`);
  }
}

/** The tag set that makes the funnel readable inside Resend. */
function leadTags(ctx: { mode: string; magnet: string; utm: Record<string, string> }): Array<{ name: string; value: string }> {
  const tags: Array<{ name: string; value: string }> = [
    { name: 'category', value: 'lead-magnet' },
    { name: 'campaign', value: ctx.utm.utm_campaign || 'winback-2026-q4' },
    { name: 'magnet', value: ctx.magnet },
    { name: 'angle', value: ctx.mode === 'solo' ? 'solo' : 'couples' },
    { name: 'class', value: 'leadmagnet' },
  ];
  if (ctx.utm.utm_content) tags.push({ name: 'via', value: ctx.utm.utm_content });
  else if (ctx.utm.utm_source) tags.push({ name: 'via', value: ctx.utm.utm_source });
  return tags;
}

/**
 * Upsert the Resend contact carrying the attribution. Without this the tags
 * exist on the outgoing message but nothing is queryable per person in the
 * Audience view — which is the whole "track all the stats" problem.
 */
async function tagResendContact(
  env: Env,
  email: string,
  ctx: { mode: string; magnet: string; utm: Record<string, string> },
): Promise<void> {
  if (!env.RESEND_API_KEY) return;

  const headers = {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const properties: Record<string, string> = {
    magnet: ctx.magnet,
    angle: ctx.mode === 'solo' ? 'solo' : 'couples',
    funnel_class: 'leadmagnet',
    campaign: ctx.utm.utm_campaign || 'winback-2026-q4',
  };
  for (const k of ['utm_source', 'utm_medium', 'via']) {
    if (ctx.utm[k]) properties[k] = ctx.utm[k];
  }

  const existing = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}`, { headers })
    .then((r) => (r.status === 404 ? null : r))
    .catch(() => null);

  if (existing && existing.ok) {
    const res = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ properties }),
    });
    if (!res.ok) throw new Error(`contact patch ${res.status}: ${await res.text()}`);
    return;
  }

  const res = await fetch('https://api.resend.com/contacts', {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, unsubscribed: false, properties }),
  });
  // 409 = contact exists but GET did not surface it; that is fine.
  if (!res.ok && res.status !== 409) {
    throw new Error(`contact create ${res.status}: ${await res.text()}`);
  }
}
