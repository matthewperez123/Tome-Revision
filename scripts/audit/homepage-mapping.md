# Homepage feature-to-section mapping

Source of truth: `src/components/landing/HomepageContent.tsx`. Feature status verified against `src/app/(app)/**` routes and `src/**` source — `PROGRESS.md` not present in repo.

## Known drift flagged before consolidation
- Reader hero painting: **Creation of Adam** (kept by product decision; spec brief said "Barque of Dante").
- `CarouselSection` says *16 literary traditions*, `FeatureGrid` says *36* — copy drift.
- Audience toggle lives in `HeroCTA.tsx` and `FinalCTA.tsx` (sessionStorage key `tome-audience`).

## Decisions applied before tables
- Keep Creation of Adam hero.
- Remove `FeatureGrid` (9-card TOC).
- Keep `GamificationSection`, remove `SealsShowcase` (Phase 3 recommendation confirmed).
- Keep `TeacherPricingSection` (override of spec "Book a demo only").
- Normalize animation timing: reader ≤ ~6s per loop, teacher ~30–40% faster.

---

## Table A — Reader path (render order)

| # | Section | Feature | Status | Notes |
|---|---|---|---|---|
| 1 | CarouselSection | Painting-cover marquee → library | shipped | Fix "16" → "36" traditions |
| 2 | FeatureGrid | 9-card overview | mixed / remove | Contains not_built items ("Reading Paths"); duplicates later sections |
| 3 | ReaderSection | Scroll Reader + themes | shipped | Missing structural-unit types; overlaps Virgil section |
| 4 | QuizSection | Trials (tiered) | shipped | Duplicate of #10 |
| 5 | GamificationSection | Wisdom / Flames / Seals overview | shipped | Vocab drift: "replaces XP / streaks / badges" |
| 6 | WorldMapSection | Explore + traditions | shipped | Keep |
| 7 | ClassroomSection | Teacher classroom preview | shipped (wrong path) | Remove from reader path |
| 8 | VirgilSection | Virgil (stub) | — | Empty; heading only |
| 9 | AnnotationShowcase | Virgil footnote marginalia | shipped (partial) | Rewrite as unified Virgil drawer (marginalia + chat footer) |
| 10 | TrialsShowcase | 3-tier Trials + Wisdom | shipped | Keep |
| 11 | SealsShowcase | Seals + Flame | shipped | Remove — overlaps #5 |
| 12 | LibraryShowcase | Personal library progress | shipped | Add chronological toggle to animation |
| 13 | TimelinesShowcase | Timelines | shipped | Keep |
| 14 | AuthorShowcase | Author pages | shipped | Keep |
| 15 | QuotesShowcase | Notable Quotes library | not_built | Remove |
| 16 | BookClubsShowcase | Book Clubs | shipped | Keep |
| 17 | SearchShowcase | Cross-category search | shipped (partial) | Keep |
| 18 | ReadingInsightsShowcase | Reading insights | shipped | Keep |
| 19 | ReaderPricingSection | 3-tier pricing | shipped | Keep |
| 20 | FinalCTA | "Begin your journey" + audience retoggle | n/a | Keep |

## Table B — Teacher path (render order)

| # | Section | Feature | Status | Notes |
|---|---|---|---|---|
| 1 | ClassRosterShowcase | Class roster | shipped | Keep |
| 2 | AssignmentBuilderShowcase | Assignment builder | shipped | Surface all 5 assignment types |
| 3 | CustomTrialsShowcase | Custom Trials + AI | shipped | Keep |
| 4 | GradebookShowcase | Gradebook + Virgil usage | shipped | Keep; differentiate from #5 |
| 5 | StudentDashboardShowcase | Per-student progress | shipped | Keep; differentiate from #4 |
| 6 | DiscussionThreadsShowcase | Passage-anchored discussion | shipped | Keep |
| 7 | StandardsAlignmentShowcase | Common Core / AP / IB | shipped | Keep |
| 8 | RosterImportShowcase | Google + CSV import | shipped | Keep |
| 9 | SemesterPlanShowcase | Semester plan | shipped | Keep |
| 10 | StudentProfileShowcase | Teacher view of student | shipped | Keep |
| 11 | EssayGradingShowcase | Essay grading AI | shipped | Confirm animation matches `/classroom/grading/essay/[id]` |
| 12 | ParentsShowcase | Parent messaging / reports | shipped | Keep |
| 13 | StudyGroupsShowcase | Classroom-scoped study groups | shipped | Keep |
| 14 | TeacherPricingSection | 3-tier pricing | shipped | **Kept** (user override of spec) |
| 15 | TeacherCTA | Book a demo + audience retoggle | n/a | Keep |

## Table C — Feature coverage + verdicts

| Feature | Status | Reader | Teacher | Verdict |
|---|---|---|---|---|
| Library with chronological toggle | shipped | LibraryShowcase | — | fix (toggle in animation) |
| Explore / world map | shipped | WorldMapSection | — | keep |
| Timelines | shipped | TimelinesShowcase | — | add to teacher path |
| Scroll Reader structural-unit types | shipped | ReaderSection | — | fix |
| Verse formatting (block + rhyme) | shipped | — | — | add |
| Plays formatting (speakers/stage dirs) | shipped | — | — | add |
| Middle English + verse-form + glosses | shipped | — | — | add (one combined section) |
| Virgil unified drawer | shipped | VirgilSection + AnnotationShowcase | — | consolidate: delete stub, rewrite AnnotationShowcase |
| Three-tier Trials | shipped | QuizSection + TrialsShowcase | — | consolidate: remove QuizSection |
| Wisdom / Flames / Seals overview | shipped | GamificationSection + SealsShowcase | — | consolidate: keep Gamification, remove Seals |
| Search across categories | shipped | SearchShowcase | — | keep |
| Personal annotations + highlights | shipped | — | — | add |
| Notable Quotes library | not_built | QuotesShowcase | — | remove |
| Book Clubs | shipped | BookClubsShowcase | — | keep |
| Author detail pages | shipped | AuthorShowcase | — | add teacher-framed version |
| Friends + public profiles | shipped | — | — | add |
| 9-card overview grid | TOC only | FeatureGrid | — | remove |
| Classroom on reader path | shipped | ClassroomSection | — | remove from reader path |
| Class Roster | shipped | — | ClassRosterShowcase | keep |
| Assignment Builder (5 types) | shipped | — | AssignmentBuilderShowcase | fix |
| Custom Trials + AI generation | shipped | — | CustomTrialsShowcase | keep |
| Gradebook + Virgil usage | shipped | — | GradebookShowcase | keep |
| Per-student progress | shipped | — | StudentDashboardShowcase | keep (distinct from #4) |
| Student profile (teacher view) | shipped | — | StudentProfileShowcase | keep |
| Passage-anchored discussion | shipped | — | DiscussionThreadsShowcase | keep |
| Standards alignment | shipped | — | StandardsAlignmentShowcase | keep |
| Roster import | shipped | — | RosterImportShowcase | keep |
| Semester plan | shipped | — | SemesterPlanShowcase | keep |
| Essay grading AI | shipped | — | EssayGradingShowcase | fix |
| Parents | shipped | — | ParentsShowcase | keep |
| Study Groups | shipped | — | StudyGroupsShowcase | keep |
| Guided Learning / live sessions | shipped (`/teacher/guided-learning/**`, `/learn/session/[sessionId]`) | — | — | add to teacher path |
| Reader pricing | shipped | ReaderPricingSection | — | keep |
| Teacher pricing | shipped | — | TeacherPricingSection | keep (user override) |
| Driver.js onboarding walkthrough | not_built | — | — | skip (no dep) |
| Notifications / daily reminders | shipped | — | — | skip (no dedicated section) |
| Theme toggle | shipped (nav) | — | — | skip (covered in nav) |
| 5-tab mobile bottom nav | shipped | — | — | skip (covered implicitly by mobile stacks) |
