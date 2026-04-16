"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  DEFAULT_PAINTING,
  getPaintingById,
  getStoredPaintingId,
  setStoredPaintingId,
  isExternalPainting,
  type Painting,
} from "@/lib/paintings"
import { getStoaEntry, type StoaEntry } from "@/lib/stoa"
import { BOOKS } from "@/data/books"
import { StoaPaintingSelector } from "./StoaPaintingSelector"
import { cn } from "@/lib/utils"

const FOCAL_MAP = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
} as const

export function StoaBanner() {
  const [painting, setPainting] = useState<Painting>(DEFAULT_PAINTING)
  const [stoaEntry, setStoaEntry] = useState<StoaEntry | undefined>()
  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    const stored = getStoredPaintingId()
    if (stored) {
      const found = getPaintingById(stored)
      if (found) {
        setPainting(found)
        setStoaEntry(getStoaEntry(found.id))
      }
    } else {
      setStoaEntry(getStoaEntry(DEFAULT_PAINTING.id))
    }
    setPrefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
    setMounted(true)
  }, [])

  function handleSelect(next: Painting) {
    setImgError(false)
    setPainting(next)
    setStoredPaintingId(next.id)
    setStoaEntry(getStoaEntry(next.id))
  }

  // Resolve the book for the current painting
  const book = stoaEntry
    ? BOOKS.find((b) => b.id === stoaEntry.unlockingBookId)
    : undefined

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl",
        "border border-[#D4A04C]/15",
        // Responsive aspect ratios: 3:2 mobile → 16:9 tablet → 21:9 desktop
        "aspect-[3/2] sm:aspect-[16/9] lg:aspect-[21/9]"
      )}
      style={{ backgroundColor: painting.dominantColor }}
      role="img"
      aria-label={`Banner painting: ${painting.title} by ${painting.artist}`}
    >
      {/* Painting image with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={painting.id}
          className="absolute inset-0"
          initial={mounted && !prefersReducedMotion ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {!imgError ? (
            <Image
              src={painting.src}
              alt={`${painting.title} by ${painting.artist}`}
              fill
              priority
              className={cn("object-cover", FOCAL_MAP[painting.focalPoint])}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px"
              unoptimized={!isExternalPainting(painting)}
              onError={() => {
                console.warn(`[Stoa] Failed to load painting: ${painting.id}`)
                setImgError(true)
              }}
            />
          ) : (
            /* Error fallback: dominant color bg + elegant title text */
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-serif text-lg sm:text-xl text-white/70 text-center px-8 drop-shadow-md">
                {painting.title}
              </p>
              <p className="text-xs text-white/40 mt-1 font-sans">
                {painting.artist}
                {painting.year ? `, ${painting.year}` : ""}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(26,26,46,0.75) 0%, rgba(26,26,46,0.3) 35%, transparent 60%)",
        }}
      />

      {/* Caption with book correlation */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <div className="flex flex-col gap-1">
          {/* Painting title — primary serif */}
          <p className="font-serif text-sm sm:text-base text-white/90 leading-tight drop-shadow-md">
            {painting.title}
          </p>

          {/* Painter, Year — italic serif */}
          <p className="text-[11px] sm:text-xs text-white/50 font-serif italic drop-shadow-sm">
            {painting.artist}
            {painting.year ? `, ${painting.year}` : ""}
          </p>

          {/* Book correlation — only shown when we have a stoa entry */}
          {mounted && stoaEntry && book && (
            <div className="mt-1.5">
              {/* Divider */}
              <div className="w-16 h-px bg-[#D4A04C]/30 mb-1.5" />

              {/* "Earned by completing" label */}
              <p
                className="text-[9px] sm:text-[10px] uppercase tracking-wider text-white/40 mb-0.5"
                style={{ fontVariant: "small-caps" }}
              >
                Earned by completing
              </p>

              {/* Book link */}
              <Link
                href={`/read/${book.id}`}
                className={cn(
                  "inline-block font-serif text-xs sm:text-sm",
                  "text-[#D4A04C]/90 hover:text-[#E8C878] transition-colors duration-200",
                  "drop-shadow-sm"
                )}
              >
                {book.title} — {book.author}
              </Link>

              {/* Curation note — hidden on mobile */}
              {stoaEntry.curationNote && (
                <p className="hidden lg:block mt-1 font-serif italic text-[10px] text-white/35 max-w-md leading-relaxed">
                  {stoaEntry.curationNote}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selector button — top right */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <StoaPaintingSelector
          selectedId={painting.id}
          onSelect={handleSelect}
        />
      </div>
    </div>
  )
}
