# Diet Comparison Matrix — All 17 Diets

> Side-by-side reference for all diets in the Cupla research library. Use this for quick lookup when designing the UI, AI prompts, or couple-compatibility logic.

---

## Master Comparison Table

| Diet | Evidence Grade | Carb % | Protein % | Fat % | Sodium | Primary Focus | Restrictiveness (1-5) |
|------|:--------------:|:------:|:---------:|:-----:|:------:|---------------|:---------------------:|
| **Mediterranean** | A | ~45% | ~18% | ~37% | Moderate | Cardiometabolic health, longevity | 2 |
| **DASH** | A | ~55% | ~18% | ~27% | **Low** (<2300mg) | Blood pressure reduction | 2 |
| **Intermittent Fasting** | B | — | — | — | — | Weight loss, metabolic health (timing) | 2 |
| **Keto / Low-Carb** | B (epilepsy: A) | 5-10% | ~20% | 70-80% | Moderate | Ketosis, weight loss, blood sugar | 4 |
| **High-Protein** | B | ~35% | ~30%+ | ~35% | Moderate | Muscle, satiety, weight loss | 2 |
| **Plant-Based / Vegan / Veg** | B | ~55% | ~15% | ~30% | Low | Ethics, health, environment | 3-4 |
| **Flexitarian** | B-C | ~50% | ~18% | ~32% | Moderate | Flexible plant-forward eating | 1 |
| **Paleo** | C | ~25% | ~30% | ~45% | Moderate | Ancestral whole foods | 3 |
| **Whole30** | C-D | ~25% | ~30% | ~45% | Moderate | 30-day elimination reset | 4 |
| **Low FODMAP** | B | ~45% | ~20% | ~35% | Moderate | IBS symptom management | 4 |
| **MIND** | B | ~53% | ~17% | ~30% | Moderate | Brain health, dementia prevention | 2 |
| **Pritikin** | B-C | ~70% | ~18% | **<10%** | Low | Heart disease reversal | 4 |
| **Carnivore** | D | ~0% | ~30% | ~70% | Moderate (from salt) | Zero-carb animal-only | 5 |
| **McDougall / Starch Solution** | C-D | ~70-80% | ~12% | ~10% | Low | Starch-centered weight loss | 4 |
| **Macrobiotic** | C-D | ~60% | ~12% | ~25% | Low | Balance, philosophical | 4 |
| **Volumetrics** | B-C | ~55% | ~20% | ~25% | Moderate | Satiety via low energy density | 2 |
| **80/10/10 (HCLF)** | D | **80%** | 10% | 10% | Low | Raw fruit-based veganism | 5 |

> **Restrictiveness scale:** 1 = very flexible, 5 = extremely restrictive

---

## Foods: Quick-Reference Allow/Exclude

| Food Group | Med | DASH | Vegan | Keto | Paleo | Whole30 | FODMAP | Carnivore | McDougall |
|-----------|:---:|:----:|:-----:|:----:|:-----:|:-------:|:------:|:---------:|:---------:|
| Red meat | Limit | Limit | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Poultry | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Fish/seafood | ✓✓ | ✓✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Eggs | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Dairy | Moderate | ✓✓ | ✗ | ✓ | ✗ | ✗ | Limit | ✓ | ✗ |
| Olive oil | ✓✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Nuts/seeds | ✓✓ | ✓✓ | ✓ | ✓ | ✓ | ✓ | Limit | ✗ | ✗ |
| Whole grains | ✓✓ | ✓✓ | ✓ | ✗ | ✗ | ✗ | Limit | ✗ | ✓✓ |
| Legumes | ✓ | ✓✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Vegetables | ✓✓ | ✓✓ | ✓✓ | ✓ (non-starchy) | ✓ | ✓ | Limit (some) | ✗ | ✓ |
| Fruits | ✓✓ | ✓✓ | ✓✓ | Limit (berries) | ✓ | ✓ | Limit (some) | ✗ | ✓ (not 80/10/10 level) |
| Potatoes/starch | ✓ | ✓✓ | ✓ | ✗ | ✓ (sweet) | ✓ | Limit | ✗ | ✓✓ |
| Sugar/sweets | Limit | Avoid | Limit | Avoid | Avoid | Avoid | Limit | ✗ | Avoid |
| Alcohol | Moderate (wine) | Limit | Varies | Avoid | Avoid | Avoid | Limit | ✗ | Avoid |

> ✓✓ = encouraged/core food, ✓ = allowed, Limit = allowed in small amounts, ✗ = excluded

---

## Couple Compatibility Heat Map

**Green** = easy to accommodate both; **Yellow** = requires adaptation; **Red** = very difficult / almost mutually exclusive.

| | Med | DASH | IF | Keto | Hi-Protein | Vegan | Flex | Paleo | Whole30 | FODMAP | MIND | Pritikin | Carnivore | McDougall | Macro | Vol | HCLF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Med** | 🟢 | 🟢 | 🟢 | 🟡 | 🟢 | 🟡 | 🟢 | 🟡 | 🟡 | 🟡 | 🟢 | 🟡 | 🔴 | 🟡 | 🟡 | 🟢 | 🟡 |
| **DASH** | | 🟢 | 🟢 | 🟡 | 🟢 | 🟡 | 🟢 | 🟡 | 🟡 | 🟡 | 🟢 | 🟢 | 🔴 | 🟡 | 🟡 | 🟢 | 🟡 |
| **IF** | | | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 |
| **Keto** | | | | 🟢 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🔴 | 🟡 | 🔴 | 🔴 | 🟡 | 🔴 |
| **Hi-Protein** | | | | | 🟢 | 🟡 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | 🟢 | 🟡 | 🟡 | 🟢 | 🔴 |
| **Vegan** | | | | | | 🟢 | 🟢 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🔴 | 🟡 | 🟡 | 🟡 | 🟡 |
| **Flex** | | | | | | | 🟢 | 🟡 | 🟡 | 🟡 | 🟢 | 🟡 | 🔴 | 🟡 | 🟡 | 🟢 | 🟡 |
| **Paleo** | | | | | | | | 🟢 | 🟢 | 🟡 | 🟡 | 🟡 | 🟡 | 🔴 | 🔴 | 🟡 | 🔴 |
| **Whole30** | | | | | | | | | 🟢 | 🟡 | 🟡 | 🟡 | 🟡 | 🔴 | 🔴 | 🟡 | 🔴 |
| **FODMAP** | | | | | | | | | | 🟢 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟢 | 🟡 |
| **MIND** | | | | | | | | | | | 🟢 | 🟡 | 🔴 | 🟡 | 🟡 | 🟢 | 🟡 |
| **Pritikin** | | | | | | | | | | | | 🟢 | 🔴 | 🔴 | 🟡 | 🟡 | 🔴 |
| **Carnivore** | | | | | | | | | | | | | 🟢 | 🔴 | 🔴 | 🔴 | 🔴 |
| **McDougall** | | | | | | | | | | | | | | 🟢 | 🟡 | 🟡 | 🟡 |
| **Macro** | | | | | | | | | | | | | | | 🟢 | 🟡 | 🟡 |
| **Vol** | | | | | | | | | | | | | | | | 🟢 | 🟡 |
| **HCLF** | | | | | | | | | | | | | | | | | 🟢 |

> **Key insight for the app:** 🟢 combinations should generate shared meals effortlessly. 🟡 requires the AI to adapt (e.g., cook a base that both can eat, then plate differently). 🔴 combinations (especially **Carnivore + any plant-based diet**) are nearly impossible to reconcile — the app should surface a warning and suggest separate meals.

---

## Health Outcome Comparison

| Diet | Cardiovascular | Weight Loss | Diabetes / Blood Sugar | Cognitive | Cancer Risk | Gut / Digestive | Longevity |
|------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| **Mediterranean** | ★★★ | ★★☆ | ★★★ | ★★☆ | ★★☆ | ★★☆ | ★★★ |
| **DASH** | ★★★ | ★★☆ | ★★☆ | ★☆☆ | ★☆☆ | ★☆☆ | ★★☆ |
| **Intermittent Fasting** | ★★☆ | ★★★ | ★★☆ | ★☆☆ | ★☆☆ | ★☆☆ | ★★☆ |
| **Keto** | ★☆☆ | ★★★ | ★★★ | ★☆☆ | ★☆☆ | ★☆☆ | ★☆☆ |
| **High-Protein** | ★☆☆ | ★★★ | ★★☆ | ★☆☆ | ★☆☆ | ★☆☆ | ★☆☆ |
| **Vegan/Vegetarian** | ★★☆ | ★★☆ | ★★☆ | ★☆☆ | ★★☆ | ★★☆ | ★★☆ |
| **Flexitarian** | ★★☆ | ★★☆ | ★★☆ | ★☆☆ | ★★☆ | ★★☆ | ★★☆ |
| **Paleo** | ★☆☆ | ★★☆ | ★★☆ | ★☆☆ | ★☆☆ | ★★☆ | ★☆☆ |
| **Whole30** | ★☆☆ | ★★☆ | ★★☆ | ★☆☆ | ★☆☆ | ★★☆ | ★☆☆ |
| **Low FODMAP** | — | — | — | — | — | ★★★ | — |
| **MIND** | ★★☆ | ★☆☆ | ★☆☆ | ★★★ | ★☆☆ | ★☆☆ | ★★☆ |
| **Pritikin** | ★★★ | ★★☆ | ★★☆ | ★☆☆ | ★☆☆ | ★☆☆ | ★★☆ |
| **Carnivore** | ? | ★★☆ | ★★☆ | — | — | ★☆☆ | ? |
| **McDougall** | ★★☆ | ★★☆ | ★★☆ | ★☆☆ | ★☆☆ | ★☆☆ | ★☆☆ |
| **Macrobiotic** | ★☆☆ | ★☆☆ | ★☆☆ | ★☆☆ | ★☆☆ | ★☆☆ | ★☆☆ |
| **Volumetrics** | ★★☆ | ★★★ | ★★☆ | ★☆☆ | ★☆☆ | ★★☆ | ★★☆ |
| **80/10/10** | ? | ★★☆ | ★☆☆ | — | — | ★☆☆ | ? |

> ★★★ = strong evidence of benefit, ★★☆ = moderate evidence, ★☆☆ = limited evidence, ? = insufficient data, — = not applicable/not studied

---

## Cost & Accessibility

| Diet | Relative Cost | Accessibility | Difficulty |
|------|:------------:|:-------------:|:----------:|
| Mediterranean | $$$ (olive oil, fish, nuts) | Moderate | Low |
| DASH | $$ | Easy | Low |
| Intermittent Fasting | Free | Very Easy | Medium (habit) |
| Keto | $$$ (meat, specialty products) | Moderate | High |
| High-Protein | $$ | Easy | Low |
| Vegan | $-$$ | Easy | Low-Medium |
| Flexitarian | $$ | Easy | Low |
| Paleo | $$$ | Moderate | Medium |
| Whole30 | $$$ | Moderate | High (30-day strict) |
| Low FODMAP | $$ | Moderate | High (expertise needed) |
| MIND | $$$ | Moderate | Low |
| Pritikin | $-$$ | Easy | High (very low fat) |
| Carnivore | $$$$ | Hard | Very High |
| McDougall | $ | Very Easy | Medium |
| Macrobiotic | $$ | Moderate | High |
| Volumetrics | $$ | Easy | Low-Medium |
| 80/10/10 | $$$ | Hard | Very High |
