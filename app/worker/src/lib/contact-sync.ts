/**
 * Contact upsert seam — the one place where a known address is written to an
 * email provider with its funnel properties.
 *
 * Two adapters sit behind `upsertContact`:
 *
 *   resend  — the existing behaviour: create-or-patch a Resend contact, and
 *             (when asked) opt it into the diet-content topic.
 *   brevo   — Brevo v3 contact upsert with attributes; active as soon as
 *             BREVO_API_KEY is set (and optional comma-separated BREVO_LIST_IDS).
 *
 * `CONTACT_SYNC` (optional env) narrows which adapters run:
 *   unset / 'both' → every configured provider (default)
 *   'resend'       → Resend only
 *   'brevo'        → Brevo only
 *
 * This is deliberately provider-agnostic and campaign-free: which list or
 * product each address belongs to is decided later, per send. Callers pass
 * plain string properties (quiz_factor, quiz_angle, source, vsl_video, …) and
 * never learn which provider stored them. Everything here is best-effort —
 * callers wrap it so a provider hiccup can never block the viewer.
 */
import type { Env } from '../env';

export interface ContactUpsert {
  email: string;
  properties: Record<string, string>;
}

export interface UpsertOptions {
  /** Resend only: opt into the diet-content topic (quiz completions). */
  dietTopic?: boolean;
}

/** Resend topic: "Diet & Weight Loss Plans" — quiz completion is consent. */
const DIET_TOPIC_ID = 'cbcf44ff-1b8a-4efa-aefc-5a400c9b70f0';

function mode(env: Env): 'both' | 'resend' | 'brevo' {
  const v = (env.CONTACT_SYNC || '').trim().toLowerCase();
  if (v === 'resend' || v === 'brevo') return v;
  return 'both';
}

async function resendUpsert(env: Env, u: ContactUpsert, opts: UpsertOptions): Promise<void> {
  const headers = {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  };
  const { email, properties } = u;

  const existing = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}`, { headers })
    .then((r) => (r.status === 404 ? null : r))
    .catch(() => null);

  if (existing && existing.ok) {
    const patch = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ properties }),
    });
    if (!patch.ok) throw new Error(`resend contact patch ${patch.status}: ${await patch.text()}`);
  } else {
    const create = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, unsubscribed: false, properties }),
    });
    if (!create.ok && create.status !== 409) {
      throw new Error(`resend contact create ${create.status}: ${await create.text()}`);
    }
  }

  if (opts.dietTopic) {
    const topicsRes = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}/topics`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify([{ id: DIET_TOPIC_ID, subscription: 'opt_in' }]),
    });
    if (!topicsRes.ok) {
      throw new Error(`resend topics update ${topicsRes.status}: ${await topicsRes.text()}`);
    }
  }
}

async function brevoUpsert(env: Env, u: ContactUpsert): Promise<void> {
  const key = env.BREVO_API_KEY;
  if (!key) return;
  const listIds = (env.BREVO_LIST_IDS || '')
    .split(',')
    .map((x) => Number.parseInt(x.trim(), 10))
    .filter((n) => Number.isInteger(n) && n > 0);

  const payload: Record<string, unknown> = {
    email: u.email,
    attributes: u.properties,
  };
  if (listIds.length > 0) payload.listIds = listIds;

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'PUT',
    headers: {
      'api-key': key,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`brevo contact upsert ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}

/** Write one contact with its properties to every configured provider. */
export async function upsertContact(env: Env, u: ContactUpsert, opts: UpsertOptions = {}): Promise<void> {
  const m = mode(env);
  if ((m === 'both' || m === 'resend') && env.RESEND_API_KEY) {
    await resendUpsert(env, u, opts);
  }
  if ((m === 'both' || m === 'brevo') && env.BREVO_API_KEY) {
    await brevoUpsert(env, u);
  }
}
