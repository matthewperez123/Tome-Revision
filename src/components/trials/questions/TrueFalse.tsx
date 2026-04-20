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
          "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 py-10 px-6 text-lg font-serif font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
        const stateCls =
          state === "correct"
            ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
            : state === "wrong"
              ? "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200"
              : state === "disabled"
                ? "border-stone-300 bg-stone-100 opacity-60"
                : state === "selected"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-200"
                  : "border-stone-300 bg-stone-100 dark:bg-[#222222] hover:border-indigo-400"
        return (
          <button
            key={value}
            type="button"
            onClick={() => {
              if (!answered && !pending) setPending(value)
            }}
            disabled={answered || pending !== null}
            className={`${base} ${stateCls}`}
          >
            <Icon className="w-8 h-8" aria-hidden />
            {label}
          </button>
        )
      })}
    </div>
  )
}
