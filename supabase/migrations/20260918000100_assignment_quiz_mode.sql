-- [1.5] Assignment quiz mode — the composer's "Quiz at the end" control.
--
-- quiz_mode decides what the reader offers at the end of the assigned range:
--   'platform' (default) — Tome's question bank for the range, at
--                          platform_quiz_difficulty (Apprentice|Scholar|Master).
--   'teacher'            — the teacher's own quiz (assignments.quiz_id).
--   'none'               — no quiz; the reader CTA reads "Mark as read".
--
-- Additive only. Backfill: rows that already carry a teacher quiz become
-- 'teacher'; existing reading rows default to 'platform'/'Apprentice' so the
-- reader's resolution ladder has an explicit difficulty to work from.

alter table public.assignments
  add column if not exists quiz_mode text not null default 'platform'
    constraint assignments_quiz_mode_check
    check (quiz_mode in ('platform', 'teacher', 'none')),
  add column if not exists platform_quiz_difficulty text
    constraint assignments_platform_quiz_difficulty_check
    check (platform_quiz_difficulty in ('Apprentice', 'Scholar', 'Master'));

update public.assignments
set quiz_mode = 'teacher'
where quiz_id is not null
  and quiz_mode <> 'teacher';

update public.assignments
set platform_quiz_difficulty = 'Apprentice'
where quiz_mode = 'platform'
  and type in ('reading', 'chapter_read')
  and platform_quiz_difficulty is null;
