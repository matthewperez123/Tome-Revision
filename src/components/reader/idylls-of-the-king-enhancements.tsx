"use client"

/**
 * IdyllsOfTheKingEnhancements — scholarly apparatus chrome for
 * Tennyson's Idylls of the King (1891 Macmillan collected edition,
 * 12 idylls + Dedication + "To the Queen," English blank verse).
 *
 * Renders, between the chapter H1 and the verse body:
 *   1. A per-idyll header block: Roman numeral (idylls only), one-
 *      sentence scholarly argument, an emotional-register line for
 *      cycle-arc orientation, and Tennyson's opening as epigraph.
 *   2. An edition note.
 *   3. Three togglable panels: speaker palette legend, the Malory-
 *      source tracker (Part 3A — the signature pedagogical feature
 *      tracking Tennyson's interventions against his primary Malory
 *      and Mabinogion sources), and the cycle-arc sidebar (Part 3C —
 *      showing all twelve idylls in reading order with emotional
 *      registers so the non-linear cycle's downward curve is legible).
 *
 * Per-line speaker color-coding is baked into the HTML by
 * scripts/idylls/transform-book.ts as `data-iotk-speaker` attributes
 * and styled via CSS in src/styles/tome.css. Line numbers are
 * rendered from `data-iotk-line-mark` on every 5th line.
 *
 * Only active for `bookId === "idylls-of-the-king"`.
 */

import { useEffect, useState } from "react"
import { IDYLL_METADATA, FRAMING_UNITS } from "@/data/idylls-of-the-king/book-metadata"
import { LEGEND_GROUPS, IDYLLS_OF_THE_KING_SPEAKERS } from "@/data/idylls-of-the-king/speakers"
import { IDYLL_MALORY_SOURCES } from "@/data/idylls-of-the-king/malory-sources"
import { PROSODY_BY_CHAPTER, PROSODY_PASSAGES } from "@/data/idylls-of-the-king/prosody-passages"
import { VICTORIAN_CONTEXT } from "@/data/idylls-of-the-king/victorian-context"

const LS_PROSODY = "iotk:showProsody"

// Alliteration-key: returns a canonical start-consonant cluster for
// alliteration matching. Tennyson isn't writing alliterative verse,
// so we use a slightly stricter threshold than Beowulf (3+ per line
// instead of 2+) to reserve the decoration for genuine sound-peaks.
function alliterationKey(word: string): string {
  const w = word.replace(/^[^A-Za-z]+/, "").toLowerCase()
  if (!w) return ""
  const ch = w[0]
  if (!/[bcdfghjklmnpqrstvwxyz]/.test(ch)) return "" // vowels don't alliterate
  // Distinguish sp/st/sc/sk/sh/th/ch/wh clusters that listeners hear
  // as a unit.
  const head2 = w.slice(0, 2)
  if (["sp", "st", "sc", "sk", "sh", "th", "ch", "wh"].includes(head2)) {
    return head2
  }
  return ch
}

function markAlliterationInLine(span: HTMLElement): void {
  if (span.querySelector("[data-iotk-allit]")) return // idempotent
  const walker = document.createTreeWalker(span, NodeFilter.SHOW_TEXT, null)
  const textNodes: Text[] = []
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    textNodes.push(n as Text)
  }
  const fullText = textNodes.map((t) => t.nodeValue).join("")
  const words = fullText.split(/(\s+)/)
  const keyCounts = new Map<string, number>()
  for (const w of words) {
    const k = alliterationKey(w)
    if (k) keyCounts.set(k, (keyCounts.get(k) ?? 0) + 1)
  }
  // Tennyson threshold: 3+ occurrences.
  let dominant = ""
  let best = 2
  for (const [k, c] of keyCounts) {
    if (c > best) {
      best = c
      dominant = k
    }
  }
  if (!dominant) return
  for (const tn of textNodes) {
    const txt = tn.nodeValue ?? ""
    if (!txt) continue
    const parts = txt.split(/(\s+)/)
    if (!parts.some((p) => alliterationKey(p) === dominant)) continue
    const frag = document.createDocumentFragment()
    for (const p of parts) {
      const k = alliterationKey(p)
      if (k === dominant) {
        const em = document.createElement("em")
        em.setAttribute("data-iotk-allit", dominant)
        em.textContent = p
        frag.appendChild(em)
      } else {
        frag.appendChild(document.createTextNode(p))
      }
    }
    tn.parentNode?.replaceChild(frag, tn)
  }
}

function markAlliteration(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>("[data-iotk-line]").forEach(markAlliterationInLine)
}

function unmarkAlliteration(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>("em[data-iotk-allit]").forEach((em) => {
    const text = document.createTextNode(em.textContent ?? "")
    em.parentNode?.replaceChild(text, em)
  })
  root.querySelectorAll<HTMLElement>("[data-iotk-line]").forEach((ln) => {
    ln.normalize()
  })
}

function markProsodyPassages(root: HTMLElement, chapterIndex: number): void {
  const passages = PROSODY_BY_CHAPTER.get(chapterIndex) ?? []
  for (const p of passages) {
    for (let i = p.fromLine; i <= p.toLine; i++) {
      const span = root.querySelector<HTMLElement>(`[data-iotk-line="${i}"]`)
      if (span) {
        span.setAttribute("data-iotk-prosody-passage", p.technique)
      }
    }
  }
}

function unmarkProsodyPassages(root: HTMLElement): void {
  root
    .querySelectorAll<HTMLElement>("[data-iotk-prosody-passage]")
    .forEach((el) => el.removeAttribute("data-iotk-prosody-passage"))
}

interface IdyllsOfTheKingEnhancementsProps {
  bookId: string
  currentChapter: number
  /** Optional — provided by the reader page so the cycle-arc sidebar
   *  can navigate between idylls. If absent, the sidebar renders as
   *  plain labels. */
  onNavigateToChapter?: (chapterIndex: number) => void
}

type OpenPanel = "none" | "palette" | "sources" | "cycle" | "prosody"

const SOURCE_LABEL: Record<string, string> = {
  "malory-morte-darthur": "Malory · Le Morte d'Arthur",
  "mabinogion": "The Mabinogion · trans. Lady Charlotte Guest",
  "mixed": "Mixed sources",
  "tennyson-invention": "Tennyson's invention",
}

export function IdyllsOfTheKingEnhancements({
  bookId,
  currentChapter,
  onNavigateToChapter,
}: IdyllsOfTheKingEnhancementsProps) {
  const [openPanel, setOpenPanel] = useState<OpenPanel>("none")
  const [prosodyOn, setProsodyOn] = useState(false)
  const [vcOpen, setVcOpen] = useState(false)

  // Hydrate prosody toggle from localStorage.
  useEffect(() => {
    if (typeof window === "undefined") return
    setProsodyOn(window.localStorage.getItem(LS_PROSODY) === "1")
  }, [])

  // Apply / remove prosody decorations on the reader text root.
  useEffect(() => {
    if (bookId !== "idylls-of-the-king") return
    const root = document.querySelector<HTMLElement>("[data-reader-text]")
    if (!root) return
    if (prosodyOn) {
      root.setAttribute("data-iotk-prosody", "1")
      markAlliteration(root)
      markProsodyPassages(root, currentChapter)
    } else {
      root.removeAttribute("data-iotk-prosody")
      unmarkAlliteration(root)
      unmarkProsodyPassages(root)
    }
  }, [bookId, currentChapter, prosodyOn])

  if (bookId !== "idylls-of-the-king") return null

  const meta = IDYLL_METADATA[currentChapter]
  if (!meta) return null

  const isFraming = FRAMING_UNITS.has(currentChapter)
  const source = IDYLL_MALORY_SOURCES[currentChapter]
  const victorianContext = VICTORIAN_CONTEXT[currentChapter]

  // Pre-group speakers for the palette legend.
  const speakersByGroup = new Map<string, typeof IDYLLS_OF_THE_KING_SPEAKERS>()
  for (const s of IDYLLS_OF_THE_KING_SPEAKERS) {
    const arr = speakersByGroup.get(s.group) ?? []
    arr.push(s)
    speakersByGroup.set(s.group, arr)
  }

  function toggle(panel: OpenPanel) {
    setOpenPanel((p) => (p === panel ? "none" : panel))
  }

  return (
    <div className="mt-3 mb-5">
      {/* ── Idyll header: Roman numeral + argument + opening epigraph ── */}
      <div
        className="pb-3 mb-3"
        style={{
          borderBottom: "1px solid color-mix(in srgb, currentColor 10%, transparent)",
        }}
      >
        <div
          className="flex items-baseline gap-3 mb-2 flex-wrap"
          style={{ fontVariant: "small-caps", letterSpacing: "0.03em" }}
        >
          {meta.roman && (
            <span
              className="font-serif text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              Idyll {meta.roman}
            </span>
          )}
          {isFraming && (
            <span
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--muted-foreground)" }}
            >
              Framing verse
            </span>
          )}
          <span
            className="text-xs italic"
            style={{ color: "var(--muted-foreground)" }}
          >
            {meta.emotionalRegister}
          </span>
          <span
            className="text-xs"
            style={{ color: "var(--muted-foreground)", opacity: 0.7 }}
          >
            · composed {meta.compositionYear}
          </span>
        </div>

        <p
          className="text-sm italic"
          style={{
            color: "var(--muted-foreground)",
            lineHeight: 1.6,
            marginBottom: "0.9em",
          }}
        >
          {meta.argument}
        </p>

        <blockquote
          className="text-sm"
          style={{
            fontStyle: "italic",
            color: "color-mix(in srgb, currentColor 70%, transparent)",
            borderLeft: "2px solid color-mix(in srgb, currentColor 20%, transparent)",
            paddingLeft: "1em",
            marginLeft: 0,
            lineHeight: 1.7,
            whiteSpace: "pre-line",
          }}
        >
          {meta.opening.replace(/ \/ /g, "\n")}
        </blockquote>

        {victorianContext && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setVcOpen((v) => !v)}
              className="text-xs underline underline-offset-2 decoration-dotted hover:opacity-80"
              style={{ color: "var(--tome-accent)" }}
              aria-expanded={vcOpen}
            >
              {vcOpen ? "Hide Victorian context" : "Victorian context"}
            </button>
            {vcOpen && (
              <div
                className="mt-2 text-xs rounded border p-3"
                style={{
                  borderColor: "color-mix(in srgb, currentColor 15%, transparent)",
                  background: "color-mix(in srgb, var(--tome-accent) 3%, transparent)",
                  lineHeight: 1.65,
                }}
              >
                <div
                  className="uppercase tracking-wider mb-1"
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--muted-foreground)",
                    letterSpacing: "0.08em",
                  }}
                >
                  Orientation — not annotation
                </div>
                <div className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                  {victorianContext.title}
                </div>
                <p>{victorianContext.body}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Edition note + panel toggles ────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs mb-2"
        style={{ color: "var(--muted-foreground)" }}
      >
        <span>
          Tennyson's <em>Idylls of the King</em> — 1891 Macmillan collected
          edition. English blank verse, composed 1833–1885.
        </span>
        <button
          type="button"
          onClick={() => toggle("palette")}
          className="underline underline-offset-2 decoration-dotted hover:opacity-80"
          style={{ color: "var(--tome-accent)" }}
        >
          {openPanel === "palette" ? "Hide palette" : "Show palette"}
        </button>
        {source && (
          <button
            type="button"
            onClick={() => toggle("sources")}
            className="underline underline-offset-2 decoration-dotted hover:opacity-80"
            style={{ color: "var(--tome-accent)" }}
          >
            {openPanel === "sources" ? "Hide sources" : "Sources"}
          </button>
        )}
        <button
          type="button"
          onClick={() => toggle("cycle")}
          className="underline underline-offset-2 decoration-dotted hover:opacity-80"
          style={{ color: "var(--tome-accent)" }}
        >
          {openPanel === "cycle" ? "Hide cycle arc" : "Cycle arc"}
        </button>
        <button
          type="button"
          onClick={() => toggle("prosody")}
          className="underline underline-offset-2 decoration-dotted hover:opacity-80"
          style={{ color: "var(--tome-accent)" }}
          aria-pressed={prosodyOn}
        >
          {openPanel === "prosody" ? "Hide sound" : "Sound"}
        </button>
      </div>

      {/* ── Palette legend panel ────────────────────────────────────── */}
      {openPanel === "palette" && (
        <div
          className="text-xs rounded border p-3 mb-2"
          style={{
            borderColor: "color-mix(in srgb, currentColor 15%, transparent)",
            background: "color-mix(in srgb, var(--tome-accent) 3%, transparent)",
            lineHeight: 1.7,
          }}
        >
          {LEGEND_GROUPS.map((grp) => {
            const group = speakersByGroup.get(grp.id) ?? []
            if (group.length === 0) return null
            return (
              <div key={grp.id} className="mb-2 last:mb-0">
                <div className="mb-1">
                  <span
                    className="font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {grp.label}
                  </span>
                  <span className="ml-2" style={{ color: "var(--muted-foreground)" }}>
                    — {grp.note}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {group.map((s) => (
                    <span
                      key={s.id}
                      style={{ color: s.color }}
                      className="whitespace-nowrap"
                      title={s.note ?? s.name}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
          <div
            className="mt-2 pt-2 italic"
            style={{
              color: "var(--muted-foreground)",
              borderTop: "1px dotted color-mix(in srgb, currentColor 15%, transparent)",
            }}
          >
            Speaker colors for Arthur, Guinevere, Lancelot, Vivien, Merlin, and
            the rest attach to specific speeches in a later pass; the full
            cycle currently renders in the narrator's heathered-gold.
          </div>
        </div>
      )}

      {/* ── Malory-source tracker panel (Part 3A) ───────────────────── */}
      {openPanel === "sources" && source && (
        <div
          className="text-xs rounded border p-3 mb-2"
          style={{
            borderColor: "color-mix(in srgb, currentColor 15%, transparent)",
            background: "color-mix(in srgb, var(--tome-accent) 3%, transparent)",
            lineHeight: 1.65,
          }}
        >
          <div className="mb-3">
            <div
              className="uppercase tracking-wider mb-1"
              style={{
                fontSize: "0.7rem",
                color: "var(--muted-foreground)",
                letterSpacing: "0.08em",
              }}
            >
              Primary source
            </div>
            <div className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>
              {SOURCE_LABEL[source.primarySource] ?? source.primarySource}
            </div>
            <div style={{ color: "var(--muted-foreground)" }} className="mb-1">
              <em>{source.primarySourceRef}</em>
            </div>
            <p style={{ color: "var(--muted-foreground)" }}>
              {source.primarySourceNote}
            </p>
          </div>

          {source.departures.length > 0 && (
            <div>
              <div
                className="uppercase tracking-wider mb-2"
                style={{
                  fontSize: "0.7rem",
                  color: "var(--muted-foreground)",
                  letterSpacing: "0.08em",
                }}
              >
                Tennyson's key departures ({source.departures.length})
              </div>
              <ol
                className="space-y-3"
                style={{ counterReset: "departure" }}
              >
                {source.departures.map((d, i) => (
                  <li
                    key={i}
                    className="pl-3"
                    style={{
                      borderLeft: "2px solid color-mix(in srgb, var(--tome-accent) 30%, transparent)",
                    }}
                  >
                    <div
                      className="font-semibold mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      {d.topic}
                      {d.tennysonLines && (
                        <span
                          className="ml-2"
                          style={{
                            color: "var(--muted-foreground)",
                            fontWeight: 400,
                            fontSize: "0.92em",
                          }}
                        >
                          (lines {d.tennysonLines})
                        </span>
                      )}
                    </div>
                    <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: "max-content 1fr", columnGap: "0.65rem" }}>
                      <span
                        style={{
                          color: "var(--muted-foreground)",
                          fontVariant: "small-caps",
                          letterSpacing: "0.03em",
                          fontSize: "0.72rem",
                          paddingTop: "0.15rem",
                        }}
                      >
                        Malory
                      </span>
                      <div>
                        <span>{d.malorySource}</span>
                        <span
                          className="ml-1"
                          style={{
                            color: "var(--muted-foreground)",
                            fontStyle: "italic",
                          }}
                        >
                          — {d.malorySourceRef}
                        </span>
                      </div>
                      <span
                        style={{
                          color: "var(--muted-foreground)",
                          fontVariant: "small-caps",
                          letterSpacing: "0.03em",
                          fontSize: "0.72rem",
                          paddingTop: "0.15rem",
                        }}
                      >
                        Tennyson
                      </span>
                      <span>{d.tennysonVersion}</span>
                    </div>
                    <div
                      style={{ color: "var(--muted-foreground)" }}
                      className="italic"
                    >
                      <span
                        style={{
                          fontVariant: "small-caps",
                          letterSpacing: "0.03em",
                          fontSize: "0.72rem",
                          fontStyle: "normal",
                          marginRight: "0.3rem",
                        }}
                      >
                        Significance
                      </span>
                      {d.significance}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div
            className="mt-3 pt-2 italic"
            style={{
              color: "var(--muted-foreground)",
              borderTop: "1px dotted color-mix(in srgb, currentColor 15%, transparent)",
              fontSize: "0.72rem",
            }}
          >
            When <em>Le Morte d'Arthur</em> is added to the Tome catalog, the
            Malory references above will become clickable cross-references to
            the specific Caxton book-and-chapter passages. Until then they are
            reference text.
          </div>
        </div>
      )}

      {/* ── Cycle-arc sidebar panel (Part 3C) ───────────────────────── */}
      {openPanel === "cycle" && (
        <div
          className="text-xs rounded border p-3 mb-2"
          style={{
            borderColor: "color-mix(in srgb, currentColor 15%, transparent)",
            background: "color-mix(in srgb, var(--tome-accent) 3%, transparent)",
          }}
        >
          <div
            className="uppercase tracking-wider mb-2"
            style={{
              fontSize: "0.7rem",
              color: "var(--muted-foreground)",
              letterSpacing: "0.08em",
            }}
          >
            The cycle arc — hope to catastrophe
          </div>
          <p
            className="mb-3"
            style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}
          >
            Tennyson wrote the twelve idylls out of order across half a century
            (1833–1885) and assembled them late. The reading order traces a
            downward curve from the kingdom's dawn to its fall; this is the
            sequence Tennyson fixed for the 1891 collected edition.
          </p>
          <ol className="space-y-0.5">
            {Object.values(IDYLL_METADATA).map((m) => {
              const isCurrent = m.chapterIndex === currentChapter
              const isFramingRow = FRAMING_UNITS.has(m.chapterIndex)
              const body = (
                <div
                  className="grid gap-2 py-1 px-1.5 rounded"
                  style={{
                    gridTemplateColumns: "2rem 1fr auto",
                    alignItems: "baseline",
                    background: isCurrent
                      ? "color-mix(in srgb, var(--tome-accent) 12%, transparent)"
                      : "transparent",
                  }}
                >
                  <span
                    className="text-right"
                    style={{
                      color: "var(--muted-foreground)",
                      fontFamily: "var(--font-serif, serif)",
                      fontSize: "0.72rem",
                    }}
                  >
                    {m.roman ?? (isFramingRow ? "—" : "")}
                  </span>
                  <span>
                    <span
                      className="font-semibold"
                      style={{
                        color: isCurrent ? "var(--foreground)" : "inherit",
                      }}
                    >
                      {m.title}
                    </span>
                    {isFramingRow && (
                      <span
                        className="ml-2 text-xs uppercase tracking-wider"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        framing
                      </span>
                    )}
                    <span
                      className="ml-2 italic"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      — {m.emotionalRegister}
                    </span>
                  </span>
                  <span
                    style={{
                      color: "var(--muted-foreground)",
                      fontSize: "0.68rem",
                      opacity: 0.6,
                    }}
                  >
                    {m.compositionYear}
                  </span>
                </div>
              )
              return (
                <li key={m.chapterIndex}>
                  {onNavigateToChapter && !isCurrent ? (
                    <button
                      type="button"
                      onClick={() => onNavigateToChapter(m.chapterIndex)}
                      className="block w-full text-left hover:opacity-90 transition-opacity"
                    >
                      {body}
                    </button>
                  ) : (
                    body
                  )}
                </li>
              )
            })}
          </ol>
          <div
            className="mt-3 pt-2 italic"
            style={{
              color: "var(--muted-foreground)",
              borderTop: "1px dotted color-mix(in srgb, currentColor 15%, transparent)",
              fontSize: "0.72rem",
            }}
          >
            Composition-year column reveals the cycle's non-linear genesis —
            the closing "Passing of Arthur" (1869) contains the oldest
            material in the cycle, Tennyson's 1833 "Morte d'Arthur," wrapped in
            later writing. The poet spent fifty-two years writing toward his
            own earliest vision.
          </div>
        </div>
      )}

      {/* ── Prosody panel (Part 3B) ─────────────────────────────────── */}
      {openPanel === "prosody" && (
        <div
          className="text-xs rounded border p-3 mb-2"
          style={{
            borderColor: "color-mix(in srgb, currentColor 15%, transparent)",
            background: "color-mix(in srgb, var(--tome-accent) 3%, transparent)",
          }}
        >
          <div
            className="uppercase tracking-wider mb-2"
            style={{
              fontSize: "0.7rem",
              color: "var(--muted-foreground)",
              letterSpacing: "0.08em",
            }}
          >
            Prosody — show Tennyson's sound
          </div>
          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={prosodyOn}
              onChange={(e) => {
                const next = e.target.checked
                setProsodyOn(next)
                if (typeof window !== "undefined") {
                  window.localStorage.setItem(LS_PROSODY, next ? "1" : "0")
                }
              }}
              style={{ accentColor: "var(--tome-accent)" }}
            />
            <span>
              Highlight alliteration (3+ matches per line) and mark curated
              sound-rich passages
            </span>
          </label>

          <p
            className="mb-3 italic"
            style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}
          >
            Tennyson doesn't write alliterative verse — he uses alliteration as
            texturing. The decoration is deliberately light; sound-annotations
            are reserved for roughly fifteen passages across the cycle where
            the sound-effect is unusually concentrated.
          </p>

          <div
            className="uppercase tracking-wider mb-1"
            style={{
              fontSize: "0.7rem",
              color: "var(--muted-foreground)",
              letterSpacing: "0.08em",
            }}
          >
            Curated sound-rich passages ({PROSODY_PASSAGES.length} across the cycle)
          </div>
          <ul className="space-y-1">
            {PROSODY_PASSAGES.filter((p) => p.chapterIndex === currentChapter).map((p, i) => (
              <li
                key={i}
                className="grid gap-2"
                style={{ gridTemplateColumns: "5.5rem 1fr" }}
              >
                <span
                  className="text-right"
                  style={{
                    color: "var(--muted-foreground)",
                    fontVariant: "small-caps",
                    letterSpacing: "0.04em",
                    fontSize: "0.72rem",
                    paddingTop: "0.15rem",
                  }}
                >
                  {p.fromLine}–{p.toLine}
                </span>
                <span>
                  <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                    {p.technique}
                  </span>
                  <span className="ml-2" style={{ color: "var(--muted-foreground)" }}>
                    {p.note}
                  </span>
                </span>
              </li>
            ))}
            {PROSODY_BY_CHAPTER.get(currentChapter) === undefined && (
              <li style={{ color: "var(--muted-foreground)" }} className="italic">
                No curated passages in this idyll — the cycle's most
                concentrated sound-effects cluster in Gareth, Merlin, Lancelot,
                the Grail, the Last Tournament, Guinevere, and the Passing of
                Arthur. Open the Cycle arc panel to navigate.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
