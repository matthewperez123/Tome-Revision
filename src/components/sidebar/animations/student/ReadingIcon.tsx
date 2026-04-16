"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

const pageLines = [
  { y: 10, delay: 0 },
  { y: 12.5, delay: 1 },
  { y: 15, delay: 2 },
]

export default function ReadingIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Book spine / center fold */}
      <motion.line
        x1="12"
        y1="4"
        x2="12"
        y2="20"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
      />

      {/* Left cover */}
      <motion.path
        d="M12 4 L4 5 L4 19 L12 20"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={isHovered ? { skewY: -3 } : { skewY: 0 }}
        transition={iconSprings.bookOpen}
      />

      {/* Right cover */}
      <motion.path
        d="M12 4 L20 5 L20 19 L12 20"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={isHovered ? { skewY: 3 } : { skewY: 0 }}
        transition={iconSprings.bookOpen}
      />

      {/* Page text lines (left side) */}
      {pageLines.map((line, i) => (
        <motion.line
          key={`left-${i}`}
          x1="6"
          y1={line.y}
          x2="10.5"
          y2={line.y}
          stroke="currentColor"
          strokeWidth={0.8}
          strokeLinecap={iconStroke.linecap}
          vectorEffect={iconStroke.vectorEffect}
          animate={
            isHovered
              ? { opacity: 1, x: -0.5, skewY: -2 }
              : { opacity: 0.4, x: 0, skewY: 0 }
          }
          transition={{
            ...iconSprings.gentle,
            delay: line.delay * iconStagger,
          }}
        />
      ))}

      {/* Page text lines (right side) */}
      {pageLines.map((line, i) => (
        <motion.line
          key={`right-${i}`}
          x1="13.5"
          y1={line.y}
          x2="18"
          y2={line.y}
          stroke="currentColor"
          strokeWidth={0.8}
          strokeLinecap={iconStroke.linecap}
          vectorEffect={iconStroke.vectorEffect}
          animate={
            isHovered
              ? { opacity: 1, x: 0.5, skewY: 2 }
              : { opacity: 0.4, x: 0, skewY: 0 }
          }
          transition={{
            ...iconSprings.gentle,
            delay: line.delay * iconStagger,
          }}
        />
      ))}

      {/* Gold bookmark ribbon */}
      <motion.path
        d="M16 4 L16 9 L17.5 7.5 L19 9 L19 4"
        stroke={glowColors.gold}
        strokeWidth={1}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill={glowColors.goldAlpha40}
        animate={
          isHovered
            ? { y: 0, opacity: 1 }
            : { y: -5, opacity: 0 }
        }
        transition={{
          ...iconSprings.gentle,
          delay: iconDurations.fast,
        }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "ReadingIcon",
  label: "Reading",
  description: "Closed book opens with fanning pages and a gold bookmark ribbon descending",
  animationDuration: 500,
  hasLoop: false,
  svgPaths: 10,
  category: "student",
}
