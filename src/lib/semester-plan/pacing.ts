/**
 * Deterministic pacing — ALL arithmetic across the term is computed here in
 * code, never by the model. Virgil returns the sequence + assignments; this
 * module sums per-chapter reading time, flags weeks over the cap, computes
 * concrete dates, and annotates the difficulty ramp.
 *
 * Pure module: no server-only imports, no I/O. Callers pass in chapter minutes.
 */

import type { TeacherQuizDifficulty } from "@/lib/teacher-quiz-types"
import type { GeneratedItem } from "@/lib/semester-plan/types"

/** Per-book chapter minute lookup + a fallback for apportioning. */
export interface BookPacing {
  /** chapter_index -> estimated_minutes */
  minutes: Map<number, number>
  reading_time_minutes: number
  chapter_count: number
}

export type ChapterMinuteIndex = Map<string, BookPacing>

/** Only reading-type items contribute to the weekly reading-time load. */
const LOAD_TYPES = new Set(["reading", "custom_reading"])

/** Rough fixed estimates (minutes) for non-reading work, for display only. */
const FIXED_MINUTES: Record<string, number> = {
  quiz: 15,
  guided_session: 30,
  essay: 45,
  discussion: 20,
}

/** Estimate minutes for a single item. Reading sums real per-chapter data. */
export function estimateItemMinutes(item: GeneratedItem, index: ChapterMinuteIndex): number {
  if (item.book_id && (item.type === "reading" || item.type === "quiz")) {
    const pacing = index.get(item.book_id)
    if (pacing && item.chapter_refs?.length) {
      let sum = 0
      let missing = 0
      for (const ch of item.chapter_refs) {
        const m = pacing.minutes.get(ch)
        if (m != null) sum += m
        else missing += 1
      }
      // Apportion reading_time_minutes for any chapters lacking per-chapter data.
      if (missing > 0 && pacing.chapter_count > 0) {
        sum += Math.round((pacing.reading_time_minutes / pacing.chapter_count) * missing)
      }
      if (item.type === "reading") return sum
      // A quiz's own time is small; its reading was already counted on the
      // reading item, so it gets the fixed quiz estimate, not the chapter sum.
      return FIXED_MINUTES.quiz
    }
  }
  return FIXED_MINUTES[item.type] ?? 0
}

export function isLoadType(type: string): boolean {
  return LOAD_TYPES.has(type)
}

/** Sum the reading-time load for a week (reading + outside reading only). */
export function weekLoadMinutes(
  items: { type: string; est_minutes: number | null }[],
): number {
  return items.reduce((sum, it) => (LOAD_TYPES.has(it.type) ? sum + (it.est_minutes ?? 0) : sum), 0)
}

// ── Dates ─────────────────────────────────────────────────────────────────────

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00Z")
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** {date_start, date_end} for a 1-based week index relative to term start. */
export function weekDates(
  termStart: string | null | undefined,
  weekIndex: number,
): { date_start: string | null; date_end: string | null } {
  if (!termStart) return { date_start: null, date_end: null }
  const start = addDays(termStart, (weekIndex - 1) * 7)
  return { date_start: start, date_end: addDays(start, 6) }
}

/** Concrete due date for an item from term start + week + day offset. */
export function itemDueDate(
  termStart: string | null | undefined,
  weekIndex: number,
  dueOffsetDays: number | undefined,
): string | null {
  if (!termStart) return null
  return addDays(termStart, (weekIndex - 1) * 7 + (dueOffsetDays ?? 4))
}

// ── Difficulty ramp ─────────────────────────────────────────────────────────

const RAMP: TeacherQuizDifficulty[] = ["apprentice", "scholar", "master"]
const RANK: Record<TeacherQuizDifficulty, number> = { apprentice: 1, scholar: 2, master: 3 }

/** Recommended difficulty ceiling for a week — start lower, build up by thirds. */
export function rampDifficultyForWeek(weekIndex: number, totalWeeks: number): TeacherQuizDifficulty {
  if (totalWeeks <= 1) return "scholar"
  const third = Math.ceil(totalWeeks / 3)
  if (weekIndex <= third) return "apprentice"
  if (weekIndex <= third * 2) return "scholar"
  return "master"
}

/** True when a quiz difficulty jumps ahead of the recommended ramp for its week. */
export function exceedsRamp(
  difficulty: TeacherQuizDifficulty,
  weekIndex: number,
  totalWeeks: number,
): boolean {
  return RANK[difficulty] > RANK[rampDifficultyForWeek(weekIndex, totalWeeks)]
}

export { RAMP }
