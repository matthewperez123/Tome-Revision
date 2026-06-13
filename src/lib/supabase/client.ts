/**
 * Supabase Browser Client
 *
 * Use this in Client Components ("use client").
 * Creates a singleton browser client with cookie-based auth.
 */

import { createBrowserClient } from "@supabase/ssr"

// Build-time-safe placeholders so static prerender doesn't throw when
// env vars are not in scope (e.g. preview build without Vercel env).
// Real env vars are required at runtime for any actual API call to succeed.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"

const createSupabaseBrowserClient = () =>
  createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)

type BrowserClient = ReturnType<typeof createSupabaseBrowserClient>

export function createClient() {
  if (typeof window === "undefined") return createSupabaseBrowserClient()

  const browserWindow = window as typeof window & {
    __tomeSupabaseClient?: BrowserClient
  }
  browserWindow.__tomeSupabaseClient ??= createSupabaseBrowserClient()
  return browserWindow.__tomeSupabaseClient
}
