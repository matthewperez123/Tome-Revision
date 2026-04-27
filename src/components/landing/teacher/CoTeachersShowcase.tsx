"use client"

import { Building2 } from "lucide-react"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

const CO_TEACHERS = [
  { initials: "MR", name: "Ms. Reyes", color: "bg-rose-500" },
  { initials: "MO", name: "Mr. Okafor", color: "bg-emerald-500" },
]

const DEPT_AVATARS = [
  { initials: "MR", color: "bg-rose-500" },
  { initials: "MO", color: "bg-emerald-500" },
  { initials: "JC", color: "bg-indigo-500" },
  { initials: "AS", color: "bg-amber-500" },
]

export function CoTeachersShowcase() {
  return (
    <TeacherShowcaseShell
      heading="Share with your department."
      subcopy="Add co-teachers to a class, share assignments and rubrics across your department, build a shared school library of teacher-curated reading lists."
      layout="mockup-right"
      bgClass="bg-muted"
      paddingClass="py-20"
    >
      <div className="bg-card rounded-xl border border-border p-5 min-h-[260px]">
        {/* Class card */}
        <div className="rounded-lg border border-border bg-background p-4 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                AP Literature &middot; Period 3
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Co-taught
              </p>
            </div>
            <div className="flex -space-x-2">
              {CO_TEACHERS.map((t) => (
                <div
                  key={t.initials}
                  className={`size-7 rounded-full ${t.color} text-white flex items-center justify-center text-[10px] font-bold border-2 border-card`}
                  title={t.name}
                >
                  {t.initials}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>{CO_TEACHERS.map((t) => t.name).join(" \u00b7 ")}</span>
          </div>
        </div>

        {/* Department-shared indicator */}
        <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="size-3.5 text-indigo-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Shared with department
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {DEPT_AVATARS.map((a) => (
                <div
                  key={a.initials}
                  className={`size-8 rounded-full ${a.color} text-white flex items-center justify-center text-[10px] font-bold border-2 border-card`}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <div className="leading-tight">
              <p className="text-xs font-semibold text-foreground">
                English Department
              </p>
              <p className="text-[10px] text-muted-foreground">6 teachers</p>
            </div>
          </div>
        </div>
      </div>
    </TeacherShowcaseShell>
  )
}
