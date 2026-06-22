# Macrobiotic Diet — App Encoding Spec

> Machine-readable specification for integrating the macrobiotic diet into Cupla's AI meal generation system. This file is designed for direct implementation by developers.

---

## Diet Metadata

```yaml
diet_key: "macrobiotic"
display_label: "Macrobiotic"
category: "plant-based"
emoji: "🍚"
short_description: "Whole grain-centered, yin-yang balanced — brown rice, miso, seasonal vegetables & sea vegetables"
evidence_grade: "C-D"
restrictiveness: 4  # 1-5 scale
sodium_restriction: "moderate"  # miso/tamari contribute sodium; not explicitly low
```

---

## Food Group Rules

### Allowed Food Groups (Core Ingredients)

```yaml
allowed_food_groups:
  # Whole grains — THE FOUNDATION (40-60% by volume)
  - "brown-rice"             # short-grain (primary), medium-grain, long-grain
  - "barley"                 # pearl, hulled
  - "millet"                 # whole grain
  - "oats"                   # steel-cut, rolled
  - "buckwheat"              # groats, soba noodles (100% buckwheat)
  - "quinoa"                 # all colors
  - "wheat-berries"          # whole wheat, cracked wheat, bulgur, farro
  - "corn-whole"             # cornmeal (polenta), fresh corn
  - "rye"                    # whole rye, rye berries
  - "sweet-rice"             # glutinous brown rice (mochi)

  # Vegetables (20-30% by volume) — seasonal & local preferred
  - "leafy-greens"           # kale, bok choy, napa cabbage, watercress, turnip greens
  - "root-vegetables"        # carrots, daikon, burdock root, turnips, parsnips
  - "alliums"                # onions, leeks, scallions, shallots (no garlic in strict version)
  - "cruciferous"            # cabbage, broccoli, cauliflower, Brussels sprouts
  - "winter-squash"          # pumpkin, butternut, acorn, kabocha
  - "green-vegetables"       # green beans, snow peas, broccoli
  - "mushrooms"              # shiitake, maitake, oyster, enoki
  - "sea-vegetables"         # nori, wakame, kombu, arame, dulse (NOT hijiki — arsenic risk)

  # Beans & bean products (5-10% by volume)
  - "adzuki-beans"           # the most macrobiotically favored bean
  - "chickpeas"              # garbanzo beans
  - "lentils"                # brown, green, red
  - "black-beans"            # macrobiotic
  - "tofu"                   # firm, soft
  - "tempeh"                 # fermented soybean cake
  - "natto"                  # fermented soybeans (high vitamin K2)

  # Soups (5-10%, 1-2 bowls daily)
  - "miso-soup"              # daily — miso paste + wakame + vegetables
  - "vegetable-soup"         # clear broth with vegetables, grains, beans
  - "grain-soup"             # congee-style rice porridge, barley soup

  # Condiments & pickles (daily, small amounts)
  - "gomashio"               # roasted sesame salt
  - "umeboshi"               # pickled Japanese apricot
  - "tekka"                  # root vegetable condiment
  - "tamari"                 # natural soy sauce (fermented)
  - "pickled-vegetables"     # lacto-fermented (sauerkraut-style)
  - "brown-rice-vinegar"     # natural vinegar
  - "miso-paste"             # for soups, sauces, dressings

  # Occasional foods
  - "temperate-fruits"       # apples, pears, berries, cherries, peaches, plums (2-4x/week)
  - "nuts-roasted"           # sesame, pumpkin, sunflower seeds, almonds, walnuts (roasted, small amounts)
  - "natural-sweeteners"     # rice syrup, barley malt, amasake, maple syrup (occasional)
  - "white-fish"             # halibut, flounder, cod, sea bass (relaxed versions only, 2-3x/week)

  # Beverages
  - "bancha-tea"             # kukicha (roasted twig tea) — primary beverage
  - "water"                  # spring or filtered
  - "grain-coffee"           # caffeine-free substitute
  - "herbal-teas"            # dandelion, mu tea, green tea (moderate)
```

### Restricted Food Groups (Avoid)

```yaml
restricted_food_groups:
  # Refined & processed
  - "refined-sugar"          # white sugar, brown sugar, high-fructose corn syrup
  - "refined-grains"         # white rice, white flour, regular pasta
  - "processed-foods"        # additives, preservatives, artificial ingredients
  - "fast-food"              # AVOID
  - "ultra-processed-food"   # AVOID

  # Beverages
  - "coffee"                 # considered extreme yin; caffeine
  - "alcohol"                # considered extreme yin
  - "sugary-drinks"          # soda, juice with added sugar

  # Animal products (strict version)
  - "red-meat"               # beef, pork, lamb — AVOID
  - "poultry"                # chicken, turkey — AVOID
  - "eggs"                   # AVOID
  - "dairy-all"              # milk, cheese, yogurt, butter — AVOID

  # Nightshade vegetables (strict version — NO SCIENTIFIC BASIS)
  - "potatoes"               # AVOID in strict macrobiotic
  - "tomatoes"               # AVOID in strict macrobiotic
  - "eggplant"               # AVOID in strict macrobiotic
  - "peppers"                # bell peppers, chili peppers — AVOID in strict macrobiotic

  # Tropical fruits (strict version — not local for temperate climates)
  - "tropical-fruit"         # bananas, mangoes, papayas, pineapple — AVOID in strict version
  - "citrus"                 # oranges, grapefruit — limit in strict version

  # Strong spices (considered too stimulating)
  - "hot-spices"             # chili powder, cayenne, black pepper

  # Other
  - "nightshades-all"        # all nightshade vegetables in strict version
  - "tropical-foods"         # any food from tropical climates (strict version)
```

### Limited Food Groups (Moderate Amounts)

```yaml
moderate_food_groups:
  - "sesame-oil": "small amounts for cooking and flavoring"
  - "olive-oil": "small amounts in moderate versions"
  - "sea-salt": "moderate amounts in cooking (miso/tamari already contribute sodium)"
  - "garlic": "avoided in strict version; occasional in moderate version"
  - "white-fish": "2-3 servings/week in relaxed/modified versions only"
  - "temperate-fruits": "2-4 servings/week"
  - "nuts-seeds": "small amounts, roasted, a few times/week"
  - "natural-sweeteners": "occasional — rice syrup, barley malt, amasake"
  - "baked-goods": "moderate amounts of whole grain bread, crackers, cookies"
```

---

## Macronutrient Targets

```yaml
macro_targets:
  carbs_pct: [55, 65]        # 55-65% of calories — primarily from whole grains
  protein_pct: [12, 18]      # 12-18% of calories — from grains, beans, soy, occasional fish
  fat_pct: [15, 25]          # 15-25% of calories — from whole plant foods + small amounts of oil
  saturated_fat_pct: [0, 5]  # <5% of calories — very low from whole plant foods
  fiber_g: [30, 50]          # 30-50g/day — very high from whole grains, vegetables, beans
  sodium_mg: [1500, 3500]    # variable — depends on miso/tamari/umeboshi amounts; can be high
```

---

## AI Prompt Instructions

```
MACROBIOTIC DIET RULES — Follow strictly:

1. WHOLE GRAINS ARE THE FOUNDATION: Every meal MUST feature a substantial portion of whole grain (40-60% of the meal by volume). Brown rice (especially short-grain) should be the primary grain. Other grains (barley, millet, oats, buckwheat, quinoa) can be rotated for variety. Do NOT use refined grains (white rice, white flour).

2. MISO SOUP DAILY: Include miso soup (miso paste + wakame seaweed + vegetables) at least once per day, ideally at breakfast. Add miso at the end of cooking (do NOT boil miso — it destroys beneficial enzymes).

3. VEGETABLES: Include vegetables with every meal (20-30% by volume). Prioritize seasonal, local vegetables: leafy greens (kale, bok choy), root vegetables (carrots, daikon, burdock), cruciferous (cabbage, broccoli), and winter squash.

4. BEANS AND SOY FOODS: Include beans or soy foods daily (5-10% by volume). Adzuki beans are the most macrobiotically favored. Tofu, tempeh, and natto are excellent protein sources.

5. SEA VEGETABLES: Include small amounts of sea vegetables daily (nori, wakame, kombu, arame, dulse). Do NOT use hijiki (arsenic risk). Add kombu to beans during cooking to improve digestibility.

6. CONDIMENTS: Include traditional macrobiotic condiments — gomashio (sesame salt), umeboshi plum, tekka — in small amounts. Include pickled/fermented vegetables daily.

7. COOKING METHODS: Use pressure cooking for grains and beans, steaming for vegetables, and slow-simmering (nishime) for root vegetables. Use gas flame preferred over electric. Do NOT use microwave ovens.

8. SEASONAL AWARENESS: Adjust food choices by season — lighter cooking and more cooling vegetables in summer; heartier, warmer dishes and root vegetables in winter.

9. NIGHTSHADE RESTRICTION (strict version): In the strict macrobiotic version, AVOID potatoes, tomatoes, eggplant, and bell peppers. NOTE: This restriction has no scientific basis and may be relaxed in modern versions.

10. NO REFINED SUGAR: Do NOT use refined sugar. If sweetening is needed, use rice syrup, barley malt, or amasake (natural grain sweeteners).

11. BEVERAGES: Primary beverage is bancha/kukicha tea (roasted twig tea) or water. Do NOT include coffee or alcohol.

12. ANIMAL PRODUCTS: In the strict version, include NO animal products. In relaxed/modified versions, small amounts of fresh white fish (halibut, cod, flounder) may be included 2-3 times per week. Do NOT include red meat, poultry, eggs, or dairy.

13. FLAVOR BALANCE: Season with tamari (natural soy sauce), miso, umeboshi, rice vinegar, and ginger. Avoid hot spices (cayenne, chili) and excessive salt.

14. CHEWING & MINDFULNESS: Include a reminder about thorough chewing (50+ times per bite) and mindful eating in meal descriptions.
```

---

## Meal Structure Rules

```yaml
meal_structure:
  breakfast:
    typical: "Cooked whole grain (brown rice, oats, or millet) with miso soup, steamed greens, and condiments (gomashio or umeboshi)"
    must_include: ["whole grain", "miso soup (or vegetable soup)"]
    optional: ["steamed greens", "pickled vegetables", "bancha tea"]
    avoid: ["coffee", "dairy", "eggs", "refined sugar", "pastries", "cold cereals"]

  lunch:
    typical: "Brown rice or mixed grain bowl with bean dish, steamed or nishime vegetables, and pickled vegetables"
    must_include: ["whole grain (primary component)", "vegetables", "beans or tofu"]
    optional: ["miso soup", "pickled vegetables", "sea vegetable side", "gomashio"]
    avoid: ["refined grains", "red meat", "dairy", "processed foods"]

  dinner:
    typical: "Whole grain with tofu/tempeh, steamed vegetables, and soup. Lighter than lunch."
    must_include: ["whole grain", "vegetables"]
    protein_preference: "beans, lentils, tofu, or tempeh; occasionally white fish (relaxed version)"
    optional: ["vegetable soup", "sea vegetables", "pickled vegetables"]
    avoid: ["heavy meals", "red meat", "dairy", "nightshades (strict version)", "alcohol"]

  snacks:
    typical: "Roasted seeds, seasonal fruit, rice cakes with miso-tahini, mochi (pounded sweet rice)"
    avoid: ["processed snacks", "tropical fruit (strict)", "nuts in excess", "sugary snacks"]
```

---

## Couple Compatibility Notes

```yaml
couple_compatibility:
  easy_match:
    - vegan
    - vegetarian
    - wfpb
    - mediterranean

  adaptable_match:
    - mcdougall: "Both grain-centered and plant-based. Share the brown rice + vegetable + bean base. McDougall partner skips miso (sodium) and sea vegetables; macrobiotic partner can add miso and sea vegetables"
    - flexitarian: "Share the whole grain + vegetable base; flexitarian partner adds fish, eggs, or lean meat to their portion"
    - pescatarian: "Very compatible — both include fish (in relaxed macrobiotic). Share whole grain, vegetable, and fish meals"
    - dash: "Share the whole grain + vegetable + bean base; DASH partner adds lean protein and healthy fats. NOTE: macrobiotic can be high-sodium from miso — may need sodium adjustment for DASH partner"
    - ornish: "Similar in being low-fat and plant-based. Share the grain + vegetable base. Ornish is more explicitly low-fat; macrobiotic partner can add small amounts of sesame oil"
    - mind: "Both emphasize whole grains and vegetables. MIND partner adds berries and nuts (which macrobiotic limits)"

  hard_conflict:
    - keto: "OPPOSITE — macrobiotic is high-carb/grain-based; keto is very low-carb. No shared meal structure possible. Must cook completely separate meals"
    - carnivore: "OPPOSITE IN EVERY WAY — carnivore is all animal products, zero plants. No shared foods whatsoever"
    - paleo: "Major conflict — Paleo excludes all grains, beans, and legumes (the core of macrobiotic). Suggest separate meals"
    - atkins: "Opposite carbohydrate philosophy. No shared meal structure"
    - hclf-811: "Not a conflict in philosophy, but 80/10/10 is raw-food focused while macrobiotic emphasizes cooked foods. Different in execution"
```

---

## Ingredient Classifier Reference

Key macrobiotic ingredients and their food group classification for the safety guard:

```yaml
classifier_mappings:
  # Whole grains (THE FOUNDATION)
  "brown rice": "brown-rice"
  "short grain brown rice": "brown-rice"
  "medium grain brown rice": "brown-rice"
  "long grain brown rice": "brown-rice"
  "barley": "barley"
  "millet": "millet"
  "steel-cut oats": "oats"
  "buckwheat": "buckwheat"
  "soba noodles": "buckwheat"
  "quinoa": "quinoa"
  "wheat berries": "wheat-berries"
  "bulgur": "wheat-berries"
  "farro": "wheat-berries"
  "cornmeal": "corn-whole"
  "polenta": "corn-whole"
  "rye berries": "rye"
  "sweet rice": "sweet-rice"
  "mochi": "sweet-rice"

  # Vegetables
  "kale": "leafy-greens"
  "bok choy": "leafy-greens"
  "napa cabbage": "leafy-greens"
  "watercress": "leafy-greens"
  "daikon": "root-vegetables"
  "burdock root": "root-vegetables"
  "carrots": "root-vegetables"
  "turnips": "root-vegetables"
  "parsnips": "root-vegetables"
  "onions": "alliums"
  "leeks": "alliums"
  "scallions": "alliums"
  "cabbage": "cruciferous"
  "broccoli": "cruciferous"
  "cauliflower": "cruciferous"
  "pumpkin": "winter-squash"
  "butternut squash": "winter-squash"
  "shiitake mushrooms": "mushrooms"
  "maitake mushrooms": "mushrooms"

  # Sea vegetables
  "nori": "sea-vegetables"
  "wakame": "sea-vegetables"
  "kombu": "sea-vegetables"
  "kelp": "sea-vegetables"
  "arame": "sea-vegetables"
  "dulse": "sea-vegetables"
  "hijiki": "sea-vegetables"  # FLAG: arsenic risk — should warn/restrict

  # Beans & soy
  "adzuki beans": "adzuki-beans"
  "chickpeas": "chickpeas"
  "lentils": "lentils"
  "black beans": "black-beans"
  "tofu": "tofu"
  "tempeh": "tempeh"
  "natto": "natto"

  # Soups & condiments
  "miso": "miso-paste"
  "miso soup": "miso-soup"
  "gomashio": "gomashio"
  "umeboshi": "umeboshi"
  "tekka": "tekka"
  "tamari": "tamari"
  "shoyu": "tamari"
  "brown rice vinegar": "brown-rice-vinegar"

  # Occasional foods
  "apple": "temperate-fruits"
  "pear": "temperate-fruits"
  "berries": "temperate-fruits"
  "sesame seeds": "nuts-roasted"
  "pumpkin seeds": "nuts-roasted"
  "rice syrup": "natural-sweeteners"
  "barley malt": "natural-sweeteners"
  "amasake": "natural-sweeteners"
  "halibut": "white-fish"
  "cod": "white-fish"
  "flounder": "white-fish"

  # Beverages
  "bancha tea": "bancha-tea"
  "kukicha tea": "bancha-tea"
  "grain coffee": "grain-coffee"

  # RESTRICTED — must flag (strict version)
  "white rice": "refined-grains"
  "white flour": "refined-grains"
  "white sugar": "refined-sugar"
  "coffee": "coffee"
  "wine": "alcohol"
  "beer": "alcohol"
  "beef": "red-meat"
  "chicken": "poultry"
  "eggs": "eggs"
  "milk": "dairy-all"
  "cheese": "dairy-all"
  "potatoes": "potatoes"            # restricted in strict version
  "tomatoes": "tomatoes"            # restricted in strict version
  "eggplant": "nightshades-all"     # restricted in strict version
  "bell peppers": "nightshades-all" # restricted in strict version
  "banana": "tropical-fruit"        # restricted in strict version
  "mango": "tropical-fruit"         # restricted in strict version
```

---

## Implementation Checklist

- [ ] Add `macrobiotic` to the `DietKey` union type
- [ ] Add Macrobiotic definition to `DIETS` record in `diets.ts`
- [ ] Add Macrobiotic to the categorized diet picker (under "Plant-Based") in `ProfilesTab.tsx`
- [ ] Inject Macrobiotic AI prompt instructions in `buildPrompt()`
- [ ] Add Macrobiotic food-group rules to `assertMealCompliesWithDiet()` — enforce whole-grain foundation, miso soup requirement
- [ ] Add classifier mappings for macrobiotic-specific ingredients (brown rice, sea vegetables, miso, umeboshi, gomashio, natto, daikon, burdock, etc.)
- [ ] Implement strict vs. relaxed mode toggle (strict: no nightshades, no tropical fruit, no fish; relaxed: occasional white fish, more variety)
- [ ] Add hijiki safety warning (arsenic) — flag any recipe containing hijiki
- [ ] Add sodium monitoring — miso, tamari, umeboshi, gomashio all contribute significant sodium
- [ ] Ensure miso soup appears at least once per day in meal plans
- [ ] Ensure brown rice or whole grain is the primary component of lunch and dinner
- [ ] Add B12/vitamin D/iron/calcium supplementation reminder in diet onboarding flow
- [ ] Add special warning for children and pregnant women regarding nutritional adequacy
- [ ] Update seed data with a Macrobiotic diet test user
- [ ] Add couple compatibility rules for Macrobiotic + other diets (hard conflict with keto, carnivore, paleo, atkins)

---

*Back to: [01_Overview.md](./01_Overview.md) | [Diet Research Home](../../00_README.md)*
