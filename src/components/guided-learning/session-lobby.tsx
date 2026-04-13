"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Users, Clock, BookOpen, Brain, Copy, Check } from "lucide-react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { springs } from "@/lib/design-tokens"
import type { GuidedSession, ParticipantWithProfile } from "@/lib/guided-learning-types"

interface SessionLobbyProps {
  session: GuidedSession
  participants: ParticipantWithProfile[]
  isTeacher: boolean
  bookTitle?: string
  bookAuthor?: string
  onStart?: () => void
  isStarting?: boolean
}

/**
 * Pre-session waiting room.
 * Teacher: shows join code, student list, Start button.
 * Student: shows assignment preview, time limit, "Waiting for teacher..."
 */
export function SessionLobby({
  session,
  participants,
  isTeacher,
  bookTitle,
  bookAuthor,
  onStart,
  isStarting,
}: SessionLobbyProps) {
  const [codeCopied, setCodeCopied] = useState(false)

  const copyCode = useCallback(async () => {
    await navigator.clipboard.writeText(session.join_code)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }, [session.join_code])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      {/* Assignment info */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm opacity-60">
          {session.type === "chapter" ? (
            <BookOpen className="h-4 w-4" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          <span className="uppercase tracking-wider">
            {session.type === "chapter" ? "Reading Session" : "Trial Session"}
          </span>
        </div>

        {bookTitle && (
          <h2
            className="text-2xl font-bold"
          >
            {bookTitle}
          </h2>
        )}
        {bookAuthor && (
          <p className="font-serif text-sm italic opacity-60">
            by {bookAuthor}
          </p>
        )}

        <div className="flex items-center justify-center gap-4 pt-2 text-sm opacity-70">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {session.time_limit_minutes} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {participants.length} joined
          </span>
        </div>

        <div
          className="inline-block rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider"
          style={{
            backgroundColor:
              session.mode === "strict"
                ? "rgba(200, 74, 82, 0.12)"
                : "rgba(200, 128, 31, 0.12)",
            color:
              session.mode === "strict"
                ? "var(--tome-error, #C84A52)"
                : "var(--tome-warning, #C8801F)",
          }}
        >
          {session.mode} mode
        </div>
      </div>

      {/* Teacher: Join code + controls */}
      {isTeacher && (
        <div className="mb-8 space-y-4">
          <p className="text-xs uppercase tracking-wider opacity-50">Join Code</p>
          <button
            onClick={copyCode}
            className="group relative flex items-center gap-3 rounded-xl border-2 border-dashed px-8 py-4 transition-colors hover:border-solid"
            style={{
              borderColor: "var(--tome-accent, #D4A04C)",
            }}
          >
            <span
              className="font-mono text-3xl font-bold tracking-[0.15em]"
              style={{ color: "var(--tome-accent, #D4A04C)" }}
            >
              {session.join_code}
            </span>
            {codeCopied ? (
              <Check className="h-5 w-5" style={{ color: "var(--tome-success, #2D9A47)" }} />
            ) : (
              <Copy className="h-5 w-5 opacity-40 transition-opacity group-hover:opacity-70" />
            )}
          </button>

          <p className="text-xs opacity-50">
            Share this code with your students
          </p>
        </div>
      )}

      {/* Participant list */}
      <div className="mb-8 w-full">
        <p className="mb-3 text-xs uppercase tracking-wider opacity-50">
          {isTeacher ? "Students Joined" : "Participants"}
        </p>
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {participants.map((p) => (
              <motion.div
                key={p.id}
                className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
                style={{
                  borderColor: "rgba(128, 128, 128, 0.15)",
                  backgroundColor: "rgba(128, 128, 128, 0.04)",
                }}
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={springs.gentle}
                layout
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: "var(--tome-indigo, #6366F1)" }}
                >
                  {(p.profiles?.display_name ?? "S")[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium">
                  {p.profiles?.display_name ?? "Student"}
                </span>
                <div
                  className="ml-auto h-2 w-2 rounded-full"
                  style={{ backgroundColor: "var(--tome-success, #2D9A47)" }}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {participants.length === 0 && (
            <p className="py-6 text-sm opacity-40">
              Waiting for students to join...
            </p>
          )}
        </div>
      </div>

      {/* Teacher: Start button */}
      {isTeacher && (
        <Button
          onClick={onStart}
          disabled={isStarting || participants.length === 0}
          size="lg"
          className="w-full max-w-xs text-white"
          style={{
            backgroundColor:
              participants.length === 0
                ? "rgba(99, 102, 241, 0.4)"
                : "var(--tome-indigo, #6366F1)",
          }}
        >
          {isStarting ? "Starting..." : "Start Session"}
        </Button>
      )}

      {/* Student: Waiting indicator */}
      {!isTeacher && (
        <div className="flex flex-col items-center gap-3">
          <motion.div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: "var(--tome-accent, #D4A04C)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <p
            className="font-serif text-sm italic opacity-60"
            style={{ fontFamily: "var(--font-serif, 'Literata')" }}
          >
            Waiting for teacher to begin...
          </p>
        </div>
      )}
    </div>
  )
}
