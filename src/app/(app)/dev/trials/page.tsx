"use client"

/**
 * Dev-only Trial harness — runs the six net-new typed question types through
 * the real <QuestionCard> + registry + economy provider (provided by the (app)
 * AppShell). Each question is a validated demo from lib/trials/demo-questions.
 *
 * Use it to verify end-to-end that every type renders, grades a response, shows
 * the feedback bar + explanation, and awards Wisdom through the existing economy
 * entry point. The live Wisdom total below ticks up on each correct grade.
 */
import { useState } from "react"
import { QuestionCard } from "@/components/trials/QuestionCard"
import { DEMO_TRIAL_QUESTIONS } from "@/lib/trials/demo-questions"
import { TRIAL_REGISTRY } from "@/lib/trials/registry"
import { useEconomy } from "@/components/tome/economy-provider"
import { WisdomStar } from "@/components/trials/sigils/WisdomStar"

export default function DevTrials() {
  const { stats } = useEconomy()
  const [i, setI] = useState(0)
  const [results, setResults] = useState<(boolean | null)[]>(
    () => DEMO_TRIAL_QUESTIONS.map(() => null)
  )

  const total = DEMO_TRIAL_QUESTIONS.length
  const question = DEMO_TRIAL_QUESTIONS[i]

  const onGraded = (isCorrect: boolean) =>
    setResults((prev) => prev.map((r, idx) => (idx === i ? isCorrect : r)))

  const onNext = () => setI((n) => (n + 1) % total)

  return (
    <div className="flex flex-col h-[100dvh]">
      {/* Harness header — type switcher + live Wisdom readout */}
      <div className="shrink-0 border-b border-border bg-card">
        <div className="max-w-[640px] mx-auto px-4 py-3 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-lg font-semibold text-ink">
                Trial Types — Dev Harness
              </h1>
              <p className="text-xs text-muted-foreground font-sans">
                Six net-new types through the real QuestionCard.
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <WisdomStar size={18} />
              <span className="font-sans font-bold tabular-nums text-ink">
                {stats.xp_total}
              </span>
              <span className="text-xs text-muted-foreground font-sans">
                Wisdom
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {DEMO_TRIAL_QUESTIONS.map((q, idx) => {
              const entry = TRIAL_REGISTRY[q.type]
              const Icon = entry.icon
              const r = results[idx]
              const active = idx === i
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setI(idx)}
                  style={{ borderRadius: "var(--codex-radius-btn)" }}
                  className={`flex items-center gap-1.5 border-2 px-2.5 py-1 text-xs font-sans font-semibold transition-colors ${
                    active
                      ? "border-[var(--codex-primary)] bg-[var(--codex-primary-soft)] text-[var(--codex-primary-text)]"
                      : "border-border bg-card text-muted-foreground hover:border-[var(--codex-primary)]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {entry.label}
                  {r === true && (
                    <span style={{ color: "var(--codex-success)" }}>✓</span>
                  )}
                  {r === false && (
                    <span style={{ color: "var(--codex-danger)" }}>✗</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* The card itself — remounts per question so its internal state resets. */}
      <div className="flex-1 min-h-0">
        <QuestionCard
          key={question.id}
          question={question}
          index={i + 1}
          total={total}
          onGraded={onGraded}
          onNext={onNext}
          sound
        />
      </div>
    </div>
  )
}
