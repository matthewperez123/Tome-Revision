/**
 * Trial adapters — bridge the existing content banks into TrialItem.
 *
 * The engine consumes only `TrialItem` (./types). These pure converters map
 * the two pre-existing question sources onto it WITHOUT changing them:
 *   1. the six-type typed questions (./question-types, zod-validated)
 *   2. the legacy flat `ChapterQuestion` bank (src/lib/chapter-questions.ts),
 *      which already covers multiple_choice / ordering / matching /
 *      tf_with_reason / identification / vocabulary_in_context /
 *      cross_reference / close_reading / reflection / fill_blank / passage_id.
 *
 * Missing pedagogy fields are filled with safe defaults (empty anchors,
 * empty hint ladder, Wisdom from difficulty/xpReward) so legacy content runs
 * through the new engine unchanged.
 */
import type { ChapterQuestion } from "@/lib/chapter-questions"
import type { Hint } from "@/lib/quiz-hints"
import type { TrialQuestion } from "./question-types"
import type { PassageAnchor, TrialItem, TrialOption } from "./types"

const WISDOM_BY_DIFFICULTY = { apprentice: 5, scholar: 10, master: 15 } as const

type Base = Pick<TrialItem, "anchors" | "evidenceAnchor" | "hints" | "difficulty" | "wisdom">

function baseFromLegacy(
  q: { explanation?: string | null; difficulty?: string; points?: number },
  wisdom: number
): Base & { rationale: string } {
  const difficulty =
    q.difficulty === "scholar" || q.difficulty === "master" ? q.difficulty : "apprentice"
  return {
    rationale: q.explanation ?? "See the passage.",
    anchors: [],
    evidenceAnchor: null,
    hints: [],
    difficulty,
    wisdom: q.points ?? wisdom,
  }
}

/** Convert one six-type typed question into a TrialItem. */
export function fromTypedQuestion(q: TrialQuestion): TrialItem {
  const base = baseFromLegacy(q, WISDOM_BY_DIFFICULTY[q.difficulty])
  const common = { id: q.id, prompt: q.prompt, ...base }
  switch (q.type) {
    case "fill_the_line":
      return { ...common, family: "fill-the-line", content: q.content }
    case "find_the_evidence":
      return { ...common, family: "find-the-evidence", content: q.content }
    case "word_in_context":
      return { ...common, family: "word-in-context", content: q.content }
    case "match_pairs":
      return { ...common, family: "match-pairs", content: q.content }
    case "who_said_it":
      return { ...common, family: "who-said-it", content: q.content }
    case "recitation":
      return { ...common, family: "recitation", content: q.content }
  }
}

function optionsFromStrings(options: string[], correctIndex: number): TrialOption[] {
  return options.map((text, i) => ({
    id: `opt-${i}`,
    text,
    correct: i === correctIndex,
  }))
}

function difficultyFromLegacy(d: ChapterQuestion["difficulty"]): Base["difficulty"] {
  return d === "Scholar" ? "scholar" : d === "Master" ? "master" : "apprentice"
}

/**
 * Convert one legacy ChapterQuestion into a TrialItem. Returns null for
 * shapes that cannot be mapped safely (missing required payload), so callers
 * can filter rather than crash on sparse bank rows.
 */
export function fromChapterQuestion(
  q: ChapterQuestion,
  extra?: { anchors?: PassageAnchor[]; evidenceAnchor?: PassageAnchor | null; hints?: Hint[] }
): TrialItem | null {
  const difficulty = difficultyFromLegacy(q.difficulty)
  const common = {
    id: q.id,
    prompt: q.text,
    rationale: q.explanation,
    anchors: extra?.anchors ?? [],
    evidenceAnchor: extra?.evidenceAnchor ?? null,
    hints: extra?.hints ?? [],
    difficulty,
    wisdom: q.xpReward,
  }
  switch (q.type) {
    case "multiple_choice":
    case "theme_analysis":
      if (!q.options || q.correctIndex === undefined) return null
      return {
        ...common,
        family: "multiple-choice",
        content: { options: optionsFromStrings(q.options, q.correctIndex) },
      }
    case "passage_id":
    case "identification":
      if (!q.options || q.correctIndex === undefined) return null
      return {
        ...common,
        prompt: q.type === "identification" ? q.text : `Identify this passage: ${q.text}`,
        family: "passage-identification",
        content: {
          passage: q.passage ?? q.text,
          subject: q.identificationSubject ?? "book",
          options: optionsFromStrings(q.options, q.correctIndex),
        },
      }
    case "vocabulary_in_context":
      if (!q.options || q.correctIndex === undefined || !q.vocabWord) return null
      return {
        ...common,
        family: "vocabulary-in-context",
        content: {
          sentence: q.text,
          targetWord: q.vocabWord,
          options: optionsFromStrings(q.options, q.correctIndex),
        },
      }
    case "close_reading":
      if (!q.options || q.correctIndex === undefined || !q.passage) return null
      return {
        ...common,
        family: "close-reading",
        content: {
          passage: q.passage,
          focusPhrase:
            q.passageHighlight && q.passage
              ? q.passage.slice(q.passageHighlight[0], q.passageHighlight[1])
              : undefined,
          options: optionsFromStrings(q.options, q.correctIndex),
        },
      }
    case "cross_reference":
      if (!q.options || q.correctIndex === undefined) return null
      return {
        ...common,
        family: "cross-reference",
        content: {
          passageA: { text: q.passage ?? q.text, citation: q.citation ?? "—" },
          passageB: {
            text: q.crossRefLabel ?? "the paired passage",
            citation: q.crossRefBookId ?? "—",
          },
          options: optionsFromStrings(q.options, q.correctIndex),
        },
      }
    case "true_false":
      if (q.correctBool === undefined) return null
      return {
        ...common,
        family: "true-false-with-reason",
        content: {
          statement: q.text,
          correctBool: q.correctBool,
          reasons: [
            { id: "r0", text: q.explanation, correct: true },
            { id: "r1", text: "The opposite is stated in the text.", correct: false },
          ],
        },
      }
    case "tf_with_reason":
      if (q.correctBool === undefined || !q.tfReasons || q.tfCorrectReason === undefined) return null
      return {
        ...common,
        family: "true-false-with-reason",
        content: {
          statement: q.text,
          correctBool: q.correctBool,
          reasons: optionsFromStrings(q.tfReasons, q.tfCorrectReason),
        },
      }
    case "ordering":
      if (!q.correctOrder || !q.options) return null
      return {
        ...common,
        family: "ordering",
        content: {
          items: q.options.map((text, i) => ({ id: `ord-${i}`, text })),
          correctOrder: q.correctOrder.map(
            (text) => `ord-${q.options!.indexOf(text)}`
          ),
        },
      }
    case "matching":
      if (!q.correctPairs) return null
      return {
        ...common,
        family: "match-pairs",
        content: {
          pairs: Object.entries(q.correctPairs).map(([left, right]) => ({ left, right })),
        },
      }
    case "fill_blank":
      if (!q.correctText) return null
      return {
        ...common,
        family: "fill-the-line",
        content: {
          lines: [q.text],
          blanks: [{ lineIndex: 0, answer: q.correctText }],
          wordBank: q.acceptedVariants ? [q.correctText, ...q.acceptedVariants] : undefined,
          mode: "type",
        },
      }
    case "reflection":
      return {
        ...common,
        prompt: q.reflectionPrompt ?? q.text,
        family: "reflection",
        content: {
          minWords: q.reflectionWordMin ?? 40,
          guidance: q.reflectionRubric ? [q.reflectionRubric] : [],
          rubric: (q.reflectionExpectedThemes ?? []).map((label, i) => ({
            id: `theme-${i}`,
            label,
          })),
        },
      }
    default:
      return null
  }
}

/** Convert a whole ChapterQuestion bank slice, dropping unmappable rows. */
export function fromChapterQuestions(
  qs: ChapterQuestion[],
  extra?: Parameters<typeof fromChapterQuestion>[1]
): TrialItem[] {
  return qs
    .map((q) => fromChapterQuestion(q, extra))
    .filter((item): item is TrialItem => item !== null)
}

/** Attach reader passage anchors to an item (immutably). */
export function withAnchors(
  item: TrialItem,
  anchors: PassageAnchor[],
  evidenceAnchor?: PassageAnchor | null
): TrialItem {
  return { ...item, anchors, evidenceAnchor: evidenceAnchor ?? item.evidenceAnchor }
}

/** Attach a hint ladder to an item (immutably). */
export function withHints(item: TrialItem, hints: Hint[]): TrialItem {
  return { ...item, hints }
}
