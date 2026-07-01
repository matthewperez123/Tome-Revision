"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { BookOpen, TrendingUp, Search, Flame, SlidersHorizontal, ChevronLeft, ChevronRight, Sparkles, Library } from "lucide-react"
import { type TomeBook } from "@/data/books"
import { getBooks, searchBooks } from "@/lib/content"
// supabase removed — library uses local BOOKS data as the canonical source
import { useDebounce } from "@/lib/use-debounce"
import { getAllBookProgress } from "@/lib/book-progress"
import { BlurFade } from "@/components/ui/blur-fade"
import { BookCard, TRADITION_COLORS } from "@/components/tome/book-card"
import { BookCover, getCoverParams } from "@/components/tome/book-cover"
import { AuthorLink } from "@/components/tome/author-link"
import { SearchBar } from "@/components/tome/SearchBar"
import { FilterDropdown } from "@/components/tome/FilterDropdown"
import { isBookRecommended, isBookComplete } from "@/lib/book-apparatus"
import { RecommendationsInbox } from "@/components/library/recommendations-inbox"
import { useLibraryRecommendations } from "@/hooks/use-library-recommendations"
import { cn } from "@/lib/utils"

// ── Constants ──────────────────────────────────

// Traditions are derived dynamically from the BOOKS catalog — no hardcoded list needed

const DIFFICULTIES = [
  { label: "Beginner",       value: "Beginner" },
  { label: "Intermediate",   value: "Intermediate" },
  { label: "Advanced",       value: "Advanced" },
  { label: "Scholar",        value: "Scholar" },
] as const

const SORTS = [
  { label: "Title A–Z",      value: "title" },
  { label: "Chronological",  value: "year" },
  { label: "Difficulty",     value: "difficulty" },
  { label: "Shortest First", value: "shortest" },
  { label: "Most Popular",   value: "popular" },
] as const

const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 1, intermediate: 2, advanced: 3, scholar: 4,
}


// ── Page ──────────────────────────────────────

export function LibraryBrowseClient() {
  // ── Data ──────────────────────────────────────
  // The catalog is static local data, so derive it at render time. This makes
  // the full library server-render (true count + cards) instead of being gated
  // behind a client-only effect — which left the page showing "0 books across
  // 0 traditions" for any view that hadn't run/completed client hydration.
  const allBooks = useMemo(() => getBooks(), [])
  const [allProgress, setAllProgress] = useState<ReturnType<typeof getAllBookProgress>>({})

  // ── Filter state ───────────────────────────────
  const [search,     setSearch]     = useState("")
  const [selectedTraditions, setSelectedTraditions] = useState<Set<string>>(new Set())
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<string>>(new Set())
  const [filterOpen, setFilterOpen] = useState(false)
  const [sort,       setSort]       = useState(() => {
    if (typeof window === 'undefined') return "title"
    return localStorage.getItem("tome-library-sort") ?? "title"
  })

  const debouncedSearch = useDebounce(search, 300)

  // Map of bookId → recommender for any books in the user's library that
  // were accepted from a recommendation. Empty in demo mode.
  const recsMap = useLibraryRecommendations()

  // ── Load per-user reading progress (localStorage, client-only) ──
  useEffect(() => {
    setAllProgress(getAllBookProgress())
  }, [])

  // ── Persist sort to localStorage ──
  const handleSetSort = useCallback((value: string) => {
    setSort(value)
    try { localStorage.setItem("tome-library-sort", value) } catch {}
  }, [])

  // ── Tradition toggle (multi-select, matches /authors) ──
  const toggleTradition = useCallback((t: string) => {
    setSelectedTraditions((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }, [])

  // ── Difficulty toggle (multi-select) ──
  const toggleDifficulty = useCallback((d: string) => {
    setSelectedDifficulties((prev) => {
      const next = new Set(prev)
      if (next.has(d)) next.delete(d)
      else next.add(d)
      return next
    })
  }, [])

  // ── Clear all ─────────────────────────────────
  const clearFilters = useCallback(() => {
    setSearch("")
    setSelectedTraditions(new Set())
    setSelectedDifficulties(new Set())
    handleSetSort("title")
  }, [])

  const hasActiveFilters = !!(debouncedSearch || selectedTraditions.size > 0 || selectedDifficulties.size > 0)

  // ── All traditions present in the library ──
  const allTraditions = useMemo(() => {
    const tradSet = new Set<string>()
    allBooks.forEach((b) => { if (b.tradition) tradSet.add(b.tradition) })
    return [...tradSet].sort()
  }, [allBooks])

  // ── Fully filtered + sorted books ─────────────
  const filtered = useMemo(() => {
    let result = allBooks

    if (debouncedSearch) result = searchBooks(debouncedSearch)
    if (selectedTraditions.size > 0) result = result.filter(b => selectedTraditions.has(b.tradition))
    if (selectedDifficulties.size > 0) result = result.filter(b => selectedDifficulties.has(b.difficulty))

    const isFinished = (book: TomeBook) =>
      (allProgress[book.id]?.completedChapterIndices.length ?? 0) >= book.chapters

    result = [...result].sort((a, b) => {
      // Finished books always float to the front
      const aDone = isFinished(a)
      const bDone = isFinished(b)
      if (aDone !== bDone) return aDone ? -1 : 1

      switch (sort) {
        case "title":     return a.title.localeCompare(b.title)
        case "year":      return a.year - b.year
        case "difficulty": {
          const da = DIFFICULTY_ORDER[a.difficulty.toLowerCase()] ?? 2
          const db = DIFFICULTY_ORDER[b.difficulty.toLowerCase()] ?? 2
          return da - db
        }
        case "shortest":  return a.wordCount - b.wordCount
        case "popular":   return (b.trending?.readers ?? 0) - (a.trending?.readers ?? 0)
        default:          return 0
      }
    })

    return result
  }, [allBooks, allProgress, debouncedSearch, selectedTraditions, selectedDifficulties, sort])

  // Show discovery sections only when no active filters
  const showDiscovery = !hasActiveFilters

  // ── Recommended: fully-ingested + in-progress books ──
  // Sorted by year (ascending) so earlier works — which influence the later
  // ones — read first. This is our working proxy for "importance" in a
  // canon built on intertextual lineage. Finished books (full Opus
  // apparatus) come first within each year; in-progress books (partial
  // annotations or glosses) come second.
  const recommendedBooks = useMemo(
    () =>
      allBooks.filter(isBookRecommended).sort((a, b) => {
        const ac = isBookComplete(a) ? 0 : 1
        const bc = isBookComplete(b) ? 0 : 1
        if (ac !== bc) return ac - bc
        return a.year - b.year
      }),
    [allBooks]
  )

  return (
    <div className="flex flex-row gap-0 min-h-full">
      {/* ── Filter Sidebar — collapsible with peek rail ── */}
      <aside
        className={cn(
          "relative shrink-0 border-r border-border bg-[var(--tome-surface-elevated)] transition-[width] duration-200 ease-[var(--tome-ease-scholarly)] overflow-hidden z-10 sticky top-0 self-start h-[calc(100vh-3rem)]",
          filterOpen ? "w-56" : "w-10"
        )}
      >
        {/* Collapsed peek rail — filter icon + tradition dots */}
        {!filterOpen && (
          <div className="flex h-full w-10 flex-col items-center pt-3 pb-3 gap-1.5 overflow-y-auto">
            <button
              onClick={() => setFilterOpen(true)}
              title="Filters"
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-md transition-colors mb-1",
                hasActiveFilters
                  ? "text-[var(--tome-accent)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <SlidersHorizontal className="size-4" />
            </button>
            {allTraditions.map(t => (
              <button
                key={t}
                onClick={() => { toggleTradition(t); setFilterOpen(true) }}
                className={cn(
                  "group/dot relative flex size-6 shrink-0 items-center justify-center rounded transition-colors",
                  selectedTraditions.has(t)
                    ? "bg-muted"
                    : "hover:bg-muted"
                )}
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: TRADITION_COLORS[t]?.dot ?? "#6366F1" }}
                />
                {/* Hover tooltip */}
                <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded bg-foreground/90 px-2 py-1 text-[10px] font-medium text-background opacity-0 transition-opacity group-hover/dot:opacity-100 z-50">
                  {t}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Expanded filter content */}
        {filterOpen && (
          <div className="flex h-full min-w-[220px] flex-col p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Filters
              </h3>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setFilterOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Collapse filters"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
              </div>
            </div>

        {/* Sort */}
        <div className="mb-5">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Sort By
          </label>
          <FilterDropdown
            label="Sort"
            value={sort}
            onChange={handleSetSort}
            options={SORTS}
            className="w-full rounded-md"
          />
        </div>

        {/* Traditions */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Traditions
          </label>
          <div className="space-y-1">
            {allTraditions.map((t) => (
              <label key={t} className="flex items-center gap-2 py-0.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedTraditions.has(t)}
                  onChange={() => toggleTradition(t)}
                  className="size-3 rounded border-border accent-[var(--tome-accent)]"
                />
                <span
                  className="size-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: TRADITION_COLORS[t]?.dot }}
                />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate">
                  {t}
                </span>
              </label>
            ))}
          </div>
        </div>
        </div>
        )}
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 min-w-0">
        {/* Sticky Header — identical structure to /authors */}
        <div className="sticky top-0 z-10 border-b border-border bg-background px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 min-w-0 mr-auto">
              <Library className="size-6 shrink-0 text-foreground" />
              <div className="flex flex-col min-w-0">
                <h1 className="text-2xl font-bold tracking-tight">
                  Library
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {filtered.length} book{filtered.length !== 1 ? "s" : ""} across {allTraditions.length} traditions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {DIFFICULTIES.map(d => (
                <button
                  key={d.value}
                  onClick={() => toggleDifficulty(d.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
                    selectedDifficulties.has(d.value)
                      ? "bg-[var(--tome-accent)] text-[#111111]"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
            <div className="space-y-8">

              {/* ── Pending book recommendations from friends/classmates ── */}
              <RecommendationsInbox />

              {/* ── Recommended: fully-ingested books ── */}
              {showDiscovery && recommendedBooks.length > 0 && (
                <section>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-[var(--tome-accent)]">
                      <Sparkles className="size-4" />
                    </span>
                    <h2
                      className="text-sm font-semibold tracking-tight"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      Recommended
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      ({recommendedBooks.length})
                    </span>
                    <p className="text-[11px] text-muted-foreground/70 ml-1">
                      Finished &amp; in-progress books with scholarly apparatus (annotations, glosses, echoes).
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {recommendedBooks.map((book, i) => (
                      <BlurFade key={book.id} delay={0.03 + i * 0.03} inView>
                        <BookCard
                          book={book}
                          progress={allProgress[book.id]}
                          size="lg"
                          activeSort={sort}
                          recommendedBy={recsMap[book.id] ?? null}
                        />
                      </BlurFade>
                    ))}
                  </div>
                </section>
              )}

              {/* ── All books grid ── */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                  <div className="relative">
                    <BookOpen className="size-10 text-muted-foreground/30" />
                    <Search className="size-4 text-muted-foreground/50 absolute -bottom-1 -right-1" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">No books found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or search terms</p>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="mt-1 h-8 px-4 rounded-full border border-[var(--tome-accent)] text-xs text-[var(--tome-accent)] hover:bg-[color-mix(in_srgb,var(--tome-accent)_8%,transparent)] transition-colors"
                  >
                    Browse all books
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5">
                  {filtered.map((book, i) => (
                    <BlurFade key={book.id} delay={0.03 + (i % 30) * 0.02} inView>
                      <BookCard
                        book={book}
                        progress={allProgress[book.id]}
                        size="sm"
                        activeSort={sort}
                        recommendedBy={recsMap[book.id] ?? null}
                      />
                    </BlurFade>
                  ))}
                </div>
              )}

            </div>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────

function SectionHeader({
  icon, title, count,
}: { icon: React.ReactNode; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      <span className="text-[var(--tome-accent)]">{icon}</span>
      <h2 className="text-sm font-semibold tracking-tight" style={{ letterSpacing: "-0.01em" }}>
        {title}
      </h2>
      {count != null && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  )
}

// ── Trending Card ──────────────────────────────

function TrendingCard({ book, rank }: { book: TomeBook; rank: number }) {
  const coverParams = getCoverParams(book)
  const tradColor = TRADITION_COLORS[book.tradition] ?? { bg: "rgba(99,102,241,0.14)", text: "#4338ca", dot: "#6366F1" }
  const trendIcon = book.trending?.trend === "hot" ? <Flame className="size-3.5" /> : book.trending?.trend === "rising" ? <TrendingUp className="size-3.5" /> : <BookOpen className="size-3.5" />

  return (
    <a
      href={`/book/${book.id}`}
      className={cn(
        "group flex flex-col w-36 shrink-0 rounded-xl border border-border bg-card overflow-hidden snap-start",
        "transition-[transform,box-shadow] duration-[var(--tome-duration-fast)] ease-[var(--tome-ease-scholarly)] hover:scale-[1.02] hover:shadow-md motion-reduce:hover:scale-100"
      )}
    >
      <div className="relative overflow-hidden">
        <BookCover {...coverParams} className="w-full transition-transform duration-[var(--tome-duration-fast)] group-hover:-translate-y-0.5" />

        {/* Rank badge */}
        <span className="absolute top-1.5 left-1.5 size-5 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center text-[9px] font-bold text-foreground shadow-sm">
          {rank}
        </span>

        {/* Trend badge */}
        <span className="absolute top-1.5 right-1.5 text-xs leading-none">
          {trendIcon}
        </span>
      </div>

      <div className="flex flex-col p-2 gap-0.5 min-w-0">
        <h3 className="text-[11px] font-semibold leading-snug line-clamp-2">{book.title}</h3>
        <span onClick={(e) => e.preventDefault()}>
          <AuthorLink name={book.author} className="text-[9px] text-muted-foreground hover:text-[var(--tome-accent)] transition-colors" />
        </span>
        {book.trending && (
          <p className="text-[9px] text-muted-foreground/60 mt-0.5 tabular-nums">
            {book.trending.readers.toLocaleString()} reading
          </p>
        )}
        <span
          className="mt-0.5 self-start rounded-full px-1.5 py-px text-[8px] font-medium leading-none"
          style={{ background: tradColor.bg, color: tradColor.text }}
        >
          {book.tradition}
        </span>
      </div>
    </a>
  )
}
