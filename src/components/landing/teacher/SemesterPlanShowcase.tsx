"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"
import { ClassicsCover } from "@/components/tome/ClassicsCover"
import { getBook } from "@/lib/content"

const ODYSSEY = getBook("the-odyssey")

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const WEEKS = [
  {
    num: 1,
    content: "Books 1–4",
    reading: "Books 1–4 (Telemachy)",
    trial: "Books 1–4 (Apprentice)",
    discussion: "Xenia in Books 1–4",
  },
  {
    num: 2,
    content: "Books 5–8",
    reading: "Books 5–8 (Calypso to Phaeacia)",
    trial: "Books 5–8 (Apprentice)",
    discussion: "Odysseus as guest and stranger",
  },
  {
    num: 3,
    content: "Books 9–12",
    reading: "Books 9–12 (The Wanderings)",
    trial: "Books 9–12 (Scholar)",
    discussion: "Cunning vs. force: the Cyclops",
  },
  {
    num: 4,
    content: "Books 13–16",
    reading: "Books 13–16 (Return to Ithaca)",
    trial: "Books 13–16 (Scholar)",
    discussion: "Disguise and recognition",
  },
  {
    num: 5,
    content: "Books 17–20",
    reading: "Books 17–20 (The Beggar King)",
    trial: "Books 17–20 (Scholar)",
    discussion: "Penelope's tests",
  },
  {
    num: 6,
    content: "Books 21–24",
    reading: "Books 21–24 (The Reckoning)",
    trial: "Books 21–24 (Master)",
    discussion: "Justice and homecoming",
  },
]

export function SemesterPlanShowcase() {
  const [distributed, setDistributed] = useState(false)
  const [openWeek, setOpenWeek] = useState<number | null>(null)

  const selected = WEEKS.find((w) => w.num === openWeek) ?? null

  return (
    <TeacherShowcaseShell
      heading="Plan a semester in minutes"
      subcopy="Map every week: books, chapters, Trials, discussions, due dates. Auto-distribute a novel across your semester, then refine by hand."
      layout="mockup-left"
      bgClass="bg-background"
    >
      <div className="bg-card rounded-xl border border-border p-5 min-h-[300px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {ODYSSEY && (
              <ClassicsCover
                bookId={ODYSSEY.id}
                title={ODYSSEY.title}
                author={ODYSSEY.author}
                tradition={ODYSSEY.tradition}
                fallbackColors={ODYSSEY.coverColors}
                showTomeWordmark={false}
                hideBand
                className="w-5 shrink-0"
              />
            )}
            <p className="text-[10px] text-muted-foreground">The Odyssey · 6-week plan</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDistributed((d) => !d)
              setOpenWeek(null)
            }}
            className={`rounded-full px-2.5 py-0.5 text-[9px] font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              distributed ? "bg-green-500" : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {distributed ? "✓ Distributed" : "Auto-distribute"}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {WEEKS.map((w, i) => {
            const isOpen = openWeek === w.num
            return (
              <motion.button
                key={w.num}
                type="button"
                aria-expanded={isOpen}
                disabled={!distributed}
                onClick={() => setOpenWeek(isOpen ? null : w.num)}
                initial={false}
                animate={{
                  backgroundColor: distributed
                    ? "rgb(120 113 108 / 0.08)"
                    : "rgba(0,0,0,0)",
                }}
                transition={{ delay: distributed ? i * 0.06 : 0, duration: 0.3, ease: EASE }}
                className={`rounded-lg border p-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isOpen ? "border-indigo-500/50" : "border-border"
                } ${distributed ? "cursor-pointer hover:border-indigo-500/40" : "cursor-default"}`}
              >
                <p className="text-[8px] font-bold text-muted-foreground mb-0.5">
                  Week {w.num}
                </p>
                <p className={`text-[9px] font-medium min-h-[12px] ${distributed ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
                  {w.content}
                </p>
                <div className={`mt-1 flex gap-1 ${distributed ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
                  <span className="rounded bg-indigo-100 dark:bg-indigo-950/30 px-1 py-px text-[7px] text-indigo-600 dark:text-indigo-400">
                    Trial
                  </span>
                  <span className="rounded bg-green-100 dark:bg-green-950/30 px-1 py-px text-[7px] text-green-600 dark:text-green-400">
                    Discussion
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>

        <p className="mt-2 text-[9px] text-muted-foreground">
          {distributed
            ? openWeek
              ? "Week selected."
              : "Click a week to see its plan."
            : "Click Auto-distribute to fill the semester."}
        </p>

        {/* Expanded week detail — user-selected */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.num}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="mt-3 rounded-lg border bg-card p-3 shadow-sm"
            >
              <p className="text-[9px] font-bold mb-1">
                Week {selected.num} · {selected.content}
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[8px]">
                  <span className="size-1.5 rounded-full bg-stone-400" />
                  Reading: {selected.reading}
                </div>
                <div className="flex items-center gap-1.5 text-[8px]">
                  <span className="size-1.5 rounded-full bg-indigo-500" />
                  Trial: {selected.trial}
                </div>
                <div className="flex items-center gap-1.5 text-[8px]">
                  <span className="size-1.5 rounded-full bg-green-500" />
                  Discussion: {selected.discussion}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TeacherShowcaseShell>
  )
}
