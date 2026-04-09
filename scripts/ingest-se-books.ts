/**
 * Tome — Standard Ebooks GitHub Ingestion Script
 *
 * Downloads and parses 10 books from Standard Ebooks GitHub repos
 * into the Tome app format (meta.json + ch-N.json files).
 *
 * Also appends TomeChapter entries to src/data/chapters.ts.
 *
 * Usage: npx tsx scripts/ingest-se-books.ts
 */

import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

// ── Configuration ──────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "public", "content");
const CHAPTERS_TS = path.join(ROOT, "src", "data", "chapters.ts");
const RATE_LIMIT_MS = 2200; // ms between GitHub API calls (generous to avoid 403s)

interface BookConfig {
  bookId: string;
  title: string;
  author: string;
  repo: string; // org/repo fragment after "standardebooks/"
  /**
   * For omnibus repos: list of exact filenames to fetch (in reading order).
   * If set, we skip TOC-based file discovery entirely.
   */
  explicitFiles?: string[];
  /**
   * For omnibus repos: regex to match TOC <a href="..."> for this work.
   * Applied AFTER stripping the "text/" prefix from href.
   */
  tocFilter?: RegExp;
  /**
   * Allowlist regex for filenames (applied to directory listing).
   * Files not matching this are skipped.
   */
  fileAllowlist?: RegExp;
}

const BOOKS: BookConfig[] = [
  // ── Plato Dialogues (omnibus) ──────────────────────────────────────────────
  {
    bookId: "the-republic",
    title: "The Republic",
    author: "Plato",
    repo: "plato_dialogues_benjamin-jowett",
    // The Republic is a single file in this edition
    explicitFiles: ["republic.xhtml"],
  },
  {
    bookId: "symposium",
    title: "The Symposium",
    author: "Plato",
    repo: "plato_dialogues_benjamin-jowett",
    explicitFiles: ["symposium.xhtml"],
  },
  {
    bookId: "apology",
    title: "The Apology",
    author: "Plato",
    repo: "plato_dialogues_benjamin-jowett",
    explicitFiles: ["apology.xhtml"],
  },

  // ── Standalone works ───────────────────────────────────────────────────────
  {
    bookId: "the-histories",
    title: "The Histories",
    author: "Herodotus",
    repo: "herodotus_histories_g-c-macaulay",
    fileAllowlist: /^(preface|book-\d+)\.xhtml$/,
  },
  {
    bookId: "de-bello-gallico",
    title: "Commentaries on the Gallic War",
    author: "Julius Caesar",
    repo: "julius-caesar_commentaries-on-the-gallic-war_w-a-mcdevitte_w-s-bohn",
    fileAllowlist: /^chapter-\d+\.xhtml$/,
  },

  // ── Descartes (omnibus) ────────────────────────────────────────────────────
  {
    bookId: "discourse-on-method",
    title: "Discourse on the Method",
    author: "Rene Descartes",
    repo: "rene-descartes_philosophical-works_john-veitch",
    explicitFiles: ["discourse-on-the-method.xhtml"],
  },

  // ── Chekhov ────────────────────────────────────────────────────────────────
  {
    bookId: "the-cherry-orchard",
    title: "The Cherry Orchard",
    author: "Anton Chekhov",
    repo: "anton-chekhov_the-cherry-orchard_constance-garnett",
    fileAllowlist: /^(dramatis-personae|act-\d+)\.xhtml$/,
  },

  // ── Replacements for repos that don't exist on SE ──────────────────────────
  // (The Persians, The Metamorphosis, The Trial are not on Standard Ebooks)

  {
    bookId: "the-castle",
    title: "The Castle",
    author: "Franz Kafka",
    repo: "franz-kafka_the-castle_willa-muir_edwin-muir",
    fileAllowlist: /^chapter-\d+\.xhtml$/,
  },
  {
    bookId: "on-the-shortness-of-life",
    title: "On the Shortness of Life",
    author: "Seneca",
    repo: "seneca_dialogues_aubrey-stewart",
    explicitFiles: ["on-the-shortness-of-life.xhtml"],
  },
  {
    bookId: "poor-folk",
    title: "Poor Folk",
    author: "Fyodor Dostoevsky",
    repo: "fyodor-dostoevsky_poor-folk_c-j-hogarth",
    // Explicit list to avoid API directory listing (rate limits)
    explicitFiles: Array.from({ length: 55 }, (_, i) => `chapter-${i + 1}.xhtml`),
  },
];

// ── Utilities ──────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

function estimateMinutes(wordCount: number): number {
  return Math.ceil(wordCount / 250);
}

// ── GitHub API Helpers ─────────────────────────────────────────────────────────

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const ghHeaders: Record<string, string> = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "Tome-Ingest-Script/1.0",
};
if (GITHUB_TOKEN) {
  ghHeaders["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
}

async function ghFetch(url: string): Promise<any> {
  await sleep(RATE_LIMIT_MS);
  const resp = await fetch(url, { headers: ghHeaders });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(
      `GitHub API ${resp.status} for ${url}: ${body.slice(0, 200)}`
    );
  }
  return resp.json();
}

/**
 * Fetch raw file content using raw.githubusercontent.com (not API — no rate limit).
 * @param repo - e.g. "plato_dialogues_benjamin-jowett"
 * @param filePath - e.g. "src/epub/text/republic.xhtml"
 */
async function fetchRawFile(repo: string, filePath: string): Promise<string> {
  await sleep(500); // be polite but no API rate limit
  const url = `https://raw.githubusercontent.com/standardebooks/${repo}/master/${filePath}`;
  const resp = await fetch(url, {
    headers: { "User-Agent": "Tome-Ingest-Script/1.0" },
  });
  if (!resp.ok) {
    throw new Error(`Raw fetch ${resp.status} for ${url}`);
  }
  return resp.text();
}

// ── TOC Parsing ────────────────────────────────────────────────────────────────

interface TocEntry {
  /** filename only, e.g. "book-1.xhtml" (text/ prefix stripped, fragment stripped) */
  href: string;
  title: string;
}

/**
 * Parse the SE toc.xhtml to extract chapter order and titles.
 * Returns entries with href = bare filename (no "text/" prefix, no fragment).
 */
function parseToc(tocXhtml: string, _book: BookConfig): TocEntry[] {
  const $ = cheerio.load(tocXhtml, { xml: true });
  const raw: TocEntry[] = [];

  // Collect every <a> in the toc <nav>
  const navToc = $('nav[epub\\:type="toc"]');
  const container = navToc.length > 0 ? navToc : $("nav");

  container.find("a").each((_, el) => {
    const hrefRaw = $(el).attr("href") || "";
    const title = $(el).text().trim();
    if (!hrefRaw || !title) return;
    raw.push({ href: hrefRaw, title });
  });

  // Normalize: strip "text/" prefix and fragment, deduplicate by filename
  const seen = new Set<string>();
  const entries: TocEntry[] = [];
  for (const r of raw) {
    let h = r.href.replace(/^\.\//, "").replace(/^text\//, "");
    h = h.split("#")[0];
    if (!h || seen.has(h)) continue;
    seen.add(h);
    entries.push({ href: h, title: r.title });
  }
  return entries;
}

// ── XHTML Parsing ──────────────────────────────────────────────────────────────

function parseChapterXhtml(xhtml: string): string {
  const $ = cheerio.load(xhtml, { xml: true });

  // Remove structural / non-content elements
  $("head").remove();
  $("nav").remove();
  $("header").remove();
  $("footer").remove();

  // Get body content
  let content = "";
  const sections = $("body > section");
  if (sections.length > 0) {
    const parts: string[] = [];
    sections.each((_, el) => {
      parts.push($.html(el) || "");
    });
    content = parts.join("\n");
  } else {
    content = $("body").html() || "";
  }

  // Clean SE-specific attributes
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

// ── Boilerplate Skip ───────────────────────────────────────────────────────────

const SKIP_FILES = new Set([
  "colophon.xhtml",
  "imprint.xhtml",
  "titlepage.xhtml",
  "halftitlepage.xhtml",
  "uncopyright.xhtml",
  "endnotes.xhtml",
  "loi.xhtml",
  "copyright.xhtml",
  "dedication.xhtml",
  "introduction.xhtml",
  "appendix.xhtml",
  "afterword.xhtml",
]);

function isBoilerplate(filename: string): boolean {
  return SKIP_FILES.has(filename);
}

// ── Main Ingestion Logic ───────────────────────────────────────────────────────

interface ChapterData {
  bookId: string;
  chapterIndex: number;
  title: string;
  wordCount: number;
  estimatedMinutes: number;
  html: string;
}

async function ingestBook(book: BookConfig): Promise<ChapterData[]> {
  const bookDir = path.join(CONTENT_DIR, book.bookId);

  // Idempotency
  if (fs.existsSync(path.join(bookDir, "meta.json"))) {
    console.log(`  SKIP: ${book.bookId} already has meta.json`);
    return [];
  }

  const repoBase = `standardebooks/${book.repo}`;

  // ── Determine which files to fetch and in what order ──

  let filesToFetch: { name: string; title?: string }[] = [];

  if (book.explicitFiles) {
    // Explicit file list — use directly
    filesToFetch = book.explicitFiles.map((f) => ({ name: f }));
    console.log(
      `  Using explicit file list: ${filesToFetch.map((f) => f.name).join(", ")}`
    );
  } else {
    // Fetch TOC for reading order & titles
    console.log(`  Fetching TOC...`);
    let tocEntries: TocEntry[] = [];
    try {
      const tocXhtml = await fetchRawFile(book.repo, "src/epub/toc.xhtml");
      tocEntries = parseToc(tocXhtml, book);
      console.log(`  TOC has ${tocEntries.length} entries`);
    } catch (err: any) {
      console.log(`  No TOC found: ${err.message}`);
    }

    // Fetch directory listing
    console.log(`  Fetching file listing...`);
    const dirFiles: Array<{ name: string }> = await ghFetch(
      `https://api.github.com/repos/${repoBase}/contents/src/epub/text`
    );
    const availableFiles = new Set(dirFiles.map((f) => f.name));

    if (book.fileAllowlist) {
      // Use allowlist to filter directory listing, sort by TOC order
      const allowed = dirFiles
        .filter((f) => book.fileAllowlist!.test(f.name))
        .map((f) => f.name);

      // Sort by TOC order if available
      const tocOrder = new Map(tocEntries.map((e, i) => [e.href, i]));
      allowed.sort((a, b) => {
        const ai = tocOrder.get(a) ?? 9999;
        const bi = tocOrder.get(b) ?? 9999;
        if (ai !== bi) return ai - bi;
        return a.localeCompare(b, undefined, { numeric: true });
      });

      filesToFetch = allowed.map((name) => {
        const toc = tocEntries.find((e) => e.href === name);
        return { name, title: toc?.title };
      });
    } else if (tocEntries.length > 0) {
      // Use TOC entries, filtering out boilerplate and missing files
      filesToFetch = tocEntries
        .filter((e) => !isBoilerplate(e.href) && availableFiles.has(e.href))
        .map((e) => ({ name: e.href, title: e.title }));
    } else {
      // No TOC, no allowlist: use all non-boilerplate xhtml files
      filesToFetch = dirFiles
        .filter((f) => f.name.endsWith(".xhtml") && !isBoilerplate(f.name))
        .sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true })
        )
        .map((f) => ({ name: f.name }));
    }
  }

  console.log(
    `  Will fetch ${filesToFetch.length} files: ${filesToFetch.map((f) => f.name).join(", ")}`
  );

  if (filesToFetch.length === 0) {
    console.log(`  WARNING: No chapter files found for ${book.bookId}`);
    return [];
  }

  // ── Fetch TOC again if we need titles for explicit files ──
  let tocEntries: TocEntry[] = [];
  if (book.explicitFiles) {
    try {
      const tocXhtml = await fetchRawFile(book.repo, "src/epub/toc.xhtml");
      tocEntries = parseToc(tocXhtml, book);
    } catch {
      // ok — we'll derive titles from filenames
    }
  }

  // Create output directory
  fs.mkdirSync(bookDir, { recursive: true });

  // ── Fetch and parse each file ──
  const chapters: ChapterData[] = [];

  for (let i = 0; i < filesToFetch.length; i++) {
    const { name, title: presetTitle } = filesToFetch[i];
    console.log(`  Fetching ${name}...`);

    const xhtml = await fetchRawFile(book.repo, `src/epub/text/${name}`);
    const html = parseChapterXhtml(xhtml);
    const wordCount = countWords(html);
    const minutes = estimateMinutes(wordCount);

    // Determine title
    let title = presetTitle || "";
    if (!title) {
      const tocEntry = tocEntries.find((e) => e.href === name);
      if (tocEntry) {
        title = tocEntry.title;
      } else {
        // Derive from filename
        title = name
          .replace(/\.xhtml$/, "")
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }

    const chapterData: ChapterData = {
      bookId: book.bookId,
      chapterIndex: i,
      title,
      wordCount,
      estimatedMinutes: minutes,
      html,
    };
    chapters.push(chapterData);

    // Write chapter file
    fs.writeFileSync(
      path.join(bookDir, `ch-${i}.json`),
      JSON.stringify(chapterData)
    );
    console.log(`    ch-${i}.json: "${title}" (${wordCount} words, ${minutes} min)`);
  }

  // ── Write meta.json ──
  const totalWordCount = chapters.reduce((sum, ch) => sum + ch.wordCount, 0);
  const totalMinutes = chapters.reduce(
    (sum, ch) => sum + ch.estimatedMinutes,
    0
  );

  const meta = {
    bookId: book.bookId,
    title: book.title,
    author: book.author,
    chapterCount: chapters.length,
    totalWordCount,
    totalMinutes,
    chapters: chapters.map((ch) => ({
      index: ch.chapterIndex,
      title: ch.title,
      wordCount: ch.wordCount,
      estimatedMinutes: ch.estimatedMinutes,
    })),
  };

  fs.writeFileSync(
    path.join(bookDir, "meta.json"),
    JSON.stringify(meta, null, 2)
  );
  console.log(
    `  => meta.json: ${chapters.length} chapters, ${totalWordCount} words, ${totalMinutes} min`
  );

  return chapters;
}

// ── Append to chapters.ts ──────────────────────────────────────────────────────

function appendChaptersTs(book: BookConfig, chapters: ChapterData[]): void {
  const existing = fs.readFileSync(CHAPTERS_TS, "utf-8");
  if (existing.includes(`bookId: "${book.bookId}"`)) {
    console.log(`  chapters.ts already has entries for ${book.bookId}`);
    return;
  }

  const lines: string[] = [];
  lines.push("");
  lines.push(
    `  // -- ${book.title} (${book.author}) ` +
      "-".repeat(Math.max(0, 60 - book.title.length - book.author.length))
  );
  lines.push("");

  for (const ch of chapters) {
    lines.push("  {");
    lines.push(`    id: "${book.bookId}-ch-${ch.chapterIndex}",`);
    lines.push(`    bookId: "${book.bookId}",`);
    lines.push(`    number: ${ch.chapterIndex},`);
    lines.push(`    title: ${JSON.stringify(ch.title)},`);
    lines.push(`    wordCount: ${ch.wordCount},`);
    lines.push(`    estimatedMinutes: ${ch.estimatedMinutes},`);
    lines.push(`    summary: "",`);
    lines.push(`    quizAvailable: false,`);
    lines.push("  },");
  }

  const closingBracket = existing.lastIndexOf("]");
  if (closingBracket === -1) {
    console.error("  ERROR: Could not find closing ] in chapters.ts");
    return;
  }
  const updated =
    existing.slice(0, closingBracket) +
    lines.join("\n") +
    "\n" +
    existing.slice(closingBracket);

  fs.writeFileSync(CHAPTERS_TS, updated);
  console.log(
    `  Appended ${chapters.length} entries to chapters.ts for ${book.bookId}`
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Tome Standard Ebooks Ingestion ===");
  console.log(`Target: ${BOOKS.length} books`);
  console.log(`Output: ${CONTENT_DIR}`);
  console.log("");

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const book of BOOKS) {
    const idx = BOOKS.indexOf(book) + 1;
    console.log(`\n[${idx}/${BOOKS.length}] ${book.title} by ${book.author}`);
    try {
      const chapters = await ingestBook(book);
      if (chapters.length > 0) {
        appendChaptersTs(book, chapters);
        successCount++;
      } else {
        skipCount++;
      }
    } catch (err: any) {
      console.error(`  ERROR: ${err.message}`);
      errorCount++;
    }
  }

  console.log("\n=== Summary ===");
  console.log(`  Success: ${successCount}`);
  console.log(`  Skipped: ${skipCount}`);
  console.log(`  Errors:  ${errorCount}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
