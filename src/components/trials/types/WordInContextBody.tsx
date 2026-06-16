"use client"

/**
 * word_in_context — pick the gloss/meaning of a target word shown in a sentence.
 * Thin adapter over the shared <MultipleChoiceBody>; seeded from Virgil glosses
 * where available (the join lives in the seed, not here).
 */
import { useMemo } from "react"
import type { TrialBodyProps } from "@/lib/trials/registry"
import { MultipleChoiceBody } from "./MultipleChoiceBody"

/** Split a sentence so the target word can be highlighted (case-insensitive). */
function splitOnWord(sentence: string, word: string) {
  const idx = sentence.toLowerCase().indexOf(word.toLowerCase())
  if (idx < 0) return [{ text: sentence, hit: false }]
  return [
    { text: sentence.slice(0, idx), hit: false },
    { text: sentence.slice(idx, idx + word.length), hit: true },
    { text: sentence.slice(idx + word.length), hit: false },
  ].filter((p) => p.text.length > 0)
}

export function WordInContextBody({
  content,
  onRespond,
  answered,
  response,
  reduced,
}: TrialBodyProps<"word_in_context">) {
  const choices = content.choices.map((c) => c.text)
  const correctIndex = content.choices.findIndex((c) => c.correct)
  const selectedIndex = response?.choiceIndex ?? null
  const parts = useMemo(
    () => splitOnWord(content.sentence, content.targetWord),
    [content.sentence, content.targetWord]
  )

  return (
    <div className="space-y-5">
      <p className="font-serif text-lg leading-relaxed text-ink">
        {parts.map((p, i) =>
          p.hit ? (
            <mark
              key={i}
              className="rounded px-1 font-semibold"
              style={{
                background: "var(--codex-primary-soft)",
                color: "var(--codex-primary-text)",
              }}
            >
              {p.text}
            </mark>
          ) : (
            <span key={i}>{p.text}</span>
          )
        )}
      </p>

      <MultipleChoiceBody
        choices={choices}
        selectedIndex={selectedIndex}
        answered={answered}
        correctIndex={correctIndex}
        onSelect={(i) => onRespond({ choiceIndex: i })}
        reduced={reduced}
      />
    </div>
  )
}
