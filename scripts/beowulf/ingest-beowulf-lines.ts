#!/usr/bin/env npx tsx
/**
 * ingest-beowulf-lines.ts
 *
 * Re-ingest Beowulf from Standard Ebooks (John Lesslie Hall, 1892) with
 * line-level markup preserved as `data-beowulf-*` attributes so the reader
 * can anchor, navigate, and enhance per-line.
 *
 * Output: public/content/beowulf/ch-N.json (ch-0 .. ch-44)
 *   - ch-0: Preface
 *   - ch-1: Introduction ("The Story")
 *   - ch-2 .. ch-44: Fitts I .. XLIII
 *
 * Every verse line in the fitt bodies is marked with:
 *   - data-beowulf-fitt    : 1-based fitt number (I..XLIII)
 *   - data-beowulf-line    : 1-based line number WITHIN the fitt
 *   - data-beowulf-poem-line : cumulative 1-based line number across the poem
 *   - data-beowulf-line-mark : present on every 5th line (for reader margin numbers)
 *
 * SE source (2019, John Lesslie Hall, 1892 translation):
 *   https://standardebooks.org/ebooks/anonymous/beowulf/john-lesslie-hall
 *   GitHub repo: standardebooks/anonymous_beowulf_john-lesslie-hall
 */
import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

const ROOT = path.resolve(__dirname, "..", "..");
const OUT_DIR = path.join(ROOT, "public/content/beowulf");
const REPO = "anonymous_beowulf_john-lesslie-hall";

// Spine order of content we want to keep. Front matter (titlepage, imprint,
// halftitle, colophon, uncopyright, endnotes) is omitted; those are SE chrome.
// Preface + introduction + 43 fitts = 45 chapters, matching the existing
// meta.json structure so reader state stays compatible.
const SPINE: Array<{ file: string; kind: "preface" | "introduction" | "fitt"; fittNumber?: number }> = [
  { file: "preface.xhtml", kind: "preface" },
  { file: "introduction.xhtml", kind: "introduction" },
];
for (let f = 1; f <= 43; f++) {
  SPINE.push({ file: `chapter-${f}.xhtml`, kind: "fitt", fittNumber: f });
}

async function fetchGH(file: string): Promise<string | null> {
  const url = `https://raw.githubusercontent.com/standardebooks/${REPO}/master/src/epub/${file}`;
  const r = await fetch(url);
  return r.ok ? await r.text() : null;
}

function countWords(html: string): number {
  return html
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/**
 * Clean SE-specific namespacing/attribute noise but preserve semantic HTML.
 * Preserves `id` attributes (SE uses them for cross-references from the
 * preface and endnotes), `<i>`/`<em>`/`<b>`, and endnote refs.
 */
function cleanAttrs($: cheerio.CheerioAPI): void {
  $("[epub\\:type]").each((_, el) => {
    $(el).removeAttr("epub:type");
  });
  $("[xml\\:lang]").each((_, el) => {
    $(el).removeAttr("xml:lang");
  });
  $("[role]").each((_, el) => {
    // Keep role on sections where it aids semantics; drop on leaf elements.
    const tag = (el as cheerio.Element).tagName?.toLowerCase?.();
    if (tag && tag !== "section" && tag !== "nav") $(el).removeAttr("role");
  });
}

/**
 * Extract the <body> inner HTML and the chapter title.
 */
function parseChapter(xhtml: string): { $body: cheerio.Cheerio<cheerio.AnyNode>; $: cheerio.CheerioAPI; title: string } {
  const $ = cheerio.load(xhtml, { xml: false, xmlMode: false });
  const title =
    $("title").first().text().trim() ||
    $("h1, h2").first().text().trim() ||
    "Untitled";
  cleanAttrs($);
  const $body = $("body");
  return { $body, $, title };
}

/**
 * Transform a fitt chapter: add line-level markup to every <span> that is
 * immediately followed by a <br/> inside a <p>. This is SE's verse convention.
 *
 * Returns the number of verse lines found in this fitt.
 */
function markFittLines(
  $: cheerio.CheerioAPI,
  $body: cheerio.Cheerio<cheerio.AnyNode>,
  fittNumber: number,
  poemLineStart: number
): { lineCount: number; nextPoemLine: number } {
  let fittLine = 0;
  let poemLine = poemLineStart;

  // A verse line is a <span> whose next sibling (skipping whitespace) is a <br>.
  // We don't want to tag <span>s inside footnote refs or inline <i>s, so we
  // target only <span>s that are direct children of a <p> and whose next node
  // is a <br>.
  $body.find("p > span").each((_, spanEl) => {
    const $span = $(spanEl);
    // Skip spans that look like footnote anchors (contain only an <a>)
    if ($span.children("a[epub\\:type='noteref'], a[role='doc-noteref']").length > 0 && $span.text().trim().length < 3) {
      return;
    }
    const next = (spanEl as cheerio.Element).next;
    // cheerio's next is the sibling in document order (may be whitespace text)
    let sibling = next;
    while (sibling && sibling.type === "text" && /^\s*$/.test((sibling as cheerio.Text).data ?? "")) {
      sibling = (sibling as cheerio.AnyNode).next as cheerio.AnyNode;
    }
    if (!sibling || (sibling as cheerio.Element).tagName?.toLowerCase?.() !== "br") {
      return;
    }

    fittLine += 1;
    poemLine += 1;
    $span.attr("data-beowulf-fitt", String(fittNumber));
    $span.attr("data-beowulf-line", String(fittLine));
    $span.attr("data-beowulf-poem-line", String(poemLine));
    if (fittLine % 5 === 0) {
      $span.attr("data-beowulf-line-mark", String(fittLine));
    }
  });

  return { lineCount: fittLine, nextPoemLine: poemLine };
}

/**
 * Tag the <section> root with fitt-level metadata so the reader can query it.
 */
function tagFittSection($: cheerio.CheerioAPI, $body: cheerio.Cheerio<cheerio.AnyNode>, fittNumber: number, lineCount: number): void {
  const $section = $body.find("section").first();
  if ($section.length) {
    $section.attr("data-beowulf-fitt", String(fittNumber));
    $section.attr("data-beowulf-fitt-line-count", String(lineCount));
  }
}

async function run(): Promise<void> {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const chapters: Array<{
    index: number;
    title: string;
    fittNumber?: number;
    lineCount?: number;
    wordCount: number;
    estimatedMinutes: number;
  }> = [];

  let totalWords = 0;
  let totalLines = 0;
  let poemLine = 0;

  for (let i = 0; i < SPINE.length; i++) {
    const entry = SPINE[i];
    process.stdout.write(`  [${i + 1}/${SPINE.length}] ${entry.file}... `);
    const xhtml = await fetchGH(`text/${entry.file}`);
    if (!xhtml) {
      console.log("FAIL (404)");
      continue;
    }

    const { $body, $, title } = parseChapter(xhtml);

    let lineCount = 0;
    if (entry.kind === "fitt" && entry.fittNumber) {
      const result = markFittLines($, $body, entry.fittNumber, poemLine);
      lineCount = result.lineCount;
      poemLine = result.nextPoemLine;
      tagFittSection($, $body, entry.fittNumber, lineCount);
      totalLines += lineCount;
    }

    const bodyHtml = $body.html() ?? "";
    const wc = countWords(bodyHtml);
    totalWords += wc;

    const cleanTitle = title.replace(/\s+/g, " ").trim();

    const payload: Record<string, unknown> = {
      bookId: "beowulf",
      chapterIndex: i,
      title: cleanTitle,
      wordCount: wc,
      estimatedMinutes: Math.max(1, Math.round(wc / 250)),
      html: bodyHtml,
    };
    if (entry.kind === "fitt" && entry.fittNumber) {
      payload.fittNumber = entry.fittNumber;
      payload.lineCount = lineCount;
    }
    if (entry.kind !== "fitt") {
      payload.sectionType = entry.kind;
    }

    fs.writeFileSync(
      path.join(OUT_DIR, `ch-${i}.json`),
      JSON.stringify(payload)
    );

    chapters.push({
      index: i,
      title: cleanTitle,
      fittNumber: entry.fittNumber,
      lineCount: entry.kind === "fitt" ? lineCount : undefined,
      wordCount: wc,
      estimatedMinutes: Math.max(1, Math.round(wc / 250)),
    });

    console.log(`${cleanTitle}  (${wc} words${lineCount ? `, ${lineCount} lines` : ""})`);
    await new Promise((r) => setTimeout(r, 120));
  }

  const meta = {
    bookId: "beowulf",
    title: "Beowulf",
    author: "Anonymous",
    translator: "John Lesslie Hall",
    translationYear: 1892,
    sourceEdition: "Standard Ebooks (2019)",
    sourceUrl: "https://standardebooks.org/ebooks/anonymous/beowulf/john-lesslie-hall",
    verseForm: "alliterative",
    structuralUnits: { primary: "line", secondary: "fitt", count: 43 },
    chapterCount: chapters.length,
    totalWordCount: totalWords,
    totalMinutes: Math.round(totalWords / 250),
    totalLineCount: totalLines,
    chapters: chapters.map((c) => ({
      index: c.index,
      title: c.title,
      fittNumber: c.fittNumber,
      lineCount: c.lineCount,
      wordCount: c.wordCount,
      estimatedMinutes: c.estimatedMinutes,
    })),
  };

  fs.writeFileSync(path.join(OUT_DIR, "meta.json"), JSON.stringify(meta, null, 2));

  console.log(
    `\n  ✓ ${chapters.length} chapters, ${totalWords.toLocaleString()} words, ${totalLines.toLocaleString()} lines of verse`
  );
  console.log(`  Hall numbering: poem-line count = ${totalLines} (expected ≈ 3,182; Hall's edition may differ from Klaeber)`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
