import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

const schema = z.object({
  userId: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:7860";

  if (!secretKey || !priceId) {
    return NextResponse.json({ error: "Stripe Checkout Session is disabled until STRIPE_SECRET_KEY and STRIPE_PRO_PRICE_ID are set." }, { status: 503 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });

  const stripe = new Stripe(secretKey, { apiVersion: "2026-04-22.dahlia" });
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: parsed.data.email,
    client_reference_id: parsed.data.userId,
    metadata: { user_id: parsed.data.userId, product: "code_gambit_pro" },
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/pricing?success=true`,
    cancel_url: `${appUrl}/pricing?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}