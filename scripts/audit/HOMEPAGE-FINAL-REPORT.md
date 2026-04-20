# Homepage cleanup — final report

Branch: `tome-recovery` · Date: 2026-04-20

## Net change

| Metric | Before | After |
|---|---:|---:|
| Reader-path sections (incl. carousel + CTAs) | 20 | 19 |
| Reader-path h2 headings | 13 | 18 |
| Teacher-path sections | 15 | 18 |
| Teacher-path h2 headings | 13 | 16 |
| Vocab drift hits ("XP", "streak" labels, "quizzes" in headlines/subcopy) | 12 | 0 |
| Animation loops > 6s on reader path | 5 | 0 |
| Animation loops > 4s on teacher path | 11 | 0 |

## Sections removed (6)

| File | Reason |
|---|---|
| `FeatureGrid.tsx` | 9-card TOC; "Reading Paths" card referenced a feature not built; other cards duplicated downstream showcases |
| `QuizSection.tsx` | Same feature as `TrialsShowcase`, same Apprentice/Scholar/Master pitch |
| `VirgilSection.tsx` | Empty stub — heading only, no demo |
| `ClassroomSection.tsx` | Teacher-classroom pitch rendered on the reader path |
| `SealsShowcase.tsx` | Covered by `GamificationSection` reward-loop overview (per Phase 3 rec) |
| `QuotesShowcase.tsx` | "Notable Quotes" library feature not built (0 matches in `src/**`) |
| `mockups/AnimatedQuiz.tsx` | Orphan after `QuizSection` removal |
| `mockups/AnimatedClassroom.tsx` | Orphan after `ClassroomSection` removal |

## Sections consolidated (1)

| Result | Source sections |
|---|---|
| `AnnotationShowcase` rewritten as unified Virgil drawer (bottom sheet + annotation + chat footer) | Old `VirgilSection` stub + old inline-card `AnnotationShowcase` |

## Sections added (8)

### Reader path (5)
| Section | Feature | Framing |
|---|---|---|
| `VerseFormattingShowcase` | Block-style verse + rhyme-scheme toggle | Sonnet 18 with Plain/Rhyme pill toggle and colored rhyme arcs |
| `PlaysFormattingShowcase` | Speaker color-coding + stage directions | Hamlet I.iv with HAMLET/HORATIO differentiated, italic stage cues |
| `MiddleEnglishGlossesShowcase` | Middle English handling + word-level glosses | Canterbury prologue with tap-to-reveal gloss popovers |
| `PersonalAnnotationsShowcase` | User-created highlights + margin notes | Amber palette (distinct from Virgil indigo) on Walden |
| `FriendsProfilesShowcase` | Friends + public profiles + book sharing | Profile card with Follow button + shelf + share toast |

### Teacher path (3)
| Section | Feature | Framing |
|---|---|---|
| `GuidedLearningShowcase` | Live-session instructor pacing | Instructor banner + locked reader nav + live paragraph marker + clock resync footer |
| `TimelinesShowcase` (teacher-framed) | Timelines as pre-reading resource | "Context for every assignment" |
| `AuthorShowcase` (teacher-framed) | Author pages as vetted background | "A dossier per voice" |

Both shared components (`TimelinesShowcase`, `AuthorShowcase`) now take an optional `audience` prop that controls heading/subcopy and side of the mockup.

## Sections edited in place (copy / animation / vocab fixes)

| Section | Change |
|---|---|
| `HeroSection` | Reader + teacher subcopy swap "quizzes" → "Trials"; "AI scholar" → "Virgil, your scholar in the margin" |
| `CarouselSection` | "16 literary traditions" → "36" |
| `GamificationSection` | Drop "Wisdom replaces XP / streaks / badges" phrasing; restate as Tome-native reward loop |
| `ReaderSection` | `AnimatedReader` rewritten to cycle Book / Canto / Scene across Odyssey, Inferno, Hamlet with a unit-label chip row — surfaces structural-unit types per the reader spec |
| `LibraryShowcase` | Mockup now loops Recent ↔ Chronological with layout-animated reflow and year labels in chrono mode |
| `AssignmentBuilderShowcase` | Adds 5-type row (Reading / Trial / Discussion / Essay / Annotation) at the top of the builder card; subcopy names all 5 types |
| `ReadingInsightsShowcase`, `AnimatedGamification`, `StudentProfileShowcase`, `StudentDashboardShowcase` | "streak" labels → "Flame" |
| `StudyGroupsShowcase` | "practice quizzes" → "practice Trials" |
| `ReaderPricingSection` | "Daily Flame streaks" → "Daily Flame and Seal tracking"; "Virgil AI tutor" → "Virgil" |

## Animation-loop timing sweep

Reader target: ≤ ~6s per loop. Teacher target: ~30–40% faster (~3.4s).
All sections scaled proportionally; `useAnimationLoop` hook and phase-name semantics unchanged.

### Reader (scaled down)
| Section | Before | After |
|---|---:|---:|
| WorldMapSection | 16.6s | 5.0s |
| AnimatedGamification | 14.5s | 5.0s |
| TrialsShowcase | 12.5s | 5.0s |
| TimelinesShowcase | 10.6s | 5.0s |
| BookClubs / Search / Author / ReadingInsights | 6.3–6.8s | ~5.0s |

### Teacher (scaled down)
| Section | Before | After |
|---|---:|---:|
| ClassRoster, Gradebook, StudentDashboard, DiscussionThreads, StandardsAlignment, RosterImport, StudentProfile, EssayGrading, Parents, StudyGroups, CustomTrials | 5.0–14.1s | 3.3–3.5s |

Sections already within budget (Annotation, Verse, Plays, ME, PersonalAnnotations, Friends, GuidedLearning, AssignmentBuilder, SemesterPlan, AnimatedReader): untouched.

## Alternation audit

Reader path, alternating mockup side (L/R) with centered/full-width breaks:

```
Carousel(full) → Reader(L) → Verse(R) → Plays(L) → ME(R) → Virgil(L)
→ Marginalia(R) → [Gamification center] → Trials(R) → [WorldMap center]
→ Library(R) → Timelines(L) → Author(R) → BookClubs(L) → Friends(R)
→ Search(L) → Insights(R) → Pricing(full) → FinalCTA(full)
```

Teacher path:

```
Roster(L) → Assignments(R) → CustomTrials(L) → Guided(R) → Gradebook(R)
→ StudentDash(L) → Discussion(R) → Standards(L) → RosterImport(R)
→ Semester(L) → StudentProfile(R) → EssayGrading(L) → Parents(R)
→ StudyGroups(L) → Timelines(R) → Author(L) → Pricing(full) → CTA(full)
```

One remaining same-side pair on teacher path (`CustomTrials(L) → Guided(R) → Gradebook(R)` via the R→R between Guided and Gradebook). Flipping Gradebook would chain-break with DiscussionThreads; accepting as one residual gap on the teacher path.

## Reward-loop coherence

Gold/amber flourishes appear only in student-experience animations:
- Reader `TrialsShowcase` (+Wisdom float)
- Reader `SealsShowcase` (removed — moved to Gamification)
- Reader `GamificationSection` (overview)
- Reader `PersonalAnnotationsShowcase` (amber = user marks, indigo = Virgil)
- Teacher `StudentProfileShowcase` / `StudentDashboardShowcase` (showing the student experience from the teacher's vantage)

Teacher-side sections otherwise use indigo + warm stone; no gold flourishes.

## Outstanding / deferred

- **Prebuild Stoa audit**: `pnpm audit:stoa --strict` fails on a pre-existing `MISSING METADATA` warning for `orlando-madness-dore` (no `sourceUrl`). Not introduced by this pass; homepage routes compile cleanly under `next build` directly.
- **Commit hygiene note**: the alternation-fix commit I attempted collided with two unrelated commits (`9a9730e3`, `08172485`) landing in parallel. The landing-component alternation edits ended up folded into `08172485`'s tree — functional outcome is correct, but the commit message attributes them to "fix(book-card)". Flagging for the record; no re-work needed.
- **Timings**: Reader target was "4–6s per loop"; sections currently sit at 4.4–5.1s. Teacher sits at 3.3–3.5s (30–35% faster than reader). Both within spec.

## Commit range (this pass)

```
92bb24f5  refactor(homepage): remove 6 superseded reader sections
5d08c206  fix(homepage): tome vocab + carousel count drift
e209bef4  refactor(homepage): rewrite AnnotationShowcase as unified Virgil drawer
f5142271  fix(homepage): surface structural-unit types in ReaderSection
d6c9fa52  feat(homepage): add chronological toggle to LibraryShowcase
01e61161  fix(homepage): surface all 5 assignment types in AssignmentBuilderShowcase
0b9fceef  feat(homepage): add 5 reader sections for shipped-but-missing features
e6d82118  feat(homepage): add Guided Learning + teacher-framed Timelines/Authors
abf52a05  perf(homepage): normalize animation-loop timings to spec
(alternation edits rolled into 08172485 by collision — see note above)
```

No squashing. All commits on `tome-recovery`.
