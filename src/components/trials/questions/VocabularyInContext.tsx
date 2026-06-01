"use client"

import { useEffect, useState } from "react"
import { Volume2 } from "lucide-react"
import type { QuestionRendererProps } from "./shared"
import { OPTION_LABELS, optionState } from "./shared"
import { OptionButton } from "./OptionButton"

function speak(word: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return
  const utter = new SpeechSynthesisUtterance(word)
  utter.rate = 0.85
  window.speechSynthesis.speak(utter)
}

/**
 * Vocabulary in Context — highlighted word in a sentence, pick the right gloss.
 */
export function VocabularyInContext({
  question,
  answered,
  isCorrect,
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

  // Highlight the vocab word inside the prompt.
  const word = question.vocabWord ?? ""
  const sentence = question.passage ?? question.prompt

  const rendered = (() => {
    if (!word) return <>{sentence}</>
    const parts = sentence.split(new RegExp(`(${word})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === word.toLowerCase() ? (
        <button
          type="button"
          key={i}
          onClick={() => speak(word)}
          className="font-serif font-semibold underline decoration-2 underline-offset-4 transition-colors"
          style={{ color: "var(--trial-laureate-text)" }}
          aria-label={`Pronounce ${word}`}
        >
          {part}
          <Volume2
            className="inline w-3.5 h-3.5 ml-0.5 opacity-60"
            aria-hidden
          />
        </button>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  })()

  return (
    <div className="space-y-5">
      <p className="font-serif text-[18px] leading-[1.7] text-ink">{rendered}</p>

      {question.passage && <p className="font-sans text-sm text-muted-foreground">{question.prompt}</p>}

      <div className="space-y-2.5">
        {question.options.map((opt, i) => {
          const state = answered
            ? optionState(opt, question.correct_answer, selectedAnswer, answered)
            : pending === opt
              ? "selected"
              : "idle"
          return (
            <OptionButton
              key={opt + i}
              label={OPTION_LABELS[i] ?? String(i + 1)}
              text={opt}
              state={state}
              disabled={answered || pending !== null}
              onClick={() => setPending(opt)}
              reduced={reduced}
            />
          )
        })}
      </div>

      {answered && isCorrect && question.etymology && (
        <div className="rounded-lg border border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-900/40 px-3 py-2 text-xs font-serif italic text-muted-foreground">
          <span className="font-semibold not-italic text-ink mr-1">Etymology:</span>
          {question.etymology}
        </div>
      )}
    </div>
  )
}
