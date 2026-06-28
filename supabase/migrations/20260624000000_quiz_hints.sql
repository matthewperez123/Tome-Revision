-- Progressive hint system for quiz questions.
--
-- Every question carries a pre-authored 3-level hint ladder (answer-vetted,
-- teacher-reviewable). Quizzes carry hint config (on/off + soft point cost);
-- proctored Guided Sessions default hints OFF. Attempt rows track hint usage.
--
-- The `hints` array is safe to ship to the student client (it is leak-checked at
-- authoring time); correct_answer / correct_option / reference_answer still are not.

-- 1. Hint ladder on both question surfaces.
--    hints:                   ordered [{ "level": 1, "text": "…" }, …]
--    distractor_eliminations: MC-only ordered list of incorrect option ids/text
--                             safe to grey out per level (never the correct one).
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS hints jsonb,
  ADD COLUMN IF NOT EXISTS distractor_eliminations jsonb;

ALTER TABLE teacher_quiz_questions
  ADD COLUMN IF NOT EXISTS hints jsonb,
  ADD COLUMN IF NOT EXISTS distractor_eliminations jsonb;

-- 2. Quiz-level config: hints on/off + soft point cost per revealed hint.
ALTER TABLE quizzes
  ADD COLUMN IF NOT EXISTS hints_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS hint_point_penalty numeric NOT NULL DEFAULT 0;

ALTER TABLE teacher_quizzes
  ADD COLUMN IF NOT EXISTS hints_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS hint_point_penalty numeric NOT NULL DEFAULT 0;

-- 3. Proctored sessions: hints OFF by default unless the teacher opts in.
ALTER TABLE guided_sessions
  ADD COLUMN IF NOT EXISTS hints_enabled boolean NOT NULL DEFAULT false;

-- 4. Usage tracking on the attempt/response table. hint_max_level is the
--    deepest level revealed for that question; score logic reads these.
ALTER TABLE teacher_quiz_responses
  ADD COLUMN IF NOT EXISTS hints_used integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS hint_max_level integer NOT NULL DEFAULT 0;
