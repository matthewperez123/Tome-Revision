#!/usr/bin/env npx tsx
/**
 * detect-features.ts — deterministic feature detection for the Odyssey
 * scholarly apparatus:
 *
 *   (A) Epithet index — first-occurrence per book of the six key Homeric
 *       epithets, with their Bryant renderings. The reader component
 *       overlays a superscript marker on the first occurrence only.
 *
 *   (B) Extended simile index — multi-line comparisons introduced by
 *       "As when...", "Like as...", or "E'en as..." and resolved by
 *       "So..." / "Even so..." several lines later. Target 20–30.
 *
 *   (C) Recognition scenes — the four formal anagnorisis moments
 *       (XVI, XIX, XXIII, XXIV) with line anchors drawn from the
 *       already-transformed content.
 *
 * Output: src/data/odyssey/apparatus.json — consumed by the reader.
 *
 * Usage: npx tsx scripts/odyssey/detect-features.ts
 */

import * as fs from "fs"
import * as path from "path"

const ROOT = path.resolve(__dirname, "..", "..")
const CONTENT_DIR = path.join(ROOT, "public/content/the-odyssey")
const OUT_DIR = path.join(ROOT, "src/data/odyssey")
const OUT_FILE = path.join(OUT_DIR, "apparatus.json")

// ── Types ─────────────────────────────────────────────────────────────────

interface EpithetOccurrence {
  bookNumber: number
  lineNumber: number
  matchedText: string
  context: string
}

interface EpithetEntry {
  id: string
  greek: string
  transliteration: string
  gloss: string
  subject: string
  bryantRenderings: string[]
  /** First occurrence per book; empty if not present. */
  firstByBook: Record<number, EpithetOccurrence>
  totalCount: number
}

interface SimileEntry {
  bookNumber: number
  startLine: number
  endLine: number
  opener: string
  resolver: string | null
  preview: string
  tenor: string | null     // what is being compared to (filled heuristically)
}

interface RecognitionScene {
  bookNumber: number
  anchor: {
    lineNumber: number
    anchorText: string
  }
  title: string
  description: string
}

interface Apparatus {
  generatedAt: string
  generatedBy: string
  epithets: EpithetEntry[]
  similes: SimileEntry[]
  recognitionScenes: RecognitionScene[]
  counts: {
    epithets: { total: number; distinctBookCoverage: Record<string, number> }
    similes: number
    recognitionScenes: number
  }
}

// ── Load transformed chapters ─────────────────────────────────────────────

interface Line {
  bookNumber: number
  lineNumber: number
  text: string
}

function loadBook(bookNumber: number): Line[] {
  const fp = path.join(CONTENT_DIR, `ch-${bookNumber}.json`)
  const raw = JSON.parse(fs.readFileSync(fp, "utf8")) as { html: string }
  const re = /data-odyssey-line="(\d+)"[^>]*>([^<]*)</g
  const lines: Line[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(raw.html)) !== null) {
    lines.push({
      bookNumber,
      lineNumber: Number(m[1]),
      text: m[2]
        // strip Bryant's invisible word-joiner so contains/regex work cleanly
        .replace(/\uFEFF/g, ""),
    })
  }
  return lines
}

const BOOKS: Record<number, Line[]> = {}
for (let b = 1; b <= 24; b++) BOOKS[b] = loadBook(b)

// ── (A) Epithet index ─────────────────────────────────────────────────────
//
// Regex notes — each epithet is pinned by a *characteristic* Bryant phrase
// that is unlikely to appear in any other sense. "sagacious" alone would
// over-match (Bryant applies it to Nestor once or twice); we pair it with
// Ulysses-adjacent context. For Dawn, "rosy-fingered" is unambiguous.

interface EpithetDef {
  id: string
  greek: string
  transliteration: string
  gloss: string
  subject: string
  bryantRenderings: string[]
  // Each detector is a line-level regex. Multi-line context matching is
  // handled by also grepping a ±1-line window for a qualifier.
  detectors: RegExp[]
}

const EPITHETS: EpithetDef[] = [
  {
    id: "polytropos",
    greek: "πολύτροπος",
    transliteration: "polytropos",
    gloss:
      "\"of many turns / wiles\" — the first word Homer applies to Odysseus (opens Book I). The Greek fuses the turns of the road with the turns of the mind; no English word captures both. Bryant reaches for \"sagacious\"; Butler has \"ingenious\"; Fagles \"the man of twists and turns.\" First-occurrence marker signals the formulaic system itself — Homeric verse is a lattice of reusable epithets.",
    subject: "Odysseus",
    bryantRenderings: ["sagacious", "much-wandering", "the sagacious chief"],
    detectors: [
      /\b(?:the )?sagacious (?:man|Ulysses|chief|hero|son of Laertes)\b/i,
      /\bUlysses,?\s+the sagacious\b/i,
      /\bmuch-wandering (?:Ulysses|chief|man|son)\b/i,
    ],
  },
  {
    id: "polymetis",
    greek: "πολύμητις",
    transliteration: "polymētis",
    gloss:
      "\"of many counsels / many-wiled\" — the epithet's second appearance in Greek, marking Odysseus specifically for mental resource. Shares the *mētis* root with the Outis pun (see Book IX). Bryant most often renders this as \"wise\" or \"full of wiles.\"",
    subject: "Odysseus",
    bryantRenderings: ["wise Ulysses", "full of wiles", "of many wiles"],
    detectors: [
      /\bwise Ulysses\b/i,
      /\bUlysses,? (?:full of wiles|of many wiles)\b/i,
      /\bfull of wiles\b/i,
    ],
  },
  {
    id: "glaukopis",
    greek: "γλαυκῶπις",
    transliteration: "glaukōpis",
    gloss:
      "\"gray-eyed\" or \"owl-eyed\" — the glaux (owl) is Athena's sacred bird. Bryant regularizes to \"blue-eyed.\" Appears reliably at the opening of every Athena speech in Bryant's translation, one of the oral-formulaic system's most visible joints.",
    subject: "Athena",
    bryantRenderings: ["blue-eyed Pallas", "blue-eyed goddess", "blue-eyed Minerva"],
    detectors: [
      /\bblue-eyed (?:Pallas(?:\s+Athen[èé])?|goddess|Minerva|maid|Athen[èé])\b/i,
    ],
  },
  {
    id: "rhododaktylos",
    greek: "ῥοδοδάκτυλος",
    transliteration: "rhododaktylos",
    gloss:
      "\"rosy-fingered\" — the canonical Homeric epithet for Eos / Dawn. One of the most-quoted formulas in world literature. The mere fact that Homer marks *each day* of Odysseus's return with a fresh dawn-formula tells you something about the poem's rhythmic structure.",
    subject: "Dawn (Eos)",
    bryantRenderings: ["rosy-fingered"],
    detectors: [/\brosy[- ]?fingered\b/i],
  },
  {
    id: "oinops-pontos",
    greek: "οἶνοψ πόντος",
    transliteration: "oinops pontos",
    gloss:
      "\"wine-faced sea\" (literally: \"wine-eyed\"). The precise color Homer means has been debated since antiquity — the Greeks had no discrete word for blue. Bryant typically softens to \"dark\" or \"dark-blue,\" occasionally \"purple\" when following the archaic register. The phrase has given every subsequent epic its sea: *wine-dark* is the default hue of poetic ocean.",
    subject: "the sea",
    bryantRenderings: ["wine-dark", "dark-blue sea", "purple deep"],
    detectors: [
      /\bwine[- ]?dark\b/i,
      /\bdark[- ]?blue (?:sea|deep|wave|ocean)\b/i,
      /\bpurple (?:sea|deep|wave|ocean)\b/i,
    ],
  },
  {
    id: "periphron",
    greek: "περίφρων",
    transliteration: "periphrōn",
    gloss:
      "\"of circumspect mind\" — Penelope's defining epithet. The word is cognate with *periphrasis* (roundabout speech); Homer paints her as someone whose every utterance is indirect and careful. Bryant reaches most often for \"sage,\" occasionally \"prudent\" or \"wary.\"",
    subject: "Penelope",
    bryantRenderings: ["sage Penelope", "prudent Penelope", "sage queen"],
    detectors: [
      /\bsage (?:Penelope|Penelopè|queen|wife|matron)\b/i,
      /\bprudent (?:Penelope|Penelopè|queen|wife|matron)\b/i,
    ],
  },
]

const epithetEntries: EpithetEntry[] = EPITHETS.map((def) => {
  const first: Record<number, EpithetOccurrence> = {}
  let total = 0
  for (let b = 1; b <= 24; b++) {
    const lines = BOOKS[b]
    for (const line of lines) {
      const matches = def.detectors.map((re) => {
        const m = line.text.match(re)
        return m ? m[0] : null
      })
      const hit = matches.find((x) => x !== null)
      if (hit) {
        total += 1
        if (!first[b]) {
          // Window for context (±1 line)
          const idx = lines.indexOf(line)
          const ctx = lines
            .slice(Math.max(0, idx - 1), Math.min(lines.length, idx + 2))
            .map((l) => l.text)
            .join(" / ")
          first[b] = {
            bookNumber: b,
            lineNumber: line.lineNumber,
            matchedText: hit,
            context: ctx,
          }
        }
      }
    }
  }
  return {
    id: def.id,
    greek: def.greek,
    transliteration: def.transliteration,
    gloss: def.gloss,
    subject: def.subject,
    bryantRenderings: def.bryantRenderings,
    firstByBook: first,
    totalCount: total,
  }
})

// ── (B) Extended similes ─────────────────────────────────────────────────
//
// Bryant's extended similes follow a stable shape:
//   As when X does Y  (several lines of expansion)
//   So Z              (the tenor — what it compares to)
// We detect the opener on a line, then walk forward up to 16 lines looking
// for a resolver — a line starting with "So ", "Even so ", "Thus ",
// "E'en as ...". Some similes have no explicit resolver (the comparison
// dissolves into the narrative); we keep those too, capped at 12 lines.

// Tight set — Bryant's characteristic extended-simile openers. "As if",
// "Just as", "As is" are excluded because in Bryant they almost always
// introduce a subordinate clause, not an extended Homeric comparison.
const SIMILE_OPENERS =
  /^(?:\s*[“"]?\s*)?(?:As when|As from|As some|As any|As by|As oft|As a |As bees|As birds|As sheep|As wolves|As when a|As when the|As doth|As doves|As lions|As hunters|As eagles|As leaves|Like as|Like to|Like unto|Like when|E'en as|Ev'n as|Even as)\b/i
const SIMILE_RESOLVERS =
  /^(?:\s*[“"]?\s*)?(?:So |Even so |Thus (?:stood|did|was|he|she|they)|In such)/i

const similes: SimileEntry[] = []
const recordedLineKeys = new Set<string>()

function recordSimile(entry: SimileEntry) {
  const key = `${entry.bookNumber}:${entry.startLine}`
  if (recordedLineKeys.has(key)) return
  recordedLineKeys.add(key)
  similes.push(entry)
}

// Pass 1: tight forward scan from an "As when / Like as / Even as" opener.
for (let b = 1; b <= 24; b++) {
  const lines = BOOKS[b]
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!SIMILE_OPENERS.test(line.text)) continue
    const searchEnd = Math.min(lines.length, i + 18)
    let endLine = i + 3
    let resolver: string | null = null
    for (let j = i + 2; j < searchEnd; j++) {
      if (SIMILE_RESOLVERS.test(lines[j].text)) {
        endLine = j
        resolver = lines[j].text.slice(0, 60)
        break
      }
    }
    const span = lines.slice(i, endLine + 1)
    if (span.length < 3) continue
    const preview = span.map((l) => l.text).join(" ").slice(0, 240)
    recordSimile({
      bookNumber: b,
      startLine: line.lineNumber,
      endLine: lines[endLine].lineNumber,
      opener: line.text.slice(0, 60),
      resolver,
      preview,
      tenor: null,
    })
    i = endLine
  }
}

// Pass 2: find "So" / "Even so" resolvers and backtrack up to 10 lines to
// find an "As" opener. Catches similes whose opener uses Bryant's less
// formulaic variants ("As some man...", "As often as...", "As a torrent
// which...") that the tight Pass 1 regex omits.
const LOOSE_OPENER = /^(?:\s*[“"]?\s*)?(?:As |Like )/
for (let b = 1; b <= 24; b++) {
  const lines = BOOKS[b]
  for (let j = 3; j < lines.length; j++) {
    if (!SIMILE_RESOLVERS.test(lines[j].text)) continue
    // Backtrack up to 10 lines for an "As"/"Like" opener.
    const backStart = Math.max(0, j - 10)
    let openerIdx = -1
    for (let k = backStart; k < j; k++) {
      if (LOOSE_OPENER.test(lines[k].text)) {
        openerIdx = k
        break
      }
    }
    if (openerIdx === -1) continue
    // Quality filter: skip if the opener is followed immediately by a
    // short clause that ends on the same or next line — those are not
    // EXTENDED similes.
    if (j - openerIdx < 2) continue
    const span = lines.slice(openerIdx, j + 1)
    const preview = span.map((l) => l.text).join(" ").slice(0, 240)
    recordSimile({
      bookNumber: b,
      startLine: lines[openerIdx].lineNumber,
      endLine: lines[j].lineNumber,
      opener: lines[openerIdx].text.slice(0, 60),
      resolver: lines[j].text.slice(0, 60),
      preview,
      tenor: null,
    })
  }
}

// Keep similes in book/line order.
similes.sort((a, b) =>
  a.bookNumber !== b.bookNumber ? a.bookNumber - b.bookNumber : a.startLine - b.startLine,
)

// ── (C) Recognition scenes ───────────────────────────────────────────────
//
// Hard-coded anchor lookup: we search each book for the scene's
// canonical Bryant phrase and record the line number.

interface RecognitionProbe {
  bookNumber: number
  title: string
  description: string
  keywords: string[][]
}

const RECOGNITION_PROBES: RecognitionProbe[] = [
  {
    bookNumber: 16,
    title: "Telemachus recognizes Odysseus",
    description:
      "The first anagnorisis of the poem, and the only voluntary one — Odysseus drops his beggar's disguise at Athena's touch and discloses himself to his son in the swineherd's hut. Father and son weep together like eagles robbed of their young.",
    keywords: [["I am thy father"], ["I am that father"], ["father whom thou"]],
  },
  {
    bookNumber: 19,
    title: "Eurycleia recognizes the scar",
    description:
      "The oldest recognition trope in Western literature — the nurse washes the beggar's feet, her hand finds the ridged scar on his thigh, the bronze basin clangs, and Odysseus seizes her throat to keep the household's secret. Auerbach opens *Mimesis* with this scene.",
    // Anchor on the actual discovery line (481), not the foreshadowing or
    // later recollections.
    keywords: [["feet", "found the scar"], ["found the scar"]],
  },
  {
    bookNumber: 23,
    title: "Penelope recognizes Odysseus by the bed",
    description:
      "Penelope's matching mētis: she tests him with the secret of the olive-rooted bed, and his explosion ('who has moved my bed?') is the tally. The poem's deepest recognition — two intelligent people at last admitting that they know each other.",
    keywords: [["Whether my bed remains"], ["olive", "bed"]],
  },
  {
    bookNumber: 24,
    title: "Laertes recognizes his son",
    description:
      "In the orchard, Odysseus lists the trees his father gave him as a boy — thirteen pears, ten apples, forty figs. The inventory is the proof. Homer ends the poem where it began, with a son establishing his place in the line of his father.",
    keywords: [["pear-trees"], ["fig-trees"], ["Thirteen pear"]],
  },
]

const recognitionScenes: RecognitionScene[] = RECOGNITION_PROBES.map((probe) => {
  const lines = BOOKS[probe.bookNumber]
  const texts = lines.map((l) => l.text.toLowerCase())
  let hit: Line | null = null
  for (const kwSet of probe.keywords) {
    const lcKws = kwSet.map((k) => k.toLowerCase())
    for (let i = 0; i < lines.length; i++) {
      const window = texts.slice(Math.max(0, i - 1), Math.min(texts.length, i + 2)).join(" ")
      if (lcKws.every((k) => window.includes(k))) {
        hit = lines[i]
        break
      }
    }
    if (hit) break
  }
  return {
    bookNumber: probe.bookNumber,
    anchor: hit
      ? { lineNumber: hit.lineNumber, anchorText: hit.text.trim().slice(0, 80) }
      : { lineNumber: 0, anchorText: "" },
    title: probe.title,
    description: probe.description,
  }
})

// ── Aggregate + report ───────────────────────────────────────────────────

const bookCoverage: Record<string, number> = {}
for (const e of epithetEntries) {
  bookCoverage[e.transliteration] = Object.keys(e.firstByBook).length
}

const apparatus: Apparatus = {
  generatedAt: new Date().toISOString(),
  generatedBy: "scripts/odyssey/detect-features.ts",
  epithets: epithetEntries,
  similes,
  recognitionScenes,
  counts: {
    epithets: {
      total: epithetEntries.reduce((s, e) => s + e.totalCount, 0),
      distinctBookCoverage: bookCoverage,
    },
    similes: similes.length,
    recognitionScenes: recognitionScenes.length,
  },
}

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(OUT_FILE, JSON.stringify(apparatus, null, 2) + "\n", "utf8")

// ── Console report ───────────────────────────────────────────────────────

console.log("\n=== EPITHET INDEX ===")
for (const e of epithetEntries) {
  console.log(
    `\n${e.transliteration}  (${e.greek}) — ${e.subject}  ·  total: ${e.totalCount}  ·  books covered: ${
      Object.keys(e.firstByBook).length
    }/24`,
  )
  const firstFew = Object.entries(e.firstByBook).slice(0, 5)
  for (const [bk, occ] of firstFew) {
    console.log(`   Book ${bk.padStart(2)}  line ${String(occ.lineNumber).padStart(4)}  “${occ.matchedText}”`)
  }
}

console.log("\n=== EXTENDED SIMILES ===")
const byBook: Record<number, SimileEntry[]> = {}
for (const s of similes) (byBook[s.bookNumber] ??= []).push(s)
for (let b = 1; b <= 24; b++) {
  if (!byBook[b]) continue
  console.log(`Book ${String(b).padStart(2)}: ${byBook[b].length} simile(s)`)
  for (const s of byBook[b].slice(0, 2)) {
    console.log(`   lines ${s.startLine}–${s.endLine}: "${s.opener}..."  →  ${s.resolver ?? "(no explicit So-resolver)"}`)
  }
}
console.log(`Total similes detected: ${similes.length}`)

console.log("\n=== RECOGNITION SCENES ===")
for (const r of recognitionScenes) {
  console.log(
    `Book ${String(r.bookNumber).padStart(2)}  line ${String(r.anchor.lineNumber).padStart(4)}  — ${r.title}`,
  )
  if (r.anchor.anchorText) console.log(`   anchor: "${r.anchor.anchorText}"`)
  else console.log(`   anchor: (UNRESOLVED — manual review needed)`)
}

console.log(`\nWrote ${OUT_FILE}`)
