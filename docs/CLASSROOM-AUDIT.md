# Classroom Live Loop — Phase 0 Census & Probe

Branch `today/classroom-live-loop` (== origin/main, a681f033). Live DB `vjaezrcuuzmbmnsfrtwt`.
Read-only census + persona probes. No code or DB changed in Phase 0.

Legend: PASS = works end-to-end in code (DB verified where noted). PARTIAL = wired but a leg is
missing/unverified. FAIL = does not work / not built.

---

## 1. Correspondence — PASS/FAIL matrix (both directions)

| Channel | Dir | Send path | Receive/display | Realtime topic | Unread | Verdict |
|---|---|---|---|---|---|---|
| **Announcements** | T→S | `createAnnouncement` → `classroom_announcements` + `notify('group_post')` (`src/lib/actions/announcements.ts`) | `student-classroom-view.tsx` fetch (pinned desc), teacher list in `classroom/[id]/page.tsx` | `class-announcements:{cid}` on `classroom_announcements` | none (no per-student read) | **PASS** (verify live in P1) |
| **Assignment published** | T→S | `publishAssignment` → seeds submissions + `notify('class_assignment')` (`assignments.ts`) | notification bell + Assignments tab | `notifications` realtime | `read_at` ✓ | **PASS** |
| **Grade + feedback** | T→S | `gradeSubmission({score,feedback})` → `grades` + mirror to `assignment_submissions` + `notify('assignment_graded')` (`grades.ts`) | student "My Progress" renders score + feedback text | `my-grades:{cid}:{uid}` on `assignment_submissions` | notif read | **PASS** (verify no-refresh live in P2) |
| **Notification bell** | both | `notify()` helper (`_shared.ts`) service-role insert → `notifications` | `notification-bell.tsx` + `use-realtime-notifications.ts` | `notifications:{uid}:{useId()}` — **per-instance topic survives** (dodges supabase-js channel dedupe) | `read_at` ✓ | **PASS** — but `'message'` type not in TS `NotificationType` enum + no icon/color in bell → renders fallback Bell (cosmetic gap) |
| **Direct messages (DM)** | T↔S both | `start_conversation` RPC + `messages` insert; `on_message_notify` trigger fans `notify('message')` to other participants — **all DB verified present** | **NO UI** — no `/messages` route, no conversation list, no thread view, no composer, no client hook | `conversations`+`messages` in realtime publication (unused) | `conversation_participants.last_read_at` (unused) | **FAIL** — infra complete, zero UI. This is the primary Phase 1 build. |

### Notification infra (shared) — healthy
- `notification_type` enum (live DB) = friend_request, friend_accepted, group_invite, group_post,
  class_assignment, assignment_graded, parent_link_request, session_summary, peer_review,
  book_recommendation, system, **message**. So DB knows `'message'`; TS enum + bell mapping do not.
- Realtime publication (live) includes: conversations, messages, notifications,
  classroom_announcements, assignment_submissions, highlights, guided_session_participants,
  guided_session_events, student_activity. **`grades` is NOT published** → student grade view
  must (and does) subscribe to the `assignment_submissions` mirror.

---

## 2. Grades — visibility probe (persona data, live DB)

- **Teacher gradebook** reads `classroom_gradebook(p_classroom)` RPC (staff-gated via
  `user_has_classroom_role`), which coalesces `grades` (precedence) → `quiz_results` → `reading_progress`.
- **Student view** ("My Progress" in `student-classroom-view.tsx`) reads `grades` directly, RLS-scoped
  to own submissions, and refetches on `assignment_submissions` realtime.
- **`grade_history`** is written on override but is audit-only — never read as a display source. ✓
- Probe (classroom `6934e84e` "Rhetoric & Poetics 10" / Hypatia Reyes, essay "Close Reading — The Iliad"):
  real `grades` rows present with numeric scores AND feedback text (e.g. Homer 86 "Good instincts…",
  Sappho 93 "You see the central tension clearly…"); `assignment_submissions` cache mirrors the score;
  `was_overridden` correctly true on the reading override (Beatrice 45).

**Verdict: PASS on both sides at the data + read-path level.** Remaining to prove live in P2:
new grade appears student-side with no hard refresh (realtime on the mirror).

---

## 3. Liveblocks reality check

- SDK **installed**: `@liveblocks/{client,node,react,react-ui}` ^3.20.0 (package.json).
- Auth endpoint `src/app/api/liveblocks-auth/route.ts` **exists**, lazy-inits the client, **501s when
  key absent**. Handles rooms: `book:{id}`, `classroom:{cid}:book:{bid}` (gated
  `user_is_classroom_member` + `classrooms.live_presence_enabled`), legacy `reader:{id}`, and
  guided `gs:{sid}:{bid}:{ch}[:{studentId}]` (gated `authorizeGuidedRoom`). Role derived server-side.
- `src/liveblocks.config.ts`: Presence `{chapterIndex, cursor?, selection?}`, UserMeta
  `{id, info:{name, avatar?, role?}}`, ThreadMetadata W3C anchor + `endorsed/teacherNote/virgil`.
- Components survived the sweep and are imported: `reader/reader-presence.tsx`
  (`read/[bookId]/page.tsx`), `guided-learning/annotations/annotation-layer.tsx` (`locked-reader.tsx`),
  `teacher-annotation-review.tsx` (`session-monitor-dashboard.tsx`).
- **Env**: `LIVEBLOCKS_SECRET_KEY` **is set in `.env.local`** (no public key needed — auth-endpoint
  pattern). **NOT a Phase 0 blocker.** ⚠️ Per prior notes it is **NOT set on Vercel**, so the auth
  route 501s in prod until added — human action needed before the consumer/prod picks this up.

**Human checklist for prod (not blocking local build):** add `LIVEBLOCKS_SECRET_KEY` to Vercel env
(Production + Preview) for both `tome-revision` and `tome-consumer` projects.

---

## 4. Live reader annotations — durability

- **Durable store exists**: `highlights` table (own + `shared`+`classroom_id`), full CRUD in
  `highlights.ts`, rendered by `reader/reader-highlights.tsx`, realtime `highlights:classroom:{cid}`,
  `highlights` in the realtime publication, replica identity full (unshare event delivery). This is the
  natural backbone for Phase 4 durable collaborative annotations.
- **Guided-session margin annotations (Liveblocks Comments)** are **ephemeral / Liveblocks-only** — no
  `session_annotations`/DB mirror exists (the PR3 "webhook→DB mirror" was never built). If Phase 4
  durability is required on the guided reader, either (a) reuse `highlights` as the source of truth, or
  (b) add a mirror. Recommendation: reuse `highlights` (no migration).

---

## 5. Live-quiz feasibility

- **No live-quiz layer exists** (`live_*` tables = none; no "kahoot"/"live_quiz" code).
- Saved quizzes **are iterable**: `teacher_quiz_questions` has `sort_order`, `options` (jsonb),
  `correct_answer`, `question_type`, `hints`, `distractor_eliminations` — reveal one-by-one is trivial.
- `getQuizForAttempt` already strips answer keys server-side (safe for student device).
- Authoritative results path exists for **async** quizzes (`submitQuizAttempt` →
  `teacher_quiz_responses` + `teacher_quiz_results` + `assignment_submissions` mirror). Trial results
  go through `record_trial_result` RPC (SECURITY DEFINER); direct `quiz_results` INSERT is **revoked**
  (grantees = postgres, service_role only — verified live).
- `guided_sessions` exists but `type` check = only `('chapter','trial')` and its quiz-station student
  runner is a stub — heavy to retrofit Kahoot mode onto. **Cleaner: a dedicated lightweight live-quiz
  layer** (the one migration), persisting to the existing results tables at session end.

---

## 6. THE ONE MIGRATION — draft (NOT applied; awaiting go)

Additive-only. Every classroom-scoped policy uses `user_has_classroom_role()`.

```sql
-- 20260706000000_classroom_live_quiz.sql
-- Kahoot-style live quiz layered on saved teacher_quizzes. Additive only.

-- (1) One row per running live session
create table if not exists public.live_quiz_sessions (
  id                  uuid primary key default gen_random_uuid(),
  classroom_id        uuid not null references public.classrooms(id)      on delete cascade,
  quiz_id             uuid not null references public.teacher_quizzes(id) on delete cascade,
  host_id             uuid not null references public.profiles(id)        on delete cascade,
  status              text not null default 'lobby'
                        check (status in ('lobby','question','reveal','ended')),
  current_index       int  not null default 0,      -- position in sort_order
  question_started_at timestamptz,                  -- when current question opened
  created_at          timestamptz not null default now(),
  ended_at            timestamptz
);

-- (2) Per-student, per-question answer; UNIQUE lets a rejoin upsert (no dupes)
create table if not exists public.live_quiz_answers (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.live_quiz_sessions(id)      on delete cascade,
  question_id uuid not null references public.teacher_quiz_questions(id)  on delete cascade,
  student_id  uuid not null references public.profiles(id)               on delete cascade,
  answer      text not null,
  is_correct  boolean,                              -- objective only, set on submit
  answered_at timestamptz not null default now(),
  unique (session_id, question_id, student_id)
);

alter table public.live_quiz_sessions enable row level security;
alter table public.live_quiz_answers  enable row level security;

-- Sessions: staff manage; any classroom member may read (to join)
create policy live_quiz_sessions_staff on public.live_quiz_sessions
  for all  using (public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher','ta']))
  with check (public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher','ta']));
create policy live_quiz_sessions_member_read on public.live_quiz_sessions
  for select using (public.user_has_classroom_role(auth.uid(), classroom_id,
                     array['owner','co_teacher','ta','student']));

-- Answers: student writes/reads OWN (and must belong to the session's classroom); staff read all
create policy live_quiz_answers_student_write on public.live_quiz_answers
  for insert with check (
    student_id = auth.uid()
    and exists (select 1 from public.live_quiz_sessions s
                where s.id = session_id
                  and public.user_has_classroom_role(auth.uid(), s.classroom_id,
                        array['owner','co_teacher','ta','student'])));
create policy live_quiz_answers_student_update on public.live_quiz_answers
  for update using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy live_quiz_answers_student_read on public.live_quiz_answers
  for select using (student_id = auth.uid());
create policy live_quiz_answers_staff_read on public.live_quiz_answers
  for select using (exists (select 1 from public.live_quiz_sessions s
                where s.id = session_id
                  and public.user_has_classroom_role(auth.uid(), s.classroom_id,
                        array['owner','co_teacher','ta'])));

-- Class-visible aggregate WITHOUT names (COPPA): SECURITY DEFINER, member-gated
create or replace function public.live_quiz_distribution(p_session uuid, p_question uuid)
returns table (answer text, n int)
language sql security definer set search_path to '' as $$
  select a.answer, count(*)::int
  from public.live_quiz_answers a
  join public.live_quiz_sessions s on s.id = a.session_id
  where a.session_id = p_session and a.question_id = p_question
    and public.user_has_classroom_role(auth.uid(), s.classroom_id,
          array['owner','co_teacher','ta','student'])
  group by a.answer;
$$;

-- Session-end persistence to the existing results tables (authoritative path).
-- SECURITY DEFINER because the host (teacher) finalizes on behalf of each student.
-- create or replace function public.finalize_live_quiz(p_session uuid) ...
--   -> upsert public.teacher_quiz_responses + public.teacher_quiz_results per student,
--      mirror public.assignment_submissions so classroom_gradebook + student view reflect it.
--   (SEE DECISION POINT D2 — this touches quiz-loop-owned results tables.)

alter publication supabase_realtime add table public.live_quiz_sessions;
alter publication supabase_realtime add table public.live_quiz_answers;
```

---

## 7. Decision points queued for Phase 5 checkpoint

- **D1 (design):** two RUBRIC visual directions for the live stage (question display, distribution
  bars, presence strip). No iridescence. Present before building.
- **D2 (fence overlap):** live-quiz session-end must land per-student results in the gradebook. The
  results tables (`teacher_quiz_responses`/`teacher_quiz_results`) + submission→grades write pipeline
  are quiz-loop-owned. Recommended: `finalize_live_quiz` SECURITY DEFINER RPC (in the one migration)
  that writes those rows following the existing `submitQuizAttempt` shape, since a teacher cannot call
  the student-context action per student. **Needs your OK** (it writes into another lane's tables).
  Also: a live quiz has no formal `assignment` row — finalize must either attach/create one or write a
  standalone grade. Decide at checkpoint.
- **D3 (COPPA):** per-student answer names are **teacher-only** (default). Class sees only the
  anonymous distribution. A class-visible-names mode can be offered but built teacher-only first.

---

## 8. BLOCKERS for other lanes

- **B1 (this lane may need):** guided-session quiz-station student runner is reportedly a stub — not
  required for the standalone live-quiz mode, so not a blocker unless Phase 5 reuses guided stations.
- **B2 (Virgil lane):** if a guided session invokes Virgil grading, that action is a black box here;
  will log a BLOCKER if broken rather than edit across the fence.
- **B3 (quiz-loop lane):** D2 write into `teacher_quiz_responses`/`teacher_quiz_results` is their
  territory — coordinating via the finalize RPC; flag for their awareness.

---

## STOP — awaiting go on: (a) the migration, (b) D2 approach, before Phase 1.

---

## PHASE 1 CLOSEOUT — correspondence complete (no migration)

The one FAIL in the matrix was **DMs (backend live on `main`, zero UI)** plus the **`'message'`
notification gap** (bell had no icon/color; `NotificationType` lacked the value). Both fixed:

- `src/lib/actions/messages.ts` — `startConversation` (wraps the existing `start_conversation`
  RPC + best-effort `sendNewMessageEmails`), `sendMessage`, `markConversationRead`,
  `listMessagingContacts` (classmates grouped by classroom; safe profile fields only — never the
  synthetic student email, COPPA).
- `src/hooks/use-conversations.ts` (inbox + unread + realtime) and `src/hooks/use-conversation.ts`
  (single thread, live append, marks read). Per-instance `useId()` channel topics to dodge
  supabase-js channel dedupe.
- `src/app/(app)/messages/page.tsx` — two-pane inbox + thread + composer + new-message picker,
  `?c=<id>` deep-link (matches the notification `action_url = /messages`).
- `src/lib/navigation.ts` — "Messages" nav item (teacher + student).
- `src/lib/actions/_shared.ts` — added `"message"` to `NotificationType`.
- `src/components/tome/notification-bell.tsx` — `message` → `MessageCircle` icon + lapis accent.

**Proof (DB loop, executed then ROLLED BACK — nothing persisted):** Matthew(teacher) →
`start_conversation` → Beatrice(student); Beatrice replies (messages INSERT RLS). Result:
Beatrice reads 2 msgs, Homer (classmate, non-participant) reads 0 (participant-scoped RLS),
`'message'` notification fanned to Beatrice AND to Matthew — both directions.

Announcements / assignment-published / grade+feedback / notification-bell were already PASS in the
Phase 0 matrix (verified at data level); no code change needed. tsc clean for all Phase 1 files
(pre-existing `RouteContext` errors in guided-session routes are untouched, logged for Phase 5).

---

## PHASE 2 CLOSEOUT — grade visibility authoritative both sides (no migration)

The grade WRITE path (`gradeSubmission` → `grades` canonical + `grade_history` snapshot +
`assignment_submissions` mirror + student notify) is owned by SHIP/quiz-loop and was already
correct. The Phase 2 gap was **read-side liveness**: the student view refetched live, but the two
teacher surfaces required a hard refresh to see new submissions/grades. Fixed by adding
RLS-scoped realtime subscriptions on `assignment_submissions`:

- `src/app/(app)/classroom/[id]/gradebook/page.tsx` — channel `gradebook:{classroomId}:{uid}`,
  `event:"*"` → `fetchAll()`. The `submissions_staff_select` RLS (`user_has_classroom_role`)
  means realtime only delivers this teacher's own-classroom rows, so no `classroom_id` filter is
  needed on the subscription.
- `src/app/(app)/classroom/grading/page.tsx` — extracted the inline queue loader into a
  `useCallback fetchQueue` that **merges over prior state** (`existing?.score ?? d.score`, kept
  `feedback`/`ai_draft_score`/`ai_notes`) so a background realtime refetch never wipes an unsaved
  Virgil draft or teacher edit; subscription channel `grading-queue:{uid}` on
  `assignment_submissions`.
- `src/components/classroom/student-classroom-view.tsx` — **no change**; already reads canonical
  `grades` (score/max_score/feedback/was_overridden) with realtime `my-grades:{classroomId}:{uid}`
  on its own submissions. Confirmed live.

**Proof (Phase 0 data-level verify still holds):** teacher `gradeSubmission` writes `grades` +
`grade_history` + mirror; student `grades_student_select` RLS returns only own grades; teacher
`classroom_gradebook` RPC returns the matrix. Both sides now reconcile without a manual refresh.
tsc clean for both edited files (same pre-existing guided-session `RouteContext` noise only).

---

## PHASE 3 CLOSEOUT — Liveblocks foundation verified complete (no migration)

The Liveblocks stack was already built (prior sessions) and every DB dependency is present on the
live DB (`vjaezrcuuzmbmnsfrtwt`). Phase 3 = verify the foundation is correct, classroom-scoped,
and COPPA-safe. No new code was required; audited surfaces:

- **Single auth boundary** `src/app/api/liveblocks-auth/route.ts` — the browser never sees the
  Liveblocks secret; it posts the room, we verify the Supabase session server-side, and mint a
  token scoped to what that user may do. Room families + gates:
  - `book:*` / `reader:*` (legacy) — READ_ACCESS for any authenticated reader (presence only).
  - `classroom:{cid}:book:{bid}` — READ_ACCESS **only** when `user_is_classroom_member(uid,cid)`
    AND `classrooms.live_presence_enabled` is not false. Fails closed (403).
  - `gs:{sid}:{book}:{ch}[:{uid}]` — guided-annotation rooms; collaborative → shared room for
    every participant + teacher; private_to_teacher → per-student room, a student may enter only
    their own, teacher may enter any. `annotations_enabled=false` mints nothing.
  - Role in `userInfo` is derived **server-side** (`user_has_classroom_role` / session ownership),
    never trusted from the client.
- **COPPA:** the auth endpoint selects only `display_name, avatar_url` from `profiles` and puts
  `{name, avatar, role}` in `userInfo` — the synthetic student email is NEVER read, so it can
  never reach Liveblocks or a peer. Verified at data level too: all 30 student `display_name`s in
  the cohort are human names, none contains `@`.
- **Presence layer** `src/components/reader/reader-presence.tsx` — ephemeral only (cursors,
  selections, avatar stack); nothing persisted (highlights/notes stay in Supabase). Renders
  children with NO Liveblocks connection for signed-out/demo or a class with presence disabled.
  Peer colors are muted RUBRIC accents, deliberately **not iridescent** (reserved for Virgil).
- **Wiring:** reading-assignment pages link into the reader with `?classroom=<id>`
  (`classroom/[id]/assignment/[assignmentId]/page.tsx`), the reader reads it into `classroomId`,
  and `ReaderPresenceRoom` scopes the room to `classroom:{cid}:book:{bid}`. End-to-end.

**Live DB dependency check (all true):** `classrooms.live_presence_enabled`,
`user_is_classroom_member`, `user_has_classroom_role`, `guided_session_participants`,
`guided_sessions.annotations_enabled`. Note: `live_presence_enabled` has no migration file in this
worktree but exists on the live DB (added out-of-band in an earlier session) — no DDL needed.

---

## PHASE 4 CLOSEOUT — collaborative annotations verified durable + moderated (no migration)

The collaborative reader-annotation layer exists and satisfies all three properties. Audited:

- **Collaborative** — `src/components/guided-learning/annotations/annotation-layer.tsx` uses
  Liveblocks **Comments** (`<Composer>` / `<Thread>`), so many readers author threads on the same
  passage in one shared room. Highlights are anchored with a W3C-style quote+prefix/suffix anchor
  (`src/lib/annotations/anchor.ts`) stored flattened in `ThreadMetadata`, and re-found per rendered
  page after pagination reflow.
- **Durable** — annotations use Comments (persisted in Liveblocks storage), NOT the ephemeral
  presence channel (cursors/selections that vanish on disconnect). They survive reload, reconnect,
  and page turns. This is the durability contrast the layer is built around.
- **Moderated** — teacher-only affordances gated on the **server-derived** `userInfo.role`
  (`useSelf((me) => me.info.role === "teacher")`, never a client-set value): Endorse (toggles
  `metadata.endorsed` → gold-leaf "Teacher clarification") and Delete (`useDeleteThread`). Colors
  are flat RUBRIC (lapis peer / gold endorsed), **never iridescent** (Virgil-only).
- **Privacy topology** — `collaborative` → one shared `gs:{sid}:{book}:{ch}` room; `private_to_
  teacher` → per-student `…:{uid}` room, enforced by the auth endpoint (room id keyed on the
  student's uid, server-checked), not client-side hiding. COPPA-safe (userInfo carries only
  name/avatar/role).
- **Mounted** — student side in `locked-reader.tsx` (`AnnotationLayer` with roomId/visibility/
  presence); teacher review in `session-monitor-dashboard.tsx` (`TeacherAnnotationReview`, lists
  every thread per reading target, endorse/delete). tsc clean for all annotation files.

**Deferred to the Phase 5 design checkpoint (needs DDL):** a *stronger* durability guarantee — a
Supabase `session_annotations` mirror fed by a Liveblocks webhook so annotations are queryable /
auditable / recoverable server-side after a session ends (independent of the Liveblocks room
lifecycle). This is the only annotation gap that requires a migration, so its table is a candidate
for the single Phase 5 migration and will be presented there rather than minted ad hoc now.
