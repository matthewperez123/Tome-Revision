"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase, pathDraw } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

const typingDots = [
  { cx: 9, delay: 0 },
  { cx: 12, delay: iconStagger * 3 },
  { cx: 15, delay: iconStagger * 6 },
]

export default function CommunityIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Speech bubble body */}
      <motion.path
        d="M4 4 H20 Q21 4 21 5 V15 Q21 16 20 16 H13 L9 20 V16 H4 Q3 16 3 15 V5 Q3 4 4 4 Z"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { scale: 1.04, y: -0.5 }
            : { scale: 1, y: 0 }
        }
        transition={iconSprings.gentle}
        style={{ transformOrigin: "12px 10px" }}
      />

      {/* Gold accent on bubble tail */}
      <motion.path
        d="M9 16 L9 20 L13 16"
        stroke={isHovered ? glowColors.gold : "currentColor"}
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill={isHovered ? glowColors.goldAlpha20 : "none"}
        animate={
          isHovered
            ? { scale: 1.04, y: -0.5 }
            : { scale: 1, y: 0 }
        }
        transition={iconSprings.gentle}
        style={{ transformOrigin: "12px 10px" }}
      />

      {/* Typing dots — fade in sequence on hover */}
      {typingDots.map((dot, i) => (
        <motion.circle
          key={i}
          cx={dot.cx}
          cy="10"
          r="1.2"
          fill={isHovered ? glowColors.gold : "currentColor"}
          animate={
            isHovered
              ? {
                  opacity: [0, 1, 0.6],
                  scale: [0.5, 1.1, 1],
                  y: [0, -1, 0],
                }
              : { opacity: 0.4, scale: 1, y: 0 }
          }
          transition={
            isHovered
              ? {
                  duration: iconDurations.normal,
                  delay: dot.delay,
                  ease: iconEase.scholarly,
                }
              : { duration: iconDurations.fast }
          }
          style={{ transformOrigin: `${dot.cx}px 10px` }}
        />
      ))}
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "CommunityIcon",
  label: "Community",
  description: "Speech bubble inflates on hover with three dots appearing in a typing animation sequence and gold tail accent",
  animationDuration: 500,
  hasLoop: false,
  svgPaths: 6,
  category: "student",
}
