#!/usr/bin/env npx tsx
/**
 * seed-romeo-and-juliet-annotations.ts — Virgil-voice annotations + Trials
 * for Romeo and Juliet. Same pattern as seed-macbeth-annotations.ts — data
 * files per-act push into the ANNOTATIONS/TRIALS maps.
 *
 * Run: npx tsx scripts/seed-romeo-and-juliet-annotations.ts
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/romeo-and-juliet");

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
const cite = (a: number | null, s: number | null, ls: number, le: number, sectionLabel?: string): string => {
  const label = sectionLabel ?? (a !== null && s !== null ? `${a}.${s}` : "");
  const range = ls === le ? `${ls}` : `${ls}–${le}`;
  return `Romeo and Juliet ${label}.${range}`;
};

export const ANNOTATIONS: Record<string, Annotation[]> = {};
export const TRIALS: Record<string, Trial[]> = {};

require("./data/romeo-and-juliet-prologue-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/romeo-and-juliet-act1-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/romeo-and-juliet-act2-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/romeo-and-juliet-act3-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/romeo-and-juliet-act4-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/romeo-and-juliet-act5-annotations")(ANNOTATIONS, TRIALS, cite);

function main() {
  let totalA = 0, totalT = 0;
  const meta = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "_meta.json"), "utf-8")) as { tier_1_sections?: string[] };
  const tier1 = new Set(meta.tier_1_sections ?? []);
  console.log(`=== Seeding R&J annotations + Trials ===`);
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
