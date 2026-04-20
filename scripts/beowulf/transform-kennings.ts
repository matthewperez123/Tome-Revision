#!/usr/bin/env npx tsx
/**
 * transform-kennings.ts
 *
 * Scans the line-anchored Beowulf chapter JSONs and wraps the FIRST
 * occurrence of each kenning's `hallForm` (or any listed alternateForms)
 * in a <span data-beowulf-kenning="{id}">...</span>. Idempotent: existing
 * data-beowulf-kenning spans are stripped before re-wrapping, so the
 * script can be rerun after edits to the kennings dictionary.
 *
 * Per spec: first-occurrence only. Subsequent uses are not tagged — the
 * reader is meant to encounter the kenning fresh and then recognize it.
 */
import * as fs from "fs"
import * as path from "path"
import { BEOWULF_KENNINGS } from "../../src/data/beowulf/kennings"

const ROOT = path.resolve(__dirname, "..", "..")
const CONTENT_DIR = path.join(ROOT, "public/content/beowulf")

interface ChapterJSON {
  bookId: string
  chapterIndex: number
  title: string
  wordCount: number
  estimatedMinutes: number
  html: string
  fittNumber?: number
  lineCount?: number
  sectionType?: string
}

/**
 * Strip any previously injected `<span data-beowulf-kenning="…">` wrappers
 * from the HTML so we can re-wrap cleanly. Preserves inner text and nested
 * endnote refs.
 */
function stripExistingWrappers(html: string): string {
  return html.replace(
    /<span data-beowulf-kenning="[^"]*">([\s\S]*?)<\/span>/g,
    "$1"
  )
}

/**
 * Escape a string for safe use in a RegExp.
 */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Build a regex that matches the kenning surface form as a discrete word
 * (not as part of another compound). We permit hyphens internal to the
 * form and treat a leading '-' in the compound as significant.
 *
 * Hall uses curly quotes, so we accept both straight and curly apostrophes.
 */
function buildKenningRegex(form: string): RegExp {
  const normalized = form.replace(/['’]/g, "['’]")
  const src = escapeRegExp(normalized)
    // allow apostrophe alternation after escaping
    .replace(/\\\['’\\\]/g, "['’]")
  // \b doesn't play well with hyphenated compounds; use a custom boundary
  // that disallows an adjacent letter/digit on either side.
  return new RegExp(`(?<![A-Za-zÆæÐðÞþ])(${src})(?![A-Za-zÆæÐðÞþ])`, "i")
}

/**
 * Attempt to wrap the first matching form in the provided HTML. Returns
 * the new HTML and whether a match was found. Does NOT wrap matches that
 * fall inside existing <span data-beowulf-kenning="..."> (already handled
 * by stripExistingWrappers upstream) nor inside attributes.
 */
function wrapFirstOccurrence(
  html: string,
  id: string,
  forms: string[]
): { html: string; wrapped: boolean } {
  for (const form of forms) {
    const re = buildKenningRegex(form)
    let earliest: { idx: number; match: string } | null = null
    // Walk the HTML outside of tags. Simplest approach: iterate matches
    // and check the match isn't inside a tag by scanning the immediate
    // prior unclosed `<`.
    const all = [...html.matchAll(new RegExp(re, "gi"))]
    for (const m of all) {
      const idx = m.index ?? -1
      if (idx < 0) continue
      // Check that we're not inside a tag: last `<` before idx must come
      // after the last `>`, i.e. we're in text content.
      const prevOpen = html.lastIndexOf("<", idx)
      const prevClose = html.lastIndexOf(">", idx)
      if (prevOpen > prevClose) continue
      if (!earliest || idx < earliest.idx) {
        earliest = { idx, match: m[1] }
      }
    }
    if (earliest) {
      const before = html.slice(0, earliest.idx)
      const after = html.slice(earliest.idx + earliest.match.length)
      const wrapped = `<span data-beowulf-kenning="${id}">${earliest.match}</span>`
      return { html: before + wrapped + after, wrapped: true }
    }
  }
  return { html, wrapped: false }
}

async function run(): Promise<void> {
  const meta = JSON.parse(
    fs.readFileSync(path.join(CONTENT_DIR, "meta.json"), "utf8")
  )

  // Load all chapters into memory.
  const chapters: ChapterJSON[] = []
  for (let i = 0; i < meta.chapterCount; i++) {
    const p = path.join(CONTENT_DIR, `ch-${i}.json`)
    chapters.push(JSON.parse(fs.readFileSync(p, "utf8")))
  }

  // Strip any existing wrappers before we start.
  for (const ch of chapters) {
    ch.html = stripExistingWrappers(ch.html)
  }

  // For each kenning, walk chapters in order and wrap first occurrence.
  const tagged: Array<{ id: string; chapter: number; form: string }> = []
  const missing: string[] = []
  for (const k of BEOWULF_KENNINGS) {
    const forms = [k.hallForm, ...(k.alternateForms ?? [])]
    let done = false
    for (const ch of chapters) {
      if (done) break
      // Skip front matter (preface/introduction) — scholarly apparatus
      // there does not count as the "first reader encounter".
      if (ch.sectionType === "preface" || ch.sectionType === "introduction") continue
      const { html, wrapped } = wrapFirstOccurrence(ch.html, k.id, forms)
      if (wrapped) {
        ch.html = html
        tagged.push({ id: k.id, chapter: ch.chapterIndex, form: k.hallForm })
        done = true
      }
    }
    if (!done) missing.push(k.id)
  }

  // Write back.
  for (const ch of chapters) {
    const p = path.join(CONTENT_DIR, `ch-${ch.chapterIndex}.json`)
    fs.writeFileSync(p, JSON.stringify(ch))
  }

  // Update meta.json with tagged count.
  meta.kenningsTagged = tagged.length
  meta.kenningsTotal = BEOWULF_KENNINGS.length
  fs.writeFileSync(
    path.join(CONTENT_DIR, "meta.json"),
    JSON.stringify(meta, null, 2)
  )

  console.log(`\n  ✓ Tagged ${tagged.length} / ${BEOWULF_KENNINGS.length} kennings`)
  if (missing.length) {
    console.log(`  ⚠ Not found in Hall's text (${missing.length}):`)
    for (const id of missing) {
      const k = BEOWULF_KENNINGS.find((x) => x.id === id)
      console.log(`      ${id}  (hallForm="${k?.hallForm}")`)
    }
  }
  // Per-category summary
  const byCat: Record<string, number> = {}
  for (const t of tagged) {
    const k = BEOWULF_KENNINGS.find((x) => x.id === t.id)
    if (k) byCat[k.category] = (byCat[k.category] ?? 0) + 1
  }
  console.log(`\n  Tagged by category:`)
  for (const [cat, n] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
    console.log(`      ${cat.padEnd(10)} ${n}`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
