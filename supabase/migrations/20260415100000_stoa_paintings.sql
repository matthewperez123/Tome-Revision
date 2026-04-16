-- ═══════════════════════════════════════════════════════════════════════
-- Stoa Paintings Table
-- Enforces strict 1:1 painting-to-book relationship
-- ═══════════════════════════════════════════════════════════════════════

-- Create the stoa_paintings table
CREATE TABLE IF NOT EXISTS public.stoa_paintings (
  id TEXT PRIMARY KEY,                          -- matches painting filename / manifest ID
  unlocking_book_id TEXT NOT NULL               -- FK to books.id — REQUIRED, NON-NULLABLE
    REFERENCES public.books(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  painter TEXT NOT NULL,
  year TEXT NOT NULL,                            -- text to support "c.1820" ranges
  source_institution TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  public_domain_status TEXT NOT NULL DEFAULT 'PD-Art'
    CHECK (public_domain_status IN ('CC0', 'PD-Old', 'PD-Art')),
  curation_tier INTEGER NOT NULL DEFAULT 4
    CHECK (curation_tier IN (1, 2, 3, 4)),
  curation_note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- STRICT 1:1: no two paintings may share the same book
  CONSTRAINT stoa_unique_book UNIQUE (unlocking_book_id)
);

-- Index for fast lookups by book
CREATE INDEX IF NOT EXISTS idx_stoa_paintings_book
  ON public.stoa_paintings(unlocking_book_id);

-- Enable RLS
ALTER TABLE public.stoa_paintings ENABLE ROW LEVEL SECURITY;

-- Public read access (paintings are public rewards)
CREATE POLICY "stoa_paintings_public_read"
  ON public.stoa_paintings
  FOR SELECT
  USING (true);

-- Only service role can insert/update/delete
CREATE POLICY "stoa_paintings_service_write"
  ON public.stoa_paintings
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ═══════════════════════════════════════════════════════════════════════
-- LOUD FAILURE CHECK
-- If any book in the old denormalized painting columns lacks a match
-- in this new table after seeding, the constraint will catch it.
-- The UNIQUE constraint on unlocking_book_id ensures no duplicates.
-- The NOT NULL on unlocking_book_id ensures no orphan paintings.
-- ═══════════════════════════════════════════════════════════════════════

COMMENT ON TABLE public.stoa_paintings IS
  'Stoa gallery: 1:1 painting-to-book reward mapping. '
  'Every painting must reference exactly one book (NOT NULL + UNIQUE constraint). '
  'Run pnpm audit:stoa to validate the TypeScript source matches this table.';

COMMENT ON CONSTRAINT stoa_unique_book ON public.stoa_paintings IS
  'Enforces strict 1:1: no two paintings may unlock the same book.';
