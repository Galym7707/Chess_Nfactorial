---
title: Code Gambit
emoji: в™џпёЏ
colorFrom: green
colorTo: yellow
sdk: docker
app_port: 7860
fullWidth: true
header: default
short_description: Chess for builders with AI Coach.
---

# Code Gambit

**РЁР°С…РјР°С‚С‹ РґР»СЏ С‚РµС…, РєС‚Рѕ Р»СЋР±РёС‚ СѓРјРЅС‹Рµ С†РёС„СЂРѕРІС‹Рµ РїСЂРѕРґСѓРєС‚С‹.**

Code Gambit вЂ” С†РµР»СЊРЅС‹Р№ Next.js startup-РїСЂРѕС‚РѕС‚РёРї: Sandbox, Local Duel, AI Arena Рё Play with Friend СЃРѕР±СЂР°РЅС‹ РІ РѕРґРёРЅ РїСЂРѕРґСѓРєС‚ СЃ РѕР±С‰РёРј Р±СЂРµРЅРґРѕРј, РЅР°РІРёРіР°С†РёРµР№, Supabase Auth/Realtime/Postgres, Stripe-ready Pro РјРѕРґРµР»СЊСЋ Рё AI Coach, РєРѕС‚РѕСЂС‹Р№ РѕР±СЉСЏСЃРЅСЏРµС‚ РїР°СЂС‚РёСЋ РІ СЃС‚РёР»Рµ code review.

Live demo: `https://galym7707-chess-nfactorial.hf.space`  
GitHub repo: `https://github.com/<your-org>/<your-repo>`

## Р”Р»СЏ РєРѕРіРѕ

- Р Р°Р·СЂР°Р±РѕС‚С‡РёРєРё, РєРѕС‚РѕСЂС‹Рј Р±Р»РёР·РѕРє СЃС‚РёР»СЊ code review Рё РїРѕРЅСЏС‚РЅС‹Рµ РѕР±СЉСЏСЃРЅРµРЅРёСЏ РѕС€РёР±РѕРє.
- РЎС‚СѓРґРµРЅС‚С‹ Рё РёРіСЂРѕРєРё, РєРѕС‚РѕСЂС‹Рј РЅСѓР¶РµРЅ growth-oriented РёРЅС‚РµСЂС„РµР№СЃ Р±РµР· С€СѓРјР°.
- РљРѕРЅРєСѓСЂСЃРЅР°СЏ РґРµРјРѕРЅСЃС‚СЂР°С†РёСЏ, РіРґРµ РІР°Р¶РЅРѕ РїРѕРєР°Р·Р°С‚СЊ РЅРµ С‚РѕР»СЊРєРѕ РґРѕСЃРєСѓ, РЅРѕ Рё РїСЂРѕРґСѓРєС‚РѕРІСѓСЋ Р°СЂС…РёС‚РµРєС‚СѓСЂСѓ.

## РџРѕС‡РµРјСѓ СЌС‚Рѕ РЅРµ РѕР±С‹С‡РЅС‹Р№ chessboard demo

- AI Coach РєР»Р°СЃСЃРёС„РёС†РёСЂСѓРµС‚ С…РѕРґС‹: `best`, `excellent`, `good`, `inaccuracy`, `mistake`, `blunder`.
- Review РёСЃРїРѕР»СЊР·СѓРµС‚ Stockfish browser-side С‡РµСЂРµР· Web Worker Рё СЂСѓСЃСЃРєРёРµ С€Р°Р±Р»РѕРЅС‹ РѕР±СЉСЏСЃРЅРµРЅРёР№.
- Multiplayer СЃРґРµР»Р°РЅ С‡РµСЂРµР· Supabase rooms, Presence, Realtime Рё DB `version` РґР»СЏ Р·Р°С‰РёС‚С‹ РѕС‚ СЂР°СЃСЃРёРЅС…СЂРѕРЅРёР·Р°С†РёРё.
- Р•СЃС‚СЊ SaaS-СЃР»РѕР№: РїСЂРѕС„РёР»СЊ, РёСЃС‚РѕСЂРёСЏ, Р»РёРґРµСЂР±РѕСЂРґ РїРѕ РіРѕСЂРѕРґР°Рј, Pro skins Рё Stripe-ready checkout.
- Mobile-first: РєРІР°РґСЂР°С‚РЅР°СЏ РґРѕСЃРєР°, РєСЂСѓРїРЅС‹Рµ touch controls, РїР°РЅРµР»Рё СѓС…РѕРґСЏС‚ РІРЅРёР·.

## РњР°РїРїРёРЅРі РЅР° 4 СѓСЂРѕРІРЅСЏ Р·Р°РґР°РЅРёСЏ

| РЈСЂРѕРІРµРЅСЊ | Р РµР¶РёРј | Р§С‚Рѕ СЂРµР°Р»РёР·РѕРІР°РЅРѕ |
|---|---|---|
| РЎР»Р°Р±С‹Р№ | `/play/sandbox` | Static 8x8 board, СЃРІРѕР±РѕРґРЅС‹Р№ drag/click move Р±РµР· РїСЂРѕРІРµСЂРєРё РїСЂР°РІРёР», `Rules Off`, reset. |
| РЎСЂРµРґРЅРёР№ | `/play/local` | Р”РІР° РёРіСЂРѕРєР° РЅР° РѕРґРЅРѕРј СЌРєСЂР°РЅРµ, chess.js validation, СЂРѕРєРёСЂРѕРІРєР°, en passant, promotion, С€Р°С…/РјР°С‚/РїР°С‚/РЅРёС‡СЊРё, history, undo, FEN/PGN, localStorage restore. |
| РЎРёР»СЊРЅС‹Р№ | `/play/ai` | Stockfish AI РІ Web Worker, 4 СЃР»РѕР¶РЅРѕСЃС‚Рё, auth gate, СЃРѕС…СЂР°РЅРµРЅРёРµ РїР°СЂС‚РёРё, РёСЃС‚РѕСЂРёСЏ, С‚РµРјС‹, mobile UX. |
| Р’РµР»РёРєРёР№ | `/play/friend` Рё `/play/friend/[roomId]` | РЎРѕР·РґР°РЅРёРµ РєРѕРјРЅР°С‚С‹, invite link, Supabase Realtime sync, Presence online, reconnect restore, DB version guard. |

## РЎС‚РµРє

- Next.js App Router + TypeScript strict
- Tailwind CSS + custom design system
- react-chessboard + chess.js
- stockfish.js browser worker
- Supabase Auth, Postgres, Realtime, RLS
- Stripe Billing/Checkout-ready integration
- zod, lucide-react, framer-motion
- Vitest + Testing Library
- Docker Space РґР»СЏ Hugging Face

## РђСЂС…РёС‚РµРєС‚СѓСЂР°

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

## Р›РѕРєР°Р»СЊРЅС‹Р№ Р·Р°РїСѓСЃРє

```bash
npm install
cp .env.example .env.local
npm run dev
```

РћС‚РєСЂРѕР№С‚Рµ `http://localhost:7860`.

Р‘РµР· Supabase/Stripe env vars СЃР°Р№С‚ Р·Р°РїСѓСЃРєР°РµС‚СЃСЏ РІ controlled demo mode. Auth-gated СЂРµР¶РёРјС‹ РїСЂРµРґР»Р°РіР°СЋС‚ Р»РѕРєР°Р»СЊРЅСѓСЋ РґРµРјРѕ-СЃРµСЃСЃРёСЋ, РїР»Р°С‚РµР¶Рё РїРѕРєР°Р·С‹РІР°СЋС‚ disabled-state.

## РџСЂРѕРІРµСЂРєРё

```bash
npm run typecheck
npm test
npm run build
```

## Hugging Face Space deploy

Space РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ Docker Space. Р”Р»СЏ СѓР¶Рµ СЃРѕР·РґР°РЅРЅРѕРіРѕ Gradio Space РґРѕСЃС‚Р°С‚РѕС‡РЅРѕ СЃРѕС…СЂР°РЅРёС‚СЊ YAML metadata РІ РЅР°С‡Р°Р»Рµ README СЃ `sdk: docker` Рё `app_port: 7860`, Р·Р°С‚РµРј Р·Р°РїСѓС€РёС‚СЊ СЂРµРїРѕР·РёС‚РѕСЂРёР№.

```bash
git init
git add .
git commit -m "Build Code Gambit Next.js Docker Space"
git remote add space https://huggingface.co/spaces/Galym7707/Chess_Nfactorial
git push -u space main
```

Next.js production server РІРЅСѓС‚СЂРё Docker СЃР»СѓС€Р°РµС‚ `0.0.0.0:7860` С‡РµСЂРµР· `PORT=7860` Рё `HOSTNAME=0.0.0.0`.

## Supabase setup

1. РЎРѕР·РґР°Р№С‚Рµ Supabase project.
2. Р’С‹РїРѕР»РЅРёС‚Рµ SQL РёР· `supabase/migrations/001_initial_schema.sql` РІ SQL Editor РёР»Рё С‡РµСЂРµР· Supabase CLI.
3. Р’РєР»СЋС‡РёС‚Рµ Email/password provider РІ Supabase Auth.
4. Р”РѕР±Р°РІСЊС‚Рµ env vars:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

RLS РІРєР»СЋС‡РµРЅ РґР»СЏ РІСЃРµС… РїРѕР»СЊР·РѕРІР°С‚РµР»СЊСЃРєРёС… С‚Р°Р±Р»РёС†. РљР»РёРµРЅС‚ РёСЃРїРѕР»СЊР·СѓРµС‚ С‚РѕР»СЊРєРѕ anon key; service role key РёСЃРїРѕР»СЊР·СѓРµС‚СЃСЏ С‚РѕР»СЊРєРѕ server-side webhook route.

## Stripe setup

Р•СЃС‚СЊ С‚СЂРё РїРѕРґРґРµСЂР¶Р°РЅРЅС‹С… РїСѓС‚Рё:

1. Pricing Table: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + `NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID`.
2. Payment Link: `NEXT_PUBLIC_STRIPE_PAYMENT_LINK`.
3. Checkout Session: `STRIPE_SECRET_KEY` + `STRIPE_PRO_PRICE_ID` + webhook `STRIPE_WEBHOOK_SECRET`.

Webhook endpoint:

```text
POST /api/stripe/webhook
```

РџСЂРё `checkout.session.completed` СЃРµСЂРІРµСЂРЅР°СЏ route С‡РµСЂРµР· Supabase service role Р·Р°РїРёСЃС‹РІР°РµС‚ `purchases`, РІРєР»СЋС‡Р°РµС‚ `profiles.is_pro` Рё РІС‹РґР°РµС‚ premium skins РІ `user_inventory`.

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

## Р”РѕРєСѓРјРµРЅС‚РёСЂРѕРІР°РЅРЅС‹Рµ РѕСЃРЅРѕРІР°РЅРёСЏ

- Hugging Face Docker Spaces support `sdk: docker` and `app_port` in README metadata: https://huggingface.co/docs/hub/en/spaces-sdks-docker
- Next.js standalone output creates `.next/standalone` for production Docker deployments: https://nextjs.org/docs/app/api-reference/config/next-config-js/output
- Supabase Auth supports email/password sign-in via JavaScript SDK: https://supabase.com/docs/reference/javascript/auth-signinwithpassword
- Supabase Realtime supports Postgres Changes channel subscriptions: https://supabase.com/docs/guides/realtime/postgres-changes
- Supabase RLS policies commonly use `auth.uid()` for row ownership checks: https://supabase.com/docs/guides/auth/auth-deep-dive/auth-row-level-security
- Stripe Checkout Sessions support subscription mode with Prices: https://docs.stripe.com/payments/subscriptions

## Р§С‚Рѕ СѓР»СѓС‡С€РёС‚СЊ РґР°Р»СЊС€Рµ

- Add server-side authoritative chess validation for multiplayer moves with Supabase Edge Functions.
- Add tactical drills generated from user blunders.
- Add Stripe Customer Portal for self-service subscription management.
- Add Redis-like ephemeral clock sync if timed games are added.
- Add Playwright E2E tests for full game flows.