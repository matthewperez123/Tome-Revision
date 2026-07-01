/**
 * Single source of truth for every plan — name, monthly + annual price,
 * feature list, CTA label, CTA href, and the Stripe price ENV KEY. This is the
 * ONLY place plan copy lives; nothing in the marketing surface should hardcode
 * a plan name, price, cadence, or feature.
 *
 * Plans that quote the live catalog size (e.g. Solo's "all 1,280+ books")
 * take a `CatalogStats` so the number is COMPUTED from Supabase, never baked in
 * — see `./catalog-stats`. That is why the plan accessors are functions of
 * `stats` rather than static arrays.
 */
import {
  catalogSummary,
  type CatalogStats,
} from "./catalog-stats"
import type { PaidTier } from "@/lib/stripe/plans"

// ── CTA TARGETS (routes already exist — these just wire the hrefs) ───
// Every signup/demo CTA uses ONE query convention: `?plan=<id>`, where the
// id matches the plan ids below (solo, family, classroom, school, district).
// /signup and /demo both read `plan` and prefill/route accordingly.
export const HREFS = {
  signupFree: "/signup",
  signupSolo: "/signup?plan=solo",
  signupFamily: "/signup?plan=family",
  signupClassroom: "/signup?plan=classroom",
  demoSchool: "/demo?plan=school",
  demoDistrict: "/demo?plan=district",
  bookDemo: "/demo",
} as const

// ── STRIPE PRICE ENV KEYS ────────────────────────────────────────────
// The names of the ENV VARS that hold each paid tier's Stripe Price ID.
// Price IDs are environment-specific (test vs live) and MUST NOT be hardcoded;
// `src/lib/stripe/prices.ts` reads the actual IDs from these vars at runtime.
export const PLAN_PRICE_ENV: Record<PaidTier, Record<BillingPeriod, string>> = {
  solo: {
    monthly: "STRIPE_PRICE_SOLO_MONTHLY",
    annual: "STRIPE_PRICE_SOLO_ANNUAL",
  },
  family: {
    monthly: "STRIPE_PRICE_FAMILY_MONTHLY",
    annual: "STRIPE_PRICE_FAMILY_ANNUAL",
  },
  // School is seat-based: the same price is purchased with quantity = number
  // of teacher seats. The env var holds the per-seat ("per teacher") price.
  school: {
    monthly: "STRIPE_PRICE_SCHOOL_MONTHLY",
    annual: "STRIPE_PRICE_SCHOOL_ANNUAL",
  },
}

// ── TYPES ────────────────────────────────────────────────────────────
export type BillingPeriod = "monthly" | "annual"

export interface PlanPrice {
  /** Display price, e.g. "$9". */
  price: string
  /** Display cadence, e.g. "per month", "per year", "forever". */
  cadence: string
}

export interface ReaderPlan {
  id: string
  name: string
  description: string
  features: string[]
  ctaLabel: string
  ctaHref: string
  featured?: boolean
  badge?: string
  /** The ENV VARS holding this plan's Stripe Price IDs, when it is a paid tier. */
  stripePriceEnv?: Record<BillingPeriod, string>
  /** Price shown in the Monthly view. Omit to hide this plan in Monthly. */
  monthly?: PlanPrice
  /** Price shown in the Annual view. Omit to hide this plan in Annual. */
  annual?: PlanPrice
}

export interface EducatorPlan {
  id: string
  name: string
  description: string
  features: string[]
  ctaLabel: string
  ctaHref: string
  featured?: boolean
  badge?: string
  stripePriceEnv?: Record<BillingPeriod, string>
  monthly?: PlanPrice
  annual?: PlanPrice
}

/** A single capability row in the reader feature-comparison table. */
export interface ComparisonRow {
  label: string
  /** Keyed by reader tier id. true = check, false = dash, string = note. */
  tiers: Record<string, boolean | string>
}

// ── SHARED COPY ──────────────────────────────────────────────────────
export const READER_TRIAL_COPY =
  "All plans include a 7-day free trial of Solo. Cancel anytime."

/**
 * `SCHOOL_PRICING_IS_FINAL` gates the educator fine print. Left `false`
 * because the School rate is a defaulted decision, not a confirmed launch
 * price — keep the "Pricing in development" caveat until it is confirmed.
 */
export const SCHOOL_PRICING_IS_FINAL = false

export const EDUCATOR_FINE_PRINT_DEV =
  "Pricing in development — final tiers and rates announced at launch."
export const EDUCATOR_FINE_PRINT_FINAL =
  "Volume discounts for whole schools and districts. Annual billing available."

/** Whether the Family (multi-seat) plan is offered. */
export const HOUSEHOLD_ENABLED = true
export const HOUSEHOLD_SEATS = 5

// Solo's annual price, surfaced in FAQ copy so the FAQ never drifts from
// the cards. (Annual is just Solo billed yearly — not a separate tier.)
export const SOLO_ANNUAL_PRICE = "$90"

// ── READER PLANS ─────────────────────────────────────────────────────
// Solo carries both a monthly and an annual price; the BillingToggle on
// /pricing picks which cadence to show. Annual is the same product billed
// yearly — there is no separate annual tier.
export function getReaderPlans(stats: CatalogStats): ReaderPlan[] {
  return [
    {
      id: "free",
      name: "Free",
      description: "Everything you need to start reading the canon.",
      features: [
        "Access to 20 foundational books",
        "Virgil annotations in the reader",
        "Daily Flame and Seal tracking",
        "Basic Trials after each chapter",
        "Personal library and progress tracking",
      ],
      ctaLabel: "Begin reading",
      ctaHref: HREFS.signupFree,
      monthly: { price: "$0", cadence: "forever" },
      annual: { price: "$0", cadence: "forever" },
    },
    {
      id: "solo",
      name: "Solo",
      description:
        "Unlimited access to the full canon and Virgil's deeper scholarship.",
      features: [
        `All ${catalogSummary(stats)}`,
        "Unlimited Virgil conversations",
        "Advanced Trials and Seals",
        "Custom reading lists and collections",
        "Offline reading",
        "Priority support",
      ],
      ctaLabel: "Start Solo",
      ctaHref: HREFS.signupSolo,
      featured: true,
      badge: "Most popular",
      stripePriceEnv: PLAN_PRICE_ENV.solo,
      monthly: { price: "$9", cadence: "per month" },
      annual: { price: SOLO_ANNUAL_PRICE, cadence: "per year" },
    },
    ...(HOUSEHOLD_ENABLED
      ? [
          {
            id: "family",
            name: "Family",
            description: `Up to ${HOUSEHOLD_SEATS} readers under one subscription — built for families reading the Great Books together.`,
            features: [
              `${HOUSEHOLD_SEATS} reader seats`,
              "Everything in Solo for every seat",
              "Shared family library and shelves",
              "Per-reader progress and Trials",
              "One simple bill",
            ],
            ctaLabel: "Start Family",
            ctaHref: HREFS.signupFamily,
            stripePriceEnv: PLAN_PRICE_ENV.family,
            monthly: { price: "$18", cadence: "per month" },
            annual: { price: "$150", cadence: "per year" },
          } satisfies ReaderPlan,
        ]
      : []),
  ]
}

/** Reader plans visible in a given billing view (preserves card order). */
export function readerPlansForPeriod(
  period: BillingPeriod,
  stats: CatalogStats,
): ReaderPlan[] {
  return getReaderPlans(stats).filter((plan) => Boolean(plan[period]))
}

// ── EDUCATOR PLANS ───────────────────────────────────────────────────
export function getEducatorPlans(): EducatorPlan[] {
  return [
    {
      id: "classroom",
      name: "Classroom",
      description: "Free for individual teachers, up to 30 students.",
      features: [
        "1 class",
        "Up to 30 students",
        "Basic assignments",
        "Auto-graded Trials",
        "Live gradebook",
      ],
      ctaLabel: "Start free",
      ctaHref: HREFS.signupClassroom,
      monthly: { price: "$0", cadence: "forever" },
      annual: { price: "$0", cadence: "forever" },
    },
    {
      id: "school",
      name: "School",
      description: "For departments and schools.",
      features: [
        "Unlimited classes and students",
        "All assignment types",
        "Virgil reflection grading",
        "Class progress dashboard",
        "Co-teacher sharing",
        "LMS export (coming soon)",
        "Priority support",
      ],
      ctaLabel: "Book a demo",
      ctaHref: HREFS.demoSchool,
      featured: true,
      badge: "Most popular",
      stripePriceEnv: PLAN_PRICE_ENV.school,
      monthly: { price: "$15", cadence: "per teacher / month" },
      annual: { price: "$144", cadence: "per teacher / year" },
    },
    {
      id: "district",
      name: "District",
      description: "For districts and large institutions.",
      features: [
        "Everything in School",
        "SSO (coming soon)",
        "Roster sync — Clever, ClassLink, Google Classroom (coming soon)",
        "Admin dashboard",
        "Custom standards alignment",
        "Dedicated success manager",
      ],
      ctaLabel: "Contact sales",
      ctaHref: HREFS.demoDistrict,
      monthly: { price: "Contact us", cadence: "" },
      annual: { price: "Contact us", cadence: "" },
    },
  ]
}

export function educatorPlansForPeriod(period: BillingPeriod): EducatorPlan[] {
  return getEducatorPlans().filter((plan) => Boolean(plan[period]))
}

// ── READER FEATURE COMPARISON ────────────────────────────────────────
// Columns are the distinct reader products. Annual is Solo billed yearly,
// so it shares Solo's column — the table covers Free, Solo, Family.
export const readerComparisonTiers: { id: string; label: string }[] = [
  { id: "free", label: "Free" },
  { id: "solo", label: "Solo" },
  ...(HOUSEHOLD_ENABLED ? [{ id: "family", label: "Family" }] : []),
]

export function getReaderComparison(stats: CatalogStats): ComparisonRow[] {
  const fullLibrary = catalogSummary(stats)
  return [
    {
      label: "Books in the library",
      tiers: { free: "20", solo: fullLibrary, family: fullLibrary },
    },
    {
      label: "Virgil annotations",
      tiers: { free: true, solo: true, family: true },
    },
    {
      label: "Unlimited Virgil conversations",
      tiers: { free: false, solo: true, family: true },
    },
    {
      label: "Trials & Seals",
      tiers: { free: "Basic", solo: "Advanced", family: "Advanced" },
    },
    {
      label: "Daily Flame & progress tracking",
      tiers: { free: true, solo: true, family: true },
    },
    {
      label: "Custom reading lists",
      tiers: { free: false, solo: true, family: true },
    },
    {
      label: "Offline reading",
      tiers: { free: false, solo: true, family: true },
    },
    {
      label: "Reader seats",
      tiers: { free: "1", solo: "1", family: String(HOUSEHOLD_SEATS) },
    },
    {
      label: "Priority support",
      tiers: { free: false, solo: true, family: true },
    },
  ]
}
