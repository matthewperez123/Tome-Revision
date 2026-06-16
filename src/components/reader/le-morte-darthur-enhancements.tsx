"use client"

/**
 * LeMorteDarthurEnhancements — scholarly apparatus for Thomas Malory's
 * Le Morte d'Arthur (Caxton 1485 via Standard Ebooks / Pollard).
 *
 * Modeled on OrlandoFuriosoEnhancements (which already carries a
 * Storyline Tracker) and on IdyllsOfTheKingEnhancements (which handles
 * Arthurian speaker colors and chapter headers).
 *
 * Only active for `bookId === "le-morte-darthur"`. Silently no-ops
 * otherwise.
 *
 * Features:
 *   1. Argumentum header treatment. SE emits each body chapter as
 *      <section data-parent="book-N" id="chapter-B-C"><header><h3>…</h3>
 *      <p>rubric…</p></header>. The rubric paragraph is re-classed so
 *      tome.css can render it as the small italic epigraph the spec
 *      calls for.
 *   2. Book-opening orientation banner. For the first chapter of each
 *      Caxton book, the editorial orientation note (when present) is
 *      rendered above the prose. Especially load-bearing at Book VIII
 *      (the Tristram digression begins) and Book XIII (Grail opens).
 *   3. Storylines sidebar — the seven Matter-of-Britain arcs with
 *      curated pivot summaries per chapter. Adapted from Orlando
 *      Furioso. Load-bearing for Books VIII–XII.
 */

import { useEffect, useMemo, useState } from "react"
import {
  MALORY_BOOKS,
  bookForFlatIndex,
} from "@/data/le-morte-darthur/book-metadata"
import {
  MALORY_STORYLINES,
  storylinesForChapter,
} from "@/data/le-morte-darthur/storylines"

interface LeMorteDarthurEnhancementsProps {
  bookId: string
  currentChapter: number
}

// LocalStorage keys for persistent reader toggles.
const LS_SHOW_STORYLINES   = "malory:showStorylines"

export function LeMorteDarthurEnhancements({
  bookId,
  currentChapter,
}: LeMorteDarthurEnhancementsProps) {
  const [storylinesOpen,  setStorylinesOpen]  = useState(false)

  // Hydrate toggles from localStorage.
  useEffect(() => {
    if (typeof window === "undefined") return
    setStorylinesOpen(window.localStorage.getItem(LS_SHOW_STORYLINES) === "1")
  }, [])

  const book = useMemo(
    () => (bookId === "le-morte-darthur" ? bookForFlatIndex(currentChapter) : null),
    [bookId, currentChapter],
  )

  const storylines = useMemo(
    () => (bookId === "le-morte-darthur" ? storylinesForChapter(currentChapter) : []),
    [bookId, currentChapter],
  )

  // Walk the rendered body and re-class the rubric paragraph. Idempotent.
  useEffect(() => {
    if (bookId !== "le-morte-darthur") return

    let cancelled = false

    function decorate(): boolean {
      if (cancelled) return true
      const root = document.querySelector<HTMLElement>("[data-reader-text]")
      if (!root) return false

      const section = root.querySelector<HTMLElement>(`section[data-parent^="book-"]`)
      if (!section) return false

      // ── (a) Rubric / argumentum styling ─────────────────────────────
      const header = section.querySelector(":scope > header")
      if (header) {
        header.classList.add("malory-chapter-header")
        const rubric = header.querySelector("p")
        if (rubric) {
          rubric.classList.add("malory-argumentum")
        }
        const h3 = header.querySelector("h3")
        if (h3) h3.classList.add("malory-chapter-number")
      }

      return true
    }

    let attempts = 0
    const tick = () => {
      if (decorate()) return
      attempts += 1
      if (attempts > 20) return
      setTimeout(tick, 60)
    }
    tick()

    return () => { cancelled = true }
  }, [bookId, currentChapter])

  // Persist toggle changes.
  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(LS_SHOW_STORYLINES, storylinesOpen ? "1" : "0")
  }, [storylinesOpen])

  // ── Render (null until on Malory; tiny chrome above the text) ──────
  if (bookId !== "le-morte-darthur") return null

  const isBookOpener = book && book.firstFlatIndex === currentChapter
  const orientation = isBookOpener ? book?.orientation : null

  return (
    <>
      {/* Orientation banner on the first chapter of each book, when set. */}
      {orientation && book && (
        <aside
          role="note"
          aria-label={`Orientation for Book ${book.romanNumeral}`}
          className="malory-orientation"
          data-malory-book={book.bookNumber}
        >
          <strong>Book {book.romanNumeral} — {book.subject}.</strong>
          <p>{orientation}</p>
        </aside>
      )}

      {/* Reader-chrome toggle row. */}
      {storylines.length > 0 && (
        <div className="malory-toolbar" data-malory-toolbar>
          <button
            type="button"
            className="malory-toggle"
            aria-pressed={storylinesOpen}
            onClick={() => setStorylinesOpen((v) => !v)}
            title="Show which Matter-of-Britain storylines this chapter advances."
          >
            {storylinesOpen ? "Hide" : "Show"} storylines ({storylines.length})
          </button>
        </div>
      )}

      {/* Storyline sidebar — the load-bearing Tristram/Grail helper. */}
      {storylinesOpen && storylines.length > 0 && (
        <aside
          role="complementary"
          aria-label="Storylines active in this chapter"
          className="malory-storylines"
          data-malory-storylines
        >
          <h4>Storylines active here</h4>
          <ul>
            {storylines.map(({ storyline, appearance }) => (
              <li key={storyline.id} className="malory-storyline-item">
                <div
                  className="malory-storyline-label"
                  style={{ color: storyline.palette }}
                >
                  {storyline.label}.
                </div>
                {appearance ? (
                  <div className={appearance.pivot ? "malory-storyline-pivot" : "malory-storyline-beat"}>
                    {appearance.pivot && <span className="malory-pivot-mark" aria-hidden>●</span>}
                    {appearance.summary}
                  </div>
                ) : (
                  <div className="malory-storyline-span-note">
                    {storyline.spans.find(
                      (sp) => currentChapter >= sp.from && currentChapter <= sp.to,
                    )?.throughline ?? "This thread is currently active."}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <footer className="malory-storylines-footer">
            <span>
              {MALORY_STORYLINES.length} storylines total across the work.
              Book {book?.romanNumeral ?? "—"}, Ch. {book ? currentChapter - book.firstFlatIndex + 1 : "—"}.
            </span>
          </footer>
        </aside>
      )}
    </>
  )
}
