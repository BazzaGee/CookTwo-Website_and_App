# Low-Sodium / Cardiac-Friendly Diet — App Encoding Spec

> Machine-readable spec for the CookTwo health-condition layer. Used when a partner selects the **Low-Sodium / Heart** condition. Targets AHA/DASH sodium limits with a per-meal cap the generator can enforce.

---

## Diet Metadata

```yaml
diet_key: "low-sodium"
display_label: "Low-Sodium / Heart"
category: "condition"
emoji: "❤️"
short_description: "Cardiac-friendly eating — sodium ≤1,500-2,300mg, low saturated fat, high fibre"
evidence_grade: "A"
restrictiveness: 3  # 1-5 scale
is_condition: "true"
sodium_restriction: "strict"  # 1500-2300mg
```

---

## Food Group Rules

### Allowed Food Groups (Core Ingredients)

```yaml
allowed_food_groups:
  - "vegetables"
  - "leafy-greens"
  - "fruit"
  - "whole-grains"
  - "oats"
  - "barley"
  - "brown-rice"
  - "quinoa"
  - "legumes"
  - "no-salt-added-canned-goods"
  - "fresh-fish"
  - "oily-fish"
  - "poultry"
  - "lean-meat"
  - "eggs"
  - "tofu"
  - "plain-low-fat-dairy"
  - "unsalted-nuts"
  - "unsalted-seeds"
  - "olive-oil"
  - "avocado"
  - "herbs-spices"
  - "citrus"
  - "vinegar"
  - "garlic"
  - "onion"
  - "potatoes"
  - "sweet-potatoes"
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
  - "salty-snacks"
  - "canned-high-sodium"
  - "high-sodium-cheese"
  - "trans-fat"
  - "saturated-fat-heavy"
  - "fried-food"
  - "sugary-drinks"
  - "alcohol"
```

### Limited Food Groups (Moderation)

```yaml
limited_food_groups:
  - "red-meat: maximum 1 serving per week; choose lean cuts"
  - "eggs: up to 1 per day for most people"
  - "saturated-fat: keep under 6% of calories"
  - "added-sugar: under 10% of calories, ideally under 5%"
  - "sodium: target 1,500mg/day, never exceed 2,300mg/day"
  - "caffeine: moderate intake is acceptable"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  sodium_mg_meal_max: 500
  sodium_mg_day_max: 1500
  sodium_mg_day_ceiling: 2300
  saturated_fat_pct_max: 6
  fiber_g_day_min: 25
  fiber_g_meal_min: 8
  potassium_mg_meal_min: 600
```

---

## AI Prompt Instructions

```
LOW-SODIUM / CARDIAC-FRIENDLY DIET RULES — Follow strictly:

1. SODIUM IS THE PRIMARY TARGET:
   - Design meals to approximately 500mg sodium or less per serving.
   - Do NOT add salt in cooking or at the table.
   - Do NOT use salt-based seasonings, salted butter, or salt blends.
   - Season with herbs, spices, citrus juice, vinegar, garlic, onion, ginger and chilli instead.
2. FORBIDDEN HIGH-SODIUM INGREDIENTS:
   - Soy sauce, tamari, fish sauce, oyster sauce, teriyaki, hoisin, miso.
   - Bouillon cubes, stock cubes, gravy granules, regular broth.
   - Pickles, olives, capers, sauerkraut, kimchi.
   - Bacon, ham, sausage, salami, pepperoni, deli meat, hot dogs, chorizo, prosciutto.
   - Canned soup, instant noodles, frozen ready meals, salted canned vegetables.
   - Crisps, pretzels, salted crackers, salted popcorn, salted nuts.
   - Parmesan, feta, halloumi, blue cheese, processed cheese.
   - Salt substitutes that contain sodium.
3. FAT QUALITY:
   - Keep saturated fat low: limit butter, cream, fatty meat, coconut oil and full-fat dairy.
   - Avoid trans fat and partially hydrogenated oils; no commercial pastries or deep-fried food.
   - Use olive oil, avocado, unsalted nuts and seeds as the main fats.
4. EMPHASISE:
   - Vegetables and fruit at every meal (aim for half the plate).
   - Whole grains, oats, barley, brown rice, quinoa.
   - Legumes, lentils, chickpeas and beans (no-salt-added or rinsed).
   - Oily fish such as salmon, sardines and mackerel at least twice a week.
   - Skinless poultry, tofu and eggs; limit red meat to once a week.
   - Unsalted nuts and seeds.
5. FIBRE: aim for 25-30g per day from whole grains, legumes, vegetables and fruit.
6. POTASSIUM: include potassium-rich foods such as leafy greens, beans, potatoes, bananas and tomatoes. Do NOT apply this if the user has kidney disease — that requires medical guidance.
7. NO ADDED SUGAR OR SUGARY DRINKS: avoid soft drinks, sweetened juices and energy drinks.
8. COOKING METHOD: grill, bake, steam, poach or saute with olive oil. Do not deep-fry.
9. If canned ingredients are used, specify no-salt-added and rinsed.
10. This app provides general dietary guidance, not medical advice. Heart failure, kidney disease and medication changes require a clinician.
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    base: "oats with fruit and unsalted nuts, eggs with vegetables, plain yogurt"
    avoid: "bacon, sausage, salted butter, salty bread"
  lunch:
    base: "salad with legumes and olive oil, leftover poultry with quinoa"
    avoid: "deli meat sandwiches, canned soup, salty dressings"
  dinner:
    base: "baked fish or chicken with vegetables and whole grains"
    avoid: "processed meat, soy sauce, deep-fried food"
  snacks:
    base: "fruit, unsalted nuts, plain yogurt, vegetable sticks"
    avoid: "crisps, salted crackers, olives, cheese boards"
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - dash
    - mediterranean
    - mind
    - flexitarian
    - volumetrics
    - high-protein
    - plant-based
    - vegan
    - vegetarian
    - pescatarian
    - diabetes-friendly
    - bone-health
    - gluten-free

  adaptable_match:
    - keto: "Focus on fish, eggs, vegetables and olive oil; keep keto partner's salt additions off the shared dish. Keto processed meats are excluded."
    - paleo: "Lean meat, fish, vegetables, nuts and olive oil work well; avoid paleo-friendly cured meats and added salt"
    - low-fodmap: "Use low-FODMAP vegetables; keep sodium low; rinse canned legumes"
    - intermittent-fasting: "Timing pattern is orthogonal — follow sodium rules inside the eating window"
    - whole30: "Whole30 is naturally low in processed food; avoid added salt and cured meats"
    - macrobiotic: "Use low-sodium soy alternatives sparingly; avoid pickled and salted traditional foods"
    - pritikin: "Highly compatible — both low-fat, low-sodium patterns"
    - mcdougall: "Plant-based and low-sodium; avoid salty condiments"
    - hclf-811: "Fruit and vegetables are naturally low in sodium; avoid salted nuts and condiments"

  hard_conflict:
    - carnivore: "Processed and cured meats dominate; shared meals are difficult — use fresh unseasoned meat and separate condiments"
```

---

## Ingredient Classifier Reference

```yaml
classifier_mappings:
  # Salt and sodium-rich condiments
  "salt": "salt"
  "sea salt": "salt"
  "kosher salt": "salt"
  "table salt": "salt"
  "salted butter": "salt"
  "garlic salt": "salt"
  "onion salt": "salt"
  "celery salt": "salt"
  "seasoning salt": "salt"
  "soy sauce": "soy-sauce"
  "tamari": "soy-sauce"
  "fish sauce": "high-sodium-condiments"
  "oyster sauce": "high-sodium-condiments"
  "hoisin": "high-sodium-condiments"
  "teriyaki": "high-sodium-condiments"
  "miso": "high-sodium-condiments"
  "bouillon": "bouillon-broth"
  "stock cube": "bouillon-broth"
  "gravy": "bouillon-broth"
  "consomme": "bouillon-broth"
  "msg": "high-sodium-condiments"
  "monosodium glutamate": "high-sodium-condiments"
  "baking soda": "high-sodium-condiments"
  "baking powder": "high-sodium-condiments"

  # Pickled and brined
  "pickles": "pickled-foods"
  "pickled": "pickled-foods"
  "olives": "pickled-foods"
  "capers": "pickled-foods"
  "sauerkraut": "pickled-foods"
  "kimchi": "pickled-foods"

  # Meat and fish
  "bacon": "cured-meat"
  "ham": "cured-meat"
  "prosciutto": "cured-meat"
  "salami": "cured-meat"
  "pepperoni": "cured-meat"
  "chorizo": "cured-meat"
  "sausage": "processed-meat"
  "deli meat": "processed-meat"
  "hot dog": "processed-meat"
  "anchovies": "cured-meat"
  "smoked salmon": "cured-meat"

  # Snacks and prepared foods
  "crisps": "salty-snacks"
  "chips": "salty-snacks"
  "pretzels": "salty-snacks"
  "salted crackers": "salty-snacks"
  "salted popcorn": "salty-snacks"
  "salted nuts": "salty-snacks"
  "instant noodles": "canned-high-sodium"
  "ramen": "canned-high-sodium"
  "canned soup": "canned-high-sodium"
  "frozen dinner": "canned-high-sodium"
  "ready meal": "canned-high-sodium"
  "fast food": "fried-food"
  "deep fried": "fried-food"
  "battered": "fried-food"

  # Cheese
  "parmesan": "high-sodium-cheese"
  "feta": "high-sodium-cheese"
  "halloumi": "high-sodium-cheese"
  "blue cheese": "high-sodium-cheese"
  "processed cheese": "high-sodium-cheese"

  # Fat quality
  "butter": "saturated-fat-heavy"
  "cream": "saturated-fat-heavy"
  "coconut oil": "saturated-fat-heavy"
  "lard": "saturated-fat-heavy"
  "margarine": "trans-fat"
  "shortening": "trans-fat"
  "pastry": "trans-fat"
  "croissant": "trans-fat"

  # Drinks
  "soft drink": "sugary-drinks"
  "soda": "sugary-drinks"
  "cola": "sugary-drinks"
  "energy drink": "sugary-drinks"
  "sweetened juice": "sugary-drinks"
  "lemonade": "sugary-drinks"
  "beer": "alcohol"
  "wine": "alcohol"
  "spirits": "alcohol"

  # Safe staples (explicitly allowed)
  "olive oil": "olive-oil"
  "avocado": "avocado"
  "salmon": "oily-fish"
  "sardines": "oily-fish"
  "mackerel": "oily-fish"
  "lentils": "legumes"
  "chickpeas": "legumes"
  "black beans": "legumes"
  "brown rice": "brown-rice"
  "quinoa": "quinoa"
  "oats": "oats"
  "barley": "barley"
  "unsalted almonds": "unsalted-nuts"
  "unsalted walnuts": "unsalted-nuts"
```

---

## Implementation Checklist

- [x] Add `low-sodium` to `diet_catalog` with `is_condition = 1`
- [x] Populate `macro_targets` (per-meal sodium cap 500mg)
- [x] Enforce sodium ceiling in the meal guard
- [x] Merge with lifestyle diets and other conditions (strictest ceiling wins)
- [x] Show in ProfilesTab / Onboarding condition picker
- [x] Serve articles in the DietBrowser

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
