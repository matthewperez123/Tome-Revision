# Mobbin / Reference Pattern Synthesis for Tome

**Author:** Reference_Research_Lead (Tome rebuild team)
**Date:** 2026-07-22
**Branch:** `kimi/tome-virgil-maximalist-demo-20260722`

## Method and limitations

Mobbin MCP is **not installed** in this environment, and no paid Mobbin access was purchased (per the master plan's billing rule). All findings below come from public web research: product help centers (Khan Academy, Kahoot, Apple), published UX case studies and breakdowns (Duolingo, Headspace, Finch), platform comparisons (Kahoot vs. Quizizz/Wayground), ebook typography guidance, academic descriptions of Google Classroom, and a direct fetch of `https://www.bar.digital/`. Every load-bearing claim carries an inline source URL. Where a claim rests on general product knowledge rather than a retrieved source, it is phrased as a recommendation, not a fact.

Nothing here is a pixel copy. Per the master plan, we extract **patterns and principles**, not screenshots, and no proprietary reference images ship in the product.

Route implications reference the actual route tree in this repo: `src/app/(app)/{dashboard, explore, library, read, quiz, quizzes, classroom, teacher, assignments, book, virgil, shelves, join, ...}` and `src/app/(standalone)/{onboarding, login, student-login, learn, demo, ...}`.

---

## A note on the "Mind Market" reference

**Verdict: ambiguous — do not derive specifics from it without owner clarification.**

The master plan asks us to "identify the correct company/product" behind the owner-provided *Mind Market* reference before deriving visual principles. Web research did not resolve to a single, well-known product/design reference by that name. The plausible candidates found:

1. **MindMarket** (`https://mindmarket.com/`) — a UK-based international qualitative market-research firm ("Real people. Real insights. Real impact."). Not a consumer product or a design reference. Also listed in the GreenBook directory: `https://www.greenbook.org/company/MindMarket`.
2. **The MindMarket** (`https://www.themindmarket.com/what-we-do`) — a separate qualitative multi-market research services company. Also not a design reference.
3. No app, learning product, design studio, award entry (Awwwards/Dribbble/Behance), or well-known UI reference named "Mind Market" surfaced in searches across design-inspiration and product contexts.

**Recommendation:** flag this to the owner. Until clarified, Tome should **not** derive any visual or interaction principles from "Mind Market" — inventing specifics would violate the no-fabrication rule. It is possible the owner means a feature name, a fictional brand from an earlier prompt, or one of the research firms above (in which case it has no design value for us anyway).

---

## bar.digital — the product-craft reference

Direct fetch of `https://www.bar.digital/` (retrieved 2026-07-22) shows a small Barcelona studio (~10 people) offering product & brand direction, UI/UX, discovery, and MVP launches. Its entire site is built around one positioning phrase: **"Useful Beauty."** Other observable craft signals: playful but honest microcopy ("Cookies & vibes — we use cookies, tea & a touch of magic"; "Tell us what works — and what flops."), prices stated plainly next to services, a named work process, and small-team candor ("No outsourcing, just our trusted team").

**What Tome takes from this:** the *philosophy*, not the aesthetic. "Useful beauty" — every decorative choice must carry information, orientation, or emotion; ornament that does no work gets cut. Microcopy with a human voice that never oversells. This aligns directly with the master plan's synthesis mandate ("useful beauty rather than decoration," "playful but honest microcopy"). Source: `https://www.bar.digital/`.

---

## Pattern syntheses

Each entry: **what it is / why it works / adopt / reject / how Tome stays original / route & component implications.**

### 1. First-run onboarding

**What it is.** Duolingo reverses the onboarding funnel: pick a language, set a daily goal, complete a placement lesson, commit to a streak target — and only *then* does signup appear. The user tastes the core loop before giving anything. Headspace opens with intent capture ("What's on your mind? I want to… feel calm / sleep soundly") and routes into a mini-practice so the first session *is* the aha moment, ending with a pre/post comparison the user feels rather than reads. Sources: `https://duolingo.deconstructoroffun.com/mechanics/streaks`, `https://www.howtheygrow.co/p/how-headspace-grows-the-monk-who`, `https://octet.design/journal/duolingo-case-study/`.

**Why it works.** Value-before-commitment exploits reciprocity and kills signup abandonment; intent capture doubles as personalization data and as priming for later retention copy; an immediate first success converts "install" into "investment" before any ask.

**Adopt.** Value-first sequencing; goal/intent capture in the user's own words; a real first experience (a short reading moment or one quiz question with delightful feedback) *before* account creation; a pre/post "notice what changed" beat.

**Reject.** Multi-screen feature tours; upfront account walls; long personalization quizzes that gate content (Calm/Headspace-style questionnaires that "never change after setup" are rated the shallowest personalization tier — `https://naraki.nu/blog/ai-meditation-apps-2026`); asking for email before any value.

**How Tome stays original.** Tome's first experience is not a generic lesson — it is *entering a book*. Onboarding should open a beautiful excerpt of a public-domain text with Virgil reacting in the margin, then ask "Who are you reading as?" (role) and "What draws you in?" (intent). The streak/goal commitment happens *after* the reader has felt the book, in Tome's literary voice, not a gamified clone of Duolingo's green path.

**Route/component implications.** `src/app/(standalone)/onboarding/` already exists — keep account creation at the *end* of that flow; the pre-signup excerpt can reuse the `/read` renderer in a sandboxed, anonymous mode. Needs an `OnboardingShell` (progress dots, skippable), an `IntentCapture` step, and a deferred `SignupGate` component. Anonymous state (chosen book, excerpt progress, intent) lives in `localStorage` and is claimed on signup via a server action.

### 2. Role selection

**What it is.** Segmented onboarding: Headspace asks your goal and shows different content per segment; Khan Academy lets one account carry multiple roles (a parent can enable a Teacher role and get the Teacher Dashboard); Google Classroom splits the whole product by role (teacher sees Stream/Classwork/People/Grades management, student sees turn-in flow). Sources: `https://www.eleken.co/blog-posts/saas-onboarding-educate-engage-and-retain-your-customers`, `https://support.khanacademy.org/hc/en-us/community/posts/4409724164493-If-Homeschooling-should-I-create-a-parent-or-teacher-account`.

**Why it works.** Role routing reduces cognitive load — each persona sees only relevant surfaces — and collects segmentation data at the moment motivation is highest.

**Adopt.** A single, warm role step (Student / Teacher / Independent reader) with illustrated cards and one-line honest descriptions of what each path gets; role must be switchable later without penalty.

**Reject.** Role lock-in, separate apps per role, and enterprise-style "request teacher access" friction for individuals. Also reject asking role before any value — it should come after the first reading moment or be lightly skippable.

**How Tome stays original.** Role choice is framed as "how will you travel through the library?" with Virgil reacting differently per role — a narrative beat, not an HR form. Teacher selection foreshadows the Stoa/classroom world rather than showing a dashboard screenshot.

**Route/component implications.** A `RoleGate` server component reading the profile's role claim; role-specific home under `src/app/(app)/dashboard/` vs. `src/app/(app)/teacher/` (both exist). Store role in Supabase profile, not route params; middleware redirects by role. `student-login` and `join` routes in `(standalone)` already hint at class-code joins — keep those role-aware.

### 3. Continue-learning home

**What it is.** Duolingo's home *is* the path — the next action is the largest, lowest-friction element on screen (one oversized Continue). Khan Academy Reimagined's student dashboard leads with a Learning Queue sorted by due date (daily / weekly / unit missions), so "what do I do next" is answered above the fold. Sources: `https://www.925studios.co/blog/duolingo-design-breakdown`, `https://support.khanacademy.org/hc/en-us/articles/46935588089997`.

**Why it works.** The home screen's job is to collapse decision fatigue to one obvious next step; everything else (streak, progress, queue) is context around that single CTA.

**Adopt.** One dominant "Continue reading" card on home — book cover, exact position ("Chapter 12 · 40% through"), resume in one tap; a secondary queue (assignments for students, "up next" recommendations for independent readers); streak and progress as ambient indicators, not the main event.

**Reject.** A generic dashboard of equal-weight cards; notification-style feeds as the default home; multiple competing CTAs.

**How Tome stays original.** Tome's home is a *place*, not a feed: the reader's current book as a portal, the path beyond it visible as a trail, Virgil present with one contextual line ("You left off just as the ghost appeared…"). This is the master plan's Explore mode — colorful, animated — versus the quiet Read mode.

**Route/component implications.** `src/app/(app)/dashboard/page.tsx` (or `(app)/page.tsx`) becomes the continue-learning home. Needs a `ContinueReadingCard` backed by a `reading_positions` query (latest position per user), an `UpNextRail`, and a `VirgilGreeting` slot. Server-component data fetch; resume link deep-links into `/read/[book]/[chapter]#pos`.

### 4. Curriculum / path maps

**What it is.** Duolingo's 2022 "path UI" merged lessons, stories, and practice into a single linear, winding trail with unit header bars and guidebooks — replacing the older skill tree. Reception was mixed: praised for injecting stories into the main progression, criticized for hiding content-type distinctions and removing user control. Sources: `https://uxdesign.cc/duolingos-redesign-4-things-they-got-right-1-possible-improvement-acec8af9ec10`, `https://uxdesign.cc/down-the-wrong-path-the-disaster-of-the-latest-duolingo-ui-update-a4cdd1e6ea1c`. Khan Academy organizes by courses → units → skills with mastery states (Proficient/Mastered) per skill — a map of *competence*, not just sequence.

**Why it works.** A spatial map turns abstract progress into geography: users see where they are, what's next, and how far the world extends. Unit headers chunk the journey into completable arcs.

**Adopt.** A winding path per "journey" (e.g., a book, an era trail, a genre trail) with chunky nodes, unit/chapter banner bars, and clear locked/current/done states; visible length so users can see the whole world; completion states that read at a glance.

**Reject.** Duolingo-path's collapse of all content types into indistinguishable bubbles (users lost the ability to choose *what kind* of practice); pure linearity that forbids skipping ahead for advanced readers; mastery gates that block a student from reading ahead of the class.

**How Tome stays original.** Tome's maps are *literary geography* — trails through books, eras, and themes, rendered in Tome's bespoke illustrative style. Unlike Duolingo's identical bubbles, Tome node shapes carry meaning (chapter / quiz / Virgil moment / reward). The repo already has `docs/monumental-literary-paths.md` — this synthesis supports that direction.

**Route/component implications.** `src/app/(app)/explore/` is the natural home for the path map. Needs a `PathMap` component (SVG/Canvas, virtualized for long trails), a `PathNode` with typed states, and journey metadata in `content/` or Supabase. Deep links: `/explore/[journey]` → node → `/read/...` or `/quiz/...`.

### 5. Lesson nodes

**What it is.** Duolingo's nodes are tactile press-targets with squash-and-release states, crown/level markers, and a "start" affordance that needs zero explanation; unit guidebooks attached to header bars provide reference material. Brilliant's lesson unit is different: one concept per lesson, visual and interactive, mixing direct instruction with manipulation — "each lesson focuses on a single concept" with "visual representations and active learning." Sources: `https://duolingo.deconstructoroffun.com/mechanics/streaks`, `https://brilliant.org/about/`.

**Why it works.** Chunked, single-concept nodes keep sessions short (Duolingo's ~3–5 minute minimum action is the retention floor); tactile states make the interface feel physical and honest; one-concept lessons keep cognitive load inside working memory.

**Adopt.** Single-purpose nodes; tactile press/release (`:active` scale, spring-back); session lengths of 5–10 minutes for quiz/proof nodes; a "guidebook"-style reference attached to each chapter node (character list, context, glossary).

**Reject.** Nodes that secretly contain 20-minute commitments; fake progress (nodes that mark complete without demonstrated understanding); uniform bubble styling that hides content type.

**How Tome stays original.** Tome's nodes are chapters, passages, and Virgil encounters — the "lesson" is often *reading well*, proven by short comprehension and interpretation moments, not vocabulary drills. Node art is bespoke per journey rather than recolored per unit.

**Route/component implications.** Shared `PathNode` component used by `/explore` maps; press states via Tailwind 4 `active:` + a small spring utility (or CSS `transition-timing-function` cubic-bezier); guidebook panel as a route interceptor (`/book/[slug]/guide`) or sheet component.

### 6. Streak mechanics, done kindly

**What it is.** Duolingo's streak is retention architecture: loss aversion, escalating notification urgency, streak freezes (capped at 2 for free users), silent auto-application, "Earn Back" repair paths, and a Perfect Streak prestige tier. Learners at a 7-day streak are ~2.4× more likely to return; making streaks *easier* to keep (any lesson counts) raised 7-day-streak rates by 40%+. Sources: `https://www.digia.tech/post/duolingo-habit-forming-reminders-retention-architecture`, `https://duolingo.deconstructoroffun.com/mechanics/streaks`. Finch is the counter-model: gentle daily check-ins grow a virtual pet that goes on adventures and returns with stories; no punishment, no guilt, ad-free, and the pet is a *companion* rather than a scorekeeper. Sources: `https://www.makeuseof.com/finch-self-care-widget-pet-app/`, `https://www.whistleout.com/CellPhones/Apps/finch-self-care-app-review`.

**Why it works.** Streaks convert distant goals into immediate loss-prevention; safety nets keep loss aversion motivating instead of breeding resentment ("the safety net keeps loss aversion functioning without becoming resentment"); Finch proves companionship framing can carry the same daily-return loop with zero shame.

**Adopt.** Any-reading-counts streak (a page read, a quiz done — low floor); automatic, silent protection (a "bookmark day" that saves a missed day, granted proactively, capped); an earn-back path after a break; celebration of milestones without escalating threat notifications.

**Reject — firmly, per the master plan's "no manipulative guilt, punishment, or mascot distress":** sad/sick mascot states, emotionally escalating push copy, "your streak dies in 10 minutes" pressure, paid streak repair, and any design where Virgil appears disappointed in a child.

**How Tome stays original.** Tome's streak is a *reading hearth*: consecutive days keep a fire lit on the reader's shelf, and missed days are covered by "pressed-flower days" already in the reader's pocket — the metaphor is literary, the tone is Finch-kind, the mechanics borrow only Duolingo's *structural* insights (low floor, automatic protection, bounded forgiveness, earn-back). No wager mechanics, no repair monetization.

**Route/component implications.** A `StreakHearth` component on `/dashboard`; streak state computed server-side from a `reading_days` table (date, any-activity flag, protection flag); notification copy guidelines documented in the design system. Earn-back flow as a small celebratory modal, not a paywall.

### 7. Reward reveals

**What it is.** Duolingo layers XP, gems, chest drops, and league promotion into the reward column of the core loop (action → reward → progress); Khan Academy Reimagined replaced badges/energy points with Gems that are *never lost*, with every 50 gems unlocking a random accessory for the Khanmigo character — a collectible reveal loop tied to a class-wide Gem Challenge. Sources: `https://duolingo.deconstructoroffun.com/mechanics/streaks`, `https://support.khanacademy.org/hc/en-us/articles/46935588089997`, `https://support.khanacademy.org/hc/en-us/articles/46056261189773`.

**Why it works.** Random-accessory unlocks add variable-reward anticipation to otherwise predictable progress; class-shared goals convert individual grind into collective celebration; currency that never decreases keeps the system honest.

**Adopt.** Reward moments at true completion points (chapter finished, quiz mastered) with a short, tactile reveal animation; a collectible shelf (illustrated artifacts from the books — a whale for Melville, a mockingbird, a green light) earned by reading, never purchasable, never lost; optional class goals that unlock something shared.

**Reject.** Loot-box randomness tied to spending, leagues/leaderboards for children, reward schedules that interrupt reading flow mid-chapter, and any "open 10 chests" shop psychology.

**How Tome stays original.** Rewards are *literary artifacts and world-growth* — effort visibly changes the reader's world (the master plan's "My effort changed the world"), echoing Finch's pet-adventures payoff rather than casino cadence. The reveal is a small ceremony with Virgil, in the Prove-and-celebrate mode's joyful crescendo.

**Route/component implications.** A `RewardReveal` overlay component triggered from quiz/chapter completion handlers; artifact inventory under `src/app/(app)/shelves/` or `/profile`; class shared goal state in the classroom schema. Keep reveals interruptible and skippable.

### 8. Mascot reactions

**What it is.** Duo's emotional range (encouragement, celebration, and — infamously — guilt) is engineered retention; character-voiced notifications ("a notification from Lily is not a notification from Duolingo") measurably lift opens. Finch's bird expresses state through energy and adventures, never through sickness or sadness at the user. Sources: `https://www.digia.tech/post/duolingo-habit-forming-reminders-retention-architecture`, `https://www.makeuseof.com/finch-self-care-widget-pet-app/`.

**Why it works.** A consistent character turns a product into a relationship; emotional reactions make feedback legible without reading a word; recognition drives notification opens before copy can.

**Adopt.** A reaction *vocabulary* for Virgil — delighted, thoughtful, impressed, curious, quietly encouraging — mapped to specific product events (first answer right, third try right, chapter done, return after a week); character voice in all system microcopy.

**Reject.** Distress, disappointment, sickness, or abandonment theater; reactions that interrupt or patronize; reaction spam (Virgil should not comment on every tap).

**How Tome stays original.** Virgil is a *guide*, not a pet or a judge — reactions are literary-minded (he raises an eyebrow at a trick question, quotes a line when you triumph). His register is warm intelligence. This is already Tome's strongest original asset; the research only says: give him a consistent, bounded emotional system and never let him shame.

**Route/component implications.** A `VirgilMood` enum + event→mood map in a shared module (e.g., `src/lib/virgil/moods.ts`); reaction slots in `/read` (margin), `/quiz` (feedback), `/dashboard` (greeting). One animation set, reused — no per-screen bespoke mascot code.

### 9. Hint and error feedback

**What it is.** Brilliant builds feedback into the learning object itself: interactive problems with feedback and guidance that let students "create their own comprehension" and self-assess. Khan Academy pairs immediate answer feedback with skill-level remediation ("revisit missed concepts with targeted practice"). Established error-message UX guidance adds the accessibility layer: never rely on red alone, always pair color with icon and placement above the action. Sources: `https://files.eric.ed.gov/fulltext/EJ1394390.pdf`, `https://wifitalents.com/best/asu-student-software/`, `https://www.smashingmagazine.com/2022/08/error-messages-ux-design/`.

**Why it works.** Immediate, explanatory feedback converts errors into instruction (formative, not evaluative); hints preserve agency — the learner still produces the answer; icon+color+placement redundancy keeps feedback perceivable for everyone.

**Adopt.** Two-tier quiz feedback: first wrong answer → a hint that points at the relevant passage (never the answer); second wrong → the answer *explained*, with the passage quoted; error styling = icon + warm color + inline placement at the control; retry without penalty and without score-shaming.

**Reject.** Red-X-only feedback, score penalties for hints in practice mode, generic "incorrect" with no explanation, and locking students out after failures.

**How Tome stays original.** Hints are Virgil doing what a great teacher does: "Look again at what the Captain says here —" with a deep link back into the text. The feedback moment is a dialogue between the passage and the reader, uniquely possible because Tome *has* the text.

**Route/component implications.** Quiz components under `src/app/(app)/quiz/` and `/quizzes/`; a `HintLadder` component with passage references; hint usage logged (without penalty) for teacher analytics; all error states pass through a shared `FormField`/`AnswerFeedback` component enforcing icon+color+placement.

### 10. Reading settings

**What it is.** Apple Books exposes: font size, page themes (Original, Quiet, Paper) with customization, Light/Dark/Automatic background, font choice, bold text, spacing slider, justification toggle, multiple columns, and auto-hyphenation. Kindle app equivalents add per-device sync. Ebook typography research converges on: line length ~45–90 characters (~66 ideal), line height 1.4–1.6, relative units, generous margins, ragged-right as a defensible default, WCAG contrast. Sources: `https://support.apple.com/is-is/guide/books/ibks8923126d/mac`, `https://kitaboo.com/best-fonts-for-ebooks/`.

**Why it works.** Reading comfort is personal and situational (lighting, eyesight, device); a good default signals quality ("a font that reads well without adjustment signals quality"); settings must apply instantly and reflow without breaking position.

**Adopt.** A compact settings sheet in the reader: size (relative steps), theme (Paper / Quiet / Night — Tome-named), font (serif/sans/dyslexia-friendly), line height, margins; instant apply with position preservation; settings synced to the account.

**Reject.** Settings that paginate or reload the chapter; overwhelming pro-typographer controls (kerning sliders); Apple Books' famously rigid wide margins with no user control — give margin control Apple withholds (`https://talk.tidbits.com/t/margins-line-length-and-reading-ebooks-on-an-iphone/24445`).

**How Tome stays original.** The reader chrome is the master plan's Read mode: calm, typographically excellent, minimal. Tome's themes are named after reading moods/places (e.g., "Lamplight," "Marginalia") rather than generic "Sepia #3," and the settings sheet itself is typographically beautiful — the controls demonstrate the craft they control.

**Route/component implications.** `src/app/(app)/read/` reader: a `ReaderSettingsSheet` writing to a `reader_settings` table (server) + `localStorage` fallback; CSS custom properties on the reader root (`--reader-size`, `--reader-leading`, `--reader-measure`); a11y check that every theme meets contrast.

### 11. Library filtering

**What it is.** With 1,280 public-domain books, the library is a discovery problem. Reader-app conventions: shelves/collections (Apple Books sidebar, Goodreads shelves), horizontal cover rails, search + facet filters. Learning-platform convention (Khan, Brilliant): browse structured by course/unit rather than flat catalog. Sources: `https://support.apple.com/is-is/guide/books/ibks8923126d/mac` (library/collections), `https://support.khanacademy.org/hc/en-us/articles/46935588089997`.

**Why it works.** Facets (era, genre, length, reading level) match how teachers actually choose texts ("a short 19th-century American novel"); rails match how readers browse (covers, vibes); shelves match how readers organize (personal meaning, not taxonomy).

**Adopt.** Three browse modes that share one filter state: Rails (serendipity), Atlas (curated journeys/eras), Search+facets (era, genre, length estimate, Lexile-ish level, "has quizzes," "has Virgil"); personal shelves ("To read," "Class set," custom).

**Reject.** A flat paginated grid of 1,280 covers; filter UIs that reset on navigation; faceted search without counts.

**How Tome stays original.** The library is a *library* — rooms, shelves, and trails with warm illustration — not a Netflix grid. Filters use literary vocabulary (Era, Mood, Journey length) rather than database fields. Cover art uses Tome's existing cover system (`docs/cover-system/`).

**Route/component implications.** `src/app/(app)/library/` with URL-driven filter state (search params → server component query against `data_canon_books.json`/Supabase); `ShelfCard` and `FilterBar` components; rails on `/explore` reuse the same card. Keep filter state in the URL for shareability (teachers linking a filtered set).

### 12. Teacher roster, assignment, and grading

**What it is.** Google Classroom's enduring four-tab model: Stream (announcements/feed), Classwork (assignments organized by topic), People (roster + invite by code), Grades. Its grading tool: click a student in the left roster, page through submissions, leave document + private comments, use a reusable comment bank, return work. Khan Academy teacher tools: class creation, roster management, four assignment types, assignment scores report with **CSV export**, per-student skills report, and a student-preview mode. Sources: `https://www.mjosbr.com/download/effect-of-tutorial-on-students-communication-skill-in-google-classroom-in-university-of-port-11292.pdf`, `https://shakeuplearning.com/blog/google-classroom-advanced-tips-part-2/`, `https://support.khanacademy.org/hc/en-us/articles/360031129891-What-reporting-options-are-available-on-Khan-Academy-for-teachers-to-track-student-performance`, `https://support.khanacademy.org/hc/en-us/articles/38554589793293`.

**Why it works.** Four tabs map to the teacher's mental model (talk / assign / people / marks); roster-in-sidebar grading minimizes navigation per paper; comment banks attack the repetitive-feedback time sink; CSV export respects that the gradebook of record lives elsewhere.

**Adopt.** A three/four-surface teacher area — Overview (what needs attention now), Assignments (create/manage, with due dates and per-class targets), Students (roster + per-student detail), Marks (gradebook grid + export); join-by-code for students; a grading queue with student sidebar and reusable feedback snippets; CSV export from day one; "view as student" preview.

**Reject.** Stream-style social feeds for young classrooms (moderation burden, distraction — note Khan Reimagined *removed* Discussions entirely); grading flows that require opening each submission in a new tab; gradebooks that can't leave the platform (no export = teacher veto).

**How Tome stays original.** Teacher surfaces are calm and literary — the "Stoa" — with assignment creation centered on *books and passages* ("Assign Chapter 3 + the checkpoint quiz") rather than generic content items. Feedback snippets ship with literature-specific starters ("Strong evidence from the text — now push on the why").

**Route/component implications.** Existing routes: `src/app/(app)/teacher/`, `/classroom/`, `/assignments/`. Consolidate into a `TeacherShell` with Overview/Assignments/Students/Marks tabs; `RosterTable`, `AssignmentComposer` (book+passage+quiz picker), `GradingQueue` (sidebar roster + submission pane), and an `/api/classroom/export` CSV route. The repo's existing `GRADEBOOK-INTEGRITY-REPORT.md` and `CLASSROOM-AUDIT.md` should be cross-read before implementation.

### 13. Live session lobby

**What it is.** Kahoot's live model: host projects a lobby with a game PIN, QR, and copyable join link; players join with no account, spin a friendly nickname (host can enforce a nickname generator and player identifier), and wait in a visible roster until the host starts; questions run synchronized on the shared screen with per-device answering; rejoining requires a new nickname (no score recovery). Quizizz/Wayground's counter-model: student-paced play on individual devices, no shared screen required, joinable by code with deadlines for homework. Sources: `https://support.kahoot.com/hc/en-us/articles/360039890713-Kahoot-join-code-how-to-join-a-Kahoot-game`, `https://triviamaker.com/kahoot-vs-quizziz/`.

**Why it works.** Zero-account joining removes the biggest classroom friction; the lobby builds anticipation and lets the teacher verify attendance at a glance; nickname generator + identifier balance fun with classroom management; the PIN/QR/link triad covers every room configuration.

**Adopt (if/when Tome builds live sessions).** A lobby with join code + QR + link; no-account student join via a short code (the repo already has `student-login` and `join` routes); teacher-visible arrival list; friendly auto-nicknames ("Curious Pip," "Bold Hermione") with a real-name roster binding visible only to the teacher; both synchronized (Kahoot-style) and self-paced (Quizizz-style) modes.

**Reject.** Speed-scored leaderboards for young readers (Kahoot's speed-weighted scoring rewards fast clicking, not comprehension); forced accounts for students; public nicknames without a generator option (classroom safety).

**How Tome stays original.** A Tome live session is a *read-aloud salon*: the lobby is a gathering place with the book's world as backdrop, students arrive as named travelers, and the session mixes shared passage reading with checkpoint questions — the literary frame makes it Tome, not a Kahoot skin.

**Route/component implications.** `src/app/(standalone)/join/` and `/student-login/` as the no-account entry; a future `/classroom/live/[session]` host view + `/join/[code]` player view; realtime via Supabase channels; session roster bound to the class roster for post-hoc analytics.

### 14. Mobile bottom navigation

**What it is.** Duolingo, Finch, Headspace, and the Khan student app all use a 4–5 item bottom tab bar with the core loop one tap away; Finch additionally centers a prominent `+` action button for the primary creation act. Source: `https://www.makeuseof.com/finch-self-care-widget-pet-app/` (home-screen `+` pattern), plus the Duolingo breakdowns above.

**Why it works.** Thumb-reach ergonomics; persistent wayfinding; a center action button reserves the most reachable spot for the app's verb.

**Adopt.** Four tabs on mobile: Home (continue learning), Explore (paths/library), a center Read/Resume action (Tome's verb), Class (students) or Shelf (independent), Profile. Persistent across `(app)` routes, hidden in the immersive reader (Read mode = minimal chrome) with an easy re-summon.

**Reject.** More than five tabs; hamburger-primary navigation; keeping the bar visible over book text (reading immersion wins).

**How Tome stays original.** The center button is a book/bookmark mark, not a generic `+`; tab icons are Tome's bespoke set; the bar's arrival/hide transitions respect the Explore/Read mode rhythm (present and playful in Explore, dissolved in Read).

**Route/component implications.** A `MobileTabBar` in `src/app/(app)/layout.tsx`, hidden via a reader-context flag when `/read` enters immersive mode; safe-area insets; active-tab detection from `usePathname`.

### 15. Tablet split layouts

**What it is.** Apple Books on Mac/iPad exposes one-page vs. two-page spread and multiple columns — the reader adapts to width rather than stretching a phone layout (`https://support.apple.com/is-is/guide/books/ibks8923126d/mac`). Google Classroom and Khan teacher dashboards are desktop-first two-pane layouts (roster sidebar + content); Kahoot's live model is inherently split: shared screen (host/board) + personal device (answer).

**Why it works.** Tablets sit between phone and laptop: wide enough for context+content, personal enough for touch. Split layouts put navigation/context on the left and the primary object on the right, doubling information density without clutter.

**Adopt.** Reader: optional two-page spread in landscape + margin column for Virgil/contextual notes (Read mode with a companion margin). Classroom/teacher: persistent sidebar (roster or queue) + main pane at `md`+ breakpoints. Path maps: side panel with node detail instead of modal takeover on wide screens.

**Reject.** Stretched single-column phone layouts at 1024px; split views that trap the reader (the book text must be able to go full-bleed on demand); desktop-only hover affordances on touch tablets.

**How Tome stays original.** The margin is *Virgil's natural habitat* — on tablets he lives in the margin like a scholarly annotator; on phones he collapses to a floating presence. The two-page spread uses Tome's paper texture and gutter shadow, making the tablet feel like the artifact.

**Route/component implications.** Container-query-driven reader layout in `/read` (`@container` via Tailwind 4): single column < ~700px, spread + margin column above; `TeacherShell` grid `grid-cols-[280px_1fr]` at `lg`; Virgil margin component shared between `/read` and `/virgil` chat surfaces.

---

## Tome interaction principles — one-page summary

Distilled from everything above, filtered through the master plan's north star (Enter / Understand / Virgil noticed / Effort changed the world / Next chapter) and the three-mode rhythm (Explore → Read → Prove & celebrate).

1. **Value before ask.** Let every new user *enter a book* before signup, before role, before settings. The first session must contain one real moment of reading and one moment of delight. (Duolingo funnel reversal, Headspace mini-practice.)

2. **One obvious next thing.** Every home screen answers "what now?" with a single dominant action — continue reading. Everything else is context. (Duolingo path, Khan Learning Queue.)

3. **Progress is geography.** Journeys are visible trails through literary worlds with chunky, typed nodes and honest states — never abstract percentages, never indistinguishable bubbles. (Duolingo path, minus its flattening.)

4. **Streaks with a hearth, not a whip.** Low floor, automatic protection, bounded forgiveness, earn-back after breaks. No guilt escalation, no mascot distress, no paid repair — ever. (Duolingo's structure, Finch's soul.)

5. **Feedback teaches.** Wrong answers get a passage-pointing hint first, an explained answer second, and never a penalty. Icon + color + placement, always. (Brilliant, Khan, a11y guidance.)

6. **Virgil is a guide, never a judge.** A bounded emotional vocabulary — delighted, thoughtful, encouraging — mapped to real events. Character voice in every system message. He never shames a child. (Duolingo character-voice insight, minus Duo-guilt.)

7. **Effort visibly changes the world.** Rewards are earned literary artifacts and world-growth, revealed in short ceremonies; never purchasable, never lost, never random-for-money. (Khan gems, Finch adventures, bar.digital's useful beauty.)

8. **The reader is sacred space.** Read mode strips chrome, offers real typographic control (size, theme, leading, measure, spread), applies it instantly, and preserves position. (Apple Books settings + the margin control Apple withholds.)

9. **Teachers get time back.** Four surfaces (Overview / Assignments / Students / Marks), join-by-code, grading queue with reusable feedback, CSV export, view-as-student. No social stream for young classrooms. (Google Classroom, Khan teacher tools.)

10. **Live sessions lower every barrier.** Code + QR + link, no student accounts, friendly auto-names, teacher-bound roster, both synchronized and self-paced modes. Speed never scores comprehension. (Kahoot lobby, Quizizz pacing.)

11. **Useful beauty.** Every decorative element must carry orientation, information, or emotion. Playful but honest microcopy. Prices, limits, and states stated plainly. (bar.digital.)

12. **Modes, not one dashboard.** Explore is colorful and animated; Read is calm and typographic; Prove-and-celebrate is tactile and joyful. The interface deliberately transitions between them. (Master plan §6, supported by every reference's mode-splitting.)

**Open item for the owner:** the "Mind Market" reference is unresolved (§ above). No principles were derived from it; please clarify the intended product/studio before design tokens are finalized.

---

## Source list

- Duolingo streak/retention architecture — `https://www.digia.tech/post/duolingo-habit-forming-reminders-retention-architecture`
- Duolingo streak mechanics (Deconstructor of Fun) — `https://duolingo.deconstructoroffun.com/mechanics/streaks`
- Duolingo case study — `https://octet.design/journal/duolingo-case-study/`
- Duolingo path redesign (pro/con) — `https://uxdesign.cc/duolingos-redesign-4-things-they-got-right-1-possible-improvement-acec8af9ec10` / `https://uxdesign.cc/down-the-wrong-path-the-disaster-of-the-latest-duolingo-ui-update-a4cdd1e6ea1c`
- Duolingo design breakdown — `https://www.925studios.co/blog/duolingo-design-breakdown`
- Brilliant method — `https://brilliant.org/about/` and `https://files.eric.ed.gov/fulltext/EJ1394390.pdf`
- Headspace onboarding — `https://www.howtheygrow.co/p/how-headspace-grows-the-monk-who`, `https://www.eleken.co/blog-posts/saas-onboarding-educate-engage-and-retain-your-customers`, `https://naraki.nu/blog/ai-meditation-apps-2026`
- Finch — `https://www.makeuseof.com/finch-self-care-widget-pet-app/`, `https://www.whistleout.com/CellPhones/Apps/finch-self-care-app-review`
- Khan Academy student dashboard / teacher tools — `https://support.khanacademy.org/hc/en-us/articles/46935588089997`, `https://support.khanacademy.org/hc/en-us/articles/360031129891-What-reporting-options-are-available-on-Khan-Academy-for-teachers-to-track-student-performance`, `https://support.khanacademy.org/hc/en-us/articles/38554589793293`, `https://support.khanacademy.org/hc/en-us/articles/46056261189773`, `https://support.khanacademy.org/hc/en-us/articles/360031123551`
- Kahoot joining / lobby — `https://support.kahoot.com/hc/en-us/articles/360039890713-Kahoot-join-code-how-to-join-a-Kahoot-game`
- Kahoot vs Quizizz (Wayground) — `https://triviamaker.com/kahoot-vs-quizziz/`
- Google Classroom structure / grading — `https://www.mjosbr.com/download/effect-of-tutorial-on-students-communication-skill-in-google-classroom-in-university-of-port-11292.pdf`, `https://shakeuplearning.com/blog/google-classroom-advanced-tips-part-2/`
- Apple Books reading settings — `https://support.apple.com/is-is/guide/books/ibks8923126d/mac`
- Ebook typography — `https://kitaboo.com/best-fonts-for-ebooks/`, `https://talk.tidbits.com/t/margins-line-length-and-reading-ebooks-on-an-iphone/24445`
- Error-message UX — `https://www.smashingmagazine.com/2022/08/error-messages-ux-design/`
- bar.digital — `https://www.bar.digital/`
- "Mind Market" candidates — `https://mindmarket.com/`, `https://www.themindmarket.com/what-we-do`, `https://www.greenbook.org/company/MindMarket`
