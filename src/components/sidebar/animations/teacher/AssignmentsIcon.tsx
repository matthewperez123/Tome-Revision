"use client"

import { motion } from "framer-motion"
import {
  teacherStroke, teacherDurations, teacherStagger, teacherColors, teacherSprings,
  iconEase, glowColors, pathDraw, iconDurations
} from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

export default function AssignmentsIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Bottom scroll (deepest in stack) ── */}
      <motion.g>
        {/* Scroll body */}
        <rect
          x="3"
          y="16"
          width="14"
          height="3"
          rx="1.5"
          stroke="currentColor"
          strokeWidth={teacherStroke.width}
          strokeLinejoin={teacherStroke.linejoin}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />
        {/* Left curl */}
        <circle
          cx="3"
          cy="17.5"
          r="1.5"
          stroke="currentColor"
          strokeWidth={teacherStroke.width}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />
        {/* Right curl */}
        <circle
          cx="17"
          cy="17.5"
          r="1.5"
          stroke="currentColor"
          strokeWidth={teacherStroke.width}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />
      </motion.g>

      {/* ── Middle scroll ── */}
      <motion.g>
        <rect
          x="4"
          y="11"
          width="14"
          height="3"
          rx="1.5"
          stroke="currentColor"
          strokeWidth={teacherStroke.width}
          strokeLinejoin={teacherStroke.linejoin}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />
        <circle
          cx="4"
          cy="12.5"
          r="1.5"
          stroke="currentColor"
          strokeWidth={teacherStroke.width}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />
        <circle
          cx="18"
          cy="12.5"
          r="1.5"
          stroke="currentColor"
          strokeWidth={teacherStroke.width}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />
      </motion.g>

      {/* ── Top scroll (unfurls on hover) ── */}
      <motion.g
        animate={isHovered ? { y: -1 } : { y: 0 }}
        transition={teacherSprings.deliberate}
      >
        {/* Left curl of top scroll */}
        <circle
          cx="3"
          cy="7.5"
          r="1.5"
          stroke="currentColor"
          strokeWidth={teacherStroke.width}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />

        {/* Scroll body — unfurls via scaleX */}
        <motion.rect
          x="3"
          y="6"
          width="16"
          height="3"
          rx="1.5"
          stroke="currentColor"
          strokeWidth={teacherStroke.width}
          strokeLinejoin={teacherStroke.linejoin}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
          style={{ originX: "3px", originY: "7.5px" }}
          animate={isHovered ? { scaleX: 1.15 } : { scaleX: 1 }}
          transition={{ duration: teacherDurations.oration, ease: iconEase.scholarly }}
        />

        {/* Right curl — moves with unfurl */}
        <motion.circle
          cx="19"
          cy="7.5"
          r="1.5"
          stroke="currentColor"
          strokeWidth={teacherStroke.width}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
          animate={isHovered ? { x: 2.5 } : { x: 0 }}
          transition={{ duration: teacherDurations.oration, ease: iconEase.scholarly }}
        />

        {/* ── Ruled lines revealed inside unrolled scroll ── */}
        <motion.line
          x1="5"
          y1="6.8"
          x2="17"
          y2="6.8"
          stroke={teacherColors.indigoAlpha40}
          strokeWidth={0.5}
          vectorEffect={teacherStroke.vectorEffect}
          animate={isHovered ? { opacity: 1, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
          transition={{ duration: teacherDurations.deliberate, ease: iconEase.scholarly, delay: 0.15 }}
        />
        <motion.line
          x1="5"
          y1="7.5"
          x2="17"
          y2="7.5"
          stroke={teacherColors.indigoAlpha40}
          strokeWidth={0.5}
          vectorEffect={teacherStroke.vectorEffect}
          animate={isHovered ? { opacity: 1, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
          transition={{ duration: teacherDurations.deliberate, ease: iconEase.scholarly, delay: 0.22 }}
        />
        <motion.line
          x1="5"
          y1="8.2"
          x2="17"
          y2="8.2"
          stroke={teacherColors.indigoAlpha40}
          strokeWidth={0.5}
          vectorEffect={teacherStroke.vectorEffect}
          animate={isHovered ? { opacity: 1, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
          transition={{ duration: teacherDurations.deliberate, ease: iconEase.scholarly, delay: 0.29 }}
        />
      </motion.g>

      {/* ── Quill descending from above ── */}
      <motion.g
        animate={isHovered ? { y: 0, opacity: 1 } : { y: -8, opacity: 0 }}
        transition={teacherSprings.deliberate}
      >
        {/* Quill shaft */}
        <motion.path
          d="M19 2 L16 8"
          stroke={glowColors.gold}
          strokeWidth={teacherStroke.width}
          strokeLinecap={teacherStroke.linecap}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />
        {/* Quill feather vane */}
        <motion.path
          d="M19 2 C21 3 21 5 19.5 5.5 M19 2 C17 2.5 16.5 4 17 5"
          stroke={glowColors.gold}
          strokeWidth={1}
          strokeLinecap={teacherStroke.linecap}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />
        {/* Nib */}
        <motion.path
          d="M16 8 L15.5 9.5 L16.5 8.8 Z"
          fill={glowColors.gold}
          vectorEffect={teacherStroke.vectorEffect}
        />
      </motion.g>

      {/* ── Gold ink dot where quill meets scroll ── */}
      <motion.circle
        cx="16"
        cy="7"
        r="0.8"
        fill={glowColors.gold}
        animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: teacherDurations.recite, delay: 0.3 }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "AssignmentsIcon",
  label: "Assignments",
  description: "Stack of three scrolls; top scroll unfurls revealing ruled lines, gold quill descends with deliberate spring",
  animationDuration: 750,
  hasLoop: false,
  svgPaths: 14,
  category: "teacher",
}
