"use client"

/**
 * FindTheEvidenceTrial — clickable passage spans.
 *
 * The claim sits above the passage; the learner selects the span of segments
 * (lines / sentences) that proves it. Interaction: click a segment to set the
 * anchor, click another to extend the range; click inside the range to
 * collapse to a single segment. Every segment is a real button, so keyboard
 * users walk the passage with Tab and select with Enter/Space — identical
 * semantics, no drag required. Post-answer, the evidence range is lit with
 * the wisdom token wash.
 */
import { useState } from "react"
import { motion } from "framer-motion"
import { pickTactile, useReducedMotionSafe } from "@/lib/design/motion"
import type { FamilyRendererProps } from "../shared"
import { Kbd, TrialActionButton, la } from "../shared"

export function FindTheEvidenceTrial({
  item,
  answered,
  lastResponse,
  onSubmit,
  reduced,
}: FamilyRendererProps<"find-the-evidence">) {
  const { content } = item
  const [range, setRange] = useState<[number, number] | null>(() => lastResponse?.range ?? null)
  const systemReduced = useReducedMotionSafe()
  const isReduced = reduced || systemReduced

  const [cs, ce] = content.correctRange

  const select = (i: number) => {
    if (answered) return
    if (!range) return setRange([i, i])
    const [a, b] = range
    if (i >= a && i <= b) return setRange([i, i]) // collapse
    setRange([Math.min(a, i), Math.max(b, i)])
  }

  const inRange = (i: number) => range !== null && i >= range[0] && i <= range[1]
  const inEvidence = (i: number) => i >= cs && i <= ce

  const segmentStyle = (i: number) => {
    if (answered) {
      const chosen = lastResponse && i >= lastResponse.range[0] && i <= lastResponse.range[1]
      if (inEvidence(i)) {
        return { background: la.successSoft, borderColor: la.success, color: la.ink }
      }
      if (chosen) return { background: la.errorSoft, borderColor: la.error, color: la.ink }
      return { background: "transparent", borderColor: "transparent", color: la.inkFaint }
    }
    if (inRange(i)) return { background: la.wisdomSoft, borderColor: la.wisdom, color: la.ink }
    return { background: "transparent", borderColor: "transparent", color: la.ink }
  }

  return (
    <div className="space-y-5">
      <div
        className="border-l-4 py-2 pl-4"
        style={{ borderColor: la.primary, background: la.primarySoft, borderRadius: `0 ${la.radiusM} ${la.radiusM} 0` }}
      >
        <p className="font-sans text-xs uppercase tracking-wider" style={{ color: la.primaryEdge }}>
          The claim
        </p>
        <p className="font-serif text-lg" style={{ color: la.ink }}>
          {content.claim}
        </p>
      </div>

      <p className="font-sans text-sm" style={{ color: la.inkMuted }}>
        Click (or tab to) the line where the proof begins, then the line where it ends.{" "}
        <Kbd>Enter</Kbd> checks your selection.
      </p>

      <div className="space-y-1" role="group" aria-label="Passage — select the evidence range">
        {content.segments.map((segment, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => select(i)}
            disabled={answered}
            aria-pressed={inRange(i)}
            aria-label={`Line ${i + 1}: ${segment}`}
            variants={pickTactile("highlightPhrase", isReduced)}
            initial="hidden"
            animate="visible"
            transition={{ delay: isReduced ? 0 : i * 0.03 }}
            className="block w-full border-l-4 px-4 py-2 text-left font-serif text-lg leading-relaxed transition-colors focus-visible:outline-2 disabled:cursor-default"
            style={{ ...segmentStyle(i), borderRadius: `0 ${la.radiusS} ${la.radiusS} 0`, outlineColor: la.focus }}
          >
            {segment}
          </motion.button>
        ))}
      </div>

      {!answered && (
        <TrialActionButton onClick={() => range && onSubmit({ range })} disabled={!range}>
          This is the evidence
        </TrialActionButton>
      )}
    </div>
  )
}
