# Cupla — Product Development Steps

## The Honest Build Plan: 7 Steps to a Working Product

**Status:** Living Document  
**Last Updated:** May 24, 2026  
**Related Documents:** 
- `Cupla_Market_Analysis.md` (strategy & positioning)
- `Market_Analysis_2.md` (competitive landscape)
- `Cloudflare Strategy/cupla_cloudflare_strategy.md` (technical implementation)

---

## The Core Principle

> **Start with a shared grocery list that syncs instantly. Everything else is Phase 2+.**

This document breaks the massive feature set into **7 sequential steps**, where each step:
- Works as a standalone product
- Builds dependency for the next step
- Can be shipped and validated independently
- Has clear "done" criteria

---

## Step 1: Shared Grocery List with Real-Time Sync

### START HERE — This Is Your Foundation

**The Problem You're Solving:**  
Couples buy the same thing twice. One person goes to the store, the other has no idea what's been purchased. Or they call/text constantly: "Did you get milk?"

**What You're Building:**  
A grocery list that two people see simultaneously. Changes appear instantly. No app download required.

**Why This Step First:**
- **Immediate value:** AnyList charges for this. You're giving it away free.
- **Daily use case:** People grocery shop 2-3x per week. This creates habit.
- **Proves the tech:** If WebSocket sync doesn't feel magical, nothing else will.
- **Network effect:** Both partners must adopt. If they do, they're locked in.
- **Zero AI required:** No Anthropic costs. No complexity. Just sync.

**What to Build:**

| Component | Details |
|-----------|---------|
| **Frontend** | React + Vite PWA skeleton. Three tabs: Shopping (active), Profiles (disabled), Meal Plan (disabled) |
| **Backend** | Cloudflare Worker (Hono) with basic routing |
| **Real-time engine** | Durable Object: `HouseholdSync` with WebSocket connections |
| **Auth** | Invite code pairing: Partner 1 creates household → gets 6-digit code → Partner 2 joins with code → both get JWTs stored in localStorage |
| **Data storage** | DO's built-in SQLite (no D1 yet) — just grocery_items table |
| **Features** | Add item, check off, delete, reorder — all synced live |

**What to SKIP (Resist Temptation):**
- ❌ No D1 database yet
- ❌ No AI anything
- ❌ No profiles or dietary preferences
- ❌ No pantry tracking
- ❌ No meal plans
- ❌ No PWA polish (icons, install prompts)
- ❌ No offline support beyond basic caching
- ❌ No push notifications

**Success Criteria (Move to Step 2 When):**
- [ ] Open two browser tabs on different devices
- [ ] Add "Milk" in Tab A → appears in Tab B in under 100ms
- [ ] Check off "Milk" in Tab B → disappears from Tab A instantly
- [ ] Close both tabs, reopen → list state persists
- [ ] Invite code flow works: create → share → join → both see same list
- [ ] App loads in under 2 seconds on 3G

**Validation Test:**
> Give the URL to 3 couples. Ask them to use it for grocery shopping for one week. If they use it 2+ times and both partners engage, you've proven the collaboration layer works.

---

## Step 2: PWA Install + Mobile Polish

### Make It Feel Like a Real App

**The Problem:**  
Browser tabs get lost. Users forget the URL. The experience feels temporary.

**What You're Building:**  
An app that installs to the home screen, works offline, and feels native.

**Why This Step Second:**
- **Distribution advantage:** "Share a link" only works if the result feels like an app.
- **Retention:** Home screen icon = daily visibility = habit formation.
- **Offline credibility:** Users will be in supermarkets with no signal.

**What to Build:**

| Component | Details |
|-----------|---------|
| **PWA manifest** | `vite-plugin-pwa` generates manifest.json with icons, theme colors, display mode |
| **Service worker** | Cache strategies: app shell (cache-first), grocery list (network-first + stale-while-revalidate) |
| **Icons** | 192x192 and 512x512 PNGs with maskable variant |
| **Install experience** | Custom "Add to Home Screen" banner (not just browser default) |
| **Offline behavior** | App shell always loads; grocery list shows last known state with "offline" indicator; changes queue and sync on reconnect |
| **Mobile polish** | Proper viewport meta, touch targets 44px+, bottom navigation (thumb-friendly), momentum scrolling |

**What to SKIP:**
- ❌ No Background Sync API yet (just show "offline" state)
- ❌ No push notifications
- ❌ No splash screens (browser handles this)

**Success Criteria:**
- [ ] Visit URL on iPhone Safari → "Add to Home Screen" prompt appears
- [ ] Install it → app opens fullscreen, no browser chrome
- [ ] Kill network → app still opens, shows cached list
- [ ] Re-enable network → queued changes sync
- [ ] Test on Android Chrome → same behavior
- [ ] Lighthouse PWA audit scores 90+ on all categories

**Validation Test:**
> Ask a user to install it without instructions. If they can do it in under 30 seconds, your PWA experience is good enough.

---

## Step 3: Partner Profiles + D1 Database

### Who Are You Cooking For?

**The Problem:**  
The app needs to know who's eating. Different people have different needs.

**What You're Building:**  
Persistent profiles for both partners with dietary preferences.

**Why This Step Third:**
- **Foundation for AI:** You can't generate useful meals without knowing dietary constraints.
- **Creates investment:** Users who set up profiles are more likely to stay.
- **Enables personalization:** Vegetarian, allergies, etc. — the basics.

**What to Build:**

| Component | Details |
|-----------|---------|
| **D1 database** | Create `cupla` database with migrations |
| **Schema** | households, partners, meal_plans, push_subscriptions tables |
| **Profiles tab** | Enable the Profiles tab: name, dietary preferences (vegan/vegetarian/omnivore), allergies, dislikes |
| **Data flow** | Profiles stored in D1 (relational, persistent). Grocery list still in DO SQLite (fast, real-time). |
| **Household connection** | Both partners' profiles linked to same household_id |

**D1 Schema (Minimum Viable):**
```sql
CREATE TABLE households (
  id TEXT PRIMARY KEY,
  invite_code TEXT UNIQUE,
  created_at INTEGER
);

CREATE TABLE partners (
  id TEXT PRIMARY KEY,
  household_id TEXT REFERENCES households(id),
  slot INTEGER CHECK(slot IN (1, 2)),
  name TEXT,
  diet TEXT, -- 'vegetarian', 'vegan', 'omnivore', etc.
  allergies TEXT, -- comma-separated
  updated_at INTEGER
);
```

**What to SKIP:**
- ❌ No weight, height, BMI calculations yet
- ❌ No macro targets or goals
- ❌ No body type or activity level
- ❌ No "my goals vs. your goals" complexity

**Success Criteria:**
- [ ] Both partners can set their name and dietary preferences
- [ ] Profiles persist after app close/reopen
- [ ] One partner can see the other's dietary preferences
- [ ] App shows "Alex (Vegetarian)" and "Jordan (Omnivore)" somewhere
- [ ] Database migrations work locally and in production

**Validation Test:**
> A couple sets up profiles. The vegetarian partner sees "Alex — Vegetarian" on screen. They feel seen. The app acknowledges their identity.

---

## Step 4: Pantry Tracking

### What Do You Actually Have?

**The Problem:**  
People buy food, forget what they have, waste money, order takeout because "we have nothing to eat."

**What You're Building:**  
A simple list of what's in your kitchen right now.

**Why This Step Fourth:**
- **AI prerequisite:** The magic moment is "we have chicken, rice, and spinach → here's dinner." Pantry is the input.
- **Waste reduction:** Visualizing what you have reduces duplicate buying.
- **Familiar concept:** Users understand "what's in my fridge."

**What to Build:**

| Component | Details |
|-----------|---------|
| **Pantry tab** | Enable the Pantry tab. Simple list: ingredient name + quantity |
| **Storage** | DO SQLite (same as grocery list — fast, real-time synced between partners) |
| **Input methods** | Text field with natural language: "chicken, 2 cups rice, half an onion" |
| **Parsing** | Backend splits on commas, normalizes names ("chicken breast" → "chicken") |
| **Quick add** | "Move to pantry" button when checking off grocery items (optional but nice) |

**DO SQLite Schema Addition:**
```sql
CREATE TABLE pantry (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  qty TEXT,
  added_at INTEGER
);
```

**What to SKIP:**
- ❌ No barcode scanning (complex, kills momentum)
- ❌ No expiration dates (extra data entry friction)
- ❌ No categories (pantry, fridge, freezer — keep it flat)
- ❌ No auto-depletion when you cook (too complex for MVP)

**Success Criteria:**
- [ ] Type "chicken, rice, spinach, onion" → appears as four separate items
- [ ] Both partners see the same pantry list
- [ ] Add item on one phone → appears on other phone instantly
- [ ] Pantry persists after app close
- [ ] 10 ingredients can be added in under 30 seconds

**Validation Test:**
> Ask users: "What's in your kitchen right now?" They type it in. It appears as a clean list. They feel organized.

---

## Step 5: AI Meal Generation (The Magic Moment)

### From Pantry to Dinner

**The Problem:**  
The "what's for dinner" argument. Decision fatigue. Staring into the fridge hoping dinner invents itself.

**What You're Building:**  
One button that looks at your pantry + dietary preferences and suggests what to cook.

**Why This Step Fifth:**
- **All inputs ready:** You have pantry contents + dietary preferences. AI can now do something useful.
- **Differentiation:** AnyList can't do this. Leanlife can't do this. This is where you become more than a shared list.
- **The hook:** This is the moment users go "oh, this is actually smart."

**What to Build:**

| Component | Details |
|-----------|---------|
| **AI Gateway** | Set up Cloudflare AI Gateway with Anthropic API key (Wrangler secret) |
| **Prompt engineering** | POST /meal-plan/generate endpoint. Prompt includes: pantry items, both partners' dietary preferences, time constraint (default: 30 min) |
| **Meal Plan tab** | Enable the Meal Plan tab. Shows one generated meal at a time |
| **Output format** | Recipe name, ingredients needed, steps, time estimate |
| **Smart grocery integration** | "Add missing ingredients to grocery list" — one-tap population |
| **Caching** | AI Gateway caches identical requests (24hr TTL) — both partners opening app = one API call |

**Example Prompt (MVP Version):**
```
We have these ingredients: chicken breast, white rice, spinach, onion, garlic.
Partner 1 is vegetarian. Partner 2 has no dietary restrictions.
Suggest a dinner that uses mostly what we have. 30 minutes max.

Output format:
- Recipe name
- Ingredients needed (mark which we have vs. need to buy)
- Brief steps
- Time estimate
```

**What to SKIP:**
- ❌ No macro calculations (calories, protein, carbs)
- ❌ No adaptive portions yet (same meal for both)
- ❌ No "one prep, two plates"
- ❌ No weekly meal planning (just one meal at a time)
- ❌ No recipe history or favorites yet
- ❌ No image generation

**Success Criteria:**
- [ ] Click "What should we cook?" → AI generates a meal in under 5 seconds
- [ ] Suggested meal uses mostly pantry ingredients
- [ ] Missing ingredients can be added to grocery list with one tap
- [ ] Recipe respects dietary preferences (vegetarian partner gets vegetarian meal)
- [ ] Generation costs under $0.02 per request (with caching)

**Validation Test:**
> User looks in their fridge, feels lost, opens app, taps button, gets a real suggestion that uses what they have. They actually cook it.

---

## Step 6: Meal Calendar + Smart Grocery Population

### Plan the Week, Shop Once

**The Problem:**  
Daily decision fatigue. Multiple grocery trips per week. No advance planning.

**What You're Building:**  
Plan a week of meals. Generate one grocery list for everything.

**Why This Step Sixth:**
- **Habit formation:** Weekly planning = higher retention.
- **Value compound:** The more meals you plan, the smarter the grocery list.
- **Natural progression:** Users who generate one meal will want to plan the week.

**What to Build:**

| Component | Details |
|-----------|---------|
| **Calendar view** | Weekly grid (Mon-Sun) with breakfast/lunch/dinner slots |
| **Generate week** | Button: AI generates 7 days of meals based on pantry + preferences |
| **Manual assignment** | Drag/drop or tap to assign generated meals to specific days |
| **Smart grocery** | "Populate grocery list from week's meals" — aggregates all missing ingredients across 7 days |
| **Meal history** | Store generated meals in D1 (recipes table) for reuse |
| **Deduplication** | "You need onions for 3 recipes this week — buy 6 onions total" |

**What to SKIP:**
- ❌ No nutritional breakdown per day
- ❌ No macro targets or goal tracking
- ❌ No "swap this meal for that one" optimization
- ❌ No auto-scheduling (AI doesn't decide Monday vs. Tuesday)

**Success Criteria:**
- [ ] Generate a week of meals in one button press
- [ ] All 7 meals respect both partners' dietary preferences
- [ ] One-tap populate grocery list with all missing ingredients
- [ ] Grocery list is deduplicated (no "onions" appearing 3 times)
- [ ] Meals can be manually moved between days

**Validation Test:**
> Couple plans their week on Sunday. Goes grocery shopping once. Cooks at home 5+ nights that week. Considers the app "essential."

---

## Step 7: Adaptive Shared Cooking (The Moat)

### One Prep, Two Plates

**The Problem:**  
Partner A wants to lose weight. Partner B wants to build muscle. They want to cook together, eat together, but hit different nutritional targets.

**What You're Building:**  
One shared cooking workflow with AI-generated plating instructions for each person.

**Why This Step Last:**
- **Requires everything else:** Profiles, pantry, AI meal generation, D1 database.
- **Complex prompt engineering:** The hardest AI challenge in the app.
- **True differentiation:** Yummo has this concept but no real-time sync. Leanlife has sync but no adaptive cooking. You now have both.
- **Premium feature:** This justifies the subscription.

**What to Build:**

| Component | Details |
|-----------|---------|
| **Body profiles** | Add to partners table: weight_kg, height_cm, age, gender, activity_level, goal (lose/maintain/gain) |
| **TDEE calculation** | Auto-calculate daily calorie needs using Mifflin-St Jeor equation |
| **AI prompt upgrade** | Complex prompt: "Same meal. Partner A needs 450 kcal, low carb. Partner B needs 700 kcal, high protein. Give one shared prep workflow with two plating instructions." |
| **Plating UI** | Side-by-side view: "Alex's plate" vs. "Jordan's plate" with different portions |
| **Macro display** | Show calories and macros for each person's plate (optional toggle) |
| **Goal tracking** | Simple charts: "You're averaging 1,850 cal/day this week vs. 2,000 target" |

**Example Output:**
```
RECIPE: Chicken Stir-Fry
PREP (shared): Cook together — same pan, same ingredients

ALEX'S PLATE (Weight Loss):
- 4oz chicken over bed of spinach
- 1/2 cup rice on the side
- Extra vegetables
≈ 450 cal | 35g protein | 30g carbs

JORDAN'S PLATE (Muscle Gain):
- 6oz chicken over full cup of rice
- Same vegetables
≈ 700 cal | 55g protein | 65g carbs
```

**What to SKIP:**
- ❌ No precise macro tracking (just targets, not every meal logged)
- ❌ No weight logging or progress photos
- ❌ No "adjust portions" manual controls (AI decides, users can reject)
- ❌ No recipe importing from URLs

**Success Criteria:**
- [ ] Partner A enters their stats: 30F, 165cm, 70kg, sedentary, lose weight → gets 1,600 cal target
- [ ] Partner B enters their stats: 30M, 180cm, 85kg, active, gain muscle → gets 2,600 cal target
- [ ] AI generates a meal with different plating for each
- [ ] Both partners eat together, same cooking session, different portions
- [ ] Both feel satisfied and on track with their goals

**Validation Test:**
> Couple with different goals (e.g., weight loss + muscle gain) uses the app for 2 weeks. Both report hitting their targets without cooking separate meals. They tell friends "we eat the same dinner but different portions."

---

## What to Cut Entirely (For Now)

These features are **explicitly out of scope** for the first 6+ months:

| Feature | Why Cut | When to Reconsider |
|---------|---------|-------------------|
| **Push notifications** | Nice-to-have. Users have the app open when using it. Creates complexity. | Step 8+ if retention is an issue |
| **MCP server** | Power user feature. 0.1% of users will use this. | When you have 1,000+ power users asking for it |
| **Recipe importing** | Complex scraping. AI generates recipes from pantry — that's enough. | When users complain "I want to save my grandma's recipe" |
| **Barcode scanning** | Death trap. High friction, low value. Natural language is faster. | Never unless users explicitly demand it |
| **Goal tracking charts** | Premature. You need users before you need retention analytics. | Step 7+ when adaptive cooking exists |
| **Budget tracking** | Out of scope. You're a food app, not a finance app. | Never |
| **Social features** | Premature. Community features need a community. | Year 2+ if there's organic sharing behavior |
| **Offline meal generation** | Contradiction — AI needs network. Cached plans are enough. | Never — this is a feature, not a bug |
| **Multi-household support** | You're for couples, not roommates or families. | If users explicitly ask for "add my mom" |
| **Restaurant integration** | "Where to eat" is a different problem. | Never — stay focused on home cooking |
| **Nutrition database lookup** | Too complex. AI handles the math. | Never — rely on AI for nutrition data |
| **Shopping at multiple stores** | "Aldi + Whole Foods" adds complexity. One list per household. | If users explicitly complain about this |

---

## Build Order Dependencies

```
Step 1: Shared Grocery List
    ↓
Step 2: PWA Install + Mobile Polish
    ↓
Step 3: Partner Profiles + D1
    ↓
Step 4: Pantry Tracking
    ↓
Step 5: AI Meal Generation (Magic Moment)
    ↓
Step 6: Meal Calendar + Smart Grocery
    ↓
Step 7: Adaptive Shared Cooking (Moat)
```

**Key Insight:** Each step adds value. You can ship Step 1 and have a useful product. Steps 2-7 make it better, but Step 1 is the foundation.

---

## Success Metrics by Step

| Step | Primary Metric | Target |
|------|---------------|--------|
| **1** | Weekly grocery list uses per household | 2+ times |
| **1** | Both partners active within 48 hours of pairing | >80% |
| **2** | PWA install rate | >50% of active users |
| **3** | Profile completion rate | >70% of households |
| **4** | Pantry items added per household | >10 items |
| **5** | AI meal generation per household per week | >2 meals |
| **6** | Weekly meal planning adoption | >30% of households |
| **7** | Adaptive cooking usage (premium) | >50% of premium households |

---

## Timeline Reality Check

**Conservative Estimates (Part-time development):**

| Step | Duration | Cumulative |
|------|----------|------------|
| Step 1 | 2 weeks | Week 2 |
| Step 2 | 1 week | Week 3 |
| Step 3 | 1 week | Week 4 |
| Step 4 | 1 week | Week 5 |
| Step 5 | 2 weeks | Week 7 |
| Step 6 | 2 weeks | Week 9 |
| Step 7 | 3 weeks | Week 12 |

**Total: ~3 months to full MVP (Step 7)**

**But remember:** Step 1 is shippable. You could launch at Step 1, get feedback, iterate. Steps 2-7 happen in parallel with user feedback.

---

## The Hardest Truth (From Your Own Analysis)

> *"Overbuilding is the #1 risk. Too many features = failure risk."*

**Phase 1 in your strategy doc is just Step 1 of this document.** Your own analysis says: "Simple, fast, useful. Prove couples will adopt a shared food tool."

**The best MVP is a shared grocery list that syncs so fast it feels like magic.**

Everything else is an upgrade.

---

## Future Features (On Hold)

These features are fully designed but intentionally parked. Do not implement until explicitly approved.

| Feature | Spec Document | When to Revisit |
|---------|--------------|-----------------|
| **Feature 8: Couple's Meal Picker** | `Feature_8_Couples_Meal_Picker.md` | After Step 5 (AI Meal Generation) is shipped and validated |

---

## Next Actions

1. **Read the technical spec:** `Cloudflare Strategy/cupla_cloudflare_strategy.md` for implementation details
2. **Start Step 1:** Scaffold the React + Vite PWA, set up Cloudflare Worker, build the Durable Object
3. **Set the first milestone:** Two browser tabs syncing a grocery list in under 100ms
4. **Ship it to real couples:** Get feedback before adding complexity

---

## Document Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 24, 2026 | Initial creation — 7-step build order with dependencies and cut features |
| 1.1 | May 26, 2026 | Added Future Features section referencing parked Feature 8 (Couple's Meal Picker) |

---

*This is a living document. Update it as you learn, but resist the temptation to add scope. The hard part is not building features — it's building the right features in the right order.*
