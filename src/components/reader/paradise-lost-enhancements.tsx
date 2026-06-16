"use client"

/**
 * ParadiseLostEnhancements — scholarly apparatus chrome for Milton's
 * Paradise Lost (1674 second edition, 12 books, English blank verse).
 *
 * Renders, between the chapter H1 and the verse body:
 *   1. A book-header block with the Roman numeral, a one-sentence
 *      scholarly argument, and Milton's opening lines as epigraph.
 *      Milton's own prose "Argument" is preserved inside the verse
 *      body itself (tagged `data-pl-argument` at ingest) so the reader
 *      sees both.
 *   2. An edition note acknowledging the 1674 second edition and
 *      English blank verse (no "translation note" — the poem is in
 *      the reader's language by nature).
 *
 * This component does not touch the verse body.
 *
 * Only active for `bookId === "paradise-lost"`. Silently no-ops
 * otherwise.
 */

import { useEffect, useState } from "react"
import {
  BOOK_ARGUMENTS,
  BOOK_OPENINGS,
  BOOK_ROMAN_NUMERALS,
  BOOK_INVOCATIONS,
} from "@/data/paradise-lost/book-metadata"

interface ParadiseLostEnhancementsProps {
  bookId: string
  currentChapter: number
}

// LocalStorage keys for per-reader toggles (persist across chapters / reloads).
const LS_PARAGRAPHS = "pl:showVerseParagraphs"
const LS_ENJAMBMENT = "pl:highlightEnjambment"

export function ParadiseLostEnhancements({
  bookId,
  currentChapter,
}: ParadiseLostEnhancementsProps) {
  const [showParagraphs, setShowParagraphs] = useState(false)
  const [highlightEnjambment, setHighlightEnjambment] = useState(false)

  // Hydrate toggles from localStorage.
  useEffect(() => {
    if (typeof window === "undefined") return
    setShowParagraphs(window.localStorage.getItem(LS_PARAGRAPHS) === "1")
    setHighlightEnjambment(window.localStorage.getItem(LS_ENJAMBMENT) === "1")
  }, [])

  // Project toggle state onto the [data-reader-text] root so CSS can
  // show/hide the decorations, and run the enjambment detection pass
  // when enabled. Works without mutating the source HTML.
  useEffect(() => {
    if (bookId !== "paradise-lost") return
    const root = document.querySelector<HTMLElement>("[data-reader-text]")
    if (!root) return
    if (showParagraphs) root.setAttribute("data-pl-show-paragraphs", "1")
    else root.removeAttribute("data-pl-show-paragraphs")

    if (highlightEnjambment) {
      root.setAttribute("data-pl-highlight-enjambment", "1")
      // Mark each verse line that does NOT end in sentence-closing punctuation.
      // Idempotent: re-runs cleanly on chapter change.
      const lines = root.querySelectorAll<HTMLElement>("[data-pl-line]")
      lines.forEach((ln) => {
        const text = (ln.textContent ?? "").replace(/\s+$/, "")
        // Strict enjambment: the syntactic unit runs past the line end.
        // That means the line ends with NO punctuation at all, or with
        // an em-dash / hyphen. Comma-ending lines are "mid-stopped" and
        // NOT flagged — Milton's true enjambments are the ones where a
        // phrase breaks mid-clause, and those are rarer and more
        // teachable than every comma.
        const enjambed =
          /[A-Za-z\u2014\u2013-]$/.test(text) &&
          !/[.?!:;,]["'\u201D\u2019]?$/.test(text)
        if (enjambed) ln.setAttribute("data-pl-enjambed", "1")
        else ln.removeAttribute("data-pl-enjambed")
      })
    } else {
      root.removeAttribute("data-pl-highlight-enjambment")
      root
        .querySelectorAll<HTMLElement>("[data-pl-enjambed]")
        .forEach((el) => el.removeAttribute("data-pl-enjambed"))
    }
  }, [bookId, currentChapter, showParagraphs, highlightEnjambment])

  if (bookId !== "paradise-lost") return null

  // ch-N.json files are zero-indexed: ch-0 is Book I.
  const bookNumber = currentChapter + 1
  const roman = BOOK_ROMAN_NUMERALS[bookNumber]
  const argument = BOOK_ARGUMENTS[bookNumber]
  const opening = BOOK_OPENINGS[bookNumber]
  const invocation = BOOK_INVOCATIONS[bookNumber]

  if (!roman && !argument && !opening) return null

  return (
    <div className="mt-3 mb-5">
      {/* ── Book header: Roman numeral + scholarly argument + Milton's
           opening lines as epigraph ─────────────────────────────── */}
      <div
        className="pb-3 mb-3"
        style={{ borderBottom: "1px solid rgba(139, 26, 26, 0.18)" }}
        data-pl-book-header={bookNumber}
      >
        <div className="flex items-start gap-3">
          {roman && (
            <span
              aria-hidden
              className="font-serif leading-none select-none"
              style={{
                fontSize: "1.7em",
                color: "#8B1A1A",
                opacity: 0.82,
                letterSpacing: "0.03em",
                marginTop: "-0.05em",
              }}
            >
              {roman}
            </span>
          )}
          {argument && (
            <p
              className="italic m-0 leading-snug text-[0.9em]"
              style={{
                color: "var(--muted-foreground)",
                textIndent: 0,
                maxWidth: "56ch",
              }}
            >
              {argument}
            </p>
          )}
        </div>
        {opening && (
          <div
            className="mt-2 pl-[calc(1.7em+0.75rem)] text-[0.82em] leading-snug italic"
            style={{ color: "var(--muted-foreground)" }}
          >
            <span style={{ color: "#8B1A1A" }}>“{opening.split(" / ")[0]}</span>
            <span className="opacity-70">
              {opening.split(" / ").slice(1).map((part, i) => (
                <span key={i}>
                  <span className="mx-1.5 opacity-40">/</span>
                  {part}
                </span>
              ))}
              ”
            </span>
          </div>
        )}
        {invocation && (
          <div
            className="mt-2 pl-[calc(1.7em+0.75rem)] text-[0.74em] not-italic"
            style={{ color: "var(--muted-foreground)", opacity: 0.8 }}
          >
            <span
              aria-hidden
              className="mr-1.5 inline-block size-1.5 rounded-full align-middle"
              style={{ background: "rgba(93, 85, 140, 0.7)" }}
            />
            Lines {invocation.start}–{invocation.end} are the book's invocation
            — Milton addresses the Muse directly.
          </div>
        )}
      </div>

      {/* ── Edition note + palette legend ──────────────────────────── */}
      <div
        className="flex items-start gap-2 rounded-md border px-3 py-2 text-[11px] italic leading-snug"
        style={{
          borderColor: "rgba(139, 26, 26, 0.22)",
          background: "rgba(139, 26, 26, 0.04)",
          color: "var(--muted-foreground)",
        }}
        role="note"
        aria-label="Edition note"
      >
        <span
          aria-hidden
          className="mt-0.5 inline-block size-1.5 shrink-0 rounded-full"
          style={{ background: "#8B1A1A" }}
        />
        <div className="flex-1">
          <span>
            <strong className="not-italic">Edition:</strong> 1674 second
            edition (twelve books). <strong className="not-italic">Verse:</strong>{" "}
            English blank verse — unrhymed iambic pentameter. Milton's own prose
            Argument precedes each book; the four invocations (I, III, VII, IX)
            carry a subtle indigo accent.
          </span>
          {/* ── Milton-specific reading toggles ──
               Verse paragraphs: Milton's most innovative formal feature is
               the long suspended period; revealing the paragraph boundary
               from the 1674 typography helps readers *see* the unit. The
               enjambment highlight teaches the reader to feel the tension
               between line (rhythm) and sentence (syntax). Both default off;
               state persists in localStorage. */}
          <span className="ml-3 inline-flex flex-wrap items-center gap-3 not-italic">
            <label className="inline-flex cursor-pointer items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
              <input
                type="checkbox"
                checked={showParagraphs}
                onChange={(e) => {
                  setShowParagraphs(e.target.checked)
                  if (typeof window !== "undefined") {
                    window.localStorage.setItem(
                      LS_PARAGRAPHS,
                      e.target.checked ? "1" : "0",
                    )
                  }
                }}
                className="size-3 accent-[#8B1A1A]"
                aria-label="Show verse paragraphs"
              />
              verse paragraphs
            </label>
            <label className="inline-flex cursor-pointer items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
              <input
                type="checkbox"
                checked={highlightEnjambment}
                onChange={(e) => {
                  setHighlightEnjambment(e.target.checked)
                  if (typeof window !== "undefined") {
                    window.localStorage.setItem(
                      LS_ENJAMBMENT,
                      e.target.checked ? "1" : "0",
                    )
                  }
                }}
                className="size-3 accent-[#8B1A1A]"
                aria-label="Highlight enjambment"
              />
              enjambment
            </label>
          </span>
        </div>
      </div>
    </div>
  )
}
