-- Launch-week billing: the 'classroom' tier (per-student seats) is now sold via
-- checkout/webhook, but subscriptions_tier_check (20260709000000) only allowed
-- solo/family/school — any classroom checkout would fail the webhook write.
-- Widen the check. 'solo' stays for grandfathered rows only.

alter table public.subscriptions drop constraint if exists subscriptions_tier_check;

alter table public.subscriptions
  add constraint subscriptions_tier_check
  check (tier in ('solo', 'family', 'classroom', 'school'));
