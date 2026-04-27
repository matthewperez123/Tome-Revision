"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, Flame, TrendingUp, BookOpen, Sparkles } from "lucide-react"
import { toggleFavorite, isFavorite } from "@/lib/shelves/store"
import { cn } from "@/lib/utils"
import { type TomeBook, type StructuralUnitType } from "@/data/books"
import { getShortProgress } from "@/lib/structural-units"
import { getCoverParams } from "@/components/tome/book-cover"
import { ClassicsCover } from "@/components/tome/ClassicsCover"
import { ComingSoonCover } from "@/components/tome/ComingSoonCover"
import { AuthorLink } from "@/components/tome/author-link"
import { isBookRecommended } from "@/lib/book-apparatus"
import type { getAllBookProgress } from "@/lib/book-progress"

// ── Helpers ────────────────────────────────────

function formatYear(year: number): string {
  if (year < 0) return `c. ${Math.abs(year)} BCE`
  if (year < 1500) return `c. ${year}`
  return String(year)
}

// ── Palette helpers ────────────────────────────

export const TRADITION_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  "Ancient Greek":     { bg: "rgba(14,165,233,0.14)",  text: "#0369a1",  dot: "#0EA5E9" },
  "Roman":             { bg: "rgba(239,68,68,0.14)",   text: "#b91c1c",  dot: "#EF4444" },
  "Medieval European": { bg: "rgba(245,158,11,0.14)",  text: "#92400e",  dot: "#F59E0B" },
  "Renaissance":       { bg: "rgba(217,119,6,0.14)",   text: "#78350f",  dot: "#D97706" },
  "Enlightenment":     { bg: "rgba(6,182,212,0.14)",   text: "#0e7490",  dot: "#06B6D4" },
  "Romantic":          { bg: "rgba(244,63,94,0.14)",   text: "#9f1239",  dot: "#F43F5E" },
  "Victorian":         { bg: "rgba(139,92,246,0.14)",  text: "#6d28d9",  dot: "#8B5CF6" },
  "Russian":           { bg: "rgba(99,102,241,0.14)",  text: "#3730a3",  dot: "#6366F1" },
  "American":          { bg: "rgba(34,197,94,0.14)",   text: "#166534",  dot: "#22C55E" },
  "French":            { bg: "rgba(236,72,153,0.14)",  text: "#9d174d",  dot: "#EC4899" },
  "Modernist":         { bg: "rgba(20,184,166,0.14)",  text: "#0f766e",  dot: "#14B8A6" },
  "Post-Colonial":     { bg: "rgba(16,185,129,0.14)",  text: "#065f46",  dot: "#10B981" },
  "Eastern":           { bg: "rgba(249,115,22,0.14)",  text: "#c2410c",  dot: "#F97316" },
  "Contemporary":      { bg: "rgba(167,139,250,0.14)", text: "#5b21b6",  dot: "#A78BFA" },
  "Scandinavian":      { bg: "rgba(100,116,139,0.14)", text: "#334155",  dot: "#64748B" },
  "Germanic":          { bg: "rgba(107,114,128,0.14)", text: "#374151",  dot: "#6B7280" },
  "World Literature":  { bg: "rgba(156,163,175,0.14)", text: "#4b5563",  dot: "#9CA3AF" },
  "Speculative":       { bg: "rgba(168,85,247,0.14)",  text: "#7c3aed",  dot: "#A855F7" },
  "Mystery & Crime":   { bg: "rgba(220,38,38,0.14)",   text: "#991b1b",  dot: "#DC2626" },
  "Philosophy":        { bg: "rgba(59,130,246,0.14)",   text: "#1d4ed8",  dot: "#3B82F6" },
  "Children's Literature": { bg: "rgba(251,191,36,0.14)", text: "#a16207", dot: "#FBBF24" },
  "Religious":         { bg: "rgba(180,83,9,0.14)",     text: "#92400e",  dot: "#B45309" },
  "Ancient":           { bg: "rgba(161,98,7,0.14)",     text: "#854d0e",  dot: "#A16207" },
}

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  Beginner:     { bg: "rgba(78,154,78,0.15)",   text: "#6EAA6E" },
  Intermediate: { bg: "rgba(78,134,178,0.15)",  text: "#6E9AC8" },
  Advanced:     { bg: "rgba(178,148,78,0.15)",  text: "#C8A86E" },
  Scholar:      { bg: "rgba(178,78,78,0.15)",   text: "#C87272" },
}

const TREND_ICONS: Record<string, React.ReactNode> = {
  hot:     <Flame className="size-3 text-[#D4B37A]" />,
  rising:  <TrendingUp className="size-3 text-[#6E9AC8]" />,
  steady:  <BookOpen className="size-3 text-[#B0A898]" />,
}

// ── HeartButton ────────────────────────────────

function HeartButton({ bookId }: { bookId: string }) {
  const [fav, setFav] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setFav(isFavorite(bookId))
  }, [bookId])

  if (!mounted) return null

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const result = toggleFavorite(bookId)
    setFav(result.isFavorite)
  }

  return (
    <button
      onClick={toggle}
      className="absolute bottom-1.5 left-1.5 flex size-5 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/50"
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn("size-3", fav ? "fill-rose-500 text-rose-500" : "text-white/70")}
      />
    </button>
  )
}

// ── BookCard ───────────────────────────────────

export interface BookCardProps {
  book: TomeBook
  progress?: ReturnType<typeof getAllBookProgress>[string]
  /** sm = compact grid cards, lg = recommended/featured cards */
  size?: "sm" | "lg"
  className?: string
  /** When set to "year", show the publication year below the author */
  activeSort?: string
  /** When set, renders a small gold "Recommended by X" pill in the meta area. */
  recommendedBy?: { displayName: string; username: string } | null
}

export function BookCard({ book, progress, size = "sm", className, activeSort, recommendedBy }: BookCardProps) {
  const router = useRouter()
  const coverParams = getCoverParams(book)
  const tradColor  = TRADITION_COLORS[book.tradition]  ?? { bg: "rgba(99,102,241,0.14)", text: "#4338ca", dot: "#6366F1" }
  const diffColor  = DIFFICULTY_COLORS[book.difficulty] ?? { bg: "rgba(99,102,241,0.14)", text: "#4338ca" }

  // Compute progress percentage
  const chaptersDone  = progress?.completedChapterIndices.length ?? 0
  const progressPct   = book.readProgress != null && !progress
    ? book.readProgress
    : progress
    ? Math.min(100, Math.round((chaptersDone / Math.max(book.chapters, 1)) * 100))
    : 0
  const hasProgress   = progressPct > 0 || !!progress

  const bookHref = `/book/${book.id}`

  function handleCardActivate(e: React.MouseEvent | React.KeyboardEvent) {
    // Don't steal clicks from inner interactive elements (AuthorLink, HeartButton).
    const target = e.target as HTMLElement
    if (target.closest("a, button")) return
    if ("key" in e) {
      if (e.key !== "Enter" && e.key !== " ") return
      e.preventDefault()
    }
    router.push(bookHref)
  }

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`${book.title} by ${book.author}`}
      onClick={handleCardActivate}
      onKeyDown={handleCardActivate}
      data-href={bookHref}
      className={cn(
        "group flex flex-col rounded-xl border border-border bg-card overflow-hidden cursor-pointer",
        "transition-[transform,box-shadow] duration-[var(--tome-duration-fast)] ease-[var(--tome-ease-scholarly)]",
        "hover:scale-[1.02] hover:shadow-md motion-reduce:hover:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tome-accent,#6366f1)] focus-visible:ring-offset-2",
        className
      )}
    >
      {/* ── Cover ── */}
      <div className="relative overflow-hidden">
        {isBookRecommended(book) ? (
          <ClassicsCover
            bookId={book.id}
            title={book.title}
            author={book.author}
            tradition={book.tradition}
            fallbackColors={book.coverColors}
            showTomeWordmark={size === "lg"}
            hideBand
            aspectRatio="3/4"
            className={cn(
              "w-full transition-transform duration-[var(--tome-duration-fast)] group-hover:-translate-y-0.5 rounded-none",
              size === "lg" && "min-h-[160px]"
            )}
          />
        ) : (
          <ComingSoonCover
            tradition={book.tradition}
            fallbackColors={book.coverColors}
            aspectRatio="3/4"
            className={cn(
              "w-full transition-transform duration-[var(--tome-duration-fast)] group-hover:-translate-y-0.5 rounded-none",
              size === "lg" && "min-h-[160px]"
            )}
          />
        )}

        {/* Trending badge — bottom-right */}
        {book.trending && (
          <span className="absolute bottom-1.5 right-1.5 text-xs leading-none">
            {TREND_ICONS[book.trending.trend]}
          </span>
        )}

        {/* Heart / favorite button — bottom-left */}
        <HeartButton bookId={book.id} />
      </div>

      {/* ── Meta ── */}
      <div className={cn("flex flex-col min-w-0 px-3 pt-2.5 pb-3", size === "lg" ? "gap-1" : "gap-0.5")}>
        {/* Tradition dot + label */}
        <div className="flex items-center gap-1.5">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: tradColor.dot }}
          />
          <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider truncate">
            {book.tradition}
          </span>
        </div>

        {/* "Recommended by X" pill — links to recommender's profile. */}
        {recommendedBy && (
          <Link
            href={`/profile/${recommendedBy.username}`}
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5 inline-flex w-fit items-center gap-1 rounded-full bg-[#D4A04C]/15 px-2 py-0.5 text-[9px] font-medium text-[#9c6e2b] transition-colors hover:bg-[#D4A04C]/25 dark:text-[#D4A04C]"
          >
            <Sparkles className="size-2.5" />
            <span className="truncate max-w-[120px]">
              Rec. by {recommendedBy.displayName}
            </span>
          </Link>
        )}

        <h3
          className={cn(
            "font-semibold leading-snug line-clamp-2",
            size === "lg" ? "text-sm" : "text-xs"
          )}
        >
          {book.title}
        </h3>

        <AuthorLink
          name={book.author}
          className={cn(
            "text-muted-foreground hover:text-[var(--tome-accent)] transition-colors",
            size === "lg" ? "text-xs" : "text-[10px]"
          )}
        />

        {/* Difficulty badge */}
        <span
          className="text-[10px] font-medium uppercase tracking-wider"
          style={{ color: diffColor.text }}
        >
          {book.difficulty}
        </span>

        {activeSort === "year" && book.year != null && (
          <span className="text-[10px] text-muted-foreground/60 tabular-nums">
            {formatYear(book.year)}
          </span>
        )}

        {size === "lg" && (
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">
            {book.estimatedReadingTime} · {book.wordCount.toLocaleString()} words
          </p>
        )}

        {/* ── Progress ── */}
        {hasProgress && (
          <div className={cn("mt-1.5", size === "lg" && "mt-2")}>
            {progress ? (
              <div className="flex items-center justify-between text-[9px] text-muted-foreground mb-1">
                <span>{getShortProgress((book as any).structuralUnitType ?? 'chapter', chaptersDone, book.chapters)}</span>
                <span>{progressPct}%</span>
              </div>
            ) : null}
            <div className="h-px bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progressPct}%`,
                  backgroundColor: tradColor.dot,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
