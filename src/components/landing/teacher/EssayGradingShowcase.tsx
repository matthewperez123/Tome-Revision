"use client"

import { motion } from "motion/react"
import { Sparkles, Check, AlertCircle } from "lucide-react"
import { useAnimationLoop } from "../useAnimationLoop"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 400 },
  { name: "essay", duration: 650 },
  { name: "generate", duration: 800 },
  { name: "results", duration: 1300 },
  { name: "reset", duration: 250 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const CRITERIA = [
  { name: "Thesis", score: 18, max: 20 },
  { name: "Evidence", score: 22, max: 25 },
  { name: "Structure", score: 17, max: 20 },
]

const STRENGTHS = [
  "Strong opening that establishes the thesis clearly",
  "Effective use of textual evidence throughout",
  "Original interpretive angle on the text",
]

const IMPROVEMENTS = [
  "Develop the analysis after each quotation more fully",
  "Strengthen transitions between paragraphs",
]

export function EssayGradingShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const showEssay = phase !== "idle"
  const showGenerate = phase === "generate"
  const showResults = phase === "results"

  if (isReduced) {
    return (
      <TeacherShowcaseShell heading="Grade essays with a scholar beside you" subcopy="The AI reads the draft, drafts a rubric-aligned score, writes targeted feedback, and flags passages worth a margin note. You approve, edit, or override." layout="mockup-left" bgClass="bg-background">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold">Grading Assistant</span>
            <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 text-[8px] text-indigo-600 dark:text-indigo-400">Preview — AI-assisted</span>
          </div>
          <p className="text-2xl font-bold">87 <span className="text-sm text-muted-foreground">/ 100</span></p>
          {CRITERIA.map(c => <div key={c.name} className="flex justify-between text-[9px] py-0.5"><span>{c.name}</span><span>{c.score}/{c.max}</span></div>)}
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell heading="Grade essays with a scholar beside you" subcopy="The AI reads the draft, drafts a rubric-aligned score, writes targeted feedback, and flags passages worth a margin note. You approve, edit, or override." layout="mockup-left" bgClass="bg-background">
      <div ref={containerRef} className="flex gap-3 min-h-[300px]" style={{ willChange: "transform" }}>
        {/* Left: Essay preview */}
        <motion.div animate={{ opacity: showEssay ? 1 : 0, y: showEssay ? 0 : 10 }} transition={{ duration: 0.5, ease: EASE }} className="flex-1 bg-card rounded-xl border border-border p-4 overflow-hidden" style={{ willChange: "transform, opacity" }}>
          <p className="text-[9px] font-semibold mb-1">Emma Chen</p>
          <p className="text-[8px] text-muted-foreground mb-2">378 words · Submitted Apr 10</p>
          <div className="space-y-2">
            {["In Homer's Odyssey, heroism undergoes a fundamental transformation...", "The most iconic demonstration of metis occurs in Book 9...", "The encounter with Circe presents a different facet..."].map((p, i) => (
              <p key={i} className="text-[8px] text-muted-foreground/70 leading-relaxed font-[var(--font-body)]">{p}</p>
            ))}
          </div>
        </motion.div>

        {/* Right: AI panel */}
        <motion.div animate={{ opacity: showEssay ? 1 : 0 }} transition={{ duration: 0.3 }} className="w-[180px] shrink-0 bg-card rounded-xl border border-border p-3 overflow-hidden" style={{ willChange: "opacity" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[9px] font-semibold">Grading Assistant</span>
          </div>
          <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-0.5 text-[7px] text-indigo-600 dark:text-indigo-400">Preview — AI-assisted</span>

          {!showResults && (
            <motion.div className="mt-4 text-center">
              {showGenerate ? (
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="size-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                  <span className="text-[8px] text-muted-foreground">Analyzing...</span>
                </div>
              ) : (
                <motion.button animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="mt-3 w-full rounded-md border border-indigo-500/30 px-2 py-1.5 text-[8px] text-indigo-600 dark:text-indigo-400" style={{ willChange: "transform" }}>
                  <Sparkles className="size-3 inline mr-1" />Generate
                </motion.button>
              )}
            </motion.div>
          )}

          {showResults && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE }} className="mt-3 space-y-2" style={{ willChange: "opacity" }}>
              <motion.p initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.4, ease: EASE }} className="text-xl font-bold text-center" style={{ willChange: "transform" }}>
                87 <span className="text-[10px] text-muted-foreground font-normal">/ 100</span>
              </motion.p>
              <div className="space-y-1">
                {CRITERIA.map((c, i) => (
                  <motion.div key={c.name} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, duration: 0.3, ease: EASE }} className="flex justify-between text-[8px]" style={{ willChange: "transform, opacity" }}>
                    <span>{c.name}</span>
                    <span className="font-medium">{c.score}/{c.max}</span>
                  </motion.div>
                ))}
              </div>
              <div className="border-t pt-1.5 mt-1.5">
                {STRENGTHS.slice(0, 2).map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-start gap-1 text-[7px] py-0.5" style={{ willChange: "opacity" }}>
                    <Check className="size-2.5 text-green-500 mt-px shrink-0" /><span>{s}</span>
                  </motion.div>
                ))}
                {IMPROVEMENTS.slice(0, 1).map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.1 }} className="flex items-start gap-1 text-[7px] py-0.5" style={{ willChange: "opacity" }}>
                    <AlertCircle className="size-2.5 text-amber-500 mt-px shrink-0" /><span>{s}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </TeacherShowcaseShell>
  )
}
