-- My Classes: live gradebook derivation.
--
-- Reuses existing data instead of recomputing a separate grade store:
--   * reading assignments  -> completion derived from reading_progress
--   * trial/quiz assignments -> completion + score derived from quiz_results
--   * essay/discussion/etc -> stored submission status + manual grade
--
-- A teacher's gradebook therefore reflects student work the moment it lands in
-- reading_progress / quiz_results, with no duplicated tracking. Manual grades
-- (the existing grades table) always take precedence when present.
--
-- Staff-only: gated by user_has_classroom_role(owner|co_teacher|ta). A student
-- can never reach another student's row through this function.

create or replace function public.classroom_gradebook(p_classroom uuid)
returns table (
  assignment_id uuid,
  assignment_title text,
  assignment_type text,
  book_id text,
  chapter_start int,
  chapter_end int,
  points_available int,
  due_date timestamptz,
  student_id uuid,
  student_name text,
  student_username text,
  submission_id uuid,
  status text,
  score numeric,
  max_score numeric,
  completed_at timestamptz,
  source text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;
  if not public.user_has_classroom_role(
    auth.uid(), p_classroom, array['owner', 'co_teacher', 'ta']
  ) then
    raise exception 'NOT_CLASSROOM_STAFF';
  end if;

  return query
  with staff_assignments as (
    select a.* from public.assignments a where a.classroom_id = p_classroom
  ),
  students as (
    select cm.student_id
    from public.classroom_members cm
    where cm.classroom_id = p_classroom and cm.role = 'student'
  )
  select
    sa.id,
    sa.title,
    sa.type,
    sa.book_id,
    sa.chapter_range_start,
    sa.chapter_range_end,
    sa.points_available,
    sa.due_date,
    st.student_id,
    p.display_name,
    p.username,
    sub.id,
    case
      when g.id is not null or sub.status = 'graded' then 'graded'
      when reading.done then 'completed'
      when trial.passed then 'completed'
      when sub.status is not null then sub.status
      else 'not_started'
    end,
    coalesce(g.score, case when trial.passed then trial.best_score::numeric end, sub.score::numeric),
    coalesce(g.max_score, sa.points_available::numeric, 100),
    coalesce(g.graded_at, trial.completed_at, reading.completed_at, sub.submitted_at),
    case
      when g.id is not null then 'manual'
      when reading.done then 'reading'
      when trial.passed then 'trial'
      when sub.id is not null then 'submission'
      else 'none'
    end
  from staff_assignments sa
  cross join students st
  left join public.profiles p on p.id = st.student_id
  left join public.assignment_submissions sub
    on sub.assignment_id = sa.id and sub.student_id = st.student_id
  left join public.grades g on g.submission_id = sub.id
  left join lateral (
    select true as done, max(rp.updated_at) as completed_at
    from public.reading_progress rp
    where sa.type in ('chapter_read', 'reading')
      and sa.book_id is not null
      and rp.user_id = st.student_id
      and rp.book_id = sa.book_id
      and rp.chapter_index >= coalesce(sa.chapter_range_end, sa.chapter_range_start, 0)
    having count(*) > 0
  ) reading on true
  left join lateral (
    select true as passed, max(qr.score) as best_score, max(qr.created_at) as completed_at
    from public.quiz_results qr
    where sa.type in ('trial', 'quiz')
      and sa.book_id is not null
      and qr.user_id = st.student_id
      and qr.book_id = sa.book_id
      and qr.passed = true
      and (sa.chapter_range_start is null or qr.chapter_index >= sa.chapter_range_start)
      and (sa.chapter_range_end is null or qr.chapter_index <= sa.chapter_range_end)
    having count(*) > 0
  ) trial on true
  order by sa.created_at, p.display_name;
end;
$$;

revoke all on function public.classroom_gradebook(uuid) from public;
grant execute on function public.classroom_gradebook(uuid) to authenticated;
