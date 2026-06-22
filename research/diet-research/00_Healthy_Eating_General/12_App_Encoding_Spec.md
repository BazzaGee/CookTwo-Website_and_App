# App Encoding Spec: "Healthy Eating / No Specific Diet"

> **Purpose:** Machine-readable specification for encoding the **healthy-eating (balanced, no specific diet)** option in the Cupla app. This is the most flexible dietary profile and serves as the evidence-based **default** — compatible with all other profiles and free of any restriction.

---

## 1. Diet metadata

```yaml
diet:
  diet_key: "healthy-eating"
  display_label: "No specific diet — just eat healthy"
  short_label: "Healthy eating"
  category: "balanced"
  emoji: "🥗"
  evidence_grade: "A"
  evidence_summary: >
    The totality of nutrition science supports a balanced, whole-food-focused
    dietary pattern with no elimination of any macronutrient or food group.
    This profile reflects the Mediterranean, DASH, and Harvard Healthy Eating
    Plate patterns — the most evidence-supported approaches to lifelong health.
  flexibility: "maximum"
  restrictiveness: "none"
  compatible_with_all_other_diets: true
  is_default: true
  description: |
    Eat a balanced variety of whole and minimally-processed foods. All
    macronutrients (carbohydrate, fat, protein) and all food groups are
    welcome. No foods are forbidden. The emphasis is on what to ADD —
    vegetables, fruits, whole grains, legumes, nuts, seeds, and healthy fats —
    not on what to remove. This is the most sustainable, evidence-based
    approach to lifelong healthy eating.
```

---

## 2. Restricted food groups

```yaml
restricted_food_groups: []   # EMPTY — no food groups are restricted

restricted_foods: []          # No individual foods are banned

forbidden_macros: []          # No macronutrients are eliminated

notes: |
  This profile deliberately has NO restrictions. The scientific evidence does
  not support eliminating any macronutrient or whole-food group for the
  general population. All foods are permitted; the guidance emphasizes
  quality, variety, and balance rather than restriction.
```

---

## 3. Allowed food groups (everything, with emphasis)

```yaml
allowed_food_groups:
  - group: "vegetables"
    emphasis: "high"
    note: "All types; aim for variety of color. Half the plate."
  - group: "fruits"
    emphasis: "high"
    note: "All whole fruits. Frozen/canned (in juice) are fine."
  - group: "whole_grains"
    emphasis: "high"
    note: "Whole wheat, oats, rice, quinoa, barley, corn, etc. ~1/4 plate."
  - group: "refined_grains"
    emphasis: "moderate"
    note: "White rice, white pasta, white bread are fine in moderation; vary with whole grains."
  - group: "legumes"
    emphasis: "high"
    note: "Beans, lentils, chickpeas, peas. Most cost-effective protein; longevity food."
  - group: "nuts_seeds"
    emphasis: "high"
    note: "Handful daily associated with reduced mortality."
  - group: "fish_seafood"
    emphasis: "high"
    note: "Oily fish (salmon, sardines, mackerel) 1–2x/week for omega-3."
  - group: "poultry"
    emphasis: "moderate"
    note: "Fine as a regular protein source."
  - group: "eggs"
    emphasis: "moderate"
    note: "Not associated with CVD risk in general population."
  - group: "lean_meat"
    emphasis: "moderate"
    note: "Unprocessed red meat in moderation is acceptable."
  - group: "dairy"
    emphasis: "moderate"
    note: "Yogurt, cheese, milk. Full-fat is fine. Fermented dairy encouraged."
  - group: "healthy_fats"
    emphasis: "high"
    note: "Olive oil, avocado, nuts, seeds, fatty fish."
  - group: "processed_meats"
    emphasis: "low"
    note: "Limit (sausage, bacon, deli meats) — consistently associated with harm. Not banned, but minimize."
  - group: "sweets_treats"
    emphasis: "low"
    note: "Occasional, enjoyed mindfully. No guilt, no rules — part of the 20% in 80/20."
  - group: "beverages"
    emphasis: "water_primary"
    note: "Water main beverage; tea/coffee fine (unsweetened); limit sugary drinks and alcohol."

foods_to_emphasize:
  - "vegetables (all colors)"
  - "fruits (all kinds)"
  - "whole grains"
  - "legumes (beans, lentils, chickpeas)"
  - "nuts and seeds"
  - "oily fish"
  - "olive oil and other healthy fats"
  - "fermented dairy (yogurt, kefir)"
  - "eggs"
  - "herbs and spices"

foods_to_limit_not_ban:
  - "ultra-processed foods (NOVA group 4)"
  - "sugary drinks"
  - "processed meats"
  - "industrial pastries and confectionery (as everyday staples, not as occasional treats)"
```

---

## 4. Macronutrient targets (flexible ranges)

```yaml
macro_targets:
  carbohydrate:
    percent_of_calories_min: 45
    percent_of_calories_max: 65
    note: >
      Wide range reflects that carbohydrate intake varies enormously across
      healthy populations (Okinawa ~85%, Mediterranean ~45–55%). Whole-food
      sources emphasized; ultra-processed carbs limited.
  fat:
    percent_of_calories_min: 20
    percent_of_calories_max: 35
    note: >
      Up to ~40% acceptable with Mediterranean-style patterns. Whole-food
      fat sources (olive oil, nuts, avocado, fish) emphasized. Trans fats avoided.
  protein:
    percent_of_calories_min: 10
    percent_of_calories_max: 35
    note: >
      ~1.6–2.2 g/kg/day sufficient for most goals (Morton 2018).
      Mix of plant and animal sources encouraged.

macro_philosophy: "flexible"
  # Macros are GUIDELINES, not rigid targets. The app should not obsessively
  # track or police macros for this profile. The emphasis is on food quality
  # and plate composition, not on hitting exact percentages.

fiber_target:
  grams_per_day_min: 25
  grams_per_day_ideal: 30
  note: "From whole-food sources (vegetables, fruit, grains, legumes, nuts)."

sodium:
  note: "Limit to <2300 mg/day generally; less processed food makes this easy."

added_sugar:
  percent_of_calories_max: 10
  note: "WHO guideline. Whole-fruit sugar does NOT count."
```

---

## 5. AI prompt instructions

This is the core instruction set passed to the Cupla meal-planning / recipe-generation AI when a couple selects the **healthy-eating** profile.

```yaml
ai_prompt_instructions:
  profile: "healthy-eating"

  core_directives:
    - >
      Emphasize VARIETY, BALANCE, and WHOLE FOODS. Every meal should include
      all three macronutrients (carbohydrate, protein, fat) from whole or
      minimally-processed sources.
    - >
      Do NOT restrict any food group. All foods are allowed. The guidance is
      about what to ADD, not what to REMOVE.
    - >
      Emphasize nutrient density — vegetables, fruits, whole grains, legumes,
      nuts, seeds, and healthy fats should dominate the plate.
    - >
      Build meals around the Harvard Healthy Eating Plate: ~1/2 vegetables/fruit,
      ~1/4 whole grains, ~1/4 protein, plus healthy fats and water.
    - >
      Encourage colorful plates — a variety of vegetables and fruits across
      the week ensures a range of micronutrients and phytochemicals.
    - >
      Encourage cooking from scratch using whole ingredients. Favor home-cooked
      meals over ultra-processed convenience foods.
    - >
      Include plant-based proteins (legumes, tofu, tempeh) regularly, alongside
      or instead of animal protein.
    - >
      Include oily fish 1–2 times per week for omega-3 fatty acids.
    - >
      Use extra-virgin olive oil, avocado oil, nuts, and seeds as primary fat
      sources.

  prohibited_directives:
    - "Do NOT frame any food as 'good' or 'bad', 'clean' or 'dirty', 'cheat' or 'guilt-free'."
    - "Do NOT eliminate or restrict any macronutrient (no low-carb, low-fat, or low-protein framing)."
    - "Do NOT eliminate any whole-food group (grains, dairy, meat, fruit, etc.)."
    - "Do NOT use weight-loss-centric language or promise weight loss."
    - "Do NOT prescribe calorie restriction or rigid calorie counting as the primary approach."
    - "Do NOT moralize food choices or imply guilt around eating."
    - "Do NOT promote detoxes, cleanses, juice fasts, or supplement-based 'fixes'."
    - "Do NOT recommend ultra-processed 'diet' foods (e.g., highly processed low-calorie bars/shakes) as staples."

  recommended_language:
    use:
      - "nourish"
      - "balance"
      - "variety"
      - "whole foods"
      - "colorful"
      - "enjoy"
      - "satisfying"
      - "fresh"
      - "home-cooked"
      - "flexible"
    avoid:
      - "cheat meal"
      - "clean eating"
      - "guilt-free"
      - "skinny"
      - "detox"
      - "superfood"   # (overhyped; encourage variety instead)
      - "bad food"
      - "forbidden"

  meal_generation_guidance:
    plate_model: "Harvard Healthy Eating Plate"
    typical_meal_structure:
      - "1/2 plate: vegetables and/or fruit (variety of colors)"
      - "1/4 plate: whole or minimally-processed grains/starch"
      - "1/4 plate: protein (animal and/or plant)"
      - "Healthy fat: olive oil, nuts, seeds, avocado, or oily fish"
      - "Beverage: water, unsweetened tea, or coffee"
    breakfast_note: "No rules — any balanced meal is acceptable, including savory or leftovers."
    snack_note: "Snacks are fine; encourage whole-food snacks (fruit + nuts, yogurt, veg + hummus)."

  personalization_variables:
    - "cuisine_preference"        # Italian, Mexican, Japanese, Indian, etc.
    - "cooking_skill_level"       # beginner / intermediate / advanced
    - "cooking_time_available"    # quick weeknight vs. weekend cooking
    - "budget"                    # budget-conscious / moderate / flexible
    - "household_size"
    - "allergies_and_intolerances"   # celiac, lactose, nut allergy, etc.
    - "dislikes"                  # personal preferences honored (these are not 'restrictions' — they are preferences)
    - "equipment_available"       # stovetop only, oven, instant pot, etc.
```

---

## 6. Meal structure model

```yaml
meal_structure:
  model: "Harvard Healthy Eating Plate"
  description: >
    A flexible plate-composition guideline (not a rigid prescription).
    Adjusts to any cuisine, budget, or preference.

  proportions:
    vegetables_and_fruit:
      share: "1/2 plate"
      examples:
        - "leafy greens, broccoli, carrots, peppers, tomatoes"
        - "side salad, roasted vegetables, stir-fried vegetables"
        - "fresh fruit as part of the meal or dessert"
      note: "Potatoes/fries do not count toward the vegetable portion."
    whole_grains:
      share: "1/4 plate"
      examples:
        - "whole wheat, oats, brown or white rice, quinoa, barley, corn, pasta, bread"
      note: "Intact/minimally-processed grains preferred; white grains fine in moderation."
    protein:
      share: "1/4 plate"
      examples:
        - "fish, poultry, eggs, beans, lentils, tofu, tempeh, nuts, lean meat"
      note: "Plant proteins encouraged and should feature regularly. Limit processed meats."
    healthy_fats:
      share: "in moderation"
      examples:
        - "olive oil, avocado, nuts, seeds, fatty fish"
      note: "Use in cooking and dressings; avoid trans fats."

  beverages:
    primary: "water"
    also_fine: ["unsweetened tea", "coffee (unsweetened)", "sparkling water"]
    limit: ["sugary drinks", "fruit juice", "alcohol"]
    dairy: "1–2 servings/day optional (milk, yogurt, fortified plant alternative)"

  flexibility_note: >
    The plate model is a guide, not a law. Many healthy meals (soups, stews,
    curries, pasta dishes, bowls) do not look like a divided plate. The
    principle — plenty of vegetables, some whole grains/starch, some protein,
    some healthy fat — is what matters, not the literal visual layout.
```

---

## 7. Couple compatibility

```yaml
couple_compatibility:
  profile: "healthy-eating"
  compatible_with_all_other_diets: true

  compatibility_matrix:
    healthy-eating: "full"
    mediterranean: "full"
    vegetarian: "full"
    vegan: "full"
    pescatarian: "full"
    flexitarian: "full"
    low-carb: "full"           # healthy-eating can accommodate lower-carb choices without restriction
    keto: "full"               # compatible — healthy-eating is the superset
    paleo: "full"
    gluten-free: "full"
    dairy-free: "full"
    halal: "full"
    kosher: "full"
    low-fodmap: "full"
    diabetic_friendly: "full"
    heart_healthy: "full"
    weight_management: "full"

  explanation: >
    Because this profile has NO restrictions, it is compatible with every
    other profile in the app. It is the universal "common ground" option.
    When one partner selects healthy-eating and the other selects a more
    specific diet, the app should generate meals that satisfy BOTH —
    which is always possible here, since healthy-eating imposes no
    constraints that could conflict.

  recommendation_when_partners_disagree: >
    If partners cannot agree on a specific diet, recommend the healthy-eating
    profile as the shared default. It is the lowest-friction, most inclusive
    option and is itself the most evidence-supported approach.
```

---

## 8. Implementation checklist

```yaml
implementation_checklist:

  metadata:
    - done: false
      task: "Register diet_key 'healthy-eating' in the diet registry."
    - done: false
      task: "Set display_label, emoji, category, evidence_grade per spec in §1."
    - done: false
      task: "Flag as is_default = true (recommended default selection for new users)."

  restrictions:
    - done: false
      task: "Ensure restricted_food_groups is an EMPTY array."
    - done: false
      task: "Ensure no foods, macros, or groups are banned anywhere in the app for this profile."
    - done: false
      task: "Verify the meal-generation AI never refuses a food on the basis of this profile."

  food_groups:
    - done: false
      task: "Load allowed_food_groups with emphasis tiers (§3)."
    - done: false
      task: "Ensure 'processed_meats' and 'sweets_treats' are flagged as 'limit', NOT 'ban'."
    - done: false
      task: "Ensure foods_to_emphasize list is used to boost ranking in recipe suggestions."

  macros:
    - done: false
      task: "Load flexible macro ranges (§4)."
    - done: false
      task: "Ensure macros are presented as GUIDELINES, not hard targets."
    - done: false
      task: "Disable any rigid macro-police / warnings for this profile."

  ai_prompt:
    - done: false
      task: "Wire ai_prompt_instructions (§5) into the meal-planning prompt template."
    - done: false
      task: "Add negative directives (prohibited_directives) as hard constraints."
    - done: false
      task: "Add language allow/avoid list to tone/lint layer for AI output."
    - done: false
      task: "Verify no output contains banned terms ('cheat', 'clean', 'guilt-free', 'detox', 'bad food')."

  meal_structure:
    - done: false
      task: "Use Harvard Healthy Eating Plate as the default meal-template reference."
    - done: false
      task: "Ensure recipe diversity spans cuisines, colors, and protein sources."
    - done: false
      task: "Include both quick weeknight and longer weekend meal options."

  compatibility:
    - done: false
      task: "Mark healthy-eating as compatible_with_all_other_diets = true."
    - done: false
      task: "Verify couple-matching logic never produces a conflict for this profile."
    - done: false
      task: "When partners disagree, surface healthy-eating as the recommended common ground."

  ux_and_language:
    - done: false
      task: "Audit onboarding copy for diet-culture language and replace per §5."
    - done: false
      task: "Ensure the profile description frames eating as addition, not subtraction."
    - done: false
      task: "Ensure no progress metric relies solely on weight or calorie counting."
    - done: false
      task: "Include non-scale wins (energy, variety, cooking together, enjoyment)."

  content_references:
    - done: false
      task: "Link evidence summary to Files 09–11 of the research library."
    - done: false
      task: "Surface Harvard Healthy Eating Plate visual in onboarding."

  testing:
    - done: false
      task: "Generate 50 sample meals and verify none restrict a permitted food group."
    - done: false
      task: "Verify macro ranges are respected without rigid enforcement."
    - done: false
      task: "Verify couple-compatibility tests pass for every other profile pairing."
    - done: false
      task: "Verify no AI sample output contains banned language terms."
```

---

## 9. Notes for product and content teams

- **This is the recommended default.** For users who have no specific dietary requirement, medical condition, or strong preference, this profile should be the pre-selected option. It is the most evidence-based and the most sustainable.
- **It is the superset of all other profiles.** Every other diet in the app is a *specialization* of healthy-eating with one or more constraints added. This makes healthy-eating the natural "common ground" when couples disagree.
- **The tone is critical.** The single biggest risk to this profile is creeping diet-culture language ("clean," "cheat," "guilty pleasure"). Every piece of UI copy, recipe description, and AI output must be audited against the language allow/avoid list in §5.
- **No moralization.** Healthy eating framed as virtue and indulgence framed as sin is the exact pattern that produces disordered eating and diet failure. The app should always frame food choices neutrally and supportively.
- **Health > weight.** Success metrics should emphasize behaviors (vegetable variety, home cooking, shared meals, energy levels) rather than the scale.

---

## 10. Evidence base (summary)

This profile reflects the convergence of:

- **Harvard Healthy Eating Plate** (Harvard T.H. Chan School of Public Health)
- **Mediterranean diet** evidence (PREDIMED trial; Estruch et al., 2018, *NEJM*)
- **DASH diet** evidence (Appel et al., 1997, *NEJM*)
- **Global Burden of Disease** dietary risk analysis (Afshin et al., 2019, *Lancet*)
- **NOVA ultra-processed food** research (Monteiro et al.; Hall et al., 2019, *Cell Metab*)
- **Blue Zones** observational longevity data (Buettner; legumes as common factor)
- **Intuitive Eating & HAES** sustainability evidence (Tribole & Resch; Bacon & Aphramor, 2011)

See Files **09_Myth_Debunking.md**, **10_Diet_Culture_vs_Sustainable_Eating.md**, and **11_Practical_Framework.md** in this research library for the full scientific case.
