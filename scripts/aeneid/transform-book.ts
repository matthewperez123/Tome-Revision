#!/usr/bin/env npx tsx
/**
 * transform-book.ts — inject scholarly-apparatus markup into an Aeneid chapter.
 *
 * Reads public/content/the-aeneid/ch-{N}.json (where N = book - 1, so ch-0
 * is Book I) and walks the HTML with cheerio, adding:
 *
 *   1. `data-aeneid-line="<N>"` on every line <span>, giving stable anchors
 *      like `aeneid/book-1/line-42` without changing the visible text.
 *   2. `data-aeneid-speaker="<CanonicalName>"` on every verse line that
 *      carries a speech, driven from the hand-curated / auto-extracted
 *      table in book-speeches.ts.
 *   3. `data-aeneid-speech-start="true"` on the opening line of each
 *      speech, so the reader UI can render a speaker cartouche.
 *
 * The Aeneid book-header block (Roman numeral + Latin incipit + argument)
 * is NOT injected here — it is rendered by the React AeneidEnhancements
 * component from the data in src/data/aeneid/book-metadata.ts, so that it
 * sits correctly between the chapter H1 and the verse body.
 *
 * Idempotent — prior markers are stripped before re-applying.
 *
 * Usage:
 *   npx tsx scripts/aeneid/transform-book.ts 1           # single book
 *   npx tsx scripts/aeneid/transform-book.ts 1 2 6 12    # several
 *   npx tsx scripts/aeneid/transform-book.ts --all       # books 1..12
 *   npx tsx scripts/aeneid/transform-book.ts 1 --dry     # no file write
 */

import * as fs from "fs"
import * as path from "path"
import * as cheerio from "cheerio"
import { BOOK_SPEECHES, type Speech } from "./book-speeches"

const ROOT = path.resolve(__dirname, "..", "..")
const CONTENT_DIR = path.join(ROOT, "public/content/the-aeneid")

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

/** A line "closes" a speech if it contains U+201D (right curly quote)
 *  without a subsequent opening curly quote on the same line. */
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
  if (!speeches || speeches.length === 0) {
    console.warn(`No speech table for Book ${bookNumber}; skipping speaker tagging.`)
  }

  const $ = cheerio.load(raw.html, { xml: false })
  const $body = $("body").length ? $("body") : $.root()

  // ── 1. Strip prior transform markers for idempotent re-runs ───────────
  $body.find("[data-aeneid-speaker]").each((_, el) => {
    $(el).removeAttr("data-aeneid-speaker")
  })
  $body.find("[data-aeneid-speech-start]").each((_, el) => {
    $(el).removeAttr("data-aeneid-speech-start")
  })
  $body.find("[data-aeneid-line]").each((_, el) => {
    $(el).removeAttr("data-aeneid-line")
  })

  // ── 2. Line anchors — number every <span> inside a <p> ────────────────
  let lineCounter = 0
  $body
    .find("section[role='doc-chapter'] p > span, section[role='doc-preface'] p > span")
    .each((_, el) => {
      lineCounter += 1
      $(el).attr("data-aeneid-line", String(lineCounter))
    })

  // ── 3. Speaker tagging at the line level ──────────────────────────────
  // Dryden packs multiple speeches into paragraphs; we walk lines in order
  // and run a tiny state machine (same as Iliad/transform-book.ts):
  //
  //   - If the current line contains the `opens` substring of the next
  //     expected speech, mark it with that speaker and set speech-start.
  //   - While currentSpeaker is set, mark each subsequent line.
  //   - If the line closes (U+201D without a following opener), clear
  //     currentSpeaker after marking.
  //
  const $lines = $body.find(
    "section[role='doc-chapter'] p > span, section[role='doc-preface'] p > span",
  )
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

      // Dryden packs multiple back-to-back speeches into a single line
      // (".." she replied, ".." / ".." he said, ".."). Walk the speech
      // table greedily, advancing as many entries as match on THIS line.
      let matchedHere = false
      while (speechIdx < speeches.length) {
        const expected = normalize(speeches[speechIdx].opens)
        if (!lText.includes(expected)) break
        currentSpeaker = speeches[speechIdx].speaker
        $ln.attr("data-aeneid-speaker", currentSpeaker)
        $ln.attr("data-aeneid-speech-start", "true")
        hits.push({ line: i, speaker: currentSpeaker })
        speechIdx += 1
        matchedHere = true
      }

      // After the last matched speech on this line, honor close-quote state:
      // if the line ends with U+201D (no following opener), clear speaker.
      if (matchedHere) {
        if (lineClosesSpeech(rawText)) currentSpeaker = null
        continue
      }

      if (currentSpeaker) {
        $ln.attr("data-aeneid-speaker", currentSpeaker)
        if (lineClosesSpeech(rawText)) currentSpeaker = null
      }
    }

    for (let j = speechIdx; j < speeches.length; j++) {
      misses.push(speeches[j])
    }
  }

  // ── 4. Serialize and write back ───────────────────────────────────────
  const newHtml = $body.html() ?? raw.html
  const updated: ChapterJSON = { ...raw, html: newHtml }

  if (write) {
    fs.writeFileSync(filePath, JSON.stringify(updated) + "\n", "utf8")
  }

  console.log(`\nBook ${bookNumber} (ch-${chapterIndex}.json):`)
  console.log(`  lines numbered:     ${lineCounter}`)
  console.log(`  speeches matched:   ${hits.length}/${speeches?.length ?? 0}`)
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
    "Usage: npx tsx scripts/aeneid/transform-book.ts <book> [<book>...] [--dry]\n" +
      "       npx tsx scripts/aeneid/transform-book.ts --all",
  )
  process.exit(1)
}

for (const b of books) {
  transformBook(b, !dry)
}
