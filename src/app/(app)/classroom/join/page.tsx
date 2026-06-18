"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LogIn, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { isValidJoinCode } from "@/lib/classroom-utils"
import { lookupClassroomByCode, joinClassroomByCode } from "@/lib/actions/classrooms"
import Link from "next/link"

export default function JoinClassroomPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [code, setCode] = useState("")
  const [classroomName, setClassroomName] = useState<string | null>(null)
  const [classroomId, setClassroomId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)

  const handleLookup = useCallback(async () => {
    const normalized = code.trim().toUpperCase()
    if (!isValidJoinCode(normalized)) {
      setError("Invalid code format. Must be 6 characters.")
      return
    }

    setError(null)

    // The classrooms SELECT policy only returns rooms you already belong to,
    // so previewing a room by its code has to go through the server action
    // (admin-backed lookup).
    const result = await lookupClassroomByCode(normalized)
    if (!result.ok) {
      setError("Classroom not found. Check the code and try again.")
      return
    }

    setClassroomName(result.data.name)
    setClassroomId(result.data.id)
  }, [code])

  const handleJoin = useCallback(async () => {
    if (!user || !classroomId) return
    setJoining(true)
    setError(null)

    const result = await joinClassroomByCode(code.trim().toUpperCase())
    if (!result.ok) {
      // Already-enrolled users land here too — send them straight in.
      if (/already/i.test(result.error)) {
        router.push(`/classroom/${classroomId}`)
        return
      }
      setError(result.error)
      setJoining(false)
      return
    }

    setJoined(true)
    setTimeout(() => router.push(`/classroom/${result.data.classroomId}`), 1500)
  }, [user, classroomId, code, router])

  if (joined) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30">
            <Check className="size-8 text-green-600" />
          </div>
          <h1 className="mt-6 text-xl font-bold">Joined {classroomName}!</h1>
          <p className="mt-2 text-sm text-muted-foreground">Redirecting to your classroom...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/30">
          <LogIn className="size-6 text-indigo-500" />
        </div>
        <h1 className="mt-4 text-xl font-bold">Join a Classroom</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the 6-character code from your teacher
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {!classroomName ? (
          <>
            <Input
              placeholder="Enter code (e.g. TOME42)"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase())
                setError(null)
              }}
              maxLength={6}
              className="text-center font-mono text-xl tracking-[0.2em] uppercase"
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertTriangle className="size-3.5" />
                {error}
              </div>
            )}
            <Button onClick={handleLookup} disabled={code.length !== 6} className="w-full">
              Find classroom
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-6 text-center">
              <p className="text-lg font-semibold">{classroomName}</p>
              <p className="mt-1 text-sm text-muted-foreground">Code: {code.toUpperCase()}</p>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button onClick={handleJoin} disabled={joining} className="w-full">
              {joining ? "Joining..." : "Join this classroom"}
            </Button>
            <button
              onClick={() => { setClassroomName(null); setClassroomId(null); setCode("") }}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Try a different code
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        <Link href="/classroom" className="hover:text-foreground">Back to classrooms</Link>
      </p>
    </div>
  )
}
