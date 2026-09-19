# Tome Quiz Standard (Phase 3, 2026-09-18)

The canonical rules for platform reader quizzes and teacher quizzes. This is
the standard `scripts/canon-quiz-validate.ts` enforces and
`scripts/quizzes/rebalance-types.ts` generates against.

## The 16-type canonical vocabulary

One shared vocabulary across the platform (`questions.type`) and teacher
(`teacher_quiz_questions.question_type`) stacks, enforced by check constraints
(migration `20260918030000_question_types_unified.sql`):

**13 platform types** — `multiple_choice`, `true_false`, `fill_blank`,
`identification`, `ordering`, `vocabulary_in_context`, `passage_id`,
`matching`, `close_reading`, `tf_with_reason`, `theme_analysis`,
`cross_reference`, `reflection`.

**+3 teacher-only** — `multiple_select`, `short_answer`, `free_response`.
`short_answer` is objective when `meta.acceptedAnswers[]` is present,
otherwise open-ended (rubric) — the rule lives once in
`src/lib/questions/classify.ts`.

## One grader, one renderer registry

- **Grader**: `src/lib/questions/grade.ts` — pure, no I/O, all 16 types.
  Wire formats: `multiple_select` = comma-joined set; `tf_with_reason` =
  `"<bool>|<reasonIndex>"` (boolean right / reason wrong = 0.5 credit);
  `ordering` = JSON array; `matching` = JSON object. Open types return
  `{ kind: "pending" }` — never a zero on grader failure.
- **Renderers**: `src/components/trials/questions/index.tsx`
  (`QUESTION_RENDERERS`) — one renderer per type, used by both the reader
  trial overlay and the teacher `QuizAttemptRunner`.
- **Adapters**: `src/lib/db-chapter-questions.ts` (platform rows) and
  `src/lib/questions/adapt-teacher-question.ts` (teacher rows) both produce
  the same `ChapterQuestion` shape. `meta` keys mirror renderer props exactly.

## The canon standard: 3 × 5 with the type ladder

Every book gets **3 quizzes × 5 questions** (`quizzes.question_count = 5`,
`order` 0–4, dual-encoded legacy + JSONB per the canon ingestion skill), with
a fixed **type ladder** so a book's 15 questions span the 13 platform types
with ≤ 2 per type across the set:

| Difficulty | Types (slots 0–4) |
| --- | --- |
| Apprentice | `multiple_choice`, `true_false`, `fill_blank`, `identification`, `ordering` |
| Scholar | `vocabulary_in_context`, `passage_id`, `matching`, `close_reading`, `tf_with_reason` |
| Master | `theme_analysis`, `cross_reference`, `reflection`, `multiple_choice` (analytical), `close_reading` (or `identification`) |

Generation is grounded in the book's actual text (first ~60k chars of body
chapters + synopsis); explanations must be specific — the phrase "See the
text for the relevant passage" is banned and validated against.

## Validation

`scripts/canon-quiz-validate.ts`: 5 questions per quiz, ≥ 4 distinct types
per quiz, all 13 types across the book's set, no banned explanation phrase,
dual-encoding consistency. Failures re-queue once via the
`quiz_generation_runs` ledger, then log.

## Backfill / rebalance

`npx tsx scripts/quizzes/rebalance-types.ts --scope=all --commit` —
idempotent and resumable (ledger `quiz_generation_runs`); regenerates only
slots whose type is wrong, keeps good rows. Model: Sonnet 4.6, batches of 20,
concurrency 3. Requires `ANTHROPIC_API_KEY` with credit.
