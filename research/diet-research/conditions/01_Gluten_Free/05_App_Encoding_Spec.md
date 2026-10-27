# Gluten-Free Diet — App Encoding Spec

> Machine-readable spec for the CookTwo health-condition layer. Used when a partner selects the **Gluten-Free** condition (coeliac-safe standard). Parsed by `scripts/seed-diet-catalog.mjs`.

---

## Diet Metadata

```yaml
diet_key: "gluten-free"
display_label: "Gluten-Free"
category: "condition"
emoji: "🌾"
short_description: "Strict gluten-free for coeliac disease and gluten sensitivity — no wheat, barley or rye"
evidence_grade: "A"
restrictiveness: 4  # 1-5 scale
is_condition: "true"
sodium_restriction: "none"
```

---

## Food Group Rules

### Allowed Food Groups (Core Ingredients)

```yaml
allowed_food_groups:
  # Naturally gluten-free whole foods
  - "vegetables"
  - "leafy-greens"
  - "fruit"
  - "legumes"
  - "potatoes"
  - "rice"
  - "corn"
  - "quinoa"
  - "buckwheat"
  - "millet"
  - "sorghum"
  - "teff"
  - "amaranth"
  - "certified-gf-oats"
  - "meat"
  - "poultry"
  - "fish"
  - "seafood"
  - "eggs"
  - "plain-dairy"
  - "nuts"
  - "seeds"
  - "olive-oil"
  - "herbs-spices"
  - "gluten-free-flours"
  - "tamari"
  - "gluten-free-pasta"
  - "gluten-free-bread"
  - "vinegar-not-malt"
```

### Restricted Food Groups (Always Excluded)

```yaml
restricted_food_groups:
  - "wheat"
  - "barley"
  - "rye"
  - "triticale"
  - "gluten-containing-grains"
  - "wheat-flour"
  - "malt"
  - "seitan"
  - "regular-soy-sauce"
  - "regular-pasta"
  - "regular-bread"
  - "breadcrumbs"
  - "couscous"
  - "bulgur"
  - "semolina"
  - "durum"
  - "spelt"
  - "kamut"
  - "farro"
  - "beer"
  - "wheat-based-bouillon"
  - "processed-meat-with-fillers"
  - "battered-fried-foods"
  - "wheat-based-snacks"
```

### Limited Food Groups (Moderation)

```yaml
limited_food_groups:
  - "gluten-free-substitutes: use sparingly — often refined and low in fibre"
  - "certified-gf-oats: up to 50-70g/day if tolerated"
  - "plain-dairy: check additives and shared equipment"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  gluten_ppm_max: 0
  fiber_g_day_min: 25
  protein_g_meal_min: 20
```

---

## AI Prompt Instructions

```
GLUTEN-FREE DIET RULES — COELIAC-SAFE STANDARD. Follow strictly:

1. NO GLUTEN, EVER. This is a medical diet, not a preference. Even small amounts can harm someone with coeliac disease.
2. FORBIDDEN GRAINS AND DERIVATIVES:
   - Wheat in every form: flour, whole wheat, wholemeal, durum, semolina, spelt, kamut, farro, emmer, einkorn, bulgur, couscous, orzo, graham, wheat starch, wheat germ, wheat bran.
   - Barley, rye, triticale.
   - Malt, malt extract, malt syrup, malt vinegar, brewer's yeast.
3. FORBIDDEN INGREDIENTS AND PRODUCTS:
   - Regular soy sauce, teriyaki, hoisin, oyster sauce (unless explicitly gluten-free).
   - Regular bread, pasta, noodles, couscous, breadcrumbs, panko, batter, pastry, pizza, crackers, pretzels.
   - Beer, ale, lager (unless labelled gluten-free).
   - Seitan and any wheat protein.
   - Sausages, meatballs, deli meats, pate and processed meats containing rusk or fillers.
   - Bouillon cubes, stock powder, gravy granules and soup bases (unless gluten-free).
   - Battered or breaded foods, including shared fryer items.
4. SAFE STAPLES TO BUILD MEALS AROUND:
   - Rice, corn, quinoa, buckwheat, millet, sorghum, teff, amaranth, potatoes, sweet potatoes.
   - Fresh vegetables and fruit, legumes, plain tofu, eggs, fresh meat, poultry, fish, seafood.
   - Plain dairy, olive oil, nuts, seeds, herbs, spices, citrus, vinegar except malt vinegar.
   - Certified gluten-free oats only. Never regular oats.
   - Use tamari or gluten-free soy sauce instead of regular soy sauce.
   - Thicken with cornstarch, arrowroot, rice flour or chickpea flour — never wheat flour.
5. CROSS-CONTACT: Do not suggest recipes that rely on shared toasters, fryers, colanders, pasta water or flour dusting. Do not suggest "just remove the bread" — crumbs and sauces contaminate the dish.
6. LABEL AWARENESS: "Wheat-free" is not gluten-free. Avoid any ingredient that may contain wheat, barley, rye or malt.
7. NUTRITION: Build meals from naturally gluten-free whole foods, not refined GF substitutes. Include fibre-rich vegetables, legumes and whole GF grains; include iron-rich foods with vitamin C; include calcium sources.
8. This app provides general dietary guidance, not medical advice. The user should follow their clinician's and dietitian's instructions.
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    base: "certified GF oats, eggs, plain yogurt, fruit, rice cakes"
    avoid: "regular bread, cereal, granola unless certified GF"
  lunch:
    base: "rice/quinoa bowl, corn tortillas, salad with oil and vinegar"
    avoid: "regular wraps, pasta salad, couscous"
  dinner:
    base: "fish/chicken/legumes with rice or potatoes and vegetables"
    avoid: "breaded fish, pasta, regular soy sauce"
  snacks:
    base: "fruit, nuts, plain yogurt, hummus with vegetable sticks"
    avoid: "crackers, pretzels, biscuits unless certified GF"
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - mediterranean
    - dash
    - mind
    - plant-based
    - vegan
    - vegetarian
    - pescatarian
    - flexitarian
    - volumetrics
    - high-protein
    - low-sodium
    - diabetes-friendly
    - bone-health

  adaptable_match:
    - keto: "Rice/potatoes can be swapped for extra vegetables; keep the shared protein and fat sources gluten-free"
    - paleo: "Almost fully compatible — paleo already excludes grains; confirm no wheat-based condiments"
    - low-fodmap: "Use GF grains and low-FODMAP vegetables; watch garlic/onion content"
    - intermittent-fasting: "Timing pattern is orthogonal — follow the GF rules inside the eating window"
    - whole30: "Whole30 is naturally GF if no wheat-based additives are used"
    - macrobiotic: "Use rice, millet and buckwheat; avoid wheat-based soy sauce"
    - hclf-811: "Fruit and vegetables are naturally GF; ensure no wheat-based supplements"
    - mcdougall: "Rice and potatoes are GF; avoid wheat-based bread and pasta"

  hard_conflict:
    - carnivore: "No shared carbohydrate base, but all meat/fish is GF — meals can still be shared"
```

---

## Ingredient Classifier Reference

```yaml
classifier_mappings:
  # Wheat and wheat derivatives
  "wheat": "wheat"
  "whole wheat": "wheat"
  "wholemeal": "wheat"
  "wheat flour": "wheat-flour"
  "all purpose flour": "wheat-flour"
  "white flour": "wheat-flour"
  "bread flour": "wheat-flour"
  "cake flour": "wheat-flour"
  "self raising flour": "wheat-flour"
  "wheat germ": "wheat"
  "wheat bran": "wheat"
  "vital wheat gluten": "wheat"
  "durum": "durum"
  "semolina": "semolina"
  "spelt": "spelt"
  "kamut": "kamut"
  "farro": "farro"
  "emmer": "wheat"
  "einkorn": "wheat"
  "bulgur": "bulgur"
  "couscous": "couscous"
  "orzo": "regular-pasta"

  # Barley, rye, triticale and malt
  "barley": "barley"
  "rye": "rye"
  "rye bread": "rye"
  "triticale": "triticale"
  "malt": "malt"
  "malt extract": "malt"
  "malt syrup": "malt"
  "malt vinegar": "malt"
  "brewers yeast": "malt"
  "beer": "beer"
  "ale": "beer"
  "lager": "beer"

  # Bread, pasta and coatings
  "bread": "regular-bread"
  "baguette": "regular-bread"
  "bagel": "regular-bread"
  "croissant": "regular-bread"
  "pita": "regular-bread"
  "naan": "regular-bread"
  "flour tortilla": "regular-bread"
  "breadcrumbs": "breadcrumbs"
  "bread crumbs": "breadcrumbs"
  "panko": "breadcrumbs"
  "pasta": "regular-pasta"
  "spaghetti": "regular-pasta"
  "macaroni": "regular-pasta"
  "lasagna": "regular-pasta"
  "noodles": "regular-pasta"
  "ramen": "regular-pasta"
  "udon": "regular-pasta"
  "egg noodles": "regular-pasta"
  "wonton wrapper": "regular-pasta"
  "dumpling wrapper": "regular-pasta"
  "batter": "battered-fried-foods"
  "tempura": "battered-fried-foods"
  "breaded": "battered-fried-foods"

  # Hidden gluten
  "soy sauce": "regular-soy-sauce"
  "teriyaki": "regular-soy-sauce"
  "hoisin": "regular-soy-sauce"
  "oyster sauce": "regular-soy-sauce"
  "seitan": "seitan"
  "bouillon": "wheat-based-bouillon"
  "stock cube": "wheat-based-bouillon"
  "gravy": "wheat-based-bouillon"
  "sausage": "processed-meat-with-fillers"
  "meatball": "processed-meat-with-fillers"
  "deli meat": "processed-meat-with-fillers"
  "imitation crab": "processed-meat-with-fillers"
  "surimi": "processed-meat-with-fillers"
  "cracker": "wheat-based-snacks"
  "pretzel": "wheat-based-snacks"
  "biscuit": "wheat-based-snacks"
  "cookie": "wheat-based-snacks"
  "cake": "wheat-based-snacks"
  "pastry": "wheat-based-snacks"
  "pie crust": "wheat-based-snacks"
  "pizza": "wheat-based-snacks"

  # Safe classifications (explicitly not restricted)
  "rice": "rice"
  "corn": "corn"
  "quinoa": "quinoa"
  "buckwheat": "buckwheat"
  "millet": "millet"
  "sorghum": "sorghum"
  "teff": "teff"
  "amaranth": "amaranth"
  "certified gluten free oats": "certified-gf-oats"
  "gluten free oats": "certified-gf-oats"
  "tamari": "tamari"
  "gluten free soy sauce": "tamari"
  "rice flour": "gluten-free-flours"
  "almond flour": "gluten-free-flours"
  "chickpea flour": "gluten-free-flours"
  "cornmeal": "gluten-free-flours"
  "cornstarch": "gluten-free-flours"
  "potato": "potatoes"
  "sweet potato": "potatoes"
  "lentils": "legumes"
  "chickpeas": "legumes"
  "black beans": "legumes"
```

---

## Implementation Checklist

- [x] Add `gluten-free` to `diet_catalog` with `is_condition = 1`
- [x] Add to `partner_conditions` stackable layer
- [x] Merge classifier terms into the hard diet guard
- [x] Show in ProfilesTab / Onboarding condition picker
- [x] Serve articles in the DietBrowser
- [x] Migrate legacy `partners.diet = 'gluten-free'` users to the condition layer

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
