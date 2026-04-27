-- =====================================================================
-- Tome Social Layer (Phase 1)
--
-- Adds: connections (friends), classroom roles + ad-hoc groups,
-- study groups, assignment targeting, gradebook + audit, peer review,
-- book recommendations, library_entries.
--
-- Extends existing tables (classrooms, classroom_members, assignments,
-- classroom_announcements). Rewrites RLS on those four to consult the
-- new role model on classroom_members.
--
-- Notes:
--  * classroom_members.student_id is preserved as the column name for
--    legacy reasons; it now holds any classroom member regardless of
--    role. The action layer should expose it as user_id in DTOs.
--  * Join-by-code lookups (classrooms, study_groups) intentionally
--    require a service-role client server-side; RLS does not expose a
--    public-by-code SELECT, so the join_code is not enumerable.
-- =====================================================================

begin;

-- ──────────────────────────────────────────────────────────────────────
-- Section 1: ALTER existing tables
-- ──────────────────────────────────────────────────────────────────────

-- 1.1 classroom_members.role
alter table public.classroom_members
  add column if not exists role text not null default 'student'
    check (role in ('owner', 'co_teacher', 'ta', 'student'));

-- Backfill: insert an 'owner' row for each classroom's teacher_id.
-- Idempotent — only inserts if not already present.
insert into public.classroom_members (classroom_id, student_id, role, joined_at)
select c.id, c.teacher_id, 'owner', c.created_at
from public.classrooms c
where not exists (
  select 1 from public.classroom_members cm
  where cm.classroom_id = c.id and cm.student_id = c.teacher_id
);

create index if not exists classroom_members_role_idx
  on public.classroom_members (classroom_id, role);

-- 1.2 classrooms.archived_at (legacy `archived` boolean kept for back-compat)
alter table public.classrooms
  add column if not exists archived_at timestamptz;

-- 1.3 assignments: extend type, add scope + peer review + trial_id, allow
-- null due_date (low-stakes assignments don't require a deadline).
alter table public.assignments alter column due_date drop not null;
alter table public.assignments drop constraint if exists assignments_type_check;
alter table public.assignments
  add constraint assignments_type_check
  check (type in (
    'reading','quiz','discussion','essay','annotation',
    'chapter_read','trial'
  ));

alter table public.assignments
  add column if not exists scope text not null default 'classroom'
    check (scope in ('classroom','group','individuals'));

alter table public.assignments
  add column if not exists peer_review_enabled boolean not null default false;

alter table public.assignments
  add column if not exists peer_reviewers_per_submission int not null default 2
    check (peer_reviewers_per_submission between 1 and 5);

alter table public.assignments
  add column if not exists trial_id text references public.trials(id);

create index if not exists assignments_due_date_idx on public.assignments (due_date);

-- 1.4 classroom_announcements.title (nullable; body stays in `content`)
alter table public.classroom_announcements
  add column if not exists title text;


-- ──────────────────────────────────────────────────────────────────────
-- Section 2: NEW tables
-- ──────────────────────────────────────────────────────────────────────

-- 2.1 connections (friends)
create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('pending','accepted','declined','blocked')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  unique (requester_id, recipient_id),
  check (requester_id <> recipient_id)
);
create index if not exists connections_requester_status_idx on public.connections (requester_id, status);
create index if not exists connections_recipient_status_idx on public.connections (recipient_id, status);

-- 2.2 classroom_groups + classroom_group_members
create table if not exists public.classroom_groups (
  id uuid primary key default gen_random_uuid(),
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  name text not null,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
create index if not exists classroom_groups_classroom_idx on public.classroom_groups (classroom_id);

create table if not exists public.classroom_group_members (
  group_id uuid not null references public.classroom_groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  primary key (group_id, user_id)
);

-- 2.3 study_groups + study_group_members
create table if not exists public.study_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  join_code text not null unique,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  is_teacher_led boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists study_groups_creator_idx on public.study_groups (creator_id);
create index if not exists study_groups_join_code_idx on public.study_groups (join_code);

create table if not exists public.study_group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.study_groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('admin','member')),
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);
create index if not exists study_group_members_group_idx on public.study_group_members (group_id);
create index if not exists study_group_members_user_idx on public.study_group_members (user_id);

-- 2.4 assignment_targets
create table if not exists public.assignment_targets (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  target_type text not null check (target_type in ('group','user')),
  group_id uuid references public.classroom_groups(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  check (
    (target_type = 'group' and group_id is not null and user_id is null)
    or (target_type = 'user' and user_id is not null and group_id is null)
  )
);
create index if not exists assignment_targets_assignment_idx on public.assignment_targets (assignment_id);
create index if not exists assignment_targets_user_idx on public.assignment_targets (user_id);
create index if not exists assignment_targets_group_idx on public.assignment_targets (group_id);

-- 2.5 grades + grade_history
create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.assignment_submissions(id) on delete cascade,
  graded_by uuid references public.profiles(id),
  score numeric(5,2),
  max_score numeric(5,2) not null,
  feedback text,
  is_auto_graded boolean not null default false,
  was_overridden boolean not null default false,
  graded_at timestamptz not null default now()
);
create index if not exists grades_submission_idx on public.grades (submission_id);

create table if not exists public.grade_history (
  id uuid primary key default gen_random_uuid(),
  grade_id uuid not null references public.grades(id) on delete cascade,
  previous_score numeric(5,2),
  previous_feedback text,
  previous_graded_by uuid references public.profiles(id),
  changed_by uuid not null references public.profiles(id),
  changed_at timestamptz not null default now()
);
create index if not exists grade_history_grade_idx on public.grade_history (grade_id);

-- 2.6 peer_review_assignments + peer_reviews
create table if not exists public.peer_review_assignments (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.assignment_submissions(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('pending','completed')),
  assigned_at timestamptz not null default now(),
  unique (submission_id, reviewer_id)
);
create index if not exists peer_review_assignments_reviewer_idx on public.peer_review_assignments (reviewer_id, status);

create table if not exists public.peer_reviews (
  id uuid primary key default gen_random_uuid(),
  peer_review_assignment_id uuid not null unique references public.peer_review_assignments(id) on delete cascade,
  rating int check (rating between 1 and 5),
  feedback text not null,
  submitted_at timestamptz not null default now()
);

-- 2.7 book_recommendations
create table if not exists public.book_recommendations (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  book_id text not null references public.books(id) on delete cascade,
  message text,
  status text not null check (status in ('pending','accepted','rejected')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (sender_id <> recipient_id)
);
create index if not exists book_recommendations_recipient_status_idx
  on public.book_recommendations (recipient_id, status);
create index if not exists book_recommendations_sender_idx
  on public.book_recommendations (sender_id);

-- 2.8 library_entries (minimal — supports recommendation accept flow)
create table if not exists public.library_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id text not null references public.books(id) on delete cascade,
  recommended_by uuid references public.profiles(id) on delete set null,
  added_at timestamptz not null default now(),
  unique (user_id, book_id)
);
create index if not exists library_entries_user_idx on public.library_entries (user_id);
create index if not exists library_entries_book_idx on public.library_entries (book_id);


-- ──────────────────────────────────────────────────────────────────────
-- Section 3: Helper functions
-- ──────────────────────────────────────────────────────────────────────

create or replace function public.user_has_classroom_role(
  p_user_id uuid,
  p_classroom_id uuid,
  p_roles text[]
) returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.classroom_members
    where student_id = p_user_id
      and classroom_id = p_classroom_id
      and role = any(p_roles)
  );
$$;

create or replace function public.can_recommend_to(
  p_sender uuid,
  p_recipient uuid
) returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (
      select 1 from public.connections
      where status = 'accepted'
        and ((requester_id = p_sender and recipient_id = p_recipient)
          or (requester_id = p_recipient and recipient_id = p_sender))
    )
    or exists (
      select 1 from public.classroom_members cm1
      join public.classroom_members cm2 on cm1.classroom_id = cm2.classroom_id
      where cm1.student_id = p_sender and cm2.student_id = p_recipient
    )
    or exists (
      select 1 from public.study_group_members sg1
      join public.study_group_members sg2 on sg1.group_id = sg2.group_id
      where sg1.user_id = p_sender and sg2.user_id = p_recipient
    );
$$;


-- ──────────────────────────────────────────────────────────────────────
-- Section 4: Rewrite RLS on existing tables to honor the role model
-- ──────────────────────────────────────────────────────────────────────

-- 4.1 classrooms
drop policy if exists classrooms_teacher_all on public.classrooms;
drop policy if exists classrooms_member_select on public.classrooms;
drop policy if exists classrooms_join_code_select on public.classrooms;

-- Anyone with a membership row can read.
create policy classrooms_member_select on public.classrooms
  for select using (
    id in (
      select classroom_id from public.classroom_members
      where student_id = auth.uid()
    )
  );

-- The legacy teacher_id always matches the original creator; this lets
-- the creator read their classroom even before/without a member row.
create policy classrooms_teacher_id_select on public.classrooms
  for select using (teacher_id = auth.uid());

-- Owner/co_teacher full management of an existing classroom.
create policy classrooms_owner_coteacher_all on public.classrooms
  for all using (
    public.user_has_classroom_role(auth.uid(), id, array['owner','co_teacher'])
  ) with check (
    public.user_has_classroom_role(auth.uid(), id, array['owner','co_teacher'])
  );

-- Any authenticated user can create a classroom; teacher_id must be self.
-- (The membership 'owner' row is created by the server action in the
-- same transaction.)
create policy classrooms_create on public.classrooms
  for insert with check (teacher_id = auth.uid());

-- Only the owner can delete.
create policy classrooms_owner_delete on public.classrooms
  for delete using (
    public.user_has_classroom_role(auth.uid(), id, array['owner'])
  );

-- 4.2 classroom_members
drop policy if exists members_student_select on public.classroom_members;
drop policy if exists members_student_join on public.classroom_members;
drop policy if exists members_student_leave on public.classroom_members;
drop policy if exists members_teacher_all on public.classroom_members;

create policy members_select on public.classroom_members
  for select using (
    student_id = auth.uid()
    or classroom_id in (
      select classroom_id from public.classroom_members
      where student_id = auth.uid()
    )
  );

create policy members_self_join on public.classroom_members
  for insert with check (
    student_id = auth.uid() and role = 'student'
  );

create policy members_owner_coteacher_insert on public.classroom_members
  for insert with check (
    public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher'])
  );

create policy members_self_leave on public.classroom_members
  for delete using (student_id = auth.uid());

create policy members_owner_remove on public.classroom_members
  for delete using (
    public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher'])
  );

-- Owner/co_teacher can change roles; co_teacher cannot promote to owner.
create policy members_owner_coteacher_update on public.classroom_members
  for update using (
    public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher'])
  ) with check (
    role <> 'owner'
    or public.user_has_classroom_role(auth.uid(), classroom_id, array['owner'])
  );

-- 4.3 assignments
drop policy if exists assignments_teacher_all on public.assignments;
drop policy if exists assignments_student_select on public.assignments;

create policy assignments_member_select on public.assignments
  for select using (
    classroom_id in (
      select classroom_id from public.classroom_members
      where student_id = auth.uid()
    )
  );

-- TA cannot create assignments; only owner/co_teacher.
create policy assignments_owner_coteacher_insert on public.assignments
  for insert with check (
    public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher'])
    and teacher_id = auth.uid()
  );

create policy assignments_owner_coteacher_update on public.assignments
  for update using (
    public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher'])
    or teacher_id = auth.uid()
  );

create policy assignments_owner_coteacher_delete on public.assignments
  for delete using (
    public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher'])
  );

-- 4.4 assignment_submissions
drop policy if exists submissions_student_all on public.assignment_submissions;
drop policy if exists submissions_teacher_select on public.assignment_submissions;
drop policy if exists submissions_teacher_update on public.assignment_submissions;

create policy submissions_student_select on public.assignment_submissions
  for select using (student_id = auth.uid());

create policy submissions_student_insert on public.assignment_submissions
  for insert with check (student_id = auth.uid());

create policy submissions_student_update on public.assignment_submissions
  for update using (student_id = auth.uid());

create policy submissions_staff_select on public.assignment_submissions
  for select using (
    assignment_id in (
      select a.id from public.assignments a
      where public.user_has_classroom_role(auth.uid(), a.classroom_id, array['owner','co_teacher','ta'])
    )
  );

create policy submissions_staff_update on public.assignment_submissions
  for update using (
    assignment_id in (
      select a.id from public.assignments a
      where public.user_has_classroom_role(auth.uid(), a.classroom_id, array['owner','co_teacher','ta'])
    )
  );

-- 4.5 classroom_announcements
drop policy if exists announcements_student_select on public.classroom_announcements;
drop policy if exists announcements_teacher_all on public.classroom_announcements;

create policy announcements_member_select on public.classroom_announcements
  for select using (
    classroom_id in (
      select classroom_id from public.classroom_members
      where student_id = auth.uid()
    )
  );

create policy announcements_owner_coteacher_insert on public.classroom_announcements
  for insert with check (
    public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher'])
    and teacher_id = auth.uid()
  );

create policy announcements_author_or_owner_update on public.classroom_announcements
  for update using (
    teacher_id = auth.uid()
    or public.user_has_classroom_role(auth.uid(), classroom_id, array['owner'])
  );

create policy announcements_author_or_owner_delete on public.classroom_announcements
  for delete using (
    teacher_id = auth.uid()
    or public.user_has_classroom_role(auth.uid(), classroom_id, array['owner'])
  );


-- ──────────────────────────────────────────────────────────────────────
-- Section 5: RLS for new tables
-- ──────────────────────────────────────────────────────────────────────

alter table public.connections enable row level security;
alter table public.classroom_groups enable row level security;
alter table public.classroom_group_members enable row level security;
alter table public.study_groups enable row level security;
alter table public.study_group_members enable row level security;
alter table public.assignment_targets enable row level security;
alter table public.grades enable row level security;
alter table public.grade_history enable row level security;
alter table public.peer_review_assignments enable row level security;
alter table public.peer_reviews enable row level security;
alter table public.book_recommendations enable row level security;
alter table public.library_entries enable row level security;

-- 5.1 connections
create policy connections_self_select on public.connections
  for select using (requester_id = auth.uid() or recipient_id = auth.uid());

create policy connections_self_request on public.connections
  for insert with check (
    requester_id = auth.uid() and status = 'pending'
  );

create policy connections_recipient_respond on public.connections
  for update using (recipient_id = auth.uid());

create policy connections_self_delete on public.connections
  for delete using (requester_id = auth.uid() or recipient_id = auth.uid());

-- 5.2 classroom_groups
create policy classroom_groups_member_select on public.classroom_groups
  for select using (
    classroom_id in (
      select classroom_id from public.classroom_members
      where student_id = auth.uid()
    )
  );

create policy classroom_groups_staff_all on public.classroom_groups
  for all using (
    public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher','ta'])
  ) with check (
    public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher','ta'])
  );

create policy classroom_group_members_select on public.classroom_group_members
  for select using (
    group_id in (
      select id from public.classroom_groups
      where classroom_id in (
        select classroom_id from public.classroom_members
        where student_id = auth.uid()
      )
    )
  );

create policy classroom_group_members_staff_all on public.classroom_group_members
  for all using (
    group_id in (
      select g.id from public.classroom_groups g
      where public.user_has_classroom_role(auth.uid(), g.classroom_id, array['owner','co_teacher','ta'])
    )
  ) with check (
    group_id in (
      select g.id from public.classroom_groups g
      where public.user_has_classroom_role(auth.uid(), g.classroom_id, array['owner','co_teacher','ta'])
    )
  );

-- 5.3 study_groups
create policy study_groups_member_select on public.study_groups
  for select using (
    id in (select group_id from public.study_group_members where user_id = auth.uid())
  );

create policy study_groups_creator_select on public.study_groups
  for select using (creator_id = auth.uid());

create policy study_groups_create on public.study_groups
  for insert with check (creator_id = auth.uid());

create policy study_groups_admin_update on public.study_groups
  for update using (
    id in (
      select group_id from public.study_group_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy study_groups_creator_delete on public.study_groups
  for delete using (creator_id = auth.uid());

create policy study_group_members_select on public.study_group_members
  for select using (
    group_id in (
      select group_id from public.study_group_members where user_id = auth.uid()
    )
  );

create policy study_group_members_self_join on public.study_group_members
  for insert with check (user_id = auth.uid() and role = 'member');

create policy study_group_members_admin_insert on public.study_group_members
  for insert with check (
    group_id in (
      select group_id from public.study_group_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy study_group_members_self_leave on public.study_group_members
  for delete using (user_id = auth.uid());

create policy study_group_members_admin_remove on public.study_group_members
  for delete using (
    group_id in (
      select group_id from public.study_group_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- 5.4 assignment_targets
create policy assignment_targets_member_select on public.assignment_targets
  for select using (
    assignment_id in (
      select a.id from public.assignments a
      where a.classroom_id in (
        select classroom_id from public.classroom_members
        where student_id = auth.uid()
      )
    )
  );

create policy assignment_targets_staff_all on public.assignment_targets
  for all using (
    assignment_id in (
      select a.id from public.assignments a
      where public.user_has_classroom_role(auth.uid(), a.classroom_id, array['owner','co_teacher'])
    )
  ) with check (
    assignment_id in (
      select a.id from public.assignments a
      where public.user_has_classroom_role(auth.uid(), a.classroom_id, array['owner','co_teacher'])
    )
  );

-- 5.5 grades + grade_history (no DELETE — audit trail)
create policy grades_student_select on public.grades
  for select using (
    submission_id in (
      select id from public.assignment_submissions where student_id = auth.uid()
    )
  );

create policy grades_staff_select on public.grades
  for select using (
    submission_id in (
      select s.id from public.assignment_submissions s
      join public.assignments a on a.id = s.assignment_id
      where public.user_has_classroom_role(auth.uid(), a.classroom_id, array['owner','co_teacher','ta'])
    )
  );

create policy grades_staff_insert on public.grades
  for insert with check (
    submission_id in (
      select s.id from public.assignment_submissions s
      join public.assignments a on a.id = s.assignment_id
      where public.user_has_classroom_role(auth.uid(), a.classroom_id, array['owner','co_teacher','ta'])
    )
  );

create policy grades_staff_update on public.grades
  for update using (
    submission_id in (
      select s.id from public.assignment_submissions s
      join public.assignments a on a.id = s.assignment_id
      where public.user_has_classroom_role(auth.uid(), a.classroom_id, array['owner','co_teacher','ta'])
    )
  );

create policy grade_history_staff_select on public.grade_history
  for select using (
    grade_id in (
      select g.id from public.grades g
      join public.assignment_submissions s on s.id = g.submission_id
      join public.assignments a on a.id = s.assignment_id
      where public.user_has_classroom_role(auth.uid(), a.classroom_id, array['owner','co_teacher','ta'])
    )
  );

create policy grade_history_staff_insert on public.grade_history
  for insert with check (
    grade_id in (
      select g.id from public.grades g
      join public.assignment_submissions s on s.id = g.submission_id
      join public.assignments a on a.id = s.assignment_id
      where public.user_has_classroom_role(auth.uid(), a.classroom_id, array['owner','co_teacher','ta'])
    )
    and changed_by = auth.uid()
  );

-- 5.6 peer_review_assignments
create policy peer_review_assignments_visible on public.peer_review_assignments
  for select using (
    reviewer_id = auth.uid()
    or submission_id in (
      select id from public.assignment_submissions where student_id = auth.uid()
    )
    or submission_id in (
      select s.id from public.assignment_submissions s
      join public.assignments a on a.id = s.assignment_id
      where public.user_has_classroom_role(auth.uid(), a.classroom_id, array['owner','co_teacher','ta'])
    )
  );

create policy peer_review_assignments_staff_insert on public.peer_review_assignments
  for insert with check (
    submission_id in (
      select s.id from public.assignment_submissions s
      join public.assignments a on a.id = s.assignment_id
      where public.user_has_classroom_role(auth.uid(), a.classroom_id, array['owner','co_teacher'])
    )
  );

create policy peer_review_assignments_reviewer_update on public.peer_review_assignments
  for update using (reviewer_id = auth.uid());

-- 5.7 peer_reviews
create policy peer_reviews_visible on public.peer_reviews
  for select using (
    peer_review_assignment_id in (
      select id from public.peer_review_assignments where reviewer_id = auth.uid()
    )
    or peer_review_assignment_id in (
      select pra.id from public.peer_review_assignments pra
      join public.assignment_submissions s on s.id = pra.submission_id
      where s.student_id = auth.uid()
    )
    or peer_review_assignment_id in (
      select pra.id from public.peer_review_assignments pra
      join public.assignment_submissions s on s.id = pra.submission_id
      join public.assignments a on a.id = s.assignment_id
      where public.user_has_classroom_role(auth.uid(), a.classroom_id, array['owner','co_teacher','ta'])
    )
  );

create policy peer_reviews_reviewer_insert on public.peer_reviews
  for insert with check (
    peer_review_assignment_id in (
      select id from public.peer_review_assignments
      where reviewer_id = auth.uid() and status = 'pending'
    )
  );

-- 5.8 book_recommendations
create policy book_recommendations_self_select on public.book_recommendations
  for select using (sender_id = auth.uid() or recipient_id = auth.uid());

-- Sender can only insert if they have a relationship with the recipient.
create policy book_recommendations_send on public.book_recommendations
  for insert with check (
    sender_id = auth.uid()
    and status = 'pending'
    and public.can_recommend_to(sender_id, recipient_id)
  );

create policy book_recommendations_recipient_respond on public.book_recommendations
  for update using (recipient_id = auth.uid());

-- 5.9 library_entries
create policy library_entries_self_all on public.library_entries
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Friends can read each other's library entries (for shared activity).
create policy library_entries_friend_select on public.library_entries
  for select using (
    exists (
      select 1 from public.connections
      where status = 'accepted'
        and ((requester_id = auth.uid() and recipient_id = library_entries.user_id)
          or (recipient_id = auth.uid() and requester_id = library_entries.user_id))
    )
  );

commit;
