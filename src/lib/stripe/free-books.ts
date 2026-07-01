/**
 * The free sampler — Tome's 20 foundational books, readable without a
 * subscription.
 *
 * This is the SINGLE, EXPLICIT source of truth for "what is free". It replaces
 * the old implicit rule (`getFeaturedBooks()` → any book flagged `featured`),
 * which drifted with curation and editorial decisions unrelated to billing.
 *
 * Pure + client-safe (no imports): consumed by the client paywall gate
 * (`useEntitlement`) AND the server entitlement helper. Every id below must
 * exist in `src/data/books.ts`; `pnpm audit:free-books`-style drift would show
 * up as a book that 404s, so keep this list in sync when curating the canon.
 */
export const FREE_SAMPLE_BOOK_IDS = [
  "the-iliad",
  "the-odyssey",
  "the-aeneid",
  "the-republic",
  "meditations",
  "the-divine-comedy",
  "the-canterbury-tales",
  "hamlet",
  "macbeth",
  "don-quixote",
  "paradise-lost",
  "pride-and-prejudice",
  "frankenstein",
  "jane-eyre",
  "great-expectations",
  "moby-dick",
  "crime-and-punishment",
  "war-and-peace",
  "the-great-gatsby",
  "the-picture-of-dorian-gray",
] as const

const FREE_SAMPLE_SET: ReadonlySet<string> = new Set(FREE_SAMPLE_BOOK_IDS)

/** How many books a free account may read. */
export const FREE_BOOK_LIMIT = FREE_SAMPLE_BOOK_IDS.length

/** Whether `bookId` is part of the free sampler. */
export function isFreeSample(bookId: string): boolean {
  return FREE_SAMPLE_SET.has(bookId)
}
