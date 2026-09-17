/**
 * Whole-book folio map — the SINGLE implementation of Tome's canonical page
 * numbering (codex spec §5.4).
 *
 * Front matter (preface/introduction/…) is foliated in lowercase roman
 * numerals starting at i; body matter restarts at arabic 1; back matter
 * continues the arabic sequence. When "chapters open on recto" is enabled,
 * inserted blank versos are COUNTED pages attributed to the preceding
 * chapter's numbering sequence.
 *
 * Both the live reader (per-user layout) and the headless canonical-map
 * generator (`/reader-map` harness + scripts/reader/backfill-page-maps.ts)
 * call `computeBookFolioMap`, so the two can never drift. Browser-only: the
 * paginator measures with real DOM layout.
 */

import { paginateHTML } from "@/lib/paginator"
import { sanitizeReaderHtml } from "@/lib/reader/sanitize"
import { CODEX, codexTextHeight } from "@/lib/reader/codex-spec"

// ── Chapter title classification (front / chapter / back) ───────────────────

export type ChapterType = "front-matter" | "chapter" | "back-matter"

const FRONT_MATTER_KEYWORDS = [
  "preface", "introduction", "introductory", "foreword", "dedication",
  "prologue", "epigraph", "letter", "note to", "author's note",
  "translator's", "dramatis personae", "the story", "frontispiece",
  "acknowledgment", "our raison", "characters in the play",
]

const BACK_MATTER_KEYWORDS = [
  "afterword", "appendix", "postscript",
  "endnotes", "glossary", "bibliography", "colophon",
]

export function classifyChapter(title: string): ChapterType {
  const lower = title.toLowerCase().trim()
  if (FRONT_MATTER_KEYWORDS.some(kw => lower.startsWith(kw) || lower.includes(kw))) return "front-matter"
  if (BACK_MATTER_KEYWORDS.some(kw => lower.startsWith(kw) || lower.includes(kw))) return "back-matter"
  return "chapter"
}

// ── Front-matter detection from content HTML (Standard-Ebooks roles) ────────
// epub:type surfaces as the ARIA `role` in our content HTML. In practice most
// of our content carries no role attributes, so callers ALSO pass a
// title-keyword fallback (classifyChapter on the leading run of chapters).

const FRONT_MATTER_ROLES = new Set([
  "doc-preface", "doc-foreword", "doc-introduction", "doc-dedication",
  "doc-epigraph", "doc-prologue", "doc-acknowledgments", "doc-colophon",
])

export function isFrontMatterHtml(html: string): boolean {
  const m = html.match(/role="(doc-[a-z]+)"/i)
  return m ? FRONT_MATTER_ROLES.has(m[1].toLowerCase()) : false
}

// ── Roman numerals ──────────────────────────────────────────────────────────

export function toRomanLower(n: number): string {
  if (n <= 0) return String(n)
  const table: [number, string][] = [
    [1000, "m"], [900, "cm"], [500, "d"], [400, "cd"], [100, "c"], [90, "xc"],
    [50, "l"], [40, "xl"], [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"],
  ]
  let out = "", rem = n
  for (const [v, s] of table) while (rem >= v) { out += s; rem -= v }
  return out
}

/** Inverse of toRomanLower — "xiv" → 14; NaN for malformed input. */
export function fromRomanLower(s: string): number {
  const vals: Record<string, number> = { i: 1, v: 5, x: 10, l: 50, c: 100, d: 500, m: 1000 }
  let total = 0
  for (let i = 0; i < s.length; i++) {
    const cur = vals[s[i]]
    if (!cur) return NaN
    const next = vals[s[i + 1]] ?? 0
    total += cur < next ? -cur : cur
  }
  return toRomanLower(total) === s ? total : NaN
}

// ── Chapter-header chrome (must be byte-identical live vs. pre-measure) ─────

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/**
 * Chapter-title chrome prepended to the paginated content. Wrapped in
 * <figure> so the paginator keeps it as ONE atomic block (FIGURE is a leaf
 * tag) — that prevents the header's <p>s from joining the body's `p + p`
 * indent chain.
 */
export function buildChapterHeaderHTML(eyebrow: string, title: string, subtitle?: string): string {
  return (
    `<figure class="reader-chapter-header">` +
    `<p class="reader-chapter-eyebrow">${escapeHtml(eyebrow)}</p>` +
    `<h1 class="reader-chapter-title">${escapeHtml(title)}</h1>` +
    (subtitle ? `<p class="reader-chapter-subtitle">${escapeHtml(subtitle)}</p>` : "") +
    `</figure>`
  )
}

/**
 * Strip the chapter's leading heading group so it isn't duplicated by the
 * metadata-driven chapter header. Standard Ebooks wraps it in one of three
 * shapes — <header>, <hgroup>, or a bare <h1>-<h4> — optionally inside one or
 * more <section> opens. Keeps the section opens (capture group) and removes
 * only the heading block; `data-scholarly-header` blocks opt out.
 */
export function stripLeadingHeading(html: string): string {
  return html.replace(
    /^(\s*(?:<section[^>]*>\s*)*)(?:<header(?![^>]*data-scholarly-header)[^>]*>[\s\S]*?<\/header>|<hgroup[^>]*>[\s\S]*?<\/hgroup>|<h[1-4][^>]*>[\s\S]*?<\/h[1-4]>)\s*/i,
    "$1"
  )
}

// ── Whole-book measurement ──────────────────────────────────────────────────

export interface FolioMap {
  /** Page count of each chapter at the measured layout. */
  counts: number[]
  /** Numbering sequence each chapter belongs to. */
  matter: ("front" | "body")[]
  /** 1-based folio of each chapter's first page within its sequence. */
  folioStart: number[]
}

export interface FolioMapOptions {
  bookId: string
  chapterTitles: string[]
  /** Eyebrow/title/subtitle for chapter i — must match the live prepend. */
  headerParts: (i: number) => { eyebrow: string; title: string; subtitle?: string }
  contentTypeClass: string
  fontSizePx: number
  lineHeight: number
  justify: boolean
  a11yFace: boolean
  hyphenate?: boolean
  openRecto: boolean
  /** Return true to abort (e.g. React effect cleanup). */
  isCancelled?: () => boolean
}

/**
 * Lay every chapter out off-screen at the given layout and derive the folio
 * map. Fetches `/content/{bookId}/ch-{i}.json`; a missing/failed chapter
 * falls back to a count of 1 so numbering stays monotonic. Returns null when
 * cancelled.
 */
export async function computeBookFolioMap(opts: FolioMapOptions): Promise<FolioMap | null> {
  const {
    bookId, chapterTitles, headerParts, contentTypeClass,
    fontSizePx, lineHeight, justify, a11yFace, hyphenate = false, openRecto, isCancelled,
  } = opts
  const n = chapterTitles.length
  const usableH = codexTextHeight(fontSizePx, lineHeight)
  const usableW = CODEX.textW

  // Title-keyword fallback for front matter (codex spec §5.4): only the
  // LEADING run of front-matter-titled chapters counts — a mid-book
  // "Letter" chapter stays arabic.
  const leadingFront: boolean[] = new Array(n).fill(false)
  for (let i = 0; i < n; i++) {
    if (classifyChapter(chapterTitles[i] ?? "") !== "front-matter") break
    leadingFront[i] = true
  }

  const counts: number[] = new Array(n).fill(1)
  const matter: ("front" | "body")[] = leadingFront.map(f => (f ? "front" : "body"))
  for (let i = 0; i < n; i++) {
    if (isCancelled?.()) return null
    try {
      const res = await fetch(`/content/${bookId}/ch-${i}.json`)
      if (!res.ok) continue
      const data = await res.json()
      const raw: string | undefined = data?.html
      if (!raw) continue
      matter[i] = isFrontMatterHtml(raw) || leadingFront[i] ? "front" : "body"
      const hp = headerParts(i)
      const html =
        buildChapterHeaderHTML(hp.eyebrow, hp.title, hp.subtitle) +
        stripLeadingHeading(sanitizeReaderHtml(raw))
      const pagesArr = await paginateHTML({
        html,
        pageHeight: Math.max(50, usableH),
        pageWidth:  Math.max(50, usableW),
        fontSize: fontSizePx,
        lineHeight,
        contentTypeClass,
        justify,
        a11yFace,
        hyphenate,
        // Codex: the fixed text block IS the measure.
        measure: `${CODEX.textW}px`,
      })
      counts[i] = Math.max(1, pagesArr.length)
    } catch { /* keep the fallback count of 1 */ }
    // Yield periodically so a long book doesn't jank the UI thread.
    if (i % 2 === 1) await new Promise(r => setTimeout(r, 0))
  }
  if (isCancelled?.()) return null

  // Recto-open parity walk. Global page position 0 is a recto (a printed
  // book's first page is a right-hand page); even positions are rectos. When
  // "chapters open on recto" is on and a chapter would begin on a verso (odd
  // cursor), insert one COUNTED blank verso attributed to the preceding
  // chapter's numbering sequence.
  const folioStart: number[] = new Array(n).fill(1)
  let cursor = 0
  let frontUsed = 0
  let bodyUsed = 0
  for (let i = 0; i < n; i++) {
    if (openRecto && cursor % 2 === 1) {
      cursor++
      const prevFront = i > 0 ? matter[i - 1] === "front" : matter[i] === "front"
      if (prevFront) frontUsed++
      else bodyUsed++
    }
    folioStart[i] = (matter[i] === "front" ? frontUsed : bodyUsed) + 1
    if (matter[i] === "front") frontUsed += counts[i]
    else bodyUsed += counts[i]
    cursor += counts[i]
  }
  return { counts, matter, folioStart }
}
