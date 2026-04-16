"use client"

import { motion } from "framer-motion"
import {
  teacherStroke, teacherDurations, teacherStagger, teacherColors, teacherSprings,
  iconEase, glowColors, pathDraw, iconDurations
} from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

export default function SettingsIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Subtle indigo glow behind astrolabe */}
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        fill={teacherColors.indigoAlpha20}
        animate={isHovered ? { opacity: 0.4 } : { opacity: 0 }}
        transition={{ duration: teacherDurations.deliberate, ease: iconEase.dactylic }}
        style={{ filter: "blur(4px)" }}
      />

      {/* Outer astrolabe ring */}
      <motion.circle
        cx="12"
        cy="12"
        r="9.5"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { rotate: 30 }
            : { rotate: 0 }
        }
        transition={{
          duration: teacherDurations.deliberate,
          ease: iconEase.dactylic,
        }}
        style={{ originX: "12px", originY: "12px" }}
      />

      {/* Cardinal tick marks on outer ring — rotate with it */}
      <motion.g
        animate={
          isHovered
            ? { rotate: 30 }
            : { rotate: 0 }
        }
        transition={{
          duration: teacherDurations.deliberate,
          ease: iconEase.dactylic,
        }}
        style={{ originX: "12px", originY: "12px" }}
      >
        {/* Top tick */}
        <line x1="12" y1="2.5" x2="12" y2="4.5" stroke="currentColor" strokeWidth={teacherStroke.width} strokeLinecap={teacherStroke.linecap} vectorEffect={teacherStroke.vectorEffect} />
        {/* Right tick */}
        <line x1="19.5" y1="12" x2="21.5" y2="12" stroke="currentColor" strokeWidth={teacherStroke.width} strokeLinecap={teacherStroke.linecap} vectorEffect={teacherStroke.vectorEffect} />
        {/* Bottom tick */}
        <line x1="12" y1="19.5" x2="12" y2="21.5" stroke="currentColor" strokeWidth={teacherStroke.width} strokeLinecap={teacherStroke.linecap} vectorEffect={teacherStroke.vectorEffect} />
        {/* Left tick */}
        <line x1="2.5" y1="12" x2="4.5" y2="12" stroke="currentColor" strokeWidth={teacherStroke.width} strokeLinecap={teacherStroke.linecap} vectorEffect={teacherStroke.vectorEffect} />
      </motion.g>

      {/* Inner astrolabe ring */}
      <motion.circle
        cx="12"
        cy="12"
        r="5.5"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { rotate: -20 }
            : { rotate: 0 }
        }
        transition={{
          duration: teacherDurations.deliberate,
          ease: iconEase.dactylic,
        }}
        style={{ originX: "12px", originY: "12px" }}
      />

      {/* Inner ring accent notches — counter-rotate */}
      <motion.g
        animate={
          isHovered
            ? { rotate: -20 }
            : { rotate: 0 }
        }
        transition={{
          duration: teacherDurations.deliberate,
          ease: iconEase.dactylic,
        }}
        style={{ originX: "12px", originY: "12px" }}
      >
        {/* NE notch */}
        <line x1="15.5" y1="8.5" x2="16.5" y2="7.5" stroke="currentColor" strokeWidth={1.2} strokeLinecap={teacherStroke.linecap} vectorEffect={teacherStroke.vectorEffect} opacity={0.5} />
        {/* SW notch */}
        <line x1="8.5" y1="15.5" x2="7.5" y2="16.5" stroke="currentColor" strokeWidth={1.2} strokeLinecap={teacherStroke.linecap} vectorEffect={teacherStroke.vectorEffect} opacity={0.5} />
        {/* NW notch */}
        <line x1="8.5" y1="8.5" x2="7.5" y2="7.5" stroke="currentColor" strokeWidth={1.2} strokeLinecap={teacherStroke.linecap} vectorEffect={teacherStroke.vectorEffect} opacity={0.5} />
        {/* SE notch */}
        <line x1="15.5" y1="15.5" x2="16.5" y2="16.5" stroke="currentColor" strokeWidth={1.2} strokeLinecap={teacherStroke.linecap} vectorEffect={teacherStroke.vectorEffect} opacity={0.5} />
      </motion.g>

      {/* Center dot — pulses on hover */}
      <motion.circle
        cx="12"
        cy="12"
        r="1.5"
        fill={teacherColors.indigo}
        stroke={glowColors.gold}
        strokeWidth={0.8}
        vectorEffect={teacherStroke.vectorEffect}
        animate={
          isHovered
            ? { scale: [1, 1.3, 1] }
            : { scale: 1 }
        }
        transition={
          isHovered
            ? {
                duration: teacherDurations.deliberate,
                ease: iconEase.dactylic,
              }
            : { duration: teacherDurations.recite }
        }
        style={{ originX: "12px", originY: "12px" }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "SettingsIcon",
  label: "Settings",
  description: "Ornate astrolabe-style ring: outer ring rotates 30deg clockwise, inner ring 20deg counter-clockwise, center dot pulses, all with slow deliberate dactylic easing",
  animationDuration: 750,
  hasLoop: false,
  svgPaths: 13,
  category: "teacher",
}
