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
            const cls =
              s === "correct"
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                : s === "wrong"
                  ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30"
                  : s === "selected"
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                    : "border-stone-300 hover:border-indigo-400 bg-card"
            return (
              <button
                key={item}
                type="button"
                onClick={() => handleLeftClick(item)}
                disabled={answered}
                className={`w-full rounded-xl border-2 px-3 py-3 font-serif text-ink text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 flex items-center justify-between gap-2 ${cls}`}
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
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Spacer column */}
        <div className="hidden sm:block h-full w-px bg-stone-200" aria-hidden />

        {/* Right column */}
        <div className="space-y-2">
          {right.map((item) => {
            const taken = isRightTaken(item)
            const cls = taken
              ? "border-stone-400 bg-stone-50 text-stone-500 dark:bg-stone-900/50 opacity-70"
              : "border-stone-300 hover:border-indigo-400 bg-card text-ink"
            return (
              <button
                key={item}
                type="button"
                onClick={() => handleRightClick(item)}
                disabled={answered || (!selectedLeft && !taken)}
                className={`w-full rounded-xl border-2 px-3 py-3 font-serif text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${cls}`}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>

      {answered && (
        <div className="text-sm text-stone-500 italic">
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
            className="rounded-xl font-semibold"
          >
            Check Matches
          </Button>
        </div>
      )}
    </div>
  )
}
