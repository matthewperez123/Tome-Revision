"use client"

import { motion } from "framer-motion"
import {
  teacherStroke, teacherDurations, teacherStagger, teacherColors, teacherSprings,
  iconEase, glowColors, pathDraw, iconDurations
} from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

export default function GradingInkIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Parchment body */}
      <motion.rect
        x="4"
        y="3"
        width="14"
        height="18"
        rx="1"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinejoin={teacherStroke.linejoin}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
      />

      {/* Parchment corner fold — triangular dog-ear */}
      <motion.path
        d="M14 3 L18 3 L18 7 Z"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinejoin={teacherStroke.linejoin}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
      />

      {/* Fold inner crease */}
      <motion.path
        d="M14 3 L14 7 L18 7"
        stroke="currentColor"
        strokeWidth={teacherStroke.width * 0.6}
        strokeLinejoin={teacherStroke.linejoin}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        opacity={0.4}
      />

      {/* Quill shaft + nib — sits beside parchment at idle, lifts and dips on hover */}
      <motion.g
        style={{ originX: "21px", originY: "18px" }}
        animate={
          isHovered
            ? { y: -2, rotate: -12 }
            : { y: 0, rotate: 0 }
        }
        transition={teacherSprings.authoritative}
      >
        {/* Quill shaft */}
        <motion.path
          d="M20 4 C20 4 21 8 20 12 L19 16"
          stroke="currentColor"
          strokeWidth={teacherStroke.width}
          strokeLinecap={teacherStroke.linecap}
          strokeLinejoin={teacherStroke.linejoin}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />

        {/* Feather barb — left */}
        <motion.path
          d="M20 4 C18 6 18.5 8.5 19 10"
          stroke="currentColor"
          strokeWidth={teacherStroke.width * 0.8}
          strokeLinecap={teacherStroke.linecap}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />

        {/* Feather barb — right */}
        <motion.path
          d="M20 4 C22 6 21.5 9 20.5 11"
          stroke="currentColor"
          strokeWidth={teacherStroke.width * 0.8}
          strokeLinecap={teacherStroke.linecap}
          vectorEffect={teacherStroke.vectorEffect}
          fill="none"
        />

        {/* Nib */}
        <motion.path
          d="M19 16 L18.5 18 L19.5 18 Z"
          stroke={teacherColors.indigo}
          strokeWidth={teacherStroke.width * 0.7}
          strokeLinejoin={teacherStroke.linejoin}
          vectorEffect={teacherStroke.vectorEffect}
          fill={teacherColors.indigo}
        />
      </motion.g>

      {/* Confident indigo checkmark — draws across the parchment on hover */}
      <motion.path
        d="M7 13 L10 16.5 L16 9"
        stroke={teacherColors.indigo}
        strokeWidth={2.2}
        strokeLinecap={teacherStroke.linecap}
        strokeLinejoin={teacherStroke.linejoin}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        initial={pathDraw.hidden}
        animate={
          isHovered
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{
          duration: teacherDurations.oration,
          delay: teacherDurations.recite * 0.3,
          ease: iconEase.outExpo,
        }}
      />

      {/* Subtle gold glow behind checkmark */}
      <motion.path
        d="M7 13 L10 16.5 L16 9"
        stroke={glowColors.goldAlpha40}
        strokeWidth={4}
        strokeLinecap={teacherStroke.linecap}
        strokeLinejoin={teacherStroke.linejoin}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        style={{ filter: "blur(2px)" }}
        animate={
          isHovered
            ? { pathLength: 1, opacity: 0.5 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{
          duration: teacherDurations.oration,
          delay: teacherDurations.recite * 0.4,
          ease: iconEase.outExpo,
        }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "GradingInkIcon",
  label: "Grading Ink",
  description: "Red-ink quill lifts and rotates beside parchment with corner fold, draws a confident indigo checkmark across the page with gold glow",
  animationDuration: 750,
  hasLoop: false,
  svgPaths: 10,
  category: "teacher",
}
