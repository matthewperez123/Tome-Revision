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
import { isFreeSample, FREE_SAMPLE_BOOK_IDS } from "@/lib/stripe/free-books"
import type { UserRole } from "@/lib/navigation"

export type Tier = "free" | "solo" | "family" | "school"

/** The free sampler ids (explicit foundational-20; see `free-books.ts`). */
export const FREE_BOOK_IDS: readonly string[] = FREE_SAMPLE_BOOK_IDS

/** Whether `tier` is a paid reader plan. */
export function isPaid(tier: Tier): boolean {
  return tier === "solo" || tier === "family" || tier === "school"
}

/**
 * Can this account read `bookId`?
 * - Teachers & students: always (their reading is classroom-scoped).
 * - Readers: yes if subscribed, or the book is part of the free sampler.
 *
 * NOTE: this is the pure decision shared by the client gate and the server
 * gate. The authoritative call site is the server (`canUserReadBook` in
 * `entitlements/server.ts`); the client uses it only to reflect state in the UI.
 */
export function canReadBook(
  tier: Tier,
  role: UserRole | null,
  bookId: string,
): boolean {
  if (role === "teacher" || role === "student") return true
  if (isPaid(tier)) return true
  return isFreeSample(bookId)
}
