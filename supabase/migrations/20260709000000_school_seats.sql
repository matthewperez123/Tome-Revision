-- School plan: seat-based (per-teacher) subscription billing.
--
-- The canonical `public.subscriptions` row (one per purchasing account) is
-- reused as-is for the School subscription — we only widen its tier check and
-- record the Stripe quantity as `seats`. Which teacher accounts a School
-- subscription pays for is recorded in the new `school_seats` table.
--
-- This deliberately does NOT introduce a parallel org/school entity. A covered
-- teacher stays an ordinary `profiles.role='teacher'` account that owns
-- classrooms exactly as before; `school_seats` only maps seats -> teachers so
-- entitlement can be resolved and an admin can add/remove seats.
--
-- Applied to the live project (vjaezrcuuzmbmnsfrtwt) out-of-band via MCP;
-- tracked here for parity.

begin;

-- 1. Allow the 'school' tier and record the seat count (Stripe quantity).
alter table public.subscriptions drop constraint if exists subscriptions_tier_check;
alter table public.subscriptions
  add constraint subscriptions_tier_check check (tier in ('solo', 'family', 'school'));
alter table public.subscriptions add column if not exists seats integer;

-- 2. school_seats — the seat roster for a School subscription.
--    subscription_user_id = the purchasing admin's subscriptions.user_id.
--    A teacher occupies at most one school seat (global unique on teacher_id).
create table if not exists public.school_seats (
  id uuid primary key default gen_random_uuid(),
  subscription_user_id uuid not null
    references public.subscriptions(user_id) on delete cascade,
  teacher_id uuid not null references auth.users(id) on delete cascade,
  seat_role text not null default 'teacher' check (seat_role in ('admin', 'teacher')),
  added_at timestamptz not null default now(),
  unique (subscription_user_id, teacher_id),
  unique (teacher_id)
);
create index if not exists school_seats_subscription_idx
  on public.school_seats (subscription_user_id);

-- SECURITY DEFINER membership probe — avoids RLS recursion when a policy on
-- school_seats needs to consult school_seats. `set search_path = ''` per the
-- repo convention for definer functions.
create or replace function public.is_school_member(
  p_user uuid,
  p_subscription_user uuid
) returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.school_seats
    where subscription_user_id = p_subscription_user
      and teacher_id = p_user
  );
$$;

alter table public.school_seats enable row level security;

-- Deny-by-default: a school's members (admin + covered teachers) may read the
-- roster. No client writes — the Stripe checkout/webhook and the admin server
-- actions all use the service role.
revoke all on public.school_seats from anon, authenticated;
grant select on public.school_seats to authenticated;

drop policy if exists school_seats_select on public.school_seats;
create policy school_seats_select on public.school_seats
  for select to authenticated
  using (
    teacher_id = auth.uid()
    or public.is_school_member(auth.uid(), subscription_user_id)
  );

commit;
