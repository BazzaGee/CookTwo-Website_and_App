# Cupla V2 — Meal Picker Specification

**Date:** May 2026
**Status:** Core Design Document — Version 2 Meal Picker System

---

## The Meal Plan Tab — V2 Architecture

The Meal Plan tab is the heart of Cupla. In V2, it has two modes, accessed via a toggle at the top:

```
┌──────────────────────────────────────────────────┐
│  Meal Plan                                       │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  [● Cook Now]  [  I Want This  ]         │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  (Content changes based on selected mode)        │
└──────────────────────────────────────────────────┘
```

---

## Mode A — "Cook Now"

### Purpose
Show meals you can make RIGHT NOW with zero extra shopping. No trips to the store. No waiting. Just cook.

### How It Works

**Step 1: AI scans your pantry**
- Reads all items in your pantry
- Reads both partners' profiles (diet, goals, allergies)
- Generates a list of meals you can make with ZERO extra ingredients

**Step 2: Meals are prioritised**
1. **Tier 1 — "Can make now"** (100% pantry match, zero shopping)
2. **Tier 2 — "Almost there"** (needs 1-2 extra items — shown below, clearly separated)
3. **Tier 3 — "Worth the trip"** (needs 3+ items — shown last)

**Step 3: Visual meal cards**
Each card shows:
- **Stock photo** of the meal
- **Meal name** (e.g., "Mediterranean Chicken & Quinoa Bowl")
- **Cook time** (e.g., "25 min")
- **Pantry match** (e.g., "100% — you have everything")
- **Dietary fit** (e.g., "Works for both: Vegetarian + Omnivore")
- **Cuisine type** badge (e.g., "Mediterranean")

**Step 4: Tap → Adaptive Cooking**
- Tap a meal → goes straight to the adaptive cooking view
- AI generates dual plating instructions
- Step-by-step cooking workflow begins
- No shopping list step — that's the point of this mode

### The "Cook Now" Card Layout

```
┌─────────────────────────────────┐
│  [Stock Photo]                  │
│                                 │
│  Mediterranean Chicken Bowl     │
│  ⏱ 25 min  🏷 Mediterranean    │
│                                 │
│  ✅ 100% — You have everything  │
│  ✅ Works for both partners     │
│                                 │
│  [ Cook This Now → ]            │
└─────────────────────────────────┘
```

### Edge Cases

| Scenario | Behaviour |
|----------|-----------|
| Pantry is empty | Show "Your pantry is empty. Switch to 'I Want This' to browse and shop." |
| Only 1-2 meals available | Show them prominently with "Not much to work with? Try 'I Want This'." |
| One partner dieting, one not | Show meals that work for both — adapted portions for the dieter, normal for the other |
| Neither dieting | Show all meals — no dietary filtering needed |
| Both dieting differently | Show meals that can be adapted for both diets |

---

## Mode B — "I Want This"

### Purpose
Let you browse, pick what appeals to you, then see what you need to buy. For when you're craving something specific.

### How It Works

**Step 1: Visual grid of meal cards**
- Stock photos, names, cook times, cuisine types
- Mix of:
  - **AI-generated meals** based on your pantry (prioritised by pantry match %)
  - **Curated recipe database** (50-100 meals, AI-generated and curated)
- Sorted by: pantry match % (highest first), then cook time (shortest first)

**Step 2: Filters available**
- **Cook time:** Under 15 min, 15-30 min, 30-45 min, 45+ min
- **Cuisine type:** Mediterranean, Asian, Mexican, American, Indian, Italian, etc.
- **Difficulty:** Easy, Medium, Advanced
- **Dietary fit:** Works for both, Works for Partner A, Works for Partner B
- **"Can we make this now?"** — toggle to show only meals with 100% pantry match

**Step 3: Tap a meal → Pantry Check**
- App checks your pantry against the recipe
- Shows two lists:
  - ✅ **You have:** chicken, rice, spinach, olive oil
  - 🔴 **You need:** soy sauce, ginger, sesame seeds
- Shows total missing items count

**Step 4: "Add Missing to Shopping List"**
- One tap adds all missing ingredients to your shared grocery list
- Both partners see the update instantly
- You can also skip this and just save the recipe for later

**Step 5: Adaptive Cooking**
- Once you're ready (have the ingredients or willing to shop) → tap "Cook This"
- Goes to adaptive cooking view with dual plating instructions

### The "I Want This" Card Layout

```
┌─────────────────────────────────┐
│  [Stock Photo]                  │
│                                 │
│  Thai Green Curry               │
│  ⏱ 30 min  🏷 Asian  📊 Medium │
│                                 │
│  🔶 70% match — need 3 items    │
│  ✅ Works for both partners     │
│                                 │
│  [ View Details → ]             │
└─────────────────────────────────┘
```

### The "View Details" Screen

```
┌─────────────────────────────────┐
│  ← Back                         │
│                                 │
│  [Stock Photo - Large]          │
│                                 │
│  Thai Green Curry               │
│  ⏱ 30 min  🏷 Asian  📊 Medium │
│                                 │
│  A fragrant, creamy curry with  │
│  fresh vegetables and your      │
│  choice of protein.             │
│                                 │
│  ─── Ingredients ───            │
│  ✅ Chicken breast (have)       │
│  ✅ Coconut milk (have)         │
│  ✅ Green beans (have)          │
│  🔴 Green curry paste (need)    │
│  🔴 Fish sauce (need)           │
│  🔴 Thai basil (need)           │
│                                 │
│  [ Add 3 Missing to List ]      │
│  [ Cook This Now → ]            │
└─────────────────────────────────┘
```

### Recipe Database (50-100 Meals)

**Source:** AI-generated and curated. Each meal is:
- Generated by AI with full recipe details (ingredients, steps, cook time, cuisine, difficulty)
- Checked for dietary compatibility (can be adapted for various diets)
- Assigned a stock photo (matched by cuisine type and meal category)
- Stored locally in the app for offline browsing

**Categories:**
- Quick meals (under 15 min)
- Weeknight dinners (15-30 min)
- Weekend cooking (30-45 min)
- Meal prep friendly

**Cuisines:**
- Mediterranean, Asian, Mexican, American, Indian, Italian, Middle Eastern, African

**Each recipe includes:**
- Name, description, cook time, difficulty, cuisine type
- Full ingredient list
- Step-by-step instructions
- Dietary tags (vegetarian, vegan, gluten-free, etc.)
- Stock photo reference

---

## The Adaptive Cooking Layer (Both Modes)

Once a meal is chosen from either mode, the same adaptive cooking experience begins:

### Step-by-Step Workflow

```
┌─────────────────────────────────┐
│  Thai Green Curry               │
│                                 │
│  STEP-BY-STEP WORKFLOW          │
│                                 │
│  ● 1. Cook the rice             │
│  ○ 2. Prep the vegetables       │
│  ○ 3. Make the curry base       │
│  ○ 4. Add protein and simmer    │
│  ○ 5. Plate for each partner    │
│                                 │
│  [ Next Step → ]                │
└─────────────────────────────────┘
```

### Dual Plating Cards

```
┌──────────────────┐  ┌──────────────────┐
│  🥗 Alex's Plate │  │  🍖 Jordan's     │
│                  │  │     Plate        │
│  450 kcal        │  │  700 kcal        │
│                  │  │                  │
│  4oz chicken     │  │  6oz chicken     │
│  over spinach    │  │  over full cup   │
│  ½ cup rice      │  │  of rice         │
│                  │  │  + extra sauce   │
│  P: 35g C: 28g   │  │  P: 55g C: 62g   │
│  F: 14g          │  │  F: 26g          │
└──────────────────┘  └──────────────────┘
```

### Non-Diet User Handling

If one or both partners have no specific diet:
- **Both non-dieting:** Equal portions, no adaptation needed. Plating cards show "Same for both."
- **One dieting, one not:** Adapted portions for the dieter, normal portions for the other.
- **The app never forces dieting.** It adapts to whatever the users set.

---

## Data Flow

```
User opens Meal Plan tab
       │
       ▼
  Toggle: Cook Now / I Want This
       │
       ├── Cook Now ──► AI scans pantry
       │                      │
       │                      ▼
       │               Generate meal list
       │               (prioritised by match %)
       │                      │
       │                      ▼
       │               Show visual cards
       │                      │
       │                      ▼
       │               Tap → Adaptive Cooking
       │
       └── I Want This ──► Show recipe grid
                                │
                                ▼
                         Apply filters (optional)
                                │
                                ▼
                         Tap meal → Pantry check
                                │
                                ▼
                         Show have vs. need
                                │
                                ▼
                         Add missing to list (optional)
                                │
                                ▼
                         Tap "Cook This" → Adaptive Cooking
```

---

## Technical Requirements

| Requirement | Detail |
|-------------|--------|
| AI prompt | Must generate meal LISTS, not single meals. Include: pantry items, both profiles, desired output format (JSON array) |
| Recipe database | 50-100 meals stored locally. JSON format. Each meal has: name, description, cook time, difficulty, cuisine, ingredients[], steps[], dietary tags, stock photo reference |
| Pantry matching algorithm | Score each recipe by: % of ingredients in pantry. Tier 1 = 100%, Tier 2 = 80-99%, Tier 3 = <80% |
| Filtering logic | Client-side filtering on: cook time range, cuisine type, difficulty, dietary compatibility, pantry match % |
| Stock photos | Mapped by cuisine type + meal category. Local references. No external API calls needed |
| Offline support | Recipe database stored locally. Mode B works offline (browse saved recipes). Mode A needs AI connection for generation |
| Real-time sync | Shopping list updates from Mode B sync instantly to both partners |
