import { Check, Minus } from "lucide-react"
import { readerComparison, readerComparisonTiers } from "@/lib/pricing"

function Cell({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <>
        <Check className="mx-auto size-4 text-primary" aria-hidden />
        <span className="sr-only">Included</span>
      </>
    )
  }
  if (value === false) {
    return (
      <>
        <Minus className="mx-auto size-4 text-muted-foreground/50" aria-hidden />
        <span className="sr-only">Not included</span>
      </>
    )
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>
}

export function ReaderComparison() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-left">
        <caption className="sr-only">Reader plan feature comparison</caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="py-3 pr-4 text-sm font-semibold text-foreground">
              Features
            </th>
            {readerComparisonTiers.map((tier) => (
              <th
                key={tier.id}
                scope="col"
                className="px-4 py-3 text-center text-sm font-semibold text-foreground"
              >
                {tier.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {readerComparison.map((row) => (
            <tr key={row.label} className="border-b border-border/60">
              <th
                scope="row"
                className="py-3 pr-4 text-left text-sm font-normal text-muted-foreground"
              >
                {row.label}
              </th>
              {readerComparisonTiers.map((tier) => (
                <td key={tier.id} className="px-4 py-3 text-center">
                  <Cell value={row.tiers[tier.id] ?? false} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
