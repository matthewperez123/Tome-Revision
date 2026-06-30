/**
 * Single source of truth for all plan pricing, book counts, and shared
 * pricing copy. Nothing in the marketing surface should hardcode a plan
 * number, cadence, or book count — import from here instead so the numbers
 * never drift again.
 */

// ── CANONICAL CONTENT ───────────────────────────────────────────────
export const CANONICAL_BOOK_COUNT = "1,200+"
export const TRADITIONS_LABEL = "every major literary tradition"

// ── CTA TARGETS (routes already exist — these just wire the hrefs) ───
// Solo (was "Pro") and Family (was "Household") are the individual paid
// plans. Annual is the same product billed yearly via the BillingToggle,
// so there is no separate "Scholar" tier or href any more.
export const HREFS = {
  signupFree: "/signup",
  signupSolo: "/signup?tier=solo",
  signupFamily: "/signup?tier=family",
  signupClassroom: "/signup?plan=classroom",
  demoSchool: "/demo?plan=school",
  demoDistrict: "/demo?plan=district",
  bookDemo: "/demo",
} as const

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
 * `school.isFinal` gates the educator fine print. Left `false` because the
 * School rate is a defaulted decision, not a confirmed launch price — keep
 * the "Pricing in development" caveat until Matthew confirms.
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
// the cards. (Annual is just Solo billed yearly — the old "Scholar" tier.)
export const SOLO_ANNUAL_PRICE = "$90"

// ── READER PLANS ─────────────────────────────────────────────────────
// Solo carries both a monthly and an annual price; the BillingToggle on
// /pricing picks which cadence to show. Annual is the same product billed
// yearly (what used to be called "Scholar") — no separate tier.
export const readerPlans: ReaderPlan[] = [
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
      `All ${CANONICAL_BOOK_COUNT} books across ${TRADITIONS_LABEL}`,
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
          monthly: { price: "$18", cadence: "per month" },
          annual: { price: "$150", cadence: "per year" },
        } satisfies ReaderPlan,
      ]
    : []),
]

/** Reader plans visible in a given billing view (preserves card order). */
export function readerPlansForPeriod(period: BillingPeriod): ReaderPlan[] {
  return readerPlans.filter((plan) => Boolean(plan[period]))
}

// ── EDUCATOR PLANS ───────────────────────────────────────────────────
export const educatorPlans: EducatorPlan[] = [
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
      "LMS export",
      "Priority support",
    ],
    ctaLabel: "Book a demo",
    ctaHref: HREFS.demoSchool,
    featured: true,
    badge: "Most popular",
    monthly: { price: "$15", cadence: "per teacher / month" },
    annual: { price: "$144", cadence: "per teacher / year" },
  },
  {
    id: "district",
    name: "District",
    description: "For districts and large institutions.",
    features: [
      "Everything in School",
      "SSO",
      "Roster sync (Clever, ClassLink, Google Classroom)",
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

export function educatorPlansForPeriod(period: BillingPeriod): EducatorPlan[] {
  return educatorPlans.filter((plan) => Boolean(plan[period]))
}

// ── READER FEATURE COMPARISON ────────────────────────────────────────
// Columns are the distinct reader products. Annual is Solo billed yearly,
// so it shares Solo's column — the table covers Free, Solo, Family.
export const readerComparisonTiers: { id: string; label: string }[] = [
  { id: "free", label: "Free" },
  { id: "solo", label: "Solo" },
  ...(HOUSEHOLD_ENABLED ? [{ id: "family", label: "Family" }] : []),
]

export const readerComparison: ComparisonRow[] = [
  {
    label: "Books in the library",
    tiers: { free: "20", solo: CANONICAL_BOOK_COUNT, family: CANONICAL_BOOK_COUNT },
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
