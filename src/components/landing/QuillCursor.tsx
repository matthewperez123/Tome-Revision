"use client"

import { motion } from "motion/react"
import { Feather } from "lucide-react"

const EASE = [0.22, 1, 0.36, 1] as const

interface QuillCursorProps {
  /** Current position [x, y] in px relative to the mockup container */
  x: number
  y: number
  /** Whether the quill should be visible at all */
  visible: boolean
  /** Whether to show a click ripple at the current position */
  clicking?: boolean
}

export function QuillCursor({ x, y, visible, clicking }: QuillCursorProps) {
  if (!visible) return null

  return (
    <motion.div
      className="absolute pointer-events-none z-30"
      animate={{ x, y, rotate: [-25, -18, -25] }}
      transition={{ duration: 0.8, ease: EASE }}
      style={{ willChange: "transform" }}
    >
      <div className="relative">
        <Feather
          className="size-7 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] dark:drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]"
          strokeWidth={2.5}
          style={{ transform: "scaleX(-1)" }}
        />
        {/* Click ripple at the quill tip */}
        {clicking && (
          <motion.div
            key={`click-${x}-${y}`}
            className="absolute -bottom-0.5 -left-0.5 size-3 rounded-full bg-white/70"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ willChange: "transform, opacity" }}
          />
        )}
      </div>
    </motion.div>
  )
}
