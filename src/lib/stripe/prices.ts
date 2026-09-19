import "server-only"
import type Stripe from "stripe"

/**
 * Stripe mode guards. Price-id ↔ tier wiring lives in
 * `src/lib/billing/prices.ts`; this module only verifies that a price and
 * the secret key agree on test vs live mode before checkout starts.
 */

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
