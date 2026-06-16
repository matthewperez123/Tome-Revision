"use client"

/**
 * find_the_evidence — tap the line in a passage that supports a claim.
 *
 * Renders the indexed `segments` as tappable lines (the same data-line pattern
 * the reader uses). A tap selects that segment as the evidence range [i, i];
 * the card grades via overlap with the authored `correctRange`. After grading,
 * the correct span is tinted green and a wrong pick red.
 */
import type { TrialBodyProps } from "@/lib/trials/registry"

export function FindTheEvidenceBody({
  content,
  onRespond,
  answered,
  response,
  reduced,
}: TrialBodyProps<"find_the_evidence">) {
  const selected = response?.range ?? null
  const [cs, ce] = content.correctRange

  const inSelected = (i: number) =>
    selected ? i >= selected[0] && i <= selected[1] : false
  const inCorrect = (i: number) => i >= cs && i <= ce

  return (
    <div className="space-y-5">
      <div
        className="rounded-[var(--codex-radius-card)] border-2 p-4"
        style={{
          borderColor: "var(--codex-primary)",
          background: "var(--codex-primary-soft)",
        }}
      >
        <p className="text-[11px] uppercase tracking-wider font-semibold font-sans text-muted-foreground mb-1">
          Claim
        </p>
        <p
          className="font-serif text-base leading-relaxed"
          style={{ color: "var(--codex-primary-text)" }}
        >
          {content.claim}
        </p>
      </div>

      <div className="space-y-1.5">
        {content.segments.map((seg, i) => {
          const sel = inSelected(i)
          const style = answered
            ? inCorrect(i)
              ? {
                  borderColor: "var(--codex-success)",
                  background: "var(--codex-success-soft)",
                }
              : sel
                ? {
                    borderColor: "var(--codex-danger)",
                    background: "var(--codex-danger-soft)",
                  }
                : {
                    borderColor: "var(--border)",
                    background: "var(--card)",
                  }
            : sel
              ? {
                  borderColor: "var(--codex-primary)",
                  background: "var(--codex-primary-soft)",
                }
              : {
                  borderColor: "var(--border)",
                  background: "var(--card)",
                }
          return (
            <button
              key={i}
              type="button"
              data-line={i}
              disabled={answered}
              onClick={() => onRespond({ range: [i, i] })}
              style={{ ...style, borderRadius: "var(--codex-radius-btn)" }}
              className={`w-full text-left border-2 px-4 py-3 min-h-[44px] font-serif leading-snug transition-[background-color,border-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--codex-primary)] ${
                answered
                  ? "cursor-default"
                  : "cursor-pointer hover:border-[var(--codex-primary)]"
              } ${reduced ? "" : "active:scale-[0.99]"}`}
            >
              {seg}
            </button>
          )
        })}
      </div>
    </div>
  )
}
