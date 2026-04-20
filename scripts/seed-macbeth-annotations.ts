#!/usr/bin/env npx tsx
/**
 * seed-macbeth-annotations.ts — Virgil-voice annotations + Trials for Macbeth.
 * Same pattern as seed-othello-annotations.ts. Tier-1 scenes get deeper treatment.
 * Run: npx tsx scripts/seed-macbeth-annotations.ts
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/macbeth");

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
const cite = (a: number, s: number, ls: number, le: number) =>
  ls === le ? `Macbeth ${a}.${s}.${ls}` : `Macbeth ${a}.${s}.${ls}–${le}`;

// Populated by separate data files that push into these maps.
export const ANNOTATIONS: Record<string, Annotation[]> = {};
export const TRIALS: Record<string, Trial[]> = {};

// Data lives in data files; we require() them to populate the maps.
require("./data/macbeth-act1-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/macbeth-act2-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/macbeth-act3-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/macbeth-act4-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/macbeth-act5-annotations")(ANNOTATIONS, TRIALS, cite);

function main() {
  let totalA = 0, totalT = 0;
  const meta = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "_meta.json"), "utf-8")) as {tier_1_sections?: string[]};
  const tier1 = new Set(meta.tier_1_sections ?? []);
  console.log(`=== Seeding Macbeth annotations + Trials ===`);
  console.log(`Tier-1: ${[...tier1].join(", ")}\n`);
  for (const sectionId of Object.keys(ANNOTATIONS)) {
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
