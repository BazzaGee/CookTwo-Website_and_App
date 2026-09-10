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

// ── Tip topic pool ───────────────────────────────────────────────
// Each tip covers ONE small feature. The engine picks a topic per user-week
// (deterministic) and passes the key as the template variant; the AI writer
// gets `brief`, the fallback uses the rest.

export interface TipTopic {
  key: string;
  /** AI writer brief — what to teach in this tip */
  brief: string;
  subject: string;
  preview: string;
  /** Single-paragraph fallback body (appended after the greeting) */
  line: string;
  /** Plain-text fallback body */
  textLine: string;
}

export const TIP_TOPICS: TipTopic[] = [
  {
    key: 'regulars',
    brief: 'Teach "Your regulars" on the shopping list: items they buy often appear as one-tap chips, so re-adding the weekly staples takes seconds.',
    subject: 'Your usuals, one tap away',
    preview: 'The things you buy every week are already waiting.',
    line: 'Quick tip: the things you buy most often show up as one-tap chips on your shopping list under "Your regulars" — your weekly staples are basically pre-typed for you.',
    textLine: 'Quick tip: your most-bought items appear as one-tap chips on your shopping list ("Your regulars") — weekly staples are basically pre-typed.',
  },
  {
    key: 'offline',
    brief: 'Teach offline mode: CookTwo works without internet — add or check off items anywhere, and everything syncs the moment you reconnect.',
    subject: 'No internet? No problem',
    preview: 'CookTwo works offline — it catches up later.',
    line: 'Quick tip: CookTwo works offline. Add items or check things off with zero bars — everything queues up and syncs to your partner\'s phone the moment you\'re back online.',
    textLine: 'Quick tip: CookTwo works offline — add or check off items with no signal and it syncs to your partner once you reconnect.',
  },
  {
    key: 'push',
    brief: 'Teach notifications: enable push so each partner sees the moment the other adds to the list, checks something off, or joins an activity — no "did you get milk?" texts.',
    subject: 'See it the moment they add it',
    preview: 'Turn on notifications — no more "did you get milk?" texts.',
    line: 'Quick tip: turn on notifications in the app and you\'ll see the moment your partner adds something to the list or checks it off at the store — which quietly kills the "did you get the milk?" text.',
    textLine: 'Quick tip: turn on notifications to see the moment your partner adds or checks off list items — no more "did you get the milk?" texts.',
  },
  {
    key: 'diet_browser',
    brief: 'Teach the built-in diet reference: browse evidence-graded diets (rules, what to eat) and intermittent-fasting protocols (16:8, 5:2, OMAD) that stack on top of any diet.',
    subject: 'There\'s a diet guide hiding in your app',
    preview: 'Evidence-graded diets + fasting protocols, built in.',
    line: 'Quick tip: the app has a built-in diet reference — tap through a diet to see its rules and what to eat, plus intermittent-fasting protocols (16:8, 5:2, OMAD and more) that stack on top of any diet.',
    textLine: 'Quick tip: the app has a built-in diet reference — rules, what to eat, plus fasting protocols (16:8, 5:2, OMAD) that stack on any diet.',
  },
  {
    key: 'two_plates',
    brief: 'Teach adaptive plating: with goals set, every AI meal shows per-plate calories and macros — same pan, each plate portioned for that person.',
    subject: 'Same pan. Two different plates.',
    preview: 'Each plate portioned to each of you — here\'s how.',
    line: 'Quick tip: once you both have a goal set in Profiles, every meal suggestion shows each plate\'s calories and protein separately — one pan on the stove, two portions that fit the two of you.',
    textLine: 'Quick tip: with goals set in Profiles, every meal shows each plate\'s calories and protein — one pan, two portions that fit you both.',
  },
  {
    key: 'bulk_add',
    brief: 'Teach bulk adding: type a whole shop at once — comma-separated ("milk, eggs, 2 bread, chicken") — and the list auto-categorizes into aisles.',
    subject: 'Type your whole shop in one line',
    preview: '"milk, eggs, 2 bread" — done. It sorts itself.',
    line: 'Quick tip: you don\'t have to add items one by one — type the whole shop in one line like "milk, eggs, 2 bread, chicken" and the list sorts everything into aisles for you.',
    textLine: 'Quick tip: type your whole shop in one line — "milk, eggs, 2 bread, chicken" — and the list sorts it into aisles.',
  },
  {
    key: 'done_shopping',
    brief: 'Teach the Done Shopping flow: check items off in-store, tap Done Shopping at home, and everything moves into the pantry automatically — stocking the pantry with zero extra effort.',
    subject: 'The one tap that stocks your pantry',
    preview: 'Done Shopping moves everything where it belongs.',
    line: 'Quick tip: when you\'re home from the store, tap "Done Shopping" — everything you checked off moves straight into your pantry automatically. Your pantry stays stocked with zero extra effort.',
    textLine: 'Quick tip: tap "Done Shopping" at home and everything you checked off moves straight into your pantry automatically.',
  },
  {
    key: 'privacy',
    brief: 'Teach body-profile privacy: weight/height/age are private by default between partners — the AI still uses them for portions, but only you can see them. Toggle visibility in your profile.',
    subject: 'Your numbers stay yours',
    preview: 'Body metrics are private by default — here\'s the toggle.',
    line: 'Quick tip: your body metrics are private by default — the AI uses them to size your plate, but your partner can\'t see your weight, height or age unless you flip the visibility toggle in your profile.',
    textLine: 'Quick tip: body metrics are private by default — the AI uses them for your portions, but only you can see them (toggle in your profile).',
  },
  {
    key: 'pantry_plain_english',
    brief: 'Teach plain-English pantry input: type "chicken, 2 cups rice, spinach" and the AI parses quantities, units and categories — no dropdowns.',
    subject: 'Type your fridge like you\'d say it',
    preview: '"chicken, 2 cups rice, spinach" — the AI sorts it.',
    line: 'Quick tip: type what\'s in your kitchen in plain English — "chicken, 2 cups rice, spinach" — and the pantry AI works out the items, quantities and categories. No dropdowns, no forms. Just type.',
    textLine: 'Quick tip: type your pantry in plain English ("chicken, 2 cups rice, spinach") and the AI sorts out items, quantities and categories.',
  },
];

function appTip(ctx: FallbackContext, variant?: string): TemplateOutput {
  const topic = TIP_TOPICS.find((t) => t.key === variant) ?? TIP_TOPICS[0];
  if (!topic) throw new Error('TIP_TOPICS pool must not be empty');
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} ${topic.line}</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">One small thing — that's the whole email.</p>
  <a href="https://cooktwo.app/PWA" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Try it</a>`;
  return {
    subject: topic.subject,
    preview: topic.preview,
    html: wrap(body),
    text: `${greet(ctx)} ${topic.textLine} https://cooktwo.app/PWA`,
  };
}

function feedbackRequest(ctx: FallbackContext): TemplateOutput {
  const body = `<p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">${greet(ctx)} Quick one — and an honest one.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">CookTwo is in early development. What you're using isn't the finished product — it's the start of one, and it improves every week because of the people actually using it.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 18px;">So I'd genuinely love your feedback: anything at all — something confusing, something missing, something you love, or an idea that would make it work better for you and your partner. Big or small, it goes straight into what gets built next.</p>
  <p style="color:#6B7B6C;font-size:15px;line-height:1.7;margin:0 0 24px;">The easiest way: <strong>just reply to this email</strong> — it comes straight to us. Or use the form at <a href="https://cooktwo.com/contact" style="color:#7A9E7E;">cooktwo.com/contact</a> and pick "App Feedback".</p>
  <a href="https://cooktwo.com/contact" style="display:inline-block;background:#7A9E7E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">Share your feedback</a>`;
  return {
    subject: 'What would make CookTwo better for you?',
    preview: 'It\'s early days — your feedback decides what gets built next.',
    html: wrap(body),
    text: `${greet(ctx)} Quick one — and an honest one. CookTwo is in early development; what you're using isn't the finished product, and it improves every week because of the people using it. I'd genuinely love your feedback — something confusing, missing, loved, or an idea. Big or small, it goes straight into what gets built next. Just reply to this email, or use cooktwo.com/contact (pick "App Feedback").`,
  };
}

export function getFallbackTemplate(type: string, ctx: FallbackContext, variant?: string): TemplateOutput {
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
    case 'app_tip': return appTip(ctx, variant);
    case 'feedback_request': return feedbackRequest(ctx);
    default: return welcome(ctx);
  }
}
