#!/usr/bin/env npx tsx
/**
 * Malory — Le Morte d'Arthur ingestion.
 *
 * Replaces the prior thin 528-file flat ingestion with a properly
 * book-nested structure that captures Caxton's rubrics as per-chapter
 * argumenti.
 *
 * Output layout (public/content/le-morte-darthur/):
 *   ch-0.json                  Bibliographical Note   (SE front matter)
 *   ch-1.json                  Caxton's Preface       (SE front matter)
 *   ch-2.json ... ch-505.json  504 body chapters, in Caxton book order
 *   ch-506.json                Glossary               (SE back matter)
 *   meta.json                  Flat + nested book-of-chapter index
 *
 * Each body chapter JSON carries:
 *   {
 *     html:                 "<section>…</section>",  // includes SE header block
 *     argumentum:           "How Arthur by the mean …",
 *     bookNumber:           1..21,
 *     chapterNumberInBook:  1..N,
 *     chapterRoman:         "I" … "CXXXII"
 *   }
 *
 * Run: pnpm tsx scripts/le-morte-darthur/ingest.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

const REPO = "thomas-malory_le-morte-darthur";
const RAW = `https://raw.githubusercontent.com/standardebooks/${REPO}/master`;
const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = path.join(ROOT, "public/content/le-morte-darthur");

// ── Helpers ──────────────────────────────────────────────────────────────────

async function fetchText(urlPath: string): Promise<string> {
  const url = `${RAW}/${urlPath}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`${resp.status} ${url}`);
  return resp.text();
}

function countWords(html: string): number {
  return html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
}

function stripSeBoilerplate(html: string): string {
  // Remove epub:-specific attributes and the dangling noteref anchors that
  // point into SE's endnotes.xhtml (we don't carry that file over).
  return html
    .replace(/\s*epub:type="[^"]*"/g, "")
    .replace(/\s*xml:lang="[^"]*"/g, "")
    .replace(/\s*xmlns:[a-z]+="[^"]*"/g, "")
    .replace(/<a\b[^>]*id="noteref-[^"]*"[^>]*>\s*(\d+)\s*<\/a>/g, "") // drop the trailing superscript
    .replace(/<a\b[^>]*href="endnotes\.xhtml[^"]*"[^>]*>\s*[\d–—-]+\s*<\/a>/g, "");
}

function extractBody(xhtml: string): string {
  const m = xhtml.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  return m ? stripSeBoilerplate(m[1].trim()) : stripSeBoilerplate(xhtml);
}

/**
 * From a chapter XHTML, extract the rubric (bridgehead paragraph).
 * Returns null if absent (front-matter chapters do not have one).
 */
function extractRubric(xhtml: string): string | null {
  const m = xhtml.match(/<p[^>]*epub:type="bridgehead"[^>]*>([\s\S]*?)<\/p>/);
  if (!m) return null;
  return m[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Extract a human title from the <title> tag or a fallback heading.
 */
function extractTitle(xhtml: string): string {
  const m = xhtml.match(/<title>([^<]+)<\/title>/);
  return m ? m[1].trim() : "Untitled";
}

// Roman numeral generator for chapter labels (no external dep).
function toRoman(num: number): string {
  const pairs: Array<[number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  for (const [v, s] of pairs) {
    while (num >= v) { result += s; num -= v; }
  }
  return result;
}

// ── Chapters-per-book (verified from SE manifest) ────────────────────────────

/**
 * Matches the count of chapter-B-C.xhtml files published by SE per book.
 * Book 10 (Tristram) has 88 chapters — the load-bearing test case.
 */
const CHAPTERS_PER_BOOK: readonly number[] = [
  27, 19, 15, 28, 12, 18, 35, 41, 44, 88,
  14, 14, 20, 10,  6, 17, 23, 25, 13, 22, 13,
];

// ── Main ─────────────────────────────────────────────────────────────────────

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

type NestedBook = {
  bookNumber: number;
  romanNumeral: string;
  chapterCount: number;
  chapters: Array<{
    flatIndex: number;
    chapterNumberInBook: number;
    romanNumeral: string;
    argumentum: string;
    wordCount: number;
  }>;
};

async function writeChapter(flatIndex: number, payload: Record<string, unknown>) {
  const file = path.join(OUT_DIR, `ch-${flatIndex}.json`);
  fs.writeFileSync(file, JSON.stringify(payload), "utf-8");
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log("Le Morte d'Arthur → fetching Standard Ebooks source…");
  const flat: FlatChapter[] = [];
  const nested: NestedBook[] = [];
  let flatIndex = 0;

  // ── ch-0: Bibliographical Note ────────────────────────────────────────────
  {
    const xhtml = await fetchText("src/epub/text/bibliographical-note.xhtml");
    const html = extractBody(xhtml);
    const wc = countWords(html);
    await writeChapter(flatIndex, { html });
    flat.push({
      index: flatIndex, title: "Bibliographical Note",
      wordCount: wc, estimatedMinutes: Math.max(1, Math.round(wc / 250)),
      kind: "front-matter",
    });
    console.log(`  ch-${flatIndex}  Bibliographical Note  (${wc} words)`);
    flatIndex++;
  }

  // ── ch-1: Caxton's Preface ────────────────────────────────────────────────
  {
    const xhtml = await fetchText("src/epub/text/preface-of-william-caxton.xhtml");
    const html = extractBody(xhtml);
    const wc = countWords(html);
    await writeChapter(flatIndex, { html });
    flat.push({
      index: flatIndex, title: "Preface of William Caxton",
      wordCount: wc, estimatedMinutes: Math.max(1, Math.round(wc / 250)),
      kind: "front-matter",
    });
    console.log(`  ch-${flatIndex}  Caxton's Preface  (${wc} words)`);
    flatIndex++;
  }

  // ── ch-2 onward: 504 body chapters, book-nested ───────────────────────────
  for (let b = 1; b <= CHAPTERS_PER_BOOK.length; b++) {
    const chapterCount = CHAPTERS_PER_BOOK[b - 1];
    const bookRoman = toRoman(b);
    const book: NestedBook = {
      bookNumber: b,
      romanNumeral: bookRoman,
      chapterCount,
      chapters: [],
    };

    console.log(`  Book ${bookRoman} (${chapterCount} chapters)…`);

    for (let c = 1; c <= chapterCount; c++) {
      const seFile = `chapter-${b}-${c}.xhtml`;
      const xhtml = await fetchText(`src/epub/text/${seFile}`);
      const html = extractBody(xhtml);
      const argumentum = extractRubric(xhtml) ?? "";
      const chapterRoman = toRoman(c);
      const wc = countWords(html);

      await writeChapter(flatIndex, {
        html,
        argumentum,
        bookNumber: b,
        chapterNumberInBook: c,
        chapterRoman,
      });

      flat.push({
        index: flatIndex,
        title: `Book ${bookRoman} · ${chapterRoman}`,
        wordCount: wc,
        estimatedMinutes: Math.max(1, Math.round(wc / 250)),
        bookNumber: b,
        chapterNumberInBook: c,
        argumentum,
        kind: "chapter",
      });

      book.chapters.push({
        flatIndex,
        chapterNumberInBook: c,
        romanNumeral: chapterRoman,
        argumentum,
        wordCount: wc,
      });

      flatIndex++;
      // Gentle rate-limit so GitHub doesn't 429 on 500+ fetches.
      await new Promise(r => setTimeout(r, 40));
    }

    nested.push(book);
  }

  // ── ch-506: SE Glossary (preserved as back-matter) ────────────────────────
  {
    const xhtml = await fetchText("src/epub/text/glossary.xhtml");
    const html = extractBody(xhtml);
    const wc = countWords(html);
    await writeChapter(flatIndex, { html });
    flat.push({
      index: flatIndex, title: "Glossary",
      wordCount: wc, estimatedMinutes: Math.max(1, Math.round(wc / 250)),
      kind: "back-matter",
    });
    console.log(`  ch-${flatIndex}  Glossary  (${wc} words)`);
    flatIndex++;
  }

  // ── meta.json (both flat + nested — the reader consumes flat, the
  //    enhancements overlay consumes nested for book/chapter navigation) ──
  const totalWords = flat.reduce((s, c) => s + c.wordCount, 0);
  const meta = {
    bookId: "le-morte-darthur",
    title: "Le Morte d'Arthur",
    author: "Thomas Malory",
    editor: "William Caxton (printer, 1485)",
    source: "Standard Ebooks / Pollard edition (Caxton text)",
    chapterCount: flat.length,
    bodyChapterCount: flat.filter(c => c.kind === "chapter").length,
    bookCount: CHAPTERS_PER_BOOK.length,
    totalWordCount: totalWords,
    totalMinutes: Math.round(totalWords / 250),
    chapters: flat,
    books: nested,
  };
  fs.writeFileSync(path.join(OUT_DIR, "meta.json"), JSON.stringify(meta, null, 2), "utf-8");

  // ── Delete any orphaned ch-N.json files from the prior 528-file ingestion ──
  const keep = new Set(flat.map(c => `ch-${c.index}.json`));
  keep.add("meta.json");
  let orphans = 0;
  for (const name of fs.readdirSync(OUT_DIR)) {
    if (!keep.has(name)) {
      fs.unlinkSync(path.join(OUT_DIR, name));
      orphans++;
    }
  }

  console.log("");
  console.log(`✓ ${flat.length} flat chapter files written`);
  console.log(`✓ ${nested.length} books indexed (${meta.bodyChapterCount} body chapters)`);
  console.log(`✓ ${totalWords.toLocaleString()} words, ≈${meta.totalMinutes} min`);
  console.log(`✓ ${orphans} orphaned files from prior ingestion removed`);
}

main().catch(err => { console.error(err); process.exit(1); });
