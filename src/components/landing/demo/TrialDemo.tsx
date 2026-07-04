"use client"

import { useState } from "react"
import { DemoFrame } from "@/components/demo/DemoFrame"
import { DemoEconomyProvider } from "@/components/demo/DemoEconomyProvider"
import { TeacherShowcaseShell } from "../teacher/TeacherShowcaseShell"
import { QuestionCard } from "@/components/trials/QuestionCard"
import { DEMO_TRIAL_QUESTIONS } from "@/lib/trials/demo-questions"
import { TRIAL_REGISTRY } from "@/lib/trials/registry"

/**
 * R3 — the Trial demo. Mounts the REAL <QuestionCard> + registry + the six
 * net-new typed questions, inside a DemoEconomyProvider sandbox.
 */
function TrialInner() {
  const [i, setI] = useState(0)
  const total = DEMO_TRIAL_QUESTIONS.length
  const question = DEMO_TRIAL_QUESTIONS[i]

  return (
    <>
      {/* Type switcher */}
      <div className="flex flex-wrap gap-1.5 mb-3" role="tablist" aria-label="Trial type">
        {DEMO_TRIAL_QUESTIONS.map((q, idx) => {
          const entry = TRIAL_REGISTRY[q.type]
          const Icon = entry.icon
          const activeTab = idx === i
          return (
            <button
              key={q.id}
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
    <TeacherShowcaseShell
      heading="Every chapter is a Trial."
      subcopy="Earn Wisdom by completing Trials at the end of each chapter \u2014 comprehension, vocabulary, critical thinking, and a Virgil-graded reflection. Keep your Flame alive with daily reading."
      layout="mockup-left"
      bgClass="bg-background"
    >
      <DemoEconomyProvider>
        <DemoFrame ariaLabel="Interactive Trial demonstration" hint="Answer it">
          <TrialInner />
        </DemoFrame>
      </DemoEconomyProvider>
    </TeacherShowcaseShell>
  )
}
