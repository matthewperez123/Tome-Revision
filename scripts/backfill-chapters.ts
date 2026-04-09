/**
 * backfill-chapters.ts
 *
 * Reads every book ID from src/data/books.ts, checks for
 * public/content/{bookId}/meta.json, and backfills missing or
 * mismatched chapter entries in src/data/chapters.ts.
 *
 * Usage:  npx ts-node --project scripts/tsconfig.json scripts/backfill-chapters.ts
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "src/data/books.ts");
const CHAPTERS_PATH = path.join(ROOT, "src/data/chapters.ts");
const CONTENT_DIR = path.join(ROOT, "public/content");

// ── 1. Extract all book IDs from books.ts ──────────────────────────────────

function extractBookIds(): string[] {
  const src = fs.readFileSync(BOOKS_PATH, "utf-8");
  const ids: string[] = [];
  const re = /^\s+id:\s*"([^"]+)"/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) ids.push(m[1]);
  return ids;
}

// ── 2. Read meta.json for a book ───────────────────────────────────────────

interface MetaChapter {
  index: number;
  title: string;
  wordCount: number;
  estimatedMinutes: number;
}

interface MetaJson {
  bookId: string;
  chapters: MetaChapter[];
}

function readMeta(bookId: string): MetaJson | null {
  const p = path.join(CONTENT_DIR, bookId, "meta.json");
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch {
    return null;
  }
}

// ── 3. Count existing chapter entries per bookId ───────────────────────────

function countExistingChapters(chaptersSource: string): Map<string, number> {
  const counts = new Map<string, number>();
  const re = /bookId:\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(chaptersSource))) {
    counts.set(m[1], (counts.get(m[1]) || 0) + 1);
  }
  return counts;
}

// ── 4. Remove all entries for a given bookId from the source ───────────────

function removeBookEntries(src: string, bookId: string): string {
  // Each entry is a block like:
  //   {
  //     id: "...",
  //     bookId: "...",
  //     ...
  //   },
  // We also want to remove preceding comment lines for the book section.

  // Remove individual entry objects for this bookId
  // Match:  {  ... bookId: "theBookId" ... },
  const entryRe = new RegExp(
    `\\s*\\{[^}]*bookId:\\s*"${escapeRegex(bookId)}"[^}]*\\},?`,
    "g"
  );
  let result = src.replace(entryRe, "");

  // Remove section comment lines that reference this bookId
  // e.g.   // ── The Odyssey ────...
  // We'll skip this to be safe — only remove the data entries.

  return result;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ── 5. Generate chapter entry text ─────────────────────────────────────────

function generateEntries(bookId: string, chapters: MetaChapter[]): string {
  const lines: string[] = [];
  for (const ch of chapters) {
    // Escape any quotes/backslashes in the title
    const title = ch.title
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"');

    lines.push(`  {
    id: "${bookId}-ch-${ch.index}",
    bookId: "${bookId}",
    number: ${ch.index},
    title: "${title}",
    wordCount: ${ch.wordCount},
    estimatedMinutes: ${ch.estimatedMinutes},
    summary: "",
    quizAvailable: false,
  },`);
  }
  return lines.join("\n");
}

// ── Main ───────────────────────────────────────────────────────────────────

function main() {
  const bookIds = extractBookIds();
  console.log(`Found ${bookIds.length} books in books.ts`);

  let chaptersSource = fs.readFileSync(CHAPTERS_PATH, "utf-8");
  const existingCounts = countExistingChapters(chaptersSource);

  let backfilled = 0;
  let skipped = 0;
  let noMeta = 0;
  const details: string[] = [];

  for (const bookId of bookIds) {
    const meta = readMeta(bookId);
    if (!meta) {
      noMeta++;
      continue;
    }

    const metaCount = meta.chapters.length;
    const existingCount = existingCounts.get(bookId) || 0;

    if (existingCount === metaCount) {
      skipped++;
      continue;
    }

    // Need to fix this book
    details.push(
      `  ${bookId}: existing=${existingCount} meta=${metaCount} -> regenerating`
    );

    // Remove old entries if any
    if (existingCount > 0) {
      chaptersSource = removeBookEntries(chaptersSource, bookId);
    }

    // Generate new entries
    const newEntries = generateEntries(bookId, meta.chapters);

    // Insert before the closing `]`
    const closingIdx = chaptersSource.lastIndexOf("]");
    if (closingIdx === -1) {
      console.error("Could not find closing ] in chapters.ts!");
      process.exit(1);
    }

    // Make sure there's a newline before we insert
    const before = chaptersSource.slice(0, closingIdx).trimEnd();
    const after = chaptersSource.slice(closingIdx);

    chaptersSource = before + "\n" + newEntries + "\n" + after;
    backfilled++;
  }

  // Write updated file
  fs.writeFileSync(CHAPTERS_PATH, chaptersSource, "utf-8");

  console.log(`\nResults:`);
  console.log(`  Backfilled: ${backfilled} books`);
  console.log(`  Skipped (correct count): ${skipped} books`);
  console.log(`  No meta.json: ${noMeta} books`);
  if (details.length > 0) {
    console.log(`\nDetails:`);
    for (const d of details) console.log(d);
  }

  // Verification pass
  const updatedSource = fs.readFileSync(CHAPTERS_PATH, "utf-8");
  const updatedCounts = countExistingChapters(updatedSource);
  let mismatches = 0;
  for (const bookId of bookIds) {
    const meta = readMeta(bookId);
    if (!meta) continue;
    const expected = meta.chapters.length;
    const actual = updatedCounts.get(bookId) || 0;
    if (actual !== expected) {
      console.log(`  MISMATCH: ${bookId} expected=${expected} actual=${actual}`);
      mismatches++;
    }
  }
  console.log(`\nVerification: ${mismatches === 0 ? "ALL MATCH" : mismatches + " mismatches found"}`);
  console.log(`Total unique books with chapters: ${updatedCounts.size}`);
}

main();
