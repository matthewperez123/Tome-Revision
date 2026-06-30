-- Community activity feed: a real, privacy-scoped social graph of reading
-- milestones. Privacy-first / deny-by-default RLS.
--
-- One row per milestone (book_started, book_completed, trial_passed,
-- seal_earned, club_joined, session_completed). Visibility is an ordered enum
-- private < friends < public (default 'friends'). A viewer sees:
--   * their own activities,
--   * friends' activities whose visibility is friends-or-public,
--   * public activities from anyone — EXCEPT student-flagged accounts, for whom
--     the global/public surface is OFF (their feed is friends-only).
--
-- Activities are NEVER inserted by clients directly: the only write path is the
-- SECURITY DEFINER record_activity() emitter (called from the existing server
-- flows). It dedupes milestone events and downgrades a student's 'public'
-- request to 'friends' so a minor can never broadcast globally.
--
-- Applied out-of-band to project vjaezrcuuzmbmnsfrtwt via Supabase MCP
-- (apply_migration name=community_activity). This file is the repo-of-record.

-- ── Enums ────────────────────────────────────────────────────────────────────

create type public.activity_type as enum (
  'book_started',
  'book_completed',
  'trial_passed',
  'seal_earned',
  'club_joined',
  'session_completed'
);

-- Declaration order IS the comparison order: private < friends < public, so
-- `visibility >= 'friends'` works directly in policies.
create type public.activity_visibility as enum (
  'private',
  'friends',
  'public'
);

-- ── Helpers (SECURITY DEFINER) ───────────────────────────────────────────────

-- True when two users share an ACCEPTED friendship (unordered pair). Replaces
-- the stale are_connected() that referenced the dropped `connections` table.
create or replace function public.are_friends(p_a uuid, p_b uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.friendships f
    where f.status = 'accepted'
      and (
        (f.requester_id = p_a and f.addressee_id = p_b)
        or (f.requester_id = p_b and f.addressee_id = p_a)
      )
  );
$$;

-- True for student-flagged accounts (school market / minors). These accounts
-- get a friends-only feed and can never broadcast publicly.
create or replace function public.is_student(p_uid uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = p_uid and p.role = 'student'
  );
$$;

-- ── activities ───────────────────────────────────────────────────────────────

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users (id) on delete cascade,
  type public.activity_type not null,
  entity_type text,
  entity_id text,
  visibility public.activity_visibility not null default 'friends',
  created_at timestamptz not null default now()
);

create index activities_actor_created_idx
  on public.activities (actor_id, created_at desc);
create index activities_visibility_created_idx
  on public.activities (visibility, created_at desc);
-- Milestone idempotency: at most one row per (actor, type, entity). Re-passing
-- a chapter quiz or re-finishing a book never spams the feed.
create unique index activities_actor_type_entity_idx
  on public.activities (actor_id, type, entity_id)
  where entity_id is not null;

alter table public.activities enable row level security;

create policy activities_select_visible
  on public.activities
  for select
  to authenticated
  using (
    actor_id = auth.uid()
    or (visibility >= 'friends' and public.are_friends(auth.uid(), actor_id))
    or (visibility = 'public' and not public.is_student(auth.uid()))
  );

-- No insert/update/delete policies: the ONLY write path is record_activity()
-- below (SECURITY DEFINER, bypasses RLS). Clients cannot forge activities.
revoke all on table public.activities from anon, authenticated;
grant select on table public.activities to authenticated;

-- ── activity_reactions ───────────────────────────────────────────────────────

create table public.activity_reactions (
  activity_id uuid not null references public.activities (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,
  created_at timestamptz not null default now(),
  primary key (activity_id, user_id, kind),
  constraint activity_reactions_kind_check
    check (kind in ('cheer', 'insight', 'same', 'inspired'))
);

create index activity_reactions_activity_idx
  on public.activity_reactions (activity_id);

alter table public.activity_reactions enable row level security;

-- Reactions are readable exactly when the parent activity is (the subquery is
-- subject to activities' RLS for the current user).
create policy activity_reactions_select
  on public.activity_reactions
  for select
  to authenticated
  using (
    exists (select 1 from public.activities a where a.id = activity_id)
  );

create policy activity_reactions_insert
  on public.activity_reactions
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.activities a where a.id = activity_id)
  );

create policy activity_reactions_delete
  on public.activity_reactions
  for delete
  to authenticated
  using (user_id = auth.uid());

revoke all on table public.activity_reactions from anon, authenticated;
grant select, insert, delete on table public.activity_reactions to authenticated;

-- ── reports (moderation) ─────────────────────────────────────────────────────

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,
  content_id text not null,
  reporter_id uuid not null references auth.users (id) on delete cascade,
  reason text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create index reports_content_idx on public.reports (content_type, content_id);

alter table public.reports enable row level security;

-- Insert-only by the reporter. NO select policy → only the service role (which
-- bypasses RLS) can read the moderation queue.
create policy reports_insert_own
  on public.reports
  for insert
  to authenticated
  with check (reporter_id = auth.uid());

revoke all on table public.reports from anon, authenticated;
grant insert on table public.reports to authenticated;

-- ── record_activity() — the sole emit path ───────────────────────────────────

create or replace function public.record_activity(
  p_type public.activity_type,
  p_entity_type text default null,
  p_entity_id text default null,
  p_visibility public.activity_visibility default 'friends'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_visibility public.activity_visibility := coalesce(p_visibility, 'friends');
  v_id uuid;
begin
  if v_uid is null then
    raise exception 'UNAUTHENTICATED';
  end if;

  -- Students never broadcast publicly: downgrade to friends-only.
  if v_visibility = 'public' and public.is_student(v_uid) then
    v_visibility := 'friends';
  end if;

  insert into public.activities (actor_id, type, entity_type, entity_id, visibility)
  values (v_uid, p_type, p_entity_type, p_entity_id, v_visibility)
  on conflict (actor_id, type, entity_id) where (entity_id is not null)
  do nothing
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.are_friends(uuid, uuid) from public;
revoke all on function public.is_student(uuid) from public;
revoke all on function public.record_activity(public.activity_type, text, text, public.activity_visibility) from public;
grant execute on function public.are_friends(uuid, uuid) to authenticated;
grant execute on function public.is_student(uuid) to authenticated;
grant execute on function public.record_activity(public.activity_type, text, text, public.activity_visibility) to authenticated;

-- ── Realtime ─────────────────────────────────────────────────────────────────
-- Feeds re-fetch on any change to a row the subscriber can see (RLS still gates
-- which rows reach each client).
alter publication supabase_realtime add table public.activities;
alter publication supabase_realtime add table public.activity_reactions;
