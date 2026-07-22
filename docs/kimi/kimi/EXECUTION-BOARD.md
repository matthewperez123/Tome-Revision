# TOME REBUILD — EXECUTION BOARD

**Living coordinator board.** Updated by the coordinator and team leads as phases progress. Do not commit conflicts — edit only your rows.
**Branch:** `kimi/tome-virgil-maximalist-demo-20260722` · **Board created:** 2026-07-22 by Baseline_Audit_Engineer

Legend: ⬜ not started · 🔶 in progress · ✅ done · ⛔ blocked

---

## 1. Phase checklist (from Master Plan §22)

### Phase 0 — Protect and audit
- ✅ Working branch created (`kimi/tome-virgil-maximalist-demo-20260722`)
- ✅ Baseline report — `docs/kimi/00-baseline-audit.md`
- ✅ Current route map — `docs/kimi/00-baseline-audit.md` §9
- ⬜ Data map (Supabase schema/RLS inventory)
- ⬜ Screenshots of current product
- ⬜ Vercel / Supabase / GitHub connection verification — ⛔ no tokens/credentials
- ✅ Risk register — `docs/kimi/00-baseline-audit.md` §10
- ⬜ Checkpoint commit (coordinator)

### Phase 1 — Research and product system
- ⬜ Mobbin/reference synthesis — ⛔ no Mobbin MCP access discovered
- ⬜ Revised IA
- ⬜ Living Archive design tokens
- ⬜ Interaction principles
- ⬜ Component inventory
- ⬜ Motion vocabulary
- ⬜ Current-state improvement memo
- ⬜ Checkpoint commit

### Phase 2 — Virgil asset and animation system
- ⬜ Character bible
- ⬜ Expression/pose/contact sheets
- ⬜ Runtime assets
- ⬜ Semantic state machine
- ⬜ Virgil Lab
- ⬜ Sound/haptic primitives
- ⬜ Reduced-motion states
- ⬜ Checkpoint commit

### Phase 3 — Core game loop
- ⬜ Journey home
- ⬜ Book portal
- ⬜ Reader
- ⬜ Text selection
- ⬜ Virgil (in-reader)
- ⬜ Trials
- ⬜ Wisdom/Flame/Seals
- ⬜ Stoa (note: stoa-collection data file was deleted pre-branch; invariant unenforced — R11)
- ⬜ Featured book registry
- ⬜ Cover set
- ⬜ Checkpoint commit

### Phase 4 — Maximalist showcase and Macbeth journey
- ⬜ `/showcase`
- ⬜ Role and device switchers
- ⬜ Deterministic Macbeth path
- ⬜ 14-day journey
- ⬜ Reset
- ⬜ Teacher/parent switch
- ⬜ Recording-ready flow
- ⬜ Checkpoint commit

### Phase 5 — Authenticated product and school loop
- ⬜ Onboarding
- ⬜ Real auth preservation
- ⬜ Reader persistence
- ⬜ Assignments
- ⬜ Quiz builder
- ⬜ Gradebook
- ⬜ Guided/live session polish
- ⬜ Semester plan
- ⬜ Parent/social demonstrations
- ⬜ Checkpoint commit

### Phase 6 — PWA and Mac desktop
- ⬜ Installable PWA
- ⬜ Tauri shell
- ⬜ Tome icons
- ⬜ Deep links
- ⬜ `.app`
- ⬜ `.dmg`
- ⬜ Device Lab
- ⬜ Packaging docs
- ⬜ Checkpoint commit

### Phase 7 — Security, QA, and preview
- ⬜ Safe migration package
- ⬜ RLS tests
- ⬜ Advisor report
- ⬜ Playwright suite
- ⬜ Visual/accessibility/performance report
- ⬜ Vercel preview — ⛔ no Vercel token
- ⬜ Final checkpoint commit
- ⬜ No production promotion (standing rule)

---

## 2. File ownership table

Who owns what. Claim rows before writing; only the owner edits. Coordinator arbitrates conflicts.

| Path / glob | Owner | Status | Notes |
|---|---|---|---|
| `docs/kimi/00-baseline-audit.md` | Baseline_Audit_Engineer | ✅ complete | Phase 0 evidence |
| `docs/kimi/EXECUTION-BOARD.md` | Coordinator (all append) | 🔶 living | This file |
| _(empty — to be filled as agents claim files)_ | | | |

---

## 3. Decisions log

| # | Date | Decision | Made by | Rationale |
|---|---|---|---|---|
| D1 | 2026-07-22 | Package manager = **pnpm** (`pnpm-lock.yaml`); `package-lock.json` treated as stale | Baseline_Audit_Engineer | pnpm lockfile committed 2.5h later same day (2026-07-06); pnpm-workspace.yaml exists; docs inconclusive |
| D2 | 2026-07-22 | Build/typecheck/lint invoked via `node_modules/.bin/*`, not `pnpm run *` | Baseline_Audit_Engineer | pnpm 11 verify-deps-before-run exits 1 due to placeholder `allowBuilds` in pnpm-workspace.yaml (R3) |
| D3 | 2026-07-22 | No `.env.local` created for build | Baseline_Audit_Engineer | `next build` passes with zero env vars; fallback unnecessary (R7 tracks the underlying gap) |

---

## 4. Blockers

| # | Blocker | Impact | Needed from | Since |
|---|---|---|---|---|
| B1 | No Vercel token | Deploy/preview verification blocked (Phase 0, 7) | Owner | 2026-07-22 |
| B2 | No Supabase credentials (URL/anon/service keys for project `vjaezrcuuzmbmnsfrtwt`) | Dev server, e2e, RLS tests, data map blocked | Owner | 2026-07-22 |
| B3 | No Mobbin MCP access discovered | Reference synthesis (Phase 1) must fall back to WebBridge/public sources | Owner / tooling | 2026-07-22 |
| B4 | `pnpm run *` scripts fail (allowBuilds placeholders) | All agents must use `node_modules/.bin/*` workaround | Coordinator decision to edit `pnpm-workspace.yaml` | 2026-07-22 |
| B5 | Playwright browsers not installed + no live env | e2e suite unrunnable | B2 + `playwright install` approval | 2026-07-22 |

---

## 5. Evidence log

Verifiable command results. Newest last.

| Date | Agent | Evidence | Location |
|---|---|---|---|
| 2026-07-22 | Baseline_Audit_Engineer | Install/typecheck/lint/test/build/audit results with verbatim excerpts | `docs/kimi/00-baseline-audit.md` §11 |

---

## 6. Merge order

Coordinator-controlled sequence for landing work onto the integration branch. (Empty until Phase 0 closes.)

| Order | Branch / scope | Depends on | Status |
|---|---|---|---|
| 1 | _(TBD by coordinator)_ | | |
