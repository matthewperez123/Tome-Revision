-- =====================================================================
-- TOME — Messaging, Notification Preferences, Shared Highlights
-- Reconciled against the LIVE schema (project vjaezrcuuzmbmnsfrtwt).
--
-- Non-clobbering: ALTERs existing objects, CREATEs only what is absent.
--  * profiles / classrooms / classroom_members already exist — untouched
--    except the handle_new_user trigger fn (extended, not replaced wholesale).
--  * The existing public.annotations table is EDITORIAL gloss content and is
--    intentionally NOT used here. Durable user highlights extend public.highlights.
--  * Classroom membership uses public.classroom_members(student_id, role);
--    there is no `enrollments` table. shares_classroom / can_access_classroom
--    are defined against classroom_members.
-- =====================================================================

begin;

-- ───────────────────────── NOTIFICATION PREFERENCES ─────────────────────────
create table if not exists public.notification_preferences (
  profile_id                uuid primary key references public.profiles(id) on delete cascade,
  email_on_new_message      boolean not null default true,
  email_on_classroom_invite boolean not null default true,
  updated_at                timestamptz not null default now()
);
alter table public.notification_preferences enable row level security;

drop policy if exists notif_prefs_own on public.notification_preferences;
create policy notif_prefs_own on public.notification_preferences
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- Extend the existing new-user trigger fn to seed notification_preferences.
-- Preserves the live behavior (display_name/avatar_url; this DB has no
-- email/full_name columns on profiles).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  )
  on conflict (id) do nothing;
  insert into public.notification_preferences (profile_id)
  values (new.id)
  on conflict do nothing;
  return new;
end; $$;

-- Backfill prefs for any existing profiles (0 today; idempotent).
insert into public.notification_preferences (profile_id)
select id from public.profiles
on conflict do nothing;

-- ─────────────────────────────── MESSAGING ───────────────────────────────
create table if not exists public.conversations (
  id              uuid primary key default gen_random_uuid(),
  classroom_id    uuid references public.classrooms(id) on delete set null,
  created_by      uuid not null references public.profiles(id) on delete cascade,
  subject         text,
  created_at      timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);
alter table public.conversations enable row level security;

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  profile_id      uuid not null references public.profiles(id) on delete cascade,
  last_read_at    timestamptz,
  primary key (conversation_id, profile_id)
);
alter table public.conversation_participants enable row level security;

create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id) on delete cascade,
  body            text not null check (length(trim(body)) > 0),
  created_at      timestamptz not null default now()
);
alter table public.messages enable row level security;
create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at);

-- Debounce log for new-message emails (no client access; reached via RPC only).
create table if not exists public.message_email_log (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  profile_id      uuid not null references public.profiles(id) on delete cascade,
  last_emailed_at timestamptz not null default now(),
  primary key (conversation_id, profile_id)
);
alter table public.message_email_log enable row level security;
-- intentionally NO policies => denies all direct access; reached only via SECURITY DEFINER RPC.

-- ───────────────────── SECURITY DEFINER HELPERS ─────────────────────
-- Two members of the same classroom (any roles) share a classroom.
-- The classroom owner is itself a classroom_members row, so teacher<->student works.
create or replace function public.shares_classroom(_a uuid, _b uuid)
returns boolean language sql security definer set search_path = '' stable as $$
  select _a <> _b and exists (
    select 1
    from public.classroom_members m1
    join public.classroom_members m2 on m1.classroom_id = m2.classroom_id
    where m1.student_id = _a and m2.student_id = _b
  );
$$;

create or replace function public.can_access_classroom(_classroom_id uuid)
returns boolean language sql security definer set search_path = '' stable as $$
  select exists (
    select 1 from public.classroom_members
    where classroom_id = _classroom_id and student_id = auth.uid()
  );
$$;
grant execute on function public.can_access_classroom(uuid) to authenticated;

create or replace function public.is_conversation_participant(_conversation_id uuid, _uid uuid)
returns boolean language sql security definer set search_path = '' stable as $$
  select exists (
    select 1 from public.conversation_participants p
    where p.conversation_id = _conversation_id and p.profile_id = _uid
  );
$$;

-- ───────────────────────────── RLS: MESSAGING ─────────────────────────────
drop policy if exists conversations_participant_read on public.conversations;
create policy conversations_participant_read on public.conversations
  for select using (public.is_conversation_participant(id, auth.uid()));
drop policy if exists conversations_insert_creator on public.conversations;
create policy conversations_insert_creator on public.conversations
  for insert with check (auth.uid() = created_by);
drop policy if exists conversations_participant_update on public.conversations;
create policy conversations_participant_update on public.conversations
  for update using (public.is_conversation_participant(id, auth.uid()));

drop policy if exists participants_read on public.conversation_participants;
create policy participants_read on public.conversation_participants
  for select using (public.is_conversation_participant(conversation_id, auth.uid()));
drop policy if exists participants_insert_by_creator on public.conversation_participants;
create policy participants_insert_by_creator on public.conversation_participants
  for insert with check (
    exists (select 1 from public.conversations c
            where c.id = conversation_id and c.created_by = auth.uid())
    or profile_id = auth.uid()
  );
drop policy if exists participants_update_own on public.conversation_participants;
create policy participants_update_own on public.conversation_participants
  for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

drop policy if exists messages_read on public.messages;
create policy messages_read on public.messages
  for select using (public.is_conversation_participant(conversation_id, auth.uid()));
drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages
  for insert with check (
    auth.uid() = sender_id
    and public.is_conversation_participant(conversation_id, auth.uid())
  );

-- ───────────────────────────────── RPCs ─────────────────────────────────
-- Start a conversation; validate every recipient shares a classroom with sender.
create or replace function public.start_conversation(
  _classroom_id uuid, _recipient_ids uuid[], _subject text, _first_message text
) returns uuid language plpgsql security definer set search_path = '' as $$
declare _conv_id uuid; _rid uuid;
begin
  foreach _rid in array _recipient_ids loop
    if not public.shares_classroom(auth.uid(), _rid) then
      raise exception 'You can only message members of your classrooms';
    end if;
  end loop;

  insert into public.conversations (classroom_id, created_by, subject)
  values (_classroom_id, auth.uid(), _subject) returning id into _conv_id;

  insert into public.conversation_participants (conversation_id, profile_id)
  values (_conv_id, auth.uid());
  foreach _rid in array _recipient_ids loop
    insert into public.conversation_participants (conversation_id, profile_id)
    values (_conv_id, _rid) on conflict do nothing;
  end loop;

  if _first_message is not null and length(trim(_first_message)) > 0 then
    insert into public.messages (conversation_id, sender_id, body)
    values (_conv_id, auth.uid(), _first_message);
  end if;
  return _conv_id;
end; $$;
revoke all on function public.start_conversation(uuid, uuid[], text, text) from public;
grant execute on function public.start_conversation(uuid, uuid[], text, text) to authenticated;

-- Atomic email debounce.
create or replace function public.claim_email_slot(
  _conversation_id uuid, _profile_id uuid, _cooldown_minutes int default 5
) returns boolean language plpgsql security definer set search_path = '' as $$
declare _last timestamptz;
begin
  select last_emailed_at into _last from public.message_email_log
   where conversation_id = _conversation_id and profile_id = _profile_id for update;
  if _last is null then
    insert into public.message_email_log (conversation_id, profile_id, last_emailed_at)
    values (_conversation_id, _profile_id, now())
    on conflict (conversation_id, profile_id) do update set last_emailed_at = now();
    return true;
  elsif _last < now() - make_interval(mins => _cooldown_minutes) then
    update public.message_email_log set last_emailed_at = now()
     where conversation_id = _conversation_id and profile_id = _profile_id;
    return true;
  else
    return false;
  end if;
end; $$;
revoke all on function public.claim_email_slot(uuid, uuid, int) from public;
grant execute on function public.claim_email_slot(uuid, uuid, int) to authenticated;

-- Bump conversation ordering on new message.
create or replace function public.bump_conversation()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.conversations set last_message_at = new.created_at where id = new.conversation_id;
  return new;
end; $$;
drop trigger if exists on_message_insert on public.messages;
create trigger on_message_insert after insert on public.messages
  for each row execute function public.bump_conversation();

-- ─────────────────── SHARED HIGHLIGHTS (extend, don't recreate) ───────────────────
alter table public.highlights add column if not exists note text;
alter table public.highlights add column if not exists shared boolean not null default false;
alter table public.highlights add column if not exists classroom_id uuid references public.classrooms(id) on delete set null;
alter table public.highlights add column if not exists updated_at timestamptz not null default now();
create index if not exists highlights_classroom_book_idx on public.highlights (classroom_id, book_id);

-- Existing policies cover own select/insert/delete. Add update (owner) + shared-read.
drop policy if exists "Users can update own highlights" on public.highlights;
create policy "Users can update own highlights" on public.highlights
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists highlights_shared_read on public.highlights;
create policy highlights_shared_read on public.highlights
  for select using (
    shared = true and classroom_id is not null and public.can_access_classroom(classroom_id)
  );

-- ────────────────────────────── REALTIME ──────────────────────────────
-- RLS still applies; subscribers receive only rows they may read.
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.highlights;

commit;
