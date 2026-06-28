-- Tome Luminous Minimal Modernism Cover Factory v1
-- Reversible intent: all objects are namespaced with cover_* and can be
-- dropped in reverse dependency order if the feature is rolled back.

create table if not exists public.cover_style_presets (
  id text primary key,
  version text not null unique,
  name text not null,
  description text not null,
  palette_tokens jsonb not null default '{}'::jsonb,
  composition_library jsonb not null default '{}'::jsonb,
  prompt_version text not null,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cover_reference_assets (
  id text primary key,
  style_version text not null references public.cover_style_presets(version) on update cascade,
  source_filename text not null,
  source_type text not null check (source_type in ('contact-sheet', 'contact-sheet-crop', 'anchor')),
  original_path text not null,
  crop_path text,
  crop_coordinates jsonb,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  sha256 text not null,
  perceptual_hash text not null,
  dominant_colors text[] not null default '{}',
  palette_family text not null,
  composition_family text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.cover_batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'draft' check (status in (
    'draft','brief_pending','brief_ready','approved_for_generation','queued','claimed','generating',
    'processing','candidates_ready','auto_reviewed','needs_review','approved','rejected','composing',
    'ready_to_publish','published','paused','cancelled','retry_scheduled','failed','dead_letter',
    'provider_unavailable','budget_paused'
  )),
  generation_mode text not null default 'production' check (generation_mode in ('concept','production','featured')),
  style_version text not null default 'tome-luminous-minimal-modernism-v1',
  prompt_version text not null default 'imagen-prompt.v2.1.0',
  book_count integer not null default 0,
  candidate_count integer not null default 2,
  estimated_image_count integer not null default 0,
  estimated_cost_usd numeric(10, 4) not null default 0,
  recorded_cost_usd numeric(10, 4) not null default 0,
  import_payload jsonb not null default '{}'::jsonb,
  diversity_stats jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cover_briefs (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.cover_batches(id) on delete cascade,
  book_id text not null,
  brief_version integer not null default 1,
  schema_version text not null,
  style_version text not null,
  prompt_version text not null,
  title text not null,
  subtitle text,
  author text not null,
  original_language text,
  synopsis text,
  genre text,
  subgenre text,
  historical_era text,
  geographical_setting text,
  themes text[] not null default '{}',
  emotional_tone text[] not null default '{}',
  central_conflict text not null,
  philosophical_tension text,
  transformation text,
  principal_visual_metaphor text not null,
  hero_motif text not null,
  secondary_motifs text[] not null default '{}',
  composition_family text not null,
  composition_variant text not null,
  narrative_vector text not null,
  palette_mode text not null,
  texture_profile text not null,
  light_mode text not null,
  horizon_position text not null,
  negative_space_region text not null,
  figure_count integer not null default 0,
  title_safe_region text not null,
  crop_safety_instructions text not null,
  book_specific_avoid_list text[] not null default '{}',
  editor_overrides jsonb not null default '{}'::jsonb,
  locked_fields text[] not null default '{}',
  internal_rationale text not null,
  prompt_hash text,
  final_prompt text,
  prompt_token_estimate integer,
  status text not null default 'brief_ready',
  provenance jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(book_id, style_version, brief_version)
);

create table if not exists public.cover_jobs (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.cover_batches(id) on delete cascade,
  brief_id uuid references public.cover_briefs(id) on delete cascade,
  book_id text,
  brief_version integer not null default 1,
  style_version text not null,
  prompt_version text not null,
  provider text not null check (provider in ('google-imagen','mock-cover')),
  model_id text not null,
  request_mode text not null check (request_mode in ('concept','production','featured')),
  idempotency_key text not null unique,
  status text not null default 'queued',
  attempt_count integer not null default 0,
  max_attempts integer not null default 3,
  lease_owner text,
  lease_expires_at timestamptz,
  heartbeat_at timestamptz,
  provider_request_metadata jsonb not null default '{}'::jsonb,
  estimated_cost_usd numeric(10, 4) not null default 0,
  recorded_cost_usd numeric(10, 4),
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  last_error text,
  retry_at timestamptz
);

create table if not exists public.cover_candidates (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.cover_jobs(id) on delete cascade,
  brief_id uuid not null references public.cover_briefs(id) on delete cascade,
  candidate_index integer not null,
  provider text not null,
  model_id text not null,
  prompt_hash text not null,
  source_asset_id uuid,
  master_asset_id uuid,
  qa_status text not null default 'pending',
  review_state text not null default 'unreviewed',
  duplicate_warning boolean not null default false,
  provider_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(job_id, candidate_index)
);

create table if not exists public.cover_assets (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.cover_candidates(id) on delete cascade,
  book_id text not null,
  brief_version integer not null,
  derivative_type text not null,
  object_path text not null unique,
  source_provider text not null,
  imagen_model_id text,
  prompt_hash text,
  source_dimensions jsonb,
  crop_rectangle jsonb,
  output_dimensions jsonb not null,
  mime_type text not null,
  file_size_bytes bigint not null check (file_size_bytes >= 0),
  sha256 text not null,
  perceptual_hash text,
  parent_asset_id uuid references public.cover_assets(id) on delete set null,
  approval_status text not null default 'unreviewed',
  publication_status text not null default 'unpublished',
  created_at timestamptz not null default now()
);

alter table public.cover_candidates
  add constraint cover_candidates_source_asset_fk foreign key (source_asset_id) references public.cover_assets(id) on delete set null;

alter table public.cover_candidates
  add constraint cover_candidates_master_asset_fk foreign key (master_asset_id) references public.cover_assets(id) on delete set null;

create table if not exists public.cover_qa_results (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.cover_candidates(id) on delete cascade,
  structural jsonb not null default '{}'::jsonb,
  typography jsonb not null default '{}'::jsonb,
  crop_safety jsonb not null default '{}'::jsonb,
  palette jsonb not null default '{}'::jsonb,
  composition jsonb not null default '{}'::jsonb,
  thumbnail jsonb not null default '{}'::jsonb,
  style jsonb not null default '{}'::jsonb,
  duplicate jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.cover_reviews (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.cover_candidates(id) on delete cascade,
  reviewer_id uuid references public.profiles(id) on delete set null,
  review_state text not null check (review_state in ('approved','rejected','changes_requested')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.cover_publications (
  id uuid primary key default gen_random_uuid(),
  book_id text,
  candidate_id uuid not null references public.cover_candidates(id) on delete restrict,
  asset_id uuid references public.cover_assets(id) on delete restrict,
  publication_state text not null default 'published' check (publication_state in ('published','superseded','rolled_back','unpublished')),
  version integer not null check (version > 0),
  supersedes_publication_id uuid references public.cover_publications(id) on delete set null,
  published_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz not null default now(),
  unique(book_id, version)
);

create table if not exists public.cover_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists cover_jobs_claim_idx on public.cover_jobs (status, retry_at, lease_expires_at, created_at);
create index if not exists cover_jobs_batch_idx on public.cover_jobs (batch_id, status);
create index if not exists cover_briefs_batch_idx on public.cover_briefs (batch_id, status);
create index if not exists cover_candidates_brief_idx on public.cover_candidates (brief_id, review_state);
create index if not exists cover_publications_book_idx on public.cover_publications (book_id, publication_state);

create or replace function public.claim_cover_jobs(
  p_worker text,
  p_limit integer default 1,
  p_lease_seconds integer default 300
)
returns setof public.cover_jobs
language sql
as $$
  with candidates as (
    select id
    from public.cover_jobs
    where (
      status = 'queued'
      or (status = 'retry_scheduled' and coalesce(retry_at, now()) <= now())
      or (status = 'claimed' and lease_expires_at <= now())
    )
    order by created_at
    for update skip locked
    limit greatest(1, p_limit)
  )
  update public.cover_jobs jobs
  set status = 'claimed',
      lease_owner = p_worker,
      lease_expires_at = now() + make_interval(secs => p_lease_seconds),
      heartbeat_at = now(),
      started_at = coalesce(started_at, now())
  from candidates
  where jobs.id = candidates.id
  returning jobs.*;
$$;

alter table public.cover_style_presets enable row level security;
alter table public.cover_reference_assets enable row level security;
alter table public.cover_batches enable row level security;
alter table public.cover_briefs enable row level security;
alter table public.cover_jobs enable row level security;
alter table public.cover_candidates enable row level security;
alter table public.cover_assets enable row level security;
alter table public.cover_qa_results enable row level security;
alter table public.cover_reviews enable row level security;
alter table public.cover_publications enable row level security;
alter table public.cover_audit_events enable row level security;

create policy cover_service_all_presets on public.cover_style_presets for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy cover_service_all_refs on public.cover_reference_assets for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy cover_service_all_batches on public.cover_batches for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy cover_service_all_briefs on public.cover_briefs for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy cover_service_all_jobs on public.cover_jobs for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy cover_service_all_candidates on public.cover_candidates for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy cover_service_all_assets on public.cover_assets for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy cover_service_all_qa on public.cover_qa_results for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy cover_service_all_reviews on public.cover_reviews for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy cover_service_all_publications on public.cover_publications for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy cover_service_all_audit on public.cover_audit_events for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy cover_teacher_read_batches on public.cover_batches
  for select using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'teacher'));
create policy cover_teacher_read_briefs on public.cover_briefs
  for select using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'teacher'));
create policy cover_teacher_read_candidates on public.cover_candidates
  for select using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'teacher'));
create policy cover_teacher_read_assets on public.cover_assets
  for select using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'teacher'));
create policy cover_teacher_read_qa on public.cover_qa_results
  for select using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'teacher'));
create policy cover_teacher_read_publications on public.cover_publications
  for select using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'teacher'));

insert into public.cover_style_presets (id, version, name, description, prompt_version, active)
values (
  'tome-luminous-minimal-modernism-v1',
  'tome-luminous-minimal-modernism-v1',
  'Tome Luminous Minimal Modernism',
  'Light-first literary cover grammar for Google Imagen-only production art and deterministic Tome typography.',
  'imagen-prompt.v2.1.0',
  true
)
on conflict (id) do update set
  active = excluded.active,
  description = excluded.description,
  updated_at = now();
