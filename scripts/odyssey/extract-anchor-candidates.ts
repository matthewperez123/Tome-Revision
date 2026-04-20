#!/usr/bin/env npx tsx
/**
 * Extract candidate anchor phrases for annotation writing. For each book,
 * emit the first line of every paragraph (Bryant's verse paragraphs are
 * semantically chunked), plus any line that starts a speech. This gives
 * the annotation author a curated catalog of anchor candidates rather
 * than scrolling 15,000 lines by hand.
 */

import * as fs from "fs"
import * as path from "path"

const ROOT = path.resolve(__dirname, "..", "..")
const CONTENT_DIR = path.join(ROOT, "public/content/the-odyssey")
const OUT = path.join(__dirname, "anchor-candidates.json")

interface Line { bookNumber: number; lineNumber: number; text: string; isSpeechStart: boolean; isParagraphStart: boolean }

const result: Record<number, Line[]> = {}
for (let b = 1; b <= 24; b++) {
  const raw = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, `ch-${b}.json`), "utf8")) as { html: string }
  const lines: Line[] = []
  // Track paragraph boundaries by looking for </p> preceding a <p> start.
  const paraStartLines = new Set<number>()
  const paraRe = /<p>\s*<span[^>]*data-odyssey-line="(\d+)"/g
  let pm: RegExpExecArray | null
  while ((pm = paraRe.exec(raw.html)) !== null) paraStartLines.add(Number(pm[1]))

  const lineRe = /<span[^>]*data-odyssey-line="(\d+)"([^>]*)>([^<]*)</g
  let m: RegExpExecArray | null
  while ((m = lineRe.exec(raw.html)) !== null) {
    const n = Number(m[1])
    const attrs = m[2]
    lines.push({
      bookNumber: b,
      lineNumber: n,
      text: m[3].replace(/\uFEFF/g, ""),
      isSpeechStart: /data-odyssey-speech-start="true"/.test(attrs),
      isParagraphStart: paraStartLines.has(n),
    })
  }
  // Keep only paragraph openers + speech openers (the most anchor-worthy)
  result[b] = lines.filter(l => l.isParagraphStart || l.isSpeechStart)
}

fs.writeFileSync(OUT, JSON.stringify(result, null, 2) + "\n")
console.log(`Wrote ${OUT}. Candidates per book:`)
for (let b = 1; b <= 24; b++) {
  console.log(`  Book ${String(b).padStart(2)}: ${result[b].length} candidates`)
}
