"use client"

/**
 * IliadEnhancements — scholarly apparatus chrome for Homer's Iliad
 * (William Cullen Bryant, 1870 — unrhymed blank verse).
 *
 * Renders three elements, in this order, between the chapter H1 and the
 * verse body:
 *   1. A compact book header with the Greek-letter glyph (Α, Β, Γ...)
 *      as an ornamental mark and the traditional one-line argument.
 *   2. A translation note (Bryant / blank verse).
 *   3. A togglable faction-palette legend.
 *
 * The per-line speaker color coding itself is baked into the HTML by
 * `scripts/iliad/transform-book.ts` as `data-iliad-speaker` attributes,
 * and styled via CSS in `src/styles/tome.css`. This component does not
 * touch the verse body.
 *
 * Only active for `bookId === "the-iliad"`. Silently no-ops otherwise.
 */

import { useState } from "react"
import { BOOK_ARGUMENTS, BOOK_GREEK_LETTERS } from "@/data/iliad/book-metadata"

interface IliadEnhancementsProps {
  bookId: string
  currentChapter: number
}

export function IliadEnhancements({ bookId, currentChapter }: IliadEnhancementsProps) {
  const [legendOpen, setLegendOpen] = useState(false)
  if (bookId !== "the-iliad") return null
  // Preface (chapter 0) is Bryant's own prose introduction, not a book —
  // skip the apparatus entirely.
  if (currentChapter === 0) return null

  const bookNumber = currentChapter // chapter index N corresponds to Book N (1–24)
  const greek = BOOK_GREEK_LETTERS[bookNumber]
  const argument = BOOK_ARGUMENTS[bookNumber]

  return (
    <div className="mt-3 mb-5">
      {/* ── Book header: Greek ornament + italic argument ───────────── */}
      {(greek || argument) && (
        <div
          className="flex items-start gap-3 pb-3 mb-3"
          style={{ borderBottom: "1px solid rgba(168, 120, 44, 0.20)" }}
          data-iliad-book-header={bookNumber}
        >
          {greek && (
            <span
              aria-hidden
              className="font-serif leading-none select-none"
              style={{
                fontSize: "1.9em",
                color: "#A8782C",
                opacity: 0.8,
                marginTop: "-0.1em",
              }}
            >
              {greek}
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
      )}

      {/* ── Translation note + palette legend ────────────────────────── */}
      <div
        className="flex items-start gap-2 rounded-md border px-3 py-2 text-[11px] italic leading-snug"
        style={{
          borderColor: "rgba(168, 120, 44, 0.25)",
          background: "rgba(168, 120, 44, 0.05)",
          color: "var(--muted-foreground)",
        }}
        role="note"
        aria-label="Translation note"
      >
        <span
          aria-hidden
          className="mt-0.5 inline-block size-1.5 shrink-0 rounded-full"
          style={{ background: "#A8782C" }}
        />
        <div className="flex-1">
          <span>
            <strong className="not-italic">Original:</strong> dactylic hexameter.{" "}
            <strong className="not-italic">This translation</strong> (W. C.
            Bryant, 1870): unrhymed blank verse. Speakers are tinted by faction —
            Greeks in bronze, Trojans in rose, gods in mythic colors.
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
              <LegendSwatch label="Achilles"    color="#9C3A1E" darkColor="#E26A46" />
              <LegendSwatch label="Agamemnon"   color="#A8782C" darkColor="#D4A04A" />
              <LegendSwatch label="Odysseus"    color="#B89556" darkColor="#D9B97A" />
              <LegendSwatch label="Nestor"      color="#6B4A2E" darkColor="#A88560" />
              <LegendSwatch label="Hector"      color="#8C4A3D" darkColor="#C97160" />
              <LegendSwatch label="Priam"       color="#6E7A8C" darkColor="#9AA8B8" />
              <LegendSwatch label="Paris"       color="#8C6B7E" darkColor="#B89AAA" />
              <LegendSwatch label="Helen"       color="#A8782C" darkColor="#D4A070" />
              <LegendSwatch label="Andromache"  color="#6E3A3D" darkColor="#A87A7E" />
              <LegendSwatch label="Zeus"        color="#8C7A2C" darkColor="#E6D27A" />
              <LegendSwatch label="Hera"        color="#2E5F6E" darkColor="#6BA0B2" />
              <LegendSwatch label="Athena"      color="#5A6040" darkColor="#A0A874" />
              <LegendSwatch label="Apollo"      color="#C8912A" darkColor="#F0C058" />
              <LegendSwatch label="Thetis"      color="#7A8C9C" darkColor="#B0BFCE" />
              <LegendSwatch label="Hephaestus"  color="#B8652A" darkColor="#E09050" />
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
