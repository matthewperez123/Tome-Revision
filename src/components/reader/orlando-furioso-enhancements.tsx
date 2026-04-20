"use client"

/**
 * OrlandoFuriosoEnhancements — scholarly apparatus for Ariosto's
 * *Orlando Furioso* (1516/1532, 46 cantos in ottava rima). Modeled on
 * DonJuanEnhancements, extended with the features specific to this book.
 *
 * What it does:
 *   1. Renders, between the chapter H1 and the verse body:
 *      - A canto header block with the Roman numeral, a one-sentence
 *        scholarly argument, and the opening line as an epigraph.
 *      - A structural-note banner for the demo-critical cantos (VI–VIII
 *        Alcina, XVIII Cloridano, XXIII Orlando's madness, XXXIV–XXXV
 *        moon, XLVI Rodomonte-Turnus parallel).
 *      - A translation-caveat block on ch-0 (the editor's introduction)
 *        naming Rose as the only PD English Orlando Furioso and the
 *        limits of any English version of the poem.
 *      - Three reader toggles:
 *          · stanza numbers (default OFF) — per-stanza index rendered
 *            in the left margin.
 *          · RHYME SCHEME (default OFF, NEW feature specific to this
 *            book) — projects the ABABABCC pattern onto each stanza so
 *            readers can see the ottava rima's shape: six alternating-
 *            rhyme setup lines and the closing couplet.
 *          · proem flag (default OFF) — surfaces Ariosto's canto-opening
 *            proems with a subtle left-bar marker.
 *
 *   2. Stanza-tagging and rhyme-tagging are done by walking the rendered
 *      verse body post-mount. Standard Ebooks' Rose HTML wraps the canto
 *      in <section role="doc-chapter">, and each Ariostan stanza is a
 *      <p> with eight <br>-separated <span> lines. Because the SE source
 *      here does not nest each <p> in its own <section> (unlike Byron's
 *      source), we tag the <p> directly rather than an outer <section>.
 *
 * Only active for `bookId === "orlando-furioso"`. Silently no-ops otherwise.
 */

import { useEffect, useState } from "react"
import {
  CANTO_ARGUMENTS,
  CANTO_OPENINGS,
  CANTO_STRUCTURAL_NOTES,
  FRONT_MATTER_CHAPTERS,
  ROMAN,
  cantoNumberForChapter,
} from "@/data/orlando-furioso/canto-metadata"
import { getDigressionsForChapter } from "@/data/orlando-furioso/digressions"
import { getStorylinesForCanto } from "@/data/orlando-furioso/storylines"

interface OrlandoFuriosoEnhancementsProps {
  bookId: string
  currentChapter: number
}

// LocalStorage keys for persistent reader toggles.
const LS_STANZA_NUMBERS = "of:showStanzaNumbers"
const LS_RHYME_SCHEME   = "of:showRhymeScheme"
const LS_PROEM_FLAG     = "of:flagProems"

// Ariosto palette — used for the accent bar and decorations.
const FERRARA_RED   = "#8B1A1A"
const FERRARA_RED_D = "#D46C6C"
const ARIOSTO_GOLD  = "#C89B3C"

// The ottava rima pattern: indices 0,2,4 → A ; 1,3,5 → B ; 6,7 → C.
// (0-indexed line positions within the 8-line stanza.)
const RHYME_LETTER_FOR_LINE = ["A", "B", "A", "B", "A", "B", "C", "C"] as const

export function OrlandoFuriosoEnhancements({
  bookId,
  currentChapter,
}: OrlandoFuriosoEnhancementsProps) {
  const [storylinesOpen,     setStorylinesOpen]     = useState(false)
  const [showStanzaNumbers,  setShowStanzaNumbers]  = useState(false)
  const [showRhymeScheme,    setShowRhymeScheme]    = useState(false)
  const [flagProems,         setFlagProems]         = useState(false)

  // Hydrate toggles from localStorage.
  useEffect(() => {
    if (typeof window === "undefined") return
    setShowStanzaNumbers(window.localStorage.getItem(LS_STANZA_NUMBERS) === "1")
    setShowRhymeScheme  (window.localStorage.getItem(LS_RHYME_SCHEME)   === "1")
    setFlagProems       (window.localStorage.getItem(LS_PROEM_FLAG)     === "1")
  }, [])

  // Walk the rendered verse body and annotate stanzas + rhyme letters.
  // The Rose SE source gives us: <section role="doc-chapter"> > <p>
  // (one <p> per stanza) > <span> (one <span> per line, 8 per stanza,
  // separated by <br>). We tag each <p> with data-of-stanza={N} and each
  // direct-child <span> with data-of-rhyme="A|B|C" and data-of-line={1-8}.
  // Idempotent; re-runs cleanly on chapter change.
  //
  // The chapter HTML is fetched after the component mounts, so we poll
  // until the doc-chapter body is present in the DOM before tagging;
  // otherwise fast chapters tag while slow ones silently miss.
  useEffect(() => {
    if (bookId !== "orlando-furioso") return

    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const runPass = (): boolean => {
      if (cancelled) return true
      const root = document.querySelector<HTMLElement>("[data-reader-text]")
      if (!root) return false

      if (showStanzaNumbers) root.setAttribute("data-of-show-stanzas", "1")
      else root.removeAttribute("data-of-show-stanzas")
      if (showRhymeScheme)   root.setAttribute("data-of-show-rhyme", "1")
      else root.removeAttribute("data-of-show-rhyme")
      if (flagProems)        root.setAttribute("data-of-flag-proems", "1")
      else root.removeAttribute("data-of-flag-proems")

      const chapter = root.querySelector<HTMLElement>("section[role='doc-chapter']")
      if (!chapter) return false

      // Clear previous pass before re-tagging.
      root.querySelectorAll("[data-of-stanza]").forEach(el => el.removeAttribute("data-of-stanza"))
      root.querySelectorAll("[data-of-rhyme]").forEach(el => el.removeAttribute("data-of-rhyme"))
      root.querySelectorAll("[data-of-line]").forEach(el => el.removeAttribute("data-of-line"))
      root.querySelectorAll("[data-of-proem]").forEach(el => el.removeAttribute("data-of-proem"))

      const stanzaPs = chapter.querySelectorAll<HTMLElement>(":scope > p")
      const digressions = getDigressionsForChapter(currentChapter).filter(d => d.tone === "proem")

      let stanzaIdx = 0
      stanzaPs.forEach(p => {
        const spans = Array.from(p.querySelectorAll<HTMLElement>(":scope > span"))
        if (spans.length < 6) return   // not a stanza (front-matter paragraph, interpolation)

        stanzaIdx += 1
        p.setAttribute("data-of-stanza", String(stanzaIdx))

        // Tag each line with its rhyme letter and line index within the stanza.
        spans.forEach((span, i) => {
          const letter = RHYME_LETTER_FOR_LINE[Math.min(i, 7)]
          span.setAttribute("data-of-rhyme", letter)
          span.setAttribute("data-of-line", String(i + 1))
        })

        // Proem flagging — if this stanza falls inside any proem range for the canto.
        const inProem = digressions.some(
          d => stanzaIdx >= d.startStanza && stanzaIdx <= d.endStanza,
        )
        if (inProem) p.setAttribute("data-of-proem", "1")
      })

      return stanzaIdx > 0
    }

    // Retry until the chapter body is present and we've tagged at least one
    // stanza. Bails out after ~3s — no stanzas may be expected on front
    // matter (ch-0 Introduction), which is fine.
    let attempts = 0
    const tick = () => {
      if (cancelled) return
      if (runPass()) return
      attempts += 1
      if (attempts > 30) return
      timeoutId = setTimeout(tick, 100)
    }
    tick()

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [bookId, currentChapter, showStanzaNumbers, showRhymeScheme, flagProems])

  // Persist toggles.
  const persist = (k: string, v: boolean) => {
    if (typeof window !== "undefined") window.localStorage.setItem(k, v ? "1" : "0")
  }

  if (bookId !== "orlando-furioso") return null

  const cantoNum       = cantoNumberForChapter(currentChapter)
  const frontMatter    = FRONT_MATTER_CHAPTERS[currentChapter]
  const roman          = cantoNum ? ROMAN[cantoNum] : null
  const argument       = cantoNum ? CANTO_ARGUMENTS[cantoNum] : null
  const opening        = cantoNum ? CANTO_OPENINGS[cantoNum] : null
  const structuralNote = cantoNum ? CANTO_STRUCTURAL_NOTES[cantoNum] : null
  const storylines     = cantoNum ? getStorylinesForCanto(cantoNum) : []

  return (
    <div className="mt-3 mb-5">
      {/* ── Translation caveat on the Introduction chapter ─────────── */}
      {frontMatter && (
        <aside
          className="pb-3 mb-4 text-[0.88em] leading-relaxed"
          style={{
            borderLeft: `3px solid ${FERRARA_RED}`,
            paddingLeft: "0.9em",
            color: "var(--muted-foreground)",
          }}
          data-of-front-matter
        >
          <strong className="not-italic" style={{ color: FERRARA_RED }}>
            A note on the translation.
          </strong>{" "}
          {frontMatter.note}
        </aside>
      )}

      {/* ── Canto header: Roman numeral + argument + opening line ─── */}
      {roman && (
        <div
          className="pb-3 mb-3"
          style={{ borderBottom: `1px solid ${FERRARA_RED}2E` }}
          data-of-canto-header={cantoNum}
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="font-serif leading-none select-none"
              style={{
                fontSize: "1.7em",
                color: FERRARA_RED,
                opacity: 0.85,
                letterSpacing: "0.03em",
                marginTop: "-0.05em",
              }}
            >
              {roman}
            </span>
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
            <p
              className="mt-2 text-[0.82em] italic"
              style={{
                color: "var(--muted-foreground)",
                opacity: 0.75,
                textIndent: 0,
                letterSpacing: "0.01em",
              }}
            >
              &ldquo;{opening}&rdquo;
            </p>
          )}
        </div>
      )}

      {/* ── Structural note for cantos with set-piece content ───────── */}
      {structuralNote && (
        <aside
          className="pb-3 mb-3 text-[0.85em] leading-relaxed"
          style={{
            borderLeft: `2px solid ${ARIOSTO_GOLD}`,
            paddingLeft: "0.8em",
            color: "var(--muted-foreground)",
          }}
          data-of-structural-note
        >
          {structuralNote}
        </aside>
      )}

      {/* ── Edition note + reader toggles ──────────────────────────── */}
      <div
        className="pb-2 mb-2 text-[0.78em] leading-relaxed flex flex-wrap items-center gap-x-4 gap-y-2"
        style={{ color: "var(--muted-foreground)", opacity: 0.85 }}
      >
        <span>
          <strong className="not-italic">Verse:</strong>{" "}
          <em>ottava rima</em> &middot; ABABABCC &middot; Rose&rsquo;s 1823&ndash;31 English.
        </span>

        {/* Stanza numbers toggle */}
        <label
          className="cursor-pointer inline-flex items-center gap-1 select-none"
          title="Show the stanza index in the margin."
        >
          <input
            type="checkbox"
            checked={showStanzaNumbers}
            onChange={e => {
              setShowStanzaNumbers(e.target.checked)
              persist(LS_STANZA_NUMBERS, e.target.checked)
            }}
            aria-label="Show stanza numbers"
            className="accent-current"
          />
          stanza numbers
        </label>

        {/* Rhyme-scheme toggle — the new feature for this book */}
        <label
          className="cursor-pointer inline-flex items-center gap-1 select-none"
          title="Project the ABABABCC rhyme scheme onto each stanza: six setup lines alternating A and B, then the closing couplet in C."
        >
          <input
            type="checkbox"
            checked={showRhymeScheme}
            onChange={e => {
              setShowRhymeScheme(e.target.checked)
              persist(LS_RHYME_SCHEME, e.target.checked)
            }}
            aria-label="Show rhyme scheme"
            className="accent-current"
          />
          show rhyme scheme
        </label>

        {/* Proem flag toggle */}
        <label
          className="cursor-pointer inline-flex items-center gap-1 select-none"
          title="Mark the canto-opening proem stanzas where Ariosto speaks in his own voice."
        >
          <input
            type="checkbox"
            checked={flagProems}
            onChange={e => {
              setFlagProems(e.target.checked)
              persist(LS_PROEM_FLAG, e.target.checked)
            }}
            aria-label="Flag proem stanzas"
            className="accent-current"
          />
          flag proems
        </label>

        {/* Storylines panel trigger */}
        {storylines.length > 0 && (
          <button
            type="button"
            onClick={() => setStorylinesOpen(v => !v)}
            className="underline-offset-2 hover:underline"
            aria-expanded={storylinesOpen}
            title="Show which storylines this canto advances."
          >
            {storylinesOpen ? "hide" : "show"} storylines ({storylines.length})
          </button>
        )}
      </div>

      {/* ── Storylines sidebar (the load-bearing reader feature) ───── */}
      {storylinesOpen && storylines.length > 0 && (
        <div
          className="mb-4 text-[0.83em] leading-relaxed rounded-sm"
          style={{
            border: `1px solid ${FERRARA_RED}24`,
            padding: "0.7em 0.9em",
            background: `${ARIOSTO_GOLD}08`,
          }}
          data-of-storylines
        >
          <div
            className="font-semibold mb-1 tracking-wide uppercase text-[0.75em]"
            style={{ color: FERRARA_RED }}
          >
            Storylines in this canto
          </div>
          <ul className="m-0 pl-4 list-disc">
            {storylines.map(({ storyline, appearance }) => (
              <li key={storyline.id} className="mb-1">
                <span
                  className="font-medium"
                  style={{ color: storyline.palette }}
                >
                  {storyline.label}.
                </span>{" "}
                <span style={{ color: "var(--muted-foreground)" }}>
                  {appearance.summary}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hidden span for dark-theme variant — surfaces the tuned red via CSS var */}
      <span aria-hidden style={{ display: "none" }} data-of-dark-red={FERRARA_RED_D} />
    </div>
  )
}
