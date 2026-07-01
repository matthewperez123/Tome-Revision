-- Build A: live teacher progress dashboard.
-- 1) A SECURITY DEFINER helper: does the caller share a classroom, AS STAFF,
--    with the target student? (bypasses classroom_members RLS, no recursion)
create or replace function public.staff_can_view_student(p_student_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.classroom_members staff
    join public.classroom_members stud
      on stud.classroom_id = staff.classroom_id
    where staff.student_id = auth.uid()
      and staff.role in ('owner', 'co_teacher', 'ta')
      and stud.student_id = p_student_id
      and stud.role = 'student'
  );
$$;

-- 2) Staff-read SELECT policy on reading_progress so a teacher's
--    postgres_changes subscription actually delivers their students' events.
--    (OR-ed with the existing own-rows policy; students keep own-only access.)
drop policy if exists reading_progress_staff_select on public.reading_progress;
create policy reading_progress_staff_select on public.reading_progress
  for select to authenticated
  using (public.staff_can_view_student(user_id));

-- 3) Teacher-gated aggregate board: per-student furthest chapter, current book,
--    last active, and Trial performance — all from real rows.
create or replace function public.classroom_reading_board(p_classroom uuid)
returns table(
  student_id uuid,
  student_name text,
  student_username text,
  avatar_url text,
  last_active timestamptz,
  current_book_id text,
  current_chapter integer,
  furthest_chapter integer,
  books_started integer,
  trials_attempted integer,
  trials_passed integer,
  avg_score_pct integer,
  last_trial_at timestamptz
)
language plpgsql stable security definer set search_path = ''
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
  with students as (
    select cm.student_id
    from public.classroom_members cm
    where cm.classroom_id = p_classroom and cm.role = 'student'
  ),
  latest as (
    select distinct on (rp.user_id)
      rp.user_id, rp.book_id, rp.chapter_index, rp.updated_at
    from public.reading_progress rp
    join students s on s.student_id = rp.user_id
    order by rp.user_id, rp.updated_at desc
  ),
  agg as (
    select rp.user_id,
      max(rp.updated_at) as last_active,
      max(rp.chapter_index) as furthest_chapter,
      count(distinct rp.book_id) as books_started
    from public.reading_progress rp
    join students s on s.student_id = rp.user_id
    group by rp.user_id
  ),
  trials as (
    select qr.user_id,
      count(*) as trials_attempted,
      count(*) filter (where qr.passed) as trials_passed,
      round(avg(
        case when qr.total_questions > 0
          then qr.score::numeric / qr.total_questions * 100
        end
      ))::int as avg_score_pct,
      max(qr.created_at) as last_trial_at
    from public.quiz_results qr
    join students s on s.student_id = qr.user_id
    group by qr.user_id
  )
  select
    st.student_id,
    p.display_name,
    p.username,
    p.avatar_url,
    agg.last_active,
    l.book_id,
    l.chapter_index,
    agg.furthest_chapter,
    coalesce(agg.books_started, 0)::int,
    coalesce(t.trials_attempted, 0)::int,
    coalesce(t.trials_passed, 0)::int,
    t.avg_score_pct,
    t.last_trial_at
  from students st
  left join public.profiles p on p.id = st.student_id
  left join latest l on l.user_id = st.student_id
  left join agg on agg.user_id = st.student_id
  left join trials t on t.user_id = st.student_id
  order by agg.last_active desc nulls last, p.display_name;
end;
$$;

grant execute on function public.classroom_reading_board(uuid) to authenticated;
grant execute on function public.staff_can_view_student(uuid) to authenticated;
