/**
 * Supabase Server Client
 *
 * Use this in Server Components, Route Handlers, and Server Actions.
 * Creates a new client per request with cookie-based auth.
 *
 * Note: cookies() is async in Next.js 15.
 */

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Build-time-safe placeholders so static prerender doesn't throw when
// env vars are not in scope. Real env vars are required at runtime.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // setAll can be called from Server Components where cookies
            // can't be set. The middleware handles refreshing sessions.
          }
        },
      },
    },
  )
}
