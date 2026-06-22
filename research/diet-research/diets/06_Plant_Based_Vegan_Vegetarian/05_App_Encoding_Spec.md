# Plant-Based / Vegan / Vegetarian Diet — App Encoding Spec

> Machine-readable specification for integrating plant-based, vegan, and vegetarian diets into Cupla's AI meal generation system. This file is designed for direct implementation by developers.

---

## Diet Metadata

```yaml
diet_key: "plant-based"
display_label: "Plant-Based / Vegan / Vegetarian"
category: "plant-based"
emoji: "🌱"
short_description: "Predominantly plant foods — proven for heart health, diabetes prevention, and longevity"
evidence_grade: "B"
restrictiveness: 3  # 1-5 scale (varies by sub-type; vegan=4, vegetarian=2-3, WFPB=3-4)
sodium_restriction: "moderate"

# Related diet_keys covering the family
related_diet_keys:
  - "vegetarian"     # lacto-ovo: no meat/fish/poultry; eggs + dairy allowed
  - "vegan"          # no animal products whatsoever
  - "plant-based"    # predominantly plants, flexible; this is the primary key

sub_type_aliases:
  lacto_ovo_vegetarian:
    label: "Vegetarian (Lacto-Ovo)"
    emoji: "🧀"
    allows_eggs: true
    allows_dairy: true
    allows_meat: false
    allows_fish: false
  vegan:
    label: "Vegan"
    emoji: "🌿"
    allows_eggs: false
    allows_dairy: false
    allows_meat: false
    allows_fish: false
  whole_food_plant_based:
    label: "Whole-Food Plant-Based (WFPB)"
    emoji: "🥗"
    allows_eggs: false
    allows_dairy: false
    allows_meat: false
    allows_fish: false
    minimizes_oils: true
    minimizes_processed_foods: true
```

---

## Food Group Rules

### Allowed Food Groups (Core Ingredients)

```yaml
allowed_food_groups:
  # Vegetables (all types — unlimited)
  - "leafy-greens"          # spinach, kale, collards, chard, arugula, bok choy
  - "cruciferous"           # broccoli, cauliflower, cabbage, Brussels sprouts
  - "alliums"               # onion, garlic, leeks, shallots, scallions
  - "tomatoes"              # all forms
  - "peppers"               # bell peppers, chili peppers
  - "root-vegetables"       # carrots, beets, parsnips, radishes
  - "nightshades"           # eggplant
  - "cucurbit-vegetables"   # zucchini, cucumber, squash, pumpkin
  - "starchy-vegetables"    # potatoes, sweet potatoes, corn, peas
  - "mushrooms"             # all varieties
  - "sea-vegetables"        # nori, wakame, kelp, dulse (iodine source)

  # Fruits (all types)
  - "berries"               # strawberries, blueberries, raspberries, blackberries
  - "citrus"                # oranges, lemons, grapefruit, lime
  - "tropical-fruit"        # banana, mango, pineapple, papaya, kiwi
  - "stone-fruit"           # peaches, plums, apricots, cherries
  - "pome-fruit"            # apples, pears
  - "grapes"
  - "melons"
  - "dried-fruit"           # raisins, dates, figs, prunes (moderate)

  # Whole grains
  - "whole-grains"          # brown rice, oats, quinoa, barley, farro, buckwheat, millet, wheat berries
  - "pasta-whole-grain"     # whole wheat pasta
  - "whole-grain-bread"     # 100% whole wheat, sprouted grain bread
  - "corn"                  # whole corn, popcorn (air-popped)

  # Legumes (the protein cornerstone)
  - "legumes"               # lentils (all colors), beans (all types), split peas
  - "chickpeas"             # garbanzo beans, hummus
  - "soy-foods"             # tofu, tempeh, edamame, natto, soy milk
  - "peas"                  # green peas, snow peas, snap peas

  # Nuts and seeds
  - "nuts"                  # almonds, walnuts, cashews, pistachios, pecans, Brazil nuts, macadamia
  - "seeds"                 # flax (ground), chia, hemp, pumpkin, sunflower, sesame
  - "nut-butters"           # almond butter, peanut butter, cashew butter (natural, no additives)
  - "tahini"                # sesame seed paste

  # Fats
  - "avocado"
  - "olive-oil"             # WFPB purists may exclude
  - "coconut"               # fresh/dried; coconut oil (moderate — high saturated fat)
  - "dark-chocolate"        # 70%+ cacao (moderate)

  # Plant milks (fortified, unsweetened preferred)
  - "plant-milk-soy"        # best nutritional profile
  - "plant-milk-pea"        # high protein (Ripple)
  - "plant-milk-oat"        # moderate protein
  - "plant-milk-almond"     # low protein
  - "plant-milk-coconut"    # low protein, high saturated fat

  # Flavoring
  - "herbs"                 # all fresh and dried herbs
  - "spices"                # all spices
  - "nutritional-yeast"     # B12 source (if fortified), umami flavor
  - "soy-sauce"             # tamari, shoyu, liquid aminos
  - "miso"                  # fermented soybean paste
  - "lemon-lime"            # as primary acid
  - "vinegars"              # apple cider, balsamic, rice, wine vinegar
  - "garlic"
  - "ginger"
  - "maple-syrup"           # moderate
  - "molasses"              # iron/calcium source

  # Beverages
  - "water"
  - "coffee"                # unsweetened
  - "tea"                   # green, black, herbal
```

### Lacto-Ovo Vegetarian — Additional Allowed Groups

```yaml
lacto_ovo_additional:
  - "eggs"                  # all types
  - "dairy-milk"            # cow's milk
  - "yogurt"                # Greek yogurt, regular yogurt
  - "cheese"                # all types
  - "cottage-cheese"
  - "butter"                # moderate
  - "honey"                 # moderate
```

### Restricted Food Groups (All Sub-Types Except Flexible Plant-Based)

```yaml
restricted_food_groups:
  vegan:
    - "red-meat"            # beef, pork, lamb — EXCLUDED
    - "processed-meat"      # sausages, bacon, deli meats — EXCLUDED
    - "poultry"             # chicken, turkey — EXCLUDED
    - "fish-fatty"          # salmon, sardines, mackerel — EXCLUDED
    - "fish-lean"           # cod, halibut — EXCLUDED
    - "seafood"             # shrimp, mussels, clams — EXCLUDED
    - "eggs"                # EXCLUDED
    - "dairy-milk"          # EXCLUDED
    - "yogurt"              # EXCLUDED (dairy)
    - "cheese"              # EXCLUDED (dairy)
    - "butter"              # EXCLUDED (dairy)
    - "honey"               # EXCLUDED (animal-derived)
    - "gelatin"             # EXCLUDED (animal-derived)
    - "casein"              # EXCLUDED (milk protein)
    - "whey"                # EXCLUDED (milk protein)

  lacto_ovo_vegetarian:
    - "red-meat"            # EXCLUDED
    - "processed-meat"      # EXCLUDED
    - "poultry"             # EXCLUDED
    - "fish-fatty"          # EXCLUDED
    - "fish-lean"           # EXCLUDED
    - "seafood"             # EXCLUDED
    # Eggs, dairy, honey ALLOWED

  whole_food_plant_based:
    # Same as vegan, plus:
    - "refined-grains"      # EXCLUDED
    - "refined-sugar"       # EXCLUDED or minimized
    - "extracted-oils"      # minimized or excluded (including olive oil)
    - "ultra-processed-food" # EXCLUDED
```

### Moderate Food Groups

```yaml
moderate_food_groups:
  plant_based_all:
    - "refined-grains": "minimize — choose whole grain versions"
    - "refined-sugar": "minimize — occasional treats only"
    - "sugary-drinks": "avoid"
    - "ultra-processed-vegan-foods": "minimize — plant-based meat alternatives, vegan junk food"
    - "plant-oils": "moderate use (WFPB purists exclude entirely)"
    - "dried-fruit": "moderate — calorie dense, concentrated sugar"
    - "dark-chocolate": "1-2 squares/day (70%+ cacao)"
    - "coconut-products": "moderate — high in saturated fat"
    - "seaweed": "moderate — iodine content varies; avoid excess kelp"

  flexible_plant_based_optional:
    - "fish-fatty": "optional, 1-3 servings/week if included"
    - "eggs": "optional, occasional"
    - "dairy": "optional, moderate"
```

### Mandatory Supplements (Vegan/WFPB)

```yaml
required_supplements:
  vegan:
    - supplement: "Vitamin B12 (cyanocobalamin or methylcobalamin)"
      dose: "250-1000 mcg/day OR 2500 mcg/week"
      rationale: "Not present in plant foods; deficiency causes irreversible neurological damage"
      priority: "MANDATORY"

    - supplement: "Vitamin D3 (or D2)"
      dose: "1000-2000 IU/day"
      rationale: "Limited sun exposure; few plant sources"
      priority: "RECOMMENDED"

    - supplement: "Algae-derived DHA/EPA"
      dose: "200-300 mg/day"
      rationale: "ALA conversion to DHA/EPA is inefficient"
      priority: "RECOMMENDED (MANDATORY in pregnancy/lactation)"

    - supplement: "Iodine"
      dose: "75-150 mcg/day (if not using iodized salt or seaweed)"
      rationale: "Plant foods are generally low in iodine"
      priority: "RECOMMENDED"

  lacto_ovo_vegetarian:
    - supplement: "Vitamin D"
      dose: "1000-2000 IU/day"
      rationale: "Universal need; eggs/dairy may be insufficient"
      priority: "RECOMMENDED"

    - supplement: "Iron (if ferritin is low)"
      dose: "As clinically indicated"
      rationale: "Non-heme iron is less bioavailable"
      priority: "CONDITIONAL"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  # Vegan / WFPB
  vegan:
    carbs_pct: [50, 65]       # 50-65% of calories
    protein_pct: [12, 18]     # 12-18% of calories
    fat_pct: [15, 30]         # 15-30% of calories (WFPB purists target 10-15%)
    saturated_fat_pct: [0, 7] # <7% of calories
    fiber_g: [35, 55]         # 35-55g/day
    sodium_mg: [0, 2300]      # <2300mg/day

  # Lacto-Ovo Vegetarian
  lacto_ovo:
    carbs_pct: [45, 60]
    protein_pct: [13, 18]
    fat_pct: [25, 35]
    saturated_fat_pct: [0, 8]
    fiber_g: [30, 45]
    sodium_mg: [0, 2300]
```

---

## AI Prompt Instructions

```
PLANT-BASED / VEGAN / VEGETARIAN DIET RULES — Follow strictly:

SUB-TYPE DETECTION:
- If user is "vegan": NO animal products whatsoever (no meat, fish, poultry, eggs, dairy, honey, gelatin).
- If user is "vegetarian" (lacto-ovo): NO meat, fish, or poultry. Eggs and dairy ARE allowed.
- If user is "plant-based" (flexible/WFPB): Predominantly plant foods; minimal animal products optional. Emphasize whole, unprocessed foods.

1. PROTEIN SOURCES: Center meals on legumes (lentils, beans, chickpeas), soy foods (tofu, tempeh, edamame), and whole grains. Include 2-3 servings of legumes/soy foods daily.

2. VEGETABLES: Every meal should be vegetable-forward. Aim for 5+ servings of vegetables and 3-5 servings of fruit per day. Maximize color diversity.

3. WHOLE GRAINS: Use only whole grains (brown rice, quinoa, oats, barley, whole wheat, buckwheat). Avoid white/refined grains.

4. NO ANIMAL PRODUCTS (vegan): Do NOT include any meat, poultry, fish, seafood, eggs, dairy, honey, gelatin, or other animal-derived ingredients. Check for hidden animal ingredients (whey, casein, gelatin, honey, fish sauce, anchovy paste).

5. NO MEAT/FISH/POULTRY (vegetarian): Eggs and dairy are fine. Do NOT include any meat, fish, or poultry.

6. HEALTHY FATS: Include nuts, seeds, avocado, and olive oil daily. Ground flaxseed or chia seeds (1-2 tbsp) should be included for omega-3 (ALA) content. WFPB version: minimize or eliminate extracted oils.

7. SOY: Include 1-3 servings of whole soy foods daily (tofu, tempeh, edamame, soy milk). Soy is safe and beneficial at these levels.

8. FLAVOR: Use nutritional yeast (for umami + B12 if fortified), herbs, spices, tamari/soy sauce, miso, lemon juice, and vinegars liberally. Build flavor without relying on animal-based stocks or sauces.

9. IRON: Include iron-rich plant foods (lentils, tofu, spinach, pumpkin seeds, fortified cereals) and pair with vitamin C-rich foods (citrus, bell peppers, tomatoes) to enhance absorption.

10. CALCIUM: Include calcium-rich foods daily — calcium-set tofu, fortified plant milks, leafy greens (collards, kale, bok choy), tahini. Ensure plant milk is fortified.

11. PROCESSED FOODS: Avoid ultra-processed vegan junk food (even if technically vegan). Prioritize whole, minimally processed foods. Plant-based meat alternatives are acceptable occasionally but should not be dietary staples.

12. DESSERT: Default dessert is fresh fruit. Sweets should be occasional.

13. SUPPLEMENT REMINDER: If generating meal plans or nutritional summaries for vegans, flag that B12 supplementation is MANDATORY and DHA/EPA, vitamin D, and iodine are recommended.
```

---

## Meal Structure Rules

```yaml
meal_structure:
  vegan:
    breakfast:
      typical: "Oatmeal with plant milk, berries, ground flaxseed, walnuts; OR tofu scramble with vegetables and nutritional yeast; OR smoothie bowl with fruit, granola, chia seeds"
      must_include: ["whole grain OR soy protein", "fruit", "healthy fat (nuts/seeds)"]
      avoid: ["processed cereal", "pastries with eggs/butter", "honey-sweetened items"]

    lunch:
      typical: "Buddha bowl with quinoa, chickpeas/roasted tofu, roasted vegetables, tahini dressing; OR lentil soup with whole grain bread and salad; OR bean-based wrap/sandwich"
      must_include: ["vegetables (multiple types)", "legume/soy protein", "whole grain"]
      protein_preference: "legumes, tofu, tempeh, edamame"
      avoid: ["cheese", "eggs", "any animal products"]

    dinner:
      typical: "Tempeh or bean-based main (stir-fry, curry, stew), whole grain or starchy vegetable, abundant vegetables"
      must_include: ["vegetables", "legume/soy protein", "whole grain or starchy vegetable"]
      protein_preference: "tofu, tempeh, lentils, beans, chickpeas"
      avoid: ["animal products of any kind"]

    snacks:
      typical: "Handful of nuts/seeds, fresh fruit, hummus with vegetables, edamame, dark chocolate"
      avoid: ["chips", "candy", "processed vegan snacks high in sodium/refined oils"]

  lacto_ovo:
    breakfast:
      typical: "Greek yogurt parfait with oats, nuts, honey, fruit; OR vegetable omelet with whole grain toast; OR oatmeal with milk, berries, walnuts"
      must_include: ["whole grain OR eggs/dairy", "fruit", "healthy fat"]
      avoid: ["processed cereal", "pastries", "bacon"]

    lunch:
      typical: "Egg salad or cheese sandwich with side salad; OR lentil soup with cheese toast; OR caprese with whole grain bread"
      must_include: ["vegetables", "protein (eggs, dairy, or legumes)", "whole grain"]
      protein_preference: "eggs, cheese, legumes, Greek yogurt"
      avoid: ["meat", "fish", "poultry"]

    dinner:
      typical: "Eggplant parmesan with whole wheat pasta; OR chickpea curry with yogurt raita; OR cheese and bean enchiladas"
      must_include: ["vegetables", "protein", "whole grain"]
      protein_preference: "eggs, cheese, beans, lentils, tofu"
      avoid: ["meat", "fish", "poultry"]

    snacks:
      typical: "String cheese and apple, Greek yogurt with honey, nuts, cottage cheese with fruit"
      avoid: ["chips", "candy", "processed snacks"]
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - flexitarian
    - mediterranean
    - mind
    - volumetrics

  adaptable_match:
    - mediterranean: "The Mediterranean diet is already plant-forward; make base meal plant-based and serve fish/poultry/cheese separately for the Mediterranean partner"
    - pescatarian: "Base meal is plant-based; add fish for the pescatarian partner's plate"
    - flexitarian: "Nearly identical — both emphasize plant foods; flexitarian partner adds occasional meat/fish"
    - vegetarian: "If one is vegan and the other lacto-ovo, cook vegan base meal and add eggs/cheese for the vegetarian partner"
    - keto: "Challenging but possible — focus on tofu, tempeh, nuts, seeds, avocado, low-carb vegetables; skip grains/legumes for keto partner"
    - paleo: "Focus on vegetables, nuts, seeds, fruit; skip grains and legumes for paleo partner (use vegetable-based substitutes)"
    - low-fodmap: "Adapt the recipe — reduce garlic/onion (use garlic-infused oil), choose low-FODMAP vegetables, moderate legumes"
    - dash: "Very compatible — both emphasize vegetables, fruits, legumes, whole grains"

  hard_conflict:
    - carnivore: "Fundamental incompatibility — carnivore is all animal products, vegan is zero animal products. Suggest entirely separate meals"
    - mcdougall: "Both are plant-based, but McDougall is very low fat (<10%) — align by using WFPB no-oil version if both agree"
    - pritikin: "Both plant-friendly, but Pritikin is <10% fat — align by using low-fat WFPB version"
```

---

## Ingredient Classifier Reference

Key plant-based ingredients and their food group classification for the safety guard:

```yaml
classifier_mappings:
  # Plant Proteins
  "tofu": "soy-foods"
  "tempeh": "soy-foods"
  "edamame": "soy-foods"
  "soy milk": "plant-milk-soy"
  "natto": "soy-foods"
  "miso": "soy-foods"
  "seitan": "plant-protein-concentrate"  # wheat gluten
  "nutritional yeast": "nutritional-yeast"
  "pea protein": "plant-protein-concentrate"

  # Legumes
  "lentils": "legumes"
  "chickpeas": "chickpeas"
  "garbanzo beans": "chickpeas"
  "black beans": "legumes"
  "kidney beans": "legumes"
  "pinto beans": "legumes"
  "navy beans": "legumes"
  "split peas": "legumes"
  "hummus": "chickpeas"

  # Grains
  "brown rice": "whole-grains"
  "quinoa": "whole-grains"
  "oats": "whole-grains"
  "barley": "whole-grains"
  "farro": "whole-grains"
  "buckwheat": "whole-grains"
  "whole wheat pasta": "pasta-whole-grain"
  "white rice": "refined-grains"
  "white bread": "refined-grains"

  # Nuts and Seeds
  "almonds": "nuts"
  "walnuts": "nuts"
  "cashews": "nuts"
  "brazil nuts": "nuts"
  "flaxseed": "seeds"
  "chia seeds": "seeds"
  "hemp seeds": "seeds"
  "pumpkin seeds": "seeds"
  "tahini": "tahini"
  "peanut butter": "nut-butters"

  # Fats
  "avocado": "avocado"
  "olive oil": "olive-oil"
  "coconut oil": "coconut"

  # Animal Products (FLAG for vegan restriction)
  "beef": "red-meat"
  "pork": "red-meat"
  "lamb": "red-meat"
  "chicken": "poultry"
  "turkey": "poultry"
  "salmon": "fish-fatty"
  "tuna": "fish-fatty"
  "cod": "fish-lean"
  "shrimp": "seafood"
  "eggs": "eggs"
  "milk": "dairy-milk"           # cow's milk
  "cheese": "cheese"
  "greek yogurt": "yogurt"
  "butter": "butter"
  "honey": "honey"
  "gelatin": "gelatin"
  "whey": "whey"                 # hidden animal ingredient
  "casein": "casein"             # hidden animal ingredient

  # Plant Milks
  "oat milk": "plant-milk-oat"
  "almond milk": "plant-milk-almond"
  "coconut milk (beverage)": "plant-milk-coconut"
  "pea milk": "plant-milk-pea"
```

---

## Implementation Checklist

- [ ] Add `plant-based`, `vegetarian`, and `vegan` to the `DietKey` union type
- [ ] Add Plant-Based/Vegan/Vegetarian definitions to `DIETS` record in `diets.ts`
- [ ] Add sub-type selector (vegan vs. lacto-ovo vs. WFPB vs. flexible) in diet picker UI
- [ ] Inject Plant-Based AI prompt instructions in `buildPrompt()`, adapting rules based on sub-type
- [ ] Add food-group restriction logic for `assertMealCompliesWithDiet()`:
  - Vegan: block all animal products (check for hidden ingredients — whey, casein, gelatin, honey, fish sauce)
  - Lacto-ovo: block meat/fish/poultry only
  - WFPB: block animal products + flag refined grains/extracted oils
- [ ] Add mandatory supplement alerts (B12 for vegans; D, DHA/EPA, iron, iodine as recommended)
- [ ] Add classifier mappings for plant-based-specific ingredients (tofu, tempeh, nutritional yeast, seitan, etc.)
- [ ] Add hidden animal ingredient detection (whey, casein, gelatin, honey, L-cysteine, shellac, carmine/cochineal, isinglass, omega-3 from fish oil in fortified foods)
- [ ] Add couple compatibility rules for Plant-Based + other diets
- [ ] Update seed data with plant-based/vegan/vegetarian test users
- [ ] Add plant milk fortification check (recommend fortified soy or pea milk over others)
- [ ] Add weekly legume/soy frequency tracking (target: 2–3 servings/day)

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
