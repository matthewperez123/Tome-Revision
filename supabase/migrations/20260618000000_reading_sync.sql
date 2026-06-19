-- ─────────────────────────────────────────────
-- Reading Sync — reader preferences + reading position
-- ─────────────────────────────────────────────
-- Backs the optional account-sync layer in src/lib/reader/reader-sync.ts.
-- localStorage stays the instant/offline source of truth; these tables let a
-- logged-in user's reader settings and last position follow their account
-- across devices. Both tables are owner-scoped via RLS (auth.uid() = user_id).

-- ── reading_preferences ──────────────────────
-- One row per user. `prefs` is the serialized ReaderPrefs blob (mode, theme,
-- font size, line height, measure, justify, turn style, a11y face, …).
-- Upserted on conflict (user_id) by useReaderPrefsSync().
create table if not exists public.reading_preferences (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  prefs      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.reading_preferences enable row level security;

create policy "Users can view own reading preferences"
  on public.reading_preferences
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own reading preferences"
  on public.reading_preferences
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reading preferences"
  on public.reading_preferences
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── reading_progress ─────────────────────────
-- One row per (user, book) — the last place the reader left off. `page` is set
-- in paginated modes, `scroll_ratio` in scroll mode; the other is null.
-- Upserted on conflict (user_id, book_id) by saveReadingPosition().
create table if not exists public.reading_progress (
  user_id       uuid not null references auth.users(id) on delete cascade,
  book_id       text not null,
  chapter_index integer not null default 0,
  page          integer,
  scroll_ratio  double precision,
  updated_at    timestamptz not null default now(),
  primary key (user_id, book_id)
);

alter table public.reading_progress enable row level security;

create policy "Users can view own reading progress"
  on public.reading_progress
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own reading progress"
  on public.reading_progress
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reading progress"
  on public.reading_progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own reading progress"
  on public.reading_progress
  for delete
  using (auth.uid() = user_id);
