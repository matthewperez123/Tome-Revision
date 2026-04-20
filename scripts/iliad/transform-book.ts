#!/usr/bin/env npx tsx
/**
 * transform-book.ts — inject scholarly-apparatus markup into an Iliad chapter.
 *
 * Reads `public/content/the-iliad/ch-{N}.json`, walks the HTML with cheerio,
 * and adds:
 *   1. A <header data-iliad-book-header> block at the top with the Roman
 *      numeral, Greek letter, and traditional one-line argument.
 *   2. `data-iliad-speaker="<CanonicalName>"` on every paragraph that
 *      carries a speech (matched by opening-phrase against the
 *      hand-authored table in book-speeches.ts).
 *   3. `data-iliad-line="<N>"` on every line span, giving stable anchors
 *      like `iliad/book-1/line-42` without changing the visible text.
 *
 * Idempotent — previous markers are stripped before re-applying. Writes
 * back to the same JSON file.
 *
 * Usage:  npx tsx scripts/iliad/transform-book.ts 1
 *         npx tsx scripts/iliad/transform-book.ts 1 --dry   (no write)
 */

import * as fs from "fs"
import * as path from "path"
import * as cheerio from "cheerio"
import {
  BOOK_SPEECHES,
  BOOK_ARGUMENTS,
  BOOK_GREEK_LETTERS,
  BOOK_ROMAN_NUMERALS,
  type Speech,
} from "./book-speeches"

const ROOT = path.resolve(__dirname, "..", "..")
const CONTENT_DIR = path.join(ROOT, "public/content/the-iliad")

interface ChapterJSON {
  bookId: string
  chapterIndex: number
  title: string
  wordCount: number
  estimatedMinutes: number
  html: string
}

// ── Text normalization ───────────────────────────────────────────────────
// Bryant's source contains Unicode smart quotes (“ ” ‘ ’), em-dashes, and
// invisible word-joiners (\uFEFF). We normalize those when matching the
// opening-phrase substrings so the tables in book-speeches.ts can stay
// ASCII and readable.

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

function paragraphText($: cheerio.CheerioAPI, p: cheerio.Cheerio<any>): string {
  return normalize(p.text())
}

/**
 * Detect whether a line closes a speech. Bryant's open/close curly quotes
 * are distinct Unicode characters (U+201C / U+201D), so we look at the
 * RAW text — a closing curly quote anywhere in the line, provided no
 * subsequent opening curly quote reopens a new speech on the same line,
 * means the current speech has ended by the end of this line.
 * Also handles the rare ASCII-quote fallback and Bryant's single-quote
 * speech markers (U+2018 / U+2019), though double-quote is the norm.
 */
function lineClosesSpeech(rawText: string): boolean {
  const lastClose = Math.max(rawText.lastIndexOf("\u201D"), rawText.lastIndexOf('"'))
  if (lastClose === -1) return false
  const afterClose = rawText.slice(lastClose + 1)
  // A new opening quote after the close would mean another speech starts
  // on the same line (handled by the main loop separately, but we
  // conservatively return false so we don't prematurely clear speaker).
  if (/[\u201C]|"\s*[A-Za-z]/.test(afterClose)) return false
  return true
}

// ── Main transform ───────────────────────────────────────────────────────

function transformBook(bookNumber: number, write: boolean): void {
  const chapterIndex = bookNumber // our ch-N.json file naming matches book N
  const filePath = path.join(CONTENT_DIR, `ch-${chapterIndex}.json`)

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing chapter file: ${filePath}`)
  }

  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as ChapterJSON
  const speeches = BOOK_SPEECHES[bookNumber]
  if (!speeches || speeches.length === 0) {
    console.warn(`No speech table defined yet for Book ${bookNumber}; skipping speech tagging.`)
  }

  // We load the html fragment inside a minimal wrapper so cheerio keeps
  // indentation/whitespace faithful, then serialize the wrapper's inner.
  const $ = cheerio.load(raw.html, { xml: false })
  // In document mode cheerio wraps our fragment in html>body; operate on body.
  const $body = $("body").length ? $("body") : $.root()

  // ── 1. Strip any prior transform output so we can re-run idempotently ──
  $body.find("[data-iliad-book-header]").remove()
  $body.find("[data-iliad-speaker]").each((_, el) => {
    $(el).removeAttr("data-iliad-speaker")
  })
  $body.find("[data-iliad-line]").each((_, el) => {
    $(el).removeAttr("data-iliad-line")
  })

  // ── 2. Book-header block ──────────────────────────────────────────────
  // The header (Greek-letter glyph + one-line argument) is rendered by
  // the React IliadEnhancements component from the arguments table, so
  // that it sits correctly between the chapter H1 and the translation
  // note instead of inside the verse body. We intentionally do NOT
  // inject anything into the HTML here — the script above has already
  // stripped prior `data-iliad-book-header` blocks for idempotence.

  // ── 3. Line anchors — number every <span> inside a <p>  ───────────────
  // Bryant's HTML uses `<span>line</span><br/>` pairs for verse lines.
  // We number them sequentially across the whole book.
  let lineCounter = 0
  $body.find("section[role='doc-chapter'] p > span, section[role='doc-preface'] p > span").each(
    (_, el) => {
      lineCounter += 1
      $(el).attr("data-iliad-line", String(lineCounter))
    },
  )

  // ── 4. Speaker tagging at the LINE level ──────────────────────────────
  // Bryant often merges attribution + speech + counter-speech into a
  // single <p>, so paragraph-level tagging loses granularity. Each verse
  // line is its own <span>; we walk those spans in document order and
  // drive a tiny state machine:
  //
  //   - If the line opens the next expected speech (contains its
  //     `opens` substring AND an opening quote), promote to that
  //     speaker; mark the line.
  //   - While inside a speech (currentSpeaker != null), mark every
  //     subsequent line with that speaker.
  //   - If a line ends with a closing quote (the Bryant convention),
  //     clear currentSpeaker *after* marking it.
  //
  // This gracefully handles both (a) multi-paragraph speeches and (b)
  // multiple speeches packed into one paragraph.
  const $lines = $body.find("section[role='doc-chapter'] p > span, section[role='doc-preface'] p > span")
  const lineTexts = $lines.toArray().map((el) => normalize($(el).text()))
  // Raw texts retain curly-quote distinction, needed for close detection.
  const rawLineTexts = $lines.toArray().map((el) => $(el).text())

  let speechIdx = 0
  let currentSpeaker: string | null = null
  const misses: Speech[] = []
  const hits: { line: number; speaker: string }[] = []

  // Close detection happens on the RAW (unnormalized) line; see
  // lineClosesSpeech above.

  if (speeches) {
    for (let i = 0; i < $lines.length; i++) {
      const lText = lineTexts[i]
      const $ln = $($lines[i])

      const rawText = rawLineTexts[i]

      // Check for a new-speech opener in this line (substring match only).
      if (speechIdx < speeches.length) {
        const expected = normalize(speeches[speechIdx].opens)
        if (lText.includes(expected)) {
          currentSpeaker = speeches[speechIdx].speaker
          $ln.attr("data-iliad-speaker", currentSpeaker)
          $ln.attr("data-iliad-speech-start", "true")
          hits.push({ line: i, speaker: currentSpeaker })
          speechIdx += 1
          if (lineClosesSpeech(rawText)) currentSpeaker = null
          continue
        }
      }

      if (currentSpeaker) {
        $ln.attr("data-iliad-speaker", currentSpeaker)
        if (lineClosesSpeech(rawText)) currentSpeaker = null
      }
    }

    for (let j = speechIdx; j < speeches.length; j++) {
      misses.push(speeches[j])
    }
  }

  // ── 5. Serialize and write back ───────────────────────────────────────
  const newHtml = $body.html() ?? raw.html

  const updated: ChapterJSON = {
    ...raw,
    html: newHtml,
  }

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
  if (!write) {
    console.log(`  (dry run — no file written)`)
  }
}

// ── CLI ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const dry = args.includes("--dry")
const books = args.filter((a) => !a.startsWith("--")).map(Number).filter((n) => Number.isFinite(n) && n >= 1 && n <= 24)

if (books.length === 0) {
  console.error("Usage: npx tsx scripts/iliad/transform-book.ts <book> [<book>...] [--dry]")
  process.exit(1)
}

for (const b of books) {
  transformBook(b, !dry)
}
