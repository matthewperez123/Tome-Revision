"use client"

// Opt out of static prerendering — this page imports Supabase via
// useAuth/createClient, and @supabase/ssr's newer release validates the
// URL/anon-key at module init even with placeholder fallbacks, which
// breaks Vercel's build-time page-data collection when real env vars
// aren't present at build time. Rendering dynamically on the server
// (with envs available at request time) sidesteps this.
export const dynamic = "force-dynamic"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { GraduationCap, Copy, Check, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClassroom } from "@/lib/actions/classrooms"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

const SUBJECTS = [
  "English Literature",
  "AP Literature & Composition",
  "World Literature",
  "Great Books",
  "Humanities",
  "Philosophy",
  "Other",
]

const GRADE_LEVELS = [
  "Middle School",
  "High School 9-10",
  "High School 11-12",
  "College/University",
  "Adult Education",
]

export default function CreateClassroomPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [subject, setSubject] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [maxStudents, setMaxStudents] = useState(35)
  const [creating, setCreating] = useState(false)
  const [createdCode, setCreatedCode] = useState<string | null>(null)
  const [createdId, setCreatedId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = useCallback(async () => {
    if (!name.trim() || !user) return
    setCreating(true)
    setError(null)

    try {
      // Route through the server action: it bootstraps the owner
      // classroom_members row (RLS can't create the first owner row from the
      // browser) and guarantees a unique join code. A direct client insert
      // would orphan the classroom — no membership row means it never shows
      // up in the dashboard, which queries classroom_members.
      const result = await createClassroom({
        name: name.trim(),
        description: description.trim() || undefined,
        subject: subject || undefined,
        gradeLevel: gradeLevel || undefined,
        maxStudents,
      })

      if (!result.ok) {
        setError(result.error)
        return
      }

      setCreatedCode(result.data.joinCode)
      setCreatedId(result.data.id)
    } catch {
      setError("Failed to create classroom")
    } finally {
      setCreating(false)
    }
  }, [name, description, subject, gradeLevel, maxStudents, user])

  // Success state — show join code
  if (createdCode && createdId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex size-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30">
            <Check className="size-8 text-green-600" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Classroom created!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Share this code with your students so they can join
          </p>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border-2 border-[#D4A04C]/30 bg-[#D4A04C]/5 px-8 py-6">
            <span className="font-mono text-4xl font-bold tracking-[0.2em]">
              {createdCode}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(createdCode)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {copied ? <Check className="size-5 text-green-500" /> : <Copy className="size-5" />}
            </button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Join link: <span className="font-mono font-medium">tome.app/join/{createdCode}</span>
          </p>

          <div className="mt-8 flex gap-3">
            <Link href={`/classroom/${createdId}/manage`}>
              <Button>Go to Classroom</Button>
            </Link>
            <Link href="/classroom">
              <Button variant="outline">All Classrooms</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link
        href="/classroom"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to classrooms
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-[#D4A04C]/10">
          <GraduationCap className="size-6 text-[#D4A04C]" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Create a Classroom</h1>
          <p className="text-sm text-muted-foreground">Set up a new classroom for your students</p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor="name">
            Classroom name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            placeholder="AP Lit Period 3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Optional description for your students"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Subject</label>
          <div className="grid grid-cols-2 gap-2">
            {SUBJECTS.map((s) => (
              <button
                key={s}
                onClick={() => setSubject(subject === s ? "" : s)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                  subject === s
                    ? "border-[#D4A04C] bg-[#D4A04C]/10"
                    : "border-border text-muted-foreground hover:border-foreground/20"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Grade Level */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Grade Level</label>
          <div className="flex flex-wrap gap-2">
            {GRADE_LEVELS.map((g) => (
              <button
                key={g}
                onClick={() => setGradeLevel(gradeLevel === g ? "" : g)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  gradeLevel === g
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300"
                    : "border-border text-muted-foreground hover:border-foreground/20"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Max Students */}
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor="maxStudents">
            Max students
          </label>
          <Input
            id="maxStudents"
            type="number"
            min={1}
            max={100}
            value={maxStudents}
            onChange={(e) => setMaxStudents(Number(e.target.value))}
            className="w-24"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          onClick={handleCreate}
          disabled={!name.trim() || creating}
          className="w-full"
        >
          {creating ? "Creating..." : "Create Classroom"}
        </Button>
      </div>
    </div>
  )
}
