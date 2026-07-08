-- Fix: infinite recursion (42P17) in guided_sessions / guided_session_participants RLS.
--
-- The original policies cross-reference each other's table inside their USING
-- subqueries:
--   guided_sessions."Students read joined sessions"  -> subquery on guided_session_participants
--   guided_session_participants."Teachers manage participants" -> subquery on guided_sessions
-- Each subquery re-applies the *other* table's RLS, which re-enters the first,
-- so Postgres aborts every authenticated SELECT on guided_sessions with
-- "infinite recursion detected in policy for relation guided_sessions".
-- This 500s the entire guided-learning feature (list, monitor, student join).
--
-- Fix mirrors the established codebase pattern (is_group_member,
-- user_has_classroom_role): move each cross-table check into a SECURITY DEFINER
-- helper. A definer function bypasses the referenced table's RLS, so the cycle
-- is broken while the access rules are unchanged. auth.uid() still resolves from
-- the caller's JWT (it reads a GUC, not the definer identity).

create or replace function public.is_guided_session_teacher(p_session uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.guided_sessions gs
    where gs.id = p_session
      and gs.teacher_id = auth.uid()
  );
$$;

create or replace function public.is_guided_session_participant(p_session uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.guided_session_participants gsp
    where gsp.session_id = p_session
      and gsp.student_id = auth.uid()
  );
$$;

revoke all on function public.is_guided_session_teacher(uuid) from public;
revoke all on function public.is_guided_session_participant(uuid) from public;
grant execute on function public.is_guided_session_teacher(uuid) to authenticated;
grant execute on function public.is_guided_session_participant(uuid) to authenticated;

-- Rebuild the two recursive policies against the helpers.
drop policy if exists "Students read joined sessions" on public.guided_sessions;
create policy "Students read joined sessions"
  on public.guided_sessions for select
  using (public.is_guided_session_participant(id));

drop policy if exists "Teachers manage participants" on public.guided_session_participants;
create policy "Teachers manage participants"
  on public.guided_session_participants for all
  using (public.is_guided_session_teacher(session_id))
  with check (public.is_guided_session_teacher(session_id));
