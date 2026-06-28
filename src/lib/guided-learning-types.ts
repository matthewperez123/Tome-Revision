/**
 * Guided Learning Mode types and utilities.
 *
 * Proctored, time-boxed reading/quiz sessions where teachers monitor
 * student progress in real time. Supports multi-station sessions with
 * ordered queues of reading, quiz, and reflection tasks.
 */

// ── Session Types ───────────────────────────────────────────────────────────

export type GuidedSessionStatus =
  | "draft"
  | "scheduled"
  | "lobby"
  | "active"
  | "paused"
  | "ended"       // legacy — kept for backward compat, equivalent to "completed"
  | "completed"
  | "cancelled"

export type GuidedSessionMode = "strict" | "lenient"
export type GuidedSessionType = "chapter" | "trial"

export interface GuidedSession {
  id: string
  teacher_id: string
  classroom_id: string | null
  join_code: string
  type: GuidedSessionType
  book_id: string | null
  chapter_index: number | null
  trial_id: string | null
  time_limit_minutes: number
  mode: GuidedSessionMode
  status: GuidedSessionStatus
  starts_at: string | null
  ends_at: string | null
  paused_at: string | null
  created_at: string
  ended_at: string | null
  summary_data: SessionSummary
  // ── Collaborative annotations (added in 20260625 migration) ──
  annotations_enabled?: boolean
  annotation_visibility?: "collaborative" | "private_to_teacher"
  presence_enabled?: boolean
  // ── Multi-station fields (added in 20260415 migration) ──
  title?: string
  description?: string
  scheduled_start_at?: string | null
  actual_start_at?: string | null
  actual_end_at?: string | null
  duration_minutes?: number
  settings?: SessionSettings
  current_station_index?: number
  /** Populated by API joins — not stored in the sessions table */
  stations?: Station[]
}

export interface SessionSummary {
  total_participants?: number
  completed_count?: number
  avg_progress_pct?: number
  avg_score?: number | null
  total_violations?: number
  duration_seconds?: number
  /** Per-station breakdowns (added in multi-station expansion) */
  stations?: Array<{
    station_index: number
    station_type: StationType
    avg_progress_pct: number
    completion_count: number
  }>
  hints_total?: number
}

// ── Station Types ─────────────────────────────────────────────────────────

export type StationType = "reading" | "quiz" | "reflection"

export interface Station {
  id: string
  session_id: string
  station_index: number
  type: StationType
  title: string | null
  book_id: string | null
  chapter_start: number | null
  chapter_end: number | null
  section_range: { startSection: string; endSection: string } | null
  quiz_id: string | null
  /** Reference to a Virgil-authored teacher_quiz (quiz stations). */
  teacher_quiz_id: string | null
  quiz_config: QuizConfig | null
  reflection_prompt: string | null
  min_words: number | null
  target_minutes: number
  require_completion: boolean
  settings: Record<string, unknown>
}

/** Configuration for an ad-hoc quiz created inline during session setup. */
export interface QuizConfig {
  question_count: number
  difficulty: "foundational" | "scholar" | "sage"
  time_per_question_seconds?: number
  question_types?: Array<"multiple_choice" | "true_false" | "fill_blank" | "short_answer">
}

// ── Session Settings ──────────────────────────────────────────────────────

export interface SessionSettings {
  allowEarlyExit: boolean
  hintBudgetPerStudent: number | null   // null = unlimited
  showOtherStudentsProgress: boolean
  autoAdvance: boolean                  // auto-move to next station on completion
  lockNavigation: boolean               // dim sidebar, block navigation
  pauseOnTeacherDisconnect: boolean
}

// ── Station Progress ──────────────────────────────────────────────────────

export interface StationProgress {
  station_index: number
  progress_pct: number
  score: number | null
  started_at: string | null
  completed_at: string | null
}

// ── Message Types ─────────────────────────────────────────────────────────

export type MessageType = "hint" | "nudge" | "announcement" | "praise" | "instruction"

export interface SessionMessage {
  id: string
  session_id: string
  sender_id: string
  recipient_id: string | null   // null = broadcast to all
  message_type: MessageType
  content: string
  station_index: number | null
  created_at: string
}

// ── Reflection Types ──────────────────────────────────────────────────────

export interface Reflection {
  id: string
  session_id: string
  station_id: string
  student_id: string
  content: string
  word_count: number
  submitted_at: string | null
  created_at: string
}

// ── Participant Types ───────────────────────────────────────────────────────

export type ParticipantStatus =
  | "invited"
  | "lobby"
  | "joined"
  | "active"
  | "submitted"
  | "completed"
  | "exited"
  | "kicked"

export interface GuidedSessionParticipant {
  id: string
  session_id: string
  student_id: string
  status: ParticipantStatus
  joined_at: string
  submitted_at: string | null
  progress_pct: number
  violation_count: number
  score: number | null
  // ── Multi-station fields ──
  current_station_index?: number
  hints_used?: number
  station_progress?: Record<number, StationProgress>
}

/** Participant with profile info joined from the profiles table */
export interface ParticipantWithProfile extends GuidedSessionParticipant {
  profiles?: {
    display_name: string | null
    username: string | null
    avatar_url: string | null
  }
}

// ── Event Types ─────────────────────────────────────────────────────────────

export type SessionEventType =
  | "focus_lost"
  | "focus_regained"
  | "fullscreen_exit"
  | "page_turn"
  | "quiz_answer"
  | "violation"
  | "submit"
  | "message_received"
  | "progress_update"
  | "idle"
  // ── Multi-station events ──
  | "station_started"
  | "station_completed"
  | "reflection_saved"
  | "hint_requested"
  | "hint_received"
  | "station_advanced"

export interface GuidedSessionEvent {
  id: string
  session_id: string
  student_id: string
  event_type: SessionEventType
  payload: Record<string, unknown>
  created_at: string
}

// ── Presence Types ──────────────────────────────────────────────────────────

export type FocusState = "focused" | "blurred" | "violation"

export interface GuidedPresence {
  studentId: string
  studentName: string
  focusState: FocusState
  progressPct: number
  lastActivity: string
}

// ── Teacher Control Actions ─────────────────────────────────────────────────

export type ControlAction =
  | "pause"
  | "resume"
  | "extend"
  | "kick"
  | "message"
  // ── Multi-station actions ──
  | "advance_station"
  | "advance_student"
  | "release"

export interface ControlRequest {
  action: ControlAction
  /** Extra minutes for "extend" action */
  minutes?: number
  /** Target student_id for "kick", "advance_student", or "release" actions */
  student_id?: string
  /** Message text for "message" action */
  message?: string
  /** Message type for "message" action */
  message_type?: MessageType
  /** Recipient student_id for targeted messages (null = broadcast) */
  recipient_id?: string | null
}

// ── Wizard Step Types ─────────────────────────────────────────────────────

export type WizardStep = "basics" | "stations" | "roster" | "settings" | "review"

export const WIZARD_STEPS: { key: WizardStep; label: string }[] = [
  { key: "basics", label: "Basics" },
  { key: "stations", label: "Stations" },
  { key: "roster", label: "Roster" },
  { key: "settings", label: "Settings" },
  { key: "review", label: "Review" },
]

/** Draft station used in the creation wizard before saving to DB. */
export interface DraftStation {
  id: string               // client-side UUID for drag-and-drop keying
  type: StationType
  title: string
  book_id: string | null
  book_title?: string      // display only
  chapter_start: number | null
  chapter_end: number | null
  section_range: { startSection: string; endSection: string } | null
  quiz_id: string | null
  /** Reference to a Virgil-authored teacher_quiz (quiz stations). */
  teacher_quiz_id: string | null
  /** Display-only summary of the generated quiz, e.g. "8 questions · scholar". */
  teacher_quiz_summary?: string
  quiz_config: QuizConfig | null
  reflection_prompt: string | null
  min_words: number | null
  target_minutes: number
  require_completion: boolean
}

// ── Timer Phases ────────────────────────────────────────────────────────────

export type TimerPhase = "normal" | "warning" | "critical"

// ── Time Limit Presets ──────────────────────────────────────────────────────

export const TIME_LIMIT_PRESETS = [5, 15, 30, 45, 60, 90] as const

// ── Join Code Utility ───────────────────────────────────────────────────────

const JOIN_CODE_CHARS = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ" // no I, O (avoid confusion)

/**
 * Generate a 6-character join code in the format LAUREL-XXX
 * where XXX is 3 random alphanumeric characters.
 */
export function generateJoinCode(): string {
  const arr = new Uint8Array(3)
  crypto.getRandomValues(arr)
  const code = Array.from(arr)
    .map((b) => JOIN_CODE_CHARS[b % JOIN_CODE_CHARS.length])
    .join("")
  return `LAUREL-${code}`
}

/**
 * Validate a join code has the correct format.
 */
export function isValidJoinCode(code: string): boolean {
  return /^LAUREL-[0-9A-HJ-NP-Z]{3}$/i.test(code)
}

/**
 * Normalize a join code to uppercase with the LAUREL- prefix.
 * Accepts "LAUREL-XXX", "laurel-xxx", or just "XXX".
 */
export function normalizeJoinCode(input: string): string {
  const trimmed = input.trim().toUpperCase()
  if (trimmed.startsWith("LAUREL-")) return trimmed
  if (/^[0-9A-HJ-NP-Z]{3}$/.test(trimmed)) return `LAUREL-${trimmed}`
  return trimmed
}
