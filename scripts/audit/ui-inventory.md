# UI Inventory — Phase 1

_Generated 2026-04-20. Read-only audit. No edits performed._

## Pre-flight flags

- **No `PROGRESS.md`** in repo. Source of truth = code state.
- **Driver.js is NOT installed** (no `driver.js`, `intro.js`, `shepherd` in `package.json`). The spec's 9-step onboarding walkthrough has no subject. Existing onboarding lives under `src/app/(standalone)/onboarding/` as hand-built step pages. Phase 2B is re-scoped against those.
- **Mobile dock ships as `Home / Library / Read / Quiz / Profile`** (`src/lib/navigation.ts:87`), NOT the spec's `Dashboard / Library / Discover / Connections / Profile`. Code is treated as ground truth for this audit.
- **Two motion packages installed:** `framer-motion@12.38.0` AND `motion@12.38.0`. 130 files import from `"framer-motion"`, 59 from `"motion/react"`. No file imports from both. Dependency duplication ships both to the bundle.
- **`VirgilPanel.tsx` exists but is unused.** Only `VirgilDrawer.tsx` is wired (`src/app/(app)/read/[bookId]/page.tsx:55`). VirgilPanel matches the description of the old split UI and is flagged **P0 candidate for deletion** — awaiting confirmation.

---

## 1A — Route map

**Totals:** 63 page routes · 16 API routes · 9 `loading.tsx` · **1** root `error.tsx` · 1 `middleware.ts`

### Route groups
- `(app)` — 54 pages. Layout: `src/app/(app)/layout.tsx` (AppShell with sidebar + dock).
- `(standalone)` — 9 pages. Layout: `src/app/(standalone)/layout.tsx` (minimal shell).
- Root — `src/app/layout.tsx` provides fonts, `metadata`, theme provider.

### Auth model (from `middleware.ts`)
- Public routes: `/`, `/login`, `/signup`, `/auth/callback`, `/join/*`, `/learn/*`.
- **Unauthenticated users are allowed into all app routes** (demo mode, line 46–49). Supabase auth redirects only fire for authenticated users hitting role-gated routes.
- Teacher-only prefixes: `/classroom/create`, `/classroom/quiz-builder`, `/classroom/grading`, `/teacher/guided-learning`, plus `/classroom/[id]/manage`.
- Authenticated users without `onboarding_completed` → `/onboarding`.
- Authenticated users visiting `/login` or `/signup` → `/dashboard`.

### Page routes

| Path | File | Group | Loading | Gating |
|---|---|---|---|---|
| `/` | `(app)/page.tsx` | app | no | public |
| `/login` | `(standalone)/login/page.tsx` | standalone | no | public |
| `/signup` | `(standalone)/signup/page.tsx` | standalone | no | public |
| `/demo` | `(standalone)/demo/page.tsx` | standalone | no | public |
| `/onboarding` | `(standalone)/onboarding/page.tsx` | standalone | no | auth |
| `/learn/join` | `(standalone)/learn/join/page.tsx` | standalone | no | public |
| `/learn/session/[sessionId]` | `(standalone)/learn/session/[sessionId]/page.tsx` | standalone | no | public |
| `/learn/session/[sessionId]/review` | ... | standalone | no | public |
| `/hamlet-preview` | `(standalone)/hamlet-preview/page.tsx` | standalone | no | public |
| `/hamlet-preview/[sceneId]` | ... | standalone | no | public |
| `/work-preview/[workId]` | `(standalone)/work-preview/[workId]/page.tsx` | standalone | no | public |
| `/work-preview/[workId]/[sceneId]` | ... | standalone | no | public |
| `/dashboard` | `(app)/dashboard/page.tsx` | app | **yes** | demo-ok / auth-redirect-aware |
| `/library` | `(app)/library/page.tsx` | app | **yes** | demo-ok |
| `/explore` | `(app)/explore/page.tsx` | app | **yes** | demo-ok |
| `/book/[id]` | `(app)/book/[id]/page.tsx` | app | **yes** | demo-ok |
| `/book/[id]/complete` | ... | app | no | demo-ok |
| `/read/[bookId]` | `(app)/read/[bookId]/page.tsx` | app | no | demo-ok |
| `/reading` | `(app)/reading/page.tsx` | app | no | demo-ok (reached via mobile dock) |
| `/quiz/[quizId]` | `(app)/quiz/[quizId]/page.tsx` | app | no | demo-ok |
| `/quizzes` | `(app)/quizzes/page.tsx` | app | no | demo-ok (reached via mobile dock) |
| `/library`, `/shelves`, `/bookmarks` | ... | app | no (except library) | demo-ok |
| `/timelines` | `(app)/timelines/page.tsx` | app | no | demo-ok |
| `/authors`, `/author/[id]` | ... | app | **yes** / **yes** | demo-ok |
| `/achievements`, `/seals`, `/seals/[slug]` | ... | app | **yes** (achievements only) | demo-ok |
| `/social`, `/friends`, `/clubs`, `/clubs/[clubId]` | ... | app | **yes** (social, clubs) | demo-ok |
| `/study-groups`, `/study-groups/[groupId]` | ... | app | no | demo-ok |
| `/shop` | `(app)/shop/page.tsx` | app | no | demo-ok |
| `/profile`, `/profile/stats`, `/profile/avatar`, `/profile/[username]` | ... | app | no | demo-ok |
| `/join/[code]` | `(app)/join/[code]/page.tsx` | app | no | public |
| `/classroom` | `(app)/classroom/page.tsx` | app | no | demo-ok |
| `/classroom/create` | ... | app | no | **teacher** |
| `/classroom/join` | ... | app | no | demo-ok |
| `/classroom/[id]` | ... | app | no | demo-ok |
| `/classroom/[id]/manage` | ... | app | no | **teacher** |
| `/classroom/[id]/assignment/[assignmentId]` | ... | app | no | demo-ok |
| `/classroom/[id]/assignments/create` | ... | app | no | demo-ok |
| `/classroom/[id]/student/[studentId]` | ... | app | no | demo-ok |
| `/classroom/grading` | ... | app | no | **teacher** |
| `/classroom/grading/essay/[submissionId]` | ... | app | no | **teacher** (via prefix) |
| `/classroom/quiz-builder` | ... | app | no | **teacher** |
| `/classroom/quiz-builder/[quizId]` | ... | app | no | **teacher** |
| `/teacher/students/[studentId]` | ... | app | no | demo-ok |
| `/teacher/parents` | ... | app | no | demo-ok |
| `/teacher/guided-learning` | ... | app | no | **teacher** |
| `/teacher/guided-learning/new` | ... | app | no | **teacher** |
| `/teacher/guided-learning/[sessionId]` | ... | app | no | **teacher** |
| `/teacher/guided-learning/[sessionId]/edit` | ... | app | no | **teacher** |
| `/teacher/guided-learning/[sessionId]/review` | ... | app | no | **teacher** |
| `/dev/components` | ... | app | no | dev-only |
| `/dev/sidebar-demo/student` | ... | app | no | dev-only |
| `/dev/sidebar-demo/teacher` | ... | app | no | dev-only |

### API routes (16)
- `POST /api/quiz-generate`
- `GET /api/time`
- `POST/GET /api/guided-sessions`
- `GET /api/guided-sessions/lookup`
- `GET /api/guided-sessions/[id]`
- `POST /api/guided-sessions/[id]/start`
- `POST /api/guided-sessions/[id]/end`
- `POST /api/guided-sessions/[id]/join`
- `GET/POST /api/guided-sessions/[id]/events`
- `GET/POST /api/guided-sessions/[id]/messages`
- `POST /api/guided-sessions/[id]/station-advance`
- `POST /api/guided-sessions/[id]/control`
- `GET /api/guided-sessions/[id]/reflections`
- `GET /api/guided-sessions/[id]/review`
- `GET /api/structured/[workId]`
- `GET /api/structured/[workId]/[sectionId]`

### Loading/error gaps
- **9/63 pages have `loading.tsx` (14%).** Missing on all high-traffic surfaces: `/read/[bookId]`, `/reading`, `/quizzes`, `/quiz/[quizId]`, `/classroom/**` (all 13), `/teacher/**` (all 7), `/profile/**`, `/study-groups/**`, `/shop`, `/timelines`, `/achievements`-detail, `/seals/*`, `/friends`, `/bookmarks`, `/shelves`.
- **Only 1 `error.tsx` in the repo, at the root.** No per-route error boundaries. An error in a reader page bubbles to root → whole-app fallback.

### Orphan routes (no inbound `href`/`Link` from `src/`)
Confirmed reached via **mobile dock**, not orphaned: `/reading`, `/quizzes`, `/library`, `/profile`.

Genuinely unlinked candidates: `/bookmarks`, `/shelves`, `/shop`, `/social`, `/seals`, `/seals/[slug]`, `/timelines`, `/friends`, `/dev/components`, `/dev/sidebar-demo/*`. Need Phase 2 crawl to confirm they're reachable via search, dropdowns, or dynamic nav before flagging for deletion.

---

## 1B — Component inventory (summary)

- **263 TSX files** under `src/components/`.
- **43 shadcn-style primitives** in `src/components/ui/` (`button`, `card`, `dialog`, `sheet`, `sidebar`, `tabs`, plus magicui-style animated primitives).
- **Component neighborhoods:**
  - `components/reader/` — 32 files (annotations + enhancements per work, `VirgilDrawer`, `VirgilPanel`, `VirgilTrigger`)
  - `components/tome/` — ~40 files (app shell, mobile dock, search dropdown, notifications, virgil companion, celebrations)
  - `components/landing/` — 28 root + 13 teacher variants + mockups/ (5)
  - `components/homepage/` — 2 + demos (13 feature demos) + mock (2)
  - `components/sidebar/` — icon animation system (per-role sidebar icons)
  - `components/classroom/`, `components/guided-learning/` — teacher + live-session surfaces
  - `components/achievements/`, `components/social/`, `components/timelines/`, `components/books/`, `components/stoa/`, `components/dashboard/`, `components/magic/`, `components/guided-learning/`
- **Props contract + mobile-variant per-component matrix** deferred to deep read in Phase 2 (too voluminous for Phase 1; sampled during audit).

**Confirmed live-wired feature surfaces** (not orphan):
- `VirgilDrawer.tsx` → `read/[bookId]/page.tsx:55`
- `MobileDock` → `(app)/layout.tsx` (AppShell)
- `VirgilTrigger.tsx` → `read/[bookId]/page.tsx`

**Suspected orphan** (no inbound import):
- `VirgilPanel.tsx` — **P0**, confirm then delete.
- Per-work annotation enhancement files (`beowulf-annotations`, `commedia-annotations`, `paradise-lost-annotations`, `idylls-of-the-king-annotations`, `faerie-queene-annotations`, `don-juan-annotations`, `orlando-furioso-annotations`, `odyssey-annotations`, `aeneid-annotations`, `canterbury-tales-annotations`, `decameron-annotations`, `le-morte-darthur-annotations`) — verify dispatch by book id in `read/[bookId]/page.tsx` before touching.

---

## 1C — Color / typography drift

### Off-token hex in TSX/inline styles
~15 concrete offenders, all in reader-enhancement components:
- `src/components/reader/beowulf-enhancements.tsx` — `#d6cdb9`, `#B8864D` (×3 as inline `color:` with CSS-var fallback)
- `src/components/reader/structured-hamlet-reader.tsx` — `#fbf8f3`, `#b08d57` (×5; fallback syntax)
- Scattered: `src/components/reader/commedia-annotations.tsx`, `orlando-furioso-annotations.tsx`, `don-juan-annotations.tsx`, `faerie-queene-annotations.tsx`, `idylls-of-the-king-annotations.tsx`, `paradise-lost-annotations.tsx` — each uses one or two per-work brand-ish hex values

Policy call: these are per-work editorial colors (gold-ish for Beowulf, rose-ish for commedia). Either tokenise as `--work-beowulf-narrator`, `--work-commedia-accent`, etc., or accept them as book-specific editorial styling outside the main token system. Flagging as **P1 tokenisation opportunity**, not a bug.

### Non-system fonts
Five `Georgia, serif` / `ui-serif, Georgia, serif` bare fallbacks:
- `src/app/(app)/classroom/grading/essay/[submissionId]/page.tsx`
- `src/app/(standalone)/work-preview/[workId]/[sceneId]/scene-client.tsx` (×2)
- `src/app/(standalone)/hamlet-preview/[sceneId]/scene-client.tsx`
- `src/components/reader/structured-hamlet-reader.tsx` (fallback-only)

These are intentional print-like serifs in editorial preview contexts. Still **P1** per locked-typography rule — should point at `var(--font-serif)` (Literata) directly.

### Font loader coverage
`src/app/layout.tsx` needs spot-check to confirm Playfair (display), Literata (serif/reader), Plus Jakarta Sans (sans/UI) are all wired via `next/font`. Deferred to Phase 2.

---

## 1D — Emoji detection

~11 emoji occurrences concentrated in two places:
- `src/data/books.ts` — `"emoji": "📖"` on one tradition entry, plus `✅` in comments (×9). The data-level `emoji:` key is wired for UI display → **P1 rename/rewire to Lucide**.
- `src/app/(standalone)/onboarding/step-teacher-tradition.tsx` — `📖`. **P1** replace with Lucide `BookOpen`.

No emoji in landing, homepage, reader, virgil, dashboard, or classroom surfaces. Risk is narrow.

---

## 1E — Icon consistency

- `lucide-react` is imported across ~188 files. The ONLY icon library in use.
- **Close (`X`) sizing is inconsistent:**
  - `h-4 w-4`: `guided-learning/wizard/station-editor-modal.tsx`, `guided-learning/message-inline-card.tsx` (other occurrence), `tome/chapter-quiz-overlay.tsx` (`w-4 h-4`)
  - `h-3 w-3`: `guided-learning/message-inline-card.tsx`
  - **P2** — standardise on `size-4` (16px) for inline close, `size-5` (20px) for sheet/dialog close, document rule.
- `ChevronRight`/`ChevronLeft`/`ChevronDown` appear consistent at `h-4 w-4` (sampled).
- No `Menu` icon in primary nav — `MobileDock` uses per-tab icons.

---

## 1F — Animation surface

- **Files importing motion (`framer-motion` + `motion/react`):** 189 total (130 + 59, no overlap).
- **`AnimatePresence` usage:** 71 files — widely used for conditional mounts (good).
- **`useReducedMotion` usage:** **2 files only** — `src/components/sidebar/animations/AnimatedSvg.tsx`, `AnimatedIconWrapper.tsx`. Every other animated component assumes reduced-motion does not matter. **P1** blanket coverage gap.
- **Inline transition objects duplicating tokens (sample):**
  - `src/components/reader/VirgilTrigger.tsx` — `transition={{ duration: 0.2 }}` → should reference `durations.fast` / `0.2`.
  - `src/components/reader/VirgilPanel.tsx` — `transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}` (orphan file — dies with VirgilPanel removal).
  - `src/components/reader/VirgilDrawer.tsx` — same cubic-bezier `[0.32, 0.72, 0, 1]`. This is a sheet-physics curve not present in tokens. Propose adding `ease.sheet` token.
  - `src/components/ui/progress.tsx`, `word-rotate.tsx`, `text-animate.tsx` — inline `duration: 0.25 / 0.3 / 0.5` scattered.
- **Inline spring configs (`stiffness:` + `damping:` pairs):** ~26 outside `sidebar-tokens.ts`. `mobile-dock.tsx`, `VirgilDrawer.tsx`, several landing showcases. Most use the `springs.interactive` token already; the inline ones are refactor candidates (**P2**).
- **Mixed import idiom:** 130 files on `framer-motion`, 59 on `motion/react`. Recommend consolidating on `motion/react` in Phase 6 P2 and dropping the duplicate dep.

---

## 1G — Form + input surface

- **Raw `<input>`:** ~47. Raw `<textarea>`: handful. Raw `<select>`: a few.
- **Raw `<button>`:** ~278. `<Button>` component: ~141. Ratio 2:1 raw to component. Not every raw button is wrong — icon-only buttons, nav links styled as buttons, and `<button type="submit">` inside forms are legitimate — but the spread needs a focus-ring + aria-label sweep.
- **Click on `<div>` / `<a>`:** 8+ samples (annotation overlays, `teacher/parents/page.tsx`, `work-preview` scene clients). P1 accessibility hit — these should be real `<button>`s or have `role="button" tabIndex={0}` + keyboard handlers.
- **Label coverage:** deferred to Phase 4 axe-core pass.

---

## 1H — Dead code / orphans

- **`VirgilPanel.tsx`** — genuinely unimported. P0 candidate for deletion pending your confirm.
- **Route-level orphans** already listed in 1A. Confirm in Phase 2.
- **Component-level suspected orphans** listed in 1B; verify before deletion.
- **Assets in `public/`** — not scanned in Phase 1 (defer to P2 pass).

---

## Summary: priority stack entering Phase 2

**P0 candidates (demo-blocking or spec-violating):**
1. `VirgilPanel.tsx` orphan → confirm + delete (spec says older split UI = P0).
2. Verify reader scroll / VirgilDrawer / dock actually function at runtime (Phase 2).

**P1 candidates (user-visible):**
1. Zero `useReducedMotion` coverage across 187/189 animated files.
2. Mobile dock IA mismatch with spec (or, if we agree code is ground truth: spec language needs update — no code change).
3. 54/63 pages missing `loading.tsx`.
4. Zero per-route `error.tsx` boundaries.
5. Emoji `📖` / `✅` in `data/books.ts` and onboarding step → Lucide.
6. Georgia serif fallbacks → Literata var.
7. `<div onClick>` button-misuse in annotation overlays + teacher/parents.
8. Middleware allows demo browsing everywhere — intentional, but note so Phase 2A auth checks are aligned.

**P2 candidates (polish):**
1. Duplicate motion packages (`framer-motion` + `motion`) — consolidate on `motion/react`.
2. Inline duration/easing tokens → reference `durations.*` / `ease.*`.
3. Reader-enhancement per-work hex colors → tokenise or accept as editorial.
4. `X` icon size drift (`h-3/h-4/w-4 h-4`) → standardise.
5. Raw `<button>` vs `<Button>` audit for focus-ring + aria coverage.

**Out of scope (per user constraint "no new features"):**
- Driver.js 9-step walkthrough — library not installed.
- Rhyme-scheme detection toggle — not in codebase.
- Standards alignment, Roster import, Semester Plan — not in codebase (homepage showcases exist for these, but app-side features do not).

---

_End of Phase 1 inventory. No edits performed. Awaiting approval before Phase 2._
