"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { QuestionRendererProps } from "./shared"
import { OPTION_LABELS, optionState } from "./shared"
import { OptionButton } from "./OptionButton"

/**
 * Theme Analysis — longer MC variant with explicit Check Answer. Scholar/Master.
 */
export function ThemeAnalysis({
  question,
  answered,
  selectedAnswer,
  onSubmit,
  reduced,
}: QuestionRendererProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const passage = question.passage

  return (
    <div className="space-y-5">
      {passage && (
        <div
          className="rounded-r-lg border-l-4 pl-4 pr-3 py-3"
          style={{
            borderColor: "var(--codex-tier-laureate)",
            background: "var(--codex-tier-laureate-soft)",
          }}
        >
          <p className="font-serif text-[18px] leading-[1.8] text-ink">{passage}</p>
        </div>
      )}

      <div className="space-y-2.5">
        {question.options.map((opt, i) => {
          const state = answered
            ? optionState(opt, question.correct_answer, selectedAnswer, answered)
            : selected === opt
              ? "selected"
              : "idle"
          return (
            <OptionButton
              key={opt + i}
              label={OPTION_LABELS[i] ?? String(i + 1)}
              text={opt}
              state={state}
              disabled={answered}
              size="lg"
              onClick={() => setSelected(opt)}
              reduced={reduced}
            />
          )
        })}
      </div>

      {!answered && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => selected && onSubmit(selected)}
            disabled={!selected}
            className="codex-pressable-edge min-h-[44px] font-semibold"
            style={
              selected
                ? {
                    background: "var(--codex-primary)",
                    color: "var(--codex-on-primary)",
                    borderRadius: "var(--codex-radius-btn)",
                  }
                : { borderRadius: "var(--codex-radius-btn)" }
            }
          >
            Check Answer
          </Button>
        </div>
      )}
    </div>
  )
}
