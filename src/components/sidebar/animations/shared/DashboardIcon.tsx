"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

const quadrants = [
  { x: 3, y: 3, width: 7.5, height: 7.5, delay: 0 },
  { x: 13.5, y: 3, width: 7.5, height: 7.5, delay: 1 },
  { x: 3, y: 13.5, width: 7.5, height: 7.5, delay: 2 },
  { x: 13.5, y: 13.5, width: 7.5, height: 7.5, delay: 3 },
]

export default function DashboardIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gold border flash behind each quadrant */}
      {quadrants.map((q, i) => (
        <motion.rect
          key={`glow-${i}`}
          x={q.x - 0.5}
          y={q.y - 0.5}
          width={q.width + 1}
          height={q.height + 1}
          rx={2}
          fill="none"
          stroke={glowColors.gold}
          strokeWidth={1.2}
          vectorEffect={iconStroke.vectorEffect}
          animate={
            isHovered
              ? { opacity: [0, 0.8, 0], scale: [0.95, 1.02, 1] }
              : { opacity: 0, scale: 1 }
          }
          transition={{
            duration: iconDurations.normal,
            delay: q.delay * iconStagger * 2,
            ease: iconEase.scholarly as [number, number, number, number],
          }}
          style={{
            originX: `${q.x + q.width / 2}px`,
            originY: `${q.y + q.height / 2}px`,
          }}
        />
      ))}

      {/* Four quadrant tiles */}
      {quadrants.map((q, i) => (
        <motion.rect
          key={`tile-${i}`}
          x={q.x}
          y={q.y}
          width={q.width}
          height={q.height}
          rx={1.5}
          stroke="currentColor"
          strokeWidth={iconStroke.width}
          strokeLinejoin={iconStroke.linejoin}
          vectorEffect={iconStroke.vectorEffect}
          fill="none"
          animate={
            isHovered
              ? { scale: [0.9, 1] }
              : { scale: 1 }
          }
          transition={{
            ...iconSprings.snappy,
            delay: q.delay * iconStagger * 2,
          }}
          style={{
            originX: `${q.x + q.width / 2}px`,
            originY: `${q.y + q.height / 2}px`,
          }}
        />
      ))}

      {/* Cross divider lines */}
      <motion.line
        x1="12"
        y1="3"
        x2="12"
        y2="21"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        opacity={0.3}
      />
      <motion.line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        opacity={0.3}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "DashboardIcon",
  label: "Dashboard",
  description: "4-quadrant mosaic — tiles stagger-scale with cascading gold border flash",
  animationDuration: 500,
  hasLoop: false,
  svgPaths: 10,
  category: "student",
}
