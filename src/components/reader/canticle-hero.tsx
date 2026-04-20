"use client"

/**
 * CanticleHero — a single hero image shown above the first canto of
 * each canticle. Loads the painting metadata from
 * `public/paintings/manifest.json` (client-fetched; small enough that
 * caching is fine). Renders a banner with a gradient scrim, the
 * painting's title + artist + year, and the canticle name.
 *
 * Returns null for any canto that is not a canticle opener or whose
 * canticle has no `coverPaintingId` declared.
 */

import { useEffect, useState } from "react"
import type { BookPart } from "@/data/books"

interface PaintingEntry {
  id: string
  title?: string
  artist?: string
  year?: string
  src?: string
  imageUrl?: string
  institution?: string
  license?: string
  caption?: string
}

interface CanticleHeroProps {
  part: BookPart
  /** 1-based canto position within the canticle. Hero renders only at 1. */
  cantoNumberInPart: number
}

// Small in-memory cache so switching cantos doesn't re-fetch.
let manifestCache: PaintingEntry[] | null = null

async function loadManifest(): Promise<PaintingEntry[]> {
  if (manifestCache) return manifestCache
  try {
    const res = await fetch("/paintings/manifest.json")
    if (!res.ok) return []
    const data = await res.json()
    manifestCache = Array.isArray(data) ? data : []
    return manifestCache
  } catch {
    return []
  }
}

export function CanticleHero({ part, cantoNumberInPart }: CanticleHeroProps) {
  const [painting, setPainting] = useState<PaintingEntry | null>(null)

  useEffect(() => {
    if (cantoNumberInPart !== 1 || !part.coverPaintingId) {
      setPainting(null)
      return
    }
    let cancelled = false
    loadManifest().then(list => {
      if (cancelled) return
      const match = list.find(p => p.id === part.coverPaintingId) ?? null
      setPainting(match)
    })
    return () => { cancelled = true }
  }, [cantoNumberInPart, part.coverPaintingId])

  if (cantoNumberInPart !== 1 || !part.coverPaintingId) return null
  if (!painting) {
    // Render a quiet placeholder band so layout doesn't jump when the
    // manifest is still loading. Colour picks up the canticle palette.
    return (
      <div
        className="mt-2 mb-5 h-44 w-full rounded-md"
        style={{
          background: part.coverColors?.primary
            ? `linear-gradient(135deg, ${part.coverColors.primary}, ${part.coverColors.secondary ?? part.coverColors.primary})`
            : "var(--muted)",
          opacity: 0.6,
        }}
        aria-hidden
      />
    )
  }

  const src = painting.src || painting.imageUrl
  if (!src) return null

  return (
    <figure
      className="mt-2 mb-6 overflow-hidden rounded-md border"
      style={{
        borderColor: part.coverColors?.accent ? `${part.coverColors.accent}33` : "rgba(212,160,76,0.2)",
      }}
    >
      <div className="relative">
        {/* Hero image — native <img> so we don't need next/image config
         *  for remote Wikimedia URLs. Loading is lazy and async. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={painting.title ? `${painting.title} — ${painting.artist ?? ""}` : part.title}
          loading="lazy"
          className="block h-48 w-full object-cover sm:h-56"
        />
        {/* Bottom-edge scrim so caption text reads over any image */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{
            background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.55))",
          }}
        />
        {/* Canticle name, top-left */}
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
        >
          {part.title}
        </span>
        {/* Painting caption, bottom */}
        <figcaption className="absolute inset-x-3 bottom-2 text-[10px] leading-snug text-white/90">
          <span className="font-serif italic">{painting.title}</span>
          {painting.artist && <span> · {painting.artist}</span>}
          {painting.year && <span> · {painting.year}</span>}
        </figcaption>
      </div>
    </figure>
  )
}
