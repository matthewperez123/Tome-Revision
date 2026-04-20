#!/usr/bin/env npx tsx
/**
 * fix-richard-iii-ghost-speakers.ts — Remap the 5.3 ghost-speaker labels.
 *
 * Standard Ebooks encodes several of the ghosts in the procession (Prince
 * Edward, Henry VI, Clarence, Anne, Buckingham) with the generic label
 * "Ghost", while the preceding stage direction names the ghost explicitly.
 * That makes the five ghosts indistinguishable in the reader, which
 * collapses the scene's moral-arithmetic function — each ghost is meant
 * to represent a specific murder.
 *
 * This script walks content/richard-iii/richard_iii_act5_scene3.json and
 * relabels each line whose speaker is the generic "GHOST" (or "GHOSTS")
 * using the most recent preceding "Enter the Ghost(s) of X" stage
 * direction. Lines with already-specific labels (GHOST OF RIVERS, etc.)
 * are left alone.
 *
 * Re-running is idempotent because renamed labels no longer match the
 * generic patterns this script rewrites.
 *
 * Run: npx tsx scripts/fix-richard-iii-ghost-speakers.ts
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const SCENE_PATH = path.join(ROOT, "content/richard-iii/richard_iii_act5_scene3.json");

interface Line { number: number; speaker?: string; text: string }
interface StageDirection { after_line: number; text: string }

function labelFromStageDirection(text: string): string | null {
  // Match "Enter the Ghost of X" or "Enter the Ghosts of X".
  // Keep the trailing descriptor up to a comma or period, then normalize.
  const m = text.match(/Enter the (Ghosts? of [^,.\n]+)/i);
  if (!m) return null;
  // Trim "son to Henry the Sixth" style appositives
  let raw = m[1].trim();
  // Normalize quirky cases
  raw = raw.replace(/^Ghosts of the two young Princes$/i, "Ghosts of the Young Princes");
  return raw.replace(/\s+/g, " ").trim().toUpperCase();
}

function main() {
  const section = JSON.parse(fs.readFileSync(SCENE_PATH, "utf-8")) as {
    lines: Line[];
    stage_directions: StageDirection[];
    [key: string]: unknown;
  };

  // Collect the subset of ghost-entry stage directions, in order.
  const ghostEntries: { after_line: number; label: string }[] = [];
  for (const sd of section.stage_directions) {
    if (/Enter the Ghosts? of /i.test(sd.text)) {
      const label = labelFromStageDirection(sd.text);
      if (label) ghostEntries.push({ after_line: sd.after_line, label });
    }
  }

  if (ghostEntries.length === 0) {
    console.log("No ghost-entry stage directions found — nothing to do.");
    return;
  }

  console.log("Ghost entries detected:");
  for (const e of ghostEntries) console.log(`  after L${e.after_line}: ${e.label}`);

  // For each line, find the latest ghost-entry stage direction whose
  // after_line is < line.number. If the line's speaker is the generic
  // "GHOST" or "GHOSTS", replace with the specific label.
  let rewrites = 0;
  for (const line of section.lines) {
    const sp = (line.speaker ?? "").toUpperCase();
    if (sp !== "GHOST" && sp !== "GHOSTS") continue;

    // Find last entry with after_line < line.number
    let match: string | null = null;
    for (const e of ghostEntries) {
      if (e.after_line < line.number) match = e.label;
      else break;
    }
    if (!match) continue;

    // Don't clobber specific labels (e.g. GHOST OF RIVERS) — already filtered
    // above, but double-check: only rewrite if generic.
    if (sp === "GHOST" || sp === "GHOSTS") {
      if (line.speaker !== match) {
        line.speaker = match;
        rewrites++;
      }
    }
  }

  fs.writeFileSync(SCENE_PATH, JSON.stringify(section, null, 2));
  console.log(`\nRewrote ${rewrites} speaker labels in ${path.basename(SCENE_PATH)}.`);

  // Report the new distinct speakers seen in the ghost section
  const seen = new Map<string, number>();
  for (const line of section.lines) {
    const sp = line.speaker ?? "";
    if (sp.startsWith("GHOST")) seen.set(sp, (seen.get(sp) ?? 0) + 1);
  }
  console.log("\nGhost speakers now in scene:");
  for (const [sp, n] of seen) console.log(`  ${sp}: ${n} lines`);
}

main();
