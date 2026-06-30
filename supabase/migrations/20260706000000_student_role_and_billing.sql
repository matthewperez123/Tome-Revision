-- Add 'student' as a third profile role + Stripe billing infrastructure.
-- Applied to the live project (vjaezrcuuzmbmnsfrtwt) out-of-band via MCP; tracked here for parity.

-- 1. Widen profiles.role to allow 'student'.
--    This also lights up the previously-dormant is_student() gating in the
--    community feed (public activities downgrade to friends for students).
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('reader','teacher','student'));

-- 2. Billing customer mapping on profiles.
alter table public.profiles add column if not exists stripe_customer_id text;

-- 3. Subscriptions table (Stripe-synced; service-role write only via the webhook).
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  tier text check (tier in ('solo','family')),
  status text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

-- Owner can read their own subscription; no client writes (webhook uses service role).
drop policy if exists subscriptions_select_own on public.subscriptions;
create policy subscriptions_select_own on public.subscriptions
  for select to authenticated
  using (auth.uid() = user_id);

revoke all on public.subscriptions from authenticated, anon;
grant select on public.subscriptions to authenticated;
