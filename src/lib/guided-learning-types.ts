/**
 * Guided Learning Mode types and utilities.
 *
 * Proctored, time-boxed reading/quiz sessions where teachers monitor
 * student progress in real time.
 */

// ── Session Types ───────────────────────────────────────────────────────────

export type GuidedSessionStatus = "lobby" | "active" | "paused" | "ended"
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
}

export interface SessionSummary {
  total_participants?: number
  completed_count?: number
  avg_progress_pct?: number
  avg_score?: number | null
  total_violations?: number
  duration_seconds?: number
}

// ── Participant Types ───────────────────────────────────────────────────────

export type ParticipantStatus = "lobby" | "active" | "submitted" | "kicked"

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

export type ControlAction = "pause" | "resume" | "extend" | "kick" | "message"

export interface ControlRequest {
  action: ControlAction
  /** Extra minutes for "extend" action */
  minutes?: number
  /** Target student_id for "kick" action */
  student_id?: string
  /** Message text for "message" action */
  message?: string
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
