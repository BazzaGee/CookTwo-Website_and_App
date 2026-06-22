# Volumetrics Diet — App Encoding Spec

> Machine-readable specification for integrating the Volumetrics diet into Cupla's AI meal generation system. This file is designed for direct implementation by developers.

---

## Diet Metadata

```yaml
diet_key: "volumetrics"
display_label: "Volumetrics"
category: "balanced"
emoji: "⚖️"
short_description: "Eat more food, fewer calories — fill up on low energy density foods"
evidence_grade: "B-C"
restrictiveness: 1  # 1-5 scale
sodium_restriction: "moderate"
```

---

## Food Group Rules

### Allowed Food Groups (Core Ingredients)

```yaml
allowed_food_groups:
  # Category 1 — Very Low Energy Density (eat freely)
  - "non-starchy-vegetables"   # broccoli, carrots, celery, cucumbers, tomatoes, greens, zucchini, asparagus
  - "leafy-greens"             # spinach, kale, arugula, lettuce, Swiss chard
  - "cruciferous"              # broccoli, cauliflower, cabbage, Brussels sprouts
  - "watery-vegetables"        # cucumber, zucchini, celery, tomatoes
  - "alliums"                  # onions, garlic, leeks
  - "peppers"                  # bell peppers, chili peppers
  - "mushrooms"                # all varieties
  - "broth-based-soups"        # vegetable soup, chicken broth, miso, minestrone
  - "berries"                  # strawberries, blueberries, raspberries
  - "melons"                   # watermelon, cantaloupe, honeydew
  - "citrus"                   # oranges, grapefruit, tangerines
  - "stone-fruit"              # peaches, plums, nectarines, apricots
  - "pome-fruit"               # apples, pears (with skin)
  - "grapes"

  # Category 2 — Low Energy Density (eat moderate portions)
  - "whole-grains"             # oatmeal, brown rice, quinoa, barley, bulgur
  - "pasta-whole-grain"        # whole wheat pasta
  - "legumes"                  # lentils, beans, chickpeas, split peas
  - "lean-protein"             # skinless chicken breast, turkey breast, white fish
  - "fish-lean"                # cod, tilapia, halibut
  - "egg-whites"
  - "tofu"                     # firm, moderate portions
  - "low-fat-dairy"            # low-fat yogurt, cottage cheese, skim milk
  - "starchy-vegetables"       # sweet potato, potato (baked/boiled), corn, peas
  - "winter-squash"            # butternut, acorn squash

  # Category 3 — Medium Energy Density (eat small portions)
  - "whole-grain-bread"        # whole wheat, sourdough (1 slice portions)
  - "cheese"                   # 30g portions
  - "eggs"                     # whole eggs
  - "lean-red-meat"            # sirloin, round (85-120g, 1-2x/week)
  - "dark-meat-poultry"        # moderate portions

  # Category 4 — High Energy Density (eat sparingly, not banned)
  - "nuts"                     # 1 oz portions (nutrient-dense but high ED)
  - "seeds"                    # 1 oz portions
  - "olive-oil"                # by the teaspoon/tablespoon
  - "avocado"                  # moderate portions (borderline Cat 3-4)
  - "nut-butters"              # 1 tbsp portions
  - "dark-chocolate"           # small amounts
  - "dried-fruit"              # 1/4 cup portions

  # Flavoring
  - "herbs"                    # all varieties
  - "spices"                   # all varieties
  - "lemon-lime"               # as primary acid/flavoring
  - "vinegar"                  # all types (balsamic, apple cider, rice)
  - "garlic"

  # Beverages
  - "water"
  - "coffee"                   # unsweetened
  - "tea"                      # unsweetened
  - "broth"                    # clear broths
```

### Restricted Food Groups (Minimize)

```yaml
restricted_food_groups:
  - "fried-foods"            # very high ED — minimize
  - "fast-food"              # high ED, large portions
  - "ultra-processed-snacks" # chips, crackers, cookies
  - "cream-based-soups"      # much higher ED than broth-based
  - "caloric-beverages"      # soda, juice, sweetened coffee — liquid calories
  - "full-fat-dairy"         # prefer low-fat/non-fat versions
  - "processed-meat"         # sausages, bacon, deli meats
  - "refined-grains"         # white bread, white rice (prefer whole)
  - "refined-sugar"          # sweets, pastries, candy
  - "sugary-drinks"          # soda, juice with added sugar
  - "butter"                 # very high ED (7.2 cal/g)
  - "margarine"              # very high ED
```

### Moderate Food Groups (Portion-Controlled)

```yaml
moderate_food_groups:
  - "nuts": "1 oz (~28g) per day — nutrient-dense but very high energy density"
  - "seeds": "1 oz per day"
  - "olive-oil": "1-2 tbsp per day as dressing/flavoring (measured)"
  - "avocado": "¼–½ medium avocado per serving"
  - "cheese": "30g per serving, a few times per week"
  - "eggs": "1-2 per day"
  - "lean-red-meat": "85-120g, 1-2x per week"
  - "dark-chocolate": "1-2 squares (15-20g) occasionally"
  - "dried-fruit": "¼ cup per serving"
  - "whole-grain-bread": "1-2 slices per day"
  - "alcohol": "moderate only — liquid calories do not trigger satiety"
```

---

## Energy Density Categories (for Classifier)

```yaml
energy_density_categories:
  category_1:
    range: [0.0, 0.6]
    label: "Very Low Energy Density"
    guidance: "Eat freely — fill up on these"
    foods: ["non-starchy-vegetables", "most-fruits", "broth-based-soups", "skim-milk"]

  category_2:
    range: [0.6, 1.5]
    label: "Low Energy Density"
    guidance: "Eat moderate portions — anchor your meals"
    foods: ["whole-grains", "legumes", "lean-protein", "starchy-vegetables", "low-fat-dairy"]

  category_3:
    range: [1.5, 4.0]
    label: "Medium Energy Density"
    guidance: "Eat small portions — control quantity"
    foods: ["bread", "cheese", "eggs", "lean-red-meat", "dried-fruit"]

  category_4:
    range: [4.0, 9.0]
    label: "High Energy Density"
    guidance: "Eat sparingly — minimize and use as accents"
    foods: ["nuts", "seeds", "oils", "butter", "chips", "cookies", "candy", "fried-foods"]
```

---

## Macronutrient Targets

```yaml
macro_targets:
  carbs_pct: [50, 60]        # 50-60% of calories (emerges naturally)
  protein_pct: [15, 25]      # 15-25% of calories
  fat_pct: [20, 30]          # 20-30% of calories (naturally lower from low-ED emphasis)
  saturated_fat_pct: [0, 10] # <10% of calories
  fiber_g: [25, 40]          # 25-40g/day (high from produce + whole grains)
  sodium_mg: [0, 2300]       # <2300mg/day
  # Note: Macros are not prescribed — they emerge from the energy density framework
  prescribed: false
  # The diet is volume/satiety-based, not macro-based
  primary_principle: "energy_density"
```

---

## AI Prompt Instructions

```
VOLUMETRICS DIET RULES — Follow strictly:

1. ENERGY DENSITY AWARENESS: Classify all foods by energy density (cal/g). Bias the meal toward Category 1 (0-0.6 cal/g) and Category 2 (0.6-1.5 cal/g) foods. Use Category 3 (1.5-4 cal/g) foods in small portions. Minimize Category 4 (4-9 cal/g) foods.

2. SOUP STARTER: Begin lunch and dinner with a bowl of broth-based soup (vegetable, chicken, miso, minestrone). Do NOT use cream-based soups. This is the signature Volumetrics strategy.

3. VEGETABLE VOLUME: Every meal should feature a large volume of non-starchy vegetables. Aim for 5+ servings/day. Fill at least 50% of the plate with vegetables.

4. FRUIT AS DEFAULT: Fruit is the default dessert and snack. Berries, melon, apples, and citrus are preferred.

5. LEAN PROTEIN: Use lean protein sources (skinless chicken breast, turkey, white fish, legumes, egg whites, tofu, low-fat dairy). Limit fatty meats.

6. WHOLE GRAINS: Use whole grains (oatmeal, brown rice, quinoa, whole wheat pasta). Avoid refined grains.

7. HEALTHY FATS — PORTION CONTROLLED: Olive oil, nuts, seeds, and avocado are allowed but must be used in SMALL, MEASURED portions due to high energy density. Use 1 tbsp oil for dressing, 1 oz nuts as a snack. Do not pour freely.

8. NO CALORIC BEVERAGES: Avoid soda, juice, and sweetened coffee drinks. Water, unsweetened tea, and black coffee are the primary beverages.

9. SATIETY FOCUS: Meals should be designed to maximize volume and fullness. Add vegetables to everything (double the veg in any recipe). Incorporate water-rich foods.

10. NO FRIED FOODS: Avoid fried foods entirely. Use grilling, baking, roasting, steaming, or sautéing (minimal oil).

11. SALAD STARTER (alternative to soup): If soup is not used, begin the meal with a large, low-calorie salad (greens + vegetables + light vinaigrette — NO creamy dressings, minimal cheese).

12. WATER IN FOOD: Incorporate water into the food itself (soups, stews, water-rich fruits/vegetables). Do NOT simply recommend drinking a glass of water with the meal.
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    typical: "Oatmeal with berries; OR vegetable egg white scramble with fruit; OR low-fat yogurt with fruit; always include a large fruit portion"
    must_include: ["fruit (generous portion)", "whole grain OR lean protein", "Category 1 food"]
    avoid: ["pastries", "full-fat dairy", "fried eggs", "caloric beverages"]
    strategy: "Start with a large fruit portion"

  lunch:
    typical: "Bowl of broth-based soup followed by large salad with lean protein (chicken, fish, legumes) and whole grain"
    must_include: ["broth-based soup OR large salad as starter", "vegetables (multiple types)", "lean protein", "whole grain (optional)"]
    protein_preference: "skinless chicken breast, white fish, or legumes"
    starter: "broth-based soup (1 cup) — consume before main dish"
    avoid: ["cream-based soups", "fried foods", "calorie-dense dressings"]

  dinner:
    typical: "Broth-based soup starter, then lean protein with large portion of roasted/steamed vegetables and small portion of whole grain"
    must_include: ["broth-based soup OR salad as starter", "vegetables (large portion)", "lean protein"]
    protein_preference: "fish, chicken, turkey, tofu, or legumes"
    starter: "broth-based soup (1 cup) — consume before main dish"
    avoid: ["fried foods", "large portions of meat", "cream sauces"]

  snacks:
    typical: "Fresh fruit, raw vegetable sticks with hummus, air-popped popcorn, low-fat yogurt"
    avoid: ["chips", "cookies", "candy", "calorie-dense snacks", "caloric beverages"]
    strategy: "Default to fruit or vegetables; if using nuts, measure 1 oz"
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
    - high-protein
    - vegan
    - vegetarian
    - pescatarian

  adaptable_match:
    - keto: "Volumetrics emphasizes carbs (produce, grains) which conflicts with keto; however, the focus on non-starchy vegetables and lean protein is compatible — keto partner skips grains/fruit and adds healthy fats"
    - paleo: "Compatible on vegetables and lean protein; paleo partner skips grains and legumes; Volumetrics' produce emphasis is aligned"
    - low-fodmap: "Adapt — reduce high-FODMAP vegetables (onion, garlic, certain fruits); choose low-FODMAP produce within the energy density framework"

  hard_conflict:
    - hclf-811: "Different philosophies but can share a produce-heavy base meal; HCLF partner adds much more fruit and skips protein/animal foods"
    - carnivore: "Volumetrics is produce-centric; carnivore partner needs separate meals"
    - mcdougall: "Compatible on plant-food emphasis; McDougall allows cooked starches which fit Category 2; Volumetrics adds more produce and allows lean protein"
    - pritikin: "Very compatible — both are low-fat, high-produce; Pritikin is slightly more restrictive"
```

---

## Ingredient Classifier Reference

Key Volumetrics ingredients and their food group + energy density classification:

```yaml
classifier_mappings:
  # Category 1 — Very Low ED
  "broccoli": { food_group: "cruciferous", ed_category: 1 }
  "spinach": { food_group: "leafy-greens", ed_category: 1 }
  "kale": { food_group: "leafy-greens", ed_category: 1 }
  "cucumber": { food_group: "watery-vegetables", ed_category: 1 }
  "tomatoes": { food_group: "watery-vegetables", ed_category: 1 }
  "celery": { food_group: "watery-vegetables", ed_category: 1 }
  "zucchini": { food_group: "watery-vegetables", ed_category: 1 }
  "asparagus": { food_group: "non-starchy-vegetables", ed_category: 1 }
  "carrots": { food_group: "non-starchy-vegetables", ed_category: 1 }
  "bell peppers": { food_group: "peppers", ed_category: 1 }
  "mushrooms": { food_group: "mushrooms", ed_category: 1 }
  "watermelon": { food_group: "melons", ed_category: 1 }
  "strawberries": { food_group: "berries", ed_category: 1 }
  "cantaloupe": { food_group: "melons", ed_category: 1 }
  "oranges": { food_group: "citrus", ed_category: 1 }
  "peaches": { food_group: "stone-fruit", ed_category: 1 }
  "apples": { food_group: "pome-fruit", ed_category: 1 }
  "vegetable soup": { food_group: "broth-based-soups", ed_category: 1 }
  "minestrone": { food_group: "broth-based-soups", ed_category: 1 }
  "miso soup": { food_group: "broth-based-soups", ed_category: 1 }
  "chicken broth": { food_group: "broth-based-soups", ed_category: 1 }

  # Category 2 — Low ED
  "oatmeal": { food_group: "whole-grains", ed_category: 2 }
  "brown rice": { food_group: "whole-grains", ed_category: 2 }
  "quinoa": { food_group: "whole-grains", ed_category: 2 }
  "barley": { food_group: "whole-grains", ed_category: 2 }
  "whole wheat pasta": { food_group: "pasta-whole-grain", ed_category: 2 }
  "lentils": { food_group: "legumes", ed_category: 2 }
  "black beans": { food_group: "legumes", ed_category: 2 }
  "chickpeas": { food_group: "legumes", ed_category: 2 }
  "chicken breast": { food_group: "lean-protein", ed_category: 2 }
  "turkey breast": { food_group: "lean-protein", ed_category: 2 }
  "cod": { food_group: "fish-lean", ed_category: 2 }
  "tilapia": { food_group: "fish-lean", ed_category: 2 }
  "shrimp": { food_group: "lean-protein", ed_category: 2 }
  "egg whites": { food_group: "egg-whites", ed_category: 1 }
  "tofu": { food_group: "tofu", ed_category: 2 }
  "low-fat yogurt": { food_group: "low-fat-dairy", ed_category: 2 }
  "cottage cheese": { food_group: "low-fat-dairy", ed_category: 2 }
  "sweet potato": { food_group: "starchy-vegetables", ed_category: 2 }
  "potato": { food_group: "starchy-vegetables", ed_category: 2 }

  # Category 3 — Medium ED
  "whole wheat bread": { food_group: "whole-grain-bread", ed_category: 3 }
  "cheese": { food_group: "cheese", ed_category: 3 }
  "eggs": { food_group: "eggs", ed_category: 3 }
  "lean beef": { food_group: "lean-red-meat", ed_category: 3 }
  "dark meat chicken": { food_group: "dark-meat-poultry", ed_category: 3 }
  "dried apricots": { food_group: "dried-fruit", ed_category: 3 }

  # Category 4 — High ED (allowed but sparingly)
  "almonds": { food_group: "nuts", ed_category: 4, max_portion: "1 oz" }
  "walnuts": { food_group: "nuts", ed_category: 4, max_portion: "1 oz" }
  "olive oil": { food_group: "olive-oil", ed_category: 4, max_portion: "1 tbsp" }
  "avocado": { food_group: "avocado", ed_category: 4, max_portion: "1/2 medium" }
  "peanut butter": { food_group: "nut-butters", ed_category: 4, max_portion: "1 tbsp" }
  "dark chocolate": { food_group: "dark-chocolate", ed_category: 4, max_portion: "20g" }
  "butter": { food_group: "butter", ed_category: 4, restricted: true }
  "chips": { food_group: "ultra-processed-snacks", ed_category: 4, restricted: true }
  "cookies": { food_group: "ultra-processed-snacks", ed_category: 4, restricted: true }
```

---

## Implementation Checklist

- [ ] Add `volumetrics` to the `DietKey` union type
- [ ] Add Volumetrics definition to `DIETS` record in `diets.ts`
- [ ] Add Volumetrics to the categorized diet picker in `ProfilesTab.tsx`
- [ ] Inject Volumetrics AI prompt instructions in `buildPrompt()`
- [ ] Add Volumetrics food-group rules to `assertMealCompliesWithDiet()`
- [ ] Add energy density category metadata to the food classifier
- [ ] Add classifier mappings for Volumetrics-specific ingredients (with ED categories)
- [ ] Implement energy density-based portion guidance in meal display
- [ ] Add soup-starter rule to meal generation (auto-suggest broth-based soup for lunch/dinner)
- [ ] Update seed data with a Volumetrics diet test user
- [ ] Add couple compatibility rules for Volumetrics + other diets

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
