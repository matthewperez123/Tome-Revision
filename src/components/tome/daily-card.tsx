"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import { BookOpen, ExternalLink, Quote, User, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DAILY_QUOTES,
  DAILY_PASSAGES,
  DAILY_CHARACTERS,
  DAILY_BOOKS,
  selectDaily,
  type DailyQuote,
  type DailyPassage,
  type DailyCharacter,
  type DailyBook,
} from "@/lib/daily/seed"

type Tab = "quote" | "passage" | "character" | "book"

const TABS: { key: Tab; label: string; icon: typeof Quote }[] = [
  { key: "quote", label: "Quote", icon: Quote },
  { key: "passage", label: "Passage", icon: BookOpen },
  { key: "character", label: "Character", icon: User },
  { key: "book", label: "Book", icon: BookOpen },
]

function dayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000)
}

export function DailyCard({
  trialFooter,
}: {
  /** Optional footer content — used to surface the daily-MCQ Trial link. */
  trialFooter?: React.ReactNode
}) {
  const [tab, setTab] = useState<Tab>("quote")
  const [day, setDay] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    // SSR-safe: compute the day index after mount so the server-rendered
    // first paint matches the client's hydration output.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDay(dayOfYear())
  }, [])

  const quote = selectDaily(DAILY_QUOTES, day)
  const passage = selectDaily(DAILY_PASSAGES, day)
  const character = selectDaily(DAILY_CHARACTERS, day)
  const book = selectDaily(DAILY_BOOKS, day)

  return (
    <section
      aria-labelledby="daily-card-heading"
      className="relative overflow-hidden rounded-2xl border border-border bg-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 pt-4 pb-0">
        <div>
          <h2
            id="daily-card-heading"
            className="font-serif text-base font-semibold leading-none"
          >
            Daily
          </h2>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            New each morning
          </p>
        </div>
        <div role="tablist" aria-label="Daily card sections" className="flex items-center gap-1">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              id={`daily-tab-${key}`}
              aria-controls={`daily-panel-${key}`}
              aria-selected={tab === key}
              tabIndex={tab === key ? 0 : -1}
              onClick={() => setTab(key)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  e.preventDefault()
                  const idx = TABS.findIndex((t) => t.key === tab)
                  const next =
                    e.key === "ArrowRight"
                      ? (idx + 1) % TABS.length
                      : (idx - 1 + TABS.length) % TABS.length
                  setTab(TABS[next].key)
                }
              }}
              className={cn(
                "relative rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tome-accent)]",
                tab === key
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
              {tab === key && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-[7px] left-2 right-2 h-0.5 rounded-full bg-[#C9A84C]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 min-h-[180px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="tabpanel"
            id={`daily-panel-${tab}`}
            aria-labelledby={`daily-tab-${tab}`}
          >
            {tab === "quote" && <QuotePanel entry={quote} />}
            {tab === "passage" && <PassagePanel entry={passage} />}
            {tab === "character" && <CharacterPanel entry={character} />}
            {tab === "book" && <BookPanel entry={book} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {trialFooter && (
        <div className="border-t border-border bg-muted/30 px-5 py-3">
          {trialFooter}
        </div>
      )}
    </section>
  )
}

function QuotePanel({ entry }: { entry: DailyQuote }) {
  return (
    <figure>
      <blockquote className="font-serif text-lg leading-snug">
        <span aria-hidden="true" className="mr-1 text-[#C9A84C]">“</span>
        {entry.text}
        <span aria-hidden="true" className="ml-1 text-[#C9A84C]">”</span>
      </blockquote>
      <figcaption className="mt-3 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        — {entry.attribution}
      </figcaption>
      {entry.bookId && (
        <Link
          href={`/book/${entry.bookId}`}
          className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          View in library
          <ExternalLink className="size-3" aria-hidden="true" />
        </Link>
      )}
    </figure>
  )
}

function PassagePanel({ entry }: { entry: DailyPassage }) {
  return (
    <div>
      <div className="space-y-2 font-serif text-[15px] leading-relaxed">
        {entry.lines.map((line, i) => (
          <p key={i}>
            {i === 0 && <span aria-hidden="true" className="mr-0.5 text-[#C9A84C]">“</span>}
            {line}
            {i === entry.lines.length - 1 && (
              <span aria-hidden="true" className="ml-0.5 text-[#C9A84C]">”</span>
            )}
          </p>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          {entry.bookTitle} · {entry.location}
        </p>
        <Link
          href={`/read/${entry.bookId}?ch=${entry.chapterIndex}`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          Read in context
          <ExternalLink className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

function CharacterPanel({ entry }: { entry: DailyCharacter }) {
  return (
    <div>
      <h3 className="font-display text-2xl font-semibold tracking-tight">
        {entry.name}
      </h3>
      <p className="mt-1 font-serif italic text-sm text-muted-foreground">
        {entry.bookTitle}
      </p>
      <p className="mt-3 text-sm leading-relaxed">{entry.summary}</p>
      <div className="mt-4 flex items-center justify-between">
        {entry.stoaPaintingId && (
          <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <ImageIcon className="size-3" aria-hidden="true" />
            Pictured in the Stoa
          </span>
        )}
        <Link
          href={`/book/${entry.bookId}`}
          className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          View in library
          <ExternalLink className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

function BookPanel({ entry }: { entry: DailyBook }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {entry.author}
      </p>
      <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight">
        {entry.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed">{entry.description}</p>
      <Link
        href={`/book/${entry.bookId}`}
        className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        View in library
        <ExternalLink className="size-3" aria-hidden="true" />
      </Link>
    </div>
  )
}
