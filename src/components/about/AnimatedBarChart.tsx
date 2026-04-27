// Currently unused. Retained for potential future use (investor deck,
// /research page, etc.). Not imported by `/` after the summary-page rewrite.
"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

type Bar = { label: string; value: number }

type Props = {
  data: Bar[]
  yMax?: number
  className?: string
}

const W = 600
const H = 320
const PAD_L = 24
const PAD_R = 24
const PAD_T = 36
const PAD_B = 40

export function AnimatedBarChart({ data, yMax = 40, className }: Props) {
  const ref = useRef<SVGSVGElement | null>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })
  const prefersReduced = useReducedMotion()

  const animate = inView && !prefersReduced

  const innerW = W - PAD_L - PAD_R
  const innerH = H - PAD_T - PAD_B
  const slot = innerW / data.length
  const barW = slot * 0.55

  const baseline = PAD_T + innerH

  return (
    <svg
      ref={ref}
      role="img"
      aria-label="NAEP grade-8 reading: share scoring below Basic"
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="auto"
      className={`text-muted-foreground ${className ?? ""}`}
      style={{ maxWidth: 600, display: "block", margin: "0 auto" }}
    >
      {/* Baseline */}
      <line
        x1={PAD_L}
        x2={W - PAD_R}
        y1={baseline}
        y2={baseline}
        stroke="currentColor"
        strokeOpacity={0.25}
        strokeWidth={1}
      />

      {data.map((bar, i) => {
        const cx = PAD_L + slot * (i + 0.5)
        const x = cx - barW / 2
        const h = (bar.value / yMax) * innerH
        const y = baseline - h
        return (
          <g key={bar.label}>
            {/* Value label above */}
            <motion.text
              x={cx}
              y={y - 8}
              textAnchor="middle"
              fontSize={14}
              fontWeight={600}
              fill="#6366F1"
              fontFamily="var(--font-sans), DM Sans, sans-serif"
              initial={animate ? { opacity: 0 } : false}
              animate={animate ? { opacity: 1 } : { opacity: 1 }}
              transition={{
                delay: 0.6 + i * 0.15,
                duration: 0.4,
              }}
            >
              {bar.value}%
            </motion.text>

            {/* The bar — scaleY from baseline */}
            <motion.rect
              x={x}
              y={y}
              width={barW}
              height={h}
              fill="#6366F1"
              fillOpacity={0.85}
              stroke="#6366F1"
              strokeWidth={1}
              initial={animate ? { scaleY: 0 } : false}
              animate={animate ? { scaleY: 1 } : { scaleY: 1 }}
              style={{ transformOrigin: `${cx}px ${baseline}px` }}
              transition={{
                delay: i * 0.15,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
            />

            {/* X label below */}
            <text
              x={cx}
              y={baseline + 22}
              textAnchor="middle"
              fontSize={12}
              fill="currentColor"
              fillOpacity={0.65}
              fontFamily="var(--font-sans), DM Sans, sans-serif"
            >
              {bar.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
