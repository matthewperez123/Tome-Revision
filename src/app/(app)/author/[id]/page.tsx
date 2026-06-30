/**
 * TOME DESIGN RUBRIC — Author Profile
 * Reference: Britannica + A24 press kits + The Paris Review
 * ─────────────────────────────────
 * Server Component: name, biography, themes, and the works grid ship in the
 * initial HTML for SEO. BlurFade section reveals stay (they render their server
 * children then hydrate); per-item entrance staggers are dropped.
 */
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BookOpen, Lightbulb, MapPin, Calendar, ChevronRight, Library } from "lucide-react"
import { AUTHORS, getAuthorById, getAuthorsByTradition, authorSlug, type Author } from "@/data/authors"
import { getBooksByAuthor } from "@/lib/content"
import { BOOKS, type TomeBook } from "@/data/books"
import { BlurFade } from "@/components/ui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { BookCard } from "@/components/tome/book-card"
import { cn } from "@/lib/utils"

// ── Constants ──────────────────────────────────

const TRADITION_COLORS: Record<string, string> = {
  "Ancient Greek": "#0EA5E9",
  Roman: "#EF4444",
  "Medieval European": "#F59E0B",
  Renaissance: "#EAB308",
  Enlightenment: "#06B6D4",
  Romantic: "#F43F5E",
  Victorian: "#A855F7",
  Russian: "#3B82F6",
  American: "#6366F1",
  French: "#F97316",
  Modernist: "#14B8A6",
  "Post-Colonial": "#10B981",
  Eastern: "#FB923C",
  Contemporary: "#8B5CF6",
}

// ── Helpers ────────────────────────────────────

function formatYear(year?: number): string {
  if (!year) return "?"
  return year < 0 ? `${Math.abs(year)} BC` : `${year}`
}

function formatLifespan(birth?: number, death?: number): string {
  if (!birth && !death) return ""
  return `${formatYear(birth)} – ${death ? formatYear(death) : "present"}`
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function getTraditionColor(traditions: string[]): string {
  return TRADITION_COLORS[traditions[0]] ?? "#6366F1"
}

// Slug derived from a book's display author name — mirrors the formula the
// /authors listing uses to build its card links, so every author card resolves.
const authorIdFromName = authorSlug

// Build a minimal author profile from the static book catalogue for authors
// that have no curated entry in authors.ts. Returns null if no books match.
function deriveAuthorFromBooks(id: string): { author: Author; books: TomeBook[] } | null {
  const books = BOOKS.filter((b) => authorIdFromName(b.author) === id)
  if (books.length === 0) return null
  const traditions = [...new Set(books.map((b) => b.tradition).filter(Boolean))]
  const author: Author = {
    id,
    name: books[0].author,
    nationality: "",
    era: "",
    traditions,
    bio: "",
    notableWorks: [],
    themes: [],
    influence: "",
    quotes: [],
    worksInLibrary: books.map((b) => b.id),
  }
  return { author, books }
}

// Resolve an author + their works from a slug/id, matching curated entries
// first and falling back to a catalogue-derived profile.
function resolveAuthor(id: string): { author: Author; books: TomeBook[] } | null {
  const found = getAuthorById(id)
  if (found) {
    // Match works by authorId AND by name-slug: many catalogue books carry an
    // authorId that doesn't equal the curated slug.
    const slugs = new Set(
      [found.id, found.name, (found as Author & { fullName?: string }).fullName]
        .filter(Boolean)
        .map((n) => authorSlug(n as string)),
    )
    const byId = getBooksByAuthor(found.id)
    const bySlug = BOOKS.filter((b) => b.author && slugs.has(authorSlug(b.author)))
    const books = [...new Map([...byId, ...bySlug].map((b) => [b.id, b])).values()]
    return { author: found, books }
  }
  return deriveAuthorFromBooks(id)
}

// ── Static generation + metadata ───────────────

export function generateStaticParams() {
  const ids = new Set<string>()
  for (const a of AUTHORS) ids.add(a.id)
  for (const b of BOOKS) if (b.author) ids.add(authorSlug(b.author))
  return [...ids].map((id) => ({ id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const resolved = resolveAuthor(id)
  if (!resolved) {
    return { title: { absolute: "Author not found — Tome" } }
  }
  const { author, books } = resolved
  const title = `${author.name} — Author profile on Tome`
  const bioLead = author.bio.split(/\n+/).filter(Boolean)[0]
  const description = bioLead
    ? bioLead.replace(/\s+/g, " ").trim().slice(0, 155)
    : `Read ${books.length} ${books.length === 1 ? "work" : "works"} by ${author.name} free on Tome${
        author.traditions[0] ? ` — ${author.traditions[0]} literature` : ""
      }.`
  const canonical = `/author/${author.id}`
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      type: "profile",
      title,
      description,
      url: canonical,
      images: [{ url: "/og-image.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  }
}

// ── Sub-components ─────────────────────────────

function OrnamentalDivider({ color }: { color: string }) {
  return (
    <div className="relative flex items-center my-6" aria-hidden>
      <div className="flex-1 h-px bg-border" />
      <div className="mx-3 shrink-0">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z"
            fill={color}
          />
        </svg>
      </div>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

function AuthorAvatar({
  name,
  color,
  size = "lg",
}: {
  name: string
  color: string
  size?: "sm" | "md" | "lg"
}) {
  const initials = getInitials(name)
  const sizeClasses = {
    sm: "size-16 text-lg",
    md: "size-20 text-xl",
    lg: "size-32 text-3xl",
  }

  return (
    <div className={cn("relative shrink-0 rounded-full", sizeClasses[size])}>
      {/* Decorative ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, ${color}33, ${color}88, ${color}33, transparent, ${color}33)`,
          padding: "2px",
        }}
      />
      <div
        className={cn(
          "absolute inset-[3px] rounded-full flex items-center justify-center font-serif font-bold select-none",
          sizeClasses[size]
        )}
        style={{
          background: `radial-gradient(135% 135% at 25% 20%, ${color}40 0%, ${color}18 50%, transparent 100%)`,
          border: `1.5px solid ${color}44`,
          color: color,
        }}
      >
        <span>{initials}</span>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const resolved = resolveAuthor(id)
  if (!resolved) notFound()

  const { author, books } = resolved

  const accentColor = getTraditionColor(author.traditions)
  const relatedAuthors = getAuthorsByTradition(author.traditions[0])
    .filter((a) => a.id !== author.id)
    .slice(0, 5)

  const bioParagraphs = author.bio.split(/\n+/).filter(Boolean)
  const bioMain = bioParagraphs[0] ?? ""
  const bioQuote = bioParagraphs[1] ?? ""

  const lifespan = formatLifespan(author.birthYear, author.deathYear)

  return (
    <div className="min-h-screen pb-24">
      {/* ── Breadcrumb ─────────────────────────── */}
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-0" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <li>
            <Link href="/library/browse" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Library className="size-3" />
              Library
            </Link>
          </li>
          <li aria-hidden><ChevronRight className="size-3" /></li>
          <li>
            <Link href="/authors" className="hover:text-foreground transition-colors">Authors</Link>
          </li>
          <li aria-hidden><ChevronRight className="size-3" /></li>
          <li className="text-foreground font-medium truncate max-w-[180px]">{author.name}</li>
        </ol>
      </nav>

      {/* ── Hero ─────────────────────────────────── */}
      <BlurFade delay={0.05} inView>
        <section
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${accentColor}18 0%, ${accentColor}08 50%, transparent 100%)`,
            borderBottom: `1px solid ${accentColor}22`,
          }}
        >
          {/* Background texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${accentColor} 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
            aria-hidden
          />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
              {/* Avatar */}
              <AuthorAvatar name={author.name} color={accentColor} size="lg" />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1
                  className="font-serif text-4xl md:text-5xl font-bold tracking-tight leading-none mb-2"
                  style={{ color: "var(--tome-text-primary, inherit)" }}
                >
                  {author.name}
                </h1>

                {author.fullName && author.fullName !== author.name && (
                  <p className="text-lg text-muted-foreground font-serif italic mb-3">
                    {author.fullName}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground mb-4">
                  {lifespan && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 shrink-0" />
                      {lifespan}
                    </span>
                  )}
                  {author.birthPlace && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0" />
                      {author.birthPlace}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="font-medium text-xs px-3 py-1 rounded-full"
                    style={{
                      background: `${accentColor}20`,
                      color: accentColor,
                      border: `1px solid ${accentColor}40`,
                    }}
                  >
                    {author.era}
                  </Badge>

                  {author.traditions.map((tradition) => (
                    <Badge
                      key={tradition}
                      variant="outline"
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        borderColor: `${TRADITION_COLORS[tradition] ?? accentColor}55`,
                        color: TRADITION_COLORS[tradition] ?? accentColor,
                      }}
                    >
                      {tradition}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </BlurFade>

      {/* ── Body ─────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-14">

        {/* Biography */}
        {bioMain && (
          <BlurFade delay={0.1} inView>
            <section>
              <h2 className="font-serif text-2xl font-semibold tracking-tight mb-1">Biography</h2>
              <OrnamentalDivider color={accentColor} />

              <p className="font-serif text-lg leading-relaxed text-foreground max-w-2xl">
                {bioMain}
              </p>

              {bioQuote && (
                <blockquote
                  className="relative mt-8 max-w-2xl pl-6 py-2"
                  style={{ borderLeft: `3px solid ${accentColor}` }}
                >
                  {/* Decorative large opening quote */}
                  <span
                    className="absolute -top-4 -left-2 font-serif text-7xl leading-none select-none pointer-events-none"
                    style={{ color: `${accentColor}20` }}
                    aria-hidden
                  >
                    &ldquo;
                  </span>
                  <p className="font-serif text-lg italic leading-relaxed text-foreground/85 relative z-10">
                    {bioQuote}
                  </p>
                </blockquote>
              )}
            </section>
          </BlurFade>
        )}

        {/* Pull Quote */}
        {author.quotes[0] && (
          <BlurFade delay={0.15} inView>
            <section
              className="relative py-10 px-6 sm:px-10 rounded-2xl overflow-hidden text-center"
              style={{
                background: `linear-gradient(135deg, ${accentColor}0a 0%, transparent 100%)`,
                border: `1px solid ${accentColor}20`,
              }}
            >
              {/* Opening decorative mark */}
              <span
                className="block font-serif text-6xl leading-none mb-2 select-none"
                style={{ color: "var(--tome-amber, #f59e0b)" }}
                aria-hidden
              >
                &ldquo;
              </span>
              <p
                className="font-serif text-xl sm:text-2xl italic leading-relaxed max-w-2xl mx-auto"
                style={{ color: "var(--tome-amber, #f59e0b)" }}
              >
                {author.quotes[0]}
              </p>
              <span
                className="block font-serif text-6xl leading-none mt-2 select-none"
                style={{ color: "var(--tome-amber, #f59e0b)" }}
                aria-hidden
              >
                &rdquo;
              </span>
            </section>
          </BlurFade>
        )}

        {/* Themes & Influence */}
        {(author.themes.length > 0 || author.influence) && (
          <BlurFade delay={0.2} inView>
            <section className="grid sm:grid-cols-2 gap-8">
              {/* Key Themes */}
              {author.themes.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold tracking-tight mb-1">Key Themes</h2>
                  <OrnamentalDivider color={accentColor} />
                  <div className="flex flex-wrap gap-2">
                    {author.themes.map((theme) => (
                      <span
                        key={theme}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
                        style={{
                          background: `${accentColor}15`,
                          color: accentColor,
                          border: `1px solid ${accentColor}30`,
                        }}
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Literary Legacy */}
              {author.influence && (
                <div>
                  <h2 className="font-serif text-2xl font-semibold tracking-tight mb-1">Literary Legacy</h2>
                  <OrnamentalDivider color={accentColor} />
                  <div className="bg-muted rounded-xl p-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {author.influence}
                    </p>
                  </div>
                </div>
              )}
            </section>
          </BlurFade>
        )}

        {/* Works in Library */}
        <BlurFade delay={0.25} inView>
          <section>
            <h2 className="font-serif text-2xl font-semibold tracking-tight mb-1">
              Works in Tome&rsquo;s Library
            </h2>
            <OrnamentalDivider color={accentColor} />

            {books.length === 0 ? (
              <div
                className="rounded-xl p-8 text-center"
                style={{
                  background: `${accentColor}08`,
                  border: `1px dashed ${accentColor}30`,
                }}
              >
                <p className="text-muted-foreground font-serif italic text-lg">
                  No works in the library yet.
                </p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  We&rsquo;re working on adding more titles.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </section>
        </BlurFade>

        {/* Fun Fact */}
        {author.funFact && (
          <BlurFade delay={0.25} inView>
            <section>
              <div
                className="rounded-xl p-5 flex gap-4 items-start"
                style={{
                  background: "color-mix(in srgb, var(--tome-amber, #f59e0b) 8%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--tome-amber, #f59e0b) 30%, transparent)",
                }}
              >
                <div
                  className="mt-0.5 shrink-0 size-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "color-mix(in srgb, var(--tome-amber, #f59e0b) 20%, transparent)",
                  }}
                >
                  <Lightbulb
                    className="size-4.5"
                    style={{ color: "var(--tome-amber, #f59e0b)" }}
                  />
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: "var(--tome-amber, #f59e0b)" }}
                  >
                    Did You Know?
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/85">{author.funFact}</p>
                </div>
              </div>
            </section>
          </BlurFade>
        )}

        {/* Virgil's Note */}
        {author.virgilNote && (
          <BlurFade delay={0.3} inView>
            <section>
              <div
                className="rounded-xl p-5 flex gap-4 items-start"
                style={{
                  background: "color-mix(in srgb, #6366f1 8%, transparent)",
                  border: "1px solid color-mix(in srgb, #6366f1 25%, transparent)",
                }}
              >
                <div
                  className="mt-0.5 shrink-0 size-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "color-mix(in srgb, #6366f1 20%, transparent)",
                  }}
                >
                  <BookOpen className="size-4.5" style={{ color: "#6366f1" }} />
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: "#6366f1" }}
                  >
                    Virgil&rsquo;s Note
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/85 font-serif italic">
                    {author.virgilNote}
                  </p>
                </div>
              </div>
            </section>
          </BlurFade>
        )}

        {/* More from This Tradition */}
        {relatedAuthors.length > 0 && (
          <BlurFade delay={0.3} inView>
            <section>
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-serif text-2xl font-semibold tracking-tight">
                  More from {author.traditions[0]}
                </h2>
                <Link
                  href={`/explore`}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Explore all
                  <ChevronRight className="size-3.5" />
                </Link>
              </div>
              <OrnamentalDivider color={accentColor} />

              <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-none snap-x snap-mandatory">
                {relatedAuthors.map((relAuthor) => {
                  const relColor = getTraditionColor(relAuthor.traditions)
                  const relLifespan = formatLifespan(relAuthor.birthYear, relAuthor.deathYear)

                  return (
                    <div key={relAuthor.id} className="shrink-0 snap-start">
                      <Link
                        href={`/author/${relAuthor.id}`}
                        className="group flex flex-col items-center gap-3 w-28 text-center rounded-xl p-3 transition-colors hover:bg-muted/60"
                      >
                        <AuthorAvatar name={relAuthor.name} color={relColor} size="md" />
                        <div>
                          <p className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-[color:var(--tome-accent,#6366f1)] transition-colors">
                            {relAuthor.name}
                          </p>
                          {relLifespan && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">{relLifespan}</p>
                          )}
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </section>
          </BlurFade>
        )}
      </div>
    </div>
  )
}
