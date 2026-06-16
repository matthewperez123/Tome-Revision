"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { QuestionRendererProps } from "./shared"
import { norm } from "./shared"

/**
 * Fill-in-the-blank. The prompt contains a literal "____" token where the
 * input inlines; if no token exists the input renders below.
 */
export function FillBlank({
  question,
  answered,
  selectedAnswer,
  onSubmit,
  reduced: _reduced,
}: QuestionRendererProps) {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [question.id])

  const isCorrect = answered && norm(selectedAnswer ?? "") === norm(question.correct_answer)
  const showAnswerText = answered ? (selectedAnswer ?? "") : value

  function submit() {
    if (answered) return
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  const pieces = question.prompt.split(/_{2,}/)
  const hasBlank = pieces.length > 1

  return (
    <div className="space-y-4">
      {hasBlank ? (
        <p className="text-ink text-lg leading-relaxed font-serif">
          {pieces.map((piece, i) => (
            <span key={i}>
              {piece}
              {i < pieces.length - 1 && (
                <span className="inline-block align-baseline mx-1">
                  {answered ? (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded border-b-2 font-semibold"
                      style={
                        isCorrect
                          ? { borderColor: "var(--codex-success)", color: "var(--codex-success-text)" }
                          : { borderColor: "var(--codex-danger)", color: "var(--codex-danger-text)" }
                      }
                    >
                      {showAnswerText}
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </span>
                  ) : (
                    <input
                      ref={inputRef}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          submit()
                        }
                      }}
                      className="min-w-[96px] w-auto inline-block border-b-2 bg-transparent font-serif text-lg focus:outline-none px-2 py-0.5 focus:[border-color:var(--codex-primary)]"
                      style={{ borderColor: "var(--codex-border)" }}
                      placeholder="…"
                      aria-label="Fill in the blank"
                    />
                  )}
                </span>
              )}
            </span>
          ))}
        </p>
      ) : (
        <>
          <p className="text-ink text-lg leading-relaxed font-serif">{question.prompt}</p>
          <input
            ref={inputRef}
            value={answered ? (selectedAnswer ?? "") : value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                submit()
              }
            }}
            disabled={answered}
            className={`w-full border-2 px-4 py-3 font-serif text-lg focus:outline-none ${
              answered ? "" : "focus:[border-color:var(--codex-primary)]"
            }`}
            style={{
              borderRadius: "var(--codex-radius-btn)",
              ...(answered
                ? isCorrect
                  ? { borderColor: "var(--codex-success)", background: "var(--codex-success-soft)", color: "var(--codex-success-text)" }
                  : { borderColor: "var(--codex-danger)", background: "var(--codex-danger-soft)", color: "var(--codex-danger-text)" }
                : { borderColor: "var(--codex-border)" }),
            }}
            aria-label="Your answer"
          />
        </>
      )}

      {answered && !isCorrect && (
        <p className="text-sm text-muted-foreground italic">
          Correct answer:{" "}
          <span className="font-semibold text-ink not-italic">
            {question.correct_answer}
          </span>
        </p>
      )}

      {!answered && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
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
