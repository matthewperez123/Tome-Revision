-- Virgil Guided Sessions — Virgil's 1:1 guided reading mode.
--
-- A reader launches a guided session from the reader, scoped to a book/chapter.
-- Every turn (user + Virgil + system) persists so the conversation can resume,
-- and ending a session stores a short Virgil-authored summary surfaced on the
-- profile. Distinct from the TEACHER `guided_sessions` multi-station feature —
-- different tables, different route (`/api/virgil/guided`).
--
-- RLS: a user may read/write ONLY their own sessions and messages.

-- ── Enums ──────────────────────────────────────────────────────────────────
create type virgil_session_status as enum ('active', 'completed');
create type virgil_message_role as enum ('user', 'virgil', 'system');

-- ── Sessions ───────────────────────────────────────────────────────────────
create table public.virgil_guided_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  -- book_id is the plain slug used across the app (reading_progress.book_id /
  -- chapters.book_id), NOT a uuid FK — the canonical library lives in static data.
  book_id     text not null,
  chapter     integer,
  status      virgil_session_status not null default 'active',
  model_used  text,
  summary     text,
  started_at  timestamptz not null default now(),
  ended_at    timestamptz
);

create index virgil_guided_sessions_user_idx
  on public.virgil_guided_sessions (user_id, started_at desc);
create index virgil_guided_sessions_user_status_idx
  on public.virgil_guided_sessions (user_id, status);

-- ── Messages ───────────────────────────────────────────────────────────────
create table public.virgil_session_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.virgil_guided_sessions (id) on delete cascade,
  role        virgil_message_role not null,
  content     text not null,
  model       text,
  created_at  timestamptz not null default now()
);

create index virgil_session_messages_session_idx
  on public.virgil_session_messages (session_id, created_at);

-- ── RLS ────────────────────────────────────────────────────────────────────
alter table public.virgil_guided_sessions enable row level security;
alter table public.virgil_session_messages enable row level security;

-- Sessions: full ownership by the authenticated user. No cross-user access at all.
create policy virgil_sessions_select on public.virgil_guided_sessions
  for select using (auth.uid() = user_id);
create policy virgil_sessions_insert on public.virgil_guided_sessions
  for insert with check (auth.uid() = user_id);
create policy virgil_sessions_update on public.virgil_guided_sessions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy virgil_sessions_delete on public.virgil_guided_sessions
  for delete using (auth.uid() = user_id);

-- Messages: readable/insertable only within a session the caller owns. The
-- EXISTS subquery is itself subject to the sessions SELECT policy above, so it
-- only matches the caller's own sessions — no separate ownership column needed.
create policy virgil_messages_select on public.virgil_session_messages
  for select using (
    exists (
      select 1 from public.virgil_guided_sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  );
create policy virgil_messages_insert on public.virgil_session_messages
  for insert with check (
    exists (
      select 1 from public.virgil_guided_sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  );

-- ── Grants (deny-by-default, then the minimum each role needs) ──────────────
revoke all on public.virgil_guided_sessions from anon, authenticated;
revoke all on public.virgil_session_messages from anon, authenticated;
grant select, insert, update, delete on public.virgil_guided_sessions to authenticated;
grant select, insert on public.virgil_session_messages to authenticated;

-- Live resume across tabs.
alter publication supabase_realtime add table public.virgil_guided_sessions;
alter publication supabase_realtime add table public.virgil_session_messages;
