"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Crosshair, Info } from "lucide-react"
import type { CSSProperties } from "react"
import type { TomeBookVisualBible } from "@/data/living-archive"
import { cn } from "@/lib/utils"
import { LivingArchiveFallbackArt } from "./LivingArchiveFallbackArt"

interface StoaHeroProps {
  book: TomeBookVisualBible
  className?: string
}

function pngFallback(src: string): string {
  return src.replace(/\.webp$/, ".png")
}

export function StoaHero({ book, className }: StoaHeroProps) {
  const [loadFailed, setLoadFailed] = useState(false)
  const [inspected, setInspected] = useState(false)
  const focalPoint = book.assets.stoaFocalPoint

  const objectPosition = useMemo(
    () => (focalPoint ? `${focalPoint.x}% ${focalPoint.y}%` : "60% 50%"),
    [focalPoint]
  )

  const style = {
    "--stoa-accent": book.accent,
    "--stoa-hotspot-x": `${focalPoint?.x ?? 64}%`,
    "--stoa-hotspot-y": `${focalPoint?.y ?? 52}%`,
  } as CSSProperties

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden rounded-lg border border-[var(--tome-living-ink)]/12 bg-[var(--tome-living-warm-black)] text-white shadow-sm dark:border-white/10",
        className
      )}
      style={style}
      aria-labelledby="living-archive-stoa-title"
      data-testid="living-archive-stoa"
    >
      <div className="relative min-h-[560px] sm:min-h-[480px] lg:min-h-[420px]">
        {!loadFailed ? (
          <picture className="absolute inset-0 block">
            <source
              media="(max-width: 639px)"
              srcSet={book.assets.stoaMobile3x4}
              type="image/webp"
            />
            <source
              media="(min-width: 640px) and (max-width: 1023px)"
              srcSet={book.assets.stoaTablet4x3}
              type="image/webp"
            />
            <source
              media="(min-width: 1024px)"
              srcSet={book.assets.stoaDesktop16x9}
              type="image/webp"
            />
            <img
              src={pngFallback(book.assets.stoaDesktop16x9)}
              alt={book.assets.stoaAlt}
              width={1920}
              height={1080}
              className="h-full w-full object-cover"
              style={{ objectPosition }}
              loading="eager"
              decoding="async"
              onError={() => setLoadFailed(true)}
              data-testid="living-archive-stoa-image"
            />
          </picture>
        ) : (
          <LivingArchiveFallbackArt
            book={book}
            alt={book.assets.stoaAlt}
            variant="stoa"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#11131c]/90 via-[#11131c]/40 to-transparent lg:bg-[linear-gradient(90deg,rgba(17,19,28,0.92)_0%,rgba(17,19,28,0.78)_30%,rgba(17,19,28,0.22)_56%,rgba(17,19,28,0.04)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 top-[38%] bg-gradient-to-t from-[#11131c]/94 to-transparent lg:hidden" />

        <button
          type="button"
          onClick={() => setInspected((value) => !value)}
          className={cn(
            "absolute hidden size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
            "border border-white/40 bg-[#11131c]/52 text-white shadow-lg backdrop-blur-md",
            "transition-colors hover:bg-[#11131c]/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--stoa-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#11131c] md:flex"
          )}
          style={{
            left: "var(--stoa-hotspot-x)",
            top: "var(--stoa-hotspot-y)",
          }}
          aria-pressed={inspected}
          aria-label={`Inspect focal point in ${book.title} Stoa artwork`}
          data-testid="living-archive-stoa-hotspot"
        >
          <Crosshair className="size-4" aria-hidden="true" />
        </button>

        <div className="relative z-10 flex min-h-[560px] items-end px-4 py-5 sm:min-h-[480px] sm:px-6 sm:py-6 lg:min-h-[420px] lg:items-center lg:px-8">
          <div className="max-w-lg lg:max-w-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62">
              Stoa Gallery
            </p>
            <h2
              id="living-archive-stoa-title"
              className="mt-3 font-serif text-3xl font-semibold leading-none tracking-normal sm:text-4xl"
              data-testid="living-archive-stoa-title"
            >
              {book.title}
            </h2>
            <p className="mt-2 text-sm text-white/70">{book.author}</p>
            <div className="mt-4 h-1 w-16 rounded-full" style={{ backgroundColor: book.accent }} />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
              {book.archetypeLabel}
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/78">
              {book.description}
            </p>
            <p className="mt-3 hidden max-w-md font-serif text-sm italic leading-6 text-white/56 sm:block">
              {book.artistPrinciple}
            </p>
            {inspected && (
              <p
                className="mt-4 flex max-w-md items-start gap-2 text-xs leading-5 text-white/76"
                data-testid="living-archive-hotspot-note"
              >
                <Info className="mt-0.5 size-3.5 shrink-0 text-[var(--stoa-accent)]" aria-hidden="true" />
                <span>
                  The focal point is held clear of the interface rail so the Stoa can carry both navigation and narrative weight.
                </span>
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href={`/read/${book.slug}`}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold",
                  "bg-[var(--stoa-accent)] text-[#171B26] transition-colors hover:brightness-110",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#11131c]"
                )}
              >
                Enter Stoa
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href={`/book/${book.slug}`}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-md border border-white/22 px-4 text-sm font-semibold text-white/86",
                  "bg-white/8 transition-colors hover:bg-white/14",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#11131c]"
                )}
              >
                <BookOpen className="size-4" aria-hidden="true" />
                Book details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
