-- ─────────────────────────────────────────────
-- Tome Achievement System — Schema
-- ─────────────────────────────────────────────
-- Stores user achievement unlocks. The achievement catalog itself lives
-- in the application code (src/data/achievements/); this table records
-- which user earned which seal and when.

create table if not exists public.achievement_unlocks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null,
  unlocked_at   timestamptz not null default now(),
  wisdom_awarded integer not null default 0,

  constraint achievement_unlocks_unique unique (user_id, achievement_id)
);

-- Fast lookup: "what has this user unlocked?"
create index if not exists idx_achievement_unlocks_user
  on public.achievement_unlocks (user_id);

-- Fast lookup: "who has unlocked this achievement?"
create index if not exists idx_achievement_unlocks_achievement
  on public.achievement_unlocks (achievement_id);

-- ── Row Level Security ───────────────────────

alter table public.achievement_unlocks enable row level security;

-- Users can read their own unlocks
create policy "Users can view own achievement unlocks"
  on public.achievement_unlocks
  for select
  using (auth.uid() = user_id);

-- Users can insert their own unlocks (client-side unlock writes)
create policy "Users can insert own achievement unlocks"
  on public.achievement_unlocks
  for insert
  with check (auth.uid() = user_id);

-- No update or delete — achievement unlocks are permanent
