/**
 * test-verse-drama.ts — Validation tests for verse/drama formatting changes.
 * Run: npx tsx scripts/test-verse-drama.ts
 */

import * as fs from "fs"
import * as path from "path"
import { assignCharacterColors, getCharacterColor } from "../src/lib/character-colors"

const rootDir = path.resolve(__dirname, "..")
let passed = 0
let failed = 0

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++
    console.log(`  ✓ ${message}`)
  } else {
    failed++
    console.log(`  ✗ ${message}`)
  }
}

// ── Character Color Tests ──────────────────────────────────────────

console.log("\n═══ Character Color Assignment ═══\n")

// Test 1: Deterministic assignment
{
  const names = ["Hamlet", "Claudius", "Horatio", "Ophelia", "Polonius", "Laertes"]
  const counts: Record<string, number> = { Hamlet: 100, Claudius: 80, Horatio: 60, Ophelia: 40, Polonius: 30, Laertes: 20 }
  const a1 = assignCharacterColors("hamlet", names, counts)
  const a2 = assignCharacterColors("hamlet", names, counts)
  assert(
    JSON.stringify(a1.colorMap) === JSON.stringify(a2.colorMap),
    "Same input produces same color assignments (deterministic)"
  )
}

// Test 2: Characters sorted by speech count
{
  const names = ["Minor", "Major", "Lead"]
  const counts: Record<string, number> = { Minor: 5, Major: 50, Lead: 100 }
  const a = assignCharacterColors("test", names, counts)
  assert(a.assignments[0].name === "Lead", "Highest speech count character gets first slot")
  assert(a.assignments[1].name === "Major", "Second highest gets second slot")
  assert(a.assignments[2].name === "Minor", "Lowest gets last slot")
}

// Test 3: Different colors for different characters
{
  const names = ["A", "B", "C", "D", "E", "F"]
  const a = assignCharacterColors("test", names)
  const colors = new Set(a.assignments.map(c => c.color.light))
  assert(colors.size === 6, "6 characters get 6 distinct colors")
}

// Test 4: Group speakers get gold
{
  const names = ["Hamlet", "All", "Chorus"]
  const a = assignCharacterColors("test", names)
  const allColor = getCharacterColor(a, "All", false)
  const chorusColor = getCharacterColor(a, "Chorus", false)
  assert(allColor === "#A8882C", "Group speaker 'All' gets muted-gold")
  assert(chorusColor === "#A8882C", "Group speaker 'Chorus' gets muted-gold")
}

// Test 5: Ghost speakers get ghost-slate
{
  const names = ["Hamlet", "Ghost"]
  const a = assignCharacterColors("test", names)
  const ghostColor = getCharacterColor(a, "Ghost", false)
  assert(ghostColor === "#6E7A8C", "Ghost gets ghost-slate color")
}

// Test 6: Light/dark mode colors differ
{
  const names = ["Hamlet"]
  const a = assignCharacterColors("test", names)
  const light = getCharacterColor(a, "Hamlet", false)
  const dark = getCharacterColor(a, "Hamlet", true)
  assert(light !== dark, "Light and dark mode colors are different")
  assert(light !== null && dark !== null, "Both modes return non-null colors")
}

// Test 7: Case-insensitive lookup
{
  const names = ["Hamlet"]
  const a = assignCharacterColors("test", names)
  const upper = getCharacterColor(a, "HAMLET", false)
  const lower = getCharacterColor(a, "hamlet", false)
  const mixed = getCharacterColor(a, "Hamlet", false)
  assert(upper === lower && lower === mixed, "Color lookup is case-insensitive")
}

// Test 8: Unknown character returns null
{
  const names = ["Hamlet"]
  const a = assignCharacterColors("test", names)
  const color = getCharacterColor(a, "Nonexistent", false)
  assert(color === null, "Unknown character returns null")
}

// ── Structural Unit Type Tests ─────────────────────────────────────

console.log("\n═══ Structural Unit Types ═══\n")

// Test: act_scene type exists in books.ts for drama
{
  const booksSource = fs.readFileSync(path.join(rootDir, "src/data/books.ts"), "utf-8")
  const hamletMatch = booksSource.match(/id: "hamlet"[\s\S]*?structuralUnitType: '([^']+)'/)
  assert(hamletMatch?.[1] === "act_scene", "Hamlet uses act_scene structural unit type")

  const macbethMatch = booksSource.match(/id: "macbeth"[\s\S]*?structuralUnitType: '([^']+)'/)
  assert(macbethMatch?.[1] === "act_scene", "Macbeth uses act_scene structural unit type")

  // Non-drama should remain unchanged
  const odysseyMatch = booksSource.match(/id: "the-odyssey"[\s\S]*?structuralUnitType: '([^']+)'/)
  assert(odysseyMatch?.[1] === "book", "The Odyssey still uses book structural unit type")

  const prideMatch = booksSource.match(/id: "pride-and-prejudice"[\s\S]*?structuralUnitType: '([^']+)'/)
  assert(prideMatch?.[1] === "chapter", "Pride and Prejudice still uses chapter type")
}

// ── Content Type Detection Tests ───────────────────────────────────

console.log("\n═══ Content Type Detection ═══\n")

// Test: book-structures.json exists and has correct structure
{
  const manifestPath = path.join(rootDir, "src/data/book-structures.json")
  assert(fs.existsSync(manifestPath), "book-structures.json manifest exists")

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"))
  assert(manifest.books.length > 0, "Manifest has book entries")

  const hamlet = manifest.books.find((b: { bookId: string }) => b.bookId === "hamlet")
  assert(hamlet !== undefined, "Hamlet is in the manifest")
  assert(hamlet?.contentType === "mixed", "Hamlet detected as mixed (drama + verse)")
  assert(hamlet?.hasTableDrama === true, "Hamlet has table drama")
  assert(hamlet?.hasVerseLines === true, "Hamlet has verse lines")
  assert((hamlet?.characterNames?.length ?? 0) > 10, "Hamlet has 10+ characters detected")

  const divineComedy = manifest.books.find((b: { bookId: string }) => b.bookId === "the-divine-comedy")
  assert(divineComedy?.contentType === "verse", "Divine Comedy detected as verse")

  const paradiseLost = manifest.books.find((b: { bookId: string }) => b.bookId === "paradise-lost")
  assert(paradiseLost?.contentType === "verse", "Paradise Lost detected as verse")

  // No false positives
  const ulysses = manifest.books.find((b: { bookId: string }) => b.bookId === "ulysses")
  assert(ulysses?.contentType === "prose", "Ulysses correctly detected as prose (not verse)")

  const mobyDick = manifest.books.find((b: { bookId: string }) => b.bookId === "moby-dick")
  assert(mobyDick?.contentType === "prose", "Moby-Dick correctly detected as prose")
}

// ── Paginator Block Tags Test ──────────────────────────────────────

console.log("\n═══ Paginator Block Tags ═══\n")

{
  const paginatorSource = fs.readFileSync(path.join(rootDir, "src/lib/paginator.ts"), "utf-8")
  assert(paginatorSource.includes('"TABLE"'), "Paginator BLOCK_TAGS includes TABLE")
  assert(paginatorSource.includes('"TR"'), "Paginator BLOCK_TAGS includes TR")
  assert(paginatorSource.includes('"FIGURE"'), "Paginator BLOCK_TAGS includes FIGURE")
}

// ── CSS Tests ──────────────────────────────────────────────────────

console.log("\n═══ CSS Rules ═══\n")

{
  const css = fs.readFileSync(path.join(rootDir, "src/styles/tome.css"), "utf-8")
  assert(css.includes(".prose-reader.content-drama table"), "CSS has drama table rules")
  assert(css.includes("font-variant: small-caps"), "CSS has small-caps for character names")
  assert(css.includes(".prose-reader.content-verse"), "CSS has verse formatting rules")
  assert(css.includes("--char-color"), "CSS references --char-color variable")
  assert(css.includes("content-verse p + p"), "CSS overrides prose indent for verse")
}

// ── Summary ────────────────────────────────────────────────────────

console.log(`\n═══════════════════════════════════════════`)
console.log(`  Results: ${passed} passed, ${failed} failed`)
console.log(`═══════════════════════════════════════════\n`)

process.exit(failed > 0 ? 1 : 0)
