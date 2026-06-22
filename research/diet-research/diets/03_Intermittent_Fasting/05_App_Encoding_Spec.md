# Intermittent Fasting — App Encoding Spec

> Machine-readable specification for integrating intermittent fasting into Cupla's AI meal generation system. **CRITICAL: IF is a TIMING pattern, not a food-choice diet.** It must be modeled as a **separate `fasting_mode` field** that stacks orthogonally on top of any food-choice diet (Mediterranean, keto, vegan, etc.). This file is designed for direct implementation by developers.

---

## Diet Metadata

```yaml
diet_key: "intermittent-fasting"
display_label: "Intermittent Fasting"
category: "timing"
emoji: "⏰"
short_description: "Eat within a timed window — 16:8, 5:2, OMAD and more"
evidence_grade: "B"
restrictiveness: 3  # 1-5 scale (timing is restrictive, food choice is not)
sodium_restriction: "none"
is_timing_pattern: true  # CRITICAL: flags this as orthogonal to food-choice diets
```

---

## ⚠️ CRITICAL ARCHITECTURE NOTE: Fasting Mode as a Separate Field

```yaml
# ============================================================================
# IF MUST be modeled as a SEPARATE FIELD from food-choice diets.
# It is NOT mutually exclusive with any food diet — it STACKS.
#
# Architecture:
#   user_profile:
#     food_diet: "mediterranean" | "keto" | "vegan" | "high-protein" | null
#     fasting_mode: "16-8" | "18-6" | "20-4" | "5-2" | "eat-stop-eat" | "adf" | "omad" | null
#
# Valid combinations:
#   - food_diet: "mediterranean", fasting_mode: "16-8"  → Mediterranean + 16:8
#   - food_diet: "keto", fasting_mode: "18-6"            → Keto + 18:6
#   - food_diet: null, fasting_mode: "16-8"              → 16:8 only (no food restriction)
#   - food_diet: "mediterranean", fasting_mode: null     → Mediterranean only (no fasting)
#
# The meal generator must:
#   1. Apply food-choice diet rules (allowed/restricted foods) from the food_diet
#   2. Apply timing rules (eating window, meal count, meal spacing) from fasting_mode
#   3. The two are INDEPENDENT and must not conflict
#
# Couple compatibility:
#   - When partners have different food_diet values → resolve at food level (as usual)
#   - When partners have different fasting_mode values → resolve at timing level
#   - Both dimensions are resolved independently
# ============================================================================
```

---

## Fasting Protocol Definitions

```yaml
fasting_protocols:
  "16-8":
    display_label: "16:8 (16-hour fast, 8-hour eating window)"
    fast_hours: 16
    eat_hours: 8
    meal_count: [2, 3]  # 2-3 meals within the window
    difficulty: 3  # 1-5 scale
    recommended_eating_windows:
      - { start: "12:00", end: "20:00", label: "Skip breakfast (most popular)" }
      - { start: "09:00", end: "17:00", label: "Early window (circadian-optimized)" }
      - { start: "10:00", end: "18:00", label: "Mid window" }
    fasting_day_calorie_target: 0
    popular: true

  "18-6":
    display_label: "18:6 (18-hour fast, 6-hour eating window)"
    fast_hours: 18
    eat_hours: 6
    meal_count: [2, 3]  # typically 2 meals + optional snack
    difficulty: 4
    recommended_eating_windows:
      - { start: "13:00", end: "19:00", label: "Afternoon window" }
      - { start: "12:00", end: "18:00", label: "Lunch + early dinner" }
    fasting_day_calorie_target: 0

  "20-4":
    display_label: "20:4 (Warrior Diet — 20-hour fast, 4-hour window)"
    fast_hours: 20
    eat_hours: 4
    meal_count: [1, 2]
    difficulty: 5
    recommended_eating_windows:
      - { start: "16:00", end: "20:00", label: "Late afternoon/evening" }
      - { start: "17:00", end: "21:00", label: "Evening window" }
    fasting_day_calorie_target: 0
    warning: "Very short window — difficult to meet all nutritional needs. Monitor protein and fiber intake."

  "5-2":
    display_label: "5:2 (5 normal days, 2 fasting days at 500-600 cal)"
    fast_hours: null  # Not a daily time-restricted protocol
    eat_hours: null
    fasting_day_calorie_target: 500  # women; 600 for men
    fasting_days_per_week: 2
    fasting_days_must_be_nonconsecutive: true
    normal_day_meal_count: [3, 4]
    fasting_day_meal_count: [1, 2]
    difficulty: 3
    popular: true

  "eat-stop-eat":
    display_label: "Eat-Stop-Eat (1-2 complete 24-hour fasts per week)"
    fast_hours: 24
    eat_hours: null
    fasting_day_calorie_target: 0
    fasting_days_per_week: [1, 2]  # 1 or 2 days
    fasting_days_must_be_nonconsecutive: true
    normal_day_meal_count: [3, 4]
    fasting_day_meal_count: 0
    difficulty: 4

  "adf":
    display_label: "Alternate Day Fasting"
    fast_hours: null
    eat_hours: null
    pattern: "alternate"
    feast_day_calorie_target: "maintenance_or_above"
    fast_day_calorie_target: 500  # modified ADF; 0 for strict ADF
    fasting_day_meal_count: [1, 2]
    feast_day_meal_count: [3, 4]
    difficulty: 4

  "omad":
    display_label: "OMAD (One Meal A Day)"
    fast_hours: 23
    eat_hours: 1
    meal_count: 1
    difficulty: 5
    recommended_eating_windows:
      - { start: "17:00", end: "18:00", label: "Dinner only" }
      - { start: "12:00", end: "13:00", label: "Lunch only" }
    fasting_day_calorie_target: 0
    warning: "Extremely difficult to meet nutritional needs in one meal. Not recommended for beginners, pregnant/nursing women, or those with eating disorder history."
```

---

## Food Group Rules

> **CRITICAL:** IF does NOT impose food-group restrictions. The food groups below define what is allowed during the **fasting window** (beverages only) vs. the **eating window** (per the user's chosen food diet). All food-group restrictions come from the user's `food_diet`, NOT from IF.

### Fasting Window — Allowed (Zero-Calorie Beverages Only)

```yaml
fasting_window_allowed:
  - "water"                 # still, sparkling, mineral — all forms
  - "water-infused"         # with lemon, lime, cucumber slices (no sugar)
  - "black-coffee"          # no milk, cream, or sugar
  - "espresso"              # no additions
  - "tea-black"             # unsweetened, no milk
  - "tea-green"             # unsweetened
  - "tea-herbal"            # unsweetened (peppermint, chamomile, rooibos)
  - "electrolyte-water"     # unsweetened, zero-calorie electrolyte supplement
  - "apple-cider-vinegar"   # 1 tbsp in water (negligible calories)
```

### Fasting Window — Disallowed (Breaks the Fast)

```yaml
fasting_window_disallowed:
  - "all-food"              # Any food of any kind
  - "milk"                  # Dairy proteins stimulate insulin
  - "cream"                 # Contains calories and protein
  - "sugar"                 # Any form
  - "honey"                 # Any form
  - "juice"                 # Any form, even fresh
  - "smoothies"             # Any form
  - "protein-shakes"        # Contains calories
  - "bone-broth"            # Contains calories and protein (allowed in some modified protocols)
  - "diet-soda"             # Controversial — best avoided during strict fast
  - "artificial-sweeteners" # May stimulate insulin response in some people
  - "alcohol"               # Contains calories
```

### Eating Window — Food Groups

```yaml
# Eating window food groups are determined entirely by the user's food_diet field.
# IF does NOT add or remove any food group rules.
# Example: if food_diet is "mediterranean", apply all Mediterranean food group rules
#          during the eating window. IF only controls WHEN eating happens.

eating_window_food_groups: "INHERITED_FROM_FOOD_DIET"
```

---

## Macronutrient Targets

```yaml
# IF does NOT prescribe macros. These are general guidelines for IF practitioners
# to optimize outcomes (especially protein for lean mass preservation).
# The user's food_diet may override these with more specific targets.

macro_targets_if_guidelines:
  total_calories: "maintenance or modest deficit (300-500 cal below TDEE for weight loss)"
  protein_g_per_kg: [1.2, 2.0]  # 1.2-2.0 g/kg to preserve lean mass
  fiber_g: [25, 35]             # May be challenging in short windows
  sodium_mg: [1500, 2300]       # Fasting increases sodium excretion; slightly higher ok
  potassium_mg: [3500, 4700]    # Important for electrolyte balance
  magnesium_mg: [310, 420]      # May help with fasting headaches and sleep

  # If combined with a food_diet, the food_diet's macro targets take precedence
  # for carbs_pct, protein_pct, and fat_pct. IF guidelines supplement with
  # absolute protein targets and electrolyte recommendations.
```

---

## AI Prompt Instructions

```
INTERMITTENT FASTING RULES — Follow strictly:

TIMING IS THE PRIMARY RULE:
1. EATING WINDOW: All meals and snacks must fall within the user's designated eating window. Do NOT generate any food items outside this window.

2. FASTING WINDOW: During the fasting period, only the following are allowed: water (still or sparkling), black coffee, unsweetened plain tea (black, green, or herbal), and zero-calorie electrolyte water. Do NOT generate meals, snacks, smoothies, or any caloric food during the fast.

3. MEAL COUNT: Generate the appropriate number of meals for the protocol:
   - 16:8 → 2-3 meals within 8 hours
   - 18:6 → 2 meals + optional snack within 6 hours
   - 20:4 → 1-2 meals within 4 hours
   - 5:2 normal day → 3 normal meals
   - 5:2 fasting day → 1-2 very small meals totaling 500-600 calories
   - ADF feast day → 3-4 meals at maintenance or above
   - ADF fast day → 1-2 very small meals totaling 500-600 calories (modified) or 0 (strict)
   - OMAD → 1 single meal

4. PROTEIN PRIORITY: Each meal in the eating window must contain a substantial protein portion (20-40g per meal). This is CRITICAL for preserving lean muscle mass during fasting periods. If the eating window allows only 1-2 meals, protein per meal must be higher (30-50g).

5. BREAK THE FAST GENTLY: The first meal after fasting should NOT be extremely large or heavy. Start with protein and fiber. Avoid massive sugar/carbohydrate loads that could cause reactive hypoglycemia.

6. LAST MEAL SATIETY: The final meal before the fasting window should be filling and satisfying to make the fast easier. Include protein, fiber, and healthy fats for sustained satiety.

7. NUTRIENT DENSITY: Because fewer meals are consumed, each meal must be nutrient-dense. Prioritize vegetables, high-quality protein, and healthy fats. Do NOT waste the limited eating window on empty calories.

8. FOOD DIET STACKING: Apply the user's food_diet rules IN ADDITION to these timing rules. For example:
   - If food_diet is "mediterranean" + fasting_mode is "16-8": Generate Mediterranean-compliant meals within a 12:00-20:00 window
   - If food_diet is "keto" + fasting_mode is "18-6": Generate keto-compliant meals within a 13:00-19:00 window
   - If food_diet is null + fasting_mode is "16-8": Generate healthy balanced meals within the window (no specific food restrictions)

9. FASTING DAY (5:2 and ADF): On designated fasting days, generate only 500-600 calories total. Prioritize protein and vegetables to maximize satiety per calorie. Example: 2 boiled eggs + vegetables (200 cal), grilled chicken breast + salad (300 cal).

10. HYDRATION: Include a note about hydration. Suggest water, black coffee, or herbal tea during the fasting window.

11. ELECTROLYTES: For fasting windows >16 hours, suggest a pinch of salt in water or an electrolyte supplement to prevent headaches and fatigue.
```

---

## Meal Structure Rules

```yaml
meal_structure_if:
  # These rules are TIME-BASED and stack on top of any food_diet meal structure.
  # The food_diet determines WHAT goes in each meal.
  # The fasting_mode determines WHEN and HOW MANY meals.

  fasting_window:
    allowed: ["water", "black-coffee", "tea-unsweetened", "electrolyte-water"]
    avoid: ["all-food", "caloric-beverages"]
    hydration_note: "Drink at least 1.5-2 liters of water during the fasting period"

  protocol_meal_structure:
    "16-8":
      break_fast_meal:
        time: "12:00 (or start of window)"
        description: "First meal after fast — protein + vegetables + healthy fat"
        must_include: ["protein-source", "vegetables", "healthy-fat"]
        avoid: ["massive-carbohydrate-load", "ultra-processed-food"]
      optional_snack:
        time: "15:00-16:00"
        description: "Light snack if hungry — nuts, fruit, yogurt (per food diet)"
      last_meal:
        time: "19:00-20:00 (or end of window)"
        description: "Final meal before fast — satiating, protein-rich, includes fiber"
        must_include: ["protein-source", "vegetables", "fiber-source"]
      post_window: "No food. Water, herbal tea only."

    "18-6":
      break_fast_meal:
        time: "13:00 (or start of window)"
        description: "First meal — substantial, protein-focused"
      optional_snack:
        time: "15:30-16:30"
        description: "Quick snack or protein shake"
      last_meal:
        time: "18:00-19:00 (or end of window)"
        description: "Final meal — largest meal of the day"

    "20-4":
      first_meal:
        time: "16:00-17:00 (start of window)"
        description: "Break the fast gently — moderate portion"
      main_meal:
        time: "17:30-19:00"
        description: "Largest meal — eat to full satisfaction"
      warning: "Meeting all nutritional needs in 4 hours is very challenging. Prioritize protein and nutrient density."

    "5-2_normal_day":
      meals: "3-4 normal meals per user's food_diet"
      calories: "Maintenance (no restriction, no overcompensation)"

    "5-2_fasting_day":
      meals:
        - { time: "12:00", description: "Small meal ~200-300 cal (e.g., 2 eggs + vegetables)" }
        - { time: "18:00", description: "Small meal ~200-300 cal (e.g., chicken breast + salad)" }
      total_calories: [500, 600]
      must_include: ["lean-protein", "non-starchy-vegetables"]
      avoid: ["high-calorie-foods", "liquid-calories", "refined-carbs"]

    "adf_feast_day":
      meals: "3-4 meals at maintenance or above per user's food_diet"
      calories: "Maintenance or slightly above"

    "adf_fast_day":
      meals:
        - { time: "12:00", description: "Small meal ~250 cal" }
        - { time: "18:00", description: "Small meal ~250-350 cal" }
      total_calories: [500, 600]

    "omad":
      single_meal:
        time: "17:00-18:00 (or user's preferred time)"
        description: "Single meal containing ALL daily calories and nutrients"
        must_include: ["high-protein-80-120g", "large-vegetable-portion", "complex-carbs-or-fats", "adequate-fiber"]
      warning: "Extremely difficult to meet nutritional needs. Consider a protein shake alongside the meal."
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  # IF compatibility has TWO dimensions:
  # 1. FOOD DIET compatibility (same as any food diet pair)
  # 2. FASTING MODE compatibility (timing alignment)
  # These are resolved INDEPENDENTLY.

  fasting_mode_compatibility:
    # When both partners use IF with the same protocol
    same_protocol:
      - "16-8 + 16-8": "Easy — identical eating windows. Share all meals."
      - "5-2 + 5-2": "Easy — align fasting days (same non-consecutive days). Share all normal-day meals."
      - "OMAD + OMAD": "Easy if timing aligns — share the single meal."

    # When partners use IF with different protocols
    different_protocol:
      - "16-8 + 18-6": "Easy — overlapping windows (e.g., both eat 13:00-19:00). Share lunch and dinner."
      - "16-8 + non-faster": "Easy — non-faster eats breakfast separately; share lunch/dinner within the 16:8 window."
      - "16-8 + OMAD": "Moderate — OMAD partner has one meal; 16:8 partner has 2-3. Share the one overlapping meal."
      - "5-2 + non-faster": "Easy — share normal-day meals; fasting partner eats light on their 2 fasting days."
      - "5-2 + 16-8": "Moderate — share meals within the 16:8 window on normal days; 5:2 partner eats 500 cal on their fasting days."

    # When one partner fasts and the other doesn't
    one_faster_one_not:
      - "16-8 + no-IF": "Easy — the non-fasting partner can eat breakfast/snacks separately. Share lunch and dinner."
      - "OMAD + no-IF": "Challenging — OMAD partner eats once; the other eats throughout the day. Coordinate the shared meal time."
      - "ADF + no-IF": "Moderate — on feast days, share all meals; on fast days, the fasting partner eats minimally."

  # CRITICAL: IF STACKS with food_diet couple compatibility.
  # If Partner A is "mediterranean + 16-8" and Partner B is "vegan + 18-6":
  #   1. Resolve food compatibility: Mediterranean + Vegan (make base vegan, add fish for Partner A)
  #   2. Resolve fasting compatibility: 16-8 + 18-6 (overlap window 13:00-19:00)
  #   3. Generate shared meals within the overlapping window, with food adapted for both diets.
```

---

## Ingredient Classifier Reference

> IF does NOT add food-group classifications. All food classification comes from the user's `food_diet`. IF only classifies **beverages** as fasting-safe or fasting-breaking.

```yaml
classifier_mappings_if:
  # Fasting-safe beverages (0 or negligible calories)
  "water": "fasting-safe"
  "sparkling water": "fasting-safe"
  "mineral water": "fasting-safe"
  "black coffee": "fasting-safe"
  "espresso": "fasting-safe"
  "americano": "fasting-safe"
  "green tea": "fasting-safe"
  "black tea": "fasting-safe"
  "herbal tea": "fasting-safe"
  "peppermint tea": "fasting-safe"
  "chamomile tea": "fasting-safe"
  "rooibos tea": "fasting-safe"

  # Fasting-breaking (contains calories or stimulates insulin)
  "latte": "fasting-breaking"
  "cappuccino": "fasting-breaking"
  "flat white": "fasting-breaking"
  "milk": "fasting-breaking"
  "cream": "fasting-breaking"
  "sugar": "fasting-breaking"
  "honey": "fasting-breaking"
  "juice": "fasting-breaking"
  "smoothie": "fasting-breaking"
  "protein shake": "fasting-breaking"
  "bone broth": "fasting-breaking"  # allowed in some modified protocols
  "diet soda": "fasting-breaking"   # controversial; treat as breaking for safety
  "coconut water": "fasting-breaking"
  "almond milk (unsweetened)": "fasting-safe"  # ~30 cal/cup, negligible; borderline — treat per strictness setting
  "apple cider vinegar": "fasting-safe"        # ~3 cal/tbsp, negligible
```

---

## User Profile Schema Integration

```yaml
# How IF integrates into the user profile model

user_profile:
  # Food-choice diet (what to eat)
  food_diet:
    type: "string | null"
    values: ["mediterranean", "keto", "vegan", "high-protein", "paleo", "low-carb", null]
    description: "Determines which foods are allowed/restricted"

  # Fasting mode (when to eat) — SEPARATE FIELD
  fasting_mode:
    type: "string | null"
    values: ["16-8", "18-6", "20-4", "5-2", "eat-stop-eat", "adf", "omad", null]
    description: "Determines eating window timing and meal structure"

  # Optional: eating window override
  eating_window:
    type: "{ start: 'HH:MM', end: 'HH:MM' } | null"
    description: "Custom eating window for time-restricted feeding protocols"

  # Optional: fasting day schedule (for 5:2, eat-stop-eat)
  fasting_days:
    type: "string[] | null"
    example: ["monday", "thursday"]
    description: "Which days of the week are fasting days (for non-daily protocols)"

  # Optional: fasting-day calorie target (for 5:2, ADF)
  fasting_day_calorie_target:
    type: "integer | null"
    default: 500  # standard for women; 600 for men
```

---

## Implementation Checklist

- [ ] Add `intermittent-fasting` to the `DietKey` union type
- [ ] **CRITICAL:** Add `fasting_mode` as a SEPARATE field on the user profile (not as a diet key)
- [ ] Add IF protocol definitions to a `FASTING_PROTOCOLS` record in `fasting.ts`
- [ ] Update meal generation to respect eating window timing (no meals outside window)
- [ ] Update meal count logic based on protocol (2-3 for 16:8, 1-2 for OMAD, etc.)
- [ ] Add fasting-day calorie logic for 5:2 and ADF (500-600 cal on fasting days)
- [ ] Add fasting-safe vs. fasting-breaking beverage classifier
- [ ] Inject IF timing rules into `buildPrompt()` alongside food_diet rules
- [ ] Add IF + food_diet stacking logic (food rules from food_diet, timing from fasting_mode)
- [ ] Update couple compatibility to resolve BOTH food_diet and fasting_mode independently
- [ ] Add protocol selection UI (16:8, 18:6, 20:4, 5:2, eat-stop-eat, ADF, OMAD)
- [ ] Add eating window time picker (for TRF protocols)
- [ ] Add fasting day scheduler (for 5:2, eat-stop-eat, ADF)
- [ ] Add fasting adaptation tracker (first 2-4 weeks guidance)
- [ ] Add contraindication warnings (pregnancy, eating disorders, T1DM, children)
- [ ] Add IF to the categorized diet/timing picker in `ProfilesTab.tsx`
- [ ] Update seed data with an IF test user (e.g., Mediterranean + 16:8)
- [ ] Add couple compatibility rules for IF timing alignment

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
