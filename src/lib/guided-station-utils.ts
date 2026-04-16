/**
 * Guided Mode station utilities.
 *
 * Pure functions for computing station progress, checking completion,
 * ordering stations, and aggregating session analytics.
 */

import type {
  Station,
  StationProgress,
  GuidedSession,
  GuidedSessionParticipant,
  SessionSettings,
} from "./guided-learning-types"

// ── Station Progress ──────────────────────────────────────────────────────────

/**
 * Compute the progress percentage for a station based on its type.
 *
 * - reading: % of chapters read (derived from current position within range)
 * - quiz: % of questions answered
 * - reflection: word count / min_words (capped at 100)
 */
export function computeStationProgress(
  station: Station,
  data: {
    chaptersRead?: number
    totalChapters?: number
    questionsAnswered?: number
    totalQuestions?: number
    wordCount?: number
  }
): number {
  switch (station.type) {
    case "reading": {
      const total = data.totalChapters ?? 1
      const read = data.chaptersRead ?? 0
      return Math.min(100, Math.round((read / total) * 100))
    }
    case "quiz": {
      const total = data.totalQuestions ?? 1
      const answered = data.questionsAnswered ?? 0
      return Math.min(100, Math.round((answered / total) * 100))
    }
    case "reflection": {
      const min = station.min_words ?? 50
      const count = data.wordCount ?? 0
      return Math.min(100, Math.round((count / min) * 100))
    }
    default:
      return 0
  }
}

// ── Station Completion ────────────────────────────────────────────────────────

/**
 * Check whether a station's completion criteria are met.
 */
export function isStationComplete(
  station: Station,
  progress: StationProgress
): boolean {
  if (!station.require_completion) {
    // If completion is not required, any progress counts as done
    // once the student explicitly marks it or time runs out
    return progress.completed_at != null
  }

  // For required completion, check progress reached 100%
  return progress.progress_pct >= 100 || progress.completed_at != null
}

// ── Station Navigation ────────────────────────────────────────────────────────

/**
 * Get the next station in the queue, or null if at the end.
 */
export function getNextStation(
  stations: Station[],
  currentIndex: number
): Station | null {
  const sorted = [...stations].sort((a, b) => a.station_index - b.station_index)
  const nextIdx = sorted.findIndex((s) => s.station_index > currentIndex)
  return nextIdx >= 0 ? sorted[nextIdx] : null
}

/**
 * Get a station by its index.
 */
export function getStationByIndex(
  stations: Station[],
  index: number
): Station | null {
  return stations.find((s) => s.station_index === index) ?? null
}

/**
 * Get the total target minutes across all stations.
 */
export function getTotalStationMinutes(stations: Station[]): number {
  return stations.reduce((sum, s) => sum + s.target_minutes, 0)
}

// ── Session Summary ───────────────────────────────────────────────────────────

export interface StationSummary {
  station_index: number
  station_type: Station["type"]
  title: string | null
  avg_progress_pct: number
  avg_time_seconds: number
  completion_count: number
  total_participants: number
}

export interface FullSessionSummary {
  total_participants: number
  completed_count: number
  avg_progress_pct: number
  avg_score: number | null
  total_violations: number
  duration_seconds: number
  stations: StationSummary[]
  hints_total: number
}

/**
 * Compute a full session summary from participants and stations.
 */
export function computeSessionSummary(
  session: GuidedSession,
  participants: GuidedSessionParticipant[],
  stations: Station[]
): FullSessionSummary {
  const activeParticipants = participants.filter(
    (p) => p.status !== "invited" && p.status !== "kicked"
  )

  const completedCount = activeParticipants.filter(
    (p) => p.status === "completed" || p.status === "submitted"
  ).length

  const avgProgress =
    activeParticipants.length > 0
      ? Math.round(
          activeParticipants.reduce((s, p) => s + p.progress_pct, 0) /
            activeParticipants.length
        )
      : 0

  const scores = activeParticipants
    .map((p) => p.score)
    .filter((s): s is number => s != null)
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null

  const totalViolations = activeParticipants.reduce(
    (s, p) => s + p.violation_count,
    0
  )

  const hintsTotal = activeParticipants.reduce(
    (s, p) => s + (p.hints_used ?? 0),
    0
  )

  const durationSeconds = session.actual_start_at && session.actual_end_at
    ? Math.round(
        (new Date(session.actual_end_at).getTime() -
          new Date(session.actual_start_at).getTime()) /
          1000
      )
    : 0

  // Per-station summaries
  const stationSummaries: StationSummary[] = stations
    .sort((a, b) => a.station_index - b.station_index)
    .map((station) => {
      const stationParticipants = activeParticipants.filter((p) => {
        const sp = parseStationProgress(p.station_progress)
        return sp[station.station_index] != null
      })

      const stationProgressValues = stationParticipants.map((p) => {
        const sp = parseStationProgress(p.station_progress)
        return sp[station.station_index]?.progress_pct ?? 0
      })

      const stationCompletedCount = stationParticipants.filter((p) => {
        const sp = parseStationProgress(p.station_progress)
        return sp[station.station_index]?.completed_at != null
      }).length

      return {
        station_index: station.station_index,
        station_type: station.type,
        title: station.title,
        avg_progress_pct:
          stationProgressValues.length > 0
            ? Math.round(
                stationProgressValues.reduce((a, b) => a + b, 0) /
                  stationProgressValues.length
              )
            : 0,
        avg_time_seconds: 0, // computed from events if needed
        completion_count: stationCompletedCount,
        total_participants: activeParticipants.length,
      }
    })

  return {
    total_participants: activeParticipants.length,
    completed_count: completedCount,
    avg_progress_pct: avgProgress,
    avg_score: avgScore,
    total_violations: totalViolations,
    duration_seconds: durationSeconds,
    stations: stationSummaries,
    hints_total: hintsTotal,
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Parse the station_progress JSONB field from a participant record.
 * Expected shape: Record<number, StationProgress>
 */
export function parseStationProgress(
  raw: unknown
): Record<number, StationProgress> {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<number, StationProgress>
  }
  return {}
}

/**
 * Get the default session settings.
 */
export function getDefaultSessionSettings(): SessionSettings {
  return {
    allowEarlyExit: true,
    hintBudgetPerStudent: null,
    showOtherStudentsProgress: false,
    autoAdvance: true,
    lockNavigation: true,
    pauseOnTeacherDisconnect: true,
  }
}

/**
 * Parse the settings JSONB field from a session, merging with defaults.
 */
export function parseSessionSettings(raw: unknown): SessionSettings {
  const defaults = getDefaultSessionSettings()
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return { ...defaults, ...(raw as Partial<SessionSettings>) }
  }
  return defaults
}

// ── Station Type Labels ───────────────────────────────────────────────────────

export const STATION_TYPE_LABELS: Record<Station["type"], string> = {
  reading: "Reading",
  quiz: "Quiz",
  reflection: "Reflection",
}

export const STATION_TYPE_ICONS: Record<Station["type"], string> = {
  reading: "book-open",
  quiz: "brain",
  reflection: "pen-tool",
}
