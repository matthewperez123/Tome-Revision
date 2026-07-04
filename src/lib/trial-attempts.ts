// ─────────────────────────────────────────────
// Trial Attempts — local-first auto-save / resume.
//
// Stores in-progress attempt state in localStorage so the user can pause
// (close the tab) and resume cleanly. Matches the existing local-first
// persistence pattern in `book-progress.ts`.
//
// One key per (bookId, chapterIndex, tier). Starting a fresh attempt at
// the same triple overwrites the previous in-progress state; completing
// an attempt clears the key.
// ─────────────────────────────────────────────

import type { QuizDifficulty } from "@/lib/book-progress"

export interface TrialAttemptSnapshot {
  bookId: string
  chapterIndex: number
  tier: QuizDifficulty
  /** Mirror of QuizState.currentIndex */
  currentIndex: number
  /** Mirror of QuizState.answers */
  answers: (string | null)[]
  /** Mirror of QuizState.results */
  results: ("correct" | "wrong" | null)[]
  /** Mirror of QuizState.score */
  score: number
  /** Reflection grades captured so far (questionId → { score, feedback, status }). */
  reflectionGrades: Record<
    string,
    { score: number; feedback: string; status: "pending" | "graded" | "failed" }
  >
  /** Wallclock at last save — used for the "Resuming where you left off" toast. */
  lastSavedAt: string
  /** Wallclock at attempt start. */
  startedAt: string
}

const ATTEMPT_PREFIX = "tome-trial-attempt-"

function attemptKey(bookId: string, chapterIndex: number, tier: QuizDifficulty) {
  return `${ATTEMPT_PREFIX}${bookId}-${chapterIndex}-${tier}`
}

/** Save (overwrite) the in-progress attempt for a given book/chapter/tier. */
export function saveAttempt(snap: TrialAttemptSnapshot): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(
      attemptKey(snap.bookId, snap.chapterIndex, snap.tier),
      JSON.stringify(snap)
    )
  } catch {
    /* quota / private mode — silent */
  }
}

/** Load the in-progress attempt for a given book/chapter/tier, if any. */
export function loadAttempt(
  bookId: string,
  chapterIndex: number,
  tier: QuizDifficulty
): TrialAttemptSnapshot | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(attemptKey(bookId, chapterIndex, tier))
    if (!raw) return null
    return JSON.parse(raw) as TrialAttemptSnapshot
  } catch {
    return null
  }
}

/** Clear the in-progress attempt for a given book/chapter/tier. */
export function clearAttempt(
  bookId: string,
  chapterIndex: number,
  tier: QuizDifficulty
): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(attemptKey(bookId, chapterIndex, tier))
  } catch {
    /* silent */
  }
}

/** Find any in-progress attempt for a given book/chapter regardless of tier.
 *  Returns the most recently saved one, used to seed the difficulty toast's
 *  "Resume where you left off" row. */
export function findAttemptForChapter(
  bookId: string,
  chapterIndex: number
): TrialAttemptSnapshot | null {
  if (typeof window === "undefined") return null
  let latest: TrialAttemptSnapshot | null = null
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key?.startsWith(`${ATTEMPT_PREFIX}${bookId}-${chapterIndex}-`)) continue
      const raw = localStorage.getItem(key)
      if (!raw) continue
      try {
        const snap = JSON.parse(raw) as TrialAttemptSnapshot
        if (
          !latest ||
          new Date(snap.lastSavedAt).getTime() >
            new Date(latest.lastSavedAt).getTime()
        ) {
          latest = snap
        }
      } catch {
        /* skip malformed */
      }
    }
  } catch {
    /* silent */
  }
  return latest
}

/** Heuristic: an attempt is "in progress" if it has at least one answer
 *  recorded but isn't on the final question yet. */
export function isAttemptResumable(snap: TrialAttemptSnapshot): boolean {
  const answered = snap.answers.filter((a) => a !== null).length
  return answered > 0 && answered < snap.answers.length
}
