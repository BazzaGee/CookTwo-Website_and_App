# App Integration Plan — Adding 17 Diets to Cupla

> This document specifies all code changes needed to expand Cupla's diet system from 7 basic diets to 17+ diets with deep, research-backed AI meal generation.

---

## Current State

Cupla currently has **7 diet values** defined as a TypeScript union type:

```typescript
type Diet = 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo' | 'gluten-free';
```

Defined in **two places** (not shared):
- `worker/src/routes/profiles.ts:5` (backend)
- `frontend/src/hooks/useProfiles.ts:6` (frontend)

**Problems with the current system:**
1. ❌ Only 7 basic diets — missing 10+ diets users want (Mediterranean, DASH, MIND, FODMAP, etc.)
2. ❌ `gluten-free` is an allergen, not a diet — conflates two concepts
3. ❌ No programmatic diet-compliance checking (only allergen checking via `assertMealIsSafe`)
4. ❌ Diet is just a string injected into AI prompts — no structured rules
5. ❌ Intermittent fasting can't be represented (it's a timing pattern, not a food choice)
6. ❌ No couple-compatibility logic for divergent diets
7. ❌ Diet type is duplicated (not shared between frontend and backend)

---

## Target State

### New Diet Type (Expanded)

```typescript
// diets.ts — NEW shared module (imported by both worker and frontend)

export const DIET_CATEGORIES = {
  balanced: 'Balanced & Evidence-Based',
  plantBased: 'Plant-Based',
  lowCarb: 'Low-Carbohydrate',
  ancestral: 'Whole-Food & Ancestral',
  therapeutic: 'Therapeutic & Clinical',
  timing: 'Timing Patterns',
} as const;

export type DietKey =
  // Existing (kept for backward compat)
  | 'omnivore'
  | 'pescatarian'
  | 'gluten-free'          // Note: reclassify as allergen overlay

  // Balanced & Evidence-Based
  | 'mediterranean'         // NEW
  | 'dash'                  // NEW
  | 'mind'                  // NEW

  // Plant-Based
  | 'vegetarian'            // Existing
  | 'vegan'                 // Existing
  | 'plant-based'           // NEW
  | 'flexitarian'           // NEW
  | 'mcdougall'             // NEW
  | 'macrobiotic'           // NEW
  | 'hclf-811'              // NEW

  // Low-Carbohydrate
  | 'keto'                  // Existing
  | 'high-protein'          // NEW
  | 'carnivore'             // NEW

  // Whole-Food & Ancestral
  | 'paleo'                 // Existing
  | 'whole30'               // NEW

  // Therapeutic
  | 'low-fodmap'            // NEW
  | 'pritikin'              // NEW
  | 'volumetrics'           // NEW

  // Timing (separate dimension — see below)
  // Handled via fastingMode, not DietKey
;

export type FastingMode =
  | 'none'
  | '16-8'      // 16:8 daily time-restricted eating
  | '18-6'      // 18:6
  | '5-2'       // 5:2 (eat 5 days, restrict 2)
  | 'eat-stop-eat' // 24h fasts 1-2x/week
  | 'omad';     // One meal a day
```

---

## Change 1: Create a Shared Diets Module

### New file: `worker/src/lib/diets.ts`

This module replaces the bare union type with a **structured diet database** that encodes all the research from this library:

```typescript
export interface DietDefinition {
  key: DietKey;
  label: string;                    // Display name
  category: keyof typeof DIET_CATEGORIES;
  emoji: string;                    // For UI
  shortDescription: string;         // One-liner for UI
  allowedFoodGroups: string[];      // For programmatic validation
  restrictedFoodGroups: string[];   // For programmatic validation
  macroTargets?: {
    carbPct?: [number, number];     // [min, max] as % of calories
    proteinPct?: [number, number];
    fatPct?: [number, number];
  };
  aiInstructions: string;           // Injected into meal-generation prompt
  sodiumRestriction?: 'low' | 'moderate' | 'none';
  evidenceGrade: 'A' | 'B' | 'C' | 'D';
  coupleCompatibilityNotes?: string;
  specialPhases?: boolean;          // true for elimination diets (FODMAP, Whole30)
}

export const DIETS: Record<DietKey, DietDefinition> = {
  mediterranean: {
    key: 'mediterranean',
    label: 'Mediterranean',
    category: 'balanced',
    emoji: '🫒',
    shortDescription: 'Olive oil, fish, whole grains — the gold-standard for longevity',
    allowedFoodGroups: ['vegetables', 'fruits', 'whole-grains', 'legumes', 'nuts', 'seeds', 'olive-oil', 'fish', 'seafood', 'poultry', 'eggs', 'dairy-moderate', 'wine-moderate'],
    restrictedFoodGroups: ['refined-sugar', 'refined-grains', 'processed-meat', 'fast-food'],
    macroTargets: { carbPct: [40, 50], proteinPct: [15, 20], fatPct: [30, 40] },
    aiInstructions: 'Emphasize extra virgin olive oil as primary fat. Include fish/seafood 2+ times per week. Base meals on vegetables, whole grains, and legumes. Moderate red wine optional. Minimize red meat to a few times per month.',
    sodiumRestriction: 'moderate',
    evidenceGrade: 'A',
    // ... (full spec from diets/01_Mediterranean/05_App_Encoding_Spec.md)
  },
  // ... all 20 diets
};
```

> **Source of truth:** Each diet's `05_App_Encoding_Spec.md` file contains the complete `DietDefinition` data. Developers should copy from those specs when populating this module.

---

## Change 2: Update the Database Schema

### New migration: `worker/migrations/0007_diet_expansion.sql`

```sql
-- 0007_diet_expansion.sql
-- Expands diet system: adds fasting mode, diet metadata, and couples-compatibility

-- Add fasting mode column (orthogonal timing dimension)
ALTER TABLE partners ADD COLUMN fasting_mode TEXT NOT NULL DEFAULT 'none';

-- Add diet phase for elimination diets (FODMAP, Whole30)
ALTER TABLE partners ADD COLUMN diet_phase TEXT NOT NULL DEFAULT '';

-- Optional: diet metadata table for richer storage (alternative to hardcoded TS)
CREATE TABLE IF NOT EXISTS diet_metadata (
  diet_key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  allowed_groups TEXT NOT NULL,      -- JSON array
  restricted_groups TEXT NOT NULL,    -- JSON array
  macro_targets TEXT,                 -- JSON object
  ai_instructions TEXT NOT NULL,
  evidence_grade TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Backward compat: 'gluten-free' diet users → keep but also set allergen
-- (Migration script to handle existing data)
UPDATE partners SET diet = 'omnivore' WHERE diet = 'gluten-free';
-- Then add gluten to partner_allergens for those users
INSERT INTO partner_allergens (partner_id, allergen, severity)
SELECT p.id, 'gluten', 'allergy'
FROM partners p
WHERE p.diet = 'omnivore'
  AND p.id NOT IN (SELECT partner_id FROM partner_allergens WHERE allergen = 'gluten');
```

---

## Change 3: Update the UI — ProfilesTab.tsx

### File: `frontend/src/pages/ProfilesTab.tsx`

Replace the flat `<select>` dropdown with a **categorized, searchable diet picker**:

```tsx
// BEFORE (line 7):
const DIETS: readonly Diet[] = ['omnivore', ...7 values];

// AFTER:
import { DIETS, DIET_CATEGORIES, FASTING_MODES } from '@/lib/diets';

// Group diets by category for display
const groupedDiets = Object.entries(DIET_CATEGORIES).map(([catKey, catLabel]) => ({
  category: catLabel,
  diets: Object.values(DIETS).filter(d => d.category === catKey),
}));
```

**UI changes:**
1. Replace `<select>` with a modal/bottom-sheet showing categorized diets
2. Add a secondary "Fasting Schedule" selector (16:8, 5:2, etc.) — separate from food diet
3. Show evidence grade badge (A/B/C/D) next to each diet
4. Show short description under each diet name
5. For elimination diets (FODMAP, Whole30), show phase selector

---

## Change 4: Enhance AI Prompt Logic — ai.ts

### File: `worker/src/lib/ai.ts`

Currently, the diet is just a string in the prompt. Enhance `buildPrompt()` to inject **structured diet rules**:

```typescript
// BEFORE: "Partner 1 diet: vegan"
// AFTER:
function buildDietContext(dietKey: DietKey): string {
  const diet = DIETS[dietKey];
  if (!diet) return 'No specific dietary restrictions.';

  return [
    `DIET: ${diet.label}`,
    `ALLOWED: ${diet.allowedFoodGroups.join(', ')}`,
    `AVOID: ${diet.restrictedFoodGroups.join(', ')}`,
    diet.macroTargets ? `TARGET MACROS: Carbs ${diet.macroTargets.carbPct}%, Protein ${diet.macroTargets.proteinPct}%, Fat ${diet.macroTargets.fatPct}%` : '',
    diet.sodiumRestriction === 'low' ? 'SODIUM: Keep under 1500mg per serving' : '',
    `RULES: ${diet.aiInstructions}`,
  ].filter(Boolean).join('\n');
}
```

### Couple Compatibility Resolution

When two partners have different diets, inject a **compatibility directive**:

```typescript
function buildCoupleCompatibilityDirective(diet1: DietKey, diet2: DietKey): string {
  if (diet1 === diet2) return '';

  const d1 = DIETS[diet1];
  const d2 = DIETS[dietKey2];

  // Find intersection of allowed groups
  const shared = d1.allowedFoodGroups.filter(g => d2.allowedFoodGroups.includes(g));

  // Check for hard conflicts (e.g., vegan + carnivore)
  if (shared.length < 3) {
    return `⚠️ COMPATIBILITY WARNING: These diets (${d1.label} + ${d2.label}) have very little overlap. ` +
           `Generate TWO separate plates from a shared base ingredient. Suggest the simplest shared base.`;
  }

  return `SHARED INGREDIENTS for both partners: ${shared.join(', ')}. ` +
         `Design a single meal where the base works for both, with plating variations if needed.`;
}
```

---

## Change 5: Add Diet-Compliance Safety Guard

### File: `worker/src/lib/ai.ts` (new function near `assertMealIsSafe`, line 231)

Currently, `assertMealIsSafe()` only checks **allergens**. Add a **diet-compliance check**:

```typescript
function assertMealCompliesWithDiet(meal: GeneratedMeal, dietKey: DietKey): void {
  const diet = DIETS[dietKey];
  if (!diet) return;

  for (const ingredient of meal.ingredients) {
    const group = classifyIngredient(ingredient.name); // maps "chicken breast" → "poultry"

    if (diet.restrictedFoodGroups.includes(group)) {
      throw new SafetyError(
        `Ingredient "${ingredient.name}" (${group}) is not allowed on the ${diet.label} diet.`
      );
    }
  }
}
```

This requires an **ingredient classifier** — a mapping from ingredient names to food groups:

```typescript
// new file: worker/src/lib/food-classifier.ts
const INGREDIENT_TO_GROUP: Record<string, string> = {
  // Proteins
  'chicken': 'poultry', 'turkey': 'poultry', 'beef': 'red-meat',
  'pork': 'red-meat', 'salmon': 'fish', 'tuna': 'fish',
  'shrimp': 'seafood', 'tofu': 'soy', 'tempeh': 'soy',
  'black beans': 'legumes', 'lentils': 'legumes', 'chickpeas': 'legumes',
  // Grains
  'rice': 'whole-grains', 'quinoa': 'whole-grains', 'oats': 'whole-grains',
  'pasta': 'refined-grains', 'white bread': 'refined-grains',
  // ... hundreds of mappings, or use AI/LLM classification
};
```

> **Alternative approach:** Instead of a static classifier, add a post-generation validation step that asks the AI model to verify diet compliance. This is more flexible but slower.

---

## Change 6: Handle Fasting Mode

### New field: `partners.fasting_mode`

Intermittent fasting is a **timing pattern**, not a food restriction. It should be:
1. A separate column (`fasting_mode`) on the partners table
2. A separate UI selector (independent of food diet)
3. Injected into meal-plan generation to control **meal timing** (e.g., skip breakfast for 16:8)

In `worker/src/routes/mealplan.ts`:
```typescript
// When generating a weekly plan, respect fasting windows
if (partner.fastingMode === '16-8') {
  // Skip breakfast slot, generate lunch + dinner only
  // Or generate a late "breakfast" at 12pm
}
```

---

## Change 7: Handle Elimination Diet Phases

### Diets affected: Low FODMAP, Whole30

These diets have **phases**:
- **Low FODMAP:** Elimination (2-6 weeks) → Reintroduction (6-8 weeks) → Personalization
- **Whole30:** 30-day elimination → Reintroduction

Add a `diet_phase` field:
```typescript
// For low-fodmap:
dietPhase: 'elimination' | 'reintroduction' | 'personalized'

// For whole30:
dietPhase: 'elimination' | 'reintroduction' | 'complete'
```

The AI prompt should change based on the phase — during reintroduction, the app should track which foods are being tested and their symptoms.

---

## Implementation Priority

| Phase | Changes | Effort |
|-------|---------|--------|
| **Phase 1** | Expand Diet type (Change 1) + UI dropdown (Change 3) | Medium — expand the union, add categories to UI |
| **Phase 2** | AI prompt enhancement (Change 4) — inject structured rules | Medium — rewrite buildPrompt() |
| **Phase 3** | Diet-compliance safety guard (Change 5) | Large — requires food classifier |
| **Phase 4** | Fasting mode (Change 6) | Medium — new field + meal-plan timing logic |
| **Phase 5** | Elimination phases (Change 7) | Large — state machine for FODMAP/Whole30 |
| **Phase 6** | Couple compatibility matrix (Change 4) | Medium — precompute compatibility |

---

## File Change Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `worker/src/routes/profiles.ts` | **Modify** | Replace bare `Diet` type with import from `diets.ts`; add `fasting_mode`, `diet_phase` |
| `worker/src/lib/diets.ts` | **NEW** | Shared diet definitions database |
| `worker/src/lib/food-classifier.ts` | **NEW** | Ingredient → food-group mapping |
| `worker/src/lib/ai.ts` | **Modify** | Enhance `buildPrompt()` with structured diet rules; add `assertMealCompliesWithDiet()` |
| `worker/src/routes/mealplan.ts` | **Modify** | Respect fasting mode in meal timing |
| `worker/migrations/0007_diet_expansion.sql` | **NEW** | Add `fasting_mode`, `diet_phase` columns |
| `frontend/src/hooks/useProfiles.ts` | **Modify** | Import shared `DietKey` type |
| `frontend/src/pages/ProfilesTab.tsx` | **Modify** | Categorized diet picker + fasting selector |
| `frontend/src/lib/diets.ts` | **NEW** | Frontend copy of diet definitions (or shared package) |
| Seeds & tests | **Update** | Update test fixtures and seed data |

---

## Testing Strategy

1. **Unit tests:** Each diet definition should validate against its `05_App_Encoding_Spec.md`
2. **Safety guard tests:** `assertMealCompliesWithDiet()` — verify it rejects forbidden ingredients
3. **AI prompt tests:** Verify `buildPrompt()` generates correct diet rules for each diet
4. **Couple compatibility tests:** Verify the compatibility matrix is respected
5. **Backward compatibility:** Existing users with old diet values should still work

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Existing users with old diet values break | Medium | Migration script handles conversion; keep old values valid |
| AI doesn't follow complex diet rules | Medium | Add safety guard (Change 5) as a backstop |
| Too many diets overwhelms users | Medium | Group by category; show evidence grade; default to common diets |
| Food classifier misses ingredients | High | Use fuzzy matching + LLM fallback classification |
| Elimination diet phases are complex | High | Phase 5 — defer until core diets work |
