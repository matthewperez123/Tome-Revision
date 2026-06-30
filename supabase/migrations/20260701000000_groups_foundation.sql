-- ────────────────────────────────────────────────────────────────────────────
-- Groups foundation: a reusable social-group primitive that Book Clubs and
-- Study Groups both build on. `kind` discriminates the two; everything else
-- (membership, threaded posts, invites, reading schedule) is shared.
--
-- Privacy-first, deny-by-default RLS:
--   * public groups + their posts/schedule are readable by anyone signed in
--   * private/invite groups + their posts are readable only by members
--   * only members may post; owner/moderators may moderate (soft-delete posts,
--     remove members, edit settings/schedule)
--
-- Member reading progress is NOT duplicated — it is surfaced live from the
-- existing owner-only public.reading_progress via a SECURITY DEFINER reader.
--
-- Notifications (invite / new post / schedule milestone) are emitted from the
-- application action layer via notify(), matching the friendships pattern —
-- this migration only provides the data + access model + write RPCs.
-- ────────────────────────────────────────────────────────────────────────────

-- ── Enums ───────────────────────────────────────────────────────────────────
create type public.group_kind as enum ('book_club', 'study_group');
create type public.group_privacy as enum ('public', 'private', 'invite');
create type public.group_member_role as enum ('owner', 'moderator', 'member');
create type public.group_member_status as enum ('active', 'invited', 'removed');
create type public.group_invite_status as enum ('pending', 'accepted', 'declined', 'revoked');

-- ── Tables ──────────────────────────────────────────────────────────────────

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  kind public.group_kind not null,
  name text not null,
  slug text not null unique,
  description text,
  cover text,
  owner_id uuid not null references auth.users (id) on delete cascade,
  -- book_id is a plain text slug matching public.books(id) / reading_progress.book_id.
  -- ON DELETE SET NULL so removing a catalog book never orphans a club.
  book_id text references public.books (id) on delete set null,
  privacy public.group_privacy not null default 'private',
  member_limit int check (member_limit is null or member_limit > 0),
  created_at timestamptz not null default now()
);
create index groups_kind_privacy_idx on public.groups (kind, privacy, created_at desc);
create index groups_owner_idx on public.groups (owner_id);
create index groups_book_idx on public.groups (book_id) where book_id is not null;

create table public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.group_member_role not null default 'member',
  status public.group_member_status not null default 'active',
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);
create index group_members_user_idx on public.group_members (user_id);
create index group_members_group_idx on public.group_members (group_id) where status = 'active';

create table public.group_posts (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  parent_post_id uuid references public.group_posts (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);
create index group_posts_group_created_idx on public.group_posts (group_id, created_at desc);
create index group_posts_parent_idx on public.group_posts (parent_post_id) where parent_post_id is not null;

create table public.group_invites (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  inviter_id uuid not null references auth.users (id) on delete cascade,
  invitee_id uuid references auth.users (id) on delete cascade,
  code text unique,
  status public.group_invite_status not null default 'pending',
  created_at timestamptz not null default now(),
  -- An invite targets either a specific user OR a shareable code (or both).
  check (invitee_id is not null or code is not null)
);
create index group_invites_invitee_idx on public.group_invites (invitee_id) where invitee_id is not null;
create index group_invites_group_idx on public.group_invites (group_id);

create table public.group_schedule (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  label text not null,
  chapter_or_section text,
  target_date date,
  created_at timestamptz not null default now()
);
create index group_schedule_group_idx on public.group_schedule (group_id, target_date);

-- ── Access helpers (SECURITY DEFINER → break RLS recursion on group_members) ──

create or replace function public.is_group_member(p_group uuid, p_uid uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.group_members m
    where m.group_id = p_group and m.user_id = p_uid and m.status = 'active'
  );
$$;

create or replace function public.is_group_moderator(p_group uuid, p_uid uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.group_members m
    where m.group_id = p_group and m.user_id = p_uid
      and m.status = 'active' and m.role in ('owner', 'moderator')
  );
$$;

create or replace function public.group_is_visible(p_group uuid, p_uid uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.groups g
    where g.id = p_group
      and (g.privacy = 'public' or g.owner_id = p_uid or public.is_group_member(p_group, p_uid))
  );
$$;

-- ── RLS ─────────────────────────────────────────────────────────────────────

alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_posts enable row level security;
alter table public.group_invites enable row level security;
alter table public.group_schedule enable row level security;

-- groups: visible if public OR you're a member/owner. Only the owner mutates settings.
create policy groups_select_visible on public.groups
  for select to authenticated
  using (public.group_is_visible(id, auth.uid()));
create policy groups_insert_owner on public.groups
  for insert to authenticated
  with check (owner_id = auth.uid());
create policy groups_update_owner on public.groups
  for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
create policy groups_delete_owner on public.groups
  for delete to authenticated
  using (owner_id = auth.uid());

-- group_members: roster visible to anyone who can see the group. Self-join is
-- allowed only for public groups; invite/private joins go through the join RPCs.
-- Moderators manage roles; members may remove themselves; mods may remove others.
create policy group_members_select_visible on public.group_members
  for select to authenticated
  using (public.group_is_visible(group_id, auth.uid()));
create policy group_members_insert_self_public on public.group_members
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.groups g where g.id = group_id and g.privacy = 'public')
  );
create policy group_members_update_moderator on public.group_members
  for update to authenticated
  using (public.is_group_moderator(group_id, auth.uid()))
  with check (public.is_group_moderator(group_id, auth.uid()));
create policy group_members_delete_self_or_moderator on public.group_members
  for delete to authenticated
  using (user_id = auth.uid() or public.is_group_moderator(group_id, auth.uid()));

-- group_posts: readable wherever the group is visible (public clubs' threads are
-- public-readable); soft-deleted posts hidden from all but moderators. Only
-- members post. Authors edit own; authors & mods may soft-delete.
create policy group_posts_select_visible on public.group_posts
  for select to authenticated
  using (
    public.group_is_visible(group_id, auth.uid())
    and (deleted_at is null or public.is_group_moderator(group_id, auth.uid()))
  );
create policy group_posts_insert_member on public.group_posts
  for insert to authenticated
  with check (author_id = auth.uid() and public.is_group_member(group_id, auth.uid()));
create policy group_posts_update_author_or_moderator on public.group_posts
  for update to authenticated
  using (author_id = auth.uid() or public.is_group_moderator(group_id, auth.uid()))
  with check (author_id = auth.uid() or public.is_group_moderator(group_id, auth.uid()));

-- group_invites: visible to the inviter, the invitee, and moderators. Members
-- may issue invites; invitee/inviter/mod may update status (accept/decline/revoke).
create policy group_invites_select_party on public.group_invites
  for select to authenticated
  using (
    invitee_id = auth.uid() or inviter_id = auth.uid()
    or public.is_group_moderator(group_id, auth.uid())
  );
create policy group_invites_insert_member on public.group_invites
  for insert to authenticated
  with check (inviter_id = auth.uid() and public.is_group_member(group_id, auth.uid()));
create policy group_invites_update_party on public.group_invites
  for update to authenticated
  using (
    invitee_id = auth.uid() or inviter_id = auth.uid()
    or public.is_group_moderator(group_id, auth.uid())
  )
  with check (
    invitee_id = auth.uid() or inviter_id = auth.uid()
    or public.is_group_moderator(group_id, auth.uid())
  );

-- group_schedule: readable wherever the group is visible; mutated by moderators.
create policy group_schedule_select_visible on public.group_schedule
  for select to authenticated
  using (public.group_is_visible(group_id, auth.uid()));
create policy group_schedule_write_moderator on public.group_schedule
  for all to authenticated
  using (public.is_group_moderator(group_id, auth.uid()))
  with check (public.is_group_moderator(group_id, auth.uid()));

-- ── Grants ──────────────────────────────────────────────────────────────────
revoke all on public.groups from authenticated;
revoke all on public.group_members from authenticated;
revoke all on public.group_posts from authenticated;
revoke all on public.group_invites from authenticated;
revoke all on public.group_schedule from authenticated;
grant select, insert, update, delete on public.groups to authenticated;
grant select, insert, update, delete on public.group_members to authenticated;
grant select, insert, update on public.group_posts to authenticated;
grant select, insert, update on public.group_invites to authenticated;
grant select, insert, update, delete on public.group_schedule to authenticated;

-- ── Write RPCs (SECURITY DEFINER) ───────────────────────────────────────────

-- Create a group and atomically bootstrap the owner membership. Returns id+slug.
create or replace function public.create_group(
  p_kind public.group_kind,
  p_name text,
  p_description text default null,
  p_book_id text default null,
  p_privacy public.group_privacy default 'private',
  p_member_limit int default null,
  p_cover text default null
)
returns public.groups
language plpgsql
security definer
set search_path = ''
as $$
declare
  _uid uuid := auth.uid();
  _slug text;
  _base text;
  _row public.groups;
begin
  if _uid is null then raise exception 'UNAUTHENTICATED'; end if;
  if length(trim(coalesce(p_name, ''))) = 0 then raise exception 'NAME_REQUIRED'; end if;

  _base := trim(both '-' from regexp_replace(lower(p_name), '[^a-z0-9]+', '-', 'g'));
  if length(_base) = 0 then _base := 'group'; end if;
  _slug := _base || '-' || substr(md5(gen_random_uuid()::text), 1, 6);

  insert into public.groups (kind, name, slug, description, cover, owner_id, book_id, privacy, member_limit)
  values (
    p_kind, trim(p_name), _slug, nullif(trim(coalesce(p_description, '')), ''),
    nullif(trim(coalesce(p_cover, '')), ''), _uid, p_book_id, p_privacy, p_member_limit
  )
  returning * into _row;

  insert into public.group_members (group_id, user_id, role, status)
  values (_row.id, _uid, 'owner', 'active');

  return _row;
end;
$$;

-- Join a public group as yourself. Enforces member_limit + dedupe. Reactivates a
-- previously-removed membership. Returns the membership status.
create or replace function public.join_group(p_group uuid)
returns public.group_member_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  _uid uuid := auth.uid();
  _g public.groups;
  _count int;
begin
  if _uid is null then raise exception 'UNAUTHENTICATED'; end if;
  select * into _g from public.groups where id = p_group;
  if _g.id is null then raise exception 'GROUP_NOT_FOUND'; end if;
  if _g.privacy <> 'public' then raise exception 'NOT_PUBLIC'; end if;

  if exists (select 1 from public.group_members where group_id = p_group and user_id = _uid and status = 'active') then
    return 'active';
  end if;

  if _g.member_limit is not null then
    select count(*) into _count from public.group_members where group_id = p_group and status = 'active';
    if _count >= _g.member_limit then raise exception 'GROUP_FULL'; end if;
  end if;

  insert into public.group_members (group_id, user_id, role, status)
  values (p_group, _uid, 'member', 'active')
  on conflict (group_id, user_id)
  do update set status = 'active', role = 'member', joined_at = now();

  return 'active';
end;
$$;

-- Accept an invite addressed to you (by invite id). Joins the group + marks accepted.
create or replace function public.accept_group_invite(p_invite uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  _uid uuid := auth.uid();
  _inv public.group_invites;
begin
  if _uid is null then raise exception 'UNAUTHENTICATED'; end if;
  select * into _inv from public.group_invites where id = p_invite;
  if _inv.id is null then raise exception 'INVITE_NOT_FOUND'; end if;
  if _inv.status <> 'pending' then raise exception 'INVITE_NOT_PENDING'; end if;
  if _inv.invitee_id is not null and _inv.invitee_id <> _uid then raise exception 'NOT_INVITEE'; end if;

  insert into public.group_members (group_id, user_id, role, status)
  values (_inv.group_id, _uid, 'member', 'active')
  on conflict (group_id, user_id) do update set status = 'active';

  update public.group_invites set status = 'accepted' where id = p_invite;
  return _inv.group_id;
end;
$$;

-- Redeem a shareable invite code → join the group. Returns the group id.
create or replace function public.join_group_by_code(p_code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  _uid uuid := auth.uid();
  _inv public.group_invites;
begin
  if _uid is null then raise exception 'UNAUTHENTICATED'; end if;
  select * into _inv from public.group_invites
  where code = upper(trim(p_code)) and status = 'pending'
  order by created_at desc limit 1;
  if _inv.id is null then raise exception 'CODE_NOT_FOUND'; end if;

  insert into public.group_members (group_id, user_id, role, status)
  values (_inv.group_id, _uid, 'member', 'active')
  on conflict (group_id, user_id) do update set status = 'active';

  return _inv.group_id;
end;
$$;

-- Surface each active member's progress on the group's book — read live from
-- the owner-only reading_progress, gated so only fellow members can see it.
-- Returns one row per active member (chapter null if they haven't started).
create or replace function public.group_member_progress(p_group uuid)
returns table (
  user_id uuid,
  display_name text,
  username text,
  avatar_url text,
  role public.group_member_role,
  chapter_index int,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  _uid uuid := auth.uid();
  _book text;
begin
  if _uid is null then raise exception 'UNAUTHENTICATED'; end if;
  if not public.is_group_member(p_group, _uid) then raise exception 'NOT_A_MEMBER'; end if;
  select g.book_id into _book from public.groups g where g.id = p_group;

  return query
  select m.user_id, p.display_name, p.username, p.avatar_url, m.role,
         rp.chapter_index, rp.updated_at
  from public.group_members m
  left join public.profiles p on p.id = m.user_id
  left join public.reading_progress rp
    on rp.user_id = m.user_id and _book is not null and rp.book_id = _book
  where m.group_id = p_group and m.status = 'active'
  order by coalesce(rp.chapter_index, -1) desc, m.joined_at asc;
end;
$$;

grant execute on function public.create_group(public.group_kind, text, text, text, public.group_privacy, int, text) to authenticated;
grant execute on function public.join_group(uuid) to authenticated;
grant execute on function public.accept_group_invite(uuid) to authenticated;
grant execute on function public.join_group_by_code(text) to authenticated;
grant execute on function public.group_member_progress(uuid) to authenticated;
grant execute on function public.is_group_member(uuid, uuid) to authenticated;
grant execute on function public.is_group_moderator(uuid, uuid) to authenticated;
grant execute on function public.group_is_visible(uuid, uuid) to authenticated;

-- ── Realtime ────────────────────────────────────────────────────────────────
alter publication supabase_realtime add table public.group_posts;
