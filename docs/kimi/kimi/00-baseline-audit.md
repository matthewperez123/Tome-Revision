# 00 — Baseline Audit (Phase 0)

**Auditor:** Baseline_Audit_Engineer (Kimi rebuild team)
**Date:** 2026-07-22
**Branch:** `kimi/tome-virgil-maximalist-demo-20260722` @ `9fcbf535d` ("fix(student-login): install the session in the browser, not server-side")
**Repo:** `/Users/matthewperez/Documents/Kimi/Workspaces/Tome Kimi/tome-revision`
**Rule compliance:** no commits, no checkouts, no `.env` files created (build passed without needing one — see §5).

---

## 1. Environment

| Tool | Version | Source |
|---|---|---|
| Node | v24.15.0 | system |
| npm | 11.12.1 | system |
| pnpm | 11.7.0 | via corepack (`corepack pnpm`) |
| Platform | macOS, darwin-arm64 | `@esbuild/darwin-arm64`, `@img/sharp-darwin-arm64` resolved |
| Next.js | 16.2.0 (Turbopack build) | pinned in package.json |
| React | 19.2.4 | pinned |
| TypeScript | 5.9.3 | lockfile |

## 2. Package manager decision

**Chosen: pnpm** (lockfile: `pnpm-lock.yaml`).

Evidence:

- Both `package-lock.json` (v3) and `pnpm-lock.yaml` (v9.0) exist, plus `pnpm-workspace.yaml` and an `.npmrc` with `legacy-peer-deps=true`.
- Docs are inconsistent: `CLAUDE.md` references `pnpm audit:stoa` (a script that **no longer exists** in package.json); `README.md` is the generic create-next-app boilerplate listing npm/yarn/pnpm/bun. No definitive statement.
- Tie-breaker per mission rules (most recently updated lockfile): last git commit touching `pnpm-lock.yaml` = **2026-07-06 15:19:42 -0400**; `package-lock.json` = 2026-07-06 12:55:05 -0400. pnpm lockfile is ~2.5h newer the same day.
- `pnpm-workspace.yaml` is a pnpm-only artifact → pnpm is the working manager; `package-lock.json` is stale.

**Risk:** two live lockfiles invite divergent installs (see Risk R2).

## 3. Install

Command: `corepack pnpm install --frozen-lockfile`

**Result: PASS (exit 0)** — all deps resolved from lockfile; no changes to lockfile.

Warning (verbatim):

```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild@0.28.1, msw@2.14.6, sharp@0.34.5, unrs-resolver@1.12.2
Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.
```

Root cause: `pnpm-workspace.yaml` ships **placeholder** values:

```yaml
allowBuilds:
  esbuild: set this to true or false
  msw: set this to true or false
  sharp: set this to true or false
  unrs-resolver: set this to true or false
```

**Side effect (important for all agents):** pnpm 11's `verify-deps-before-run` re-validates before every `pnpm run <script>` and **fails with exit 1** in this state, so `pnpm run typecheck` / `pnpm run lint` / `pnpm run build` are all currently broken even though install succeeded. Verbatim failure:

```
[ERROR] Command failed with exit code 1: ... pnpm.mjs install
    at runDepsStatusCheck (.../pnpm.mjs:246833:7)
```

Setting `npm_config_verify_deps_before_run=false` did **not** bypass it. Workaround used for this audit: invoke `node_modules/.bin/<tool>` directly. Platform binaries (`@esbuild/darwin-arm64`, `@img/sharp-darwin-arm64`) are installed as packages, so the ignored postinstall scripts are not needed for the build to work (verified: build passes). Recommended fix (coordinator decision, not applied): fill in real booleans in `pnpm-workspace.yaml` or run `pnpm approve-builds`.

## 4. Typecheck

Command: `./node_modules/.bin/tsc --noEmit` (equivalent to `npm run typecheck`)

**Result: FAIL — 15 errors** (2 distinct root causes):

```
src/app/api/guided-sessions/[id]/control/route.ts(12,8): error TS2304: Cannot find name 'RouteContext'.
src/app/api/guided-sessions/[id]/end/route.ts(11,8):    error TS2304: Cannot find name 'RouteContext'.
src/app/api/guided-sessions/[id]/events/route.ts(13,8): error TS2304: Cannot find name 'RouteContext'.
src/app/api/guided-sessions/[id]/join/route.ts(15,8):   error TS2304: Cannot find name 'RouteContext'.
src/app/api/guided-sessions/[id]/route.ts(11,8):        error TS2304: Cannot find name 'RouteContext'.
src/app/api/guided-sessions/[id]/start/route.ts(13,8):  error TS2304: Cannot find name 'RouteContext'.
src/components/sidebar/animations/__tests__/registry.test.ts(7,38): error TS2307: Cannot find module 'vitest' ...
  (+ 8× TS7006 implicit-any on 'label' params in the same file, lines 62–111)
```

Analysis:

1. **6× `RouteContext` missing** in `src/app/api/guided-sessions/[id]/*` — a shared route-context type is referenced but never imported/declared. Real breakage in type safety of the guided-sessions API (6 of 12 route files under that path).
2. **9× vitest test file** — `src/components/sidebar/animations/__tests__/registry.test.ts` is written for Vitest but **Vitest is not in package.json** (dev or prod). This matches CLAUDE.md's "known registry.test.ts noise" note; the file is dead weight until a runner is added or the file is excluded.

`next build` does **not** surface these because Next 16/Turbopack build does not run `tsc --noEmit` over test files and apparently ignores or doesn't typecheck those route signatures strictly — the production build still passes (§6). The `typecheck` gate is nonetheless red.

## 5. Lint

Command: `./node_modules/.bin/eslint .` (equivalent to `npm run lint`)

**Result: FAIL — 590 problems (392 errors, 198 warnings) across 400 files.** 5 errors / 4 warnings auto-fixable.

Top rules violated:

| Rule | Count |
|---|---|
| `@typescript-eslint/no-unused-vars` | 183 |
| `@typescript-eslint/no-explicit-any` | 161 |
| `react-hooks/set-state-in-effect` | 109 |
| `@typescript-eslint/no-require-imports` | 60 |
| `react-hooks/refs` | 13 |
| `react-hooks/exhaustive-deps` | 8 |
| `react-hooks/purity` | 6 |
| `@next/next/no-img-element` | 5 |
| `react-hooks/preserve-manual-memoization` | 4 |
| `react-hooks/immutability` | 3 |

Note: 109 × `react-hooks/set-state-in-effect` is the new React Compiler-era ESLint rule from eslint-config-next 16 — a large share of the error count is rule-set strictness, not necessarily runtime bugs, but the volume means lint currently provides no signal for new changes. Hotspots include `src/lib/guided-notifications.ts` and cover/guided-learning modules.

## 6. Tests

**Unit — cover factory: PASS.**

Command: `./node_modules/.bin/tsx scripts/covers/cover-factory.test.ts` (= `npm run test:covers`)

```
cover-factory tests passed
```

Other test surfaces — **NOT RUN**, with reasons:

- `registry.test.ts` (Vitest) — Vitest not installed; not runnable (see §4).
- Playwright e2e (`e2e/marketing-nav.spec.ts`, `asset-reliability.spec.ts`, `sidebar-icons.spec.ts`; `npm run test:nav`) — requires a Chromium browser download **and** a running dev server on :3000, which needs real Supabase env vars. Deferred to a phase with credentials (see Risk R8).
- `verify:billing`, `verify:billing:stripe` — require live Stripe/Supabase credentials. Not attempted.
- No CI test script exists in package.json; there is no aggregate `npm test`.

## 7. Production build

Command: `./node_modules/.bin/next build` (= `npm run build`)

**Result: PASS (exit 0), with zero environment variables set.** No `.env.local` was needed — the build never hard-fails on missing Supabase/Stripe/Anthropic vars; those failures are deferred to runtime. (Mission step 3's fallback was therefore unnecessary; nothing was created or deleted.)

Build output: 151 route lines emitted (mix of `○ Static`, `● SSG`, `ƒ Dynamic`), plus `ƒ Proxy (Middleware)` — Next 16's renamed middleware, implemented in `src/proxy.ts` (deny-by-default auth gate with a public-route allow-list; `/read/*` requires auth by design).

2 Turbopack warnings (verbatim excerpts):

```
./src/app/api/covers/references/[id]/route.ts:14:20
The file pattern ('/ROOT/' <dynamic> | '/ROOT' <dynamic>) matches 73966 files in [project]/
  > 14 |   const resolved = path.resolve(process.cwd(), reference.cropPath)
Overly broad patterns can lead to build performance issues and over bundling.
```

```
./next.config.ts
Encountered unexpected file in NFT list — ... the whole project was traced unintentionally
(same import trace: api/covers/references/[id]/route.ts)
```

Impact: build-time file tracing of ~74k files — slower builds and potential serverless bundle bloat; recommend scoping the `path.resolve` or adding a `turbopackIgnore` comment (Phase 7 perf pass).

## 8. Dependency & security observations

Command: `npm audit --omit=dev` (audits the stale `package-lock.json`; treated as indicative — `pnpm audit` on the pnpm lockfile should be the follow-up once the lockfile situation is resolved).

**Summary: 28 vulnerabilities — 2 low, 11 moderate, 15 high.** `npm audit fix` (non-breaking) resolves a subset.

High-severity items of note:

| Package | Advisory | Fix |
|---|---|---|
| `next` 9.3.4-canary…16.3.0-preview.7 | DoS with Server Components (GHSA-q4gf-8mx6-v5v3, GHSA-8h8q-6873-q5fj) | **→ 16.2.11, non-major** — we run 16.2.0, so we are vulnerable; upgrade is drop-in |
| `sharp` <0.35.0 | high | → 0.35.3 (major) |
| `adm-zip` <0.6.0 | high | → 0.6.0 (major; used in cover import path) |
| `react-simple-maps` (pulls `d3-color`/`d3-interpolate`/`d3-transition`/`d3-zoom` highs) | high | → react-simple-maps 1.0.0 (major downgrade-shaped fix — verify before applying) |
| `ws` 8.0.0–8.20.1 | memory disclosure + DoS (GHSA-58qx-3vcg-4xpx, GHSA-96hv-2xvq-fx4p) | non-breaking fix available |
| `undici` | cross-user info disclosure (GHSA-pr7r-676h-xcf6) | non-breaking |
| `hono`, `js-yaml`, `fast-uri`, `picomatch`, `brace-expansion` | high (transitive) | non-breaking |

Moderate chain worth knowing: `resend@6.12.2` → `svix` → `uuid <11.1.1` (missing buffer bounds check); `@anthropic-ai/sdk@0.79–0.91` moderate (we run 0.90.x); `postcss <8.5.10`, `qs`, `ip-address`, `@hono/node-server`.

Also: `pnpm install` prints `✓ Lockfile passes supply-chain policies` — pnpm 11's built-in policy check passes.

## 9. Route manifest

Inventoried from `src/app` (151 build-emitted routes; page/route files enumerated via `find`). Groups: `(app)` = main shell with shared layout (mostly behind `src/proxy.ts` auth gate), `(standalone)` = chromeless (auth/onboarding/live surfaces), `api` = route handlers. Root files: `layout.tsx`, `error.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`, `favicon.ico`, `og-image.png`; plus `src/proxy.ts` (middleware) and `src/liveblocks.config.ts`. Descriptions inferred from code/metadata where not explicit.

### 9.1 `(app)` — main shell

| Route | Purpose |
|---|---|
| `/` | Marketing landing (AboutPage + live catalog stats; SEO metadata) |
| `/accessibility` | Accessibility statement |
| `/account` | Account settings |
| `/admin/covers` | Cover Factory admin console |
| `/assignments` | Student's assignment list |
| `/assignments/[id]` | Assignment detail |
| `/authors` | Author index |
| `/author/[id]` | Author detail page |
| `/billing/success` | Post-Stripe-checkout success landing |
| `/book/[id]` | Book detail / portal |
| `/book/[id]/complete` | Book-completion celebration |
| `/bookmarks` | Saved passages |
| `/classroom` | Teacher classroom hub |
| `/classroom/create` | Create classroom |
| `/classroom/join` | Join by code (teacher/student entry) |
| `/classroom/grading` | Teacher grading queue |
| `/classroom/quiz-builder` | Teacher quiz list |
| `/classroom/quiz-builder/[quizId]` | Quiz editor |
| `/classroom/quiz-builder/[quizId]/results` | Quiz results |
| `/classroom/[id]` | Classroom home |
| `/classroom/[id]/manage` | Roster/settings mgmt (join-code rotate lives here) |
| `/classroom/[id]/gradebook` | Per-class gradebook |
| `/classroom/[id]/progress` | Class reading progress |
| `/classroom/[id]/lectern` | Teacher "lectern" live-reader view (per-student activity) |
| `/classroom/[id]/join-poster` | Printable join-code poster |
| `/classroom/[id]/assignments/create` | Assignment creator |
| `/classroom/[id]/assignment/[assignmentId]` | Assignment detail |
| `/classroom/[id]/assignment/[assignmentId]/read` | Assignment-scoped reading view |
| `/classroom/[id]/quiz/[quizId]` | In-class quiz taking |
| `/classroom/[id]/semester-plan` | Semester plan list |
| `/classroom/[id]/semester-plan/new` | New semester plan |
| `/classroom/[id]/semester-plan/[planId]` | Semester plan detail |
| `/classroom/[id]/student/[studentId]` | Per-student drill-down |
| `/contact` | Contact page |
| `/dashboard` | Reader dashboard |
| `/dev/components`, `/dev/covers`, `/dev/trials` | Internal dev previews |
| `/dev/sidebar-demo/student`, `/dev/sidebar-demo/teacher` | Sidebar demos per role |
| `/educators` | Marketing — for educators |
| `/explore` | Catalog explore (country-colored map of books) |
| `/faq` | FAQ |
| `/join` | Join classroom entry |
| `/join/[code]` | Join via code link |
| `/join/seat/[token]` | School seat invite acceptance |
| `/library` | Personal library |
| `/library/browse` | Browse full catalog |
| `/messages` | Direct messages |
| `/notifications` | Notification center |
| `/pricing` | Pricing (Solo/Family/School) |
| `/privacy` | Privacy policy |
| `/profile` | User profile |
| `/quizzes` | Platform quiz (Trial) index |
| `/quiz/[quizId]` | Take a platform quiz / Trial |
| `/read/[bookId]` | The reader (own layout; entitlement gate; error+loading boundaries) |
| `/readers` | Marketing — for readers |
| `/reading` | Currently-reading / progress shelf |
| `/security` | Security statement |
| `/semester` | Personal semester reading view (client, supabase) |
| `/semester-plan` | Personal semester plan (rubric-driven) |
| `/shelves` | Reading-progress shelves with covers |
| `/teacher/guided-learning` | Guided session list |
| `/teacher/guided-learning/new` | Create guided session |
| `/teacher/guided-learning/[sessionId]` | Session control/detail |
| `/teacher/guided-learning/[sessionId]/edit` | Edit session |
| `/teacher/guided-learning/[sessionId]/review` | Post-session review |
| `/teacher/students/[studentId]` | Teacher per-student overview |
| `/terms` | Terms of service |
| `/timelines` | Horizontal literary timelines by author |
| `/virgil` | Virgil marketing landing |

### 9.2 `(standalone)` — chromeless

| Route | Purpose |
|---|---|
| `/login` | Sign-in |
| `/signup` | Sign-up |
| `/student-login` | Code-only (COPPA, email-free) student sign-in |
| `/onboarding` | Post-signup onboarding funnel (own layout) |
| `/auth/error` | Auth error page |
| `/auth/forgot-password` | Password reset request |
| `/auth/reset-password` | Password reset form |
| `/auth/verified` | Email-verified confirmation |
| `/auth/verify-email` | Verify-email prompt |
| `/demo` | Book-a-demo form (schools) |
| `/goodbye` | Post-account-deletion farewell |
| `/classroom/live/[sessionId]` | Fullscreen live classroom session |
| `/learn/join` | Student join for guided session |
| `/learn/session/[sessionId]` | Student live guided session |
| `/learn/session/[sessionId]/review` | Student post-session review |
| `/hamlet-preview`, `/hamlet-preview/[sceneId]` | Standalone Hamlet work preview |
| `/work-preview/[workId]`, `/work-preview/[workId]/[sceneId]` | Standalone generic work/scene preview |

### 9.3 `api` — route handlers

| Route | Purpose |
|---|---|
| `/api/auth/email-hook` | Supabase auth email hook |
| `/auth/callback` (root route handler) | OAuth/magic-link callback |
| `/api/billing/portal` | Stripe billing portal session |
| `/api/stripe/checkout` | Create Stripe checkout |
| `/api/stripe/portal` | Stripe customer portal |
| `/api/stripe/webhook` | Stripe webhook (idempotent via stripe_events) |
| `/api/virgil` | Virgil AI dispatcher (teacher-gated 403 before dispatch) |
| `/api/quiz-generate` | AI quiz generation |
| `/api/progress/quiz` | Record quiz result (sole write path via `record_trial_result` RPC) |
| `/api/guided-sessions` | Guided session CRUD |
| `/api/guided-sessions/lookup` | Session lookup by code |
| `/api/guided-sessions/[id]` | Session detail |
| `/api/guided-sessions/[id]/{start,end,control,station-advance}` | Session lifecycle/control |
| `/api/guided-sessions/[id]/{join,events,messages,reflections,review}` | Participation, realtime events, messages, reflections, review |
| `/api/guided-sessions/quiz/generate`, `/api/guided-sessions/quiz/assistant`, `/api/guided-sessions/quiz/[quizId]` | Session quiz AI + fetch |
| `/api/classroom/semester-plan/generate` | AI semester plan generation |
| `/api/classroom/semester-plan/[planId]/{assistant,candidates,mutate,provision,revise}` | Plan AI assistant, book candidates, mutations, provisioning, revision |
| `/api/school/invite`, `/api/school/seats` | School seat invites/management |
| `/api/covers/health` | Cover pipeline health check |
| `/api/covers/references/[id]` | Serve cover reference crops (Turbopack over-tracing warning source) |
| `/api/cron/due-soon`, `/api/cron/family-summary`, `/api/cron/weekly-digest` | Scheduled jobs (see vercel.json crons) |
| `/api/demo-request` | Demo form ingestion (anon INSERT, service-only SELECT) |
| `/api/liveblocks-auth` | Liveblocks room auth (classroom + reader rooms) |
| `/api/structured/[workId]`, `/api/structured/[workId]/[sectionId]` | Structured work content API |
| `/api/time` | Server time utility |

## 10. Risk register

| # | Risk | Severity | Evidence | Suggested mitigation |
|---|---|---|---|---|
| R1 | Next.js 16.2.0 vulnerable to 2 high-severity Server Component DoS advisories | High | §8 | Bump `next`+`eslint-config-next` → 16.2.11 (non-breaking); regression-run build |
| R2 | Two live lockfiles (npm + pnpm) — installs can diverge silently; audit ran against the stale one | High | §2 | Coordinator decision: delete `package-lock.json`, standardize on pnpm; re-run `pnpm audit --prod` |
| R3 | `pnpm run *` broken by placeholder `allowBuilds` in `pnpm-workspace.yaml` (pnpm 11 verify-deps-before-run exits 1) | High (workflow) | §3 | Fill real booleans / `pnpm approve-builds`; until then all agents must call `node_modules/.bin/*` |
| R4 | Typecheck gate red: 6 guided-sessions routes reference undeclared `RouteContext` | Medium | §4 | Define/import the type (likely Next 16 route-context helper); re-run tsc |
| R5 | Lint signal-to-noise: 392 errors pre-existing, incl. 161 `no-explicit-any` and 109 `set-state-in-effect` | Medium | §5 | Baseline-then-ratchet strategy; do not attempt blanket fix during feature phases |
| R6 | Vitest test file with no Vitest dependency; no aggregate test script; no unit-test CI | Medium | §4, §6 | Either add Vitest or exclude/replace `registry.test.ts` |
| R7 | Build passes with zero env vars — missing-config failures deferred to runtime; deploys can look green while broken | Medium | §7 | Add a build-time env validation (master plan §19 already demands env validation) |
| R8 | No Vercel token / Supabase credentials / Mobbin MCP available — e2e, billing verify, deploy, and reference-research tasks blocked | High (program) | Blockers | Owner to provision; until then deterministic fallbacks per master plan |
| R9 | Turbopack over-traces ~73,966 files from `api/covers/references/[id]` | Low-Med | §7 | Scope `path.resolve` or `turbopackIgnore` |
| R10 | `adm-zip` high-severity vuln in cover import path; `resend→svix→uuid` moderate chain | Medium | §8 | Plan upgrades in Phase 7 hardening |
| R11 | Stale docs: CLAUDE.md references `pnpm audit:stoa` (script gone) and `src/data/stoa-collection.ts` (deleted 822dc1a7) — Stoa 1:1 invariant currently unenforced | Medium | AGENTS/CLAUDE vs package.json | Phase 3 must re-establish Stoa data + audit script or formally retire the invariant |
| R12 | `.npmrc` `legacy-peer-deps=true` is an npm-only knob; pnpm ignores it — peer behavior may differ from what earlier npm installs produced | Low | §2 | Verify after lockfile consolidation |

## 11. Command ledger (verbatim results)

| # | Command | Result |
|---|---|---|
| 1 | `corepack pnpm install --frozen-lockfile` | **PASS** (exit 0; ERR_PNPM_IGNORED_BUILDS warning for esbuild/msw/sharp/unrs-resolver) |
| 2 | `pnpm run typecheck` (both attempts, incl. `npm_config_verify_deps_before_run=false`) | **FAIL — tooling** (exit 1 in `runDepsStatusCheck`, never reached tsc) |
| 3 | `./node_modules/.bin/tsc --noEmit` | **FAIL — 15 errors** (6× TS2304 RouteContext, 1× TS2307 vitest, 8× TS7006) |
| 4 | `./node_modules/.bin/eslint .` | **FAIL — 590 problems (392 errors, 198 warnings), exit 1** |
| 5 | `./node_modules/.bin/tsx scripts/covers/cover-factory.test.ts` | **PASS** ("cover-factory tests passed") |
| 6 | `./node_modules/.bin/next build` (no env vars) | **PASS** (exit 0; 151 routes; 2 Turbopack tracing warnings) |
| 7 | `npm audit --omit=dev` | **28 vulnerabilities (2 low, 11 moderate, 15 high)** |
| 8 | Playwright e2e / verify:billing | **NOT RUN** — needs Chromium + live Supabase/Stripe credentials |
