#!/usr/bin/env npx tsx
/**
 * parse-oe-source.ts
 *
 * Parses the Harrison & Sharp 1893 Old English Beowulf from Project
 * Gutenberg #9700 (content/books/beowulf/original.htm) into a structured
 * JSON (content/books/beowulf/original.json) keyed by fitt (I..XLIII).
 *
 * Each OE line carries:
 *   - klaeberLine: the standard Klaeber/Krapp-Dobbie line number when
 *     Harrison & Sharp supply one (many lines in this edition carry
 *     <a class="lineno" name="liN">N</a> anchors)
 *   - hsLine:      the index of the line within Harrison & Sharp's
 *     numbering (1-based sequential across the whole poem)
 *   - text:        the OE line with macrons, caesura preserved as the
 *     characters between half-lines (Harrison & Sharp use several
 *     non-breaking spaces — we mark the caesura with `  |  `)
 *   - fitt:        fitt number (1..43)
 *
 * Output shape:
 *   {
 *     source: "Harrison & Sharp, 1893 (Project Gutenberg #9700)",
 *     totalLines: N,
 *     fitts: [
 *       { fitt: 1, title: "The Passing of Scyld", lineCount: M, lines: [...] },
 *       ...
 *     ]
 *   }
 *
 * This produces the *data* side of the bilingual scaffolding. The
 * reader-side rendering (<BilingualBlock>) consumes this when the
 * "Show Old English" toggle is on.
 */

import * as fs from "fs"
import * as path from "path"

const ROOT = path.resolve(__dirname, "..", "..")
const SRC = path.join(ROOT, "content/books/beowulf/original.htm")
const OUT = path.join(ROOT, "content/books/beowulf/original.json")

interface OELine {
  klaeberLine?: number
  hsLine: number
  text: string
  fitt: number
}

interface FittBlock {
  fitt: number
  title: string
  lineCount: number
  lines: OELine[]
}

function normalizeCaesura(text: string): string {
  // Harrison & Sharp separate half-lines with several &nbsp; (non-breaking
  // spaces). In text content that arrives as literal U+00A0. Collapse
  // runs of 2+ non-breaking spaces / regular spaces into our caesura
  // marker.
  return text
    .replace(/\u00A0+/g, " ")
    .replace(/\s{4,}/g, "  |  ")
    .replace(/\s{2,3}/g, " ")
    .trim()
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&nbsp;/g, "\u00A0")
    .replace(/&thorn;/g, "þ")
    .replace(/&eth;/g, "ð")
    .replace(/&THORN;/g, "Þ")
    .replace(/&ETH;/g, "Ð")
    .replace(/&aelig;/g, "æ")
    .replace(/&AElig;/g, "Æ")
    .replace(/&oelig;/g, "œ")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
}

function stripInnerTags(s: string): string {
  return s.replace(/<[^>]+>/g, "")
}

function run(): void {
  const html = fs.readFileSync(SRC, "utf8")

  // Slice out only the poem body (from <a name="fittI"></a> to the end-note marker).
  const startIdx = html.indexOf('<a name="fittI"></a>')
  const endIdx = html.indexOf('NOTES.')
  const body = endIdx > startIdx ? html.slice(startIdx, endIdx) : html.slice(startIdx)

  // Split on fitt anchors. Each chunk after the anchor belongs to that fitt.
  const fittRegex = /<a name="fitt([IVXL]+)"><\/a>\s*<h2>[^<]*?\.\s*([^<]+?)<\/h2>/g
  const fittStarts: Array<{ fitt: number; title: string; startIdx: number; endIdx: number }> = []
  let match: RegExpExecArray | null
  while ((match = fittRegex.exec(body)) !== null) {
    const roman = match[1]
    const fitt = romanToInt(roman)
    if (fitt < 1 || fitt > 43) continue
    fittStarts.push({
      fitt,
      title: decodeEntities(match[2]).trim(),
      startIdx: match.index + match[0].length,
      endIdx: -1,
    })
  }
  // Set endIdx for each fitt = startIdx of next (or body end).
  for (let i = 0; i < fittStarts.length; i++) {
    fittStarts[i].endIdx = i + 1 < fittStarts.length ? fittStarts[i + 1].startIdx - 1 : body.length
  }

  const fitts: FittBlock[] = []
  let hsCounter = 0
  for (const fs0 of fittStarts) {
    const chunk = body.slice(fs0.startIdx, fs0.endIdx)
    const lineRegex = /(?:<a[^>]*\bname="li(\d+)"[^>]*>(\d+)<\/a>|<a\s+name="li(\d+)"\s*><\/a>)?\s*<div class="line">([\s\S]*?)<\/div>/g
    const lines: OELine[] = []
    let lm: RegExpExecArray | null
    while ((lm = lineRegex.exec(chunk)) !== null) {
      const klaeberFromNumber = lm[2] ? parseInt(lm[2], 10) : undefined
      // raw text: strip inner <a>/<span>/footnote markers
      const rawText = lm[4]
      const cleaned = normalizeCaesura(decodeEntities(stripInnerTags(rawText)))
      if (!cleaned) continue
      hsCounter += 1
      lines.push({
        klaeberLine: klaeberFromNumber,
        hsLine: hsCounter,
        text: cleaned,
        fitt: fs0.fitt,
      })
    }
    fitts.push({ fitt: fs0.fitt, title: fs0.title, lineCount: lines.length, lines })
  }

  const totalLines = fitts.reduce((n, f) => n + f.lineCount, 0)
  const out = {
    source: "Harrison & Sharp, 1893 (Project Gutenberg #9700)",
    sourceUrl: "https://www.gutenberg.org/ebooks/9700",
    edition: "Harrison, J.A. & Sharp, R., Beowulf: An Anglo-Saxon Poem, 4th ed. (1893)",
    totalLines,
    fittCount: fitts.length,
    fitts,
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2))
  console.log(`\n  ✓ Parsed ${totalLines} OE lines across ${fitts.length} fitts`)
  for (const f of fitts.slice(0, 3)) {
    console.log(`    Fitt ${f.fitt} "${f.title}" — ${f.lineCount} lines; first: "${f.lines[0]?.text.slice(0, 60)}"`)
  }
  console.log(`    ...`)
  for (const f of fitts.slice(-2)) {
    console.log(`    Fitt ${f.fitt} "${f.title}" — ${f.lineCount} lines`)
  }
}

function romanToInt(roman: string): number {
  const m: Record<string, number> = { I: 1, V: 5, X: 10, L: 50 }
  let total = 0
  for (let i = 0; i < roman.length; i++) {
    const cur = m[roman[i]]
    const next = m[roman[i + 1] ?? ""]
    if (next && cur < next) {
      total += next - cur
      i++
    } else {
      total += cur
    }
  }
  return total
}

run()
