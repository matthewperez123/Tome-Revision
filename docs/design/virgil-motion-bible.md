# Virgil — Motion Bible

How Virgil moves: principles, the state machine, and the choreography of
every state. Implementation: `src/lib/virgil/state-machine.ts` (semantics),
`src/components/virgil/poses.ts` (pose targets),
`src/components/virgil/Virgil.tsx` (Framer Motion runtime). Everything
below is rendered and triggerable in `/virgil/lab`.

---

## 1. Motion principles (from the master plan, applied)

- **Cause and effect** — Virgil moves because a product event arrived
  (`VirgilEvent`), never because a timer fired. The only scheduled callback
  in the runtime is `ANIMATION_COMPLETE`, dispatched when a transient
  state's own animation has finished.
- **Restraint** — no constant background movement. Loops are slow
  (1.8–4s), low-amplitude (±2–4px, ±1.5–8°), and park entirely in `sleep`.
- **Squash and stretch, restrained** — celebration beats use
  `scaleY [1, 0.96, 1.04, 1]` over 0.7s, pivoting at the hem. Nothing
  bounces arbitrarily.
- **Anticipation → spring release → settle** — reactions enter with a small
  anticipation (crouch or lean) and settle on a spring
  (`stiffness 260, damping 24`).
- **Staggered reward reveals** — levelUp/sealReveal/mastery choreograph in
  beats (glow bloom → rise → laurel flash), never confetti.
- **The lantern is the narrator** — glow and arm angle carry emotional
  state before the face does.

## 2. Implementation contract

- **Transforms + opacity only.** No layout properties animate; the SVG is
  one composited subtree (`transform-box: fill-box` per articulated group).
- **Articulation groups:** figure (bob/lean/squash) · head (tilt) · pupil
  drift (glance) · **eyelid layer** (blink: `scaleY [0,0,1,0,0]`,
  times `[0, .9, .94, .97, 1]`, 4.6s loop — keyframes, not timers) ·
  lantern arm (shoulder rotate) · lantern swing (pendulum) · glow
  (opacity) · satchel (sway).
- **Pause rules:** `visibilitychange` dispatches `APP_HIDDEN` → `sleep`
  (all loops park, glow 0.25); `APP_VISIBLE` → `welcomeBack`. Offscreen
  instances hold static poses by caller policy.
- **Speed control:** a `speed` prop (0.25–4×) divides loop durations;
  event semantics are unchanged.
- **No layout thrash:** state changes swap `animate` targets on existing
  nodes; the SVG never reflows its container (fixed aspect box).

## 3. Reduced-motion contract

`prefers-reduced-motion` (or the `reducedMotion` prop) collapses every
state to a **still pose with a 150 ms opacity crossfade**:

- loops park at their rest pose (idle breathes never runs);
- transients park at their **meaning pose** (hint3 still points at the
  evidence; mastery still raises the lantern) for the state's duration, so
  semantics survive with zero movement;
- the blink never runs; closed-eye expressions render as arcs regardless.

The mapping is **total by construction** — `VIRGIL_REDUCED_MOTION_STILLS`
covers all 52 states, and the Lab's state gallery renders each still for
audit.

## 4. State machine model

`reduceVirgil(state, event) → { state, announcement, unchanged }` — pure,
typed, no timers. Three kinds:

| kind | behavior |
| --- | --- |
| `loop` | ambient animation until the next event |
| `transient` | plays its beat, then `ANIMATION_COMPLETE` → `returnTo` (default `idle`) |
| `steady` | holds indefinitely (sleep, offline, teacherMode…) |

Universal interrupts (honored from every state): `APP_HIDDEN`, `RESET`,
`OFFLINE`, `LOADING`, `ERROR`. From `sleep`, only `APP_VISIBLE` /
`WELCOME_BACK` / `APP_ENTER` wake. Unlisted events are no-ops, so product
code can dispatch freely.

## 5. State choreography

Durations are transient beats; loops run until interrupted. "Still" = the
reduced-motion pose.

### Ambient (9)

| State | Trigger event | Motion | Beat | Still |
| --- | --- | --- | --- | --- |
| `enter` | `APP_ENTER` | rises from +8px with soft overshoot; glow fades up | 900ms → `greet` | standing, glow 0.3 |
| `greet` | `GREET` | lantern arm lifts −24° and lowers; head bow; glow blooms once | 1400ms | arm raised, grin |
| `idle` | `IDLE`, transient returns | 3.4s breath ±3px; lantern sway ±3.5°; blink 4.6s; glow pulse ±0.12 | loop | rest pose |
| `glance` | `GLANCE` | pupils +5px, head follows 4° | 1100ms | eyes right |
| `readAlong` | `READ_ALONG_STARTED` | book open; slow 1.5px page-gaze drift; breath | loop | book open, gaze down |
| `lookAtText` | `TEXT_HIGHLIGHTED` | head 8° toward highlight; pupils lock; lantern dips to light it | 1600ms | tilted, glow 0.85 |
| `pagePeek` | `PAGE_PEEK` | lean 6°, brow up, book rises | 1300ms | leaning, book open |
| `compactIdle` | (mobile embedding) | bust crop; breath + blink only; glow 0.5 | loop | bust rest |
| `sleep` | `APP_HIDDEN` | all loops parked; eyes closed arcs; glow 0.25 | steady | asleep |

### Conversational (12)

| State | Trigger event | Motion | Beat | Still |
| --- | --- | --- | --- | --- |
| `listen` | `ASK_STARTED` | head 7° toward reader; slow breath; lantern low | steady | tilted, attentive |
| `think` | `ASK_STREAMING:thinking` | eyes up-left drift; swing narrows ±1.5° | loop | brow knit, gaze up |
| `searchText` | `SEARCH_TEXT` | lantern sweeps ±8° like a reading light; eyes track | loop | mid-sweep |
| `retrievePassage` | `ASK_STREAMING:retrieving` | satchel dips, book rises, 2px nod on landing | 1500ms | book open |
| `explain` | `EXPLAIN`, `ASK_STREAMING:answering` | arm gestures in open arcs (−10°…−2°); nod beats | loop | mid-gesture |
| `compare` | `COMPARE_IDEAS` | arms rise alternately like scales; head tips | loop | weighing pose |
| `pointToEvidence` | `POINT_TO_EVIDENCE` | arm extends −32° and holds; glow 0.95 | 1700ms | pointing |
| `whisper` | `WHISPER_ASIDE` | lean 8° closer; glow drops 0.4 | 1500ms | leaned-in |
| `socraticQuestion` | `SOCRATIC_QUESTION` | brow lift, tilt, lantern to chin; question hangs | 1600ms → `waitForUser` | questioning |
| `waitForUser` | `WAIT_FOR_USER` | breathing only; no gesturing, no pressure | steady | settled |
| `acknowledge` | `ACKNOWLEDGE`, `SOUND_TOGGLED:on` | single warm nod; glow blip +0.15 | 900ms | mid-nod |
| `citeParagraph` | `CITE_PARAGRAPH` | taps book twice, then points | 1500ms | book + point |

### Hint ladder (4)

| State | Trigger event | Motion | Beat | Still |
| --- | --- | --- | --- | --- |
| `hint1` | `HINT_USED:1` | small shoulder-tip; soft glow rise — a nudge, not a shove | 1400ms → `waitForUser` | gentle lean |
| `hint2` | `HINT_USED:2` | hands draw together, bracketing fewer choices | 1500ms → `waitForUser` | book half-open |
| `hint3` | `HINT_USED:3` | lantern extends to the exact line; glow peaks 0.95 | 1800ms → `waitForUser` | pointing at evidence |
| `explainFinal` | `FINAL_EXPLANATION` | book opens fully; three slow nod beats | 2200ms | full explanation |

### Assessment reactions (8)

| State | Trigger event | Motion | Beat | Still |
| --- | --- | --- | --- | --- |
| `correct` | `ANSWER_CORRECT` (streak < 3) | anticipation squash 0.96 → spring up 4px, glow bloom; settles 700ms | 1300ms | risen, grin |
| `elegantAnswer` | `ANSWER_ELEGANT` | slow impressed lean-back, laurel-bright glow, scholar's nod | 1800ms | leaned back, bright |
| `nearMiss` | `ANSWER_NEAR_MISS` | head tips 5°, palm-up rise; glow warms, never dims | 1600ms → `waitForUser` | "so close" pose |
| `incorrectEncouraging` | `ANSWER_INCORRECT` | no recoil, no frown: calm settle, lantern to reading height, book offered | 1700ms → `waitForUser` | book offered |
| `timeout` | `ANSWER_TIMEOUT` | lantern lowers slowly; patient 2px shrug; zero penalty energy | 1600ms → `waitForUser` | patient |
| `answerRevised` | `ANSWER_REVISED` | interested lean-in; eyes flick; approving nod | 1200ms | leaning in |
| `streak` | `ANSWER_CORRECT` (streak ≥ 3) | two-beat glow pulse, measured lantern arcs — pride, not panic | 1800ms | raised, bright |
| `mastery` | `MASTERY_ACHIEVED` | full lantern raise held 1s at glow 1; deep hood bow; settle | 2400ms | lantern high |

### Reward reactions (10)

| State | Trigger event | Motion | Beat | Still |
| --- | --- | --- | --- | --- |
| `wisdomEarned` | `WISDOM_EARNED` | gold motes rise beside the lantern; Virgil watches them up | 1500ms | gaze up |
| `dailyGoalAdvanced` | `DAILY_GOAL_ADVANCED` | one measured step (4px) and a nod | 1200ms | stepped |
| `flameAtRisk` | `FLAME_AT_RISK` | glow rests 0.35 — low, never out; no guilt posture | steady | calm, dim |
| `flameSecured` | `FLAME_SECURED` | glow ignites 0.35→0.9 in one clean rise; single nod | 1400ms | rekindled |
| `chapterComplete` | `CHAPTER_COMPLETE` | book closes with a settle; lantern raised once; long exhale | 2000ms | lantern raised |
| `levelUp` | `LEVEL_UP` | staggered beats: glow bloom → rise 6px → laurel flash | 2200ms | risen, bright |
| `sealReveal` | `SEAL_UNLOCKED` | lantern high and held; glow peaks 1 for 1.2s | 2400ms | held high |
| `stoaRestoration` | `STOA_RESTORED` | turns toward the stone; slow 12° lantern sweep | 2100ms | mid-sweep |
| `bookComplete` | `BOOK_COMPLETE` | book to chest, eyes closed one beat, lantern-raise finale | 2600ms | finale pose |
| `journeyComplete` | `JOURNEY_COMPLETE` | fullest arc: rise, glow crescendo, deep bow, 1.4s held still | 3000ms | bowed, bright |

### System (9)

| State | Trigger event | Motion | Beat | Still |
| --- | --- | --- | --- | --- |
| `loading` | `LOADING`, `ERROR:recoverable` | slow lantern pendulum ±6°; eyes follow — an honest "working" tell | loop | mid-swing |
| `offline` | `OFFLINE` | glow 0.3; book open — what is downloaded still works | steady | dim, reading |
| `rateLimited` | `RATE_LIMITED` | palm raised at half height; patient hold | steady | holding |
| `contentUnavailable` | `CONTENT_UNAVAILABLE`, `ERROR:fatal` | apologetic half-shrug; alternative offered | steady | concerned |
| `safeBoundary` | `SAFE_BOUNDARY` | lantern lowered, posture upright and kind; calm still — no scolding | steady | gentle, upright |
| `mutedAck` | `SOUND_TOGGLED:muted` | small nod + lantern dim-blip | 900ms | mid-nod |
| `teacherMode` | `MODE_CHANGED:teacher` | steps aside 6px, lowers lantern — students do the reading | steady | aside, proud |
| `parentMode` | `MODE_CHANGED:parent` | book open toward the viewer like a shared report | steady | presenting |
| `welcomeBack` | `APP_VISIBLE`, `WELCOME_BACK`, `ONLINE_RESTORED` | glow rekindles 0.3→full as Virgil rises — warmth without a tally | 1600ms | rekindled |

## 6. Accessibility of motion

- State changes that carry meaning announce via `aria-live="polite"`
  (strings in `VIRGIL_STATES[].announcement`); decorative ones stay silent.
- Every animated state has the still listed above; the mapping is enforced
  by types (`Record<VirgilStateId, …>`), not by convention.
- Blink, sway, and breath are the only perpetual loops, and all three park
  under reduced motion, in `sleep`, and when the tab hides.
