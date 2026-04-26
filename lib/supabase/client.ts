import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getPublicEnv, isSupabaseConfigured, supabaseBrowserKey } from "@/lib/env";
import type { Database } from "@/types/database";

let client: SupabaseClient<Database> | null = null;
let clientSignature = "";

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;

  const env = getPublicEnv();
  const browserKey = supabaseBrowserKey();
  const signature = `${env.NEXT_PUBLIC_SUPABASE_URL}|${browserKey}`;

  if (!client || clientSignature !== signature) {
    client = createClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL as string,
      browserKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
        realtime: {
          params: { eventsPerSecond: 8 },
        },
      },
    );
    clientSignature = signature;
  }

  return client;
}
