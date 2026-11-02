export interface DietOption {
  dietKey: string;
  displayLabel: string;
  category: string;
  emoji: string;
  isCondition: boolean;
  isDefault: boolean;
}

export const DIET_CATEGORY_ORDER = [
  'balanced',
  'therapeutic',
  'lowCarb',
  'macronutrient-focused',
  'plant-based',
  'ancestral',
  'timing',
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  balanced: 'Balanced & flexible',
  lowCarb: 'Lower carbohydrate',
  'macronutrient-focused': 'Protein-focused',
  macronutrient: 'Protein-focused',
  'plant-based': 'Plant-forward',
  plantBased: 'Plant-forward',
  ancestral: 'Ancestral & elimination',
  therapeutic: 'Therapeutic / medical',
  timing: 'Timing patterns',
  condition: 'Health conditions',
};

export function normalizeCategoryKey(category: string): string {
  if (category === 'plantBased') return 'plant-based';
  if (category === 'macronutrient') return 'macronutrient-focused';
  return category;
}

export function dietCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

function sortDiets(list: DietOption[]): DietOption[] {
  return [...list].sort((a, b) => {
    const byDefault = Number(b.isDefault) - Number(a.isDefault);
    if (byDefault !== 0) return byDefault;
    return a.displayLabel.localeCompare(b.displayLabel);
  });
}

export function groupDietOptions(
  diets: DietOption[],
): { key: string; label: string; diets: DietOption[] }[] {
  const map = new Map<string, DietOption[]>();
  for (const diet of diets) {
    const key = normalizeCategoryKey(diet.category);
    const group = map.get(key) ?? [];
    group.push(diet);
    map.set(key, group);
  }
  return DIET_CATEGORY_ORDER.map((key) => ({
    key,
    label: dietCategoryLabel(key),
    diets: sortDiets(map.get(key) ?? []),
  })).filter((group) => group.diets.length > 0);
}

export const FALLBACK_DIET_OPTIONS: DietOption[] = [
  { dietKey: 'healthy-eating', displayLabel: 'Healthy Eating', category: 'balanced', emoji: '🥗', isCondition: false, isDefault: true },
  { dietKey: 'omnivore', displayLabel: 'No restrictions', category: 'balanced', emoji: '🍽️', isCondition: false, isDefault: true },
  { dietKey: 'volumetrics', displayLabel: 'Volumetrics', category: 'balanced', emoji: '⚖️', isCondition: false, isDefault: false },
  { dietKey: 'mediterranean', displayLabel: 'Mediterranean', category: 'balanced', emoji: '🫒', isCondition: false, isDefault: false },
  { dietKey: 'mind', displayLabel: 'MIND', category: 'balanced', emoji: '🧠', isCondition: false, isDefault: false },
  { dietKey: 'dash', displayLabel: 'DASH', category: 'therapeutic', emoji: '❤️', isCondition: false, isDefault: false },
  { dietKey: 'low-fodmap', displayLabel: 'Low FODMAP', category: 'therapeutic', emoji: '🫃', isCondition: false, isDefault: false },
  { dietKey: 'pritikin', displayLabel: 'Pritikin', category: 'therapeutic', emoji: '💚', isCondition: false, isDefault: false },
  { dietKey: 'keto', displayLabel: 'Keto / Low-Carb', category: 'lowCarb', emoji: '🥩', isCondition: false, isDefault: false },
  { dietKey: 'carnivore', displayLabel: 'Carnivore', category: 'lowCarb', emoji: '🥩', isCondition: false, isDefault: false },
  { dietKey: 'high-protein', displayLabel: 'High-Protein', category: 'macronutrient-focused', emoji: '💪', isCondition: false, isDefault: false },
  { dietKey: 'flexitarian', displayLabel: 'Flexitarian', category: 'plant-based', emoji: '🌱', isCondition: false, isDefault: false },
  { dietKey: 'plant-based', displayLabel: 'Plant-Based / Vegan / Vegetarian', category: 'plant-based', emoji: '🥗', isCondition: false, isDefault: false },
  { dietKey: 'mcdougall', displayLabel: 'McDougall (Starch Solution)', category: 'plant-based', emoji: '🥔', isCondition: false, isDefault: false },
  { dietKey: 'macrobiotic', displayLabel: 'Macrobiotic', category: 'plant-based', emoji: '🍚', isCondition: false, isDefault: false },
  { dietKey: 'hclf-811', displayLabel: '80/10/10 (HCLF Raw Vegan)', category: 'plant-based', emoji: '🍌', isCondition: false, isDefault: false },
  { dietKey: 'vegetarian', displayLabel: 'Vegetarian', category: 'plant-based', emoji: '🥚', isCondition: false, isDefault: false },
  { dietKey: 'pescatarian', displayLabel: 'Pescatarian', category: 'plant-based', emoji: '🐟', isCondition: false, isDefault: false },
  { dietKey: 'vegan', displayLabel: 'Vegan', category: 'plant-based', emoji: '🌱', isCondition: false, isDefault: false },
  { dietKey: 'paleo', displayLabel: 'Paleo', category: 'ancestral', emoji: '🦴', isCondition: false, isDefault: false },
  { dietKey: 'whole30', displayLabel: 'Whole30', category: 'ancestral', emoji: '🚫', isCondition: false, isDefault: false },
  { dietKey: 'intermittent-fasting', displayLabel: 'Intermittent Fasting', category: 'timing', emoji: '⏰', isCondition: false, isDefault: false },
  { dietKey: 'gluten-free', displayLabel: 'Gluten-Free', category: 'condition', emoji: '🌾', isCondition: true, isDefault: false },
  { dietKey: 'low-sodium', displayLabel: 'Low-Sodium / Heart', category: 'condition', emoji: '❤️', isCondition: true, isDefault: false },
  { dietKey: 'diabetes-friendly', displayLabel: 'Diabetes-Friendly', category: 'condition', emoji: '🩸', isCondition: true, isDefault: false },
  { dietKey: 'bone-health', displayLabel: 'Bone Health', category: 'condition', emoji: '🦴', isCondition: true, isDefault: false },
];
