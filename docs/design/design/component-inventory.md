# The Living Archive — Component Inventory

**Author:** Living_Archive_Design_Engineer (Tome rebuild team)
**Date:** 2026-07-22 · **Branch:** `kimi/tome-virgil-maximalist-demo-20260722`
**Companions:** `living-archive.md` (tokens/typography) · `motion-vocabulary.md` (presets)
**Token refs:** `var(--la-*)` from `src/styles/living-archive.css`; motion refs are keys of `tactileMoments` in `src/lib/design/motion.ts`.

---

## State legend

Every interactive element implements all eight states plus keyboard behavior and reduced-motion behavior (Master Plan §7). Standard meanings:

| State | Standard treatment |
|---|---|
| **idle** | rest color, raised edge shadow |
| **hover** | `scale 1.02` or surface lift (pointer:fine only) |
| **focus** | 3px `--la-focus` ring, 2px offset (`.la-focus-ring`); never `outline: none` |
| **pressed** | `scale 0.96`, edge shadow compresses 4→2px (`pressPrimary`) |
| **loading** | opacity 0.85 + progress ring / shimmer; control stays mounted, label persists |
| **success** | `--la-success` wash + check glyph; `correctAnswerResponse` where celebratory |
| **error** | `--la-error` icon + color + inline placement above/beside the control; never red alone |
| **disabled** | opacity 0.5, no edge shadow, `aria-disabled`, still focusable where a tooltip explains why |

Keyboard: Enter/Space activates buttons/nodes/cards; arrows move within groups (match cards, page-turn, bottom-nav); Esc dismisses sheets/drawers/trays. Reduced motion: all transform choreography collapses per `motion-vocabulary.md` §6.

---

## Explore-mode components

### 1. Buttons (primary / secondary / ghost)
- **States:** full 8-state matrix. Primary = `--la-primary` fill, `--la-primary-ink` text, `--la-primary-edge` bottom edge; hover +2% scale; pressed per `pressPrimary`; loading = ring + dimmed label; success = jade flash on the button itself; error shakes **never** — inline message below; disabled per legend. Secondary = `--la-secondary` fill + `--la-secondary-ink`. Ghost = transparent + `--la-ink`, hover `--la-primary-soft`.
- **Tokens:** `primary*`, `secondary*`, `success`, `error`, `focus`, `radius-m`.
- **Motion:** `pressPrimary` (all), `correctAnswerResponse` jade wash for success.
- **Notes:** text in Inter 500–600; never Fraunces; min touch target 44px.

### 2. Path nodes
- **States:** idle = typed shape (chapter disc / Trial diamond / Virgil lantern / reward star) on the trail; hover = lift + label; focus = ring; pressed = squash; loading = ring stroke animates while the destination resolves; success = completed fill (world `accent`) + check; error = n/a (navigation failures surface as toast); disabled/locked = opacity 0.55 + lock glyph, focusable with "Complete the previous chapter to unlock" description.
- **Tokens:** world palette (`--la-world-{id}-ground/-accent/-glow`), `surface`, `ink`, `focus`.
- **Motion:** `pressPrimary` for touch, `pathNodeUnlock` for the locked→unlocked transition.
- **Notes:** node shape carries content type (synthesis §5 — no indistinguishable bubbles); 48px hit area.

### 3. Book portal cards
- **States:** idle = cover + world ground frame + title in Fraunces (real text, never baked in); hover = frame breathes (`scale 1.02`, glow lifts); focus = ring + visible "Enter {book}" label; pressed = squash; loading = portal glow pulses while the world route resolves; success = n/a; error = world-art fallback (procedural cover) + retry affordance; disabled = n/a (locked books use path-node semantics).
- **Tokens:** world `ground/deep/accent/glow`, `shadow-portal`, `radius-l`, `ink`.
- **Motion:** `openBookPortal` on entry, `coverToWorld` shared-element into the world.
- **Notes:** 3:4 cover ratio; alt text = book title + world mood.

### 4. Cover stacks
- **States:** idle = 3–5 covers fanned ±4°; hover = top cover lifts, fan widens 2°; focus = ring around stack, roving tabindex to individual covers; pressed = top cover presses; loading = skeleton spines in world `ground` at 20% opacity; success/error = n/a; disabled = n/a.
- **Tokens:** world `ground`, `shadow-raised`, `radius-m`.
- **Motion:** springs `interactive`; opening a cover from the stack uses `coverToWorld`.
- **Notes:** max fan 5; beyond that, "+N more" chip in JetBrains Mono.

### 5. Progress rings
- **States:** idle = track `--la-surface-sunken`, fill `--la-primary` (or world `accent` inside worlds); hover/focus/pressed = n/a (non-interactive, but `role="progressbar"` with `aria-valuenow`); loading = indeterminate slow rotate (reader-exempt: never on reading canvas); success = fill swaps to `--la-success` with one draw cycle; error = fill swaps to `--la-error` statically; disabled = n/a.
- **Tokens:** `primary`, `success`, `error`, `surface-sunken`, world `accent`.
- **Motion:** stroke-dashoffset tween 450ms `outExpo`; reduced = value shown, no draw.

### 6. Wisdom chips
- **States:** idle = `--la-wisdom` fill, `--la-wisdom-ink` count (JetBrains Mono tabular), lantern glyph; hover = tooltip "Wisdom is earned by reading and proving — never bought"; focus = ring (interactive only on reward surfaces); pressed/loading = n/a; success = count-up + sparkle (`wisdomCountUp`); error = n/a; disabled = n/a.
- **Tokens:** `wisdom`, `wisdom-ink`, `wisdom-soft`, `radius-round`.
- **Motion:** `wisdomCountUp`.
- **Notes:** count never decreases; no purchase affordance anywhere (synthesis §7).

### 7. Flame meter
- **States:** idle = lit flame + day count; at-risk = dimmer flame + neutral copy "Read a page today to keep the hearth warm" — **no countdown pressure, no sad mascot**; hover = hearth tooltip; focus = ring; pressed/loading = n/a; success = `flameSecured` ignition; error = n/a (a missed day is a state, not an error — shows unlit hearth + earn-back path); disabled = n/a.
- **Tokens:** `flame`, `flame-deep`, `flame-soft`, `ink-muted`.
- **Motion:** `flameSecured`; `returnAfterAbsence` for the rekindle.
- **Notes:** implements the "hearth, not whip" streak policy (synthesis §6): low floor, silent protection days, earn-back, zero guilt copy.

### 8. Seal medallions
- **States:** idle (locked) = silhouette in `--la-ink-faint` + name in mono; unlocked = full violet medallion; hover = rim highlight brightens; focus = ring + "Seal of {book}, earned {date}"; pressed = n/a; loading = n/a; success = `sealReveal` coin-turn at earn moment; error = n/a; disabled = locked state (focusable, explains the earning path).
- **Tokens:** `seal`, `seal-deep`, `seal-soft`, `wisdom` (rim), `ink-faint`.
- **Motion:** `sealReveal`.
- **Notes:** medallion art is original motif work per book; never reproduces copyrighted cover designs.

### 9. Stoa tiles
- **States:** idle (unrestored) = empty plinth outline in `ink-faint`; restored = reward artwork + plaque; hover = plaque caption rises; focus = ring + artwork alt text; pressed = n/a; loading = provenance caption skeleton; success = `stoaRestoration` when a new tile lands; error = artwork fallback + "image unavailable" caption (never a broken frame); disabled = n/a.
- **Tokens:** `surface-raised`, `shadow-raised`, `ink-muted`, `wisdom` (plaque accent).
- **Motion:** `stoaRestoration`.
- **Notes:** every tile carries provenance (public-domain source / original Tome art) in the plaque (Master Plan §10).

### 10. Virgil speech bubbles
- **States:** idle = `--la-surface-raised` bubble, `--la-ink` text (Inter 400), tail toward Virgil; hover = n/a; focus = ring when the bubble contains an action (hint link, citation deep-link); pressed = n/a; loading = three-dot "Virgil is thinking" (opacity pulse only, even without reduced-motion); success = n/a; error = calm boundary copy in the same bubble ("I can't help with that, but here's what we can explore") — never an alarm style; disabled = n/a.
- **Tokens:** `surface-raised`, `shadow-float`, `ink`, `ink-muted`, `focus`.
- **Motion:** staggers +90ms behind Virgil in `summonVirgil`.
- **Notes:** character voice per `virgil-voice-and-copy.md` (character lead); bubbles never cover reading text — margin or below-fold placement only.

## Prove-and-celebrate components

### 11. Match cards (draggable)
- **States:** idle = raised card, term in Literata; hover = lift (pointer devices); focus = ring + keyboard pickup with Space; pressed/dragging = `scale 1.05` + `shadow-portal`; loading = n/a; success = locks into slot with jade wash; error = polite sway `x [0,-8,8,-4,4,0]` + stays draggable — no penalty state; disabled = locked-after-correct (opacity 0.8, check glyph).
- **Tokens:** `surface-raised`, `shadow-raised/portal`, `success-soft`, `focus`.
- **Motion:** `dragTrialAnswer`; drop via `submitAnswer` ring.
- **Notes:** full keyboard parity — arrow-key movement between slots is mandatory (dnd-kit patterns already in repo).

### 12. Evidence-selection passages
- **States:** idle = passage in Literata, selectable spans underlined on hover; hover = `--la-primary-soft` span wash; focus = ring around the focused span (keyboard: Tab moves span to span, Space toggles); pressed = span wash deepens; loading = n/a; success = selected span settles to `--la-success-soft` + check margin glyph; error = `--la-near-miss-soft` + Virgil's passage-pointing hint (never red X on literature); disabled = submitted state, selections frozen.
- **Tokens:** `primary-soft`, `success-soft`, `near-miss-soft`, `ink`.
- **Motion:** `highlightPhrase` for selection; `nearMissResponse` / `correctAnswerResponse` on submit.
- **Notes:** implements "feedback teaches" (synthesis §9): first miss → hint pointing at the passage; second → explained answer with the passage quoted.

### 13. Hint drawers
- **States:** idle = collapsed drawer tab "Ask Virgil for a nudge"; hover = tab lifts; focus = ring; pressed = tab presses; loading = lantern pulse while the hint generates; success = drawer opens to hint level 1/2/3 content; error = "Virgil is away" offline fallback copy + retry; disabled = all hints exhausted (explains the final explanation will come after submission).
- **Tokens:** `surface-raised`, `shadow-float`, `wisdom-soft` (hint background), `ink`.
- **Motion:** spring `sheet` (260/28); reduced = height cuts over instantly.
- **Notes:** hint ladder per Master Plan §8 — nudge → narrow the field → point to evidence; hint use is logged for teachers, never penalized.

### 14. Page-turn controls
- **States:** idle = edge zone arrows, `ink-muted` glyphs, visible on chrome summon; hover = glyph darkens + nudge 2px toward direction; focus = ring; pressed = glyph presses; loading = next page shimmer (text skeleton in Literata metrics); success = new page settled; error = "couldn't load this chapter" inline + retry (position preserved); disabled = at first/last page (arrow at 40% opacity, `aria-disabled`).
- **Tokens:** `ink-muted`, `ink`, `surface`, `focus`.
- **Motion:** `openReader` page slide; **reader exception**: reduced-motion or reader-night = instant swap, always.
- **Notes:** 48px+ edge zones; swipe on touch; arrow keys on desktop; chrome auto-hides after 3s of reading stillness.

### 15. Reward trays
- **States:** idle = collapsed tray tab at screen bottom; hover = tab rises 4px; focus = ring; pressed = tab presses; loading = tray opens to skeleton tiles; success = tray opens with the earned artifact mid-`stoaRestoration`/`sealReveal` ceremony; error = artifact image fallback + provenance still shown; disabled = n/a.
- **Tokens:** `surface-raised`, `shadow-float`, `wisdom-soft`, world `glow` (artifact backdrop).
- **Motion:** spring `sheet`; ceremony choreography from #14/#15 presets.
- **Notes:** trays are always dismissible (Esc, scrim tap, close button) and never block continuing — ceremony is skippable (motion principle 2).

## Chrome & system components

### 16. Bottom sheets
- **States:** idle = closed; opening = `y 100%→0` spring `sheet` over `--la-overlay` scrim; hover/focus per contained controls (focus trapped, initial focus to sheet title); pressed per controls; loading = content skeleton; success/error = inline within sheet; disabled = n/a; dismissed = Esc, scrim, swipe-down (velocity-aware).
- **Tokens:** `surface-raised`, `shadow-float`, `overlay` (`overlay-solid` under reduced transparency), `radius-l` top corners, `--la-backdrop-blur`.
- **Motion:** spring `sheet`; reduced = 150ms fade.
- **Notes:** used for reader settings, reward detail, Virgil ask on mobile; never nests a second sheet.

### 17. Teacher data cards
- **States:** idle = `--la-surface`, 1px `--la-surface-sunken` border, **no world palettes, no game color** — sober and legible (Master Plan §7); hover = border darkens, no lift; focus = ring; pressed = n/a; loading = table-row skeletons; success = `--la-success` delta arrows only; error = `--la-error` text + icon for failed loads + retry; disabled = n/a.
- **Tokens:** `surface`, `surface-sunken`, `ink`, `ink-muted`, `teacher`, `teacher-soft`, `success`, `error`.
- **Motion:** none beyond 120ms color transitions; numbers use JetBrains Mono tabular for stable columns.
- **Notes:** dense-first design; gradebook values must remain readable in high-contrast mode (all `-soft` tints swap to borders in HC).

---

## Coverage notes

- Every component above has a specified reduced-motion behavior via its linked preset (see `motion-vocabulary.md` §2/§6) or the CSS `--la-dur-*` collapse.
- Sound/haptic cues attach only at the motion-preset level (components never call audio directly); cues are muted-by-default per the sound policy.
- The development-only design laboratory (Master Plan §7, `/design-system`) should render this matrix live: each component × 8 states × {light, dark, reader-day, reader-sepia, reader-night, high-contrast}.
