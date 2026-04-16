"use client"

import { useState, useCallback, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LockedReader } from "./locked-reader"
import { ReflectionEditor } from "./reflection-editor"
import { SessionHeaderBar } from "./session-header-bar"
import { SessionTimer } from "./session-timer"
import { StationTransitionOverlay } from "./station-transition-overlay"
import { MessageInlineCard } from "./message-inline-card"
import { CompletionView } from "./completion-view"
import { EarlyFinishWaiting } from "./early-finish-waiting"
import { TeacherViewingIndicator } from "./teacher-viewing-indicator"
import { LockedSidebarOverlay } from "./locked-sidebar-overlay"
import type {
  Station,
  SessionSettings,
  SessionMessage,
  GuidedSession,
} from "@/lib/guided-learning-types"
import { getNextStation, parseSessionSettings } from "@/lib/guided-station-utils"

interface Props {
  session: GuidedSession
  stations: Station[]
  currentStationIndex: number
  messages: SessionMessage[]
  teacherName?: string
  teacherIsViewing?: boolean
  clockOffset?: number
  onStationComplete: (stationIndex: number) => void
  onProgress: (stationIndex: number, pct: number) => void
  onReflectionSave: (stationId: string, content: string, wordCount: number) => void
  onReflectionSubmit: (stationId: string, content: string, wordCount: number) => void
  onExit: () => void
  onSessionExpire: () => void
}

export function StudentStationView({
  session,
  stations,
  currentStationIndex,
  messages,
  teacherName,
  teacherIsViewing = false,
  clockOffset = 0,
  onStationComplete,
  onProgress,
  onReflectionSave,
  onReflectionSubmit,
  onExit,
  onSessionExpire,
}: Props) {
  const settings = parseSessionSettings(session.settings)
  const sortedStations = [...stations].sort((a, b) => a.station_index - b.station_index)
  const currentStation = sortedStations.find((s) => s.station_index === currentStationIndex)
  const nextStation = currentStation ? getNextStation(sortedStations, currentStationIndex) : null
  const [showTransition, setShowTransition] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [completedStation, setCompletedStation] = useState<Station | undefined>()

  // Recent undismissed messages for the current station
  const activeMessages = messages.filter(
    (m) => m.station_index == null || m.station_index === currentStationIndex,
  )

  // Compute station end time based on target minutes from when station started
  const stationEndsAt = currentStation
    ? (() => {
        // Use session ends_at as fallback, adjusted by station target
        // In production this would come from participant.current_station_started_at + target_minutes
        if (session.ends_at) {
          const sessionEnd = new Date(session.ends_at).getTime()
          const now = Date.now() - clockOffset
          const stationTargetMs = currentStation.target_minutes * 60 * 1000
          const stationEnd = Math.min(now + stationTargetMs, sessionEnd)
          return new Date(stationEnd).toISOString()
        }
        return null
      })()
    : null

  const handleStationComplete = useCallback(() => {
    if (!currentStation) return
    setCompletedStation(currentStation)
    onStationComplete(currentStationIndex)

    if (!nextStation) {
      // All stations done
      setIsComplete(true)
      return
    }

    if (settings.autoAdvance) {
      setShowTransition(true)
      // Auto-advance after brief delay
      setTimeout(() => setShowTransition(false), 1500)
    } else {
      setShowTransition(true)
    }
  }, [currentStation, currentStationIndex, nextStation, settings.autoAdvance, onStationComplete])

  const handleContinue = useCallback(() => {
    setShowTransition(false)
  }, [])

  const handleReadingProgress = useCallback(
    (pct: number) => {
      onProgress(currentStationIndex, pct)
    },
    [currentStationIndex, onProgress],
  )

  if (!currentStation) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm opacity-50">Station not found</p>
      </div>
    )
  }

  // All stations complete
  if (isComplete) {
    if (!settings.allowEarlyExit) {
      return <EarlyFinishWaiting sessionTitle={session.title ?? "Guided Session"} />
    }
    return (
      <CompletionView
        sessionTitle={session.title ?? "Guided Session"}
        stations={sortedStations}
        onReturnToDashboard={onExit}
      />
    )
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-950">
      {/* Header bar */}
      <SessionHeaderBar
        sessionTitle={session.title ?? "Guided Session"}
        teacherName={teacherName}
        currentStation={currentStation}
        totalStations={sortedStations.length}
      />

      {/* Locked sidebar overlay */}
      {settings.lockNavigation && (
        <LockedSidebarOverlay
          allowEarlyExit={settings.allowEarlyExit}
          onExit={onExit}
        />
      )}

      {/* Timer */}
      <SessionTimer
        stationEndsAt={stationEndsAt}
        sessionEndsAt={session.ends_at ?? null}
        onStationExpire={() => {
          if (!currentStation.require_completion) {
            handleStationComplete()
          }
          // If require_completion, station stays open but teacher sees flag
        }}
        onSessionExpire={onSessionExpire}
        clockOffset={clockOffset}
        isPaused={session.status === "paused"}
      />

      {/* Paused overlay */}
      {session.status === "paused" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center text-white">
            <p className="mb-2 text-lg font-semibold">Session Paused</p>
            <p className="text-sm opacity-70">
              {teacherName ?? "Teacher"} paused the session. Waiting to resume...
            </p>
          </div>
        </div>
      )}

      {/* Teacher viewing indicator */}
      <TeacherViewingIndicator isVisible={teacherIsViewing} teacherName={teacherName} />

      {/* Station content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStationIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {currentStation.type === "reading" &&
            currentStation.book_id &&
            currentStation.chapter_start != null && (
              <LockedReader
                sessionId={session.id}
                bookId={currentStation.book_id}
                chapterIndex={currentStation.chapter_start}
                onProgress={handleReadingProgress}
                onComplete={handleStationComplete}
              />
            )}

          {currentStation.type === "quiz" && (
            <div className="flex min-h-[60vh] items-center justify-center">
              <p className="text-sm opacity-50">
                Quiz station — Trial component renders here
              </p>
            </div>
          )}

          {currentStation.type === "reflection" && (
            <ReflectionEditor
              prompt={currentStation.reflection_prompt ?? "Share your thoughts on this reading."}
              minWords={currentStation.min_words ?? undefined}
              onSave={(content, wordCount) =>
                onReflectionSave(currentStation.id, content, wordCount)
              }
              onSubmit={(content, wordCount) => {
                onReflectionSubmit(currentStation.id, content, wordCount)
                handleStationComplete()
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Inline teacher messages */}
      <div className="fixed bottom-20 right-4 z-30 w-80 space-y-2">
        <AnimatePresence>
          {activeMessages.slice(-3).map((msg) => (
            <MessageInlineCard
              key={msg.id}
              messageType={msg.message_type}
              content={msg.content}
              teacherName={teacherName}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Station transition overlay */}
      <StationTransitionOverlay
        isVisible={showTransition}
        completedStation={completedStation}
        nextStation={nextStation ?? undefined}
        autoAdvance={settings.autoAdvance}
        onContinue={handleContinue}
      />
    </div>
  )
}
