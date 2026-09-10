// OpenRouter email writer for CookTwo engagement emails.
// Uses OPENROUTER_API_KEY (falls back to DEEPSEEK_KEY-style key if provided).
// Robust JSON extraction + guaranteed fallback templates.

import { EMAIL_PERSONA_SYSTEM_PROMPT } from './email-persona';
import { getFallbackTemplate, type FallbackContext } from './email-templates';

export interface EmailOutput {
  subject: string;
  preview_text: string;
  html_body: string;
  text_body: string;
}

export type EmailType =
  // Onboarding series (sent in order while onboarding is active)
  | 'welcome'
  | 'onboarding_partner'
  | 'onboarding_shopping_list'
  | 'onboarding_pantry'
  | 'onboarding_ai_meals'
  | 'onboarding_two_plates'
  | 'onboarding_habit_loop'
  // Lifecycle emails (only after onboarding is complete)
  | 'first_meal_logged'
  | 'meal_streak'
  | 'inactivity_nudge'
  | 'partner_invite'
  | 'premium_pitch'
  | 'app_tip'
  | 'feedback_request';

function buildUserMessage(type: EmailType, state: any, contextNote: string): string {
  return JSON.stringify({
    email_type: type,
    user_state: state,
    instruction: contextNote,
  });
}

function extractJSON(text: string): Record<string, string> | null {
  try {
    const parsed = JSON.parse(text);
    if (parsed.subject && parsed.html_body) return parsed;
  } catch {}
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch && fenceMatch[1] !== undefined) {
    try {
      const parsed = JSON.parse(fenceMatch[1]);
      if (parsed.subject && parsed.html_body) return parsed;
    } catch {}
  }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.subject && parsed.html_body) return parsed;
    } catch {}
  }
  return null;
}

export async function writeEmail(
  apiKey: string,
  type: EmailType,
  state: any,
  contextNote: string,
  model = 'openrouter/free',
  variant?: string,
): Promise<{ output: EmailOutput; usedFallback: boolean }> {
  const fallbackCtx: FallbackContext = {
    name: state.name || '',
    daysSinceSignup: state.daysSinceSignup || 0,
    totalMeals: state.totalMeals || 0,
    totalActions: state.totalActions || 0,
    partnerCount: state.partnerCount || 0,
    hasMeals: !!state.hasMeals,
    hasPartner: (state.partnerCount || 0) >= 2,
    planLabel: state.planLabel || null,
  };

  const fallback = getFallbackTemplate(type, fallbackCtx, variant);

  if (!apiKey) {
    return { output: toOutput(fallback), usedFallback: true };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://cooktwo.com',
        'X-Title': 'CookTwo Engagement Engine',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: EMAIL_PERSONA_SYSTEM_PROMPT },
          { role: 'user', content: buildUserMessage(type, state, contextNote) },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1024,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.error(`OpenRouter ${response.status}: ${errText.slice(0, 300)}`);
      return { output: toOutput(fallback), usedFallback: true };
    }

    const data: any = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const parsed = extractJSON(content);

    if (!parsed) {
      console.error('Failed to parse LLM email output');
      return { output: toOutput(fallback), usedFallback: true };
    }

    return {
      output: {
        subject: parsed.subject || fallback.subject,
        preview_text: parsed.preview_text || fallback.preview,
        html_body: parsed.html_body || fallback.html,
        text_body: parsed.text_body || fallback.text,
      },
      usedFallback: false,
    };
  } catch (err: any) {
    console.error(`Email writer error: ${err.message}`);
    return { output: toOutput(fallback), usedFallback: true };
  }
}

function toOutput(t: { subject: string; preview: string; html: string; text: string }): EmailOutput {
  return {
    subject: t.subject,
    preview_text: t.preview,
    html_body: t.html,
    text_body: t.text,
  };
}
