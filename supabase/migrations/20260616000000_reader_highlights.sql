-- ─────────────────────────────────────────────
-- Reader Highlights — Schema
-- ─────────────────────────────────────────────
-- Stores user text highlights made in the reader. Each row anchors a
-- highlighted passage to a user + book + chapter, plus a character-offset
-- range into the chapter's rendered text so the highlight can be re-applied
-- to the DOM on reload. `selected_text` is kept for display (bookmarks page)
-- and as a sanity fallback when re-anchoring.

create table if not exists public.highlights (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  book_id       text not null,
  chapter_index integer not null,
  selected_text text not null,
  start_offset  integer not null,
  end_offset    integer not null,
  color         text not null default '#FFE08A',
  created_at    timestamptz not null default now()
);

-- Fast lookup: "what has this user highlighted in this book+chapter?"
create index if not exists idx_highlights_user_book_chapter
  on public.highlights (user_id, book_id, chapter_index);

-- ── Row Level Security ───────────────────────

alter table public.highlights enable row level security;

-- Users can read their own highlights.
create policy "Users can view own highlights"
  on public.highlights
  for select
  using (auth.uid() = user_id);

-- Users can insert their own highlights.
create policy "Users can insert own highlights"
  on public.highlights
  for insert
  with check (auth.uid() = user_id);

-- Users can delete their own highlights.
create policy "Users can delete own highlights"
  on public.highlights
  for delete
  using (auth.uid() = user_id);
