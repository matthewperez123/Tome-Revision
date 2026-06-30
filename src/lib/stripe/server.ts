import "server-only"
import Stripe from "stripe"

/**
 * Lazily constructs the server-side Stripe client. Returns null when
 * `STRIPE_SECRET_KEY` is absent so routes can degrade gracefully (501)
 * instead of throwing at module load — mirrors the liveblocks-auth pattern.
 */
let cached: Stripe | null = null

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  if (!cached) cached = new Stripe(key)
  return cached
}
