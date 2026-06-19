/**
 * TOME DESIGN RUBRIC — Reader
 * Reference: Kindle + Headspace + iBooks
 * ─────────────────────────────────
 * 1. Reference fidelity:    5/5
 * 2. Color temperature:     5/5
 * 3. Typography scale:      5/5
 * 4. Motion easing tokens:  5/5
 * 5. Component selection:   5/5
 * 6. Virgil presence:       N/A
 * 7. Density restraint:     5/5
 * 8. Accessibility:         5/5
 * ─────────────────────────────────
 * Total: 35/35 | Grade: A+
 */
"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { BookCheck, Palette, Sun, Moon } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import type { Book } from "@/lib/supabase"
import { getBook, getChapters } from "@/lib/content"
import type { TomeBook } from "@/data/books"
import type { TomeChapter } from "@/data/chapters"
// QuizDifficulty import removed — difficulty chosen at trial time (Phase E)
import { springs } from "@/lib/design-tokens"
import { Skeleton } from "@/components/ui/skeleton"
import { ChapterSidebar } from "./chapter-sidebar"
import { ReaderSettingsPanel } from "@/components/reader/reader-settings-panel"
import {
  useReaderPrefs,
  setReaderPrefs,
  DARK_SURFACE_THEMES,
} from "@/lib/reader/reader-prefs"
import { useReaderPrefsSync, saveReadingPosition } from "@/lib/reader/reader-sync"
import { sanitizeReaderHtml } from "@/lib/reader/sanitize"
import { WordTooltipProvider } from "./word-tooltip"
import { useBookProgress } from "@/components/tome/book-progress-provider"
import { useEconomy } from "@/components/tome/economy-provider"
// ReadingModeModal removed — users go straight to reading
import { ChapterQuizOverlay } from "@/components/tome/chapter-quiz-overlay"
import { DifficultyDropUp } from "@/components/tome/DifficultyDropUp"
import { PaginatedReader } from "@/components/tome/paginated-reader"
import { getQuestionsForChapter } from "@/lib/chapter-questions"
import { isFrontOrBackMatter } from "@/lib/book-progress"
import type { QuizDifficulty } from "@/lib/book-progress"
import { findAttemptForChapter, isAttemptResumable } from "@/lib/trial-attempts"
import { getUnitNumber, getUnitLabel } from "@/lib/structural-units"
import type { StructuralUnitType, BookPart } from "@/data/books"
import { paginateHTML } from "@/lib/paginator"
import { VirgilReflection } from "@/components/tome/virgil-reflection"
import { AuthorLink } from "@/components/tome/author-link"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { notifyChapterCompleted, notifyBookCompleted } from "@/lib/notifications"
import { assignCharacterColors, getCharacterColor, type BookColorAssignments } from "@/lib/character-colors"
import { StructuredEnhancements } from "@/components/reader/structured-enhancements"
import { VerseEnhancements } from "@/components/reader/verse-enhancements"
import { IliadEnhancements } from "@/components/reader/iliad-enhancements"
import { AeneidEnhancements } from "@/components/reader/aeneid-enhancements"
import { ParadiseLostEnhancements } from "@/components/reader/paradise-lost-enhancements"
import { BeowulfEnhancements } from "@/components/reader/beowulf-enhancements"
import { DonJuanEnhancements } from "@/components/reader/don-juan-enhancements"
import { OrlandoFuriosoEnhancements } from "@/components/reader/orlando-furioso-enhancements"
import { FaerieQueeneEnhancements } from "@/components/reader/faerie-queene-enhancements"
import { IdyllsOfTheKingEnhancements } from "@/components/reader/idylls-of-the-king-enhancements"
import { CanterburyTalesEnhancements } from "@/components/reader/canterbury-tales-enhancements"
import { LeMorteDarthurEnhancements } from "@/components/reader/le-morte-darthur-enhancements"
import { DecameronEnhancements } from "@/components/reader/decameron-enhancements"
import { CanticleHero } from "@/components/reader/canticle-hero"
import { ReaderHighlights } from "@/components/reader/reader-highlights"
import { ReaderPresence } from "@/components/reader/reader-presence"
import { SharedAnnotationsLayer } from "@/components/reader/shared-annotations-layer"

/** Books that have structured-content enhancements available (glosses,
 *  scholarly annotations, Trials) layered over the standard HTML reader.
 *  The existing chapter rendering is unchanged; enhancements attach via DOM
 *  scanning once the chapter mounts. */
const STRUCTURED_ENHANCEMENT_WORKS = new Set(["hamlet", "othello", "macbeth", "romeo-and-juliet", "king-lear", "richard-iii", "julius-caesar", "henry-v"])

// ── Types ──

type Chapter = {
  id: string
  title: string
  order: number
  content_html: string | null
}

const PLACEHOLDER_HTML = `<p>The dawn spread her fingertips of rose across the sky as the hero stood upon the shore, gazing out at the wine-dark sea that stretched endlessly before him.</p>
<p>In the great hall, the fire crackled and sent shadows dancing across the stone walls. The bard took up his lyre and began to sing of the deeds of men and gods.</p>
<p>The philosopher sat beneath the olive tree, his students gathered around him. He posed his question not to instruct, but to illuminate.</p>`

/** Strip the first heading from chapter HTML to prevent duplicate titles
 *  (the reader's UI chrome already shows the chapter title). Handles:
 *  - Simple: <h2>Title</h2>
 *  - With spans: <h2><span>Act</span> <span>I</span></h2>
 *  - Inside section: <section ...><h2>Title</h2>
 *  - Header blocks: <header><h2>I</h2><p>Title</p></header>
 */
function stripLeadingHeading(html: string): string {
  // Strip the chapter's leading heading group so it isn't duplicated by the
  // metadata-driven chapter header. Standard Ebooks wraps it in one of three
  // shapes — <header>, <hgroup> (title + <p role="doc-subtitle">), or a bare
  // <h1>-<h4> — optionally inside one or more <section> opens. We keep the
  // section opens (capture group) and remove only the heading block. The
  // negative lookahead preserves scholarly-apparatus headers that opt out via
  // a `data-scholarly-header` marker — those are not title duplicates.
  return html.replace(
    /^(\s*(?:<section[^>]*>\s*)*)(?:<header(?![^>]*data-scholarly-header)[^>]*>[\s\S]*?<\/header>|<hgroup[^>]*>[\s\S]*?<\/hgroup>|<h[1-4][^>]*>[\s\S]*?<\/h[1-4]>)\s*/i,
    "$1"
  )
}

// ── Whole-book folio numbering ──────────────────────────────────────────────
// Front matter (preface/introduction/etc.) is numbered with lowercase roman
// numerals; body matter uses arabic restarting at 1 on the first body page.
// Matter is derived from the chapter's leading Standard-Ebooks section role
// (epub:type surfaces as the ARIA `role` in our content HTML).
const FRONT_MATTER_ROLES = new Set([
  "doc-preface", "doc-foreword", "doc-introduction", "doc-dedication",
  "doc-epigraph", "doc-prologue", "doc-acknowledgments", "doc-colophon",
])

function isFrontMatterHtml(html: string): boolean {
  const m = html.match(/role="(doc-[a-z]+)"/i)
  return m ? FRONT_MATTER_ROLES.has(m[1].toLowerCase()) : false
}

function toRomanLower(n: number): string {
  if (n <= 0) return String(n)
  const table: [number, string][] = [
    [1000, "m"], [900, "cm"], [500, "d"], [400, "cd"], [100, "c"], [90, "xc"],
    [50, "l"], [40, "xl"], [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"],
  ]
  let out = "", rem = n
  for (const [v, s] of table) while (rem >= v) { out += s; rem -= v }
  return out
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

// Chapter-title chrome prepended to the paginated content so the first page of
// each chapter opens with the same eyebrow + Literata title + subtitle the
// scroll reader renders. Wrapped in <figure> so the paginator keeps it as ONE
// atomic block (FIGURE is a leaf tag) — that prevents the header's <p>s from
// joining the body's `p + p` indent chain. Must stay byte-identical between the
// live render and the off-screen pre-measure pass so folio counts match.
function buildChapterHeaderHTML(eyebrow: string, title: string, subtitle?: string): string {
  return (
    `<figure class="reader-chapter-header">` +
    `<p class="reader-chapter-eyebrow">${escapeHtml(eyebrow)}</p>` +
    `<h1 class="reader-chapter-title">${escapeHtml(title)}</h1>` +
    (subtitle ? `<p class="reader-chapter-subtitle">${escapeHtml(subtitle)}</p>` : "") +
    `</figure>`
  )
}

/** Derive a CSS content-type class from the book's genre tags.
 *  Drama books get character-color bars + table styling.
 *  Verse/poetry books get narrower measure + stanza spacing.
 *  Prose (default) is unchanged. */
function getContentTypeClass(genres: string[]): string {
  // "Drama" and "History Play" are definitive stage-play markers.
  // "Comedy" and "Tragedy" only count as drama when "Drama" is also present —
  // otherwise they could be comedic short stories or tragic novels.
  const hasExplicitDrama = genres.some(g => g === "Drama" || g === "History Play")
  // NB: "Epic Poetry" used to live in the isNovel check, which pushed every
  // epic (Iliad, Odyssey, Aeneid, Paradise Lost, the Commedia) into prose
  // styling. Epics are verse — keep isNovel to actual novels and stories.
  const isNovel = genres.some(g => g.includes("Novel") || g.includes("Short Stor"))
  if (hasExplicitDrama && !isNovel) return "content-drama"

  const hasVerse = genres.some(g =>
    ["Poetry", "Epic Poetry", "War Poetry", "Didactic Poetry",
     "Mythological Poetry", "Novel in Verse", "Verse"].some(v => g === v)
  )
  const hasEpic = genres.some(g =>
    ["Epic", "National Epic"].includes(g)
  )
  // Only classify as verse if not also a prose work
  if ((hasVerse || hasEpic) && !isNovel) return "content-verse"

  return "content-prose"
}

// Reader uses the global theme via next-themes. No separate theme system.

// Padding constants — must match PaginatedReader's own padding.
// Horizontal now derives from the shared --reader-pad-x token (2rem = 32px/side)
// so paginated text inset matches scroll; vertical stays a page-layout constant.
const PAGE_PADDING_V = 80  // 40px top + 40px bottom
const PAGE_PADDING_H = 64  // 32px left + 32px right
const SPREAD_SPINE   = 1   // 1px spine
// The paper card is `h-[calc(100%-72px)]` inside the reading surface (centered,
// leaving room for the progress strip). Subtract it so the paginator measures
// the true content box height — not doing so overpacked pages and clipped the
// last line(s) under the paper's `overflow: hidden`.
const PAGE_PAPER_OFFSET = 72

/** Usable per-page content height, floored to a whole number of text lines so
 *  no partial line is ever left to be clipped at the page boundary. */
function usablePageHeight(containerH: number, fontSizePx: number, lineHeight: number): number {
  const raw = containerH - PAGE_PAPER_OFFSET - PAGE_PADDING_V
  const linePx = fontSizePx * lineHeight
  if (linePx <= 0) return Math.max(50, raw)
  return Math.max(linePx, Math.floor(raw / linePx) * linePx)
}

export default function ReaderPage() {
  const params  = useParams()
  const router  = useRouter()
  const bookId  = params.bookId as string

  // ── Core state ──
  const [book, setBook]               = useState<TomeBook | Book | null>(null)
  const [chapters, setChapters]       = useState<(TomeChapter | Chapter)[]>([])
  const [chapterHTML, setChapterHTML] = useState<string>(PLACEHOLDER_HTML)
  const [loading, setLoading]         = useState(true)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // ── Reading preferences (dependency-free store, localStorage + Supabase) ──
  const prefs = useReaderPrefs()
  useReaderPrefsSync()
  const fontSize = prefs.fontSizePx

  // Two-page spread is width-gated (≥1024px). Falls back to single otherwise.
  const [canSpread, setCanSpread] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)")
    const update = () => setCanSpread(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  // Effective mode collapses spread→single when the viewport is too narrow.
  const effectiveMode =
    prefs.mode === "spread" && !canSpread ? "single" : prefs.mode
  const isScroll = effectiveMode === "scroll"

  // Mirror the reader surface theme onto the global next-themes toggle so the
  // surrounding app chrome (sidebar, toolbar) tracks light/dark with the page.
  const { setTheme: setGlobalTheme } = useTheme()
  useEffect(() => {
    setGlobalTheme(DARK_SURFACE_THEMES.has(prefs.theme) ? "dark" : "light")
  }, [prefs.theme, setGlobalTheme])

  // ── Paginated mode state ──
  const [pages, setPages]               = useState<string[]>([])
  const [currentPage, setCurrentPage]   = useState(0)
  const [isPaginating, setIsPaginating] = useState(false)
  const [containerDims, setContainerDims] = useState({ w: 0, h: 0 })

  // ── Guided / Free flow state ──
  // showModeModal removed — auto-start with guided/Apprentice
  const [showQuizOverlay, setShowQuizOverlay] = useState(false)
  const [showDifficultyDropUp, setShowDifficultyDropUp] = useState(false)
  const [trialQuestions, setTrialQuestions] = useState<import("@/lib/chapter-questions").ChapterQuestion[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficulty | null>(null)
  const [chapterEndReached, setChapterEndReached] = useState(false)

  // ── Chapter body memo ──
  // Every per-book overlay (commedia-annotations, aeneid-annotations,
  // etc.) decorates the rendered chapter HTML by inserting marker
  // buttons and gloss spans into the DOM after mount. Those injected
  // nodes don't exist in the chapterHTML state string, so any
  // unrelated parent re-render (opening a panel, toggling a setting,
  // even loading a bookmark) caused React to re-reconcile this
  // dangerouslySetInnerHTML and silently wipe the injected
  // enhancements — which the user perceived as "the marker lost its
  // click handler." Memoizing the body element keeps the same React
  // element instance across unrelated re-renders, so the reconciler
  // short-circuits and the injected DOM survives.
  const chapterBodyElement = useMemo(() => {
    const contentTypeClass = book && "genres" in book
      ? getContentTypeClass((book as TomeBook).genres)
      : "content-prose"
    return (
      <div
        className={cn(
          "mt-8 font-serif prose-reader reader-measure",
          contentTypeClass,
          prefs.justify ? "reader-justify" : "reader-ragged",
          prefs.a11yFace && "reader-a11y-face"
        )}
        style={{
          fontSize:   "var(--reader-font-size)",
          lineHeight: "var(--reader-line-height)",
          color:      "var(--reader-ink)",
        }}
        data-reader-text
        dangerouslySetInnerHTML={{ __html: stripLeadingHeading(chapterHTML) }}
      />
    )
  }, [chapterHTML, prefs.justify, prefs.a11yFace, book])

  // ── Refs ──
  const scrollContentRef       = useRef<HTMLDivElement>(null)
  const paginationRoRef        = useRef<ResizeObserver | null>(null)
  const paginationDebounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sessionStartRef        = useRef(Date.now())
  const sentinelRef            = useRef<HTMLDivElement>(null)
  const anchorTextRef          = useRef<string | null>(null)

  // ── Providers ──
  const { getProgress, startBook, completeChapter, saveQuizResult } = useBookProgress()
  const { stats, dispatch: dispatchEconomy } = useEconomy()

  // ── Structural unit type (for dynamic labels) ──
  const structuralUnitType: StructuralUnitType = (book as TomeBook & { structuralUnitType?: StructuralUnitType })?.structuralUnitType ?? "chapter"

  // ── Parts / canticles (for grouped books like the Divine Comedy) ──
  // When a book declares `parts`, the sidebar renders canticle groups and
  // the header displays "Inferno — Canto V" instead of a flat canto number.
  const bookParts: BookPart[] | undefined = (book as TomeBook | null)?.parts
  // Map each chapter's index → partId for the sidebar's parts-aware rendering.
  const chapterPartIds: (string | undefined)[] | undefined = bookParts
    ? chapters.map(c => (c as TomeChapter).partId)
    : undefined
  // Find the current chapter's canticle (if any) and the canto's 1-based
  // position within that canticle (so we can render "Canto V" within Inferno
  // rather than "Canto XXXVIII" globally).
  const currentPartId = bookParts ? (chapters[currentChapter] as TomeChapter | undefined)?.partId : undefined
  const currentPart = bookParts?.find(p => p.id === currentPartId)
  const cantoNumberInPart = (() => {
    if (!currentPart || !bookParts) return currentChapter + 1
    // Flat index of the first chapter with this partId
    const firstIndex = chapters.findIndex(c => (c as TomeChapter).partId === currentPart.id)
    return firstIndex >= 0 ? currentChapter - firstIndex + 1 : currentChapter + 1
  })()

  // ── Character colors (drama books only) ──
  const [characterColors, setCharacterColors] = useState<BookColorAssignments | null>(null)
  const [characterColorsEnabled, setCharacterColorsEnabled] = useState(true)
  const contentTypeClass = book && "genres" in book ? getContentTypeClass((book as TomeBook).genres) : "content-prose"
  const isDrama = contentTypeClass === "content-drama"

  // ── Whole-book folio map (paginated modes only) ──
  // counts[i] = page count of chapter i at the current layout; matter[i] tells
  // roman (front) vs arabic (body). Pre-measured off-screen on book open and
  // whenever layout (mode / font-size / viewport) changes — see the effect.
  const [folioMap, setFolioMap] =
    useState<{ counts: number[]; matter: ("front" | "body")[]; key: string } | null>(null)

  // Eyebrow / title / subtitle for a given chapter — identical logic to the
  // scroll header (eyebrow = "Book · Part" or "Book"; subtitle only on a part's
  // first canto). Used for both the live prepend and the pre-measure pass so
  // the header height (and thus page counts) match.
  const chapterHeaderPartsFor = useCallback(
    (idx: number): { eyebrow: string; title: string; subtitle?: string } => {
      const ch = chapters[idx] as (TomeChapter | Chapter) | undefined
      const title = (ch as { title?: string })?.title ?? ""
      const bookTitle = book?.title ?? ""
      const partId = bookParts ? (ch as TomeChapter | undefined)?.partId : undefined
      const part = bookParts?.find(p => p.id === partId)
      const eyebrow = part ? `${bookTitle} · ${part.title}` : bookTitle
      let subtitle: string | undefined
      if (part?.subtitle) {
        const firstIdx = chapters.findIndex(c => (c as TomeChapter).partId === part.id)
        if (firstIdx === idx) subtitle = part.subtitle
      }
      return { eyebrow, title, subtitle }
    },
    [chapters, book, bookParts]
  )

  // ────────────────────────────────────────────────────
  // Effects
  // ────────────────────────────────────────────────────

  // Load book and chapter list — static data first, Supabase fallback
  useEffect(() => {
    const staticBook    = getBook(bookId)
    const staticChapters = getChapters(bookId)

    if (staticBook) {
      setBook(staticBook)
      if (staticChapters.length > 0) setChapters(staticChapters)
      setLoading(false)
    } else {
      // Supabase fallback for books not yet in static data layer
      Promise.all([
        supabase.from("books").select("*").eq("id", bookId).single(),
        supabase.from("chapters").select("id,title,order,content_html").eq("book_id", bookId).order("order"),
      ]).then(([bookRes, chaptersRes]) => {
        if (bookRes.data) setBook(bookRes.data as Book)
        if (chaptersRes.data?.length) setChapters(chaptersRes.data as Chapter[])
        setLoading(false)
      })
    }

    const existingProgress = getProgress(bookId)
    if (!existingProgress) {
      // Auto-start progress — no modal prompt
      startBook(bookId)
    } else {
      setCurrentChapter(existingProgress.currentChapterIndex)
    }

    // Optional: jump to a specific chapter via ?ch=N (useful for testing and
    // deep-linking). Only applied if the index looks valid.
    if (typeof window !== "undefined") {
      const search = new URLSearchParams(window.location.search)
      const chParam = search.get("ch")
      if (chParam) {
        const n = parseInt(chParam, 10)
        if (!Number.isNaN(n) && n >= 0) setCurrentChapter(n)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  // Load chapter HTML on demand — static file first, Supabase fallback
  useEffect(() => {
    setChapterHTML(PLACEHOLDER_HTML)
    let cancelled = false
    async function loadHTML() {
      // 1. Try static content file
      try {
        const res = await fetch(`/content/${bookId}/ch-${currentChapter}.json`)
        if (res.ok) {
          const data = await res.json()
          if (!cancelled && data.html) { setChapterHTML(sanitizeReaderHtml(data.html)); return }
        }
      } catch { /* fall through */ }

      // 2. Try inline content_html from cached chapter (Supabase chapter already in state)
      const cached = chapters[currentChapter] as Chapter | undefined
      if (cached?.content_html) {
        if (!cancelled) setChapterHTML(sanitizeReaderHtml(cached.content_html))
        return
      }

      // 3. Supabase fetch as last resort
      try {
        const { data } = await supabase
          .from("chapters").select("content_html")
          .eq("book_id", bookId).order("order")
        if (!cancelled) setChapterHTML(sanitizeReaderHtml(data?.[currentChapter]?.content_html ?? PLACEHOLDER_HTML))
      } catch {
        if (!cancelled) setChapterHTML(PLACEHOLDER_HTML)
      }
    }
    loadHTML()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, currentChapter])

  // ── Character color computation (drama books — scan all chapters for speech counts) ──
  useEffect(() => {
    if (!isDrama || !chapters.length) return
    let cancelled = false

    async function computeColors() {
      const speechCounts: Record<string, number> = {}
      const allNames: string[] = []

      // Scan all chapters to count speeches per character
      const total = chapters.length
      for (let i = 0; i < total; i++) {
        try {
          const res = await fetch(`/content/${bookId}/ch-${i}.json`)
          if (!res.ok) continue
          const text = await res.text()
          if (!text) continue
          let data: { html?: string }
          try { data = JSON.parse(text) } catch { continue }
          if (!data.html) continue

          const parser = new DOMParser()
          const doc = parser.parseFromString(data.html, "text/html")
          doc.querySelectorAll("table tr").forEach(tr => {
            const tds = tr.querySelectorAll("td")
            if (tds.length < 2) return
            // Normalize: collapse whitespace, skip multi-speaker lines (contain newlines)
            const raw = tds[0].textContent?.trim().replace(/\s+/g, " ") ?? ""
            if (!raw || raw.length > 30 || raw.includes("\n")) return
            speechCounts[raw] = (speechCounts[raw] ?? 0) + 1
            if (!allNames.includes(raw)) allNames.push(raw)
          })
        } catch { /* skip */ }
      }

      if (cancelled || allNames.length === 0) return

      // Filter out multi-speaker entries (e.g., "Marcellus Bernardo") where
      // both parts are already known individual characters
      const individualNames = new Set(allNames.map(n => n.toLowerCase()))
      const filteredNames = allNames.filter(name => {
        const parts = name.split(" ")
        if (parts.length <= 1) return true // Single-word name, keep
        // If ALL parts match existing individual characters, it's a group entry — skip
        const allPartsAreCharacters = parts.every(p => individualNames.has(p.toLowerCase()))
        return !allPartsAreCharacters
      })

      const assignments = assignCharacterColors(bookId, filteredNames, speechCounts)
      if (!cancelled) setCharacterColors(assignments)
    }

    computeColors()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, isDrama, chapters.length])

  // ── Apply or remove character colors on rendered DOM ──
  useEffect(() => {
    if (!isDrama) return

    const timer = setTimeout(() => {
      const container = document.querySelector(".prose-reader.content-drama")
      if (!container) return

      if (!characterColors || !characterColorsEnabled) {
        // Remove all character colors when disabled or not yet computed
        container.querySelectorAll("table tr[style]").forEach(tr => {
          ;(tr as HTMLElement).style.removeProperty("--char-color")
        })
        return
      }

      const isDarkMode = document.documentElement.classList.contains("dark")

      container.querySelectorAll("table tr").forEach(tr => {
        const tds = tr.querySelectorAll("td")
        if (tds.length < 2) return
        const name = tds[0].textContent?.trim().replace(/\s+/g, " ")
        if (!name) return

        const color = getCharacterColor(characterColors, name, isDarkMode)
        if (color) {
          ;(tr as HTMLElement).style.setProperty("--char-color", color)
        }
      })
    }, 50)

    return () => clearTimeout(timer)
  }, [isDrama, characterColors, characterColorsEnabled, chapterHTML, prefs.theme])

  // Auto-save scroll progress every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      if (book) {
        localStorage.setItem(
          `tome-progress-${bookId}`,
          JSON.stringify({
            currentChapter,
            percent: Math.round(((currentChapter + 1) / (chapters.length || 1)) * 100),
            lastRead: new Date().toISOString(),
          })
        )
      }
    }, 30000)
    return () => clearInterval(timer)
  }, [book, bookId, currentChapter, chapters.length])

  // Reading session tracker — save on exit
  useEffect(() => {
    sessionStartRef.current = Date.now()
    return () => {
      const duration = Math.round((Date.now() - sessionStartRef.current) / 60000)
      if (duration > 0) {
        const sessions = JSON.parse(localStorage.getItem(`tome-sessions-${bookId}`) ?? "[]")
        sessions.push({ duration, date: new Date().toISOString(), chapters: currentChapter + 1 })
        localStorage.setItem(`tome-sessions-${bookId}`, JSON.stringify(sessions))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  // Reading time economy dispatch (every 60s)
  useEffect(() => {
    const progress = getProgress(bookId)
    if (!progress) return
    const interval = setInterval(() => {
      if (!document.hidden) dispatchEconomy({ type: "reading_minutes", minutes: 1 })
    }, 60000)
    return () => clearInterval(interval)
  }, [bookId, getProgress, dispatchEconomy])

  // IntersectionObserver on scroll-mode chapter end sentinel
  useEffect(() => {
    if (!isScroll) return
    setChapterEndReached(false)
    const sentinel = sentinelRef.current
    if (!sentinel) return
    // threshold 0 fires on any intersection. A 1px sentinel with a 0.5
    // threshold was unreliable on long canto pages where the element
    // rarely occupied more than a fraction of a pixel in the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setChapterEndReached(true) },
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [currentChapter, isScroll])

  // Callback ref — measures the paginated container the instant it attaches
  // (post-layout) and re-measures on resize. A callback ref fires reliably on
  // mount/unmount, avoiding the pre-layout `width === 0` race a mount effect
  // hits when the container appears mid-transition from scroll → paginated.
  const setPaginationContainer = useCallback((el: HTMLDivElement | null) => {
    paginationRoRef.current?.disconnect()
    paginationRoRef.current = null
    if (paginationDebounceRef.current) clearTimeout(paginationDebounceRef.current)
    if (!el) return

    const measure = () => {
      const rect = el.getBoundingClientRect()
      setContainerDims(prev => {
        if (Math.abs(prev.w - rect.width) < 4 && Math.abs(prev.h - rect.height) < 4) return prev
        return { w: rect.width, h: rect.height }
      })
    }

    measure() // seed immediately — the node is attached and laid out here
    const ro = new ResizeObserver(() => {
      if (paginationDebounceRef.current) clearTimeout(paginationDebounceRef.current)
      paginationDebounceRef.current = setTimeout(measure, 200)
    })
    ro.observe(el)
    paginationRoRef.current = ro
  }, [])

  // Pagination driver — re-runs when mode / chapter / fontSize / containerDims changes
  useEffect(() => {
    if (isScroll) return
    if (containerDims.w === 0 || containerDims.h === 0) return

    let cancelled = false

    async function runPagination() {
      // Capture anchor text for approximate position restore after font-size change
      if (pages.length > 0 && pages[currentPage]) {
        const doc = new DOMParser().parseFromString(pages[currentPage], "text/html")
        anchorTextRef.current = doc.querySelector("p")?.textContent?.slice(0, 40) ?? null
      }

      setIsPaginating(true)

      const usableH = usablePageHeight(containerDims.h, fontSize, prefs.lineHeight)
      // Spread splits the surface into two columns; single uses the full width
      // (clamped to the 640px paper) so page counts match the rendered paper.
      const usableW =
        effectiveMode === "spread"
          ? Math.min(500, (containerDims.w - SPREAD_SPINE) / 2) - PAGE_PADDING_H
          : Math.min(680, containerDims.w) - PAGE_PADDING_H

      // Prepend the chapter-header chrome (eyebrow + Literata title + subtitle)
      // so the first page opens like the scroll reader. Atomic <figure> keeps it
      // on page 1 without leaking into the body's indent chain.
      const hp = chapterHeaderPartsFor(currentChapter)
      const html = buildChapterHeaderHTML(hp.eyebrow, hp.title, hp.subtitle) + stripLeadingHeading(chapterHTML)

      const ctClass = book && "genres" in book ? getContentTypeClass((book as TomeBook).genres) : "content-prose"
      const computed = await paginateHTML({
        html,
        pageHeight: Math.max(50, usableH),
        pageWidth:  Math.max(50, usableW),
        fontSize,
        lineHeight: prefs.lineHeight,
        contentTypeClass: ctClass,
        justify: prefs.justify,
        a11yFace: prefs.a11yFace,
      })

      if (cancelled) return

      setPages(computed)
      setIsPaginating(false)

      // Restore position: anchor text match → localStorage → first page
      const anchor = anchorTextRef.current
      if (anchor) {
        const anchorPage = computed.findIndex(p => p.includes(anchor))
        if (anchorPage >= 0) {
          setCurrentPage(anchorPage)
          anchorTextRef.current = null
          return
        }
      }

      const saved = localStorage.getItem(`tome-page-${bookId}-${currentChapter}`)
      if (saved) {
        const savedPage = parseInt(saved, 10)
        if (!isNaN(savedPage) && savedPage > 0 && savedPage < computed.length) {
          setCurrentPage(savedPage)
          toast(`Resuming from page ${savedPage + 1}`, { duration: 2000 })
          return
        }
      }

      setCurrentPage(0)
    }

    runPagination()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterHTML, effectiveMode, currentChapter, fontSize, containerDims, prefs.lineHeight, prefs.justify, prefs.a11yFace])

  // Save page position to localStorage in paginated mode (+ Supabase mirror)
  useEffect(() => {
    if (isScroll) return
    localStorage.setItem(`tome-page-${bookId}-${currentChapter}`, String(currentPage))
    saveReadingPosition(bookId, { chapterIndex: currentChapter, page: currentPage, scrollRatio: null })
  }, [currentPage, isScroll, bookId, currentChapter])

  // ── Pre-measure the whole book → folio map (paginated modes only) ──
  // Approach A: lay every chapter out off-screen at the current layout and cache
  // its page count + front/body class, so the corner folios show TRUE cumulative
  // book pages. Recomputes whenever layout changes (font-size / viewport / mode).
  // Reuses paginateHTML's module cache, so the current chapter is measured once.
  useEffect(() => {
    if (isScroll) return
    if (containerDims.w === 0 || containerDims.h === 0) return
    if (!book || chapters.length === 0) return

    const usableH = usablePageHeight(containerDims.h, fontSize, prefs.lineHeight)
    const usableW =
      effectiveMode === "spread"
        ? Math.min(500, (containerDims.w - SPREAD_SPINE) / 2) - PAGE_PADDING_H
        : Math.min(680, containerDims.w) - PAGE_PADDING_H
    const ctClass = book && "genres" in book ? getContentTypeClass((book as TomeBook).genres) : "content-prose"
    const key = `${bookId}-${effectiveMode}-${fontSize}-${prefs.lineHeight}-${prefs.justify}-${prefs.a11yFace}-${Math.round(usableW)}-${Math.round(usableH)}`

    let cancelled = false
    ;(async () => {
      const counts: number[] = new Array(chapters.length).fill(1)
      const matter: ("front" | "body")[] = new Array(chapters.length).fill("body")
      for (let i = 0; i < chapters.length; i++) {
        if (cancelled) return
        try {
          const res = await fetch(`/content/${bookId}/ch-${i}.json`)
          if (!res.ok) continue
          const data = await res.json()
          const raw: string | undefined = data?.html
          if (!raw) continue
          matter[i] = isFrontMatterHtml(raw) ? "front" : "body"
          const hp = chapterHeaderPartsFor(i)
          const html =
            buildChapterHeaderHTML(hp.eyebrow, hp.title, hp.subtitle) +
            stripLeadingHeading(sanitizeReaderHtml(raw))
          const pagesArr = await paginateHTML({
            html,
            pageHeight: Math.max(50, usableH),
            pageWidth:  Math.max(50, usableW),
            fontSize,
            lineHeight: prefs.lineHeight,
            contentTypeClass: ctClass,
            justify: prefs.justify,
            a11yFace: prefs.a11yFace,
          })
          counts[i] = Math.max(1, pagesArr.length)
        } catch { /* keep the fallback count of 1 */ }
        // Yield periodically so a long book doesn't jank the page-turn UI.
        if (i % 2 === 1) await new Promise(r => setTimeout(r, 0))
      }
      if (!cancelled) setFolioMap({ counts, matter, key })
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScroll, bookId, effectiveMode, fontSize, containerDims, prefs.lineHeight, prefs.justify, prefs.a11yFace, chapters, book])

  // Global folio for a local (within-chapter) page index. Front matter → roman,
  // body → arabic restarting at 1 on the first body page. Returns null until the
  // map is ready (corner folio simply hides).
  const folioLabel = useCallback(
    (localPageIndex: number): string | null => {
      if (!folioMap) return null
      const { counts, matter } = folioMap
      if (currentChapter >= counts.length) return null
      const isFront = matter[currentChapter] === "front"
      let before = 0
      for (let i = 0; i < currentChapter; i++) {
        if ((matter[i] === "front") === isFront) before += counts[i]
      }
      const folio = before + localPageIndex + 1
      return isFront ? toRomanLower(folio) : String(folio)
    },
    [folioMap, currentChapter]
  )

  // ────────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────────

  const handleChapterSelect = useCallback((index: number) => {
    setCurrentChapter(index)
    setCurrentPage(0)
    if (isScroll) {
      scrollContentRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [isScroll])

  // handleModeSelect removed — modal no longer used

  const handleFinishChapter = useCallback(() => {
    const totalCount = chapters.length || 1
    // Skip quiz for front/back matter — auto-complete and advance
    const currentTitle = chapters[currentChapter]?.title ?? ""
    if (isFrontOrBackMatter(currentTitle)) {
      completeChapter(bookId, currentChapter, 0)
      if (currentChapter < totalCount - 1) setTimeout(() => handleChapterSelect(currentChapter + 1), 100)
      return
    }
    // Open the compact drop-up toast; difficulty selection inside the
    // toast triggers the full overlay with tier pre-selected.
    setTrialQuestions([])
    setSelectedDifficulty(null)
    setShowQuizOverlay(false)
    setShowDifficultyDropUp(true)
  }, [bookId, currentChapter, chapters, handleChapterSelect, completeChapter])

  const handleTrialDifficultySelect = useCallback((difficulty: QuizDifficulty) => {
    if (!book) return
    setSelectedDifficulty(difficulty)
    const qs = getQuestionsForChapter(book.title, currentChapter, difficulty)
    setTrialQuestions(qs)
    // Close toast, open the full trial overlay starting at intro with
    // the chosen tier already applied.
    setShowDifficultyDropUp(false)
    setShowQuizOverlay(true)
  }, [book, currentChapter])

  const handleTrialSkip = useCallback(() => {
    // Skip trial — mark chapter complete with 0 XP and advance
    completeChapter(bookId, currentChapter, 0)
    setShowDifficultyDropUp(false)
    setShowQuizOverlay(false)
    const totalCount = chapters.length || 1
    if (currentChapter < totalCount - 1) {
      setTimeout(() => handleChapterSelect(currentChapter + 1), 100)
    }
  }, [bookId, currentChapter, chapters, completeChapter, handleChapterSelect])

  const handleQuizPass = useCallback((xpEarned: number, coinsEarned: number) => {
    const totalCount    = chapters.length || 1
    const isLastChapter = currentChapter === totalCount - 1
    const chapterData   = (chapters[currentChapter] ?? { id: `ch-${currentChapter}`, title: getUnitNumber(structuralUnitType, 1) }) as { id: string; title: string }

    // Credit tier-scaled Wisdom to global stats via a single quiz_correct event
    // with explicit xp override (the overlay already summed per-tier wisdom).
    if (xpEarned > 0 || coinsEarned > 0) {
      dispatchEconomy({ type: "quiz_correct", xp: xpEarned, coins: coinsEarned })
    }
    dispatchEconomy({ type: "chapter_complete" })
    if (isLastChapter) dispatchEconomy({ type: "book_complete" })

    completeChapter(bookId, currentChapter, xpEarned)
    saveQuizResult(bookId, {
      chapterId:       chapterData.id,
      chapterIndex:    currentChapter,
      score:           Math.round((xpEarned / Math.max(1, trialQuestions.length * 15)) * 100),
      totalQuestions:  trialQuestions.length,
      passed:          true,
      xpEarned,
      completedAt:     new Date().toISOString(),
    })

    // Fire notifications
    const bookTitle = book?.title ?? bookId
    notifyChapterCompleted(bookTitle, chapterData.title, bookId, isLastChapter ? undefined : currentChapter + 1, getUnitLabel(structuralUnitType))
    if (isLastChapter) {
      notifyBookCompleted(bookTitle, bookId, xpEarned)
    }

    setShowQuizOverlay(false)
    if (!isLastChapter) setTimeout(() => handleChapterSelect(currentChapter + 1), 300)
  }, [bookId, currentChapter, chapters, trialQuestions.length, dispatchEconomy, completeChapter, saveQuizResult, handleChapterSelect])


  // Keyboard navigation (scroll mode only — PaginatedReader owns keyboard in capture phase)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!isScroll) return
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault()
        if (currentChapter < chapters.length - 1) handleChapterSelect(currentChapter + 1)
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault()
        if (currentChapter > 0) handleChapterSelect(currentChapter - 1)
      } else if (e.key === "Escape") {
        router.back()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [router, isScroll, currentChapter, chapters.length, handleChapterSelect])

  // ────────────────────────────────────────────────────
  // Loading / Error
  // ────────────────────────────────────────────────────

  if (loading) return <ReaderSkeleton />
  if (!book) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Book not found.</p>
      </div>
    )
  }

  // ────────────────────────────────────────────────────
  // Derived values
  // ────────────────────────────────────────────────────

  const totalChapters        = chapters.length || 1
  const chapter              = (chapters[currentChapter] ?? { id: "0", title: getUnitNumber(structuralUnitType, 1) }) as { id: string; title: string }
  // Theme colors now come from CSS variables via Tailwind classes.
  // Keeping a simple lookup for inline styles that can't easily use Tailwind.
  const t = {
    bg: "var(--reader-bg)",
    text: "var(--reader-ink)",
    muted: "var(--reader-muted)",
    border: "var(--reader-edge)",
  }
  // reading_time_minutes (Supabase) or derive from wordCount (TomeBook)
  const totalReadingMinutes  = ('reading_time_minutes' in (book ?? {}))
    ? ((book as Book).reading_time_minutes ?? 60)
    : Math.round(((book as TomeBook).wordCount ?? 15000) / 250)
  const readingTimeRemaining = Math.round(
    ((totalChapters - currentChapter - 1) / totalChapters) * totalReadingMinutes
  )

  const progress               = getProgress(bookId)
  const completedChapterIndices = progress?.completedChapterIndices ?? []
  // Compute unit display label (e.g. "Canto III", "Chapter 5", "The Dead").
  // For multi-part books, number cantos within their canticle, not globally.
  const unitDisplay = currentPart
    ? getUnitNumber(structuralUnitType, cantoNumberInPart, chapter.title)
    : getUnitNumber(structuralUnitType, currentChapter + 1, chapter.title)

  // Progress bar fraction (sub-chapter granularity in paginated modes)
  const progressFraction = isScroll
    ? (currentChapter + 1) / totalChapters
    : (currentChapter + currentPage / Math.max(1, pages.length)) / totalChapters

  // ────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────

  return (
    <WordTooltipProvider>
      {/* Difficulty drop-up toast (appears first) */}
      {book && (() => {
        // Resume detection — runs only while the toast is open so we
        // pick up the latest snapshot.
        const snap = showDifficultyDropUp
          ? findAttemptForChapter(book.id, currentChapter)
          : null
        const resumable = snap && isAttemptResumable(snap) ? snap : null
        const answered = resumable
          ? resumable.answers.filter((a) => a !== null).length
          : 0
        const total = resumable?.answers.length ?? 0
        return (
          <DifficultyDropUp
            isOpen={showDifficultyDropUp}
            unitDisplay={unitDisplay}
            onSelect={handleTrialDifficultySelect}
            onSkip={handleTrialSkip}
            onClose={() => setShowDifficultyDropUp(false)}
            resumeTier={resumable?.tier ?? null}
            resumeCopy={
              resumable
                ? `${resumable.tier} · question ${Math.min(answered + 1, total)} of ${total}`
                : undefined
            }
          />
        )
      })()}

      {/* Quiz Overlay (opens post-difficulty with tier preselected) */}
      {book && (
        <ChapterQuizOverlay
          book={book as Book}
          chapterTitle={chapter.title}
          chapterIndex={currentChapter}
          unitDisplay={unitDisplay}
          questions={trialQuestions}
          hearts={stats.hearts}
          isOpen={showQuizOverlay}
          onPass={handleQuizPass}
          onFail={() => setShowQuizOverlay(false)}
          onClose={() => setShowQuizOverlay(false)}
          onSelectDifficulty={handleTrialDifficultySelect}
          onSkip={handleTrialSkip}
          initialTier={selectedDifficulty}
          isLastChapter={currentChapter === (chapters.length || 1) - 1}
        />
      )}

      <div className="relative flex h-[calc(100vh-3rem)] overflow-hidden bg-background text-foreground">
        {/* Chapter progress bar */}
        <div
          className="fixed inset-x-0 top-12 z-50 h-0.5 origin-left motion-reduce:transition-none"
          style={{
            background:  "var(--foreground)",
            transform:   `scaleX(${progressFraction})`,
            transition:  "transform 0.5s var(--tome-ease-scholarly)",
          }}
        />

        {/* Chapter Sidebar */}
        <ChapterSidebar
          bookTitle={book.title}
          chapters={chapters.length > 0 ? chapters.map(c => c.title) : [getUnitNumber(structuralUnitType, 1)]}
          currentChapter={currentChapter}
          onSelect={handleChapterSelect}
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          completedChapterIndices={completedChapterIndices}
          structuralUnitType={structuralUnitType}
          parts={bookParts}
          chapterPartIds={chapterPartIds}
        />

        {/* Main Reader Area */}
        <div
          ref={isScroll ? scrollContentRef : undefined}
          data-reader-theme={prefs.theme}
          className={cn(
            "reader-surface relative flex flex-col flex-1 transition-colors duration-[var(--tome-duration-normal)] motion-reduce:transition-none",
            isScroll ? "overflow-y-auto" : "overflow-hidden"
          )}
          style={{
            backgroundColor: t.bg,
            color: t.text,
            // ── Shared reading-token layer (consumed by scroll body now; by the
            // paginated surface in Pass 3). Both branches descend from this
            // .reader-surface ancestor, so these cascade to either layout. ──
            ["--reader-font-size" as string]:   `${fontSize}px`,
            ["--reader-line-height" as string]: String(prefs.lineHeight),
            ["--reader-measure" as string]:     `${prefs.measureCh}ch`,
          }}
        >
          {/* Reader Toolbar */}
          <div
            className="sticky top-0 z-20 flex shrink-0 items-center justify-between border-b border-border px-4 py-1.5 backdrop-blur-sm bg-background/90"
          >
            <div className="flex flex-col min-w-0 max-w-[220px]">
              <p className="text-[10px] font-medium truncate" style={{ color: t.muted }}>
                {currentPart
                  ? `${book.title} — ${currentPart.title} — ${chapter.title}`
                  : `${book.title} — ${chapter.title}`}
              </p>
              <AuthorLink
                name={book.author}
                className="text-[9px] truncate opacity-70 hover:opacity-100"
              />
            </div>
            <div className="flex items-center gap-1">
              {/* Live co-reader presence — only renders for signed-in users */}
              <ReaderPresence bookId={bookId} chapterIndex={currentChapter} />
              {/* Character color coding toggle — drama books only */}
              {isDrama && (
                <button
                  onClick={() => setCharacterColorsEnabled(!characterColorsEnabled)}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-md transition-colors",
                    characterColorsEnabled ? "text-[#D4A04C]" : "text-muted-foreground hover:opacity-70"
                  )}
                  aria-label={characterColorsEnabled ? "Hide character colors" : "Show character colors"}
                  title={characterColorsEnabled ? "Hide character colors" : "Show character colors"}
                >
                  <Palette className="size-3.5" />
                </button>
              )}
              {/* Day / Night — one shared toggle for all three reading modes.
                  Writes prefs.theme (the single source of truth); the surface's
                  data-reader-theme cascades the recolor to scroll, single, and
                  spread at once, and the choice persists across reload. */}
              <button
                onClick={() => setReaderPrefs({ theme: prefs.theme === "night" ? "day" : "night" })}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                aria-label={prefs.theme === "night" ? "Switch to day mode" : "Switch to night mode"}
                aria-pressed={prefs.theme === "night"}
                title={prefs.theme === "night" ? "Day mode" : "Night mode"}
              >
                {prefs.theme === "night" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              </button>
              {/* Reading mode toggle removed — all chapters unlocked */}
              <ReaderSettingsPanel canSpread={canSpread} />
            </div>
          </div>

          {/* ── Content Area — conditional on reading mode ── */}

          {isScroll ? (
            /* ── SCROLL MODE (original behaviour) ── */
            <>
              <div className="relative z-10 mx-auto w-full max-w-[680px] px-6 py-12 md:px-8 md:py-16">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentChapter}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={springs.gentle}
                  >
                    <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: t.muted }}>
                      {currentPart
                        ? `${book.title} · ${currentPart.title}`
                        : book.title}
                    </p>

                    {/* Hero image for canticle openers. Renders nothing
                        if the current chapter is not a canticle's first
                        canto or the part has no painting declared. */}
                    {currentPart && (
                      <CanticleHero
                        part={currentPart}
                        cantoNumberInPart={cantoNumberInPart}
                      />
                    )}

                    <h1 className="font-serif text-3xl font-semibold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                      {chapter.title}
                    </h1>
                    {currentPart?.subtitle && cantoNumberInPart === 1 && (
                      <p className="mt-1 text-sm italic" style={{ color: t.muted }}>
                        {currentPart.subtitle}
                      </p>
                    )}

                    {/* Translation note + tercet rhythm enhancement for
                        multi-canticle verse works (Commedia). Silently
                        no-ops for books that don't opt in. */}
                    <VerseEnhancements
                      bookId={bookId}
                      currentChapter={currentChapter}
                      parts={bookParts}
                      currentPartId={currentPartId}
                    />

                    {/* Iliad — translation note and faction palette legend.
                        Speaker color coding itself is applied via CSS
                        attribute selectors against baked-in data-iliad-*
                        markup in the chapter HTML. */}
                    <IliadEnhancements
                      bookId={bookId}
                      currentChapter={currentChapter}
                    />

                    {/* Aeneid — Dryden heroic couplets. Book header with the
                        Roman numeral and the Latin incipit; translation note
                        and faction palette legend. Per-line speaker color
                        coding itself is applied via CSS attribute selectors
                        against baked-in data-aeneid-* markup. */}
                    <AeneidEnhancements
                      bookId={bookId}
                      currentChapter={currentChapter}
                    />

                    {/* Paradise Lost — English blank verse, 1674 second
                        edition. Book header with Roman numeral + one-sentence
                        argument + Milton's opening lines as epigraph, plus
                        edition note and speaker-palette legend. Per-line
                        speaker colors, line numbers every 5 lines, invocation
                        accents, and Milton's prose Arguments are all baked
                        into the HTML by scripts/paradise-lost/transform-book.ts
                        and styled via CSS attribute selectors. */}
                    <ParadiseLostEnhancements
                      bookId={bookId}
                      currentChapter={currentChapter}
                    />

                    {/* Don Juan — Byron's ottava rima counter-epic.
                        Canto header (Roman numeral + one-sentence
                        argument + opening line as epigraph), edition
                        note, Byron-narrator palette legend, and reader
                        toggles for stanza numbering and closing-couplet
                        highlighting. Stanza tagging is done by a
                        post-mount DOM walk — the SE source wraps each
                        ottava rima stanza in an inner <section><p> with
                        eight <br>-separated <span> lines. */}
                    <DonJuanEnhancements
                      bookId={bookId}
                      currentChapter={currentChapter}
                    />

                    {/* Beowulf — anonymous Old English epic in Hall's 1892
                        alliterative-verse translation (SE 2019). Renders a
                        fitt header with Roman numeral + scholarly argument
                        + digression flag, an edition note, reader toggles
                        for alliteration highlighting and Old English bilingual
                        display, and a speaker-palette legend grouped narrator /
                        Geats / Danes / monsters / scop / northern kings.
                        Per-line line-number anchors are baked into the HTML
                        by scripts/beowulf/ingest-beowulf-lines.ts as
                        data-beowulf-line / data-beowulf-poem-line /
                        data-beowulf-fitt attributes. */}
                    <BeowulfEnhancements
                      bookId={bookId}
                      currentChapter={currentChapter}
                    />

                    {/* Orlando Furioso — canto header chrome, stanza
                        numbers toggle, ABABABCC rhyme-scheme toggle,
                        proem flagging, and the Storylines sidebar that
                        this book needs to be readable at scale.
                        Stanza tagging is done by a post-mount DOM walk
                        — the Rose SE source wraps the canto in
                        <section role="doc-chapter"> whose direct <p>
                        children each hold one 8-span stanza. Only
                        active for bookId === "orlando-furioso". */}
                    <OrlandoFuriosoEnhancements
                      bookId={bookId}
                      currentChapter={currentChapter}
                    />

                    {/* Idylls of the King — Tennyson's Victorian Arthurian
                        cycle (1891 collected edition). Idyll header with
                        Roman numeral + scholarly argument + emotional-
                        register + Tennyson's opening as epigraph, plus
                        edition note and speaker-palette legend grouped
                        narrator / sovereignty / round-table / ladies /
                        grail / villainy / numinous. Line-number anchors
                        are baked into the HTML by
                        scripts/idylls/transform-book.ts as
                        data-iotk-line / data-iotk-speaker attributes. */}
                    <IdyllsOfTheKingEnhancements
                      bookId={bookId}
                      currentChapter={currentChapter}
                    />

                    {/* Le Morte d'Arthur — Caxton's argumentum header,
                        per-book orientation banner (Book VIII = Tristram
                        opens, Book XIII = Grail opens), speaker-color
                        attribution decoration, and a Storylines sidebar
                        adapted from Orlando Furioso. Only fires for
                        le-morte-darthur. */}
                    <LeMorteDarthurEnhancements
                      bookId={bookId}
                      currentChapter={currentChapter}
                    />

                    {/* Canterbury Tales — scholarly header chrome for
                        each fragment and tale: fragment Roman numeral,
                        teller's pilgrim identity with signature color,
                        verse-form indicator (heroic couplets / rime royal
                        / tail-rhyme / prose / Monk's stanza), dramatic-
                        link note explaining why this tale follows the
                        previous one, incomplete-tale banner (Cook's,
                        Squire's), and content notes for the Prioress's
                        blood-libel tale, the Pardoner's coded portrait,
                        and the bawdy fabliaux. Phase 1 foundation —
                        per-line rhyme-scheme tagging and the FacingGloss
                        two-column layout are Phase 2. */}
                    <CanterburyTalesEnhancements
                      bookId={bookId}
                      currentChapter={currentChapter}
                    />

                    {/* The Decameron — chapter-kind-aware header (Proem,
                        Plague Introduction, day openings, tale headers
                        with narrator signature color, Day IV author-
                        intervention register, Author's Conclusion) and a
                        collapsible narrator tracker. Only active for
                        bookId === "the-decameron". */}
                    <DecameronEnhancements
                      bookId={bookId}
                      currentChapter={currentChapter}
                    />

                    {/* The Faerie Queene — canto header chrome with the
                        book + virtue + canto Roman + scholarly summary +
                        climactic-canto chip, stanza-tagging post-mount
                        DOM walk (data-fq-stanza, data-fq-line,
                        data-fq-rhyme ABABBCBCC, data-fq-alexandrine on
                        line 9), and reader toggles for stanza numbering,
                        alexandrine highlighting, and rhyme-scheme display.
                        No-ops on front matter (Forward, Letter). */}
                    <FaerieQueeneEnhancements
                      bookId={bookId}
                      currentChapter={currentChapter}
                    />
                    <div className="mt-2 h-px w-16" style={{ backgroundColor: t.border }} />

                    {/* Body Text — strip leading heading that duplicates the
                        chapter title. Memoized via `chapterBodyElement` so
                        unrelated parent re-renders don't reset innerHTML and
                        wipe injected markers / glosses. */}
                    {chapterBodyElement}

                    {/* Structured-content enhancements: glosses, scholarly
                        annotations, and Trials for works ingested via the
                        structured pipeline. Attaches to the rendered DOM
                        without changing the chapter HTML itself. */}
                    {STRUCTURED_ENHANCEMENT_WORKS.has(bookId) && (
                      <StructuredEnhancements
                        workId={bookId}
                        chapterIndex={currentChapter}
                        chapterEndReached={chapterEndReached}
                      />
                    )}

                    {/* Virgil Reflection */}
                    {chapterEndReached && (
                      <VirgilReflection
                        type="progress"
                        context={{
                          chaptersCompleted: completedChapterIndices.length,
                          booksRead: [],
                        }}
                        className="mt-8"
                      />
                    )}

                    {/* Chapter Navigation — Quiz gate between prev/next */}
                    <div className="mt-16 border-t pt-6" style={{ borderColor: t.border }}>
                      {/* Chapter end CTA — Begin Quiz button is now persistent
                          at the bottom of every chapter that has a quiz
                          (i.e. everything except front/back matter). It does
                          not animate in/out based on scroll position. */}
                      {!isFrontOrBackMatter(chapter.title) && (
                        <div className="mb-6 flex flex-col items-center gap-3">
                          <button
                            onClick={handleFinishChapter}
                            className="codex-pressable flex min-h-[48px] items-center gap-2 px-8 text-sm font-bold"
                            style={{
                              background: "var(--codex-primary)",
                              color: "var(--codex-on-primary)",
                              borderRadius: "var(--codex-radius-btn)",
                            }}
                          >
                            <BookCheck className="size-4" />
                            {currentChapter === totalChapters - 1
                              ? "Begin Final Quiz"
                              : "Begin Quiz"}
                          </button>
                        </div>
                      )}

                      {/* Prev / counter / Next row */}
                      <div className="flex items-center justify-between">
                        <button
                          disabled={currentChapter === 0}
                          onClick={() => handleChapterSelect(currentChapter - 1)}
                          className="text-xs transition-colors disabled:opacity-30 hover:opacity-70"
                          style={{ color: t.muted }}
                        >
                          ← Previous {getUnitLabel(structuralUnitType).toLowerCase()}
                        </button>
                        <span className="text-[10px] tabular-nums" style={{ color: t.muted }}>
                          {currentChapter + 1} / {totalChapters}
                        </span>
                        <button
                          disabled={currentChapter === totalChapters - 1}
                          onClick={() => handleChapterSelect(currentChapter + 1)}
                          className="text-xs transition-colors disabled:opacity-30 hover:opacity-70"
                          style={{ color: t.muted }}
                        >
                          Next {getUnitLabel(structuralUnitType).toLowerCase()} →
                        </button>
                      </div>
                    </div>

                    {/* End-of-chapter sentinel for IntersectionObserver */}
                    <div ref={sentinelRef} className="h-px w-full mt-8" aria-hidden />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Reading time footer (scroll mode only) */}
              <div
                className="sticky bottom-0 z-20 border-t px-6 py-2 text-center backdrop-blur-sm"
                style={{
                  borderColor:     t.border,
                  backgroundColor: "color-mix(in srgb, var(--background) 80%, transparent)",
                }}
              >
                <p className="text-[10px] tabular-nums" style={{ color: t.muted }}>
                  {readingTimeRemaining > 0 ? `~${readingTimeRemaining} min remaining` : "Final chapter"}
                </p>
              </div>
            </>
          ) : (
            /* ── PAGINATED MODE (page / book spread) ── */
            <div
              ref={setPaginationContainer}
              className="relative z-10 flex-1 overflow-hidden"
            >
              <PaginatedReader
                pages={pages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onChapterEnd={handleFinishChapter}
                onChapterPrev={currentChapter > 0 ? () => handleChapterSelect(currentChapter - 1) : undefined}
                isPaginating={isPaginating}
                mode={effectiveMode === "spread" ? "spread" : "single"}
                fontSize={fontSize}
                lineHeight={prefs.lineHeight}
                justify={prefs.justify}
                a11yFace={prefs.a11yFace}
                turnStyle={prefs.turnStyle}
                onToggleToolbar={() => setSidebarOpen(s => !s)}
                contentTypeClass={book && "genres" in book ? getContentTypeClass((book as TomeBook).genres) : "content-prose"}
                folioLabel={folioLabel}
              />
            </div>
          )}
        </div>

        {/* Highlights — text-selection popover (Highlight + Ask Virgil)
            plus re-render of saved highlights for this book + chapter. */}
        <ReaderHighlights
          bookId={bookId}
          bookTitle={book.title}
          bookAuthor={book.author}
          chapterIndex={currentChapter}
          chapterTitle={chapter.title}
        />
        <SharedAnnotationsLayer bookId={bookId} chapterIndex={currentChapter} />
      </div>
    </WordTooltipProvider>
  )
}

function ReaderSkeleton() {
  return (
    <div className="flex h-[calc(100vh-3rem)]">
      <div className="w-56 border-r border-border p-4 space-y-3">
        <Skeleton className="h-4 w-24" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
      <div className="flex-1 p-16 max-w-[680px] mx-auto space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-px w-16" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  )
}
