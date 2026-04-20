"use client"

import { motion } from "motion/react"
import { Brain, Calendar, XCircle } from "lucide-react"
import { useAnimationLoop } from "../useAnimationLoop"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 600 },
  { name: "group", duration: 1200 },
  { name: "notes", duration: 1800 },
  { name: "quiz", duration: 2200 },
  { name: "reset", duration: 500 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const MEMBERS = [
  { initials: "EC", color: "#4F46E5" },
  { initials: "MW", color: "#0D9488" },
  { initials: "AP", color: "#7C3AED" },
  { initials: "LF", color: "#16A34A" },
]

const HARD_QUESTIONS = [
  { question: "What role does xenia play in Book 4?", rate: 25 },
  { question: "Compare Menelaus and Nestor as hosts", rate: 50 },
]

export function StudyGroupsShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const showGroup = phase !== "idle"
  const showNotes = phase === "notes" || phase === "quiz"
  const showQuiz = phase === "quiz"

  if (isReduced) {
    return (
      <TeacherShowcaseShell heading="Collaborative study, built in" subcopy="Students form groups around assignments and exams — shared notes, practice Trials, session schedules. You see every group at a glance." layout="mockup-left" bgClass="bg-background">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="size-4 text-indigo-500" />
            <span className="text-sm font-semibold">Odyssey Exam Prep</span>
          </div>
          <div className="flex -space-x-1 mb-3">
            {MEMBERS.map(m => <div key={m.initials} className="size-6 rounded-full border-2 border-background text-[7px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: m.color }}>{m.initials}</div>)}
          </div>
          {HARD_QUESTIONS.map(q => <div key={q.question} className="flex items-center gap-1 text-[8px] py-0.5"><XCircle className="size-2.5 text-amber-500" />{q.question} — {q.rate}%</div>)}
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell heading="Collaborative study, built in" subcopy="Students form groups around assignments and exams — shared notes, practice Trials, session schedules. You see every group at a glance." layout="mockup-left" bgClass="bg-background">
      <div ref={containerRef} className="bg-card rounded-xl border border-border p-5 min-h-[280px]" style={{ willChange: "transform" }}>
        <motion.div animate={{ opacity: showGroup ? 1 : 0, y: showGroup ? 0 : 10 }} transition={{ duration: 0.5, ease: EASE }} style={{ willChange: "transform, opacity" }}>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="size-4 text-indigo-500" />
            <span className="text-sm font-semibold">Odyssey Exam Prep</span>
            <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-0.5 text-[8px] text-indigo-600 dark:text-indigo-400 ml-auto">AP Lit</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex -space-x-1.5">
              {MEMBERS.map((m, i) => (
                <motion.div key={m.initials} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: showGroup ? 1 : 0, scale: showGroup ? 1 : 0.5 }} transition={{ delay: i * 0.08, duration: 0.3, ease: EASE }} className="size-7 rounded-full border-2 border-background text-[7px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: m.color, willChange: "transform, opacity" }}>
                  {m.initials}
                </motion.div>
              ))}
            </div>
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <Calendar className="size-3" />
              Next: Mon Apr 14, 4pm
            </div>
          </div>

          {/* Notes feed */}
          <motion.div animate={{ opacity: showNotes ? 1 : 0 }} transition={{ duration: 0.3 }} style={{ willChange: "opacity" }}>
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mb-1.5">Shared Notes</p>
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: showNotes ? 1 : 0, y: showNotes ? 0 : 5 }} transition={{ delay: 0.2, duration: 0.4, ease: EASE }} className="rounded-lg bg-muted/50 p-2.5 mb-3" style={{ willChange: "transform, opacity" }}>
              <p className="text-[8px] font-semibold">Key Themes for Exam</p>
              <p className="text-[7px] text-muted-foreground mt-0.5">1. Nostos (homecoming) 2. Xenia (guest-friendship) 3. Metis vs. Bie...</p>
            </motion.div>
          </motion.div>

          {/* Practice quiz results */}
          <motion.div animate={{ opacity: showQuiz ? 1 : 0 }} transition={{ duration: 0.3 }} style={{ willChange: "opacity" }}>
            <p className="text-[8px] text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1.5">Questions the Group Struggled With</p>
            {HARD_QUESTIONS.map((q, i) => (
              <motion.div key={q.question} initial={{ opacity: 0, x: -5 }} animate={{ opacity: showQuiz ? 1 : 0, x: showQuiz ? 0 : -5 }} transition={{ delay: i * 0.15, duration: 0.3, ease: EASE }} className="flex items-center gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/10 p-1.5 mb-1" style={{ willChange: "transform, opacity" }}>
                <XCircle className="size-3 text-amber-500 shrink-0" />
                <span className="text-[8px] flex-1">{q.question}</span>
                <span className="text-[8px] font-medium text-amber-600">{q.rate}%</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </TeacherShowcaseShell>
  )
}
