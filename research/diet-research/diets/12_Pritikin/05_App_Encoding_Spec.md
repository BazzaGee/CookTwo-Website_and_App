# Pritikin Diet — App Encoding Spec

> Machine-readable specification for integrating the Pritikin Diet into Cupla's AI meal generation system. This file is designed for direct implementation by developers.

---

## Diet Metadata

```yaml
diet_key: "pritikin"
display_label: "Pritikin"
category: "therapeutic"
emoji: "💚"
short_description: "Very low-fat (<10%), high complex carb — designed to reverse heart disease"
evidence_grade: "B-C"
restrictiveness: 5  # 1-5 scale (very high)
sodium_restriction: "low"  # <1500mg/day
fat_restriction: "very-low"  # <10% of calories
exercise_required: true
```

---

## Food Group Rules

### Allowed Food Groups (Core Ingredients)

```yaml
allowed_food_groups:
  # Vegetables (ALL types — unlimited)
  - "leafy-greens"          # spinach, kale, collards, chard, romaine, arugula
  - "cruciferous"           # broccoli, cauliflower, cabbage, brussels sprouts, bok choy
  - "alliums"               # onion, garlic, leeks, shallots
  - "peppers"               # bell peppers, chili peppers
  - "root-vegetables"       # carrots, beets, turnips, parsnips
  - "nightshades"           # eggplant, tomatillos
  - "cucurbit-vegetables"   # zucchini, summer squash, cucumber
  - "winter-squash"         # butternut, acorn, spaghetti squash
  - "tomatoes"              # all forms (no added salt/sugar)
  - "asparagus"
  - "green-beans"
  - "mushrooms"
  - "artichokes"
  - "celery"
  - "fennel"

  # Fruits (ALL whole fruits — unlimited)
  - "berries"               # strawberries, blueberries, raspberries, blackberries
  - "citrus"                # oranges, grapefruit, lemons, limes
  - "stone-fruit"           # peaches, plums, nectarines, apricots, cherries
  - "tropical"              # bananas, pineapple, mango, papaya, kiwi
  - "melons"                # watermelon, cantaloupe, honeydew
  - "pome-fruit"            # apples, pears
  - "grapes"
  - "dried-fruit-unsweetened"  # no added sugar or oil

  # Whole Grains (all unrefined)
  - "whole-grains"          # brown rice, oats, barley, bulgur, quinoa, millet, buckwheat
  - "whole-wheat"           # whole wheat bread (no added fat), whole wheat pasta
  - "corn-whole"            # corn on cob, cornmeal/polenta, air-popped popcorn
  - "whole-grain-cereal"    # 100% whole grain, no added sugar/fat

  # Legumes (daily)
  - "legumes"               # lentils, chickpeas, all beans, split peas
  - "soy-lean"              # tofu (non-fried), tempeh (plain), edamame

  # Starchy Vegetables
  - "potatoes"              # white and sweet — boiled/baked (NOT fried)
  - "winter-squash-starchy" # butternut, acorn as starch source

  # Flavoring
  - "herbs"                 # all — unlimited use
  - "spices"                # all — unlimited use
  - "garlic"                # unlimited
  - "onion"                 # unlimited
  - "lemon-lime"            # juice/zest — primary acid
  - "vinegar-all"           # all types — critical for fat-free flavor
  - "mustard-no-fat"        # plain, no oil added
  - "salsa"                 # fresh, no oil
  - "tomato-sauce-no-fat"   # no added oil
  - "nutritional-yeast"     # cheese flavor substitute

  # Beverages
  - "water"
  - "coffee"                # black only
  - "tea"                   # all types, unsweetened
  - "sparkling-water"
  - "fruit-juice-100"       # limit 4 oz/day
```

### Restricted Food Groups (Avoid Entirely)

```yaml
restricted_food_groups:
  # ALL Added Fats and Oils
  - "all-oils"              # olive, canola, coconut, vegetable, sesame — ALL oils
  - "butter"
  - "ghee"
  - "margarine"
  - "lard-tallow"
  - "shortening"
  - "mayonnaise"
  - "salad-dressing-oil"    # oil-based dressings
  - "pesto"
  - "nut-butters"           # peanut butter, almond butter — all

  # High-Fat Plant Foods
  - "nuts"                  # ALL nuts (almonds, walnuts, cashews, etc.)
  - "seeds"                 # sunflower, pumpkin, sesame (ground flaxseed exception below)
  - "avocado"
  - "coconut"               # fresh, dried, milk, oil
  - "olives"
  - "dark-chocolate"

  # Fatty Meats and Animal Fat
  - "red-meat"              # beef, pork, lamb — ALL
  - "processed-meat"        # sausage, bacon, deli meat, hot dogs
  - "dark-poultry"          # chicken/turkey dark meat, skin
  - "organ-meats"
  - "duck-goose"

  # Eggs and Dairy
  - "whole-eggs"            # egg yolks (egg whites OK)
  - "full-fat-dairy"        # whole milk, cheese, cream, ice cream, yogurt
  - "butter-dairy"
  - "low-fat-dairy"         # even low-fat dairy is excluded

  # Refined Carbohydrates
  - "refined-grains"        # white flour, white bread, white rice, regular pasta
  - "refined-sugar"         # table sugar, candy, pastries, desserts
  - "sugary-drinks"         # soda, sports drinks, sweetened juice
  - "syrups"                # corn syrup, maple syrup, honey, agave

  # Processed Foods
  - "fast-food"
  - "frozen-meals"          # most commercial frozen meals
  - "snack-foods"           # chips, crackers, pretzels (added fat)
  - "baked-goods"           # fat + sugar + refined flour
  - "ultra-processed-food"
```

### Moderate Food Groups (Limited Portions)

```yaml
moderate_food_groups:
  - "lean-fish": "up to 3.5 oz (100g) per serving, max 4 servings/week — cod, flounder, sole, halibut"
  - "shellfish": "up to 3.5 oz (100g), occasionally — shrimp, scallops, crab"
  - "lean-poultry": "skinless chicken or turkey breast, up to 3.5 oz, max 2-3 servings/week"
  - "egg-whites": "2 whites, occasionally (whole eggs excluded)"
  - "ground-flaxseed": "1 tbsp/day for omega-3 (ALA) — exception to seed restriction"
  - "fruit-juice-100": "max 4 oz/day — 100% juice only"
  - "alcohol": "minimize or avoid — no more than 1 drink/week"
  - "salt": "minimize to <1,500 mg sodium/day total"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  carbs_pct: [70, 80]       # 70-80% of calories — complex, unrefined only
  protein_pct: [10, 15]     # 10-15% of calories
  fat_pct: [5, 10]          # 5-10% of calories — extremely low
  saturated_fat_pct: [0, 3] # <3% — near zero
  cholesterol_mg: [0, 100]  # <100mg/day
  fiber_g: [35, 45]         # 35-45g/day — very high
  sodium_mg: [0, 1500]      # <1500mg/day
```

---

## AI Prompt Instructions

```
PRITIKIN DIET RULES — Follow strictly:

1. NO ADDED FAT: Do NOT use ANY oil, butter, margarine, lard, or any added fat in cooking or as a garnish. This includes olive oil, coconut oil, and all "healthy" oils. This is the single most important rule.

2. COOKING METHOD: Sauté vegetables using the "water sauté" technique — use small amounts of water, vegetable broth, or wine instead of oil. Steam, boil, bake, or roast vegetables. Use parchment paper or silicone mats for baking (no oil spray).

3. VEGETABLES: Feature vegetables prominently and abundantly in every meal. Aim for 7+ servings/day. All vegetables are allowed in unlimited quantities.

4. WHOLE GRAINS: Use only whole, unrefined grains — brown rice, oats, quinoa, barley, bulgur, whole wheat. NEVER use white rice, white flour, or regular (white) pasta.

5. LEGUMES: Include legumes (beans, lentils, chickpeas) daily. They are a primary protein source.

6. FRUITS: All whole fruits are allowed freely. Use fruits as natural sweeteners.

7. NO HIGH-FAT PLANT FOODS: Do NOT include nuts, seeds, avocado, coconut, or olives. Ground flaxseed (1 tbsp/day) is the ONLY seed exception.

8. ANIMAL PROTEIN: Very limited. Use lean white fish (cod, flounder, halibut) — max 3.5 oz/serving, up to 4x/week. Skinless chicken/turkey breast — max 3.5 oz, up to 2-3x/week. NO red meat, NO processed meat, NO dark poultry.

9. NO EGGS (whole): Egg whites only, occasionally. No whole eggs or egg yolks.

10. NO DAIRY: No milk, cheese, cream, yogurt, ice cream, or butter of any fat content.

11. NO REFINED SUGAR: No table sugar, honey, maple syrup, agave, corn syrup, candy, or desserts. Sweeten with whole fruits only.

12. FLAVOR WITHOUT FAT: Use herbs, spices, garlic, onion, lemon juice, lime juice, vinegar (all types), mustard (no oil), salsa, and nutritional yeast for flavor. These are critical for making fat-free food palatable.

13. SODIUM: Minimize added salt. Aim for <1,500mg sodium/day. Use herbs and spices instead of salt.

14. DESSERT: Default dessert is fresh fruit. No sweetened baked goods.

15. BEVERAGES: Water, black coffee, unsweetened tea. Limit 100% fruit juice to 4 oz/day. Minimize or avoid alcohol.

16. EXERCISE: Note in meal plans that the Pritikin Program includes 30+ minutes of daily aerobic exercise.
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    typical: "Large bowl of oatmeal with fruit and cinnamon; OR whole grain cereal with fruit; OR whole grain pancakes (no oil/butter) with fruit compote"
    must_include: ["whole grain", "fruit"]
    avoid: ["any added fat", "eggs (whole)", "dairy", "bacon/sausage", "butter", "refined sugar"]

  lunch:
    typical: "Large vegetable-forward meal: big salad with legumes and vinegar dressing, whole grain on the side; OR bean/vegetable soup with whole grain bread"
    must_include: ["vegetables (multiple types)", "legumes OR grain", "fiber"]
    protein_preference: "legumes, or occasionally lean fish/chicken (3.5 oz max)"
    avoid: ["any oil in dressing", "cheese", "mayonnaise", "white bread", "fatty meats"]

  dinner:
    typical: "Steamed/baked lean fish or tofu (small portion) OR bean-based main dish, large serving of vegetables, starchy vegetable or whole grain"
    must_include: ["vegetables (generous)", "protein source", "complex carbohydrate"]
    protein_preference: "legumes, tofu, tempeh, or lean fish/poultry (3.5 oz max)"
    avoid: ["any cooking oil", "red meat", "full-fat anything", "white rice/pasta"]

  snacks:
    typical: "Fresh fruit, raw vegetables with salsa, air-popped popcorn (no butter/oil), whole grain crackers (no added fat)"
    avoid: ["nuts", "cheese", "chips", "candy", "any fat-containing snack"]
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - ornish
    - esselstyn
    - mcdougall
    - vegan

  adaptable_match:
    - vegetarian: "Pritikin already allows limited animal protein; simply add a dairy/egg option for the vegetarian partner's plate if they consume it"
    - dash: "Some overlap — both are high in vegetables/fruits and low in sodium. DASH allows moderate fat; modify to accommodate both"
    - flexitarian: "Flexitarian is more flexible; Pritikin partner removes oils/fats, flexitarian partner adds moderate fat/protein to their plate"
    - whole30: "Difficult — Whole30 requires fat and allows meat; Pritikin eliminates both. Very difficult to find common ground"

  hard_conflict:
    - keto: "Directly OPPOSITE philosophy — keto is 60-75% fat; Pritikin is <10% fat. Completely incompatible. Suggest completely separate meals."
    - carnivore: "Directly opposite — carnivore is all animal foods; Pritikin is nearly all plant foods. Completely incompatible."
    - mediterranean: "Opposite fat philosophy — Mediterranean is 30-40% fat with liberal olive oil; Pritikin is <10% fat. Very difficult; suggest separate meals."
    - paleo: "Difficult — paleo emphasizes meat, fat, and excludes grains/legumes; Pritikin is opposite. Suggest separate meals."
    - atkins: "Opposite macronutrient philosophy. Completely incompatible."
```

---

## Ingredient Classifier Reference

```yaml
classifier_mappings:
  # Proteins
  "cod": "lean-fish"
  "flounder": "lean-fish"
  "halibut": "lean-fish"
  "sole": "lean-fish"
  "salmon": "fatty-fish-restricted"  # NOT allowed (too much fat)
  "mackerel": "fatty-fish-restricted"
  "shrimp": "shellfish"
  "scallops": "shellfish"
  "chicken breast": "lean-poultry"
  "turkey breast": "lean-poultry"
  "beef": "red-meat"          # restricted
  "pork": "red-meat"          # restricted
  "lamb": "red-meat"          # restricted
  "bacon": "processed-meat"   # restricted
  "sausage": "processed-meat" # restricted
  "eggs": "whole-eggs"        # restricted (whites OK)
  "egg whites": "allowed"     # moderate
  "tofu": "soy-lean"
  "tempeh": "soy-lean"
  "lentils": "legumes"
  "chickpeas": "legumes"
  "black beans": "legumes"
  "milk": "full-fat-dairy"    # restricted
  "cheese": "full-fat-dairy"  # restricted
  "greek yogurt": "full-fat-dairy"  # restricted

  # Grains
  "brown rice": "whole-grains"
  "quinoa": "whole-grains"
  "oats": "whole-grains"
  "barley": "whole-grains"
  "whole wheat bread": "whole-wheat"
  "whole wheat pasta": "whole-wheat"
  "white rice": "refined-grains"    # restricted
  "white bread": "refined-grains"   # restricted
  "regular pasta": "refined-grains" # restricted

  # Fats (ALL restricted)
  "olive oil": "all-oils"           # restricted
  "extra virgin olive oil": "all-oils"  # restricted
  "coconut oil": "all-oils"         # restricted
  "butter": "butter"                # restricted
  "margarine": "margarine"          # restricted

  # High-fat plant foods (restricted)
  "almonds": "nuts"                 # restricted
  "walnuts": "nuts"                 # restricted
  "avocado": "avocado"              # restricted
  "coconut": "coconut"              # restricted
  "olives": "olives"                # restricted
  "peanut butter": "nut-butters"    # restricted

  # Vegetables (all allowed)
  "spinach": "leafy-greens"
  "kale": "leafy-greens"
  "broccoli": "cruciferous"
  "onion": "alliums"
  "garlic": "alliums"
  "bell pepper": "peppers"
  "carrots": "root-vegetables"
  "tomatoes": "tomatoes"
  "potatoes": "potatoes"

  # Fruits (all allowed)
  "bananas": "tropical"
  "blueberries": "berries"
  "oranges": "citrus"
  "apples": "pome-fruit"

  # Sweeteners
  "honey": "syrups"                 # restricted
  "maple syrup": "syrups"           # restricted
  "sugar": "refined-sugar"          # restricted
```

---

## Pritikin Calorie Density Ranking

```yaml
calorie_density_tiers:
  tier_1_unlimited:
    range: "0-0.6 cal/g"
    foods: ["most vegetables", "broth-based soups", "most fruits"]
    instruction: "Eat freely and abundantly"

  tier_2_generous:
    range: "0.6-1.5 cal/g"
    foods: ["whole grains (cooked)", "potatoes", "beans", "lentils", "corn", "oatmeal"]
    instruction: "Eat generous portions — these form the calorie base"

  tier_3_moderate:
    range: "1.5-3.0 cal/g"
    foods: ["bread", "dried fruit", "pasta", "lean fish", "lean poultry"]
    instruction: "Eat with awareness of portions"

  tier_4_minimize:
    range: "3.0-9.0 cal/g"
    foods: ["cheese", "meat", "nuts", "seeds"]
    instruction: "Avoid or strictly minimize"

  tier_5_avoid:
    range: "9.0+ cal/g"
    foods: ["oils", "butter", "all pure fats"]
    instruction: "Avoid entirely"
```

---

## Implementation Checklist

- [ ] Add `pritikin` to the `DietKey` union type
- [ ] Add Pritikin definition to `DIETS` record in `diets.ts`
- [ ] Add Pritikin to the categorized diet picker in `ProfilesTab.tsx`
- [ ] Inject Pritikin AI prompt instructions in `buildPrompt()`
- [ ] Add Pritikin food-group rules to `assertMealCompliesWithDiet()` — especially ALL oils and fats
- [ ] Add fat ingredient blacklist (ALL oils, butter, nuts, seeds, avocado, dairy, fatty meats)
- [ ] Add water-sauté / fat-free cooking method instructions
- [ ] Add lean protein portion limits (3.5 oz max per serving, weekly caps)
- [ ] Add calorie density classification system for ingredient ranking
- [ ] Add classifier mappings for Pritikin-specific ingredients
- [ ] Add macro target validation (fat_pct < 10%)
- [ ] Add sodium target (<1,500 mg/day)
- [ ] Add B12, vitamin D, omega-3 supplementation reminder
- [ ] Add exercise component reminder (30+ min/day aerobic)
- [ ] Update seed data with a Pritikin diet test user
- [ ] Add couple compatibility rules for Pritikin + other diets (hard conflicts with keto, carnivore, Mediterranean)
- [ ] Add medical disclaimer (therapeutic diet for cardiovascular disease/diabetes — medical supervision recommended)

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
