# Tome deploy — troubleshooting

The failure modes you'll actually hit, by stage, with the fix. When in doubt,
the scripts are idempotent — re-running a stage is the safe default.

## Stage 1 — Ingest

**GitHub `403`/rate limit during prose ingest.** `ingest-se-books.ts` paces
itself (API ~2.2s, raw ~500ms) but unauthenticated calls still hit limits on big
omnibus repos. Fix: set `GITHUB_TOKEN`. Prefer `explicitFiles` over directory
listing for large books (e.g. Poor Folk uses a generated 55-file list) to avoid
the API entirely — raw.githubusercontent.com isn't rate-limited.

**Book "already ingested" but you want a re-pull.** The script skips when
`public/content/<bookId>/meta.json` exists. Delete that book's
`public/content/<bookId>/` dir to force a fresh ingest (and remove its block from
`src/data/chapters.ts` if you want it re-appended).

**Drama parse looks wrong (lines merged / mis-numbered).** The SE source likely
uses empty-speaker `<td/>` continuation rows and non-verb italic stage
directions. Set `strictContinuationRows: true` on that play's `WorkConfig`. Leave
it off for already-shipped plays so their line numbers don't shift.

**Chorus/prologue missing from the TOC.** Add a `{ kind: "chorus", chapterIndex,
sectionId, sceneTitle, afterAct }` entry (use `afterAllActs: true` for an
epilogue like Henry V's). Plain `{ chapterIndex, act, scene }` entries fold into
acts; chorus entries are standalone TOC rows.

## Stage 2 — Content sync

**`row-level security policy` error on upsert.** You're using the anon key. Sync
writes need `SUPABASE_SERVICE_ROLE_KEY` (it bypasses RLS). Export it, or do the
upsert via the Supabase MCP `execute_sql` (the MCP connection has write access).

**Line/gloss counts dropped vs last sync.** This is a parse regression upstream,
not a sync bug — `--dry-run` is showing you what's in `content/<work>/`. Re-ingest
(Stage 1) before syncing. Don't sync a regression to prod.

**Synced the wrong work.** Harmless — sync is work-scoped and upsert-only; other
works are untouched. Just sync the correct one.

## Stage 3 — Quiz generation

**Quiz didn't regenerate after I changed content.** By design — the script skips
any `book_id` that already has a quiz row. To force regen, delete that book's
`quizzes` row (cascade should clear its `questions`) via `execute_sql`, then
re-run.

**`Supabase ... 401/403`.** Same as sync: writes need the service role key.

## Stage 4 — Audits (the gate)

**`audit:stoa --strict` fails.** The 1:1 painting↔book invariant is broken — a
book without a painting, two paintings on one book, or a `unlockingBookId`
pointing at a missing book. The report is at `scripts/output/stoa-audit-*.md`.
Per `CLAUDE.md`: when you add a book you must add its paired painting at the same
time. This is a hard gate — it also runs in `prebuild`, so the Vercel build will
fail identically. Fix `src/data/stoa-collection.ts` / the manifest, don't bypass.

**`tsc --noEmit` errors that predate your change.** Check `PROGRESS.md` — there
are known-pre-existing failures (e.g. missing `vitest` types in
`src/components/sidebar/animations/__tests__/`). Don't let a *pre-existing* red
block the release, but never introduce a *new* one. Compare against the baseline.

**`next build` fails only on Vercel, passes locally.** Usually a missing env var
on the Vercel project or a case-sensitivity/path difference. Check the project's
env vars (Stage 6 step 2) and the build logs (`get_deployment_build_logs`).

**`verify-all-urls.mjs` reports dead painting URLs.** Network/Wikimedia
flakiness vs a genuinely moved asset. It's a soft check in `preflight.sh` (it
won't abort the release). If a URL truly 404s, fix it in
`public/paintings/manifest.json` before shipping.

## Stage 5 — Migrations

**A migration is in the folder but `list_migrations` doesn't show it.** It's
pending — that's the cue to run Stage 5 (after user approval). The
"Pending — DB migration (NOT yet applied)" note in `PROGRESS.md` is the normal
holding pattern.

**`get_advisors` flags RLS disabled on a new table.** Red gate. The Tome
convention is owner-only RLS (`auth.uid() = user_id`) with explicit insert +
update policies so upserts pass. Add the policies in the migration and re-apply
before deploying.

**Applied to the wrong project.** Migrations are environment-specific. Always
confirm the project ref with `list_projects` before `apply_migration`. If you hit
the wrong one, write a corrective migration — don't hand-edit prod schema.

## Stage 6 — Vercel

**Deploy READY but the app is blank/erroring at runtime.** Almost always missing
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` on the project. Add
them, redeploy. PROGRESS.md records copying these from a sibling project's
production env via `vercel env pull` when bootstrapping a new project.

**Deployed to the wrong Vercel project.** Two live projects exist
(`tome-recovery` prod, `tome-beta-demo` alternate). The local `.vercel` link can
be swapped (PROGRESS.md keeps `.vercel/project.json.tome-beta-demo` around).
Always confirm via `get_project` before promoting to production.

**Build logs show the stoa audit failing.** Same root cause as Stage 4 — the
`prebuild` hook runs `audit:stoa --strict` on Vercel too. Fix locally, re-run
`preflight.sh` green, then redeploy.

## General

**Not sure what state prod is in.** Inspect, don't guess: `list_migrations`,
`list_deployments` / `get_deployment`, and read-only `execute_sql` counts. Every
stage is idempotent, so reconciling by re-running the relevant stage is safe.

**"This is not the Next.js you know."** If you need to touch app code mid-release
(not just ship it), read the relevant guide in `node_modules/next/dist/docs/`
first — `AGENTS.md` warns the conventions differ from training data.
