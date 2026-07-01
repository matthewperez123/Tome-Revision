import "server-only"
import type Stripe from "stripe"
import {
  PLAN_PRICE_ENV,
  type BillingPeriod,
} from "@/lib/marketing/plans"
import type { PaidTier } from "@/lib/stripe/plans"

/**
 * The ENV VAR that holds each tier + billing period's Stripe Price ID is owned
 * by `@/lib/marketing/plans` (`PLAN_PRICE_ENV`) — the single source of truth
 * for plan↔price wiring. Price IDs are environment-specific (test vs live) and
 * MUST NOT be hardcoded anywhere; set the vars per environment:
 *   - local + Vercel Preview -> TEST-mode price IDs
 *   - Vercel Production       -> LIVE-mode price IDs
 * See `.env.example` for the full list.
 */

/** Resolve the Stripe Price ID for a tier + period from the environment. */
export function getPriceId(
  tier: PaidTier,
  period: BillingPeriod,
): string | null {
  return process.env[PLAN_PRICE_ENV[tier][period]]?.trim() || null
}

/**
 * Reverse lookup: given a Stripe Price ID (e.g. from a subscription line item),
 * return the paid tier it belongs to in THIS environment, or null. Lets the
 * webhook derive `tier` authoritatively from the price even when event metadata
 * is missing.
 */
export function tierForPriceId(priceId: string): PaidTier | null {
  for (const tier of Object.keys(PLAN_PRICE_ENV) as PaidTier[]) {
    for (const period of Object.keys(PLAN_PRICE_ENV[tier]) as BillingPeriod[]) {
      if (process.env[PLAN_PRICE_ENV[tier][period]]?.trim() === priceId) {
        return tier
      }
    }
  }
  return null
}

/** "live" | "test" inferred from a Stripe secret / restricted key prefix. */
export function stripeKeyMode(secretKey: string): "live" | "test" {
  return secretKey.startsWith("sk_live_") || secretKey.startsWith("rk_live_")
    ? "live"
    : "test"
}

/**
 * Authoritative test/live consistency guard.
 *
 * Stripe Price IDs do NOT encode their mode in the string, so the only
 * reliable check is to ask Stripe: retrieve the price and compare its
 * `livemode` flag against the secret key's mode. Throws loudly on any
 * mismatch (e.g. a live key paired with a test price), preventing a
 * cross-mode Checkout Session from ever being created.
 */
export async function assertPriceMatchesKeyMode(
  stripe: Stripe,
  priceId: string,
): Promise<void> {
  const keyMode = stripeKeyMode(process.env.STRIPE_SECRET_KEY ?? "")

  let price: Stripe.Price
  try {
    price = await stripe.prices.retrieve(priceId)
  } catch {
    // A test-mode key cannot see a live price (and vice versa): Stripe returns
    // "No such price". Treat as a mode/config error rather than leaking detail.
    throw new Error(
      `Stripe price ${priceId} is not visible to a ${keyMode}-mode key. ` +
        `Check that the STRIPE_PRICE_* vars match the mode of STRIPE_SECRET_KEY.`,
    )
  }

  const priceMode = price.livemode ? "live" : "test"
  if (priceMode !== keyMode) {
    throw new Error(
      `Stripe mode mismatch: STRIPE_SECRET_KEY is ${keyMode} but price ` +
        `${priceId} is ${priceMode}. Refusing to start checkout.`,
    )
  }
}
