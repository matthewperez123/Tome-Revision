"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { verifyStudentAccess } from "@/lib/actions/student-auth"
import { isValidStudentCode, normalizeStudentCode } from "@/lib/student-code"

const LAPIS = "#2A4B8D"

/**
 * Code-only student sign-in. No email, no password — a student types (or, in
 * Phase 3, scans) the XXXX-XXXX code from their badge. The same input doubles
 * as the hardware-scanner target: wedge scanners type the code and press Enter,
 * which submits the form. All copy is age-appropriate and never mentions email
 * or account recovery.
 */
export default function StudentLoginPage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = useCallback(
    async (rawValue: string) => {
      const value = normalizeStudentCode(rawValue)
      if (!value) {
        setError("That code doesn't look right. Check it and try again.")
        return
      }
      setError(null)
      setLoading(true)
      const result = await verifyStudentAccess(value)
      if (!result.ok) {
        setError(result.error)
        setLoading(false)
        inputRef.current?.select()
        return
      }
      router.push(result.data.redirectTo)
      router.refresh()
    },
    [router],
  )

  function handleChange(raw: string) {
    // Uppercase, keep only alphabet+dash, and auto-insert the dash after the
    // first block so it always reads XXXX-XXXX as the student types or scans.
    const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "")
    const formatted =
      cleaned.length > 4 ? `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}` : cleaned
    setCode(formatted)
    if (error) setError(null)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div
          className="mx-auto flex size-14 items-center justify-center rounded-2xl text-white"
          style={{ backgroundColor: LAPIS }}
        >
          <BookOpen className="size-7" />
        </div>
        <h1 className="mt-5 font-serif text-2xl font-semibold tracking-tight">
          Enter your class code
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Type the code from your badge to start reading.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            void submit(code)
          }}
          className="mt-8 space-y-4"
        >
          <input
            ref={inputRef}
            value={code}
            onChange={(e) => handleChange(e.target.value)}
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            autoFocus
            aria-label="Class code"
            placeholder="ABCD-EFGH"
            maxLength={9}
            className="w-full rounded-xl border-2 border-border bg-card py-4 text-center font-mono text-2xl uppercase tracking-[0.3em] outline-none focus:border-[#2A4B8D]"
          />

          {error && (
            <p className="text-sm font-medium text-red-500" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full text-base"
            disabled={loading || !isValidStudentCode(code)}
            style={{ backgroundColor: LAPIS }}
          >
            {loading ? "Checking…" : "Let's go"}
          </Button>
        </form>

        <p className="mt-8 text-xs text-muted-foreground">
          Are you a teacher?{" "}
          <Link href="/login" className="font-medium" style={{ color: LAPIS }}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}
