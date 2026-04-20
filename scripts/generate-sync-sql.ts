#!/usr/bin/env npx tsx
/**
 * generate-sync-sql.ts — Emit a single SQL file with all Hamlet content
 * Output: content/hamlet/sync.sql (can be piped to psql or split for execute_sql)
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/hamlet");
const OUT = path.join(CONTENT_DIR, "sync.sql");

function esc(s: string | null | undefined): string {
  if (s === null || s === undefined) return "NULL";
  return `'${String(s).replace(/'/g, "''")}'`;
}

function arrToSql(arr: string[]): string {
  if (!arr || arr.length === 0) return "ARRAY[]::TEXT[]";
  return `ARRAY[${arr.map(esc).join(",")}]::TEXT[]`;
}

const meta = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "_meta.json"), "utf-8"));
const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.startsWith("hamlet_act") && f.endsWith(".json")).sort();
const sections = files.map((f) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8")));

const sql: string[] = [];

// Begin transaction
sql.push("BEGIN;");

// Work
sql.push(`INSERT INTO works (id, title, author, source, source_url, language, year, genre, tradition, difficulty, section_count, total_lines, total_words, est_read_minutes, structural_unit_type, cover_met_object_id) VALUES (${esc(meta.work_id)}, ${esc(meta.title)}, ${esc(meta.author)}, ${esc(meta.source)}, ${esc(meta.source_url)}, ${esc(meta.language)}, ${meta.year}, ${esc(meta.genre)}, ${esc(meta.tradition)}, ${esc(meta.difficulty)}, ${meta.section_count}, ${meta.total_lines}, ${meta.total_words}, ${meta.est_read_minutes}, ${esc(meta.structural_unit_type)}, ${esc(meta.cover_met_object_id)}) ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, author=EXCLUDED.author, source=EXCLUDED.source, source_url=EXCLUDED.source_url, language=EXCLUDED.language, year=EXCLUDED.year, genre=EXCLUDED.genre, tradition=EXCLUDED.tradition, difficulty=EXCLUDED.difficulty, section_count=EXCLUDED.section_count, total_lines=EXCLUDED.total_lines, total_words=EXCLUDED.total_words, est_read_minutes=EXCLUDED.est_read_minutes, structural_unit_type=EXCLUDED.structural_unit_type, cover_met_object_id=EXCLUDED.cover_met_object_id;`);

// Clear existing Hamlet content for fresh sync
sql.push(`DELETE FROM lines WHERE section_id LIKE 'hamlet_%';`);
sql.push(`DELETE FROM stage_directions WHERE section_id LIKE 'hamlet_%';`);
sql.push(`DELETE FROM glosses WHERE section_id LIKE 'hamlet_%';`);
sql.push(`DELETE FROM scene_annotations WHERE section_id LIKE 'hamlet_%';`);
sql.push(`DELETE FROM trials WHERE section_id LIKE 'hamlet_%';`);
sql.push(`DELETE FROM sections WHERE work_id = 'hamlet';`);

// Sections
for (const s of sections) {
  sql.push(`INSERT INTO sections (id, work_id, sequence, act, scene, scene_title, line_count, word_count, est_read_minutes) VALUES (${esc(s.section_id)}, ${esc(s.work_id)}, ${s.sequence}, ${s.act}, ${s.scene}, ${esc(s.scene_title)}, ${s.line_count}, ${s.word_count}, ${s.est_read_minutes});`);
}

// Lines (batch inserts)
for (const s of sections) {
  const rows: string[] = [];
  s.lines.forEach((l: any, idx: number) => {
    rows.push(`(${esc(s.section_id)}, ${l.number}, ${idx}, ${l.speaker ? esc(l.speaker) : "NULL"}, ${esc(l.text)})`);
  });
  // Batch in groups of 100
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100);
    sql.push(`INSERT INTO lines (section_id, number, array_index, speaker, text) VALUES ${batch.join(", ")};`);
  }
}

// Stage directions
for (const s of sections) {
  if (s.stage_directions.length === 0) continue;
  const rows = s.stage_directions.map((sd: any) => `(${esc(s.section_id)}, ${sd.after_line}, ${esc(sd.text)})`);
  sql.push(`INSERT INTO stage_directions (section_id, after_line, text) VALUES ${rows.join(", ")};`);
}

// Glosses
for (const s of sections) {
  if (s.glosses.length === 0) continue;
  const rows = s.glosses.map((g: any) => `(${esc(g.id)}, ${esc(s.section_id)}, ${g.line}, ${esc(g.phrase)}, ${esc(g.definition)})`);
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100);
    sql.push(`INSERT INTO glosses (id, section_id, line, phrase, definition) VALUES ${batch.join(", ")};`);
  }
}

// Annotations
for (const s of sections) {
  if (s.annotations.length === 0) continue;
  const rows = s.annotations.map((a: any) => `(${esc(a.id)}, ${esc(s.section_id)}, ${a.line_start}, ${a.line_end}, ${esc(a.citation_display)}, ${esc(a.category)}, ${esc(a.title)}, ${esc(a.body)}, ${arrToSql(a.sources)})`);
  sql.push(`INSERT INTO scene_annotations (id, section_id, line_start, line_end, citation_display, category, title, body, sources) VALUES ${rows.join(", ")};`);
}

// Trials
for (const s of sections) {
  if (s.trials.length === 0) continue;
  const rows = s.trials.map((t: any) => `(${esc(t.id)}, ${esc(s.section_id)}, ${esc(t.kind)}, ${esc(t.prompt)}, ${arrToSql(t.options)}, ${t.answer_index}, ${t.wisdom_reward}, ${t.anchor_line_start}, ${t.anchor_line_end})`);
  sql.push(`INSERT INTO trials (id, section_id, kind, prompt, options, answer_index, wisdom_reward, anchor_line_start, anchor_line_end) VALUES ${rows.join(", ")};`);
}

sql.push("COMMIT;");

fs.writeFileSync(OUT, sql.join("\n"));
console.log(`Wrote ${sql.length} SQL statements to ${OUT}`);
console.log(`File size: ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB`);
