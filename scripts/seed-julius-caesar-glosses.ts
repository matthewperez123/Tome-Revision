#!/usr/bin/env npx tsx
/**
 * seed-julius-caesar-glosses.ts — Hand-authored glosses for Julius Caesar.
 * Follows the seed-richard-iii-glosses.ts pattern: per-act modules push into
 * the GLOSSES map; findLineForPhrase tolerates ±20 line drift and normalizes
 * smart quotes / em-dashes so gloss line hints need only be approximate.
 *
 * Julius Caesar-specific authoring considerations:
 *   - Shakespeare's direct source is North's 1579 English translation of
 *     Amyot's French translation of Plutarch's *Parallel Lives*. Glosses
 *     lean neutral-dictionary and leave the Plutarch framing to annotations,
 *     BUT key vocabulary that only makes sense against the Roman republican
 *     frame (tribune, patrician, plebeian, ides, Lupercal, augur) gets a
 *     period-appropriate gloss.
 *   - "Lovers" in Brutus's "Romans, countrymen, and lovers" (3.2) MUST be
 *     glossed in the Renaissance sense (dear friends, loved ones) — not
 *     romantic. This is the single most load-bearing gloss in the play.
 *   - "Ambitious" (3.2) carries heavier pejorative weight in Elizabethan
 *     usage than in modern — "ambition" was a specific political vice.
 *   - "Et tu, Brute" gets a gloss noting that this is Shakespeare's Latin
 *     invention, not Caesar's historical last words (Suetonius gives Greek
 *     "καὶ σύ, τέκνον" — "and you, child").
 *   - "Honourable" in Antony's oration gets a gloss noting the ironic
 *     accumulation — by the end of the speech the word has become an
 *     accusation. (Repetition glossed once; subsequent instances stand.)
 *   - Deliberate anachronisms (clock, doublet, book) are glossed with a
 *     brief "Renaissance object in a Roman setting" note — the annotations
 *     do the heavier lifting on why.
 *
 * Run: npx tsx scripts/seed-julius-caesar-glosses.ts
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/julius-caesar");

interface SeedGloss { line: number; phrase: string; definition: string; }

const GLOSSES: Record<string, SeedGloss[]> = {};

// ── Act-level modules ──────────────────────────────────────────────────

require("./data/julius-caesar-act1-glosses")(GLOSSES);
require("./data/julius-caesar-act2-glosses")(GLOSSES);
require("./data/julius-caesar-act3-glosses")(GLOSSES);
require("./data/julius-caesar-act4-glosses")(GLOSSES);
require("./data/julius-caesar-act5-glosses")(GLOSSES);

// ── Seeder (shared logic, matching seed-richard-iii-glosses.ts) ────────

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, "-")
    .replace(/\u00A0/g, " ")
    .replace(/[-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findLineForPhrase(
  lines: { number: number; text: string }[],
  phrase: string,
  hint: number,
  stageDirs?: { after_line: number; text: string }[]
): number | null {
  const normPhrase = normalize(phrase.replace(/\s*\/\s*/g, " "));
  const hintLine = lines.find((l) => l.number === hint);
  if (hintLine && normalize(hintLine.text).includes(normPhrase)) return hint;
  for (let delta = 1; delta <= 20; delta++) {
    for (const sign of [-1, 1] as const) {
      const n = hint + sign * delta;
      const l = lines.find((x) => x.number === n);
      if (l && normalize(l.text).includes(normPhrase)) return n;
    }
  }
  const singleLine = lines
    .filter((l) => normalize(l.text).includes(normPhrase))
    .map((l) => ({ n: l.number, dist: Math.abs(l.number - hint) }))
    .sort((a, b) => a.dist - b.dist);
  if (singleLine[0]) return singleLine[0].n;
  for (let i = 0; i < lines.length - 1; i++) {
    const joined = normalize(lines[i].text + " " + lines[i + 1].text);
    if (joined.includes(normPhrase)) return lines[i].number;
  }
  if (stageDirs) {
    const sd = stageDirs.find((sd) => normalize(sd.text).includes(normPhrase));
    if (sd) {
      const anchor = lines.find((l) => l.number === sd.after_line + 1)?.number;
      return anchor ?? (lines[0]?.number ?? null);
    }
  }
  const words = normPhrase.split(" ").filter((w) => w.length >= 4);
  if (words.length > 0) {
    const windowStart = Math.max(1, hint - 6);
    const windowEnd = hint + 6;
    const windowText = lines
      .filter((l) => l.number >= windowStart && l.number <= windowEnd)
      .map((l) => normalize(l.text))
      .join(" ");
    if (words.every((w) => windowText.includes(w))) {
      const best = lines
        .filter((l) => l.number >= windowStart && l.number <= windowEnd)
        .map((l) => {
          const text = normalize(l.text);
          const count = words.filter((w) => text.includes(w)).length;
          return { n: l.number, count };
        })
        .sort((a, b) => b.count - a.count)[0];
      return best?.n ?? hint;
    }
  }
  return null;
}

function main() {
  const sectionIds = Object.keys(GLOSSES);
  let totalGlosses = 0;
  let totalSkipped = 0;
  const summary: { id: string; count: number; skipped: number }[] = [];

  const meta = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "_meta.json"), "utf-8")) as { tier_1_sections?: string[] };
  const tier1 = new Set(meta.tier_1_sections ?? []);

  console.log(`=== Seeding Julius Caesar glosses (${sectionIds.length} sections) ===`);
  console.log(`  Tier-1 (full-depth): ${[...tier1].length} sections\n`);

  for (const sectionId of sectionIds) {
    const filePath = path.join(CONTENT_DIR, `${sectionId}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`  MISSING FILE: ${sectionId}.json — skipping`);
      continue;
    }
    const section = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const glossList = GLOSSES[sectionId];
    const valid: { id: string; line: number; phrase: string; definition: string }[] = [];
    let skipped = 0;

    for (let i = 0; i < glossList.length; i++) {
      const g = glossList[i];
      const actualLine = findLineForPhrase(section.lines, g.phrase, g.line, section.stage_directions);
      if (actualLine === null) {
        console.warn(`  ${sectionId}: cannot locate "${g.phrase}" near L${g.line}`);
        skipped++;
        continue;
      }
      valid.push({
        id: `${sectionId}_gloss${i + 1 - skipped}`,
        line: actualLine,
        phrase: g.phrase,
        definition: g.definition,
      });
    }

    section.glosses = valid;
    fs.writeFileSync(filePath, JSON.stringify(section, null, 2));

    totalGlosses += valid.length;
    totalSkipped += skipped;
    summary.push({ id: sectionId, count: valid.length, skipped });
    const tierTag = tier1.has(sectionId) ? " [TIER-1]" : "";
    console.log(
      `  ${sectionId}${tierTag}: ${valid.length} glosses${skipped > 0 ? ` (${skipped} not found)` : ""}`
    );
  }

  console.log(`\n=== Summary ===`);
  console.log(`  Total glosses: ${totalGlosses}`);
  console.log(`  Not located:   ${totalSkipped}`);
  console.log(`  Sections:      ${summary.length}`);
  console.log(`  Average:       ${Math.round(totalGlosses / Math.max(1, summary.length))} per section`);
}

main();
