# Supabase Data Map — Tome Rebuild

**Author:** Supabase_Schema_Mapper (Tome rebuild team)
**Date:** 2026-07-22
**Branch:** `kimi/tome-virgil-maximalist-demo-20260722`
**Method:** Read-only static analysis of `supabase/migrations/*.sql` (50 files, 2026-04-12 → 2026-07-19) plus `src/lib/supabase/*`, `src/lib/database.types.ts`, and API routes. **No live database was contacted** — no credentials exist in the repo.

## 0. Scope & caveats

1. **The migrations folder is not the whole schema.** Core tables — `profiles`, `books`, `authors`, `traditions`, `chapters`, `quizzes`, `questions`, `annotations`, `user_stats`, `achievements`, `leaderboard`, `community_activity`, `classrooms`, `classroom_members`, `assignments`, `assignment_submissions`, `classroom_announcements`, `teacher_quizzes`, `teacher_quiz_questions`, `teacher_quiz_results`, `teacher_student_notes`, `cover_archive`, and the `book_toc` view — are **referenced and altered but never `CREATE TABLE`-ed in this repo**. They come from a base schema applied before 2026-04-12 (or out-of-band via the Supabase MCP — many migration headers say "Applied to the live project (vjaezrcuuzmbmnsfrtwt) out-of-band via MCP; tracked here for parity"). Column lists below for these tables are reconstructed from `ALTER TABLE` statements, FK references, RPC bodies, and `src/lib/database.types.ts`.
2. Several migrations are self-described "repo-of-record" copies of out-of-band applies, so **live drift is possible** (e.g. the `notification_type` enum is cast to `'message'` in `20260715000000_message_notifications.sql`, but `'message'` is not in the enum created by `20260630000000_notifications.sql` — it must have been added out-of-band).
3. **`src/lib/database.types.ts` is stale.** It is missing ≥ 20 migration-created tables: `quiz_results`, `guided_sessions`, `guided_session_participants`, `guided_session_events`, `guided_session_stations`, `guided_session_messages`, `guided_session_reflections`, `live_quiz_sessions`, `live_quiz_participants`, `live_quiz_answers`, `virgil_guided_sessions`, `virgil_session_messages`, `virgil_task_events`, `parent_links`, `groups`, `group_members`, `group_posts`, `group_invites`, `group_schedule`, `group_goals`, `group_notes`, `semester_plans`, `semester_plan_weeks`, `semester_plan_items`, `achievement_unlocks`, `book_clubs`, `club_*`, `guardians`, `guardian_student_links`, `guardian_messages`, `activity_events`, `activities`, `activity_reactions`, `reports`, `digest_runs`, `login_attempts`, `student_access_codes`, and all `cover_*` v2 tables. Regenerate types before the rebuild relies on them.
4. Index/FK findings come from a static parser over the SQL (PK/UNIQUE constraints counted as implicit indexes); they are **candidates to confirm against the live advisor output**, not advisor output itself.

---

## 1. Table inventory

Migration file dates are abbreviated (`0413` = `20260413000000_…`). Tables marked **[base]** are not created anywhere in this repo (see caveat 1). Tables marked ~~struck~~ were created and later `DROP`-ed.

### 1.1 Identity, library catalog & content

| Table | Purpose (1 line) | Key columns | Created / altered by |
|---|---|---|---|
| `profiles` **[base]** | One row per auth user; display identity, role, cached economy mirror | `id` (= `auth.users.id`), `display_name`, `username`, `avatar_url`, `role` (`reader`/`teacher`/`student` per `profiles_role_check`, widened 0706), `total_xp`, `current_streak` (cached mirror of `user_stats`, added 0629), `stripe_customer_id` (0706), `discoverable`, `friend_code` (0630/12) | base; altered 0629, 0630/12, 0706 |
| `books` **[base]** | Canonical 1,280-book catalog | `id` (text slug), `structural_unit_type` (added 0412) | base; altered 0412 |
| `authors` / `traditions` **[base]** | Author + literary-tradition dimensions | — (types only) | base |
| `chapters` **[base]** | Per-book chapter/unit content | `book_id`, `unit_title` (added 0412) | base; altered 0412 |
| `quizzes` / `questions` **[base]** | Generated per-chapter quiz bank | `hints`, `distractor_eliminations` (0624); `hints_enabled`, `hint_point_penalty` on `quizzes` (0624) | base; altered 0624 |
| `annotations` **[base]** | Legacy chapter-based annotation table (name collision noted in 0416) | — | base |
| `works` | Structured-content works (drama; e.g. Hamlet) | `id` (text), `title`, `author`, `structural_unit_type` | 0416 |
| `sections` | Acts/scenes (drama) or chapters within a `works` row | `id`, `work_id`→`works`, `sequence` | 0416 |
| `lines` | Individual verse/prose lines with speaker | PK `(section_id, array_index)`, `number`, `speaker`, `text` | 0416 |
| `stage_directions` | Drama stage directions | `section_id`→`sections`, `after_line` | 0416 |
| `glosses` | Word/phrase definitions per line | `section_id`, `line`, `phrase`, `definition` | 0416 |
| `scene_annotations` | Scholarly footnotes for structured content (renamed to avoid the legacy `annotations` name) | `section_id`, `line_start/end`, `category`, `body` | 0416 |
| `book_toc` **[base, view]** | TOC view over `chapters`; switched to `security_invoker = true` | — | altered 0627 |

### 1.2 Reader state (personal)

| Table | Purpose | Key columns | Migrations |
|---|---|---|---|
| `user_stats` **[base]** | **Single source of truth for the game economy** (Wisdom XP, coins, hearts, streak, daily goal, streak freeze) | `user_id` PK, `xp_total`, `coins`, `hearts`, `hearts_last_regen`, `current_streak`, `longest_streak`, `last_active_date`, `daily_goal_minutes`, `daily_progress_minutes`, `daily_progress_date` (0711), `streak_freeze_available` | base; made canonical SoT 0711 |
| `reading_progress` | One row per (user, book): last reading position | PK `(user_id, book_id)`, `chapter_index`, `page`, `scroll_ratio`, `paragraph_anchor`, `percent` (last 2 added 0717) | 0618; 0717; staff SELECT policy 0712 |
| `reading_preferences` | One row per user: serialized reader settings blob | `user_id` PK, `prefs` jsonb | 0618 |
| `highlights` | Text highlights **and** paragraph bookmarks; optional class sharing | `user_id`, `book_id`, `chapter_index`, `selected_text`, `start/end_offset`, `color`, `note`, `shared`, `classroom_id` (0619), `kind` (`highlight`/`bookmark`), `label`, `paragraph_anchor` (0717); REPLICA IDENTITY FULL (0712/12) | 0616; 0619; 0717; 0712/12 |
| `shelf_items` | Personal shelves | `user_id`, `book_id`, `shelf` (`favorites`/`want_to_read`/`completed`), UNIQUE `(user_id, book_id, shelf)` | 0717 |
| `library_entries` | "My library" rows; backs the book-recommendation accept flow | UNIQUE `(user_id, book_id)`, `recommended_by` | 0426 |
| `recitation_progress` | Highest progressive-cloze level reached per passage | UNIQUE `(user_id, passage_id)`, `level_reached` | 0617 |
| `achievement_unlocks` | **Seal/achievement unlock ledger** (catalog lives in app code `src/data/achievements/`) | UNIQUE `(user_id, achievement_id)`, `wisdom_awarded` | 0415 |
| `achievements` **[base, legacy]** | Older achievement rows still read by parent-dashboard RPCs | `user_id`, `name`, `description`, `icon`, `rarity`, `earned_at` (from RPC bodies) | base; policies rewritten 0627 |
| `leaderboard` **[base, legacy]** | Legacy self-reported leaderboard row | `user_id` + score columns | base; policies rewritten 0627 |

### 1.3 Trials, quizzes & results

| Table | Purpose | Key columns | Migrations |
|---|---|---|---|
| `trials` | Comprehension questions attached to `sections` (structured content) | `id`, `section_id`, legacy `kind`/`options`/`answer_index` (nullable since 0617), typed `type` (enum `trial_question_type`)/`content` jsonb, `wisdom_reward`, `flames`, `difficulty` (`apprentice`/`scholar`/`master`), `position` | 0416; extended 0617 |
| `quiz_results` | **One row per Trial attempt; the leaderboard/audit source of truth** | `user_id`, `book_id`, `chapter_index`, `difficulty`, `score`, `total_questions`, `wisdom_earned`, `passed` | 0629; client INSERT revoked + `record_trial_result` RPC 0714 |
| `teacher_quizzes` **[base]** | Teacher-authored (incl. Virgil-generated) quizzes | `teacher_id`, `book_id`, `status`, `hints_enabled` (0624), `source_scope`, `generated_by_model`, `generation_params` (0622) | base; altered 0622, 0624; FK from `assignments.quiz_id` 0716 |
| `teacher_quiz_questions` **[base]** | Questions for teacher quizzes | `question_type` (widened 0622), `correct_answer` (nullable 0622), `rubric`, `reference_answer`, `max_points`, `hints` (0624) | base; altered 0622, 0624 |
| `teacher_quiz_responses` | Student responses/attempts (in-session or standalone), auto/Virgil/teacher graded | UNIQUE `(student_id, question_id, session_id)`, `response` jsonb, `is_correct`, `score`, `graded_by` (`auto`/`virgil`/`teacher`), `ai_feedback`, `ai_rubric_breakdown`, `hints_used`, `hint_max_level` | 0622; column-grant tightening 0717 (virgil_secure) |
| `teacher_quiz_results` **[base]** | Aggregate quiz completion per student/assignment | FKs to assignment/classroom/quiz/student (from types) | base; referenced 0709/16 |

### 1.4 Classroom & gradebook

| Table | Purpose | Key columns | Migrations |
|---|---|---|---|
| `classrooms` **[base]** | A class; join-code based | `teacher_id`, `archived_at` (0426), `leaderboard_enabled` (read by 0713 RPC) | base; policies rewritten 0426 |
| `classroom_members` **[base]** | Membership rows (staff roles + students share one table; PK column is named `student_id` even for staff) | `classroom_id`, `student_id`, `role` (`owner`/`co_teacher`/`ta`/`student`) | base; policies 0426 + recursion fix 0703/12 |
| `classroom_announcements` **[base]** | Class announcements | `title` (added 0426), `content` | base; policies 0426 |
| `classroom_groups` / `classroom_group_members` | Sub-groups inside a classroom | `classroom_id`, `created_by` | 0426 |
| `assignments` **[base]** | Teacher assignments (reading/trial/quiz/essay/discussion/peer-review) | `type`, `book_id`, `chapter_range_start/end`, `points_available`, `due_date` (nullable 0426), `quiz_id` → `teacher_quizzes` (FK added 0716), `scope`, `trial_id` | base; altered 0426, 0716 |
| `assignment_targets` | Per-student/group assignment targeting | `assignment_id`, `user_id`/group refs | 0426 |
| `assignment_submissions` **[base]** | Student submissions incl. essay bodies (`response_text`) | `assignment_id`, `student_id`, `status`, `score`, `submitted_at`, `graded_at` | base; policies 0426; backfill 0709/16 |
| `grades` | Manual/auto grade rows; **single source of truth for gradebook grades** | `submission_id`, `score`, `max_score`, `is_auto_graded`, `graded_by`, `graded_at` | 0426; trigger 0709/16 |
| `grade_history` | Append-only audit mirror of every grade insert/update | `grade_id`, `previous_*`, `changed_by` (nullable 0709/16), `ai_draft_score`, `final_score` (0717 virgil_secure) | 0426; altered 0709/16, 0717 |
| `peer_review_assignments` / `peer_reviews` | Peer-review loops on submissions | `reviewer_id`, `submission_id` | 0426 |
| `student_activity` | Live presence heartbeat (one row per student) for the teacher "Lectern" board | `user_id` PK, `classroom_id`, `surface`, `book_id`, `last_seen_at` | 0717 (lectern) |
| `student_access_codes` | COPPA code-only student login + QR badge tokens | `user_id` PK, `classroom_id`, `code` (unique), `code_prefix`, `badge_token_hash`, `badge_issued_at`, `badge_revoked_at` | 0716; badge cols 0718 |
| `school_seats` | Seat roster mapping School-tier subscriptions to teacher accounts | `subscription_user_id`→`subscriptions`, `teacher_id` (globally unique), `invite_email`, `invite_token`, `invited_at` (0714 pending) | 0709; 0714 (pending) |

### 1.5 Guided sessions & live quiz

| Table | Purpose | Key columns | Migrations |
|---|---|---|---|
| `guided_sessions` | Teacher-proctored, time-boxed reading/Trial sessions | `teacher_id`, `classroom_id`, `join_code`, `type`, `status`, `mode`, `hints_enabled` (0624), `annotations_enabled`, `annotation_visibility`, `presence_enabled` (0625), `station_progress` (0415 stations) | 0413; altered 0415, 0624, 0625; recursion fix 0719 |
| `guided_session_participants` | Per-student session state | UNIQUE `(session_id, student_id)`, `status`, `progress_pct`, `violation_count`, `score` | 0413; status widened 0415 |
| `guided_session_events` | Proctoring event log (realtime) | `session_id`, `student_id`, `event_type`, `payload` | 0413 |
| `guided_session_stations` | Multi-station guided mode (reading/quiz/reflection) | UNIQUE `(session_id, station_index)`, `type`, `teacher_quiz_id` (0622) | 0415; 0622 |
| `guided_session_messages` | Teacher↔student nudges/hints in a session | `sender_id`, `recipient_id` (NULL = broadcast), `message_type` | 0415 |
| `guided_session_reflections` | Station reflection essays | UNIQUE `(session_id, station_id, student_id)` | 0415 |
| `live_quiz_sessions` | Kahoot-style live game of a `teacher_quiz` | `classroom_id`, `quiz_id`, `host_id`, `status` (enum `live_quiz_status`), `current_question_index`, snapshot `book_id`/`difficulty`/`total_questions` | 0706 (live quiz) |
| `live_quiz_participants` | Lobby roster with server-maintained score | UNIQUE `(session_id, student_id)`, `display_name` (COPPA-safe snapshot), `score`, `correct_count`, `finalized_at` | 0706 |
| `live_quiz_answers` | One answer per question per student | UNIQUE `(session_id, question_index, student_id)`, `is_correct`, `points_awarded` (both server-computed) | 0706 |
| `semester_plans` / `semester_plan_weeks` / `semester_plan_items` | Virgil-drafted term plans; deploy provisions real assignments/quizzes/guided sessions | `teacher_id`, `class_id`, `status`; items carry provisioning FKs `teacher_quiz_id`, `guided_session_id`, `assignment_id` | 0623 |

### 1.6 Social, messaging, notifications, parents

| Table | Purpose | Key columns | Migrations |
|---|---|---|---|
| `friendships` | The social graph (replaces dropped `connections`) | `requester_id`, `addressee_id`, `status` enum; UNIQUE on unordered pair | 0630/12 |
| ~~`connections`~~ | Legacy friend graph | — | 0426; **dropped 0630/12** |
| `activities` | Community milestone feed (`book_started`, `trial_passed`, `seal_earned`, …) | `actor_id`, `type`, `visibility` (`private`<`friends`<`public`); write path = `record_activity()` RPC only | 0630/13 |
| `activity_reactions` | Reactions to feed items | `activity_id`, `user_id`, `kind` | 0630/13 |
| `reports` | Moderation queue (insert-only for clients) | `content_type`, `content_id`, `reporter_id`, `status` | 0630/13 |
| `activity_events` | **Legacy/parallel** social feed from the June clubs backend; policies call the now-broken `are_connected()` | `user_id`, `type`, `title`, `metadata` | 0629/12 |
| ~~`community_activity~~ **[base, legacy]** | Older activity table; still has an INSERT policy | `user_id` + payload | base; policy 0627 |
| `groups` / `group_members` / `group_posts` / `group_invites` / `group_schedule` | Unified social-group primitive; `kind` = `book_club` **or** `study_group` | `owner_id`, `privacy`, `book_id`; member `role`/`status` | 0701 |
| `group_goals` / `group_notes` | Study-group extensions on the `groups` primitive | `target_type` (`chapters`/`trials`/`minutes`); notes author/moderator model | 0702 |
| ~~`study_groups~~ / ~~`study_group_members~~ | Pre-foundation study groups | — | 0426; **dropped 0702** (verified 0 rows) |
| `book_clubs` / `club_members` / `club_discussions` / `club_discussion_reactions` / `club_reading_pace` | **Legacy/parallel** book-club stack, overlaps `groups (kind='book_club')` | `visibility`, `book_id` (loose text) | 0629/12 |
| `conversations` / `conversation_participants` / `messages` | Classroom-scoped direct messaging | `classroom_id`, `created_by`; `sender_id`, `body` | 0619 |
| `message_email_log` | Email debounce ledger (no client access by design) | PK `(conversation_id, profile_id)`, `last_emailed_at` | 0619 |
| `notifications` | In-app notification inbox; clients can never INSERT (RPC-only) | `recipient_id`, `actor_id`, `type` enum `notification_type`, `payload`; column grant `UPDATE(read_at)` only | 0630; message trigger 0715 |
| ~~`db_notifications~~ | Empty legacy table | — | **dropped 0630** |
| `notification_preferences` | Per-user email/notification prefs | `profile_id` PK | 0619 |
| `parent_links` | Consent-based parent→student link (structural non-auto-active consent) | `parent_id`, `student_id`, `status` (`pending`/`active`/`revoked`), `initiated_by`; UNIQUE pair | 0704 |
| `guardians` / `guardian_student_links` / `guardian_messages` | **Legacy/parallel** teacher-side parent directory (contact records, not linked accounts) | `teacher_id`, `email`, `delivery_status` | 0629/12 |
| `book_recommendations` | Friend-to-friend book recs | `sender_id`, `recipient_id`, `status` | 0426 |

### 1.7 Virgil (AI guide)

| Table | Purpose | Key columns | Migrations |
|---|---|---|---|
| `virgil_guided_sessions` | Reader's 1:1 Virgil guided-reading sessions (distinct from teacher `guided_sessions`) | `user_id`, `book_id`, `chapter`, `status` enum, `model_used`, `summary` | 0705 |
| `virgil_session_messages` | Full conversation turns for resume | `session_id`, `role` enum (`user`/`virgil`/`system`), `content`, `model` | 0705 |
| `virgil_usage` | Free-tier daily message counter | PK `(user_id, usage_date)`, `message_count`; written only by `consume_virgil_message()` | 0708 |
| `virgil_task_events` | Service-role-only teacher abuse-control ledger (task caps + regen caps) | `teacher_id`, `task`, `object_id`, `usage_date` | 0717 (virgil_secure) |
| (no table) | Guided-session collaborative annotations | Liveblocks Comments rooms; switches live on `guided_sessions` columns | 0625 |

### 1.8 Billing, leads & internal ledgers

| Table | Purpose | Key columns | Migrations |
|---|---|---|---|
| `subscriptions` | Stripe-synced subscription per purchasing account | `user_id` PK, `stripe_customer_id`, `stripe_subscription_id`, `tier` (`solo`/`family`/`school` per 0709), `seats`, `status` | 0706; 0709 |
| `stripe_events` | Webhook idempotency ledger | `id` (Stripe `evt_…`), `type`, `received_at` | 0707 |
| `demo_requests` | B2B lead capture for `/demo` | contact/qualification fields, `status` (`new`/`contacted`/`closed`), `ip`, `user_agent` | 0710 |
| `digest_runs` | Weekly-digest idempotency (one email per user per week) | PK `(user_id, week_start)` | 0629 |
| `login_attempts` | Rate-limit ledger for student code login | `code_prefix`, `ip`, `attempted_at` | 0716 |
| `cover_archive` | Internal manifest of culled cover paths (maintenance scripts only) | — | RLS enabled 0626 (table itself is [base]/out-of-band) |
| `cover_style_presets`, `cover_reference_assets`, `cover_batches`, `cover_briefs`, `cover_jobs`, `cover_candidates`, `cover_assets`, `cover_qa_results`, `cover_reviews`, `cover_publications`, `cover_audit_events` | Internal cover-generation pipeline ("cover factory v2") — batch→brief→job→candidate→asset→QA→review→publication, plus audit | per-stage FKs; `created_by`, `reviewer_id`, `published_by`, `actor_id` | 0621 |

---

## 2. Journey → table mapping

### 2.1 Reader progress, highlights, notes, shelves
- **Progress:** `reading_progress` (PK `(user_id, book_id)`; `chapter_index`, `page`/`scroll_ratio`, `paragraph_anchor`, `percent`). Written by `saveReadingPosition()` / `useReaderPrefsSync()` (`src/lib/reader/reader-sync.ts`); localStorage stays the instant/offline source of truth.
- **Highlights & notes:** `highlights` — `kind='highlight'` rows carry `selected_text` + offsets + `color` + free-text `note` (added 0619); `kind='bookmark'` rows carry `paragraph_anchor` + `label` (0717). Sharing to a class is opt-in via `shared` + `classroom_id` and the `highlights_shared_read` policy.
- **Shelves:** `shelf_items` (`favorites`/`want_to_read`/`completed`). `library_entries` is a separate "my library" list used by the recommendation accept flow.
- **Preferences:** `reading_preferences.prefs` (jsonb blob).
- **Recitation:** `recitation_progress`.

### 2.2 Quizzes / Trials and results
- **Question content:** `trials` (section-attached; legacy `kind` rows + six typed kinds in `type`/`content`), plus base-schema `quizzes`/`questions` (generated bank, hint ladders since 0624).
- **Results:** `quiz_results` — one row per attempt, written **only** through `public.record_trial_result(...)` (0714; direct client INSERT revoked). `wisdom_earned` is server-computed (tier rate: apprentice 5 / scholar 10 / master 15 per correct). `passed = score >= 60`.
- **Teacher quizzes:** `teacher_quizzes` → `teacher_quiz_questions` → `teacher_quiz_responses` (per-question, `graded_by` = `auto`/`virgil`/`teacher`) and base-schema `teacher_quiz_results` (aggregate completion).

### 2.3 Game economy — the actual names
- **Wisdom** = `user_stats.xp_total` (authoritative) + `profiles.total_xp` (cached mirror, written by `_economy_save`, kept for the weekly-digest cron and parent views). Also per-attempt `quiz_results.wisdom_earned` and per-unlock `achievement_unlocks.wisdom_awarded`.
- **Flame / streak** = `user_stats.current_streak` / `longest_streak` / `last_active_date` / `streak_freeze_available` (+ `profiles.current_streak` mirror). The word "flames" also exists as `trials.flames` (per-question metadata, default 1). There is **no `flames` table**.
- **Hearts & coins** = `user_stats.hearts` (regen 1/hr, cap 5) and `user_stats.coins` (streak freeze 10 coins, heart refill 15 coins), all mutated only by `economy_*` RPCs (0711).
- **Seals / achievements** = `achievement_unlocks` (new ledger; catalog in `src/data/achievements/`) **and** legacy base-schema `achievements` (still read by `parent_child_achievements` / `parent_child_activity` RPCs). Feed events use `activities.type = 'seal_earned'`.
- **Stoa** = `stoa_paintings` — a 1:1 painting-to-book reward gallery (`unlocking_book_id` UNIQUE, NOT NULL → `books.id`), public read; unlock evidence is derived from `quiz_results.passed` for that book (no separate unlock table).
- **Daily goal** = `user_stats.daily_goal_minutes` / `daily_progress_minutes` / `daily_progress_date`.
- All client mutations: `economy_sync`, `economy_award`, `economy_lose_heart`, `economy_add_minutes`, `economy_buy_streak_freeze`, `economy_use_streak_freeze`, `economy_refill_hearts`, `economy_set_daily_goal`, `record_trial_result`.

### 2.4 Classrooms, members, assignments, submissions, grades
- `classrooms` + `classroom_members` (single table for staff and students; role column; join code on the classroom row) + `classroom_announcements`.
- `assignments` (+ `assignment_targets` for scoped targeting) → `assignment_submissions` → `grades` → `grade_history` (trigger `trg_mirror_grade_to_history` mirrors every insert/update since 0709/16).
- Derived views come from RPCs, not tables: `classroom_gradebook(uuid)` (0703), `classroom_reading_board(uuid)` (0712), `classroom_wisdom_leaderboard(uuid)` (0713).
- Peer review: `peer_review_assignments` + `peer_reviews`. Sub-groups: `classroom_groups` + `classroom_group_members`.
- Live presence: `student_activity`. School billing seats: `school_seats`. Student login: `student_access_codes` (+ badge token columns).

### 2.5 Guided and live quiz sessions
- **Guided (proctored):** `guided_sessions` + `guided_session_participants` + `guided_session_events` + `guided_session_stations` + `guided_session_messages` + `guided_session_reflections`; quiz stations link to `teacher_quizzes`; responses land in `teacher_quiz_responses`.
- **Live quiz (Kahoot-style):** `live_quiz_sessions` + `live_quiz_participants` + `live_quiz_answers`; all writes through RPCs `join_live_quiz`, `submit_live_quiz_answer`, `finalize_live_quiz_for_me` — finalize consumes `record_trial_result`, so live results land in `quiz_results` through the same single authoritative path.

### 2.6 Semester plans
- `semester_plans` → `semester_plan_weeks` → `semester_plan_items`; items reference catalog books and, once deployed, the provisioned `teacher_quiz_id` / `guided_session_id` / `assignment_id`.

### 2.7 Notifications, groups, parent links
- **Notifications:** `notifications` (write path = `create_notification()` RPC only; clients get `SELECT` own + `UPDATE(read_at)`); prefs in `notification_preferences`; DM-triggered fanout via trigger `on_message_notify` (0715).
- **Groups:** `groups` + `group_members` + `group_posts` + `group_invites` + `group_schedule` + `group_goals` + `group_notes` (kind = `book_club` | `study_group`). Legacy parallel stacks: `book_clubs`/`club_*` and dropped `study_groups`.
- **Friends:** `friendships` + discovery RPCs `find_friend_candidate_by_handle` / `_by_code`.
- **Parents:** `parent_links` (consent state machine) + RPCs `is_active_parent_link`, `find_user_by_link_code`, `parent_child_overview`, `parent_child_activity`, `parent_child_achievements`. Legacy teacher-side directory: `guardians` + `guardian_student_links` + `guardian_messages`.

### 2.8 Virgil sessions / messages / usage
- Reader 1:1: `virgil_guided_sessions` + `virgil_session_messages` (realtime-published).
- Free-tier cap: `virgil_usage` + `consume_virgil_message(p_daily_limit)`.
- Teacher-side abuse ledger: `virgil_task_events` (service-role only).
- Generation provenance on `teacher_quizzes` (`generated_by_model`, `source_scope`, `generation_params`) and `semester_plans` (`generated_by_model`, `generation_params`); Virgil-graded drafts on `teacher_quiz_responses` (`ai_feedback`, `ai_rubric_breakdown`) with column-level read protection (0717).

### 2.9 Stripe subscriptions
- `subscriptions` (tiers `solo`/`family`/`school`; `seats` for school), `profiles.stripe_customer_id`, `stripe_events` (webhook idempotency), `school_seats` (seat→teacher mapping, pending invites via `invite_email`/`invite_token`). Webhook + checkout use the service role; clients have owner-`SELECT` only.

### 2.10 Demo requests
- `demo_requests`, written only by `POST /api/demo-request` (`src/app/api/demo-request/route.ts`) via the service-role admin client. Zod-validated, honeypot field (`company_website`), per-IP rate limit (5 per 10 min, best-effort — skipped when IP is unknown). RLS deny-by-default + `revoke all … from anon, authenticated`.

---

## 3. RLS inventory (final state after all 50 migrations)

Computed by replaying `CREATE POLICY` / `DROP POLICY IF EXISTS` / `ENABLE ROW LEVEL SECURITY` sequentially. Policy names quoted verbatim.

### 3.1 Tables with RLS enabled AND policies (client-facing, expected)

- **Owner-scoped personal data:** `user_stats` (read-own via base policies + RPC-only writes — see §4.4), `reading_progress` ("Users can view/insert/update/delete own reading progress" + `reading_progress_staff_select`), `reading_preferences`, `highlights` (owner CRUD + `highlights_shared_read`), `shelf_items` (4 owner policies), `recitation_progress`, `achievement_unlocks` ("Users can view/insert own achievement unlocks"), `quiz_results` ("Users can view own quiz results" only — no client write), `library_entries` (`library_entries_self_all`, `library_entries_friend_select`), `reading_preferences`.
- **Content (public read):** `works`, `sections`, `lines`, `stage_directions`, `glosses`, `scene_annotations`, `trials` — each exactly one `FOR SELECT USING (true)` policy ("Anyone can read …"); `stoa_paintings` (`stoa_paintings_public_read` + `stoa_paintings_service_write`).
- **Classroom:** `classrooms`, `classroom_members`, `assignments`, `assignment_submissions`, `classroom_announcements` (base-schema RLS; policies rewritten 0426), `assignment_targets`, `classroom_groups`, `classroom_group_members`, `grades`, `grade_history`, `peer_review_assignments`, `peer_reviews`, `student_activity`, `student_access_codes`, `school_seats` (`school_seats_select`), `teacher_quiz_responses`.
- **Guided/live:** `guided_sessions`, `guided_session_participants`, `guided_session_events`, `guided_session_stations`, `guided_session_messages`, `guided_session_reflections`; `live_quiz_sessions` (3 policies), `live_quiz_participants` / `live_quiz_answers` (SELECT-only — writes are RPC-only by design).
- **Social:** `friendships` (4), `activities` (`activities_select_visible` only — RPC-only writes), `activity_reactions` (3), `reports` (`reports_insert_own` only — no client read), `groups`, `group_members`, `group_posts`, `group_invites`, `group_schedule`, `group_goals`, `group_notes`, `book_recommendations`, `conversations`, `conversation_participants`, `messages`, `notifications`, `notification_preferences` (`notif_prefs_own`), `parent_links` (4), `book_clubs`, `club_members`, `club_discussions`, `club_discussion_reactions`, `club_reading_pace`, `guardians`, `guardian_student_links`, `guardian_messages`, `activity_events`, `connections` (dropped table — moot), `study_groups`/`study_group_members` (dropped — moot), `achievements`, `leaderboard`, `community_activity` (base-schema RLS; policies from 0627).
- **Virgil:** `virgil_guided_sessions` (4 owner policies), `virgil_session_messages` (2), `virgil_usage` (`virgil_usage_select_own`).
- **Semester:** `semester_plans`, `semester_plan_weeks`, `semester_plan_items` (teacher-manage + enrolled-student-read-active).
- **Billing:** `subscriptions` (`subscriptions_select_own`).
- **Cover factory:** all 11 `cover_*` v2 tables have `cover_service_all_*` (ALL, service role) and most also `cover_teacher_read_*` (SELECT).

### 3.2 RLS enabled with **zero policies** (deny-by-default)

| Table | Stated intent (from SQL comments) |
|---|---|
| `demo_requests` | Service-role only (API route); "deliberately NO client policies" |
| `stripe_events` | Webhook idempotency; service-role only |
| `digest_runs` | Weekly-digest cron idempotency; service-role only |
| `message_email_log` | Email debounce; "intentionally NO policies … reached only via SECURITY DEFINER RPC" |
| `login_attempts` | Student-login rate limiting; service-role only |
| `virgil_task_events` | Abuse-control ledger; service-role only |
| `cover_archive` | Maintenance-script manifest; service-role only |

These are all **intentional**, but they are also exactly the "RLS enabled, no policies" class the advisor flags — see §4.1/§4.7 for disposition.

### 3.3 Tables with policies but whose RLS enable is **not in this repo**
`achievements`, `leaderboard`, `community_activity`, `classrooms`, `classroom_members`, `assignments`, `assignment_submissions`, `classroom_announcements` — base-schema tables; their `ENABLE ROW LEVEL SECURITY` happened before/outside these migrations. Confirm on the live DB that RLS is actually enabled (the 0626 migration enabling RLS on `cover_archive` exists precisely because one such table was found with RLS **disabled** — "rls_disabled_in_public").

### 3.4 Tables with no RLS and no policies
None found among tables created in this repo (every `CREATE TABLE` in migrations has a matching `ENABLE ROW LEVEL SECURITY`). Base-schema tables not listed in §3.1–§3.3 (`profiles`, `books`, `chapters`, `quizzes`, `questions`, `annotations`, `user_stats`, `teacher_quizzes`, `teacher_quiz_questions`, `teacher_quiz_results`, `teacher_student_notes`, `authors`, `traditions`) have no policy statements in this repo at all — their RLS state is unverifiable from here and must be confirmed live.

---

## 4. Security-debt classification (master plan §18)

### 4.1 RLS-enabled internal tables with no policies
All seven in §3.2 are **intentional deny-by-default** and carry comments saying so. They are not vulnerabilities per se; the debt is that (a) they live in `public` (see 4.7) and (b) intent is documented only in SQL comments. Recommendation: keep, document as intentional exceptions in the hardening plan, and move to a non-exposed schema (`internal`/`private`) when the migration budget allows — that permanently clears the advisor class.

### 4.2 Broad INSERT behavior — demo requests
**Status in repo SQL: already remediated.** `20260710000000_demo_requests.sql` enables RLS with no policies and `revoke all on public.demo_requests from anon, authenticated`. The only write path is `POST /api/demo-request` using `createAdminClient()` (service role), with zod validation, a honeypot, and a per-IP cap (`RATE_LIMIT_MAX = 5` per 10 min). **Residual debt:** the rate limit is best-effort — skipped entirely when no IP header is present, and `x-forwarded-for` is client-spoofable unless the platform overwrites it; consider moving the counter into `login_attempts`-style DB ledger or edge middleware. If the live advisor still flags a broad `WITH CHECK (true)` INSERT on `demo_requests`, the live DB has drifted from the repo-of-record.

### 4.3 SECURITY DEFINER functions — search_path & grants
**Full inventory** (all in `public`):

| Function | search_path | EXECUTE granted to | Notes |
|---|---|---|---|
| `handle_new_user()` (trigger) | `''` | revoked from all (trigger-only) | seeds profiles/notification_preferences/user_stats |
| `_economy_normalize`, `_economy_touch` | *(none set — plpgsql volatile, no table access except via caller)* | not granted (internal) | composite-type helpers |
| `_economy_save`, `_economy_load` | `''` | not granted (internal) | row lock + mirror write |
| `economy_sync/award/lose_heart/add_minutes/buy_streak_freeze/use_streak_freeze/refill_hearts/set_daily_goal` | `''` | `authenticated` | **see 4.4** |
| `record_trial_result(text,int,text,int,int)` | `''` | `authenticated` | server-computed wisdom; sole `quiz_results` write path |
| `consume_virgil_message(int)` | `''` | `authenticated` (revoked from public/anon) | atomic daily cap |
| `create_notification(...)` | `''` | `authenticated, service_role` | sole `notifications` write path |
| `start_conversation(uuid,uuid[],text,text)` | `''` | `authenticated` (anon/PUBLIC revoked) | validates `shares_classroom` per recipient |
| `claim_email_slot(uuid,uuid,int)` | `''` | **service-role only** (revoked PUBLIC/anon/authenticated in 0620) | correct |
| `bump_conversation()` (trigger), `notify_message_recipients()` (trigger), `mirror_grade_to_history()` (trigger) | `''` | revoked / trigger-only | correct |
| `is_conversation_participant`, `can_access_classroom`, `shares_classroom`, `can_recommend_to` | `''` (`can_recommend_to` = `public` ⚠) | `authenticated` (anon/PUBLIC revoked 0620) | RLS helpers |
| `user_has_classroom_role(uuid,uuid,text[])` | **`public`** ⚠ (0426); not restated in later `create or replace` | `authenticated` | used by dozens of policies |
| `user_is_classroom_member(uuid,uuid)` | **`'public'`** ⚠ (0703/12) | `authenticated` | recursion-breaker |
| `is_group_member`, `is_group_moderator`, `group_is_visible` | `''` | `authenticated` | |
| `is_guided_session_teacher`, `is_guided_session_participant` | `''` | `authenticated` | 0719 recursion fix |
| `is_school_member` | `''` | (policy-internal; EXECUTE still default unless revoked — verify ⚠) | |
| `staff_can_view_student`, `classroom_reading_board`, `classroom_wisdom_leaderboard`, `classroom_gradebook` | `''` | `authenticated` | staff/member-gated aggregates |
| `group_trials_leaderboard` | `''` | `authenticated` | member-gated |
| `is_active_parent_link`, `find_user_by_link_code`, `parent_child_overview/activity/achievements` | `''` | `authenticated` (revoked from public) | active-link-gated |
| `find_friend_candidate_by_handle/_by_code` | `''` | `authenticated` | narrow discovery |
| `are_friends`, `is_student`, `record_activity(...)` | `''` | `authenticated` | |
| `are_connected(uuid,uuid)` (0629/12) | **`public`** ⚠ | `authenticated` | **BROKEN — queries dropped `connections` table (see 4.5)** |
| `is_club_member`, `is_club_manager`, `are_connected`, `is_guardian_of`-style helpers (0629/12) | **`public`** ⚠ | `authenticated` | clubs/guardians stack |
| `join_live_quiz`, `submit_live_quiz_answer`, `finalize_live_quiz_for_me` | `''` | `authenticated` | server-authoritative scoring |

**Debt items:**
1. **Inconsistent `search_path`:** the 0426/0629-era helpers use `set search_path = public` (`user_has_classroom_role`, `user_is_classroom_member`, `can_recommend_to`, `are_connected`, club helpers); everything newer uses `set search_path = ''`. `public` is exactly the schema-qualification risk §18 names — normalize all to `''` with fully-qualified references (bodies already qualify `public.`).
2. **`economy_award(p_xp, p_coins)` (0711) lets any authenticated user self-award arbitrary non-negative Wisdom/coins** with no server-side justification — unlike `record_trial_result`, which computes amounts itself. The client is the only caller and chooses the numbers. Leaderboards reading `quiz_results.wisdom_earned` are safe, but anything reading `user_stats.xp_total` / `profiles.total_xp` (dashboard, parent overview `total_wisdom`) is spoofable.
3. **`record_trial_result` has no rate cap:** inputs are clamped (≤500 questions, correct ≤ total) but calls are unlimited — ~7,500 Wisdom/call at master tier, unlimited calls/day, and each call inserts a `quiz_results` row. Add per-day call caps (e.g. via `virgil_usage`-style ledger) or idempotency keys.
4. **Default EXECUTE grants:** Postgres grants EXECUTE to PUBLIC on new functions; `20260620000000_harden_security_definer_grants.sql` cleaned up the functions existing at that date, but **functions created later (0630 onward) are mostly covered by explicit `revoke … from public` + targeted grants — except internal helpers like `_economy_load/_economy_save` and `is_school_member`, where no explicit revoke exists**. Verify and revoke EXECUTE from PUBLIC/anon on all definer functions not meant for clients.

### 4.4 Client-write revocation on economy tables (positive control)
`user_stats`: `revoke insert, update, delete … from authenticated/anon` (0711). `quiz_results`: `revoke insert … from authenticated/anon` + dropped "Users can insert own quiz results" (0714). `virgil_usage`, `demo_requests`, `stripe_events`, `school_seats`, `subscriptions`, `notifications`, `activities`, `parent_links`, `friendships`, `virgil_*` tables all revoke-then-minimally-grant. This is the model pattern the rebuild should keep.

### 4.5 Broken / stale / duplicated objects
1. **`public.are_connected()` is broken**: it queries `public.connections`, which `20260630120000_friendships.sql` drops (`drop table if exists public.connections cascade`). The `activity_events_select` / `activity_events_insert` policies on `activity_events` still call `are_connected(auth.uid(), user_id)` → **every policy evaluation on `activity_events` will raise at runtime** (or the table is dead). The 0630/13 migration itself calls `are_connected` "stale" and replaces it with `are_friends`, but nothing rewired `activity_events`.
2. **Duplicate subsystem — activity feeds:** `activities` (0630/13, RPC-gated, privacy enum) vs `activity_events` (0629/12, client-insertable, broken helper) vs base-schema `community_activity` (still has a live INSERT policy). Three feed tables; only `activities` is healthy.
3. **Duplicate subsystem — achievements:** `achievement_unlocks` (0415) vs base-schema `achievements` (read by parent RPCs, writable by clients per 0627 policies). `achievement_unlocks` is referenced in app code only by `src/lib/auth/deletion-cascade.ts` — the live unlock write path appears to still target the legacy table or app-side catalog logic; reconcile during rebuild.
4. **Duplicate subsystem — clubs/groups:** `groups (kind='book_club')` + `group_*` (0701/0702) vs `book_clubs` + `club_*` (0629/12). Both live with RLS. `study_groups`/`study_group_members` were already dropped in favor of `groups`.
5. **Duplicate subsystem — guardians:** `guardians`/`guardian_student_links`/`guardian_messages` (teacher-side contact directory) vs `parent_links` + dashboard RPCs (account-linked consent model). Overlapping intent, different models; pick one in the rebuild.
6. **`notification_type` enum drift:** `'message'` is cast in 0715 but absent from the enum DDL in 0630 — live value added out-of-band; repo-of-record is incomplete.

### 4.6 Indexes
1. **Genuine duplicate index:** `stoa_paintings` — `idx_stoa_paintings_book (unlocking_book_id)` duplicates the implicit index backing `CONSTRAINT stoa_unique_book UNIQUE (unlocking_book_id)`. Confirm equivalence, then drop the explicit one.
2. **Redundant single-column indexes fully covered by a UNIQUE/PK/composite with the same leading column** (drop candidates after equivalence check): `idx_guided_participants_session` (covered by UNIQUE `(session_id, student_id)`), `idx_guided_events_session` (covered by `idx_guided_events_session_student`), `idx_achievement_unlocks_user` (UNIQUE `(user_id, achievement_id)`), `idx_guided_stations_session` (UNIQUE `(session_id, station_index)`), `idx_trials_section` (covered by `idx_trials_section_position`), `library_entries_user_idx` (UNIQUE `(user_id, book_id)`), `idx_recitation_progress_user` (UNIQUE `(user_id, passage_id)`), `idx_tq_responses_student` (UNIQUE `(student_id, question_id, session_id)`), `idx_semester_plan_weeks_plan` (UNIQUE `(plan_id, week_index)`), `school_seats_subscription_idx` (UNIQUE `(subscription_user_id, teacher_id)`), `club_members_club_idx`, `club_reactions_discussion_idx` (covered by composite uniques in 0629/12). **Do NOT drop** partial indexes (`notifications_recipient_unread_idx … WHERE read_at IS NULL`, `group_members_group_idx … WHERE status='active'`, `group_invites_invitee_idx`, `groups_book_idx`) — they are not redundant.
3. **Unindexed foreign keys (heuristic; leading-column match, PK/UNIQUE counted):** the highest-value gaps are `live_quiz_sessions.classroom_id`, `live_quiz_sessions.quiz_id`, `live_quiz_sessions.host_id`, `live_quiz_participants.student_id`, `live_quiz_answers.student_id`, `teacher_quiz_responses.question_id`, `teacher_quiz_responses.participant_id`, `semester_plan_items.teacher_quiz_id` / `.guided_session_id` / `.assignment_id` / `.book_id`, `group_posts.author_id`, `group_invites.inviter_id`, `group_goals.created_by`, `group_notes.author_id`, `parent_links.initiated_by`, `student_access_codes.classroom_id` / `.created_by`, `student_activity.assignment_id`, `conversations.classroom_id` / `.created_by`, `conversation_participants.profile_id`, `messages.sender_id`, `guided_session_messages.sender_id` / `.recipient_id`, `guided_session_reflections.student_id`, `notifications.actor_id`, `reports.reporter_id`, `grade_history.changed_by`, `book_recommendations.book_id`, plus ~10 `cover_*` pipeline FKs. Per §18, add FK indexes **based on actual query patterns** (join paths in RPCs above are the strongest signal: live-quiz joins, semester deploy lookups, message sender lists).
4. **Repeated `auth.uid()` evaluation:** only the 0627 policies use the `(select auth.uid())` wrapped form; ~90% of policies call bare `auth.uid()` per row. Non-urgent perf item; rewrite hot-path policies (reading_progress, highlights, group_posts) first.
5. **Multiple permissive policies (same action OR-ed):** intentional but advisor-flagged pairs include `classrooms` (`classrooms_member_select` + `classrooms_teacher_id_select` + `classrooms_owner_coteacher_all`), `reading_progress` (own + `reading_progress_staff_select`), `highlights` (own + `highlights_shared_read`), `guided_sessions` (teacher ALL + student SELECT), `classroom_members` (`members_select` + write policies), `library_entries` (self_all + friend_select). Each is an explicit OR of distinct principals — document as intentional exceptions rather than merging.

### 4.7 Internal / quarantine tables in `public` schema
`stripe_events`, `digest_runs`, `message_email_log`, `login_attempts`, `virgil_task_events`, `cover_archive`, all 11 `cover_*` v2 pipeline tables, and (arguably) `demo_requests` are internal/service-only yet live in `public`, where PostgREST exposes them (RLS blocks rows, but the surface exists). Recommendation per §18: move to an `internal` schema (or at minimum revoke all + document exceptions). This is a structural fix, not a policy patch — schedule as its own migration series.

### 4.8 `exec-sql` Edge Function
**Not present in the repo.** There is no `supabase/functions/` directory at all, and a full-repo search for `exec-sql` / `exec_sql` returns zero matches. The live project's `exec-sql` function (flagged by the advisor) is deployed out-of-band. Action: audit/disable it from the Supabase dashboard; never recreate it as a general query endpoint. (Also not verifiable from SQL: leaked-password protection — an Auth dashboard setting; check during hardening.)

### 4.9 UPDATE policies missing `WITH CHECK` (§18 explicit rule)
`"Students update own participation"` (`guided_session_participants`), `"Students update own responses"` (`teacher_quiz_responses` — a student can rewrite `is_correct`/`score` subject to column grants), `assignments_owner_coteacher_update`, `submissions_student_update`, `submissions_staff_update`, `announcements_author_or_owner_update`, `grades_staff_update`, `peer_review_assignments_reviewer_update`, `book_recommendations_recipient_respond`, `connections_recipient_respond` (dropped table — moot), `conversations_participant_update`, and the whole 0629/12 clubs/guardians set (`book_clubs_update`, `club_members_manager_update`, `club_discussions_update`, `club_pace_update`, `guardians_update`, `guardian_links_update`, `guardian_messages_update`). Without `WITH CHECK`, a user who passes `USING` can move a row *out* of their own scope (e.g. change `student_id`). Prioritize `teacher_quiz_responses` and `assignment_submissions` — they touch grades.

### 4.10 Realtime surface
Tables added to `supabase_realtime`: `guided_session_events`, `guided_session_participants` (0413); `virgil_guided_sessions`, `virgil_session_messages` (0705); `live_quiz_sessions`, `live_quiz_participants`, `live_quiz_answers` (0706); `notifications` (0630); `friendships` (0630/12); `parent_links` (0704); `student_activity` (0717); `assignment_submissions`, `classroom_announcements`, `reading_progress` (pre-existing per 0717 lectern comments); `activities`, `activity_reactions` (0630/13). RLS gates row visibility on every one — no debt, but each new publication is an attack-surface increment to re-check.

---

## 5. Safe-to-reuse vs needs-new-table (rebuild features)

Master-plan rule applied: **only add a table after documenting why existing tables cannot represent the need.**

| Rebuild feature | Verdict | Rationale |
|---|---|---|
| **Wisdom** | ✅ Reuse `user_stats.xp_total` + `quiz_results.wisdom_earned` | Canonical since 0711/0714. Fix `economy_award` (server-side justification or remove in favor of task-specific RPCs) rather than adding storage. |
| **Flame (streak)** | ✅ Reuse `user_stats.current_streak` / `longest_streak` / `streak_freeze_available` (+ `profiles.current_streak` mirror) | Full streak/freeze/daily-goal logic already server-side. `trials.flames` exists for per-question flame metadata if the design needs per-Trial flame values. |
| **Seals (achievements)** | ✅ Reuse `achievement_unlocks`; **migrate/retire legacy `achievements`** | Two overlapping stores today. Point `parent_child_achievements`/`parent_child_activity` at `achievement_unlocks` (it has `unlocked_at`, `wisdom_awarded`; join catalog from app code) or keep a read-compat view during cutover. Do not create a third store. |
| **Stoa rewards** | ✅ Reuse `stoa_paintings` + `quiz_results.passed` | Catalog + 1:1 book constraint already enforced; unlock state derivable ("passed ≥1 Trial for book X"). **Only if** the design needs explicit per-user painting-unlock rows (e.g. unlock timestamps, alternate unlock sources) should a `stoa_unlocks (user_id, painting_id, unlocked_at, source)` table be added — document the derivation failure first. |
| **Journeys (guided reading paths)** | ⚠ Mostly derivable; one small table may be justified | Ordered path content belongs in static data/config (like the achievement catalog and `docs/monumental-literary-paths.md`). Per-user progress over a fixed path is derivable from `reading_progress` + `quiz_results`. A `journey_enrollments`/`journey_progress` table is justified **only** if journeys are user-reorderable, have non-book milestones, or need explicit enrollment state that derivation cannot produce. Decide after the journeys spec lands; default = no new table. |
| **Showcase / demo data** | ✅ Reuse existing tables with seeded fixture accounts | Nothing in the current schema blocks demo seeding: create fixture users/classrooms (`student_access_codes`, `classrooms`, `groups`) via service-role seed scripts. Do **not** add `demo_*` shadow tables; if a public read-only showcase surface is needed, expose it via a `security_invoker` view or dedicated read policy on real tables with a clearly-flagged demo classroom. |
| **Hearts/coins shop items** | ✅ Reuse `economy_*` RPC family | Adding a new purchasable = a new RPC on the same ledger, not a new table. |
| **Class leaderboards** | ✅ Reuse `classroom_wisdom_leaderboard` / `group_trials_leaderboard` RPCs | Both sum `quiz_results.wisdom_earned` server-side; safe post-0714. |
| **Virgil memory/history** | ✅ Reuse `virgil_guided_sessions` + `virgil_session_messages` | Owner-scoped RLS and realtime already in place. |
| **Parent/guardian view** | ⚠ Pick one model | Prefer `parent_links` + dashboard RPCs (consent-enforcing). Treat `guardians`/`guardian_messages` as legacy unless the teacher CRM use-case is explicitly retained. |
| **Book clubs / study groups** | ⚠ Pick one stack | Prefer `groups` + `group_*` (newer, unified). `book_clubs`/`club_*` is the legacy parallel stack. |

---

## 6. Appendix — key file references

- Economy SoT & RPCs: `supabase/migrations/20260711000000_user_stats_sot.sql`
- Trial write authority: `20260714000000_trial_result_authority.sql`
- Demo requests + API: `20260710000000_demo_requests.sql`, `src/app/api/demo-request/route.ts`
- Grant hardening: `20260620000000_harden_security_definer_grants.sql`, `20260627000000_tighten_social_rls.sql`
- Recursion fixes: `20260703120000_fix_classroom_members_rls_recursion.sql`, `20260719000000_fix_guided_sessions_rls_recursion.sql`
- Virgil hardening: `20260717000000_virgil_secure_hardening.sql`, `20260708000000_virgil_usage.sql`
- Generated types (stale): `src/lib/database.types.ts`
- Deletion cascade (table → user column map): `src/lib/auth/deletion-cascade.ts`
