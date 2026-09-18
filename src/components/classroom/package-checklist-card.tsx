"use client"

// One assignment "package" rendered as a checklist card: the bundled
// readings / quizzes / writing items with per-item completion state.
// Reading items link into the general reader with assignment context; quiz
// items into the quiz runner; writing/discussion items into the assignment
// detail page.

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  BookOpen,
  CheckCircle2,
  Circle,
  FileEdit,
  HelpCircle,
  MessageSquare,
} from "lucide-react"
import { assignmentDetailHref, assignmentReaderHref } from "@/lib/assignments/links"
import { getBook } from "@/lib/content"
import {
  type AssignmentItemRow,
  type ItemProgressRow,
  setItemProgress,
} from "@/lib/actions/packages"

const KIND_ICONS: Record<string, typeof BookOpen> = {
  reading: BookOpen,
  quiz: HelpCircle,
  assessment: HelpCircle,
  writing: FileEdit,
  discussion: MessageSquare,
  annotation: FileEdit,
  note: MessageSquare,
}

function itemHref(
  item: AssignmentItemRow,
  classroomId: string,
): string | null {
  if (item.kind === "reading" && item.book_id) {
    return assignmentReaderHref({
      id: item.assignment_id,
      classroom_id: classroomId,
      book_id: item.book_id,
      chapter_range_start: item.chapter_start,
    })
  }
  if ((item.kind === "quiz" || item.kind === "assessment") && item.quiz_id) {
    return `/classroom/${classroomId}/quiz/${item.quiz_id}`
  }
  if (item.kind === "writing" || item.kind === "discussion" || item.kind === "annotation") {
    return assignmentDetailHref(classroomId, item.assignment_id)
  }
  return null
}

function itemSubtitle(item: AssignmentItemRow): string {
  const parts: string[] = []
  if (item.book_id) {
    parts.push(getBook(item.book_id)?.title ?? item.book_id)
    if (item.chapter_start != null) {
      parts.push(
        item.chapter_end != null && item.chapter_end !== item.chapter_start
          ? `Ch. ${item.chapter_start + 1}–${item.chapter_end + 1}`
          : `Ch. ${item.chapter_start + 1}`,
      )
    }
  }
  if (item.platform_quiz_difficulty) parts.push(item.platform_quiz_difficulty)
  if (!item.is_required) parts.push("Optional")
  return parts.join(" · ")
}

export function PackageChecklist({
  classroomId,
  items,
  progress,
  readOnly = false,
}: {
  classroomId: string
  items: AssignmentItemRow[]
  progress: ItemProgressRow[]
  readOnly?: boolean
}) {
  const [local, setLocal] = useState<Record<string, string>>(() =>
    Object.fromEntries(progress.map((p) => [p.assignment_item_id, p.status])),
  )
  const [, startTransition] = useTransition()

  if (items.length === 0) return null

  const toggle = (item: AssignmentItemRow) => {
    if (readOnly) return
    const current = local[item.id] ?? "not_started"
    const next = current === "complete" ? "not_started" : "complete"
    setLocal((m) => ({ ...m, [item.id]: next }))
    startTransition(() => {
      void setItemProgress({
        assignmentItemId: item.id,
        status: next as "complete" | "not_started",
      }).then((r) => {
        if (!r.ok) setLocal((m) => ({ ...m, [item.id]: current }))
      })
    })
  }

  const done = items.filter((i) => (local[i.id] ?? "not_started") === "complete").length

  return (
    <div className="mt-3 rounded-lg border border-border/60 bg-muted/20">
      <div className="flex items-center justify-between px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Checklist
        </p>
        <p className="text-[10px] tabular-nums text-muted-foreground">
          {done}/{items.length} done
        </p>
      </div>
      <ul className="divide-y divide-border/50">
        {items.map((item) => {
          const status = local[item.id] ?? "not_started"
          const complete = status === "complete"
          const Icon = KIND_ICONS[item.kind] ?? BookOpen
          const href = itemHref(item, classroomId)
          const subtitle = itemSubtitle(item)
          return (
            <li key={item.id} className="flex items-center gap-2.5 px-3 py-2">
              <button
                type="button"
                aria-label={complete ? "Mark not done" : "Mark done"}
                onClick={() => toggle(item)}
                disabled={readOnly}
                className="shrink-0 disabled:opacity-50"
              >
                {complete ? (
                  <CheckCircle2 className="size-4.5 text-[#3E7C6A]" />
                ) : (
                  <Circle className="size-4.5 text-muted-foreground/60" />
                )}
              </button>
              <Icon className="size-3.5 shrink-0 text-[#2C4A7E]" />
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm ${complete ? "text-muted-foreground line-through" : ""}`}
                >
                  {item.title}
                </p>
                {subtitle && (
                  <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
                )}
              </div>
              {href && (
                <Link
                  href={href}
                  className="shrink-0 text-xs font-medium text-[#C8972F] hover:underline"
                >
                  Open →
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
