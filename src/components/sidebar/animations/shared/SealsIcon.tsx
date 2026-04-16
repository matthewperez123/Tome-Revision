"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase, pathDraw } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

// Wax drip positions around the seal edge
const waxDrips = [
  { cx: 6.5, cy: 14, r: 1.2, delay: 0 },
  { cx: 17.5, cy: 14, r: 1, delay: 1 },
  { cx: 8, cy: 17.5, r: 0.8, delay: 2 },
  { cx: 16, cy: 17.5, r: 0.9, delay: 3 },
]

// Ornamental dots around inner ring
const ornamentDots = [
  { cx: 12, cy: 5.5, delay: 0 },
  { cx: 18.5, cy: 12, delay: 1 },
  { cx: 12, cy: 18.5, delay: 2 },
  { cx: 5.5, cy: 12, delay: 3 },
]

export default function SealsIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background glow */}
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        fill={glowColors.goldAlpha20}
        animate={isHovered ? { opacity: 0.5, scale: 1.1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: iconDurations.normal, ease: iconEase.scholarly as [number, number, number, number] }}
      />

      {/* Wax drips — appear on stamp impact */}
      {waxDrips.map((drip, i) => (
        <motion.circle
          key={`drip-${i}`}
          cx={drip.cx}
          cy={drip.cy}
          r={drip.r}
          fill={glowColors.goldAlpha40}
          stroke={glowColors.gold}
          strokeWidth={0.4}
          animate={
            isHovered
              ? { opacity: 0.7, scale: 1 }
              : { opacity: 0, scale: 0.3 }
          }
          transition={{
            duration: iconDurations.normal,
            delay: drip.delay * iconStagger + iconDurations.fast,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Outer seal ring — stamps down on hover */}
      <motion.circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { scale: [1.15, 1] }
            : { scale: 1 }
        }
        transition={
          isHovered
            ? iconSprings.stamp
            : { duration: iconDurations.fast }
        }
      />

      {/* Inner decorative ring */}
      <motion.circle
        cx="12"
        cy="12"
        r="5.5"
        stroke="currentColor"
        strokeWidth={0.7}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { opacity: 1, scale: [1.1, 1] }
            : { opacity: 0.3, scale: 1 }
        }
        transition={
          isHovered
            ? { ...iconSprings.stamp, delay: iconStagger }
            : { duration: iconDurations.fast }
        }
      />

      {/* Ornamental cardinal dots */}
      {ornamentDots.map((dot, i) => (
        <motion.circle
          key={`orn-${i}`}
          cx={dot.cx}
          cy={dot.cy}
          r={0.6}
          fill={glowColors.gold}
          animate={
            isHovered
              ? { opacity: 0.8, scale: 1 }
              : { opacity: 0, scale: 0 }
          }
          transition={{
            duration: iconDurations.fast,
            delay: dot.delay * iconStagger + iconDurations.normal,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Center emblem — laurel-wrapped star */}
      <motion.path
        d="M12 8 L13.2 10.8 L16 10.8 L13.8 12.8 L14.6 16 L12 14 L9.4 16 L10.2 12.8 L8 10.8 L10.8 10.8 Z"
        stroke={glowColors.gold}
        strokeWidth={0.8}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill={glowColors.goldAlpha40}
        animate={
          isHovered
            ? { opacity: 1, scale: [0.5, 1], rotate: [0, 15] }
            : { opacity: 0, scale: 0.5, rotate: 0 }
        }
        transition={
          isHovered
            ? {
                opacity: { duration: iconDurations.fast, delay: iconDurations.instant },
                scale: iconSprings.stamp,
                rotate: { duration: iconDurations.slow, delay: iconDurations.instant, ease: iconEase.scholarly as [number, number, number, number] },
              }
            : { duration: iconDurations.fast }
        }
        style={{ originX: "12px", originY: "12px" }}
      />

      {/* Ribbon tails */}
      <motion.path
        d="M8 18 L6 22 L8.5 20.5"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { pathLength: 1, opacity: 0.8 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{
          duration: iconDurations.normal,
          delay: iconDurations.normal,
          ease: "easeOut",
        }}
      />
      <motion.path
        d="M16 18 L18 22 L15.5 20.5"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { pathLength: 1, opacity: 0.8 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{
          duration: iconDurations.normal,
          delay: iconDurations.normal + iconStagger,
          ease: "easeOut",
        }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "SealsIcon",
  label: "Seals",
  description: "Wax seal stamps down with spring impact, gold star emblem appears with rotation, ribbon tails draw outward, ornamental dots cascade",
  animationDuration: 500,
  hasLoop: false,
  svgPaths: 12,
  category: "student",
}
