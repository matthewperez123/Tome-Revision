-- [3.1] One 16-type question vocabulary across the platform and teacher stacks.
--
-- Canonical types (13 platform + 3 teacher-only additions):
--   multiple_choice, true_false, fill_blank, vocabulary_in_context, passage_id,
--   matching, ordering, close_reading, tf_with_reason, theme_analysis,
--   cross_reference, reflection, identification,
--   multiple_select, short_answer, free_response
--
-- Facts verified against prod before writing this migration:
--   * public.questions already has a `meta` jsonb column and a 13-type check.
--   * teacher_quiz_questions has NO meta column; its check allows the 8 teacher
--     types plus legacy `passage_id` (canonical, kept) and `vocabulary`
--     (legacy, folded into vocabulary_in_context). ZERO rows use either legacy
--     type today, so the data migration below is an idempotent no-op.
--   * teacher_quiz_results.score / total_points are integer; no view or
--     function pins those types (checked pg_views + pg_proc). Partial credit
--     (e.g. tf_with_reason half credit) needs fractional scores.

-- 1. teacher_quiz_questions gains the same meta contract as public.questions
--    (keys documented in src/lib/db-chapter-questions.ts QuestionMeta).
alter table public.teacher_quiz_questions
  add column if not exists meta jsonb not null default '{}'::jsonb;

-- 2. Fold legacy teacher `vocabulary` into `vocabulary_in_context`.
--    (No rows exist; kept for safety/idempotence on other environments.)
update public.teacher_quiz_questions
set question_type = 'vocabulary_in_context'
where question_type = 'vocabulary';

-- 3. Widen both type checks to the canonical 16.
alter table public.teacher_quiz_questions
  drop constraint if exists teacher_quiz_questions_question_type_check;
alter table public.teacher_quiz_questions
  add constraint teacher_quiz_questions_question_type_check
  check (question_type in (
    'multiple_choice', 'true_false', 'fill_blank', 'vocabulary_in_context',
    'passage_id', 'matching', 'ordering', 'close_reading', 'tf_with_reason',
    'theme_analysis', 'cross_reference', 'reflection', 'identification',
    'multiple_select', 'short_answer', 'free_response'
  ));

alter table public.questions
  drop constraint if exists questions_type_check;
alter table public.questions
  add constraint questions_type_check
  check (type in (
    'multiple_choice', 'true_false', 'fill_blank', 'vocabulary_in_context',
    'passage_id', 'matching', 'ordering', 'close_reading', 'tf_with_reason',
    'theme_analysis', 'cross_reference', 'reflection', 'identification',
    'multiple_select', 'short_answer', 'free_response'
  ));

-- 4. Fractional credit: result scores become numeric(6,2).
--    (teacher_quiz_responses.score is already numeric.)
alter table public.teacher_quiz_results
  alter column score type numeric(6,2) using score::numeric(6,2),
  alter column total_points type numeric(6,2) using total_points::numeric(6,2);
