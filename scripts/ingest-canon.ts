/**
 * Tome — Canon ingestion (filesystem/static layer), worklist-driven.
 *
 * Reuses the proven Standard Ebooks transform from ingest-se-books.ts, but:
 *  - sources each book's repo from its `standardEbooksUrl` in src/data/books.ts
 *  - downloads the codeload tarball (no GitHub API rate limit, no token needed)
 *  - reads reading order from the OPF <spine> (most correct), skipping boilerplate
 *  - writes public/content/<id>/{ch-N.json,meta.json} and appends chapters.ts via
 *    a CHAPTERS.push(...) block at end-of-file (robust to appended code).
 *
 * Usage:
 *   npx tsx scripts/ingest-canon.ts <bookId> [<bookId> ...]
 *   npx tsx scripts/ingest-canon.ts --dry <bookId>     # parse only, write nothing
 */
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import { BOOKS } from "../src/data/books";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "public", "content");
const CHAPTERS_TS = path.join(ROOT, "src", "data", "chapters.ts");
const CACHE = path.join(ROOT, ".cache", "se");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

// ── SE repo derivation ─────────────────────────────────────────────
function repoFromUrl(url: string): string | null {
  const m = url.match(/\/ebooks\/(.+?)\/?$/);
  if (!m) return null;
  return m[1].replace(/\//g, "_");
}

// ── transform (verbatim from ingest-se-books.ts) ───────────────────
function countWords(html: string): number {
  return html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
}
function estimateMinutes(wordCount: number): number {
  return Math.ceil(wordCount / 250);
}
function parseChapterXhtml(xhtml: string): string {
  const $ = cheerio.load(xhtml, { xml: true });
  $("head").remove();
  $("nav").remove();
  $("header").remove();
  $("footer").remove();
  let content = "";
  const sections = $("body > section");
  if (sections.length > 0) {
    const parts: string[] = [];
    sections.each((_, el) => parts.push($.html(el) || ""));
    content = parts.join("\n");
  } else {
    content = $("body").html() || "";
  }
  content = content
    .replace(/\s*epub:type="[^"]*"/g, "")
    .replace(/\s*xml:lang="[^"]*"/g, "")
    .replace(/\s*xmlns(?::[a-z]+)?="[^"]*"/g, "")
    .replace(/\s*lang="[^"]*"/g, "")
    .replace(/\s*id="[^"]*"/g, "")
    .replace(/\s*class="[^"]*"/g, "")
    .replace(/\s*role="[^"]*"/g, "")
    .replace(/\s*data-[a-z-]+="[^"]*"/g, "")
    .replace(/<\/?abbr[^>]*>/g, "")
    .replace(/<i(\s|>)/g, "<em$1")
    .replace(/<\/i>/g, "</em>")
    .replace(/<b(\s|>)/g, "<strong$1")
    .replace(/<\/b>/g, "</strong>")
    .replace(/\n\s*\n/g, "\n")
    .trim();
  return content;
}

const SKIP_FILES = new Set([
  "colophon.xhtml", "imprint.xhtml", "titlepage.xhtml", "halftitlepage.xhtml",
  "halftitle.xhtml", "uncopyright.xhtml", "endnotes.xhtml", "loi.xhtml",
  "copyright.xhtml", "dedication.xhtml", "introduction.xhtml", "appendix.xhtml",
  "afterword.xhtml",
]);
const isBoilerplate = (basename: string) => SKIP_FILES.has(basename);

// ── tarball fetch + extract ────────────────────────────────────────
function downloadAndExtract(repo: string): string {
  fs.mkdirSync(CACHE, { recursive: true });
  const tgz = path.join(CACHE, `${repo}.tgz`);
  const outDir = path.join(CACHE, `${repo}-master`);
  if (fs.existsSync(outDir)) return outDir;
  if (!fs.existsSync(tgz)) {
    const auth = GITHUB_TOKEN ? `-H "Authorization: Bearer ${GITHUB_TOKEN}"` : "";
    execSync(
      `curl -fsSL ${auth} "https://codeload.github.com/standardebooks/${repo}/tar.gz/refs/heads/master" -o "${tgz}"`,
      { stdio: "pipe" },
    );
  }
  execSync(`tar xzf "${tgz}" -C "${CACHE}"`, { stdio: "pipe" });
  if (!fs.existsSync(outDir)) {
    // fallback: find extracted dir starting with repo
    const found = fs.readdirSync(CACHE).find((d) => d.startsWith(repo) && fs.statSync(path.join(CACHE, d)).isDirectory());
    if (found) return path.join(CACHE, found);
    throw new Error(`extracted dir not found for ${repo}`);
  }
  return outDir;
}

// ── OPF spine + TOC ────────────────────────────────────────────────
function spineHrefs(epubDir: string): string[] {
  const opf = fs.readFileSync(path.join(epubDir, "src/epub/content.opf"), "utf8");
  const $ = cheerio.load(opf, { xml: true });
  const manifest = new Map<string, string>();
  $("manifest item").each((_, el) => {
    const id = $(el).attr("id");
    const href = $(el).attr("href");
    if (id && href) manifest.set(id, href);
  });
  const order: string[] = [];
  $("spine itemref").each((_, el) => {
    const idref = $(el).attr("idref");
    const href = idref ? manifest.get(idref) : undefined;
    if (href && href.endsWith(".xhtml")) order.push(href); // e.g. "text/chapter-1.xhtml"
  });
  return order;
}
function tocTitles(epubDir: string): Map<string, string> {
  const map = new Map<string, string>();
  const tocPath = path.join(epubDir, "src/epub/toc.xhtml");
  if (!fs.existsSync(tocPath)) return map;
  const $ = cheerio.load(fs.readFileSync(tocPath, "utf8"), { xml: true });
  const navToc = $('nav[epub\\:type="toc"]');
  const container = navToc.length > 0 ? navToc : $("nav");
  container.find("a").each((_, el) => {
    const hrefRaw = $(el).attr("href") || "";
    const title = $(el).text().trim().replace(/\s+/g, " ");
    if (!hrefRaw || !title) return;
    const base = path.basename(hrefRaw.split("#")[0]);
    if (!map.has(base)) map.set(base, title);
  });
  return map;
}
function deriveTitle(basename: string): string {
  return basename.replace(/\.xhtml$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface ChapterData {
  bookId: string; chapterIndex: number; title: string;
  wordCount: number; estimatedMinutes: number; html: string;
}

function ingestBook(bookId: string, title: string, author: string, repo: string, dry: boolean): ChapterData[] {
  const bookDir = path.join(CONTENT_DIR, bookId);
  if (fs.existsSync(path.join(bookDir, "meta.json"))) {
    console.log(`  SKIP: ${bookId} already has meta.json`);
    return [];
  }
  const epubDir = downloadAndExtract(repo);
  const titles = tocTitles(epubDir);
  const spine = spineHrefs(epubDir);
  const files = spine.filter((h) => !isBoilerplate(path.basename(h)));
  console.log(`  spine=${spine.length}, after boilerplate skip=${files.length}`);
  if (files.length === 0) throw new Error(`no content files in spine for ${bookId}`);

  const chapters: ChapterData[] = [];
  for (let i = 0; i < files.length; i++) {
    const href = files[i];
    const base = path.basename(href);
    const xhtml = fs.readFileSync(path.join(epubDir, "src/epub", href), "utf8");
    const html = parseChapterXhtml(xhtml);
    const wordCount = countWords(html);
    const chTitle = titles.get(base) || deriveTitle(base);
    chapters.push({ bookId, chapterIndex: i, title: chTitle, wordCount, estimatedMinutes: estimateMinutes(wordCount), html });
  }

  if (dry) {
    console.log(`  [dry] ${chapters.length} chapters: ${chapters.map((c) => `${c.chapterIndex}:${c.title}`).slice(0, 12).join(" | ")}${chapters.length > 12 ? " …" : ""}`);
    return chapters;
  }

  fs.mkdirSync(bookDir, { recursive: true });
  for (const ch of chapters) {
    fs.writeFileSync(path.join(bookDir, `ch-${ch.chapterIndex}.json`), JSON.stringify(ch));
  }
  const totalWordCount = chapters.reduce((s, c) => s + c.wordCount, 0);
  const totalMinutes = chapters.reduce((s, c) => s + c.estimatedMinutes, 0);
  fs.writeFileSync(path.join(bookDir, "meta.json"), JSON.stringify({
    bookId, title, author, chapterCount: chapters.length, totalWordCount, totalMinutes,
    chapters: chapters.map((c) => ({ index: c.chapterIndex, title: c.title, wordCount: c.wordCount, estimatedMinutes: c.estimatedMinutes })),
  }, null, 2));
  console.log(`  => ${chapters.length} chapters, ${totalWordCount} words, ${totalMinutes} min`);
  return chapters;
}

function appendChaptersTs(bookId: string, title: string, author: string, chapters: ChapterData[]): void {
  const existing = fs.readFileSync(CHAPTERS_TS, "utf8");
  if (existing.includes(`bookId: "${bookId}"`)) {
    console.log(`  chapters.ts already has ${bookId}`);
    return;
  }
  const objs = chapters.map((ch) =>
    `  {\n    id: "${bookId}-ch-${ch.chapterIndex}",\n    bookId: "${bookId}",\n    number: ${ch.chapterIndex},\n    title: ${JSON.stringify(ch.title)},\n    wordCount: ${ch.wordCount},\n    estimatedMinutes: ${ch.estimatedMinutes},\n    summary: "",\n    quizAvailable: false,\n  },`,
  ).join("\n");
  const block = `\n\n// -- ${title} (${author}) [ingest-canon] --\nCHAPTERS.push(\n${objs}\n)\n`;
  fs.writeFileSync(CHAPTERS_TS, existing.replace(/\s*$/, "") + "\n" + block);
  console.log(`  appended ${chapters.length} entries to chapters.ts`);
}

async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes("--dry");
  const ids = args.filter((a) => !a.startsWith("--"));
  if (ids.length === 0) {
    console.error("usage: tsx scripts/ingest-canon.ts [--dry] <bookId> [<bookId> ...]");
    process.exit(1);
  }
  let ok = 0, skip = 0, err = 0;
  for (const id of ids) {
    const book = BOOKS.find((b) => b.id === id);
    console.log(`\n[${id}]`);
    if (!book) { console.error(`  ERROR: no BOOKS entry for ${id}`); err++; continue; }
    if (!book.standardEbooksUrl) { console.error(`  ERROR: no standardEbooksUrl`); err++; continue; }
    const repo = repoFromUrl(book.standardEbooksUrl);
    if (!repo) { console.error(`  ERROR: cannot derive repo from ${book.standardEbooksUrl}`); err++; continue; }
    console.log(`  repo=${repo}`);
    try {
      const chapters = ingestBook(id, book.title, book.author, repo, dry);
      if (chapters.length > 0 && !dry) { appendChaptersTs(id, book.title, book.author, chapters); ok++; }
      else if (dry) ok++;
      else skip++;
    } catch (e: any) {
      console.error(`  ERROR: ${e.message}`);
      err++;
    }
  }
  console.log(`\n=== done: ok=${ok} skip=${skip} err=${err} ===`);
}
main().catch((e) => { console.error("fatal:", e); process.exit(1); });
