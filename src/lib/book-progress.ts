// Book progress tracking — localStorage-backed, Supabase-ready later

export interface ChapterQuizResult {
  chapterId: string
  chapterIndex: number
  score: number
  totalQuestions: number
  passed: boolean
  xpEarned: number
  completedAt: string
}

export type QuizDifficulty = 'Apprentice' | 'Scholar' | 'Master'

// Legacy tier names used in localStorage prior to the Trials overhaul.
// Kept as a type union for the migration helper only.
export type LegacyQuizDifficulty = 'Foundational' | 'Scholar' | 'Sage'

/** Map a legacy tier name to the current canonical name. */
export function migrateTierName(
  input: string | null | undefined
): QuizDifficulty | null {
  if (!input) return null
  switch (input) {
    case 'Foundational':
    case 'Apprentice':
      return 'Apprentice'
    case 'Scholar':
      return 'Scholar'
    case 'Sage':
    case 'Master':
      return 'Master'
    default:
      return null
  }
}

export interface BookProgress {
  bookId: string
  currentChapterIndex: number
  completedChapterIndices: number[]
  quizResults: ChapterQuizResult[]
  totalXpEarned: number
  readingTimeMinutes: number
  startedAt: string
  lastReadAt: string
}

const progressKey = (bookId: string) => `tome-book-progress-${bookId}`

export function getBookProgress(bookId: string): BookProgress | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(progressKey(bookId))
    if (!raw) return null
    // Migration shim: strip deprecated fields from old progress objects
    const { readingMode, difficulty, ...clean } = JSON.parse(raw) as BookProgress & { readingMode?: unknown; difficulty?: unknown }
    return clean as BookProgress
  } catch {
    return null
  }
}

export function saveBookProgress(progress: BookProgress): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(progressKey(progress.bookId), JSON.stringify(progress))
  } catch {}
}

export function createBookProgress(bookId: string): BookProgress {
  return {
    bookId,
    currentChapterIndex: 0,
    completedChapterIndices: [],
    quizResults: [],
    totalXpEarned: 0,
    readingTimeMinutes: 0,
    startedAt: new Date().toISOString(),
    lastReadAt: new Date().toISOString(),
  }
}

export function getAllBookProgress(): Record<string, BookProgress> {
  if (typeof window === 'undefined') return {}
  const result: Record<string, BookProgress> = {}
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('tome-book-progress-')) {
        const bookId = key.replace('tome-book-progress-', '')
        const progress = getBookProgress(bookId)
        if (progress) result[bookId] = progress
      }
    }
  } catch {}
  return result
}

// Front/back matter keywords — chapters matching these are never locked and skip quizzes
const FRONT_MATTER_KW = [
  "preface", "introduction", "introductory", "foreword", "dedication",
  "prologue", "epigraph", "letter", "note to", "author's note",
  "translator's", "dramatis personae", "the story", "frontispiece",
  "acknowledgment", "our raison", "characters in the play",
]
const BACK_MATTER_KW = [
  "afterword", "appendix", "postscript", "endnotes", "glossary",
  "bibliography", "colophon",
]

/** Check if a chapter title represents front or back matter (always unlocked, no quizzes) */
export function isFrontOrBackMatter(title: string): boolean {
  const lower = title.toLowerCase().trim()
  return FRONT_MATTER_KW.some(kw => lower.startsWith(kw) || lower.includes(kw))
    || BACK_MATTER_KW.some(kw => lower.startsWith(kw) || lower.includes(kw))
}


export function recordChapterComplete(
  progress: BookProgress,
  chapterIndex: number,
  xpEarned: number
): BookProgress {
  const alreadyDone = progress.completedChapterIndices.includes(chapterIndex)
  return {
    ...progress,
    completedChapterIndices: alreadyDone
      ? progress.completedChapterIndices
      : [...progress.completedChapterIndices, chapterIndex],
    totalXpEarned: progress.totalXpEarned + (alreadyDone ? 0 : xpEarned),
    currentChapterIndex: chapterIndex + 1,
    lastReadAt: new Date().toISOString(),
  }
}

export function recordQuizResult(
  progress: BookProgress,
  result: ChapterQuizResult
): BookProgress {
  return {
    ...progress,
    quizResults: [...progress.quizResults, result],
    lastReadAt: new Date().toISOString(),
  }
}

export function addReadingTime(progress: BookProgress, minutes: number): BookProgress {
  return {
    ...progress,
    readingTimeMinutes: progress.readingTimeMinutes + minutes,
    lastReadAt: new Date().toISOString(),
  }
}
