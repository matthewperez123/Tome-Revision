"use client"

/**
 * ChoiceTrial — the high-polish renderer for every option-based family:
 *   multiple-choice · word-in-context · who-said-it · close-reading ·
 *   passage-identification · vocabulary-in-context · cross-reference
 *
 * Shared behavior: options display in a deterministic seeded order; selecting
 * one commits immediately (auto-submit convention from the legacy runner);
 * each row can be ruled out (distractor elimination) before committing;
 * number keys 1–9 select the nth visible option. Family differences are
 * confined to the header (sentence / quote / passage).
 *
 * The props contract is deliberately decoupled from TrialItem: legacy
 * families (word-in-context, who-said-it) adapt their choice arrays into
 * TrialOption[] at the call site and translate optionIds back on submit.
 */
import { useMemo } from "react"
import { optionOrder, type QuestionFeedback } from "@/lib/trials/engine"
import type { TrialOption } from "@/lib/trials/types"
import {
  HighlightPhrase,
  OPTION_LETTERS,
  OptionRow,
  PassageCard,
  la,
  type OptionVisualState,
} from "../shared"

export type ChoiceFamily =
  | "multiple-choice"
  | "word-in-context"
  | "who-said-it"
  | "close-reading"
  | "passage-identification"
  | "vocabulary-in-context"
  | "cross-reference"

export interface ChoiceContent {
  options: TrialOption[]
  sentence?: string
  targetWord?: string
  quote?: string
  passage?: string
  focusPhrase?: string
  subject?: "book" | "speaker" | "character"
  passageA?: { text: string; citation: string }
  passageB?: { text: string; citation: string }
}

export interface ChoiceTrialProps {
  family: ChoiceFamily
  itemId: string
  content: ChoiceContent
  seed: string | number
  answered: boolean
  feedback: QuestionFeedback | null
  lastResponse: { optionId: string } | null
  eliminated: string[]
  onToggleEliminate?: (optionId: string) => void
  onSubmit: (response: { optionId: string }) => void
  reduced: boolean
}

function Header({ family, content }: { family: ChoiceFamily; content: ChoiceContent }) {
  switch (family) {
    case "word-in-context":
    case "vocabulary-in-context":
      return (
        <p className="font-serif text-lg leading-relaxed" style={{ color: la.ink }}>
          <HighlightPhrase text={content.sentence ?? ""} phrase={content.targetWord ?? ""} />
        </p>
      )
    case "who-said-it":
      return (
        <PassageCard>
          <span aria-label={`Quote: ${content.quote ?? ""}`}>“{content.quote}”</span>
        </PassageCard>
      )
    case "close-reading":
      return <PassageCard highlight={content.focusPhrase}>{content.passage}</PassageCard>
    case "passage-identification":
      return <PassageCard>{content.passage}</PassageCard>
    case "cross-reference":
      return (
        <div className="space-y-3">
          <PassageCard citation={content.passageA?.citation}>{content.passageA?.text}</PassageCard>
          <PassageCard citation={content.passageB?.citation}>{content.passageB?.text}</PassageCard>
        </div>
      )
    default:
      return null
  }
}

function stateFor(
  opt: TrialOption,
  answered: boolean,
  feedback: QuestionFeedback | null,
  selectedId: string | null,
  eliminated: readonly string[]
): OptionVisualState {
  if (!answered) {
    if (eliminated.includes(opt.id)) return "eliminated"
    return "idle"
  }
  if (opt.correct) return "correct"
  if (selectedId === opt.id) {
    return feedback?.kind === "near-miss" ? "near-miss" : "wrong"
  }
  return "dimmed"
}

export function ChoiceTrial({
  family,
  itemId,
  content,
  seed,
  answered,
  feedback,
  lastResponse,
  eliminated,
  onToggleEliminate,
  onSubmit,
}: ChoiceTrialProps) {
  const selectedId = lastResponse?.optionId ?? null

  // Deterministic display order — replays identically for a given seed.
  const ordered = useMemo(() => {
    const ids = optionOrder(content.options.map((o) => o.id), seed, itemId)
    return ids.map((id) => content.options.find((o) => o.id === id)!)
  }, [content.options, seed, itemId])

  const instruction =
    family === "passage-identification"
      ? `Name the ${content.subject ?? "book"}.`
      : family === "who-said-it"
        ? "Choose the speaker."
        : "Choose the best answer."

  return (
    <div className="space-y-5">
      <Header family={family} content={content} />
      <p className="font-sans text-sm" style={{ color: la.inkMuted }}>
        {instruction}{" "}
        <span style={{ color: la.inkFaint }}>
          Keys 1–{ordered.length} select · ✕ on a row rules it out.
        </span>
      </p>
      <div
        className="space-y-2"
        role="listbox"
        aria-label="Answer options"
        onKeyDown={(e) => {
          if (answered) return
          const n = Number(e.key)
          if (Number.isInteger(n) && n >= 1 && n <= ordered.length) {
            e.preventDefault()
            onSubmit({ optionId: ordered[n - 1].id })
          }
        }}
      >
        {ordered.map((opt, i) => (
          <OptionRow
            key={opt.id}
            letter={OPTION_LETTERS[i] ?? String(i + 1)}
            text={opt.text}
            note={opt.distractorNote}
            state={stateFor(opt, answered, feedback, selectedId, eliminated)}
            disabled={answered}
            onSelect={() => !answered && onSubmit({ optionId: opt.id })}
            onEliminate={onToggleEliminate ? () => onToggleEliminate(opt.id) : undefined}
          />
        ))}
      </div>
    </div>
  )
}
