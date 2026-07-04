-- 20260717000000_personal_reading_data_model.sql
-- Restore-surfaces: personal reading data model.
-- Adapts to audit findings: reading_progress + highlights already exist;
-- only shelf_items is genuinely new.

-- 1) reading_progress: add the two missing resume fields.
--    (chapter_index, page, scroll_ratio, updated_at + PK(user_id, book_id) already exist)
ALTER TABLE public.reading_progress
  ADD COLUMN IF NOT EXISTS paragraph_anchor text,
  ADD COLUMN IF NOT EXISTS percent numeric;

-- 2) highlights: carry paragraph-level bookmarks alongside text-selection highlights,
--    instead of a parallel `bookmarks` table (the /bookmarks page already reads this table).
ALTER TABLE public.highlights
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'highlight',
  ADD COLUMN IF NOT EXISTS label text,
  ADD COLUMN IF NOT EXISTS paragraph_anchor text;

ALTER TABLE public.highlights
  DROP CONSTRAINT IF EXISTS highlights_kind_check;
ALTER TABLE public.highlights
  ADD CONSTRAINT highlights_kind_check CHECK (kind IN ('bookmark','highlight'));

-- Paragraph bookmarks have no text selection -> relax NOT NULL on selection fields.
ALTER TABLE public.highlights
  ALTER COLUMN selected_text DROP NOT NULL,
  ALTER COLUMN start_offset DROP NOT NULL,
  ALTER COLUMN end_offset DROP NOT NULL;

-- RLS unchanged and already correct:
--   owner-only select/insert/update/delete (auth.uid() = user_id)
--   + opt-in highlights_shared_read (shared=true AND can_access_classroom()).
-- Bookmarks default shared=false -> owner-only; teachers get no access.

-- 3) shelf_items: genuinely missing. Personal, owner-only.
CREATE TABLE IF NOT EXISTS public.shelf_items (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id    text NOT NULL,
  shelf      text NOT NULL CHECK (shelf IN ('favorites','want_to_read','completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, book_id, shelf)
);

ALTER TABLE public.shelf_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shelf_items owner select" ON public.shelf_items
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "shelf_items owner insert" ON public.shelf_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "shelf_items owner update" ON public.shelf_items
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "shelf_items owner delete" ON public.shelf_items
  FOR DELETE USING (auth.uid() = user_id);
