#!/usr/bin/env npx tsx
/**
 * cover-cull-manifest.ts — Phase 3 DRY RUN. Makes ZERO changes.
 *
 * Produces a manifest of every in-scope book cover that will be REMOVED per the
 * instruction: "remove all custom-designed covers and public-domain covers".
 *
 * Scope (all marked decision="remove"):
 *   1. Public-domain Standard Ebooks covers   → DB books.cover_image_path = /covers/<id>.jpg
 *   2. Tome custom-designed covers            → public/covers/tome/generated/images/<id>.jpg
 *   3. Museum painting covers                 → src/data/generated/cover-art-data.ts
 *
 * Emits:
 *   reports/cover-cull-<date>.md
 *   reports/cover-cull-<date>.csv
 *
 * Usage: npx tsx scripts/cover-cull-manifest.ts
 */

import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { GENERATED_BOOK_COVER_ART } from "../src/data/generated/cover-art-data";

const ROOT = path.resolve(__dirname, "..");
config({ path: path.join(ROOT, ".env.local") });

type Decision = "keep" | "remove" | "review";
type Source = "standard-ebooks" | "tome-generated" | "museum";

interface ManifestRow {
  book_id: string;
  title: string;
  author: string;
  source: Source;
  cover_url: string; // current cover asset path/url
  asset_file: string; // local file on disk (relative to repo root), or "" if remote
  decision: Decision;
  confidence: number;
  reason: string;
}

function csvEscape(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function main() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("ERROR: Need SUPABASE_URL + a Supabase key in .env.local");
    process.exit(1);
  }
  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  // 1. Public-domain Standard Ebooks covers (DB-driven)
  const { data: books, error } = await supabase
    .from("books")
    .select("id, title, author, cover_image_path")
    .not("cover_image_path", "is", null)
    .order("id");
  if (error) {
    console.error("ERROR querying books:", error.message);
    process.exit(1);
  }

  const rows: ManifestRow[] = [];

  for (const b of books ?? []) {
    const coverPath: string = b.cover_image_path; // DB value, e.g. /covers/<id>.jpg
    // Real file lives under public/covers/covers/ (DB path is skewed; served via
    // /covers/covers/<id>.jpg). Derive the real on-disk file from the basename.
    const basename = path.posix.basename(coverPath);
    const assetFile = `public/covers/covers/${basename}`;
    rows.push({
      book_id: b.id,
      title: b.title,
      author: b.author ?? "",
      source: "standard-ebooks",
      cover_url: coverPath,
      asset_file: assetFile,
      decision: "remove",
      confidence: 1,
      reason: "public-domain Standard Ebooks cover",
    });
  }

  // Lookup for titles/authors by book_id (to enrich tome + museum rows)
  const metaById = new Map<string, { title: string; author: string }>();
  for (const b of books ?? [])
    metaById.set(b.id, { title: b.title, author: b.author ?? "" });

  // 2. Tome custom-designed covers (filesystem-driven)
  const tomeDir = path.join(ROOT, "public/covers/tome/generated/images");
  const tomeFiles = fs.existsSync(tomeDir)
    ? fs.readdirSync(tomeDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    : [];
  for (const f of tomeFiles.sort()) {
    const id = f.replace(/\.(jpe?g|png|webp)$/i, "");
    const meta = metaById.get(id);
    rows.push({
      book_id: id,
      title: meta?.title ?? id,
      author: meta?.author ?? "",
      source: "tome-generated",
      cover_url: `/covers/tome/generated/images/${f}`,
      asset_file: `public/covers/tome/generated/images/${f}`,
      decision: "remove",
      confidence: 1,
      reason: "tome custom-designed cover",
    });
  }

  // 3. Museum painting covers (data-file-driven)
  for (const art of Object.values(GENERATED_BOOK_COVER_ART)) {
    const meta = metaById.get(art.bookId);
    // cover-art-data localPath is /covers/museum/<id>.jpg, but ClassicsCover
    // rewrites that to /covers/covers/museum/<id>.jpg (the real served path).
    const basename = art.localPath
      ? path.posix.basename(art.localPath)
      : `${art.bookId}.jpg`;
    const servedPath = `/covers/covers/museum/${basename}`;
    const localFile = `public/covers/covers/museum/${basename}`;
    rows.push({
      book_id: art.bookId,
      title: meta?.title ?? art.bookId,
      author: meta?.author ?? "",
      source: "museum",
      cover_url: servedPath,
      asset_file: localFile,
      decision: "remove",
      confidence: 1,
      reason: `museum painting (${art.medium})`,
    });
  }

  // Verify which local asset files actually exist on disk
  for (const r of rows) {
    if (r.asset_file) {
      const exists = fs.existsSync(path.join(ROOT, r.asset_file));
      if (!exists) r.reason += " [FILE MISSING ON DISK]";
    }
  }

  // Summary
  const total = rows.length;
  const remove = rows.filter((r) => r.decision === "remove").length;
  const keep = rows.filter((r) => r.decision === "keep").length;
  const review = rows.filter((r) => r.decision === "review").length;
  const bySource = {
    "standard-ebooks": rows.filter((r) => r.source === "standard-ebooks").length,
    "tome-generated": rows.filter((r) => r.source === "tome-generated").length,
    museum: rows.filter((r) => r.source === "museum").length,
  };
  const distinctBooks = new Set(rows.map((r) => r.book_id)).size;
  const libraryTotal = 1280; // public.books row count
  const removePctOfLibrary = ((distinctBooks / libraryTotal) * 100).toFixed(1);

  // Write reports
  const date = new Date().toISOString().slice(0, 10);
  const reportsDir = path.join(ROOT, "reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  // CSV
  const header = [
    "title",
    "author",
    "book_id",
    "source",
    "cover_url",
    "asset_file",
    "decision",
    "confidence",
    "reason",
  ];
  const csvLines = [header.join(",")];
  for (const r of rows) {
    csvLines.push(
      [
        r.title,
        r.author,
        r.book_id,
        r.source,
        r.cover_url,
        r.asset_file,
        r.decision,
        r.confidence,
        r.reason,
      ]
        .map(csvEscape)
        .join(","),
    );
  }
  const csvPath = path.join(reportsDir, `cover-cull-${date}.csv`);
  fs.writeFileSync(csvPath, csvLines.join("\n") + "\n");

  // Markdown
  const md: string[] = [];
  md.push(`# Cover Cull Manifest — ${date} (DRY RUN, no changes made)`);
  md.push("");
  md.push(
    `Instruction: **remove all custom-designed covers and public-domain covers.** Every in-scope cover below is marked \`remove\`.`,
  );
  md.push("");
  md.push("## Summary");
  md.push("");
  md.push(`- Total cover assets in scope: **${total}**`);
  md.push(`- Distinct books affected: **${distinctBooks}** of ${libraryTotal} (${removePctOfLibrary}% of library)`);
  md.push(`- remove: **${remove}** | keep: ${keep} | review: ${review}`);
  md.push(`- By source:`);
  md.push(`  - standard-ebooks (public domain): ${bySource["standard-ebooks"]}`);
  md.push(`  - tome-generated (custom designed): ${bySource["tome-generated"]}`);
  md.push(`  - museum (paintings): ${bySource["museum"]}`);
  md.push("");
  md.push("## Covers to remove");
  md.push("");
  md.push("| Title | Author | book_id | Source | Cover | Decision | Conf | Reason |");
  md.push("|---|---|---|---|---|---|---|---|");
  for (const r of rows) {
    md.push(
      `| ${r.title} | ${r.author} | ${r.book_id} | ${r.source} | \`${r.cover_url}\` | ${r.decision} | ${r.confidence} | ${r.reason} |`,
    );
  }
  md.push("");
  md.push("## Phase 4 plan (NOT YET EXECUTED — awaiting explicit approval)");
  md.push("");
  md.push("All steps reversible. No hard deletes.");
  md.push("");
  md.push("**A. Back up affected DB rows**");
  md.push("```sql");
  md.push("create table if not exists public.cover_archive (");
  md.push("  book_id text primary key,");
  md.push("  cover_image_path text,");
  md.push("  archived_at timestamptz not null default now()");
  md.push(");");
  md.push("insert into public.cover_archive (book_id, cover_image_path)");
  md.push("select id, cover_image_path from public.books");
  md.push("where cover_image_path is not null");
  md.push("on conflict (book_id) do nothing;");
  md.push("```");
  md.push("");
  md.push("**B. Null the DB cover references (public-domain set)**");
  md.push("```sql");
  md.push("update public.books set cover_image_path = null");
  md.push("where cover_image_path is not null;");
  md.push("```");
  md.push("");
  md.push("**C. Archive cover image files (filesystem, reversible move — no delete)**");
  md.push("```bash");
  md.push("mkdir -p archive/covers");
  md.push("# Standard Ebooks (public domain): real files live in public/covers/covers/");
  md.push("git mv public/covers/covers/<id>.jpg archive/covers/   # one per row, source=standard-ebooks (see asset_file column)");
  md.push("# Tome custom-designed:");
  md.push("git mv public/covers/tome/generated/images archive/covers/tome-generated");
  md.push("# Museum paintings (incl. .webp + thumbs/):");
  md.push("git mv public/covers/covers/museum archive/covers/museum");
  md.push("```");
  md.push("");
  md.push("> NOTE: DB `cover_image_path` is stored as `/covers/<id>.jpg` but the real file is `public/covers/covers/<id>.jpg` (served `/covers/covers/...`). The `asset_file` column in the CSV is the authoritative on-disk path to move.");
  md.push("");
  md.push("**D. Retire code-level cover sources so render falls back to procedural**");
  md.push("- Empty `GENERATED_BOOK_COVER_ART` in `src/data/generated/cover-art-data.ts` (museum precedence).");
  md.push("- Disable tome-generated cover lookup so precedence chain reaches procedural fallback.");
  md.push("");
  md.push("**E. Verify** logged-out library grid + a book detail page render the procedural fallback with no broken images / hydration errors.");
  md.push("");
  fs.writeFileSync(path.join(reportsDir, `cover-cull-${date}.md`), md.join("\n"));

  // Console summary
  console.log("=== Cover Cull Manifest (DRY RUN) ===");
  console.log(`Reports written:`);
  console.log(`  reports/cover-cull-${date}.md`);
  console.log(`  reports/cover-cull-${date}.csv`);
  console.log("");
  console.log(`Total cover assets in scope: ${total}`);
  console.log(`Distinct books affected: ${distinctBooks} of ${libraryTotal} (${removePctOfLibrary}% of library)`);
  console.log(`remove=${remove} keep=${keep} review=${review}`);
  console.log(`By source: standard-ebooks=${bySource["standard-ebooks"]} tome-generated=${bySource["tome-generated"]} museum=${bySource.museum}`);
  const missing = rows.filter((r) => r.reason.includes("FILE MISSING"));
  if (missing.length)
    console.log(`Note: ${missing.length} rows reference a local file not found on disk (flagged in manifest).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
