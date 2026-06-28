-- Collaborative annotations on Guided Session readings.
-- Liveblocks Comments is the live source of truth for annotation threads; these
-- columns are the per-session switches the Liveblocks auth endpoint reads to
-- decide whether to mint a room and which room topology to provision.
--
-- annotation_visibility drives room topology (NOT client-side hiding — Liveblocks
-- Comments has no per-thread read ACL, so privacy is enforced by room scoping):
--   collaborative      -> one room per session x chapter; everyone joins.
--   private_to_teacher -> one room per student per chapter (PR2); only that
--                         student + the teacher join.

ALTER TABLE guided_sessions
  ADD COLUMN IF NOT EXISTS annotations_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS annotation_visibility text NOT NULL DEFAULT 'collaborative'
    CHECK (annotation_visibility IN ('collaborative', 'private_to_teacher')),
  ADD COLUMN IF NOT EXISTS presence_enabled boolean NOT NULL DEFAULT true;
