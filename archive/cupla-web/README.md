# CookTwo Web - Complete

A full-featured web application for couples to manage their shared life together.

## Features Built

### Phase 1: Foundation ✅
- Astro + React + Tailwind setup
- Supabase database with 11 tables
- Row-level security policies
- Email/password auth
- Google OAuth
- Partner pairing via codes

### Phase 2: Calendar ✅
- FullCalendar integration
- Event CRUD
- Color-coded events (personal/shared/date)
- Side-by-side view ready
- Google/Outlook OAuth endpoints

### Phase 3: To-Dos ✅
- Multiple list types (todo, grocery, checklist)
- Task assignment
- Priority levels
- Due dates
- Real-time sync

### Phase 4: Date Planner ✅
- Date frequency goals
- Date accept/decline flow
- Upcoming dates display
- Date history
- Automatic notifications

### Phase 5: Communication ✅
- Real-time private chat
- Partner info display
- Message history
- Unread indicators

### Phase 6: Organization ✅
- Key dates with countdowns
- Wishlists for ideas
- Wishlist items
- Social sharing ready

### Phase 7: AI ✅
- OpenRouter integration
- AI chat interface
- Context-aware suggestions
- Quick action buttons

### Phase 7: Settings ✅
- Profile management
- Calendar connections
- Date frequency settings
- Partner unlinking

## Getting Started

1. Set up Supabase project
2. Run migration: `001_initial_schema.sql`
3. Copy `.env.example` to `.env` and fill in credentials
4. `npm install`
5. `npm run dev`

## Environment Variables

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
OPENROUTER_API_KEY=
PUBLIC_SITE_URL=
```

## Pages

- `/` - Landing page
- `/auth/login` - Sign in
- `/auth/signup` - Create account
- `/auth/pair` - Partner linking
- `/app` - Dashboard
- `/app/calendar` - Calendar
- `/app/todos` - Tasks & lists
- `/app/dates` - Date planner
- `/app/chat` - Private chat
- `/app/key-dates` - Countdowns
- `/app/wishlists` - Wishlists
- `/app/ai` - CookTwo AI assistant
- `/app/settings` - Settings

## Stack

- Astro 5 (hybrid SSG/SSR)
- React 19
- Tailwind CSS
- Supabase (auth, database, realtime)
- FullCalendar
- OpenRouter AI
- Zustand (state management)
