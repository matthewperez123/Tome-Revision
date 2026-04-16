"use client"

import { motion } from "framer-motion"
import {
  teacherStroke, teacherDurations, teacherStagger, teacherColors, teacherSprings,
  iconEase, glowColors, pathDraw, iconDurations
} from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

// Classical column proportions: short / medium / tall (Doric ratios ~1:1.4:1.8)
const columns = [
  { x: 5, idleHeight: 6, hoverHeight: 8, delay: 0 },
  { x: 10.5, idleHeight: 8.5, hoverHeight: 12, delay: 1 },
  { x: 16, idleHeight: 11, hoverHeight: 16, delay: 2 },
]

const colWidth = 3.5
const baseline = 21

export default function AnalyticsIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Baseline — stone plinth */}
      <motion.line
        x1="3"
        y1={baseline}
        x2="21"
        y2={baseline}
        stroke="currentColor"
        strokeWidth={teacherStroke.width}
        strokeLinecap={teacherStroke.linecap}
        vectorEffect={teacherStroke.vectorEffect}
      />

      {/* Columns — rise from baseline */}
      {columns.map((col, i) => {
        const idleY = baseline - col.idleHeight
        const hoverY = baseline - col.hoverHeight
        return (
          <g key={`col-${i}`}>
            {/* Column capital (top ornament) — small horizontal bar */}
            <motion.line
              x1={col.x - 0.4}
              y1={idleY}
              x2={col.x + colWidth + 0.4}
              y2={idleY}
              stroke="currentColor"
              strokeWidth={teacherStroke.width}
              strokeLinecap={teacherStroke.linecap}
              vectorEffect={teacherStroke.vectorEffect}
              animate={
                isHovered
                  ? { y1: hoverY - idleY, y2: hoverY - idleY }
                  : { y1: 0, y2: 0 }
              }
              transition={{
                ...teacherSprings.overshoot,
                delay: i * teacherStagger,
              }}
            />

            {/* Column body — indigo filled rect that grows upward */}
            <motion.rect
              x={col.x}
              width={colWidth}
              rx="0.5"
              fill={teacherColors.indigo}
              stroke={teacherColors.indigo}
              strokeWidth={0.5}
              vectorEffect={teacherStroke.vectorEffect}
              animate={
                isHovered
                  ? {
                      y: hoverY,
                      height: col.hoverHeight,
                    }
                  : {
                      y: idleY,
                      height: col.idleHeight,
                    }
              }
              transition={{
                ...teacherSprings.overshoot,
                delay: i * teacherStagger,
              }}
            />

            {/* Column fluting lines — vertical grooves for classical feel */}
            <motion.line
              x1={col.x + colWidth * 0.35}
              y1={baseline - 1}
              x2={col.x + colWidth * 0.35}
              y2={idleY + 1}
              stroke="white"
              strokeWidth={0.3}
              vectorEffect={teacherStroke.vectorEffect}
              opacity={0.25}
              animate={
                isHovered
                  ? { y2: hoverY + 1 - idleY }
                  : { y2: 0 }
              }
              transition={{
                ...teacherSprings.overshoot,
                delay: i * teacherStagger,
              }}
            />
            <motion.line
              x1={col.x + colWidth * 0.65}
              y1={baseline - 1}
              x2={col.x + colWidth * 0.65}
              y2={idleY + 1}
              stroke="white"
              strokeWidth={0.3}
              vectorEffect={teacherStroke.vectorEffect}
              opacity={0.25}
              animate={
                isHovered
                  ? { y2: hoverY + 1 - idleY }
                  : { y2: 0 }
              }
              transition={{
                ...teacherSprings.overshoot,
                delay: i * teacherStagger,
              }}
            />
          </g>
        )
      })}

      {/* Gold trend line — draws across column tops on hover */}
      <motion.path
        d={`M${columns[0].x + colWidth / 2} ${baseline - columns[0].hoverHeight} L${columns[1].x + colWidth / 2} ${baseline - columns[1].hoverHeight} L${columns[2].x + colWidth / 2} ${baseline - columns[2].hoverHeight}`}
        stroke={glowColors.gold}
        strokeWidth={1.8}
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
          delay: teacherStagger * 3,
          ease: iconEase.outExpo,
        }}
      />

      {/* Gold glow behind trend line */}
      <motion.path
        d={`M${columns[0].x + colWidth / 2} ${baseline - columns[0].hoverHeight} L${columns[1].x + colWidth / 2} ${baseline - columns[1].hoverHeight} L${columns[2].x + colWidth / 2} ${baseline - columns[2].hoverHeight}`}
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
          delay: teacherStagger * 3 + 0.05,
          ease: iconEase.outExpo,
        }}
      />

      {/* Trend line endpoint dots — gold circles at column tops */}
      {columns.map((col, i) => (
        <motion.circle
          key={`dot-${i}`}
          cx={col.x + colWidth / 2}
          cy={baseline - col.hoverHeight}
          r="1.5"
          fill={glowColors.gold}
          vectorEffect={teacherStroke.vectorEffect}
          animate={
            isHovered
              ? { scale: 1, opacity: 1 }
              : { scale: 0, opacity: 0 }
          }
          transition={{
            ...teacherSprings.overshoot,
            delay: teacherStagger * 3 + teacherDurations.oration * 0.3 + i * teacherStagger,
          }}
        />
      ))}
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "AnalyticsIcon",
  label: "Analytics",
  description: "Three classical columns rise from a stone baseline with overshoot spring, gold trend line draws across the tops with endpoint dots",
  animationDuration: 800,
  hasLoop: false,
  svgPaths: 14,
  category: "teacher",
}
