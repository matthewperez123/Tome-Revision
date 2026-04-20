#!/usr/bin/env npx tsx
/**
 * Eight Odyssey anchors don't literal-match the content because Bryant's
 * source embeds U+FEFF (zero-width no-break space) before em-dashes. Our
 * anchor text was written without the FEFF. The reader's substring match
 * is strict, so these eight annotations currently won't anchor.
 *
 * This script rewrites each failing anchor in its book-NN.ts file with
 * the actual Bryant literal (FEFF-preserved).
 */

import * as fs from "fs"
import * as path from "path"
import { GENERATED_ODYSSEY_ANNOTATIONS } from "../../src/lib/virgil/odyssey-annotations"

const ROOT = path.resolve(__dirname, "..", "..")
const CONTENT_DIR = path.join(ROOT, "public/content/the-odyssey")
const DIR = path.join(ROOT, "src/lib/virgil/odyssey")

const norm = (s: string) => s.replace(/\uFEFF/g, "")

let fixes = 0
for (const ann of GENERATED_ODYSSEY_ANNOTATIONS) {
  if (ann.bookId !== "the-odyssey") continue
  const cp = path.join(CONTENT_DIR, `ch-${ann.chapterNumber}.json`)
  const html = JSON.parse(fs.readFileSync(cp, "utf8")).html as string

  if (html.includes(ann.anchorText)) continue // already lands

  // Find the FEFF-normalized match and extract the original substring
  // from the html with its FEFF characters intact.
  const normHtml = norm(html)
  const needle = norm(ann.anchorText)
  const idx = normHtml.indexOf(needle)
  if (idx === -1) { console.log("✗ cannot locate in content:", ann.id); continue }

  // Walk the original html, counting non-FEFF characters until we reach idx
  let origStart = -1
  let count = 0
  for (let i = 0; i < html.length; i++) {
    if (html[i] === "\uFEFF") continue
    if (count === idx) { origStart = i; break }
    count += 1
  }
  if (origStart === -1) origStart = 0

  // Walk forward to capture `needle.length` non-FEFF characters
  let origEnd = origStart
  let taken = 0
  while (origEnd < html.length && taken < needle.length) {
    if (html[origEnd] !== "\uFEFF") taken += 1
    origEnd += 1
  }
  const literal = html.slice(origStart, origEnd)

  // Now rewrite the anchorText in the book-NN.ts file
  const bookFile = path.join(DIR, `book-${String(ann.chapterNumber).padStart(2, "0")}.ts`)
  const src = fs.readFileSync(bookFile, "utf8")
  const idIdx = src.indexOf(`id: "${ann.id}"`)
  if (idIdx === -1) { console.log("✗ id not found in file:", ann.id); continue }

  // anchorText literal is escaped to JS string. FEFF in literal becomes \uFEFF
  // Use string escaping so the source doesn't contain an invisible char.
  const escapedLiteral = literal
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\uFEFF/g, "\\uFEFF")
  const newLine = `anchorText: "${escapedLiteral}"`

  // Find the specific anchorText line within this annotation's block
  const nextIdRe = /id:\s*"odyssey-/g
  nextIdRe.lastIndex = idIdx + 10
  const nextMatch = nextIdRe.exec(src)
  const end = nextMatch ? nextMatch.index : src.length
  const scope = src.slice(idIdx, end)
  // Replace the old anchorText line
  const escOld = ann.anchorText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const anchorRe = new RegExp(`anchorText:\\s*"${escOld}"`)
  if (!anchorRe.test(scope)) { console.log("✗ anchor not found in scope:", ann.id); continue }
  const newScope = scope.replace(anchorRe, newLine)
  const out = src.slice(0, idIdx) + newScope + src.slice(end)
  fs.writeFileSync(bookFile, out, "utf8")
  fixes += 1
  console.log(`✓ ${ann.id}: embedded FEFF into anchor`)
}

console.log(`\nFixed: ${fixes}`)
