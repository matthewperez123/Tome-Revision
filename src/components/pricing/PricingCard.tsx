import { Check } from "lucide-react"
import Link from "next/link"

export interface PricingCardProps {
  name: string
  price: string
  cadence: string
  description: string
  features: string[]
  ctaLabel: string
  ctaHref: string
  featured?: boolean
  badge?: string
}

const baseBtn =
  "inline-flex items-center justify-center w-full px-6 py-3 rounded-full border font-semibold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function PricingCard({
  name,
  price,
  cadence,
  description,
  features,
  ctaLabel,
  ctaHref,
  featured = false,
  badge,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-xl p-6 ${
        featured
          ? "border-2 border-primary bg-card shadow-lg md:-translate-y-1"
          : "border border-border bg-card"
      }`}
    >
      {featured && badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
          {badge}
        </span>
      )}

      <div className="mb-4">
        <h3 className="font-[var(--font-display)] text-lg font-bold text-foreground">
          {name}
        </h3>
      </div>

      <div className="mb-4">
        <span className="font-[var(--font-display)] text-4xl font-bold text-foreground">
          {price}
        </span>
        {cadence && (
          <span className="ml-1.5 text-sm text-muted-foreground">{cadence}</span>
        )}
      </div>

      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      <ul className="mb-8 flex-1 space-y-2.5">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm text-foreground"
          >
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={`${baseBtn} ${
          featured
            ? "border-primary bg-primary text-primary-foreground hover:opacity-90"
            : "border-border bg-card text-foreground hover:border-primary/40"
        }`}
      >
        {ctaLabel}
      </Link>
    </div>
  )
}
