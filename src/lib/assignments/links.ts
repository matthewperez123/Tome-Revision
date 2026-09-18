import { toReaderIndex } from "./chapters"

/**
 * The single builder for "open this assignment" links (Phase 1.1).
 * Book-backed assignments open the GENERAL reader (`/read/[bookId]`) with
 * assignment context; everything else opens the assignment detail page.
 * Nothing outside this module may hand-build these URLs.
 */
/** The assignment detail page (essay/discussion writing, teacher views). */
export function assignmentDetailHref(classroomId: string, assignmentId: string): string {
  return `/classroom/${classroomId}/assignment/${assignmentId}`
}

export function assignmentReaderHref(a: {
  id: string
  classroom_id: string
  book_id: string | null
  chapter_range_start: number | null
}): string {
  if (!a.book_id) return assignmentDetailHref(a.classroom_id, a.id)
  const ch = a.chapter_range_start == null ? 0 : toReaderIndex(a.chapter_range_start)
  return `/read/${a.book_id}?ch=${ch}&classroom=${a.classroom_id}&assignment=${a.id}`
}
