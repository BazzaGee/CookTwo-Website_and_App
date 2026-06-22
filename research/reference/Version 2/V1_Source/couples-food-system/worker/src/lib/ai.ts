interface MealPlanInput {
  pantryItems: { name: string; quantity?: string }[]
  profiles: { name: string; diet: string; allergies: string[] }[]
}

interface MealPlanOutput {
  name: string
  description: string
  timeEstimate: number
  caloriesPerServing: number
  protein: number
  carbs: number
  fat: number
  ingredients: { name: string; quantity: string; inPantry: boolean }[]
  steps: string[]
}

export function buildMealPrompt(input: MealPlanInput): string {
  const pantryList = input.pantryItems.map((i) => `${i.name}${i.quantity ? ` (${i.quantity})` : ''}`).join(', ')
  const profileInfo = input.profiles
    .map((p) => {
      const dietLabel = p.diet === 'none' ? 'No dietary restrictions' : p.diet
      const allergyText = p.allergies.length > 0 ? `, allergic to ${p.allergies.join(', ')}` : ''
      return `${p.name}: ${dietLabel}${allergyText}`
    })
    .join('\n')

  return `You are a helpful meal planning assistant for couples.

Given these ingredients in our pantry: ${pantryList}

Our dietary preferences:
${profileInfo}

Suggest ONE dinner recipe that:
- Uses mostly what we have in the pantry
- Respects both partners' dietary restrictions (if one is vegetarian, the meal must be vegetarian)
- Avoids all listed allergies
- Takes 30 minutes or less to prepare

Output ONLY valid JSON in this exact format:
{
  "name": "Recipe Name",
  "description": "Brief description",
  "timeEstimate": 25,
  "caloriesPerServing": 420,
  "protein": 35,
  "carbs": 42,
  "fat": 18,
  "ingredients": [
    {"name": "Ingredient", "quantity": "amount", "inPantry": true}
  ],
  "steps": ["Step 1", "Step 2"]
}

Do not include any text before or after the JSON.`
}

export async function generateMealPlan(
  input: MealPlanInput,
  apiKey: string
): Promise<MealPlanOutput> {
  const prompt = buildMealPrompt(input)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.content?.[0]?.text || ''

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')
    return JSON.parse(jsonMatch[0]) as MealPlanOutput
  } catch {
    throw new Error('Failed to parse AI response as JSON')
  }
}

export function generateMockMealPlan(pantryItems: { name: string }[]): MealPlanOutput {
  const pantryNames = pantryItems.map((i) => i.name.toLowerCase())
  const hasChicken = pantryNames.some((n) => n.includes('chicken'))
  const hasSpinach = pantryNames.some((n) => n.includes('spinach'))
  const hasRice = pantryNames.some((n) => n.includes('rice'))

  if (hasChicken && hasSpinach && hasRice) {
    return {
      name: 'Chicken & Spinach Rice Bowl',
      description: 'A quick and healthy bowl with grilled chicken, fresh spinach, and fluffy rice',
      timeEstimate: 25,
      caloriesPerServing: 420,
      protein: 35,
      carbs: 42,
      fat: 18,
      ingredients: [
        { name: 'Chicken breast', quantity: '6 oz', inPantry: true },
        { name: 'Spinach', quantity: '2 cups', inPantry: true },
        { name: 'Rice', quantity: '1/2 cup', inPantry: true },
        { name: 'Garlic', quantity: '2 cloves', inPantry: false },
        { name: 'Olive oil', quantity: '1 tbsp', inPantry: false },
        { name: 'Lemon', quantity: '1/2', inPantry: false },
      ],
      steps: [
        'Cook rice according to package directions',
        'Season chicken with salt, pepper, and garlic powder',
        'Grill or pan-fry chicken for 6-7 minutes per side until cooked through',
        'Sauté spinach with garlic and olive oil for 2 minutes',
        'Slice chicken and assemble bowls with rice, spinach, and chicken',
        'Squeeze lemon juice on top and serve',
      ],
    }
  }

  return {
    name: 'Quick Veggie Stir-Fry',
    description: 'A simple stir-fry using whatever vegetables you have on hand',
    timeEstimate: 20,
    caloriesPerServing: 320,
    protein: 12,
    carbs: 45,
    fat: 14,
    ingredients: [
      { name: 'Mixed vegetables', quantity: '3 cups', inPantry: true },
      { name: 'Rice or noodles', quantity: '1 cup', inPantry: false },
      { name: 'Soy sauce', quantity: '2 tbsp', inPantry: false },
      { name: 'Garlic', quantity: '2 cloves', inPantry: false },
      { name: 'Oil', quantity: '1 tbsp', inPantry: false },
    ],
    steps: [
      'Cook rice or noodles according to package directions',
      'Heat oil in a large pan or wok over high heat',
      'Add garlic and stir for 30 seconds until fragrant',
      'Add vegetables and stir-fry for 3-4 minutes',
      'Add soy sauce and toss to coat',
      'Serve over rice or noodles',
    ],
  }
}
