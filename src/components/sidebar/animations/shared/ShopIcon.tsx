"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase, pathDraw } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

const sparkles = [
  { cx: 13, cy: 7, delay: iconStagger * 5 },
  { cx: 15.5, cy: 5.5, delay: iconStagger * 8 },
]

export default function ShopIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bag body */}
      <motion.path
        d="M5 10 H19 L18 21 H6 Z"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
      />

      {/* Bag handle */}
      <motion.path
        d="M8 10 V7 Q8 3 12 3 Q16 3 16 7 V10"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
      />

      {/* Bag flap — rotates open on hover */}
      <motion.path
        d="M5 10 H19"
        stroke="currentColor"
        strokeWidth={iconStroke.width + 0.5}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        animate={
          isHovered
            ? { y: -1.5, opacity: 0.6 }
            : { y: 0, opacity: 1 }
        }
        transition={iconSprings.interactive}
      />

      {/* Flap opening — left side lifts */}
      <motion.path
        d="M5 10 L7 8"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: iconDurations.fast, delay: iconStagger * 2 }}
      />

      {/* Flap opening — right side lifts */}
      <motion.path
        d="M19 10 L17 8"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: iconDurations.fast, delay: iconStagger * 2 }}
      />

      {/* Gold coin rising from bag */}
      <motion.circle
        cx="12"
        cy="9"
        r="2.5"
        stroke={glowColors.gold}
        strokeWidth={iconStroke.width}
        vectorEffect={iconStroke.vectorEffect}
        fill={glowColors.goldAlpha40}
        animate={
          isHovered
            ? { y: -4, opacity: 1, scale: 1 }
            : { y: 0, opacity: 0, scale: 0.5 }
        }
        transition={{
          y: { ...iconSprings.gentle, delay: iconStagger * 3 },
          opacity: { duration: iconDurations.fast, delay: iconStagger * 3 },
          scale: { ...iconSprings.interactive, delay: iconStagger * 3 },
        }}
        style={{ transformOrigin: "12px 9px" }}
      />

      {/* Dollar sign on coin */}
      <motion.path
        d="M12 6 V8.5 M11 6.5 Q11 6 12 6 Q13 6 13 6.5 Q13 7 12 7 Q11 7 11 7.5 Q11 8 12 8 Q13 8 13 7.5 M12 6 V6 M12 8 V8.5"
        stroke={glowColors.gold}
        strokeWidth={0.8}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { y: -4, opacity: 1 }
            : { y: 0, opacity: 0 }
        }
        transition={{
          y: { ...iconSprings.gentle, delay: iconStagger * 3 },
          opacity: { duration: iconDurations.fast, delay: iconStagger * 4 },
        }}
      />

      {/* Sparkles on coin */}
      {sparkles.map((spark, i) => (
        <motion.g
          key={i}
          animate={
            isHovered
              ? { opacity: [0, 1, 0], scale: [0.3, 1, 0.3], y: -4 }
              : { opacity: 0, scale: 0, y: 0 }
          }
          transition={{
            opacity: { duration: iconDurations.normal, delay: spark.delay },
            scale: { duration: iconDurations.normal, delay: spark.delay },
            y: { ...iconSprings.gentle, delay: iconStagger * 3 },
          }}
          style={{ transformOrigin: `${spark.cx}px ${spark.cy}px` }}
        >
          {/* 4-point star sparkle */}
          <motion.path
            d={`M${spark.cx} ${spark.cy - 1.2} V${spark.cy + 1.2} M${spark.cx - 1.2} ${spark.cy} H${spark.cx + 1.2}`}
            stroke={glowColors.gold}
            strokeWidth={0.7}
            strokeLinecap={iconStroke.linecap}
            vectorEffect={iconStroke.vectorEffect}
          />
        </motion.g>
      ))}
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "ShopIcon",
  label: "Shop",
  description: "Satchel bag opens at top on hover; a gold coin with dollar sign rises out with sparkle effects",
  animationDuration: 500,
  hasLoop: false,
  svgPaths: 10,
  category: "student",
}
