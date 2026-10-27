import type { Env } from '../env';
import type { Diet, Goal, ActivityLevel } from '../routes/profiles';
import type { TDEEResult } from '../lib/tdee';
import type { MacroTargets } from './diet-rules';

const GOAL_LABELS: Record<Goal, string> = { lose: 'lose weight', maintain: 'maintain weight', gain: 'build muscle' };

export interface MealIngredient {
  name: string;
  have: boolean;
  quantity: string;
}

export interface PlatingInstruction {
  partnerSlot: 1 | 2;
  partnerName: string;
  targetCalories: number;
  plate: string;
  protein: number;
  carbs: number;
  fat: number;
}

export interface GeneratedMeal {
  name: string;
  description: string;
  timeMinutes: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodiumMg?: number;
  ingredients: MealIngredient[];
  steps: string[];
  plating?: PlatingInstruction[];
  savedRecipeId?: string;
}

const MODEL_CHAINS = {
  alibaba: ['qwen3.5-plus', 'qwen3.6-plus', 'moonshotai/kimi-k2.5'],
  zai: ['glm-5.1', 'glm-5', 'glm-5-turbo'],
  deepseek: ['deepseek-v4-flash'],
} as const;

const PROVIDER_CONFIG = {
  alibaba: {
    baseUrl: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
    authHeader: 'Authorization',
    authPrefix: 'Bearer',
    secretRef: 'ALIBABA_KEY',
  },
  zai: {
    baseUrl: 'https://api.z.ai/api/paas/v4/chat/completions',
    authHeader: 'Authorization',
    authPrefix: 'Bearer',
    secretRef: 'ZAI_KEY',
  },
  deepseek: {
    baseUrl: 'https://api.deepseek.com/chat/completions',
    authHeader: 'Authorization',
    authPrefix: 'Bearer',
    secretRef: 'DEEPSEEK_KEY',
  },
} as const;

export function buildPrompt(
  pantryItems: Array<{ name: string; quantity: string; category?: string; quantityValue?: number | null; quantityUnit?: string; brand?: string }>,
  partner1Diet: Diet,
  partner2Diet: Diet,
  partner1Allergens: string[],
  partner2Allergens: string[],
  partner1Goal?: Goal | null,
  partner2Goal?: Goal | null,
  partner1Body?: { name: string; tdee: TDEEResult },
  partner2Body?: { name: string; tdee: TDEEResult },
  dietRulesPrompt?: string,
  mealType?: string,
): string {
  const mealLabel = mealType && mealType !== 'any' ? mealType : 'meal';
  const pantryList = pantryItems.map((i) => {
    const qty = i.quantityValue && i.quantityUnit ? `${i.quantityValue} ${i.quantityUnit}` : (i.quantity || '');
    const parts: string[] = [];
    if (qty) parts.push(qty);
    if (i.category) parts.push(i.category);
    if (i.brand) parts.push(i.brand);
    return `${i.name}${parts.length > 0 ? ` (${parts.join(', ')})` : ''}`;
  }).join(', ') || 'none listed';

  const allAllergenSet = new Set<string>();
  for (const a of partner1Allergens) allAllergenSet.add(a.trim().toLowerCase());
  for (const a of partner2Allergens) allAllergenSet.add(a.trim().toLowerCase());
  const allAllergens = allAllergenSet.size > 0 ? [...allAllergenSet].sort().join(', ') : null;

  const hasAnyGoal = partner1Goal || partner2Goal;
  const goalRule = hasAnyGoal ? `\n- Respect each partner's body goal when choosing meals and portions (higher protein for muscle gain, lower calorie density for weight loss, balanced for maintenance). This is critical.` : '';
  const allergenRule = allAllergens ? `\n- STRICTLY AVOID any trace of these allergens: ${allAllergens}. This is critical — meals must be 100% free of these items. Also avoid known derivatives: if an allergen is on the list, its oils, flours, butters, and extracts are also forbidden.` : '';

  const p1Allergens = partner1Allergens.length > 0 ? partner1Allergens.join(', ') : '';
  const p2Allergens = partner2Allergens.length > 0 ? partner2Allergens.join(', ') : '';

  if (partner1Body && partner2Body) {
    return `You are an adaptive meal planner for couples who cook together but have different nutritional goals.

Pantry: ${pantryList}
Partner 1: ${partner1Body.name}, diet=${partner1Diet}${p1Allergens ? `, allergies=${p1Allergens}` : ''}${partner1Goal ? `, goal=${GOAL_LABELS[partner1Goal]}` : ''}, target=${partner1Body.tdee.targetCalories} cal/day
Partner 2: ${partner2Body.name}, diet=${partner2Diet}${p2Allergens ? `, allergies=${p2Allergens}` : ''}${partner2Goal ? `, goal=${GOAL_LABELS[partner2Goal]}` : ''}, target=${partner2Body.tdee.targetCalories} cal/day
Time limit: 30 minutes

Generate ONE shared recipe with TWO different plating instructions. Same cooking process, different portions.

Rules:
- The meal must work for BOTH dietary preferences${allergenRule}${goalRule}
- Prioritize using pantry ingredients
- Give specific portion sizes for each partner's plate
- Output ONLY valid JSON, no markdown, no explanation${dietRulesPrompt ? `\n\n${dietRulesPrompt}` : ''}

JSON format:
{
  "name": "Recipe Name",
  "description": "Brief description",
  "timeMinutes": 25,
  "calories": 500,
  "protein": 35,
  "carbs": 45,
  "fat": 15,
  "sodium_mg": 480,
  "ingredients": [
    {"name": "ingredient", "have": true, "quantity": "1 cup"},
    {"name": "missing", "have": false, "quantity": "2 tbsp"}
  ],
  "steps": ["Step 1", "Step 2"],
  "plating": [
    {"partnerSlot": 1, "partnerName": "${partner1Body.name}", "targetCalories": ${partner1Body.tdee.targetCalories}, "plate": "4oz chicken over greens, 1/2 cup rice", "protein": 35, "carbs": 30, "fat": 12},
    {"partnerSlot": 2, "partnerName": "${partner2Body.name}", "targetCalories": ${partner2Body.tdee.targetCalories}, "plate": "6oz chicken, 1 cup rice, side vegetables", "protein": 50, "carbs": 55, "fat": 15}
  ]
}`;
  }

  return `You are a meal planner for couples. Generate ONE ${mealLabel} suggestion based on what they have.

Pantry: ${pantryList}
Partner 1: diet=${partner1Diet}${p1Allergens ? `, allergies=${p1Allergens}` : ''}${partner1Goal ? `, goal=${GOAL_LABELS[partner1Goal]}` : ''}
Partner 2: diet=${partner2Diet}${p2Allergens ? `, allergies=${p2Allergens}` : ''}${partner2Goal ? `, goal=${GOAL_LABELS[partner2Goal]}` : ''}
Time limit: 30 minutes

Rules:
- The meal must work for BOTH dietary preferences (if one is vegetarian, the meal must be vegetarian)${allergenRule}${goalRule}
- Prioritize using pantry ingredients
- Keep it simple and realistic
- Output ONLY valid JSON, no markdown, no explanation${dietRulesPrompt ? `\n\n${dietRulesPrompt}` : ''}

JSON format:
{
  "name": "Recipe Name",
  "description": "Brief appetizing description",
  "timeMinutes": 25,
  "calories": 500,
  "protein": 35,
  "carbs": 45,
  "fat": 15,
  "sodium_mg": 480,
  "ingredients": [
    {"name": "ingredient name", "have": true, "quantity": "1 cup"},
    {"name": "missing ingredient", "have": false, "quantity": "2 tbsp"}
  ],
  "steps": ["Step 1", "Step 2", "Step 3"]
}`;
}

async function callProvider(
  env: Env,
  provider: 'alibaba' | 'zai' | 'deepseek',
  model: string,
  prompt: string,
): Promise<GeneratedMeal | null> {
  const config = PROVIDER_CONFIG[provider];
  const apiKey = (env as unknown as Record<string, unknown>)[config.secretRef] as string;

  if (!apiKey) {
    console.error(`Missing API key for provider ${provider}: ${config.secretRef}`);
    return null;
  }

  const res = await fetch(config.baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      [config.authHeader]: `${config.authPrefix} ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 1536,
      messages: [{ role: 'user', content: prompt }],
      ...(provider === 'deepseek' ? { thinking: { type: 'disabled' } } : {}),
    }),
  });

  if (!res.ok) {
    console.error(`Provider ${provider} call failed for model ${model}: ${res.status}`);
    return null;
  }

  const data = (await res.json()) as { choices: Array<{ message: { content: string } }> };
  const text = data.choices?.[0]?.message?.content ?? '';

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return normalizeMeal(JSON.parse(jsonMatch[0]) as GeneratedMeal);
    }
  } catch {
    console.error(`Failed to parse AI response from model ${model}`);
  }

  return null;
}

function getMealTextTokens(meal: GeneratedMeal): string[] {
  const texts = [
    meal.name,
    meal.description,
    ...meal.ingredients.map((i) => i.name),
    ...meal.steps,
    ...(meal.plating?.map((p) => p.plate) ?? []),
  ];
  return texts.map((t) => t.toLowerCase().trim());
}

function normalizeMeal(meal: GeneratedMeal): GeneratedMeal {
  const raw = meal as GeneratedMeal & { sodium_mg?: number | string; sodiumMg?: number | string };
  const sodium = raw.sodiumMg ?? raw.sodium_mg;
  delete raw.sodium_mg;
  if (sodium !== undefined && sodium !== null && sodium !== '') {
    const n = Number(sodium);
    if (Number.isFinite(n)) raw.sodiumMg = n;
  }
  return raw;
}

/**
 * Diet classifier matcher. Unlike tokenMatchesAllergen, this matches
 * whole phrases / whole words only, so "soy sauce" does not match any dish
 * containing the word "sauce" and "rice" does not match "rice flour".
 */
export function dietTokenMatchesTerm(token: string, term: string): boolean {
  const normalize = (s: string) =>
    s.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const normalizedToken = normalize(token.toLowerCase());
  const normalizedTerm = normalize(term.toLowerCase());
  if (!normalizedToken || !normalizedTerm) return false;

  if (normalizedTerm.includes(' ')) {
    return normalizedToken.includes(normalizedTerm);
  }
  return normalizedToken.split(' ').includes(normalizedTerm);
}

export function assertMealIsSafe(meal: GeneratedMeal, profiles: PartnerContext[]): boolean {
  const allAllergens = new Set<string>();
  for (const p of profiles) {
    for (const a of (p.allergens ?? [])) {
      const cleaned = a.trim().toLowerCase();
      if (cleaned) {
        allAllergens.add(cleaned);
        const crossReactive = CROSS_REACTIVE_MAP[cleaned];
        if (crossReactive) {
          for (const cr of crossReactive) allAllergens.add(cr);
        }
      }
    }
  }

  if (allAllergens.size === 0) return true;

  const tokens = getMealTextTokens(meal);
  const found: string[] = [];

  for (const allergen of allAllergens) {
    for (const token of tokens) {
      if (tokenMatchesAllergen(token, allergen)) {
        found.push(allergen);
        break;
      }
    }
  }

  if (found.length > 0) {
    console.error(`Meal safety guard blocked: allergens ${found.join(', ')} detected in meal "${meal.name}"`);
    return false;
  }

  return true;
}

export function assertMealCompliesWithDiet(
  meal: GeneratedMeal,
  classifierTerms: Record<string, string>,
  restrictedGroups: Set<string>,
): boolean {
  return getDietViolations(meal, classifierTerms, restrictedGroups).length === 0;
}

export function getDietViolations(
  meal: GeneratedMeal,
  classifierTerms: Record<string, string>,
  restrictedGroups: Set<string>,
): string[] {
  if (restrictedGroups.size === 0 || Object.keys(classifierTerms).length === 0) return [];

  const tokens = getMealTextTokens(meal);
  const violations: string[] = [];

  for (const token of tokens) {
    for (const [ingredient, foodGroup] of Object.entries(classifierTerms)) {
      if (!dietTokenMatchesTerm(token, ingredient) || !restrictedGroups.has(foodGroup)) continue;
      if (isExemptByDietMarker(token, foodGroup)) continue;
      const violation = `${ingredient} → ${foodGroup}`;
      if (!violations.includes(violation)) violations.push(violation);
    }
  }

  return violations;
}

/**
 * Explicit "free-from" labels should not be flagged as violations of the
 * restriction they are free from: "gluten-free bread" is not regular bread,
 * "low-sodium soy sauce" is not a high-sodium condiment. The marker must be
 * relevant to the matched restricted group.
 */
const DIET_MARKERS: Array<{ label: RegExp; group: RegExp }> = [
  { label: /\b(gluten|wheat)[\s-]?free\b/, group: /(wheat|barley|rye|gluten|malt|bread|pasta|noodle|couscous|bulgur|semolina|durum|spelt|kamut|farro|seitan|breadcrumb|batter|snack|bouillon|soy-sauce)/ },
  { label: /\bunsalted\b|\bsalt[\s-]?free\b|\bno (added )?salt\b/, group: /(salt|sodium)/ },
  { label: /\bsugar[\s-]?free\b|\bunsweetened\b|\bno added sugar\b/, group: /sugar/ },
  { label: /\blow[\s-]?sodium\b/, group: /sodium/ },
];

export function isExemptByDietMarker(token: string, foodGroup: string): boolean {
  const normalized = token.toLowerCase();
  return DIET_MARKERS.some(
    (marker) => marker.label.test(normalized) && marker.group.test(foodGroup.toLowerCase()),
  );
}

/**
 * Numeric adherence guard for stacked health conditions. Only ceilings are
 * enforced (sodium, carbohydrate, etc.) because floors such as calcium or
 * protein are aspirational per meal and are not reliably reported by the model.
 * Sodium is only checked when the model reported a value.
 */
export function assertMealMeetsTargets(
  meal: GeneratedMeal,
  macroTargets?: Record<string, number | string | Array<number | string>>,
): boolean {
  return getTargetViolations(meal, macroTargets).length === 0;
}

export function getTargetViolations(
  meal: GeneratedMeal,
  macroTargets?: Record<string, number | string | Array<number | string>>,
): string[] {
  if (!macroTargets) return [];

  const violations: string[] = [];
  const num = (value: unknown): number | null => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  };

  const carbsMax = num(macroTargets.carbs_g_meal_max);
  const mealCarbs = num(meal.carbs);
  if (carbsMax !== null && mealCarbs !== null && mealCarbs > carbsMax) {
    violations.push(`carbs ${mealCarbs}g > ${carbsMax}g per meal`);
  }

  const sodiumMax = num(macroTargets.sodium_mg_meal_max);
  const mealSodium = num(meal.sodiumMg);
  if (sodiumMax !== null && mealSodium !== null && mealSodium > sodiumMax) {
    violations.push(`sodium ${mealSodium}mg > ${sodiumMax}mg per meal`);
  }

  return violations;
}

export async function generateMeal(
  env: Env,
  pantryItems: Array<{ name: string; quantity: string; category?: string; quantityValue?: number | null; quantityUnit?: string }>,
  partner1Diet: Diet,
  partner2Diet: Diet,
  partner1Allergens: string[],
  partner2Allergens: string[],
  partner1Goal?: Goal | null,
  partner2Goal?: Goal | null,
  partner1Body?: { name: string; tdee: TDEEResult },
  partner2Body?: { name: string; tdee: TDEEResult },
  profiles?: PartnerContext[],
  dietRulesPrompt?: string,
  dietClassifierTerms?: Record<string, string>,
  dietRestrictedGroups?: Set<string>,
  dietMacroTargets?: MacroTargets,
  mealType?: string,
): Promise<GeneratedMeal | null> {
  const provider = (env.AI_PROVIDER || 'deepseek') as keyof typeof MODEL_CHAINS;
  const models = MODEL_CHAINS[provider] || MODEL_CHAINS.deepseek;
  const prompt = buildPrompt(pantryItems, partner1Diet, partner2Diet, partner1Allergens, partner2Allergens, partner1Goal, partner2Goal, partner1Body, partner2Body, dietRulesPrompt, mealType);

  for (const model of models) {
    try {
      let attemptPrompt = prompt;
      let meal = await callProvider(env, provider as 'alibaba' | 'zai' | 'deepseek', model, attemptPrompt);

      if (meal && dietMacroTargets) {
        const targetViolations = getTargetViolations(meal, dietMacroTargets);
        if (targetViolations.length > 0) {
          console.log(`Meal exceeded numeric targets (${targetViolations.join(', ')}); retrying once with feedback`);
          const feedback = `\n\nIMPORTANT: Your previous meal "${meal.name}" did not meet the household's health-condition targets: ${targetViolations.join('; ')}. Regenerate the meal so it adheres strictly. Replace high-sodium or high-carbohydrate ingredients (e.g. soy sauce, cured meats, white rice, sugary sauces) with compliant alternatives, and report sodium_mg.`;
          attemptPrompt = prompt + feedback;
          meal = await callProvider(env, provider as 'alibaba' | 'zai' | 'deepseek', model, attemptPrompt);
        }
      }

      if (meal) {
        console.log(`AI meal generated using model: ${model} (provider: ${provider})`);
        if (partner1Body && partner2Body && !meal.plating) {
          meal.plating = [
            {
              partnerSlot: 1,
              partnerName: partner1Body.name,
              targetCalories: partner1Body.tdee.targetCalories,
              plate: `${Math.round(partner1Body.tdee.targetCalories * 0.4 / 4)}oz protein over greens, ${Math.round(partner1Body.tdee.targetCalories * 0.3 / 200)}/2 cup rice`,
              protein: Math.round(partner1Body.tdee.targetCalories * 0.3 / 4),
              carbs: Math.round(partner1Body.tdee.targetCalories * 0.4 / 4),
              fat: Math.round(partner1Body.tdee.targetCalories * 0.3 / 9),
            },
            {
              partnerSlot: 2,
              partnerName: partner2Body.name,
              targetCalories: partner2Body.tdee.targetCalories,
              plate: `${Math.round(partner2Body.tdee.targetCalories * 0.4 / 4)}oz protein, ${Math.round(partner2Body.tdee.targetCalories * 0.35 / 200)} cup rice, side vegetables`,
              protein: Math.round(partner2Body.tdee.targetCalories * 0.35 / 4),
              carbs: Math.round(partner2Body.tdee.targetCalories * 0.4 / 4),
              fat: Math.round(partner2Body.tdee.targetCalories * 0.25 / 9),
            },
          ];
        }

        if (profiles && !assertMealIsSafe(meal, profiles)) {
          return null;
        }

        if (dietClassifierTerms && dietRestrictedGroups && dietRestrictedGroups.size > 0) {
          if (!assertMealCompliesWithDiet(meal, dietClassifierTerms, dietRestrictedGroups)) {
            return null;
          }
        }

        if (dietMacroTargets && !assertMealMeetsTargets(meal, dietMacroTargets)) {
          console.log(`Meal "${meal.name}" still exceeded numeric targets after retry; refusing unsafe meal`);
          return null;
        }

        return meal;
      }
    } catch (err) {
      console.error(`Model ${model} failed:`, err);
    }
  }

  console.error(`All AI models failed for provider ${provider}. Returning null (no mock fallback).`);
  return null;
}

export interface ChatResponse {
  message: string;
  meal?: GeneratedMeal;
  actions?: {
    addToPantry?: string[];
    addToList?: string[];
  };
  clarification?: ChatClarification;
}

export type MealGenerationMode = 'auto' | 'cook_from_pantry' | 'generate_freely';

export interface ClarificationOption {
  id: MealGenerationMode;
  label: string;
  hint?: string;
}

export interface ChatClarification {
  kind: 'pantry_diet_conflict' | 'empty_pantry' | 'no_safe_items';
  conflictingItems: string[];
  allergenBlocked: boolean;
  options: ClarificationOption[];
}

export interface PartnerContext {
  name: string;
  diet: Diet;
  allergens: string[];
  tdee: TDEEResult | null;
  goal: Goal | null;
  activityLevel: ActivityLevel | null;
  slot: 1 | 2;
}

export const CROSS_REACTIVE_MAP: Record<string, string[]> = {
  peanut: ['peanut oil', 'peanut butter', 'peanut flour', 'groundnuts', 'arachis', 'goober', 'beer nut'],
  shellfish: ['crab', 'lobster', 'shrimp', 'prawn', 'crayfish', 'scallop', 'clam', 'mussel', 'oyster', 'squid', 'calamari', 'octopus'],
  dairy: ['milk', 'cheese', 'yogurt', 'cream', 'butter', 'ghee', 'whey', 'casein', 'lactose', 'sour cream', 'ice cream', 'custard', 'pudding'],
  egg: ['eggs', 'egg white', 'egg yolk', 'mayonnaise', 'meringue', 'albumin', 'ovoglobulin'],
  soy: ['soy sauce', 'tofu', 'tempeh', 'edamame', 'miso', 'soybean', 'soya', 'textured vegetable protein'],
  wheat: ['flour', 'bread', 'pasta', 'noodle', 'couscous', 'bulgur', 'semolina', 'spelt', 'farro', 'seitan', 'gluten', 'tortilla'],
  fish: ['salmon', 'tuna', 'cod', 'halibut', 'mackerel', 'sardine', 'anchovy', 'trout', 'tilapia', 'bass', 'snapper', 'catfish'],
  tree_nut: ['almond', 'walnut', 'cashew', 'pecan', 'pistachio', 'hazelnut', 'macadamia', 'brazil nut', 'pine nut', 'chestnut'],
  sesame: ['sesame oil', 'tahini', 'hummus', 'sesame seed', 'halva'],
  sulfite: ['wine', 'vinegar', 'dried fruit', 'pickled', 'sulfite'],
};

export function tokenMatchesAllergen(token: string, allergen: string): boolean {
  const normalizedToken = token.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = normalizedToken.split(/\s+/);
  for (const word of words) {
    if (word === allergen) return true;
    if (allergen.length >= 4 && word.includes(allergen)) return true;
    if (allergen.includes(word) && word.length > 3) return true;
  }
  return false;
}

function buildAllergenList(profiles: PartnerContext[]): { combinedList: string; hasAllergens: boolean; p1Line: string; p2Line: string } {
  const p1 = profiles.find((p) => p.slot === 1);
  const p2 = profiles.find((p) => p.slot === 2);
  const allAllergens = new Set<string>();
  const p1s = p1?.allergens ?? [];
  const p2s = p2?.allergens ?? [];
  for (const a of p1s) allAllergens.add(a.trim().toLowerCase());
  for (const a of p2s) allAllergens.add(a.trim().toLowerCase());
  const combinedList = allAllergens.size > 0 ? [...allAllergens].sort().join(', ') : '';
  const hasAllergens = allAllergens.size > 0;

  const p1Line = p1
    ? `Partner 1: ${p1.name}, diet=${p1.diet}${p1s.length > 0 ? `, allergies=${p1s.join(', ')}` : ''}${p1.goal ? `, goal=${GOAL_LABELS[p1.goal]}` : ''}${p1.tdee ? `, target=${p1.tdee.targetCalories} cal/day` : ''}`
    : 'Partner 1: no profile set';
  const p2Line = p2
    ? `Partner 2: ${p2.name}, diet=${p2.diet}${p2s.length > 0 ? `, allergies=${p2s.join(', ')}` : ''}${p2.goal ? `, goal=${GOAL_LABELS[p2.goal]}` : ''}${p2.tdee ? `, target=${p2.tdee.targetCalories} cal/day` : ''}`
    : 'Partner 2: no profile set';

  return { combinedList, hasAllergens, p1Line, p2Line };
}

export function buildChatSystemPrompt(
  pantryItems: Array<{ name: string; quantity: string; category?: string; quantityValue?: number | null; quantityUnit?: string; addedByPartnerSlot?: number }>,
  profiles: PartnerContext[],
  dietRulesPrompt?: string,
  mode?: MealGenerationMode,
): string {
  const pantryList = pantryItems.map((i) => {
    const qty = i.quantityValue && i.quantityUnit ? `${i.quantityValue} ${i.quantityUnit}` : (i.quantity || '');
    const parts: string[] = [];
    if (qty) parts.push(qty);
    if (i.category) parts.push(i.category);
    if (i.addedByPartnerSlot) {
      parts.push(i.addedByPartnerSlot === 1 ? 'added by Partner 1' : 'added by Partner 2');
    }
    return `${i.name}${parts.length > 0 ? ` (${parts.join(', ')})` : ''}`;
  }).join(', ') || 'empty';

  const p1 = profiles.find((p) => p.slot === 1);
  const p2 = profiles.find((p) => p.slot === 2);
  const { combinedList, hasAllergens, p1Line, p2Line } = buildAllergenList(profiles);

  const hasBothTdee = p1?.tdee && p2?.tdee;
  const hasAnyGoal = p1?.goal || p2?.goal;

  let pantryRule: string;
  if (mode === 'generate_freely') {
    pantryRule = `- Ignore the pantry entirely. Generate a fresh meal and mark every ingredient as have=false. Put ALL ingredients in addToList so the user can buy them.`;
  } else if (mode === 'cook_from_pantry') {
    pantryRule = `- The user wants to cook ONLY from what is in the pantry. You MUST use ONLY ingredients that are listed in the pantry above, plus free staples (water, salt, pepper, cooking oil, olive oil). Do NOT include ANY other ingredient — not even "just a little" of something they don't have. Every ingredient you list must have have=true (or be one of those free staples). If a complete, realistic meal genuinely cannot be made from the pantry plus those free staples, do NOT invent a meal — reply with a short message naming the 1-2 items you would need to add, and OMIT the "meal" object entirely. Never use addToList in this mode.`;
  } else {
    pantryRule = `- Prioritize using pantry ingredients. When listing ingredients, mark have=true if in pantry, have=false if missing.`;
  }

  return `You are CookTwo's meal planner for couples. Your job is to help them decide what to cook together based on what they have and what they need.

Pantry: ${pantryList}
${p1Line}
${p2Line}

Rules:
- Be concise and direct. No greetings, no filler, no small talk. Get to the point.
${pantryRule}
- If the user's request is vague and you need to decide between multiple good options, ask ONE brief question (cuisine preference? time limit? spice level?).
- When you suggest a meal, include the full meal object in your response.
- If ingredients are missing, put them in addToList so the user can buy them.
- If the user says they bought something or have it, put it in addToPantry.
- Every meal must work for BOTH partners' dietary requirements. If one is vegetarian, the meal is vegetarian.
- Keep total cook time under 30 minutes unless the user asks for something specific.
${hasAllergens ? `- STRICTLY AVOID any trace of these allergens: ${combinedList}. This is critical — meals must be 100% free of these items. Also avoid known derivatives: if an allergen is on the list, its oils, flours, butters, and extracts are also forbidden.` : ''}
${hasAnyGoal ? `- Respect each partner's body goal when choosing meals and portions (higher protein for muscle gain, lower calorie density for weight loss, balanced for maintenance). This is critical.` : ''}
${hasBothTdee ? `- When both partners have calorie targets, include plating instructions with different portion sizes for each partner.\n- Use the same recipe but adjust quantities so each person hits their target calories.` : ''}
${dietRulesPrompt ? `\n${dietRulesPrompt}` : ''}

Response format — you MUST respond with valid JSON only, no markdown:
{
  "message": "Your response to the user (2-3 sentences max, be direct)",
  "meal": {
    "name": "Recipe Name",
    "description": "Brief appetizing description",
    "timeMinutes": 25,
    "calories": 500,
    "protein": 35,
    "carbs": 45,
    "fat": 15,
    "sodium_mg": 480,
    "ingredients": [
      {"name": "ingredient name", "have": true, "quantity": "1 cup"},
      {"name": "missing ingredient", "have": false, "quantity": "2 tbsp"}
    ],
    "steps": ["Step 1", "Step 2", "Step 3"]${hasBothTdee ? `,
    "plating": [
      {"partnerSlot": 1, "partnerName": "${p1?.name ?? 'Partner 1'}", "targetCalories": ${p1?.tdee?.targetCalories ?? 0}, "plate": "4oz protein over greens, 1/2 cup rice", "protein": 35, "carbs": 30, "fat": 12},
      {"partnerSlot": 2, "partnerName": "${p2?.name ?? 'Partner 2'}", "targetCalories": ${p2?.tdee?.targetCalories ?? 0}, "plate": "6oz protein, 1 cup rice, side vegetables", "protein": 50, "carbs": 55, "fat": 15}
    ]` : ''}
  },
  "actions": {
    "addToPantry": ["item they just bought"],
    "addToList": ["item they need to buy"]
  }
}

Only include "meal" when you are suggesting a specific recipe. Only include "actions" when there are items to add. If you are just asking a question or clarifying, only include "message".`;
}

async function callDeepSeekChat(
  env: Env,
  systemPrompt: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMessage: string,
): Promise<string | null> {
  const provider = (env.AI_PROVIDER || 'deepseek') as keyof typeof MODEL_CHAINS;
  const models = MODEL_CHAINS[provider] || MODEL_CHAINS.deepseek;

  const messages: Array<{ role: string; content: string }> = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ];

  for (const model of models) {
    try {
      const config = PROVIDER_CONFIG[provider as 'alibaba' | 'zai' | 'deepseek'];
      const apiKey = (env as unknown as Record<string, unknown>)[config.secretRef] as string;

      if (!apiKey) {
        console.error(`Missing API key for ${provider}: ${config.secretRef}`);
        continue;
      }

      const res = await fetch(config.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [config.authHeader]: `${config.authPrefix} ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          max_tokens: 2048,
          messages,
          ...(provider === 'deepseek' ? { thinking: { type: 'disabled' } } : {}),
        }),
      });

      if (!res.ok) {
        const errorBody = await res.text().catch(() => 'no error body');
        console.error(`Chat call failed for model ${model}: ${res.status}`, errorBody);
        continue;
      }

      const data = (await res.json()) as { choices: Array<{ message: { content: string } }> };
      const text = data.choices?.[0]?.message?.content ?? '';
      console.log(`AI response from ${model}:`, text.substring(0, 200) + '...');
      if (text) return text;
    } catch (err) {
      console.error(`Chat model ${model} failed:`, err);
    }
  }

  return null;
}

export async function chatWithAI(
  env: Env,
  pantryItems: Array<{ name: string; quantity: string; category?: string; quantityValue?: number | null; quantityUnit?: string }>,
  profiles: PartnerContext[],
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMessage: string,
  dietRulesPrompt?: string,
  dietClassifierTerms?: Record<string, string>,
  dietRestrictedGroups?: Set<string>,
  mode?: MealGenerationMode,
  dietMacroTargets?: MacroTargets,
): Promise<ChatResponse> {
  const systemPrompt = buildChatSystemPrompt(pantryItems, profiles, dietRulesPrompt, mode);
  const raw = await callDeepSeekChat(env, systemPrompt, history, userMessage);

  if (!raw) {
    return { message: 'I couldn\'t reach the AI right now. Please try again in a moment.' };
  }

  console.log('Raw AI response (first 500 chars):', raw.substring(0, 500));

  function handleParsedResponse(parsed: ChatResponse): ChatResponse | null {
    if (!parsed.message || typeof parsed.message !== 'string') return null;
    if (parsed.meal) parsed.meal = normalizeMeal(parsed.meal);
    if (parsed.meal && profiles.length > 0) {
      if (!assertMealIsSafe(parsed.meal, profiles)) {
        console.log('Meal blocked by safety guard (allergen violation)');
        return { message: 'The generated meal contains ingredients that conflict with one or more partner allergies. Please try a different request or rephrase what you\'re looking for.' };
      }
      if (dietClassifierTerms && dietRestrictedGroups && dietRestrictedGroups.size > 0) {
        if (!assertMealCompliesWithDiet(parsed.meal, dietClassifierTerms, dietRestrictedGroups)) {
          console.log('Meal blocked by diet compliance guard');
          return { message: 'The generated meal contains ingredients that conflict with the selected dietary preferences. Please try a different request.' };
        }
      }
      if (dietMacroTargets && !assertMealMeetsTargets(parsed.meal, dietMacroTargets)) {
        console.log('Meal blocked by health-condition numeric target guard');
        return { message: 'The generated meal exceeds one or more health-condition limits (sodium or carbohydrates). Please ask for a lower-sodium or lower-carb option.' };
      }
    }
    return parsed;
  }

  // Try 1: Parse raw text directly as JSON
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as ChatResponse;
      const handled = handleParsedResponse(parsed);
      if (handled) {
        console.log('Parsed AI response successfully (raw). Message:', parsed.message.substring(0, 100));
        return handled;
      }
    }
  } catch {
    console.log('Raw JSON parse failed, trying markdown cleanup...');
  }

  // Try 2: Strip markdown code blocks and try again
  try {
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const jsonMatch2 = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch2) {
      const parsed = JSON.parse(jsonMatch2[0]) as ChatResponse;
      const handled = handleParsedResponse(parsed);
      if (handled) {
        console.log('Parsed AI response successfully (cleaned). Message:', parsed.message.substring(0, 100));
        return handled;
      }
    }
  } catch (err) {
    console.error('Cleaned JSON parse also failed:', err);
    console.error('Raw text that failed:', raw.substring(0, 500));
  }

  // Try 3: If it looks like plain text (not JSON), return it as a message — no meal
  // This means the AI responded with text but not in the expected JSON format
  console.log('Returning raw text as plain message (no structured meal data)');
  return { message: raw.substring(0, 1000) };
}
