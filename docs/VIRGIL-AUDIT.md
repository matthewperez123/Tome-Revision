# Virgil Surfaces Audit — Phase 0 (census + live probe)

Branch: `today/virgil-surfaces-functional` (off `origin/main`, worktree `../tome-virgil`).
Date: 2026-07-06. No code changed in this phase.

## How the endpoint is structured

One dispatcher: `POST /api/virgil` (`src/app/api/virgil/route.ts`).
- Auth: 401 if no session.
- Role gate: reads `profiles.role`; **403 unless `role === "teacher"`** — inline, covers the ENTIRE endpoint. (Note: `assertVirgilAccess` in `src/lib/entitlements.ts` is the *intended* helper for this but is **never actually called** — the route re-implements the same role check inline. Dead-but-harmless.)
- Two request shapes:
  1. `{ task, input }` — the 6 teacher task handlers (`src/lib/virgil/teacher-tasks.ts`). Strict envelope: any extra top-level key → 400. Model/tokens/temperature come only from `TASK_CONFIG`.
  2. `{ messages, surface }` — the streaming **chat** path (library / guided-session). **Orphaned** — see below.
- 7th surface (`semester_plan`) is a SEPARATE route: `POST /api/classroom/semester-plan/generate`, School-entitlement gated.

## Routing matrix (locked) — LIVE VERIFIED

`src/lib/virgil/task-config.ts`. All three model IDs were probed live against the API (max_tokens=4):

| Configured ID | Resolves to | Status |
|---|---|---|
| `claude-sonnet-4-6` (generation) | `claude-sonnet-4-6` | OK |
| `claude-opus-4-8` (grading) | `claude-opus-4-8` | OK |
| `claude-haiku-4-5` (announcements) | `claude-haiku-4-5-20251001` | OK |

No routing mismatches. Every surface calls the matrix-assigned model.

## Config sanity

- `ANTHROPIC_API_KEY` present server-side only; all model calls are in `route.ts` / `teacher-tasks.ts` / `src/lib/teacher-quiz/*` / `src/lib/semester-plan/*` — never in a client component. No client-side exposure found.
- Timeouts: `maxDuration = 60` (virgil route), `120` (semester-plan). Client abort forwarded via `request.signal`.
- Error handling: each task try/catches the model call and returns a truthful 502/422/503. **No retry/backoff on 429/529** anywhere (Phase 1 target). Structured tasks use `extractJson` (strips fences) but have **no repair retry** on parse failure (Phase 1 target).
- Metering: teacher tasks insert into `virgil_task_events` **on success only** via `recordTaskEvent`; chat path uses `virgil_usage`. Per-task + per-object daily caps enforced BEFORE the model call.

## Entitlement reality check (Phase 0.5) — NO DENIAL

The feared "empty subscriptions → every teacher denied" does **not** apply here:
- The 6 task surfaces gate on `profiles.role === "teacher"` only — no subscription read.
- `subscriptions` is NOT empty: 9 rows, 6 active `school` subs.
- Persona teacher `hypatia.teacher@tome.test` = `role=teacher` **and** owns an active `school` subscription (seats=1) → `hasActiveSchoolEntitlement` passes → even `semester_plan` is reachable.
- `alcuin.teacher@tome.test` = `role=teacher` + active school sub. `matthewperez1@protonmail.com` = teacher.

**No entitlement bypass decision is needed.** (Caveat: `school_seats` is empty, so the *covered-teacher* path — a non-owner teacher entitled via someone else's school seat — is currently dead. Not relevant to the personas, who each own their own sub.)

## PASS/FAIL matrix — the 7 teacher surfaces

Legend: **Routing/Config/Entitlement/Persistence** verified live (API + DB schema + code path). **Browser E2E** (actually clicking through as Hypatia with a live session) is deferred to Phase 5 proof — flagged where relevant.

| # | Surface | Entry point | Task/route | Model | Persists to | Reaches students via | Status |
|---|---|---|---|---|---|---|---|
| 1 | Quiz builder | `classroom/quiz-builder/page.tsx` → `handleGenerate` | `teacher_quiz` | Sonnet | `teacher_quizzes` + `teacher_quiz_questions` (draft) | assignment composer (`assignments.quiz_id`) | PASS (code) — client reads `body.draft.id`, server returns `{draft:{...quiz}}`. ✔ |
| 2 | Assignment builder | `classroom/[id]/page.tsx` → `submit` | `assignment_draft` | Sonnet | `assignments` (status=draft) + `assignment_targets` | publish flow | PASS (code) |
| 3 | Auto-grader | `classroom/grading/page.tsx` → `draftWithVirgil` | `grade_response` | Opus (temp 0) | draft only; teacher finalizes via `gradeSubmission` | grade returned to student | PASS (code) |
| 4 | Announcement draft | `teacher-announcement-composer.tsx` → `draftWithVirgil` | `announcement_draft` | Haiku | none (fills composer); posts via `createAnnouncement` | `classroom_announcements` + notifications | PASS (code) |
| 5 | Student note | `classroom/[id]/student/[studentId]/page.tsx` → `draftNoteWithVirgil` | `student_note` | Sonnet | none (fills notes box) | n/a (teacher-private) | PASS (code) |
| 6 | Class insights | `classroom/[id]/page.tsx` (line ~627) | `class_insights` | Sonnet | none (read-only display) | n/a | PASS (code) |
| 7 | Semester planner | `classroom/[id]/semester-plan/*` | `/api/classroom/semester-plan/generate` | Sonnet | `semester_plans` (persist.ts) | provision flow | PASS (code) — School-gated; Hypatia entitled |

### Known defects (not blocking, logged for later phases)
- **D1 (Phase 2, minor):** `teacher-tasks.ts:191` reads `saved.json.quizId` but `persistDraftQuiz` returns `{ draft: {...quiz} }` (no `quizId`). Result: `recordTaskEvent("teacher_quiz", null)` — metering logs a **null object_id**. The client nav is unaffected (it reads `body.draft.id`). Fix: read `saved.json.draft.id`.
- **D2 (Phase 1):** No retry/backoff on 429/529; no JSON repair-retry on parse failure. Failures currently surface as a single truthful error.

## Orphan list (chatbot-removal residue) — for Phase 4, list-then-delete after go

1. **Streaming chat path** — the `{ messages, surface }` branch of `/api/virgil/route.ts` (~lines 142–234) plus its whole dependency tree: `VIRGIL_REGISTRY` (`registry.ts`), `surfaces/library.ts`, `surfaces/guided-session.ts`, `profile.ts`, `runVirgilToolLoop` + `tools/*`. **No client renders `<VirgilSurface>` or posts `{messages, surface}`** (grep: zero callers). Dead since the Jul 4 chatbot removal. NEEDS careful confirmation before deletion (the guided-session tool loop looks reachable but isn't).
2. **`src/lib/virgil-suggestions.ts`**, **`src/lib/virgil-tips.ts`** — zero importers.
3. **`assertVirgilAccess` / `VirgilAccessError`** (`entitlements.ts`) — defined, never called. **FENCED** (entitlement facade — note only, do not modify without go).

## Behind a fence — noted, NOT touched
- `/virgil` marketing page + `VirgilLanding` + `MergedVirgilBlock` + landing/homepage demos (`VirgilDrawerDemo`, `MockVirgilDrawer`, `AnimatedVirgil`, `VirgilAnnotationDemo`, `lib/demo/virgil.ts`) + `onboarding/step-virgil.tsx` still describe Virgil as a **student-facing** "AI scholar" (reads alongside you, hints during quizzes). This is stale post-pivot copy, but marketing layout/nav is owned by `today/marketing-nav-determinism`. **Note only.**
- Assignment composer / quiz-loop fan-out internals — owned by the quiz-loop / SHIP prompts.

## Security notes (for the separate hardening phase — not fixed here)
- Grading (`grade_response`) has real injection defenses (`wrapStudentText`, delimiter escaping, `GRADING_INJECTION_GUARD`, hard length cap). The other generation tasks pass teacher `brief` text straight into prompts without an injection guard — acceptable (teacher is trusted) but worth the hardening phase's attention.

## Verdict
Backend is mature and correctly wired; routing, config, entitlement, and persistence schema all pass live. No entitlement blocker. Main gaps are Phase 1 resilience (retry/JSON-repair) and the chatbot orphans (Phase 4). Recommend proceeding.
