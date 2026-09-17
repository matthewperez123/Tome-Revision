-- Phase 1: Semester planner (terms/units/packages/categories/templates),
-- assignment packages (assignment_items + per-item progress), weighted grade
-- computation, and the codex reader's canonical page maps.
--
-- Additive only. Extends the existing semester_plans trio (20260623) rather
-- than introducing a parallel "terms" table: semester_plans IS the term.
-- Existing assignments are folded into one-item packages by the data
-- migration at the bottom, so there is exactly one item-based code path
-- going forward.

-- ══════════════════════════════════════════════════════════════════════════
-- A. Term semantics on semester_plans
-- ══════════════════════════════════════════════════════════════════════════

ALTER TABLE semester_plans
  ADD COLUMN IF NOT EXISTS meeting_days    integer[] NOT NULL DEFAULT '{}',  -- 0=Sun … 6=Sat
  ADD COLUMN IF NOT EXISTS no_class_dates  date[]    NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS grading_periods jsonb     NOT NULL DEFAULT '[]';  -- [{label, starts_on, ends_on}]

-- ══════════════════════════════════════════════════════════════════════════
-- B. Grading categories (per term/plan)
-- ══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS grading_categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id     uuid NOT NULL REFERENCES semester_plans(id) ON DELETE CASCADE,
  name        text NOT NULL,
  weight      numeric NOT NULL CHECK (weight >= 0 AND weight <= 100),
  sort_order  integer NOT NULL DEFAULT 0,
  drop_lowest integer NOT NULL DEFAULT 0 CHECK (drop_lowest >= 0),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_grading_categories_plan ON grading_categories(plan_id);

-- ══════════════════════════════════════════════════════════════════════════
-- C. Plan units (date-ranged containers; weeks remain for the calendar view)
-- ══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS plan_units (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id     uuid NOT NULL REFERENCES semester_plans(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  starts_on   date,
  ends_on     date,
  sort_order  integer NOT NULL DEFAULT 0,
  book_id     text REFERENCES books(id) ON DELETE SET NULL,  -- primary text
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_plan_units_plan ON plan_units(plan_id);

-- Items gain unit membership + canonical-page ranges + package fields.
-- 'writing' maps to the existing 'essay' type; new kinds 'assessment' and
-- 'note' are added to the check. week_id becomes optional so unit-first
-- plans don't need synthetic weeks.
ALTER TABLE semester_plan_items
  ADD COLUMN IF NOT EXISTS unit_id       uuid REFERENCES plan_units(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS chapter_start integer,
  ADD COLUMN IF NOT EXISTS chapter_end   integer,
  ADD COLUMN IF NOT EXISTS page_start    integer,   -- canonical pages (book_page_maps)
  ADD COLUMN IF NOT EXISTS page_end      integer,
  ADD COLUMN IF NOT EXISTS is_required   boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS prompt        text;

ALTER TABLE semester_plan_items ALTER COLUMN week_id DROP NOT NULL;

ALTER TABLE semester_plan_items DROP CONSTRAINT IF EXISTS semester_plan_items_type_check;
ALTER TABLE semester_plan_items ADD CONSTRAINT semester_plan_items_type_check
  CHECK (type IN ('reading', 'quiz', 'guided_session', 'essay', 'discussion',
                  'custom_reading', 'assessment', 'note'));

-- An item must belong to a week or a unit (or both, during transition).
ALTER TABLE semester_plan_items DROP CONSTRAINT IF EXISTS semester_plan_items_parent_check;
ALTER TABLE semester_plan_items ADD CONSTRAINT semester_plan_items_parent_check
  CHECK (week_id IS NOT NULL OR unit_id IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_semester_plan_items_unit ON semester_plan_items(unit_id);

-- ══════════════════════════════════════════════════════════════════════════
-- D. Plan packages (publishing creates real assignments)
-- ══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS plan_packages (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id                 uuid NOT NULL REFERENCES plan_units(id) ON DELETE CASCADE,
  title                   text NOT NULL,
  due_at                  timestamptz,
  release_at              timestamptz,
  points                  integer NOT NULL DEFAULT 100 CHECK (points >= 0),
  grading_category_id     uuid REFERENCES grading_categories(id) ON DELETE SET NULL,
  late_policy             jsonb NOT NULL DEFAULT '{"accept_late": true, "penalty_pct_per_day": 0, "cutoff_days": null}',
  sort_order              integer NOT NULL DEFAULT 0,
  published_assignment_id uuid REFERENCES assignments(id) ON DELETE SET NULL,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_plan_packages_unit ON plan_packages(unit_id);

CREATE TABLE IF NOT EXISTS plan_package_items (
  package_id   uuid NOT NULL REFERENCES plan_packages(id) ON DELETE CASCADE,
  plan_item_id uuid NOT NULL REFERENCES semester_plan_items(id) ON DELETE CASCADE,
  sort_order   integer NOT NULL DEFAULT 0,
  PRIMARY KEY (package_id, plan_item_id)
);

-- ══════════════════════════════════════════════════════════════════════════
-- E. Term templates (dates stripped, relative week offsets kept)
-- ══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS term_templates (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name       text NOT NULL,
  payload    jsonb NOT NULL,
  is_shared  boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_term_templates_owner ON term_templates(owner_id);

-- ══════════════════════════════════════════════════════════════════════════
-- F. Assignment packages: parent columns + child items + per-item progress
-- ══════════════════════════════════════════════════════════════════════════

ALTER TABLE assignments
  ADD COLUMN IF NOT EXISTS package_id          uuid REFERENCES plan_packages(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS release_at          timestamptz,
  ADD COLUMN IF NOT EXISTS grading_category_id uuid REFERENCES grading_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS late_policy         jsonb;  -- null → legacy late_penalty_percent/grace_period_days

CREATE TABLE IF NOT EXISTS assignment_items (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id            uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  kind                     text NOT NULL
                             CHECK (kind IN ('reading', 'quiz', 'writing', 'discussion',
                                             'annotation', 'assessment', 'note')),
  title                    text,
  book_id                  text REFERENCES books(id) ON DELETE SET NULL,
  chapter_start            integer,
  chapter_end              integer,
  page_start               integer,  -- canonical pages
  page_end                 integer,
  quiz_id                  uuid REFERENCES teacher_quizzes(id) ON DELETE SET NULL,
  -- Platform-quiz items are addressed by (book_id, difficulty), matching the
  -- catalog quizzes table's natural key. Capitalized per reader convention.
  platform_quiz_difficulty text CHECK (platform_quiz_difficulty IS NULL
                             OR platform_quiz_difficulty IN ('Apprentice', 'Scholar', 'Master')),
  prompt                   text,
  is_required              boolean NOT NULL DEFAULT true,
  sort_order               integer NOT NULL DEFAULT 0,
  created_at               timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_assignment_items_assignment ON assignment_items(assignment_id);

CREATE TABLE IF NOT EXISTS assignment_item_progress (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_item_id uuid NOT NULL REFERENCES assignment_items(id) ON DELETE CASCADE,
  student_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status             text NOT NULL DEFAULT 'not_started'
                       CHECK (status IN ('not_started', 'in_progress', 'complete')),
  completed_at       timestamptz,
  score              numeric,
  attempt_count      integer NOT NULL DEFAULT 0,
  updated_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (assignment_item_id, student_id)
);
CREATE INDEX IF NOT EXISTS idx_item_progress_student ON assignment_item_progress(student_id);

-- Excused work: excluded from the grade denominator.
ALTER TABLE assignment_submissions
  ADD COLUMN IF NOT EXISTS excused boolean NOT NULL DEFAULT false;

-- ══════════════════════════════════════════════════════════════════════════
-- G. Codex reader: canonical page maps + reading position
-- ══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS book_page_maps (
  book_id      text NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  spec_version integer NOT NULL,
  page_index   integer NOT NULL,             -- 0-based position in the book's page sequence
  folio_label  text NOT NULL,                -- 'iv', '45', or '' for counted-not-displayed blanks
  section      text NOT NULL CHECK (section IN ('front', 'body', 'back')),
  chapter_index integer,                     -- null for inserted blank pages
  start_anchor text,                         -- '{blockId}#{charOffset}' within the chapter
  end_anchor   text,
  word_count   integer NOT NULL DEFAULT 0,
  has_figure   boolean NOT NULL DEFAULT false,
  PRIMARY KEY (book_id, spec_version, page_index)
);
CREATE INDEX IF NOT EXISTS idx_book_page_maps_chapter ON book_page_maps(book_id, spec_version, chapter_index);

ALTER TABLE reading_progress
  ADD COLUMN IF NOT EXISTS canonical_page integer;

-- ══════════════════════════════════════════════════════════════════════════
-- H. Row-Level Security
-- ══════════════════════════════════════════════════════════════════════════

ALTER TABLE grading_categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_units               ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_packages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_package_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE term_templates           ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_item_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_page_maps           ENABLE ROW LEVEL SECURITY;

-- Planner children: teacher owns via the plan; students read on active plans
-- (packages additionally require a published assignment — unpublished work is
-- invisible to students).

CREATE POLICY "Teachers manage own grading categories"
  ON grading_categories FOR ALL
  USING (EXISTS (SELECT 1 FROM semester_plans p
                 WHERE p.id = grading_categories.plan_id AND p.teacher_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM semester_plans p
                 WHERE p.id = grading_categories.plan_id AND p.teacher_id = auth.uid()));

CREATE POLICY "Students read active plan categories"
  ON grading_categories FOR SELECT
  USING (EXISTS (SELECT 1 FROM semester_plans p
                 JOIN classroom_members m ON m.classroom_id = p.class_id
                 WHERE p.id = grading_categories.plan_id
                   AND p.status = 'active' AND m.student_id = auth.uid()));

CREATE POLICY "Teachers manage own plan units"
  ON plan_units FOR ALL
  USING (EXISTS (SELECT 1 FROM semester_plans p
                 WHERE p.id = plan_units.plan_id AND p.teacher_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM semester_plans p
                 WHERE p.id = plan_units.plan_id AND p.teacher_id = auth.uid()));

CREATE POLICY "Students read active plan units"
  ON plan_units FOR SELECT
  USING (EXISTS (SELECT 1 FROM semester_plans p
                 JOIN classroom_members m ON m.classroom_id = p.class_id
                 WHERE p.id = plan_units.plan_id
                   AND p.status = 'active' AND m.student_id = auth.uid()));

CREATE POLICY "Teachers manage own plan packages"
  ON plan_packages FOR ALL
  USING (EXISTS (SELECT 1 FROM plan_units u JOIN semester_plans p ON p.id = u.plan_id
                 WHERE u.id = plan_packages.unit_id AND p.teacher_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM plan_units u JOIN semester_plans p ON p.id = u.plan_id
                 WHERE u.id = plan_packages.unit_id AND p.teacher_id = auth.uid()));

CREATE POLICY "Students read published packages of active plans"
  ON plan_packages FOR SELECT
  USING (
    published_assignment_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM plan_units u
                JOIN semester_plans p ON p.id = u.plan_id
                JOIN classroom_members m ON m.classroom_id = p.class_id
                WHERE u.id = plan_packages.unit_id
                  AND p.status = 'active' AND m.student_id = auth.uid())
  );

CREATE POLICY "Teachers manage own package items"
  ON plan_package_items FOR ALL
  USING (EXISTS (SELECT 1 FROM plan_packages pk
                 JOIN plan_units u ON u.id = pk.unit_id
                 JOIN semester_plans p ON p.id = u.plan_id
                 WHERE pk.id = plan_package_items.package_id AND p.teacher_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM plan_packages pk
                 JOIN plan_units u ON u.id = pk.unit_id
                 JOIN semester_plans p ON p.id = u.plan_id
                 WHERE pk.id = plan_package_items.package_id AND p.teacher_id = auth.uid()));

CREATE POLICY "Students read visible package items"
  ON plan_package_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM plan_packages pk
                 JOIN plan_units u ON u.id = pk.unit_id
                 JOIN semester_plans p ON p.id = u.plan_id
                 JOIN classroom_members m ON m.classroom_id = p.class_id
                 WHERE pk.id = plan_package_items.package_id
                   AND pk.published_assignment_id IS NOT NULL
                   AND p.status = 'active' AND m.student_id = auth.uid()));

CREATE POLICY "Owners manage own term templates"
  ON term_templates FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Authenticated read shared term templates"
  ON term_templates FOR SELECT
  USING (is_shared = true AND auth.uid() IS NOT NULL);

-- Assignment items: mirror the assignments RLS posture exactly.

CREATE POLICY "Classroom members read assignment items"
  ON assignment_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM assignments a
                 JOIN classroom_members m ON m.classroom_id = a.classroom_id
                 WHERE a.id = assignment_items.assignment_id AND m.student_id = auth.uid()));

CREATE POLICY "Staff manage assignment items"
  ON assignment_items FOR ALL
  USING (EXISTS (SELECT 1 FROM assignments a
                 WHERE a.id = assignment_items.assignment_id
                   AND user_has_classroom_role(auth.uid(), a.classroom_id,
                                               ARRAY['owner', 'co_teacher'])))
  WITH CHECK (EXISTS (SELECT 1 FROM assignments a
                 WHERE a.id = assignment_items.assignment_id
                   AND user_has_classroom_role(auth.uid(), a.classroom_id,
                                               ARRAY['owner', 'co_teacher'])));

-- Per-item progress: a student sees and writes ONLY their own rows; staff read
-- everything in their classrooms. Negative test: Beatrice querying another
-- student's rows must return zero.

CREATE POLICY "Students read own item progress"
  ON assignment_item_progress FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students insert own item progress"
  ON assignment_item_progress FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students update own item progress"
  ON assignment_item_progress FOR UPDATE
  USING (student_id = auth.uid());

CREATE POLICY "Staff read item progress in their classrooms"
  ON assignment_item_progress FOR SELECT
  USING (EXISTS (SELECT 1 FROM assignment_items ai
                 JOIN assignments a ON a.id = ai.assignment_id
                 WHERE ai.id = assignment_item_progress.assignment_item_id
                   AND user_has_classroom_role(auth.uid(), a.classroom_id,
                                               ARRAY['owner', 'co_teacher', 'ta'])));

-- Canonical page maps are public content metadata (folios, anchors, word
-- counts — no user data). Read-open; writes are service-role only.
CREATE POLICY "Anyone reads book page maps"
  ON book_page_maps FOR SELECT
  USING (true);

-- ══════════════════════════════════════════════════════════════════════════
-- I. Grade computation — the single source of truth
-- ══════════════════════════════════════════════════════════════════════════
-- One function used by BOTH teacher and student surfaces so they cannot
-- drift. Handles: weighted categories, drop-lowest, late penalties, excused
-- (excluded from denominator), unpublished/draft assignments (excluded), and
-- renormalization across categories that have graded data. Returns one row
-- per category plus a TOTAL row (category_id NULL).
--
-- Callable by classroom staff for any student, or by a student for
-- themselves only.

CREATE OR REPLACE FUNCTION public.classroom_grade_summary(p_classroom uuid, p_student uuid)
RETURNS TABLE (
  category_id       uuid,
  category_name     text,
  weight            numeric,      -- configured weight (null for uncategorized / total)
  normalized_weight numeric,      -- weight after renormalizing over categories with data
  earned            numeric,      -- points earned (post late-penalty, post drop-lowest)
  possible          numeric,      -- points possible (excused + dropped excluded)
  pct               numeric,      -- earned/possible * 100
  graded_count      integer,
  included          boolean       -- participates in the weighted total
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_plan uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'NOT_AUTHENTICATED';
  END IF;
  IF NOT (
    public.user_has_classroom_role(auth.uid(), p_classroom, ARRAY['owner', 'co_teacher', 'ta'])
    OR (p_student = auth.uid()
        AND public.user_has_classroom_role(auth.uid(), p_classroom, ARRAY['student']))
  ) THEN
    RAISE EXCEPTION 'NOT_AUTHORIZED';
  END IF;

  SELECT p.id INTO v_plan
  FROM public.semester_plans p
  WHERE p.class_id = p_classroom AND p.status = 'active'
  ORDER BY p.updated_at DESC
  LIMIT 1;

  RETURN QUERY
  WITH graded AS (
    -- every graded, non-excused submission for this student on a published
    -- (non-draft) assignment in this classroom
    SELECT
      a.id AS assignment_id,
      a.grading_category_id,
      COALESCE(a.points_available, 100)::numeric AS points,
      g.score,
      g.max_score,
      -- late penalty: json late_policy wins, else legacy columns
      CASE
        WHEN a.due_date IS NULL OR s.submitted_at IS NULL
          OR s.submitted_at <= a.due_date
             + make_interval(days => COALESCE(a.grace_period_days, 0))
        THEN 1.0
        WHEN COALESCE((a.late_policy->>'accept_late')::boolean, true) = false
        THEN 0.0
        WHEN (a.late_policy->>'cutoff_days') IS NOT NULL
          AND s.submitted_at > a.due_date
             + make_interval(days => COALESCE(a.grace_period_days, 0)
                                     + (a.late_policy->>'cutoff_days')::integer)
        THEN 0.0
        ELSE GREATEST(0.0, 1.0 - (
               CEIL(EXTRACT(EPOCH FROM (s.submitted_at - (a.due_date
                    + make_interval(days => COALESCE(a.grace_period_days, 0))))) / 86400.0)
               * COALESCE((a.late_policy->>'penalty_pct_per_day')::numeric,
                          COALESCE(a.late_penalty_percent, 0)::numeric)
             ) / 100.0)
      END AS late_factor
    FROM public.assignments a
    JOIN public.assignment_submissions s
      ON s.assignment_id = a.id AND s.student_id = p_student
    JOIN public.grades g ON g.submission_id = s.id
    WHERE a.classroom_id = p_classroom
      AND a.status <> 'draft'
      AND s.excused = false
      AND g.score IS NOT NULL
      AND g.max_score > 0
  ),
  scored AS (
    SELECT
      gr.grading_category_id,
      gr.points,
      (gr.score / gr.max_score) * gr.late_factor AS unit_pct,
      (gr.score / gr.max_score) * gr.late_factor * gr.points AS earned_points
    FROM graded gr
  ),
  ranked AS (
    -- drop-lowest: rank within category by unit percentage
    SELECT
      sc.*,
      ROW_NUMBER() OVER (PARTITION BY sc.grading_category_id ORDER BY sc.unit_pct ASC) AS low_rank
    FROM scored sc
  ),
  kept AS (
    SELECT r.*
    FROM ranked r
    LEFT JOIN public.grading_categories c ON c.id = r.grading_category_id
    WHERE r.low_rank > COALESCE(c.drop_lowest, 0)
  ),
  cat_rollup AS (
    SELECT
      c.id AS cat_id,
      c.name AS cat_name,
      c.weight AS cat_weight,
      c.sort_order,
      COALESCE(SUM(k.earned_points), 0) AS cat_earned,
      COALESCE(SUM(k.points), 0) AS cat_possible,
      COUNT(k.points)::integer AS cat_count
    FROM public.grading_categories c
    LEFT JOIN kept k ON k.grading_category_id = c.id
    WHERE c.plan_id = v_plan
    GROUP BY c.id, c.name, c.weight, c.sort_order
  ),
  uncat AS (
    SELECT
      COALESCE(SUM(k.earned_points), 0) AS u_earned,
      COALESCE(SUM(k.points), 0) AS u_possible,
      COUNT(k.points)::integer AS u_count
    FROM kept k
    WHERE k.grading_category_id IS NULL
      OR NOT EXISTS (SELECT 1 FROM public.grading_categories c
                     WHERE c.id = k.grading_category_id AND c.plan_id = v_plan)
  ),
  weight_base AS (
    SELECT SUM(cr.cat_weight) AS active_weight
    FROM cat_rollup cr
    WHERE cr.cat_possible > 0
  ),
  cats_out AS (
    SELECT
      cr.cat_id AS o_category_id,
      cr.cat_name AS o_category_name,
      cr.cat_weight AS o_weight,
      CASE WHEN cr.cat_possible > 0 AND wb.active_weight > 0
           THEN ROUND(cr.cat_weight * 100.0 / wb.active_weight, 4)
           ELSE NULL END AS o_normalized_weight,
      ROUND(cr.cat_earned, 2) AS o_earned,
      ROUND(cr.cat_possible, 2) AS o_possible,
      CASE WHEN cr.cat_possible > 0
           THEN ROUND(cr.cat_earned * 100.0 / cr.cat_possible, 2)
           ELSE NULL END AS o_pct,
      cr.cat_count AS o_graded_count,
      (cr.cat_possible > 0) AS o_included,
      cr.sort_order AS o_sort
    FROM cat_rollup cr CROSS JOIN weight_base wb
  ),
  uncat_out AS (
    -- Uncategorized graded work: it IS the grade when no categories exist;
    -- otherwise it is reported but not weighted.
    SELECT
      NULL::uuid AS o_category_id,
      'Uncategorized'::text AS o_category_name,
      NULL::numeric AS o_weight,
      CASE WHEN NOT EXISTS (SELECT 1 FROM cat_rollup) AND u.u_possible > 0
           THEN 100.0 ELSE NULL END AS o_normalized_weight,
      ROUND(u.u_earned, 2) AS o_earned,
      ROUND(u.u_possible, 2) AS o_possible,
      CASE WHEN u.u_possible > 0 THEN ROUND(u.u_earned * 100.0 / u.u_possible, 2)
           ELSE NULL END AS o_pct,
      u.u_count AS o_graded_count,
      (NOT EXISTS (SELECT 1 FROM cat_rollup) AND u.u_possible > 0) AS o_included,
      9998 AS o_sort
    FROM uncat u
    WHERE u.u_count > 0
  ),
  all_rows AS (
    SELECT * FROM cats_out
    UNION ALL
    SELECT * FROM uncat_out
  ),
  total_row AS (
    SELECT
      NULL::uuid AS o_category_id, 'TOTAL'::text AS o_category_name,
      NULL::numeric AS o_weight, NULL::numeric AS o_normalized_weight,
      NULL::numeric AS o_earned, NULL::numeric AS o_possible,
      CASE WHEN SUM(ar.o_normalized_weight) FILTER (WHERE ar.o_included) > 0
           THEN ROUND(SUM(ar.o_pct * ar.o_normalized_weight)
                        FILTER (WHERE ar.o_included)
                      / SUM(ar.o_normalized_weight) FILTER (WHERE ar.o_included), 2)
           ELSE NULL END AS o_pct,
      COALESCE(SUM(ar.o_graded_count), 0)::integer AS o_graded_count,
      true AS o_included, 9999 AS o_sort
    FROM all_rows ar
  )
  SELECT t.o_category_id, t.o_category_name, t.o_weight, t.o_normalized_weight,
         t.o_earned, t.o_possible, t.o_pct, t.o_graded_count, t.o_included
  FROM (
    SELECT * FROM all_rows
    UNION ALL
    SELECT * FROM total_row
  ) t
  ORDER BY t.o_sort;
END;
$$;

REVOKE ALL ON FUNCTION public.classroom_grade_summary(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.classroom_grade_summary(uuid, uuid) TO authenticated;

-- ══════════════════════════════════════════════════════════════════════════
-- J. Data migration: fold existing assignments into one-item packages
-- ══════════════════════════════════════════════════════════════════════════
-- Every existing assignment becomes an assignment with exactly one item so
-- the item-based code path is the only one going forward. Idempotent.

INSERT INTO assignment_items
  (assignment_id, kind, title, book_id, chapter_start, chapter_end,
   quiz_id, prompt, is_required, sort_order)
SELECT
  a.id,
  CASE a.type
    WHEN 'chapter_read' THEN 'reading'
    WHEN 'trial'        THEN 'quiz'
    WHEN 'quiz'         THEN 'quiz'
    WHEN 'essay'        THEN 'writing'
    ELSE a.type          -- reading, discussion, annotation map 1:1
  END,
  a.title,
  a.book_id,
  a.chapter_range_start,
  a.chapter_range_end,
  a.quiz_id,
  COALESCE(a.essay_prompt, a.discussion_prompt),
  true,
  0
FROM assignments a
WHERE NOT EXISTS (SELECT 1 FROM assignment_items ai WHERE ai.assignment_id = a.id);

-- Seed per-item progress from existing submission state.
INSERT INTO assignment_item_progress
  (assignment_item_id, student_id, status, completed_at, score)
SELECT
  ai.id,
  s.student_id,
  CASE s.status
    WHEN 'not_started' THEN 'not_started'
    WHEN 'in_progress' THEN 'in_progress'
    ELSE 'complete'    -- submitted, graded
  END,
  CASE WHEN s.status IN ('submitted', 'graded') THEN COALESCE(s.submitted_at, s.graded_at) END,
  s.score
FROM assignment_items ai
JOIN assignment_submissions s ON s.assignment_id = ai.assignment_id
ON CONFLICT (assignment_item_id, student_id) DO NOTHING;
