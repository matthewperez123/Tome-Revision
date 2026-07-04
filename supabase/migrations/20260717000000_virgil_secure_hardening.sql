-- Virgil Secured — Part 1 (1g): the single approved schema change.
--
-- Bundles ONLY what Part 0 proved missing:
--   (a) a service-role-only abuse-control ledger the hardened API already reads
--       (per-task daily caps + per-object regenerate caps),
--   (b) closing the draft-privacy hole — students could SELECT a Virgil draft's
--       ai_feedback / ai_rubric_breakdown on their own teacher_quiz_responses
--       rows before a teacher ever reviewed them,
--   (c) two audit columns so a finalized grade records what Virgil DRAFTED vs
--       what the teacher CONFIRMED.
--
-- Nothing here is destructive: one new table, one column-privilege tightening,
-- two additive nullable columns.

begin;

-- ── (a) Abuse-control ledger ────────────────────────────────────────────────
-- Per-teacher, per-task, per-day event log. The service role is the ONLY writer
-- and reader (it bypasses RLS); browsers get no access, so caps can't be forged.
create table if not exists public.virgil_task_events (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references public.profiles(id) on delete cascade,
  task        text not null,
  object_id   uuid,
  usage_date  date not null default ((now() at time zone 'utc')::date),
  created_at  timestamptz not null default now()
);

-- Supports isOverTaskCap: count by (teacher, task, day).
create index if not exists virgil_task_events_cap_idx
  on public.virgil_task_events (teacher_id, task, usage_date);
-- Supports isOverRegenCap: count by (teacher, task, object, day).
create index if not exists virgil_task_events_regen_idx
  on public.virgil_task_events (teacher_id, task, object_id, usage_date);

alter table public.virgil_task_events enable row level security;
-- No policies are created → deny-by-default. Only the service role (BYPASSRLS)
-- touches this ledger. Explicitly strip client grants for defense in depth.
revoke all on public.virgil_task_events from anon, authenticated;

-- ── (b) Draft privacy on teacher_quiz_responses ─────────────────────────────
-- The "Students read own responses" RLS policy is row-correct but column-blind:
-- a student could read the Virgil DRAFT feedback/rubric on their own rows. A
-- column-level REVOKE alone would NOT take effect while a table-level SELECT
-- grant is present, so we drop the table-level grant and re-grant every column
-- EXCEPT the two draft-internal ones. Teachers read drafts through the service
-- role (createAdminClient), which is unaffected by these grants; students no
-- longer can. New columns are denied by default until explicitly granted.
revoke select on public.teacher_quiz_responses from authenticated;
grant select (
  id, quiz_id, question_id, session_id, participant_id, student_id,
  response, is_correct, score, max_points, graded_by, teacher_override,
  graded_at, created_at, hints_used, hint_max_level
) on public.teacher_quiz_responses to authenticated;

-- ── (c) Finalize audit columns on grade_history ─────────────────────────────
-- When a Virgil-assisted grade is finalized, record the model's draft score and
-- the teacher's confirmed final score alongside the existing previous_* trail.
-- Nullable: only set for Virgil-assisted finalizes; teacher-only edits leave
-- them null.
alter table public.grade_history
  add column if not exists ai_draft_score numeric(5,2),
  add column if not exists final_score    numeric(5,2);

commit;
