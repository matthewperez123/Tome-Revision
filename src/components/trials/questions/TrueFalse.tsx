"use client"

import { useEffect, useState } from "react"
import { CheckSquare, XSquare } from "lucide-react"
import type { QuestionRendererProps } from "./shared"
import { norm, optionState } from "./shared"

export function TrueFalse({
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
    }, reduced ? 0 : 200)
    return () => clearTimeout(t)
  }, [pending, answered, onSubmit, reduced])

  const cards: { value: "true" | "false"; label: string; Icon: typeof CheckSquare }[] = [
    { value: "true", label: "True", Icon: CheckSquare },
    { value: "false", label: "False", Icon: XSquare },
  ]

  const correct = norm(question.correct_answer)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map(({ value, label, Icon }) => {
        const state = answered
          ? optionState(value, correct, selectedAnswer, answered)
          : pending === value
            ? "selected"
            : "idle"
        const base =
          "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 py-10 px-6 text-lg font-serif font-bold transition-[background-color,border-color] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--trial-select)] focus-visible:ring-offset-2"
        const tokenStyle =
          state === "correct"
            ? { borderColor: "var(--trial-correct)", background: "var(--trial-correct-soft)", color: "var(--foreground)" }
            : state === "wrong"
              ? { borderColor: "var(--trial-incorrect)", background: "var(--trial-incorrect-soft)", color: "var(--foreground)" }
              : state === "disabled"
                ? { borderColor: "var(--border)", background: "var(--muted)", color: "var(--muted-foreground)" }
                : state === "selected"
                  ? { borderColor: "var(--trial-select)", background: "var(--trial-select-soft)", color: "var(--foreground)" }
                  : { borderColor: "var(--border)", background: "var(--card)", color: "var(--foreground)" }
        return (
          <button
            key={value}
            type="button"
            onClick={() => {
              if (!answered && !pending) setPending(value)
            }}
            disabled={answered || pending !== null}
            style={tokenStyle}
            className={`${base} ${state === "idle" ? "hover:border-[var(--trial-select)] hover:bg-[var(--trial-select-soft)]" : ""} ${state === "disabled" ? "opacity-60" : ""}`}
          >
            <Icon className="w-8 h-8" aria-hidden />
            {label}
          </button>
        )
      })}
    </div>
  )
}
