# Student Login Audit — Phase 0 (read-only)

Branch: `today/student-badge-login` (off `origin/main` @ `a681f033`)
Scope: audit the COPPA code-only student login, hunt email leaks, recommend a badge
architecture. **No code changed. No migration applied.** This document + a stop for
your decision is the whole of Phase 0.

---

## HEADLINE (read this first)

**The COPPA code-only student login is NOT implemented in the application.** Only the
database tables exist. There is no student login screen, no verification server action,
no synthetic-email session creation, and nothing reads or writes `student_access_codes`
or `login_attempts`. **Every student today signs in with an email and a password, exactly
like a teacher.**

So "audit and harden the guarantee" is, in reality, **"build the guarantee."** That is a
bigger job than the brief implies, and it changes what Phase 1 means. I stopped here as
instructed so you can decide the scope before I write any code.

---

## 1. THE MAP — how student login actually works today

| Piece | Reality on `main` | File |
|---|---|---|
| Login screen | **Generic email + password.** Mail icon, `type="email"`, "Forgot your password?", "Sign up" link. This is the only login students have. | `src/app/(standalone)/login/page.tsx` |
| Signup | Email + password self-signup (`supabase.auth.signUp`, `type="email"`). | `src/app/(standalone)/signup/page.tsx` |
| Student provisioning | Teacher types **student email addresses** into an invite box (placeholder `student@school.edu`) → `inviteToClassroom({ emails, role:"student" })` emails each a `/join?code=` link. Comment claims "COPPA-safe" but it is fully email-based. | `src/components/classroom/classroom-roster-panel.tsx`, `src/lib/actions/classrooms.ts:258` |
| Join flow | `/join?code=` → `/classroom/join` → `joinClassroomByCode(code)`. **Requires an already-authenticated user** (`requireUser()`), i.e. the student must already have an email/password account. | `src/lib/actions/classrooms.ts:151`, `src/app/(app)/join/page.tsx` |
| Synthetic-email session | **Does not exist.** `admin.auth.admin` is only ever used for `listUsers` / `getUserById` / `deleteUser` / `updateUserById` — never `createUser`. No synthetic emails are minted anywhere. | (grep: no `createUser`) |
| Access-code verification | **Does not exist.** No code reads `student_access_codes`. | (grep: 0 `src` hits) |
| Rate limiting | **Not wired.** `login_attempts` has 0 client policies (deny-all, service-role only) but nothing writes to it. | migration only |
| Middleware / proxy gate | Deny-by-default, BUT the `!user` branch only redirects `/read/*` to `/login`; everything else falls through to demo mode. So a logged-out visitor **can already reach** a new `/student-login` route — no allowlist entry is required for reachability. `/login` + `/signup` get a bonus "redirect already-authed users to dashboard" treatment. | `src/proxy.ts:124` |

### The tables that exist but nothing uses
`supabase/migrations/20260716000000_virgil_loop_linkage_and_student_codes.sql`:

- `student_access_codes (user_id PK → auth.users, classroom_id, display_name "First L.",
  code text UNIQUE, code_prefix generated left(code,4), active, created_by, created_at,
  rotated_at)`. RLS: teacher manages own-classroom rows via
  `user_has_classroom_role(uid, classroom_id, ['owner','co_teacher'])`; student reads own row.
- `login_attempts (id, code_prefix, ip, attempted_at)`. RLS on, **zero policies** = deny-all
  to clients; only the service role touches it.

**`code` is stored in PLAINTEXT** (a unique `text` column, not hashed). See finding L7.

---

## 2. EMAIL LEAK INVENTORY (student-facing surfaces)

Because the code-only path is unbuilt, the "leaks" are really "the entire student path is
email." PASS = no email demanded/shown on a student path. FAIL = email present.

| # | Surface | Verdict | Detail |
|---|---|---|---|
| L1 | `/login` page | **FAIL** | Email field, `type="email"`, "Email" placeholder, Mail icon, "Forgot your password?", "Sign up". The only student sign-in. `login/page.tsx:74-121` |
| L2 | `/signup` page | **FAIL** | Email + password self-signup. `signup/page.tsx:103` |
| L3 | Teacher invite box | **FAIL (provisioning)** | Requires a student **email** per student; placeholder `student@school.edu`; `.email()`-validated, min 1. `classroom-roster-panel.tsx:246-302`, `classrooms.ts:249` |
| L4 | `/account` page | **FAIL** | Renders `{user.email}` verbatim (line 69), "Send password reset **email**", an "Email notifications" section, and adult-recovery "Delete your account" copy. A signed-in student sees their synthetic email here. `account/page.tsx:68-88` |
| L5 | Join onboarding step | PASS (self) | Asks only for the class code — but presupposes the student already has an email account to be signed into. `step-join-class.tsx` |
| L6 | Error copy | **FAIL** | Login errors surface raw Supabase messages (`error.message`) and `"Your session has expired. Please sign in again."` — adult account-recovery language, not kid-appropriate. `login/page.tsx:32,45` |
| L7 | Code at rest | **WEAKNESS** | `student_access_codes.code` is **plaintext**. It functions like a password. (Tradeoff: the teacher must be able to display/print the code, so it is intentionally recoverable. The **badge token** below can and should be hashed instead.) |

Note on the Jul-4 demo restore / Next-16 proxy changes (brief asked specifically): neither
reopened an email path *for a code-only student* — because a code-only student path never
existed. The proxy's `!user` fallthrough is permissive (demo mode) but exposes no server
data (all reads are RLS-scoped). No regression; rather, an absence.

---

## 3. BADGE ARCHITECTURE — recommendation

**Recommended: Option B (opaque, hashed, independently rotatable token).** Reasons:

- A photographed badge dies with one click (revoke/rotate the token) **without** disturbing
  the typed code — so a kid who loses a badge still logs in by typing, and the class code
  set doesn't churn.
- The QR never carries the login code itself, so a leaked photo ≠ a leaked credential.
- Satisfies "store badge tokens hashed at rest": we store only the SHA-256 hash; the
  plaintext token exists solely on the printed QR.

Option A (QR encodes the typed `XXXX-XXXX` code) is rejected: one credential, so a
photographed badge *is* the student's code, and rotating it means reissuing the code the
kid also types — the churn we're trying to avoid.

### Drafted DDL for Option B — NOT APPLIED (assembled here for your review)

Minimal, additive, 1:1 with the existing per-student `student_access_codes` row (its PK is
`user_id`, so three columns beat a new table). No new RLS needed — the existing
"teacher manages own classroom codes" / "student reads own code row" policies already cover
the new columns.

```sql
begin;

-- Scan-to-enter badge token. The plaintext token lives ONLY on the printed QR;
-- we persist only its hash. NULL until a badge is issued.
alter table public.student_access_codes
  add column if not exists badge_token_hash text unique,   -- sha-256(token); scan hashes input, matches here
  add column if not exists badge_issued_at  timestamptz,
  add column if not exists badge_revoked_at timestamptz;    -- set on revoke; a revoked badge fails even if the hash matches

commit;
```

**Verification path (Phase 3):** the same server action that verifies a typed code also
accepts a scanned token → hash it → `where badge_token_hash = $1 and active
and badge_revoked_at is null` → issue the session. One path, `login_attempts`-rate-limited,
never logs the token.

**Rotation / revoke:** rotate = generate a fresh token, overwrite `badge_token_hash` +
`badge_issued_at`, clear `badge_revoked_at`, reprint. Revoke = set `badge_revoked_at = now()`.

**Design implication you should know:** because we store only the hash, **reprinting a badge
requires rotating it** (we can't re-render a token we didn't keep). That's more secure (an
old printout can never silently keep working) but means "reprint" and "rotate" are the same
button. Tell me if you'd rather store the token reversibly (encrypted) so a badge can be
reprinted without invalidating the old one — that trades a little security for reprint
convenience.

---

## 4. DECISIONS I NEED FROM YOU BEFORE PHASE 1

1. **Scope reality check.** The code-only student login doesn't exist — Phase 1 is *build*,
   not *fix*. Building it means: (a) a code-only student login screen, (b) a verification
   server action, and (c) **a way to create the student's synthetic-email auth user**
   (teacher-side provisioning). (c) is new server code that mints `auth.users` via the admin
   API. It doesn't modify the AuthProvider/auth-machine fence (it's a server action), but
   it IS more than "harden." Do you want me to build the whole code-only path, or a subset?
2. **Badge option:** A or B? (I recommend **B**.)
3. **Reprint vs. rotate:** hashed-only (reprint = rotate, more secure) or reversible
   (reprint keeps old badge alive)? (I recommend **hashed-only**.)
4. **Plaintext `code` weakness (L7):** leave as-is (needed so the teacher can print it) or
   revisit? (I recommend **leave as-is**; the badge token carries the hashing burden.)
5. **Proxy allowlist:** not required for reachability (demo fallthrough already lets logged-out
   visitors in). Do you still want `/student-login` added to `PUBLIC_ROUTES` so an
   already-signed-in student is bounced to the dashboard instead of seeing the form? (Small,
   one-line diff — I'll show it before applying.)

**Waiting on your answers. No further code until you pick.**
