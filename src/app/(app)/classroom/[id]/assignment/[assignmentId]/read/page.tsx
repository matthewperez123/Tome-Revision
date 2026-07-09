"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronLeft, BookOpen } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { startAssignment } from "@/lib/actions/assignments"
import { QuizAttemptRunner } from "@/components/classroom/quiz-attempt-runner"
import { getBook } from "@/lib/content"
import { RUBRIC } from "@/lib/semester-plan/rubric"
import { cn } from "@/lib/utils"

// Strip the chapter's leading heading group so it isn't duplicated by the
// per-chapter header we render. Mirrors the library reader's stripLeadingHeading.
function stripLeadingHeading(html: string): string {
  return html.replace(
    /^(\s*(?:<section[^>]*>\s*)*)(?:<header(?![^>]*data-scholarly-header)[^>]*>[\s\S]*?<\/header>|<hgroup[^>]*>[\s\S]*?<\/hgroup>|<h[1-4][^>]*>[\s\S]*?<\/h[1-4]>)\s*/i,
    "$1",
  )
}

interface ScopedAssignment {
  id: string
  title: string
  book_id: string | null
  quiz_id: string | null
  chapter_range_start: number | null
  chapter_range_end: number | null
}

interface LoadedChapter {
  index: number
  title: string
  html: string
}

export default function ScopedAssignmentReaderPage({
  params,
}: {
  params: Promise<{ id: string; assignmentId: string }>
}) {
  const { id: classroomId, assignmentId } = use(params)
  const { user, role } = useAuth()
  const [assignment, setAssignment] = useState<ScopedAssignment | null>(null)
  const [chapters, setChapters] = useState<LoadedChapter[]>([])
  const [loading, setLoading] = useState(true)

  const backHref = `/classroom/${classroomId}/assignment/${assignmentId}`

  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function load() {
      const supabase = createClient()
      // RLS scopes this select to classroom members — a non-member gets null.
      const { data } = await supabase
        .from("assignments")
        .select("id, title, book_id, quiz_id, chapter_range_start, chapter_range_end")
        .eq("id", assignmentId)
        .single<ScopedAssignment>()

      if (cancelled) return
      if (!data || !data.book_id) {
        setLoading(false)
        return
      }
      setAssignment(data)

      // Move the roster row to in_progress on open (student only).
      if (role === "student") void startAssignment(data.id)

      // Fetch ONLY the assigned chapters — no access to the rest of the book.
      const start = data.chapter_range_start ?? 0
      const end = data.chapter_range_end ?? start
      const indices: number[] = []
      for (let i = start; i <= end; i++) indices.push(i)

      const loaded = await Promise.all(
        indices.map(async (i): Promise<LoadedChapter | null> => {
          try {
            const res = await fetch(`/content/${data.book_id}/ch-${i}.json`)
            if (!res.ok) return null
            const json = (await res.json()) as { html?: string; title?: string }
            if (!json.html) return null
            return { index: i, title: json.title ?? `Chapter ${i}`, html: json.html }
          } catch {
            return null
          }
        }),
      )

      if (cancelled) return
      setChapters(loaded.filter((c): c is LoadedChapter => c !== null))
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [user, role, assignmentId])

  const book = useMemo(
    () => (assignment?.book_id ? getBook(assignment.book_id) : undefined),
    [assignment?.book_id],
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  if (!assignment || !assignment.book_id) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          This reading assignment isn&apos;t available.
        </p>
        <Link
          href={backHref}
          className="mt-4 inline-flex items-center gap-1.5 text-sm"
          style={{ color: RUBRIC.lapis }}
        >
          <ChevronLeft className="size-4" /> Back to assignment
        </Link>
      </div>
    )
  }

  return (
    <div
      data-reader-theme="day"
      className="reader-surface min-h-screen"
      style={{
        backgroundColor: "var(--reader-bg)",
        color: "var(--reader-ink)",
        ["--reader-font-size" as string]: "19px",
        ["--reader-line-height" as string]: "1.7",
        ["--reader-measure" as string]: "68ch",
      }}
    >
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 border-b pb-6">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm"
            style={{ color: RUBRIC.lapis }}
          >
            <ChevronLeft className="size-4" /> Back to assignment
          </Link>
          <h1 className="mt-3 font-display text-2xl font-semibold">{assignment.title}</h1>
          {book && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <BookOpen className="size-3.5" />
              {book.title}
              {book.author ? ` · ${book.author}` : ""}
            </p>
          )}
        </div>

        {/* Assigned chapters only */}
        {chapters.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            The assigned reading couldn&apos;t be loaded.
          </p>
        ) : (
          chapters.map((ch) => (
            <section key={ch.index} className="mb-12">
              <h2 className="mb-4 font-display text-xl font-semibold">{ch.title}</h2>
              <div
                className={cn("font-serif prose-reader reader-measure content-prose reader-ragged")}
                style={{
                  fontSize: "var(--reader-font-size)",
                  lineHeight: "var(--reader-line-height)",
                  color: "var(--reader-ink)",
                }}
                dangerouslySetInnerHTML={{ __html: stripLeadingHeading(ch.html) }}
              />
            </section>
          ))
        )}

        {/* Teacher quiz at the bottom — like the library practice quizzes. */}
        {assignment.quiz_id && (
          <div className="mt-10 border-t pt-8">
            <QuizAttemptRunner
              quizId={assignment.quiz_id}
              classroomId={classroomId}
              backHref={backHref}
              embedded
            />
          </div>
        )}
      </div>
    </div>
  )
}
