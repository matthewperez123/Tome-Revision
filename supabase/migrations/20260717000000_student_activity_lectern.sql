-- Classroom Live · The Lectern heartbeat
-- Single approved migration for the today/classroom-live session.
--
-- Part 0 audit proved only ONE thing is missing for this prompt:
--   * The assign→submit→grade loop is fully wired (assignments/grades/quiz/grading).
--   * assignment_submissions.response_text ALREADY holds essay bodies -> NO new
--     essay content column needed.
--   * assignment_submissions / classroom_announcements / reading_progress are
--     ALREADY in supabase_realtime.
--   * There is NO presence/heartbeat table for a live teacher board -> create
--     student_activity here and publish it for Realtime.

begin;

-- ── student_activity: one live-presence row per student ──────────────────────
-- Upserted by the reader / quiz / essay screens via a heartbeat beacon. A row
-- is a *cursor*, not a log: PRIMARY KEY (user_id) means each student has exactly
-- one row that gets refreshed in place. Idleness is derived client/board-side
-- from last_seen_at, so no separate "online" boolean is stored.
create table if not exists public.student_activity (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  classroom_id  uuid not null references public.classrooms(id) on delete cascade,
  surface       text not null,                 -- 'reading' | 'quiz' | 'essay'
  book_id       text,                          -- plain slug, matches reading_progress.book_id
  chapter_index int,                           -- 0-based, when surface = reading
  assignment_id uuid references public.assignments(id) on delete set null,
  detail        text,                          -- short human label e.g. "Ch. 3" / "On Achilles' Rage"
  last_seen_at  timestamptz not null default now()
);
create index if not exists student_activity_classroom_idx
  on public.student_activity (classroom_id, last_seen_at desc);

alter table public.student_activity enable row level security;

-- A student writes ONLY their own presence row. Split into explicit INSERT /
-- UPDATE policies so the heartbeat upsert is covered on both paths, and both
-- pin user_id = auth.uid() with check so no one can beacon as someone else.
create policy "student inserts own activity" on public.student_activity
  for insert
  with check ( auth.uid() = user_id );

create policy "student updates own activity" on public.student_activity
  for update
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

-- A student may read back their own row.
create policy "student reads own activity" on public.student_activity
  for select
  using ( auth.uid() = user_id );

-- Teachers of the classroom read every student's activity through the shared
-- SECURITY DEFINER helper so the policy never touches classroom_members
-- directly (that recursion caused the June crash).
create policy "teacher reads classroom activity" on public.student_activity
  for select
  using ( public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher','ta']) );

-- ── Realtime ────────────────────────────────────────────────────────────────
-- The Lectern subscribes to postgres_changes on this table. (The other three
-- classroom tables are already in the publication.)
alter publication supabase_realtime add table public.student_activity;

commit;
