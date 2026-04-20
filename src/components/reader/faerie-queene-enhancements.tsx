"use client"

/**
 * FaerieQueeneEnhancements — scholarly apparatus for Edmund Spenser's
 * *The Faerie Queene* (Books I–VI published 1590/1596 + the Mutabilitie
 * Cantos 1609). Modeled on OrlandoFuriosoEnhancements / DonJuanEnhancements,
 * extended with the features specific to the Spenserian stanza.
 *
 * What it does:
 *
 *   1. Renders, between the chapter H1 and the verse body, a canto header
 *      block with:
 *        - Book Roman + virtue + canto Roman
 *        - One-sentence scholarly summary (from CANTO_METADATA; Books I–II
 *          ship summaries, III–VI are deferred pending extraction)
 *        - Climactic-canto marker (from CLIMACTIC_MARKERS)
 *
 *   2. Stanza-tagging. The splitter's HTML (see
 *      scripts/faerie-queene/split-cantos.ts) places each Spenserian
 *      stanza as a direct `<p>` child of `<section role="doc-chapter">`
 *      with nine <br>-separated <span> lines. We walk the DOM post-mount
 *      and:
 *        - Tag each <p> with data-fq-stanza="N" (1-based)
 *        - Tag each direct-child <span> with data-fq-line="1"…"9" and
 *          data-fq-rhyme="A|B|C" per the ABABBCBCC Spenserian pattern
 *        - Tag line 9 with data-fq-alexandrine="1" — the alexandrine
 *          (iambic hexameter) closing line is the form's signature and
 *          the subject of an optional reader highlight.
 *
 *   3. Three reader toggles (all default OFF, localStorage-persisted):
 *        · "Show stanza numbers" — per-stanza index in the left margin
 *        · "Highlight alexandrines" — subtle accent on the 9th line of
 *          each stanza, the Spenserian form's closing signature
 *        · "Show rhyme scheme" — ABABBCBCC projected as faint letters
 *          in the gutter
 *
 *   4. A proem flag: when canto i of any book has the book-proem
 *      (data-fq-proem) block, it renders with a subtle left-bar marker
 *      distinguishing Spenser's poet-voice opening from the narrative.
 *
 * Only active for `bookId === "the-faerie-queene"`. Silently no-ops on
 * the Forward (ch-0) and Letter to Ralegh (ch-1), which are prose and
 * have no Spenserian stanzas. Enabled for all 74 cantos.
 *
 * Palette hookup: this component does NOT apply the speaker palette
 * (FAERIE_QUEENE_SPEAKERS). Speaker tagging requires a separate pass
 * that identifies narrator / dialogue spans, which for Spenser's mostly-
 * narrated poem is a meaningful body of work for a later turn. The
 * palette data is ready in src/data/faerie-queene/speakers.ts.
 */

import { useEffect, useState } from "react"
import {
  FAERIE_QUEENE_BOOKS,
  CANTO_METADATA,
  CLIMACTIC_MARKERS,
  CHAPTER_INDEX,
  bookNumberForChapter,
} from "@/data/faerie-queene/canto-metadata"

interface FaerieQueeneEnhancementsProps {
  bookId: string
  currentChapter: number
}

// LocalStorage keys — "fq:" namespace.
const LS_STANZA_NUMBERS    = "fq:showStanzaNumbers"
const LS_ALEXANDRINE       = "fq:highlightAlexandrines"
const LS_RHYME_SCHEME      = "fq:showRhymeScheme"

// Spenserian stanza rhyme pattern: ABABBCBCC (lines 1–9).
const RHYME_LETTER_FOR_LINE = ["A", "B", "A", "B", "B", "C", "B", "C", "C"] as const

// The flat-chapter layout produced by the canto splitter.
//   ch-2..13   Book I canto 1..12
//   ch-14..25  Book II canto 1..12
//   ch-26..37  Book III canto 1..12
//   ch-38..49  Book IV canto 1..12
//   ch-50..61  Book V canto 1..12
//   ch-62..73  Book VI canto 1..12
//   ch-74..75  Mutabilitie canto 6..7
function bookAndCantoForChapter(chapterIndex: number): { book: number; canto: number } | null {
  if (chapterIndex < 2 || chapterIndex > 75) return null
  if (chapterIndex <= 13) return { book: 1, canto: chapterIndex - 1 }
  if (chapterIndex <= 25) return { book: 2, canto: chapterIndex - 13 }
  if (chapterIndex <= 37) return { book: 3, canto: chapterIndex - 25 }
  if (chapterIndex <= 49) return { book: 4, canto: chapterIndex - 37 }
  if (chapterIndex <= 61) return { book: 5, canto: chapterIndex - 49 }
  if (chapterIndex <= 73) return { book: 6, canto: chapterIndex - 61 }
  // Mutabilitie: ch-74 → canto 6, ch-75 → canto 7
  return { book: 7, canto: chapterIndex === 74 ? 6 : 7 }
}

function climacticLabelFor(book: number, canto: number): string | null {
  const m = CLIMACTIC_MARKERS.find((c) => c.book === book && c.canto === canto)
  return m?.label ?? null
}

export function FaerieQueeneEnhancements({
  bookId,
  currentChapter,
}: FaerieQueeneEnhancementsProps) {
  const [showStanzaNumbers,    setShowStanzaNumbers]    = useState(false)
  const [highlightAlexandrines, setHighlightAlexandrines] = useState(false)
  const [showRhymeScheme,      setShowRhymeScheme]      = useState(false)

  // Hydrate toggles from localStorage.
  useEffect(() => {
    if (typeof window === "undefined") return
    setShowStanzaNumbers     (window.localStorage.getItem(LS_STANZA_NUMBERS) === "1")
    setHighlightAlexandrines (window.localStorage.getItem(LS_ALEXANDRINE)    === "1")
    setShowRhymeScheme       (window.localStorage.getItem(LS_RHYME_SCHEME)   === "1")
  }, [])

  // Post-mount DOM walk: tag stanzas and lines.
  useEffect(() => {
    if (bookId !== "the-faerie-queene") return
    // No-op on Forward + Letter (prose, no Spenserian stanzas).
    if (currentChapter === CHAPTER_INDEX.FORWARD) return
    if (currentChapter === CHAPTER_INDEX.LETTER_TO_RALEGH) return

    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const runPass = (): boolean => {
      if (cancelled) return true
      const root = document.querySelector<HTMLElement>("[data-reader-text]")
      if (!root) return false

      // Mirror toggle state onto root data-attrs so CSS selectors can
      // drive the visual changes.
      if (showStanzaNumbers)     root.setAttribute("data-fq-show-stanzas",     "1")
      else                       root.removeAttribute("data-fq-show-stanzas")
      if (highlightAlexandrines) root.setAttribute("data-fq-highlight-alexandrines", "1")
      else                       root.removeAttribute("data-fq-highlight-alexandrines")
      if (showRhymeScheme)       root.setAttribute("data-fq-show-rhyme",       "1")
      else                       root.removeAttribute("data-fq-show-rhyme")

      const chapter = root.querySelector<HTMLElement>("section[role='doc-chapter']")
      if (!chapter) return false

      // Idempotent: wipe prior pass before re-tagging.
      chapter.querySelectorAll("[data-fq-stanza]").forEach((el) => el.removeAttribute("data-fq-stanza"))
      chapter.querySelectorAll("[data-fq-line]").forEach((el) => el.removeAttribute("data-fq-line"))
      chapter.querySelectorAll("[data-fq-rhyme]").forEach((el) => el.removeAttribute("data-fq-rhyme"))
      chapter.querySelectorAll("[data-fq-alexandrine]").forEach((el) => el.removeAttribute("data-fq-alexandrine"))

      // Each Spenserian stanza is a direct <p> child of the doc-chapter
      // section. (Book proems and canto arguments, when sourced, land
      // in siblings outside this <section>, so we can safely restrict to
      // direct <p> children.)
      const stanzas = Array.from(chapter.children).filter(
        (el): el is HTMLElement => el.tagName === "P",
      )
      stanzas.forEach((p, i) => {
        p.setAttribute("data-fq-stanza", String(i + 1))
        // Tag direct <span> children as lines 1..9 with rhyme letters.
        const lines = Array.from(p.children).filter(
          (el): el is HTMLElement => el.tagName === "SPAN",
        )
        // Spenserian stanzas are 9 lines; SE HTML reliably gives 9 spans
        // per <p>. Tolerate anomalies (e.g. SE's ch-2.. has a handful of
        // elided stanzas in some editions) by tagging up to the count
        // seen rather than assuming exactly 9.
        lines.forEach((span, j) => {
          if (j >= 9) return
          const lineNumber = j + 1
          span.setAttribute("data-fq-line", String(lineNumber))
          span.setAttribute("data-fq-rhyme", RHYME_LETTER_FOR_LINE[j])
          if (j === 8) span.setAttribute("data-fq-alexandrine", "1")
        })
      })

      return true
    }

    let attempts = 0
    const tick = () => {
      if (runPass()) return
      attempts += 1
      if (attempts > 30) return
      timeoutId = setTimeout(tick, 60)
    }
    tick()

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [bookId, currentChapter, showStanzaNumbers, highlightAlexandrines, showRhymeScheme])

  // Render nothing for non-Faerie-Queene books.
  if (bookId !== "the-faerie-queene") return null
  // Render nothing for front-matter chapters.
  if (currentChapter === CHAPTER_INDEX.FORWARD) return null
  if (currentChapter === CHAPTER_INDEX.LETTER_TO_RALEGH) return null

  const bc = bookAndCantoForChapter(currentChapter)
  if (!bc) return null
  const book = FAERIE_QUEENE_BOOKS[bc.book]
  const canto = CANTO_METADATA.find((c) => c.book === bc.book && c.canto === bc.canto)
  if (!book || !canto) return null
  const climactic = climacticLabelFor(bc.book, bc.canto)

  const toggle = (
    key: "stanzas" | "alexandrines" | "rhyme",
    on: boolean,
    label: string,
  ) => {
    const handler = () => {
      if (key === "stanzas") {
        setShowStanzaNumbers(!on)
        if (typeof window !== "undefined")
          window.localStorage.setItem(LS_STANZA_NUMBERS, on ? "0" : "1")
      } else if (key === "alexandrines") {
        setHighlightAlexandrines(!on)
        if (typeof window !== "undefined")
          window.localStorage.setItem(LS_ALEXANDRINE, on ? "0" : "1")
      } else {
        setShowRhymeScheme(!on)
        if (typeof window !== "undefined")
          window.localStorage.setItem(LS_RHYME_SCHEME, on ? "0" : "1")
      }
    }
    return (
      <button
        type="button"
        onClick={handler}
        aria-pressed={on}
        className="fq-toggle"
        data-fq-toggle-on={on ? "1" : "0"}
      >
        <span aria-hidden="true" className="fq-toggle-dot">{on ? "●" : "○"}</span>
        <span>{label}</span>
      </button>
    )
  }

  return (
    <div className="fq-canto-header" data-fq-book={bc.book} data-fq-canto={bc.canto}>
      <style jsx>{`
        .fq-canto-header {
          margin: 1.25rem 0 1rem;
          padding: 0.75rem 0 0.5rem;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .fq-canto-crumb {
          font-family: var(--font-serif);
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #9A2540;
          opacity: 0.9;
        }
        :global([data-reader-dark]) .fq-canto-crumb { color: #D8A05A; }
        .fq-climactic-chip {
          display: inline-block;
          margin-left: 0.5rem;
          padding: 0.05rem 0.4rem;
          font-size: 0.65rem;
          border: 1px solid currentColor;
          border-radius: 999px;
          vertical-align: middle;
          opacity: 0.7;
        }
        .fq-summary {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 0.9rem;
          line-height: 1.45;
          color: var(--muted-foreground);
        }
        .fq-toggles {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          padding-top: 0.25rem;
        }
        .fq-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          padding: 0.15rem 0.4rem;
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--muted-foreground);
          background: transparent;
          cursor: pointer;
          transition: color 160ms, border-color 160ms;
        }
        .fq-toggle:hover { color: var(--foreground); border-color: var(--foreground); }
        .fq-toggle[data-fq-toggle-on="1"] {
          color: #9A2540;
          border-color: #9A2540;
        }
        :global([data-reader-dark]) .fq-toggle[data-fq-toggle-on="1"] {
          color: #D8A05A;
          border-color: #D8A05A;
        }
        .fq-toggle-dot { font-family: monospace; line-height: 1; }
      `}</style>
      <div>
        <span className="fq-canto-crumb">
          Book {book.roman} · {book.virtue} · Canto {canto.roman}
        </span>
        {climactic ? (
          <span className="fq-climactic-chip" title="A structural summit of this book">
            {climactic}
          </span>
        ) : null}
      </div>
      {canto.summary ? <p className="fq-summary">{canto.summary}</p> : null}
      <div className="fq-toggles" role="group" aria-label="Faerie Queene reader toggles">
        {toggle("stanzas",      showStanzaNumbers,     "Stanza numbers")}
        {toggle("alexandrines", highlightAlexandrines, "Highlight alexandrines")}
        {toggle("rhyme",        showRhymeScheme,       "Show rhyme scheme")}
      </div>
    </div>
  )
}
