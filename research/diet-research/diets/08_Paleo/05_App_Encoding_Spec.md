# Paleo Diet — App Encoding Spec

> Machine-readable specification for integrating the Paleo diet into Cupla's AI meal generation system. This file is designed for direct implementation by developers.

---

## Diet Metadata

```yaml
diet_key: "paleo"
display_label: "Paleo"
category: "ancestral"
emoji: "🦴"
short_description: "Eat like a hunter-gatherer — meat, fish, vegetables, nuts; no grains, dairy, or legumes"
evidence_grade: "C"
restrictiveness: 4  # 1-5 scale
sodium_restriction: "moderate"  # strict versions are low-sodium
```

---

## Food Group Rules

### Allowed Food Groups (Core Ingredients)

```yaml
allowed_food_groups:
  # Meat & Poultry
  - "red-meat"              # grass-fed beef, bison, lamb, venison, wild game
  - "poultry"               # chicken, turkey, duck (all preparations)
  - "pork"                  # pasture-raised preferred
  - "organ-meats"           # liver, heart, kidney (encouraged for nutrient density)

  # Fish & Seafood
  - "fish-fatty"            # salmon, mackerel, sardines, herring, anchovies
  - "fish-lean"             # cod, halibut, snapper, sea bass, trout
  - "seafood"               # shrimp, mussels, clams, oysters, scallops, crab

  # Eggs
  - "eggs"                  # all preparations, pasture-raised preferred

  # Vegetables (all non-starchy)
  - "leafy-greens"          # spinach, kale, arugula, chard, collards
  - "cruciferous"           # broccoli, cauliflower, Brussels sprouts, cabbage
  - "alliums"               # onion, garlic, leeks, shallots, scallions
  - "peppers"               # bell peppers, chili peppers, jalapeños
  - "nightshades"           # tomatoes, eggplant, tomatillos (allowed; excluded in AIP)
  - "root-vegetables"       # carrots, beets, turnips, parsnips, radishes
  - "cucurbit-vegetables"   # zucchini, yellow squash, cucumber, spaghetti squash
  - "winter-squash"         # butternut, acorn, kabocha (starchy; moderate)
  - "mushrooms"             # all varieties
  - "asparagus-green-beans" # asparagus, green beans, snap peas

  # Fruits (all)
  - "berries"               # blueberries, strawberries, raspberries, blackberries
  - "citrus"                # oranges, lemons, limes, grapefruit
  - "stone-fruit"           # peaches, plums, apricots, cherries
  - "tropical-fruit"        # bananas, mangoes, pineapple, papaya
  - "pome-fruit"            # apples, pears
  - "melons"
  - "grapes"
  - "avocado"               # key fat source

  # Starchy tubers (allowed; excluded in strict Cordain)
  - "sweet-potato"          # sweet potatoes, yams
  - "plantains"
  - "cassava-taro"          # cassava, taro root

  # Nuts & Seeds
  - "nuts"                  # almonds, walnuts, macadamias, pecans, Brazil nuts, pistachios, cashews
  - "seeds"                 # pumpkin, sunflower, flax, chia, hemp, sesame
  - "coconut"               # fresh, shredded, milk, flour, oil, aminos

  # Healthy Fats & Oils
  - "olive-oil"             # extra virgin preferred
  - "avocado-oil"
  - "coconut-oil"
  - "animal-fats"           # tallow, lard, duck fat, schmaltz (pasture-raised)
  - "ghee"                  # clarified butter — allowed in modified/Primal; excluded in strict

  # Flavoring
  - "herbs"                 # all fresh and dried herbs
  - "spices"                # all single-ingredient spices (no blends with added salt/sugar)
  - "lemon-lime"
  - "vinegar"               # apple cider, balsamic, red wine (no added sugar)

  # Natural sweeteners (moderate use)
  - "honey"                 # raw preferred — moderate
  - "maple-syrup"           # pure — moderate
  - "coconut-sugar"         # moderate

  # Beverages
  - "water"
  - "sparkling-water"
  - "coffee"                # black or with coconut/almond milk (purists exclude)
  - "tea"                   # green, herbal, black
  - "bone-broth"            # encouraged
```

### Restricted Food Groups (Strictly Avoid)

```yaml
restricted_food_groups:
  # Grains (ALL)
  - "all-grains"            # wheat, rice, oats, corn, barley, rye, millet, sorghum, teff
  - "grain-products"        # bread, pasta, cereal, tortillas, crackers, flour
  - "pseudo-cereals"        # quinoa, buckwheat, amaranth (excluded under "no grains" rule)

  # Legumes (ALL)
  - "legumes"               # beans (all types), lentils, chickpeas, split peas
  - "peanuts"               # technically a legume
  - "soy"                   # tofu, tempeh, edamame, soy milk, soy sauce (use coconut aminos)
  - "peas"                  # green peas, snow peas (excluded in strict; some allow)

  # Dairy
  - "dairy"                 # milk, cheese, yogurt, cream (ghee may be allowed)
  - "butter"                # (ghee/clarified butter may be allowed)

  # Refined/Processed
  - "refined-sugar"         # white sugar, brown sugar, HFCS, agave
  - "refined-grains"
  - "seed-oils"             # canola, soybean, sunflower, safflower, corn, cottonseed
  - "margarine"
  - "processed-food"        # anything with artificial ingredients, preservatives, emulsifiers
  - "processed-meat"        # sausages with fillers, deli meats with additives (natural versions OK)
  - "fast-food"

  # Other exclusions (strict)
  - "white-potatoes"        # excluded in strict Cordain (allowed in modified)
  - "added-salt"            # excluded in strict (moderate use in practice)
  - "soda"
  - "juice"                 # processed fruit juice
```

### Moderate Food Groups (Modified/Primal Variants Only)

```yaml
moderate_food_groups:
  - "ghee": "allowed in modified/Primal; excluded in strict Cordain"
  - "white-potatoes": "excluded in strict; allowed in modified versions"
  - "rice": "excluded in strict; occasionally included in modified/athletic versions"
  - "full-fat-dairy": "allowed only in Primal/Sisson variant — raw, fermented preferred"
  - "honey": "moderate use as natural sweetener"
  - "maple-syrup": "moderate use as natural sweetener"
  - "coffee": "2-3 cups/day max (purists exclude)"
  - "alcohol": "excluded by purists; occasional red wine accepted by many"
  - "dark-chocolate": "85%+ cacao, no soy lecithin — moderate versions only"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  carbs_pct: [20, 30]        # 20-30% of calories
  protein_pct: [25, 35]      # 25-35% of calories
  fat_pct: [35, 45]          # 35-45% of calories
  saturated_fat_pct: [10, 15] # 10-15% (varies by version)
  fiber_g: [25, 40]          # 25-40g/day from plants
  sodium_mg: [1500, 2300]    # low-moderate (strict: <1500)
```

---

## AI Prompt Instructions

```
PALEO DIET RULES — Follow strictly:

1. NO GRAINS: Do NOT include any grains — no wheat, rice, oats, corn, barley, rye, quinoa, or products made from them (bread, pasta, cereal, tortillas, flour-based items). This is absolute.

2. NO LEGUMES: Do NOT include beans, lentils, chickpeas, peanuts, soy, tofu, or tempeh. Use coconut aminos instead of soy sauce.

3. NO DAIRY: Do NOT include milk, cheese, yogurt, butter, or cream. (Ghee may be used in modified versions.) Use coconut milk or almond milk as substitutes.

4. NO REFINED SUGAR: Do NOT use white sugar, brown sugar, or artificial sweeteners. Honey, maple syrup, and coconut sugar are acceptable in moderation.

5. NO REFINED OILS: Do NOT use canola, soybean, sunflower, safflower, corn, or cottonseed oil. Use olive oil, avocado oil, coconut oil, tallow, or ghee (modified).

6. PROTEIN AT EVERY MEAL: Include a high-quality protein source (meat, fish, eggs) at every meal. Prioritize grass-fed, pasture-raised, and wild-caught.

7. VEGETABLES AS THE BASE: Every meal should feature vegetables prominently. Aim for 5+ servings of non-starchy vegetables per day.

8. FISH: Include fish or seafood at least 3 times per week. Prioritize fatty fish (salmon, sardines, mackerel) for omega-3 content.

9. HEALTHY FATS: Use olive oil, avocado oil, coconut oil, or animal fats for cooking. Include avocado, nuts, and seeds for additional fats.

10. STARCHY CARBS: Carbohydrates come from sweet potatoes, plantains, squash, and fruits — NOT grains. Include starchy vegetables especially for active individuals.

11. NO PROCESSED FOODS: All foods should be whole and minimally processed. Avoid anything with artificial ingredients, preservatives, emulsifiers, or unrecognizable ingredients.

12. FLAVOR: Season with herbs, spices, garlic, citrus, and vinegar. Natural salt in moderation (strict versions exclude added salt).
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    typical: "Eggs (2-3) cooked with vegetables in olive oil or coconut oil; avocado; fresh fruit or berries; coffee or tea"
    must_include: ["protein source (eggs or meat)", "vegetables or fruit", "healthy fat"]
    avoid: ["cereal", "oatmeal", "toast", "yogurt", "pancakes (non-paleo)", "juice"]

  lunch:
    typical: "Large salad with grilled meat or fish, vegetables, nuts, olive oil dressing; OR leftovers from dinner"
    must_include: ["protein source", "multiple vegetables", "healthy fat"]
    protein_preference: "chicken, fish, beef, pork, or turkey"
    avoid: ["sandwiches/bread", "rice", "pasta", "cheese", "legume-based salads"]

  dinner:
    typical: "Animal protein (meat, fish, or poultry) with roasted or steamed vegetables and a starchy tuber"
    must_include: ["protein source", "vegetables (2+ types)", "healthy fat"]
    protein_preference: "fish (especially fatty fish), grass-fed beef, or pasture-raised poultry"
    avoid: ["pasta", "rice", "bread", "cheese-based dishes"]

  snacks:
    typical: "Handful of nuts, hard-boiled egg, fresh fruit, vegetables with guacamole, jerky (no sugar/nitrites)"
    avoid: ["chips", "crackers", "candy", "granola bars", "cheese", "yogurt"]
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - whole30
    - keto
    - high-protein
    - low-carb

  adaptable_match:
    - mediterranean: "Share the fish, vegetables, olive oil, and nuts components; add whole grains and dairy for the Mediterranean partner"
    - flexitarian: "Share the vegetable-forward base; Paleo partner adds more meat, flexitarian adds grains/legumes"
    - volumetrics: "Both emphasize vegetables and whole foods; add grains for volumetrics partner"
    - vegan: "Very challenging but possible — build around vegetables, fruits, nuts, seeds, avocado; vegan adds legumes/grains, paleo adds meat/fish"
    - vegetarian: "Similar to vegan; paleo partner adds meat/fish, vegetarian adds dairy/legumes/grains"

  hard_conflict:
    - mcdougall: "Opposite philosophy — McDougall is starch-centric (potatoes, rice, grains) and very low fat; Paleo eliminates most McDouall staples"
    - pritikin: "Opposite fat philosophy (Pritikin is <10% fat, plant-based); Paleo is 35-45% fat"
    - hclf-811: "Opposite macronutrient profile — raw, high-carb, low-fat; Paleo is moderate-carb, high-protein, high-fat"
    - vegetarian-indian: "Traditional Indian vegetarian cuisine relies heavily on grains (rice, wheat), legumes (dal, chickpeas), and dairy (paneer, ghee) — all excluded on Paleo"
```

---

## Ingredient Classifier Reference

Key Paleo ingredients and their food group classification for the safety guard:

```yaml
classifier_mappings:
  # Proteins
  "salmon": "fish-fatty"
  "sardines": "fish-fatty"
  "mackerel": "fish-fatty"
  "trout": "fish-fatty"
  "tuna": "fish-fatty"
  "cod": "fish-lean"
  "halibut": "fish-lean"
  "sea bass": "fish-lean"
  "shrimp": "seafood"
  "mussels": "seafood"
  "oysters": "seafood"
  "scallops": "seafood"
  "grass-fed beef": "red-meat"
  "beef": "red-meat"
  "bison": "red-meat"
  "lamb": "red-meat"
  "venison": "red-meat"
  "pork": "pork"
  "bacon": "processed-meat"  # EXCLUDE unless sugar-free, nitrite-free
  "sausage": "processed-meat"  # EXCLUDE unless clean ingredients
  "chicken": "poultry"
  "turkey": "poultry"
  "duck": "poultry"
  "liver": "organ-meats"
  "eggs": "eggs"

  # Vegetables
  "spinach": "leafy-greens"
  "kale": "leafy-greens"
  "broccoli": "cruciferous"
  "cauliflower": "cruciferous"
  "brussels sprouts": "cruciferous"
  "sweet potato": "sweet-potato"
  "plantain": "plantains"
  "avocado": "avocado"
  "zucchini": "cucurbit-vegetables"
  "tomato": "nightshades"
  "eggplant": "nightshades"

  # Fruits
  "blueberries": "berries"
  "strawberries": "berries"
  "banana": "tropical-fruit"
  "apple": "pome-fruit"

  # Nuts & Seeds
  "almonds": "nuts"
  "walnuts": "nuts"
  "macadamia nuts": "nuts"
  "pecans": "nuts"
  "pumpkin seeds": "seeds"
  "flaxseed": "seeds"
  "chia seeds": "seeds"
  "coconut": "coconut"

  # Fats
  "extra virgin olive oil": "olive-oil"
  "olive oil": "olive-oil"
  "avocado oil": "avocado-oil"
  "coconut oil": "coconut-oil"
  "tallow": "animal-fats"
  "ghee": "ghee"  # moderate/modified

  # Excluded — flag as violations
  "rice": "all-grains"
  "wheat": "all-grains"
  "oats": "all-grains"
  "quinoa": "pseudo-cereals"
  "bread": "grain-products"
  "pasta": "grain-products"
  "lentils": "legumes"
  "chickpeas": "legumes"
  "black beans": "legumes"
  "peanuts": "peanuts"
  "peanut butter": "peanuts"
  "tofu": "soy"
  "tempeh": "soy"
  "milk": "dairy"
  "cheese": "dairy"
  "yogurt": "dairy"
  "butter": "butter"
  "canola oil": "seed-oils"
  "soybean oil": "seed-oils"
  "white potato": "white-potatoes"
```

---

## Implementation Checklist

- [ ] Add `paleo` to the `DietKey` union type
- [ ] Add Paleo definition to `DIETS` record in `diets.ts`
- [ ] Add Paleo to the categorized diet picker in `ProfilesTab.tsx`
- [ ] Inject Paleo AI prompt instructions in `buildPrompt()`
- [ ] Add Paleo food-group rules to `assertMealCompliesWithDiet()` — critical: enforce NO grains, NO legumes, NO dairy
- [ ] Add classifier mappings for Paleo-specific ingredients (meat cuts, tubers, coconut products)
- [ ] Add special handling for "modified Paleo" vs "strict Paleo" toggle
- [ ] Update seed data with a Paleo diet test user
- [ ] Add couple compatibility rules for Paleo + other diets
- [ ] Add calcium adequacy warning for long-term Paleo users
- [ ] Add LDL monitoring reminder for high-saturated-fat versions

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
