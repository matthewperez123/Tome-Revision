"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { PaintingMetadata } from "./PaintingMetadata"
import type { StoaEntryWithStatus } from "@/lib/stoa"

interface PaintingCardProps {
  entry: StoaEntryWithStatus
  onClick?: () => void
}

/**
 * Grid card for the Stoa painting gallery.
 * - Unlocked: shows painting with metadata
 * - Locked: blurred silhouette, routes to book reader on click
 */
export function PaintingCard({ entry, onClick }: PaintingCardProps) {
  const router = useRouter()
  const painting = entry.painting

  function handleClick() {
    if (!entry.unlocked) {
      // Locked paintings route to the book's reader
      router.push(`/read/${entry.unlockingBookId}`)
      return
    }
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group relative flex flex-col text-left rounded-xl overflow-hidden",
        "border border-[#D4A04C]/10 hover:border-[#D4A04C]/30",
        "bg-[#1A1A2E]/50 backdrop-blur-sm",
        "transition-all duration-200 hover:shadow-lg hover:shadow-black/20",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A04C]/50"
      )}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {painting ? (
          <Image
            src={painting.src}
            alt={entry.unlocked ? `${entry.title} by ${entry.painter}` : "Locked painting"}
            fill
            className={cn(
              "object-cover transition-all duration-300",
              !entry.unlocked && "blur-md brightness-50 grayscale-[0.6]",
              entry.unlocked && "group-hover:scale-[1.02]"
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-[#1A1A2E]" />
        )}

        {/* Lock icon overlay */}
        {!entry.unlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center justify-center size-10 rounded-full bg-black/40 backdrop-blur-sm">
              <Lock className="size-5 text-[#B0A898]/60" />
            </div>
          </div>
        )}

        {/* Curation tier badge — unlocked only, detail affordance */}
        {entry.unlocked && entry.curationTier === 1 && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#D4A04C]/80 text-[8px] font-bold text-white uppercase tracking-wider">
            Scene
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="p-3">
        <PaintingMetadata entry={entry} variant="card" />
      </div>
    </button>
  )
}
