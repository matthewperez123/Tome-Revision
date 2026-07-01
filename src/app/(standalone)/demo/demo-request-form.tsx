"use client"

import { useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"

const LAPIS = "#2A4B8D"
const GOLD = "#C8A24B"
const VERDIGRIS = "#2E7D6F"
const VERMILION = "#C8553D"

const PLAN_OPTIONS = [
  { value: "school", label: "School" },
  { value: "district", label: "District" },
  { value: "classroom", label: "Single classroom" },
  { value: "other", label: "Not sure yet" },
] as const

interface DemoRequestFormProps {
  /** Prefilled from ?plan= on the page. */
  initialPlan?: string
}

interface FormState {
  name: string
  email: string
  organization: string
  role: string
  planInterest: string
  studentCount: string
  teacherCount: string
  message: string
  // Honeypot — kept empty by real users.
  company_website: string
}

function emptyState(initialPlan?: string): FormState {
  const known = PLAN_OPTIONS.some((p) => p.value === initialPlan)
  return {
    name: "",
    email: "",
    organization: "",
    role: "",
    planInterest: known ? (initialPlan as string) : "",
    studentCount: "",
    teacherCount: "",
    message: "",
    company_website: "",
  }
}

const inputClass =
  "w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background"

const labelClass = "mb-1.5 block text-sm font-medium text-foreground"

export function DemoRequestForm({ initialPlan }: DemoRequestFormProps) {
  const [form, setForm] = useState<FormState>(() => emptyState(initialPlan))
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.name.trim() || !form.email.trim()) {
      setError("Please enter your name and email.")
      return
    }

    setStatus("submitting")
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          organization: form.organization,
          role: form.role,
          planInterest: form.planInterest,
          studentCount: form.studentCount ? Number(form.studentCount) : null,
          teacherCount: form.teacherCount ? Number(form.teacherCount) : null,
          message: form.message,
          company_website: form.company_website,
        }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null
        setError(data?.error ?? "Something went wrong. Please try again.")
        setStatus("idle")
        return
      }
      setStatus("success")
    } catch {
      setError("Network error. Please try again.")
      setStatus("idle")
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-2xl border bg-card p-8 text-center sm:p-12"
        style={{ borderColor: `${VERDIGRIS}33` }}
      >
        <div
          className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full"
          style={{ backgroundColor: `${VERDIGRIS}1A` }}
        >
          <CheckCircle2 className="size-7" style={{ color: VERDIGRIS }} />
        </div>
        <h2
          className="font-[var(--font-display)] text-2xl font-bold"
          style={{ color: LAPIS }}
        >
          Request received
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Thank you. A member of the Tome team will reach out shortly. We&apos;ve
          also sent a confirmation to <strong>{form.email}</strong>.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      {/* Honeypot: visually hidden, off-screen, ignored by real users. */}
      <div aria-hidden className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company_website}
          onChange={(e) => update("company_website", e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="name" className={labelClass}>
            Name <span style={{ color: VERMILION }}>*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
            style={{ ["--tw-ring-color" as string]: LAPIS }}
            placeholder="Jane Doe"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="email" className={labelClass}>
            Work email <span style={{ color: VERMILION }}>*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
            style={{ ["--tw-ring-color" as string]: LAPIS }}
            placeholder="jane@school.edu"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="organization" className={labelClass}>
            School or organization
          </label>
          <input
            id="organization"
            type="text"
            autoComplete="organization"
            className={inputClass}
            style={{ ["--tw-ring-color" as string]: LAPIS }}
            placeholder="Lincoln High School"
            value={form.organization}
            onChange={(e) => update("organization", e.target.value)}
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="role" className={labelClass}>
            Your role
          </label>
          <input
            id="role"
            type="text"
            autoComplete="organization-title"
            className={inputClass}
            style={{ ["--tw-ring-color" as string]: LAPIS }}
            placeholder="English teacher, Curriculum lead…"
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="studentCount" className={labelClass}>
            Number of students
          </label>
          <input
            id="studentCount"
            type="number"
            min={0}
            inputMode="numeric"
            className={inputClass}
            style={{ ["--tw-ring-color" as string]: LAPIS }}
            placeholder="e.g. 120"
            value={form.studentCount}
            onChange={(e) => update("studentCount", e.target.value)}
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="teacherCount" className={labelClass}>
            Number of teachers
          </label>
          <input
            id="teacherCount"
            type="number"
            min={0}
            inputMode="numeric"
            className={inputClass}
            style={{ ["--tw-ring-color" as string]: LAPIS }}
            placeholder="e.g. 8"
            value={form.teacherCount}
            onChange={(e) => update("teacherCount", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="planInterest" className={labelClass}>
            Plan interest
          </label>
          <select
            id="planInterest"
            className={inputClass}
            style={{ ["--tw-ring-color" as string]: LAPIS }}
            value={form.planInterest}
            onChange={(e) => update("planInterest", e.target.value)}
          >
            <option value="">Select a plan…</option>
            {PLAN_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            Anything else?
          </label>
          <textarea
            id="message"
            rows={4}
            className={`${inputClass} resize-y`}
            style={{ ["--tw-ring-color" as string]: LAPIS }}
            placeholder="Tell us about your goals, timeline, or questions."
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
          />
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-sm" style={{ color: VERMILION }} role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        style={{ backgroundColor: LAPIS, ["--tw-ring-color" as string]: GOLD }}
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Request a demo"
        )}
      </button>
    </form>
  )
}
