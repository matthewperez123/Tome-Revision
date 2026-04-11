"use client"

import { useMemo, useRef, useState, useLayoutEffect } from "react"
import { getGeographyColor } from "@/lib/geographyColors"
import type { Timeline, TimelineAuthor } from "@/data/timelines"

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatYear(year: number): string {
  if (year <= 0) return `${Math.abs(year)} BCE`
  return `${year}`
}

/** Derive 2-letter initials from an author name. */
function getInitials(name: string): string {
  // Anonymous → use first two letters of name
  if (name === "Anonymous") return "AN"

  // Remove particles for splitting but keep the letters
  const cleaned = name
    .replace(/^(The |A )/i, "")
    .replace(/['']/g, "'")

  const parts = cleaned.split(/\s+/).filter(Boolean)

  if (parts.length === 1) {
    // Single name: first two letters uppercase
    return parts[0].substring(0, 2).toUpperCase()
  }

  // Multi-part: first letter of first name + first letter of last name
  const first = parts[0]
  const last = parts[parts.length - 1]
  return (first[0] + last[0]).toUpperCase()
}

const ICON_SIZE = 44
const ICON_RADIUS = ICON_SIZE / 2
const AXIS_OFFSET = 36 // icon center distance from axis
const NAME_GAP = 16 // gap between icon edge and name label
const EDGE_PAD = 80
const LABEL_WIDTH = 92
const ROW_HEIGHT = 220
const SAME_SIDE_MIN = 140
const OPP_SIDE_MIN = 60

// ── Author Icon ─────────────────────────────────────────────────────────────

interface AuthorIconProps {
  author: TimelineAuthor
  isAbove: boolean
  isSelected: boolean
  xPx: number
  onAuthorClick: (authorId: string, rect: DOMRect) => void
}

function AuthorIcon({
  author,
  isAbove,
  isSelected,
  xPx,
  onAuthorClick,
}: AuthorIconProps) {
  const geoColor = getGeographyColor(author.country, author.continent)
  const initials = getInitials(author.authorName)

  // Vertical positions relative to axis at 50% of row height
  // axis is at ROW_HEIGHT/2 = 110px
  const axisY = ROW_HEIGHT / 2
  const iconCenterY = isAbove ? axisY - AXIS_OFFSET : axisY + AXIS_OFFSET
  const iconTop = iconCenterY - ICON_RADIUS

  // Name label: above icon top or below icon bottom
  const nameLabelTop = isAbove
    ? iconTop - NAME_GAP - 28 // 28px for two-line label
    : iconCenterY + ICON_RADIUS + NAME_GAP

  // Year label: on the axis line
  const yearLabelTop = axisY - 6 // center the 12px text on axis

  return (
    <div
      className="absolute"
      style={{
        left: xPx - LABEL_WIDTH / 2,
        top: 0,
        width: LABEL_WIDTH,
        height: ROW_HEIGHT,
      }}
    >
      {/* Author name — full, never truncated, wraps to 2 lines max */}
      <div
        className="absolute text-center"
        style={{
          left: 0,
          right: 0,
          top: nameLabelTop,
        }}
      >
        <span
          className="text-[11px] leading-[1.25] font-normal text-foreground"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            whiteSpace: "normal",
            wordBreak: "normal",
            textAlign: "center",
          }}
          title={author.authorName}
        >
          {author.authorName}
        </span>
      </div>

      {/* Author icon button with initials */}
      <button
        data-author-button
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          onAuthorClick(author.id, rect)
        }}
        className="absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          top: iconTop,
          width: ICON_SIZE,
          height: ICON_SIZE,
          backgroundColor: geoColor,
          border: `2px solid ${geoColor}`,
          filter: isSelected ? "brightness(1.2)" : undefined,
        }}
        title={`${author.authorName} — ${author.mostFamousWork}`}
      >
        <span
          className="font-[var(--font-display)] font-medium text-white select-none"
          style={{ fontSize: ICON_SIZE * 0.4 }}
        >
          {initials}
        </span>
      </button>

      {/* Year label on the axis */}
      <div
        className="absolute left-0 right-0 text-center pointer-events-none"
        style={{ top: yearLabelTop }}
      >
        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
          {formatYear(author.publicationYear)}
        </span>
      </div>
    </div>
  )
}

// ── Single Row ──────────────────────────────────────────────────────────────

interface RowProps {
  authors: TimelineAuthor[]
  accentColor: string
  selectedAuthorId: string | null
  onAuthorClick: (authorId: string, rect: DOMRect) => void
  usableWidth: number
  leftOffset: number
}

function TimelineRow({
  authors,
  accentColor,
  selectedAuthorId,
  onAuthorClick,
  usableWidth,
  leftOffset,
}: RowProps) {
  const count = authors.length
  if (count === 0) return null

  const axisY = ROW_HEIGHT / 2

  // Even distribution, compressed toward center
  const getXPx = (index: number) => {
    const natural = count === 1 ? 0.5 : index / (count - 1)
    const compressed = 0.5 + (natural - 0.5) * 0.75
    return leftOffset + compressed * usableWidth
  }

  return (
    <div className="relative" style={{ height: ROW_HEIGHT }}>
      {/* Axis line spanning the full inset width */}
      <div
        className="absolute"
        style={{
          left: leftOffset,
          width: usableWidth,
          top: axisY,
          height: 1,
          backgroundColor: `${accentColor}44`,
        }}
      />

      {/* Author nodes */}
      {authors.map((author, i) => {
        const isAbove = i % 2 === 0
        return (
          <AuthorIcon
            key={author.id}
            author={author}
            isAbove={isAbove}
            isSelected={selectedAuthorId === author.id}
            xPx={getXPx(i)}
            onAuthorClick={onAuthorClick}
          />
        )
      })}
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────────────────

interface HorizontalTimelineProps {
  timeline: Timeline
  authors: TimelineAuthor[]
  selectedAuthorId: string | null
  onAuthorClick: (authorId: string, rect: DOMRect) => void
}

export function HorizontalTimeline({
  timeline,
  authors,
  selectedAuthorId,
  onAuthorClick,
}: HorizontalTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(800)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => setContainerWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Sort chronologically
  const sorted = useMemo(
    () => [...authors].sort((a, b) => a.publicationYear - b.publicationYear),
    [authors],
  )

  const usableWidth = Math.max(0, containerWidth - EDGE_PAD * 2)
  const leftOffset = EDGE_PAD

  // Two-row splitting: check if same-side spacing is too tight
  const needsTwoRows = useMemo(() => {
    if (sorted.length <= 1) return false
    // Authors on same side are every other one, so count/2 authors share the width
    const sameSideCount = Math.ceil(sorted.length / 2)
    const spacingPerSameSide =
      sameSideCount <= 1 ? Infinity : (usableWidth * 0.75) / (sameSideCount - 1)
    return spacingPerSameSide < SAME_SIDE_MIN
  }, [sorted.length, usableWidth])

  const { row1, row2 } = useMemo(() => {
    if (!needsTwoRows) return { row1: sorted, row2: [] as TimelineAuthor[] }
    const r1: TimelineAuthor[] = []
    const r2: TimelineAuthor[] = []
    sorted.forEach((a, i) => {
      if (i % 2 === 0) r1.push(a)
      else r2.push(a)
    })
    return { row1: r1, row2: r2 }
  }, [sorted, needsTwoRows])

  return (
    <div className="mb-4">
      {/* Timeline container — NO horizontal scroll */}
      <div ref={containerRef} className="w-full">
        <TimelineRow
          authors={row1}
          accentColor={timeline.accentColor}
          selectedAuthorId={selectedAuthorId}
          onAuthorClick={onAuthorClick}
          usableWidth={usableWidth}
          leftOffset={leftOffset}
        />
        {row2.length > 0 && (
          <TimelineRow
            authors={row2}
            accentColor={timeline.accentColor}
            selectedAuthorId={selectedAuthorId}
            onAuthorClick={onAuthorClick}
            usableWidth={usableWidth}
            leftOffset={leftOffset}
          />
        )}
      </div>
    </div>
  )
}
