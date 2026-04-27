import type { TomeBook } from "@/data/books"

/**
 * Books whose `apparatusStatus` we treat as fully finished — a complete
 * line-anchored text with Opus annotations, glosses, echoes, and trials.
 */
const COMPLETE_STATUSES: ReadonlyArray<TomeBook["apparatusStatus"]> = [
  "draft_complete",
  "published",
]

/**
 * Books that are partially ingested — they have hand-written annotation
 * clusters and/or glosses wired up, but don't yet meet the full
 * "draft_complete" bar (missing dense gloss coverage, partial echoes,
 * or only load-bearing chapters annotated).
 *
 * Each of these is surfaced in the Library "Recommended" section so
 * readers can preview in-progress scholarly apparatus even while the
 * ingestion work continues.
 */
export const PARTIAL_INGESTED_BOOK_IDS: ReadonlySet<string> = new Set([
  "the-iliad",
  "the-odyssey",
  "the-aeneid",
  "the-divine-comedy",
  "the-canterbury-tales",
  "le-morte-darthur",
  "paradise-lost",
  "orlando-furioso",
  "idylls-of-the-king",
  "don-juan",
  "hamlet",
])

export function isBookComplete(book: Pick<TomeBook, "apparatusStatus">): boolean {
  return !!book.apparatusStatus && COMPLETE_STATUSES.includes(book.apparatusStatus)
}

export function isBookInProgress(book: Pick<TomeBook, "id">): boolean {
  return PARTIAL_INGESTED_BOOK_IDS.has(book.id)
}

export function isBookRecommended(
  book: Pick<TomeBook, "id" | "apparatusStatus">
): boolean {
  return isBookComplete(book) || isBookInProgress(book)
}
