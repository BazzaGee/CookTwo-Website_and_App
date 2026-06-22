# Cupla V2 — Overview

**Date:** May 2026
**Status:** Design Document — Version 2 Meal Picker System
**Supersedes:** V1 single-mode meal picker (Cupla_Market_Analysis.md, Market_Analysis_2.md)

---

## Why V2 Exists

### The V1 Problem

The V1 meal picker had two fundamental limitations:

**1. Too Prescriptive**
The AI looked at your pantry and gave you ONE meal. You couldn't browse, couldn't choose, couldn't say "that doesn't sound good tonight." The app told you what to eat instead of helping you decide.

**2. Too Diet-Obsessed**
The V1 meal picker assumed both partners were on strict diets with specific calorie targets. But what if one person just wants a normal meal with no restrictions? What if neither person is dieting? The app had no graceful way to handle "we just want dinner."

### The V2 Vision

A flexible, choice-driven meal picker that handles both scenarios:

- **"I don't want to shop"** — use what we have right now
- **"I'm craving something"** — let me browse and pick, then tell me what to buy

Both modes feed into the same adaptive cooking layer. Both modes work for dieting AND non-dieting users. Both modes connect to the same self-reinforcing loop.

---

## The Two Modes

### Mode A — "Cook Now"

**Philosophy:** "What can we make RIGHT NOW with what we have?"

- AI looks at your pantry → generates meals you can cook with ZERO extra shopping
- Prioritised by: pantry match %, cook time, both partners' preferences
- Each meal card shows: name, stock photo, cook time, "Can make now" badge
- Tap a meal → goes straight to adaptive cooking (dual plating instructions)
- No shopping list needed — that's the whole point

**Best for:** Quick weeknight dinners, avoiding the store, using what's about to expire.

### Mode B — "I Want This"

**Philosophy:** "I want to make this — tell me what I need."

- Visual grid of meal cards (AI-generated from your pantry + curated recipe database of 50-100 meals)
- Stock photos, names, cook times, cuisine types
- Filters: cook time, cuisine type, difficulty, dietary fit, "can we make this now?"
- Tap a meal → app checks your pantry → shows what you have vs. what you need
- "Add Missing to Shopping List" → one tap
- Goes to adaptive cooking once you're ready

**Best for:** When you're craving something specific, willing to shop, planning ahead.

---

## The Toggle

A simple toggle at the top of the Meal Plan tab:

```
┌─────────────────────────────────────────┐
│  [Cook Now]  |  [I Want This]           │
└─────────────────────────────────────────┘
```

- Default: "Cook Now" (pantry-first is the app's core identity)
- Toggle is instant — no loading, no page change
- Both modes share the same adaptive cooking layer underneath

---

## Adaptive Cooking Layer (Same for Both Modes)

Once a meal is chosen — from either mode — the adaptive cooking layer kicks in:

- AI generates dual plating instructions based on both partners' profiles
- If both have diets → adapted portions for both
- If one has a diet → adapted portions for that person only
- If neither has a diet → equal portions, no adaptation needed
- Step-by-step cooking workflow for both partners
- Visual plating cards with per-person macros

**This is the moat.** No competitor offers this.

---

## The Loop (Updated for V2)

```
                    ┌──────────────┐
                    │   PANTRY     │
                    │ What you have│
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │                         │
              ▼                         ▼
     ┌──────────────┐         ┌──────────────┐
     │  COOK NOW    │         │  I WANT THIS │
     │  (Mode A)    │         │  (Mode B)    │
     │              │         │              │
     │ Zero shopping│         │ Browse & pick│
     │ Go straight  │         │ See what's   │
     │ to cooking   │         │ missing      │
     └──────┬───────┘         └──────┬───────┘
            │                        │
            │                        ▼
            │               ┌──────────────┐
            │               │  SHOPPING    │
            │               │ Add missing  │
            │               └──────┬───────┘
            │                      │
            └──────────┬───────────┘
                       ▼
              ┌──────────────┐
              │ ADAPTIVE     │
              │ COOKING      │
              │ One meal,    │
              │ two plates   │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │   PANTRY     │
              │ Move to      │
              │ pantry       │
              └──────────────┘
```

**The loop never changes.** Just the entry point.

---

## Confirmed Design Decisions

| Decision | Choice |
|----------|--------|
| Recipe database size | 50-100 meals, AI-generated and curated |
| Meal card visuals | Stock photos |
| Mode toggle | Simple toggle at top of Meal Plan tab |
| Mode B filters | All: cook time, cuisine type, difficulty, dietary fit, "can we make this now?" |
| Cook Now = zero shopping | Yes — strictly zero shopping needed |
| Adaptive cooking | Same for both modes |
| Non-diet users | Handled gracefully — equal portions, no adaptation needed |

---

## What Changes from V1

| V1 | V2 |
|----|----|
| Single "Generate a Meal" button | Two modes: "Cook Now" + "I Want This" |
| AI gives you ONE meal | AI gives you a LIST of meals to choose from |
| Diet-obsessed (assumes both dieting) | Flexible (handles diet, non-diet, mixed) |
| No visual browsing | Visual grid with stock photos |
| No filtering | Full filtering in Mode B |
| "Pick the Vibe" (swipe one meal) | Browse, pick, see what's missing |

---

## What Stays the Same

| Feature | Status |
|---------|--------|
| Pantry tracking (natural language input) | ✅ Same |
| Real-time shared grocery list | ✅ Same |
| Dual partner profiles with TDEE | ✅ Same |
| Adaptive shared cooking (one meal, two plates) | ✅ Same |
| PWA architecture (no app store) | ✅ Same |
| Sub-100ms WebSocket sync | ✅ Same |
| The self-reinforcing loop | ✅ Same |
| "We" language, relationship-first UX | ✅ Same |
