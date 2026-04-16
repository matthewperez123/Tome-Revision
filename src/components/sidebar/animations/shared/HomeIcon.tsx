"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase, pathDraw } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

const smokeKeyframes = {
  y: [0, -3, -6],
  x: [0, 1, 0.5],
  opacity: [0, 0.6, 0],
}

export default function HomeIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Roof — triangle */}
      <motion.path
        d="M3 11 L12 3 L21 11"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
      />

      {/* Left wall */}
      <motion.line
        x1="5"
        y1="10"
        x2="5"
        y2="20"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
      />

      {/* Right wall */}
      <motion.line
        x1="19"
        y1="10"
        x2="19"
        y2="20"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
      />

      {/* Floor */}
      <motion.line
        x1="5"
        y1="20"
        x2="19"
        y2="20"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
      />

      {/* Door frame */}
      <motion.rect
        x="9.5"
        y="13"
        width="5"
        height="7"
        rx={0.5}
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
      />

      {/* Door panel — opens inward via scaleX */}
      <motion.rect
        x="9.5"
        y="13"
        width="5"
        height="7"
        rx={0.5}
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        style={{ originX: "9.5px", originY: "16.5px" }}
        animate={isHovered ? { scaleX: 0.3 } : { scaleX: 1 }}
        transition={{ ...iconSprings.gentle, delay: iconStagger }}
      />

      {/* Warm gold light spilling from doorway */}
      <motion.rect
        x="10"
        y="13.5"
        width="4"
        height="6"
        rx={0.3}
        fill={glowColors.goldAlpha40}
        animate={isHovered ? { opacity: 0.8, scaleX: 1.3 } : { opacity: 0, scaleX: 1 }}
        transition={{ duration: iconDurations.normal, ease: iconEase.scholarly as [number, number, number, number] }}
        style={{ originX: "12px", originY: "16.5px", filter: "blur(2px)" }}
      />

      {/* Chimney */}
      <motion.rect
        x="15.5"
        y="4.5"
        width="2"
        height="4"
        rx={0.3}
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
      />

      {/* Smoke curl */}
      <motion.path
        d="M16.5 4.5 Q17.5 2.5 16.5 1"
        stroke={glowColors.gold}
        strokeWidth={1}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { ...smokeKeyframes, pathLength: [0, 1, 1] }
            : { y: 0, x: 0, opacity: 0, pathLength: 0 }
        }
        transition={{
          duration: iconDurations.maxAnimation,
          ease: "easeOut",
          delay: iconStagger * 3,
        }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "HomeIcon",
  label: "Home",
  description: "House outline — door opens inward with warm gold light, chimney smoke curls upward",
  animationDuration: 600,
  hasLoop: false,
  svgPaths: 9,
  category: "student",
}
