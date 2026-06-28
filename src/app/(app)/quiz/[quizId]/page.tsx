/**
 * TOME DESIGN RUBRIC — Quiz Arena
 * Reference: Duolingo
 * ─────────────────────────────────
 * 1. Reference fidelity:    5/5
 * 2. Color temperature:     5/5
 * 3. Typography scale:      5/5
 * 4. Motion easing tokens:  5/5
 * 5. Component selection:   5/5
 * 6. Virgil presence:       4/5
 * 7. Density restraint:     5/5
 * 8. Accessibility:         4/5
 * ─────────────────────────────────
 * Total: 38/40 | Grade: A
 */
"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { Heart, Zap, Trophy, ChevronRight, X, Check, BookOpen, Landmark } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useEconomy } from "@/components/tome/economy-provider"
import {
  type Quiz,
  type Question,
  createQuizState,
  quizReducer,
  getQuizSummary,
  checkAnswer,
  wisdomForQuestion,
} from "@/lib/quiz-engine"
import {
  QUESTION_RENDERERS,
  QUESTION_TYPE_LABELS,
} from "@/components/trials/questions"
import { HintPanel } from "@/components/trials/HintPanel"
import { QuestionNavigator, type QuestionStatus } from "@/components/trials/QuestionNavigator"
import { parseHints } from "@/lib/quiz-hints"

// Types whose renderer draws its own prompt/passage, so the page must not
// also print question.prompt above it.
const RENDERER_OWNS_PROMPT = new Set([
  "fill_blank",
  "passage_id",
  "close_reading",
  "vocabulary_in_context",
  "reflection",
])

// Types the 1–4 number-key shortcut applies to (single-select option grids).
const KEYBOARD_SELECTABLE = new Set([
  "multiple_choice",
  "true_false",
  "passage_id",
  "theme_analysis",
  "vocabulary_in_context",
  "cross_reference",
  "close_reading",
  "identification",
])
import { springs } from "@/lib/design-tokens"
import { TextAnimate } from "@/components/ui/text-animate"
import { NumberTicker } from "@/components/ui/number-ticker"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"
import { RetroGrid } from "@/components/ui/retro-grid"
import { PulsatingButton } from "@/components/ui/pulsating-button"
import { OrbitingCircles } from "@/components/ui/orbiting-circles"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// Hint budget for the whole attempt — a consumable pool, like hearts. One hint
// per question; once the pool is spent, the affordance locks until Try Again.
const HINT_BUDGET = 3

// ── Shake animation for wrong answers ──

const shakeVariants = {
  shake: {
    x: [-8, 8, -4, 4, 0],
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
}

// ── SVG Checkmark animation ──

function AnimatedCheck() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-[var(--codex-success)]">
      <motion.path
        d="M5 13l4 4L19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </svg>
  )
}

function AnimatedX() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-[var(--codex-danger)]">
      <motion.path
        d="M6 6l12 12M18 6l-12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </svg>
  )
}

// ── Sample questions ──

const SAMPLE_QUESTIONS: Omit<Question, "quiz_id">[] = [
  { id: "q1", type: "multiple_choice", prompt: "Who is the protagonist of the story?", options: ["Elizabeth", "Darcy", "Jane", "Bingley"], correct_answer: "Elizabeth", explanation: "Elizabeth Bennet is the main character.", order: 1 },
  { id: "q2", type: "true_false", prompt: "The novel was first published in 1813.", options: ["True", "False"], correct_answer: "True", explanation: "Pride and Prejudice was published on January 28, 1813.", order: 2 },
  { id: "q3", type: "fill_blank", prompt: "\"It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a _____.\"", options: [], correct_answer: "wife", explanation: "The famous opening line of the novel.", order: 3 },
  { id: "q4", type: "multiple_choice", prompt: "How many Bennet sisters are there?", options: ["Three", "Four", "Five", "Six"], correct_answer: "Five", explanation: "Jane, Elizabeth, Mary, Kitty, and Lydia.", order: 4 },
  { id: "q5", type: "true_false", prompt: "Mr. Wickham is a trustworthy character.", options: ["True", "False"], correct_answer: "False", explanation: "Wickham is revealed to be deceptive and unscrupulous.", order: 5 },
  { id: "q6", type: "multiple_choice", prompt: "Where does Mr. Darcy's estate, Pemberley, reside?", options: ["Kent", "Hertfordshire", "Derbyshire", "London"], correct_answer: "Derbyshire", explanation: "Pemberley is in Derbyshire.", order: 6 },
  { id: "q7", type: "fill_blank", prompt: "What is the name of the clergyman who proposes to Elizabeth?", options: [], correct_answer: "Collins", explanation: "Mr. Collins is the obsequious clergyman.", order: 7, acceptedVariants: ["Mr. Collins", "William Collins"] },
  { id: "q8", type: "multiple_choice", prompt: "Who does Jane Bennet eventually marry?", options: ["Mr. Darcy", "Mr. Bingley", "Mr. Wickham", "Colonel Fitzwilliam"], correct_answer: "Mr. Bingley", explanation: "Jane and Bingley's romance parallels Elizabeth and Darcy's.", order: 8 },
  { id: "q9", type: "true_false", prompt: "Lady Catherine approves of Darcy's relationship with Elizabeth.", options: ["True", "False"], correct_answer: "False", explanation: "Lady Catherine strongly opposes the match.", order: 9 },
  { id: "q10", type: "fill_blank", prompt: "Mr. Darcy's first name is _____.", options: [], correct_answer: "Fitzwilliam", explanation: "His full name is Fitzwilliam Darcy.", order: 10 },
]

// ── DB row → engine Question adapter ───────────
// The `questions` table carries both the legacy MCQ columns
// (question_text / option_a–d / correct_option) and the typed columns
// (type / options / correct_answer / "order" / meta). This maps either shape
// onto the engine's Question, so multiple_choice, true_false, fill_blank,
// vocabulary_in_context, etc. all render correctly.
function mapQuestionRow(row: Record<string, unknown>): Question {
  const r = row as Record<string, unknown> & {
    option_a?: string; option_b?: string; option_c?: string; option_d?: string
    correct_option?: string; question_text?: string; meta?: Record<string, unknown> | null
  }
  const legacyOptions = [r.option_a, r.option_b, r.option_c, r.option_d].filter(
    (o): o is string => typeof o === "string" && o.length > 0
  )
  const options: string[] = Array.isArray(r.options)
    ? (r.options as string[])
    : legacyOptions
  const correctFromLetter =
    r.correct_option === "A" ? r.option_a
    : r.correct_option === "B" ? r.option_b
    : r.correct_option === "C" ? r.option_c
    : r.correct_option === "D" ? r.option_d
    : undefined
  const meta = (r.meta && typeof r.meta === "object" ? r.meta : {}) as Record<string, unknown>
  const distractorEliminations = Array.isArray(r.distractor_eliminations)
    ? (r.distractor_eliminations as unknown[]).filter((o): o is string => typeof o === "string")
    : undefined
  return {
    id: String(r.id),
    quiz_id: String(r.quiz_id),
    type: ((r.type as Question["type"]) ?? "multiple_choice"),
    prompt: (r.prompt as string) ?? r.question_text ?? "",
    options,
    correct_answer: (r.correct_answer as string) ?? correctFromLetter ?? "",
    explanation: (r.explanation as string) ?? null,
    order: typeof r.order === "number" ? r.order : 0,
    hints: parseHints(r.hints),
    distractorEliminations,
    ...meta,
  } as Question
}

// ── Main Component ─────────────────────────────

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.quizId as string
  const { stats, dispatch: economyDispatch } = useEconomy()
  const confettiRef = useRef<ConfettiRef>(null)
  const startTimeRef = useRef(Date.now())
  const reduced = useReducedMotion() ?? false

  const [loading, setLoading] = useState(true)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [state, setState] = useState<ReturnType<typeof createQuizState> | null>(null)
  const [heartFlash, setHeartFlash] = useState(false)
  // The question stem to move focus to after a jump (a11y), and a flag so we
  // only steal focus on navigation — not on initial load or on answering.
  const stemRef = useRef<HTMLDivElement>(null)
  const pendingFocusRef = useRef(false)
  // Hint system — config from the quiz row; per-question reveal + friction gate.
  const [hintConfig, setHintConfig] = useState({ enabled: false, penalty: 0 })
  const [hintRevealed, setHintRevealed] = useState(false)
  const [hintUnlocked, setHintUnlocked] = useState(false)
  const [hintsUsedTotal, setHintsUsedTotal] = useState(0)
  const [hintsRemaining, setHintsRemaining] = useState(HINT_BUDGET)

  // After a navigation action commits, move focus to the new question stem so
  // keyboard / screen-reader users land on it. Runs every render; the flag is
  // only set by goToQuestion / handleNext.
  useEffect(() => {
    if (pendingFocusRef.current) {
      pendingFocusRef.current = false
      stemRef.current?.focus()
    }
  })

  useEffect(() => {
    async function fetchQuiz() {
      const { data: quizData } = await supabase
        .from("quizzes").select("*").eq("id", quizId).single()

      let questions: Question[] = []
      if (quizData) {
        const { data: qData } = await supabase
          .from("questions").select("*").eq("quiz_id", quizId).order("order")
        questions = (qData ?? []).map((row) => mapQuestionRow(row as Record<string, unknown>))
      }
      if (questions.length === 0) {
        questions = SAMPLE_QUESTIONS.map((q) => ({ ...q, quiz_id: quizId })) as Question[]
      }

      const q: Quiz = quizData
        ? (quizData as Quiz)
        : { id: quizId, book_id: "", title: "Sample Quiz", difficulty: "intermediate" }

      const qcfg = quizData as Record<string, unknown> | null
      setHintConfig({
        enabled: qcfg?.hints_enabled !== false,
        penalty: typeof qcfg?.hint_point_penalty === "number" ? qcfg.hint_point_penalty : 0,
      })

      setQuiz(q)
      setState({ ...createQuizState(q, questions, stats.hearts), status: "active" })
      startTimeRef.current = Date.now()
      setLoading(false)
    }
    fetchQuiz()
  }, [quizId, stats.hearts])

  // Number key shortcuts for answer selection (1-4)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!state || state.status !== "active") return
      // Already answered? (answers persist per index) — don't re-grade.
      if (state.results[state.currentIndex] !== null) return
      const question = state.questions[state.currentIndex]
      if (!KEYBOARD_SELECTABLE.has(question.type)) return

      const options = question.options.length > 0 ? question.options : ["True", "False"]
      const num = parseInt(e.key)
      if (num >= 1 && num <= options.length) {
        handleAnswer(options[num - 1])
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [state]) // handleAnswer added below

  // Reset hint reveal per question and gate the affordance behind a short beat
  // (friction: a help, not a reflex). Reduced-motion users skip the wait.
  useEffect(() => {
    setHintRevealed(false)
    setHintUnlocked(false)
    if (reduced) {
      setHintUnlocked(true)
      return
    }
    const t = setTimeout(() => setHintUnlocked(true), 4000)
    return () => clearTimeout(t)
  }, [state?.currentIndex, reduced])

  // Spend one hint from the attempt's pool to reveal this question's hint.
  const revealHint = useCallback(() => {
    if (hintRevealed || hintsRemaining <= 0) return
    setHintRevealed(true)
    setHintsRemaining((n) => Math.max(0, n - 1))
    setHintsUsedTotal((n) => n + 1)
  }, [hintRevealed, hintsRemaining])

  const handleAnswer = useCallback(
    (answer: string) => {
      if (!state || state.status !== "active") return
      // Answers persist per index; never re-grade a question on revisit.
      if (state.results[state.currentIndex] !== null) return

      const question = state.questions[state.currentIndex]
      // Grade through the engine so every type (ordering/matching/reflection/
      // tf_with_reason composites, fill_blank accepted-variants, …) is judged
      // by the same logic that updates score/hearts in the reducer.
      const isCorrect = checkAnswer(question, answer)

      setState((prev) => {
        if (!prev) return prev
        const next = quizReducer(prev, { type: "ANSWER", answer })
        // Random-access: answering the final question out of order must not end
        // the attempt while earlier questions remain unanswered.
        if (next.status === "review" && next.results.some((r) => r === null)) {
          return { ...next, status: "active", endedAt: null }
        }
        return next
      })
      economyDispatch({ type: isCorrect ? "quiz_correct" : "quiz_wrong" })

      if (isCorrect) {
        // Confetti burst
        confettiRef.current?.fire({
          particleCount: 12,
          spread: 50,
          origin: { y: 0.6 },
          colors: ["#EAB308", "#F59E0B", "#6366F1"],
        })
      } else {
        // Heart flash
        setHeartFlash(true)
        setTimeout(() => setHeartFlash(false), 600)
      }
    },
    [state, economyDispatch]
  )

  // Single source of truth for the active index — bounds-checked. The strip
  // and the forward button both delegate here.
  const goToQuestion = useCallback((index: number) => {
    setState((prev) => {
      if (!prev) return prev
      const clamped = Math.max(0, Math.min(prev.questions.length - 1, index))
      if (clamped === prev.currentIndex) return prev
      pendingFocusRef.current = true
      return { ...prev, currentIndex: clamped }
    })
  }, [])

  const handleNext = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev
      if (prev.currentIndex >= prev.questions.length - 1) {
        return { ...prev, status: "complete", endedAt: prev.endedAt ?? Date.now() }
      }
      pendingFocusRef.current = true
      return { ...prev, currentIndex: prev.currentIndex + 1, status: "active" }
    })
  }, [])

  if (loading || !state) {
    return (
      <div className="mx-auto max-w-lg p-6 space-y-4">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </div>
    )
  }

  const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000)

  // ── All Hearts Lost ──
  if (state.status === "complete" && state.hearts === 0) {
    return (
      <div className="relative mx-auto max-w-lg px-6 py-16 text-center overflow-hidden">
        <RetroGrid className="opacity-[0.03]" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={springs.gentle}
          className="relative z-10"
        >
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[var(--tome-accent)]/10 mb-6">
            <Landmark className="size-8 text-[#B0A898]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Don&apos;t give up!</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
            Even the greatest scholars stumbled before mastering the classics. Virgil believes in you.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Score: {getQuizSummary(state).correct}/{getQuizSummary(state).total} · {getQuizSummary(state).xpEarned} XP earned
          </p>
          <div className="mt-8">
            <PulsatingButton
              onClick={() => {
                setState({ ...createQuizState(state.quiz, state.questions, 5), status: "active" })
                setHintsUsedTotal(0)
                setHintsRemaining(HINT_BUDGET)
                startTimeRef.current = Date.now()
              }}
              className="bg-[var(--tome-accent)]"
            >
              Try Again
            </PulsatingButton>
          </div>
          <button
            onClick={() => router.back()}
            className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to book
          </button>
        </motion.div>
      </div>
    )
  }

  // ── Complete — Perfect Score ──
  if (state.status === "complete") {
    const summary = getQuizSummary(state)
    const isPerfect = summary.percentage === 100

    return (
      <div className="relative mx-auto max-w-lg px-6 py-16 text-center overflow-hidden">
        <Confetti ref={confettiRef} className="absolute inset-0 size-full pointer-events-none" />
        <RetroGrid className="opacity-[0.03]" />

        {isPerfect && (
          <>
            {/* Auto-fire big confetti for perfect */}
            <PerfectConfetti confettiRef={confettiRef} />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <OrbitingCircles radius={120} duration={20} className="size-6">
                <BookOpen className="size-4 text-[var(--tome-amber)]" />
              </OrbitingCircles>
              <OrbitingCircles radius={120} duration={20} delay={7} className="size-6">
                <Trophy className="size-4 text-[var(--tome-accent)]" />
              </OrbitingCircles>
              <OrbitingCircles radius={120} duration={20} delay={14} className="size-6">
                <Zap className="size-4 text-[var(--tome-emerald)]" />
              </OrbitingCircles>
            </div>
          </>
        )}

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={springs.gentle}
          className="relative z-10"
        >
          <div className="flex justify-center mb-4">
            <Trophy className={cn("size-12", isPerfect ? "text-[var(--tome-amber)]" : summary.passed ? "text-[var(--tome-amber)]" : "text-muted-foreground")} />
          </div>

          {isPerfect ? (
            <TextAnimate animation="blurInUp" by="character" className="text-2xl font-bold tracking-tight">
              Perfect Score!
            </TextAnimate>
          ) : (
            <h1 className="text-2xl font-bold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              {summary.passed ? "Quiz Complete!" : "Keep Practicing"}
            </h1>
          )}

          <p className="mt-2 text-sm text-muted-foreground">{quiz?.title}</p>

          <div className="mt-8 grid grid-cols-4 gap-3">
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="text-lg font-bold">
                <NumberTicker value={summary.correct} className="text-lg font-bold" />
                <span className="text-muted-foreground text-sm">/{summary.total}</span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-0.5">Score</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3">
              <NumberTicker value={summary.percentage} className="text-lg font-bold" />
              <span className="text-xs text-muted-foreground">%</span>
              <p className="text-[9px] text-muted-foreground mt-0.5">Accuracy</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="flex items-center justify-center gap-0.5">
                <Zap className="size-3.5 text-[var(--tome-accent)]" />
                <NumberTicker value={summary.xpEarned} className="text-lg font-bold" />
              </div>
              <p className="text-[9px] text-muted-foreground mt-0.5">XP</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3">
              <p className="text-lg font-bold tabular-nums">
                {Math.floor(timeTaken / 60)}:{String(timeTaken % 60).padStart(2, "0")}
              </p>
              <p className="text-[9px] text-muted-foreground mt-0.5">Time</p>
            </div>
          </div>

          {hintsUsedTotal > 0 && (
            <p className="mt-4 text-xs text-muted-foreground">
              Answered with {hintsUsedTotal} hint{hintsUsedTotal === 1 ? "" : "s"}
            </p>
          )}

          <div className="mt-8 flex gap-3 justify-center">
            <Button variant="ghost" onClick={() => router.back()}>
              Back to Book
            </Button>
            <Button onClick={() => router.push("/quizzes")}>
              More Quizzes
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Active Quiz ──
  const question = state.questions[state.currentIndex]
  const currentResult = state.results[state.currentIndex]
  // Derived from engine state so answers persist across arbitrary navigation
  // (grading is immediate, so an answered question always has a result here).
  const selectedAnswer = state.answers[state.currentIndex]
  const answered = currentResult !== null
  const progress = ((state.currentIndex + (answered ? 1 : 0)) / state.questions.length) * 100

  // Persistent per-question status for the navigator strip. "current" is
  // derived inside the navigator from currentIndex, so it isn't reported here.
  const getStatus = (index: number): QuestionStatus => {
    const r = state.results[index]
    if (r === "correct") return "correct"
    if (r === "wrong") return "incorrect"
    if (state.answers[index] != null) return "answered"
    return "unanswered"
  }

  return (
    <div className="relative mx-auto max-w-lg px-6 py-6 overflow-hidden">
      <Confetti ref={confettiRef} className="absolute inset-0 size-full pointer-events-none z-50" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-5" />
          </button>
          <div className="flex items-center gap-3">
            <div aria-live="polite" aria-label={`${state.hearts} hearts remaining`} className={cn("flex gap-0.5 transition-all", heartFlash && "animate-pulse")}>
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={heartFlash && i === state.hearts ? { scale: [1, 0.5, 0], opacity: [1, 0.5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Heart
                    className={cn(
                      "size-4 transition-colors",
                      i < state.hearts
                        ? "fill-[var(--tome-red)] text-[var(--tome-red)]"
                        : "text-muted-foreground/20"
                    )}
                  />
                </motion.div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {state.currentIndex + 1}/{state.questions.length}
            </span>
          </div>
        </div>

        {/* Progress Bar — Quiz owns the Quizzes / vermilion accent */}
        <div className="depth-track h-2 w-full mb-8" style={{ ["--accent" as string]: "var(--flame-streak)" }}>
          <motion.div
            className="depth-fill"
            style={{ ["--accent" as string]: "var(--flame-streak)" }}
            animate={{ width: `${progress}%` }}
            transition={springs.gentle}
          />
        </div>

        {/* Random-access question navigator — jump to any question in any order */}
        <QuestionNavigator
          count={state.questions.length}
          currentIndex={state.currentIndex}
          getStatus={getStatus}
          onSelect={goToQuestion}
        />

        {/* Question — stable focus target so jumps land here for SR/keyboard */}
        <div
          ref={stemRef}
          tabIndex={-1}
          role="group"
          aria-label={`Question ${state.currentIndex + 1} of ${state.questions.length}`}
          className="focus-visible:outline-none"
        >
          {/* Keyed (not AnimatePresence) so a jump mounts the target question
              synchronously — no exit-then-wait that can stall on random access. */}
          <motion.div
            key={state.currentIndex}
            initial={reduced ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={springs.interactive}
          >
            <p className="chip-accent mb-2 text-[10px] font-semibold uppercase tracking-wider" style={{ ["--accent" as string]: "var(--flame-streak)" }}>
              {QUESTION_TYPE_LABELS[question.type] ?? question.type.replace(/_/g, " ")}
            </p>

            {/* The page prints the prompt only for option-grid types; renderers
                that draw their own prompt/passage (fill_blank, passage_id,
                close_reading, vocabulary_in_context, reflection) own it. */}
            {!RENDERER_OWNS_PROMPT.has(question.type) && (
              <TextAnimate animation="fadeIn" by="word" className="text-lg font-medium leading-relaxed">
                {question.prompt}
              </TextAnimate>
            )}

            <div className="mt-6">
              {(() => {
                const Renderer = QUESTION_RENDERERS[question.type]
                // Distractor elimination: the revealed hint greys one distractor.
                const eliminatedOptions = hintRevealed
                  ? question.distractorEliminations?.slice(0, 1)
                  : []
                if (Renderer) {
                  return (
                    <Renderer
                      question={question}
                      answered={answered}
                      isCorrect={currentResult === "correct"}
                      isWrong={currentResult === "wrong"}
                      selectedAnswer={selectedAnswer}
                      onSubmit={handleAnswer}
                      reduced={reduced}
                      eliminatedOptions={eliminatedOptions}
                    />
                  )
                }
                // Fallback for any unmapped type — simple option grid.
                return (
                  <div className="grid grid-cols-1 gap-2">
                    {(question.options.length > 0 ? question.options : ["True", "False"]).map((opt, i) => {
                      const isCorrectOpt = opt.toLowerCase() === question.correct_answer.toLowerCase()
                      const isSelectedOpt = selectedAnswer === opt
                      const optResult = answered
                        ? isCorrectOpt ? "correct" : isSelectedOpt ? "wrong" : null
                        : null

                      return (
                        <OptionCard
                          key={i}
                          label={opt}
                          index={i}
                          selected={isSelectedOpt}
                          disabled={answered}
                          result={optResult}
                          onSelect={() => handleAnswer(opt)}
                        />
                      )
                    })}
                  </div>
                )
              })()}
            </div>

            {/* Hint affordance — a Virgil surface (iridescent). Pre-answer only. */}
            {!answered && hintConfig.enabled && (question.hints?.length ?? 0) > 0 && (
              <HintPanel
                hint={question.hints?.[0] ?? null}
                revealed={hintRevealed}
                onReveal={revealHint}
                unlocked={hintUnlocked}
                hintsRemaining={hintsRemaining}
                hintBudget={HINT_BUDGET}
                pointPenalty={hintConfig.penalty}
                reduced={reduced}
              />
            )}

            {/* Explanation with animated icon */}
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={springs.interactive}
                className={cn(
                  "mt-6 rounded-lg border p-4 flex gap-3",
                  currentResult === "correct"
                    ? "border-[var(--codex-success)]/30 bg-[var(--codex-success)]/5"
                    : "border-[var(--codex-danger)]/30 bg-[var(--codex-danger)]/5"
                )}
              >
                <div className="shrink-0 pt-0.5">
                  {currentResult === "correct" ? <AnimatedCheck /> : <AnimatedX />}
                </div>
                <div>
                  <p className={cn(
                    "text-xs font-semibold",
                    currentResult === "correct" ? "text-[var(--codex-success)]" : "text-[var(--codex-danger)]"
                  )}>
                    {currentResult === "correct" ? "Correct!" : "Incorrect"}
                    {currentResult === "correct" && (
                      <span className="ml-2 text-muted-foreground font-normal">+{wisdomForQuestion(question)} XP</span>
                    )}
                  </p>
                  {question.explanation && (
                    <p className="mt-1 text-xs text-muted-foreground">{question.explanation}</p>
                  )}
                </div>
              </motion.div>
            )}

            {answered && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
                <Button
                  onClick={handleNext}
                  className="codex-pressable w-full min-h-[48px] font-bold rounded-[var(--codex-radius-btn)]"
                  style={{ background: "var(--codex-primary)", color: "var(--codex-on-primary)", border: "var(--codex-border-w) solid var(--codex-primary)" }}
                >
                  {state.currentIndex === state.questions.length - 1 ? "See Results" : "Next Question"}
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ── Perfect Score Auto-Confetti ────────────────

function PerfectConfetti({ confettiRef }: { confettiRef: React.RefObject<ConfettiRef | null> }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      confettiRef.current?.fire({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#EAB308", "#F59E0B", "#6366F1", "#22C55E", "#EC4899"],
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [confettiRef])
  return null
}

// ── Option Card with animations ────────────────

function OptionCard({
  label,
  index,
  selected,
  disabled,
  result,
  onSelect,
}: {
  label: string
  index: number
  selected: boolean
  disabled: boolean
  result: "correct" | "wrong" | null
  onSelect: () => void
}) {
  const letters = ["A", "B", "C", "D"]

  return (
    <motion.button
      onClick={onSelect}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      animate={result === "wrong" && selected ? "shake" : undefined}
      variants={shakeVariants}
      transition={springs.interactive}
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition-all",
        result === "correct" && "border-[var(--codex-success)] bg-[var(--codex-success)]/5",
        result === "wrong" && selected && "border-[var(--codex-danger)] bg-[var(--codex-danger)]/5",
        !result && selected && "border-[var(--flame-streak)] bg-[color-mix(in_srgb,var(--flame-streak)_6%,transparent)]",
        !result && !selected && "border-border hover:border-[color-mix(in_srgb,var(--flame-streak)_45%,var(--border))] hover:-translate-y-px",
        disabled && !result && "opacity-50"
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-colors",
          result === "correct" && "bg-[var(--codex-success)] text-white",
          result === "wrong" && selected && "bg-[var(--codex-danger)] text-white",
          !result && selected && "bg-[var(--flame-streak)] text-white",
          !result && !selected && "bg-muted text-muted-foreground"
        )}
      >
        {result === "correct" ? <Check className="size-3.5" /> : result === "wrong" && selected ? <X className="size-3.5" /> : letters[index] ?? index + 1}
      </span>
      <span className="font-medium">{label}</span>
    </motion.button>
  )
}

// FreeTextInput was removed — fill_blank now routes through the shared
// FillBlank renderer in @/components/trials/questions, so the page no longer
// owns a bespoke text input.
