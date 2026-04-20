# FIX-PLAN — UI/UX/Animation Audit

_Phases 1–5 complete. Findings consolidated below. No fixes applied yet — awaiting approval before Phase 6 execution._

Scope reminder: fix only what's broken or off-system. No new features. No redesigns. Respect the parallel homepage-cleanup session — don't touch `src/components/landing/**` or `src/app/(app)/page.tsx`.

---

## P0 — demo-blocking

### P0-1 · MobileDock is never mounted
The entire 5-tab mobile bottom navigation is **absent at runtime**. `MobileDock` is defined in `src/components/tome/mobile-dock.tsx` but no file imports it. `AppShell` (`src/components/tome/app-shell.tsx:44-52`) renders only `TopBar + AppSidebar + main`. On phones, users see the desktop sidebar (collapsible) and no bottom nav.

- **Evidence:** runtime inspection at 375×812 on `/library` found no `nav.fixed.bottom-0`; grep for imports of `MobileDock` returns only the definition file.
- **Fix:** mount `<MobileDock />` in `AppShell` alongside `<main>`, after the main content, inside the sidebar group. The component itself is already `min-[480px]:hidden` so it'll only show on narrow viewports. Do NOT edit `mobile-dock.tsx` or its `dockNav` config (code is ground truth for IA).
- **Commit:** `fix(shell): mount MobileDock in AppShell so the 5-tab mobile IA renders`

### P0-2 · `<a>` inside `<a>` hydration errors on every book card
`BookCard` (`src/components/tome/book-card.tsx`) renders an outer `<a href="/book/:id">` that contains an `AuthorLink` rendering a nested `<a href="/author/:slug">`. Invalid HTML per the spec; React emits hydration errors on every book grid render (landing carousel, library, dashboard "Continue Reading", dashboard "Trending This Week"). The component ALREADY notes the problem ("Intercept click so AuthorLink doesn't also trigger the outer <a>", line 182) — the click interception works for mouse but does not fix the DOM structure.

- **Evidence:** server log shows `In HTML, <a> cannot be a descendant of <a>. This will cause a hydration error.` on `/library` load. Same error stack appears at `/` landing with the `BookCard → a → AuthorLink → a` trace.
- **Fix:** change `BookCard`'s outer element from `<a>`/`<Link>` to a `<div role="link" tabIndex={0}>` with an `onClick` / `onKeyDown` (Enter/Space) navigator. Keep `AuthorLink` as a real anchor. Alternative (also acceptable): make `AuthorLink` detect context and render `<span>` when inside a card, but that requires a prop or context and is a bigger change.
- **Commit:** `fix(book-card): stop rendering nested <a> by switching outer to div role="link"`

---

## P1 — user-visible

### P1-1 · Dashboard gamification vocabulary drift
The dashboard header and stat tiles show **"XP"** and **"Day streak"**, violating the locked lexicon.

- **Evidence (snapshot at `/dashboard`):**
  - "Level 1 · **0 XP** · 0 / 100 to next level" (header)
  - Stat tile: "Total Wisdom" sits next to a second tile labeled **"XP earned"** (both reading 0)
  - Stat tile: **"Day streak"** with "Best: 0" (should read "Flame" + a Lucide flame icon)
- **Fix:** rename in-place. XP → Wisdom, streak → Flame. Replace any flame emoji with Lucide `Flame`. Do NOT rename the underlying state key in `economy.ts` (would cascade); only the display text.
- **Commit:** `fix(dashboard): rename XP → Wisdom and streak → Flame per lexicon`

### P1-2 · `useReducedMotion` coverage is ~1%
Only 2 of 189 animated files call `useReducedMotion` — both in the sidebar icon system. All landing showcases, Virgil drawer, Virgil chat, dashboard widgets, reader transitions, quiz overlays, and dialogs animate unconditionally.

- **Fix strategy:** start with the highest-impact surfaces (Virgil drawer, reader, quiz overlay, page transitions) — add `const prefersReduced = useReducedMotion()` and collapse transition objects to `prefersReduced ? { duration: 0 } : { ... }`. Do NOT rewrite every animation in one pass. Target ~15 files for this audit, leave the rest as `// TODO: reduced-motion` tagged for follow-up.
- **Surfaces to cover first:**
  - `src/components/reader/VirgilDrawer.tsx`
  - `src/components/reader/VirgilTrigger.tsx`
  - `src/components/tome/virgil/VirgilChat.tsx`
  - `src/components/tome/chapter-quiz-overlay.tsx`
  - `src/components/tome/paginated-reader.tsx`
  - `src/components/tome/page-transition.tsx`
  - `src/components/tome/notification-bell.tsx`
  - `src/components/tome/celebrations/CharacterUnlock.tsx`
  - `src/components/achievements/UnlockAnimation.tsx`
  - `src/components/ui/blur-fade.tsx` (already near-universal — single-file win)
  - `src/components/ui/text-animate.tsx`
  - `src/components/ui/word-rotate.tsx`
  - `src/components/ui/scroll-progress.tsx`
  - `src/components/ui/number-ticker.tsx`
- **Commit cadence:** one per file cluster — `fix(a11y): respect prefers-reduced-motion in VirgilDrawer + VirgilTrigger + VirgilChat`, etc.

### P1-3 · No per-route `error.tsx` boundaries
54/63 pages have no `loading.tsx`, and **0** pages have a route-level `error.tsx`. An uncaught error in the reader or any classroom page bubbles to the root, which shows a whole-app fallback.

- **Fix:** add `src/app/(app)/error.tsx` with a minimal client-component fallback (heading + "Return to Dashboard" + Reset button that calls `reset()`). Same for `src/app/(app)/read/[bookId]/error.tsx` (reader has the most complexity). Matching `loading.tsx` only for the three surfaces where missing loading has visible UX impact: `read/[bookId]/`, `quiz/[quizId]/`, `classroom/[id]/`.
- Do NOT spam `loading.tsx` into all 54 routes — audit says scope is minimal fix. Three surfaces is enough for preview.
- **Commit:** `feat(routing): add route-level error.tsx for app group and reader`

### P1-4 · Emoji in product data
- `src/data/books.ts` — `{ id: "russian", label: "Russian", emoji: "📖" }` (tradition config; the field is wired into UI)
- `src/app/(standalone)/onboarding/step-teacher-tradition.tsx` — `📖` literal.

**Fix:** replace the `emoji` field value with an icon-name string mapped to Lucide (`"BookOpen"`), and resolve at the render site using an icon map. Onboarding step: hard-swap the literal for `<BookOpen className="size-5" />`.

- **Commit:** `fix(icons): replace 📖 emoji with Lucide BookOpen across tradition config`

### P1-5 · Off-system serif fallbacks
`Georgia, serif` and `ui-serif, Georgia, serif` appear in five inline `style` declarations (grading essay page, hamlet-preview, work-preview scene-clients, structured-hamlet-reader). Spec says Literata is the only reader/body serif.

- **Fix:** replace the inline `fontFamily` literals with `var(--font-serif)`. The CSS var resolves to Literata. If preview pages need a print-like look, add a scoped CSS class on the preview layout instead of inlining Georgia.
- **Commit:** `fix(fonts): replace Georgia fallbacks with var(--font-serif) in preview + grading`

### P1-6 · Supabase — "Multiple GoTrueClient instances detected"
Dev-server browser logs repeatedly emit `Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided …` pointing at `src/lib/supabase.ts:6:37`. Creates two auth client singletons per tab.

- **Fix:** convert `supabase.ts` to a cached singleton using `if (typeof window !== "undefined" && window.__supabase) return window.__supabase;` or a module-scoped `let client` with lazy init. Preferred: confirm the file is only creating a browser client and guard against re-evaluation under HMR. Hand-verify by reading the file before editing.
- **Commit:** `fix(supabase): prevent duplicate GoTrueClient instantiation under HMR`

### P1-7 · `<div onClick>` button-misuse in annotation overlays + teacher/parents
Phase 1 grep flagged: `src/app/(app)/teacher/parents/page.tsx`, `src/components/reader/structured-hamlet-reader.tsx`, and multiple work-preview scene clients rendering `<div onClick>` that should be `<button>` or at least have `role="button" tabIndex={0} onKeyDown`.

- **Fix:** for scene-client annotation overlays — swap to `<button type="button" className="…">` (no visual change). For teacher/parents — swap to `<button>`. For the structured-hamlet reader — verify; if overlay is decorative, add `role="presentation"` or lift click to a wrapping button.
- **Commit:** `fix(a11y): replace <div onClick> with <button> in annotation + parent selectors`

### P1-8 · Reader page chrome — hover/focus ring on Virgil trigger
Runtime evaluation showed the "Open Virgil chat" trigger has `opacity: 0` at first paint. It's a motion-animated fade-in, not a spec bug per se, but the button is focusable while fully transparent, which means keyboard Tab can land on an invisible focus target. Low-risk a11y pitfall.

- **Fix:** gate focusability on the `opacity: 1` state — `pointer-events: none` and `aria-hidden="true"` when `opacity < 1`, remove once animation completes. Or animate into view on mount before interactive state.
- **Commit:** `fix(virgil): prevent Tab from landing on invisible trigger during fade-in`

---

## P2 — polish

### P2-1 · Two motion packages installed
Both `framer-motion@12.38.0` and `motion@12.38.0` ship to the bundle. 130 files import `framer-motion`, 59 import `motion/react`. Zero files import from both. The new idiom is `motion/react` (v11+ rename).

- **Fix:** bulk-rename `from "framer-motion"` → `from "motion/react"` across the 130 files, then drop `framer-motion` from `package.json`. The API surface is identical (`motion`, `AnimatePresence`, `useReducedMotion`, etc.). Verify one sample file compiles before the bulk.
- **Touches 130 files — stop and confirm before executing.**
- **Commit:** `chore(deps): consolidate motion imports on motion/react and drop framer-motion dep`

### P2-2 · Inline duration/easing drift → tokens
Recurring offenders: `VirgilTrigger.tsx` (`duration: 0.2`), `VirgilDrawer.tsx` (`duration: 0.3, ease: [0.32, 0.72, 0, 1]`), `ui/progress.tsx` (`duration: 0.5`), `ui/word-rotate.tsx` (`duration: 0.25`), `ui/text-animate.tsx` (`duration: 0.3` ×4).

- **Fix:** reference `durations.*` from `@/lib/design-tokens`. Add `ease.sheet = [0.32, 0.72, 0, 1]` as a new named token in `design-tokens.ts` since the sheet physics curve is intentional and non-trivial. Keep changes local — don't touch animations that are already using tokens.
- **Commit 1:** `feat(tokens): add ease.sheet for drawer/sheet physics`
- **Commit 2:** `refactor(motion): reference durations.* tokens in Virgil + UI primitives`

### P2-3 · Per-work editorial hex colors in reader
`beowulf-enhancements.tsx`, `structured-hamlet-reader.tsx`, and several `*-annotations.tsx` files hardcode hex values like `#d6cdb9`, `#B8864D`, `#b08d57` inside inline styles (with CSS-var fallbacks).

- **Fix (preferred):** add per-work CSS custom properties under a `:where([data-work="beowulf"]) { --work-narrator: #B8864D; }` block in `tome.css`. Replace inline hex with `var(--work-narrator)`. Saves the editorial palette semantics without bloating `design-tokens.ts`.
- **Alternative:** accept as editorial styling, suppress from drift audit.
- **Commit:** `refactor(reader): extract per-work editorial colors to data-work CSS vars`

### P2-4 · Close-icon size drift
`<X className="h-3 w-3" />` appears in `guided-learning/message-inline-card.tsx` while elsewhere it's `h-4 w-4` / `w-4 h-4`. Standardise on `size-4` for inline close, `size-5` for sheet/dialog close.

- **Commit:** `fix(icons): standardise X close-icon sizing across guided-learning + quiz overlay`

### P2-5 · Raw `<button>` vs `<Button>` focus-ring audit
278 raw `<button>` elements across the app. Most are fine (form buttons with type=submit, icon-only buttons styled inline). Not every one needs to become `<Button>` — but every interactive raw button must have `focus-visible:outline-*` or equivalent. Do a spot-pass on the top five audit surfaces (dashboard, library filter chips, classroom roster row, guided-learning lobby, reader top-bar). Don't chase all 278.

- **Commit:** `fix(a11y): add focus-visible rings to top-surface raw <button> elements`

### P2-6 · `VirgilPanel.tsx` orphan
Confirmed unimported anywhere. Older split UI per spec = P0 for deletion — demoted to P2 here because removing it has no runtime effect; nothing is loading it.

- **Fix:** delete `src/components/reader/VirgilPanel.tsx`. Confirm no dynamic-import string literal references it (grep: done, none found).
- **Commit:** `chore: remove orphan VirgilPanel (replaced by unified VirgilDrawer)`

---

## Deferred / out-of-scope (noted, no action)

- **Driver.js 9-step walkthrough** — not installed. Rescope-or-skip the spec item; existing hand-built onboarding steps are a separate review.
- **Rhyme-scheme detection toggle** — not in code; out-of-scope per "no new features".
- **Standards alignment, Roster import, Semester Plan** — homepage showcases exist but app-side features don't; parallel homepage cleanup already flagging for removal.
- **`loading.tsx` on all 54 missing routes** — defer; only add on top-three surfaces in P1-3.
- **Stale dev-server module errors** (`trials/sigils/WisdomStar.tsx`, `faerie-queene-glosses.ts`, `trial-tokens.ts`) — these files exist on disk. Console errors are stale artifacts of the parallel homepage-cleanup session. No action.
- **Lighthouse/axe-core full run** — no harness installed; spec's Phase 4/5 deferred to a follow-up PR with a proper CI wiring.

---

## Execution order (if approved)

1. **P0-1** mount MobileDock in AppShell → verify at 375px that dock renders + all 5 tabs are reachable
2. **P0-2** BookCard nested-anchor fix → verify no hydration errors on `/library`, `/`, `/dashboard`
3. **P1-1** dashboard vocabulary rename → XP→Wisdom, streak→Flame
4. **P1-4** emoji → Lucide (2 files)
5. **P1-5** Georgia → var(--font-serif) (5 files)
6. **P1-6** Supabase singleton guard
7. **P1-7** div-as-button a11y fix
8. **P1-2** reduced-motion coverage on 14 target files (commit per cluster)
9. **P1-3** per-route error.tsx (1 for app group, 1 for reader)
10. **P1-8** Virgil trigger focusability during fade-in
11. **P2-6** delete orphan VirgilPanel
12. **P2-4** close-icon sizing
13. **P2-2** inline duration/easing → tokens
14. **P2-3** per-work hex → data-work CSS vars
15. **P2-5** focus-visible audit on top surfaces
16. **P2-1** motion-package consolidation (130-file touch — ask first)

Expected commit count: ~20, single logical unit per commit.

---

_End of FIX-PLAN. Awaiting approval before any edits. I'll stop and confirm before P2-1 (motion-package consolidation) since it touches >100 files._
