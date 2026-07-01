-- Stripe webhook idempotency ledger.
-- The webhook claims each event by id BEFORE processing; a replayed/duplicate
-- event id is a no-op. Service-role write only (the webhook); no client access.
-- Applied to the live project (vjaezrcuuzmbmnsfrtwt) out-of-band via MCP.

create table if not exists public.stripe_events (
  id text primary key,                 -- Stripe event id (evt_…)
  type text not null,                  -- e.g. customer.subscription.updated
  received_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;

-- Deny-by-default: no SELECT/INSERT/UPDATE/DELETE policies for anon/authenticated.
-- Only the service role (which bypasses RLS) reads/writes this table.
revoke all on public.stripe_events from authenticated, anon;

-- ── DOWN (manual rollback) ───────────────────────────────────────────
-- drop table if exists public.stripe_events;
