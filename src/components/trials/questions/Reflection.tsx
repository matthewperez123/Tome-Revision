"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { QuestionRendererProps } from "./shared"

/**
 * Reflection — open-response, Virgil-graded.
 *
 * The engine accepts the response if it meets `reflectionWordMin`; the
 * numeric grade (0–10) is produced asynchronously by the placeholder
 * server action `gradeReflection` and stored on the attempt's
 * `reflectionGrades` map keyed by question id.
 */
export function Reflection({
  question,
  answered,
  selectedAnswer,
  onSubmit,
  reduced: _reduced,
}: QuestionRendererProps) {
  const reduced = useReducedMotion() ?? false
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const wordMin = question.reflectionWordMin ?? 30
  const wordMax = question.reflectionWordMax ?? 300

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
    ? "#6366F1"
    : meetsMin
    ? "#D4AF37"
    : "rgba(168,162,158,0.9)"

  function submit() {
    if (answered) return
    if (!meetsMin) return
    onSubmit(value.trim())
  }

  return (
    <div className="space-y-4">
      {/* Virgil framing */}
      <div className="flex items-start gap-3">
        <motion.div
          aria-hidden
          animate={
            reduced
              ? undefined
              : { scale: [1, 1.04, 1] }
          }
          transition={
            reduced
              ? undefined
              : { repeat: Infinity, duration: 1.5, ease: [0.16, 1, 0.3, 1] }
          }
          className="shrink-0 grid place-items-center size-9 rounded-full"
          style={{
            background: "rgba(212,175,55,0.10)",
            border: "1px solid rgba(212,175,55,0.40)",
          }}
        >
          <span
            className="font-serif text-lg leading-none"
            style={{ color: "#D4AF37" }}
          >
            ✦
          </span>
        </motion.div>
        <div className="min-w-0">
          <p
            className="text-[11px] uppercase tracking-wider font-sans font-semibold"
            style={{ color: "#D4AF37" }}
          >
            Reflection · Virgil grades
          </p>
          {question.reflectionPrompt ? (
            <p className="font-serif text-ink text-base leading-relaxed mt-0.5">
              {question.reflectionPrompt}
            </p>
          ) : null}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={answered ? selectedAnswer ?? "" : value}
          onChange={(e) => setValue(e.target.value)}
          disabled={answered}
          rows={12}
          placeholder="Write thoughtfully — your own reading, in your own words."
          className="w-full resize-y rounded-xl border-2 border-border bg-card px-4 py-3 font-serif text-[17px] leading-relaxed text-ink placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:[--tw-ring-color:#D4AF37] disabled:opacity-80"
          aria-label="Reflection response"
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

      {/* Submit */}
      {!answered && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] text-muted-foreground italic">
            Virgil reads for engagement, reasoning, evidence, and originality.
          </p>
          <Button
            onClick={submit}
            disabled={!meetsMin}
            className="rounded-xl font-semibold"
            style={
              meetsMin
                ? { background: "#D4AF37", color: "#111" }
                : undefined
            }
          >
            Submit reflection
          </Button>
        </div>
      )}
    </div>
  )
}
