"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReaderTurnStyle } from "@/lib/reader/reader-prefs"

// ─── Public Types ────────────────────────────────────────────────────────────

export interface PaginatedReaderProps {
  pages: string[] // pre-computed, one HTML string per page
  currentPage: number // 0-indexed
  onPageChange: (page: number) => void
  onChapterEnd: () => void // advancing past the last page
  onChapterPrev?: () => void // turning back before the first page
  isPaginating: boolean // show skeleton while the paginator runs
  mode: "single" | "spread"
  fontSize: number
  lineHeight: number
  justify: boolean
  a11yFace: boolean
  turnStyle: ReaderTurnStyle
  onToggleToolbar: () => void
  contentTypeClass?: string // "content-drama" | "content-verse" | "content-prose"
  // Whole-book folio for a local (within-chapter) page index — roman for front
  // matter, arabic for body. Returns null until the book has been pre-measured.
  folioLabel?: (localPageIndex: number) => string | null
}

// ─── PageSkeleton ────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="space-y-3 pt-2">
      {[100, 98, 96, 100, 92, 87, 100, 95, 60].map((w, i) => (
        <div
          key={i}
          className="h-[1.4em] rounded bg-current animate-pulse"
          style={{ width: `${w}%`, opacity: 0.08 }}
        />
      ))}
    </div>
  )
}

// ─── ProgressStrip ───────────────────────────────────────────────────────────

function ProgressStrip({
  currentPage,
  totalPages,
  step,
}: {
  currentPage: number
  totalPages: number
  step: number
}) {
  const pct = ((currentPage + step) / Math.max(1, totalPages)) * 100

  return (
    <div
      className="absolute bottom-0 inset-x-0 flex flex-col items-center gap-1 pb-3 pointer-events-none"
      aria-live="polite"
    >
      <div
        className="w-48 h-[3px] rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--reader-edge)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300 motion-reduce:transition-none"
          style={{ width: `${Math.min(100, pct)}%`, backgroundColor: "var(--reader-accent)" }}
        />
      </div>
    </div>
  )
}

// ─── PaginatedReader ─────────────────────────────────────────────────────────

// PADDING_H is only a fallback for `--reader-pad-x` (2rem / 32px, set on the
// shared .reader-surface) — kept in sync so the paginator measures the same
// horizontal inset the page actually renders. PADDING_V is page-layout only.
const PADDING_H = 32
const PADDING_V = 40

export function PaginatedReader({
  pages,
  currentPage,
  onPageChange,
  onChapterEnd,
  onChapterPrev,
  isPaginating,
  mode,
  fontSize,
  lineHeight,
  justify,
  a11yFace,
  turnStyle,
  onToggleToolbar,
  contentTypeClass = "content-prose",
  folioLabel,
}: PaginatedReaderProps) {
  const step = mode === "spread" ? 2 : 1
  const [direction, setDirection] = useState<1 | -1>(1)
  const pointerStartX = useRef<number | null>(null)
  const prefersReduced = useReducedMotion()

  const goNext = useCallback(() => {
    if (currentPage + step >= pages.length) {
      onChapterEnd()
    } else {
      setDirection(1)
      onPageChange(currentPage + step)
    }
  }, [currentPage, step, pages.length, onChapterEnd, onPageChange])

  const goPrev = useCallback(() => {
    if (currentPage <= 0) {
      onChapterPrev?.()
      return
    }
    setDirection(-1)
    onPageChange(Math.max(0, currentPage - step))
  }, [currentPage, step, onPageChange, onChapterPrev])

  // Keyboard navigation — capture phase to suppress parent handlers.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
          e.preventDefault()
          e.stopPropagation()
          goNext()
          break
        case " ":
          e.preventDefault()
          e.stopPropagation()
          if (e.shiftKey) goPrev()
          else goNext()
          break
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault()
          e.stopPropagation()
          goPrev()
          break
        case "Home":
          e.preventDefault()
          e.stopPropagation()
          onPageChange(0)
          break
        case "End":
          e.preventDefault()
          e.stopPropagation()
          onPageChange(Math.max(0, pages.length - step))
          break
      }
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [goNext, goPrev, onPageChange, pages.length, step])

  // Click-zone handler: left third prev, right third next, center toggles chrome.
  function handleContainerClick(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("button,a,select,input")) return
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width
    if (relX < 0.33) goPrev()
    else if (relX > 0.66) goNext()
    else onToggleToolbar()
  }

  function handlePointerDown(e: React.PointerEvent) {
    pointerStartX.current = e.clientX
  }
  function handlePointerUp(e: React.PointerEvent) {
    if (pointerStartX.current === null) return
    const delta = e.clientX - pointerStartX.current
    pointerStartX.current = null
    if (Math.abs(delta) < 50) return
    if (delta < 0) goNext()
    else goPrev()
  }

  // Turn animation — slide / fade / none, forced to instant under reduced motion.
  const instant = prefersReduced || turnStyle === "none"
  const variants = useMemo(() => {
    if (instant) {
      return {
        enter: { opacity: 1, x: 0 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 1, x: 0 },
      }
    }
    if (turnStyle === "fade") {
      return {
        enter: { opacity: 0, x: 0 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 0 },
      }
    }
    // slide
    return {
      enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
    }
  }, [instant, turnStyle])

  const transition = instant
    ? { duration: 0 }
    : { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }

  // Typography is sourced from the shared reading-token layer set on the
  // .reader-surface ancestor (see READER_PARITY.md) so paginated text resolves
  // to exactly the same size / leading / measure as scroll. `fontSize` and
  // `lineHeight` props are still consumed by the paginator for measurement.
  void fontSize
  void lineHeight
  const contentStyle: React.CSSProperties = {
    fontSize: "var(--reader-font-size)",
    lineHeight: "var(--reader-line-height)",
    color: "var(--reader-ink)",
    overflow: "hidden",
    height: "100%",
  }

  function renderPage(pageIndex: number, side: "single" | "verso" | "recto") {
    // Outer-corner folio: verso (left page) → bottom-left; recto/single →
    // bottom-right. Never centered, never in the gutter. Aligned with the text
    // inset (var(--reader-pad-x)).
    const folio = folioLabel?.(pageIndex) ?? null
    const folioSide = side === "verso" ? "left" : "right"
    return (
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={pageIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          style={{
            position: "absolute",
            inset: 0,
            padding: `${PADDING_V}px var(--reader-pad-x, ${PADDING_H}px)`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {isPaginating ? (
            <PageSkeleton />
          ) : (
            <div
              className={cn(
                "font-serif prose-reader reader-measure mx-auto w-full flex-1",
                contentTypeClass,
                justify ? "reader-justify" : "reader-ragged",
                a11yFace && "reader-a11y-face"
              )}
              style={contentStyle}
              data-reader-text
              dangerouslySetInnerHTML={{ __html: pages[pageIndex] ?? "" }}
            />
          )}
          {folio && (
            <div
              className="absolute bottom-3 text-[11px] tabular-nums pointer-events-none"
              style={{
                color: "var(--reader-muted)",
                [folioSide]: "var(--reader-pad-x, 32px)",
              }}
            >
              {folio}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    )
  }

  const paperBase: React.CSSProperties = {
    background: "var(--reader-bg)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  }

  return (
    <div
      className="relative flex h-full w-full items-center justify-center select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={handleContainerClick}
      style={{ cursor: "default" }}
    >
      {mode === "spread" ? (
        // ── Two-page spread (open book) ──
        <div
          className="relative flex h-[calc(100%-72px)]"
          style={{
            boxShadow: "0 8px 48px var(--reader-shadow), 0 2px 8px var(--reader-shadow)",
            borderRadius: 4,
          }}
        >
          <div
            className="reader-single-paper relative overflow-hidden"
            style={{ ...paperBase, width: "calc(min(45vw, 500px))", flexShrink: 0, borderRadius: "6px 0 0 6px" }}
          >
            {renderPage(currentPage, "verso")}
          </div>
          <div
            style={{
              width: 1,
              flexShrink: 0,
              background: "var(--reader-edge)",
              boxShadow: "-16px 0 32px var(--reader-shadow), 16px 0 32px var(--reader-shadow)",
            }}
          />
          <div
            className="reader-single-paper relative overflow-hidden"
            style={{ ...paperBase, width: "calc(min(45vw, 500px))", flexShrink: 0, borderRadius: "0 6px 6px 0" }}
          >
            {renderPage(currentPage + 1, "recto")}
          </div>
        </div>
      ) : (
        // ── Single page ──
        <div
          className="reader-single-paper relative h-[calc(100%-72px)] overflow-hidden"
          style={{ ...paperBase, width: "min(92vw, 680px)" }}
        >
          {renderPage(currentPage, "single")}
        </div>
      )}

      <ProgressStrip currentPage={currentPage} totalPages={pages.length} step={step} />
    </div>
  )
}
