"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Feather, Edit3, Sparkles, X, Copy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { getBooks } from "@/lib/content"
import { duplicateTeacherQuiz } from "@/lib/actions/teacher-quizzes"

interface TeacherQuiz {
  id: string
  title: string
  book_id: string | null
  difficulty: string | null
  status: string
  question_count: number
  created_at: string
}

export default function QuizBuilderPage() {
  const { user, isDemoMode } = useAuth()
  const [quizzes, setQuizzes] = useState<TeacherQuiz[]>([])
  const [loading, setLoading] = useState(true)
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)

  // "Generate with Virgil" — creates a fully-authored draft via the teacher
  // task pipeline (POST /api/virgil task=teacher_quiz), then opens it.
  const [genOpen, setGenOpen] = useState(false)
  const [genBookId, setGenBookId] = useState("")
  const [genBookSearch, setGenBookSearch] = useState("")
  const [genStart, setGenStart] = useState(1)
  const [genEnd, setGenEnd] = useState(3)
  const [genCount, setGenCount] = useState(8)
  const [genDifficulty, setGenDifficulty] = useState<"apprentice" | "scholar" | "master">("scholar")
  const [genBrief, setGenBrief] = useState("")
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)

  const books = getBooks()
  const genBook = books.find((b) => b.id === genBookId)
  const genFilteredBooks = genBookSearch
    ? books
        .filter(
          (b) =>
            b.title.toLowerCase().includes(genBookSearch.toLowerCase()) ||
            b.author.toLowerCase().includes(genBookSearch.toLowerCase()),
        )
        .slice(0, 6)
    : []

  async function handleGenerate() {
    if (!genBookId || generating) return
    setGenerating(true)
    setGenError(null)
    try {
      const res = await fetch("/api/virgil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "teacher_quiz",
          input: {
            bookId: genBookId,
            // Chapter numbers are 1-based in the UI; the content index is 0-based.
            chapterStart: Math.max(0, genStart - 1),
            chapterEnd: Math.max(0, genEnd - 1),
            questionCount: genCount,
            difficulty: genDifficulty,
            brief: genBrief.trim() || undefined,
          },
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setGenError(body?.message || body?.error || "Virgil couldn't generate that quiz.")
        setGenerating(false)
        return
      }
      const draftId = body?.draft?.id as string | undefined
      if (draftId) {
        window.location.href = `/classroom/quiz-builder/${draftId}`
        return
      }
      setGenError("Quiz generated, but no draft was returned.")
    } catch {
      setGenError("Something went wrong reaching Virgil.")
    }
    setGenerating(false)
  }

  useEffect(() => {
    if (isDemoMode || !user) {
      setQuizzes([])
      setLoading(false)
      return
    }

    async function fetchQuizzes() {
      const supabase = createClient()

      const { data } = await supabase
        .from("teacher_quizzes")
        .select("id, title, book_id, difficulty, status, created_at")
        .eq("teacher_id", user!.id)
        .order("created_at", { ascending: false })

      const withCounts = await Promise.all(
        (data ?? []).map(async (q) => {
          const { count } = await supabase
            .from("teacher_quiz_questions")
            .select("*", { count: "exact", head: true })
            .eq("quiz_id", q.id)
          return { ...q, question_count: count ?? 0 }
        }),
      )
      setQuizzes(withCounts)

      setLoading(false)
    }

    fetchQuizzes()
  }, [user, isDemoMode])

  async function handleDuplicate(quizId: string) {
    if (isDemoMode || !user || duplicatingId) return
    setDuplicatingId(quizId)
    const res = await duplicateTeacherQuiz(quizId)
    if (res.ok) {
      window.location.href = `/classroom/quiz-builder/${res.data.id}`
    } else {
      toast.error(res.error)
      setDuplicatingId(null)
    }
  }

  async function createNewQuiz() {
    if (isDemoMode || !user) {
      // Demo mode: create a local ID and navigate
      const demoId = `new-${Date.now()}`
      window.location.href = `/classroom/quiz-builder/${demoId}`
      return
    }
    const supabase = createClient()

    const { data, error } = await supabase
      .from("teacher_quizzes")
      .insert({
        teacher_id: user.id,
        title: "Untitled Quiz",
        status: "draft",
      })
      .select("id")
      .single()

    if (data) {
      window.location.href = `/classroom/quiz-builder/${data.id}`
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Feather className="size-6 text-foreground" />
          <h1 className="text-2xl font-bold">Quiz Builder</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setGenOpen(true)}
            className="gap-1.5 border-[var(--tome-accent)]/30 text-[var(--tome-accent)] hover:bg-[var(--tome-accent)]/5"
          >
            <Sparkles className="size-4" />
            Generate with Virgil
          </Button>
          <Button onClick={createNewQuiz} className="gap-1.5">
            <Plus className="size-4" />
            New Quiz
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl border bg-muted" />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="mt-12 flex flex-col items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-[var(--tome-accent)]">
            <Feather className="size-7 text-white" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No quizzes yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first quiz to assign to your students
          </p>
          <Button onClick={createNewQuiz} className="mt-4 gap-1.5">
            <Plus className="size-4" />
            Create your first quiz
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {quizzes.map((quiz, i) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-stretch gap-2"
            >
              <Link
                href={`/classroom/quiz-builder/${quiz.id}`}
                className="flex flex-1 items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--tome-accent)]">
                  <Feather className="size-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{quiz.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {quiz.question_count} questions · {quiz.difficulty ?? "No difficulty set"}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  quiz.status === "published"
                    ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {quiz.status}
                </span>
                <Edit3 className="size-4 text-muted-foreground" />
              </Link>
              <button
                type="button"
                onClick={() => handleDuplicate(quiz.id)}
                disabled={isDemoMode || !user || duplicatingId === quiz.id}
                title="Duplicate quiz"
                className="flex items-center justify-center rounded-xl border bg-card px-3 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
              >
                <Copy className="size-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Generate-with-Virgil modal */}
      <AnimatePresence>
        {genOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => !generating && setGenOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border bg-card p-5 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--tome-accent)]">
                    <Sparkles className="size-4 text-white" />
                  </div>
                  <h2 className="text-base font-semibold">Generate a quiz with Virgil</h2>
                </div>
                <button
                  onClick={() => !generating && setGenOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {/* Book picker */}
                <div className="relative">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Book</label>
                  <Input
                    value={genBookSearch || genBook?.title || ""}
                    onChange={(e) => {
                      setGenBookSearch(e.target.value)
                      setGenBookId("")
                    }}
                    placeholder="Search for a book..."
                    className="text-sm"
                  />
                  {genBookSearch && genFilteredBooks.length > 0 && (
                    <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-card shadow-lg">
                      {genFilteredBooks.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => {
                            setGenBookId(b.id)
                            setGenBookSearch("")
                          }}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted/50"
                        >
                          <span className="font-medium">{b.title}</span>
                          <span className="text-xs text-muted-foreground">{b.author}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Chapter range + count */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">From ch.</label>
                    <Input
                      type="number"
                      min={1}
                      value={genStart}
                      onChange={(e) => setGenStart(Math.max(1, Number(e.target.value) || 1))}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">To ch.</label>
                    <Input
                      type="number"
                      min={1}
                      value={genEnd}
                      onChange={(e) => setGenEnd(Math.max(1, Number(e.target.value) || 1))}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Questions</label>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      value={genCount}
                      onChange={(e) => setGenCount(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Difficulty</label>
                  <select
                    value={genDifficulty}
                    onChange={(e) => setGenDifficulty(e.target.value as typeof genDifficulty)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  >
                    <option value="apprentice">Apprentice</option>
                    <option value="scholar">Scholar</option>
                    <option value="master">Master</option>
                  </select>
                </div>

                {/* Brief */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Focus (optional)
                  </label>
                  <textarea
                    value={genBrief}
                    onChange={(e) => setGenBrief(e.target.value)}
                    placeholder="e.g. themes of fate and free will"
                    rows={2}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {genError && <p className="text-xs text-red-500">{genError}</p>}
                {(isDemoMode || !user) && (
                  <p className="text-xs text-muted-foreground">
                    Sign in as a teacher to generate quizzes with Virgil.
                  </p>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={!genBookId || generating || isDemoMode || !user}
                  className="w-full gap-1.5"
                >
                  <Sparkles className="size-4" />
                  {generating ? "Virgil is writing your quiz..." : "Generate quiz"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
