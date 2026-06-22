# McDougall Diet / Starch Solution — App Encoding Spec

> Machine-readable specification for integrating the McDougall/Starch Solution diet into Cupla's AI meal generation system. This file is designed for direct implementation by developers.

---

## Diet Metadata

```yaml
diet_key: "mcdougall"
display_label: "McDougall (Starch Solution)"
category: "plant-based"
emoji: "🥔"
short_description: "Starch-centered, very low-fat, strictly plant-based — unlimited potatoes, rice & beans"
evidence_grade: "C-D"
restrictiveness: 4  # 1-5 scale
sodium_restriction: "low-to-moderate"
```

---

## Food Group Rules

### Allowed Food Groups (Core Ingredients)

```yaml
allowed_food_groups:
  # Starches — THE CENTER OF EVERY MEAL (unlimited)
  - "potatoes"              # russet, yukon gold, red, fingerling — baked, boiled, steamed, mashed (no oil)
  - "sweet-potatoes"        # all varieties, yams
  - "rice"                  # brown, white, basmati, jasmine, arborio, wild rice
  - "beans"                 # black, pinto, kidney, navy, cannellini, garbanzo, adzuki, lima
  - "lentils"               # brown, green, red, french
  - "peas"                  # green peas, split peas, black-eyed peas
  - "corn"                  # fresh, frozen, on the cob
  - "oats"                  # steel-cut, rolled, quick (not instant with additives)
  - "barley"                # hulled or pearl
  - "wheat-berries"         # whole wheat, bulgur, farro, freekeh
  - "quinoa"                # all colors
  - "buckwheat"             # groats, soba noodles (100% buckwheat)
  - "millet"                # whole grain
  - "teff"                  # whole grain
  - "sorghum"               # whole grain
  - "winter-squash"         # butternut, acorn, kabocha, spaghetti squash, pumpkin
  - "whole-grain-pasta"     # whole wheat, brown rice, bean pasta (no egg)
  - "whole-grain-bread"     # whole grain, sourdough (no oil or dairy) — maintenance only

  # Vegetables (all types, generous)
  - "leafy-greens"          # spinach, kale, collards, chard, romaine, arugula
  - "cruciferous"           # broccoli, cauliflower, brussels sprouts, cabbage, bok choy
  - "root-vegetables"       # carrots, beets, turnips, parsnips, radishes
  - "alliums"               # onions, garlic, leeks, shallots, scallions
  - "summer-squash"         # zucchini, yellow squash, pattypan
  - "nightshades"           # tomatoes, bell peppers, eggplant (McDougall allows ALL nightshades)
  - "green-beans"           # snap beans, string beans, wax beans
  - "mushrooms"             # all varieties
  - "cucurbit-vegetables"   # cucumber, celery, asparagus

  # Fruits (moderate — 1-3 servings/day)
  - "fresh-fruit"           # apples, bananas, oranges, berries, melon, etc.
  - "dried-fruit"           # raisins, dates, figs (occasional, small amounts)

  # Flavorings (no oil)
  - "herbs"                 # basil, oregano, thyme, rosemary, sage, parsley, cilantro, dill
  - "spices"                # cumin, coriander, turmeric, paprika, cinnamon, ginger, cardamom
  - "lemon-lime"            # as primary acid/flavoring
  - "vinegars"              # balsamic, apple cider, rice, red wine
  - "garlic"                # all forms
  - "nutritional-yeast"     # use liberally for cheesy/savory flavor
  - "soy-sauce-tamari"      # low-sodium preferred; for flavoring
  - "mustard"               # no oil
  - "hot-sauce"             # no oil
  - "salsa"                 # oil-free
  - "miso"                  # small amounts for umami

  # Soy (limited)
  - "tofu"                  # occasional (higher in fat/protein than ideal)
  - "edamame"               # OK (whole soybean)
  - "soy-milk"              # unsweetened, in moderation
```

### Restricted Food Groups (Strictly Avoid)

```yaml
restricted_food_groups:
  # ALL animal products
  - "red-meat"              # beef, pork, lamb — AVOID
  - "poultry"               # chicken, turkey — AVOID
  - "fish-all"              # all fish and seafood — AVOID
  - "eggs"                  # AVOID
  - "dairy-all"             # milk, cheese, yogurt, butter, cream — AVOID
  - "processed-meat"        # sausages, bacon, deli meats — AVOID

  # ALL added fats and oils
  - "all-oils"              # olive, canola, coconut, sunflower, sesame, avocado — AVOID
  - "butter"                # AVOID
  - "margarine"             # AVOID
  - "shortening-lard"       # AVOID

  # Refined and processed
  - "refined-grains"        # white bread, white rice (prefer whole), regular pasta
  - "refined-sugar"         # minimize/avoid
  - "sugary-drinks"         # soda, juice with added sugar — AVOID
  - "fast-food"             # AVOID
  - "ultra-processed-food"  # AVOID
  - "artificial-sweeteners" # AVOID
  - "vegan-junk-food"       # vegan donuts, vegan cheese with oil — AVOID

  # Beverages
  - "alcohol"               # discouraged
  - "coffee"                # discouraged (not strictly banned)
  - "fruit-juice"           # limit (high sugar, no fiber)
```

### Limited Food Groups (Very Small Amounts)

```yaml
moderate_food_groups:
  - "flaxseed": "1 tbsp/day ground — recommended for omega-3 (ALA)"
  - "nuts": "very small amounts, only at ideal body weight (a few walnuts/almonds)"
  - "seeds": "occasional, small amounts (chia, hemp, pumpkin, sunflower)"
  - "avocado": "small amounts, only at ideal body weight"
  - "olives": "avoid or very rare small amounts"
  - "coconut": "avoid (high saturated fat)"
  - "tofu-tempeh": "occasional — acceptable but higher in fat than ideal"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  carbs_pct: [70, 80]        # 70-80% of calories — primarily from whole-food starches
  protein_pct: [12, 15]      # 12-15% of calories — all from plant sources
  fat_pct: [5, 15]           # 5-15% of calories — as low as practically achievable
  saturated_fat_pct: [0, 3]  # <3% of calories — near-zero from whole plant foods
  fiber_g: [35, 60]          # 35-60g/day — very high
  sodium_mg: [0, 2000]       # <2000mg/day target (no added salt in strict program)
```

---

## AI Prompt Instructions

```
McDOUGALL / STARCH SOLUTION DIET RULES — Follow strictly:

1. STARCH IS THE CENTER: Every meal MUST feature a generous portion of starch (potatoes, sweet potatoes, rice, beans, lentils, corn, oats, quinoa, pasta, squash). Starch should be 50-80% of the plate by volume. Do NOT make vegetables the largest portion — starches should dominate.

2. NO ANIMAL PRODUCTS: Do NOT include ANY meat, poultry, fish, seafood, eggs, or dairy. This is a strictly vegan diet.

3. NO ADDED FAT: Do NOT use ANY oil (olive, canola, coconut, sesame, or any other). Do NOT use butter, margarine, or any extracted fat. Sauté vegetables with water, broth, or wine instead of oil.

4. NO HIGH-FAT PLANT FOODS: Avoid nuts, seeds, avocado, olives, and coconut in meal generation. The ONLY exception is 1 tbsp ground flaxseed per day (for omega-3).

5. UNLIMITED PORTIONS: Meals should be generous. Do NOT restrict portion sizes of approved starches and vegetables. The diet relies on eating until satisfied.

6. VEGETABLES: Include vegetables with every meal, but they are secondary to starches. Use oil-free cooking methods (steaming, boiling, baking, water-sautéing).

7. FRUIT: Include 1-3 servings of fresh fruit per day (as snack or dessert). Limit dried fruit.

8. FLAVOR WITHOUT FAT: Season with herbs, spices, garlic, lemon juice, vinegars, nutritional yeast, low-sodium soy sauce, mustard, and salsa. NEVER use oil or butter for flavor.

9. WHOLE GRAINS ONLY: Use whole grains (brown rice, whole wheat, oats, quinoa, barley). White rice is acceptable but whole grains preferred. Avoid refined flour products in Maximum Weight Loss mode.

10. BEANS AND LEGUMES: Include beans, lentils, or peas daily. They are a key starch AND protein source.

11. NO DAIRY SUBSTITUTES WITH OIL: Avoid vegan cheeses, commercial vegan dressings, or plant-based creams that contain added oils.

12. SATISFYING PORTIONS: Generate meals that are visually large and filling. The McDougall diet is NOT about restriction — it is about abundance of the right foods.
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    typical: "Large bowl of oatmeal with cinnamon and fruit; OR potato hash with onions, peppers, and spinach (water-sautéed); OR rice porridge (congee); OR oil-free whole grain pancakes"
    must_include: ["starch (oats, potatoes, or rice)", "fruit (optional)"]
    avoid: ["eggs", "dairy", "oil", "butter", "processed cereal", "pastries", "bacon"]

  lunch:
    typical: "Large portion of rice, quinoa, or pasta with bean stew/chili and steamed vegetables; OR bean burrito bowl (no cheese, no oil); OR hearty lentil soup with whole grain bread"
    must_include: ["large starch portion", "beans or lentils", "vegetables"]
    avoid: ["meat", "cheese", "oil-based dressing", "butter on bread"]

  dinner:
    typical: "Baked potatoes or sweet potatoes with oil-free gravy and vegetables; OR pasta with oil-free marinara and steamed broccoli; OR rice with chickpea curry and spinach; OR vegetable-barley stew"
    must_include: ["large starch portion", "vegetables"]
    protein_preference: "beans, lentils, or peas"
    avoid: ["fish", "meat", "oil", "butter", "cheese"]

  snacks:
    typical: "Baked potato or sweet potato; fresh fruit; plain rice cakes; steamed edamame"
    avoid: ["chips", "candy", "nuts (except maintenance)", "processed snacks", "oil-based dips"]
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - ornish
    - esselstyn
    - wfpb
    - vegan
    - pritikin

  adaptable_match:
    - vegetarian: "Same base meal (starch + vegetables + beans); the vegetarian partner can add eggs or dairy to their portion"
    - flexitarian: "Same base meal; flexitarian partner adds a small portion of fish or lean meat"
    - mediterranean: "DIFFICULT — opposite fat philosophy. Share the starch + vegetable base; Mediterranean partner adds olive oil, fish, and feta to their plate. Must use separate cooking for oil-based components"
    - dash: "Share the starch + vegetable + bean base; DASH partner adds lean protein and moderate healthy fats. Sodium target is similar"
    - volumetrics: "Very compatible — both emphasize low calorie density and large portions"

  hard_conflict:
    - keto: "OPPOSITE MACRONUTRIENT PHILOSOPHY — McDougall is 75% carb / 10% fat; keto is 10% carb / 75% fat. Essentially no shared meal possible. Suggest entirely separate meals"
    - carnivore: "OPPOSITE IN EVERY WAY — carnivore is all animal products, zero plants. No shared foods whatsoever. Must cook completely separate meals"
    - paleo: "Major conflict — Paleo excludes grains, beans, and legumes (the core of McDougall). Suggest separate starch/protein components"
    - atkins: "Opposite carbohydrate philosophy. No shared meal structure possible"
    - hclf-811: "Not a conflict per se, but 80/10/10 is raw-food focused while McDougall includes cooked starches. Compatible in philosophy but different in execution"
```

---

## Ingredient Classifier Reference

Key McDougall ingredients and their food group classification for the safety guard:

```yaml
classifier_mappings:
  # Starches (THE BASE)
  "potatoes": "potatoes"
  "russet potatoes": "potatoes"
  "sweet potatoes": "sweet-potatoes"
  "yams": "sweet-potatoes"
  "rice": "rice"
  "brown rice": "rice"
  "white rice": "rice"
  "basmati rice": "rice"
  "black beans": "beans"
  "pinto beans": "beans"
  "kidney beans": "beans"
  "navy beans": "beans"
  "cannellini beans": "beans"
  "garbanzo beans": "beans"
  "chickpeas": "beans"
  "adzuki beans": "beans"
  "lentils": "lentils"
  "green lentils": "lentils"
  "red lentils": "lentils"
  "split peas": "peas"
  "green peas": "peas"
  "corn": "corn"
  "oats": "oats"
  "steel-cut oats": "oats"
  "barley": "barley"
  "quinoa": "quinoa"
  "buckwheat": "buckwheat"
  "millet": "millet"
  "whole wheat pasta": "whole-grain-pasta"
  "butternut squash": "winter-squash"
  "acorn squash": "winter-squash"

  # Vegetables
  "spinach": "leafy-greens"
  "kale": "leafy-greens"
  "broccoli": "cruciferous"
  "cauliflower": "cruciferous"
  "carrots": "root-vegetables"
  "onions": "alliums"
  "garlic": "alliums"
  "tomatoes": "nightshades"
  "bell peppers": "nightshades"
  "zucchini": "summer-squash"
  "mushrooms": "mushrooms"

  # Flavorings
  "nutritional yeast": "nutritional-yeast"
  "soy sauce": "soy-sauce-tamari"
  "tamari": "soy-sauce-tamari"
  "miso": "miso"
  "salsa": "salsa"

  # RESTRICTED — must flag
  "olive oil": "all-oils"
  "coconut oil": "all-oils"
  "vegetable oil": "all-oils"
  "sesame oil": "all-oils"
  "butter": "butter"
  "margarine": "margarine"
  "beef": "red-meat"
  "chicken": "poultry"
  "salmon": "fish-all"
  "tuna": "fish-all"
  "eggs": "eggs"
  "milk": "dairy-all"
  "cheese": "dairy-all"
  "yogurt": "dairy-all"

  # LIMITED
  "flaxseed": "flaxseed"
  "walnuts": "nuts"
  "almonds": "nuts"
  "avocado": "avocado"
  "tofu": "tofu"
```

---

## Implementation Checklist

- [ ] Add `mcdougall` to the `DietKey` union type
- [ ] Add McDougall definition to `DIETS` record in `diets.ts`
- [ ] Add McDougall to the categorized diet picker (under "Plant-Based") in `ProfilesTab.tsx`
- [ ] Inject McDougall AI prompt instructions in `buildPrompt()`
- [ ] Add McDougall food-group rules to `assertMealCompliesWithDiet()` — CRITICAL: reject ALL oils, ALL animal products
- [ ] Add classifier mappings for McDougall-specific ingredients (potatoes, starches, nutritional yeast, etc.)
- [ ] Implement oil-free cooking instruction filter (replace "sauté in oil" with "sauté in water/broth")
- [ ] Ensure starch portion sizes are generous (not restricted) in meal generation
- [ ] Add B12 supplementation reminder in diet onboarding flow
- [ ] Add Maximum Weight Loss vs. Maintenance toggle for McDougall users
- [ ] Update seed data with a McDougall diet test user
- [ ] Add couple compatibility rules for McDougall + other diets (hard conflict with keto, carnivore, paleo, atkins)
- [ ] Add "no oil" safety guard — flag any recipe containing oil as non-compliant

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
