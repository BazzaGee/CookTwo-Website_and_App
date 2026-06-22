# Diet Taxonomy — How the 17 Diets Relate

> This document maps the relationships between all 17 diets, showing how they overlap, contrast, and group into families. Understanding these relationships is critical for both the app's UX (grouping diets logically) and its AI logic (resolving conflicts between partners with different diets).

---

## Diet Families

### 1. Mediterranean / Balanced Family
Diets inspired by traditional eating patterns, emphasizing whole foods, balance, and longevity.

| Diet | Description |
|------|-------------|
| **Mediterranean** | The archetype — olive oil, fish, whole grains, vegetables |
| **DASH** | Mediterranean-influenced, designed to lower blood pressure (lower sodium, higher dairy) |
| **MIND** | Hybrid of Mediterranean + DASH, optimized for brain health |

> **Relationship:** MIND ⊂ (Mediterranean ∪ DASH). All three share a foundation of vegetables, whole grains, fish, olive oil, and nuts. They differ in emphasis — DASH on sodium/blood pressure, MIND on berries/leafy greens/cognitive outcomes, Mediterranean on overall cardiometabolic health.

---

### 2. Plant-Based Family
Diets that eliminate or significantly reduce animal products.

| Diet | Animal Products | Description |
|------|----------------|-------------|
| **Vegetarian** (lacto-ovo) | Eggs & dairy allowed | No meat, poultry, or fish |
| **Plant-Based** | Minimal/flexible | Predominantly plants, may include small amounts of animal products |
| **Vegan** | None | No animal products whatsoever |
| **Flexitarian** | Occasional meat | Predominantly vegetarian with flexible meat consumption |
| **McDougall / Starch Solution** | None or minimal | Vegan, but specifically starch-centered (potatoes, rice, corn) |
| **Macrobiotic** | None or occasional fish | Vegan-leaning, based on grains + traditional philosophy (yin/yang) |
| **80/10/10 (HCLF)** | None | Raw vegan, 80% carbs / 10% protein / 10% fat, primarily fruit |
| **Pritikin** | Some fish/lean poultry | Very low fat (<10%), mostly plant-based but not exclusively |

> **Hierarchy of restrictiveness:**
> ```
> Flexitarian → Plant-Based → Vegetarian → Vegan → McDougall → Macrobiotic → 80/10/10 (raw)
>                                                                      (increasing restriction →)
> ```

---

### 3. Low-Carbohydrate / Ketogenic Family
Diets that restrict carbohydrate intake to varying degrees.

| Diet | Carb Intake | Description |
|------|------------|-------------|
| **Keto** | <20–50 g/day | Ketogenic — very low carb, moderate protein, high fat |
| **Low-Carb (general)** | <100–130 g/day | Reduced carb, not necessarily ketogenic |
| **Carnivore** | ~0 g (from plants) | Zero plant foods; exclusively animal products |
| **High-Protein** | Low-moderate | Not inherently low-carb, but often paired with reduced carbs |

> **Relationship:** Carnivore is the most extreme — it is keto-compatible (zero carbs) but further restricts ALL plant foods. Standard keto allows non-starchy vegetables. High-protein is orthogonal — it can be combined with any carb level.

---

### 4. Evolutionary / Ancestral / Whole-Food Family
Diets based on the premise of eating "natural" or pre-modern foods.

| Diet | Core Premise | Key Restriction |
|------|-------------|-----------------|
| **Paleo** | Eat like our Paleolithic ancestors | No grains, legumes, dairy, refined sugar, processed foods |
| **Whole30** | 30-day reset eliminating inflammatory foods | No grains, legumes, dairy, sugar, alcohol, additives — then reintroduce |
| **Carnivore** | Humans evolved as apex predators | No plant foods at all |

> **Relationship:** Paleo and Whole30 overlap heavily (both exclude grains, legumes, dairy, sugar). Whole30 is a time-limited elimination protocol (30 days); Paleo is ongoing. Carnivore is a subset of Paleo (only the animal-food portion). Whole30 is more strict about additives/processed foods than Paleo.

---

### 5. Therapeutic / Clinical Diets
Diets designed to treat or manage specific medical conditions.

| Diet | Primary Indication | Evidence Grade |
|------|-------------------|----------------|
| **DASH** | Hypertension | A |
| **Low FODMAP** | Irritable Bowel Syndrome (IBS) | B |
| **MIND** | Cognitive decline / Alzheimer's prevention | B |
| **Pritikin** | Cardiovascular disease | B |
| **Keto** | Drug-resistant epilepsy (pediatric) | A; metabolic/weight: B |

> **Note:** Low FODMAP is unique — it is an **elimination and reintroduction protocol**, not a permanent diet. The app should model this as a multi-phase process.

---

### 6. Timing-Based Patterns
| Diet | Mechanism |
|------|-----------|
| **Intermittent Fasting** | Restricts *when* you eat, not *what* you eat |

> **Critical distinction:** Intermittent fasting is orthogonal to all food-based diets. A person can be keto + intermittent fasting, vegan + intermittent fasting, Mediterranean + intermittent fasting, etc. The app should model this as a **separate dimension** from food-choice diets. See `03_App_Integration_Plan.md`.

---

### 7. Weight-Loss-Optimized Diets
| Diet | Strategy |
|------|----------|
| **Volumetrics** | Maximize food volume per calorie (low energy density) |
| **High-Protein** | Maximize satiety through protein; preserve lean mass during deficit |
| **Flexitarian** | Reduce calories by cutting meat; flexible adherence |

---

## Cross-Cutting Comparison: Key Dimensions

### Macronutrient Spectrum
```
← HIGHER CARB ───────────────────────────────────── HIGHER FAT →

80/10/10  McDougall  Macrobiotic  Mediterranean  DASH  MIND  Keto  Carnivore
 80% C     ~70% C      ~60% C        ~50% C      55% C  53% C  5-10% C  ~0% C
 10% F     ~15% F      ~25% F        ~35% F      27% F  30% F  70-80% F ~80% F
```

### Restrictiveness Spectrum
```
← LEAST RESTRICTIVE ───────────────────────────── MOST RESTRICTIVE →

Flexitarian → Mediterranean → DASH/MIND → Vegetarian → Vegan → Paleo →
Whole30 → Low FODMAP → Keto → McDougall → Macrobiotic → 80/10/10 → Carnivore
```

### Evidence Strength Spectrum
```
← STRONGEST EVIDENCE ───────────────────────────── WEAKEST EVIDENCE →

DASH/Mediterranean (A) → MIND/Vegan/Plant-Based (B) → Keto/High-Protein/FODMAP (B) →
Pritikin/Volumetrics/Flexitarian (B-C) → Paleo (C) → Whole30 (C-D) →
McDougall/Macrobiotic (C-D) → 80/10/10 (D) → Carnivore (D)
```

---

## Compatibility Matrix (For Couples)

This is the most practically important taxonomy for Cupla — **when two partners have different diets, what can they both eat?**

| Partner 1 ↓ \ Partner 2 → | Med | DASH | Vegan | Keto | Paleo | Low FODMAP |
|---------------------------|-----|------|-------|------|-------|------------|
| **Mediterranean** | ✓ | ✓ | Meals w/o animal products | Salads, fish, olive oil | Meat + veg + nuts | Med meals adapted (low onion/garlic) |
| **DASH** | ✓ | ✓ | Plant-based meals | Low-sodium protein + veg | Lean meat + veg | DASH meals adapted |
| **Vegan** | Plant meals | Plant meals | ✓ | Tofu + oils + low-carb veg | Nuts, seeds, veg only | Vegan low-FODMAP |
| **Keto** | Fish/veg/oil | Protein + veg | Tofu + oils + veg | ✓ | Meat + non-starchy veg | Meat + low-FODMAP veg + oil |
| **Paleo** | Meat + veg | Meat + veg | Nuts/seeds/veg | Meat + non-starchy veg | ✓ | Meat + low-FODMAP veg |
| **Low FODMAP** | Adapted meals | Adapted meals | Vegan low-FODMAP | Meat + low-FODMAP veg | Meat + low-FODMAP veg | ✓ |

> A **full compatibility matrix** across all 17 diets is in `02_Comparison_Matrix.md`. The app's AI should use these compatibility rules when generating meals for couples with different diets.

---

## Orthogonal Dimensions (Stackable)

Some dietary dimensions can stack on top of any base diet:

| Dimension | Options | Notes |
|-----------|---------|-------|
| **Timing** | Intermittent fasting (16:8, 5:2, etc.) | Stacks with any food diet |
| **Calorie target** | Deficit / maintenance / surplus | Determined by TDEE + goal |
| **Allergens** | Gluten-free, dairy-free, nut-free, etc. | Separate system (already exists in Cupla) |
| **Macro emphasis** | High-protein overlay | Can modify any base diet |
