/**
 * Split `public/content/the-faerie-queene/ch-{2..8}.json` — one JSON per
 * book (Books I–VI) plus the combined Mutabilitie file — into 74 per-
 * canto JSON files matching the canto-level architecture:
 *
 *   ch-0.json   Forward                   (unchanged)
 *   ch-1.json   Letter to Sir Walter Raleigh (unchanged)
 *   ch-2..13    Book I  canto i..xii
 *   ch-14..25   Book II canto i..xii
 *   ch-26..37   Book III canto i..xii
 *   ch-38..49   Book IV canto i..xii
 *   ch-50..61   Book V canto i..xii
 *   ch-62..73   Book VI canto i..xii
 *   ch-74       Mutabilitie Canto VI
 *   ch-75       Mutabilitie Canto VII (including the two "unperfite" closing stanzas)
 *
 * Total: 76 chapters (was 9).
 *
 * DESIGN NOTES
 *
 * - SE Faerie Queene wraps each canto in a bare `<section role="doc-chapter">`.
 *   Canto numbers are implicit by document order; no heading markup carries
 *   the canto's Roman numeral.
 * - SE's edition strips Spenser's traditional four-line verse Arguments
 *   (the quatrains preceding each canto in the 1590/1596 quartos). We
 *   DO NOT attempt to recover them here — that's a separate content-
 *   sourcing task (Wikisource / scholarly edition). When the Arguments
 *   land, they can be injected into each canto's HTML as a new
 *   <div class="tome-canto-argument"> block at the top.
 * - Book-level proem stanzas (the opening invocations of Books I–VI)
 *   live OUTSIDE `<section role="doc-chapter">` inside the book file's
 *   `<section role="doc-part">`. They are preserved verbatim at the top
 *   of each book's FIRST canto (canto i) with a data-fq-proem attribute
 *   so the reader can style them distinctly.
 * - The Mutabilitie file (ch-8) contains two cantos within a single
 *   book-wrapping section; we split on the two doc-chapter boundaries.
 *   The two "unperfite" closing stanzas at the very end of canto VII
 *   are preserved in place (Spenser's final verse; the ending fragment
 *   is the truest ending he gave the work).
 * - Idempotent: re-running overwrites the canto files. The source book
 *   files are backed up to `ch-{N}.book.json` on first run so the
 *   original material is never lost.
 *
 * USAGE
 *
 *   pnpm tsx scripts/faerie-queene/split-cantos.ts           (DRY RUN — prints plan)
 *   APPLY=1 pnpm tsx scripts/faerie-queene/split-cantos.ts   (writes files)
 *
 * POST-RUN CHECKLIST
 *
 *   1. Update `src/data/books.ts` `the-faerie-queene` entry:
 *        chapters: 76
 *        parts: [  // 7 BookParts — see src/data/faerie-queene/canto-metadata.ts
 *          { id: 'front-matter',     title: 'Front Matter',            order: 0, unitCount: 2  },
 *          { id: 'book-i',           title: 'Book I: Holiness',        order: 1, unitCount: 12 },
 *          { id: 'book-ii',          title: 'Book II: Temperance',     order: 2, unitCount: 12 },
 *          { id: 'book-iii',         title: 'Book III: Chastity',      order: 3, unitCount: 12 },
 *          { id: 'book-iv',          title: 'Book IV: Friendship',     order: 4, unitCount: 12 },
 *          { id: 'book-v',           title: 'Book V: Justice',         order: 5, unitCount: 12 },
 *          { id: 'book-vi',          title: 'Book VI: Courtesy',       order: 6, unitCount: 12 },
 *          { id: 'mutabilitie',      title: 'The Mutabilitie Cantos',  order: 7, unitCount: 2  },
 *        ]
 *   2. Update `public/content/the-faerie-queene/meta.json` to list 76 chapters.
 *   3. Existing Letter-to-Ralegh annotations (chapterNumber: 1) are UNCHANGED.
 *   4. Future canto-level annotations should use chapterNumber matching the
 *      flat index produced by this split (e.g. Book I canto i = chapterNumber
 *      2, Book II canto xii = chapterNumber 25, Mutabilitie vii = chapterNumber 75).
 */

import { promises as fs } from "node:fs"
import path from "node:path"

const CONTENT_DIR = path.join(process.cwd(), "public/content/the-faerie-queene")
const APPLY = process.env.APPLY === "1"

interface SourceFile {
  bookId: string
  chapterIndex: number
  title: string
  wordCount: number
  estimatedMinutes: number
  html: string
}

interface OutputFile {
  bookId: string
  chapterIndex: number
  title: string             // "Book I · Canto I", "Mutabilitie · Canto VI"
  bookNumber: number        // 1..6, 7 for Mutabilitie
  bookRoman: string         // "I", "II", … "VI", "VII"
  bookTitle: string         // "The Legend of the Knight of the Red Cross, …"
  bookVirtue: string        // "Holiness", "Temperance", …
  partId: string            // "book-i", "book-ii", …, "mutabilitie"
  cantoNumber: number       // 1..12 (or 6/7 for Mutabilitie)
  cantoRoman: string        // "I", "II", … "XII"
  wordCount: number
  estimatedMinutes: number
  html: string
}

interface BookSpec {
  sourceChapter: number        // ch-N.json index of the source book file
  bookNumber: number
  roman: string
  virtue: string
  titularKnight: string
  title: string                // full legend title
  partId: string
  cantoCount: number
  outputOffset: number         // flat-index of this book's canto 1
  // Mutabilitie cantos are numbered vi and vii, not i and ii.
  cantoNumberStart?: number
}

const BOOKS: BookSpec[] = [
  { sourceChapter: 2, bookNumber: 1, roman: "I",   virtue: "Holiness",   titularKnight: "Redcrosse Knight",
    title: "The Legend of the Knight of the Red Cross, or of Holiness",
    partId: "book-i",   cantoCount: 12, outputOffset: 2 },
  { sourceChapter: 3, bookNumber: 2, roman: "II",  virtue: "Temperance", titularKnight: "Sir Guyon",
    title: "The Legend of Sir Guyon, or of Temperance",
    partId: "book-ii",  cantoCount: 12, outputOffset: 14 },
  { sourceChapter: 4, bookNumber: 3, roman: "III", virtue: "Chastity",   titularKnight: "Britomart",
    title: "The Legend of Britomartis, or of Chastity",
    partId: "book-iii", cantoCount: 12, outputOffset: 26 },
  { sourceChapter: 5, bookNumber: 4, roman: "IV",  virtue: "Friendship", titularKnight: "Sir Cambel & Sir Triamond",
    title: "The Legend of Cambel and Triamond, or of Friendship",
    partId: "book-iv",  cantoCount: 12, outputOffset: 38 },
  { sourceChapter: 6, bookNumber: 5, roman: "V",   virtue: "Justice",    titularKnight: "Sir Artegall",
    title: "The Legend of Artegall, or of Justice",
    partId: "book-v",   cantoCount: 12, outputOffset: 50 },
  { sourceChapter: 7, bookNumber: 6, roman: "VI",  virtue: "Courtesy",   titularKnight: "Sir Calidore",
    title: "The Legend of Sir Calidore, or of Courtesy",
    partId: "book-vi",  cantoCount: 12, outputOffset: 62 },
  { sourceChapter: 8, bookNumber: 7, roman: "VII", virtue: "Constancy",  titularKnight: "Mutabilitie / Dame Nature",
    title: "The Mutabilitie Cantos",
    partId: "mutabilitie", cantoCount: 2, outputOffset: 74, cantoNumberStart: 6 },
]

const CANTO_ROMAN: Record<number, string> = {
  1: "I",  2: "II", 3: "III", 4: "IV",  5: "V",
  6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X",
  11: "XI", 12: "XII",
}

function countWords(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[#a-z0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((w) => w.length > 0)
    .length
}

/**
 * Extract each `<section role="doc-chapter">` from a book file.
 * Returns the cantos in document order. Uses a simple angle-bracket tag
 * scanner — faster and more tolerant than a full DOM parse for this
 * very regular SE HTML.
 */
function extractCantoSections(html: string): string[] {
  const open = `<section role="doc-chapter">`
  const openAlt = `<section role='doc-chapter'>`
  const cantos: string[] = []
  let i = 0
  while (i < html.length) {
    let start = html.indexOf(open, i)
    if (start < 0) start = html.indexOf(openAlt, i)
    if (start < 0) break
    // Walk forward balancing <section>/</section> pairs.
    let depth = 1
    let j = start + (html.startsWith(open, start) ? open.length : openAlt.length)
    while (j < html.length && depth > 0) {
      const nextOpen = html.indexOf("<section", j)
      const nextClose = html.indexOf("</section>", j)
      if (nextClose < 0) break
      if (nextOpen >= 0 && nextOpen < nextClose) {
        depth++
        j = nextOpen + "<section".length
      } else {
        depth--
        j = nextClose + "</section>".length
      }
    }
    cantos.push(html.slice(start, j))
    i = j
  }
  return cantos
}

/**
 * Extract the book's proem stanzas. These live in a `<section role="doc-prologue">`
 * inside the book's top-level `<section role="doc-part">`, before canto I.
 * Returns the full `<section role="doc-prologue">…</section>` block, or "" if none.
 */
function extractBookProem(html: string): string {
  const open = `<section role="doc-prologue">`
  const idx = html.indexOf(open)
  if (idx < 0) return ""
  let depth = 1
  let j = idx + open.length
  while (j < html.length && depth > 0) {
    const nextOpen = html.indexOf("<section", j)
    const nextClose = html.indexOf("</section>", j)
    if (nextClose < 0) break
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth++
      j = nextOpen + "<section".length
    } else {
      depth--
      j = nextClose + "</section>".length
    }
  }
  return html.slice(idx, j)
}

function wrapCantoHTML(book: BookSpec, cantoNumber: number, cantoSection: string, proem: string): string {
  const cantoRoman = CANTO_ROMAN[cantoNumber]
  const header = `
<section role="doc-part" data-fq-book="${book.bookNumber}" data-fq-canto="${cantoNumber}">
  <hgroup>
    <p class="tome-canto-superheader">Book ${book.roman} — ${book.virtue}</p>
    <h2><span>Canto</span> <span>${cantoRoman}</span></h2>
  </hgroup>
  ${cantoNumber === 1 && proem ? `<div data-fq-proem="book-${book.bookNumber}">${proem}</div>` : ""}
  ${cantoSection}
</section>`
  return header.trim()
}

async function main(): Promise<void> {
  console.log(APPLY ? "APPLY MODE — will write files" : "DRY RUN — no files will be written")
  console.log("")

  const plan: OutputFile[] = []

  for (const book of BOOKS) {
    const srcPath = path.join(CONTENT_DIR, `ch-${book.sourceChapter}.json`)
    const source = JSON.parse(await fs.readFile(srcPath, "utf8")) as SourceFile

    let cantos = extractCantoSections(source.html)

    // Mutabilitie special case: SE treats the two "unperfite" closing
    // stanzas — Spenser's last surviving verses, sometimes numbered
    // "Canto VIII" in scholarly editions — as a third <section
    // role="doc-chapter">. Per spec, we present Book VII as two cantos
    // (vi and vii) and fold the fragment into canto vii's HTML with
    // an explicit `<div data-fq-fragment="unperfite">` marker the
    // reader can style distinctly and annotate separately.
    if (book.bookNumber === 7 && cantos.length === 3) {
      const [c6, c7, fragment] = cantos
      const fragmentWrapped =
        `<div data-fq-fragment="unperfite" aria-label="The Two \u201cUnperfite\u201d Cantos (Canto VIII, a fragment)">${fragment}</div>`
      // Append the fragment to canto vii. Preserve order: canto-vii
      // content first, then the fragment at the end.
      const c7Merged = c7.replace(/<\/section>\s*$/, `${fragmentWrapped}</section>`)
      cantos = [c6, c7Merged]
    }

    if (cantos.length !== book.cantoCount) {
      throw new Error(
        `Book ${book.roman}: expected ${book.cantoCount} cantos, found ${cantos.length} in ch-${book.sourceChapter}.json`,
      )
    }

    const proem = extractBookProem(source.html)

    // Backup the source file on first run.
    const backupPath = path.join(CONTENT_DIR, `ch-${book.sourceChapter}.book.json`)
    if (APPLY) {
      try {
        await fs.access(backupPath)
      } catch {
        await fs.copyFile(srcPath, backupPath)
        console.log(`Backed up → ${path.basename(backupPath)}`)
      }
    }

    for (let i = 0; i < book.cantoCount; i++) {
      const cantoNumber = (book.cantoNumberStart ?? 1) + i
      const cantoHTML = wrapCantoHTML(book, cantoNumber, cantos[i], proem)
      const outIdx = book.outputOffset + i
      const wordCount = countWords(cantoHTML)
      const estimatedMinutes = Math.max(1, Math.round(wordCount / 250))
      const output: OutputFile = {
        bookId: "the-faerie-queene",
        chapterIndex: outIdx,
        title: `Book ${book.roman} · Canto ${CANTO_ROMAN[cantoNumber]}`,
        bookNumber: book.bookNumber,
        bookRoman: book.roman,
        bookTitle: book.title,
        bookVirtue: book.virtue,
        partId: book.partId,
        cantoNumber,
        cantoRoman: CANTO_ROMAN[cantoNumber],
        wordCount,
        estimatedMinutes,
        html: cantoHTML,
      }
      plan.push(output)
      console.log(
        `  ch-${String(outIdx).padStart(2, "0")}.json  ${output.title.padEnd(26)} (${wordCount.toLocaleString()} words, ~${estimatedMinutes} min)`,
      )
    }
    console.log("")
  }

  if (!APPLY) {
    console.log(`Would write ${plan.length} canto files (ch-2.json through ch-75.json).`)
    console.log("Set APPLY=1 to actually write.")
    return
  }

  for (const out of plan) {
    const fp = path.join(CONTENT_DIR, `ch-${out.chapterIndex}.json`)
    await fs.writeFile(fp, JSON.stringify(out, null, 0) + "\n", "utf8")
  }
  console.log(`Wrote ${plan.length} canto files.`)
  console.log("")
  console.log("Next steps:")
  console.log("  1. Update src/data/books.ts `the-faerie-queene` entry (chapters: 76, parts[]).")
  console.log("  2. Update public/content/the-faerie-queene/meta.json.")
  console.log("  3. Letter-to-Ralegh annotations (chapterNumber: 1) remain correctly wired.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
