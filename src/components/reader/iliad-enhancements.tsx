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
 *
 * This component does not touch the verse body.
 *
 * Only active for `bookId === "the-iliad"`. Silently no-ops otherwise.
 */

import { BOOK_ARGUMENTS, BOOK_GREEK_LETTERS } from "@/data/iliad/book-metadata"

interface IliadEnhancementsProps {
  bookId: string
  currentChapter: number
}

export function IliadEnhancements({ bookId, currentChapter }: IliadEnhancementsProps) {
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
            Bryant, 1870): unrhymed blank verse.
          </span>
        </div>
      </div>
    </div>
  )
}
