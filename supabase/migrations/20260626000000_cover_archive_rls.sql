-- Enable Row-Level Security on public.cover_archive.
--
-- cover_archive is an internal backup/manifest of culled book cover paths,
-- written only by maintenance scripts (scripts/cover-cull-manifest.ts) using the
-- Supabase service-role key. The service role bypasses RLS, so those scripts and
-- the dashboard keep full access. The table is never read by the app's anon
-- client. With RLS enabled and no policies, anon/authenticated are denied all
-- access (deny-by-default), closing the "publicly readable/writable" hole the
-- database linter flagged (rls_disabled_in_public).
alter table public.cover_archive enable row level security;
