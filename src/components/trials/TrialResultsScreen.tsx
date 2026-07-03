"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"
import { Button } from "@/components/ui/button"
import {
  formatElapsed,
  getQuizSummary,
  type QuizState,
} from "@/lib/quiz-engine"
import { DifficultyBars } from "@/components/trials/DifficultyBars"
import { getTierDef } from "@/components/tome/trial-difficulty-cards"
import type { QuizDifficulty } from "@/lib/book-progress"
import {
  resultsContainer,
  resultsChild,
  reduced as reducedTokens,
  perfectSparkle,
} from "@/lib/animations/trial-tokens"
import { HeartsDisplay } from "./HeartsDisplay"

export function TrialResultsScreen({
  quizState,
  tier,
  maxHearts,
  onPass,
  onRetry,
  onReturn,
  isLastChapter = false,
}: {
  quizState: QuizState
  tier: QuizDifficulty
  maxHearts: number
  onPass: (xp: number, coins: number, correct: number, total: number) => void
  onRetry: () => void
  onReturn: () => void
  /** When true, the pass-CTA reads "Finish book" instead of "Next chapter". */
  isLastChapter?: boolean
}) {
  const reduced = useReducedMotion()
  const summary = getQuizSummary(quizState)
  const tierDef = getTierDef(tier)
  const confettiRef = useRef<ConfettiRef>(null)
  const [wisdomDisplay, setWisdomDisplay] = useState(0)
  const [reviewOpen, setReviewOpen] = useState(false)

  // Fire confetti on pass; extra-sparkle on perfect
  useEffect(() => {
    if (!summary.passed) return
    const t = setTimeout(() => {
      // Resolve confetti colors from the active theme's tier tokens.
      const cs = getComputedStyle(document.documentElement)
      const tok = (name: string) => cs.getPropertyValue(name).trim()
      confettiRef.current?.fire({
        particleCount: summary.perfect ? perfectSparkle.particleCount * 8 : 80,
        spread: summary.perfect ? 100 : 70,
        startVelocity: summary.perfect ? 55 : 40,
        origin: { y: 0.4 },
        colors: [
          tok("--codex-tier-laureate"),
          tok("--codex-reward"),
          tok("--codex-success"),
          tok("--codex-primary"),
        ],
      })
    }, 300)
    return () => clearTimeout(t)
  }, [summary.passed, summary.perfect])

  // Wisdom ticker
  useEffect(() => {
    if (summary.xpEarned === 0) {
      setWisdomDisplay(0)
      return
    }
    if (reduced) {
      setWisdomDisplay(summary.xpEarned)
      return
    }
    let raf = 0
    const start = performance.now()
    const duration = Math.min(1400, Math.max(500, summary.xpEarned * 25))
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setWisdomDisplay(Math.round(summary.xpEarned * eased))
      if (t < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [summary.xpEarned, reduced])

  const pctColor = summary.passed
    ? "var(--codex-success-text)"
    : "var(--codex-danger-text)"

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-6 text-center relative overflow-y-auto py-8">
      {summary.passed && (
        <Confetti
          ref={confettiRef}
          manualstart
          className="pointer-events-none absolute inset-0 w-full h-full"
        />
      )}

      <motion.div
        variants={reduced ? reducedTokens.resultsContainer : resultsContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md space-y-6 relative"
      >
        {/* Title */}
        <motion.div variants={reduced ? reducedTokens.resultsChild : resultsChild} className="space-y-2">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-ink">
            {summary.perfect
              ? "Flawless."
              : summary.passed
                ? "Trial passed."
                : "Not quite."}
          </h2>
          <p className="text-muted-foreground text-sm">
            {summary.perfect
              ? "Every answer true. Your understanding is complete."
              : summary.passed
                ? "Your knowledge grows stronger."
                : "Every scholar learns from difficulty."}
          </p>
        </motion.div>

        {/* Score hero */}
        <motion.div
          variants={reduced ? reducedTokens.resultsChild : resultsChild}
          className="flex flex-col items-center gap-3"
        >
          <motion.div
            initial={reduced ? false : { scale: 0.6, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="relative"
          >
            <DifficultyBars level={tierDef.level} size={72} color={tierDef.accentColor} />
            {summary.perfect && (
              <motion.div
                animate={reduced ? undefined : { rotate: 360 }}
                transition={
                  reduced
                    ? undefined
                    : { repeat: Infinity, duration: 8, ease: "linear" }
                }
                className="absolute inset-0 -m-2 rounded-full"
                style={{
                  boxShadow:
                    "0 0 24px color-mix(in srgb, var(--codex-tier-laureate) 55%, transparent), inset 0 0 16px color-mix(in srgb, var(--codex-reward) 35%, transparent)",
                }}
                aria-hidden
              />
            )}
          </motion.div>

          <div className="space-y-1">
            <div className="font-serif font-bold text-5xl text-ink tabular-nums">
              {summary.correct}
              <span className="text-2xl text-muted-foreground font-normal">
                {" "}
                / {summary.total}
              </span>
            </div>
            <div className="text-sm font-semibold" style={{ color: pctColor }}>
              {summary.percentage}% correct
            </div>
          </div>
        </motion.div>

        {/* Wisdom ticker */}
        <motion.div
          variants={reduced ? reducedTokens.resultsChild : resultsChild}
          className="border-2 bg-card px-4 py-3 flex items-center justify-between"
          style={{
            borderRadius: "var(--codex-radius-btn)",
            borderColor: "color-mix(in srgb, var(--codex-tier-laureate) 30%, transparent)",
          }}
          aria-live="polite"
        >
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-sans">
            Wisdom earned
          </span>
          <span
            className="font-serif text-2xl font-bold tabular-nums"
            style={{ color: "var(--codex-tier-laureate-text)" }}
          >
            +{wisdomDisplay}
          </span>
        </motion.div>

        {/* Hearts + Time */}
        <motion.div
          variants={reduced ? reducedTokens.resultsChild : resultsChild}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-sans">
              Hearts
            </span>
            <HeartsDisplay current={quizState.hearts} max={maxHearts} />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans">
            <Clock className="w-3.5 h-3.5" aria-hidden />
            <span className="tabular-nums">{formatElapsed(summary.elapsedMs)}</span>
          </div>
        </motion.div>

        {/* Review answers */}
        <motion.div variants={reduced ? reducedTokens.resultsChild : resultsChild}>
          <button
            type="button"
            onClick={() => setReviewOpen((o) => !o)}
            aria-expanded={reviewOpen}
            className="w-full inline-flex items-center justify-between rounded-lg bg-stone-100 dark:bg-stone-900/50 px-4 py-2 text-sm font-semibold text-ink hover:bg-stone-200 dark:hover:bg-stone-800 transition"
          >
            Review answers
            <ChevronDown
              className={`w-4 h-4 transition-transform ${reviewOpen ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
          <AnimatePresence>
            {reviewOpen && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-2 space-y-2 text-left"
              >
                {quizState.questions.map((q, i) => {
                  const ok = quizState.results[i] === "correct"
                  return (
                    <li
                      key={q.id}
                      className="rounded-lg border border-stone-200 dark:border-stone-800 bg-card px-3 py-2 text-sm"
                    >
                      <div className="flex items-start gap-2">
                        {ok ? (
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--codex-success)" }} />
                        ) : (
                          <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--codex-danger)" }} />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-serif text-ink">{q.prompt}</p>
                          {!ok && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Correct:{" "}
                              <span className="text-ink font-semibold">
                                {q.correct_answer}
                              </span>
                            </p>
                          )}
                          {q.explanation && (
                            <p className="text-xs text-muted-foreground italic mt-1">
                              {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Actions */}
        <motion.div variants={reduced ? reducedTokens.resultsChild : resultsChild} className="space-y-2 pt-2">
          {summary.passed ? (
            <Button
              onClick={() => onPass(summary.xpEarned, summary.coinsEarned, summary.correct, summary.total)}
              className="codex-pressable-edge w-full min-h-[44px] py-3 text-base font-semibold gap-2"
              style={{
                background: tierDef.accentColor,
                color: tierDef.onAccent,
                borderRadius: "var(--codex-radius-btn)",
                // @ts-expect-error — CSS custom property for pressed edge
                "--codex-edge": tierDef.accentEdge,
              }}
            >
              {summary.perfect && <Sparkles className="w-4 h-4" />}
              {isLastChapter ? "Finish book" : "Next chapter"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <>
              <Button
                onClick={onRetry}
                className="w-full rounded-xl py-3 text-base font-semibold gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Trial
              </Button>
              <Button
                onClick={onReturn}
                variant="secondary"
                className="w-full rounded-xl py-3 text-base"
              >
                Review chapter
              </Button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
