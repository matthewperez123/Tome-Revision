"use client"

import Image from "next/image"
import { useMemo } from "react"
import { Search } from "lucide-react"
import { getBooks } from "@/lib/content"
import { BookCard } from "@/components/tome/book-card"
import { LandingNav } from "@/components/landing/LandingNav"
import { LandingFooter } from "@/components/landing/LandingFooter"

/**
 * Public /library page — marketing preview of the canon.
 *
 * Two stacked sections:
 *   1. Hero painting (Caspar David Friedrich, "Wanderer above the Sea of
 *      Fog", 1818) with the page title overlaid.
 *   2. Static catalog grid that mirrors the in-app /library/browse layout.
 *      Cards and the search bar are display-only — the cards do not link
 *      to book detail pages and the search bar is `disabled`. The whole
 *      page is publicly accessible (no auth gate).
 *
 * Painting source: Wikimedia Commons. Caspar David Friedrich (German,
 * 1774–1840), "Der Wanderer über dem Nebelmeer" (Wanderer above the Sea
 * of Fog), oil on canvas, c. 1818, Hamburger Kunsthalle. Public domain
 * worldwide — the artist died in 1840, well outside any copyright term.
 * File ships from /public/paintings/wanderer-above-sea-of-fog.jpg.
 */
export function PublicLibraryPage() {
  const books = useMemo(() => getBooks(), [])

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
        {/* Bottom gradient for legibility of the title overlay. */}
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

      {/* ── Catalog grid (mirrors /library/browse, fully static) ── */}
      <section className="px-4 md:px-8 py-10 md:py-14 max-w-7xl mx-auto">
        {/* Search bar — visually present, disabled. Mirrors the in-app
            SearchBar's pill input but uses a native disabled <input> so
            assistive tech announces the disabled state correctly. */}
        <div className="relative max-w-md mb-8">
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

        {/* Title row mirrors the sticky header on /library/browse, sans
            interactivity. */}
        <div className="flex items-baseline gap-3 mb-5 border-b border-border pb-3">
          <h2 className="text-sm font-serif font-semibold tracking-tight">
            Library
          </h2>
          <p className="text-[11px] text-muted-foreground">
            {books.length} book{books.length === 1 ? "" : "s"} in the canon
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              size="sm"
              interactive={false}
            />
          ))}
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
