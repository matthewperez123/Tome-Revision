"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Eye, ChevronRight, Trophy, Users, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLiveQuiz, type LiveParticipant } from "@/hooks/use-live-quiz"
import {
  startLiveQuiz,
  revealLiveQuiz,
  advanceLiveQuiz,
  endLiveQuiz,
} from "@/lib/actions/live-quiz"

// RUBRIC answer-zone palette (never iridescent — that's reserved for Virgil).
const ZONE = [
  { bg: "#2A4B8D", label: "lapis" }, // lapis
  { bg: "#C8553D", label: "vermilion" }, // vermilion
  { bg: "#C8A24B", label: "gold" }, // gold
  { bg: "#6C2D5C", label: "tyrian" }, // tyrian
  { bg: "#2E7D6F", label: "verdigris" }, // verdigris (5th+)
]
const SHAPES = ["▲", "◆", "●", "■", "★"]

// Points decay from 1000 → 100 over ~18s; a 20s ring gives urgency headroom.
const RING_SECONDS = 20

function useElapsed(startedAt: string | null): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!startedAt) return
    const t = setInterval(() => setNow(Date.now()), 100)
    return () => clearInterval(t)
  }, [startedAt])
  if (!startedAt) return 0
  return Math.max(0, (now - new Date(startedAt).getTime()) / 1000)
}

function CountdownRing({ startedAt }: { startedAt: string | null }) {
  const elapsed = useElapsed(startedAt)
  const remaining = Math.max(0, RING_SECONDS - elapsed)
  const frac = remaining / RING_SECONDS
  const R = 54
  const C = 2 * Math.PI * R
  const color = frac > 0.5 ? "#2E7D6F" : frac > 0.2 ? "#C8A24B" : "#C8553D"
  return (
    <div className="relative flex size-32 items-center justify-center">
      <svg className="size-32 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - frac)}
          style={{ transition: "stroke-dashoffset 0.1s linear, stroke 0.4s" }}
        />
      </svg>
      <span className="absolute font-mono text-3xl font-bold tabular-nums text-white">
        {Math.ceil(remaining)}
      </span>
    </div>
  )
}

function Leaderboard({ participants }: { participants: LiveParticipant[] }) {
  const top = participants.slice(0, 8)
  const max = Math.max(1, ...top.map((p) => p.score))
  return (
    <div className="space-y-2">
      <AnimatePresence>
        {top.map((p, i) => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="flex items-center gap-3"
          >
            <span className="w-6 shrink-0 text-right font-mono text-sm text-white/50">{i + 1}</span>
            <div className="relative h-11 flex-1 overflow-hidden rounded-lg bg-white/5">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-lg"
                style={{ background: i === 0 ? "#C8A24B" : "rgba(42,75,141,0.55)" }}
                initial={{ width: 0 }}
                animate={{ width: `${(p.score / max) * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 22 }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <span className="flex items-center gap-2 truncate text-sm font-semibold text-white">
                  {i === 0 && <Crown className="size-4 text-white" />}
                  {p.display_name}
                </span>
                <span className="font-mono text-sm font-bold tabular-nums text-white">{p.score}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function LiveQuizHost({ sessionId }: { sessionId: string }) {
  const { view, participants, answers, myParticipant: _mine } = useLiveQuiz(sessionId)
  const [pending, start] = useTransition()

  const session = view?.session
  const question =
    view && session && session.current_question_index >= 0
      ? view.questions[session.current_question_index]
      : null

  // Answer tally for the current question (used during question + reveal).
  const tally = useMemo(() => {
    if (!question || !session) return {} as Record<string, number>
    const counts: Record<string, number> = {}
    for (const a of answers) {
      if (a.question_index !== session.current_question_index) continue
      const key = a.answer ?? ""
      counts[key] = (counts[key] ?? 0) + 1
    }
    return counts
  }, [answers, question, session])

  const answeredCount = useMemo(() => {
    if (!session) return 0
    return answers.filter((a) => a.question_index === session.current_question_index).length
  }, [answers, session])

  if (!view || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F1420] text-white/60">
        Loading the arena…
      </div>
    )
  }

  const zonesFor = (q: NonNullable<typeof question>) =>
    q.options && q.options.length > 0 ? q.options : null

  return (
    <div className="flex min-h-screen flex-col bg-[#0F1420] text-white">
      {/* ── Lobby ─────────────────────────────────────────────── */}
      {session.status === "lobby" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-10 text-center">
          <div>
            <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.3em] text-[#C8A24B]">
              Live Trial
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-5xl font-bold">
              The Amphitheater
            </h1>
            <p className="mt-3 text-white/60">
              Students join from the class page. {session.total_questions} questions ahead.
            </p>
          </div>

          <div className="flex items-center gap-2 text-white/70">
            <Users className="size-5" />
            <span className="text-2xl font-bold tabular-nums">{participants.length}</span>
            <span>in the arena</span>
          </div>

          <div className="flex max-w-2xl flex-wrap justify-center gap-2">
            <AnimatePresence>
              {participants.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium"
                >
                  {p.display_name}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          <Button
            size="lg"
            disabled={pending || participants.length === 0}
            onClick={() => start(async () => void (await startLiveQuiz(sessionId)))}
            className="gap-2 bg-[#C8A24B] px-10 py-6 text-lg font-bold text-[#0F1420] hover:bg-[#d8b563]"
          >
            <Play className="size-5" /> Begin
          </Button>
        </div>
      )}

      {/* ── Question / Reveal ─────────────────────────────────── */}
      {(session.status === "question" || session.status === "reveal") && question && (
        <div className="flex flex-1 flex-col px-6 py-8">
          <div className="mb-6 flex items-center justify-between">
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold">
              Question {session.current_question_index + 1} / {session.total_questions}
            </span>
            {session.status === "question" ? (
              <div className="flex items-center gap-2 text-white/60">
                <Users className="size-5" />
                <span className="text-xl font-bold tabular-nums">{answeredCount}</span>
                <span className="text-sm">answered</span>
              </div>
            ) : (
              <span className="rounded-full bg-[#C8A24B]/20 px-4 py-1.5 text-sm font-semibold text-[#C8A24B]">
                Revealed
              </span>
            )}
          </div>

          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-8">
            <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold leading-tight md:text-4xl">
              {question.question_text}
            </h2>

            {session.status === "question" && <CountdownRing startedAt={session.question_started_at} />}

            {zonesFor(question) ? (
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                {zonesFor(question)!.map((opt, i) => {
                  const z = ZONE[i % ZONE.length]
                  const isCorrect = session.status === "reveal" && question.correct_answer === opt
                  const dimmed = session.status === "reveal" && !isCorrect
                  const count = tally[opt] ?? 0
                  return (
                    <motion.div
                      key={i}
                      layout
                      animate={{ opacity: dimmed ? 0.35 : 1, scale: isCorrect ? 1.02 : 1 }}
                      className="relative overflow-hidden rounded-2xl p-5 text-left"
                      style={{
                        background: z.bg,
                        outline: isCorrect ? "4px solid #fff" : "none",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{SHAPES[i % SHAPES.length]}</span>
                        <span className="flex-1 text-lg font-semibold">{opt}</span>
                        {session.status === "reveal" && (
                          <span className="rounded-full bg-black/25 px-2.5 py-0.5 text-sm font-bold tabular-nums">
                            {count}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="w-full max-w-xl text-center">
                {session.status === "reveal" ? (
                  <div className="rounded-2xl border border-[#C8A24B]/40 bg-[#C8A24B]/10 p-6">
                    <p className="text-sm uppercase tracking-wide text-[#C8A24B]">Answer</p>
                    <p className="mt-2 text-2xl font-bold">{question.correct_answer ?? "—"}</p>
                  </div>
                ) : (
                  <p className="text-white/50">Students are typing their answers…</p>
                )}
              </div>
            )}
          </div>

          <div className="mx-auto mt-8 flex w-full max-w-4xl justify-end gap-3">
            <Button variant="ghost" onClick={() => void endLiveQuiz(sessionId)} className="text-white/60 hover:text-white">
              End game
            </Button>
            {session.status === "question" ? (
              <Button
                onClick={() => void revealLiveQuiz(sessionId)}
                className="gap-2 bg-white px-8 font-bold text-[#0F1420] hover:bg-white/90"
              >
                <Eye className="size-4" /> Reveal
              </Button>
            ) : (
              <Button
                onClick={() => void advanceLiveQuiz(sessionId)}
                className="gap-2 bg-[#C8A24B] px-8 font-bold text-[#0F1420] hover:bg-[#d8b563]"
              >
                {session.current_question_index + 1 >= session.total_questions ? "Finish" : "Next"}
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>

          {/* Live leaderboard rail during reveal */}
          {session.status === "reveal" && participants.length > 0 && (
            <div className="mx-auto mt-8 w-full max-w-4xl">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/50">
                <Trophy className="size-4 text-[#C8A24B]" /> Standings
              </p>
              <Leaderboard participants={participants} />
            </div>
          )}
        </div>
      )}

      {/* ── Ended (podium) ────────────────────────────────────── */}
      {session.status === "ended" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-10">
          <div className="text-center">
            <Trophy className="mx-auto size-14 text-[#C8A24B]" />
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold">Final Standings</h1>
          </div>
          <div className="w-full max-w-2xl">
            <Leaderboard participants={participants} />
          </div>
        </div>
      )}
    </div>
  )
}
