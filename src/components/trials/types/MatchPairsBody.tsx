"use client"

/**
 * match_pairs — two columns; tap a left item then a right item to pair them.
 * A formed pair locks (the right answer leaves the available pool). Once every
 * left is paired, the body reports the full left→right map; the card grades it.
 * After grading, each left row is tinted by whether its match was correct.
 */
import { useEffect, useMemo, useState } from "react"
import type { TrialBodyProps } from "@/lib/trials/registry"

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function MatchPairsBody({
  content,
  onRespond,
  answered,
  response,
  reduced,
}: TrialBodyProps<"match_pairs">) {
  const lefts = useMemo(() => content.pairs.map((p) => p.left), [content.pairs])
  const rights = useMemo(
    () => shuffle(content.pairs.map((p) => p.right)),
    [content.pairs]
  )
  const correct = useMemo(() => {
    const m = new Map<string, string>()
    for (const p of content.pairs) m.set(p.left, p.right)
    return m
  }, [content.pairs])

  const [matches, setMatches] = useState<Record<string, string>>({})
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)

  useEffect(() => {
    if (answered && response) setMatches(response.pairs)
  }, [answered, response])

  useEffect(() => {
    if (Object.keys(matches).length === lefts.length) {
      onRespond({ pairs: matches })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches])

  const rightToLeft = useMemo(() => {
    const m = new Map<string, string>()
    for (const [l, r] of Object.entries(matches)) m.set(r, l)
    return m
  }, [matches])

  const tapLeft = (left: string) => {
    if (answered) return
    // Tapping a matched left unbinds it; otherwise select it.
    if (matches[left]) {
      setMatches((prev) => {
        const next = { ...prev }
        delete next[left]
        return next
      })
      setSelectedLeft(null)
      return
    }
    setSelectedLeft((cur) => (cur === left ? null : left))
  }

  const tapRight = (right: string) => {
    if (answered || rightToLeft.has(right) || !selectedLeft) return
    setMatches((prev) => ({ ...prev, [selectedLeft]: right }))
    setSelectedLeft(null)
  }

  const leftStyle = (left: string) => {
    const matched = Boolean(matches[left])
    if (answered) {
      const ok = matches[left] === correct.get(left)
      return ok
        ? { borderColor: "var(--codex-success)", background: "var(--codex-success-soft)" }
        : { borderColor: "var(--codex-danger)", background: "var(--codex-danger-soft)" }
    }
    if (selectedLeft === left)
      return { borderColor: "var(--codex-primary)", background: "var(--codex-primary-soft)" }
    if (matched)
      return { borderColor: "var(--codex-primary)", background: "var(--card)" }
    return { borderColor: "var(--border)", background: "var(--card)" }
  }

  const rightStyle = (right: string) => {
    const bound = rightToLeft.has(right)
    if (bound)
      return { borderColor: "var(--codex-primary)", background: "var(--card)", opacity: 0.55 }
    return { borderColor: "var(--border)", background: "var(--card)", opacity: 1 }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        {lefts.map((left) => (
          <button
            key={left}
            type="button"
            disabled={answered}
            onClick={() => tapLeft(left)}
            style={{ ...leftStyle(left), borderRadius: "var(--codex-radius-btn)" }}
            className={`w-full text-left border-2 px-4 py-3 min-h-[48px] font-serif leading-snug transition-[background-color,border-color] ${
              answered ? "cursor-default" : "cursor-pointer"
            } ${reduced ? "" : "active:scale-[0.99]"}`}
          >
            <span className="flex items-center justify-between gap-2">
              {left}
              {matches[left] && (
                <span className="text-xs text-muted-foreground font-sans shrink-0">
                  → {matches[left]}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {rights.map((right) => (
          <button
            key={right}
            type="button"
            disabled={answered || rightToLeft.has(right) || !selectedLeft}
            onClick={() => tapRight(right)}
            style={{ ...rightStyle(right), borderRadius: "var(--codex-radius-btn)" }}
            className={`w-full text-left border-2 px-4 py-3 min-h-[48px] font-serif leading-snug transition-[background-color,border-color,opacity] ${
              answered || rightToLeft.has(right) || !selectedLeft
                ? "cursor-default"
                : "cursor-pointer hover:border-[var(--codex-primary)] hover:bg-[var(--codex-primary-soft)]"
            } ${reduced ? "" : "active:scale-[0.99]"}`}
          >
            {right}
          </button>
        ))}
      </div>
    </div>
  )
}
