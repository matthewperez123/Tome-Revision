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
 *   2. A translation note (Dryden / heroic couplets).
 *
 * This component does not touch the verse body.
 *
 * Only active for `bookId === "the-aeneid"`. Silently no-ops otherwise.
 */

import { BOOK_ARGUMENTS, BOOK_ROMAN_NUMERALS, BOOK_INCIPITS } from "@/data/aeneid/book-metadata"

interface AeneidEnhancementsProps {
  bookId: string
  currentChapter: number
}

export function AeneidEnhancements({ bookId, currentChapter }: AeneidEnhancementsProps) {
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

      {/* ── Translation note ────────────────────────────────────────────── */}
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
            Dryden, 1697): heroic couplets.
          </span>
        </div>
      </div>
    </div>
  )
}
