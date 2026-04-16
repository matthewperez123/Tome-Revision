"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase, pathDraw } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

export default function ExploreIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Warm glow behind globe on hover */}
      <motion.circle
        cx="12"
        cy="12"
        r="9"
        fill={glowColors.goldAlpha20}
        animate={isHovered ? { opacity: 0.7, scale: 1.05 } : { opacity: 0, scale: 1 }}
        transition={{ duration: iconDurations.fast }}
        style={{ filter: "blur(3px)" }}
      />

      {/* Globe outline */}
      <motion.circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={isHovered ? { skewY: 3 } : { skewY: 0 }}
        transition={iconSprings.gentle}
        style={{ transformOrigin: "center center" }}
      />

      {/* Equator line */}
      <motion.ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="3.5"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={isHovered ? { skewY: 3 } : { skewY: 0 }}
        transition={iconSprings.gentle}
        style={{ transformOrigin: "center center" }}
      />

      {/* Vertical meridian */}
      <motion.ellipse
        cx="12"
        cy="12"
        rx="3.5"
        ry="9"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={isHovered ? { skewY: 3 } : { skewY: 0 }}
        transition={iconSprings.gentle}
        style={{ transformOrigin: "center center" }}
      />

      {/* Upper latitude */}
      <motion.path
        d="M4.5 8.5 Q12 6 19.5 8.5"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={isHovered ? { skewY: 3 } : { skewY: 0 }}
        transition={iconSprings.gentle}
        style={{ transformOrigin: "center center" }}
      />

      {/* Lower latitude */}
      <motion.path
        d="M4.5 15.5 Q12 18 19.5 15.5"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={isHovered ? { skewY: 3 } : { skewY: 0 }}
        transition={iconSprings.gentle}
        style={{ transformOrigin: "center center" }}
      />

      {/* Compass needle — appears on hover at top-right */}
      <motion.g
        style={{ transformOrigin: "19px 5px" }}
        animate={
          isHovered
            ? { opacity: 1, rotate: 360, scale: 1 }
            : { opacity: 0, rotate: 0, scale: 0.3 }
        }
        transition={{
          opacity: { duration: iconDurations.fast, delay: iconStagger * 2 },
          rotate: { duration: iconDurations.slow, ease: iconEase.scholarly, delay: iconStagger * 3 },
          scale: { ...iconSprings.snappy, delay: iconStagger * 2 },
        }}
      >
        {/* Needle north (gold) */}
        <motion.path
          d="M19 3 L20 5 L19 4.5 L18 5 Z"
          fill={glowColors.gold}
          stroke={glowColors.gold}
          strokeWidth={0.5}
          vectorEffect={iconStroke.vectorEffect}
        />
        {/* Needle south */}
        <motion.path
          d="M19 7 L20 5 L19 5.5 L18 5 Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={0.5}
          vectorEffect={iconStroke.vectorEffect}
          opacity={0.5}
        />
        {/* Center dot */}
        <circle cx="19" cy="5" r="0.6" fill="currentColor" />
      </motion.g>
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "ExploreIcon",
  label: "Explore",
  description: "Globe with latitude lines rotates slightly on hover; gold compass needle spins into view at top-right",
  animationDuration: 500,
  hasLoop: false,
  svgPaths: 9,
  category: "student",
}
