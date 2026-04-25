import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, publicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

let client: SupabaseClient<Database> | null = null;

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient<Database>(
      publicEnv.NEXT_PUBLIC_SUPABASE_URL as string,
      publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
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
  }
  return client;
}