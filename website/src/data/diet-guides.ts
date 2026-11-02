export interface DietCategory {
  id: string;
  label: string;
  blurb: string;
}

export interface DietGuideRow {
  dietKey: string;
  href: string;
  category: string;
  experimental: boolean;
  strengthLine: string;
  cautionLine: string;
}

export const DIET_CATEGORY_ORDER: DietCategory[] = [
  { id: 'balanced', label: 'Balanced & flexible', blurb: 'Broad patterns with the strongest long-term evidence in nutrition science. Nothing is banned outright — everything is dialed up or down.' },
  { id: 'low-carb', label: 'Lower carbohydrate', blurb: 'Structured carb restriction. Strong in specific clinical uses; the long-term cardiovascular picture still depends heavily on which fats and which foods fill the gap.' },
  { id: 'ancestral', label: 'Ancestral & elimination', blurb: 'Built on removing food groups, usually with a whole-food emphasis. For most people, most of the benefit comes from what gets removed — particularly ultra-processed food.' },
  { id: 'plant-based', label: 'Plant-forward', blurb: 'From full plant-only eating to fish-permitted patterns and philosophical frameworks. Nutrition works, with a handful of nutrients to plan around.' },
  { id: 'carb-forward', label: 'Carb-forward & very-low-fat', blurb: 'The opposite corner of the macro map from keto. When the carbs are whole and the fat is controlled, these patterns have real clinical track records.' },
  { id: 'macronutrient', label: 'Protein-focused', blurb: 'Built around one number rather than one philosophy — and that makes it one of the most adaptable tools in the set.' },
  { id: 'therapeutic', label: 'Therapeutic & condition-based', blurb: 'Dietary patterns designed around a clinical problem — IBS, blood pressure, blood sugar, bone, or a medical diagnosis. Best done with a clinician in the loop.' },
  { id: 'timing', label: 'Timing patterns', blurb: 'Not a food list at all — a schedule. What you eat still matters; these change when.' }
];

export const DIET_GUIDES: DietGuideRow[] = [
  { dietKey: 'mediterranean', href: '/diets/mediterranean', category: 'balanced', experimental: false, strengthLine: 'The most-studied pattern in nutrition. ~30% fewer major cardiovascular events in PREDIMED.', cautionLine: 'Cost — olive oil, fish and nuts are not cheap.' },
  { dietKey: 'dash', href: '/diets/dash', category: 'balanced', experimental: false, strengthLine: 'Built by NIH and tested in landmark trials; blood pressure falls 8–14 mmHg.', cautionLine: 'Requires cooking, not convenience food.' },
  { dietKey: 'mind', href: '/diets/mind', category: 'balanced', experimental: false, strengthLine: 'Observational cohorts show 53% lower Alzheimer risk at high adherence.', cautionLine: 'No completed long-term RCT on hard dementia endpoints yet.' },
  { dietKey: 'flexitarian', href: '/diets/flexitarian', category: 'balanced', experimental: false, strengthLine: 'Captures much of the plant-based benefit without a total ban.', cautionLine: 'Loose definition means some "flexitarians" drift back.' },
  { dietKey: 'volumetrics', href: '/diets/volumetrics', category: 'balanced', experimental: false, strengthLine: 'Encrypted the physics of fullness: low energy density eaten in volume.', cautionLine: 'Home cooking heavy; eating out takes strategy.' },
  { dietKey: 'keto', href: '/diets/keto', category: 'low-carb', experimental: false, strengthLine: 'Grade A for pediatric epilepsy; strong short-term weight-loss and blood-sugar data.', cautionLine: 'LDL rises in a substantial subset; long-term CV safety unproven.' },
  { dietKey: 'carnivore', href: '/diets/carnivore', category: 'low-carb', experimental: true, strengthLine: 'Existence proofs of improvement exist, but evidence is overwhelmingly anecdotal.', cautionLine: 'No fibre, no plants, D-grade evidence. Only attempt with a clinician.' },
  { dietKey: 'paleo', href: '/diets/paleo', category: 'ancestral', experimental: false, strengthLine: 'Cutting ultra-processed food, added sugar and refined starch reliably improves cardiometabolic markers.', cautionLine: 'Bans on grains, legumes and dairy are stricter than the evidence supports.' },
  { dietKey: 'whole30', href: '/diets/whole30', category: 'ancestral', experimental: true, strengthLine: 'A decent 30-day reset that reveals how much sugar is hiding in your week.', cautionLine: 'No peer-reviewed trials; not a long-term pattern.' },
  { dietKey: 'plant-based', href: '/diets/plant-based', category: 'plant-based', experimental: false, strengthLine: 'Plant-forward eating shows consistent cardiometabolic benefit across cohorts.', cautionLine: 'Poorly planned versions over-rely on refined carbs and vegan UPF.' },
  { dietKey: 'vegan', href: '/diets/vegan', category: 'plant-based', experimental: false, strengthLine: 'Lower body weight, blood pressure and cholesterol in cohorts; Adventist data is robust.', cautionLine: 'Vitamin B12 is non-negotiable. Iron, calcium, omega-3 and protein need attention.' },
  { dietKey: 'vegetarian', href: '/diets/vegetarian', category: 'plant-based', experimental: false, strengthLine: 'One of the healthiest cohort profiles ever documented (Oxford Vegetarian Study, EPIC-Oxford).', cautionLine: 'Eggs-and-cheese vegetarianism can quietly become a high-saturated-fat diet.' },
  { dietKey: 'pescatarian', href: '/diets/pescatarian', category: 'plant-based', experimental: false, strengthLine: 'Fish brings omega-3, iodine and B12; cohorts show very low CVD.', cautionLine: 'Fish supply and contaminants; planning still matters.' },
  { dietKey: 'macrobiotic', href: '/diets/macrobiotic', category: 'plant-based', experimental: true, strengthLine: 'Whole-grain, seasonal, mostly plant — the food list itself is reasonable.', cautionLine: 'Historical versions produced rickets, scurvy and anemia; modern ones are safer but evidence remains weak.' },
  { dietKey: 'mcdougall', href: '/diets/high-carb', category: 'carb-forward', experimental: false, strengthLine: 'Whole-food starch-centric eating is a proven shape for longevity worldwide.', cautionLine: 'Very-low-fat end (<10%) is harder to sustain than the marketing suggests.' },
  { dietKey: 'hclf-811', href: '/diets/80-10-10', category: 'carb-forward', experimental: true, strengthLine: 'The proof for extreme versions is almost entirely testimonial.', cautionLine: 'Severely inadequate protein, B12 and calories for most people.' },
  { dietKey: 'pritikin', href: '/diets/pritikin', category: 'carb-forward', experimental: false, strengthLine: 'Real clinical program with published results on heart-disease risk factors.', cautionLine: 'Fat this low is the strictest mainstream option on the board.' },
  { dietKey: 'high-protein', href: '/diets/high-protein', category: 'macronutrient', experimental: false, strengthLine: 'Best-kept muscle and best appetite control of any single macro lever.', cautionLine: 'Source matters: processed meat carries real risks.' },
  { dietKey: 'low-fodmap', href: '/diets/low-fodmap', category: 'therapeutic', experimental: false, strengthLine: 'Effective for ~70% of IBS patients in RCTs — as a diagnostic, not a lifestyle.', cautionLine: 'Restricts many healthy foods; long-term use harms the microbiome.' },
  { dietKey: 'gluten-free', href: '/diets/gluten-free', category: 'therapeutic', experimental: false, strengthLine: 'Grade A necessity for celiac disease; symptom resolution is dramatic when correct.', cautionLine: 'Unnecessary versions are usually worse: more UPF, less fibre and micronutrients.' },
  { dietKey: 'low-sodium', href: '/diets/low-sodium', category: 'therapeutic', experimental: false, strengthLine: 'Trials show dose-responsive blood-pressure reduction with sodium targets.', cautionLine: 'The diet is 80% processed food; it is cooks-with-real-food or it is not really done.' },
  { dietKey: 'diabetes-friendly', href: '/diets/diabetes-friendly', category: 'therapeutic', experimental: false, strengthLine: 'Fibre-forward, low-GI, controlled-carb eating sits at the core of diabetes management.', cautionLine: 'Medication adjustments are required; do not DIY blood-sugar changes.' },
  { dietKey: 'bone-health', href: '/diets/bone-health', category: 'therapeutic', experimental: false, strengthLine: 'Calcium, vitamin D and protein all improve bone markers where deficient.', cautionLine: 'Food beats supplements; salt and cola quietly work against bone.' },
  { dietKey: 'intermittent-fasting', href: '/diets/intermittent-fasting', category: 'timing', experimental: false, strengthLine: 'Matches continuous calorie restriction for weight loss with a simpler rule set.', cautionLine: 'Not for pregnancy, type 1 diabetes or anyone with disordered-eating history.' }
];

export function guideFor(dietKey: string): DietGuideRow {
  const found = DIET_GUIDES.find((g) => g.dietKey === dietKey);
  if (!found) throw new Error(`No guide row for dietKey: ${dietKey}`);
  return found;
}
