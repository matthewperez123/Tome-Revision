# Walkthrough Environment — Schema & Flow Audit (Phase 0)

Verified against the live Supabase project **`vjaezrcuuzmbmnsfrtwt`** ("tome-app")
on 2026-07-04. Everything below was read from the codebase and confirmed by
querying the live DB — nothing here is assumed.

## Verdict: the teacher ↔ student loop is fully wired. No blocker. Proceed.

---

## 1. Where roles live

- `public.profiles.role` — the single source of truth. Live CHECK:
  `role IN ('reader','teacher','student')`. **`student` is a real role** (not just
  a forward-compat hook — the constraint allows it).
- Role is **not** inferred from route or `user_metadata`; the app reads
  `profiles.role`. The seed sets it directly via the service role.
- `useAuth()` (client) sources role from the DB profile. Virgil, reading access,
  and educator tools all branch on it.

## 2. Classroom / enrollment / assignment / quiz / gradebook tables

| Concern | Table / mechanism |
|---|---|
| Classroom | `classrooms` (`teacher_id`, `name`, `subject`, `grade_level`, `join_code`, `max_students`, `archived`) |
| Membership | `classroom_members` (`classroom_id`, `student_id`, `role`) — **the member column is `student_id` for EVERY role** incl. owner. `role IN ('owner','co_teacher','ta','student')` |
| Assignment | `assignments` (`classroom_id`, `teacher_id`, `type`, `title`, `book_id`, `chapter_range_start/_end`, `trial_id`, `essay_prompt`, `points_available`, `scope`, `status`, `due_date`, …). `type IN ('reading','quiz','discussion','essay','annotation','chapter_read','trial')`; `status IN ('draft','active','closed')`; `scope IN ('classroom','group','individuals')` |
| Per-student roster | `assignment_submissions` (`assignment_id`, `student_id`, `status`, `response_text`, `word_count`, `score`, `feedback`, `submitted_at`, `graded_at`, `graded_by`) |
| Manual grades | `grades` (canonical, UNIQUE `submission_id`) + `grade_history` (audit) |
| Reader trial attempts | `quiz_results` (`user_id`, `book_id`, `chapter_index`, `difficulty`, `score`, `total_questions`, `wisdom_earned`, `passed`) |
| Live gradebook | RPC `classroom_gradebook(p_classroom uuid)` — **derives** completion/score, does not store a parallel grade |
| Role gate helper | RPC `user_has_classroom_role(uid, classroom_id, roles[])` |

RLS is deny-by-default and staff-scoped; the seed uses the **service-role** admin
client, which bypasses RLS, so seeding is unaffected by policy.

### How a "quiz" assignment actually works (important)

There are two quiz-shaped paths in the UI:

- **`type='trial'`** — the reader/platform Trial. The student launches it from the
  assignment page (`/read/{bookId}?ch=N&trial=1&classroom={cid}`), takes the Trial,
  and the attempt lands in `quiz_results`. **This is the path the teacher composer
  can actually create** (its type enum is reading / trial / annotation / discussion /
  essay / chapter_read — there is no "quiz" option in `createAssignment`).
- `type='quiz'` + `quiz_id` — a teacher-authored quiz at
  `/classroom/{cid}/quiz/{quiz_id}`. The DB allows the type, but the assignment
  composer does not expose it, so it is not part of the standard teacher flow.

**The walkthrough uses a `trial` assignment** (The Odyssey, Books I–III, Scholar).

### How the gradebook derives a trial score (`classroom_gradebook`)

For a `trial`/`quiz` assignment a student's row is `completed` when there exists a
`quiz_results` row with the same `book_id`, `passed = true`, and
`chapter_index` within `[chapter_range_start, chapter_range_end]`. The displayed
score is `max(quiz_results.score)`; `max_score` is `points_available`. Manual
`grades` always win when present. Reading assignments derive from
`reading_progress` instead.

### `?ch=N` is 0-based

The reader's `?ch=N` maps 1:1 to `chapter_index` (Book I = index **0**). The
walkthrough assignment therefore uses `chapter_range_start=0, chapter_range_end=2`
(Books I–III) and alpha's seeded attempt uses `chapter_index=0`.

### Trial write path is server-authoritative

`quiz_results` **direct client INSERT is revoked**. The only client write path is
the SECURITY DEFINER RPC `record_trial_result(book, chapter, difficulty, correct,
total)`, which stores `score` as a **percent (0–100)**, sets `passed = score >= 60`,
and computes Wisdom server-side. The seed writes `quiz_results` via the service
role (bypasses the revoke) and uses percent scores to match live semantics.

## 3. Student join flow (confirmed, COPPA-safe)

- Teacher shares the classroom's **6-char join code** (`classrooms.join_code`;
  charset `ABCDEFGHJKMNPQRSTUVWXYZ23456789`, no ambiguous 0/O/I/1/l — see
  `isValidJoinCode`).
- Student enters it at **`/classroom/join`** (or a link `/join?code=CODE`).
  `joinClassroomByCode()` (server action) looks the room up via the admin client
  (so a prospective student can preview by code without membership), enforces the
  capacity cap, and inserts the `classroom_members` row with `role='student'`.
  Idempotent — re-joining just returns the room.
- Email invites (`inviteToClassroom`) only send the join link; **no member row / no
  student PII is created from an invite** — students self-join. So leaving **gamma
  unenrolled** is the correct way to test the live join flow.

## 4. Entitlements (how to bypass checkout for test accounts)

- Single source: `public.subscriptions` (`user_id`, `tier`, `status`, `seats`,
  `current_period_end`). Read server-side via `getEntitlement()` (service role).
- `active`/`trialing` confer a paid tier; anything else → Free.
- **Comp mechanism = insert an active `subscriptions` row. No Stripe needed.**
  - Teacher → `tier='school', status='active', seats>=1` → unlocks
    `teacherTools` (create assignments, gradebook, AI quiz gen, semester planner).
    `createAssignment` is gated by `hasActiveSchoolEntitlement()`.
  - Students → `tier='solo', status='active'` → `fullLibrary` + `advancedTrials`
    (Scholar/Master Trials) + unlimited Virgil-cap (moot, Virgil is teacher-only).
- **Note:** `canUserReadBook()` already returns `true` for any `teacher` or
  `student` role regardless of subscription (classroom context), so students never
  hit a *book* paywall. The Solo comp is only needed to unlock **Scholar-tier
  Trials** (advancedTrials) so beta's walkthrough Trial isn't 402'd.

## 5. Virgil is teacher-only (role boundary to test)

- Single dispatcher `POST /api/virgil`. It reads `profiles.role` and returns
  **403 `{"error":"Virgil is available to teachers only."}`** for any non-teacher
  *before* dispatch (`src/app/api/virgil/route.ts` ~line 103). Students are blocked
  server-side; the student UI also hides Virgil surfaces.

## 6. Consumer app (Tome-Consumer)

- Per project memory + CLAUDE.md: the **`consumer`** branch deploys to a **separate
  Vercel project (`tome-consumer`)** that shares the **same production Supabase DB
  and Stripe**. It forbids migrations/SQL/new Stripe. So the seeded accounts and
  classroom are visible from the consumer app too (same DB), and its solo reading
  experience can be smoke-tested with the same credentials.
- Primary app = **`tome-revision`** Vercel project (`prj_TyI3YzZDBMQFU97PbxyHmVTFxtBS`),
  prod alias `tome-revision.vercel.app`. Deploys are **git-integration only** (push a
  branch → preview deploy; push `main` → prod). Preview URLs are behind Vercel
  Deployment Protection (HTTP 401 until you use the project's bypass), but the build
  succeeding = `readyState: READY`.

## 7. Live DB facts confirmed this session (SQL)

- `profiles_role_check` = `reader|teacher|student` ✓
- RPCs present: `classroom_gradebook`, `record_trial_result`,
  `user_has_classroom_role`, `consume_virgil_message` ✓ (trial-authority migration
  IS applied)
- `assignments_type_check` includes `trial` ✓
- `classroom_members_role_check` = `owner|co_teacher|ta|student` ✓
- `subscriptions` columns = user_id, stripe_customer_id, stripe_subscription_id,
  tier, status, current_period_end, cancel_at_period_end, updated_at, seats ✓
- `the-odyssey` has 30 chapter rows ✓
- Zero pre-existing `@walkthrough.tome.test` users ✓ (clean slate for the seed)

## 8. Test-account design (Phase 1)

Domain **`@walkthrough.tome.test`** (RFC-valid; `.test` is reserved and proven in
this project's existing `@tome.test` cohort). Admin `createUser` with
`email_confirm: true` bypasses app signup validation entirely, so no verification
email and immediate login. Shared password **`TomeTest2026!`**. Every account is
tagged `user_metadata.seed = 'walkthrough'` AND lives on the dedicated domain, so
teardown can target them exactly.

| Account | Role | Comp | Enrolled | Seeded state |
|---|---|---|---|---|
| teacher.test@walkthrough.tome.test | teacher | school (active) | owns class | — |
| student.alpha@walkthrough.tome.test | student | solo (active) | yes | Trial **completed**, score 90 |
| student.beta@walkthrough.tome.test | student | solo (active) | yes | Trial **not started** |
| student.gamma@walkthrough.tome.test | student | solo (active) | **NO** (join live) | — |
| billing.test@walkthrough.tome.test | reader | **none (free)** | no | for Stripe checkout test |

Classroom: **"Third Period — Great Books"**, owner teacher.test, join code printed
by the seed. Assignment: **trial**, The Odyssey Books I–III, Scholar, active, due +7d.
