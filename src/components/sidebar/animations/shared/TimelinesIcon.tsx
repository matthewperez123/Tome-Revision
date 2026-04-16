"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase, pathDraw } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

const dots = [
  { cx: 5, delay: 0 },
  { cx: 12, delay: iconStagger },
  { cx: 19, delay: iconStagger * 2 },
]

export default function TimelinesIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Connecting line — draws in gold on hover */}
      <motion.line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        stroke={isHovered ? glowColors.gold : "currentColor"}
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        initial={false}
        animate={
          isHovered
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 1, opacity: 0.5 }
        }
        transition={{
          pathLength: { duration: iconDurations.normal, ease: iconEase.scholarly },
          opacity: { duration: iconDurations.fast },
        }}
      />

      {/* Timeline dots — pulse left to right on hover */}
      {dots.map((dot, i) => (
        <motion.circle
          key={i}
          cx={dot.cx}
          cy="12"
          r="2.5"
          stroke="currentColor"
          strokeWidth={iconStroke.width}
          vectorEffect={iconStroke.vectorEffect}
          fill={isHovered ? glowColors.goldAlpha40 : "none"}
          animate={
            isHovered
              ? { scale: [1, 1.3, 1], opacity: 1 }
              : { scale: 1, opacity: 1 }
          }
          transition={{
            scale: {
              duration: iconDurations.normal,
              delay: dot.delay * 3,
              ease: iconEase.scholarly,
            },
            opacity: { duration: iconDurations.fast },
          }}
          style={{ transformOrigin: `${dot.cx}px 12px` }}
        />
      ))}

      {/* Small tick marks beneath dots */}
      {dots.map((dot, i) => (
        <motion.line
          key={`tick-${i}`}
          x1={dot.cx}
          y1="15.5"
          x2={dot.cx}
          y2="17.5"
          stroke="currentColor"
          strokeWidth={iconStroke.width}
          strokeLinecap={iconStroke.linecap}
          vectorEffect={iconStroke.vectorEffect}
          opacity={0.4}
        />
      ))}

      {/* Flag at rightmost dot — unfurls on hover */}
      <motion.g
        style={{ transformOrigin: "19px 8px" }}
        animate={
          isHovered
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 3 }
        }
        transition={{
          opacity: { duration: iconDurations.fast, delay: iconStagger * 6 },
          y: { ...iconSprings.interactive, delay: iconStagger * 6 },
        }}
      >
        {/* Flag pole */}
        <motion.line
          x1="19"
          y1="4"
          x2="19"
          y2="9.5"
          stroke="currentColor"
          strokeWidth={iconStroke.width}
          strokeLinecap={iconStroke.linecap}
          vectorEffect={iconStroke.vectorEffect}
        />
        {/* Flag body — unfurls from left */}
        <motion.path
          d="M19 4 L23 5.5 L19 7"
          stroke={glowColors.gold}
          strokeWidth={iconStroke.width}
          strokeLinecap={iconStroke.linecap}
          strokeLinejoin={iconStroke.linejoin}
          vectorEffect={iconStroke.vectorEffect}
          fill={glowColors.goldAlpha40}
          animate={
            isHovered
              ? { scaleX: 1, opacity: 1 }
              : { scaleX: 0, opacity: 0 }
          }
          transition={{
            scaleX: { ...iconSprings.snappy, delay: iconStagger * 8 },
            opacity: { duration: iconDurations.fast, delay: iconStagger * 8 },
          }}
          style={{ transformOrigin: "19px 5.5px" }}
        />
      </motion.g>
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "TimelinesIcon",
  label: "Timelines",
  description: "Horizontal timeline with dots that pulse left-to-right; gold connecting line draws in and a small flag unfurls at the end",
  animationDuration: 500,
  hasLoop: false,
  svgPaths: 10,
  category: "student",
}
