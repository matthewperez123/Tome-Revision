import type { SVGProps } from "react"

export interface SigilProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

/**
 * Initiate sigil (tier key "Apprentice") — a single upright laurel leaf.
 *
 * Tier 1 of the coherent Trials sigil family: one leaf → paired sprig
 * (Adept) → laurel crown (Laureate). Shared geometry: viewBox 24, stroke
 * 1.5, round caps/joins, a symmetric rounded-vesica leaf primitive, and a
 * half-opacity midrib. Color is driven by a tier token (var(--trial-*)).
 */
export function ApprenticeSigil({
  size = 24,
  color = "currentColor",
  ...rest
}: SigilProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {/* Stem */}
      <path d="M12 21V12" />
      {/* Symmetric leaf blade (rounded vesica) */}
      <path d="M12 3.5C9 6 9 10 12 12C15 10 15 6 12 3.5Z" />
      {/* Midrib */}
      <path d="M12 5.2V11" opacity={0.45} />
    </svg>
  )
}
