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

// ── Onboarding series ────────────────────────────────────────────
// One feature per email, in the order the app's data flows:
// list → pantry → AI meals → two plates → habit loop.

function welcome(ctx: FallbackContext): TemplateOutput {
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} Welcome to CookTwo. Quick story: we built this because cooking for two is harder than it should be — one of you wants lighter plates, one wants more, and nobody agrees on what's for dinner until someone's already annoyed.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">Here's how it works in 30 seconds: you both share <strong>one grocery list</strong> and <strong>one pantry</strong> that stay in sync in real time, and an AI that turns one recipe into <strong>two personalized plates</strong> — right portions for each of you. One dinner. Two plates. Zero arguments.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">Over the next couple of weeks I'll send you a few short emails — one small thing at a time — so CookTwo starts working for you without the overwhelm. Step one: open the app and finish your setup (takes ~2 minutes).</p>
  <a href="https://cooktwo.app/PWA" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Open CookTwo</a>`;
  return {
    subject: 'Welcome to CookTwo — why we built it',
    preview: 'One dinner. Two plates. Zero arguments. Here\'s how it works.',
    html: wrap(body),
    text: `${greet(ctx)} Welcome to CookTwo. We built it because cooking for two is harder than it should be: one shared grocery list and pantry, and one recipe plated two ways — right portions for each of you. Over the next couple of weeks I'll send a few short emails, one small thing at a time. Step one: open the app and finish setup. https://cooktwo.app/PWA`,
  };
}

function onboardingPartner(ctx: FallbackContext): TemplateOutput {
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} Step one of getting real value from CookTwo: bring in your other half. CookTwo is built around a shared kitchen — the list, the pantry, and the meal plans all sync between you two instantly.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">Open the app, grab your 6-digit invite code from settings, and send it to your partner. The moment they join, everything you do shows up on their phone (and vice versa).</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">Flying solo for now? No problem — everything works on your own too, and you can invite your partner any time.</p>
  <a href="https://cooktwo.app/PWA" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Share your invite code</a>`;
  return {
    subject: 'Step 1: CookTwo works best with two',
    preview: 'Share your 6-digit code and your kitchens become one.',
    html: wrap(body),
    text: `${greet(ctx)} Step 1: invite your partner. Open the app, grab your 6-digit invite code from settings, and send it over. Everything syncs instantly between you. Solo for now? That works too. https://cooktwo.app/PWA`,
  };
}

function onboardingShoppingList(ctx: FallbackContext): TemplateOutput {
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} Today's step is the one you'll use every single week: the shared shopping list. No forms, no dropdowns — just type like you'd text: "milk, eggs, 2 bread".</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">It sorts items into aisles automatically, syncs live between you and your partner (no more "did you get the milk?" texts), and at the store you just check things off. When you're home, tap <strong>Done Shopping</strong> and everything moves straight into your pantry.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">Try it now: add tonight's dinner ingredients to the list.</p>
  <a href="https://cooktwo.app/PWA" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Add something to your list</a>`;
  return {
    subject: 'Type your groceries like you\'d text them',
    preview: 'One shared list, sorted into aisles, synced live. Try it.',
    html: wrap(body),
    text: `${greet(ctx)} Today's step: the shared shopping list. Type like a text — "milk, eggs, 2 bread" — it sorts into aisles and syncs live between you both. Check off at the store, tap Done Shopping at home. Try adding tonight's ingredients: https://cooktwo.app/PWA`,
  };
}

function onboardingPantry(ctx: FallbackContext): TemplateOutput {
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} Next up: your pantry — the part of CookTwo that makes the magic work later. Open the Pantry tab and type what's actually in your kitchen right now: "chicken, 2 cups rice, spinach, eggs".</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">The AI reads plain English and organizes it into a tidy, categorized pantry. Every <strong>Done Shopping</strong> from now on tops it up automatically, so it stays current without effort.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">Two minutes today, and the next email will show you what this unlocks.</p>
  <a href="https://cooktwo.app/PWA" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Stock your pantry</a>`;
  return {
    subject: 'Your kitchen, remembered (2 minutes)',
    preview: 'Type what\'s in your fridge — the AI does the organizing.',
    html: wrap(body),
    text: `${greet(ctx)} Next step: your pantry. Open the Pantry tab and type what you have — "chicken, 2 cups rice, spinach". The AI organizes it, and Done Shopping keeps it topped up automatically. This unlocks the next step: https://cooktwo.app/PWA`,
  };
}

function onboardingAiMeals(ctx: FallbackContext): TemplateOutput {
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} This is the moment your pantry pays off. Go to the meal tab and ask: <strong>"What should we cook?"</strong></p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">Pick <strong>Cook with what we have</strong> and the AI suggests meals using only what's in your pantry — nothing to buy, nothing wasted. Or pick <strong>Suggest a meal — I'll shop</strong> and anything missing gets added to your shared list automatically.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">It knows both your diets and allergies, and it never suggests anything either of you can't eat. Ask it anything — "something quick for tonight", "use up our spinach".</p>
  <a href="https://cooktwo.app/PWA" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Ask what to cook</a>`;
  return {
    subject: 'Now ask: what should we cook?',
    preview: 'Meals from what you already have — this is the good part.',
    html: wrap(body),
    text: `${greet(ctx)} The payoff: ask "What should we cook?" Cook with what we have = meals from your pantry only. Suggest a meal — I'll shop = missing items go straight to your list. It knows both your diets and allergies. https://cooktwo.app/PWA`,
  };
}

function onboardingTwoPlates(ctx: FallbackContext): TemplateOutput {
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} Here's the thing no other app does: <strong>one prep, two plates</strong>. You and your partner eat the same dinner — but each plate is portioned for that person's body and goal.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">If one of you is cutting and one is maintaining, the AI adjusts each plate: your calories, your protein, your portions — from the same pan. No cooking two separate meals, no "is this ok for my diet?".</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">To make it personal, both of you should set a goal (and optional body metrics) in the Profiles tab — it takes each of you under a minute.</p>
  <a href="https://cooktwo.app/PWA" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Set your goals</a>`;
  return {
    subject: 'One dinner. Two plates. Here\'s how.',
    preview: 'Same pan, portioned for each of you — set your goals.',
    html: wrap(body),
    text: `${greet(ctx)} The thing no other app does: one prep, two plates. Same dinner, but each plate portioned for that person's body and goal — from the same pan. Set your goal (and optional body metrics) in Profiles to make it personal: https://cooktwo.app/PWA`,
  };
}

function onboardingHabitLoop(ctx: FallbackContext): TemplateOutput {
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} Last step of the tour — and the one that makes CookTwo run itself. When you finish cooking, tap <strong>"We cooked it"</strong> on the meal.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">Three things happen automatically: the ingredients leave your pantry, the recipe is saved to your collection, and the AI gets smarter about what to suggest next. Confirming your cooks is what keeps the whole system honest.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">Cook something tonight and tap it — that's the whole habit. From here on, keep your list and pantry current, and dinner plans itself. One dinner. Two plates. Zero arguments.</p>
  <a href="https://cooktwo.app/PWA" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Cook &amp; confirm</a>`;
  return {
    subject: 'The last step: tap "We cooked it"',
    preview: 'Confirm a cook and your kitchen runs itself from here.',
    html: wrap(body),
    text: `${greet(ctx)} Last step: when you finish cooking, tap "We cooked it". Ingredients leave your pantry, the recipe saves itself, and suggestions get smarter. Cook tonight and tap it — that's the whole habit. https://cooktwo.app/PWA`,
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
    case 'onboarding_partner': return onboardingPartner(ctx);
    case 'onboarding_shopping_list': return onboardingShoppingList(ctx);
    case 'onboarding_pantry': return onboardingPantry(ctx);
    case 'onboarding_ai_meals': return onboardingAiMeals(ctx);
    case 'onboarding_two_plates': return onboardingTwoPlates(ctx);
    case 'onboarding_habit_loop': return onboardingHabitLoop(ctx);
    case 'first_meal_logged': return firstMealLogged(ctx);
    case 'meal_streak': return mealStreak(ctx);
    case 'inactivity_nudge': return inactivityNudge(ctx);
    case 'partner_invite': return partnerInvite(ctx);
    case 'premium_pitch': return premiumPitch(ctx);
    case 'app_tip': return appTip(ctx);
    default: return welcome(ctx);
  }
}
