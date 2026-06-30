-- Fix infinite recursion in classroom_members RLS.
--
-- The members_select policy referenced classroom_members inside its own USING
-- clause (a self-subquery), so any query that transitively evaluated it —
-- including a student loading their own assignments/submissions, whose RLS
-- chains assignment_submissions -> assignments -> classroom_members — hit
-- Postgres' "infinite recursion detected in policy for relation
-- classroom_members" error. This path only became reachable once the My
-- Classes surfaces moved off mock data onto live RLS-scoped queries.
--
-- Fix: route the membership check through a SECURITY DEFINER helper, which
-- runs as the function owner and therefore does NOT re-trigger RLS on the
-- inner classroom_members read. Visibility semantics are unchanged: a member
-- can still see their own row plus every row of any classroom they belong to.

create or replace function public.user_is_classroom_member(
  p_user uuid,
  p_classroom uuid
)
returns boolean
language sql
stable
security definer
set search_path = 'public'
as $$
  select exists (
    select 1
    from public.classroom_members
    where student_id = p_user
      and classroom_id = p_classroom
  );
$$;

revoke all on function public.user_is_classroom_member(uuid, uuid) from public;
grant execute on function public.user_is_classroom_member(uuid, uuid) to authenticated;

drop policy if exists members_select on public.classroom_members;
create policy members_select on public.classroom_members
  for select
  using (
    student_id = auth.uid()
    or public.user_is_classroom_member(auth.uid(), classroom_id)
  );
