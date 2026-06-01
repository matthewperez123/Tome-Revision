"use client"

import { useEffect, useState } from "react"
import { Link2, BookOpen } from "lucide-react"
import type { QuestionRendererProps } from "./shared"
import { OPTION_LABELS, optionState } from "./shared"

/**
 * Cross-Reference — Master tier. Pick which other work in the catalog the
 * passage connects to. Options rendered as mini library cards.
 */
export function CrossReference({
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

  const passage = question.passage

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Link2 className="w-3.5 h-3.5" />
        Cross-reference
      </div>

      {passage && (
        <div
          className="rounded-r-lg border-l-4 pl-4 pr-3 py-3"
          style={{
            borderColor: "var(--trial-laureate)",
            background: "var(--trial-laureate-soft)",
          }}
        >
          <p className="font-serif text-[18px] leading-[1.8] text-ink italic">{passage}</p>
        </div>
      )}

      {passage && <p className="font-sans text-sm text-muted-foreground">{question.prompt}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((opt, i) => {
          const state = answered
            ? optionState(opt, question.correct_answer, selectedAnswer, answered)
            : pending === opt
              ? "selected"
              : "idle"
          const baseCls =
            "flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-[background-color,border-color] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--trial-select)]"
          const tokenStyle =
            state === "correct"
              ? { borderColor: "var(--trial-correct)", background: "var(--trial-correct-soft)" }
              : state === "wrong"
                ? { borderColor: "var(--trial-incorrect)", background: "var(--trial-incorrect-soft)" }
                : state === "selected"
                  ? { borderColor: "var(--trial-select)", background: "var(--trial-select-soft)" }
                  : { borderColor: "var(--border)", background: "var(--card)" }
          return (
            <button
              key={opt + i}
              type="button"
              onClick={() => !answered && !pending && setPending(opt)}
              disabled={answered || pending !== null}
              style={tokenStyle}
              className={`${baseCls} ${state === "idle" ? "hover:border-[var(--trial-select)]" : ""}`}
              aria-pressed={state === "selected" || state === "correct" || state === "wrong"}
            >
              <span
                className="flex-shrink-0 size-10 rounded-md bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-xs font-bold font-sans text-stone-700 dark:text-stone-300"
                aria-hidden
              >
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-serif text-sm font-semibold text-ink truncate">
                  {opt}
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                  {OPTION_LABELS[i] ?? String(i + 1)}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
