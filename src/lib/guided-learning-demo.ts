/**
 * Demo/local-first state management for Guided Learning sessions.
 * Stores sessions in localStorage so the full create → monitor → end
 * flow works without Supabase auth.
 */

import { generateJoinCode } from "@/lib/guided-learning-types"
import type {
  GuidedSession,
  GuidedSessionType,
  GuidedSessionMode,
  GuidedSessionStatus,
  ParticipantWithProfile,
  GuidedSessionEvent,
  SessionSummary,
} from "@/lib/guided-learning-types"

const STORAGE_KEY = "tome-guided-sessions"

// ── Storage Helpers ─────────────────────────────────────────────────────────

function loadSessions(): Map<string, DemoSession> {
  if (typeof window === "undefined") return new Map()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Map()
    const arr: DemoSession[] = JSON.parse(raw)
    return new Map(arr.map((s) => [s.session.id, s]))
  } catch {
    return new Map()
  }
}

function saveSessions(sessions: Map<string, DemoSession>) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(sessions.values())))
}

// ── Types ───────────────────────────────────────────────────────────────────

export interface DemoSession {
  session: GuidedSession
  participants: ParticipantWithProfile[]
  events: GuidedSessionEvent[]
  bookTitle?: string
  bookAuthor?: string
}

export interface CreateDemoSessionInput {
  type: GuidedSessionType
  bookId?: string
  bookTitle?: string
  bookAuthor?: string
  chapterIndex?: number
  trialId?: string
  timeLimitMinutes: number
  students: Array<{ id: string; name: string; avatarColor: string }>
}

// ── CRUD ────────────────────────────────────────────────────────────────────

export function createDemoSession(input: CreateDemoSessionInput): DemoSession {
  const sessions = loadSessions()
  const id = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

  const session: GuidedSession = {
    id,
    teacher_id: "demo-teacher",
    classroom_id: null,
    join_code: generateJoinCode(),
    type: input.type,
    book_id: input.bookId ?? null,
    chapter_index: input.chapterIndex ?? null,
    trial_id: input.trialId ?? null,
    time_limit_minutes: input.timeLimitMinutes,
    mode: "strict",
    status: "lobby",
    starts_at: null,
    ends_at: null,
    paused_at: null,
    created_at: new Date().toISOString(),
    ended_at: null,
    summary_data: {},
  }

  const participants: ParticipantWithProfile[] = input.students.map((s) => ({
    id: `part-${s.id}`,
    session_id: id,
    student_id: s.id,
    status: "lobby",
    joined_at: new Date().toISOString(),
    submitted_at: null,
    progress_pct: 0,
    violation_count: 0,
    score: null,
    profiles: {
      display_name: s.name,
      username: s.name.toLowerCase().replace(/\s/g, "."),
      avatar_url: null,
    },
  }))

  const demo: DemoSession = {
    session,
    participants,
    events: [],
    bookTitle: input.bookTitle,
    bookAuthor: input.bookAuthor,
  }

  sessions.set(id, demo)
  saveSessions(sessions)
  return demo
}

export function getDemoSession(id: string): DemoSession | null {
  return loadSessions().get(id) ?? null
}

export function getAllDemoSessions(): DemoSession[] {
  return Array.from(loadSessions().values()).sort(
    (a, b) => new Date(b.session.created_at).getTime() - new Date(a.session.created_at).getTime(),
  )
}

export function updateDemoSessionStatus(id: string, status: GuidedSessionStatus) {
  const sessions = loadSessions()
  const demo = sessions.get(id)
  if (!demo) return null

  demo.session.status = status

  if (status === "active") {
    const now = new Date()
    demo.session.starts_at = now.toISOString()
    demo.session.ends_at = new Date(
      now.getTime() + demo.session.time_limit_minutes * 60 * 1000,
    ).toISOString()
    demo.participants = demo.participants.map((p) => ({ ...p, status: "active" }))
  }

  if (status === "paused") {
    demo.session.paused_at = new Date().toISOString()
  }

  if (status === "ended") {
    demo.session.ended_at = new Date().toISOString()
    // Compute summary
    const total = demo.participants.length
    const completed = demo.participants.filter((p) => p.status === "submitted").length
    const avgProgress = total > 0
      ? Math.round(demo.participants.reduce((s, p) => s + p.progress_pct, 0) / total)
      : 0
    const scores = demo.participants.filter((p) => p.score !== null).map((p) => p.score!)
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : null
    const totalViolations = demo.participants.reduce((s, p) => s + p.violation_count, 0)

    demo.session.summary_data = {
      total_participants: total,
      completed_count: completed,
      avg_progress_pct: avgProgress,
      avg_score: avgScore,
      total_violations: totalViolations,
      duration_seconds: demo.session.starts_at
        ? Math.round((Date.now() - new Date(demo.session.starts_at).getTime()) / 1000)
        : 0,
    } satisfies SessionSummary

    // Mark remaining active participants as submitted
    demo.participants = demo.participants.map((p) =>
      p.status === "active" || p.status === "lobby"
        ? { ...p, status: "submitted" as const, submitted_at: new Date().toISOString() }
        : p,
    )
  }

  sessions.set(id, demo)
  saveSessions(sessions)
  return demo
}

export function extendDemoSession(id: string, minutes: number) {
  const sessions = loadSessions()
  const demo = sessions.get(id)
  if (!demo || !demo.session.ends_at) return null

  demo.session.ends_at = new Date(
    new Date(demo.session.ends_at).getTime() + minutes * 60 * 1000,
  ).toISOString()

  sessions.set(id, demo)
  saveSessions(sessions)
  return demo
}

export function resumeDemoSession(id: string) {
  const sessions = loadSessions()
  const demo = sessions.get(id)
  if (!demo || demo.session.status !== "paused") return null

  // Extend ends_at by the paused duration
  if (demo.session.paused_at && demo.session.ends_at) {
    const pauseDuration = Date.now() - new Date(demo.session.paused_at).getTime()
    demo.session.ends_at = new Date(
      new Date(demo.session.ends_at).getTime() + pauseDuration,
    ).toISOString()
  }

  demo.session.status = "active"
  demo.session.paused_at = null

  sessions.set(id, demo)
  saveSessions(sessions)
  return demo
}

export function kickDemoParticipant(sessionId: string, studentId: string) {
  const sessions = loadSessions()
  const demo = sessions.get(sessionId)
  if (!demo) return null

  demo.participants = demo.participants.map((p) =>
    p.student_id === studentId ? { ...p, status: "kicked" as const } : p,
  )

  sessions.set(sessionId, demo)
  saveSessions(sessions)
  return demo
}

/**
 * Simulate student progress — for demo, randomly advance participants.
 */
export function simulateDemoProgress(sessionId: string) {
  const sessions = loadSessions()
  const demo = sessions.get(sessionId)
  if (!demo || demo.session.status !== "active") return null

  demo.participants = demo.participants.map((p) => {
    if (p.status !== "active") return p
    const advance = Math.floor(Math.random() * 8) + 1
    const newProgress = Math.min(100, p.progress_pct + advance)
    const completed = newProgress >= 100
    return {
      ...p,
      progress_pct: newProgress,
      status: completed ? ("submitted" as const) : p.status,
      submitted_at: completed ? new Date().toISOString() : p.submitted_at,
      score: completed ? Math.floor(Math.random() * 30) + 70 : p.score,
    }
  })

  sessions.set(sessionId, demo)
  saveSessions(sessions)
  return demo
}
