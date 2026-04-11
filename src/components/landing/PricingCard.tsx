import { Check } from "lucide-react"
import Link from "next/link"

interface PricingCardProps {
  tier: string
  price: string
  cadence: string
  description: string
  features: string[]
  ctaLabel: string
  ctaHref: string
  featured?: boolean
}

const baseBtn =
  "inline-flex items-center justify-center w-full px-6 py-3 rounded-full border font-semibold text-sm transition-all duration-200"

export function PricingCard({
  tier,
  price,
  cadence,
  description,
  features,
  ctaLabel,
  ctaHref,
  featured = false,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-xl p-6 ${
        featured
          ? "border-2 border-indigo-500 bg-card shadow-lg -translate-y-1"
          : "border border-border bg-card"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-white text-xs font-semibold px-3 py-0.5 rounded-full whitespace-nowrap">
          Most popular
        </span>
      )}

      <div className="mb-4">
        <h3 className="font-[var(--font-display)] text-lg font-bold text-foreground">
          {tier}
        </h3>
      </div>

      <div className="mb-4">
        <span className="font-[var(--font-display)] text-4xl font-bold text-foreground">
          {price}
        </span>
        <span className="ml-1.5 text-sm text-muted-foreground">{cadence}</span>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        {description}
      </p>

      <ul className="flex-1 space-y-2.5 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
            <Check className="size-4 text-indigo-500 mt-0.5 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={`${baseBtn} ${
          featured
            ? "bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]"
            : "border-border bg-card text-foreground hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:border-indigo-400/40"
        }`}
      >
        {ctaLabel}
      </Link>
    </div>
  )
}
