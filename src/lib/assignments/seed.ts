/**
 * Demo assignment seed used by `/assignments/[id]`.
 *
 * Today these power the assignment notifications surfaced in the reader
 * notification center. The shape mirrors what the classroom-scoped
 * assignment page consumes from Supabase, so swapping in real data later
 * is a straight substitution.
 */

export interface DemoAssignment {
  id: string
  title: string
  teacherName: string
  className: string
  bookId: string
  bookTitle: string
  chapterRange: string
  /** 0-indexed chapter to start reading at via `/read/{bookId}?ch=`. */
  beginChapterIndex: number
  /** Calendar phrase like "Friday" or "Tomorrow" — the demo doesn't store
   * an absolute due date because the reader-only demo has no clock skew. */
  due: string
  description: string
}

export const DEMO_ASSIGNMENTS: DemoAssignment[] = [
  {
    id: "iliad-books-1-3",
    title: "The Iliad — Books I through III",
    teacherName: "Mr. Aurelius",
    className: "AP Literature — Period 3",
    bookId: "the-iliad",
    bookTitle: "The Iliad",
    chapterRange: "Books I–III",
    beginChapterIndex: 0,
    due: "Friday",
    description:
      "Read the opening three books of the Iliad. Pay close attention to the quarrel between Agamemnon and Achilles in Book I and the catalogue of ships in Book II. Bring two questions to seminar.",
  },
  {
    id: "inferno-cantos-1-3",
    title: "Inferno — Cantos I through III",
    teacherName: "Ms. Beatrice",
    className: "World Literature",
    bookId: "inferno",
    bookTitle: "Inferno",
    chapterRange: "Cantos I–III",
    beginChapterIndex: 0,
    due: "Tomorrow",
    description:
      "Read the first three cantos of the Inferno and write a 600-word reflection on the figure of Virgil as guide. Cite at least two passages.",
  },
]

export function getDemoAssignment(id: string): DemoAssignment | undefined {
  return DEMO_ASSIGNMENTS.find((a) => a.id === id)
}
