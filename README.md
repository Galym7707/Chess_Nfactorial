---
title: Code Gambit
emoji: ♟️
colorFrom: green
colorTo: yellow
sdk: docker
app_port: 7860
fullWidth: true
header: default
short_description: Chess with Stockfish and online rooms.
---

# Code Gambit

Современная шахматная платформа для игры, анализа позиций и прогресса. В одном сайте есть редактор доски, анализ Stockfish, партия за одной доской, игра против движка, онлайн-комнаты по ссылке, история партий, профиль и тариф Pro.

Live demo: https://galym7707-chess-nfactorial.hf.space

GitHub repo: https://github.com/Galym7707/Chess_Nfactorial

## Что сделано

- Главная страница с русским интерфейсом, адаптивной навигацией, светлой и темной темой.
- Редактор позиции: свободная расстановка фигур, выбор стороны хода, очистка доски, начальная позиция, FEN и анализ Stockfish.
- Партия за доской: легальные ходы, рокировка, взятие на проходе, превращение пешки, мат, пат, ничьи, история ходов, отмена, FEN/PGN и восстановление после перезагрузки.
- Игра против движка: Stockfish в браузере, уровни силы, сохранение партии и разбор после завершения.
- Игра с другом: комната по ссылке, сохранение позиции, синхронизация ходов, статус игроков и восстановление после переподключения.
- История, детальный разбор партии, лидерборд, профиль, вход и тарифы.
- Supabase SQL migration с таблицами и RLS policies для профилей, партий, ходов, комнат, разборов, покупок и инвентаря.
- Stripe-ready тариф Pro с безопасным fallback, если платежные ключи еще не добавлены.
- Dockerfile для Hugging Face Spaces на порту 7860.

## Для кого

Code Gambit рассчитан на шахматистов, которым нужен аккуратный веб-инструмент: быстро собрать позицию, проверить вариант движком, сыграть партию, пригласить друга и вернуться к истории своих игр.

## Почему это не просто доска

Обычная доска показывает фигуры. Code Gambit добавляет рабочий слой вокруг партии: редактор позиций, анализ Stockfish, сохранение истории, онлайн-комнаты и понятный разбор ключевых ошибок после игры.

## Основные сценарии

| Сценарий | Route | Что внутри |
|---|---|---|
| Редактор позиции | `/play/sandbox` | Свободная расстановка, FEN, выбор стороны хода, анализ Stockfish. |
| Партия за доской | `/play/local` | Полные правила шахмат, специальные ходы, история, undo, FEN/PGN, localStorage restore. |
| Против движка | `/play/ai` | Stockfish worker, уровни силы, сохранение игры, post-game review. |
| Онлайн с другом | `/play/friend` и `/play/friend/[roomId]` | Ссылка-приглашение, сохранение комнаты, синхронизация ходов, статус игроков и восстановление после переподключения. |

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

The browser client only uses the anon/publishable key. The service role key is reserved for server-side routes such as Stripe webhook handling.

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
