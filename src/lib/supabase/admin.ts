/**
 * Supabase Admin Client (service-role).
 *
 * Bypasses RLS. Only use from server-only code paths:
 *   - Hard account deletion (auth.admin.deleteUser)
 *   - The auth email hook handler
 *   - Anywhere that explicitly needs to read/write across users
 *
 * The `import 'server-only'` directive prevents accidental inclusion in any
 * client bundle — the build will fail loudly if a client component imports it.
 */

import "server-only"

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key"

let cached: ReturnType<typeof createClient> | null = null

export function createAdminClient() {
  if (cached) return cached
  cached = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
  return cached
}
