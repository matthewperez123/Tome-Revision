"use client"

import { useEffect, useCallback } from "react"
import Image from "next/image"
import { X, Lock, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { PaintingMetadata } from "./PaintingMetadata"
import type { StoaEntryWithStatus } from "@/lib/stoa"

interface PaintingDetailProps {
  entry: StoaEntryWithStatus
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}

/**
 * Lightbox/modal for painting detail view.
 * Full-screen overlay with painting, metadata, and curation note.
 */
export function PaintingDetail({ entry, onClose, onPrev, onNext }: PaintingDetailProps) {
  const painting = entry.painting

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          onPrev?.()
          break
        case "ArrowRight":
          onNext?.()
          break
      }
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [handleKeyDown])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-label={`${entry.title} by ${entry.painter}`}
      aria-modal="true"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className={cn(
          "absolute top-4 right-4 z-10",
          "flex items-center justify-center size-10 rounded-full",
          "bg-white/10 hover:bg-white/20 text-white/80 hover:text-white",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A04C]/50"
        )}
        aria-label="Close"
      >
        <X className="size-5" />
      </button>

      {/* Navigation arrows */}
      {onPrev && (
        <button
          onClick={onPrev}
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 z-10",
            "flex items-center justify-center size-10 rounded-full",
            "bg-white/10 hover:bg-white/20 text-white/80 hover:text-white",
            "transition-colors duration-200"
          )}
          aria-label="Previous painting"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}
      {onNext && (
        <button
          onClick={onNext}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 z-10",
            "flex items-center justify-center size-10 rounded-full",
            "bg-white/10 hover:bg-white/20 text-white/80 hover:text-white",
            "transition-colors duration-200"
          )}
          aria-label="Next painting"
        >
          <ChevronRight className="size-5" />
        </button>
      )}

      {/* Content */}
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 max-w-5xl w-full mx-4 max-h-[90vh]">
        {/* Painting */}
        <div className="relative flex-1 max-h-[60vh] lg:max-h-[80vh] aspect-[4/3] w-full lg:w-auto">
          {painting ? (
            <Image
              src={painting.src}
              alt={entry.unlocked ? `${entry.title} by ${entry.painter}` : "Locked painting"}
              fill
              className={cn(
                "object-contain rounded-lg",
                !entry.unlocked && "blur-lg brightness-40 grayscale-[0.6]"
              )}
              sizes="(max-width: 1024px) 90vw, 50vw"
              priority
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-[#1A1A2E] rounded-lg flex items-center justify-center">
              <Lock className="size-12 text-[#B0A898]/30" />
            </div>
          )}

          {/* Lock overlay */}
          {!entry.unlocked && painting && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg">
              <div className="flex items-center justify-center size-16 rounded-full bg-black/50 backdrop-blur-sm">
                <Lock className="size-8 text-[#B0A898]/60" />
              </div>
            </div>
          )}
        </div>

        {/* Metadata panel */}
        <div className="flex-shrink-0 lg:w-72 w-full px-2">
          <PaintingMetadata entry={entry} variant="detail" />

          {/* Source institution — detail only */}
          {entry.unlocked && entry.sourceInstitution && (
            <div className="mt-4 pt-3 border-t border-[#D4A04C]/15">
              <p className="text-[10px] uppercase tracking-wider text-[#B0A898]/50 mb-1">
                Collection
              </p>
              {entry.sourceUrl ? (
                <a
                  href={entry.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#B0A898] hover:text-[#D4A04C] transition-colors"
                >
                  {entry.sourceInstitution} ↗
                </a>
              ) : (
                <p className="text-xs text-[#B0A898]">{entry.sourceInstitution}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
