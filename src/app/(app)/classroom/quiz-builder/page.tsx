"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Feather, BookOpen, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

interface TeacherQuiz {
  id: string
  title: string
  book_id: string | null
  difficulty: string | null
  status: string
  question_count: number
  created_at: string
}

const DEMO_QUIZZES: TeacherQuiz[] = [
  { id: "demo-quiz-1", title: "The Odyssey — Books 1–6 Trial", book_id: "the-odyssey", difficulty: "Scholar", status: "published", question_count: 10, created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: "demo-quiz-2", title: "Meditations — Full Book Quiz", book_id: "meditations", difficulty: "Apprentice", status: "draft", question_count: 5, created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "demo-quiz-3", title: "Pride and Prejudice — Chapters 1–12", book_id: "pride-and-prejudice", difficulty: "Master", status: "published", question_count: 15, created_at: new Date(Date.now() - 14 * 86400000).toISOString() },
]

export default function QuizBuilderPage() {
  const { user, isDemoMode } = useAuth()
  const [quizzes, setQuizzes] = useState<TeacherQuiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode || !user) {
      setQuizzes(DEMO_QUIZZES)
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

      if (data?.length) {
        const withCounts = await Promise.all(
          data.map(async (q) => {
            const { count } = await supabase
              .from("teacher_quiz_questions")
              .select("*", { count: "exact", head: true })
              .eq("quiz_id", q.id)
            return { ...q, question_count: count ?? 0 }
          }),
        )
        setQuizzes(withCounts)
      } else {
        setQuizzes(DEMO_QUIZZES)
      }

      setLoading(false)
    }

    fetchQuizzes()
  }, [user, isDemoMode])

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
          <Feather className="size-6 text-white" />
          <h1 className="text-2xl font-bold">Quiz Builder</h1>
        </div>
        <Button onClick={createNewQuiz} className="gap-1.5">
          <Plus className="size-4" />
          New Quiz
        </Button>
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
            >
              <Link
                href={`/classroom/quiz-builder/${quiz.id}`}
                className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
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
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
