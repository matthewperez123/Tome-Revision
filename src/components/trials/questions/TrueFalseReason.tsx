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
            const cls = isCorrect
              ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
              : isWrong
                ? "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200"
                : selected
                  ? "border-indigo-500 bg-indigo-50 text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-200"
                  : "border-stone-300 bg-stone-100 hover:border-indigo-400 dark:bg-[#222222]"
            return (
              <button
                key={value}
                type="button"
                onClick={() => pickTf(value)}
                disabled={answered}
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 py-6 px-4 font-serif font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 ${cls}`}
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
              const cls = isCorrect
                ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
                : isWrong
                  ? "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200"
                  : selected
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                    : "border-stone-300 bg-stone-100 hover:border-indigo-400 dark:bg-[#222222]"
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pickReason(i)}
                  disabled={answered}
                  className={`block w-full rounded-xl border-2 px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 ${cls}`}
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
