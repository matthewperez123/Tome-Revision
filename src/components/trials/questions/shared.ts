import type { Question } from "@/lib/quiz-engine"

/**
 * Props contract every question-type renderer follows.
 * - `answered === true` means the engine already recorded the answer; the
 *   renderer should show feedback (correct/wrong state) and disable input.
 * - `onSubmit(value)` commits the answer. For auto-submit types (MC / T-F /
 *   Passage ID / Vocab / Cross-Ref) this fires immediately on select.
 *   For explicit-submit types (Fill Blank / Ordering / Matching /
 *   Theme Analysis / Close Reading) the renderer's internal "Check Answer"
 *   button triggers it.
 */
export interface QuestionRendererProps {
  question: Question
  answered: boolean
  isCorrect: boolean
  isWrong: boolean
  selectedAnswer: string | null
  onSubmit: (answer: string) => void
  reduced: boolean
  /**
   * Option texts ruled out by a revealed hint (distractor elimination). Greyed
   * and non-selectable before the answer is committed. Consumed by MC-style
   * renderers; ignored by the rest.
   */
  eliminatedOptions?: string[]
}

export const OPTION_LABELS = ["A", "B", "C", "D", "E"] as const

export function norm(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ")
}

export function optionState(
  opt: string,
  correct: string,
  selected: string | null,
  answered: boolean,
  caseInsensitive = true
): "idle" | "correct" | "wrong" | "disabled" {
  if (!answered) return "idle"
  const cmp = caseInsensitive ? norm : (s: string) => s
  if (cmp(opt) === cmp(correct)) return "correct"
  if (selected && cmp(opt) === cmp(selected) && cmp(opt) !== cmp(correct)) return "wrong"
  return "disabled"
}
