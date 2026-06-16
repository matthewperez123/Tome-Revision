"use client"

/**
 * recitation — progressive cloze. A passage is pre-tokenized into words; each
 * `rounds[level]` entry is the fraction of words blanked at that level. Rather
 * than run every level inside one card grade, the body shows the level the user
 * has *reached* for this passage (persisted) and asks them to type the whole
 * passage from that partial view. A correct answer advances the persisted level
 * so the next encounter blanks more — 25% → 50% → 75% → 100% from memory.
 *
 * The card grades a fuzzy normalized match of the typed recall against the full
 * passage. Text input now; the response shape ({ round, text }) leaves a clean
 * seam for spoken recall later.
 */
import { useEffect, useMemo, useRef, useState } from "react"
import type { TrialBodyProps } from "@/lib/trials/registry"
import {
  passageIdFromTokens,
  getRecitationLevel,
  setRecitationLevel,
} from "@/lib/trials/recitation-progress"

/** Even-spread blank mask: ~ratio of indices marked true, deterministic. */
function blankMask(n: number, ratio: number): boolean[] {
  const mask: boolean[] = []
  for (let i = 0; i < n; i++) {
    mask.push(Math.floor((i + 1) * ratio) > Math.floor(i * ratio))
  }
  return mask
}

export function RecitationBody({
  content,
  onRespond,
  answered,
  response,
  isCorrect,
}: TrialBodyProps<"recitation">) {
  const passageId = useMemo(
    () => passageIdFromTokens(content.tokens),
    [content.tokens]
  )

  // The level the user has reached (clamped to the available rounds).
  const [level] = useState(() =>
    Math.min(getRecitationLevel(passageId), content.rounds.length - 1)
  )
  const ratio = content.rounds[level] ?? 1
  const mask = useMemo(
    () => blankMask(content.tokens.length, ratio),
    [content.tokens.length, ratio]
  )

  const [text, setText] = useState("")

  useEffect(() => {
    if (answered && response) setText(response.text)
  }, [answered, response])

  useEffect(() => {
    onRespond({ round: level, text })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  // Advance persisted level once, on a correct grade.
  const bumped = useRef(false)
  useEffect(() => {
    if (answered && isCorrect && !bumped.current) {
      bumped.current = true
      setRecitationLevel(passageId, Math.min(level + 1, content.rounds.length - 1))
    }
  }, [answered, isCorrect, level, passageId, content.rounds.length])

  const pct = Math.round(ratio * 100)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold font-sans text-muted-foreground">
        <span>
          Level {level + 1} of {content.rounds.length}
        </span>
        <span aria-hidden="true">·</span>
        <span>{pct}% from memory</span>
      </div>

      {/* The cloze view */}
      <p className="font-serif text-lg leading-relaxed text-ink flex flex-wrap gap-x-1.5 gap-y-1">
        {content.tokens.map((tok, i) =>
          mask[i] ? (
            <span
              key={i}
              aria-hidden="true"
              className="inline-block align-baseline border-b-2"
              style={{
                borderColor: "var(--codex-primary)",
                minWidth: `${Math.max(1.5, tok.length * 0.6)}rem`,
              }}
            >
              &nbsp;
            </span>
          ) : (
            <span key={i}>{tok}</span>
          )
        )}
      </p>

      {/* Recall input */}
      <textarea
        value={text}
        disabled={answered}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        aria-label="Type the passage from memory"
        placeholder="Type the full passage…"
        style={{
          borderColor: answered
            ? isCorrect
              ? "var(--codex-success)"
              : "var(--codex-danger)"
            : "var(--codex-border)",
          background: "var(--card)",
          borderRadius: "var(--codex-radius-card)",
        }}
        className="w-full border-2 p-4 font-serif text-base leading-relaxed resize-none focus-visible:outline-none focus-visible:border-[var(--codex-primary)]"
      />

      {answered && !isCorrect && (
        <p className="font-serif text-sm text-ink">
          <span className="text-muted-foreground font-sans text-xs uppercase tracking-wider">
            Passage:{" "}
          </span>
          {content.tokens.join(" ")}
        </p>
      )}
    </div>
  )
}
