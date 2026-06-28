// Weekly Challenge — derived from real reading activity, scoped to the current
// Monday–Sunday week so it changes as you read and resets automatically when a
// new week begins (only timestamps inside the current week window are counted).

import type { BookProgress } from "@/lib/book-progress"

export interface WeeklyChallenge {
  /** Weekday indices (Mon=0 … Sun=6) with reading activity this week. */
  readDays: number[]
  /** Distinct books touched this week. */
  booksRead: number
}

/** Weekday index with Monday as 0 (JS getDay has Sunday as 0). */
function mondayIndex(d: Date): number {
  const g = d.getDay()
  return g === 0 ? 6 : g - 1
}

/** Midnight on the Monday that begins `now`'s week. */
export function weekStart(now: Date): Date {
  const s = new Date(now)
  s.setHours(0, 0, 0, 0)
  s.setDate(s.getDate() - mondayIndex(s))
  return s
}

/**
 * Reduce all book progress to this week's activity. Each book contributes its
 * start/last-read timestamps and every quiz completion; any that fall inside the
 * current week mark that weekday and count the book as read this week.
 */
export function getWeeklyChallenge(
  allProgress: Record<string, BookProgress>,
  now: Date,
): WeeklyChallenge {
  const start = weekStart(now)
  const end = new Date(start)
  end.setDate(end.getDate() + 7)

  const days = new Set<number>()
  const books = new Set<string>()

  for (const [bookId, p] of Object.entries(allProgress)) {
    const stamps = [p.startedAt, p.lastReadAt, ...(p.quizResults ?? []).map((q) => q.completedAt)]
    let active = false
    for (const s of stamps) {
      if (!s) continue
      const t = new Date(s)
      if (Number.isNaN(t.getTime())) continue
      if (t >= start && t < end) {
        days.add(mondayIndex(t))
        active = true
      }
    }
    if (active) books.add(bookId)
  }

  return { readDays: [...days], booksRead: books.size }
}
