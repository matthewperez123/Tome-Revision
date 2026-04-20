#!/usr/bin/env npx tsx
/**
 * extract-speeches.ts — auto-identify speeches in Dryden's Aeneid books.
 *
 * Scans each public/content/the-aeneid/ch-{N}.json (N=0..11), walks verse
 * lines in order, and whenever a line opens a speech (contains U+201C
 * "left double quotation mark") extracts:
 *   - the first ~50 chars of the speech as the `opens` cue
 *   - the speaker, by looking backwards through preceding narrative for
 *     the most-recent name that matches a Dryden-usage alias table
 *
 * Writes results to book-speeches-generated.json for merge into
 * book-speeches.ts. Attribution is heuristic; coverage is reported per
 * book so misses / ambiguities can be hand-fixed (Book I is hand-curated).
 *
 * Usage:  npx tsx scripts/aeneid/extract-speeches.ts
 */

import * as fs from "fs"
import * as path from "path"
import * as cheerio from "cheerio"

const ROOT = path.resolve(__dirname, "..", "..")
const CONTENT_DIR = path.join(ROOT, "public/content/the-aeneid")
const OUT_FILE = path.join(__dirname, "book-speeches-generated.json")

interface ChapterJSON {
  html: string
  title: string
}

// Canonical name (Roman for gods) ← Dryden + Greek-carryover aliases.
// More-specific / multi-word forms first so "pallas athene" wins over
// "pallas" which would otherwise resolve both the goddess and Evander's son.
const ALIASES: Array<[string, string[]]> = [
  // Trojan-exile principals
  ["Aeneas", ["Aeneas", "anchises' son", "son of anchises", "anchises's son", "trojan chief", "trojan prince", "pious chief", "the chief"]],
  ["Anchises", ["Anchises", "aged sire", "sire of aeneas"]],
  ["Ascanius", ["Ascanius", "iulus", "young iulus"]],
  ["Creusa", ["Creusa"]],
  ["Achates", ["Achates", "fidus achates", "loyal achates"]],
  ["Ilioneus", ["Ilioneus"]],
  ["Palinurus", ["Palinurus"]],
  ["Panthus", ["Panthus"]],
  ["Deiphobus", ["Deiphobus"]],
  // Carthaginians
  ["Dido", ["Dido", "the queen", "sidonian queen", "tyrian queen", "phoenician queen", "elissa"]],
  ["Anna", ["Anna"]],
  ["Iarbas", ["Iarbas"]],
  // Italians
  ["Turnus", ["Turnus", "daunian hero", "rutulian", "rutulian prince", "rutulian chief"]],
  ["Latinus", ["Latinus", "latian king", "aged latinus"]],
  ["Amata", ["Amata"]],
  ["Lavinia", ["Lavinia"]],
  ["Mezentius", ["Mezentius"]],
  ["Lausus", ["Lausus"]],
  ["Camilla", ["Camilla"]],
  ["Drances", ["Drances"]],
  ["Evander", ["Evander", "arcadian king"]],
  ["Pallas", ["Pallas", "evander's son", "son of evander"]],
  ["Nisus", ["Nisus"]],
  ["Euryalus", ["Euryalus"]],
  ["Messapus", ["Messapus"]],
  ["Juturna", ["Juturna", "metiscus"]],
  ["Tiberinus", ["Tiberinus", "tiber-god", "father tiber"]],
  // Underworld
  ["Sibyl", ["Sibyl", "cumaean maid", "cumaean sibyl", "deiphobé", "deiphobe", "cumaean prophetess"]],
  ["Charon", ["Charon", "grisly boatman", "stygian pilot"]],
  // Gods — canonical is ROMAN
  ["Jove", ["Jove", "jupiter", "father jove", "sire of gods", "the thunderer", "saturnian", "king of gods", "king of heav'n"]],
  ["Juno", ["Juno", "hera", "saturnian queen", "imperial juno"]],
  ["Venus", ["Venus", "aphrodite", "cytherea", "cytherean", "queen of love", "erycina"]],
  ["Neptune", ["Neptune", "poseidon", "god of ocean", "ocean's king"]],
  ["Mercury", ["Mercury", "hermes", "cyllenian", "cyllenius"]],
  ["Apollo", ["Apollo", "phoebus", "phoebus apollo", "delian", "far-darter"]],
  ["Mars", ["Mars", "ares", "gradivus"]],
  ["Vulcan", ["Vulcan", "hephaestus", "mulciber"]],
  ["Minerva", ["Minerva", "athena", "pallas athene", "tritonia"]],
  ["Diana", ["Diana", "artemis", "trivia"]],
  ["Aeolus", ["Aeolus"]],
  ["Allecto", ["Allecto"]],
  ["Cupid", ["Cupid", "amor"]],
  ["Fame", ["Fame", "fama", "rumour", "rumor"]],
  // Pre-fall Trojans and Greek figures
  ["Priam", ["Priam", "aged priam"]],
  ["Hecuba", ["Hecuba"]],
  ["Andromache", ["Andromache"]],
  ["Helenus", ["Helenus"]],
  ["Helen", ["Helen"]],
  ["Pyrrhus", ["Pyrrhus", "neoptolemus"]],
  ["Ulysses", ["Ulysses", "odysseus", "ithacan", "laertes' son"]],
  ["Sinon", ["Sinon"]],
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

const ATTRIB_VERBS =
  /\b(spake|spoke|said|saith|answered|answers|answering|replied|replies|replying|cried|cries|bespake|bespoke|addressed|addresseth|began|begins|uttered|utters|exclaimed|exclaims|rejoined|rejoins|shouted|shouts|called|calls|asked|asks|made\s+reply|gave\s+reply|returning\s+answer|express'd|expressed|vented|urg'd|urged|invokes|invoked|proclaim'd|proclaimed|bespoke|rebuk'd|rebuked|reveal'd|revealed)\b/gi

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

function attribute(context: string): string | null {
  const names = findAllNames(context)
  if (names.length === 0) return null

  const verbs: Array<{ start: number; end: number }> = []
  let m: RegExpExecArray | null
  ATTRIB_VERBS.lastIndex = 0
  while ((m = ATTRIB_VERBS.exec(context)) !== null) {
    verbs.push({ start: m.index, end: m.index + m[0].length })
  }

  const subjects = names.filter((n) => !n.isObject)

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

  if (subjects.length > 0) return subjects[subjects.length - 1].canon
  return names[names.length - 1].canon
}

function extractBook(chapterIndex: number): { matched: Speech[]; ambiguous: number } {
  const filePath = path.join(CONTENT_DIR, `ch-${chapterIndex}.json`)
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
    let searchFrom = 0
    while (true) {
      const openIdx = rawText.indexOf("\u201C", searchFrom)
      if (openIdx === -1) break

      const afterQuote = rawText.slice(openIdx + 1)
      let cue = normalize(afterQuote)
      const clauseCut = cue.slice(0, 60).search(/[,.?!;:"\u2014\u2013-]/)
      if (clauseCut > 4) cue = cue.slice(0, clauseCut)
      cue = cue.trim()
      if (cue.length < 4) {
        searchFrom = openIdx + 1
        continue
      }

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

// ch-0 is Book I, ch-11 is Book XII
for (let idx = 0; idx <= 11; idx++) {
  const { matched, ambiguous } = extractBook(idx)
  const bookNumber = idx + 1
  output[bookNumber] = matched
  totalMatched += matched.length
  totalAmbiguous += ambiguous
  console.log(
    `Book ${String(bookNumber).padStart(2)}: ${matched.length} speeches (${ambiguous} ambiguous)`,
  )
}

console.log(`\nTotal: ${totalMatched} speeches, ${totalAmbiguous} ambiguous`)

fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2) + "\n", "utf8")
console.log(`\nWrote ${OUT_FILE}`)
