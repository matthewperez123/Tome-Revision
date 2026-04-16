/**
 * Stoa — the painting gallery reward system.
 *
 * Each painting is unlocked by completing exactly one book (strict 1:1).
 * The authoritative mapping lives in `src/data/stoa-collection.ts`.
 * Run `pnpm audit:stoa` to validate the invariant.
 */

import { STOA_COLLECTION, type StoaEntry } from "@/data/stoa-collection"
import { getPaintingById, type Painting } from "@/lib/paintings"
import { getBookProgress } from "@/lib/book-progress"
import { BOOKS } from "@/data/books"

// Re-export the type for consumers
export type { StoaEntry } from "@/data/stoa-collection"

export type CurationTier = 1 | 2 | 3 | 4
export type PublicDomainStatus = "CC0" | "PD-Old" | "PD-Art"

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

const byPaintingId = new Map<string, StoaEntry>()
const byBookId = new Map<string, StoaEntry>()

function ensureIndexes() {
  if (byPaintingId.size > 0) return
  for (const entry of STOA_COLLECTION) {
    byPaintingId.set(entry.id, entry)
    byBookId.set(entry.unlockingBookId, entry)
  }
}

/** Get the Stoa entry for a painting ID */
export function getStoaEntry(paintingId: string): StoaEntry | undefined {
  ensureIndexes()
  return byPaintingId.get(paintingId)
}

/** Get the Stoa entry for a book ID */
export function getStoaEntryForBook(bookId: string): StoaEntry | undefined {
  ensureIndexes()
  return byBookId.get(bookId)
}

/** Get the full Painting object for a book (via Stoa mapping) */
export function getPaintingForBook(bookId: string): Painting | undefined {
  const entry = getStoaEntryForBook(bookId)
  if (!entry) return undefined
  return getPaintingById(entry.id)
}

// ---------------------------------------------------------------------------
// Unlock detection
// ---------------------------------------------------------------------------

/** Check if a book is completed (on the "completed" shelf) */
function isBookCompleted(bookId: string): boolean {
  if (typeof window === "undefined") return false
  try {
    const raw = localStorage.getItem("tome-shelves")
    if (!raw) return false
    const shelves = JSON.parse(raw) as Record<string, { shelfType?: string; completedAt?: string }>
    const entry = shelves[bookId]
    return entry?.shelfType === "completed" && !!entry?.completedAt
  } catch {
    return false
  }
}

/** Check if a painting is unlocked (its book is completed) */
export function isPaintingUnlocked(paintingId: string): boolean {
  const entry = getStoaEntry(paintingId)
  if (!entry) return false
  return isBookCompleted(entry.unlockingBookId)
}

/** Get reading progress percentage for a painting's book (0–100) */
export function getBookCompletionPercent(bookId: string): number {
  const progress = getBookProgress(bookId)
  if (!progress) return 0
  const book = BOOKS.find((b) => b.id === bookId)
  if (!book || book.chapters === 0) return 0
  return Math.round((progress.completedChapterIndices.length / book.chapters) * 100)
}

// ---------------------------------------------------------------------------
// Aggregated views
// ---------------------------------------------------------------------------

export interface StoaEntryWithStatus extends StoaEntry {
  unlocked: boolean
  painting: Painting | undefined
  bookTitle: string
  bookAuthor: string
  completionPercent: number
}

/** Get all Stoa entries with their unlock status, painting, and book info */
export function getAllStoaEntries(): StoaEntryWithStatus[] {
  ensureIndexes()
  return STOA_COLLECTION.map((entry) => {
    const book = BOOKS.find((b) => b.id === entry.unlockingBookId)
    return {
      ...entry,
      unlocked: isBookCompleted(entry.unlockingBookId),
      painting: getPaintingById(entry.id),
      bookTitle: book?.title ?? "Unknown",
      bookAuthor: book?.author ?? "Unknown",
      completionPercent: getBookCompletionPercent(entry.unlockingBookId),
    }
  })
}

/** Get Stoa progress summary */
export function getStoaProgress(): { total: number; unlocked: number } {
  const all = getAllStoaEntries()
  return {
    total: all.length,
    unlocked: all.filter((e) => e.unlocked).length,
  }
}
