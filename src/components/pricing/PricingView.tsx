"use client"

import { useCallback, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  EDUCATOR_FINE_PRINT_DEV,
  EDUCATOR_FINE_PRINT_FINAL,
  READER_TRIAL_COPY,
  SCHOOL_PRICING_IS_FINAL,
  educatorPlansForPeriod,
  readerPlansForPeriod,
  type BillingPeriod,
} from "@/lib/marketing/plans"
import { useCatalogStats } from "@/lib/marketing/catalog-stats-context"
import { AudienceToggle, type PricingAudience } from "./AudienceToggle"
import { BillingToggle } from "./BillingToggle"
import { PricingGrid } from "./PricingGrid"
import { ReaderComparison } from "./ReaderComparison"

function coerceAudience(value: string | null): PricingAudience {
  return value === "educators" ? "educators" : "readers"
}

export function PricingView() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const stats = useCatalogStats()
  const audience = coerceAudience(searchParams.get("for"))
  const [billing, setBilling] = useState<BillingPeriod>("monthly")

  const setAudience = useCallback(
    (next: PricingAudience) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("for", next)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="space-y-12">
      <div className="flex justify-center">
        <AudienceToggle value={audience} onChange={setAudience} />
      </div>

      {audience === "readers" ? (
        <div className="space-y-12">
          <div className="flex justify-center">
            <BillingToggle
              value={billing}
              onChange={setBilling}
              annualNote="2 months free"
            />
          </div>

          <PricingGrid
            plans={readerPlansForPeriod(billing, stats)}
            period={billing}
          />

          <p className="text-center text-xs text-muted-foreground">
            {READER_TRIAL_COPY}
          </p>

          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-center font-[var(--font-display)] text-2xl font-bold text-foreground">
              Compare reader plans
            </h2>
            <ReaderComparison />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <PricingGrid plans={educatorPlansForPeriod(billing)} period={billing} />
          <p className="text-center text-xs text-muted-foreground">
            {SCHOOL_PRICING_IS_FINAL
              ? EDUCATOR_FINE_PRINT_FINAL
              : EDUCATOR_FINE_PRINT_DEV}
          </p>
        </div>
      )}
    </div>
  )
}
