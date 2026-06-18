"use client"

/**
 * Parent Directory (R6, genuinely new) — a searchable, demo-only roster of
 * parents linked to their students, with last-activity and a simulated
 * "Send progress update" action. Everything is ephemeral local state: typing
 * filters the in-memory list, and "sent" badges live only for this session.
 * No backend write, no real email.
 */

import { useMemo, useState } from "react"
import { Search, Mail, Check } from "lucide-react"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

interface ParentRow {
  id: string
  parent: string
  email: string
  student: string
  relation: string
  lastActivity: string
}

const PARENTS: ParentRow[] = [
  { id: "chen", parent: "David Chen", email: "david.chen@email.com", student: "Emma Chen", relation: "Father", lastActivity: "2 hours ago" },
  { id: "obrien", parent: "Patrick O'Brien", email: "p.obrien@email.com", student: "James O'Brien", relation: "Father", lastActivity: "Yesterday" },
  { id: "rodriguez", parent: "Carmen Rodriguez", email: "c.rodriguez@email.com", student: "Sofia Rodriguez", relation: "Mother", lastActivity: "3 days ago" },
  { id: "okafor", parent: "Ada Okafor", email: "a.okafor@email.com", student: "Chidi Okafor", relation: "Mother", lastActivity: "5 days ago" },
  { id: "tanaka", parent: "Hiro Tanaka", email: "h.tanaka@email.com", student: "Yuki Tanaka", relation: "Father", lastActivity: "1 week ago" },
]

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
}

export function ParentDirectoryShowcase() {
  const [query, setQuery] = useState("")
  const [sent, setSent] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return PARENTS
    return PARENTS.filter(
      (p) =>
        p.parent.toLowerCase().includes(q) ||
        p.student.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <TeacherShowcaseShell
      heading="A parent directory, always in reach."
      subcopy="Every parent linked to their student, with their latest activity at a glance. Search by family and send a progress update without leaving the page."
      layout="mockup-right"
      bgClass="bg-background"
    >
      <div className="rounded-xl border border-border bg-card p-4">
        {/* Search */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parents or students…"
            aria-label="Search parents or students"
            className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* List */}
        <ul className="mt-3 divide-y divide-border">
          {filtered.map((p) => {
            const isSent = sent.has(p.id)
            return (
              <li key={p.id} className="flex items-center gap-3 py-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground">
                  {initials(p.parent)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {p.parent}{" "}
                    <span className="font-normal text-muted-foreground">
                      · {p.relation}
                    </span>
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.student} · last active {p.lastActivity}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSent((s) => new Set(s).add(p.id))
                  }
                  disabled={isSent}
                  className={
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                    (isSent
                      ? "border-[var(--codex-success)] bg-[var(--codex-success-soft)] text-[var(--codex-success-text)]"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary")
                  }
                  aria-label={`Send progress update to ${p.parent}`}
                >
                  {isSent ? (
                    <>
                      <Check className="size-3" /> Sent
                    </>
                  ) : (
                    <>
                      <Mail className="size-3" /> Update
                    </>
                  )}
                </button>
              </li>
            )
          })}
          {filtered.length === 0 && (
            <li className="py-6 text-center text-sm text-muted-foreground">
              No families match &ldquo;{query}&rdquo;.
            </li>
          )}
        </ul>
      </div>
    </TeacherShowcaseShell>
  )
}
