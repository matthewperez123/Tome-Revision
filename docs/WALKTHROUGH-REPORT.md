# Tome — "Does it actually work" walkthrough

**Verdict: YES — the teacher→student classroom loop works end-to-end against the live database (proven below with real row IDs), and the new front-door + scan-to-join code is complete, typecheck-clean, and statically verified; ONE live step (provisioning a student sign-in code and running a real scan→enroll) is held pending your go-ahead to write to the prod dataset.**

Branch: `today/ship-walkthrough` — commits `b461b2ae` (door) + `23671925` (join). NOT merged to main.
Environment probed: Supabase `vjaezrcuuzmbmnsfrtwt` (this is the **prod** dataset — all probes below are read-only SELECTs; no rows were written).

---

## Personas (all present)

| Persona | Role | user id |
|---|---|---|
| hypatia.teacher@tome.test | teacher (owns RHET10) | `2a2326ae-0dc6-4b98-b6b5-876247156df0` |
| alcuin.teacher@tome.test | teacher (no classrooms — isolation) | `3bff0b71-350c-4813-97c2-308fd8042c5a` |
| beatrice.student@tome.test | student (RHET10) | `a599fe24-aad7-40fc-a05f-6d270d893475` |
| homer.student@tome.test | student (English 9) | `6d95d829-8bec-4f60-bdce-68f8a174745e` |
| penelope.student@tome.test | student (RHET10) | `6e41be06-050c-43b5-a012-182648221644` |

Test classroom: **Rhetoric & Poetics 10**, id `5b191168-4da0-4740-ab9a-c3b6397b5d09`, join code **RHET10**, owner Hypatia, 3 students.
(Note: a second, unrelated "Rhetoric & Poetics 10" `6934e84e…` / join RHET26 exists under a different demo owner — not part of this cohort.)

---

## Happy path — Hypatia + Beatrice (the 5-stage loop)

| # | Stage | Result | Evidence (real rows) |
|---|---|---|---|
| 1 | Class code exists | **PASS** | `classrooms.join_code = 'RHET10'` for `5b191168…`, not archived, cap 35 |
| 2 | Student joined | **PASS** | `classroom_members` row `6de9e94f-9d25-4e57-a4a0-302580110f9d` — Beatrice, role `student`, in `5b191168…` |
| 3 | Assignment sent | **PASS** | assignment `13702a8d-d20e-4e72-b95e-ac2bc594a5e2` "Iliad Book I — Checkpoint Read", status `active`, in RHET10; submission roster seeded |
| 4 | Student submitted | **PASS** | `assignment_submissions` row `ebb0049f-3021-4ce2-a50f-112f63706c32` — Beatrice, status `graded` |
| 5 | Grade returned | **PASS** | `grades` row `010d8eaa-ecc5-418c-b4c3-9ae2f22ae8d2` — score 45/100, `graded_by` Hypatia, `was_overridden=true`, **1 `grade_history` snapshot** (`grade_id`-linked) → the grades→grade_history mirror invariant held through the override |

**The loop closes.** A student's join, an assignment reaching them, their submission, and a teacher grade (including an override correctly snapshotted to `grade_history`) are all real, linked rows.

### Data observation (not a loop failure)
- Essay `4943cd4f-ad04-4cc4-b587-894c29a55742` "On Achilles' Rage" (scope `classroom`, status `active`) has **0 submissions / 0 grades**. This fixture was inserted directly as `active` rather than through `publishAssignment` (which eagerly seeds the not-started roster), so no submission rows were seeded. It does not affect the proven loop above and needs no code change — if you want it to show on the roster, re-publish it through the app or run the backfill. Flagging, not fixing.

---

## Isolation — Alcuin + Homer

| Check | Expected | Result | Evidence |
|---|---|---|---|
| Alcuin owns/belongs to any classroom | none | **PASS** | `classroom_members` where student=Alcuin → **0 rows** |
| Alcuin can reach RHET10 | denied | **PASS** | `user_has_classroom_role(alcuin, RHET10, {owner,co_teacher,ta,student})` → **false** |
| Alcuin can reach English 9 | denied | **PASS** | `user_has_classroom_role(alcuin, 6544bc85…, all roles)` → **false** |
| Hypatia owns RHET10 | yes | **PASS** | `user_has_classroom_role(hypatia, RHET10, {owner})` → **true** |
| Beatrice is a RHET10 student | yes | **PASS** | `user_has_classroom_role(beatrice, RHET10, {student})` → **true** |
| Homer is an English 9 student | yes | **PASS** | `classroom_members` (homer, English 9) → 1 row |

A teacher with no classrooms sees nothing; the canonical `user_has_classroom_role()` gate that guards every classroom surface (including the new join-poster route) correctly returns `false` for the outsider.

---

## New this session

### Phase 1 — Front door (`door: open-tome routes to auth`, `b461b2ae`)
- `OPEN_TOME_LOGGED_OUT_TARGET = "/login"` (one-line flip to `/signup`) in `src/lib/marketing-nav.ts`.
- `LandingNav` "Open Tome" pill: signed-in → `/dashboard` (role home, owned by the existing auth machine — untouched); logged-out → the target constant. Resolving skeleton + fixed footprint preserved (no nav-determinism regression).
- `/login` already surfaces "Create account" → `/signup` and "Student? Use your class code" → `/student-login` above the fold (verified in `login/page.tsx`). `/signup` is reachable, not hidden.

### Phase 2 — Scan-to-join (`join: class QR + one-path join action`, `23671925`)
| Piece | Verification |
|---|---|
| Teacher "Show QR" modal + "Print join poster" route | **VERIFIED (code + RPC).** QR payload is ONLY `${APP_URL}/join?code=RHET10` (join_code confirmed `RHET10`); no name/teacher/ID/PII. Rendered locally via `qrcode` — no external API. Poster route `classroom/[id]/join-poster` staff-gated by `user_has_classroom_role` (proven true for Hypatia, false for Alcuin). Rotating the code invalidates old QRs by construction. |
| Student `/join?code=` (auth-aware) | **VERIFIED (code).** Signed-in → `/classroom/join?code=`; logged-out scanner → `/student-login?returnTo=/join?code=`, no account created from a scan. `verifyStudentAccess` honors only same-origin `returnTo`. |
| Join rate-limit | **VERIFIED (code + schema).** Reuses `login_attempts` under a namespaced `join:${ip}` key (`code_prefix` is unbounded `text`, confirmed). Ledger currently 0 rows / 0 `join:` keys. |

### Phase 3 — Migration gate: **NONE NEEDED** (stated explicitly)
No schema changes. `classrooms.join_code`, `student_access_codes`, `login_attempts` (with `text` `code_prefix`), and `user_has_classroom_role()` all already exist and are already applied.

---

## The one step held for your approval (prod write)

A **fully live** scan-to-join proof — logged-out scan → `/student-login` → `verifyStudentAccess` mints a session → student lands on `/join?code=RHET10` → enroll — cannot be run without writing to the prod dataset, because:

1. `student_access_codes` currently has **0 rows** — no student has a code-login credential, so provisioning one is a prod INSERT.
2. Completing the join inserts a real `classroom_members` row.
3. `verifyStudentAccess` carries a `NOTE(phase-4)` to confirm the magic-link OTP `type` (`"email"` vs `"magiclink"`) against this project — only confirmable by actually running it.

Per your rule ("ask before touching prod data; default to the dev/walkthrough environment"), I have **not** provisioned a code or run a live enroll. Say the word and I'll either (a) run it against a throwaway walkthrough student in prod and append the live row IDs + OTP-type confirmation here, or (b) point it at a dev/walkthrough Supabase project if you have one.
