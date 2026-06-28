import Link from "next/link"
import { CalendarRange, ChevronLeft, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { RUBRIC } from "@/lib/semester-plan/rubric"

const STATUS_STYLE: Record<string, { fg: string; bg: string }> = {
  draft: { fg: RUBRIC.lapis, bg: "rgba(44,74,126,0.10)" },
  active: { fg: RUBRIC.verdigris, bg: "rgba(62,124,106,0.12)" },
  archived: { fg: RUBRIC.ink, bg: "rgba(28,25,20,0.06)" },
}

export default async function SemesterPlansListPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: plans } = await supabase
    .from("semester_plans")
    .select("id, title, status, weeks, term_start, generated_by_model, created_at")
    .eq("class_id", id)
    .order("created_at", { ascending: false })

  const rows = (plans ?? []) as Array<{
    id: string
    title: string
    status: string
    weeks: number
    term_start: string | null
    generated_by_model: string | null
  }>

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href={`/classroom/${id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Classroom
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold" style={{ color: RUBRIC.ink }}>
          Semester Planning
        </h1>
        <Link
          href={`/classroom/${id}/semester-plan/new`}
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-white"
          style={{ backgroundImage: "linear-gradient(110deg, #6366F1 0%, #8B5CF6 35%, #06B6D4 70%, #6366F1 100%)" }}
        >
          <Sparkles className="size-4" />
          Plan a semester with Virgil
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="mt-12 flex flex-col items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
            <CalendarRange className="size-7 text-muted-foreground" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold">No semester plans yet</h2>
          <p className="mt-1 font-serif text-sm text-muted-foreground">
            Let Virgil draft a paced, week-by-week term from the catalog — then edit and deploy it.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((p) => {
            const s = STATUS_STYLE[p.status] ?? STATUS_STYLE.draft
            return (
              <Link
                key={p.id}
                href={`/classroom/${id}/semester-plan/${p.id}`}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div>
                  <h2 className="font-display text-lg font-semibold" style={{ color: RUBRIC.ink }}>
                    {p.title}
                  </h2>
                  <p className="mt-0.5 font-serif text-sm text-muted-foreground">
                    {p.weeks} weeks{p.term_start ? ` · begins ${p.term_start}` : ""}
                    {p.generated_by_model ? ` · ${p.generated_by_model}` : ""}
                  </p>
                </div>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ backgroundColor: s.bg, color: s.fg }}
                >
                  {p.status}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
