# Carnivore Diet — App Encoding Spec

> Machine-readable specification for integrating the carnivore diet into Cupla's AI meal generation system. This file is designed for direct implementation by developers.

---

## Diet Metadata

```yaml
diet_key: "carnivore"
display_label: "Carnivore"
category: "lowCarb"
emoji: "🥩"
short_description: "Animal foods only — zero carb, zero plants. Extreme elimination approach."
evidence_grade: "D"
restrictiveness: 5  # 1-5 scale (maximum)
sodium_restriction: "none"
carb_limit_g: 5  # essentially zero carb
requires_ketosis: true  # naturally induces ketosis
warning: "No RCTs exist. Not endorsed by any health organization. Requires medical supervision and biomarker monitoring."
```

---

## Food Group Rules

### Allowed Food Groups (Core Ingredients)

```yaml
allowed_food_groups:
  # Meats — all types (the foundation)
  - "red-meat"               # beef, lamb, venison, bison — all cuts
  - "fatty-meat"             # ribeye, brisket, pork belly, short ribs
  - "poultry"                # chicken (with skin), turkey, duck
  - "pork"                   # pork chops, ribs, belly, bacon (no sugar)
  - "bacon"                  # no-sugar-added only
  - "sausage"                # no-sugar-added, no fillers only
  - "organ-meats"            # liver, heart, kidney, brain, marrow, sweetbreads
  - "deli-meat"              # only if no sugar/carb/plant fillers

  # Fish and Seafood (all types)
  - "fish-fatty"             # salmon, mackerel, sardines, herring
  - "fish-lean"              # cod, halibut, tuna, snapper
  - "seafood"                # shrimp, oysters, clams, mussels, crab, lobster

  # Eggs
  - "eggs"                   # whole eggs, unlimited

  # Animal Fats
  - "beef-tallow"            # primary cooking fat
  - "lard"                   # pork fat
  - "duck-fat"
  - "butter"                 # included by most (not strictest)
  - "ghee"                   # clarified butter
  - "bone-marrow"            # nutrient-dense fat
  - "animal-fats"            # general category

  # Dairy (OPTIONAL — varies by practitioner)
  - "cheese"                 # hard cheese (cheddar, parmesan) — many include
  - "cream-cheese"           # some include
  - "heavy-cream"            # some include
  - "sour-cream"             # some include
  - "butter-dairy"           # most include (also listed in fats)

  # Broth
  - "bone-broth"             # widely included for electrolytes

  # Flavoring (minimal)
  - "salt"                   # universal — used liberally

  # Beverages
  - "water"                  # universal
  - "sparkling-water"        # generally included
  - "bone-broth-beverage"    # included
```

### Optional Food Groups (Practitioner-Dependent)

```yaml
optional_food_groups:
  # These are included by SOME practitioners but excluded by strict carnivores
  - "coffee": "Included by many; excluded by strict purists (plant extract)"
  - "tea": "Included by some; excluded by strict (plant extract)"
  - "spices": "Included by lenient carnivores; excluded by strict (plant-derived)"
  - "herbs": "Included by lenient; excluded by strict (plant-derived)"
  - "hot-sauce": "Included by some; excluded by strict (plant-derived)"
  - "mustard": "Included by some; excluded by strict (contains seeds)"
  - "pepper": "Included by many; excluded by strict (plant-derived)"
  - "cheese-full": "Included by most non-strict; excluded by PKD protocol"
  - "heavy-cream-dairy": "Included by some; excluded by dairy-sensitive"
```

### Restricted Food Groups (ALL Plant Foods)

```yaml
restricted_food_groups:
  # ALL vegetables
  - "all-vegetables"         # leafy greens, cruciferous, root, nightshades, alliums, ALL
  - "leafy-greens"           # spinach, kale, lettuce, etc.
  - "cruciferous"            # broccoli, cauliflower, cabbage, etc.
  - "tomatoes"               # ALL vegetables
  - "peppers"                # ALL vegetables
  - "root-vegetables"        # carrots, beets, potatoes, sweet potatoes
  - "onions-garlic"          # ALL vegetables
  - "mushrooms"              # fungi (debated — excluded by most)
  - "avocado"                # fruit
  - "zucchini-squash"        # ALL vegetables

  # ALL fruits
  - "all-fruits"             # apples, bananas, berries, citrus, tropical — ALL
  - "berries"                # raspberries, blueberries, etc.
  - "citrus"                 # oranges, lemons, etc.
  - "tropical-fruit"         # banana, mango, pineapple
  - "dried-fruit"            # raisins, dates

  # ALL grains
  - "all-grains"             # wheat, rice, oats, corn, barley, quinoa — ALL
  - "bread"
  - "pasta"
  - "cereal"

  # ALL legumes
  - "all-legumes"            # beans, lentils, chickpeas, peas, peanuts — ALL

  # ALL nuts and seeds
  - "all-nuts"               # almonds, walnuts, macadamia, etc. — ALL
  - "all-seeds"              # chia, flax, sunflower, pumpkin — ALL

  # ALL plant oils
  - "olive-oil"              # plant-derived
  - "coconut-oil"            # plant-derived
  - "avocado-oil"            # plant-derived
  - "seed-oils"              # canola, soybean, sunflower, etc.
  - "all-plant-oils"

  # ALL sugar and sweeteners (plant-derived)
  - "sugar"
  - "honey"
  - "maple-syrup"
  - "stevia"                 # plant-derived
  - "monk-fruit"             # plant-derived
  - "erythritol"             # fermentation-derived (excluded by strict)

  # ALL plant-based beverages
  - "fruit-juice"
  - "vegetable-juice"
  - "herbal-tea"             # strict exclude
  - "wine"                   # strict exclude (fermented plant product)
  - "beer"                   # grain-derived

  # Ultra-processed foods
  - "ultra-processed-food"   # ALL processed foods
  - "soy-products"           # tofu, tempeh — legume-derived
  - "plant-based-meat"       # beyond/impossible — plant-derived

  # Plant-based supplements (if strict)
  - "plant-extracts"         # if strict — includes most supplements
```

---

## Macronutrient Targets

```yaml
macro_targets:
  carbs_pct: [0, 2]             # 0-2% of calories (near zero)
  protein_pct: [20, 35]         # 20-35% of calories
  fat_pct: [65, 80]             # 65-80% of calories
  net_carbs_g: [0, 10]          # essentially zero (trace only)
  total_carbs_g: [0, 10]        # trace from meat/eggs/dairy
  fiber_g: [0, 0]               # ZERO — no plant foods
  sodium_mg: [3000, 6000]       # high; liberal salt use
  potassium_mg: [3000, 4500]    # from meat, fish; may need supplementation
  magnesium_mg: [300, 500]      # suboptimal from meat alone; supplement
  calcium_mg: [0, 1000]         # very low without dairy; monitor
```

---

## AI Prompt Instructions

```
CARNIVORE DIET RULES — Follow strictly:

1. ANIMAL FOODS ONLY: Every meal must consist EXCLUSIVELY of animal products — meat, fish, eggs, and optionally dairy. NO plant foods of any kind.

2. NO VEGETABLES: Do NOT include any vegetables — no leafy greens, no broccoli, no cauliflower, no tomatoes, no peppers, no onions, no garlic, no mushrooms, no avocado, no zucchini, NO plant matter of any kind.

3. NO FRUIT: Do NOT include any fruit — no berries, no apples, no lemons (even as garnish), no avocado.

4. NO GRAINS: Do NOT include any grains — no bread, no rice, no pasta, no oats.

5. NO LEGUMES: Do NOT include beans, lentils, chickpeas, or peas.

6. NO NUTS OR SEEDS: Do NOT include any nuts, seeds, or seed-derived products.

7. NO PLANT OILS: Use ONLY animal fats for cooking — tallow, lard, duck fat, butter, or ghee. Do NOT use olive oil, coconut oil, avocado oil, or any plant oil.

8. MEAT IS THE FOCUS: Each meal should center on a substantial portion of meat (225-450g / 8-16oz). Ribeye steak, ground beef, brisket, pork belly, lamb chops, or fatty fish are typical mains.

9. FAT IS ESSENTIAL: Ensure adequate fat intake. Choose fatty cuts (ribeye, 80/20 ground beef, pork belly) or add tallow/butter. Lean meat alone is dangerous ("rabbit starvation").

10. SALT: Use salt liberally. It is the primary and often only seasoning.

11. EGGS AND DAIRY: Eggs are included freely. Dairy (cheese, butter, heavy cream) is optional — include if the user has not excluded it. When in doubt, include butter but ask about other dairy.

12. ORGAN MEATS: Recommend including organ meats (especially liver) 1-2 times per week for nutrient density, if the user is willing.

13. BEVERAGES: Water and bone broth only (unless the user specifies they include coffee/tea). Do NOT include juice, herbal tea, or any plant-based beverage.

14. ZERO CARB CALCULATION: Daily carbohydrate total should be effectively zero (trace amounts from meat/eggs/dairy only, typically <5g).

15. DO NOT add herbs, spices, lemon juice, vinegar, or any plant-derived seasoning unless the user explicitly states they are a "lenient" carnivore.
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    typical: "Eggs (4-8) scrambled in butter or tallow with bacon/sausage (no sugar); OR leftover steak/ground beef; OR skip (many carnivores practice intermittent fasting)"
    must_include: ["animal protein", "animal fat"]
    optional: ["organ meats (liver)"]
    avoid: ["ALL plant foods", "toast", "fruit", "juice", "oatmeal", "cereal", "hash browns"]

  lunch:
    typical: "Steak, ground beef, or fish (225-340g) cooked in animal fat with salt; OR skip (many eat 1-2 meals/day)"
    must_include: ["animal protein", "animal fat"]
    protein_preference: "beef (preferred), fish, pork, poultry"
    avoid: ["ALL plant foods", "salad", "rice", "bread", "any vegetable"]

  dinner:
    typical: "Large portion of meat (340-450g): ribeye, brisket, pork belly, salmon, lamb; cooked in tallow/butter; salted"
    must_include: ["animal protein", "animal fat"]
    protein_preference: "beef ribeye or fatty cut; fish 2-3x/week; organ meats 1-2x/week"
    avoid: ["ALL plant foods", "potatoes", "vegetables", "salad", "any side dish from plants"]

  snacks:
    typical: "Beef jerky (no sugar), hard-boiled eggs, cheese (if dairy included), leftover meat, bone broth"
    must_include: ["animal protein or fat"]
    avoid: ["ALL plant-based snacks", "nuts", "fruit", "chips", "crackers"]
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - keto  # very similar; keto just adds some plant foods
    - paleo  # somewhat compatible; paleo includes meat but also plants

  adaptable_match:
    - high-protein: "Shared meat/protein focus; carnivore partner eats meat only; high-protein partner adds vegetables/grains"
    - whole30: "Both eliminate processed foods; shared meat base; Whole30 partner adds vegetables, fruit, compliant carbs"

  difficult_match:
    - mediterranean: "Carnivore is plant-free; Mediterranean is plant-forward. Can share a protein (steak, fish, chicken) but carnivore partner eats only the meat; Mediterranean partner adds vegetables, grains, olive oil, salad. Suggest cooking a shared protein and separate side dishes."
    - flexitarian: "Carnivore partner eats only animal foods; flexitarian partner eats mostly plants with some meat. Minimal shared base."
    - volumetrics: "Opposite approaches — volumetrics relies on high-volume plant foods; carnivore is all animal. Suggest separate meals."
    - dash: "DASH is plant-forward and low-saturated-fat; carnivore is the opposite. Very difficult."

  hard_conflict:
    - vegan: "MAXIMUM conflict — vegan excludes ALL animal products; carnivore excludes ALL plant products. Zero overlap. Suggest completely separate meals."
    - vegetarian: "Nearly maximum conflict — only eggs/dairy overlap (if carnivore includes them). Very difficult."
    - mcdougall: "Maximum conflict — McDougall is 70-80% carbohydrate from starches; carnivore is zero carb. Opposites."
    - pritikin: "Maximum conflict — Pritikin is <10% fat, plant-forward; carnivore is 70%+ fat, animal-only."
    - ornish: "Maximum conflict — Ornish is <10% fat, plant-based; carnivore is high-fat, animal-only."
    - hclf-811: "Maximum conflict — 80% carb, 10% fat, raw plant foods; carnivore is the exact opposite."
    - mind: "Strong conflict — MIND is plant-forward for brain health; carnivore is plant-free."
    - anti-inflammatory: "Most anti-inflammatory diets are plant-forward; carnivore contradicts this approach."
```

---

## Ingredient Classifier Reference

Key carnivore ingredients and their food group classification for the safety guard:

```yaml
classifier_mappings:
  # ALLOWED — Meats
  "ribeye": "fatty-meat"
  "steak": "red-meat"
  "beef": "red-meat"
  "ground beef": "red-meat"
  "brisket": "fatty-meat"
  "short ribs": "fatty-meat"
  "pork": "pork"
  "pork belly": "fatty-meat"
  "pork chops": "pork"
  "bacon": "bacon"
  "lamb": "red-meat"
  "venison": "red-meat"
  "bison": "red-meat"
  "chicken": "poultry"
  "chicken thighs": "poultry"
  "chicken wings": "poultry"
  "turkey": "poultry"
  "duck": "poultry"

  # ALLOWED — Organ meats
  "liver": "organ-meats"
  "beef liver": "organ-meats"
  "heart": "organ-meats"
  "kidney": "organ-meats"
  "bone marrow": "bone-marrow"
  "sweetbreads": "organ-meats"

  # ALLOWED — Fish
  "salmon": "fish-fatty"
  "mackerel": "fish-fatty"
  "sardines": "fish-fatty"
  "herring": "fish-fatty"
  "tuna": "fish-lean"
  "cod": "fish-lean"
  "shrimp": "seafood"
  "oysters": "seafood"

  # ALLOWED — Eggs
  "eggs": "eggs"
  "egg yolks": "eggs"

  # ALLOWED — Fats
  "beef tallow": "beef-tallow"
  "tallow": "beef-tallow"
  "lard": "lard"
  "duck fat": "duck-fat"
  "butter": "butter"
  "ghee": "ghee"

  # OPTIONAL — Dairy
  "cheddar cheese": "cheese"
  "parmesan": "cheese"
  "heavy cream": "heavy-cream"

  # ALLOWED — Other
  "bone broth": "bone-broth"
  "salt": "salt"

  # RESTRICTED — ALL Plant Foods
  "spinach": "all-vegetables"           # RESTRICTED
  "broccoli": "all-vegetables"          # RESTRICTED
  "tomatoes": "all-vegetables"          # RESTRICTED
  "avocado": "all-fruits"               # RESTRICTED
  "olive oil": "all-plant-oils"         # RESTRICTED
  "coconut oil": "all-plant-oils"       # RESTRICTED
  "almonds": "all-nuts"                 # RESTRICTED
  "rice": "all-grains"                  # RESTRICTED
  "bread": "all-grains"                 # RESTRICTED
  "bananas": "all-fruits"               # RESTRICTED
  "lemon": "all-fruits"                 # RESTRICTED (even as garnish)
  "lentils": "all-legumes"              # RESTRICTED
  "sugar": "sugar"                      # RESTRICTED
  "stevia": "stevia"                    # RESTRICTED (plant-derived)
```

---

## Safety Guard Rules

```yaml
safety_guard:
  # CRITICAL: This diet is the most restrictive in the system.
  # The safety guard must REJECT any meal containing plant ingredients.

  hard_blocks:
    - "any vegetable of any kind"
    - "any fruit of any kind"
    - "any grain of any kind"
    - "any legume of any kind"
    - "any nut or seed"
    - "any plant oil"
    - "any sugar or plant sweetener"
    - "any herb or spice (if strict mode)"
    - "any plant-based beverage"

  warnings_to_display:
    - "No RCTs exist for the carnivore diet. Health claims are unsubstantiated."
    - "No major health organization endorses this diet."
    - "Monitor LDL cholesterol, ApoB, and kidney function regularly."
    - "Vitamin C, folate, magnesium, calcium, and fiber intake may be inadequate."
    - "Consult a physician before starting and during this diet."
    - "This diet has maximum restrictiveness (5/5) and may impact social eating."

  required_disclaimers:
    onboarding: "The carnivore diet has no clinical trial evidence. It is not recommended by any major health organization. Potential risks include elevated cholesterol, nutrient deficiencies, and unknown long-term effects. Please consult your physician before starting."
    meal_generation: "This meal plan is generated based on the carnivore dietary pattern as described by practitioners. It does not constitute a medical recommendation."
```

---

## Implementation Checklist

- [ ] Add `carnivore` to the `DietKey` union type
- [ ] Add Carnivore definition to `DIETS` record in `diets.ts`
- [ ] Add Carnivore to the categorized diet picker in `ProfilesTab.tsx`
- [ ] Add evidence_grade warning banner (Grade D — "No RCTs; not endorsed by any health organization")
- [ ] Inject Carnivore AI prompt instructions in `buildPrompt()`
- [ ] Add Carnivore food-group rules to `assertMealCompliesWithDiet()` — **critical: reject ALL plant foods**
- [ ] Add classifier mappings for Carnivore ingredients (especially ALL restricted plant items)
- [ ] Add safety guard disclaimers and warnings for onboarding and meal generation
- [ ] Update seed data with a Carnivore diet test user
- [ ] Add couple compatibility rules for Carnivore + other diets (maximum conflicts noted)
- [ ] Add health monitoring reminders (lipid panel, ApoB, kidney function, nutrient panels)
- [ ] Add physician consultation prompt in onboarding flow
- [ ] Consider adding a "lenient vs strict" toggle (strict = no coffee/spices/dairy; lenient = includes some)

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
