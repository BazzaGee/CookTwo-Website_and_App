# Couples Food System — Product Walkthrough

## The Core Problem This Solves

Three couples problems that existing apps don't solve together:

1. **"Did you already buy milk?"** — Both partners buy duplicates. AnyList solves this with shared lists, but stops there.
2. **"What's for dinner?"** — Decision fatigue. Staring at the fridge. Meal planners exist but don't know what you *actually have*.
3. **"We want different portions"** — One partner wants to lose weight, the other wants to gain muscle. They cook together but eat differently. *No app solves this.*

---

## Tab-by-Tab Walkthrough

### 1. Shopping Tab — "Our Shopping List"

**What it does:** Real-time shared grocery list with instant WebSocket sync.

**How it works:**
- Add items manually or tap quick-add chips (Milk, Eggs, Bread, etc.)
- Items auto-categorize into Produce, Meat, Dairy, Pantry, Other
- Check off items — they move to a "Checked" section
- Partner badges show who added each item
- **Delete or "Move to Pantry"** on checked items

**What competitors lack:**
- **AnyList** has shared lists but charges for real-time sync
- **No competitor** has "Move to Pantry" — when you check off milk at the store, one tap moves it to your pantry inventory. This bridges shopping → cooking seamlessly.

---

### 2. Pantry Tab — "Our Kitchen"

**What it does:** Track what you actually have at home.

**How it works:**
- Natural language input: type `"chicken, 2 cups rice, spinach"` → becomes 3 separate items
- Category grouping (same as shopping)
- Real-time sync — both partners see the same pantry
- Delete items as you use them

**What competitors lack:**
- **No mainstream app** has a pantry tab at all. This is the input for AI meal generation. Without knowing what you have, meal suggestions are useless.
- Natural language input beats barcode scanning (which competitors push) — it's faster and less friction.

---

### 3. Meal Plan Tab — "What Should We Cook?"

**What it does:** AI generates dinner suggestions based on your pantry + both partners' dietary preferences.

**How it works:**
- Tap **"Generate a Meal"** → AI looks at pantry items + profiles → suggests a recipe
- Recipe card shows: name, description, time, calories, macros (protein/carbs/fat)
- Ingredients marked ✅ (in pantry) or 🔴 (need to buy)
- **"Add Missing to Shopping List"** — one tap populates your grocery list
- Toggle to **"Week"** mode for weekly planning
- **"Populate List"** button aggregates all missing ingredients for the week

**What competitors lack:**
- **AnyList** has recipe saving but no AI generation from pantry
- **Mealime** has meal plans but doesn't know your pantry or partner's diet
- **This is the magic moment** — the app looks at what you have and says "here's dinner"

---

### 4. Profiles Tab — "Who Are You Cooking For?"

**What it does:** Set up both partners' dietary preferences, allergies, and body goals.

**How it works:**
- **Dietary preference:** Omnivore, Vegetarian, Vegan, Pescatarian, Keto, Paleo, Gluten Free
- **Allergies:** Multi-select common allergies + custom add
- **Partner visibility:** See your partner's profile so you always cook for both
- **Body Profile (collapsible):** Weight, height, age, gender, activity level, goal
  - Auto-calculates **TDEE** (Total Daily Energy Expenditure) using Mifflin-St Jeor
  - Shows **target calories** based on goal (lose/maintain/gain)

**What competitors lack:**
- **No competitor** has dual-profile awareness. Most apps assume one user.
- **Body profile + TDEE calculation** is unique — this powers the adaptive cooking feature.

---

### 5. Settings Tab

Reserved for future features (notifications, account management, export data).

---

## The Unique Differentiators

### 🔥 "One Prep, Two Plates" (Adaptive Cooking)

This is the **moat**. No other app does this:

- Both partners enter their body stats → app calculates individual calorie targets
- AI generates a meal with **different plating instructions** for each person
- Example: Same chicken stir-fry, but Partner A gets 4oz chicken + ½ cup rice (450 cal), Partner B gets 6oz chicken + 1 cup rice (700 cal)
- **They cook together, eat together, hit different goals**

Competitors:
- **Yummo** has this concept but no real-time sync between partners
- **Leanlife** has sync but no adaptive cooking
- **You now have both**

---

### ⚡ Real-Time WebSocket Sync

- Changes appear in under 100ms between partners
- Powered by Cloudflare Durable Objects (one instance per couple)
- Works across devices, browsers, networks
- **Offline queue** — if you lose signal in the supermarket, actions queue and sync when you reconnect

---

### 📱 PWA — No App Store

- Share a URL → partner taps → works instantly
- Installs to home screen, runs fullscreen
- No $99/year Apple fee, no review process, no download friction
- **This is critical for couple adoption** — the second partner must onboard in seconds

---

### 🧠 Pantry → Meal → Shopping Loop

The full cycle:
1. **Pantry** tracks what you have
2. **AI** suggests meals from pantry
3. **Missing ingredients** go to shopping list
4. **Check off** items at the store
5. **Move to pantry** when you get home
6. **Repeat**

No competitor connects all four. They're siloed across different apps.

---

## Competitor Comparison

| Feature | AnyList | Mealime | Yummo | **Couples Food System** |
|---------|---------|---------|-------|------------------------|
| Shared grocery list | ✅ | ❌ | ❌ | ✅ |
| Real-time sync | Paid | ❌ | ❌ | ✅ Free |
| Pantry tracking | ❌ | ❌ | ❌ | ✅ |
| AI meal generation | ❌ | Basic | ❌ | ✅ |
| Dual dietary profiles | ❌ | ❌ | ❌ | ✅ |
| Adaptive portions | ❌ | ❌ | Partial | ✅ |
| TDEE calculation | ❌ | ❌ | ❌ | ✅ |
| PWA (no download) | ❌ | ❌ | ❌ | ✅ |
| Offline support | Basic | ❌ | ❌ | ✅ Queue |

---

## The Full Product Cycle

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  PANTRY  │────▶│ AI MEALS │────▶│ SHOPPING │────▶│  PANTRY  │
│ What you │     │ What to  │     │ What to  │     │ What you │
│ have     │     │ cook     │     │ buy      │     │ brought  │
│ at home  │     │ tonight  │     │ at store │     │ home     │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     ▲                  │                  │                  │
     │                  │                  │                  │
     │                  ▼                  ▼                  │
     │            ┌─────────────┐    ┌─────────────┐          │
     │            │ ADD MISSING │    │ CHECK OFF + │          │
     │            │ TO LIST     │    │ MOVE TO     │          │
     │            └─────────────┘    │ PANTRY      │          │
     │                              └─────────────┘          │
     └───────────────────────────────────────────────────────┘
```

**This loop is the product.** Each step reinforces the next. The more you use it, the smarter it gets.

---

## Why This Matters

- **AnyList** charges $30/year for real-time sync. This is free.
- **Mealime** generates meals but ignores your pantry and partner's diet.
- **Yummo** understands adaptive cooking but has no real-time sync.
- **This app** is the only one that connects all four pillars: shared list, pantry tracking, AI meal generation, and adaptive portions.

**The moat isn't one feature — it's the loop.** Once a couple is in the cycle, leaving means losing their pantry inventory, their meal history, their shopping habits, and their adaptive cooking setup. That's real retention.
