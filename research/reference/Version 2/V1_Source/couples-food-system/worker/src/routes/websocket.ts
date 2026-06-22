import { Hono } from 'hono'
import { HouseholdSync } from '../durable-objects/HouseholdSync'

interface Env {
  HOUSEHOLD_SYNC: DurableObjectNamespace<HouseholdSync>
  SESSIONS: KVNamespace
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

// GET /ws/:household_id - WebSocket endpoint
app.get('/:household_id', async (c) => {
  const householdId = c.req.param('household_id')
  const token = c.req.query('token')

  if (!token) {
    return c.json({ error: 'Token required' }, 401)
  }

  // Validate session
  const session = await c.env.SESSIONS.get(`session:${token}`)
  if (!session) {
    return c.json({ error: 'Invalid token' }, 401)
  }

  try {
    const { householdId: sessionHouseholdId } = JSON.parse(session)
    
    if (sessionHouseholdId !== householdId) {
      return c.json({ error: 'Unauthorized' }, 403)
    }
  } catch {
    return c.json({ error: 'Invalid session' }, 401)
  }

  // Get Durable Object
  const id = c.env.HOUSEHOLD_SYNC.idFromName(householdId)
  const householdSync = c.env.HOUSEHOLD_SYNC.get(id)

  // Forward request to DO
  return await householdSync.fetch(c.req.raw)
})

export default app
