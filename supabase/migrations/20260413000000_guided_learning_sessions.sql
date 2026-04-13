-- Guided Learning Mode: proctored, time-boxed reading/quiz sessions
-- Teachers assign a chapter or Trial, students complete under controlled conditions

-- ── guided_sessions ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS guided_sessions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  classroom_id  uuid REFERENCES classrooms(id) ON DELETE SET NULL,
  join_code     text UNIQUE NOT NULL,
  type          text NOT NULL CHECK (type IN ('chapter', 'trial')),
  book_id       uuid REFERENCES books(id) ON DELETE SET NULL,
  chapter_index integer,
  trial_id      text,
  time_limit_minutes integer NOT NULL CHECK (time_limit_minutes > 0),
  mode          text NOT NULL DEFAULT 'strict' CHECK (mode IN ('strict', 'lenient')),
  status        text NOT NULL DEFAULT 'lobby' CHECK (status IN ('lobby', 'active', 'paused', 'ended')),
  starts_at     timestamptz,
  ends_at       timestamptz,
  paused_at     timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  ended_at      timestamptz,
  summary_data  jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX idx_guided_sessions_teacher ON guided_sessions(teacher_id);
CREATE INDEX idx_guided_sessions_join_code ON guided_sessions(join_code);
CREATE INDEX idx_guided_sessions_status ON guided_sessions(status);

-- ── guided_session_participants ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS guided_session_participants (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      uuid NOT NULL REFERENCES guided_sessions(id) ON DELETE CASCADE,
  student_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status          text NOT NULL DEFAULT 'lobby' CHECK (status IN ('lobby', 'active', 'submitted', 'kicked')),
  joined_at       timestamptz NOT NULL DEFAULT now(),
  submitted_at    timestamptz,
  progress_pct    integer NOT NULL DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
  violation_count integer NOT NULL DEFAULT 0,
  score           integer,
  UNIQUE(session_id, student_id)
);

CREATE INDEX idx_guided_participants_session ON guided_session_participants(session_id);
CREATE INDEX idx_guided_participants_student ON guided_session_participants(student_id);

-- ── guided_session_events ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS guided_session_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  uuid NOT NULL REFERENCES guided_sessions(id) ON DELETE CASCADE,
  student_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type  text NOT NULL,
  payload     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_guided_events_session ON guided_session_events(session_id);
CREATE INDEX idx_guided_events_session_student ON guided_session_events(session_id, student_id);
CREATE INDEX idx_guided_events_type ON guided_session_events(event_type);

-- ── Row-Level Security ──────────────────────────────────────────────────────

ALTER TABLE guided_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE guided_session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE guided_session_events ENABLE ROW LEVEL SECURITY;

-- Teachers can CRUD their own sessions
CREATE POLICY "Teachers manage own sessions"
  ON guided_sessions FOR ALL
  USING (teacher_id = auth.uid());

-- Students can read sessions they've joined
CREATE POLICY "Students read joined sessions"
  ON guided_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM guided_session_participants
      WHERE guided_session_participants.session_id = guided_sessions.id
        AND guided_session_participants.student_id = auth.uid()
    )
  );

-- Teachers can manage participants in their sessions
CREATE POLICY "Teachers manage participants"
  ON guided_session_participants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM guided_sessions
      WHERE guided_sessions.id = guided_session_participants.session_id
        AND guided_sessions.teacher_id = auth.uid()
    )
  );

-- Students can read and insert their own participant record
CREATE POLICY "Students read own participation"
  ON guided_session_participants FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students join sessions"
  ON guided_session_participants FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Students can update their own participation (progress, status)
CREATE POLICY "Students update own participation"
  ON guided_session_participants FOR UPDATE
  USING (student_id = auth.uid());

-- Teachers can read events in their sessions
CREATE POLICY "Teachers read session events"
  ON guided_session_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM guided_sessions
      WHERE guided_sessions.id = guided_session_events.session_id
        AND guided_sessions.teacher_id = auth.uid()
    )
  );

-- Students can insert their own events
CREATE POLICY "Students insert own events"
  ON guided_session_events FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Students can read their own events
CREATE POLICY "Students read own events"
  ON guided_session_events FOR SELECT
  USING (student_id = auth.uid());

-- ── Enable Realtime ─────────────────────────────────────────────────────────
-- Allow Supabase Realtime to broadcast changes on the events table
-- so the teacher dashboard can subscribe to postgres_changes

ALTER PUBLICATION supabase_realtime ADD TABLE guided_session_events;
ALTER PUBLICATION supabase_realtime ADD TABLE guided_session_participants;
