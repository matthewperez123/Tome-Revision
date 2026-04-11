"use client"

import { use, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft, Plus, Trash2, GripVertical, Save, Eye, Sparkles,
  ChevronDown, ChevronUp, Check, Feather, Clock, Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { getBooks } from "@/lib/content"

type QuestionType = "multiple_choice" | "true_false" | "short_answer" | "passage_id" | "vocabulary"

interface QuizQuestion {
  id: string
  question_type: QuestionType
  question_text: string
  options: string[] | null
  correct_answer: string
  explanation: string
  points: number
  sort_order: number
}

interface QuizSettings {
  timeLimit: number | null
  passingScore: number
  allowRetakes: boolean
  randomizeOrder: boolean
  showAnswers: boolean
}

const QUESTION_TYPES: { key: QuestionType; label: string; icon: string }[] = [
  { key: "multiple_choice", label: "Multiple Choice", icon: "A" },
  { key: "true_false", label: "True / False", icon: "T" },
  { key: "short_answer", label: "Short Answer", icon: "?" },
  { key: "passage_id", label: "Passage ID", icon: '"' },
  { key: "vocabulary", label: "Vocabulary", icon: "V" },
]

// ── Demo Data ──────────────────────────────────────────────

interface DemoQuiz {
  title: string
  bookId: string
  difficulty: string
  questions: QuizQuestion[]
}

const DEMO_QUIZ_DATA: Record<string, DemoQuiz> = {
  "demo-quiz-1": {
    title: "The Odyssey — Books 1–6 Trial",
    bookId: "the-odyssey",
    difficulty: "scholar",
    questions: [
      { id: "q1", question_type: "multiple_choice", question_text: "Who is the goddess that helps Odysseus throughout his journey?", options: ["Hera", "Athena", "Aphrodite", "Artemis"], correct_answer: "Athena", explanation: "Athena is Odysseus' divine patron who repeatedly intervenes on his behalf.", points: 10, sort_order: 0 },
      { id: "q2", question_type: "multiple_choice", question_text: "What is Telemachus doing at the start of the epic?", options: ["Searching for Odysseus", "Hosting the suitors", "Sailing to Troy", "Training for battle"], correct_answer: "Hosting the suitors", explanation: "Telemachus is at home in Ithaca, helpless as suitors consume his father's estate.", points: 10, sort_order: 1 },
      { id: "q3", question_type: "true_false", question_text: "Calypso willingly releases Odysseus from her island.", options: ["True", "False"], correct_answer: "False", explanation: "Calypso only releases Odysseus after Zeus sends Hermes to command her to let him go.", points: 10, sort_order: 2 },
      { id: "q4", question_type: "multiple_choice", question_text: "Which king tells Odysseus about the Trojan Horse?", options: ["Nestor", "Menelaus", "Alcinous", "Priam"], correct_answer: "Menelaus", explanation: "Menelaus recounts the Trojan Horse story to Telemachus during his visit to Sparta.", points: 10, sort_order: 3 },
      { id: "q5", question_type: "vocabulary", question_text: "What does the Greek concept of 'xenia' refer to in The Odyssey?", options: ["Warfare", "Hospitality", "Revenge", "Navigation"], correct_answer: "Hospitality", explanation: "Xenia is the ancient Greek concept of hospitality and guest-friendship, a central theme in the epic.", points: 10, sort_order: 4 },
      { id: "q6", question_type: "short_answer", question_text: "Name the island where Calypso holds Odysseus captive.", options: null, correct_answer: "Ogygia", explanation: "Calypso's island home is called Ogygia, where Odysseus is trapped for seven years.", points: 10, sort_order: 5 },
      { id: "q7", question_type: "multiple_choice", question_text: "What disguise does Athena use when she first visits Telemachus?", options: ["An old beggar", "Mentes, a family friend", "A shepherd", "A sailor"], correct_answer: "Mentes, a family friend", explanation: "Athena disguises herself as Mentes, a Taphian chief and friend of Odysseus' family.", points: 10, sort_order: 6 },
      { id: "q8", question_type: "true_false", question_text: "Nestor provides Telemachus with information about Odysseus' whereabouts.", options: ["True", "False"], correct_answer: "False", explanation: "Nestor has no direct news of Odysseus but sends Telemachus onward to Menelaus in Sparta.", points: 10, sort_order: 7 },
      { id: "q9", question_type: "passage_id", question_text: "'Tell me, O Muse, of that ingenious hero who travelled far and wide...' — Who is the narrator invoking?", options: ["Zeus", "The Muse", "Athena", "Homer himself"], correct_answer: "The Muse", explanation: "The epic invocation at the opening of The Odyssey calls upon the Muse for inspiration.", points: 10, sort_order: 8 },
      { id: "q10", question_type: "multiple_choice", question_text: "What does Odysseus build to leave Calypso's island?", options: ["A chariot", "A raft", "A bridge", "A ship"], correct_answer: "A raft", explanation: "Calypso provides Odysseus with tools and materials to build a raft for his departure.", points: 10, sort_order: 9 },
    ],
  },
  "demo-quiz-2": {
    title: "Meditations — Full Book Quiz",
    bookId: "meditations",
    difficulty: "apprentice",
    questions: [
      { id: "mq1", question_type: "multiple_choice", question_text: "Who is the author of Meditations?", options: ["Seneca", "Epictetus", "Marcus Aurelius", "Cicero"], correct_answer: "Marcus Aurelius", explanation: "Meditations was written by Roman Emperor Marcus Aurelius as personal philosophical reflections.", points: 10, sort_order: 0 },
      { id: "mq2", question_type: "true_false", question_text: "Meditations was intended for public publication.", options: ["True", "False"], correct_answer: "False", explanation: "The Meditations were private notes Marcus Aurelius wrote to himself, never intended for publication.", points: 10, sort_order: 1 },
      { id: "mq3", question_type: "vocabulary", question_text: "What philosophical school does Marcus Aurelius follow in Meditations?", options: ["Epicureanism", "Stoicism", "Cynicism", "Platonism"], correct_answer: "Stoicism", explanation: "Marcus Aurelius was a Stoic philosopher, and Meditations is one of the foundational Stoic texts.", points: 10, sort_order: 2 },
      { id: "mq4", question_type: "short_answer", question_text: "What was Marcus Aurelius' role in the Roman Empire?", options: null, correct_answer: "Emperor", explanation: "Marcus Aurelius served as Roman Emperor from 161 to 180 AD.", points: 10, sort_order: 3 },
      { id: "mq5", question_type: "multiple_choice", question_text: "What is the central teaching about external events in Meditations?", options: ["Avoid all hardship", "Control what you can, accept what you cannot", "Seek pleasure above all", "Trust in the gods completely"], correct_answer: "Control what you can, accept what you cannot", explanation: "A core Stoic principle: focus on your own actions and judgments, not external circumstances.", points: 10, sort_order: 4 },
    ],
  },
  "demo-quiz-3": {
    title: "Pride and Prejudice — Chapters 1–12",
    bookId: "pride-and-prejudice",
    difficulty: "master",
    questions: [
      { id: "pp1", question_type: "multiple_choice", question_text: "What is Mrs. Bennet's primary concern throughout the novel?", options: ["Her health", "Marrying off her daughters", "The family estate", "Social reform"], correct_answer: "Marrying off her daughters", explanation: "Mrs. Bennet's singular focus is finding wealthy husbands for her five daughters.", points: 10, sort_order: 0 },
      { id: "pp2", question_type: "passage_id", question_text: "'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.' — What literary device is Austen using here?", options: ["Metaphor", "Irony", "Alliteration", "Hyperbole"], correct_answer: "Irony", explanation: "Austen opens with ironic understatement — the 'truth' is actually the perspective of matchmaking mothers, not a universal law.", points: 10, sort_order: 1 },
      { id: "pp3", question_type: "true_false", question_text: "Mr. Darcy makes a favorable first impression at the Meryton ball.", options: ["True", "False"], correct_answer: "False", explanation: "Darcy is perceived as proud and disagreeable at the first ball, notably snubbing Elizabeth.", points: 10, sort_order: 2 },
      { id: "pp4", question_type: "vocabulary", question_text: "What does 'entailment' mean in the context of the Bennet estate?", options: ["A type of tax", "A legal restriction on inheritance", "A marriage contract", "A social obligation"], correct_answer: "A legal restriction on inheritance", explanation: "The entail means the Bennet estate must pass to the nearest male heir (Mr. Collins), not to the daughters.", points: 10, sort_order: 3 },
      { id: "pp5", question_type: "multiple_choice", question_text: "Why does Mr. Bingley's sisters disapprove of Jane?", options: ["Her appearance", "Her low social connections", "Her intelligence", "Her age"], correct_answer: "Her low social connections", explanation: "The Bingley sisters view the Bennets as beneath their social station due to their connections to trade.", points: 10, sort_order: 4 },
    ],
  },
}

// ── Component ──────────────────────────────────────────────

export default function QuizEditorPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = use(params)
  const router = useRouter()
  const { user, isDemoMode } = useAuth()
  const [title, setTitle] = useState("Untitled Quiz")
  const [bookId, setBookId] = useState("")
  const [bookSearch, setBookSearch] = useState("")
  const [difficulty, setDifficulty] = useState("scholar")
  const [settings, setSettings] = useState<QuizSettings>({
    timeLimit: null,
    passingScore: 60,
    allowRetakes: true,
    randomizeOrder: true,
    showAnswers: true,
  })
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)

  const books = getBooks()
  const selectedBook = books.find((b) => b.id === bookId)
  const filteredBooks = bookSearch
    ? books.filter((b) =>
        b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
        b.author.toLowerCase().includes(bookSearch.toLowerCase()),
      ).slice(0, 6)
    : []

  // Load quiz data
  useEffect(() => {
    // Demo mode: load from DEMO_QUIZ_DATA
    if (isDemoMode || !user) {
      const demo = DEMO_QUIZ_DATA[quizId]
      if (demo) {
        setTitle(demo.title)
        setBookId(demo.bookId)
        setDifficulty(demo.difficulty)
        setQuestions(demo.questions)
      }
      setLoading(false)
      return
    }

    // Real mode: load from Supabase
    async function fetchQuiz() {
      const supabase = createClient()

      const { data: quiz } = await supabase
        .from("teacher_quizzes")
        .select("*")
        .eq("id", quizId)
        .single()

      if (quiz) {
        setTitle(quiz.title)
        setBookId(quiz.book_id ?? "")
        setDifficulty(quiz.difficulty ?? "scholar")
        setSettings({
          timeLimit: quiz.time_limit_minutes,
          passingScore: quiz.passing_score ?? 60,
          allowRetakes: quiz.allow_retakes ?? true,
          randomizeOrder: quiz.randomize_order ?? true,
          showAnswers: quiz.show_answers ?? true,
        })
      }

      const { data: questionData } = await supabase
        .from("teacher_quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("sort_order", { ascending: true })

      if (questionData) {
        setQuestions(
          questionData.map((q) => ({
            ...q,
            options: q.options as string[] | null,
          })),
        )
      }

      setLoading(false)
    }

    fetchQuiz()
  }, [user, quizId, isDemoMode])

  const addQuestion = useCallback((type: QuestionType) => {
    const newQ: QuizQuestion = {
      id: `new-${Date.now()}`,
      question_type: type,
      question_text: "",
      options: type === "multiple_choice" ? ["", "", "", ""] : type === "true_false" ? ["True", "False"] : null,
      correct_answer: "",
      explanation: "",
      points: 10,
      sort_order: questions.length,
    }
    setQuestions((prev) => [...prev, newQ])
    setExpandedQuestion(newQ.id)
  }, [questions.length])

  const updateQuestion = useCallback((id: string, updates: Partial<QuizQuestion>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }, [])

  const removeQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
    if (expandedQuestion === id) setExpandedQuestion(null)
  }, [expandedQuestion])

  const moveQuestion = useCallback((index: number, direction: "up" | "down") => {
    setQuestions((prev) => {
      const next = [...prev]
      const swapIdx = direction === "up" ? index - 1 : index + 1
      if (swapIdx < 0 || swapIdx >= next.length) return prev
      ;[next[index], next[swapIdx]] = [next[swapIdx], next[index]]
      return next.map((q, i) => ({ ...q, sort_order: i }))
    })
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)

    if (isDemoMode || !user) {
      // Demo mode: just show saved feedback
      await new Promise((r) => setTimeout(r, 500))
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      return
    }

    const supabase = createClient()

    await supabase
      .from("teacher_quizzes")
      .update({
        title,
        book_id: bookId || null,
        difficulty,
        time_limit_minutes: settings.timeLimit,
        passing_score: settings.passingScore,
        allow_retakes: settings.allowRetakes,
        randomize_order: settings.randomizeOrder,
        show_answers: settings.showAnswers,
        updated_at: new Date().toISOString(),
      })
      .eq("id", quizId)

    await supabase.from("teacher_quiz_questions").delete().eq("quiz_id", quizId)

    if (questions.length > 0) {
      await supabase.from("teacher_quiz_questions").insert(
        questions.map((q, i) => ({
          quiz_id: quizId,
          question_type: q.question_type,
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation || null,
          points: q.points,
          sort_order: i,
        })),
      )
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [user, isDemoMode, quizId, title, bookId, difficulty, settings, questions])

  const handlePublish = useCallback(async () => {
    await handleSave()
    if (!isDemoMode && user) {
      const supabase = createClient()
      await supabase.from("teacher_quizzes").update({ status: "published" }).eq("id", quizId)
    }
    router.push("/classroom/quiz-builder")
  }, [handleSave, quizId, router, isDemoMode, user])

  const handleAIGenerate = useCallback(async () => {
    if (!bookId) return
    setGenerating(true)

    try {
      const res = await fetch("/api/quiz-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, difficulty, count: 5 }),
      })

      if (res.ok) {
        const { questions: generated } = await res.json()
        const newQuestions: QuizQuestion[] = generated.map(
          (g: { type: string; question: string; options?: string[]; correctAnswer: string; explanation: string }, i: number) => ({
            id: `ai-${Date.now()}-${i}`,
            question_type: g.type as QuestionType,
            question_text: g.question,
            options: g.options ?? null,
            correct_answer: g.correctAnswer,
            explanation: g.explanation,
            points: 10,
            sort_order: questions.length + i,
          }),
        )
        setQuestions((prev) => [...prev, ...newQuestions])
      }
    } catch {
      // AI generation is optional
    }

    setGenerating(false)
  }, [bookId, difficulty, questions.length])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <Link
        href="/classroom/quiz-builder"
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to quizzes
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#D4A04C]">
          <Feather className="size-5 text-white" />
        </div>
        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-bold border-none px-0 h-auto focus-visible:ring-0"
            placeholder="Quiz title..."
          />
        </div>
      </div>

      {/* Book selector + difficulty + settings */}
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Input
              value={bookSearch || selectedBook?.title || ""}
              onChange={(e) => { setBookSearch(e.target.value); setBookId("") }}
              placeholder="Search for a book..."
              className="text-sm"
            />
            {bookSearch && filteredBooks.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border bg-card shadow-lg max-h-48 overflow-y-auto">
                {filteredBooks.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => { setBookId(b.id); setBookSearch("") }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 flex items-center justify-between"
                  >
                    <span className="font-medium">{b.title}</span>
                    <span className="text-xs text-muted-foreground">{b.author}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="apprentice">Apprentice</option>
            <option value="scholar">Scholar</option>
            <option value="master">Master</option>
          </select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="gap-1.5 text-xs"
          >
            <Target className="size-3.5" />
            Settings
          </Button>
        </div>

        {/* Quiz stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="font-medium">{questions.length} questions</span>
          <span>{totalPoints} points total</span>
          <span>Passing: {settings.passingScore}%</span>
          {settings.timeLimit && <span className="flex items-center gap-1"><Clock className="size-3" />{settings.timeLimit} min</span>}
        </div>

        {/* Settings panel */}
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="border-t pt-3 grid grid-cols-2 gap-3"
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground">Time limit (minutes)</label>
              <Input
                type="number"
                min={0}
                value={settings.timeLimit ?? ""}
                onChange={(e) => setSettings((s) => ({ ...s, timeLimit: e.target.value ? Number(e.target.value) : null }))}
                placeholder="No limit"
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Passing score (%)</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={settings.passingScore}
                onChange={(e) => setSettings((s) => ({ ...s, passingScore: Number(e.target.value) }))}
                className="mt-1 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={settings.allowRetakes} onChange={(e) => setSettings((s) => ({ ...s, allowRetakes: e.target.checked }))} className="size-4 rounded" />
              Allow retakes
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={settings.randomizeOrder} onChange={(e) => setSettings((s) => ({ ...s, randomizeOrder: e.target.checked }))} className="size-4 rounded" />
              Randomize order
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer col-span-2">
              <input type="checkbox" checked={settings.showAnswers} onChange={(e) => setSettings((s) => ({ ...s, showAnswers: e.target.checked }))} className="size-4 rounded" />
              Show correct answers after submission
            </label>
          </motion.div>
        )}
      </div>

      {/* Questions list */}
      <div className="mt-6 space-y-2">
        {questions.length === 0 && (
          <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-center">
            <Feather className="mx-auto size-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">No questions yet</p>
            <p className="mt-1 text-xs text-muted-foreground/60">Add questions manually or use AI to generate them</p>
          </div>
        )}

        {questions.map((q, i) => {
          const isExpanded = expandedQuestion === q.id
          const typeConfig = QUESTION_TYPES.find((t) => t.key === q.question_type)
          return (
            <motion.div
              key={q.id}
              layout
              className={`rounded-xl border transition-colors ${isExpanded ? "border-[#D4A04C]/30 bg-[#D4A04C]/5" : "bg-card"}`}
            >
              {/* Collapsed header */}
              <div className="flex items-center gap-2 p-3">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveQuestion(i, "up")} disabled={i === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-20">
                    <ChevronUp className="size-3" />
                  </button>
                  <button onClick={() => moveQuestion(i, "down")} disabled={i === questions.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-20">
                    <ChevronDown className="size-3" />
                  </button>
                </div>
                <button
                  onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <span className="flex size-6 items-center justify-center rounded bg-muted text-[10px] font-bold text-muted-foreground">
                    {typeConfig?.icon ?? "?"}
                  </span>
                  <span className="flex-1 text-sm truncate">
                    {q.question_text || <span className="italic text-muted-foreground">New question...</span>}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{q.points}pts</span>
                </button>
                <Button variant="ghost" size="sm" onClick={() => removeQuestion(q.id)} className="size-7 p-0 text-muted-foreground hover:text-red-500">
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              {/* Expanded editor */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="border-t px-4 pb-4 pt-3 space-y-3"
                >
                  {/* Question type selector */}
                  <div className="flex gap-1">
                    {QUESTION_TYPES.map((t) => (
                      <button
                        key={t.key}
                        onClick={() => {
                          const newOptions = t.key === "multiple_choice" ? (q.options?.length === 4 ? q.options : ["", "", "", ""]) : t.key === "true_false" ? ["True", "False"] : null
                          updateQuestion(q.id, { question_type: t.key, options: newOptions })
                        }}
                        className={`rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
                          q.question_type === t.key
                            ? "bg-[#D4A04C]/10 text-[#D4A04C]"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Question text */}
                  <textarea
                    value={q.question_text}
                    onChange={(e) => updateQuestion(q.id, { question_text: e.target.value })}
                    placeholder="Enter your question..."
                    rows={2}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                  />

                  {/* Multiple Choice options */}
                  {q.question_type === "multiple_choice" && q.options && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Options — click the letter to mark the correct answer</label>
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuestion(q.id, { correct_answer: opt })}
                            className={`flex size-7 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                              q.correct_answer === opt && opt !== ""
                                ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                                : "border-border text-muted-foreground hover:border-foreground/30"
                            }`}
                          >
                            {String.fromCharCode(65 + oi)}
                          </button>
                          <Input
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...(q.options ?? [])]
                              newOpts[oi] = e.target.value
                              // If this was the correct answer, update it too
                              const updates: Partial<QuizQuestion> = { options: newOpts }
                              if (q.correct_answer === opt) updates.correct_answer = e.target.value
                              updateQuestion(q.id, updates)
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                            className="text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* True/False */}
                  {q.question_type === "true_false" && (
                    <div className="flex gap-2">
                      {["True", "False"].map((val) => (
                        <button
                          key={val}
                          onClick={() => updateQuestion(q.id, { correct_answer: val })}
                          className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                            q.correct_answer === val
                              ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                              : "border-border text-muted-foreground hover:border-foreground/30"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Short answer / Passage ID / Vocabulary */}
                  {(q.question_type === "short_answer" || q.question_type === "passage_id" || q.question_type === "vocabulary") && (
                    <>
                      {q.question_type === "vocabulary" && q.options === null && (
                        <Button variant="outline" size="sm" onClick={() => updateQuestion(q.id, { options: ["", "", "", ""] })} className="text-xs">
                          Add multiple choice options
                        </Button>
                      )}
                      {q.options && q.options.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">Options</label>
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuestion(q.id, { correct_answer: opt })}
                                className={`flex size-7 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                                  q.correct_answer === opt && opt !== ""
                                    ? "border-green-500 bg-green-50 text-green-700"
                                    : "border-border text-muted-foreground"
                                }`}
                              >
                                {String.fromCharCode(65 + oi)}
                              </button>
                              <Input
                                value={opt}
                                onChange={(e) => {
                                  const newOpts = [...(q.options ?? [])]
                                  newOpts[oi] = e.target.value
                                  const updates: Partial<QuizQuestion> = { options: newOpts }
                                  if (q.correct_answer === opt) updates.correct_answer = e.target.value
                                  updateQuestion(q.id, updates)
                                }}
                                placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                                className="text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {!q.options && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Correct answer</label>
                          <Input
                            value={q.correct_answer}
                            onChange={(e) => updateQuestion(q.id, { correct_answer: e.target.value })}
                            placeholder="Enter the correct answer..."
                            className="mt-1 text-sm"
                          />
                        </div>
                      )}
                    </>
                  )}

                  {/* Explanation */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Explanation (shown after answering)</label>
                    <Input
                      value={q.explanation}
                      onChange={(e) => updateQuestion(q.id, { explanation: e.target.value })}
                      placeholder="Why is this the correct answer?"
                      className="mt-1 text-sm"
                    />
                  </div>

                  {/* Points */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground">Points:</label>
                    <Input
                      type="number"
                      min={1}
                      value={q.points}
                      onChange={(e) => updateQuestion(q.id, { points: Number(e.target.value) })}
                      className="w-16 text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Add question row */}
      <div className="mt-4 flex flex-wrap gap-2">
        {QUESTION_TYPES.map((t) => (
          <Button
            key={t.key}
            variant="outline"
            size="sm"
            onClick={() => addQuestion(t.key)}
            className="gap-1.5 text-xs"
          >
            <Plus className="size-3" />
            {t.label}
          </Button>
        ))}
      </div>

      {/* AI Generate button */}
      {bookId && (
        <Button
          variant="outline"
          onClick={handleAIGenerate}
          disabled={generating}
          className="mt-3 w-full gap-2 border-[#D4A04C]/30 text-[#D4A04C] hover:bg-[#D4A04C]/5"
        >
          <Sparkles className="size-4" />
          {generating ? "Generating questions..." : "AI-Assist: Generate 5 questions"}
        </Button>
      )}

      {/* Action bar */}
      <div className="mt-8 flex gap-3 border-t pt-6">
        <Button variant="outline" onClick={handleSave} disabled={saving} className="gap-1.5">
          {saved ? <Check className="size-3.5 text-green-500" /> : <Save className="size-3.5" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Draft"}
        </Button>
        <Button onClick={handlePublish} disabled={questions.length === 0} className="flex-1 gap-1.5 bg-[#D4A04C] hover:bg-[#C49040] text-white">
          <Eye className="size-3.5" />
          Publish Quiz
        </Button>
      </div>
    </div>
  )
}
