#!/usr/bin/env npx tsx
/**
 * seed-julius-caesar-annotations.ts — Virgil-voice annotations + Trials for
 * Julius Caesar. Follows the seed-macbeth-annotations.ts pattern: per-act
 * data modules populate the ANNOTATIONS and TRIALS maps; main() writes them
 * into the scene JSONs, preserving nothing else.
 *
 * Tier-1 scenes (1.2, 2.1, 3.1, 3.2, 4.3, 5.5) receive deeper, longer
 * annotations; others receive the minimum acceptable density.
 *
 * Content-specific requirements (from the sprint brief):
 *   - ≥3 annotations engage Plutarch / North as primary source
 *   - ≥2 annotations clarify Republican vs. Imperial political framework
 *   - ≥1 annotation addresses the deliberate anachronisms (clock,
 *     doublet, book) as English inflection of Roman setting
 *   - 3.2 annotations must address prose/verse as rhetorical strategy,
 *     Antony's "honourable" technique, and the scene's canonical place
 *     in rhetoric teaching
 *   - 4.3 annotations must engage the quarrel as relationship study and
 *     the Poet/Ghost scenes
 *   - 5.5 annotations must address Antony's epitaph as political theatre
 *     and Octavius's presence as the Republic's end
 *
 * Run: npx tsx scripts/seed-julius-caesar-annotations.ts
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/julius-caesar");

interface Annotation {
  line_start: number; line_end: number;
  citation_display: string;
  category: "thematic" | "structural" | "historical" | "textual" | "biographical" | "linguistic" | "close_reading";
  title: string; body: string; sources: string[];
}
interface Trial {
  kind: "comprehension" | "inference" | "theme" | "close_reading" | "structural";
  prompt: string; options: [string, string, string, string];
  answer_index: 0 | 1 | 2 | 3;
  wisdom_reward: number;
  anchor_line_start: number; anchor_line_end: number;
}

const cite = (a: number, s: number, ls: number, le: number) =>
  ls === le ? `Julius Caesar ${a}.${s}.${ls}` : `Julius Caesar ${a}.${s}.${ls}\u2013${le}`;

// Populated by per-act data modules.
export const ANNOTATIONS: Record<string, Annotation[]> = {};
export const TRIALS: Record<string, Trial[]> = {};

require("./data/julius-caesar-act1-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/julius-caesar-act2-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/julius-caesar-act3-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/julius-caesar-act4-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/julius-caesar-act5-annotations")(ANNOTATIONS, TRIALS, cite);

function main() {
  let totalA = 0, totalT = 0;
  const meta = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "_meta.json"), "utf-8")) as { tier_1_sections?: string[] };
  const tier1 = new Set(meta.tier_1_sections ?? []);
  console.log(`=== Seeding Julius Caesar annotations + Trials ===`);
  console.log(`Tier-1: ${[...tier1].join(", ")}\n`);
  for (const sectionId of Object.keys(ANNOTATIONS)) {
    const fp = path.join(CONTENT_DIR, `${sectionId}.json`);
    if (!fs.existsSync(fp)) { console.error(`  MISSING: ${fp}`); continue; }
    const section = JSON.parse(fs.readFileSync(fp, "utf-8"));
    const anns = ANNOTATIONS[sectionId] ?? [];
    const trs = TRIALS[sectionId] ?? [];
    section.annotations = anns.map((a, i) => ({ id: `${sectionId}_ann${i + 1}`, ...a }));
    section.trials = trs.map((t, i) => ({ id: `${sectionId}_q${i + 1}`, ...t }));
    fs.writeFileSync(fp, JSON.stringify(section, null, 2));
    totalA += anns.length; totalT += trs.length;
    const mark = tier1.has(sectionId) ? " [TIER-1]" : "";
    console.log(`  ${sectionId}${mark}: ${anns.length} ann, ${trs.length} trials`);
  }
  console.log(`\nTotal: ${totalA} annotations, ${totalT} Trials`);
}
main();
