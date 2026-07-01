"use client"

import Link from "next/link"
import { Mail, UserCircle } from "lucide-react"
import { useTeacherStudents } from "@/hooks/use-teacher-students"

/**
 * Teacher ↔ parent contact surface.
 *
 * Parent/guardian links are owned by families: a parent links to their own
 * child and the pair consents. Under our privacy model those links (and any
 * family messaging) are readable only by the parent and student parties — a
 * teacher cannot read another family's contacts. So this page never fabricates
 * parent names or messages. It reflects the teacher's real roster and explains
 * how contact becomes available.
 */
export default function ParentsPage() {
  const { students, loading } = useTeacherStudents()

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold">Parents &amp; Guardians</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep families in the loop on their student&apos;s reading.
        </p>
      </div>

      <div className="rounded-xl border border-dashed bg-muted/20 p-5">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Parent contacts appear here once a family links to a student
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              A parent or guardian links to their own child from their account,
              and both sides confirm the connection. Those private family
              contacts stay under the family&apos;s control — Tome never shows
              fabricated parent details.
            </p>
          </div>
        </div>
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold">Your students</h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="size-5 animate-spin rounded-full border-2 border-muted border-t-foreground" />
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border py-12 text-center">
          <UserCircle className="size-7 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No students yet</p>
          <p className="max-w-xs text-xs text-muted-foreground/70">
            Students appear here once they join one of your classrooms with your
            join code.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {students.map((s) => (
            <Link
              key={s.id}
              href={`/teacher/students/${s.id}`}
              className="flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-muted/50"
            >
              {s.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.avatarUrl}
                  alt={s.name}
                  className="size-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: s.avatarColor }}
                >
                  {s.name[0]?.toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{s.name}</p>
                {s.classroomNames.length > 0 && (
                  <p className="truncate text-xs text-muted-foreground">
                    {s.classroomNames.join(" · ")}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
