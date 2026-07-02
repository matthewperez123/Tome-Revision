-- School seats: support unclaimed (pending) seats + email invitations.
--
-- The webhook now provisions a `school_seats` row for EVERY purchased seat at
-- checkout: seat #1 is the buying admin (active), the remainder are `pending`
-- placeholder rows the admin later fills by inviting a teacher. An invite
-- attaches an email + single-use token to a pending row; accepting it claims
-- the seat (sets teacher_id, flips to active).
--
-- teacher_id becomes nullable so a pending seat can exist before a teacher is
-- known. The existing unique constraints still hold: Postgres treats NULLs as
-- distinct, so many pending rows (teacher_id = null) can coexist while a claimed
-- teacher remains globally unique.
--
-- Applied to the live project (vjaezrcuuzmbmnsfrtwt) out-of-band via MCP;
-- tracked here for parity.

begin;

-- A seat may now be unclaimed → teacher_id nullable.
alter table public.school_seats alter column teacher_id drop not null;

-- Lifecycle + invitation columns.
alter table public.school_seats
  add column if not exists status text not null default 'active'
    check (status in ('active', 'pending'));
alter table public.school_seats add column if not exists invite_email text;
alter table public.school_seats add column if not exists invite_token text;
alter table public.school_seats add column if not exists invited_at timestamptz;

-- A claimed seat must carry a teacher; a pending seat must not.
alter table public.school_seats drop constraint if exists school_seats_status_teacher_check;
alter table public.school_seats
  add constraint school_seats_status_teacher_check check (
    (status = 'active' and teacher_id is not null)
    or (status = 'pending' and teacher_id is null)
  );

-- Single-use invite tokens are globally unique (nulls allowed/distinct).
create unique index if not exists school_seats_invite_token_key
  on public.school_seats (invite_token)
  where invite_token is not null;

commit;

-- ── DOWN (manual rollback) ───────────────────────────────────────────
-- drop index if exists public.school_seats_invite_token_key;
-- alter table public.school_seats drop constraint if exists school_seats_status_teacher_check;
-- alter table public.school_seats drop column if exists invited_at;
-- alter table public.school_seats drop column if exists invite_token;
-- alter table public.school_seats drop column if exists invite_email;
-- alter table public.school_seats drop column if exists status;
-- alter table public.school_seats alter column teacher_id set not null;
