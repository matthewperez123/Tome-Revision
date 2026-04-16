"use client"

import { motion } from "framer-motion"
import {
  teacherStroke, teacherDurations, teacherStagger, teacherColors, teacherSprings,
  iconEase, glowColors, pathDraw, iconDurations
} from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

export default function DiscussionsIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left speech medallion — classical dialogue cameo */}
      <motion.circle
        cx="7.5"
        cy="10"
        r="4.5"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        strokeLinejoin={teacherStroke.linejoin}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { scale: [1, 1.08, 1, 1, 1.08, 1] }
            : { scale: 1 }
        }
        transition={
          isHovered
            ? {
                duration: teacherDurations.recite * 4,
                ease: iconEase.scholarly,
                times: [0, 0.15, 0.3, 0.5, 0.65, 0.8],
              }
            : { duration: teacherDurations.recite }
        }
        style={{ originX: "7.5px", originY: "10px" }}
      />

      {/* Left medallion inner mark — small profile silhouette hint */}
      <motion.path
        d="M6.5 9.5 C6.5 8.5 7 8 7.5 8 C8 8 8.5 8.5 8.5 9.5"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        opacity={0.5}
      />
      <motion.path
        d="M5.8 12 C6.2 11 6.8 10.5 7.5 10.5 C8.2 10.5 8.8 11 9.2 12"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        opacity={0.5}
      />

      {/* Right speech medallion — facing partner */}
      <motion.circle
        cx="16.5"
        cy="10"
        r="4.5"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        strokeLinejoin={teacherStroke.linejoin}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { scale: [1, 1, 1.08, 1, 1, 1.08] }
            : { scale: 1 }
        }
        transition={
          isHovered
            ? {
                duration: teacherDurations.recite * 4,
                ease: iconEase.scholarly,
                times: [0, 0.2, 0.35, 0.5, 0.7, 0.85],
              }
            : { duration: teacherDurations.recite }
        }
        style={{ originX: "16.5px", originY: "10px" }}
      />

      {/* Right medallion inner mark */}
      <motion.path
        d="M15.5 9.5 C15.5 8.5 16 8 16.5 8 C17 8 17.5 8.5 17.5 9.5"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        opacity={0.5}
      />
      <motion.path
        d="M14.8 12 C15.2 11 15.8 10.5 16.5 10.5 C17.2 10.5 17.8 11 18.2 12"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
        fill="none"
        opacity={0.5}
      />

      {/* Connecting dialogue dots — three small circles between medallions */}
      {[10.5, 12, 13.5].map((cx, i) => (
        <motion.circle
          key={`dot-${i}`}
          cx={cx}
          cy={10}
          r={0.6}
          fill={teacherColors.indigo}
          animate={
            isHovered
              ? { opacity: [0, 0.9, 0.9, 0] }
              : { opacity: 0 }
          }
          transition={
            isHovered
              ? {
                  duration: teacherDurations.recite * 2,
                  delay: i * teacherStagger,
                  ease: iconEase.scholarly,
                  times: [0, 0.3, 0.7, 1],
                }
              : { duration: iconDurations.fast }
          }
        />
      ))}

      {/* Subtle indigo glow beneath the pair */}
      <motion.ellipse
        cx="12"
        cy="16"
        rx="7"
        ry="1.5"
        fill={teacherColors.indigoAlpha20}
        animate={isHovered ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: teacherDurations.recite }}
        style={{ filter: "blur(2px)" }}
      />

      {/* Small base pedestals — classical dialogue stand */}
      <motion.line
        x1="5"
        y1="16"
        x2="10"
        y2="16"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
        opacity={0.4}
      />
      <motion.line
        x1="14"
        y1="16"
        x2="19"
        y2="16"
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
        opacity={0.4}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "DiscussionsIcon",
  label: "Discussions",
  description: "Two facing speech medallions pulse alternately like Socratic dialogue cameos, three connecting dots trace between them with staggered opacity",
  animationDuration: 1800,
  hasLoop: false,
  svgPaths: 11,
  category: "teacher",
}
