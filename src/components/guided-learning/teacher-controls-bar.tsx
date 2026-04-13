"use client"

import { useState } from "react"
import { Pause, Play, Plus, StopCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TimerRing } from "./timer-ring"
import type { GuidedSession } from "@/lib/guided-learning-types"

interface TeacherControlsBarProps {
  session: GuidedSession
  onPause: () => void
  onResume: () => void
  onExtend: (minutes: number) => void
  onEnd: () => void
  onSendMessage: (message: string) => void
  onExpire?: () => void
}

/**
 * Sticky bottom bar for teacher session controls.
 * Pause/Resume, +5/+10 min extend, End Session, broadcast message.
 */
export function TeacherControlsBar({
  session,
  onPause,
  onResume,
  onExtend,
  onEnd,
  onSendMessage,
  onExpire,
}: TeacherControlsBarProps) {
  const [message, setMessage] = useState("")
  const [showEndConfirm, setShowEndConfirm] = useState(false)

  const isPaused = session.status === "paused"

  const handleSendMessage = () => {
    if (!message.trim()) return
    onSendMessage(message.trim())
    setMessage("")
  }

  return (
    <div
      className="rounded-xl border px-4 py-3"
      style={{
        backgroundColor: "rgba(var(--tome-surface-elevated-rgb, 255 255 255), 0.5)",
        borderColor: "rgba(128, 128, 128, 0.15)",
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3">
        {/* Timer */}
        <TimerRing
          endsAt={session.ends_at}
          totalDurationMinutes={session.time_limit_minutes}
          size={52}
          onExpire={onExpire}
        />

        {/* Status pill */}
        <div
          className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: isPaused
              ? "rgba(200, 128, 31, 0.12)"
              : "rgba(45, 154, 71, 0.12)",
            color: isPaused
              ? "var(--tome-warning, #C8801F)"
              : "var(--tome-success, #2D9A47)",
          }}
        >
          {isPaused ? "Paused" : "Active"}
        </div>

        {/* Pause/Resume */}
        <Button
          variant="outline"
          size="sm"
          onClick={isPaused ? onResume : onPause}
          className="gap-1.5"
        >
          {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          {isPaused ? "Resume" : "Pause"}
        </Button>

        {/* Extend time */}
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => onExtend(5)} className="gap-1">
            <Plus className="h-3 w-3" />5m
          </Button>
          <Button variant="outline" size="sm" onClick={() => onExtend(10)} className="gap-1">
            <Plus className="h-3 w-3" />10m
          </Button>
        </div>

        {/* Message broadcast */}
        <div className="flex min-w-[180px] flex-1 gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message all students..."
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage()
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* End Session */}
        {showEndConfirm ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: "var(--tome-error, #C84A52)" }}>
              End session?
            </span>
            <Button
              size="sm"
              onClick={() => {
                onEnd()
                setShowEndConfirm(false)
              }}
              className="text-white"
              style={{ backgroundColor: "var(--tome-error, #C84A52)" }}
            >
              Confirm
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowEndConfirm(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEndConfirm(true)}
            className="gap-1.5"
            style={{ borderColor: "var(--tome-error, #C84A52)", color: "var(--tome-error, #C84A52)" }}
          >
            <StopCircle className="h-3.5 w-3.5" />
            End
          </Button>
        )}
      </div>
    </div>
  )
}
