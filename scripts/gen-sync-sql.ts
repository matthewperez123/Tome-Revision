#!/usr/bin/env npx tsx
/**
 * gen-sync-sql.ts — Emit UPSERT SQL for a work's content/{work}/* to stdout.
 *
 * Used when the Supabase service role key isn't available locally but
 * MCP SQL execution is. Produces idempotent upsert statements covering
 * works, sections, stage_directions, glosses, scene_annotations, trials.
 *
 * The `lines` table is NOT included here — it runs into tens of thousands
 * of rows and should be done with the full sync script and service role key.
 *
 * Usage: npx tsx scripts/gen-sync-sql.ts --work othello > scripts/output/{work}-sync.sql
 */

import * as fs from "fs";
import * as path from "path";
import { getWorkConfig } from "./config/works";

const args = process.argv.slice(2);
const workArg = args.find((a, i) => args[i - 1] === "--work");
if (!workArg) { console.error("ERROR: --work required"); process.exit(1); }
const cfg = getWorkConfig(workArg);
if (!cfg) { console.error(`ERROR: unknown work ${workArg}`); process.exit(1); }

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, `content/${cfg.workId}`);

function sq(s: string | null | undefined): string {
  if (s === null || s === undefined) return "NULL";
  return "'" + String(s).replace(/'/g, "''") + "'";
}

function sqArr(arr: string[]): string {
  if (!arr || arr.length === 0) return "ARRAY[]::text[]";
  return "ARRAY[" + arr.map(sq).join(",") + "]::text[]";
}

function main() {
  const meta = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "_meta.json"), "utf-8"));
  const idStem = cfg.workId.replace(/-/g, "_");
  const sections = fs.readdirSync(CONTENT_DIR)
    .filter((f) => f.startsWith(`${idStem}_act`) && f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8")));

  const out: string[] = [];
  out.push(`-- Upsert SQL for ${cfg.title} (${cfg.workId})`);
  out.push(`-- Generated at ${new Date().toISOString()}`);
  out.push(``);
  out.push(`BEGIN;`);
  out.push(``);

  // Works
  out.push(`-- works (1 row)`);
  out.push(
    `INSERT INTO works (id, title, author, source, source_url, language, year, genre, tradition, difficulty, section_count, total_lines, total_words, est_read_minutes, structural_unit_type, cover_met_object_id) VALUES (` +
    [sq(meta.work_id), sq(meta.title), sq(meta.author), sq(meta.source), sq(meta.source_url), sq(meta.language), meta.year, sq(meta.genre), sq(meta.tradition), sq(meta.difficulty), meta.section_count, meta.total_lines, meta.total_words, meta.est_read_minutes, sq(meta.structural_unit_type), sq(meta.cover_met_object_id)].join(", ") +
    `) ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, author=EXCLUDED.author, source=EXCLUDED.source, source_url=EXCLUDED.source_url, language=EXCLUDED.language, year=EXCLUDED.year, genre=EXCLUDED.genre, tradition=EXCLUDED.tradition, difficulty=EXCLUDED.difficulty, section_count=EXCLUDED.section_count, total_lines=EXCLUDED.total_lines, total_words=EXCLUDED.total_words, est_read_minutes=EXCLUDED.est_read_minutes, structural_unit_type=EXCLUDED.structural_unit_type, cover_met_object_id=EXCLUDED.cover_met_object_id;`
  );
  out.push(``);

  // Sections
  out.push(`-- sections (${sections.length} rows)`);
  const sectionRows = sections.map((s) =>
    `(${sq(s.section_id)}, ${sq(s.work_id)}, ${s.sequence}, ${s.act}, ${s.scene}, ${sq(s.scene_title)}, ${s.line_count}, ${s.word_count}, ${s.est_read_minutes})`
  );
  out.push(
    `INSERT INTO sections (id, work_id, sequence, act, scene, scene_title, line_count, word_count, est_read_minutes) VALUES\n  ` +
    sectionRows.join(",\n  ") +
    `\nON CONFLICT (id) DO UPDATE SET work_id=EXCLUDED.work_id, sequence=EXCLUDED.sequence, act=EXCLUDED.act, scene=EXCLUDED.scene, scene_title=EXCLUDED.scene_title, line_count=EXCLUDED.line_count, word_count=EXCLUDED.word_count, est_read_minutes=EXCLUDED.est_read_minutes;`
  );
  out.push(``);

  // Remove old stage_directions for this work's sections, then re-insert (stage_directions has no natural key, just an id sequence)
  const sectionIds = sections.map((s) => sq(s.section_id)).join(", ");
  out.push(`-- stage_directions: replace per-section rows`);
  out.push(`DELETE FROM stage_directions WHERE section_id IN (${sectionIds});`);
  const stageRows: string[] = [];
  for (const s of sections) {
    for (const sd of s.stage_directions) {
      stageRows.push(`(${sq(s.section_id)}, ${sd.after_line}, ${sq(sd.text)})`);
    }
  }
  if (stageRows.length > 0) {
    out.push(
      `INSERT INTO stage_directions (section_id, after_line, text) VALUES\n  ` +
      stageRows.join(",\n  ") + `;`
    );
  }
  out.push(``);

  // Glosses
  out.push(`-- glosses (idempotent upsert by id)`);
  const glossRows: string[] = [];
  for (const s of sections) {
    for (const g of s.glosses) {
      glossRows.push(`(${sq(g.id)}, ${sq(s.section_id)}, ${g.line}, ${sq(g.phrase)}, ${sq(g.definition)})`);
    }
  }
  if (glossRows.length > 0) {
    out.push(
      `INSERT INTO glosses (id, section_id, line, phrase, definition) VALUES\n  ` +
      glossRows.join(",\n  ") +
      `\nON CONFLICT (id) DO UPDATE SET section_id=EXCLUDED.section_id, line=EXCLUDED.line, phrase=EXCLUDED.phrase, definition=EXCLUDED.definition;`
    );
  }
  out.push(``);

  // Scene annotations
  out.push(`-- scene_annotations`);
  const annRows: string[] = [];
  for (const s of sections) {
    for (const a of s.annotations) {
      annRows.push(
        `(${sq(a.id)}, ${sq(s.section_id)}, ${a.line_start}, ${a.line_end}, ${sq(a.citation_display)}, ${sq(a.category)}, ${sq(a.title)}, ${sq(a.body)}, ${sqArr(a.sources)})`
      );
    }
  }
  if (annRows.length > 0) {
    out.push(
      `INSERT INTO scene_annotations (id, section_id, line_start, line_end, citation_display, category, title, body, sources) VALUES\n  ` +
      annRows.join(",\n  ") +
      `\nON CONFLICT (id) DO UPDATE SET section_id=EXCLUDED.section_id, line_start=EXCLUDED.line_start, line_end=EXCLUDED.line_end, citation_display=EXCLUDED.citation_display, category=EXCLUDED.category, title=EXCLUDED.title, body=EXCLUDED.body, sources=EXCLUDED.sources;`
    );
  }
  out.push(``);

  // Trials
  out.push(`-- trials`);
  const trialRows: string[] = [];
  for (const s of sections) {
    for (const t of s.trials) {
      trialRows.push(
        `(${sq(t.id)}, ${sq(s.section_id)}, ${sq(t.kind)}, ${sq(t.prompt)}, ${sqArr(t.options)}, ${t.answer_index}, ${t.wisdom_reward}, ${t.anchor_line_start}, ${t.anchor_line_end})`
      );
    }
  }
  if (trialRows.length > 0) {
    out.push(
      `INSERT INTO trials (id, section_id, kind, prompt, options, answer_index, wisdom_reward, anchor_line_start, anchor_line_end) VALUES\n  ` +
      trialRows.join(",\n  ") +
      `\nON CONFLICT (id) DO UPDATE SET section_id=EXCLUDED.section_id, kind=EXCLUDED.kind, prompt=EXCLUDED.prompt, options=EXCLUDED.options, answer_index=EXCLUDED.answer_index, wisdom_reward=EXCLUDED.wisdom_reward, anchor_line_start=EXCLUDED.anchor_line_start, anchor_line_end=EXCLUDED.anchor_line_end;`
    );
  }
  out.push(``);

  out.push(`COMMIT;`);

  process.stdout.write(out.join("\n") + "\n");
}

main();
