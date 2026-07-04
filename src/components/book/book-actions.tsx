"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Bookmark, BookmarkCheck, Play } from "lucide-react"
import {
  getBookProgress, createBookProgress, saveBookProgress,
  type BookProgress,
} from "@/lib/book-progress"
import type { StructuralUnitType } from "@/data/books"
import { getUnitNumber, getShortProgress } from "@/lib/structural-units"
import { useFavorite } from "@/hooks/use-favorite"
import { AddToShelf } from "@/components/book/add-to-shelf"
import { cn } from "@/lib/utils"

/**
 * Client island for the book detail page: Start/Continue Reading CTA,
 * bookmark toggle, in-progress bar, and the mobile sticky action bar.
 *
 * Renders an SSR-safe default ("Start Reading", not bookmarked, no progress)
 * and enhances from localStorage after hydration, so the surrounding page can
 * be a Server Component without losing interactivity.
 */
export function BookActions({
  bookId,
  bookTitle,
  structuralUnitType,
  totalChapters,
  chapterTitles,
  tradDotColor,
}: {
  bookId: string
  bookTitle: string
  structuralUnitType: StructuralUnitType
  totalChapters: number
  chapterTitles: string[]
  tradDotColor: string
}) {
  const router = useRouter()
  const [progress, setProgress] = useState<BookProgress | null>(null)
  const { isFavorite: isBookmarked, toggle: toggleBookmark } = useFavorite(bookId)

  useEffect(() => {
    setProgress(getBookProgress(bookId))
  }, [bookId])

  function handleStartReading() {
    if (!progress) {
      const newProgress = createBookProgress(bookId)
      saveBookProgress(newProgress)
      setProgress(newProgress)
    }
    router.push(`/read/${bookId}`)
  }

  const chaptersDone = progress?.completedChapterIndices.length ?? 0
  const progressPct = Math.min(
    100,
    Math.round((chaptersDone / Math.max(totalChapters, 1)) * 100),
  )
  const currentChapterIdx = progress?.currentChapterIndex ?? 0
  const currentChapterTitle = chapterTitles[currentChapterIdx]

  const ctaLabel = !progress
    ? "Start Reading"
    : progressPct === 100
    ? "Read Again"
    : `Continue — ${getUnitNumber(structuralUnitType, currentChapterIdx + 1, currentChapterTitle)}`

  return (
    <>
      {/* Progress bar (if reading) */}
      {progress && progressPct > 0 && (
        <div className="mt-3 w-full max-w-[260px]">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{getShortProgress(structuralUnitType, chaptersDone, totalChapters)}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, backgroundColor: tradDotColor }}
            />
          </div>
        </div>
      )}

      {/* CTAs — desktop (hidden on small mobile, sticky bar used instead) */}
      <div className="hidden sm:flex items-center gap-2 mt-4">
        <button
          onClick={handleStartReading}
          className="tactile-btn h-9 px-4 text-xs"
          style={{ ["--accent" as string]: "var(--blue-default)" }}
        >
          {progress ? <Play className="size-3.5 fill-current" /> : <BookOpen className="size-3.5" />}
          {ctaLabel}
        </button>
        <AddToShelf bookId={bookId} completed={progressPct === 100} />
      </div>

      {/* ── Mobile sticky CTA ── */}
      {/* Sits ABOVE the bottom MobileDock (fixed bottom-0 z-50 at < 480px).
          The dock is ~56-60px tall including its safe-area inset, so we lift
          the CTA by `bottom-14` on small viewports. At >= 480px the dock is
          hidden, so the CTA drops back to bottom-0. */}
      <div className="fixed inset-x-0 sm:hidden z-40 bottom-14 min-[480px]:bottom-0 border-t border-border bg-background/95 backdrop-blur-sm px-4 py-3 flex items-center gap-2">
        <button
          onClick={handleStartReading}
          className="tactile-btn flex-1 h-10 text-sm"
          style={{ ["--accent" as string]: "var(--blue-default)" }}
        >
          {progress ? <Play className="size-4 fill-current" /> : <BookOpen className="size-4" />}
          {ctaLabel}
        </button>
        <button
          onClick={toggleBookmark}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
          className={cn(
            "size-10 rounded-full border flex items-center justify-center transition-colors shrink-0",
            isBookmarked
              ? "border-[var(--tome-accent)] text-[var(--tome-accent)]"
              : "border-border text-muted-foreground"
          )}
        >
          {isBookmarked ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
        </button>
      </div>
    </>
  )
}
