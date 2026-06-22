# Cupla — Market Update May 2026

**Classification:** Internal — Confidential
**Date:** May 28, 2026
**Status:** Living Document — Updated Competitive Intelligence Report
**Scope:** 35+ competitors verified via live web research, cross-referenced with internal analysis
**Sources:** Internal strategy documents (Cupla_Market_Analysis.md, Market_Analysis_2.md, 00-master-competitive-landscape.md), both codebases (Web PWA + Android Kotlin), live competitor web research (May 2026)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Cupla Product Status — May 2026](#2-cupla-product-status--may-2026)
3. [Competitor Status Updates — Live Verified May 2026](#3-competitor-status-updates--live-verified-may-2026)
4. [Updated Competitive Gap Matrix](#4-updated-competitive-gap-matrix)
5. [What's Eroding vs. What's Still Defensible](#5-whats-eroding-vs-whats-still-defensible)
6. [Market Trends 2026](#6-market-trends-2026)
7. [Strategic Recommendations — Updated Priority Order](#7-strategic-recommendations--updated-priority-order)
8. [Appendix: Complete Competitor Directory](#8-appendix-complete-competitor-directory)

---

## 1. Executive Summary

### The Bottom Line

**The market gap is real but narrowing.**

After exhaustive analysis of internal strategy documents, both Cupla codebases, and live web verification of 35+ competitors in May 2026, the conclusion is:

> **No single product combines real-time couples collaboration, adaptive shared cooking (one meal, two plates), pantry-first AI, and relationship-first UX into one integrated system.**

This was true when the original analysis was written. It remains true today. However, the competitive landscape has shifted in important ways:

### What Changed

| Change | Impact | Direction |
|--------|--------|-----------|
| **Healthspan emerged** with per-person macros, household dashboard, auto-adjusting recipes | NEW HIGH THREAT | 🔴 Concern |
| **PlateMates evolved** — added AI recipe gen, pantry mode, smart substitutions | STRONGER competitor | ⚠️ Warning |
| **Clove launched** — ex-Canva team, $4.15M VC, free AI pantry-aware planning | Funded free competitor | ⚠️ Warning |
| **Yummo stagnated** — no new features, no marketing, solo founder | Window extended | ✅ Good news |
| **Fitia did NOT pivot** to couples — still sync-based, clinical, family-oriented | Window extended | ✅ Good news |
| **"One meal, different plates" concept spreading** — PlanEat AI, Jenova, Healthspan all discussing it | Category awareness growing | ⚠️ Warning |
| **Free becoming default** for couples apps — DuoDine, slrp, Cloche, LeanLife | Pricing pressure | ⚠️ Warning |
| **Pantry AI now table stakes** — 5+ competitors offer pantry-based suggestions | Eroding advantage | ⚠️ Warning |
| **Couples now a recognized category** — 6+ apps explicitly building for couples | Market validated | ✅ Good news |

### The Verdict

The window is open but actively closing. Two competitors — **Healthspan** (functional breadth) and **PlateMates** (conceptual depth) — are on trajectories that could converge on Cupla's space within 6-12 months. The priority is shipping the complete product loop before they mature.

**Cupla's remaining defensible position:** The self-reinforcing Pantry → AI Meals → Shopping → Pantry loop, combined with real-time WebSocket collaboration, adaptive cooking with dual-plating UX, and relationship-first design. No competitor has assembled all of these into one system.

---

## 2. Cupla Product Status — May 2026

### 2.1 Two Codebases Exist

Cupla currently has two separate implementations:

| Dimension | Web App (Cloudflare PWA) | Android App (Kotlin/Gemini) |
|-----------|-------------------------|----------------------------|
| **Location** | `Cupla Market_Gap/couples-food-system/` | `couples-food-system (1)/` (Downloads) |
| **Platform** | PWA — works in any browser | Native Android (Kotlin + Jetpack Compose) |
| **Backend** | Cloudflare Workers (Hono) + Durable Objects + D1 | Local Room database + Gemini API |
| **Real-time sync** | WebSocket via Durable Objects (sub-100ms) | Simulated sync (mock, not real WebSocket) |
| **AI** | AI Gateway → Anthropic (not yet built) | Gemini 3.5 Flash API (working) |
| **Database** | D1 (SQLite) + DO SQLite | Room (SQLite) |

### 2.2 Feature Status by Codebase

| Feature | Web App (PWA) | Android App | Notes |
|---------|:---:|:---:|-------|
| **Shared Grocery List** | ✅ Built | ✅ Built | Web has real WebSocket sync; Android simulates sync |
| **Real-Time Sync** | ✅ DO + WebSocket | ⚠️ Simulated | Android mocks partner actions every 20 seconds |
| **Pantry Tracking** | ⚠️ UI Built | ✅ Built | Both have natural language batch input |
| **Partner Profiles** | ⚠️ Skeleton | ✅ Full | Android has complete body profiles with TDEE calculation |
| **TDEE Calculator** | ⚠️ Partial (tdee.ts exists) | ✅ Built | Android uses Mifflin-St Jeor equation |
| **AI Meal Generation** | ❌ Not Built | ✅ Built | Android uses Gemini 3.5 Flash with JSON schema output |
| **Adaptive Cooking** | ❌ Not Built | ✅ Built | Android has full dual-plating cards with per-person macros |
| **Meal Calendar** | ❌ Not Built | ⚠️ Partial | Android has day selector but no weekly generation |
| **Smart Grocery Population** | ❌ Not Built | ⚠️ Partial | Android can move pantry items to shopping list |
| **PWA Install** | ⚠️ Partial | N/A | Web has manifest/service worker config |
| **Offline Support** | ⚠️ Partial | ✅ Local DB | Android works fully offline (Room); web has service worker |

### 2.3 Android App — Current Feature Detail

The Android app (built via Google AI Studio) is the more feature-complete of the two codebases:

**5-Tab Navigation:**
```
Shopping | Pantry | Meal Plan | Profiles | Settings
```

**Tab 1: Shopping — "Our Shared Shopping List"**
- Add items manually or via quick-add chips (Avocado, Milk, Eggs, Spinach, Quinoa, Chicken)
- Auto-categorize into Produce, Meat, Dairy, Pantry, Other
- Check off items → move to "Checked" section
- Partner badges show who added each item (Alex = sage green, Jordan = terracotta)
- Clear purchased button
- Simulated real-time sync (partner randomly adds/checks items every 20 seconds)

**Tab 2: Pantry — "Our Pantry Inventory"**
- Natural language batch input: "2 chicken breasts, yogurt, spinach, quinoa"
- Smart parsing: detects quantities, categorizes ingredients
- Category grouping (Produce, Meat, Dairy, Pantry, Other)
- Move items to shopping list
- Delete items as used

**Tab 3: Meal Plan — "Adaptive Meal Planner"**
- Day selector (Mon-Sun)
- "Instant AI Kitchen Solver" button — generates meals using pantry items
- AI uses Gemini 3.5 Flash with structured JSON output
- Prompt includes both partners' profiles, diets, goals, calorie targets
- Processing states: Analyzing → Considering → Creating → Success
- Fallback recipes when API unavailable (Mediterranean Chicken & Quinoa, Rustic Pasta, Kitchen Scramble)
- Recipe card shows: name, description, prep time, shared ingredients
- "Start Adaptive Cooking Workflow" button

**Tab 4: Profiles — "Household Profiles & Nutrients"**
- Dual partner profiles (Alex + Jordan)
- Body stats: weight, height, age, gender
- Activity level selection
- Goal: Lose / Maintain / Gain
- Diet: Vegetarian / Vegan / Omnivore
- Allergies (comma-separated)
- Auto-calculates TDEE using Mifflin-St Jeor equation
- Example: Alex = 1,700 kcal/day (lose), Jordan = 3,200 kcal/day (gain)

**Tab 5: Adaptive Cooking View — "Split Plating Kitchen Helper"**
- Step-by-step cooking workflow with progress tracking
- **Dual Adaptive Portion Guidance:**
  - Alex's Plate (sage border): plating instructions, calorie badge, macro bars (protein/carbs/fat), notes
  - Jordan's Plate (terracotta border): plating instructions, calorie badge, macro bars, notes
- Example output:
  - Alex: 410 cal | 38g protein | 28g carbs | 14g fat
  - Jordan: 720 cal | 58g protein | 62g carbs | 26g fat
- "We Dinner Cleaned! Log Meal" completion button

**Onboarding:**
- Create Household → get 6-digit code → partner joins with code
- Pre-populated mock household for demo purposes

### 2.4 Web App — Current Feature Detail

The web app is built on Cloudflare infrastructure and has the more robust real-time architecture:

**Built:**
- Shared grocery list with real-time WebSocket sync (Durable Objects)
- Partner pairing via invite code (KV, 24hr TTL)
- Pantry tracking UI
- Basic profile skeleton
- PWA manifest and service worker configuration
- Offline queue for grocery list changes

**Not Yet Built (Steps 5-7 from build plan):**
- AI meal generation (AI Gateway → Anthropic)
- Meal calendar with weekly planning
- Adaptive shared cooking (one meal, two plates)
- Smart grocery population from meal plans

### 2.5 Product Status Summary

| Build Step | Feature | Web App | Android App |
|-----------|---------|:-------:|:-----------:|
| 1 | Shared Grocery List | ✅ Built | ✅ Built |
| 2 | PWA Install + Mobile Polish | ⚠️ Partial | N/A (native) |
| 3 | Partner Profiles + D1 | ⚠️ Skeleton | ✅ Full |
| 4 | Pantry Tracking | ⚠️ UI Built | ✅ Built |
| 5 | AI Meal Generation | ❌ Not Built | ✅ Built (Gemini) |
| 6 | Meal Calendar + Smart Grocery | ❌ Not Built | ⚠️ Partial |
| 7 | Adaptive Shared Cooking | ❌ Not Built | ✅ Built |

**Key Insight:** The Android app is functionally a complete prototype of the full product vision. The web app has the superior real-time architecture but lacks the AI and adaptive cooking layers. The strategic decision is whether to:
- (A) Complete the web app's Steps 5-7 using Cloudflare AI Gateway → Anthropic, or
- (B) Ship the Android app as the primary product, adding real sync via Firebase/supabase, or
- (C) Port the Android app's AI/adaptive logic into the web app's real-time architecture

### 2.6 The Product Loop — What Makes Cupla Unique

The power of Cupla is not in any single feature but in the self-reinforcing loop:

```
PANTRY ──────► AI MEALS ──────► SHOPPING LIST
   ▲                                │
   │                                │
   └────── "Move to Pantry" ◄───────┘
```

1. Shopping feeds Pantry (check off + move to pantry)
2. Pantry feeds AI Meals (ingredient input)
3. AI Meals feeds Shopping (missing ingredients)
4. Profiles feeds AI Meals (dietary constraints)
5. AI Meals feeds Adaptive Cooking (plating instructions)

**No competitor connects all four steps into one continuous cycle.** They have isolated features. Cupla has a system.

---

## 3. Competitor Status Updates — Live Verified May 2026

### 3.1 Yummo — VERY HIGH Threat (STAGNANT)

| Attribute | Detail |
|-----------|--------|
| **URL** | yummo.ai |
| **Tagline** | "One cooking session — two plates tailored to each of you" |
| **Status** | Live (unchanged) |
| **Founder** | Wiktor Strzelczyk (sole proprietor, Poland) |
| **Pricing** | ~$9.99/mo |
| **Platform** | Web only |

**What Changed Since Last Analysis:**
- **Nothing significant.** The product appears largely unchanged from initial launch.
- Blog is empty ("No articles found in this category")
- No press coverage, no Product Hunt launch, no funding announcements
- No Crunchbase profile, no investor mentions
- Terms updated Feb 2026, Privacy updated April 2026 — site is maintained but not actively developed
- No social media presence detected

**Current Features:**
- Weekly meal plans for couples with different calorie targets (e.g., 1600 kcal vs 2500 kcal)
- "One recipe, two variants" — shared base, separate protein/portions per person
- Supports 1–5 people with individual calorie goals and diet preferences
- Ingredient overlap across meals to reduce waste
- Auto-generated shopping lists
- Web-based, works immediately, no credit card required

**What They Still Lack:**
- ❌ No real-time collaboration between partners
- ❌ No shared editable shopping lists
- ❌ No pantry management or pantry-first AI
- ❌ No mobile apps (no App Store, no PWA)
- ❌ No relationship-first UX
- ❌ No offline support
- ❌ No marketing infrastructure
- ❌ No funding or team growth

**Assessment:** Yummo validated the demand for adaptive portions but has zero momentum. Their 6-12 month window to close gaps has NOT been used. Cupla's advantage over Yummo remains structural. **Threat level unchanged: VERY HIGH conceptually, LOW in execution.**

---

### 3.2 Fitia — HIGH Threat (UNCHANGED POSITION)

| Attribute | Detail |
|-----------|--------|
| **URL** | fitia.app |
| **Status** | Live |
| **Users** | 10M+ |
| **Funding** | YC S21, ~$3.5M annual revenue |
| **Team** | 26-28 employees |
| **Pricing** | Free / Individual $59.99/yr / Family $89.99/yr (up to 6 users) |

**What Changed Since Last Analysis:**
- **No couples-specific features added.**
- Collaboration remains Master/Slave sync, not real-time
- User complaint persists: "Every time I sync with my partner, it deletes my existing plan"
- Social pivot is breadth-first (teams, leaderboards, DMs), not couples intimacy
- "Fitia Teams" is a group challenge/competition feature, not a couples tool
- "Cooking Mode" shows combined ingredient quantities for group prep — static view, not collaborative editing

**Current Shared Features:**
- Sync Plan: Master creates, others receive with adapted portions
- Sync Shopping List: combines grocery lists from all members
- Sync Favorites: shares saved foods/recipes
- Family Plan: up to 6 users, each with individual macro targets
- Adaptive portions: same meal, different quantities per person

**What They Still Lack:**
- ❌ No couples-specific onboarding or relationship UX
- ❌ No pantry management or pantry-first AI
- ❌ No "one meal, two plates" adaptive cooking workflow
- ❌ No real-time live collaboration (sync ≠ collaboration)
- ❌ No shared kitchen UX paradigm
- ❌ No recipe splitting for different dietary needs (same meal for everyone, different quantities only)
- ❌ Built as nutrition app with collaboration added, not collaborative from ground up

**Pricing:**

| Plan | Price |
|------|-------|
| Free | Basic tracking, no meal plans |
| Individual Premium (monthly) | $19.99/mo |
| Individual Premium (annual) | $59.99/yr |
| Family Plan (annual) | $89.99/yr for up to 6 users |

**Assessment:** Fitia is still a nutrition company adding collaboration features, not a collaboration company building nutrition. Their trajectory is social/community (breadth), not couples intimacy (depth). The architectural gap (bolted-on sync vs native collaboration) persists. **Threat level unchanged: HIGH long-term, but no movement toward Cupla's space.**

---

### 3.3 PlateMates — HIGH Threat (HAS EVOLVED SIGNIFICANTLY)

| Attribute | Detail |
|-----------|--------|
| **URL** | platematesapp.com |
| **Tagline** | "One Meal, Two Ways" |
| **Status** | Live (iOS) |
| **Developer** | Athlete Mindset Inc. (Sondre Guttormsen, Norwegian Olympian) |
| **Pricing** | Free + PlateMates+ ($5.99/mo, $39.99/yr) |
| **Platform** | iOS only |

**What Changed Since Last Analysis — MAJOR EVOLUTION:**

PlateMates has added significant new features that close gaps with Cupla:

1. **AI Recipe Generation** — Generate custom split recipes from a text description
2. **Recipe Importing** — Import any recipe from a URL and auto-convert to split format
3. **Pantry Mode** — Tell it what's in your fridge, get recipe suggestions ranked by what you have
4. **Smart Substitutions** — Swap ingredients with nutrition comparisons
5. **PlateMates+ (AI tier)** — Subscription unlocks all AI features with 7-day free trial

**Current Feature Set:**
- 106 hand-curated "Three-Layer Split Recipes" — shared base + vegan path + omnivore path
- Built for two profiles during onboarding (diet, allergies, cuisines, proteins for each partner)
- Weekly meal planner with drag-and-drop calendar
- Auto-generated grocery lists organized by aisle
- Per-ingredient nutrition facts for both partners
- Community board for sharing creations
- AI recipe generation, importing, pantry mode, smart substitutions (PlateMates+)

**What They Still Lack:**
- ❌ No Android app (iOS only)
- ❌ No real-time collaborative editing
- ❌ No calorie tracking / macro logging (nutrition facts per-recipe, not a tracking system)
- ❌ No food logging or progress tracking
- ❌ No relationship-aware UX beyond dual profiles
- ❌ Very small recipe library (106 base recipes)
- ❌ Zero marketing infrastructure (2 App Store ratings)
- ❌ No "one meal, two plates" for body goals (focused on vegan/omnivore split only)

**Assessment:** PlateMates is now the **second most dangerous competitor** after Yummo. They've moved from covering 1 pillar (split recipes) to covering 2.5 pillars (adaptive cooking + partial pantry AI + partial AI generation). Still limited to vegan/omnivore dietary splits (not body-goal-based portion adaptation). Still iOS-only with zero distribution. **Threat level upgraded: HIGH and rising.**

---

### 3.4 Healthspan — NEW HIGH THREAT

| Attribute | Detail |
|-----------|--------|
| **URL** | usehealthspan.com |
| **Status** | Open Beta (code: BETA2026) |
| **Pricing** | Free during beta |
| **Platform** | iOS (TestFlight) + Android (APK) |

**What Changed Since Last Analysis — MAJOR EMERGENCE:**

Healthspan was previously flagged as LOW-MEDIUM threat. It has evolved into the **closest functional competitor to Cupla's full vision:**

**Current Features:**
- **Personalized macros for each family member** — shows different calorie/macro targets per person
- **Household dashboard** with per-person profiles (e.g., "Miguel: Lose Fat" vs "Ioana: Maintain")
- **Recipes auto-calculate nutrition per person** — portions adjust automatically
- **AI recipe creation** — "use AI to create new ones instantly"
- **Shared grocery lists** — quantities combined for the household
- **Nutrition tracking** per person
- **Meal planning calendar** — drag recipes, portions adjust per person
- **Cross-platform** — iOS + Android

**What They Still Lack:**
- ❌ Still in beta (not production-ready)
- ❌ No "one meal, two plates" narrative framing
- ❌ No pantry-first approach (no "what's in my fridge" input)
- ❌ No relationship-first UX
- ❌ No real-time collaboration depth
- ❌ No self-reinforcing product loop
- ❌ Limited user base (beta stage)

**Assessment:** Healthspan is now **the most dangerous new competitor**. They cover 4 of Cupla's pillars (per-person macros, household profiles, AI recipes, auto-adjusting portions). If they add pantry-first logic and couples framing, they become a direct competitor. **Threat level upgraded: MEDIUM-HIGH and rising. WATCH CLOSELY.**

---

### 3.5 SplitPlate — MEDIUM Threat (Unchanged)

| Attribute | Detail |
|-----------|--------|
| **URL** | splitplate.ai |
| **Tagline** | "The Split Point Method" |
| **Status** | Live (web) |
| **Pricing** | Free / Premium $59.99/yr ($5/mo) |
| **Platform** | Web only |

**Current Features:**
- "Split Point" concept — AI identifies the exact step where a recipe branches into two versions
- Supports multiple divergence types: mixed-diet couples, parents/kids, health goals, spice tolerance
- AI Recipe Adapter: paste a URL, type text, or upload a photo → get two versions
- Weekly Meal Planner
- Saved recipes library
- Servings re-adapt (adjust serving sizes)

**What They Still Lack:**
- ❌ No mobile apps (web only)
- ❌ No real-time sync or collaboration
- ❌ No food tracking or calorie counting
- ❌ No pantry management
- ❌ No couples onboarding or relationship UX
- ❌ No grocery delivery integration
- ❌ Anonymous founder, zero distribution, very early stage

**Pricing:**

| Plan | Price |
|------|-------|
| Free | Unlimited text adaptations, 5 URL/month, 5 saved recipes |
| Premium (monthly) | $8/mo |
| Premium (annual) | $59.99/yr |

**Assessment:** Conceptually strong (the "Split Point Method" is genuine IP in recipe adaptation), but zero execution beyond a web tool. Cupla should study and integrate similar branching logic into its AI pipeline. **Threat level unchanged: MEDIUM conceptual, LOW execution.**

---

### 3.6 LeanLife — MEDIUM-HIGH Threat (Minor Evolution)

| Attribute | Detail |
|-----------|--------|
| **URL** | leanlifehq.com |
| **Tagline** | "The collaborative meal planning app for couples" |
| **Status** | Live |
| **Pricing** | Free + paid (partner free when owner subscribes) |
| **Platform** | iOS + Android (NEW) |

**What Changed Since Last Analysis:**
- **Now available on Android** (Google Play, updated Mar 14, 2026)
- Rebranded from solo calorie tracker to collaborative couples meal planning
- "Only group owner needs subscription; invited partner is free"
- Privacy-first, no ads, no tracking
- Upcoming: grocery lists generated for selected days, reusing meals from history

**Current Features:**
- Real-time synced planning for two people
- Collaborative UX design
- Emotional positioning — "mental load" framing
- Both partners plan together on their own phones

**What They Still Lack:**
- ❌ No AI recipe generation
- ❌ No adaptive nutrition intelligence
- ❌ No pantry-based cooking
- ❌ No body-specific portions
- ❌ No multi-diet optimization
- ❌ No advanced grocery intelligence
- ❌ Very thin feature set (shared calendar for meal ideas only)

**Assessment:** LeanLife proves couples will adopt collaborative food tools. Their emotional positioning is excellent. But they remain a shared calendar — no AI, no nutrition, no pantry, no adaptive cooking. **Threat level unchanged: MEDIUM-HIGH for positioning, LOW for features.**

---

### 3.7 DuoDine — MEDIUM Threat (Minor Evolution)

| Attribute | Detail |
|-----------|--------|
| **URL** | duodine.com.au |
| **Tagline** | "Plan meals together with your partner!" |
| **Status** | Live (iOS), Android in beta |
| **Pricing** | Free forever |
| **Users** | 1,000+ couples |

**What Changed Since Last Analysis:**
- Expanding beyond couples to families
- Now has shared recipe library (shows who added each recipe)
- Randomize option for meal selection
- Actively publishing blog content (Best Meal Planning Apps for Couples 2026, etc.)
- Android in beta (access by request)

**Current Features:**
- Shared weekly planner with real-time sync
- Shared shopping list with real-time check-off
- Shared recipe library
- Family support (beyond couples)

**What They Still Lack:**
- ❌ No AI generation
- ❌ No adaptive portions
- ❌ No pantry tracking
- ❌ No nutrition intelligence
- ❌ No body profiles
- ❌ Australia-focused
- ❌ No revenue model (sustainability concern)

**Assessment:** DuoDine validates demand for real-time couples collaboration. Their "free forever" model creates pricing pressure. But they're fundamentally a shared notepad — no intelligence layer. **Threat level unchanged: MEDIUM for collaboration validation, LOW for feature depth.**

---

### 3.8 Cloche — MEDIUM Threat (Still Pre-Launch)

| Attribute | Detail |
|-----------|--------|
| **URL** | trycloche.com |
| **Tagline** | "Swipe. Match. Cook." |
| **Status** | Pre-launch (waitlist, 500+ users) |
| **Pricing** | Free tier + paid planned |

**What Changed Since Last Analysis:**
- Still in early access / waitlist phase
- "Coming soon — sign up for early access"
- Concept: Tinder-style swipe for recipes, consensus matching
- Shared shopping lists, joint meal plans, guided cooking with timers
- Compares itself to Paprika, Mealime, and Yummly

**What They Still Lack:**
- ❌ Not yet launched
- ❌ No adaptive nutrition or portion logic
- ❌ Discovery-first, not planning-first
- ❌ No pantry intelligence

**Assessment:** Strong couples UX concept but still pre-launch. The swipe-to-match mechanic is novel but addresses recipe discovery, not the adaptive nutrition problem. **Threat level unchanged: MEDIUM.**

---

### 3.9 OttoChef — MEDIUM Threat (Growing, Not Couples)

| Attribute | Detail |
|-----------|--------|
| **URL** | ottochef.ai |
| **Tagline** | "Meal Planning That Brings Couples Together" |
| **Status** | Live |
| **Users** | 10,000+ meal plans created, 6,471-recipe collection |
| **Pricing** | Free |

**What Changed Since Last Analysis:**
- Claiming 10K+ meal plans created
- Added gamification (achievements, streaks, badges, levels)
- Added social cooking network (see what friends cook, react with emoji)
- Fullscreen cooking mode with AI chat
- One-click grocery orders via Instacart
- 20+ cuisine types, calorie/macro tracking

**Critical Gap:**
- ❌ **Not couples-specific at all.** No dual-profile, no adaptive portions for two, no shared planning
- Solo tool with social/gamification layer

**Assessment:** OttoChef is growing but has pivoted away from couples positioning toward general AI meal planning with social features. No longer a direct couples competitor. **Threat level revised: MEDIUM (downgraded from couples threat).**

---

### 3.10 New Entrants — May 2026

#### You & Me Food — MEDIUM Threat (NEW)

| Attribute | Detail |
|-----------|--------|
| **Platform** | iOS only |
| **Concept** | AI cooking assistant for couples who want to cook together |
| **Core Feature** | "Sync & Conquer" engine — assigns tasks to each partner |
| **Features** | AI-generated menus, Smart Pantry, Task Sync, date-night framing |
| **Pricing** | 3 free menus, then Premium |
| **Developer** | Metehan CANPOLAT (solo) |

**Assessment:** Interesting couples cooking-together mechanic (task assignment), but very early/solo project. No adaptive portions or nutrition focus. **Threat: MEDIUM for concept, LOW for execution.**

---

#### Clove — MEDIUM Threat (NEW, FUNDED)

| Attribute | Detail |
|-----------|--------|
| **Funding** | $4.15M from Blackbird Ventures |
| **Team** | Ex-Canva employees |
| **Concept** | Free recipe app with AI pantry-aware meal planning |
| **Features** | AI pantry-aware planning, collaborative shopping lists, imports from TikTok/IG/Pinterest (unlimited, free) |
| **Pricing** | Completely free — no paywalls, no subscriptions, no ads |
| **Platform** | iOS and Android |

**Assessment:** Well-funded, beautiful design (ex-Canva), free model. Could pivot to couples. The pantry AI is notable. Not couples-specific but represents the "well-funded startup enters the space" scenario from the risk playbook. **Threat: MEDIUM — potential to become HIGH if they add couples features.**

---

#### Honeydew — MEDIUM Threat (NEW)

| Attribute | Detail |
|-----------|--------|
| **URL** | honeydewcook.com |
| **Concept** | AI recipe manager that imports from TikTok/Instagram/YouTube |
| **Features** | AI recipe extraction from videos, meal planning, grocery lists, family sharing (up to 6), Instacart integration, "Ask Honey" AI assistant, **pantry photo analysis** |
| **Pricing** | Free basic / $4.17/mo Plus |
| **Platform** | iOS and Android |

**Assessment:** Strong pantry AI (photo analysis is a notable UX innovation). Family sharing is couples-adjacent. Not couples-specific but could capture the same users with a broader positioning. **Threat: MEDIUM.**

---

#### PlanEat AI — MEDIUM Conceptual Threat (NEW)

| Attribute | Detail |
|-----------|--------|
| **URL** | planeatai.com |
| **Concept** | AI weekly meal planner with couples focus |
| **Notable** | Blog post: "Meal Planning For Couples With Different Goals (2026)" — describes the "base meal system" concept exactly |

**Assessment:** More content/SEO play than product. But validates the "one shared base meal with layering adjustments per partner" concept. The idea is spreading. **Threat: MEDIUM conceptually, LOW as product.**

---

#### FoodiePrep — MEDIUM Threat (NEW)

| Attribute | Detail |
|-----------|--------|
| **URL** | foodieprep.ai |
| **Concept** | AI-powered meal planner, ranked #1 in multiple 2026 roundups |
| **Features** | "Chef Foodie" AI assistant, pantry-aware planning, recipe import, smart grocery lists, nutrition tracking, family profiles |

**Assessment:** Strong tech, ranked #1, but not couples-specific. Represents the commoditization of AI meal planning. **Threat: MEDIUM.**

---

#### Jenova AI — LOW-MEDIUM Threat (NEW)

| Attribute | Detail |
|-----------|--------|
| **URL** | jenova.ai |
| **Concept** | Multi-agent AI platform with Meal Planner agent |
| **Notable** | Specifically handles "competing dietary needs in one household" — designs base meals with modular components per person |

**Assessment:** AI chat agent, not a dedicated app. But the modular meal concept is exactly Cupla's territory. **Threat: LOW-MEDIUM.**

---

#### NumYum — LOW-MEDIUM Threat (NEW)

| Attribute | Detail |
|-----------|--------|
| **URL** | numyum.ai |
| **Concept** | AI meal planner using "four specialized AI agents" |
| **Features** | Multi-agent AI, family profiles, grocery lists, nutrition tracking |

**Assessment:** General family tool, not couples-specific. **Threat: LOW-MEDIUM.**

---

### 3.11 Dead / Removed Competitors

| Competitor | Status |
|-----------|--------|
| **PlateJoy** | SHUT DOWN July 1, 2025 — no longer a competitor |
| **Alma** | Nonexistent — never was a real product (hallucinated in research) |
| **YumTwo** | Parked domain — abandoned |
| **OurPlate** | Could not be verified — may be abandoned or renamed |

---

## 4. Updated Competitive Gap Matrix

### 4.1 Direct Couples Competitors

| Feature | Cupla (proposed) | Yummo | PlateMates | Healthspan | LeanLife | DuoDine | SplitPlate | Cloche |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Adaptive portions per person** | ✅ | ✅ | ✅ (vegan/omni) | ✅ | ❌ | ❌ | ✅ | ❌ |
| **One meal, two plates** | ✅ | ✅ | ✅ (split-recipe) | ⚠️ (auto-adjust) | ❌ | ❌ | ✅ (branching) | ❌ |
| **Real-time live collaboration** | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ⚠️ |
| **Pantry-first AI** | ✅ | ❌ | ⚠️ (pantry mode) | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Relationship-first UX ("we")** | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Cross-platform** | ✅ (PWA) | ❌ (web) | ❌ (iOS) | ⚠️ (beta) | ✅ | ⚠️ (iOS+beta) | ❌ (web) | ❌ (pre-launch) |
| **Nutrition tracking per person** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **AI meal generation** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ⚠️ |
| **TDEE calculation** | ✅ | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| **Self-reinforcing product loop** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Offline support** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **PWA (no app store)** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

**Legend:** ✅ Strong / Core feature | ⚠️ Partial / Limited | ❌ Not available

### 4.2 Nutrition & AI Competitors

| Feature | Cupla (proposed) | Fitia | Eat This Much | Clove | Honeydew | FoodiePrep |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| **Couples-first UX** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Real-time collaboration** | ✅ | ⚠️ (sync) | ❌ | ⚠️ | ❌ | ❌ |
| **Multi-diet adaptation** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Pantry-first AI** | ✅ | ❌ | ⚠️ | ✅ | ✅ | ✅ |
| **Adaptive shared cooking** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Body-specific portions** | ✅ | ✅ | ✅ | ❌ | ❌ | ⚠️ |
| **Relationship UX** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **AI meal generation** | ✅ | ⚠️ | ✅ | ✅ | ✅ | ✅ |

### 4.3 Key Takeaway

**Cupla is still the ONLY product designed to have ✅ across every dimension.** No single competitor covers more than 4 of the 12 dimensions in the primary matrix.

**Healthspan covers the most** (4 dimensions: adaptive portions, one meal two plates partial, cross-platform partial, nutrition tracking, AI meal generation, TDEE). But they lack pantry-first AI, relationship UX, real-time collaboration, the product loop, and offline support.

**PlateMates is second** (3.5 dimensions: adaptive portions, one meal two plates, AI generation, TDEE, pantry mode partial). But they're iOS-only with no real-time sync, no relationship UX, no nutrition tracking, and no product loop.

The **intersection of all pillars remains unoccupied.**

---

## 5. What's Eroding vs. What's Still Defensible

### 5.1 Eroding Advantages

These features are no longer unique to Cupla. Multiple competitors now offer them.

#### Pantry-Aware AI — NOW TABLE STAKES

The 2026 market considers pantry-aware planning a baseline feature, not a differentiator. Multiple apps now offer it:
- **Clove** — AI pantry-aware planning (free, well-funded)
- **Honeydew** — Pantry photo analysis
- **FoodiePrep** — Pantry-aware planning (ranked #1)
- **PlateMates** — Pantry mode (suggest recipes from what you have)
- **Eat This Much** — Partial pantry awareness

**Impact:** Cupla can no longer claim pantry AI as a unique moat. It must be part of the baseline offering, not the differentiator.

#### AI Meal Generation — NOW COMMODITY

68%+ of meal planning apps now offer AI-driven suggestions. The bar has moved from "has AI" to "how good is the AI."

**Impact:** AI generation alone doesn't differentiate. The quality of the AI output (adaptive portions, multi-person optimization, pantry reasoning) is what matters.

#### Shared Grocery Lists — FREE DEFAULT

DuoDine (free forever), slrp (free), Cloche (free tier), LeanLife (partner free), Clove (completely free). Couples apps are competing on free access.

**Impact:** Cupla's free tier must be genuinely useful (shared grocery list + basic meal scheduling) to compete. The premium tier must justify itself through AI + adaptive cooking.

#### Per-Person Portions — NOW OFFERED BY MULTIPLE APPS

Healthspan, PlateMates, Yummo, Fitia, SplitPlate all offer some form of per-person portion adaptation.

**Impact:** The concept of "different portions for different people" is spreading. Cupla must differentiate on the quality and integration of the adaptation, not the concept itself.

### 5.2 Still Defensible

These are the features and positions that no competitor has replicated.

#### 1. The Complete Product Loop

**Pantry → AI Meals → Shopping → Pantry → repeat**

No competitor connects all four steps into a self-reinforcing cycle. Apps either stop at the shopping list (AnyList), stop at meal generation (Eat This Much), or stop at portion math (Yummo). The loop is the moat because:
- Once a couple is in the cycle, leaving means losing pantry inventory, meal history, shopping habits, and adaptive cooking setup
- The loop compounds value over time (more pantry data → better AI suggestions → less waste → more savings)
- The data lock-in is real and increases with usage

#### 2. Real-Time WebSocket Collaboration Designed for Couples

DuoDine and LeanLife have sync, but neither has Durable Object-grade sub-100ms real-time collaboration combined with the other pillars. The WebSocket + Durable Object architecture in the web app is technically superior to Firebase or polling approaches used by competitors.

#### 3. Adaptive Shared Cooking with "One Prep, Two Plates" Framing

Yummo has the concept but no collaboration. PlateMates has split recipes but limited to vegan/omnivore. Healthspan auto-adjusts portions but doesn't frame it as a shared cooking experience. SplitPlate has branching logic but no real-time sync.

The **integrated experience** of:
1. Looking at what's in your pantry together
2. AI generates ONE shared cooking workflow
3. Step-by-step cooking instructions for both partners
4. TWO distinct plating cards with per-person macros
5. Eating together, hitting different goals

...is still unoccupied. No competitor delivers this end-to-end experience.

#### 4. Relationship-First UX Philosophy

No competitor systematically uses "we" language, shared identity, and relationship-aware design throughout the entire product. This is embedded in:
- The "Our Kitchen" header
- "What are WE eating tonight?" framing
- Partner switcher with color-coded identities (Alex = sage, Jordan = terracotta)
- Plating cards that feel like a shared dinner, not a nutrition spreadsheet
- Notifications as nudges: "Alex suggested Tacos. Approve?"

A competitor cannot bolt this on any more than Cupla could bolt on "clinical fitness." The framing permeates every interaction.

#### 5. PWA + Offline Architecture

Still zero competitors are PWAs. This remains a distribution advantage:
- "Share a link" beats "download from App Store" for second-partner adoption
- No $99/year Apple developer fee
- No review process
- Ship daily if needed
- Works on iOS 16.4+ and Android
- Offline support via service worker

#### 6. The Combination of ALL Pillars

The individual features can be copied. The **system** — the combination of real-time collaboration + adaptive shared cooking + pantry-first AI + relationship-first UX into one self-reinforcing loop — has not been assembled by anyone. The difficulty of assembling it is the moat.

---

## 6. Market Trends 2026

### 6.1 AI Is Now Table Stakes

68%+ of meal planning apps offer AI-driven suggestions. The competitive question is no longer "does it have AI?" but "how good is the AI at understanding my specific situation?"

**Implication for Cupla:** The AI must deliver measurably better results for couples than solo-first AI planners. The multi-person optimization (one meal, two plates, both hitting targets) is where the AI quality matters most.

### 6.2 Pantry Awareness Is the 2026 Differentiator

Multiple reviewers and roundups highlight pantry-aware planning as the key feature separating leaders from laggards. Apps that know what's in your kitchen win.

**Implication for Cupla:** Pantry-first must ship early. It's no longer a unique advantage but a required baseline. The differentiation comes from how well the pantry AI integrates with the multi-person adaptive cooking system.

### 6.3 Couples Is Now a Recognized Category

Two years ago, "couples meal planning" wasn't a search term. Now 6+ apps explicitly build for couples:
- DuoDine, slrp, PlateMates, Cloche, LeanLife, You & Me Food, Healthspan

**Implication for Cupla:** The market is validated. Demand is proven. The risk is no longer "is there a market?" but "can Cupla win the category before a funded competitor does?"

### 6.4 "One Meal, Different Plates" Concept Is Spreading

PlanEat AI, Jenova, and Healthspan are all discussing or implementing versions of the "base meal with per-person adjustments" concept. The idea is "in the air."

**Implication for Cupla:** First-mover advantage on this concept is eroding. Execution speed matters more than ever. The narrative framing ("one dinner, two plates") must be owned before competitors claim it.

### 6.5 Free Is the New Default

DuoDine (free forever), slrp (free), Clove (completely free, funded), Cloche (free tier), LeanLife (partner free). Couples apps are competing on free access to drive adoption.

**Implication for Cupla:**
- Free tier must be genuinely useful (shared grocery list + basic meal scheduling + real-time sync)
- Premium must justify itself through AI + adaptive cooking — features that require ongoing AI costs and deliver compound value
- Per-household pricing (not per-person) remains correct — reinforces "we" framing

### 6.6 Market Growth Data

| Segment | 2025 Value | 2033 Projection | CAGR |
|---------|-----------|-----------------|------|
| **AI-driven Meal Planning** | $972M | $11.6B | 28.1% |
| **Overall Meal Planning** | $1.8B | $5.2B | 12.5% |
| **AI-personalized Nutrition** | $1.54B | $10.21B | 26.8% |

The AI-driven segment is growing at more than double the overall market rate.

### 6.7 The Trend Toward "Base Meal + Modular Adjustments"

Multiple 2026 apps and articles describe the same pattern:
1. Generate a shared "base meal" (protein + vegetables core)
2. Add modular components per person (extra carbs, different protein, sauce variations)
3. Scale portions based on individual calorie targets

This is exactly Cupla's adaptive cooking thesis. The concept is validated by market convergence, but no one has executed it in a complete couples-first system.

---

## 7. Strategic Recommendations — Updated Priority Order

### 7.1 Ship the Complete Loop as a System, Not Individual Features

The moat is not any single feature anymore. It's the self-reinforcing cycle:

```
Pantry → AI Meals → Shopping → Pantry → repeat
```

With adaptive cooking layered on top and real-time sync connecting both partners throughout.

**Priority:** Connect all five build steps into one integrated experience. The Android app already has the functional prototype — use it as the reference implementation.

### 7.2 Watch Healthspan as #1 Priority

Healthspan is the closest functional competitor to Cupla's vision. If they:
- Exit beta with couples framing
- Add pantry-first logic
- Add relationship UX

...they become a direct competitor with a head start on cross-platform deployment.

**Action:** Check Healthspan weekly. Track beta progress, feature additions, and any couples-specific marketing language.

### 7.3 Accelerate Adaptive Cooking

The adaptive cooking feature (one meal, two plates with dual-plating cards) is:
- Already built in the Android app
- The moat feature that justifies premium pricing
- The feature Yummo users would switch for
- The TikTok hook ("same dinner, he gains muscle, I lose weight")

**Priority:** Ship adaptive cooking as the headline feature, not a Phase 3 afterthought. It's the #1 reason to pay for Cupla.

### 7.4 Free Tier Is Now Mandatory

The competitive landscape demands a genuinely useful free tier:
- Shared grocery list with real-time sync
- Basic pantry tracking
- Basic meal scheduling

**Premium tier must justify itself through:**
- AI meal generation from pantry
- Adaptive shared cooking (one meal, two plates)
- Weekly meal planning with smart grocery population
- Goal tracking and progress visualization

**Pricing:** Target $7.99/mo or $79.99/yr per household. Above free hobby apps, below Yummo ($9.99/mo). The annual price creates commitment.

### 7.5 Own "One Meal, Two Plates" Narrative Aggressively

The narrative is still ownable. Nobody has claimed it with emotional conviction:
- TikTok: "How we eat the exact same dinner, but he gains muscle and I lose weight"
- Instagram: Split-screen plating demos
- Product Hunt: "Google Docs for food planning"
- Tagline: "Same meal. Two plates."

**Priority:** Start building marketing content around this angle NOW, before Healthspan or PlateMates claim it.

### 7.6 Build Switching Costs Early

Once couples invest in:
- Pantry data (their entire kitchen inventory)
- Meal history (what they've cooked and liked)
- Shared profiles (body stats, dietary preferences, goals)
- Adaptive cooking setup (personalized portion algorithms)

...they won't switch to a competitor. Data lock-in is a moat that compounds over time.

**Priority:** Ensure the MVP stores enough data that leaving feels like a loss.

### 7.7 Consider an Import Tool

Create a one-click migration from:
- Yummo (capture users frustrated by lack of collaboration)
- PlateMates (capture users frustrated by iOS-only and limited splits)
- AnyList (capture users who want more than a grocery list)

**Priority:** Build after MVP launch. Targets competitor users explicitly.

### 7.8 Monitor for Funded Competitors

The "well-funded startup enters the space" scenario is now more likely:
- The category is validated (6+ indie attempts)
- Clove ($4.15M VC) is already adjacent
- A YC or Techstars company entering couples food is plausible

**Signals to watch:**
- YC demo day with couples food startup
- LinkedIn job postings combining "couples" + "food" + "AI"
- Crunchbase alerts for startups in Food & Beverage + Mobile with "couples" or "household"

**Response:** Speed is the only defense. Ship MVP, get first users, build community before a funded competitor arrives.

### 7.9 Decide on Platform Strategy

Cupla currently has two codebases with different architectures:

| | Web App (PWA) | Android App |
|---|---|---|
| **Strength** | Real-time sync (DO + WebSocket), distribution (share link), no app store | Complete feature set, adaptive cooking, Gemini AI |
| **Weakness** | Missing Steps 5-7 (AI, adaptive cooking) | Simulated sync (not real), Android only |

**Options:**
- (A) Complete the web app's Steps 5-7, making PWA the primary product
- (B) Ship the Android app, adding real sync via Firebase/Supabase
- (C) Port the Android app's AI/adaptive logic into the web app's real-time architecture
- (D) Ship both — Android for users who want native, PWA for instant sharing

**Recommendation:** The PWA architecture is strategically superior (distribution, no app store, real-time sync, offline). Port the Android app's AI logic and adaptive cooking UI into the web app. The Android app serves as the validated prototype.

### 7.10 Pricing Strategy — Updated for 2026 Market

| Tier | Price | Features | Rationale |
|------|-------|----------|-----------|
| **Free** | $0/mo | Shared grocery lists, pantry tracking, basic meal scheduling, real-time sync | Drives adoption, locks in both partners, matches competitor free tiers |
| **Premium** | $7.99/mo or $79.99/yr per household | AI pantry-to-meal generation, adaptive shared cooking, weekly planning, smart grocery, goal tracking | Below Yummo ($9.99/mo), above hobby apps (free). Per-household pricing reinforces "we" framing |

---

## 8. Appendix: Complete Competitor Directory

### 8.1 Direct Couples Competitors

| # | Name | URL | Status | Threat Level | Pricing | Platform |
|---|------|-----|--------|-------------|---------|----------|
| 1 | **Yummo** | yummo.ai | Live | VERY HIGH (stagnant) | $9.99/mo | Web |
| 2 | **PlateMates** | platematesapp.com | Live (iOS) | HIGH (evolving) | Free + $5.99/mo | iOS |
| 3 | **Healthspan** | usehealthspan.com | Open Beta | MEDIUM-HIGH (rising) | Free (beta) | iOS + Android |
| 4 | **SplitPlate** | splitplate.ai | Live (web) | MEDIUM | Free + $59.99/yr | Web |
| 5 | **LeanLife** | leanlifehq.com | Live | MEDIUM-HIGH | Free + paid | iOS + Android |
| 6 | **DuoDine** | duodine.com.au | Live | MEDIUM | Free forever | iOS (Android beta) |
| 7 | **Cloche** | trycloche.com | Pre-launch | MEDIUM | Free + paid planned | Pre-launch |
| 8 | **OttoChef** | ottochef.ai | Live | MEDIUM (not couples) | Free | iOS + Web |
| 9 | **You & Me Food** | iOS App Store | Live | MEDIUM | Free + Premium | iOS |
| 10 | **slrp** | slrp.com.au | Live | LOW | Free | iOS + Web |
| 11 | **OurPlate** | ourplate.app | Unverified | LOW | Unknown | Early access |
| 12 | **MiseBook** | misebook.com | Landing page | LOW | Free (planned) | Web |
| 13 | **Healthspan** | usehealthspan.com | Open Beta | MEDIUM-HIGH | Free (beta) | iOS + Android |
| 14 | **Cookbond** | cookbond.co | Live | LOW | $2.99/mo | iOS |
| 15 | **WhatDinner** | whatdinner.com | Live | LOW | Unknown | iOS |
| 16 | **SummitPlate** | summitplate.com | Live | LOW | $7.99/mo | Web + iOS |
| 17 | **We Just Did Dinner** | wejustdiddinner.com | Live | LOW | Free | Web |

### 8.2 Nutrition Intelligence Competitors

| # | Name | URL | Status | Threat Level | Pricing | Users |
|---|------|-----|--------|-------------|---------|-------|
| 18 | **Fitia** | fitia.app | Live | HIGH | Free / $59.99/yr / $89.99/yr family | 10M+ |
| 19 | **Eat This Much** | eatthismuch.com | Live | LOW-MEDIUM | $9.99/mo | 6M+ |
| 20 | **Nutrola** | nutrola.app | Live | LOW-MEDIUM | Freemium | 2M+ |

### 8.3 Grocery & Collaboration Competitors

| # | Name | URL | Status | Threat Level | Pricing | Users |
|---|------|-----|--------|-------------|---------|-------|
| 21 | **AnyList** | anylist.com | Live | LOW (benchmark) | $9.99/yr | Millions |
| 22 | **OurGroceries** | ourgroceries.com | Live | LOW | Free (ads) | Millions |
| 23 | **Listonic** | listonic.com | Live | LOW | Free (ads) | 20M+ |
| 24 | **KitchenSync** | kitchensync.info | Live | LOW-MEDIUM | $5.99-12.99/mo | Small |

### 8.4 AI Meal Planning Competitors

| # | Name | URL | Status | Threat Level | Pricing | Users |
|---|------|-----|--------|-------------|---------|-------|
| 25 | **Samsung Food** | food.samsung.com | Live | MEDIUM | Free + premium | 6M+ |
| 26 | **Mealime** | mealime.com | Live | LOW | $5.99/mo | 4.5M+ |
| 27 | **Ollie AI** | ollie.ai | Live | MEDIUM | ~$7-10/mo | 90K families |
| 28 | **eMeals** | emeals.com | Live | LOW | $4.99-9.99/mo | 2M+ |
| 29 | **Plan to Eat** | plantoeat.com | Live | LOW | $39.99/yr | 50K+ |
| 30 | **Melio** | meal-plan.app | Live | LOW | Unknown | Unknown |
| 31 | **Cooklist** | cooklist.co | Live (declining) | LOW-MEDIUM | Subscription | Unknown |

### 8.5 New Funded / Emerging Competitors

| # | Name | URL | Status | Threat Level | Pricing | Funding |
|---|------|-----|--------|-------------|---------|---------|
| 32 | **Clove** | N/A | Live | MEDIUM | Completely free | $4.15M (Blackbird) |
| 33 | **Honeydew** | honeydewcook.com | Live | MEDIUM | Free / $4.17/mo | Unknown |
| 34 | **FoodiePrep** | foodieprep.ai | Live | MEDIUM | Unknown | Unknown |
| 35 | **PlanEat AI** | planeatai.com | Live | MEDIUM (concept) | Subscription | Unknown |
| 36 | **Jenova AI** | jenova.ai | Live | LOW-MEDIUM | Unknown | Unknown |
| 37 | **NumYum** | numyum.ai | Live | LOW-MEDIUM | Unknown | Unknown |
| 38 | **Nori** | heynori.com | Live | LOW | Unknown | Unknown |

### 8.6 Family Organizers (Adjacent, Not Direct)

| # | Name | URL | Status | Threat Level | Users |
|---|------|-----|--------|-------------|-------|
| 39 | **Cozi** | cozi.com | Live | LOW | 17M+ |

### 8.7 Dead / Nonexistent

| # | Name | Status | Notes |
|---|------|--------|-------|
| 40 | **PlateJoy** | SHUT DOWN July 2025 | No longer a competitor |
| 41 | **YumTwo** | Parked domain | Abandoned |
| 42 | **Alma** | Nonexistent | Hallucinated in research |

---

## Monitoring Protocol — Updated May 2026

### Weekly Watch List (Priority Order)

| Priority | Competitor | What to Track | Method |
|----------|-----------|---------------|--------|
| 1 | **Healthspan** | Beta exit, couples framing, pantry features, marketing launch | Weekly site visit, TestFlight check |
| 2 | **PlateMates** | New features, Android launch, marketing, team growth | Weekly App Store check |
| 3 | **Yummo** | New features, team growth, mobile app, funding | Weekly site visit |
| 4 | **Fitia** | Couples features, real-time improvements, pantry | Monthly app review |
| 5 | **Clove** | Couples pivot, feature additions, growth | Monthly check |

### Monthly Watch List

| Competitor | What to Track |
|-----------|---------------|
| LeanLife | Download growth, feature additions |
| DuoDine | User count, monetization launch |
| SplitPlate | Mobile app launch, team reveal |
| Cloche | Launch date, feature announcements |
| Honeydew | Pantry AI evolution, couples features |

### Quarterly Signals

| Signal | What It Means | Cupla Response |
|--------|--------------|----------------|
| Healthspan exits beta | Direct competition imminent | Accelerate adaptive cooking launch |
| PlateMates adds Android | Cross-platform competitor | Ship PWA for instant cross-platform |
| Yummo adds real-time sync | Primary architectural moat challenged | Focus on product loop + relationship UX |
| Fitia pivots to couples | 10M-user direct competitor | Win niche depth before they win breadth |
| YC demo day: couples food startup | Funded competition | Ship fast, build community |
| Clove adds couples features | Funded free competitor | Differentiate on adaptive cooking premium |
| Any T1 competitor receives funding | Execution risk increases | Monitor more frequently |

---

## Document Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 28, 2026 | Initial creation — comprehensive market update based on live web research, both codebase analysis, and all internal strategy documents |

---

## Cross-Reference

This document updates and supersedes the competitive intelligence in:
- `Cupla_Market_Analysis.md` (v1.1) — original strategy document
- `Market_Analysis_2.md` (v1.0) — comprehensive market gap analysis
- `00-master-competitive-landscape.md` — 34-competitor analysis

For product feature specifications, see:
- `Current Feature Breakdown/Feature Breakdown - Technical Reference.md`
- `Current Feature Breakdown/Understanding of the Features.md`
- `Product_Development_Steps.md`

For technical architecture, see:
- `Cloudflare Strategy/cupla_cloudflare_strategy.md` (web app)
- Android app source: `couples-food-system (1)/app/src/main/java/com/example/`

---

*This document is a living strategic reference. Update monthly or when significant competitor movements are detected.*
*Next scheduled review: June 2026*
