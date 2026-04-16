"use client"

import { useState, useMemo, useCallback } from "react"
import { Search, Check, Users } from "lucide-react"
import { DEMO_STUDENT_DETAILS } from "@/lib/classroom-students"
import type { WizardState } from "./create-session-wizard"

interface Props {
  state: WizardState
  onChange: (partial: Partial<WizardState>) => void
}

export function StepRoster({ state, onChange }: Props) {
  const [searchQuery, setSearchQuery] = useState("")

  const students = useMemo(() => {
    if (!searchQuery.trim()) return DEMO_STUDENT_DETAILS
    const q = searchQuery.toLowerCase()
    return DEMO_STUDENT_DETAILS.filter((s) => s.name.toLowerCase().includes(q))
  }, [searchQuery])

  const handleToggle = useCallback(
    (id: string) => {
      const next = new Set(state.selectedStudentIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      onChange({ selectedStudentIds: next })
    },
    [state.selectedStudentIds, onChange],
  )

  const handleSelectAll = useCallback(() => {
    onChange({ selectedStudentIds: new Set(DEMO_STUDENT_DETAILS.map((s) => s.id)) })
  }, [onChange])

  const handleDeselectAll = useCallback(() => {
    onChange({ selectedStudentIds: new Set() })
  }, [onChange])

  const allSelected = state.selectedStudentIds.size === DEMO_STUDENT_DETAILS.length

  return (
    <div className="space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Users className="h-4 w-4 opacity-60" />
          Select Students
        </h2>
        <p className="text-xs opacity-50">
          Choose which students participate in this session.
        </p>
      </div>

      {/* Search + bulk */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-full rounded-full border border-transparent bg-[var(--tome-surface-elevated)] pl-9 pr-3 text-xs focus:border-[var(--tome-accent)] focus:outline-none"
          />
        </div>
        <button
          onClick={allSelected ? handleDeselectAll : handleSelectAll}
          className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/50"
          style={{ color: "var(--tome-indigo, #6366F1)" }}
        >
          {allSelected ? "Deselect All" : "Select All"}
        </button>
      </div>

      <p className="text-xs opacity-50">
        {state.selectedStudentIds.size} of {DEMO_STUDENT_DETAILS.length} students selected
      </p>

      {/* Student list */}
      <div
        className="max-h-72 overflow-y-auto rounded-xl border"
        style={{ borderColor: "rgba(128, 128, 128, 0.12)" }}
      >
        {students.map((s) => {
          const isSelected = state.selectedStudentIds.has(s.id)
          return (
            <button
              key={s.id}
              onClick={() => handleToggle(s.id)}
              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors border-b last:border-0 ${
                isSelected ? "bg-[rgba(99,102,241,0.04)]" : "hover:bg-muted/30"
              }`}
              style={{ borderColor: "rgba(128, 128, 128, 0.06)" }}
            >
              <div
                className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors"
                style={{
                  borderColor: isSelected ? "var(--tome-indigo, #6366F1)" : "rgba(128,128,128,0.3)",
                  backgroundColor: isSelected ? "var(--tome-indigo, #6366F1)" : "transparent",
                }}
              >
                {isSelected && <Check className="size-3 text-white" />}
              </div>
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: s.avatarColor }}
              >
                {s.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {s.gradeLevel} &middot; {s.rank}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
