# Cupla V2 — Product Loop

**Date:** May 2026
**Status:** Design Document — Updated Self-Reinforcing Cycle for V2

---

## The Loop

The power of Cupla is not in any single feature. It's in how the features **interlock** to create a self-reinforcing system.

```
                    ┌──────────────────┐
                    │     PANTRY       │
                    │  "What we have"  │
                    │                  │
                    │  Natural language│
                    │  input: "chicken,│
                    │  rice, spinach"  │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │                             │
              ▼                             ▼
     ┌─────────────────┐         ┌─────────────────┐
     │    COOK NOW     │         │   I WANT THIS   │
     │    (Mode A)     │         │    (Mode B)     │
     │                 │         │                 │
     │ AI generates    │         │ Browse visual   │
     │ meals you can   │         │ grid of meals   │
     │ make RIGHT NOW  │         │ with filters    │
     │                 │         │                 │
     │ Zero shopping   │         │ See what you    │
     │ Go straight to  │         │ have vs. need   │
     │ adaptive cooking│         │ Add missing to  │
     │                 │         │ shopping list   │
     └────────┬────────┘         └────────┬────────┘
              │                           │
              │                           ▼
              │                  ┌─────────────────┐
              │                  │    SHOPPING     │
              │                  │  "What we need" │
              │                  │                 │
              │                  │ Real-time sync  │
              │                  │ Check off items │
              │                  │ Move to Pantry  │
              │                  └────────┬────────┘
              │                           │
              └──────────────┬────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ ADAPTIVE COOKING │
                    │ "One meal,       │
                    │  two plates"     │
                    │                  │
                    │ Step-by-step     │
                    │ Dual plating     │
                    │ Per-person macros│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     PANTRY       │
                    │  Items used are  │
                    │  removed. New    │
                    │  items are added │
                    │  from shopping.  │
                    │                  │
                    │  The cycle       │
                    │  repeats.        │
                    └──────────────────┘
```

---

## How Each Step Feeds the Next

| Step | Feeds Into | How |
|------|-----------|-----|
| **Pantry** | Both Modes | AI reads pantry contents to generate meal suggestions |
| **Cook Now** | Adaptive Cooking | Tap a meal → straight to dual plating (no shopping) |
| **I Want This** | Shopping | "Add Missing to Shopping List" → one tap |
| **I Want This** | Adaptive Cooking | "Cook This" → dual plating (after shopping or if you have everything) |
| **Shopping** | Pantry | "Move to Pantry" on checked items → pantry updates |
| **Adaptive Cooking** | Pantry | Ingredients used can be removed from pantry (optional) |
| **Profiles** | Both Modes | Dietary preferences and goals filter and adapt all meal suggestions |

---

## The Two Entry Points

### Entry Point A: "Cook Now"
```
Pantry → Cook Now → Adaptive Cooking → Pantry (repeat)
```
- Shortest path to dinner
- Zero shopping required
- Best for: quick weeknight meals, using what's about to expire

### Entry Point B: "I Want This"
```
Pantry → I Want This → Shopping → Pantry → Cook Now → Adaptive Cooking → Pantry (repeat)
```
- Full loop experience
- Includes shopping step
- Best for: craving something specific, planning ahead, willing to shop

---

## Why the Loop Is the Moat

Once a couple is in the cycle, leaving means losing:
- Their pantry inventory (their entire kitchen database)
- Their meal history (what they've cooked and liked)
- Their shopping habits (what they buy regularly)
- Their adaptive cooking setup (personalized portion algorithms)
- Their shared profiles (body stats, dietary preferences, goals)

**No competitor connects all four steps.** They have isolated features. Cupla has a system.

| Competitor | What They Own | Where They Stop |
|-----------|--------------|-----------------|
| AnyList | Shopping list | Stops at the list |
| Mealime | Meal generation | Ignores your pantry |
| Yummo | Adaptive portions | No pantry-first AI |
| Fitia | Nutrition intelligence | No pantry, no real-time loop |
| **Cupla** | **All four steps** | **Never stops** |

---

## The Loop Compounds Over Time

| Usage | What Gets Smarter |
|-------|------------------|
| Week 1 | Pantry has basic items. AI suggests simple meals. |
| Week 4 | Pantry reflects real shopping habits. AI suggestions improve. |
| Month 3 | Meal history shows preferences. AI prioritises what you like. |
| Month 6 | Both profiles are accurate. Adaptive plating is precise. |
| Month 12 | The app knows your kitchen better than you do. |

**The more you use it, the harder it is to leave.** That's the real moat.
