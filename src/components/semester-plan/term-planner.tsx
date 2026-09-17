"use client"

// Teacher semester planner — the SOURCE surface. Units of study contain plan
// items (readings/quizzes/writing) which are bundled into packages; publishing
// a package creates the real assignment students see. Views: Units (default),
// Calendar, Categories (weights must total 100), Templates. Print = syllabus.

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  CalendarRange,
  ChevronLeft,
  FileEdit,
  HelpCircle,
  LayoutList,
  MessageSquare,
  Percent,
  Plus,
  Printer,
  Save,
  Send,
  Trash2,
  Wand2,
} from "lucide-react"
import { getBook } from "@/lib/content"
import {
  applyTemplate,
  autoPaceUnit,
  createTermPlan,
  deleteCategory,
  deletePackage,
  deletePlanItem,
  deleteUnit,
  getPlannerState,
  listTemplates,
  publishPackage,
  saveTemplate,
  updateTermPlan,
  upsertCategory,
  upsertPackage,
  upsertPlanItem,
  upsertUnit,
  type CategoryRow,
  type PackageRow,
  type PlanItemRow,
  type PlannerState,
  type TemplateRow,
  type UnitRow,
} from "@/lib/actions/planner"

const LAPIS = "#2C4A7E"
const GOLD = "#C8972F"
const VERDIGRIS = "#3E7C6A"
const VERMILION = "#D7472F"

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const ITEM_TYPE_OPTIONS = [
  { value: "reading", label: "Reading", icon: BookOpen },
  { value: "quiz", label: "Quiz", icon: HelpCircle },
  { value: "essay", label: "Writing", icon: FileEdit },
  { value: "discussion", label: "Discussion", icon: MessageSquare },
  { value: "assessment", label: "Assessment", icon: HelpCircle },
  { value: "note", label: "Note", icon: MessageSquare },
] as const

type View = "units" | "calendar" | "categories" | "templates"

function fmtDate(d: string | null | undefined): string {
  if (!d) return "—"
  return new Date(`${d.slice(0, 10)}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

export function TermPlanner({ classroomId }: { classroomId: string }) {
  const [state, setState] = useState<PlannerState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<View>("units")
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    const r = await getPlannerState(classroomId)
    if (r.ok) {
      setState(r.data)
      setError(null)
    } else {
      setError(r.error)
    }
    setLoading(false)
  }, [classroomId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const run = useCallback(
    async (fn: () => Promise<{ ok: boolean; error?: string }>) => {
      setBusy(true)
      const r = await fn()
      if (!r.ok) setError(r.error ?? "Something went wrong.")
      await refresh()
      setBusy(false)
    },
    [refresh],
  )

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-sm text-muted-foreground">
        Loading planner…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="print:hidden">
        <Link
          href={`/classroom/${classroomId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Classroom
        </Link>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 print:hidden">
          {error}
        </div>
      )}

      {!state?.plan ? (
        <NewTermForm
          classroomId={classroomId}
          busy={busy}
          onCreate={(input) => run(() => createTermPlan(input))}
          onApplyTemplate={(input) => run(() => applyTemplate(input))}
        />
      ) : (
        <PlanEditor
          classroomId={classroomId}
          state={state}
          view={view}
          setView={setView}
          busy={busy}
          run={run}
        />
      )}
    </div>
  )
}

// ── New term ──────────────────────────────────────────────────────────────

function NewTermForm({
  classroomId,
  busy,
  onCreate,
  onApplyTemplate,
}: {
  classroomId: string
  busy: boolean
  onCreate: (input: {
    classroomId: string
    title: string
    termStart: string
    termEnd: string
    meetingDays: number[]
  }) => void
  onApplyTemplate: (input: {
    templateId: string
    classroomId: string
    termStart: string
    termEnd: string
  }) => void
}) {
  const [title, setTitle] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [days, setDays] = useState<number[]>([1, 3, 5])
  const [templates, setTemplates] = useState<TemplateRow[]>([])
  const [templateId, setTemplateId] = useState("")

  useEffect(() => {
    void listTemplates().then((r) => {
      if (r.ok) setTemplates(r.data)
    })
  }, [])

  const valid = title.trim() && start && end && end > start

  return (
    <div className="mt-6 max-w-lg">
      <h1 className="font-display text-2xl font-semibold">
        Plan a term
      </h1>
      <p className="mt-1 font-serif text-sm text-muted-foreground">
        Set the term dates and meeting days, then build units of study, bundle work into
        packages, and publish them as assignments.
      </p>

      <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-5">
        <label className="block text-sm">
          <span className="font-medium">Term title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Fall 2026 — Rhetoric & Poetics"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="font-medium">Starts</span>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Ends</span>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </label>
        </div>
        <div className="text-sm">
          <span className="font-medium">Meeting days</span>
          <div className="mt-1.5 flex gap-1.5">
            {DAY_LABELS.map((label, di) => {
              const on = days.includes(di)
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    setDays((prev) =>
                      on ? prev.filter((d) => d !== di) : [...prev, di].sort(),
                    )
                  }
                  className="rounded-lg border px-2.5 py-1.5 text-xs font-medium"
                  style={
                    on
                      ? { backgroundColor: LAPIS, borderColor: LAPIS, color: "white" }
                      : { borderColor: "var(--border)" }
                  }
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
        <button
          type="button"
          disabled={!valid || busy}
          onClick={() =>
            onCreate({ classroomId, title: title.trim(), termStart: start, termEnd: end, meetingDays: days })
          }
          className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: LAPIS }}
        >
          Create term plan
        </button>

        {templates.length > 0 && (
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium">…or start from a saved template</p>
            <div className="mt-2 flex gap-2">
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">Choose a template</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!templateId || !start || !end || busy}
                onClick={() =>
                  onApplyTemplate({ templateId, classroomId, termStart: start, termEnd: end })
                }
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium disabled:opacity-50"
              >
                Apply
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Uses the term dates above; unit and due dates shift to match.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Plan editor shell ─────────────────────────────────────────────────────

type RunFn = (fn: () => Promise<{ ok: boolean; error?: string }>) => Promise<void>

function PlanEditor({
  classroomId,
  state,
  view,
  setView,
  busy,
  run,
}: {
  classroomId: string
  state: PlannerState
  view: View
  setView: (v: View) => void
  busy: boolean
  run: RunFn
}) {
  const plan = state.plan!
  const weightTotal = state.categories.reduce((s, c) => s + Number(c.weight), 0)

  const VIEWS: { key: View; label: string; icon: typeof LayoutList }[] = [
    { key: "units", label: "Units", icon: LayoutList },
    { key: "calendar", label: "Calendar", icon: CalendarRange },
    { key: "categories", label: "Categories", icon: Percent },
    { key: "templates", label: "Templates", icon: Save },
  ]

  return (
    <div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {plan.title}
          </h1>
          <p className="mt-0.5 font-serif text-sm text-muted-foreground">
            {fmtDate(plan.term_start)} – {fmtDate(plan.term_end)} ·{" "}
            {(plan.meeting_days ?? []).map((d) => DAY_LABELS[d]).join(" ") || "no meeting days"} ·{" "}
            <span className="uppercase tracking-wide">{plan.status}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {plan.status !== "active" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => updateTermPlan({ planId: plan.id, status: "active" }))}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: VERDIGRIS }}
            >
              Activate term
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium"
          >
            <Printer className="size-4" />
            Syllabus
          </button>
        </div>
      </div>

      <div className="mt-5 flex gap-1 rounded-xl bg-muted/40 p-1 print:hidden">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setView(v.key)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium"
            style={
              view === v.key
                ? { backgroundColor: "white", color: LAPIS, boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }
                : { color: "var(--muted-foreground)" }
            }
          >
            <v.icon className="size-4" />
            {v.label}
          </button>
        ))}
      </div>

      <div className="print:hidden">
        {view === "units" && <UnitsView state={state} busy={busy} run={run} />}
        {view === "calendar" && <CalendarView state={state} />}
        {view === "categories" && (
          <CategoriesView state={state} weightTotal={weightTotal} busy={busy} run={run} />
        )}
        {view === "templates" && (
          <TemplatesView classroomId={classroomId} state={state} busy={busy} run={run} />
        )}
      </div>

      <SyllabusPrint state={state} weightTotal={weightTotal} />
    </div>
  )
}

// ── Units view (default) ──────────────────────────────────────────────────

function UnitsView({ state, busy, run }: { state: PlannerState; busy: boolean; run: RunFn }) {
  const plan = state.plan!
  const [showNewUnit, setShowNewUnit] = useState(false)

  return (
    <div className="mt-6 space-y-5">
      {state.units.map((u) => (
        <UnitCard key={u.id} unit={u} state={state} busy={busy} run={run} />
      ))}

      {showNewUnit ? (
        <UnitForm
          planId={plan.id}
          sortOrder={state.units.length}
          busy={busy}
          onSave={async (input) => {
            await run(() => upsertUnit(input))
            setShowNewUnit(false)
          }}
          onCancel={() => setShowNewUnit(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowNewUnit(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <Plus className="size-4" />
          Add unit
        </button>
      )}
    </div>
  )
}

function UnitForm({
  planId,
  unit,
  sortOrder,
  busy,
  onSave,
  onCancel,
}: {
  planId: string
  unit?: UnitRow
  sortOrder: number
  busy: boolean
  onSave: (input: {
    id?: string
    planId: string
    title: string
    description?: string | null
    startsOn?: string | null
    endsOn?: string | null
    bookId?: string | null
    sortOrder: number
  }) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(unit?.title ?? "")
  const [description, setDescription] = useState(unit?.description ?? "")
  const [startsOn, setStartsOn] = useState(unit?.starts_on ?? "")
  const [endsOn, setEndsOn] = useState(unit?.ends_on ?? "")
  const [bookId, setBookId] = useState(unit?.book_id ?? "")

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium">Unit title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Starts</span>
          <input
            type="date"
            value={startsOn}
            onChange={(e) => setStartsOn(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Ends</span>
          <input
            type="date"
            value={endsOn}
            onChange={(e) => setEndsOn(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Primary book (slug)</span>
          <input
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            placeholder="the-iliad"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Description</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={!title.trim() || busy}
          onClick={() =>
            onSave({
              id: unit?.id,
              planId,
              title: title.trim(),
              description: description || null,
              startsOn: startsOn || null,
              endsOn: endsOn || null,
              bookId: bookId || null,
              sortOrder: unit?.sort_order ?? sortOrder,
            })
          }
          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: LAPIS }}
        >
          Save unit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-3 py-1.5 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function UnitCard({
  unit,
  state,
  busy,
  run,
}: {
  unit: UnitRow
  state: PlannerState
  busy: boolean
  run: RunFn
}) {
  const [editing, setEditing] = useState(false)
  const [showNewItem, setShowNewItem] = useState(false)
  const [showNewPackage, setShowNewPackage] = useState(false)

  const items = state.items.filter((it) => it.unit_id === unit.id)
  const packages = state.packages.filter((p) => p.unit_id === unit.id)
  const linkByItem = useMemo(
    () => new Map(state.packageItems.map((l) => [l.plan_item_id, l.package_id])),
    [state.packageItems],
  )
  const book = unit.book_id ? getBook(unit.book_id) : null

  if (editing) {
    return (
      <UnitForm
        planId={unit.plan_id}
        unit={unit}
        sortOrder={unit.sort_order}
        busy={busy}
        onSave={async (input) => {
          await run(() => upsertUnit(input))
          setEditing(false)
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-start justify-between gap-3 border-b border-border/60 px-5 py-4">
        <div>
          <h2 className="font-display text-lg font-semibold">
            {unit.title}
          </h2>
          <p className="mt-0.5 font-serif text-sm text-muted-foreground">
            {fmtDate(unit.starts_on)} – {fmtDate(unit.ends_on)}
            {book ? ` · ${book.title}` : ""}
            {unit.description ? ` · ${unit.description}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            disabled={busy}
            title="Auto-pace item due dates across the unit's meeting days"
            onClick={() => run(() => autoPaceUnit(unit.id))}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium disabled:opacity-50"
          >
            <Wand2 className="size-3.5" />
            Auto-pace
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium"
          >
            Edit
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              if (confirm(`Delete unit "${unit.title}" and its items?`)) {
                void run(() => deleteUnit(unit.id))
              }
            }}
            className="rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:text-red-700"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Items
        </p>
        <ul className="mt-2 space-y-1.5">
          {items.map((it) => (
            <ItemRow
              key={it.id}
              item={it}
              packages={packages}
              packageId={linkByItem.get(it.id) ?? null}
              busy={busy}
              run={run}
            />
          ))}
          {items.length === 0 && (
            <li className="text-sm text-muted-foreground">No items yet.</li>
          )}
        </ul>
        {showNewItem ? (
          <ItemForm
            unitId={unit.id}
            packages={packages}
            sortOrder={items.length}
            busy={busy}
            onSave={async (input) => {
              await run(() => upsertPlanItem(input))
              setShowNewItem(false)
            }}
            onCancel={() => setShowNewItem(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowNewItem(true)}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: LAPIS }}
          >
            <Plus className="size-3.5" />
            Add item
          </button>
        )}
      </div>

      <div className="border-t border-border/60 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Packages
        </p>
        <div className="mt-2 space-y-2">
          {packages.map((p) => (
            <PackageCard
              key={p.id}
              pkg={p}
              itemCount={state.packageItems.filter((l) => l.package_id === p.id).length}
              categories={state.categories}
              busy={busy}
              run={run}
            />
          ))}
          {packages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No packages yet — bundle this unit&apos;s items into an assignable package.
            </p>
          )}
        </div>
        {showNewPackage ? (
          <PackageForm
            unitId={unit.id}
            categories={state.categories}
            sortOrder={packages.length}
            busy={busy}
            onSave={async (input) => {
              await run(() => upsertPackage(input))
              setShowNewPackage(false)
            }}
            onCancel={() => setShowNewPackage(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowNewPackage(true)}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: GOLD }}
          >
            <Plus className="size-3.5" />
            Add package
          </button>
        )}
      </div>
    </div>
  )
}

function ItemRow({
  item,
  packages,
  packageId,
  busy,
  run,
}: {
  item: PlanItemRow
  packages: PackageRow[]
  packageId: string | null
  busy: boolean
  run: RunFn
}) {
  const [editing, setEditing] = useState(false)
  const opt = ITEM_TYPE_OPTIONS.find((o) => o.value === item.type)
  const Icon = opt?.icon ?? BookOpen
  const pkg = packages.find((p) => p.id === packageId)
  const book = item.book_id ? getBook(item.book_id) : null

  if (editing) {
    return (
      <li>
        <ItemForm
          unitId={item.unit_id!}
          item={item}
          packages={packages}
          packageId={packageId}
          sortOrder={item.sort_order}
          busy={busy}
          onSave={async (input) => {
            await run(() => upsertPlanItem(input))
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    )
  }

  return (
    <li className="flex items-center gap-2.5 rounded-lg border border-border/50 px-3 py-2">
      <Icon className="size-4 shrink-0" style={{ color: LAPIS }} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{item.title}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {[
            opt?.label ?? item.type,
            book?.title,
            item.chapter_start != null
              ? item.chapter_end != null && item.chapter_end !== item.chapter_start
                ? `Ch. ${item.chapter_start + 1}–${item.chapter_end + 1}`
                : `Ch. ${item.chapter_start + 1}`
              : null,
            item.due_date ? `due ${fmtDate(item.due_date)}` : null,
            item.is_required ? null : "optional",
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      {pkg && (
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ backgroundColor: "rgba(200,151,47,0.14)", color: GOLD }}
        >
          {pkg.title}
        </span>
      )}
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        Edit
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => void run(() => deletePlanItem(item.id))}
        className="shrink-0 text-muted-foreground hover:text-red-700"
        aria-label="Delete item"
      >
        <Trash2 className="size-3.5" />
      </button>
    </li>
  )
}

function ItemForm({
  unitId,
  item,
  packages,
  packageId,
  sortOrder,
  busy,
  onSave,
  onCancel,
}: {
  unitId: string
  item?: PlanItemRow
  packages: PackageRow[]
  packageId?: string | null
  sortOrder: number
  busy: boolean
  onSave: (input: {
    id?: string
    unitId: string
    type: "reading" | "quiz" | "essay" | "discussion" | "assessment" | "note"
    title: string
    prompt?: string | null
    bookId?: string | null
    chapterStart?: number | null
    chapterEnd?: number | null
    isRequired?: boolean
    dueDate?: string | null
    sortOrder: number
    packageId?: string | null
  }) => void
  onCancel: () => void
}) {
  const [type, setType] = useState(item?.type ?? "reading")
  const [title, setTitle] = useState(item?.title ?? "")
  const [prompt, setPrompt] = useState(item?.prompt ?? "")
  const [bookId, setBookId] = useState(item?.book_id ?? "")
  const [chStart, setChStart] = useState(item?.chapter_start != null ? String(item.chapter_start + 1) : "")
  const [chEnd, setChEnd] = useState(item?.chapter_end != null ? String(item.chapter_end + 1) : "")
  const [required, setRequired] = useState(item?.is_required ?? true)
  const [dueDate, setDueDate] = useState(item?.due_date ?? "")
  const [pkgId, setPkgId] = useState(packageId ?? "")

  return (
    <div className="mt-2 rounded-xl border border-border bg-muted/20 p-3">
      <div className="grid gap-2.5 sm:grid-cols-3">
        <label className="block text-xs">
          <span className="font-medium">Type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
          >
            {ITEM_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs sm:col-span-2">
          <span className="font-medium">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
          />
        </label>
        {(type === "reading" || type === "quiz" || type === "assessment") && (
          <>
            <label className="block text-xs">
              <span className="font-medium">Book (slug)</span>
              <input
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                placeholder="the-iliad"
                className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
              />
            </label>
            <label className="block text-xs">
              <span className="font-medium">Ch. from</span>
              <input
                type="number"
                min={1}
                value={chStart}
                onChange={(e) => setChStart(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
              />
            </label>
            <label className="block text-xs">
              <span className="font-medium">Ch. to</span>
              <input
                type="number"
                min={1}
                value={chEnd}
                onChange={(e) => setChEnd(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
              />
            </label>
          </>
        )}
        {(type === "essay" || type === "discussion" || type === "note") && (
          <label className="block text-xs sm:col-span-3">
            <span className="font-medium">Prompt</span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
            />
          </label>
        )}
        <label className="block text-xs">
          <span className="font-medium">Due</span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="font-medium">Package</span>
          <select
            value={pkgId}
            onChange={(e) => setPkgId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
          >
            <option value="">None</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-5 flex items-center gap-1.5 text-xs">
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
          />
          Required
        </label>
      </div>
      <div className="mt-2.5 flex gap-2">
        <button
          type="button"
          disabled={!title.trim() || busy}
          onClick={() =>
            onSave({
              id: item?.id,
              unitId,
              type: type as "reading" | "quiz" | "essay" | "discussion" | "assessment" | "note",
              title: title.trim(),
              prompt: prompt || null,
              bookId: bookId || null,
              chapterStart: chStart ? Number(chStart) - 1 : null,
              chapterEnd: chEnd ? Number(chEnd) - 1 : chStart ? Number(chStart) - 1 : null,
              isRequired: required,
              dueDate: dueDate || null,
              sortOrder: item?.sort_order ?? sortOrder,
              packageId: pkgId || null,
            })
          }
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: LAPIS }}
        >
          Save item
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-3 py-1.5 text-xs"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function PackageCard({
  pkg,
  itemCount,
  categories,
  busy,
  run,
}: {
  pkg: PackageRow
  itemCount: number
  categories: CategoryRow[]
  busy: boolean
  run: RunFn
}) {
  const [editing, setEditing] = useState(false)
  const category = categories.find((c) => c.id === pkg.grading_category_id)
  const published = !!pkg.published_assignment_id

  if (editing) {
    return (
      <PackageForm
        unitId={pkg.unit_id}
        pkg={pkg}
        categories={categories}
        sortOrder={pkg.sort_order}
        busy={busy}
        onSave={async (input) => {
          await run(() => upsertPackage(input))
          setEditing(false)
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/70 px-3.5 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{pkg.title}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {[
            `${itemCount} item${itemCount === 1 ? "" : "s"}`,
            `${pkg.points} pts`,
            category?.name ?? "uncategorized",
            pkg.due_at ? `due ${fmtDate(pkg.due_at)}` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${published ? "" : "bg-muted text-foreground"}`}
        style={published ? { backgroundColor: "rgba(62,124,106,0.18)", color: VERDIGRIS } : undefined}
      >
        {published ? "Published" : "Draft"}
      </span>
      <button
        type="button"
        disabled={busy || itemCount === 0}
        title={itemCount === 0 ? "Add items to the package first" : undefined}
        onClick={() => run(() => publishPackage(pkg.id))}
        className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        style={{ backgroundColor: published ? LAPIS : VERDIGRIS }}
      >
        <Send className="size-3.5" />
        {published ? "Re-publish" : "Publish"}
      </button>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        Edit
      </button>
      {!published && (
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            if (confirm(`Delete package "${pkg.title}"?`)) {
              void run(() => deletePackage(pkg.id))
            }
          }}
          className="shrink-0 text-muted-foreground hover:text-red-700"
          aria-label="Delete package"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  )
}

function PackageForm({
  unitId,
  pkg,
  categories,
  sortOrder,
  busy,
  onSave,
  onCancel,
}: {
  unitId: string
  pkg?: PackageRow
  categories: CategoryRow[]
  sortOrder: number
  busy: boolean
  onSave: (input: {
    id?: string
    unitId: string
    title: string
    dueAt?: string | null
    points?: number
    gradingCategoryId?: string | null
    latePolicy?: { accept_late: boolean; penalty_pct_per_day: number; cutoff_days: number | null }
    sortOrder: number
  }) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(pkg?.title ?? "")
  const [dueDate, setDueDate] = useState(pkg?.due_at ? pkg.due_at.slice(0, 10) : "")
  const [points, setPoints] = useState(String(pkg?.points ?? 100))
  const [categoryId, setCategoryId] = useState(pkg?.grading_category_id ?? "")
  const [acceptLate, setAcceptLate] = useState(pkg?.late_policy?.accept_late ?? true)
  const [penalty, setPenalty] = useState(String(pkg?.late_policy?.penalty_pct_per_day ?? 0))

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-3">
      <div className="grid gap-2.5 sm:grid-cols-3">
        <label className="block text-xs sm:col-span-2">
          <span className="font-medium">Package title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="font-medium">Points</span>
          <input
            type="number"
            min={0}
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="font-medium">Due date</span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="font-medium">Category</span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
          >
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.weight}%)
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end gap-2 text-xs">
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={acceptLate}
              onChange={(e) => setAcceptLate(e.target.checked)}
            />
            Accept late
          </label>
          {acceptLate && (
            <label className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={100}
                value={penalty}
                onChange={(e) => setPenalty(e.target.value)}
                className="w-14 rounded-lg border border-border bg-background px-1.5 py-1 text-sm"
              />
              %/day
            </label>
          )}
        </div>
      </div>
      <div className="mt-2.5 flex gap-2">
        <button
          type="button"
          disabled={!title.trim() || busy}
          onClick={() =>
            onSave({
              id: pkg?.id,
              unitId,
              title: title.trim(),
              dueAt: dueDate ? new Date(`${dueDate}T23:59:00`).toISOString() : null,
              points: Number(points) || 0,
              gradingCategoryId: categoryId || null,
              latePolicy: {
                accept_late: acceptLate,
                penalty_pct_per_day: Number(penalty) || 0,
                cutoff_days: null,
              },
              sortOrder: pkg?.sort_order ?? sortOrder,
            })
          }
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: GOLD }}
        >
          Save package
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-3 py-1.5 text-xs"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ── Calendar view ─────────────────────────────────────────────────────────

function CalendarView({ state }: { state: PlannerState }) {
  const plan = state.plan!
  const events = useMemo(() => {
    const rows: { date: string; label: string; kind: "item" | "package"; unit: string }[] = []
    const unitTitle = new Map(state.units.map((u) => [u.id, u.title]))
    for (const it of state.items) {
      if (it.due_date) {
        rows.push({
          date: it.due_date,
          label: it.title,
          kind: "item",
          unit: unitTitle.get(it.unit_id ?? "") ?? "",
        })
      }
    }
    for (const p of state.packages) {
      if (p.due_at) {
        rows.push({
          date: p.due_at.slice(0, 10),
          label: `${p.title} (package due)`,
          kind: "package",
          unit: unitTitle.get(p.unit_id) ?? "",
        })
      }
    }
    return rows.sort((a, b) => a.date.localeCompare(b.date))
  }, [state])

  const byMonth = useMemo(() => {
    const m = new Map<string, typeof events>()
    for (const e of events) {
      const key = e.date.slice(0, 7)
      const list = m.get(key) ?? []
      list.push(e)
      m.set(key, list)
    }
    return [...m.entries()]
  }, [events])

  if (events.length === 0) {
    return (
      <p className="mt-8 text-sm text-muted-foreground">
        Nothing scheduled yet — set due dates on items and packages (or use Auto-pace).
      </p>
    )
  }

  return (
    <div className="mt-6 space-y-6">
      <p className="text-sm text-muted-foreground">
        Term {fmtDate(plan.term_start)} – {fmtDate(plan.term_end)} · class meets{" "}
        {(plan.meeting_days ?? []).map((d) => DAY_LABELS[d]).join(", ") || "—"}
      </p>
      {byMonth.map(([month, list]) => (
        <div key={month}>
          <h3 className="font-display text-base font-semibold">
            {new Date(`${month}-01T00:00:00`).toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <ul className="mt-2 space-y-1">
            {list.map((e, i) => (
              <li key={i} className="flex items-center gap-3 rounded-lg border border-border/50 px-3 py-2 text-sm">
                <span className="w-16 shrink-0 tabular-nums text-muted-foreground">
                  {fmtDate(e.date)}
                </span>
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: e.kind === "package" ? GOLD : LAPIS }}
                />
                <span className="min-w-0 flex-1 truncate">{e.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{e.unit}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ── Categories view ───────────────────────────────────────────────────────

function CategoriesView({
  state,
  weightTotal,
  busy,
  run,
}: {
  state: PlannerState
  weightTotal: number
  busy: boolean
  run: RunFn
}) {
  const plan = state.plan!
  const [drafts, setDrafts] = useState<Record<string, { name: string; weight: string; drop: string }>>({})
  const [newName, setNewName] = useState("")
  const [newWeight, setNewWeight] = useState("")

  const balanced = Math.abs(weightTotal - 100) < 0.001

  return (
    <div className="mt-6 max-w-2xl">
      <div
        className="rounded-lg px-3 py-2 text-sm font-medium"
        style={
          balanced
            ? { backgroundColor: "rgba(62,124,106,0.10)", color: VERDIGRIS }
            : { backgroundColor: "rgba(215,71,47,0.08)", color: VERMILION }
        }
      >
        Weights total {weightTotal}%{balanced ? " — balanced." : " — weights should sum to 100%."}
      </div>

      <div className="mt-4 space-y-2">
        {state.categories.map((c) => {
          const d = drafts[c.id] ?? {
            name: c.name,
            weight: String(c.weight),
            drop: String(c.drop_lowest),
          }
          const dirty =
            d.name !== c.name || Number(d.weight) !== Number(c.weight) || Number(d.drop) !== c.drop_lowest
          return (
            <div key={c.id} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5">
              <input
                value={d.name}
                onChange={(e) => setDrafts((m) => ({ ...m, [c.id]: { ...d, name: e.target.value } }))}
                className="min-w-0 flex-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
              />
              <label className="flex items-center gap-1 text-xs text-muted-foreground">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={d.weight}
                  onChange={(e) => setDrafts((m) => ({ ...m, [c.id]: { ...d, weight: e.target.value } }))}
                  className="w-16 rounded-lg border border-border bg-background px-2 py-1.5 text-sm tabular-nums"
                />
                %
              </label>
              <label className="flex items-center gap-1 text-xs text-muted-foreground">
                drop
                <input
                  type="number"
                  min={0}
                  value={d.drop}
                  onChange={(e) => setDrafts((m) => ({ ...m, [c.id]: { ...d, drop: e.target.value } }))}
                  className="w-12 rounded-lg border border-border bg-background px-2 py-1.5 text-sm tabular-nums"
                />
              </label>
              <button
                type="button"
                disabled={!dirty || busy}
                onClick={() =>
                  run(() =>
                    upsertCategory({
                      id: c.id,
                      planId: plan.id,
                      name: d.name.trim(),
                      weight: Number(d.weight) || 0,
                      dropLowest: Number(d.drop) || 0,
                      sortOrder: c.sort_order,
                    }),
                  )
                }
                className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
                style={{ backgroundColor: LAPIS }}
              >
                Save
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  if (confirm(`Delete category "${c.name}"?`)) {
                    void run(() => deleteCategory(c.id))
                  }
                }}
                className="text-muted-foreground hover:text-red-700"
                aria-label="Delete category"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category (e.g. Participation)"
          className="min-w-0 flex-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
        />
        <input
          type="number"
          min={0}
          max={100}
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          placeholder="%"
          className="w-16 rounded-lg border border-border bg-background px-2 py-1.5 text-sm tabular-nums"
        />
        <button
          type="button"
          disabled={!newName.trim() || !newWeight || busy}
          onClick={async () => {
            await run(() =>
              upsertCategory({
                planId: plan.id,
                name: newName.trim(),
                weight: Number(newWeight) || 0,
                sortOrder: state.categories.length,
              }),
            )
            setNewName("")
            setNewWeight("")
          }}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: LAPIS }}
        >
          <Plus className="size-3.5" />
          Add
        </button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Grades are computed server-side from these weights (drop-lowest per category,
        excused work excluded). Both the teacher gradebook and student grades read the
        same computation.
      </p>
    </div>
  )
}

// ── Templates view ────────────────────────────────────────────────────────

function TemplatesView({
  classroomId,
  state,
  busy,
  run,
}: {
  classroomId: string
  state: PlannerState
  busy: boolean
  run: RunFn
}) {
  const plan = state.plan!
  const [templates, setTemplates] = useState<TemplateRow[]>([])
  const [name, setName] = useState("")
  const [applyId, setApplyId] = useState("")
  const [applyStart, setApplyStart] = useState("")
  const [applyEnd, setApplyEnd] = useState("")
  const [saved, setSaved] = useState(false)

  const loadTemplates = useCallback(() => {
    void listTemplates().then((r) => {
      if (r.ok) setTemplates(r.data)
    })
  }, [])

  useEffect(loadTemplates, [loadTemplates])

  return (
    <div className="mt-6 max-w-2xl space-y-6">
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="font-display text-base font-semibold">
          Save this term as a template
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Captures units, items, packages, and categories with dates as offsets from the
          term start — reusable for any future term.
        </p>
        <div className="mt-3 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`${plan.title} template`}
            className="min-w-0 flex-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
          />
          <button
            type="button"
            disabled={!name.trim() || busy}
            onClick={async () => {
              await run(() => saveTemplate(plan.id, name.trim()))
              setName("")
              setSaved(true)
              loadTemplates()
            }}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: LAPIS }}
          >
            <Save className="size-3.5" />
            Save
          </button>
        </div>
        {saved && (
          <p className="mt-2 text-xs" style={{ color: VERDIGRIS }}>
            Template saved.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="font-display text-base font-semibold">
          Start a new term from a template
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Creates a fresh draft plan for this classroom; the current plan is untouched.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <select
            value={applyId}
            onChange={(e) => setApplyId(e.target.value)}
            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
          >
            <option value="">Choose template</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={applyStart}
            onChange={(e) => setApplyStart(e.target.value)}
            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
          />
          <input
            type="date"
            value={applyEnd}
            onChange={(e) => setApplyEnd(e.target.value)}
            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
          />
        </div>
        <button
          type="button"
          disabled={!applyId || !applyStart || !applyEnd || busy}
          onClick={() =>
            run(() =>
              applyTemplate({
                templateId: applyId,
                classroomId,
                termStart: applyStart,
                termEnd: applyEnd,
              }),
            )
          }
          className="mt-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        >
          Create term from template
        </button>
      </div>

      {templates.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold">Your templates</h3>
          <ul className="mt-2 space-y-1">
            {templates.map((t) => (
              <li key={t.id} className="rounded-lg border border-border/50 px-3 py-2 text-sm">
                {t.name}
                <span className="ml-2 text-xs text-muted-foreground">
                  saved {fmtDate(t.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ── Print-only syllabus ───────────────────────────────────────────────────

function SyllabusPrint({ state, weightTotal }: { state: PlannerState; weightTotal: number }) {
  const plan = state.plan!
  return (
    <div className="hidden print:block">
      <h1 className="font-display text-2xl font-semibold">{plan.title}</h1>
      <p className="mt-1 font-serif text-sm">
        {fmtDate(plan.term_start)} – {fmtDate(plan.term_end)} · class meets{" "}
        {(plan.meeting_days ?? []).map((d) => DAY_LABELS[d]).join(", ") || "—"}
      </p>

      {state.categories.length > 0 && (
        <section className="mt-5">
          <h2 className="font-display text-lg font-semibold">Grading</h2>
          <table className="mt-2 w-full text-sm">
            <tbody>
              {state.categories.map((c) => (
                <tr key={c.id}>
                  <td className="py-0.5">{c.name}</td>
                  <td className="py-0.5 text-right tabular-nums">{c.weight}%</td>
                  <td className="py-0.5 pl-4 text-xs">
                    {c.drop_lowest > 0 ? `lowest ${c.drop_lowest} dropped` : ""}
                  </td>
                </tr>
              ))}
              <tr className="border-t font-semibold">
                <td className="py-0.5">Total</td>
                <td className="py-0.5 text-right tabular-nums">{weightTotal}%</td>
                <td />
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {state.units.map((u) => {
        const items = state.items.filter((it) => it.unit_id === u.id)
        const packages = state.packages.filter((p) => p.unit_id === u.id)
        const book = u.book_id ? getBook(u.book_id) : null
        return (
          <section key={u.id} className="mt-5">
            <h2 className="font-display text-lg font-semibold">{u.title}</h2>
            <p className="font-serif text-sm">
              {fmtDate(u.starts_on)} – {fmtDate(u.ends_on)}
              {book ? ` · ${book.title}` : ""}
              {u.description ? ` — ${u.description}` : ""}
            </p>
            {items.length > 0 && (
              <ul className="mt-1.5 list-disc pl-5 text-sm">
                {items.map((it) => (
                  <li key={it.id}>
                    {it.title}
                    {it.due_date ? ` (due ${fmtDate(it.due_date)})` : ""}
                    {it.is_required ? "" : " — optional"}
                  </li>
                ))}
              </ul>
            )}
            {packages.length > 0 && (
              <p className="mt-1.5 text-sm">
                <span className="font-semibold">Graded work:</span>{" "}
                {packages
                  .map(
                    (p) =>
                      `${p.title} (${p.points} pts${p.due_at ? `, due ${fmtDate(p.due_at)}` : ""})`,
                  )
                  .join("; ")}
              </p>
            )}
          </section>
        )
      })}
    </div>
  )
}
