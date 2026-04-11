"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useInView } from "motion/react"

interface AnimationPhase {
  name: string
  duration: number // ms
}

interface UseAnimationLoopReturn {
  phase: string
  phaseIndex: number
  containerRef: React.RefObject<HTMLDivElement | null>
  isReduced: boolean
}

export function useAnimationLoop(phases: AnimationPhase[]): UseAnimationLoopReturn {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { margin: "0px", once: false })
  const isPaused = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [isReduced, setIsReduced] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    }
  }, [])

  // Hover pause
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onEnter = () => { isPaused.current = true }
    const onLeave = () => { isPaused.current = false }
    el.addEventListener("mouseenter", onEnter)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  const advance = useCallback(() => {
    setPhaseIndex((prev) => (prev + 1) % phases.length)
  }, [phases.length])

  useEffect(() => {
    if (isReduced || !isInView) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    const tick = () => {
      const currentPhase = phases[phaseIndex]
      if (!currentPhase) return

      timerRef.current = setTimeout(() => {
        if (!isPaused.current) {
          advance()
        } else {
          // If paused, retry after a short interval
          tick()
        }
      }, isPaused.current ? 200 : currentPhase.duration)
    }

    tick()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [phaseIndex, isInView, isReduced, phases, advance])

  return {
    phase: phases[phaseIndex]?.name ?? phases[0]?.name ?? "",
    phaseIndex,
    containerRef,
    isReduced,
  }
}
