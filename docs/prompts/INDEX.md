# Tome — Master Prompt Library

This directory versions the master "lane" prompts under git. Committing these
files **versions the plan**; it does not execute anything. Each lane still runs
as its own Claude Code session, in the order encoded below.

## Run order (the queue)

1. **`housekeeping-marketing-cta`** (this lane) — docs + two marketing content edits. ✅ **merged** (`0ade1752`).
2. **`marketing-nav-determinism`** — **next up**. Nav mechanics already shipped
   (`a681f033…191f696a`); the one commit still parked ahead of `main` on that branch
   is the onboarding write-confirmation fix (`819f9c28`), pending its own review/merge.
3. **`stripe-full-integration`** — full billing cutover.
4. **`virgil-surfaces-functional`** — its entitlement stop resolves via #3, so it runs after Stripe.

Parallel-eligible after #2 (separate worktrees):
- **`asset-loadsave-reliability`** — no ordering constraints beyond "after #2".
- **`classroom-live-loop`** — Phases 2 and 5 wait for the quiz return-loop fix.
- **`student-badge-login`** — runs after #2, **never** alongside #2 or #3.

Fences never to break: `marketing-nav-determinism` and `housekeeping-marketing-cta`
are sequential, never concurrent (both touch the marketing nav). `student-badge-login`
never runs alongside `marketing-nav-determinism` or `stripe-full-integration`.

## Prompt table

| File | Surface it owns | Must-not-run-concurrently-with | Supersedes | Status |
|------|-----------------|--------------------------------|------------|--------|
| `tome-housekeeping-marketing-cta.md` (this lane) | `docs/prompts/`, marketing nav CTA, marketing `/library` hero | `marketing-nav-determinism` | `marketing-nav-determinism` Phase-2 CTA wording | `merged` |
| `tome-marketing-nav-determinism.md` | Marketing top-nav mount + auth-slot determinism | `housekeeping-marketing-cta` | — | `merged`¹ |
| `tome-stripe-full-integration.md` | Stripe billing (checkout, webhook, entitlement) | `student-badge-login` | SHIP master's Stripe phases | `queued` |
| `tome-virgil-surfaces-functional.md` | Virgil generate→save→send surfaces | — (waits for Stripe entitlement) | — | `queued` |
| `tome-asset-loadsave-reliability.md` | Reader/library asset load + save reliability | — (parallel after #2) | — | `queued` |
| `tome-classroom-live-loop.md` | Classroom live quiz loop | quiz return-loop fix (Phases 2/5 gate) | SHIP master's Liveblocks phase | `queued` |
| `tome-student-badge-login.md` | Student badge / scan-to-enter login | `marketing-nav-determinism`, `stripe-full-integration` | — | `queued` |

Status values: `queued` → `running` → `final report` → `merged`.

¹ `marketing-nav-determinism` already fast-forwarded to `origin/main`
(`a681f033…191f696a`) **before** this housekeeping lane ran — the intended
1→2 order was inverted in practice. This lane's CTA swap therefore *supersedes*
the already-merged nav CTA rather than preceding it. The nav lane's mechanics
(single mount, resolve-once auth slot) stand; only its CTA wording is replaced here.

## File presence

The six lane prompt files and any historical master prompts
(`TOME-SHIP-school-launch-master.md`, `TOME-marketing-overhaul.md`, quiz-loop
prompts) are **not yet present** in this repo — none exist in the working tree,
tracked files, or git history on any branch. Drop the authored lane `.md` files
into this directory to complete the library; this INDEX is the run-order authority
regardless of which files have landed.
