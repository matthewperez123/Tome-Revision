# UI / UX / Animation Audit — FINAL REPORT

_Completed 2026-04-20 on branch `tome-recovery`. No push performed — awaiting approval before Phase 8._

## Summary

| | |
|---|---|
| P0 issues identified | 2 |
| P0 fixed | 2 |
| P1 issues identified | 8 |
| P1 fixed | 8 |
| P2 issues identified | 6 |
| P2 fixed | 4 (P2-2, P2-4, P2-5 partial, P2-6) |
| P2 deferred | 2 (P2-1 awaits go-ahead, P2-3 collides with parallel session) |
| Commits authored | 11 |
| Files touched by my commits | 18 |
| Build status | `npm run build` blocked by pre-existing stoa data gap (not mine) |
| Type check | Clean (my files) — pre-existing test/e2e type errors unchanged |
| Runtime | Dev server healthy; library/reader/dashboard all render; BookCard+MobileDock verified at 375/1280 |

## Commits in order

| Commit | Scope |
|---|---|
| `9a9730e3` | `fix(shell): mount MobileDock in AppShell so 5-tab mobile IA renders` |
| `08172485` | `fix(book-card): stop rendering nested <a> by switching outer to div role=link` ⚠ inadvertently included 9 parallel-session landing files — see §Notes |
| `6e985e5e` | `fix(dashboard): rename XP → Wisdom and streak → Flame per lexicon` |
| `ffcf5791` | `fix(icons): replace emoji with Lucide icons per zero-emoji policy` |
| `3c194c6f` | `fix(fonts): anchor Georgia serif fallbacks on var(--font-serif)` |
| `37a3e33d` | `fix(supabase): cache browser client on globalThis under HMR` |
| `b3b93e2c` | `fix(a11y): convert parent-list div-onClick into a proper button` |
| `cb35a58f` | `fix(a11y): keep VirgilCompanion trigger out of tab order during fade-in` |
| `6b159b05` | `fix(a11y): respect prefers-reduced-motion in core UI primitives + Virgil` |
| `b8b9f883` | `feat(routing): add route-level error.tsx for app group and reader` |
| `b8904c84` | `chore: remove orphan VirgilPanel (replaced by unified VirgilDrawer)` |
| `ccb6d9ff` | `fix(icons): standardise X close-icon sizing + add focus rings` |
| `661dc90a` | `feat(tokens): add ease.sheet + easeArray and adopt in Virgil drawer` |
| `280e1182` | `fix(routing): drop asChild prop from error.tsx Button fallbacks` |

## Per-fix verification

### P0-1 — MobileDock mounted in AppShell
- Runtime at 375×812: `nav.fixed.bottom-0` found with 5 tabs — Home / Library / Read / Quiz / Profile, each 44px tall (thumb-target OK).
- Content padding added via `pb-[calc(56px+env(safe-area-inset-bottom))] min-[480px]:pb-0` so the dock doesn't obscure page content on phones.

### P0-2 — BookCard nested anchor fixed
- Runtime at `/library` 1280×800: 1,277 BookCards render as `<div role="link" tabindex="0" data-href="/book/...">`, zero `<a a>` in the DOM, zero hydration warnings in server logs after the fix.
- Keyboard: Enter or Space on a focused card triggers `router.push(bookHref)`; inner `AuthorLink` clicks route to `/author/<slug>` thanks to the `target.closest("a, button")` bypass.

### P1-1 — Dashboard lexicon
- Runtime at `/dashboard`: body contains `0 Wisdom`, `25 Wisdom`, `Day Flame`, `Wisdom earned`. Zero matches for ` XP` or `Day streak`.
- State keys (`stats.xp_total`, `stats.current_streak`) unchanged — display-only renames.

### P1-2 — Reduced-motion coverage
- Ships in 6 strategic surfaces: `blur-fade`, `number-ticker`, `word-rotate`, `text-animate`, `page-transition`, `VirgilDrawer`.
- BlurFade alone is consumed by 70+ landing/dashboard/reader renders — cascades widely without a 187-file touch.
- `useReducedMotion` count went from 2 → 8 files (Phase 1 inventory had it at 2). All six high-reach primitives now either (a) collapse to opacity-only, (b) set `duration: 0`, or (c) short-circuit to a plain element.

### P1-3 — Route-level error.tsx
- `src/app/(app)/error.tsx` — app-group fallback with `RotateCcw` Try Again + Back to Dashboard.
- `src/app/(app)/read/[bookId]/error.tsx` — reader-specific copy with Open Library fallback.
- Both use Next's provided `reset()`. Both log `error.digest` for forensics.

### P1-4 — Emoji → Lucide
- `step-teacher-tradition.tsx`: 8 flag/symbol emoji → Lucide (Landmark, Crown, Flower2, Star, Flag, BookOpen, Globe, Brain).
- `data/books.ts`: 16 ✅ in `//-comments` → `[x]`.
- `clubs-data.ts` + `clubs/[clubId]/page.tsx`: feather 🪶 in two Virgil demo-post bodies removed.
- Grep confirms zero unicode emoji remain across `src/`.

### P1-5 — Georgia serif fallbacks anchored to `var(--font-serif)`
- 7 files updated. All inline `fontFamily` declarations now lead with `var(--font-serif, ...)`, preserving the existing Georgia + serif chain as a fallback stack.

### P1-6 — Supabase singleton guard
- `src/lib/supabase.ts` now caches the client on `globalThis.__tomeSupabaseClient`. Under HMR re-evaluation returns the cached instance instead of creating a fresh `GoTrueClient`.

### P1-7 — `<div onClick>` → `<button>`
- `teacher/parents/page.tsx` parent list row converted to `<button>` with `aria-pressed`, `aria-label`, and focus-visible ring.
- Modal-backdrop `<div onClick>` in scene-clients + structured-hamlet-reader left intentionally — they are idiomatic click-outside-to-close with an explicit X button inside.

### P1-8 — Virgil trigger focusability during fade-in
- `VirgilCompanion.tsx` now flips `tabIndex`, `aria-hidden`, and `pointer-events` on a local `revealed` state ~320ms after mount (matches the 0.3s opacity curve). Keyboard Tab can no longer land on an invisible target.

### P2-2 — `ease.sheet` token + inline duration cleanup
- `design-tokens.ts` adds `ease.sheet` (CSS string) + `easeArray.sheet` ([0.32, 0.72, 0, 1]).
- `VirgilDrawer` + `VirgilTrigger` now reference the token. Remaining inline durations (≈6 files) deferred — see §Deferred.

### P2-4 — X close-icon sizing
- Standardised: `size-4` for inline chip close (`message-inline-card`), `size-5` for modal/overlay close (`chapter-quiz-overlay`, `station-editor-modal`).
- Added `aria-label` + focus-visible ring on each.

### P2-5 — Focus-visible rings
- Not run as a global sweep. Added incrementally on every button I touched (BookCard, VirgilCompanion, parent-list button, three close buttons). Rest of the codebase's raw `<button>`s deferred.

### P2-6 — Orphan VirgilPanel deleted
- 301-line file removed. Grep confirmed no dynamic imports, no string-literal references.

## Deferred / out-of-scope

| Item | Reason |
|---|---|
| **P2-1** motion package consolidation (130 files: `framer-motion` → `motion/react`) | Stop-and-ask per pre-agreed checkpoint — blast radius too large to execute without your go-ahead. |
| **P2-3** per-work editorial hex colors → `data-work` CSS vars | Parallel session actively editing per-work annotation files (`faerie-queene`, `odyssey`, Matthew's other session). Editing those surfaces now would create merge conflicts. Deferred until the homepage-cleanup session lands. |
| Rest of the raw-`<button>` focus-ring sweep (~275 elements) | Out of scope for this pass; top surfaces handled incrementally. |
| `loading.tsx` on remaining 54 routes | Scope constraint — three high-traffic routes only was the agreed P1-3 scope; the app-group `error.tsx` covers error UX for all 54 app routes anyway. |
| Driver.js onboarding walkthrough | Library not installed; phase spec item had no subject. |
| Rhyme-scheme toggle, Standards alignment, Roster import, Semester Plan | Out of scope ("no new features") — features don't exist in app. |

## Known pre-existing blockers (NOT from my changes)

1. **`npm run build` prebuild fails** — `scripts/audit-stoa-collection.ts --strict` reports:
   ```
   MISSING METADATA: "orlando-madness-dore" has no sourceUrl
   ```
   This entry pre-existed the audit (last touched in commit `87e6744a`). The `sourceUrl` field is empty string. Options: (a) add the correct Archive.org / Hachette source URL (I can't guess it safely), (b) relax the strict-mode rule temporarily, (c) accept failed CI build and fix later. **Needs your call.**

2. **e2e + sidebar `__tests__` type errors** — `@playwright/test` and `vitest` are referenced without being installed. Pre-existing, unchanged by my work.

3. **Commit `08172485` inadvertently included 9 parallel-session landing files** (`AuthorShowcase`, `BookClubsShowcase`, `FriendsProfilesShowcase`, `HomepageContent`, `MiddleEnglishGlossesShowcase`, `PlaysFormattingShowcase`, `TimelinesShowcase`, `VerseFormattingShowcase`, `teacher/GuidedLearningShowcase`). These were already in the git index when I ran `git commit` — `git add src/components/tome/book-card.tsx` added to the existing index, and the commit captured everything. Since then I've used `git reset HEAD` before every `git add` to stage explicit paths only — remaining 12 commits are clean.
   - **Resolution options:** (a) leave as-is (message is slightly inaccurate but no content is lost), (b) `git rebase -i` to split 08172485 into two commits — one mine, one attributed to the parallel session. I'd rather not rebase without your explicit go-ahead given the parallel-session context.

## Runtime verification (post-fix, dev server)

| Route | Check | Result |
|---|---|---|
| `/` | Landing renders, hero shows Creation of Adam, BOOKS carousel loads | ok |
| `/dashboard` | "0 Wisdom", "Day Flame", "Wisdom earned" present; no "XP" | ok |
| `/library` | 1,277 BookCards as `div[role=link]`; zero `a a` nested | ok |
| `/library` at 375×812 | MobileDock 5 tabs visible, 44px target height | ok |
| `/read/the-odyssey` | Literata prose at 616px width, no max-width violation | ok |
| `/read/the-odyssey` | Virgil drawer renders on annotation click with correct bottom-sheet physics | ok |
| `/onboarding` | Step 1 renders without error | ok (step 7 teacher-tradition not spot-reached; file parses) |
| Console errors after fixes | No hydration `<a>-in-<a>` warnings; stale build errors for deleted files cleared on HMR reload | ok |

## Status before Phase 8

- **Do NOT push yet.** Pre-existing stoa build block + the 08172485 commit-mix need your call.
- All my commits are granular on `tome-recovery`. 14 new commits since audit started.
- Branch diff summary to follow on your approval.

## Questions for you before `git push`

1. **Stoa audit strict-fail on `orlando-madness-dore`** — add a `sourceUrl`, or temporarily run the audit non-strict for this deploy? I will not invent a URL.
2. **Commit `08172485` mixed-file** — leave as-is or split via rebase?
3. **P2-1 motion-package consolidation** — approve 130-file bulk rename + drop `framer-motion` dep, or keep both and move on?
4. **Final push scope** — push all 14 commits to `tome-recovery`, or do you want to cherry-pick a subset?

_End of FINAL-REPORT._
