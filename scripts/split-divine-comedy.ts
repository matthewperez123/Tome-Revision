/**
 * Split `public/content/the-divine-comedy/ch-{0,1,2}.json` (one JSON per
 * canticle, containing 33–34 `<section role="doc-chapter">` blocks) into
 * 100 per-canto JSON files at `ch-0.json` … `ch-99.json` to match the new
 * flat-canto architecture (see `src/data/books.ts`, `parts` on
 * `the-divine-comedy`).
 *
 * Layout after running:
 *   ch-0.json   Inferno Canto I      (+ Longfellow's doc-preface sonnet
 *                                      prepended as the canticle's dedicatory
 *                                      frame — it's short and only appears
 *                                      for Inferno)
 *   ch-1..33    Inferno Canto II–XXXIV
 *   ch-34..66   Purgatorio Canto I–XXXIII
 *   ch-67..99   Paradiso Canto I–XXXIII
 *
 * Idempotent: re-running overwrites the canto files. The source canticle
 * files are backed up to `ch-{0,1,2}.canticle.json` on first run so the
 * original material is never lost.
 */

import { promises as fs } from "node:fs"
import path from "node:path"

const CONTENT_DIR = path.join(process.cwd(), "public/content/the-divine-comedy")

interface SourceFile {
  bookId: string
  chapterIndex: number
  title: string            // "Inferno" | "Purgatorio" | "Paradiso"
  wordCount: number
  estimatedMinutes: number
  html: string
}

interface OutputFile {
  bookId: string
  chapterIndex: number
  title: string            // "Canto I" … "Canto XXXIV"
  canticle: string         // "Inferno" | ...
  partId: string           // "inferno" | "purgatorio" | "paradiso"
  wordCount: number
  estimatedMinutes: number
  html: string
}

const CANTICLES: { file: string; partId: string; name: string; count: number; offset: number }[] = [
  { file: "ch-0.json", partId: "inferno",    name: "Inferno",    count: 34, offset: 0 },
  { file: "ch-1.json", partId: "purgatorio", name: "Purgatorio", count: 33, offset: 34 },
  { file: "ch-2.json", partId: "paradiso",   name: "Paradiso",   count: 33, offset: 67 },
]

function romanNumeral(n: number): string {
  const v = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  const s = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
  let out = ""
  for (let i = 0; i < v.length; i++) {
    while (n >= v[i]) { out += s[i]; n -= v[i] }
  }
  return out
}

/** Extract balanced `<section ... role="doc-chapter">…</section>` blocks. */
function extractDocChapterSections(html: string): string[] {
  const results: string[] = []
  const openRe = /<section\b[^>]*\brole="doc-chapter"[^>]*>/gi
  let match: RegExpExecArray | null
  while ((match = openRe.exec(html)) !== null) {
    const start = match.index
    // Walk forward finding balanced <section>/</section>.
    let depth = 1
    let i = openRe.lastIndex
    const sectionOpen = /<section\b/gi
    const sectionClose = /<\/section\s*>/gi
    while (depth > 0 && i < html.length) {
      sectionOpen.lastIndex = i
      sectionClose.lastIndex = i
      const nextOpen  = sectionOpen.exec(html)
      const nextClose = sectionClose.exec(html)
      if (!nextClose) break
      if (nextOpen && nextOpen.index < nextClose.index) {
        depth++
        i = nextOpen.index + 9 // past "<section "
      } else {
        depth--
        i = nextClose.index + nextClose[0].length
        if (depth === 0) {
          results.push(html.slice(start, i))
          openRe.lastIndex = i
          break
        }
      }
    }
  }
  return results
}

/** Extract the first balanced doc-preface section (for Inferno's sonnet). */
function extractDocPreface(html: string): string | null {
  const m = /<section\b[^>]*\brole="doc-preface"[^>]*>/i.exec(html)
  if (!m) return null
  const start = m.index
  let depth = 1
  let i = m.index + m[0].length
  const sectionOpen  = /<section\b/gi
  const sectionClose = /<\/section\s*>/gi
  while (depth > 0 && i < html.length) {
    sectionOpen.lastIndex = i
    sectionClose.lastIndex = i
    const nextOpen  = sectionOpen.exec(html)
    const nextClose = sectionClose.exec(html)
    if (!nextClose) return null
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth++
      i = nextOpen.index + 9
    } else {
      depth--
      i = nextClose.index + nextClose[0].length
      if (depth === 0) return html.slice(start, i)
    }
  }
  return null
}

function countWords(html: string): number {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length
}

async function backupIfNeeded(file: string) {
  const backup = file.replace(/\.json$/, ".canticle.json")
  try {
    await fs.access(backup)
    // Backup already exists — leave it alone.
  } catch {
    await fs.copyFile(file, backup)
    console.log(`  backed up → ${path.basename(backup)}`)
  }
}

async function main() {
  const canticleHtml: Record<string, string> = {}

  // Load all three canticle files and back them up.
  for (const c of CANTICLES) {
    const p = path.join(CONTENT_DIR, c.file)
    const raw = await fs.readFile(p, "utf8")
    const data = JSON.parse(raw) as SourceFile
    if (data.title.toLowerCase() !== c.name.toLowerCase()) {
      throw new Error(`${c.file}: expected title "${c.name}", got "${data.title}"`)
    }
    const cantos = extractDocChapterSections(data.html)
    if (cantos.length !== c.count) {
      throw new Error(`${c.file}: expected ${c.count} doc-chapter sections, got ${cantos.length}`)
    }
    canticleHtml[c.partId] = data.html
    await backupIfNeeded(p)
  }

  // Emit per-canto files.
  for (const c of CANTICLES) {
    const cantos = extractDocChapterSections(canticleHtml[c.partId])
    const preface = c.partId === "inferno" ? extractDocPreface(canticleHtml[c.partId]) : null

    for (let i = 0; i < cantos.length; i++) {
      const cantoNumber = i + 1
      const roman = romanNumeral(cantoNumber)
      let cantoHtml = cantos[i]
      // Prepend Longfellow's dedicatory sonnet to Canto I of Inferno so the
      // only doc-preface in the source still has a home.
      if (i === 0 && preface) {
        cantoHtml = `${preface}\n${cantoHtml}`
      }
      const wordCount = countWords(cantoHtml)
      const out: OutputFile = {
        bookId: "the-divine-comedy",
        chapterIndex: c.offset + i,
        title: `Canto ${roman}`,
        canticle: c.name,
        partId: c.partId,
        wordCount,
        estimatedMinutes: Math.max(1, Math.round(wordCount / 200)),
        html: cantoHtml,
      }
      const outPath = path.join(CONTENT_DIR, `ch-${c.offset + i}.json`)
      await fs.writeFile(outPath, JSON.stringify(out, null, 2))
    }
    console.log(`  ${c.name}: wrote ${cantos.length} canto files (offset ${c.offset})`)
  }

  // Refresh meta.json
  const meta = {
    bookId: "the-divine-comedy",
    title: "The Divine Comedy",
    author: "Dante Alighieri",
    chapterCount: 100,
    parts: CANTICLES.map(c => ({
      id: c.partId,
      title: c.name,
      firstIndex: c.offset,
      lastIndex: c.offset + c.count - 1,
      count: c.count,
    })),
  }
  await fs.writeFile(path.join(CONTENT_DIR, "meta.json"), JSON.stringify(meta, null, 2))
  console.log("  wrote meta.json")
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
