# Cupla V2 — Product Walkthrough

**Date:** May 2026
**Status:** Design Document — Tab-by-Tab Walkthrough with V2 Dual-Mode Meal Picker

---

## The Core Problem (Unchanged from V1)

Three couples problems every day:

1. **"What's for dinner?"** — The nightly argument. Decision fatigue.
2. **"Did you already buy milk?"** — Double-buying. Wasted food.
3. **"I need 400 calories, you need 700"** — Different goals, same meal.

---

## Tab 1: Shopping — "Our Shopping List"

**What it does:** Real-time shared grocery list with instant WebSocket sync.

**How it works:**
- Add items manually or tap quick-add chips (Milk, Eggs, Bread, Chicken, etc.)
- Items auto-categorize into Produce, Meat, Dairy, Pantry, Other
- Check off items → move to "Checked" section
- Partner badges show who added each item (Alex = sage green, Jordan = terracotta)
- **Delete or "Move to Pantry"** on checked items
- Offline queue: lose signal in the supermarket, actions queue and sync when reconnected

**V2 connection:** Mode B ("I Want This") feeds missing ingredients directly here. When you pick a meal and tap "Add Missing to Shopping List," items appear instantly on both partners' phones.

---

## Tab 2: Pantry — "Our Kitchen"

**What it does:** Track what you actually have at home. This is the input for BOTH meal picker modes.

**How it works:**
- Natural language input: type "chicken, 2 cups rice, spinach" → becomes 3 separate items
- Category grouping (same as Shopping)
- Real-time sync — both partners see the same pantry
- Delete items as you use them
- Items from Shopping auto-move to Pantry when you tap "Move to Pantry"

**V2 connection:** Mode A ("Cook Now") reads the pantry to generate meals you can make RIGHT NOW. Mode B ("I Want This") reads the pantry to check what you have vs. what you need for any recipe.

---

## Tab 3: Meal Plan — "What Should We Cook?"

**What it does:** V2's dual-mode meal picker. Choose how you want to find your next meal.

### The Toggle

At the top of the tab:
```
[● Cook Now]  [  I Want This  ]
```

### Mode A: "Cook Now"

Tap "Generate Meals" → AI looks at:
- What's in your pantry
- Both partners' dietary preferences and goals
- Generates a LIST of meals you can make with ZERO extra shopping

Shows visual cards with:
- Stock photo of the meal
- Meal name and cook time
- "100% — You have everything" badge
- Dietary fit indicator

Tap a meal → goes straight to adaptive cooking. No shopping needed.

### Mode B: "I Want This"

Shows a visual grid of meal cards:
- Stock photos, names, cook times, cuisine types
- Mix of AI-generated meals (from your pantry) and curated recipes (50-100 meal database)
- Filters: cook time, cuisine type, difficulty, dietary fit, "can we make this now?"

Tap a meal → see the pantry check:
- ✅ You have: chicken, rice, spinach
- 🔴 You need: soy sauce, ginger, sesame seeds

Tap "Add Missing to Shopping List" → one tap populates your Shopping tab.
Tap "Cook This" → goes to adaptive cooking.

### The Adaptive Cooking View

Once a meal is chosen (from either mode):
- Step-by-step cooking timeline with progress tracking
- **Dual plating cards:**
  - Alex's Plate: 450 cal — chicken over spinach, ½ cup rice
  - Jordan's Plate: 700 cal — extra chicken, full cup of rice
- Per-person macros (protein, carbs, fat)
- "We Dinner Cleaned!" completion button

---

## Tab 4: Profiles — "Who Are You Cooking For?"

**What it does:** Set up both partners' dietary preferences, allergies, and body goals.

**How it works:**
- **Dietary preference:** Omnivore, Vegetarian, Vegan, Pescatarian, Keto, Paleo, Gluten Free, or Custom
- **Allergies:** Multi-select common allergies + custom add
- **Partner visibility:** See your partner's profile so you always cook for both people
- **Body Profile** (collapsible):
  - Weight, height, age, gender, activity level, goal (lose/maintain/gain)
  - Auto-calculates TDEE using Mifflin-St Jeor equation
  - Shows target calories based on goal
  - Example: Alex = 1,700 cal/day (lose), Jordan = 3,200 cal/day (gain)

**V2 update:** Profiles now handle non-diet users gracefully. If a partner has no specific goal, the app shows equal portions with no adaptation needed. The app never forces dieting.

---

## Tab 5: Settings

Reserved for future features (notifications, account management, export data).

---

## The V2 Product Cycle

```
┌──────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────┐
│  PANTRY  │────▶│ COOK NOW or  │────▶│ SHOPPING │────▶│  PANTRY  │
│ What you │     │ I WANT THIS  │     │ What to  │     │ What you │
│ have     │     │ What to cook │     │ buy      │     │ brought  │
│ at home  │     │ tonight      │     │ at store │     │ home     │
└──────────┘     └──────────────┘     └──────────┘     └──────────┘
     ▲                   │                   │                  │
     │                   ▼                   ▼                  │
     │             ┌─────────────┐    ┌─────────────┐          │
     │             │ ADD MISSING │    │ CHECK OFF + │          │
     │             │ TO LIST     │    │ MOVE TO     │          │
     │             └─────────────┘    │ PANTRY      │          │
     │                                └─────────────┘          │
     └─────────────────────────────────────────────────────────┘
```

**The loop never changes.** Just the entry point — "Cook Now" skips the shopping step entirely.

---

## A Real Tuesday Night

**Without Cupla:**
1. Couple argues about what to cook for 15 minutes
2. They pick something, start cooking, realize they're missing an ingredient
3. One partner runs to the store, texts "did you need anything else?"
4. They both forget something, have to make do, or order takeout

**With Cupla V2:**
1. Alex opens Meal Plan → "Cook Now" → sees 3 meals they can make right now
2. Taps "Chicken Stir-Fry" → adaptive cooking shows dual plating
3. They cook together, follow the steps, plate differently
4. Alex: 450 cal. Jordan: 700 cal. Both happy.
5. **Zero arguments. Zero guesswork. Zero waste.**

---

## The V2 Difference

| | V1 | V2 |
|---|---|---|
| **Meal picker** | One button, one meal, no choice | Two modes: browse or cook now |
| **Diet handling** | Assumes both dieting | Handles diet, non-diet, mixed |
| **Visual experience** | Text-based recipe card | Stock photos, visual grid |
| **Filtering** | None | Full filtering in Mode B |
| **Recipe database** | None | 50-100 curated meals |
| **Flexibility** | "Here's your meal" | "Choose your meal" |
