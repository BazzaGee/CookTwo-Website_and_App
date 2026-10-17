// Auto-generated from app/worker/migrations/0010_diet_catalog_seed.sql — do not edit by hand.
// 22 diets: key, label, category, description, evidence grade, restrictiveness,
// food groups, and couple-compatibility maps (easy / adaptable / hard conflict).

export interface DietEntry {
  dietKey: string;
  displayLabel: string;
  category: string;
  emoji: string;
  shortDesc: string;
  evidenceGrade: string;
  restrictiveness: number;
  isTimingPattern: boolean;
  isDefault: boolean;
  allowedGroups: string[];
  restrictedGroups: string[];
  easyMatches: string[];
  adaptableMatches: Record<string, string>;
  hardConflicts: Record<string, string>;
}

export const DIET_CATEGORIES: Record<string, string> = {
  balanced: 'Balanced',
  lowCarb: 'Low-Carb',
  plantBased: 'Plant-Based',
  macronutrient: 'Macronutrient-Focused',
  therapeutic: 'Therapeutic / Medical',
  lifestyle: 'Lifestyle',
  elimination: 'Elimination',
  timing: 'Timing Pattern',
};

export const DIETS: DietEntry[] = [
  {
    dietKey: "mediterranean",
    displayLabel: "Mediterranean",
    category: "balanced",
    emoji: "🫒",
    shortDesc: "Olive oil, fish, whole grains — the gold-standard for longevity",
    evidenceGrade: "A",
    restrictiveness: 2,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["leafy-greens","tomatoes","alliums","cruciferous","peppers","root-vegetables","nightshades","cucurbit-vegetables","artichokes","berries","citrus","stone-fruit","grapes","pome-fruit","melons","whole-grains","pasta-whole-grain","olive-oil","olives","fish-fatty","fish-lean","seafood","poultry","eggs","legumes","nuts","seeds","yogurt","cheese","ricotta-mozzarella","herbs","spices","lemon-lime","garlic","water","coffee","tea","red-wine"],
    restrictedGroups: ["red-meat","processed-meat","refined-grains","refined-sugar","sugary-drinks","fast-food","ultra-processed-food","butter","margarine","industrial-sauces"],
    easyMatches: ["dash","mind","flexitarian","volumetrics","high-protein"],
    adaptableMatches: {
      "vegan": "Make the meal plant-based (Mediterranean is already plant-forward); add fish/poultry only for the non-vegan partners plate",
      "vegetarian": "Same base meal; fish/poultry as a side option",
      "pescatarian": "Nearly identical — Mediterranean already emphasizes fish",
      "keto": "Focus on the fish + vegetables + olive oil components; skip grains/legumes for keto partner",
      "paleo": "Focus on fish + vegetables + nuts + olive oil; skip grains/dairy/legumes for paleo partner",
      "low-fodmap": "Adapt the recipe — reduce garlic/onion (use garlic-infused oil), choose low-FODMAP vegetables, moderate legumes"
    },
    hardConflicts: {
      "carnivore": "Very difficult — Mediterranean is plant-forward; suggest separate meals with a shared protein (e.g., grilled fish/steak) and the carnivore partner skips the plant components",
      "mcdougall": "Opposite fat philosophy (McDougall is very low fat); suggest separate meals",
      "pritikin": "Opposite fat philosophy (Pritikin is <10% fat); suggest separate meals",
      "hclf-811": "Opposite philosophy (raw, high-carb, low-fat); suggest separate meals"
    },
  },
  {
    dietKey: "dash",
    displayLabel: "DASH",
    category: "therapeutic",
    emoji: "❤️",
    shortDesc: "NIH-designed diet to lower blood pressure — high potassium, low sodium",
    evidenceGrade: "A",
    restrictiveness: 2,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["leafy-greens","tomatoes","alliums","cruciferous","peppers","root-vegetables","squash-eggplant","green-beans-peas","cucumbers","citrus","berries","bananas","pome-fruit","stone-fruit","melons","grapes-cherries","dried-fruit","low-fat-milk","low-fat-yogurt","low-fat-cheese","low-fat-cottage-cheese","whole-grains","whole-grain-pasta","whole-grain-cereal","whole-grain-crackers","poultry-skinless","fish-fatty","fish-lean","eggs","legumes","tofu","nuts-unsalted","seeds-unsalted","nut-butters","olive-oil","canola-oil","soft-margarine","avocado","light-mayonnaise","herbs","spices","lemon-lime","vinegar","garlic","no-salt-blends","water","sparkling-water","coffee","tea"],
    restrictedGroups: ["high-sodium-foods","processed-meat","salt","soy-sauce","red-meat","full-fat-dairy","fried-food","salty-snacks","refined-grains","sugary-drinks","refined-sugar","fast-food","ultra-processed-food","pickled-foods","bouillon-broth"],
    easyMatches: ["mediterranean","mind","flexitarian","volumetrics","high-protein","plant-based"],
    adaptableMatches: {
      "vegan": "Make meals plant-based; use fortified plant milk for dairy component; ensure adequate calcium/potassium from vegetables",
      "vegetarian": "Same base meal; add lean poultry/fish only for non-vegetarian partner",
      "pescatarian": "Nearly identical — DASH already emphasizes fish",
      "keto": "Focus on the fish + vegetables + olive oil components; replace grains with extra non-starchy vegetables for keto partner; may conflict with DASHs high-carb whole grains",
      "paleo": "Focus on lean meat/poultry/fish + vegetables + nuts; skip grains and dairy for paleo partner",
      "low-fodmap": "Adapt — reduce garlic/onion (use garlic-infused oil), choose low-FODMAP vegetables, moderate legumes"
    },
    hardConflicts: {
      "carnivore": "Very difficult — DASH is plant-forward with specific produce/dairy targets; suggest separate meals with shared lean protein",
      "mcdougall": "Partial overlap (both high-carb, plant-forward) but DASH includes dairy and lean meat which McDougall restricts",
      "pritikin": "Broadly compatible (both low-fat, low-sodium) — Pritikin is even more restrictive; easy adaptation"
    },
  },
  {
    dietKey: "intermittent-fasting",
    displayLabel: "Intermittent Fasting",
    category: "timing",
    emoji: "⏰",
    shortDesc: "Eat within a timed window — 16:8, 5:2, OMAD and more",
    evidenceGrade: "B",
    restrictiveness: 3,
    isTimingPattern: true,
    isDefault: false,
    allowedGroups: [],
    restrictedGroups: [],
    easyMatches: [],
    adaptableMatches: {},
    hardConflicts: {},
  },
  {
    dietKey: "keto",
    displayLabel: "Keto / Low-Carb",
    category: "lowCarb",
    emoji: "🥩",
    shortDesc: "Very low carb, high fat — metabolic ketosis for fat-burning and blood sugar control",
    evidenceGrade: "B",
    restrictiveness: 4,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["olive-oil","avocado-oil","butter","ghee","coconut-oil","mct-oil","animal-fats","mayonnaise","red-meat","fatty-meat","poultry","bacon","sausage","organ-meats","deli-meat","fish-fatty","fish-lean","seafood","eggs","leafy-greens","cruciferous","zucchini-squash","asparagus","green-beans","cucumber","celery","mushrooms","peppers","tomatoes","avocado","olives","cheese","heavy-cream","sour-cream","cream-cheese","greek-yogurt-full-fat","butter","macadamia-nuts","pecans","walnuts","brazil-nuts","almonds","chia-seeds","flaxseeds","hemp-hearts","pumpkin-seeds","raspberries","blackberries","strawberries","herbs","spices","lemon-lime","vinegar","mustard","hot-sauce","soy-sauce","salt","stevia","erythritol","monk-fruit","allulose","xylitol","water","sparkling-water","coffee","tea","bone-broth","dry-wine","spirits"],
    restrictedGroups: ["all-grains","bread","pasta","cereal","flour","potatoes","sweet-potatoes","yams","corn","winter-squash","cassava","tropical-fruit","tree-fruit","citrus-fruit","grapes","dried-fruit","legumes","peas","sugar","honey","maple-syrup","agave","coconut-sugar","sugary-drinks","beer","sweet-wine","cocktails","ultra-processed-food","low-fat-products","ketchup","barbecue-sauce"],
    easyMatches: ["carnivore","paleo","whole30"],
    adaptableMatches: {
      "mediterranean": "Build a shared protein (fish/chicken/steak) + vegetable base; keto partner adds extra fat and skips grains/legumes; Mediterranean partner adds whole grains/legumes",
      "high-protein": "Very similar — both emphasize protein; keto adds more fat, high-protein adds more carbs as needed",
      "dash": "Shared vegetables + lean protein base; keto partner adds fats and skips grains; DASH partner adds grains and limits saturated fat",
      "flexitarian": "Shared vegetable-forward base; keto partner adds meat/fat; flexitarian partner adds grains/legumes",
      "volumetrics": "Shared vegetable volume; keto partner adds fat; volumetrics partner adds low-calorie carbs",
      "vegan": "Very difficult but possible with shared low-carb vegetable base; vegan partner adds tofu/tempeh + olive oil + avocado; keto partner adds meat. Almost no shared protein.",
      "vegetarian": "Shared eggs/cheese base; keto partner adds meat; vegetarian partner adds low-carb plant proteins"
    },
    hardConflicts: {
      "mcdougall": "Directly opposite philosophies — McDougall is 70-80% carb, keto is 70-80% fat. Suggest separate meals.",
      "pritikin": "Opposite fat philosophy — Pritikin is <10% fat. Suggest separate meals.",
      "hclf-811": "Opposite philosophy — 80% carb, 10% fat raw. Suggest separate meals.",
      "ornish": "Opposite fat philosophy — Ornish is <10% fat, very low saturated fat. Suggest separate meals."
    },
  },
  {
    dietKey: "high-protein",
    displayLabel: "High-Protein",
    category: "macronutrient-focused",
    emoji: "💪",
    shortDesc: "Prioritize protein for satiety, muscle, and body composition",
    evidenceGrade: "B",
    restrictiveness: 2,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["chicken-breast","turkey-breast","lean-beef","pork-tenderloin","lean-ground-meat","fish-fatty","fish-lean","seafood","whole-eggs","egg-whites","greek-yogurt","cottage-cheese","milk-skim","ricotta","string-cheese","lentils","chickpeas","black-beans","edamame","split-peas","tofu","tempeh","seitan","tvp","pumpkin-seeds","hemp-seeds","chia-seeds","peanut-butter","almonds","quinoa","whey-protein","casein-protein","plant-protein-blend","pea-protein","soy-protein","protein-bars","leafy-greens","cruciferous","peppers","asparagus","mushrooms","alliums","tomatoes","root-vegetables","berries","citrus","apples","bananas","stone-fruit","whole-grains","whole-grain-bread","olive-oil","avocado","nuts","herbs","spices","lemon-lime","garlic","water","coffee","tea"],
    restrictedGroups: ["processed-meat","fried-protein","high-fat-red-meat","ultra-processed-food","sugary-drinks","refined-sugar","refined-grains","full-fat-cheese-large","high-sugar-protein-bars"],
    easyMatches: [],
    adaptableMatches: {
      "mediterranean": "Add more Greek yogurt, fish, poultry, and eggs to Mediterranean meals. Extremely natural combination — Mediterranean + high-protein is a popular and effective stack.",
      "low-carb": "High-protein + low-carb is a classic and synergistic combination. Both emphasize protein and reduce processed carbs.",
      "paleo": "Paleo is naturally high-protein. Adding explicit protein targets to paleo is seamless.",
      "flexitarian": "Flexitarian + high-protein works by adding more eggs, dairy, tofu, and legumes. Lean meat on non-vegetarian days.",
      "volumetrics": "Both emphasize satiety — high-protein foods are also high-satiety foods. Good overlap.",
      "keto": "Keto is moderate-protein (1.2-1.5 g/kg). High-protein keto (up to 2.0 g/kg) is possible but may reduce ketone levels. Monitor ketosis if strict keto is the goal.",
      "vegan": "Achievable with tofu, tempeh, seitan, legumes, and plant protein powder. Needs 10-20% more total protein than animal-based due to lower bioavailability. Include soy and pea protein.",
      "vegetarian": "Easier than vegan — eggs and dairy provide convenient high-quality protein. Greek yogurt, cottage cheese, eggs are staples.",
      "dash": "Compatible — DASH emphasizes lean protein and low sodium. High-protein DASH is an excellent combination for metabolic health.",
      "mind": "Compatible — add protein-rich Mediterranean components (fish, Greek yogurt) to MIND framework.",
      "intermittent-fasting": "Excellent combination. High-protein within the eating window preserves lean mass during fasting. Each meal in the window needs higher protein (30-50g) to compensate for fewer meals.",
      "mcdougall": "McDougall is very low-protein (starch-based, ~10% protein). Opposite philosophy. Suggest separate meals or a compromise.",
      "pritikin": "Pritikin is low-protein and very low-fat (~10% fat, ~15% protein). High-protein Pritikin is possible but challenging.",
      "hclf-811": "80/10/10 raw vegan is 10% protein by design. Fundamentally incompatible with high-protein. Suggest separate meals.",
      "carnivore": "Carnivore is ALL animal protein — technically very high-protein, but lacks fiber and plant nutrients. Suggest adding vegetables to the carnivore partners plate."
    },
    hardConflicts: {
      "none": "High-protein is adaptable with almost all dietary patterns. The main incompatibilities are with extremely low-protein philosophies (McDougall, Pritikin, 80/10/10)."
    },
  },
  {
    dietKey: "plant-based",
    displayLabel: "Plant-Based / Vegan / Vegetarian",
    category: "plant-based",
    emoji: "🥗",
    shortDesc: "Predominantly plant foods — proven for heart health, diabetes prevention, and longevity",
    evidenceGrade: "B",
    restrictiveness: 3,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["leafy-greens","cruciferous","alliums","tomatoes","peppers","root-vegetables","nightshades","cucurbit-vegetables","starchy-vegetables","mushrooms","sea-vegetables","berries","citrus","tropical-fruit","stone-fruit","pome-fruit","grapes","melons","dried-fruit","whole-grains","pasta-whole-grain","whole-grain-bread","corn","legumes","chickpeas","soy-foods","peas","nuts","seeds","nut-butters","tahini","avocado","olive-oil","coconut","dark-chocolate","plant-milk-soy","plant-milk-pea","plant-milk-oat","plant-milk-almond","plant-milk-coconut","herbs","spices","nutritional-yeast","soy-sauce","miso","lemon-lime","vinegars","garlic","ginger","maple-syrup","molasses","water","coffee","tea"],
    restrictedGroups: ["red-meat","processed-meat","poultry","fish-fatty","fish-lean","seafood","eggs","dairy-milk","yogurt","cheese","butter","honey","gelatin","casein","whey","red-meat","processed-meat","poultry","fish-fatty","fish-lean","seafood","refined-grains","refined-sugar","extracted-oils","ultra-processed-food"],
    easyMatches: ["flexitarian","mediterranean","mind","volumetrics"],
    adaptableMatches: {
      "mediterranean": "The Mediterranean diet is already plant-forward; make base meal plant-based and serve fish/poultry/cheese separately for the Mediterranean partner",
      "pescatarian": "Base meal is plant-based; add fish for the pescatarian partners plate",
      "flexitarian": "Nearly identical — both emphasize plant foods; flexitarian partner adds occasional meat/fish",
      "vegetarian": "If one is vegan and the other lacto-ovo, cook vegan base meal and add eggs/cheese for the vegetarian partner",
      "keto": "Challenging but possible — focus on tofu, tempeh, nuts, seeds, avocado, low-carb vegetables; skip grains/legumes for keto partner",
      "paleo": "Focus on vegetables, nuts, seeds, fruit; skip grains and legumes for paleo partner (use vegetable-based substitutes)",
      "low-fodmap": "Adapt the recipe — reduce garlic/onion (use garlic-infused oil), choose low-FODMAP vegetables, moderate legumes",
      "dash": "Very compatible — both emphasize vegetables, fruits, legumes, whole grains"
    },
    hardConflicts: {
      "carnivore": "Fundamental incompatibility — carnivore is all animal products, vegan is zero animal products. Suggest entirely separate meals",
      "mcdougall": "Both are plant-based, but McDougall is very low fat (<10%) — align by using WFPB no-oil version if both agree",
      "pritikin": "Both plant-friendly, but Pritikin is <10% fat — align by using low-fat WFPB version"
    },
  },
  {
    dietKey: "flexitarian",
    displayLabel: "Flexitarian",
    category: "plant-based",
    emoji: "🌱",
    shortDesc: "Flexible vegetarian — mostly plants with occasional meat and fish",
    evidenceGrade: "B-C",
    restrictiveness: 1,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["leafy-greens","cruciferous","alliums","tomatoes","peppers","root-vegetables","starchy-vegetables","nightshades","cucurbit-vegetables","mushrooms","berries","citrus","tropical-fruit","stone-fruit","pome-fruit","grapes","melons","whole-grains","pasta-whole-grain","whole-grain-bread","corn","legumes","chickpeas","soy-foods","peas","nuts","seeds","nut-butters","tahini","eggs","dairy-milk","yogurt","cheese","cottage-cheese","olive-oil","avocado","nuts","dark-chocolate","fish-fatty","fish-lean","seafood","poultry","herbs","spices","lemon-lime","vinegars","garlic","ginger","nutritional-yeast","soy-sauce","honey","maple-syrup","water","coffee","tea"],
    restrictedGroups: ["processed-meat","red-meat-frequent","refined-grains","refined-sugar","sugary-drinks","fast-food","ultra-processed-food"],
    easyMatches: ["mediterranean","plant-based","vegetarian","vegan","mind","dash","volumetrics","high-protein"],
    adaptableMatches: {
      "keto": "Make the base meal plant-forward (vegetables, eggs, cheese, nuts); add meat for keto partner. Flexitarian partner can eat the same vegetables + legumes/grains",
      "paleo": "Both can share vegetables, nuts, fruit, eggs, fish. Flexitarian partner adds grains/legumes; paleo partner adds more meat",
      "pescatarian": "Nearly identical — share fish and plant-based meals; flexitarian may occasionally add poultry",
      "low-fodmap": "Adapt recipes — reduce garlic/onion, choose low-FODMAP vegetables, moderate legumes"
    },
    hardConflicts: {
      "carnivore": "Fundamental tension — carnivore is all animal products, flexitarian is mostly plants. But its workable since flexitarian allows some meat — suggest shared protein with separate plant sides for the flexitarian partner",
      "mcdougall": "Both are plant-forward, but McDougall is very low fat (<10%) — use oil-free cooking if needed",
      "pritikin": "Both are plant-forward, but Pritikin is <10% fat — use oil-free cooking if needed"
    },
  },
  {
    dietKey: "paleo",
    displayLabel: "Paleo",
    category: "ancestral",
    emoji: "🦴",
    shortDesc: "Eat like a hunter-gatherer — meat, fish, vegetables, nuts; no grains, dairy, or legumes",
    evidenceGrade: "C",
    restrictiveness: 4,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["red-meat","poultry","pork","organ-meats","fish-fatty","fish-lean","seafood","eggs","leafy-greens","cruciferous","alliums","peppers","nightshades","root-vegetables","cucurbit-vegetables","winter-squash","mushrooms","asparagus-green-beans","berries","citrus","stone-fruit","tropical-fruit","pome-fruit","melons","grapes","avocado","sweet-potato","plantains","cassava-taro","nuts","seeds","coconut","olive-oil","avocado-oil","coconut-oil","animal-fats","ghee","herbs","spices","lemon-lime","vinegar","honey","maple-syrup","coconut-sugar","water","sparkling-water","coffee","tea","bone-broth"],
    restrictedGroups: ["all-grains","grain-products","pseudo-cereals","legumes","peanuts","soy","peas","dairy","butter","refined-sugar","refined-grains","seed-oils","margarine","processed-food","processed-meat","fast-food","white-potatoes","added-salt","soda","juice"],
    easyMatches: ["whole30","keto","high-protein","low-carb"],
    adaptableMatches: {
      "mediterranean": "Share the fish, vegetables, olive oil, and nuts components; add whole grains and dairy for the Mediterranean partner",
      "flexitarian": "Share the vegetable-forward base; Paleo partner adds more meat, flexitarian adds grains/legumes",
      "volumetrics": "Both emphasize vegetables and whole foods; add grains for volumetrics partner",
      "vegan": "Very challenging but possible — build around vegetables, fruits, nuts, seeds, avocado; vegan adds legumes/grains, paleo adds meat/fish",
      "vegetarian": "Similar to vegan; paleo partner adds meat/fish, vegetarian adds dairy/legumes/grains"
    },
    hardConflicts: {
      "mcdougall": "Opposite philosophy — McDougall is starch-centric (potatoes, rice, grains) and very low fat; Paleo eliminates most McDouall staples",
      "pritikin": "Opposite fat philosophy (Pritikin is <10% fat, plant-based); Paleo is 35-45% fat",
      "hclf-811": "Opposite macronutrient profile — raw, high-carb, low-fat; Paleo is moderate-carb, high-protein, high-fat",
      "vegetarian-indian": "Traditional Indian vegetarian cuisine relies heavily on grains (rice, wheat), legumes (dal, chickpeas), and dairy (paneer, ghee) — all excluded on Paleo"
    },
  },
  {
    dietKey: "whole30",
    displayLabel: "Whole30",
    category: "ancestral",
    emoji: "🚫",
    shortDesc: "30-day elimination reset — identify food sensitivities and break sugar cravings",
    evidenceGrade: "C-D",
    restrictiveness: 5,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: [],
    restrictedGroups: [],
    easyMatches: ["paleo"],
    adaptableMatches: {
      "keto": "Very compatible — both eliminate grains, sugar, dairy. Keto allows dairy and focuses on macros; Whole30 allows more carbs from fruit/potatoes",
      "high-protein": "Similar emphasis on protein at every meal",
      "low-carb": "Compatible during elimination phase",
      "mediterranean": "Share the fish, vegetables, olive oil, nuts base; Mediterranean partner adds whole grains, dairy, legumes",
      "flexitarian": "Share the vegetable base; Whole30 partner adds more meat",
      "volumetrics": "Both emphasize vegetables; Whole30 is more restrictive on fats and protein sources"
    },
    hardConflicts: {
      "vegan": "Nearly impossible — Whole30 eliminates all vegan protein sources (legumes, soy, dairy). Cannot be done as a vegan",
      "vegetarian": "Very difficult — eliminates legumes, soy, and dairy. Only protein sources are eggs and nuts",
      "mcdougall": "Opposite philosophy — McDougall is starch/grain-centric and very low fat; Whole30 eliminates all grains",
      "hclf-811": "Opposite — raw, high-carb, high-fruit, low-fat; Whole30 is moderate-carb, high-protein, high-fat with strict food restrictions",
      "vegetarian-indian": "Traditional Indian vegetarian cuisine relies on grains, legumes, and dairy — all eliminated on Whole30"
    },
  },
  {
    dietKey: "low-fodmap",
    displayLabel: "Low FODMAP",
    category: "therapeutic",
    emoji: "🫃",
    shortDesc: "Elimination diet for IBS — removes fermentable carbs that trigger bloating",
    evidenceGrade: "B",
    restrictiveness: 4,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["rice","oats","quinoa","potatoes","corn","gluten-free-grains","rice-noodles","sourdough-spelt","chicken","turkey","beef","pork","lamb","fish-all","seafood","eggs","tofu-firm","tempeh","spinach","zucchini","bell-peppers","carrots","tomatoes","cucumber","green-beans","lettuce","eggplant","kale","bok-choy","pumpkin","bean-sprouts","potatoes","bananas","blueberries","strawberries","oranges","kiwi","mandarins","raspberries","pineapple","cantaloupe","papaya","lemon-lime","lactose-free-milk","lactose-free-yogurt","hard-cheese","feta","butter","lactose-free-cottage-cheese","almonds","walnuts","pecans","macadamia-nuts","peanuts","pine-nuts","pumpkin-seeds","sesame-seeds","chia-seeds","sunflower-seeds","olive-oil","coconut-oil","peanut-butter","garlic-infused-oil","herb-infused-oils","herbs-all","spices-all","spring-onion-green","chives","asafoetida","soy-sauce","maple-syrup","rice-malt-syrup","vinegar-all","mustard-plain","miso-paste","water","coffee","tea-black","tea-green","tea-peppermint","tea-chamomile"],
    restrictedGroups: ["wheat-large-amounts","rye","barley","onion-all","garlic-all","leeks-bulb","asparagus","artichoke-globe","inulin-chicory-root","brussels-sprouts","savoy-cabbage","lentils-large","chickpeas-large","beans-large","soy-milk-whole-bean","pistachios","cashews","cow-milk","regular-yogurt","ice-cream","ricotta","cottage-cheese-regular","soft-cheese-lactose","apples","pears","watermelon","mangoes","honey","agave-nectar","high-fructose-corn-syrup","dried-fruit","cherries-large","apple-juice","pear-juice","avocado-large","mushrooms","cauliflower-large","celery-large","blackberries","stone-fruit-large","apricots","sugar-alcohols"],
    easyMatches: ["gluten-free","dairy-free"],
    adaptableMatches: {
      "mediterranean": "Adapt recipes — use garlic-infused oil instead of garlic, spring onion greens instead of onion, rice/quinoa instead of wheat, limit legumes",
      "paleo": "Good overlap — both emphasize whole foods, meat, fish, vegetables; adapt vegetables (avoid onion, garlic, mushrooms, cauliflower)",
      "whole30": "Similar whole-food approach; swap non-compliant items",
      "high-protein": "Easy — most protein sources are low FODMAP; just avoid onion/garlic seasonings",
      "keto": "Possible — focus on meat, fish, eggs, low-FODMAP vegetables, olive oil; avoid high-FODMAP keto foods (avocado large portions, cauliflower, garlic)"
    },
    hardConflicts: {
      "vegan": "Difficult — most plant protein sources (legumes) are high FODMAP; requires careful tofu/tempeh planning and B12 monitoring",
      "mcdougall": "Opposite philosophy — McDougall emphasizes wheat, potatoes, and starches; wheat is high FODMAP; very difficult to combine",
      "raw-vegan": "Difficult — many raw fruits/vegetables are high FODMAP; limited options",
      "mediterranean": "Manageable but requires significant modification — onion, garlic, wheat, and legumes are Mediterranean staples"
    },
  },
  {
    dietKey: "mind",
    displayLabel: "MIND",
    category: "balanced",
    emoji: "🧠",
    shortDesc: "Mediterranean-DASH hybrid optimized for brain health and cognition",
    evidenceGrade: "B",
    restrictiveness: 2,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["leafy-greens","tomatoes","alliums","cruciferous","peppers","root-vegetables","other-vegetables","cucurbit-vegetables","nuts","nut-butters","seeds","berries","berries-frozen","legumes","soy-beans","whole-grains","whole-grain-pasta","whole-grain-cereal","popcorn","fish-fatty","fish-lean","poultry-skinless","poultry","olive-oil","wine","eggs","low-fat-dairy","coffee","tea","herbs","spices","lemon-lime","vinegar","garlic","water","sparkling-water"],
    restrictedGroups: ["red-meat","butter","stick-margarine","cheese","pastries","refined-sugar","ice-cream","sugary-drinks","fried-food","fast-food","ultra-processed-food","processed-meat","refined-grains","trans-fat"],
    easyMatches: ["mediterranean","dash","flexitarian","volumetrics","high-protein"],
    adaptableMatches: {
      "vegan": "Replace fish/poultry with beans, nuts, and algae-based omega-3 (DHA) supplement. Replace wine with grape juice or skip. Base MIND is very plant-forward already.",
      "vegetarian": "Same base meal; add fish/poultry only for non-vegetarian partner. Easy adaptation.",
      "pescatarian": "Nearly identical — MIND already emphasizes fish. Remove poultry, add more fish.",
      "keto": "Focus on leafy greens + fish + nuts + olive oil components. Replace whole grains and beans with extra non-starchy vegetables. Berries are keto-compatible in moderation.",
      "paleo": "Focus on fish + leafy greens + nuts + berries + olive oil. Skip whole grains and legumes for paleo partner. Can include red meat (MIND allows <4/week).",
      "low-fodmap": "Adapt — reduce garlic/onion (use garlic-infused olive oil), choose low-FODMAP vegetables, moderate legumes, choose low-FODMAP nuts (walnuts OK in small amounts)."
    },
    hardConflicts: {
      "carnivore": "Very difficult — MIND is plant-forward with daily vegetables and weekly legumes. Suggest separate meals with shared fish/poultry protein.",
      "mcdougall": "Partial overlap (both emphasize whole grains and beans) but MIND includes nuts, olive oil, fish, and wine which McDougall restricts.",
      "pritikin": "Partial overlap (both plant-forward, low saturated fat) but Pritikin is very low fat (<10%) while MIND emphasizes olive oil and nuts."
    },
  },
  {
    dietKey: "pritikin",
    displayLabel: "Pritikin",
    category: "therapeutic",
    emoji: "💚",
    shortDesc: "Very low-fat (<10%), high complex carb — designed to reverse heart disease",
    evidenceGrade: "B-C",
    restrictiveness: 5,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["leafy-greens","cruciferous","alliums","peppers","root-vegetables","nightshades","cucurbit-vegetables","winter-squash","tomatoes","asparagus","green-beans","mushrooms","artichokes","celery","fennel","berries","citrus","stone-fruit","tropical","melons","pome-fruit","grapes","dried-fruit-unsweetened","whole-grains","whole-wheat","corn-whole","whole-grain-cereal","legumes","soy-lean","potatoes","winter-squash-starchy","herbs","spices","garlic","onion","lemon-lime","vinegar-all","mustard-no-fat","salsa","tomato-sauce-no-fat","nutritional-yeast","water","coffee","tea","sparkling-water","fruit-juice-100"],
    restrictedGroups: ["all-oils","butter","ghee","margarine","lard-tallow","shortening","mayonnaise","salad-dressing-oil","pesto","nut-butters","nuts","seeds","avocado","coconut","olives","dark-chocolate","red-meat","processed-meat","dark-poultry","organ-meats","duck-goose","whole-eggs","full-fat-dairy","butter-dairy","low-fat-dairy","refined-grains","refined-sugar","sugary-drinks","syrups","fast-food","frozen-meals","snack-foods","baked-goods","ultra-processed-food"],
    easyMatches: ["ornish","esselstyn","mcdougall","vegan"],
    adaptableMatches: {
      "vegetarian": "Pritikin already allows limited animal protein; simply add a dairy/egg option for the vegetarian partners plate if they consume it",
      "dash": "Some overlap — both are high in vegetables/fruits and low in sodium. DASH allows moderate fat; modify to accommodate both",
      "flexitarian": "Flexitarian is more flexible; Pritikin partner removes oils/fats, flexitarian partner adds moderate fat/protein to their plate",
      "whole30": "Difficult — Whole30 requires fat and allows meat; Pritikin eliminates both. Very difficult to find common ground"
    },
    hardConflicts: {
      "keto": "Directly OPPOSITE philosophy — keto is 60-75% fat; Pritikin is <10% fat. Completely incompatible. Suggest completely separate meals.",
      "carnivore": "Directly opposite — carnivore is all animal foods; Pritikin is nearly all plant foods. Completely incompatible.",
      "mediterranean": "Opposite fat philosophy — Mediterranean is 30-40% fat with liberal olive oil; Pritikin is <10% fat. Very difficult; suggest separate meals.",
      "paleo": "Difficult — paleo emphasizes meat, fat, and excludes grains/legumes; Pritikin is opposite. Suggest separate meals.",
      "atkins": "Opposite macronutrient philosophy. Completely incompatible."
    },
  },
  {
    dietKey: "carnivore",
    displayLabel: "Carnivore",
    category: "lowCarb",
    emoji: "🥩",
    shortDesc: "Animal foods only — zero carb, zero plants. Extreme elimination approach.",
    evidenceGrade: "D",
    restrictiveness: 5,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["red-meat","fatty-meat","poultry","pork","bacon","sausage","organ-meats","deli-meat","fish-fatty","fish-lean","seafood","eggs","beef-tallow","lard","duck-fat","butter","ghee","bone-marrow","animal-fats","cheese","cream-cheese","heavy-cream","sour-cream","butter-dairy","bone-broth","salt","water","sparkling-water","bone-broth-beverage"],
    restrictedGroups: ["all-vegetables","leafy-greens","cruciferous","tomatoes","peppers","root-vegetables","onions-garlic","mushrooms","avocado","zucchini-squash","all-fruits","berries","citrus","tropical-fruit","dried-fruit","all-grains","bread","pasta","cereal","all-legumes","all-nuts","all-seeds","olive-oil","coconut-oil","avocado-oil","seed-oils","all-plant-oils","sugar","honey","maple-syrup","stevia","monk-fruit","erythritol","fruit-juice","vegetable-juice","herbal-tea","wine","beer","ultra-processed-food","soy-products","plant-based-meat","plant-extracts"],
    easyMatches: ["keto","paleo"],
    adaptableMatches: {
      "high-protein": "Shared meat/protein focus; carnivore partner eats meat only; high-protein partner adds vegetables/grains",
      "whole30": "Both eliminate processed foods; shared meat base; Whole30 partner adds vegetables, fruit, compliant carbs",
      "mediterranean": "Carnivore is plant-free; Mediterranean is plant-forward. Can share a protein (steak, fish, chicken) but carnivore partner eats only the meat; Mediterranean partner adds vegetables, grains, olive oil, salad. Suggest cooking a shared protein and separate side dishes.",
      "flexitarian": "Carnivore partner eats only animal foods; flexitarian partner eats mostly plants with some meat. Minimal shared base.",
      "volumetrics": "Opposite approaches — volumetrics relies on high-volume plant foods; carnivore is all animal. Suggest separate meals.",
      "dash": "DASH is plant-forward and low-saturated-fat; carnivore is the opposite. Very difficult."
    },
    hardConflicts: {
      "vegan": "MAXIMUM conflict — vegan excludes ALL animal products; carnivore excludes ALL plant products. Zero overlap. Suggest completely separate meals.",
      "vegetarian": "Nearly maximum conflict — only eggs/dairy overlap (if carnivore includes them). Very difficult.",
      "mcdougall": "Maximum conflict — McDougall is 70-80% carbohydrate from starches; carnivore is zero carb. Opposites.",
      "pritikin": "Maximum conflict — Pritikin is <10% fat, plant-forward; carnivore is 70%+ fat, animal-only.",
      "ornish": "Maximum conflict — Ornish is <10% fat, plant-based; carnivore is high-fat, animal-only.",
      "hclf-811": "Maximum conflict — 80% carb, 10% fat, raw plant foods; carnivore is the exact opposite.",
      "mind": "Strong conflict — MIND is plant-forward for brain health; carnivore is plant-free.",
      "anti-inflammatory": "Most anti-inflammatory diets are plant-forward; carnivore contradicts this approach."
    },
  },
  {
    dietKey: "mcdougall",
    displayLabel: "McDougall (Starch Solution)",
    category: "plant-based",
    emoji: "🥔",
    shortDesc: "Starch-centered, very low-fat, strictly plant-based — unlimited potatoes, rice & beans",
    evidenceGrade: "C-D",
    restrictiveness: 4,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["potatoes","sweet-potatoes","rice","beans","lentils","peas","corn","oats","barley","wheat-berries","quinoa","buckwheat","millet","teff","sorghum","winter-squash","whole-grain-pasta","whole-grain-bread","leafy-greens","cruciferous","root-vegetables","alliums","summer-squash","nightshades","green-beans","mushrooms","cucurbit-vegetables","fresh-fruit","dried-fruit","herbs","spices","lemon-lime","vinegars","garlic","nutritional-yeast","soy-sauce-tamari","mustard","hot-sauce","salsa","miso","tofu","edamame","soy-milk"],
    restrictedGroups: ["red-meat","poultry","fish-all","eggs","dairy-all","processed-meat","all-oils","butter","margarine","shortening-lard","refined-grains","refined-sugar","sugary-drinks","fast-food","ultra-processed-food","artificial-sweeteners","vegan-junk-food","alcohol","coffee","fruit-juice"],
    easyMatches: ["ornish","esselstyn","wfpb","vegan","pritikin"],
    adaptableMatches: {
      "vegetarian": "Same base meal (starch + vegetables + beans); the vegetarian partner can add eggs or dairy to their portion",
      "flexitarian": "Same base meal; flexitarian partner adds a small portion of fish or lean meat",
      "mediterranean": "DIFFICULT — opposite fat philosophy. Share the starch + vegetable base; Mediterranean partner adds olive oil, fish, and feta to their plate. Must use separate cooking for oil-based components",
      "dash": "Share the starch + vegetable + bean base; DASH partner adds lean protein and moderate healthy fats. Sodium target is similar",
      "volumetrics": "Very compatible — both emphasize low calorie density and large portions"
    },
    hardConflicts: {
      "keto": "OPPOSITE MACRONUTRIENT PHILOSOPHY — McDougall is 75% carb / 10% fat; keto is 10% carb / 75% fat. Essentially no shared meal possible. Suggest entirely separate meals",
      "carnivore": "OPPOSITE IN EVERY WAY — carnivore is all animal products, zero plants. No shared foods whatsoever. Must cook completely separate meals",
      "paleo": "Major conflict — Paleo excludes grains, beans, and legumes (the core of McDougall). Suggest separate starch/protein components",
      "atkins": "Opposite carbohydrate philosophy. No shared meal structure possible",
      "hclf-811": "Not a conflict per se, but 80/10/10 is raw-food focused while McDougall includes cooked starches. Compatible in philosophy but different in execution"
    },
  },
  {
    dietKey: "macrobiotic",
    displayLabel: "Macrobiotic",
    category: "plant-based",
    emoji: "🍚",
    shortDesc: "Whole grain-centered, yin-yang balanced — brown rice, miso, seasonal vegetables & sea vegetables",
    evidenceGrade: "C-D",
    restrictiveness: 4,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["brown-rice","barley","millet","oats","buckwheat","quinoa","wheat-berries","corn-whole","rye","sweet-rice","leafy-greens","root-vegetables","alliums","cruciferous","winter-squash","green-vegetables","mushrooms","sea-vegetables","adzuki-beans","chickpeas","lentils","black-beans","tofu","tempeh","natto","miso-soup","vegetable-soup","grain-soup","gomashio","umeboshi","tekka","tamari","pickled-vegetables","brown-rice-vinegar","miso-paste","temperate-fruits","nuts-roasted","natural-sweeteners","white-fish","bancha-tea","water","grain-coffee","herbal-teas"],
    restrictedGroups: ["refined-sugar","refined-grains","processed-foods","fast-food","ultra-processed-food","coffee","alcohol","sugary-drinks","red-meat","poultry","eggs","dairy-all","potatoes","tomatoes","eggplant","peppers","tropical-fruit","citrus","hot-spices","nightshades-all","tropical-foods"],
    easyMatches: ["vegan","vegetarian","wfpb","mediterranean"],
    adaptableMatches: {
      "mcdougall": "Both grain-centered and plant-based. Share the brown rice + vegetable + bean base. McDougall partner skips miso (sodium) and sea vegetables; macrobiotic partner can add miso and sea vegetables",
      "flexitarian": "Share the whole grain + vegetable base; flexitarian partner adds fish, eggs, or lean meat to their portion",
      "pescatarian": "Very compatible — both include fish (in relaxed macrobiotic). Share whole grain, vegetable, and fish meals",
      "dash": "Share the whole grain + vegetable + bean base; DASH partner adds lean protein and healthy fats. NOTE: macrobiotic can be high-sodium from miso — may need sodium adjustment for DASH partner",
      "ornish": "Similar in being low-fat and plant-based. Share the grain + vegetable base. Ornish is more explicitly low-fat; macrobiotic partner can add small amounts of sesame oil",
      "mind": "Both emphasize whole grains and vegetables. MIND partner adds berries and nuts (which macrobiotic limits)"
    },
    hardConflicts: {
      "keto": "OPPOSITE — macrobiotic is high-carb/grain-based; keto is very low-carb. No shared meal structure possible. Must cook completely separate meals",
      "carnivore": "OPPOSITE IN EVERY WAY — carnivore is all animal products, zero plants. No shared foods whatsoever",
      "paleo": "Major conflict — Paleo excludes all grains, beans, and legumes (the core of macrobiotic). Suggest separate meals",
      "atkins": "Opposite carbohydrate philosophy. No shared meal structure",
      "hclf-811": "Not a conflict in philosophy, but 80/10/10 is raw-food focused while macrobiotic emphasizes cooked foods. Different in execution"
    },
  },
  {
    dietKey: "volumetrics",
    displayLabel: "Volumetrics",
    category: "balanced",
    emoji: "⚖️",
    shortDesc: "Eat more food, fewer calories — fill up on low energy density foods",
    evidenceGrade: "B-C",
    restrictiveness: 1,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["non-starchy-vegetables","leafy-greens","cruciferous","watery-vegetables","alliums","peppers","mushrooms","broth-based-soups","berries","melons","citrus","stone-fruit","pome-fruit","grapes","whole-grains","pasta-whole-grain","legumes","lean-protein","fish-lean","egg-whites","tofu","low-fat-dairy","starchy-vegetables","winter-squash","whole-grain-bread","cheese","eggs","lean-red-meat","dark-meat-poultry","nuts","seeds","olive-oil","avocado","nut-butters","dark-chocolate","dried-fruit","herbs","spices","lemon-lime","vinegar","garlic","water","coffee","tea","broth"],
    restrictedGroups: ["fried-foods","fast-food","ultra-processed-snacks","cream-based-soups","caloric-beverages","full-fat-dairy","processed-meat","refined-grains","refined-sugar","sugary-drinks","butter","margarine"],
    easyMatches: ["mediterranean","dash","mind","flexitarian","high-protein","vegan","vegetarian","pescatarian"],
    adaptableMatches: {
      "keto": "Volumetrics emphasizes carbs (produce, grains) which conflicts with keto; however, the focus on non-starchy vegetables and lean protein is compatible — keto partner skips grains/fruit and adds healthy fats",
      "paleo": "Compatible on vegetables and lean protein; paleo partner skips grains and legumes; Volumetrics produce emphasis is aligned",
      "low-fodmap": "Adapt — reduce high-FODMAP vegetables (onion, garlic, certain fruits); choose low-FODMAP produce within the energy density framework"
    },
    hardConflicts: {
      "hclf-811": "Different philosophies but can share a produce-heavy base meal; HCLF partner adds much more fruit and skips protein/animal foods",
      "carnivore": "Volumetrics is produce-centric; carnivore partner needs separate meals",
      "mcdougall": "Compatible on plant-food emphasis; McDougall allows cooked starches which fit Category 2; Volumetrics adds more produce and allows lean protein",
      "pritikin": "Very compatible — both are low-fat, high-produce; Pritikin is slightly more restrictive"
    },
  },
  {
    dietKey: "hclf-811",
    displayLabel: "80/10/10 (HCLF Raw Vegan)",
    category: "plant-based",
    emoji: "🍌",
    shortDesc: "Raw vegan, fruit-based — 80% carbs, 10% protein, 10% fat",
    evidenceGrade: "D",
    restrictiveness: 5,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["bananas","dates","mangoes","grapes","melons","papaya","pineapple","stone-fruit","pome-fruit","citrus","berries","tropical-fruit","figs","persimmons","leafy-greens","celery","tomatoes","cucumbers","peppers","zucchini","raw-vegetables","avocado","raw-nuts","raw-seeds","young-coconut","fresh-herbs","lemon-lime","raw-tomato","water","fresh-fruit-juice","spring-water"],
    restrictedGroups: ["red-meat","poultry","fish-fatty","fish-lean","seafood","eggs","dairy","honey","gelatin","cooked-grains","cooked-vegetables","cooked-legumes","baked-goods","cooked-soups","all-oils","butter","margarine","vegan-cheese","vegan-meat","refined-sugar","refined-grains","packaged-snacks","ultra-processed-food","salt","vinegar","soy-sauce","coffee","tea-hot","alcohol","oils","dried-coconut","nutritional-yeast"],
    easyMatches: ["raw-vegan","fruitarian"],
    adaptableMatches: {
      "vegan": "Very difficult — standard vegan includes cooked foods, grains, tofu, processed alternatives that are all prohibited on 80/10/10. Can share a salad base; vegan partner adds cooked grains/legumes/tofu",
      "vegetarian": "Same as vegan plus even more divergence with dairy/eggs. Suggest separate meals",
      "mcdougall": "Share the high-carb, low-fat philosophy; diverge on raw vs. cooked. Both partners can eat from a shared produce base but McDougall partner needs cooked starches",
      "pritikin": "Share the low-fat principle; diverge on raw vs. cooked and on animal protein. Suggest shared produce with separate protein/starch components"
    },
    hardConflicts: {
      "mediterranean": "Hard conflict — Mediterranean includes olive oil, fish, cheese, bread, wine — ALL prohibited on 80/10/10. Suggest entirely separate meals; shared base limited to a salad (without dressing)",
      "keto": "Maximum conflict — opposite macronutrient philosophy (80% fat vs. 80% carb). Completely incompatible meal structures",
      "paleo": "Hard conflict — paleo includes meat, cooked foods, oils. Only overlap is raw vegetables and fruit",
      "carnivore": "Maximum conflict — zero overlap. No shared foods possible",
      "high-protein": "Hard conflict — 80/10/10 deliberately limits protein to 10%; high-protein diets target 30%+",
      "volumetrics": "Different philosophies; can share a produce-heavy base but volumetrics allows cooked foods, lean protein, and measured oils. Suggest shared salad/fruit with separate protein and starch",
      "flexitarian": "Very difficult — flexitarian includes cooked foods, meat occasionally, dairy, eggs. Minimal overlap beyond produce",
      "dash": "Hard conflict — DASH includes low-fat dairy, lean protein, whole grains (cooked). Suggest separate meals",
      "low-fodmap": "Near-impossible — 80/10/10 requires enormous quantities of high-FODMAP fruit (bananas, mangoes, dates, watermelon, apples). Cannot be adapted without violating core principles"
    },
  },
  {
    dietKey: "healthy-eating",
    displayLabel: "Healthy Eating",
    category: "balanced",
    emoji: "🥗",
    shortDesc: "Balanced everyday eating — variety, whole foods, nothing banned",
    evidenceGrade: "A",
    restrictiveness: 1,
    isTimingPattern: false,
    isDefault: true,
    allowedGroups: [],
    restrictedGroups: [],
    easyMatches: [],
    adaptableMatches: {},
    hardConflicts: {},
  },
  {
    dietKey: "omnivore",
    displayLabel: "No restrictions",
    category: "balanced",
    emoji: "🍽️",
    shortDesc: "Eat everything — no dietary restrictions",
    evidenceGrade: "A",
    restrictiveness: 1,
    isTimingPattern: false,
    isDefault: true,
    allowedGroups: [],
    restrictedGroups: [],
    easyMatches: [],
    adaptableMatches: {},
    hardConflicts: {},
  },
  {
    dietKey: "vegetarian",
    displayLabel: "Vegetarian",
    category: "plant-based",
    emoji: "🥚",
    shortDesc: "No meat or fish — eggs and dairy OK",
    evidenceGrade: "A",
    restrictiveness: 2,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["legumes","eggs","dairy","vegetables","fruits","whole-grains","nuts","seeds"],
    restrictedGroups: ["red-meat","poultry","fish","seafood","processed-meat"],
    easyMatches: ["vegan","plant-based","mediterranean","flexitarian"],
    adaptableMatches: {
      "keto": "Use eggs and cheese as shared protein base",
      "paleo": "Focus on vegetables, nuts, eggs"
    },
    hardConflicts: {
      "carnivore": "Fundamental conflict — no shared protein source"
    },
  },
  {
    dietKey: "vegan",
    displayLabel: "Vegan",
    category: "plant-based",
    emoji: "🌱",
    shortDesc: "No animal products — plant-based only",
    evidenceGrade: "A",
    restrictiveness: 3,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["legumes","vegetables","fruits","whole-grains","nuts","seeds","tofu","tempeh"],
    restrictedGroups: ["red-meat","poultry","fish","seafood","eggs","dairy","honey","processed-meat"],
    easyMatches: ["vegetarian","plant-based","flexitarian"],
    adaptableMatches: {
      "mediterranean": "Make base plant-based, add fish separately for non-vegan partner"
    },
    hardConflicts: {
      "carnivore": "Fundamental conflict — no shared foods",
      "keto": "Very difficult — almost no shared protein sources"
    },
  },
  {
    dietKey: "pescatarian",
    displayLabel: "Pescatarian",
    category: "plant-based",
    emoji: "🐟",
    shortDesc: "No meat — fish and seafood OK",
    evidenceGrade: "A",
    restrictiveness: 2,
    isTimingPattern: false,
    isDefault: false,
    allowedGroups: ["fish","seafood","eggs","dairy","vegetables","fruits","whole-grains","legumes","nuts","seeds"],
    restrictedGroups: ["red-meat","poultry","processed-meat"],
    easyMatches: ["vegetarian","mediterranean","plant-based","flexitarian"],
    adaptableMatches: {
      "keto": "Use fish + low-carb vegetables as shared base"
    },
    hardConflicts: {
      "carnivore": "Fundamental conflict"
    },
  },
];
