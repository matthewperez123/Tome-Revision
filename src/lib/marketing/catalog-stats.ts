/**
 * Single source of truth for the live catalog stats (how many books, how many
 * traditions) that the marketing surface quotes. The numbers are COMPUTED from
 * Supabase, never hardcoded, so the homepage / pricing / FAQ never drift from
 * reality as the library grows.
 *
 * `getCatalogStats()` is a cached server fetch (deduped per request, resolved
 * once per build for statically-rendered pages). The formatting helpers are
 * pure and client-safe so a client component can render a stats object it was
 * handed via props/context.
 */
import { cache } from "react"

export interface CatalogStats {
  /** Total rows in the `books` table. */
  bookCount: number
  /** Curated literary traditions (rows in the `traditions` table). */
  traditionCount: number
}

/**
 * Build-safe fallback used only when Supabase is unreachable (e.g. a paused
 * project at build time, or missing env). Mirrors the live numbers so a
 * degraded build still ships truthful copy.
 */
export const DEFAULT_CATALOG_STATS: CatalogStats = {
  bookCount: 1280,
  traditionCount: 16,
}

/**
 * Count books and traditions straight from Supabase. Reads are public (anon
 * RLS) so this uses a plain anon client — no request cookies — which keeps it
 * usable during static prerender. Wrapped in React `cache()` so the two count
 * queries run at most once per render pass.
 */
export const getCatalogStats = cache(async (): Promise<CatalogStats> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return DEFAULT_CATALOG_STATS

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const [books, traditions] = await Promise.all([
      supabase.from("books").select("*", { count: "exact", head: true }),
      supabase.from("traditions").select("*", { count: "exact", head: true }),
    ])

    return {
      bookCount: books.count ?? DEFAULT_CATALOG_STATS.bookCount,
      traditionCount: traditions.count ?? DEFAULT_CATALOG_STATS.traditionCount,
    }
  } catch {
    return DEFAULT_CATALOG_STATS
  }
})

// ── FORMATTING (pure, client-safe) ───────────────────────────────────

/** "1,280+" — floored to the nearest ten so the "+" never overstates. */
export function formatBookCount(count: number): string {
  const floored = Math.floor(count / 10) * 10
  return `${floored.toLocaleString("en-US")}+`
}

/** "16 traditions". */
export function formatTraditionCount(count: number): string {
  return `${count} tradition${count === 1 ? "" : "s"}`
}

/** "1,280+ books across 16 traditions" — the one combined phrase used everywhere. */
export function catalogSummary(stats: CatalogStats): string {
  return `${formatBookCount(stats.bookCount)} books across ${formatTraditionCount(
    stats.traditionCount,
  )}`
}
