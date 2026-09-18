"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { QuestionRendererProps } from "./shared"
import { OPTION_LABELS, norm } from "./shared"
import { OptionButton } from "./OptionButton"

/**
 * Multiple select — "choose all that apply". Explicit submit; the committed
 * wire format is the comma-joined selected option texts (the same format
 * `gradeAnswer` splits back into a set).
 */
export function MultipleSelect({
  question,
  answered,
  selectedAnswer,
  onSubmit,
  reduced,
}: QuestionRendererProps) {
  const [picked, setPicked] = useState<string[]>([])

  // After answering, reconstruct the selection from the committed wire string.
  const committed = answered
    ? (selectedAnswer ?? "").split(",").map((s) => s.trim()).filter(Boolean)
    : picked
  const committedNormed = committed.map(norm)

  // The key may be withheld (teacher quizzes grade server-side); only show
  // correct/wrong per-option feedback when we actually have it.
  const key = question.correct_answer ?? ""
  const keyNormed = key
    .split(",")
    .map((s) => norm(s))
    .filter(Boolean)
  const hasKey = keyNormed.length > 0

  function toggle(opt: string) {
    if (answered) return
    setPicked((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt],
    )
  }

  function stateFor(opt: string): "idle" | "selected" | "correct" | "wrong" | "disabled" {
    const isPicked = committedNormed.includes(norm(opt))
    if (!answered) return isPicked ? "selected" : "idle"
    if (!hasKey) return isPicked ? "selected" : "disabled"
    const isKey = keyNormed.includes(norm(opt))
    if (isKey) return "correct"
    if (isPicked) return "wrong"
    return "disabled"
  }

  function submit() {
    if (answered || picked.length === 0) return
    // Preserve the on-screen option order in the committed answer.
    const ordered = question.options.filter((o) => picked.includes(o))
    onSubmit(ordered.join(", "))
  }

  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        Select all that apply
      </p>

      <div className="space-y-2">
        {question.options.map((opt, i) => (
          <OptionButton
            key={opt}
            label={OPTION_LABELS[i] ?? String(i + 1)}
            text={opt}
            state={stateFor(opt)}
            disabled={answered}
            onClick={() => toggle(opt)}
            reduced={reduced}
          />
        ))}
      </div>

      {!answered && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={submit}
            disabled={picked.length === 0}
            className="codex-pressable min-h-[48px] px-8 font-bold rounded-[var(--codex-radius-btn)]"
            style={{ background: "var(--codex-primary)", color: "var(--codex-on-primary)", border: "var(--codex-border-w) solid var(--codex-primary)" }}
          >
            Check Answer
          </Button>
        </div>
      )}
    </div>
  )
}
