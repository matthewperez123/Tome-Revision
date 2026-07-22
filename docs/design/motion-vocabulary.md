# The Living Archive — Motion Vocabulary

**Author:** Living_Archive_Design_Engineer (Tome rebuild team)
**Date:** 2026-07-22 · **Branch:** `kimi/tome-virgil-maximalist-demo-20260722`
**Implementation:** `src/lib/design/motion.ts` (`tactileMoments`, `tactileMomentsReduced`, `laSprings`, `laEasings`, `laDurations`, `useReducedMotionSafe`, `pickTactile`)
**Inputs:** Master Plan §9 · `docs/research/mobbin-pattern-synthesis.md`

---

## 1. Principles

Motion in Tome exists to communicate **cause and effect, hierarchy, continuity, progress, emotional response, and spatial relationship** — never to decorate idly (bar.digital's "useful beauty" applied to time).

1. **Direct manipulation first.** Things the user touches respond like physical matter: press squashes, release springs back, drags lift. (Duolingo node tactility, minus the cartoon excess.)
2. **Ceremony is short and skippable.** Reward crescendos peak at ~1.2s and never block the next action. No full-screen confetti for every action; one restrained burst maximum, reserved for level-up.
3. **The reader is sacred.** No ambient motion on the reading canvas; no transition may delay text rendering. Reader open = instant swap under reduced motion.
4. **Kind feedback.** Near-miss leans in warmly; nothing shakes in anger. Error motion never mimics punishment (synthesis §6/§9 — no guilt mechanics).
5. **Springs for touch, curves for scene.** Direct manipulation uses spring physics (`laSprings`); scene transitions and reveals use named cubic curves (`laEasings`).
6. **Animate only transforms and opacity.** Layout-affecting properties are off-limits inside choreographed moments (borderRadius is permitted only on the cover→world shared element, GPU-composited via scale, not layout).

Named curves: `scholarly` `[0.25,0.46,0.45,0.94]` (default), `outExpo` `[0.16,1,0.3,1]` (reveals/count-ups), `sheet` `[0.32,0.72,0,1]` (sheets/frames), `anticipate` (dip-before-pop), `settle` `[0.34,1.56,0.64,1]` (single gentle overshoot).

Named springs: `press` (500/30/0.8) · `interactive` (300/25) · `gentle` (120/20) · `medallion` (180/14/1.1, one overshoot) · `sheet` (260/28) · `dragSnap` (400/22).

## 2. The 20 tactile moments

Names match the exported keys of `tactileMoments`. States follow the convention `hidden/visible` (enter-exit), `rest/hover/pressed` (direct manipulation), plus moment-specific states.

### #1 `pressPrimary` — pressing a primary action
- **Choreography:** hover `scale 1.02` 160ms → press `scale 0.96, y 2` spring `press` (~120ms) → release spring-back (~240ms). Edge shadow compresses from 4px to 2px (CSS, synced).
- **Elements:** button body, edge shadow. **Total:** ~360ms.
- **Reduced motion:** background shifts to `--la-primary-edge`; no transform.
- **Sound:** soft-press. **Haptic:** tap-light.

### #2 `openBookPortal` — opening a book portal
- **Choreography:** portal frame `opacity 0→1, scale 0.94→1, rotateX 6°→0` over 900ms `outExpo`; interior glow ramps during the last 300ms; exit reverses at 280ms with slight overshoot scale 1.06.
- **Elements:** portal frame, cover, interior glow. **Total:** 900ms.
- **Reduced motion:** 200ms crossfade, no perspective.
- **Sound:** page-turn. **Haptic:** none.

### #3 `coverToWorld` — book cover into Stoa/book world
- **Choreography:** shared-element morph — cover `scale 0.85→1`, `borderRadius 22→0`, 720ms `outExpo`; world backdrop crossfades; three parallax layers settle at 0.02/0.05/0.08 depth multipliers (pointer-driven, ±8px max).
- **Elements:** shared cover, world backdrop, 3 parallax layers. **Total:** 720ms.
- **Reduced motion:** route crossfade only; parallax static.
- **Sound:** none. **Haptic:** none.

### #4 `openReader` — opening the reader
- **Choreography:** page canvas `y 24→0, fade` 480ms `scholarly`; Explore chrome counter-fades out in the first 240ms.
- **Elements:** page canvas, reader chrome. **Total:** 480ms.
- **Reduced motion:** **instant swap** — text never waits.
- **Sound:** page-turn (only if sound already enabled). **Haptic:** none.

### #5 `highlightPhrase` — highlighting a phrase
- **Choreography:** highlight wash `scaleX 0→1` (origin left), opacity 0.4→1, 280ms `scholarly`; text itself never moves.
- **Elements:** highlight wash. **Total:** 280ms.
- **Reduced motion:** highlight appears at final color instantly.
- **Sound/Haptic:** none.

### #6 `summonVirgil` — summoning Virgil
- **Choreography:** lantern glow fades in first (80ms lead) → Virgil figure `y 16→0, scale 0.9→1` spring `gentle` → speech bubble staggers +90ms.
- **Elements:** lantern glow, Virgil figure, speech bubble. **Total:** ~520ms.
- **Reduced motion:** everything fades in together, 150ms.
- **Sound:** virgil-lantern. **Haptic:** none.

### #7 `dragTrialAnswer` — dragging a Trial answer
- **Choreography:** pickup `scale 1.05`, shadow `raised→portal`, 160ms → drop spring `dragSnap` → rejected drop sways `x [0,-8,8,-4,4,0]` 400ms `easeInOut` (a polite "not here", not an error shake). Drop slot pulses `secondary-soft` while hovered.
- **Elements:** match card, drop-slot pulse, edge shadow. **Total:** 400ms.
- **Reduced motion:** no lift/sway; border + icon state change only; rejection = opacity dip.
- **Sound:** soft-press. **Haptic:** tap-light.

### #8 `submitAnswer` — submitting an answer
- **Choreography:** button `scale 0.94` spring `press` → loading state (opacity 0.85, ring stroke draws 300ms) → resolve spring `interactive`.
- **Elements:** submit button, progress ring. **Total:** ~500ms.
- **Reduced motion:** spinner replaced by static "checking…" label.
- **Sound:** soft-press. **Haptic:** tap-medium.

### #9 `nearMissResponse` — near-miss response
- **Choreography:** answer card single gentle sway `x [0,6,0]` 480ms `settle`; `--la-near-miss` chip fades in; Virgil hint line staggers +120ms. Warm amber, icon + color + placement (synthesis §9).
- **Elements:** answer card, near-miss chip, Virgil hint line. **Total:** 480ms.
- **Reduced motion:** chip fades in; card still.
- **Sound:** near-miss-tone. **Haptic:** none (vibration must never signal failure).

### #10 `correctAnswerResponse` — correct answer
- **Choreography:** card pop `scale [1→1.03→1]` 480ms `outExpo`; jade wash pulse; check glyph stroke draws 240ms.
- **Elements:** answer card, jade wash, check glyph. **Total:** 480ms.
- **Reduced motion:** wash + check appear, no scale.
- **Sound:** correct-tone. **Haptic:** success-double.

### #11 `trialCompletion` — Trial completion
- **Choreography:** results stagger like books shelving — hero, then score rows at 90ms stagger (150ms delay), Wisdom chip, CTA last; each row rises 12px `outExpo`.
- **Elements:** results hero, score rows, Wisdom chip, CTA. **Total:** ~1.2s.
- **Reduced motion:** all rows fade together, 200ms.
- **Sound/Haptic:** none (the Wisdom count-up that follows carries the cue).

### #12 `wisdomCountUp` — Wisdom count-up
- **Choreography:** counter rolls 0→N over 720ms `outExpo` (eased, not linear); on land, gold sparkle pop `scale [1→1.12→1]` 300ms. Uses `tabular-nums` to prevent layout shift.
- **Elements:** wisdom counter, gold sparkle. **Total:** ~1s.
- **Reduced motion:** final value immediately.
- **Sound:** wisdom-sparkle. **Haptic:** tap-light.

### #13 `flameSecured` — Flame secured
- **Choreography:** ember dot brightens → flame shape draws and pops `scale [0.9→1.08→1]` 720ms `settle` → hearth glow ring fades to steady 60%.
- **Elements:** ember, flame shape, hearth glow ring. **Total:** 720ms.
- **Reduced motion:** lit artwork swaps in instantly.
- **Sound:** flame-ignition. **Haptic:** success-double.

### #14 `sealReveal` — Seal reveal
- **Choreography:** medallion coin-turn `rotateY 90°→0, scale 0.8→1` spring `medallion` (single overshoot); gold rim highlight sweeps once; name plate fades +250ms.
- **Elements:** medallion, rim highlight, name plate. **Total:** ~900ms.
- **Reduced motion:** front-on fade, 200ms; no rotation.
- **Sound:** seal-resonance. **Haptic:** success-double.

### #15 `stoaRestoration` — Stoa restoration
- **Choreography:** tile `y 28→0, scale 0.92→1` 1.2s `outExpo`; dust motes drift (opacity only); gallery lighting shifts warmer; plaque fades +300ms. Effort visibly changes the world (synthesis §7).
- **Elements:** restored tile, dust motes, gallery light, plaque. **Total:** 1.2s.
- **Reduced motion:** tile + plaque fade into place, 250ms.
- **Sound:** stoa-restoration. **Haptic:** none.

### #16 `pathNodeUnlock` — path-node unlock
- **Choreography:** dormant node `opacity 0.55, scale 0.94` → wake pop `scale [0.94→1.1→1]` 600ms `settle`; progress ring stroke draws; trail segment to next node draws 250ms.
- **Elements:** node disc, progress ring, trail segment. **Total:** 600ms.
- **Reduced motion:** state swap; ring appears pre-drawn.
- **Sound:** hint-chime. **Haptic:** tap-light.

### #17 `chapterCompletion` — chapter completion
- **Choreography:** bookmark ribbon drops in `y -14→0` spring `gentle`; chapter mark fades; next-chapter card peeks `x [0,10,0]` after 300ms — an invitation, not a shove.
- **Elements:** bookmark ribbon, chapter mark, next-chapter card. **Total:** ~800ms.
- **Reduced motion:** fade only; no peek.
- **Sound:** page-turn. **Haptic:** none.

### #18 `levelUp` — level up
- **Choreography:** crest rises `scale 0.7→1, y 20→0` spring `medallion`; **one** expanding ring `scale 1→1.6, fade` 600ms `outExpo` (the system's single permitted burst — never confetti spam); label fades +200ms.
- **Elements:** level crest, expanding ring, label. **Total:** ~1.1s.
- **Reduced motion:** crest + label fade; no ring.
- **Sound:** seal-resonance. **Haptic:** success-double.

### #19 `returnAfterAbsence` — returning after absence
- **Choreography:** welcome line fades 720ms `scholarly`; hearth glow rises once `opacity [0→1→0.6]` 900ms; continue card settles. Warm, never guilty (synthesis §6 — no streak-shame, no mascot distress).
- **Elements:** welcome line, hearth glow, continue card. **Total:** ~900ms.
- **Reduced motion:** static welcome at final glow level.
- **Sound:** virgil-lantern. **Haptic:** none.

### #20 `deviceLabSwitch` — switching desktop/tablet/mobile in Device Lab
- **Choreography:** device frame tweens width/height 480ms `sheet`; viewport content crossfades beneath; dimension label counts between sizes.
- **Elements:** device frame, viewport content. **Total:** 480ms.
- **Reduced motion:** instant resize + content crossfade.
- **Sound/Haptic:** none.

## 3. Sound mapping

Original sound pack (procedural Web Audio fallback permitted). Muted by default on first public load; starts only after explicit user interaction; full mute + persistent preference required. No copyrighted samples, no harsh failure buzz.

| Cue id | Used by | Character |
|---|---|---|
| soft-press | #1, #7, #8 | short felted tap, <80ms |
| page-turn | #2, #4, #17 | paper whisper, ~250ms |
| hint-chime | #16 (also Virgil hint ladder) | single warm bell partial |
| correct-tone | #10 | rising major third, soft attack |
| near-miss-tone | #9 | gentle suspended tone — no buzz |
| wisdom-sparkle | #12 | light metallic shimmer |
| flame-ignition | #13 | soft whoosh + warm bed |
| seal-resonance | #14, #18 | low chime with long tail |
| stoa-restoration | #15 | stone-settle + air swell |
| virgil-lantern | #6, #19 | faint glow hum |
| notification | (system) | subdued knock; captions required where sound conveys meaning |

## 4. Haptic mapping

Optional, mobile-only, always after user interaction, never required, disabled by reduced-motion/user preference. Patterns: `tap-light` (10ms), `tap-medium` (20ms), `success-double` (12ms + 60ms gap + 12ms). Haptics never fire on incorrect answers, near-misses, or any failure state.

## 5. Performance budgets

Target 60fps on modern Apple-silicon Macs and current mobile Safari/Chrome.

- **Per-moment budget:** ≤ 2 simultaneously animating layers for ambient moments; ≤ 6 for ceremonies (#11–#15, #18). Transforms + opacity only.
- **Route budgets:** Explore routes ≤ 150KB of motion-related JS (framer-motion is shared); reader route ships **zero** animation beyond CSS transitions and loads no moment presets.
- **Assets:** WebP/AVIF for world art; no transparent-PNG frame sequences; lazy-load world/diorama assets below the fold; reader text interactive before decorative assets resolve.
- **Runtime discipline:** pause offscreen animations (IntersectionObserver) and when `document.hidden`; Virgil ambient loops sleep in inactive tabs (his `sleep/rest` state).
- **Measurement:** moment timings and dropped-frame counts recorded in the Virgil Lab performance counters and the QA report; any moment exceeding its documented `durationMs` by >20% on target hardware is a bug.

## 6. Reduced-motion contract

`useReducedMotionSafe()` (SSR-safe wrapper over framer-motion's `useReducedMotion`) gates every moment; `pickTactile(name, reduced)` returns the correct variant set. CSS-side, `--la-dur-*` tokens collapse under `prefers-reduced-motion` (all ≤120ms, opacity-only). The reduced set is not a degraded afterthought: every moment has a specified alternative in §2, and no information, state change, or feedback is ever conveyed by motion alone.
