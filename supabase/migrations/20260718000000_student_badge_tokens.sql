-- Student badge tokens — scan-to-enter (Option B)
--
-- Plain-English summary of every line below:
--   * We add three columns to the EXISTING student_access_codes table (one row
--     per student). No new table, no new RLS — the table's existing policies
--     ("teacher manages own classroom codes" via user_has_classroom_role, and
--     "student reads own code row") already govern these columns.
--   * badge_token_hash: the SHA-256 hash of the opaque token printed on the QR.
--     We NEVER store the token itself, so a leaked database can't reproduce a
--     working badge, and nothing logs the token. NULL until a badge is issued.
--     UNIQUE so a scanned hash maps to at most one student.
--   * badge_issued_at: when the current badge was minted (for display/print).
--   * badge_revoked_at: set when a badge is revoked; a scan is rejected whenever
--     this is non-null, so a photographed/lost badge dies with one click even if
--     the hash still matches.
--
-- Rotation overwrites badge_token_hash + badge_issued_at and clears
-- badge_revoked_at. Revocation sets badge_revoked_at = now(). Because only the
-- hash is stored, reprinting a badge requires rotating it (an old printout can
-- never silently keep working).
--
-- Additive only. Existing rows get NULLs (no badge yet) — safe.

begin;

alter table public.student_access_codes
  add column if not exists badge_token_hash text unique,
  add column if not exists badge_issued_at  timestamptz,
  add column if not exists badge_revoked_at timestamptz;

commit;
