# The Core Loop — Tome's Transparent Rewards

**Author:** Rewards_And_Game_UI_Engineer (Tome rebuild team)
**Date:** 2026-07-22 · **Branch:** `kimi/tome-virgil-maximalist-demo-20260722`
**Implementation:** `src/lib/game/economy.ts` (rules) · `src/components/rewards/` (primitives) · `src/components/game/` (path + crescendo) · `src/lib/game/sound.ts` (sound pack)
**Inputs:** Master Plan §11 'Game economy' + 'Home / Journey', §9 motion · `docs/design/motion-vocabulary.md` · `docs/design/component-inventory.md`

This document is the public, plain-language statement of Tome's reward
rules. Everything written here is implemented verbatim in
`src/lib/game/economy.ts` and verified by `economy.test.ts`. If the
code and this page ever disagree, that is a bug — report it.

---

## The loop in one paragraph

Read a few pages. Prove what you understood in a short Trial. Earn
Wisdom, keep the hearth Flame warm, and — when a book's whole path is
walked — receive its Seal, which restores one tile of the Stoa, the
gallery that remembers everything you've read. Then pick up the next
book. Nothing here can be bought, rushed, or lost to guilt.

## What earns Wisdom

Wisdom is the counter for effort. It only ever goes up.

| Action | Wisdom |
|---|---|
| Finish a page in the reader | 2 |
| Complete a chapter | 20 |
| Pass a Trial | 50 |
| Flawless Trial (bonus) | +25 |
| Trial passed without hints (bonus) | +10 |
| Save a journal reflection | 8 |
| Answer a Stoa plaque prompt | 8 |
| First session of a new day | 5 |

Proving beats clicking, on purpose: a passed Trial is worth more than
any amount of idle tapping. Wisdom is **earned by reading and proving —
never bought**. There is no purchase affordance anywhere in the product,
and the counter never decreases.

**Levels.** Levels rise on lifetime Wisdom along a gentle curve
(cumulative `80 × (level − 1)^1.6`, rounded to 25s). Early levels arrive
quickly so a new reader feels the shape of the journey; later levels
take real reading. Leveling up is celebrated with a single restrained
burst — the system's only one.

## What secures the Flame

The Flame is a hearth, not a whip. Any qualifying reading activity on a
day — a page finished, a Trial attempted — **secures** that day's flame
and extends the day count by one.

- **Grace is structural.** Every reader always holds **2 pre-granted
  freeze days**. They are never earned and never bought; they simply
  exist. A fully missed day silently consumes one freeze instead of
  breaking the streak — no pop-up, no decision, no pressure.
- **At-risk is kind.** When yesterday was active but today has none
  yet, the flame dims gently with the neutral line *"Read a page today
  to keep the hearth warm."* No countdown, no alarm color, no mascot
  distress, no guilt copy.
- **Extinguishment is a state, not an error.** If misses outrun the
  freezes, the flame goes dark and the count resets. Returning the next
  day **rekindles** it: a warm day-one, freezes fully re-granted, with
  a clear earn-back path. Nothing shames the reader for being away.

## How Seals unlock

One violet Seal per book, with one fixed, transparent rule:

> **Read every chapter and pass every Trial in the book.**

Perfection is never required — Seals reward completion and
understanding, not flawlessness. Locked Seals are visible and
focusable, and always state their earning path. Unlocking a Seal plays
a short coin-turn ceremony, and **each Seal restores exactly one tile
of the Stoa** — a permanent, visible record of effort in the reader's
gallery, with provenance on every plaque.

## Anti-exploit rules

Rewards must measure reading, not gaming. `economy.ts` enforces:

- **Rolling rate caps per action.** Each action pays out at most N
  times per rolling hour and per rolling UTC day (e.g. journal entries
  6/hour, 12/day). Exceeding a cap never punishes: the action still
  counts toward progress, it simply stops granting Wisdom until the
  window reopens.
- **Daily total ceiling.** No more than **1,000 Wisdom** per UTC day
  across all actions combined.
- **Idempotence.** The same event applied twice grants once — Flame
  and award logic are pure functions of their inputs and safe to retry.
- **Clock-skew defense.** A device clock moving backwards is swallowed
  as "no change," never as a broken streak.

## Accessibility commitments

- Every component implements the full 8-state matrix (idle, hover,
  focus, pressed, loading, success, error, disabled) with visible
  3px focus rings and keyboard parity (Enter/Space activates, arrows
  move across path nodes, Esc dismisses trays).
- `prefers-reduced-motion` collapses every ceremony to an instant or
  short-fade state settle. The same information always lands.
- Sound is **muted by default**, plays only after an explicit user
  choice, persists via localStorage, and offers a full mute API. All
  cues are procedurally synthesized — no external samples, and no
  harsh failure buzz anywhere.
- Reward state is never conveyed by color or motion alone: every
  element carries text or an accessible label.

## Classroom implications

- **Hint use is logged for teachers, never penalized** — Wisdom awards
  for hint-free Trials are a bonus, not a tax on asking for help.
- Teacher surfaces show the same sober numbers (pages, Trials,
  secured days) without game color; streak data is presented as
  engagement signal, never as a discipline metric.
- Because caps make grinding worthless and Wisdom can't be bought,
  leaderboard-style comparisons measure genuine reading. We still
  recommend teachers emphasize personal progress over ranking.

## No-dark-patterns commitments

1. Nothing in the reward system is purchasable — no store, no gems,
   no "streak repair" upsell. Freeze days are pre-granted to everyone.
2. No guilt mechanics: no countdown timers on the Flame, no sad or
   angry character states after absence, no loss-framed copy.
3. Ceremonies peak at ~1.2 seconds, are skippable step-by-step, and
   never block the next action.
4. Near-miss feedback leans in warmly; error motion never mimics
   punishment, and haptics never fire on any failure state.
5. The reward rules are published in this document and mirrored by
   deterministic tests; any divergence is treated as a defect.
