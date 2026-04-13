"use client"

import { Trophy, Clock, AlertTriangle, Users, Target } from "lucide-react"
import type { GuidedSession, ParticipantWithProfile, SessionSummary } from "@/lib/guided-learning-types"

interface SessionSummaryViewProps {
  session: GuidedSession
  participants: ParticipantWithProfile[]
}

/**
 * Post-session summary view for teachers.
 * Shows aggregate stats and per-student breakdown.
 */
export function SessionSummaryView({ session, participants }: SessionSummaryViewProps) {
  const summary = session.summary_data as SessionSummary

  const stats = [
    {
      icon: Users,
      label: "Participants",
      value: `${summary.completed_count ?? 0}/${summary.total_participants ?? 0}`,
      sublabel: "completed",
    },
    {
      icon: Target,
      label: "Avg Progress",
      value: `${summary.avg_progress_pct ?? 0}%`,
      sublabel: "of content",
    },
    {
      icon: Trophy,
      label: "Avg Score",
      value: summary.avg_score !== null && summary.avg_score !== undefined
        ? `${summary.avg_score}%`
        : "N/A",
      sublabel: "on trials",
    },
    {
      icon: Clock,
      label: "Duration",
      value: summary.duration_seconds
        ? `${Math.floor(summary.duration_seconds / 60)}m`
        : "—",
      sublabel: "total time",
    },
    {
      icon: AlertTriangle,
      label: "Violations",
      value: String(summary.total_violations ?? 0),
      sublabel: "focus events",
    },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="text-center">
        <h1
          className="mb-2 text-3xl font-bold"
        >
          Session Complete
        </h1>
        <p className="text-sm opacity-60">
          {session.type === "chapter" ? "Reading" : "Trial"} session ended
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border p-4 text-center"
            style={{ borderColor: "rgba(128, 128, 128, 0.12)" }}
          >
            <stat.icon
              className="mx-auto mb-2 h-5 w-5"
              style={{ color: "var(--tome-indigo, #6366F1)" }}
            />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs opacity-50">{stat.sublabel}</p>
          </div>
        ))}
      </div>

      {/* Student breakdown table */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Student Results</h2>
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: "rgba(128, 128, 128, 0.12)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b text-left text-xs uppercase tracking-wider opacity-60"
                style={{ borderColor: "rgba(128, 128, 128, 0.1)" }}
              >
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Progress</th>
                <th className="px-4 py-3 text-right">Score</th>
                <th className="px-4 py-3 text-right">Violations</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr
                  key={p.id}
                  className="border-b last:border-0"
                  style={{ borderColor: "rgba(128, 128, 128, 0.06)" }}
                >
                  <td className="px-4 py-3 font-medium">
                    {p.profiles?.display_name ?? "Student"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor:
                          p.status === "submitted"
                            ? "rgba(45, 154, 71, 0.1)"
                            : p.status === "kicked"
                              ? "rgba(200, 74, 82, 0.1)"
                              : "rgba(128, 128, 128, 0.1)",
                        color:
                          p.status === "submitted"
                            ? "var(--tome-success, #2D9A47)"
                            : p.status === "kicked"
                              ? "var(--tome-error, #C84A52)"
                              : "inherit",
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{p.progress_pct}%</td>
                  <td className="px-4 py-3 text-right">
                    {p.score !== null ? `${p.score}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.violation_count > 0 ? (
                      <span style={{ color: "var(--tome-error, #C84A52)" }}>
                        {p.violation_count}
                      </span>
                    ) : (
                      "0"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
