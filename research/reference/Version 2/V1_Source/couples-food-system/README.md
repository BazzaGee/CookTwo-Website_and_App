# Couples Food System

A progressive web app for couples to collaborate on grocery shopping and meal planning with real-time sync.

## Project Structure

```
couples-food-system/
├── frontend/          # React + Vite PWA
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── App.tsx
│   └── public/
└── worker/            # Cloudflare Worker (Hono)
    ├── src/
    │   ├── routes/
    │   ├── durable-objects/
    │   └── index.ts
    └── migrations/
```

## Features (Step 1 - MVP)

- ✅ Create/join household with 6-digit invite code
- ✅ Real-time shared grocery list via WebSocket
- ✅ Category grouping (Produce, Meat, Dairy, Pantry, Other)
- ✅ Partner color coding (Sage/Terracotta)
- ✅ Quick-add chips for common items
- ✅ Check off items (synced instantly)
- ✅ Offline support via PWA

## Tech Stack

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **State**: Zustand + TanStack Query
- **PWA**: vite-plugin-pwa (service worker, manifest)
- **Backend**: Cloudflare Workers (Hono)
- **Real-time**: Durable Objects with WebSocket
- **Database**: D1 (SQLite) + KV (sessions)

## Development

### Prerequisites

- Node.js 20+
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account

### Setup

1. Clone and install dependencies:
```bash
cd couples-food-system

# Frontend
cd frontend
npm install
cp .env.example .env

# Worker
cd ../worker
npm install
wrangler login
```

2. Create D1 database:
```bash
cd worker
wrangler d1 create couples-food-system
# Update wrangler.toml with your database_id
```

3. Create KV namespace:
```bash
wrangler kv:namespace create SESSIONS
# Update wrangler.toml with your id
```

4. Run migrations:
```bash
wrangler d1 migrations apply couples-food-system --local
```

5. Start development servers:

```bash
# Terminal 1 - Worker
cd worker
wrangler dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Frontend: http://localhost:5173
Worker API: http://localhost:8787

## Deployment

1. Deploy Worker:
```bash
cd worker
wrangler deploy
```

2. Deploy Frontend:
```bash
cd frontend
npm run build
wrangler pages deploy dist
```

## Environment Variables

### Frontend (.env)
- `VITE_API_URL` - Worker API URL
- `VITE_WS_URL` - WebSocket URL

### Worker
- `JWT_SECRET` - Secret for signing JWTs

## Product Roadmap

See `Product_Development_Steps.md` for full details.

- **Step 1** ✅ Shared Grocery List (Current)
- **Step 2** PWA Install + Mobile Polish
- **Step 3** Partner Profiles + D1
- **Step 4** Pantry Tracking
- **Step 5** AI Meal Generation
- **Step 6** Meal Calendar + Smart Grocery
- **Step 7** Adaptive Shared Cooking

## License

MIT
