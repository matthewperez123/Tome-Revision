"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { RotateCcw, Sparkles } from "lucide-react"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"
import {
  QUESTION_TYPE_ICONS,
  QUESTION_TYPE_LABELS,
} from "@/components/trials/questions"
import type { QuestionType } from "@/lib/quiz-engine"
import { ClassicsCover } from "@/components/tome/ClassicsCover"
import { getBook } from "@/lib/content"

const BOOK = getBook("pride-and-prejudice")

const PASSAGE = {
  work: "Pride and Prejudice",
  locator: "Chapter 1",
  lines: [
    "It is a truth universally acknowledged, that a single man",
    "in possession of a good fortune, must be",
    "in want of a wife.",
  ],
}

// Each generated question is tagged with a real platform question type from
// the shared trial-renderer registry, so the educator demo showcases the
// variety Tome can author — not a single generic multiple-choice shape.
const QUESTIONS: { type: QuestionType; text: string }[] = [
  { type: "fill_blank", text: "Restore the opening: \u201cIt is a truth universally ___\u2026\u201d" },
  { type: "vocabulary_in_context", text: "What does \u201cwant\u201d mean as Austen uses it here?" },
  { type: "close_reading", text: "Which line tells us what the single man must be seeking?" },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function CustomTrialsShowcase() {
  const [generated, setGenerated] = useState(false)

  return (
    <TeacherShowcaseShell
      heading="Write your own Trials, or let Tome Assistant"
      subcopy="Author questions by hand or generate them from any passage with one click, across all thirteen question types."
      layout="mockup-left"
      bgClass="bg-background"
    >
      <div
        className="bg-card rounded-xl border border-border p-6 min-h-[380px]"
        aria-label="Interactive trial generation demonstration"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {BOOK && (
              <ClassicsCover
                bookId={BOOK.id}
                title={BOOK.title}
                author={BOOK.author}
                tradition={BOOK.tradition}
                fallbackColors={BOOK.coverColors}
                showTomeWordmark={false}
                hideBand
                className="w-5 shrink-0"
              />
            )}
            <p className="text-xs text-muted-foreground">
              Trial Generator &middot; {PASSAGE.work} &middot; {PASSAGE.locator}
            </p>
          </div>
          {generated && (
            <button
              type="button"
              onClick={() => setGenerated(false)}
              className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <RotateCcw className="size-3" />
              Reset
            </button>
          )}
        </div>

        {/* Passage */}
        <div className="font-serif text-sm text-foreground leading-[1.9] mb-4">
          {PASSAGE.lines.map((line, i) => (
            <p key={i}>
              <span
                className={`rounded px-0.5 transition-colors duration-300 ${
                  generated ? "bg-indigo-500/15" : ""
                }`}
              >
                {line}
              </span>
            </p>
          ))}
        </div>

        {/* Generate Trial button — always present, user-triggered */}
        <button
          type="button"
          onClick={() => setGenerated(true)}
          disabled={generated}
          className="mb-4 inline-flex items-center gap-1.5 bg-indigo-500 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Sparkles className="size-4" />
          {generated ? "Trial generated" : "Generate Trial"}
        </button>

        {/* Generated questions — revealed together, once */}
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {generated &&
              QUESTIONS.map(({ type, text }, i) => {
                const label = QUESTION_TYPE_LABELS[type]
                const Icon = QUESTION_TYPE_ICONS[type]
                return (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE, delay: i * 0.08 }}
                    className="border-l-2 border-[#D4AF37] bg-[#D4AF37]/5 rounded-r-lg p-3 text-xs text-foreground"
                  >
                    <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-[#D4AF37]/15 px-2 py-0.5 text-[10px] font-semibold text-[#8A6D1F]">
                      <Icon className="size-3" />
                      {label}
                    </span>
                    <p>{text}</p>
                  </motion.div>
                )
              })}
          </AnimatePresence>
          {!generated && (
            <p className="text-[11px] text-muted-foreground">
              Click Generate Trial to draft three typed questions from this passage.
            </p>
          )}
        </div>
      </div>
    </TeacherShowcaseShell>
  )
}
