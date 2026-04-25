---
title: Code Gambit
emoji: ♟️
colorFrom: emerald
colorTo: amber
sdk: docker
app_port: 7860
fullWidth: true
header: default
short_description: Chess for builders with AI Coach code-review style, realtime rooms, leaderboard and Pro layer.
---

# Code Gambit

**Шахматы для тех, кто любит умные цифровые продукты.**

Code Gambit — цельный Next.js startup-прототип: Sandbox, Local Duel, AI Arena и Play with Friend собраны в один продукт с общим брендом, навигацией, Supabase Auth/Realtime/Postgres, Stripe-ready Pro моделью и AI Coach, который объясняет партию в стиле code review.

Live demo: `https://galym7707-chess-nfactorial.hf.space`  
GitHub repo: `https://github.com/<your-org>/<your-repo>`

## Для кого

- Разработчики, которым близок стиль code review и понятные объяснения ошибок.
- Студенты и игроки, которым нужен growth-oriented интерфейс без шума.
- Конкурсная демонстрация, где важно показать не только доску, но и продуктовую архитектуру.

## Почему это не обычный chessboard demo

- AI Coach классифицирует ходы: `best`, `excellent`, `good`, `inaccuracy`, `mistake`, `blunder`.
- Review использует Stockfish browser-side через Web Worker и русские шаблоны объяснений.
- Multiplayer сделан через Supabase rooms, Presence, Realtime и DB `version` для защиты от рассинхронизации.
- Есть SaaS-слой: профиль, история, лидерборд по городам, Pro skins и Stripe-ready checkout.
- Mobile-first: квадратная доска, крупные touch controls, панели уходят вниз.

## Маппинг на 4 уровня задания

| Уровень | Режим | Что реализовано |
|---|---|---|
| Слабый | `/play/sandbox` | Static 8x8 board, свободный drag/click move без проверки правил, `Rules Off`, reset. |
| Средний | `/play/local` | Два игрока на одном экране, chess.js validation, рокировка, en passant, promotion, шах/мат/пат/ничьи, history, undo, FEN/PGN, localStorage restore. |
| Сильный | `/play/ai` | Stockfish AI в Web Worker, 4 сложности, auth gate, сохранение партии, история, темы, mobile UX. |
| Великий | `/play/friend` и `/play/friend/[roomId]` | Создание комнаты, invite link, Supabase Realtime sync, Presence online, reconnect restore, DB version guard. |

## Стек

- Next.js App Router + TypeScript strict
- Tailwind CSS + custom design system
- react-chessboard + chess.js
- stockfish.js browser worker
- Supabase Auth, Postgres, Realtime, RLS
- Stripe Billing/Checkout-ready integration
- zod, lucide-react, framer-motion
- Vitest + Testing Library
- Docker Space для Hugging Face

## Архитектура

```text
app/                 App Router pages and route handlers
components/          UI, layout, auth, chess, pricing, leaderboard components
hooks/               Stockfish and multiplayer hooks
lib/chess/           chess.js core helpers and board themes
lib/engine/          Stockfish worker client
lib/coach/           post-game review analysis
lib/db/              Supabase/local fallback data access
lib/multiplayer/     room creation, join, move persistence
lib/supabase/        browser/server Supabase clients
supabase/migrations/ SQL schema and RLS policies
workers/             Stockfish worker marker; runtime asset copied to public/stockfish
public/              static runtime assets
```

## Локальный запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

Откройте `http://localhost:7860`.

Без Supabase/Stripe env vars сайт запускается в controlled demo mode. Auth-gated режимы предлагают локальную демо-сессию, платежи показывают disabled-state.

## Проверки

```bash
npm run typecheck
npm test
npm run build
```

## Hugging Face Space deploy

Space должен быть Docker Space. Для уже созданного Gradio Space достаточно сохранить YAML metadata в начале README с `sdk: docker` и `app_port: 7860`, затем запушить репозиторий.

```bash
git init
git add .
git commit -m "Build Code Gambit Next.js Docker Space"
git remote add space https://huggingface.co/spaces/Galym7707/Chess_Nfactorial
git push -u space main
```

Next.js production server внутри Docker слушает `0.0.0.0:7860` через `PORT=7860` и `HOSTNAME=0.0.0.0`.

## Supabase setup

1. Создайте Supabase project.
2. Выполните SQL из `supabase/migrations/001_initial_schema.sql` в SQL Editor или через Supabase CLI.
3. Включите Email/password provider в Supabase Auth.
4. Добавьте env vars:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

RLS включен для всех пользовательских таблиц. Клиент использует только anon key; service role key используется только server-side webhook route.

## Stripe setup

Есть три поддержанных пути:

1. Pricing Table: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + `NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID`.
2. Payment Link: `NEXT_PUBLIC_STRIPE_PAYMENT_LINK`.
3. Checkout Session: `STRIPE_SECRET_KEY` + `STRIPE_PRO_PRICE_ID` + webhook `STRIPE_WEBHOOK_SECRET`.

Webhook endpoint:

```text
POST /api/stripe/webhook
```

При `checkout.session.completed` серверная route через Supabase service role записывает `purchases`, включает `profiles.is_pro` и выдает premium skins в `user_inventory`.

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
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

## Third-Party / Attribution

- Stockfish / stockfish.js: GPL-3.0 chess engine distribution. This repository uses GPL-3.0-only for compatibility.
- chess.js: legal move validation and PGN/FEN utilities.
- react-chessboard: chessboard UI.
- Supabase: Auth, Postgres, Realtime.
- Stripe: Billing/Checkout payment infrastructure.
- Next.js, React, Tailwind CSS and supporting OSS packages.

## Документированные основания

- Hugging Face Docker Spaces support `sdk: docker` and `app_port` in README metadata: https://huggingface.co/docs/hub/en/spaces-sdks-docker
- Next.js standalone output creates `.next/standalone` for production Docker deployments: https://nextjs.org/docs/app/api-reference/config/next-config-js/output
- Supabase Auth supports email/password sign-in via JavaScript SDK: https://supabase.com/docs/reference/javascript/auth-signinwithpassword
- Supabase Realtime supports Postgres Changes channel subscriptions: https://supabase.com/docs/guides/realtime/postgres-changes
- Supabase RLS policies commonly use `auth.uid()` for row ownership checks: https://supabase.com/docs/guides/auth/auth-deep-dive/auth-row-level-security
- Stripe Checkout Sessions support subscription mode with Prices: https://docs.stripe.com/payments/subscriptions

## Что улучшить дальше

- Add server-side authoritative chess validation for multiplayer moves with Supabase Edge Functions.
- Add tactical drills generated from user blunders.
- Add Stripe Customer Portal for self-service subscription management.
- Add Redis-like ephemeral clock sync if timed games are added.
- Add Playwright E2E tests for full game flows.