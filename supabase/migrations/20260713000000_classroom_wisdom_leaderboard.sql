-- Real class ranking: sum each member's quiz_results.wisdom_earned. Member-gated
-- (any role) and only when the classroom has leaderboard_enabled — replaces a
-- Math.random() placeholder in ClassLeaderboardMini with real Trial data.
create or replace function public.classroom_wisdom_leaderboard(p_classroom uuid)
returns table(
  student_id uuid,
  display_name text,
  avatar_url text,
  wisdom bigint,
  trials_passed bigint
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;
  -- Caller must be a member of this classroom (staff or student).
  if not exists (
    select 1 from public.classroom_members cm
    where cm.classroom_id = p_classroom and cm.student_id = auth.uid()
  ) then
    raise exception 'NOT_A_MEMBER';
  end if;
  -- The class must opt into the leaderboard.
  if not exists (
    select 1 from public.classrooms c
    where c.id = p_classroom and c.leaderboard_enabled = true
  ) then
    raise exception 'LEADERBOARD_DISABLED';
  end if;

  return query
  with members as (
    select cm.student_id
    from public.classroom_members cm
    where cm.classroom_id = p_classroom and cm.role = 'student'
  )
  select
    m.student_id,
    p.display_name,
    p.avatar_url,
    coalesce(sum(qr.wisdom_earned), 0)::bigint as wisdom,
    count(qr.*) filter (where qr.passed)::bigint as trials_passed
  from members m
  left join public.profiles p on p.id = m.student_id
  left join public.quiz_results qr on qr.user_id = m.student_id
  group by m.student_id, p.display_name, p.avatar_url
  order by wisdom desc, trials_passed desc, p.display_name;
end;
$$;

grant execute on function public.classroom_wisdom_leaderboard(uuid) to authenticated;
