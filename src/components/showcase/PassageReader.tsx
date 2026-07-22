"use client"

/**
 * PassageReader — beats 3 & 4: read the passage, highlight a line.
 *
 * Renders the curated Act I, Scene VII text with stable paragraph anchors
 * (data-pid). Highlighting is REAL text selection: drag (or Shift+arrow)
 * across any lines and a "Highlight this line" chip appears beside the
 * selection. A "Highlight Virgil's key line" button offers the same move
 * for keyboard-only readers. Once a line is marked, "Ask Virgil" unlocks.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { Virgil, useVirgilMachine } from "@/components/virgil"
import { MACBETH_PASSAGE, SUGGESTED_HIGHLIGHT } from "@/lib/showcase/macbeth-passage"

interface SelectionChip {
  top: number
  left: number
  text: string
  paragraphId: string | null
}

export function PassageReader({
  highlightedQuote,
  highlightedParagraphId,
  onHighlight,
  onAskVirgil,
}: {
  highlightedQuote: string | null
  highlightedParagraphId: string | null
  onHighlight: (quote: string, paragraphId: string) => void
  onAskVirgil: () => void
}) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const machine = useVirgilMachine("idle")
  const [chip, setChip] = useState<SelectionChip | null>(null)

  useEffect(() => {
    machine.dispatch({ type: "READ_ALONG_STARTED" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Track real text selection inside the passage.
  useEffect(() => {
    const onSelection = () => {
      const root = rootRef.current
      const sel = window.getSelection()
      if (!root || !sel || sel.isCollapsed || sel.rangeCount === 0) {
        setChip(null)
        return
      }
      const range = sel.getRangeAt(0)
      if (!root.contains(range.commonAncestorContainer)) {
        setChip(null)
        return
      }
      const text = sel.toString().trim().replace(/\s+/g, " ")
      if (text.length < 8) {
        setChip(null)
        return
      }
      const anchorEl =
        range.startContainer instanceof Element
          ? range.startContainer
          : range.startContainer.parentElement
      const pid = anchorEl?.closest("[data-pid]")?.getAttribute("data-pid") ?? null
      const rect = range.getBoundingClientRect()
      setChip({
        top: rect.bottom + window.scrollY + 8,
        left: Math.min(rect.left + window.scrollX, window.scrollX + window.innerWidth - 220),
        text: text.slice(0, 400),
        paragraphId: pid,
      })
    }
    document.addEventListener("selectionchange", onSelection)
    return () => document.removeEventListener("selectionchange", onSelection)
  }, [])

  const confirmSelection = useCallback(() => {
    if (!chip || !chip.paragraphId) return
    onHighlight(chip.text, chip.paragraphId)
    window.getSelection()?.removeAllRanges()
    setChip(null)
    machine.dispatch({ type: "TEXT_HIGHLIGHTED", quote: chip.text, paragraphId: chip.paragraphId })
  }, [chip, onHighlight, machine])

  const highlightSuggested = useCallback(() => {
    onHighlight(SUGGESTED_HIGHLIGHT.quote.replace(/\n/g, " "), SUGGESTED_HIGHLIGHT.paragraphId)
    machine.dispatch({
      type: "TEXT_HIGHLIGHTED",
      quote: SUGGESTED_HIGHLIGHT.quote,
      paragraphId: SUGGESTED_HIGHLIGHT.paragraphId,
    })
  }, [onHighlight, machine])

  return (
    <section aria-label="Guided reading — Macbeth, Act I, Scene VII" className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--la-wisdom-deep)]">
            {MACBETH_PASSAGE.bookTitle} · {MACBETH_PASSAGE.citation}
          </p>
          <h2 className="mt-1 font-serif text-2xl text-[var(--la-ink)]">The vaulting ambition</h2>
          <p className="mt-0.5 font-sans text-xs text-[var(--la-ink-faint)]">
            {MACBETH_PASSAGE.wordCount} words · {MACBETH_PASSAGE.sourceNote}
          </p>
        </div>
        <Virgil state={machine.state} announcement={machine.announcement} variant="macbeth" size={72} bust />
      </div>

      <div
        ref={rootRef}
        className="mt-4 space-y-5 rounded-2xl border border-[var(--la-surface-sunken)] bg-[var(--la-page)] p-5 @sm:p-7"
      >
        {MACBETH_PASSAGE.paragraphs.map((p) =>
          p.kind === "stage" ? (
            <p
              key={p.id}
              data-pid={p.id}
              className="font-sans text-sm italic text-[var(--la-ink-faint)]"
            >
              {p.lines[0]?.text}
            </p>
          ) : (
            <div key={p.id} data-pid={p.id} className="space-y-3">
              {p.lines.map((line, li) => (
                <p
                  key={`${p.id}-${li}`}
                  className="whitespace-pre-line font-serif text-[15px] leading-relaxed text-[var(--la-ink)]"
                >
                  {line.speaker && (
                    <span className="mr-2 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--la-ink-faint)]">
                      {line.speaker}
                    </span>
                  )}
                  {line.text}
                </p>
              ))}
            </div>
          ),
        )}
      </div>

      {/* floating chip beside a real selection */}
      {chip && chip.paragraphId && (
        <button
          type="button"
          onClick={confirmSelection}
          className="fixed z-30 rounded-full bg-[var(--la-primary)] px-4 py-2 font-sans text-xs font-semibold text-[var(--la-primary-ink)] shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
          style={{ top: chip.top - window.scrollY, left: chip.left }}
        >
          Highlight this line ✦
        </button>
      )}

      <div className="mt-4 rounded-xl border border-[var(--la-surface-sunken)] bg-[var(--la-surface)] p-4">
        {highlightedQuote ? (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--la-wisdom-deep)]">
              Your highlighted line · {highlightedParagraphId}
            </p>
            <blockquote className="mt-1 border-l-2 border-[var(--la-wisdom)] pl-3 font-serif text-sm italic leading-relaxed text-[var(--la-ink)]">
              “{highlightedQuote}”
            </blockquote>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onAskVirgil}
                className="rounded-full bg-[var(--la-primary)] px-5 py-2 font-sans text-sm font-semibold text-[var(--la-primary-ink)] hover:bg-[var(--la-primary-edge)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
              >
                Ask Virgil about this line →
              </button>
              <button
                type="button"
                onClick={highlightSuggested}
                className="rounded-full border border-[var(--la-surface-sunken)] px-4 py-2 font-sans text-xs font-semibold text-[var(--la-ink-muted)] hover:bg-[var(--la-surface-sunken)] focus-visible:outline-2 focus-visible:outline-[var(--la-focus)]"
              >
                Re-highlight Virgil’s key line
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-sans text-sm text-[var(--la-ink-muted)]">
              Select any lines above — or let Virgil choose the hinge of the scene.
            </p>
            <button
              type="button"
              onClick={highlightSuggested}
              className="rounded-full border border-[var(--la-wisdom)] px-4 py-2 font-sans text-xs font-semibold text-[var(--la-wisdom-deep)] hover:bg-[var(--la-wisdom-soft)] focus-visible:outline-2 focus-visible:outline-[var(--la-focus)]"
            >
              Highlight Virgil’s key line
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
