// Shared helpers for the cooktwo.com chat endpoints (site chatbot + tool-page
// assistant). Cloudflare Pages Functions — plain ESM, no dependencies.
//
// Responsibilities:
//   - request parsing / validation / rate limiting
//   - knowledge sections + keyword retrieval
//   - pricing fact sheet (date-aware, changeover 1 Nov 2026)
//   - OpenRouter streaming with NDJSON output

import { SITE_CONTENT } from './_chatKnowledge.js';

export const SITE_URL = 'https://cooktwo.com';
export const APP_TITLE = 'CookTwo Chat Bot';
export const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const MODELS = [
  'openrouter/free',
  'minimax/minimax-m3:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'google/gemma-4-26b-a4b-it:free',
];

export const MAX_INPUT_CHARS = 2000;
export const MAX_HISTORY = 10;
export const MAX_CONTEXT_CHARS = 8000;
export const RATE_LIMIT_PER_MIN = 10;
export const FETCH_TIMEOUT_MS = 60000;

export const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
  'to', 'of', 'in', 'on', 'at', 'for', 'with', 'about', 'as', 'by', 'from', 'it',
  'its', 'this', 'that', 'these', 'those', 'i', 'you', 'we', 'they', 'he', 'she',
  'my', 'your', 'our', 'their', 'me', 'him', 'her', 'us', 'them', 'do', 'does',
  'did', 'can', 'could', 'will', 'would', 'should', 'have', 'has', 'had', 'am',
  'what', 'which', 'who', 'whom', 'how', 'when', 'where', 'why', 'there', 'here',
  'not', 'no', 'so', 'if', 'then', 'than', 'too', 'very', 'just', 'any', 'all',
  'get', 'got', 'use', 'using', 'app', 'cooktwo', 'please', 'tell', 'know',
]);

// ── Knowledge flattening (site content) ───────────────────────────

export function buildSiteSections() {
  const s = [];
  const c = SITE_CONTENT;

  if (c.business) {
    s.push({ source: '/', title: 'About CookTwo', text: `${c.business.description} Website: ${c.business.url}. Web app: ${c.business.pwaUrl}.` });
  }

  for (const f of c.faq || []) {
    s.push({ source: '/faq/', title: f.question, text: `${f.question} ${f.answer}`, faq: true });
  }

  for (const f of c.features || []) {
    const extra = (f.highlights || []).join(' ');
    s.push({ source: f.href || '/features/', title: f.title, text: `${f.badge ? f.badge + '. ' : ''}${f.description} ${extra}` });
  }

  if ((c.steps || []).length) {
    const text = c.steps.map((st) => `Step ${st.number}: ${st.title} — ${st.description} ${st.detail || ''}`).join(' ');
    s.push({ source: '/how-it-works/', title: 'How it works (onboarding steps)', text });
  }

  const comp = c.comparison || {};
  for (const cat of comp.categories || []) {
    const text = Object.entries(cat.rows || {})
      .map(([key, val]) => `${key}: ${typeof val === 'object' ? JSON.stringify(val) : val}`)
      .join(' ');
    if (text) s.push({ source: '/compare/', title: `Comparison — ${cat.category}`, text: `${cat.category}. ${text}` });
  }
  for (const comp2 of comp.competitors || []) {
    s.push({ source: '/compare/', title: `CookTwo vs ${comp2.name}`, text: `${comp2.blurb || ''} ${comp2.positioning || ''} ${(comp2.summary || '')}` });
  }

  for (const p of c.pages || []) {
    if (p.content) s.push({ source: `/${p.slug}`, title: p.title || p.slug, text: `${p.title}. ${p.description || ''} ${p.content}` });
  }
  for (const p of [...(c.pillarPages || []), ...(c.blogPosts || [])]) {
    if (p.content) s.push({ source: `/${p.slug}`, title: p.title || p.slug, text: `${p.title}. ${p.description || ''} ${p.content}` });
  }

  if (c.navigation && Object.keys(c.navigation).length) {
    const text = JSON.stringify(c.navigation);
    s.push({ source: '/', title: 'Site navigation', text, lowPriority: true });
  }

  return s;
}

// ── Pricing fact sheet (date-aware) ───────────────────────────────

const PRICING_CHANGEOVER_MS = Date.UTC(2026, 10, 1, 0, 0, 0); // 1 November 2026

export function pricingFactSheet(now = new Date()) {
  const beforeChange = now.getTime() < PRICING_CHANGEOVER_MS;
  const today = now.toISOString().slice(0, 10);

  const lines = [
    `PRICING FACT SHEET (today is ${today}):`,
    '- CookTwo has two plans, billed per household (one price covers both partners): Free and Premium.',
  ];

  if (beforeChange) {
    lines.push(
      '- CURRENT pricing (launch special, runs until 1 November 2026):',
      '  • Free: $0 — 10 AI requests per day.',
      '  • Premium: $4.99 per month (or $44.99 per year, save 25%) — 70 AI requests per day.',
      '- UPCOMING CHANGE from 1 November 2026: Free drops to 5 AI requests per day; Premium rises to $7.99 per month for the same 70 AI requests per day.',
      '- MANDATORY for any pricing/plan/limit question: give today\'s pricing AND mention that this is a launch special ending 1 November 2026, when free AI requests drop from 10 to 5 per day and Premium goes from $4.99 to $7.99 per month (still 70 AI requests per day).',
    );
  } else {
    lines.push(
      '- CURRENT pricing (since 1 November 2026):',
      '  • Free: $0 — 5 AI requests per day.',
      '  • Premium: $7.99 per month — 70 AI requests per day.',
      '- The old launch special ($4.99 Premium with 10 free AI requests per day) has ended.',
      '- If asked about annual billing or anything not listed here, direct the user to the pricing page at https://cooktwo.com/ (pricing section) and do not guess numbers.',
    );
  }

  lines.push(
    '- Never invent prices, discounts, date changes or plan limits beyond this fact sheet.',
  );

  return lines.join('\n');
}

// ── Retrieval: keyword scoring, zero cost ─────────────────────────

export function tokenize(str) {
  const words = String(str).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const out = [];
  for (const w of words) {
    if (w.length < 2 || STOPWORDS.has(w)) continue;
    out.push(w);
    if (w.endsWith('s') && w.length > 3) out.push(w.slice(0, -1));
  }
  return out;
}

export function scoreSection(section, terms) {
  const title = (section.title || '').toLowerCase();
  const text = (section.text || '').toLowerCase();
  let score = 0;
  for (const t of terms) {
    let i = title.indexOf(t);
    while (i !== -1) { score += 3; i = title.indexOf(t, i + 1); }
    i = text.indexOf(t);
    while (i !== -1) { score += 1; i = text.indexOf(t, i + 1); }
  }
  if (score > 0 && section.faq) score *= 1.5;
  if (score > 0 && section.tool) score *= 1.5;
  if (score > 0 && section.lowPriority) score *= 0.5;
  return score;
}

export function retrieveContext(sections, query, history, opts = {}) {
  const maxChars = opts.maxChars || MAX_CONTEXT_CHARS;
  const historySlice = opts.historyMessages === 0 ? 0 : 2;
  const queryText = query + ' ' + history
    .filter((m) => m.role === 'user')
    .slice(-historySlice)
    .map((m) => m.content)
    .join(' ');
  const terms = tokenize(queryText);

  const scored = sections
    .map((s) => ({ s, score: scoreSection(s, terms) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const picked = [];
  let total = 0;
  for (const { s } of scored) {
    if (total >= maxChars) break;
    const slice = s.text.length > 2500 ? s.text.slice(0, 2500) + '…' : s.text;
    picked.push({ source: s.source, title: s.title, text: slice });
    total += slice.length;
  }

  if (picked.length === 0) {
    for (const s of sections.filter((x) => !x.lowPriority)) {
      if (total >= 4000) break;
      const slice = s.text.length > 800 ? s.text.slice(0, 800) + '…' : s.text;
      picked.push({ source: s.source, title: s.title, text: slice });
      total += slice.length;
    }
  }

  return picked
    .map((p, i) => `[${i + 1}] (${SITE_URL}${p.source}) ${p.title}\n${p.text}`)
    .join('\n\n---\n\n');
}

// ── Rate limiting (best effort, per isolate) ──────────────────────

const rateBuckets = new Map();

export function rateLimited(ip) {
  const now = Date.now();
  let bucket = rateBuckets.get(ip);
  if (!bucket) { bucket = []; rateBuckets.set(ip, bucket); }
  while (bucket.length && now - bucket[0] > 60000) bucket.shift();
  if (bucket.length >= RATE_LIMIT_PER_MIN) return true;
  bucket.push(now);
  if (rateBuckets.size > 5000) rateBuckets.clear();
  return false;
}

// ── Request parsing ───────────────────────────────────────────────

const SESSION_ID_RE = /^[0-9a-fA-F-]{8,64}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidSessionId(id) {
  return typeof id === 'string' && SESSION_ID_RE.test(id) && UUID_RE.test(id);
}

export function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_INPUT_CHARS) }));
}

export const ndjsonHeaders = {
  'content-type': 'application/x-ndjson; charset=utf-8',
  'cache-control': 'no-store',
};

export function jsonError(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export function corsPreflight() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': SITE_URL,
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}

// Parses and validates a chat POST. Returns { response } on failure or
// { message, sessionId, pageUrl, mode, clientHistory } on success.
export async function parseChatRequest(context, env, opts = {}) {
  const { request } = context;
  const allowedModes = opts.allowedModes || ['site'];
  const defaultMode = opts.defaultMode || 'site';

  if (request.method === 'OPTIONS') return { response: corsPreflight() };
  if (request.method !== 'POST') return { response: jsonError(405, 'Method not allowed') };
  if (!env.OPENROUTER_API_KEY) return { response: jsonError(500, 'Chat is not configured (missing API key)') };

  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  if (rateLimited(ip)) return { response: jsonError(429, 'Too many messages — please wait a moment.') };

  let body;
  try {
    body = await request.json();
  } catch {
    return { response: jsonError(400, 'Invalid JSON body') };
  }

  const message = typeof body.chatInput === 'string' ? body.chatInput.trim().slice(0, MAX_INPUT_CHARS) : '';
  if (!message) return { response: jsonError(400, 'Missing chatInput') };

  const sessionId = isValidSessionId(body.sessionId) ? body.sessionId : '';
  const referer = request.headers.get('referer') || '';
  const pageUrl = typeof body.pageUrl === 'string' && body.pageUrl.length <= 300
    ? body.pageUrl
    : referer.slice(0, 300);
  const rawMode = typeof body.source === 'string' ? body.source : '';
  const mode = allowedModes.includes(rawMode) ? rawMode : defaultMode;

  return { message, sessionId, pageUrl, mode, clientHistory: sanitizeHistory(body.history) };
}

// ── OpenRouter streaming ──────────────────────────────────────────

async function openRouterStream(model, messages, apiKey, signal) {
  return fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${apiKey}`,
      'content-type': 'application/json',
      'http-referer': SITE_URL,
      'x-title': APP_TITLE,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: 0.3,
      max_tokens: 700,
      reasoning: { exclude: true },
    }),
    signal,
  });
}

// The free router occasionally routes to classifier-style models whose entire
// output is a short safety classification (e.g. "User Safety: safe"), or who
// prepend/paste such classifications around a real answer. Strip those
// segments everywhere, and treat an answer that is nothing but them as a
// failure so the next model in the fallback list gets a turn.
const JUNK_LABEL = '(?:user|response|assistant|content|input|output|prompt|completion)?\\s*(?:safety|moderation|content[\\s_-]?policy|violence|harassment|hate|sexual|self[\\s-]?harm)';
const JUNK_VALUE = '(?:safe|unsafe|yes|no|none|n\\/a|true|false|low|medium|high|ok)';
const JUNK_SEGMENT_RE = new RegExp(`\\b${JUNK_LABEL}\\s*[:\\-]\\s*${JUNK_VALUE}\\b`, 'gi');
// Classifier models concatenate segments with no separator
// ("User Safety: safeResponse Safety: safe"), leaving no word boundary
// between the value and the next label. Insert one first, then strip.
const JUNK_JOIN_RE = new RegExp(`(${JUNK_VALUE})(?=${JUNK_LABEL}\\s*[:\\-])`, 'gi');

function stripClassifierNoise(text) {
  return String(text)
    .replace(JUNK_JOIN_RE, '$1 ')
    .replace(JUNK_SEGMENT_RE, '')
    .replace(/[ \t]{2,}/g, ' ');
}

function isClassifierJunk(text) {
  const t = String(text).trim();
  if (!t || t.length > 400) return false;
  return stripClassifierNoise(t).replace(/[\s.,;:!?()[\]"'*_~-]+/g, '').length === 0;
}

const PRELUDE_CHARS = 80;

// Consumes one model's stream. Holds the first PRELUDE_CHARS characters back
// so a classifier-junk answer can be discarded before anything is sent, then
// streams through the think-block filter with classifier segments stripped.
async function consumeModelStream(res, send) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let prelude = '';
  let preludeFlushed = false;
  let full = '';
  let sentLen = 0;
  let streamed = false;
  let thinkingDone = false;

  const emitCleaned = async () => {
    const cleaned = stripClassifierNoise(full);
    if (cleaned.length > sentLen) {
      const delta = cleaned.slice(sentLen);
      sentLen = cleaned.length;
      streamed = true;
      await send({ type: 'item', content: delta });
    }
  };

  const handleVisible = async (chunk) => {
    full += chunk;
    if (!thinkingDone) {
      const lt = full.lastIndexOf('</think>');
      if (lt !== -1) {
        thinkingDone = true;
        full = full.slice(lt + 8);
        await emitCleaned();
      } else if (/^\s*<think/i.test(full)) {
        return; // still inside a thinking block — hold
      } else {
        thinkingDone = true;
        await emitCleaned();
      }
    } else {
      await emitCleaned();
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') continue;
      let chunk;
      try {
        chunk = JSON.parse(data)?.choices?.[0]?.delta?.content;
      } catch { continue; }
      if (!chunk) continue;

      if (!preludeFlushed) {
        prelude += chunk;
        if (prelude.length < PRELUDE_CHARS) continue;
        if (isClassifierJunk(prelude)) {
          try { await reader.cancel(); } catch { /* client gone */ }
          return { junk: true, full: '', streamed: false };
        }
        preludeFlushed = true;
        await handleVisible(prelude);
        continue;
      }
      await handleVisible(chunk);
    }
  }

  if (!preludeFlushed) {
    if (isClassifierJunk(prelude)) {
      return { junk: true, full: '', streamed: false };
    }
    preludeFlushed = true;
    if (prelude) await handleVisible(prelude);
  }

  return { junk: false, full: stripClassifierNoise(full), streamed };
}

// Streams the answer as NDJSON lines: {type:'model'}, {type:'item',content}, {type:'end'}.
// onComplete(fullText, model) runs via context.waitUntil after the model stream
// finishes — independent of the client connection, so memory is saved even if
// the visitor closes the chat mid-answer.
export function streamAnswer(context, env, messages, { onComplete } = {}) {
  const apiKey = env.OPENROUTER_API_KEY;
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const send = async (obj) => {
    try {
      await writer.write(encoder.encode(JSON.stringify(obj) + '\n'));
    } catch { /* client gone — keep consuming the model stream */ }
  };

  let full = '';
  let usedModel = null;
  let resolveFinished;
  const finished = new Promise((resolve) => { resolveFinished = resolve; });

  if (context.waitUntil) {
    context.waitUntil(
      finished
        .then(() => (onComplete ? onComplete(full, usedModel) : undefined))
        .catch(() => { /* persistence is best-effort */ }),
    );
  }

  (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      let lastError = 'No model available';
      let streamed = false;

      for (const model of MODELS) {
        let attempt;
        try {
          attempt = await openRouterStream(model, messages, apiKey, controller.signal);
          if (!attempt.ok) {
            lastError = `${model}: HTTP ${attempt.status}`;
            continue;
          }
        } catch (err) {
          lastError = `${model}: ${err.name === 'AbortError' ? 'timeout' : err.message}`;
          continue;
        }

        const result = await consumeModelStream(attempt, send);
        if (result.junk || !result.streamed) {
          lastError = `${model}: ${result.junk ? 'unusable output' : 'empty response'}`;
          continue;
        }

        usedModel = model;
        full = result.full;
        streamed = result.streamed;
        break;
      }

      if (!usedModel) {
        await send({ type: 'error', error: `AI unavailable (${lastError}). Please try again shortly.` });
        return;
      }

      await send({ type: 'model', model: usedModel });

      if (!streamed || full.trim().length < 10) {
        await send({ type: 'item', content: 'Sorry — I could not generate a complete answer just now. Please try again.' });
      }
    } catch {
      await send({ type: 'item', content: '\n\n*Connection interrupted — please try again.*' });
    } finally {
      clearTimeout(timer);
      if (!context.waitUntil && onComplete) {
        // No waitUntil available (plain node test envs) — save inline.
        try { await onComplete(full, usedModel); } catch { /* best-effort */ }
      }
      resolveFinished();
      await send({ type: 'end' });
      try { await writer.close(); } catch { /* already closed */ }
    }
  })();

  return new Response(readable, { status: 200, headers: ndjsonHeaders });
}
