/**
 * Reader entitlements — what a given account may read.
 *
 * Pure + client-safe (no server imports): the reader paywall gate runs in the
 * browser via `useEntitlement()`. Teachers and students always have full
 * access (classroom context); readers get the free sampler unless subscribed.
 *
 * NOTE: this is a UX gate, not a hard security boundary — the static
 * `/content/*.json` chapter files are publicly fetchable. Real enforcement
 * would require moving content behind an authenticated endpoint.
 */
import { getFeaturedBooks } from "@/lib/content"
import type { UserRole } from "@/lib/navigation"

export type Tier = "free" | "solo" | "family"

/**
 * The free sampler: every featured book is readable without a subscription.
 * Derived from the static catalog so it stays in sync with curation.
 */
export const FREE_BOOK_IDS: string[] = getFeaturedBooks().map((b) => b.id)

const FREE_BOOK_SET = new Set(FREE_BOOK_IDS)

/** Whether `tier` is a paid reader plan. */
export function isPaid(tier: Tier): boolean {
  return tier === "solo" || tier === "family"
}

/**
 * Can this account read `bookId`?
 * - Teachers & students: always (their reading is classroom-scoped).
 * - Readers: yes if subscribed, or the book is part of the free sampler.
 */
export function canReadBook(
  tier: Tier,
  role: UserRole | null,
  bookId: string,
): boolean {
  if (role === "teacher" || role === "student") return true
  if (isPaid(tier)) return true
  return FREE_BOOK_SET.has(bookId)
}
