import { describe, it, expect } from 'vitest';
import { createTestD1 } from './helpers';
import { createPartner, getPartners, updatePartner } from '../routes/profiles';
import { getCoupleDietRules, mergeMacroTargets } from '../lib/diet-rules';
import { assertMealMeetsTargets, dietTokenMatchesTerm, getDietViolations, isExemptByDietMarker } from '../lib/ai';

function seedCondition(
  db: D1Database,
  key: string,
  opts: {
    aiRules?: string;
    restrictedGroups?: string[];
    classifierTerms?: Record<string, string>;
    macroTargets?: Record<string, number>;
  },
) {
  return db.prepare(
    'UPDATE diet_catalog SET ai_rules = ?, restricted_groups = ?, classifier_terms = ?, macro_targets = ? WHERE diet_key = ?',
  )
    .bind(
      opts.aiRules ?? '',
      JSON.stringify(opts.restrictedGroups ?? []),
      JSON.stringify(opts.classifierTerms ?? {}),
      JSON.stringify(opts.macroTargets ?? {}),
      key,
    )
    .run();
}

describe('Health-condition diets', () => {
  it('merges macro targets strictest-wins across stacked conditions', () => {
    const merged = mergeMacroTargets([
      { sodium_mg_meal_max: 500, fiber_g_day_min: 25 },
      { sodium_mg_meal_max: 600, carbs_g_meal_max: 60, fiber_g_day_min: 30 },
    ]);

    expect(merged.sodium_mg_meal_max).toBe(500);
    expect(merged.carbs_g_meal_max).toBe(60);
    expect(merged.fiber_g_day_min).toBe(30);
  });

  it('combines classifier terms and prompt rules for stacked conditions', async () => {
    const db = createTestD1();
    await seedCondition(db, 'gluten-free', {
      aiRules: 'NO GLUTEN',
      restrictedGroups: ['wheat'],
      classifierTerms: { bread: 'wheat', pasta: 'wheat' },
      macroTargets: { gluten_ppm_max: 0 },
    });
    await seedCondition(db, 'diabetes-friendly', {
      aiRules: 'LOW GI CARBS',
      restrictedGroups: ['added-sugar'],
      classifierTerms: { sugar: 'added-sugar' },
      macroTargets: { carbs_g_meal_max: 60 },
    });

    const rules = await getCoupleDietRules(db, 'omnivore', 'omnivore', null, null, ['gluten-free', 'diabetes-friendly'], []);

    expect(rules.combinedRestrictedGroups.has('wheat')).toBe(true);
    expect(rules.combinedRestrictedGroups.has('added-sugar')).toBe(true);
    expect(rules.combinedClassifierTerms.bread).toBe('wheat');
    expect(rules.combinedClassifierTerms.sugar).toBe('added-sugar');
    expect(rules.combinedMacroTargets.carbs_g_meal_max).toBe(60);
    expect(rules.promptBlock).toContain('Partner 1 health condition (Gluten-Free)');
    expect(rules.promptBlock).toContain('Partner 1 health condition (Diabetes-Friendly)');
  });

  it('does not apply one partner conditions to the other partner prompt', async () => {
    const db = createTestD1();
    await seedCondition(db, 'low-sodium', { aiRules: 'LOW SODIUM RULE' });

    const rules = await getCoupleDietRules(db, 'omnivore', 'omnivore', null, null, ['low-sodium'], []);

    expect(rules.promptBlock).toContain('Partner 1 health condition (Low-Sodium / Heart)');
    expect(rules.promptBlock).not.toContain('Partner 2 health condition');
  });

  it('blocks meals that exceed carbohydrate or sodium ceilings', () => {
    const meal = {
      name: 'Salty Pasta',
      description: 'test',
      timeMinutes: 10,
      calories: 700,
      protein: 25,
      carbs: 80,
      fat: 20,
      sodiumMg: 900,
      ingredients: [],
      steps: [],
    };

    expect(assertMealMeetsTargets(meal, { carbs_g_meal_max: 60, sodium_mg_meal_max: 500 })).toBe(false);
    expect(assertMealMeetsTargets({ ...meal, carbs: 45, sodiumMg: 400 }, { carbs_g_meal_max: 60, sodium_mg_meal_max: 500 })).toBe(true);
  });

  it('matches diet terms by whole phrase, not substring', () => {
    expect(dietTokenMatchesTerm('soy sauce', 'soy sauce')).toBe(true);
    expect(dietTokenMatchesTerm('tomato sauce', 'soy sauce')).toBe(false);
    expect(dietTokenMatchesTerm('brown rice', 'rice')).toBe(true);
    expect(dietTokenMatchesTerm('rice flour', 'rice')).toBe(true);
    expect(dietTokenMatchesTerm('ricevinegar', 'rice')).toBe(false);
  });

  it('does not flag foods with an explicit free-from label', () => {
    expect(isExemptByDietMarker('gluten-free bread', 'regular-bread')).toBe(true);
    expect(isExemptByDietMarker('low-sodium soy sauce', 'high-sodium-condiments')).toBe(true);
    expect(isExemptByDietMarker('low-sodium soy sauce', 'regular-soy-sauce')).toBe(false);
    expect(isExemptByDietMarker('sourdough bread', 'regular-bread')).toBe(false);
  });

  it('flags restricted diet ingredients in a generated meal', async () => {
    const db = createTestD1();
    await seedCondition(db, 'gluten-free', {
      restrictedGroups: ['wheat'],
      classifierTerms: { bread: 'wheat' },
    });

    const rules = await getCoupleDietRules(db, 'omnivore', 'omnivore', null, null, ['gluten-free'], []);
    const meal = {
      name: 'Garlic Bread Chicken',
      description: 'test',
      timeMinutes: 10,
      calories: 500,
      protein: 30,
      carbs: 40,
      fat: 20,
      ingredients: [{ name: 'sourdough bread', have: true, quantity: '2 slices' }],
      steps: [],
    };

    expect(getDietViolations(meal, rules.combinedClassifierTerms, rules.combinedRestrictedGroups)).toContain('bread → wheat');
  });

  it('persists conditions per partner and normalizes legacy gluten-free diet', async () => {
    const db = createTestD1();
    await createPartner(db, 'hh-cond', 'p1', 1, 'Ada');
    await createPartner(db, 'hh-cond', 'p2', 2, 'Ben');

    await updatePartner(db, 'p1', { conditions: ['low-sodium', 'bone-health'] });
    await updatePartner(db, 'p2', { diet: 'gluten-free' });

    const partners = await getPartners(db, 'hh-cond');
    const p1 = partners.find((p) => p.id === 'p1')!;
    const p2 = partners.find((p) => p.id === 'p2')!;

    expect(p1.conditions).toEqual(['bone-health', 'low-sodium']);
    expect(p1.diet).toBe('omnivore');
    expect(p2.diet).toBe('omnivore');
    expect(p2.conditions).toEqual(['gluten-free']);
  });
});
