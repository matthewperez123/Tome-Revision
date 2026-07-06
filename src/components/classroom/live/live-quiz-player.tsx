"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Flame, Trophy, Loader2 } from "lucide-react"
import { useLiveQuiz } from "@/hooks/use-live-quiz"

// RUBRIC answer-zone palette (mirrors the host). Never iridescent — Virgil only.
const ZONE = [
  { bg: "#2A4B8D", hover: "#33579f" }, // lapis
  { bg: "#C8553D", hover: "#d5624a" }, // vermilion
  { bg: "#C8A24B", hover: "#d5b05a" }, // gold
  { bg: "#6C2D5C", hover: "#7d3a6c" }, // tyrian
  { bg: "#2E7D6F", hover: "#37917f" }, // verdigris
]
const SHAPES = ["▲", "◆", "●", "■", "★"]

export function LiveQuizPlayer({ sessionId }: { sessionId: string }) {
  const { view, myParticipant, myAnswer, join, submitAnswer, finalize } = useLiveQuiz(sessionId)
  const [joined, setJoined] = useState(false)
  const [streak, setStreak] = useState(0)
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; points: number } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [textAnswer, setTextAnswer] = useState("")
  const finalizedRef = useRef(false)

  const session = view?.session
  const question =
    view && session && session.current_question_index >= 0
      ? view.questions[session.current_question_index]
      : null

  // Join once the view has loaded (need to be a class member first).
  useEffect(() => {
    if (view && !joined) {
      void join().then(() => setJoined(true))
    }
  }, [view, joined, join])

  // Reset per-question local state when the host advances.
  useEffect(() => {
    setLastResult(null)
    setTextAnswer("")
  }, [session?.current_question_index])

  // Self-finalize through the authoritative record_trial_result path once ended.
  useEffect(() => {
    if (session?.status === "ended" && joined && !finalizedRef.current) {
      finalizedRef.current = true
      void finalize()
    }
  }, [session?.status, joined, finalize])

  if (!view || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F1420] text-white/60">
        <Loader2 className="mr-2 size-5 animate-spin" /> Entering the arena…
      </div>
    )
  }

  const handleSubmit = async (answer: string) => {
    if (submitting || myAnswer) return
    setSubmitting(true)
    const res = await submitAnswer(answer)
    setSubmitting(false)
    if (res) {
      setLastResult(res)
      setStreak((s) => (res.isCorrect ? s + 1 : 0))
    }
  }

  const hasZones = question?.options && question.options.length > 0

  return (
    <div className="flex min-h-screen flex-col bg-[#0F1420] text-white">
      {/* Streak + score chip */}
      {joined && (session.status === "question" || session.status === "reveal") && (
        <div className="flex items-center justify-between px-5 py-4">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-white/70">
            {streak > 1 && (
              <>
                <Flame className="size-4 text-[#C8553D]" />
                {streak} streak
              </>
            )}
          </span>
          <span className="font-mono text-sm font-bold tabular-nums text-[#C8A24B]">
            {myParticipant?.score ?? 0}
          </span>
        </div>
      )}

      {/* ── Lobby ─────────────────────────────────────────────── */}
      {session.status === "lobby" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
          <div className="size-16 animate-pulse rounded-full bg-[#C8A24B]/20" />
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">You're in!</h1>
            <p className="mt-2 text-white/60">Waiting for your teacher to begin…</p>
          </div>
          {myParticipant && (
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium">
              {myParticipant.display_name}
            </span>
          )}
        </div>
      )}

      {/* ── Question ──────────────────────────────────────────── */}
      {session.status === "question" && question && (
        <div className="flex flex-1 flex-col px-4 pb-6">
          {myAnswer ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <Check className="size-14 text-[#2E7D6F]" />
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">Locked in</h2>
              <p className="text-white/60">Hang tight for the reveal.</p>
            </div>
          ) : hasZones ? (
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              {question.options!.map((opt, i) => {
                const z = ZONE[i % ZONE.length]
                return (
                  <motion.button
                    key={i}
                    disabled={submitting}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => void handleSubmit(opt)}
                    className="flex items-center gap-3 rounded-2xl p-6 text-left text-lg font-bold disabled:opacity-60"
                    style={{ background: z.bg }}
                  >
                    <span className="text-3xl">{SHAPES[i % SHAPES.length]}</span>
                    <span className="flex-1">{opt}</span>
                  </motion.button>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              <input
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Type your answer…"
                className="w-full max-w-md rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-lg text-white placeholder:text-white/40 focus:border-[#C8A24B] focus:outline-none"
              />
              <button
                disabled={submitting || !textAnswer.trim()}
                onClick={() => void handleSubmit(textAnswer.trim())}
                className="rounded-xl bg-[#C8A24B] px-8 py-3 font-bold text-[#0F1420] disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Reveal ────────────────────────────────────────────── */}
      {session.status === "reveal" && question && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
          <AnimatePresence mode="wait">
            {myAnswer ? (
              <motion.div
                key="result"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                {myAnswer.is_correct ? (
                  <div className="flex size-20 items-center justify-center rounded-full bg-[#2E7D6F]">
                    <Check className="size-10" />
                  </div>
                ) : (
                  <div className="flex size-20 items-center justify-center rounded-full bg-[#C8553D]">
                    <X className="size-10" />
                  </div>
                )}
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold">
                  {myAnswer.is_correct ? "Correct!" : "Not quite"}
                </h2>
                {myAnswer.is_correct && (
                  <p className="font-mono text-lg font-bold text-[#C8A24B]">
                    +{myAnswer.points_awarded}
                  </p>
                )}
                {!myAnswer.is_correct && question.correct_answer && (
                  <p className="text-white/60">
                    Answer: <span className="font-semibold text-white">{question.correct_answer}</span>
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div key="noanswer" className="flex flex-col items-center gap-3">
                <X className="size-14 text-white/40" />
                <p className="text-white/60">Too slow this round.</p>
                {question.correct_answer && (
                  <p className="text-white/60">
                    Answer: <span className="font-semibold text-white">{question.correct_answer}</span>
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Ended ─────────────────────────────────────────────── */}
      {session.status === "ended" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
          <Trophy className="size-16 text-[#C8A24B]" />
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
              That's a wrap!
            </h1>
            <p className="mt-2 text-white/60">Your result is saved to your record.</p>
          </div>
          {myParticipant && (
            <div className="rounded-2xl bg-white/5 px-8 py-5">
              <p className="text-sm uppercase tracking-wide text-white/50">Final score</p>
              <p className="mt-1 font-mono text-4xl font-bold text-[#C8A24B]">
                {myParticipant.score}
              </p>
              <p className="mt-1 text-sm text-white/60">
                {myParticipant.correct_count} correct
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
