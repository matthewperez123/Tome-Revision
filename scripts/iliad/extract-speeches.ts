#!/usr/bin/env npx tsx
/**
 * extract-speeches.ts — auto-identify speeches in Bryant's Iliad books.
 *
 * Scans each ch-N.json (N=2..24), walks verse lines in order, and whenever a
 * line opens a speech (contains U+201C "left double quotation mark") extracts
 *   - the first 40 chars of the speech as the `opens` cue
 *   - the speaker, by looking backwards through the preceding ~200 chars of
 *     verse for the most-recent name match from a Bryant-usage alias table
 *
 * Writes results to a JSON-structured TypeScript module that gets merged
 * into book-speeches.ts. Attribution is heuristic; coverage is reported
 * per-book so missing/ambiguous speeches can be hand-fixed later.
 *
 * Usage:  npx tsx scripts/iliad/extract-speeches.ts
 */

import * as fs from "fs"
import * as path from "path"
import * as cheerio from "cheerio"

const ROOT = path.resolve(__dirname, "..", "..")
const CONTENT_DIR = path.join(ROOT, "public/content/the-iliad")
const OUT_FILE = path.join(__dirname, "book-speeches-generated.json")

interface ChapterJSON {
  html: string
  title: string
}

// Canonical name ← Bryant's aliases. Most-specific first (longer forms
// matched before shorter prefixes).
const ALIASES: Array<[string, string[]]> = [
  ["Achilles", ["Achilles", "Pelides", "Peleus' son", "son of Peleus", "Peleides", "Aeacides", "swift-footed"]],
  ["Agamemnon", ["Agamemnon", "Atrides", "Atreides", "king of men", "Atreus' son", "son of Atreus"]],
  ["Menelaus", ["Menelaus", "warlike Menelaus"]],
  ["Odysseus", ["Ulysses", "son of Laertes", "Laertes' son", "Ithacan"]],
  ["Nestor", ["Nestor", "Neleus' son", "Pylian", "Neleides", "hoary chief"]],
  ["Diomed", ["Diomed", "Diomedes", "Tydides", "Tydeus' son", "son of Tydeus"]],
  ["Ajax", ["Ajax"]],
  ["Patroclus", ["Patroclus", "Menoetiades", "son of Menoetius"]],
  ["Hector", ["Hector", "Priam's son", "son of Priam", "Priamides", "tamer of horses", "crest-waving"]],
  ["Priam", ["aged Priam", "Priam"]],
  ["Paris", ["Alexander", "Paris", "Alexandros"]],
  ["Helen", ["Helen", "Argive Helen"]],
  ["Aeneas", ["Aeneas", "son of Anchises", "Anchises' son"]],
  ["Sarpedon", ["Sarpedon"]],
  ["Glaucus", ["Glaucus"]],
  ["Andromache", ["Andromache"]],
  ["Hecuba", ["Hecuba"]],
  ["Chryses", ["Chryses"]],
  ["Calchas", ["Calchas"]],
  ["Zeus", ["Jove", "Jupiter", "Saturnian", "cloud-compeller", "cloud-gatherer", "Olympian", "Zeus", "father of the gods"]],
  ["Hera", ["Juno", "Hera"]],
  ["Athena", ["Pallas", "Minerva", "Athena", "Athené", "blue-eyed"]],
  ["Apollo", ["Apollo", "Phoebus", "far-darter", "silver-bowed"]],
  ["Aphrodite", ["Venus", "Aphrodite"]],
  ["Poseidon", ["Neptune", "Poseidon", "Earth-shaker", "sea-king"]],
  ["Ares", ["Mars", "Ares"]],
  ["Hephaestus", ["Vulcan", "Hephaestus"]],
  ["Thetis", ["Thetis", "silver-footed"]],
  ["Hermes", ["Mercury", "Hermes", "Argus-slayer"]],
  ["Artemis", ["Diana", "Artemis"]],
  ["Iris", ["Iris"]],
  ["Idomeneus", ["Idomeneus"]],
  ["Dolon", ["Dolon"]],
  ["Rhesus", ["Rhesus"]],
  ["Briseis", ["Briseis"]],
  ["Chryseis", ["Chryseïs", "Chryseis"]],
  ["Scamander", ["Scamander", "Xanthus"]],
  ["Phoenix", ["Phoenix"]],
  ["Teucer", ["Teucer"]],
  ["Antenor", ["Antenor"]],
  ["Hecuba", ["Hecuba"]],
  ["Polydamas", ["Polydamas"]],
  ["Antilochus", ["Antilochus"]],
  ["Automedon", ["Automedon"]],
  ["Agenor", ["Agenor"]],
  ["Lycaon", ["Lycaon"]],
  ["Machaon", ["Machaon"]],
  ["Sthenelus", ["Sthenelus"]],
  ["Eurypylus", ["Eurypylus"]],
  ["Meriones", ["Meriones"]],
  ["Deiphobus", ["Deiphobus", "Deïphobus"]],
  ["Leto", ["Latona", "Leto"]],
  ["Hermes", ["Mercury", "Hermes", "Argus-slayer", "Argicide"]],
  ["Dione", ["Dione"]],
  ["Themis", ["Themis"]],
  ["Polyxenus", ["Polyxenus"]],
  ["Talthybius", ["Talthybius"]],
]

interface Speech { speaker: string; opens: string }

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

/** Attribution verbs Bryant uses to introduce speeches. */
const ATTRIB_VERBS =
  /\b(spake|spoke|said|saith|answered|answers|answering|replied|replies|replying|cried|cries|bespake|bespoke|addressed|addresseth|began|begins|uttered|utters|exclaimed|exclaims|rejoined|rejoins|shouted|shouts|called|calls|asked|asks|made\s+reply|gave\s+reply|returning\s+answer)\b/gi

/** Find all (name, position) matches in `context`. */
function findAllNames(context: string): Array<{ canon: string; pos: number; len: number; isObject: boolean }> {
  const lower = context.toLowerCase()
  const hits: Array<{ canon: string; pos: number; len: number; isObject: boolean }> = []
  for (const [canon, forms] of ALIASES) {
    for (const form of forms) {
      const needle = form.toLowerCase()
      let from = 0
      while (true) {
        const pos = lower.indexOf(needle, from)
        if (pos === -1) break
        const prev = pos === 0 ? " " : lower[pos - 1]
        const next = pos + needle.length >= lower.length ? " " : lower[pos + needle.length]
        if (!/[a-z]/.test(prev) && !/[a-z]/.test(next)) {
          // Detect indirect-object marker: "to Achilles", "unto Priam",
          // "to the son of Peleus", "bespake Y", "addressed X". If the
          // name is preceded (with at most "the/a/an" between) by any of
          // these markers within ~30 chars, it's the ADDRESSEE.
          const windowStart = Math.max(0, pos - 30)
          const pre = lower.slice(windowStart, pos)
          const isObject = /\b(to|unto|toward|towards|addressing|addressed|bespake|bespoke)(\s+(the|an?|his|her|thy|my|our|their))*\s*$/.test(pre)
          hits.push({ canon, pos, len: needle.length, isObject })
        }
        from = pos + needle.length
      }
    }
  }
  return hits.sort((a, b) => a.pos - b.pos)
}

/**
 * Find the speaker in `context`. Priority:
 *   1. A name that appears within 25 chars of an attribution verb — either
 *      just before it ("X spake") or just after ("spake X"). Most-recent
 *      verb wins, because Bryant attributions sit immediately before the
 *      speech.
 *   2. Fallback: the most-recent name anywhere in the context.
 */
function attribute(context: string): string | null {
  const names = findAllNames(context)
  if (names.length === 0) return null

  // Collect all attribution-verb positions.
  const verbs: Array<{ start: number; end: number }> = []
  let m: RegExpExecArray | null
  ATTRIB_VERBS.lastIndex = 0
  while ((m = ATTRIB_VERBS.exec(context)) !== null) {
    verbs.push({ start: m.index, end: m.index + m[0].length })
  }

  // Candidate names = those NOT marked as indirect object.
  const subjects = names.filter((n) => !n.isObject)

  // Walk verbs from most-recent to oldest; first subject-name near any wins.
  for (let i = verbs.length - 1; i >= 0; i--) {
    const v = verbs[i]
    const before = subjects
      .filter((n) => n.pos + n.len <= v.start && v.start - (n.pos + n.len) <= 40)
      .sort((a, b) => b.pos - a.pos)[0]
    const after = subjects
      .filter((n) => n.pos >= v.end && n.pos - v.end <= 40)
      .sort((a, b) => a.pos - b.pos)[0]
    if (before) return before.canon
    if (after) return after.canon
  }

  // Fallback: most-recent subject name; then most-recent name overall.
  if (subjects.length > 0) return subjects[subjects.length - 1].canon
  return names[names.length - 1].canon
}

function extractBook(bookNumber: number): { matched: Speech[]; ambiguous: number } {
  const filePath = path.join(CONTENT_DIR, `ch-${bookNumber}.json`)
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as ChapterJSON
  const $ = cheerio.load(raw.html, { xml: false })
  const $body = $("body").length ? $("body") : $.root()

  const lines = $body
    .find("section[role='doc-chapter'] p > span, section[role='doc-preface'] p > span")
    .toArray()
    .map((el) => ({ raw: $(el).text(), norm: normalize($(el).text()) }))

  const matched: Speech[] = []
  let ambiguous = 0

  for (let i = 0; i < lines.length; i++) {
    const { raw: rawText } = lines[i]
    // Look for ALL opening curly quotes on this line (rare but possible
    // for back-to-back speeches inside a single line).
    let searchFrom = 0
    while (true) {
      const openIdx = rawText.indexOf("\u201C", searchFrom)
      if (openIdx === -1) break

      // Speech cue: text after the opening quote, confined to the
      // opening line (the transform does single-line substring matching).
      // If the speech runs to end-of-line without punctuation, we take
      // the whole rest; otherwise we stop at the first clause-breaker.
      const afterQuote = rawText.slice(openIdx + 1)
      let cue = normalize(afterQuote)
      // Prefer cutting at a strong clause boundary if one exists in the
      // first ~50 chars; otherwise keep the full line's remainder.
      const clauseCut = cue.slice(0, 60).search(/[,.?!;:"\u2014\u2013-]/)
      if (clauseCut > 4) cue = cue.slice(0, clauseCut)
      cue = cue.trim()
      if (cue.length < 4) {
        searchFrom = openIdx + 1
        continue
      }

      // Attribution context: up to ~200 chars of the preceding narrative.
      const preOnThisLine = rawText.slice(0, openIdx)
      const preceding: string[] = [preOnThisLine]
      for (let k = i - 1; k >= 0 && preceding.join(" ").length < 300; k--) {
        preceding.unshift(lines[k].raw)
      }
      const context = normalize(preceding.join(" "))
      const speaker = attribute(context)

      if (speaker) {
        matched.push({ speaker, opens: cue })
      } else {
        matched.push({ speaker: "UNKNOWN", opens: cue })
        ambiguous += 1
      }

      searchFrom = openIdx + 1
    }
  }

  return { matched, ambiguous }
}

// ── Run ─────────────────────────────────────────────────────────────────

const output: Record<number, Speech[]> = {}
let totalMatched = 0
let totalAmbiguous = 0

for (let b = 2; b <= 24; b++) {
  const { matched, ambiguous } = extractBook(b)
  output[b] = matched
  totalMatched += matched.length
  totalAmbiguous += ambiguous
  console.log(
    `Book ${String(b).padStart(2)}: ${matched.length} speeches (${ambiguous} ambiguous)`,
  )
}

console.log(`\nTotal: ${totalMatched} speeches, ${totalAmbiguous} ambiguous`)

fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2) + "\n", "utf8")
console.log(`\nWrote ${OUT_FILE}`)
