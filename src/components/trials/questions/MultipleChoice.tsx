"use client"

import { useEffect, useState } from "react"
import type { QuestionRendererProps } from "./shared"
import { OPTION_LABELS, optionState } from "./shared"
import { OptionButton } from "./OptionButton"

/**
 * Multiple Choice (4 options). Auto-submits 300ms after selection so the
 * user sees their selected-state briefly before feedback appears.
 */
export function MultipleChoice({
  question,
  answered,
  selectedAnswer,
  onSubmit,
  reduced,
}: QuestionRendererProps) {
  const [pending, setPending] = useState<string | null>(null)

  useEffect(() => {
    if (!pending || answered) return
    const t = setTimeout(() => {
      onSubmit(pending)
      setPending(null)
    }, reduced ? 0 : 300)
    return () => clearTimeout(t)
  }, [pending, answered, onSubmit, reduced])

  useEffect(() => {
    if (answered) setPending(null)
  }, [answered, question.id])

  return (
    <div className="space-y-2.5">
      {question.options.map((opt, i) => {
        const state = answered
          ? optionState(opt, question.correct_answer, selectedAnswer, answered)
          : pending === opt
            ? "selected"
            : "idle"
        return (
          <OptionButton
            key={opt + i}
            label={OPTION_LABELS[i] ?? String(i + 1)}
            text={opt}
            state={state}
            disabled={answered || pending !== null}
            onClick={() => setPending(opt)}
            reduced={reduced}
          />
        )
      })}
    </div>
  )
}
