/**
 * Pure, client-safe helpers for paid reader tiers.
 *
 * Stripe Price IDs live in `src/lib/stripe/prices.ts` (server-only,
 * env-sourced) — never hardcode a Stripe price/product ID in the codebase.
 */
export type PaidTier = "solo" | "family" | "school"

export function isPaidTier(value: string): value is PaidTier {
  return value === "solo" || value === "family" || value === "school"
}
