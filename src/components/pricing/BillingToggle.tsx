"use client"

import type { BillingPeriod } from "@/lib/pricing"

interface BillingToggleProps {
  value: BillingPeriod
  onChange: (value: BillingPeriod) => void
  /** Optional hint shown next to the Annual option, e.g. "2 months free". */
  annualNote?: string
}

const OPTIONS: { value: BillingPeriod; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "annual", label: "Annual" },
]

export function BillingToggle({ value, onChange, annualNote }: BillingToggleProps) {
  return (
    <div className="inline-flex items-center gap-3">
      <div
        role="group"
        aria-label="Choose billing period"
        className="inline-flex items-center rounded-full border border-border bg-muted p-1"
      >
        {OPTIONS.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
      {annualNote && value === "annual" && (
        <span className="text-xs font-semibold text-primary">{annualNote}</span>
      )}
    </div>
  )
}
