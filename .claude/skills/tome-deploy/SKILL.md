---
name: tome-deploy
description: >-
  The end-to-end release pipeline for Tome (the Next.js + Supabase + Vercel
  classics-reading app in this repo). Use this skill whenever the user wants to
  ship Tome changes, ingest a new book or play, sync content to the database,
  generate quizzes, apply a Supabase migration, deploy to Vercel, or run the
  pre-flight audits — even if they only say "deploy", "push this live",
  "ingest <title>", "sync <play> to supabase", "regenerate quizzes", "apply the
  migration", or "ship it". Trigger on any request that touches Tome's content
  ingestion (Standard Ebooks), the works/sections/lines/quizzes tables, the
  Stoa painting↔book invariant, database migrations, or a production release.
  This skill knows the exact scripts, env vars, gates, and the connected
  Supabase + Vercel MCP tools, so prefer it over ad-hoc commands.
---

# Tome Deploy

The release pipeline for **Tome** — a Next.js 16 / Supabase / Vercel app that
serves public-domain classics with structured drama content, glosses,
annotations, quizzes, and the Stoa painting gallery.

This skill encodes the *whole* chain so a release is reproducible and safe:

```
ingest → content sync → quiz gen → migrations → audits → Vercel deploy → verify
```

Every stage is opt-in. A plain "ship it" runs the **release tail** (audits →
migrations → deploy → verify). Data stages run only when the user is adding or
changing content.

## Operating principles

- **Execute through the connected MCP tools, not local secrets.** Supabase work
  goes through the Supabase MCP (`apply_migration`, `execute_sql`,
  `get_advisors`, `list_migrations`, `list_projects`). Vercel work goes through
  the Vercel MCP (`deploy_to_vercel`, `get_deployment`, `get_deployment_build_logs`,
  `list_projects`, `get_project`). Don't reach for `supabase`/`vercel` CLIs or
  `.env` files unless the MCP tools are unavailable and the user asks.
- **Stop-and-confirm at the two irreversible steps.** Never apply a migration to
  the live database or promote a Vercel **production** deploy without showing the
  user what will happen (dry-run / advisor output / preview URL) and getting an
  explicit "go". Everything before those gates can run unattended.
- **Fail closed.** If any gate fails — `audit:stoa --strict`, `tsc --noEmit`,
  `eslint`, `next build`, or a Supabase security/perf advisor warning — stop and
  report. Do not deploy on a red gate.
- **Idempotency is the design.** The ingest, sync, and quiz scripts all skip or
  upsert rather than duplicate. Re-running a stage is safe; lean on that instead
  of guessing state.
- **This is not the Next.js you know.** Per `AGENTS.md`, APIs and conventions
  differ from training data — read `node_modules/next/dist/docs/` before writing
  app code, and heed deprecation notices. This skill covers *release*, not app
  authoring.

Package manager is **pnpm** (the repo's `CLAUDE.md` calls scripts as
`pnpm audit:stoa`). All script entry points are `npx tsx scripts/...`.

## Before you start: confirm the targets

The live targets drift, so verify rather than hardcode:

- **Supabase project**: call `list_projects` and confirm the production ref with
  the user (PROGRESS.md references `vjaezrcuuzmbmnsfrtwt`). Use `list_migrations`
  to see what's already applied.
- **Vercel project**: call `list_projects` / `get_project`. PROGRESS.md notes the
  local `.vercel` link points at `tome-recovery` (prod), with `tome-beta-demo`
  as an alternate. Confirm which one this release targets before deploying.

If either is ambiguous, ask once, then proceed.

## The pipeline

Read `references/pipeline.md` for the full per-stage detail (exact flags, env
vars, input/output file layouts, table names). The summary below is the map; the
reference is the territory.

### Stage 0 — Plan
Establish what's changing. New prose book? New play? Migration only? Pure
code-change deploy? Pick the stages that apply and tell the user the plan. Use
the TodoList to track stages so nothing is silently skipped.

### Stage 1 — Ingest (only when adding a book/play)
- **Prose (Standard Ebooks)**: add a `BookConfig` entry, then
  `npx tsx scripts/ingest-se-books.ts`. Writes `public/content/{bookId}/meta.json`
  + `ch-N.json` and appends `src/data/chapters.ts`. Skips books that already have
  `meta.json`.
- **Drama (Shakespeare)**: register the play in `scripts/config/works.ts` (scene
  map + scene titles), pre-ingest its SE chapters, then
  `npx tsx scripts/ingest-shakespeare.ts --work-id <work>`. Produces
  `content/{work}/{work}_act{N}_scene{M}.json`, `_meta.json`, and `toc.json`.
  Registered works: hamlet, henry-v, julius-caesar, king-lear, macbeth, othello,
  richard-iii, romeo-and-juliet.

### Stage 2 — Content sync to Supabase (only when content changed)
`npx tsx scripts/sync-to-supabase.ts --work <work> --dry-run` first, review the
tallies (sections/lines/glosses/annotations/trials), then run without
`--dry-run`. **Upsert-only** — syncing one work never touches another. Needs
`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. If you can't run it with the
service key locally, do the equivalent upserts via the Supabase MCP
`execute_sql` after showing the user the row counts.

### Stage 3 — Quiz generation (only when books/content changed)
`npx tsx scripts/generate-quizzes.ts` — reads `books` from Supabase, writes
`quizzes` + `questions`. 10 questions for `content_available` books, 3 metadata
questions otherwise. **Skips books that already have a quiz**, so it's safe to
re-run after adding books.

### Stage 4 — Audits (always, before any deploy) — GATE
Run `scripts/preflight.sh` (bundled with this skill) from the repo root. It runs,
in order and fail-fast:
1. `pnpm audit:stoa --strict` — the 1:1 painting↔book invariant (also runs in
   `prebuild`/CI; a red here will fail the Vercel build too).
2. `pnpm validate:achievements`
3. `npx tsx scripts/verify-all-urls.mjs` (optional; painting URL liveness)
4. `npx tsc --noEmit`
5. `pnpm lint`
6. `pnpm build` (this re-runs `audit:stoa --strict` via `prebuild`).

Any non-zero exit stops the release. Report the failure with the offending file
and let the user fix before continuing. See `references/troubleshooting.md`.

### Stage 5 — Migrations — STOP-AND-CONFIRM GATE
If `supabase/migrations/` has files not in `list_migrations` output:
1. Read the new migration SQL and summarize what it changes (tables, RLS,
   indexes) in plain terms.
2. Show the user the diff/summary and the target project ref. **Wait for explicit
   approval.**
3. On approval, apply with the Supabase MCP `apply_migration` (one migration =
   one call, name = the migration filename without extension).
4. Immediately run `get_advisors` for `security` and `performance`. Surface any
   warning (e.g. a table with RLS disabled, a missing index). A security advisor
   warning is a red gate — pause.

Never apply a migration the user hasn't seen. PROGRESS.md's "Pending — DB
migration (NOT yet applied)" pattern is the norm: migrations wait for approval.

### Stage 6 — Vercel deploy — STOP-AND-CONFIRM GATE for production
1. Confirm the target Vercel project (Stage 0).
2. Deploy a **preview** first via `deploy_to_vercel` (non-prod). Poll
   `get_deployment` until READY; on failure pull `get_deployment_build_logs` and
   stop.
3. Verify the preview (Stage 7) before promoting.
4. **Production**: only after the user approves the preview, deploy to production.
   Confirm env vars exist on the target project (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`) — a deploy missing these renders a broken app.

### Stage 7 — Verify — GATE
- Hit the key routes and assert HTTP 200 + expected content: `/`, `/library`,
  `/dashboard`, plus a `/read/{bookId}` for anything just ingested. Use WebFetch
  on the deployment URL.
- For DB changes, run a read-only `execute_sql` count (e.g.
  `select count(*) from quizzes`) to confirm rows landed.
- Re-run `get_advisors` post-deploy if a migration was applied.
- Summarize: what shipped, the production URL, row counts, any advisor notes,
  and anything deferred.

## Quick recipes

**"Ship it" / "deploy" (code change only):** Stages 0, 4, 5 (if pending), 6, 7.

**"Ingest <title> and put it live":** Stages 0, 1, 4, 2, 3, 5, 6, 7. (Sync +
quizzes happen after audits pass on the new content files.)

**"Apply the pending migration":** Stage 5 then 7; deploy (6) only if the user
wants the app rebuilt against it.

**"Regenerate quizzes":** Stage 3 then a Stage 7 row-count check. No deploy needed
unless app code changed.

## Reference files
- `references/pipeline.md` — exhaustive per-stage commands, env vars, file
  layouts, table schemas, and the MCP call patterns. Read it before running any
  stage you're not 100% sure about.
- `references/troubleshooting.md` — the failure modes you'll actually hit
  (rate-limited ingest, RLS-blocked upserts, stoa audit failures, build env
  gaps) and their fixes.
- `scripts/preflight.sh` — the Stage 4 gate runner.
