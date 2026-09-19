"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import type { QuestionRendererProps } from "./shared"

/**
 * Free response — an essay-length answer graded against a rubric (Tome
 * Assistant first pass, teacher review). Reuses the Reflection textarea +
 * word-count treatment and surfaces the rubric hint so the student knows
 * what the grade rewards.
 */
export function FreeResponse({
  question,
  answered,
  selectedAnswer,
  onSubmit,
  reduced: _reduced,
}: QuestionRendererProps) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const wordMin = question.reflectionWordMin ?? 30
  const wordMax = question.reflectionWordMax ?? 800

  useEffect(() => {
    textareaRef.current?.focus()
  }, [question.id])

  const wordCount = useMemo(
    () => value.trim().split(/\s+/).filter(Boolean).length,
    [value]
  )

  const meetsMin = wordCount >= wordMin
  const overMax = wordCount > wordMax

  const counterColor = overMax
    ? "var(--codex-primary)"
    : meetsMin
    ? "var(--codex-tier-laureate-text)"
    : "var(--muted-foreground)"

  function submit() {
    if (answered) return
    if (!meetsMin) return
    onSubmit(value.trim())
  }

  return (
    <div className="space-y-4">
      <div className="min-w-0">
        <p
          className="text-[11px] uppercase tracking-wider font-sans font-semibold"
          style={{ color: "var(--codex-tier-laureate-text)" }}
        >
          Free response · graded to a rubric
        </p>
        {question.reflectionPrompt ? (
          <p className="font-serif text-ink text-base leading-relaxed mt-0.5">
            {question.reflectionPrompt}
          </p>
        ) : null}
        {question.reflectionRubric ? (
          <p
            className="mt-2 border-l-2 pl-3 text-[12px] italic text-muted-foreground"
            style={{ borderColor: "var(--codex-border)" }}
          >
            Graded on: {question.reflectionRubric}
          </p>
        ) : null}
      </div>

      {/* Textarea (Reflection treatment) */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={answered ? selectedAnswer ?? "" : value}
          onChange={(e) => setValue(e.target.value)}
          disabled={answered}
          rows={12}
          placeholder="Make a claim, then support it from the text."
          className="w-full resize-y rounded-xl border-2 border-border bg-card px-4 py-3 font-serif text-[17px] leading-relaxed text-ink placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:[--tw-ring-color:var(--codex-tier-laureate)] disabled:opacity-80"
          aria-label="Free response answer"
          aria-describedby={`${question.id}-counter`}
        />
        <div
          id={`${question.id}-counter`}
          className="pointer-events-none absolute bottom-2 right-3 select-none font-sans text-[11px] tabular-nums"
          style={{ color: counterColor }}
          aria-live="polite"
        >
          {wordCount} / {wordMin} min
          {overMax ? ` · over ${wordMax}` : ""}
        </div>
      </div>

      {!answered && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] text-muted-foreground italic">
            Cite the text — specific evidence earns rubric points.
          </p>
          <Button
            onClick={submit}
            disabled={!meetsMin}
            className="rounded-xl font-semibold"
            style={
              meetsMin
                ? {
                    background: "var(--codex-tier-laureate)",
                    color: "var(--codex-tier-laureate-on)",
                  }
                : undefined
            }
          >
            Submit response
          </Button>
        </div>
      )}
    </div>
  )
}
