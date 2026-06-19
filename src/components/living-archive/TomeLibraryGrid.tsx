"use client"

import { useEffect, useMemo, useState, type KeyboardEvent } from "react"
import { Grid2X2, Images, PanelsTopLeft } from "lucide-react"
import {
  getLivingArchiveBooks,
  TOME_LIVING_ARCHIVE_DEFAULT_SLUG,
  type TomeBookVisualBible,
  type TomeCoverVariant,
} from "@/data/living-archive"
import { BOOKS } from "@/data/books"
import type { BookProgress } from "@/lib/book-progress"
import { cn } from "@/lib/utils"
import { StoaHero } from "./StoaHero"
import { TomeCoverCard } from "./TomeCoverCard"

interface TomeLibraryGridProps {
  progressByBookId?: Record<string, BookProgress>
  className?: string
}

const STORAGE_KEY = "tome-living-archive-view"

const VIEW_OPTIONS: {
  value: TomeCoverVariant
  label: string
  icon: typeof PanelsTopLeft
}[] = [
  { value: "archive", label: "Archive Panel", icon: PanelsTopLeft },
  { value: "gallery", label: "Gallery Edge", icon: Images },
  { value: "compact", label: "Shelf Compact", icon: Grid2X2 },
]

function getProgressPercent(
  book: TomeBookVisualBible,
  progressByBookId?: Record<string, BookProgress>
): number | undefined {
  const progress = progressByBookId?.[book.slug]
  if (!progress) {
    const catalogBook = BOOKS.find((item) => item.id === book.slug)
    return catalogBook?.readProgress
  }

  const catalogBook = BOOKS.find((item) => item.id === book.slug)
  if (!catalogBook) return undefined

  return Math.min(
    100,
    Math.round(
      (progress.completedChapterIndices.length / Math.max(catalogBook.chapters, 1)) *
        100
    )
  )
}

export function TomeLibraryGrid({
  progressByBookId,
  className,
}: TomeLibraryGridProps) {
  const books = useMemo(() => getLivingArchiveBooks(), [])
  const [variant, setVariant] = useState<TomeCoverVariant>("archive")
  const [selectedSlug, setSelectedSlug] = useState(TOME_LIVING_ARCHIVE_DEFAULT_SLUG)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as TomeCoverVariant | null
      if (stored && VIEW_OPTIONS.some((option) => option.value === stored)) {
        setVariant(stored)
      }
    } catch {}
  }, [])

  function selectVariant(next: TomeCoverVariant) {
    setVariant(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }

  function handleViewKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    value: TomeCoverVariant
  ) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    event.preventDefault()
    const index = VIEW_OPTIONS.findIndex((option) => option.value === value)
    const direction = event.key === "ArrowRight" ? 1 : -1
    const nextIndex = (index + direction + VIEW_OPTIONS.length) % VIEW_OPTIONS.length
    const next = VIEW_OPTIONS[nextIndex]
    selectVariant(next.value)
    document.getElementById(`living-archive-view-${next.value}`)?.focus()
  }

  const selectedBook =
    books.find((book) => book.slug === selectedSlug) ?? books[0]

  return (
    <section
      id="living-archive-stoa"
      className={cn(
        "-mx-4 border-y border-[var(--tome-living-ink)]/12 bg-[var(--tome-living-paper)] px-4 py-6 text-[var(--tome-living-ink)] dark:border-white/10 dark:bg-[#11100d]",
        className
      )}
      aria-labelledby="living-archive-heading"
      data-testid="living-archive-system"
    >
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--tome-living-ink)]/58 dark:text-[#F2EAD8]/58">
              Production Pilot
            </p>
            <h2
              id="living-archive-heading"
              className="mt-1 font-serif text-2xl font-semibold leading-tight tracking-normal text-[var(--tome-living-ink)] dark:text-[#F2EAD8]"
            >
              Tome Living Archive
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Living Archive cover layout"
            className="inline-flex w-full gap-1 rounded-lg border border-[var(--tome-living-ink)]/12 bg-white/60 p-1 dark:border-white/10 dark:bg-white/5 sm:w-auto"
          >
            {VIEW_OPTIONS.map((option) => {
              const Icon = option.icon
              const isSelected = variant === option.value
              return (
                <button
                  key={option.value}
                  id={`living-archive-view-${option.value}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls="living-archive-card-panel"
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => selectVariant(option.value)}
                  onKeyDown={(event) => handleViewKeyDown(event, option.value)}
                  className={cn(
                    "flex h-9 flex-1 items-center justify-center gap-2 rounded-md px-3 text-xs font-semibold transition-colors sm:flex-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tome-living-ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tome-living-paper)]",
                    isSelected
                      ? "bg-[var(--tome-living-ink)] text-white shadow-sm dark:bg-[#F2EAD8] dark:text-[#171B26]"
                      : "text-[var(--tome-living-ink)]/65 hover:bg-white dark:text-[#F2EAD8]/68 dark:hover:bg-white/10"
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  <span>{option.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <StoaHero book={selectedBook} />

        <div
          id="living-archive-card-panel"
          role="tabpanel"
          aria-labelledby={`living-archive-view-${variant}`}
          className={cn(
            "grid gap-4",
            variant === "compact"
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}
          data-testid={`living-archive-card-panel-${variant}`}
        >
          {books.map((book, index) => (
            <TomeCoverCard
              key={book.slug}
              book={book}
              variant={variant}
              progress={getProgressPercent(book, progressByBookId)}
              selected={selectedBook.slug === book.slug}
              onSelect={() => setSelectedSlug(book.slug)}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
