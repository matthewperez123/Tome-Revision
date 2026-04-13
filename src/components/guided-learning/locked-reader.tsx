"use client"

import { useState, useEffect, useCallback } from "react"
import { PaginatedReader } from "@/components/tome/paginated-reader"
import { useEventQueue } from "@/hooks/use-event-queue"
import { paginateHTML } from "@/lib/paginator"

interface LockedReaderProps {
  sessionId: string
  bookId: string
  chapterIndex: number
  onProgress: (pct: number) => void
  onComplete: () => void
  theme?: "light" | "dark"
  accentColor?: string
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
  accentColor = "#6366F1",
}: LockedReaderProps) {
  const [pages, setPages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isPaginating, setIsPaginating] = useState(true)
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
    <div className="h-full w-full">
      <PaginatedReader
        pages={pages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onChapterEnd={handleChapterEnd}
        isPaginating={isPaginating}
        mode="book"
        theme={theme}
        fontSize={18}
        accentColor={accentColor}
        onToggleToolbar={() => {}} // No toolbar in lockdown
      />
    </div>
  )
}
