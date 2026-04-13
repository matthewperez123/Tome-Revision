"use client"

import { use, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ChevronLeft, Brain, BookOpen, Calendar, Users2, PenLine, Plus,
  Pin, Clock, MapPin, CheckCircle2, XCircle, ChevronDown, ChevronUp
} from "lucide-react"
import { springs } from "@/lib/design-tokens"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  getStudyGroup, getStudyGroupMembers, getStudySessions,
  getStudyNotes, getPracticeQuizzes
} from "@/lib/study-groups-data"

export default function StudyGroupDetailPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = use(params)
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
