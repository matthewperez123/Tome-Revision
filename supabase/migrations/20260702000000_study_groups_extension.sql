-- ────────────────────────────────────────────────────────────────────────────
-- Study Groups: EXTEND the groups foundation (kind = 'study_group').
--
-- No new groups/members/posts/invites tables — Study Groups reuse the shared
-- public.groups primitive (membership, threaded posts, invites) exactly like
-- Book Clubs. This migration only adds the two study-specific surfaces:
--   * group_goals  — shared study targets (chapters / trials / minutes)
--   * group_notes  — collaborative notes
-- plus a leaderboard reader over the EXISTING quiz_results (passed Trials), so
-- Trial data is surfaced, never duplicated.
--
-- RLS mirrors the foundation: members read/write within their group; owners and
-- moderators moderate. Realtime is enabled on both tables so goals + notes feel
-- collaborative (discussion already streams via group_posts).
--
-- It also drops the legacy, pre-foundation public.study_groups /
-- study_group_members tables (both empty — verified 0 rows), which the demo
-- Study Groups page used before this rebuild.
-- ────────────────────────────────────────────────────────────────────────────

-- ── Retire the legacy standalone study-group tables (empty) ──────────────────
drop table if exists public.study_group_members cascade;
drop table if exists public.study_groups cascade;

-- ── Enum ─────────────────────────────────────────────────────────────────────
create type public.group_goal_target as enum ('chapters', 'trials', 'minutes');

-- ── group_goals ──────────────────────────────────────────────────────────────
-- A shared, group-wide study target. target_value is the goal amount; progress
-- is computed live in the app from reading_progress / quiz_results (real data),
-- never stored here. completed_at marks the goal as met (→ notify()).
create table public.group_goals (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  title text not null,
  target_type public.group_goal_target not null,
  target_value int not null check (target_value > 0),
  due_at timestamptz,
  created_by uuid not null references auth.users (id) on delete cascade,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create index group_goals_group_idx on public.group_goals (group_id, due_at);

-- ── group_notes ──────────────────────────────────────────────────────────────
-- Collaborative notes. Authored by a member; editable by the author or a
-- moderator (mirrors group_posts' moderation model).
create table public.group_notes (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text not null default '',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index group_notes_group_idx on public.group_notes (group_id, updated_at desc);

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table public.group_goals enable row level security;
alter table public.group_notes enable row level security;

-- group_goals: readable wherever the group is visible. Any active member may
-- create + update (shared targets are collaborative); the creator or a
-- moderator may delete.
create policy group_goals_select_visible on public.group_goals
  for select to authenticated
  using (public.group_is_visible(group_id, auth.uid()));
create policy group_goals_insert_member on public.group_goals
  for insert to authenticated
  with check (created_by = auth.uid() and public.is_group_member(group_id, auth.uid()));
create policy group_goals_update_member on public.group_goals
  for update to authenticated
  using (public.is_group_member(group_id, auth.uid()))
  with check (public.is_group_member(group_id, auth.uid()));
create policy group_goals_delete_owner_or_moderator on public.group_goals
  for delete to authenticated
  using (created_by = auth.uid() or public.is_group_moderator(group_id, auth.uid()));

-- group_notes: readable wherever the group is visible. Members author; authors
-- & moderators edit/delete.
create policy group_notes_select_visible on public.group_notes
  for select to authenticated
  using (public.group_is_visible(group_id, auth.uid()));
create policy group_notes_insert_member on public.group_notes
  for insert to authenticated
  with check (author_id = auth.uid() and public.is_group_member(group_id, auth.uid()));
create policy group_notes_update_author_or_moderator on public.group_notes
  for update to authenticated
  using (author_id = auth.uid() or public.is_group_moderator(group_id, auth.uid()))
  with check (author_id = auth.uid() or public.is_group_moderator(group_id, auth.uid()));
create policy group_notes_delete_author_or_moderator on public.group_notes
  for delete to authenticated
  using (author_id = auth.uid() or public.is_group_moderator(group_id, auth.uid()));

-- ── Grants ───────────────────────────────────────────────────────────────────
revoke all on public.group_goals from authenticated;
revoke all on public.group_notes from authenticated;
grant select, insert, update, delete on public.group_goals to authenticated;
grant select, insert, update, delete on public.group_notes to authenticated;

-- ── Trials leaderboard (read live from the EXISTING quiz_results) ────────────
-- One row per active member, aggregating their PASSED Trials. Gated so only
-- fellow members can see it. Reads the owner-only quiz_results via SECURITY
-- DEFINER — the Trial data is surfaced, not copied.
create or replace function public.group_trials_leaderboard(p_group uuid)
returns table (
  user_id uuid,
  display_name text,
  username text,
  avatar_url text,
  role public.group_member_role,
  trials_passed bigint,
  total_wisdom bigint,
  avg_score numeric,
  last_trial_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  _uid uuid := auth.uid();
begin
  if _uid is null then raise exception 'UNAUTHENTICATED'; end if;
  if not public.is_group_member(p_group, _uid) then raise exception 'NOT_A_MEMBER'; end if;

  return query
  select
    m.user_id,
    p.display_name,
    p.username,
    p.avatar_url,
    m.role,
    count(qr.id) filter (where qr.passed) as trials_passed,
    coalesce(sum(qr.wisdom_earned) filter (where qr.passed), 0) as total_wisdom,
    round(avg(qr.score) filter (where qr.passed), 0) as avg_score,
    max(qr.created_at) filter (where qr.passed) as last_trial_at
  from public.group_members m
  left join public.profiles p on p.id = m.user_id
  left join public.quiz_results qr on qr.user_id = m.user_id
  where m.group_id = p_group and m.status = 'active'
  group by m.user_id, p.display_name, p.username, p.avatar_url, m.role, m.joined_at
  order by total_wisdom desc, trials_passed desc, m.joined_at asc;
end;
$$;

grant execute on function public.group_trials_leaderboard(uuid) to authenticated;

-- ── Realtime ────────────────────────────────────────────────────────────────
alter publication supabase_realtime add table public.group_goals;
alter publication supabase_realtime add table public.group_notes;
