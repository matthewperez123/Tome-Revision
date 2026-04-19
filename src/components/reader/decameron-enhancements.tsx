"use client"

/**
 * DecameronEnhancements — scholarly apparatus chrome for Boccaccio's
 * *Decameron* in John Payne's 1886 English (Standard Ebooks edition).
 *
 * Renders, between the chapter H1 and the prose body:
 *   1. A chapter-kind-aware header block:
 *        • "proem"               — amber author-voice register.
 *        • "plague-intro"        — muted, desaturated "Florence, 1348" register.
 *        • "day-intro"           — day number (Roman), governor+color, theme, mood epigraph.
 *        • "author-intervention" — amber "B." register for Day IV Introduction.
 *        • "tale"                — narrator badge in signature color; Day/Tale label; rubric subtitle.
 *        • "author-conclusion"   — amber author-voice register.
 *        • "glossary"            — plain.
 *   2. A Narrator Tracker (collapsible sidebar-style panel) showing for
 *      any chapter inside the ten days: day number, theme, governor,
 *      current narrator (if a tale), and a 10-slot row coloring the tales
 *      already heard today.
 *   3. A vocabulary-gloss decoration pass over the rendered HTML (like
 *      the Commedia / Idylls glosses): matches DECAMERON_GLOSSES phrases
 *      inside [data-reader-text] and wraps them with tooltip markup.
 *
 * Only active for `bookId === "the-decameron"`. Silently no-ops otherwise.
 */

import { useEffect, useState } from "react"
import {
  getChapterMetadata,
  isAuthorIntervention,
  toRoman,
} from "@/data/the-decameron/chapter-metadata"
import { BRIGATA, AUTHOR_VOICE_ID, getVoiceColor, getVoiceLabel } from "@/data/the-decameron/brigata"
import { DAYS, dayForChapter } from "@/data/the-decameron/days"
import { talesForDay } from "@/data/the-decameron/tales"
import { DECAMERON_GLOSSES } from "@/lib/virgil/decameron-glosses"

interface DecameronEnhancementsProps {
  bookId: string
  currentChapter: number
}

// Amber used for Boccaccio-as-author register (Proem, IV Intro, Conclusion).
const AUTHOR_AMBER        = "#B45309"
const AUTHOR_AMBER_BG     = "rgba(245, 158, 11, 0.08)" // subtle tint
// Muted palette for the plague introduction.
const PLAGUE_MUTED        = "#4B5563"
const PLAGUE_MUTED_BG     = "rgba(75, 85, 99, 0.06)"

const LS_TRACKER_OPEN = "decameron:trackerOpen"
const LS_GLOSSES      = "decameron:glossesOn"

export function DecameronEnhancements({
  bookId,
  currentChapter,
}: DecameronEnhancementsProps) {
  const [trackerOpen, setTrackerOpen] = useState(false)
  const [glossesOn,   setGlossesOn]   = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return
    const t = window.localStorage.getItem(LS_TRACKER_OPEN)
    if (t !== null) setTrackerOpen(t === "1")
    const g = window.localStorage.getItem(LS_GLOSSES)
    if (g !== null) setGlossesOn(g === "1")
  }, [])

  // Gloss decoration pass over the rendered prose. Wait for the
  // chapter HTML (injected via dangerouslySetInnerHTML by the paginated
  // reader) to be present, then wrap matching phrases with a tooltip
  // span. Scoped with a data-dec-gloss attribute so repeat passes are
  // idempotent.
  useEffect(() => {
    if (bookId !== "the-decameron") return
    if (!glossesOn) {
      // Strip any existing gloss wrappers on toggle-off.
      const root = document.querySelector<HTMLElement>("[data-reader-text]")
      if (root) {
        root.querySelectorAll("span[data-dec-gloss]").forEach((el) => {
          const parent = el.parentNode
          if (parent) {
            while (el.firstChild) parent.insertBefore(el.firstChild, el)
            parent.removeChild(el)
          }
        })
      }
      return
    }

    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    // Phrases that apply to every Decameron chapter + phrases scoped to
    // this specific flat chapter index.
    const phrases = DECAMERON_GLOSSES.filter(
      (g) => g.flatChapter === null || g.flatChapter === currentChapter,
    )

    let attempts = 0
    const tryDecorate = () => {
      if (cancelled) return
      const root = document.querySelector<HTMLElement>("[data-reader-text]")
      // Wait until the actual chapter body is injected, not just the
      // placeholder. The paginated reader injects via dangerouslySetInnerHTML
      // — if we decorate the placeholder, React's subsequent innerHTML write
      // destroys our wrappers.
      const chapterReady = !!root?.querySelector(
        "section[role='doc-chapter'], section[role='doc-preface'], section[role='doc-conclusion']",
      )
      if (!root || !chapterReady) {
        attempts += 1
        if (attempts > 30) return // 30 * 100ms = 3s cap
        timeoutId = setTimeout(tryDecorate, 100)
        return
      }

      // Walk text nodes that aren't already inside a gloss wrapper.
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      const targets: Text[] = []
      let node = walker.nextNode() as Text | null
      while (node) {
        if (node.parentElement?.closest("[data-dec-gloss]")) {
          node = walker.nextNode() as Text | null
          continue
        }
        if (node.textContent && node.textContent.trim().length > 0) {
          targets.push(node)
        }
        node = walker.nextNode() as Text | null
      }

      // Build one combined alternation regex, longest phrase first so
      // "erstwhile" wins over "erst" at the same position. Applying all
      // phrases in a single pass is important — doing per-phrase
      // sequential replacements causes later phrases to match inside
      // earlier phrases' injected attribute markup (e.g. a gloss whose
      // definition happens to contain another gloss phrase).
      if (phrases.length === 0) return
      const sorted = [...phrases].sort((a, b) => b.phrase.length - a.phrase.length)
      const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const escapeAttr = (s: string) =>
        s
          .replace(/&/g, "&amp;")
          .replace(/"/g, "&quot;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
      // Word-boundary guards so "wis" doesn't match inside "wise",
      // "fain" not inside "faint", etc. Using (?<![A-Za-z]) / (?![A-Za-z])
      // rather than \b because phrases may start or end with punctuation
      // (e.g. "Ser ") where \b misbehaves. Apostrophes, hyphens, and
      // spaces inside phrases still match fine.
      const combinedRe = new RegExp(`(?<![A-Za-z])(${sorted.map((g) => escapeRe(g.phrase)).join("|")})(?![A-Za-z])`, "g")
      const byPhrase = new Map<string, (typeof sorted)[number]>()
      for (const g of sorted) if (!byPhrase.has(g.phrase)) byPhrase.set(g.phrase, g)

      for (const text of targets) {
        const original = text.textContent ?? ""
        // replace() on a global regex finds all non-overlapping matches;
        // no guard .test() — that would leave lastIndex stale across
        // text nodes and cause intermittent misses.
        combinedRe.lastIndex = 0
        const decorated = original.replace(combinedRe, (match) => {
          const g = byPhrase.get(match)
          if (!g) return match
          return `<span data-dec-gloss="1" title="${escapeAttr(g.definition)}" style="border-bottom: 1px dotted currentColor; cursor: help;">${match}</span>`
        })
        if (decorated !== original && text.parentNode) {
          const wrapper = document.createElement("span")
          wrapper.innerHTML = decorated
          while (wrapper.firstChild) text.parentNode.insertBefore(wrapper.firstChild, text)
          text.parentNode.removeChild(text)
        }
      }
    }

    // First-attempt delay to let the reader mount.
    timeoutId = setTimeout(tryDecorate, 150)
    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [bookId, currentChapter, glossesOn])

  if (bookId !== "the-decameron") return null

  const meta = getChapterMetadata(currentChapter)
  const day  = dayForChapter(currentChapter)

  // The tracker shows today's state when the reader is inside any of the
  // ten days (tales, day-intro, day-stub). Elsewhere (Proem, Conclusion,
  // Glossary, Day IV author-intervention) it simply identifies the
  // chapter kind.
  const showTracker = day !== null

  const headerColor = pickHeaderColor(meta.kind, meta.voice)
  const headerBg    = pickHeaderBg(meta.kind)

  return (
    <div className="decameron-enhancements mt-3 mb-5">
      {/* ── Chapter-kind-aware header ─────────────────────────────── */}
      <div
        className="decameron-chapter-header pb-3 mb-3"
        style={{
          borderBottom: "1px solid var(--color-border-subtle, #d6cdb9)",
          backgroundColor: headerBg,
          padding: headerBg ? "0.75rem 1rem" : undefined,
          borderRadius: headerBg ? "6px" : undefined,
        }}
      >
        {/* Top-line label */}
        <div
          className="text-xs uppercase tracking-widest opacity-70 flex items-center gap-2"
          style={{ color: headerColor }}
        >
          {meta.kind === "author-intervention" && <AuthorGlyph />}
          {meta.kind === "plague-intro"        && <span aria-hidden>☤</span>}
          <span>{renderKindLabel(meta.kind, day?.day ?? null)}</span>
        </div>

        {/* Display label (Day / Tale / Roman numerals) */}
        <div
          className="mt-1 text-lg font-serif"
          style={{ color: headerColor }}
        >
          {meta.displayLabel}
        </div>

        {/* Narrator attribution (for tales) */}
        {meta.kind === "tale" && meta.voice && meta.voice !== AUTHOR_VOICE_ID && (
          <div className="mt-1 text-sm italic flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: getVoiceColor(meta.voice) }}
              aria-hidden
            />
            <span style={{ color: getVoiceColor(meta.voice) }}>
              told by {BRIGATA[meta.voice].name}
            </span>
            {day && (
              <span className="opacity-60">
                · {day.governorTitle} {BRIGATA[day.governor].name}'s day
              </span>
            )}
          </div>
        )}

        {/* Author-voice attribution (for Proem, IV Intro, Conclusion) */}
        {meta.voice === AUTHOR_VOICE_ID && (
          <div className="mt-1 text-sm italic" style={{ color: AUTHOR_AMBER }}>
            Boccaccio speaks in his own voice, outside the frame.
          </div>
        )}

        {/* Subtitle */}
        {meta.displaySubtitle && (
          <div
            className="mt-2 text-sm opacity-80"
            style={{ color: headerColor }}
          >
            {meta.displaySubtitle}
          </div>
        )}
      </div>

      {/* ── Narrator tracker ──────────────────────────────────────── */}
      {showTracker && day && (
        <NarratorTracker
          day={day.day}
          currentChapter={currentChapter}
          open={trackerOpen}
          setOpen={(o) => {
            setTrackerOpen(o)
            if (typeof window !== "undefined") {
              window.localStorage.setItem(LS_TRACKER_OPEN, o ? "1" : "0")
            }
          }}
        />
      )}

      {/* ── Toggles ────────────────────────────────────────────────── */}
      <div className="decameron-toggles mt-3 flex flex-wrap items-center gap-3 text-xs">
        <button
          type="button"
          className="rounded border px-2 py-1 opacity-80 hover:opacity-100"
          onClick={() => {
            const next = !glossesOn
            setGlossesOn(next)
            if (typeof window !== "undefined") {
              window.localStorage.setItem(LS_GLOSSES, next ? "1" : "0")
            }
          }}
          aria-pressed={glossesOn}
          title="Tap a dotted-underlined word to see its definition. Payne's translation preserves many archaisms."
        >
          {glossesOn ? "✓ " : ""}Vocabulary glosses
        </button>
      </div>

      {/* ── Edition note, surfaced in front-matter chapters only ───── */}
      {(meta.kind === "proem" || meta.kind === "plague-intro") && (
        <div className="decameron-edition-note mt-4 text-xs opacity-70 leading-relaxed">
          <strong>Edition:</strong> John Payne, 1886 translation, via Standard
          Ebooks. Payne's deliberately archaic register preserves the Latinate
          shape of Boccaccio's Tuscan but imposes a Victorian surface — tap
          any dotted-underlined word for a modern gloss.
          {isAuthorIntervention(currentChapter) && (
            <> Day IV's Introduction is rendered here with a distinct amber
              register because it is, uniquely in the work, Boccaccio's
              own voice stepping out of the frame to defend his book.</>
          )}
        </div>
      )}
    </div>
  )
}

// ── Subcomponents ──────────────────────────────────────────────────

function AuthorGlyph() {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center rounded-full font-serif"
      style={{
        backgroundColor: AUTHOR_AMBER,
        color: "#FFFFFF",
        width: "1rem",
        height: "1rem",
        fontSize: "0.625rem",
      }}
    >
      B
    </span>
  )
}

interface NarratorTrackerProps {
  day: number
  currentChapter: number
  open: boolean
  setOpen: (o: boolean) => void
}

function NarratorTracker({ day, currentChapter, open, setOpen }: NarratorTrackerProps) {
  const dayRecord = DAYS.find((d) => d.day === day)
  if (!dayRecord) return null
  const tales = talesForDay(day)
  const tenthSlotIsDioneo = true // always true from Day II onwards; on Day I Dioneo is slot 4 but tales array reflects this correctly
  void tenthSlotIsDioneo
  const currentTaleIdx = tales.findIndex((t) => t.flatChapter === currentChapter)

  return (
    <details
      className="decameron-tracker text-sm"
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      style={{
        border: "1px solid var(--color-border-subtle, #d6cdb9)",
        borderRadius: "6px",
        padding: "0.5rem 0.75rem",
      }}
    >
      <summary
        className="cursor-pointer select-none flex items-center gap-2"
        style={{ listStyle: "none" }}
      >
        <span className="text-xs uppercase tracking-widest opacity-60">
          The Brigata
        </span>
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: getVoiceColor(dayRecord.governor) }}
          aria-hidden
        />
        <span className="text-xs opacity-80">
          Day {toRoman(day)} · {dayRecord.governorTitle} {BRIGATA[dayRecord.governor].name}
        </span>
      </summary>

      <div className="mt-2 text-xs opacity-80 leading-relaxed">
        <div>
          <strong>Today's theme —</strong> {dayRecord.theme}.
        </div>
        <div className="mt-1">
          {dayRecord.moodEpigraph}
        </div>
      </div>

      {/* Ten slots, colored as tales complete */}
      <div className="mt-3 flex flex-wrap gap-1">
        {tales.map((t, i) => {
          const done    = currentChapter > t.flatChapter
          const current = currentChapter === t.flatChapter
          return (
            <div
              key={t.tale}
              title={`Tale ${toRoman(t.tale)} — ${BRIGATA[t.narrator].name}`}
              aria-label={`Tale ${t.tale} — ${BRIGATA[t.narrator].name}${current ? " (current)" : done ? " (heard)" : " (coming)"}`}
              style={{
                width: "1.25rem",
                height: "1.25rem",
                borderRadius: "3px",
                border: current ? `2px solid ${getVoiceColor(t.narrator)}` : "1px solid transparent",
                backgroundColor: done || current ? getVoiceColor(t.narrator) : "transparent",
                outline: done || current ? undefined : `1px dashed ${getVoiceColor(t.narrator)}`,
                opacity: current ? 1 : done ? 0.7 : 0.3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.625rem",
                color: done || current ? "#FFFFFF" : getVoiceColor(t.narrator),
              }}
            >
              {i + 1}
            </div>
          )
        })}
      </div>

      {/* Previously-heard hint */}
      {currentTaleIdx > 0 && (
        <div className="mt-3 text-xs opacity-70 italic">
          Previously: {BRIGATA[tales[currentTaleIdx - 1].narrator].name} told{" "}
          <em>{tales[currentTaleIdx - 1].rubricSubtitle}</em>
        </div>
      )}
    </details>
  )
}

// ── Helpers ────────────────────────────────────────────────────────

function pickHeaderColor(kind: string, voice: string | null): string {
  if (kind === "plague-intro") return PLAGUE_MUTED
  if (kind === "author-intervention" || kind === "proem" || kind === "author-conclusion") {
    return AUTHOR_AMBER
  }
  if (kind === "tale" && voice && voice !== AUTHOR_VOICE_ID) {
    return getVoiceColor(voice as never)
  }
  return "var(--color-text-muted, #4B5563)"
}

function pickHeaderBg(kind: string): string | undefined {
  if (kind === "plague-intro")        return PLAGUE_MUTED_BG
  if (kind === "author-intervention") return AUTHOR_AMBER_BG
  if (kind === "proem")               return AUTHOR_AMBER_BG
  if (kind === "author-conclusion")   return AUTHOR_AMBER_BG
  return undefined
}

function renderKindLabel(kind: string, day: number | null): string {
  switch (kind) {
    case "proem":              return "Proem · Author's voice"
    case "plague-intro":       return "Florence, 1348 · Eyewitness introduction"
    case "day-stub":           return day ? `Day ${toRoman(day)} · title card` : "Day"
    case "day-intro":          return day ? `Day ${toRoman(day)} · frame opening` : "Day opening"
    case "author-intervention": return "Day IV · Author breaks the frame"
    case "tale":               return day ? `Day ${toRoman(day)} · tale` : "Tale"
    case "author-conclusion":  return "Conclusion · Author's voice"
    case "glossary":           return "Glossary"
    default:                   return ""
  }
}
