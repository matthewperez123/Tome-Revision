"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"

type TabKey = "prose" | "verse" | "play" | "middle"

const TABS: { key: TabKey; label: string }[] = [
  { key: "prose", label: "Prose" },
  { key: "verse", label: "Verse" },
  { key: "play", label: "Play" },
  { key: "middle", label: "Middle English" },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const RHYME_COLORS: Record<string, string> = {
  A: "#6366F1",
  B: "#EC4899",
}

const SONNET = [
  { n: 1, text: "Shall I compare thee to a summer\u2019s day?", rhyme: "A" },
  { n: 2, text: "Thou art more lovely and more temperate:", rhyme: "B" },
  { n: 3, text: "Rough winds do shake the darling buds of May,", rhyme: "A" },
  { n: 4, text: "And summer\u2019s lease hath all too short a date.", rhyme: "B" },
]

const SPEAKERS = {
  HAMLET: "#2563EB",
  HORATIO: "#059669",
} as const

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

export function MergedReaderBlock() {
  const [tab, setTab] = useState<TabKey>("prose")

  return (
    <TeacherShowcaseShell
      heading="The reader, shaped to the work."
      subcopy="Epic, verse, drama, or Middle English — each form rendered the way it was meant to be read. No summaries, no abridgements, complete texts in Literata."
      layout="mockup-left"
      bgClass="bg-background"
    >
      <div>
        {/* Tab strip */}
        <div className="flex items-center mb-4">
          <div className="inline-flex rounded-full border border-border bg-muted p-0.5 text-[11px] font-medium">
            {TABS.map((t) => {
              const active = tab === t.key
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    active
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Panel */}
        <div className="relative bg-card rounded-xl border border-border min-h-[300px] p-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {tab === "prose" && <ProseSample />}
              {tab === "verse" && <VerseSample />}
              {tab === "play" && <PlaySample />}
              {tab === "middle" && <MiddleSample />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </TeacherShowcaseShell>
  )
}

function ProseSample() {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
        The Odyssey &middot; Book I
      </p>
      <p className="text-[11px] font-semibold text-foreground mb-4">
        Homer &middot; Robert Fagles, trans.
      </p>
      <div className="font-serif text-[15px] leading-[1.85] text-foreground space-y-3">
        <p>
          Sing to me of the man, Muse, the man of twists and turns
          driven time and again off course, once he had plundered
          the hallowed heights of Troy.
        </p>
        <p>
          Many cities of men he saw and learned their minds,
          many pains he suffered, heartsick on the open sea,
          fighting to save his life and bring his comrades home.
        </p>
      </div>
    </div>
  )
}

function VerseSample() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Sonnet 18 &middot; Shakespeare
        </p>
        <div className="flex items-center gap-1 rounded-full border border-border bg-muted p-0.5 text-[10px] font-medium">
          <span className="px-2 py-0.5 rounded-full bg-card text-foreground shadow-sm">
            Rhyme
          </span>
          <span className="px-2 py-0.5 rounded-full text-muted-foreground">
            Plain
          </span>
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
              <span
                className="absolute -right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold tabular-nums"
                style={{ color: RHYME_COLORS[line.rhyme] }}
              >
                {line.rhyme}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlaySample() {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
        Hamlet &middot; Shakespeare
      </p>
      <p className="text-[11px] font-semibold text-foreground mb-4">
        Act I, Scene iv &mdash; The platform before the castle
      </p>
      <div className="font-serif text-sm leading-[1.8] space-y-2">
        {SCRIPT.map((beat, i) => {
          if (beat.kind === "direction") {
            return (
              <p key={i} className="italic text-xs text-muted-foreground pl-8">
                {beat.text}
              </p>
            )
          }
          return (
            <div key={i} className="flex gap-3">
              <span
                className="text-[10px] font-bold uppercase tracking-wider w-16 shrink-0 pt-[3px]"
                style={{ color: SPEAKERS[beat.speaker] }}
              >
                {beat.speaker}
              </span>
              <span className="text-foreground flex-1">{beat.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MiddleSample() {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
        The Canterbury Tales &middot; General Prologue
      </p>
      <p className="text-[11px] font-semibold text-foreground mb-4">
        Chaucer &middot; c. 1387
      </p>
      <div className="font-serif text-base text-foreground leading-[2] mb-4">
        {GLOSSED_LINE.map((part, i) => {
          if ("text" in part) return <span key={i}>{part.text}</span>
          return (
            <span key={i} className="relative inline-block">
              <span
                className="border-b border-dashed cursor-pointer text-indigo-500"
                style={{ borderColor: "#6366F1" }}
              >
                {part.word}
              </span>
              <span className="ml-1 text-[11px] text-muted-foreground">
                <span className="text-indigo-500 font-semibold mr-1">=</span>
                {part.gloss}
              </span>
            </span>
          )
        })}
        <span className="block mt-1 text-sm text-muted-foreground">
          The droghte of March hath perced to the roote,
        </span>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <span className="size-1.5 rounded-full bg-indigo-500 inline-block" />
        Dotted underline = tap for gloss
      </div>
    </div>
  )
}
