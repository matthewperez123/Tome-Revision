-- Add structural unit type to books table
-- Replaces the hardcoded "chapter" concept with flexible unit types:
-- chapter, canto, poem, short_story, book (as in "Book I"), essay, letter

ALTER TABLE books
  ADD COLUMN IF NOT EXISTS structural_unit_type text NOT NULL DEFAULT 'chapter';

-- Add unit_title to chapters table for poems/stories/essays with distinct titles
ALTER TABLE chapters
  ADD COLUMN IF NOT EXISTS unit_title text;
