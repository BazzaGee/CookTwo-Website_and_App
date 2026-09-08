// Fallback email templates for CookTwo engagement emails.
// Guaranteed minimum-quality content when the AI writer is unavailable.
// Inline-styled, table-free, on-brand.

export interface FallbackContext {
  name: string;
  daysSinceSignup: number;
  totalMeals: number;
  totalActions: number;
  partnerCount: number;
  hasMeals: boolean;
  hasPartner: boolean;
  planLabel: string | null;
}

export interface TemplateOutput {
  subject: string;
  preview: string;
  html: string;
  text: string;
}

const BRAND_HTML_TOP = `<div style="max-width:560px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;margin-bottom:36px;">
    <h1 style="color:#2C3E2D;font-size:26px;font-weight:700;margin:0 0 4px;">CookTwo</h1>
    <p style="color:#6B7B6C;font-size:14px;margin:0;">One dinner. Two plates. Zero arguments.</p>
  </div>`;

function wrap(inner: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#FAF6EE;font-family:Inter,system-ui,-apple-system,sans-serif;">
${BRAND_HTML_TOP}
  <div style="background:#fff;border-radius:16px;padding:40px 32px;border:1px solid #E5E1DA;">
${inner}
  </div>
  <p style="color:#6B7B6C;font-size:12px;text-align:center;margin-top:28px;">CookTwo — making mealtime work for two</p>
</div></body></html>`;
}

const greet = (ctx: FallbackContext) => ctx.name ? `Hey ${ctx.name},` : 'Hey,';

function welcome(ctx: FallbackContext): TemplateOutput {
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} Welcome to CookTwo. You and your partner are about to share one kitchen — one grocery list, one pantry, and one recipe plated two ways for two different goals.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">Open the app, set up your profile, and share your invite code so your partner can join.</p>
  <a href="https://cooktwo.app/PWA" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Open the CookTwo app</a>`;
  return {
    subject: 'Welcome to CookTwo — let\'s get cooking',
    preview: 'Your shared kitchen is ready. Set up in about 2 minutes.',
    html: wrap(body),
    text: `${greet(ctx)} Welcome to CookTwo. Share one kitchen, one list, one recipe plated two ways. Open the app: https://cooktwo.app/PWA`,
  };
}

function appOnboarding(ctx: FallbackContext): TemplateOutput {
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} You signed up but haven't opened the app yet. Here's the fastest way to your first shared dinner:</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">1. Open the app · 2. Add your goal &amp; body profile · 3. Share your invite code. About 2 minutes total.</p>
  <a href="https://cooktwo.app/PWA" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Start now</a>
  <p style="color:#6B7B6C;font-size:13px;margin:16px 0 0;">Prefer to browse first? Visit <a href="https://cooktwo.com" style="color:#7A9E7E;">cooktwo.com</a> to see how it works.</p>`;
  return {
    subject: 'Your CookTwo kitchen is one click away',
    preview: 'Set up takes about 2 minutes. Here\'s how.',
    html: wrap(body),
    text: `${greet(ctx)} You signed up but haven't opened the app yet. Open https://cooktwo.app/PWA, add your goal and profile, and share your invite code. Or browse https://cooktwo.com first.`,
  };
}

function firstMealLogged(ctx: FallbackContext): TemplateOutput {
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} You logged your first meal — nice. That's the start of a smarter kitchen.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">Try asking the AI what to make from your pantry next, or plan a full week in one go.</p>
  <a href="https://cooktwo.app/PWA" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Keep it going</a>`;
  return {
    subject: 'First meal logged — keep the loop going',
    preview: 'Your kitchen is getting smarter.',
    html: wrap(body),
    text: `${greet(ctx)} You logged your first meal — nice. Ask the AI what to make from your pantry, or plan a week ahead. https://cooktwo.app/PWA`,
  };
}

function mealStreak(ctx: FallbackContext): TemplateOutput {
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} You've been cooking consistently — that's a habit worth protecting.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">Want to make this week easier? Generate a Sunday meal plan and the grocery list builds itself.</p>
  <a href="https://cooktwo.app/PWA" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Plan this week</a>`;
  return {
    subject: 'You\'re on a roll — plan the week',
    preview: 'Turn momentum into an easier week.',
    html: wrap(body),
    text: `${greet(ctx)} You've been cooking consistently. Generate a Sunday meal plan and the grocery list builds itself. https://cooktwo.app/PWA`,
  };
}

function inactivityNudge(ctx: FallbackContext): TemplateOutput {
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} It's been a few days since you used CookTwo. No pressure — your kitchen is exactly where you left it, and it'll still be waiting.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">When you're ready, one meal suggestion from your pantry is all it takes to get back in rhythm.</p>
  <a href="https://cooktwo.app/PWA" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Open CookTwo</a>`;
  return {
    subject: 'We miss you — dinner\'s on us to plan',
    preview: 'Your kitchen is waiting, right where you left it.',
    html: wrap(body),
    text: `${greet(ctx)} It's been a few days. No pressure — your kitchen is waiting. One pantry meal suggestion is all it takes to get back in rhythm. https://cooktwo.app/PWA`,
  };
}

function partnerInvite(ctx: FallbackContext): TemplateOutput {
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} Your kitchen is set up, but your partner hasn't joined yet. CookTwo works best with two.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">Share your 6-digit invite code from the app — they'll be synced to your shared list in seconds.</p>
  <a href="https://cooktwo.app/PWA" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Open CookTwo</a>`;
  return {
    subject: 'Invite your partner to share the kitchen',
    preview: 'CookTwo works best when you\'re both in.',
    html: wrap(body),
    text: `${greet(ctx)} Your kitchen is set, but your partner hasn't joined. Share your 6-digit invite code from the app so you can share one list and one plan. https://cooktwo.app/PWA`,
  };
}

function premiumPitch(ctx: FallbackContext): TemplateOutput {
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} You're getting real use out of CookTwo — nice.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">Premium gives you 70 AI requests a day (7× the free limit) for meal planning, recipe generation, and personalised nutrition. Only $4.99/month.</p>
  <a href="https://cooktwo.app/PWA" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Explore Premium</a>`;
  return {
    subject: 'You\'re getting a lot out of CookTwo',
    preview: 'Premium unlocks 7× the AI requests for $4.99.',
    html: wrap(body),
    text: `${greet(ctx)} You're getting real use out of CookTwo. Premium gives you 70 AI requests a day for $4.99/month. Explore it in the app: https://cooktwo.app/PWA`,
  };
}

function appTip(ctx: FallbackContext): TemplateOutput {
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} A quick tip: type what's in your fridge in plain English — like "chicken, 2 cups rice, spinach" — and the pantry AI sorts it and suggests what to cook right now.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">No dropdowns, no forms. Just type.</p>
  <a href="https://cooktwo.app/PWA" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Try it</a>`;
  return {
    subject: 'A CookTwo trick: type your pantry in plain English',
    preview: 'No dropdowns — just type what you have.',
    html: wrap(body),
    text: `${greet(ctx)} Quick tip: type what's in your fridge in plain English ("chicken, 2 cups rice, spinach") and the pantry AI suggests what to cook. https://cooktwo.app/PWA`,
  };
}

export function getFallbackTemplate(type: string, ctx: FallbackContext): TemplateOutput {
  switch (type) {
    case 'welcome': return welcome(ctx);
    case 'app_onboarding': return appOnboarding(ctx);
    case 'first_meal_logged': return firstMealLogged(ctx);
    case 'meal_streak': return mealStreak(ctx);
    case 'inactivity_nudge': return inactivityNudge(ctx);
    case 'partner_invite': return partnerInvite(ctx);
    case 'premium_pitch': return premiumPitch(ctx);
    case 'app_tip': return appTip(ctx);
    default: return welcome(ctx);
  }
}
