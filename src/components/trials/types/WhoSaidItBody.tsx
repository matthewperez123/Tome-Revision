"use client"

/**
 * who_said_it — attribute a quote to a speaker. Thin adapter over the shared
 * <MultipleChoiceBody> (the speaker name surfaced as each choice's text).
 */
import type { TrialBodyProps } from "@/lib/trials/registry"
import { MultipleChoiceBody } from "./MultipleChoiceBody"

export function WhoSaidItBody({
  content,
  onRespond,
  answered,
  response,
  reduced,
}: TrialBodyProps<"who_said_it">) {
  const choices = content.choices.map((c) => c.name)
  const correctIndex = content.choices.findIndex((c) => c.correct)
  const selectedIndex = response?.choiceIndex ?? null

  return (
    <div className="space-y-5">
      <blockquote
        className="border-l-4 pl-4 py-1 font-serif text-lg italic leading-relaxed text-ink"
        style={{ borderColor: "var(--codex-primary)" }}
      >
        “{content.quote}”
      </blockquote>

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
