"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Copy,
  Check,
  Plus,
  Printer,
  RefreshCw,
  QrCode,
  Ban,
  UserPlus,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  type BadgePrintCard,
  type StudentCodeRow,
  addStudentWithCode,
  issueBadge,
  issueBadgesForClassroom,
  listClassroomStudentCodes,
  revokeBadge,
  rotateStudentCode,
} from "@/lib/actions/student-badges"
import { BadgePrintSheet } from "./badge-print-sheet"

const LAPIS = "#2A4B8D"
const GOLD = "#C8A24B"

// ─── Badges tab: code-only roster + printable scan badges (teacher-only) ────
// A teacher adds a student by first name, gets an XXXX-XXXX code, and prints a
// bookplate badge whose QR scans that student in. No email is ever asked for,
// shown, or stored. Everything here is gated server-side to the room's staff.

export function StudentBadgesPanel({
  classroomId,
  className,
  disabled,
}: {
  classroomId: string
  className: string
  /** True in demo mode / signed-out — badges need a real signed-in teacher. */
  disabled: boolean
}) {
  const [rows, setRows] = useState<StudentCodeRow[]>([])
  const [loading, setLoading] = useState(!disabled)
  const [name, setName] = useState("")
  const [adding, setAdding] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [printing, setPrinting] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [printCards, setPrintCards] = useState<BadgePrintCard[] | null>(null)

  const refresh = useCallback(async () => {
    const res = await listClassroomStudentCodes(classroomId)
    if (res.ok) setRows(res.data)
    else toast.error(res.error)
    setLoading(false)
  }, [classroomId])

  useEffect(() => {
    if (disabled) return
    refresh()
  }, [disabled, refresh])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || adding) return
    setAdding(true)
    const res = await addStudentWithCode({ classroomId, name: trimmed })
    if (res.ok) {
      toast.success(`${res.data.displayName} added · code ${res.data.code}`)
      setName("")
      await refresh()
    } else {
      toast.error(res.error)
    }
    setAdding(false)
  }

  async function handleRotate(userId: string) {
    if (busyId) return
    setBusyId(userId)
    const res = await rotateStudentCode({ classroomId, userId })
    if (res.ok) {
      toast.success(`New code: ${res.data.code}`)
      await refresh()
    } else {
      toast.error(res.error)
    }
    setBusyId(null)
  }

  async function handlePrintOne(userId: string) {
    if (busyId) return
    setBusyId(userId)
    const res = await issueBadge({ classroomId, userId })
    if (res.ok) {
      setPrintCards([res.data])
      await refresh()
    } else {
      toast.error(res.error)
    }
    setBusyId(null)
  }

  async function handleRevoke(userId: string) {
    if (busyId) return
    setBusyId(userId)
    const res = await revokeBadge({ classroomId, userId })
    if (res.ok) {
      toast.success("Badge revoked. The typed code still works.")
      await refresh()
    } else {
      toast.error(res.error)
    }
    setBusyId(null)
  }

  async function handlePrintAll() {
    if (printing) return
    setPrinting(true)
    const res = await issueBadgesForClassroom(classroomId)
    if (res.ok) {
      if (res.data.length === 0) toast.info("Add a student first.")
      else setPrintCards(res.data)
      await refresh()
    } else {
      toast.error(res.error)
    }
    setPrinting(false)
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode((c) => (c === code ? null : c)), 2000)
  }

  if (disabled) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Sign in as this classroom&apos;s teacher to add students and print scan
        badges.
      </p>
    )
  }

  return (
    <div className="space-y-5">
      {/* Add student by name — no email, ever. */}
      <form
        onSubmit={handleAdd}
        className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-3"
      >
        <UserPlus className="size-4" style={{ color: LAPIS }} />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Student name (e.g. Beatrice C.)"
          maxLength={40}
          className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2"
          style={{ boxShadow: "none" }}
        />
        <Button type="submit" size="sm" className="gap-1.5" disabled={adding || !name.trim()}>
          <Plus className="size-3.5" />
          {adding ? "Adding…" : "Add student"}
        </Button>
      </form>

      {/* Print-all — mints fresh codes for the whole class. */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {rows.length} code-login student{rows.length === 1 ? "" : "s"}
        </p>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={handlePrintAll}
          disabled={printing || rows.length === 0}
        >
          <Printer className="size-3.5" />
          {printing ? "Preparing…" : "Print all badges"}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="size-5 animate-spin rounded-full border-2 border-muted border-t-foreground" />
        </div>
      ) : rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No code-login students yet. Add one above to generate a class code and
          a printable scan badge.
        </p>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => {
            const rowBusy = busyId === r.userId
            return (
              <div
                key={r.userId}
                className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3"
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {r.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.displayName}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <button
                      onClick={() => copyCode(r.code)}
                      className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground"
                      title="Copy code"
                    >
                      {r.code}
                      {copiedCode === r.code ? (
                        <Check className="size-3 text-green-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                    {r.badgeActive && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                        style={{ background: `${GOLD}1a`, color: GOLD }}
                      >
                        <QrCode className="size-2.5" /> badge active
                      </span>
                    )}
                    {!r.active && (
                      <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        code off
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleRotate(r.userId)}
                    disabled={rowBusy}
                    title="New code"
                    className="inline-flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-50"
                  >
                    <RefreshCw className={`size-3.5 ${rowBusy ? "animate-spin" : ""}`} />
                  </button>
                  <button
                    onClick={() => handlePrintOne(r.userId)}
                    disabled={rowBusy}
                    title="Print / re-issue badge"
                    className="inline-flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-50"
                  >
                    <Printer className="size-3.5" />
                  </button>
                  {r.badgeActive && (
                    <button
                      onClick={() => handleRevoke(r.userId)}
                      disabled={rowBusy}
                      title="Revoke badge"
                      className="inline-flex items-center justify-center rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10 disabled:opacity-50"
                    >
                      <Ban className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {printCards && (
        <BadgePrintSheet
          cards={printCards}
          className={className}
          onClose={() => setPrintCards(null)}
        />
      )}
    </div>
  )
}
