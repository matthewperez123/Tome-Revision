// ─────────────────────────────────────────────
// DB → ChapterQuestion adapter
// ─────────────────────────────────────────────
// Converts platform-authored `questions` rows (Supabase) into the
// `ChapterQuestion` shape the in-reading overlay consumes. This is the DB
// half of the reader bridge: curated static banks win (see
// `getCuratedQuestionsForChapter`); where they're absent, the reader falls
// back to these DB-backed quizzes, keyed on book_id + chapter_index +
// difficulty.
//
// Questions are DUAL-ENCODED in the DB: legacy `option_a..d` + `correct_option`
// AND newer `options` (jsonb) + `correct_answer` + `meta` (jsonb). This adapter
// prefers the newer columns and falls back to the legacy ones, so it reads both
// the four proven-in-prod types and the nine richer types whose extras live in
// `meta`.
// ─────────────────────────────────────────────

import type { ChapterQuestion, QuestionType, QuizDifficulty } from "./chapter-questions"

// ── DB row shape ───────────────────────────────

export type QuestionRow = {
  id: string
  quiz_id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: string
  explanation: string
  category: string | null
  type: string
  options: unknown // jsonb: string[] | null
  correct_answer: string | null
  order: number | null
  meta: unknown // jsonb: Record<string, unknown> | null
}

// `meta` keys mirror the renderer field names exactly (see Ordering.tsx,
// Matching.tsx, Reflection.tsx, TrueFalseReason.tsx, etc.). Keep this contract
// in lockstep with the generation side.
type QuestionMeta = {
  citation?: string
  acceptedVariants?: string[]
  correctOrder?: string[]
  matchingLeft?: string[]
  matchingRight?: string[]
  correctPairs?: Record<string, string>
  vocabWord?: string
  etymology?: string
  crossRefBookId?: string
  crossRefLabel?: string
  passage?: string
  passageHighlight?: [number, number]
  reflectionPrompt?: string
  reflectionWordMin?: number
  reflectionWordMax?: number
  reflectionRubric?: string
  reflectionExpectedThemes?: string[]
  identificationSubject?: "speaker" | "book" | "character"
  tfReasons?: string[]
  tfCorrectReason?: number
}

const VALID_TYPES: ReadonlySet<string> = new Set<QuestionType>([
  "multiple_choice",
  "true_false",
  "passage_id",
  "fill_blank",
  "theme_analysis",
  "ordering",
  "matching",
  "vocabulary_in_context",
  "cross_reference",
  "close_reading",
  "reflection",
  "identification",
  "tf_with_reason",
])

const LETTER_TO_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 }

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string")
  return []
}

function parseMeta(v: unknown): QuestionMeta {
  if (v && typeof v === "object" && !Array.isArray(v)) return v as QuestionMeta
  return {}
}

function isBoolish(s: string): boolean {
  return /^(true|t|yes)$/i.test(s.trim())
}

/**
 * Build the visible options list. Prefer the jsonb `options` array; fall back
 * to the legacy option_a..d columns, dropping the "n/a" sentinels used by
 * non-MC types that still must satisfy the NOT NULL columns.
 */
function deriveOptions(row: QuestionRow): string[] {
  const jsonOpts = asStringArray(row.options)
  if (jsonOpts.length > 0) return jsonOpts
  return [row.option_a, row.option_b, row.option_c, row.option_d].filter(
    (o) => o != null && o.trim() !== "" && o.trim().toLowerCase() !== "n/a"
  )
}

/**
 * Resolve the index of the correct option. Prefer matching `correct_answer`
 * text against the options; fall back to the legacy `correct_option` letter.
 */
function deriveCorrectIndex(row: QuestionRow, options: string[]): number {
  const ca = row.correct_answer?.trim()
  if (ca) {
    const idx = options.findIndex((o) => o.trim() === ca)
    if (idx >= 0) return idx
  }
  const letterIdx = LETTER_TO_INDEX[(row.correct_option ?? "").trim().toUpperCase()]
  if (letterIdx != null && letterIdx < options.length) return letterIdx
  return 0
}

/**
 * Convert one DB row to a ChapterQuestion. `difficulty` comes from the parent
 * quiz (the row itself doesn't carry it). Returns `null` for rows whose type
 * is unrecognized or whose payload is unusable, so a single bad row can't break
 * a chapter's trial.
 */
export function dbRowToChapterQuestion(
  row: QuestionRow,
  difficulty: QuizDifficulty
): ChapterQuestion | null {
  if (!VALID_TYPES.has(row.type)) return null
  const type = row.type as QuestionType
  const meta = parseMeta(row.meta)

  const base: ChapterQuestion = {
    id: row.id,
    type,
    text: row.question_text,
    difficulty,
    xpReward: 5,
    explanation: row.explanation ?? "",
    citation: meta.citation,
  }

  switch (type) {
    case "true_false": {
      const ca = row.correct_answer ?? row.option_a ?? "true"
      return { ...base, correctBool: isBoolish(ca) }
    }

    case "fill_blank": {
      const correctText = (row.correct_answer ?? row.option_a ?? "").trim()
      if (!correctText) return null
      return {
        ...base,
        correctText,
        acceptedVariants: meta.acceptedVariants ?? [],
      }
    }

    case "ordering": {
      // correctOrder: from meta, else parse the JSON-array correct_answer.
      let correctOrder = meta.correctOrder ?? []
      if (correctOrder.length === 0 && row.correct_answer) {
        try {
          correctOrder = asStringArray(JSON.parse(row.correct_answer))
        } catch {
          /* leave empty */
        }
      }
      if (correctOrder.length === 0) return null
      // options = the shuffled display order; fall back to the correct order.
      const shown = deriveOptions(row)
      return {
        ...base,
        options: shown.length > 0 ? shown : correctOrder,
        correctOrder,
      }
    }

    case "matching": {
      let correctPairs = meta.correctPairs ?? {}
      if (Object.keys(correctPairs).length === 0 && row.correct_answer) {
        try {
          const parsed = JSON.parse(row.correct_answer)
          if (parsed && typeof parsed === "object") {
            correctPairs = parsed as Record<string, string>
          }
        } catch {
          /* leave empty */
        }
      }
      const left = meta.matchingLeft ?? Object.keys(correctPairs)
      const right = meta.matchingRight ?? Object.values(correctPairs)
      if (left.length === 0 || Object.keys(correctPairs).length === 0) return null
      return { ...base, correctPairs, matchingLeft: left, matchingRight: right }
    }

    case "reflection": {
      return {
        ...base,
        reflectionPrompt: meta.reflectionPrompt ?? row.question_text,
        reflectionWordMin: meta.reflectionWordMin ?? 30,
        reflectionWordMax: meta.reflectionWordMax ?? 200,
        reflectionRubric: meta.reflectionRubric,
        reflectionExpectedThemes: meta.reflectionExpectedThemes,
      }
    }

    case "tf_with_reason": {
      // correct_answer is the composite "<bool>|<reasonIndex>".
      let correctBool = true
      let reasonIdx = meta.tfCorrectReason ?? 0
      const ca = row.correct_answer ?? ""
      if (ca.includes("|")) {
        const [b, r] = ca.split("|")
        correctBool = isBoolish(b)
        const ri = Number.parseInt(r, 10)
        if (!Number.isNaN(ri)) reasonIdx = ri
      } else if (ca) {
        correctBool = isBoolish(ca)
      }
      const tfReasons = meta.tfReasons ?? []
      if (tfReasons.length === 0) return null
      return { ...base, correctBool, tfReasons, tfCorrectReason: reasonIdx }
    }

    case "vocabulary_in_context": {
      const options = deriveOptions(row)
      if (options.length === 0) return null
      return {
        ...base,
        options,
        correctIndex: deriveCorrectIndex(row, options),
        vocabWord: meta.vocabWord,
        etymology: meta.etymology,
      }
    }

    case "cross_reference": {
      const options = deriveOptions(row)
      if (options.length === 0) return null
      return {
        ...base,
        options,
        correctIndex: deriveCorrectIndex(row, options),
        crossRefBookId: meta.crossRefBookId,
        crossRefLabel: meta.crossRefLabel,
      }
    }

    case "close_reading":
    case "theme_analysis":
    case "passage_id": {
      const options = deriveOptions(row)
      if (options.length === 0) return null
      return {
        ...base,
        options,
        correctIndex: deriveCorrectIndex(row, options),
        passage: meta.passage,
        passageHighlight: meta.passageHighlight,
      }
    }

    case "identification": {
      const options = deriveOptions(row)
      if (options.length === 0) return null
      return {
        ...base,
        options,
        correctIndex: deriveCorrectIndex(row, options),
        identificationSubject: meta.identificationSubject ?? "speaker",
      }
    }

    case "multiple_choice":
    default: {
      const options = deriveOptions(row)
      if (options.length === 0) return null
      return { ...base, options, correctIndex: deriveCorrectIndex(row, options) }
    }
  }
}

/**
 * Convert a quiz's worth of rows, dropping any that fail to adapt and
 * preserving DB `order`.
 */
export function dbRowsToChapterQuestions(
  rows: QuestionRow[],
  difficulty: QuizDifficulty
): ChapterQuestion[] {
  return [...rows]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((r) => dbRowToChapterQuestion(r, difficulty))
    .filter((q): q is ChapterQuestion => q !== null)
}
