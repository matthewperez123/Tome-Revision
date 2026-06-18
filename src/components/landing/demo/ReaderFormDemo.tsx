"use client"

import { motion, AnimatePresence } from "motion/react"
import { useDemoState } from "@/hooks/useDemoState"
import { DemoFrame } from "@/components/demo/DemoFrame"
import { TeacherShowcaseShell } from "../teacher/TeacherShowcaseShell"
import { READING_FORM_SAMPLES } from "@/lib/demo/data"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const RHYME_COLORS: Record<string, string> = { A: "#6366F1", B: "#EC4899" }

const SONNET = [
  { n: 1, text: "Shall I compare thee to a summer\u2019s day?", rhyme: "A" },
  { n: 2, text: "Thou art more lovely and more temperate:", rhyme: "B" },
  { n: 3, text: "Rough winds do shake the darling buds of May,", rhyme: "A" },
  { n: 4, text: "And summer\u2019s lease hath all too short a date.", rhyme: "B" },
]

const SPEAKERS = { HAMLET: "#2563EB", HORATIO: "#059669" } as const
type Beat =
  | { kind: "direction"; text: string }
  | { kind: "line"; speaker: keyof typeof SPEAKERS; text: string }
const SCRIPT: Beat[] = [
  { kind: "line", speaker: "HAMLET", text: "Angels and ministers of grace defend us!" },
  { kind: "line", speaker: "HAMLET", text: "Be thou a spirit of health or goblin damn\u2019d," },
  { kind: "direction", text: "[The Ghost beckons HAMLET.]" },
  { kind: "line", speaker: "HORATIO", text: "It beckons you to go away with it," },
  { kind: "line", speaker: "HORATIO", text: "As if it some impartment did desire" },
]

const GLOSSED_LINE = [
  { text: "Whan that " },
  { word: "Aprille", gloss: "April", key: "aprille" },
  { text: " with his " },
  { word: "shoures soote", gloss: "sweet showers", key: "shoures" },
  { text: "," },
]

type TabKey = "Prose" | "Verse" | "Play" | "Middle English"

export function ReaderFormDemo() {
  const tab = useDemoState<TabKey>("Prose")
  const rhyme = useDemoState(true)
  const gloss = useDemoState<string | null>(null)

  const active = tab.state
  const sample = READING_FORM_SAMPLES.find((s) => s.label === active)!

  return (
    <TeacherShowcaseShell
      heading="The reader, shaped to the work."
      subcopy="Epic, verse, drama, or Middle English \u2014 each form rendered the way it was meant to be read. No summaries, no abridgements, complete texts in Literata."
      layout="mockup-left"
      bgClass="bg-background"
    >
      <DemoFrame ariaLabel="Interactive reading-form selector" hint="Switch forms">
        {/* Tab strip */}
        <div
          className="flex items-center mb-4"
          role="tablist"
          aria-label="Reading form"
        >
          <div className="inline-flex flex-wrap gap-0.5 rounded-full border border-border bg-muted p-0.5 text-[11px] font-medium">
            {READING_FORM_SAMPLES.map((s) => {
              const isActive = active === s.label
              return (
                <button
                  key={s.label}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => tab.set(s.label as TabKey)}
                  className={`px-3 py-1 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isActive
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Panel */}
        <div className="relative bg-background rounded-lg border border-border min-h-[280px] p-5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={tab.reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={tab.reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                {sample.workTitle} &middot; {sample.locator}
              </p>
              <p className="text-[11px] font-semibold text-foreground mb-4">
                {sample.byline}
              </p>

              {active === "Prose" && (
                <div className="font-serif text-[15px] leading-[1.85] text-foreground space-y-3">
                  <p>
                    Sing to me of the man, Muse, the man of twists and turns
                    driven time and again off course, once he had plundered the
                    hallowed heights of Troy.
                  </p>
                  <p>
                    Many cities of men he saw and learned their minds, many
                    pains he suffered, heartsick on the open sea.
                  </p>
                </div>
              )}

              {active === "Verse" && (
                <div>
                  <div className="flex justify-end mb-3">
                    <div
                      className="inline-flex items-center gap-0.5 rounded-full border border-border bg-muted p-0.5 text-[10px] font-medium"
                      role="group"
                      aria-label="Rhyme annotation"
                    >
                      <button
                        type="button"
                        onClick={() => rhyme.set(true)}
                        aria-pressed={rhyme.state}
                        className={`px-2 py-0.5 rounded-full transition-colors ${
                          rhyme.state
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground"
                        }`}
                      >
                        Rhyme
                      </button>
                      <button
                        type="button"
                        onClick={() => rhyme.set(false)}
                        aria-pressed={!rhyme.state}
                        className={`px-2 py-0.5 rounded-full transition-colors ${
                          !rhyme.state
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground"
                        }`}
                      >
                        Plain
                      </button>
                    </div>
                  </div>
                  <div className="font-serif text-sm text-foreground leading-[2] space-y-0.5 relative pr-8">
                    {SONNET.map((line) => (
                      <div key={line.n} className="flex gap-3 items-baseline">
                        <span className="text-[10px] text-muted-foreground w-4 tabular-nums">
                          {line.n}
                        </span>
                        <span className="flex-1 relative">
                          {line.text}
                          <AnimatePresence>
                            {rhyme.state && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute -right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold tabular-nums"
                                style={{ color: RHYME_COLORS[line.rhyme] }}
                              >
                                {line.rhyme}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {active === "Play" && (
                <div className="font-serif text-sm leading-[1.8] space-y-2">
                  {SCRIPT.map((beat, i) =>
                    beat.kind === "direction" ? (
                      <p key={i} className="italic text-xs text-muted-foreground pl-8">
                        {beat.text}
                      </p>
                    ) : (
                      <div key={i} className="flex gap-3">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider w-16 shrink-0 pt-[3px]"
                          style={{ color: SPEAKERS[beat.speaker] }}
                        >
                          {beat.speaker}
                        </span>
                        <span className="text-foreground flex-1">{beat.text}</span>
                      </div>
                    ),
                  )}
                </div>
              )}

              {active === "Middle English" && (
                <div>
                  <p className="font-serif text-base text-foreground leading-[2.2] mb-4">
                    {GLOSSED_LINE.map((part, i) => {
                      if ("text" in part) return <span key={i}>{part.text}</span>
                      const open = gloss.state === part.key
                      return (
                        <span key={i} className="relative inline-block">
                          <button
                            type="button"
                            onClick={() =>
                              gloss.set(open ? null : part.key)
                            }
                            aria-expanded={open}
                            className="border-b border-dashed cursor-pointer text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                            style={{ borderColor: "#6366F1" }}
                          >
                            {part.word}
                          </button>
                          <AnimatePresence>
                            {open && (
                              <motion.span
                                initial={{ opacity: 0, y: -2 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -2 }}
                                className="ml-1 text-[11px] text-muted-foreground"
                              >
                                <span className="text-primary font-semibold mr-1">
                                  =
                                </span>
                                {part.gloss}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                      )
                    })}
                    <span className="block mt-1 text-sm text-muted-foreground">
                      The droghte of March hath perced to the roote,
                    </span>
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-primary inline-block" />
                    {gloss.interacted
                      ? "Tap again to close \u2014 every hard word is glossed."
                      : "Tap a dotted word for its gloss."}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </DemoFrame>
    </TeacherShowcaseShell>
  )
}
