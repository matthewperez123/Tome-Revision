"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase, pathDraw } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

const inkDots = [
  { cx: 16, cy: 19, r: 0.6, delay: 0 },
  { cx: 18, cy: 18.5, r: 0.4, delay: 1 },
  { cx: 17.5, cy: 20.5, r: 0.5, delay: 2 },
]

export default function QuizBuilderIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Quill feather — main shaft */}
      <motion.path
        d="M6 3 C6 3 5 10 9 14 L15 20"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        style={{ originX: "15px", originY: "20px" }}
        animate={
          isHovered
            ? { rotateZ: -30 }
            : { rotateZ: 0 }
        }
        transition={iconSprings.tilt}
      />

      {/* Feather barbs — left */}
      <motion.path
        d="M6 3 C3 6 4 9 6 11"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        style={{ originX: "15px", originY: "20px" }}
        animate={
          isHovered
            ? { rotateZ: -30 }
            : { rotateZ: 0 }
        }
        transition={{ ...iconSprings.tilt, delay: iconStagger }}
      />

      {/* Feather barbs — right */}
      <motion.path
        d="M6 3 C9 4 11 7 10 12"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        style={{ originX: "15px", originY: "20px" }}
        animate={
          isHovered
            ? { rotateZ: -30 }
            : { rotateZ: 0 }
        }
        transition={{ ...iconSprings.tilt, delay: iconStagger * 2 }}
      />

      {/* Quill nib tip */}
      <motion.path
        d="M15 20 L16 21 L17 20"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        style={{ originX: "15px", originY: "20px" }}
        animate={
          isHovered
            ? { rotateZ: -30 }
            : { rotateZ: 0 }
        }
        transition={iconSprings.tilt}
      />

      {/* Golden flourish line drawn by the quill */}
      <motion.path
        d="M16 21 C17 20 19 19 20 20 C21 21 20 22 19 21.5"
        stroke={glowColors.gold}
        strokeWidth={1}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        initial={pathDraw.hidden}
        animate={
          isHovered
            ? { pathLength: 1, opacity: 0.8 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{
          duration: iconDurations.normal,
          delay: iconDurations.fast,
          ease: iconEase.scholarly,
        }}
      />

      {/* Ink dots scattering from the tip */}
      {inkDots.map((dot, i) => (
        <motion.circle
          key={`ink-${i}`}
          cx={dot.cx}
          cy={dot.cy}
          r={dot.r}
          fill={glowColors.gold}
          vectorEffect={iconStroke.vectorEffect}
          animate={
            isHovered
              ? {
                  opacity: [0, 0.8, 0],
                  x: [0, (i - 1) * 2],
                  y: [0, (i - 1) * -1.5],
                }
              : { opacity: 0, x: 0, y: 0 }
          }
          transition={{
            duration: iconDurations.slow,
            delay: iconDurations.fast + dot.delay * iconStagger,
            ease: "easeOut",
          }}
        />
      ))}
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "QuizBuilderIcon",
  label: "Quiz Builder",
  description: "Quill pen tilts to writing angle, draws a golden flourish, ink dots scatter from the nib tip",
  animationDuration: 550,
  hasLoop: false,
  svgPaths: 8,
  category: "teacher",
}
