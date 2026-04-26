import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional().or(z.literal("")),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional().or(z.literal("")),
  NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID: z.string().min(1).optional().or(z.literal("")),
  NEXT_PUBLIC_STRIPE_PAYMENT_LINK: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().optional().or(z.literal("")),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

function parsePublicEnv(input: Partial<Record<keyof PublicEnv, string | undefined>>): PublicEnv {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: input.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: input.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: input.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: input.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: input.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID: input.NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID,
    NEXT_PUBLIC_STRIPE_PAYMENT_LINK: input.NEXT_PUBLIC_STRIPE_PAYMENT_LINK,
    NEXT_PUBLIC_DEFAULT_LOCALE: input.NEXT_PUBLIC_DEFAULT_LOCALE,
  });
}

const buildTimePublicEnv = parsePublicEnv({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID: process.env.NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID,
  NEXT_PUBLIC_STRIPE_PAYMENT_LINK: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK,
  NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
});

let runtimePublicEnv = buildTimePublicEnv;

export const publicEnv = buildTimePublicEnv;

export function setRuntimePublicEnv(env: Partial<PublicEnv>) {
  runtimePublicEnv = parsePublicEnv({ ...runtimePublicEnv, ...env });
  return runtimePublicEnv;
}

export function getPublicEnv() {
  return runtimePublicEnv;
}

export async function loadRuntimePublicEnv() {
  if (typeof window === "undefined") return runtimePublicEnv;
  const response = await fetch("/api/public-env", { cache: "no-store" });
  if (!response.ok) return runtimePublicEnv;
  const env = await response.json() as Partial<PublicEnv>;
  return setRuntimePublicEnv(env);
}

export function isSupabaseConfigured() {
  const env = getPublicEnv();
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && supabaseBrowserKey());
}

export function supabaseBrowserKey() {
  const env = getPublicEnv();
  return env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
}

export function isStripeClientConfigured() {
  const env = getPublicEnv();
  return Boolean(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && env.NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID);
}

export function appUrl() {
  return getPublicEnv().NEXT_PUBLIC_APP_URL || "http://localhost:7860";
}
