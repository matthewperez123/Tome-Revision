"use client"

import { useState } from "react"
import { ArrowRightLeft, CheckCircle2, XCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { QuestionRendererProps } from "./shared"
import { norm } from "./shared"

/**
 * Matching — tap-to-pair interaction, works on mobile without dnd.
 * Left items are fixed; user taps a left item to select it, then taps the
 * matching right item to form a pair. Either item can be tapped again to
 * break the pair.
 */
export function Matching({
  question,
  answered,
  onSubmit,
  reduced: _reduced,
}: QuestionRendererProps) {
  const left = question.matchingLeft ?? []
  const right = question.matchingRight ?? []
  const correctPairs = question.correctPairs ?? {}

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [pairs, setPairs] = useState<Record<string, string>>({})

  function pairedRightFor(leftItem: string) {
    return pairs[leftItem]
  }
  function isRightTaken(rightItem: string) {
    return Object.values(pairs).includes(rightItem)
  }

  function handleLeftClick(item: string) {
    if (answered) return
    if (pairs[item]) {
      // Break existing pair
      setPairs((p) => {
        const next = { ...p }
        delete next[item]
        return next
      })
      setSelectedLeft(null)
      return
    }
    setSelectedLeft(item === selectedLeft ? null : item)
  }

  function handleRightClick(rightItem: string) {
    if (answered) return
    if (isRightTaken(rightItem)) {
      // Break pair that contains this right item
      setPairs((p) => {
        const next: Record<string, string> = {}
        for (const [l, r] of Object.entries(p)) {
          if (r !== rightItem) next[l] = r
        }
        return next
      })
      return
    }
    if (!selectedLeft) return
    setPairs((p) => ({ ...p, [selectedLeft]: rightItem }))
    setSelectedLeft(null)
  }

  function submit() {
    onSubmit(JSON.stringify(pairs))
  }

  const allPaired = left.every((l) => pairs[l])

  function stateFor(leftItem: string): "idle" | "correct" | "wrong" | "selected" {
    if (!answered) return selectedLeft === leftItem ? "selected" : "idle"
    const rightAnswer = pairs[leftItem]
    if (!rightAnswer) return "wrong"
    return norm(rightAnswer) === norm(correctPairs[leftItem] ?? "") ? "correct" : "wrong"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <ArrowRightLeft className="w-3.5 h-3.5" />
        Tap a left item, then its match
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-start">
        {/* Left column */}
        <div className="space-y-2">
          {left.map((item) => {
            const s = stateFor(item)
            const pair = pairedRightFor(item)
            const style: React.CSSProperties =
              s === "correct"
                ? { borderColor: "var(--codex-success)", background: "var(--codex-success-soft)", color: "var(--codex-success-text)" }
                : s === "wrong"
                  ? { borderColor: "var(--codex-danger)", background: "var(--codex-danger-soft)", color: "var(--codex-danger-text)" }
                  : s === "selected"
                    ? { borderColor: "var(--codex-primary)", background: "var(--codex-primary-soft)", color: "var(--codex-primary-text)" }
                    : { borderColor: "var(--codex-border)", background: "var(--card)" }
            return (
              <button
                key={item}
                type="button"
                onClick={() => handleLeftClick(item)}
                disabled={answered}
                className={`w-full border-2 px-4 py-3.5 min-h-[44px] font-serif text-ink text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:[--tw-ring-color:var(--codex-primary)] flex items-center justify-between gap-2 ${s === "idle" ? "hover:[border-color:var(--codex-primary)] hover:[background:var(--codex-primary-soft)]" : ""}`}
                style={{ borderRadius: "var(--codex-radius-btn)", ...style }}
              >
                <span className="flex-1 min-w-0">{item}</span>
                {pair && !answered && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    → {pair} <X className="w-3 h-3" aria-hidden />
                  </span>
                )}
                {answered && (
                  <span aria-hidden>
                    {s === "correct" ? (
                      <CheckCircle2 className="w-4 h-4" style={{ color: "var(--codex-success)" }} />
                    ) : (
                      <XCircle className="w-4 h-4" style={{ color: "var(--codex-danger)" }} />
                    )}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Spacer column */}
        <div className="hidden sm:block h-full w-px" style={{ background: "var(--codex-border)" }} aria-hidden />

        {/* Right column */}
        <div className="space-y-2">
          {right.map((item) => {
            const taken = isRightTaken(item)
            const style: React.CSSProperties = taken
              ? { borderColor: "var(--codex-border)", background: "var(--muted)", color: "var(--muted-foreground)", opacity: 0.7 }
              : { borderColor: "var(--codex-border)", background: "var(--card)" }
            return (
              <button
                key={item}
                type="button"
                onClick={() => handleRightClick(item)}
                disabled={answered || (!selectedLeft && !taken)}
                className={`w-full border-2 px-4 py-3.5 min-h-[44px] font-serif text-ink text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:[--tw-ring-color:var(--codex-primary)] ${taken ? "" : "hover:[border-color:var(--codex-primary)] hover:[background:var(--codex-primary-soft)]"}`}
                style={{ borderRadius: "var(--codex-radius-btn)", ...style }}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>

      {answered && (
        <div className="text-sm text-muted-foreground italic">
          Correct pairs:
          <ul className="mt-1 list-disc list-inside font-serif not-italic">
            {Object.entries(correctPairs).map(([l, r]) => (
              <li key={l}>
                <span className="text-ink font-semibold">{l}</span> ↔ {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!answered && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={submit}
            disabled={!allPaired}
            className="codex-pressable min-h-[48px] px-8 font-bold rounded-[var(--codex-radius-btn)]"
            style={{ background: "var(--codex-primary)", color: "var(--codex-on-primary)", border: "var(--codex-border-w) solid var(--codex-primary)" }}
          >
            Check Matches
          </Button>
        </div>
      )}
    </div>
  )
}
