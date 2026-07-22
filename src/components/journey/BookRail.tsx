"use client"

/**
 * BookRail — "Choose your next book" on /journey.
 *
 * The twelve featured registry books as portal cards: Tome-generated cover,
 * world-palette ground, hero copy, and the 14-day journey badge. The
 * current book (Macbeth) is badged instead of linked as "next". Cards link
 * to the book portal route; the rail scrolls with snap on small screens and
 * wraps into a grid on desktop. Explore-mode vibrancy is intentional here.
 */

import Link from "next/link"
import { TomeCover } from "@/components/covers/TomeCover"
import { listBookSlugs, getBookExperience } from "@/lib/books/registry"
import { laWorldCss } from "@/lib/design/tokens"

const CURRENT_BOOK = "macbeth"

const FOCUS_RING =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--la-page)]"

export function BookRail() {
  const slugs = listBookSlugs()

  return (
    <section aria-label="Choose your next book" className="mt-12">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--la-ink)]">
          Choose your next book
        </h2>
        <p className="text-xs text-[var(--la-ink-muted)]">
          Twelve worlds, each with its own journey, Seal, and Stoa painting.
        </p>
      </div>

      <ul className="grid grid-flow-col grid-rows-1 gap-5 overflow-x-auto pb-4 [grid-auto-columns:11rem] sm:[grid-auto-columns:12.5rem] md:grid-flow-row md:grid-cols-4 md:overflow-visible md:pb-0 xl:grid-cols-6">
        {slugs.map((slug) => {
          const book = getBookExperience(slug)!
          const current = slug === CURRENT_BOOK
          const card = (
            <>
              <div
                className="rounded-[var(--la-radius-m)] p-2.5"
                style={{
                  background: `linear-gradient(160deg, ${laWorldCss(slug, "ground")}, ${laWorldCss(slug, "deep")})`,
                }}
              >
                <TomeCover slug={slug} size="card" />
              </div>
              <div className="mt-2.5 px-0.5">
                <p className="truncate text-sm font-semibold text-[var(--la-ink)]">
                  {book.title}
                </p>
                <p className="truncate text-xs text-[var(--la-ink-muted)]">
                  {book.author}
                </p>
                <p className="mt-1 line-clamp-2 min-h-8 text-[11px] italic leading-snug text-[var(--la-ink-faint)]">
                  {book.heroCopy}
                </p>
                <p className="mt-1.5 flex items-center gap-1.5">
                  {current ? (
                    <span className="rounded-full bg-[var(--la-primary-soft)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--la-primary)]">
                      Current journey
                    </span>
                  ) : (
                    <span className="rounded-full bg-[var(--la-wisdom-soft)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--la-wisdom-deep)]">
                      {book.journeyLengthDays}-day journey
                    </span>
                  )}
                </p>
              </div>
            </>
          )
          return (
            <li key={slug} className="snap-start">
              {current ? (
                <div aria-current="page" className="h-full">
                  {card}
                </div>
              ) : (
                <Link
                  href={`/book/${book.bookId}`}
                  className={`block h-full rounded-[var(--la-radius-m)] transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none ${FOCUS_RING}`}
                  aria-label={`${book.title} by ${book.author}. Open the book portal.`}
                >
                  {card}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
