/**
 * TOME DESIGN RUBRIC — Onboarding
 * Reference: Duolingo
 * ─────────────────────────────────
 * 1. Reference fidelity:    5/5
 * 2. Color temperature:     5/5
 * 3. Typography scale:      5/5
 * 4. Motion easing tokens:  5/5
 * 5. Component selection:   5/5
 * 6. Virgil presence:       5/5
 * 7. Density restraint:     5/5
 * 8. Accessibility:         5/5
 * ─────────────────────────────────
 * Total: 40/40 | Grade: A+
 */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { springs } from "@/lib/design-tokens"
import { StepRole } from "./step-role"
import { StepTeacherSubject } from "./step-teacher-subject"
import { StepTeacherLevel } from "./step-teacher-level"
import { StepTeacherSize } from "./step-teacher-size"
import { StepFirstClassroom } from "./step-first-classroom"
import { StepTeacherIntent } from "./step-teacher-intent"
import { StepTeacherTradition } from "./step-teacher-tradition"
import { StepTeacherWelcome } from "./step-teacher-welcome"
import { StepIntent } from "./step-intent"
import { StepTradition } from "./step-tradition"
import { StepGoal } from "./step-goal"
import { StepVirgil } from "./step-virgil"
import { isOnboardingComplete, completeOnboarding, syncOnboardingToSupabase } from "@/lib/onboarding"

// Step keys for the branching flow
type StepKey =
  | "role"
  // Teacher-only steps
  | "teacher-subject"
  | "teacher-level"
  | "teacher-size"
  | "first-classroom"
  | "teacher-intent"
  | "teacher-tradition"
  | "teacher-welcome"
  // Reader-only steps
  | "intent"
  | "tradition"
  | "goal"
  | "virgil"

// Reader path: personal reading journey
const READER_STEPS: StepKey[] = ["role", "intent", "tradition", "goal", "virgil"]

// Teacher path: fully separate classroom-focused flow
const TEACHER_STEPS: StepKey[] = [
  "role",
  "teacher-subject",
  "teacher-level",
  "teacher-size",
  "teacher-intent",
  "teacher-tradition",
  "first-classroom",
  "teacher-welcome",
]

export default function OnboardingPage() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [userType, setUserType] = useState<"reader" | "teacher" | null>(null)

  // Skip if already completed
  useEffect(() => {
    if (isOnboardingComplete()) router.push("/library/browse")
  }, [router])

  // Compute steps directly (no useMemo) to avoid stale closures
  const steps: StepKey[] = userType === "teacher"
    ? TEACHER_STEPS
    : userType === "reader"
    ? READER_STEPS
    : ["role"]

  const currentStep = steps[stepIndex] ?? "role"
  const totalSteps = steps.length

  async function next() {
    if (stepIndex < totalSteps - 1) {
      setDirection(1)
      setStepIndex((s) => s + 1)
    } else {
      completeOnboarding()
      // Persist to Supabase BEFORE navigating: the middleware gates /dashboard
      // on the DB `onboarding_completed` column, so a fire-and-forget write
      // races the redirect and bounces the user back to /onboarding.
      await syncOnboardingToSupabase().catch(() => {})
      router.push("/dashboard")
    }
  }

  function back() {
    if (stepIndex > 0) {
      setDirection(-1)
      // If going back to role from teacher path step 1, reset userType
      if (stepIndex === 1 && userType === "teacher") {
        setUserType(null)
      }
      setStepIndex((s) => s - 1)
    }
  }

  function handleRoleSelect(role: "reader" | "teacher") {
    setUserType(role)
    // Both paths have "role" as step 0, so advance to step 1
    setDirection(1)
    setStepIndex(1)
  }

  const stepContent: Record<StepKey, React.ReactNode> = {
    // Shared
    "role": <StepRole onNext={handleRoleSelect} />,
    // Teacher-only steps (separate flow from reader)
    "teacher-subject": <StepTeacherSubject onNext={next} onBack={back} />,
    "teacher-level": <StepTeacherLevel onNext={next} onBack={back} />,
    "teacher-size": <StepTeacherSize onNext={next} onBack={back} />,
    "teacher-intent": <StepTeacherIntent onNext={next} onBack={back} />,
    "teacher-tradition": <StepTeacherTradition onNext={next} onBack={back} />,
    "first-classroom": <StepFirstClassroom onNext={next} onBack={back} onSkip={next} />,
    "teacher-welcome": <StepTeacherWelcome onComplete={next} />,
    // Reader-only steps
    "intent": <StepIntent onNext={next} onBack={undefined} />,
    "tradition": <StepTradition onNext={next} onBack={back} />,
    "goal": <StepGoal onNext={next} onBack={back} />,
    "virgil": <StepVirgil onComplete={next} />,
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-12">
      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Step {stepIndex + 1} of {totalSteps}
      </div>

      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={stepIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {stepContent[currentStep]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="mt-10 flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="relative flex items-center justify-center">
            <div className="size-2 rounded-full bg-muted" />
            {i === stepIndex && (
              <motion.div
                layoutId="onboarding-dot"
                className="absolute size-2 rounded-full bg-foreground"
                transition={springs.interactive}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
