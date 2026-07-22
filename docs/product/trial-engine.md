# The Trial Engine

**Owner:** Trial_Engine_Engineer · **Status:** built · **Code:** `src/lib/trials/` (types · engine · adapters · demo) + `src/components/trials/session/` (UI)

Trials are Tome's assessment moments: short, kind, text-anchored question sessions that turn reading into Wisdom. The engine builds **on** the existing six-type system (`src/lib/trials/question-types.ts`, `validators.ts`) — its schemas and validators are reused unchanged — and extends it to fifteen question families behind one typed model, one deterministic session engine, and one polished component shell.

---

## 1 · Question-family catalog

All fifteen families share one base: `prompt`, passage `anchors` (paragraphId references), `rationale`, `evidenceAnchor`, a 3-level `hints` ladder, a `wisdom` value, and a difficulty tier.

| Family | Interaction | Answer model | Near-miss rule |
|---|---|---|---|
| `fill-the-line` | Poetry cloze — word bank or typing | Per-blank normalized match | ≥ half the blanks right |
| `find-the-evidence` | Click passage spans to mark a range | Selected range vs. correct range | Any overlap without exact match |
| `word-in-context` | Pick the gloss of a highlighted word | Single choice (legacy shape) | — |
| `match-pairs` | Drag cards onto slots (or tap/keyboard) | left → right mapping, all pairs | ≥ half the pairs right |
| `who-said-it` | Attribute a quote to a speaker | Single choice (legacy shape) | — |
| `recitation` | Progressive cloze — type from memory | Fuzzy full-passage match | ≥ 70% of tokens in place |
| `multiple-choice` | Stem + options, auto-submit | One `optionId` | Distractor flagged `nearMiss` |
| `true-false-with-reason` | Verdict, then justifying reason | `bool` + `reasonId` | Exactly one half right |
| `ordering` | Sortable list (drag or arrow keys/buttons) | Full id sequence | ≥ half already in place |
| `close-reading` | Passage + one deep question | One `optionId` | Distractor flagged `nearMiss` |
| `passage-identification` | Name the work / speaker / character | One `optionId` | Distractor flagged `nearMiss` |
| `vocabulary-in-context` | Infer meaning from context clues | One `optionId` | Distractor flagged `nearMiss` |
| `cross-reference` | Connect a theme across two passages | One `optionId` | Distractor flagged `nearMiss` |
| `reflection` | Open writing + self-assessment rubric | Free text + rubric checks | Earnest-but-short attempt |
| `short-answer` | Brief free response | Keyword coverage vs. reference | Coverage in the near-miss band |

`word-in-context` vs. `vocabulary-in-context`: the first recalls a known gloss of an archaic word; the second asks the learner to *infer* an unfamiliar word from context clues, with distractors mapped to specific misreadings.

## 2 · Data model

`src/lib/trials/types.ts` — zod-validated discriminated union `TrialItem`, keyed on `family`.

```ts
TrialItem = {
  id, prompt, difficulty: apprentice | scholar | master,
  anchors: { paragraphId, quote? }[],          // where the question comes from
  rationale: string,                            // why the answer is right
  evidenceAnchor: { paragraphId, quote? } | null, // the proof, highlighted post-answer
  hints: Hint[] (≤ 3, one per level),
  wisdom: number,                               // base Wisdom value
  family, content                               // per-family payload
}
```

- **Legacy reuse.** The six original families keep their existing zod content schemas and validators verbatim (`question-types.ts`, `validators.ts`).
- **Stable option ids.** New families answer with option/item **ids**, never indexes — so the engine may shuffle display order deterministically without corrupting grading.
- **Adapters** (`adapters.ts`) convert the two existing content sources into `TrialItem` without touching them: `fromTypedQuestion` (six-type rows) and `fromChapterQuestion(s)` (the legacy `ChapterQuestion` bank — including its `identification`, `tf_with_reason`, `close_reading`, `cross_reference`, and `reflection` shapes). Unmappable sparse rows return `null` instead of throwing.
- **Demo bank** (`demo-items.ts`): ten canonical items with full hint ladders and evidence anchors, for showcases and labs.

## 3 · Scoring & Wisdom rules

`src/lib/trials/engine.ts` — pure functions over a JSON-serializable `TrialSession`. No I/O; persistence belongs to the caller (`onSessionChange`, `serializeSession`).

| Rule | Default |
|---|---|
| Elegant answer (first try, no hints) | `wisdom × 1.25`, rounded |
| Hint penalty | L1 −10% · L2 −25% · L3 −40%, stacking, **capped at −60%** |
| Retry decay | `× 0.5` per prior failed attempt |
| Floor | a correct answer **never earns less than 1 Wisdom** |
| Near-miss / incorrect | 0 Wisdom, retry always available |

Feedback kinds: **elegant** · **correct** · **near-miss** (warm lean-in, partial-credit signal) · **incorrect-encouraging** (kind copy, seeded so it replays).

## 4 · Hint ladder pedagogy

Three levels, revealed in order, each one a little closer (contract shared with `src/lib/quiz-hints.ts`):

1. **Gentle nudge** — where to look; nothing given away.
2. **Narrow the field** — the approach or concept; a path closes.
3. **Point to evidence** — very close, but the learner still commits.

Each level's Wisdom cost is shown *before* revealing. Hints never lock out; the cap guarantees help never zeroes an award. Every reveal dispatches `HINT_USED { level }` to Virgil (`hint1` → `hint2` → `hint3` states).

## 5 · Keyboard map

| Key | Action |
|---|---|
| `1–9` | Select the nth visible option (choice families) |
| `H` | Toggle the hint drawer |
| `Esc` | Close the hint drawer |
| `Enter` | Submit (explicit-submit families) / Continue after feedback |
| `R` | Retry after a wrong or near-miss answer |
| `Tab` / `Space` / `Enter` | Full flow everywhere — every control is a real button/input |
| `Space`, `↑ ↓`, `Space` | Lift / move / drop a row (ordering, via dnd-kit keyboard sensor) |
| Activate card → activate slot | Keyboard/button alternative to drag (match-pairs) |
| `↑` / `↓` buttons | Explicit reorder alternative on every ordering row |

## 6 · Reduced-motion behavior

Every animation routes through `pickTactile(name, reduced)` from `src/lib/design/motion.ts`, honoring `prefers-reduced-motion` (or the `reducedMotion` prop):

- Feedback panels: jade/amber wash fades in — no pop, no sway.
- Wisdom chip: final value appears instantly — no count-up, no sparkle.
- Match-pairs: no lift/shake — border + icon state only.
- Completion: rows fade in together instead of staggering.
- Virgil: the runtime itself collapses loops and blinks to still poses.

## 7 · The anti-punishment rule

**Reading is never locked behind performance.** There are no lives, no lockouts, no fail states:

- A wrong answer costs nothing but that question's Wisdom bonus.
- Retries are unlimited and always one tap away ("Try again — no penalty").
- Reflections are never marked incorrect; an earnest attempt completes.
- Near-misses are framed as invitations ("One detail turns the lock"), never as failures, and never trigger a shake animation.
- Incorrect feedback copy is encouraging by construction (seeded from a fixed pool of kind lines).

## 8 · Deterministic demo mode

`createTrialSession({ items, seed })` — all shuffling (option order, word banks, ordering scramble, recitation masks) and all feedback-line selection derive from a mulberry32 PRNG seeded by `(seed, itemId)`. Same seed + same items ⇒ byte-identical session, suitable for screenshots, walkthroughs, and replay debugging. `DEMO_TRIAL_SEED` + `DEMO_TRIAL_ITEMS` give a canonical showcase set.

## 9 · Component surface

`src/components/trials/session/`:

- **`TrialPlayer`** — the drop-in integration: engine session + family routing + keyboard map + Virgil dispatch + completion screen. Props: `items`, `seed`, `title`, `rules`, `virgilVariant`, `onComplete(summary, session)`, `onSessionChange(session)`.
- **`TrialShell`** — presentational chrome: family chip, progress bar, Wisdom chip, hint toggle, Virgil corner, feedback slot.
- **`HintDrawer` · `FeedbackPanel` · `WisdomChip` · `VirgilCompanion`** — composable shell pieces.
- **Family renderers** (`families/`): `ChoiceTrial` (all seven option-based families), `FillTheLineTrial`, `FindTheEvidenceTrial`, `MatchPairsTrial`, `OrderingTrial`, `TrueFalseReasonTrial`, `WritingTrial` (reflection + short-answer), `RecitationTrial`.

Virgil integration: the player forwards engine outcomes as semantic `VirgilEvent`s — `HINT_USED {level}`, `ANSWER_CORRECT {streak}`, `ANSWER_ELEGANT`, `ANSWER_NEAR_MISS`, `ANSWER_INCORRECT`, `WISDOM_EARNED {amount}` — through `VirgilCompanion` (a compact `bust` Virgil driven by `useVirgilMachine`).

All color comes from Living Archive `--la-*` tokens; all motion from the 20 tactile presets. No new colors, no bespoke easings.
