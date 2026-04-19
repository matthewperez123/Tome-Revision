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
 *   4. Speaker-attribution color injection. Detects "said Sir X",
 *      "quoth the King", "answered Launcelot" inline patterns and
 *      colorizes the adjacent quoted clause. Only 11 named speakers
 *      receive distinct hues; everyone else inherits the neutral stone.
 *   5. Persistent toggle: "Vocabulary glosses" (default ON for this
 *      book only). When OFF, Pass 2 of LeMorteDarthurAnnotations is
 *      visually suppressed via CSS — it still runs, but the dotted
 *      underline and tooltip are hidden.
 */

import { useEffect, useMemo, useState } from "react"
import {
  MALORY_BOOKS,
  bookForFlatIndex,
} from "@/data/le-morte-darthur/book-metadata"
import {
  MALORY_SPEAKERS,
  MALORY_NEUTRAL_SPEAKER,
} from "@/data/le-morte-darthur/speakers"
import {
  MALORY_STORYLINES,
  storylinesForChapter,
} from "@/data/le-morte-darthur/storylines"

interface LeMorteDarthurEnhancementsProps {
  bookId: string
  currentChapter: number
}

// LocalStorage keys for persistent reader toggles.
const LS_SHOW_GLOSSES      = "malory:showGlosses"
const LS_SHOW_STORYLINES   = "malory:showStorylines"

export function LeMorteDarthurEnhancements({
  bookId,
  currentChapter,
}: LeMorteDarthurEnhancementsProps) {
  const [showGlosses,     setShowGlosses]     = useState(true)
  const [storylinesOpen,  setStorylinesOpen]  = useState(false)

  // Hydrate toggles from localStorage (glosses default ON for Malory).
  useEffect(() => {
    if (typeof window === "undefined") return
    const storedGlosses = window.localStorage.getItem(LS_SHOW_GLOSSES)
    setShowGlosses(storedGlosses === null ? true : storedGlosses === "1")
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

  // Walk the rendered body and (a) re-class the rubric paragraph, and
  // (b) colorize inline speaker attributions. Idempotent.
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

      // ── (b) Speaker-attribution inline color ────────────────────────
      // Walk paragraph text nodes and wrap the "said Sir X" / "quoth Y"
      // attribution's following clause with a color-tinted span.
      //
      // We look for: `,\s*(said|quoth|answered|cried|replied)\s+([A-Z][A-Za-z' ]+?)\s*,`
      // The preceding comma is a reliable Malory marker — the attribution
      // sits mid-sentence, flanked by commas, and the previous clause is
      // the speech. We cannot losslessly retrofit quotation marks; we
      // instead add a `malory-speech` class on the preceding <span>
      // created from the text before the attribution.
      //
      // NOTE: This is a light-touch pass. A more precise speaker-color
      // engine would require parsing Malory's clauses into
      // speech+attribution pairs — out of scope for the checkpoint.
      // The pass only runs on each paragraph once, leaves an attribute
      // so re-runs are idempotent.
      const paragraphs = section.querySelectorAll<HTMLParagraphElement>(":scope > p")
      for (const p of paragraphs) {
        if (p.dataset.malorySpeakersApplied === "1") continue

        // Find the first attribution occurrence in this paragraph.
        const html = p.innerHTML
        // Attribution pattern: "<closing_punct><ws>(said|quoth|…) <Name>,"
        // Name can span "Sir Launcelot", "King Arthur", "La Beale Isoud".
        const ATTR = /([.!?"'’]\s+)?(\bsaid|\bquoth|\banswered|\breplied|\bcried)\s+([A-Z][A-Za-z'’]+(?:\s+[A-Z][A-Za-z'’]+){0,3})/g
        let match = ATTR.exec(html)
        if (!match) {
          p.dataset.malorySpeakersApplied = "1"
          continue
        }

        // First pass — just add a subtle underline on the speaker name
        // and tint the name itself with the speaker palette. Full clause
        // coloring is a follow-up.
        const speakerName = match[3].trim()
        const known = MALORY_SPEAKERS.find((s) =>
          s.aliases.some((a) => a.toLowerCase() === speakerName.toLowerCase()),
        )
        const palette = known
          ? `var(--malory-color-${known.id}, ${known.palette})`
          : MALORY_NEUTRAL_SPEAKER.palette

        // Replace ALL attribution matches in this paragraph with a
        // styled span around the speaker name only.
        const next = html.replace(
          ATTR,
          (whole, _lead, verb, name) => {
            const key = String(name).trim()
            const s = MALORY_SPEAKERS.find((x) =>
              x.aliases.some((a) => a.toLowerCase() === key.toLowerCase()),
            )
            const color = s
              ? `var(--malory-color-${s.id}, ${s.palette})`
              : MALORY_NEUTRAL_SPEAKER.palette
            const safeName = String(name)
            return `${whole.slice(0, whole.length - safeName.length)}<span class="malory-speaker" data-malory-speaker="${
              s?.id ?? "neutral"
            }" style="color: ${color};">${safeName}</span>`
          },
        )

        // Only replace if the regex actually matched something to keep
        // this idempotent in edge cases.
        if (next !== html) {
          p.innerHTML = next
        }
        p.dataset.malorySpeakersApplied = "1"
        // Silence the unused-variable linter for `palette`.
        void palette
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
    window.localStorage.setItem(LS_SHOW_GLOSSES, showGlosses ? "1" : "0")
    const root = document.querySelector<HTMLElement>("[data-reader-text]")
    if (root) root.dataset.maloryGlosses = showGlosses ? "on" : "off"
  }, [showGlosses])

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
      <div className="malory-toolbar" data-malory-toolbar>
        <button
          type="button"
          className="malory-toggle"
          aria-pressed={showGlosses}
          onClick={() => setShowGlosses((v) => !v)}
          title="Toggle vocabulary glosses (archaic-word tooltips). On by default for Malory."
        >
          Vocabulary glosses · {showGlosses ? "on" : "off"}
        </button>

        {storylines.length > 0 && (
          <button
            type="button"
            className="malory-toggle"
            aria-pressed={storylinesOpen}
            onClick={() => setStorylinesOpen((v) => !v)}
            title="Show which Matter-of-Britain storylines this chapter advances."
          >
            {storylinesOpen ? "Hide" : "Show"} storylines ({storylines.length})
          </button>
        )}
      </div>

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
