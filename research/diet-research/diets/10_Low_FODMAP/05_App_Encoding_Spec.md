# Low FODMAP Diet — App Encoding Spec

> Machine-readable specification for integrating the Low FODMAP diet into Cupla's AI meal generation system. This file is designed for direct implementation by developers.

---

## Diet Metadata

```yaml
diet_key: "low-fodmap"
display_label: "Low FODMAP"
category: "therapeutic"
emoji: "🫃"
short_description: "Elimination diet for IBS — removes fermentable carbs that trigger bloating"
evidence_grade: "B"
restrictiveness: 4  # 1-5 scale (high during elimination, low after personalization)
sodium_restriction: "none"
special_phases: true
phases:
  - key: "elimination"
    label: "Elimination (2–6 weeks)"
    description: "Strict avoidance of all high-FODMAP foods"
  - key: "reintroduction"
    label: "Reintroduction (6–8 weeks)"
    description: "Systematically test each FODMAP subgroup"
  - key: "personalization"
    label: "Personalization (long-term)"
    description: "Modified diet based on individual tolerance"
```

---

## Food Group Rules

### Allowed Food Groups (Low FODMAP — Elimination Phase)

```yaml
allowed_food_groups:
  # Grains & Starches (low FODMAP)
  - "rice"                  # white, brown, basmati, jasmine, arborio — all types
  - "oats"                  # rolled, quick oats (moderate portions)
  - "quinoa"
  - "potatoes"              # white and sweet (moderate)
  - "corn"                  # cornmeal, polenta, tortillas, popcorn
  - "gluten-free-grains"    # millet, sorghum, teff, buckwheat, amaranth
  - "rice-noodles"          # all rice noodle types
  - "sourdough-spelt"       # authentic long-fermented sourdough

  # Proteins (all are low FODMAP in plain form)
  - "chicken"               # all preparations, plain
  - "turkey"
  - "beef"                  # lean cuts
  - "pork"                  # lean cuts
  - "lamb"
  - "fish-all"              # all fish types — salmon, cod, tuna, trout, etc.
  - "seafood"               # shrimp, scallops, oysters, mussels
  - "eggs"
  - "tofu-firm"             # firm/extra-firm only (not silken in large amounts)
  - "tempeh"                # plain, unflavored

  # Low-FODMAP Vegetables
  - "spinach"
  - "zucchini"
  - "bell-peppers"          # red, green, yellow
  - "carrots"
  - "tomatoes"              # moderate portions
  - "cucumber"
  - "green-beans"           # 75g portion
  - "lettuce"               # all types
  - "eggplant"              # 75g portion
  - "kale"
  - "bok-choy"
  - "pumpkin"               # 75g portion
  - "bean-sprouts"
  - "potatoes"              # white and sweet (moderate)

  # Low-FODMAP Fruits
  - "bananas"               # firm-ripe; avoid overripe
  - "blueberries"           # 40g / ¼ cup
  - "strawberries"          # 65g / 5 medium
  - "oranges"
  - "kiwi"
  - "mandarins"
  - "raspberries"           # 60g
  - "pineapple"             # 75g
  - "cantaloupe"            # 75g
  - "papaya"                # 75g
  - "lemon-lime"            # juice for flavoring

  # Dairy (lactose-free)
  - "lactose-free-milk"
  - "lactose-free-yogurt"
  - "hard-cheese"           # cheddar, swiss, parmesan, brie — virtually lactose-free
  - "feta"
  - "butter"                # safe — not a FODMAP
  - "lactose-free-cottage-cheese"

  # Nuts & Seeds (portion-limited)
  - "almonds"               # max 10 nuts
  - "walnuts"               # max 10 halves
  - "pecans"                # max 10 halves
  - "macadamia-nuts"        # max 10 nuts
  - "peanuts"               # max 32 nuts
  - "pine-nuts"             # 1 tbsp
  - "pumpkin-seeds"         # 1 tbsp
  - "sesame-seeds"          # 1 tbsp
  - "chia-seeds"            # 2 tbsp
  - "sunflower-seeds"       # 1 tbsp

  # Fats & Oils
  - "olive-oil"
  - "coconut-oil"
  - "peanut-butter"         # plain, 2 tbsp max
  - "garlic-infused-oil"    # KEY FLAVOR HACK — safe, not water-soluble
  - "herb-infused-oils"

  # Flavorings
  - "herbs-all"             # all fresh/dried herbs
  - "spices-all"            # all spices
  - "spring-onion-green"    # GREEN PART ONLY
  - "chives"
  - "asafoetida"            # hing — onion/garlic substitute
  - "soy-sauce"             # 2 tbsp max
  - "maple-syrup"
  - "rice-malt-syrup"
  - "vinegar-all"           # most types
  - "mustard-plain"
  - "miso-paste"            # 1 tbsp max

  # Beverages
  - "water"
  - "coffee"                # black or with lactose-free milk
  - "tea-black"
  - "tea-green"
  - "tea-peppermint"
  - "tea-chamomile"
```

### Restricted Food Groups (High FODMAP — Elimination Phase)

```yaml
restricted_food_groups:
  # High Fructans
  - "wheat-large-amounts"   # bread, pasta, cereal (note: small amounts like soy sauce OK)
  - "rye"
  - "barley"
  - "onion-all"             # ALL types: red, white, spring onion BULB, shallots
  - "garlic-all"            # fresh, powder, salt, paste (NOTE: garlic-infused OIL is OK)
  - "leeks-bulb"            # green leaves OK
  - "asparagus"
  - "artichoke-globe"
  - "inulin-chicory-root"   # check labels — common additive
  - "brussels-sprouts"
  - "savoy-cabbage"

  # High GOS
  - "lentils-large"         # large amounts of red/brown/green lentils
  - "chickpeas-large"
  - "beans-large"           # kidney, black, navy, pinto beans
  - "soy-milk-whole-bean"   # soy milk made from whole soybeans
  - "pistachios"
  - "cashews"

  # High Lactose
  - "cow-milk"              # regular cow's milk
  - "regular-yogurt"        # lactose-containing yogurt
  - "ice-cream"             # dairy ice cream
  - "ricotta"
  - "cottage-cheese-regular"
  - "soft-cheese-lactose"   # mascarpone, etc.

  # High Excess Fructose
  - "apples"
  - "pears"
  - "watermelon"
  - "mangoes"
  - "honey"
  - "agave-nectar"
  - "high-fructose-corn-syrup"
  - "dried-fruit"           # raisins, dates, figs, prunes
  - "cherries-large"
  - "apple-juice"
  - "pear-juice"

  # High Polyols
  - "avocado-large"         # >¼ avocado per serving
  - "mushrooms"             # all types
  - "cauliflower-large"
  - "celery-large"
  - "blackberries"
  - "stone-fruit-large"     # nectarines, peaches, plums (large amounts)
  - "apricots"
  - "sugar-alcohols"        # xylitol, sorbitol, maltitol — in gum, mints, sugar-free foods
```

### Moderate Food Groups (Phase-Dependent / Portion-Limited)

```yaml
moderate_food_groups:
  # During elimination — strict avoidance. After personalization — based on individual testing.
  - "wheat-small": "soy sauce (2 tbsp), small amounts in cooking — generally tolerated"
  - "avocado-small": "¼ avocado per serving — tolerated by most"
  - "sweet-potato": "½ cup (75g) — moderate mannitol"
  - "tomatoes": "½ cup — safe at moderate portions; large amounts may be high fructose"
  - "oats": "½ cup cooked — safe; larger amounts higher in fructans/GOS"
  - "canned-lentils": "½ cup canned (rinsed) — GOS reduced by canning/draining"
  - "sourdough": "1–2 slices long-fermented — fructans reduced by fermentation"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  carbs_pct: [45, 55]        # Normal range — NOT a low-carb diet
  protein_pct: [15, 20]      # Unchanged
  fat_pct: [25, 35]          # Unchanged
  saturated_fat_pct: [0, 10] # No specific restriction
  fiber_g: [20, 30]          # Monitor — may decrease on elimination
  sodium_mg: [0, 2300]       # No specific restriction
  fodmap_g: [0, 5]           # <5g FODMAPs/day during elimination phase
```

---

## AI Prompt Instructions

```
LOW FODMAP DIET RULES — Follow strictly (ELIMINATION PHASE):

1. NO ONION OR GARLIC: Do NOT include onion (any type), garlic (fresh, powder, salt, or paste) in any recipe. Use garlic-infused olive oil for garlic flavor. Use spring onion GREENS ONLY or chives for onion flavor. Asafoetida (hing) can substitute for both.

2. GRAINS: Use rice, quinoa, oats (moderate portions), potatoes, corn, or gluten-free grains. Avoid wheat-based bread/pasta in main dishes. (Small amounts of wheat in soy sauce are fine.)

3. DAIRY: Use lactose-free milk and yogurt, or hard cheeses (cheddar, Swiss, parmesan, brie, feta). Avoid regular cow's milk, regular yogurt, ice cream, ricotta, and regular cottage cheese. Butter is fine.

4. FRUITS: Use bananas (firm-ripe), blueberries, strawberries, oranges, kiwi, mandarins, raspberries, pineapple. Avoid apples, pears, watermelon, mangoes, honey, agave, dried fruits.

5. VEGETABLES: Use spinach, zucchini, bell peppers, carrots, tomatoes (moderate), cucumber, green beans, lettuce, eggplant, kale, bok choy. Avoid onions, garlic, mushrooms, cauliflower, large amounts of celery, asparagus, Brussels sprouts.

6. LEGUMES: Avoid lentils, chickpeas, and beans during elimination. Use firm tofu and tempeh as plant protein.

7. NUTS: Limit almonds to 10, walnuts to 10 halves. Avoid cashews and pistachios entirely.

8. PROTEINS: All plain meat, fish, poultry, eggs, and firm tofu are safe. Watch out for marinades/seasonings containing onion or garlic powder.

9. SWEETENERS: Use maple syrup or rice malt syrup. Do NOT use honey or agave. Avoid sugar alcohols (xylitol, sorbitol, maltitol).

10. LABEL CHECKING: Be aware that onion powder, garlic powder, inulin, chicory root, honey, agave, and high-fructose corn syrup are common additives in sauces, dressings, and processed foods.

11. FLAVOR STRATEGY: Rely on herbs (basil, oregano, thyme, rosemary, parsley, cilantro), spices (cumin, paprika, turmeric, ginger, cinnamon), lemon/lime juice, garlic-infused oil, spring onion greens, and chives for flavor.

12. PORTION AWARENESS: Many foods are low FODMAP only at specific serving sizes. When in doubt, use conservative portions. Cross-reference with Monash app thresholds.

PHASE NOTE: If user is in REINTRODUCTION or PERSONALIZATION phase, relax restrictions for the specific FODMAP subgroup(s) they have tested and tolerate.
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    typical: "GF oats with lactose-free milk and banana; OR eggs with spinach and GF toast; OR lactose-free yogurt with strawberries and chia seeds"
    must_include: ["protein source", "low-FODMAP grain OR fruit"]
    avoid: ["wheat cereal", "regular milk", "honey-sweetened items", "apple juice"]

  lunch:
    typical: "Protein (chicken/fish/tofu) with rice or quinoa and low-FODMAP vegetables; OR salad with hard cheese, protein, olive oil-lemon dressing"
    must_include: ["protein", "low-FODMAP grain OR vegetables"]
    protein_preference: "chicken, fish, eggs, firm tofu, hard cheese"
    avoid: ["wheat bread", "onion", "garlic", "regular dressings with onion/garlic"]

  dinner:
    typical: "Grilled/baked protein with potatoes/rice and steamed low-FODMAP vegetables"
    must_include: ["protein", "vegetables", "carbohydrate source"]
    protein_preference: "fish, chicken, lean meat, firm tofu, tempeh"
    avoid: ["pasta (wheat)", "garlic/onion in sauces", "cream-based sauces with lactose"]

  snacks:
    typical: "Banana, lactose-free yogurt, rice cakes with peanut butter, handful of almonds (max 10), hard cheese with GF crackers"
    avoid: ["apples", "protein bars with sugar alcohols", "hummus", "regular yogurt"]
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - gluten-free
    - dairy-free

  adaptable_match:
    - mediterranean: "Adapt recipes — use garlic-infused oil instead of garlic, spring onion greens instead of onion, rice/quinoa instead of wheat, limit legumes"
    - paleo: "Good overlap — both emphasize whole foods, meat, fish, vegetables; adapt vegetables (avoid onion, garlic, mushrooms, cauliflower)"
    - whole30: "Similar whole-food approach; swap non-compliant items"
    - high-protein: "Easy — most protein sources are low FODMAP; just avoid onion/garlic seasonings"
    - keto: "Possible — focus on meat, fish, eggs, low-FODMAP vegetables, olive oil; avoid high-FODMAP keto foods (avocado large portions, cauliflower, garlic)"

  hard_conflict:
    - vegan: "Difficult — most plant protein sources (legumes) are high FODMAP; requires careful tofu/tempeh planning and B12 monitoring"
    - mcdougall: "Opposite philosophy — McDougall emphasizes wheat, potatoes, and starches; wheat is high FODMAP; very difficult to combine"
    - raw-vegan: "Difficult — many raw fruits/vegetables are high FODMAP; limited options"
    - mediterranean: "Manageable but requires significant modification — onion, garlic, wheat, and legumes are Mediterranean staples"
```

---

## FODMAP Subgroup Classifier Reference

```yaml
fodmap_subgroup_mappings:
  # Fructans
  "wheat": "fructan"
  "rye": "fructan"
  "barley": "fructan"
  "onion": "fructan"
  "garlic": "fructan"
  "leek bulb": "fructan"
  "asparagus": "fructan"
  "artichoke": "fructan"
  "inulin": "fructan"
  "brussels sprouts": "fructan"

  # GOS
  "lentils": "gos"
  "chickpeas": "gos"
  "kidney beans": "gos"
  "black beans": "gos"
  "soy milk": "gos"
  "pistachios": "gos"

  # Lactose
  "cow's milk": "lactose"
  "regular yogurt": "lactose"
  "ice cream": "lactose"
  "ricotta": "lactose"
  "cottage cheese": "lactose"

  # Excess Fructose
  "apples": "excess-fructose"
  "pears": "excess-fructose"
  "watermelon": "excess-fructose"
  "mangoes": "excess-fructose"
  "honey": "excess-fructose"
  "agave": "excess-fructose"
  "high fructose corn syrup": "excess-fructose"

  # Polyols (Sorbitol)
  "avocado": "sorbitol"
  "blackberries": "sorbitol"
  "peaches": "sorbitol"
  "nectarines": "sorbitol"

  # Polyols (Mannitol)
  "mushrooms": "mannitol"
  "cauliflower": "mannitol"
  "celery": "mannitol"
```

---

## Ingredient Classifier Reference

```yaml
classifier_mappings:
  # Proteins
  "salmon": "fish-all"
  "cod": "fish-all"
  "tuna": "fish-all"
  "chicken": "chicken"
  "turkey": "turkey"
  "beef": "beef"
  "shrimp": "seafood"
  "eggs": "eggs"
  "firm tofu": "tofu-firm"
  "tempeh": "tempeh"
  "cheddar": "hard-cheese"
  "parmesan": "hard-cheese"
  "feta": "feta"
  "lactose-free milk": "lactose-free-milk"

  # Grains
  "rice": "rice"
  "quinoa": "quinoa"
  "oats": "oats"
  "potatoes": "potatoes"
  "rice noodles": "rice-noodles"
  "wheat bread": "wheat-large-amounts"
  "regular pasta": "wheat-large-amounts"

  # Vegetables
  "spinach": "spinach"
  "zucchini": "zucchini"
  "bell pepper": "bell-peppers"
  "carrots": "carrots"
  "tomatoes": "tomatoes"
  "cucumber": "cucumber"
  "onion": "onion-all"
  "garlic": "garlic-all"
  "mushrooms": "mushrooms"
  "cauliflower": "cauliflower-large"

  # Fruits
  "banana": "bananas"
  "blueberries": "blueberries"
  "strawberries": "strawberries"
  "orange": "oranges"
  "kiwi": "kiwi"
  "apple": "apples"
  "pear": "pears"
  "watermelon": "watermelon"

  # Nuts
  "almonds": "almonds"
  "walnuts": "walnuts"
  "cashews": "cashews"
  "pistachios": "pistachios"

  # Fats
  "olive oil": "olive-oil"
  "garlic-infused oil": "garlic-infused-oil"
  "butter": "butter"
  "honey": "honey"  # restricted
  "maple syrup": "maple-syrup"
```

---

## Phase-Aware Logic

```yaml
phase_logic:
  elimination:
    description: "All high-FODMAP foods strictly avoided"
    restrict_all_subgroups: true
    fodmap_limit_g: 5
  
  reintroduction:
    description: "One FODMAP subgroup tested at a time"
    restrict_all_subgroups: true  # base diet stays low-FODMAP
    active_test_subgroup: null  # set dynamically per test day
    test_protocol:
      day_1: "small dose of test food"
      day_2: "moderate dose"
      day_3: "large dose"
      washout_days: 3
  
  personalization:
    description: "Modified diet based on individual tolerance"
    tolerated_subgroups: []  # populated from reintroduction results
    restricted_subgroups: []  # only confirmed triggers remain restricted
    notes: "Maximize food variety while avoiding personal triggers"
```

---

## Implementation Checklist

- [ ] Add `low-fodmap` to the `DietKey` union type
- [ ] Add Low FODMAP definition to `DIETS` record in `diets.ts`
- [ ] Add Low FODMAP to the categorized diet picker in `ProfilesTab.tsx`
- [ ] Implement phase selection UI (Elimination / Reintroduction / Personalization)
- [ ] Inject Low FODMAP AI prompt instructions in `buildPrompt()` — phase-aware
- [ ] Add Low FODMAP food-group rules to `assertMealCompliesWithDiet()` — including portion limits
- [ ] Add FODMAP subgroup classifier for reintroduction phase logic
- [ ] Add ingredient blacklist for onion, garlic, and all high-FODMAP foods
- [ ] Add garlic-infused oil as a recommended substitution
- [ ] Add portion-limit warnings (e.g., almonds max 10, avocado max ¼)
- [ ] Add classifier mappings for Low FODMAP-specific ingredients
- [ ] Add reintroduction tracking data model (symptom diary + subgroup test log)
- [ ] Update seed data with a Low FODMAP test user
- [ ] Add couple compatibility rules for Low FODMAP + other diets
- [ ] Add Monash app reference link in diet info UI
- [ ] Add medical disclaimer (IBS therapeutic diet — not for general population)

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
