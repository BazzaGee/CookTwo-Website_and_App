import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRoutes from './routes/auth'
import websocketRoutes from './routes/websocket'
import profileRoutes from './routes/profiles'
import mealPlanRoutes from './routes/mealplan'
import { HouseholdSync } from './durable-objects/HouseholdSync'

interface Env {
  DB: D1Database
  SESSIONS: KVNamespace
  HOUSEHOLD_SYNC: DurableObjectNamespace<HouseholdSync>
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

// CORS middleware
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Health check
app.get('/', (c) => {
  return c.json({ 
    status: 'ok',
    service: 'Couples Food System API',
    version: '0.1.0',
  })
})

// Routes
app.route('/auth', authRoutes)
app.route('/ws', websocketRoutes)
app.route('/profiles', profileRoutes)
app.route('/meal-plan', mealPlanRoutes)

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error('Worker error:', err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

// Export Durable Object class
export { HouseholdSync }

// Export default app
export default app
