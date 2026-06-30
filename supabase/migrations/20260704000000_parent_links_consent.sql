-- Parents / guardians: consent-based linking to a student account.
--
-- A single row models a DIRECTED parent→student relationship. Unlike the
-- symmetric friendships graph, the two parties play distinct roles, so the
-- pair (parent_id, student_id) is unique (at most one link per pair).
--
-- CONSENT IS THE WHOLE POINT (minors' data): a link is created `pending` by
-- one party and only ever becomes `active` when the OTHER party confirms.
-- RLS makes "auto-active" structurally impossible — the initiator literally
-- cannot write status='active' (the update WITH CHECK requires
-- auth.uid() <> initiated_by). Either party may revoke at any time, which
-- immediately severs the parent's read access (the dashboard RPCs gate on an
-- `active` link).
--
-- A parent reads a linked student's owner-only reading_progress / quiz_results
-- exclusively through the SECURITY DEFINER dashboard RPCs below — never a
-- direct table read (those tables stay auth.uid()=user_id). The parent gets
-- NO access to private social content (friends, DMs, group posts); only
-- progress, achievements, and reading-time engagement are exposed.
--
-- Applied out-of-band to project vjaezrcuuzmbmnsfrtwt via Supabase MCP
-- (apply_migration name=parent_links_consent). This file is the repo-of-record.

create type public.parent_link_status as enum ('pending', 'active', 'revoked');

create table public.parent_links (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users (id) on delete cascade,
  student_id uuid not null references auth.users (id) on delete cascade,
  status public.parent_link_status not null default 'pending',
  initiated_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  consented_at timestamptz,
  constraint parent_links_distinct_parties check (parent_id <> student_id),
  -- The initiator must be one of the two parties, so the confirmer is always
  -- the OTHER party — there is no third-party path to an active link.
  constraint parent_links_initiator_is_party
    check (initiated_by = parent_id or initiated_by = student_id)
);

-- At most one link per (parent, student) pair.
create unique index parent_links_unique_pair
  on public.parent_links (parent_id, student_id);
create index parent_links_student_status_idx
  on public.parent_links (student_id, status);
create index parent_links_parent_status_idx
  on public.parent_links (parent_id, status);

alter table public.parent_links enable row level security;

-- Either party sees the row; nobody else.
create policy parent_links_select_party
  on public.parent_links
  for select
  to authenticated
  using (auth.uid() = parent_id or auth.uid() = student_id);

-- You may only OPEN a link you are a party to, as the initiator, in pending.
create policy parent_links_insert_as_initiator
  on public.parent_links
  for insert
  to authenticated
  with check (
    auth.uid() = initiated_by
    and (initiated_by = parent_id or initiated_by = student_id)
    and status = 'pending'
  );

-- Updates: the OTHER party confirms (-> active); either party revokes
-- (-> revoked). Column grants below limit writable columns to
-- (status, consented_at). The `auth.uid() <> initiated_by` clause on the
-- active transition is what makes consent non-bypassable.
create policy parent_links_update_respond
  on public.parent_links
  for update
  to authenticated
  using (auth.uid() = parent_id or auth.uid() = student_id)
  with check (
    (
      status = 'active'
      and auth.uid() <> initiated_by
      and (auth.uid() = parent_id or auth.uid() = student_id)
    )
    or (
      status = 'revoked'
      and (auth.uid() = parent_id or auth.uid() = student_id)
    )
  );

-- Either party may delete the row (withdraw a pending invite / remove a link).
create policy parent_links_delete_party
  on public.parent_links
  for delete
  to authenticated
  using (auth.uid() = parent_id or auth.uid() = student_id);

revoke all on table public.parent_links from anon, authenticated;
grant select, insert, delete on table public.parent_links to authenticated;
grant update (status, consented_at) on table public.parent_links to authenticated;

-- Live updates so a confirm/revoke reflects on both parties' screens at once
-- (RLS still gates which rows reach each client).
alter publication supabase_realtime add table public.parent_links;

-- ── Active-link helper (definer → no recursion, single source of truth) ──────

create or replace function public.is_active_parent_link(p_parent uuid, p_student uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.parent_links
    where parent_id = p_parent
      and student_id = p_student
      and status = 'active'
  );
$$;

revoke all on function public.is_active_parent_link(uuid, uuid) from public;
grant execute on function public.is_active_parent_link(uuid, uuid) to authenticated;

-- ── Discovery: resolve a user by their shared-secret code ────────────────────
-- Reuses profiles.friend_code as the linking secret. A code is not enumerable
-- (no open handle/email search that could surface a minor), so this is the
-- sole sanctioned way for a guardian and student to find each other. Excludes
-- the caller. Returns role so the UI can label parent-vs-student.

create or replace function public.find_user_by_link_code(p_code text)
returns table (id uuid, display_name text, username text, avatar_url text, role text)
language sql
security definer
set search_path = ''
stable
as $$
  select p.id, p.display_name, p.username, p.avatar_url, p.role
  from public.profiles p
  where upper(p.friend_code) = upper(trim(both from p_code))
    and p.id <> auth.uid()
  limit 1;
$$;

revoke all on function public.find_user_by_link_code(text) from public;
grant execute on function public.find_user_by_link_code(text) to authenticated;

-- ── Dashboard RPCs (the ONLY path a parent reads a child's owner-only data) ──
-- Each is SECURITY DEFINER and hard-gated on an ACTIVE link for the caller, so
-- revoking a link instantly cuts access and an unlinked user is denied.

create or replace function public.parent_child_overview(p_student uuid)
returns table (
  student_id uuid,
  display_name text,
  username text,
  avatar_url text,
  current_streak int,
  total_wisdom int,
  books_started int,
  chapters_read int,
  trials_passed int,
  avg_score int,
  achievements_count int,
  last_active_at timestamptz,
  active_days_30 int
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;
  if not public.is_active_parent_link(auth.uid(), p_student) then
    raise exception 'NOT_LINKED';
  end if;

  return query
  select
    p_student,
    pr.display_name,
    pr.username,
    pr.avatar_url,
    coalesce(pr.current_streak, 0),
    coalesce(pr.total_xp, 0),
    coalesce((select count(distinct rp.book_id)::int
              from public.reading_progress rp where rp.user_id = p_student), 0),
    coalesce((select sum(rp.chapter_index + 1)::int
              from public.reading_progress rp where rp.user_id = p_student), 0),
    coalesce((select count(*)::int
              from public.quiz_results qr
              where qr.user_id = p_student and qr.passed), 0),
    coalesce((select round(avg(qr.score))::int
              from public.quiz_results qr where qr.user_id = p_student), 0),
    coalesce((select count(*)::int
              from public.achievements a where a.user_id = p_student), 0),
    greatest(
      (select max(rp.updated_at) from public.reading_progress rp where rp.user_id = p_student),
      (select max(qr.created_at) from public.quiz_results qr where qr.user_id = p_student)
    ),
    coalesce((
      select count(distinct d)::int from (
        select date(rp.updated_at) as d
        from public.reading_progress rp
        where rp.user_id = p_student
          and rp.updated_at >= now() - interval '30 days'
        union
        select date(qr.created_at) as d
        from public.quiz_results qr
        where qr.user_id = p_student
          and qr.created_at >= now() - interval '30 days'
      ) days
    ), 0)
  from public.profiles pr
  where pr.id = p_student;
end;
$$;

revoke all on function public.parent_child_overview(uuid) from public;
grant execute on function public.parent_child_overview(uuid) to authenticated;

create or replace function public.parent_child_activity(p_student uuid, p_limit int default 20)
returns table (
  occurred_at timestamptz,
  kind text,
  book_id text,
  detail text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;
  if not public.is_active_parent_link(auth.uid(), p_student) then
    raise exception 'NOT_LINKED';
  end if;

  return query
  select * from (
    select rp.updated_at as occurred_at, 'reading'::text as kind, rp.book_id,
           ('Reached chapter ' || (rp.chapter_index + 1))::text as detail
    from public.reading_progress rp
    where rp.user_id = p_student
    union all
    select qr.created_at, 'trial'::text, qr.book_id,
           (initcap(coalesce(qr.difficulty, 'trial')) || ' Trial — ' || qr.score || '%'
            || case when qr.passed then ' (passed)' else '' end)::text
    from public.quiz_results qr
    where qr.user_id = p_student
    union all
    select a.earned_at, 'achievement'::text, null::text, a.name::text
    from public.achievements a
    where a.user_id = p_student and a.earned_at is not null
  ) feed
  order by feed.occurred_at desc nulls last
  limit greatest(p_limit, 1);
end;
$$;

revoke all on function public.parent_child_activity(uuid, int) from public;
grant execute on function public.parent_child_activity(uuid, int) to authenticated;

create or replace function public.parent_child_achievements(p_student uuid, p_limit int default 12)
returns table (
  name text,
  description text,
  icon text,
  rarity text,
  earned_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;
  if not public.is_active_parent_link(auth.uid(), p_student) then
    raise exception 'NOT_LINKED';
  end if;

  return query
  select a.name, a.description, a.icon, a.rarity, a.earned_at
  from public.achievements a
  where a.user_id = p_student
  order by a.earned_at desc nulls last
  limit greatest(p_limit, 1);
end;
$$;

revoke all on function public.parent_child_achievements(uuid, int) from public;
grant execute on function public.parent_child_achievements(uuid, int) to authenticated;
