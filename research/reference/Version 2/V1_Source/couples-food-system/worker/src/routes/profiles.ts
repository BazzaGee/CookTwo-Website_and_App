import { Hono } from 'hono'
import { validateAuth } from './auth'
import { calculateTDEE, calculateTargetCalories } from '../lib/tdee'

interface Env {
  DB: D1Database
  SESSIONS: KVNamespace
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

// GET /profiles/:householdId - Get both partner profiles
app.get('/:householdId', async (c) => {
  const auth = await validateAuth(c)
  if (!auth) return c.json({ error: 'Unauthorized' }, 401)

  const householdId = c.req.param('householdId')
  if (auth.householdId !== householdId) return c.json({ error: 'Forbidden' }, 403)

  const db = c.env.DB
  const result = await db
    .prepare('SELECT id, household_id, slot, name, diet, allergies, weight_kg, height_cm, age, gender, activity_level, goal, tdee, target_calories, updated_at FROM partners WHERE household_id = ? ORDER BY slot')
    .bind(householdId)
    .all()

  const profiles = result.results.map((r: any) => ({
    id: r.id,
    householdId: r.household_id,
    slot: r.slot,
    name: r.name,
    diet: r.diet || 'omnivore',
    allergies: (r.allergies || '').split(',').filter(Boolean).map((a: string) => a.trim()),
    weightKg: r.weight_kg,
    heightCm: r.height_cm,
    age: r.age,
    gender: r.gender,
    activityLevel: r.activity_level,
    goal: r.goal,
    tdee: r.tdee,
    targetCalories: r.target_calories,
    updatedAt: r.updated_at,
  }))

  return c.json({ profiles })
})

// PUT /profiles/:partnerId - Update one partner's profile
app.put('/:partnerId', async (c) => {
  const auth = await validateAuth(c)
  if (!auth) return c.json({ error: 'Unauthorized' }, 401)

  const partnerId = c.req.param('partnerId')
  if (auth.partnerId !== partnerId) return c.json({ error: 'Forbidden' }, 403)

  const body = await c.req.json<{
    diet?: string
    allergies?: string[]
    name?: string
    weightKg?: number
    heightCm?: number
    age?: number
    gender?: string
    activityLevel?: string
    goal?: string
  }>()

  const now = Date.now()
  const allergiesStr = body.allergies ? body.allergies.join(', ') : null

  const db = c.env.DB

  const updates: string[] = []
  const bindings: unknown[] = []

  if (body.name !== undefined) {
    updates.push('name = ?')
    bindings.push(body.name)
  }
  if (body.diet !== undefined) {
    updates.push('diet = ?')
    bindings.push(body.diet)
  }
  if (allergiesStr !== null) {
    updates.push('allergies = ?')
    bindings.push(allergiesStr)
  }
  if (body.weightKg !== undefined) {
    updates.push('weight_kg = ?')
    bindings.push(body.weightKg)
  }
  if (body.heightCm !== undefined) {
    updates.push('height_cm = ?')
    bindings.push(body.heightCm)
  }
  if (body.age !== undefined) {
    updates.push('age = ?')
    bindings.push(body.age)
  }
  if (body.gender !== undefined) {
    updates.push('gender = ?')
    bindings.push(body.gender)
  }
  if (body.activityLevel !== undefined) {
    updates.push('activity_level = ?')
    bindings.push(body.activityLevel)
  }
  if (body.goal !== undefined) {
    updates.push('goal = ?')
    bindings.push(body.goal)
  }

  // Auto-calculate TDEE if body stats are provided
  if (body.weightKg && body.heightCm && body.age && body.gender && body.activityLevel && body.goal) {
    const profile = {
      weightKg: body.weightKg,
      heightCm: body.heightCm,
      age: body.age,
      gender: body.gender as 'male' | 'female' | 'other',
      activityLevel: body.activityLevel as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
      goal: body.goal as 'lose' | 'maintain' | 'gain',
    }
    const tdee = calculateTDEE(profile)
    const targetCalories = calculateTargetCalories(profile)
    updates.push('tdee = ?')
    bindings.push(tdee)
    updates.push('target_calories = ?')
    bindings.push(targetCalories)
  }

  updates.push('updated_at = ?')
  bindings.push(now)
  bindings.push(partnerId)

  if (updates.length === 1) {
    return c.json({ error: 'No fields to update' }, 400)
  }

  await db
    .prepare(`UPDATE partners SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...bindings)
    .run()

  const result = await db
    .prepare('SELECT id, household_id, slot, name, diet, allergies, weight_kg, height_cm, age, gender, activity_level, goal, tdee, target_calories, updated_at FROM partners WHERE id = ?')
    .bind(partnerId)
    .first()

  const profile = {
    id: (result as any).id,
    householdId: (result as any).household_id,
    slot: (result as any).slot,
    name: (result as any).name,
    diet: (result as any).diet || 'omnivore',
    allergies: ((result as any).allergies || '').split(',').filter(Boolean).map((a: string) => a.trim()),
    weightKg: (result as any).weight_kg,
    heightCm: (result as any).height_cm,
    age: (result as any).age,
    gender: (result as any).gender,
    activityLevel: (result as any).activity_level,
    goal: (result as any).goal,
    tdee: (result as any).tdee,
    targetCalories: (result as any).target_calories,
    updatedAt: (result as any).updated_at,
  }

  return c.json({ profile })
})

export default app
