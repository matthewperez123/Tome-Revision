-- Questions Available: metered AI question generation (launch brief 2.6).
-- Pools hold a balance per teacher (personal, classroom_id null) or per
-- classroom; every change is ledgered. Writes happen ONLY through the
-- SECURITY DEFINER RPCs below — no insert/update/delete policies exist.

create table public.question_credit_pools (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,        -- the teacher (or school admin)
  classroom_id uuid null references public.classrooms(id) on delete cascade, -- null = personal pool
  balance integer not null default 0 check (balance >= 0),
  monthly_grant integer not null default 0,
  accrual_cap integer not null default 0,
  last_grant_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- nulls-not-distinct so a teacher has at most ONE personal pool.
  unique nulls not distinct (owner_id, classroom_id)
);

create table public.question_credit_ledger (
  id uuid primary key default gen_random_uuid(),
  pool_id uuid not null references public.question_credit_pools(id) on delete cascade,
  delta integer not null,
  reason text not null check (reason in ('monthly_grant','seat_grant','topup','generate','refund','admin','free_tier')),
  quiz_id uuid null references public.teacher_quizzes(id) on delete set null,
  platform_quiz_id uuid null references public.quizzes(id) on delete set null,
  assignment_id uuid null references public.assignments(id) on delete set null,
  stripe_event_id text null unique,
  actor_id uuid null,
  created_at timestamptz not null default now()
);

create index question_credit_ledger_pool_created_idx
  on public.question_credit_ledger (pool_id, created_at desc);

alter table public.question_credit_pools enable row level security;
alter table public.question_credit_ledger enable row level security;

create policy "staff read pools" on public.question_credit_pools
  for select to authenticated
  using (
    owner_id = auth.uid()
    or (
      classroom_id is not null
      and public.user_has_classroom_role(auth.uid(), classroom_id, array['owner','co_teacher'])
    )
  );

create policy "owner reads ledger" on public.question_credit_ledger
  for select to authenticated
  using (
    exists (
      select 1 from public.question_credit_pools p
      where p.id = pool_id and p.owner_id = auth.uid()
    )
  );

-- ── RPCs (the only write paths) ─────────────────────────────────────────────

-- Spend credits. Callable by the pool owner / classroom staff (authenticated)
-- or by the trusted server (service_role, auth.uid() is null).
create or replace function public.consume_question_credits(
  p_pool uuid,
  p_count integer,
  p_reason text default 'generate',
  p_ref jsonb default '{}'::jsonb
) returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  v_pool public.question_credit_pools%rowtype;
  v_uid uuid := auth.uid();
begin
  if p_count is null or p_count <= 0 then
    raise exception 'invalid_count';
  end if;

  select * into v_pool
  from public.question_credit_pools
  where id = p_pool
  for update;
  if not found then
    raise exception 'pool_not_found';
  end if;

  -- service_role callers have no uid; authenticated callers must own or
  -- co-teach the pool.
  if v_uid is not null then
    if v_pool.owner_id <> v_uid
      and not (
        v_pool.classroom_id is not null
        and public.user_has_classroom_role(v_uid, v_pool.classroom_id, array['owner','co_teacher'])
      )
    then
      raise exception 'not_pool_owner';
    end if;
  end if;

  if v_pool.balance < p_count then
    raise exception 'insufficient_questions';
  end if;

  update public.question_credit_pools
  set balance = balance - p_count, updated_at = now()
  where id = p_pool;

  insert into public.question_credit_ledger
    (pool_id, delta, reason, quiz_id, platform_quiz_id, assignment_id, actor_id)
  values (
    p_pool,
    -p_count,
    p_reason,
    nullif(p_ref->>'quiz_id', '')::uuid,
    nullif(p_ref->>'platform_quiz_id', '')::uuid,
    nullif(p_ref->>'assignment_id', '')::uuid,
    coalesce(nullif(p_ref->>'actor_id', '')::uuid, v_uid)
  );

  return v_pool.balance - p_count;
end;
$$;

-- Return credits after a failed generation. Server-only.
create or replace function public.refund_question_credits(
  p_pool uuid,
  p_count integer,
  p_ref jsonb default '{}'::jsonb
) returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  v_balance integer;
begin
  if p_count is null or p_count <= 0 then
    raise exception 'invalid_count';
  end if;

  update public.question_credit_pools
  set balance = balance + p_count, updated_at = now()
  where id = p_pool
  returning balance into v_balance;
  if v_balance is null then
    raise exception 'pool_not_found';
  end if;

  insert into public.question_credit_ledger
    (pool_id, delta, reason, quiz_id, platform_quiz_id, assignment_id, actor_id)
  values (
    p_pool,
    p_count,
    'refund',
    nullif(p_ref->>'quiz_id', '')::uuid,
    nullif(p_ref->>'platform_quiz_id', '')::uuid,
    nullif(p_ref->>'assignment_id', '')::uuid,
    nullif(p_ref->>'actor_id', '')::uuid
  );

  return v_balance;
end;
$$;

-- Add credits (monthly/seat grants, top-ups, admin adjustments). Idempotent on
-- p_stripe_event_id: a repeated Stripe event is a no-op. Server-only.
create or replace function public.grant_question_credits(
  p_pool uuid,
  p_count integer,
  p_reason text,
  p_stripe_event_id text default null
) returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  v_balance integer;
begin
  if p_count is null or p_count <= 0 then
    raise exception 'invalid_count';
  end if;

  if p_stripe_event_id is not null and exists (
    select 1 from public.question_credit_ledger
    where stripe_event_id = p_stripe_event_id
  ) then
    select balance into v_balance from public.question_credit_pools where id = p_pool;
    return coalesce(v_balance, 0);
  end if;

  update public.question_credit_pools
  set balance = balance + p_count, updated_at = now()
  where id = p_pool
  returning balance into v_balance;
  if v_balance is null then
    raise exception 'pool_not_found';
  end if;

  insert into public.question_credit_ledger (pool_id, delta, reason, stripe_event_id)
  values (p_pool, p_count, p_reason, p_stripe_event_id);

  return v_balance;
end;
$$;

-- Find-or-create a pool for (owner, classroom). Server-only.
create or replace function public.ensure_question_pool(
  p_owner uuid,
  p_classroom uuid default null
) returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_id uuid;
begin
  insert into public.question_credit_pools (owner_id, classroom_id)
  values (p_owner, p_classroom)
  on conflict (owner_id, classroom_id) do update set updated_at = now()
  returning id into v_id;
  return v_id;
end;
$$;

-- Monthly accrual: pools 30+ days past their last grant gain monthly_grant,
-- capped at accrual_cap (never clawing back an above-cap top-up balance).
-- Returns the number of pools granted. Cron/server-only.
create or replace function public.refresh_question_grants()
returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  v_count integer := 0;
  r record;
  v_new integer;
begin
  for r in
    select id, balance, monthly_grant, accrual_cap
    from public.question_credit_pools
    where monthly_grant > 0
      and now() - last_grant_at >= interval '30 days'
    for update
  loop
    v_new := greatest(r.balance, least(r.balance + r.monthly_grant, r.accrual_cap));
    if v_new > r.balance then
      update public.question_credit_pools
      set balance = v_new, last_grant_at = now(), updated_at = now()
      where id = r.id;
      insert into public.question_credit_ledger (pool_id, delta, reason)
      values (r.id, v_new - r.balance, 'monthly_grant');
      v_count := v_count + 1;
    else
      -- At cap: still advance the clock so the pool isn't rescanned daily.
      update public.question_credit_pools
      set last_grant_at = now(), updated_at = now()
      where id = r.id;
    end if;
  end loop;
  return v_count;
end;
$$;

-- ── Execution grants ────────────────────────────────────────────────────────

revoke all on function public.consume_question_credits(uuid, integer, text, jsonb) from public, anon;
grant execute on function public.consume_question_credits(uuid, integer, text, jsonb) to authenticated, service_role;

revoke all on function public.refund_question_credits(uuid, integer, jsonb) from public, anon, authenticated;
grant execute on function public.refund_question_credits(uuid, integer, jsonb) to service_role;

revoke all on function public.grant_question_credits(uuid, integer, text, text) from public, anon, authenticated;
grant execute on function public.grant_question_credits(uuid, integer, text, text) to service_role;

revoke all on function public.ensure_question_pool(uuid, uuid) from public, anon, authenticated;
grant execute on function public.ensure_question_pool(uuid, uuid) to service_role;

revoke all on function public.refresh_question_grants() from public, anon, authenticated;
grant execute on function public.refresh_question_grants() to service_role;
