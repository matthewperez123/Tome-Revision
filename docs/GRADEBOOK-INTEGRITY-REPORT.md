# Gradebook & Grades — Integrity Report

**Task:** Close the Loop, Harden the Mirror — every score must land in `grades`,
mirror to `grade_history`, and be visible to teacher (gradebook) and student.

**Project:** Supabase `vjaezrcuuzmbmnsfrtwt` (production) · **Date:** 2026-07-09

---

## Result: PASS

| Check | Before | After | Status |
|---|---|---|---|
| **A** — Teacher-quiz completion writes a `grades` row | never | yes (auto) | PASS |
| **A** — Beatrice Cole's stuck submission graded | `submitted`, no grade | `graded`, 17/100 | PASS |
| **B** — `grades` fully mirrored to `grade_history` | 36 grades / 34 history | 36 / 36, 0 unmirrored | PASS |
| Mirror is trigger-enforced (no path can bypass) | app-code only | DB trigger | PASS |
| Override re-grade writes before/after history row | app-code only | trigger | PASS |
| Teacher gradebook shows the score | missing | shows | PASS |
| Student view shows their own score (RLS-scoped) | missing | shows | PASS |
| Per-response override re-syncs `grades` | did **not** | now syncs | PASS |

---

## Phase 0 — findings (what was actually wrong)

| # | Finding |
|---|---|
| 1 | `grade_history` was written **only** by app code inside `gradeSubmission`. Auto-graded paths (`autoGradeTrialSubmission`, `autoFinalizeReadingForBook`) wrote a `grades` row but no history → the 36/34 gap. |
| 2 | `submitQuizAttempt` (teacher-quiz completion) wrote `teacher_quiz_responses` + `teacher_quiz_results` but **no `grades` row** and left the submission `submitted` → the score never reached the gradebook or student view. Beatrice Cole (submission `61589bc9`) was stuck this way. |
| 3 | The "grade_history is a 1:1 mirror of grades" premise was never true historically — the 34 rows were all AI-assisted first-grades carrying `ai_draft_score`/`final_score`. Auto-graded rows were simply never eligible under the old app-level design. The trigger makes the invariant real for the first time. |
| 4 | `overrideResponseScore` (per-response teacher override) recomputed `teacher_quiz_results` but never touched `grades` → an override left the gradebook showing the pre-override percentage. |
| 5 | Score convention confirmed: raw points out of the assignment's `points_available` (`max_score = points_available`, 100 in all live samples). Beatrice's 2/12 = 17% → **17/100**. |
| 6 | `grade_history.changed_by` was `NOT NULL`, but auto grades have no human grader → relaxed to nullable (the one small DDL in the migration). |

---

## Phase 1 — the one migration (applied 2026-07-09)

`supabase/migrations/20260709160153_gradebook_history_trigger_and_backfills.sql`
(schema_migrations version `20260709160153`, name `gradebook_history_trigger_and_backfills`):

- `ALTER grade_history.changed_by DROP NOT NULL`.
- `mirror_grade_to_history()` — `SECURITY DEFINER`, `search_path=''`. AFTER INSERT
  snapshots the new grade; AFTER UPDATE snapshots the prior score/feedback/grader
  next to the new final score.
- `trg_mirror_grade_to_history` AFTER INSERT OR UPDATE ON `grades`.
- Backfill: history row for the one unmirrored auto-grade.
- Backfill: Beatrice Cole's `grades` row (17/100) + submission → `graded`.

Post-apply verification: `grades=36`, `grade_history=36`, **unmirrored=0**.

---

## Phase 2 — wiring (code, no schema change)

- `src/lib/actions/teacher-quizzes.ts` · `submitQuizAttempt`: after writing
  `teacher_quiz_results`, upserts the `assignment_submissions` row to `graded`
  and upserts the canonical `grades` row (percentage → assignment points scale,
  `is_auto_graded=true`). **Closes Defect A.**
- `src/lib/actions/teacher-quizzes.ts` · `overrideResponseScore`: after
  recomputing the results summary, re-upserts `grades` (`was_overridden=true`,
  `graded_by=teacher`) so a per-response override reaches the gradebook. **Closes finding #4.**
- `src/lib/actions/grades.ts` · `gradeSubmission`: removed the `aiDraftScore`
  input and both app-level `grade_history` inserts — the trigger now owns the
  mirror. Comments corrected.
- `src/app/(app)/classroom/grading/page.tsx`: dropped the now-invalid
  `aiDraftScore` argument + updated the finalize comment.
- Typecheck clean (only pre-existing `registry.test.ts` vitest noise).

---

## Phase 3 — live proof against prod (RHET10, Moby Dick Quiz `a2514d9e`, /100)

Reproduced the shipped write sequences directly against production with real
personas; throwaway rows cleaned up afterward.

1. **Backfill (Beatrice Cole, `61589bc9`)** — `graded`, grade **17/100** auto,
   **1** history row. Retained (real fix).
2. **Teacher-quiz loop (Telemachus Grant, `d1173c50`, simulated 75%)** —
   submission `graded`, grade **75/100** auto, `teacher_quiz_results` present,
   **exactly 1** trigger-written history row (`previous=null → final=75`).
3. **Teacher gradebook** (`classroom_gradebook` RPC as Hypatia Reyes, RHET10
   owner) — Beatrice **17**, Telemachus **75**, both `graded`; Penelope
   `not_started`.
4. **Student view** (grades read as Telemachus, RLS-scoped) — returns **only**
   his own grade, **75/100**.
5. **Override** (Hypatia re-grades Telemachus 75 → 88, RLS admitted the owner) —
   grade **88**, `was_overridden=true`, feedback saved, **2** history rows;
   newest snapshots `previous=75 → final=88, changed_by=Hypatia`.
6. **Global integrity** after restore — `grades=36`, `grade_history=36`,
   **unmirrored=0**. Telemachus restored to `not_started`; all proof rows removed.

Reading/trial auto-grade paths use the same `grades.upsert` → same trigger; the
global `unmirrored=0` across every source confirms the invariant holds
universally.

---

## Follow-ups (out of scope, noted honestly)

- **AI-draft provenance lost on Virgil-assisted grades.** The old app-level
  mirror captured `ai_draft_score` vs the teacher's `final_score`. The trigger
  can't see the model's proposed draft, so trigger-written rows leave
  `ai_draft_score=NULL`. If that audit is wanted back, pass the draft explicitly
  (e.g. a `grades.ai_draft_score` column set by the grading action) and have the
  trigger copy it — a deliberate schema decision, not done here.
- `grade_history` has no RLS surfaced to clients today; it is read via
  service-role/admin only. No change made.
