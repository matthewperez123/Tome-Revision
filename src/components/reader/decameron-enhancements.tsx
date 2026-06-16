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

export function DecameronEnhancements({
  bookId,
  currentChapter,
}: DecameronEnhancementsProps) {
  const [trackerOpen, setTrackerOpen] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const t = window.localStorage.getItem(LS_TRACKER_OPEN)
    if (t !== null) setTrackerOpen(t === "1")
  }, [])

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

      {/* ── Edition note, surfaced in front-matter chapters only ───── */}
      {(meta.kind === "proem" || meta.kind === "plague-intro") && (
        <div className="decameron-edition-note mt-4 text-xs opacity-70 leading-relaxed">
          <strong>Edition:</strong> John Payne, 1886 translation, via Standard
          Ebooks. Payne's deliberately archaic register preserves the Latinate
          shape of Boccaccio's Tuscan but imposes a Victorian surface.
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
