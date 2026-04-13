"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Users2, BookOpen, Calendar, Brain, Plus, Check, Clock } from "lucide-react"
import { springs } from "@/lib/design-tokens"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  getStudyGroups, getUserStudyGroups, getNextSession,
  getStudyGroupMembers, type StudyGroup
} from "@/lib/study-groups-data"

export default function StudyGroupsPage() {
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
        <div>
          <h1 className="text-xl font-serif font-semibold tracking-tight md:text-2xl">Study Groups</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Collaborate with classmates on assignments and exams.</p>
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
