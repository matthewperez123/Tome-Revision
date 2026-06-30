-- ============================================================================
-- Backends for the formerly demo-only social/teacher surfaces:
--   * Book Clubs  (/clubs, /clubs/[clubId], social Clubs tab)
--   * Parent Directory  (/teacher/parents)
--   * Activity feed  (/social)  — leaderboard sources from existing
--                                 profiles.total_xp / current_streak.
--
-- Conventions mirror 20260426000000_social_layer.sql:
--   * uuid PK default gen_random_uuid(); references public.profiles(id)
--     on delete cascade; text/enum checks; per-table RLS scoped to auth.uid();
--     security-definer helpers (set search_path = public) to avoid policy
--     recursion. All idempotent (if not exists / create or replace).
-- ============================================================================

begin;

-- ──────────────────────────────────────────────────────────────────────────
-- BOOK CLUBS
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.book_clubs (
  id           uuid primary key default gen_random_uuid(),
  name         text not null check (char_length(name) between 1 and 120),
  description  text not null default '',
  -- book_id is the reader's text slug (e.g. "the-iliad"); kept loose (no FK)
  -- because clubs may be theme-based with no single book.
  book_id      text,
  book_title   text,
  theme        text,
  visibility   text not null default 'public'
                 check (visibility in ('public', 'private', 'invite_only')),
  max_members  integer not null default 50 check (max_members between 2 and 1000),
  member_count integer not null default 0,
  cover_color  text not null default '#6C63FF',
  rules        text not null default '',
  created_by   uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now()
);

create index if not exists book_clubs_created_by_idx on public.book_clubs(created_by);
create index if not exists book_clubs_visibility_idx on public.book_clubs(visibility);

create table if not exists public.club_members (
  id        uuid primary key default gen_random_uuid(),
  club_id   uuid not null references public.book_clubs(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  role      text not null default 'member'
              check (role in ('owner', 'moderator', 'member')),
  joined_at timestamptz not null default now(),
  unique (club_id, user_id)
);

create index if not exists club_members_club_idx on public.club_members(club_id);
create index if not exists club_members_user_idx on public.club_members(user_id);

create table if not exists public.club_discussions (
  id           uuid primary key default gen_random_uuid(),
  club_id      uuid not null references public.book_clubs(id) on delete cascade,
  author_id    uuid references public.profiles(id) on delete set null,
  parent_id    uuid references public.club_discussions(id) on delete cascade,
  anchor_quote text,
  anchor_unit  text,
  body         text not null check (char_length(body) between 1 and 10000),
  is_pinned    boolean not null default false,
  is_virgil    boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists club_discussions_club_idx
  on public.club_discussions(club_id, created_at desc);

create table if not exists public.club_discussion_reactions (
  id            uuid primary key default gen_random_uuid(),
  discussion_id uuid not null references public.club_discussions(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  emoji         text not null check (char_length(emoji) between 1 and 16),
  created_at    timestamptz not null default now(),
  unique (discussion_id, user_id, emoji)
);

create index if not exists club_reactions_discussion_idx
  on public.club_discussion_reactions(discussion_id);

create table if not exists public.club_reading_pace (
  id             uuid primary key default gen_random_uuid(),
  club_id        uuid not null references public.book_clubs(id) on delete cascade,
  unit           text not null,
  target_date    date,
  notes          text,
  group_progress integer not null default 0 check (group_progress between 0 and 100),
  created_at     timestamptz not null default now()
);

create index if not exists club_reading_pace_club_idx on public.club_reading_pace(club_id);

-- ── Club helpers (security definer → no RLS recursion) ──────────────────────

create or replace function public.is_club_member(p_user uuid, p_club uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.club_members
    where club_id = p_club and user_id = p_user
  );
$$;

create or replace function public.is_club_manager(p_user uuid, p_club uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.club_members
    where club_id = p_club and user_id = p_user and role in ('owner', 'moderator')
  );
$$;

create or replace function public.is_club_visible(p_user uuid, p_club uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.book_clubs c
    where c.id = p_club
      and (c.visibility = 'public'
           or c.created_by = p_user
           or public.is_club_member(p_user, p_club))
  );
$$;

grant execute on function public.is_club_member(uuid, uuid) to authenticated;
grant execute on function public.is_club_manager(uuid, uuid) to authenticated;
grant execute on function public.is_club_visible(uuid, uuid) to authenticated;

-- ── Keep book_clubs.member_count in sync with club_members ──────────────────

create or replace function public.sync_club_member_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.book_clubs
      set member_count = member_count + 1
      where id = new.club_id;
  elsif tg_op = 'DELETE' then
    update public.book_clubs
      set member_count = greatest(member_count - 1, 0)
      where id = old.club_id;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_club_member_count on public.club_members;
create trigger trg_club_member_count
  after insert or delete on public.club_members
  for each row execute function public.sync_club_member_count();

-- ── RLS: book_clubs ─────────────────────────────────────────────────────────

alter table public.book_clubs enable row level security;

drop policy if exists book_clubs_select on public.book_clubs;
create policy book_clubs_select on public.book_clubs
  for select using (
    visibility = 'public'
    or created_by = auth.uid()
    or public.is_club_member(auth.uid(), id)
  );

drop policy if exists book_clubs_insert on public.book_clubs;
create policy book_clubs_insert on public.book_clubs
  for insert with check (created_by = auth.uid());

drop policy if exists book_clubs_update on public.book_clubs;
create policy book_clubs_update on public.book_clubs
  for update using (
    created_by = auth.uid() or public.is_club_manager(auth.uid(), id)
  );

drop policy if exists book_clubs_delete on public.book_clubs;
create policy book_clubs_delete on public.book_clubs
  for delete using (created_by = auth.uid());

-- ── RLS: club_members ───────────────────────────────────────────────────────

alter table public.club_members enable row level security;

drop policy if exists club_members_select on public.club_members;
create policy club_members_select on public.club_members
  for select using (public.is_club_visible(auth.uid(), club_id));

-- A user may add only themselves, and only as a plain member (self-join).
drop policy if exists club_members_self_join on public.club_members;
create policy club_members_self_join on public.club_members
  for insert with check (user_id = auth.uid() and role = 'member');

-- Managers may add anyone in any role (e.g. promote moderators, owner bootstrap).
drop policy if exists club_members_manager_insert on public.club_members;
create policy club_members_manager_insert on public.club_members
  for insert with check (public.is_club_manager(auth.uid(), club_id));

drop policy if exists club_members_self_leave on public.club_members;
create policy club_members_self_leave on public.club_members
  for delete using (user_id = auth.uid());

drop policy if exists club_members_manager_remove on public.club_members;
create policy club_members_manager_remove on public.club_members
  for delete using (public.is_club_manager(auth.uid(), club_id));

drop policy if exists club_members_manager_update on public.club_members;
create policy club_members_manager_update on public.club_members
  for update using (public.is_club_manager(auth.uid(), club_id));

-- ── RLS: club_discussions ───────────────────────────────────────────────────

alter table public.club_discussions enable row level security;

drop policy if exists club_discussions_select on public.club_discussions;
create policy club_discussions_select on public.club_discussions
  for select using (public.is_club_visible(auth.uid(), club_id));

drop policy if exists club_discussions_insert on public.club_discussions;
create policy club_discussions_insert on public.club_discussions
  for insert with check (
    author_id = auth.uid() and public.is_club_member(auth.uid(), club_id)
  );

drop policy if exists club_discussions_update on public.club_discussions;
create policy club_discussions_update on public.club_discussions
  for update using (
    author_id = auth.uid() or public.is_club_manager(auth.uid(), club_id)
  );

drop policy if exists club_discussions_delete on public.club_discussions;
create policy club_discussions_delete on public.club_discussions
  for delete using (
    author_id = auth.uid() or public.is_club_manager(auth.uid(), club_id)
  );

-- ── RLS: club_discussion_reactions ──────────────────────────────────────────

alter table public.club_discussion_reactions enable row level security;

drop policy if exists club_reactions_select on public.club_discussion_reactions;
create policy club_reactions_select on public.club_discussion_reactions
  for select using (
    exists (
      select 1 from public.club_discussions d
      where d.id = discussion_id
        and public.is_club_visible(auth.uid(), d.club_id)
    )
  );

drop policy if exists club_reactions_insert on public.club_discussion_reactions;
create policy club_reactions_insert on public.club_discussion_reactions
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.club_discussions d
      where d.id = discussion_id
        and public.is_club_member(auth.uid(), d.club_id)
    )
  );

drop policy if exists club_reactions_delete on public.club_discussion_reactions;
create policy club_reactions_delete on public.club_discussion_reactions
  for delete using (user_id = auth.uid());

-- ── RLS: club_reading_pace ──────────────────────────────────────────────────

alter table public.club_reading_pace enable row level security;

drop policy if exists club_pace_select on public.club_reading_pace;
create policy club_pace_select on public.club_reading_pace
  for select using (public.is_club_visible(auth.uid(), club_id));

drop policy if exists club_pace_insert on public.club_reading_pace;
create policy club_pace_insert on public.club_reading_pace
  for insert with check (public.is_club_manager(auth.uid(), club_id));

drop policy if exists club_pace_update on public.club_reading_pace;
create policy club_pace_update on public.club_reading_pace
  for update using (public.is_club_manager(auth.uid(), club_id));

drop policy if exists club_pace_delete on public.club_reading_pace;
create policy club_pace_delete on public.club_reading_pace
  for delete using (public.is_club_manager(auth.uid(), club_id));

-- ──────────────────────────────────────────────────────────────────────────
-- PARENT DIRECTORY (teacher-scoped guardian contacts + messages)
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.guardians (
  id                uuid primary key default gen_random_uuid(),
  teacher_id        uuid not null references public.profiles(id) on delete cascade,
  first_name        text not null,
  last_name         text not null,
  email             text not null,
  phone             text,
  preferred_contact text not null default 'email'
                      check (preferred_contact in ('email', 'sms', 'both')),
  created_at        timestamptz not null default now()
);

create index if not exists guardians_teacher_idx on public.guardians(teacher_id);

create table if not exists public.guardian_student_links (
  id           uuid primary key default gen_random_uuid(),
  guardian_id  uuid not null references public.guardians(id) on delete cascade,
  -- student_id optional: a contact may exist before the student has an account.
  student_id   uuid references public.profiles(id) on delete set null,
  student_name text not null,
  relationship text not null default 'parent',
  created_at   timestamptz not null default now()
);

create index if not exists guardian_links_guardian_idx
  on public.guardian_student_links(guardian_id);

create table if not exists public.guardian_messages (
  id              uuid primary key default gen_random_uuid(),
  guardian_id     uuid not null references public.guardians(id) on delete cascade,
  teacher_id      uuid not null references public.profiles(id) on delete cascade,
  student_id      uuid references public.profiles(id) on delete set null,
  student_name    text,
  subject         text not null,
  body            text not null,
  message_type    text not null default 'general'
                    check (message_type in
                      ('general', 'positive', 'concern', 'academic',
                       'behavior', 'announcement')),
  delivery_status text not null default 'queued'
                    check (delivery_status in
                      ('queued', 'sent', 'delivered', 'failed')),
  is_draft        boolean not null default false,
  sent_at         timestamptz,
  read_at         timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists guardian_messages_guardian_idx
  on public.guardian_messages(guardian_id, created_at desc);
create index if not exists guardian_messages_teacher_idx
  on public.guardian_messages(teacher_id);

-- Helper: does this guardian belong to the calling teacher?
create or replace function public.owns_guardian(p_teacher uuid, p_guardian uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.guardians
    where id = p_guardian and teacher_id = p_teacher
  );
$$;

grant execute on function public.owns_guardian(uuid, uuid) to authenticated;

-- ── RLS: guardians (owner teacher only) ─────────────────────────────────────

alter table public.guardians enable row level security;

drop policy if exists guardians_select on public.guardians;
create policy guardians_select on public.guardians
  for select using (teacher_id = auth.uid());

drop policy if exists guardians_insert on public.guardians;
create policy guardians_insert on public.guardians
  for insert with check (teacher_id = auth.uid());

drop policy if exists guardians_update on public.guardians;
create policy guardians_update on public.guardians
  for update using (teacher_id = auth.uid());

drop policy if exists guardians_delete on public.guardians;
create policy guardians_delete on public.guardians
  for delete using (teacher_id = auth.uid());

-- ── RLS: guardian_student_links (via owning teacher) ────────────────────────

alter table public.guardian_student_links enable row level security;

drop policy if exists guardian_links_select on public.guardian_student_links;
create policy guardian_links_select on public.guardian_student_links
  for select using (public.owns_guardian(auth.uid(), guardian_id));

drop policy if exists guardian_links_insert on public.guardian_student_links;
create policy guardian_links_insert on public.guardian_student_links
  for insert with check (public.owns_guardian(auth.uid(), guardian_id));

drop policy if exists guardian_links_update on public.guardian_student_links;
create policy guardian_links_update on public.guardian_student_links
  for update using (public.owns_guardian(auth.uid(), guardian_id));

drop policy if exists guardian_links_delete on public.guardian_student_links;
create policy guardian_links_delete on public.guardian_student_links
  for delete using (public.owns_guardian(auth.uid(), guardian_id));

-- ── RLS: guardian_messages (owner teacher only) ─────────────────────────────

alter table public.guardian_messages enable row level security;

drop policy if exists guardian_messages_select on public.guardian_messages;
create policy guardian_messages_select on public.guardian_messages
  for select using (teacher_id = auth.uid());

drop policy if exists guardian_messages_insert on public.guardian_messages;
create policy guardian_messages_insert on public.guardian_messages
  for insert with check (teacher_id = auth.uid());

drop policy if exists guardian_messages_update on public.guardian_messages;
create policy guardian_messages_update on public.guardian_messages
  for update using (teacher_id = auth.uid());

drop policy if exists guardian_messages_delete on public.guardian_messages;
create policy guardian_messages_delete on public.guardian_messages
  for delete using (teacher_id = auth.uid());

-- ──────────────────────────────────────────────────────────────────────────
-- ACTIVITY FEED (social feed; leaderboard reads profiles.total_xp directly)
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.activity_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  type       text not null
               check (type in
                 ('seal_earned', 'book_finished', 'chapter_finished',
                  'level_up', 'streak_milestone', 'club_joined', 'trial_passed')),
  title      text not null,
  detail     text,
  book_id    text,
  metadata   jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_events_user_idx
  on public.activity_events(user_id, created_at desc);
create index if not exists activity_events_created_idx
  on public.activity_events(created_at desc);

-- Helper: are two users connected (accepted friendship)?
create or replace function public.are_connected(p_a uuid, p_b uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.connections
    where status = 'accepted'
      and ((requester_id = p_a and recipient_id = p_b)
        or (requester_id = p_b and recipient_id = p_a))
  );
$$;

grant execute on function public.are_connected(uuid, uuid) to authenticated;

alter table public.activity_events enable row level security;

-- Visible to self and accepted connections (friends' activity feed).
drop policy if exists activity_events_select on public.activity_events;
create policy activity_events_select on public.activity_events
  for select using (
    user_id = auth.uid() or public.are_connected(auth.uid(), user_id)
  );

drop policy if exists activity_events_insert on public.activity_events;
create policy activity_events_insert on public.activity_events
  for insert with check (user_id = auth.uid());

drop policy if exists activity_events_delete on public.activity_events;
create policy activity_events_delete on public.activity_events
  for delete using (user_id = auth.uid());

commit;
