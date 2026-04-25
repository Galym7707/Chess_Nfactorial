import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional().or(z.literal("")),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional().or(z.literal("")),
  NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID: z.string().min(1).optional().or(z.literal("")),
  NEXT_PUBLIC_STRIPE_PAYMENT_LINK: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().optional().or(z.literal("")),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID: process.env.NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID,
  NEXT_PUBLIC_STRIPE_PAYMENT_LINK: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK,
  NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
});

export function isSupabaseConfigured() {
  return Boolean(publicEnv.NEXT_PUBLIC_SUPABASE_URL && publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function isStripeClientConfigured() {
  return Boolean(publicEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && publicEnv.NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID);
}

export function appUrl() {
  return publicEnv.NEXT_PUBLIC_APP_URL || "http://localhost:7860";
}