"use client"

/**
 * TrialPlayer — the reusable integration point for the Trial engine.
 *
 * Owns the engine session (pure state from src/lib/trials/engine), forwards
 * outcomes to Virgil as semantic events, routes each family to its renderer,
 * and handles the global keyboard map:
 *   H toggle hints · Esc close hints · Enter continue (outside text fields) ·
 *   1–9 select an option (inside choice renderers) · R retry after feedback.
 *
 * Deterministic demo mode: pass a fixed `seed` and the same items and every
 * shuffle, feedback line, and award replays identically.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react"
import { motion } from "framer-motion"
import { pickTactile, useReducedMotionSafe } from "@/lib/design/motion"
import {
  advance,
  createTrialSession,
  currentItem,
  currentQuestion,
  retryQuestion,
  submitAnswer,
  summarize,
  toggleElimination,
  useHint as engineUseHint,
  type TrialRules,
  type TrialSession,
} from "@/lib/trials/engine"
import type { CompletionSummary } from "@/lib/trials/engine"
import type { FamilyTaggedResponse, TrialItem } from "@/lib/trials/types"
import type { VirgilVariantId } from "@/lib/virgil/types"
import { TrialShell } from "./TrialShell"
import { HintDrawer } from "./HintDrawer"
import { FeedbackPanel } from "./FeedbackPanel"
import { TrialActionButton, la, FAMILY_LABELS } from "./shared"
import type { VirgilCompanionHandle } from "./VirgilCompanion"
import { ChoiceTrial } from "./families/ChoiceTrial"
import { FillTheLineTrial } from "./families/FillTheLineTrial"
import { FindTheEvidenceTrial } from "./families/FindTheEvidenceTrial"
import { MatchPairsTrial } from "./families/MatchPairsTrial"
import { OrderingTrial } from "./families/OrderingTrial"
import { TrueFalseReasonTrial } from "./families/TrueFalseReasonTrial"
import { WritingTrial } from "./families/WritingTrial"
import { RecitationTrial } from "./families/RecitationTrial"

export interface TrialPlayerProps {
  items: TrialItem[]
  /** Deterministic seed — same seed replays the session identically. */
  seed?: string | number
  title?: string
  instruction?: string
  rules?: Partial<TrialRules>
  virgilVariant?: VirgilVariantId
  showVirgil?: boolean
  reducedMotion?: boolean
  /** Called once when the session completes. */
  onComplete?: (summary: CompletionSummary, session: TrialSession) => void
  /** Called after every engine transition (persistence belongs to the caller). */
  onSessionChange?: (session: TrialSession) => void
}

export function TrialPlayer({
  items,
  seed = "tome-trial",
  title,
  instruction,
  rules,
  virgilVariant,
  showVirgil = true,
  reducedMotion,
  onComplete,
  onSessionChange,
}: TrialPlayerProps) {
  const systemReduced = useReducedMotionSafe()
  const reduced = reducedMotion ?? systemReduced
  const virgilRef = useRef<VirgilCompanionHandle | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const [session, setSession] = useState<TrialSession>(() =>
    createTrialSession({ items, seed, rules })
  )
  const [lastResponse, setLastResponse] = useState<FamilyTaggedResponse | null>(null)
  const [hintOpen, setHintOpen] = useState(false)
  // Bumped on retry/restart: remounts the family renderer so its local draft
  // state re-initializes (renderers lazy-init from lastResponse at mount).
  const [draftNonce, setDraftNonce] = useState(0)
  const completedRef = useRef(false)

  const item = currentItem(session)
  const question = currentQuestion(session)

  const apply = useCallback(
    (next: TrialSession) => {
      setSession(next)
      onSessionChange?.(next)
    },
    [onSessionChange]
  )

  const dispatchVirgil = useCallback((events: { type: string }[]) => {
    for (const e of events) virgilRef.current?.dispatch(e as never)
  }, [])

  // ── actions ────────────────────────────────────────────

  const handleSubmit = useCallback(
    (tagged: FamilyTaggedResponse) => {
      setLastResponse(tagged)
      const { session: next, virgilEvents } = submitAnswer(session, tagged)
      dispatchVirgil(virgilEvents)
      apply(next)
    },
    [session, apply, dispatchVirgil]
  )

  const handleUseHint = useCallback(() => {
    const { session: next, virgilEvents } = engineUseHint(session)
    dispatchVirgil(virgilEvents)
    apply(next)
  }, [session, apply, dispatchVirgil])

  const handleRetry = useCallback(() => {
    setLastResponse(null)
    setDraftNonce((n) => n + 1)
    apply(retryQuestion(session))
  }, [session, apply])

  const handleContinue = useCallback(() => {
    setLastResponse(null)
    setHintOpen(false)
    apply(advance(session))
  }, [session, apply])

  const handleToggleEliminate = useCallback(
    (optionId: string) => apply(toggleElimination(session, optionId)),
    [session, apply]
  )

  const handleRestart = useCallback(() => {
    completedRef.current = false
    setLastResponse(null)
    setHintOpen(false)
    setDraftNonce((n) => n + 1)
    apply(createTrialSession({ items, seed, rules }))
  }, [items, seed, rules, apply])

  // ── completion callback ────────────────────────────────

  useEffect(() => {
    if (session.status === "complete" && !completedRef.current) {
      completedRef.current = true
      onComplete?.(summarize(session), session)
    }
  }, [session, onComplete])

  // ── keyboard map ───────────────────────────────────────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const inTextField =
        target && (target.tagName === "TEXTAREA" || target.tagName === "INPUT")
      if (e.key === "Escape") {
        setHintOpen(false)
        return
      }
      if (inTextField) return
      if (e.key.toLowerCase() === "h") {
        e.preventDefault()
        setHintOpen((open) => !open)
        return
      }
      if (e.key.toLowerCase() === "r" && question && question.status !== "pending" && question.status !== "correct") {
        e.preventDefault()
        handleRetry()
        return
      }
      if (e.key === "Enter" && question?.feedback) {
        const tag = target?.tagName
        if (tag === "BUTTON" || tag === "A") return // let the focused control handle it
        e.preventDefault()
        handleContinue()
      }
    }
    const el = rootRef.current
    el?.addEventListener("keydown", onKey)
    return () => el?.removeEventListener("keydown", onKey)
  }, [question, handleRetry, handleContinue])

  // ── family routing ─────────────────────────────────────

  const renderer = useMemo(() => {
    if (!item || !question) return null
    const answered = question.feedback !== null
    const shared = {
      seed,
      answered,
      feedback: question.feedback,
      eliminated: question.eliminated,
      onToggleEliminate: handleToggleEliminate,
      reduced,
    }
    switch (item.family) {
      case "multiple-choice":
      case "close-reading":
      case "passage-identification":
      case "vocabulary-in-context":
      case "cross-reference":
        return (
          <ChoiceTrial
            family={item.family}
            itemId={item.id}
            content={item.content}
            {...shared}
            lastResponse={
              lastResponse && "optionId" in (lastResponse.response as object)
                ? (lastResponse.response as { optionId: string })
                : null
            }
            onSubmit={(r) => handleSubmit({ family: item.family, response: r } as FamilyTaggedResponse)}
          />
        )
      case "word-in-context":
        // Legacy shape → generic choice renderer (index → stable option id).
        return (
          <ChoiceTrial
            family="word-in-context"
            itemId={item.id}
            content={{
              sentence: item.content.sentence,
              targetWord: item.content.targetWord,
              options: item.content.choices.map((c, i) => ({ id: `c${i}`, text: c.text, correct: c.correct })),
            }}
            {...shared}
            lastResponse={null}
            onSubmit={(r) =>
              handleSubmit({
                family: "word-in-context",
                response: { choiceIndex: Number(r.optionId.slice(1)) },
              })
            }
          />
        )
      case "who-said-it":
        return (
          <ChoiceTrial
            family="who-said-it"
            itemId={item.id}
            content={{
              quote: item.content.quote,
              options: item.content.choices.map((c, i) => ({ id: `c${i}`, text: c.name, correct: c.correct })),
            }}
            {...shared}
            lastResponse={null}
            onSubmit={(r) =>
              handleSubmit({
                family: "who-said-it",
                response: { choiceIndex: Number(r.optionId.slice(1)) },
              })
            }
          />
        )
      case "fill-the-line":
        return (
          <FillTheLineTrial
            item={item}
            {...shared}
            lastResponse={lastResponse?.family === "fill-the-line" ? lastResponse.response : null}
            onSubmit={(r) => handleSubmit({ family: "fill-the-line", response: r })}
          />
        )
      case "find-the-evidence":
        return (
          <FindTheEvidenceTrial
            item={item}
            {...shared}
            lastResponse={lastResponse?.family === "find-the-evidence" ? lastResponse.response : null}
            onSubmit={(r) => handleSubmit({ family: "find-the-evidence", response: r })}
          />
        )
      case "match-pairs":
        return (
          <MatchPairsTrial
            item={item}
            {...shared}
            lastResponse={lastResponse?.family === "match-pairs" ? lastResponse.response : null}
            onSubmit={(r) => handleSubmit({ family: "match-pairs", response: r })}
          />
        )
      case "ordering":
        return (
          <OrderingTrial
            item={item}
            {...shared}
            lastResponse={lastResponse?.family === "ordering" ? lastResponse.response : null}
            onSubmit={(r) => handleSubmit({ family: "ordering", response: r })}
          />
        )
      case "true-false-with-reason":
        return (
          <TrueFalseReasonTrial
            item={item}
            {...shared}
            lastResponse={lastResponse?.family === "true-false-with-reason" ? lastResponse.response : null}
            onSubmit={(r) => handleSubmit({ family: "true-false-with-reason", response: r })}
          />
        )
      case "reflection":
      case "short-answer":
        return (
          <WritingTrial
            item={item}
            {...shared}
            lastResponse={lastResponse?.family === item.family ? (lastResponse.response as never) : null}
            onSubmit={(r) => handleSubmit({ family: item.family, response: r } as FamilyTaggedResponse)}
          />
        )
      case "recitation":
        return (
          <RecitationTrial
            item={item}
            {...shared}
            lastResponse={lastResponse?.family === "recitation" ? lastResponse.response : null}
            onSubmit={(r) => handleSubmit({ family: "recitation", response: r })}
          />
        )
    }
  }, [item, question, seed, reduced, lastResponse, handleSubmit, handleToggleEliminate])

  // ── completion screen ──────────────────────────────────

  if (session.status === "complete") {
    return (
      <CompletionView
        session={session}
        reduced={reduced}
        onRestart={handleRestart}
        rootRef={rootRef}
      />
    )
  }

  if (!item || !question) return null

  const isLast = session.index === session.items.length - 1

  return (
    <div ref={rootRef}>
      <TrialShell
        title={title ?? item.prompt}
        instruction={instruction}
        session={session}
        item={item}
        virgilRef={virgilRef}
        virgilVariant={virgilVariant}
        showVirgil={showVirgil}
        hintOpen={hintOpen}
        onToggleHints={() => setHintOpen((o) => !o)}
        onUseHint={handleUseHint}
        hintDrawer={
          <HintDrawer
            open={hintOpen}
            session={session}
            item={item}
            onUseHint={handleUseHint}
            onClose={() => setHintOpen(false)}
            reduced={reduced}
          />
        }
        feedback={
          question.feedback ? (
            <FeedbackPanel
              feedback={question.feedback}
              item={item}
              answered={question.feedback !== null}
              onRetry={handleRetry}
              onContinue={handleContinue}
              isLast={isLast}
              reduced={reduced}
            />
          ) : null
        }
        reduced={reduced}
      >
        <div key={`${item.id}:${draftNonce}`}>{renderer}</div>
      </TrialShell>
    </div>
  )
}

// ── Completion view ──────────────────────────────────────

function CompletionView({
  session,
  reduced,
  onRestart,
  rootRef,
}: {
  session: TrialSession
  reduced: boolean
  onRestart: () => void
  rootRef: RefObject<HTMLDivElement | null>
}) {
  const summary = summarize(session)
  const rows = [
    { label: "Answered correctly", value: `${summary.answeredCorrect} / ${summary.totalQuestions}` },
    { label: "First try", value: String(summary.firstTryCorrect) },
    { label: "Elegant answers", value: String(summary.elegant) },
    { label: "Near misses (worth another look)", value: String(summary.nearMisses) },
    { label: "Best streak", value: String(summary.bestStreak) },
    { label: "Hints taken", value: String(summary.hintsUsed) },
  ]

  return (
    <div ref={rootRef}>
      <motion.div
        variants={pickTactile("trialCompletion", reduced)}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-2xl space-y-5 p-6 sm:p-8"
        style={{ background: la.page, borderRadius: la.radiusL }}
        role="status"
        aria-label="Trial complete"
      >
        <motion.div variants={rowVariant(reduced)} className="space-y-1 text-center">
          <p className="font-sans text-xs uppercase tracking-widest" style={{ color: la.inkFaint }}>
            Trial complete
          </p>
          <h2 className="font-serif text-3xl" style={{ color: la.ink }}>
            Well read.
          </h2>
          <p className="font-sans text-lg font-bold" style={{ color: la.wisdomDeep }}>
            {summary.wisdomEarned} Wisdom earned
            <span className="ml-2 font-normal" style={{ color: la.inkFaint }}>
              of {Math.round(summary.wisdomPossible * 1.25)} possible
            </span>
          </p>
        </motion.div>

        <div className="space-y-2">
          {rows.map((row) => (
            <motion.div
              key={row.label}
              variants={rowVariant(reduced)}
              className="flex items-center justify-between border-b px-2 py-2 font-sans text-sm"
              style={{ borderColor: la.surfaceSunken }}
            >
              <span style={{ color: la.inkMuted }}>{row.label}</span>
              <span className="font-semibold" style={{ color: la.ink }}>
                {row.value}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div variants={rowVariant(reduced)} className="space-y-2">
          {session.items.map((item, i) => {
            const q = session.questions[i]
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 px-2 py-1.5 font-serif text-sm"
                style={{ color: la.inkMuted }}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    background:
                      q.status === "correct"
                        ? la.success
                        : q.status === "answered-near-miss"
                          ? la.nearMiss
                          : la.surfaceSunken,
                  }}
                  aria-hidden
                />
                <span className="flex-1 truncate">
                  {FAMILY_LABELS[item.family]} — {item.prompt}
                </span>
                <span className="font-sans text-xs" style={{ color: la.wisdomDeep }}>
                  {q.wisdomEarned > 0 ? `+${q.wisdomEarned}` : "—"}
                </span>
              </div>
            )
          })}
        </motion.div>

        <motion.div variants={rowVariant(reduced)} className="flex justify-center pt-2">
          <TrialActionButton onClick={onRestart}>Walk the Trial again</TrialActionButton>
        </motion.div>
      </motion.div>
    </div>
  )
}

function rowVariant(reduced: boolean) {
  return reduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }
}

// ── Re-exports for host pages ────────────────────────────

export { summarize } from "@/lib/trials/engine"
