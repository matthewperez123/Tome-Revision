/**
 * Client-safe display facts for every purchasable (and virtual) tier —
 * names, formatted prices, feature lists, CTAs. All numbers derive from
 * `./config` (the single source of truth); nothing here reads env or
 * touches Stripe. Server-side price-id resolution lives in `./prices`.
 */
import {
  SEAT_PRICE_USD_PER_YEAR,
  MIN_STUDENT_SEATS,
  SCHOOL_ANNUAL_MINIMUM_USD,
  SCHOOL_FLAT_TIERS,
  FREE_TEACHER_CLASSROOM_LIMIT,
  FREE_TEACHER_STUDENT_LIMIT,
  FAMILY_PRICE_USD_PER_YEAR,
  FAMILY_STUDENT_LIMIT,
  QUESTIONS_FREE_TEACHER_PER_MONTH,
  QUESTIONS_PER_SEAT_PER_MONTH,
  QUESTIONS_TOPUP_BLOCK,
  QUESTIONS_TOPUP_PRICE_USD,
} from "./config"

/**
 * `solo` and the legacy family price ids exist ONLY so `getEntitlement`
 * resolves grandfathered rows — they are never displayed or sold.
 */
export type BillingTier = "free_teacher" | "classroom" | "school" | "family" | "solo"

/** Tiers a checkout session can actually be started for. */
export type PurchasableTier = "classroom" | "school" | "family"

export function isPurchasableTier(value: string): value is PurchasableTier {
  return value === "classroom" || value === "school" || value === "family"
}

const usd = (n: number) => `$${n.toLocaleString("en-US")}`

export interface MarketingTier {
  tier: BillingTier
  name: string
  /** Display price, e.g. "$12". */
  price: string
  /** Display cadence, e.g. "per student / year". */
  cadence: string
  blurb: string
  features: string[]
  ctaLabel: string
  /** Plain-link target; classroom instead opens seat-quantity checkout. */
  ctaHref: string
  /** True → the CTA opens Stripe checkout with a seat quantity. */
  seatCheckout?: boolean
  featured?: boolean
  badge?: string
}

/** The three tiers shown on /pricing, in display order. */
export function getMarketingTiers(): MarketingTier[] {
  return [
    {
      tier: "free_teacher",
      name: "Teacher",
      price: usd(0),
      cadence: "free forever",
      blurb: "Everything one teacher needs to run a real classroom on the canon.",
      features: [
        "The full 1,280-book library and reader",
        "Pre-built quizzes at three difficulties",
        "Assignments and live gradebook",
        "Quiz builder",
        `${FREE_TEACHER_CLASSROOM_LIMIT} classroom · ${FREE_TEACHER_STUDENT_LIMIT} students`,
        `${QUESTIONS_FREE_TEACHER_PER_MONTH} Questions Available / month`,
      ],
      ctaLabel: "Start free",
      ctaHref: "/signup?as=teacher",
    },
    {
      tier: "classroom",
      name: "Classroom",
      price: usd(SEAT_PRICE_USD_PER_YEAR),
      cadence: "per student / year",
      blurb: "Every teacher tool, priced by the student. Add seats as your roster grows.",
      features: [
        "Unlimited classrooms",
        "Every teacher tool",
        "Live quizzes and guided sessions",
        "Term planner",
        `${QUESTIONS_PER_SEAT_PER_MONTH.classroom} Questions Available per student / month, pooled by class`,
        "Email support",
      ],
      ctaLabel: "Buy seats",
      ctaHref: "/signup?as=teacher&plan=classroom",
      seatCheckout: true,
      featured: true,
      badge: "Most popular",
    },
    {
      tier: "school",
      name: "School",
      price: `from ${usd(SCHOOL_ANNUAL_MINIMUM_USD)}`,
      cadence: "per year",
      blurb: `${usd(SEAT_PRICE_USD_PER_YEAR)} per student with a ${usd(SCHOOL_ANNUAL_MINIMUM_USD)} minimum, or flat ${usd(SCHOOL_FLAT_TIERS[0].priceUsd)} up to ${SCHOOL_FLAT_TIERS[0].maxStudents} students / ${usd(SCHOOL_FLAT_TIERS[1].priceUsd)} up to ${SCHOOL_FLAT_TIERS[1].maxStudents}.`,
      features: [
        "Invoice or purchase order",
        "Seat management across teachers",
        "NDPA on request",
        "Onboarding webinar",
        "Priority support",
        `${QUESTIONS_PER_SEAT_PER_MONTH.school} Questions per student / month`,
      ],
      ctaLabel: "Get a quote",
      ctaHref: "/schools#quote",
    },
  ]
}

/** The Family (Homeschool) tier — sold only from /homeschool. */
export function getFamilyTier(): MarketingTier {
  return {
    tier: "family",
    name: "Family",
    price: usd(FAMILY_PRICE_USD_PER_YEAR),
    cadence: "per year",
    blurb: `The full teacher toolset for a homeschool household — up to ${FAMILY_STUDENT_LIMIT} students.`,
    features: [
      "The full library for the whole household",
      `Up to ${FAMILY_STUDENT_LIMIT} students`,
      "Assignments, quizzes, and a family gradebook",
      `${FAMILY_STUDENT_LIMIT * QUESTIONS_PER_SEAT_PER_MONTH.family} Questions Available / month`,
      "ESA-eligible in participating states",
    ],
    ctaLabel: "Start Family",
    ctaHref: "/homeschool",
  }
}

/** One-line top-up offer, e.g. under the pricing cards. */
export function getTopupOffer(): { label: string } {
  return {
    label: `Add ${QUESTIONS_TOPUP_BLOCK.toLocaleString("en-US")} Questions — ${usd(QUESTIONS_TOPUP_PRICE_USD)}`,
  }
}

export { MIN_STUDENT_SEATS }
