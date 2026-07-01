import "server-only"
import Stripe from "stripe"
import { stripeKeyMode } from "@/lib/stripe/prices"

/**
 * Lazily constructs the server-side Stripe client. Returns null when
 * `STRIPE_SECRET_KEY` is absent so routes can degrade gracefully (501)
 * instead of throwing at module load — mirrors the liveblocks-auth pattern.
 *
 * Fails loudly (throws) when the secret key and the optional publishable key
 * are in DIFFERENT modes (e.g. `sk_live_…` + `pk_test_…`) — a misconfiguration
 * that must never reach production.
 */
let cached: Stripe | null = null

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  assertKeyModesAgree(key)
  if (!cached) cached = new Stripe(key)
  return cached
}

/**
 * Offline guard: if a publishable key is present, its mode (`pk_live_` /
 * `pk_test_`) must match the secret key's mode. Cheap, synchronous, and runs
 * on every client construction so a cross-mode pairing can never go unnoticed.
 */
function assertKeyModesAgree(secretKey: string): void {
  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()
  if (!pk) return
  const pkMode = pk.startsWith("pk_live_")
    ? "live"
    : pk.startsWith("pk_test_")
      ? "test"
      : null
  if (!pkMode) return
  const secretMode = stripeKeyMode(secretKey)
  if (pkMode !== secretMode) {
    throw new Error(
      `Stripe key mode mismatch: STRIPE_SECRET_KEY is ${secretMode} but ` +
        `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is ${pkMode}. Set both to the same mode.`,
    )
  }
}
