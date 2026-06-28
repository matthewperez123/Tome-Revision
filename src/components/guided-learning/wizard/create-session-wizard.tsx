"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Loader2, Save, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import {
  WIZARD_STEPS,
  type WizardStep,
  type DraftStation,
  type SessionSettings,
  type GuidedSession,
} from "@/lib/guided-learning-types"
import { getDefaultSessionSettings } from "@/lib/guided-station-utils"
import { createDemoSession } from "@/lib/guided-learning-demo"
import { DEMO_STUDENT_DETAILS } from "@/lib/classroom-students"
import { StepBasics } from "./step-basics"
import { StepStations } from "./step-stations"
import { StepRoster } from "./step-roster"
import { StepSettings } from "./step-settings"
import { StepReview } from "./step-review"
import { VirgilSessionAssistant } from "./virgil-session-assistant"

// ── Wizard State ──────────────────────────────────────────────────────────────

export interface WizardState {
  // Step 1: Basics
  title: string
  description: string
  classroomId: string
  scheduledStartAt: string
  durationMinutes: number
  mode: "strict" | "lenient"
  // Step 2: Stations
  stations: DraftStation[]
  // Step 3: Roster
  selectedStudentIds: Set<string>
  // Step 4: Settings
  settings: SessionSettings
  // Step 4: Collaborative annotations
  annotationsEnabled: boolean
  annotationVisibility: "collaborative" | "private_to_teacher"
  presenceEnabled: boolean
}

function getInitialState(): WizardState {
  return {
    title: "",
    description: "",
    classroomId: "",
    scheduledStartAt: "",
    durationMinutes: 45,
    mode: "strict",
    stations: [],
    selectedStudentIds: new Set(),
    settings: getDefaultSessionSettings(),
    annotationsEnabled: true,
    annotationVisibility: "collaborative",
    presenceEnabled: true,
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CreateSessionWizard({
  editSession,
}: {
  editSession?: GuidedSession
}) {
  const router = useRouter()
  const { user, isDemoMode } = useAuth()
  const [currentStep, setCurrentStep] = useState<WizardStep>("basics")
  const [state, setState] = useState<WizardState>(getInitialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Hydrate from editSession if editing
  useEffect(() => {
    if (!editSession) return
    setState((prev) => ({
      ...prev,
      title: editSession.title ?? "",
      description: editSession.description ?? "",
      classroomId: editSession.classroom_id ?? "",
      scheduledStartAt: editSession.scheduled_start_at ?? "",
      durationMinutes: editSession.duration_minutes ?? editSession.time_limit_minutes,
      mode: editSession.mode,
      settings: editSession.settings ?? getDefaultSessionSettings(),
      annotationsEnabled: editSession.annotations_enabled ?? true,
      annotationVisibility:
        editSession.annotation_visibility ?? "collaborative",
      presenceEnabled: editSession.presence_enabled ?? true,
      stations: (editSession.stations ?? []).map((s) => ({
        id: s.id,
        type: s.type,
        title: s.title ?? "",
        book_id: s.book_id,
        chapter_start: s.chapter_start,
        chapter_end: s.chapter_end,
        section_range: s.section_range,
        quiz_id: s.quiz_id,
        teacher_quiz_id: s.teacher_quiz_id,
        quiz_config: s.quiz_config,
        reflection_prompt: s.reflection_prompt,
        min_words: s.min_words,
        target_minutes: s.target_minutes,
        require_completion: s.require_completion,
      })),
    }))
  }, [editSession])

  const stepIndex = WIZARD_STEPS.findIndex((s) => s.key === currentStep)

  const updateState = useCallback((partial: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...partial }))
  }, [])

  // Virgil chatbot drops a ready-made quiz station into the queue.
  const handleAttachQuiz = useCallback((station: DraftStation) => {
    setState((prev) => ({ ...prev, stations: [...prev.stations, station] }))
    setCurrentStep("stations")
  }, [])

  const canGoNext = useCallback(() => {
    switch (currentStep) {
      case "basics":
        return state.title.trim().length > 0 && state.durationMinutes > 0
      case "stations":
        return state.stations.length > 0
      case "roster":
        return state.selectedStudentIds.size > 0
      case "settings":
        return true
      case "review":
        return true
      default:
        return false
    }
  }, [currentStep, state])

  const goNext = useCallback(() => {
    if (stepIndex < WIZARD_STEPS.length - 1) {
      setCurrentStep(WIZARD_STEPS[stepIndex + 1].key)
    }
  }, [stepIndex])

  const goBack = useCallback(() => {
    if (stepIndex > 0) {
      setCurrentStep(WIZARD_STEPS[stepIndex - 1].key)
    }
  }, [stepIndex])

  const handleSubmit = useCallback(
    async (action: "draft" | "schedule" | "start") => {
      setError(null)
      setIsSubmitting(true)

      try {
        if (isDemoMode || !user) {
          // Demo mode: save locally and redirect
          const students = DEMO_STUDENT_DETAILS
            .filter((s) => state.selectedStudentIds.has(s.id))
            .map((s) => ({ id: s.id, name: s.name, avatarColor: s.avatarColor }))

          const demo = createDemoSession({
            type: "chapter",
            bookId: state.stations[0]?.book_id ?? undefined,
            bookTitle: state.stations[0]?.book_title,
            timeLimitMinutes: state.durationMinutes,
            students,
          })

          router.push(`/teacher/guided-learning/${demo.session.id}`)
          return
        }

        // Real mode: API call
        const status =
          action === "draft"
            ? "draft"
            : action === "start"
              ? "lobby"
              : "scheduled"

        const body = {
          title: state.title,
          description: state.description || undefined,
          classroom_id: state.classroomId || undefined,
          scheduled_start_at: state.scheduledStartAt || undefined,
          duration_minutes: state.durationMinutes,
          mode: state.mode,
          status,
          settings: state.settings,
          annotations_enabled: state.annotationsEnabled,
          annotation_visibility: state.annotationVisibility,
          presence_enabled: state.presenceEnabled,
          stations: state.stations.map((s, i) => ({
            station_index: i,
            type: s.type,
            title: s.title || undefined,
            book_id: s.book_id || undefined,
            chapter_start: s.chapter_start,
            chapter_end: s.chapter_end,
            section_range: s.section_range || undefined,
            quiz_id: s.quiz_id || undefined,
            teacher_quiz_id: s.teacher_quiz_id || undefined,
            quiz_config: s.quiz_config || undefined,
            reflection_prompt: s.reflection_prompt || undefined,
            min_words: s.min_words,
            target_minutes: s.target_minutes,
            require_completion: s.require_completion,
          })),
          student_ids: Array.from(state.selectedStudentIds),
        }

        const url = editSession
          ? `/api/guided-sessions/${editSession.id}`
          : "/api/guided-sessions"
        const method = editSession ? "PUT" : "POST"

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to save session")
        }

        const { session } = await res.json()
        router.push(`/teacher/guided-learning/${session.id}`)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setIsSubmitting(false)
      }
    },
    [state, isDemoMode, user, router, editSession],
  )

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          {editSession ? "Edit Session" : "New Guided Session"}
        </h1>
        <p className="mt-1 text-sm opacity-60">
          Build a multi-station study session for your students.
        </p>
      </div>

      {/* Virgil quiz assistant — ask in plain language, no toggles */}
      <VirgilSessionAssistant onAttachQuiz={handleAttachQuiz} />

      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-1">
        {WIZARD_STEPS.map((step, i) => {
          const isActive = step.key === currentStep
          const isPast = i < stepIndex
          return (
            <button
              key={step.key}
              onClick={() => {
                if (isPast) setCurrentStep(step.key)
              }}
              disabled={!isPast && !isActive}
              className="flex items-center gap-2"
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors"
                style={{
                  backgroundColor: isActive
                    ? "var(--tome-indigo, #6366F1)"
                    : isPast
                      ? "rgba(99, 102, 241, 0.15)"
                      : "rgba(128, 128, 128, 0.1)",
                  color: isActive
                    ? "#fff"
                    : isPast
                      ? "var(--tome-indigo, #6366F1)"
                      : "rgba(128, 128, 128, 0.4)",
                }}
              >
                {i + 1}
              </div>
              <span
                className="hidden text-xs font-medium sm:inline"
                style={{
                  color: isActive
                    ? "var(--tome-indigo, #6366F1)"
                    : isPast
                      ? "inherit"
                      : "rgba(128, 128, 128, 0.4)",
                }}
              >
                {step.label}
              </span>
              {i < WIZARD_STEPS.length - 1 && (
                <div
                  className="mx-2 h-px w-6"
                  style={{
                    backgroundColor: isPast
                      ? "var(--tome-indigo, #6366F1)"
                      : "rgba(128, 128, 128, 0.15)",
                  }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {currentStep === "basics" && (
          <StepBasics state={state} onChange={updateState} />
        )}
        {currentStep === "stations" && (
          <StepStations state={state} onChange={updateState} />
        )}
        {currentStep === "roster" && (
          <StepRoster state={state} onChange={updateState} />
        )}
        {currentStep === "settings" && (
          <StepSettings state={state} onChange={updateState} />
        )}
        {currentStep === "review" && (
          <StepReview state={state} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-4 text-sm font-medium" style={{ color: "var(--tome-error, #C84A52)" }}>
          {error}
        </p>
      )}

      {/* Navigation */}
      {currentStep !== "review" && (
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={goNext}
            disabled={!canGoNext()}
            className="gap-2 text-white"
            style={{
              backgroundColor: canGoNext()
                ? "var(--tome-indigo, #6366F1)"
                : undefined,
            }}
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
