import { Hono } from 'hono'
import { validateAuth } from './auth'
import { generateMealPlan, generateMockMealPlan } from '../lib/ai'

interface Env {
  DB: D1Database
  SESSIONS: KVNamespace
  JWT_SECRET: string
  ANTHROPIC_API_KEY?: string
}

const app = new Hono<{ Bindings: Env }>()

// POST /meal-plan/generate - Generate a meal based on pantry + profiles
app.post('/generate', async (c) => {
  const auth = await validateAuth(c)
  if (!auth) return c.json({ error: 'Unauthorized' }, 401)

  const body = await c.req.json<{ pantryItems?: { name: string; quantity?: string }[] }>()
  const pantryItems = body.pantryItems || []

  const db = c.env.DB

  const profileResult = await db
    .prepare('SELECT name, diet, allergies FROM partners WHERE household_id = ?')
    .bind(auth.householdId)
    .all()

  const profiles = (profileResult.results || []).map((r: any) => ({
    name: r.name,
    diet: r.diet || 'omnivore',
    allergies: (r.allergies || '').split(',').filter(Boolean).map((a: string) => a.trim()),
  }))

  const apiKey = c.env.ANTHROPIC_API_KEY

  let meal
  if (apiKey && apiKey !== 'your-anthropic-api-key-here') {
    try {
      meal = await generateMealPlan({ pantryItems, profiles }, apiKey)
    } catch {
      meal = generateMockMealPlan(pantryItems)
    }
  } else {
    meal = generateMockMealPlan(pantryItems)
  }

  const mealPlanId = crypto.randomUUID()
  const now = Date.now()

  await db
    .prepare(
      'INSERT INTO meal_plans (id, household_id, mode, plan_json, pantry_snapshot, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .bind(
      mealPlanId,
      auth.householdId,
      'single',
      JSON.stringify(meal),
      JSON.stringify(pantryItems),
      now
    )
    .run()

  return c.json({ meal: { id: mealPlanId, ...meal } })
})

// GET /meal-plan/:householdId - Get latest cached meal plan
app.get('/:householdId', async (c) => {
  const auth = await validateAuth(c)
  if (!auth) return c.json({ error: 'Unauthorized' }, 401)

  const householdId = c.req.param('householdId')
  if (auth.householdId !== householdId) return c.json({ error: 'Forbidden' }, 403)

  const db = c.env.DB
  const result = await db
    .prepare('SELECT id, plan_json, created_at FROM meal_plans WHERE household_id = ? ORDER BY created_at DESC LIMIT 1')
    .bind(householdId)
    .first()

  if (!result) {
    return c.json({ meal: null })
  }

  const plan = JSON.parse((result as any).plan_json)

  return c.json({
    meal: {
      id: (result as any).id,
      ...plan,
      createdAt: (result as any).created_at,
    },
  })
})

export default app
