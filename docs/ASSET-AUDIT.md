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

---

## REMEDIATION LOG

### Phase 1 — authoritative write paths + truthful save states (commit `26a333f6`)

- **SAVE-1 fixed** without a migration. New `saveTeacherQuiz` server action
  (`src/lib/actions/teacher-quizzes.ts`): school-tools gated → owner-checked → error-returning
  `.update()` of the quiz row → **insert new questions first, then delete the others** via
  `.not("id","in",(…newIds))`. Insert-before-delete guarantees a failed save can never empty an
  existing quiz (the old delete-then-insert could). Preserves all Virgil metadata
  (rubric, reference_answer, max_points, difficulty, category, hints, distractor_eliminations,
  source_anchor). Ends with `revalidatePath()` so the server is re-read after save.
- **quiz-builder page** `handleSave` now returns `Promise<boolean>`: routes through the action,
  on failure shows `toast.error` and **keeps the user's edits** (returns false, no "Saved"), on
  success sets saved. `handlePublish` awaits `handleSave()` and aborts publish if the save failed
  — no more publishing a quiz whose edits didn't persist.
- **UX-LIE-1 fixed** in `src/lib/reader/reader-sync.ts`: the `reading_progress` and
  `reading_preferences` upserts no longer swallow errors — a failed cross-device sync now
  `console.warn`s (local reading still driven by localStorage, so reading is unaffected, but the
  failure is observable rather than invisible).

### Phase 2 — auth-settled fetches + honest loading/empty/error states (this commit)

Fixed the **LOAD-1 fake-empty** pattern (dropped `error` → renders as genuinely-empty) and added
`authLoading` gating (a null user mid-resolution is not "signed out") across every classroom load
surface. Tiered by authority:

**Tier 1 — authoritative surfaces get full error + retry UI:**
- `src/hooks/use-teacher-students.ts` — captures `classErr`/`memberErr`, exposes
  `{ students, loading, error, reload }`, gates on `authLoading`. A failed roster read now returns
  an error (not an empty roster).
- `src/components/guided-learning/create-session-form.tsx` — `StudentRosterSelector` renders an
  error state with a **Try again** button (wired to the hook's `reload`) instead of the false
  "No students yet".
- `src/components/classroom/classroom-roster-panel.tsx` — captures the members read error, shows an
  error block + retry, and **no longer silently hides the whole panel** when a failed load leaves
  `isStaff` false (the `return null` guard now excludes the error case).
- `src/components/classroom/student-classroom-view.tsx` (Tier-1 student surface) — auth-settled
  gate (no more permanent spinner when signed out), distinguishes a **load failure from
  "Classroom not found"** (PGRST116 = genuine not-found; any other error → retry UI), captures the
  assignments read error, and cancels in-flight state on unmount.

**Tier 2 — dashboard cards get proportionate error capture (no fake data):**
- `students-at-risk-card.tsx` — a failed read now shows "Couldn't check student progress right now"
  instead of the reassuring lie **"All students are on track."**
- `teacher-stats-cards.tsx` — a failed read shows **"—"** for each stat instead of a misleading row
  of zeros (the "three zeros" symptom).
- `assignments-summary-card.tsx` — same: "—" on error instead of `0 need grading / 0 due this week`.
- `teacher-activity-feed.tsx` — a failed read shows "Couldn't load recent activity" + retry instead
  of "No activity yet".

**Tier 3 — self-hiding / ephemeral surfaces get the auth-settled gate only** (absent-on-error is
acceptable degradation, not a lie): `recently-graded.tsx`, `upcoming-assignments.tsx`,
`live-reading-panel.tsx` (realtime presence), `classroom-tab-bar.tsx`, and the two permission-gated
composers `teacher-announcement-composer.tsx` / `teacher-assignment-composer.tsx` (role-read error
now `console.warn`s instead of silently — the composer stays hidden but the failure is observable).

Verify: `tsc` clean across all Phase 2 files; only the pre-existing `RouteContext` Next-16
generated-types quirk remains in the untouched `api/guided-sessions/[id]/**` routes.

### Phase 3 — reliable covers (MEDIA-1) (this commit)

Root cause, corrected on inspection: `getBookCoverArt()` already returns `undefined` (museum art
culled 2026-06-18) so the `if (!art) return sources` short-circuit means ClassicsCover never emits
any museum/workspace source. Likewise `getTomeGeneratedCoverPaths()` returns `undefined` for every
book except the seven approved Monumental Literary Paths packs (its 50-entry legacy map is inert —
the getter never reads it). So the *only* image sources ClassicsCover ever issued were for those
seven approved books: `the-iliad, the-odyssey, the-aeneid, the-republic, the-divine-comedy,
the-canterbury-tales, beowulf`.

Those seven books' `/living-archive/assets/<slug>/` WebP packs were never committed (they exist
only as ~63 MB of orphaned untracked binaries in the primary working tree; `git ls-files` = 0), so
every one 404s in every deploy. Each of the seven therefore issued 1–2 doomed image requests and
then fell to the procedural cover — which was already the *only* thing that ever rendered for them.
The three genuinely-shipped packs (macbeth, moby-dick, alices-adventures-in-wonderland) are NOT in
the approved set, so ClassicsCover already showed them procedurally too; their assets are consumed
only by the now-orphaned `living-archive.ts` surface (zero `.tsx` importers).

Fix (`src/data/monumental-literary-paths.ts`): emptied
`MONUMENTAL_LITERARY_PATHS_APPROVED_COVER_BOOK_IDS` and `..._COMPLETE_PACK_BOOK_IDS` (now typed
`readonly string[] = []`). `getMonumentalLiteraryPathsAssets()` now returns `undefined` for every
book → ClassicsCover emits ZERO image sources app-wide → the procedural gradient+motif cover (which
always renders first and cannot break) is the sole path. Net visible change: none — the seven books
already rendered procedural; the only difference is the seven dead 404 requests are gone. The BIBLES
data + palettes are retained for reversibility, mirroring the existing culls in `cover-art.ts` and
`tome-generated-cover-paths.ts`. `livingArchiveBookFromBible` no longer runs (complete-pack set is
empty → `generatedBooks` = []), so the throw path can't fire and the dead living-archive surface
degrades to its three pilot books.

If the seven flagship packs are wanted later, the reversal is mechanical: `git add` their
`public/living-archive/assets/<slug>/` files and re-populate the two id arrays.

Verify: `tsc` clean across the three registry files + `ClassicsCover.tsx` (filtered error count 0;
only the pre-existing `RouteContext` / `registry.test.ts` noise remains).
