#!/usr/bin/env npx tsx
/**
 * ingest-se-books-2.ts
 *
 * Downloads ~25 canonical works from Standard Ebooks GitHub that are
 * not yet in public/content/. Each book is downloaded as raw files
 * from the GitHub repo, parsed, and saved as JSON chapters.
 *
 * Run: npx tsx scripts/ingest-se-books-2.ts
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "public/content");

interface SEBookConfig {
  id: string;
  title: string;
  author: string;
  /** Standard Ebooks GitHub repo name (underscores): e.g. "thomas-more_utopia_ralph-robynson" */
  repoSlug: string;
  /** Files to fetch as chapters (relative to src/epub/text/) */
  chapterFiles?: string[];
}

const BOOKS: SEBookConfig[] = [
  {
    id: "utopia",
    title: "Utopia",
    author: "Thomas More",
    repoSlug: "boethius_the-consolation-of-philosophy_h-r-james",
  },
  {
    id: "thoreau-essays",
    title: "Essays",
    author: "Henry David Thoreau",
    repoSlug: "henry-david-thoreau_essays",
  },
  {
    id: "the-education-of-henry-adams",
    title: "The Education of Henry Adams",
    author: "Henry Adams",
    repoSlug: "henry-adams_the-education-of-henry-adams",
  },
  {
    id: "plays-of-w-b-yeats",
    title: "Plays",
    author: "W. B. Yeats",
    repoSlug: "w-b-yeats_plays",
  },
  {
    id: "sister-carrie",
    title: "Sister Carrie",
    author: "Theodore Dreiser",
    repoSlug: "theodore-dreiser_sister-carrie",
  },
  {
    id: "an-american-tragedy",
    title: "An American Tragedy",
    author: "Theodore Dreiser",
    repoSlug: "theodore-dreiser_an-american-tragedy",
  },
  {
    id: "jennie-gerhardt",
    title: "Jennie Gerhardt",
    author: "Theodore Dreiser",
    repoSlug: "theodore-dreiser_jennie-gerhardt",
  },
  {
    id: "the-age-of-innocence",
    title: "The Age of Innocence",
    author: "Edith Wharton",
    repoSlug: "edith-wharton_the-age-of-innocence",
  },
  {
    id: "the-turn-of-the-screw",
    title: "The Turn of the Screw",
    author: "Henry James",
    repoSlug: "henry-james_the-turn-of-the-screw",
  },
  {
    id: "the-portrait-of-a-lady",
    title: "The Portrait of a Lady",
    author: "Henry James",
    repoSlug: "henry-james_the-portrait-of-a-lady",
  },
  {
    id: "the-ambassadors",
    title: "The Ambassadors",
    author: "Henry James",
    repoSlug: "henry-james_the-ambassadors",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function countWords(html: string): number {
  return html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
}

function cleanHtml(html: string): string {
  // Remove SE-specific attributes
  return html
    .replace(/\s*epub:type="[^"]*"/g, "")
    .replace(/\s*xml:lang="[^"]*"/g, "")
    .replace(/\s*xmlns:[a-z]+="[^"]*"/g, "")
    .replace(/<i>/g, "<em>")
    .replace(/<\/i>/g, "</em>")
    .replace(/<b>/g, "<strong>")
    .replace(/<\/b>/g, "</strong>");
}

async function fetchGitHub(repoSlug: string, filePath: string): Promise<string | null> {
  const url = `https://raw.githubusercontent.com/standardebooks/${repoSlug}/master/${filePath}`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    return await resp.text();
  } catch {
    return null;
  }
}

function extractTitle(xhtml: string): string {
  // Try <title> tag
  const titleMatch = xhtml.match(/<title>([^<]+)<\/title>/);
  if (titleMatch) return titleMatch[1].trim();
  // Try first <h1> or <h2>
  const h1Match = xhtml.match(/<h[12][^>]*>([^<]+)<\/h[12]>/);
  if (h1Match) return h1Match[1].trim();
  return "Untitled";
}

function extractBody(xhtml: string): string {
  const bodyMatch = xhtml.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  if (!bodyMatch) return xhtml;
  return cleanHtml(bodyMatch[1].trim());
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const book of BOOKS) {
    const outDir = path.join(CONTENT_DIR, book.id);
    if (fs.existsSync(path.join(outDir, "meta.json"))) {
      console.log(`  SKIP: ${book.id} (already exists)`);
      skipped++;
      continue;
    }

    console.log(`\n  Downloading: ${book.title} by ${book.author}`);

    // Fetch the spine/manifest to find chapter files
    const opfContent = await fetchGitHub(book.repoSlug, "src/epub/content.opf");
    if (!opfContent) {
      console.log(`    FAIL: Could not fetch content.opf for ${book.repoSlug}`);
      failed++;
      continue;
    }

    // Parse manifest: map id → href for items in text/
    const manifestMatches = [...opfContent.matchAll(/<item[^>]*\bid="([^"]+)"[^>]*href="text\/([^"]+)"[^>]*\/?>/g)];
    // Also try reverse attribute order
    const manifestMatches2 = [...opfContent.matchAll(/<item[^>]*href="text\/([^"]+)"[^>]*\bid="([^"]+)"[^>]*\/?>/g)];
    const idToFile = new Map<string, string>();
    for (const m of manifestMatches) idToFile.set(m[1], m[2]);
    for (const m of manifestMatches2) idToFile.set(m[2], m[1]);

    // Parse spine order
    const spineMatches = [...opfContent.matchAll(/idref="([^"]+)"/g)];

    // Skip SE boilerplate files
    const skipFiles = new Set(["titlepage.xhtml", "imprint.xhtml", "colophon.xhtml", "uncopyright.xhtml", "loi.xhtml", "endnotes.xhtml", "halftitlepage.xhtml"]);

    const chapterFiles: string[] = [];
    for (const s of spineMatches) {
      const file = idToFile.get(s[1]);
      if (file && !skipFiles.has(file)) {
        chapterFiles.push(file);
      }
    }

    // Fallback: if spine parsing found nothing, just grab all text/*.xhtml files from manifest
    if (chapterFiles.length === 0) {
      console.log(`    Spine empty, falling back to manifest text files...`);
      for (const [, file] of idToFile) {
        if (!skipFiles.has(file)) chapterFiles.push(file);
      }
      chapterFiles.sort();
    }

    if (chapterFiles.length === 0) {
      console.log(`    FAIL: No chapter files found for ${book.id}`);
      failed++;
      continue;
    }

    // Fetch all chapter files
    fs.mkdirSync(outDir, { recursive: true });
    const chapters: Array<{ index: number; title: string; wordCount: number; estimatedMinutes: number }> = [];
    let totalWords = 0;

    for (let i = 0; i < chapterFiles.length; i++) {
      const file = chapterFiles[i];
      const xhtml = await fetchGitHub(book.repoSlug, `src/epub/text/${file}`);
      if (!xhtml) {
        console.log(`    WARN: Could not fetch ${file}`);
        continue;
      }

      const title = extractTitle(xhtml);
      const body = extractBody(xhtml);
      const wc = countWords(body);
      totalWords += wc;

      const chapterData = { html: body };
      fs.writeFileSync(path.join(outDir, `ch-${i}.json`), JSON.stringify(chapterData), "utf-8");

      chapters.push({
        index: i,
        title: title,
        wordCount: wc,
        estimatedMinutes: Math.max(1, Math.round(wc / 250)),
      });

      // Rate limit
      await new Promise(r => setTimeout(r, 200));
    }

    // Write meta.json
    const meta = {
      bookId: book.id,
      title: book.title,
      author: book.author,
      chapterCount: chapters.length,
      totalWordCount: totalWords,
      totalMinutes: Math.round(totalWords / 250),
      chapters,
    };
    fs.writeFileSync(path.join(outDir, "meta.json"), JSON.stringify(meta, null, 2), "utf-8");
    console.log(`    ✓ ${chapters.length} chapters, ${totalWords} words`);
    downloaded++;

    // Rate limit between books
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("\n══════════════════════════════════════════════════════");
  console.log(`  STANDARD EBOOKS DOWNLOAD SUMMARY`);
  console.log(`  Downloaded: ${downloaded}`);
  console.log(`  Skipped:    ${skipped}`);
  console.log(`  Failed:     ${failed}`);
  console.log("══════════════════════════════════════════════════════\n");
}

main();

// Run additional downloads
async function downloadMore() {
  const extra: SEBookConfig[] = [
    { id: "while-the-billy-boils", title: "While the Billy Boils", author: "Henry Lawson", repoSlug: "henry-lawson_while-the-billy-boils" },
    { id: "the-getting-of-wisdom", title: "The Getting of Wisdom", author: "Henry Handel Richardson", repoSlug: "henry-handel-richardson_the-getting-of-wisdom" },
    { id: "an-outback-marriage", title: "An Outback Marriage", author: "Banjo Paterson", repoSlug: "banjo-paterson_an-outback-marriage" },
  ];
  
  for (const book of extra) {
    const outDir = path.join(CONTENT_DIR, book.id);
    if (fs.existsSync(path.join(outDir, "meta.json"))) {
      console.log(`  SKIP: ${book.id} (exists)`);
      continue;
    }
    console.log(`\n  Downloading: ${book.title} by ${book.author}`);
    const opfContent = await fetchGitHub(book.repoSlug, "src/epub/content.opf");
    if (!opfContent) { console.log(`    FAIL: No content.opf`); continue; }
    
    const manifestMatches = [...opfContent.matchAll(/<item[^>]*\bid="([^"]+)"[^>]*href="text\/([^"]+)"[^>]*\/?>/g)];
    const manifestMatches2 = [...opfContent.matchAll(/<item[^>]*href="text\/([^"]+)"[^>]*\bid="([^"]+)"[^>]*\/?>/g)];
    const idToFile = new Map<string, string>();
    for (const m of manifestMatches) idToFile.set(m[1], m[2]);
    for (const m of manifestMatches2) idToFile.set(m[2], m[1]);
    const spineMatches = [...opfContent.matchAll(/idref="([^"]+)"/g)];
    const skipFiles = new Set(["titlepage.xhtml", "imprint.xhtml", "colophon.xhtml", "uncopyright.xhtml", "loi.xhtml", "endnotes.xhtml", "halftitlepage.xhtml"]);
    const chapterFiles: string[] = [];
    for (const s of spineMatches) {
      const file = idToFile.get(s[1]);
      if (file && !skipFiles.has(file)) chapterFiles.push(file);
    }
    if (chapterFiles.length === 0) {
      for (const [, file] of idToFile) { if (!skipFiles.has(file)) chapterFiles.push(file); }
      chapterFiles.sort();
    }
    if (chapterFiles.length === 0) { console.log(`    FAIL: No chapters`); continue; }
    
    fs.mkdirSync(outDir, { recursive: true });
    const chapters: Array<{ index: number; title: string; wordCount: number; estimatedMinutes: number }> = [];
    let totalWords = 0;
    for (let i = 0; i < chapterFiles.length; i++) {
      const xhtml = await fetchGitHub(book.repoSlug, `src/epub/text/${chapterFiles[i]}`);
      if (!xhtml) continue;
      const title = extractTitle(xhtml);
      const body = extractBody(xhtml);
      const wc = countWords(body);
      totalWords += wc;
      fs.writeFileSync(path.join(outDir, `ch-${i}.json`), JSON.stringify({ html: body }), "utf-8");
      chapters.push({ index: i, title, wordCount: wc, estimatedMinutes: Math.max(1, Math.round(wc / 250)) });
      await new Promise(r => setTimeout(r, 200));
    }
    fs.writeFileSync(path.join(outDir, "meta.json"), JSON.stringify({
      bookId: book.id, title: book.title, author: book.author,
      chapterCount: chapters.length, totalWordCount: totalWords,
      totalMinutes: Math.round(totalWords / 250), chapters
    }, null, 2), "utf-8");
    console.log(`    ✓ ${chapters.length} chapters, ${totalWords} words`);
    await new Promise(r => setTimeout(r, 1000));
  }
}

downloadMore();
