#!/usr/bin/env npx tsx
/**
 * update-works-in-library.ts
 *
 * Scans books.ts to build authorId → bookIds[], then rewrites each
 * author's worksInLibrary in authors.ts.
 *
 * Run: npx tsx scripts/update-works-in-library.ts
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const BOOKS_FILE = path.join(ROOT, "src/data/books.ts");
const AUTHORS_FILE = path.join(ROOT, "src/data/authors.ts");

function main() {
  const booksContent = fs.readFileSync(BOOKS_FILE, "utf-8");
  let authorsContent = fs.readFileSync(AUTHORS_FILE, "utf-8");

  // Build authorId → bookId[] map
  const authorBooks = new Map<string, string[]>();
  const blockRegex = /\{\s*\n\s*id:\s*"([^"]+)"[\s\S]*?authorId:\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = blockRegex.exec(booksContent)) !== null) {
    const bookId = match[1];
    const authorId = match[2];
    if (!authorBooks.has(authorId)) authorBooks.set(authorId, []);
    authorBooks.get(authorId)!.push(bookId);
  }

  console.log(`Found ${authorBooks.size} unique authorIds across books.ts`);

  // Get all author IDs in authors.ts
  const authorIdRegex = /id:\s*"([^"]+)"/g;
  const authorIdsInFile = new Set<string>();
  while ((match = authorIdRegex.exec(authorsContent)) !== null) {
    authorIdsInFile.add(match[1]);
  }
  console.log(`Found ${authorIdsInFile.size} authors in authors.ts`);

  let updated = 0;
  let added = 0;

  for (const [authorId, bookIds] of authorBooks) {
    if (!authorIdsInFile.has(authorId)) continue;

    const sortedIds = bookIds.sort();
    const newWorksStr = `worksInLibrary: [${sortedIds.map(id => `"${id}"`).join(", ")}]`;

    // Try to replace existing worksInLibrary for this author
    // Pattern: find `id: "authorId"` then find worksInLibrary within the next ~2000 chars
    const idStr = `id: "${authorId}"`;
    const idIdx = authorsContent.indexOf(idStr);
    if (idIdx === -1) continue;

    // Find the end of this author block: look for `\n  },` or `\n  }\n` after the id
    const searchFrom = idIdx;
    const nextAuthorBlock = authorsContent.indexOf("\n  {", searchFrom + 10);
    const helperFns = authorsContent.indexOf("// ── Helper Functions", searchFrom);
    const blockEnd = Math.min(
      nextAuthorBlock !== -1 ? nextAuthorBlock : Infinity,
      helperFns !== -1 ? helperFns : Infinity
    );

    const blockSlice = authorsContent.substring(idIdx, blockEnd);

    // Check for existing worksInLibrary
    const worksMatch = blockSlice.match(/worksInLibrary:\s*\[[^\]]*\]/);
    if (worksMatch) {
      const oldWorks = worksMatch[0];
      if (oldWorks !== newWorksStr) {
        const absoluteIdx = idIdx + blockSlice.indexOf(oldWorks);
        authorsContent = authorsContent.substring(0, absoluteIdx) + newWorksStr + authorsContent.substring(absoluteIdx + oldWorks.length);
        updated++;
      }
    } else {
      // Add worksInLibrary before portraitPlaceholder or before the closing `  }`
      const portraitIdx = blockSlice.indexOf("portraitPlaceholder:");
      if (portraitIdx !== -1) {
        const absoluteIdx = idIdx + portraitIdx;
        authorsContent = authorsContent.substring(0, absoluteIdx) + newWorksStr + ",\n    " + authorsContent.substring(absoluteIdx);
        added++;
      }
    }
  }

  fs.writeFileSync(AUTHORS_FILE, authorsContent, "utf-8");

  console.log("\n══════════════════════════════════════════════════════");
  console.log(`  WORKS IN LIBRARY UPDATE`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Added:   ${added}`);
  console.log("══════════════════════════════════════════════════════\n");
}

main();
