import type { Category } from '../durable-objects/HouseholdSync';
import { parsePantryWithAI, type ParsedPantryItem as AIParsedPantryItem } from './ai-pantry-parser';
import { getCachedParse, cacheParse } from './parse-cache';

const KNOWN_BRANDS = new Set([
  'swiss', 'organic', 'whole foods', 'aldi', 'woolworths', 'coles',
  'countdown', 'pams', 'mainland', 'anchor', 'fonterra', 'kelloggs',
  'nestle', 'unilever', 'heinz', 'campbells', 'maggi', 'knorr',
  'sanitarium', 'vitaweet', 'dare', 'moose', 'bega', 'tatura',
  'devondale', 'pauls', 'a2 milk', 'yoplait', 'chobani', 'gippsland',
  'bulla', 'king island', 'cape grim', 'riverine', 'tassal', 'huon',
  'petuna', 'john west', 'sirena', 'mccains', 'simplot', 'birdseye',
]);

const UNIT_MAP: Record<string, string> = {
  'cup': 'cup', 'cups': 'cup', 'tbsp': 'tbsp', 'tsp': 'tsp',
  'lb': 'lb', 'lbs': 'lb', 'oz': 'oz', 'kg': 'kg', 'g': 'g',
  'ml': 'ml', 'l': 'litre', 'litre': 'litre', 'litres': 'litre',
  'liter': 'litre', 'liters': 'litre',
  'piece': 'piece', 'pieces': 'piece', 'slice': 'slice', 'slices': 'slice',
  'can': 'can', 'cans': 'can', 'bag': 'bag', 'bags': 'bag',
  'box': 'box', 'boxes': 'box', 'bottle': 'bottle', 'bottles': 'bottle',
  'jar': 'jar', 'jars': 'jar', 'pack': 'pack', 'packs': 'pack',
  'dozen': 'dozen', 'bunch': 'bunch', 'bunches': 'bunch',
  'head': 'head', 'heads': 'head', 'clove': 'clove', 'cloves': 'clove',
  'stick': 'stick', 'sticks': 'stick',
};

const CATEGORY_KEYWORDS: Array<{ category: Category; words: string[] }> = [
  { category: 'Produce', words: ['apple', 'banana', 'orange', 'lettuce', 'spinach', 'tomato', 'potato', 'onion', 'garlic', 'carrot', 'pepper', 'cucumber', 'broccoli', 'kale', 'mushroom', 'avocado', 'lemon', 'lime', 'berry', 'grape', 'mango', 'peach', 'pear', 'corn', 'zucchini', 'celery', 'ginger', 'herb', 'basil', 'cilantro', 'parsley', 'cabbage', 'pumpkin', 'squash', 'eggplant', 'radish', 'turnip', 'beet', 'asparagus', 'artichoke', 'sprout', 'bean', 'pea', 'olive', 'fig', 'date', 'raisin', 'prune', 'apricot', 'cherry', 'plum', 'melon', 'watermelon', 'cantaloupe', 'honeydew', 'kiwi', 'papaya', 'pomegranate', 'passionfruit', 'dragonfruit', 'lychee', 'rambutan', 'durian', 'jackfruit', 'starfruit', 'persimmon', 'quince', 'elderberry', 'blackberry', 'raspberry', 'blueberry', 'strawberry', 'cranberry', 'gooseberry', 'currant', 'mulberry', 'boysenberry', 'loganberry', 'cloudberry', 'lingonberry', 'huckleberry', 'serviceberry', 'snowberry', 'bearberry', 'crowberry', 'dewberry', 'wineberry', 'salmonberry', 'thimbleberry'] },
  { category: 'Meat', words: ['chicken', 'beef', 'pork', 'turkey', 'lamb', 'fish', 'salmon', 'tuna', 'shrimp', 'bacon', 'sausage', 'ham', 'steak', 'ground', 'fillet', 'breast', 'thigh', 'mince', 'prawn', 'crab', 'lobster', 'clam', 'mussel', 'oyster', 'scallop', 'squid', 'octopus', 'anchovy', 'sardine', 'mackerel', 'trout', 'cod', 'haddock', 'halibut', 'snapper', 'grouper', 'tilapia', 'catfish', 'perch', 'pike', 'bass', 'carp', 'eel', 'shark', 'swordfish', 'marlin', 'mahi', 'wahoo', 'amberjack', 'yellowtail', 'kingfish', 'snook', 'tarpon', 'bonefish', 'permit', 'jack', 'crevalle', 'pompano', 'drum', 'croaker', 'weakfish', 'spot', 'pigfish', 'pinfish', 'sheepshead', 'bream', 'bullhead', 'channel', 'flathead', 'largemouth', 'smallmouth', 'spotted'] },
  { category: 'Dairy', words: ['milk', 'cheese', 'yogurt', 'yoghurt', 'butter', 'cream', 'egg', 'eggs', 'sour cream', 'cottage cheese', 'cheddar', 'mozzarella', 'parmesan', 'feta', 'gouda', 'brie', 'cream cheese', 'kefir', 'ricotta', 'mascarpone', 'provolone', 'swiss', 'american', 'pepper jack', 'monterey jack', 'colby', 'havarti', 'jarlsberg', 'limburger', 'munster', 'romano', 'asiago', 'manchego', 'pecorino', 'cotija', 'queso', 'panela', 'oaxaca', 'asadero', 'chihuahua', 'leche', 'condensada', 'evaporada'] },
  { category: 'Pantry', words: ['rice', 'pasta', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'olive oil', 'vinegar', 'sauce', 'soup', 'canned', 'beans', 'lentils', 'cereal', 'oats', 'bread', 'tortilla', 'honey', 'peanut butter', 'jam', 'tea', 'coffee', 'spice', 'soy sauce', 'sesame oil', 'coconut oil', 'wheat', 'oat', 'quinoa', 'noodle', 'barley', 'bulgur', 'couscous', 'farro', 'millet', 'rye', 'spelt', 'amaranth', 'buckwheat', 'kamut', 'teff', 'triticale', 'wild rice', 'brown rice', 'white rice', 'jasmine rice', 'basmati rice', 'arborio rice', 'sushi rice', 'sticky rice', 'glutinous rice', 'black rice', 'red rice', 'parboiled rice', 'converted rice', 'instant rice', 'quick rice', 'minute rice', 'ready rice', 'microwave rice'] },
];

export interface ParsedPantryItem {
  name: string;
  quantityValue: number | null;
  quantityUnit: string;
  brand: string;
  category: Category;
  isFood: boolean;
  confidence: number;
}

function normalizeUnit(raw: string): string {
  const lower = raw.toLowerCase().trim();
  return UNIT_MAP[lower] || lower;
}

function extractQuantity(text: string): { value: number | null; unit: string; remaining: string } {
  const numericMatch = text.match(/^(\d+(?:\.\d+)?)\s*(cups?|tbsp|tsp|lbs?|oz|kg|g|ml|l(?:itres?|iters?)?|pieces?|slices?|cans?|bags?|boxes?|bottles?|jars?|packs?|dozen|bunches?|heads?|cloves?|sticks?|slices?)\s+(.+)/i);
  if (numericMatch) {
    return {
      value: parseFloat(numericMatch[1]),
      unit: normalizeUnit(numericMatch[2]),
      remaining: numericMatch[3].trim(),
    };
  }

  const suffixNumericMatch = text.match(/(.+?)\s+(\d+(?:\.\d+)?)\s*(cups?|tbsp|tsp|lbs?|oz|kg|g|ml|l(?:itres?|iters?)?|pieces?|slices?|cans?|bags?|boxes?|bottles?|jars?|packs?|dozen|bunches?|heads?|cloves?|sticks?|slices?)$/i);
  if (suffixNumericMatch) {
    return {
      value: parseFloat(suffixNumericMatch[2]),
      unit: normalizeUnit(suffixNumericMatch[3]),
      remaining: suffixNumericMatch[1].trim(),
    };
  }

  const fractionMatch = text.match(/^(half|quarter|third)\s*(?:of\s*)?an?\s+(.+)/i);
  if (fractionMatch) {
    const fractionValues: Record<string, number> = { half: 0.5, quarter: 0.25, third: 0.333 };
    return {
      value: fractionValues[fractionMatch[1].toLowerCase()] ?? null,
      unit: '',
      remaining: fractionMatch[2].trim(),
    };
  }

  const fractionNotationMatch = text.match(/^(\d+)\/(\d+)\s*(cups?|tbsp|tsp|lbs?|oz|kg|g|ml|l(?:itres?|iters?)?|pieces?|slices?|cans?|bags?|boxes?|bottles?|jars?|packs?|dozen|bunches?|heads?|cloves?|sticks?|slices?)?\s*(.+)/i);
  if (fractionNotationMatch) {
    const num = parseInt(fractionNotationMatch[1]);
    const den = parseInt(fractionNotationMatch[2]);
    return {
      value: den > 0 ? num / den : null,
      unit: fractionNotationMatch[3] ? normalizeUnit(fractionNotationMatch[3]) : '',
      remaining: (fractionNotationMatch[4] || '').trim(),
    };
  }

  return { value: null, unit: '', remaining: text };
}

function extractBrand(text: string): { brand: string; remaining: string } {
  const words = text.split(/\s+/);
  const brandWords: string[] = [];
  const remainingWords: string[] = [];

  for (const word of words) {
    const lower = word.toLowerCase();
    if (KNOWN_BRANDS.has(lower)) {
      brandWords.push(word);
    } else if (/^[A-Z]/.test(word) && word.length > 1 && !/^(the|a|an|and|or|but|in|on|at|to|for|of|with|by|from)$/i.test(word)) {
      brandWords.push(word);
    } else {
      remainingWords.push(word);
    }
  }

  return {
    brand: brandWords.join(' '),
    remaining: remainingWords.join(' '),
  };
}

function categorize(name: string): Category {
  const lower = name.toLowerCase();
  for (const { category, words } of CATEGORY_KEYWORDS) {
    if (words.some((w) => lower.includes(w))) return category;
  }
  return 'Other';
}

function calculateRegexConfidence(parsed: { quantityValue: number | null; category: Category; name: string; rawInput: string }): number {
  let score = 0.5;
  if (parsed.quantityValue !== null) score += 0.2;
  if (parsed.category !== 'Other') score += 0.2;
  if (parsed.name.length > 0 && parsed.name !== parsed.rawInput) score += 0.1;
  return Math.min(score, 1.0);
}

function regexParse(raw: string): ParsedPantryItem {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { name: '', quantityValue: null, quantityUnit: '', brand: '', category: 'Other', isFood: true, confidence: 0.3 };
  }

  const { value, unit, remaining } = extractQuantity(trimmed);
  const { brand, remaining: productName } = extractBrand(remaining);
  const category = categorize(productName || trimmed);
  const name = productName || trimmed;

  const confidence = calculateRegexConfidence({ quantityValue: value, category, name, rawInput: trimmed });

  return {
    name,
    quantityValue: value,
    quantityUnit: unit,
    brand,
    category,
    isFood: category !== 'Other' || confidence > 0.6,
    confidence,
  };
}

async function computeHash(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function parsePantryItem(
  raw: string,
  sql: DurableObjectStorage['sql'],
  deepseekApiKey?: string,
): Promise<ParsedPantryItem> {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { name: '', quantityValue: null, quantityUnit: '', brand: '', category: 'Other', isFood: true, confidence: 0.3 };
  }

  // Check cache first
  const inputHash = await computeHash(trimmed);
  const cached = await getCachedParse(sql, inputHash);
  if (cached) {
    try {
      return JSON.parse(cached.parsedJson) as ParsedPantryItem;
    } catch {
      // Cache corrupted, continue with parsing
    }
  }

  // Try regex first
  const regexResult = regexParse(trimmed);

  // If confidence is high enough, use regex result
  if (regexResult.confidence >= 0.8) {
    await cacheParse(sql, { inputHash, rawInput: trimmed, parsedJson: JSON.stringify(regexResult), source: 'regex', createdAt: Date.now() });
    return regexResult;
  }

  // Low confidence — try AI if key is available
  if (deepseekApiKey) {
    try {
      const aiResults = await parsePantryWithAI([trimmed], deepseekApiKey);
      if (aiResults.length > 0) {
        const aiResult = aiResults[0]!;
        const result: ParsedPantryItem = {
          name: aiResult.name || trimmed,
          quantityValue: aiResult.quantityValue,
          quantityUnit: aiResult.quantityUnit,
          brand: aiResult.brand,
          category: aiResult.category,
          isFood: aiResult.isFood,
          confidence: aiResult.confidence,
        };
        await cacheParse(sql, { inputHash, rawInput: trimmed, parsedJson: JSON.stringify(result), source: 'ai', createdAt: Date.now() });
        return result;
      }
    } catch (err) {
      console.error('AI parsing failed, falling back to regex:', err);
    }
  }

  // Fallback to regex result
  await cacheParse(sql, { inputHash, rawInput: trimmed, parsedJson: JSON.stringify(regexResult), source: 'regex', createdAt: Date.now() });
  return regexResult;
}

// Sync version for Durable Objects (regex-only, no caching)
export function parsePantryItemSync(raw: string): ParsedPantryItem {
  return regexParse(raw.trim());
}

export async function parsePantryBatch(
  rawInputs: string[],
  sql: DurableObjectStorage['sql'],
  deepseekApiKey?: string,
): Promise<ParsedPantryItem[]> {
  const results: ParsedPantryItem[] = [];
  const aiInputs: string[] = [];
  const aiIndices: number[] = [];

  // Process each input
  for (let i = 0; i < rawInputs.length; i++) {
    const trimmed = rawInputs[i]?.trim();
    if (!trimmed) {
      results.push({ name: '', quantityValue: null, quantityUnit: '', brand: '', category: 'Other', isFood: true, confidence: 0.3 });
      continue;
    }

    // Check cache
    const inputHash = await computeHash(trimmed);
    const cached = await getCachedParse(sql, inputHash);
    if (cached) {
      try {
        results.push(JSON.parse(cached.parsedJson) as ParsedPantryItem);
        continue;
      } catch {
        // Cache corrupted, continue with parsing
      }
    }

    // Try regex
    const regexResult = regexParse(trimmed);

    if (regexResult.confidence >= 0.8) {
      await cacheParse(sql, { inputHash, rawInput: trimmed, parsedJson: JSON.stringify(regexResult), source: 'regex', createdAt: Date.now() });
      results.push(regexResult);
    } else {
      // Queue for AI parsing
      aiInputs.push(trimmed);
      aiIndices.push(i);
      results.push(regexResult); // Placeholder, will be replaced
    }
  }

  // Batch AI call for low-confidence items
  if (aiInputs.length > 0 && deepseekApiKey) {
    try {
      const aiResults = await parsePantryWithAI(aiInputs, deepseekApiKey);
      for (let j = 0; j < aiInputs.length; j++) {
        const idx = aiIndices[j]!;
        const aiResult = aiResults[j];
        if (aiResult) {
          const result: ParsedPantryItem = {
            name: aiResult.name || aiInputs[j]!,
            quantityValue: aiResult.quantityValue,
            quantityUnit: aiResult.quantityUnit,
            brand: aiResult.brand,
            category: aiResult.category,
            isFood: aiResult.isFood,
            confidence: aiResult.confidence,
          };
          results[idx] = result;
          const inputHash = await computeHash(aiInputs[j]!);
          await cacheParse(sql, { inputHash, rawInput: aiInputs[j]!, parsedJson: JSON.stringify(result), source: 'ai', createdAt: Date.now() });
        }
      }
    } catch (err) {
      console.error('Batch AI parsing failed, using regex results:', err);
    }
  }

  return results;
}
