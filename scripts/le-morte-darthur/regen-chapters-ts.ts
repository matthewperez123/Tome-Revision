#!/usr/bin/env npx tsx
/**
 * Surgically replace the Malory block in src/data/chapters.ts so the
 * entries match the newly-ingested meta.json (507 entries: 2 front-matter
 * + 504 body + 1 back-matter glossary). The surrounding non-Malory
 * entries are untouched.
 *
 * Run: pnpm tsx scripts/le-morte-darthur/regen-chapters-ts.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(__dirname, "../..");
const CHAPTERS_TS = path.join(ROOT, "src/data/chapters.ts");
const META = path.join(ROOT, "public/content/le-morte-darthur/meta.json");

type FlatChapter = {
  index: number;
  title: string;
  wordCount: number;
  estimatedMinutes: number;
  bookNumber?: number;
  chapterNumberInBook?: number;
  argumentum?: string;
  kind: "front-matter" | "chapter" | "back-matter";
};

function entryFor(ch: FlatChapter): string {
  const title = ch.title.replace(/"/g, '\\"');
  const summary = ch.argumentum
    ? ch.argumentum.replace(/"/g, '\\"').replace(/\s+/g, " ").trim()
    : "";
  return [
    "  {",
    `    id: "le-morte-darthur-ch-${ch.index}",`,
    `    bookId: "le-morte-darthur",`,
    `    number: ${ch.index},`,
    `    title: "${title}",`,
    `    wordCount: ${ch.wordCount},`,
    `    estimatedMinutes: ${ch.estimatedMinutes},`,
    `    summary: ${JSON.stringify(summary)},`,
    `    quizAvailable: false,`,
    "  },",
  ].join("\n");
}

const meta = JSON.parse(fs.readFileSync(META, "utf-8"));
const flat: FlatChapter[] = meta.chapters;
const newBlock = flat.map(entryFor).join("\n") + "\n";

const src = fs.readFileSync(CHAPTERS_TS, "utf-8");

// The block begins with `  {` preceding `    id: "le-morte-darthur-ch-0",`
// and ends at the closing `  },` of the final Malory entry (currently ch-527
// in the old schema, which will become ch-506 in the new). We locate by
// id markers, then expand to include the bounding braces.
const startMarker = '    id: "le-morte-darthur-ch-0",';
const firstIdLine = src.indexOf(startMarker);
if (firstIdLine < 0) throw new Error("chapters.ts: Malory block start not found");

// Walk backward to the opening `  {\n` just before this id line.
let blockStart = src.lastIndexOf("  {\n", firstIdLine);
if (blockStart < 0) throw new Error("chapters.ts: opening brace not found");

// Walk forward through contiguous Malory entries to the last one, then find
// its closing `  },\n`.
const lastIdx = flat[flat.length - 1].index;
const lastIdMarker = `    id: "le-morte-darthur-ch-`; // prefix
// Find the highest Malory id present in the current file (old ingestion had ch-527).
let cursor = 0;
let lastMaloryIdLine = -1;
while (true) {
  const next = src.indexOf(lastIdMarker, cursor);
  if (next < 0) break;
  lastMaloryIdLine = next;
  cursor = next + 1;
}
if (lastMaloryIdLine < 0) throw new Error("chapters.ts: no Malory ids found");

// From that last id, find its closing `  },\n`.
const closingMarker = "  },\n";
const blockEnd = src.indexOf(closingMarker, lastMaloryIdLine);
if (blockEnd < 0) throw new Error("chapters.ts: Malory block closing not found");
const blockEndInclusive = blockEnd + closingMarker.length;

const before = src.slice(0, blockStart);
const after  = src.slice(blockEndInclusive);
const next   = before + newBlock + after;

// Sanity check the old block contained old (now-removed) indices.
const oldLen = blockEndInclusive - blockStart;
const newLen = newBlock.length;
console.log(`Old Malory block: ${oldLen} bytes`);
console.log(`New Malory block: ${newLen} bytes (${flat.length} entries)`);

fs.writeFileSync(CHAPTERS_TS, next, "utf-8");
console.log("✓ src/data/chapters.ts updated");
