#!/usr/bin/env npx tsx
/**
 * transform-book.ts — inject scholarly-apparatus markup into an Idylls
 * of the King chapter.
 *
 * Reads public/content/idylls-of-the-king/ch-{N}.json (N = 0..13:
 * ch-0 is the Dedication, ch-1..12 are idylls I..XII, ch-13 is "To
 * the Queen") and walks the HTML with cheerio, adding:
 *
 *   1. `data-iotk-line="<N>"` on every verse-line `<span>`, giving
 *      stable anchors like
 *      `idylls-of-the-king/idyll-coming-of-arthur/line-254` without
 *      changing the visible text. Numbering restarts at 1 per chapter.
 *
 *   2. `data-iotk-line-mark="<N>"` on every 5th line so CSS can render
 *      a margin line-number via `content: attr(data-iotk-line-mark)`.
 *
 *   3. `data-iotk-speaker="narrator"` as the default speaker for every
 *      line. A subsequent Part 2b pass will overlay hand-authored
 *      speaker spans (Arthur in "The Coming of Arthur," Guinevere in
 *      "Guinevere," Vivien in "Merlin and Vivien," etc.) driven by
 *      scripts/idylls/book-speeches.ts — the same state-machine pattern
 *      as scripts/paradise-lost/transform-book.ts.
 *
 * The per-idyll header block (Roman numeral + one-sentence argument +
 * opening-line epigraph + palette legend + cycle-arc link) is NOT
 * injected here — it is rendered by the React IdyllsOfTheKingEnhancements
 * component, so it sits correctly between the chapter H1 and the verse
 * body.
 *
 * Idempotent — prior markers are stripped before re-applying.
 *
 * Usage:
 *   npx tsx scripts/idylls/transform-book.ts 0         # single chapter
 *   npx tsx scripts/idylls/transform-book.ts 0 1 7     # several
 *   npx tsx scripts/idylls/transform-book.ts --all     # all 14
 *   npx tsx scripts/idylls/transform-book.ts 1 --dry   # no file write
 */

import * as fs from "fs"
import * as path from "path"
import * as cheerio from "cheerio"

const ROOT = path.resolve(__dirname, "..", "..")
const CONTENT_DIR = path.join(ROOT, "public/content/idylls-of-the-king")

interface ChapterJSON {
  bookId: string
  chapterIndex: number
  title: string
  wordCount: number
  estimatedMinutes: number
  html: string
}

function transformChapter(chapterIndex: number, write: boolean): void {
  const filePath = path.join(CONTENT_DIR, `ch-${chapterIndex}.json`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing chapter file: ${filePath}`)
  }

  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as ChapterJSON
  const $ = cheerio.load(raw.html, { xml: false })
  const $body = $("body").length ? $("body") : $.root()

  // ── 1. Strip prior transform markers for idempotent re-runs ─────────
  $body.find("[data-iotk-speaker]").each((_, el) => {
    $(el).removeAttr("data-iotk-speaker")
  })
  $body.find("[data-iotk-line]").each((_, el) => {
    $(el).removeAttr("data-iotk-line").removeAttr("data-iotk-line-mark")
  })

  // ── 2. Walk the section's verse-line spans in document order and
  //       number them 1..N. Each SE-sourced <p><span>line</span><br>...</p>
  //       structure gives us one <span> per line. We are deliberately
  //       permissive: if a span sits outside a <p>, we still count it.
  const $section = $body.find('section[role="doc-chapter"]').first()
  const $spans = $section.length ? $section.find("p > span") : $body.find("p > span")

  let lineNum = 0
  $spans.each((_, el) => {
    lineNum += 1
    const $el = $(el)
    $el.attr("data-iotk-line", String(lineNum))
    $el.attr("data-iotk-speaker", "narrator")
    if (lineNum % 5 === 0) {
      $el.attr("data-iotk-line-mark", String(lineNum))
    }
  })

  // ── 3. Serialize and write ──────────────────────────────────────────
  // We re-serialize just the section's contents to keep the top-level
  // shape stable. If cheerio introduced <html><head><body> wrappers (it
  // can, in HTML mode), extract the body html instead.
  const serialized = $body.length && $body.is("body")
    ? $body.html() ?? ""
    : $.root().html() ?? ""

  // Remove line-breaks cheerio may have inserted between tags; the
  // original SE-sourced HTML uses single-space separators.
  const compact = serialized.replace(/\s+/g, " ").trim()

  const updated: ChapterJSON = { ...raw, html: compact }
  const output = JSON.stringify(updated)

  if (write) {
    fs.writeFileSync(filePath, output, "utf8")
  }

  console.log(
    `ch-${chapterIndex.toString().padStart(2, " ")}  ${raw.title.padEnd(32)}  ${lineNum.toString().padStart(5)} lines  ${write ? "written" : "(dry)"}`,
  )
}

// ── CLI ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const dry = args.includes("--dry")
const all = args.includes("--all")
const indices = all
  ? Array.from({ length: 14 }, (_, i) => i)
  : args.filter((a) => !a.startsWith("--")).map((a) => parseInt(a, 10))

if (indices.length === 0) {
  console.error("Usage: npx tsx scripts/idylls/transform-book.ts <index...> [--all] [--dry]")
  process.exit(1)
}

console.log(`Transforming ${indices.length} chapter(s)${dry ? " (dry)" : ""}`)
for (const i of indices) {
  transformChapter(i, !dry)
}
