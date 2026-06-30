-- ─────────────────────────────────────────────
-- Progress persistence + weekly digest
-- ─────────────────────────────────────────────
-- 1. Give every reader a server-side home for Wisdom (XP) and Flames (streak)
--    so progress survives sign-out/sign-in across devices. localStorage stays
--    the instant source of truth; these columns are the durable mirror.
-- 2. Persist passed Trials per reader (quiz_results) — feeds both the Stoa and
--    the weekly digest aggregation.
-- 3. digest_runs gates one weekly email per reader per week (idempotency).

-- ── profiles: Wisdom + Flames ────────────────
alter table public.profiles
  add column if not exists total_xp integer not null default 0,
  add column if not exists current_streak integer not null default 0;

-- handle_new_user already seeds (id, display_name, avatar_url); total_xp /
-- current_streak inherit their column defaults (0), so OAuth and email signups
-- both land with a fully-formed profile. No trigger change required.

-- ── quiz_results ─────────────────────────────
-- One row per passed Trial. Owner-scoped: a reader reads/writes only their own.
create table if not exists public.quiz_results (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  book_id       text not null,
  chapter_index integer not null default 0,
  difficulty    text,
  score         integer not null default 0,        -- percent 0..100
  total_questions integer not null default 0,
  wisdom_earned integer not null default 0,
  passed        boolean not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists quiz_results_user_created_idx
  on public.quiz_results (user_id, created_at desc);

alter table public.quiz_results enable row level security;

create policy "Users can view own quiz results"
  on public.quiz_results for select
  using (auth.uid() = user_id);

create policy "Users can insert own quiz results"
  on public.quiz_results for insert
  with check (auth.uid() = user_id);

-- ── digest_runs ──────────────────────────────
-- (user_id, week_start) is unique: one digest per reader per week. Written by
-- the cron (service role). RLS is enabled with NO policies — service-role
-- bypasses RLS, and no client ever needs to touch this table.
create table if not exists public.digest_runs (
  user_id    uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  sent_at    timestamptz not null default now(),
  primary key (user_id, week_start)
);

alter table public.digest_runs enable row level security;
