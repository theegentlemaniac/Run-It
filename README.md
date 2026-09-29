# Run-It 🏀

**Find a court, find a game, and prove how good you are — anywhere pickup
basketball happens.**

Run-It is a community basketball platform for discovering courts (including
ones missing from Google Maps), scheduling pickup games, finding players
looking to run, and — eventually — keeping live score in real time.

## Product pillars

1. **Courts** — map discovery, crowdsourced pins, photos, tags, reviews.
2. **Games / Social** — scheduling, RSVPs, skill filters, "looking to play".
3. **Live Scoring** — on-the-fly teams, append-only score events, spectator links.
4. **Stats / Profile** — personal history, leaderboards, reputation, badges.

See [Roadmap](#roadmap) for what's shipped vs. planned.

## Tech stack

- **Framework:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend / BaaS:** [Supabase](https://supabase.com) (Auth, Postgres + PostGIS, Storage, Realtime)
- **Maps:** Mapbox GL JS / react-map-gl
- **Forms & validation:** React Hook Form + Zod
- **Data fetching:** TanStack Query
- **Deployment:** Vercel (app) + Supabase (backend)

## Getting started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier is fine)
- A [Mapbox](https://account.mapbox.com/access-tokens/) public access token

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your Supabase and Mapbox credentials:

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only, never expose to the client) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox GL JS public access token |

### 3. Apply the database schema

The schema (tables, PostGIS geospatial columns, RLS policies) lives in
[`supabase/migrations`](./supabase/migrations). Using the
[Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Or paste the contents of `supabase/migrations/0001_initial_schema.sql` into
the Supabase SQL editor.

Enable the **Google** OAuth provider under Authentication → Providers if you
want "Continue with Google" to work.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Lint & build

```bash
npm run lint
npm run build
```

## Deployment

1. Push this repo to GitHub (already done ✅).
2. Import the repository into [Vercel](https://vercel.com/new).
3. Add the same environment variables from `.env.example` in the Vercel
   project settings.
4. Deploy. Supabase handles the database, auth, storage, and realtime layers.

## Project structure

```
src/
  app/                # Next.js App Router routes
    (auth)/login       # Sign in
    (auth)/signup      # Sign up
    auth/callback      # OAuth / email confirmation callback
    dashboard/         # Authenticated app shell
  components/          # Shared UI + providers
  features/            # Feature-folder modules (auth, courts, games, live)
  lib/supabase/         # Supabase client (browser/server/middleware) + types
supabase/
  migrations/          # SQL schema, PostGIS setup, RLS policies
```

## Roadmap

### Shipped

- [x] Next.js + TypeScript + Tailwind foundation
- [x] Supabase Auth (email/password + Google OAuth) with session-aware middleware
- [x] Landing page + authenticated dashboard shell
- [x] Initial database schema with PostGIS + Row Level Security for every table

### Next up (v1)

- [ ] User profile editing (name, photo, position, skill, home court)
- [ ] Court map (Mapbox), add-a-court flow, court detail + reviews
- [ ] Game creation, RSVP with capacity enforcement
- [ ] "Looking to play" discovery

### v2 (after v1 is solid)

- [ ] Live Game Mode: on-the-fly teams, real-time scoreboard, spectator links
- [ ] Stats engine built from the append-only `score_events` log
- [ ] Court reputation heatmaps, badges, leaderboards, social features

## Data model

Key entities (see `supabase/migrations/0001_initial_schema.sql` for full
detail): `profiles`, `courts`, `court_media`, `court_reviews`, `games`,
`game_rsvps`, `live_games`, `live_game_teams`, `live_game_team_players`, and
`score_events`. `score_events` is **append-only** — scores are always
derived by replaying events, never mutated in place, so we can rebuild
history, generate box scores, and compute stats reliably.
