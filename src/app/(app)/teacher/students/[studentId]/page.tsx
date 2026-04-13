"use client"

import { use, useState, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ChevronLeft, ChevronDown, ChevronUp, BookOpen, Brain, Flame, Trophy, MessageSquare,
  FileText, Feather, AlertTriangle, Mail, PenLine, Clock, TrendingUp, TrendingDown, Minus
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  getStudentDetail, getStudentReading, getStudentTrials,
  getStudentAnnotations, getStudentDiscussions, getStudentActivity,
  getStudentFlags, getLetterGrade, type StudentTrial
} from "@/lib/classroom-students"
import { getParentsForStudent, getMessagesForStudent } from "@/lib/classroom-parents"

export default function StudentProfilePage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = use(params)
  const searchParams = useSearchParams()
  const fromClassroom = searchParams.get("from")
  const student = getStudentDetail(studentId)
  const [notes, setNotes] = useState(student?.notes ?? "")
  const [notesOpen, setNotesOpen] = useState(false)

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-lg font-medium">Student not found</p>
        <Link href="/classroom" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to classrooms
        </Link>
      </div>
    )
  }

  const backHref = fromClassroom ? `/classroom/${fromClassroom}/manage` : "/classroom"
  const backLabel = fromClassroom
    ? `← Back to ${student.classroomNames[0] ?? "Classroom"}`
    : "← Back to My Classrooms"

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Back link */}
      <Link href={backHref} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="size-4" /> {backLabel}
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="flex size-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
          style={{ backgroundColor: student.avatarColor }}
        >
          {student.name.split(" ").map(n => n[0]).join("").toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-serif font-bold tracking-tight">{student.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {student.email} · {student.gradeLevel} · {student.classroomNames.join(", ")}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Link href={`/teacher/parents?student=${studentId}`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Mail className="size-3.5" /> Message parent
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="gap-1.5">
              <FileText className="size-3.5" /> Send progress report
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="trials">Trials</TabsTrigger>
          <TabsTrigger value="annotations">Annotations</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="parents">Parents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview"><OverviewTab studentId={studentId} student={student} /></TabsContent>
        <TabsContent value="reading"><ReadingTab studentId={studentId} /></TabsContent>
        <TabsContent value="trials"><TrialsTab studentId={studentId} /></TabsContent>
        <TabsContent value="annotations"><AnnotationsTab studentId={studentId} /></TabsContent>
        <TabsContent value="discussions"><DiscussionsTab studentId={studentId} /></TabsContent>
        <TabsContent value="parents"><ParentsTab studentId={studentId} /></TabsContent>
      </Tabs>

      {/* Teacher Notes — collapsible */}
      <div className="mt-8 border-t pt-6">
        <button onClick={() => setNotesOpen(!notesOpen)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <PenLine className="size-3.5" />
          Teacher Notes (private)
          {notesOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
        {notesOpen && (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add private notes about this student (only visible to you)..."
            className="mt-3 w-full rounded-xl border bg-card p-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
            rows={4}
          />
        )}
      </div>
    </div>
  )
}

// ── Tab: Overview ──

function OverviewTab({ studentId, student }: { studentId: string; student: NonNullable<ReturnType<typeof getStudentDetail>> }) {
  const activity = getStudentActivity(studentId)
  const flags = getStudentFlags(studentId)

  return (
    <div className="space-y-6 pt-4">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<Brain className="size-4 text-indigo-500" />} label="Wisdom (XP)" value={student.wisdomXP.toLocaleString()} sub={student.rank} />
        <StatCard icon={<Flame className="size-4 text-orange-500" />} label="Flame Streak" value={`${student.currentStreak} days`} sub={`Longest: ${student.longestStreak}`} />
        <StatCard icon={<Trophy className="size-4 text-amber-500" />} label="Seals Earned" value={String(student.sealsEarned.length)} sub={student.sealsEarned.slice(0, 3).join(", ") || "None yet"} />
      </div>

      {/* Current reading */}
      {student.currentBook && (
        <div className="rounded-xl border bg-card p-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Currently Reading</h3>
          <div className="flex items-center gap-4">
            <div className="relative size-12">
              <svg className="size-12 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted" />
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--tome-accent)" strokeWidth="2" strokeDasharray={`${student.currentBook.progress} ${100 - student.currentBook.progress}`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{student.currentBook.progress}%</span>
            </div>
            <div>
              <p className="text-sm font-medium">{student.currentBook.title}</p>
              <p className="text-xs text-muted-foreground">{student.currentBook.author} · {student.currentBook.unit}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">Last active: {student.currentBook.lastActive}</p>
            </div>
          </div>
        </div>
      )}

      {/* Performance snapshot */}
      <div className="rounded-xl border bg-card p-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Performance Snapshot</h3>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold">{student.avgTrialScore > 0 ? getLetterGrade(student.avgTrialScore) : "—"}</span>
          <span className="text-lg text-muted-foreground">{student.avgTrialScore > 0 ? `${student.avgTrialScore}%` : "No trials yet"}</span>
          <span className="text-xs text-muted-foreground ml-auto">Average Trial score</span>
        </div>
      </div>

      {/* Flags */}
      {flags.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="size-4 text-amber-600" />
            <h3 className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wider">Attention Needed</h3>
          </div>
          <div className="space-y-2">
            {flags.map((flag, i) => (
              <div key={i} className="flex items-center justify-between">
                <p className="text-sm text-amber-800 dark:text-amber-300">{flag.message}</p>
                <Link href={`/teacher/parents?student=${studentId}`}>
                  <Button variant="outline" size="sm" className="text-xs gap-1 border-amber-300">
                    <Mail className="size-3" /> Contact parent
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity feed */}
      <div>
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Recent Activity</h3>
        {activity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          <div className="space-y-2">
            {activity.slice(0, 10).map(ev => (
              <div key={ev.id} className="flex items-start gap-3 rounded-lg border bg-card px-3 py-2.5">
                <ActivityIcon type={ev.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{ev.description}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(ev.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Tab: Reading ──

function ReadingTab({ studentId }: { studentId: string }) {
  const reading = getStudentReading(studentId)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const maxMinutes = Math.max(...reading.weeklyChart, 1)

  return (
    <div className="space-y-6 pt-4">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        <MiniStat label="Total Time" value={`${Math.round(reading.totalMinutes / 60)}h ${reading.totalMinutes % 60}m`} />
        <MiniStat label="Daily Average" value={`${reading.dailyAverage} min`} />
        <MiniStat label="Pages / Week" value={String(reading.pagesPerWeek)} />
        <MiniStat label="Pace Trend" value={reading.paceTrend === "up" ? "↑ Up" : reading.paceTrend === "down" ? "↓ Down" : "— Steady"} />
      </div>

      {/* 7-day chart */}
      <div className="rounded-xl border bg-card p-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Reading Time — Last 7 Days</h3>
        <div className="flex items-end gap-2 h-28">
          {reading.weeklyChart.map((mins, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] text-muted-foreground">{mins}m</span>
              <div className="w-full rounded-t" style={{ height: `${(mins / maxMinutes) * 80}px`, backgroundColor: "var(--tome-accent)", opacity: mins > 0 ? 1 : 0.15 }} />
              <span className="text-[9px] text-muted-foreground">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Books in progress */}
      {reading.booksInProgress.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">In Progress</h3>
          <div className="space-y-2">
            {reading.booksInProgress.map(b => (
              <div key={b.bookId} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                <BookOpen className="size-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{b.title}</p>
                  <p className="text-[10px] text-muted-foreground">{b.author} · {b.tradition} · {b.difficulty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--tome-accent)]" style={{ width: `${b.progress}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{b.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Books completed */}
      {reading.booksCompleted.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Completed</h3>
          <div className="space-y-2">
            {reading.booksCompleted.map(b => (
              <div key={b.bookId} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                <BookOpen className="size-4 text-green-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{b.title}</p>
                  <p className="text-[10px] text-muted-foreground">{b.author} · {b.tradition}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">{new Date(b.completedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tab: Trials ──

function TrialsTab({ studentId }: { studentId: string }) {
  const trials = getStudentTrials(studentId)
  const [sortBy, setSortBy] = useState<"date" | "score" | "difficulty">("date")
  const [expandedTrial, setExpandedTrial] = useState<string | null>(null)

  const sorted = useMemo(() => {
    return [...trials].sort((a, b) => {
      if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === "score") return b.score - a.score
      const diffOrder: Record<string, number> = { Foundational: 1, Scholar: 2, Sage: 3 }
      return (diffOrder[a.difficulty] ?? 0) - (diffOrder[b.difficulty] ?? 0)
    })
  }, [trials, sortBy])

  const avgByDiff = useMemo(() => {
    const groups: Record<string, number[]> = {}
    trials.forEach(t => { (groups[t.difficulty] ??= []).push(t.score) })
    return Object.entries(groups).map(([diff, scores]) => ({
      difficulty: diff,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    }))
  }, [trials])

  const diffColors: Record<string, string> = { Foundational: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400", Scholar: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400", Sage: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400" }

  return (
    <div className="space-y-4 pt-4">
      {/* Summary */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{trials.length} Trials taken</span>
        <div className="flex gap-2 ml-auto">
          {avgByDiff.map(d => (
            <span key={d.difficulty} className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-medium", diffColors[d.difficulty])}>
              {d.difficulty}: {d.avg}%
            </span>
          ))}
        </div>
      </div>

      {/* Sort buttons */}
      <div className="flex gap-1">
        {(["date", "score", "difficulty"] as const).map(s => (
          <button key={s} onClick={() => setSortBy(s)} className={cn("rounded-full px-3 py-1 text-[11px] font-medium transition-colors capitalize", sortBy === s ? "bg-[var(--tome-accent)] text-[#111]" : "bg-muted text-muted-foreground hover:text-foreground")}>
            {s}
          </button>
        ))}
      </div>

      {/* Trial list */}
      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No trials taken yet</p>
      ) : (
        <div className="space-y-2">
          {sorted.map(trial => (
            <div key={trial.id} className={cn("rounded-xl border transition-colors", expandedTrial === trial.id ? "border-[var(--tome-accent)]/30 bg-[var(--tome-accent)]/5" : "bg-card")}>
              <button onClick={() => setExpandedTrial(expandedTrial === trial.id ? null : trial.id)} className="flex items-center gap-3 w-full text-left p-3">
                <span className="text-xs text-muted-foreground w-20 shrink-0">{new Date(trial.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                <span className="text-sm flex-1 truncate">{trial.bookTitle} — {trial.unit}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", diffColors[trial.difficulty])}>{trial.difficulty}</span>
                <span className={cn("text-sm font-medium w-12 text-right", trial.score >= 70 ? "text-green-600" : "text-amber-600")}>{trial.score}%</span>
                <span className="text-xs text-muted-foreground w-10 text-right">+{trial.wisdomEarned}</span>
                {expandedTrial === trial.id ? <ChevronUp className="size-3.5 text-muted-foreground" /> : <ChevronDown className="size-3.5 text-muted-foreground" />}
              </button>
              {expandedTrial === trial.id && (
                <div className="border-t px-4 pb-4 pt-3 space-y-2">
                  <p className="text-xs text-muted-foreground mb-2">Attempts: {trial.attempts}</p>
                  {trial.questions.map((q, qi) => (
                    <div key={qi} className={cn("rounded-lg p-3 text-sm", q.correct ? "bg-green-50 dark:bg-green-950/20" : "bg-red-50 dark:bg-red-950/20")}>
                      <p className="font-medium text-xs">{q.text}</p>
                      <div className="mt-1 flex gap-4 text-[11px]">
                        <span>Student: <strong>{q.studentAnswer}</strong></span>
                        {!q.correct && <span className="text-green-700 dark:text-green-400">Correct: <strong>{q.correctAnswer}</strong></span>}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{q.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Tab: Annotations ──

function AnnotationsTab({ studentId }: { studentId: string }) {
  const annotations = getStudentAnnotations(studentId)
  const [bookFilter, setBookFilter] = useState("")
  const books = [...new Set(annotations.map(a => a.bookTitle))].sort()
  const filtered = bookFilter ? annotations.filter(a => a.bookTitle === bookFilter) : annotations

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{annotations.length} annotation{annotations.length !== 1 ? "s" : ""}</span>
        {books.length > 1 && (
          <select value={bookFilter} onChange={e => setBookFilter(e.target.value)} className="h-7 rounded-md border bg-background px-2 text-xs">
            <option value="">All books</option>
            {books.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        )}
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No annotations yet</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => (
            <div key={a.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium">{a.bookTitle}</span>
                <span className="text-[10px] text-muted-foreground">· {a.unit}</span>
                <span className="text-[10px] text-muted-foreground ml-auto">{new Date(a.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
              <blockquote className="border-l-2 border-muted pl-3 text-xs text-muted-foreground italic mb-2">{a.passage}</blockquote>
              <p className="text-sm">{a.noteText}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Tab: Discussions ──

function DiscussionsTab({ studentId }: { studentId: string }) {
  const discussions = getStudentDiscussions(studentId)
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const thisWeek = discussions.filter(d => new Date(d.timestamp) >= weekAgo).length
  const thisMonth = discussions.filter(d => new Date(d.timestamp) >= monthAgo).length

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">This week: <strong className="text-foreground">{thisWeek}</strong></span>
        <span className="text-sm text-muted-foreground">This month: <strong className="text-foreground">{thisMonth}</strong></span>
      </div>
      {discussions.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No discussion posts yet</p>
      ) : (
        <div className="space-y-3">
          {discussions.map(d => (
            <div key={d.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="size-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">{d.bookTitle}</span>
                <span className="text-[10px] text-muted-foreground">· {d.passageContext}</span>
              </div>
              <p className="text-sm">{d.postText}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] text-muted-foreground">{d.replyCount} replies</span>
                <span className="text-[10px] text-muted-foreground">{new Date(d.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Tab: Parents ──

function ParentsTab({ studentId }: { studentId: string }) {
  const parents = getParentsForStudent(studentId)
  const messages = getMessagesForStudent(studentId).filter(m => !m.isDraft)

  return (
    <div className="space-y-4 pt-4">
      {parents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No parent contacts linked to this student</p>
          <Link href={`/teacher/parents?addFor=${studentId}`}>
            <Button variant="outline" size="sm" className="mt-3">Add parent contact</Button>
          </Link>
        </div>
      ) : (
        <>
          {parents.map(p => {
            const link = p.linkedStudents.find(ls => ls.studentId === studentId)
            return (
              <div key={p.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{p.firstName} {p.lastName}</p>
                    <p className="text-xs text-muted-foreground">{link?.relationship ?? "contact"} · {p.email}{p.phone ? ` · ${p.phone}` : ""}</p>
                  </div>
                  <Link href={`/teacher/parents?parent=${p.id}`}>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Mail className="size-3" /> Message
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}

          {/* Recent messages */}
          {messages.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Recent Messages</h3>
              <div className="space-y-2">
                {messages.slice(0, 5).map(m => (
                  <div key={m.id} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{m.subject}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(m.sentAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {m.messageType}</p>
                    </div>
                    <Badge variant={m.readAt ? "secondary" : "outline"} className="text-[9px]">{m.readAt ? "Read" : "Unread"}</Badge>
                  </div>
                ))}
              </div>
              <Link href={`/teacher/parents?student=${studentId}`} className="text-xs text-muted-foreground hover:text-foreground mt-2 inline-block">
                View all messages →
              </Link>
            </div>
          )}

          <Link href={`/teacher/parents?addFor=${studentId}`}>
            <Button variant="outline" size="sm" className="gap-1.5 mt-2">Add parent contact</Button>
          </Link>
        </>
      )}
    </div>
  )
}

// ── Shared sub-components ──

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1">{icon}<span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span></div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground truncate">{sub}</p>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-3 text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  )
}

function ActivityIcon({ type }: { type: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    trial_completed: <Brain className="size-3.5 text-indigo-500" />,
    book_finished: <BookOpen className="size-3.5 text-green-500" />,
    annotation_written: <PenLine className="size-3.5 text-blue-500" />,
    discussion_posted: <MessageSquare className="size-3.5 text-purple-500" />,
    seal_earned: <Trophy className="size-3.5 text-amber-500" />,
    streak_milestone: <Flame className="size-3.5 text-orange-500" />,
  }
  return <span className="mt-0.5">{iconMap[type] ?? <Clock className="size-3.5 text-muted-foreground" />}</span>
}
