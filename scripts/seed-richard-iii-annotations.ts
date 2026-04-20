#!/usr/bin/env npx tsx
/**
 * seed-richard-iii-annotations.ts — Virgil-voice annotations + Trials for Richard III.
 * Follows the seed-henry-v-annotations.ts pattern: per-act modules push into
 * the ANNOTATIONS / TRIALS maps.
 *
 * Richard III-specific authoring targets (per sprint brief):
 *   - Correct the "winter of our discontent" misreading at the scholarly
 *     level (the gloss names the misreading; the annotation explains the
 *     theatrical and rhetorical force of the correct reading).
 *   - Name audience-complicity as Shakespeare's theatrical innovation here.
 *   - Treat Tudor historiography directly at least three times (More as
 *     source; 2012 rediscovery of Richard's remains; the Richard III
 *     Society / revisionist position). Do not adjudicate; lay out the
 *     interpretive stakes.
 *   - The wooing of Anne (1.2) requires attention to Anne's complexity,
 *     not just Richard's virtuosity.
 *   - Margaret as choric / prophetic figure (1.3, 4.4) — and note her
 *     historical impossibility as a deliberate dramaturgical choice.
 *   - The princes' deaths (4.3) must be given moral weight AND the
 *     historical question named as genuinely open.
 *   - The ghost scene (5.3) is Shakespeare's most extensive ghost
 *     sequence — annotate its moral-accounting function, double address,
 *     and the "thousand several tongues" interiority.
 *   - "A horse! a horse!" (5.4) must be restored to its desperate weight.
 *   - 5.5 Tudor Myth annotation — Henry VII's thin claim, the
 *     providential framing, and how this theology shapes Shakespeare's
 *     entire history-play project.
 *   - At least one annotation flags the Q1/F1 textual situation lightly.
 *
 * Run: npx tsx scripts/seed-richard-iii-annotations.ts
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/richard-iii");

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

const cite = (sectionLabel: string, ls: number, le: number): string => {
  const range = ls === le ? `${ls}` : `${ls}–${le}`;
  return `Richard III ${sectionLabel}.${range}`;
};

export const ANNOTATIONS: Record<string, Annotation[]> = {};
export const TRIALS: Record<string, Trial[]> = {};

require("./data/richard-iii-act1-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/richard-iii-act2-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/richard-iii-act3-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/richard-iii-act4-annotations")(ANNOTATIONS, TRIALS, cite);
require("./data/richard-iii-act5-annotations")(ANNOTATIONS, TRIALS, cite);

function main() {
  let totalA = 0, totalT = 0;
  const meta = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "_meta.json"), "utf-8")) as { tier_1_sections?: string[] };
  const tier1 = new Set(meta.tier_1_sections ?? []);
  console.log(`=== Seeding Richard III annotations + Trials ===`);
  console.log(`Tier-1: ${[...tier1].join(", ")}\n`);

  const sectionIds = new Set([...Object.keys(ANNOTATIONS), ...Object.keys(TRIALS)]);
  for (const sectionId of sectionIds) {
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
