#!/usr/bin/env npx tsx
/**
 * transform-book.ts — inject scholarly-apparatus markup into an Odyssey chapter.
 *
 * Mirrors scripts/iliad/transform-book.ts but for Bryant's Odyssey. The
 * Odyssey ships with ~14,700 verse lines across 24 books, so we combine
 * extraction and transform in a single pass (unlike the Iliad pipeline,
 * where speeches are hand-curated per book). Accuracy is heuristic and
 * reported per-book; low-confidence books can be hand-fixed later.
 *
 * Reads `public/content/the-odyssey/ch-{N}.json`, walks the HTML with
 * cheerio, and adds:
 *   1. `data-odyssey-line="<N>"` on every line span, giving stable anchors
 *      like `odyssey/book-1/line-42`.
 *   2. `data-odyssey-speaker="<CanonicalName>"` on every line inside a
 *      speech, with `data-odyssey-speech-start="true"` on the opening line.
 *   3. A `data-odyssey-book` attribute on the chapter <section> carrying
 *      the Roman numeral + Greek letter for use by the React header.
 *
 * Idempotent — previous markers are stripped before re-applying. Writes
 * back to the same JSON file.
 *
 * Usage:  npx tsx scripts/odyssey/transform-book.ts 1
 *         npx tsx scripts/odyssey/transform-book.ts 1 2 3 --dry
 *         npx tsx scripts/odyssey/transform-book.ts --all
 */

import * as fs from "fs"
import * as path from "path"
import * as cheerio from "cheerio"
import {
  BOOK_ARGUMENTS,
  BOOK_GREEK_LETTERS,
  BOOK_ROMAN_NUMERALS,
} from "./book-metadata"

const ROOT = path.resolve(__dirname, "..", "..")
const CONTENT_DIR = path.join(ROOT, "public/content/the-odyssey")

interface ChapterJSON {
  bookId: string
  chapterIndex: number
  title: string
  wordCount: number
  estimatedMinutes: number
  html: string
}

// ── Canonical speaker aliases ─────────────────────────────────────────────
// Mirrors scripts/iliad/extract-speeches.ts. Bryant uses identical Latinate
// forms in both epics, so the shared characters (Odysseus, Athena, Nestor,
// Menelaus, Helen, Zeus, Poseidon, Hermes) carry over verbatim. The Odyssey
// adds its own cast: Telemachus, Penelope, Eumaeus, the suitors, Circe,
// Calypso, Nausicaä, Polyphemus, Tiresias, etc.

const ALIASES: Array<[string, string[]]> = [
  // ── Shared with Iliad (match Iliad canon for speaker-color parity) ──
  ["Odysseus",    ["Ulysses", "son of Laertes", "Laertes' son", "Laertes's son", "Ithacan"]],
  ["Athena",      ["Pallas", "Pallas Athene", "Pallas Athenè", "Minerva", "Athene", "Athenè", "Athena", "blue-eyed"]],
  ["Zeus",        ["Jove", "Jupiter", "Saturnian", "Saturn's son", "cloud-compeller", "cloud-gatherer", "Olympian", "Zeus", "father of the gods", "Thunderer"]],
  ["Poseidon",    ["Neptune", "Poseidon", "Earth-shaker", "sea-king"]],
  ["Hermes",      ["Mercury", "Hermes", "Argus-slayer", "Argicide"]],
  ["Apollo",      ["Apollo", "Phoebus", "far-darter", "silver-bowed"]],
  ["Hera",        ["Juno", "Hera"]],
  ["Aphrodite",   ["Venus", "Aphrodite"]],
  ["Ares",        ["Mars", "Ares"]],
  ["Hephaestus",  ["Vulcan", "Hephaestus"]],
  ["Artemis",     ["Diana", "Dian", "Artemis"]],
  ["Nestor",      ["Nestor", "Neleus' son", "Pylian", "Neleides", "hoary chief"]],
  ["Menelaus",    ["Menelaus", "warlike Menelaus"]],
  ["Helen",       ["Helen", "Argive Helen"]],
  ["Agamemnon",   ["Agamemnon", "Atrides", "king of men"]],
  ["Achilles",    ["Achilles", "Pelides", "son of Peleus"]],
  ["Ajax",        ["Ajax"]],
  ["Patroclus",   ["Patroclus"]],
  ["Antilochus",  ["Antilochus"]],

  // ── The house of Odysseus ──
  ["Telemachus",  ["Telemachus"]],
  ["Penelope",    ["Penelope", "Icarius' daughter", "daughter of Icarius"]],
  ["Laertes",     ["Laertes"]],
  ["Eurycleia",   ["Eurycleia", "Euryclea"]],
  ["Eurynome",    ["Eurynome"]],
  ["Eumaeus",     ["Eumaeus"]],
  ["Philoetius",  ["Philoetius"]],
  ["Melanthius",  ["Melanthius"]],
  ["Melantho",    ["Melantho"]],
  ["Phemius",     ["Phemius"]],
  ["Medon",       ["Medon"]],
  ["Dolius",      ["Dolius"]],
  ["Mentor",      ["Mentor"]],
  ["Mentes",      ["Mentes"]],
  ["Anticlea",    ["Anticlea", "Anticleia"]],

  // ── The suitors ──
  ["Antinous",    ["Antinoüs", "Antinous"]],
  ["Eurymachus",  ["Eurymachus"]],
  ["Amphinomus",  ["Amphinomus"]],
  ["Ctesippus",   ["Ctesippus"]],
  ["Leiodes",     ["Leiodes", "Leodes"]],
  ["Agelaus",     ["Agelaus"]],
  ["Irus",        ["Irus"]],

  // ── The Phaeacians ──
  ["Alcinous",    ["Alcinoüs", "Alcinous"]],
  ["Arete",       ["Arete", "Aretè"]],
  ["Nausicaa",    ["Nausicaä", "Nausicaa"]],
  ["Demodocus",   ["Demodocus"]],
  ["Euryalus",    ["Euryalus"]],
  ["Laodamas",    ["Laodamas"]],

  // ── The wanderings ──
  ["Circe",       ["Circe", "Circè"]],
  ["Calypso",     ["Calypso"]],
  ["Polyphemus",  ["Polyphemus", "Polypheme", "Cyclops"]],
  ["Aeolus",      ["Aeolus"]],
  ["Tiresias",    ["Tiresias", "Teiresias"]],
  ["Elpenor",     ["Elpenor"]],

  // ── Pylos / Sparta secondary cast ──
  ["Peisistratus", ["Peisistratus", "Pisistratus"]],
  ["Megapenthes", ["Megapenthes"]],
  ["Theoclymenus", ["Theoclymenus"]],

  // ── Other gods / divinities ──
  ["Ino",         ["Ino", "Leucothea", "Leucothoë"]],
  ["Proteus",     ["Proteus"]],
  ["Thetis",      ["Thetis", "silver-footed"]],
  ["Aeolus",      ["Aeolus"]],
]

// ── Text normalization ────────────────────────────────────────────────────

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

/** Closing-quote test — line ends a speech when a close-quote occurs and
 *  no fresh opening quote follows on the same line. */
function lineClosesSpeech(rawText: string): boolean {
  const lastClose = Math.max(rawText.lastIndexOf("\u201D"), rawText.lastIndexOf('"'))
  if (lastClose === -1) return false
  const afterClose = rawText.slice(lastClose + 1)
  if (/[\u201C]|"\s*[A-Za-z]/.test(afterClose)) return false
  return true
}

/** Find all canonical-name positions in `context`, marking indirect-object
 *  references so they're excluded from speaker-attribution. */
function findAllNames(
  context: string,
): Array<{ canon: string; pos: number; len: number; isObject: boolean }> {
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
        const next =
          pos + needle.length >= lower.length ? " " : lower[pos + needle.length]
        if (!/[a-z]/.test(prev) && !/[a-z]/.test(next)) {
          const windowStart = Math.max(0, pos - 30)
          const pre = lower.slice(windowStart, pos)
          const isObject =
            /\b(to|unto|toward|towards|addressing|addressed|bespake|bespoke)(\s+(the|an?|his|her|thy|my|our|their))*\s*$/.test(
              pre,
            )
          hits.push({ canon, pos, len: needle.length, isObject })
        }
        from = pos + needle.length
      }
    }
  }
  return hits.sort((a, b) => a.pos - b.pos)
}

/** Attribute a speaker from the preceding narrative window. */
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

// ── Main transform ────────────────────────────────────────────────────────

interface TransformResult {
  bookNumber: number
  lines: number
  speechesMatched: number
  speechesUnknown: number
}

function transformBook(bookNumber: number, write: boolean): TransformResult {
  const chapterIndex = bookNumber
  const filePath = path.join(CONTENT_DIR, `ch-${chapterIndex}.json`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing chapter file: ${filePath}`)
  }

  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as ChapterJSON
  const $ = cheerio.load(raw.html, { xml: false })
  const $body = $("body").length ? $("body") : $.root()

  // ── 1. Strip prior transform output (idempotent re-run) ────────────────
  $body.find("[data-odyssey-speaker]").each((_, el) => {
    $(el).removeAttr("data-odyssey-speaker")
    $(el).removeAttr("data-odyssey-speech-start")
  })
  $body.find("[data-odyssey-line]").each((_, el) => {
    $(el).removeAttr("data-odyssey-line")
  })
  $body.find("[data-odyssey-book]").each((_, el) => {
    $(el).removeAttr("data-odyssey-book")
    $(el).removeAttr("data-odyssey-greek-letter")
    $(el).removeAttr("data-odyssey-greek-name")
    $(el).removeAttr("data-odyssey-argument")
  })

  // ── 2. Mark the chapter section with book metadata ────────────────────
  if (bookNumber >= 1 && bookNumber <= 24) {
    const roman = BOOK_ROMAN_NUMERALS[bookNumber]
    const greek = BOOK_GREEK_LETTERS[bookNumber]
    const argument = BOOK_ARGUMENTS[bookNumber]
    const $section = $body.find("section[role='doc-chapter']").first()
    if ($section.length) {
      $section.attr("data-odyssey-book", roman)
      $section.attr("data-odyssey-greek-letter", greek.lower)
      $section.attr("data-odyssey-greek-name", greek.name)
      $section.attr("data-odyssey-argument", argument)
    }
  }

  // ── 3. Line anchors — number every verse <span> inside a <p> ──────────
  // Skip the Preface (ch-0) which is prose, not verse.
  let lineCounter = 0
  if (bookNumber >= 1) {
    $body
      .find("section[role='doc-chapter'] p > span")
      .each((_, el) => {
        lineCounter += 1
        $(el).attr("data-odyssey-line", String(lineCounter))
      })
  }

  // ── 4. Speaker tagging at the line level ─────────────────────────────
  // The Odyssey has no hand-curated ordered speech table; instead we drive
  // the state machine from each opening curly-quote we encounter, finding
  // the speaker by scanning the preceding ~300 chars of narrative for an
  // attribution verb adjacent to a canonical name.
  let speechesMatched = 0
  let speechesUnknown = 0

  if (bookNumber >= 1) {
    const $lines = $body.find("section[role='doc-chapter'] p > span")
    const rawTexts = $lines.toArray().map((el) => $(el).text())

    let currentSpeaker: string | null = null

    for (let i = 0; i < $lines.length; i++) {
      const $ln = $($lines[i])
      const rawText = rawTexts[i]

      // Does this line open a (new) speech?
      const openIdx = rawText.indexOf("\u201C")
      if (openIdx !== -1 && !currentSpeaker) {
        // Attribution context: preceding narrative, ~300 chars.
        const preOnThisLine = rawText.slice(0, openIdx)
        const parts: string[] = [preOnThisLine]
        for (let k = i - 1; k >= 0 && parts.join(" ").length < 300; k--) {
          parts.unshift(rawTexts[k])
        }
        const context = normalize(parts.join(" "))
        const speaker = attribute(context)
        if (speaker) {
          currentSpeaker = speaker
          speechesMatched += 1
        } else {
          currentSpeaker = "UNKNOWN"
          speechesUnknown += 1
        }
        $ln.attr("data-odyssey-speaker", currentSpeaker)
        $ln.attr("data-odyssey-speech-start", "true")
        if (lineClosesSpeech(rawText)) currentSpeaker = null
        continue
      }

      if (currentSpeaker) {
        $ln.attr("data-odyssey-speaker", currentSpeaker)
        if (lineClosesSpeech(rawText)) currentSpeaker = null
      }
    }
  }

  // ── 5. Serialize and write back ───────────────────────────────────────
  const newHtml = $body.html() ?? raw.html
  const updated: ChapterJSON = { ...raw, html: newHtml }

  if (write) {
    fs.writeFileSync(filePath, JSON.stringify(updated) + "\n", "utf8")
  }

  return {
    bookNumber,
    lines: lineCounter,
    speechesMatched,
    speechesUnknown,
  }
}

// ── CLI ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const dry = args.includes("--dry")
const all = args.includes("--all")

let books: number[]
if (all) {
  books = Array.from({ length: 25 }, (_, i) => i) // 0..24 (ch-0 is Preface)
} else {
  books = args
    .filter((a) => !a.startsWith("--"))
    .map(Number)
    .filter((n) => Number.isFinite(n) && n >= 0 && n <= 24)
}

if (books.length === 0) {
  console.error(
    "Usage: npx tsx scripts/odyssey/transform-book.ts <ch> [<ch>...] [--dry]\n" +
      "       npx tsx scripts/odyssey/transform-book.ts --all [--dry]",
  )
  process.exit(1)
}

console.log(`Transforming ${books.length} Odyssey chapter file(s)${dry ? " (dry run)" : ""}...\n`)
const results: TransformResult[] = []
let totalLines = 0
let totalMatched = 0
let totalUnknown = 0

for (const b of books) {
  const r = transformBook(b, !dry)
  results.push(r)
  totalLines += r.lines
  totalMatched += r.speechesMatched
  totalUnknown += r.speechesUnknown
  const roman = BOOK_ROMAN_NUMERALS[b] ?? "Preface"
  const accuracy =
    r.speechesMatched + r.speechesUnknown === 0
      ? "—"
      : `${((r.speechesMatched / (r.speechesMatched + r.speechesUnknown)) * 100).toFixed(0)}%`
  console.log(
    `  ${String(b).padStart(2)} (${roman.padStart(5)}): ` +
      `${String(r.lines).padStart(5)} lines, ` +
      `${String(r.speechesMatched).padStart(4)} speeches tagged, ` +
      `${String(r.speechesUnknown).padStart(3)} unknown (${accuracy} attribution)`,
  )
}

console.log(
  `\nTotal: ${totalLines} verse lines, ` +
    `${totalMatched}/${totalMatched + totalUnknown} speeches attributed ` +
    `(${(totalMatched + totalUnknown === 0 ? 0 : (totalMatched / (totalMatched + totalUnknown)) * 100).toFixed(1)}%)`,
)
if (dry) console.log("\n(dry run — no files written)")
