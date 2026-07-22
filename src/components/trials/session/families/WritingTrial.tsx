"use client"

/**
 * WritingTrial — reflection and short-answer, the open-response families.
 *
 * Reflection: a calm writing surface with optional sentence frames, a live
 * word count against the item's minimum, and a self-assessment rubric the
 * learner checks off before submitting. Reflections are never "incorrect" —
 * an earnest attempt completes (anti-punishment rule).
 *
 * Short answer: same surface, graded by keyword coverage; the reference
 * answer is revealed with the rationale after submission.
 */
import { useState } from "react"
import type { FamilyRendererProps } from "../shared"
import { Kbd, TrialActionButton, la } from "../shared"

export function WritingTrial({
  item,
  answered,
  lastResponse,
  onSubmit,
}: FamilyRendererProps<"reflection" | "short-answer">) {
  const isReflection = item.family === "reflection"
  // Narrow the content union once, up front.
  const minWords = item.family === "reflection" ? item.content.minWords : 1
  const guidance = item.family === "reflection" ? item.content.guidance : []
  const rubric = item.family === "reflection" ? item.content.rubric : []
  const referenceAnswer = item.family === "short-answer" ? item.content.referenceAnswer : null
  const [text, setText] = useState(() => lastResponse?.text ?? "")
  const [rubricChecked, setRubricChecked] = useState<string[]>(() =>
    isReflection && lastResponse && "rubricChecked" in lastResponse ? lastResponse.rubricChecked : []
  )

  const words = text.trim().split(/\s+/).filter(Boolean).length
  const ready = words >= minWords

  const toggleRubric = (id: string) =>
    setRubricChecked((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]))

  return (
    <div className="space-y-5">
      {isReflection && guidance.length > 0 && (
        <div
          className="border-l-4 py-2 pl-4"
          style={{ borderColor: la.wisdom, background: la.wisdomSoft, borderRadius: `0 ${la.radiusM} ${la.radiusM} 0` }}
        >
          <p className="mb-1 font-sans text-xs uppercase tracking-wider" style={{ color: la.wisdomDeep }}>
            Ways in
          </p>
          <ul className="list-inside list-disc space-y-1 font-serif text-base" style={{ color: la.ink }}>
            {guidance.map((g: string, i: number) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor={`writing-${item.id}`} className="mb-2 block font-sans text-sm" style={{ color: la.inkMuted }}>
          {isReflection ? "Write your reflection" : "Write your answer"}{" "}
          {isReflection && (
            <span style={{ color: la.inkFaint }}>
              — at least {minWords} words (<Kbd>Tab</Kbd> to move on)
            </span>
          )}
        </label>
        <textarea
          id={`writing-${item.id}`}
          value={text}
          disabled={answered}
          onChange={(e) => setText(e.target.value)}
          rows={isReflection ? 7 : 4}
          className="w-full border-2 p-4 font-serif text-lg leading-relaxed focus-visible:outline-2 disabled:opacity-80"
          style={{
            borderRadius: la.radiusM,
            borderColor: answered ? la.success : la.surfaceSunken,
            background: la.surfaceRaised,
            color: la.ink,
            outlineColor: la.focus,
          }}
          placeholder={isReflection ? "Let the passage speak back…" : "Answer in a sentence or two…"}
        />
        <p className="mt-1 text-right font-sans text-xs" aria-live="polite" style={{ color: ready ? la.success : la.inkFaint }}>
          {words} {isReflection ? `/ ${minWords} ` : ""}word{words === 1 ? "" : "s"}
        </p>
      </div>

      {isReflection && rubric.length > 0 && (
        <fieldset>
          <legend className="mb-2 font-sans text-sm" style={{ color: la.inkMuted }}>
            Check your own work — which of these did you do?
          </legend>
          <div className="space-y-2">
            {rubric.map((row: { id: string; label: string }) => (
              <label
                key={row.id}
                className="flex cursor-pointer items-center gap-3 border-2 px-4 py-2 font-serif text-base"
                style={{
                  borderRadius: la.radiusM,
                  borderColor: rubricChecked.includes(row.id) ? la.success : la.surfaceSunken,
                  background: rubricChecked.includes(row.id) ? la.successSoft : la.surface,
                  color: la.ink,
                }}
              >
                <input
                  type="checkbox"
                  checked={rubricChecked.includes(row.id)}
                  disabled={answered}
                  onChange={() => toggleRubric(row.id)}
                  className="h-4 w-4 accent-[var(--la-success)]"
                />
                {row.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {answered && !isReflection && (
        <div
          className="border-2 px-4 py-3"
          style={{ borderRadius: la.radiusM, borderColor: la.success, background: la.successSoft }}
        >
          <p className="mb-1 font-sans text-xs uppercase tracking-wider" style={{ color: la.success }}>
            Reference answer
          </p>
          <p className="font-serif text-base" style={{ color: la.ink }}>
            {referenceAnswer}
          </p>
        </div>
      )}

      {!answered && (
        <TrialActionButton
          onClick={() =>
            isReflection
              ? onSubmit({ text, rubricChecked })
              : onSubmit({ text })
          }
          disabled={!ready}
        >
          {isReflection ? "Offer the reflection" : "Check the answer"}
        </TrialActionButton>
      )}
    </div>
  )
}
