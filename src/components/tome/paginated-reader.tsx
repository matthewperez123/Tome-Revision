"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReaderTurnStyle } from "@/lib/reader/reader-prefs"
import { CODEX, codexScale } from "@/lib/reader/codex-spec"

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
  // Running heads (codex spec §5.1): book title on the verso, chapter title on
  // the recto, small caps, suppressed on the chapter opener (local page 0).
  runningHeadVerso?: string
  runningHeadRecto?: string
  // Codex spec §5.1: chapters open on a right-hand page. In spread mode the
  // opener's facing verso renders as a counted blank leaf.
  openOnRecto?: boolean
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
  const shown = Math.min(totalPages, currentPage + step)

  return (
    <div
      className="absolute bottom-0 inset-x-0 flex flex-col items-center gap-1 pb-2 pointer-events-none"
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
      {totalPages > 0 && (
        <span className="text-[10px] tabular-nums" style={{ color: "var(--reader-muted)" }}>
          Page {shown} of {totalPages}
        </span>
      )}
    </div>
  )
}

// ─── PaginatedReader ─────────────────────────────────────────────────────────
//
// Codex geometry (spec_version 1): every page is a fixed 528×816 box with the
// printed-book margin scheme (top 64 / bottom 80 / inner 60 / outer 76 →
// 392×672 text block). The whole box — spread or single — is scaled to fit the
// viewport via `transform: scale`, so viewport changes never reflow the type.

// Vertical room reserved under the book for the progress strip.
const STRIP_RESERVE = 56

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
  runningHeadVerso,
  runningHeadRecto,
  openOnRecto = false,
}: PaginatedReaderProps) {
  const step = mode === "spread" ? 2 : 1
  // Recto-open virtual pairing (spread only): prepend one blank verso slot so
  // content page 0 sits on the recto. Virtual even slots = versos, odd =
  // rectos; a spread shows the pair (vFirst, vFirst+1); content index = v − 1.
  const rectoOpen = openOnRecto && mode === "spread"
  const vCur = currentPage + (rectoOpen ? 1 : 0)
  const vFirst = vCur - (vCur % 2)
  const versoIdx = rectoOpen ? vFirst - 1 : currentPage
  const rectoIdx = rectoOpen ? vFirst : currentPage + 1
  const [direction, setDirection] = useState<1 | -1>(1)
  const pointerStartX = useRef<number | null>(null)
  const prefersReduced = useReducedMotion()

  // ── Fit-to-viewport scale (the "hold the book closer/farther" transform) ──
  const frameRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      setScale(codexScale(r.width - 16, r.height - STRIP_RESERVE, mode))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [mode])

  const goNext = useCallback(() => {
    if (rectoOpen) {
      // Next pair holds content indices (vFirst+1, vFirst+2).
      if (vFirst + 1 >= pages.length) onChapterEnd()
      else {
        setDirection(1)
        onPageChange(vFirst + 1)
      }
      return
    }
    if (currentPage + step >= pages.length) {
      onChapterEnd()
    } else {
      setDirection(1)
      onPageChange(currentPage + step)
    }
  }, [rectoOpen, vFirst, currentPage, step, pages.length, onChapterEnd, onPageChange])

  const goPrev = useCallback(() => {
    if (rectoOpen) {
      if (vFirst <= 0) {
        onChapterPrev?.()
        return
      }
      // Previous pair holds content indices (vFirst−3, vFirst−2).
      setDirection(-1)
      onPageChange(Math.max(0, vFirst - 3))
      return
    }
    if (currentPage <= 0) {
      onChapterPrev?.()
      return
    }
    setDirection(-1)
    onPageChange(Math.max(0, currentPage - step))
  }, [rectoOpen, vFirst, currentPage, step, onPageChange, onChapterPrev])

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
          if (rectoOpen) {
            // Last virtual pair starts at the even slot ≤ the last content slot.
            const lastPairStart = pages.length - (pages.length % 2)
            onPageChange(Math.max(0, lastPairStart - 1))
          } else {
            onPageChange(Math.max(0, pages.length - step))
          }
          break
      }
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [goNext, goPrev, onPageChange, pages.length, step, rectoOpen])

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
    // Codex spec: no word is ever split — hyphenation off by default.
    hyphens: "none",
  }

  function renderPage(pageIndex: number, side: "single" | "verso" | "recto") {
    // Codex margins: inner (gutter) vs outer (fore-edge) mirror across the
    // spine. Single pages centre the block (68/68 preserves the 392px measure).
    const padLeft  = side === "verso" ? CODEX.marginOuter : side === "recto" ? CODEX.marginInner : 68
    const padRight = side === "verso" ? CODEX.marginInner : side === "recto" ? CODEX.marginOuter : 68
    // Blank leaf — the counted blank verso facing a recto opener, or the empty
    // recto after a chapter's last verso. No content, folio, or running head.
    const isBlank = pageIndex < 0 || pageIndex >= pages.length
    const folio = isBlank ? null : folioLabel?.(pageIndex) ?? null
    // Running head — book title verso, chapter title recto/single — suppressed
    // on the chapter opener (local page 0) and blank leaves per the codex spec.
    const isOpener = pageIndex === 0
    const head = isOpener || isBlank ? null : side === "verso" ? runningHeadVerso : runningHeadRecto
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
            padding: `${CODEX.marginTop}px ${padRight}px ${CODEX.marginBottom}px ${padLeft}px`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {head && (
            <div
              className="absolute inset-x-0 truncate px-16 text-center font-display pointer-events-none"
              style={{
                top: 26,
                fontSize: 11,
                letterSpacing: "0.14em",
                fontVariantCaps: "small-caps",
                color: "var(--reader-muted)",
              }}
              aria-hidden
            >
              {head}
            </div>
          )}
          {isBlank ? null : isPaginating ? (
            <PageSkeleton />
          ) : (
            <div
              className={cn(
                "font-serif prose-reader mx-auto w-full flex-1",
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
              className="absolute inset-x-0 text-center text-[11px] tabular-nums pointer-events-none"
              style={{ bottom: 34, color: "var(--reader-muted)" }}
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
      ref={frameRef}
      className="relative flex h-full w-full items-center justify-center select-none overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={handleContainerClick}
      style={{ cursor: "default" }}
    >
      {/* Fixed-geometry codex box, scaled whole to fit the viewport. */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          marginBottom: STRIP_RESERVE / 2,
          flexShrink: 0,
        }}
      >
        {mode === "spread" ? (
          // ── Two-page spread (open book) ──
          <div
            className="relative flex"
            style={{
              width: CODEX.pageW * 2 + CODEX.spineW,
              height: CODEX.pageH,
              boxShadow: "0 8px 48px var(--reader-shadow), 0 2px 8px var(--reader-shadow)",
              borderRadius: 4,
            }}
          >
            <div
              className="reader-single-paper relative overflow-hidden"
              style={{ ...paperBase, width: CODEX.pageW, flexShrink: 0, borderRadius: "6px 0 0 6px" }}
            >
              {renderPage(versoIdx, "verso")}
            </div>
            <div
              style={{
                width: CODEX.spineW,
                flexShrink: 0,
                background: "var(--reader-edge)",
                boxShadow: "-16px 0 32px var(--reader-shadow), 16px 0 32px var(--reader-shadow)",
              }}
            />
            <div
              className="reader-single-paper relative overflow-hidden"
              style={{ ...paperBase, width: CODEX.pageW, flexShrink: 0, borderRadius: "0 6px 6px 0" }}
            >
              {renderPage(rectoIdx, "recto")}
            </div>
          </div>
        ) : (
          // ── Single page ──
          <div
            className="reader-single-paper relative overflow-hidden"
            style={{
              ...paperBase,
              width: CODEX.pageW,
              height: CODEX.pageH,
              borderRadius: 6,
              boxShadow: "0 8px 48px var(--reader-shadow), 0 2px 8px var(--reader-shadow)",
            }}
          >
            {renderPage(currentPage, "single")}
          </div>
        )}
      </div>

      <ProgressStrip currentPage={currentPage} totalPages={pages.length} step={step} />
    </div>
  )
}
