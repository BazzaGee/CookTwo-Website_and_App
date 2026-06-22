# Project Diary — Couples Food System (Cupla Market Gap)

> Personal project journal. What was done, what changed, what was discovered, and where everything is.

**Project Started:** May 23, 2026  
**Last Updated:** May 27, 2026  
**Project Duration:** ~4 days of active development  
**Total Opencode Sessions:** 40+  
**Total Tokens Consumed:** 100M+ (across all sessions)

---

## The Origin Story

On May 23, 2026 I discovered the existing Cupla app (cupla.app) — a couples meal planning app. I started by deep-analyzing it: App Store listings, impact reports, feature set, pricing, reviews. Then something shifted — I didn't just want to understand Cupla. I wanted to build something that does what Cupla does, but better, and with features Cupla doesn't have.

That moment — "I want to build a competing product" — was the spark.

**Ref:** opencode session `ses_1ab7c9a4bffeLL7KJEFxkeO1IZ` (May 23, 23:05–May 24, 03:40) — "Cupla app deep analysis & reverse engineering"

---

## Name Evolution

The product name went through three distinct phases:

### Phase 1: "Nourish Together"
Claude's original suggestion during the first technical architecture session. The name appears in `Chat Analaysis/Claude Analysis/claude analysis.txt` throughout — it was the working name when the full Cloudflare stack was first designed.

### Phase 2: "Cupla"
During the naming research session on May 24, "Cupla" (Irish for "couple") became the working name. It was used in all the market analysis documents, the development steps, the Cloudflare strategy, and the initial git commits. All docs in this folder use "Cupla" in their filenames.

### Phase 3: "Couples Food System"
When the marketing website was planned on May 25, the user explicitly said: "don't use the word Cupla or name, use Couples Food System instead." This became the public-facing product name. Cupla was the research/code name; Couples Food System is what the world sees.

**Ref:** opencode session `ses_1a2bdcd3cffeP7Q9Tt93ZNcqOQ` (May 25, 16:03) — user message: "don't use the word 'Cupla' or name, use 'Couples Food System' instead"

---

## Day 1 — May 24: Research & Strategy Sprint

### The Three-AI Triangulation

I ran the idea through three AI models simultaneously and saved each output:

**Claude** — Technical Architecture (447 lines)  
`Chat Analaysis/Claude Analysis/claude analysis.txt`  
Full Cloudflare-native stack map: PWA + Hono Workers + Durable Objects + D1 + KV + AI Gateway. Originally titled "Nourish Together." Complete with auth flow, database schemas, build order, cost projections.

**Gemini** — Strategic Vision (64 lines)  
`Chat Analaysis/Gemini Analysis/gemenini analysis.txt`  
Coined the category name **"Collaborative Adaptive Nutrition"** and called it "The Shared Household Food OS." Identified the moat as "Adaptive Shared Cooking." GTM strategy with TikTok angles.

**GPT** — Competitive Landscape (813 lines)  
`Chat Analaysis/GPT Analysis/gpt_analysis_markdown.md`  
Exhaustive analysis across 4 competitor categories. Key discovery: "Nobody fully owns: real-time collaborative adaptive household nutrition." Identified Leanlife as closest conceptual competitor.

**The convergence:** All three independently concluded the center of the Venn diagram is empty. That became the founding thesis.

**Ref:** opencode session `ses_1a76b9b7affeusBqscClLt2M4r` (May 24, 18:03–20:40) — "Cupla market gap analysis from AI research"

### Documents Created This Day

| File | Lines | Purpose |
|------|-------|---------|
| `Cupla_Market_Analysis.md` | 1,315 | Full strategy blueprint with 19 sections |
| `Market_Analysis_2.md` | 1,325 | Expanded competitive landscape with gap matrix |
| `Cloudflare Strategy/cupla_cloudflare_strategy.md` | 630 | Technical architecture spec |
| `Naming & Positioning/Naming_Conventions.md` | 599 | 62 name candidates with availability research |
| `Naming & Positioning/Angles_and_Slogans.md` | 247 | 107 marketing angles/slogans |
| `Product_Development_Steps.md` | 508 (→519) | 7-step sequential build plan |
| `Rork_Prompt.md` | 764 | Full frontend prompt for Rork.com |
| `Google_AI_Studio_Prompt.md` | 1,053 | Full frontend prompt for Google AI Studio |

### Product Name Brainstorming

**Ref:** opencode session `ses_1a67b10a2ffeUe2kXOnLDFspNw` (May 24, 22:25–22:26) — "Product name brainstorming"

Names considered:
- **One Dinner** — "Same meal. Two plates." (ranked #1 by AI)
- **Two Plates** — "Cook once. Plate twice." (best for visual marketing)
- **PairPlate** — "One dinner. Two plates. Both perfect." (most brandable)
- **Our Dinner** — "What are WE eating tonight?" (most emotional)
- **SharedPlate**, **Twofold**, **Plated Together**, **SyncPlate**, **CoPlate**

Settled on "Cupla" as the working name.

### The 7-Step Build Plan

**Ref:** opencode session `ses_1a672518cffeu4yCUg5KMwTbPp` (May 24, 22:35–May 25, 01:43) — "Couples meal planning app MVP roadmap"

User's prompt: "I want to build up this application for a couple's meal planning app... I want a breakdown of if I'm building an app realistically not all of these are going to work so 1 at a time I need a method for building each segment"

The AI proposed a 7-step sequential build order where each step works as a standalone product. This became `Product_Development_Steps.md`.

### Rork vs. Google AI Studio Decision

User initially wanted to use Rork.com to generate the frontend. Then also wanted a Google AI Studio version.

**Critical insight from the AI:** Rork outputs React Native (native iOS/Android). Google AI Studio outputs React web app — which is PWA-compatible and aligns with the Cloudflare architecture. The Rork prompt was created first (`Rork_Prompt.md`, 764 lines), then adapted for Google AI Studio (`Google_AI_Studio_Prompt.md`, 1,053 lines). Both include identical design systems, screen specs, and data models.

**Ref:** opencode session `ses_1a672518cffeu4yCUg5KMwTbPp` (May 25, 01:33–01:43) — user message about Google AI Studio variant

---

## Day 2 — May 25: The Build Sprint

### The Massive Code Generation

**Ref:** opencode session `ses_1a584e44fffe1WoiJWQrBIuYoA` (May 25, 02:54–13:42) — "Couples food system app with Cloudflare backend (fork #1)" — **17.3M tokens consumed**

This single session generated the entire `couples-food-system/` codebase:

**Frontend** (React 19 + Vite + TypeScript + Tailwind):
- `src/pages/` — MainApp, ShoppingTab, PantryTab, MealPlanTab, ProfilesTab, Onboarding, Portal
- `src/components/` — AnimatedList, BodyProfileForm, InstallBanner, OfflineBanner, PlatingView, SyncIndicator, WeekCalendar
- `src/hooks/` — useHousehold (WebSocket), useMealPlan, useProfiles, useInstallPrompt, useOfflineQueue
- `src/lib/` — auth.ts, mockData.ts
- PWA configured: vite-plugin-pwa, service worker, manifest, offline support

**Backend** (Cloudflare Workers + Hono):
- `src/routes/` — auth.ts, profiles.ts, mealplan.ts, websocket.ts
- `src/durable-objects/HouseholdSync.ts` — 448 lines, real-time sync engine
- `src/lib/ai.ts` — AI Gateway integration, `src/lib/tdee.ts` — TDEE calculation
- `migrations/` — 4 SQL migrations (init, profiles, meal plans, body profiles)
- `wrangler.toml` — Full Cloudflare config

### First Git Commit

**Ref:** opencode session `ses_1a3e39c1bffewhDvx1VAnEklHV` (May 25, 10:30–10:34) — "Commit and push to Couples-Food-System repo"

**Commit:** `eba750e` — "Initial commit: Cupla Couples Food System" (May 25, 10:33:54 +1200)  
**67 files, 21,374 lines added**  
Pushed to GitHub remote.

### First Attempt at a Project Diary

**Ref:** opencode session `ses_1a3eedcc6ffeB5o2A8QNZ5vveu` (May 25, 10:18–10:22) — "Project diary.md from chat history"

User's prompt: "based of the chat history in this workspace/directory/folder, I want a diary.md file that notes the progress of the project, from the first message/start to recent message/now. It should brinstorm what was done, discovers made, direction, intention, mapping, etc."

A comprehensive plan was created with 9 phases, each with source file references. It appears the actual `diary.md` file was never created (or was lost) — which is why we're doing it now.

### The Competitive Intelligence Sprint

**Ref:** opencode sessions `ses_1a3916c5effeB1OZPgXjDNa49g` + 6 subagent sessions (May 25, 12:00–16:01)

The Yummo competitor was analyzed in depth (2.4M tokens), then 6 parallel subagent sessions researched additional competitors:

1. **PlateMates** — iOS app with "Three-Layer Split Recipes" (one shared base + separate vegan/omnivore paths)
2. **Fitia** — YC S21, 10M+ users, $3.5M revenue, actively adding shared features
3. **Leanlife** — Real-time sync, couples positioning, but no AI
4. **SplitPlate** — "The Split Point Method" — identifies where cooking branches into two variations
5. **Samsung Food** — Massive tech, but no couples focus
6. **Batch 7**: Mealime, Melio, eMeals, PlanToEat, Cozi
7. **Batch 8**: Cookbond, Cozi, Healthspan, MiseBook, OurPlate, SummitPlate, We Just Did Dinner, WhatDinner (emerging/dead)

This produced the complete `Competitors Analysis/` directory with 34 competitors across 6 tiers, plus the master landscape document.

**Final competitor threat ranking:**
- **VERY HIGH:** Yummo ($9.99/mo, near-identical "one cook, two plates" concept, 6-12 month window)
- **HIGH:** Fitia (10M+ users, adding shared features), PlateMates (iOS-only split-diet)
- **MEDIUM:** Leanlife (live sync, no AI), SplitPlate (conceptual, 503 errors)

### Website Source of Truth

**Ref:** opencode session `ses_1a2bdcd3cffeP7Q9Tt93ZNcqOQ` (May 25, 15:51–16:53) — "Cupla Market Gap website source of truth"

User's prompt: "I want to build a comprehensive website for this product... I want a sort of source of truth document or a source of truth folder... I will be asking for things like prompts on how to build out umm images for the website... I need a sort of like a hub or portal"

Key decisions in this session:
- Product name: "Couples Food System" (not Cupla)
- Beta waitlist: completely free, Formspree to barrydgrottis@gmail.com
- Competitor comparisons: generic, no named companies ("popular apps" not "Yummo")
- Logo concept: heart-shaped plate split sage/terracotta on a table with fresh produce
- Astro build system: user has it globally available at /Astro-Build

Created `website-source-of-truth/SOURCE_OF_TRUTH.md` v1.0→v2.0, plus the full folder structure: design system, all copy, data JSONs, SEO strategy, image generation prompts, Stitch marketing site pages.

### The Astro Website Build

**Ref:** opencode session `ses_1a2830312ffeQdzLfbSDvYFfY6` (May 25, 16:55–May 26, 02:21) — "Astro build setup using Cupla Market_Gap" — **49M tokens consumed**

Three iterations of the Astro website were built:
1. **couples-food-system-website-v1** — Monolithic pages, no component files
2. **couples-food-system-website-v2** — Monolithic pages, built successfully
3. **couples-food-system-website-2** — Modular components with Sections, Forms, Layout

The final website includes 12 pages (Homepage, Features overview + 4 feature pages, How It Works, Compare, About, FAQ, Contact, 404), plus proposal pages, pitch data, and full brand implementation.

---

## Day 3 — May 26: Polish, Park, Deploy

### Feature 8: Couple's Meal Picker

**Ref:** opencode session `ses_1a0b73f60ffehIk6ohK245JuWL` (May 26, 01:17–10:10) — "Couples meal planning feature design"

Designed a complete collaborative meal voting feature where both partners see AI-generated recipe cards, vote independently ("Let's do it" / "Not tonight"), and the first mutual approval becomes "our meal." Included full spec: frontend components, backend endpoints, AI prompt upgrade, D1 schema, WebSocket messages.

**Then the user said:**

> "OK this new feature number 8 the couples meal picker, I don't want to add it into the application just yet I want to put it to the side and keep it as a side note that we can come back to"

Created `Feature_8_Couples_Meal_Picker.md` with a clear "ON HOLD — NOT FOR CURRENT IMPLEMENTATION" banner. Updated `Product_Development_Steps.md` with a "Future Features (On Hold)" section pointing to it.

### Second Git Commit

**Ref:** git commit `c45a284` (May 26, 10:18:56 +1200) — "Second commit: Cupla Couples Food Sytem"  
**55 files changed, 14,748 insertions, 58 deletions**

What was committed:
- All 42 competitor analysis files (Competitors Analysis/ directory)
- Draft_1.md (product walkthrough)
- Feature_8_Couples_Meal_Picker.md (parked feature spec)
- Product_Development_Steps.md update (Future Features section)

### Code Changes Between Commits

10 code files were modified with significant improvements:

1. **ShoppingTab.tsx** (+88 lines) — Replaced plain text quantity input with rich picker (increment/decrement buttons + unit selection chips: L, kg, lb, dozen, pack, can, bottle, bag)
2. **Onboarding.tsx** (+33 lines) — Moved from client-generated invite codes to server-driven codes. Old: `Math.random()` on client. New: server provides code via API response.
3. **auth.ts** (+6 lines) — Changed API prefix from `/auth/` to `/api/auth/`, removed hardcoded `localhost:8787` URL
4. **useMealPlan.ts** (+11 lines) — Same: removed hardcoded URL, better error messages (parses server error JSON)
5. **useProfiles.ts** (+11 lines) — Same pattern as useMealPlan
6. **useHousehold.ts** (+2 lines) — Added partner name to WebSocket URL query parameter for server identification
7. **ProfilesTab.tsx** (+17 lines) — Added "No Specific Diet" (new default) and "Custom" diet option with free-text input
8. **MealPlanTab.tsx** (+36 lines) — Added full error banner UI with retry/dismiss buttons for AI generation failures
9. **Portal.tsx** (+3 lines) — Captures invite code from server response, threads it to Onboarding component
10. **worker/src/lib/ai.ts** (+6 lines) — Translates `"none"` diet label to "No dietary restrictions" for better LLM comprehension

### Website Deployment

**Ref:** opencode session `ses_19e3ee597ffeI36GCgU6wAPsmt` (May 26, 12:48–13:11)

Staged 96 files and committed to `https://github.com/BazzaGee/Couples-Food-System_Website`.

**Ref:** opencode session `ses_19e173291ffeWkX64NfpFKuKcn` (May 26, 13:31–16:15)

Deployed to Cloudflare Pages: **https://couples-food-system.pages.dev**

### Proposal Pages & Personal Branding

**Ref:** opencode session `ses_19cd9cfddffeCDVovTU2dyry4a` (May 26, 19:18–22:39)

Created a "Coupler growth marketer" proposal page with:
- **Co-authored byline:** Barry (sage border) + AL. Roberts (terracotta border — play on "AI Robots")
  - Barry: "Supreme Orchestrator, Editor & Final Decision Maker"
  - AL. Roberts: "Chief Research & Composition Officer (The One Who Actually Did the Heavy Lifting)"
- **Personal career story page** at `/proposal/my-story/` — 10 chapters of direct-response copywriting covering the journey from 2011 ClickBank affiliate marketing through AI-powered product development in 2026
- Deployed live to Cloudflare Pages

### End of Day Cleanup

Copied website files back to the Cupla Market_Gap folder. Renamed `Draft_1.md` → `Cupla_Product_Walkthrough.md`.

**Ref:** opencode session `ses_19bd78f0cffe6MfPP6jKwt08FT` (May 27, 00:00) — "Draft_1.md naming suggestion"

---

## Document Map

### Strategy & Research

| File | Lines | Purpose |
|------|-------|---------|
| `Cupla_Market_Analysis.md` | 1,315 | Full strategy blueprint, 19 sections |
| `Market_Analysis_2.md` | 1,325 | Expanded competitive landscape, gap matrix |
| `Cupla_Product_Walkthrough.md` | 188 | Tab-by-tab product walkthrough (was `Draft_1.md`) |
| `Product_Development_Steps.md` | 519 | 7-step sequential build plan |

### Naming & Positioning

| File | Lines | Purpose |
|------|-------|---------|
| `Naming & Positioning/Naming_Conventions.md` | 599 | 62 name candidates with availability research |
| `Naming & Positioning/Angles_and_Slogans.md` | 247 | 107 marketing angles and slogans |

### Technical

| File | Lines | Purpose |
|------|-------|---------|
| `Cloudflare Strategy/cupla_cloudflare_strategy.md` | 630 | Full Cloudflare architecture spec |

### AI Chat Analysis (origin)

| File | Lines | Purpose |
|------|-------|---------|
| `Chat Analaysis/Claude Analysis/claude analysis.txt` | 447 | Claude's technical architecture (originally "Nourish Together") |
| `Chat Analaysis/Gemini Analysis/gemenini analysis.txt` | 64 | Gemini's strategic blueprint (coined "Collaborative Adaptive Nutrition") |
| `Chat Analaysis/GPT Analysis/gpt_analysis_markdown.md` | 813 | GPT's competitive landscape analysis |

### AI Prompts

| File | Lines | Purpose |
|------|-------|---------|
| `Google_AI_Studio_Prompt.md` | 1,053 | Full prompt for Google AI Studio app builder |
| `Rork_Prompt.md` | 764 | Full prompt for Rork.com app builder |

### Competitor Intelligence

| Directory | Files | Purpose |
|-----------|-------|---------|
| `Competitors Analysis/` | 42 | 34 competitors across 6 tiers |
| `Competitors Analysis/00-master-competitive-landscape.md` | 388 | Master synthesis document |

### Parked Features

| File | Lines | Purpose |
|------|-------|---------|
| `Todo Feature_8_Couples_Meal_Picker.md` | 284 | Full spec, ON HOLD |

### Website (Source of Truth)

| Directory/File | Purpose |
|----------------|---------|
| `website-source-of-truth/SOURCE_OF_TRUTH.md` | Master reference for Astro build |
| `website-source-of-truth/01-design-system/` | Brand design system (298 lines) |
| `website-source-of-truth/02-content/ALL-COPY.md` | All website copy (235 lines) |
| `website-source-of-truth/03-images/prompts/IMAGE-PROMPTS.md` | 14 AI image generation prompts |
| `website-source-of-truth/04-data/` | Features, comparison, FAQ, navigation JSONs |
| `website-source-of-truth/05-seo/SEO.md` | Meta tags, keywords, schema markup |
| `website-source-of-truth/06-astro-build/` | 3 Astro website iterations |
| `website-source-of-truth/stitch-marketing-site/` | 8 Stitch-generated page designs + screenshots |
| `website-source-of-truth/google ai studio template/html` | Original 533-line HTML template |

### Live Website

| Directory | Purpose |
|-----------|---------|
| `Website/` | Final Astro project (deployed to Cloudflare Pages) |
| `Website/src/data/pitch/` | Financials, competitors, SWOT, market data, naming data |

### Application Code

| Directory | Purpose |
|-----------|---------|
| `couples-food-system/frontend/` | React 19 + Vite PWA |
| `couples-food-system/worker/` | Cloudflare Workers (Hono) backend |

---

## Git History

```
c45a284  2026-05-26 10:18  Second commit: Cupla Couples Food Sytem
eba750e  2026-05-25 10:33  Initial commit: Cupla Couples Food System
```

**Uncommitted local changes:**
- `Draft_1.md` — deleted (renamed to Cupla_Product_Walkthrough.md)
- `Feature_8_Couples_Meal_Picker.md` — deleted (renamed to Todo Feature_8_Couples_Meal_Picker.md)
- `Cupla_Product_Walkthrough.md` — new (renamed from Draft_1.md)
- `Todo Feature_8_Couples_Meal_Picker.md` — new (renamed from Feature_8_Couples_Meal_Picker.md with ON HOLD status)
- `Website/` — new untracked (Astro project, deployed to Cloudflare Pages)
- `website-source-of-truth/` — new untracked (canonical source for website build)

---

## Key Decisions & Reasoning

| Decision | Why | Source |
|----------|-----|--------|
| Cloudflare-only stack | Zero cost at MVP scale, single deploy command, sub-100ms sync | Claude analysis + Cloudflare Strategy doc |
| PWA over native app | No App Store fees, instant distribution via URL, second partner onboards in seconds | Gemini analysis §2, Google AI Studio session |
| Durable Objects for sync | One DO per couple, WebSocket-grade real-time, hibernates when both close | Cloudflare Strategy doc §4.4 |
| Invite code auth (no email/password) | Two people, no signup friction, 6-digit code with 24hr expiry | Product Development Steps §Step 1 |
| Rork → Google AI Studio for frontend | React web output aligns with Cloudflare PWA architecture; Rork gives React Native | Session discussion May 25, 01:33 |
| Server-driven invite codes | Client-generated mock codes couldn't persist across sessions | Code diff between commits |
| Relative API paths | Removed hardcoded localhost URLs, enables proxy-based dev and future deployment | Code changes in auth.ts, useMealPlan.ts, useProfiles.ts |
| "none" diet default | Not everyone follows a specific diet; forced selection creates friction | ProfilesTab.tsx change |
| Feature 8 parked | Scope control — full spec preserved but implementation deferred to post-Step-5 | Session May 26, 10:00 |
| Generic competitor comparisons on website | Never name specific companies on public-facing pages; focus on benefits, not attacks | Website session May 25, 16:15 |
| 34 competitors across 6 tiers | Exhaustive intelligence prevents surprise entries from unknown players | Competitor research sprint May 25, 12:00-14:13 |

---

## What's Done vs. What's Next

### Complete

- Market analysis (3 AI validations + 2 synthesis documents)
- Competitive intelligence (34 competitors, 6 tiers, threat rankings)
- Technical architecture (Cloudflare-native stack)
- Product roadmap (7-step build plan)
- Step 1 of app (shared grocery list with real-time sync) — code complete
- Marketing website (Astro, deployed to couples-food-system.pages.dev)
- Source of truth system for website (design, content, SEO, images)
- Feature 8 spec (fully designed, parked)

### In Progress / Next

- **Step 2: PWA Install + Mobile Polish** — foundation exists (vite-plugin-pwa configured) but not refined
- **Step 3: Partner Profiles + D1** — skeleton exists, needs real D1 integration
- **Step 4: Pantry Tracking** — UI built, needs backend
- **Step 5: AI Meal Generation** — the "magic moment" — needs Anthropic API key + AI Gateway
- **Step 6: Meal Calendar** — WeekCalendar component built, needs AI + D1
- **Step 7: Adaptive Shared Cooking** — the moat — PlatingView component exists, needs TDEE + complex AI prompts
- **Feature 8: Meal Picker** — fully spec'd, waiting for Step 5 to ship first

### Explicitly Cut (for 6+ months)

Push notifications, MCP server, barcode scanning, budget tracking, social features, offline meal generation, multi-household support, restaurant integration, nutrition database lookup, shopping at multiple stores, recipe importing, goal tracking charts.

**Ref:** `Product_Development_Steps.md` §"What to Cut Entirely" (lines 401-418)

---

## Token Economics

This project consumed massive amounts of AI compute across opencode sessions. The biggest sessions:

| Session | Tokens In | What Happened |
|---------|-----------|---------------|
| Astro build (website) | 49M | Built full Astro site with 3 iterations |
| Code generation (fork) | 17.3M | Generated entire couples-food-system codebase |
| Pitch pages | 9.3M | Built proposal + story pages |
| Yummo analysis | 2.4M | Deep competitor research |
| Multiple explore/plan sessions | ~20M | Research, verification, subagent dispatches |

Total estimated: **100M+ tokens** across all sessions.

---

*This diary was reconstructed from the opencode session database (2,111 sessions, 41,613 messages in `~/.local/share/opencode/opencode.db`), git history (2 commits), file timestamps, and document cross-references.*
