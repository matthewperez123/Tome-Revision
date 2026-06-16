-- ─────────────────────────────────────────────
-- Trial Question Types — Schema (feat/quiz-question-types)
-- ─────────────────────────────────────────────
-- Extends the EXISTING public.trials table (section-attached questions, added
-- in 20260416000000_hamlet_structured_content.sql) with a typed-question model
-- for the six net-new question types. Legacy rows keep using kind/answer_index;
-- new rows set `type` + `content` (jsonb payload validated by the zod schema in
-- src/lib/trials/question-types.ts on read).
--
-- Also adds recitation_progress: the ONLY new per-user state the six types
-- need (the highest progressive-cloze level a user reached for a passage).

-- ── Enum of the six question types ───────────
do $$
begin
  create type public.trial_question_type as enum (
    'fill_the_line',
    'find_the_evidence',
    'word_in_context',
    'match_pairs',
    'who_said_it',
    'recitation'
  );
exception
  when duplicate_object then null;
end $$;

-- ── Extend public.trials ─────────────────────
-- Nullable `type`/`content` so existing comprehension rows are untouched;
-- new typed questions populate them. `wisdom_reward` already exists and is the
-- Wisdom (points) award — we reuse it rather than adding a duplicate column.
alter table public.trials
  add column if not exists type        public.trial_question_type,
  add column if not exists content     jsonb,
  add column if not exists explanation text,
  add column if not exists difficulty  text    not null default 'apprentice',
  add column if not exists flames      integer not null default 1,
  add column if not exists position    integer not null default 0;

-- Constrain difficulty to the tier ramp (apprentice/scholar/master).
do $$
begin
  alter table public.trials
    add constraint trials_difficulty_check
    check (difficulty in ('apprentice', 'scholar', 'master'));
exception
  when duplicate_object then null;
end $$;

-- A typed row must carry its content payload.
do $$
begin
  alter table public.trials
    add constraint trials_typed_content_check
    check (type is null or content is not null);
exception
  when duplicate_object then null;
end $$;

-- Typed questions (type + content) don't use the legacy comprehension columns.
-- Relax them to nullable so a typed row need not carry kind/options/answer_index;
-- legacy comprehension rows continue to populate them.
alter table public.trials alter column kind drop not null;
alter table public.trials alter column options drop not null;
alter table public.trials alter column answer_index drop not null;
alter table public.trials alter column prompt drop not null;
alter table public.trials alter column anchor_line_start drop not null;
alter table public.trials alter column anchor_line_end drop not null;

-- A row is valid if it is either a legacy comprehension question (kind set)
-- or a typed question (type set).
do $$
begin
  alter table public.trials
    add constraint trials_kind_or_type_check
    check (kind is not null or type is not null);
exception
  when duplicate_object then null;
end $$;

-- Fast lookup of typed questions for a section, in author order.
create index if not exists idx_trials_section_position
  on public.trials (section_id, position);

-- ── recitation_progress (per-user level reached) ──
create table if not exists public.recitation_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  -- The passage identity: a trial id, or a stable content hash for non-DB
  -- (content/*.json) recitation passages.
  passage_id    text not null,
  -- Highest round index the user completed from memory (0-based).
  level_reached integer not null default 0,
  updated_at    timestamptz not null default now(),
  constraint recitation_progress_unique unique (user_id, passage_id)
);

create index if not exists idx_recitation_progress_user
  on public.recitation_progress (user_id);

-- ── Row Level Security: users see only their own ──
alter table public.recitation_progress enable row level security;

create policy "Users can view own recitation progress"
  on public.recitation_progress
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own recitation progress"
  on public.recitation_progress
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own recitation progress"
  on public.recitation_progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
