## V2 Adaptation Note
The Cloudflare infrastructure (Workers, D1, KV, Durable Objects, AI Gateway, PWA) remains fully valid for V2. The only changes are: (1) AI route now generates meal LISTS instead of single meals, (2) new recipe database endpoint (local JSON), (3) new pantry check endpoint. See `V2_Design/V2_Technical_Considerations.md` for the updated technical requirements.

---

# Cupla — Cloudflare Infrastructure & Deployment Strategy (V1 Source — Adapted for V2)

## Internal Technical Specification
## PWA + Cloudflare Infrastructure — MVP Edition

---

## 1. Guiding Principle

Everything runs on Cloudflare. One account, one CLI (wrangler), one deploy command. No AWS, no Vercel, no separate backend servers, no Docker. The PWA frontend and the entire backend are a single deployable unit.

---

## 2. What "PWA" Means in Practice

A Progressive Web App is a website that behaves like a native mobile app. For users it means:

- Visit the URL → browser prompts "Add to Home Screen"
- Tapping the icon launches fullscreen — no browser bar, no address bar
- Works on both iOS (Safari 16.4+) and Android (Chrome)
- Loads instantly from cache even with no signal
- Real-time sync still works the moment connection returns

For Cupla it means: no App Store, no Xcode, no Android Studio, no review process, no $99/year Apple fee. Ship by sharing a URL.

---

## 3. The Full Stack Map

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S PHONE                         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │           PWA Shell (React + Vite)               │   │
│  │  • Installed to home screen                      │   │
│  │  • Fullscreen, no browser chrome                 │   │
│  │  • Service Worker handles offline + caching      │   │
│  │  • Web App Manifest defines icon, splash, theme  │   │
│  └──────────────┬──────────────────────────────────┘   │
└─────────────────┼───────────────────────────────────────┘
                  │ HTTPS / WebSocket
┌─────────────────▼───────────────────────────────────────┐
│                CLOUDFLARE EDGE                           │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Cloudflare Pages                        │  │
│  │  Serves the static React/Vite build               │  │
│  │  CDN-cached globally · Zero config HTTPS          │  │
│  └──────────────┬───────────────────────────────────┘  │
│                 │                                        │
│  ┌──────────────▼───────────────────────────────────┐  │
│  │           Hono Worker (API layer)                  │  │
│  │  POST /auth/create-household                       │  │
│  │  POST /auth/join/:invite_code                      │  │
│  │  GET  /profile/:household_id                       │  │
│  │  PUT  /profile/:partner_id                         │  │
│  │  POST /meal-plan/generate                          │  │
│  │  GET  /meal-plan/:household_id                     │  │
│  └──────────────┬───────────────────────────────────┘  │
│                 │                                        │
│  ┌──────────────▼───────────────────────────────────┐  │
│  │        Durable Object: HouseholdSync              │  │
│  │  One DO per couple (keyed by household_id)         │  │
│  │  • WebSocket server → real-time list sync          │  │
│  │  • SQLite storage → grocery list, pantry state     │  │
│  │  • Broadcasts changes to both phones instantly     │  │
│  │  • Hibernates when both phones are closed          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────────┐   │
│  │     D1     │  │     KV     │  │   AI Gateway   │   │
│  │  SQLite DB │  │  Sessions  │  │  → Anthropic   │   │
│  │  profiles  │  │  JWT auth  │  │  Caches plans  │   │
│  │  meal plans│  │  invite    │  │  Rate limiting │   │
│  │  history   │  │  codes     │  │  Spend control │   │
│  └────────────┘  └────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Layer-by-Layer Breakdown

### 4.1 Frontend — React + Vite (PWA)

**What it is:** The UI, built as a standard React app, output as static files deployed to Cloudflare Pages.

**Key libraries:**

| Library | Purpose |
|---------|---------|
| react + react-dom | UI framework |
| vite | Build tool, fast HMR in dev |
| vite-plugin-pwa | Auto-generates service worker + manifest |
| react-router-dom | Tab navigation (Shopping / Profiles / Meal Plan) |
| @tanstack/react-query | Server state, API caching, background refetch |
| zustand | Local UI state (active partner, plan mode) |

**File structure:**

```
/src
  /components
    GroceryList.tsx
    PantryGrid.tsx
    PartnerProfile.tsx
    MealPlanView.tsx
    RecipeCard.tsx
  /hooks
    useHousehold.ts       ← WebSocket connection to Durable Object
    useMealPlan.ts        ← AI generation + caching
  /lib
    api.ts                ← typed fetch wrappers to Hono Worker
    auth.ts               ← JWT storage + household pairing
  App.tsx
  main.tsx
```

**Deployment:**

```bash
npm run build             # Vite outputs to /dist
wrangler pages deploy dist  # Pushes to Cloudflare Pages
```

The app is live at `cupla.pages.dev` (or custom domain) in seconds.

---

### 4.2 PWA Configuration

**Web App Manifest** — tells the phone how to install the app:

```json
{
  "name": "Cupla",
  "short_name": "Cupla",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#FAF6EE",
  "theme_color": "#7A9E7E",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

**Service Worker Strategy (via vite-plugin-pwa):**

| Asset type | Cache strategy | Why |
|------------|---------------|-----|
| React app shell (JS/CSS) | Cache First | Never changes between deploys |
| API responses (profiles, meal plans) | Stale While Revalidate | Show instantly, update silently |
| Grocery list | Network First + fallback | Must be fresh; fallback to cache if offline |
| AI-generated meal plans | Cache First (24hr TTL) | Expensive to regenerate, rarely changes |
| Images / icons | Cache First | Static assets |

**Offline behaviour:**

- App shell always loads — users see the UI immediately
- Grocery list shows last known state with an "offline" indicator
- Checking off items queues locally, syncs when connection returns (Background Sync API)
- Meal plan shows cached version; generate button disabled with "connect to generate" message

**Push Notifications:**

- Android: Full support — notify Partner B when Partner A checks off all the items
- iOS: Supported since iOS 16.4 — user must add to home screen first
- Delivered via Cloudflare Workers (no Firebase, no separate push service needed)

---

### 4.3 Hono Worker (API)

**What it is:** The backend. A single Cloudflare Worker using Hono for routing. Sits between the frontend and all data stores.

**Why Hono over plain Workers:** Built for edge runtimes, Express-like DX, zero dependencies, typed middleware.

**wrangler.toml bindings:**

```toml
name = "cupla-api"
main = "src/worker.ts"
compatibility_date = "2025-01-01"

[[d1_databases]]
binding = "DB"
database_name = "cupla"
database_id = "your-d1-id"

[[kv_namespaces]]
binding = "SESSIONS"
id = "your-kv-id"

[[durable_objects.bindings]]
name = "HOUSEHOLD_SYNC"
class_name = "HouseholdSync"

[ai]
binding = "AI"
```

**Route map:**

```
POST   /auth/household          → create household, return invite code
POST   /auth/join/:code         → join as partner 2, return JWT
GET    /ws/:household_id        → upgrade to WebSocket → Durable Object

GET    /profiles/:household_id  → both partner profiles
PUT    /profiles/:partner_id    → update one partner's profile + BMI calc

POST   /meal-plan/generate      → call AI Gateway → Anthropic → cache in D1
GET    /meal-plan/:household_id → latest cached meal plan

POST   /push/subscribe          → store push subscription
POST   /push/notify             → send push to partner
```

---

### 4.4 Durable Object — HouseholdSync

**What it is:** The heart of real-time sync. One DO instance per couple. Both phones connect via WebSocket. Any change from either phone is instantly broadcast to the other.

**Lifecycle:**

```
Partner A opens app
  → Worker creates/finds DO for household:abc123
  → WebSocket upgraded, Partner A connected

Partner B opens app
  → Same DO, second WebSocket connection added
  → DO now has 2 active connections

Partner A ticks "Salmon"
  → Message sent over WS to DO
  → DO updates its SQLite storage
  → DO broadcasts updated list to ALL connections
  → Partner B's phone updates instantly (< 100ms)

Both close app
  → DO hibernates (costs nothing)
  → SQLite state persists

Either partner reopens
  → DO wakes, loads state, re-establishes WS
```

**DO internal SQLite schema:**

```sql
CREATE TABLE grocery_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  qty TEXT,
  checked INTEGER DEFAULT 0,
  checked_by TEXT,
  checked_at INTEGER,
  added_by TEXT,
  position INTEGER
);

CREATE TABLE pantry (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  qty TEXT,
  added_at INTEGER
);
```

---

### 4.5 D1 Database (Global Relational Data)

Persistent data that outlives individual DO sessions — profiles, meal plan history, household records.

**Full schema:**

```sql
CREATE TABLE households (
  id TEXT PRIMARY KEY,
  invite_code TEXT UNIQUE,
  name TEXT,
  created_at INTEGER
);

CREATE TABLE partners (
  id TEXT PRIMARY KEY,
  household_id TEXT REFERENCES households(id),
  slot INTEGER CHECK(slot IN (1, 2)),
  name TEXT,
  weight_kg REAL,
  height_cm REAL,
  age INTEGER,
  gender TEXT,
  body_type TEXT CHECK(body_type IN ('Ectomorph','Mesomorph','Endomorph')),
  diet TEXT,
  goals TEXT,
  allergies TEXT,
  updated_at INTEGER
);

CREATE TABLE meal_plans (
  id TEXT PRIMARY KEY,
  household_id TEXT REFERENCES households(id),
  mode TEXT CHECK(mode IN ('meal','daily','weekly')),
  plan_json TEXT,
  pantry_snapshot TEXT,
  created_at INTEGER
);

CREATE TABLE push_subscriptions (
  id TEXT PRIMARY KEY,
  partner_id TEXT REFERENCES partners(id),
  endpoint TEXT,
  p256dh TEXT,
  auth TEXT,
  created_at INTEGER
);
```

**Migrations via Wrangler:**

```bash
wrangler d1 migrations create cupla add-profiles
wrangler d1 migrations apply cupla --local    # dev
wrangler d1 migrations apply cupla            # production
```

---

### 4.6 KV (Sessions + Invite Codes)

Fast, globally-replicated reads. Two uses only:

**Sessions:**
- key: `session:{jwt_token}`
- value: `{ household_id, partner_id, partner_slot }`
- TTL: 30 days

**Invite codes:**
- key: `invite:{6_digit_code}`
- value: `{ household_id }`
- TTL: 24 hours (code expires)

**Why not D1 for sessions?**
KV reads are sub-millisecond at the edge — every authenticated API request validates the session, so speed matters more than relational features here.

---

### 4.7 AI Gateway → Anthropic

**What it does:** Proxies Anthropic calls through Cloudflare's AI Gateway. The API key lives in a Wrangler secret, never in frontend code.

**Benefits over calling Anthropic directly:**

- **Caching** — identical meal plan requests (same pantry + same profiles) return cached response instantly, no token cost
- **Rate limiting** — prevents runaway API spend
- **Observability** — dashboard shows every request, latency, token usage, cost
- **Fallback** — can swap to Workers AI (Llama) if Anthropic is down

**Setup:**

```bash
wrangler secret put ANTHROPIC_API_KEY
```

**In the Worker:**

```typescript
const response = await fetch(
  `https://gateway.ai.cloudflare.com/v1/{account_id}/cupla/anthropic/v1/messages`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-key': env.ANTHROPIC_API_KEY,
      'cf-aig-cache-ttl': '86400',
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', ... })
  }
)
```

---

### 4.8 MCP Server (Optional — Power Layer)

Built as a separate Cloudflare Worker, exposes the app's data as MCP tools. Lets Claude Desktop, Claude mobile, or any MCP client interact with the app via natural language.

**Exposed tools:**

```
get_pantry()                     → "what ingredients do we have?"
add_grocery_item(name, qty)      → "add oat milk to our list"
check_off_item(name)             → "we got the chicken"
get_meal_plan()                  → "what are we cooking tonight?"
generate_meal_plan(mode)         → "make us a weekly plan"
get_profiles()                   → "what are our diets?"
update_profile(partner, fields)  → "I'm now 78kg"
```

**Deploy separately:**

```bash
wrangler deploy --config wrangler.mcp.toml
```

Connects to the same D1 + KV + DO as the main Worker — same data, different interface.

---

## 5. Auth Flow (Simple Pairing, No OAuth)

Designed for exactly two people. No email/password complexity for MVP.

```
Partner 1 opens app
  → Taps "Create Household"
  → Worker creates household in D1
  → Generates 6-digit invite code → stored in KV (24hr TTL)
  → Returns JWT → stored in phone's localStorage
  → Shows code on screen: "Share this with your partner: 847 291"

Partner 2 opens app
  → Taps "Join with Code"
  → Enters 847291
  → Worker validates code in KV
  → Joins household as slot 2 in D1
  → Returns their own JWT
  → Both phones now share same household_id
  → Invite code deleted from KV
```

---

## 6. Development Workflow

**Local dev (full stack, no cloud needed):**

```bash
npm run dev         # Vite dev server for React (port 5173)
wrangler dev        # Local Worker with D1/KV/DO simulation (port 8787)
```

Wrangler simulates D1, KV, and Durable Objects locally — develop entirely offline.

**Environment separation:**

| Environment | URL / Setup |
|-------------|-------------|
| Local | `wrangler dev` (local D1, local KV) |
| Staging | `cupla-staging.pages.dev` |
| Production | `cupla.pages.dev` (or custom domain) |

**Deploy:**

```bash
# API Worker
wrangler deploy

# Frontend (auto-deploys on git push if connected to GitHub)
wrangler pages deploy dist
```

---

## 7. Project Folder Structure

```
cupla/
├── frontend/                    # React PWA
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── manifest.json        # generated by vite-plugin-pwa
│   ├── vite.config.ts
│   └── package.json
│
├── worker/                      # Hono API + Durable Object
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── profiles.ts
│   │   │   ├── mealplan.ts
│   │   │   └── push.ts
│   │   ├── durable-objects/
│   │   │   └── HouseholdSync.ts
│   │   ├── lib/
│   │   │   ├── ai.ts            # AI Gateway wrapper
│   │   │   ├── bmi.ts           # BMI + portion calculations
│   │   │   └── auth.ts          # JWT helpers
│   │   └── index.ts             # Hono app entry
│   ├── migrations/
│   │   └── 0001_init.sql
│   └── wrangler.toml
│
├── mcp/                         # Optional MCP Worker
│   ├── src/
│   │   └── index.ts
│   └── wrangler.mcp.toml
│
└── README.md
```

---

## 8. Cost at MVP Scale

| Service | Free Tier Limit | Typical MVP Usage | Cost |
|---------|----------------|-------------------|------|
| Cloudflare Pages | Unlimited requests | Low | $0 |
| Workers | 100k req/day | ~500 req/day | $0 |
| D1 | 5M row reads/day | ~5k reads/day | $0 |
| KV | 100k reads/day | ~200 reads/day | $0 |
| Durable Objects | Free tier (SQLite) | 1 DO per couple | $0 |
| AI Gateway | Free | All requests routed | $0 |
| Anthropic API | Pay per token | ~$0.01 per meal plan | Variable |
| Custom domain | If you have one | 1 domain | $0 on CF |

**Bottom line:** Infrastructure is free until scale. Only cost is Anthropic tokens — roughly $0.01–0.03 per meal plan generation.

If moving to Workers Paid ($5/mo) — unlocks higher DO limits, more KV writes, and priority support. Not needed for MVP.

---

## 9. Build Order (MVP Sequence)

### Week 1 — Foundation

- Scaffold: `npm create cloudflare@latest`
- D1 schema + migrations
- Auth flow: create household, invite code, JWT
- Basic Hono routes working locally

### Week 2 — Real-time Core

- Durable Object: HouseholdSync WebSocket handler
- Grocery list CRUD through DO
- React frontend: Shopping tab connected to DO via WS
- Real-time sync working between two browser tabs

### Week 3 — Profiles + AI

- Partner profiles in D1
- BMI calculation + portion logic
- AI Gateway setup
- Meal plan generation endpoint
- React frontend: Profiles + Meal Plan tabs

### Week 4 — PWA Polish

- vite-plugin-pwa: manifest + service worker
- Offline fallback behaviour
- Icons, splash screens, theme colour
- Install prompt handling
- Test on real iOS + Android devices
- Deploy to production domain

### Post-MVP

- Push notifications
- MCP server
- Recipe history
- Shopping suggestions learning from past lists

---

## 10. Key Commands Reference

```bash
# Install Wrangler
npm install -g wrangler
wrangler login

# Create D1 database
wrangler d1 create cupla

# Run migrations
wrangler d1 migrations apply cupla --local
wrangler d1 migrations apply cupla

# Store secrets (never in code)
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put JWT_SECRET

# Local development
wrangler dev                          # Worker on :8787
cd frontend && npm run dev            # Vite on :5173

# Deploy
wrangler deploy                       # API Worker
wrangler pages deploy dist            # Frontend

# Tail live logs
wrangler tail

# Browse D1 data
wrangler d1 execute cupla --command "SELECT * FROM partners"
```

---

## 11. Strategic Rationale for Cloudflare-Native Architecture

### Why This Stack for Cupla Specifically

1. **Real-time sync is non-negotiable.** Cupla's core value prop is couples seeing the same grocery list simultaneously. Durable Objects with WebSockets deliver sub-100ms sync natively — no Socket.io, no Firebase, no polling.

2. **Zero infrastructure cost at launch.** Every service is free-tier eligible. Cupla can onboard hundreds of couples before paying a cent. This de-risks the launch financially.

3. **PWA over native apps.** Cupla needs both partners to adopt immediately. "Share a link" beats "download from the App Store" for the second partner. No review process means shipping daily if needed.

4. **Offline-first is essential.** Users check off groceries in supermarkets with no signal. The service worker + Background Sync API handles this without any custom sync logic.

5. **AI cost control.** AI Gateway caching means identical meal plan requests (same pantry + same profiles) return cached responses — directly reducing Anthropic token spend, which is the only real variable cost.

6. **Global edge deployment.** D1, KV, and Workers run at Cloudflare edge nodes in 300+ cities. A couple in Dublin and a couple in Sydney both get sub-50ms response times with zero configuration.
