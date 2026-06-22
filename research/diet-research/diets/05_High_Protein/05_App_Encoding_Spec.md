# High-Protein Diet — App Encoding Spec

> Machine-readable specification for integrating the high-protein diet into Cupla's AI meal generation system. This file is designed for direct implementation by developers.

---

## Diet Metadata

```yaml
diet_key: "high-protein"
display_label: "High-Protein"
category: "macronutrient-focused"
emoji: "💪"
short_description: "Prioritize protein for satiety, muscle, and body composition"
evidence_grade: "B"
restrictiveness: 2  # 1-5 scale (only macro ratio prescribed; food choice is flexible)
sodium_restriction: "none"
protein_priority: true  # flags this diet as protein-optimized
```

---

## Food Group Rules

### Allowed Food Groups (Core Protein Sources)

```yaml
allowed_food_groups:
  # Lean animal protein (primary)
  - "chicken-breast"          # skinless, highest protein-to-calorie ratio
  - "turkey-breast"           # similar to chicken
  - "lean-beef"               # sirloin, flank, tenderloin (26-28g/100g)
  - "pork-tenderloin"         # leanest pork cut
  - "lean-ground-meat"        # 93/7 ground turkey or beef

  # Fish & seafood
  - "fish-fatty"              # salmon, mackerel, sardines (also omega-3)
  - "fish-lean"               # cod, halibut, tilapia, tuna (very lean)
  - "seafood"                 # shrimp, mussels, clams, squid

  # Eggs
  - "whole-eggs"              # complete protein; choline, lutein
  - "egg-whites"              # pure protein, nearly fat-free

  # Dairy (high-protein)
  - "greek-yogurt"            # 17-20g protein per cup (non-fat or 2%)
  - "cottage-cheese"          # 14g per ½ cup; rich in casein
  - "milk-skim"               # 8-10g per cup
  - "ricotta"                 # 14g per ½ cup (part-skim)
  - "string-cheese"           # 7g per stick; convenient snack

  # Legumes (also high-fiber)
  - "lentils"                 # 9g per ½ cup cooked
  - "chickpeas"               # 8g per ½ cup cooked
  - "black-beans"             # 8g per ½ cup cooked
  - "edamame"                 # 9g per ½ cup; complete protein (soy)
  - "split-peas"              # 8g per ½ cup cooked

  # Soy & plant protein
  - "tofu"                    # 12-17g per 100g; complete protein
  - "tempeh"                  # 19g per 100g; highest-protein whole plant food
  - "seitan"                  # 25g per 100g; very high protein
  - "tvp"                     # textured vegetable protein; 12g per ¼ cup dry

  # Nuts, seeds & high-protein grains
  - "pumpkin-seeds"           # 8g per 30g; also magnesium, zinc
  - "hemp-seeds"              # 10g per 30g; complete protein
  - "chia-seeds"              # 5g per 30g; also fiber, omega-3
  - "peanut-butter"           # 7g per 2 tbsp; calorie-dense
  - "almonds"                 # 6g per 30g
  - "quinoa"                  # 4g per ½ cup cooked; complete protein

  # Protein supplements
  - "whey-protein"            # 20-28g per scoop; fast-absorbing
  - "casein-protein"          # 20-24g per scoop; slow-absorbing
  - "plant-protein-blend"     # 20-24g per scoop; pea + rice blend
  - "pea-protein"             # 20-24g per scoop
  - "soy-protein"             # 20-24g per scoop
  - "protein-bars"            # 15-25g per bar (check sugar)

  # Vegetables (for fiber + micronutrients alongside protein)
  - "leafy-greens"            # spinach, kale, arugula
  - "cruciferous"             # broccoli, Brussels sprouts, cauliflower
  - "peppers"
  - "asparagus"               # 3g per cup; good protein for a vegetable
  - "mushrooms"
  - "alliums"                 # onion, garlic
  - "tomatoes"
  - "root-vegetables"         # carrots, beets, sweet potato (moderate)

  # Fruits (moderate, for fiber and micronutrients)
  - "berries"                 # strawberries, blueberries, raspberries
  - "citrus"                  # oranges, lemons, grapefruit
  - "apples"                  # with skin for fiber
  - "bananas"                 # good post-workout carb
  - "stone-fruit"             # peaches, plums, cherries

  # Whole grains (moderate, per calorie budget)
  - "whole-grains"            # oats, brown rice, quinoa, farro, bulgur
  - "whole-grain-bread"       # for wraps, toast

  # Healthy fats
  - "olive-oil"               # for cooking and dressing
  - "avocado"                 # also contains some protein
  - "nuts"                    # almonds, walnuts, pistachios (moderate; calorie-dense)

  # Flavoring
  - "herbs"                   # all
  - "spices"                  # all
  - "lemon-lime"
  - "garlic"

  # Beverages
  - "water"
  - "coffee"                  # unsweetened
  - "tea"                     # unsweetened
```

### Restricted Food Groups (Minimize or Avoid)

```yaml
restricted_food_groups:
  - "processed-meat"          # sausage, bacon, hot dogs, deli meats — WHO Group 1 carcinogen; high sodium
  - "fried-protein"           # fried chicken, fish & chips — adds empty calories from oil
  - "high-fat-red-meat"       # ribeye, T-bone, brisket — high saturated fat; prefer lean cuts
  - "ultra-processed-food"    # low nutrient density
  - "sugary-drinks"           # soda, juice with added sugar
  - "refined-sugar"           # sweets, pastries, candy
  - "refined-grains"          # white bread, white rice (prefer whole grain)
  - "full-fat-cheese-large"   # calorie-dense; small amounts ok, large amounts displace lean protein
  - "high-sugar-protein-bars" # bars with >15g sugar
```

### Moderate Food Groups

```yaml
moderate_food_groups:
  - "red-meat": "lean cuts (sirloin, flank) 2-3x/week for iron, B12, creatine; avoid daily high-fat cuts"
  - "cheese": "30-40g/day max; prefer lower-fat options (feta, part-skim mozzarella)"
  - "whole-grains": "per calorie budget; 2-4 servings/day for fiber and energy"
  - "fruits": "2-3 servings/day for fiber, vitamins, antioxidants"
  - "nuts-and-seeds": "1-2 handfuls/day (calorie-dense but nutritious)"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  # Default targets for a standard high-protein diet
  # These can be further customized based on user's goal (weight loss, muscle building, etc.)

  protein_pct: [25, 35]          # 25-35% of calories from protein
  protein_g_per_kg: [1.6, 2.2]   # 1.6-2.2 g/kg body weight (PRIMARY metric)
  carbs_pct: [30, 45]            # 30-45% of calories from carbohydrates
  fat_pct: [25, 35]              # 25-35% of calories from fat
  saturated_fat_pct: [0, 10]     # <10% of calories
  fiber_g: [25, 35]              # 25-35g/day — CRITICAL for high-protein diets
  sodium_mg: [0, 2300]           # <2300mg/day

  # Goal-specific overrides
  goal_overrides:
    weight_loss:
      protein_g_per_kg: [1.6, 2.2]
      description: "Maximize satiety and lean mass preservation during deficit"
    muscle_building:
      protein_g_per_kg: [1.6, 2.2]
      description: "Maximize muscle protein synthesis with resistance training"
    aggressive_cut:
      protein_g_per_kg: [2.2, 3.0]
      description: "Preserve lean mass during severe caloric deficit (bodybuilding)"
    athletic_endurance:
      protein_g_per_kg: [1.2, 1.6]
      description: "Support repair and recovery from endurance training"
    elderly_sarcopenia:
      protein_g_per_kg: [1.0, 1.2]
      protein_per_meal_g: [30, 40]  # higher per-meal to overcome anabolic resistance
      description: "Prevent age-related muscle loss"

  # Per-meal protein distribution (critical for MPS)
  protein_per_meal_g: [25, 40]     # 25-40g per main meal (exceeds leucine threshold)
  protein_meals_per_day: [3, 4]    # distribute across 3-4 meals
  leucine_per_meal_g: [2.5, 3.0]  # leucine threshold for maximal MPS
```

---

## AI Prompt Instructions

```
HIGH-PROTEIN DIET RULES — Follow strictly:

1. PROTEIN TARGET: Every meal must contain a substantial protein portion. Aim for 25-40g of protein per main meal (breakfast, lunch, dinner). Each meal should exceed the leucine threshold (~2.5-3g leucine, equivalent to ~25-30g of animal protein or ~35-40g of plant protein).

2. PROTEIN DISTRIBUTION: Distribute protein evenly across 3-4 meals. Do NOT concentrate most of the daily protein in one meal. The pattern should be approximately: 30g breakfast / 35g lunch / 40g dinner / 15g snack(s).

3. PROTEIN SOURCE: Feature a high-quality protein source as the CENTER of each meal. Every main meal must have a clearly identifiable primary protein (e.g., chicken breast, salmon, Greek yogurt, eggs, tofu, tempeh, protein shake).

4. LEAN PROTEIN PRIORITY: Default to lean protein sources (chicken breast, turkey, white fish, egg whites, non-fat Greek yogurt, cottage cheese, tofu). Use higher-fat proteins (salmon, beef, whole eggs, cheese) in moderation.

5. BREAKFAST PROTEIN: Breakfast is critical — many people under-eat protein at breakfast. Ensure breakfast contains at least 25g of protein. Good options: Greek yogurt + eggs, protein smoothie, cottage cheese + fruit, egg white omelet with lean protein.

6. VEGETABLES REQUIRED: High-protein does NOT mean meat-only. Every meal must include vegetables (for fiber, micronutrients, and antioxidants). Aim for 2+ servings of vegetables at lunch and dinner.

7. FIBER: Total daily fiber should be 25-35g. Include legumes, vegetables, whole grains, and fruits alongside protein.

8. PROCESSED MEAT: Do NOT include processed meats (sausage, bacon, hot dogs, deli meats) as protein sources. Use fresh, whole protein sources only.

9. DAIRY: Greek yogurt and cottage cheese are excellent protein sources — include them regularly (daily is ideal).

10. PROTEIN SUPPLEMENTS: Whey or plant protein powder can be used as a convenient protein source for 1 meal/snack per day. Do NOT make supplements the sole protein source for more than 1 meal per day.

11. BALANCE: Do NOT eliminate carbohydrates or fats. Include whole grains, fruits, and healthy fats (olive oil, avocado, nuts) alongside protein. A balanced plate is: ¼ plate lean protein, ¼ plate complex carbs, ½ plate vegetables, plus a thumb of healthy fat.

12. COOKING METHOD: Favor grilling, baking, roasting, poaching, and sautéing over frying. Frying adds excessive calories and unhealthy fats.

13. RED MEAT: Lean red meat (sirloin, flank) is acceptable 2-3x/week for iron, B12, zinc, and creatine. Avoid fatty cuts (ribeye, T-bone) and processed red meat.
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    typical: "Greek yogurt with nuts and berries; OR protein smoothie; OR eggs/egg whites with vegetables and toast; OR cottage cheese with fruit"
    must_include: ["protein-source (25g+)", "complex-carb OR fruit", "healthy-fat (optional)"]
    protein_target_g: [25, 40]
    avoid: ["cereal with low protein", "pastries", "bacon (processed)", "sugary yogurt"]

  lunch:
    typical: "Grilled chicken/turkey/fish salad or wrap with vegetables; OR grain bowl with lean protein; OR lentil/bean soup with added protein"
    must_include: ["protein-source (30g+)", "vegetables (2+ servings)", "complex-carb (optional)"]
    protein_target_g: [30, 40]
    protein_preference: "chicken, turkey, fish, tofu, or legumes"
    avoid: ["low-protein salads", "pasta without protein", "sandwiches with minimal protein"]

  snack:
    typical: "Protein shake, Greek yogurt, cottage cheese, hard-boiled eggs, jerky (low-sugar), edamame, nuts"
    must_include: ["protein-source (10-20g)"]
    protein_target_g: [10, 20]
    avoid: ["chips", "candy", "low-protein snacks"]

  dinner:
    typical: "Lean meat/fish/tofu with vegetables and complex carb; OR stir-fry with protein; OR protein + roasted vegetables"
    must_include: ["protein-source (30g+)", "vegetables (2+ servings)", "healthy-fat"]
    protein_target_g: [30, 50]
    protein_preference: "fish (especially fatty fish 2-3x/week), chicken, lean beef, tofu, tempeh"
    avoid: ["pasta-only dinners", "low-protein meals", "fried protein"]

  pre_sleep_snack:
    typical: "Cottage cheese (casein protein for slow overnight release); OR Greek yogurt; OR casein protein shake"
    must_include: ["slow-digesting protein (casein)"]
    protein_target_g: [20, 40]
    optional: true
    notes: "Particularly beneficial for athletes and those in caloric deficit"
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - mediterranean: "Add more Greek yogurt, fish, poultry, and eggs to Mediterranean meals. Extremely natural combination — Mediterranean + high-protein is a popular and effective stack."
    - low-carb: "High-protein + low-carb is a classic and synergistic combination. Both emphasize protein and reduce processed carbs."
    - paleo: "Paleo is naturally high-protein. Adding explicit protein targets to paleo is seamless."
    - flexitarian: "Flexitarian + high-protein works by adding more eggs, dairy, tofu, and legumes. Lean meat on non-vegetarian days."
    - volumetrics: "Both emphasize satiety — high-protein foods are also high-satiety foods. Good overlap."

  adaptable_match:
    - keto: "Keto is moderate-protein (1.2-1.5 g/kg). High-protein keto (up to 2.0 g/kg) is possible but may reduce ketone levels. Monitor ketosis if strict keto is the goal."
    - vegan: "Achievable with tofu, tempeh, seitan, legumes, and plant protein powder. Needs 10-20% more total protein than animal-based due to lower bioavailability. Include soy and pea protein."
    - vegetarian: "Easier than vegan — eggs and dairy provide convenient high-quality protein. Greek yogurt, cottage cheese, eggs are staples."
    - dash: "Compatible — DASH emphasizes lean protein and low sodium. High-protein DASH is an excellent combination for metabolic health."
    - mind: "Compatible — add protein-rich Mediterranean components (fish, Greek yogurt) to MIND framework."
    - intermittent-fasting: "Excellent combination. High-protein within the eating window preserves lean mass during fasting. Each meal in the window needs higher protein (30-50g) to compensate for fewer meals."

  moderate_conflict:
    - mcdougall: "McDougall is very low-protein (starch-based, ~10% protein). Opposite philosophy. Suggest separate meals or a compromise."
    - pritikin: "Pritikin is low-protein and very low-fat (~10% fat, ~15% protein). High-protein Pritikin is possible but challenging."
    - hclf-811: "80/10/10 raw vegan is 10% protein by design. Fundamentally incompatible with high-protein. Suggest separate meals."
    - carnivore: "Carnivore is ALL animal protein — technically very high-protein, but lacks fiber and plant nutrients. Suggest adding vegetables to the carnivore partner's plate."

  hard_conflict:
    - none: "High-protein is adaptable with almost all dietary patterns. The main incompatibilities are with extremely low-protein philosophies (McDougall, Pritikin, 80/10/10)."
```

---

## Ingredient Classifier Reference

```yaml
classifier_mappings:
  # Lean animal proteins
  "chicken breast": "chicken-breast"
  "chicken thigh (skinless)": "chicken-breast"
  "turkey breast": "turkey-breast"
  "ground turkey (93/7)": "lean-ground-meat"
  "sirloin steak": "lean-beef"
  "flank steak": "lean-beef"
  "tenderloin (beef)": "lean-beef"
  "pork tenderloin": "pork-tenderloin"
  "ground beef (93/7)": "lean-ground-meat"

  # Fish & seafood
  "salmon": "fish-fatty"
  "mackerel": "fish-fatty"
  "sardines": "fish-fatty"
  "tuna": "fish-lean"
  "cod": "fish-lean"
  "halibut": "fish-lean"
  "tilapia": "fish-lean"
  "shrimp": "seafood"
  "mussels": "seafood"

  # Eggs
  "whole eggs": "whole-eggs"
  "egg whites": "egg-whites"
  "liquid egg whites": "egg-whites"

  # Dairy
  "greek yogurt": "greek-yogurt"
  "cottage cheese": "cottage-cheese"
  "ricotta": "ricotta"
  "string cheese": "string-cheese"
  "skim milk": "milk-skim"

  # Legumes
  "lentils": "lentils"
  "chickpeas": "chickpeas"
  "black beans": "black-beans"
  "edamame": "edamame"

  # Soy & plant protein
  "tofu": "tofu"
  "tempeh": "tempeh"
  "seitan": "seitan"
  "textured vegetable protein": "tvp"

  # Nuts, seeds, grains
  "pumpkin seeds": "pumpkin-seeds"
  "hemp seeds": "hemp-seeds"
  "chia seeds": "chia-seeds"
  "peanut butter": "peanut-butter"
  "almonds": "almonds"
  "quinoa": "quinoa"

  # Protein supplements
  "whey protein": "whey-protein"
  "whey isolate": "whey-protein"
  "casein protein": "casein-protein"
  "pea protein": "pea-protein"
  "plant protein blend": "plant-protein-blend"
  "soy protein": "soy-protein"

  # Processed meats (RESTRICTED)
  "bacon": "processed-meat"
  "sausage": "processed-meat"
  "hot dogs": "processed-meat"
  "deli meat": "processed-meat"
  "pepperoni": "processed-meat"

  # Higher-fat cuts (MODERATE)
  "ribeye": "high-fat-red-meat"
  "t-bone": "high-fat-red-meat"
  "brisket": "high-fat-red-meat"
  "pork belly": "high-fat-red-meat"
```

---

## Protein Tracking & Goal Configuration

```yaml
# How high-protein targets are configured per user

user_profile_high_protein:
  protein_target_mode:
    type: "enum"
    values: ["g_per_kg", "percent_calories", "absolute_g"]
    default: "g_per_kg"

  protein_g_per_kg:
    type: "float"
    range: [1.2, 3.0]
    default: 1.8
    description: "Grams of protein per kg of body weight per day"

  protein_pct_calories:
    type: "float"
    range: [20, 40]
    default: 30
    description: "Percentage of total calories from protein"

  protein_absolute_g:
    type: "integer"
    range: [80, 250]
    default: null
    description: "Absolute daily protein target in grams (overrides g_per_kg if set)"

  protein_per_meal_g:
    type: "integer"
    range: [20, 50]
    default: 30
    description: "Target protein per main meal for distribution"

  meals_per_day:
    type: "integer"
    range: [3, 5]
    default: 4
    description: "Number of meals/snacks for protein distribution"

  protein_goal:
    type: "enum"
    values: ["weight_loss", "muscle_building", "athletic_endurance", "athletic_strength", "aggressive_cut", "sarcopenia_prevention", "general_health"]
    default: "general_health"
    description: "Determines protein target recommendations"
```

---

## Implementation Checklist

- [ ] Add `high-protein` to the `DietKey` union type
- [ ] Add High-Protein definition to `DIETS` record in `diets.ts`
- [ ] Add protein target calculation logic (g_per_kg, percent_calories, absolute_g modes)
- [ ] Add per-meal protein distribution validation (each meal should hit target)
- [ ] Add protein tracking UI (daily total, per-meal breakdown, weekly average)
- [ ] Add High-Protein to the categorized diet picker in `ProfilesTab.tsx`
- [ ] Inject High-Protein AI prompt instructions in `buildPrompt()`
- [ ] Add protein-focused food-group rules to `assertMealCompliesWithDiet()`
- [ ] Add protein-source classifier for safety guard (distinguish lean vs. processed vs. high-fat)
- [ ] Add protein goal selector (weight loss, muscle building, athletic, sarcopenia, general)
- [ ] Add protein per-meal minimum enforcement in meal generation
- [ ] Add fiber minimum check (25-35g) alongside protein targets
- [ ] Add processed-meat exclusion rule
- [ ] Update seed data with a high-protein test user
- [ ] Add couple compatibility rules for high-protein + other diets
- [ ] Add protein supplement integration (whey, casein, plant) as valid meal components
- [ ] Add "protein pacing" feature (alerts if meals are unevenly distributed)
- [ ] Add kidney health screening question for users selecting very high protein (>2.5 g/kg)

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
