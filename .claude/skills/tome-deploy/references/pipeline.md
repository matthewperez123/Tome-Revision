# Tome pipeline — reference

The complete per-stage detail behind `SKILL.md`. Read the section for the stage
you're running. All commands run from the repo root. Package manager: **pnpm**.

## Contents
- [Environment variables](#environment-variables)
- [Stage 1 — Ingest](#stage-1--ingest)
- [Stage 2 — Content sync to Supabase](#stage-2--content-sync-to-supabase)
- [Stage 3 — Quiz generation](#stage-3--quiz-generation)
- [Stage 4 — Audits](#stage-4--audits)
- [Stage 5 — Migrations (Supabase MCP)](#stage-5--migrations-supabase-mcp)
- [Stage 6 — Vercel deploy (Vercel MCP)](#stage-6--vercel-deploy-vercel-mcp)
- [Stage 7 — Verify](#stage-7--verify)
- [Database tables touched](#database-tables-touched)

---

## Environment variables

| Var | Used by | Notes |
|---|---|---|
| `SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL` | sync, quiz | REST base. |
| `SUPABASE_SERVICE_ROLE_KEY` | sync, quiz (writes) | **Service role** — bypasses RLS, required for writes. Never commit or echo it. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | quiz (read fallback), app runtime | Public anon key. Must exist on the Vercel project or the deployed app breaks. |
| `GITHUB_TOKEN` | ingest-se-books | Optional; raises GitHub API rate limit during prose ingest. |

The data scripts read both `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`; either
works. Writes always need `SUPABASE_SERVICE_ROLE_KEY`. If the service key isn't
available in the local shell, do the writes through the Supabase MCP
(`execute_sql`) instead, after showing the user the intended row counts.

---

## Stage 1 — Ingest

### Prose books — `scripts/ingest-se-books.ts`
Source: Standard Ebooks GitHub repos. To add a book, append a `BookConfig` to the
`BOOKS` array in the script:

```ts
{
  bookId: "the-castle",        // slug; becomes public/content/<bookId>/
  title: "The Castle",
  author: "Franz Kafka",
  repo: "franz-kafka_the-castle_willa-muir_edwin-muir", // after standardebooks/
  // ONE of:
  explicitFiles: ["chapter-1.xhtml"],         // exact files, reading order
  fileAllowlist: /^chapter-\d+\.xhtml$/,       // regex over the text/ dir
  // (omit both to fall back to TOC-driven discovery)
}
```

Run:
```bash
GITHUB_TOKEN=... npx tsx scripts/ingest-se-books.ts
```

Outputs per book: `public/content/<bookId>/meta.json` + `ch-0.json…ch-N.json`
(each chapter is `{ bookId, chapterIndex, title, wordCount, estimatedMinutes,
html }`). It also appends entries to `src/data/chapters.ts`. **Idempotent**: a
book with an existing `meta.json` is skipped; `chapters.ts` is skipped if it
already mentions the `bookId`.

Boilerplate (colophon, imprint, titlepage, endnotes, dedication, etc.) is
stripped automatically; SE-specific attributes/tags are normalized
(`<i>`→`<em>`, `<b>`→`<strong>`). Be polite to GitHub: the script sleeps between
calls (raw fetches ~500ms, API calls ~2.2s).

### Drama (Shakespeare) — `scripts/ingest-shakespeare.ts`
Two-step: the SE chapters must already be ingested into
`public/content/<work>/ch-*.json` (via the prose ingest path), then this parser
turns the table-based drama HTML into structured scenes.

1. Register the play in `scripts/config/works.ts` — a `WorkConfig` with:
   - `sceneMap`: maps `chapterIndex` → `{ act, scene }`, or `{ kind: "chorus",
     chapterIndex, sectionId, sceneTitle, afterAct }` for prologues/choruses.
   - `sceneTitles`: `{ "1_1": "A street in Verona", ... }`.
   - `tier1Sections?`: section IDs routed to Opus 4.6 at annotation time.
   - `strictContinuationRows?`: turn on for SE sources that use empty-speaker
     `<td/>` continuation rows + non-verb italic stage directions (e.g. Julius
     Caesar 3.1). Off by default to preserve prior plays' line numbering.
2. Run:
```bash
npx tsx scripts/ingest-shakespeare.ts --work-id <work>
```
Outputs to `content/<work>/`: one `<work>_act{N}_scene{M}.json` per scene
(plus `<work>_prologue.json` etc. for choruses), `_meta.json` (work metadata),
and `toc.json` (act/scene hierarchy). Each scene JSON carries `lines`,
`stage_directions`, `glosses`, `annotations`, `trials`.

Registered works: `hamlet`, `henry-v`, `julius-caesar`, `king-lear`, `macbeth`,
`othello`, `richard-iii`, `romeo-and-juliet`.

---

## Stage 2 — Content sync to Supabase

`scripts/sync-to-supabase.ts` upserts one work's structured content.

```bash
# 1) Dry run — prints tallies, writes nothing
npx tsx scripts/sync-to-supabase.ts --work <work> --dry-run

# 2) Real sync
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
  npx tsx scripts/sync-to-supabase.ts --work <work>
```

What it does, in order: upserts `works` (1 row), `sections`, then for `lines`
and `stage_directions` it **deletes the work's existing rows first, then
inserts** (compound/no natural PK), then upserts `glosses`, `scene_annotations`,
and `trials` by `id`. Batched in chunks of 500.

**Upsert-only and work-scoped** — it reads only `content/<work>/<work>_*.json`
+ `_meta.json` (excludes `toc.json`). Syncing Othello never touches Hamlet. Safe
to re-run.

Always do the `--dry-run` first and have the user eyeball the tallies; a sudden
drop in line/gloss counts means a parse regression upstream, not a sync problem.

---

## Stage 3 — Quiz generation

`scripts/generate-quizzes.ts` reads every row from `books` and generates quizzes.

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
  npx tsx scripts/generate-quizzes.ts
```

(Falls back to `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`, but
writes need the service role key.)

- `content_available` books → a "Comprehension Quiz" with **10** questions
  across 5 types (multiple_choice, true_false, fill_blank, matching,
  short_answer).
- metadata-only books → a "Quick Quiz" with **3** questions, batched 20 books at
  a time, questions inserted in sub-batches of 50.
- **Skips any book that already has a quiz** — re-running only fills gaps.

Writes to `quizzes` (id, book_id, title, difficulty) and `questions` (quiz_id,
type, prompt, options, correct_answer, explanation, order).

---

## Stage 4 — Audits

Run the bundled gate:
```bash
bash .claude/skills/tome-deploy/scripts/preflight.sh
```

It runs, fail-fast:
1. `pnpm audit:stoa --strict` — validates the 1:1 painting↔book invariant from
   `src/data/stoa-collection.ts` against `public/paintings/manifest.json` +
   `src/data/books.ts`. Writes a report to `scripts/output/stoa-audit-*.md`.
   This also runs in `prebuild`, so a failure here = a failed Vercel build.
2. `pnpm validate:achievements`.
3. `npx tsx scripts/verify-all-urls.mjs` — checks external painting URLs against
   the Wikimedia Commons API (network-dependent; treated as a soft check — see
   the script flag in preflight.sh).
4. `npx tsc --noEmit` — typecheck.
5. `pnpm lint` — eslint.
6. `pnpm build` — `next build` (re-runs the stoa audit via `prebuild`).

Any hard failure aborts. Capture the failing command's output and hand it to the
user with the offending file. Do not proceed to deploy on red.

---

## Stage 5 — Migrations (Supabase MCP)

Migrations live in `supabase/migrations/<timestamp>_<name>.sql` and are applied
via the Supabase MCP, not a CLI.

1. **Find what's pending**: `list_migrations` on the target project, diff against
   `ls supabase/migrations/`. Anything in the folder but not applied is pending.
2. **Summarize the SQL** in plain language: tables created/altered, RLS policies,
   indexes, defaults. The Tome convention is owner-only RLS
   (`auth.uid() = user_id`) with explicit insert+update policies so upserts pass
   RLS — call out any table that *disables* RLS.
3. **STOP. Show the user** the summary + target project ref and wait for an
   explicit go.
4. **Apply**: `apply_migration` — one call per migration file. `name` = filename
   without `.sql`; `query` = the file contents.
5. **Advisors**: immediately `get_advisors` for `security` then `performance`.
   - A security advisor warning (e.g. RLS disabled on a public table, function
     search_path) is a **red gate** — pause and surface it.
   - A performance advisor note (missing index on a FK) — report; usually
     non-blocking but worth a follow-up.

Never apply a migration the user hasn't reviewed. Read-only inspection of the
live schema is fine anytime via `execute_sql` (e.g. `select * from
information_schema.tables`).

---

## Stage 6 — Vercel deploy (Vercel MCP)

1. **Confirm the project**: `list_projects` / `get_project`. PROGRESS.md: the
   local `.vercel` link is `tome-recovery` (prod); `tome-beta-demo` is an
   alternate, both under team `team_VoPXql6glfQBBOJwInA7o5jK`. Confirm which one
   this release targets.
2. **Env check**: the project must have `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Missing → the app deploys but renders broken.
3. **Preview first**: `deploy_to_vercel` (non-production). Poll `get_deployment`
   until status READY. On ERROR, pull `get_deployment_build_logs`, surface the
   failure, stop. (A stoa-audit failure shows up here too via `prebuild`.)
4. **Verify the preview** (Stage 7) on the preview URL.
5. **STOP. Get approval**, then deploy to **production**. Poll to READY.

The framework is plain Next.js (`vercel.json` = `{"framework":"nextjs"}`); no
custom build command — Vercel runs `pnpm build`, which runs the stoa audit.

---

## Stage 7 — Verify

- **Routes** (WebFetch the deployment URL, assert 200 + expected markers):
  - `/` — landing.
  - `/library/browse` — the functional catalog (`/library` 308-redirects here).
  - `/dashboard` — app shell.
  - `/read/<bookId>` — for anything just ingested.
- **DB** (read-only `execute_sql`): confirm rows landed, e.g.
  `select count(*) from quizzes;`, `select count(*) from sections where work_id =
  '<work>';`.
- **Advisors**: re-run `get_advisors` if a migration was applied this release.
- **Report**: what shipped, production URL, row counts, advisor notes, deferred
  items. Mirror the PROGRESS.md house style (commit list, deployment id/URL,
  curl verification, deferred follow-ups) if the user keeps that log.

---

## Database tables touched

| Table | Written by | Key |
|---|---|---|
| `works` | sync-to-supabase | `id` |
| `sections` | sync-to-supabase | `id` |
| `lines` | sync-to-supabase (delete+insert) | `section_id,array_index` |
| `stage_directions` | sync-to-supabase (delete+insert) | (none) |
| `glosses` | sync-to-supabase | `id` |
| `scene_annotations` | sync-to-supabase | `id` |
| `trials` | sync-to-supabase | `id` |
| `books` | ingest / manual | `id` (read by quiz gen) |
| `quizzes` | generate-quizzes | `id` (skip if exists per `book_id`) |
| `questions` | generate-quizzes | (batch insert) |

Schema changes to any of these belong in a `supabase/migrations/` file applied
through Stage 5, never as an ad-hoc `execute_sql` DDL on prod.
