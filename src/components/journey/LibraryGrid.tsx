"use client"

/**
 * LibraryGrid — browsable library embedded in /journey.
 *
 * A light companion to the existing /library route (which this build does
 * not touch): search across title/author, Tradition / Era / Difficulty
 * facets from src/lib/journey/library-meta.ts, an accessible grid/list
 * toggle, and simple pagination so the card wall never renders sluggishly —
 * 8 per page, pager controls with arrow-key friendly buttons.
 *
 * Data is the twelve featured registry books with their generated covers
 * and real facet curation; reading time is shown only where a real content
 * build reports it (Macbeth: 91 minutes from public/content/macbeth).
 */

import { useMemo, useState } from "react"
import Link from "next/link"
import { TomeCover } from "@/components/covers/TomeCover"
import { listBookSlugs, getBookExperience } from "@/lib/books/registry"
import type { BookExperience } from "@/lib/books/types"
import {
  DIFFICULTIES,
  ERAS,
  LIBRARY_META,
  TRADITIONS,
  type Difficulty,
  type Era,
  type Tradition,
} from "@/lib/journey/library-meta"
import { MACBETH_ESTIMATED_MINUTES } from "@/lib/journey/macbeth-path"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 8

type ViewMode = "grid" | "list"

const FOCUS_RING =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--la-surface)]"

interface LibraryBook {
  experience: BookExperience
  tradition: Tradition
  era: Era
  difficulty: Difficulty
  /** Real build-reported minutes where available; otherwise undefined. */
  minutes?: number
}

const BOOKS: readonly LibraryBook[] = listBookSlugs().map((slug) => {
  const experience = getBookExperience(slug)!
  const meta = LIBRARY_META[slug]
  return {
    experience,
    tradition: meta.tradition,
    era: meta.era,
    difficulty: meta.difficulty,
    minutes: slug === "macbeth" ? MACBETH_ESTIMATED_MINUTES : undefined,
  }
})

function FacetGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly T[]
  value: T | null
  onChange: (next: T | null) => void
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--la-ink-faint)]">
        {label}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = value === option
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? null : option)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                FOCUS_RING,
                active
                  ? "border-[var(--la-primary)] bg-[var(--la-primary)] text-[var(--la-primary-ink)]"
                  : "border-[var(--la-surface-sunken)] bg-[var(--la-surface)] text-[var(--la-ink-muted)] hover:text-[var(--la-ink)]",
              )}
            >
              {option}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export function LibraryGrid() {
  const [query, setQuery] = useState("")
  const [tradition, setTradition] = useState<Tradition | null>(null)
  const [era, setEra] = useState<Era | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [view, setView] = useState<ViewMode>("grid")
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return BOOKS.filter((book) => {
      if (tradition && book.tradition !== tradition) return false
      if (era && book.era !== era) return false
      if (difficulty && book.difficulty !== difficulty) return false
      if (
        q &&
        !book.experience.title.toLowerCase().includes(q) &&
        !book.experience.author.toLowerCase().includes(q)
      ) {
        return false
      }
      return true
    })
  }, [query, tradition, era, difficulty])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const visible = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  const resetPage = () => setPage(0)

  return (
    <section aria-label="Browse the library" className="mt-12" id="library">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--la-ink)]">
          Browse the library
        </h2>
        <p className="text-xs text-[var(--la-ink-muted)]">
          The twelve featured journeys. The full catalog lives in the{" "}
          <Link
            href="/library"
            className={`rounded font-medium text-[var(--la-primary)] underline-offset-4 hover:underline ${FOCUS_RING}`}
          >
            Library
          </Link>
          .
        </p>
      </div>

      <div className="rounded-[var(--la-radius-l)] border border-[var(--la-surface-sunken)] bg-[var(--la-surface)] p-5" style={{ boxShadow: "var(--la-shadow-raised)" }}>
        {/* controls */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-52 flex-1">
              <label
                htmlFor="library-search"
                className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--la-ink-faint)]"
              >
                Search title or author
              </label>
              <input
                id="library-search"
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  resetPage()
                }}
                placeholder="Try “Homer” or “storm”…"
                className={`h-11 w-full rounded-[var(--la-radius-m)] border border-[var(--la-surface-sunken)] bg-[var(--la-page)] px-4 text-sm text-[var(--la-ink)] placeholder:text-[var(--la-ink-faint)] ${FOCUS_RING}`}
              />
            </div>
            <div
              role="group"
              aria-label="Library view"
              className="flex rounded-full border border-[var(--la-surface-sunken)] bg-[var(--la-page)] p-1"
            >
              {(["grid", "list"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={view === mode}
                  onClick={() => setView(mode)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                    FOCUS_RING,
                    view === mode
                      ? "bg-[var(--la-primary)] text-[var(--la-primary-ink)]"
                      : "text-[var(--la-ink-muted)] hover:text-[var(--la-ink)]",
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <FacetGroup label="Tradition" options={TRADITIONS} value={tradition} onChange={(v) => { setTradition(v); resetPage() }} />
            <FacetGroup label="Era" options={ERAS} value={era} onChange={(v) => { setEra(v); resetPage() }} />
            <FacetGroup label="Difficulty" options={DIFFICULTIES} value={difficulty} onChange={(v) => { setDifficulty(v); resetPage() }} />
          </div>
        </div>

        <p role="status" className="mt-4 text-xs text-[var(--la-ink-muted)]">
          {filtered.length === 0
            ? "No books match — try clearing a filter."
            : `${filtered.length} ${filtered.length === 1 ? "book" : "books"}${pageCount > 1 ? ` · page ${safePage + 1} of ${pageCount}` : ""}`}
        </p>

        {/* results */}
        {view === "grid" ? (
          <ul className="mt-3 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((book) => (
              <li key={book.experience.slug}>
                <Link
                  href={`/book/${book.experience.bookId}`}
                  className={`group block rounded-[var(--la-radius-m)] ${FOCUS_RING}`}
                >
                  <div
                    className="rounded-[var(--la-radius-m)] p-2.5 transition-transform duration-200 group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
                    style={{
                      background: `linear-gradient(160deg, ${book.experience.palette.ground}, ${book.experience.palette.ink})`,
                    }}
                  >
                    <TomeCover slug={book.experience.slug} size="card" />
                  </div>
                  <p className="mt-2 truncate text-sm font-semibold text-[var(--la-ink)]">
                    {book.experience.title}
                  </p>
                  <p className="truncate text-xs text-[var(--la-ink-muted)]">
                    {book.experience.author}
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--la-ink-faint)]">
                    {book.tradition} · {book.era} · {book.difficulty}
                    {book.minutes ? ` · ~${book.minutes} min` : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-3 flex flex-col gap-2.5">
            {visible.map((book) => (
              <li key={book.experience.slug}>
                <Link
                  href={`/book/${book.experience.bookId}`}
                  className={`flex items-center gap-4 rounded-[var(--la-radius-m)] border border-[var(--la-surface-sunken)] bg-[var(--la-page)] p-3 transition-shadow hover:shadow-[var(--la-shadow-raised)] ${FOCUS_RING}`}
                >
                  <span className="block w-14 shrink-0">
                    <TomeCover slug={book.experience.slug} size="thumb" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[var(--la-ink)]">
                      {book.experience.title}
                    </span>
                    <span className="block truncate text-xs text-[var(--la-ink-muted)]">
                      {book.experience.author} — {book.experience.heroCopy}
                    </span>
                  </span>
                  <span className="hidden shrink-0 text-[11px] text-[var(--la-ink-faint)] sm:block">
                    {book.tradition} · {book.era} · {book.difficulty}
                    {book.minutes ? ` · ~${book.minutes} min` : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* pagination */}
        {pageCount > 1 && (
          <nav aria-label="Library pages" className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
              className={cn(
                "h-10 rounded-[var(--la-radius-m)] border border-[var(--la-surface-sunken)] px-4 text-sm font-medium text-[var(--la-ink-muted)] enabled:hover:text-[var(--la-ink)] disabled:opacity-40",
                FOCUS_RING,
              )}
            >
              ← Previous
            </button>
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-current={index === safePage ? "page" : undefined}
                onClick={() => setPage(index)}
                className={cn(
                  "size-10 rounded-[var(--la-radius-m)] text-sm font-semibold",
                  FOCUS_RING,
                  index === safePage
                    ? "bg-[var(--la-primary)] text-[var(--la-primary-ink)]"
                    : "border border-[var(--la-surface-sunken)] text-[var(--la-ink-muted)] hover:text-[var(--la-ink)]",
                )}
              >
                {index + 1}
              </button>
            ))}
            <button
              type="button"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage(safePage + 1)}
              className={cn(
                "h-10 rounded-[var(--la-radius-m)] border border-[var(--la-surface-sunken)] px-4 text-sm font-medium text-[var(--la-ink-muted)] enabled:hover:text-[var(--la-ink)] disabled:opacity-40",
                FOCUS_RING,
              )}
            >
              Next →
            </button>
          </nav>
        )}
      </div>
    </section>
  )
}
