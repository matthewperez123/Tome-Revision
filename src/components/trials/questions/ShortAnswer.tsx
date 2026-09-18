"use client"

import type { QuestionRendererProps } from "./shared"
import { FillBlank } from "./FillBlank"

/**
 * Short answer — a few words typed against an accepted-answers key. Reuses
 * the FillBlank input treatment; when the prompt carries a "____" token the
 * input inlines, otherwise it renders below the prompt. Grading (normalized
 * match on meta.acceptedAnswers, else rubric review) happens server-side.
 */
export function ShortAnswer(props: QuestionRendererProps) {
  return <FillBlank {...props} />
}
