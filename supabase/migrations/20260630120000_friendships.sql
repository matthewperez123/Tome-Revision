-- Friends system: the social graph. Privacy-first / deny-by-default RLS.
--
-- A single row models the relationship between two users. A unique index on
-- the UNORDERED pair (least/greatest) makes reciprocal duplicates impossible,
-- so at most one row can ever exist between any two accounts.
--
-- Discovery is intentionally narrow (no open email / full-name search that
-- could surface a student): a handle resolves ONLY profiles that opted into
-- discovery; a friend code is a shared secret that resolves any account. Both
-- go through SECURITY DEFINER resolvers below.
--
-- Applied out-of-band to project vjaezrcuuzmbmnsfrtwt via Supabase MCP
-- (apply_migration name=friendships). This file is the repo-of-record copy.

create type public.friendship_status as enum (
  'pending',
  'accepted',
  'declined',
  'blocked'
);

create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users (id) on delete cascade,
  addressee_id uuid not null references auth.users (id) on delete cascade,
  status public.friendship_status not null default 'pending',
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint friendships_distinct_parties check (requester_id <> addressee_id)
);

-- At most one row per unordered pair: reciprocal duplicates are impossible.
create unique index friendships_unordered_pair_idx
  on public.friendships (
    least(requester_id, addressee_id),
    greatest(requester_id, addressee_id)
  );

create index friendships_addressee_status_idx
  on public.friendships (addressee_id, status);
create index friendships_requester_status_idx
  on public.friendships (requester_id, status);

alter table public.friendships enable row level security;

-- A user sees only rows they are a party to.
create policy friendships_select_involved
  on public.friendships
  for select
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- A user may only open a request AS the requester, in the pending state.
create policy friendships_insert_as_requester
  on public.friendships
  for insert
  to authenticated
  with check (auth.uid() = requester_id and status = 'pending');

-- The addressee accepts/declines/blocks; either party may block. (Column
-- grants below limit writable columns to status + responded_at.)
create policy friendships_update_respond
  on public.friendships
  for update
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id)
  with check (
    (auth.uid() = addressee_id and status in ('accepted', 'declined', 'blocked'))
    or (status = 'blocked' and (auth.uid() = requester_id or auth.uid() = addressee_id))
    or (status = 'pending' and auth.uid() = requester_id)
  );

-- Either party may delete the row to unfriend / withdraw.
create policy friendships_delete_involved
  on public.friendships
  for delete
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

revoke all on table public.friendships from anon, authenticated;
grant select, insert, delete on table public.friendships to authenticated;
grant update (status, responded_at) on table public.friendships to authenticated;

-- Live updates: subscribers re-fetch on any change to a row they're a party to
-- (RLS still gates which rows reach each client).
alter publication supabase_realtime add table public.friendships;

-- ── Discoverability + friend codes on profiles ───────────────────────────────

alter table public.profiles
  add column if not exists discoverable boolean not null default false,
  add column if not exists friend_code text;

update public.profiles
  set friend_code = upper(substr(md5(gen_random_uuid()::text), 1, 8))
  where friend_code is null;

alter table public.profiles
  alter column friend_code set default upper(substr(md5(gen_random_uuid()::text), 1, 8));
alter table public.profiles
  alter column friend_code set not null;

create unique index profiles_friend_code_idx on public.profiles (friend_code);

-- ── SECURITY DEFINER discovery resolvers ─────────────────────────────────────
-- The ONLY sanctioned discovery paths. A handle resolves only profiles that
-- opted into discovery (discoverable = true); a friend code is a shared secret
-- that resolves any account. Both exclude the caller.

create or replace function public.find_friend_candidate_by_handle(p_handle text)
returns table (id uuid, display_name text, username text, avatar_url text)
language sql
security definer
set search_path = ''
stable
as $$
  select p.id, p.display_name, p.username, p.avatar_url
  from public.profiles p
  where p.discoverable = true
    and lower(p.username) = lower(trim(both from replace(p_handle, '@', '')))
    and p.id <> auth.uid()
  limit 1;
$$;

create or replace function public.find_friend_candidate_by_code(p_code text)
returns table (id uuid, display_name text, username text, avatar_url text)
language sql
security definer
set search_path = ''
stable
as $$
  select p.id, p.display_name, p.username, p.avatar_url
  from public.profiles p
  where upper(p.friend_code) = upper(trim(both from p_code))
    and p.id <> auth.uid()
  limit 1;
$$;

revoke all on function public.find_friend_candidate_by_handle(text) from public;
revoke all on function public.find_friend_candidate_by_code(text) from public;
grant execute on function public.find_friend_candidate_by_handle(text) to authenticated;
grant execute on function public.find_friend_candidate_by_code(text) to authenticated;

-- Supersede the empty legacy table this replaces.
drop table if exists public.connections cascade;
