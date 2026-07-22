"use client"

/**
 * FillTheLineTrial — poetry cloze on the Living Archive shell.
 *
 * Bank mode: tap word chips to fill the next open blank (or focus a blank and
 * type its bank index); click a filled blank to clear it. Type mode: inline
 * inputs. The word bank is shuffled deterministically from the session seed.
 * An explicit Check button commits all blanks at once.
 */
import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { normalizeText } from "@/lib/trials/question-types"
import { seededShuffle } from "@/lib/trials/engine"
import type { FamilyRendererProps } from "../shared"
import { Kbd, TrialActionButton, la } from "../shared"

type Node = { kind: "text"; text: string } | { kind: "slot"; blankIndex: number }

function lineNodes(
  lineText: string,
  blanks: { lineIndex: number; answer: string }[],
  lineIndex: number
): Node[] {
  const mine = blanks.map((b, i) => ({ ...b, i })).filter((b) => b.lineIndex === lineIndex)
  if (mine.length === 0) return [{ kind: "text", text: lineText }]
  const nodes: Node[] = []
  let rest = lineText
  for (const b of mine) {
    const at = rest.toLowerCase().indexOf(b.answer.toLowerCase())
    if (at >= 0) {
      if (at > 0) nodes.push({ kind: "text", text: rest.slice(0, at) })
      nodes.push({ kind: "slot", blankIndex: b.i })
      rest = rest.slice(at + b.answer.length)
    } else {
      nodes.push({ kind: "slot", blankIndex: b.i })
    }
  }
  if (rest.length > 0) nodes.push({ kind: "text", text: rest })
  return nodes
}

export function FillTheLineTrial({
  item,
  seed,
  answered,
  lastResponse,
  onSubmit,
  reduced,
}: FamilyRendererProps<"fill-the-line">) {
  const { content } = item
  const blankCount = content.blanks.length
  // Draft state initializes from any frozen response; the player remounts
  // this renderer (key = item + draft nonce) on retry/advance, so no effect
  // is needed to reset.
  const [answers, setAnswers] = useState<string[]>(() =>
    lastResponse ? lastResponse.answers : Array(blankCount).fill("")
  )

  const bank = useMemo(
    () => seededShuffle(content.wordBank ?? content.blanks.map((b) => b.answer), seed, `bank:${item.id}`),
    [content.wordBank, content.blanks, seed, item.id]
  )

  const usedCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const a of answers) if (a) m.set(a.toLowerCase(), (m.get(a.toLowerCase()) ?? 0) + 1)
    return m
  }, [answers])

  const setAnswer = (i: number, v: string) =>
    setAnswers((prev) => prev.map((a, j) => (j === i ? v : a)))

  const placeFromBank = (word: string) => {
    const next = answers.findIndex((a) => a === "")
    if (next >= 0) setAnswer(next, word)
  }

  const allFilled = answers.every((a) => a.trim().length > 0)

  const slotStyle = (blankIndex: number) => {
    const val = answers[blankIndex] ?? ""
    const correct = content.blanks[blankIndex]?.answer ?? ""
    if (answered) {
      const ok = normalizeText(val) === normalizeText(correct)
      return {
        borderColor: ok ? la.success : la.error,
        background: ok ? la.successSoft : la.errorSoft,
        color: la.ink,
      }
    }
    return { borderColor: la.primary, background: la.primarySoft, color: la.ink }
  }

  return (
    <div className="space-y-6">
      <p className="font-sans text-sm" style={{ color: la.inkMuted }}>
        {content.mode === "bank"
          ? "Tap a word to place it in the next open blank; tap a filled blank to clear it."
          : "Type the missing word in each blank."}{" "}
        Then press <Kbd>Enter</Kbd> to check.
      </p>

      <div className="space-y-2 font-serif text-lg leading-loose" style={{ color: la.ink }}>
        {content.lines.map((line, li) => (
          <div key={li} className="flex flex-wrap items-center">
            {lineNodes(line, content.blanks, li).map((n, ni) =>
              n.kind === "text" ? (
                <span key={`t-${li}-${ni}`}>{n.text}</span>
              ) : content.mode === "type" ? (
                <input
                  key={`s-${li}-${ni}`}
                  type="text"
                  value={answers[n.blankIndex] ?? ""}
                  disabled={answered}
                  onChange={(e) => setAnswer(n.blankIndex, e.target.value)}
                  aria-label={`Blank ${n.blankIndex + 1} of ${blankCount}`}
                  className="mx-1 inline-block min-w-[5rem] border-2 px-2 py-0.5 text-center focus-visible:outline-2"
                  style={{
                    ...slotStyle(n.blankIndex),
                    borderRadius: la.radiusS,
                    outlineColor: la.focus,
                    background: answered ? slotStyle(n.blankIndex).background : la.surfaceRaised,
                  }}
                />
              ) : (
                <button
                  key={`s-${li}-${ni}`}
                  type="button"
                  disabled={answered}
                  onClick={() => setAnswer(n.blankIndex, "")}
                  aria-label={
                    answers[n.blankIndex]
                      ? `Blank ${n.blankIndex + 1}: ${answers[n.blankIndex]} — activate to clear`
                      : `Blank ${n.blankIndex + 1}: empty`
                  }
                  className="mx-1 inline-flex min-h-[2rem] min-w-[5rem] items-center justify-center border-2 px-3 py-0.5 align-middle focus-visible:outline-2"
                  style={{ ...slotStyle(n.blankIndex), borderRadius: la.radiusS, outlineColor: la.focus }}
                >
                  {answers[n.blankIndex] || <span style={{ opacity: 0.4 }}>·····</span>}
                </button>
              )
            )}
          </div>
        ))}
      </div>

      {content.mode === "bank" && !answered && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Word bank">
          {bank.map((word, i) => {
            const total = bank.filter((w) => w.toLowerCase() === word.toLowerCase()).length
            const placed = (usedCounts.get(word.toLowerCase()) ?? 0) >= total
            return (
              <motion.button
                key={`${word}-${i}`}
                type="button"
                disabled={placed}
                onClick={() => placeFromBank(word)}
                whileTap={placed ? undefined : { scale: 0.96 }}
                className="min-h-[44px] border-2 px-4 py-2 font-serif transition-colors focus-visible:outline-2 disabled:opacity-40"
                style={{
                  borderRadius: la.radiusM,
                  borderColor: placed ? la.surfaceSunken : la.primary,
                  background: placed ? la.surfaceSunken : la.surfaceRaised,
                  color: la.ink,
                  outlineColor: la.focus,
                  ...(reduced ? { transition: "none" } : {}),
                }}
              >
                {word}
              </motion.button>
            )
          })}
        </div>
      )}

      {answered && (
        <p className="font-serif text-base" style={{ color: la.inkMuted }}>
          Correct reading:{" "}
          {content.blanks.map((b) => b.answer).join(" · ")}
        </p>
      )}

      {!answered && (
        <TrialActionButton onClick={() => onSubmit({ answers })} disabled={!allFilled}>
          Check the line
        </TrialActionButton>
      )}
    </div>
  )
}
