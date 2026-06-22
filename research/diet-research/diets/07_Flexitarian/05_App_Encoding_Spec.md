# Flexitarian Diet — App Encoding Spec

> Machine-readable specification for integrating the flexitarian diet into Cupla's AI meal generation system. This file is designed for direct implementation by developers.

---

## Diet Metadata

```yaml
diet_key: "flexitarian"
display_label: "Flexitarian"
category: "plant-based"
emoji: "🌱"
short_description: "Flexible vegetarian — mostly plants with occasional meat and fish"
evidence_grade: "B-C"
restrictiveness: 1  # 1-5 scale (least restrictive healthy diet)
sodium_restriction: "moderate"

# Flexitarian levels (Blatner framework)
flexitarian_levels:
  beginner:
    label: "Beginner"
    meatless_days_per_week: 2
    meat_meals_per_week: 5
    total_meet_oz_per_week: 26
    description: "Easiest entry point — 2 meatless days/week"
  advanced:
    label: "Advanced"
    meatless_days_per_week: 3  # to 4
    meat_meals_per_week: 3  # to 4
    total_meet_oz_per_week: 18
    description: "Most common level — 3-4 meatless days/week"
  expert:
    label: "Expert"
    meatless_days_per_week: 5  # 5+
    meat_meals_per_week: 2  # or fewer
    total_meet_oz_per_week: 9
    description: "Near-vegetarian — 5+ meatless days/week"

# Related diet_keys
related_diet_keys:
  - "plant-based"
  - "vegetarian"
  - "vegan"
```

---

## Food Group Rules

### Allowed Food Groups (Core Ingredients)

```yaml
allowed_food_groups:
  # Vegetables (all types — unlimited)
  - "leafy-greens"          # spinach, kale, collards, chard, arugula
  - "cruciferous"           # broccoli, cauliflower, cabbage, Brussels sprouts
  - "alliums"               # onion, garlic, leeks, shallots
  - "tomatoes"              # all forms
  - "peppers"               # bell peppers, chili peppers
  - "root-vegetables"       # carrots, beets, parsnips, radishes
  - "starchy-vegetables"    # potatoes, sweet potatoes, corn, squash
  - "nightshades"           # eggplant
  - "cucurbit-vegetables"   # zucchini, cucumber, summer squash
  - "mushrooms"             # all varieties

  # Fruits (all types)
  - "berries"               # strawberries, blueberries, raspberries, blackberries
  - "citrus"                # oranges, lemons, grapefruit, lime
  - "tropical-fruit"        # banana, mango, pineapple, papaya, kiwi
  - "stone-fruit"           # peaches, plums, apricots, cherries
  - "pome-fruit"            # apples, pears
  - "grapes"
  - "melons"

  # Whole grains
  - "whole-grains"          # brown rice, oats, quinoa, barley, farro, buckwheat, millet
  - "pasta-whole-grain"     # whole wheat pasta
  - "whole-grain-bread"     # 100% whole wheat, sprouted grain bread
  - "corn"                  # whole corn, popcorn

  # Legumes (key protein source — daily)
  - "legumes"               # lentils (all colors), beans (all types), split peas
  - "chickpeas"             # garbanzo beans, hummus
  - "soy-foods"             # tofu, tempeh, edamame, soy milk
  - "peas"                  # green peas, snow peas, snap peas

  # Nuts and seeds
  - "nuts"                  # almonds, walnuts, cashews, pistachios, pecans, Brazil nuts
  - "seeds"                 # flax, chia, hemp, pumpkin, sunflower, sesame
  - "nut-butters"           # almond butter, peanut butter, cashew butter (natural)
  - "tahini"

  # Eggs and dairy (daily, moderate)
  - "eggs"                  # up to 4-6 per week
  - "dairy-milk"            # cow's milk or fortified plant milk
  - "yogurt"                # Greek yogurt, regular yogurt
  - "cheese"                # moderate portions (30-40g)
  - "cottage-cheese"

  # Fats
  - "olive-oil"             # extra virgin preferred
  - "avocado"
  - "nuts"
  - "dark-chocolate"        # 70%+ (moderate)

  # Occasional animal proteins (2-3 meals/week)
  - "fish-fatty"            # salmon, sardines, mackerel, herring (PRIORITY when including animal protein)
  - "fish-lean"             # cod, halibut, snapper, sea bass
  - "seafood"               # shrimp, mussels, clams, squid
  - "poultry"               # chicken, turkey

  # Flavoring
  - "herbs"                 # all fresh and dried herbs
  - "spices"                # all spices
  - "lemon-lime"
  - "vinegars"              # apple cider, balsamic, rice, wine
  - "garlic"
  - "ginger"
  - "nutritional-yeast"
  - "soy-sauce"             # tamari, shoyu
  - "honey"                 # moderate
  - "maple-syrup"           # moderate

  # Beverages
  - "water"
  - "coffee"                # unsweetened
  - "tea"                   # green, black, herbal
```

### Restricted Food Groups (Minimize)

```yaml
restricted_food_groups:
  - "processed-meat"        # sausages, bacon, deli meats, hot dogs — AVOID
  - "red-meat-frequent"     # limit to a few times/month (not a complete ban, but minimize)
  - "refined-grains"        # white bread, white rice, regular pasta — minimize, prefer whole
  - "refined-sugar"         # sweets, pastries, candy — minimize
  - "sugary-drinks"         # soda, juice with added sugar — avoid
  - "fast-food"             # minimize
  - "ultra-processed-food"  # minimize
```

### Moderate Food Groups

```yaml
moderate_food_groups:
  # Animal proteins — frequency depends on flexitarian level
  - "fish-fatty": "1-2x/week (recommended when including animal protein)"
  - "fish-lean": "occasional"
  - "seafood": "occasional"
  - "poultry": "occasional (weekly or less)"
  - "red-meat": "few times/month max; small portions (85-120g)"

  # Other moderate foods
  - "eggs": "up to 4-6 per week"
  - "cheese": "30-40g/day, moderate"
  - "butter": "moderate (prefer olive oil)"
  - "refined-grains": "occasionally, prefer whole grain"
  - "sweets": "occasional small treats"
  - "dark-chocolate": "1-2 squares/day (70%+)"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  carbs_pct: [45, 55]        # ~50% of calories
  protein_pct: [15, 22]      # ~18% of calories
  fat_pct: [25, 35]          # ~32% of calories
  saturated_fat_pct: [0, 8]  # <8% of calories
  fiber_g: [28, 40]          # 28-40g/day
  sodium_mg: [0, 2300]       # <2300mg/day

# Meat frequency targets by level
meat_frequency:
  beginner:
    meatless_days_per_week: 2
    max_meat_meals_per_week: 5
    max_meat_oz_per_meal: 5
  advanced:
    meatless_days_per_week: [3, 4]
    max_meat_meals_per_week: 4
    max_meat_oz_per_meal: 4
  expert:
    meatless_days_per_week: 5  # or more
    max_meat_meals_per_week: 2
    max_meat_oz_per_meal: 3
```

---

## AI Prompt Instructions

```
FLEXITARIAN DIET RULES — Follow strictly:

SUB-TYPE DETECTION:
- Default level: "Advanced" (3-4 meatless days/week, ~3-4 meat meals/week).
- Adjust based on user's stated preference for Beginner (2 meatless days), Advanced (3-4), or Expert (5+ meatless days).

1. PLANT-FORWARD: Every meal should be built around plants. Vegetables, fruits, whole grains, legumes, nuts, and seeds are the foundation. The majority of meals should be fully plant-based or plant-forward.

2. PROTEIN SOURCES: Prioritize plant proteins (legumes, tofu, tempeh, edamame, nuts, seeds) for MOST meals. Animal proteins (fish, poultry, eggs, dairy) are allowed but should appear in only 2-3 meals per week.

3. MEAT FREQUENCY: Limit meat/fish/poultry to 2-3 meals per week (Advanced level). When meat is included, keep portions moderate (3-5 oz / 85-140g). Prioritize fish (especially fatty fish) over poultry over red meat.

4. FISH PRIORITY: When including animal protein, PRIORITIZE fish — especially fatty fish (salmon, sardines, mackerel) for omega-3 content. This aligns with both health and flexitarian philosophy.

5. PROCESSED MEAT: Do NOT include processed meats (sausages, bacon, deli meats, hot dogs). These are minimized/avoided on the flexitarian diet.

6. RED MEAT: Include red meat only occasionally (a few times per month). Small portions (85-120g). Never feature red meat in consecutive meals.

7. VEGETABLES: Aim for 4+ servings of vegetables per day. Maximize variety and color.

8. WHOLE GRAINS: Use whole grains (brown rice, quinoa, oats, whole wheat, farro). Minimize refined grains.

9. LEGUMES: Include legumes (lentils, chickpeas, beans, tofu, tempeh) in 1-2 meals daily. These are the primary protein source on meatless days.

10. EGGS AND DAIRY: Eggs (up to 4-6/week) and moderate dairy (Greek yogurt, cheese) are allowed daily. These provide protein, B12, calcium, and iron on meatless days.

11. MEATLESS DAYS: Generate fully meatless meals for most days. Use creative plant-based mains — Buddha bowls, lentil stews, tofu stir-fries, bean-based dishes, pasta primavera, veggie curries.

12. FLAVOR: Use herbs, spices, garlic, lemon, vinegars, and nutritional yeast generously to build satisfying flavors without relying on meat.

13. DESSERT: Default dessert is fresh fruit. Sweets should be occasional.

14. NO STRICT BANS: Remember — no food is completely forbidden on the flexitarian diet. The goal is balance and predominance of plant foods, not perfection.
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    typical: "Oatmeal with fruit, nuts, seeds; OR Greek yogurt with granola and berries; OR eggs with whole grain toast and vegetables"
    must_include: ["whole grain OR eggs/dairy", "fruit", "healthy fat (nuts/seeds)"]
    meat: "never at breakfast"
    avoid: ["bacon", "sausage", "processed cereal", "pastries"]

  lunch:
    typical: "Plant-based: Buddha bowl, lentil/chickpea salad, bean soup, veggie wrap. Occasionally: tuna salad, chicken salad, or cheese-based dish."
    must_include: ["vegetables (multiple types)", "protein source", "whole grain"]
    protein_preference: "legumes, tofu, eggs, cheese (meatless by default; occasional fish/poultry)"
    meat_frequency: "rarely at lunch — most lunches should be meatless"
    avoid: ["red meat (unless very occasional)", "processed meat"]

  dinner:
    typical: "Most dinners meatless: tofu/tempeh stir-fry, lentil dal, bean-based dishes, pasta primavera, stuffed vegetables. 2-3 dinners/week WITH fish or poultry."
    must_include: ["vegetables", "protein", "whole grain or starchy vegetable"]
    protein_preference: "plant proteins (most nights); fish (1-2x/week); poultry (occasionally)"
    meat_frequency: "2-3 dinners per week may include fish or poultry"
    fish_priority: "when including animal protein, prioritize fatty fish"
    avoid: ["processed meat", "heavy red meat portions"]

  snacks:
    typical: "Nuts/seeds, fresh fruit, Greek yogurt, hummus with vegetables, dark chocolate, cottage cheese"
    avoid: ["chips", "candy", "processed snacks"]
```

---

## Weekly Structure Generator

```yaml
weekly_meal_plan_rules:
  # Determine number of meatless days based on flexitarian level
  beginner:
    meatless_days: 2
    meat_days: 5
    description: "2 fully meatless days; other days are plant-forward with meat at dinner"
  advanced:
    meatless_days: [3, 4]
    meat_days: [3, 4]
    description: "3-4 meatless days; meat/fish at 3-4 dinners"
    meat_distribution:
      fish_fatty: "1-2x/week"
      poultry: "1x/week"
      red_meat: "0-1x/week (occasional)"
  expert:
    meatless_days: [5, 7]
    meat_days: [0, 2]
    description: "5+ meatless days; meat/fish at 1-2 dinners max"
    meat_distribution:
      fish_fatty: "1x/week"
      poultry: "0-1x/week"
      red_meat: "avoid or very rare"

  # Rules for meal plan generation
  rules:
    - "Breakfasts and lunches should ALWAYS be meatless"
    - "Generate meat/fish only at dinner, and only on designated meat days"
    - "When meat is included, keep portions to 3-5 oz (85-140g)"
    - "Prioritize fish over poultry over red meat"
    - "Ensure legumes appear in at least 1-2 meals per day"
    - "Ensure at least 4 servings of vegetables and 3 servings of fruit per day"
    - "Ensure every meal includes a protein source"
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - mediterranean
    - plant-based
    - vegetarian
    - vegan
    - mind
    - dash
    - volumetrics
    - high-protein

  adaptable_match:
    - keto: "Make the base meal plant-forward (vegetables, eggs, cheese, nuts); add meat for keto partner. Flexitarian partner can eat the same vegetables + legumes/grains"
    - paleo: "Both can share vegetables, nuts, fruit, eggs, fish. Flexitarian partner adds grains/legumes; paleo partner adds more meat"
    - pescatarian: "Nearly identical — share fish and plant-based meals; flexitarian may occasionally add poultry"
    - low-fodmap: "Adapt recipes — reduce garlic/onion, choose low-FODMAP vegetables, moderate legumes"

  hard_conflict:
    - carnivore: "Fundamental tension — carnivore is all animal products, flexitarian is mostly plants. But it's workable since flexitarian allows some meat — suggest shared protein with separate plant sides for the flexitarian partner"
    - mcdougall: "Both are plant-forward, but McDougall is very low fat (<10%) — use oil-free cooking if needed"
    - pritikin: "Both are plant-forward, but Pritikin is <10% fat — use oil-free cooking if needed"
```

---

## Ingredient Classifier Reference

Key flexitarian ingredients and their food group classification for the safety guard:

```yaml
classifier_mappings:
  # Plant Proteins
  "tofu": "soy-foods"
  "tempeh": "soy-foods"
  "edamame": "soy-foods"
  "seitan": "plant-protein"
  "nutritional yeast": "nutritional-yeast"
  "lentils": "legumes"
  "chickpeas": "chickpeas"
  "black beans": "legumes"
  "kidney beans": "legumes"
  "hummus": "chickpeas"

  # Grains
  "brown rice": "whole-grains"
  "quinoa": "whole-grains"
  "oats": "whole-grains"
  "barley": "whole-grains"
  "whole wheat pasta": "pasta-whole-grain"
  "white rice": "refined-grains"
  "white bread": "refined-grains"

  # Nuts and Seeds
  "almonds": "nuts"
  "walnuts": "nuts"
  "flaxseed": "seeds"
  "chia seeds": "seeds"
  "hemp seeds": "seeds"
  "tahini": "tahini"

  # Eggs and Dairy
  "eggs": "eggs"
  "greek yogurt": "yogurt"
  "cheese": "cheese"
  "cottage cheese": "cottage-cheese"
  "milk": "dairy-milk"

  # Fish (occasional — track frequency)
  "salmon": "fish-fatty"
  "sardines": "fish-fatty"
  "mackerel": "fish-fatty"
  "tuna": "fish-fatty"
  "cod": "fish-lean"
  "shrimp": "seafood"

  # Poultry (occasional — track frequency)
  "chicken": "poultry"
  "turkey": "poultry"

  # Red meat (rare — track and limit frequency)
  "beef": "red-meat"
  "pork": "red-meat"
  "lamb": "red-meat"

  # Processed meat (restrict)
  "bacon": "processed-meat"
  "sausage": "processed-meat"
  "ham": "processed-meat"
  "deli meat": "processed-meat"
  "hot dogs": "processed-meat"

  # Fats
  "olive oil": "olive-oil"
  "avocado": "avocado"
```

---

## Implementation Checklist

- [ ] Add `flexitarian` to the `DietKey` union type
- [ ] Add Flexitarian definition to `DIETS` record in `diets.ts`
- [ ] Add flexitarian level selector (Beginner / Advanced / Expert) in diet picker UI
- [ ] Inject Flexitarian AI prompt instructions in `buildPrompt()`, adapting meat frequency based on level
- [ ] Add food-group rules to `assertMealCompliesWithDiet()`:
  - Processed meat: always block
  - Red meat: limit frequency (max 1 meal/week for Advanced, 0-1 for Expert)
  - Fish: allow 1-2x/week (recommended)
  - Poultry: allow occasionally (1x/week for Advanced)
  - Track weekly meat meal count against level targets
- [ ] Add weekly meat frequency tracker (count meat-containing meals per week; warn if exceeding level allowance)
- [ ] Add classifier mappings for flexitarian ingredients
- [ ] Add couple compatibility rules for Flexitarian + other diets
- [ ] Update seed data with a flexitarian test user
- [ ] Implement weekly meal plan generator that distributes meatless vs. meat days according to selected level
- [ ] Add fish priority logic: when generating a meat-containing meal, default to fish (especially fatty fish) over poultry over red meat
- [ ] Add daily legume tracking (target: 1-2 servings/day)
- [ ] Add breakfast/lunch meatless enforcement (meat should only appear at dinner)

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
