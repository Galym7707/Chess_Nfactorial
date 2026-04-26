---
title: Code Gambit
emoji: ♟️
colorFrom: green
colorTo: yellow
sdk: docker
app_port: 7860
fullWidth: true
header: default
short_description: Chess for builders with AI Coach.
---

# Code Gambit

Code Gambit is a production-ready Next.js chess platform for Hugging Face Docker Spaces. It combines four assignment levels in one product: free sandbox play, local two-player chess, Stockfish-powered AI play, and Supabase Realtime rooms by invite link.

Live demo: https://galym7707-chess-nfactorial.hf.space

GitHub repo: https://github.com/Galym7707/Chess_Nfactorial

## What is included

- Marketing homepage with Russian UI, responsive navigation, light/dark theme support, pricing and profile routes.
- Sandbox mode with an 8x8 board where pieces can be moved freely without rule validation.
- Local Duel mode with chess.js validation, castling, en passant, promotion, check, mate, stalemate, draw state, undo, FEN/PGN export and localStorage restore.
- AI Arena mode with browser-side Stockfish assets, difficulty presets and post-game review flow.
- Play with Friend mode with Supabase room persistence, invite links, Realtime broadcast and presence handling.
- History, review, leaderboard, profile, login and pricing pages.
- Supabase SQL migration with tables and RLS policies for profiles, games, moves, rooms, coach reports, purchases and inventory.
- Stripe-ready pricing architecture with graceful fallback when payment environment variables are not configured.
- Dockerfile configured for Hugging Face Spaces on port 7860.

## Why it is different

Code Gambit is not a plain chessboard demo. The product direction is chess training for developers, students and ambitious players who want clear analysis, saved progress, multiplayer rooms and a monetizable Pro layer in one coherent web app.

## Assignment Mapping

| Level | Route | Implementation |
|---|---|---|
| Weak | `/play/sandbox` | Static board, free movement, Rules Off state and reset. |
| Medium | `/play/local` | Full local game using chess.js with legal moves, special moves, game state, history, undo, FEN/PGN and local restore. |
| Strong | `/play/ai` | Auth-gated AI mode, Stockfish worker integration, difficulty presets, saved games and review flow. |
| Great | `/play/friend` and `/play/friend/[roomId]` | Invite rooms, Supabase persistence, realtime move sync, presence and reconnect restore. |

## Stack

- Next.js App Router, TypeScript strict, React
- Tailwind CSS and custom UI components
- chess.js and react-chessboard
- stockfish.js copied into public runtime assets during install/build
- Supabase Auth, Postgres, Realtime and RLS
- Stripe Checkout/Billing-ready routes
- zod, lucide-react, framer-motion
- Vitest and Testing Library
- Docker deployment for Hugging Face Spaces

## Architecture

```text
app/                 App Router pages and route handlers
components/          UI, layout, auth, chess, pricing and leaderboard components
hooks/               Stockfish and multiplayer hooks
lib/chess/           chess.js helpers and board themes
lib/engine/          Stockfish worker client
lib/coach/           post-game review analysis
lib/db/              Supabase/local fallback data access
lib/multiplayer/     room creation, join and move persistence
lib/supabase/        browser/server Supabase clients
supabase/migrations/ SQL schema and RLS policies
workers/             Stockfish worker marker
public/              static runtime assets
```

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:7860`.

Local secrets go into `.env.local` at the repository root, next to `package.json`. Do not commit `.env.local`.

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=
NEXT_PUBLIC_DEFAULT_LOCALE=ru
STRIPE_PRO_PRICE_ID=
```

For Hugging Face Spaces, add these in Space settings under Variables and secrets, then restart or rebuild the Space. Use secrets for private keys such as `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and any Hugging Face access token. The browser client can use either `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial_schema.sql` in Supabase SQL Editor or through Supabase CLI.
3. Enable the chosen email/password auth provider.
4. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to the runtime environment.

The browser client only uses the anon key. The service role key is reserved for server-side routes such as Stripe webhook handling.

## Stripe Setup

Supported payment paths:

1. Pricing Table: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + `NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID`.
2. Payment Link: `NEXT_PUBLIC_STRIPE_PAYMENT_LINK`.
3. Checkout Session: `STRIPE_SECRET_KEY` + `STRIPE_PRO_PRICE_ID` with webhook secret `STRIPE_WEBHOOK_SECRET`.

Webhook endpoint:

```text
POST /api/stripe/webhook
```

If Stripe variables are missing, the pricing page renders a safe disabled/demo state instead of crashing.

## Commands

```bash
npm run typecheck
npm test
npm run build
npm run start
```

## Hugging Face Deploy

The Space uses Docker SDK through README metadata:

```yaml
sdk: docker
app_port: 7860
```

The Docker image starts the Next.js standalone server on `0.0.0.0:7860`.

## Third-Party / Attribution

- Stockfish / stockfish.js: chess engine distribution. This repository uses GPL-3.0-only for compatibility.
- chess.js: legal move validation and PGN/FEN utilities.
- react-chessboard: chessboard UI.
- Supabase: Auth, Postgres and Realtime.
- Stripe: checkout and billing infrastructure.
- Next.js, React, Tailwind CSS and supporting open-source packages.

## Sources

- Hugging Face Docker Spaces metadata and `app_port`: https://huggingface.co/docs/hub/en/spaces-sdks-docker
- Next.js standalone output: https://nextjs.org/docs/app/api-reference/config/next-config-js/output
- Supabase row level security and `auth.uid()`: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Realtime: https://supabase.com/docs/guides/realtime
- Stripe Checkout Sessions: https://docs.stripe.com/payments/checkout

## Future Improvements

- Server-side authoritative validation for multiplayer moves through Supabase Edge Functions.
- Tactical drills generated from saved mistakes.
- Stripe Customer Portal for subscription management.
- End-to-end tests for full game flows.
