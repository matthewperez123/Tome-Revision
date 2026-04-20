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
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border-b-2 font-semibold ${
                        isCorrect
                          ? "border-emerald-500 text-emerald-700 dark:text-emerald-300"
                          : "border-rose-500 text-rose-700 dark:text-rose-300"
                      }`}
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
                      className="min-w-[96px] w-auto inline-block border-b-2 border-stone-400 bg-transparent font-serif text-lg focus:outline-none focus:border-indigo-500 px-2 py-0.5"
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
            className={`w-full rounded-lg border-2 px-4 py-3 font-serif text-lg focus:outline-none ${
              answered
                ? isCorrect
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-rose-500 bg-rose-50 text-rose-800"
                : "border-stone-300 focus:border-indigo-500"
            }`}
            aria-label="Your answer"
          />
        </>
      )}

      {answered && !isCorrect && (
        <p className="text-sm text-stone-500 italic">
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
            className="rounded-xl font-semibold"
          >
            Check Answer
          </Button>
        </div>
      )}
    </div>
  )
}
