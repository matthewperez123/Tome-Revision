"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Copy, Check, Link2, Users, X, UserPlus, Shield } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import {
  inviteToClassroom,
  updateMemberRole,
  removeMember,
  addCoTeacher,
} from "@/lib/actions/classrooms"

type Role = "owner" | "co_teacher" | "ta" | "student"

interface MemberRow {
  id: string
  studentId: string
  role: Role
  joinedAt: string | null
  displayName: string | null
  username: string | null
  avatarUrl: string | null
}

const ROLE_LABEL: Record<Role, string> = {
  owner: "Owner",
  co_teacher: "Co-teacher",
  ta: "TA",
  student: "Student",
}

const ROLE_BADGE: Record<Role, string> = {
  owner: "bg-[#C8A24B]/15 text-[#9c6e2b] dark:text-[#C8A24B]",
  co_teacher: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  ta: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  student: "bg-muted text-muted-foreground",
}

const ROLE_ORDER: Record<Role, number> = { owner: 0, co_teacher: 1, ta: 2, student: 3 }

function initials(name: string | null): string {
  if (!name) return "?"
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
}

function formatJoined(iso: string | null): string {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function ClassroomRosterPanel({
  classroomId,
  joinCode,
}: {
  classroomId: string
  joinCode: string
}) {
  const { user, isDemoMode } = useAuth()
  const [members, setMembers] = useState<MemberRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!user || isDemoMode) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { data, error: loadErr } = await supabase
      .from("classroom_members")
      .select(
        `id, student_id, role, joined_at,
         profile:profiles!classroom_members_student_id_fkey(display_name, username, avatar_url)`,
      )
      .eq("classroom_id", classroomId)

    // A failed read is NOT an empty roster — surface it instead of hiding the panel.
    if (loadErr) {
      setError("Couldn't load the roster. Check your connection and try again.")
      setLoading(false)
      return
    }

    type Raw = {
      id: string
      student_id: string
      role: Role
      joined_at: string | null
      profile: {
        display_name: string | null
        username: string | null
        avatar_url: string | null
      } | null
    }

    const rows: MemberRow[] = ((data ?? []) as unknown as Raw[])
      .map((r) => ({
        id: r.id,
        studentId: r.student_id,
        role: r.role,
        joinedAt: r.joined_at,
        displayName: r.profile?.display_name ?? null,
        username: r.profile?.username ?? null,
        avatarUrl: r.profile?.avatar_url ?? null,
      }))
      .sort((a, b) => {
        const byRole = ROLE_ORDER[a.role] - ROLE_ORDER[b.role]
        if (byRole !== 0) return byRole
        return (a.joinedAt ?? "").localeCompare(b.joinedAt ?? "")
      })
    setMembers(rows)
    setLoading(false)
  }, [user, isDemoMode, classroomId])

  useEffect(() => {
    load()
  }, [load])

  const myRole = useMemo<Role | null>(() => {
    const mine = members.find((m) => m.studentId === user?.id)
    return mine?.role ?? null
  }, [members, user?.id])

  const isOwner = myRole === "owner"
  const isStaff = myRole === "owner" || myRole === "co_teacher"
  const studentCount = members.filter((m) => m.role === "student").length

  async function changeRole(m: MemberRow, next: Role) {
    const res = await updateMemberRole(classroomId, m.studentId, next)
    if (!res.ok) return toast.error(res.error)
    toast.success(`${m.displayName ?? "Member"} is now ${ROLE_LABEL[next]}.`)
    load()
  }

  async function remove(m: MemberRow) {
    if (!window.confirm(`Remove ${m.displayName ?? "this member"} from the class?`)) {
      return
    }
    const res = await removeMember(classroomId, m.studentId)
    if (!res.ok) return toast.error(res.error)
    toast.success("Member removed.")
    load()
  }

  if (isDemoMode || (!loading && !error && !isStaff)) return null

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2">
        <Users className="size-5 text-[#C8A24B]" />
        <h2 className="text-lg font-semibold">Roster</h2>
        <span className="text-sm text-muted-foreground">
          {studentCount} {studentCount === 1 ? "student" : "students"}
        </span>
      </div>

      {isStaff && (
        <InvitePanel
          classroomId={classroomId}
          joinCode={joinCode}
          isOwner={isOwner}
          onStaffAdded={load}
        />
      )}

      <div className="mt-4 space-y-2">
        {loading && (
          <div className="h-16 animate-pulse rounded-xl border border-border bg-muted/30" />
        )}
        {!loading && error && (
          <div className="rounded-xl border border-[#C8553D]/25 py-8 text-center">
            <p className="text-sm font-medium text-[#C8553D]">{error}</p>
            <button
              onClick={() => load()}
              className="mt-2 rounded-md px-3 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-muted dark:text-indigo-300"
            >
              Try again
            </button>
          </div>
        )}
        {!loading && !error && members.length === 0 && (
          <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No members yet. Share the join code or send an invite to get started.
          </p>
        )}
        {members.map((m) => (
          <div
            key={m.id}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 sm:p-4"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {initials(m.displayName)}
            </div>
            <div className="min-w-[140px] flex-1">
              <p className="text-sm font-medium">{m.displayName ?? "Reader"}</p>
              {m.joinedAt && (
                <p className="text-xs text-muted-foreground">
                  Joined {formatJoined(m.joinedAt)}
                </p>
              )}
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${ROLE_BADGE[m.role]}`}
            >
              {ROLE_LABEL[m.role]}
            </span>

            {isOwner && m.role !== "owner" && (
              <div className="flex items-center gap-1">
                {m.role !== "co_teacher" && (
                  <button
                    onClick={() => changeRole(m, "co_teacher")}
                    className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title="Promote to co-teacher"
                  >
                    Co-teacher
                  </button>
                )}
                {m.role !== "ta" && (
                  <button
                    onClick={() => changeRole(m, "ta")}
                    className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title="Make TA"
                  >
                    TA
                  </button>
                )}
                {m.role !== "student" && (
                  <button
                    onClick={() => changeRole(m, "student")}
                    className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title="Reset to student"
                  >
                    Student
                  </button>
                )}
                <button
                  onClick={() => remove(m)}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                  title="Remove from class"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function InvitePanel({
  classroomId,
  joinCode,
  isOwner,
  onStaffAdded,
}: {
  classroomId: string
  joinCode: string
  isOwner: boolean
  onStaffAdded: () => void
}) {
  const [emails, setEmails] = useState<string[]>([])
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const [copied, setCopied] = useState(false)
  const [staffHandle, setStaffHandle] = useState("")
  const [staffRole, setStaffRole] = useState<"co_teacher" | "ta">("co_teacher")
  const [addingStaff, setAddingStaff] = useState(false)

  const joinLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/join?code=${joinCode}`
      : `/join?code=${joinCode}`

  function commitDraft() {
    const value = draft.trim().replace(/,$/, "")
    if (!value) return
    if (!EMAIL_RE.test(value)) {
      toast.error("That doesn't look like an email address.")
      return
    }
    if (!emails.includes(value.toLowerCase())) {
      setEmails((prev) => [...prev, value.toLowerCase()])
    }
    setDraft("")
  }

  async function send() {
    const list = [...emails]
    const pending = draft.trim().replace(/,$/, "")
    if (pending && EMAIL_RE.test(pending) && !list.includes(pending.toLowerCase())) {
      list.push(pending.toLowerCase())
    }
    if (list.length === 0) {
      toast.error("Add at least one email address.")
      return
    }
    setSending(true)
    const res = await inviteToClassroom({ classroomId, emails: list, role: "student" })
    setSending(false)
    if (!res.ok) return toast.error(res.error)
    toast.success(`Sent ${res.data.sent} invite${res.data.sent === 1 ? "" : "s"}.`)
    setEmails([])
    setDraft("")
  }

  function copyLink() {
    navigator.clipboard.writeText(joinLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  async function addStaff() {
    const handle = staffHandle.trim().replace(/^@/, "")
    if (!handle) return
    setAddingStaff(true)
    try {
      const supabase = createClient()
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, display_name")
        .eq("username", handle)
        .maybeSingle<{ id: string; display_name: string | null }>()
      if (!profile) {
        toast.error(`No user found with username @${handle}.`)
        return
      }
      const res = await addCoTeacher({
        classroomId,
        profileId: profile.id,
        role: staffRole,
      })
      if (!res.ok) return toast.error(res.error)
      toast.success(
        `Added ${profile.display_name ?? handle} as ${staffRole === "co_teacher" ? "co-teacher" : "TA"}.`,
      )
      setStaffHandle("")
      onStaffAdded()
    } finally {
      setAddingStaff(false)
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <UserPlus className="size-4 text-[#C8A24B]" />
        <h3 className="text-sm font-semibold">Invite students</h3>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-background p-2">
        {emails.map((e) => (
          <span
            key={e}
            className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs"
          >
            {e}
            <button
              onClick={() => setEmails((prev) => prev.filter((x) => x !== e))}
              className="text-muted-foreground hover:text-foreground"
              aria-label={`Remove ${e}`}
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(ev) => setDraft(ev.target.value)}
          onKeyDown={(ev) => {
            if (ev.key === "Enter" || ev.key === ",") {
              ev.preventDefault()
              commitDraft()
            } else if (ev.key === "Backspace" && !draft && emails.length) {
              setEmails((prev) => prev.slice(0, -1))
            }
          }}
          onBlur={commitDraft}
          placeholder={emails.length ? "" : "student@school.edu"}
          className="min-w-[160px] flex-1 bg-transparent px-1 py-0.5 text-sm outline-none"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={send} disabled={sending} className="gap-1.5">
          {sending ? "Sending…" : "Send invites"}
        </Button>
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? <Check className="size-3.5 text-green-500" /> : <Link2 className="size-3.5" />}
          {copied ? "Link copied" : "Copy join link"}
        </button>
        <span className="font-mono text-xs text-muted-foreground">
          Code: {joinCode}
        </span>
      </div>

      {isOwner && (
        <div className="mt-4 border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-indigo-500" />
            <h3 className="text-sm font-semibold">Add staff</h3>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Input
              value={staffHandle}
              onChange={(e) => setStaffHandle(e.target.value)}
              placeholder="username"
              className="h-9 w-40 text-sm"
            />
            <select
              value={staffRole}
              onChange={(e) => setStaffRole(e.target.value as "co_teacher" | "ta")}
              className="h-9 rounded-md border border-border bg-background px-2 text-sm"
            >
              <option value="co_teacher">Co-teacher</option>
              <option value="ta">TA</option>
            </select>
            <Button
              size="sm"
              variant="outline"
              onClick={addStaff}
              disabled={addingStaff || !staffHandle.trim()}
            >
              {addingStaff ? "Adding…" : "Add"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
