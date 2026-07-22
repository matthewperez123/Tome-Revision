"use client"

/**
 * FeedbackPanel — kind, immediate feedback.
 *
 * One panel per attempt: the encouraging message, the item's rationale, and
 * the evidence anchor (the paragraph the answer lives in) lit with the
 * wisdom wash. Correct answers animate with correctAnswerResponse; near-miss
 * with nearMissResponse (a warm lean-in — never a punishment shake);
 * incorrect answers fade in gently. Retry and Continue are offered here so
 * the flow never dead-ends (anti-punishment rule).
 */
import { motion } from "framer-motion"
import { BookOpen, CheckCircle2, RotateCcw } from "lucide-react"
import { pickTactile, useReducedMotionSafe } from "@/lib/design/motion"
import type { QuestionFeedback } from "@/lib/trials/engine"
import type { TrialItem } from "@/lib/trials/types"
import { TrialActionButton, la } from "./shared"

const KIND_META = {
  elegant: { label: "Elegant", color: la.wisdom, soft: la.wisdomSoft },
  correct: { label: "Correct", color: la.success, soft: la.successSoft },
  "near-miss": { label: "Near miss", color: la.nearMiss, soft: la.nearMissSoft },
  incorrect: { label: "Not quite", color: la.error, soft: la.errorSoft },
} as const

export function FeedbackPanel({
  feedback,
  item,
  answered,
  onRetry,
  onContinue,
  isLast,
  reduced,
}: {
  feedback: QuestionFeedback
  item: TrialItem
  answered: boolean
  onRetry: () => void
  onContinue: () => void
  isLast: boolean
  reduced?: boolean
}) {
  const systemReduced = useReducedMotionSafe()
  const isReduced = reduced ?? systemReduced
  const meta = KIND_META[feedback.kind]
  const correct = feedback.kind === "correct" || feedback.kind === "elegant"
  const tactile = feedback.kind === "near-miss" ? "nearMissResponse" : feedback.kind === "incorrect" ? "submitAnswer" : "correctAnswerResponse"

  return (
    <motion.section
      role="status"
      aria-live="polite"
      aria-label={`Feedback: ${meta.label}`}
      variants={pickTactile(tactile, isReduced)}
      initial="hidden"
      animate="visible"
      className="space-y-3 border-2 p-4"
      style={{ borderRadius: la.radiusL, borderColor: meta.color, background: meta.soft }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-sans text-sm font-semibold" style={{ color: meta.color }}>
          <CheckCircle2 size={16} aria-hidden />
          {meta.label}
          {feedback.attempts > 1 && (
            <span className="font-normal" style={{ color: la.inkMuted }}>
              · attempt {feedback.attempts}
            </span>
          )}
        </p>
        {feedback.wisdomAwarded > 0 && (
          <span className="font-sans text-sm font-bold" style={{ color: la.wisdomDeep }}>
            +{feedback.wisdomAwarded} Wisdom
          </span>
        )}
      </div>

      <p className="font-serif text-lg" style={{ color: la.ink }}>
        {feedback.message}
      </p>

      <p className="font-serif text-base leading-relaxed" style={{ color: la.inkMuted }}>
        {feedback.rationale}
      </p>

      {item.evidenceAnchor && (
        <div
          className="flex items-start gap-2 border-l-4 py-2 pl-3"
          style={{ borderColor: la.wisdom, background: la.wisdomSoft, borderRadius: `0 ${la.radiusS} ${la.radiusS} 0` }}
        >
          <BookOpen size={15} aria-hidden className="mt-1 shrink-0" style={{ color: la.wisdomDeep }} />
          <div>
            <p className="font-sans text-xs uppercase tracking-wider" style={{ color: la.wisdomDeep }}>
              The evidence lives at {item.evidenceAnchor.paragraphId}
            </p>
            {item.evidenceAnchor.quote && (
              <p className="mt-0.5 font-serif text-base italic" style={{ color: la.ink }}>
                “{item.evidenceAnchor.quote}”
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-1">
        {!correct && (
          <TrialActionButton variant="ghost" onClick={onRetry}>
            <span className="inline-flex items-center gap-2">
              <RotateCcw size={14} aria-hidden /> Try again — no penalty
            </span>
          </TrialActionButton>
        )}
        {answered && (correct || feedback.kind === "near-miss" || feedback.kind === "incorrect") && (
          <TrialActionButton onClick={onContinue} autoFocus={correct}>
            {isLast ? "See the results" : "Continue"}
          </TrialActionButton>
        )}
      </div>
    </motion.section>
  )
}
