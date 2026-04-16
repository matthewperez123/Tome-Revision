"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

const spines = [
  { x: 4, width: 3.5 },
  { x: 9.25, width: 3.5 },
  { x: 14.5, width: 3.5 },
]

const dustMotes = [
  { cx: 11, delay: 0.15 },
  { cx: 13, delay: 0.25 },
  { cx: 10, delay: 0.35 },
]

export default function LibraryIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shelf */}
      <motion.line
        x1="2"
        y1="20"
        x2="22"
        y2="20"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
      />

      {/* Book spines */}
      {spines.map((spine, i) => (
        <motion.rect
          key={i}
          x={spine.x}
          y={5}
          width={spine.width}
          height={15}
          rx={0.8}
          stroke="currentColor"
          strokeWidth={iconStroke.width}
          vectorEffect={iconStroke.vectorEffect}
          fill="none"
          style={{ originX: `${spine.x + spine.width / 2}px`, originY: "20px" }}
          animate={
            isHovered && i === 1
              ? { rotateZ: -12, x: -1 }
              : { rotateZ: 0, x: 0 }
          }
          transition={{
            ...iconSprings.tilt,
            delay: i * iconStagger,
          }}
        />
      ))}

      {/* Gold glow behind middle book */}
      <motion.rect
        x={8}
        y={6}
        width={5.5}
        height={13}
        rx={1}
        fill={glowColors.goldAlpha40}
        animate={isHovered ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: iconDurations.fast }}
        style={{ filter: "blur(3px)" }}
      />

      {/* Dust motes */}
      {dustMotes.map((mote, i) => (
        <motion.circle
          key={`dust-${i}`}
          cx={mote.cx}
          cy={8}
          r={0.5}
          fill={glowColors.gold}
          animate={
            isHovered
              ? { opacity: [0, 0.7, 0], y: [0, -4] }
              : { opacity: 0, y: 0 }
          }
          transition={{
            duration: iconDurations.slow,
            delay: mote.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "LibraryIcon",
  label: "Library",
  description: "Book spines on a shelf — middle book tilts forward with gold glow and drifting dust motes",
  animationDuration: 500,
  hasLoop: false,
  svgPaths: 7,
  category: "student",
}
