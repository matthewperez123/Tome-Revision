"use client"

import { useState } from "react"
import { DemoFrame } from "@/components/demo/DemoFrame"
import { DemoEconomyProvider } from "@/components/demo/DemoEconomyProvider"
import { TeacherShowcaseShell } from "../teacher/TeacherShowcaseShell"
import { QuestionCard } from "@/components/trials/QuestionCard"
import { DEMO_TRIAL_QUESTIONS } from "@/lib/trials/demo-questions"
import { TRIAL_REGISTRY } from "@/lib/trials/registry"

import { PlatformQuestionDemoInner } from "./PlatformQuestionDemo"

/**
 * [3.7] The Trial demo, two movements:
 * 1. The THIRTEEN platform question types, live — the real renderers +
 *    deterministic grader the reader's chapter Trials run on.
 * 2. "For verse and drama" — the six line-level Trial types (Hamlet and the
 *    epics), mounted through the REAL <QuestionCard> + registry inside a
 *    DemoEconomyProvider sandbox.
 */
const DEMO_TYPES = Array.from(new Set(DEMO_TRIAL_QUESTIONS.map((q) => q.type)))

function TrialInner() {
  const [i, setI] = useState(0)
  const total = DEMO_TRIAL_QUESTIONS.length
  const question = DEMO_TRIAL_QUESTIONS[i]

  return (
    <>
      {/* Type switcher — one chip per type; the pool holds several questions
          of each, and "Next" walks through all of them. */}
      <div className="flex flex-wrap gap-1.5 mb-3" role="tablist" aria-label="Trial type">
        {DEMO_TYPES.map((type) => {
          const entry = TRIAL_REGISTRY[type]
          const Icon = entry.icon
          const activeTab = question.type === type
          const idx = DEMO_TRIAL_QUESTIONS.findIndex((q) => q.type === type)
          return (
            <button
              key={type}
              type="button"
              role="tab"
              aria-selected={activeTab}
              onClick={() => setI(idx)}
              style={{ borderRadius: "var(--codex-radius-btn)" }}
              className={`flex items-center gap-1.5 border-2 px-2.5 py-1 text-[11px] font-sans font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                activeTab
                  ? "border-[var(--codex-primary)] bg-[var(--codex-primary-soft)] text-[var(--codex-primary-text)]"
                  : "border-border bg-card text-muted-foreground hover:border-[var(--codex-primary)]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {entry.label}
            </button>
          )
        })}
      </div>

      {/* The real QuestionCard, in a fixed-height stage */}
      <div className="rounded-lg border border-border bg-card overflow-hidden h-[440px]">
        <QuestionCard
          key={question.id}
          question={question}
          onNext={() => setI((n) => (n + 1) % total)}
          sound={false}
        />
      </div>
    </>
  )
}

export function TrialDemo() {
  return (
    <>
      <TeacherShowcaseShell
        heading="Thirteen ways to be asked. Every one is live."
        subcopy="Every chapter ends in a Trial built from thirteen question types — comprehension, close reading, matching, ordering, cross-reference, and a Tome Assistant-graded reflection. These are the real renderers and the real grader; try each one."
        layout="mockup-left"
        bgClass="bg-background"
      >
        <PlatformQuestionDemoInner />
      </TeacherShowcaseShell>

      <TeacherShowcaseShell
        heading="For verse and drama"
        subcopy="Poetry and plays get their own six Trial types — restore the line, find the evidence, scan the meter — built for Hamlet, the epics, and everything written in lines rather than paragraphs."
        layout="mockup-left"
        bgClass="bg-muted/30"
      >
        <DemoEconomyProvider>
          <DemoFrame ariaLabel="Interactive verse and drama Trial demonstration" hint="Answer it">
            <TrialInner />
          </DemoFrame>
        </DemoEconomyProvider>
      </TeacherShowcaseShell>
    </>
  )
}
