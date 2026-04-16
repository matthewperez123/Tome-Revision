"use client"

import { motion } from "framer-motion"
import { iconSprings, glowColors, iconStroke, iconDurations, iconEase, pathDraw } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

export default function BookmarksIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ribbon body — main bookmark shape */}
      <motion.path
        d="M8 2 L8 18 L12 14.5 L16 18 L16 2 Z"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinejoin={iconStroke.linejoin}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
      />

      {/* Ribbon unfurl extension — the tail that drops down on hover */}
      <motion.path
        d="M8 18 Q9 19.5 10 20.5 Q11 21.5 12 22"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        initial={pathDraw.hidden}
        animate={
          isHovered
            ? { pathLength: 1, opacity: 1, x: [0, 0.5, -0.3, 0] }
            : pathDraw.hidden
        }
        transition={{
          pathLength: { duration: iconDurations.normal, ease: "easeOut" },
          opacity: { duration: iconDurations.fast },
          x: {
            duration: iconDurations.slow,
            ease: iconEase.scholarly as [number, number, number, number],
          },
        }}
      />

      {/* Right ribbon tail */}
      <motion.path
        d="M16 18 Q15 19.5 14 20.5 Q13 21.5 12 22"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        initial={pathDraw.hidden}
        animate={
          isHovered
            ? { pathLength: 1, opacity: 1, x: [0, -0.5, 0.3, 0] }
            : pathDraw.hidden
        }
        transition={{
          pathLength: { duration: iconDurations.normal, ease: "easeOut" },
          opacity: { duration: iconDurations.fast },
          x: {
            duration: iconDurations.slow,
            ease: iconEase.scholarly as [number, number, number, number],
          },
        }}
      />

      {/* Gold diamond ornament at tip */}
      <motion.path
        d="M12 20.5 L13 22 L12 23.5 L11 22 Z"
        fill={glowColors.gold}
        stroke={glowColors.gold}
        strokeWidth={0.5}
        vectorEffect={iconStroke.vectorEffect}
        animate={
          isHovered
            ? { opacity: [0, 0, 1], scale: [0.5, 0.5, 1] }
            : { opacity: 0, scale: 0.5 }
        }
        transition={{
          duration: iconDurations.slow,
          ease: "easeOut",
          delay: iconDurations.normal,
        }}
        style={{ originX: "12px", originY: "22px" }}
      />

      {/* Subtle gold glow behind diamond */}
      <motion.circle
        cx="12"
        cy="22"
        r="2"
        fill={glowColors.goldAlpha20}
        animate={isHovered ? { opacity: 0.7, scale: 1 } : { opacity: 0, scale: 0.3 }}
        transition={{
          duration: iconDurations.normal,
          delay: iconDurations.normal,
        }}
        style={{ filter: "blur(2px)" }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "BookmarksIcon",
  label: "Bookmarks",
  description: "Ribbon bookmark unfurls downward with gentle wave, gold diamond ornament fades in at tip",
  animationDuration: 500,
  hasLoop: false,
  svgPaths: 6,
  category: "student",
}
