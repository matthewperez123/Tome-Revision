-- Virgil-authored quizzes for Guided Sessions.
-- A quiz station can reference a teacher_quiz generated/edited by the teacher,
-- and students' responses (auto- or Virgil-graded) persist to teacher_quiz_responses.

-- 1. Link a quiz station to a teacher_quiz
ALTER TABLE guided_session_stations
  ADD COLUMN IF NOT EXISTS teacher_quiz_id uuid REFERENCES teacher_quizzes(id) ON DELETE SET NULL;

-- 2. Generation provenance on teacher_quizzes
--    (book_id text, chapter_range_start/end, difficulty, status already exist)
ALTER TABLE teacher_quizzes
  ADD COLUMN IF NOT EXISTS source_scope jsonb,
  ADD COLUMN IF NOT EXISTS generated_by_model text,
  ADD COLUMN IF NOT EXISTS generation_params jsonb;

-- 3. Widen question_type set and add open-ended grading fields
ALTER TABLE teacher_quiz_questions DROP CONSTRAINT IF EXISTS teacher_quiz_questions_question_type_check;
ALTER TABLE teacher_quiz_questions ADD CONSTRAINT teacher_quiz_questions_question_type_check
  CHECK (question_type IN (
    'multiple_choice', 'multiple_select', 'true_false', 'fill_blank',
    'vocabulary_in_context', 'short_answer', 'free_response', 'tf_with_reason',
    -- legacy values retained for backward compatibility
    'passage_id', 'vocabulary'
  ));

ALTER TABLE teacher_quiz_questions
  ADD COLUMN IF NOT EXISTS rubric jsonb,
  ADD COLUMN IF NOT EXISTS reference_answer text,
  ADD COLUMN IF NOT EXISTS max_points integer,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS source_anchor jsonb;

-- correct_answer must be nullable for open-ended types that grade via rubric
ALTER TABLE teacher_quiz_questions ALTER COLUMN correct_answer DROP NOT NULL;

-- 4. Student responses / attempts (works inside a session, or standalone)
CREATE TABLE IF NOT EXISTS teacher_quiz_responses (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id              uuid NOT NULL REFERENCES teacher_quizzes(id) ON DELETE CASCADE,
  question_id          uuid NOT NULL REFERENCES teacher_quiz_questions(id) ON DELETE CASCADE,
  session_id           uuid REFERENCES guided_sessions(id) ON DELETE SET NULL,
  participant_id       uuid REFERENCES guided_session_participants(id) ON DELETE SET NULL,
  student_id           uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  response             jsonb,
  is_correct           boolean,
  score                numeric,
  max_points           integer,
  graded_by            text CHECK (graded_by IN ('auto', 'virgil', 'teacher')),
  ai_feedback          text,
  ai_rubric_breakdown  jsonb,
  teacher_override     boolean NOT NULL DEFAULT false,
  graded_at            timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE(student_id, question_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_tq_responses_quiz ON teacher_quiz_responses(quiz_id);
CREATE INDEX IF NOT EXISTS idx_tq_responses_session ON teacher_quiz_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_tq_responses_student ON teacher_quiz_responses(student_id);

ALTER TABLE teacher_quiz_responses ENABLE ROW LEVEL SECURITY;

-- Teachers: full access to responses for quizzes they own or sessions they run
CREATE POLICY "Teachers manage responses for own quizzes and sessions"
  ON teacher_quiz_responses FOR ALL
  USING (
    EXISTS (SELECT 1 FROM teacher_quizzes tq WHERE tq.id = teacher_quiz_responses.quiz_id AND tq.teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM guided_sessions gs WHERE gs.id = teacher_quiz_responses.session_id AND gs.teacher_id = auth.uid())
  );

-- Students: insert / read / update only their own responses
CREATE POLICY "Students insert own responses"
  ON teacher_quiz_responses FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students read own responses"
  ON teacher_quiz_responses FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students update own responses"
  ON teacher_quiz_responses FOR UPDATE
  USING (student_id = auth.uid());
