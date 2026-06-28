"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { PaginatedReader } from "@/components/tome/paginated-reader"
import { AnnotationLayer } from "@/components/guided-learning/annotations/annotation-layer"
import { useEventQueue } from "@/hooks/use-event-queue"
import { paginateHTML } from "@/lib/paginator"
import { cn } from "@/lib/utils"

interface LockedReaderProps {
  sessionId: string
  bookId: string
  chapterIndex: number
  onProgress: (pct: number) => void
  onComplete: () => void
  theme?: "light" | "dark"
  /** When true, overlay collaborative margin annotations on the reading. */
  annotationsEnabled?: boolean
  /** Annotation privacy topology (collaborative vs private-to-teacher rooms). */
  annotationVisibility?: "collaborative" | "private_to_teacher"
  /** Show live presence avatars of others on the same passage. */
  presenceEnabled?: boolean
}

/**
 * Wraps PaginatedReader for the guided learning lockdown context.
 * Strips navigation, reports progress via event queue.
 */
export function LockedReader({
  sessionId,
  bookId,
  chapterIndex,
  onProgress,
  onComplete,
  theme = "light",
  annotationsEnabled = false,
  annotationVisibility = "collaborative",
  presenceEnabled = false,
}: LockedReaderProps) {
  const [pages, setPages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isPaginating, setIsPaginating] = useState(true)
  const regionRef = useRef<HTMLDivElement | null>(null)
  const { queueEvent } = useEventQueue(sessionId)

  // Load chapter content
  useEffect(() => {
    let cancelled = false
    async function loadContent() {
      setIsPaginating(true)
      try {
        // Try static content first
        const res = await fetch(`/content/${bookId}/ch-${chapterIndex}.json`)
        if (res.ok) {
          const data = await res.json()
          const html = data.content ?? data.html ?? ""
          if (!cancelled) {
            const paginated = await paginateHTML({
              html,
              pageHeight: 600,
              pageWidth: 500,
              fontSize: 18,
            })
            setPages(paginated)
          }
        }
      } catch {
        // Content loading failed
        if (!cancelled) {
          setPages(["<p>Content could not be loaded.</p>"])
        }
      } finally {
        if (!cancelled) setIsPaginating(false)
      }
    }
    loadContent()
    return () => { cancelled = true }
  }, [bookId, chapterIndex])

  // Track progress
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
      const pct = pages.length > 0 ? Math.round(((page + 1) / pages.length) * 100) : 0
      onProgress(pct)
      queueEvent("page_turn", { page, total: pages.length, progress_pct: pct })
      queueEvent("progress_update", { progress_pct: pct })
    },
    [pages.length, onProgress, queueEvent],
  )

  const handleChapterEnd = useCallback(() => {
    onProgress(100)
    queueEvent("progress_update", { progress_pct: 100 })
    onComplete()
  }, [onProgress, queueEvent, onComplete])

  return (
    <div
      className="reader-surface h-full w-full"
      data-reader-theme={theme === "dark" ? "night" : "day"}
    >
      <div
        ref={regionRef}
        className={cn(
          "relative h-full w-full",
          annotationsEnabled && "reader-annotatable",
        )}
      >
        <PaginatedReader
          pages={pages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onChapterEnd={handleChapterEnd}
          isPaginating={isPaginating}
          mode="single"
          fontSize={18}
          lineHeight={1.8}
          justify={false}
          a11yFace={false}
          turnStyle="slide"
          onToggleToolbar={() => {}} // No toolbar in lockdown
        />
        {annotationsEnabled && (
          <AnnotationLayer
            roomId={`gs:${sessionId}:${bookId}:${chapterIndex}`}
            chapterIndex={chapterIndex}
            regionRef={regionRef}
            currentPage={currentPage}
            visibility={annotationVisibility}
            presenceEnabled={presenceEnabled}
            enabled
          />
        )}
      </div>
    </div>
  )
}
