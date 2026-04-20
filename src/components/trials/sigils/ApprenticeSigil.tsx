import type { SVGProps } from "react"

export interface SigilProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

/**
 * Apprentice sigil — a single laurel leaf, stroked.
 * One-color, flat vector, stroke-width 1.5.
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
      <path d="M12 21 L12 6" />
      {/* Leaf blade — teardrop arch around stem */}
      <path d="M12 6 C 7 7, 5.5 11.5, 7.5 16 C 9 17, 11 16.5, 12 15" />
      <path d="M12 6 C 17 7, 18.5 11.5, 16.5 16 C 15 17, 13 16.5, 12 15" />
      {/* Central vein */}
      <path d="M12 7.5 L12 14.5" opacity={0.5} />
    </svg>
  )
}
