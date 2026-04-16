"use client"

import { useState, useCallback, useMemo } from "react"
import { PenTool, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  prompt: string
  minWords?: number
  initialContent?: string
  onSave: (content: string, wordCount: number) => void
  onSubmit: (content: string, wordCount: number) => void
}

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length
}

export function ReflectionEditor({
  prompt,
  minWords = 0,
  initialContent = "",
  onSave,
  onSubmit,
}: Props) {
  const [content, setContent] = useState(initialContent)
  const wordCount = useMemo(() => countWords(content), [content])
  const meetsMinimum = minWords <= 0 || wordCount >= minWords
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = useCallback(
    (text: string) => {
      setContent(text)
      onSave(text, countWords(text))
    },
    [onSave],
  )

  const handleSubmit = useCallback(() => {
    onSubmit(content, wordCount)
    setIsSubmitted(true)
  }, [content, wordCount, onSubmit])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-12">
      {/* Prompt */}
      <div className="mb-8 text-center">
        <PenTool
          className="mx-auto mb-3 h-6 w-6"
          style={{ color: "var(--gold-default, #B8924A)" }}
        />
        <p
          className="text-lg font-medium italic leading-relaxed"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {prompt}
        </p>
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isSubmitted}
        placeholder="Begin your reflection here..."
        rows={8}
        className="w-full max-w-xl resize-none rounded-xl border bg-transparent px-5 py-4 text-base leading-relaxed focus:border-[var(--gold-default,#B8924A)] focus:outline-none disabled:opacity-50"
        style={{
          fontFamily: "var(--font-serif)",
          borderColor: "rgba(128, 128, 128, 0.2)",
        }}
      />

      {/* Word counter */}
      <div className="mt-3 flex w-full max-w-xl items-center justify-between text-xs">
        <span
          style={{
            color: meetsMinimum
              ? "var(--tome-success, #2D9A47)"
              : "var(--foreground)",
            opacity: meetsMinimum ? 0.7 : 0.5,
          }}
        >
          {wordCount} words
          {minWords > 0 && ` / ${minWords} minimum`}
        </span>
        {isSubmitted && (
          <span className="flex items-center gap-1" style={{ color: "var(--tome-success, #2D9A47)" }}>
            <Check className="h-3 w-3" /> Submitted
          </span>
        )}
      </div>

      {/* Submit */}
      {!isSubmitted && (
        <Button
          onClick={handleSubmit}
          disabled={!meetsMinimum || content.trim().length === 0}
          className="mt-6 gap-2 text-white"
          style={{
            backgroundColor: meetsMinimum && content.trim()
              ? "var(--tome-indigo, #6366F1)"
              : undefined,
          }}
        >
          <Check className="h-4 w-4" />
          Submit Reflection
        </Button>
      )}
    </div>
  )
}
