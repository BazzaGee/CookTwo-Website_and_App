# Whole30 — App Encoding Spec

> Machine-readable specification for integrating the Whole30 program into Cupla's AI meal generation system. This file is designed for direct implementation by developers. **Critical:** Whole30 is a **multi-phase diet** (elimination → reintroduction → maintenance) — the app must model these phases distinctly.

---

## Diet Metadata

```yaml
diet_key: "whole30"
display_label: "Whole30"
category: "ancestral"
emoji: "🚫"
short_description: "30-day elimination reset — identify food sensitivities and break sugar cravings"
evidence_grade: "C-D"
restrictiveness: 5  # 1-5 scale (most restrictive during elimination phase)
sodium_restriction: "none"
special_phases: true  # Multi-phase: elimination + reintroduction
```

---

## Multi-Phase Structure

Whole30 must be modeled as a **phase-based diet**. The app needs to track the current phase and apply different food rules accordingly.

```yaml
phases:
  phase_1_elimination:
    label: "Elimination (Days 1-30)"
    duration_days: 30
    description: "Strict elimination of all prohibited food groups"
    food_rules: "strict_whole30"  # Reference to strict rules below
    
  phase_2_reintroduction:
    label: "Reintroduction (Days 31-42+)"
    duration_days: 12  # Minimum; may extend
    description: "Systematic reintroduction of one food group at a time"
    food_rules: "reintroduction_protocol"  # Reference to reintroduction rules
    
  phase_3_food_freedom:
    label: "Food Freedom (Ongoing)"
    duration_days: null  # Indefinite
    description: "Personalized eating based on reintroduction results"
    food_rules: "personalized"  # User-defined based on reintro results

phase_tracking:
  requires_start_date: true
  current_day_calculated: true
  phase_transitions:
    - trigger: "day 31"
      from: "phase_1_elimination"
      to: "phase_2_reintroduction"
    - trigger: "user completes reintro"
      from: "phase_2_reintroduction"
      to: "phase_3_food_freedom"
  restart_rule: "If user consumes a non-compliant food during elimination, restart from Day 1"
```

---

## Food Group Rules

### Phase 1: Elimination — Allowed Food Groups (Strict Whole30)

```yaml
allowed_food_groups:
  # Meat, Seafood & Eggs
  - "red-meat"              # beef, bison, lamb, venison, pork (unprocessed, no additives)
  - "poultry"               # chicken, turkey, duck
  - "fish-fatty"            # salmon, mackerel, sardines, herring, trout
  - "fish-lean"             # cod, halibut, snapper, sea bass
  - "seafood"               # shrimp, scallops, crab, mussels, clams, oysters
  - "eggs"                  # all types, all preparations
  - "compliant-processed-meat"  # bacon/sausage/jerky ONLY if no sugar, no MSG, no carrageenan, no non-compliant additives

  # Vegetables (ALL — including potatoes)
  - "leafy-greens"          # spinach, kale, arugula, chard, collards, romaine
  - "cruciferous"           # broccoli, cauliflower, Brussels sprouts, cabbage
  - "alliums"               # onion, garlic, leeks, shallots, scallions
  - "peppers"               # bell peppers, chili peppers, jalapeños
  - "nightshades"           # tomatoes, eggplant, tomatillos (allowed on Whole30)
  - "root-vegetables"       # carrots, beets, turnips, parsnips, radishes
  - "white-potatoes"        # ALLOWED on Whole30 (unlike strict Paleo)
  - "sweet-potato"          # all sweet potatoes and yams
  - "cucurbit-vegetables"   # zucchini, yellow squash, cucumber, spaghetti squash
  - "winter-squash"         # butternut, acorn, kabocha
  - "mushrooms"             # all varieties
  - "green-beans"           # ALLOWED (technically legumes, but Whole30 permits)
  - "snap-peas"             # ALLOWED (pod > bean)
  - "asparagus"
  - "avocado"               # key fat source

  # Fruits (ALL whole fruits)
  - "berries"               # all berries
  - "citrus"                # oranges, lemons, limes, grapefruit
  - "stone-fruit"           # peaches, plums, apricots, cherries
  - "tropical-fruit"        # bananas, mangoes, pineapple, papaya
  - "pome-fruit"            # apples, pears
  - "melons"
  - "grapes"

  # Nuts & Seeds (all EXCEPT peanuts)
  - "nuts"                  # almonds, walnuts, macadamias, pecans, Brazil nuts, pistachios, cashews
  - "seeds"                 # pumpkin, sunflower, flax, chia, hemp, sesame
  - "nut-butters"           # almond butter, cashew butter (NO added sugar or oil)
  - "coconut"               # fresh, shredded, milk, oil, aminos, flour

  # Fats & Oils
  - "olive-oil"             # extra virgin preferred
  - "avocado-oil"
  - "coconut-oil"
  - "animal-fats"           # tallow, lard, duck fat (unprocessed)
  - "ghee"                  # clarified butter — the ONLY dairy exception
  - "olives"

  # Flavoring & Pantry
  - "herbs"                 # all fresh and dried herbs
  - "spices"                # all single-ingredient spices (no blends with sugar/additives)
  - "lemon-lime"            # whole fruit and juice
  - "vinegar"               # apple cider, white, red wine, balsamic, rice (no added sugar)
  - "coconut-aminos"        # soy sauce substitute
  - "mustard"               # if compliant (no sugar, no wine)
  - "hot-sauce"             # if compliant (no sugar, no MSG)
  - "salt"                  # all types (iodized, sea, kosher, Himalayan)

  # Beverages
  - "water"
  - "sparkling-water"
  - "coffee"                # black or with coconut milk/ghee
  - "tea"                   # green, herbal, black (no added sugar)
  - "bone-broth"
  - "fruit-juice-as-ingredient"  # juice ONLY as a recipe ingredient, NOT as a beverage
```

### Phase 1: Elimination — Restricted Food Groups (ZERO Tolerance)

```yaml
restricted_food_groups:
  # Sugar — ALL forms
  - "added-sugar"           # cane sugar, brown sugar, powdered sugar
  - "natural-sweeteners"    # honey, maple syrup, agave, coconut sugar, date sugar
  - "artificial-sweeteners" # stevia, monk fruit, Splenda, Equal, aspartame, sucralose, xylitol, erythritol
  - "fruit-juice-as-sweetener"  # using juice to sweeten (e.g., in dressings, sauces)

  # Alcohol
  - "alcohol"               # ALL — wine, beer, spirits, liqueurs, cooking wine
  - "alcohol-extracts"      # vanilla extract (alcohol-based), other alcohol-based extracts

  # Grains — ALL
  - "all-grains"            # wheat, rice, oats, corn, barley, rye, millet, sorghum, teff
  - "pseudo-cereals"        # quinoa, buckwheat, amaranth
  - "grain-products"        # bread, pasta, cereal, tortillas, crackers, all flours
  - "grain-flours"          # wheat flour, rice flour, almond flour, coconut flour (for baking)

  # Legumes — ALL (except green beans, snow peas, snap peas)
  - "legumes"               # beans (all), lentils, chickpeas, split peas
  - "peanuts"               # peanuts, peanut butter
  - "soy"                   # tofu, tempeh, edamame, miso, soy sauce, soy milk

  # Dairy — ALL (except ghee)
  - "dairy"                 # milk, cheese, yogurt, cream, sour cream, kefir
  - "butter"                # (ghee is the exception)
  - "dairy-derivatives"     # whey, casein, lactose

  # Specific Additives
  - "carrageenan"           # in non-dairy milks, deli meats, etc.
  - "msg"                   # monosodium glutamate and hidden forms (yeast extract, hydrolyzed protein, autolyzed yeast)
  - "sulfites"              # added sulfites (in some dried fruits, processed foods)

  # Recreated Foods (The "No Recreating" Rule)
  - "paleo-baked-goods"     # pancakes, muffins, cookies, breads made with compliant ingredients
  - "cauliflower-rice"      # if intended to simulate rice
  - "zucchini-noodles"      # if intended to simulate pasta
  - "banana-ice-cream"      # blended frozen banana as dessert
  - "date-energy-balls"     # treats made with compliant ingredients but in treat form

  # Processed/Junk
  - "processed-food"        # anything with non-compliant ingredients
  - "commercial-snacks"     # chips, crackers, candy, granola bars, protein bars
  - "fast-food"
  - "soda"                  # regular and diet
  - "juice"                 # as a beverage (only allowed as recipe ingredient)
```

### Phase 1: Elimination — Moderate Food Groups

```yaml
moderate_food_groups:
  - "dried-fruit": "allowed but moderate — do NOT use as sweetener substitute"
  - "fruit": "allowed but don't overeat — 1-2 servings per meal; don't let fruit crowd out vegetables"
  - "nuts": "healthy but calorie-dense — portion control for weight management"
  - "coffee": "allowed — 2-3 cups/day"
  - "compliant-bacon-sausage": "allowed IF no sugar, no MSG, no carrageenan, no nitrites — must verify"
  - "salt": "all salt types allowed — no restriction specified"
```

### Phase 2: Reintroduction — Special Rules

```yaml
reintroduction_protocol:
  description: "Reintroduce one food group at a time, observe for 2 days, then return to strict Whole30"
  
  schedule:
    - day: 31
      group: "legumes"
      examples: ["peanut butter", "soy sauce", "kidney beans", "lentils"]
      observe_days: 2
    - day: 34
      group: "non-gluten-grains"
      examples: ["corn tortilla", "rice", "oatmeal", "quinoa"]
      observe_days: 2
    - day: 37
      group: "dairy"
      examples: ["yogurt", "cheese", "milk", "ice cream"]
      observe_days: 2
    - day: 40
      group: "gluten-grains"
      examples: ["whole wheat bread", "pasta", "beer"]
      observe_days: 2

  observation_days_rule: "Between each reintroduction day, return to 100% strict Whole30 eating for 2 days"
  
  symptom_tracking:
    categories:
      - "digestive"        # bloating, gas, cramping, diarrhea, constipation, reflux
      - "energy"           # fatigue, crash, lethargy
      - "mood"             # irritability, anxiety, brain fog
      - "skin"             # acne, rash, itchiness
      - "sleep"            # difficulty sleeping, waking
      - "physical"         # joint pain, headache, congestion
      - "cravings"         # increased sugar/food cravings
    
  severity_scale: [1, 2, 3]  # mild, moderate, severe
  
  interpretation:
    no_reaction: "Food tolerated — can include in regular diet"
    mild_reaction: "Mild sensitivity — eat occasionally with awareness"
    strong_reaction: "Significant sensitivity — consider avoiding long-term"
```

---

## Macronutrient Targets

Whole30 does not prescribe macros — eat whole foods to satiety. The following reflects typical composition:

```yaml
macro_targets:
  # Whole30 does not track macros — these are observed typical ranges
  carbs_pct: [20, 35]        # from vegetables, fruits, potatoes
  protein_pct: [25, 35]      # from meat, fish, eggs at every meal
  fat_pct: [35, 45]          # from oils, nuts, avocado, coconut, ghee
  fiber_g: [25, 40]          # from vegetables, fruits, nuts
  sodium_mg: [0, 9999]       # no restriction (all salt allowed)
  note: "Whole30 explicitly discourages calorie counting, macro tracking, and weighing/measuring food"
```

---

## AI Prompt Instructions

### Phase 1 (Elimination, Days 1-30)

```
WHOLE30 ELIMINATION PHASE RULES — Follow with ZERO exceptions:

1. NO SUGAR OF ANY KIND: Do NOT include any added sugar — no cane sugar, brown sugar, honey, maple syrup, agave, coconut sugar, stevia, monk fruit, or any artificial sweetener. This is absolute. Read all labels mentally.

2. NO ALCOHOL: Do NOT include any alcohol — no wine, beer, spirits, or alcohol-based extracts (vanilla extract is OUT).

3. NO GRAINS: Do NOT include any grains — no wheat, rice, oats, corn, barley, rye, quinoa, buckwheat, or any flour (including almond flour and coconut flour for baking).

4. NO LEGUMES: Do NOT include beans, lentils, chickpeas, peanuts, soy, tofu, tempeh, or soy sauce (use coconut aminos). Green beans, snow peas, and snap peas ARE allowed.

5. NO DAIRY: Do NOT include milk, cheese, yogurt, butter, cream, or whey. GHEE (clarified butter) is the ONLY exception.

6. NO CARRAGEENAN, MSG, OR SULFITES: Check all ingredients for these additives.

7. NO RECREATING: Do NOT create "compliant versions" of off-plan foods — no pancakes, muffins, cookies, banana ice cream, cauliflower rice (as rice substitute), or zucchini noodles (as pasta substitute). Use compliant ingredients naturally, not to mimic prohibited foods.

8. PROTEIN AT EVERY MEAL: Include a protein source (meat, fish, or eggs) at every meal.

9. VEGETABLES AT EVERY MEAL: Fill your plate with vegetables. Aim for variety and abundance.

10. WHOLE FOODS ONLY: All foods should be whole, unprocessed, and have compliant ingredients. If you can't pronounce an ingredient or don't know what it is, don't use it.

11. POTATOES ARE ALLOWED: Both white and sweet potatoes are compliant on Whole30.

12. FRUIT IS ALLOWED: Fresh fruit is fine. Dried fruit is fine in moderation. Fruit juice is ONLY allowed as a recipe ingredient (e.g., lemon juice in dressing), NOT as a beverage or sweetener.

13. NO WEIGHING OR MEASURING: Focus on how food makes you feel, not on numbers.
```

### Phase 2 (Reintroduction, Days 31+)

```
WHOLE30 REINTRODUCTION PHASE RULES:

1. Today is a REINTRODUCTION DAY for [FOOD GROUP]. Include this food group in today's meals while keeping everything else 100% Whole30 compliant.

2. For the next 2 DAYS after reintroduction, return to 100% strict Whole30 eating.

3. Document any symptoms experienced: digestive (bloating, gas, diarrhea), energy (fatigue, crash), mood (irritability, brain fog), skin (acne, rash), sleep, physical (headache, joint pain), and cravings.

4. Rate symptom severity: mild (1), moderate (2), severe (3).

5. The reintroduction schedule is: Day 31 = Legumes, Day 34 = Non-gluten grains, Day 37 = Dairy, Day 40 = Gluten grains.

6. DO NOT reintroduce more than one food group per reintro day.
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    typical: "Eggs (2-4) cooked with vegetables in ghee or olive oil; avocado; fresh fruit; black coffee or tea"
    must_include: ["protein source (eggs or meat)", "vegetables", "healthy fat"]
    template: "1-2 palms protein + 2-3 cups vegetables + 1-2 thumbs fat"
    avoid: ["cereal", "oatmeal", "toast", "yogurt", "smoothies with dairy", "juice", "sweetened coffee"]

  lunch:
    typical: "Large salad with protein, multiple vegetables, nuts, olive oil dressing; OR leftovers from dinner"
    must_include: ["protein source", "vegetables (2+ types)", "healthy fat"]
    template: "1-2 palms protein + 2-3 cups vegetables + 1-2 thumbs fat + optional starchy vegetable"
    protein_preference: "chicken, fish, beef, pork, turkey, or eggs"
    avoid: ["sandwiches", "wraps", "rice bowls", "pasta", "cheese", "legume-based salads", "store-bought dressings with sugar"]

  dinner:
    typical: "Animal protein with roasted/steamed vegetables and a starchy vegetable (potato or sweet potato)"
    must_include: ["protein source", "vegetables (2+ types)", "healthy fat", "optional starchy vegetable"]
    template: "1-2 palms protein + 2-3 cups vegetables + 1-2 thumbs fat + optional starchy carb"
    protein_preference: "fish, beef, pork, poultry, or seafood"
    avoid: ["pasta", "rice", "bread", "cheese-based dishes", "soy sauce (use coconut aminos)"]

  snacks:
    typical: "Handful of nuts + fresh fruit; OR hard-boiled egg; OR vegetables with guacamole; OR olives"
    note: "Whole30 discourages snacking — eat enough at meals. But if genuinely hungry, compliant snacks are allowed."
    avoid: ["chips", "crackers", "candy", "granola bars", "protein bars", "trail mix with chocolate/sugar", "cheese", "yogurt"]
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - paleo

  adaptable_match:
    - keto: "Very compatible — both eliminate grains, sugar, dairy. Keto allows dairy and focuses on macros; Whole30 allows more carbs from fruit/potatoes"
    - high-protein: "Similar emphasis on protein at every meal"
    - low-carb: "Compatible during elimination phase"
    - mediterranean: "Share the fish, vegetables, olive oil, nuts base; Mediterranean partner adds whole grains, dairy, legumes"
    - flexitarian: "Share the vegetable base; Whole30 partner adds more meat"
    - volumetrics: "Both emphasize vegetables; Whole30 is more restrictive on fats and protein sources"

  hard_conflict:
    - vegan: "Nearly impossible — Whole30 eliminates all vegan protein sources (legumes, soy, dairy). Cannot be done as a vegan"
    - vegetarian: "Very difficult — eliminates legumes, soy, and dairy. Only protein sources are eggs and nuts"
    - mcdougall: "Opposite philosophy — McDougall is starch/grain-centric and very low fat; Whole30 eliminates all grains"
    - hclf-811: "Opposite — raw, high-carb, high-fruit, low-fat; Whole30 is moderate-carb, high-protein, high-fat with strict food restrictions"
    - vegetarian-indian: "Traditional Indian vegetarian cuisine relies on grains, legumes, and dairy — all eliminated on Whole30"
```

---

## Ingredient Classifier Reference

Key Whole30 ingredients and their food group classification for the safety guard:

```yaml
classifier_mappings:
  # Proteins — ALLOWED
  "salmon": "fish-fatty"
  "sardines": "fish-fatty"
  "mackerel": "fish-fatty"
  "tuna": "fish-fatty"
  "cod": "fish-lean"
  "halibut": "fish-lean"
  "shrimp": "seafood"
  "scallops": "seafood"
  "crab": "seafood"
  "beef": "red-meat"
  "bison": "red-meat"
  "lamb": "red-meat"
  "pork": "red-meat"
  "chicken": "poultry"
  "turkey": "poultry"
  "duck": "poultry"
  "eggs": "eggs"
  "bacon": "compliant-processed-meat"  # ONLY if no sugar/additives — otherwise FLAG
  "sausage": "compliant-processed-meat"  # ONLY if compliant — otherwise FLAG

  # Vegetables — ALLOWED (including potatoes)
  "spinach": "leafy-greens"
  "kale": "leafy-greens"
  "broccoli": "cruciferous"
  "cauliflower": "cruciferous"
  "white potato": "white-potatoes"  # ALLOWED on Whole30
  "potato": "white-potatoes"  # ALLOWED on Whole30
  "sweet potato": "sweet-potato"
  "tomato": "nightshades"
  "eggplant": "nightshades"
  "bell pepper": "peppers"
  "zucchini": "cucurbit-vegetables"
  "green beans": "green-beans"  # ALLOWED (exception to legume rule)
  "snap peas": "snap-peas"  # ALLOWED
  "avocado": "avocado"
  "mushrooms": "mushrooms"

  # Fruits — ALLOWED
  "blueberries": "berries"
  "strawberries": "berries"
  "banana": "tropical-fruit"
  "apple": "pome-fruit"
  "lemon": "citrus"
  "lime": "citrus"

  # Nuts & Seeds — ALLOWED (except peanuts)
  "almonds": "nuts"
  "walnuts": "nuts"
  "macadamia nuts": "nuts"
  "cashews": "nuts"
  "pumpkin seeds": "seeds"
  "flaxseed": "seeds"
  "coconut": "coconut"
  "almond butter": "nut-butters"  # if no added sugar/oil

  # Fats — ALLOWED
  "extra virgin olive oil": "olive-oil"
  "olive oil": "olive-oil"
  "avocado oil": "avocado-oil"
  "coconut oil": "coconut-oil"
  "ghee": "ghee"  # the ONLY dairy exception
  "tallow": "animal-fats"
  "coconut aminos": "coconut-aminos"

  # Flavoring — ALLOWED
  "apple cider vinegar": "vinegar"
  "balsamic vinegar": "vinegar"
  "mustard": "mustard"  # if compliant
  "hot sauce": "hot-sauce"  # if compliant
  "salt": "salt"
  "black pepper": "spices"
  "garlic powder": "spices"  # if single-ingredient
  "onion powder": "spices"  # if single-ingredient

  # EXCLUDED — flag as violations
  "honey": "natural-sweeteners"  # VIOLATION
  "maple syrup": "natural-sweeteners"  # VIOLATION
  "stevia": "artificial-sweeteners"  # VIOLATION
  "monk fruit": "artificial-sweeteners"  # VIOLATION
  "sugar": "added-sugar"  # VIOLATION
  "vanilla extract": "alcohol-extracts"  # VIOLATION (contains alcohol)
  "wine": "alcohol"  # VIOLATION
  "beer": "alcohol"  # VIOLATION
  "rice": "all-grains"  # VIOLATION
  "oats": "all-grains"  # VIOLATION
  "quinoa": "pseudo-cereals"  # VIOLATION
  "corn": "all-grains"  # VIOLATION
  "bread": "grain-products"  # VIOLATION
  "pasta": "grain-products"  # VIOLATION
  "almond flour": "grain-flours"  # VIOLATION (for baking)
  "coconut flour": "grain-flours"  # VIOLATION (for baking)
  "lentils": "legumes"  # VIOLATION
  "chickpeas": "legumes"  # VIOLATION
  "peanut butter": "peanuts"  # VIOLATION
  "tofu": "soy"  # VIOLATION
  "soy sauce": "soy"  # VIOLATION (use coconut aminos)
  "milk": "dairy"  # VIOLATION
  "cheese": "dairy"  # VIOLATION
  "yogurt": "dairy"  # VIOLATION
  "butter": "dairy"  # VIOLATION (use ghee)
  "cream": "dairy"  # VIOLATION
  "carrageenan": "carrageenan"  # VIOLATION
  "msg": "msg"  # VIOLATION
```

---

## Implementation Checklist

- [ ] Add `whole30` to the `DietKey` union type
- [ ] Add Whole30 definition to `DIETS` record in `diets.ts`
- [ ] Add Whole30 to the categorized diet picker in `ProfilesTab.tsx`
- [ ] **Implement multi-phase tracking system** — `start_date`, `current_day`, `current_phase`
- [ ] Implement phase-specific food rules (elimination vs. reintroduction vs. food freedom)
- [ ] Inject elimination-phase AI prompt instructions in `buildPrompt()`
- [ ] Inject reintroduction-phase AI prompt instructions (with current reintro food group)
- [ ] Add Whole30 food-group rules to `assertMealCompliesWithDiet()` — enforce: NO sugar (any form), NO alcohol, NO grains, NO legumes, NO dairy, NO carrageenan/MSG/sulfites, NO recreated foods
- [ ] **Implement "no recreating" rule** in ingredient classifier — flag cauliflower rice, zucchini noodles, banana ice cream, paleo baked goods
- [ ] Implement reintroduction schedule tracker (Day 31 = legumes, Day 34 = grains, Day 37 = dairy, Day 40 = gluten)
- [ ] Implement symptom tracking UI for reintroduction phase
- [ ] Add "restart from Day 1" feature if user reports a non-compliant food
- [ ] Add classifier mappings for Whole30-specific ingredients
- [ ] Add couple compatibility rules for Whole30 + other diets
- [ ] Add psychological safety warning (eating disorder history screening)
- [ ] Add calcium adequacy reminder (no dairy for 30 days)
- [ ] Update seed data with a Whole30 test user (including phase state)
- [ ] Add reintro-day special handling (allow ONE specific food group that day)

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
