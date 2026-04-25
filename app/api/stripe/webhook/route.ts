import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) return NextResponse.json({ received: false, error: "Stripe webhook is not configured" }, { status: 503 });

  const stripe = new Stripe(secretKey, { apiVersion: "2026-04-22.dahlia" });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id ?? session.client_reference_id;
    const supabase = getSupabaseServiceClient();
    if (userId && supabase) {
      await supabase.from("purchases").insert({
        user_id: userId,
        product: "code_gambit_pro",
        status: "active",
        stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
        stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null,
      });
      await supabase.from("profiles").update({ is_pro: true }).eq("id", userId);
      await supabase.from("user_inventory").upsert([
        { user_id: userId, item_key: "board_neon", item_type: "board_skin" },
        { user_id: userId, item_key: "board_paper", item_type: "board_skin" },
      ]);
    }
  }

  return NextResponse.json({ received: true });
}