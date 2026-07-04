"use client"

import { useCallback, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Loader2,
  Plus,
  RefreshCw,
  SquarePen,
  Trash2,
  X,
} from "lucide-react"
import type { CandidateBook, PlanItem, PlanItemType, PlanWeek, SemesterPlan } from "@/lib/semester-plan/types"
import {
  CONTENT_DEPENDENT_TYPES,
  PLAN_ITEM_TYPES,
  PLAN_ITEM_TYPE_LABELS,
} from "@/lib/semester-plan/types"
import { TEACHER_QUIZ_DIFFICULTIES } from "@/lib/teacher-quiz-types"
import { ITEM_ACCENT, IRIDESCENT, RUBRIC, formatMinutes } from "@/lib/semester-plan/rubric"
import { SemesterPlanAssistant } from "@/components/semester-plan/semester-plan-assistant"

// ── Chapter range helpers (compress / expand) ────────────────────────────────

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

/** Parse "1-3, 5, 7" (en-dash or hyphen) into a sorted unique chapter list. */
function parseChapters(input: string): number[] {
  const out = new Set<number>()
  for (const part of input.split(/[,\s]+/).filter(Boolean)) {
    const m = part.match(/^(\d+)\s*[–-]\s*(\d+)$/)
    if (m) {
      const a = Number(m[1])
      const b = Number(m[2])
      for (let i = Math.min(a, b); i <= Math.max(a, b); i++) out.add(i)
    } else if (/^\d+$/.test(part)) {
      out.add(Number(part))
    }
  }
  return [...out].sort((a, b) => a - b)
}

// ── Mutation contract (mirrors the API route's discriminated union) ───────────

type Mutation =
  | { action: "update_item"; itemId: string; patch: Record<string, unknown> }
  | {
      action: "add_item"
      weekId: string
      type: PlanItemType
      title: string
      book_id?: string
      chapter_refs?: number[]
      difficulty?: string
    }
  | { action: "delete_item"; itemId: string }
  | { action: "update_week"; weekId: string; theme?: string | null; notes?: string | null }
  | { action: "reorder_weeks"; order: string[] }

// ── Root ──────────────────────────────────────────────────────────────────────

export function EditablePlanBoard({ plan }: { plan: SemesterPlan }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [saving, setSaving] = useState(false)
  const [virgilBusy, setVirgilBusy] = useState(false)
  const [candidates, setCandidates] = useState<CandidateBook[] | null>(null)
  const candidatesLoading = useRef(false)

  const cap = plan.constraints?.maxMinutesPerWeek ?? null

  const mutate = useCallback(
    async (body: Mutation) => {
      setSaving(true)
      try {
        const res = await fetch(`/api/classroom/semester-plan/${plan.id}/mutate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (res.ok) startTransition(() => router.refresh())
      } finally {
        setSaving(false)
      }
    },
    [plan.id, router],
  )

  const loadCandidates = useCallback(async () => {
    if (candidates || candidatesLoading.current) return
    candidatesLoading.current = true
    try {
      const res = await fetch(`/api/classroom/semester-plan/${plan.id}/candidates`)
      if (res.ok) {
        const data = (await res.json()) as { candidates: CandidateBook[] }
        setCandidates(data.candidates)
      }
    } finally {
      candidatesLoading.current = false
    }
  }, [candidates, plan.id])

  const runVirgil = useCallback(
    async (body: { action: "regenerate_week"; weekIndex: number }) => {
      setVirgilBusy(true)
      try {
        const res = await fetch(`/api/classroom/semester-plan/${plan.id}/revise`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (res.ok) startTransition(() => router.refresh())
      } finally {
        setVirgilBusy(false)
      }
    },
    [plan.id, router],
  )

  const provision = useCallback(
    async (itemId: string): Promise<string | null> => {
      const res = await fetch(`/api/classroom/semester-plan/${plan.id}/provision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) return data.error ?? "Could not create the assignment."
      startTransition(() => router.refresh())
      return null
    },
    [plan.id, router],
  )

  const orderedIds = plan.week_list.map((w) => w.id)
  const moveWeek = (index: number, dir: -1 | 1) => {
    const next = [...orderedIds]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    void mutate({ action: "reorder_weeks", order: next })
  }

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
            Draft
          </span>
          {saving ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}
        </div>
        <p className="mt-1 font-serif text-sm text-muted-foreground">
          {plan.weeks} weeks
          {plan.term_start ? ` · begins ${plan.term_start}` : ""}
          {cap ? ` · cap ${formatMinutes(cap)}/week` : ""}
          {plan.generated_by_model ? ` · drafted by ${plan.generated_by_model}` : ""}
        </p>

        {/* Conversational Virgil assistant (iridescent — reserved for Virgil affordances) */}
        <SemesterPlanAssistant
          planId={plan.id}
          onApplied={() => startTransition(() => router.refresh())}
        />

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
        {plan.week_list.map((week, i) => (
          <WeekEditor
            key={week.id}
            week={week}
            cap={cap}
            classId={plan.class_id}
            isFirst={i === 0}
            isLast={i === plan.week_list.length - 1}
            virgilBusy={virgilBusy}
            candidates={candidates}
            onLoadCandidates={loadCandidates}
            onMutate={mutate}
            onProvision={provision}
            onMoveUp={() => moveWeek(i, -1)}
            onMoveDown={() => moveWeek(i, 1)}
            onRegenerate={() => runVirgil({ action: "regenerate_week", weekIndex: week.week_index })}
          />
        ))}
      </div>
    </div>
  )
}

// ── Week ────────────────────────────────────────────────────────────────────

function WeekEditor({
  week,
  cap,
  classId,
  isFirst,
  isLast,
  virgilBusy,
  candidates,
  onLoadCandidates,
  onMutate,
  onProvision,
  onMoveUp,
  onMoveDown,
  onRegenerate,
}: {
  week: PlanWeek
  cap: number | null
  classId: string | null
  isFirst: boolean
  isLast: boolean
  virgilBusy: boolean
  candidates: CandidateBook[] | null
  onLoadCandidates: () => void
  onMutate: (m: Mutation) => void
  onProvision: (itemId: string) => Promise<string | null>
  onMoveUp: () => void
  onMoveDown: () => void
  onRegenerate: () => void
}) {
  const [adding, setAdding] = useState(false)
  const pct = cap ? Math.min(100, Math.round((week.load_minutes / cap) * 100)) : 0

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold text-white"
              style={{ backgroundColor: RUBRIC.lapis }}
            >
              {week.week_index}
            </span>
            <input
              defaultValue={week.theme ?? ""}
              placeholder={`Week ${week.week_index} theme`}
              onBlur={(e) => {
                const v = e.target.value.trim()
                if (v !== (week.theme ?? "")) onMutate({ action: "update_week", weekId: week.id, theme: v || null })
              }}
              className="font-display text-lg font-semibold bg-transparent outline-none focus:bg-muted/40 rounded px-1 -mx-1"
              style={{ color: RUBRIC.ink }}
            />
          </div>
          {week.date_start ? (
            <p className="mt-1 font-serif text-xs text-muted-foreground">
              {week.date_start} – {week.date_end}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
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
          <div className="flex flex-col">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              title="Move week up"
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ChevronUp className="size-4" />
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              title="Move week down"
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ChevronDown className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <textarea
        defaultValue={week.notes ?? ""}
        placeholder="Teacher note (optional)"
        rows={1}
        onBlur={(e) => {
          const v = e.target.value.trim()
          if (v !== (week.notes ?? "")) onMutate({ action: "update_week", weekId: week.id, notes: v || null })
        }}
        className="mt-2 w-full resize-none rounded-lg bg-transparent px-1 py-1 font-serif text-sm text-muted-foreground outline-none focus:bg-muted/40"
      />

      <div className="mt-3 flex flex-col gap-2">
        {week.items.map((item) => (
          <ItemEditor
            key={item.id}
            item={item}
            classId={classId}
            candidates={candidates}
            onLoadCandidates={onLoadCandidates}
            onMutate={onMutate}
            onProvision={onProvision}
          />
        ))}
        {week.items.length === 0 ? (
          <span className="font-serif text-sm italic text-muted-foreground">Break — no reading</span>
        ) : null}
      </div>

      <div className="mt-3 flex items-center gap-2">
        {adding ? (
          <AddItemRow weekId={week.id} onMutate={onMutate} onClose={() => setAdding(false)} />
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-foreground/30 hover:text-foreground"
          >
            <Plus className="size-3" /> Add item
          </button>
        )}
        <button
          onClick={onRegenerate}
          disabled={virgilBusy}
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white disabled:opacity-50"
          style={{ backgroundImage: IRIDESCENT }}
          title="Ask Virgil to regenerate this week"
        >
          {virgilBusy ? <Loader2 className="size-3 animate-spin" /> : <RefreshCw className="size-3" />}
          Regenerate week
        </button>
      </div>
    </section>
  )
}

// ── Item ────────────────────────────────────────────────────────────────────

const ASSIGNABLE_TYPES = new Set<PlanItemType>(["reading", "essay", "discussion"])

function ItemEditor({
  item,
  classId,
  candidates,
  onLoadCandidates,
  onMutate,
  onProvision,
}: {
  item: PlanItem
  classId: string | null
  candidates: CandidateBook[] | null
  onLoadCandidates: () => void
  onMutate: (m: Mutation) => void
  onProvision: (itemId: string) => Promise<string | null>
}) {
  const [swapping, setSwapping] = useState(false)
  const [provisioning, setProvisioning] = useState(false)
  const [provisionError, setProvisionError] = useState<string | null>(null)
  const accent = ITEM_ACCENT[item.type]
  const notReadable =
    CONTENT_DEPENDENT_TYPES.has(item.type) && item.book_id && item.has_content === false

  // The bridge to coursework: a reading/essay/discussion item can become a draft
  // classroom assignment. Reading needs a book; the plan must be class-attached.
  const canProvision =
    !!classId &&
    !item.assignment_id &&
    ASSIGNABLE_TYPES.has(item.type) &&
    !(item.type === "reading" && !item.book_id)

  const provision = async () => {
    setProvisioning(true)
    setProvisionError(null)
    const err = await onProvision(item.id)
    if (err) setProvisionError(err)
    setProvisioning(false)
  }

  return (
    <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: accent.bg }}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: accent.fg }}>
              {PLAN_ITEM_TYPE_LABELS[item.type]}
            </span>
            {item.type === "quiz" ? (
              <select
                value={item.difficulty ?? "scholar"}
                onChange={(e) =>
                  onMutate({ action: "update_item", itemId: item.id, patch: { difficulty: e.target.value } })
                }
                className="rounded border border-border bg-background px-1 py-0.5 text-[10px] capitalize"
              >
                {TEACHER_QUIZ_DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
          <input
            defaultValue={item.title}
            onBlur={(e) => {
              const v = e.target.value.trim()
              if (v && v !== item.title) onMutate({ action: "update_item", itemId: item.id, patch: { title: v } })
            }}
            className="mt-0.5 w-full bg-transparent font-serif text-sm outline-none focus:bg-muted/40 rounded px-1 -mx-1"
            style={{ color: RUBRIC.ink }}
          />
        </div>
        <button
          onClick={() => onMutate({ action: "delete_item", itemId: item.id })}
          title="Remove item"
          className="shrink-0 text-muted-foreground hover:text-[#D7472F]"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
        {item.book_id ? (
          <button
            onClick={() => {
              setSwapping((s) => !s)
              onLoadCandidates()
            }}
            className="rounded border border-border bg-background px-1.5 py-0.5 font-medium hover:border-foreground/30"
          >
            {item.book_id} · swap
          </button>
        ) : item.type !== "custom_reading" ? (
          <button
            onClick={() => {
              setSwapping((s) => !s)
              onLoadCandidates()
            }}
            className="rounded border border-dashed border-border bg-background px-1.5 py-0.5 font-medium hover:border-foreground/30"
          >
            + book
          </button>
        ) : null}

        {item.book_id && (item.type === "reading" || item.type === "quiz") ? (
          <label className="flex items-center gap-1">
            ch
            <input
              defaultValue={item.chapter_refs?.length ? formatChapters(item.chapter_refs) : ""}
              placeholder="1–3, 5"
              onBlur={(e) => {
                const refs = parseChapters(e.target.value)
                const cur = item.chapter_refs ?? []
                if (refs.join() !== cur.join())
                  onMutate({ action: "update_item", itemId: item.id, patch: { chapter_refs: refs } })
              }}
              className="w-20 rounded border border-border bg-background px-1 py-0.5"
            />
          </label>
        ) : null}

        {item.est_minutes ? <span>{formatMinutes(item.est_minutes)}</span> : null}

        <label className="flex items-center gap-1">
          due
          <input
            type="date"
            defaultValue={item.due_date ?? ""}
            onBlur={(e) => {
              const v = e.target.value || null
              if (v !== (item.due_date ?? null))
                onMutate({ action: "update_item", itemId: item.id, patch: { due_date: v } })
            }}
            className="rounded border border-border bg-background px-1 py-0.5"
          />
        </label>
      </div>

      {swapping ? (
        <BookSwapPicker
          candidates={candidates}
          contentDependent={CONTENT_DEPENDENT_TYPES.has(item.type)}
          onPick={(bookId) => {
            onMutate({ action: "update_item", itemId: item.id, patch: { book_id: bookId } })
            setSwapping(false)
          }}
          onClose={() => setSwapping(false)}
        />
      ) : null}

      {notReadable ? (
        <span className="mt-1 flex items-center gap-1 text-[11px] font-medium" style={{ color: RUBRIC.vermilion }}>
          <AlertTriangle className="size-3" />
          in catalog, not yet readable in Tome
        </span>
      ) : null}
      {item.type === "custom_reading" ? (
        <span className="mt-1 block text-[11px] italic text-muted-foreground">outside reading · metadata only</span>
      ) : null}

      {item.assignment_id && classId ? (
        <a
          href={`/classroom/${classId}/assignment/${item.assignment_id}`}
          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold"
          style={{ color: RUBRIC.verdigris }}
        >
          <ExternalLink className="size-3" />
          Assignment created — open draft
        </a>
      ) : canProvision ? (
        <div className="mt-1.5 flex items-center gap-2">
          <button
            onClick={provision}
            disabled={provisioning}
            title="Create a draft classroom assignment from this item"
            className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium disabled:opacity-50"
            style={{ borderColor: RUBRIC.lapis, color: RUBRIC.lapis }}
          >
            {provisioning ? <Loader2 className="size-3 animate-spin" /> : <SquarePen className="size-3" />}
            Create assignment
          </button>
          {provisionError ? (
            <span className="text-[11px] font-medium" style={{ color: RUBRIC.vermilion }}>
              {provisionError}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

// ── Book swap picker ──────────────────────────────────────────────────────────

function BookSwapPicker({
  candidates,
  contentDependent,
  onPick,
  onClose,
}: {
  candidates: CandidateBook[] | null
  contentDependent: boolean
  onPick: (bookId: string) => void
  onClose: () => void
}) {
  const [q, setQ] = useState("")
  const list = (candidates ?? [])
    .filter((c) => {
      if (!q.trim()) return true
      const hay = `${c.title} ${c.author} ${c.id}`.toLowerCase()
      return hay.includes(q.toLowerCase())
    })
    .slice(0, 40)

  return (
    <div className="mt-2 rounded-lg border border-border bg-background p-2">
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the candidate catalog…"
          className="flex-1 rounded border border-border bg-background px-2 py-1 text-xs outline-none focus:border-foreground/30"
        />
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="size-3.5" />
        </button>
      </div>
      <div className="mt-2 max-h-48 overflow-y-auto">
        {candidates === null ? (
          <p className="px-1 py-2 text-xs text-muted-foreground">Loading catalog…</p>
        ) : list.length === 0 ? (
          <p className="px-1 py-2 text-xs text-muted-foreground">No matches.</p>
        ) : (
          list.map((c) => (
            <button
              key={c.id}
              onClick={() => onPick(c.id)}
              className="flex w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-muted/60"
            >
              <span className="min-w-0 truncate">
                <span className="font-medium" style={{ color: RUBRIC.ink }}>
                  {c.title}
                </span>{" "}
                <span className="text-muted-foreground">· {c.author}</span>
              </span>
              {contentDependent && !c.has_chapter_content ? (
                <span className="shrink-0 text-[10px] font-medium" style={{ color: RUBRIC.vermilion }}>
                  not readable
                </span>
              ) : c.has_chapter_content ? (
                <span className="shrink-0 text-[10px] font-medium" style={{ color: RUBRIC.verdigris }}>
                  readable
                </span>
              ) : null}
            </button>
          ))
        )}
      </div>
    </div>
  )
}

// ── Add item row ──────────────────────────────────────────────────────────────

function AddItemRow({
  weekId,
  onMutate,
  onClose,
}: {
  weekId: string
  onMutate: (m: Mutation) => void
  onClose: () => void
}) {
  const [type, setType] = useState<PlanItemType>("essay")
  const [title, setTitle] = useState("")

  const submit = () => {
    if (!title.trim()) return
    onMutate({ action: "add_item", weekId, type, title: title.trim() })
    onClose()
  }

  return (
    <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-background p-2">
      <select
        value={type}
        onChange={(e) => setType(e.target.value as PlanItemType)}
        className="rounded border border-border bg-background px-1.5 py-1 text-xs"
      >
        {PLAN_ITEM_TYPES.map((t) => (
          <option key={t} value={t}>
            {PLAN_ITEM_TYPE_LABELS[t]}
          </option>
        ))}
      </select>
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Item title…"
        className="flex-1 rounded border border-border bg-background px-2 py-1 text-xs outline-none focus:border-foreground/30"
      />
      <button
        onClick={submit}
        disabled={!title.trim()}
        className="rounded px-2 py-1 text-xs font-semibold text-white disabled:opacity-50"
        style={{ backgroundColor: RUBRIC.lapis }}
      >
        Add
      </button>
      <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
        <X className="size-3.5" />
      </button>
    </div>
  )
}
