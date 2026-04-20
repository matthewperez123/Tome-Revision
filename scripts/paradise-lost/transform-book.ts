#!/usr/bin/env npx tsx
/**
 * transform-book.ts — inject scholarly-apparatus markup into a
 * Paradise Lost chapter.
 *
 * Reads public/content/paradise-lost/ch-{N}.json (where N = book - 1, so
 * ch-0 is Book I) and walks the HTML with cheerio, adding:
 *
 *   1. `data-pl-argument="true"` on the prose Argument paragraph that
 *      precedes the verse in each book (Milton wrote these for the
 *      1668 reissue). Detected as the first `<p>` under the book
 *      `<section>` that contains no direct `<span>` children.
 *
 *   2. `data-pl-line="<N>"` on every line `<span>`, giving stable
 *      anchors like `paradise-lost/book-1/line-254` without changing
 *      the visible text.
 *
 *   3. `data-pl-line-mark="<N>"` on every 5th line, so CSS can render
 *      a margin line-number via `content: attr(data-pl-line-mark)`
 *      without having to compute modulo in CSS.
 *
 *   4. `data-pl-invocation="true"` on lines within the four canonical
 *      invocation ranges (I.1–26, III.1–55, VII.1–39, IX.1–47). CSS
 *      renders a subtle indigo left-margin accent.
 *
 *   5. `data-pl-speaker="<CanonicalName>"` and
 *      `data-pl-speech-start="true"` driven by scripts/paradise-lost/
 *      book-speeches.ts — same state machine as scripts/aeneid/
 *      transform-book.ts.
 *
 * The per-book header block (Roman numeral + opening-line epigraph +
 * one-sentence argument + palette legend) is NOT injected here — it is
 * rendered by the React ParadiseLostEnhancements component from the
 * data in src/data/paradise-lost/book-metadata.ts, so that it sits
 * correctly between the chapter H1 and the verse body.
 *
 * Idempotent — prior markers are stripped before re-applying.
 *
 * Usage:
 *   npx tsx scripts/paradise-lost/transform-book.ts 1           # single book
 *   npx tsx scripts/paradise-lost/transform-book.ts 1 2 4 9 12  # several
 *   npx tsx scripts/paradise-lost/transform-book.ts --all       # books 1..12
 *   npx tsx scripts/paradise-lost/transform-book.ts 1 --dry     # no file write
 */

import * as fs from "fs"
import * as path from "path"
import * as cheerio from "cheerio"
import { BOOK_SPEECHES, type Speech } from "./book-speeches"
import { BOOK_INVOCATIONS } from "../../src/data/paradise-lost/book-metadata"

const ROOT = path.resolve(__dirname, "..", "..")
const CONTENT_DIR = path.join(ROOT, "public/content/paradise-lost")

interface ChapterJSON {
  bookId: string
  chapterIndex: number
  title: string
  wordCount: number
  estimatedMinutes: number
  html: string
}

function normalize(text: string): string {
  return text
    .replace(/[\u2018\u2019\u201C\u201D]/g, (ch) =>
      ch === "\u2018" || ch === "\u2019" ? "'" : '"',
    )
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\uFEFF/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function lineClosesSpeech(rawText: string): boolean {
  const lastClose = Math.max(rawText.lastIndexOf("\u201D"), rawText.lastIndexOf('"'))
  if (lastClose === -1) return false
  const afterClose = rawText.slice(lastClose + 1)
  if (/[\u201C]|"\s*[A-Za-z]/.test(afterClose)) return false
  return true
}

function transformBook(bookNumber: number, write: boolean): void {
  // ch-N.json files use zero-based indexing: ch-0 = Book I, ch-11 = Book XII.
  const chapterIndex = bookNumber - 1
  const filePath = path.join(CONTENT_DIR, `ch-${chapterIndex}.json`)

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing chapter file: ${filePath}`)
  }

  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as ChapterJSON
  const speeches = BOOK_SPEECHES[bookNumber]
  const invocation = BOOK_INVOCATIONS[bookNumber]

  const $ = cheerio.load(raw.html, { xml: false })
  const $body = $("body").length ? $("body") : $.root()

  // ── 1. Strip prior transform markers for idempotent re-runs ───────────
  $body.find("[data-pl-speaker]").each((_, el) => {
    $(el).removeAttr("data-pl-speaker")
  })
  $body.find("[data-pl-speech-start]").each((_, el) => {
    $(el).removeAttr("data-pl-speech-start")
  })
  $body.find("[data-pl-line]").each((_, el) => {
    $(el).removeAttr("data-pl-line")
  })
  $body.find("[data-pl-line-mark]").each((_, el) => {
    $(el).removeAttr("data-pl-line-mark")
  })
  $body.find("[data-pl-invocation]").each((_, el) => {
    $(el).removeAttr("data-pl-invocation")
  })
  $body.find("[data-pl-argument]").each((_, el) => {
    $(el).removeAttr("data-pl-argument")
  })

  // ── 2. Argument paragraph ─────────────────────────────────────────────
  // Milton's prose "Argument" for each book is the FIRST <p> inside the
  // book's inner <section> that has no direct <span> children. Verse
  // paragraphs use `<span>line</span> <br>` pairs; the Argument is pure
  // prose.
  let argumentTagged = 0
  $body.find("section[role='doc-chapter'] > section > p").each((_, el) => {
    const $p = $(el)
    const hasVerseSpan = $p.children("span").length > 0
    if (!hasVerseSpan && argumentTagged === 0) {
      $p.attr("data-pl-argument", "true")
      argumentTagged += 1
    }
  })

  // ── 3. Line anchors and 5-line marks ──────────────────────────────────
  // Every <span> that is a direct child of a <p> inside the book section
  // is a verse line (the Argument has no <span> children by construction).
  let lineCounter = 0
  $body
    .find("section[role='doc-chapter'] > section > p > span")
    .each((_, el) => {
      lineCounter += 1
      const $s = $(el)
      $s.attr("data-pl-line", String(lineCounter))
      if (lineCounter % 5 === 0) {
        $s.attr("data-pl-line-mark", String(lineCounter))
      }
      if (invocation && lineCounter >= invocation.start && lineCounter <= invocation.end) {
        $s.attr("data-pl-invocation", "true")
      }
    })

  // ── 4. Speaker tagging via state machine ──────────────────────────────
  const $lines = $body.find("section[role='doc-chapter'] > section > p > span")
  const lineTexts = $lines.toArray().map((el) => normalize($(el).text()))
  const rawLineTexts = $lines.toArray().map((el) => $(el).text())

  let speechIdx = 0
  let currentSpeaker: string | null = null
  const misses: Speech[] = []
  const hits: { line: number; speaker: string }[] = []

  if (speeches) {
    for (let i = 0; i < $lines.length; i++) {
      const lText = lineTexts[i]
      const $ln = $($lines[i])
      const rawText = rawLineTexts[i]

      let matchedHere = false
      while (speechIdx < speeches.length) {
        const expected = normalize(speeches[speechIdx].opens)
        if (!lText.includes(expected)) break
        currentSpeaker = speeches[speechIdx].speaker
        $ln.attr("data-pl-speaker", currentSpeaker)
        $ln.attr("data-pl-speech-start", "true")
        hits.push({ line: i + 1, speaker: currentSpeaker })
        speechIdx += 1
        matchedHere = true
      }

      if (matchedHere) {
        if (lineClosesSpeech(rawText)) currentSpeaker = null
        continue
      }

      if (currentSpeaker) {
        $ln.attr("data-pl-speaker", currentSpeaker)
        if (lineClosesSpeech(rawText)) currentSpeaker = null
      }
    }

    for (let j = speechIdx; j < speeches.length; j++) {
      misses.push(speeches[j])
    }
  }

  // ── 5. Serialize and write back ───────────────────────────────────────
  const newHtml = $body.html() ?? raw.html
  const updated: ChapterJSON = { ...raw, html: newHtml }

  if (write) {
    fs.writeFileSync(filePath, JSON.stringify(updated) + "\n", "utf8")
  }

  console.log(`\nBook ${bookNumber} (ch-${chapterIndex}.json):`)
  console.log(`  argument paragraphs: ${argumentTagged}`)
  console.log(`  lines numbered:      ${lineCounter}`)
  if (invocation) {
    console.log(`  invocation range:    I.${invocation.start}–${invocation.end} (${invocation.end - invocation.start + 1} lines)`)
  }
  console.log(`  speeches matched:    ${hits.length}/${speeches?.length ?? 0}`)
  if (misses.length > 0) {
    console.log(`  MISSES:`)
    for (const m of misses) {
      console.log(`    - ${m.speaker}: "${m.opens}"`)
    }
  }
  if (!write) console.log(`  (dry run — no file written)`)
}

// ── CLI ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const dry = args.includes("--dry")
const all = args.includes("--all")

let books: number[] = []
if (all) {
  books = Array.from({ length: 12 }, (_, i) => i + 1)
} else {
  books = args
    .filter((a) => !a.startsWith("--"))
    .map(Number)
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= 12)
}

if (books.length === 0) {
  console.error(
    "Usage: npx tsx scripts/paradise-lost/transform-book.ts <book> [<book>...] [--dry]\n" +
      "       npx tsx scripts/paradise-lost/transform-book.ts --all",
  )
  process.exit(1)
}

for (const b of books) {
  transformBook(b, !dry)
}
