/**
 * audit-verse-drama.ts — Scan all ingested book content and classify as
 * prose / verse / drama / mixed. Produces src/data/book-structures.json.
 *
 * Usage:  npx tsx scripts/audit-verse-drama.ts
 */

import * as fs from "fs"
import * as path from "path"
import * as cheerio from "cheerio"

// ── Types ──────────────────────────────────────────────────────────

interface BookStructure {
  bookId: string
  contentType: "prose" | "verse" | "drama" | "mixed"
  hasContent: boolean
  chapterCount: number
  characterNames?: string[]
  hasVerseLines: boolean
  hasTableDrama: boolean
  genreTags: string[]         // from books.ts for cross-reference
  structuralUnitType?: string
}

interface AuditReport {
  totalBooksInCatalog: number
  totalBooksWithContent: number
  byContentType: Record<string, number>
  mismatches: { bookId: string; genreExpected: string; detected: string }[]
  books: BookStructure[]
}

// ── Genre detection from books.ts ──────────────────────────────────

const DRAMA_GENRES = ["Drama"]
const VERSE_GENRES = ["Poetry", "Epic Poetry", "War Poetry", "Didactic Poetry",
  "Mythological Poetry", "Prose Poetry", "Novel in Verse"]
const EPIC_GENRES = ["Epic", "Epic Poetry", "National Epic", "Social Epic"]

// Genre tags that mean "this is a prose work" — if present, ignore Drama/Epic tags
const PROSE_OVERRIDE_GENRES = ["Novel", "Historical Novel", "Historical Fiction",
  "Modernist Novel", "Gothic Novel", "Philosophical Novel", "Social Novel",
  "Psychological Novel", "Satirical Novel", "Picaresque Novel", "Epistolary Novel",
  "Short Stories", "Novella", "Essays", "Memoir", "Biography", "Autobiography",
  "Philosophy", "History", "Criticism", "Science", "Travel", "Journalism",
  "Stream of Consciousness", "Children's Literature", "Fantasy", "Science Fiction"]

function getExpectedType(genres: string[]): "drama" | "verse" | "prose" | null {
  const hasDrama = genres.some(g => DRAMA_GENRES.includes(g))
  const hasVerse = genres.some(g => VERSE_GENRES.includes(g) || EPIC_GENRES.includes(g))

  // If the book has a prose-indicating genre AND no explicit Drama/Poetry tag,
  // it's prose — "Epic" and similar tags in these contexts mean scope, not form.
  // But if it explicitly says "Drama" alongside "Fantasy" etc., it's a play.
  if (!hasDrama && !hasVerse) return null

  const isProseWork = genres.some(g =>
    PROSE_OVERRIDE_GENRES.some(p => g.includes(p))
  )

  // Only apply prose override when there's no "Drama" genre tag.
  // A book tagged ["Drama", "Fantasy"] is a play with fantasy elements.
  // A book tagged ["Novel", "Drama"] is a dramatic novel (tone, not form) —
  // UNLESS it has no "Novel" tag but DOES have "Drama".
  if (hasDrama) {
    // "Drama" tag present — only override if explicitly also a "Novel"
    const isNovel = genres.some(g => g.includes("Novel"))
    if (isNovel) return null
    return "drama"
  }

  // For verse genres, apply the full prose override
  if (hasVerse && isProseWork) return null
  if (hasVerse) return "verse"

  return null
}

// ── HTML pattern detection ─────────────────────────────────────────

function analyzeChapterHtml(html: string): {
  hasTable: boolean
  hasVerseSpans: boolean
  characterNames: Set<string>
} {
  const $ = cheerio.load(html)
  const hasTable = $("table").length > 0

  // Verse pattern: <p> containing <span>...<br> sequences
  let hasVerseSpans = false
  $("p").each((_, p) => {
    const spans = $(p).find("> span")
    const brs = $(p).find("> br")
    if (spans.length >= 2 && brs.length >= 1) {
      hasVerseSpans = true
    }
  })
  // Also check inside <td> for verse within drama
  $("td").each((_, td) => {
    const p = $(td).find("p")
    p.each((_, pEl) => {
      const spans = $(pEl).find("> span")
      const brs = $(pEl).find("> br")
      if (spans.length >= 2 && brs.length >= 1) {
        hasVerseSpans = true
      }
    })
  })

  // Extract character names from drama tables
  const characterNames = new Set<string>()
  if (hasTable) {
    $("table tr").each((_, tr) => {
      const tds = $(tr).find("td")
      if (tds.length >= 2) {
        const firstTd = $(tds[0])
        const name = firstTd.text().trim().replace(/\s+/g, " ")
        // Skip empty cells (stage directions), long text, and multi-speaker names
        if (name && name.length > 0 && name.length < 30 && !name.includes("\n")) {
          // Skip if it's just italicized (stage direction in wrong column)
          const isItalic = firstTd.find("i").length > 0 && firstTd.text().trim() === firstTd.find("i").text().trim()
          if (!isItalic) {
            characterNames.add(name)
          }
        }
      }
    })
  }

  return { hasTable, hasVerseSpans, characterNames }
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  const rootDir = path.resolve(__dirname, "..")
  const contentDir = path.join(rootDir, "public", "content")
  const booksPath = path.join(rootDir, "src", "data", "books.ts")
  const outputPath = path.join(rootDir, "src", "data", "book-structures.json")

  // Parse genre tags from books.ts (quick regex, not full TS parse)
  const booksSource = fs.readFileSync(booksPath, "utf-8")
  const bookGenreMap = new Map<string, { genres: string[]; structuralUnitType?: string }>()

  // Match book entries — look for id: "..." and genres: [...]
  const bookBlocks = booksSource.split(/(?=\{\s*id:\s*")/)
  for (const block of bookBlocks) {
    const idMatch = block.match(/id:\s*"([^"]+)"/)
    if (!idMatch) continue
    const bookId = idMatch[1]

    const genresMatch = block.match(/genres:\s*\[([\s\S]*?)\]/)
    const genres: string[] = []
    if (genresMatch) {
      const genreStr = genresMatch[1]
      const genreMatches = genreStr.match(/"([^"]+)"/g)
      if (genreMatches) {
        for (const g of genreMatches) {
          genres.push(g.replace(/"/g, ""))
        }
      }
    }

    const unitMatch = block.match(/structuralUnitType:\s*"([^"]+)"/)
    bookGenreMap.set(bookId, {
      genres,
      structuralUnitType: unitMatch?.[1],
    })
  }

  console.log(`\n📚 Catalog: ${bookGenreMap.size} books in books.ts`)

  // Scan content directories
  const contentDirs = fs.readdirSync(contentDir).filter(d => {
    return fs.statSync(path.join(contentDir, d)).isDirectory()
  })

  console.log(`📂 Content: ${contentDirs.length} books with content files\n`)

  const results: BookStructure[] = []
  const mismatches: AuditReport["mismatches"] = []

  for (const bookId of contentDirs) {
    const bookDir = path.join(contentDir, bookId)
    const chapterFiles = fs.readdirSync(bookDir)
      .filter(f => f.startsWith("ch-") && f.endsWith(".json"))
      .sort((a, b) => {
        const numA = parseInt(a.replace("ch-", "").replace(".json", ""))
        const numB = parseInt(b.replace("ch-", "").replace(".json", ""))
        return numA - numB
      })

    if (chapterFiles.length === 0) continue

    const allCharacters = new Set<string>()
    let totalTable = 0
    let totalVerse = 0
    let totalChapters = 0

    for (const chFile of chapterFiles) {
      try {
        const raw = fs.readFileSync(path.join(bookDir, chFile), "utf-8")
        const data = JSON.parse(raw)
        if (!data.html) continue
        totalChapters++

        const { hasTable, hasVerseSpans, characterNames } = analyzeChapterHtml(data.html)
        if (hasTable) totalTable++
        if (hasVerseSpans) totalVerse++
        for (const name of characterNames) allCharacters.add(name)
      } catch {
        // Skip malformed files
      }
    }

    // Classify — use genre tags as primary signal, HTML detection as confirmation.
    // Many prose novels contain occasional dialogue tables or embedded verse,
    // so HTML-only detection is too aggressive.
    const bookMeta = bookGenreMap.get(bookId)
    const genreTags = bookMeta?.genres ?? []
    const expectedType = getExpectedType(genreTags)

    // Ratio thresholds: what fraction of chapters contain the pattern
    const tableRatio = totalChapters > 0 ? totalTable / totalChapters : 0
    const verseRatio = totalChapters > 0 ? totalVerse / totalChapters : 0

    let contentType: BookStructure["contentType"] = "prose"

    if (expectedType === "drama") {
      // Genre says drama — trust it, use HTML to distinguish verse/prose drama
      contentType = totalVerse > 0 ? "mixed" : "drama"
    } else if (expectedType === "verse") {
      // Genre says verse — trust it
      contentType = totalTable > 0 ? "mixed" : "verse"
    } else {
      // No drama/verse genre tag — stay prose. Many prose novels (Ulysses,
      // Ivanhoe, War and Peace) contain verse snippets or dialogue tables
      // that would trigger false positives. Only override for books that
      // are overwhelmingly table-structured drama with many characters.
      if (tableRatio >= 0.9 && allCharacters.size >= 10) {
        contentType = totalVerse > 0 ? "mixed" : "drama"
      }
      // Verse without genre tag stays prose — embedded verse in prose novels
      // should not change the whole book's treatment
    }

    // Detect mismatches (genre expects drama/verse but HTML disagrees)
    if (expectedType && expectedType !== contentType && contentType !== "mixed") {
      if (!(expectedType === "drama" && contentType === "mixed")) {
        mismatches.push({
          bookId,
          genreExpected: expectedType,
          detected: contentType,
        })
      }
    }

    const entry: BookStructure = {
      bookId,
      contentType,
      hasContent: true,
      chapterCount: totalChapters,
      hasVerseLines: totalVerse > 0,
      hasTableDrama: totalTable > 0,
      genreTags,
      structuralUnitType: bookMeta?.structuralUnitType,
    }

    if (allCharacters.size > 0) {
      entry.characterNames = Array.from(allCharacters).sort()
    }

    results.push(entry)
  }

  // Also add catalog-only books (no content) that are drama/verse
  for (const [bookId, meta] of bookGenreMap) {
    if (!contentDirs.includes(bookId)) {
      const expected = getExpectedType(meta.genres)
      if (expected) {
        results.push({
          bookId,
          contentType: expected,
          hasContent: false,
          chapterCount: 0,
          hasVerseLines: false,
          hasTableDrama: false,
          genreTags: meta.genres,
          structuralUnitType: meta.structuralUnitType,
        })
      }
    }
  }

  // Sort results
  results.sort((a, b) => a.bookId.localeCompare(b.bookId))

  // ── Report ─────────────────────────────────────────────────────

  const withContent = results.filter(r => r.hasContent)
  const byType: Record<string, number> = {}
  for (const r of withContent) {
    byType[r.contentType] = (byType[r.contentType] ?? 0) + 1
  }

  console.log("═══════════════════════════════════════════════════")
  console.log("  AUDIT REPORT: Verse & Drama Content Detection")
  console.log("═══════════════════════════════════════════════════\n")

  console.log(`Books with content: ${withContent.length}`)
  console.log(`Content type breakdown:`)
  for (const [type, count] of Object.entries(byType).sort()) {
    console.log(`  ${type.padEnd(8)} ${count}`)
  }

  const dramaBooks = withContent.filter(r => r.contentType === "drama" || r.contentType === "mixed")
  const verseBooks = withContent.filter(r => r.contentType === "verse" || r.contentType === "mixed")

  console.log(`\n── DRAMA (${dramaBooks.length} books with content) ──`)
  for (const b of dramaBooks) {
    const charCount = b.characterNames?.length ?? 0
    console.log(`  ${b.bookId.padEnd(40)} ${b.chapterCount} ch  ${charCount} chars  [${b.contentType}]`)
  }

  console.log(`\n── VERSE (${verseBooks.length} books with content) ──`)
  for (const b of verseBooks.filter(r => r.contentType === "verse")) {
    console.log(`  ${b.bookId.padEnd(40)} ${b.chapterCount} ch  [${b.contentType}]`)
  }

  const catalogOnly = results.filter(r => !r.hasContent && (r.contentType === "drama" || r.contentType === "verse"))
  if (catalogOnly.length > 0) {
    console.log(`\n── CATALOG-ONLY (no content files, ${catalogOnly.length} books) ──`)
    for (const b of catalogOnly.slice(0, 20)) {
      console.log(`  ${b.bookId.padEnd(40)} expected: ${b.contentType}`)
    }
    if (catalogOnly.length > 20) console.log(`  ... and ${catalogOnly.length - 20} more`)
  }

  if (mismatches.length > 0) {
    console.log(`\n── MISMATCHES (${mismatches.length}) ──`)
    for (const m of mismatches) {
      console.log(`  ${m.bookId.padEnd(40)} genre→${m.genreExpected.padEnd(8)} detected→${m.detected}`)
    }
  }

  // ── Write manifest ─────────────────────────────────────────────

  const manifest = {
    generatedAt: new Date().toISOString(),
    totalBooks: results.length,
    withContent: withContent.length,
    books: results,
  }

  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2))
  console.log(`\n✅ Manifest written to src/data/book-structures.json (${results.length} entries)`)
}

main().catch(console.error)
