"use client"

/**
 * PathMap — the curved journey trail connecting typed PathNodes.
 *
 * Nodes are supplied with x/y coordinates in viewBox units; the map
 * draws a smooth curved trail between them. Each trail segment draws
 * in (250ms) as the node ahead of it completes — the world visibly
 * answers the reader's effort.
 *
 * - Full keyboard parity: roving tabindex, ←/→ (or ↑/↓) move between
 *   nodes, Enter/Space activates the focused node.
 * - Reduced motion: segments appear pre-drawn, no stroke animation.
 */

import { motion, useReducedMotion } from "framer-motion"
import { useMemo, useRef, useState } from "react"
import { PathNode } from "./PathNode"

export interface PathNodeSpec {
  id: string
  kind: "chapter" | "trial" | "seal" | "stoa"
  state: "locked" | "available" | "current" | "done"
  label: string
  /** Position in viewBox units. */
  x: number
  y: number
}

export interface PathMapProps {
  nodes: readonly PathNodeSpec[]
  /** viewBox width in units (default 400). */
  width?: number
  /** viewBox height in units (default 600). */
  height?: number
  onNodeActivate?: (id: string) => void
  /** Accessible name for the map. */
  label?: string
}

/** Smooth quadratic segment bowing perpendicular to the chord. */
function segmentPath(a: PathNodeSpec, b: PathNodeSpec): string {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const length = Math.hypot(dx, dy) || 1
  // Bow the curve sideways ~18% of the chord length, alternating side.
  const bow = length * 0.18
  const cx = mx + (-dy / length) * bow
  const cy = my + (dx / length) * bow
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`
}

export function PathMap({ nodes, width = 400, height = 600, onNodeActivate, label = "Journey path" }: PathMapProps) {
  const reduced = useReducedMotion() === true
  const [focusIndex, setFocusIndex] = useState(0)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])

  const segments = useMemo(() => {
    const result: { d: string; drawn: boolean; key: string }[] = []
    for (let i = 0; i < nodes.length - 1; i += 1) {
      const a = nodes[i]!
      const b = nodes[i + 1]!
      result.push({
        d: segmentPath(a, b),
        drawn: a.state === "done" || a.state === "current",
        key: `${a.id}->${b.id}`,
      })
    }
    return result
  }, [nodes])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowDown" && event.key !== "ArrowLeft" && event.key !== "ArrowUp") return
    event.preventDefault()
    const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1
    const next = (focusIndex + delta + nodes.length) % nodes.length
    setFocusIndex(next)
    nodeRefs.current[next]?.querySelector<HTMLElement>("[tabindex]")?.focus()
  }

  return (
    <div
      role="list"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="relative w-full"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        {segments.map((segment) => (
          <g key={segment.key}>
            {/* trail bed */}
            <path
              d={segment.d}
              fill="none"
              stroke="var(--la-surface-sunken)"
              strokeWidth={6}
              strokeLinecap="round"
            />
            {/* progress fill, draws in as the path unlocks */}
            <motion.path
              d={segment.d}
              fill="none"
              stroke="var(--la-primary)"
              strokeWidth={6}
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: segment.drawn ? 1 : 0, opacity: segment.drawn ? 1 : 0.35 }}
              transition={reduced ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
            />
          </g>
        ))}
      </svg>
      {nodes.map((node, index) => (
        <div
          key={node.id}
          role="listitem"
          ref={(el) => {
            nodeRefs.current[index] = el
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${(node.x / width) * 100}%`,
            top: `${(node.y / height) * 100}%`,
          }}
        >
          <div
            tabIndex={index === focusIndex ? 0 : -1}
            className="outline-none"
            onFocus={() => setFocusIndex(index)}
          >
            <PathNode
              kind={node.kind}
              state={node.state}
              label={node.label}
              onActivate={onNodeActivate ? () => onNodeActivate(node.id) : undefined}
            />
          </div>
          <span
            className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap font-mono text-[11px]"
            style={{ color: "var(--la-ink-muted)" }}
            aria-hidden="true"
          >
            {node.label}
          </span>
        </div>
      ))}
    </div>
  )
}
