"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { getLiveQuizView, type LiveQuizView } from "@/lib/actions/live-quiz"

export interface LiveParticipant {
  id: string
  student_id: string
  display_name: string
  score: number
  correct_count: number
  finalized_at: string | null
}

export interface LiveAnswer {
  student_id: string
  question_index: number
  answer: string | null
  is_correct: boolean
  points_awarded: number
}

interface UseLiveQuizReturn {
  loading: boolean
  error: string | null
  view: LiveQuizView | null
  participants: LiveParticipant[]
  answers: LiveAnswer[]
  myParticipant: LiveParticipant | null
  myAnswer: LiveAnswer | null
  refetchView: () => Promise<void>
  join: () => Promise<void>
  submitAnswer: (answer: string) => Promise<{ isCorrect: boolean; points: number } | null>
  finalize: () => Promise<void>
}

/**
 * Realtime state for one live quiz game. Subscribes (RLS-scoped) to the
 * session state machine, the participant leaderboard, and the racing answers —
 * all filtered to this session. The answer key inside `view.questions` is
 * revealed server-side by getLiveQuizView, so the hook refetches the view
 * whenever the session status advances (e.g. into `reveal`).
 */
export function useLiveQuiz(sessionId: string | null): UseLiveQuizReturn {
  const { user } = useAuth()
  const [view, setView] = useState<LiveQuizView | null>(null)
  const [participants, setParticipants] = useState<LiveParticipant[]>([])
  const [answers, setAnswers] = useState<LiveAnswer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Track the last-seen status so we only refetch the (server-gated) view when
  // the state machine actually advances, not on every leaderboard tick.
  const lastStatusRef = useRef<string | null>(null)
  const lastIndexRef = useRef<number>(-2)

  const refetchView = useCallback(async () => {
    if (!sessionId) return
    const res = await getLiveQuizView(sessionId)
    if (res.ok) {
      setView(res.data)
      lastStatusRef.current = res.data.session.status
      lastIndexRef.current = res.data.session.current_question_index
      setError(null)
    } else {
      setError(res.error)
    }
  }, [sessionId])

  const refetchParticipants = useCallback(async () => {
    if (!sessionId) return
    const supabase = createClient()
    const { data } = await supabase
      .from("live_quiz_participants")
      .select("id, student_id, display_name, score, correct_count, finalized_at")
      .eq("session_id", sessionId)
      .order("score", { ascending: false })
    setParticipants((data as LiveParticipant[] | null) ?? [])
  }, [sessionId])

  const refetchAnswers = useCallback(async () => {
    if (!sessionId) return
    const supabase = createClient()
    const { data } = await supabase
      .from("live_quiz_answers")
      .select("student_id, question_index, answer, is_correct, points_awarded")
      .eq("session_id", sessionId)
    setAnswers((data as LiveAnswer[] | null) ?? [])
  }, [sessionId])

  // Initial load.
  useEffect(() => {
    if (!sessionId) return
    let active = true
    ;(async () => {
      setLoading(true)
      await Promise.all([refetchView(), refetchParticipants(), refetchAnswers()])
      if (active) setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [sessionId, refetchView, refetchParticipants, refetchAnswers])

  // Realtime: session state machine + leaderboard + racing answers.
  useEffect(() => {
    if (!sessionId) return
    const supabase = createClient()
    const channel = supabase
      .channel(`live-quiz:${sessionId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_quiz_sessions", filter: `id=eq.${sessionId}` },
        (payload) => {
          const row = payload.new as { status?: string; current_question_index?: number }
          // Only reload the leak-safe view when the machine advances, so a newly
          // revealed answer key flows in exactly when the host reveals.
          if (
            row.status !== lastStatusRef.current ||
            row.current_question_index !== lastIndexRef.current
          ) {
            void refetchView()
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_quiz_participants",
          filter: `session_id=eq.${sessionId}`,
        },
        () => void refetchParticipants(),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_quiz_answers",
          filter: `session_id=eq.${sessionId}`,
        },
        () => void refetchAnswers(),
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [sessionId, refetchView, refetchParticipants, refetchAnswers])

  const join = useCallback(async () => {
    if (!sessionId) return
    const supabase = createClient()
    await supabase.rpc("join_live_quiz", { p_session_id: sessionId })
    await refetchParticipants()
  }, [sessionId, refetchParticipants])

  const submitAnswer = useCallback(
    async (answer: string) => {
      if (!sessionId || !view) return null
      const supabase = createClient()
      const { data, error: rpcError } = await supabase.rpc("submit_live_quiz_answer", {
        p_session_id: sessionId,
        p_question_index: view.session.current_question_index,
        p_answer: answer,
      })
      if (rpcError) {
        setError(rpcError.message)
        return null
      }
      await refetchAnswers()
      const result = data as { is_correct?: boolean; points?: number } | null
      return { isCorrect: result?.is_correct ?? false, points: result?.points ?? 0 }
    },
    [sessionId, view, refetchAnswers],
  )

  const finalize = useCallback(async () => {
    if (!sessionId) return
    const supabase = createClient()
    await supabase.rpc("finalize_live_quiz_for_me", { p_session_id: sessionId })
    await refetchParticipants()
  }, [sessionId, refetchParticipants])

  const myParticipant = user ? participants.find((p) => p.student_id === user.id) ?? null : null
  const myAnswer =
    user && view
      ? answers.find(
          (a) => a.student_id === user.id && a.question_index === view.session.current_question_index,
        ) ?? null
      : null

  return {
    loading,
    error,
    view,
    participants,
    answers,
    myParticipant,
    myAnswer,
    refetchView,
    join,
    submitAnswer,
    finalize,
  }
}
