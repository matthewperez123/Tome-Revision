-- Notifications: shared infrastructure the rest of the app emits into.
-- Privacy-first / deny-by-default RLS: recipients can read and mark-read only
-- their own rows; clients can NEVER insert. All emits flow through the
-- SECURITY DEFINER create_notification() (called by the server-side notify()
-- helper in src/lib/actions/_shared.ts).
--
-- Applied out-of-band to project vjaezrcuuzmbmnsfrtwt via Supabase MCP
-- (apply_migration name=notifications). This file is the repo-of-record copy.

create type public.notification_type as enum (
  'friend_request',
  'friend_accepted',
  'group_invite',
  'group_post',
  'class_assignment',
  'assignment_graded',
  'parent_link_request',
  'session_summary',
  'peer_review',
  'book_recommendation',
  'system'
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references auth.users (id) on delete cascade,
  actor_id uuid references auth.users (id) on delete set null,
  type public.notification_type not null,
  entity_type text,
  entity_id text,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Unread badge / inbox query paths.
create index notifications_recipient_unread_idx
  on public.notifications (recipient_id)
  where read_at is null;

create index notifications_recipient_created_idx
  on public.notifications (recipient_id, created_at desc);

alter table public.notifications enable row level security;

-- Recipients read only their own inbox.
create policy notifications_select_own
  on public.notifications
  for select
  to authenticated
  using (auth.uid() = recipient_id);

-- Recipients may mark their own rows read (column grant below limits to read_at).
create policy notifications_update_own
  on public.notifications
  for update
  to authenticated
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);

-- Deny-by-default: no client INSERT/DELETE; reads gated by the policy above;
-- updates limited to the read_at column only.
revoke all on table public.notifications from anon, authenticated;
grant select on table public.notifications to authenticated;
grant update (read_at) on table public.notifications to authenticated;

-- The only sanctioned write path. SECURITY DEFINER so server/service callers
-- can fan a notification out to any recipient without a client INSERT grant.
create or replace function public.create_notification(
  p_recipient uuid,
  p_type public.notification_type,
  p_actor uuid default null,
  p_entity_type text default null,
  p_entity_id text default null,
  p_payload jsonb default '{}'::jsonb
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  insert into public.notifications
    (recipient_id, actor_id, type, entity_type, entity_id, payload)
  values
    (p_recipient, p_actor, p_type, p_entity_type, p_entity_id, coalesce(p_payload, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.create_notification(
  uuid, public.notification_type, uuid, text, text, jsonb
) from public;
grant execute on function public.create_notification(
  uuid, public.notification_type, uuid, text, text, jsonb
) to authenticated, service_role;

-- Live unread badge: subscribers get postgres_changes for their own rows
-- (RLS still gates which rows reach each client).
alter publication supabase_realtime add table public.notifications;

-- Supersede the empty legacy table this replaces.
drop table if exists public.db_notifications;
