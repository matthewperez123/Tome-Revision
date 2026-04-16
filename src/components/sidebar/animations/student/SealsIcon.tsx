"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

const filigreeLines = [
  { x1: 12, y1: 12, x2: 12, y2: 6, delay: 0 },
  { x1: 12, y1: 12, x2: 18, y2: 12, delay: 1 },
  { x1: 12, y1: 12, x2: 12, y2: 18, delay: 2 },
  { x1: 12, y1: 12, x2: 6, y2: 12, delay: 3 },
  { x1: 12, y1: 12, x2: 16.2, y2: 7.8, delay: 4 },
  { x1: 12, y1: 12, x2: 7.8, y2: 16.2, delay: 5 },
]

export default function SealsIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gold filigree lines (behind the seal) */}
      {filigreeLines.map((line, i) => (
        <motion.line
          key={`fil-${i}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={glowColors.gold}
          strokeWidth={0.6}
          strokeLinecap={iconStroke.linecap}
          vectorEffect={iconStroke.vectorEffect}
          animate={
            isHovered
              ? { pathLength: 1, opacity: 0.7 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            duration: iconDurations.normal,
            delay: line.delay * iconStagger + iconDurations.fast,
            ease: iconEase.scholarly,
          }}
        />
      ))}

      {/* Outer seal circle (scalloped) */}
      <motion.circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? {
                scale: [1.2, 1],
                rotate: [0, -8, 0],
                x: [0, -1, 1, -0.5, 0],
              }
            : { scale: 1, rotate: 0, x: 0 }
        }
        transition={
          isHovered
            ? {
                scale: iconSprings.stamp,
                rotate: { duration: iconDurations.normal, ease: iconEase.scholarly },
                x: { duration: iconDurations.fast, delay: 0.08 },
              }
            : { duration: iconDurations.fast }
        }
      />

      {/* Inner seal ring */}
      <motion.circle
        cx="12"
        cy="12"
        r="5"
        stroke="currentColor"
        strokeWidth={0.8}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { opacity: 1, scale: [1.15, 1] }
            : { opacity: 0.3, scale: 1 }
        }
        transition={
          isHovered
            ? { ...iconSprings.stamp, delay: 0.04 }
            : { duration: iconDurations.fast }
        }
      />

      {/* Center star emblem */}
      <motion.path
        d="M12 8.5 L13 11 L15.5 11 L13.5 12.8 L14.3 15.5 L12 13.8 L9.7 15.5 L10.5 12.8 L8.5 11 L11 11 Z"
        stroke="currentColor"
        strokeWidth={0.8}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { opacity: 1, scale: [1.2, 1] }
            : { opacity: 0, scale: 0.8 }
        }
        transition={{
          ...iconSprings.stamp,
          delay: iconDurations.instant,
        }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "SealsIcon",
  label: "Achievements",
  description: "Wax seal stamps down with impact shake, gold filigree pattern radiates from center",
  animationDuration: 500,
  hasLoop: false,
  svgPaths: 9,
  category: "student",
}
