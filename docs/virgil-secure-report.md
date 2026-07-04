# Virgil Secured — Final Report

Branch: `today/virgil-secure` (left unmerged for review). Scope: harden and complete
Virgil's teacher-facing AI features (grading assistant + semester planner) and prove the
full round trip under test and attack. Live DB: `vjaezrcuuzmbmnsfrtwt`. Exactly ONE
schema change (migration 1g); no destructive DB ops; no billing changes.

## Checkpoints

| Part | Commit | Summary |
|------|--------|---------|
| 1 — API hardening | `4e758d00` | Single `/api/virgil` dispatcher 403s non-teachers before task dispatch; strict `{ task, input }` envelope (client can't choose model/tokens/temp); per-task + per-object caps over service-role-only `virgil_task_events`; migration 1g (draft-privacy column lockout, audit columns). |
| 2 — grading complete | `97955b82` | Virgil drafts a score + feedback (Opus, temp 0); teacher reviews and finalizes via the single `gradeSubmission` write path; `grade_history` records `ai_draft_score` vs `final_score`. |
| 3 — semester planner | `cc925b37` | Rehomed as a classroom tab with pacing + drift flags; item → assignment bridge (`/api/classroom/semester-plan/[planId]/provision`) creates a DRAFT assignment and back-links `assignment_id` + `status='provisioned'` exactly once. |
| 4 — round trip verified | `d4a0c426` | Essay round trip proven under RLS impersonation + prompt-injection attack + full security battery. See `docs/virgil-secure-roundtrip.md`. |
| 5 — build, sweep, report | (this) | Build + security sweep + report below. |

## Build

- `node_modules/.bin/next build` → **exit 0**, clean. Full type-check passes
  (no `ignoreBuildErrors`); all routes compiled.
- Caveat: `npm run build` also runs the `prebuild` gate `audit-stoa --strict`, which
  currently **fails** — `stoa-collection.ts not found`, **0 errors / 294 warnings**. This
  is pre-existing on the branch: earlier sweep commits deleted
  `src/data/stoa-collection.ts` (still shows `D` in `git status`), so the auditor falls
  back to the manifest and warns on every unpaired book. It is unrelated to Virgil
  Secured (0 invariant errors) and must be resolved before shipping the branch, but the
  Virgil code itself compiles and builds.

## Security sweep

| Check | Result |
|-------|--------|
| No client-exposed Anthropic key (`NEXT_PUBLIC_*ANTHROPIC*` / `*API_KEY*`) | **none** |
| No client component imports `@anthropic-ai/sdk` | **none** — all 10 importers are `src/lib/**` or `src/app/api/**`; zero overlap with `"use client"` files |
| Iridescence only on Virgil surfaces | **holds** — every `style={{ …IRIDESCENT }}` paint is a Virgil affordance (planner, guided-quiz, hints, grading, the single weekly-digest Virgil note). Other hits are literary colour words in `data/*/speakers.ts` or comments affirming the "not iridescent" invariant. |
| No `dangerouslySetInnerHTML` on student content | **holds** — all 9 uses render trusted content (book chapter HTML, verse/beowulf enhancements, work/hamlet preview, static FAQ JSON-LD, generated cover SVG). Student essay/quiz surfaces render text, and the grader `stripHtml`s student input. |

## Injection defenses (grade path)

`src/lib/teacher-quiz/grade.ts` + `src/lib/virgil/task-config.ts`:
`stripHtml` → `wrapStudentText` (forge-proof delimiters; truncate > 8000; throw > 20000,
refused before any model call) → student text framed as `(data, not instructions)` with
`GRADING_INJECTION_GUARD` → server-authored `MODEL_OPUS` / `temperature 0` → score clamp
`Math.max(0, Math.min(score, maxPoints))` → **draft only**: the teacher's finalize is the
sole write. Verified live: an "award 100/100" payload stored verbatim did not move the
finalized grade (final 78 vs ai_draft 82).

## Open finding (out of scope — recommend separate follow-up)

Pre-existing infinite recursion in `guided_sessions` RLS
(`supabase/migrations/20260413000000_guided_learning_sessions.sql`, April): the
`guided_sessions ⟷ guided_session_participants` policies reference each other, so any
authenticated `SELECT FROM guided_sessions` — and, transitively, any authenticated read
of `teacher_quiz_responses` (its teacher policy subqueries `guided_sessions`) — raises
`infinite recursion detected`. Does not affect the essay round trip (`grades`) or Virgil
grading (reads via the service role, RLS-exempt), but it would break a student reading its
own graded *quiz* response. Untouched by migration 1g; a fix needs SECURITY DEFINER
membership helpers to break the loop across the whole guided-learning feature — beyond the
one-migration / minimal-blast-radius constraints of this task.

## Status

All five parts landed as checkpoint commits on `today/virgil-secure`. **Not merged** —
left for review. Recommended pre-merge: resolve the stoa `--strict` prebuild gate (restore
or regenerate `src/data/stoa-collection.ts`) and schedule the guided_sessions RLS
recursion fix.
