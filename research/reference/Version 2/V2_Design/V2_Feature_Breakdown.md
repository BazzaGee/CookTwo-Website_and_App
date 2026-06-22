# Cupla V2 — Feature Breakdown

**Date:** May 2026
**Status:** Design Document — Updated Feature Specifications for V2

---

## Tab Structure (Unchanged from V1)

```
Shopping | Pantry | Meal Plan | Profiles | Settings
```

---

## Tab 1: Shopping — "Our Shopping List"

**Status:** Unchanged from V1

**What it does:** Real-time shared grocery list that both partners see and edit simultaneously.

**How it works:**
- Add items manually or tap quick-add chips
- Items auto-categorize (Produce, Meat, Dairy, Pantry, Other)
- Check off items → move to "Checked" section
- Partner badges show who added each item
- On checked items: Delete OR "Move to Pantry"
- Offline queue for supermarket dead zones

**V2 relevance:** Mode B ("I Want This") feeds missing ingredients directly into this tab. The shopping list is the bridge between "I want this meal" and "now I can cook it."

---

## Tab 2: Pantry — "Our Kitchen"

**Status:** Unchanged from V1

**What it does:** Track what you actually have at home. Input for AI meal generation.

**How it works:**
- Natural language input: "chicken, 2 cups rice, spinach" → parsed into separate items
- Category grouping (same as Shopping)
- Real-time sync between partners
- Delete items as you use them
- Items from Shopping auto-move to Pantry via "Move to Pantry"

**V2 relevance:** Both modes read from the pantry. Mode A uses it to generate "can cook now" meals. Mode B uses it to check what you have vs. what you need for any recipe.

---

## Tab 3: Meal Plan — "What Should We Cook?"

**Status:** MAJOR V2 UPDATE — Now has two modes

### The Toggle

At the top of the tab:
```
[● Cook Now]  [  I Want This  ]
```

### Mode A: "Cook Now"

**What it does:** Shows meals you can make RIGHT NOW with zero extra shopping.

**How it works:**
- AI scans pantry + both profiles → generates meal list
- Prioritised by pantry match % (100% first)
- Visual cards with stock photos, cook time, cuisine type, dietary fit
- Tap → goes straight to adaptive cooking
- No shopping list step

**What makes it different from V1:**
- V1: AI gave you ONE meal. You had no choice.
- V2: AI gives you a LIST of meals. You choose what appeals.
- V1: Assumed both partners were dieting.
- V2: Handles diet, non-diet, and mixed scenarios gracefully.

### Mode B: "I Want This"

**What it does:** Browse meals, pick what you want, see what you need to buy.

**How it works:**
- Visual grid of meal cards (AI-generated + curated recipe database)
- Filters: cook time, cuisine type, difficulty, dietary fit, "can we make this now?"
- Tap a meal → pantry check (have vs. need)
- "Add Missing to Shopping List" → one tap
- Tap "Cook This" → adaptive cooking

**What makes it different from V1:**
- V1: No browsing. No choosing. No filtering.
- V2: Full visual browse experience with stock photos and filters.
- V1: No recipe database.
- V2: 50-100 curated recipes available offline.

### Adaptive Cooking View (Both Modes)

**What it does:** One shared cooking workflow with two distinct plating instructions.

**How it works:**
- Step-by-step cooking timeline
- Dual plating cards (Partner A's plate vs Partner B's plate)
- Per-person macros (calories, protein, carbs, fat)
- Handles diet/non-diet/mixed scenarios
- "We Dinner Cleaned!" completion button

**Status:** Unchanged from V1 concept, but now accessible from BOTH modes.

---

## Tab 4: Profiles — "Who Are You Cooking For?"

**Status:** Unchanged from V1

**What it does:** Set up both partners' dietary preferences, allergies, and body goals.

**How it works:**
- Dietary preference: Omnivore, Vegetarian, Vegan, Pescatarian, Keto, Paleo, Gluten Free, or Custom
- Allergies: Multi-select + custom add
- Partner visibility: See your partner's profile
- Body Profile: Weight, height, age, gender, activity level, goal
- Auto-calculates TDEE using Mifflin-St Jeor equation
- Shows target calories based on goal

**V2 relevance:** Profiles power the adaptive cooking layer for BOTH modes. In V2, profiles are even more important because the AI must handle non-diet users gracefully (equal portions, no adaptation needed).

---

## Tab 5: Settings

**Status:** Unchanged from V1

Reserved for future features (notifications, account management, export data).

---

## New V2 Features (Not in V1)

| Feature | Description | Tab |
|---------|-------------|-----|
| **Cook Now mode** | AI-generated meal list prioritised by pantry match % | Meal Plan |
| **I Want This mode** | Browse & pick meals with filters and pantry check | Meal Plan |
| **Recipe database** | 50-100 curated meals stored locally | Meal Plan (Mode B) |
| **Meal card visuals** | Stock photos for all meal cards | Meal Plan (both modes) |
| **Filtering system** | Cook time, cuisine, difficulty, dietary fit, pantry match | Meal Plan (Mode B) |
| **Pantry check view** | Have vs. Need list for any recipe | Meal Plan (Mode B) |
| **Non-diet handling** | Graceful equal portions when no diet is set | Profiles + Adaptive Cooking |

---

## V1 Features Carried Over to V2

| Feature | Status |
|---------|--------|
| Shared grocery list with real-time sync | ✅ Same |
| "Move to Pantry" bridge | ✅ Same |
| Natural language pantry input | ✅ Same |
| Dual partner profiles with TDEE | ✅ Same |
| Adaptive shared cooking (one meal, two plates) | ✅ Same |
| PWA architecture | ✅ Same |
| Sub-100ms WebSocket sync | ✅ Same |
| Offline queue for shopping list | ✅ Same |
| "We" language, relationship-first UX | ✅ Same |

---

## The Product Loop (V2)

```
PANTRY ──► COOK NOW ──► ADAPTIVE COOKING ──► PANTRY
   │           │              │                  ▲
   │           │              │                  │
   │           ▼              │                  │
   │      I WANT THIS ────────┘                  │
   │           │                                 │
   │           ▼                                 │
   │      SHOPPING LIST ─────────────────────────┘
   │      (Add missing, check off, move to pantry)
   │
   └── Profiles feed into both Cook Now and I Want This
```
