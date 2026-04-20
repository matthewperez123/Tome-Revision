"use client"

/**
 * AeneidEnhancements — scholarly apparatus chrome for Virgil's Aeneid
 * (John Dryden, 1697 — heroic couplets, Standard Ebooks edition).
 *
 * Renders, in order, between the chapter H1 and the verse body:
 *   1. A BookHeaderBlock with the Roman numeral, the traditional
 *      one-sentence argument, and Virgil's Latin incipit with a close
 *      English literal (the opening of Book I — Arma virumque cano —
 *      is the most famous line in Latin poetry, so it is surfaced
 *      intentionally).
 *   2. A translation note (Dryden / heroic couplets) with a togglable
 *      palette legend. Roman god names (Juno, Venus, Jove) share the
 *      exact Homeric hues of Hera, Aphrodite, Zeus — so the Classical
 *      Triad reads as one continuous palette across the library.
 *
 * Per-line speaker color coding itself is baked into the HTML by
 * scripts/aeneid/transform-book.ts as `data-aeneid-speaker` attributes,
 * and styled via CSS in src/styles/tome.css. This component does not
 * touch the verse body.
 *
 * Only active for `bookId === "the-aeneid"`. Silently no-ops otherwise.
 */

import { useState } from "react"
import { BOOK_ARGUMENTS, BOOK_ROMAN_NUMERALS, BOOK_INCIPITS } from "@/data/aeneid/book-metadata"

interface AeneidEnhancementsProps {
  bookId: string
  currentChapter: number
}

export function AeneidEnhancements({ bookId, currentChapter }: AeneidEnhancementsProps) {
  const [legendOpen, setLegendOpen] = useState(false)
  if (bookId !== "the-aeneid") return null

  // ch-N.json files are zero-indexed: ch-0 is Book I.
  const bookNumber = currentChapter + 1
  const roman = BOOK_ROMAN_NUMERALS[bookNumber]
  const argument = BOOK_ARGUMENTS[bookNumber]
  const incipit = BOOK_INCIPITS[bookNumber]

  if (!roman && !argument && !incipit) return null

  return (
    <div className="mt-3 mb-5">
      {/* ── Book header: Roman numeral + Latin incipit + argument ──────── */}
      <div
        className="pb-3 mb-3"
        style={{ borderBottom: "1px solid rgba(122, 90, 31, 0.20)" }}
        data-aeneid-book-header={bookNumber}
      >
        <div className="flex items-start gap-3">
          {roman && (
            <span
              aria-hidden
              className="font-serif leading-none select-none"
              style={{
                fontSize: "1.7em",
                color: "#7A5A1F",
                opacity: 0.85,
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
        {incipit && (
          <div
            className="mt-2 pl-[calc(1.7em+0.75rem)] text-[0.82em] leading-snug"
            style={{ color: "var(--muted-foreground)" }}
          >
            <span className="italic" style={{ color: "#7A5A1F" }}>
              {incipit.latin}
            </span>
            <span className="mx-1.5 opacity-40">·</span>
            <span className="italic">{incipit.english}</span>
          </div>
        )}
      </div>

      {/* ── Translation note + palette legend ───────────────────────────── */}
      <div
        className="flex items-start gap-2 rounded-md border px-3 py-2 text-[11px] italic leading-snug"
        style={{
          borderColor: "rgba(122, 90, 31, 0.25)",
          background: "rgba(122, 90, 31, 0.05)",
          color: "var(--muted-foreground)",
        }}
        role="note"
        aria-label="Translation note"
      >
        <span
          aria-hidden
          className="mt-0.5 inline-block size-1.5 shrink-0 rounded-full"
          style={{ background: "#7A5A1F" }}
        />
        <div className="flex-1">
          <span>
            <strong className="not-italic">Original:</strong> dactylic hexameter.{" "}
            <strong className="not-italic">This translation</strong> (John
            Dryden, 1697): heroic couplets. Speakers are tinted — Trojan exiles
            in imperial bronze, Carthaginians in carmine, Italians in iron and
            laurel, gods in their Homeric hues under Roman names.
          </span>{" "}
          <button
            type="button"
            onClick={() => setLegendOpen((v) => !v)}
            className="not-italic underline underline-offset-2 hover:no-underline"
            style={{ color: "var(--muted-foreground)" }}
          >
            {legendOpen ? "hide palette" : "show palette"}
          </button>
          {legendOpen && (
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 not-italic sm:grid-cols-3">
              <LegendSwatch label="Aeneas"    color="#7A5A1F" darkColor="#D6B06A" />
              <LegendSwatch label="Anchises"  color="#6E6B5A" darkColor="#C8C2A8" />
              <LegendSwatch label="Ascanius"  color="#B88A3C" darkColor="#E8C070" />
              <LegendSwatch label="Dido"      color="#8E1F2F" darkColor="#E05068" />
              <LegendSwatch label="Turnus"    color="#8B1A1A" darkColor="#DD5252" />
              <LegendSwatch label="Latinus"   color="#4E3E6C" darkColor="#9A8AC8" />
              <LegendSwatch label="Camilla"   color="#8E8C9E" darkColor="#C4C2D6" />
              <LegendSwatch label="Evander"   color="#4A6838" darkColor="#8CB07A" />
              <LegendSwatch label="Pallas"    color="#D4B03A" darkColor="#F0D878" />
              <LegendSwatch label="Mezentius" color="#4E4E54" darkColor="#9A9AA2" />
              <LegendSwatch label="Sibyl"     color="#5A3A6A" darkColor="#A482BA" />
              <LegendSwatch label="Jove"      color="#8C7A2C" darkColor="#E6D27A" />
              <LegendSwatch label="Juno"      color="#2E5F6E" darkColor="#6BA0B2" />
              <LegendSwatch label="Venus"     color="#B86B88" darkColor="#E09AB0" />
              <LegendSwatch label="Neptune"   color="#2E5A7A" darkColor="#6895B5" />
              <LegendSwatch label="Mercury"   color="#6B8560" darkColor="#9EBE94" />
              <LegendSwatch label="Vulcan"    color="#B8652A" darkColor="#E09050" />
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
    <span className="flex items-center gap-1.5">
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
