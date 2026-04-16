"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

const cardinalPoints = [
  { x1: 12, y1: 2, x2: 12, y2: 6, label: "N", delay: 0 },
  { x1: 22, y1: 12, x2: 18, y2: 12, label: "E", delay: 1 },
  { x1: 12, y1: 22, x2: 12, y2: 18, label: "S", delay: 2 },
  { x1: 2, y1: 12, x2: 6, y2: 12, label: "W", delay: 3 },
]

export default function GuidedSessionsIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Radial glow behind compass */}
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        fill={glowColors.goldAlpha20}
        animate={
          isHovered
            ? { opacity: 0.5, scale: [1, 1.15, 1] }
            : { opacity: 0, scale: 1 }
        }
        transition={{
          duration: iconDurations.slow,
          delay: iconDurations.fast,
          ease: iconEase.scholarly,
        }}
        style={{ filter: "blur(3px)" }}
      />

      {/* Outer compass circle */}
      <motion.circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
      />

      {/* Inner compass circle */}
      <motion.circle
        cx="12"
        cy="12"
        r="2"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
      />

      {/* Cardinal point lines — pulse gold in N E S W sequence */}
      {cardinalPoints.map((pt, i) => (
        <motion.line
          key={pt.label}
          x1={pt.x1}
          y1={pt.y1}
          x2={pt.x2}
          y2={pt.y2}
          stroke="currentColor"
          strokeWidth={iconStroke.width}
          strokeLinecap={iconStroke.linecap}
          vectorEffect={iconStroke.vectorEffect}
          animate={
            isHovered
              ? {
                  stroke: ["currentColor", glowColors.gold, "currentColor"],
                }
              : { stroke: "currentColor" }
          }
          transition={{
            duration: iconDurations.normal,
            delay: pt.delay * iconStagger + iconDurations.instant,
            ease: iconEase.scholarly,
          }}
        />
      ))}

      {/* Compass needle — north half (red/warm) */}
      <motion.path
        d="M12 10 L13 12 L12 5 L11 12 Z"
        stroke="currentColor"
        strokeWidth={0.8}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        style={{ originX: "12px", originY: "12px" }}
        animate={
          isHovered
            ? { rotateZ: [0, 360] }
            : { rotateZ: 0 }
        }
        transition={
          isHovered
            ? {
                duration: iconDurations.maxAnimation,
                ease: iconEase.outExpo,
              }
            : iconSprings.interactive
        }
      />

      {/* Compass needle — south half */}
      <motion.path
        d="M12 14 L13 12 L12 19 L11 12 Z"
        stroke="currentColor"
        strokeWidth={0.8}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        style={{ originX: "12px", originY: "12px" }}
        animate={
          isHovered
            ? { rotateZ: [0, 360] }
            : { rotateZ: 0 }
        }
        transition={
          isHovered
            ? {
                duration: iconDurations.maxAnimation,
                ease: iconEase.outExpo,
              }
            : iconSprings.interactive
        }
      />

      {/* Center pivot dot */}
      <motion.circle
        cx="12"
        cy="12"
        r="1"
        fill="currentColor"
        vectorEffect={iconStroke.vectorEffect}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "GuidedSessionsIcon",
  label: "Guided Sessions",
  description: "Compass rose with needle that spins 360 degrees and settles north, cardinal points pulse gold in sequence, radial glow expands",
  animationDuration: 600,
  hasLoop: false,
  svgPaths: 9,
  category: "teacher",
}
