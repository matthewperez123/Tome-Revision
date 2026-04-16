"use client"

import { useReducedMotion } from "framer-motion"
import type { SVGProps, ReactNode } from "react"

interface AnimatedSvgProps extends SVGProps<SVGSVGElement> {
  label: string
  isHovered: boolean
  children: ReactNode
}

/**
 * Accessible SVG wrapper for animated sidebar icons.
 *
 * - Adds `role="img"` and `aria-label` for screen readers
 * - Applies `will-change: transform` only during active animation
 * - In `prefers-reduced-motion`, replaces all transforms with a 150ms opacity crossfade
 */
export function AnimatedSvg({
  label,
  isHovered,
  children,
  className,
  ...props
}: AnimatedSvgProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
      className={className}
      style={{
        willChange: isHovered ? "transform" : "auto",
        ...(prefersReducedMotion
          ? { transition: "opacity 150ms ease", opacity: isHovered ? 0.85 : 1 }
          : {}),
      }}
      data-reduced-motion={prefersReducedMotion ? "true" : undefined}
      {...props}
    >
      {children}
    </svg>
  )
}

/**
 * Hook for icons to check if they should skip transforms.
 * When true, icons should only use opacity crossfades (150ms).
 */
export { useReducedMotion }
