# Feature 8 — Couple's Meal Picker

> **STATUS: ON HOLD — NOT FOR CURRENT IMPLEMENTATION**
>
> **Date Parked:** May 26, 2026
> **Reason:** This feature is designed and fully specified but is intentionally held back from the current build cycle. It may be built onto in a future release. Do not implement until explicitly approved.
>
> This document exists as a complete spec so nothing is lost when we're ready to pick it up.

---

## 1. Overview

A collaborative recipe selection experience where **both partners** see AI-generated recipes that satisfy both their diets, allergies, and food preferences using what's currently in the pantry. Each partner votes. First mutual approval becomes "our meal."

### How It Differs From Existing Meal Plan Tab

| Dimension | Meal Plan Tab | Meal Picker (This Feature) |
|-----------|---------------|---------------------------|
| **Decision maker** | AI picks one recipe | Both partners vote on multiple options |
| **Output** | Single recipe | 3-5 recipe cards to choose from |
| **Collaboration** | Solo (one partner generates) | Joint (both partners vote in real-time) |
| **Flow** | Generate → cook | Generate → vote → match → cook |
| **Relationship value** | Convenience | Shared activity, equal input |

### Closest Competitor

**Cloche** ("Swipe. Match. Cook.") — Tinder-style recipe discovery for couples. Pre-launch, 500+ waitlist.

**Cupla does it better because:**
- AI-generated from your actual pantry (not browsing a recipe database)
- Diet-constraint-aware (every suggestion works for both partners)
- Real-time vote sync (not async)
- Pantry ingredient matching visible on each card
- Integrated with shopping list and meal calendar

---

## 2. User Experience

### Placement

New 6th tab in bottom navigation: **"Pick Together"**

```
Shopping | Pantry | Meal Plan | Pick Together | Profiles | Settings
```

### Screen Flow

**State 1 — IDLE**
- Hero: "What should WE cook tonight?"
- Big button: "Pick a Meal Together"
- Shows if partner is online (green dot = ready, pulsing dot = waiting)
- Requires at least one partner to have a profile set

**State 2 — GENERATING**
- Both partners see loading animation simultaneously
- Copy: "Finding meals you'll both love..."

**State 3 — VOTING**
- 3-5 recipe cards displayed
- Each card shows:
  - Recipe name + brief description
  - Cook time + calories per serving
  - Diet compatibility badge: "Works for both (Vegetarian + Omnivore)"
  - Ingredient match: "4 of 6 ingredients in pantry"
  - Expandable ingredient list (green = in pantry, orange = need to buy)
  - Two buttons: "Let's do it" (sage green) / "Not tonight" (gray)
- Real-time partner vote status on each card:
  - Green checkmark = partner approved
  - Gray X = partner skipped
  - Pulsing dot = waiting for partner's vote

**State 4 — MATCHED**
- Celebration animation (subtle, not over the top)
- "You both want [Recipe Name]!"
- Two action buttons:
  - "Add missing ingredients to shopping list"
  - "Add to meal calendar"
- Option to view full recipe with steps

**State 5 — NO MATCH**
- All cards voted on, no mutual approval
- "No match this round — let's try again!"
- Button: "Generate more options" (AI creates a new batch)
- Optional: "Relax constraints" toggle to broaden recipe suggestions

---

## 3. Technical Specification

### Frontend Components

| Component | File | Purpose |
|-----------|------|---------|
| `MealPickerTab.tsx` | `frontend/src/pages/` | Main tab — orchestrates session states (idle/generating/voting/matched/no-match) |
| `RecipeCard.tsx` | `frontend/src/components/` | Individual recipe card with name, time, macros, ingredient match %, diet badges, approve/skip buttons |
| `VoteStatusBar.tsx` | `frontend/src/components/` | Shows partner's vote status per card in real-time |
| `MatchCelebration.tsx` | `frontend/src/components/` | Animation overlay when both approve the same recipe |
| `IngredientBadge.tsx` | `frontend/src/components/` | Per-ingredient indicator: green (in pantry) / orange (need to buy) |

### Files to Modify

| File | Change |
|------|--------|
| `frontend/src/pages/MainApp.tsx` | Add 6th tab "Pick Together" to bottom nav |
| `frontend/src/hooks/useMealPicker.ts` | **Create** — hook for session management + API calls |
| `worker/src/routes/mealpicker.ts` | **Create** — new route handlers |
| `worker/src/lib/ai.ts` | Add `buildMealPickerPrompt()` + `generateMealPickerOptions()` |
| `worker/src/index.ts` | Mount `/api/meal-picker` route |
| `worker/src/durable-objects/HouseholdSync.ts` | Add WebSocket message handling for votes and matches |

### Backend Endpoints

#### `POST /api/meal-picker/generate`

Input:
```json
{
  "pantryItems": [{ "name": "chicken", "quantity": "2 lbs" }],
  "sessionId": "optional-existing-session-id"
}
```

Logic:
1. Fetch both partners' profiles from D1 (diet, allergies, body stats, goals)
2. Build enhanced AI prompt requesting 3-5 recipes
3. Each recipe includes: name, description, time, calories, macros, ingredients with pantry-match flags, diet compatibility tags, steps
4. Store session in D1
5. Broadcast recipes to both partners via WebSocket

#### `POST /api/meal-picker/vote`

Input:
```json
{
  "sessionId": "abc-123",
  "recipeIndex": 0,
  "vote": "approve"
}
```

Logic:
1. Record vote in D1
2. Check if other partner also approved this recipe
3. If match: broadcast `MEAL_MATCH` to both partners
4. If no match yet: broadcast `MEAL_VOTE` so partner sees the vote in real-time

### D1 Schema Addition

```sql
CREATE TABLE meal_picker_sessions (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  recipes_json TEXT NOT NULL,
  partner1_votes TEXT,
  partner2_votes TEXT,
  matched_recipe_index INTEGER,
  status TEXT DEFAULT 'active',
  created_at INTEGER NOT NULL
);
```

### WebSocket Messages

| Message | Direction | Payload | Purpose |
|---------|-----------|---------|---------|
| `MEAL_PICKER_START` | Server → Both | `{ sessionId, recipes[] }` | Broadcasts new session with recipe cards |
| `MEAL_VOTE` | Server → Both | `{ sessionId, recipeIndex, vote, partnerName }` | Relays one partner's vote to the other |
| `MEAL_MATCH` | Server → Both | `{ sessionId, recipeIndex, recipe }` | Notifies both of mutual approval |
| `MEAL_PICKER_NEW_BATCH` | Server → Both | `{ sessionId, recipes[] }` | New batch after no-match |

### AI Prompt Design

```
You are a meal planning assistant for couples.

Given these ingredients in our pantry: [pantry list]

Partner dietary profiles:
- [Partner A name]: [diet], allergic to [allergies], target [X] cal/day
- [Partner B name]: [diet], allergic to [allergies], target [Y] cal/day

Generate 3-5 dinner recipes that:
- Satisfy BOTH partners' dietary restrictions simultaneously
  (if one is vegetarian, ALL recipes must be vegetarian)
- Use ingredients from the pantry where possible
- Vary in cuisine/style (no more than 2 recipes from same cuisine)
- Each takes 30 minutes or less

For each recipe provide:
{
  "name": "Recipe Name",
  "description": "Brief description",
  "timeEstimate": 25,
  "caloriesPerServing": 420,
  "protein": 35,
  "carbs": 42,
  "fat": 18,
  "cuisine": "Italian",
  "dietTags": ["Vegetarian", "Gluten-Free"],
  "ingredients": [
    { "name": "Ingredient", "quantity": "amount", "inPantry": true }
  ],
  "steps": ["Step 1", "Step 2"],
  "portionNote": "Optional note about portion differences between partners"
}

Output ONLY valid JSON array.
```

---

## 4. How It Connects to Existing Features

```
Partner Profiles + Body Stats
        │
        ▼
    PANTRY ITEMS ──► AI Engine ──► 3-5 Recipe Cards
                                      │
                                      ▼
                              Both Partners Vote
                              (Real-time via WebSocket)
                                      │
                                 Match?
                                /      \
                              YES       NO
                              /          \
                    Missing items →   Generate new batch
                    Shopping List        (loop back)
                              │
                    Add to Meal Calendar
```

**Inputs:** Pantry (Feature 2), Profiles (Feature 3), Body Stats (Feature 4)
**Outputs:** Shopping List (Feature 1), Meal Calendar (Feature 6)
**Infrastructure:** Real-time Sync (Feature 9), AI Engine (Feature 5)

---

## 5. Implementation Checklist (For When Ready)

- [ ] Create `MealPickerTab.tsx` with all 5 states
- [ ] Create `RecipeCard.tsx` component
- [ ] Create `VoteStatusBar.tsx` component
- [ ] Create `MatchCelebration.tsx` animation
- [ ] Create `useMealPicker.ts` hook
- [ ] Update `MainApp.tsx` with 6th tab
- [ ] Add `buildMealPickerPrompt()` to `ai.ts`
- [ ] Add `generateMealPickerOptions()` to `ai.ts`
- [ ] Create `worker/src/routes/mealpicker.ts`
- [ ] Mount route in `worker/src/index.ts`
- [ ] Add D1 migration for `meal_picker_sessions`
- [ ] Add WebSocket messages to `HouseholdSync.ts`
- [ ] Test: both partners see same cards simultaneously
- [ ] Test: votes sync in real-time
- [ ] Test: match detection fires correctly
- [ ] Test: no-match triggers new batch generation
- [ ] Test: missing ingredients flow to shopping list
- [ ] Test: offline queuing for votes

---

## 6. Dependencies

This feature depends on:
- **Feature 1** (Shared Grocery List) — for adding missing ingredients
- **Feature 2** (Pantry Tracking) — as the primary input for recipe generation
- **Feature 3** (Partner Profiles) — for diet/allergy constraints
- **Feature 5** (AI Meal Generation) — shared AI engine and Anthropic integration
- **Feature 9** (Real-time Sync) — for live vote syncing

This feature is independent of:
- Feature 4 (Body Profiles) — works without it, but adaptive portions enhance it
- Feature 6 (Weekly Calendar) — optional integration (save matched meal to calendar)
- Feature 7 (Adaptive Cooking) — optional enhancement (show split plates after match)

---

*Document created: May 26, 2026*
*Last reviewed: May 26, 2026*
*Status: Parked — revisit after Step 5 (AI Meal Generation) is shipped and validated*
