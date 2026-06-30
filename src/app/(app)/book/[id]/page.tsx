/**
 * TOME DESIGN RUBRIC — Book Detail
 * Reference: Codex /stories/[id] + Goodreads + Literal
 * ─────────────────────────────────
 * Server Component: title, author, synopsis, table of contents, and cover ship
 * in the initial HTML for SEO. Interactive pieces (Start Reading / bookmark /
 * recommend / progress, the TOC show-all toggle, the rating widget) are client
 * islands.
 */
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowRight, ChevronRight, Clock, Globe, LayoutList,
} from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { ClassicsCover } from "@/components/tome/ClassicsCover"
import { BookCard, TRADITION_COLORS } from "@/components/tome/book-card"
import { AuthorLink } from "@/components/tome/author-link"
import { getBook, getChapters, getAuthor, getBooksByTradition, getBooksByAuthor } from "@/lib/content"
import { BOOKS } from "@/data/books"
import { getUnitLabel } from "@/lib/structural-units"
import {
  CanterburyTalesProgressMap,
  CanterburyTalesPilgrimsGallery,
  CanterburyTalesAtAGlance,
} from "@/components/reader/canterbury-tales-enhancements"
import { CANTERBURY_TALES_EDITORIAL_NOTES } from "@/data/canterbury-tales/editorial-notes"
import { BookRating } from "@/components/books/BookRating"
import { BookActions } from "@/components/book/book-actions"
import { ChapterList } from "@/components/book/chapter-list"

// ── Constants ──────────────────────────────────

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  Beginner:     { bg: "rgba(34,197,94,0.15)",   text: "#16a34a" },
  Intermediate: { bg: "rgba(245,158,11,0.15)",  text: "#b45309" },
  Advanced:     { bg: "rgba(249,115,22,0.15)",  text: "#c2410c" },
  Scholar:      { bg: "rgba(239,68,68,0.15)",   text: "#dc2626" },
}

// ── Static generation + metadata ───────────────

export function generateStaticParams() {
  return BOOKS.map((b) => ({ id: b.id }))
}

function clampDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max - 1).replace(/\s+\S*$/, "") + "…"
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const book = getBook(id)
  if (!book) {
    return { title: { absolute: "Book not found — Tome" } }
  }
  const title = `${book.title} by ${book.author} — Read free on Tome`
  const description = clampDescription(book.synopsis)
  const canonical = `/book/${book.id}`
  const ogImage = book.coverImagePath ?? "/og-image.png"
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      type: "book",
      title,
      description,
      url: canonical,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}

// ── Ornamental divider ────────────────────────

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2 text-muted-foreground/25">
      <div className="h-px flex-1 bg-current" />
      <svg viewBox="0 0 48 16" className="w-12 shrink-0" aria-hidden>
        <circle cx="8"  cy="8" r="1.5" fill="currentColor" />
        <circle cx="16" cy="8" r="2.5" fill="currentColor" />
        <circle cx="24" cy="8" r="3.5" fill="currentColor" />
        <circle cx="32" cy="8" r="2.5" fill="currentColor" />
        <circle cx="40" cy="8" r="1.5" fill="currentColor" />
      </svg>
      <div className="h-px flex-1 bg-current" />
    </div>
  )
}

// ── Page ──────────────────────────────────────

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: bookId } = await params
  const book = getBook(bookId)
  if (!book) notFound()

  const chapters = getChapters(bookId)
  const author = getAuthor(book.authorId) ?? null
  const relatedBooks = getBooksByTradition(book.tradition).filter((x) => x.id !== bookId).slice(0, 8)
  const authorBooks = getBooksByAuthor(book.authorId).filter((x) => x.id !== bookId)

  const structuralUnitType = book.structuralUnitType ?? "chapter"
  const tradColor = TRADITION_COLORS[book.tradition] ?? { bg: "rgba(99,102,241,0.14)", text: "#4338ca", dot: "#6366F1" }
  const diffColor = DIFFICULTY_COLORS[book.difficulty] ?? { bg: "rgba(99,102,241,0.14)", text: "#4338ca" }
  const authorBio1 = author?.bio.split("\n\n")[0] ?? ""
  const authorInitials = author?.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() ?? "?"

  return (
    <div className="flex flex-col min-h-full max-w-4xl w-full mx-auto px-4 sm:px-6">
      {/* ── Breadcrumb ── */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 pt-4 pb-2 text-xs text-muted-foreground"
      >
        <Link href="/library/browse" className="hover:text-foreground transition-colors">Library</Link>
        <ChevronRight className="size-3 shrink-0" />
        <Link
          href={`/library/browse?tradition=${encodeURIComponent(book.tradition)}`}
          className="hover:text-foreground transition-colors truncate max-w-[120px]"
        >
          {book.tradition}
        </Link>
        <ChevronRight className="size-3 shrink-0" />
        <span className="text-foreground truncate max-w-[160px] font-medium">{book.title}</span>
      </nav>

      {/* ── Hero ── */}
      <BlurFade delay={0.05} inView>
        <section className="py-4">
          <div className="flex gap-5 md:gap-8 items-start">
            {/* Cover */}
            <div className="w-32 shrink-0 sm:w-40 md:w-48">
              <ClassicsCover
                bookId={book.id}
                title={book.title}
                author={book.author}
                tradition={book.tradition}
                fallbackColors={book.coverColors}
                showTomeWordmark
                priority
                className="w-full rounded-lg"
              />
            </div>

            {/* Meta */}
            <div className="flex flex-col min-w-0 flex-1">
              {/* Tradition + difficulty badges */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-semibold"
                  style={{ background: tradColor.bg, color: tradColor.text }}
                >
                  {book.tradition}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-semibold"
                  style={{ background: diffColor.bg, color: diffColor.text }}
                >
                  {book.difficulty}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Globe className="size-2.5" />
                  {book.country}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl">
                {book.title}
              </h1>

              {/* Author */}
              <div className="mt-1 flex items-center gap-1.5 text-sm">
                <span className="text-muted-foreground text-xs">by</span>
                <AuthorLink
                  name={book.author}
                  className="text-sm font-medium text-[var(--tome-accent)] hover:underline"
                />
              </div>

              {/* Stats row */}
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <LayoutList className="size-3" />
                  {book.chapters} {getUnitLabel(structuralUnitType, book.chapters !== 1)}
                </span>
                <span className="opacity-40">·</span>
                <span>{book.wordCount.toLocaleString()} words</span>
                <span className="opacity-40">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {book.estimatedReadingTime}
                </span>
                {book.year && (
                  <>
                    <span className="opacity-40">·</span>
                    <span>{book.year < 0 ? `${Math.abs(book.year)} BC` : book.year}</span>
                  </>
                )}
              </div>

              {/* Rating */}
              <BookRating bookId={book.id} className="mt-3" />

              {/* Progress + CTAs (client island) */}
              <BookActions
                bookId={book.id}
                bookTitle={book.title}
                structuralUnitType={structuralUnitType}
                totalChapters={book.chapters}
                chapterTitles={chapters.map((c) => c.title)}
                tradDotColor={tradColor.dot}
              />
            </div>
          </div>
        </section>
      </BlurFade>

      {/* ── Body ── */}
      <div className="flex-1 pb-24 sm:pb-8 space-y-8 mt-4">

        {/* ── Synopsis ── */}
        <BlurFade delay={0.1} inView>
          <section>
            <OrnamentalDivider />
            <p className="mt-5 text-sm leading-7 text-foreground/80 font-serif sm:text-base sm:leading-8">
              {book.synopsis}
            </p>
            <OrnamentalDivider />
          </section>
        </BlurFade>

        {/* ── Tradition note ── */}
        {book.traditionNote && (
          <BlurFade delay={0.11} inView>
            <section className="rounded-xl border border-amber-700/30 bg-amber-50/40 dark:bg-amber-950/20 p-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-900/80 dark:text-amber-200/80 mb-2">
                A book that stands apart
              </h2>
              <p className="text-sm leading-7 text-foreground/85 font-serif sm:text-base sm:leading-8">
                {book.traditionNote}
              </p>
            </section>
          </BlurFade>
        )}

        {/* ── Pilgrim Progress Map (Canterbury Tales only) ── */}
        {book.id === "the-canterbury-tales" && (
          <BlurFade delay={0.11} inView>
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                The Pilgrimage at a Glance
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                Twenty-five tales across ten Ellesmere fragments. Each column is a tale,
                colored by the teller&apos;s signature hue. Dashed columns (the Cook&apos;s
                and Squire&apos;s Tales) mark the two incompletes.
              </p>
              <CanterburyTalesProgressMap />
            </section>
          </BlurFade>
        )}

        {/* ── Tales at a Glance (Canterbury Tales only) ── */}
        {book.id === "the-canterbury-tales" && (
          <BlurFade delay={0.115} inView>
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Tales, by Fragment
              </h2>
              <CanterburyTalesAtAGlance />
            </section>
          </BlurFade>
        )}

        {/* ── Pilgrims Gallery (Canterbury Tales only) ── */}
        {book.id === "the-canterbury-tales" && (
          <BlurFade delay={0.118} inView>
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                The Pilgrims
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                Twenty-nine pilgrims ride to Canterbury, plus Harry Bailly the Host who
                orchestrates the tale-game from the Tabard Inn, and Chaucer himself —
                present as both poet and pilgrim, a naive observer whose praise is the
                poet&apos;s indictment.
              </p>
              <CanterburyTalesPilgrimsGallery />
            </section>
          </BlurFade>
        )}

        {/* ── Editorial Notes (Canterbury Tales only) ── */}
        {book.id === "the-canterbury-tales" && (
          <BlurFade delay={0.12} inView>
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Editorial Notes
              </h2>
              <div className="space-y-4">
                {[...CANTERBURY_TALES_EDITORIAL_NOTES]
                  .sort((a, b) => a.order - b.order)
                  .map((note) => (
                    <article
                      key={note.id}
                      className="rounded-xl border border-border bg-card p-4"
                    >
                      <h3 className="text-sm font-semibold mb-2">{note.title}</h3>
                      <div className="text-sm text-muted-foreground space-y-2">
                        {note.body.split("\n\n").map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </article>
                  ))}
              </div>
            </section>
          </BlurFade>
        )}

        {/* ── Themes ── */}
        {book.themes.length > 0 && (
          <BlurFade delay={0.12} inView>
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Themes
              </h2>
              <div className="flex flex-wrap gap-2">
                {book.themes.map((theme) => (
                  <span
                    key={theme}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-default"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </section>
          </BlurFade>
        )}

        {/* ── About the author ── */}
        {author && (
          <BlurFade delay={0.14} inView>
            <section className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                About the Author
              </h2>
              <div className="flex gap-3">
                {/* Portrait circle */}
                <div
                  className="size-12 shrink-0 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm"
                  style={{ background: author.portraitPlaceholder ?? tradColor.dot }}
                >
                  {authorInitials}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-sm font-semibold">{author.name}</span>
                    {(author.birthYear != null || author.deathYear != null) && (
                      <span className="text-[11px] text-muted-foreground">
                        {author.birthYear != null
                          ? author.birthYear < 0 ? `${Math.abs(author.birthYear)} BC` : author.birthYear
                          : "?"}
                        {" – "}
                        {author.deathYear != null
                          ? author.deathYear < 0 ? `${Math.abs(author.deathYear)} BC` : author.deathYear
                          : "present"}
                      </span>
                    )}
                    <span className="text-[11px] text-muted-foreground">{author.nationality}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {authorBio1}
                  </p>
                  <Link
                    href={`/author/${author.id}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--tome-accent)] hover:underline"
                  >
                    View full profile <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </section>
          </BlurFade>
        )}

        {/* ── Chapter list (client island; full TOC ships in HTML) ── */}
        <BlurFade delay={0.16} inView>
          <ChapterList
            chapters={chapters}
            bookId={bookId}
            structuralUnitType={structuralUnitType}
          />
        </BlurFade>

        {/* ── More from tradition ── */}
        {relatedBooks.length > 0 && (
          <BlurFade delay={0.18} inView>
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  More {book.tradition} Literature
                </h2>
                <Link
                  href={`/library/browse?tradition=${encodeURIComponent(book.tradition)}`}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
                >
                  See all <ChevronRight className="size-3" />
                </Link>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6">
                {relatedBooks.map((b) => (
                  <div key={b.id} className="w-32 shrink-0">
                    <BookCard book={b} size="sm" />
                  </div>
                ))}
              </div>
            </section>
          </BlurFade>
        )}

        {/* ── More by author ── */}
        {authorBooks.length > 0 && (
          <BlurFade delay={0.2} inView>
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                More by {book.author}
              </h2>
              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6">
                {authorBooks.map((b) => (
                  <div key={b.id} className="w-32 shrink-0">
                    <BookCard book={b} size="sm" />
                  </div>
                ))}
              </div>
            </section>
          </BlurFade>
        )}

      </div>
    </div>
  )
}
