"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, ScanLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { verifyStudentAccess } from "@/lib/actions/student-auth"
import { isValidStudentCode, normalizeStudentCode } from "@/lib/student-code"
import { parseBadgeQrPayload } from "@/lib/badge-token"
import { BadgeScanner } from "@/components/student/badge-scanner"

const LAPIS = "#2A4B8D"

/** True if a raw entry is a usable credential (typed code OR badge payload). */
function isSubmittable(raw: string): boolean {
  return isValidStudentCode(raw) || parseBadgeQrPayload(raw) !== null
}

/**
 * Code-only student sign-in. No email, no password — a student types OR scans
 * the code from their badge. Three routes, ONE server path:
 *   * typed XXXX-XXXX code,
 *   * a wedge/USB scanner that types the badge QR payload + Enter (same input),
 *   * the on-device camera scanner (BadgeScanner).
 * Every route hands its raw value to verifyStudentAccess, which classifies and
 * rate-limits it server-side. All copy is age-appropriate and never mentions
 * email or account recovery.
 */
export default function StudentLoginPage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)

  const submit = useCallback(
    async (rawValue: string) => {
      if (!isSubmittable(rawValue)) {
        setError("That code doesn't look right. Check it and try again.")
        return
      }
      setError(null)
      setLoading(true)
      // Pass the raw value straight through — the server action is the single
      // classifier for both typed codes and scanned badge tokens.
      const result = await verifyStudentAccess(rawValue)
      if (!result.ok) {
        setError(result.error)
        setLoading(false)
        setCode("")
        inputRef.current?.focus()
        return
      }
      router.push(result.data.redirectTo)
      router.refresh()
    },
    [router],
  )

  function handleChange(raw: string) {
    const upper = raw.toUpperCase()
    // A wedge scanner types the whole badge payload (TOME-BADGE:…) into this
    // field. Keep that intact; only apply XXXX-XXXX code formatting to short,
    // human-typed input.
    if (upper.includes("TOME-BADGE:") || upper.replace(/[^A-Z0-9]/g, "").length > 8) {
      setCode(upper)
    } else {
      const cleaned = upper.replace(/[^A-Z0-9]/g, "")
      setCode(
        cleaned.length > 4 ? `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}` : cleaned,
      )
    }
    if (error) setError(null)
  }

  function handleScanned(payload: string) {
    setScanning(false)
    void submit(payload)
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
            maxLength={40}
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
            disabled={loading || !isSubmittable(code)}
            style={{ backgroundColor: LAPIS }}
          >
            {loading ? "Checking…" : "Let's go"}
          </Button>

          <button
            type="button"
            onClick={() => setScanning(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border bg-card py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-[#2A4B8D] hover:text-foreground"
          >
            <ScanLine className="size-4" />
            Scan your badge instead
          </button>
        </form>

        {scanning && (
          <BadgeScanner
            onDetect={handleScanned}
            onClose={() => setScanning(false)}
          />
        )}

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
