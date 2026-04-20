"use client"

/**
 * VerseEnhancements — post-mount DOM enhancements for verse-heavy works
 * (currently scoped to Dante's Commedia). Attaches to the already-rendered
 * reader body without mutating the source HTML.
 *
 * What it does:
 *   1. Walks each paragraph inside every `<section role="doc-chapter">`
 *      and inserts a tercet gap after every third `<br>`. The original
 *      `<br>`s remain in place; we just add a visually-hidden spacer
 *      `<span data-tercet-gap>` so CSS can give tercets air without having
 *      to rewrite the source lines. Terza rima's interlocking-tercet
 *      identity becomes legible even though Longfellow's translation is
 *      blank verse.
 *   2. Renders a small translation-note banner above the canto body so
 *      the reader knows the original is *terza rima* even when the
 *      English is not.
 *
 * This component renders nothing when the book is not a multi-canticle
 * work we support — it is cheap to include unconditionally and will
 * silently no-op.
 */

import { useEffect, useMemo } from "react"
import type { BookPart } from "@/data/books"

interface VerseEnhancementsProps {
  bookId: string
  currentChapter: number
  /** Optional parts metadata — used only to pick a canticle accent color. */
  parts?: BookPart[]
  currentPartId?: string
}

const COMMEDIA_TRANSLATION_NOTE = (
  <>
    <strong className="not-italic">Original:</strong> terza rima (ABA BCB CDC …).{" "}
    <strong className="not-italic">This translation</strong> (Longfellow, 1867):
    unrhymed blank verse, tercets preserved.
  </>
)

const SUPPORTED_BOOK_IDS = new Set(["the-divine-comedy"])

export function VerseEnhancements({
  bookId,
  currentChapter,
  parts,
  currentPartId,
}: VerseEnhancementsProps) {
  const isSupported = SUPPORTED_BOOK_IDS.has(bookId)

  const accentColor = useMemo(() => {
    if (!parts || !currentPartId) return undefined
    return parts.find(p => p.id === currentPartId)?.coverColors?.accent
  }, [parts, currentPartId])

  useEffect(() => {
    if (!isSupported) return

    // Small delay so the DOM from dangerouslySetInnerHTML is in the tree.
    const timer = setTimeout(() => {
      const root = document.querySelector<HTMLElement>("[data-reader-text].content-verse")
      if (!root) return

      // Clean up any previous enhancement pass so re-mounts don't stack.
      root.querySelectorAll("[data-tercet-gap]").forEach(el => el.remove())

      // For each paragraph, count <br>s and add a spacer after every 3rd.
      // Dante's tercets are three lines separated by <br>; the paragraph
      // itself typically spans many tercets in the SE source.
      root.querySelectorAll("section[role='doc-chapter'] p, section[role='doc-preface'] p").forEach(p => {
        const brs = Array.from(p.querySelectorAll(":scope > br"))
        // Only enhance when we have enough lines to form multiple tercets.
        if (brs.length < 3) return
        brs.forEach((br, i) => {
          // i is 0-based; after the 3rd, 6th, 9th, ... line add a gap.
          // The <br> between line 3 and line 4 is at index 2 (0-indexed).
          if ((i + 1) % 3 === 0) {
            const gap = document.createElement("span")
            gap.setAttribute("data-tercet-gap", "true")
            gap.setAttribute("aria-hidden", "true")
            br.parentNode?.insertBefore(gap, br.nextSibling)
          }
        })
      })
    }, 60)

    return () => clearTimeout(timer)
    // Re-run whenever the chapter (and therefore the rendered HTML) changes.
  }, [isSupported, currentChapter])

  if (!isSupported) return null

  return (
    <div
      className="mt-2 mb-6 flex items-start gap-2 rounded-md border px-3 py-2 text-[11px] italic leading-snug"
      style={{
        borderColor: accentColor ? `${accentColor}33` : "rgba(212,160,76,0.25)",
        background:  accentColor ? `${accentColor}0D` : "rgba(212,160,76,0.05)",
        color:       "var(--muted-foreground)",
      }}
      role="note"
      aria-label="Translation note"
    >
      <span
        aria-hidden
        className="mt-0.5 inline-block size-1.5 shrink-0 rounded-full"
        style={{ background: accentColor ?? "var(--tome-accent)" }}
      />
      <span>{COMMEDIA_TRANSLATION_NOTE}</span>
    </div>
  )
}
