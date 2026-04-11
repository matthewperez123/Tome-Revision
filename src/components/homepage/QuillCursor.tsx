"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion } from "motion/react"
import { Feather } from "lucide-react"

export interface CursorWaypoint {
  x: number
  y: number
  action?: "move" | "click" | "hover" | "wait"
  duration: number
  onReach?: () => void
}

interface QuillCursorProps {
  path: CursorWaypoint[]
  loop?: boolean
  visible?: boolean
}

export function QuillCursor({ path, loop = true, visible = true }: QuillCursorProps) {
  const [waypointIndex, setWaypointIndex] = useState(0)
  const [ripple, setRipple] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [reduced, setReduced] = useState(false)
  const isLoopingBack = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  const wp = useMemo(() => path[waypointIndex] ?? path[0], [path, waypointIndex])

  const advance = useCallback(() => {
    setWaypointIndex((prev) => {
      const next = prev + 1
      if (next >= path.length) {
        if (loop) {
          isLoopingBack.current = true
          return 0
        }
        return prev
      }
      isLoopingBack.current = false
      return next
    })
  }, [path.length, loop])

  const handleAnimationComplete = useCallback(() => {
    if (!visible || reduced) return
    const currentWp = path[waypointIndex]
    if (!currentWp) return

    if (isLoopingBack.current) {
      isLoopingBack.current = false
      timeoutRef.current = setTimeout(() => {
        currentWp.onReach?.()
        advance()
      }, 400)
      return
    }

    const action = currentWp.action ?? "move"

    if (action === "click") {
      setRipple(true)
      setTimeout(() => setRipple(false), 400)
      currentWp.onReach?.()
      timeoutRef.current = setTimeout(advance, 500)
    } else if (action === "hover") {
      setHovering(true)
      setTimeout(() => {
        setHovering(false)
        currentWp.onReach?.()
        advance()
      }, 600)
    } else if (action === "wait") {
      currentWp.onReach?.()
      timeoutRef.current = setTimeout(advance, currentWp.duration * 1000)
    } else {
      currentWp.onReach?.()
      advance()
    }
  }, [waypointIndex, path, advance, visible, reduced])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (!wp || reduced || !visible) return null

  return (
    <motion.div
      className="absolute z-50 pointer-events-none"
      animate={{
        left: `${wp.x}%`,
        top: `${wp.y}%`,
        scale: hovering ? [1, 1.15, 1] : 1,
      }}
      transition={
        isLoopingBack.current
          ? { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
          : { type: "spring", stiffness: 120, damping: 20 }
      }
      onAnimationComplete={handleAnimationComplete}
    >
      <Feather
        className="size-7 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
        style={{ transform: "rotate(-45deg)" }}
      />

      {ripple && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60"
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{ width: 40, height: 40, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}

      <div className="absolute bottom-0 left-0 size-1.5 rounded-full bg-white" />
    </motion.div>
  )
}
