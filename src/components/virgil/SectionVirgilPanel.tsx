"use client"

import { useState } from "react"
import { Sparkles, ChevronDown } from "lucide-react"
import { VirgilSurface } from "@/components/virgil/VirgilSurface"
import { cn } from "@/lib/utils"

// Iridescent treatment is reserved for Virgil affordances only (kept in lockstep
// with <VirgilSurface> and the quiz panel).
const IRIDESCENT = "linear-gradient(110deg, #6366F1 0%, #8B5CF6 35%, #06B6D4 70%, #6366F1 100%)"

export interface SectionVirgilPanelProps {
  /** Header label, e.g. "Search the library with Virgil". */
  title: string
  /** Input placeholder, e.g. "Ask Virgil for a book…". */
  placeholder: string
  /** One-line nudge under the empty state. */
  hint: string
  /** Start expanded (default collapsed). */
  defaultOpen?: boolean
  className?: string
}

/**
 * A top-of-section Virgil search assistant. Emulates the "Generate a quiz with
 * Virgil" panel — an iridescent header on a bordered card — but collapses to a
 * single bar so it sits quietly at the top of any reader section. Expanded, it
 * streams from the librarian discovery surface to expand the section's search
 * capability (find a title by theme, era, author, or mood).
 */
export function SectionVirgilPanel({
  title,
  placeholder,
  hint,
  defaultOpen = false,
  className,
}: SectionVirgilPanelProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className={cn("overflow-hidden rounded-xl border", className)}
      style={{ borderColor: "rgba(99,102,241,0.35)" }}
    >
      {/* Iridescent header (Virgil signature) — toggles the panel */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-white"
        style={{ backgroundImage: IRIDESCENT }}
      >
        <Sparkles className="h-4 w-4 shrink-0" />
        <span className="text-xs font-semibold tracking-wide">{title}</span>
        <ChevronDown
          className={cn("ml-auto h-4 w-4 shrink-0 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="h-80">
          <VirgilSurface
            surface={{ kind: "library" }}
            placeholder={placeholder}
            hint={hint}
            hideHeader
            className="h-full rounded-none border-0"
          />
        </div>
      )}
    </div>
  )
}
