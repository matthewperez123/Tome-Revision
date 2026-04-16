"use client"

import { motion } from "framer-motion"
import {
  teacherStroke, teacherDurations, teacherStagger, teacherColors, teacherSprings,
  iconEase, glowColors, pathDraw, iconDurations
} from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

const rows = [
  { y: 7, delay: 0 },
  { y: 12, delay: 1 },
  { y: 17, delay: 2 },
]

// Bust silhouette: small circle head + shoulder arc, centered at the row's y
// Each silhouette path is drawn relative to a baseline y
function bustPath(y: number) {
  const headCy = y - 1.5
  const shoulderY = y + 0.5
  // Circle head (r~1.2) then shoulders curve
  return `M10 ${headCy} A1.2 1.2 0 1 1 12.4 ${headCy} A1.2 1.2 0 1 1 10 ${headCy} M9 ${shoulderY} Q11.2 ${shoulderY + 2} 13.4 ${shoulderY}`
}

export default function RosterIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* List lines (idle) / bust silhouettes (hover) */}
      {rows.map((row, i) => (
        <g key={`row-${i}`}>
          {/* Horizontal list line — fades out on hover */}
          <motion.line
            x1="6"
            y1={row.y}
            x2="18"
            y2={row.y}
            stroke="currentColor"
            strokeWidth={teacherStroke.width}
            strokeLinecap={teacherStroke.linecap}
            vectorEffect={teacherStroke.vectorEffect}
            animate={
              isHovered
                ? { opacity: 0 }
                : { opacity: 1 }
            }
            transition={{
              duration: teacherDurations.recite * 0.5,
              delay: i * teacherStagger,
              ease: iconEase.scholarly,
            }}
          />

          {/* Bust silhouette — fades in + slides right on hover */}
          <motion.path
            d={bustPath(row.y)}
            stroke={teacherColors.indigo}
            strokeWidth={teacherStroke.width}
            strokeLinecap={teacherStroke.linecap}
            strokeLinejoin={teacherStroke.linejoin}
            vectorEffect={teacherStroke.vectorEffect}
            fill="none"
            animate={
              isHovered
                ? { opacity: 1, x: 1.5 }
                : { opacity: 0, x: 0 }
            }
            transition={{
              opacity: {
                duration: teacherDurations.recite,
                delay: i * teacherStagger + 0.08,
                ease: iconEase.scholarly,
              },
              x: {
                ...teacherSprings.deliberate,
                delay: i * teacherStagger + 0.08,
              },
            }}
          />
        </g>
      ))}

      {/* Counter badge — appears top-right on hover */}
      <motion.circle
        cx="20"
        cy="4.5"
        r="3.5"
        fill={teacherColors.indigo}
        animate={
          isHovered
            ? { scale: 1, opacity: 1 }
            : { scale: 0, opacity: 0 }
        }
        transition={
          isHovered
            ? { ...teacherSprings.overshoot, delay: teacherStagger * 2 }
            : { duration: iconDurations.fast }
        }
      />
      <motion.text
        x="20"
        y="5.5"
        textAnchor="middle"
        fontSize="5"
        fontWeight="700"
        fill="white"
        animate={
          isHovered
            ? { scale: 1, opacity: 1 }
            : { scale: 0, opacity: 0 }
        }
        transition={
          isHovered
            ? { ...teacherSprings.overshoot, delay: teacherStagger * 2 + 0.04 }
            : { duration: iconDurations.fast }
        }
      >
        3
      </motion.text>
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "RosterIcon",
  label: "Roster",
  description: "Three horizontal lines morph into bust silhouettes with staggered slide, counter badge pops in top-right with overshoot spring",
  animationDuration: 650,
  hasLoop: false,
  svgPaths: 9,
  category: "teacher",
}
