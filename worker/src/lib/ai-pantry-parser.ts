import type { Category } from '../durable-objects/HouseholdSync';

export interface ParsedPantryItem {
  name: string;
  quantityValue: number | null;
  quantityUnit: string;
  brand: string;
  category: Category;
  isFood: boolean;
  confidence: number;
}

const AI_PARSING_PROMPT = `You are a pantry item parser. Extract structured data from raw text input.

For each item, return:
- name: The core food product (e.g., "milk", "cheddar", "onion")
- quantityValue: Numeric amount (e.g., 1, 250, 0.5) or null if not specified
- quantityUnit: Unit of measurement (e.g., "litre", "g", "cup", "piece") or ""
- brand: Brand name or descriptor if detected (e.g., "organic", "Swiss", "Whole Foods") or ""
- category: One of: Produce, Meat, Dairy, Pantry, Other
- isFood: true if this is a food item, false otherwise
- confidence: 0-1 score of how confident you are in the parsing

Rules:
- "organic", "free-range", "whole" are brands/descriptors, not part of the product name
- "half an onion" → quantityValue: 0.5, quantityUnit: "", name: "onion"
- "250g Swiss cheddar" → quantityValue: 250, quantityUnit: "g", brand: "Swiss", name: "cheddar"
- Non-food items (cleaning supplies, electronics, etc.) → isFood: false, category: "Other"
- If uncertain, set confidence < 0.7

Output ONLY valid JSON array, no markdown, no explanation.

Input: ["1 litre whole milk", "organic free-range eggs", "iPhone charger", "half an onion"]
`;

export async function parsePantryWithAI(
  rawInputs: string[],
  deepseekApiKey: string,
): Promise<ParsedPantryItem[]> {
  const prompt = `${AI_PARSING_PROMPT}\n\nInput: ${JSON.stringify(rawInputs)}`;

  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${deepseekApiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    console.error(`DeepSeek API error: ${res.status}`);
    // Fallback to basic parsing
    return rawInputs.map((input) => ({
      name: input,
      quantityValue: null,
      quantityUnit: '',
      brand: '',
      category: 'Other' as Category,
      isFood: true,
      confidence: 0.3,
    }));
  }

  const data = (await res.json()) as { choices: Array<{ message: { content: string } }> };
  const text = data.choices?.[0]?.message?.content ?? '';

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as ParsedPantryItem[];
      return parsed.map((item) => ({
        ...item,
        category: isValidCategory(item.category) ? item.category : 'Other',
        confidence: Math.min(Math.max(item.confidence ?? 0.5, 0), 1),
      }));
    }
  } catch {
    console.error('Failed to parse AI response');
  }

  // Fallback
  return rawInputs.map((input) => ({
    name: input,
    quantityValue: null,
    quantityUnit: '',
    brand: '',
    category: 'Other' as Category,
    isFood: true,
    confidence: 0.3,
  }));
}

function isValidCategory(value: string): value is Category {
  return ['Produce', 'Meat', 'Dairy', 'Pantry', 'Other'].includes(value);
}
