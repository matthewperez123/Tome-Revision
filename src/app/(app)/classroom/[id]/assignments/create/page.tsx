"use client"

import { use, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  BookOpen, Brain, MessageCircle, PenTool, Highlighter,
  ChevronLeft, ChevronRight, ArrowLeft, PencilLine, Link2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { getBooks } from "@/lib/content"
import { getUnitLabel } from "@/lib/structural-units"
import {
  QuizQuestionEditor,
  type QuizQuestion,
} from "@/components/classroom/quiz-question-editor"
import {
  createTeacherQuiz,
  saveTeacherQuiz,
  publishTeacherQuiz,
} from "@/lib/actions/teacher-quizzes"

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

  // Quiz authoring (type === "quiz"): write questions inline, or attach one of
  // the teacher's already-published quizzes.
  const [quizMode, setQuizMode] = useState<"inline" | "existing">("inline")
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [existingQuizzes, setExistingQuizzes] = useState<{ id: string; title: string }[]>([])
  const [selectedQuizId, setSelectedQuizId] = useState("")

  const books = getBooks()
  const filteredBooks = bookSearch
    ? books.filter((b) =>
        b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
        b.author.toLowerCase().includes(bookSearch.toLowerCase()),
      ).slice(0, 8)
    : books.slice(0, 8)

  const selectedBook = books.find((b) => b.id === bookId)

  // Load the teacher's published quizzes once, for the "attach existing" picker.
  useEffect(() => {
    if (!user || type !== "quiz") return
    let active = true
    const supabase = createClient()
    supabase
      .from("teacher_quizzes")
      .select("id, title")
      .eq("teacher_id", user.id)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (active && data) setExistingQuizzes(data)
      })
    return () => {
      active = false
    }
  }, [user, type])

  const handleCreate = useCallback(async () => {
    if (!user || !type || !dueDate) return
    setCreating(true)
    setError(null)

    const supabase = createClient()

    const assignmentTitle = title.trim() ||
      (selectedBook ? `${selectedBook.title} — ${type}` : `${type} assignment`)

    // For a quiz assignment, resolve the backing teacher_quizzes row: either
    // author it inline (create → save questions → publish) or attach an existing
    // published quiz. quiz_id is what lets the student launch and be graded.
    let quizId: string | null = null
    if (type === "quiz") {
      if (quizMode === "existing") {
        if (!selectedQuizId) {
          setError("Pick a quiz to attach, or switch to writing questions.")
          setCreating(false)
          return
        }
        quizId = selectedQuizId
      } else {
        const usable = quizQuestions.filter((q) => q.question_text.trim().length > 0)
        if (usable.length === 0) {
          setError("Add at least one question, or attach an existing quiz.")
          setCreating(false)
          return
        }
        const created = await createTeacherQuiz({
          title: assignmentTitle,
          bookId: bookId || undefined,
          chapterRangeStart: chapterStart,
          chapterRangeEnd: chapterEnd,
        })
        if (!created.ok) {
          setError(created.error)
          setCreating(false)
          return
        }
        const saved = await saveTeacherQuiz({
          quizId: created.data.id,
          title: assignmentTitle,
          bookId: bookId || null,
          settings: {
            timeLimit: null,
            passingScore: 60,
            allowRetakes: true,
            randomizeOrder: true,
            showAnswers: true,
          },
          questions: usable.map((q) => ({
            question_type: q.question_type,
            question_text: q.question_text,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation || null,
            points: q.points,
            rubric: q.rubric,
            reference_answer: q.reference_answer ?? null,
            max_points: q.max_points ?? null,
          })),
        })
        if (!saved.ok) {
          setError(saved.error)
          setCreating(false)
          return
        }
        const published = await publishTeacherQuiz(created.data.id)
        if (!published.ok) {
          setError(published.error)
          setCreating(false)
          return
        }
        quizId = created.data.id
      }
    }

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
        quiz_id: quizId,
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
  }, [user, type, title, description, bookId, chapterStart, chapterEnd, discussionPrompt, essayPrompt, dueDate, points, classroomId, router, selectedBook, quizMode, selectedQuizId, quizQuestions])

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

            {type === "quiz" && (
              <div>
                <div className="mb-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setQuizMode("inline")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      quizMode === "inline"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <PencilLine className="size-4" /> Write questions
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizMode("existing")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      quizMode === "existing"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Link2 className="size-4" /> Attach existing
                  </button>
                </div>

                {quizMode === "inline" ? (
                  <QuizQuestionEditor questions={quizQuestions} onChange={setQuizQuestions} />
                ) : existingQuizzes.length === 0 ? (
                  <p className="rounded-lg border border-dashed bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                    You have no published quizzes yet. Switch to “Write questions” to author one here.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {existingQuizzes.map((qz) => (
                      <button
                        key={qz.id}
                        type="button"
                        onClick={() => setSelectedQuizId(qz.id)}
                        className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                          selectedQuizId === qz.id
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <Brain className="size-4 text-muted-foreground" />
                        <span className="flex-1 truncate">{qz.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
