"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import { Search, ArrowRight } from "lucide-react"
import { getBooks } from "@/lib/content"
import { BookCard, TRADITION_COLORS } from "@/components/tome/book-card"
import { LandingNav } from "@/components/landing/LandingNav"
import { LandingFooter } from "@/components/landing/LandingFooter"

/**
 * Public /library page — marketing preview of the canon, organized into three
 * anchored areas that mirror the real app's primary axis:
 *   • #genres  — Traditions (the app's real catalog axis), with live counts
 *   • #books   — the full static catalog grid (display-only cards)
 *   • #authors — a preview that cross-links to the real /authors index
 *
 * Cards and the search bar are display-only — the cards do not navigate and
 * the search input is disabled. The page is public (no auth gate). The
 * authenticated catalog with working filters/search lives at /library/browse.
 *
 * Painting source: Wikimedia Commons. Caspar David Friedrich (German,
 * 1774–1840), "Der Wanderer über dem Nebelmeer", oil on canvas, c. 1818,
 * Hamburger Kunsthalle. Public domain worldwide.
 */
export function PublicLibraryPage() {
  const books = useMemo(() => getBooks(), [])

  const traditions = useMemo(() => {
    const counts = new Map<string, number>()
    for (const b of books) counts.set(b.tradition, (counts.get(b.tradition) ?? 0) + 1)
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [books])

  const authors = useMemo(() => {
    const seen = new Set<string>()
    const list: string[] = []
    for (const b of books) {
      if (!seen.has(b.author)) {
        seen.add(b.author)
        list.push(b.author)
      }
    }
    return list
  }, [books])

  const tabs = [
    { label: "Traditions", href: "#genres" },
    { label: "Books", href: "#books" },
    { label: "Authors", href: "#authors" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative h-[72vh] min-h-[480px] w-full overflow-hidden">
        <Image
          src="/paintings/wanderer-above-sea-of-fog.jpg"
          alt="Wanderer above the Sea of Fog by Caspar David Friedrich, c. 1818"
          fill
          priority
          className="object-cover object-center"
          unoptimized
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.35) 35%, transparent 65%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-16 md:px-12 md:pb-20 flex flex-col items-center text-center">
          <h1 className="font-[var(--font-display)] text-[40px] md:text-[64px] font-bold text-white leading-[1.05] tracking-tight">
            The Library
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/70 max-w-xl leading-relaxed">
            Every great book, gathered.
          </p>
        </div>
        <p className="absolute bottom-4 right-6 text-[11px] text-white/40">
          Caspar David Friedrich · Wanderer above the Sea of Fog · c. 1818
        </p>
      </section>

      {/* ── Section tabs (anchor links) ─────────────────────────── */}
      <nav
        aria-label="Library sections"
        className="sticky top-[57px] z-30 border-b border-border bg-background/95 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 md:px-8">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── Traditions (#genres) ─────────────────────────────────── */}
      <section
        id="genres"
        className="mx-auto max-w-7xl scroll-mt-28 px-4 py-12 md:px-8 md:py-16"
      >
        <h2 className="font-[var(--font-display)] text-2xl font-bold text-foreground md:text-3xl">
          Browse by tradition
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          The canon, organized by the literary traditions that shaped it — the
          same axis the reader uses inside Tome.
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {traditions.map((t) => {
            const color = TRADITION_COLORS[t.name]
            return (
              <li
                key={t.name}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3"
              >
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color?.dot ?? "#6366F1" }}
                />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {t.name}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {t.count}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      {/* ── Books (#books) — full static catalog ─────────────────── */}
      <section
        id="books"
        className="mx-auto max-w-7xl scroll-mt-28 px-4 pb-12 md:px-8 md:pb-16"
      >
        <div className="relative mb-8 max-w-md">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="search"
            disabled
            aria-label="Search the library (preview)"
            placeholder="Search the library..."
            className="h-9 w-full pl-9 pr-3 text-xs rounded-full bg-[var(--tome-surface-elevated)] border border-transparent text-muted-foreground placeholder:text-muted-foreground/60 cursor-not-allowed disabled:opacity-70"
          />
        </div>

        <div className="mb-5 flex items-baseline gap-3 border-b border-border pb-3">
          <h2 className="font-serif text-sm font-semibold tracking-tight">
            All books
          </h2>
          <p className="text-[11px] text-muted-foreground">
            {books.length} book{books.length === 1 ? "" : "s"} in the canon
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {books.map((book) => (
            <BookCard key={book.id} book={book} size="sm" interactive={false} />
          ))}
        </div>
      </section>

      {/* ── Authors (#authors) ───────────────────────────────────── */}
      <section
        id="authors"
        className="mx-auto max-w-7xl scroll-mt-28 px-4 pb-16 md:px-8 md:pb-24"
      >
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-3">
          <h2 className="font-[var(--font-display)] text-2xl font-bold text-foreground md:text-3xl">
            The authors
          </h2>
          <Link
            href="/authors"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Browse all authors
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <ul className="flex flex-wrap gap-2">
          {authors.slice(0, 36).map((name) => (
            <li
              key={name}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground"
            >
              {name}
            </li>
          ))}
        </ul>
      </section>

      <LandingFooter />
    </div>
  )
}
