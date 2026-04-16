"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

export default function BookClubsIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Warm gold glow behind overlap zone */}
      <motion.circle
        cx="12"
        cy="12"
        r="4"
        fill={glowColors.goldAlpha40}
        animate={
          isHovered
            ? { opacity: 0.8, scale: 1.2 }
            : { opacity: 0, scale: 0.5 }
        }
        transition={{
          duration: iconDurations.normal,
          delay: iconDurations.normal,
          ease: iconEase.scholarly as [number, number, number, number],
        }}
        style={{ filter: "blur(3px)", originX: "12px", originY: "12px" }}
      />

      {/* Left book outline */}
      <motion.path
        d="M4 4 L4 19 Q4 20 5 20 L13 20 L13 5 Q13 4 12 4 Z"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={isHovered ? { x: -1.5 } : { x: 0 }}
        transition={{ ...iconSprings.gentle, delay: iconStagger }}
      />

      {/* Left book spine detail */}
      <motion.line
        x1="6.5"
        y1="4"
        x2="6.5"
        y2="20"
        stroke="currentColor"
        strokeWidth={0.7}
        vectorEffect={iconStroke.vectorEffect}
        opacity={0.4}
        animate={isHovered ? { x: -1.5 } : { x: 0 }}
        transition={{ ...iconSprings.gentle, delay: iconStagger }}
      />

      {/* Right book outline */}
      <motion.path
        d="M20 4 L20 19 Q20 20 19 20 L11 20 L11 5 Q11 4 12 4 Z"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={isHovered ? { x: 1.5 } : { x: 0 }}
        transition={{ ...iconSprings.gentle, delay: iconStagger }}
      />

      {/* Right book spine detail */}
      <motion.line
        x1="17.5"
        y1="4"
        x2="17.5"
        y2="20"
        stroke="currentColor"
        strokeWidth={0.7}
        vectorEffect={iconStroke.vectorEffect}
        opacity={0.4}
        animate={isHovered ? { x: 1.5 } : { x: 0 }}
        transition={{ ...iconSprings.gentle, delay: iconStagger }}
      />

      {/* Books press back together */}
      <motion.path
        d="M4 4 L4 19 Q4 20 5 20 L13 20 L13 5 Q13 4 12 4 Z"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { x: [-1.5, -1.5, 0], opacity: [0, 0, 1] }
            : { x: 0, opacity: 0 }
        }
        transition={{
          duration: iconDurations.slow,
          delay: iconDurations.normal,
          ease: iconEase.scholarly as [number, number, number, number],
        }}
      />
      <motion.path
        d="M20 4 L20 19 Q20 20 19 20 L11 20 L11 5 Q11 4 12 4 Z"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill="none"
        animate={
          isHovered
            ? { x: [1.5, 1.5, 0], opacity: [0, 0, 1] }
            : { x: 0, opacity: 0 }
        }
        transition={{
          duration: iconDurations.slow,
          delay: iconDurations.normal,
          ease: iconEase.scholarly as [number, number, number, number],
        }}
      />

      {/* Heart in overlap zone */}
      <motion.path
        d="M12 14.5 L10.5 12.8 Q9.5 11.5 10.5 10.5 Q11.5 9.5 12 10.8 Q12.5 9.5 13.5 10.5 Q14.5 11.5 13.5 12.8 Z"
        stroke={glowColors.gold}
        strokeWidth={1}
        strokeLinejoin={iconStroke.linejoin}
        vectorEffect={iconStroke.vectorEffect}
        fill={glowColors.goldAlpha40}
        animate={
          isHovered
            ? {
                opacity: [0, 0, 0, 1],
                scale: [0.3, 0.3, 0.3, 1],
              }
            : { opacity: 0, scale: 0.3 }
        }
        transition={{
          duration: iconDurations.maxAnimation,
          ease: iconEase.outExpo as [number, number, number, number],
          delay: iconDurations.fast,
        }}
        style={{ originX: "12px", originY: "12px" }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "BookClubsIcon",
  label: "Book Clubs",
  description: "Two overlapping books separate then press together, heart appears in overlap with warm gold glow",
  animationDuration: 600,
  hasLoop: false,
  svgPaths: 9,
  category: "student",
}
