/**
 * Pure, client-safe helpers for paid tiers as stored on `subscriptions.tier`.
 *
 * `solo` is grandfathered only — it is never sold, but existing rows must
 * keep resolving. Stripe Price IDs live in `src/lib/billing/prices.ts`
 * (server-only, env-sourced) — never hardcode a Stripe price/product ID.
 */
export type PaidTier = "classroom" | "school" | "family" | "solo"

export function isPaidTier(value: string): value is PaidTier {
  return (
    value === "classroom" ||
    value === "school" ||
    value === "family" ||
    value === "solo" // grandfathered — remove only when subscriptions has zero solo rows
  )
}
