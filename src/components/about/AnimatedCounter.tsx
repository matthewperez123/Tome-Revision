// Currently unused. Retained for potential future use (investor deck,
// /research page, etc.). Not imported by `/` after the summary-page rewrite.
"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "motion/react"

type Props = {
  from: number
  to: number
  decimals?: number
  durationMs?: number
  className?: string
  suffix?: React.ReactNode
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

export function AnimatedCounter({
  from,
  to,
  decimals = 1,
  durationMs = 1600,
  className,
  suffix,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true })
  const prefersReduced = useReducedMotion()
  const [display, setDisplay] = useState(from.toFixed(decimals))

  useEffect(() => {
    if (!inView) return

    if (prefersReduced) {
      queueMicrotask(() => setDisplay(to.toFixed(decimals)))
      return
    }

    let raf = 0
    let start = 0
    const tick = (t: number) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / durationMs)
      const v = from + (to - from) * easeOutExpo(p)
      setDisplay(v.toFixed(decimals))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, prefersReduced, from, to, durationMs, decimals])

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  )
}
