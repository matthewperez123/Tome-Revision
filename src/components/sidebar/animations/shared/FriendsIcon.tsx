"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase, pathDraw } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

export default function FriendsIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Warm gold backdrop between busts */}
      <motion.ellipse
        cx="12"
        cy="14"
        rx="4"
        ry="5"
        fill={glowColors.goldAlpha20}
        animate={isHovered ? { opacity: 0.7, scale: 1.1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: iconDurations.normal }}
        style={{ filter: "blur(3px)", transformOrigin: "12px 14px" }}
      />

      {/* Left person — head */}
      <motion.circle
        cx="8"
        cy="8"
        r="2.5"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={isHovered ? { rotate: 5 } : { rotate: 0 }}
        transition={iconSprings.tilt}
        style={{ transformOrigin: "8px 16px" }}
      />

      {/* Left person — shoulders */}
      <motion.path
        d="M3 20 C3 16 5.5 13 8 13 C9.5 13 10.5 14 11 15"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={isHovered ? { rotate: 5 } : { rotate: 0 }}
        transition={iconSprings.tilt}
        style={{ transformOrigin: "8px 16px" }}
      />

      {/* Right person — head */}
      <motion.circle
        cx="16"
        cy="8"
        r="2.5"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={isHovered ? { rotate: -5 } : { rotate: 0 }}
        transition={iconSprings.tilt}
        style={{ transformOrigin: "16px 16px" }}
      />

      {/* Right person — shoulders */}
      <motion.path
        d="M21 20 C21 16 18.5 13 16 13 C14.5 13 13.5 14 13 15"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={isHovered ? { rotate: -5 } : { rotate: 0 }}
        transition={iconSprings.tilt}
        style={{ transformOrigin: "16px 16px" }}
      />

      {/* Handshake symbol between them — appears on hover */}
      <motion.g
        animate={
          isHovered
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0, scale: 0.5, y: 2 }
        }
        transition={{
          opacity: { duration: iconDurations.fast, delay: iconStagger * 4 },
          scale: { ...iconSprings.interactive, delay: iconStagger * 4 },
          y: { ...iconSprings.interactive, delay: iconStagger * 4 },
        }}
        style={{ transformOrigin: "12px 15px" }}
      >
        {/* Left hand */}
        <motion.path
          d="M10 15.5 L12 14.5"
          stroke={glowColors.gold}
          strokeWidth={iconStroke.width}
          strokeLinecap={iconStroke.linecap}
          vectorEffect={iconStroke.vectorEffect}
          fill="none"
        />
        {/* Right hand */}
        <motion.path
          d="M14 15.5 L12 14.5"
          stroke={glowColors.gold}
          strokeWidth={iconStroke.width}
          strokeLinecap={iconStroke.linecap}
          vectorEffect={iconStroke.vectorEffect}
          fill="none"
        />
        {/* Clasp */}
        <motion.circle
          cx="12"
          cy="14.5"
          r="0.8"
          fill={glowColors.gold}
        />
      </motion.g>
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "FriendsIcon",
  label: "Friends",
  description: "Two silhouette busts lean toward each other on hover with a gold handshake symbol appearing between them",
  animationDuration: 450,
  hasLoop: false,
  svgPaths: 8,
  category: "student",
}
