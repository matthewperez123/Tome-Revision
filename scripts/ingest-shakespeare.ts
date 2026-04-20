#!/usr/bin/env npx tsx
/**
 * ingest-shakespeare.ts — Parse pre-ingested Standard Ebooks HTML chapters
 * for ANY Shakespeare play into structured line-array format.
 *
 * Reads public/content/{work}/ch-*.json (already ingested from Standard Ebooks),
 * parses the table-based drama HTML, and produces:
 *   - content/{work}/{work}_act{N}_scene{M}.json (one per scene)
 *   - content/{work}/_meta.json (work metadata with tier_1_sections)
 *   - content/{work}/toc.json (table of contents, act/scene hierarchy)
 *
 * Per-work configuration (scene map, scene titles, metadata) lives in
 * scripts/config/{work}.ts so this script stays work-agnostic.
 *
 * Usage:
 *   npx tsx scripts/ingest-shakespeare.ts --work-id hamlet
 *   npx tsx scripts/ingest-shakespeare.ts --work-id othello
 */

import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";
import { getWorkConfig, type WorkConfig } from "./config/works";

const ROOT = path.resolve(__dirname, "..");

// ── CLI args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const workIdArg = args.find((a, i) => args[i - 1] === "--work-id");
if (!workIdArg) {
  console.error("ERROR: --work-id required (e.g. --work-id othello)");
  process.exit(1);
}

const workConfig = getWorkConfig(workIdArg);
if (!workConfig) {
  console.error(`ERROR: No config registered for work '${workIdArg}'`);
  process.exit(1);
}

const SOURCE_DIR = path.join(ROOT, `public/content/${workConfig.workId}`);
const OUTPUT_DIR = path.join(ROOT, `content/${workConfig.workId}`);

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
  act: number | null;     // null for choric prologues (no act affiliation)
  scene: number | null;   // null for choric sections
  kind: "scene" | "chorus";
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

// ── HTML parsing helpers ────────────────────────────────────────────────────

function normalizeSpeaker(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().toUpperCase();
}

function cleanText(text: string): string {
  return text
    .replace(/\uFEFF/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Distinguishes stage-direction italics from speech italics (emphasis or
 * foreign-language). Standard Ebooks uses bare `<i>` for both in drama,
 * so we rely on surface cues:
 *   - italic text starting with a known stage verb (Enter, Exit, Aside, etc.)
 *     is a stage direction
 *   - italic text containing non-ASCII accented letters is foreign speech
 *   - everything else defaults to speech (preserves Katherine's French in
 *     Henry V 3.4 / Pistol's 4.4 / the wooing in 5.2)
 */
const STAGE_VERB_RE = /^(Enter|Exit|Exeunt|Aside|Reading|Reads|Singing|Sings|Kneeling|Kneels|Rising|Rises|Whispers|Whispering|Flourish|Alarum|Alarums|Sound|Retreat|Trumpet|Trumpets|Drum|Drums|Within|Aloud|Apart|Pointing|Offering|Taking|Showing|Giving|Drawing|Falls|Falling|Dies|Stabs|Kisses|Strikes|Embraces|Embrace|Draws|Throws|Puts|Takes|Advances|Retires|Speaks|Rumour|Music|Bell|Storm|Thunder|Lightning|Shout|Shouts|Knocking|Knocks|Points|Aside to|To\s+(?:[A-Z]|him|her|them)|Re-enter|Exit\.|Aside\.)\b/;

// Extra stage verbs only recognised when the work opts into
// strictContinuationRows. Sennet is the main Julius Caesar case — SE tags
// "Sennet. Exeunt…" inline as italic, but `Sennet` (a trumpet flourish) isn't
// in the base list. Kept separate so prior plays retain original numbering.
const STRICT_STAGE_VERB_RE = /^(Sennet)\b/;

// Stage-action verbs that may appear after a bolded name at the start of a
// stage direction (e.g. "Casca first, then the other Conspirators and Marcus
// Brutus stab Caesar" in Julius Caesar 3.1). Matched anywhere in the italic
// text as a fallback when the opening token isn't in STAGE_VERB_RE.
const STAGE_ACTION_RE = /\b(stab(?:s|bed|bing)?|dies|falls?|kill(?:s|ed|ing)?|exit(?:s|eunt)?|exeunt|sennet|flourish|enter(?:s|ing)?)\b/i;

function isStageDirectionItalic(text: string, strict: boolean): boolean {
  const t = text.trim();
  if (!t) return false;
  if (STAGE_VERB_RE.test(t)) return true;
  if (strict && STRICT_STAGE_VERB_RE.test(t)) return true;
  // Non-ASCII letters (é, à, ç, ô, …) strongly indicate foreign speech.
  if (/[\u00C0-\u024F]/.test(t)) return false;
  // Name-first stage directions: Shakespeare stage business occasionally
  // leads with the actor's proper name rather than a stage verb (e.g.
  // "Casca first, then the other Conspirators and Marcus Brutus stab
  // Caesar."). Only enabled when the work opts into strictContinuationRows
  // so prior plays keep their established line numbering.
  if (strict && /^[A-Z][a-z]+/.test(t) && STAGE_ACTION_RE.test(t)) return true;
  // Purely ASCII italic that doesn't match stage-verb list: treat as speech
  // (emphasis, or unaccented French like "madame"). This preserves Katherine's
  // English lesson where Alice's tutorial answers ("hand.", "fingres;") land
  // in italic but are speech, not stage directions.
  return false;
}

function extractInlineDirections(
  html: string,
  $: cheerio.CheerioAPI,
  strict: boolean
): { text: string; directions: string[] } {
  const temp = $.load(html, null, false);
  const directions: string[] = [];

  temp("i").each((_, el) => {
    const content = cleanText(temp(el).text());
    if (!content) { temp(el).remove(); return; }
    if (isStageDirectionItalic(content, strict)) {
      directions.push(content);
      temp(el).remove();
    }
    // Else leave italic content in place as speech.
  });

  return { text: cleanText(temp.text()), directions };
}

interface RawUnit {
  kind: "line" | "stage_direction";
  speaker?: string;
  text: string;
  isVerse: boolean;
  isFirstOfSpeech: boolean;
  isLastOfSpeech: boolean;
}

/**
 * Parse a choric prologue / chorus section.
 *
 * Choric tables differ from scene tables:
 *   - Speaker column may be empty (`<td/>`) OR contain "Chorus"
 *   - The entire passage is one CHORUS speech (all lines share speaker)
 *   - Stage directions appear as `<i>` inline (e.g. "Enter Chorus", "Exit")
 *   - The 14-line sonnet form must be preserved — one <span> per line
 *
 * We handle ch-8 specially: it contains the Act II title AND the chorus
 * stacked in one HTML file. We only read the <section role="doc-prologue">
 * subtree so the stray "Act II" heading is ignored.
 */
function parseChorus(html: string): {
  lines: Line[];
  stageDirections: StageDirection[];
} {
  const $ = cheerio.load(html, null, false);
  const lines: Line[] = [];
  const stageDirections: StageDirection[] = [];

  // Prefer the explicit prologue/epilogue container when present
  // (Henry V's mid-play choruses are nested inside each Act title chapter;
  // the Epilogue is wrapped in section[role="doc-epilogue"]).
  const prologueRoot = $('section[role="doc-prologue"]');
  const epilogueRoot = $('section[role="doc-epilogue"]');
  const scope = prologueRoot.length
    ? prologueRoot
    : (epilogueRoot.length ? epilogueRoot : $.root());

  let lineNumber = 0;

  scope.find("table tbody tr").each((_, tr) => {
    const tds = $(tr).find("> td");
    if (tds.length < 2) return;

    const contentTd = $(tds[1]);
    // Pull stage directions embedded as <i> tags first.
    contentTd.find("i").each((_, el) => {
      const dirText = cleanText($(el).text());
      if (dirText) stageDirections.push({ after_line: lineNumber, text: dirText });
      $(el).remove();
    });

    // Collect sonnet lines. Prefer <span> children inside a <p>; fall back
    // to the stripped text content if no spans present.
    const spans = contentTd.find("> p > span");
    if (spans.length > 0) {
      spans.each((_, span) => {
        const text = cleanText($(span).text());
        if (text) {
          lineNumber++;
          lines.push({ number: lineNumber, speaker: "CHORUS", text });
        }
      });
    } else {
      const text = cleanText(contentTd.text());
      if (text) {
        lineNumber++;
        lines.push({ number: lineNumber, speaker: "CHORUS", text });
      }
    }
  });

  return { lines, stageDirections };
}

function parseScene(html: string, strict: boolean): {
  lines: Line[];
  stageDirections: StageDirection[];
  sceneTitle: string;
} {
  const $ = cheerio.load(html, null, false);
  const units: RawUnit[] = [];
  let sceneTitle = "";

  const firstP = $("section > p").first();
  if (firstP.length) {
    const pText = cleanText(firstP.text());
    if (pText && !pText.startsWith("Act") && !pText.startsWith("Scene") && pText.length < 100) {
      sceneTitle = pText.replace(/\.$/, "");
    }
  }

  // Pass 1 — extract raw units from table rows
  let lastSpeaker = "";
  $("table tbody tr").each((_, tr) => {
    const tds = $(tr).find("> td");
    if (tds.length < 2) return;

    const speakerTd = $(tds[0]);
    const contentTd = $(tds[1]);
    const speakerRaw = cleanText(speakerTd.text());
    let speaker = speakerRaw ? normalizeSpeaker(speakerRaw) : "";

    if (!speaker) {
      // Two possible shapes for a blank-speaker row in Standard Ebooks drama:
      //   (a) <td/><td><i>Enter Antony.</i></td>  — a stand-alone stage direction
      //   (b) <td/><td>Welcome, Mark Antony.</td> — a continuation line of the
      //       previous speaker (Julius Caesar uses this pattern; Brutus's
      //       3.2 exit speech "Here comes his body…", "Welcome, Mark Antony"
      //       after Antony re-enters, and Antony's "You serve Octavius Caesar,
      //       do you not?" to the Servant all appear as <td/> continuations).
      // Distinguish by asking whether the content td wraps its entire body in
      // a single <i>; if so it's (a), else it's a continuation of lastSpeaker.
      // Only applied when the work opts into strictContinuationRows so prior
      // plays keep their established line numbering.
      if (strict) {
        const contentHtmlRaw = (contentTd.html() || "").trim();
        const wrappedInI = /^<i\b[\s\S]*<\/i>\s*$/i.test(contentHtmlRaw);
        const contentText = cleanText(contentTd.text());
        if (!contentText) return;

        if (wrappedInI || !lastSpeaker) {
          units.push({ kind: "stage_direction", text: contentText, isVerse: false, isFirstOfSpeech: false, isLastOfSpeech: false });
          return;
        }
        // Fall through, treating this row as continuation of lastSpeaker.
        speaker = lastSpeaker;
      } else {
        const contentText = cleanText(contentTd.text());
        if (contentText) {
          units.push({ kind: "stage_direction", text: contentText, isVerse: false, isFirstOfSpeech: false, isLastOfSpeech: false });
        }
        return;
      }
    } else {
      lastSpeaker = speaker;
    }

    const speechLines: { text: string; isVerse: boolean; directions: string[] }[] = [];
    const spans = contentTd.find("> p > span");

    if (spans.length > 0) {
      spans.each((_, span) => {
        const spanHtml = $(span).html() || "";
        const { text, directions } = extractInlineDirections(spanHtml, $, strict);
        if (text) {
          speechLines.push({ text, isVerse: true, directions });
        } else if (directions.length > 0) {
          for (const dir of directions) {
            units.push({ kind: "stage_direction", text: dir, isVerse: false, isFirstOfSpeech: false, isLastOfSpeech: false });
          }
        }
      });
    } else {
      const contentHtml = contentTd.html() || "";
      const { text, directions } = extractInlineDirections(contentHtml, $, strict);

      if (text) {
        const words = text.split(/\s+/);
        if (words.length <= 15) {
          speechLines.push({ text, isVerse: false, directions });
        } else {
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
      for (const dir of sl.directions) {
        units.push({ kind: "stage_direction", text: dir, isVerse: false, isFirstOfSpeech: false, isLastOfSpeech: false });
      }
    }
  });

  // Pass 2 — assign line numbers with Folger shared-half-line detection
  const lines: Line[] = [];
  const stageDirections: StageDirection[] = [];
  let lineNumber = 0;
  let lastWasShared = false;

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    if (unit.kind === "stage_direction") {
      stageDirections.push({ after_line: lineNumber, text: unit.text });
      continue;
    }

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

function isSharedHalfLine(units: RawUnit[], lines: Line[], currentIdx: number): boolean {
  const current = units[currentIdx];
  if (!current.isFirstOfSpeech) return false;
  const currentWords = current.text.split(/\s+/).length;
  if (currentWords > 6) return false;

  let prevUnit: RawUnit | undefined;
  for (let j = currentIdx - 1; j >= 0; j--) {
    if (units[j].kind === "line") { prevUnit = units[j]; break; }
  }
  if (!prevUnit || !lines.length) return false;
  if (!prevUnit.isLastOfSpeech) return false;
  if (prevUnit.speaker === current.speaker) return false;

  const prevWords = prevUnit.text.split(/\s+/).length;
  if (prevWords > 6) return false;
  if (currentWords + prevWords > 13) return false;
  return true;
}

function toRoman(n: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
  let result = "";
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}

// ── Main ────────────────────────────────────────────────────────────────────

type TocEntry = {
  section_id: string;
  sequence: number;
  act: number | null;
  scene: number | null;
  kind: "scene" | "chorus";
  scene_title: string;
  line_count: number;
  word_count: number;
  est_read_minutes: number;
  after_act?: number; // chorus-only: TOC placement hint
  after_all_acts?: boolean; // chorus-only: emit after every act's scenes (e.g. Epilogue)
};

function run(cfg: WorkConfig) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const tocEntries: TocEntry[] = [];

  let totalWords = 0;
  let totalLines = 0;

  console.log(`=== Ingesting ${cfg.title} (${cfg.workId}) ===\n`);

  for (let i = 0; i < cfg.sceneMap.length; i++) {
    const entry = cfg.sceneMap[i];
    const sequence = i + 1;
    const isChorus = "kind" in entry && entry.kind === "chorus";

    const chapterIndex = entry.chapterIndex;
    const srcPath = path.join(SOURCE_DIR, `ch-${chapterIndex}.json`);
    if (!fs.existsSync(srcPath)) {
      console.error(`  MISSING: ${srcPath}`);
      continue;
    }

    const srcData = JSON.parse(fs.readFileSync(srcPath, "utf-8"));

    let sectionId: string;
    let sceneTitle: string;
    let act: number | null;
    let scene: number | null;
    let lines: Line[];
    let stageDirections: StageDirection[];
    let afterAct: number | undefined;
    let afterAllActs: boolean | undefined;

    if (isChorus) {
      sectionId = entry.sectionId;
      sceneTitle = entry.sceneTitle;
      act = null;
      scene = null;
      afterAct = entry.afterAct;
      afterAllActs = entry.afterAllActs;
      const parsed = parseChorus(srcData.html);
      lines = parsed.lines;
      stageDirections = parsed.stageDirections;
    } else {
      act = entry.act;
      scene = entry.scene;
      // Section IDs use underscore-only identifiers (e.g. `romeo_and_juliet_act1_scene1`)
      // so they remain valid as a SQL/JS identifier stem; the hyphenated
      // workId is only used for directory names and URLs.
      const idStem = cfg.workId.replace(/-/g, "_");
      sectionId = `${idStem}_act${act}_scene${scene}`;
      const parsed = parseScene(srcData.html, cfg.strictContinuationRows === true);
      lines = parsed.lines;
      stageDirections = parsed.stageDirections;
      sceneTitle = parsed.sceneTitle || cfg.sceneTitles[`${act}_${scene}`] || `Act ${act}, Scene ${scene}`;
    }

    const wordCount = lines.reduce((sum, l) => sum + l.text.split(/\s+/).length, 0);
    const estReadMinutes = Math.max(1, Math.round(wordCount / 200));

    const section: SectionJSON = {
      section_id: sectionId,
      work_id: cfg.workId,
      sequence,
      act,
      scene,
      kind: isChorus ? "chorus" : "scene",
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

    const outPath = path.join(OUTPUT_DIR, `${sectionId}.json`);
    // Preserve existing glosses/annotations/trials if the file already exists
    // (so this script can be re-run without destroying generated content).
    if (fs.existsSync(outPath)) {
      try {
        const existing = JSON.parse(fs.readFileSync(outPath, "utf-8")) as SectionJSON & {
          glosses?: unknown[];
          annotations?: unknown[];
          trials?: unknown[];
        };
        (section as any).glosses = existing.glosses ?? [];
        (section as any).annotations = existing.annotations ?? [];
        (section as any).trials = existing.trials ?? [];
      } catch { /* bad JSON, overwrite */ }
    }
    fs.writeFileSync(outPath, JSON.stringify(section, null, 2));

    totalWords += wordCount;
    totalLines += lines.length;

    tocEntries.push({
      section_id: sectionId,
      sequence,
      act,
      scene,
      kind: isChorus ? "chorus" : "scene",
      scene_title: sceneTitle,
      line_count: lines.length,
      word_count: wordCount,
      est_read_minutes: estReadMinutes,
      ...(afterAct !== undefined ? { after_act: afterAct } : {}),
      ...(afterAllActs ? { after_all_acts: true } : {}),
    });

    const tag = isChorus ? " [CHORUS]" : "";
    console.log(
      `  ${sectionId}${tag}: ${lines.length} lines, ${wordCount} words, ${stageDirections.length} stage dirs`
    );
  }

  // _meta.json — preserve any existing cover art / tier_1_sections if set
  const metaPath = path.join(OUTPUT_DIR, "_meta.json");
  let existingMeta: Record<string, unknown> = {};
  if (fs.existsSync(metaPath)) {
    try { existingMeta = JSON.parse(fs.readFileSync(metaPath, "utf-8")); } catch { /* ignore */ }
  }

  const meta = {
    work_id: cfg.workId,
    title: cfg.title,
    author: cfg.author,
    source: "Standard Ebooks",
    source_url: cfg.sourceUrl,
    language: "en",
    year: cfg.year,
    genre: "Drama",
    tradition: cfg.tradition ?? "English",
    difficulty: cfg.difficulty ?? "Advanced",
    section_count: cfg.sceneMap.length,
    total_lines: totalLines,
    total_words: totalWords,
    est_read_minutes: Math.round(totalWords / 200),
    structural_unit_type: "act_scene",
    tier_1_sections: cfg.tier1Sections ?? [],
    edition_note: cfg.editionNote ?? existingMeta.edition_note ?? null,
    // Carry forward cover fields if already set
    cover_met_object_id: existingMeta.cover_met_object_id ?? null,
    cover_title: existingMeta.cover_title ?? null,
    cover_artist: existingMeta.cover_artist ?? null,
    cover_year: existingMeta.cover_year ?? null,
    cover_image_url: existingMeta.cover_image_url ?? null,
    cover_source_url: existingMeta.cover_source_url ?? null,
    cover_public_domain_status: existingMeta.cover_public_domain_status ?? null,
  };

  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

  // toc.json
  type TocSceneEntry = {
    type: "scene" | "chorus";
    section_id: string;
    sequence: number;
    act: number | null;
    scene: number | null;
    scene_title: string;
    line_count: number;
    word_count: number;
    est_read_minutes: number;
  };
  const toc: {
    work_id: string;
    entries: (
      | { type: "act"; act: number; title: string }
      | TocSceneEntry
    )[];
  } = { work_id: cfg.workId, entries: [] };

  // Partition entries: chorus entries with `after_act: 0` emit before Act I;
  // chorus entries with `after_act: N (N >= 1)` emit immediately after
  // Act N's header but before Act N's first scene. All other entries
  // emit under their act header in sequence.
  const preActChoruses = tocEntries.filter(e => e.kind === "chorus" && (e.after_act ?? -1) === 0);
  for (const c of preActChoruses) {
    toc.entries.push({
      type: "chorus",
      section_id: c.section_id,
      sequence: c.sequence,
      act: c.act,
      scene: c.scene,
      scene_title: c.scene_title,
      line_count: c.line_count,
      word_count: c.word_count,
      est_read_minutes: c.est_read_minutes,
    });
  }

  let currentAct = 0;
  const choruses = tocEntries.filter(e => e.kind === "chorus" && (e.after_act ?? -1) > 0);
  for (const entry of tocEntries) {
    if (entry.kind === "chorus") continue; // placed separately
    if (entry.act !== null && entry.act !== currentAct) {
      currentAct = entry.act;
      toc.entries.push({ type: "act", act: currentAct, title: `Act ${toRoman(currentAct)}` });
      // Emit any chorus anchored to this act's header.
      for (const c of choruses.filter(c => c.after_act === currentAct)) {
        toc.entries.push({
          type: "chorus",
          section_id: c.section_id,
          sequence: c.sequence,
          act: c.act,
          scene: c.scene,
          scene_title: c.scene_title,
          line_count: c.line_count,
          word_count: c.word_count,
          est_read_minutes: c.est_read_minutes,
        });
      }
    }
    toc.entries.push({
      type: "scene",
      section_id: entry.section_id,
      sequence: entry.sequence,
      act: entry.act,
      scene: entry.scene,
      scene_title: entry.scene_title,
      line_count: entry.line_count,
      word_count: entry.word_count,
      est_read_minutes: entry.est_read_minutes,
    });
  }

  // Trailing choruses (e.g. Henry V's Epilogue) emit after every act's scenes.
  const trailingChoruses = tocEntries.filter(e => e.kind === "chorus" && e.after_all_acts);
  for (const c of trailingChoruses) {
    toc.entries.push({
      type: "chorus",
      section_id: c.section_id,
      sequence: c.sequence,
      act: c.act,
      scene: c.scene,
      scene_title: c.scene_title,
      line_count: c.line_count,
      word_count: c.word_count,
      est_read_minutes: c.est_read_minutes,
    });
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, "toc.json"), JSON.stringify(toc, null, 2));

  console.log(`\n=== Summary ===`);
  console.log(`  Scenes: ${cfg.sceneMap.length}`);
  console.log(`  Total lines: ${totalLines}`);
  console.log(`  Total words: ${totalWords}`);
  console.log(`  Output: ${OUTPUT_DIR}/`);
}

run(workConfig);
