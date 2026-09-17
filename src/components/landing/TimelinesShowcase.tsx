"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const AUTHORS = [
  {
    initials: "H",
    name: "Homer",
    year: "~800 BCE",
    color: "#0EA5E9",
    works: [
      { title: "The Iliad", detail: "Epic poem, ~750 BCE" },
      { title: "The Odyssey", detail: "Epic poem, ~725 BCE" },
    ],
  },
  {
    initials: "V",
    name: "Virgil",
    year: "70 BCE",
    color: "#6366F1",
    works: [
      { title: "The Aeneid", detail: "Epic poem, 19 BCE" },
      { title: "Georgics", detail: "Didactic poem, 29 BCE" },
    ],
  },
  {
    initials: "D",
    name: "Dante",
    year: "1265",
    color: "#F59E0B",
    works: [
      { title: "Divine Comedy", detail: "Epic poem, 1320" },
      { title: "Vita Nuova", detail: "Prose & poetry, 1294" },
    ],
  },
  {
    initials: "S",
    name: "Shakespeare",
    year: "1564",
    color: "#EF4444",
    works: [
      { title: "Hamlet", detail: "Tragedy, 1601" },
      { title: "King Lear", detail: "Tragedy, 1606" },
    ],
  },
  {
    initials: "A",
    name: "Austen",
    year: "1775",
    color: "#F43F5E",
    works: [
      { title: "Pride and Prejudice", detail: "Novel, 1813" },
      { title: "Emma", detail: "Novel, 1815" },
    ],
  },
  {
    initials: "T",
    name: "Tolstoy",
    year: "1828",
    color: "#3B82F6",
    works: [
      { title: "War and Peace", detail: "Novel, 1869" },
      { title: "Anna Karenina", detail: "Novel, 1877" },
    ],
  },
]

type Audience = "reader" | "teacher"

const COPY: Record<Audience, { heading: string; subcopy: string }> = {
  reader: {
    heading: "The canon, charted through time",
    subcopy:
      "Follow each tradition from its first masters to its latest voices. Every author lives in context.",
  },
  teacher: {
    heading: "Context for every assignment",
    subcopy:
      "Pin any author or work on a timeline and hand students the same scholarly context you bring to a lecture. Great for period units, movement surveys, and pre-reading.",
  },
}

export function TimelinesShowcase({ audience = "reader" }: { audience?: Audience } = {}) {
  const [selected, setSelected] = useState(2) // Dante
  const { heading, subcopy } = COPY[audience]
  const author = AUTHORS[selected]

  return (
    <TeacherShowcaseShell
      heading={heading}
      subcopy={subcopy}
      layout={audience === "teacher" ? "mockup-right" : "mockup-left"}
      bgClass="bg-background"
    >
      <div className="bg-card rounded-xl border border-border p-6 min-h-[260px]">
        <p className="text-[10px] text-muted-foreground mb-4 uppercase tracking-wider font-medium">
          The Western Canon &middot; Click an author
        </p>
        <div className="relative h-1 bg-muted rounded-full mb-8 mt-2">
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] rounded-full" />
        </div>
        <div className="flex items-start justify-between">
          {AUTHORS.map((a, i) => {
            const isSelected = i === selected
            return (
              <button
                key={a.initials}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelected(i)}
                className="flex flex-col items-center gap-1 rounded-lg px-1 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div
                  className={`size-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm transition-transform ${
                    isSelected ? "scale-110 ring-2 ring-offset-2 ring-offset-card" : "hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: a.color,
                    ...(isSelected ? { ["--tw-ring-color" as string]: a.color } : {}),
                  }}
                >
                  {a.initials}
                </div>
                <span className={`text-[8px] font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                  {a.name}
                </span>
                <span className="text-[7px] text-muted-foreground/60">{a.year}</span>
              </button>
            )
          })}
        </div>

        {/* Selected author's works */}
        <AnimatePresence mode="wait">
          <motion.div
            key={author.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="mt-5 rounded-lg border bg-muted/40 p-3"
          >
            <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: author.color }}>
              {author.name}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {author.works.map((w) => (
                <div key={w.title}>
                  <p className="text-[10px] font-semibold text-foreground">{w.title}</p>
                  <p className="text-[8px] text-muted-foreground">{w.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </TeacherShowcaseShell>
  )
}
