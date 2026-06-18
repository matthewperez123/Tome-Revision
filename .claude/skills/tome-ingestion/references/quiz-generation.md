# Reference — Quiz & Question Generation

Read this before generating any quiz. Every shape below is taken from real rows
in `tome-app`'s `quizzes` / `questions` tables. Match them exactly — they are
bound by check constraints and the reader renders them.

## Contents
- [The two tables](#the-two-tables)
- [Dual-encoding](#dual-encoding-do-this-for-every-question)
- [Per-type shapes](#per-type-shapes-the-four-in-use-types)
- [Difficulty calibration & category mix](#difficulty-calibration--category-mix)
- [Quality bar](#quality-bar)
- [Idempotency & insertion](#idempotency--insertion)
- [Validation](#validation-run-after-each-book)

## The two tables

**`quizzes`** — one per (book, difficulty):

| column | rule |
|---|---|
| `id` | uuid, default `gen_random_uuid()`. |
| `book_id` | parent `books.id` slug (FK). |
| `title` | match the existing convention — sample `select title, difficulty from quizzes where book_id = 'moby-dick'` first. |
| `difficulty` | **`Apprentice` / `Scholar` / `Master`** — Capitalized. Check constraint; wrong casing = insert error. |
| `question_count` | `5`. |

**`questions`** — five per quiz:

| column | rule |
|---|---|
| `id` | uuid. |
| `quiz_id` | FK → `quizzes.id`. |
| `question_text` | the prompt. |
| `type` | see "Types" below. Default/most common: `multiple_choice`. |
| `category` | one of `factual`, `thematic`, `analytical`, `literary`, `contextual`. |
| `option_a` … `option_d` | legacy 4-option columns (see dual-encoding). |
| `correct_option` | `A` / `B` / `C` / `D` (check constraint). |
| `options` | jsonb array (see dual-encoding). |
| `correct_answer` | the full correct-answer string. |
| `meta` | jsonb, type-specific (see per-type shapes) or `null`. |
| `order` | integer **0–4**, position within the quiz. |
| `explanation` | specific, text-grounded rationale (one or two sentences). |

## Dual-encoding (do this for every question)

Populate **both** the legacy columns and the new jsonb columns, consistently:

- `option_a..d` mirror the answer choices; unused slots are the literal string `"n/a"`.
- `correct_option` is the letter of the correct choice.
- `options` is a jsonb **array** of the choice strings in the same order as `option_a..d`.
- `correct_answer` is the full text of the correct choice (must equal the `options` entry that
  `correct_option` points to).

## Per-type shapes (the four in-use types)

Default to these four — they are confirmed to render. Do not emit the other nine permitted types
without the user confirming reader support.

### `multiple_choice`
Four distinct options, one correct. `meta = null`.

```
question_text: "Why is Don Quixote often called the first modern novel?"
option_a: "For its great length"
option_b: "For its verse form"
option_c: "For its illustrated maps"
option_d: "For its psychological realism, irony, and self-conscious play with fiction and reality"
correct_option: "D"
options: ["For its great length","For its verse form","For its illustrated maps","For its psychological realism, irony, and self-conscious play with fiction and reality"]
correct_answer: "For its psychological realism, irony, and self-conscious play with fiction and reality"
meta: null
```

### `true_false`
Two options, fixed. `meta = null`.

```
question_text: "R.U.R. introduced the word 'robot' to the world."
option_a: "True"   option_b: "False"   option_c: "n/a"   option_d: "n/a"
correct_option: "A"
options: ["True","False"]
correct_answer: "True"
meta: null
```

### `fill_blank`
Blank marked with `___` in the prompt. The answer goes in `option_a` (b/c/d = `"n/a"`),
`correct_option = "A"`, **`options` is an empty array `[]`**, and `meta` carries accepted variants for
lenient grading.

```
question_text: "Fill in the blank: The Republic asks what ___ is, and builds an ideal city to find it."
option_a: "justice"   option_b: "n/a"   option_c: "n/a"   option_d: "n/a"
correct_option: "A"
options: []
correct_answer: "justice"
meta: {"acceptedVariants": ["justice"]}
```

### `vocabulary_in_context`
MCQ-shaped (four options, one correct), but `meta` names the word being defined.

```
question_text: "Dantès sees himself as an agent of \"providence\"; providence means:"
option_a: "Random luck"
option_b: "Divine guidance or care over events"
option_c: "Human law"
option_d: "A bank"
correct_option: "B"
options: ["Random luck","Divine guidance or care over events","Human law","A bank"]
correct_answer: "Divine guidance or care over events"
meta: {"vocabWord": "providence"}
```

> Full permitted `type` enum (for reference only): `multiple_choice`, `true_false`, `fill_blank`,
> `passage_id`, `theme_analysis`, `ordering`, `matching`, `vocabulary_in_context`, `cross_reference`,
> `close_reading`, `reflection`, `identification`, `tf_with_reason`. The last nine are unused in
> production — confirm reader support before generating them.

## Difficulty calibration & category mix

Each quiz is 5 questions. Aim for variety of `type` within the quiz, and let `category` track the
difficulty:

- **Apprentice** — comprehension and recall: who/what/where, key events, basic terms. Mostly
  `factual`, some `literary`. Lean on `true_false`, `fill_blank`, and straightforward
  `multiple_choice`.
- **Scholar** — interpretation and craft: word-in-context, imagery, character motivation, structure.
  Mostly `literary` / `analytical`. Lean on `vocabulary_in_context` and interpretive
  `multiple_choice`.
- **Master** — synthesis and significance: theme, argument, why the work matters, historical/critical
  context, cross-currents within the text. Mostly `analytical` / `thematic` / `contextual`, with
  demanding `multiple_choice`.

The real distribution across the existing 1,455 questions skews `factual` (≈38%) and `literary`
(≈32%), with `analytical`, `thematic`, and `contextual` filling the harder tiers — a reasonable target
to match.

## Quality bar

- **Grounded:** every question and its correct answer must be verifiable from the actual book text,
  not from outside knowledge or plot summaries.
- **Clean distractors:** wrong options are plausible to someone who didn't read closely, but
  unambiguously wrong on the text. No "all of the above," no joke options that give the answer away.
- **No spoilers above the difficulty's scope** where it would undercut a first read.
- **Real explanations:** `explanation` must say *why* the answer is right with specific reference to
  the text. Do **not** reuse the generic placeholder "See the text for the relevant passage and
  context." that appears in some legacy rows — that is the floor you're raising.

## Idempotency & insertion

Before creating a quiz, check for an existing one at that difficulty and skip if present:

```sql
select difficulty from quizzes where book_id = :book_id;
-- create only the difficulties missing from this set
```

Insert the quiz row, capture its `id`, then insert exactly five `questions` with `order` 0–4. Never
create a second quiz at a difficulty a book already has — a full-canon re-run must be a no-op for
already-complete books.

## Validation (run after each book)

```sql
select q.difficulty, count(qq.id) as n,
       bool_and(qq.correct_option = any(array['A','B','C','D'])) as letters_ok,
       bool_and(qq.options is not null and qq.correct_answer is not null) as json_ok
from quizzes q left join questions qq on qq.quiz_id = q.id
where q.book_id = :book_id
group by q.difficulty;
-- expect 3 rows (Apprentice, Master, Scholar), n = 5 each, letters_ok and json_ok true
```

Then eyeball two or three questions: confirm `correct_answer` equals the `options` entry that
`correct_option` points at, and that the answer is actually defensible from the text rather than from
general knowledge.
