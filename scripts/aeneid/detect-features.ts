#!/usr/bin/env npx tsx
/**
 * detect-features.ts — deterministic feature detection for the Aeneid
 * scholarly apparatus:
 *
 *   (A) Epithet index — first-occurrence per book of the Virgilian
 *       formulae that survive in Dryden's heroic couplets: pius Aeneas,
 *       pater Aeneas, infelix Dido, saevae Iunonis ira, alma Venus,
 *       fidus Achates.
 *
 *   (B) Extended simile index — multi-line "As when… / So…" comparisons;
 *       Virgil models his similes on Homer's but typically compresses.
 *       Target 25–40 across the 12 books.
 *
 *   (C) Authorial apostrophes — the Virgilian signature where the poet
 *       addresses a character directly. Six canonical sites anchored by
 *       their Dryden renderings: "Tu Marcellus eris" (VI), "fortunati
 *       ambo" (IX), the Caieta invocation (VII), Virgil's address to
 *       Lausus (X), the pair-apostrophe to Cydon and Clytius (X), and
 *       the two-gates-of-sleep coda (VI).
 *
 * Output: src/data/aeneid/apparatus.json — consumed by the reader
 * through src/lib/virgil/aeneid-apparatus.ts.
 *
 * Usage: npx tsx scripts/aeneid/detect-features.ts
 */

import * as fs from "fs"
import * as path from "path"

const ROOT = path.resolve(__dirname, "..", "..")
const CONTENT_DIR = path.join(ROOT, "public/content/the-aeneid")
const OUT_DIR = path.join(ROOT, "src/data/aeneid")
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
  latin: string
  transliteration: string  // stripped-diacritics form for URLs
  gloss: string
  subject: string
  drydenRenderings: string[]
  /** First occurrence per book; missing if the book has none. */
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
}

interface ApostropheSite {
  id: string
  bookNumber: number
  lineNumber: number
  anchorText: string
  title: string
  latinTag: string       // e.g. "tu Marcellus eris"
  latinLine: string      // the exact Latin Virgil wrote at this spot
  description: string
}

interface Apparatus {
  generatedAt: string
  generatedBy: string
  epithets: EpithetEntry[]
  similes: SimileEntry[]
  apostrophes: ApostropheSite[]
  counts: {
    epithets: { total: number; distinctBookCoverage: Record<string, number> }
    similes: number
    apostrophes: number
  }
}

// ── Load transformed chapters ─────────────────────────────────────────────

interface Line {
  bookNumber: number
  lineNumber: number
  text: string
}

function loadBook(bookNumber: number): Line[] {
  // ch-N.json files are zero-indexed: Book I lives in ch-0.json.
  const fp = path.join(CONTENT_DIR, `ch-${bookNumber - 1}.json`)
  const raw = JSON.parse(fs.readFileSync(fp, "utf8")) as { html: string }
  const re = /data-aeneid-line="(\d+)"[^>]*>([^<]*)</g
  const lines: Line[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(raw.html)) !== null) {
    lines.push({
      bookNumber,
      lineNumber: Number(m[1]),
      text: m[2].replace(/\uFEFF/g, ""),
    })
  }
  return lines
}

const BOOKS: Record<number, Line[]> = {}
for (let b = 1; b <= 12; b++) BOOKS[b] = loadBook(b)

// ── (A) Epithet index ─────────────────────────────────────────────────────
//
// Virgil's characterizing epithets in Dryden's 1697 English. The regex set
// is tuned to Dryden's vocabulary: "pious Aeneas" (pius), "pious chief"
// (the formulaic version), "the good Aeneas" (a Dryden expansion), etc.

interface EpithetDef {
  id: string
  latin: string
  transliteration: string
  gloss: string
  subject: string
  drydenRenderings: string[]
  detectors: RegExp[]
}

const EPITHETS: EpithetDef[] = [
  {
    id: "pius-aeneas",
    latin: "pius Aenēās",
    transliteration: "pius Aeneas",
    gloss:
      'Virgil\'s signature epithet, used some twenty times across the poem. *Pius* is untranslatable in English: it fuses duty to the gods, duty to parents, duty to country, and duty to the unborn future into one word. Dryden reaches most often for "pious" but also "good," "the pious chief," or "the good Aeneas." The formulaic first-occurrence marker signals the Virgilian system Aeneas lives inside — he is not simply a man named Aeneas, he is always *pius* Aeneas, as Achilles is always *swift-footed* in Homer.',
    subject: "Aeneas",
    drydenRenderings: ["pious Aeneas", "pious chief", "pious prince", "good Aeneas", "the pious hero"],
    detectors: [
      /\bpious (?:Aeneas|chief|prince|hero|Trojan|son|leader)\b/i,
      /\bthe (?:pious|good) Aeneas\b/i,
    ],
  },
  {
    id: "pater-aeneas",
    latin: "pater Aenēās",
    transliteration: "pater Aeneas",
    gloss:
      '"Father Aeneas" — used only after he becomes paterfamilias of the Trojan remnant. Dryden renders as "the father" or "father Aeneas." Its appearance marks the moment Aeneas ceases to be a young warrior and becomes the ancestor Virgil is building toward.',
    subject: "Aeneas",
    drydenRenderings: ["father Aeneas", "the father", "Father Aeneas"],
    detectors: [
      /\bfather Aeneas\b/i,
      /\bAeneas, the father\b/i,
    ],
  },
  {
    id: "infelix-dido",
    latin: "īnfēlix Dīdō",
    transliteration: "infelix Dido",
    gloss:
      'The tragic formula — "unhappy," "ill-fated." *Infelix* is the same word Virgil uses elsewhere for the doomed or marked-by-death; it is Dido\'s name on the poem\'s lips from the moment she falls in love. Dryden spreads the sense across "unhappy," "unhappy queen," "unhappy Dido," and "the hapless queen."',
    subject: "Dido",
    drydenRenderings: ["unhappy queen", "unhappy Dido", "the hapless queen", "the unhappy dame"],
    detectors: [
      /\bunhappy (?:Dido|queen|dame|fair)\b/i,
      /\bhapless (?:Dido|queen|dame)\b/i,
      /\bDido, unhappy\b/i,
    ],
  },
  {
    id: "saeva-iuno",
    latin: "saevae memorem Iūnōnis ob īram",
    transliteration: "saevae memorem Iunonis ob iram",
    gloss:
      'Book I, line 4: "because of cruel Juno\'s unforgetting wrath." The phrase that opens the poem\'s plot. Dryden: "haughty Juno\'s unrelenting hate." Juno\'s *memor* (remembering) anger drives the whole Trojan war-in-Italy and is the largest structural fact of the poem.',
    subject: "Juno",
    drydenRenderings: ["haughty Juno", "unrelenting hate", "Juno's hate", "Juno's rage"],
    detectors: [
      /\bhaughty Juno(?:'s)?\b/i,
      /\bJuno's (?:unrelenting|immortal|lasting) (?:hate|rage|wrath|anger)\b/i,
      /\bJuno's rage\b/i,
    ],
  },
  {
    id: "alma-venus",
    latin: "alma Venus",
    transliteration: "alma Venus",
    gloss:
      '"Gracious / nourishing Venus" — Venus in her maternal aspect, as the mother of Aeneas and through him the mother of Rome. Dryden: "the gracious queen," "the goddess-mother."',
    subject: "Venus",
    drydenRenderings: ["goddess-mother", "gracious Venus", "fair Cytherea"],
    detectors: [
      /\bgoddess[- ]mother\b/i,
      /\bgracious Venus\b/i,
      /\bfair Cytherea\b/i,
    ],
  },
  {
    id: "fidus-achates",
    latin: "fīdus Achātēs",
    transliteration: "fidus Achates",
    gloss:
      '"Loyal Achates" — *fidelitas* personified. Achates is Aeneas\'s companion throughout; his epithet is so durable it entered English as a figure for a faithful friend ("a true Achates"). Dryden: "faithful" or "trusty."',
    subject: "Achates",
    drydenRenderings: ["faithful Achates", "trusty Achates", "loyal Achates"],
    detectors: [
      /\b(?:faithful|trusty|loyal) Achates\b/i,
    ],
  },
]

const epithetEntries: EpithetEntry[] = EPITHETS.map((def) => {
  const first: Record<number, EpithetOccurrence> = {}
  let total = 0
  for (let b = 1; b <= 12; b++) {
    const lines = BOOKS[b]
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const matches = def.detectors.map((re) => {
        const m = line.text.match(re)
        return m ? m[0] : null
      })
      const hit = matches.find((x) => x !== null)
      if (hit) {
        total += 1
        if (!first[b]) {
          const ctx = lines
            .slice(Math.max(0, i - 1), Math.min(lines.length, i + 2))
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
    latin: def.latin,
    transliteration: def.transliteration,
    gloss: def.gloss,
    subject: def.subject,
    drydenRenderings: def.drydenRenderings,
    firstByBook: first,
    totalCount: total,
  }
})

// ── (B) Extended similes ─────────────────────────────────────────────────

const SIMILE_OPENERS =
  /^(?:\s*[“"]?\s*)?(?:As when|As from|As some|As a |As if a |As by|As oft|As bees|As birds|As sheep|As wolves|As when a|As when the|As doth|As doves|As lions|As hunters|As eagles|As leaves|As fires|As furious|As furies|Like as|Like to|Like unto|Like when|Like a |Like some|E'en as|Ev'n as|Even as|So, when|So, from)\b/i
const SIMILE_RESOLVERS =
  /^(?:\s*[“"]?\s*)?(?:So |So, |Even so |Thus (?:stood|did|was|raged|rush'd|rush'd)|Not otherwise|Such (?:was|were|seem'd))/i

const similes: SimileEntry[] = []
const recordedLineKeys = new Set<string>()

function recordSimile(entry: SimileEntry) {
  const key = `${entry.bookNumber}:${entry.startLine}`
  if (recordedLineKeys.has(key)) return
  recordedLineKeys.add(key)
  similes.push(entry)
}

// Pass 1: tight scan.
for (let b = 1; b <= 12; b++) {
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
    })
    i = endLine
  }
}

// Pass 2: backtrack from resolvers for loose openers.
const LOOSE_OPENER = /^(?:\s*[“"]?\s*)?(?:As |Like )/
for (let b = 1; b <= 12; b++) {
  const lines = BOOKS[b]
  for (let j = 3; j < lines.length; j++) {
    if (!SIMILE_RESOLVERS.test(lines[j].text)) continue
    const backStart = Math.max(0, j - 10)
    let openerIdx = -1
    for (let k = backStart; k < j; k++) {
      if (LOOSE_OPENER.test(lines[k].text)) {
        openerIdx = k
        break
      }
    }
    if (openerIdx === -1) continue
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
    })
  }
}

similes.sort((a, b) =>
  a.bookNumber !== b.bookNumber ? a.bookNumber - b.bookNumber : a.startLine - b.startLine,
)

// ── (C) Authorial apostrophes — the Virgilian signature ──────────────────
//
// Each probe targets the canonical Dryden line for a documented Latin
// apostrophe. Keyword arrays are AND-matched within a ±2-line window.

interface ApostropheProbe {
  id: string
  bookNumber: number
  title: string
  latinTag: string
  latinLine: string
  description: string
  keywords: string[][]  // outer = alternatives, inner = all-required
}

const APOSTROPHE_PROBES: ApostropheProbe[] = [
  {
    id: "caieta-invocation",
    bookNumber: 7,
    title: "Apostrophe to Caieta",
    latinTag: "Tū quoque litoribus nostrīs…",
    latinLine: "Tū quoque lītoribus nostrīs, Aenēia nūtrīx, / aeternam moriēns fāmam, Caiēta, dedistī.",
    description:
      "The opening lines of Book VII. Virgil turns from his narrative to address Caieta, Aeneas's nurse, whose death has just given a name to the place on the Italian coast where she was buried. The gesture is typically Virgilian — the poet stepping forward to confer immortality on a character the plot would otherwise pass over.",
    keywords: [
      ["matron", "immortal", "fame"],
      ["nurse", "fame"],
      ["Caieta"],
    ],
  },
  {
    id: "tu-marcellus-eris",
    bookNumber: 6,
    title: "Tu Marcellus eris",
    latinTag: "Tū Marcellus eris",
    latinLine: "Heu, miserande puer, sī quā fāta aspera rumpās, / tū Marcellus eris.",
    description:
      "The most famous apostrophe in Latin poetry. In Elysium, Anchises shows Aeneas the shade of a beautiful youth who will not live — Marcellus, Augustus's heir, dead in 23 BC. Virgil, addressing the unborn dead boy directly, promises him immortality through the verse the reader is reading. Servius records that when Virgil recited this passage to Octavia (Marcellus's mother), she fainted.",
    keywords: [
      ["new marcellus shall arise"],
      ["see great marcellus"],
      ["marcellus", "arise"],
    ],
  },
  {
    id: "fortunati-ambo",
    bookNumber: 9,
    title: "Fortunati ambo",
    latinTag: "Fortunātī ambō!",
    latinLine: "Fortūnātī ambō! Sī quid mea carmina possunt, / nūlla diēs umquam memorī vōs eximet aevō.",
    description:
      "After the night-raid of Nisus and Euryalus ends in their deaths, Virgil addresses the two dead youths directly: \"Happy both! If my songs have any power, no day will ever erase you from mindful time.\" The apostrophe is the poem consciously promising what it will deliver — and has delivered, for two thousand years.",
    keywords: [
      ["o happy friends", "verse"],
      ["happy friends", "immortal"],
      ["happy friends"],
    ],
  },
  {
    id: "lausus-apostrophe",
    bookNumber: 10,
    title: "Apostrophe to Lausus",
    latinTag: "Hīc mortis dūrae cāsum tuaque optima facta…",
    latinLine: "Hīc mortis dūrae cāsum tuaque optima facta, / sī qua fidem tantō est operī lātūra vetustās, / nōn equidem nec tē, iuvenis memorande, silēbō.",
    description:
      "At the death of Lausus, son of Mezentius, Virgil breaks his own third-person narrative to promise the young warrior — killed defending his tyrant father — that he will not be silenced by the poet. The pattern is the same as Nisus-Euryalus: apostrophe as the moral judgment the narration refuses to make in its own voice.",
    keywords: [
      ["heroic youth", "immortal memory"],
      ["immortal memory", "be just"],
      ["heroic youth"],
    ],
  },
  {
    id: "two-gates-of-sleep",
    bookNumber: 6,
    title: "The Two Gates of Sleep",
    latinTag: "Sunt geminae Somnī portae",
    latinLine: "Sunt geminae Somnī portae, quārum altera fertur / cornea, quā vēris facilis datur exitus umbrīs…",
    description:
      "Book VI ends with Aeneas and the Sibyl leaving the underworld through the Gate of Ivory — the gate, Virgil says, through which false dreams are sent up to the living. Scholars have debated for two thousand years why Virgil sends his hero out through the gate of falsehood. Servius was already puzzled in the fourth century. The annotation elsewhere in this apparatus lays out the honest state of the debate without resolving it.",
    keywords: [
      ["ivory", "transparent horn"],
      ["polish'd ivory"],
      ["gates", "sleep"],
    ],
  },
]

const apostrophes: ApostropheSite[] = APOSTROPHE_PROBES.map((probe) => {
  const lines = BOOKS[probe.bookNumber]
  const texts = lines.map((l) => l.text.toLowerCase())
  let hitIdx = -1
  for (const kwSet of probe.keywords) {
    const lcKws = kwSet.map((k) => k.toLowerCase())
    const [first, ...rest] = lcKws
    // Anchor on the first line containing the LEAD keyword; verify the
    // remaining keywords appear in a ±3-line window around it.
    for (let i = 0; i < lines.length; i++) {
      if (!texts[i].includes(first)) continue
      const window = texts
        .slice(Math.max(0, i - 3), Math.min(texts.length, i + 4))
        .join(" ")
      if (rest.every((k) => window.includes(k))) {
        hitIdx = i
        break
      }
    }
    if (hitIdx !== -1) break
  }
  return {
    id: probe.id,
    bookNumber: probe.bookNumber,
    lineNumber: hitIdx === -1 ? 0 : lines[hitIdx].lineNumber,
    anchorText:
      hitIdx === -1 ? "" : lines[hitIdx].text.trim().replace(/\uFEFF/g, "").slice(0, 80),
    title: probe.title,
    latinTag: probe.latinTag,
    latinLine: probe.latinLine,
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
  generatedBy: "scripts/aeneid/detect-features.ts",
  epithets: epithetEntries,
  similes,
  apostrophes,
  counts: {
    epithets: {
      total: epithetEntries.reduce((s, e) => s + e.totalCount, 0),
      distinctBookCoverage: bookCoverage,
    },
    similes: similes.length,
    apostrophes: apostrophes.length,
  },
}

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(OUT_FILE, JSON.stringify(apparatus, null, 2) + "\n", "utf8")

// ── Console report ───────────────────────────────────────────────────────

console.log("\n=== EPITHET INDEX ===")
for (const e of epithetEntries) {
  console.log(
    `\n${e.transliteration}  (${e.latin}) — ${e.subject}  ·  total: ${e.totalCount}  ·  books: ${
      Object.keys(e.firstByBook).length
    }/12`,
  )
  const firstFew = Object.entries(e.firstByBook).slice(0, 4)
  for (const [bk, occ] of firstFew) {
    console.log(
      `   Book ${bk.padStart(2)}  line ${String(occ.lineNumber).padStart(4)}  "${occ.matchedText}"`,
    )
  }
}

console.log("\n=== EXTENDED SIMILES ===")
const byBook: Record<number, SimileEntry[]> = {}
for (const s of similes) (byBook[s.bookNumber] ??= []).push(s)
for (let b = 1; b <= 12; b++) {
  if (!byBook[b]) continue
  console.log(`Book ${String(b).padStart(2)}: ${byBook[b].length} simile(s)`)
  for (const s of byBook[b].slice(0, 2)) {
    console.log(
      `   lines ${s.startLine}–${s.endLine}: "${s.opener.trim()}..."  →  ${s.resolver?.trim() ?? "(no explicit So-resolver)"}`,
    )
  }
}
console.log(`Total similes detected: ${similes.length}`)

console.log("\n=== APOSTROPHES ===")
for (const a of apostrophes) {
  console.log(
    `Book ${String(a.bookNumber).padStart(2)}  line ${String(a.lineNumber).padStart(4)}  ${a.id}  ·  ${
      a.anchorText || "(not located — re-tune keywords)"
    }`,
  )
}
