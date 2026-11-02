import { describe, expect, it } from 'vitest';
import { FALLBACK_DIET_OPTIONS, groupDietOptions, normalizeCategoryKey } from '../dietCatalog';

describe('dietCatalog fallback', () => {
  it('has 26 entries: 22 patterns and 4 conditions', () => {
    expect(FALLBACK_DIET_OPTIONS).toHaveLength(26);
    expect(FALLBACK_DIET_OPTIONS.filter((d) => !d.isCondition)).toHaveLength(22);
    expect(FALLBACK_DIET_OPTIONS.filter((d) => d.isCondition)).toHaveLength(4);
  });

  it('normalizes category aliases', () => {
    expect(normalizeCategoryKey('plantBased')).toBe('plant-based');
    expect(normalizeCategoryKey('macronutrient')).toBe('macronutrient-focused');
    expect(normalizeCategoryKey('balanced')).toBe('balanced');
  });

  it('merges plantBased and plant-based into one group', () => {
    const groups = groupDietOptions(FALLBACK_DIET_OPTIONS.filter((d) => !d.isCondition));
    const plantGroups = groups.filter((g) => g.label === 'Plant-forward');
    expect(plantGroups).toHaveLength(1);
    expect(plantGroups[0]?.diets.map((d) => d.dietKey)).toEqual(
      expect.arrayContaining(['vegan', 'vegetarian', 'pescatarian', 'mcdougall', 'plant-based']),
    );
  });

  it('defaults sort first within their group', () => {
    const groups = groupDietOptions(FALLBACK_DIET_OPTIONS.filter((d) => !d.isCondition));
    const balanced = groups.find((g) => g.key === 'balanced');
    expect(balanced?.diets[0]?.isDefault).toBe(true);
  });

  it('excludes conditions from base-diet groups', () => {
    const keys = groupDietOptions(FALLBACK_DIET_OPTIONS.filter((d) => !d.isCondition)).flatMap(
      (g) => g.diets.map((d) => d.dietKey),
    );
    expect(keys).not.toContain('gluten-free');
    expect(keys).toHaveLength(22);
  });
});
