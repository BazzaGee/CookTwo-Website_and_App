# Mediterranean Diet — App Encoding Spec

> Machine-readable specification for integrating the Mediterranean diet into Cupla's AI meal generation system. This file is designed for direct implementation by developers.

---

## Diet Metadata

```yaml
diet_key: "mediterranean"
display_label: "Mediterranean"
category: "balanced"
emoji: "🫒"
short_description: "Olive oil, fish, whole grains — the gold-standard for longevity"
evidence_grade: "A"
restrictiveness: 2  # 1-5 scale
sodium_restriction: "moderate"
```

---

## Food Group Rules

### Allowed Food Groups (Core Ingredients)

```yaml
allowed_food_groups:
  # Vegetables (all types)
  - "leafy-greens"          # spinach, kale, arugula, chard
  - "tomatoes"              # all forms
  - "alliums"               # onion, garlic, leeks
  - "cruciferous"           # broccoli, cauliflower, cabbage
  - "peppers"               # bell peppers, chili peppers
  - "root-vegetables"       # carrots, beets, sweet potato (moderate)
  - "nightshades"           # eggplant, zucchini
  - "cucurbit-vegetables"   # zucchini, cucumber, squash
  - "artichokes"

  # Fruits (all types)
  - "berries"               # strawberries, blueberries, figs
  - "citrus"                # oranges, lemons, grapefruit
  - "stone-fruit"           # peaches, plums, apricots, cherries
  - "grapes"
  - "pome-fruit"            # apples, pears
  - "melons"

  # Grains (whole only)
  - "whole-grains"          # whole wheat bread, brown rice, quinoa, farro, bulgur, oats
  - "pasta-whole-grain"     # whole wheat pasta (al dente)

  # Fats
  - "olive-oil"             # extra virgin, primary fat source
  - "olives"

  # Proteins
  - "fish-fatty"            # salmon, sardines, mackerel, herring, anchovies
  - "fish-lean"             # cod, halibut, snapper, sea bass
  - "seafood"               # shrimp, mussels, clams, squid
  - "poultry"               # chicken, turkey (moderate)
  - "eggs"                  # up to 4/week
  - "legumes"               # lentils, chickpeas, beans, split peas
  - "nuts"                  # almonds, walnuts, pistachios, pine nuts
  - "seeds"                 # flax, chia, sesame, pumpkin, sunflower

  # Dairy (moderate)
  - "yogurt"                # plain, preferably Greek
  - "cheese"                # feta, goat, manchego, parmesan (30-40g/day max)
  - "ricotta-mozzarella"    # fresh cheeses, moderate

  # Flavoring
  - "herbs"                 # basil, oregano, rosemary, thyme, sage, parsley, mint
  - "spices"                # turmeric, cinnamon, cumin, saffron, paprika
  - "lemon-lime"            # as primary acid/flavoring
  - "garlic"

  # Beverages
  - "water"
  - "coffee"                # unsweetened
  - "tea"                   # unsweetened, herbal or green
  - "red-wine"              # optional, 1 glass/day with meals
```

### Restricted Food Groups (Minimize or Avoid)

```yaml
restricted_food_groups:
  - "red-meat"              # limit to a few times/month (beef, pork, lamb)
  - "processed-meat"        # sausages, bacon, deli meats, hot dogs — AVOID
  - "refined-grains"        # white bread, white rice, regular pasta (prefer whole)
  - "refined-sugar"         # sweets, pastries, candy — minimize
  - "sugary-drinks"         # soda, juice with added sugar — AVOID
  - "fast-food"             # AVOID
  - "ultra-processed-food"  # AVOID
  - "butter"                # replace with olive oil
  - "margarine"             # replace with olive oil
  - "industrial-sauces"     # mayonnaise, creamy dressings — replace with olive oil + lemon
```

### Limited Food Groups (Moderate Portions)

```yaml
moderate_food_groups:
  - "red-meat": "few times per month, small portions (85-120g)"
  - "refined-grains": "occasionally, prefer whole grain"
  - "sweets": "occasional small treat; fruit is typical dessert"
  - "dairy": "30-40g cheese/day, 1 cup yogurt/day"
  - "red-wine": "1 glass/day (optional, not recommended for non-drinkers)"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  carbs_pct: [40, 50]        # 40-50% of calories
  protein_pct: [15, 20]      # 15-20% of calories
  fat_pct: [30, 40]          # 30-40% of calories
  saturated_fat_pct: [0, 8]  # <8% of calories
  fiber_g: [25, 35]          # 25-35g/day
  sodium_mg: [0, 2300]       # <2300mg/day
```

---

## AI Prompt Instructions

```
MEDITERRANEAN DIET RULES — Follow strictly:

1. PRIMARY FAT: Use extra virgin olive oil as the main cooking and finishing fat. Do NOT use butter, margarine, or vegetable oils.

2. VEGETABLES: Every meal should be vegetable-forward. Aim for 4+ servings of vegetables per day across meals. Use a colorful variety (leafy greens, tomatoes, peppers, eggplant, zucchini).

3. FISH: Include fish or seafood at least 2-3 times per week. Prioritize fatty fish (salmon, sardines, mackerel) for omega-3 content.

4. WHOLE GRAINS: Use only whole grains (whole wheat, brown rice, quinoa, farro, bulgur, oats). Avoid white/refined grains.

5. LEGUMES: Include legumes (lentils, chickpeas, beans) at least 3 times per week as a protein source.

6. RED MEAT: Limit red meat to a few times per MONTH. Small portions only (85-120g). Never feature red meat as the main protein in consecutive meals.

7. PROCESSED MEAT: Do NOT include processed meats (sausage, bacon, deli meat, hot dogs).

8. DAIRY: Moderate amounts — Greek yogurt, feta/goat/parmesan cheese. Keep cheese portions to 30-40g per meal.

9. FLAVOR: Season with herbs, spices, garlic, lemon juice, and olive oil instead of salt.

10. NUTS: Include a handful of nuts (almonds, walnuts) daily.

11. DESSERT: Default dessert is fresh fruit. Sweets should be occasional and small.

12. WINE: May include 1 glass of red wine with dinner (optional — do not add to breakfast or lunch).
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    typical: "Whole grain toast/sourdough with olive oil, tomato, cheese; OR Greek yogurt with nuts and fruit; OR oatmeal with fruit"
    must_include: ["whole grain OR dairy", "fruit", "healthy fat"]
    avoid: ["processed cereal", "pastries", "bacon"]

  lunch:
    typical: "Large salad with vegetables, legumes or fish, olive oil dressing, whole grain bread"
    must_include: ["vegetables (multiple types)", "protein source", "olive oil"]
    protein_preference: "fish, legumes, or poultry"
    avoid: ["red meat (unless occasional)", "processed meat"]

  dinner:
    typical: "Fish or legume-based main, roasted vegetables, small portion of whole grain pasta or rice"
    must_include: ["vegetables", "protein", "healthy fat"]
    protein_preference: "fish (especially fatty fish) or legumes"
    wine: "optional 1 glass red wine"
    avoid: ["heavy red meat", "fried foods"]

  snacks:
    typical: "Handful of nuts, fresh fruit, olives, hummus with vegetables"
    avoid: ["chips", "candy", "processed snacks"]
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - dash
    - mind
    - flexitarian
    - volumetrics
    - high-protein

  adaptable_match:
    - vegan: "Make the meal plant-based (Mediterranean is already plant-forward); add fish/poultry only for the non-vegan partner's plate"
    - vegetarian: "Same base meal; fish/poultry as a side option"
    - pescatarian: "Nearly identical — Mediterranean already emphasizes fish"
    - keto: "Focus on the fish + vegetables + olive oil components; skip grains/legumes for keto partner"
    - paleo: "Focus on fish + vegetables + nuts + olive oil; skip grains/dairy/legumes for paleo partner"
    - low-fodmap: "Adapt the recipe — reduce garlic/onion (use garlic-infused oil), choose low-FODMAP vegetables, moderate legumes"

  hard_conflict:
    - carnivore: "Very difficult — Mediterranean is plant-forward; suggest separate meals with a shared protein (e.g., grilled fish/steak) and the carnivore partner skips the plant components"
    - mcdougall: "Opposite fat philosophy (McDougall is very low fat); suggest separate meals"
    - pritikin: "Opposite fat philosophy (Pritikin is <10% fat); suggest separate meals"
    - hclf-811: "Opposite philosophy (raw, high-carb, low-fat); suggest separate meals"
```

---

## Ingredient Classifier Reference

Key Mediterranean ingredients and their food group classification for the safety guard:

```yaml
classifier_mappings:
  # Proteins
  "salmon": "fish-fatty"
  "sardines": "fish-fatty"
  "mackerel": "fish-fatty"
  "tuna": "fish-fatty"
  "cod": "fish-lean"
  "sea bass": "fish-lean"
  "shrimp": "seafood"
  "mussels": "seafood"
  "chicken": "poultry"
  "turkey": "poultry"
  "beef": "red-meat"
  "pork": "red-meat"
  "lamb": "red-meat"
  "bacon": "processed-meat"
  "sausage": "processed-meat"
  "lentils": "legumes"
  "chickpeas": "legumes"
  "black beans": "legumes"

  # Grains
  "brown rice": "whole-grains"
  "quinoa": "whole-grains"
  "farro": "whole-grains"
  "whole wheat pasta": "pasta-whole-grain"
  "white rice": "refined-grains"
  "white bread": "refined-grains"

  # Fats
  "extra virgin olive oil": "olive-oil"
  "olive oil": "olive-oil"
  "butter": "butter"
  "margarine": "margarine"
  "almonds": "nuts"
  "walnuts": "nuts"

  # Dairy
  "greek yogurt": "yogurt"
  "feta": "cheese"
  "parmesan": "cheese"
```

---

## Implementation Checklist

- [ ] Add `mediterranean` to the `DietKey` union type
- [ ] Add Mediterranean definition to `DIETS` record in `diets.ts`
- [ ] Add Mediterranean to the categorized diet picker in `ProfilesTab.tsx`
- [ ] Inject Mediterranean AI prompt instructions in `buildPrompt()`
- [ ] Add Mediterranean food-group rules to `assertMealCompliesWithDiet()`
- [ ] Add classifier mappings for Mediterranean-specific ingredients
- [ ] Update seed data with a Mediterranean diet test user
- [ ] Add couple compatibility rules for Mediterranean + other diets

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
