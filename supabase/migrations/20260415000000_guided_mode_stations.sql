-- Guided Mode: Multi-station sessions with messaging, reflections, and hint budgets
-- Extends the existing guided_sessions schema from 20260413000000

-- ── Expand guided_sessions ────────────────────────────────────────────────────

ALTER TABLE guided_sessions
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS scheduled_start_at timestamptz,
  ADD COLUMN IF NOT EXISTS actual_start_at timestamptz,
  ADD COLUMN IF NOT EXISTS actual_end_at timestamptz,
  ADD COLUMN IF NOT EXISTS duration_minutes integer,
  ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS current_station_index integer DEFAULT 0;

-- Widen the status CHECK to include new lifecycle states.
-- Drop the old constraint then add the expanded one.
ALTER TABLE guided_sessions DROP CONSTRAINT IF EXISTS guided_sessions_status_check;
ALTER TABLE guided_sessions ADD CONSTRAINT guided_sessions_status_check
  CHECK (status IN ('draft', 'scheduled', 'lobby', 'active', 'paused', 'ended', 'completed', 'cancelled'));

-- Migrate any existing 'ended' rows to 'completed'
UPDATE guided_sessions SET status = 'completed' WHERE status = 'ended';

-- ── Expand guided_session_participants ─────────────────────────────────────────

ALTER TABLE guided_session_participants
  ADD COLUMN IF NOT EXISTS current_station_index integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS hints_used integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS station_progress jsonb DEFAULT '{}'::jsonb;

-- Widen participant status to include 'completed' and 'exited'
ALTER TABLE guided_session_participants DROP CONSTRAINT IF EXISTS guided_session_participants_status_check;
ALTER TABLE guided_session_participants ADD CONSTRAINT guided_session_participants_status_check
  CHECK (status IN ('invited', 'lobby', 'joined', 'active', 'submitted', 'completed', 'exited', 'kicked'));

-- ── guided_session_stations ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS guided_session_stations (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        uuid NOT NULL REFERENCES guided_sessions(id) ON DELETE CASCADE,
  station_index     integer NOT NULL,
  type              text NOT NULL CHECK (type IN ('reading', 'quiz', 'reflection')),
  title             text,
  book_id           text REFERENCES books(id) ON DELETE SET NULL,
  chapter_start     integer,
  chapter_end       integer,
  section_range     jsonb,             -- { startSection: string, endSection: string }
  quiz_id           text,              -- reference to a pre-built Trial
  quiz_config       jsonb,             -- ad-hoc quiz configuration
  reflection_prompt text,
  min_words         integer,
  target_minutes    integer NOT NULL DEFAULT 10,
  require_completion boolean NOT NULL DEFAULT false,
  settings          jsonb DEFAULT '{}'::jsonb,
  UNIQUE(session_id, station_index)
);

CREATE INDEX idx_guided_stations_session ON guided_session_stations(session_id);

-- ── guided_session_messages ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS guided_session_messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      uuid NOT NULL REFERENCES guided_sessions(id) ON DELETE CASCADE,
  sender_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,  -- NULL = broadcast
  message_type    text NOT NULL CHECK (message_type IN ('hint', 'nudge', 'announcement', 'praise', 'instruction')),
  content         text NOT NULL,
  station_index   integer,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_guided_messages_session ON guided_session_messages(session_id);
CREATE INDEX idx_guided_messages_recipient ON guided_session_messages(session_id, recipient_id);

-- ── guided_session_reflections ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS guided_session_reflections (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      uuid NOT NULL REFERENCES guided_sessions(id) ON DELETE CASCADE,
  station_id      uuid NOT NULL REFERENCES guided_session_stations(id) ON DELETE CASCADE,
  student_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content         text NOT NULL DEFAULT '',
  word_count      integer NOT NULL DEFAULT 0,
  submitted_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id, station_id, student_id)
);

CREATE INDEX idx_guided_reflections_session ON guided_session_reflections(session_id);
CREATE INDEX idx_guided_reflections_student ON guided_session_reflections(session_id, student_id);

-- ── Row-Level Security ────────────────────────────────────────────────────────

ALTER TABLE guided_session_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guided_session_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE guided_session_reflections ENABLE ROW LEVEL SECURITY;

-- Stations: teachers manage stations in their sessions; students read stations of joined sessions
CREATE POLICY "Teachers manage stations in own sessions"
  ON guided_session_stations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM guided_sessions
      WHERE guided_sessions.id = guided_session_stations.session_id
        AND guided_sessions.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students read stations of joined sessions"
  ON guided_session_stations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM guided_session_participants
      WHERE guided_session_participants.session_id = guided_session_stations.session_id
        AND guided_session_participants.student_id = auth.uid()
    )
  );

-- Messages: teachers insert and read for their sessions
CREATE POLICY "Teachers manage messages in own sessions"
  ON guided_session_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM guided_sessions
      WHERE guided_sessions.id = guided_session_messages.session_id
        AND guided_sessions.teacher_id = auth.uid()
    )
  );

-- Messages: students read broadcasts and messages addressed to them
CREATE POLICY "Students read own and broadcast messages"
  ON guided_session_messages FOR SELECT
  USING (
    (recipient_id IS NULL OR recipient_id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM guided_session_participants
      WHERE guided_session_participants.session_id = guided_session_messages.session_id
        AND guided_session_participants.student_id = auth.uid()
    )
  );

-- Reflections: teachers read all in their sessions
CREATE POLICY "Teachers read reflections in own sessions"
  ON guided_session_reflections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM guided_sessions
      WHERE guided_sessions.id = guided_session_reflections.session_id
        AND guided_sessions.teacher_id = auth.uid()
    )
  );

-- Reflections: students manage their own
CREATE POLICY "Students manage own reflections"
  ON guided_session_reflections FOR ALL
  USING (student_id = auth.uid());

-- ── Enable Realtime ───────────────────────────────────────────────────────────

ALTER PUBLICATION supabase_realtime ADD TABLE guided_session_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE guided_session_stations;
