---
name: tome-ingestion
description: >-
  The content-authoring pipeline for Tome (the Next.js + Supabase classics app
  in this repo): onboarding a new book end-to-end and writing the
  text-grounded quizzes the reader renders. Use this skill whenever the user
  wants to ingest, onboard, or add a book/title; download and parse an
  EPUB; insert a book + its chapters + author bio into Supabase; write
  scholarly annotations for a book; or generate, write, regenerate, backfill,
  or fix quizzes/questions — even if they only say "ingest Wuthering Heights",
  "add Dracula", "onboard the next priority book", "write quizzes for
  moby-dick", "the quiz explanations are generic, redo them", or "make the
  Master quiz harder". This is the authoritative source for the quizzes /
  questions table shapes, their check constraints, dual-encoding, and the
  Apprentice/Scholar/Master calibration — prefer it over the legacy
  scripts/generate-quizzes.ts, whose metadata-only output is the floor this
  skill exists to raise. For the *release* tail (audits → migrations → Vercel
  deploy), hand off to the tome-deploy skill.
---

# Tome Ingestion & Quiz Generation

This skill encodes how to bring a new book into **Tome** with the quality the
reader expects, and how to write quizzes that are grounded in the actual text
rather than in metadata. It is the content-authoring counterpart to
`tome-deploy` (which handles audits, migrations, and the Vercel release).

The arc for a full book onboarding:

```
download/parse EPUB → insert book + chapters → author bio → annotations → 3 grounded quizzes → verify
```

Each stage is opt-in. "Write quizzes for X" runs only the quiz stage against a
book that already exists. "Ingest X" runs the whole arc. Always lay out which
stages apply (a TodoList helps) so nothing is silently skipped.

## Operating principles

- **Grounded beats generic.** The reason this skill exists is that the legacy
  `scripts/generate-quizzes.ts` writes metadata questions ("Who wrote this?",
  "Which tradition?") with placeholder explanations. That is the floor. Real
  quizzes are verifiable from the book's own text — a reader who actually read
  the chapters should do well, and someone who only skimmed a summary should
  not. Read the text before you write about it.
- **Match the schema exactly.** The `quizzes` and `questions` tables are bound
  by check constraints (difficulty casing, `correct_option` letters) and the
  reader maps rows to its question engine. A wrong enum value is a hard insert
  error; a malformed `options`/`correct_answer` pair renders a broken question.
  `references/quiz-generation.md` is the contract — follow its shapes to the
  letter.
- **Writes go through the connected Supabase MCP**, not local `.env` secrets.
  Use `execute_sql` for inserts and read-back, `list_tables` /
  `generate_typescript_types` to confirm a column before you depend on it. Only
  fall back to the REST scripts (which need `SUPABASE_SERVICE_ROLE_KEY`) if the
  MCP is unavailable and the user asks.
- **Idempotency is the design.** Before writing a quiz at a difficulty, check
  whether one already exists for that `(book_id, difficulty)` and skip if so. A
  re-run over the whole canon must be a no-op for already-complete books. The
  same holds for book/chapter inserts — check by `id` first.
- **Dry-run by default when asked.** For review-before-write, emit the planned
  `INSERT` statements to a `.sql` file under `scripts/output/` instead of
  executing them, show the user the file, and only execute on approval. This is
  the safe way to preview a book's quizzes before they touch the live DB.
- **This is not the Next.js you know.** Per `AGENTS.md`, app conventions differ
  from training data. This skill covers *content*, not app code — but if you do
  touch reader code, read `node_modules/next/dist/docs/` first.

Package manager is **pnpm**; script entry points are `npx tsx scripts/...`.

## Stage 0 — Confirm the target

- **Which book?** A title or slug. If onboarding from the queue, the book is in
  `scripts/priority-books.ts` (`PRIORITY_BOOKS`, ordered) with its Standard
  Ebooks slug, Gutenberg id, tradition, era, difficulty, genres, year, and
  paired painting. If the user names a title not in the queue, confirm the
  source EPUB before proceeding.
- **Which Supabase project?** Call `list_projects` and confirm the prod ref with
  the user (PROGRESS.md references `vjaezrcuuzmbmnsfrtwt`). Read-only inspection
  (`execute_sql` selects, `list_tables`) is fine anytime; confirm before writes.
- **What already exists?** `select id, content_available from books where id =
  '<slug>'` and `select difficulty from quizzes where book_id = '<slug>'`. This
  tells you whether you're inserting fresh or only filling gaps.

## Stage 1 — Download & parse the EPUB

For a queue book, the mechanical download + chapter-split is a single script:

```bash
npx tsx scripts/ingest-book.ts "<Title>"      # or --slug "<slug>"
```

It downloads from Standard Ebooks (Gutenberg fallback), splits the EPUB into
chapters, and writes `/tmp/tome-ingest/<slug>/`:
`metadata.json`, `chapters/NNN.html`, `chapters/NNN.meta.json`. It does **no**
DB work — that's the next stages. Read its summary: chapter count, word count,
and whether the cover (`public/covers/<slug>.webp`) exists.

For prose books destined for the public reader, the alternative path is
`scripts/ingest-se-books.ts` (writes `public/content/<slug>/meta.json` +
`ch-N.json` and appends `src/data/chapters.ts`); for Shakespeare,
`scripts/ingest-shakespeare.ts`. See `references/ingestion.md` for which path to
use and the exact file layouts.

## Stage 2 — Insert the book, author, and chapters

Confirm columns against the live schema first (`list_tables` or a
`select * ... limit 1`), then insert via the Supabase MCP `execute_sql`. The
shapes, the author-bio/metadata file conventions
(`scripts/ingest-data/<slug>-metadata.ts`, `<author-slug>-bio.ts`), and the
prose `chapters` table (`id, book_id, title, "order", content_html`) are all in
`references/ingestion.md`. Set `content_available = true` once chapters land so
the reader and the quiz stage treat the book as full-content.

## Stage 3 — Annotations (when the book gets the scholarly layer)

Tier-1 and structured works carry per-chapter/scene scholarly annotations and
glosses. Read the actual chapter text, then write 3–5 annotations per chapter
that illuminate something a careful reader would want — an allusion, a turn in
the argument, a structural echo — not plot summary. See `references/ingestion.md`
for where annotations live (drama: `scene_annotations` via
`scripts/sync-to-supabase.ts`; prose overlays under `src/lib`/`src/data`) and
the house voice.

## Stage 4 — Generate the quizzes  ← the heart of this skill

**Read `references/quiz-generation.md` in full before writing a single
question.** It is the contract for the `quizzes`/`questions` tables and is taken
from real production rows. The essentials:

- **Three quizzes per book**, one each at **`Apprentice` / `Scholar` /
  `Master`** (exact capitalization — check constraint). Five questions each,
  `order` 0–4.
- **Dual-encode every question**: populate both the legacy `option_a..d` +
  `correct_option` columns *and* the new `options` (jsonb array) +
  `correct_answer` (full string). They must agree. Unused legacy slots are the
  literal `"n/a"`.
- **Use the four confirmed-rendering types** — `multiple_choice`, `true_false`,
  `fill_blank`, `vocabulary_in_context` — and vary them within a quiz. The other
  nine permitted types are unused in production; don't emit them without the
  user confirming reader support.
- **Calibrate by difficulty**: Apprentice = recall/comprehension (mostly
  `factual`); Scholar = craft/interpretation (`literary`/`analytical`,
  word-in-context); Master = synthesis/significance
  (`analytical`/`thematic`/`contextual`).
- **Write real explanations** grounded in the text. Never reuse the legacy
  placeholder "See the text for the relevant passage and context."

Before inserting, check idempotency: `select difficulty from quizzes where
book_id = '<slug>'` and create only the missing tiers. Insert the `quizzes`
row, capture its `id`, then insert exactly five `questions`.

**Dry-run mode (default when the user wants to review):** instead of executing,
write the full `INSERT`s to `scripts/output/quizzes-<slug>.sql`, present the
file, and wait for a go.

## Stage 5 — Validate

After each book, run the validation query (also in
`scripts/validate-book-quizzes.sql`) and confirm three rows, five questions
each, letters and json populated:

```sql
select q.difficulty, count(qq.id) as n,
       bool_and(qq.correct_option = any(array['A','B','C','D'])) as letters_ok,
       bool_and(qq.options is not null and qq.correct_answer is not null) as json_ok
from quizzes q left join questions qq on qq.quiz_id = q.id
where q.book_id = :book_id
group by q.difficulty;
-- expect 3 rows (Apprentice / Scholar / Master), n = 5, letters_ok & json_ok true
```

Then spot-check two or three questions by eye: does `correct_answer` equal the
`options` entry that `correct_option` points at? Is the answer actually
defensible from the text? Report what landed (book row, chapter count, quiz/
question counts) and anything deferred (missing cover, annotations TODO).

To ship what you've written, hand off to the **tome-deploy** skill for the
audits → migration → Vercel deploy tail.

## Reference files

- `references/quiz-generation.md` — the authoritative quiz/question contract:
  table columns and constraints, per-type shapes, dual-encoding, difficulty and
  category calibration, the quality bar, idempotency, and validation. Read it
  before any quiz work.
- `references/ingestion.md` — the EPUB→DB mechanics: which ingest script to use,
  the `books`/`chapters` insert shapes, author bio + metadata file conventions,
  where annotations live, and the content/file layouts.
- `scripts/validate-book-quizzes.sql` — the Stage 5 validation query,
  parameterized by `book_id`.
