"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { getBookExperience } from "@/lib/books/registry"
import type { BookExperience } from "@/lib/books/types"

export type TomeCoverSize = "thumb" | "card" | "hero"

const SIZE_CONFIG: Record<
  TomeCoverSize,
  { width: number; height: number; sizes: string; badge: boolean }
> = {
  thumb: { width: 96, height: 128, sizes: "96px", badge: false },
  card: { width: 300, height: 400, sizes: "(max-width: 640px) 45vw, 300px", badge: true },
  hero: { width: 600, height: 800, sizes: "(max-width: 640px) 90vw, 600px", badge: true },
}

interface TomeCoverProps {
  /** Living Archive world slug (e.g. "alice") or canonical book ID. */
  slug: string
  size?: TomeCoverSize
  /** Force-show or hide the provenance badge (defaults per size). */
  showProvenanceBadge?: boolean
  /** Prioritize loading (above-the-fold hero use only). */
  priority?: boolean
  className?: string
}

/**
 * TomeCover — renders a featured book's Tome-generated vector cover
 * (public/covers/tome-generated/) with a palette-matched loading state and
 * a provenance badge distinguishing original Tome art from public-domain
 * source covers (MASTER_EXECUTION_PLAN §10 provenance rules).
 *
 * Unknown slugs render a quiet procedural fallback panel rather than a
 * broken image, so grids stay safe while data is being wired up.
 */
export function TomeCover({
  slug,
  size = "card",
  showProvenanceBadge,
  priority = false,
  className,
}: TomeCoverProps) {
  const experience = getBookExperience(slug)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  const config = SIZE_CONFIG[size]
  const badge = showProvenanceBadge ?? config.badge

  if (!experience || failed) {
    return (
      <FallbackPanel
        experience={experience}
        size={size}
        className={className}
      />
    )
  }

  return (
    <figure
      className={cn(
        "relative aspect-[3/4] w-full overflow-hidden rounded-xl shadow-md",
        className,
      )}
      style={{ backgroundColor: experience.palette.ground }}
    >
      {/* Palette-matched loading shimmer; never a gray placeholder. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          loaded ? "opacity-0" : "opacity-100",
        )}
        style={{
          background: `linear-gradient(160deg, ${experience.palette.primary}33, ${experience.palette.ground})`,
        }}
      />
      <Image
        src={experience.coverAssets.webp}
        alt={experience.altText}
        width={config.width}
        height={config.height}
        sizes={config.sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
        )}
        unoptimized
      />
      {badge && (
        <figcaption className="absolute bottom-2 left-2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide text-white/90 backdrop-blur-sm"
            style={{ backgroundColor: `${experience.palette.ink}B3` }}
            title={experience.provenanceNote}
          >
            <span
              aria-hidden
              className="inline-block size-1.5 rounded-full"
              style={{ backgroundColor: experience.palette.gold }}
            />
            Tome original
          </span>
        </figcaption>
      )}
    </figure>
  )
}

function FallbackPanel({
  experience,
  size,
  className,
}: {
  experience: BookExperience | undefined
  size: TomeCoverSize
  className?: string
}) {
  const label = experience
    ? `${experience.title} cover art is being prepared`
    : "Cover art is being prepared"
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative flex aspect-[3/4] w-full items-center justify-center rounded-xl bg-muted",
        size === "thumb" && "rounded-md",
        className,
      )}
    >
      <span
        aria-hidden
        className="size-8 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground/70 motion-safe:animate-spin"
      />
    </div>
  )
}
