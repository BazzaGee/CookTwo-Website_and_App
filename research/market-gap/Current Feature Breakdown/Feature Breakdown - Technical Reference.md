# Couples Food System — Feature Breakdown

**Version:** 1.0  
**Date:** May 27, 2026  
**Status:** Canonical reference document

---

## OVERVIEW

The Couples Food System is not a collection of features — it is a **self-reinforcing loop**. Each tab feeds into the next. The more you use it, the smarter it gets.

The app has **5 tabs** in the bottom navigation:

```
Shopping | Pantry | Meal Plan | Profiles | Settings
```

---

## TAB 1: SHOPPING — "Our Shopping List"

### What It Does
A real-time shared grocery list that both partners see and edit simultaneously. Changes appear in under 100 milliseconds. No polling, no "pull to refresh."

### How It Works
- **Add items** manually via text input, or tap quick-add chips (Milk, Eggs, Bread, Chicken, etc.)
- Items **auto-categorize** into sections: Produce, Meat, Dairy, Pantry, Other
- **Check off items** — they move to a "Checked" section at the bottom
- **Partner badges** show who added each item (color-coded: Partner A = sage green, Partner B = terracotta)
- On checked items, you get two options:
  - **Delete** — remove from the list entirely
  - **"Move to Pantry"** — this is the critical bridge. When you check off milk at the store, one tap moves it into your shared pantry inventory. This connects shopping → cooking seamlessly.
- **Offline queue**: If you lose signal in the supermarket, actions queue locally and sync when you reconnect

### What Competitors Lack
- **AnyList** has shared lists but charges $30/year for real-time sync. This is free.
- **No competitor** has "Move to Pantry" — the bridge between shopping and cooking. Other apps treat shopping and cooking as separate products. This app treats them as one continuous loop.

---

## TAB 2: PANTRY — "Our Kitchen"

### What It Does
Track what you actually have at home right now. This is the input for AI meal generation.

### How It Works
- **Natural language input**: Type `"chicken, 2 cups rice, spinach"` → the app parses this into 3 separate items automatically
- Items are **category-grouped** (same categories as Shopping)
- **Real-time sync** — both partners see the same pantry, changes appear instantly
- **Delete items** as you use them
- Items from the Shopping tab **auto-move** to the Pantry when you tap "Move to Pantry" on checked-off items

### What Competitors Lack
- **No mainstream competitor has a pantry tab at all.** This is the input for AI meal generation. Without knowing what you have, meal suggestions are useless.
- Natural language input beats barcode scanning (which competitors push) — it is faster, less friction, works for any item including produce and bulk items.

---

## TAB 3: MEAL PLAN — "What Should We Cook?"

### What It Does
AI generates dinner suggestions based on your pantry contents + both partners' dietary preferences. This is the "magic moment" where the app goes from useful tool to "wow."

### How It Works
- Tap **"Generate a Meal"** → the AI looks at:
  - What is in your pantry (from Tab 2)
  - Both partners' dietary preferences (from Tab 4)
  - Any allergies or restrictions
- Outputs a **recipe card** showing:
  - Recipe name and description
  - Cook time
  - Calories per serving
  - Macros (protein, carbs, fat)
  - Full ingredient list with markers:
    - ✅ = already in pantry
    - 🔴 = need to buy
- **"Add Missing to Shopping List"** — one tap populates your Shopping tab with everything you need
- Toggle to **"Week" mode** for weekly planning (generates 7 days of meals)
- **"Populate List"** button aggregates all missing ingredients for the entire week, deduplicated

### What Competitors Lack
- **AnyList** has recipe saving but no AI generation from pantry
- **Mealime** has meal plans but does not know your pantry or your partner's diet
- **Yummo** has adaptive portions but no pantry-first AI — it works recipe → grocery list, not pantry → meals
- **Fitia** has nutrition intelligence but no pantry awareness
- **Leanlife** has real-time sync but no AI at all

---

## TAB 4: PROFILES — "Who Are You Cooking For?"

### What It Does
Set up both partners' dietary preferences, allergies, and body goals. No competitor has dual-profile awareness.

### How It Works
- **Dietary preference**: Omnivore, Vegetarian, Vegan, Pescatarian, Keto, Paleo, Gluten Free, "No Specific Diet," or Custom (free-text)
- **Allergies**: Multi-select common allergies + custom add
- **Partner visibility**: You can see your partner's profile so you always cook for both people
- **Body Profile** (collapsible section):
  - Weight, height, age, gender, activity level, goal (lose/maintain/gain)
  - Auto-calculates **TDEE** (Total Daily Energy Expenditure) using the Mifflin-St Jeor equation
  - Shows **target calories** based on goal
  - Example: Partner A = 1,696 cal/day (cutting), Partner B = 3,357 cal/day (bulking)

### What Competitors Lack
- **No competitor has dual-profile awareness.** Most apps assume one user. This app is built from the ground up for two people.
- The body profile + TDEE calculation powers the **adaptive cooking feature** (the moat). Without knowing each person's calorie targets, you cannot do "one meal, two plates."

---

## TAB 5: SETTINGS

Reserved for future features (notifications, account management, export data). Not a focus for the current build.

---

## THE PRODUCT LOOP

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  PANTRY  │────▶│ AI MEALS │────▶│ SHOPPING │────▶│  PANTRY  │
│ What you │     │ What to  │     │ What to  │     │ What you │
│ have     │     │ cook     │     │ buy      │     │ brought  │
│ at home  │     │ tonight  │     │ at store │     │ home     │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     ▲                  │                  │                  │
     │                  ▼                  ▼                  │
     │            ┌─────────────┐    ┌─────────────┐          │
     │            │ ADD MISSING │    │ CHECK OFF + │          │
     │            │ TO LIST     │    │ MOVE TO     │          │
     │            └─────────────┘    │ PANTRY      │          │
     │                              └─────────────┘          │
     └───────────────────────────────────────────────────────┘
```

**This loop is the product.** Each step reinforces the next. The more you use it, the smarter it gets.

**No competitor connects all four steps:**
- AnyList owns the shopping list but stops there
- Mealime generates meals but ignores your pantry
- Yummo adapts portions but has no pantry-first AI
- This app connects Pantry → AI Meals → Shopping → Pantry into one continuous, self-reinforcing cycle

---

## THE MOAT: ADAPTIVE SHARED COOKING

This is the feature that **no competitor has**. It is not built yet but is fully designed.

### The Problem
- Partner A wants to lose weight (low carb, calorie deficit)
- Partner B wants to build muscle (high protein, calorie surplus)
- They want to cook ONE meal together, not two separate meals
- They want to eat TOGETHER, not at separate tables

### The Solution
The AI generates **ONE shared prep/cooking workflow** but provides **TWO distinct plating instructions**.

**Example:**
- Input: "We have chicken, rice, spinach. 20 minutes."
- Constraints: Partner A = cutting (1,696 cal/day), Partner B = bulking (3,357 cal/day)
- Output:
  - **One stir-fry recipe** (shared cooking)
  - **Partner A's plate**: 4oz chicken over bed of spinach, ½ cup rice ≈ 509 cal
  - **Partner B's plate**: 6oz chicken over full cup of rice, side of edamame ≈ 1,007 cal
  - Same pan. Same recipe. Different plates. No arguments.

### Competitive Comparison

| Competitor | Adaptive Portions | Real-Time Sync | Pantry-First AI | Relationship UX |
|-----------|:-----------------:|:--------------:|:---------------:|:---------------:|
| **Yummo** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Fitia** | ⚠️ Partial | ⚠️ Synced, not live | ❌ No | ❌ No |
| **PlateMates** | ⚠️ Split-diet only | ❌ No | ❌ No | ❌ No |
| **Leanlife** | ❌ No | ✅ Yes | ❌ No | ⚠️ Partial |
| **AnyList** | ❌ No | ✅ Yes | ❌ No | ❌ No |
| **This App** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |

**Yummo** is the closest — they have the "one cook, two plates" concept. But they have zero real-time collaboration, zero pantry-first AI, and zero relationship-first UX. They are a solo-founder web app with no marketing.

**Fitia** has the nutrition intelligence and user base (10M+), but their UX is clinical/fitness-focused. They feel like a spreadsheet, not a shared kitchen.

**This app** is the only one that combines all four pillars into one system.

---

## WHAT MAKES THIS DIFFERENT

| Dimension | Other Apps | This App |
|-----------|-----------|----------|
| **Who it is for** | Individuals (sharing is bolted on) | Couples (built for two from day one) |
| **Language** | "You," "Your macros," "Track your calories" | "We," "Our kitchen," "What are we eating?" |
| **Meal flow** | Browse recipes → make grocery list → cook | Tell app what you have → AI suggests dinner → buy what is missing → cook |
| **Different goals** | Cook separate meals or compromise | One meal, two plates, both hit their targets |
| **Sync** | Polling or Firebase (delayed) | WebSocket (sub-100ms, feels instant) |
| **Distribution** | App Store download required | Share a link → works instantly (PWA) |
| **Setup friction** | Barcode scanning, manual entry | Natural language: "chicken, rice, spinach" |
| **The feeling** | Clinical, fitness-focused, analytical | Warm, collaborative, relationship-first |

**The food is just the medium.** What people are actually buying is less stress, fewer decisions, smoother evenings, and shared responsibility. No competitor sells this emotional outcome — they sell features. This app sells harmony.

---

## THE 7-STEP BUILD ORDER

The app is being built sequentially, where each step works as a standalone product:

| Step | Feature | Duration | Status |
|------|---------|----------|--------|
| **1** | Shared Grocery List | 2 weeks | ✅ Built |
| **2** | PWA Install + Mobile Polish | 1 week | ⚠️ Partial |
| **3** | Partner Profiles + D1 Database | 1 week | ⚠️ Skeleton |
| **4** | Pantry Tracking | 1 week | ⚠️ UI Built |
| **5** | AI Meal Generation | 2 weeks | ❌ Not Built |
| **6** | Meal Calendar + Smart Grocery | 2 weeks | ❌ Not Built |
| **7** | Adaptive Shared Cooking | 3 weeks | ❌ Not Built |

**Total: ~3 months to full MVP**

**Step 1 is shippable right now.** A shared grocery list that syncs in under 100ms. That alone is more than what AnyList offers for free.

---

## FEATURE 8: COUPLE'S MEAL PICKER (ON HOLD)

Fully designed but intentionally parked. It is a collaborative recipe voting experience:

- Both partners see 3-5 AI-generated recipe cards
- Each votes independently: "Let's do it" or "Not tonight"
- First mutual approval becomes "our meal"
- Real-time vote sync via WebSocket
- Diet-constraint-aware (every suggestion works for both partners)
- Pantry ingredient matching visible on each card

This would be a 6th tab: "Pick Together." It adds a social/gamified layer on top of the AI meal generation.

**Closest competitor:** Cloche ("Swipe. Match. Cook.") — pre-launch, 500+ waitlist. This app does it better because AI generates from your actual pantry (not browsing a database), every suggestion works for both partners, and real-time vote sync (not async).

---

## KEY TAKEAWAY

The power of this app is not in any single feature. It is in how the features **interlock** to create a self-reinforcing system:

1. **Shopping** feeds **Pantry** (Move to Pantry bridge)
2. **Pantry** feeds **AI Meals** (ingredient input)
3. **AI Meals** feeds **Shopping** (missing ingredients)
4. **Profiles** feeds **AI Meals** (dietary constraints)
5. **AI Meals** feeds **Adaptive Cooking** (plating instructions)

No competitor has this complete loop. They have isolated features. This app has a **system**.

---

*Document created: May 27, 2026*  
*Source: Product walkthrough, competitor analysis, and feature specifications from the Couples Food System project.*
