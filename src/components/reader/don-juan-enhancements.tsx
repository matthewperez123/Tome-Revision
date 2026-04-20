"use client"

/**
 * DonJuanEnhancements — scholarly apparatus for Byron's *Don Juan* (1819–24,
 * 17 cantos in ottava rima, the final canto a 14-stanza fragment).
 *
 * What it does:
 *   1. Renders, between the chapter H1 and the verse body:
 *      - A canto header block with the Roman numeral, a one-sentence
 *        scholarly argument, and the opening line as an epigraph.
 *      - A structural-note banner for cantos with interpolated lyrics
 *        (the "Isles of Greece" in III, the Black Friar ballad in XVI,
 *        the fragment in XVII).
 *      - An edition note acknowledging ottava rima and a toggleable
 *        palette legend for the speaker colors.
 *      - Two reader toggles:
 *          · stanza numbers (default OFF) — renders the stanza index
 *            in the left margin via a DOM-walk pass.
 *          · closing couplets (default OFF) — subtly emphasizes the
 *            final two lines of each stanza (Byron's comic "snap").
 *
 *   2. Stanza-numbering and couplet-highlight are applied by walking
 *      the rendered verse body post-mount. The source HTML is untouched;
 *      this follows the same pattern as VerseEnhancements for Dante and
 *      ParadiseLostEnhancements for Milton.
 *
 * Only active for `bookId === "don-juan"`. Silently no-ops otherwise.
 *
 * Byron's Dedication to Southey is NOT in the Standard Ebooks source used
 * for this ingestion, so there is no dedicated Dedication handling here.
 * Flagged for later re-ingestion from a McGann-derived edition.
 */

import { useEffect, useState } from "react"
import {
  CANTO_ARGUMENTS,
  CANTO_OPENINGS,
  CANTO_STRUCTURAL_NOTES,
  FRONT_MATTER_CHAPTERS,
  ROMAN,
  cantoNumberForChapter,
} from "@/data/don-juan/canto-metadata"
import {
  DON_JUAN_LEGEND_GROUPS,
  DON_JUAN_SPEAKERS,
  DON_JUAN_SPEAKERS_BY_ID,
} from "@/data/don-juan/speakers"
import { getDigressionsForChapter } from "@/data/don-juan/digressions"

interface DonJuanEnhancementsProps {
  bookId: string
  currentChapter: number
}

// LocalStorage keys for persistent reader toggles.
const LS_STANZA_NUMBERS  = "dj:showStanzaNumbers"
const LS_COUPLETS        = "dj:highlightCouplets"

// Byron palette — used for the accent bar and decorations.
const BYRON_INK   = "#1F3A5F"      // ink-blue
const BYRON_INK_D = "#8AA6CC"      // dark-theme variant
const BYRON_GILT  = "#B8862C"      // warm gilt accent

export function DonJuanEnhancements({
  bookId,
  currentChapter,
}: DonJuanEnhancementsProps) {
  const [legendOpen,        setLegendOpen]        = useState(false)
  const [digressionsOpen,   setDigressionsOpen]   = useState(false)
  const [showStanzaNumbers, setShowStanzaNumbers] = useState(false)
  const [highlightCouplets, setHighlightCouplets] = useState(false)

  const digressions = getDigressionsForChapter(currentChapter)

  // Hydrate toggles from localStorage.
  useEffect(() => {
    if (typeof window === "undefined") return
    setShowStanzaNumbers(window.localStorage.getItem(LS_STANZA_NUMBERS) === "1")
    setHighlightCouplets(window.localStorage.getItem(LS_COUPLETS) === "1")
  }, [])

  // Walk the rendered verse body and annotate stanzas. We expect the SE
  // structure: each <section role="doc-chapter"> wraps the canto, and
  // each inner <section><p>...8 <span> lines separated by <br>...</p></section>
  // is a single ottava rima stanza. We tag every stanza with
  // data-dj-stanza={N} and its closing two lines with data-dj-couplet.
  // Idempotent: re-runs cleanly on chapter change.
  useEffect(() => {
    if (bookId !== "don-juan") return

    const t = setTimeout(() => {
      const root = document.querySelector<HTMLElement>("[data-reader-text]")
      if (!root) return

      // Toggle root-level flags so CSS can show/hide the decorations.
      if (showStanzaNumbers) root.setAttribute("data-dj-show-stanzas", "1")
      else root.removeAttribute("data-dj-show-stanzas")
      if (highlightCouplets) root.setAttribute("data-dj-highlight-couplets", "1")
      else root.removeAttribute("data-dj-highlight-couplets")

      // Clear previous pass before re-tagging.
      root.querySelectorAll("[data-dj-stanza]").forEach(el => {
        el.removeAttribute("data-dj-stanza")
      })
      root.querySelectorAll("[data-dj-couplet]").forEach(el => {
        el.removeAttribute("data-dj-couplet")
      })

      // Find the inner <section> wrappers that contain exactly one <p>
      // made up of <span>/<br> lines. These are Byron's stanzas in SE.
      const chapter = root.querySelector<HTMLElement>("section[role='doc-chapter']")
      if (!chapter) return

      const stanzaSections = chapter.querySelectorAll<HTMLElement>(":scope > section")
      let stanzaIdx = 0
      stanzaSections.forEach(section => {
        const p = section.querySelector(":scope > p")
        if (!p) return
        const spans = Array.from(p.querySelectorAll(":scope > span"))
        // Filter out footnote-anchor inner spans by only counting direct children.
        // (Byron's stanzas in SE have 8 direct-child <span>s for the 8 lines.)
        if (spans.length < 6) return  // not a stanza — skip (e.g. interpolated lyric)

        stanzaIdx += 1
        section.setAttribute("data-dj-stanza", String(stanzaIdx))

        // Mark the final two <span> lines as the closing couplet.
        const n = spans.length
        if (n >= 2) {
          spans[n - 2].setAttribute("data-dj-couplet", "1")
          spans[n - 1].setAttribute("data-dj-couplet", "1")
        }
      })
    }, 80)

    return () => clearTimeout(t)
  }, [bookId, currentChapter, showStanzaNumbers, highlightCouplets])

  if (bookId !== "don-juan") return null

  const cantoNum       = cantoNumberForChapter(currentChapter)
  const frontMatter    = FRONT_MATTER_CHAPTERS[currentChapter]
  const roman          = cantoNum ? ROMAN[cantoNum] : null
  const argument       = cantoNum ? CANTO_ARGUMENTS[cantoNum] : null
  const opening        = cantoNum ? CANTO_OPENINGS[cantoNum] : null
  const structuralNote = cantoNum ? CANTO_STRUCTURAL_NOTES[cantoNum] : null

  return (
    <div className="mt-3 mb-5">
      {/* ── Canto header: Roman numeral + argument + opening line ─── */}
      {roman && (
        <div
          className="pb-3 mb-3"
          style={{ borderBottom: `1px solid ${BYRON_INK}2E` }}
          data-dj-canto-header={cantoNum}
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="font-serif leading-none select-none"
              style={{
                fontSize: "1.7em",
                color: BYRON_INK,
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
            <div
              className="mt-2 pl-[calc(1.7em+0.75rem)] text-[0.82em] leading-snug italic"
              style={{ color: "var(--muted-foreground)" }}
            >
              <span style={{ color: BYRON_INK }}>&ldquo;{opening}&rdquo;</span>
            </div>
          )}
          {structuralNote && (
            <div
              className="mt-2 pl-[calc(1.7em+0.75rem)] text-[0.74em] not-italic"
              style={{ color: "var(--muted-foreground)", opacity: 0.8 }}
            >
              <span
                aria-hidden
                className="mr-1.5 inline-block size-1.5 rounded-full align-middle"
                style={{ background: BYRON_GILT, opacity: 0.85 }}
              />
              {structuralNote}
            </div>
          )}
        </div>
      )}

      {/* ── Front-matter note (Introduction, Preface) ──────────────── */}
      {!roman && frontMatter && (
        <div
          className="pb-3 mb-3 text-[0.82em] italic leading-snug"
          style={{
            color: "var(--muted-foreground)",
            borderBottom: `1px solid ${BYRON_INK}2E`,
          }}
        >
          {frontMatter.note}
        </div>
      )}

      {/* ── Edition note + palette legend + toggles ────────────────── */}
      <div
        className="flex items-start gap-2 rounded-md border px-3 py-2 text-[11px] italic leading-snug"
        style={{
          borderColor: `${BYRON_INK}30`,
          background:  `${BYRON_INK}0A`,
          color:       "var(--muted-foreground)",
        }}
        role="note"
        aria-label="Edition note"
      >
        <span
          aria-hidden
          className="mt-0.5 inline-block size-1.5 shrink-0 rounded-full"
          style={{ background: BYRON_INK }}
        />
        <div className="flex-1">
          <span>
            <strong className="not-italic">Verse:</strong> <em>ottava rima</em>{" "}
            — eight lines of iambic pentameter rhyming{" "}
            <span style={{ fontVariant: "small-caps" }}>ababab cc</span>; the
            closing couplet is Byron's comic &ldquo;snap.&rdquo;{" "}
            <strong className="not-italic">Source:</strong> Standard Ebooks
            (1833 Murray collected edition lineage).
          </span>{" "}
          <button
            type="button"
            onClick={() => setLegendOpen(v => !v)}
            className="not-italic underline underline-offset-2 hover:no-underline"
            style={{ color: "var(--muted-foreground)" }}
          >
            {legendOpen ? "hide palette" : "show palette"}
          </button>

          {/* ── Reader toggles ─────────────────────────────────── */}
          <span className="ml-3 inline-flex flex-wrap items-center gap-3 not-italic">
            <label className="inline-flex cursor-pointer items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
              <input
                type="checkbox"
                checked={showStanzaNumbers}
                onChange={e => {
                  setShowStanzaNumbers(e.target.checked)
                  if (typeof window !== "undefined") {
                    window.localStorage.setItem(
                      LS_STANZA_NUMBERS,
                      e.target.checked ? "1" : "0",
                    )
                  }
                }}
                className="size-3"
                style={{ accentColor: BYRON_INK }}
                aria-label="Show stanza numbers"
              />
              stanza numbers
            </label>
            <label className="inline-flex cursor-pointer items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
              <input
                type="checkbox"
                checked={highlightCouplets}
                onChange={e => {
                  setHighlightCouplets(e.target.checked)
                  if (typeof window !== "undefined") {
                    window.localStorage.setItem(
                      LS_COUPLETS,
                      e.target.checked ? "1" : "0",
                    )
                  }
                }}
                className="size-3"
                style={{ accentColor: BYRON_INK }}
                aria-label="Highlight closing couplets"
              />
              closing couplets
            </label>
          </span>

          {/* Digression index toggle — only shown on cantos that have
               flagged digressions. Sits next to the palette toggle. */}
          {digressions.length > 0 && (
            <button
              type="button"
              onClick={() => setDigressionsOpen(v => !v)}
              className="ml-3 not-italic underline underline-offset-2 hover:no-underline"
              style={{ color: "var(--muted-foreground)" }}
            >
              {digressionsOpen
                ? "hide digressions"
                : `digressions (${digressions.length})`}
            </button>
          )}

          {digressionsOpen && digressions.length > 0 && (
            <div className="mt-2 not-italic">
              <div
                className="mb-1 text-[10px] uppercase tracking-wider"
                style={{ color: "var(--muted-foreground)", opacity: 0.6 }}
              >
                Major digressions in this canto
              </div>
              <ul className="space-y-1.5">
                {digressions.map((d, i) => (
                  <li key={i} className="text-[11px] leading-snug">
                    <span
                      className="font-medium"
                      style={{ color: BYRON_INK }}
                    >
                      Stanza {d.startStanza}
                      {d.endStanza !== d.startStanza ? `–${d.endStanza}` : ""}
                    </span>
                    <span className="opacity-80"> · {d.topic}</span>
                    <div
                      className="italic"
                      style={{ color: "var(--muted-foreground)", opacity: 0.75 }}
                    >
                      &ldquo;{d.firstLine}&rdquo;
                      <span className="ml-1 text-[10px] not-italic opacity-70">({d.tone})</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {legendOpen && (
            <div className="mt-2 not-italic">
              {DON_JUAN_LEGEND_GROUPS.map(group => (
                <div key={group.heading} className="mb-1.5 last:mb-0">
                  <div
                    className="mb-1 text-[10px] uppercase tracking-wider"
                    style={{ color: "var(--muted-foreground)", opacity: 0.6 }}
                  >
                    {group.heading}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
                    {group.ids.map(id => {
                      const sp = DON_JUAN_SPEAKERS_BY_ID[id]
                      if (!sp) return null
                      return (
                        <LegendSwatch
                          key={id}
                          label={sp.name}
                          color={sp.color}
                          darkColor={sp.darkColor}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
              <div
                className="mt-2 text-[10px]"
                style={{ color: "var(--muted-foreground)", opacity: 0.65 }}
              >
                {DON_JUAN_SPEAKERS.length} voices — Byron-the-narrator takes the base text and
                dominates roughly half the poem as digression.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LegendSwatch({
  label,
  color,
  darkColor,
}: {
  label: string
  color: string
  darkColor: string
}) {
  return (
    <span className="flex items-center gap-1.5 text-[11px]">
      <span
        aria-hidden
        className="inline-block size-2 rounded-full dark:hidden"
        style={{ background: color }}
      />
      <span
        aria-hidden
        className="hidden size-2 rounded-full dark:inline-block"
        style={{ background: darkColor }}
      />
      <span style={{ color }} className="dark:[&]:hidden">
        {label}
      </span>
      <span style={{ color: darkColor }} className="hidden dark:[&]:inline">
        {label}
      </span>
    </span>
  )
}
