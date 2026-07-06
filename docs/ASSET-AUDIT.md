# Asset Load/Save Reliability — Phase 0 Census

Branch: `today/asset-loadsave-reliability` (worktree `../tome-assets`, off `origin/main` @ `a681f033`).
Method: static code census + live RLS-policy read + live row-count reproduction against
Supabase `vjaezrcuuzmbmnsfrtwt`. No writes performed. No code changed in Phase 0.

Symptom placeholders in the prompt were left blank → full census run.

---

## Live data state (reproduction by row-count, not browser)

| table | rows | reading |
| --- | --- | --- |
| teacher_quizzes | 4 | teachers do save quizzes |
| teacher_quiz_questions | 17 | with questions |
| **teacher_quiz_responses** | **0** | **no student has ever answered a teacher quiz** |
| **teacher_quiz_results** | **0** | **the teacher-quiz return loop has never produced a row** |
| assignments | 10 | assignment loop populated |
| assignment_submissions | 58 | students do submit |
| grades | 34 | teachers do grade |
| reading_progress | 65 | reading position does persist server-side |
| quiz_results | 53 | trials do record (via RPC) |
| classroom_members | 43 | rosters populated (34 students / 8 teachers) |
| classroom_announcements | 2 | announcements work |

Walkthrough env present: classroom **GRTBK3** "Third Period — Great Books" (3 members).
Named personas present (matthew, Hypatia, Beatrice, Homer). `docs/WALKTHROUGH.md` exists.

---

## Lane A — Media

Covers, avatars, and uploads are **almost entirely static/procedural**; media is structurally
robust, with one wasteful edge.

- **Storage buckets: ZERO.** `storage.buckets` is empty. There is **no upload code anywhere** in
  `src/` (no `storage.from`, no `.upload(`, no `type="file"`). So the empty buckets cause no
  failures — teacher/student file upload simply does not exist as a feature.
- **Book covers** = procedural `<ClassicsCover>` (a gradient + tradition SVG motif + title band).
  It **always renders the procedural layer first**, then *optionally* layers a `next/image` on top
  and walks an `onError` source chain, falling back to procedural if every source 404s. Covers
  **cannot visually break.** The main library grid (`book-card.tsx`) uses ClassicsCover directly.
- **MEDIA edge (cosmetic/perf):** `ClassicsCover` and `BookCoverThumb` reference two image
  registries whose files are **not present in `origin/main`**:
  - `TOME_GENERATED_COVER_PATHS` → `/covers/tome/generated/images/*.jpg` — that directory is
    **empty** (50 book entries point at missing files).
  - `monumental-literary-paths.ts` → `/living-archive/assets/{slug}/*` — only **3 of ~25** slugs
    have asset dirs (alices-adventures-in-wonderland, macbeth, moby-dick). The other ~22 404.
  Net: ~72 books issue 1–2 failed image requests before the procedural fallback shows. Not broken,
  but wasted requests + a possible flash on those covers. `next.config` `remotePatterns` covers all
  external hosts used; unoptimized local paths bypass the optimizer.
- **Avatars:** rendered as display-only `avatar_url` (from `profiles`) with initials fallback;
  no picker and no upload flow. `src/lib/avatars.ts` and `public/profile-pictures/` (named in the
  prompt) **do not exist** — legacy. 7 static demo character PNGs live in `public/avatars/`.

Lane A conclusion: no save/load failures; one cosmetic/perf cleanup (dead cover-image registries).

---

## Lane B — Data

### Save-path map (action → table(s) → writer → RLS)

| Save (role) | Table(s) | Writer | Authorized by |
| --- | --- | --- | --- |
| Trial complete (student) | quiz_results, user_stats | `record_trial_result` RPC (`/api/progress/quiz`) | SECURITY DEFINER; client INSERT revoked ✅ |
| Reading position (student) | reading_progress | **client upsert** (`reader-sync.ts`) | `auth.uid()=user_id` ✅ |
| Reader prefs (any) | reading_preferences | **client upsert** (`reader-sync.ts`) | `auth.uid()=user_id` ✅ |
| Quiz draft SAVE (teacher) | teacher_quizzes, teacher_quiz_questions | **raw client update+delete+insert** (`quiz-builder/[quizId]/page.tsx`) | owner RLS ✅ (but see SAVE-1) |
| Quiz publish (teacher) | teacher_quizzes | `publishTeacherQuiz` action | owner RLS ✅, truthful toast |
| Quiz assign (teacher) | assignments | `assignQuiz` action | school-entitlement gated, truthful toast |
| Quiz submit (student) | teacher_quiz_responses, teacher_quiz_results | `submitQuizAttempt` action (admin client) | student INSERT RLS ✅ / service-role for results |
| Assignment submit (student) | assignment_submissions | `submitAssignment` action | `student_id=auth.uid()` ✅ |
| Grade (teacher) | grades, grade_history | `gradeSubmission` action | staff via `user_has_classroom_role` ✅ |
| Announcement (teacher) | classroom_announcements | `createAnnouncement` action | owner/co_teacher ✅ |
| Classroom join (student) | classroom_members, assignment_submissions | `joinClassroomByCode` action | `members_self_join` ✅ |
| Highlights (any) | highlights | client insert/update/delete | `auth.uid()=user_id` ✅ |

Every classroom-scoped RLS policy already routes through `user_has_classroom_role()` — verified live.
**No straggler client write to `quiz_results` exists** — the #1 suspect is clean.

### The core defect (matches the "quiz edits don't stick" symptom)

**SAVE-1 — teacher quiz draft save is a lying, non-atomic, error-swallowing client write.**
`classroom/quiz-builder/[quizId]/page.tsx` `handleSave` (~L232–291):
1. `await supabase.from("teacher_quizzes").update(...)` — **error ignored**
2. `await supabase.from("teacher_quiz_questions").delete().eq("quiz_id", quizId)` — **error ignored**
3. `await supabase.from("teacher_quiz_questions").insert(...)` — **error ignored**
4. unconditionally `setSaved(true)` → shows "Saved".

Consequences:
- If any write fails (network, RLS, constraint), the UI still says **"Saved"** — a UX lie.
- **delete-then-insert is not atomic.** A failure/navigation/crash after step 2 but before/within
  step 3 leaves the quiz with **zero questions** while the UI reported success → permanent data loss.
- **No revalidation after save.** Client state is the only truth; on reload the server may hold a
  different (or emptied) quiz → the reported "my edits didn't stick after leaving the page."
- There is **no `saveTeacherQuiz` server action** — the save is done inline in the client. Sibling
  writes (publish/assign/submit/grade) all go through server actions with truthful toasts; the draft
  save is the odd one out.

### Load-path observations

- Auth contract is sound: `useAuth()` exposes `isLoading` (a real "resolving" state) from the single
  shared `AuthProvider`. Consumers *can* gate on it.
- **LOAD-1 — errored queries render identically to genuinely-empty.** Data hooks/components
  destructure `const { data } = await supabase…` and **drop `error`**; a failed query yields
  `data = null` → rendered as an empty roster/list with no error affordance and `loading=false`.
  Confirmed in `use-teacher-students.ts` (roster) and the same pattern recurs across classroom
  load surfaces. This is "fake-empty": a transient RLS/network failure looks like "no students yet."
- **UX-LIE-1 (silent sync).** `saveReadingPosition` / `useReaderPrefsSync` swallow every error
  (`catch { /* non-fatal */ }`). localStorage is the instant source of truth so *local* reading
  isn't harmed, but **cross-device sync can fail invisibly** — no telemetry, no user signal.
- No anonymous-first-fetch bug found in the surfaces inspected: the gated fetches key their effects
  on `user` and refetch when auth settles. (Phase 2 will still sweep every data surface to confirm.)

---

## FIVE-CATEGORY SUMMARY

### SAVE FAILURES
- **SAVE-1** teacher quiz draft save: raw client update+delete+insert, all errors swallowed,
  non-atomic (delete-then-insert can wipe all questions), no `saveTeacherQuiz` server action.
  `src/app/(app)/classroom/quiz-builder/[quizId]/page.tsx` L232–291. **Prime root cause of
  "quiz edits don't stick."** → Phase 1.

### LOAD FAILURES
- **LOAD-1** errored reads present as fake-empty (dropped `error`, `loading=false`), no retry.
  `src/hooks/use-teacher-students.ts` + recurring pattern across classroom load surfaces. → Phase 2
  (full sweep needed to enumerate every instance).

### UX LIES
- SAVE-1 shows "Saved" on failure (also a UX lie; primary home is Save Failures).
- **UX-LIE-1** reading-position / reader-prefs sync failures are silent (`reader-sync.ts`).
  Local reading unharmed; cross-device sync can fail with no signal. → Phase 1 (truthful, quiet
  failure surfacing) / Phase 2.

### MEDIA ISSUES
- **MEDIA-1** dead cover-image registries → ~72 books make 1–2 failed image requests before the
  procedural fallback (cosmetic/perf; never a broken tile). → Phase 3 (prune/gate the registries;
  procedural fallback already correct).
- No upload feature exists (0 buckets, 0 upload code) — not a bug, a non-feature; flag only.

### BLOCKERS (do NOT rebuild here — scope fence)
- **BLOCKER-1** teacher-quiz **return loop is unexercised**: `teacher_quiz_responses` = 0 and
  `teacher_quiz_results` = 0 live. The write path (`submitQuizAttempt`) IS wired and RLS is correct,
  so this reads as *never-run* rather than *broken*. Belongs to the school-launch master ship plan,
  not this session. (Note: `TOME-SHIP-school-launch-master.md` is not present in this worktree; if
  it lives elsewhere, this maps to its teacher-quiz-completion phase.)

---

## Reproduction status

Reproduced at the **DB + RLS + code** level (the three-zeros confirmed empirically; RLS proven to
authorize each write; SAVE-1 proven by reading the handler). A **live two-browser walkthrough**
(teacher saves quiz → reload → still there; student submits; one simulated failed save) is the
remaining Phase-0 step and belongs to Phase 4 proof; it needs a dev server stood up on a non-3000
port in this worktree. Available on request.
