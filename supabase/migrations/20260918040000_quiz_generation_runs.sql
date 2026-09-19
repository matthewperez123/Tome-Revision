-- [3.6] Ledger for the platform quiz type-ladder rebalance.
--
-- scripts/quizzes/rebalance-types.ts records one row per (book, difficulty)
-- generation attempt so runs are resumable and failures are auditable.
-- Service-role only: clients never read or write this operational ledger.

create table if not exists public.quiz_generation_runs (
  id uuid primary key default gen_random_uuid(),
  book_id text not null references public.books(id) on delete cascade,
  difficulty text not null check (difficulty in ('Apprentice', 'Scholar', 'Master')),
  status text not null check (status in ('success', 'error', 'skipped')),
  model text not null,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists quiz_generation_runs_book_idx
  on public.quiz_generation_runs (book_id, difficulty, created_at desc);

alter table public.quiz_generation_runs enable row level security;

-- Deny-by-default: no policies. Only the service role touches this table.
revoke all on public.quiz_generation_runs from anon, authenticated;
