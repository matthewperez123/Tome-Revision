/**
 * THE single source of truth for every dollar figure, seat limit, and
 * Questions Available allowance in Tome. No other file may hardcode a
 * price — pricing surfaces, checkout, the webhook, entitlements, and the
 * credit pools all read from here. (Enforced by the hardcoded-dollar grep
 * test in scripts/billing/no-hardcoded-dollars.test.ts.)
 *
 * Server-safe and client-safe: no secrets, no env reads.
 */

export const SEAT_PRICE_USD_PER_YEAR = 12
export const MIN_STUDENT_SEATS = 1 // Classroom (self-serve)
export const SCHOOL_ANNUAL_MINIMUM_USD = 1500 // School (quote / invoice)
export const SCHOOL_MIN_SEATS = Math.ceil(
  SCHOOL_ANNUAL_MINIMUM_USD / SEAT_PRICE_USD_PER_YEAR,
) // 125
export const SCHOOL_FLAT_TIERS = [
  { key: "flat150", maxStudents: 150, priceUsd: 1800, env: "TOME_PRICE_SCHOOL_FLAT_150" },
  { key: "flat300", maxStudents: 300, priceUsd: 3200, env: "TOME_PRICE_SCHOOL_FLAT_300" },
] as const
export type SchoolFlatKey = (typeof SCHOOL_FLAT_TIERS)[number]["key"]

export const FREE_TEACHER_CLASSROOM_LIMIT = 1
export const FREE_TEACHER_STUDENT_LIMIT = 30
export const FAMILY_PRICE_USD_PER_YEAR = 99
export const FAMILY_STUDENT_LIMIT = 4

export const QUESTIONS_FREE_TEACHER_PER_MONTH = 100
export const QUESTIONS_PER_SEAT_PER_MONTH = {
  classroom: 60,
  school: 90,
  family: 60,
} as const
export const QUESTIONS_ACCRUAL_MONTHS = 3
export const QUESTIONS_PAID_TEACHER_PERSONAL_PER_MONTH = 1000
export const QUESTIONS_TOPUP_BLOCK = 10000
export const QUESTIONS_TOPUP_PRICE_USD = 149
export const QUESTIONS_LOW_BALANCE_RATIO = 0.2
