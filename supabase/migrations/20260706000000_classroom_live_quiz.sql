-- ============================================================================
-- Live quiz mode (Kahoot-style) for the classroom live loop.
--
-- A teacher launches an existing teacher_quiz as a LIVE game: students join a
-- lobby, the host reveals one question at a time, answers race in on a per-
-- question countdown, a live leaderboard updates, and when the game ends each
-- student's result persists through the SOLE authoritative path
-- (record_trial_result) — never a second INSERT into quiz_results.
--
-- Design invariants honored here:
--   * Every classroom-scoped policy calls user_has_classroom_role /
--     user_is_classroom_member (the locked helpers) — no ad-hoc membership SQL.
--   * All participant/answer WRITES go through SECURITY DEFINER RPCs, so scoring
--     is server-authoritative (a client can never inflate its own score) and the
--     tables carry SELECT-only policies (deny-by-default for direct writes).
--   * COPPA: join reads profiles.display_name server-side only; the synthetic
--     student email is never stored or exposed. The leaderboard shows the safe
--     display-name snapshot.
--   * Results persist through record_trial_result LINEAGE: finalize is called BY
--     each student (auth.uid() = the student) and internally PERFORMs the
--     existing record_trial_result RPC — it consumes that RPC, it does not
--     reimplement wisdom math or open a new quiz_results write path.
-- ============================================================================

-- Host-controlled game state machine.
do $$ begin
  create type public.live_quiz_status as enum ('lobby', 'question', 'reveal', 'ended');
exception when duplicate_object then null; end $$;

-- ── One running instance of a teacher_quiz played live to a class ───────────
create table if not exists public.live_quiz_sessions (
  id                     uuid primary key default gen_random_uuid(),
  classroom_id           uuid not null references public.classrooms(id)      on delete cascade,
  quiz_id                uuid not null references public.teacher_quizzes(id)  on delete cascade,
  host_id                uuid not null references auth.users(id)             on delete cascade,
  -- Snapshots frozen at launch so a student's self-finalize can call
  -- record_trial_result without re-reading the quiz bank.
  book_id                text not null,
  chapter_index          int  not null default 0,
  difficulty             text not null default 'apprentice',
  total_questions        int  not null default 0,
  status                 public.live_quiz_status not null default 'lobby',
  current_question_index int  not null default -1,        -- -1 = lobby (not started)
  question_started_at    timestamptz,                     -- per-question countdown anchor
  created_at             timestamptz not null default now(),
  ended_at               timestamptz
);

-- ── Who joined a given live game (safe display-name snapshot; never email) ───
create table if not exists public.live_quiz_participants (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references public.live_quiz_sessions(id) on delete cascade,
  student_id    uuid not null references auth.users(id)               on delete cascade,
  display_name  text not null,                            -- COPPA-safe snapshot
  score         int  not null default 0,                  -- speed-weighted, server-maintained
  correct_count int  not null default 0,                  -- server-maintained
  joined_at     timestamptz not null default now(),
  finalized_at  timestamptz,                              -- guards double self-finalize
  unique (session_id, student_id)
);

-- ── One answer per question per student ─────────────────────────────────────
create table if not exists public.live_quiz_answers (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid not null references public.live_quiz_sessions(id) on delete cascade,
  question_index int  not null,
  student_id     uuid not null references auth.users(id)               on delete cascade,
  answer         text,
  is_correct     boolean not null default false,          -- server-computed
  points_awarded int     not null default 0,              -- server-computed
  answered_at    timestamptz not null default now(),
  unique (session_id, question_index, student_id)
);

alter table public.live_quiz_sessions     enable row level security;
alter table public.live_quiz_participants enable row level security;
alter table public.live_quiz_answers      enable row level security;

-- ── RLS: live_quiz_sessions ─────────────────────────────────────────────────
-- Read: any member of the class (staff or student) sees their class's games.
create policy live_quiz_sessions_select on public.live_quiz_sessions
  for select to authenticated
  using (public.user_is_classroom_member(auth.uid(), classroom_id));
-- Create / advance / end: staff only, and only for a class they staff.
create policy live_quiz_sessions_insert on public.live_quiz_sessions
  for insert to authenticated
  with check (
    host_id = auth.uid()
    and public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher','ta'])
  );
create policy live_quiz_sessions_update on public.live_quiz_sessions
  for update to authenticated
  using      (public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher','ta']))
  with check (public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher','ta']));

-- ── RLS: participants + answers are READ-ONLY to clients ────────────────────
-- All writes flow through the SECURITY DEFINER RPCs below (which bypass RLS),
-- so there is deliberately no client INSERT/UPDATE policy — a student can never
-- write their own score/correctness directly. SELECT is class-scoped so the
-- live leaderboard and answer reveal are visible to everyone in the room.
create policy live_quiz_participants_select on public.live_quiz_participants
  for select to authenticated
  using (exists (
    select 1 from public.live_quiz_sessions s
    where s.id = session_id
      and public.user_is_classroom_member(auth.uid(), s.classroom_id)
  ));
create policy live_quiz_answers_select on public.live_quiz_answers
  for select to authenticated
  using (exists (
    select 1 from public.live_quiz_sessions s
    where s.id = session_id
      and public.user_is_classroom_member(auth.uid(), s.classroom_id)
  ));

-- ── RPC: join a live game (COPPA-safe name snapshot) ────────────────────────
create or replace function public.join_live_quiz(p_session_id uuid)
returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_classroom uuid;
  v_name      text;
  v_id        uuid;
begin
  if auth.uid() is null then raise exception 'NOT_AUTHENTICATED'; end if;

  select classroom_id into v_classroom
  from public.live_quiz_sessions where id = p_session_id;
  if v_classroom is null then raise exception 'NO_SUCH_SESSION'; end if;

  if not public.user_is_classroom_member(auth.uid(), v_classroom) then
    raise exception 'NOT_A_MEMBER';
  end if;

  -- Safe display name only — the synthetic student email is never read.
  select coalesce(display_name, 'Reader') into v_name
  from public.profiles where id = auth.uid();

  insert into public.live_quiz_participants (session_id, student_id, display_name)
  values (p_session_id, auth.uid(), coalesce(v_name, 'Reader'))
  on conflict (session_id, student_id)
    do update set display_name = excluded.display_name
  returning id into v_id;

  return v_id;
end $$;

-- ── RPC: submit an answer (server-authoritative scoring) ────────────────────
create or replace function public.submit_live_quiz_answer(
  p_session_id     uuid,
  p_question_index int,
  p_answer         text
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_session   public.live_quiz_sessions;
  v_correct   text;
  v_is_correct boolean;
  v_elapsed   numeric;
  v_points    int;
begin
  if auth.uid() is null then raise exception 'NOT_AUTHENTICATED'; end if;

  select * into v_session from public.live_quiz_sessions where id = p_session_id;
  if v_session.id is null then raise exception 'NO_SUCH_SESSION'; end if;

  -- Must be an enrolled participant of this game.
  if not exists (
    select 1 from public.live_quiz_participants
    where session_id = p_session_id and student_id = auth.uid()
  ) then raise exception 'NOT_A_PARTICIPANT'; end if;

  -- Only the currently-live question accepts answers.
  if v_session.status <> 'question' or v_session.current_question_index <> p_question_index then
    raise exception 'QUESTION_NOT_LIVE';
  end if;

  -- Resolve the correct answer for this question (nth by sort_order).
  select tqq.correct_answer into v_correct
  from public.teacher_quiz_questions tqq
  where tqq.quiz_id = v_session.quiz_id
  order by tqq.sort_order
  offset p_question_index limit 1;

  v_is_correct := (v_correct is not null and p_answer is not distinct from v_correct);

  -- Speed-weighted score: 1000 at t=0, decaying, floored at 100 while correct.
  v_elapsed := greatest(0, extract(epoch from now() - coalesce(v_session.question_started_at, now())));
  v_points  := case when v_is_correct then greatest(100, 1000 - round(v_elapsed * 50)::int) else 0 end;

  -- One answer per question per student (first submission wins).
  insert into public.live_quiz_answers
    (session_id, question_index, student_id, answer, is_correct, points_awarded)
  values (p_session_id, p_question_index, auth.uid(), p_answer, v_is_correct, v_points)
  on conflict (session_id, question_index, student_id) do nothing;

  if not found then
    raise exception 'ALREADY_ANSWERED';
  end if;

  -- Roll the server-maintained running totals forward.
  update public.live_quiz_participants
  set score = score + v_points,
      correct_count = correct_count + (case when v_is_correct then 1 else 0 end)
  where session_id = p_session_id and student_id = auth.uid();

  return jsonb_build_object('is_correct', v_is_correct, 'points', v_points);
end $$;

-- ── RPC: finalize MY result through the authoritative record_trial_result ────
-- Called by each student's client when the game ends. Runs as the student
-- (auth.uid() = them) so the nested record_trial_result attributes the row and
-- computes wisdom exactly as a normal Trial would. Idempotent via finalized_at.
create or replace function public.finalize_live_quiz_for_me(p_session_id uuid)
returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_session public.live_quiz_sessions;
  v_part    public.live_quiz_participants;
begin
  if auth.uid() is null then raise exception 'NOT_AUTHENTICATED'; end if;

  select * into v_session from public.live_quiz_sessions where id = p_session_id;
  if v_session.id is null then raise exception 'NO_SUCH_SESSION'; end if;
  if v_session.status <> 'ended' then raise exception 'NOT_ENDED'; end if;

  select * into v_part from public.live_quiz_participants
  where session_id = p_session_id and student_id = auth.uid();
  if v_part.id is null then raise exception 'NOT_A_PARTICIPANT'; end if;

  -- Idempotent: only the first finalize writes a quiz_results row.
  if v_part.finalized_at is not null then return; end if;

  -- Consume the SOLE authoritative write path (server-trusted correct_count).
  perform public.record_trial_result(
    v_session.book_id,
    v_session.chapter_index,
    v_session.difficulty,
    v_part.correct_count,
    v_session.total_questions
  );

  update public.live_quiz_participants
  set finalized_at = now()
  where id = v_part.id;
end $$;

grant execute on function public.join_live_quiz(uuid)                      to authenticated;
grant execute on function public.submit_live_quiz_answer(uuid, int, text)  to authenticated;
grant execute on function public.finalize_live_quiz_for_me(uuid)           to authenticated;

-- ── Realtime: the Kahoot UI reacts to host advance + racing answers live ────
alter publication supabase_realtime add table public.live_quiz_sessions;
alter publication supabase_realtime add table public.live_quiz_participants;
alter publication supabase_realtime add table public.live_quiz_answers;
