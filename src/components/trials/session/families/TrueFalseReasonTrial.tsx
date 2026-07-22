"use client"

/**
 * TrueFalseReasonTrial — verdict first, justification second.
 *
 * Two-step commit: the learner judges the statement True or False, then
 * picks the reason that justifies the verdict. Both halves must be chosen
 * before Check enables. Right verdict + wrong reason is the classic
 * near-miss (the engine grades it); both wrong is incorrect-encouraging.
 */
import { useState } from "react"
import { motion } from "framer-motion"
import { optionOrder } from "@/lib/trials/engine"
import type { FamilyRendererProps } from "../shared"
import { OPTION_LETTERS, OptionRow, TrialActionButton, la, type OptionVisualState } from "../shared"

export function TrueFalseReasonTrial({
  item,
  seed,
  answered,
  feedback,
  lastResponse,
  onSubmit,
}: FamilyRendererProps<"true-false-with-reason">) {
  const { content } = item
  const [bool, setBool] = useState<boolean | null>(() => lastResponse?.bool ?? null)
  const [reasonId, setReasonId] = useState<string | null>(() => lastResponse?.reasonId ?? null)

  const reasons = optionOrder(content.reasons.map((r) => r.id), seed, item.id).map(
    (id) => content.reasons.find((r) => r.id === id)!
  )

  const verdictStyle = (value: boolean) => {
    const chosen = bool === value
    if (answered) {
      if (value === content.correctBool) {
        return { borderColor: la.success, background: la.successSoft, color: la.ink }
      }
      if (chosen) return { borderColor: la.error, background: la.errorSoft, color: la.ink }
      return { borderColor: la.surfaceSunken, background: la.surface, color: la.inkFaint }
    }
    return chosen
      ? { borderColor: la.primary, background: la.primarySoft, color: la.ink }
      : { borderColor: la.surfaceSunken, background: la.surfaceRaised, color: la.ink }
  }

  const reasonState = (id: string, correct: boolean): OptionVisualState => {
    if (!answered) return "idle"
    if (correct) return "correct"
    if (reasonId === id) return feedback?.kind === "near-miss" ? "near-miss" : "wrong"
    return "dimmed"
  }

  return (
    <div className="space-y-6">
      <blockquote
        className="border-l-4 py-3 pl-4 font-serif text-xl leading-relaxed"
        style={{ borderColor: la.wisdom, color: la.ink, background: la.surface, borderRadius: `0 ${la.radiusM} ${la.radiusM} 0` }}
      >
        {content.statement}
      </blockquote>

      <fieldset>
        <legend className="mb-2 font-sans text-sm" style={{ color: la.inkMuted }}>
          1 · Your verdict
        </legend>
        <div className="flex gap-3" role="group" aria-label="True or false">
          {[true, false].map((value) => (
            <motion.button
              key={String(value)}
              type="button"
              disabled={answered}
              onClick={() => setBool(value)}
              aria-pressed={bool === value}
              whileTap={answered ? undefined : { scale: 0.97 }}
              className="min-h-[48px] flex-1 border-2 px-6 py-3 font-sans text-sm font-semibold transition-colors focus-visible:outline-2 disabled:cursor-default"
              style={{ ...verdictStyle(value), borderRadius: la.radiusM, outlineColor: la.focus }}
            >
              {value ? "True" : "False"}
            </motion.button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-sans text-sm" style={{ color: la.inkMuted }}>
          2 · Because…
        </legend>
        <div className="space-y-2">
          {reasons.map((r, i) => (
            <OptionRow
              key={r.id}
              letter={OPTION_LETTERS[i] ?? String(i + 1)}
              text={r.text}
              state={reasonState(r.id, r.correct)}
              disabled={answered}
              onSelect={() => !answered && setReasonId(r.id)}
              selectLabel={`Reason ${OPTION_LETTERS[i] ?? i + 1}: ${r.text}`}
            />
          ))}
        </div>
      </fieldset>

      {!answered && (
        <TrialActionButton
          onClick={() => bool !== null && reasonId && onSubmit({ bool, reasonId })}
          disabled={bool === null || !reasonId}
        >
          Check verdict and reason
        </TrialActionButton>
      )}
    </div>
  )
}
