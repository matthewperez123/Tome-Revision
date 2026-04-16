"use client"

import { useState } from "react"
import {
  Clock, Users, BookOpen, Brain, PenTool, Award, AlertTriangle,
  Feather, MessageSquare, Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type {
  GuidedSession, Station, ParticipantWithProfile,
  SessionMessage, Reflection, StationType,
} from "@/lib/guided-learning-types"
import { STATION_TYPE_LABELS, parseStationProgress } from "@/lib/guided-station-utils"

const STATION_ICONS: Record<StationType, typeof BookOpen> = {
  reading: BookOpen,
  quiz: Brain,
  reflection: PenTool,
}

interface Props {
  session: GuidedSession
  stations: Station[]
  participants: ParticipantWithProfile[]
  messages: SessionMessage[]
  reflections: Reflection[]
  isTeacher: boolean
}

export function SessionReviewDashboard({
  session,
  stations,
  participants,
  messages,
  reflections,
  isTeacher,
}: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "stations" | "messages">("overview")

  const completedCount = participants.filter(
    (p) => p.status === "completed" || p.status === "submitted",
  ).length
  const avgProgress = participants.length > 0
    ? Math.round(participants.reduce((s, p) => s + p.progress_pct, 0) / participants.length)
    : 0
  const totalViolations = participants.reduce((s, p) => s + p.violation_count, 0)
  const totalHints = participants.reduce((s, p) => s + (p.hints_used ?? 0), 0)

  const durationMinutes = session.actual_start_at && session.actual_end_at
    ? Math.round(
        (new Date(session.actual_end_at).getTime() - new Date(session.actual_start_at).getTime()) / 60000,
      )
    : session.duration_minutes ?? session.time_limit_minutes

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{session.title ?? "Session Review"}</h1>
        <p className="mt-1 text-sm opacity-50">
          {session.description ?? "Post-session analytics and review"}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Clock} label="Duration" value={`${durationMinutes}m`} />
        <StatCard icon={Users} label="Completed" value={`${completedCount}/${participants.length}`} />
        <StatCard icon={Award} label="Avg Progress" value={`${avgProgress}%`} />
        <StatCard icon={Feather} label="Hints Used" value={String(totalHints)} />
      </div>

      {/* Tabs */}
      {isTeacher && (
        <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
          {(["overview", "students", "stations", "messages"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors"
              style={{
                backgroundColor: activeTab === tab ? "var(--background)" : "transparent",
                boxShadow: activeTab === tab ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                color: activeTab === tab ? "inherit" : "rgba(128,128,128,0.6)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Station breakdown */}
          <div className="rounded-xl border p-4" style={{ borderColor: "rgba(128,128,128,0.12)" }}>
            <h3 className="mb-3 text-sm font-semibold">Station Breakdown</h3>
            <div className="space-y-3">
              {stations.map((station) => {
                const Icon = STATION_ICONS[station.type]
                const stationParticipants = participants.filter((p) => {
                  const sp = parseStationProgress(p.station_progress)
                  return sp[station.station_index]?.completed_at != null
                })
                return (
                  <div key={station.id} className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0 opacity-40" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {station.title || STATION_TYPE_LABELS[station.type]}
                      </p>
                      <p className="text-xs opacity-40">
                        {stationParticipants.length}/{participants.length} completed
                      </p>
                    </div>
                    <span className="text-xs opacity-40">{station.target_minutes}m</span>
                  </div>
                )
              })}
            </div>
          </div>

          {totalViolations > 0 && (
            <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: "rgba(200,74,82,0.06)" }}>
              <AlertTriangle className="h-4 w-4" style={{ color: "var(--tome-error, #C84A52)" }} />
              <span>{totalViolations} total violation{totalViolations !== 1 ? "s" : ""} across all students</span>
            </div>
          )}
        </div>
      )}

      {activeTab === "students" && isTeacher && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "rgba(128,128,128,0.12)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs opacity-50" style={{ borderColor: "rgba(128,128,128,0.08)" }}>
                <th className="px-4 py-2">Student</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Progress</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Hints</th>
                <th className="px-4 py-2">Violations</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={p.id} className="border-b last:border-0" style={{ borderColor: "rgba(128,128,128,0.06)" }}>
                  <td className="px-4 py-2 font-medium">
                    {p.profiles?.display_name ?? p.profiles?.username ?? "Student"}
                  </td>
                  <td className="px-4 py-2 capitalize opacity-60">{p.status}</td>
                  <td className="px-4 py-2">{p.progress_pct}%</td>
                  <td className="px-4 py-2">{p.score ?? "—"}</td>
                  <td className="px-4 py-2">{p.hints_used ?? 0}</td>
                  <td className="px-4 py-2">{p.violation_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "stations" && isTeacher && (
        <div className="space-y-4">
          {stations.map((station) => {
            const stationReflections = reflections.filter((r) => r.station_id === station.id)
            return (
              <div key={station.id} className="rounded-xl border p-4" style={{ borderColor: "rgba(128,128,128,0.12)" }}>
                <div className="flex items-center gap-2 mb-3">
                  {(() => { const Icon = STATION_ICONS[station.type]; return <Icon className="h-4 w-4 opacity-50" /> })()}
                  <h3 className="text-sm font-semibold">
                    Station {station.station_index + 1}: {station.title || STATION_TYPE_LABELS[station.type]}
                  </h3>
                </div>
                {station.type === "reflection" && stationReflections.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold opacity-40">Reflections ({stationReflections.length})</p>
                    {stationReflections.map((r) => {
                      const student = participants.find((p) => p.student_id === r.student_id)
                      return (
                        <div key={r.id} className="rounded-lg bg-muted/30 px-3 py-2">
                          <p className="text-xs font-medium opacity-50">
                            {student?.profiles?.display_name ?? "Student"} — {r.word_count} words
                          </p>
                          <p className="mt-1 text-sm" style={{ fontFamily: "var(--font-serif)" }}>
                            {r.content.slice(0, 200)}{r.content.length > 200 ? "..." : ""}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {activeTab === "messages" && isTeacher && (
        <div className="rounded-xl border p-4" style={{ borderColor: "rgba(128,128,128,0.12)" }}>
          <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
            <MessageSquare className="h-4 w-4 opacity-40" />
            Message Log ({messages.length})
          </h3>
          {messages.length === 0 ? (
            <p className="text-sm opacity-40">No messages were sent during this session.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {messages.map((msg) => {
                const recipient = msg.recipient_id
                  ? participants.find((p) => p.student_id === msg.recipient_id)?.profiles?.display_name ?? "Student"
                  : "All"
                return (
                  <div key={msg.id} className="rounded-lg bg-muted/30 px-3 py-2">
                    <div className="flex items-center gap-2 text-[10px] opacity-50">
                      <span className="capitalize font-semibold">{msg.message_type}</span>
                      <span>&rarr; {recipient}</span>
                      <span className="ml-auto">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="mt-1 text-xs">{msg.content}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Export */}
      {isTeacher && (
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border p-3" style={{ borderColor: "rgba(128,128,128,0.12)" }}>
      <div className="flex items-center gap-2 text-xs opacity-50">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  )
}
