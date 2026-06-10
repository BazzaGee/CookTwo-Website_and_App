import type { Category } from '../types/grocery';

const KEYWORDS: Array<{ category: Category; words: string[] }> = [
  { category: 'Produce', words: ['apple', 'banana', 'orange', 'lettuce', 'spinach', 'tomato', 'potato', 'onion', 'garlic', 'carrot', 'pepper', 'cucumber', 'broccoli', 'kale', 'mushroom', 'avocado', 'lemon', 'lime', 'berry', 'grape', 'mango', 'peach', 'pear', 'corn', 'zucchini', 'celery', 'ginger', 'herb', 'basil', 'cilantro', 'parsley'] },
  { category: 'Meat', words: ['chicken', 'beef', 'pork', 'turkey', 'lamb', 'fish', 'salmon', 'tuna', 'shrimp', 'bacon', 'sausage', 'ham', 'steak', 'ground', 'fillet', 'breast', 'thigh', 'mince', 'prawn'] },
  { category: 'Dairy', words: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'egg', 'eggs', 'sour cream', 'cottage cheese', 'cheddar', 'mozzarella', 'parmesan', 'feta', 'gouda', 'brie', 'cream cheese', 'kefir'] },
  { category: 'Pantry', words: ['rice', 'pasta', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'olive oil', 'vinegar', 'sauce', 'soup', 'canned', 'beans', 'lentils', 'cereal', 'oats', 'bread', 'tortilla', 'honey', 'peanut butter', 'jam', 'tea', 'coffee', 'spice', 'soy sauce', 'sesame oil', 'coconut oil', 'wheat', 'oat', 'quinoa', 'noodle', 'chips', 'crackers', 'chocolate', 'nuts', 'almonds'] },
  { category: 'Household', words: ['dish soap', 'dishwasher', 'detergent', 'laundry', 'bleach', 'cleaning', 'cleaner', 'sponge', 'bin bag', 'bin liner', 'trash bag', 'foil', 'cling wrap', 'cling film', 'paper towel', 'kitchen roll', 'batteries', 'light bulb', 'candle', 'matches', 'lighter', 'tape', 'gloves', 'air freshener', 'fly spray', 'mop', 'broom', 'bucket'] },
  { category: 'Personal Care', words: ['shampoo', 'conditioner', 'soap', 'body wash', 'face wash', 'moisturiser', 'moisturizer', 'lotion', 'sunscreen', 'toothpaste', 'toothbrush', 'floss', 'mouthwash', 'deodorant', 'razor', 'shaving', 'toilet paper', 'tissues', 'wet wipe', 'cotton pad', 'nail clipper', 'comb', 'hairbrush', 'vitamin', 'panadol', 'bandaid', 'bandage'] },
];

export function classify(name: string): Category {
  const normalized = name.toLowerCase().trim();
  for (const { category, words } of KEYWORDS) {
    if (words.some((w) => normalized.includes(w))) return category;
  }
  return 'Other';
}
