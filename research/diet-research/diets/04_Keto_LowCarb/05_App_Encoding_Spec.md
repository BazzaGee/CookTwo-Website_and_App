# Keto / Low-Carb Diet — App Encoding Spec

> Machine-readable specification for integrating the ketogenic diet into Cupla's AI meal generation system. This file is designed for direct implementation by developers.

---

## Diet Metadata

```yaml
diet_key: "keto"
display_label: "Keto / Low-Carb"
category: "lowCarb"
emoji: "🥩"
short_description: "Very low carb, high fat — metabolic ketosis for fat-burning and blood sugar control"
evidence_grade: "B"
restrictiveness: 4  # 1-5 scale
sodium_restriction: "none"  # higher sodium needed during keto adaptation
carb_limit_g: 50  # max net carbs per day
requires_ketosis: true
```

---

## Food Group Rules

### Allowed Food Groups (Core Ingredients)

```yaml
allowed_food_groups:
  # Fats and Oils (primary energy source)
  - "olive-oil"              # extra virgin, primary cooking fat
  - "avocado-oil"            # high smoke point cooking
  - "butter"                 # grass-fed preferred
  - "ghee"                   # clarified butter
  - "coconut-oil"            # contains MCTs
  - "mct-oil"                # ketone booster
  - "animal-fats"            # tallow, lard, duck fat
  - "mayonnaise"             # avocado/olive oil based only

  # Meats (all types — prefer fatty cuts)
  - "red-meat"               # beef, lamb, pork — all cuts
  - "fatty-meat"             # ribeye, pork belly, brisket
  - "poultry"                # chicken (with skin), turkey, duck
  - "bacon"                  # no-sugar-added varieties
  - "sausage"                # no-sugar-added varieties
  - "organ-meats"            # liver, heart, kidney (nutrient dense)
  - "deli-meat"              # only if no sugar/carb fillers

  # Fish and Seafood (all types)
  - "fish-fatty"             # salmon, mackerel, sardines, herring
  - "fish-lean"              # cod, halibut, tuna, snapper
  - "seafood"                # shrimp, mussels, clams, squid, crab

  # Eggs
  - "eggs"                   # whole eggs, unlimited

  # Low-Carb Vegetables (non-starchy only)
  - "leafy-greens"           # spinach, kale, arugula, chard, lettuce
  - "cruciferous"            # broccoli, cauliflower, Brussels sprouts, cabbage
  - "zucchini-squash"        # zucchini, summer squash (NOT winter squash)
  - "asparagus"
  - "green-beans"
  - "cucumber"
  - "celery"
  - "mushrooms"              # all varieties
  - "peppers"                # bell peppers, jalapeños (track carbs)
  - "tomatoes"               # moderate (track carbs)
  - "avocado"                # keto superfood — eat freely
  - "olives"                 # all varieties (in oil/brine, not sugar)

  # Cheese and Full-Fat Dairy
  - "cheese"                 # cheddar, mozzarella, brie, goat, cream cheese
  - "heavy-cream"
  - "sour-cream"             # full-fat only
  - "cream-cheese"
  - "greek-yogurt-full-fat"  # moderate (track carbs)
  - "butter"                 # already in fats

  # Nuts and Seeds (low-carb choices)
  - "macadamia-nuts"
  - "pecans"
  - "walnuts"
  - "brazil-nuts"
  - "almonds"                # moderate (track carbs)
  - "chia-seeds"
  - "flaxseeds"
  - "hemp-hearts"
  - "pumpkin-seeds"

  # Berries (limited — track carefully)
  - "raspberries"
  - "blackberries"
  - "strawberries"

  # Flavoring
  - "herbs"                  # all fresh/dried herbs
  - "spices"                 # all spices (watch blends with sugar)
  - "lemon-lime"             # as flavoring (juice in small amounts)
  - "vinegar"                # apple cider, balsamic (moderate), white, red wine
  - "mustard"                # no sugar added
  - "hot-sauce"              # check for sugar
  - "soy-sauce"              # tamari preferred (no sugar)
  - "salt"                   # use liberally during adaptation

  # Sweeteners (keto-approved)
  - "stevia"
  - "erythritol"
  - "monk-fruit"
  - "allulose"
  - "xylitol"                # note: toxic to dogs

  # Beverages
  - "water"
  - "sparkling-water"
  - "coffee"                 # black or with cream/MCT oil
  - "tea"                    # black, green, herbal (unsweetened)
  - "bone-broth"             # excellent for electrolytes
  - "dry-wine"               # occasional, moderate
  - "spirits"                # occasional (vodka, gin, whiskey — no sweet mixers)
```

### Restricted Food Groups (Avoid Completely)

```yaml
restricted_food_groups:
  # Grains — ALL types
  - "all-grains"             # wheat, rice, oats, corn, barley, rye, quinoa, millet
  - "bread"                  # all types including "keto bread" (check labels)
  - "pasta"                  # all types (unless specifically keto-branded)
  - "cereal"                 # all types
  - "flour"                  # wheat flour, rice flour, etc.

  # Starchy vegetables
  - "potatoes"               # white, red, fingerling
  - "sweet-potatoes"
  - "yams"
  - "corn"
  - "winter-squash"          # butternut, acorn, pumpkin
  - "cassava"                # tapioca, yuca

  # Most fruit
  - "tropical-fruit"         # banana, mango, pineapple, papaya
  - "tree-fruit"             # apple, pear, peach, plum
  - "citrus-fruit"           # oranges, tangerines (lemon/lime OK as flavoring)
  - "grapes"
  - "dried-fruit"            # raisins, dates, figs — very high carb

  # Legumes
  - "legumes"                # lentils, chickpeas, beans (all types)
  - "peas"                   # green peas (high carb)

  # Sugar — ALL forms
  - "sugar"                  # table sugar, brown sugar
  - "honey"
  - "maple-syrup"
  - "agave"
  - "coconut-sugar"

  # Sugary/Carb Drinks
  - "sugary-drinks"          # soda, juice, sports drinks, sweetened coffee
  - "beer"                   # regular beer (some light beers OK in moderation)
  - "sweet-wine"             # dessert wines, port
  - "cocktails"              # sweet mixers

  # Other
  - "ultra-processed-food"   # most packaged foods with added carbs
  - "low-fat-products"       # usually have added sugar
  - "ketchup"                # unless no-sugar-added
  - "barbecue-sauce"         # unless no-sugar-added
```

### Moderate Food Groups (Track Carbs Carefully)

```yaml
moderate_food_groups:
  - "tomatoes": "1–2 medium per day max"
  - "onions": "¼–½ medium per serving"
  - "carrots": "½ cup cooked, occasionally"
  - "greek-yogurt-full-fat": "½ cup max per day"
  - "berries": "½ cup per serving, count carbs"
  - "dark-chocolate": "1–2 squares 85%+ occasionally"
  - "nuts-higher-carb": "pistachios, cashews — small amounts only"
  - "alcohol": "dry wine or straight spirits, 1-2 drinks occasionally"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  carbs_pct: [5, 10]           # 5-10% of calories
  protein_pct: [15, 25]        # 15-25% of calories
  fat_pct: [70, 80]            # 70-80% of calories
  net_carbs_g: [20, 50]        # 20-50g net carbs per day (CRITICAL)
  total_carbs_g: [20, 60]      # total carbs including fiber
  fiber_g: [15, 30]            # from low-carb vegetables, nuts, seeds
  sodium_mg: [3000, 5000]      # higher than standard (keto is diuretic)
  potassium_mg: [3500, 4700]   # from avocado, greens, meat
  magnesium_mg: [400, 500]     # often needs supplementation
```

---

## AI Prompt Instructions

```
KETOGENIC DIET RULES — Follow strictly:

1. CARBOHYDRATE LIMIT: Every generated day must total UNDER 50g NET CARBS (total carbs minus fiber). Aim for 20-35g net carbs for a standard day. This is the single most important constraint.

2. FAT AS PRIMARY ENERGY: Every meal must be fat-forward. Use generous amounts of olive oil, butter, avocado oil, coconut oil, or animal fats for cooking and dressing. Do NOT use low-fat ingredients.

3. PROTEIN: Include a quality protein source at every meal (meat, fish, eggs, poultry). Portions of 150-225g (5-8oz) per main meal are appropriate.

4. VEGETABLES: Include non-starchy vegetables at most meals (spinach, kale, zucchini, cauliflower, broccoli, asparagus, Brussels sprouts, avocado). These are the primary fiber and micronutrient source. NEVER include starchy vegetables (potatoes, sweet potatoes, corn, winter squash).

5. NO GRAINS: Do NOT include any grains — no bread, pasta, rice, oats, quinoa, corn, or flour-based products. Not even "healthy whole grains."

6. NO SUGAR: Do NOT include any sugar, honey, maple syrup, agave, or sweetened products. Use stevia, erythritol, or monk fruit if sweetness is needed.

7. NO LEGUMES: Do NOT include beans, lentils, chickpeas, or peas.

8. NO MOST FRUIT: Limit fruit to small amounts of berries (raspberries, blackberries, strawberries — max ½ cup per serving). No apples, bananas, grapes, oranges, tropical fruit, or dried fruit.

9. DAIRY: Full-fat dairy is encouraged (cheese, heavy cream, butter, full-fat Greek yogurt in moderation). NEVER use low-fat or fat-free dairy.

10. ELECTROLYTES: Include salty/savory elements and mention electrolyte needs. Consider adding bone broth recommendations.

11. FAT BOMBS / KETO SNACKS: May include keto-specific snacks like fat bombs, nuts, cheese, avocado, hard-boiled eggs.

12. TRACK NET CARBS: Calculate and display net carbs (total carbs − fiber) for each meal and daily total. Ensure daily total stays under 50g.
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    typical: "Eggs (2-4) cooked in butter/oil with cheese, bacon or sausage, avocado; OR bulletproof coffee for intermittent fasters"
    must_include: ["protein (eggs or meat)", "healthy fat"]
    optional: ["low-carb vegetable (spinach, avocado)"]
    avoid: ["cereal", "toast", "oatmeal", "fruit juice", "any grain", "any sugar"]

  lunch:
    typical: "Large salad or protein + low-carb vegetables with generous olive oil dressing, or leftovers from dinner"
    must_include: ["protein source (meat/fish/eggs)", "fat source", "low-carb vegetable"]
    protein_preference: "chicken, fish, beef, pork, eggs"
    avoid: ["bread", "rice", "pasta", "croutons", "sweet dressings"]

  dinner:
    typical: "Fatty cut of meat or fish (150-225g) with roasted low-carb vegetables in butter/oil and a side salad"
    must_include: ["protein (meat or fish)", "2+ low-carb vegetables", "healthy fat"]
    protein_preference: "steak, salmon, pork, chicken thighs, lamb"
    avoid: ["potatoes", "rice", "pasta", "bread", "starchy sides"]

  snacks:
    typical: "Handful of macadamia nuts/pecans/walnuts, cheese, avocado, hard-boiled eggs, keto fat bombs"
    must_include: ["fat source"]
    avoid: ["chips", "crackers", "fruit", "candy", "granola bars"]
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - carnivore
    - paleo
    - whole30

  adaptable_match:
    - mediterranean: "Build a shared protein (fish/chicken/steak) + vegetable base; keto partner adds extra fat and skips grains/legumes; Mediterranean partner adds whole grains/legumes"
    - high-protein: "Very similar — both emphasize protein; keto adds more fat, high-protein adds more carbs as needed"
    - dash: "Shared vegetables + lean protein base; keto partner adds fats and skips grains; DASH partner adds grains and limits saturated fat"
    - flexitarian: "Shared vegetable-forward base; keto partner adds meat/fat; flexitarian partner adds grains/legumes"
    - volumetrics: "Shared vegetable volume; keto partner adds fat; volumetrics partner adds low-calorie carbs"

  adaptable_with_fat_modification:
    - vegan: "Very difficult but possible with shared low-carb vegetable base; vegan partner adds tofu/tempeh + olive oil + avocado; keto partner adds meat. Almost no shared protein."
    - vegetarian: "Shared eggs/cheese base; keto partner adds meat; vegetarian partner adds low-carb plant proteins"

  hard_conflict:
    - mcdougall: "Directly opposite philosophies — McDougall is 70-80% carb, keto is 70-80% fat. Suggest separate meals."
    - pritikin: "Opposite fat philosophy — Pritikin is <10% fat. Suggest separate meals."
    - hclf-811: "Opposite philosophy — 80% carb, 10% fat raw. Suggest separate meals."
    - ornish: "Opposite fat philosophy — Ornish is <10% fat, very low saturated fat. Suggest separate meals."
```

---

## Ingredient Classifier Reference

Key ketogenic ingredients and their food group classification for the safety guard:

```yaml
classifier_mappings:
  # Fats
  "extra virgin olive oil": "olive-oil"
  "olive oil": "olive-oil"
  "avocado oil": "avocado-oil"
  "butter": "butter"
  "ghee": "ghee"
  "coconut oil": "coconut-oil"
  "MCT oil": "mct-oil"
  "tallow": "animal-fats"
  "lard": "animal-fats"

  # Meats
  "ribeye": "fatty-meat"
  "steak": "red-meat"
  "beef": "red-meat"
  "ground beef": "red-meat"
  "pork": "red-meat"
  "pork belly": "fatty-meat"
  "lamb": "red-meat"
  "bacon": "bacon"
  "sausage": "sausage"
  "chicken": "poultry"
  "chicken thighs": "poultry"
  "chicken wings": "poultry"
  "turkey": "poultry"
  "duck": "poultry"

  # Fish
  "salmon": "fish-fatty"
  "mackerel": "fish-fatty"
  "sardines": "fish-fatty"
  "herring": "fish-fatty"
  "tuna": "fish-lean"
  "cod": "fish-lean"
  "shrimp": "seafood"

  # Eggs
  "eggs": "eggs"

  # Vegetables
  "spinach": "leafy-greens"
  "kale": "leafy-greens"
  "arugula": "leafy-greens"
  "broccoli": "cruciferous"
  "cauliflower": "cruciferous"
  "brussels sprouts": "cruciferous"
  "zucchini": "zucchini-squash"
  "asparagus": "asparagus"
  "avocado": "avocado"
  "mushrooms": "mushrooms"
  "cucumber": "cucumber"
  # RESTRICTED vegetables
  "potatoes": "potatoes"           # RESTRICTED
  "sweet potatoes": "sweet-potatoes" # RESTRICTED
  "corn": "corn"                   # RESTRICTED

  # Dairy
  "cheddar cheese": "cheese"
  "mozzarella": "cheese"
  "cream cheese": "cream-cheese"
  "heavy cream": "heavy-cream"
  "sour cream": "sour-cream"
  "greek yogurt": "greek-yogurt-full-fat"

  # Nuts
  "macadamia nuts": "macadamia-nuts"
  "pecans": "pecans"
  "walnuts": "walnuts"
  "almonds": "almonds"
  "chia seeds": "chia-seeds"
  "flaxseeds": "flaxseeds"

  # Berries
  "raspberries": "raspberries"
  "blackberries": "blackberries"
  "strawberries": "strawberries"
  # RESTRICTED fruit
  "bananas": "tropical-fruit"       # RESTRICTED
  "apples": "tree-fruit"            # RESTRICTED

  # RESTRICTED items
  "bread": "all-grains"             # RESTRICTED
  "rice": "all-grains"              # RESTRICTED
  "pasta": "all-grains"             # RESTRICTED
  "oats": "all-grains"              # RESTRICTED
  "sugar": "sugar"                  # RESTRICTED
  "honey": "honey"                  # RESTRICTED
  "lentils": "legumes"              # RESTRICTED
  "chickpeas": "legumes"            # RESTRICTED
```

---

## Implementation Checklist

- [ ] Add `keto` to the `DietKey` union type
- [ ] Add Keto definition to `DIETS` record in `diets.ts`
- [ ] Add Keto to the categorized diet picker in `ProfilesTab.tsx`
- [ ] Inject Keto AI prompt instructions in `buildPrompt()`
- [ ] Add Keto food-group rules to `assertMealCompliesWithDiet()` — **critical: enforce net carb <50g/day**
- [ ] Add carb counting logic (net carbs = total carbs − fiber) to meal compliance checker
- [ ] Add classifier mappings for Keto-specific ingredients (especially restricted items: grains, sugar, starchy veg)
- [ ] Update seed data with a Keto diet test user
- [ ] Add couple compatibility rules for Keto + other diets
- [ ] Add lipid monitoring health reminder for Keto users
- [ ] Add electrolyte guidance in onboarding for new Keto users

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
