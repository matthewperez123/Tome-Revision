"use client"

/**
 * VirgilAsk — beat 5: Virgil answers a passage-grounded question.
 *
 * The exchange is prepared and FIXED (src/lib/showcase/virgil-answer.ts):
 * the same question, the same four answer beats, the same paragraph
 * citations, on every run. The reveal is simulated streaming — words land
 * on a fixed cadence through thinking → retrieving → answering phases —
 * so it reads like a live tutor without any model call. Reduced motion:
 * the full answer appears at once. Citation chips scroll the reference
 * passage to the cited paragraph and flash it.
 */

import { useEffect, useMemo, useRef, useState } from "react"
import { Virgil, useVirgilMachine } from "@/components/virgil"
import { useReducedMotionSafe } from "@/lib/design/motion"
import { MACBETH_EXCHANGE } from "@/lib/showcase/virgil-answer"
import { MACBETH_PASSAGE } from "@/lib/showcase/macbeth-passage"

type Phase = "thinking" | "retrieving" | "answering" | "done"

const WORD_MS = 42
const THINK_MS = 750
const RETRIEVE_MS = 950

export function VirgilAsk({
  highlightedQuote,
  onBeginTrial,
  onBackToPassage,
}: {
  highlightedQuote: string
  onBeginTrial: () => void
  onBackToPassage: () => void
}) {
  const reduced = useReducedMotionSafe()
  const machine = useVirgilMachine("idle")
  const [phase, setPhase] = useState<Phase>(reduced ? "done" : "thinking")
  const [wordsShown, setWordsShown] = useState(0)
  const [flashedPid, setFlashedPid] = useState<string | null>(null)
  const passageRef = useRef<HTMLDivElement | null>(null)

  // Flatten answer beats → words with segment boundaries (stable order).
  const words = useMemo(
    () => MACBETH_EXCHANGE.segments.map((s) => s.text.split(/\s+/).filter(Boolean)),
    [],
  )
  const totalWords = useMemo(() => words.reduce((n, w) => n + w.length, 0), [words])
  // Reduced motion: the answer is complete from the first paint (derived,
  // not set in an effect).
  const revealed = reduced ? totalWords : wordsShown

  // Drive phases + the deterministic typed-token reveal.
  useEffect(() => {
    if (reduced) {
      machine.dispatch({ type: "ASK_STREAMING", phase: "answering" })
      machine.dispatch({ type: "EXPLAIN" })
      return
    }
    machine.dispatch({ type: "ASK_STREAMING", phase: "thinking" })
    let streamTimer = 0
    const t1 = window.setTimeout(() => {
      setPhase("retrieving")
      machine.dispatch({ type: "ASK_STREAMING", phase: "retrieving" })
    }, THINK_MS)
    const t2 = window.setTimeout(() => {
      setPhase("answering")
      machine.dispatch({ type: "ASK_STREAMING", phase: "answering" })
      machine.dispatch({ type: "EXPLAIN" })
      let count = 0
      streamTimer = window.setInterval(() => {
        count += 1
        setWordsShown(count)
        if (count >= totalWords) {
          window.clearInterval(streamTimer)
          setPhase("done")
          machine.dispatch({ type: "ACKNOWLEDGE" })
        }
      }, WORD_MS)
    }, THINK_MS + RETRIEVE_MS)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      if (streamTimer) window.clearInterval(streamTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, totalWords])

  const jumpToParagraph = (pid: string) => {
    const el = passageRef.current?.querySelector(`[data-pid="${pid}"]`)
    el?.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" })
    setFlashedPid(pid)
    machine.dispatch({ type: "CITE_PARAGRAPH", paragraphId: pid })
    window.setTimeout(() => setFlashedPid(null), 1600)
  }

  // Render revealed text: cumulative word offsets, no mutation (pure).
  const rendered = useMemo(() => {
    const starts: number[] = []
    let acc = 0
    for (const seg of MACBETH_EXCHANGE.segments) {
      starts.push(acc)
      acc += seg.text.split(/\s+/).filter(Boolean).length
    }
    return MACBETH_EXCHANGE.segments.map((seg, i) => {
      const segWords = seg.text.split(/\s+/).filter(Boolean)
      const start = starts[i] ?? 0
      const take = Math.max(0, Math.min(segWords.length, revealed - start))
      return { seg, text: segWords.slice(0, take).join(" "), complete: take === segWords.length }
    })
  }, [revealed])

  return (
    <section aria-label="Ask Virgil" className="grid gap-5 @lg:grid-cols-2">
      {/* reference passage with citation targets */}
      <div
        ref={passageRef}
        aria-label="Passage reference — Act I, Scene VII"
        className="max-h-[520px] space-y-3 overflow-y-auto rounded-xl border border-[var(--la-surface-sunken)] bg-[var(--la-page)] p-4"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--la-ink-faint)]">
          Reference · {MACBETH_PASSAGE.citation}
        </p>
        {MACBETH_PASSAGE.paragraphs.filter((p) => p.kind !== "stage").map((p) => (
          <div
            key={p.id}
            data-pid={p.id}
            className={`rounded-lg p-2 transition-colors duration-500 ${
              flashedPid === p.id ? "bg-[var(--la-wisdom-soft)]" : ""
            }`}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--la-wisdom-deep)]">
              {p.id.replace("mac-1-7-", "¶")}
            </p>
            {p.lines.map((line, li) => (
              <p
                key={`${p.id}-${li}`}
                className="mt-1 whitespace-pre-line font-serif text-[13px] leading-relaxed text-[var(--la-ink)]"
              >
                {line.speaker && (
                  <span className="mr-1.5 font-sans text-[10px] font-semibold uppercase tracking-wide text-[var(--la-ink-faint)]">
                    {line.speaker}
                  </span>
                )}
                {line.text}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* the exchange */}
      <div className="rounded-xl border border-[var(--la-surface-sunken)] bg-[var(--la-surface)] p-5">
        <div className="flex items-start gap-4">
          <Virgil
            state={machine.state}
            announcement={machine.announcement}
            variant="macbeth"
            size={84}
            bust
            className="shrink-0"
          />
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--la-wisdom-deep)]">
              Your question, from your highlight
            </p>
            <p className="mt-1 font-sans text-sm font-semibold leading-snug text-[var(--la-ink)]">
              {MACBETH_EXCHANGE.question}
            </p>
            <p className="mt-1 truncate font-serif text-xs italic text-[var(--la-ink-faint)]">
              “{highlightedQuote}”
            </p>
          </div>
        </div>

        <div aria-live="polite" className="mt-4 min-h-40">
          {phase === "thinking" && (
            <p className="font-sans text-sm text-[var(--la-ink-muted)]">{MACBETH_EXCHANGE.phases.thinking}</p>
          )}
          {phase === "retrieving" && (
            <p className="font-sans text-sm text-[var(--la-ink-muted)]">{MACBETH_EXCHANGE.phases.retrieving}</p>
          )}
          {(phase === "answering" || phase === "done") && (
            <div className="space-y-3">
              {rendered.map(({ seg, text, complete }, i) =>
                text ? (
                  <div key={i}>
                    <p className="font-sans text-sm leading-relaxed text-[var(--la-ink)]">
                      {text}
                      {!complete && phase === "answering" && (
                        <span aria-hidden className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-[var(--la-wisdom)] align-middle" />
                      )}
                    </p>
                    {complete && seg.citations.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {seg.citations.map((c) => (
                          <button
                            key={`${i}-${c.paragraphId}`}
                            type="button"
                            onClick={() => jumpToParagraph(c.paragraphId)}
                            className="rounded-full border border-[var(--la-wisdom)] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--la-wisdom-deep)] hover:bg-[var(--la-wisdom-soft)] focus-visible:outline-2 focus-visible:outline-[var(--la-focus)]"
                            title={`Jump to ${c.label} in the passage`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null,
              )}
            </div>
          )}
          {phase === "done" && (
            <p className="mt-4 border-t border-[var(--la-surface-sunken)] pt-3 font-serif text-sm italic text-[var(--la-ink-muted)]">
              {MACBETH_EXCHANGE.followUp}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onBeginTrial}
            disabled={phase !== "done"}
            title={phase === "done" ? undefined : "Virgil is still answering"}
            className="rounded-full bg-[var(--la-primary)] px-5 py-2 font-sans text-sm font-semibold text-[var(--la-primary-ink)] hover:bg-[var(--la-primary-edge)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Begin the Trial →
          </button>
          <button
            type="button"
            onClick={onBackToPassage}
            className="rounded-full border border-[var(--la-surface-sunken)] px-4 py-2 font-sans text-xs font-semibold text-[var(--la-ink-muted)] hover:bg-[var(--la-surface-sunken)] focus-visible:outline-2 focus-visible:outline-[var(--la-focus)]"
          >
            ← Back to the passage
          </button>
        </div>
      </div>
    </section>
  )
}
