"use client";

import { createElement, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, Crown, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { publicEnv } from "@/lib/env";

const free = ["Sandbox", "Local Duel", "Базовые темы", "Локальная история партии"];
const pro = ["Premium board skins", "Advanced AI Coach", "Расширенный review", "Выделение профиля", "Future tactical drills"];

export function PricingPageClient() {
  const { user, startDemoSession } = useAuth();
  const search = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const publishableKey = publicEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const pricingTableId = publicEnv.NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID;
  const paymentLink = publicEnv.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
  const canRenderPricingTable = Boolean(publishableKey && pricingTableId);
  const hasPaymentLink = Boolean(paymentLink);

  useEffect(() => {
    if (!canRenderPricingTable || document.querySelector("script[src='https://js.stripe.com/v3/pricing-table.js']")) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    document.body.appendChild(script);
  }, [canRenderPricingTable]);

  useEffect(() => {
    if (search.get("success")) setMessage("Оплата принята. Pro активируется после webhook-события Stripe.");
    if (search.get("canceled")) setMessage("Checkout отменен. Можно вернуться к оплате позже.");
  }, [search]);

  async function createCheckout() {
    if (!user) {
      setMessage("Сначала войдите в аккаунт, чтобы привязать Pro к профилю.");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? "Stripe checkout unavailable");
      window.location.href = data.url;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Stripe checkout unavailable");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <Badge><Crown className="size-3" /> Pricing</Badge>
        <h1 className="mt-5 font-display text-5xl font-semibold md:text-7xl">Upgrade to Pro</h1>
        <p className="mt-5 text-sm leading-6 text-muted-foreground md:text-base">
          Pro-модель добавляет premium skins и расширенный AI Coach. Stripe интеграция готова к production env vars и безопасно отключается без секретов.
        </p>
      </div>
      {message ? <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-primary/30 bg-primary/10 p-4 text-sm text-primary">{message}</div> : null}
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Plan name="Free" price="$0" items={free} cta={<Link className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border px-5 text-sm font-semibold" href="/play/local">Начать бесплатно</Link>} />
        <Plan
          highlighted
          name="Pro"
          price="$9/mo"
          items={pro}
          cta={
            hasPaymentLink ? (
              user ? <a className="inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground" href={paymentLink} target="_blank" rel="noreferrer">Upgrade to Pro</a> : <Link className="inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground" href="/login">Войти для Upgrade</Link>
            ) : (
              <Button className="w-full" onClick={createCheckout} disabled={busy || !user} type="button">{busy ? "Checkout..." : user ? "Upgrade to Pro" : "Войдите для оплаты"}</Button>
            )
          }
        />
      </div>
      {canRenderPricingTable && user ? (
        <Surface className="mt-8">
          <div className="mb-5 flex items-center gap-2"><Sparkles className="size-5 text-primary" /><h2 className="font-display text-2xl font-semibold">Stripe Pricing Table</h2></div>
          {createElement("stripe-pricing-table", { "pricing-table-id": pricingTableId, "publishable-key": publishableKey, "client-reference-id": user.id, "customer-email": user.email })}
        </Surface>
      ) : null}
      {!canRenderPricingTable && !hasPaymentLink ? (
        <Surface className="mt-8 border-dashed text-center">
          <h2 className="font-display text-2xl font-semibold">Stripe еще не активирован</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Добавьте `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + `NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID` для Pricing Table, `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` для Payment Link или `STRIPE_SECRET_KEY` + `STRIPE_PRO_PRICE_ID` для Checkout Session. Без них сайт работает без runtime errors.
          </p>
          {!user ? <Button className="mt-5" variant="secondary" onClick={startDemoSession} type="button">Демо-сессия</Button> : null}
        </Surface>
      ) : null}
    </section>
  );
}

function Plan({ name, price, items, cta, highlighted = false }: { name: string; price: string; items: string[]; cta: ReactNode; highlighted?: boolean }) {
  return (
    <Surface className={highlighted ? "border-primary/50 shadow-glow" : ""}>
      <p className="text-sm uppercase tracking-[0.25em] text-primary">{name}</p>
      <p className="mt-5 font-display text-5xl font-semibold">{price}</p>
      <div className="mt-6 grid gap-3">
        {items.map((item) => <div key={item} className="flex items-center gap-3 text-sm"><Check className="size-4 text-primary" /> {item}</div>)}
      </div>
      <div className="mt-8">{cta}</div>
    </Surface>
  );
}