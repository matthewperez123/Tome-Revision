#!/usr/bin/env npx tsx
/**
 * ingest-hamlet.ts — Parse existing Hamlet HTML chapters into structured line-array format
 *
 * Reads public/content/hamlet/ch-*.json (already ingested from Standard Ebooks),
 * parses the table-based drama HTML, and produces:
 *   - content/hamlet/hamlet_act{N}_scene{M}.json (20 scene files)
 *   - content/hamlet/_meta.json (work metadata)
 *   - content/hamlet/toc.json (table of contents)
 *
 * Run: npx tsx scripts/ingest-hamlet.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

const ROOT = path.resolve(__dirname, "..");
const SOURCE_DIR = path.join(ROOT, "public/content/hamlet");
const OUTPUT_DIR = path.join(ROOT, "content/hamlet");

// ── Scene mapping: chapter index → { act, scene } ──────────────────────────

interface SceneMap {
  chapterIndex: number;
  act: number;
  scene: number;
}

const SCENE_MAP: SceneMap[] = [
  { chapterIndex: 2, act: 1, scene: 1 },
  { chapterIndex: 3, act: 1, scene: 2 },
  { chapterIndex: 4, act: 1, scene: 3 },
  { chapterIndex: 5, act: 1, scene: 4 },
  { chapterIndex: 6, act: 1, scene: 5 },
  { chapterIndex: 8, act: 2, scene: 1 },
  { chapterIndex: 9, act: 2, scene: 2 },
  { chapterIndex: 11, act: 3, scene: 1 },
  { chapterIndex: 12, act: 3, scene: 2 },
  { chapterIndex: 13, act: 3, scene: 3 },
  { chapterIndex: 14, act: 3, scene: 4 },
  { chapterIndex: 16, act: 4, scene: 1 },
  { chapterIndex: 17, act: 4, scene: 2 },
  { chapterIndex: 18, act: 4, scene: 3 },
  { chapterIndex: 19, act: 4, scene: 4 },
  { chapterIndex: 20, act: 4, scene: 5 },
  { chapterIndex: 21, act: 4, scene: 6 },
  { chapterIndex: 22, act: 4, scene: 7 },
  { chapterIndex: 24, act: 5, scene: 1 },
  { chapterIndex: 25, act: 5, scene: 2 },
];

// ── Scene location titles (Folger-style) ────────────────────────────────────
// These come from the SE source but we hardcode them as a cross-reference
// since the HTML may or may not include them consistently.

const SCENE_TITLES: Record<string, string> = {
  "1_1": "Elsinore. A platform before the castle",
  "1_2": "A room of state in the castle",
  "1_3": "A room in Polonius' house",
  "1_4": "The platform",
  "1_5": "Another part of the platform",
  "2_1": "A room in Polonius' house",
  "2_2": "A room in the castle",
  "3_1": "A room in the castle",
  "3_2": "A hall in the castle",
  "3_3": "A room in the castle",
  "3_4": "The Queen's closet",
  "4_1": "A room in the castle",
  "4_2": "Another room in the castle",
  "4_3": "Another room in the castle",
  "4_4": "A plain in Denmark",
  "4_5": "Elsinore. A room in the castle",
  "4_6": "Another room in the castle",
  "4_7": "Another room in the castle",
  "5_1": "A churchyard",
  "5_2": "A hall in the castle",
};

// ── Types ───────────────────────────────────────────────────────────────────

interface Line {
  number: number;
  speaker?: string;
  text: string;
}

interface StageDirection {
  after_line: number;
  text: string;
}

interface SectionJSON {
  section_id: string;
  work_id: string;
  sequence: number;
  act: number;
  scene: number;
  scene_title: string;
  line_count: number;
  word_count: number;
  est_read_minutes: number;
  lines: Line[];
  stage_directions: StageDirection[];
  glosses: never[];
  annotations: never[];
  trials: never[];
}

// ── HTML parsing ────────────────────────────────────────────────────────────

/**
 * Normalize speaker names to UPPERCASE consistent format.
 * SE uses title case ("King", "Hamlet"); we want "KING", "HAMLET".
 */
function normalizeSpeaker(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

/**
 * Clean text content: remove BOM, normalize whitespace, trim.
 */
function cleanText(text: string): string {
  return text
    .replace(/\uFEFF/g, "") // BOM
    .replace(/\u00A0/g, " ") // NBSP
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract inline stage directions from text, returning cleaned text and directions.
 */
function extractInlineDirections(
  html: string,
  $: cheerio.CheerioAPI
): { text: string; directions: string[] } {
  const temp = $.load(html, null, false);
  const directions: string[] = [];

  temp("i").each((_, el) => {
    const content = cleanText(temp(el).text());
    if (content) {
      directions.push(content);
    }
    temp(el).remove();
  });

  return {
    text: cleanText(temp.text()),
    directions,
  };
}

/**
 * Intermediate representation for a speech unit before line-numbering.
 */
interface RawUnit {
  kind: "line" | "stage_direction";
  speaker?: string;          // present for kind=line
  text: string;
  isVerse: boolean;          // verse span vs prose
  isFirstOfSpeech: boolean;  // first line of a new speech
  isLastOfSpeech: boolean;   // last line of a speech
}

/**
 * Parse a scene's HTML into structured lines and stage directions.
 *
 * Implements Folger shared-line convention: when one speaker ends a speech
 * with a short half-line and the next speaker begins with a short half-line,
 * both share one line number (they complete a single verse line).
 */
function parseScene(html: string): {
  lines: Line[];
  stageDirections: StageDirection[];
  sceneTitle: string;
} {
  const $ = cheerio.load(html, null, false);
  const units: RawUnit[] = [];
  let sceneTitle = "";

  // Try to extract scene title from the first <p> after the heading
  const firstP = $("section > p").first();
  if (firstP.length) {
    const pText = cleanText(firstP.text());
    if (
      pText &&
      !pText.startsWith("Act") &&
      !pText.startsWith("Scene") &&
      pText.length < 100
    ) {
      sceneTitle = pText.replace(/\.$/, "");
    }
  }

  // ── Pass 1: Extract raw units from table rows ───────────────────────────

  $("table tbody tr").each((_, tr) => {
    const tds = $(tr).find("> td");
    if (tds.length < 2) return;

    const speakerTd = $(tds[0]);
    const contentTd = $(tds[1]);
    const speakerRaw = cleanText(speakerTd.text());
    const speaker = speakerRaw ? normalizeSpeaker(speakerRaw) : "";

    // Pure stage direction row (no speaker)
    if (!speaker) {
      const contentText = cleanText(contentTd.text());
      if (contentText) {
        units.push({ kind: "stage_direction", text: contentText, isVerse: false, isFirstOfSpeech: false, isLastOfSpeech: false });
      }
      return;
    }

    // Spoken content — collect lines for this speech
    const speechLines: { text: string; isVerse: boolean; directions: string[] }[] = [];
    const spans = contentTd.find("> p > span");

    if (spans.length > 0) {
      // Verse: each <span> is one line
      spans.each((_, span) => {
        const spanHtml = $(span).html() || "";
        const { text, directions } = extractInlineDirections(spanHtml, $);
        if (text) {
          speechLines.push({ text, isVerse: true, directions });
        } else if (directions.length > 0) {
          // Span was only a stage direction
          for (const dir of directions) {
            units.push({ kind: "stage_direction", text: dir, isVerse: false, isFirstOfSpeech: false, isLastOfSpeech: false });
          }
        }
      });
    } else {
      // Prose or short line
      const contentHtml = contentTd.html() || "";
      const { text, directions } = extractInlineDirections(contentHtml, $);

      if (text) {
        const words = text.split(/\s+/);
        if (words.length <= 15) {
          speechLines.push({ text, isVerse: false, directions });
        } else {
          // Long prose: split into ~12-word chunks
          const WORDS_PER_LINE = 12;
          for (let i = 0; i < words.length; i += WORDS_PER_LINE) {
            const chunk = words.slice(i, i + WORDS_PER_LINE).join(" ");
            const isLast = i + WORDS_PER_LINE >= words.length;
            speechLines.push({ text: chunk, isVerse: false, directions: isLast ? directions : [] });
          }
        }
      } else if (directions.length > 0) {
        for (const dir of directions) {
          units.push({ kind: "stage_direction", text: dir, isVerse: false, isFirstOfSpeech: false, isLastOfSpeech: false });
        }
      }
    }

    // Emit speech units
    for (let i = 0; i < speechLines.length; i++) {
      const sl = speechLines[i];
      units.push({
        kind: "line",
        speaker,
        text: sl.text,
        isVerse: sl.isVerse,
        isFirstOfSpeech: i === 0,
        isLastOfSpeech: i === speechLines.length - 1,
      });
      // Attach inline directions after the line
      for (const dir of sl.directions) {
        units.push({ kind: "stage_direction", text: dir, isVerse: false, isFirstOfSpeech: false, isLastOfSpeech: false });
      }
    }
  });

  // ── Pass 2: Assign line numbers with shared-line detection ──────────────

  const lines: Line[] = [];
  const stageDirections: StageDirection[] = [];
  let lineNumber = 0;
  let lastWasShared = false; // Prevent chaining: only one share per pair

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];

    if (unit.kind === "stage_direction") {
      stageDirections.push({ after_line: lineNumber, text: unit.text });
      continue;
    }

    // Check if this line shares a line number with the previous line
    // (Folger shared half-line convention).
    // Don't chain: if the previous line already shared, this one starts fresh.
    const shouldShare = !lastWasShared && isSharedHalfLine(units, lines, i);

    if (shouldShare) {
      lines.push({ number: lineNumber, speaker: unit.speaker, text: unit.text });
      lastWasShared = true;
    } else {
      lineNumber++;
      lines.push({ number: lineNumber, speaker: unit.speaker, text: unit.text });
      lastWasShared = false;
    }
  }

  return { lines, stageDirections, sceneTitle };
}

/**
 * Detect whether unit at index `i` is a shared half-line.
 *
 * Conditions:
 * 1. This line is the FIRST of its speech
 * 2. The previous spoken line (skipping stage directions) was the LAST of a different speaker's speech
 * 3. Both are short (≤ 6 words each)
 * 4. Together they approximate one pentameter line (≤ 14 words)
 * 5. At least one of them is verse (or both are short enough to be half-lines)
 */
function isSharedHalfLine(units: RawUnit[], lines: Line[], currentIdx: number): boolean {
  const current = units[currentIdx];
  if (!current.isFirstOfSpeech) return false;

  const currentWords = current.text.split(/\s+/).length;
  if (currentWords > 6) return false; // Half-lines are ≤6 words

  // Find the previous spoken line (skip stage directions)
  let prevLine: Line | undefined;
  let prevUnit: RawUnit | undefined;
  for (let j = currentIdx - 1; j >= 0; j--) {
    if (units[j].kind === "line") {
      prevUnit = units[j];
      prevLine = lines[lines.length - 1]; // Last emitted line
      break;
    }
  }

  if (!prevUnit || !prevLine) return false;
  if (!prevUnit.isLastOfSpeech) return false;
  if (prevUnit.speaker === current.speaker) return false;

  const prevWords = prevUnit.text.split(/\s+/).length;
  if (prevWords > 6) return false; // Half-lines are ≤6 words

  const totalWords = currentWords + prevWords;
  if (totalWords > 13) return false; // Together ≈ one pentameter

  return true;
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const tocEntries: {
    section_id: string;
    sequence: number;
    act: number;
    scene: number;
    scene_title: string;
    line_count: number;
    word_count: number;
    est_read_minutes: number;
  }[] = [];

  let totalWords = 0;
  let totalLines = 0;

  console.log("=== Hamlet Structured Ingestion ===\n");

  for (let i = 0; i < SCENE_MAP.length; i++) {
    const { chapterIndex, act, scene } = SCENE_MAP[i];
    const sequence = i + 1;
    const sectionId = `hamlet_act${act}_scene${scene}`;

    // Read source chapter
    const srcPath = path.join(SOURCE_DIR, `ch-${chapterIndex}.json`);
    if (!fs.existsSync(srcPath)) {
      console.error(`  MISSING: ${srcPath}`);
      continue;
    }

    const srcData = JSON.parse(fs.readFileSync(srcPath, "utf-8"));
    const html = srcData.html;

    // Parse
    const { lines, stageDirections, sceneTitle: extractedTitle } = parseScene(html);

    // Use hardcoded title if extraction failed
    const sceneTitle =
      extractedTitle || SCENE_TITLES[`${act}_${scene}`] || `Act ${act}, Scene ${scene}`;

    const wordCount = lines.reduce(
      (sum, l) => sum + l.text.split(/\s+/).length,
      0
    );
    const estReadMinutes = Math.max(1, Math.round(wordCount / 200));

    const section: SectionJSON = {
      section_id: sectionId,
      work_id: "hamlet",
      sequence,
      act,
      scene,
      scene_title: sceneTitle,
      line_count: lines.length,
      word_count: wordCount,
      est_read_minutes: estReadMinutes,
      lines,
      stage_directions: stageDirections,
      glosses: [],
      annotations: [],
      trials: [],
    };

    // Write section JSON
    const outPath = path.join(OUTPUT_DIR, `${sectionId}.json`);
    fs.writeFileSync(outPath, JSON.stringify(section, null, 2));

    totalWords += wordCount;
    totalLines += lines.length;

    tocEntries.push({
      section_id: sectionId,
      sequence,
      act,
      scene,
      scene_title: sceneTitle,
      line_count: lines.length,
      word_count: wordCount,
      est_read_minutes: estReadMinutes,
    });

    console.log(
      `  ${sectionId}: ${lines.length} lines, ${wordCount} words, ${stageDirections.length} stage dirs`
    );
  }

  // ── Write _meta.json ────────────────────────────────────────────────────

  const meta = {
    work_id: "hamlet",
    title: "Hamlet",
    author: "William Shakespeare",
    source: "Standard Ebooks",
    source_url:
      "https://standardebooks.org/ebooks/william-shakespeare/hamlet",
    language: "en",
    year: 1601,
    genre: "Drama",
    tradition: "English",
    difficulty: "Advanced",
    section_count: SCENE_MAP.length,
    total_lines: totalLines,
    total_words: totalWords,
    est_read_minutes: Math.round(totalWords / 200),
    structural_unit_type: "act_scene",
    cover_met_object_id: null,
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "_meta.json"),
    JSON.stringify(meta, null, 2)
  );

  // ── Write toc.json ──────────────────────────────────────────────────────

  // Build hierarchical TOC with act headers
  const toc: {
    work_id: string;
    entries: (
      | { type: "act"; act: number; title: string }
      | {
          type: "scene";
          section_id: string;
          sequence: number;
          act: number;
          scene: number;
          scene_title: string;
          line_count: number;
          word_count: number;
          est_read_minutes: number;
        }
    )[];
  } = {
    work_id: "hamlet",
    entries: [],
  };

  let currentAct = 0;
  for (const entry of tocEntries) {
    if (entry.act !== currentAct) {
      currentAct = entry.act;
      toc.entries.push({
        type: "act",
        act: currentAct,
        title: `Act ${toRoman(currentAct)}`,
      });
    }
    toc.entries.push({ type: "scene", ...entry });
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "toc.json"),
    JSON.stringify(toc, null, 2)
  );

  // ── Summary ─────────────────────────────────────────────────────────────

  console.log(`\n=== Summary ===`);
  console.log(`  Scenes: ${SCENE_MAP.length}`);
  console.log(`  Total lines: ${totalLines}`);
  console.log(`  Total words: ${totalWords}`);
  console.log(`  Est. reading time: ${Math.round(totalWords / 200)} min`);
  console.log(`  Output: ${OUTPUT_DIR}/`);
}

function toRoman(n: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = [
    "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I",
  ];
  let result = "";
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) {
      result += syms[i];
      n -= vals[i];
    }
  }
  return result;
}

main();
