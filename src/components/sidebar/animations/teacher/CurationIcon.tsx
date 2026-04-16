"use client"

import { motion } from "framer-motion"
import {
  teacherStroke, teacherDurations, teacherStagger, teacherColors, teacherSprings,
  iconEase, glowColors, pathDraw, iconDurations
} from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

export default function CurationIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Floating shadow beneath book */}
      <motion.ellipse
        cx="12"
        cy="21"
        rx="5"
        ry="1"
        fill="rgba(120, 120, 120, 0.2)"
        animate={
          isHovered
            ? { rx: 7, ry: 1.4, opacity: 0.35 }
            : { rx: 5, ry: 1, opacity: 0 }
        }
        transition={{
          duration: teacherDurations.deliberate,
          ease: iconEase.scholarly,
        }}
        style={{ filter: "blur(2px)" }}
      />

      {/* Book spine */}
      <motion.line
        x1="12"
        y1="3"
        x2="12"
        y2="19"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
      />

      {/* Book left cover */}
      <motion.path
        d="M12 3 C10 3 5 3 5 5 L5 17 C5 18.5 8 19 12 19"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        strokeLinejoin={teacherStroke.linejoin}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
      />

      {/* Book right cover */}
      <motion.path
        d="M12 3 C14 3 19 3 19 5 L19 17 C19 18.5 16 19 12 19"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        strokeLinejoin={teacherStroke.linejoin}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
      />

      {/* Gold ribbon bookmark — slides down into book on hover */}
      <motion.path
        d="M14.5 1 L14.5 6 L15.5 5 L16.5 6 L16.5 1"
        stroke={glowColors.gold}
        strokeWidth={1.2}
        strokeLinecap={teacherStroke.linecap}
        strokeLinejoin={teacherStroke.linejoin}
        vectorEffect={teacherStroke.vectorEffect}
        fill={glowColors.goldAlpha40}
        animate={
          isHovered
            ? { y: 4 }
            : { y: 0 }
        }
        transition={teacherSprings.deliberate}
      />

      {/* Gold fleuron/star ornament on book cover center — fades in on hover */}
      <motion.g
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: teacherDurations.oration,
          delay: teacherStagger * 2,
          ease: iconEase.dactylic,
        }}
      >
        {/* Four-pointed star / fleuron */}
        <motion.path
          d="M12 9.5 L12.6 10.8 L14 11 L12.9 11.9 L13.2 13.3 L12 12.6 L10.8 13.3 L11.1 11.9 L10 11 L11.4 10.8 Z"
          stroke={glowColors.gold}
          strokeWidth={0.8}
          strokeLinejoin="round"
          vectorEffect={teacherStroke.vectorEffect}
          fill={teacherColors.goldAlpha30}
        />
      </motion.g>

      {/* Faint horizontal text lines on left page */}
      {[8, 10, 12, 14].map((y, i) => (
        <motion.line
          key={`line-l-${i}`}
          x1="7"
          y1={y}
          x2="11"
          y2={y}
          stroke="currentColor"
          strokeWidth={0.5}
          strokeLinecap={teacherStroke.linecap}
          vectorEffect={teacherStroke.vectorEffect}
          opacity={0.2}
        />
      ))}
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "CurationIcon",
  label: "Curation",
  description: "Open book with gold ribbon bookmark that slides down into the book on hover, a gold fleuron ornament fades in on the cover, floating shadow expands beneath",
  animationDuration: 750,
  hasLoop: false,
  svgPaths: 10,
  category: "teacher",
}
