-- Semester Planning (Classroom)
-- Virgil drafts a term plan (weeks -> items); the teacher edits a board and
-- deploys it, which provisions real artifacts (readings/quizzes/guided
-- sessions/assignments) by composing existing features.
--
-- This migration is additive: three new tables, no changes to existing schema.
-- Provisioning FKs on semester_plan_items point at the artifact tables that
-- already exist (assignments, teacher_quizzes, guided_sessions).

-- ── semester_plans ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS semester_plans (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id           uuid REFERENCES classrooms(id) ON DELETE SET NULL,
  title              text NOT NULL,
  term_start         date,
  term_end           date,
  weeks              integer NOT NULL DEFAULT 0,
  cadence            jsonb NOT NULL DEFAULT '{}'::jsonb,   -- { meetingsPerWeek, minutesPerMeeting, ... }
  level              text,                                  -- grade / reading level
  goals              jsonb NOT NULL DEFAULT '{}'::jsonb,    -- { themes: [], objectives: [] }
  constraints        jsonb NOT NULL DEFAULT '{}'::jsonb,    -- { maxMinutesPerWeek, difficultyCeiling, requiredBookIds: [], breaks: [] }
  status             text NOT NULL DEFAULT 'draft'
                       CHECK (status IN ('draft', 'active', 'archived')),
  generated_by_model text,
  generation_params  jsonb,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_semester_plans_teacher ON semester_plans(teacher_id);
CREATE INDEX IF NOT EXISTS idx_semester_plans_class ON semester_plans(class_id);

-- ── semester_plan_weeks ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS semester_plan_weeks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id     uuid NOT NULL REFERENCES semester_plans(id) ON DELETE CASCADE,
  week_index  integer NOT NULL,
  date_start  date,
  date_end    date,
  theme       text,
  notes       text,
  UNIQUE(plan_id, week_index)
);

CREATE INDEX IF NOT EXISTS idx_semester_plan_weeks_plan ON semester_plan_weeks(plan_id);

-- ── semester_plan_items ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS semester_plan_items (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id           uuid NOT NULL REFERENCES semester_plan_weeks(id) ON DELETE CASCADE,
  sort_order        integer NOT NULL DEFAULT 0,
  type              text NOT NULL
                      CHECK (type IN ('reading', 'quiz', 'guided_session', 'essay', 'discussion', 'custom_reading')),
  book_id           text REFERENCES books(id) ON DELETE SET NULL,
  chapter_refs      jsonb,                                  -- [1,2,3] chapter_index list
  title             text NOT NULL,
  description       text,
  rubric            jsonb,                                  -- { max_points, criteria: [] }
  difficulty        text CHECK (difficulty IS NULL OR difficulty IN ('apprentice', 'scholar', 'master')),
  due_date          date,
  est_minutes       integer,                                -- code-computed reading-time load
  custom_reading    jsonb,                                  -- { title, url, filePath, notes } for non-catalog readings
  -- Catalog grounding flag: true when book_id resolves to a book that has
  -- ingested chapter content (so it is readable / quizzable in Tome).
  has_content       boolean,
  status            text NOT NULL DEFAULT 'planned'
                      CHECK (status IN ('planned', 'provisioned')),
  -- Provisioning FKs, populated on deploy:
  teacher_quiz_id   uuid REFERENCES teacher_quizzes(id) ON DELETE SET NULL,
  guided_session_id uuid REFERENCES guided_sessions(id) ON DELETE SET NULL,
  assignment_id     uuid REFERENCES assignments(id) ON DELETE SET NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_semester_plan_items_week ON semester_plan_items(week_id);

-- ── Row-Level Security ────────────────────────────────────────────────────────
-- Teachers fully own their plans/weeks/items. Students enrolled in the plan's
-- class may READ the syllabus (plan + weeks + items) only when the plan is
-- 'active'. Items carry no answer fields — answer data lives in
-- teacher_quiz_questions, which keeps its own owner-only RLS.

ALTER TABLE semester_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE semester_plan_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE semester_plan_items ENABLE ROW LEVEL SECURITY;

-- Plans: owner-only for all writes/reads.
CREATE POLICY "Teachers manage own semester plans"
  ON semester_plans FOR ALL
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- Plans: enrolled students read an active plan for their class.
CREATE POLICY "Students read active class semester plans"
  ON semester_plans FOR SELECT
  USING (
    status = 'active'
    AND class_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM classroom_members
      WHERE classroom_members.classroom_id = semester_plans.class_id
        AND classroom_members.student_id = auth.uid()
    )
  );

-- Weeks: teacher manages weeks of own plans.
CREATE POLICY "Teachers manage own semester plan weeks"
  ON semester_plan_weeks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM semester_plans
      WHERE semester_plans.id = semester_plan_weeks.plan_id
        AND semester_plans.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM semester_plans
      WHERE semester_plans.id = semester_plan_weeks.plan_id
        AND semester_plans.teacher_id = auth.uid()
    )
  );

-- Weeks: students read weeks of an active plan for their class.
CREATE POLICY "Students read active plan weeks"
  ON semester_plan_weeks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM semester_plans p
      JOIN classroom_members m ON m.classroom_id = p.class_id
      WHERE p.id = semester_plan_weeks.plan_id
        AND p.status = 'active'
        AND m.student_id = auth.uid()
    )
  );

-- Items: teacher manages items of own plans.
CREATE POLICY "Teachers manage own semester plan items"
  ON semester_plan_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM semester_plan_weeks w
      JOIN semester_plans p ON p.id = w.plan_id
      WHERE w.id = semester_plan_items.week_id
        AND p.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM semester_plan_weeks w
      JOIN semester_plans p ON p.id = w.plan_id
      WHERE w.id = semester_plan_items.week_id
        AND p.teacher_id = auth.uid()
    )
  );

-- Items: students read items of an active plan for their class.
CREATE POLICY "Students read active plan items"
  ON semester_plan_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM semester_plan_weeks w
      JOIN semester_plans p ON p.id = w.plan_id
      JOIN classroom_members m ON m.classroom_id = p.class_id
      WHERE w.id = semester_plan_items.week_id
        AND p.status = 'active'
        AND m.student_id = auth.uid()
    )
  );
