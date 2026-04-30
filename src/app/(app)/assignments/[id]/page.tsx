import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, BookOpen, Calendar, User } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { getDemoAssignment } from "@/lib/assignments/seed"

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const assignment = getDemoAssignment(id)

  if (!assignment) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 md:py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-3.5" aria-hidden="true" />
        Back to dashboard
      </Link>

      <header className="mt-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Assignment
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight">
          {assignment.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {assignment.className}
        </p>
      </header>

      <dl className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-3">
        <Meta icon={User} label="Teacher" value={assignment.teacherName} />
        <Meta
          icon={BookOpen}
          label="Reading"
          value={`${assignment.bookTitle}, ${assignment.chapterRange}`}
        />
        <Meta icon={Calendar} label="Due" value={assignment.due} />
      </dl>

      <section className="mt-6">
        <h2 className="text-sm font-semibold tracking-tight">Description</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {assignment.description}
        </p>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href={`/read/${assignment.bookId}?ch=${assignment.beginChapterIndex}`}
          className={buttonVariants()}
        >
          Begin reading
        </Link>
        <Link
          href={`/book/${assignment.bookId}`}
          className={buttonVariants({ variant: "ghost" })}
        >
          View in library
        </Link>
      </div>
    </div>
  )
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 text-muted-foreground" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm font-medium">{value}</dd>
      </div>
    </div>
  )
}
