"use client"

import { useEffect, useState } from "react"
import { Quote } from "lucide-react"
import type { QuestionRendererProps } from "./shared"
import { OPTION_LABELS, optionState } from "./shared"
import { OptionButton } from "./OptionButton"

/**
 * Passage Identification — a quoted passage, user picks speaker/work/tradition.
 * Passage renders as a parchment card with a laurel-gold left border.
 */
export function PassageIdentification({
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

  const passage = question.passage ?? question.prompt

  return (
    <div className="space-y-5">
      {/* Parchment-tinted passage card */}
      <div
        className="rounded-r-lg border-l-4 pl-4 pr-3 py-3"
        style={{
          borderColor: "var(--trial-laureate)",
          background: "var(--trial-laureate-soft)",
        }}
      >
        <Quote
          className="w-4 h-4 mb-1"
          style={{ color: "var(--trial-laureate-text)" }}
          aria-hidden
        />
        <p className="font-serif text-[18px] leading-[1.8] text-ink italic">
          {passage}
        </p>
      </div>

      {question.passage && question.prompt !== question.passage && (
        <p className="font-serif text-ink text-base">{question.prompt}</p>
      )}

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
