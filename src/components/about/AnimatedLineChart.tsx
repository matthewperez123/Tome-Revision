// Currently unused. Retained for potential future use (investor deck,
// /research page, etc.). Not imported by `/` after the summary-page rewrite.
"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

type Point = { x: number; y: number; label: string }

type Props = {
  data: Point[]
  yMax?: number
  yStep?: number
  className?: string
}

const W = 600
const H = 320
const PAD_L = 44
const PAD_R = 16
const PAD_T = 16
const PAD_B = 36

export function AnimatedLineChart({
  data,
  yMax = 60,
  yStep = 10,
  className,
}: Props) {
  const ref = useRef<SVGSVGElement | null>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })
  const prefersReduced = useReducedMotion()

  const xs = data.map((d) => d.x)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)

  const xScale = (x: number) =>
    PAD_L + ((x - minX) / (maxX - minX || 1)) * (W - PAD_L - PAD_R)
  const yScale = (y: number) => PAD_T + (1 - y / yMax) * (H - PAD_T - PAD_B)

  const path = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.x)} ${yScale(d.y)}`)
    .join(" ")

  const gridLines: number[] = []
  for (let v = 0; v <= yMax; v += yStep) gridLines.push(v)

  const animate = inView && !prefersReduced

  return (
    <svg
      ref={ref}
      role="img"
      aria-label="NEA literature reading rate over time"
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="auto"
      className={`text-muted-foreground ${className ?? ""}`}
      style={{ maxWidth: 600, display: "block", margin: "0 auto" }}
    >
      {/* Gridlines */}
      {gridLines.map((v) => (
        <g key={v}>
          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={yScale(v)}
            y2={yScale(v)}
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={1}
          />
          <text
            x={PAD_L - 8}
            y={yScale(v)}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={11}
            fill="currentColor"
            fillOpacity={0.5}
            fontFamily="var(--font-sans), DM Sans, sans-serif"
          >
            {v}%
          </text>
        </g>
      ))}

      {/* X-axis labels */}
      {data.map((d) => (
        <text
          key={`x-${d.x}`}
          x={xScale(d.x)}
          y={H - 12}
          textAnchor="middle"
          fontSize={12}
          fill="currentColor"
          fillOpacity={0.65}
          fontFamily="var(--font-sans), DM Sans, sans-serif"
        >
          {d.label}
        </text>
      ))}

      {/* Animated line */}
      <motion.path
        d={path}
        fill="none"
        stroke="#6366F1"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0 } : false}
        animate={animate ? { pathLength: 1 } : { pathLength: 1 }}
        transition={{ duration: 2, ease: [0.42, 0, 0.58, 1] }}
      />

      {/* Dots */}
      {data.map((d, i) => (
        <motion.circle
          key={`dot-${d.x}`}
          cx={xScale(d.x)}
          cy={yScale(d.y)}
          r={4.5}
          fill="#6366F1"
          initial={animate ? { opacity: 0, scale: 0.4 } : false}
          animate={animate ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
          transition={{
            delay: 2 + i * 0.2,
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </svg>
  )
}
