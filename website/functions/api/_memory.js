// Supabase-backed chat memory for the cooktwo.com chat endpoints.
//
// Every conversation turn is persisted through the Supabase PostgREST API so
// the assistant has a working memory of each chat session (survives reloads
// and revisits; the session id lives in the visitor's browser).
//
// Required env (Cloudflare Pages → Settings → Environment variables, or local
// .dev.vars):
//   SUPABASE_URL              e.g. https://<ref>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY service role / secret key (server-side only! it
//                             must never reach the browser)
//
// All operations are best-effort: if the env is missing or a call fails the
// chat still works, it just falls back to the client-provided history.

import { MAX_HISTORY, MAX_INPUT_CHARS, sanitizeHistory, isValidSessionId } from './_chatShared.js';

const REST_TIMEOUT_MS = 4000;

export function memoryConfigured(env) {
  return Boolean(env && env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

function baseUrl(env) {
  return String(env.SUPABASE_URL).replace(/\/+$/, '');
}

function headers(env, extra = {}) {
  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    'content-type': 'application/json',
    ...extra,
  };
}

async function rest(env, path, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REST_TIMEOUT_MS);
  try {
    const res = await fetch(baseUrl(env) + path, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

// Inserts the session row if it does not exist yet.
export async function ensureSession(env, sessionId, pageUrl, mode) {
  try {
    await rest(env, '/rest/v1/chat_sessions', {
      method: 'POST',
      headers: headers(env, { prefer: 'resolution=ignore-duplicates,return=minimal' }),
      body: JSON.stringify([{ id: sessionId, first_page: pageUrl || null, mode: mode || null }]),
    });
    return true;
  } catch {
    return false;
  }
}

async function touchSession(env, sessionId) {
  try {
    await rest(env, `/rest/v1/chat_sessions?id=eq.${encodeURIComponent(sessionId)}`, {
      method: 'PATCH',
      headers: headers(env, { prefer: 'return=minimal' }),
      body: JSON.stringify({ last_seen_at: new Date().toISOString() }),
    });
  } catch { /* best-effort */ }
}

// Loads the most recent messages for a session, oldest first.
// When `mode` is given, only messages saved from that page mode are returned —
// tool pages pass their mode so couples answers never leak into the solo chat
// (and vice versa) when a visitor switches between the two tool pages.
export async function loadHistory(env, sessionId, limit = MAX_HISTORY, mode = null) {
  try {
    const modeQuery = mode ? `&mode=eq.${encodeURIComponent(mode)}` : '';
    const res = await rest(
      env,
      `/rest/v1/chat_messages?session_id=eq.${encodeURIComponent(sessionId)}` +
        `&role=in.(user,assistant)&select=role,content,created_at&order=created_at.desc&limit=${limit}${modeQuery}`,
      { method: 'GET', headers: headers(env) },
    );
    if (!res.ok) return [];
    const rows = await res.json();
    if (!Array.isArray(rows)) return [];
    return rows
      .reverse()
      .filter((r) => typeof r.content === 'string' && r.content.trim())
      .map((r) => ({ role: r.role, content: String(r.content).slice(0, MAX_INPUT_CHARS * 4) }));
  } catch {
    return [];
  }
}

export async function saveMessage(env, sessionId, { role, content, pageUrl, mode, model }) {
  try {
    const res = await rest(env, '/rest/v1/chat_messages', {
      method: 'POST',
      headers: headers(env, { prefer: 'return=minimal' }),
      body: JSON.stringify([{
        session_id: sessionId,
        role,
        content: String(content).slice(0, 8000),
        page_url: pageUrl || null,
        mode: mode || null,
        model: model || null,
      }]),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Prepares a conversation turn:
//   1. loads prior history from Supabase (source of truth) or falls back to
//      the client-provided history,
//   2. persists the incoming user message (before streaming, so message
//      ordering stays correct).
// `historyMode` (optional) restricts loaded history to messages from that page
// mode — tool endpoints pass it so the two Kitchen Tool pages keep separate
// conversation memory. Returns { history, persistAssistant } where
// persistAssistant(fullText, model) stores the assistant's reply. Both
// persistence paths are best-effort.
export async function beginTurn(env, { sessionId, pageUrl, mode, userMessage, clientHistory, historyMode }) {
  const fallback = sanitizeHistory(clientHistory);

  if (!memoryConfigured(env) || !isValidSessionId(sessionId)) {
    return { history: fallback, persistAssistant: async () => {} };
  }

  const sessionOk = await ensureSession(env, sessionId, pageUrl, mode);
  if (!sessionOk) {
    return { history: fallback, persistAssistant: async () => {} };
  }

  const remote = await loadHistory(env, sessionId, MAX_HISTORY, historyMode || null);
  const history = remote.length ? remote : fallback;

  await saveMessage(env, sessionId, { role: 'user', content: userMessage, pageUrl, mode });
  touchSession(env, sessionId).catch(() => {});

  const persistAssistant = async (fullText, model) => {
    if (typeof fullText !== 'string' || !fullText.trim()) return;
    await saveMessage(env, sessionId, { role: 'assistant', content: fullText, pageUrl, mode, model });
    touchSession(env, sessionId).catch(() => {});
  };

  return { history, persistAssistant };
}
