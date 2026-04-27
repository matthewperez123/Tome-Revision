"use client"

import { use, useCallback, useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ChevronLeft, Brain, BookOpen, Calendar, Users2, PenLine, Plus,
  Pin, Clock, MapPin, CheckCircle2, XCircle, ChevronDown, ChevronUp,
  GraduationCap, Copy, Check, MessageCircle, LogOut
} from "lucide-react"
import { toast } from "sonner"
import { springs } from "@/lib/design-tokens"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  getStudyGroup, getStudyGroupMembers, getStudySessions,
  getStudyNotes, getPracticeQuizzes
} from "@/lib/study-groups-data"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import {
  leaveStudyGroup,
  deleteStudyGroup,
} from "@/lib/actions/study-groups"

// Default export: dispatch by auth state. Demo UI is preserved verbatim.
export default function StudyGroupDetailPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = use(params)
  const { user, isDemoMode } = useAuth()
  if (!user || isDemoMode) return <DemoStudyGroupDetail groupId={groupId} />
  return <RealStudyGroupDetail groupId={groupId} />
}

function DemoStudyGroupDetail({ groupId }: { groupId: string }) {
  const group = getStudyGroup(groupId)
  const members = getStudyGroupMembers(groupId)
  const sessions = getStudySessions(groupId)
  const notes = getStudyNotes(groupId)
  const quizzes = getPracticeQuizzes(groupId)

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-sm text-muted-foreground">Study group not found</p>
        <Link href="/study-groups" className="text-xs text-muted-foreground hover:text-foreground">← Back</Link>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Back */}
      <Link href="/study-groups" className="mb-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-3.5" /> Back to study groups
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600">
          <Brain className="size-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-serif font-bold">{group.name}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {group.bookTitle ?? group.assignmentTitle} · {group.classroomName}
          </p>
          {group.targetExamDate && (
            <div className="flex items-center gap-1 mt-1 text-xs text-indigo-600 dark:text-indigo-400">
              <Calendar className="size-3" /> Exam: {new Date(group.targetExamDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
          )}
        </div>
        <div className="flex -space-x-1.5">
          {members.slice(0, 5).map(m => (
            <div key={m.id} className="size-8 rounded-full border-2 border-background text-[9px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: m.avatarColor }}>
              {m.studentName.split(" ").map(n => n[0]).join("")}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <div className="space-y-3 pt-4">
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No shared notes yet</p>
            ) : (
              notes.map(note => (
                <div key={note.id} className={cn("rounded-xl border bg-card p-4", note.isPinned && "border-amber-200 dark:border-amber-800")}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-6 rounded-full text-[8px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: note.avatarColor }}>
                      {note.authorName.charAt(0)}
                    </div>
                    <span className="text-xs font-medium">{note.authorName}</span>
                    {note.isPinned && <Pin className="size-3 text-amber-500" />}
                    {note.anchorUnit && <Badge variant="outline" className="text-[8px]">{note.anchorUnit}</Badge>}
                    <span className="text-[10px] text-muted-foreground ml-auto">{new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                  {note.anchorQuote && (
                    <blockquote className="border-l-2 border-muted pl-3 mb-2 text-xs text-muted-foreground italic">"{note.anchorQuote}"</blockquote>
                  )}
                  <div className="text-sm whitespace-pre-line leading-relaxed">{note.body}</div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Practice Tab */}
        <TabsContent value="practice">
          <div className="space-y-4 pt-4">
            {quizzes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No practice quizzes yet</p>
            ) : (
              quizzes.map(quiz => (
                <PracticeQuizCard key={quiz.id} quiz={quiz} />
              ))
            )}
          </div>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <div className="space-y-3 pt-4">
            {sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No sessions scheduled</p>
            ) : (
              <>
                {sessions.filter(s => s.status === "upcoming").length > 0 && (
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Upcoming</h3>
                    {sessions.filter(s => s.status === "upcoming").map(session => (
                      <div key={session.id} className="rounded-xl border bg-card p-4 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/30">
                            <Calendar className="size-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{new Date(session.scheduledAt).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                            <div className="flex items-center gap-3 mt-0.5 text-[10px] text-muted-foreground">
                              <span className="flex items-center gap-0.5"><Clock className="size-3" />{session.durationMinutes} min</span>
                              <span className="flex items-center gap-0.5"><MapPin className="size-3" />{session.location}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{session.agenda}</p>
                      </div>
                    ))}
                  </div>
                )}
                {sessions.filter(s => s.status === "completed").length > 0 && (
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 mt-4">Past</h3>
                    {sessions.filter(s => s.status === "completed").map(session => (
                      <div key={session.id} className="rounded-xl border bg-card p-4 mb-2 opacity-70">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm">{new Date(session.scheduledAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                            <p className="text-[10px] text-muted-foreground">{session.attendance.length} attended · {session.location}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
            {members.map(member => (
              <div key={member.id} className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center">
                <div className="flex size-12 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: member.avatarColor }}>
                  {member.studentName.split(" ").map(n => n[0]).join("").toUpperCase()}
                </div>
                <p className="text-sm font-medium">{member.studentName}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{member.wisdomXP.toLocaleString()} XP</span>
                  <span>·</span>
                  <span>{member.readingProgress}% read</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ── Practice Quiz Card with expandable results ──

function PracticeQuizCard({ quiz }: { quiz: ReturnType<typeof getPracticeQuizzes>[0] }) {
  const [expanded, setExpanded] = useState(false)
  const avgScore = quiz.attempts.length > 0
    ? Math.round(quiz.attempts.reduce((s, a) => s + a.score, 0) / quiz.attempts.length)
    : 0
  const highMiss = quiz.questionResults.filter(q => q.correctRate < 50).sort((a, b) => a.correctRate - b.correctRate)

  return (
    <div className={cn("rounded-xl border bg-card transition-colors", expanded && "border-indigo-200 dark:border-indigo-800")}>
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-3 w-full text-left p-4">
        <Brain className="size-4 text-indigo-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{quiz.title}</p>
          <p className="text-[10px] text-muted-foreground">{quiz.questionCount} questions · {quiz.attempts.length} attempts · Avg: {avgScore}%</p>
        </div>
        {expanded ? <ChevronUp className="size-3.5 text-muted-foreground" /> : <ChevronDown className="size-3.5 text-muted-foreground" />}
      </button>
      {expanded && (
        <div className="border-t px-4 pb-4 pt-3 space-y-3">
          {/* Attempts */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1.5">Individual Scores</h4>
            <div className="flex flex-wrap gap-2">
              {quiz.attempts.map((a, i) => (
                <span key={i} className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-medium", a.score >= 80 ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" : a.score >= 60 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400")}>
                  {a.studentName.split(" ")[0]}: {a.score}%
                </span>
              ))}
            </div>
          </div>
          {/* High-miss questions */}
          {highMiss.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1.5">Questions the Group Struggled With</h4>
              <div className="space-y-1.5">
                {highMiss.map((q, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/10 p-2">
                    <XCircle className="size-3.5 text-amber-500 shrink-0" />
                    <span className="text-xs flex-1">{q.question}</span>
                    <span className="text-[10px] font-medium text-amber-600">{q.correctRate}% correct</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* All questions */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1.5">All Questions</h4>
            <div className="space-y-1">
              {quiz.questionResults.map((q, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden shrink-0">
                    <div className="h-full rounded-full" style={{ width: `${q.correctRate}%`, backgroundColor: q.correctRate >= 75 ? "#22C55E" : q.correctRate >= 50 ? "#F59E0B" : "#EF4444" }} />
                  </div>
                  <span className="text-muted-foreground w-10 shrink-0 text-right">{q.correctRate}%</span>
                  <span className="truncate">{q.question}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Real-mode detail page ─────────────────────────────────────────────────

interface RealMember {
  id: string
  displayName: string
  username: string
  avatarUrl: string | null
  role: "admin" | "member"
}

interface RealGroup {
  id: string
  name: string
  description: string | null
  joinCode: string
  isTeacherLed: boolean
  creatorId: string
}

function RealStudyGroupDetail({ groupId }: { groupId: string }) {
  const router = useRouter()
  const { user } = useAuth()
  const [group, setGroup] = useState<RealGroup | null>(null)
  const [members, setMembers] = useState<RealMember[]>([])
  const [loading, setLoading] = useState(true)
  const [pending, startTransition] = useTransition()
  const [copied, setCopied] = useState(false)

  const fetchAll = useCallback(async () => {
    if (!user) return
    const supabase = createClient()
    const [groupRes, membersRes] = await Promise.all([
      supabase
        .from("study_groups")
        .select("id, name, description, join_code, is_teacher_led, creator_id")
        .eq("id", groupId)
        .maybeSingle(),
      supabase
        .from("study_group_members")
        .select(
          `
          role,
          user:profiles!study_group_members_user_id_fkey(id, display_name, username, avatar_url)
        `,
        )
        .eq("group_id", groupId),
    ])

    type GroupRow = {
      id: string
      name: string
      description: string | null
      join_code: string
      is_teacher_led: boolean
      creator_id: string
    }
    type MemberRow = {
      role: "admin" | "member"
      user: {
        id: string
        display_name: string | null
        username: string | null
        avatar_url: string | null
      } | null
    }

    const g = groupRes.data as unknown as GroupRow | null
    if (g) {
      setGroup({
        id: g.id,
        name: g.name,
        description: g.description,
        joinCode: g.join_code,
        isTeacherLed: g.is_teacher_led,
        creatorId: g.creator_id,
      })
    }
    setMembers(
      ((membersRes.data ?? []) as unknown as MemberRow[])
        .filter((r) => r.user)
        .map((r) => ({
          id: r.user!.id,
          displayName: r.user!.display_name ?? r.user!.username ?? "Reader",
          username: r.user!.username ?? r.user!.id.slice(0, 8),
          avatarUrl: r.user!.avatar_url,
          role: r.role,
        })),
    )
    setLoading(false)
  }, [groupId, user])

  useEffect(() => { fetchAll() }, [fetchAll])

  function copyCode() {
    if (!group) return
    navigator.clipboard.writeText(group.joinCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl p-4 md:p-6">
        <div className="h-32 animate-pulse rounded-2xl border border-border bg-muted/30" />
      </div>
    )
  }
  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <p className="text-sm text-muted-foreground">Study group not found</p>
        <Link href="/study-groups" className="text-xs text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
      </div>
    )
  }

  const myMembership = members.find((m) => m.id === user?.id)
  const isCreator = user?.id === group.creatorId

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      <Link
        href="/study-groups"
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Study Groups
      </Link>

      <BlurFade delay={0.04} inView>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1
              className="font-serif text-xl font-semibold tracking-tight md:text-2xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              {group.name}
            </h1>
            {group.description && (
              <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
            )}
            <div className="mt-2 flex items-center gap-2">
              {group.isTeacherLed && (
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#D4A04C]/15 px-2 py-0.5 text-[10px] font-medium text-[#9c6e2b] dark:text-[#D4A04C]">
                  <GraduationCap className="size-2.5" /> Teacher-led
                </span>
              )}
              <span className="text-[10px] text-muted-foreground">
                {members.length} {members.length === 1 ? "member" : "members"}
              </span>
            </div>
          </div>
          {myMembership && (
            <button
              type="button"
              onClick={copyCode}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 transition-colors hover:bg-muted/50"
              aria-label="Copy join code"
            >
              <span className="font-mono text-xs tracking-wider">{group.joinCode}</span>
              {copied ? (
                <Check className="size-3.5 text-[#22C55E]" />
              ) : (
                <Copy className="size-3.5 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </BlurFade>

      <BlurFade delay={0.08} inView>
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Users2 className="size-4 text-purple-500" />
            <h2 className="text-sm font-semibold">Members</h2>
          </div>
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-lg px-1 py-1.5">
                {m.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.avatarUrl} alt="" className="size-8 rounded-full border border-[#D4A04C]/20" />
                ) : (
                  <div className="flex size-8 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                    {m.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/profile/${m.username}`}
                    className="text-sm font-medium hover:text-[var(--tome-accent)]"
                  >
                    {m.displayName}
                  </Link>
                </div>
                {m.role === "admin" && (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Admin
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </BlurFade>

      {/* Discussion stub */}
      <BlurFade delay={0.12} inView>
        <section className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
          <div className="mb-2 flex items-center gap-2">
            <MessageCircle className="size-4 text-muted-foreground/60" />
            <h2 className="text-sm font-semibold">Discussions</h2>
          </div>
          <p className="text-xs italic text-muted-foreground">
            Threaded discussion is coming next. The bones are here — talk to your group elsewhere for now.
          </p>
        </section>
      </BlurFade>

      {/* Shared annotations stub */}
      <BlurFade delay={0.14} inView>
        <section className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
          <div className="mb-2 flex items-center gap-2">
            <PenLine className="size-4 text-muted-foreground/60" />
            <h2 className="text-sm font-semibold">Shared annotations</h2>
          </div>
          <p className="text-xs italic text-muted-foreground">
            When members highlight a passage, it'll appear here for the whole group.
          </p>
        </section>
      </BlurFade>

      {/* Actions */}
      <BlurFade delay={0.16} inView>
        <div className="flex items-center justify-end gap-2">
          {myMembership && !isCreator && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs"
              disabled={pending}
              onClick={() => startTransition(async () => {
                const r = await leaveStudyGroup(group.id)
                if (r.ok) { toast.success("Left the group"); router.push("/study-groups") }
                else toast.error(r.error)
              })}
            >
              <LogOut className="size-3.5" /> Leave group
            </Button>
          )}
          {isCreator && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-rose-500/30 text-xs text-rose-500/80 hover:bg-rose-500/10"
              disabled={pending}
              onClick={() => startTransition(async () => {
                if (!confirm("Delete this group? This cannot be undone.")) return
                const r = await deleteStudyGroup(group.id)
                if (r.ok) { toast.success("Group deleted"); router.push("/study-groups") }
                else toast.error(r.error)
              })}
            >
              Delete group
            </Button>
          )}
        </div>
      </BlurFade>
    </div>
  )
}
