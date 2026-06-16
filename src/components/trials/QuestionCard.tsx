"use client"

/**
 * QuestionCard — the shared shell for the six typed question types.
 *
 * Owns all common chrome so the per-type bodies stay tiny:
 *   • prompt + type chip (label/icon from the registry)
 *   • optional progress bar (index / total)
 *   • the chunky Check → Continue pressable button
 *   • correct / incorrect feedback bar (green / red) + shake animation
 *     + optional sound + the post-answer "explain" reveal
 *   • awards Wisdom on correct through the EXISTING economy entry point
 *     (useEconomy().dispatch — same `quiz_correct` event the legacy quiz uses)
 *
 * It delegates only the interactive surface to `TRIAL_REGISTRY[type].component`
 * (a Phase-3 body). The body is "controlled": it reports a draft response via
 * `onRespond`; the card grades it with the registry's pure `validate`.
 */
import { useMemo, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { CheckCircle2, ChevronRight, Lightbulb, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEconomy } from "@/components/tome/economy-provider"
import { TRIAL_REGISTRY, type TrialBodyProps } from "@/lib/trials/registry"
import type {
  TrialQuestion,
  TrialResponse,
  TrialQuestionType,
} from "@/lib/trials/question-types"
import {
  trialEnter,
  wrongShakeKeyframes,
  wrongShakeTransition,
  reduced as reducedTokens,
} from "@/lib/animations/trial-tokens"
import { WisdomStar } from "@/components/trials/sigils/WisdomStar"
import { playCorrect, playWrong } from "@/lib/trials/sound"

export interface QuestionCardProps {
  /** A validated typed question (parsed via parseTrialQuestion). */
  question: TrialQuestion
  /** 1-based position in a set, for the optional progress bar. */
  index?: number
  /** Total questions in the set; with `index`, renders the progress bar. */
  total?: number
  /** Advance to the next question / finish the set. */
  onNext: () => void
  /** Parent bookkeeping hook (score, streak) fired once on grade. */
  onGraded?: (isCorrect: boolean) => void
  /** Play feedback tones on grade. Opt-in; defaults off. */
  sound?: boolean
}

export function QuestionCard({
  question,
  index,
  total,
  onNext,
  onGraded,
  sound = false,
}: QuestionCardProps) {
  const reduced = useReducedMotion() ?? false
  const { dispatch } = useEconomy()

  const entry = TRIAL_REGISTRY[question.type]
  const Body = entry.component

  // Draft response (pre-grade) then frozen at grade time.
  const [response, setResponse] = useState<
    TrialResponse[TrialQuestionType] | null
  >(null)
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [shake, setShake] = useState(false)

  const showProgress = typeof index === "number" && typeof total === "number"
  const progressPct = showProgress
    ? Math.min(100, ((index! - 1) / Math.max(1, total!)) * 100)
    : 0

  const TypeIcon = entry.icon

  const handleCheck = () => {
    if (answered || response === null) return
    const correct = entry.validate(question.content, response)
    setIsCorrect(correct)
    setAnswered(true)

    if (correct) {
      // Award Wisdom through the existing economy entry point.
      dispatch({ type: "quiz_correct", xp: question.points })
      if (sound) playCorrect()
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      if (sound) playWrong()
    }
    onGraded?.(correct)
  }

  const tint = isCorrect
    ? {
        soft: "var(--codex-success-soft)",
        line: "var(--codex-success)",
        text: "var(--codex-success-text)",
      }
    : {
        soft: "var(--codex-danger-soft)",
        line: "var(--codex-danger)",
        text: "var(--codex-danger-text)",
      }

  const bodyProps: TrialBodyProps = useMemo(
    () => ({
      content: question.content,
      onRespond: (r) => setResponse(r),
      answered,
      response,
      isCorrect,
      reduced,
    }),
    [question.content, answered, response, isCorrect, reduced]
  )

  return (
    <div className="flex flex-col h-full">
      {/* Optional progress bar */}
      {showProgress && (
        <div className="shrink-0 px-4 pt-3 pb-1 max-w-[640px] mx-auto w-full">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={index! - 1}
            className="h-3.5 rounded-full bg-muted overflow-hidden"
          >
            <motion.div
              initial={reduced ? { width: `${progressPct}%` } : { width: "0%" }}
              animate={{ width: `${progressPct}%` }}
              transition={
                reduced
                  ? { duration: 0.15 }
                  : { type: "spring", stiffness: 160, damping: 24 }
              }
              className="h-full rounded-full"
              style={{ background: "var(--codex-primary)" }}
            />
          </div>
        </div>
      )}

      {/* Question body */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-6 max-w-[640px] mx-auto">
          <motion.div
            key={question.id}
            variants={reduced ? reducedTokens.trialEnter : trialEnter}
            initial="hidden"
            animate="visible"
            className="space-y-6 relative"
          >
            {shake && !reduced && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={wrongShakeKeyframes}
                transition={wrongShakeTransition}
              />
            )}

            {/* Type chip + position */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold font-sans text-muted-foreground">
                <TypeIcon className="w-3.5 h-3.5" />
                {entry.label}
              </div>
              {showProgress && (
                <span className="text-[11px] font-sans text-muted-foreground">
                  Question {index} of {total}
                </span>
              )}
            </div>

            {/* Prompt */}
            <p className="text-ink text-[1.6rem] leading-snug font-serif font-semibold tracking-tight">
              {question.prompt}
            </p>

            {/* Delegated interactive body (Phase 3) */}
            {Body ? (
              <Body {...bodyProps} />
            ) : (
              <div
                className="rounded-[var(--codex-radius-card)] border-2 border-dashed p-6 text-center text-sm text-muted-foreground font-sans"
                style={{ borderColor: "var(--codex-border)" }}
              >
                {entry.label} body lands in Phase 3.
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Feedback bar — slides up on grade, tinted by outcome, with the
          post-answer explanation reveal and the Continue CTA. */}
      <AnimatePresence>
        {answered && (
          <motion.div
            key="feedback-bar"
            initial={reduced ? { opacity: 0 } : { y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: 120, opacity: 0 }}
            transition={
              reduced
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 340, damping: 34 }
            }
            className="shrink-0 border-t-2"
            style={{ background: tint.soft, borderColor: tint.line }}
            role="status"
            aria-live="polite"
          >
            <div className="max-w-[640px] mx-auto px-4 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0 space-y-1">
                <div
                  className="flex items-center gap-2 font-sans text-base font-bold"
                  style={{ color: tint.text }}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  {isCorrect ? "Correct" : "Not quite"}
                  {isCorrect && (
                    <span className="inline-flex items-center gap-1 ml-1">
                      <WisdomStar size={15} />
                      <span className="text-sm tabular-nums">
                        +{question.points}
                      </span>
                    </span>
                  )}
                </div>

                {question.explanation && (
                  <p className="flex items-start gap-1.5 text-sm text-ink font-serif leading-relaxed line-clamp-3">
                    <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                    {question.explanation}
                  </p>
                )}
              </div>

              <Button
                onClick={onNext}
                className={`${
                  isCorrect ? "codex-pressable-success" : "codex-pressable-danger"
                } min-h-[48px] px-8 font-bold shrink-0 gap-2`}
                style={{
                  background: isCorrect
                    ? "var(--codex-success)"
                    : "var(--codex-danger)",
                  color: isCorrect
                    ? "var(--codex-success-on)"
                    : "var(--codex-danger-on)",
                  borderRadius: "var(--codex-radius-btn)",
                }}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Check button — shown until graded; disabled until a response exists. */}
      {!answered && (
        <div className="shrink-0 border-t border-border bg-card">
          <div className="max-w-[640px] mx-auto px-4 py-4">
            <Button
              onClick={handleCheck}
              disabled={response === null}
              className="codex-pressable w-full min-h-[48px] font-bold gap-2 disabled:opacity-50"
              style={{
                background: "var(--codex-primary)",
                color: "var(--codex-on-primary)",
                borderRadius: "var(--codex-radius-btn)",
              }}
            >
              Check
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
