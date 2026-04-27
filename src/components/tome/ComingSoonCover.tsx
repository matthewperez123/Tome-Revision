"use client"

import { cn } from "@/lib/utils"

// Tradition band colors — kept in sync with ClassicsCover so Coming Soon
// covers feel like part of the same visual family.
const TRADITION_COLORS: Record<string, string> = {
  "Ancient Greek":     "#1E3A5F",
  "Roman":             "#6B1414",
  "Medieval European": "#1B4332",
  "Renaissance":       "#3D1A6E",
  "Enlightenment":     "#0F2744",
  "Romantic":          "#4A0E2D",
  "Victorian":         "#2D1B5E",
  "Russian":           "#5C1A1A",
  "American":          "#143220",
  "French":            "#0A1F3D",
  "Modernist":         "#111111",
  "Eastern":           "#5C2800",
  "Scandinavian":      "#1E293B",
  "Germanic":          "#1F2937",
  "World Literature":  "#1A1A2E",
}

const DEFAULT_BG = "#1A1A2E"

export interface ComingSoonCoverProps {
  tradition: string
  fallbackColors?: { primary: string; secondary: string; accent: string }
  className?: string
  aspectRatio?: "2/3" | "3/4" | "1/1"
}

export function ComingSoonCover({
  tradition,
  fallbackColors = { primary: "#1E3A5F", secondary: "#0F2744", accent: "#C9A84C" },
  className,
  aspectRatio = "2/3",
}: ComingSoonCoverProps) {
  const bandColor = TRADITION_COLORS[tradition] ?? DEFAULT_BG
  const accentGold = "#C9A84C"

  const gradient = `linear-gradient(160deg, ${fallbackColors.secondary} 0%, ${fallbackColors.primary} 55%, ${bandColor} 100%)`

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm select-none",
        "shadow-[0_4px_24px_rgba(0,0,0,0.45),0_1px_4px_rgba(0,0,0,0.3)]",
        className
      )}
      style={{
        aspectRatio,
        containerType: "inline-size",
        background: gradient,
      }}
      aria-label="Coming soon"
    >
      {/* Centered "Coming Soon" label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[8%]">
        <span
          className="font-sans uppercase text-white/55"
          style={{
            fontSize: "clamp(0.45rem, 1.8cqw, 0.7rem)",
            letterSpacing: "0.35em",
            fontWeight: 500,
          }}
        >
          Tome
        </span>
        <span
          aria-hidden="true"
          className="my-[6%] block"
          style={{
            height: "1px",
            width: "45%",
            background: `linear-gradient(to right, transparent, ${accentGold}CC, transparent)`,
          }}
        />
        <span
          className="font-serif text-white"
          style={{
            fontSize: "clamp(0.7rem, 3.6cqw, 1.15rem)",
            letterSpacing: "0.04em",
            fontWeight: 700,
            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            lineHeight: 1.15,
          }}
        >
          Coming Soon
        </span>
      </div>

      {/* Gold/white border frame (inset) — matches ClassicsCover */}
      <div
        aria-hidden="true"
        className="absolute inset-1 pointer-events-none rounded-[1px]"
        style={{
          border: `1px solid ${accentGold}55`,
        }}
      />
    </div>
  )
}
