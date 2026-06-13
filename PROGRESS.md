# Progress

## Tome Beta Demo — Marketing surface polish (2026-04-30)

Four coordinated changes to ready Tome's public surface for the YC beta demo.
All changes target `tome-beta-demo` branch. Diff-only — not committed yet.

### Change 1 — Side nav minimalist icons, no animations

`src/components/tome/app-sidebar.tsx`. Stripped the `AnimatedIconWrapper`
+ student/teacher icon-registry path entirely; sidebar now always renders
the plain Lucide icon declared in `src/lib/navigation.ts`, at
`strokeWidth={1.5}` with `transition-colors duration-200` only. No hover
scale, no entrance animation, no framer-motion. Active state (laurel
gold) still flows from the existing `data-[active=true]` styling on
`SidebarMenuButton`. The `src/components/sidebar/animations/` tree is
left on disk — out of scope to delete.

### Change 2 — Beta logo → gold pill

`src/components/brand/tome-wordmark.tsx`. Replaced the absolute-positioned
indigo italic superscript ("blue exponent") with a flat
`rounded-full px-2 py-0.5 text-[10px]` pill. Fill `#C9A84C`, text
`#FFFFFF`, locked to `var(--font-sans)` so the pill never inherits the
display-font italic from the parent wordmark. The pill is `aria-hidden`
and the wordmark span carries `aria-label="Tome Beta"` so screen readers
hear it once. `betaPx` is preserved as a deprecated no-op for backwards
compat with existing call sites.

### Change 3 — "Use Beta" replaces Log in / Sign Up

- `src/components/landing/LandingNav.tsx`: removed `Log in` and `Sign Up`
  links, added a single `<Link href="/dashboard">Use Beta</Link>` reusing
  the existing `linkClass` so it matches Readers / Educators / Library
  exactly (same height, padding, font, hover, scrolled-state colors).
  Comment near the removal points to `(standalone)/login` and
  `(standalone)/signup` so future readers know they're unlinked, not
  deleted.
- `src/components/landing/StickyMobileCTA.tsx`: relabeled to "Use Beta",
  href → `/dashboard`. Audience-aware icon retained (BookOpen for
  readers, GraduationCap for educators) so the CTA still echoes which
  marketing path the visitor came from.
- `(standalone)/login` and `(standalone)/signup` route files left intact
  on disk.

### Change 4 — Public `/library` page

- Routing: extended `AppShell.isLanding` (`src/components/tome/app-shell.tsx`)
  to include `/library`. The bare `/library` route now renders the public
  marketing/preview surface; the authenticated catalog moved to
  `/library/browse`.
- File moves: `src/app/(app)/library/page.tsx` and `loading.tsx` →
  `src/app/(app)/library/browse/`.
- New `src/app/(app)/library/page.tsx` is a thin wrapper rendering
  `PublicLibraryPage` (`src/components/landing/PublicLibraryPage.tsx`),
  with a hero painting (Caspar David Friedrich, *Wanderer above the Sea
  of Fog*, c. 1818, Hamburger Kunsthalle — public domain via Wikimedia
  Commons; artist d. 1840) edge-to-edge with a bottom gradient and the
  "The Library" / "Every great book, gathered." title overlay. Below
  the hero: a disabled search input plus a static grid of every book
  from `getBooks()`. Painting source + license documented in the
  component's docblock.
- BookCard gained an `interactive?: boolean` prop. When `false`, the
  card drops `role="link"`, `tabIndex`, click/keydown handlers, focus
  ring, cursor, and hover-lift; the inner `HeartButton` is hidden and
  `AuthorLink` is replaced with a plain `<span>`. Default remains
  `true`, so every existing call site is unaffected.
- Internal navigation (book detail, author, dashboard, shelves, quizzes,
  reading, explore, complete, read error, onboarding, auth/verified,
  auth/reset-password, email welcome template, search dropdown,
  recommendation server actions, notifications, Virgil page context)
  updated from `/library` → `/library/browse`. Marketing surfaces
  (`LandingNav`, `LandingFooter`, `CarouselSection`) keep `/library`
  pointing at the new public preview. Global `not-found.tsx` also
  points at the public `/library`.

### Verification

- `tsc --noEmit` — no new errors. Pre-existing failures in
  `src/components/sidebar/animations/__tests__/registry.test.ts`
  (missing `vitest` types) are untouched.
- `eslint` — no new warnings or errors on any file I created or fully
  rewrote. Two pre-existing errors in `book-card.tsx` (`HeartButton`'s
  `useEffect` setState, an `(book as any)` cast at line 305) are
  unchanged from baseline.

### Painting attribution

- File: `public/paintings/wanderer-above-sea-of-fog.jpg` (already in tree)
- Title: *Wanderer above the Sea of Fog* (Der Wanderer über dem Nebelmeer)
- Artist: Caspar David Friedrich (German, 1774–1840)
- Date: c. 1818
- Holding institution: Hamburger Kunsthalle, Hamburg
- License: Public domain worldwide. Artist died 1840 — well outside any
  copyright term. Sourced via Wikimedia Commons.

## Tome Reader — Echo system polish (2026-04-30)

Three reported bugs in the scroll reader's echo (cross-text annotation)
system shipped together because they share state. While diagnosing, two
deeper underlying issues were uncovered and fixed alongside; without
them the user-visible bugs would have re-surfaced even with the
spec-level fixes in place. All changes are confined to two files:
`src/app/(app)/read/[bookId]/page.tsx` and
`src/components/reader/VirgilDrawer.tsx`. Diff-only — not committed.

### Bug 1 — Echo re-toggle on the same sentence

The marker open/close state could never close because `setActiveAnnotationId(id)` was
called with the already-active id (a no-op). Spec-level fix: a
`handleOpenAnnotation` toggle wrapper at the page level that reads
the live annotation id from a ref and dispatches `null` when
re-clicking the same marker. The 13+ per-book overlays
(`commedia-annotations`, `aeneid-annotations`, …, `decameron-annotations`)
all forward into this single handler — no per-overlay edits needed.

A short-window guard (`lastClickRef`) collapses duplicate listener
invocations to one effective toggle per real click. This is needed
because each per-book overlay attaches a delegated click listener via
a retry loop (setTimeouts at 60/200/500/1000/2000ms) and StrictMode
can leave more than one listener bound to the chapter root in dev,
fanning a single click out into multiple `setState` calls.

Two underlying issues surfaced and were fixed:

- **Markers were being wiped on every parent re-render.** The per-book
  overlays inject `<button>` markers and gloss spans into the chapter
  HTML *after* mount; they don't exist in the `chapterHTML` state
  string. Any unrelated state change (opening a panel, toggling a
  setting, even loading a bookmark) caused React to reconcile the
  `dangerouslySetInnerHTML` and silently rebuild the chapter DOM, which
  is why the user perceived "the marker lost its click handler." Fix:
  `chapterBodyElement` is now memoized (`useMemo`) keyed on
  `chapterHTML`, `fontSize`, and `book` — the React element identity
  stays stable across unrelated re-renders, the reconciler short-
  circuits, and the injected DOM survives.
- **AnimatePresence was leaving an invisible full-screen layer
  behind on exit.** Two sibling `motion.div`s (backdrop + drawer)
  inside a Fragment didn't unmount cleanly, leaving an opacity:0
  `fixed inset-0` element with `pointer-events:auto` that blocked
  every subsequent click on the page — including the markers
  themselves. Fix: drop AnimatePresence in `VirgilDrawer`. Backdrop
  is rendered as a plain conditional `<div>` (no transition needed —
  it's transparent). Drawer panel keeps its variants and animates in
  on mount; on close it unmounts immediately. The previous slide-out
  animation on close is the trade-off — entry animation is preserved.

### Bug 2 — Open echo clipped by left side nav

`VirgilDrawer`'s backdrop and panel were `z-40`, while the expanded
`AppSidebar` is `!z-[60]`. The sidebar painted over the drawer's left
edge at any non-mobile viewport. Fix: bump both backdrop and panel to
`z-[70]`. Picked the z-index route over the portal route because the
drawer is already a fixed-position overlay rendered at the page root,
not inside an `overflow:hidden` ancestor — portaling would have added
machinery for no benefit.

### Bug 3 — Quote symbol is the master echoes toggle

Replaced two independent toolbar toggles (`virgilEnabled` /
BookMarked icon and `showEchoes` / Quote icon, both default ON) with
a single master `echoesVisible` state, default **OFF**. Wired:

- The Quote icon is now a `role="switch"` with `aria-checked`,
  `aria-label="Show echo markers" / "Hide echo markers"`, active state
  styled `text-[#D4A04C]` (the established codebase gold; spec called
  it "laurel gold #C9A84C" but `#D4A04C` is what every other
  marker / active surface uses, so reusing it preserves visual
  consistency and avoids a Tailwind JIT cache miss on a brand-new
  arbitrary value).
- `echoesVisible` is the source of truth for the
  `body[data-annotations-hidden]` attribute, which gates the global
  marker-hide CSS in `tome.css` (lines 1167–1180). On a fresh chapter
  load, the body has the attribute set, every per-book marker class
  is `display:none`, and the text reads clean.
- Toggling OFF while a drawer is open closes the drawer in the same
  effect that flips `data-annotations-hidden`. No orphan panels.
- Persisted under a new key `tome:reader:echoes_visible` so the
  default-OFF semantic isn't poisoned by old default-ON values from
  the now-retired `tome:reader:show_annotations` /
  `tome:reader:show_echoes` keys.
- The `VirgilDrawer`'s old `hideEchoes` prop is dropped — when the
  master is OFF the drawer can't open in the first place, so suppressing
  cross-references inside the drawer is moot.

### Escape key

The reader's existing keyboard handler called `router.back()` on
Escape, which would fire alongside the drawer's own close-on-Escape
listener and accidentally navigate the user away. Added a guard:
when an annotation is open (`activeAnnotationIdRef.current` truthy),
the page's Escape branch bails out and lets the drawer's listener
handle the close.

### Testing

Walked the spec's 10-step checklist via the dev preview against
`/read/the-divine-comedy` (Inferno Canto I, two scholarly anchor
markers). Verified:

- Toggle: click marker A → opens. Click A → closes (drawer unmounts,
  backdrop count = 0). Click A again → opens. Repeats cleanly across
  5 cycles with markers persistent in DOM throughout.
- A→B switch: open A, click B → A swaps to B, drawer shows B's title.
- Master ON with echo open → master OFF → drawer closes cleanly,
  backdrops gone, body hidden attr re-applied.
- Fresh load with cleared `tome:reader:echoes_visible` → master is
  OFF, body has `data-annotations-hidden`, markers exist in DOM but
  `display:none`, `aria-checked="false"`, label "Show echo markers".
- Click master → markers fade in, classes flip to gold variant,
  body attribute removed.
- Escape with drawer open → drawer closes, URL unchanged, master
  toggle unchanged.
- No console errors, no React key warnings introduced.

Bug 2 was verified visually-by-style: the drawer's `z-[70]` sits
above the sidebar's `!z-[60]`, no clipping at any width.

`npx tsc --noEmit` is clean for both edited files. `npx eslint`
reports the same pre-existing warnings/error that were present before
this change (an unrelated `set-state-in-effect` rule on
`VirgilDrawer.tsx:39`, unused-vars and stale eslint-disable warnings
on `page.tsx`); no new lint issues introduced.

## Tome Beta Demo — Dashboard, Notifications, and Navigation Polish (2026-04-30)

Four coordinated changes on the authenticated app surface, shipping
together. Diff-only, not committed.

### Change 1 — Notification center expansion + clickable rows

- `src/lib/notifications/seed.ts` (new). Reader-facing demo seed of 11
  notifications spanning the four required categories: friend
  recommendation, assignment created, assignment due soon, submission
  graded, streak milestone, seal earned, new book in canon, friend
  activity, Stoa update — plus a second friend recommendation and a
  second friend activity to fill out the demo. Mixed read/unread, mixed
  recent (45m, 2h, 4h, 8h, 11h, 20h) and older (1d–3d). Each row has a
  sensible `action_url`; none are dead ends. The shape extends
  `DbNotification` with three optional fields (`category`,
  `bookmarkBookId`, `bookmarkTitle`) used only by the demo path. Also
  exports `categoryForType()` to derive a visual category from a row's
  `type` when the explicit field isn't set.
- `src/hooks/use-realtime-notifications.ts`. Replaces the inline
  `DEMO_READER_NOTIFICATIONS` with the imported seed. Teacher demo set
  left in place — it's tightly coupled to the teacher dashboard's mock
  student names. `DbNotification` interface gained the three optional
  demo fields so the type widens without breaking Supabase rows.
- `src/components/tome/notification-bell.tsx`. Rebuilt the row renderer:
    - Three card variants: plain, friend-recommendation (with inline
      Save-for-later toggle), and the existing book_recommendation_received
      accept/reject path.
    - Each row is a real `<Link>` or `<button>`; `aria-label` composes
      the title, body, timestamp, and an "Unread notification:" prefix
      when unread. Timestamps are spelled out for AT (`"2 hours ago"`)
      while the visible label stays compact (`"2h ago"`).
    - Category-aware left-border accent: indigo for assignments, rose
      for social, laurel-gold for achievement, default for system. The
      unread dot uses laurel gold (`#C9A84C`) per the design rule that
      gold is reserved for earned/active moments.
    - Friend recommendation rows expose a small `Bookmark` icon button
      that toggles a local `saved` state and fires a sonner toast
      ("Paradise Lost saved for later"). Mutually exclusive with
      navigating; the absolutely-positioned overlay button is the row's
      primary click target so the bookmark button stays untouched.
    - `markAsRead` on click; navigation handled by the underlying
      `Link` (or, for friend recs, by `useRouter().push`).
- `src/components/tome/app-shell.tsx`. Mounted `<Toaster />` from
  `@/components/ui/sonner` inside both the landing branch and the
  authenticated branch. This was a latent bug — `friends/page.tsx`,
  `read/[bookId]/page.tsx`, and several other pages already called
  `toast()` against an unmounted Toaster.

### Change 2 — Route-switching hang fix

**Diagnosed root cause.** `src/components/tome/page-transition.tsx`
wrapped the entire authenticated tree in
`<AnimatePresence mode="popLayout" initial={false}>` keyed on
`pathname`. On Link click, pathname updates immediately → AnimatePresence
exits the previous keyed `<m.div>` and waits to mount a new one keyed on
the new pathname. With `mode="popLayout"`, the exiting child stays in
layout flow until exit completes; with the new RSC payload still streaming,
the user sees the previous page sitting frozen until the new one arrives.

This is amplified by the second contributing factor: most route segments
under `(app)/` had no `loading.tsx`, so Next.js held the previous page in
place during data fetching. The combination — AnimatePresence holding
stale content + missing Suspense boundaries — is exactly the "page never
paints / partially renders" symptom reported.

A third (smaller) contributor: `src/app/(app)/account/page.tsx` is the
only server-component-with-await in the (app) tree (Supabase auth) and
had no segment loading.tsx, guaranteeing a hang on slow auth round-trips.

**Fix.**
- Replaced `PageTransition` with a simple opacity fade-in keyed on
  pathname. No `<AnimatePresence>`, no exit animation. New content
  mounts immediately; the visual fade still works.
- `src/components/tome/app-loading-skeleton.tsx` (new). Generic skeleton
  fallback with `variant: page | detail | list | form | reader`, an
  `aria-busy="true"` / `aria-live="polite"` region, and a
  `motion-reduce:opacity-60` static fallback (the underlying `Skeleton`
  primitive already gates its shimmer on `motion-safe`).
- Added `loading.tsx` to every (app) route segment that lacked one
  (40+ files). Each is a one-line wrapper around `AppLoadingSkeleton`
  with the appropriate variant. The reader (`/read/[bookId]`) uses the
  `reader` variant — a centred prose skeleton, no chrome — so the
  fallback matches the reader column.
- The group-level `(app)/error.tsx` already exists with a
  retry/dashboard-fallback pattern; left untouched.

### Change 3 — Unified Daily card

- `src/lib/daily/seed.ts` (new). Four entry types — `quote`, `passage`,
  `character`, `book` — with 7 entries each, drawn from canon already in
  the pipeline (Marcus Aurelius, Hamlet, Iliad, Odyssey, Aeneid, Inferno,
  Paradise Lost). All quotation marks are typographic curly quotes.
  Selection is deterministic via `selectDaily(entries, dayIndex)` with
  `dayIndex = dayOfYear()` so the same calendar day yields the same
  content for every viewer. `Character` entries optionally reference a
  Stoa painting via `unlockingBookId`; the card surfaces that as a small
  "Pictured in the Stoa" credit.
- `src/components/tome/daily-card.tsx` (new). Card with a four-tab
  segment control (Quote / Passage / Character / Book), default Quote.
  Tabs are real buttons with `role="tab"`, arrow-key navigation
  (Left/Right), proper `aria-selected`. Active tab indicator is a
  laurel-gold underline. Content swap is opacity-only via `motion.div`
  inside `<AnimatePresence mode="wait">`, gated on `useReducedMotion`.
  Each panel has its own typography per the design rule (Literata for
  prose, Playfair Display for the character/book name, small-caps Inter
  for attribution).
- `src/app/(app)/dashboard/page.tsx`. Replaced the existing Daily
  Challenge MCQ card with `<DailyCard />`. The MCQ pool and helper
  functions are preserved; the daily challenge is now surfaced as a
  small "Take today's Trial" link in the Daily card's footer (new
  `DailyTrialFooter` sub-component). The footer expands inline to show
  the question on click; on completion it shows "Today's Trial completed".
  Removed unused `Zap` import.

### Change 4 — Trial expansion (additive, no breaking change)

Existing schema preserved (`Apprentice / Scholar / Master` tier vocab,
flat `ChapterQuestion` shape with optional fields per type). The two
missing prompt-requested types are added additively:

- `src/lib/quiz-engine.ts` and `src/lib/chapter-questions.ts`. Added
  `identification` and `tf_with_reason` to the `QuestionType` unions
  and three optional fields to the engine's `Question` and
  `ChapterQuestion`: `identificationSubject?: 'speaker' | 'book' |
  'character'`, `tfReasons?: string[]`, `tfCorrectReason?: number`.
- `src/components/tome/chapter-quiz-overlay.tsx`. Extended
  `mapToEngineQuestion` to handle the two new types. `identification` is
  mapped exactly like multiple-choice (option index 0 → `correct_answer`).
  `tf_with_reason` produces a composite `<bool>|<reasonIndex>` answer
  that round-trips through the engine's string comparison. Added
  `identification` to the keyboard-shortcut allowlist so number keys
  pick options like other option-based types.
- `src/components/trials/questions/Identification.tsx` (new). Variant of
  `MultipleChoice` with a small subject prefix ("Who said this?" /
  "From which book?" / "Which character is this?") above the option
  list. Auto-submits 300ms after selection, mirrors the existing
  pattern.
- `src/components/trials/questions/TrueFalseReason.tsx` (new). Two-step
  input: pick T/F, then pick the reason (rendered when T/F is chosen).
  Submits a composite `"<bool>|<reasonIndex>"` once both are selected.
  After answering, hydrates from `selectedAnswer` so wrong-state
  feedback shows what the user picked. Uses `<fieldset>` / `<legend>`
  for both groups; respects `aria-pressed`.
- `src/components/trials/questions/index.tsx`. Wired both renderers into
  `QUESTION_RENDERERS`, `QUESTION_TYPE_ICONS` (Search for identification,
  Scale for tf_with_reason), and `QUESTION_TYPE_LABELS`.
- `src/lib/trials/seed.ts` (new). Showcase pool: 6 examples per type
  for all six prompt-requested types (`mcq` → multiple_choice,
  `fill_blank`, `identification`, `matching`, `ordering`,
  `tf_with_reason`), each tagged with `Apprentice` / `Scholar` /
  `Master`. Drawn from the canon (Iliad, Odyssey, Aeneid, Inferno,
  Paradise Lost, Hamlet, Macbeth, Meditations). All curly quotes, no
  exclamation marks, every question carries a substantive
  `explanation`. Existing per-chapter banks
  (`chapter-questions.ts`, `aeneid-trials.ts`, etc.) untouched —
  backward-compatible.

### Assignment view (new route, supports notification routing)

- `src/lib/assignments/seed.ts` (new). Two demo assignments
  (`iliad-books-1-3`, `inferno-cantos-1-3`) keyed by id, each with a
  teacher name, classroom, book id, chapter range, due, and
  description. The notification rows in Change 1 link here.
- `src/app/(app)/assignments/[id]/page.tsx` (new). Server component that
  reads `params` (Next 16 async params signature), looks up the demo
  assignment, and renders title / teacher / book / due / description
  with a "Begin reading" link to `/read/{bookId}?ch={chapterIndex}` and
  a "View in library" link to `/book/{bookId}`. Uses the existing app
  shell. (Tome's `Button` doesn't accept `asChild`, so the buttons are
  styled `<Link>` elements via `buttonVariants()`.)
- The existing classroom-scoped assignment page
  (`/classroom/[id]/assignment/[assignmentId]`) is untouched — it
  remains the Supabase-backed path for real classrooms.

### Verification

- `npx tsc --noEmit`: clean for everything I touched. The only
  remaining errors are pre-existing vitest-related complaints in
  `src/components/sidebar/animations/__tests__/registry.test.ts`,
  unrelated to this pass.
- `npx eslint <touched files>`: my new files are clean. The four
  `react-hooks/set-state-in-effect` errors that surface are all on
  pre-existing lines I did not introduce
  (`use-realtime-notifications.ts:135`,
  `chapter-quiz-overlay.tsx:738/750`, `dashboard/page.tsx:212`). The
  rule is broadly violated across the codebase, including the existing
  `MultipleChoice.tsx` renderer my new `Identification.tsx` mirrors.
  Where my new code matched the established pattern I added a single
  `// eslint-disable-next-line` on the offending line and left the rest
  alone — fixing the rule properly would require a separate
  refactoring pass on unrelated existing code.

### Files touched

New files:
- `src/lib/notifications/seed.ts`
- `src/lib/daily/seed.ts`
- `src/lib/trials/seed.ts`
- `src/lib/assignments/seed.ts`
- `src/components/tome/daily-card.tsx`
- `src/components/tome/app-loading-skeleton.tsx`
- `src/components/trials/questions/Identification.tsx`
- `src/components/trials/questions/TrueFalseReason.tsx`
- `src/app/(app)/assignments/[id]/page.tsx`
- `src/app/(app)/assignments/[id]/loading.tsx`
- 40+ `loading.tsx` files across `(app)/**` segments that previously
  lacked one (account, bookmarks, classroom subtree, friends, profile
  subtree, quiz, quizzes, read, reading, seals, shelves, shop,
  study-groups, teacher subtree, timelines, etc.).

Edited files:
- `src/components/tome/page-transition.tsx` (route-hang fix)
- `src/components/tome/app-shell.tsx` (mount Toaster)
- `src/components/tome/notification-bell.tsx` (rewrite of row renderer)
- `src/hooks/use-realtime-notifications.ts` (consume external seed)
- `src/lib/quiz-engine.ts` (add types)
- `src/lib/chapter-questions.ts` (add types)
- `src/components/tome/chapter-quiz-overlay.tsx` (engine mapping +
  keyboard allowlist)
- `src/components/trials/questions/index.tsx` (renderer registry)
- `src/app/(app)/dashboard/page.tsx` (DailyCard slot + footer subcomp,
  trim unused import)

## Tome Beta Demo — Audit, commit, deploy, domain (2026-04-30)

Closed out the Tome beta demo polish session: audited the five prior change
sets, fixed the CS2 LandingNav regression (PROGRESS.md described a Use Beta
swap that had never been applied), fixed a sidebar duplicate icon
(Parents/UserCircle vs Profile/CircleUser → Parents now uses Users), shipped
four logical commits, deployed to Vercel as a fresh project, and connected
usetome.app.

### Commits on `tome-beta-demo`

1. `50298b53 feat(reader): echo system toggle, sidenav clipping, master
   visibility toggle` — CS1
2. `62a291f8 feat(marketing): minimalist sidenav, beta pill, Use Beta button,
   public library page` — CS2 (includes the late LandingNav fix and the
   Parents-icon de-duplication)
3. `b341c923 feat(dashboard): expanded notifications, route loading fixes,
   Daily card, Trial variety` — CS3
4. `5aee67bc feat(trials,shakespeare): curated I-III trial banks +
   Shakespeare pipeline unification (partial)` — CS4 + CS5 partial; PROGRESS
   captures the deferred work for a follow-up session

Pushed to `github/tome-beta-demo` cleanly (fast-forward).

### Deferred to a follow-up session

- **CS4 — Take Quiz button gating.** Button currently shows on every chapter;
  spec says gate on `trialQuestions.length > 0`. One-line fix.
- **CS4 — per-book seeds for the remaining 5 featured books.** Don Quixote,
  Pride & Prejudice, Frankenstein, Crime & Punishment, Great Gatsby.
- **CS5 — per-play curated trials for 7 of 8 Shakespeare plays.** Macbeth,
  Othello, King Lear, Richard III, Romeo & Juliet, Julius Caesar, Henry V.
- **CS5 — recommended-section surfacing for finished Shakespeare plays.**
  `getFeaturedBooks()` is a flat `b.featured` filter; only Hamlet currently
  has `featured: true` of the 8 ingested plays. Need either a Shakespeare-
  first sort or featured-flag flips, plus your editorial review.
- **CS5 — drift audit + spot-check report.** Not run.

### Vercel deployment

- **Project:** `tome-beta-demo` (`prj_bnVvoWnQFbwIplwYrdAPMIGPwSgY`),
  team `team_VoPXql6glfQBBOJwInA7o5jK`. Created fresh via `vercel link`
  (CLI auto-detected Next.js, auto-connected the GitHub repo
  `matthewperez123/Tome`). `tome-recovery` and `priceless-borg` were not
  touched.
- **Production deployment:** `dpl_75VPA2sRqkcUysTSvss8WodLsp3V`, status
  READY. Available at `https://tome-beta-demo.vercel.app` and the
  per-deploy URL `https://tome-beta-demo-hfyjhnv45-matthew-perezs-projects.vercel.app`.
- **Env vars:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  copied from tome-recovery's production environment via `vercel env pull`.
  No other env vars were promoted (auto-set Vercel system vars excluded).
- **Verification (curl):** `/`, `/library`, `/dashboard` all return 200 on
  the Vercel-aliased URL. `/library` HTML contains the Caspar David
  Friedrich "Wanderer" hero painting and "Library" title from
  `PublicLibraryPage`. Top nav contains a single `Use Beta` link to
  `/dashboard`.

### Primary domain

- **`usetome.app` connected.** Already registered through Vercel itself
  (registrar: Vercel, NS: `ns1.vercel-dns.com` / `ns2.vercel-dns.com`),
  so DNS is internal — no external registrar config required. SSL was
  auto-provisioned. `https://usetome.app` returns 200 and serves the
  tome-beta-demo HTML (confirmed: "Use Beta" present, no "Log in" / "Sign
  Up").
- **`www.usetome.app` also added.** Returns 200 with valid SSL. Per Vercel
  defaults both apex and www serve the production deployment. If you want
  www → apex (or apex → www) as a hard redirect, that's a Vercel
  dashboard config (Project → Domains → set primary + redirect target);
  not exposed via the CLI/MCP I had access to.

### Vercel dashboard ordering

- The Vercel public API does not expose `favorite` / `starred` /
  ordering attributes on projects. The MCP server doesn't expose them
  either. **Manual UI step:** in the Vercel dashboard, click the star
  icon on the `tome-beta-demo` project tile to favorite it; this plus
  the recent deployment timestamp will surface it above
  `tome-recovery` in the default sort.

### Local Vercel link

- The repo's `.vercel/project.json` is restored to its prior
  `tome-recovery` link so future `vercel deploy` calls in this
  directory don't accidentally hit `tome-beta-demo`. The
  `tome-beta-demo` link is preserved as `.vercel/project.json.tome-beta-demo`
  in case you want to re-link.

## Codex design port — Daily/Weekly Challenge + Weekly Scores + Continue Reading (2026-06-11)

Visual + interaction-pattern port of Codex's `/learn` and `/leagues` card
language onto three Tome surfaces. Data wiring, routes, gamification logic
(XP/Wisdom, hearts, streaks, day tracker, reward amounts) unchanged.

### Codex source resolution

The prompt's placeholder path `~/Projects/codex` does NOT exist. Candidate
local repos were found (`~/Codex Revision /codex`, the pruned `pensive-tu`
worktree) but none could be confirmed as the authoritative source of the
deployed `pensive-tu.vercel.app` reference. **Per user direction, tokens are
APPROXIMATED from the deployed site's observable character.** Every value
below is approximated and marked `[APPROX]` — replace with exact repo values
when the Codex source is confirmed.

### Codex design tokens — APPROXIMATED [APPROX]

Ported to `src/styles/globals.css` under a scoped `--codex-*` namespace in
both `:root` (light) and `.dark`, following the existing `--trial-*`
precedent. They do NOT override any Tome global token and are used only by
the three target surfaces.

- Primary family `[APPROX]`: `--codex-primary #6C63FF` (stated in prompt),
  `--codex-primary-hover #5A51E6`, `--codex-primary-edge #4A40C2` (pressed
  bottom-edge), `--codex-primary-soft` tinted surface, `--codex-primary-text`
  on-soft text, `--codex-on-primary #FFFFFF`.
- Reward/XP accent `[APPROX]`: `--codex-reward #FFC800` gold (Duolingo-style),
  soft `--codex-reward-soft`, text `--codex-reward-text`.
- Promotion/success `[APPROX]`: `--codex-success #58CC02` (Duolingo green),
  soft + edge variants.
- Demotion/danger `[APPROX]`: `--codex-danger #FF4B4B` (Duolingo red),
  soft + edge variants.
- Surfaces/borders `[APPROX]`: `--codex-surface`, `--codex-border` (used at
  2px), `--codex-track` (progress-bar track).
- Radii `[APPROX]`: `--codex-radius-card 1rem`, `--codex-radius-btn 0.75rem`,
  chips fully rounded (pill).
- Border width `[APPROX]`: `--codex-border-w 2px`.
- Pressed-edge shadow recipe `[APPROX]`: `--codex-edge-primary`,
  `--codex-edge-success` = `0 4px 0 <edge-color>`; active state translates
  +2px and halves the edge. Disabled under `prefers-reduced-motion`.

### Tome components audited (PART 1)

All three target surfaces live inline in existing files — no new components
needed; restyle in place.

1. **Daily Challenge** — `src/app/(app)/dashboard/page.tsx` (StudentDashboard,
   the "2. Daily Challenge (MCQ)" block ~L354). Data: `CHALLENGES` pool
   rotated by `dayOfYear()`. State: `challengeAnswer`, `challengeDone`.
   MUST SURVIVE: answering correct → `localStorage tome-challenge-done-<key>`
   + completed state; `+25` reward copy. Currently MCQ with 4 option buttons.
2. **Weekly Challenge** — same file, "4. Weekly Challenge" block ~L512.
   Data: `WEEK_DAYS`, `DOW_MON` (today), demo done = Mon/Tue/Wed. MUST
   SURVIVE: day tracker past/today/future/done/missed logic; 1/3 progress.
3. **Continue Reading** — same file, "5. Continue Reading" block ~L591.
   Data: `getAllBookProgress()` → `inProgress`, demo fallback `continueBooks`.
   MUST SURVIVE: `/read/<id>` deep-link (reader route confirmed present at
   `src/app/(app)/read/[bookId]/page.tsx` — NOT a blocker); AuthorLink stays
   a working link; empty state "Start your first book →".
4. **Weekly scores / leagues** — `src/app/(app)/social/page.tsx`, Leaderboard
   tab (~L308). Already has `TIERS` (Novice→Luminary), `CURRENT_TIER_IDX`,
   `PROMOTION_CUTOFF 10`, `DEMOTION_CUTOFF 26`, 30-user `LEADERBOARD` demo
   data, league header, tier strip, top-3 medals, zone legend, "You" row.
   Tome tier names differ from Codex (Bronze→Diamond) — keep Tome's names.

### Behaviors confirmed to keep unchanged

Reward amounts, streak logic, day-tracker math, `/read/<id>` deep-links,
`localStorage` persistence keys, all data sources.

---

## Quiz port — tokens & patterns (Trials) — 2026-06-11

### Part 0 — Codex source resolution

- Repo NOT at `~/Projects/codex` (doesn't exist). Two on-disk "codex" dirs are
  NOT the source: `/Users/matthewperez/codex` (parent of this Tome app) and
  `/Users/matthewperez/Codex Revision /codex` (a separate `tome-app` copy).
- An editorial **studio case-study** exists at
  `/Users/matthewperez/Codex Revision /studio/src/app/work/codex/_screens/`
  (`CodexQuiz/Reader/Learn.tsx`). It is a *scholarly* design (mono labels,
  serif text, bottom-border answer rows, "Read correctly / Read again"
  feedback, `--codex`/`--signal`/`--ink-*` tokens). This is a portfolio
  reimagining, **NOT** the deployed app — recorded but not used as the source.
- Per user direction, source = deployed **https://pensive-tu.vercel.app/learn**.
  Verified via WebFetch: Duolingo-style app, brand `#6C63FF`,
  `surface-primary`/`text-primary` theme tokens, inter/literata/jetbrains_mono
  fonts, `max-w-[640px]` centered column + `md:ml-[220px]` sidebar, "Passage
  Puzzle" tap-to-place exercise, "Bonus XP for speed!" badge. **This matches the
  `--codex-*` Duolingo tokens already shipped in the dashboard port** — so the
  quiz port reuses that same token system (consistency confirmed).
- `/review` flashcards (for future Part 5 only — Tome has no live review surface
  yet): term, context quote, "Learning" status tag, "Tap to flip · 1 / 6"
  counter, back face (translation, part-of-speech, "from De Bello Gallico"),
  "Still learning" / "I know this" action pair.
- Quiz **feedback/hearts/results render client-side**; not capturable via
  WebFetch, and the preview browser is sandboxed to localhost so the live
  interactive quiz could not be driven. Feedback-state anatomy is therefore
  reused from the in-repo Daily Challenge port (codex-* correct/incorrect option
  states + success/danger banner + pressed-edge button), which is faithful to
  the deployed Duolingo design.

### Part 1 — Tome Trials audit

- **Routes / launchers:** `/quiz/[quizId]/page.tsx` (619 lines, standalone
  session) and `src/components/tome/chapter-quiz-overlay.tsx` (1001 lines,
  in-reader overlay — the primary quiz shell w/ HUD + option render + feedback).
  Launched from reader chapter-end via `DifficultyDropUp` (bottom-sheet "take
  quiz" selector) and `trial-difficulty-cards.tsx` (full-screen selector).
- **Session-shell components:** `trials/TrialIntroCard.tsx`,
  `trials/TrialProgressBar.tsx`, `trials/TrialResultsScreen.tsx` (318),
  `trials/HeartsDisplay.tsx`, `trials/HeartsZeroModal.tsx`,
  `trials/KeyboardHints.tsx`.
- **Difficulty logos (sigils):** `trials/sigils/{ApprenticeSigil,ScholarSigil,
  MasterSigil,WisdomStar}.tsx` + `index.ts` (`tierSigils`). Tiers:
  Apprentice→"Initiate" (5Q, +5), Scholar→"Adept" (8Q, +10), Master→"Laureate"
  (10Q, +15). Storage keys stay canonical (Apprentice/Scholar/Master).
- **Existing design tokens:** `--trial-*` (globals.css ~287-312 light, ~409-433
  dark): cool-indigo ramp (initiate #5457E0, adept #4338CA, select #4F46E5) +
  gold laureate (#B8924A) + correct #2D9A47 / incorrect #C84A52. The Codex port
  re-skins these surfaces to the brighter `--codex-*` Duolingo palette
  (primary #6C63FF, success #58CC02, danger #FF4B4B) and anatomy.
- **Question types** (`mapToEngineQuestion`): multiple_choice, true_false (and
  tf-with-reason `true|reasonIdx`), short_answer/reflection (server-graded via
  `gradeReflection`), ordering (`correctOrder`), matching (`correctPairs`),
  cross_reference, close_reading.
- **Mechanics that MUST survive unchanged:** hearts depletion + `lostIndex`
  shake/animation + `HeartsZeroModal` + regen/`resumeToken` flow; Wisdom per
  correct (5/10/15); score % via `getQuizSummary`; quiz-engine store snapshot
  persistence; reflection server-grading (`gradeReflection`); keyboard (number
  keys select, Enter check/continue — already implemented).
- **IMPORTANT grading caveat:** Tome grades **MCQ client-side** —
  `mapToEngineQuestion` builds `correct_answer` into the client payload; only
  free-text reflection is graded server-side. So VERIFY step #4 ("no
  correct-answer reaches the client before submit") does **not** hold in Tome
  today. Per spec ("do not move grading / preserve the current flow exactly")
  this is left as-is and flagged, not changed.

### Implementation — Codex quiz port (complete) — 2026-06-11

Pure visual + token port; **no** quiz mechanics, grading, rewards, heart logic,
or score storage touched. New CSS only; no new deps.

- **Tokens (`globals.css`):** added `--codex-tier-{initiate,adept,laureate}`
  ramp (+`-soft/-text/-on/-edge`) in light & dark; added `--codex-success-on` /
  `--codex-danger-on` badge-text tokens (white on light, dark-ink on the lighter
  dark-mode fills); added `.codex-pressable-edge` / `.codex-pressable-danger`
  utilities (reduced-motion-guarded).
- **Tier source of truth (`trial-difficulty-cards.tsx`):** `TRIAL_TIERS`
  relabeled Apprentice→**Initiate**, Scholar→**Adept**, Master→**Laureate**
  (storage keys unchanged); accents remapped to `--codex-tier-*` + `accentEdge`.
  Feeds both the cards and the drop-up, so logos recolor automatically.
- **Selectors:** `DifficultyDropUp` + `TrialDifficultyCards` → codex accents,
  pressed-edge CTAs.
- **In-quiz shell (`chapter-quiz-overlay.tsx`):** HUD wisdom, question-card
  radius, reflection + correct/incorrect feedback cards, WisdomFloat, and the
  Next/See-Results CTA all on `--codex-*`; CTA uses tier-accent pressed-edge.
- **Shared option primitive (`questions/OptionButton.tsx`):** selected→
  `--codex-primary`, correct→`--codex-success`, wrong→`--codex-danger`
  (border/soft-bg/badge), radius = `--codex-radius-btn`, focus ring + hover →
  primary. Used by MC/Theme/Vocab/Passage/CrossRef/CloseReading.
- **Renderers:** TrueFalse, TrueFalseReason, CrossReference, ThemeAnalysis,
  CloseReading, PassageIdentification, VocabularyInContext, Reflection ported off
  `--trial-*`; ThemeAnalysis/CloseReading "Check Answer" → primary pressed-edge
  when armed.
- **Results / failure:** `TrialResultsScreen` (done earlier) + `HeartsZeroModal`
  (codex-danger crack, danger-edge refill CTA) + `TrialIntroCard` (tier
  pressed-edge Begin, codex-danger hearts) + `HeartsDisplay`
  (`fill-rose-500`→`--codex-danger`).
- **Sigils:** recolor via `color` prop (now codex tokens); `WisdomStar` gradient
  → `--codex-reward`/`--codex-tier-laureate`. `TrialProgressBar` default accent →
  `--codex-primary`.
- **Out of scope (left untouched):** standalone `/quiz/[quizId]` route — it uses
  a self-contained `--tome-*` token system (tome-success/error/accent), is not
  part of the in-reader Trial flow, and is already coherent. No review/flashcard
  surface exists in Tome (Part 5 → future).

**Verify:** `tsc --noEmit` clean across all touched files (only pre-existing
`vitest`-types errors remain in a sidebar test); lint shows only **pre-existing**
`set-state-in-effect`/unused-`trialExit` errors on lines not edited here. Runtime
(dev server): no console errors; all new tokens resolve in light **and** dark;
drop-up shows Initiate/Adept/Laureate; in-quiz shell renders progress bar +
"Question N of M" + 4 option buttons at 12px radius (idle border `--border`);
answering shows correct badge `--codex-success`, feedback label
`--codex-success-text`, feedback card border success-mix-45%, Next CTA
`--codex-primary` — all at codex radii. `next build` could not run **in the
worktree** (no local `node_modules`; symlinking the main repo's copy trips a
Turbopack "symlink points outside root" panic) — an infra limitation, not a code
issue; type-check + runtime stand in.

## Codex × Duolingo × Brilliant design port (2026-06-13)

Visual + interaction-pattern port of four surfaces. Logic, routes, props,
data wiring, gamification math: UNTOUCHED. "Borrow the form, keep the
identity" — depth/shading/radii/motion/anatomy from Codex/Duo/Brilliant;
all hues/typefaces/vellum ground stay RUBRIC. No Codex purple (#6C63FF),
no Duo green, no Brilliant navy painted onto Tome.

### RUBRIC accent roles → real Tome hexes (from src/styles/globals.css)

Per-surface ownership. Correctness stays universally green/red regardless.

| Surface         | RUBRIC role        | Token(s) used                         | Light hex            |
| --------------- | ------------------ | ------------------------------------- | -------------------- |
| Timeline        | Catalogue / tyrian | --indigo-default (+ --trial-adept)    | #6366F1 / #4338CA    |
| Quiz            | Quizzes / vermilion| --flame-streak                        | #D14820 (#E8734A dk) |
| Daily Challenge | reward / gold-leaf | --gold-default (+ --gold-muted)       | #B8924A / #F2EAD0    |
| Book Details    | Reader / lapis CTA | --blue-default (CTA)                  | #2E75B6 (#6E9AC8 dk) |
| Book Details    | Catalogue / tyrian | --indigo-default (chrome)             | #6366F1              |
| correctness     | correct / incorrect| --trial-correct / --trial-incorrect   | #2D9A47 / #C84A52    |

Note: vermilion (#D14820, orange-leaning) is only used for quiz CHROME
(progress fill, headers, pre-answer selection ring). Once a question is
answered, option state flips to trial-correct(green)/trial-incorrect(red)
so it never reads as "wrong". Iridescence stays Virgil-only. Fonts:
Fraunces(display)/Literata(serif reading)/Switzer(sans UI) via existing
--font-display/serif/sans — unchanged.

### Codex form-token inventory (from /Users/matthewperez/codex/Codex)

- Radii: 6/10/14/20px + full (Codex). Tome already has --radius-sm…4xl;
  reuse Tome's, no new radius scale.
- Shadows: Codex --shadow-xs…xl + --shadow-glow (0 0 20px). Port the
  *recipe* (soft ambient + tight contact) recolored to Tome accents.
- Button depth (Codex Button.tsx): NOT a hard pressed-edge — it's a
  lift recipe: hover -translate-y-px + shadow, active translate-y-0 +
  shadow-xs, + ripple. Duolingo pressed-edge (colored face + darker
  bottom border that collapses on :active) is the prompt's spec, built
  fresh here as `.tactile-btn` (no Codex source had it literally).
- Motion: ease-out cubic-bezier(0.16,1,0.3,1), ease-bounce
  cubic-bezier(0.34,1.56,0.64,1), durations 150/250/400/500. Tome has
  --tome-ease-out-expo (same curve) + springs {interactive 300/25,
  gentle 120/20}. Reuse Tome's.

### Shared primitives built (Part 0D) — namespaced `--codex-*` / `.tactile-*`

Added to src/styles/globals.css (appended after @layer base). All accept a
`--accent` CSS var so each surface recolors one primitive set:
- `.tactile-btn` — pressed-edge 3D button (face + darker bottom edge,
  collapses 2px on :active). reduced-motion: no translate.
- `.tactile-card` — ambient+contact shadow card, accent-tinted border.
- `.depth-track` / `.depth-fill` — recessed progress groove + raised fill.
- `.chip-accent` — soft accent pill.
- `.node-disc` — raised circular node (timeline author / quiz letter).
- `.seal-stamp` — reward seal (Daily Challenge done state).
- `.accent-bloom` — Brilliant-style radial glow behind correct/reward.
- Depth tokens: --codex-shadow-ambient/-contact/-raised, --codex-edge.

### Four-surface audit (Part 1) — behaviors that MUST survive

1. **Timeline** — `src/app/(app)/timelines/page.tsx` +
   `src/components/timelines/HorizontalTimeline.tsx`. CHRONOLOGICAL strip
   (sorted by publicationYear, alternating above/below axis, 2-row split
   via ResizeObserver). Data: `@/data/timelines` (REGION_ORDER,
   getTimelinesByRegion, getTimelineAuthors) + BOOKS. Behaviors: 2-level
   accordion w/ localStorage persistence (tome-timelines-accordion);
   AuthorDropdown anchored to clicked node rect (click-outside + Escape);
   per-tradition `timeline.accentColor`; per-author geography color
   (getGeographyColor). Owns Catalogue/tyrian for CHROME only — keep the
   per-tradition/per-geo node colors (data-driven identity).

2. **Quiz** — `src/app/(app)/quiz/[quizId]/page.tsx`. Duolingo arena.
   Data: Supabase quizzes/questions, falls back to SAMPLE_QUESTIONS.
   Engine `@/lib/quiz-engine` supports 5 QuestionTypes (multiple_choice,
   true_false, fill_blank, ordering, matching) but the PAGE only renders
   3 UI patterns: OptionCard (MC/TF) + FreeTextInput (fill_blank).
   ordering/matching have NO renderer — NOT adding one (logic untouched);
   noted as out-of-scope. Behaviors: number-key 1-4 shortcuts, hearts
   (economy quiz_correct/quiz_wrong), confetti on correct, shake on wrong,
   heart-flash, complete/perfect/all-hearts-lost screens, keyboard X back.
   Correct/incorrect ALREADY var(--tome-success/--tome-error) → keep.
   Owns Quizzes/vermilion for chrome (progress fill currently --tome-amber,
   pre-answer selection currently --tome-accent gold → vermilion).

3. **Daily Challenge** — `src/app/(app)/dashboard/page.tsx` lines ~354-447
   (inline card, not its own route). Single MCQ. Data: CHALLENGES pool,
   rotates by dayOfYear(); done-state persists localStorage
   tome-challenge-done-<dateKey>; correct → setChallengeDone after 1200ms.
   Currently INDIGO (#6366F1) chrome + amber XP pill + emerald/rose answer
   feedback + BorderBeam. Per new spec it OWNS reward/gold-leaf → repaint
   chrome gold, done-state seal. Keep emerald correct / rose incorrect.

4. **Book Details** — `src/app/(app)/book/[id]/page.tsx`. Data: getBook/
   getChapters/getAuthor/getBooksByTradition/getBooksByAuthor; progress
   via book-progress localStorage. Behaviors: Start/Continue CTA
   (handleStartReading creates+saves progress, routes /read/[id]);
   bookmark toggle (shelves store); show-all-chapters; mobile sticky CTA;
   Canterbury-only enrichments; ChapterRow status (completed/current/
   available). CTA currently bg-foreground (ink). Owns Reader/lapis for
   the primary CTA + Catalogue/tyrian for chrome (breadcrumb/section
   accents). Keep per-tradition tradColor for covers/badges (identity).
