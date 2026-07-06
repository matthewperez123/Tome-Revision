# Tome — Two-Browser Walkthrough

The fastest way to see the whole classroom loop with your own eyes. Everything
here uses **disposable test accounts** on the non-routable `@walkthrough.tome.test`
domain — they are never real users and touch no real data. Re-running the seed
(`npx tsx scripts/seed-test-walkthrough.ts`) restores this exact starting state.

## Where

- **Production:** https://tome-revision.vercel.app
- **Login page:** https://tome-revision.vercel.app/login
- **Join a class:** https://tome-revision.vercel.app/classroom/join

## Accounts (shared password)

Password for **every** account below: `TomeTest2026!`
(this is the seed default `WALKTHROUGH_PASSWORD`; these are throwaway test logins.)

| Role | Email | Starting state |
|---|---|---|
| Teacher | `teacher.test@walkthrough.tome.test` | Owns the class below (School plan, 5 seats) |
| Student — Alpha | `student.alpha@walkthrough.tome.test` | Enrolled; already completed the Trial (90%) |
| Student — Beta | `student.beta@walkthrough.tome.test` | Enrolled; has **not** started the Trial |
| Student — Gamma | `student.gamma@walkthrough.tome.test` | **Not enrolled** — use this one to test joining live |
| Billing | `billing.test@walkthrough.tome.test` | Free reader, no subscription — for testing checkout/upgrade |

## The class

- **Name:** Third Period — Great Books
- **Join code:** `GRTBK3`
- **Classroom ID:** `74c90a17-b138-45fc-b082-53d44497be9c`
- **Seeded assignment:** "Trial — The Odyssey, Books I–III" (active, due in ~1 week, worth 100 pts)

## The two-browser scenario

Use two separate browsers (or one normal + one incognito) so a teacher and a
student can be logged in at the same time. Left column = **Teacher browser**,
right column = **Student browser**.

1. **Teacher logs in.** Teacher browser → `/login` → `teacher.test@walkthrough.tome.test` / `TomeTest2026!`. You should land on the teacher dashboard and see the class "Third Period — Great Books."
2. **Student logs in.** Student browser → `/login` → `student.gamma@walkthrough.tome.test` / `TomeTest2026!`. Gamma is not in any class yet, so the student home should show an empty/"join a class" state.
3. **Student joins by code.** Student browser → `/classroom/join` → enter `GRTBK3` → confirm. Gamma should now appear enrolled in "Third Period — Great Books."
4. **Teacher sees the new student.** Teacher browser → open the class roster. Gamma should now be listed alongside Alpha and Beta.
5. **Teacher creates a quiz.** Teacher browser → `/classroom/quiz-builder` → create a short quiz (a couple of multiple-choice questions is enough), save it.
6. **Teacher assigns the quiz** to "Third Period — Great Books" with a due date, and publishes it.
7. **Student completes the quiz.** Student browser (as Gamma, or switch to Beta) → open the assigned quiz → answer and submit.
8. **Teacher sees the result.** Teacher browser → open the quiz's results/responses view. The student's submission should appear with an auto-graded score (and any essay answers waiting for manual grading).
9. **Grade lands in the gradebook.** Teacher browser → `/classroom/74c90a17-b138-45fc-b082-53d44497be9c/gradebook`. The student's score should show as a row.
10. **Student sees their score.** Student browser → the student's progress/grades view should reflect the graded result.
11. **Teacher runs one Virgil action.** Teacher browser → any Virgil affordance (e.g. draft an announcement, or "Generate with Virgil" in the quiz builder). Confirm it produces a draft.

## Three-browser scenario — Live Quiz ("The Amphitheater")

This exercises live (Kahoot-style) quiz mode with a host projector and two racing
players. Use **three** browsers/profiles: one Teacher + two Students. A projector
or a large second monitor for the teacher screen makes the "big-screen" energy land,
but any window works.

Prereq: the teacher needs a **published** quiz with at least one question, attached
to a book (any book id). Reuse the quiz from step 5–6 above, or make a fresh one.

- **Teacher (host):** `teacher.test@walkthrough.tome.test`
- **Student A:** `student.alpha@walkthrough.tome.test` (already enrolled)
- **Student B:** `student.beta@walkthrough.tome.test` (already enrolled)

1. **Teacher launches the game.** Teacher browser → `/classroom/quiz-builder/<quizId>` → in the published section, pick "Third Period — Great Books" in the class dropdown → **Launch Live Quiz**. You should be taken full-screen to "The Amphitheater" lobby showing a live participant count of 0.
2. **Students see the banner.** Student A and Student B browsers → open the class `/classroom/74c90a17-b138-45fc-b082-53d44497be9c`. A purple **"A live quiz is happening now"** banner should appear near the top. Tap it.
3. **Students land in the lobby.** Each student sees a "You're in!" waiting screen. On the teacher's host screen, the participant count should tick to **2** and both display names appear as chips (human names — never an email).
4. **Teacher begins.** Teacher → **Begin**. The first question fills the screen with color-blocked answer zones and a circular countdown ring starts draining.
5. **Students race to answer.** Each student sees full-screen colored answer buttons. Tap an answer quickly on A, slowly on B. Each shows a "Locked in" confirmation; the host's "answered" counter climbs to 2.
6. **Teacher reveals.** Teacher → **Reveal**. The correct zone gets a white outline, wrong zones dim, and per-answer tallies appear. Students see a correct/incorrect result; the faster correct answer earns more points (speed-weighted).
7. **Leaderboard climbs.** On reveal, the host's Standings bar-race animates — the faster-correct student should sit higher.
8. **Advance through the rest.** Teacher → **Next** for each remaining question, repeating reveal. On the last question the button reads **Finish**.
9. **Podium + persistence.** Teacher sees "Final Standings." Each student sees "That's a wrap!" with their final score — and their result is written through the normal Trial pipeline (`record_trial_result`), idempotently.
10. **Verify the grade persisted.** Teacher browser → `/classroom/74c90a17-b138-45fc-b082-53d44497be9c/progress` (or the student's own progress view). The live-quiz result should show up as Wisdom earned exactly like a Trial — no duplicate `quiz_results` row.
11. **Banner clears.** Re-open the class page as either student — the live banner is gone now that the session ended.
## Student badge login (email-free, scan-to-enter)

Students never type, see, or get asked for an email. A teacher provisions each
student a `XXXX-XXXX` class code and a printable "Ex Libris" bookplate badge
whose QR scans that same student in. Typed code and scanned badge hit the exact
same server check — the badge is a convenience, the typed code is always the
fallback.

1. **Teacher provisions a student.** Teacher browser → class → **Manage** → **Badges** tab → type a first name (e.g. `Beatrice C.`) → **Add student**. A `XXXX-XXXX` code is minted and shown. No email is ever requested.
2. **Teacher prints badges.** Same tab → **Print all badges** (or the printer icon on one row) → the bookplate sheet opens (2-up on US Letter, dashed cut lines). Each card shows the child's name, the class, a QR, and the typed code. **Print.** Reprinting mints fresh codes, so any earlier printout stops scanning.
3. **Student types the code.** Student browser → `/student-login` → type the code → **Let's go**. Lands on the student dashboard. No email, no password.
4. **Student scans the badge (camera).** `/student-login` → **Scan your badge instead** → allow the camera → point at the QR. On a phone/Chromebook/Android/Edge it enters instantly. On Safari/iPad the scanner shows a clear "type your code instead" message (camera QR isn't supported there yet).
5. **Student scans the badge (wedge/USB scanner).** With the login field focused, scan the badge with a hardware barcode scanner. It types the badge payload + Enter and signs the student in — same path as the camera.
6. **Teacher revokes a badge.** Badges tab → the revoke (⊘) button on a student. Toast: "Badge revoked. The typed code still works." The QR now fails safe (scans do nothing) while the typed code keeps working until rotated.
7. **Rate limiting.** Repeated bad codes/scans are throttled server-side (shared `login_attempts` ledger, keyed on the 4-char prefix). A valid entry after the window recovers normally. Codes and tokens are never logged.

Verified end-to-end at the DB layer (rolled-back, net-zero simulation): typed
code → resolves the student; scanned badge (hashed token) → resolves the same
student; after **revoke** the badge lookup returns nothing while the typed code
still resolves.

## What to report back

Go through the steps in order (11 for the core loop, 11 for the live quiz). For
each, note: **works**, **broken** (what you saw vs. expected), or **confusing**.
That numbered list becomes the punch list for the next phase.

## Asset load/save reliability checks (today/asset-loadsave-reliability)

Run these after the 11 steps to confirm assets save authoritatively, load
truthfully, and covers never break. Each maps to a fix in Phases 1–3
(see `docs/ASSET-AUDIT.md` → REMEDIATION LOG).

**Saves (Phase 1) — the write must land or say why:**

- **A1. Teacher quiz draft survives a reload.** Teacher browser → quiz builder →
  create/edit a quiz, add a question, save. Reload the page. The question is
  still there (write goes through the `saveTeacherQuiz` server action, which
  inserts the new rows *before* deleting the old — no lossy delete-then-fail).
- **A2. Announcement post confirms or errors — never silently no-ops.** Teacher →
  post a class announcement. On success a toast fires and it appears in the
  feed; on failure you get an error toast, not a cleared form that pretends it
  worked.
- **A3. Student answers / reading position persist.** Student browser → answer a
  trial question and advance a chapter, then reload. Progress is retained.

**Loads (Phase 2) — a failed fetch shows an error + retry, never a fake-empty:**

- **A4. Roster / classroom lists.** Teacher → open a classroom. The roster,
  activity feed, and stat cards render real data. If a query fails (kill the
  network briefly and click retry), you see "Couldn't load…" + a **Try again**
  button — NOT an empty roster or a reassuring "0 students / all on track" lie.
- **A5. Dashboard cards don't invent zeros.** Teacher dashboard → the stat cards
  show real counts, or `—` on error — never a fabricated `0`.
- **A6. Auth-settled.** Hard-refresh any teacher surface. Lists must not flash
  "empty / signed-out" while auth resolves; they wait for `authLoading` to
  settle before deciding a null user means signed-out.

**Covers (Phase 3) — every tile renders, zero failed image requests:**

- **A7. Library covers.** Open `/library/browse`. Every book shows a cover
  (procedural gradient + tradition motif). Open DevTools → Network, filter
  `assets` — there must be **no** 404 for `/living-archive/assets/**` or
  `/covers/tome/generated/images/**`. This is asserted automatically by
  `e2e/asset-reliability.spec.ts` (Playwright; dev server on :3000).

## Reseeding / teardown

- **Reset to clean state:** `npx tsx scripts/seed-test-walkthrough.ts` (idempotent — safe to re-run any time).
- **Remove all walkthrough accounts + data:** `npx tsx scripts/teardown-test-walkthrough.ts`.
- Both require `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. The service-role key is never printed.
