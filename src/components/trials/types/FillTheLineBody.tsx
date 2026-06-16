"use client"

/**
 * fill_the_line — poetry cloze. The stanza renders with blank slots in place of
 * each blank's answer word; the user fills them from a shuffled word bank
 * (mode 'bank') or by typing (mode 'type'). Reports the per-blank answers (in
 * blank order) to the card, which grades them with a normalized match.
 *
 * Blank placement: a blank attaches to a line via `lineIndex`; we locate the
 * answer text within that line and swap it for a slot (falling back to a
 * trailing slot when the answer isn't a literal substring — e.g. a rhyme cue).
 */
import { useEffect, useMemo, useState } from "react"
import type { TrialBodyProps } from "@/lib/trials/registry"

type Node =
  | { kind: "text"; text: string }
  | { kind: "slot"; blankIndex: number }

/** Build the renderable nodes for one line: text runs interleaved with slots. */
function lineNodes(
  lineText: string,
  blanks: { lineIndex: number; answer: string }[],
  lineIndex: number
): Node[] {
  const mine = blanks
    .map((b, i) => ({ ...b, i }))
    .filter((b) => b.lineIndex === lineIndex)
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function FillTheLineBody({
  content,
  onRespond,
  answered,
  response,
  reduced,
}: TrialBodyProps<"fill_the_line">) {
  const blankCount = content.blanks.length
  const [answers, setAnswers] = useState<string[]>(() =>
    Array(blankCount).fill("")
  )

  // Read back any frozen response when the card replays it.
  useEffect(() => {
    if (answered && response) setAnswers(response.answers)
  }, [answered, response])

  // Report the current draft up to the card on every change.
  useEffect(() => {
    onRespond({ answers })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers])

  const bank = useMemo(
    () => shuffle(content.wordBank ?? content.blanks.map((b) => b.answer)),
    [content.wordBank, content.blanks]
  )

  const usedCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const a of answers) {
      if (a) m.set(a.toLowerCase(), (m.get(a.toLowerCase()) ?? 0) + 1)
    }
    return m
  }, [answers])

  const setAnswer = (blankIndex: number, value: string) =>
    setAnswers((prev) => prev.map((a, i) => (i === blankIndex ? value : a)))

  const placeFromBank = (word: string) => {
    const next = answers.findIndex((a) => a === "")
    if (next >= 0) setAnswer(next, word)
  }

  const renderSlot = (blankIndex: number) => {
    const val = answers[blankIndex]
    const correct = content.blanks[blankIndex]?.answer ?? ""
    const ok =
      answered &&
      val.trim().toLowerCase() === correct.trim().toLowerCase()
    const tint = answered
      ? ok
        ? { borderColor: "var(--codex-success)", background: "var(--codex-success-soft)" }
        : { borderColor: "var(--codex-danger)", background: "var(--codex-danger-soft)" }
      : { borderColor: "var(--codex-primary)", background: "var(--codex-primary-soft)" }

    if (content.mode === "type") {
      return (
        <input
          key={blankIndex}
          type="text"
          value={val}
          disabled={answered}
          onChange={(e) => setAnswer(blankIndex, e.target.value)}
          aria-label={`Blank ${blankIndex + 1}`}
          style={{ ...tint, borderRadius: "var(--codex-radius-btn)" }}
          className="inline-block mx-1 px-2 py-0.5 min-w-[5rem] border-2 font-serif text-center focus-visible:outline-none"
        />
      )
    }
    // bank mode — a clickable filled chip / empty slot
    return (
      <button
        key={blankIndex}
        type="button"
        disabled={answered}
        onClick={() => !answered && setAnswer(blankIndex, "")}
        style={{ ...tint, borderRadius: "var(--codex-radius-btn)" }}
        className={`inline-flex items-center mx-1 px-3 py-0.5 min-w-[5rem] min-h-[2rem] border-2 font-serif justify-center align-middle ${
          answered ? "cursor-default" : "cursor-pointer"
        }`}
      >
        {val || <span className="opacity-40">·····</span>}
      </button>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 font-serif text-lg leading-relaxed text-ink">
        {content.lines.map((line, li) => (
          <div key={li} className="flex flex-wrap items-center">
            {lineNodes(line, content.blanks, li).map((n, ni) =>
              n.kind === "text" ? (
                <span key={`text-${ni}`}>{n.text}</span>
              ) : (
                renderSlot(n.blankIndex)
              )
            )}
          </div>
        ))}
      </div>

      {content.mode === "bank" && !answered && (
        <div className="flex flex-wrap gap-2">
          {bank.map((word, i) => {
            const placed =
              (usedCounts.get(word.toLowerCase()) ?? 0) >=
              bank.filter((w) => w.toLowerCase() === word.toLowerCase()).length
            return (
              <button
                key={word + i}
                type="button"
                disabled={placed}
                onClick={() => placeFromBank(word)}
                style={{
                  borderRadius: "var(--codex-radius-btn)",
                  borderColor: "var(--codex-border)",
                  background: placed ? "var(--muted)" : "var(--card)",
                }}
                className={`px-4 py-2 border-2 font-serif min-h-[44px] transition-[background-color] ${
                  placed
                    ? "opacity-40 cursor-default"
                    : "cursor-pointer hover:border-[var(--codex-primary)] hover:bg-[var(--codex-primary-soft)]"
                } ${reduced ? "" : "active:scale-[0.98]"}`}
              >
                {word}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
