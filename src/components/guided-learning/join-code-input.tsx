"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { normalizeJoinCode, isValidJoinCode } from "@/lib/guided-learning-types"

interface JoinCodeInputProps {
  onSubmit: (code: string) => void
  isLoading?: boolean
  error?: string | null
}

/**
 * Styled input for LAUREL-XXX join codes.
 * Auto-prefixes "LAUREL-" and validates format.
 */
export function JoinCodeInput({ onSubmit, isLoading, error }: JoinCodeInputProps) {
  const [value, setValue] = useState("")
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const normalized = normalizeJoinCode(value)
      if (!isValidJoinCode(normalized)) {
        setLocalError("Enter a valid code (e.g., LAUREL-7K2)")
        return
      }
      setLocalError(null)
      onSubmit(normalized)
    },
    [value, onSubmit],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase()
    setValue(raw)
    if (localError) setLocalError(null)
  }

  const displayError = error || localError

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="space-y-3">
        <label
          className="block text-sm font-semibold tracking-wide opacity-70"
        >
          Enter Join Code
        </label>

        <div className="flex gap-2">
          <Input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="LAUREL-XXX"
            className="flex-1 text-center font-mono text-lg tracking-[0.2em] uppercase"
            maxLength={10}
            autoFocus
            disabled={isLoading}
          />

          <Button
            type="submit"
            disabled={isLoading || !value.trim()}
            style={{
              backgroundColor: "var(--tome-indigo, #6366F1)",
              color: "white",
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {displayError && (
          <motion.p
            className="text-sm font-medium"
            style={{ color: "var(--tome-error, #C84A52)" }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {displayError}
          </motion.p>
        )}
      </div>
    </form>
  )
}
