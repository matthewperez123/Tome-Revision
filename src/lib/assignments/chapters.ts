/**
 * Chapter-index convention for assignments (Phase 0.3, launch/week-1).
 *
 * CONVENTION: `assignments.chapter_range_start` / `chapter_range_end` are
 * 0-BASED READER ARRAY POSITIONS — identical to the reader's `currentChapter`
 * cursor and to `reading_progress.chapter_index`. The mapping between an
 * assignment range value and a reader index is the IDENTITY function.
 *
 * Evidence:
 * - src/components/classroom/teacher-assignment-composer.tsx:104 — comment:
 *   "Chapters for the selected book (0-based index = reader/reading_progress
 *   cursor)"; chapter <select> options use `value={String(c.number)}` from
 *   `getChapters(bookId)`.
 * - src/data/chapters.ts — `TomeChapter.number` starts at 0 including front
 *   matter (the-odyssey: number 0 = "Preface", 1 = "Athena Inspires the
 *   Prince", …), so `number` IS the reader array position.
 * - src/app/(app)/read/[bookId]/page.tsx (~:388) — `?ch=N` sets
 *   `currentChapter` directly; the chapters array comes from the same
 *   `getChapters(bookId)` ordering (src/lib/content.ts:32).
 * - src/lib/actions/grades.ts:166 — auto-finalize compares the reader's
 *   0-based cursor directly: `reached >= (chapter_range_end ??
 *   chapter_range_start ?? 0)`.
 * - Production row `2866ee1d-6f46-4c37-a386-ac4d20f5a535`
 *   ("The Odyssey: Books I–III", book_id `the-odyssey`,
 *   chapter_range_start = 1, chapter_range_end = 3): Books I–III occupy
 *   reader indexes 1–3 because index 0 is the Preface — unambiguously
 *   0-based identity, not 1-based.
 *
 * Every place that touches assignment chapter ranges must go through these
 * helpers; nothing else may do arithmetic on chapter numbers.
 */

export interface AssignmentChapterRange {
  chapter_range_start: number | null
  chapter_range_end: number | null
}

/** Assignment range value → reader `currentChapter` index. Identity. */
export function toReaderIndex(rangeValue: number): number {
  return rangeValue
}

/** Reader `currentChapter` index → assignment range value. Identity. */
export function fromReaderIndex(readerIndex: number): number {
  return readerIndex
}

/**
 * Whether a reader position falls within an assignment's chapter range.
 * A null start is treated as 0 (mirrors grades.ts auto-finalize); a null end
 * falls back to the start (single-chapter assignment). Both null → only
 * index 0 is "within range", matching `coalesce(end, start, 0)` semantics.
 */
export function isWithinRange(
  readerIndex: number,
  assignment: AssignmentChapterRange
): boolean {
  const start = assignment.chapter_range_start ?? 0
  const end = assignment.chapter_range_end ?? assignment.chapter_range_start ?? 0
  return readerIndex >= toReaderIndex(start) && readerIndex <= toReaderIndex(end)
}

/**
 * Whether the reader has reached (or passed) the end of an assignment's
 * range — the exact predicate used by `autoFinalizeReadingForBook`
 * (src/lib/actions/grades.ts:166).
 */
export function hasCompletedRange(
  readerIndex: number,
  assignment: AssignmentChapterRange
): boolean {
  const end = assignment.chapter_range_end ?? assignment.chapter_range_start ?? 0
  return readerIndex >= toReaderIndex(end)
}
