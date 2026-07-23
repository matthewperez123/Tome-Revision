"use client"

import { motion, useReducedMotion } from "motion/react"

/**
 * Virgil's visual identity: an abstract, softly moving blue orb. Layered
 * conic + radial gradients rotate and drift against each other so the color
 * shifts continuously without ever resolving into a face or figure. Sized
 * entirely by the caller's `className` (it fills a `rounded-full` circle), and
 * honors prefers-reduced-motion by holding still.
 */
export function VirgilOrb({
  className = "",
  label = "Virgil",
}: {
  className?: string
  label?: string
}) {
  const reduce = useReducedMotion()

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{
        background:
          "radial-gradient(circle at 50% 42%, #dbeafe 0%, #3b82f6 38%, #1e3a8a 100%)",
      }}
    >
      {/* Rotating conic sweep — the drifting band of blues. */}
      <motion.div
        aria-hidden
        className="absolute -inset-1/4"
        style={{
          background:
            "conic-gradient(from 0deg, #22d3ee, #3b82f6, #6366f1, #1e3a8a, #38bdf8, #22d3ee)",
          filter: "blur(8px)",
          opacity: 0.85,
        }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={
          reduce
            ? undefined
            : { duration: 14, ease: "linear", repeat: Infinity }
        }
      />

      {/* Counter-drifting specular highlight. */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.75) 0%, transparent 45%)",
        }}
        animate={
          reduce ? undefined : { x: ["-8%", "8%", "-8%"], y: ["-6%", "6%", "-6%"] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 9, ease: "easeInOut", repeat: Infinity }
        }
      />

      {/* Seat the sphere with an inner shadow + rim light. */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "inset 0 -8px 20px rgba(15,23,42,0.5), inset 0 4px 12px rgba(255,255,255,0.25)",
        }}
      />
    </div>
  )
}
