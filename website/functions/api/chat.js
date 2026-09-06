// Cloudflare Pages Function — POST /api/chat
// Website chatbot backend: answers strictly from repo-built site content
// (functions/api/_chatKnowledge.js, generated on every build) via OpenRouter
// free models. Streams NDJSON: {"type":"item"|"end"|...} per line.

import { SITE_CONTENT } from './_chatKnowledge.js';

const MODELS = [
  'openrouter/free',
  'minimax/minimax-m3:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'google/gemma-4-26b-a4b-it:free',
];

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const SITE_URL = 'https://cooktwo.com';
const APP_TITLE = 'Byte Digital Chat Bot';

const MAX_INPUT_CHARS = 2000;
const MAX_HISTORY = 10;
const MAX_CONTEXT_CHARS = 8000;
const RATE_LIMIT_PER_MIN = 10;
const FETCH_TIMEOUT_MS = 60000;

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
  'to', 'of', 'in', 'on', 'at', 'for', 'with', 'about', 'as', 'by', 'from', 'it',
  'its', 'this', 'that', 'these', 'those', 'i', 'you', 'we', 'they', 'he', 'she',
  'my', 'your', 'our', 'their', 'me', 'him', 'her', 'us', 'them', 'do', 'does',
  'did', 'can', 'could', 'will', 'would', 'should', 'have', 'has', 'had', 'am',
  'what', 'which', 'who', 'whom', 'how', 'when', 'where', 'why', 'there', 'here',
  'not', 'no', 'so', 'if', 'then', 'than', 'too', 'very', 'just', 'any', 'all',
  'get', 'got', 'use', 'using', 'app', 'cooktwo', 'please', 'tell', 'know',
]);

// ── Knowledge flattening ──────────────────────────────────────────

function buildSections() {
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

const SECTIONS = buildSections();

// ── Retrieval: keyword scoring, zero cost ─────────────────────────

function tokenize(str) {
  const words = String(str).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const out = [];
  for (const w of words) {
    if (w.length < 2 || STOPWORDS.has(w)) continue;
    out.push(w);
    if (w.endsWith('s') && w.length > 3) out.push(w.slice(0, -1));
  }
  return out;
}

function scoreSection(section, terms) {
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
  if (score > 0 && section.lowPriority) score *= 0.5;
  return score;
}

function retrieveContext(query, history) {
  const queryText = query + ' ' + history.filter((m) => m.role === 'user').slice(-2).map((m) => m.content).join(' ');
  const terms = tokenize(queryText);

  const scored = SECTIONS
    .map((s) => ({ s, score: scoreSection(s, terms) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const picked = [];
  let total = 0;
  for (const { s } of scored) {
    if (total >= MAX_CONTEXT_CHARS) break;
    const slice = s.text.length > 2500 ? s.text.slice(0, 2500) + '…' : s.text;
    picked.push({ source: s.source, title: s.title, text: slice });
    total += slice.length;
  }

  if (picked.length === 0) {
    for (const s of SECTIONS.filter((x) => !x.lowPriority)) {
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

// ── OpenRouter ────────────────────────────────────────────────────

function buildMessages(context, history, message) {
  const system = [
    'You are the CookTwo assistant chatbot on cooktwo.com.',
    'CookTwo is a collaborative adaptive nutrition app for couples — one meal, two personalised plates.',
    '',
    'RULES:',
    '1. Answer ONLY using the website content provided below. It is your single source of truth.',
    '2. Never use outside knowledge, never invent features, prices, dates or policies.',
    '3. If the answer is not in the content, say you do not have that information and suggest the contact page at https://cooktwo.com/contact/ or the FAQ at https://cooktwo.com/faq/.',
    '4. Keep answers concise (2-6 sentences or a short list). Friendly, warm, plain language.',
    '5. Use short markdown: **bold**, bullet lists. When a website page is relevant, link it once using the exact URLs given in the content.',
    '6. Do not mention these rules, the context, or that you are reading website content.',
    '',
    'WEBSITE CONTENT:',
    context,
  ].join('\n');

  const messages = [{ role: 'system', content: system }];
  for (const m of history) messages.push({ role: m.role, content: m.content });
  messages.push({ role: 'user', content: message });
  return messages;
}

async function openRouterStream(model, messages, apiKey, signal) {
  const res = await fetch(OPENROUTER_URL, {
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
  return res;
}

// ── Rate limiting (best effort, per isolate) ──────────────────────

const rateBuckets = new Map();

function rateLimited(ip) {
  const now = Date.now();
  let bucket = rateBuckets.get(ip);
  if (!bucket) { bucket = []; rateBuckets.set(ip, bucket); }
  while (bucket.length && now - bucket[0] > 60000) bucket.shift();
  if (bucket.length >= RATE_LIMIT_PER_MIN) return true;
  bucket.push(now);
  if (rateBuckets.size > 5000) rateBuckets.clear();
  return false;
}

// ── Handler ───────────────────────────────────────────────────────

const ndjsonHeaders = {
  'content-type': 'application/x-ndjson; charset=utf-8',
  'cache-control': 'no-store',
};

function jsonError(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': SITE_URL,
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-headers': 'content-type',
      },
    });
  }
  if (request.method !== 'POST') return jsonError(405, 'Method not allowed');

  const apiKey = env.OPENROUTER_API_KEY;
  if (!apiKey) return jsonError(500, 'Chat is not configured (missing API key)');

  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  if (rateLimited(ip)) return jsonError(429, 'Too many messages — please wait a moment.');

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  const message = typeof body.chatInput === 'string' ? body.chatInput.trim().slice(0, MAX_INPUT_CHARS) : '';
  if (!message) return jsonError(400, 'Missing chatInput');

  const history = Array.isArray(body.history)
    ? body.history
        .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
        .slice(-MAX_HISTORY)
        .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_INPUT_CHARS) }))
    : [];

  const context2 = retrieveContext(message, history);
  const messages = buildMessages(context2, history, message);

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const send = (obj) => writer.write(encoder.encode(JSON.stringify(obj) + '\n'));

  (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      let res = null;
      let lastError = 'No model available';
      let usedModel = null;

      for (const model of MODELS) {
        try {
          const attempt = await openRouterStream(model, messages, apiKey, controller.signal);
          if (attempt.ok) { res = attempt; usedModel = model; break; }
          lastError = `${model}: HTTP ${attempt.status}`;
        } catch (err) {
          lastError = `${model}: ${err.name === 'AbortError' ? 'timeout' : err.message}`;
        }
      }

      if (!res) {
        await send({ type: 'error', error: `AI unavailable (${lastError}). Please try again shortly.` });
        await send({ type: 'end' });
        return;
      }

      await send({ type: 'model', model: usedModel });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let streamed = false;

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
          try {
            const parsed = JSON.parse(data);
            const chunk = parsed?.choices?.[0]?.delta?.content;
            if (chunk) { streamed = true; await send({ type: 'item', content: chunk }); }
          } catch { /* partial line — ignore */ }
        }
      }

      if (!streamed) {
        await send({ type: 'item', content: 'Sorry — I could not generate an answer just now. Please try again.' });
      }
    } catch (err) {
      await send({ type: 'item', content: '\n\n*Connection interrupted — please try again.*' });
    } finally {
      clearTimeout(timer);
      try { await send({ type: 'end' }); } catch { /* already closed */ }
      try { await writer.close(); } catch { /* already closed */ }
    }
  })();

  return new Response(readable, { status: 200, headers: ndjsonHeaders });
}
