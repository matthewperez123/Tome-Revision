#!/usr/bin/env npx tsx
/**
 * repair-anchors.ts — scan every Odyssey annotation's anchorText; for any
 * that does not literal-match the transformed content, search the book's
 * verse lines with a keyword heuristic and emit a patch: the annotation
 * id, the old anchor, and a suggested new Bryant-literal anchor.
 *
 * Writes scripts/odyssey/anchor-repairs.json. The repair is NOT applied
 * automatically — we write human-reviewable patches, then apply them via
 * a second pass.
 */

import * as fs from "fs"
import * as path from "path"

import { GENERATED_ODYSSEY_ANNOTATIONS } from "../../src/lib/virgil/odyssey-annotations"

const ROOT = path.resolve(__dirname, "..", "..")
const CONTENT_DIR = path.join(ROOT, "public/content/the-odyssey")
const OUT = path.join(__dirname, "anchor-repairs.json")

interface Line { lineNumber: number; text: string }
const bookCache = new Map<number, Line[]>()
function getLines(bookNum: number): Line[] {
  if (bookCache.has(bookNum)) return bookCache.get(bookNum)!
  const raw = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, `ch-${bookNum}.json`), "utf8")) as { html: string }
  const re = /data-odyssey-line="(\d+)"[^>]*>([^<]*)</g
  const out: Line[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(raw.html)) !== null) {
    out.push({ lineNumber: Number(m[1]), text: m[2].replace(/\uFEFF/g, "") })
  }
  bookCache.set(bookNum, out)
  return out
}

interface Repair {
  id: string
  bookNumber: number
  oldAnchor: string
  newAnchor: string | null
  newLineNumber: number | null
  matchedBy: string | null
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(t => t.length > 2)
    .filter(t => !["the", "and", "for", "his", "her", "not", "but", "that", "with", "thou", "thee", "thy", "was", "are", "have", "this"].includes(t))
}

function findBest(lines: Line[], keywords: string[]): { line: Line; score: number } | null {
  if (keywords.length === 0) return null
  let best: { line: Line; score: number } | null = null
  for (const line of lines) {
    const lower = line.text.toLowerCase()
    let score = 0
    for (const kw of keywords) if (lower.includes(kw)) score += 1
    if (score > 0 && (!best || score > best.score)) best = { line, score }
  }
  return best
}

const repairs: Repair[] = []

for (const a of GENERATED_ODYSSEY_ANNOTATIONS) {
  const lines = getLines(a.chapterNumber)
  const hits = lines.some(l => l.text.includes(a.anchorText))
  if (hits) continue // already lands

  // Try token-based search from the current anchor first
  let best = findBest(lines, tokenize(a.anchorText))
  // If weak match, try keywords from the title
  if (!best || best.score < 2) {
    const alt = findBest(lines, tokenize(a.title))
    if (alt && (!best || alt.score > best.score)) best = alt
  }
  // If still weak, try keywords from the first 80 chars of the quotedPassage
  if (!best || best.score < 2) {
    const q = a.quotedPassage.slice(0, 120)
    const alt = findBest(lines, tokenize(q))
    if (alt && (!best || alt.score > best.score)) best = alt
  }

  if (best && best.score >= 1) {
    // Use the first 50 chars of the matched line as the new anchor
    const newAnchor = best.line.text.trim().slice(0, 50)
    repairs.push({
      id: a.id,
      bookNumber: a.chapterNumber,
      oldAnchor: a.anchorText,
      newAnchor,
      newLineNumber: best.line.lineNumber,
      matchedBy: `keyword-score ${best.score}`,
    })
  } else {
    repairs.push({
      id: a.id,
      bookNumber: a.chapterNumber,
      oldAnchor: a.anchorText,
      newAnchor: null,
      newLineNumber: null,
      matchedBy: null,
    })
  }
}

fs.writeFileSync(OUT, JSON.stringify(repairs, null, 2) + "\n")
console.log(`Total annotations: ${GENERATED_ODYSSEY_ANNOTATIONS.length}`)
console.log(`Needing repair: ${repairs.length}`)
const resolved = repairs.filter(r => r.newAnchor).length
console.log(`Resolved: ${resolved}`)
console.log(`Unresolved: ${repairs.length - resolved}`)
console.log(`Wrote ${OUT}`)
for (const r of repairs) {
  const status = r.newAnchor ? "✓" : "✗"
  console.log(`  ${status} ${r.id}  bk${r.bookNumber}  →  ${r.newAnchor ? 'L'+r.newLineNumber+' "'+r.newAnchor+'"' : 'UNRESOLVED'}`)
}
