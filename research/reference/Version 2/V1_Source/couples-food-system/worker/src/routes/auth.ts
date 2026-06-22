import { Hono } from 'hono'
import { SignJWT } from 'jose'

interface Env {
  DB: D1Database
  SESSIONS: KVNamespace
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

// Generate random 6-digit invite code
function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// Create JWT token
async function createJWT(payload: { householdId: string; partnerId: string; slot: number }, secret: string): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(new TextEncoder().encode(secret))
  
  return token
}

// POST /auth/create-household
app.post('/create-household', async (c) => {
  const { name } = await c.req.json<{ name: string }>()
  
  if (!name || name.trim().length === 0) {
    return c.json({ error: 'Name is required' }, 400)
  }

  const householdId = crypto.randomUUID()
  const partnerId = crypto.randomUUID()
  const inviteCode = generateInviteCode()
  const now = Date.now()

  const db = c.env.DB

  // Create household
  await db
    .prepare('INSERT INTO households (id, invite_code, created_at) VALUES (?, ?, ?)')
    .bind(householdId, inviteCode, now)
    .run()

  // Create partner (slot 1)
  await db
    .prepare('INSERT INTO partners (id, household_id, slot, name, created_at) VALUES (?, ?, ?, ?, ?)')
    .bind(partnerId, householdId, 1, name.trim(), now)
    .run()

  // Store invite code in KV with 24h TTL
  await c.env.SESSIONS.put(`invite:${inviteCode}`, householdId, { expirationTtl: 86400 })

  // Create JWT
  const token = await createJWT({ householdId, partnerId, slot: 1 }, c.env.JWT_SECRET)

  // Store session in KV
  await c.env.SESSIONS.put(`session:${token}`, JSON.stringify({ householdId, partnerId, slot: 1 }), {
    expirationTtl: 30 * 24 * 60 * 60, // 30 days
  })

  return c.json({
    token,
    household: {
      id: householdId,
      inviteCode,
    },
    partner: {
      id: partnerId,
      name: name.trim(),
      slot: 1,
    },
  })
})

// POST /auth/join/:code
app.post('/join/:code', async (c) => {
  const code = c.req.param('code').toUpperCase()
  const { name } = await c.req.json<{ name: string }>()

  if (!name || name.trim().length === 0) {
    return c.json({ error: 'Name is required' }, 400)
  }

  // Validate invite code
  const householdId = await c.env.SESSIONS.get(`invite:${code}`)
  
  if (!householdId) {
    return c.json({ error: 'Invalid or expired invite code' }, 400)
  }

  const db = c.env.DB
  const now = Date.now()

  // Check if household already has 2 partners
  const existingPartners = await db
    .prepare('SELECT COUNT(*) as count FROM partners WHERE household_id = ?')
    .bind(householdId)
    .first<{ count: number }>()

  if (existingPartners && existingPartners.count >= 2) {
    return c.json({ error: 'Household is full' }, 400)
  }

  const partnerId = crypto.randomUUID()

  // Create partner (slot 2)
  await db
    .prepare('INSERT INTO partners (id, household_id, slot, name, created_at) VALUES (?, ?, ?, ?, ?)')
    .bind(partnerId, householdId, 2, name.trim(), now)
    .run()

  // Delete invite code (one-time use)
  await c.env.SESSIONS.delete(`invite:${code}`)

  // Create JWT
  const token = await createJWT({ householdId, partnerId, slot: 2 }, c.env.JWT_SECRET)

  // Store session in KV
  await c.env.SESSIONS.put(`session:${token}`, JSON.stringify({ householdId, partnerId, slot: 2 }), {
    expirationTtl: 30 * 24 * 60 * 60,
  })

  return c.json({
    token,
    household: {
      id: householdId,
    },
    partner: {
      id: partnerId,
      name: name.trim(),
      slot: 2,
    },
  })
})

// Middleware to validate JWT
export async function validateAuth(c: any): Promise<{ householdId: string; partnerId: string; slot: number } | null> {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  
  // Check session in KV
  const session = await c.env.SESSIONS.get(`session:${token}`)
  
  if (!session) {
    return null
  }

  try {
    return JSON.parse(session)
  } catch {
    return null
  }
}

export default app
