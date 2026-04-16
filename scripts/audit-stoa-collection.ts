/**
 * Stoa Collection Audit Script
 *
 * Validates the 1:1 painting-to-book invariant in the Stoa system.
 *
 * Usage:
 *   pnpm audit:stoa            — warnings exit 0, errors exit 1
 *   pnpm audit:stoa --strict   — warnings also exit 1 (for CI)
 *
 * Output: scripts/output/stoa-audit-<timestamp>.md
 */

import * as fs from "fs"
import * as path from "path"

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, "..")
const MANIFEST_PATH = path.join(ROOT, "public/paintings/manifest.json")
const BOOKS_PATH = path.join(ROOT, "src/data/books.ts")
const STOA_COLLECTION_PATH = path.join(ROOT, "src/data/stoa-collection.ts")
const OUTPUT_DIR = path.join(__dirname, "output")

const strict = process.argv.includes("--strict")

// ---------------------------------------------------------------------------
// Types (mirrored from src — scripts can't import ES modules)
// ---------------------------------------------------------------------------

interface ManifestPainting {
  id: string
  title: string
  artist: string
  year: string
  pairedBooks?: string[]
  institution?: string
  sourceUrl?: string
  imageUrl?: string
  license?: string
  [key: string]: unknown
}

interface StoaEntryRaw {
  id: string
  unlockingBookId: string
  title: string
  painter: string
  year: number | string
  sourceInstitution: string
  sourceUrl: string
  imageUrl: string
  publicDomainStatus: string
  curationTier: number
  curationNote: string
}

// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------

function loadManifest(): ManifestPainting[] {
  const raw = fs.readFileSync(MANIFEST_PATH, "utf-8")
  return JSON.parse(raw) as ManifestPainting[]
}

function loadBookIds(): Set<string> {
  const raw = fs.readFileSync(BOOKS_PATH, "utf-8")
  // Extract all id: "..." patterns from the BOOKS array
  const ids = new Set<string>()
  const regex = /^\s*id:\s*["']([^"']+)["']/gm
  let match: RegExpExecArray | null
  while ((match = regex.exec(raw)) !== null) {
    ids.add(match[1])
  }
  return ids
}

function loadStoaCollection(): StoaEntryRaw[] | null {
  if (!fs.existsSync(STOA_COLLECTION_PATH)) return null
  try {
    // Dynamic require via tsx — handles TypeScript natively
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(STOA_COLLECTION_PATH)
    const collection = mod.STOA_COLLECTION ?? mod.stoaCollection
    if (Array.isArray(collection)) return collection as StoaEntryRaw[]
    console.error("stoa-collection.ts does not export STOA_COLLECTION or stoaCollection")
    return null
  } catch (e) {
    console.error("Failed to load stoa-collection.ts:", (e as Error).message)
    return null
  }
}

// ---------------------------------------------------------------------------
// Audit logic
// ---------------------------------------------------------------------------

interface AuditResult {
  errors: string[]
  warnings: string[]
  stats: Record<string, number | string>
}

function auditFromManifest(
  paintings: ManifestPainting[],
  bookIds: Set<string>
): AuditResult {
  const errors: string[] = []
  const warnings: string[] = []

  // 1. Orphan paintings (no book)
  const orphans = paintings.filter(
    (p) => !p.pairedBooks || p.pairedBooks.length === 0
  )
  orphans.forEach((p) =>
    warnings.push(`ORPHAN PAINTING: "${p.title}" (${p.id}) has no paired book`)
  )

  // 2. Invalid book references
  paintings.forEach((p) => {
    ;(p.pairedBooks || []).forEach((bookId) => {
      if (!bookIds.has(bookId)) {
        errors.push(
          `INVALID BOOK REF: "${p.title}" (${p.id}) references non-existent book "${bookId}"`
        )
      }
    })
  })

  // 3. Duplicate assignments (same book in multiple paintings)
  const bookToPaintings = new Map<string, string[]>()
  paintings.forEach((p) => {
    ;(p.pairedBooks || []).forEach((bookId) => {
      const existing = bookToPaintings.get(bookId) || []
      existing.push(p.id)
      bookToPaintings.set(bookId, existing)
    })
  })
  for (const [bookId, paintingIds] of bookToPaintings) {
    if (paintingIds.length > 1) {
      warnings.push(
        `DUPLICATE ASSIGNMENT: book "${bookId}" is paired with ${paintingIds.length} paintings: ${paintingIds.join(", ")}`
      )
    }
  }

  // 4. Multi-book paintings (violates 1:1 — each painting should have exactly one book)
  const multiBook = paintings.filter(
    (p) => p.pairedBooks && p.pairedBooks.length > 1
  )
  multiBook.forEach((p) =>
    warnings.push(
      `MULTI-BOOK PAINTING: "${p.title}" (${p.id}) paired with ${p.pairedBooks!.length} books: ${p.pairedBooks!.join(", ")}`
    )
  )

  // 5. Missing metadata
  paintings
    .filter((p) => p.pairedBooks && p.pairedBooks.length > 0)
    .forEach((p) => {
      if (!p.institution)
        warnings.push(
          `MISSING METADATA: "${p.title}" (${p.id}) has no institution`
        )
      if (!p.sourceUrl)
        warnings.push(
          `MISSING METADATA: "${p.title}" (${p.id}) has no sourceUrl`
        )
    })

  // Stats
  const uniqueBooks = new Set<string>()
  paintings.forEach((p) =>
    (p.pairedBooks || []).forEach((b) => uniqueBooks.add(b))
  )

  return {
    errors,
    warnings,
    stats: {
      totalPaintings: paintings.length,
      pairedPaintings: paintings.length - orphans.length,
      orphanPaintings: orphans.length,
      multiBookPaintings: multiBook.length,
      uniqueBooksReferenced: uniqueBooks.size,
      duplicateBookAssignments: [...bookToPaintings.values()].filter(
        (v) => v.length > 1
      ).length,
      mode: "manifest-only (stoa-collection.ts not found)",
    },
  }
}

function auditFromStoaCollection(
  stoaEntries: StoaEntryRaw[],
  paintings: ManifestPainting[],
  bookIds: Set<string>
): AuditResult {
  const errors: string[] = []
  const warnings: string[] = []

  const paintingIds = new Set(paintings.map((p) => p.id))
  const stoaPaintingIds = new Set<string>()
  const stoaBookIds = new Set<string>()

  for (const entry of stoaEntries) {
    // 1. Painting exists in manifest
    if (!paintingIds.has(entry.id)) {
      errors.push(
        `ORPHAN ENTRY: Stoa entry "${entry.id}" references non-existent painting`
      )
    }

    // 2. Book exists in catalog
    if (!bookIds.has(entry.unlockingBookId)) {
      errors.push(
        `INVALID BOOK REF: Stoa entry "${entry.id}" references non-existent book "${entry.unlockingBookId}"`
      )
    }

    // 3. Duplicate painting IDs
    if (stoaPaintingIds.has(entry.id)) {
      errors.push(
        `DUPLICATE PAINTING: Painting "${entry.id}" appears multiple times in stoa-collection`
      )
    }
    stoaPaintingIds.add(entry.id)

    // 4. Duplicate book IDs (1:1 violation)
    if (stoaBookIds.has(entry.unlockingBookId)) {
      errors.push(
        `DUPLICATE BOOK: Book "${entry.unlockingBookId}" is assigned to multiple paintings`
      )
    }
    stoaBookIds.add(entry.unlockingBookId)

    // 5. Missing curation metadata
    if (!entry.sourceInstitution)
      warnings.push(
        `MISSING METADATA: "${entry.id}" has no sourceInstitution`
      )
    if (!entry.sourceUrl)
      warnings.push(`MISSING METADATA: "${entry.id}" has no sourceUrl`)
    if (!entry.imageUrl)
      warnings.push(`MISSING METADATA: "${entry.id}" has no imageUrl`)
    if (!entry.curationNote)
      warnings.push(`MISSING METADATA: "${entry.id}" has no curationNote`)
  }

  // 6. Manifest paintings not in stoa collection (informational)
  const uncoveredPaintings = paintings.filter((p) => !stoaPaintingIds.has(p.id))
  if (uncoveredPaintings.length > 0) {
    warnings.push(
      `UNCOVERED PAINTINGS: ${uncoveredPaintings.length} manifest paintings have no Stoa entry`
    )
  }

  return {
    errors,
    warnings,
    stats: {
      totalStoaEntries: stoaEntries.length,
      totalManifestPaintings: paintings.length,
      coveredPaintings: stoaPaintingIds.size,
      uncoveredPaintings: uncoveredPaintings.length,
      uniqueBooks: stoaBookIds.size,
      tier1: stoaEntries.filter((e) => e.curationTier === 1).length,
      tier2: stoaEntries.filter((e) => e.curationTier === 2).length,
      tier3: stoaEntries.filter((e) => e.curationTier === 3).length,
      tier4: stoaEntries.filter((e) => e.curationTier === 4).length,
      mode: "stoa-collection.ts",
    },
  }
}

// ---------------------------------------------------------------------------
// Report generation
// ---------------------------------------------------------------------------

function generateReport(result: AuditResult): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const lines: string[] = []

  lines.push(`# Stoa Collection Audit Report`)
  lines.push(``)
  lines.push(`**Generated**: ${new Date().toISOString()}`)
  lines.push(`**Mode**: ${result.stats.mode}`)
  lines.push(``)

  // Stats
  lines.push(`## Summary`)
  lines.push(``)
  lines.push(`| Metric | Value |`)
  lines.push(`|--------|-------|`)
  for (const [key, value] of Object.entries(result.stats)) {
    if (key === "mode") continue
    lines.push(
      `| ${key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())} | ${value} |`
    )
  }
  lines.push(``)

  // Errors
  lines.push(`## Errors (${result.errors.length})`)
  lines.push(``)
  if (result.errors.length === 0) {
    lines.push(`No errors found.`)
  } else {
    result.errors.forEach((e) => lines.push(`- ${e}`))
  }
  lines.push(``)

  // Warnings
  lines.push(`## Warnings (${result.warnings.length})`)
  lines.push(``)
  if (result.warnings.length === 0) {
    lines.push(`No warnings found.`)
  } else {
    // Group by type
    const groups = new Map<string, string[]>()
    result.warnings.forEach((w) => {
      const type = w.split(":")[0]
      const existing = groups.get(type) || []
      existing.push(w)
      groups.set(type, existing)
    })
    for (const [type, items] of groups) {
      lines.push(`### ${type} (${items.length})`)
      lines.push(``)
      items.forEach((w) => lines.push(`- ${w}`))
      lines.push(``)
    }
  }

  // Verdict
  lines.push(`## Verdict`)
  lines.push(``)
  if (result.errors.length > 0) {
    lines.push(`**FAIL** — ${result.errors.length} error(s) found.`)
  } else if (result.warnings.length > 0 && strict) {
    lines.push(
      `**FAIL** (strict mode) — ${result.warnings.length} warning(s) found.`
    )
  } else if (result.warnings.length > 0) {
    lines.push(
      `**PASS with warnings** — ${result.warnings.length} warning(s) found.`
    )
  } else {
    lines.push(`**PASS** — No issues found.`)
  }

  return lines.join("\n")
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log("Stoa Collection Audit")
  console.log("=====================")
  console.log("")

  // Load data
  const paintings = loadManifest()
  console.log(`Loaded ${paintings.length} paintings from manifest.json`)

  const bookIds = loadBookIds()
  console.log(`Loaded ${bookIds.size} book IDs from books.ts`)

  const stoaCollection = loadStoaCollection()
  if (stoaCollection) {
    console.log(
      `Loaded ${stoaCollection.length} entries from stoa-collection.ts`
    )
  } else {
    console.log(
      "stoa-collection.ts not found — auditing from manifest pairedBooks"
    )
  }
  console.log("")

  // Run audit
  const result = stoaCollection
    ? auditFromStoaCollection(stoaCollection, paintings, bookIds)
    : auditFromManifest(paintings, bookIds)

  // Generate report
  const report = generateReport(result)
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
  const outputPath = path.join(OUTPUT_DIR, `stoa-audit-${timestamp}.md`)

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  fs.writeFileSync(outputPath, report)

  // Console summary
  console.log(`Errors:   ${result.errors.length}`)
  console.log(`Warnings: ${result.warnings.length}`)
  console.log("")
  console.log(`Full report: ${path.relative(ROOT, outputPath)}`)
  console.log("")

  // Print errors to console
  if (result.errors.length > 0) {
    console.log("ERRORS:")
    result.errors.forEach((e) => console.log(`  ✗ ${e}`))
    console.log("")
  }

  // Exit code
  if (result.errors.length > 0) {
    console.log("AUDIT FAILED")
    process.exit(1)
  } else if (result.warnings.length > 0 && strict) {
    console.log("AUDIT FAILED (strict mode)")
    process.exit(1)
  } else {
    console.log("AUDIT PASSED")
    process.exit(0)
  }
}

main()
