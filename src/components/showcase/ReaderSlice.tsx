"use client"

/**
 * ReaderSlice — the Macbeth vertical slice orchestrator.
 *
 * The golden thread from the plan (§16), each beat a component:
 *
 *   home → portal → passage → virgil → trial → crescendo → stoa
 *
 * Progress persists in the showcase store, so Reset, reloads, and role
 * switches all behave. Gating is honest: "Ask Virgil" needs a highlight,
 * the crescendo and the Stoa need a completed Trial — locked steps are
 * disabled with the reason, never dead buttons. Every step is replayable.
 */

import { useState } from "react"
import Link from "next/link"
import type { CompletionSummary } from "@/lib/trials/engine"
import { TrialPlayer } from "@/components/trials/session/TrialPlayer"
import { StoaNiche } from "@/components/stoa"
import { getStoaReward } from "@/lib/stoa/rewards"
import { useStoaState } from "@/lib/stoa/state"
import { useShowcaseState } from "@/lib/showcase/store"
import {
  outcomeFromSummary,
  SEEDED_FLAME_TODAY,
  SHOWCASE_SEED,
  SLICE_STEPS,
  SLICE_STEP_LABELS,
  type SessionOutcome,
  type SliceStep,
} from "@/lib/showcase/session"
import { MACBETH_TRIAL_ITEMS, MACBETH_TRIAL_INSTRUCTION, MACBETH_TRIAL_TITLE } from "@/lib/showcase/macbeth-trials"
import { SliceHome } from "./SliceHome"
import { PortalScene } from "./PortalScene"
import { PassageReader } from "./PassageReader"
import { VirgilAsk } from "./VirgilAsk"
import { RewardCrescendo } from "./RewardCrescendo"

function stepAllowed(step: SliceStep, hasHighlight: boolean, trialComplete: boolean): string | null {
  if (step === "virgil" && !hasHighlight) return "Highlight a line in the passage first"
  if ((step === "crescendo" || step === "stoa") && !trialComplete) return "Complete the Trial first"
  return null
}

export function ReaderSlice({ role }: { role: "reader" | "student" }) {
  const { sliceStep, highlightedQuote, highlightedParagraphId, trialComplete, trialOutcome, update } =
    useShowcaseState()
  const stoa = useStoaState()
  const [liveOutcome, setLiveOutcome] = useState<SessionOutcome | null>(null)
  const [stoaDetailOpen, setStoaDetailOpen] = useState(false)

  // Prefer this session's live outcome; fall back to the persisted one so
  // the crescendo replays identically after a reload.
  const outcome = liveOutcome ?? trialOutcome

  const hasHighlight = highlightedQuote !== null

  // Keep the displayed step honest after a reset or partial reload: derive
  // the correction during render (no effect) and let the next navigation
  // persist a valid step.
  const activeStep: SliceStep = stepAllowed(sliceStep, hasHighlight, trialComplete)
    ? hasHighlight
      ? "virgil"
      : "passage"
    : sliceStep

  const go = (step: SliceStep) => update({ sliceStep: step })

  const handleTrialComplete = (s: CompletionSummary) => {
    const o = outcomeFromSummary(s)
    setLiveOutcome(o)
    update({ trialComplete: true, trialOutcome: o, sliceStep: "crescendo" })
  }

  const reward = getStoaReward("macbeth")
  const restored = stoa.isRestored("macbeth")

  return (
    <div data-tour="slice-stage">
      {/* golden-thread step rail */}
      <nav aria-label="Showcase path" className="mb-5">
        <ol className="flex flex-wrap items-center gap-1">
          {SLICE_STEPS.map((step, i) => {
            const lockedReason = stepAllowed(step, hasHighlight, trialComplete)
            const current = step === activeStep
            return (
              <li key={step} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden className="text-[var(--la-ink-faint)]">→</span>}
                <button
                  type="button"
                  disabled={lockedReason !== null}
                  title={lockedReason ?? SLICE_STEP_LABELS[step]}
                  aria-current={current ? "step" : undefined}
                  onClick={() => go(step)}
                  className={`rounded-full px-2.5 py-1 font-sans text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[var(--la-focus)] ${
                    current
                      ? "bg-[var(--la-wisdom)] text-[var(--la-wisdom-ink)]"
                      : lockedReason
                        ? "cursor-not-allowed text-[var(--la-ink-faint)] opacity-60"
                        : "text-[var(--la-ink-muted)] hover:bg-[var(--la-surface-sunken)]"
                  }`}
                >
                  {i + 1}. {SLICE_STEP_LABELS[step]}
                </button>
              </li>
            )
          })}
        </ol>
      </nav>

      {activeStep === "home" && <SliceHome role={role} onOpenBook={() => go("portal")} />}
      {activeStep === "portal" && <PortalScene onEnter={() => go("passage")} />}
      {activeStep === "passage" && (
        <PassageReader
          highlightedQuote={highlightedQuote}
          highlightedParagraphId={highlightedParagraphId}
          onHighlight={(quote, paragraphId) =>
            update({ highlightedQuote: quote, highlightedParagraphId: paragraphId })
          }
          onAskVirgil={() => go("virgil")}
        />
      )}
      {activeStep === "virgil" && highlightedQuote && (
        <VirgilAsk
          highlightedQuote={highlightedQuote}
          onBeginTrial={() => go("trial")}
          onBackToPassage={() => go("passage")}
        />
      )}
      {activeStep === "trial" && (
        <section aria-label="The Trial">
          <TrialPlayer
            items={MACBETH_TRIAL_ITEMS}
            seed={SHOWCASE_SEED}
            title={MACBETH_TRIAL_TITLE}
            instruction={MACBETH_TRIAL_INSTRUCTION}
            virgilVariant="macbeth"
            onComplete={handleTrialComplete}
          />
        </section>
      )}
      {activeStep === "crescendo" && (
        <RewardCrescendo
          outcome={outcome}
          onEnterStoa={() => go("stoa")}
        />
      )}
      {activeStep === "stoa" && reward && (
        <section aria-label="The Stoa" className="mx-auto max-w-2xl">
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--la-wisdom-deep)]">
            The courtyard remembers
          </p>
          <h2 className="mt-1 text-center font-serif text-2xl text-[var(--la-ink)]">
            Your Stoa — {SEEDED_FLAME_TODAY}
          </h2>
          <p className="mt-1 text-center font-sans text-sm text-[var(--la-ink-muted)]">
            The painting you just restored hangs with its provenance. This state
            persists — open{" "}
            <Link
              href="/stoa"
              className="font-semibold text-[var(--la-primary)] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-[var(--la-focus)]"
            >
              the full Stoa gallery
            </Link>{" "}
            to see it in the courtyard.
          </p>

          <div className="mt-6 flex justify-center">
            <StoaNiche reward={reward} restored={restored} onOpen={() => setStoaDetailOpen(true)} />
          </div>

          {stoaDetailOpen && (
            <div
              role="dialog"
              aria-label={`${reward.title} — provenance and source`}
              className="mt-6 rounded-xl border border-[var(--la-wisdom)] bg-[var(--la-page)] p-5"
            >
              <h3 className="font-serif text-xl text-[var(--la-ink)]">{reward.title}</h3>
              <p className="mt-1 font-sans text-sm text-[var(--la-ink-muted)]">{reward.description}</p>
              <blockquote className="mt-4 border-l-2 border-[var(--la-wisdom)] pl-4 font-serif text-sm italic leading-relaxed text-[var(--la-ink)]">
                {reward.passage.text.split("\n").map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </blockquote>
              <p className="mt-1 font-sans text-xs text-[var(--la-ink-faint)]">— {reward.passage.citation}</p>
              <dl className="mt-4 space-y-1.5 font-sans text-xs text-[var(--la-ink-muted)]">
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 font-semibold text-[var(--la-ink)]">Provenance</dt>
                  <dd>{reward.provenanceLabel} · restored from {reward.bookTitle} by passing the Trial</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 font-semibold text-[var(--la-ink)]">Seal</dt>
                  <dd>{reward.sealName}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 font-semibold text-[var(--la-ink)]">License</dt>
                  <dd>{reward.provenanceNote}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => setStoaDetailOpen(false)}
                className="mt-4 rounded-full border border-[var(--la-surface-sunken)] px-4 py-1.5 font-sans text-xs font-semibold text-[var(--la-ink-muted)] hover:bg-[var(--la-surface-sunken)] focus-visible:outline-2 focus-visible:outline-[var(--la-focus)]"
              >
                Close provenance
              </button>
            </div>
          )}

          <p className="mt-6 text-center font-serif text-sm italic text-[var(--la-ink-muted)]">
            “{reward.virgilLine}”
          </p>
        </section>
      )}
    </div>
  )
}
