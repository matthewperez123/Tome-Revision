#!/usr/bin/env npx tsx
/**
 * build-anchor-migration.ts — produce the old-Butler → new-Bryant anchor
 * migration map for the 12 hand-written Odyssey annotations in
 * `src/lib/virgil/annotations.ts`.
 *
 * Each Butler-prose `anchorText` is replaced by a Bryant-line lookup:
 *   - we grep Bryant's verse for scene-characteristic keywords
 *   - pick the matching line's `data-odyssey-line` number
 *   - emit the first ~60 chars of that line as the new `anchorText`
 *
 * Output: scripts/odyssey/anchor-migration.json — human-reviewable JSON.
 *
 * Usage: npx tsx scripts/odyssey/build-anchor-migration.ts
 */

import * as fs from "fs"
import * as path from "path"

const ROOT = path.resolve(__dirname, "..", "..")
const CONTENT_DIR = path.join(ROOT, "public/content/the-odyssey")
const OUT_FILE = path.join(__dirname, "anchor-migration.json")

interface MigrationEntry {
  id: string
  bookNumber: number
  oldAnchorText: string
  newBookNumber: number
  newLineNumber: number | null
  newAnchorText: string | null
  newAnchorContext: string | null
  matchedBy: string
  sceneDescription: string
}

/** Scene keyword sets — characteristic phrases used to locate a Bryant
 *  line for each Butler-anchored passage. First keyword list that hits a
 *  line wins; we report which keyword triggered the match. */
const SCENES: Array<
  Omit<MigrationEntry, "newLineNumber" | "newAnchorText" | "newAnchorContext" | "matchedBy" | "newBookNumber"> & {
    newBookNumber: number
    keywords: string[][]
  }
> = [
  {
    id: "odyssey-1-invocation",
    bookNumber: 1,
    newBookNumber: 1,
    oldAnchorText: "Tell me, O Muse, of that ingenious hero",
    sceneDescription: "Book I opening invocation — polytropos / the Muse",
    keywords: [["Tell me, O Muse"], ["sagacious man"]],
  },
  {
    id: "odyssey-1-xenia-athena",
    bookNumber: 1,
    newBookNumber: 1,
    oldAnchorText: "Telemachus saw her long before any one else did",
    sceneDescription: "Telemachus first sees Athena (as Mentes) at the palace door",
    keywords: [["Telemachus", "first", "see the goddess"], ["Telemachus the godlike was the first"], ["first", "To see the goddess"]],
  },
  {
    id: "odyssey-9-cave-entry",
    bookNumber: 9,
    newBookNumber: 9,
    oldAnchorText: "My men begged me",
    sceneDescription: "Companions urge Odysseus to take cheeses and flee before the Cyclops returns",
    keywords: [["cheeses", "entreated"], ["companions", "entreated"], ["lambs", "kids", "drive"], ["companions", "beseech"]],
  },
  {
    id: "odyssey-9-guest-gift",
    bookNumber: 9,
    newBookNumber: 9,
    oldAnchorText: "I will eat Nobody last",
    sceneDescription: "Cyclops promises to eat Noman last as a guest-gift",
    keywords: [["Noman", "last"], ["Noman will I eat"], ["gift", "stranger's", "Noman"]],
  },
  {
    id: "odyssey-9-nobody-pun",
    bookNumber: 9,
    newBookNumber: 9,
    oldAnchorText: "My name is Nobody",
    sceneDescription: "Odysseus tells the Cyclops his name is Noman",
    keywords: [["My name is Noman"], ["Noman is my name"], ["call me Noman"]],
  },
  {
    id: "odyssey-9-blinding",
    bookNumber: 9,
    newBookNumber: 9,
    oldAnchorText: "I drove it full into his eye",
    sceneDescription: "Odysseus drives the heated olive stake into Polyphemus's eye",
    keywords: [["thrust", "stake", "eye"], ["eye", "stake"], ["drove", "stake"], ["bored", "eye"], ["into his eye"]],
  },
  {
    id: "odyssey-9-hubris",
    bookNumber: 9,
    newBookNumber: 9,
    oldAnchorText: "tell them it was Odysseus",
    sceneDescription: "Odysseus shouts his real name back at blinded Polyphemus",
    keywords: [["Ulysses", "sacker"], ["Ulysses, son of Laertes"], ["the sacker of cities"]],
  },
  {
    id: "odyssey-9-poseidon-prayer",
    bookNumber: 9,
    newBookNumber: 9,
    oldAnchorText: "hear me, Poseidon",
    sceneDescription: "Polyphemus prays to his father Poseidon for vengeance",
    keywords: [["Hear me", "Neptune"], ["Hear", "earth-encircler"], ["Hear me", "Poseidon"], ["Neptune", "if indeed"]],
  },
  {
    id: "odyssey-9-rams",
    bookNumber: 9,
    newBookNumber: 9,
    oldAnchorText: "I fastened them silently together",
    sceneDescription: "Odysseus binds three rams together for the escape beneath them",
    keywords: [["rams", "three"], ["withies", "twisted"], ["bound", "rams"], ["three together"], ["fleecy rams"]],
  },
  {
    id: "odyssey-9-cyclops-primitive",
    bookNumber: 9,
    newBookNumber: 9,
    oldAnchorText: "They have no laws nor assemblies",
    sceneDescription: "Homer's ethnography of the lawless Cyclopes",
    keywords: [["no assemblies"], ["no laws"], ["neither laws", "assemblies"], ["councils", "laws"]],
  },
  {
    id: "odyssey-23-bed",
    bookNumber: 23,
    newBookNumber: 23,
    oldAnchorText: "who has been taking my bed",
    sceneDescription: "Odysseus reveals the secret of the olive-rooted marriage bed",
    keywords: [["olive", "bed"], ["olive-tree", "bed"], ["rooted", "bed"], ["wrought", "bedstead"], ["trunk", "olive"]],
  },
  {
    id: "odyssey-23-reunion",
    bookNumber: 23,
    newBookNumber: 23,
    oldAnchorText: "threw her arms about his neck",
    sceneDescription: "Penelope's wordless embrace of the recognized Odysseus",
    keywords: [["threw", "arms", "neck"], ["arms", "around", "neck"], ["cast", "arms"], ["clasp", "neck"], ["flung", "arms"]],
  },
]

interface LineRecord {
  lineNumber: number
  text: string
}

function extractLines(bookNumber: number): LineRecord[] {
  const filePath = path.join(CONTENT_DIR, `ch-${bookNumber}.json`)
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as { html: string }
  const records: LineRecord[] = []
  const re = /data-odyssey-line="(\d+)"[^>]*>([^<]*)</g
  let m: RegExpExecArray | null
  while ((m = re.exec(raw.html)) !== null) {
    records.push({ lineNumber: Number(m[1]), text: m[2] })
  }
  return records
}

function findLineMatch(
  lines: LineRecord[],
  keywordSets: string[][],
): { line: LineRecord; matchedBy: string } | null {
  // Try each keyword set in order; a line "matches" a set when it (or
  // a short ±2-line window around it) contains all keywords (case-insensitive).
  const texts = lines.map((l) => l.text.toLowerCase())
  for (const kws of keywordSets) {
    const needles = kws.map((k) => k.toLowerCase())
    for (let i = 0; i < lines.length; i++) {
      // Join a ±2-line window for multi-keyword matches (Bryant enjambment
      // often splits an idea across two or three lines).
      const windowText = texts.slice(Math.max(0, i - 2), Math.min(texts.length, i + 3)).join(" ")
      if (needles.every((n) => windowText.includes(n))) {
        return { line: lines[i], matchedBy: kws.join(" + ") }
      }
    }
  }
  return null
}

const migrations: MigrationEntry[] = []
const linesByBook = new Map<number, LineRecord[]>()

for (const scene of SCENES) {
  if (!linesByBook.has(scene.newBookNumber)) {
    linesByBook.set(scene.newBookNumber, extractLines(scene.newBookNumber))
  }
  const lines = linesByBook.get(scene.newBookNumber)!
  const match = findLineMatch(lines, scene.keywords)

  if (match) {
    // Include a short context — 3 lines around the hit — for manual review.
    const idx = lines.findIndex((l) => l.lineNumber === match.line.lineNumber)
    const ctx = lines
      .slice(Math.max(0, idx - 1), Math.min(lines.length, idx + 2))
      .map((l) => `  ${String(l.lineNumber).padStart(4)}: ${l.text}`)
      .join("\n")

    migrations.push({
      id: scene.id,
      bookNumber: scene.bookNumber,
      oldAnchorText: scene.oldAnchorText,
      newBookNumber: scene.newBookNumber,
      newLineNumber: match.line.lineNumber,
      newAnchorText: match.line.text.trim().slice(0, 80),
      newAnchorContext: ctx,
      matchedBy: match.matchedBy,
      sceneDescription: scene.sceneDescription,
    })
  } else {
    migrations.push({
      id: scene.id,
      bookNumber: scene.bookNumber,
      oldAnchorText: scene.oldAnchorText,
      newBookNumber: scene.newBookNumber,
      newLineNumber: null,
      newAnchorText: null,
      newAnchorContext: null,
      matchedBy: "UNMATCHED — manual review required",
      sceneDescription: scene.sceneDescription,
    })
  }
}

fs.writeFileSync(OUT_FILE, JSON.stringify(migrations, null, 2) + "\n", "utf8")

// ── Console report ───────────────────────────────────────────────────────
console.log(`\nAnchor migration map — ${migrations.length} annotations\n`)
for (const m of migrations) {
  const status = m.newLineNumber == null ? "❌ UNMATCHED" : "✓"
  console.log(`${status} ${m.id}`)
  console.log(`   scene:       ${m.sceneDescription}`)
  console.log(`   old anchor:  "${m.oldAnchorText}"  (Butler)`)
  if (m.newLineNumber != null) {
    console.log(`   → Book ${m.bookNumber}, line ${m.newLineNumber}`)
    console.log(`   new anchor:  "${m.newAnchorText}"  (Bryant)`)
    console.log(`   matched by:  ${m.matchedBy}`)
    console.log(`   context:`)
    console.log(m.newAnchorContext)
  }
  console.log()
}

const matched = migrations.filter((m) => m.newLineNumber != null).length
console.log(
  `Summary: ${matched}/${migrations.length} matched.  ` +
    `${migrations.length - matched} require manual anchor-text search.`,
)
console.log(`\nWrote ${OUT_FILE}`)
