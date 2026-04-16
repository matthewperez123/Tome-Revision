"use client"

import { motion } from "framer-motion"
import {
  teacherStroke, teacherDurations, teacherStagger, teacherColors, teacherSprings,
  iconEase, glowColors, pathDraw, iconDurations
} from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

export default function ClassroomIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Lectern body (trapezoid podium) ── */}
      <motion.path
        d="M7 12 L5 21 L19 21 L17 12 Z"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        strokeLinejoin={teacherStroke.linejoin}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
      />

      {/* ── Lectern top surface ── */}
      <motion.path
        d="M6 12 L18 12"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
      />

      {/* ── Small shelf on podium front ── */}
      <motion.path
        d="M9 16 L15 16"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        animate={isHovered ? { opacity: 0.5 } : { opacity: 1 }}
        transition={{ duration: teacherDurations.recite }}
      />

      {/* ── Gold podium light (downward cone) ── */}
      <motion.path
        d="M11 3 L13 3 L16 10 L8 10 Z"
        fill={glowColors.goldAlpha40}
        stroke={glowColors.gold}
        strokeWidth={0.5}
        vectorEffect={teacherStroke.vectorEffect}
        animate={isHovered ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0.3 }}
        style={{ originX: "12px", originY: "3px" }}
        transition={{ duration: teacherDurations.oration, ease: iconEase.scholarly }}
      />

      {/* ── Light source dot ── */}
      <motion.circle
        cx="12"
        cy="2.5"
        r="1"
        fill={glowColors.gold}
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: teacherDurations.recite }}
      />

      {/* ── Student silhouettes (3 rising from below lectern) ── */}
      {/* Student 1 — left */}
      <motion.g
        animate={isHovered ? { y: 0, opacity: 1 } : { y: 6, opacity: 0 }}
        transition={{ ...teacherSprings.overshoot, delay: 0 }}
      >
        <circle
          cx="4"
          cy="18"
          r="1.2"
          stroke={teacherColors.indigo}
          strokeWidth={teacherStroke.width}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />
        <path
          d="M2 22 C2 20.5 3 19.5 4 19.5 C5 19.5 6 20.5 6 22"
          stroke={teacherColors.indigo}
          strokeWidth={teacherStroke.width}
          strokeLinecap={teacherStroke.linecap}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />
      </motion.g>

      {/* Student 2 — center */}
      <motion.g
        animate={isHovered ? { y: 0, opacity: 1 } : { y: 6, opacity: 0 }}
        transition={{ ...teacherSprings.overshoot, delay: teacherStagger }}
      >
        <circle
          cx="12"
          cy="19"
          r="1.2"
          stroke={teacherColors.indigo}
          strokeWidth={teacherStroke.width}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />
        <path
          d="M10 23 C10 21.5 11 20.5 12 20.5 C13 20.5 14 21.5 14 23"
          stroke={teacherColors.indigo}
          strokeWidth={teacherStroke.width}
          strokeLinecap={teacherStroke.linecap}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />
      </motion.g>

      {/* Student 3 — right */}
      <motion.g
        animate={isHovered ? { y: 0, opacity: 1 } : { y: 6, opacity: 0 }}
        transition={{ ...teacherSprings.overshoot, delay: teacherStagger * 2 }}
      >
        <circle
          cx="20"
          cy="18"
          r="1.2"
          stroke={teacherColors.indigo}
          strokeWidth={teacherStroke.width}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />
        <path
          d="M18 22 C18 20.5 19 19.5 20 19.5 C21 19.5 22 20.5 22 22"
          stroke={teacherColors.indigo}
          strokeWidth={teacherStroke.width}
          strokeLinecap={teacherStroke.linecap}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />
      </motion.g>
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "ClassroomIcon",
  label: "Classroom",
  description: "Lectern podium with gold spotlight; three student silhouettes rise with staggered overshoot spring on hover",
  animationDuration: 750,
  hasLoop: false,
  svgPaths: 10,
  category: "teacher",
}
