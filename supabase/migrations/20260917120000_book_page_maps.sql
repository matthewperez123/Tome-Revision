-- Canonical whole-book page maps (codex spec §5.4).
--
-- One row per book: the folio map computed HEADLESS at the canonical default
-- typography (Literata 16px / 24px leading, justified, recto-open off,
-- spec_version 1) by scripts/reader/backfill-page-maps.ts via the
-- /reader-map harness. The live reader and the generator share one
-- measurement implementation (src/lib/reader/folio-map.ts), so stored maps
-- match what a reader at default settings sees.
--
-- chapter_pages[i]   = page count of chapter i (1-based arrays, Postgres style)
-- chapter_matter[i]  = 'front' | 'body' (front → roman folios; body → arabic
--                      restarting at 1)
-- folio_start[i]     = 1-based folio of chapter i's first page within its
--                      numbering sequence

-- Supersedes the per-page-row shape sketched in
-- 20260917000000_planner_packages_gradebook_codex.sql §G (book_id,
-- spec_version, page_index, folio_label, …): the shared measurement lib
-- produces per-chapter counts, not per-page anchors, so the compact
-- per-book shape below is the real one. The old table was empty.
drop table if exists public.book_page_maps;

create table public.book_page_maps (
  book_id text primary key references public.books(id) on delete cascade,
  spec_version int not null default 1,
  font_size_px int not null default 16,
  line_height numeric not null default 1.5,
  open_recto boolean not null default false,
  chapter_pages int[] not null,
  chapter_matter text[] not null,
  folio_start int[] not null,
  total_pages int not null,
  computed_at timestamptz not null default now(),
  constraint book_page_maps_lengths check (
    array_length(chapter_pages, 1) = array_length(chapter_matter, 1)
    and array_length(chapter_pages, 1) = array_length(folio_start, 1)
  ),
  constraint book_page_maps_total check (total_pages > 0)
);

alter table public.book_page_maps enable row level security;

-- Page maps are public catalogue metadata (like the books table itself):
-- readable by everyone, writable only by the service role (backfill script).
revoke all on public.book_page_maps from anon, authenticated;
grant select on public.book_page_maps to anon, authenticated;

drop policy if exists book_page_maps_select_all on public.book_page_maps;
create policy book_page_maps_select_all
  on public.book_page_maps for select
  to anon, authenticated
  using (true);
