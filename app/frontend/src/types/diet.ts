export interface DietCatalogEntry {
  dietKey: string;
  displayLabel: string;
  category: string;
  emoji: string;
  shortDesc: string;
  evidenceGrade: string;
  restrictiveness: number;
  isTimingPattern: boolean;
  isDefault: boolean;
  isCondition: boolean;
  aiRules: string;
  allowedGroups: string[];
  restrictedGroups: string[];
  classifierTerms: Record<string, string>;
  macroTargets: Record<string, number | string | Array<number | string>>;
  easyMatches: string[];
  adaptableMatches: Record<string, string>;
  hardConflicts: Record<string, string>;
}

export interface DietArticleSummary {
  dietKey: string;
  fileSlug: string;
  title: string;
  r2Key: string;
  sortOrder: number;
}

export interface DietArticleContent {
  dietKey: string;
  fileSlug: string;
  title: string;
  content: string;
}

export const DIET_CATEGORIES: Record<string, string> = {
  balanced: 'Balanced',
  lowCarb: 'Low-Carb',
  'plant-based': 'Plant-Based',
  macronutrient: 'Macronutrient-Focused',
  'macronutrient-focused': 'Macronutrient-Focused',
  therapeutic: 'Therapeutic / Medical',
  lifestyle: 'Lifestyle',
  elimination: 'Elimination',
  ancestral: 'Ancestral',
  timing: 'Timing Pattern',
  condition: 'Health Condition',
};
