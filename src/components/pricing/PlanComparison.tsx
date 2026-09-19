import { Check, Minus } from "lucide-react"
import {
  SEAT_PRICE_USD_PER_YEAR,
  SCHOOL_ANNUAL_MINIMUM_USD,
  FREE_TEACHER_CLASSROOM_LIMIT,
  FREE_TEACHER_STUDENT_LIMIT,
  QUESTIONS_FREE_TEACHER_PER_MONTH,
  QUESTIONS_PER_SEAT_PER_MONTH,
} from "@/lib/billing/config"

const TIER_NAMES = ["Teacher", "Classroom", "School"] as const

interface ComparisonRow {
  label: string
  /** One value per tier; `true` → check, `false` → dash, string → literal. */
  values: [string | boolean, string | boolean, string | boolean]
}

/** Rows derive from `@/lib/billing/config` so /pricing shows one set of numbers. */
const ROWS: ComparisonRow[] = [
  {
    label: "Price",
    values: [
      "Free forever",
      `$${SEAT_PRICE_USD_PER_YEAR} per student / year`,
      `From $${SCHOOL_ANNUAL_MINIMUM_USD.toLocaleString("en-US")} / year`,
    ],
  },
  { label: "Full 1,280-book library and reader", values: [true, true, true] },
  {
    label: "Pre-built quizzes at three difficulties",
    values: [true, true, true],
  },
  { label: "Assignments and live gradebook", values: [true, true, true] },
  { label: "Quiz builder", values: [true, true, true] },
  {
    label: "Classrooms",
    values: [`${FREE_TEACHER_CLASSROOM_LIMIT}`, "Unlimited", "Unlimited"],
  },
  {
    label: "Students",
    values: [`${FREE_TEACHER_STUDENT_LIMIT}`, "Per seat", "Per seat"],
  },
  {
    label: "Questions Available / month",
    values: [
      `${QUESTIONS_FREE_TEACHER_PER_MONTH}`,
      `${QUESTIONS_PER_SEAT_PER_MONTH.classroom} per student, pooled by class`,
      `${QUESTIONS_PER_SEAT_PER_MONTH.school} per student`,
    ],
  },
  {
    label: "Live quizzes and guided sessions",
    values: [false, true, true],
  },
  { label: "Term planner", values: [false, true, true] },
  { label: "Seat management across teachers", values: [false, false, true] },
  { label: "Invoice or purchase order", values: [false, false, true] },
  { label: "NDPA on request", values: [false, false, true] },
  {
    label: "Support",
    values: ["Community", "Email", "Priority + onboarding webinar"],
  },
]

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return <Check className="mx-auto size-4 text-primary" aria-label="Included" />
  }
  if (value === false) {
    return (
      <Minus
        className="mx-auto size-4 text-muted-foreground/50"
        aria-label="Not included"
      />
    )
  }
  return <span className="text-sm text-foreground">{value}</span>
}

/**
 * Plan comparison for /pricing: a three-column table from 768px up, stacked
 * per-tier cards below. All numbers come from `@/lib/billing/config`.
 */
export function PlanComparison() {
  return (
    <section className="mx-auto mt-24 max-w-5xl" aria-label="Compare plans">
      <h2 className="mb-8 text-center font-[var(--font-display)] text-2xl font-bold text-foreground">
        Compare plans
      </h2>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-border md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-card">
              <th scope="col" className="px-5 py-3.5 text-sm font-semibold text-foreground">
                What you get
              </th>
              {TIER_NAMES.map((name) => (
                <th
                  key={name}
                  scope="col"
                  className="px-5 py-3.5 text-center text-sm font-semibold text-foreground"
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ROWS.map((row) => (
              <tr key={row.label}>
                <th
                  scope="row"
                  className="px-5 py-3 text-sm font-medium text-foreground"
                >
                  {row.label}
                </th>
                {row.values.map((value, i) => (
                  <td key={TIER_NAMES[i]} className="px-5 py-3 text-center">
                    <Cell value={value} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked cards under 768px */}
      <div className="space-y-6 md:hidden">
        {TIER_NAMES.map((name, tierIndex) => (
          <div
            key={name}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <h3 className="border-b border-border px-5 py-3.5 font-[var(--font-display)] text-base font-bold text-foreground">
              {name}
            </h3>
            <dl className="divide-y divide-border">
              {ROWS.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-4 px-5 py-2.5"
                >
                  <dt className="text-sm text-muted-foreground">{row.label}</dt>
                  <dd className="text-right">
                    <Cell value={row.values[tierIndex]} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  )
}
