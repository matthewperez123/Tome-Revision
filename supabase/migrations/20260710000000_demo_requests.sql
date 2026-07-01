-- B2B demo / sales lead capture.
--
-- The /demo lead-capture form writes here. This is private sales data: only the
-- service role (server API route + admin tooling) may read or write it. There
-- are deliberately NO client policies — RLS is enabled with deny-by-default so
-- anon/authenticated cannot read, insert, update, or delete. The Next API route
-- uses the service-role client, which bypasses RLS.

begin;

create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- Contact + qualification fields from the form.
  name text not null,
  email text not null,
  organization text,
  role text,
  plan_interest text,
  student_count integer,
  teacher_count integer,
  message text,
  -- Triage state for the sales pipeline.
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  -- Audit / rate-limit metadata.
  ip text,
  user_agent text
);

create index if not exists demo_requests_created_at_idx
  on public.demo_requests (created_at desc);
create index if not exists demo_requests_ip_created_at_idx
  on public.demo_requests (ip, created_at desc);

alter table public.demo_requests enable row level security;

-- Deny-by-default: no grants, no policies. Service role bypasses RLS.
revoke all on public.demo_requests from anon, authenticated;

commit;
