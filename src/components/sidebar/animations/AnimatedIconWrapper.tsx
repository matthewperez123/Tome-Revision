"use client"

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { motion, useReducedMotion } from "framer-motion"
import { iconStagger, iconDurations } from "@/lib/animations/sidebar-tokens"

const HOVER_DELAY_MS = 60

interface AnimatedIconWrapperProps {
  isActive: boolean
  /** Index in sidebar list — used for staggered mount cascade */
  index?: number
  children: (isHovered: boolean) => ReactNode
}

export function AnimatedIconWrapper({
  isActive,
  index = 0,
  children,
}: AnimatedIconWrapperProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prefersReducedMotion = useReducedMotion()

  // 60ms hover delay to prevent flicker on quick mouse passes
  const handleMouseEnter = useCallback(() => {
    hoverTimerRef.current = setTimeout(() => setIsHovered(true), HOVER_DELAY_MS)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    setIsHovered(false)
  }, [])

  // Touch: trigger once on tap, then let navigation happen
  const handleTouchStart = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleTouchEnd = useCallback(() => {
    // Let animation play briefly before clearing
    setTimeout(() => setIsHovered(false), 400)
  }, [])

  // Keyboard focus produces same hover visual
  const handleFocus = useCallback(() => setIsFocused(true), [])
  const handleBlur = useCallback(() => setIsFocused(false), [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    }
  }, [])

  const showHoverState = isHovered || isFocused

  return (
    <motion.span
      className="size-4 relative inline-flex items-center justify-center"
      // Staggered mount cascade (top to bottom, 0.05s per icon)
      initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: iconDurations.fast,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onFocus={handleFocus}
      onBlur={handleBlur}
      // Focus ring: 2px gold offset on keyboard focus
      style={isFocused ? {
        outline: "2px solid rgba(234, 179, 8, 0.7)",
        outlineOffset: "2px",
        borderRadius: "2px",
      } : undefined}
      tabIndex={-1}
      data-animating={showHoverState || isActive ? "true" : undefined}
    >
      {children(showHoverState)}
    </motion.span>
  )
}
