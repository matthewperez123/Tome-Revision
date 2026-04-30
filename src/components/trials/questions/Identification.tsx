"use client"

import { useEffect, useState } from "react"
import type { QuestionRendererProps } from "./shared"
import { OPTION_LABELS, optionState } from "./shared"
import { OptionButton } from "./OptionButton"

const SUBJECT_LABEL: Record<string, string> = {
  speaker: "Who said this?",
  book: "From which book?",
  character: "Which character is this?",
}

/**
 * Identification — option-based like multiple choice, prefixed with a small
 * subject question ("Who said this?" / "From which book?" / "Which
 * character?"). Auto-submits 300ms after selection.
 */
export function Identification({
  question,
  answered,
  selectedAnswer,
  onSubmit,
  reduced,
}: QuestionRendererProps) {
  const [pending, setPending] = useState<string | null>(null)

  useEffect(() => {
    if (!pending || answered) return
    const t = setTimeout(
      () => {
        onSubmit(pending)
        setPending(null)
      },
      reduced ? 0 : 300,
    )
    return () => clearTimeout(t)
  }, [pending, answered, onSubmit, reduced])

  useEffect(() => {
    // Mirrors the established pattern in MultipleChoice.tsx — clear any
    // pending selection once the engine records the answer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (answered) setPending(null)
  }, [answered, question.id])

  const subject = question.identificationSubject
    ? SUBJECT_LABEL[question.identificationSubject]
    : "Identify the source"

  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {subject}
      </p>
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
    </div>
  )
}
