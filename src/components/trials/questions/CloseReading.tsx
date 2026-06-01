"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { QuestionRendererProps } from "./shared"
import { OPTION_LABELS, optionState } from "./shared"
import { OptionButton } from "./OptionButton"

/**
 * Close Reading — Master tier. Shows a 2–4 line passage with a specific span
 * highlighted (gold underline draws in when the question appears).
 */
export function CloseReading({
  question,
  answered,
  selectedAnswer,
  onSubmit,
  reduced,
}: QuestionRendererProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const passage = question.passage ?? ""
  const hl = question.passageHighlight

  const rendered = (() => {
    if (!passage) return null
    if (!hl || hl[0] < 0 || hl[1] > passage.length || hl[0] >= hl[1]) {
      return <span>{passage}</span>
    }
    const before = passage.slice(0, hl[0])
    const mid = passage.slice(hl[0], hl[1])
    const after = passage.slice(hl[1])
    return (
      <>
        {before}
        <motion.span
          initial={reduced ? false : { backgroundSize: "0% 2px" }}
          animate={{ backgroundSize: "100% 2px" }}
          transition={{ duration: reduced ? 0.1 : 0.4, ease: "easeOut" }}
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--trial-laureate) 0%, var(--trial-laureate) 100%)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "0 100%",
            paddingBottom: "2px",
          }}
          className="font-semibold"
        >
          {mid}
        </motion.span>
        {after}
      </>
    )
  })()

  return (
    <div className="space-y-5">
      <div
        className="rounded-r-lg border-l-4 pl-4 pr-3 py-3"
        style={{
          borderColor: "var(--trial-laureate)",
          background: "var(--trial-laureate-soft)",
        }}
      >
        <p className="font-serif text-[18px] leading-[1.8] text-ink">{rendered}</p>
      </div>

      <p className="font-sans text-sm text-muted-foreground">{question.prompt}</p>

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
            className="rounded-xl font-semibold"
          >
            Check Answer
          </Button>
        </div>
      )}
    </div>
  )
}
