@AGENTS.md

## Stoa Gallery Invariant

The Stoa (painting gallery) enforces a strict 1:1 painting-to-book relationship:

- Every painting in `src/data/stoa-collection.ts` has a required `unlockingBookId`
- No two paintings share the same book; no book has more than one painting
- Run `pnpm audit:stoa` to validate — this runs in CI and will fail the build
- When adding a new book, add its paired painting at the same time
- See `src/components/stoa/README.md` for the four-tier curation hierarchy and sourcing rules

## TOME TODAY — verified 2026-07-02

SUPABASE PROJECT: vjaezrcuuzmbmnsfrtwt
DEPLOYMENT: tome-revision.vercel.app

TEST COHORT (password for all: TomeTest!2026):
- matthew (existing account) — teacher, owns "Checkpoint English 9", classroom id 6544bc85-a045-4af4-b8cc-b1803608e4cb, profile id bd103f53-5b8b-4b0e-b076-cdc9c49752f2
- hypatia.teacher@tome.test — teacher, owns "Rhetoric & Poetics 10", join code RHET10
- alcuin.teacher@tome.test — teacher, no classrooms (isolation persona)
- Students: beatrice.student@tome.test (BOTH classes), homer/sappho/ovid @tome.test (English 9),
  penelope/tel @tome.test (Rhetoric 10)
FIXTURES LIVE: pinned announcement + reading assignment (the-odyssey, ch 1–3, active, classroom scope)
in English 9; essay assignment "On Achilles' Rage" (the-iliad, 300–800 words) + announcement in Rhetoric 10.

VERIFIED SCHEMA FACTS (do not re-derive):
- profiles.role IN (reader, teacher, student). classroom_members.role IN (owner, co_teacher, ta, student);
  the member column is student_id for ALL roles.
- assignments.type IN (reading, quiz, discussion, essay, annotation, chapter_read, trial);
  status IN (draft, active, closed); scope IN (classroom, group, individuals).
  assignment_targets rows exist ONLY for scope group/user.
- notifications type enum includes 'message'. Realtime publication includes: messages, notifications,
  reading_progress, classroom_announcements, assignment_submissions.
- virgil_session_messages.role enum uses 'virgil' (NOT 'assistant').
- teacher_quiz tables use lowercase difficulty; platform quizzes use Apprentice|Sonnet-case Scholar|Master.
- virgil_usage is SELECT-only for clients — increment ONLY through the existing RPC (find exact name
  in supabase/migrations; do not write direct inserts).
- study_groups / study_group_members are DROPPED. Social tables are groups, group_members, group_posts,
  group_goals, group_notes, group_invites, group_schedule. Sweep any lingering imports/queries.
- demo_requests: INSERT allowed for anon+authenticated; SELECT locked (service role only).
- Book coverage: NEVER trust ingestion_status; use JOIN on chapters row counts.
- Quiz data: 36 chapter-level quizzes, 297 book-level (chapter_index null), 99 books covered.

BILLING MODEL (settled — do not relitigate):
- Stripe SANDBOX. Solo = prod_UnOyR0U75npmXt ($9 mo / $90 yr, role stays reader).
- Family = prod_UnOy09CqGKXxB4 ($18 mo / $150 yr, buyer's profiles.role → teacher).
- School = per-teacher-seat, $120/yr PROVISIONAL, metadata.tier=school, seats grant teacher role
  via school_seats invites. Billing writes profiles.role; the Virgil gate READS it. No separate flag.
- Idempotency: insert event id into stripe_events first; skip if exists.

VIRGIL (teacher-only, settled):
- Single dispatcher POST /api/virgil. 403 for any non-teacher BEFORE task dispatch.
- Tasks→models: announcement_draft→Haiku 4.5; teacher_quiz, semester_plan, assignment_draft,
  student_note, class_insights→Sonnet 4.6; grade_response→Opus 4.8.
- Iridescence in the UI is reserved EXCLUSIVELY for Virgil surfaces.

RUBRIC DESIGN SYSTEM: Fraunces (display), Literata (body), Switzer (UI).
Palette: lapis, vermilion, gold, tyrian, verdigris. No new fonts, no new accents.

LIVEBLOCKS: auth at /api/liveblocks-auth; rooms 'classroom:{classroomId}' (roster presence) and
'reader:{bookId}:{classroomId}' (reading presence). Gate room grants with the existing
user_has_classroom_role(uid, classroom_id, roles[]) helper — reuse, don't reinvent.

## SHIP LEDGER — Phase 2 (2026-07-05, branch ship/phase-1-testable)
Audit concluded the classroom money-loop is functional end-to-end; the three zeros are because
the real UI has never been run, NOT broken wiring. ZERO DDL — Phase 2 needs no migration.
Wired the three code-only gaps found in the audit:
- rotateJoinCode (src/lib/actions/classrooms.ts) — staff-gated via user_has_classroom_role
  (owner|co_teacher), collision-retry, updates classrooms.join_code. UI = RefreshCw button in
  classroom/[id]/manage header beside the code chip.
- late-joiner backfill (backfillActiveAssignments in classrooms.ts) — joinClassroomByCode now
  seeds not_started assignment_submissions for already-active classroom-scoped assignments
  (idempotent upsert on assignment_id,student_id), so a student who joins after publish appears
  on the teacher roster. group/individual scopes intentionally excluded (fixed target set).
- duplicateTeacherQuiz (src/lib/actions/teacher-quizzes.ts) — owner-gated, copies quiz + all
  questions as a fresh draft ("<title> (copy)"). UI = Copy button per row in quiz-builder list.
VERIFY: tsc clean (only known registry.test.ts / stale library/page noise). STOA AUDIT fails in
strict mode BUT this is PRE-EXISTING branch state — commit 822dc1a7 (surface sweep) removed
src/data/stoa-collection.ts, so audit runs manifest-only w/ 294 orphan-painting warnings, 0
errors. Unrelated to these changes (none touch stoa data). NOT committed, NOT merged, no migration.

## SHIP LEDGER — Phase 1 SHIPPED TO PRODUCTION (2026-07-05)
ship/phase-1-testable fast-forward-merged into main (main was AT the merge-base 3ca6c8f6, so ship
was a strict descendant → clean --ff-only, no conflicts). main now 22a1579e; prod deploy
dpl_EcFmxsMUSAVbXaKd7UcYuZw7tU3S (target production) triggered. NO prebuild hook in package.json on
this branch — the strict stoa audit does NOT gate the Vercel build (build = plain `next build`), and
the same tree already built READY as preview dpl_JCKY.../dpl_32BN. Merge done via isolated
`git worktree add /tmp/tome-prod main` (removed after push); the primary working tree was never
checked out off ship. This is the surface-restoration + classroom-money-loop line: ~204 files vs the
prior main, +5961/-36039 (the sweep removed the vanity/social surfaces).

MIGRATIONS APPLIED TO LIVE DB vjaezrcuuzmbmnsfrtwt (all additive; verified present post-apply):
- trial_result_authority — record_trial_result(text,int,text,int,int) SECURITY DEFINER is now the
  SOLE quiz_results write path; INSERT revoked from authenticated+anon; server computes wisdom
  (tier rate × correct) so the client can't mint Wisdom/poison leaderboards. Was ALREADY applied
  earlier (20260702165027); my re-apply was idempotent (create-or-replace + drop-if-exists). Code
  path already routes through the RPC (api/progress/quiz/route.ts); practice.ts + both crons only
  SELECT quiz_results; seeds use service-role → revoke breaks nothing.
- message_notifications — on_message_notify AFTER INSERT trigger on public.messages fans an in-app
  'message' notification to every other conversation participant via create_notification. Also
  idempotent re-apply (earlier 20260702170809).
- virgil_loop_linkage_and_student_codes — assignments.quiz_id FK → teacher_quizzes ON DELETE SET
  NULL (all rows null, safe); NEW student_access_codes (COPPA code-login, RLS via
  user_has_classroom_role owner|co_teacher + student-reads-own) + login_attempts (deny-all rate
  ledger). student_access_codes did NOT exist before; created fresh.
The three 20260717 files on the branch (personal_reading_data_model, student_activity_lectern,
virgil_secure_hardening) were ALREADY applied earlier as 20260704 timestamps → nothing missing.
ALL ship-branch migration files map to an applied DB migration by base name. DB fully migrated.
