"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import type { StoaEntryWithStatus } from "@/lib/stoa"

interface PaintingMetadataProps {
  entry: StoaEntryWithStatus
  variant: "card" | "detail"
  className?: string
}

/**
 * Shared metadata block for the Stoa painting gallery.
 *
 * UNLOCKED:
 *   Painting Title
 *   Painter, Year
 *   ─── divider ───
 *   "Earned by completing"
 *   Book Title — Author  (gold link)
 *
 * LOCKED:
 *   "Unlock by reading [Book Title] — [Author]"
 *   Progress indicator if started
 */
export function PaintingMetadata({ entry, variant, className }: PaintingMetadataProps) {
  const isDetail = variant === "detail"

  if (entry.unlocked) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {/* Title — primary serif */}
        <h3
          className={cn(
            "font-serif leading-tight text-[#F5F0E8]",
            isDetail ? "text-lg sm:text-xl" : "text-sm sm:text-base"
          )}
        >
          {entry.title}
        </h3>

        {/* Painter, Year — italic serif */}
        <p
          className={cn(
            "font-serif italic text-[#B0A898]",
            isDetail ? "text-sm" : "text-xs"
          )}
        >
          {entry.painter}, {entry.year}
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-[#D4A04C]/30 my-1" />

        {/* "Earned by completing" label */}
        <p
          className={cn(
            "uppercase tracking-wider text-[#F5F0E8]/60",
            isDetail ? "text-[11px]" : "text-[9px]"
          )}
          style={{ fontVariant: "small-caps" }}
        >
          Earned by completing
        </p>

        {/* Book link */}
        <Link
          href={`/read/${entry.unlockingBookId}`}
          className={cn(
            "font-serif text-[#D4A04C] hover:text-[#E8C878] transition-colors duration-200",
            "underline decoration-[#D4A04C]/30 hover:decoration-[#D4A04C]/60",
            isDetail ? "text-sm" : "text-xs"
          )}
        >
          {entry.bookTitle} — {entry.bookAuthor}
        </Link>

        {/* Curation note — detail view only */}
        {isDetail && entry.curationNote && (
          <p className="font-serif italic text-xs text-[#B0A898]/80 mt-2 leading-relaxed max-w-md">
            {entry.curationNote}
          </p>
        )}
      </div>
    )
  }

  // --- LOCKED ---
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <p
        className={cn(
          "font-serif text-[#B0A898]/80",
          isDetail ? "text-sm" : "text-xs"
        )}
      >
        Unlock by reading{" "}
        <Link
          href={`/read/${entry.unlockingBookId}`}
          className="text-[#D4A04C] hover:text-[#E8C878] transition-colors underline decoration-[#D4A04C]/30"
        >
          {entry.bookTitle} — {entry.bookAuthor}
        </Link>
      </p>

      {/* Progress indicator */}
      {entry.completionPercent > 0 && (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-1 rounded-full bg-[#F5F0E8]/10 overflow-hidden",
              isDetail ? "w-32" : "w-20"
            )}
          >
            <div
              className="h-full rounded-full bg-[#D4A04C]/60 transition-all duration-300"
              style={{ width: `${entry.completionPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-[#B0A898]/60 font-sans">
            {entry.completionPercent}% complete — keep reading
          </span>
        </div>
      )}
    </div>
  )
}
