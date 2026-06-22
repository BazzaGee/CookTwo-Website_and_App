# DASH Diet — App Encoding Spec

> Machine-readable specification for integrating the DASH diet into Cupla's AI meal generation system. This file is designed for direct implementation by developers.

---

## Diet Metadata

```yaml
diet_key: "dash"
display_label: "DASH"
category: "therapeutic"
emoji: "❤️"
short_description: "NIH-designed diet to lower blood pressure — high potassium, low sodium"
evidence_grade: "A"
restrictiveness: 2  # 1-5 scale
sodium_restriction: "low"  # 1500-2300mg
```

---

## Food Group Rules

### Allowed Food Groups (Core Ingredients)

```yaml
allowed_food_groups:
  # Vegetables (all types — 4-5 servings/day)
  - "leafy-greens"          # spinach, kale, collard greens, chard, romaine
  - "tomatoes"              # all forms (fresh, low-sodium canned/sauce)
  - "alliums"               # onion, garlic, leeks
  - "cruciferous"           # broccoli, cauliflower, cabbage, Brussels sprouts
  - "peppers"               # bell peppers, chili peppers
  - "root-vegetables"       # carrots, beets, sweet potatoes
  - "squash-eggplant"       # zucchini, eggplant, yellow squash
  - "green-beans-peas"      # fresh or frozen (low-sodium canned if rinsed)
  - "cucumbers"

  # Fruits (all types — 4-5 servings/day)
  - "citrus"                # oranges, grapefruit, lemons
  - "berries"               # strawberries, blueberries, raspberries
  - "bananas"               # especially high potassium
  - "pome-fruit"            # apples, pears
  - "stone-fruit"           # peaches, plums, nectarines
  - "melons"                # watermelon, cantaloupe, honeydew
  - "grapes-cherries"
  - "dried-fruit"           # small portions (apricots, raisins, prunes — potassium-rich)

  # Dairy (fat-free or low-fat — 2-3 servings/day)
  - "low-fat-milk"          # fat-free or 1%
  - "low-fat-yogurt"        # plain, fat-free or low-fat
  - "low-fat-cheese"        # part-skim mozzarella, reduced-fat cheddar (1.5 oz)
  - "low-fat-cottage-cheese" # fat-free

  # Grains (whole preferred — 6-8 servings/day)
  - "whole-grains"          # 100% whole wheat bread, brown rice, oats, quinoa, barley, farro
  - "whole-grain-pasta"     # whole wheat pasta
  - "whole-grain-cereal"    # low-sugar, high-fiber
  - "whole-grain-crackers"  # low-sodium

  # Proteins (lean — ≤6 servings/day)
  - "poultry-skinless"      # chicken breast, turkey breast
  - "fish-fatty"            # salmon, mackerel, sardines, herring
  - "fish-lean"             # cod, halibut, tilapia, flounder
  - "eggs"                  # limit yolks to 4/week; egg whites unlimited
  - "legumes"               # lentils, chickpeas, beans (dried or low-sodium canned)
  - "tofu"                  # low-sodium varieties

  # Nuts, Seeds (4-5 servings/week — UNSALTED)
  - "nuts-unsalted"         # almonds, walnuts, pistachios, mixed nuts
  - "seeds-unsalted"        # sunflower, pumpkin, flax, chia
  - "nut-butters"           # natural, no salt added

  # Fats (2-3 servings/day)
  - "olive-oil"             # moderate amounts
  - "canola-oil"
  - "soft-margarine"        # trans-fat-free tub margarine
  - "avocado"
  - "light-mayonnaise"

  # Flavoring (liberal — replace salt)
  - "herbs"                 # basil, oregano, rosemary, thyme, sage, parsley, dill, cilantro
  - "spices"                # black pepper, paprika, cumin, turmeric, cinnamon, ginger
  - "lemon-lime"            # as primary acid/flavoring
  - "vinegar"               # all types (balsamic, apple cider, rice, white)
  - "garlic"
  - "no-salt-blends"        # Mrs. Dash, etc.

  # Beverages
  - "water"
  - "sparkling-water"
  - "coffee"                # unsweetened
  - "tea"                   # unsweetened
```

### Restricted Food Groups (Minimize or Avoid)

```yaml
restricted_food_groups:
  - "high-sodium-foods"     # restaurant meals, canned soups, frozen dinners — AVOID
  - "processed-meat"        # sausage, bacon, hot dogs, deli meats, salami — AVOID (extreme sodium)
  - "salt"                  # table salt, sea salt, kosher salt — minimize
  - "soy-sauce"             # extreme sodium (use low-sodium sparingly or coconut aminos)
  - "red-meat"              # limit to small portions occasionally (saturated fat + sodium in prep)
  - "full-fat-dairy"        # whole milk, cream, butter, regular cheese
  - "fried-food"            # high in saturated/trans fat and sodium
  - "salty-snacks"          # potato chips, pretzels, salted crackers, salted nuts
  - "refined-grains"        # white bread, white rice, regular pasta (prefer whole)
  - "sugary-drinks"         # soda, juice drinks, sweetened coffee
  - "refined-sugar"         # sweets, pastries, candy — minimize
  - "fast-food"             # AVOID
  - "ultra-processed-food"  # AVOID
  - "pickled-foods"         # extremely high sodium (pickles, sauerkraut, olives)
  - "bouillon-broth"        # extremely high sodium (use low-sodium versions)
```

### Moderate Food Groups

```yaml
moderate_food_groups:
  - "sweets": "≤5 servings/week — fruit gelatin, sorbet, small portions"
  - "red-meat": "small portions (3 oz) occasionally — not daily"
  - "eggs-yolks": "≤4 per week (egg whites unlimited)"
  - "fats-oils": "2-3 servings/day (1 tsp each)"
  - "whole-grains": "6-8 servings/day (portion-controlled)"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  carbs_pct: [50, 60]          # ~55% of calories
  protein_pct: [15, 20]        # ~18% of calories
  fat_pct: [20, 30]            # ~27% of calories
  saturated_fat_pct: [0, 6]    # ≤6% of calories
  cholesterol_mg: [0, 150]     # ≤150mg/day
  fiber_g: [25, 35]            # ~30g/day
  sodium_mg: [0, 2300]         # ≤2300mg (target: ≤1500mg)
  potassium_mg: [4000, 5000]   # ~4700mg/day
  calcium_mg: [1000, 1500]     # ~1250mg/day
  magnesium_mg: [400, 600]     # ~500mg/day
```

---

## AI Prompt Instructions

```
DASH DIET RULES — Follow strictly:

1. SODIUM: All meals must be designed to keep total daily sodium ≤2,300mg (target: ≤1,500mg). Do NOT add salt in cooking or at the table. Use herbs, spices, citrus juice, vinegar, and no-salt seasoning blends instead.

2. VEGETABLES: Aim for 4–5 servings of vegetables per day across meals. Use a colorful variety (leafy greens, tomatoes, broccoli, carrots, peppers, sweet potatoes).

3. FRUITS: Aim for 4–5 servings of fruit per day. Include potassium-rich fruits (bananas, oranges, cantaloupe) prominently.

4. DAIRY: Include 2–3 servings of fat-free or low-fat dairy per day (milk, plain yogurt, low-fat cheese). This is essential for calcium and BP-lowering.

5. WHOLE GRAINS: Use only whole grains (100% whole wheat bread, brown rice, oats, quinoa, barley). Avoid white/refined grains. Aim for 6–8 servings/day.

6. SODIUM IN PROCESSED FOODS: Do NOT use processed meats (deli meat, sausage, bacon, hot dogs). Avoid restaurant/ultra-processed foods. Use only "no salt added" or "low sodium" canned goods.

7. LEAN PROTEINS: Use skinless poultry, fish, eggs (whites preferred), legumes, and tofu. Fish 2–3 times per week.

8. NUTS AND SEEDS: Include unsalted nuts, seeds, or legumes 4–5 times per week. Always UNSALTED.

9. RED MEAT: Limit red meat to small portions (3 oz) occasionally — not daily.

10. FATS: Use small amounts of olive oil, canola oil, or soft tub margarine (trans-fat-free). Avoid butter and solid fats.

11. SWEETS: Limit to ≤5 small servings per week. Default dessert is fresh fruit.

12. FLAVOR: Season with herbs, spices, garlic, lemon/lime juice, vinegar, and no-salt blends — never with salt or high-sodium condiments.

13. SODIUM-SPECIFIC RULES:
    - Do NOT use soy sauce (use coconut aminos or low-sodium soy sparingly)
    - Do NOT use bouillon cubes or regular broth (use low-sodium broth)
    - Do NOT use pickles or pickled vegetables
    - Rinse any canned beans or vegetables before using
    - Check bread sodium — choose varieties with ≤150mg per slice
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    typical: "Oatmeal with fruit and nuts + low-fat milk/yogurt; OR whole grain toast with nut butter and fruit; OR low-fat yogurt parfait with berries"
    must_include: ["whole grain", "fruit", "low-fat dairy"]
    avoid: ["processed cereal (high sugar)", "pastries", "bacon/sausage", "salted foods"]

  lunch:
    typical: "Large salad with vegetables, lean protein (chicken/fish/legumes), olive oil-lemon dressing, whole grain bread, fruit"
    must_include: ["vegetables (multiple types)", "lean protein", "fruit"]
    protein_preference: "chicken, turkey, fish, legumes"
    avoid: ["deli meats", "high-sodium condiments", "salted snacks", "restaurant/fast food"]

  dinner:
    typical: "Baked/grilled fish or poultry with roasted vegetables and brown rice/quinoa"
    must_include: ["vegetables", "lean protein", "whole grain"]
    protein_preference: "fish (especially fatty fish 2-3x/week), skinless poultry"
    avoid: ["red meat (unless occasional small portion)", "fried foods", "salt seasoning"]

  snacks:
    typical: "Fresh fruit, unsalted nuts, raw vegetables with hummus (low-sodium), low-fat yogurt, unsalted rice cakes"
    avoid: ["chips", "pretzels", "salted nuts", "candy", "processed snacks"]
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - mediterranean
    - mind
    - flexitarian
    - volumetrics
    - high-protein
    - plant-based

  adaptable_match:
    - vegan: "Make meals plant-based; use fortified plant milk for dairy component; ensure adequate calcium/potassium from vegetables"
    - vegetarian: "Same base meal; add lean poultry/fish only for non-vegetarian partner"
    - pescatarian: "Nearly identical — DASH already emphasizes fish"
    - keto: "Focus on the fish + vegetables + olive oil components; replace grains with extra non-starchy vegetables for keto partner; may conflict with DASH's high-carb whole grains"
    - paleo: "Focus on lean meat/poultry/fish + vegetables + nuts; skip grains and dairy for paleo partner"
    - low-fodmap: "Adapt — reduce garlic/onion (use garlic-infused oil), choose low-FODMAP vegetables, moderate legumes"

  hard_conflict:
    - carnivore: "Very difficult — DASH is plant-forward with specific produce/dairy targets; suggest separate meals with shared lean protein"
    - mcdougall: "Partial overlap (both high-carb, plant-forward) but DASH includes dairy and lean meat which McDougall restricts"
    - pritikin: "Broadly compatible (both low-fat, low-sodium) — Pritikin is even more restrictive; easy adaptation"
```

---

## Ingredient Classifier Reference

Key DASH ingredients and their food group classification for the safety guard:

```yaml
classifier_mappings:
  # Proteins
  "salmon": "fish-fatty"
  "sardines": "fish-fatty"
  "mackerel": "fish-fatty"
  "tuna": "fish-fatty"
  "cod": "fish-lean"
  "halibut": "fish-lean"
  "tilapia": "fish-lean"
  "chicken breast": "poultry-skinless"
  "turkey breast": "poultry-skinless"
  "turkey": "poultry-skinless"
  "beef": "red-meat"
  "pork": "red-meat"
  "lamb": "red-meat"
  "bacon": "processed-meat"
  "sausage": "processed-meat"
  "ham": "processed-meat"
  "deli meat": "processed-meat"
  "hot dog": "processed-meat"
  "lentils": "legumes"
  "chickpeas": "legumes"
  "black beans": "legumes"
  "tofu": "tofu"
  "egg whites": "eggs"
  "egg": "eggs"

  # Grains
  "brown rice": "whole-grains"
  "quinoa": "whole-grains"
  "oats": "whole-grains"
  "steel-cut oats": "whole-grains"
  "barley": "whole-grains"
  "farro": "whole-grains"
  "100% whole wheat bread": "whole-grains"
  "whole wheat pasta": "whole-grain-pasta"
  "white rice": "refined-grains"
  "white bread": "refined-grains"

  # Dairy
  "fat-free milk": "low-fat-milk"
  "1% milk": "low-fat-milk"
  "skim milk": "low-fat-milk"
  "plain greek yogurt": "low-fat-yogurt"
  "low-fat yogurt": "low-fat-yogurt"
  "part-skim mozzarella": "low-fat-cheese"
  "cottage cheese": "low-fat-cottage-cheese"
  "whole milk": "full-fat-dairy"
  "cream": "full-fat-dairy"
  "butter": "full-fat-dairy"

  # Fats
  "olive oil": "olive-oil"
  "canola oil": "canola-oil"
  "avocado": "avocado"

  # Nuts/Seeds (MUST be unsalted)
  "almonds": "nuts-unsalted"
  "walnuts": "nuts-unsalted"
  "pistachios": "nuts-unsalted"
  "sunflower seeds": "seeds-unsalted"
  "peanut butter": "nut-butters"

  # High-Sodium Triggers (RESTRICT)
  "table salt": "salt"
  "sea salt": "salt"
  "kosher salt": "salt"
  "soy sauce": "soy-sauce"
  "pickles": "pickled-foods"
  "bouillon": "bouillon-broth"

  # Flavoring
  "lemon juice": "lemon-lime"
  "lime juice": "lemon-lime"
  "balsamic vinegar": "vinegar"
  "apple cider vinegar": "vinegar"
  "garlic": "garlic"
```

---

## Implementation Checklist

- [ ] Add `dash` to the `DietKey` union type
- [ ] Add DASH definition to `DIETS` record in `diets.ts`
- [ ] Add DASH to the categorized diet picker in `ProfilesTab.tsx`
- [ ] Inject DASH AI prompt instructions in `buildPrompt()`
- [ ] Add DASH food-group rules to `assertMealCompliesWithDiet()`
- [ ] Add **sodium guard** — flag any ingredient with sodium > threshold
- [ ] Add classifier mappings for DASH-specific ingredients
- [ ] Add **potassium tracking** — display daily potassium totals
- [ ] Add **calcium tracking** — display daily calcium from dairy sources
- [ ] Update seed data with a DASH diet test user
- [ ] Add couple compatibility rules for DASH + other diets
- [ ] Add **low-sodium label scanner** integration (flag high-sodium packaged foods)

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
