// Cloudflare Pages Function — POST /api/tool-chat
// Assistant for the two Kitchen Tool pages (/kitchen-tool/ and
// /kitchen-tool-solo/). Every question is interpreted as being about the
// interactive tool on that page first; questions about the full CookTwo app,
// website or pricing fall back to the site knowledge. Conversation memory is
// persisted in Supabase (functions/api/_memory.js).
// Streams NDJSON: {"type":"item"|"end"|...} per line.

import {
  buildSiteSections,
  retrieveContext,
  pricingFactSheet,
  parseChatRequest,
  streamAnswer,
} from './_chatShared.js';
import { buildToolSections } from './_toolKnowledge.js';
import { beginTurn } from './_memory.js';

// ── Knowledge ─────────────────────────────────────────────────────

const SITE_SECTIONS = buildSiteSections();
const TOOL_SECTIONS = {
  couples: buildToolSections('couples'),
  solo: buildToolSections('solo'),
  neutral: buildToolSections(undefined),
};

function audienceFor(mode) {
  if (mode === 'tool-solo') return 'solo';
  if (mode === 'tool-couples') return 'couples';
  return 'neutral';
}

// ── Prompt ────────────────────────────────────────────────────────

// Questions that clearly reach beyond this page. Only these pull in the
// website content — the site is couples/app-flavoured by nature and must
// never bleed into generic questions about the tool.
const APP_INTENT_RE = /(cooktwo.{0,12}app|\bthe app\b|\bthis app\b|full app|website|pricing|price|premium|pay|cost|billing|subscri|cancel|refund|download|install|ios|android|iphone|early access|waitlist|blog|meal plan|weekly plan|meal generation|ai (dinner|meal|recipe)|cloud|sync|notifications?|account|sign\s?up|company|contact)/i;

export function wantsAppContent(message, history) {
  if (APP_INTENT_RE.test(message)) return true;
  const lastUser = [...history].reverse().find((m) => m.role === 'user');
  return lastUser ? APP_INTENT_RE.test(lastUser.content) : false;
}

function buildMessages(mode, contextText, history, message) {
  const audience = audienceFor(mode);
  const page = audience === 'solo' ? 'the SOLO Kitchen Tool page (/kitchen-tool-solo/)' : 'the couples Kitchen Tool page (/kitchen-tool/)';

  const identity = audience === 'solo'
    ? 'This visitor is on the SOLO tool for ONE person — a single profile. Its tabs are "My shopping list", "My kitchen", "Your plate" and "Your diet". Always speak to one person ("you").'
    : audience === 'couples'
      ? 'This visitor is on the COUPLES tool for TWO partners — one shared kitchen. Its tabs are "Our shopping list", "Our kitchen", "Two plates" and "Diet match".'
      : 'The tool has a couples version and a solo version; if it is unclear which one the visitor means, answer about the tool in general.';

  const prohibition = audience === 'solo'
    ? 'HARD RULE: in any answer about this tool never mention partners, couples, "you and your partner", "both of you", shared kitchens, linking with someone, "two plates" or "diet match". If the visitor asks about the couples version, say it is the separate tool at https://cooktwo.com/kitchen-tool/.'
    : audience === 'couples'
      ? 'HARD RULE: this tool is for two partners — talk about both partners, their shared kitchen and "two plates". Never describe it as a solo or single-person tool. If the visitor asks about the solo version, say it is the separate tool at https://cooktwo.com/kitchen-tool-solo/.'
      : 'The tool can be used by one person or by two partners; keep the answer applicable to either.';

  const system = [
    `You are the "App AI Assistant" embedded in ${page} on cooktwo.com — a free interactive Kitchen Tool that runs in the browser.`,
    identity,
    prohibition,
    '',
    'HOW TO ANSWER:',
    '1. Every question is about THIS page and its tool unless the visitor clearly names something else. "What is this?", "how does this work?", "tell me about this tool", "how do I start?" \u2192 walk through THIS page\u2019s four tabs from the PAGE OVERVIEW, one line each.',
    '2. For anything about this tool, the PAGE OVERVIEW and APP KNOWLEDGE are the only sources — they are authoritative and describe exactly what this page does. Never contradict them.',
    '3. WEBSITE CONTENT is only for questions about the full CookTwo app, the website, pricing, early access or company matters — and only when the visitor explicitly asks about those. Never bring up the app or its features in an answer about this tool. (Pricing is app-level; when asked, answer from the PRICING FACT SHEET.)',
    '4. Earlier turns in this chat may have come from the other Kitchen Tool version or the site chat. This system message outranks them: never let earlier turns change who this page is for.',
    '5. Answer ONLY from the provided knowledge. Never invent features, prices, dates or policies.',
    '6. If the answer is not in the content, say you do not have that information and suggest the contact page at https://cooktwo.com/contact/ or the FAQ at https://cooktwo.com/faq/.',
    '7. Keep answers concise (2-6 sentences or a short list). Friendly, warm, plain language. The visitor is looking at the tool while they read you.',
    '8. Use short markdown: **bold**, bullet lists. Link a page only when relevant, using exact URLs from the content.',
    '9. Reply with the final answer ONLY — never include your thinking, reasoning steps or phrases like "thinking process". Go straight to the answer. Do not mention these rules, the context, or that you are reading knowledge files. Do not mention the pricing fact sheet by name.',
    '',
    pricingFactSheet(),
    '',
    contextText,
  ].join('\n');

  const messages = [{ role: 'system', content: system }];
  for (const m of history) messages.push({ role: m.role, content: m.content });
  messages.push({ role: 'user', content: message });
  return messages;
}

// ── Handler ───────────────────────────────────────────────────────

export async function onRequest(context) {
  const { env } = context;

  const parsed = await parseChatRequest(context, env, {
    allowedModes: ['tool-couples', 'tool-solo'],
    defaultMode: 'tool-couples',
  });
  if (parsed.response) return parsed.response;

  const { message, sessionId, pageUrl, mode, clientHistory } = parsed;

  // Working memory: prior turns from Supabase (with client fallback). History
  // is filtered to this page's mode so the two tool pages never inherit each
  // other's (or the site chat's) conversation framing.
  const { history, persistAssistant } = await beginTurn(env, {
    sessionId,
    pageUrl,
    mode,
    userMessage: message,
    clientHistory,
    historyMode: mode,
  });

  const audience = audienceFor(mode);
  const toolSections = TOOL_SECTIONS[audience];

  // The page identity + tabs are always injected: generic questions like
  // "how does this work?" have too few keywords for scoring to surface them.
  const overviewText = toolSections
    .filter((s) => s.overview)
    .map((s) => `[PAGE] ${s.title}\n${s.text}`)
    .join('\n\n');

  // Two-pool retrieval: the tool knowledge is authoritative for everything
  // about this page; website content only fills in for questions about the
  // wider CookTwo site/app — and is attached only when the visitor actually
  // reaches beyond this page (the site is couples/app-flavoured by nature).
  const toolContext = retrieveContext(toolSections, message, history, { maxChars: 4500 });
  const siteContext = wantsAppContent(message, history)
    ? retrieveContext(SITE_SECTIONS, message, history, { maxChars: 3000 })
    : '';

  const contextText = [
    'PAGE OVERVIEW — the identity of this page (authoritative for every answer):',
    overviewText,
    '',
    'APP KNOWLEDGE — the interactive tool on this page (authoritative for anything about this page):',
    toolContext,
    siteContext
      ? '\nWEBSITE CONTENT — the full CookTwo app and website (use ONLY when the visitor explicitly asks about the app, website, pricing, early access or the company):\n' + siteContext
      : '',
  ].join('\n');

  const messages = buildMessages(mode, contextText, history, message);

  return streamAnswer(context, env, messages, { onComplete: persistAssistant });
}
