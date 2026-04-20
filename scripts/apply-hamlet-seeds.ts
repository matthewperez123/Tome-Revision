#!/usr/bin/env npx tsx
/**
 * apply-hamlet-seeds.ts — Merge seed JSON files into scene JSONs
 *
 * Reads content/hamlet/seed/glosses-*.json, annotations-*.json, trials-*.json
 * and merges them into the corresponding content/hamlet/hamlet_act*_scene*.json.
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/hamlet");
const SEED_DIR = path.join(CONTENT_DIR, "seed");

interface SeedGlosses {
  section_id: string;
  glosses: { line: number; phrase: string; definition: string }[];
}

interface SeedAnnotations {
  section_id: string;
  annotations: {
    line_start: number;
    line_end: number;
    category: string;
    title: string;
    body: string;
    sources?: string[];
  }[];
}

interface SeedTrials {
  section_id: string;
  trials: {
    kind: string;
    prompt: string;
    options: string[];
    answer_index: number;
    wisdom_reward: number;
    anchor_line_start: number;
    anchor_line_end: number;
  }[];
}

function loadSeed<T>(filename: string): T | null {
  const p = path.join(SEED_DIR, filename);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
}

function citationDisplay(sectionId: string, from: number, to: number): string {
  // hamlet_act3_scene1 → Hamlet 3.1
  const m = sectionId.match(/hamlet_act(\d+)_scene(\d+)/);
  if (!m) return `${from}–${to}`;
  const range = from === to ? `${from}` : `${from}–${to}`;
  return `Hamlet ${m[1]}.${m[2]}.${range}`;
}

function main() {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.startsWith("hamlet_act") && f.endsWith(".json"))
    .sort();

  let totalGlosses = 0;
  let totalAnnotations = 0;
  let totalTrials = 0;

  for (const filename of files) {
    const sectionPath = path.join(CONTENT_DIR, filename);
    const section = JSON.parse(fs.readFileSync(sectionPath, "utf-8"));
    const id = section.section_id;

    // ── Glosses ───────────────────────────────────────────────
    // Re-anchor each gloss to the correct line. Seed line numbers may drift
    // from ingestion output (Folger half-line merges shift subsequent
    // numbering). Normalize typography so curly quotes / em-dashes don't
    // break matches.
    const normalize = (s: string): string =>
      s
        .toLowerCase()
        .replace(/[\u2018\u2019\u02BC]/g, "'") // smart single quotes → '
        .replace(/[\u201C\u201D]/g, '"')        // smart double quotes → "
        .replace(/[\u2013\u2014\u2015]/g, "-")  // various dashes → -
        .replace(/\u00A0/g, " ")                // nbsp → space
        .replace(/\s+/g, " ")
        .trim();

    // Also replace the canonical phrase on the gloss so future substring-
    // scans in the renderer hit (we rewrite g.phrase to the exact slice
    // from the matched line's text).
    const findInLine = (lineText: string, phrase: string): string | null => {
      const normLine = normalize(lineText);
      const normPhrase = normalize(phrase);
      const idx = normLine.indexOf(normPhrase);
      if (idx === -1) return null;
      // Map normalized index back to a best-effort slice from the original
      // line text. The mapping isn't perfect because normalize collapses
      // whitespace and rewrites quotes; for the renderer we instead just
      // return a canonical, matchable phrase the renderer can handle.
      return phrase; // keep original for now — renderer will normalize too
    };

    const gSeed = loadSeed<SeedGlosses>(`glosses-${id.replace("hamlet_", "")}.json`);
    if (gSeed) {
      const lines = section.lines as { number: number; text: string }[];
      const reanchored: typeof gSeed.glosses = [];
      let dropped = 0;
      for (const g of gSeed.glosses) {
        const stated = lines.find((l) => l.number === g.line);
        if (stated && findInLine(stated.text, g.phrase)) {
          reanchored.push(g);
          continue;
        }
        // Search ±6 lines for the phrase
        const window = lines.filter(
          (l) => Math.abs(l.number - g.line) <= 6 && findInLine(l.text, g.phrase)
        );
        if (window.length > 0) {
          const closest = window.reduce((best, l) =>
            Math.abs(l.number - g.line) < Math.abs(best.number - g.line) ? l : best
          );
          reanchored.push({ ...g, line: closest.number });
        } else {
          dropped++;
        }
      }
      section.glosses = reanchored.map((g, idx) => ({
        id: `${id}_gloss${idx + 1}`,
        line: g.line,
        phrase: g.phrase,
        definition: g.definition,
      }));
      totalGlosses += section.glosses.length;
      if (dropped > 0) console.log(`    ${id}: re-anchored glosses; dropped ${dropped} unmatchable`);
    }

    // ── Annotations ───────────────────────────────────────────
    const aSeed = loadSeed<SeedAnnotations>(
      `annotations-${id.replace("hamlet_", "")}.json`
    );
    if (aSeed) {
      section.annotations = aSeed.annotations.map((a, idx) => ({
        id: `${id}_ann${idx + 1}`,
        line_start: a.line_start,
        line_end: a.line_end,
        citation_display: citationDisplay(id, a.line_start, a.line_end),
        category: a.category,
        title: a.title,
        body: a.body,
        sources: a.sources || [],
      }));
      totalAnnotations += section.annotations.length;
    }

    // ── Trials ────────────────────────────────────────────────
    const tSeed = loadSeed<SeedTrials>(`trials-${id.replace("hamlet_", "")}.json`);
    if (tSeed) {
      section.trials = tSeed.trials.map((t, idx) => ({
        id: `${id}_q${idx + 1}`,
        kind: t.kind,
        prompt: t.prompt,
        options: t.options,
        answer_index: t.answer_index,
        wisdom_reward: t.wisdom_reward,
        anchor_line_start: t.anchor_line_start,
        anchor_line_end: t.anchor_line_end,
      }));
      totalTrials += section.trials.length;
    }

    fs.writeFileSync(sectionPath, JSON.stringify(section, null, 2));
    console.log(
      `  ${id}: ${section.glosses?.length || 0} glosses, ${section.annotations?.length || 0} ann, ${section.trials?.length || 0} trials`
    );
  }

  console.log(
    `\nTotals: ${totalGlosses} glosses, ${totalAnnotations} annotations, ${totalTrials} trials`
  );
}

main();
