"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Backpack, SkipForward } from "lucide-react"
import { saveOnboardingData } from "@/lib/onboarding"
import { createClient } from "@/lib/supabase/client"
import { joinClassroomByCode } from "@/lib/actions/classrooms"

export function StepJoinClass({
  onNext,
  onSkip,
}: {
  onNext: () => void
  onSkip: () => void
}) {
  const [code, setCode] = useState("")
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleJoin = useCallback(async () => {
    const trimmed = code.trim()
    if (!trimmed) return
    setJoining(true)
    setError(null)

    // Always remember the code locally so it can be redeemed after sign-in
    // if the student isn't authenticated yet.
    saveOnboardingData({ classCode: trimmed })

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Not signed in yet — keep the stored code and move on.
        onNext()
        return
      }

      const result = await joinClassroomByCode(trimmed)
      if (!result.ok) {
        setError(result.error)
        setJoining(false)
        return
      }

      onNext()
    } catch {
      setError("Failed to join classroom")
      setJoining(false)
    }
  }, [code, onNext])

  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-[#2A4B8D]/10">
        <Backpack className="size-8 text-[#2A4B8D]" />
      </div>
      <h2
        className="mt-6 font-serif text-2xl font-semibold tracking-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        Join your class
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the code your teacher gave you
      </p>

      <div className="mt-8 w-full space-y-4 text-left">
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor="class-code">
            Class code
          </label>
          <Input
            id="class-code"
            placeholder="ABC123"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="font-mono tracking-[0.2em]"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="mt-8 flex w-full flex-col gap-3">
        <Button
          onClick={handleJoin}
          disabled={!code.trim() || joining}
          className="w-full"
        >
          {joining ? "Joining..." : "Join class"}
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
