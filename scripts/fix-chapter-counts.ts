#!/usr/bin/env npx tsx
/**
 * fix-chapter-counts.ts
 *
 * Fixes the `chapters` field in books.ts to match the actual number
 * of chapter content files in public/content/{id}/.
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const BOOKS_FILE = path.join(ROOT, "src/data/books.ts");
const CONTENT_DIR = path.join(ROOT, "public/content");

function main() {
  let booksContent = fs.readFileSync(BOOKS_FILE, "utf-8");

  // Find all books with chapter counts
  const bookRegex = /id:\s*"([^"]+)"[\s\S]*?chapters:\s*(\d+)/g;
  let match: RegExpExecArray | null;
  const fixes: { id: string; declared: number; actual: number }[] = [];

  while ((match = bookRegex.exec(booksContent)) !== null) {
    const bookId = match[1];
    const declared = parseInt(match[2]);

    const contentDir = path.join(CONTENT_DIR, bookId);
    if (!fs.existsSync(contentDir)) continue;

    const chFiles = fs.readdirSync(contentDir).filter(f => /^ch-\d+\.json$/.test(f));
    const actual = chFiles.length;

    if (declared !== actual && actual > 0) {
      fixes.push({ id: bookId, declared, actual });
    }
  }

  console.log(`Found ${fixes.length} books with wrong chapter counts`);

  let fixedCount = 0;
  for (const fix of fixes) {
    // Find the specific chapters: N line for this book
    // Look for the pattern: id: "bookId" ... chapters: N
    const idIdx = booksContent.indexOf(`id: "${fix.id}"`);
    if (idIdx === -1) continue;

    // Find the chapters: N line after this id (within next 500 chars)
    const searchArea = booksContent.substring(idIdx, idIdx + 800);
    const chMatch = searchArea.match(/chapters:\s*(\d+)/);
    if (!chMatch) continue;

    const chStart = idIdx + searchArea.indexOf(chMatch[0]);
    const chEnd = chStart + chMatch[0].length;
    const replacement = `chapters: ${fix.actual}`;

    booksContent = booksContent.substring(0, chStart) + replacement + booksContent.substring(chEnd);
    fixedCount++;
    console.log(`  Fixed: ${fix.id} (${fix.declared} → ${fix.actual})`);
  }

  fs.writeFileSync(BOOKS_FILE, booksContent, "utf-8");
  console.log(`\nFixed ${fixedCount} chapter counts`);
}

main();
