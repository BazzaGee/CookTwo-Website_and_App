import type { GroceryItem, PantryItem, PartnerProfile, Meal } from '../hooks/useHousehold'

// Mock Partners
export const mockPartner1: PartnerProfile = {
  id: 'p1',
  name: 'Alex',
  slot: 1,
  age: 28,
  gender: 'female',
  weightKg: 68,
  heightCm: 165,
  activityLevel: 'moderate',
  goal: 'lose',
  diet: 'Vegetarian',
  allergies: ['Shellfish'],
  calculatedTDEE: 2100,
  targetCalories: 1700,
}

export const mockPartner2: PartnerProfile = {
  id: 'p2',
  name: 'Jordan',
  slot: 2,
  age: 30,
  gender: 'male',
  weightKg: 82,
  heightCm: 180,
  activityLevel: 'active',
  goal: 'gain',
  diet: 'Omnivore',
  allergies: [],
  calculatedTDEE: 2900,
  targetCalories: 3200,
}

// Mock Grocery List
export const mockGroceryList: GroceryItem[] = [
  { 
    id: '1', 
    name: 'Chicken breast', 
    quantity: '2 lbs', 
    category: 'Meat', 
    checked: false, 
    addedBy: 'Alex',
    position: 0 
  },
  { 
    id: '2', 
    name: 'Spinach', 
    quantity: '1 bag', 
    category: 'Produce', 
    checked: false, 
    addedBy: 'Jordan',
    position: 1 
  },
  { 
    id: '3', 
    name: 'Greek yogurt', 
    quantity: '32 oz',
    category: 'Dairy', 
    checked: true, 
    addedBy: 'Jordan',
    position: 2 
  },
  { 
    id: '4', 
    name: 'Quinoa', 
    quantity: '1 box', 
    category: 'Pantry', 
    checked: false, 
    addedBy: 'Alex',
    position: 3 
  },
  { 
    id: '5', 
    name: 'Bell peppers', 
    quantity: '3', 
    category: 'Produce', 
    checked: false, 
    addedBy: 'Alex',
    position: 4 
  },
  { 
    id: '6', 
    name: 'Avocados', 
    quantity: '4', 
    category: 'Produce', 
    checked: false, 
    addedBy: 'Jordan',
    position: 5 
  },
  { 
    id: '7', 
    name: 'Eggs', 
    quantity: '1 dozen', 
    category: 'Dairy', 
    checked: false, 
    addedBy: 'Alex',
    position: 6 
  },
  { 
    id: '8', 
    name: 'Olive oil', 
    quantity: '500ml', 
    category: 'Pantry', 
    checked: true, 
    addedBy: 'Jordan',
    position: 7 
  },
]

// Mock Pantry
export const mockPantry: PantryItem[] = [
  { 
    id: '1', 
    name: 'Chicken breast', 
    quantity: '2 lbs', 
    category: 'Meat', 
    addedBy: 'Alex',
    addedAt: Date.now() - 2 * 24 * 60 * 60 * 1000 
  },
  { 
    id: '2', 
    name: 'Spinach', 
    quantity: '1 bag', 
    category: 'Produce', 
    addedBy: 'Jordan',
    addedAt: Date.now() - 1 * 24 * 60 * 60 * 1000 
  },
  { 
    id: '3', 
    name: 'Quinoa', 
    category: 'Pantry', 
    addedBy: 'Alex',
    addedAt: Date.now() - 7 * 24 * 60 * 60 * 1000 
  },
  { 
    id: '4', 
    name: 'Greek yogurt', 
    quantity: '4 cups', 
    category: 'Dairy', 
    addedBy: 'Jordan',
    addedAt: Date.now() - 3 * 24 * 60 * 60 * 1000 
  },
  { 
    id: '5', 
    name: 'Bell peppers', 
    quantity: '3', 
    category: 'Produce', 
    addedBy: 'Alex',
    addedAt: Date.now() - 4 * 24 * 60 * 60 * 1000 
  },
  { 
    id: '6', 
    name: 'Garlic', 
    quantity: '1 bulb', 
    category: 'Produce', 
    addedBy: 'Jordan',
    addedAt: Date.now() - 10 * 24 * 60 * 60 * 1000 
  },
]

// Mock Meal Plan
export const mockMealPlan: Meal = {
  id: 'meal_1',
  name: 'Mediterranean Chicken Bowl',
  description: 'Grilled chicken with quinoa, spinach, and tzatziki',
  timeEstimate: 25,
  caloriesPerServing: 420,
  protein: 35,
  carbs: 42,
  fat: 18,
  ingredients: [
    { name: 'Chicken breast', quantity: '6 oz', inPantry: true },
    { name: 'Quinoa', quantity: '1/2 cup', inPantry: true },
    { name: 'Spinach', quantity: '2 cups', inPantry: true },
    { name: 'Greek yogurt', quantity: '1/4 cup', inPantry: true },
    { name: 'Cucumber', quantity: '1/2', inPantry: false },
    { name: 'Lemon', quantity: '1', inPantry: false },
  ],
  steps: [
    'Season chicken with salt, pepper, and oregano',
    'Grill chicken for 6-7 minutes per side',
    'Cook quinoa according to package directions',
    'Massage spinach with olive oil and lemon',
    'Make tzatziki by mixing yogurt with grated cucumber',
    'Assemble bowls and serve',
  ],
}

// Quick Add Items
export const quickAddItems = ['Milk', 'Eggs', 'Bread', 'Chicken', 'Spinach', 'Avocado', 'Bananas', 'Coffee']

// Categories
export const categories = ['Produce', 'Meat', 'Dairy', 'Pantry', 'Other']
