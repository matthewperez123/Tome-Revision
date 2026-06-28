/* Read-only audit: filesystem/static content + quiz coverage gaps.
 * Run: npx tsx scripts/audit-content-gap.ts
 * Writes nothing to disk or DB. */
import fs from "node:fs"
import path from "node:path"
import { BOOKS } from "../src/data/books"

const CONTENT_DIR = path.join(process.cwd(), "public", "content")
const contentDirs = new Set(
  fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name),
)

const bookIds = new Set(BOOKS.map((b) => b.id))

// Quiz coverage: getQuestionsForChapter matches these title substrings.
const QUIZ_TITLE_TOKENS = [
  "iliad", "odyssey", "divine comedy", "hamlet", "pride", "crime", "aeneid",
  "paradise lost", "don juan", "faerie queene", "idylls", "decameron",
  "canterbury", "morte", "republic", "meditations",
]
const hasQuiz = (title: string) => {
  const t = title.toLowerCase()
  return QUIZ_TITLE_TOKENS.some((tok) => t.includes(tok))
}

const isMultivolNoise = (id: string) => /^book-[ivxlcdm]+$/i.test(id) || /^(part|volume|vol)-[ivxlcdm0-9]+$/i.test(id)
const VERSE_UNITS = new Set(["canto", "poem", "fitt"])
const isDrama = (b: typeof BOOKS[number]) => b.structuralUnitType === "act_scene"
const isVerse = (b: typeof BOOKS[number]) =>
  (b.structuralUnitType && VERSE_UNITS.has(b.structuralUnitType)) ||
  b.genres?.some((g) => /poetry|poem|verse/i.test(g))

// ── Content gap ──────────────────────────────────────────────
const missing = BOOKS.filter((b) => !contentDirs.has(b.id))
const buckets: Record<string, typeof BOOKS> = {
  metadataOnly: [], drama: [], verse: [], noise: [], prose: [],
}
for (const b of missing) {
  if (b.source === "metadata-only") buckets.metadataOnly.push(b)
  else if (isMultivolNoise(b.id)) buckets.noise.push(b)
  else if (isDrama(b)) buckets.drama.push(b)
  else if (isVerse(b)) buckets.verse.push(b)
  else buckets.prose.push(b)
}

// Orphan content dirs (content exists but no BOOKS entry)
const orphanContent = [...contentDirs].filter((d) => !bookIds.has(d)).sort()

// ── Quiz gap (among readable books) ──────────────────────────
const readable = BOOKS.filter((b) => contentDirs.has(b.id))
const readableNoQuiz = readable.filter((b) => !hasQuiz(b.title))
const readableWithQuiz = readable.filter((b) => hasQuiz(b.title))

const fmt = (arr: typeof BOOKS, n = 20) =>
  arr.slice(0, n).map((b) => `    ${b.id}${b.standardEbooksUrl ? "" : "  [no SE url]"}`).join("\n") +
  (arr.length > n ? `\n    … +${arr.length - n} more` : "")

console.log("════════ TOME CONTENT/QUIZ AUDIT (filesystem/static layer) ════════\n")
console.log(`Static BOOKS:            ${BOOKS.length}`)
console.log(`Filesystem content dirs: ${contentDirs.size}`)
console.log(`Readable (book+content): ${readable.length}`)
console.log(`Orphan content dirs:     ${orphanContent.length}\n`)

console.log("── CONTENT GAP (BOOKS without a /content dir) ──")
console.log(`Total missing:        ${missing.length}`)
console.log(`  metadata-only:      ${buckets.metadataOnly.length}  (intentionally catalog-only)`)
console.log(`  drama (act_scene):  ${buckets.drama.length}  (out of prose scope)`)
console.log(`  verse (canto/poem): ${buckets.verse.length}  (out of prose scope)`)
console.log(`  multivol/noise ids: ${buckets.noise.length}`)
console.log(`  PROSE (actionable): ${buckets.prose.length}`)
const proseWithSE = buckets.prose.filter((b) => b.standardEbooksUrl)
console.log(`     of which with standardEbooksUrl: ${proseWithSE.length}\n`)

console.log("  >> Actionable PROSE titles needing content:")
console.log(fmt(buckets.prose, 60))
console.log("\n  >> metadata-only sample:")
console.log(fmt(buckets.metadataOnly, 10))
console.log("\n  >> noise/multivol sample:")
console.log(fmt(buckets.noise, 15))
console.log("\n  >> orphan content dirs (content but no BOOKS row):")
console.log("    " + orphanContent.slice(0, 30).join("\n    ") + (orphanContent.length > 30 ? `\n    … +${orphanContent.length - 30}` : ""))

console.log("\n── QUIZ GAP (readable books) ──")
console.log(`Readable WITH in-reader quiz coverage: ${readableWithQuiz.length}`)
console.log(`Readable WITHOUT any quiz:             ${readableNoQuiz.length}`)
console.log("  quiz-covered titles:")
console.log(readableWithQuiz.map((b) => `    ${b.id}`).join("\n"))
