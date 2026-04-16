"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

export default function ClassroomsIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gold glow behind mortarboard brim */}
      <motion.ellipse
        cx="12"
        cy="10"
        rx="9"
        ry="3"
        fill={glowColors.goldAlpha40}
        animate={isHovered ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: iconDurations.fast, delay: iconDurations.instant }}
        style={{ filter: "blur(3px)" }}
      />

      {/* Mortarboard top — diamond/rhombus */}
      <motion.path
        d="M12 4 L22 9 L12 14 L2 9 Z"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { y: -3 }
            : { y: 0 }
        }
        transition={iconSprings.interactive}
      />

      {/* Cap base — left side */}
      <motion.path
        d="M6 11 L6 16 C6 18 9 20 12 20"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { y: -3 }
            : { y: 0 }
        }
        transition={{ ...iconSprings.interactive, delay: iconStagger }}
      />

      {/* Cap base — right side */}
      <motion.path
        d="M18 11 L18 16 C18 18 15 20 12 20"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { y: -3 }
            : { y: 0 }
        }
        transition={{ ...iconSprings.interactive, delay: iconStagger }}
      />

      {/* Tassel anchor point on cap */}
      <motion.circle
        cx="12"
        cy="9"
        r="0.8"
        fill="currentColor"
        vectorEffect={iconStroke.vectorEffect}
        animate={
          isHovered
            ? { y: -3 }
            : { y: 0 }
        }
        transition={iconSprings.interactive}
      />

      {/* Tassel string */}
      <motion.line
        x1="12"
        y1="9"
        x2="19"
        y2="13"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        style={{ originX: "12px", originY: "9px" }}
        animate={
          isHovered
            ? { y: -3, rotateZ: [0, 12] }
            : { y: 0, rotateZ: 0 }
        }
        transition={
          isHovered
            ? {
                y: iconSprings.interactive,
                rotateZ: {
                  ...iconSprings.gentle,
                  duration: iconDurations.maxAnimation,
                  ease: iconEase.scholarly,
                },
              }
            : iconSprings.interactive
        }
      />

      {/* Tassel end bob */}
      <motion.circle
        cx="19"
        cy="14"
        r="1"
        fill="currentColor"
        vectorEffect={iconStroke.vectorEffect}
        style={{ originX: "12px", originY: "9px" }}
        animate={
          isHovered
            ? { y: -3, rotateZ: [0, 12] }
            : { y: 0, rotateZ: 0 }
        }
        transition={
          isHovered
            ? {
                y: iconSprings.interactive,
                rotateZ: {
                  ...iconSprings.gentle,
                  duration: iconDurations.maxAnimation,
                  ease: iconEase.scholarly,
                },
              }
            : iconSprings.interactive
        }
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "ClassroomsIcon",
  label: "My Classrooms",
  description: "Graduation cap lifts on hover, tassel swings as pendulum with spring physics, gold brim glow",
  animationDuration: 600,
  hasLoop: false,
  svgPaths: 7,
  category: "teacher",
}
