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

Go through the 11 steps in order. For each, note: **works**, **broken**
(what you saw vs. expected), or **confusing**. That numbered list becomes the
punch list for the next phase.

## Reseeding / teardown

- **Reset to clean state:** `npx tsx scripts/seed-test-walkthrough.ts` (idempotent — safe to re-run any time).
- **Remove all walkthrough accounts + data:** `npx tsx scripts/teardown-test-walkthrough.ts`.
- Both require `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. The service-role key is never printed.
