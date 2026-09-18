"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Mail, UserMinus, Users } from "lucide-react"
import {
  inviteTeacherSeat,
  removeTeacherFromSchool,
} from "@/lib/actions/school-seats"

interface MemberRow {
  teacherId: string
  seatRole: "admin" | "teacher"
  addedAt: string
  displayName: string | null
  username: string | null
  studentCount: number
}

interface SchoolPanelProps {
  adminId: string
  seatsPurchased: number
  seatsUsed: number
  members: MemberRow[]
}

const LAPIS = "#2C4A7E"
const VERMILION = "#D7472F"

/** Client half of `/account/school`: invites, removals, seat management. */
export function SchoolPanel({
  adminId,
  seatsPurchased,
  seatsUsed,
  members,
}: SchoolPanelProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [inviting, setInviting] = useState(false)
  const [seatBusy, setSeatBusy] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (inviting || !email.trim()) return
    setInviting(true)
    const res = await inviteTeacherSeat({ email })
    if (res.ok) {
      toast.success(`Invitation sent to ${res.data.email}.`)
      setEmail("")
      router.refresh()
    } else {
      toast.error(res.error)
    }
    setInviting(false)
  }

  async function handleRemove(teacherId: string) {
    if (removingId) return
    setRemovingId(teacherId)
    const res = await removeTeacherFromSchool({ teacherId })
    if (res.ok) {
      toast.success("Teacher removed from the plan.")
      router.refresh()
    } else {
      toast.error(res.error)
    }
    setRemovingId(null)
  }

  async function handleAddSeats() {
    if (seatBusy) return
    setSeatBusy(true)
    try {
      const res = await fetch("/api/school/seats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seats: seatsPurchased + 25 }),
      })
      const data = (await res.json()) as { seats?: number; error?: string }
      if (data.seats != null) {
        toast.success(`Your plan now covers ${data.seats} students.`)
        router.refresh()
      } else {
        toast.error(data.error ?? "Could not add seats.")
      }
    } catch {
      toast.error("Could not add seats.")
    }
    setSeatBusy(false)
  }

  return (
    <div className="space-y-10">
      {/* Seats */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Student seats
        </h2>
        <div className="rounded-xl border p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users className="size-5" style={{ color: LAPIS }} />
            <div>
              <p className="font-medium">
                {seatsUsed} of {seatsPurchased} seats in use
              </p>
              <p className="text-xs text-muted-foreground">
                Distinct students across every covered teacher&apos;s
                classrooms.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddSeats}
              disabled={seatBusy}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: LAPIS }}
            >
              {seatBusy ? "Updating…" : "Add seats"}
            </button>
            <a
              href="mailto:hello@usetome.app?subject=School%20invoice%20request"
              className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Request invoice
            </a>
          </div>
        </div>
      </section>

      {/* Teachers */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Teachers on this plan
        </h2>
        <div className="rounded-xl border divide-y">
          {members.map((m) => (
            <div
              key={m.teacherId}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div>
                <p className="font-medium">
                  {m.displayName ?? m.username ?? "Teacher"}
                  {m.seatRole === "admin" && (
                    <span
                      className="ml-2 rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                      style={{ backgroundColor: LAPIS }}
                    >
                      Admin
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {m.studentCount} student{m.studentCount === 1 ? "" : "s"} ·
                  joined {new Date(m.addedAt).toLocaleDateString()}
                </p>
              </div>
              {m.teacherId !== adminId && (
                <button
                  type="button"
                  onClick={() => handleRemove(m.teacherId)}
                  disabled={removingId === m.teacherId}
                  className="inline-flex items-center gap-1.5 text-sm transition-colors disabled:opacity-50"
                  style={{ color: VERMILION }}
                >
                  <UserMinus className="size-4" />
                  {removingId === m.teacherId ? "Removing…" : "Remove"}
                </button>
              )}
            </div>
          ))}
          {members.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              No teachers yet — invite your first below.
            </p>
          )}
        </div>
      </section>

      {/* Invite */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Invite a teacher
        </h2>
        <form onSubmit={handleInvite} className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@school.org"
              className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2"
            />
          </div>
          <button
            type="submit"
            disabled={inviting || !email.trim()}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: LAPIS }}
          >
            {inviting ? "Sending…" : "Send invite"}
          </button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">
          Teachers join free — your seats cover their students. Invites arrive
          by email with a single-use link.
        </p>
      </section>

      {/* Questions Available — wired to metering in Phase 2.6/2.8 */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Questions Available
        </h2>
        <div className="rounded-xl border px-4 py-6 text-sm text-muted-foreground">
          School-wide Questions Available appears here once monthly grants
          begin for your plan.
        </div>
      </section>
    </div>
  )
}
