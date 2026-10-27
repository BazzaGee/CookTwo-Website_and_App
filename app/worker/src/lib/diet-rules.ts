export type MacroTargets = Record<string, number | string | Array<number | string>>;

export interface DietRules {
  dietKey: string;
  displayLabel: string;
  aiRules: string;
  restrictedGroups: string[];
  classifierTerms: Record<string, string>;
  macroTargets: MacroTargets;
  easyMatches: string[];
  adaptableMatches: Record<string, string>;
  hardConflicts: Record<string, string>;
}

export interface CoupleDietRules {
  partner1: DietRules | null;
  partner2: DietRules | null;
  partner1Conditions: DietRules[];
  partner2Conditions: DietRules[];
  combinedClassifierTerms: Record<string, string>;
  combinedRestrictedGroups: Set<string>;
  combinedMacroTargets: MacroTargets;
  promptBlock: string;
  conflictNote: string | null;
}

interface DietRow {
  diet_key: string;
  display_label: string;
  ai_rules: string;
  restricted_groups: string;
  classifier_terms: string;
  macro_targets: string;
  easy_matches: string;
  adaptable_matches: string;
  hard_conflicts: string;
}

function rowToRules(row: DietRow): DietRules {
  return {
    dietKey: row.diet_key,
    displayLabel: row.display_label,
    aiRules: row.ai_rules || '',
    restrictedGroups: safeJsonArray(row.restricted_groups),
    classifierTerms: safeJsonObject(row.classifier_terms),
    macroTargets: safeJsonObject(row.macro_targets) as MacroTargets,
    easyMatches: safeJsonArray(row.easy_matches),
    adaptableMatches: safeJsonObject(row.adaptable_matches),
    hardConflicts: safeJsonObject(row.hard_conflicts),
  };
}

function safeJsonArray(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function safeJsonObject<T extends Record<string, unknown> = Record<string, string>>(s: string): T {
  try {
    const v = JSON.parse(s);
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as T) : ({} as T);
  } catch {
    return {} as T;
  }
}

const RULE_COLS = `diet_key, display_label, ai_rules, restricted_groups,
  classifier_terms, macro_targets, easy_matches, adaptable_matches, hard_conflicts`;

export async function getDietRules(db: D1Database, dietKey: string): Promise<DietRules | null> {
  const row = await db.prepare(
    `SELECT ${RULE_COLS} FROM diet_catalog WHERE diet_key = ?`,
  ).bind(dietKey).first<DietRow>();

  if (!row) return null;
  return rowToRules(row);
}

/**
 * Merge numeric targets across a partner's diet + stacked conditions and the
 * other partner. Ceilings take the strictest (minimum) value, floors take the
 * highest requirement, and the last non-numeric value wins per key.
 */
export function mergeMacroTargets(targetsList: MacroTargets[]): MacroTargets {
  const out: MacroTargets = {};

  for (const targets of targetsList) {
    for (const [key, value] of Object.entries(targets ?? {})) {
      if (typeof value !== 'number') {
        if (!(key in out)) out[key] = value;
        continue;
      }
      const existing = out[key];
      if (typeof existing !== 'number') {
        out[key] = value;
        continue;
      }
      if (key.endsWith('_max') || key.endsWith('_ceiling')) {
        out[key] = Math.min(existing, value);
      } else if (key.endsWith('_min')) {
        out[key] = Math.max(existing, value);
      } else {
        out[key] = value;
      }
    }
  }

  return out;
}

export async function getCoupleDietRules(
  db: D1Database,
  diet1: string,
  diet2: string,
  fastingMode1?: string | null,
  fastingMode2?: string | null,
  conditionKeys1: string[] = [],
  conditionKeys2: string[] = [],
): Promise<CoupleDietRules> {
  const partner1 = await getDietRules(db, diet1);
  const partner2 = diet1 === diet2 ? partner1 : await getDietRules(db, diet2);

  const partner1Conditions = (await Promise.all(
    unique(conditionKeys1).map((key) => getDietRules(db, key)),
  )).filter((r): r is DietRules => r !== null);

  const partner2Conditions = (await Promise.all(
    unique(conditionKeys2).map((key) => getDietRules(db, key)),
  )).filter((r): r is DietRules => r !== null);

  // A partner's effective ruleset: primary lifestyle diet + stacked conditions.
  const p1Rules = [partner1, ...partner1Conditions].filter((r): r is DietRules => r !== null);
  const p2Rules = [partner2, ...partner2Conditions].filter((r): r is DietRules => r !== null);

  const combinedClassifierTerms: Record<string, string> = {};
  const combinedRestrictedGroups = new Set<string>();

  for (const rules of [...p1Rules, ...p2Rules]) {
    for (const group of rules.restrictedGroups) {
      combinedRestrictedGroups.add(group);
    }
  }

  for (const rules of [...p1Rules, ...p2Rules]) {
    for (const [term, group] of Object.entries(rules.classifierTerms)) {
      const existing = combinedClassifierTerms[term];
      if (!existing) {
        combinedClassifierTerms[term] = group;
      } else if (existing !== group) {
        // A term may be classified differently by two rulesets. Prefer the
        // classification that is actually restricted so the hard guard still
        // blocks it.
        const existingRestricted = combinedRestrictedGroups.has(existing);
        const nextRestricted = combinedRestrictedGroups.has(group);
        if (!existingRestricted && nextRestricted) {
          combinedClassifierTerms[term] = group;
        }
      }
    }
  }

  const combinedMacroTargets = mergeMacroTargets([
    ...p1Rules.map((r) => r.macroTargets),
    ...p2Rules.map((r) => r.macroTargets),
  ]);

  let promptBlock = buildPromptBlock(partner1, partner2, partner1Conditions, partner2Conditions);
  let conflictNote = detectConflictAny(p1Rules, p2Rules);

  if (fastingMode1 || fastingMode2) {
    const ifRules = await getDietRules(db, 'intermittent-fasting');
    if (ifRules?.aiRules) {
      const fastingDesc = [
        fastingMode1 ? `Partner 1 fasts: ${fastingMode1}` : null,
        fastingMode2 ? `Partner 2 fasts: ${fastingMode2}` : null,
      ].filter(Boolean).join('\n');
      const ifSection = `INTERMITTENT FASTING — TIMING RULES\n${fastingDesc}\n\n${ifRules.aiRules}`;
      promptBlock = promptBlock ? `${promptBlock}\n\n${ifSection}` : ifSection;
    }
  }

  return {
    partner1,
    partner2,
    partner1Conditions,
    partner2Conditions,
    combinedClassifierTerms,
    combinedRestrictedGroups,
    combinedMacroTargets,
    promptBlock,
    conflictNote,
  };
}

function unique(keys: string[]): string[] {
  return [...new Set(keys.map((k) => k.trim()).filter(Boolean))];
}

function buildPromptBlock(
  p1: DietRules | null,
  p2: DietRules | null,
  p1Conditions: DietRules[],
  p2Conditions: DietRules[],
): string {
  const parts: string[] = [];

  if (p1?.aiRules) {
    parts.push(`Partner 1 diet (${p1.displayLabel}):\n${p1.aiRules}`);
  }
  if (p2?.aiRules && (!p1 || p2.dietKey !== p1.dietKey)) {
    parts.push(`Partner 2 diet (${p2.displayLabel}):\n${p2.aiRules}`);
  }

  for (const condition of p1Conditions) {
    if (condition.aiRules) {
      parts.push(`Partner 1 health condition (${condition.displayLabel}):\n${condition.aiRules}`);
    }
  }
  for (const condition of p2Conditions) {
    if (condition.aiRules) {
      parts.push(`Partner 2 health condition (${condition.displayLabel}):\n${condition.aiRules}`);
    }
  }

  const conflict = detectConflictAny(
    [p1, ...p1Conditions].filter((r): r is DietRules => r !== null),
    [p2, ...p2Conditions].filter((r): r is DietRules => r !== null),
  );
  if (conflict) {
    parts.push(`COUPLE CONFLICT NOTE: ${conflict}`);
  }

  return parts.join('\n\n');
}

function detectConflictAny(p1Rules: DietRules[], p2Rules: DietRules[]): string | null {
  for (const a of p1Rules) {
    for (const b of p2Rules) {
      if (a.dietKey === b.dietKey) continue;

      const conflictAB = a.hardConflicts[b.dietKey];
      const conflictBA = b.hardConflicts[a.dietKey];

      if (conflictAB) return `${a.displayLabel} + ${b.displayLabel}: ${conflictAB}`;
      if (conflictBA) return `${b.displayLabel} + ${a.displayLabel}: ${conflictBA}`;
    }
  }

  return null;
}
