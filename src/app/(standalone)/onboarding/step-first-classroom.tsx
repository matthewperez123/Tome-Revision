"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { springs } from "@/lib/design-tokens"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, GraduationCap, SkipForward } from "lucide-react"
import { saveOnboardingData } from "@/lib/onboarding"
import { createClient } from "@/lib/supabase/client"
import { generateJoinCode } from "@/lib/classroom-utils"

export function StepFirstClassroom({
  onNext,
  onBack,
  onSkip,
}: {
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}) {
  const [classroomName, setClassroomName] = useState("")
  const [subject, setSubject] = useState("")
  const [createdCode, setCreatedCode] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subjects = [
    "English Literature",
    "AP Literature & Composition",
    "World Literature",
    "Great Books",
    "Humanities",
    "Philosophy",
    "Other",
  ]

  const handleCreate = useCallback(async () => {
    if (!classroomName.trim()) return
    setCreating(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError("You must be signed in to create a classroom")
        setCreating(false)
        return
      }

      const joinCode = generateJoinCode()

      const { error: insertError } = await supabase
        .from("classrooms")
        .insert({
          teacher_id: user.id,
          name: classroomName.trim(),
          subject: subject || null,
          join_code: joinCode,
        })

      if (insertError) {
        // If join code collision, try once more
        if (insertError.message.includes("unique")) {
          const retryCode = generateJoinCode()
          const { error: retryError } = await supabase
            .from("classrooms")
            .insert({
              teacher_id: user.id,
              name: classroomName.trim(),
              subject: subject || null,
              join_code: retryCode,
            })
          if (retryError) {
            setError(retryError.message)
            setCreating(false)
            return
          }
          setCreatedCode(retryCode)
        } else {
          setError(insertError.message)
          setCreating(false)
          return
        }
      } else {
        setCreatedCode(joinCode)
      }

      saveOnboardingData({
        firstClassroomName: classroomName.trim(),
        firstClassroomSubject: subject || null,
      })
    } catch (e) {
      setError("Failed to create classroom")
    } finally {
      setCreating(false)
    }
  }, [classroomName, subject])

  const handleCopy = useCallback(() => {
    if (!createdCode) return
    navigator.clipboard.writeText(createdCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [createdCode])

  // After creation, show the join code
  if (createdCode) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30">
          <Check className="size-8 text-green-600" />
        </div>
        <h2
          className="mt-6 font-serif text-2xl font-semibold tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Classroom created!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Share this code with your students
        </p>

        {/* Large join code */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={springs.interactive}
          className="mt-8 flex items-center gap-3 rounded-2xl border-2 border-[#D4A04C]/30 bg-[#D4A04C]/5 px-8 py-6"
        >
          <span className="font-mono text-4xl font-bold tracking-[0.2em]">
            {createdCode}
          </span>
          <button
            onClick={handleCopy}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Copy join code"
          >
            {copied ? (
              <Check className="size-5 text-green-500" />
            ) : (
              <Copy className="size-5" />
            )}
          </button>
        </motion.div>

        <p className="mt-4 text-xs text-muted-foreground">
          Students can join at <span className="font-mono font-medium">tome.app/join/{createdCode}</span>
        </p>

        <Button onClick={onNext} className="mt-8 w-full max-w-xs">
          Continue
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-[#D4A04C]/10">
        <GraduationCap className="size-8 text-[#D4A04C]" />
      </div>
      <h2
        className="mt-6 font-serif text-2xl font-semibold tracking-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        Create your first classroom
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        You can always create more later
      </p>

      <div className="mt-8 w-full space-y-4 text-left">
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor="classroom-name">
            Classroom name
          </label>
          <Input
            id="classroom-name"
            placeholder="AP Lit Period 3"
            value={classroomName}
            onChange={(e) => setClassroomName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Subject</label>
          <div className="grid grid-cols-2 gap-2">
            {subjects.map((s) => {
              const isSelected = subject === s
              return (
                <motion.button
                  key={s}
                  onClick={() => setSubject(s)}
                  animate={{ scale: isSelected ? 1.02 : 1 }}
                  transition={springs.interactive}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    isSelected
                      ? "border-[#D4A04C] bg-[#D4A04C]/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-foreground/20"
                  }`}
                >
                  {s}
                </motion.button>
              )
            })}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="mt-8 flex w-full flex-col gap-3">
        <Button
          onClick={handleCreate}
          disabled={!classroomName.trim() || creating}
          className="w-full"
        >
          {creating ? "Creating..." : "Create classroom"}
        </Button>
        <button
          onClick={onSkip}
          className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <SkipForward className="size-3.5" />
          Skip for now
        </button>
      </div>
    </div>
  )
}
