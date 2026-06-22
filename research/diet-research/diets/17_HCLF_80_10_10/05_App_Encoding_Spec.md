# 80/10/10 (HCLF) Diet — App Encoding Spec

> Machine-readable specification for integrating the 80/10/10 raw vegan diet into Cupla's AI meal generation system. This file is designed for direct implementation by developers.

---

## Diet Metadata

```yaml
diet_key: "hclf-811"
display_label: "80/10/10 (HCLF Raw Vegan)"
category: "plant-based"
emoji: "🍌"
short_description: "Raw vegan, fruit-based — 80% carbs, 10% protein, 10% fat"
evidence_grade: "D"
restrictiveness: 5  # 1-5 scale (maximum)
sodium_restriction: "very_low"
health_warning: "No clinical trials. Requires B12 supplementation. Multiple deficiency risks. Not recommended for children, pregnancy, or without medical supervision."
requires_supplementation:
  - nutrient: "vitamin_b12"
    status: "mandatory"
    note: "Deficiency causes irreversible neurological damage"
  - nutrient: "vitamin_d"
    status: "strongly_recommended"
  - nutrient: "dha_epa"
    status: "recommended"
    note: "Algae-based omega-3 supplement"
```

---

## Food Group Rules

### Allowed Food Groups (Core Ingredients)

```yaml
allowed_food_groups:
  # Sweet fruit — PRIMARY calorie source (70-90% of calories)
  - "bananas"               # the staple
  - "dates"                 # calorie-dense fruit
  - "mangoes"
  - "grapes"
  - "melons"                # watermelon, cantaloupe, honeydew
  - "papaya"
  - "pineapple"
  - "stone-fruit"           # peaches, plums, nectarines, apricots, cherries
  - "pome-fruit"            # apples, pears
  - "citrus"                # oranges, tangerines, grapefruit
  - "berries"               # strawberries, blueberries, raspberries
  - "tropical-fruit"        # persimmons, figs, cherimoya, jackfruit, lychee
  - "figs"
  - "persimmons"

  # Tender leafy greens (mineral source, large volume)
  - "leafy-greens"          # romaine, spinach, kale, arugula, mixed greens
  - "celery"                # natural sodium source

  # Non-sweet fruit (volume, vitamins)
  - "tomatoes"              # raw only
  - "cucumbers"             # raw only
  - "peppers"               # bell peppers, raw only
  - "zucchini"              # raw only (zoodles)

  # Other raw vegetables (limited)
  - "raw-vegetables"        # carrots, beets (shredded), jicama, fennel

  # Overt fats — very limited (keep total fat <10%)
  - "avocado"               # max ½ medium, 1-3x/week
  - "raw-nuts"              # max 1 oz, 1-3x/week (walnuts, almonds, etc.)
  - "raw-seeds"             # max 1 oz, 1-3x/week (sunflower, pumpkin, hemp)
  - "young-coconut"         # occasional

  # Flavoring
  - "fresh-herbs"           # basil, cilantro, parsley, mint
  - "lemon-lime"            # raw, fresh
  - "raw-tomato"            # used in dressings

  # Beverages
  - "water"
  - "fresh-fruit-juice"     # freshly extracted, not pasteurized/bottled
  - "spring-water"
```

### Restricted Food Groups (Prohibited)

```yaml
restricted_food_groups:
  # ALL animal products
  - "red-meat"              # PROHIBITED
  - "poultry"               # PROHIBITED
  - "fish-fatty"            # PROHIBITED
  - "fish-lean"             # PROHIBITED
  - "seafood"               # PROHIBITED
  - "eggs"                  # PROHIBITED
  - "dairy"                 # PROHIBITED (all forms)
  - "honey"                 # PROHIBITED (animal product)
  - "gelatin"               # PROHIBITED

  # ALL cooked foods
  - "cooked-grains"         # PROHIBITED (rice, oats, pasta, bread)
  - "cooked-vegetables"     # PROHIBITED (steamed, roasted, boiled)
  - "cooked-legumes"        # PROHIBITED (beans, lentils, chickpeas)
  - "baked-goods"           # PROHIBITED
  - "cooked-soups"          # PROHIBITED

  # ALL oils and processed fats
  - "all-oils"              # PROHIBITED (olive oil, coconut oil, etc.)
  - "butter"                # PROHIBITED
  - "margarine"             # PROHIBITED
  - "vegan-cheese"          # PROHIBITED (processed)
  - "vegan-meat"            # PROHIBITED (processed)

  # ALL processed and refined foods
  - "refined-sugar"         # PROHIBITED
  - "refined-grains"        # PROHIBITED
  - "packaged-snacks"       # PROHIBITED
  - "ultra-processed-food"  # PROHIBITED
  - "salt"                  # AVOID (added salt)
  - "vinegar"               # AVOID (fermented/processed)
  - "soy-sauce"             # AVOID (fermented, high sodium)
  - "coffee"                # AVOID (roasted/heated)
  - "tea-hot"               # AVOID (heated above 118°F)
  - "alcohol"               # AVOID

  # Foods too high in fat (beyond very small amounts)
  - "oils"                  # PROHIBITED
  - "dried-coconut"         # AVOID (high fat)
  - "nutritional-yeast"     # DEBATED (some allow for B12; purists avoid)
```

### Moderate Food Groups (Strictly Portion-Controlled)

```yaml
moderate_food_groups:
  - "avocado": "max ½ medium, 1-3x/week — ~9% of calories from fat in one serving"
  - "raw-nuts": "max 1 oz (~28g), 1-3x/week — pushes fat toward 10% limit"
  - "raw-seeds": "max 1 oz, 1-3x/week"
  - "young-coconut": "occasional — moderate fat content"
  - "olives": "occasional, small amounts — moderate fat + sodium"
  - "durian": "occasional — higher in fat than most fruit"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  carbs_pct: [80, 90]        # ≥80% of calories (prescribed)
  protein_pct: [5, 10]       # ~10% of calories (prescribed)
  fat_pct: [0, 10]           # ≤10% of calories, ideally ~5% (prescribed)
  saturated_fat_pct: [0, 3]  # naturally very low
  fiber_g: [40, 70]          # extremely high from fruit/greens
  sodium_mg: [0, 500]        # naturally very low (no added salt)
  # These ratios are PRESCRIBED by the diet — they are its defining feature
  prescribed: true
  primary_principle: "raw_vegan_fruit_based_low_fat"
  tracking_required: true    # followers typically use Cronometer to hit 80/10/10
```

---

## AI Prompt Instructions

```
80/10/10 (HCLF RAW VEGAN) DIET RULES — Follow strictly:

1. RAW ONLY: All foods must be raw (uncooked). Do NOT include any food heated above 118°F (48°C). No cooked grains, cooked vegetables, cooked legumes, baked goods, hot soups, coffee, or hot tea.

2. VEGAN ONLY: No animal products of ANY kind — no meat, poultry, fish, seafood, eggs, dairy, honey, or gelatin.

3. FRUIT IS THE CALORIE BASE: Sweet fruit provides 70-90% of total calories. Meals should feature large quantities of a single fruit (mono-meals) or simple fruit combinations. Bananas, dates, mangoes, grapes, melons are primary calorie sources.

4. MACRO TARGET: ≥80% carbs, ~10% protein, ≤10% fat. Do NOT include oils, butter, or any extracted fat. Keep overt fats (avocado, nuts, seeds) to very small amounts, used sparingly.

5. LEAFY GREENS: Include tender leafy greens daily, typically in a large evening salad (1+ head of lettuce or large bowl of mixed greens).

6. MONO-MEALS PREFERRED: Breakfast and lunch should ideally be mono-meals (a single fruit eaten in large quantity). Example: 15-20 bananas, or 1 large watermelon, or 8-10 mangoes.

7. NO OILS: Absolutely no oils of any kind (no olive oil, coconut oil, etc.). Dressings should be made from blended fruit (e.g., mango + tomato + celery).

8. NO SALT: Do not add salt. Rely on the natural sodium in celery and other vegetables.

9. NO PROCESSED FOODS: No packaged snacks, vegan meat substitutes, vegan cheese, refined sugar, white flour, or processed foods of any kind.

10. DINNER STRUCTURE: Dinner is typically a large green salad (romaine, spinach, tomatoes, cucumber, bell peppers, celery) with a fruit-based dressing, followed by additional fruit.

11. OVERT FATS (sparingly): If including overt fats, limit to ½ avocado OR 1 oz nuts/seeds, 1-3 times per WEEK maximum. Do not combine overt fats with sweet fruit in the same meal.

12. BEVERAGES: Water and fresh fruit juice only. No coffee, hot tea, alcohol, or bottled/pasteurized juice.

13. SUPPLEMENTATION NOTE: Always include a reminder that vitamin B12 supplementation is MANDATORY on this diet. Vitamin D and algae-based DHA/EPA are strongly recommended.

14. CALORIE ADEQUACY: Ensure the meal plan provides sufficient calories (2,500-3,500+ for most adults). Under-eating is a common and dangerous mistake on this diet due to the bulk of fruit required.

HEALTH WARNING: This diet has no clinical trial evidence (Grade D). It carries significant risk of B12 deficiency, amenorrhea, low bone mass, and dental erosion. All users should be advised to supplement B12, monitor bloodwork, and consult a healthcare provider.
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    typical: "Mono-meal of sweet fruit: 15-20 bananas; OR 1 large watermelon; OR 8-10 mangoes; OR 15-20 dates blended with water"
    must_include: ["large quantity of a single sweet fruit"]
    avoid: ["mixed meals", "cooked foods", "all animal products", "oils", "salt"]
    format: "mono-meal preferred"
    calories: [800, 1500]

  lunch:
    typical: "Mono-meal of sweet fruit: 10-15 bananas; OR large quantity of grapes/mangoes; OR large smoothie of dates + bananas"
    must_include: ["large quantity of sweet fruit"]
    avoid: ["mixed meals", "cooked foods", "all animal products", "oils", "salt"]
    format: "mono-meal preferred"
    calories: [800, 1500]

  dinner:
    typical: "Large green salad (1+ head romaine or large bowl greens) with tomatoes, cucumber, bell peppers, celery; fruit-based dressing (blended mango + tomato); followed by more fruit (5+ bananas or equivalent)"
    must_include: ["large volume of leafy greens", "non-sweet fruit (tomatoes, peppers)", "additional sweet fruit"]
    salad_dressing: "blended fruit-based (mango-tomato, orange-date, etc.) — NO oil, NO salt, NO vinegar"
    overt_fat: "occasionally — ½ avocado or 1 oz nuts/seeds (1-3x/week max)"
    avoid: ["cooked foods", "all animal products", "oils", "salt", "vinegar"]
    calories: [600, 1200]

  snacks:
    typical: "Fresh fruit, dates"
    avoid: ["all processed snacks", "all cooked foods", "all animal products", "nuts beyond 1 oz", "dried fruit with added sugar"]
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - raw-vegan       # if such a diet exists in the system
    - fruitarian      # even more restrictive subset

  adaptable_match:
    - vegan: "Very difficult — standard vegan includes cooked foods, grains, tofu, processed alternatives that are all prohibited on 80/10/10. Can share a salad base; vegan partner adds cooked grains/legumes/tofu"
    - vegetarian: "Same as vegan plus even more divergence with dairy/eggs. Suggest separate meals"
    - mcdougall: "Share the high-carb, low-fat philosophy; diverge on raw vs. cooked. Both partners can eat from a shared produce base but McDougall partner needs cooked starches"
    - pritikin: "Share the low-fat principle; diverge on raw vs. cooked and on animal protein. Suggest shared produce with separate protein/starch components"

  hard_conflict:
    - mediterranean: "Hard conflict — Mediterranean includes olive oil, fish, cheese, bread, wine — ALL prohibited on 80/10/10. Suggest entirely separate meals; shared base limited to a salad (without dressing)"
    - keto: "Maximum conflict — opposite macronutrient philosophy (80% fat vs. 80% carb). Completely incompatible meal structures"
    - paleo: "Hard conflict — paleo includes meat, cooked foods, oils. Only overlap is raw vegetables and fruit"
    - carnivore: "Maximum conflict — zero overlap. No shared foods possible"
    - high-protein: "Hard conflict — 80/10/10 deliberately limits protein to 10%; high-protein diets target 30%+"
    - volumetrics: "Different philosophies; can share a produce-heavy base but volumetrics allows cooked foods, lean protein, and measured oils. Suggest shared salad/fruit with separate protein and starch"
    - flexitarian: "Very difficult — flexitarian includes cooked foods, meat occasionally, dairy, eggs. Minimal overlap beyond produce"
    - dash: "Hard conflict — DASH includes low-fat dairy, lean protein, whole grains (cooked). Suggest separate meals"
    - low-fodmap: "Near-impossible — 80/10/10 requires enormous quantities of high-FODMAP fruit (bananas, mangoes, dates, watermelon, apples). Cannot be adapted without violating core principles"
```

---

## Ingredient Classifier Reference

Key 80/10/10 ingredients and their classification:

```yaml
classifier_mappings:
  # Sweet fruit — ALLOWED (core calorie source)
  "bananas": { food_group: "bananas", status: "allowed", role: "primary_calorie_source" }
  "dates": { food_group: "dates", status: "allowed", role: "calorie_dense_fruit" }
  "mangoes": { food_group: "mangoes", status: "allowed" }
  "grapes": { food_group: "grapes", status: "allowed" }
  "watermelon": { food_group: "melons", status: "allowed" }
  "cantaloupe": { food_group: "melons", status: "allowed" }
  "honeydew": { food_group: "melons", status: "allowed" }
  "papaya": { food_group: "papaya", status: "allowed" }
  "pineapple": { food_group: "pineapple", status: "allowed" }
  "peaches": { food_group: "stone-fruit", status: "allowed" }
  "nectarines": { food_group: "stone-fruit", status: "allowed" }
  "apples": { food_group: "pome-fruit", status: "allowed" }
  "pears": { food_group: "pome-fruit", status: "allowed" }
  "oranges": { food_group: "citrus", status: "allowed" }
  "tangerines": { food_group: "citrus", status: "allowed" }
  "grapefruit": { food_group: "citrus", status: "allowed" }
  "strawberries": { food_group: "berries", status: "allowed" }
  "blueberries": { food_group: "berries", status: "allowed" }
  "raspberries": { food_group: "berries", status: "allowed" }
  "figs": { food_group: "figs", status: "allowed" }
  "persimmons": { food_group: "persimmons", status: "allowed" }
  "cherimoya": { food_group: "tropical-fruit", status: "allowed" }
  "jackfruit": { food_group: "tropical-fruit", status: "allowed" }
  "lychee": { food_group: "tropical-fruit", status: "allowed" }

  # Tender greens — ALLOWED
  "romaine lettuce": { food_group: "leafy-greens", status: "allowed", role: "mineral_source" }
  "spinach": { food_group: "leafy-greens", status: "allowed" }
  "kale": { food_group: "leafy-greens", status: "allowed" }
  "arugula": { food_group: "leafy-greens", status: "allowed" }
  "celery": { food_group: "celery", status: "allowed" }

  # Non-sweet fruit — ALLOWED
  "tomatoes": { food_group: "tomatoes", status: "allowed", raw_only: true }
  "cucumbers": { food_group: "cucumbers", status: "allowed", raw_only: true }
  "bell peppers": { food_group: "peppers", status: "allowed", raw_only: true }
  "zucchini": { food_group: "raw-vegetables", status: "allowed", raw_only: true }

  # Overt fats — MODERATE (strictly portion-controlled)
  "avocado": { food_group: "avocado", status: "moderate", max_portion: "½ medium", max_frequency: "3x/week" }
  "walnuts": { food_group: "raw-nuts", status: "moderate", max_portion: "1 oz", max_frequency: "3x/week" }
  "almonds": { food_group: "raw-nuts", status: "moderate", max_portion: "1 oz", max_frequency: "3x/week" }
  "sunflower seeds": { food_group: "raw-seeds", status: "moderate", max_portion: "1 oz", max_frequency: "3x/week" }
  "pumpkin seeds": { food_group: "raw-seeds", status: "moderate", max_portion: "1 oz", max_frequency: "3x/week" }
  "hemp seeds": { food_group: "raw-seeds", status: "moderate", max_portion: "1 oz", max_frequency: "3x/week" }

  # Flavoring — ALLOWED
  "basil": { food_group: "fresh-herbs", status: "allowed" }
  "cilantro": { food_group: "fresh-herbs", status: "allowed" }
  "parsley": { food_group: "fresh-herbs", status: "allowed" }
  "mint": { food_group: "fresh-herbs", status: "allowed" }
  "lemon": { food_group: "lemon-lime", status: "allowed" }
  "lime": { food_group: "lemon-lime", status: "allowed" }

  # Animal products — PROHIBITED
  "chicken": { food_group: "poultry", status: "prohibited" }
  "beef": { food_group: "red-meat", status: "prohibited" }
  "fish": { food_group: "fish-fatty", status: "prohibited" }
  "salmon": { food_group: "fish-fatty", status: "prohibited" }
  "eggs": { food_group: "eggs", status: "prohibited" }
  "milk": { food_group: "dairy", status: "prohibited" }
  "cheese": { food_group: "dairy", status: "prohibited" }
  "yogurt": { food_group: "dairy", status: "prohibited" }
  "honey": { food_group: "honey", status: "prohibited" }

  # Cooked foods — PROHIBITED
  "rice": { food_group: "cooked-grains", status: "prohibited" }
  "oatmeal": { food_group: "cooked-grains", status: "prohibited" }
  "pasta": { food_group: "cooked-grains", status: "prohibited" }
  "bread": { food_group: "cooked-grains", status: "prohibited" }
  "lentils": { food_group: "cooked-legumes", status: "prohibited" }
  "beans": { food_group: "cooked-legumes", status: "prohibited" }
  "chickpeas": { food_group: "cooked-legumes", status: "prohibited" }
  "tofu": { food_group: "cooked-legumes", status: "prohibited", note: "processed soy" }
  "tempeh": { food_group: "cooked-legumes", status: "prohibited" }

  # Fats/oils — PROHIBITED
  "olive oil": { food_group: "all-oils", status: "prohibited" }
  "coconut oil": { food_group: "all-oils", status: "prohibited" }
  "butter": { food_group: "butter", status: "prohibited" }
  "margarine": { food_group: "margarine", status: "prohibited" }

  # Other — PROHIBITED
  "salt": { food_group: "salt", status: "avoid" }
  "vinegar": { food_group: "vinegar", status: "avoid" }
  "soy sauce": { food_group: "soy-sauce", status: "avoid" }
  "coffee": { food_group: "coffee", status: "avoid" }
  "sugar": { food_group: "refined-sugar", status: "prohibited" }
  "white flour": { food_group: "refined-grains", status: "prohibited" }
```

---

## Supplementation Requirements

```yaml
supplementation:
  mandatory:
    - nutrient: "vitamin_b12"
      form: "cyanocobalamin or methylcobalamin"
      dose: "250-500 mcg/day OR 1,000-2,000 mcg 2-3x/week"
      warning: "Deficiency causes irreversible neurological damage. No plant food contains B12."

  strongly_recommended:
    - nutrient: "vitamin_d3"
      form: "lichen-derived D3 (vegan)"
      dose: "1,000-4,000 IU/day"
      warning: "No dietary source in raw vegan diet; sun exposure often insufficient."

    - nutrient: "dha_epa"
      form: "algae-based omega-3"
      dose: "200-300 mg/day"
      warning: "No direct source in fruit/greens; ALA conversion is inefficient."

  monitor_and_supplement_if_low:
    - nutrient: "iodine"
    - nutrient: "zinc"
    - nutrient: "calcium"
    - nutrient: "iron"
    - nutrient: "selenium"
```

---

## Health & Safety Flags

```yaml
health_safety:
  evidence_grade: "D"
  clinical_trials: 0
  medical_endorsements: "none"

  contraindicated_populations:
    - "pregnancy"
    - "lactation"
    - "children"
    - "adolescents"
    - "elderly"
    - "eating_disorder_history"
    - "type_1_diabetes"
    - "type_2_diabetes_without_supervision"
    - "malabsorption_disorders"

  mandatory_warnings:
    - "B12 supplementation is MANDATORY. Deficiency causes irreversible neurological damage."
    - "This diet has no clinical trial evidence (Grade D)."
    - "30% of women on raw food diets develop amenorrhea (Giessen study)."
    - "Long-term raw foodists show low bone mass."
    - "Extremely high fruit intake carries unknown long-term metabolic risks."
    - "Dental erosion from frequent acidic/sugary fruit consumption is a significant risk."
    - "Consult a healthcare provider and undergo regular blood monitoring."

  required_monitoring:
    - "serum_b12"
    - "methylmalonic_acid"
    - "homocysteine"
    - "25-hydroxy_vitamin_d"
    - "complete_blood_count"
    - "ferritin"
    - "bone_density_scan"
```

---

## Implementation Checklist

- [ ] Add `hclf-811` to the `DietKey` union type
- [ ] Add 80/10/10 definition to `DIETS` record in `diets.ts`
- [ ] Add 80/10/10 to the categorized diet picker in `ProfilesTab.tsx`
- [ ] Inject 80/10/10 AI prompt instructions in `buildPrompt()`
- [ ] Add 80/10/10 food-group rules to `assertMealCompliesWithDiet()`
- [ ] Add raw-food-only restriction check (reject any cooked food)
- [ ] Add vegan-only restriction check (reject all animal products)
- [ ] Add oil-prohibition check
- [ ] Add fat-percentage validation (flag meals >10% fat)
- [ ] Add classifier mappings for 80/10/10-specific ingredients
- [ ] Add mandatory B12 supplementation warning to meal output
- [ ] Add health safety warning banner for this diet
- [ ] Add contraindicated population warnings (pregnancy, children, etc.)
- [ ] Add mono-meal generation logic for breakfast/lunch
- [ ] Add fruit-based dressing generation for dinner salads
- [ ] Update seed data with an 80/10/10 diet test user
- [ ] Add couple compatibility rules for 80/10/10 + other diets (hard conflicts expected)

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
