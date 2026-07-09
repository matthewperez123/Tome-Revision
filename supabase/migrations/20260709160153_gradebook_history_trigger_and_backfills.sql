-- Gradebook & Grades: trigger-enforced grade_history mirror + backfills.
--
-- Problem this fixes:
--   * grade_history was mirrored only by application code in gradeSubmission,
--     so auto-graded paths (teacher-quiz completion, reading/trial finalize)
--     wrote a `grades` row but NEVER a history row (grades=36, history=34).
--   * Teacher-quiz completion wrote teacher_quiz_results but no `grades` row at
--     all, so the submission stayed "submitted" and the score never reached the
--     gradebook or the student's view.
--
-- The fix moves mirroring into a database trigger so NO write path — present or
-- future, app or admin — can bypass the audit trail. `grades` stays the single
-- source of truth; every insert/update snapshots into grade_history.

-- Auto-graded rows have no human grader, so changed_by must be nullable.
alter table public.grade_history alter column changed_by drop not null;

-- The mirror. AFTER INSERT records the new grade (no previous_* — this is the
-- first grade). AFTER UPDATE records the prior score/feedback/grader alongside
-- the new final score, so an override keeps a full before/after row.
create or replace function public.mirror_grade_to_history()
returns trigger
language plpgsql
security definer
set search_path to ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.grade_history
      (grade_id, previous_score, previous_feedback, previous_graded_by,
       changed_by, ai_draft_score, final_score, changed_at)
    values
      (new.id, null, null, null, new.graded_by, null, new.score, new.graded_at);
  elsif tg_op = 'UPDATE' then
    insert into public.grade_history
      (grade_id, previous_score, previous_feedback, previous_graded_by,
       changed_by, ai_draft_score, final_score, changed_at)
    values
      (new.id, old.score, old.feedback, old.graded_by, new.graded_by, null,
       new.score, now());
  end if;
  return null;
end;
$$;

drop trigger if exists trg_mirror_grade_to_history on public.grades;
create trigger trg_mirror_grade_to_history
  after insert or update on public.grades
  for each row execute function public.mirror_grade_to_history();

-- ── Backfills ──────────────────────────────────────────────────────────────

-- Defect B: the newest auto-graded grade (9710c1a8, 100/100, 2026-07-08) was
-- written before the trigger existed and has no history row. Snapshot it.
insert into public.grade_history
  (grade_id, previous_score, previous_feedback, previous_graded_by,
   changed_by, ai_draft_score, final_score, changed_at)
select g.id, null, null, null, g.graded_by, null, g.score, g.graded_at
from public.grades g
where not exists (
  select 1 from public.grade_history h where h.grade_id = g.id
);

-- Defect A: Beatrice Cole's Moby Dick quiz submission (61589bc9) completed with
-- teacher_quiz_results (score 2 / total 12 => 17%) but never produced a grade.
-- Write the canonical grade on the assignment's 100-point scale and mark the
-- submission graded. The trigger above mirrors it into grade_history.
insert into public.grades
  (submission_id, score, max_score, is_auto_graded, graded_by, graded_at)
select '61589bc9-1ece-461e-9deb-d1bb5b4567da'::uuid, 17, 100, true, null, now()
where not exists (
  select 1 from public.grades
  where submission_id = '61589bc9-1ece-461e-9deb-d1bb5b4567da'::uuid
);

update public.assignment_submissions
   set status = 'graded', score = 17, graded_at = coalesce(graded_at, now())
 where id = '61589bc9-1ece-461e-9deb-d1bb5b4567da'::uuid
   and status <> 'graded';
