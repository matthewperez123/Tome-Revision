"use client"

import { motion } from "framer-motion"
import { iconStagger, glowColors, iconStroke, iconDurations, iconEase } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

// Laurel leaves arranged in a wreath — left and right arcs
const leftLeaves = [
  "M6 18 Q4 17 5 15.5 Q6.5 16.5 6 18",
  "M5 15 Q3 13.5 4.5 12 Q6 13.5 5 15",
  "M5 12 Q3.5 10 5.5 9 Q6.5 11 5 12",
  "M6 9 Q5 7 7 6 Q7.5 8.5 6 9",
  "M7.5 7 Q7 5 9 4 Q9 6.5 7.5 7",
]

const rightLeaves = [
  "M18 18 Q20 17 19 15.5 Q17.5 16.5 18 18",
  "M19 15 Q21 13.5 19.5 12 Q18 13.5 19 15",
  "M19 12 Q20.5 10 18.5 9 Q17.5 11 19 12",
  "M18 9 Q19 7 17 6 Q16.5 8.5 18 9",
  "M16.5 7 Q17 5 15 4 Q15 6.5 16.5 7",
]

const allLeaves = [...leftLeaves, ...rightLeaves]

export default function TrialsIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shimmer sweep overlay */}
      <defs>
        <linearGradient id="wreath-shimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={glowColors.gold} stopOpacity="0" />
          <stop offset="50%" stopColor={glowColors.gold} stopOpacity="0.4" />
          <stop offset="100%" stopColor={glowColors.gold} stopOpacity="0" />
        </linearGradient>
        <clipPath id="wreath-clip">
          <circle cx="12" cy="12" r="10" />
        </clipPath>
      </defs>

      {/* Wreath leaves */}
      {allLeaves.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth={iconStroke.width}
          strokeLinecap={iconStroke.linecap}
          strokeLinejoin={iconStroke.linejoin}
          vectorEffect={iconStroke.vectorEffect}
          fill="none"
          animate={
            isHovered
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0.3 }
          }
          transition={{
            pathLength: {
              duration: iconDurations.normal,
              delay: i * iconStagger,
              ease: iconEase.scholarly,
            },
            opacity: {
              duration: iconDurations.fast,
              delay: i * iconStagger,
            },
          }}
        />
      ))}

      {/* Bottom tie / ribbon */}
      <motion.path
        d="M10 19 L12 20 L14 19"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
      />

      {/* Gold shimmer sweep */}
      <motion.rect
        x={-6}
        y={2}
        width={6}
        height={20}
        fill="url(#wreath-shimmer)"
        clipPath="url(#wreath-clip)"
        animate={
          isHovered
            ? { x: [-6, 26] }
            : { x: -6, opacity: 0 }
        }
        transition={{
          x: {
            duration: iconDurations.slow,
            delay: allLeaves.length * iconStagger + iconDurations.fast,
            ease: "easeInOut",
          },
        }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "TrialsIcon",
  label: "Quizzes",
  description: "Laurel wreath leaves unfurl one by one in a circular cascade with a gold shimmer sweep",
  animationDuration: 600,
  hasLoop: false,
  svgPaths: 12,
  category: "student",
}
