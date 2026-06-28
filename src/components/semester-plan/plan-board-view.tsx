"use client"

import { AlertTriangle, Clock, CalendarDays } from "lucide-react"
import type { SemesterPlan, PlanItem, PlanWeek } from "@/lib/semester-plan/types"
import { CONTENT_DEPENDENT_TYPES, PLAN_ITEM_TYPE_LABELS } from "@/lib/semester-plan/types"
import { ITEM_ACCENT, RUBRIC, formatMinutes } from "@/lib/semester-plan/rubric"

const STATUS_LABEL: Record<SemesterPlan["status"], string> = {
  draft: "Draft",
  active: "Active",
  archived: "Archived",
}

/** Read-only term board: week-by-week curriculum with reading-load bars. */
export function PlanBoardView({ plan }: { plan: SemesterPlan }) {
  const cap = plan.constraints?.maxMinutesPerWeek ?? null
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-3xl font-semibold" style={{ color: RUBRIC.ink }}>
            {plan.title}
          </h1>
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: "rgba(44,74,126,0.10)", color: RUBRIC.lapis }}
          >
            {STATUS_LABEL[plan.status]}
          </span>
        </div>
        <p className="mt-1 font-serif text-sm text-muted-foreground">
          {plan.weeks} weeks
          {plan.term_start ? ` · begins ${plan.term_start}` : ""}
          {cap ? ` · cap ${formatMinutes(cap)}/week` : ""}
          {plan.generated_by_model ? ` · drafted by ${plan.generated_by_model}` : ""}
        </p>
        {plan.goals?.themes?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {plan.goals.themes.map((t) => (
              <span
                key={t}
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ backgroundColor: "rgba(200,151,47,0.12)", color: RUBRIC.goldLeaf }}
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <div className="space-y-4">
        {plan.week_list.map((week) => (
          <WeekCard key={week.id} week={week} cap={cap} />
        ))}
      </div>
    </div>
  )
}

function WeekCard({ week, cap }: { week: PlanWeek; cap: number | null }) {
  const pct = cap ? Math.min(100, Math.round((week.load_minutes / cap) * 100)) : 0
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold text-white"
              style={{ backgroundColor: RUBRIC.lapis }}
            >
              {week.week_index}
            </span>
            <h2 className="font-display text-lg font-semibold" style={{ color: RUBRIC.ink }}>
              {week.theme ?? `Week ${week.week_index}`}
            </h2>
          </div>
          {week.date_start ? (
            <p className="mt-1 flex items-center gap-1 font-serif text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              {week.date_start} – {week.date_end}
            </p>
          ) : null}
        </div>
        <div className="w-44 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-medium">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3" />
              {formatMinutes(week.load_minutes)}
            </span>
            {week.over_cap ? (
              <span className="flex items-center gap-0.5 font-semibold" style={{ color: RUBRIC.vermilion }}>
                <AlertTriangle className="size-3" />
                over
              </span>
            ) : null}
          </div>
          {cap ? (
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${week.over_cap ? 100 : pct}%`,
                  backgroundColor: week.over_cap ? RUBRIC.vermilion : RUBRIC.verdigris,
                }}
              />
            </div>
          ) : null}
        </div>
      </div>

      {week.notes ? (
        <p className="mt-2 font-serif text-sm text-muted-foreground">{week.notes}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {week.items.map((item) => (
          <ItemChip key={item.id} item={item} />
        ))}
        {week.items.length === 0 ? (
          <span className="font-serif text-sm italic text-muted-foreground">Break — no reading</span>
        ) : null}
      </div>
    </section>
  )
}

function ItemChip({ item }: { item: PlanItem }) {
  const accent = ITEM_ACCENT[item.type]
  const chapters = item.chapter_refs?.length ? ` · ch ${formatChapters(item.chapter_refs)}` : ""
  const notReadable =
    CONTENT_DEPENDENT_TYPES.has(item.type) && item.book_id && item.has_content === false
  return (
    <div
      className="flex max-w-full flex-col gap-0.5 rounded-xl px-3 py-2"
      style={{ backgroundColor: accent.bg }}
      title={item.description ?? undefined}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: accent.fg }}>
        {PLAN_ITEM_TYPE_LABELS[item.type]}
        {item.difficulty ? ` · ${item.difficulty}` : ""}
      </span>
      <span className="truncate font-serif text-sm" style={{ color: RUBRIC.ink }}>
        {item.title}
        <span className="text-muted-foreground">{chapters}</span>
      </span>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        {item.est_minutes ? <span>{formatMinutes(item.est_minutes)}</span> : null}
        {item.due_date ? <span>due {item.due_date}</span> : null}
        {item.status === "provisioned" ? (
          <span className="font-semibold" style={{ color: RUBRIC.verdigris }}>
            ✓ provisioned
          </span>
        ) : null}
      </div>
      {notReadable ? (
        <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: RUBRIC.vermilion }}>
          <AlertTriangle className="size-3" />
          in catalog, not yet readable in Tome
        </span>
      ) : null}
      {item.type === "custom_reading" ? (
        <span className="text-[11px] italic text-muted-foreground">outside reading · metadata only</span>
      ) : null}
    </div>
  )
}

/** Compress [1,2,3,5] -> "1–3, 5". */
function formatChapters(refs: number[]): string {
  const sorted = [...refs].sort((a, b) => a - b)
  const ranges: string[] = []
  let start = sorted[0]
  let prev = sorted[0]
  for (let i = 1; i <= sorted.length; i++) {
    if (i < sorted.length && sorted[i] === prev + 1) {
      prev = sorted[i]
      continue
    }
    ranges.push(start === prev ? `${start}` : `${start}–${prev}`)
    start = sorted[i]
    prev = sorted[i]
  }
  return ranges.join(", ")
}
