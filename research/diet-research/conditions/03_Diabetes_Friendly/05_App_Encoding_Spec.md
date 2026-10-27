# Diabetes-Friendly Diet — App Encoding Spec

> Machine-readable spec for the CookTwo health-condition layer. Used when a partner selects the **Diabetes-Friendly** condition. Encodes a moderate carbohydrate ceiling per meal (60 g default) plus added-sugar and refined-grain exclusions.

---

## Diet Metadata

```yaml
diet_key: "diabetes-friendly"
display_label: "Diabetes-Friendly"
category: "condition"
emoji: "🩸"
short_description: "Blood-sugar friendly eating — low-GI carbs, high fibre, no added sugar"
evidence_grade: "A"
restrictiveness: 3  # 1-5 scale
is_condition: "true"
sodium_restriction: "moderate"
```

---

## Food Group Rules

### Allowed Food Groups (Core Ingredients)

```yaml
allowed_food_groups:
  - "non-starchy-vegetables"
  - "leafy-greens"
  - "whole-fruit"
  - "legumes"
  - "lentils"
  - "chickpeas"
  - "beans"
  - "whole-grains"
  - "brown-rice"
  - "quinoa"
  - "barley"
  - "oats"
  - "whole-grain-bread"
  - "whole-wheat-pasta"
  - "sweet-potatoes"
  - "fish"
  - "oily-fish"
  - "poultry"
  - "eggs"
  - "tofu"
  - "tempeh"
  - "plain-yogurt"
  - "nuts"
  - "seeds"
  - "olive-oil"
  - "avocado"
  - "herbs-spices"
  - "vinegar"
  - "unsweetened-tea-coffee"
```

### Restricted Food Groups (Always Excluded)

```yaml
restricted_food_groups:
  - "added-sugar"
  - "sugary-drinks"
  - "fruit-juice"
  - "refined-grains"
  - "sweets-desserts"
  - "sweetened-dairy"
  - "high-sugar-condiments"
  - "processed-snacks"
  - "fried-food"
```

### Limited Food Groups (Moderation)

```yaml
limited_food_groups:
  - "carbohydrates: 30-60g per main meal (moderate default; individualise with a dietitian)"
  - "whole-fruit: 1-2 portions per meal, prefer berries and low-GI fruit"
  - "starchy-vegetables: count toward the carbohydrate portion"
  - "red-meat: limit to 1 serving per week"
  - "saturated-fat: keep under 10% of calories"
  - "alcohol: avoid on an empty stomach; hypoglycaemia risk with insulin or sulfonylureas"
  - "dark-chocolate: small portion after a meal only"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  carbs_g_meal_min: 30
  carbs_g_meal_max: 60
  added_sugar_g_meal_max: 3
  fiber_g_meal_min: 8
  fiber_g_day_min: 25
  protein_g_meal_min: 25
```

---

## AI Prompt Instructions

```
DIABETES-FRIENDLY DIET RULES — Follow strictly:

1. CARBOHYDRATE CONTROL:
   - Keep each main meal to roughly 30-60g of carbohydrate. This is a moderate default, not a prescription.
   - Choose low-glycaemic, high-fibre carbohydrates: legumes, barley, oats, quinoa, brown rice, whole-grain bread, whole-wheat pasta, sweet potato.
   - Do NOT use white rice, white bread, white pasta, instant noodles or refined flour.
   - Keep carbohydrate portions consistent across meals.
2. NO ADDED SUGAR AND NO SUGARY DRINKS:
   - No sugar, honey, maple syrup, agave, corn syrup or molasses.
   - No soft drinks, sweetened juice, energy drinks, sweet tea, lemonade or fruit punch.
   - No cake, cookies, biscuits, pastries, ice cream, candy or chocolate bars.
   - No jam, jelly, marmalade, ketchup, BBQ sauce, sweet chilli sauce, honey mustard or teriyaki.
   - No flavoured or fruit yogurt, condensed milk or sweetened dairy.
3. FRUIT: Use whole fruit, not juice. Prefer berries, apples, pears, oranges, kiwi and peaches. Keep portions moderate (1-2 portions per meal).
4. FIBRE: Include at least 8g fibre per main meal; aim for 25-30g per day. Build meals around non-starchy vegetables, legumes, nuts and seeds.
5. PROTEIN: Include at least 25g protein per main meal from fish, poultry, eggs, tofu, tempeh, legumes or plain yogurt. This blunts post-meal glucose spikes.
6. PLATE METHOD: Half the plate non-starchy vegetables, one quarter protein, one quarter low-GI carbohydrate.
7. FAT QUALITY: Use olive oil, avocado, nuts and oily fish. Limit butter, cream, fatty meat and fried food.
8. DRINKS: Water, sparkling water, unsweetened tea or black coffee only.
9. ALCOHOL: If included, keep it minimal and never on an empty stomach; it can cause delayed hypoglycaemia in people on insulin or sulfonylureas.
10. This app provides general dietary guidance, not medical advice. Do NOT calculate insulin doses or tell the user to change medication. People with type 1 diabetes, gestational diabetes, kidney disease or hypoglycaemia risk need individualised medical guidance.
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    base: "plain oats with berries and nuts, eggs with vegetables, plain yogurt with seeds"
    avoid: "sugary cereal, fruit juice, flavoured yogurt, pastries"
  lunch:
    base: "lentil or chicken salad, quinoa bowl, whole-grain wrap with protein and vegetables"
    avoid: "white bread sandwiches, sugary dressings, soft drinks"
  dinner:
    base: "fish or poultry with non-starchy vegetables and a moderate portion of whole grains or legumes"
    avoid: "white rice, white pasta, sugary sauces, deep-fried food"
  snacks:
    base: "nuts, plain yogurt, vegetable sticks, hummus, a small apple with peanut butter"
    avoid: "biscuits, cereal bars, sweets, juice"
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
    - bone-health
    - gluten-free

  adaptable_match:
    - keto: "Keto is more restrictive on carbohydrate; follow keto's ceiling and keep the diabetic partner's protein and non-starchy vegetables high. Monitor for hypoglycaemia risk if on medication."
    - paleo: "Paleo already excludes refined grains and sugar; add legumes or whole grains only for the non-paleo partner"
    - low-fodmap: "Use low-FODMAP vegetables and grains; watch fruit portions and polyols"
    - intermittent-fasting: "Timing pattern is orthogonal, but fasting plus diabetes medication carries hypoglycaemia risk — medical guidance required"
    - whole30: "Whole30 is naturally sugar-free and refined-grain-free; compatible"
    - macrobiotic: "Use brown rice and whole grains in measured portions; avoid sweetened condiments"
    - pritikin: "Very compatible — both emphasise fibre-rich whole foods and low fat"
    - mcdougall: "Starch-based; keep portions of rice/potatoes within the carbohydrate ceiling"
    - hclf-811: "Fruit-heavy and high-carbohydrate — generally incompatible with the diabetes carbohydrate ceiling"
    - carnivore: "No carbohydrate, but high saturated fat and no fibre — shared meals are difficult"

  hard_conflict:
    - hclf-811: "Very high fruit and carbohydrate intake conflicts with the per-meal carbohydrate ceiling"
```

---

## Ingredient Classifier Reference

```yaml
classifier_mappings:
  # Added sugars
  "sugar": "added-sugar"
  "brown sugar": "added-sugar"
  "white sugar": "added-sugar"
  "caster sugar": "added-sugar"
  "powdered sugar": "added-sugar"
  "icing sugar": "added-sugar"
  "honey": "added-sugar"
  "maple syrup": "added-sugar"
  "agave": "added-sugar"
  "agave syrup": "added-sugar"
  "corn syrup": "added-sugar"
  "high fructose corn syrup": "added-sugar"
  "molasses": "added-sugar"
  "dextrose": "added-sugar"
  "maltose": "added-sugar"
  "sucrose": "added-sugar"
  "syrup": "added-sugar"

  # Sugary drinks and juice
  "soft drink": "sugary-drinks"
  "soda": "sugary-drinks"
  "cola": "sugary-drinks"
  "energy drink": "sugary-drinks"
  "sports drink": "sugary-drinks"
  "lemonade": "sugary-drinks"
  "sweet tea": "sugary-drinks"
  "fruit punch": "sugary-drinks"
  "cordial": "sugary-drinks"
  "juice": "fruit-juice"
  "orange juice": "fruit-juice"
  "apple juice": "fruit-juice"
  "grape juice": "fruit-juice"

  # Refined grains
  "white rice": "refined-grains"
  "white bread": "refined-grains"
  "white pasta": "refined-grains"
  "instant noodles": "refined-grains"
  "ramen": "refined-grains"
  "white flour": "refined-grains"
  "all purpose flour": "refined-grains"
  "cornflakes": "refined-grains"
  "puffed rice": "refined-grains"
  "couscous": "refined-grains"

  # Sweets and desserts
  "cake": "sweets-desserts"
  "cookie": "sweets-desserts"
  "biscuit": "sweets-desserts"
  "brownie": "sweets-desserts"
  "muffin": "sweets-desserts"
  "donut": "sweets-desserts"
  "doughnut": "sweets-desserts"
  "pastry": "sweets-desserts"
  "croissant": "sweets-desserts"
  "pie": "sweets-desserts"
  "tart": "sweets-desserts"
  "ice cream": "sweets-desserts"
  "gelato": "sweets-desserts"
  "sorbet": "sweets-desserts"
  "pudding": "sweets-desserts"
  "candy": "sweets-desserts"
  "sweets": "sweets-desserts"
  "chocolate bar": "sweets-desserts"
  "milk chocolate": "sweets-desserts"
  "white chocolate": "sweets-desserts"
  "chocolate spread": "sweets-desserts"
  "jam": "sweets-desserts"
  "jelly": "sweets-desserts"
  "marmalade": "sweets-desserts"
  "preserves": "sweets-desserts"

  # Sweetened dairy
  "flavoured yogurt": "sweetened-dairy"
  "flavored yogurt": "sweetened-dairy"
  "fruit yogurt": "sweetened-dairy"
  "vanilla yogurt": "sweetened-dairy"
  "condensed milk": "sweetened-dairy"
  "sweetened condensed milk": "sweetened-dairy"

  # Sugary condiments
  "ketchup": "high-sugar-condiments"
  "tomato ketchup": "high-sugar-condiments"
  "bbq sauce": "high-sugar-condiments"
  "barbecue sauce": "high-sugar-condiments"
  "sweet chilli sauce": "high-sugar-condiments"
  "sweet chili sauce": "high-sugar-condiments"
  "honey mustard": "high-sugar-condiments"
  "teriyaki": "high-sugar-condiments"
  "plum sauce": "high-sugar-condiments"
  "sweet and sour": "high-sugar-condiments"

  # Processed snacks and fried food
  "granola": "processed-snacks"
  "cereal bar": "processed-snacks"
  "granola bar": "processed-snacks"
  "protein bar": "processed-snacks"
  "potato chips": "processed-snacks"
  "tortilla chips": "processed-snacks"
  "chips": "fried-food"
  "french fries": "fried-food"
  "deep fried": "fried-food"
  "battered": "fried-food"
  "breaded": "fried-food"

  # Safe staples (explicitly allowed)
  "brown rice": "brown-rice"
  "quinoa": "quinoa"
  "barley": "barley"
  "oats": "oats"
  "lentils": "legumes"
  "chickpeas": "legumes"
  "black beans": "legumes"
  "kidney beans": "legumes"
  "salmon": "oily-fish"
  "sardines": "oily-fish"
  "mackerel": "oily-fish"
  "plain yogurt": "plain-yogurt"
  "greek yogurt": "plain-yogurt"
  "olive oil": "olive-oil"
  "avocado": "avocado"
  "almonds": "nuts"
  "walnuts": "nuts"
  "chia seeds": "seeds"
  "flaxseed": "seeds"
```

---

## Implementation Checklist

- [x] Add `diabetes-friendly` to `diet_catalog` with `is_condition = 1`
- [x] Populate `macro_targets` (per-meal carb ceiling 60 g)
- [x] Enforce the carbohydrate ceiling in the meal guard
- [x] Merge with lifestyle diets and other conditions (strictest ceiling wins)
- [x] Show in ProfilesTab / Onboarding condition picker
- [x] Serve articles in the DietBrowser

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
