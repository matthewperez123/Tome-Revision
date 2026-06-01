"use client"

import { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ChevronRight, Flame, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  quizReducer,
  createQuizState,
  wisdomForQuestion,
  type Quiz,
  type Question,
} from "@/lib/quiz-engine"
import type { ChapterQuestion } from "@/lib/chapter-questions"
import type { Book } from "@/lib/supabase"
import type { QuizDifficulty } from "@/lib/book-progress"
import { springs } from "@/lib/design-tokens"
import {
  trialEnter,
  trialExit,
  explanationRise,
  wisdomFloat,
  wrongShakeKeyframes,
  wrongShakeTransition,
  reduced as reducedTokens,
} from "@/lib/animations/trial-tokens"
import {
  QUESTION_RENDERERS,
  QUESTION_TYPE_ICONS,
  QUESTION_TYPE_LABELS,
} from "@/components/trials/questions"
import { gradeReflection } from "@/lib/actions/grade-reflection"
import {
  saveAttempt,
  loadAttempt,
  clearAttempt,
  type TrialAttemptSnapshot,
} from "@/lib/trial-attempts"
import { tierSigils } from "@/components/trials/sigils"
import { getTierDef, TrialDifficultyCards } from "./trial-difficulty-cards"
import { TrialProgressBar } from "@/components/trials/TrialProgressBar"
import { HeartsDisplay } from "@/components/trials/HeartsDisplay"
import { TrialIntroCard } from "@/components/trials/TrialIntroCard"
import { HeartsZeroModal } from "@/components/trials/HeartsZeroModal"
import { KeyboardHints } from "@/components/trials/KeyboardHints"
import { TrialResultsScreen } from "@/components/trials/TrialResultsScreen"
import { WisdomStar } from "@/components/trials/sigils/WisdomStar"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type OverlayPhase = "difficulty-select" | "intro" | "quiz" | "results"

export interface ChapterQuizOverlayProps {
  book: Book
  chapterTitle: string
  chapterIndex: number
  unitDisplay: string
  hearts: number
  isOpen: boolean
  onPass: (xpEarned: number, coinsEarned: number) => void
  onFail: () => void
  onClose: () => void
  onSelectDifficulty: (difficulty: QuizDifficulty) => void
  onSkip: () => void
  questions: ChapterQuestion[]
  /**
   * If provided, the overlay opens directly on the intro/quiz phase with
   * this tier preselected — skipping the in-overlay difficulty-select
   * screen (which is now handled by the DifficultyDropUp toast).
   */
  initialTier?: QuizDifficulty | null
  /** When true, the results CTA reads "Finish book" instead of "Next chapter". */
  isLastChapter?: boolean
}

// ─────────────────────────────────────────────
// Mapping: ChapterQuestion → engine Question
// ─────────────────────────────────────────────

function mapToEngineQuestion(
  q: ChapterQuestion,
  quizId: string,
  order: number
): Question {
  const base: Question = {
    id: q.id,
    quiz_id: quizId,
    type: q.type,
    prompt: q.text,
    options: q.options ?? [],
    correct_answer: "",
    explanation: q.explanation,
    order,
    difficulty: q.difficulty,
    citation: q.citation ?? null,
    passage: q.passage ?? null,
    passageHighlight: q.passageHighlight ?? null,
    acceptedVariants: q.acceptedVariants,
    correctPairs: q.correctPairs,
    matchingLeft: q.matchingLeft,
    matchingRight: q.matchingRight,
    correctOrder: q.correctOrder,
    vocabWord: q.vocabWord,
    etymology: q.etymology,
    crossRefBookId: q.crossRefBookId,
    crossRefLabel: q.crossRefLabel,
    reflectionPrompt: q.reflectionPrompt,
    reflectionWordMin: q.reflectionWordMin,
    reflectionWordMax: q.reflectionWordMax,
    reflectionRubric: q.reflectionRubric,
    reflectionExpectedThemes: q.reflectionExpectedThemes,
    identificationSubject: q.identificationSubject,
    tfReasons: q.tfReasons,
    tfCorrectReason: q.tfCorrectReason,
  }

  switch (q.type) {
    case "true_false":
      return {
        ...base,
        options: ["true", "false"],
        correct_answer: q.correctBool ? "true" : "false",
      }
    case "fill_blank":
      return { ...base, correct_answer: q.correctText ?? "" }
    case "ordering":
      return {
        ...base,
        options: q.options ?? [],
        correctOrder: q.correctOrder ?? [],
        correct_answer: JSON.stringify(q.correctOrder ?? []),
      }
    case "matching":
      return {
        ...base,
        options: [],
        correctPairs: q.correctPairs ?? {},
        correct_answer: JSON.stringify(q.correctPairs ?? {}),
      }
    case "reflection":
      return {
        ...base,
        options: [],
        // Engine accepts any response meeting word_min; no canonical answer.
        correct_answer: "",
      }
    case "identification": {
      // Like multiple_choice — options + correctIndex — but the renderer
      // shows a small subject prefix ("Who said this?" / "From which
      // book?" / "Which character?").
      const opts = q.options ?? []
      const correct = opts[q.correctIndex ?? 0] ?? opts[0] ?? ""
      return { ...base, options: opts, correct_answer: correct }
    }
    case "tf_with_reason": {
      // Composite answer "<bool>|<reasonIndex>". Engine compares as a
      // single string; renderer composes the value before submit.
      const correctBool = q.correctBool ? "true" : "false"
      const correctReason = q.tfCorrectReason ?? 0
      return {
        ...base,
        options: ["true", "false"],
        correct_answer: `${correctBool}|${correctReason}`,
      }
    }
    default: {
      // multiple_choice, passage_id, theme_analysis, vocabulary_in_context,
      // cross_reference, close_reading — all option-based
      const opts = q.options ?? []
      const correct = opts[q.correctIndex ?? 0] ?? opts[0] ?? ""
      return { ...base, options: opts, correct_answer: correct }
    }
  }
}

function buildQuizObjects(
  book: Book,
  chapterTitle: string,
  chapterIndex: number,
  questions: ChapterQuestion[]
): { quiz: Quiz; engineQuestions: Question[] } {
  const quizId = `chapter-trial-${book.id}-${chapterIndex}`
  const quiz: Quiz = {
    id: quizId,
    book_id: book.id,
    title: `${book.title} — ${chapterTitle}`,
    difficulty: book.difficulty,
  }
  const engineQuestions = questions.map((q, i) => mapToEngineQuestion(q, quizId, i))
  return { quiz, engineQuestions }
}

// ─────────────────────────────────────────────
// Floating "+N Wisdom" element
// ─────────────────────────────────────────────

function WisdomFloat({ amount, show, reduced }: { amount: number; show: boolean; reduced: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="wisdom-float"
          variants={reduced ? reducedTokens.wisdomFloat : wisdomFloat}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 z-10 flex items-center gap-1 select-none"
        >
          <WisdomStar size={20} />
          <span
            className="font-semibold text-sm"
            style={{ color: "var(--trial-laureate-text)" }}
          >
            +{amount} Wisdom
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────
// Quiz phase
// ─────────────────────────────────────────────

interface QuizRunnerProps {
  book: Book
  chapterTitle: string
  chapterIndex: number
  questions: ChapterQuestion[]
  tier: QuizDifficulty
  hearts: number
  onComplete: () => void
  onPauseStateChange: (paused: boolean) => void
  onFeedback: (msg: string) => void
  quizStateOut: (state: ReturnType<typeof createQuizState>) => void
  resumeToken: number
}

function QuizRunner({
  book,
  chapterTitle,
  chapterIndex,
  questions,
  tier,
  hearts,
  onComplete,
  onPauseStateChange,
  onFeedback,
  quizStateOut,
  resumeToken,
}: QuizRunnerProps) {
  const reduced = useReducedMotion() ?? false

  const { quiz, engineQuestions } = useMemo(
    () => buildQuizObjects(book, chapterTitle, chapterIndex, questions),
    [book, chapterTitle, chapterIndex, questions]
  )

  const [state, dispatch] = useReducer(
    quizReducer,
    { quiz, engineQuestions, hearts, book, chapterIndex, tier },
    ({ quiz: q, engineQuestions: eqs, hearts: h, book: b, chapterIndex: ci, tier: t }) => {
      const fresh = createQuizState(q, eqs, h)
      // Hydrate from any in-progress saved attempt for this book/chapter/tier.
      const snap = loadAttempt(b.id, ci, t)
      if (
        snap &&
        snap.answers.length === eqs.length &&
        snap.results.length === eqs.length
      ) {
        return {
          ...fresh,
          currentIndex: snap.currentIndex,
          answers: snap.answers,
          results: snap.results,
          score: snap.score,
          hearts: Math.min(snap.hearts, h),
          xpEarned: snap.xpEarned,
          coinsEarned: snap.coinsEarned,
          reflectionGrades: snap.reflectionGrades ?? {},
          status: "active" as const,
        }
      }
      return { ...fresh, status: "active" as const }
    }
  )

  // Publish state to parent for results screen
  useEffect(() => {
    quizStateOut(state)
  }, [state, quizStateOut])

  // ── Auto-save ────────────────────────────────
  // Persist progress on every meaningful state change. When the trial
  // completes (review / complete) clear the saved attempt.
  useEffect(() => {
    if (state.status === "review" || state.status === "complete") {
      clearAttempt(book.id, chapterIndex, tier)
      return
    }
    const snap: TrialAttemptSnapshot = {
      bookId: book.id,
      chapterIndex,
      tier,
      currentIndex: state.currentIndex,
      answers: state.answers,
      results: state.results,
      score: state.score,
      hearts: state.hearts,
      xpEarned: state.xpEarned,
      coinsEarned: state.coinsEarned,
      reflectionGrades: state.reflectionGrades ?? {},
      lastSavedAt: new Date().toISOString(),
      startedAt: new Date(state.startedAt).toISOString(),
    }
    saveAttempt(snap)
  }, [
    state.status,
    state.currentIndex,
    state.answers,
    state.results,
    state.score,
    state.hearts,
    state.xpEarned,
    state.coinsEarned,
    state.reflectionGrades,
    state.startedAt,
    book.id,
    chapterIndex,
    tier,
  ])

  // Handle paused / review transitions
  useEffect(() => {
    if (state.status === "paused") onPauseStateChange(true)
    else onPauseStateChange(false)

    if (state.status === "review" || state.status === "complete") {
      const t = setTimeout(onComplete, 400)
      return () => clearTimeout(t)
    }
  }, [state.status, onComplete, onPauseStateChange])

  // Resume when hearts regenerate / refill
  useEffect(() => {
    if (state.status === "paused" && hearts > 0 && resumeToken > 0) {
      dispatch({ type: "RESUME" })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeToken, hearts])

  const currentIdx = state.currentIndex
  const q = state.questions[currentIdx]
  const answered = state.results[currentIdx] !== null
  const isCorrect = state.results[currentIdx] === "correct"
  const isWrong = state.results[currentIdx] === "wrong"
  const selectedAnswer = state.answers[currentIdx]

  const [showWisdom, setShowWisdom] = useState(false)
  const [shake, setShake] = useState(false)
  const [lostIndex, setLostIndex] = useState<number | null>(null)

  // Feedback effects after answer
  useEffect(() => {
    if (!answered) return
    if (isCorrect) {
      setShowWisdom(true)
      onFeedback(
        `Correct. +${wisdomForQuestion(q)} Wisdom. ${q.explanation ?? ""}`
      )
      const t = setTimeout(() => setShowWisdom(false), 1000)
      return () => clearTimeout(t)
    }
    if (isWrong) {
      setShake(true)
      setLostIndex(state.hearts) // heart that was just lost
      onFeedback(
        `Wrong. Correct answer: ${q.correct_answer}. ${q.explanation ?? ""}`
      )
      const t1 = setTimeout(() => setShake(false), 500)
      const t2 = setTimeout(() => setLostIndex(null), 800)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, isCorrect, isWrong])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      )
        return

      if (answered) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          dispatch({ type: "NEXT" })
        }
        return
      }

      if (!q) return
      const opts = q.options ?? []

      if (q.type === "true_false") {
        if (e.key.toLowerCase() === "t") {
          e.preventDefault()
          dispatch({ type: "ANSWER", answer: "true" })
        } else if (e.key.toLowerCase() === "f") {
          e.preventDefault()
          dispatch({ type: "ANSWER", answer: "false" })
        }
        return
      }

      if (
        q.type === "multiple_choice" ||
        q.type === "passage_id" ||
        q.type === "theme_analysis" ||
        q.type === "vocabulary_in_context" ||
        q.type === "cross_reference" ||
        q.type === "close_reading" ||
        q.type === "identification"
      ) {
        const n = parseInt(e.key, 10)
        if (!Number.isNaN(n) && n >= 1 && n <= opts.length) {
          e.preventDefault()
          dispatch({ type: "ANSWER", answer: opts[n - 1] })
        }
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [q, answered])

  if (!q) return null

  const Renderer = QUESTION_RENDERERS[q.type]
  const TypeIcon = QUESTION_TYPE_ICONS[q.type]
  const tierDef = getTierDef(tier)
  const TierSigil = tierSigils[tier]

  const handleSubmit = (answer: string) => {
    if (answered) return
    dispatch({ type: "ANSWER", answer })

    // Reflection: kick off Virgil grading (placeholder action). The engine
    // already accepted the answer; we only attach a 0–10 score + feedback.
    if (q.type === "reflection") {
      dispatch({ type: "REFLECTION_PENDING", questionId: q.id })
      void (async () => {
        try {
          const res = await gradeReflection({
            questionId: q.id,
            attemptId: quiz.id,
            response: answer,
            rubric: q.reflectionRubric,
            expectedThemes: q.reflectionExpectedThemes,
            wordMin: q.reflectionWordMin,
          })
          dispatch({
            type: "REFLECTION_GRADED",
            questionId: q.id,
            score: res.score,
            feedback: res.feedback,
          })
          onFeedback(`Virgil: ${res.feedback}`)
        } catch {
          dispatch({ type: "REFLECTION_FAILED", questionId: q.id })
          onFeedback("Virgil will review this shortly.")
        }
      })()
    }
  }

  const handleNext = () => {
    dispatch({ type: "NEXT" })
  }

  // Current consecutive-correct run, derived from results (no engine field).
  const streak = state.results.reduce(
    (acc, r) => (r === "correct" ? acc + 1 : r === "wrong" ? 0 : acc),
    0
  )

  return (
    <div className="flex flex-col h-full">
      {/* HUD — difficulty · score · streak · hearts */}
      <div className="flex items-center justify-between gap-3 px-6 py-2.5 bg-card border-b border-border">
        {/* Difficulty + context */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="flex items-center gap-1.5 rounded-full pl-1.5 pr-2.5 py-1 text-xs font-semibold font-sans"
            style={{ background: tierDef.accentSoft, color: tierDef.accentText }}
          >
            <TierSigil size={16} color={tierDef.accentColor} />
            {tierDef.label}
          </span>
          <span className="text-[11px] font-sans text-muted-foreground truncate hidden sm:block max-w-[200px]">
            {book.title} · {chapterTitle}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Wisdom score */}
          <span
            className="flex items-center gap-1 text-xs font-semibold tabular-nums font-sans"
            style={{ color: "var(--trial-laureate-text)" }}
            aria-label={`${state.xpEarned} Wisdom earned`}
          >
            <WisdomStar size={14} />
            {state.xpEarned}
          </span>
          {/* Streak */}
          <span
            className={`flex items-center gap-1 text-xs font-semibold tabular-nums font-sans transition-opacity ${streak > 1 ? "opacity-100" : "opacity-40"}`}
            style={{ color: "var(--flame-streak)" }}
            aria-label={`${streak} correct in a row`}
          >
            <Flame size={14} className="fill-current" />
            {streak}
          </span>
          <HeartsDisplay current={state.hearts} max={hearts} lostIndex={lostIndex} />
        </div>
      </div>

      <TrialProgressBar
        current={currentIdx}
        total={state.questions.length}
        accentColor={tierDef.accentColor}
      />

      {/* Screen-reader live region */}
      <div role="status" aria-live="polite" className="sr-only">
        {/* populated via onFeedback callback at parent level */}
      </div>

      {/* Question area */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={q.id + state.resumeCount}
              variants={reduced ? reducedTokens.trialEnter : trialEnter}
              initial="hidden"
              animate={shake ? "visible" : "visible"}
              exit={reduced ? undefined : "hidden"}
              className="rounded-2xl border-2 border-border bg-card p-6 space-y-5 shadow-sm relative"
            >
              {/* Shake overlay when wrong */}
              {shake && !reduced && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={wrongShakeKeyframes}
                  transition={wrongShakeTransition}
                />
              )}

              {/* Type + tier meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold font-sans text-muted-foreground">
                  <TypeIcon className="w-3.5 h-3.5" />
                  {QUESTION_TYPE_LABELS[q.type]}
                </div>
                <span className="text-[11px] font-sans text-muted-foreground">
                  Question {currentIdx + 1} of {state.questions.length}
                </span>
              </div>

              {/* Prompt — unless the renderer owns it (fill_blank, passage_id, close_reading, vocab, reflection) */}
              {q.type !== "fill_blank" &&
                q.type !== "passage_id" &&
                q.type !== "close_reading" &&
                q.type !== "vocabulary_in_context" &&
                q.type !== "reflection" && (
                  <p className="text-ink text-2xl leading-snug font-serif tracking-tight">
                    {q.prompt}
                  </p>
                )}

              {/* Renderer */}
              <Renderer
                question={q}
                answered={answered}
                isCorrect={isCorrect}
                isWrong={isWrong}
                selectedAnswer={selectedAnswer}
                onSubmit={handleSubmit}
                reduced={reduced}
              />

              {/* Wisdom float */}
              {answered && isCorrect && (
                <div className="absolute right-4 top-4 h-0 w-0">
                  <WisdomFloat
                    amount={wisdomForQuestion(q)}
                    show={showWisdom}
                    reduced={reduced}
                  />
                </div>
              )}

              {/* Explanation / Virgil feedback card */}
              <AnimatePresence>
                {answered && q.type === "reflection" ? (
                  (() => {
                    const grade = state.reflectionGrades?.[q.id]
                    const pending = !grade || grade.status === "pending"
                    const failed = grade?.status === "failed"
                    return (
                      <motion.div
                        variants={reduced ? reducedTokens.explanationRise : explanationRise}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="rounded-xl border-2 px-4 py-3 space-y-1.5"
                        style={{
                          borderColor:
                            "color-mix(in srgb, var(--trial-laureate) 40%, transparent)",
                          background: "var(--trial-laureate-soft)",
                        }}
                      >
                        <div
                          className="flex items-center gap-2 font-sans text-sm font-bold"
                          style={{ color: "var(--trial-laureate-text)" }}
                        >
                          <span
                            className="grid place-items-center size-5 rounded-full"
                            style={{
                              background:
                                "color-mix(in srgb, var(--trial-laureate) 18%, transparent)",
                              border:
                                "1px solid color-mix(in srgb, var(--trial-laureate) 50%, transparent)",
                              color: "var(--trial-laureate-text)",
                            }}
                            aria-hidden
                          >
                            ✦
                          </span>
                          {pending
                            ? "Virgil is reading your reflection…"
                            : failed
                              ? "Virgil will review this shortly"
                              : `Virgil — ${grade!.score} / 10`}
                        </div>
                        {!pending && !failed && (
                          <p className="text-sm text-ink font-serif leading-relaxed">
                            {grade!.feedback}
                          </p>
                        )}
                        {q.explanation && !pending && !failed && (
                          <p className="text-xs italic text-stone-500 font-serif pt-1">
                            {q.explanation}
                          </p>
                        )}
                      </motion.div>
                    )
                  })()
                ) : answered ? (
                  <motion.div
                    variants={reduced ? reducedTokens.explanationRise : explanationRise}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="rounded-xl border-2 px-4 py-3 space-y-1.5"
                    style={{
                      borderColor: isCorrect
                        ? "color-mix(in srgb, var(--trial-correct) 45%, transparent)"
                        : "color-mix(in srgb, var(--trial-incorrect) 45%, transparent)",
                      background: isCorrect
                        ? "var(--trial-correct-soft)"
                        : "var(--trial-incorrect-soft)",
                    }}
                  >
                    <div
                      className="flex items-center gap-2 font-sans text-sm font-bold"
                      style={{
                        color: isCorrect
                          ? "var(--trial-correct-text)"
                          : "var(--trial-incorrect-text)",
                      }}
                    >
                      <TierSigil
                        size={16}
                        color={
                          isCorrect ? "var(--trial-correct)" : "var(--trial-incorrect)"
                        }
                      />
                      {isCorrect ? "Correct" : "Not quite"}
                    </div>
                    {!isCorrect && q.correct_answer && q.type !== "fill_blank" && (
                      <p className="text-sm text-ink font-serif">
                        The correct answer is:{" "}
                        <span className="font-semibold">{q.correct_answer}</span>
                      </p>
                    )}
                    {q.explanation && (
                      <p className="text-sm text-ink font-serif leading-relaxed">
                        {q.explanation}
                      </p>
                    )}
                    {q.citation && (
                      <p className="text-xs italic text-stone-500 font-serif pt-1">
                        — {q.citation}
                      </p>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          {/* Next / Continue */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 flex justify-end"
              >
                <Button
                  onClick={handleNext}
                  className="rounded-xl font-semibold gap-2"
                >
                  {currentIdx < state.questions.length - 1 ? (
                    <>
                      Next Question
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      See Results
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Main overlay
// ─────────────────────────────────────────────

export function ChapterQuizOverlay({
  book,
  chapterTitle,
  chapterIndex,
  unitDisplay,
  questions,
  hearts,
  isOpen,
  onPass,
  onFail,
  onClose,
  onSelectDifficulty,
  onSkip,
  initialTier = null,
  isLastChapter = false,
}: ChapterQuizOverlayProps) {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<OverlayPhase>(
    initialTier ? "intro" : "difficulty-select"
  )
  const [selectedTier, setSelectedTier] = useState<QuizDifficulty | null>(
    initialTier
  )
  const [attempt, setAttempt] = useState(0)
  const [paused, setPaused] = useState(false)
  const [resumeToken, setResumeToken] = useState(0)
  const [finalState, setFinalState] = useState<ReturnType<typeof createQuizState> | null>(
    null
  )
  const [liveMessage, setLiveMessage] = useState("")

  // Reset when the overlay opens
  useEffect(() => {
    if (isOpen) {
      setPhase(initialTier ? "intro" : "difficulty-select")
      setSelectedTier(initialTier)
      setAttempt(0)
      setPaused(false)
      setFinalState(null)
      setResumeToken(0)
    }
  }, [isOpen, initialTier])

  // Advance from difficulty-select → intro when questions arrive
  useEffect(() => {
    if (phase === "difficulty-select" && selectedTier && questions.length > 0) {
      setPhase("intro")
    }
  }, [phase, selectedTier, questions.length])

  const handleSelectDifficulty = useCallback(
    (tier: QuizDifficulty) => {
      setSelectedTier(tier)
      onSelectDifficulty(tier)
    },
    [onSelectDifficulty]
  )

  const handleIntroBegin = useCallback(() => {
    setPhase("quiz")
  }, [])

  const handleQuizComplete = useCallback(() => {
    setPhase("results")
  }, [])

  const handleRetry = useCallback(() => {
    setAttempt((n) => n + 1)
    setPhase("quiz")
    setFinalState(null)
    onFail()
  }, [onFail])

  const handleReturn = useCallback(() => {
    onClose()
  }, [onClose])

  // Escape key exit confirmation
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && phase !== "results") {
        const target = e.target as HTMLElement | null
        if (
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable)
        )
          return
        if (window.confirm("Exit Trial? Progress will not be saved.")) {
          onClose()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, phase, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="trial-overlay"
          initial={reduced ? { opacity: 0 } : { y: "100%" }}
          animate={reduced ? { opacity: 1 } : { y: 0 }}
          exit={reduced ? { opacity: 0 } : { y: "100%" }}
          transition={reduced ? { duration: 0.2 } : { ...springs.gentle, duration: 0.55 }}
          className="fixed inset-0 z-50 bg-background flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Chapter Trial"
        >
          {/* Exit button (hidden on difficulty-select) */}
          <AnimatePresence>
            {phase !== "difficulty-select" && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                aria-label="Exit trial"
              >
                <X className="size-5" aria-hidden="true" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Screen-reader live region for answer feedback */}
          <div role="status" aria-live="polite" className="sr-only">
            {liveMessage}
          </div>

          <div className="flex-1 flex flex-col overflow-hidden relative">
            <AnimatePresence mode="wait">
              {phase === "difficulty-select" && (
                <motion.div
                  key="difficulty-select"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col"
                >
                  <TrialDifficultyCards
                    unitDisplay={unitDisplay}
                    onSelectDifficulty={handleSelectDifficulty}
                    onSkip={onSkip}
                  />
                </motion.div>
              )}

              {phase === "intro" && selectedTier && (
                <motion.div
                  key="intro"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col"
                >
                  <TrialIntroCard
                    tier={selectedTier}
                    unitDisplay={unitDisplay}
                    questionCount={questions.length}
                    hearts={hearts}
                    onBegin={handleIntroBegin}
                  />
                </motion.div>
              )}

              {phase === "quiz" && selectedTier && questions.length > 0 && (
                <motion.div
                  key={`quiz-${attempt}`}
                  initial={reduced ? false : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col"
                >
                  <QuizRunner
                    book={book}
                    chapterTitle={chapterTitle}
                    chapterIndex={chapterIndex}
                    questions={questions}
                    tier={selectedTier}
                    hearts={hearts}
                    onComplete={handleQuizComplete}
                    onPauseStateChange={setPaused}
                    onFeedback={setLiveMessage}
                    quizStateOut={setFinalState}
                    resumeToken={resumeToken}
                  />
                </motion.div>
              )}

              {phase === "results" && finalState && selectedTier && (
                <motion.div
                  key="results"
                  initial={reduced ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 flex flex-col"
                >
                  <TrialResultsScreen
                    quizState={finalState}
                    tier={selectedTier}
                    maxHearts={hearts}
                    onPass={onPass}
                    onRetry={handleRetry}
                    onReturn={handleReturn}
                    isLastChapter={isLastChapter}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {phase === "quiz" && <KeyboardHints />}
          </div>

          {/* Hearts-zero pause modal */}
          <HeartsZeroModal
            open={paused}
            onResume={() => {
              setPaused(false)
              setResumeToken((n) => n + 1)
            }}
            onReviewChapter={onClose}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
