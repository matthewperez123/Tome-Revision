"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase, pathDraw } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

export default function ParentsIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Warm cream glow behind figures */}
      <motion.ellipse
        cx="12"
        cy="14"
        rx="10"
        ry="6"
        fill={glowColors.cream}
        animate={isHovered ? { opacity: 0.35 } : { opacity: 0 }}
        transition={{ duration: iconDurations.normal }}
        style={{ filter: "blur(4px)" }}
      />

      {/* Adult head */}
      <motion.circle
        cx="9"
        cy="7"
        r="2.5"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { x: 0.8 }
            : { x: 0 }
        }
        transition={{ ...iconSprings.gentle, delay: 0 }}
      />

      {/* Adult body */}
      <motion.path
        d="M4 21 C4 17.5 6 15 9 15 C10.5 15 11.5 15.5 12 16"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { x: 0.8 }
            : { x: 0 }
        }
        transition={{ ...iconSprings.gentle, delay: iconStagger }}
      />

      {/* Child head */}
      <motion.circle
        cx="16"
        cy="9"
        r="2"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { x: -0.8 }
            : { x: 0 }
        }
        transition={{ ...iconSprings.gentle, delay: iconStagger }}
      />

      {/* Child body */}
      <motion.path
        d="M12 21 C12 18.5 13.5 17 16 17 C18.5 17 20 18.5 20 21"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { x: -0.8 }
            : { x: 0 }
        }
        transition={{ ...iconSprings.gentle, delay: iconStagger * 2 }}
      />

      {/* Protective arc above both figures */}
      <motion.path
        d="M5 5 C8 1.5 16 1.5 19 5"
        stroke={glowColors.gold}
        strokeWidth={1}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        initial={pathDraw.hidden}
        animate={
          isHovered
            ? { pathLength: 1, opacity: 0.7 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{
          duration: iconDurations.slow,
          delay: iconDurations.instant,
          ease: iconEase.scholarly,
        }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "ParentsIcon",
  label: "Parents",
  description: "Adult and child figures lean toward each other, protective golden arc draws overhead with cream glow",
  animationDuration: 500,
  hasLoop: false,
  svgPaths: 6,
  category: "teacher",
}
