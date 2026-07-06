-- Virgil Loop + COPPA student login
-- Single approved migration for the today/virgil-loop session.
--
-- Audit findings that shaped this file:
--   * notifications enum already has class_assignment + assignment_graded  -> NO enum changes.
--   * assignments.quiz_id (uuid) already exists but is UNLINKED (no FK), and
--     every existing row is null -> add the FK to teacher_quizzes here rather
--     than introducing a redundant teacher_quiz_id column.
--   * student_access_codes / login_attempts do not exist -> create them.

begin;

-- ── 1. Assignment ↔ teacher quiz linkage ─────────────────────────────────────
-- quiz_id already exists on assignments and is read by the assignment detail
-- UI; it simply lacked referential integrity. All current values are null, so
-- attaching the FK is safe. SET NULL so deleting a quiz doesn't orphan-delete
-- the assignment.
alter table public.assignments
  add constraint assignments_quiz_id_fkey
  foreign key (quiz_id) references public.teacher_quizzes(id) on delete set null;

-- ── 2. Code-only student access (COPPA / school-consent) ─────────────────────
create table if not exists public.student_access_codes (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  display_name text not null,            -- "First L." — no full surnames, no emails, no DOB
  code         text not null unique,     -- format XXXX-XXXX, unambiguous alphabet
  code_prefix  text generated always as (left(code, 4)) stored,
  active       boolean not null default true,
  created_by   uuid not null references auth.users(id),
  created_at   timestamptz not null default now(),
  rotated_at   timestamptz
);
create index if not exists student_access_codes_code_prefix_idx
  on public.student_access_codes (code_prefix);

alter table public.student_access_codes enable row level security;

-- Teachers manage codes ONLY for classrooms they own/co-teach. Uses the shared
-- SECURITY DEFINER helper so the policy never queries classroom_members directly
-- (that recursion caused the June crash).
create policy "teacher manages own classroom codes" on public.student_access_codes
  for all
  using ( public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher']) )
  with check ( public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher']) );

-- A student may read their own code row (for a "your code" display) but never
-- anyone else's.
create policy "student reads own code row" on public.student_access_codes
  for select
  using ( auth.uid() = user_id );

-- ── 3. Login rate-limit ledger (service-role only; no client policies) ───────
create table if not exists public.login_attempts (
  id           uuid primary key default gen_random_uuid(),
  code_prefix  text not null,
  ip           inet,
  attempted_at timestamptz not null default now()
);
create index if not exists login_attempts_prefix_time_idx
  on public.login_attempts (code_prefix, attempted_at);

alter table public.login_attempts enable row level security;
-- RLS enabled with zero policies => deny-all to clients; only the service role
-- (which bypasses RLS) can read/write. No grants added.

commit;
