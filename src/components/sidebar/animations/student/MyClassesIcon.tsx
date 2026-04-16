"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

const deskLegs = [
  { x: 5, delay: 0 },
  { x: 19, delay: 1 },
]

export default function MyClassesIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Desk surface */}
      <motion.line
        x1="3"
        y1="16"
        x2="21"
        y2="16"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
      />

      {/* Desk legs */}
      {deskLegs.map((leg, i) => (
        <motion.line
          key={`leg-${i}`}
          x1={leg.x}
          y1="16"
          x2={leg.x}
          y2="21"
          stroke="currentColor"
          strokeWidth={iconStroke.width}
          strokeLinecap={iconStroke.linecap}
          vectorEffect={iconStroke.vectorEffect}
        />
      ))}

      {/* Chair back */}
      <motion.path
        d="M16 12 L18 12 L18 16"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
      />

      {/* Notebook on desk */}
      <motion.rect
        x={6}
        y={12.5}
        width={5}
        height={3.5}
        rx={0.5}
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
      />

      {/* Notebook page flip overlay */}
      <motion.path
        d="M6 12.5 L11 12.5 L11 16 L6 16 Z"
        stroke="none"
        fill={glowColors.goldAlpha20}
        animate={
          isHovered
            ? { scaleX: [1, 0.3, 1], opacity: [0, 0.8, 0] }
            : { scaleX: 1, opacity: 0 }
        }
        style={{ originX: "6px", originY: "14px" }}
        transition={{
          duration: iconDurations.slow,
          delay: iconDurations.fast,
          ease: iconEase.scholarly,
        }}
      />

      {/* Notebook line detail */}
      <motion.line
        x1="7"
        y1="14.2"
        x2="10"
        y2="14.2"
        stroke="currentColor"
        strokeWidth={0.6}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        animate={
          isHovered
            ? { opacity: 0.8 }
            : { opacity: 0.3 }
        }
        transition={{ duration: iconDurations.fast }}
      />

      {/* Arm / raised hand — starts resting on desk, lifts up on hover */}
      <motion.path
        d="M13 15 L13 12 L13.5 10"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { d: "M13 15 L13 10 L13.5 6" }
            : { d: "M13 15 L13 12 L13.5 10" }
        }
        transition={iconSprings.interactive}
      />

      {/* Hand (open palm with fingers) */}
      <motion.path
        d="M12.5 10 L12 9.2 M13.5 10 L13.5 9 M14.2 10.2 L14.8 9.5"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? {
                d: "M12.5 6 L12 4.5 M13.5 6 L13.5 4.2 M14.2 6.2 L14.8 4.8",
                opacity: 1,
              }
            : {
                d: "M12.5 10 L12 9.2 M13.5 10 L13.5 9 M14.2 10.2 L14.8 9.5",
                opacity: 0.3,
              }
        }
        transition={{
          ...iconSprings.interactive,
          delay: iconStagger,
        }}
      />

      {/* Gold star above raised hand */}
      <motion.path
        d="M13.5 3 L14 4 L15 4.1 L14.3 4.8 L14.5 5.8 L13.5 5.2 L12.5 5.8 L12.7 4.8 L12 4.1 L13 4 Z"
        stroke={glowColors.gold}
        strokeWidth={0.7}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill={glowColors.goldAlpha40}
        animate={
          isHovered
            ? { opacity: 1, scale: [0.4, 1], y: [4, 0] }
            : { opacity: 0, scale: 0.4, y: 4 }
        }
        transition={{
          ...iconSprings.snappy,
          delay: iconDurations.fast,
        }}
      />

      {/* Gold glow behind star */}
      <motion.circle
        cx="13.5"
        cy="4"
        r="2.5"
        fill={glowColors.goldAlpha20}
        animate={
          isHovered
            ? { opacity: 0.7, scale: [0.5, 1.2] }
            : { opacity: 0, scale: 0.5 }
        }
        transition={{
          duration: iconDurations.normal,
          delay: iconDurations.fast + iconStagger,
          ease: iconEase.scholarly,
        }}
        style={{ filter: "blur(2px)" }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "MyClassesIcon",
  label: "My Classes",
  description: "Desk with notebook and chair — hand raises with fingers splayed, gold star appears above, notebook page flips",
  animationDuration: 550,
  hasLoop: false,
  svgPaths: 11,
  category: "student",
}
