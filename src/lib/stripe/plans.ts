/**
 * Maps a paid reader tier + billing period to its Stripe Price ID.
 *
 * The defaults below are TEST-mode prices created in the "Tome sandbox"
 * Stripe account. Override per environment with `STRIPE_PRICE_*` env vars
 * (e.g. live-mode price IDs in production) without touching code.
 *
 * Price IDs are NOT secret — only `STRIPE_SECRET_KEY` is. Keeping the test
 * IDs here lets local/preview checkout work out of the box.
 */
import type { BillingPeriod } from "@/lib/pricing"

export type PaidTier = "solo" | "family"

const TEST_PRICE_IDS: Record<PaidTier, Record<BillingPeriod, string>> = {
  solo: {
    monthly: "price_1TnoAKQx4yuHRtovThJ5Kf5I",
    annual: "price_1TnoAPQx4yuHRtovPpOWP2qY",
  },
  family: {
    monthly: "price_1TnoAWQx4yuHRtovcW4q1OlJ",
    annual: "price_1TnoAdQx4yuHRtovvHJl9ncx",
  },
}

export function isPaidTier(value: string): value is PaidTier {
  return value === "solo" || value === "family"
}

export function getPriceId(tier: PaidTier, period: BillingPeriod): string | null {
  const envKey = `STRIPE_PRICE_${tier.toUpperCase()}_${period.toUpperCase()}`
  return process.env[envKey] || TEST_PRICE_IDS[tier]?.[period] || null
}
