"use client"

import { useState, type CSSProperties } from "react"
import Image from "next/image"
import { Check, Sparkles } from "lucide-react"
import {
  type TomeBookVisualBible,
  type TomeCoverVariant,
} from "@/data/living-archive"
import { cn } from "@/lib/utils"
import { LivingArchiveFallbackArt } from "./LivingArchiveFallbackArt"

export interface TomeCoverCardProps {
  book: TomeBookVisualBible
  variant?: TomeCoverVariant
  progress?: number
  selected?: boolean
  onSelect?: () => void
  priority?: boolean
  className?: string
}

const variantLabel: Record<TomeCoverVariant, string> = {
  archive: "Archive Panel",
  gallery: "Gallery Edge",
  compact: "Shelf Compact",
}

function clampProgress(progress: number | undefined): number | undefined {
  if (progress == null || Number.isNaN(progress)) return undefined
  return Math.max(0, Math.min(100, Math.round(progress)))
}

function CoverImage({
  book,
  src,
  alt,
  priority,
  sizes,
  className,
  fallbackVariant,
}: {
  book: TomeBookVisualBible
  src: string
  alt: string
  priority?: boolean
  sizes: string
  className?: string
  fallbackVariant: "cover" | "square"
}) {
  const [loadFailed, setLoadFailed] = useState(false)
  const focalPoint = book.assets.coverFocalPoint

  if (loadFailed) {
    return (
      <LivingArchiveFallbackArt
        book={book}
        alt={alt}
        variant={fallbackVariant}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
      style={{
        objectPosition: focalPoint ? `${focalPoint.x}% ${focalPoint.y}%` : "50% 50%",
      }}
      onError={() => setLoadFailed(true)}
    />
  )
}

function ProgressMeter({ value, accent }: { value: number; accent: string }) {
  return (
    <div className="mt-2" aria-label={`Reading progress ${value}%`}>
      <div className="mb-1 flex items-center justify-between text-[10px] font-medium text-[var(--tome-living-ink)]/65 dark:text-white/60">
        <span>Progress</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--tome-living-mist)]/80 dark:bg-white/10">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: accent }}
        />
      </div>
    </div>
  )
}

function ArchiveVariant({
  book,
  progress,
  priority,
}: {
  book: TomeBookVisualBible
  progress?: number
  priority?: boolean
}) {
  return (
    <>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--tome-living-warm-black)]">
        <CoverImage
          book={book}
          src={book.assets.coverApp3x4}
          alt={book.assets.coverAlt}
          priority={priority}
          sizes="(max-width: 640px) 86vw, (max-width: 1024px) 34vw, 260px"
          fallbackVariant="cover"
          className="transition-transform duration-[var(--tome-duration-fast)] ease-[var(--tome-ease-scholarly)] group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="min-h-[150px] bg-[var(--tome-living-paper)] px-4 pb-4 pt-3 text-[var(--tome-living-ink)] dark:bg-[#181612] dark:text-[#F2EAD8]">
        <div className="mb-3 h-1 w-12 rounded-full" style={{ backgroundColor: book.accent }} />
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--tome-living-ink)]/58 dark:text-[#F2EAD8]/58">
          <Sparkles className="size-3" aria-hidden="true" />
          <span>Living Archive</span>
        </div>
        <h3 className="mt-2 line-clamp-2 font-serif text-base font-semibold leading-tight tracking-normal">
          {book.title}
        </h3>
        <p className="mt-1 text-xs text-[var(--tome-living-ink)]/68 dark:text-[#F2EAD8]/68">
          {book.author}
        </p>
        <span
          className="mt-3 inline-flex max-w-full items-center rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]"
          style={{
            borderColor: `${book.accent}66`,
            color: book.accent,
            backgroundColor: `${book.accent}14`,
          }}
        >
          {book.archetypeLabel}
        </span>
        {progress != null && <ProgressMeter value={progress} accent={book.accent} />}
      </div>
    </>
  )
}

function GalleryVariant({
  book,
  progress,
  priority,
}: {
  book: TomeBookVisualBible
  progress?: number
  priority?: boolean
}) {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--tome-living-warm-black)]">
      <CoverImage
        book={book}
        src={book.assets.coverApp3x4}
        alt={book.assets.coverAlt}
        priority={priority}
        sizes="(max-width: 640px) 86vw, (max-width: 1024px) 34vw, 280px"
        fallbackVariant="cover"
        className="transition-transform duration-[var(--tome-duration-fast)] ease-[var(--tome-ease-scholarly)] group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#11131c]/95 via-[#11131c]/68 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/64">
          {variantLabel.gallery}
        </p>
        <h3 className="mt-2 line-clamp-2 font-serif text-lg font-semibold leading-tight tracking-normal drop-shadow-sm">
          {book.title}
        </h3>
        <p className="mt-1 text-xs text-white/76">{book.author}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/86 backdrop-blur-sm"
          >
            {book.archetypeLabel}
          </span>
          {progress != null && (
            <span className="rounded-full bg-black/35 px-2 py-1 text-[10px] font-semibold text-white/82 backdrop-blur-sm">
              {progress}% read
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function CompactVariant({
  book,
  priority,
}: {
  book: TomeBookVisualBible
  priority?: boolean
}) {
  return (
    <>
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[var(--tome-living-warm-black)]">
        <CoverImage
          book={book}
          src={book.assets.coverSquare}
          alt={book.assets.coverAlt}
          priority={priority}
          sizes="(max-width: 640px) 42vw, (max-width: 1024px) 18vw, 160px"
          fallbackVariant="square"
          className="transition-transform duration-[var(--tome-duration-fast)] ease-[var(--tome-ease-scholarly)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="pt-2">
        <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-[var(--tome-living-ink)] dark:text-[#F2EAD8]">
          {book.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-[10px] text-[var(--tome-living-ink)]/62 dark:text-[#F2EAD8]/62">
          {book.author}
        </p>
      </div>
    </>
  )
}

export function TomeCoverCard({
  book,
  variant = "archive",
  progress,
  selected = false,
  onSelect,
  priority = false,
  className,
}: TomeCoverCardProps) {
  const normalizedProgress = clampProgress(progress)
  const content =
    variant === "gallery" ? (
      <GalleryVariant
        book={book}
        progress={normalizedProgress}
        priority={priority}
      />
    ) : variant === "compact" ? (
      <CompactVariant book={book} priority={priority} />
    ) : (
      <ArchiveVariant
        book={book}
        progress={normalizedProgress}
        priority={priority}
      />
    )

  const sharedClassName = cn(
    "group relative w-full text-left",
    variant === "compact"
      ? "rounded-md"
      : "overflow-hidden rounded-lg border border-[var(--tome-living-ink)]/12 bg-card shadow-sm dark:border-white/10",
    onSelect &&
      "cursor-pointer transition-[transform,box-shadow,border-color] duration-[var(--tome-duration-fast)] ease-[var(--tome-ease-scholarly)] hover:-translate-y-0.5 hover:shadow-md motion-reduce:hover:translate-y-0",
    selected &&
      "ring-2 ring-offset-2 ring-offset-background ring-[var(--tome-living-selected-accent)]",
    className
  )

  const style = {
    "--tome-living-selected-accent": book.accent,
  } as CSSProperties

  if (!onSelect) {
    return (
      <article
        className={sharedClassName}
        style={style}
        data-testid={`tome-cover-card-${book.slug}-${variant}`}
      >
        {content}
      </article>
    )
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Select ${book.title} by ${book.author}`}
      className={cn(
        sharedClassName,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tome-living-selected-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
      style={style}
      data-testid={`tome-cover-card-${book.slug}-${variant}`}
    >
      {selected && (
        <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-[var(--tome-living-warm-black)]/82 px-2 py-1 text-[10px] font-semibold text-white shadow-sm backdrop-blur-sm">
          <Check className="size-3" aria-hidden="true" />
          Selected
        </span>
      )}
      {content}
    </button>
  )
}
