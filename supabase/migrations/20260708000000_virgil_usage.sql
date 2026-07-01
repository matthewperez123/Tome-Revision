-- Virgil free-tier usage ledger + atomic daily-cap RPC.
--
-- Free accounts get a bounded number of Virgil messages per UTC day; paid plans
-- are unlimited (the server skips the check entirely). This table is the count;
-- the SECURITY DEFINER RPC is the only writer so the cap can't be bypassed by a
-- crafted client write.

create table if not exists public.virgil_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  usage_date date not null default (now() at time zone 'utc')::date,
  message_count integer not null default 0,
  primary key (user_id, usage_date)
);

alter table public.virgil_usage enable row level security;

-- Readers may read their own usage (e.g. a "messages left today" hint). All
-- writes go through consume_virgil_message() below — no client INSERT/UPDATE.
revoke all on public.virgil_usage from anon, authenticated;
grant select on public.virgil_usage to authenticated;

drop policy if exists virgil_usage_select_own on public.virgil_usage;
create policy virgil_usage_select_own on public.virgil_usage
  for select to authenticated
  using (user_id = auth.uid());

-- Count one Virgil message against today's allowance and report whether it is
-- permitted. Returns true when the running total (including this message) is
-- within p_daily_limit. Increments atomically so concurrent calls are safe.
create or replace function public.consume_virgil_message(p_daily_limit integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid   uuid    := auth.uid();
  v_today date    := (now() at time zone 'utc')::date;
  v_count integer;
begin
  if v_uid is null then
    return false;
  end if;

  insert into public.virgil_usage (user_id, usage_date, message_count)
  values (v_uid, v_today, 1)
  on conflict (user_id, usage_date)
  do update set message_count = public.virgil_usage.message_count + 1
  returning message_count into v_count;

  return v_count <= p_daily_limit;
end;
$$;

revoke all on function public.consume_virgil_message(integer) from public, anon;
grant execute on function public.consume_virgil_message(integer) to authenticated;

-- DOWN:
--   drop function if exists public.consume_virgil_message(integer);
--   drop table if exists public.virgil_usage;
