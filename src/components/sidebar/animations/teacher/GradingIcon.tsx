"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase, pathDraw } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

const listLines = [
  { y: 11 },
  { y: 14 },
  { y: 17 },
]

export default function GradingIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Clipboard body */}
      <motion.rect
        x="5"
        y="4"
        width="14"
        height="18"
        rx="1.5"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        style={{ originX: "12px", originY: "22px" }}
        animate={
          isHovered
            ? { scaleY: [1, 1.03, 1] }
            : { scaleY: 1 }
        }
        transition={
          isHovered
            ? {
                duration: iconDurations.normal,
                delay: iconDurations.normal,
                ease: iconEase.scholarly,
              }
            : { duration: iconDurations.fast }
        }
      />

      {/* Clipboard clip */}
      <motion.path
        d="M9 4 L9 3 C9 1.9 9.9 1 11 1 L13 1 C14.1 1 15 1.9 15 3 L15 4"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
      />

      {/* Clip crossbar */}
      <motion.line
        x1="8"
        y1="4"
        x2="16"
        y2="4"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
      />

      {/* Horizontal list lines */}
      {listLines.map((line, i) => (
        <motion.line
          key={`line-${i}`}
          x1="8"
          y1={line.y}
          x2="16"
          y2={line.y}
          stroke="currentColor"
          strokeWidth={0.8}
          strokeLinecap={iconStroke.linecap}
          vectorEffect={iconStroke.vectorEffect}
          animate={
            isHovered
              ? { opacity: 0.4 }
              : { opacity: 0.7 }
          }
          transition={{
            duration: iconDurations.fast,
            delay: i * iconStagger,
          }}
        />
      ))}

      {/* Gold checkmark that draws itself */}
      <motion.path
        d="M9 14 L11 16.5 L16 10"
        stroke={glowColors.gold}
        strokeWidth={2}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        initial={pathDraw.hidden}
        animate={
          isHovered
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{
          duration: iconDurations.normal,
          delay: iconDurations.instant,
          ease: iconEase.outExpo,
        }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "GradingIcon",
  label: "Grading",
  description: "Clipboard with list lines, gold checkmark draws itself with path animation, clipboard does a satisfied bounce",
  animationDuration: 500,
  hasLoop: false,
  svgPaths: 7,
  category: "teacher",
}
