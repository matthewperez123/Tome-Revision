"use client"

import { useEffect, useState } from "react"
import { CheckSquare, XSquare } from "lucide-react"
import type { QuestionRendererProps } from "./shared"

/**
 * True/False with justification.
 *
 * Two-step input: pick T/F, then pick the reason. Submits a composite
 * `"<bool>|<reasonIndex>"` string that the engine compares against
 * `correct_answer` (also "<bool>|<reasonIndex>").
 */
export function TrueFalseReason({
  question,
  answered,
  selectedAnswer,
  onSubmit,
}: QuestionRendererProps) {
  const [tf, setTf] = useState<"true" | "false" | null>(null)
  const [reason, setReason] = useState<number | null>(null)

  // Reset internal state when the question changes. Established codebase
  // pattern for question renderers.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTf(null)
    setReason(null)
  }, [question.id])

  // When answered, hydrate from the engine's recorded answer so the visual
  // state shows what the user actually picked.
  useEffect(() => {
    if (!answered || !selectedAnswer) return
    const [bool, reasonIdx] = selectedAnswer.split("|")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (bool === "true" || bool === "false") setTf(bool)
    const idx = Number.parseInt(reasonIdx ?? "", 10)
    if (!Number.isNaN(idx)) setReason(idx)
  }, [answered, selectedAnswer])

  const reasons = question.tfReasons ?? []
  const [correctBool, correctReasonStr] = (question.correct_answer ?? "").split("|")
  const correctReason = Number.parseInt(correctReasonStr ?? "", 10)

  function tryCommit(nextTf: "true" | "false" | null, nextReason: number | null) {
    if (answered) return
    if (nextTf !== null && nextReason !== null) {
      onSubmit(`${nextTf}|${nextReason}`)
    }
  }

  function pickTf(value: "true" | "false") {
    if (answered) return
    setTf(value)
    tryCommit(value, reason)
  }

  function pickReason(idx: number) {
    if (answered) return
    setReason(idx)
    tryCommit(tf, idx)
  }

  const tfCards: { value: "true" | "false"; label: string; Icon: typeof CheckSquare }[] = [
    { value: "true", label: "True", Icon: CheckSquare },
    { value: "false", label: "False", Icon: XSquare },
  ]

  function stateStyle(state: "correct" | "wrong" | "selected" | "idle") {
    switch (state) {
      case "correct":
        return { borderColor: "var(--codex-success)", background: "var(--codex-success-soft)", color: "var(--foreground)" }
      case "wrong":
        return { borderColor: "var(--codex-danger)", background: "var(--codex-danger-soft)", color: "var(--foreground)" }
      case "selected":
        return { borderColor: "var(--codex-primary)", background: "var(--codex-primary-soft)", color: "var(--foreground)" }
      default:
        return { borderColor: "var(--border)", background: "var(--card)", color: "var(--foreground)" }
    }
  }

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Is the claim true or false?
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {tfCards.map(({ value, label, Icon }) => {
            const selected = tf === value
            const isCorrect = answered && value === correctBool
            const isWrong = answered && selected && value !== correctBool
            const state = isCorrect ? "correct" : isWrong ? "wrong" : selected ? "selected" : "idle"
            return (
              <button
                key={value}
                type="button"
                onClick={() => pickTf(value)}
                disabled={answered}
                style={stateStyle(state)}
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 py-6 px-4 font-serif font-bold transition-[background-color,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--codex-primary)] focus-visible:ring-offset-2 ${state === "idle" ? "hover:border-[var(--codex-primary)] hover:bg-[var(--codex-primary-soft)]" : ""}`}
                aria-pressed={selected}
              >
                <Icon className="size-6" aria-hidden="true" />
                {label}
              </button>
            )
          })}
        </div>
      </fieldset>

      {tf !== null && reasons.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            And why?
          </legend>
          <div className="space-y-2">
            {reasons.map((r, i) => {
              const selected = reason === i
              const isCorrect = answered && i === correctReason
              const isWrong = answered && selected && i !== correctReason
              const state = isCorrect ? "correct" : isWrong ? "wrong" : selected ? "selected" : "idle"
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pickReason(i)}
                  disabled={answered}
                  style={stateStyle(state)}
                  className={`block w-full rounded-xl border-2 px-4 py-3 text-left text-sm transition-[background-color,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--codex-primary)] focus-visible:ring-offset-2 ${state === "idle" ? "hover:border-[var(--codex-primary)] hover:bg-[var(--codex-primary-soft)]" : ""}`}
                  aria-pressed={selected}
                >
                  {r}
                </button>
              )
            })}
          </div>
        </fieldset>
      )}
    </div>
  )
}
