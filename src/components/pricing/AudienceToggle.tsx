"use client"

export type PricingAudience = "readers" | "educators"

interface AudienceToggleProps {
  value: PricingAudience
  onChange: (value: PricingAudience) => void
}

const OPTIONS: { value: PricingAudience; label: string }[] = [
  { value: "readers", label: "For Readers" },
  { value: "educators", label: "For Educators" },
]

export function AudienceToggle({ value, onChange }: AudienceToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Choose audience"
      className="inline-flex items-center rounded-full border border-border bg-muted p-1"
    >
      {OPTIONS.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
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
  )
}
