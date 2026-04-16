"use client"

import { motion } from "framer-motion"
import {
  teacherStroke, teacherDurations, teacherStagger, teacherColors, teacherSprings,
  iconEase, glowColors, pathDraw, iconDurations
} from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

export default function CurriculumIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Indigo glow behind open book ── */}
      <motion.rect
        x="2"
        y="3"
        width="18"
        height="18"
        rx="2"
        fill={teacherColors.indigoAlpha20}
        animate={isHovered ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: teacherDurations.recite }}
        style={{ filter: "blur(4px)" }}
      />

      {/* ── Back cover (stays in place) ── */}
      <motion.rect
        x="4"
        y="3"
        width="14"
        height="18"
        rx="1.5"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinejoin={teacherStroke.linejoin}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
      />

      {/* ── Book spine ── */}
      <motion.line
        x1="4"
        y1="3"
        x2="4"
        y2="21"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        vectorEffect={teacherStroke.vectorEffect}
      />

      {/* ── Front cover (opens on hover) ── */}
      <motion.rect
        x="4"
        y="3"
        width="14"
        height="18"
        rx="1.5"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinejoin={teacherStroke.linejoin}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        style={{ originX: "4px", originY: "12px" }}
        animate={isHovered ? { rotateY: -25 } : { rotateY: 0 }}
        transition={teacherSprings.authoritative}
      />

      {/* ── Clasp circle (right edge of book) ── */}
      <motion.circle
        cx="18.5"
        cy="12"
        r="1.2"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        style={{ originX: "18.5px", originY: "12px" }}
        animate={isHovered ? { rotate: 90, x: 1.5 } : { rotate: 0, x: 0 }}
        transition={teacherSprings.authoritative}
      />

      {/* ── Clasp latch bar ── */}
      <motion.line
        x1="18.5"
        y1="10.5"
        x2="18.5"
        y2="13.5"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
        style={{ originX: "18.5px", originY: "12px" }}
        animate={isHovered ? { rotate: 90, x: 1.5 } : { rotate: 0, x: 0 }}
        transition={teacherSprings.authoritative}
      />

      {/* ── Tree of Knowledge (draws on hover) ── */}
      {/* Trunk */}
      <motion.path
        d="M11 18 L11 11"
        stroke={teacherColors.indigo}
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{
          duration: teacherDurations.oration,
          ease: iconEase.dactylic,
          delay: 0.15,
        }}
      />

      {/* Branch 1 — left */}
      <motion.path
        d="M11 13 L8 9"
        stroke={teacherColors.indigo}
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{
          duration: teacherDurations.recite,
          ease: iconEase.dactylic,
          delay: 0.35,
        }}
      />

      {/* Branch 2 — center (upward) */}
      <motion.path
        d="M11 11 L11 7"
        stroke={teacherColors.indigo}
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{
          duration: teacherDurations.recite,
          ease: iconEase.dactylic,
          delay: 0.43,
        }}
      />

      {/* Branch 3 — right */}
      <motion.path
        d="M11 12 L14 8"
        stroke={teacherColors.indigo}
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{
          duration: teacherDurations.recite,
          ease: iconEase.dactylic,
          delay: 0.51,
        }}
      />

      {/* ── Leaf dots at branch tips (gold highlights) ── */}
      <motion.circle
        cx="8"
        cy="8.5"
        r="1"
        fill={glowColors.goldAlpha40}
        animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: teacherDurations.recite, delay: 0.55 }}
      />
      <motion.circle
        cx="11"
        cy="6.5"
        r="1"
        fill={glowColors.goldAlpha40}
        animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: teacherDurations.recite, delay: 0.6 }}
      />
      <motion.circle
        cx="14"
        cy="7.5"
        r="1"
        fill={glowColors.goldAlpha40}
        animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: teacherDurations.recite, delay: 0.65 }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "CurriculumIcon",
  label: "Curriculum",
  description: "Closed codex with clasp; clasp unlatches and cover opens, tree-of-knowledge diagram draws itself with staggered pathLength branches",
  animationDuration: 750,
  hasLoop: false,
  svgPaths: 12,
  category: "teacher",
}
