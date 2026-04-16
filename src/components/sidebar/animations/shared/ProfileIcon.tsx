"use client"

import { motion } from "framer-motion"
import { iconSprings, glowColors, iconStroke, iconDurations, iconEase } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

export default function ProfileIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Museum spotlight backdrop */}
      <motion.ellipse
        cx="12"
        cy="11"
        rx="8"
        ry="10"
        fill={glowColors.cream}
        animate={isHovered ? { opacity: 0.25, scale: 1.05 } : { opacity: 0, scale: 0.9 }}
        transition={{
          duration: iconDurations.normal,
          ease: iconEase.scholarly,
        }}
      />

      {/* Gold accent ring — appears on hover like a museum frame */}
      <motion.circle
        cx="12"
        cy="12"
        r="10.5"
        stroke={glowColors.gold}
        strokeWidth={0.5}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={isHovered ? { opacity: 0.4, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{
          duration: iconDurations.normal,
          delay: iconDurations.instant,
          ease: iconEase.scholarly,
        }}
      />

      {/* Bust group — rotates toward viewer on hover */}
      <motion.g
        animate={
          isHovered
            ? { rotate: 6, x: 0.8, y: -1 }
            : { rotate: 0, x: 0, y: 0 }
        }
        transition={{ ...iconSprings.tilt }}
        style={{ originX: "12px", originY: "12px" }}
      >
        {/* Head */}
        <motion.circle
          cx="12"
          cy="9"
          r="3.5"
          stroke="currentColor"
          strokeWidth={iconStroke.width}
          vectorEffect={iconStroke.vectorEffect}
          fill="none"
        />

        {/* Neck */}
        <motion.line
          x1="12"
          y1="12.5"
          x2="12"
          y2="14.5"
          stroke="currentColor"
          strokeWidth={iconStroke.width}
          strokeLinecap={iconStroke.linecap}
          vectorEffect={iconStroke.vectorEffect}
        />

        {/* Shoulders */}
        <motion.path
          d="M6 20 Q6 16 9 14.5 L12 14.5 L15 14.5 Q18 16 18 20"
          stroke="currentColor"
          strokeWidth={iconStroke.width}
          strokeLinecap={iconStroke.linecap}
          strokeLinejoin={iconStroke.linejoin}
          vectorEffect={iconStroke.vectorEffect}
          fill="none"
        />
      </motion.g>

      {/* Pedestal — gains gold tint on hover */}
      <motion.line
        x1="7"
        y1="21"
        x2="17"
        y2="21"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        animate={isHovered ? { opacity: 0.8 } : { opacity: 0.5 }}
        transition={{ duration: iconDurations.fast }}
      />

      {/* Gold nameplate — slides in below pedestal */}
      <motion.rect
        x="9"
        y="22"
        width="6"
        height="1"
        rx="0.5"
        fill={glowColors.goldAlpha40}
        animate={
          isHovered
            ? { opacity: 0.7, scaleX: 1 }
            : { opacity: 0, scaleX: 0 }
        }
        transition={{
          duration: iconDurations.normal,
          delay: iconDurations.instant,
          ease: iconEase.scholarly,
        }}
        style={{ originX: "12px" }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "ProfileIcon",
  label: "Profile",
  description: "Classical bust rotates toward viewer with museum spotlight, gold frame ring, and nameplate",
  animationDuration: 450,
  hasLoop: false,
  svgPaths: 7,
  category: "student",
}
