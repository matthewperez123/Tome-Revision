"use client"

import { use, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen, Brain, MessageCircle, PenTool, Highlighter,
  ChevronLeft, ChevronRight, Calendar, ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { getBooks } from "@/lib/content"
import { getUnitLabel } from "@/lib/structural-units"
import type { StructuralUnitType } from "@/data/books"

type AssignmentType = "reading" | "quiz" | "discussion" | "essay" | "annotation"

const TYPES: { key: AssignmentType; label: string; description: string; icon: typeof BookOpen }[] = [
  { key: "reading", label: "Reading", description: "Assign chapters for students to read", icon: BookOpen },
  { key: "quiz", label: "Quiz", description: "Assign a quiz on specific chapters", icon: Brain },
  { key: "discussion", label: "Discussion", description: "Post a discussion prompt", icon: MessageCircle },
  { key: "essay", label: "Essay", description: "Assign a written literary analysis", icon: PenTool },
  { key: "annotation", label: "Annotation", description: "Have students annotate passages", icon: Highlighter },
]

export default function CreateAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: classroomId } = use(params)
  const router = useRouter()
  const { user } = useAuth()

  const [step, setStep] = useState(0) // 0=type, 1=content, 2=details
  const [type, setType] = useState<AssignmentType | null>(null)
  const [bookId, setBookId] = useState("")
  const [bookSearch, setBookSearch] = useState("")
  const [chapterStart, setChapterStart] = useState(1)
  const [chapterEnd, setChapterEnd] = useState(5)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [discussionPrompt, setDiscussionPrompt] = useState("")
  const [essayPrompt, setEssayPrompt] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [points, setPoints] = useState(100)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const books = getBooks()
  const filteredBooks = bookSearch
    ? books.filter((b) =>
        b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
        b.author.toLowerCase().includes(bookSearch.toLowerCase()),
      ).slice(0, 8)
    : books.slice(0, 8)

  const selectedBook = books.find((b) => b.id === bookId)

  const handleCreate = useCallback(async () => {
    if (!user || !type || !dueDate) return
    setCreating(true)
    setError(null)

    const supabase = createClient()

    const assignmentTitle = title.trim() ||
      (selectedBook ? `${selectedBook.title} — ${type}` : `${type} assignment`)

    const { error: insertError } = await supabase
      .from("assignments")
      .insert({
        classroom_id: classroomId,
        teacher_id: user.id,
        type,
        title: assignmentTitle,
        description: description.trim() || null,
        book_id: bookId || null,
        chapter_range_start: chapterStart,
        chapter_range_end: chapterEnd,
        discussion_prompt: discussionPrompt.trim() || null,
        essay_prompt: essayPrompt.trim() || null,
        due_date: new Date(dueDate).toISOString(),
        points_available: points,
        status: "active",
      })

    if (insertError) {
      setError(insertError.message)
      setCreating(false)
      return
    }

    router.push(`/classroom/${classroomId}/manage`)
  }, [user, type, title, description, bookId, chapterStart, chapterEnd, discussionPrompt, essayPrompt, dueDate, points, classroomId, router, selectedBook])

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link
        href={`/classroom/${classroomId}/manage`}
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to classroom
      </Link>

      <h1 className="text-xl font-bold">Create Assignment</h1>

      {/* Progress */}
      <div className="mt-4 flex gap-2">
        {["Type", "Content", "Details"].map((label, i) => (
          <div key={label} className="flex-1">
            <div className={`h-1 rounded-full ${i <= step ? "bg-foreground" : "bg-muted"}`} />
            <span className="mt-1 block text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        {/* Step 0: Choose type */}
        {step === 0 && (
          <div className="space-y-3">
            {TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => { setType(t.key); setStep(1) }}
                className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors hover:border-foreground/20 ${
                  type === t.key ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" : "border-border"
                }`}
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <t.icon className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 1: Select content */}
        {step === 1 && type && (
          <div className="space-y-5">
            {(type === "reading" || type === "quiz" || type === "annotation") && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Select a book</label>
                  <Input
                    placeholder="Search books..."
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                  />
                  <div className="mt-2 max-h-48 space-y-1 overflow-y-auto">
                    {filteredBooks.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => { setBookId(b.id); setChapterEnd(Math.min(b.chapters, chapterEnd)) }}
                        className={`flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm transition-colors ${
                          bookId === b.id ? "bg-indigo-50 dark:bg-indigo-950/30" : "hover:bg-muted/50"
                        }`}
                      >
                        <span className="font-medium truncate">{b.title}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{b.author}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {bookId && selectedBook && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">{getUnitLabel((selectedBook as any).structuralUnitType ?? 'chapter')} range</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={selectedBook.chapters}
                        value={chapterStart}
                        onChange={(e) => setChapterStart(Number(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">to</span>
                      <Input
                        type="number"
                        min={chapterStart}
                        max={selectedBook.chapters}
                        value={chapterEnd}
                        onChange={(e) => setChapterEnd(Number(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-xs text-muted-foreground">of {selectedBook.chapters} {getUnitLabel((selectedBook as any).structuralUnitType ?? 'chapter', selectedBook.chapters !== 1).toLowerCase()}</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {type === "discussion" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium">Discussion prompt</label>
                <textarea
                  value={discussionPrompt}
                  onChange={(e) => setDiscussionPrompt(e.target.value)}
                  placeholder="What question do you want students to discuss?"
                  rows={4}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}

            {type === "essay" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium">Essay prompt</label>
                <textarea
                  value={essayPrompt}
                  onChange={(e) => setEssayPrompt(e.target.value)}
                  placeholder="What should students write about?"
                  rows={4}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)}>
                <ChevronLeft className="size-3.5 mr-1" /> Back
              </Button>
              <Button onClick={() => setStep(2)} className="flex-1">
                Continue <ChevronRight className="size-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && type && (
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Assignment title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={selectedBook ? `${selectedBook.title} — Chapters ${chapterStart}-${chapterEnd}` : "Assignment title"}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Instructions (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional instructions for students..."
                rows={2}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Due date <span className="text-red-500">*</span>
              </label>
              <Input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Points</label>
              <Input
                type="number"
                min={0}
                max={1000}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-24"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="size-3.5 mr-1" /> Back
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!dueDate || creating}
                className="flex-1"
              >
                {creating ? "Creating..." : "Publish Assignment"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
