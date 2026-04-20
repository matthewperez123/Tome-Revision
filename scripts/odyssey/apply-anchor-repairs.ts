#!/usr/bin/env npx tsx
/**
 * apply-anchor-repairs.ts — read scripts/odyssey/anchor-repairs.json and
 * apply each repair by editing the corresponding book-NN.ts annotation
 * file: swap the `anchorText` string for the newAnchor Bryant-literal
 * phrase.
 */

import * as fs from "fs"
import * as path from "path"

const ROOT = path.resolve(__dirname, "..", "..")
const DIR = path.join(ROOT, "src/lib/virgil/odyssey")
const REPAIRS = JSON.parse(fs.readFileSync(path.join(__dirname, "anchor-repairs.json"), "utf8")) as Array<{
  id: string
  bookNumber: number
  oldAnchor: string
  newAnchor: string | null
}>

let applied = 0
let skipped = 0
let failed = 0

for (const r of REPAIRS) {
  if (!r.newAnchor) { skipped++; continue }
  const file = path.join(DIR, `book-${String(r.bookNumber).padStart(2, "0")}.ts`)
  const src = fs.readFileSync(file, "utf8")

  // The annotation object is located by id. Replace anchorText literal
  // within that block. Strategy: find `id: "<id>"` then the next
  // `anchorText: "<oldAnchor>"` and replace only that one.
  const idIdx = src.indexOf(`id: "${r.id}"`)
  if (idIdx === -1) { console.log("✗ id not found:", r.id); failed++; continue }

  // Scope: from idIdx to the next `id: "` or end-of-array
  const nextIdRe = /id:\s*"odyssey-/g
  nextIdRe.lastIndex = idIdx + 10
  const nextMatch = nextIdRe.exec(src)
  const scopeEnd = nextMatch ? nextMatch.index : src.length

  const scope = src.slice(idIdx, scopeEnd)
  // Escape regex chars in oldAnchor
  const escOld = r.oldAnchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const anchorRe = new RegExp(`anchorText:\\s*"${escOld}"`)
  const anchorMatch = scope.match(anchorRe)
  if (!anchorMatch) { console.log("✗ anchor literal not found for:", r.id); failed++; continue }

  // Clean newAnchor — strip Bryant's smart quotes, use ASCII double-quote-safe version
  // If the newAnchor contains a plain double-quote, replace with single for the TS literal.
  const cleanAnchor = r.newAnchor.replace(/["]/g, "'").trim()
  const newAnchorLiteral = `anchorText: "${cleanAnchor}"`

  // Replace within the scope, then splice
  const newScope = scope.replace(anchorRe, newAnchorLiteral)
  const next = src.slice(0, idIdx) + newScope + src.slice(scopeEnd)
  fs.writeFileSync(file, next, "utf8")
  applied++
}

console.log(`\nApplied: ${applied}`)
console.log(`Skipped (unresolved): ${skipped}`)
console.log(`Failed (lookup error): ${failed}`)
