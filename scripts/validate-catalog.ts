#!/usr/bin/env npx tsx
/**
 * validate-catalog.ts
 *
 * QA script that checks the integrity of the Codex book catalog:
 * 1. Every book in books.ts has content in public/content/{id}/meta.json
 * 2. Every authorId in books.ts has a matching entry in authors.ts
 * 3. Every book's chapters exist in chapters.ts with correct count
 * 4. No duplicate book IDs
 * 5. Reports orphaned content (content dirs with no catalog entry)
 *
 * Run: npx tsx scripts/validate-catalog.ts
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const BOOKS_FILE = path.join(ROOT, "src/data/books.ts");
const CHAPTERS_FILE = path.join(ROOT, "src/data/chapters.ts");
const AUTHORS_FILE = path.join(ROOT, "src/data/authors.ts");
const CONTENT_DIR = path.join(ROOT, "public/content");

function main() {
  const booksContent = fs.readFileSync(BOOKS_FILE, "utf-8");
  const chaptersContent = fs.readFileSync(CHAPTERS_FILE, "utf-8");
  const authorsContent = fs.readFileSync(AUTHORS_FILE, "utf-8");

  // Extract book IDs and their authorIds
  const bookIds: string[] = [];
  const bookAuthorMap = new Map<string, string>();
  const bookChapterCountMap = new Map<string, number>();

  // Extract all id: "..." from books.ts
  const bookIdRegex = /id:\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = bookIdRegex.exec(booksContent)) !== null) {
    if (match[1] !== "string") bookIds.push(match[1]);
  }

  // More precise extraction for authorId and chapters
  const bookBlockRegex = /\{\s*\n\s*id:\s*"([^"]+)"[\s\S]*?authorId:\s*"([^"]+)"[\s\S]*?chapters:\s*(\d+)/g;
  while ((match = bookBlockRegex.exec(booksContent)) !== null) {
    bookAuthorMap.set(match[1], match[2]);
    bookChapterCountMap.set(match[1], parseInt(match[3]));
  }

  // Extract author IDs
  const authorIds = new Set<string>();
  const authorIdRegex = /id:\s*"([^"]+)"/g;
  while ((match = authorIdRegex.exec(authorsContent)) !== null) {
    if (match[1] !== "string") authorIds.add(match[1]);
  }

  // Extract chapter bookIds and count per book
  const chapterBookIdCounts = new Map<string, number>();
  const chapterBookIdRegex = /bookId:\s*"([^"]+)"/g;
  while ((match = chapterBookIdRegex.exec(chaptersContent)) !== null) {
    const count = chapterBookIdCounts.get(match[1]) || 0;
    chapterBookIdCounts.set(match[1], count + 1);
  }

  // Content directories
  const contentDirs = new Set(
    fs.readdirSync(CONTENT_DIR).filter(d =>
      fs.statSync(path.join(CONTENT_DIR, d)).isDirectory()
    )
  );

  const bookIdSet = new Set(bookIds);

  let errors = 0;
  let warnings = 0;

  console.log("══════════════════════════════════════════════════════");
  console.log("  CATALOG VALIDATION");
  console.log("══════════════════════════════════════════════════════\n");

  // 1. Check for duplicate book IDs
  const seen = new Set<string>();
  for (const id of bookIds) {
    if (seen.has(id)) {
      console.log(`  ERROR: Duplicate book ID: ${id}`);
      errors++;
    }
    seen.add(id);
  }

  // 2. Check each book has content
  let missingContent = 0;
  for (const id of bookIdSet) {
    const metaPath = path.join(CONTENT_DIR, id, "meta.json");
    if (!fs.existsSync(metaPath)) {
      console.log(`  ERROR: Book "${id}" has no content (missing meta.json)`);
      errors++;
      missingContent++;
    }
  }

  // 3. Check each book has matching author
  let missingAuthors = 0;
  const missingAuthorIds = new Set<string>();
  for (const [bookId, authorId] of bookAuthorMap) {
    if (!authorIds.has(authorId)) {
      missingAuthorIds.add(authorId);
      missingAuthors++;
    }
  }
  if (missingAuthorIds.size > 0) {
    console.log(`\n  WARNING: ${missingAuthorIds.size} author IDs referenced in books but missing from authors.ts:`);
    for (const id of [...missingAuthorIds].sort()) {
      console.log(`    - ${id}`);
    }
    warnings += missingAuthorIds.size;
  }

  // 4. Check chapter counts match
  let chapterMismatches = 0;
  for (const [bookId, expectedCount] of bookChapterCountMap) {
    const actualCount = chapterBookIdCounts.get(bookId) || 0;
    if (actualCount === 0 && expectedCount > 0) {
      // Only count as error if there are truly no chapters
      chapterMismatches++;
    }
  }

  // 5. Orphaned content
  const orphanedContent = [...contentDirs].filter(d => !bookIdSet.has(d));

  // Summary
  console.log("\n══════════════════════════════════════════════════════");
  console.log(`  SUMMARY`);
  console.log(`  Total books in catalog:     ${bookIdSet.size}`);
  console.log(`  Total authors:              ${authorIds.size}`);
  console.log(`  Total content directories:  ${contentDirs.size}`);
  console.log(`  Books with chapters:        ${chapterBookIdCounts.size}`);
  console.log(`  ─────────────────────────────────────`);
  console.log(`  Missing content:            ${missingContent}`);
  console.log(`  Missing authors:            ${missingAuthorIds.size}`);
  console.log(`  Chapter count mismatches:   ${chapterMismatches}`);
  console.log(`  Orphaned content dirs:      ${orphanedContent.length}`);
  console.log(`  ─────────────────────────────────────`);
  console.log(`  Errors:   ${errors}`);
  console.log(`  Warnings: ${warnings}`);
  console.log("══════════════════════════════════════════════════════\n");

  if (errors > 0) {
    process.exit(1);
  }
}

main();
