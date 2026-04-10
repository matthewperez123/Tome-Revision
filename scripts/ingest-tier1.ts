#!/usr/bin/env npx tsx
/**
 * ingest-tier1.ts — Downloads Tier 1 + Tier 2 canonical works from Standard Ebooks
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "public/content");

interface BookDL {
  id: string;
  title: string;
  author: string;
  repo: string;
}

const TIER1: BookDL[] = [
  { id: "the-maltese-falcon", title: "The Maltese Falcon", author: "Dashiell Hammett", repo: "dashiell-hammett_the-maltese-falcon" },
  { id: "as-i-lay-dying", title: "As I Lay Dying", author: "William Faulkner", repo: "william-faulkner_as-i-lay-dying" },
  { id: "the-magic-mountain", title: "The Magic Mountain", author: "Thomas Mann", repo: "thomas-mann_the-magic-mountain_h-t-lowe-porter" },
  { id: "the-castle", title: "The Castle", author: "Franz Kafka", repo: "franz-kafka_the-castle_willa-muir_edwin-muir" },
  { id: "demian", title: "Demian", author: "Hermann Hesse", repo: "hermann-hesse_demian_n-h-priday" },
  { id: "the-house-of-the-dead", title: "The House of the Dead", author: "Fyodor Dostoevsky", repo: "fyodor-dostoevsky_the-house-of-the-dead_constance-garnett" },
  { id: "sir-gawain-and-the-green-knight", title: "Sir Gawain and the Green Knight", author: "Anonymous", repo: "anonymous_sir-gawain-and-the-green-knight_s-o-andrew" },
  { id: "vile-bodies", title: "Vile Bodies", author: "Evelyn Waugh", repo: "evelyn-waugh_vile-bodies" },
  { id: "the-counterfeiters", title: "The Counterfeiters", author: "André Gide", repo: "andre-gide_the-counterfeiters_dorothy-bussy" },
  { id: "the-lusiads", title: "The Lusiads", author: "Luís de Camões", repo: "luis-de-camoes_the-lusiads_richard-f-burton" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function countWords(html: string): number {
  return html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
}

function cleanHtml(html: string): string {
  return html
    .replace(/\s*epub:type="[^"]*"/g, "")
    .replace(/\s*xml:lang="[^"]*"/g, "")
    .replace(/\s*xmlns:[a-z]+="[^"]*"/g, "")
    .replace(/<i>/g, "<em>").replace(/<\/i>/g, "</em>")
    .replace(/<b>/g, "<strong>").replace(/<\/b>/g, "</strong>");
}

async function fetchGH(repo: string, file: string): Promise<string | null> {
  const url = `https://raw.githubusercontent.com/standardebooks/${repo}/master/${file}`;
  try { const r = await fetch(url); return r.ok ? await r.text() : null; }
  catch { return null; }
}

function extractTitle(xhtml: string): string {
  const m = xhtml.match(/<title>([^<]+)<\/title>/);
  if (m) return m[1].trim();
  const h = xhtml.match(/<h[12][^>]*>([^<]+)<\/h[12]>/);
  if (h) return h[1].trim();
  return "Untitled";
}

function extractBody(xhtml: string): string {
  const m = xhtml.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  return cleanHtml(m ? m[1].trim() : xhtml);
}

async function downloadBook(book: BookDL): Promise<boolean> {
  const outDir = path.join(CONTENT_DIR, book.id);
  if (fs.existsSync(path.join(outDir, "meta.json"))) {
    console.log(`  SKIP: ${book.id} (exists)`);
    return false;
  }

  console.log(`\n  Downloading: ${book.title} by ${book.author}`);
  const opf = await fetchGH(book.repo, "src/epub/content.opf");
  if (!opf) { console.log(`    FAIL: No content.opf`); return false; }

  // Parse manifest
  const idToFile = new Map<string, string>();
  for (const m of opf.matchAll(/<item[^>]*\bid="([^"]+)"[^>]*href="text\/([^"]+)"[^>]*\/?>/g)) idToFile.set(m[1], m[2]);
  for (const m of opf.matchAll(/<item[^>]*href="text\/([^"]+)"[^>]*\bid="([^"]+)"[^>]*\/?>/g)) idToFile.set(m[2], m[1]);

  const spine = [...opf.matchAll(/idref="([^"]+)"/g)];
  const skip = new Set(["titlepage.xhtml","imprint.xhtml","colophon.xhtml","uncopyright.xhtml","loi.xhtml","endnotes.xhtml","halftitlepage.xhtml"]);

  const files: string[] = [];
  for (const s of spine) {
    const f = idToFile.get(s[1]);
    if (f && !skip.has(f)) files.push(f);
  }
  if (files.length === 0) {
    for (const [,f] of idToFile) { if (!skip.has(f)) files.push(f); }
    files.sort();
  }
  if (files.length === 0) { console.log(`    FAIL: No chapters`); return false; }

  fs.mkdirSync(outDir, { recursive: true });
  const chapters: Array<{ index: number; title: string; wordCount: number; estimatedMinutes: number }> = [];
  let totalWords = 0;

  for (let i = 0; i < files.length; i++) {
    const xhtml = await fetchGH(book.repo, `src/epub/text/${files[i]}`);
    if (!xhtml) continue;
    const title = extractTitle(xhtml);
    const body = extractBody(xhtml);
    const wc = countWords(body);
    totalWords += wc;
    fs.writeFileSync(path.join(outDir, `ch-${i}.json`), JSON.stringify({ html: body }));
    chapters.push({ index: i, title, wordCount: wc, estimatedMinutes: Math.max(1, Math.round(wc / 250)) });
    if (i % 20 === 0) process.stdout.write(`    ${i}/${files.length}...`);
    await new Promise(r => setTimeout(r, 150));
  }

  fs.writeFileSync(path.join(outDir, "meta.json"), JSON.stringify({
    bookId: book.id, title: book.title, author: book.author,
    chapterCount: chapters.length, totalWordCount: totalWords,
    totalMinutes: Math.round(totalWords / 250), chapters
  }, null, 2));
  console.log(`\n    ✓ ${chapters.length} chapters, ${totalWords.toLocaleString()} words`);
  return true;
}

async function main() {
  let downloaded = 0;
  for (const book of TIER1) {
    if (await downloadBook(book)) downloaded++;
    await new Promise(r => setTimeout(r, 500));
  }
  console.log(`\n  Downloaded ${downloaded} Tier 1 books`);
}

main();
