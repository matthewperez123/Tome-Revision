"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Loader2, X, Search, Check, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { IRIDESCENT, RUBRIC } from "@/lib/semester-plan/rubric"
import { TEACHER_QUIZ_DIFFICULTIES } from "@/lib/teacher-quiz-types"

interface BookOpt {
  id: string
  title: string
  author: string
  tradition: string
}

const FIELD =
  "h-10 w-full rounded-xl border border-border bg-card px-3 text-sm focus:border-[var(--tome-accent)] focus:outline-none"
const LABEL = "text-xs font-semibold uppercase tracking-wider text-muted-foreground"

export function SemesterPlanWizard({ classId }: { classId: string }) {
  const router = useRouter()
  const [books, setBooks] = useState<BookOpt[]>([])

  // Setup state
  const [title, setTitle] = useState("")
  const [weeks, setWeeks] = useState(12)
  const [termStart, setTermStart] = useState("")
  const [level, setLevel] = useState("")
  const [meetingsPerWeek, setMeetingsPerWeek] = useState(3)
  const [themes, setThemes] = useState<string[]>([])
  const [themeInput, setThemeInput] = useState("")
  const [maxMinutes, setMaxMinutes] = useState<number | "">("")
  const [ceiling, setCeiling] = useState<string>("")
  const [traditions, setTraditions] = useState<string[]>([])
  const [requiredBookIds, setRequiredBookIds] = useState<string[]>([])
  const [bookQuery, setBookQuery] = useState("")
  const [focus, setFocus] = useState("")
  const [ambition, setAmbition] = useState<"standard" | "ambitious">("standard")

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("books")
      .select("id, title, author, tradition")
      .order("title")
      .then(({ data }) => setBooks((data as BookOpt[]) ?? []))
  }, [])

  const allTraditions = useMemo(
    () => [...new Set(books.map((b) => b.tradition).filter(Boolean))].sort(),
    [books],
  )
  const filteredBooks = useMemo(() => {
    const q = bookQuery.trim().toLowerCase()
    if (!q) return []
    return books
      .filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
      .slice(0, 8)
  }, [books, bookQuery])
  const requiredBooks = books.filter((b) => requiredBookIds.includes(b.id))

  function addTheme() {
    const t = themeInput.trim()
    if (t && !themes.includes(t)) setThemes((p) => [...p, t])
    setThemeInput("")
  }

  async function submit() {
    if (!title.trim() || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/classroom/semester-plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId,
          title: title.trim(),
          weeks,
          termStart: termStart || undefined,
          level: level || undefined,
          cadence: { meetingsPerWeek },
          goals: { themes, objectives: [] },
          constraints: {
            maxMinutesPerWeek: maxMinutes === "" ? undefined : Number(maxMinutes),
            difficultyCeiling: ceiling || undefined,
            requiredBookIds,
            breakWeeks: [],
          },
          traditions,
          focus: focus || undefined,
          ambition,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? data.error ?? "Generation failed")
        setSubmitting(false)
        return
      }
      router.push(`/classroom/${classId}/semester-plan/${data.planId}`)
    } catch {
      setError("Network error — try again.")
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href={`/classroom/${classId}/semester-plan`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Semester plans
      </Link>

      {/* Iridescent Virgil header */}
      <div className="mt-3 overflow-hidden rounded-2xl border" style={{ borderColor: "rgba(99,102,241,0.35)" }}>
        <div className="flex items-center gap-2 px-4 py-3 text-white" style={{ backgroundImage: IRIDESCENT }}>
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-semibold tracking-wide">Plan a semester with Virgil</span>
          <span className="ml-1 text-xs font-normal opacity-80">— set the frame, Virgil drafts the term</span>
        </div>

        <div className="space-y-5 bg-card p-5">
          <div className="space-y-1.5">
            <label className={LABEL}>Plan title</label>
            <input
              className={FIELD}
              placeholder="e.g. Epic to Novel — Fall Term"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={LABEL}>Weeks</label>
              <input
                type="number"
                min={1}
                max={40}
                className={FIELD}
                value={weeks}
                onChange={(e) => setWeeks(Math.max(1, Math.min(40, Number(e.target.value) || 1)))}
              />
            </div>
            <div className="space-y-1.5">
              <label className={LABEL}>Term start</label>
              <input type="date" className={FIELD} value={termStart} onChange={(e) => setTermStart(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className={LABEL}>Level</label>
              <input
                className={FIELD}
                placeholder="e.g. 10th grade"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className={LABEL}>Meetings / week</label>
              <input
                type="number"
                min={1}
                max={7}
                className={FIELD}
                value={meetingsPerWeek}
                onChange={(e) => setMeetingsPerWeek(Math.max(1, Math.min(7, Number(e.target.value) || 1)))}
              />
            </div>
            <div className="space-y-1.5">
              <label className={LABEL}>Max minutes / week</label>
              <input
                type="number"
                min={15}
                className={FIELD}
                placeholder="optional cap"
                value={maxMinutes}
                onChange={(e) => setMaxMinutes(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className={LABEL}>Difficulty ceiling</label>
              <select className={FIELD} value={ceiling} onChange={(e) => setCeiling(e.target.value)}>
                <option value="">No ceiling</option>
                {TEACHER_QUIZ_DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Themes */}
          <div className="space-y-1.5">
            <label className={LABEL}>Themes / objectives</label>
            <div className="flex flex-wrap gap-1.5">
              {themes.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ backgroundColor: "rgba(200,151,47,0.12)", color: RUBRIC.goldLeaf }}
                >
                  {t}
                  <button onClick={() => setThemes((p) => p.filter((x) => x !== t))}>
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              className={FIELD}
              placeholder="Type a theme and press Enter (e.g. the hero's journey)"
              value={themeInput}
              onChange={(e) => setThemeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addTheme()
                }
              }}
            />
          </div>

          {/* Traditions */}
          {allTraditions.length > 0 && (
            <div className="space-y-1.5">
              <label className={LABEL}>Limit to traditions (optional)</label>
              <div className="flex flex-wrap gap-1.5">
                {allTraditions.map((t) => {
                  const on = traditions.includes(t)
                  return (
                    <button
                      key={t}
                      onClick={() => setTraditions((p) => (on ? p.filter((x) => x !== t) : [...p, t]))}
                      className="rounded-full border px-2.5 py-1 text-xs font-medium transition-colors"
                      style={{
                        borderColor: on ? RUBRIC.lapis : "rgba(128,128,128,0.2)",
                        backgroundColor: on ? "rgba(44,74,126,0.10)" : "transparent",
                        color: on ? RUBRIC.lapis : undefined,
                      }}
                    >
                      {t}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Required books */}
          <div className="space-y-1.5">
            <label className={LABEL}>Required books (must appear)</label>
            <div className="flex flex-wrap gap-1.5">
              {requiredBooks.map((b) => (
                <span
                  key={b.id}
                  className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ backgroundColor: "rgba(44,74,126,0.10)", color: RUBRIC.lapis }}
                >
                  {b.title}
                  <button onClick={() => setRequiredBookIds((p) => p.filter((x) => x !== b.id))}>
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                className={`${FIELD} pl-9`}
                placeholder="Search a book to require it…"
                value={bookQuery}
                onChange={(e) => setBookQuery(e.target.value)}
              />
              {filteredBooks.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-border bg-card shadow-xl">
                  {filteredBooks.map((b) => {
                    const on = requiredBookIds.includes(b.id)
                    return (
                      <button
                        key={b.id}
                        onClick={() => {
                          setRequiredBookIds((p) => (on ? p.filter((x) => x !== b.id) : [...p, b.id]))
                          setBookQuery("")
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-muted/50"
                      >
                        <span className="truncate font-medium">{b.title}</span>
                        <span className="shrink-0 opacity-40">by {b.author}</span>
                        {on && <Check className="ml-auto size-3 text-green-500" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Focus + ambition */}
          <div className="space-y-1.5">
            <label className={LABEL}>Steer the survey (optional)</label>
            <textarea
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-card px-3 py-2 text-sm focus:border-[var(--tome-accent)] focus:outline-none"
              placeholder="e.g. start with epic poetry, build to the 19th-century novel"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className={LABEL}>Depth</span>
            {(["standard", "ambitious"] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAmbition(a)}
                className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                style={{
                  borderColor: ambition === a ? RUBRIC.tyrian : "rgba(128,128,128,0.2)",
                  backgroundColor: ambition === a ? "rgba(107,44,78,0.10)" : "transparent",
                  color: ambition === a ? RUBRIC.tyrian : undefined,
                }}
              >
                {a === "standard" ? "Standard term" : "Ambitious survey"}
              </button>
            ))}
          </div>

          {error && (
            <p className="rounded-xl px-3 py-2 text-sm" style={{ backgroundColor: "rgba(215,71,47,0.10)", color: RUBRIC.vermilion }}>
              {error}
            </p>
          )}

          <Button
            onClick={submit}
            disabled={submitting || !title.trim()}
            className="w-full gap-2 text-white"
            style={{ backgroundImage: IRIDESCENT }}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {submitting ? "Virgil is composing your term…" : "Draft the semester"}
          </Button>
        </div>
      </div>
    </div>
  )
}
