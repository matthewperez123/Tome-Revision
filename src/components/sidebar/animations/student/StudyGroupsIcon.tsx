"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

/* Three figures arranged in a circle (top, bottom-left, bottom-right) */
const figures = [
  { headCx: 12, headCy: 4.5, bodyD: "M12 6.5 L12 9", leanRotate: 8, originX: "12px", originY: "9px", delay: 0 },
  { headCx: 6, headCy: 14, bodyD: "M6 16 L6 18.5", leanRotate: -10, originX: "6px", originY: "18.5px", delay: 1 },
  { headCx: 18, headCy: 14, bodyD: "M18 16 L18 18.5", leanRotate: 10, originX: "18px", originY: "18.5px", delay: 2 },
]

/* Gold shimmer particles around the center book */
const shimmerDots = [
  { cx: 10.5, cy: 11, delay: 0.12 },
  { cx: 13.5, cy: 11, delay: 0.22 },
  { cx: 12, cy: 13.5, delay: 0.32 },
]

export default function StudyGroupsIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Figures: head + body */}
      {figures.map((fig, i) => (
        <motion.g
          key={`figure-${i}`}
          animate={
            isHovered
              ? { rotate: fig.leanRotate }
              : { rotate: 0 }
          }
          style={{ originX: fig.originX, originY: fig.originY }}
          transition={{
            ...iconSprings.gentle,
            delay: fig.delay * iconStagger,
          }}
        >
          {/* Head */}
          <motion.circle
            cx={fig.headCx}
            cy={fig.headCy}
            r={2}
            stroke="currentColor"
            strokeWidth={iconStroke.width}
            vectorEffect={iconStroke.vectorEffect}
            fill="none"
          />

          {/* Body */}
          <motion.path
            d={fig.bodyD}
            stroke="currentColor"
            strokeWidth={iconStroke.width}
            strokeLinecap={iconStroke.linecap}
            vectorEffect={iconStroke.vectorEffect}
            fill="none"
          />

          {/* Arms reaching toward center */}
          <motion.line
            x1={fig.headCx}
            y1={fig.headCy + 3.5}
            x2={fig.headCx < 12 ? fig.headCx + 2.5 : fig.headCx > 12 ? fig.headCx - 2.5 : fig.headCx}
            y2={fig.headCy + (fig.headCy < 10 ? 5 : 2)}
            stroke="currentColor"
            strokeWidth={1}
            strokeLinecap={iconStroke.linecap}
            vectorEffect={iconStroke.vectorEffect}
            animate={
              isHovered
                ? { opacity: 0.8 }
                : { opacity: 0.3 }
            }
            transition={{
              duration: iconDurations.fast,
              delay: fig.delay * iconStagger,
            }}
          />
        </motion.g>
      ))}

      {/* Connecting circle (subtle link between figures) */}
      <motion.circle
        cx="12"
        cy="13"
        r="5.5"
        stroke="currentColor"
        strokeWidth={0.5}
        strokeDasharray="2 3"
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { opacity: 0.4, scale: [0.97, 1] }
            : { opacity: 0.15, scale: 1 }
        }
        transition={{
          ...iconSprings.gentle,
          delay: iconStagger * 2,
        }}
      />

      {/* Center open book — left page */}
      <motion.path
        d="M12 11 L9.5 11.5 L9.5 14.5 L12 14"
        stroke={isHovered ? glowColors.gold : "currentColor"}
        strokeWidth={iconStroke.width}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { opacity: 1, scale: [0.5, 1] }
            : { opacity: 0, scale: 0.5 }
        }
        transition={{
          ...iconSprings.bookOpen,
          delay: iconDurations.instant,
        }}
      />

      {/* Center open book — right page */}
      <motion.path
        d="M12 11 L14.5 11.5 L14.5 14.5 L12 14"
        stroke={isHovered ? glowColors.gold : "currentColor"}
        strokeWidth={iconStroke.width}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { opacity: 1, scale: [0.5, 1] }
            : { opacity: 0, scale: 0.5 }
        }
        transition={{
          ...iconSprings.bookOpen,
          delay: iconDurations.instant + iconStagger,
        }}
      />

      {/* Book spine */}
      <motion.line
        x1="12"
        y1="11"
        x2="12"
        y2="14"
        stroke={isHovered ? glowColors.gold : "currentColor"}
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        animate={
          isHovered
            ? { opacity: 1, scaleY: [0.3, 1] }
            : { opacity: 0, scaleY: 0.3 }
        }
        transition={{
          duration: iconDurations.normal,
          delay: iconDurations.instant,
          ease: iconEase.scholarly,
        }}
      />

      {/* Page flutter lines (simulating turning pages) */}
      <motion.path
        d="M10.5 12 Q12 11.2 13.5 12"
        stroke={glowColors.gold}
        strokeWidth={0.6}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? {
                opacity: [0, 0.7, 0],
                y: [0, -1.5],
              }
            : { opacity: 0, y: 0 }
        }
        transition={{
          duration: iconDurations.slow,
          delay: iconDurations.fast,
          ease: "easeOut",
        }}
      />

      <motion.path
        d="M10.8 12.5 Q12 11.8 13.2 12.5"
        stroke={glowColors.gold}
        strokeWidth={0.5}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? {
                opacity: [0, 0.5, 0],
                y: [0, -2],
              }
            : { opacity: 0, y: 0 }
        }
        transition={{
          duration: iconDurations.slow,
          delay: iconDurations.normal,
          ease: "easeOut",
        }}
      />

      {/* Gold shimmer dots around the book */}
      {shimmerDots.map((dot, i) => (
        <motion.circle
          key={`shimmer-${i}`}
          cx={dot.cx}
          cy={dot.cy}
          r={0.5}
          fill={glowColors.gold}
          animate={
            isHovered
              ? { opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }
              : { opacity: 0, scale: 0.5 }
          }
          transition={{
            duration: iconDurations.slow,
            delay: dot.delay,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Gold glow behind center book */}
      <motion.circle
        cx="12"
        cy="12.5"
        r="3"
        fill={glowColors.goldAlpha20}
        animate={
          isHovered
            ? { opacity: 0.6, scale: [0.6, 1.1, 1] }
            : { opacity: 0, scale: 0.6 }
        }
        transition={{
          duration: iconDurations.normal,
          delay: iconDurations.instant,
          ease: iconEase.scholarly,
        }}
        style={{ filter: "blur(3px)" }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "StudyGroupsIcon",
  label: "Study Groups",
  description: "Three figures in a circle lean inward, open book appears at center with fluttering gold pages and shimmer",
  animationDuration: 550,
  hasLoop: false,
  svgPaths: 14,
  category: "student",
}
