"use client"

/**
 * RecitationTrial — progressive cloze memorization.
 *
 * Each round blanks a growing share of the passage (deterministically, from
 * the seed); the learner types the whole passage from memory. The engine
 * fuzzy-grades normalized text; ≥70% of tokens in place counts as a
 * near-miss and invites another round rather than a failure.
 */
import { useMemo, useState } from "react"
import { seededShuffle } from "@/lib/trials/engine"
import { normalizeText } from "@/lib/trials/question-types"
import type { FamilyRendererProps } from "../shared"
import { TrialActionButton, la } from "../shared"

export function RecitationTrial({
  item,
  seed,
  answered,
  lastResponse,
  onSubmit,
}: FamilyRendererProps<"recitation">) {
  const { content } = item
  const [round, setRound] = useState(() => lastResponse?.round ?? 0)
  const [text, setText] = useState(() => lastResponse?.text ?? "")

  const ratio = content.rounds[Math.min(round, content.rounds.length - 1)] ?? 1

  /** Deterministic per-round blank mask — word tokens only, punctuation stays. */
  const visible = useMemo(() => {
    const wordIdx = content.tokens
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => /[\p{L}\p{N}]/u.test(t))
      .map(({ i }) => i)
    const blankCount = Math.round(wordIdx.length * ratio)
    const blanked = new Set(seededShuffle(wordIdx, seed, `recite:${item.id}:${round}`).slice(0, blankCount))
    return content.tokens.map((t, i) => (blanked.has(i) ? null : t))
  }, [content.tokens, ratio, seed, item.id, round])

  const target = useMemo(() => normalizeText(content.tokens.join(" ")), [content.tokens])

  return (
    <div className="space-y-5">
      <p className="font-sans text-sm" style={{ color: la.inkMuted }}>
        Round {round + 1} of {content.rounds.length} — speak the whole passage; the blanks are your
        scaffolding, and they fall away.
      </p>

      <div
        className="border-2 px-4 py-3 font-serif text-lg leading-loose"
        style={{ borderRadius: la.radiusM, borderColor: la.surfaceSunken, background: la.surface, color: la.ink }}
        aria-label="Passage with blanks"
      >
        {visible.map((t, i) =>
          t === null ? (
            <span
              key={i}
              aria-hidden
              className="mx-0.5 inline-block rounded px-2"
              style={{ background: la.surfaceSunken, color: "transparent", userSelect: "none" }}
            >
              {content.tokens[i]}
            </span>
          ) : (
            <span key={i}>{/^\p{P}/u.test(t) ? t : ` ${t}`}</span>
          )
        )}
      </div>

      <div>
        <label htmlFor={`recite-${item.id}`} className="mb-2 block font-sans text-sm" style={{ color: la.inkMuted }}>
          Recite the full passage
        </label>
        <textarea
          id={`recite-${item.id}`}
          value={text}
          disabled={answered}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full border-2 p-4 font-serif text-lg leading-relaxed focus-visible:outline-2 disabled:opacity-80"
          style={{
            borderRadius: la.radiusM,
            borderColor: la.surfaceSunken,
            background: la.surfaceRaised,
            color: la.ink,
            outlineColor: la.focus,
          }}
        />
      </div>

      {answered && normalizeText(text) !== target && (
        <p className="font-serif text-base" style={{ color: la.inkMuted }}>
          The passage reads: {content.tokens.join(" ").replace(/\s+([.,;:!?])/g, "$1")}
        </p>
      )}

      {!answered && (
        <div className="flex items-center gap-3">
          <TrialActionButton onClick={() => onSubmit({ round, text })} disabled={!text.trim()}>
            Recite from memory
          </TrialActionButton>
          {round < content.rounds.length - 1 && (
            <TrialActionButton variant="ghost" onClick={() => setRound(round + 1)}>
              Harder round
            </TrialActionButton>
          )}
        </div>
      )}
    </div>
  )
}
