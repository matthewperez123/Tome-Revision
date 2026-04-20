#!/usr/bin/env npx tsx
/**
 * seed-king-lear-annotations.ts — Virgil-voice annotations + Trials for
 * King Lear. Same pattern as prior Shakespeare plays: per-act data files
 * push into ANNOTATIONS/TRIALS maps.
 *
 * Lear-specific requirements per brief:
 *   - "Nothing will come of nothing" annotation tracing the word's return
 *   - 3.2 storm as externalized psychology (Bloom engaged)
 *   - 3.4 Poor Tom + Harsnett source
 *   - 3.7 blinding's shock + servant's resistance
 *   - 4.1 "As flies to wanton boys" theological skepticism
 *   - 4.6 great stage of fools + theatrum mundi
 *   - 5.3 Howl×4, Nahum Tate's happy ending, Edgar/Albany final-couplet crux
 *   - ≥2 Q1/F1 textual annotations (3.6 mock trial is the obvious place)
 *
 * Run: npx tsx scripts/seed-king-lear-annotations.ts
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/king-lear");

interface Annotation {
  line_start: number; line_end: number;
  citation_display: string;
  category: "thematic"|"structural"|"historical"|"textual"|"biographical"|"linguistic"|"close_reading";
  title: string; body: string; sources: string[];
}
interface Trial {
  kind: "comprehension"|"inference"|"theme"|"close_reading"|"structural";
  prompt: string; options: [string,string,string,string];
  answer_index: 0|1|2|3;
  wisdom_reward: number;
  anchor_line_start: number; anchor_line_end: number;
}

export const ANNOTATIONS: Record<string, Annotation[]> = {};
export const TRIALS: Record<string, Trial[]> = {};

require("./data/king-lear-act1-annotations")(ANNOTATIONS, TRIALS);
require("./data/king-lear-act2-annotations")(ANNOTATIONS, TRIALS);
require("./data/king-lear-act3-annotations")(ANNOTATIONS, TRIALS);
require("./data/king-lear-act4-annotations")(ANNOTATIONS, TRIALS);
require("./data/king-lear-act5-annotations")(ANNOTATIONS, TRIALS);
require("./data/king-lear-annotations-bonus")(ANNOTATIONS, TRIALS);

function main() {
  let totalA = 0, totalT = 0;
  const meta = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "_meta.json"), "utf-8")) as { tier_1_sections?: string[] };
  const tier1 = new Set(meta.tier_1_sections ?? []);
  console.log(`=== Seeding King Lear annotations + Trials ===`);
  console.log(`Tier-1: ${[...tier1].join(", ")}\n`);

  const sectionIds = new Set([...Object.keys(ANNOTATIONS), ...Object.keys(TRIALS)]);
  for (const sectionId of sectionIds) {
    const fp = path.join(CONTENT_DIR, `${sectionId}.json`);
    if (!fs.existsSync(fp)) { console.error(`  MISSING: ${fp}`); continue; }
    const section = JSON.parse(fs.readFileSync(fp, "utf-8"));
    const anns = ANNOTATIONS[sectionId] ?? [];
    const trs = TRIALS[sectionId] ?? [];
    section.annotations = anns.map((a, i) => ({ id: `${sectionId}_ann${i+1}`, ...a }));
    section.trials = trs.map((t, i) => ({ id: `${sectionId}_q${i+1}`, ...t }));
    fs.writeFileSync(fp, JSON.stringify(section, null, 2));
    totalA += anns.length; totalT += trs.length;
    const mark = tier1.has(sectionId) ? " [TIER-1]" : "";
    console.log(`  ${sectionId}${mark}: ${anns.length} ann, ${trs.length} trials`);
  }
  console.log(`\nTotal: ${totalA} annotations, ${totalT} Trials`);
}
main();
