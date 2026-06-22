# MIND Diet — App Encoding Spec

> Machine-readable specification for integrating the MIND diet into Cupla's AI meal generation system. This file is designed for direct implementation by developers.

---

## Diet Metadata

```yaml
diet_key: "mind"
display_label: "MIND"
category: "balanced"
emoji: "🧠"
short_description: "Mediterranean-DASH hybrid optimized for brain health and cognition"
evidence_grade: "B"
restrictiveness: 2  # 1-5 scale
sodium_restriction: "moderate"
```

---

## Food Group Rules

### Allowed Food Groups (10 Brain-Healthy Groups — Core Ingredients)

```yaml
allowed_food_groups:
  # 1. Green Leafy Vegetables (≥6 servings/week, ideally 1+/day)
  - "leafy-greens"          # spinach, kale, collard greens, chard, arugula, romaine, watercress

  # 2. Other Vegetables (≥1 serving/day)
  - "tomatoes"              # all forms
  - "alliums"               # onion, garlic, leeks
  - "cruciferous"           # broccoli, cauliflower, cabbage, Brussels sprouts
  - "peppers"               # bell peppers, chili peppers
  - "root-vegetables"       # carrots, beets, sweet potatoes
  - "other-vegetables"      # eggplant, zucchini, cucumber, green beans, asparagus, mushrooms
  - "cucurbit-vegetables"   # squash, pumpkin

  # 3. Nuts (≥5 servings/week)
  - "nuts"                  # walnuts (highest ALA omega-3), almonds (highest vitamin E), pistachios, pecans, hazelnuts
  - "nut-butters"           # natural, no salt/sugar added
  - "seeds"                 # flaxseeds, chia seeds, pumpkin seeds, sunflower seeds

  # 4. Berries (≥2 servings/week) — MIND-SPECIFIC
  - "berries"               # blueberries, strawberries, blackberries, raspberries, cranberries, goji, acai
  - "berries-frozen"        # frozen berries (equally nutritious)

  # 5. Beans and Legumes (≥3 meals/week)
  - "legumes"               # lentils, chickpeas, black beans, kidney beans, navy beans, split peas
  - "soy-beans"             # edamame, tofu (low-sodium)

  # 6. Whole Grains (≥3 servings/day)
  - "whole-grains"          # 100% whole wheat bread, brown rice, wild rice, oats, quinoa, barley, bulgur, farro
  - "whole-grain-pasta"     # whole wheat pasta
  - "whole-grain-cereal"    # high-fiber, low-sugar
  - "popcorn"               # air-popped (whole grain)

  # 7. Fish (≥1 meal/week, aim for 2+)
  - "fish-fatty"            # salmon, mackerel, sardines, herring, anchovies (highest DHA/EPA)
  - "fish-lean"             # trout, tuna, cod, halibut

  # 8. Poultry (≥2 meals/week)
  - "poultry-skinless"      # skinless chicken breast, turkey breast
  - "poultry"               # chicken thigh (skinless), ground turkey (lean)

  # 9. Olive Oil (primary cooking oil)
  - "olive-oil"             # extra virgin preferred (highest polyphenols/oleocanthal)

  # 10. Wine (optional, 1 glass/day)
  - "wine"                  # red wine preferred (highest resveratrol), 1 glass/day with meals

  # Neutral foods (not scored but acceptable)
  - "eggs"                  # neutral in MIND
  - "low-fat-dairy"         # milk, plain yogurt (neutral, not emphasized like DASH)
  - "coffee"                # unsweetened (emerging evidence supports brain benefit)
  - "tea"                   # green tea, herbal tea (emerging evidence for cognition)

  # Flavoring
  - "herbs"                 # basil, oregano, rosemary, thyme, sage, parsley, dill, mint
  - "spices"                # turmeric, cinnamon, cumin, ginger, black pepper, paprika
  - "lemon-lime"
  - "vinegar"               # balsamic, apple cider, rice vinegar
  - "garlic"

  # Beverages
  - "water"
  - "sparkling-water"
```

### Restricted Food Groups (5 Brain-Harmful Groups to Limit)

```yaml
restricted_food_groups:
  # 1. Red Meat (<4 servings/week)
  - "red-meat"              # beef, pork, lamb — limit to <4 meals/week (optimal: 1-2/week, small portions)
  
  # 2. Butter and Stick Margarine (<1 tbsp/day)
  - "butter"                # <1 tbsp/day (ideally minimize; replace with olive oil)
  - "stick-margarine"       # AVOID (trans fat content)
  
  # 3. Cheese (<1 serving/week)
  - "cheese"                # all cheeses — limit to <1 serving/week (stricter than Mediterranean)
  
  # 4. Pastries and Sweets (<5 servings/week)
  - "pastries"              # cookies, cakes, donuts, pastries — limit to <5 servings/week
  - "refined-sugar"         # candy, chocolate (non-dark), sugary cereals — minimize
  - "ice-cream"             # small amounts occasionally
  - "sugary-drinks"         # soda, juice drinks — AVOID
  
  # 5. Fried Food and Fast Food (<1 meal/week)
  - "fried-food"            # french fries, fried chicken, fried anything — limit to <1/week
  - "fast-food"             # fast food meals — limit to <1/week
  - "ultra-processed-food"  # AVOID

  # Additional restrictions (not scored but aligned with brain health)
  - "processed-meat"        # sausages, bacon, deli meats — AVOID (nitrates, sodium, saturated fat)
  - "refined-grains"        # white bread, white rice — prefer whole grains
  - "trans-fat"             # AVOID entirely
```

### Moderate Food Groups

```yaml
moderate_food_groups:
  - "red-meat": "<4 meals/week, small portions (3 oz). Optimal: ≤1-2/week."
  - "butter": "<1 tbsp/day (ideally replace with olive oil entirely)"
  - "cheese": "<1 serving/week (stricter than Mediterranean)"
  - "pastries-sweets": "<5 servings/week — default dessert is berries or fruit"
  - "fried-fast-food": "<1 meal/week (ideally avoid entirely)"
  - "wine": "1 glass/day (optional — non-drinkers should not start)"
  - "eggs": "neutral in MIND (not restricted like in some diets); moderate consumption is fine"
  - "non-berry-fruit": "neutral — can be eaten but don't earn MIND points"
  - "low-fat-dairy": "neutral — yogurt and milk acceptable but not specifically emphasized"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  carbs_pct: [45, 55]          # ~45-55% of calories
  protein_pct: [15, 20]        # ~15-20% of calories
  fat_pct: [28, 35]            # ~30-35% of calories (primarily from olive oil and nuts)
  saturated_fat_pct: [0, 10]   # <10% (ideally <7%)
  fiber_g: [25, 35]            # 25-35g/day
  sodium_mg: [0, 2300]         # <2300mg/day (inherited from DASH)
  added_sugar_g: [0, 25]       # <25g/day (minimize sweets/pastries)
```

---

## AI Prompt Instructions

```
MIND DIET RULES — Follow strictly:

1. LEAFY GREENS: Include at least 1 serving of green leafy vegetables in at least one meal every day (spinach, kale, collard greens, arugula, Swiss chard, romaine). This is the #1 MIND priority.

2. BERRIES: Include berries (blueberries, strawberries, blackberries, raspberries) at least 2-3 times per week. Blueberries and strawberries have the strongest cognitive evidence. Frozen berries are acceptable.

3. OLIVE OIL: Use extra virgin olive oil as the PRIMARY (ideally ONLY) cooking fat. Do NOT use butter, margarine, or vegetable oils as the main cooking fat. Olive oil should be used for dressings, sautéing, roasting, and finishing.

4. FISH: Include fish at least 1-2 times per week. Prioritize fatty fish rich in DHA/EPA (salmon, sardines, mackerel, trout). This provides essential omega-3 for brain structure.

5. NUTS: Include a handful of nuts (especially walnuts and almonds) at least 5 times per week — ideally daily. Walnuts provide omega-3 ALA; almonds provide vitamin E.

6. WHOLE GRAINS: Use only whole grains (100% whole wheat bread, brown rice, oats, quinoa, barley, farro). Aim for 3+ servings/day. Avoid refined grains.

7. BEANS/LEGUMES: Include legumes (lentils, chickpeas, beans) in at least 3 meals per week. They provide stable blood sugar and B vitamins for brain energy.

8. POULTRY: Include skinless chicken or turkey at least 2 times per week as a lean protein source.

9. VEGETABLES: Include at least 1 serving of non-leafy vegetables per day in addition to leafy greens (broccoli, tomatoes, carrots, peppers, Brussels sprouts, etc.).

10. RED MEAT: Limit to <4 meals per week. Optimal: 1-2 small portions per week. Never feature red meat in consecutive meals.

11. CHEESE: Limit to <1 serving per week. This is stricter than the Mediterranean diet — do NOT include cheese daily.

12. BUTTER/MARGARINE: Avoid as cooking fat. Replace with olive oil entirely.

13. FRIED/FAST FOOD: Do NOT include fried foods or fast food in meal plans.

14. PASTRIES/SWEETS: Do NOT feature pastries, cookies, or sugary desserts. Default dessert is berries or fresh fruit.

15. WINE: May include 1 glass of red wine with dinner (optional — do not add to breakfast or lunch. Non-drinkers should not be encouraged to start).

16. BRAIN FOOD PRIORITY ORDER: Leafy greens > Berries > Olive oil > Fish > Nuts > Whole grains > Beans > Poultry
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    typical: "Oatmeal with blueberries and walnuts; OR green smoothie with spinach and berries; OR whole grain toast with olive oil and tomato"
    must_include: ["whole grain", "brain food (berries OR leafy greens OR nuts)"]
    preferred_brain_foods: ["blueberries", "walnuts", "oats", "spinach"]
    avoid: ["pastries", "sugary cereals", "butter on toast"]

  lunch:
    typical: "Large leafy green salad with vegetables, legumes or fish, olive oil dressing"
    must_include: ["leafy greens (spinach, kale, arugula, mixed greens)", "olive oil", "vegetables"]
    protein_preference: "fish, poultry, or legumes"
    preferred_brain_foods: ["spinach", "kale", "chickpeas", "walnuts", "olive oil"]
    avoid: ["cheese (limit to <1/week)", "deli meats", "fried foods"]

  dinner:
    typical: "Fish or poultry with roasted vegetables and whole grain; olive oil-based cooking"
    must_include: ["vegetables", "lean protein", "olive oil"]
    protein_preference: "fish (especially fatty fish 1-2x/week), skinless poultry"
    wine: "optional 1 glass red wine"
    preferred_brain_foods: ["salmon", "sardines", "kale", "broccoli", "olive oil"]
    avoid: ["red meat (unless occasional)", "fried foods", "butter"]

  snacks:
    typical: "Handful of walnuts or almonds; fresh berries; hummus with vegetables; air-popped popcorn"
    preferred_brain_foods: ["walnuts", "almonds", "blueberries", "strawberries"]
    avoid: ["chips", "candy", "pastries", "fried snacks", "processed snacks"]

  dessert:
    typical: "Fresh berries (blueberries, strawberries, raspberries)"
    alternative: "Small piece of dark chocolate (70%+), fruit"
    avoid: ["pastries", "ice cream (frequent)", "cookies", "candy"]
```

---

## MIND Score Tracking (Weekly)

```yaml
mind_score_tracker:
  # Brain-Healthy Components (1 point each for meeting target)
  healthy_components:
    leafy_greens:
      target: 6  # servings/week
      point_threshold: 6
      current: null  # tracked weekly
    
    other_vegetables:
      target: 7  # servings/week (1+/day)
      point_threshold: 7
    
    berries:
      target: 2  # servings/week
      point_threshold: 2
    
    nuts:
      target: 5  # servings/week
      point_threshold: 5
    
    olive_oil:
      target: "primary cooking oil"
      point_threshold: "primary"
    
    whole_grains:
      target: 21  # servings/week (3+/day)
      point_threshold: 21
    
    fish:
      target: 1  # meal/week
      point_threshold: 1
    
    beans:
      target: 3  # meals/week
      point_threshold: 3
    
    poultry:
      target: 2  # meals/week
      point_threshold: 2
    
    wine:
      target: 7  # glasses/week (1/day)
      point_threshold: 7
      optional: true
  
  # Brain-Harmful Components (1 point each for staying under limit)
  harmful_components:
    red_meat:
      max: 4  # servings/week
      point_threshold: 4
    
    butter_margarine:
      max: 7  # tbsp/week (<1/day)
      point_threshold: 7
    
    cheese:
      max: 1  # serving/week
      point_threshold: 1
    
    pastries_sweets:
      max: 5  # servings/week
      point_threshold: 5
    
    fried_fast_food:
      max: 1  # meal/week
      point_threshold: 1
  
  total_max: 15
  high_adherence: 8.5  # → ~53% AD risk reduction
  moderate_adherence: 6.5  # → ~35% AD risk reduction
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - mediterranean
    - dash
    - flexitarian
    - volumetrics
    - high-protein

  adaptable_match:
    - vegan: "Replace fish/poultry with beans, nuts, and algae-based omega-3 (DHA) supplement. Replace wine with grape juice or skip. Base MIND is very plant-forward already."
    - vegetarian: "Same base meal; add fish/poultry only for non-vegetarian partner. Easy adaptation."
    - pescatarian: "Nearly identical — MIND already emphasizes fish. Remove poultry, add more fish."
    - keto: "Focus on leafy greens + fish + nuts + olive oil components. Replace whole grains and beans with extra non-starchy vegetables. Berries are keto-compatible in moderation."
    - paleo: "Focus on fish + leafy greens + nuts + berries + olive oil. Skip whole grains and legumes for paleo partner. Can include red meat (MIND allows <4/week)."
    - low-fodmap: "Adapt — reduce garlic/onion (use garlic-infused olive oil), choose low-FODMAP vegetables, moderate legumes, choose low-FODMAP nuts (walnuts OK in small amounts)."

  hard_conflict:
    - carnivore: "Very difficult — MIND is plant-forward with daily vegetables and weekly legumes. Suggest separate meals with shared fish/poultry protein."
    - mcdougall: "Partial overlap (both emphasize whole grains and beans) but MIND includes nuts, olive oil, fish, and wine which McDougall restricts."
    - pritikin: "Partial overlap (both plant-forward, low saturated fat) but Pritikin is very low fat (<10%) while MIND emphasizes olive oil and nuts."
```

---

## Ingredient Classifier Reference

Key MIND ingredients and their food group classification for the safety guard:

```yaml
classifier_mappings:
  # MIND-Priority Brain Foods (HIGH PRIORITY — earn MIND points)
  
  # Leafy Greens
  "spinach": "leafy-greens"
  "kale": "leafy-greens"
  "collard greens": "leafy-greens"
  "swiss chard": "leafy-greens"
  "arugula": "leafy-greens"
  "romaine lettuce": "leafy-greens"
  "mixed greens": "leafy-greens"
  "watercress": "leafy-greens"
  "mustard greens": "leafy-greens"
  "beet greens": "leafy-greens"
  "bok choy": "leafy-greens"

  # Berries (MIND-SPECIFIC — not "fruit" generally)
  "blueberries": "berries"
  "strawberries": "berries"
  "blackberries": "berries"
  "raspberries": "berries"
  "cranberries": "berries"
  "goji berries": "berries"
  "acai": "berries"
  "frozen blueberries": "berries-frozen"
  "frozen strawberries": "berries-frozen"

  # Olive Oil (primary fat)
  "extra virgin olive oil": "olive-oil"
  "olive oil": "olive-oil"

  # Fish
  "salmon": "fish-fatty"
  "sardines": "fish-fatty"
  "mackerel": "fish-fatty"
  "herring": "fish-fatty"
  "anchovies": "fish-fatty"
  "trout": "fish-fatty"
  "tuna": "fish-fatty"
  "cod": "fish-lean"
  "halibut": "fish-lean"

  # Nuts
  "walnuts": "nuts"
  "almonds": "nuts"
  "pistachios": "nuts"
  "pecans": "nuts"
  "hazelnuts": "nuts"
  "mixed nuts": "nuts"
  "peanut butter": "nut-butters"
  "flaxseeds": "seeds"
  "chia seeds": "seeds"

  # Legumes
  "lentils": "legumes"
  "chickpeas": "legumes"
  "black beans": "legumes"
  "kidney beans": "legumes"
  "navy beans": "legumes"
  "split peas": "legumes"
  "edamame": "soy-beans"
  "tofu": "soy-beans"

  # Whole Grains
  "brown rice": "whole-grains"
  "wild rice": "whole-grains"
  "oats": "whole-grains"
  "steel-cut oats": "whole-grains"
  "quinoa": "whole-grains"
  "barley": "whole-grains"
  "farro": "whole-grains"
  "bulgur": "whole-grains"
  "100% whole wheat bread": "whole-grains"
  "whole wheat pasta": "whole-grain-pasta"

  # Poultry
  "chicken breast": "poultry-skinless"
  "turkey breast": "poultry-skinless"
  "ground turkey": "poultry"

  # RESTRICTED Foods (trigger warnings)
  "beef": "red-meat"
  "steak": "red-meat"
  "pork": "red-meat"
  "lamb": "red-meat"
  "bacon": "processed-meat"
  "sausage": "processed-meat"
  "ham": "processed-meat"
  "deli meat": "processed-meat"
  "butter": "butter"
  "margarine": "stick-margarine"
  "cheddar cheese": "cheese"
  "mozzarella": "cheese"
  "parmesan": "cheese"
  "feta": "cheese"
  "cream cheese": "cheese"
  "cookies": "pastries"
  "cake": "pastries"
  "donuts": "pastries"
  "pastries": "pastries"
  "ice cream": "ice-cream"
  "french fries": "fried-food"
  "fried chicken": "fried-food"

  # Neutral Foods (no MIND penalty, no MIND points)
  "banana": "non-berry-fruit"
  "apple": "non-berry-fruit"
  "orange": "non-berry-fruit"
  "grapes": "non-berry-fruit"
  "eggs": "eggs"
  "milk": "low-fat-dairy"
  "greek yogurt": "low-fat-dairy"
  "coffee": "coffee"
  "green tea": "tea"

  # Flavoring
  "lemon juice": "lemon-lime"
  "balsamic vinegar": "vinegar"
  "garlic": "garlic"
```

---

## Implementation Checklist

- [ ] Add `mind` to the `DietKey` union type
- [ ] Add MIND definition to `DIETS` record in `diets.ts`
- [ ] Add MIND to the categorized diet picker in `ProfilesTab.tsx`
- [ ] Inject MIND AI prompt instructions in `buildPrompt()`
- [ ] Add MIND food-group rules to `assertMealCompliesWithDiet()`
- [ ] Add **berry classifier** — distinguish berries from general fruit
- [ ] Add **leafy greens classifier** — distinguish leafy greens from general vegetables
- [ ] Add **olive oil enforcement** — flag meals using non-olive-oil primary cooking fat
- [ ] Add **cheese frequency tracker** — warn if cheese appears >1 serving/week
- [ ] Add **red meat frequency tracker** — warn if red meat appears >4 meals/week
- [ ] Add **MIND score calculator** — track 15-point weekly score
- [ ] Add classifier mappings for MIND-specific ingredients
- [ ] Update seed data with a MIND diet test user
- [ ] Add couple compatibility rules for MIND + other diets
- [ ] Add **brain food priority ordering** in meal generation (leafy greens > berries > fish > nuts)

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
