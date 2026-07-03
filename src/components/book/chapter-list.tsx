"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, ChevronDown, LayoutList, Play } from "lucide-react"
import { motion } from "framer-motion"
import type { TomeChapter } from "@/data/chapters"
import type { StructuralUnitType } from "@/data/books"
import { getUnitLabel } from "@/lib/structural-units"
import { getBookProgress, type BookProgress } from "@/lib/book-progress"
import { cn } from "@/lib/utils"

const INITIAL_CHAPTERS = 5

type ChapterStatus = "completed" | "current" | "available"

function getChapterStatus(index: number, progress: BookProgress | null): ChapterStatus {
  if (!progress) return "available"
  if (progress.completedChapterIndices.includes(index)) return "completed"
  if (index === progress.currentChapterIndex) return "current"
  return "available"
}

/**
 * Client island for the book detail page's table of contents.
 *
 * Renders EVERY chapter as an <a href="/read/…"> link so the full TOC ships in
 * the server HTML for SEO. Chapters beyond the first five are kept in the DOM
 * (CSS-collapsed) until "Show all" is toggled, so they remain crawlable.
 * Per-chapter completed/current status is read from localStorage after
 * hydration — an SSR-safe enhancement.
 */
export function ChapterList({
  chapters,
  bookId,
  structuralUnitType,
}: {
  chapters: TomeChapter[]
  bookId: string
  structuralUnitType: StructuralUnitType
}) {
  const [progress, setProgress] = useState<BookProgress | null>(null)
  const [showAllChapters, setShowAllChapters] = useState(false)

  useEffect(() => {
    setProgress(getBookProgress(bookId))
  }, [bookId])

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <LayoutList className="size-4" style={{ color: "var(--indigo-default)" }} />
          {getUnitLabel(structuralUnitType, true)}
          <span className="font-normal normal-case tracking-normal">({chapters.length})</span>
        </h2>
      </div>

      {chapters.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-xs text-muted-foreground">{getUnitLabel(structuralUnitType)} list coming soon.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {chapters.map((chapter, i) => (
            <div key={chapter.id} className={cn(!showAllChapters && i >= INITIAL_CHAPTERS && "hidden")}>
              <ChapterRow
                chapter={chapter}
                index={i}
                status={getChapterStatus(i, progress)}
                bookId={bookId}
              />
            </div>
          ))}

          {chapters.length > INITIAL_CHAPTERS && (
            <button
              onClick={() => setShowAllChapters((v) => !v)}
              className="w-full flex items-center justify-center gap-1.5 py-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <motion.span
                animate={{ rotate: showAllChapters ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="size-4" />
              </motion.span>
              {showAllChapters
                ? `Show fewer ${getUnitLabel(structuralUnitType, true).toLowerCase()}`
                : `Show all ${chapters.length} ${getUnitLabel(structuralUnitType, true).toLowerCase()}`}
            </button>
          )}
        </div>
      )}
    </section>
  )
}

function ChapterRow({
  chapter,
  index,
  status,
  bookId,
}: {
  chapter: TomeChapter
  index: number
  status: ChapterStatus
  bookId: string
}) {
  return (
    <a href={`/read/${bookId}?ch=${index}`}>
      <div
        className={cn(
          "flex items-start gap-3 rounded-xl border p-3 transition-all duration-150",
          status === "current" && "border-[var(--tome-accent)]/40 bg-[color-mix(in_srgb,var(--tome-accent)_5%,transparent)]",
          status === "completed" && "border-border/40 bg-muted/30 opacity-75",
          status === "available" && "border-border bg-card hover:border-foreground/20 hover:shadow-sm",
        )}
      >
        {/* Chapter number */}
        <span
          className={cn(
            "shrink-0 w-7 text-center font-mono text-xs pt-0.5",
            status === "current" ? "text-[var(--tome-accent)] font-bold"
            : status === "completed" ? "text-muted-foreground/50"
            : "text-muted-foreground/60"
          )}
        >
          {index + 1}
        </span>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-xs font-medium leading-snug",
            status === "completed" && "line-through decoration-muted-foreground/40",
          )}>
            {chapter.title}
          </p>
          {chapter.summary && (
            <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{chapter.summary}</p>
          )}
          <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground/60">
            <span>{chapter.wordCount.toLocaleString()} words</span>
            <span>·</span>
            <span>~{chapter.estimatedMinutes} min</span>
            {chapter.quizAvailable && (
              <>
                <span>·</span>
                <span className="text-[var(--tome-accent)]/70">Quiz</span>
              </>
            )}
          </div>
        </div>

        {/* Status icon */}
        <div className="shrink-0 pt-0.5">
          {status === "completed" && (
            <CheckCircle2 className="size-4 text-emerald-500" />
          )}
          {status === "current" && (
            <Play className="size-3.5 fill-[var(--tome-accent)] text-[var(--tome-accent)]" />
          )}
        </div>
      </div>
    </a>
  )
}
