import "server-only"

/**
 * THE single source of truth for Tome's billable plans.
 *
 * Every plan fact — display name, Stripe Price IDs (from env), display price,
 * the `profiles.role` a purchase grants, and the marketing blurb — lives here
 * and NOWHERE else. Pricing surfaces render from `getBillingTiers()`; checkout
 * resolves Price IDs from `getBillingPriceId()`. Do not hardcode a plan name,
 * amount, or price id anywhere in the codebase.
 *
 * Price IDs are environment-specific (test vs live) and read from env at
 * runtime — never committed. Provision them with `npx tsx scripts/stripe-setup.ts`,
 * which prints the exact `TOME_PRICE_*` lines to set per environment.
 *
 * server-only: this module reads server env and must never ship to the client.
 * Client surfaces receive plain, serialized card data as props from a Server
 * Component (see the /pricing page).
 */

export type BillingTier = "solo" | "family" | "school"
export type BillingInterval = "monthly" | "yearly"

export interface TierPrice {
  /** The env var that holds this Stripe Price ID. */
  envVar: string
  /** Resolved Stripe Price ID, or null when the env var is unset. */
  priceId: string | null
  /** Display amount, e.g. "$9". */
  amount: string
  /** Display cadence, e.g. "/mo", "/yr", "per seat / yr". */
  cadence: string
}

export interface BillingTierPlan {
  tier: BillingTier
  name: string
  blurb: string
  /** The `profiles.role` a purchase of this tier grants. */
  roleGranted: "reader" | "teacher"
  /** True while the rate is provisional (School), for "pricing in development" copy. */
  provisional?: boolean
  featured?: boolean
  badge?: string
  /** null when the tier has no monthly option (School is annual-only). */
  monthly: TierPrice | null
  yearly: TierPrice
}

function price(envVar: string, amount: string, cadence: string): TierPrice {
  return { envVar, priceId: process.env[envVar]?.trim() || null, amount, cadence }
}

/** Canonical tier table. Order here is display order. */
export const BILLING_TIERS: Record<BillingTier, BillingTierPlan> = {
  solo: {
    tier: "solo",
    name: "Solo",
    blurb:
      "Unlimited access to the full canon and Virgil's deeper scholarship for one reader.",
    roleGranted: "reader",
    featured: true,
    badge: "Most popular",
    monthly: price("TOME_PRICE_SOLO_MONTHLY", "$9", "/mo"),
    yearly: price("TOME_PRICE_SOLO_YEARLY", "$90", "/yr"),
  },
  family: {
    tier: "family",
    name: "Family",
    blurb:
      "Up to five readers under one subscription, each with their own library and progress.",
    roleGranted: "teacher",
    monthly: price("TOME_PRICE_FAMILY_MONTHLY", "$18", "/mo"),
    yearly: price("TOME_PRICE_FAMILY_YEARLY", "$150", "/yr"),
  },
  school: {
    tier: "school",
    name: "School",
    blurb:
      "Per-teacher seats for departments and schools. Each seat grants a teacher account; students join free.",
    roleGranted: "teacher",
    provisional: true,
    monthly: null,
    yearly: price("TOME_PRICE_SCHOOL_SEAT_YEARLY", "$120", "per seat / yr"),
  },
}

const ORDER: BillingTier[] = ["solo", "family", "school"]

/** All billable tiers in display order. */
export function getBillingTiers(): BillingTierPlan[] {
  return ORDER.map((tier) => BILLING_TIERS[tier])
}

/** Resolve the Stripe Price ID for a tier + interval from env, or null. */
export function getBillingPriceId(
  tier: BillingTier,
  interval: BillingInterval,
): string | null {
  const plan = BILLING_TIERS[tier]
  const slot = interval === "monthly" ? plan.monthly : plan.yearly
  return slot?.priceId ?? null
}

/**
 * Reverse lookup: given a Stripe Price ID (e.g. an explicit `priceId` in a
 * checkout request), return the tier it belongs to in THIS environment, or
 * null. Lets checkout derive `metadata.tier` from the canonical tier table
 * rather than trusting the client or a hardcoded map.
 */
export function tierForBillingPriceId(priceId: string): BillingTier | null {
  for (const tier of ORDER) {
    const plan = BILLING_TIERS[tier]
    if (plan.monthly?.priceId === priceId || plan.yearly.priceId === priceId) {
      return tier
    }
  }
  return null
}
