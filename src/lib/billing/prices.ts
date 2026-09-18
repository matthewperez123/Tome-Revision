import "server-only"

/**
 * Server-side Stripe price-id resolution for the launch billing model.
 *
 * Display facts (names, formatted prices, features) live in `./tiers`
 * (client-safe); every number derives from `./config`. This module owns
 * the env-var ↔ price-id wiring and the reverse lookup the webhook uses.
 *
 * Price IDs are environment-specific (test vs live) and read from env at
 * runtime — never committed.
 */

import { SCHOOL_FLAT_TIERS, type SchoolFlatKey } from "./config"
export type { BillingTier, PurchasableTier } from "./tiers"
export { isPurchasableTier } from "./tiers"
import type { BillingTier } from "./tiers"

function envPrice(envVar: string): string | null {
  return process.env[envVar]?.trim() || null
}

/** The $12 per-student recurring yearly price (Classroom AND School seats). */
export function getStudentSeatPriceId(): string | null {
  return envPrice("TOME_PRICE_STUDENT_SEAT_YEARLY")
}

/** Flat School prices ($1,800 ≤ 150 / $3,200 ≤ 300). */
export function getSchoolFlatPriceId(key: SchoolFlatKey): string | null {
  const flat = SCHOOL_FLAT_TIERS.find((t) => t.key === key)
  return flat ? envPrice(flat.env) : null
}

export function schoolFlatForKey(key: string) {
  return SCHOOL_FLAT_TIERS.find((t) => t.key === key) ?? null
}

/** Reverse lookup: a subscription line-item price id → the flat School tier. */
export function schoolFlatForPriceId(priceId: string) {
  return SCHOOL_FLAT_TIERS.find((t) => envPrice(t.env) === priceId) ?? null
}

/** Family (Homeschool) $99 yearly. */
export function getFamilyPriceId(): string | null {
  return envPrice("TOME_PRICE_FAMILY_YEARLY")
}

/** One-time 10,000-Question top-up. */
export function getTopupPriceId(): string | null {
  return envPrice("TOME_PRICE_QUESTIONS_TOPUP")
}

// grandfathered — remove only when subscriptions has zero solo / legacy-family rows
const GRANDFATHERED_PRICE_ENV: Record<string, BillingTier> = {
  TOME_PRICE_SOLO_MONTHLY: "solo",
  TOME_PRICE_SOLO_YEARLY: "solo",
  TOME_PRICE_FAMILY_MONTHLY: "family",
  TOME_PRICE_SCHOOL_SEAT_YEARLY: "school",
}

/**
 * Reverse lookup: given a Stripe Price ID from a subscription line item,
 * return the tier it belongs to in THIS environment, or null.
 *
 * The $12 seat price is shared by `classroom` and `school` — it resolves to
 * `classroom` here; the webhook prefers checkout metadata (`tier`) and only
 * falls back to this when metadata is missing.
 */
export function tierForBillingPriceId(priceId: string): BillingTier | null {
  if (getStudentSeatPriceId() === priceId) return "classroom"
  for (const flat of SCHOOL_FLAT_TIERS) {
    if (envPrice(flat.env) === priceId) return "school"
  }
  if (getFamilyPriceId() === priceId) return "family"
  for (const [envVar, tier] of Object.entries(GRANDFATHERED_PRICE_ENV)) {
    if (envPrice(envVar) === priceId) return tier
  }
  return null
}
