"use client"

import { useParams } from "next/navigation"
import { SessionMonitorDashboard } from "@/components/guided-learning/session-monitor-dashboard"

export default function GuidedSessionMonitorPage() {
  const params = useParams<{ sessionId: string }>()

  return <SessionMonitorDashboard sessionId={params.sessionId} />
}
