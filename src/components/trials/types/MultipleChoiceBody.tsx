"use client"

/**
 * Shared multiple-choice body — the ONE single-correct MC surface used by both
 * `word_in_context` and `who_said_it` (Phase 3 wraps this; do not duplicate).
 *
 * Presentational + controlled: the parent type-body owns the content→choices
 * mapping and the response shape ({ choiceIndex }); this component only renders
 * the option list and reports a tapped index via `onSelect`. It reuses the
 * existing token-driven <OptionButton> so styling matches the legacy quiz.
 */
import { OptionButton } from "@/components/trials/questions/OptionButton"
import { OPTION_LABELS } from "@/components/trials/questions/shared"

export interface MultipleChoiceBodyProps {
  /** The choice labels, in display order. */
  choices: string[]
  /** Index the user has selected (draft before grading, or final after). */
  selectedIndex: number | null
  /** True once the card has graded the answer — render read-only feedback. */
  answered: boolean
  /** The correct choice index, used only after `answered` to tint options. */
  correctIndex: number
  /** Commit a tapped choice index up to the card. */
  onSelect: (index: number) => void
  reduced: boolean
}

export function MultipleChoiceBody({
  choices,
  selectedIndex,
  answered,
  correctIndex,
  onSelect,
  reduced,
}: MultipleChoiceBodyProps) {
  return (
    <div className="space-y-2.5">
      {choices.map((choice, i) => {
        const state = answered
          ? i === correctIndex
            ? "correct"
            : i === selectedIndex
              ? "wrong"
              : "disabled"
          : selectedIndex === i
            ? "selected"
            : "idle"
        return (
          <OptionButton
            key={choice + i}
            label={OPTION_LABELS[i] ?? String(i + 1)}
            text={choice}
            state={state}
            disabled={answered}
            onClick={() => onSelect(i)}
            reduced={reduced}
          />
        )
      })}
    </div>
  )
}
