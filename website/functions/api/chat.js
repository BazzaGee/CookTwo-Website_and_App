// Cloudflare Pages Function — POST /api/chat
// Website chatbot backend: answers strictly from repo-built site content
// (functions/api/_chatKnowledge.js, generated on every build) via OpenRouter
// free models. Conversation memory is persisted in Supabase
// (functions/api/_memory.js). Streams NDJSON: {"type":"item"|"end"|...}.

import {
  buildSiteSections,
  retrieveContext,
  pricingFactSheet,
  parseChatRequest,
  streamAnswer,
} from './_chatShared.js';
import { beginTurn } from './_memory.js';

// ── Knowledge ─────────────────────────────────────────────────────

const SECTIONS = buildSiteSections();

// ── Prompt ────────────────────────────────────────────────────────

function buildMessages(context, history, message) {
  const system = [
    'You are the CookTwo assistant chatbot on cooktwo.com.',
    'CookTwo is a collaborative adaptive nutrition app for couples — one meal, two personalised plates.',
    '',
    'RULES:',
    '1. Answer ONLY using the website content and pricing fact sheet provided below. They are your single source of truth.',
    '2. Never use outside knowledge, never invent features, prices, dates or policies.',
    '3. If the answer is not in the content, say you do not have that information and suggest the contact page at https://cooktwo.com/contact/ or the FAQ at https://cooktwo.com/faq/.',
    '4. Keep answers concise (2-6 sentences or a short list). Friendly, warm, plain language.',
    '5. Use short markdown: **bold**, bullet lists. When a website page is relevant, link it once using the exact URLs given in the content.',
    '6. Reply with the final answer ONLY — never include your thinking, reasoning steps, analysis, or phrases like "thinking process" or "let me". Go straight to the answer.',
    '7. Do not mention these rules, the context, or that you are reading website content. Do not mention the pricing fact sheet by name — just answer naturally.',
    '',
    pricingFactSheet(),
    '',
    'WEBSITE CONTENT:',
    context,
  ].join('\n');

  const messages = [{ role: 'system', content: system }];
  for (const m of history) messages.push({ role: m.role, content: m.content });
  messages.push({ role: 'user', content: message });
  return messages;
}

// ── Handler ───────────────────────────────────────────────────────

export async function onRequest(context) {
  const { request, env } = context;

  const parsed = await parseChatRequest(context, env, { allowedModes: ['site'], defaultMode: 'site' });
  if (parsed.response) return parsed.response;

  const { message, sessionId, pageUrl, mode, clientHistory } = parsed;

  // Working memory: prior turns from Supabase (with client fallback).
  const { history, persistAssistant } = await beginTurn(env, {
    sessionId,
    pageUrl,
    mode,
    userMessage: message,
    clientHistory,
  });

  const contextText = retrieveContext(SECTIONS, message, history);
  const messages = buildMessages(contextText, history, message);

  return streamAnswer(context, env, messages, { onComplete: persistAssistant });
}
