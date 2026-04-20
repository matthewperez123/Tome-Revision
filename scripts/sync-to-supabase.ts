#!/usr/bin/env npx tsx
/**
 * sync-to-supabase.ts — Upsert any work's content/{work}/* into Supabase
 *
 * Reads the scene JSONs plus _meta.json for the given work and upserts into:
 *   works, sections, lines, stage_directions, glosses, annotations, trials
 *
 * Upsert-only — rows for OTHER works are not touched, so syncing Othello
 * does not modify Hamlet data and vice versa.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/sync-to-supabase.ts --work othello
 *   npx tsx scripts/sync-to-supabase.ts --work hamlet --dry-run
 */

import * as fs from "fs";
import * as path from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getWorkConfig } from "./config/works";

const ROOT = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const workArg = args.find((a, i) => args[i - 1] === "--work");
if (!workArg) {
  console.error("ERROR: --work <workId> required (e.g. --work othello)");
  process.exit(1);
}
const workConfig = getWorkConfig(workArg);
if (!workConfig) {
  console.error(`ERROR: No config registered for work '${workArg}'`);
  process.exit(1);
}

const CONTENT_DIR = path.join(ROOT, `content/${workConfig.workId}`);
const dryRun = args.includes("--dry-run");

interface Line {
  number: number;
  speaker?: string;
  text: string;
}
interface StageDirection {
  after_line: number;
  text: string;
}
interface Gloss {
  id: string;
  line: number;
  phrase: string;
  definition: string;
}
interface Annotation {
  id: string;
  line_start: number;
  line_end: number;
  citation_display: string;
  category: string;
  title: string;
  body: string;
  sources: string[];
}
interface Trial {
  id: string;
  kind: string;
  prompt: string;
  options: string[];
  answer_index: number;
  wisdom_reward: number;
  anchor_line_start: number;
  anchor_line_end: number;
}
interface Section {
  section_id: string;
  work_id: string;
  sequence: number;
  act: number | null;
  scene: number | null;
  kind?: "scene" | "chorus";
  scene_title: string;
  line_count: number;
  word_count: number;
  est_read_minutes: number;
  lines: Line[];
  stage_directions: StageDirection[];
  glosses: Gloss[];
  annotations: Annotation[];
  trials: Trial[];
}
interface Meta {
  work_id: string;
  title: string;
  author: string;
  source: string;
  source_url: string;
  language: string;
  year: number;
  genre: string;
  tradition: string;
  difficulty: string;
  section_count: number;
  total_lines: number;
  total_words: number;
  est_read_minutes: number;
  structural_unit_type: string;
  cover_met_object_id: string | null;
}

async function upsertBatch<T>(
  client: SupabaseClient,
  table: string,
  rows: T[],
  onConflict: string
) {
  if (rows.length === 0) return;
  // Batch in chunks of 500 to avoid payload limits
  const CHUNK = 500;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error } = await client.from(table).upsert(chunk, { onConflict });
    if (error) {
      throw new Error(`${table} upsert failed: ${error.message}`);
    }
  }
}

async function main() {
  const meta: Meta = JSON.parse(
    fs.readFileSync(path.join(CONTENT_DIR, "_meta.json"), "utf-8")
  );

  // Pick up all section JSONs for this work, including non-`_act` sections
  // like `{workId}_prologue.json` or `{workId}_act2_chorus.json`. Exclude
  // the work-level files (_meta.json, toc.json).
  const EXCLUDED = new Set(["_meta.json", "toc.json"]);
  const workPrefix = workConfig.workId.replace(/-/g, "_") + "_";
  const sectionFiles = fs
    .readdirSync(CONTENT_DIR)
    .filter(
      (f) =>
        f.endsWith(".json") &&
        !EXCLUDED.has(f) &&
        f.startsWith(workPrefix)
    )
    .sort();

  const sections: Section[] = sectionFiles.map((f) =>
    JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8"))
  );

  // Tally up for reporting
  const totals = {
    lines: sections.reduce((s, x) => s + x.lines.length, 0),
    stageDirs: sections.reduce((s, x) => s + x.stage_directions.length, 0),
    glosses: sections.reduce((s, x) => s + x.glosses.length, 0),
    annotations: sections.reduce((s, x) => s + x.annotations.length, 0),
    trials: sections.reduce((s, x) => s + x.trials.length, 0),
  };

  console.log(`=== ${workConfig.title} Supabase Sync ===`);
  console.log(`  Work:     ${meta.work_id} — ${meta.title} by ${meta.author}`);
  console.log(`  Sections: ${sections.length}`);
  console.log(`  Lines:    ${totals.lines}`);
  console.log(`  Stage:    ${totals.stageDirs}`);
  console.log(`  Glosses:  ${totals.glosses}`);
  console.log(`  Ann:      ${totals.annotations}`);
  console.log(`  Trials:   ${totals.trials}`);

  if (dryRun) {
    console.log(`\n(DRY RUN — no writes)`);
    return;
  }

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(`\nERROR: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY`);
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`\nSyncing...`);

  // 1. Work
  await upsertBatch(
    supabase,
    "works",
    [
      {
        id: meta.work_id,
        title: meta.title,
        author: meta.author,
        source: meta.source,
        source_url: meta.source_url,
        language: meta.language,
        year: meta.year,
        genre: meta.genre,
        tradition: meta.tradition,
        difficulty: meta.difficulty,
        section_count: meta.section_count,
        total_lines: meta.total_lines,
        total_words: meta.total_words,
        est_read_minutes: meta.est_read_minutes,
        structural_unit_type: meta.structural_unit_type,
        cover_met_object_id: meta.cover_met_object_id,
      },
    ],
    "id"
  );
  console.log(`  works: 1 upserted`);

  // 2. Sections
  await upsertBatch(
    supabase,
    "sections",
    sections.map((s) => ({
      id: s.section_id,
      work_id: s.work_id,
      sequence: s.sequence,
      act: s.act,
      scene: s.scene,
      scene_title: s.scene_title,
      line_count: s.line_count,
      word_count: s.word_count,
      est_read_minutes: s.est_read_minutes,
    })),
    "id"
  );
  console.log(`  sections: ${sections.length} upserted`);

  // 3. Lines — need array_index to preserve order (shared line numbers collide)
  const allLines = sections.flatMap((s) =>
    s.lines.map((l, idx) => ({
      section_id: s.section_id,
      number: l.number,
      array_index: idx,
      speaker: l.speaker || null,
      text: l.text,
    }))
  );
  // Clear existing lines for these sections first (lines use compound key, upsert is complex)
  for (const s of sections) {
    const { error } = await supabase.from("lines").delete().eq("section_id", s.section_id);
    if (error) throw new Error(`lines delete failed: ${error.message}`);
  }
  await upsertBatch(supabase, "lines", allLines, "section_id,array_index");
  console.log(`  lines: ${allLines.length} upserted`);

  // 4. Stage directions — delete + insert (no natural PK)
  for (const s of sections) {
    const { error } = await supabase
      .from("stage_directions")
      .delete()
      .eq("section_id", s.section_id);
    if (error) throw new Error(`stage_directions delete failed: ${error.message}`);
  }
  const allStageDirs = sections.flatMap((s) =>
    s.stage_directions.map((sd) => ({
      section_id: s.section_id,
      after_line: sd.after_line,
      text: sd.text,
    }))
  );
  if (allStageDirs.length > 0) {
    const { error } = await supabase.from("stage_directions").insert(allStageDirs);
    if (error) throw new Error(`stage_directions insert failed: ${error.message}`);
  }
  console.log(`  stage_directions: ${allStageDirs.length} inserted`);

  // 5. Glosses
  const allGlosses = sections.flatMap((s) =>
    s.glosses.map((g) => ({
      id: g.id,
      section_id: s.section_id,
      line: g.line,
      phrase: g.phrase,
      definition: g.definition,
    }))
  );
  await upsertBatch(supabase, "glosses", allGlosses, "id");
  console.log(`  glosses: ${allGlosses.length} upserted`);

  // 6. Annotations
  const allAnnotations = sections.flatMap((s) =>
    s.annotations.map((a) => ({
      id: a.id,
      section_id: s.section_id,
      line_start: a.line_start,
      line_end: a.line_end,
      citation_display: a.citation_display,
      category: a.category,
      title: a.title,
      body: a.body,
      sources: a.sources,
    }))
  );
  await upsertBatch(supabase, "scene_annotations", allAnnotations, "id");
  console.log(`  annotations: ${allAnnotations.length} upserted`);

  // 7. Trials
  const allTrials = sections.flatMap((s) =>
    s.trials.map((t) => ({
      id: t.id,
      section_id: s.section_id,
      kind: t.kind,
      prompt: t.prompt,
      options: t.options,
      answer_index: t.answer_index,
      wisdom_reward: t.wisdom_reward,
      anchor_line_start: t.anchor_line_start,
      anchor_line_end: t.anchor_line_end,
    }))
  );
  await upsertBatch(supabase, "trials", allTrials, "id");
  console.log(`  trials: ${allTrials.length} upserted`);

  console.log(`\nSync complete.`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
