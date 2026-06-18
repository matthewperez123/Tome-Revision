"use client"

import { useMemo, useState } from "react"
import { motion } from "motion/react"
import { DemoFrame } from "@/components/demo/DemoFrame"
import { TeacherShowcaseShell } from "../teacher/TeacherShowcaseShell"
import {
  DEMO_LIBRARY_SORTS,
  DEMO_TRADITIONS,
  DEMO_DIFFICULTIES,
  filterAndSortDemoBooks,
  type DemoLibrarySort,
} from "@/lib/demo/data"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function LibraryControlsDemo() {
  const [sort, setSort] = useState<DemoLibrarySort>("title")
  const [traditions, setTraditions] = useState<Set<string>>(new Set())
  const [difficulties, setDifficulties] = useState<Set<string>>(new Set())

  const toggle = (
    set: Set<string>,
    value: string,
    setter: (s: Set<string>) => void,
  ) => {
    const next = new Set(set)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    setter(next)
  }

  const books = useMemo(
    () => filterAndSortDemoBooks({ traditions, difficulties, sort }),
    [traditions, difficulties, sort],
  )

  const hasFilters = traditions.size > 0 || difficulties.size > 0 || sort !== "title"

  return (
    <TeacherShowcaseShell
      heading="Your library, in your order or history's."
      subcopy="Every book you've started, finished, and annotated. Sort by your reading order, or reshuffle chronologically and watch three thousand years of literature line up in sequence."
      layout="mockup-right"
      bgClass="bg-muted"
    >
      <DemoFrame
        ariaLabel="Interactive library controls"
        hint="Filter & sort"
        onReset={
          hasFilters
            ? () => {
                setSort("title")
                setTraditions(new Set())
                setDifficulties(new Set())
              }
            : undefined
        }
      >
        {/* Sort row */}
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <p className="text-xs text-muted-foreground tabular-nums">
            {books.length} book{books.length !== 1 ? "s" : ""} &middot;{" "}
            {DEMO_TRADITIONS.length} traditions
          </p>
          <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as DemoLibrarySort)}
              className="rounded-md border border-border bg-background text-foreground text-[11px] px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {DEMO_LIBRARY_SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Tradition chips */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {DEMO_TRADITIONS.map((t) => {
            const active = traditions.has(t)
            return (
              <button
                key={t}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(traditions, t, setTraditions)}
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            )
          })}
        </div>

        {/* Difficulty chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {DEMO_DIFFICULTIES.map((d) => {
            const active = difficulties.has(d)
            return (
              <button
                key={d}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(difficulties, d, setDifficulties)}
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active
                    ? "border-foreground bg-foreground/10 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}
              </button>
            )
          })}
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-2.5">
          {books.map((book) => (
            <motion.div
              key={book.id}
              layout
              transition={{ duration: 0.35, ease: EASE }}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-background p-2"
            >
              <div
                className="size-9 rounded shrink-0 flex items-center justify-center text-[11px] font-serif font-bold text-white"
                style={{ backgroundColor: book.coverColors.primary }}
              >
                {book.title.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-foreground truncate">
                  {book.title}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {book.tradition} &middot; {book.difficulty}
                </p>
              </div>
            </motion.div>
          ))}
          {books.length === 0 && (
            <p className="col-span-2 text-center text-xs text-muted-foreground py-6">
              No books match these filters.
            </p>
          )}
        </div>
      </DemoFrame>
    </TeacherShowcaseShell>
  )
}
