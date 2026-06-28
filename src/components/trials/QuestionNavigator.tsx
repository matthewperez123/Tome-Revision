"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { Check, X } from "lucide-react"
import { RUBRIC } from "@/lib/semester-plan/rubric"
import { cn } from "@/lib/utils"

export type QuestionStatus =
  | "current"
  | "answered"
  | "unanswered"
  | "correct"
  | "incorrect"

export interface QuestionNavigatorProps {
  count: number
  currentIndex: number
  /**
   * Status for a question at `index`. The parent reports the persistent
   * status (answered / unanswered / correct / incorrect); the navigator
   * derives "current" from `currentIndex` itself so it can layer the active
   * treatment over a graded ring.
   */
  getStatus: (index: number) => QuestionStatus
  onSelect: (index: number) => void
}

const STATUS_WORD: Record<QuestionStatus, string> = {
  current: "current",
  answered: "answered",
  unanswered: "unanswered",
  correct: "correct",
  incorrect: "incorrect",
}

/**
 * Random-access question strip for the quiz. Presentational only — all state
 * lives in the parent. Numerals follow the RUBRIC "Switzer" intent; Switzer is
 * not bundled in the repo, so the app sans (Inter, `font-sans`) is the
 * documented substitution. Pigments come from the canonical RUBRIC palette;
 * neutral states use semantic tokens for day/night parity. No iridescence —
 * that signature is reserved for Virgil surfaces.
 */
export function QuestionNavigator({
  count,
  currentIndex,
  getStatus,
  onSelect,
}: QuestionNavigatorProps) {
  const reduced = useReducedMotion() ?? false
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  // Roving tabindex anchor — only one bubble is in the tab order at a time.
  const [rovingIndex, setRovingIndex] = useState(currentIndex)

  // Keep the tab-order anchor on the active question as it changes.
  useEffect(() => {
    setRovingIndex(currentIndex)
  }, [currentIndex])

  function focusBubble(index: number) {
    const clamped = Math.max(0, Math.min(count - 1, index))
    setRovingIndex(clamped)
    btnRefs.current[clamped]?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault()
        focusBubble(index + 1)
        break
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault()
        focusBubble(index - 1)
        break
      case "Home":
        e.preventDefault()
        focusBubble(0)
        break
      case "End":
        e.preventDefault()
        focusBubble(count - 1)
        break
      case "Enter":
      case " ":
        e.preventDefault()
        onSelect(index)
        break
    }
  }

  return (
    <div
      role="group"
      aria-label="Question navigator"
      className="mb-6 flex flex-wrap gap-2"
    >
      {Array.from({ length: count }).map((_, i) => {
        const status = getStatus(i)
        const isCurrent = i === currentIndex
        const graded = status === "correct" || status === "incorrect"
        const stateWord = isCurrent ? "current" : STATUS_WORD[status]

        // Current treatment (lapis fill) layers over any graded ring; otherwise
        // each status maps to its own pigment / neutral token.
        const bubbleStyle: React.CSSProperties = isCurrent
          ? {
              backgroundColor: RUBRIC.lapis,
              color: "#fff",
              boxShadow: graded
                ? `0 0 0 2px ${
                    status === "correct" ? RUBRIC.verdigris : RUBRIC.vermilion
                  }`
                : `0 0 0 3px color-mix(in srgb, ${RUBRIC.lapis} 28%, transparent)`,
            }
          : status === "correct"
            ? { backgroundColor: RUBRIC.verdigris, color: "#fff" }
            : status === "incorrect"
              ? { backgroundColor: RUBRIC.vermilion, color: "#fff" }
              : status === "answered"
                ? { backgroundColor: "var(--muted)", color: "var(--foreground)" }
                : {
                    backgroundColor: "transparent",
                    color: "var(--muted-foreground)",
                    boxShadow: "inset 0 0 0 1px var(--border)",
                  }

        return (
          <button
            key={i}
            ref={(el) => {
              btnRefs.current[i] = el
            }}
            type="button"
            tabIndex={i === rovingIndex ? 0 : -1}
            aria-current={isCurrent ? "true" : undefined}
            aria-label={`Question ${i + 1}, ${stateWord}`}
            onClick={() => onSelect(i)}
            onFocus={() => setRovingIndex(i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            style={bubbleStyle}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full",
              "font-sans text-sm font-semibold tabular-nums",
              "transition-[background-color,box-shadow,color,transform] duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "focus-visible:ring-[var(--codex-primary)] focus-visible:ring-offset-[var(--background)]",
              !reduced && "hover:scale-105 active:scale-95"
            )}
          >
            {graded && !isCurrent ? (
              status === "correct" ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <X className="size-4" aria-hidden="true" />
              )
            ) : (
              <span aria-hidden="true">{i + 1}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
