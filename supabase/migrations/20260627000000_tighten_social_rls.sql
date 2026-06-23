-- Tighten remaining database-linter security findings.

-- 1. book_toc: switch the view to security_invoker so it enforces the querying
-- user's RLS on public.chapters (public-readable) instead of running with the
-- view owner's privileges. Clears 0010_security_definer_view.
alter view public.book_toc set (security_invoker = true);

-- 2. Scope the permissive social-table write policies to the row owner.
-- achievements, leaderboard, and community_activity previously allowed ANY
-- caller (role public, including anonymous) to INSERT/UPDATE arbitrary rows via
-- WITH CHECK (true) / USING (true). Restrict writes to authenticated users
-- acting on their own user_id. Public SELECT is intentional and preserved.
-- Clears 0024_permissive_rls_policy.

-- achievements
drop policy if exists "Allow achievement inserts" on public.achievements;
drop policy if exists "Allow achievement updates" on public.achievements;
create policy "Users insert own achievements" on public.achievements
  for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "Users update own achievements" on public.achievements
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- leaderboard
drop policy if exists "Allow leaderboard inserts" on public.leaderboard;
drop policy if exists "Allow leaderboard updates" on public.leaderboard;
create policy "Users insert own leaderboard row" on public.leaderboard
  for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "Users update own leaderboard row" on public.leaderboard
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- community_activity (INSERT only; no UPDATE policy existed)
drop policy if exists "Allow activity inserts" on public.community_activity;
create policy "Users insert own activity" on public.community_activity
  for insert to authenticated
  with check (user_id = (select auth.uid()));
