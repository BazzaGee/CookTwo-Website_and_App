# Bone Health Diet — App Encoding Spec

> Machine-readable spec for the CookTwo health-condition layer. Used when a partner selects the **Bone Health** condition. Emphasises calcium, vitamin D, protein and vitamin K while limiting sodium, alcohol, caffeine and preformed vitamin A.

---

## Diet Metadata

```yaml
diet_key: "bone-health"
display_label: "Bone Health"
category: "condition"
emoji: "🦴"
short_description: "Osteoporosis-friendly eating — calcium, vitamin D, protein and vitamin K"
evidence_grade: "B"
restrictiveness: 2  # 1-5 scale
is_condition: "true"
sodium_restriction: "moderate"
```

---

## Food Group Rules

### Allowed Food Groups (Core Ingredients)

```yaml
allowed_food_groups:
  - "dairy"
  - "plain-yogurt"
  - "milk"
  - "fortified-plant-milk"
  - "calcium-set-tofu"
  - "sardines-with-bones"
  - "canned-salmon-with-bones"
  - "oily-fish"
  - "fish"
  - "poultry"
  - "eggs"
  - "legumes"
  - "lentils"
  - "chickpeas"
  - "beans"
  - "low-oxalate-greens"
  - "kale"
  - "collard-greens"
  - "bok-choy"
  - "broccoli"
  - "vegetables"
  - "fruit"
  - "prunes"
  - "figs"
  - "whole-grains"
  - "oats"
  - "brown-rice"
  - "quinoa"
  - "barley"
  - "almonds"
  - "sesame"
  - "tahini"
  - "chia-seeds"
  - "flaxseed"
  - "olive-oil"
  - "herbs-spices"
```

### Restricted Food Groups (Always Excluded)

```yaml
restricted_food_groups:
  - "salt"
  - "high-sodium-condiments"
  - "soy-sauce"
  - "bouillon-broth"
  - "pickled-foods"
  - "cured-meat"
  - "processed-meat"
  - "liver"
  - "cod-liver-oil"
  - "high-retinol-supplements"
  - "cola-drinks"
  - "energy-drinks"
  - "alcohol"
  - "excess-caffeine"
```

### Limited Food Groups (Moderation)

```yaml
limited_food_groups:
  - "calcium: 1,000-1,200mg/day from food; split doses across meals"
  - "vitamin-d: 800-1,000 IU/day for adults 50+"
  - "protein: 1.0-1.2g/kg/day, 25-35g per main meal"
  - "coffee: up to 3-4 cups per day (≤400mg caffeine)"
  - "cheese: moderate — sodium and saturated fat"
  - "spinach: high oxalate — not the main calcium source"
  - "calcium-supplements: only to fill a measured gap, medical guidance"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  calcium_mg_day_min: 1000
  calcium_mg_meal_min: 300
  vitamin_d_iu_day_min: 800
  protein_g_meal_min: 25
  sodium_mg_meal_max: 600
  caffeine_mg_day_max: 400
```

---

## AI Prompt Instructions

```
BONE HEALTH DIET RULES — Follow strictly:

1. CALCIUM AT EVERY MEAL:
   - Include a calcium-rich food in each main meal: plain yogurt, milk, fortified plant milk, calcium-set tofu, sardines or canned salmon with bones, kale, collards, bok choy, almonds, tahini or sesame.
   - Aim for roughly 300mg calcium per main meal, supporting 1,000-1,200mg per day.
   - Split calcium across meals; absorption is best in doses of 500mg or less.
2. VITAMIN D:
   - Include oily fish (salmon, sardines, mackerel), eggs and fortified foods. Sunlight is the main source.
   - Do not suggest high-dose vitamin D supplements; target 800-1,000 IU/day for adults 50+.
3. PROTEIN:
   - Include 25-35g protein per main meal from fish, poultry, eggs, dairy, tofu or legumes.
   - Protein supports bone matrix and muscle mass.
4. VITAMIN K AND MAGNESIUM:
   - Include leafy greens (kale, collards, bok choy, broccoli), nuts, seeds, legumes and whole grains.
5. LIMIT SODIUM:
   - No added salt; avoid soy sauce, bouillon, pickles, olives, cured and processed meat.
   - Keep meals to roughly 600mg sodium or less.
6. AVOID:
   - Liver, cod liver oil and high-dose retinol supplements (preformed vitamin A increases fracture risk).
   - Cola and phosphoric-acid soft drinks.
   - Energy drinks and excess caffeine (keep under 400mg/day).
   - Excess alcohol.
7. OXALATES: Spinach, rhubarb, beet greens and Swiss chard are high in oxalates and are poor calcium sources. Prefer kale, collards and bok choy for calcium.
8. PRUNES: 50g/day of prunes has evidence for bone density preservation; include them as a snack where appropriate.
9. This app provides general dietary guidance, not medical advice. Osteoporosis treatment, fracture prevention and supplement doses require a clinician.
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    base: "yogurt with berries and almonds, fortified plant milk smoothie, eggs with kale"
    avoid: "salt-heavy breakfast meats, cola"
  lunch:
    base: "sardine salad, tofu and broccoli bowl, lentil soup with kale"
    avoid: "deli meat sandwiches, pickles, salty condiments"
  dinner:
    base: "salmon with potatoes and collard greens, chicken with quinoa and bok choy"
    avoid: "liver, processed meat, soy sauce"
  snacks:
    base: "yogurt, almonds, sesame, figs, prunes"
    avoid: "cola, energy drinks, salty snacks"
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - mediterranean
    - dash
    - mind
    - flexitarian
    - volumetrics
    - high-protein
    - plant-based
    - vegan
    - vegetarian
    - pescatarian
    - low-sodium
    - diabetes-friendly
    - gluten-free

  adaptable_match:
    - keto: "Use dairy, sardines, salmon, eggs and low-oxalate greens; add calcium-set tofu for the bone partner"
    - paleo: "Paleo excludes dairy and legumes; use sardines with bones, kale, almonds, tahini and calcium-set tofu if allowed"
    - low-fodmap: "Use low-FODMAP greens and fortified plant milk; limit legumes to tolerated portions"
    - intermittent-fasting: "Timing pattern is orthogonal — include calcium-rich foods inside the eating window"
    - whole30: "Whole30 excludes dairy and legumes; rely on sardines, salmon, kale, almonds and tahini"
    - macrobiotic: "Include calcium-set tofu, leafy greens, sesame and tahini; avoid high-salt condiments"
    - pritikin: "Compatible — both emphasise vegetables and whole grains; ensure adequate calcium without excessive sodium"
    - mcdougall: "Plant-based calcium from tofu, greens, tahini and fortified plant milk; watch sodium"
    - hclf-811: "Fruit-heavy; add calcium-set tofu, greens and fortified plant milk to meet calcium needs"
    - carnivore: "Dairy and fish can cover calcium; no greens or legumes — check vitamin K and fibre"

  hard_conflict:
    - carnivore: "Limited plant sources of vitamin K, magnesium and fibre — supplement and medical guidance may be needed"
```

---

## Ingredient Classifier Reference

```yaml
classifier_mappings:
  # Sodium
  "salt": "salt"
  "sea salt": "salt"
  "soy sauce": "soy-sauce"
  "tamari": "soy-sauce"
  "bouillon": "bouillon-broth"
  "stock cube": "bouillon-broth"
  "gravy": "bouillon-broth"
  "pickles": "pickled-foods"
  "olives": "pickled-foods"
  "capers": "pickled-foods"
  "sauerkraut": "pickled-foods"

  # Cured and processed meat
  "bacon": "cured-meat"
  "ham": "cured-meat"
  "prosciutto": "cured-meat"
  "salami": "cured-meat"
  "sausage": "processed-meat"
  "deli meat": "processed-meat"
  "hot dog": "processed-meat"

  # Vitamin A and caffeine
  "liver": "liver"
  "beef liver": "liver"
  "chicken liver": "liver"
  "cod liver oil": "cod-liver-oil"
  "retinol": "high-retinol-supplements"
  "cola": "cola-drinks"
  "soft drink": "cola-drinks"
  "energy drink": "energy-drinks"
  "espresso": "excess-caffeine"
  "beer": "alcohol"
  "wine": "alcohol"
  "spirits": "alcohol"

  # Calcium-rich foods (explicitly allowed)
  "yogurt": "plain-yogurt"
  "greek yogurt": "plain-yogurt"
  "milk": "milk"
  "fortified plant milk": "fortified-plant-milk"
  "calcium set tofu": "calcium-set-tofu"
  "tofu": "calcium-set-tofu"
  "sardines": "sardines-with-bones"
  "canned salmon": "canned-salmon-with-bones"
  "salmon": "oily-fish"
  "mackerel": "oily-fish"
  "kale": "kale"
  "collard greens": "collard-greens"
  "bok choy": "bok-choy"
  "broccoli": "broccoli"
  "almonds": "almonds"
  "sesame": "sesame"
  "tahini": "tahini"
  "chia seeds": "chia-seeds"
  "flaxseed": "flaxseed"
  "prunes": "prunes"
  "figs": "figs"
  "lentils": "legumes"
  "chickpeas": "legumes"
  "beans": "legumes"
  "oats": "oats"
  "brown rice": "brown-rice"
  "quinoa": "quinoa"
  "barley": "barley"
```

---

## Implementation Checklist

- [x] Add `bone-health` to `diet_catalog` with `is_condition = 1`
- [x] Populate `macro_targets` (calcium/vitamin D/protein floors, sodium ceiling)
- [x] Enforce the sodium ceiling in the meal guard when reported
- [x] Merge with lifestyle diets and other conditions
- [x] Show in ProfilesTab / Onboarding condition picker
- [x] Serve articles in the DietBrowser

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
