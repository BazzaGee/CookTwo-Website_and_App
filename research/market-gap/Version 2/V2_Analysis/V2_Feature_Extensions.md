# Cupla V2 — Feature Extensions

**Date:** May 2026
**Status:** Design Document — New features proposed for V2 to close remaining gaps
**Scope:** User-generated recipes, recipe URL import (two approaches), and strategic notes on cooking mode

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [User-Generated Recipes](#2-user-generated-recipes)
3. [Recipe URL Import](#3-recipe-url-import)
4. [Approach A: AI Extraction](#4-approach-a-ai-extraction)
5. [Approach B: Dedicated Recipe Scraping](#5-approach-b-dedicated-recipe-scraping)
6. [Approach Comparison & Recommendation](#6-approach-comparison--recommendation)
7. [Competitive Justification](#7-competitive-justification)
8. [Technical Feasibility](#8-technical-feasibility)
9. [Build Time Estimates](#9-build-time-estimates)
10. [Priority Ranking](#10-priority-ranking)
11. [Not Included: Interactive Cooking Mode](#11-not-included-interactive-cooking-mode)

---

## 1. Introduction

V2's dual-mode meal picker closes the biggest gap between Cupla and its competitors. But gaps remain. This document specifies two new features that would further strengthen V2's market position:

1. **User-Generated Recipes** — let couples add their own meals to the system
2. **Recipe URL Import** — paste any recipe URL and import it automatically

Both features address the same fundamental problem: V2's recipe database (50-100 curated meals) is thin, and users can't personalise it. Together, they transform Cupla from "here are our meals" into "here is YOUR kitchen brain."

### Why These Features Matter

| Gap | Current V2 Status | With Extensions |
|-----|-------------------|-----------------|
| Recipe count | 50-100 curated | 50-100 curated + user recipes + imported recipes (unlimited) |
| Personalisation | None | Users build their own recipe library |
| Switching costs | Moderate | High (your recipes live in Cupla) |
| "Kitchen brain" positioning | Weaker (can't store your own meals) | Stronger (everything you cook lives here) |
| Competitive parity | Behind MiseBook, Fitia, Samsung Food | Matches or exceeds |

---

## 2. User-Generated Recipes

### 2.1 Overview

Allow users to create their own recipes from scratch within the app. These recipes integrate fully with both Mode A (Cook Now) and Mode B (I Want This), appearing alongside curated and AI-generated meals.

### 2.2 User Flow

**Creating a Recipe:**

1. User taps "+" button in Meal Plan tab (or a "My Recipes" section)
2. New recipe form opens with fields:
   - **Name** (required) — e.g., "Grandma's Chicken Soup"
   - **Description** (optional) — brief description
   - **Cook time** (required) — slider or dropdown (5-120 min)
   - **Difficulty** (required) — Easy / Medium / Advanced
   - **Cuisine** (optional) — dropdown (Mediterranean, Asian, Mexican, etc. + "Family Recipe" + "Other")
   - **Servings** (required) — number of servings (default: 2)
   - **Dietary tags** (optional) — checkboxes (Vegetarian, Vegan, Gluten-Free, Dairy-Free, Keto, etc.)
   - **Ingredients** (required) — add one by one with quantity and unit
   - **Steps** (required) — add one by one, numbered automatically
   - **Photo** (optional) — take a photo or upload from gallery
3. Tap "Save Recipe"
4. Recipe is stored in the household's recipe library
5. Both partners see the recipe instantly (real-time sync)

**Using a User Recipe:**

- In **Mode A (Cook Now):** User recipes appear in the AI-generated meal list, prioritised by pantry match % (same as any other meal). AI knows the recipe's ingredients and checks them against the pantry.
- In **Mode B (I Want This):** User recipes appear in the browse grid with a "My Recipe" badge. They can be filtered by cuisine, difficulty, and dietary tags. Pantry check shows have/need for user recipes just like curated ones.
- In **Adaptive Cooking:** User recipes go through the same adaptive cooking layer. AI generates dual plating instructions based on both partners' profiles.

### 2.3 Data Model

```json
{
  "id": "recipe_user_abc123",
  "source": "user",
  "household_id": "household_xyz",
  "created_by": "partner_a",
  "name": "Grandma's Chicken Soup",
  "description": "The soup my grandmother made every Sunday",
  "cook_time": 45,
  "difficulty": "easy",
  "cuisine": "family_recipe",
  "servings": 2,
  "dietary_tags": ["gluten-free"],
  "ingredients": [
    { "name": "chicken thighs", "quantity": 4, "unit": "pieces" },
    { "name": "carrots", "quantity": 2, "unit": "medium" },
    { "name": "celery", "quantity": 2, "unit": "stalks" },
    { "name": "onion", "quantity": 1, "unit": "medium" },
    { "name": "chicken broth", "quantity": 6, "unit": "cups" },
    { "name": "egg noodles", "quantity": 1, "unit": "cup" }
  ],
  "steps": [
    "Season chicken thighs with salt and pepper",
    "In a large pot, sear chicken on both sides until golden",
    "Add chopped onions, carrots, and celery. Cook 5 minutes.",
    "Pour in chicken broth. Bring to boil.",
    "Reduce heat, simmer 30 minutes.",
    "Remove chicken, shred, return to pot.",
    "Add egg noodles, cook 8 minutes.",
    "Serve hot."
  ],
  "photo": "blob:abc123",
  "created_at": "2026-05-29T18:00:00Z",
  "updated_at": "2026-05-29T18:00:00Z"
}
```

### 2.4 Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Photo source | Camera or gallery | Most couples will photograph their actual cooking |
| Ingredient format | Name + quantity + unit | Matches the pantry system's format for matching |
| Step format | Ordered text steps | Simple, no sub-steps needed for V1 |
| Dietary tags | Pre-defined checkboxes | Keeps data structured for filtering |
| Cuisine options | Standard list + "Family Recipe" | "Family Recipe" is emotionally resonant for couples |
| Visibility | Household-level (both partners see) | Reinforces shared ownership |
| Sync | Real-time via WebSocket | Partner sees new recipe instantly |

### 2.5 Integration with Existing Systems

| System | Integration Point |
|--------|-------------------|
| **Pantry (Tab 2)** | Ingredients in user recipes are matched against pantry items for Cook Now scoring |
| **Shopping (Tab 1)** | Missing ingredients from user recipes can be added to shopping list (Mode B) |
| **Profiles (Tab 4)** | Dietary tags are checked against partner profiles for compatibility |
| **Mode A (Cook Now)** | User recipes appear in AI-generated list, scored by pantry match % |
| **Mode B (I Want This)** | User recipes appear in browse grid with "My Recipe" badge |
| **Adaptive Cooking** | AI generates dual plating for user recipes based on partner profiles |
| **Real-time Sync** | New recipes sync to partner's device instantly via Durable Object |

### 2.6 Edge Cases

| Scenario | Behaviour |
|----------|-----------|
| Incomplete recipe (missing steps) | Warn but allow save. Show "Draft" badge. Exclude from Cook Now until complete. |
| Duplicate recipe name | Allow it. Show creation date and creator to distinguish. |
| One partner deletes a recipe | Both partners lose access (household-level). Confirm dialog: "This will remove the recipe for both of you." |
| Recipe edited by one partner | Changes sync instantly. Both see updated version. |
| Very long ingredient list | Scrollable list. No limit. |
| Photo too large | Auto-compress before upload. Max 2MB. |
| Recipe shared between households | Not supported in V1. Household-level only. |

---

## 3. Recipe URL Import

### 3.1 Overview

Allow users to paste a recipe URL from any website, blog, or social media post. The app extracts the recipe data (name, ingredients, steps, cook time, etc.) and saves it as a user recipe.

This is one of the most-requested features in food apps. MiseBook's entire product is built around it. Fitia allows saving from TikTok, Instagram, and websites. Samsung Food has community recipe sharing.

### 3.2 User Flow

1. User taps "Import Recipe" button (in Meal Plan tab or a "My Recipes" section)
2. Paste URL field appears
3. User pastes a URL (e.g., `https://www.bbcgoodfood.com/recipes/thai-green-curry`)
4. App processes the URL (Approach A or B — see below)
5. Extracted recipe data is shown in an editable form (same form as manual recipe creation)
6. User reviews, edits if needed, taps "Save Imported Recipe"
7. Recipe is stored in the household's recipe library with an "Imported" badge and original URL
8. Both partners see it instantly

### 3.3 Two Approaches

There are two fundamentally different ways to implement URL import. Both are analyzed below.

---

## 4. Approach A: AI Extraction

### 4.1 How It Works

Use the existing AI Gateway (Anthropic via Cloudflare) to parse recipe web pages.

**Flow:**
1. User pastes URL
2. Cloudflare Worker fetches the raw HTML of the page
3. Raw HTML is sent to Anthropic via AI Gateway with a structured extraction prompt
4. Anthropic returns structured JSON (name, ingredients, steps, cook time, etc.)
5. JSON is presented to the user in the editable recipe form
6. User saves

**AI Prompt Template:**
```
You are a recipe extraction assistant. Given the raw HTML of a recipe web page, extract the following information and return it as structured JSON:

{
  "name": "string — recipe title",
  "description": "string — brief description if available",
  "cook_time": "number — in minutes (0 if not found)",
  "servings": "number — default 2 if not found",
  "difficulty": "easy | medium | advanced — guess based on steps",
  "cuisine": "string — best guess from recipe content",
  "dietary_tags": ["array of applicable tags"],
  "ingredients": [
    { "name": "string", "quantity": "string", "unit": "string" }
  ],
  "steps": ["array of step strings in order"],
  "image_url": "string — primary recipe image URL if found"
}

Rules:
- Extract ingredients with quantities and units separated
- Steps should be individual, numbered actions
- If information is missing, use sensible defaults
- Ignore ads, navigation, comments, and non-recipe content
- Return ONLY valid JSON
```

### 4.2 Pros

| Pro | Detail |
|-----|--------|
| **No new dependencies** | Uses existing AI Gateway + Anthropic integration |
| **Leverages existing stack** | No new services, APIs, or npm packages |
| **Handles any format** | AI can parse any website layout, even unusual ones |
| **Handles social media** | Can extract recipes from TikTok descriptions, Instagram captions, Pinterest pins |
| **Improves over time** | As Anthropic models improve, extraction quality improves for free |
| **Zero additional cost at build** | No new vendor to evaluate, contract, or integrate |
| **Simple architecture** | Fetch HTML → send to AI → get JSON — three steps |

### 4.3 Cons

| Con | Detail |
|-----|--------|
| **Token cost per import** | Sending full HTML to Anthropic costs ~$0.01-0.05 per import (HTML is token-heavy) |
| **Inconsistent extraction** | AI may miss ingredients, combine steps, or hallucinate data |
| **Rate limits** | Anthropic API rate limits apply; bulk imports would be slow |
| **No structured data support** | Doesn't leverage Schema.org/JSON-LD recipe markup that many sites embed |
| **HTML bloat** | Recipe pages often have 50-100KB of HTML (ads, scripts, tracking); sending all of it to AI is wasteful |
| **Latency** | Fetch + AI processing = 3-8 seconds per import |
| **Error handling** | When AI fails, there's no fallback — the user gets an error |

### 4.4 Cost Analysis

| Metric | Estimate |
|--------|----------|
| Average HTML size per recipe page | 40-80KB (~10,000-20,000 tokens) |
| Anthropic input cost (Claude Haiku) | ~$0.01 per import |
| Anthropic input cost (Claude Sonnet) | ~$0.03 per import |
| Expected imports per household per month | 5-10 |
| Cost per household per month | $0.05-0.30 |
| At 10,000 households | $500-3,000/month |
| Mitigation | Strip HTML to text before sending (reduces tokens by 60-80%) |

### 4.5 Technical Implementation

```
POST /recipes/import-url
Body: { "url": "https://..." }

Worker flow:
1. Validate URL (must be http/https, no localhost)
2. Fetch HTML using Cloudflare Worker's fetch()
3. Strip HTML to text content (remove <script>, <style>, <nav>, <footer>)
4. Send stripped content to Anthropic via AI Gateway with extraction prompt
5. Parse JSON response
6. Return structured recipe data to frontend
7. Frontend shows editable form
8. User saves → stored in D1 as user recipe
```

**New API route:** `POST /recipes/import-url`
**New D1 table:** Same as user recipes (source: "imported", original_url field added)

---

## 5. Approach B: Dedicated Recipe Scraping

### 5.1 How It Works

Use a dedicated recipe scraping library or API that is specifically designed to extract structured recipe data from web pages.

**Option B1: recipe-scrapers (Node.js library)**

Open-source npm package (`recipe-scrapers`) that supports 100+ recipe websites with site-specific extractors. Uses CSS selectors and structured data (Schema.org/JSON-LD) to extract recipe data.

**Option B2: Third-party API (e.g., Spoonacular, Edamam)**

Paid API that provides recipe extraction, nutrition data, and ingredient parsing. More reliable but adds a dependency and monthly cost.

### 5.2 Option B1: recipe-scrapers Library

**Flow:**
1. User pastes URL
2. Cloudflare Worker passes URL to `recipe-scrapers`
3. Library checks if the site is supported (100+ sites: BBC Good Food, Allrecipes, Food Network, etc.)
4. If supported: extracts structured data using site-specific parser
5. If not supported: falls back to Schema.org/JSON-LD extraction
6. If neither works: returns error, suggest manual entry
7. Extracted data is presented in editable form
8. User saves

**Supported sites (partial list):** Allrecipes, BBC Good Food, Bon Appetit, Budget Bytes, Cooking Light, Delish, Epicurious, Food Network, Food52, Genius Kitchen, HelloFresh, Jamie Oliver, King Arthur Baking, MyRecipes, Serious Eats, Taste.com.au, Tasty, The Kitchn, Yummly, and 80+ more.

### 5.3 Option B2: Spoonacular API

**Flow:**
1. User pastes URL
2. Cloudflare Worker calls Spoonacular's "Extract Recipe from Website" endpoint
3. API returns structured recipe data with nutrition info
4. Data is presented in editable form
5. User saves

**Spoonacular pricing:** Free tier (150 requests/day), $0.003/request above that. At scale: $29-149/month.

### 5.4 Pros

| Pro | Detail |
|-----|--------|
| **Purpose-built** | Designed specifically for recipe extraction — much more reliable |
| **Structured data** | Leverages Schema.org/JSON-LD when available (many recipe sites use it) |
| **Site-specific parsers** | 100+ websites have custom extraction logic — very accurate |
| **Lower cost per import** | No AI tokens consumed; library runs locally |
| **Faster** | No AI processing latency; typically <1 second |
| **Deterministic** | Same URL always returns same result (no AI randomness) |
| **Ingredient normalisation** | Spoonacular normalises ingredient names to match nutrition databases |

### 5.5 Cons

| Con | Detail |
|-----|--------|
| **New dependency** | Adds an npm package or third-party API to the stack |
| **Limited coverage** | recipe-scrapers supports 100+ sites but there are millions of recipe pages; unsupported sites fail |
| **No social media** | Can't extract from TikTok, Instagram, Pinterest (not standard recipe pages) |
| **Maintenance burden** | recipe-scrapers requires updates when websites change their HTML structure |
| **Cloudflare Worker compatibility** | Some Node.js libraries don't run in Workers (no filesystem, limited Node APIs) |
| **Spoonacular dependency** | If using the API, you're locked into a third-party service |
| **Doesn't handle weird formats** | Blogs with non-standard recipe layouts will fail without AI fallback |

### 5.6 Cost Analysis

| Approach | Cost per Import | Monthly Cost (10K households, 5 imports each) |
|----------|----------------|-----------------------------------------------|
| recipe-scrapers (library) | $0 | $0 (runs on Worker) |
| Spoonacular (API) | $0.003 | ~$750/month at 250K imports |
| AI Extraction (Approach A) | $0.01-0.03 | ~$2,500-7,500/month |

### 5.7 Technical Implementation (recipe-scrapers)

```
POST /recipes/import-url
Body: { "url": "https://..." }

Worker flow:
1. Validate URL
2. Pass to recipe-scrapers library
3. If supported site: extract structured data
4. If unsupported: check for Schema.org/JSON-LD in fetched HTML
5. If found: parse JSON-LD recipe data
6. If neither: return { supported: false, suggestion: "Try manual entry" }
7. Return structured recipe data
```

**Critical note:** recipe-scrapers is a Node.js library. Cloudflare Workers use V8 isolates, not Node.js. The library may need to be bundled with Wrangler or run as an external service. This needs testing.

**Alternative:** Run recipe-scrapers in a separate Cloudflare Worker that uses `node_compat` flag, or use it via an external API endpoint.

---

## 6. Approach Comparison & Recommendation

### 6.1 Side-by-Side Comparison

| Dimension | Approach A (AI Extraction) | Approach B1 (recipe-scrapers) | Approach B2 (Spoonacular) |
|-----------|:------------------------:|:--------------------------:|:------------------------:|
| Accuracy | Good (85-90%) | Excellent for supported sites (95%+) | Excellent (95%+) |
| Coverage | Universal (any URL) | 100+ sites + Schema.org | Most recipe sites |
| Social media | Yes (TikTok, Instagram) | No | No |
| Cost per import | $0.01-0.03 | $0 | $0.003 |
| Latency | 3-8 seconds | <1 second | 1-2 seconds |
| New dependencies | None | 1 npm package | 1 third-party API |
| Cloudflare compatible | Yes (fetch + AI Gateway) | Needs testing | Yes (fetch) |
| Handles weird formats | Yes (AI is flexible) | No | Moderate |
| Nutrition data | No (AI guesses) | No | Yes (full nutrition) |
| Ingredient normalisation | No | Partial | Yes |
| Offline capable | No (needs AI) | N/A (server-side) | No (needs API) |
| Maintenance | None (AI improves) | Medium (site changes) | Low (Spoonacular maintains) |

### 6.2 Recommended Approach: Hybrid (B1 + A Fallback)

**Primary:** Use `recipe-scrapers` (Approach B1) for supported sites. Fast, free, accurate.
**Fallback:** Use AI extraction (Approach A) for unsupported sites and social media.

**Flow:**
```
User pastes URL
       |
       v
recipe-scrapers: Is this site supported?
       |
       ├── YES ──► Extract with recipe-scrapers (fast, free, accurate)
       |                |
       |                v
       |            Return structured data
       |
       └── NO ──► Check for Schema.org/JSON-LD
                      |
                      ├── FOUND ──► Parse JSON-LD (fast, free)
                      |                |
                      |                v
                      |            Return structured data
                      |
                      └── NOT FOUND ──► AI extraction (slower, costs tokens)
                                            |
                                            v
                                       Return structured data
```

**Why this hybrid:**
- 80%+ of recipe URLs will hit the fast, free path (recipe-scrapers or JSON-LD)
- Social media and weird blogs get handled by AI (the only thing that can parse them)
- Cost is minimised (AI is only used as fallback, not primary)
- Coverage is universal (everything works)
- Accuracy is maximised (site-specific parsers are more accurate than AI)

### 6.3 Implementation Notes

1. **Cloudflare Worker compatibility:** Test `recipe-scrapers` in a Worker environment. If it fails (Node.js APIs), either:
   - Bundle it with Wrangler's `node_compat` flag
   - Run it in a separate Cloudflare Durable Object
   - Use the library server-side only and call it from the Worker

2. **HTML pre-processing for AI fallback:** Before sending to Anthropic, strip HTML to just text content. Remove `<script>`, `<style>`, `<nav>`, `<header>`, `<footer>`, and all class/style attributes. This reduces token count by 60-80% and improves extraction accuracy.

3. **Caching:** Cache extracted recipes by URL hash in D1. If another user imports the same URL, return the cached version. This saves AI costs and improves latency.

4. **User review is mandatory:** Never auto-save an imported recipe. Always show the editable form so the user can correct errors before saving.

5. **Attribution:** Store the original URL. Display "Imported from [domain.com]" on the recipe card. This is both ethical and legally safer.

---

## 7. Competitive Justification

### 7.1 Who Already Has These Features

| Competitor | User-Generated Recipes | URL Import | Notes |
|-----------|:---------------------:|:---------:|-------|
| MiseBook | No (import only) | Yes (core feature) | "Meal planning for couples who love cooking together" |
| Fitia | Yes (save from web) | Yes (TikTok, IG, websites) | 10M users, recipe saving is core to their workflow |
| Samsung Food | Yes (community) | Yes (URL + community library) | Millions of community recipes |
| Cookbond | No | No | Only curated date night packs |
| Yummo | No | No | Minimal recipe management |
| Healthspan | No (AI-generated only) | No | No user content |
| PlateMates | No (106 curated only) | No | Fixed recipe library |
| Mealime | No | No | Fixed library, no user content |
| OttoChef | No (AI + social) | No | Community feed but not user recipes |

### 7.2 What Adding These Features Does to Cupla's Position

| Dimension | Current V2 | With User Recipes | With URL Import | With Both |
|-----------|:---------:|:-----------------:|:---------------:|:---------:|
| Recipe count | 50-100 curated | 50-100 + unlimited user | 50-100 + unlimited imports | Unlimited |
| Personalisation | None | Strong (your recipes) | Strong (web recipes) | Very strong |
| "Kitchen brain" claim | Moderate | Strong | Strong | Very strong |
| Switching costs | Moderate | High | High | Very high |
| Competitive parity vs MiseBook | Behind | Behind | Matches | Exceeds |
| Competitive parity vs Fitia | Behind | Behind | Behind (no social) | Closer |

### 7.3 The Switching Cost Argument

User-generated recipes and imported recipes create **high switching costs** — the strongest form of retention.

Once a couple has:
- 15 of their own recipes saved
- 20 recipes imported from their favourite blogs
- All connected to their pantry and shopping lists
- All going through adaptive cooking with their profiles tuned

...leaving Cupla means losing their entire personalised food library. The cost of switching becomes the cost of rebuilding everything from scratch.

This is the same moat that AnyList has with shared grocery lists, that Fitia has with saved recipes, and that Samsung Food has with community recipes. Cupla would have it for couples-specific adaptive cooking.

---

## 8. Technical Feasibility

### 8.1 Within the Existing Cloudflare Stack

| Component | User-Generated Recipes | URL Import (AI) | URL Import (Scraping) |
|-----------|:---------------------:|:---------------:|:--------------------:|
| D1 Database | New table + indexes | New fields on same table | New fields on same table |
| Durable Objects | Sync via existing WebSocket | Same | Same |
| AI Gateway | Not needed for manual creation | Yes (extraction prompt) | No (fallback only) |
| KV | Not needed | Cache URL → recipe mapping | Same |
| Workers | New API routes | New fetch + AI route | New fetch + parse route |
| Frontend | New recipe form component | URL input + form component | Same |

### 8.2 D1 Schema Addition

```sql
CREATE TABLE user_recipes (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  created_by TEXT NOT NULL, -- partner_a or partner_b
  source TEXT NOT NULL DEFAULT 'user', -- 'user' or 'imported'
  original_url TEXT, -- NULL for user-created, URL for imported
  name TEXT NOT NULL,
  description TEXT,
  cook_time INTEGER, -- minutes
  difficulty TEXT, -- easy, medium, advanced
  cuisine TEXT,
  servings INTEGER DEFAULT 2,
  dietary_tags TEXT, -- JSON array
  ingredients TEXT NOT NULL, -- JSON array of objects
  steps TEXT NOT NULL, -- JSON array of strings
  photo_url TEXT, -- blob reference or external URL
  is_draft BOOLEAN DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (household_id) REFERENCES households(id)
);

CREATE INDEX idx_user_recipes_household ON user_recipes(household_id);
CREATE INDEX idx_user_recipes_cuisine ON user_recipes(cuisine);
```

### 8.3 Storage Considerations

- **Photos:** Store in Cloudflare R2 (object storage) — free tier includes 10GB. At ~500KB per photo, that's ~20,000 recipes before needing to pay.
- **Recipe data:** JSON fields in D1. Each recipe is ~2-5KB. D1 free tier includes 5GB — enough for hundreds of thousands of recipes.
- **Import cache:** KV stores URL → recipe_id mappings to avoid re-importing. TTL: 30 days.

### 8.4 API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/recipes` | GET | List all recipes (curated + user + imported) with optional filters |
| `/recipes/:id` | GET | Single recipe details |
| `/recipes` | POST | Create a new user recipe |
| `/recipes/:id` | PUT | Update an existing user recipe |
| `/recipes/:id` | DELETE | Delete a user recipe (both partners lose access) |
| `/recipes/import-url` | POST | Import a recipe from a URL (returns extracted data) |
| `/recipes/import-save` | POST | Save an imported recipe (after user review) |

---

## 9. Build Time Estimates

### 9.1 Per-Feature Estimates

| Feature | Duration | Dependencies | Notes |
|---------|----------|-------------|-------|
| User-Generated Recipes — Backend | 1 week | D1 schema, API routes | Straightforward CRUD |
| User-Generated Recipes — Frontend | 1.5 weeks | Recipe form, photo upload, ingredient input | Form complexity is the main effort |
| User-Generated Recipes — Integration | 0.5 weeks | Pantry matching, Mode A/B display | Connect to existing systems |
| URL Import — AI Extraction | 1 week | AI Gateway integration | HTML stripping + prompt tuning |
| URL Import — Recipe Scraping | 1 week | recipe-scrapers integration, Worker compat testing | Library bundling may take extra time |
| URL Import — Hybrid Logic | 0.5 weeks | Fallback routing, caching | Simple conditional logic |
| URL Import — Frontend | 1 week | URL input, preview, editable form | Shared with user recipe form |
| Testing & Polish | 1 week | All features | Edge cases, error handling |

### 9.2 Total Build Impact

| Scenario | Additional Time | When to Build |
|----------|----------------|---------------|
| User-Generated Recipes only | +3 weeks | Can be built in parallel with V2 Steps 6-7 |
| URL Import only (AI) | +2 weeks | Can be built in parallel with V2 Steps 6-7 |
| URL Import only (Hybrid) | +2.5 weeks | Can be built in parallel with V2 Steps 6-7 |
| Both features | +5-6 weeks | Best as post-V2 launch, or parallel with Phase 3 |

### 9.3 Impact on V2 Timeline

| Build Plan | Total Timeline | vs V2 Baseline |
|-----------|---------------|----------------|
| V2 without extensions | 17.5 weeks | Baseline |
| V2 + User-Generated Recipes (parallel with Phase 2) | 17.5 weeks | Same (parallel) |
| V2 + Both features (sequential after V2) | 17.5 + 5 = 22.5 weeks | +5 weeks |
| V2 + Both features (fully parallel) | 19-20 weeks | +1.5-2.5 weeks |

---

## 10. Priority Ranking

### 10.1 Recommended Build Order

| Priority | Feature | When | Rationale |
|:-------:|---------|------|-----------|
| **1** | User-Generated Recipes | **Include in V2 build (parallel with Phase 2)** | Low technical risk, high impact on switching costs, leverages existing stack, no new dependencies. Couples who can save their own recipes will not leave. |
| **2** | URL Import (Hybrid: B1 + A) | **Post-V2 launch (Phase 3)** | Medium technical risk (Worker compat needs testing), high impact on recipe count and competitive parity. Better to ship V2 first, then add import based on user demand. |
| **3** | Recipe database growth (200+) | **Post-V2, ongoing** | Curate more recipes over time. AI-generated supplements help. User recipes and imports reduce urgency. |
| **4** | Meal calendar / weekly planning | **Post-V2 (Phase 3)** | Deferred in V2 design. Wait for user feedback. If users ask for it, prioritise. |
| **5** | Push notifications | **Post-V2 (Phase 3)** | Important for real-time collaboration feel, but not critical for MVP. |

### 10.2 Why User-Generated Recipes Ship First

1. **No new dependencies.** Uses existing D1, Durable Objects, AI Gateway. Zero new services.
2. **Low technical risk.** CRUD operations, form handling, photo upload — standard web development.
3. **High switching cost.** Once couples save 10+ recipes, they won't leave.
4. **Kitchen brain positioning.** "Your recipes, your pantry, your meals, your shopping" — everything in one place.
5. **Emotional resonance.** "Grandma's Chicken Soup" with a photo — this is the kind of content that makes an app feel personal.
6. **Can run in parallel.** Backend and frontend can be built while Phase 2 (meal picker) is in progress.

### 10.3 Why URL Import Waits

1. **Worker compatibility uncertainty.** recipe-scrapers may not work in Workers without extra effort.
2. **User validation needed.** Do couples actually import recipes from URLs? MiseBook says yes, but MiseBook has near-zero users. Better to validate with your own users.
3. **Not critical for launch.** 50-100 curated + user-generated recipes is enough to launch. URL import is a growth feature, not a launch feature.
4. **Complexity.** Hybrid approach means two code paths (scraping + AI fallback), two error handling strategies, and caching logic. More things to test.

---

## 11. Not Included: Interactive Cooking Mode

### 11.1 What Was Considered

An interactive cooking mode where:
- Partners see each other's progress in real-time ("I'm on step 3")
- Tasks are divided between partners ("you chop, I stir")
- Shared timers count down for each step
- Fullscreen mode keeps the screen awake

This is what Cookbond does with its "Me / You / Us" role system. OttoChef also has a fullscreen cooking mode with AI chat.

### 11.2 Why It's Not Included

**Deliberate design decision: Cupla's cooking output is passive (instructions + plating cards), not interactive.**

The rationale:

1. **Cupla's moat is the system, not the cooking moment.** The moat is pantry → meal → shopping → pantry. The cooking output (instructions + plating) is the endpoint, not the product. Adding interactive cooking would shift focus away from the loop.

2. **Cooking together doesn't need an app.** When two people cook together, they talk. They don't stare at their phones checking which step their partner is on. The adaptive plating cards tell them what they need; the actual cooking is a human activity.

3. **Role assignment is a feature, not a product.** Cookbond's Me/You/Us system is clever but hasn't found product-market fit (zero ratings on App Store). It's a nice-to-have, not a must-have.

4. **Scope protection.** The V1 Product Development Steps document explicitly warns against overbuilding: "if a feature doesn't serve 'two people cooking together,' it doesn't ship." Interactive cooking mode serves the cooking moment. The current passive output serves the cooking loop. The loop is the product.

5. **Complexity explosion.** Real-time step tracking, role assignment logic, shared timers, fullscreen mode with wake lock — each is a significant feature. Together they would add 4-6 weeks to the build.

### 11.3 What Cupla's Cooking Experience IS

- **Step-by-step instructions** — sequential list, tap to advance
- **Dual plating cards** — per-person portions with macros, side by side
- **Same for both partners** — both see the same instructions on their own devices
- **Non-diet handling** — "Same for both" when neither partner diets, adapted when one or both do
- **"We're Done" confirmation** — tap when finished to log the meal and update pantry

This is passive output. The app tells you what to cook and how to plate it. The actual cooking is between the two of you, face to face, no screens needed beyond the plating reference.

### 11.4 Future Consideration

If user feedback strongly requests:
- Role assignment ("tell me what to do vs what my partner does")
- Shared timers
- Fullscreen cooking mode with screen wake lock

...these could be added as a "Cook Mode" feature in a future update. But they should only be built if users ask for them, not because a competitor (Cookbond, OttoChef) has them.

The current approach — instructions + plating — is the right starting point. It's simple, it works, and it keeps the focus on the loop.

---

## Appendix: Summary of All Proposed Features

| Feature | Build Time | New Dependencies | Priority | When |
|---------|-----------|-----------------|:--------:|------|
| User-Generated Recipes | 3 weeks | None | 1 | V2 (parallel) |
| URL Import (Hybrid) | 2.5 weeks | recipe-scrapers npm package | 2 | Post-V2 |
| Meal Calendar | 2 weeks | None | 3 | Post-V2 |
| Push Notifications | 1 week | Web Push API | 4 | Post-V2 |
| Interactive Cooking Mode | 4-6 weeks | Screen wake lock, shared state | Not planned | Only if users demand |

**Total additional build time for Priority 1-2: ~5.5 weeks**
**With parallelisation: ~3-4 weeks additional on top of V2**
