"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Users2, BookOpen, Calendar, Brain, Plus, Check, Clock, UsersRound, LogIn, GraduationCap, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { springs } from "@/lib/design-tokens"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  getStudyGroups, getUserStudyGroups, getNextSession,
  getStudyGroupMembers, type StudyGroup
} from "@/lib/study-groups-data"
import { useAuth } from "@/hooks/use-auth"
import {
  createStudyGroup,
  joinStudyGroupByCode,
  listMyStudyGroups,
  type MyStudyGroupItem,
} from "@/lib/actions/study-groups"

// Default export: dispatch by auth state. Demo UI is preserved verbatim.
export default function StudyGroupsPage() {
  const { user, isDemoMode } = useAuth()
  if (!user || isDemoMode) return <DemoStudyGroupsPage />
  return <RealStudyGroupsPage />
}

function DemoStudyGroupsPage() {
  const userGroups = getUserStudyGroups()
  const allGroups = getStudyGroups()
  const browseGroups = allGroups.filter(g => !userGroups.some(ug => ug.id === g.id))

  // Create form
  const [createName, setCreateName] = useState("")
  const [createClassroom, setCreateClassroom] = useState("class-1")
  const [createBook, setCreateBook] = useState("")
  const [createExamDate, setCreateExamDate] = useState("")
  const [createMax, setCreateMax] = useState(8)
  const [created, setCreated] = useState(false)

  const handleCreate = () => {
    setCreated(true)
    setTimeout(() => { setCreated(false); setCreateName(""); setCreateBook(""); setCreateExamDate(""); setCreateMax(8) }, 1500)
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <UsersRound className="size-6 shrink-0 text-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Study Groups</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Collaborate with classmates on assignments and exams.</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="my-groups">
        <TabsList>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="start">Start a Group</TabsTrigger>
        </TabsList>

        {/* My Groups */}
        <TabsContent value="my-groups">
          <div className="space-y-3 pt-4">
            {userGroups.length === 0 ? (
              <div className="text-center py-12">
                <Users2 className="size-10 text-muted-foreground/20 mx-auto" />
                <p className="text-sm text-muted-foreground mt-3">You're not in any study groups yet</p>
              </div>
            ) : (
              userGroups.map((group, i) => {
                const nextSession = getNextSession(group.id)
                const members = getStudyGroupMembers(group.id)
                return (
                  <BlurFade key={group.id} delay={0.05 * i} inView>
                    <Link href={`/study-groups/${group.id}`}>
                      <motion.div whileHover={{ scale: 1.01 }} transition={springs.interactive} className="rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600">
                            <Brain className="size-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">{group.name}</p>
                              <Badge variant="outline" className="text-[8px] shrink-0">{group.classroomName.split("—")[0].trim()}</Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {group.bookTitle ?? group.assignmentTitle} · {members.length} members
                            </p>
                            {nextSession && (
                              <div className="flex items-center gap-1 mt-1.5 text-[10px] text-indigo-600 dark:text-indigo-400">
                                <Clock className="size-3" />
                                Next: {new Date(nextSession.scheduledAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                                {nextSession.location && ` · ${nextSession.location}`}
                              </div>
                            )}
                            {group.targetExamDate && (
                              <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                                <Calendar className="size-3" />
                                Exam: {new Date(group.targetExamDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </div>
                            )}
                          </div>
                          <div className="flex -space-x-1">
                            {members.slice(0, 4).map(m => (
                              <div key={m.id} className="size-6 rounded-full border-2 border-background text-[7px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: m.avatarColor }}>
                                {m.studentName.charAt(0)}
                              </div>
                            ))}
                            {members.length > 4 && (
                              <div className="size-6 rounded-full border-2 border-background bg-muted text-[7px] font-bold flex items-center justify-center">+{members.length - 4}</div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </BlurFade>
                )
              })
            )}
          </div>
        </TabsContent>

        {/* Browse */}
        <TabsContent value="browse">
          <div className="space-y-3 pt-4">
            {browseGroups.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">No other study groups available in your classrooms</p>
              </div>
            ) : (
              browseGroups.map((group, i) => {
                const members = getStudyGroupMembers(group.id)
                return (
                  <BlurFade key={group.id} delay={0.05 * i} inView>
                    <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Brain className="size-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{group.name}</p>
                        <p className="text-[10px] text-muted-foreground">{group.classroomName} · {members.length}/{group.maxMembers} members</p>
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0">Join</Button>
                    </div>
                  </BlurFade>
                )
              })
            )}
          </div>
        </TabsContent>

        {/* Start a Group */}
        <TabsContent value="start">
          <div className="max-w-md mx-auto pt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Group Name *</label>
              <input type="text" value={createName} onChange={e => setCreateName(e.target.value)} placeholder="e.g. Odyssey Exam Prep" className="w-full h-8 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Classroom</label>
              <select value={createClassroom} onChange={e => setCreateClassroom(e.target.value)} className="w-full h-8 rounded-md border bg-background px-2 text-xs">
                <option value="class-1">AP Literature — Period 3</option>
                <option value="class-2">World Literature — 10th Grade</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Book or Assignment</label>
              <input type="text" value={createBook} onChange={e => setCreateBook(e.target.value)} placeholder="e.g. The Odyssey" className="w-full h-8 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Target Exam Date</label>
                <input type="date" value={createExamDate} onChange={e => setCreateExamDate(e.target.value)} className="w-full h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Max Members</label>
                <input type="number" value={createMax} onChange={e => setCreateMax(Number(e.target.value))} min={2} max={20} className="w-full h-8 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <Button onClick={handleCreate} disabled={!createName || created} className="w-full gap-1.5">
              {created ? <><Check className="size-3.5" /> Group Created!</> : <><Plus className="size-3.5" /> Start Group</>}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ── Real-mode page (authenticated users) ──────────────────────────────────
// Uses the new study_groups table via the action layer. Schema is simpler
// than the demo (no classroom binding, no scheduled sessions, no exam date) —
// those are room for future enrichment.

type RealMode = "list" | "create" | "join"

function RealStudyGroupsPage() {
  const router = useRouter()
  const [groups, setGroups] = useState<MyStudyGroupItem[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<RealMode>("list")
  const [pending, startTransition] = useTransition()

  const refresh = useCallback(async () => {
    try {
      setGroups(await listMyStudyGroups())
    } catch (err) {
      console.error("[study-groups] list failed:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <BlurFade delay={0.04} inView>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1
              className="font-serif text-xl font-semibold tracking-tight md:text-2xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              Study Groups
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {groups.length === 0
                ? "Read together. Create a group or join with a code."
                : `${groups.length} ${groups.length === 1 ? "group" : "groups"}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs"
              onClick={() => setMode((m) => (m === "join" ? "list" : "join"))}
            >
              <LogIn className="size-3.5" />
              Join with code
            </Button>
            <Button
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() =>
                setMode((m) => (m === "create" ? "list" : "create"))
              }
            >
              <Plus className="size-3.5" />
              New group
            </Button>
          </div>
        </div>
      </BlurFade>

      {mode === "create" && (
        <RealCreateForm
          pending={pending}
          onCancel={() => setMode("list")}
          onCreate={(name, description) => {
            startTransition(async () => {
              const result = await createStudyGroup({ name, description })
              if (result.ok) {
                toast.success("Study group created")
                setMode("list")
                await refresh()
                router.push(`/study-groups/${result.data.id}`)
              } else {
                toast.error(result.error)
              }
            })
          }}
        />
      )}

      {mode === "join" && (
        <RealJoinForm
          pending={pending}
          onCancel={() => setMode("list")}
          onJoin={(code) => {
            startTransition(async () => {
              const result = await joinStudyGroupByCode(code)
              if (result.ok) {
                toast.success("Joined")
                setMode("list")
                await refresh()
                router.push(`/study-groups/${result.data.groupId}`)
              } else {
                toast.error(result.error)
              }
            })
          }}
        />
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-border bg-muted/30"
            />
          ))}
        </div>
      ) : groups.length === 0 && mode === "list" ? (
        <BlurFade delay={0.08} inView>
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center">
            <UsersRound className="size-8 text-muted-foreground/40" />
            <p className="font-serif text-sm italic text-muted-foreground">
              No groups yet. Start one with a friend or join with a code.
            </p>
          </div>
        </BlurFade>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {groups.map((g, i) => (
            <BlurFade key={g.id} delay={0.04 + i * 0.04} inView>
              <Link
                href={`/study-groups/${g.id}`}
                className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-[var(--tome-accent)]/30 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                    <UsersRound className="size-4 text-purple-500" />
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {g.myRole === "admin" ? "Admin" : "Member"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold group-hover:text-[var(--tome-accent)]">
                    {g.name}
                  </p>
                  {g.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {g.description}
                    </p>
                  )}
                </div>
                {g.isTeacherLed && (
                  <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#D4A04C]/15 px-2 py-0.5 text-[9px] font-medium text-[#9c6e2b] dark:text-[#D4A04C]">
                    <GraduationCap className="size-2.5" /> Teacher-led
                  </span>
                )}
              </Link>
            </BlurFade>
          ))}
        </div>
      )}
    </div>
  )
}

function RealCreateForm({
  pending,
  onCancel,
  onCreate,
}: {
  pending: boolean
  onCancel: () => void
  onCreate: (name: string, description: string) => void
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-xl border border-border bg-card p-4"
    >
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="size-3.5 text-[#D4A04C]" />
        New study group
      </h2>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. The Aeneid Reading Circle"
            className="h-9 text-sm"
            autoFocus
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Description{" "}
            <span className="text-muted-foreground/50">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What will the group read?"
            rows={2}
            className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--tome-accent)]"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={onCancel}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="text-xs"
            disabled={pending || name.trim().length === 0}
            onClick={() => onCreate(name.trim(), description.trim())}
          >
            {pending ? "Creating…" : "Create group"}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

function RealJoinForm({
  pending,
  onCancel,
  onJoin,
}: {
  pending: boolean
  onCancel: () => void
  onJoin: (code: string) => void
}) {
  const [code, setCode] = useState("")
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-xl border border-border bg-card p-4"
    >
      <h2 className="mb-3 text-sm font-semibold">Join with a code</h2>
      <div className="flex items-center gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="XXXX-XXXX"
          className="h-9 max-w-[200px] font-mono text-sm tracking-wider"
          autoFocus
        />
        <Button
          size="sm"
          className="text-xs"
          disabled={pending || code.trim().length === 0}
          onClick={() => onJoin(code.trim())}
        >
          {pending ? "Joining…" : "Join"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-xs"
          onClick={onCancel}
          disabled={pending}
        >
          Cancel
        </Button>
      </div>
    </motion.div>
  )
}
