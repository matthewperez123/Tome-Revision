"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { getBookExperience } from "@/lib/books/registry"
import { TomeCover, type TomeCoverSize } from "./TomeCover"

interface CoverStackProps {
  /** World slugs, back to front. The last slug sits on top. */
  slugs: string[]
  size?: TomeCoverSize
  /** Called when a cover in the stack is chosen (click or Enter/Space). */
  onSelect?: (slug: string) => void
  className?: string
}

// Resting pose per depth (back → front). Tactile, desk-like scatter.
const REST_POSES = [
  { rotate: -7, x: -14, y: 10 },
  { rotate: -3, x: -6, y: 4 },
  { rotate: 2, x: 2, y: -2 },
  { rotate: 6, x: 10, y: -8 },
  { rotate: 0, x: 0, y: -14 },
]

// Fanned pose when the stack is engaged (hover / focus-within).
const FAN_POSES = [
  { rotate: -14, x: -34, y: 6 },
  { rotate: -7, x: -17, y: 0 },
  { rotate: 0, x: 0, y: -6 },
  { rotate: 7, x: 17, y: 0 },
  { rotate: 14, x: 34, y: 6 },
]

/**
 * CoverStack — a tactile pile of Tome-generated covers. At rest the covers
 * sit in a loose desk-stack; on hover or keyboard focus the stack fans out
 * so each cover is visible and reachable. All motion is gated behind
 * `motion-safe:` so reduced-motion users see a static, fully legible stack.
 */
export function CoverStack({
  slugs,
  size = "card",
  onSelect,
  className,
}: CoverStackProps) {
  const [engaged, setEngaged] = useState(false)
  const visible = slugs.slice(0, 5)
  const active = visible[visible.length - 1]
  const activeExperience = active ? getBookExperience(active) : undefined

  return (
    <div
      className={cn("group relative", className)}
      onMouseEnter={() => setEngaged(true)}
      onMouseLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={() => setEngaged(false)}
    >
      <ul
        aria-label="Stack of featured book covers"
        className="relative flex items-end justify-center"
      >
        {visible.map((slug, index) => {
          const depth = Math.min(index, REST_POSES.length - 1)
          const pose = (engaged ? FAN_POSES : REST_POSES)[depth]
          const experience = getBookExperience(slug)
          const isTop = index === visible.length - 1
          return (
            <li
              key={slug}
              className={cn(
                "relative w-24 transition-transform duration-300 ease-out motion-reduce:transition-none sm:w-28",
                index > 0 && "-ml-14 sm:-ml-16",
              )}
              style={{
                transform: `translate(${pose.x}px, ${pose.y}px) rotate(${pose.rotate}deg)`,
                zIndex: index,
              }}
            >
              <button
                type="button"
                onClick={() => onSelect?.(slug)}
                aria-label={
                  experience
                    ? `${experience.title} by ${experience.author}`
                    : slug
                }
                className={cn(
                  "block w-full rounded-xl outline-none transition-shadow",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isTop ? "shadow-lg" : "shadow-md",
                  "motion-safe:hover:-translate-y-1.5",
                )}
              >
                <TomeCover slug={slug} size={size} showProvenanceBadge={false} />
              </button>
            </li>
          )
        })}
      </ul>
      {activeExperience && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {activeExperience.title}
          </span>{" "}
          · {activeExperience.author}
        </p>
      )}
    </div>
  )
}
