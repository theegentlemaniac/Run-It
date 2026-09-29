/**
 * Supabase client for use in Client Components.
 *
 * This client reads/writes the auth session via cookies (through
 * `@supabase/ssr`) so the session stays in sync with the server client.
 */
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
