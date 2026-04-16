"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase, pathDraw } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

export default function AuthorsIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fountain pen nib — body */}
      <motion.path
        d="M12 3 L14 9 L12 20 L10 9 Z"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={isHovered ? { y: 1 } : { y: 0 }}
        transition={iconSprings.gentle}
      />

      {/* Nib slit */}
      <motion.line
        x1="12"
        y1="13"
        x2="12"
        y2="19"
        stroke="currentColor"
        strokeWidth={0.8}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        animate={isHovered ? { y: 1 } : { y: 0 }}
        transition={iconSprings.gentle}
      />

      {/* Nib shoulder details */}
      <motion.line
        x1="10.5"
        y1="9"
        x2="13.5"
        y2="9"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        animate={isHovered ? { y: 1 } : { y: 0 }}
        transition={iconSprings.gentle}
      />

      {/* Ink drop — falls from nib tip */}
      <motion.circle
        cx="12"
        cy="21"
        r={0.8}
        fill="currentColor"
        animate={
          isHovered
            ? { y: [0, 1.5], opacity: [0, 1, 0.8, 0], scale: [0.5, 1, 1.2, 0] }
            : { y: 0, opacity: 0, scale: 0.5 }
        }
        transition={{
          duration: iconDurations.slow,
          delay: iconDurations.fast,
          ease: "easeIn",
        }}
      />

      {/* Ink splash ring — expands and fades */}
      <motion.circle
        cx="12"
        cy="22.5"
        r={1}
        stroke="currentColor"
        strokeWidth={0.6}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { scale: [0, 2], opacity: [0, 0.5, 0] }
            : { scale: 0, opacity: 0 }
        }
        transition={{
          duration: iconDurations.normal,
          delay: iconDurations.normal,
          ease: iconEase.outExpo as [number, number, number, number],
        }}
        style={{ originX: "12px", originY: "22.5px" }}
      />

      {/* Golden signature line — draws itself */}
      <motion.path
        d="M6 22 Q8 20.5 10 22 Q12 23.5 14 22 Q16 20.5 18 22"
        stroke={glowColors.gold}
        strokeWidth={1.2}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        initial={pathDraw.hidden}
        animate={
          isHovered
            ? { pathLength: 1, opacity: 0.9 }
            : pathDraw.hidden
        }
        transition={{
          pathLength: {
            duration: iconDurations.slow,
            ease: "easeOut",
            delay: iconDurations.normal + iconStagger * 2,
          },
          opacity: {
            duration: iconDurations.fast,
            delay: iconDurations.normal + iconStagger * 2,
          },
        }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "AuthorsIcon",
  label: "Authors",
  description: "Fountain pen nib dips down, ink drop splashes, golden signature line draws itself",
  animationDuration: 600,
  hasLoop: false,
  svgPaths: 7,
  category: "student",
}
