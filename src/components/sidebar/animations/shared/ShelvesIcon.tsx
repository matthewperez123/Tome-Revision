"use client"

import { motion } from "framer-motion"
import { iconSprings, iconStagger, glowColors, iconStroke, iconDurations, iconEase } from "@/lib/animations/sidebar-tokens"
import type { AnimatedIconProps, AnimatedIconMeta } from "../types"

/* Books on top shelf — slide from alternating directions */
const topBooks = [
  { x: 4, width: 2.5, height: 6, fromX: -6, delay: 0 },
  { x: 7.5, width: 2, height: 6, fromX: 6, delay: 1 },
  { x: 10.5, width: 2.5, height: 6, fromX: -6, delay: 2 },
  { x: 14, width: 2, height: 6, fromX: 6, delay: 3 },
]

/* Books on bottom shelf — slide from opposite directions */
const bottomBooks = [
  { x: 5, width: 2, height: 6, fromX: 6, delay: 1 },
  { x: 8, width: 2.5, height: 6, fromX: -6, delay: 2 },
  { x: 11.5, width: 2, height: 6, fromX: 6, delay: 3 },
  { x: 14.5, width: 2.5, height: 6, fromX: -6, delay: 4 },
]

export default function ShelvesIcon({ className, isHovered }: AnimatedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top shelf line */}
      <motion.line
        x1="2"
        y1="11"
        x2="22"
        y2="11"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
      />

      {/* Bottom shelf line */}
      <motion.line
        x1="2"
        y1="21"
        x2="22"
        y2="21"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
      />

      {/* Vertical supports */}
      <motion.line
        x1="2"
        y1="3"
        x2="2"
        y2="21"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        opacity={0.5}
      />
      <motion.line
        x1="22"
        y1="3"
        x2="22"
        y2="21"
        stroke="currentColor"
        strokeWidth={iconStroke.width}
        strokeLinecap={iconStroke.linecap}
        vectorEffect={iconStroke.vectorEffect}
        opacity={0.5}
      />

      {/* Top shelf books */}
      {topBooks.map((book, i) => (
        <motion.rect
          key={`top-${i}`}
          x={book.x}
          y={11 - book.height}
          width={book.width}
          height={book.height}
          rx={0.4}
          stroke="currentColor"
          strokeWidth={iconStroke.width}
          strokeLinejoin={iconStroke.linejoin}
          vectorEffect={iconStroke.vectorEffect}
          fill="none"
          animate={
            isHovered
              ? { x: book.x, opacity: 1 }
              : { x: book.x, opacity: 0.6 }
          }
          initial={{ x: book.x }}
          transition={{
            ...iconSprings.interactive,
            delay: book.delay * iconStagger,
          }}
        />
      ))}

      {/* Top shelf book slide-in overlays (visible only on hover) */}
      {topBooks.map((book, i) => (
        <motion.rect
          key={`top-slide-${i}`}
          x={book.x}
          y={11 - book.height}
          width={book.width}
          height={book.height}
          rx={0.4}
          stroke="currentColor"
          strokeWidth={iconStroke.width}
          strokeLinejoin={iconStroke.linejoin}
          vectorEffect={iconStroke.vectorEffect}
          fill="none"
          animate={
            isHovered
              ? { translateX: [book.fromX, 0], opacity: [0, 1] }
              : { translateX: 0, opacity: 0 }
          }
          transition={{
            ...iconSprings.interactive,
            delay: book.delay * iconStagger,
          }}
        />
      ))}

      {/* Bottom shelf books */}
      {bottomBooks.map((book, i) => (
        <motion.rect
          key={`bot-${i}`}
          x={book.x}
          y={21 - book.height}
          width={book.width}
          height={book.height}
          rx={0.4}
          stroke="currentColor"
          strokeWidth={iconStroke.width}
          strokeLinejoin={iconStroke.linejoin}
          vectorEffect={iconStroke.vectorEffect}
          fill="none"
          animate={
            isHovered
              ? { translateX: [book.fromX, 0], opacity: [0, 1] }
              : { translateX: 0, opacity: 0.6 }
          }
          transition={{
            ...iconSprings.interactive,
            delay: book.delay * iconStagger,
          }}
        />
      ))}

      {/* Gold label on one spine (third book, top shelf) */}
      <motion.rect
        x={11}
        y={6.5}
        width={1.5}
        height={2.5}
        rx={0.3}
        fill={glowColors.gold}
        animate={
          isHovered
            ? { opacity: [0, 0, 0.9], scaleY: [0, 0, 1] }
            : { opacity: 0, scaleY: 0 }
        }
        transition={{
          duration: iconDurations.slow,
          delay: iconStagger * 5,
          ease: iconEase.scholarly as [number, number, number, number],
        }}
        style={{ originX: "11.75px", originY: "7.75px" }}
      />
    </svg>
  )
}

export const meta: AnimatedIconMeta = {
  name: "ShelvesIcon",
  label: "Shelves",
  description: "Two horizontal shelves — books slide in from alternate directions, gold label appears on one spine",
  animationDuration: 600,
  hasLoop: false,
  svgPaths: 14,
  category: "student",
}
