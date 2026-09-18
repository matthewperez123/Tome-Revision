import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getEntitlement, getSeatAllowance } from "@/lib/entitlements/server"
import { listSchoolRoster } from "@/lib/actions/school-seats"
import { SchoolPanel } from "@/components/account/school-panel"

export const dynamic = "force-dynamic"

/**
 * Launch-week School admin panel (owner-only): student seats purchased vs.
 * used, teacher roster with per-teacher student counts, email invites, and
 * seat management. The full admin dashboard lands in Phase 11.
 */
export default async function SchoolAccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login?error=session_missing")

  const entitlement = await getEntitlement(user.id)
  if (entitlement.tier !== "school" || entitlement.schoolRole !== "admin") {
    redirect("/account")
  }

  const [roster, seat] = await Promise.all([
    listSchoolRoster(),
    getSeatAllowance(user.id),
  ])

  // Per-teacher distinct-student counts across classrooms each teacher owns.
  const admin = createAdminClient()
  const teacherIds = (roster?.members ?? []).map((m) => m.teacherId)
  const studentCounts = new Map<string, number>()
  if (teacherIds.length > 0) {
    const { data: rooms } = await admin
      .from("classrooms")
      .select("id, teacher_id")
      .in("teacher_id", teacherIds)
    const roomRows = (rooms ?? []) as { id: string; teacher_id: string }[]
    const roomIds = roomRows.map((r) => r.id)
    const roomOwner = new Map(roomRows.map((r) => [r.id, r.teacher_id]))
    if (roomIds.length > 0) {
      const { data: members } = await admin
        .from("classroom_members")
        .select("classroom_id, student_id")
        .in("classroom_id", roomIds)
        .eq("role", "student")
      const perTeacher = new Map<string, Set<string>>()
      for (const m of (members ?? []) as {
        classroom_id: string
        student_id: string
      }[]) {
        const owner = roomOwner.get(m.classroom_id)
        if (!owner) continue
        if (!perTeacher.has(owner)) perTeacher.set(owner, new Set())
        perTeacher.get(owner)!.add(m.student_id)
      }
      for (const [teacherId, students] of perTeacher) {
        studentCounts.set(teacherId, students.size)
      }
    }
  }

  const members = (roster?.members ?? []).map((m) => ({
    ...m,
    studentCount: studentCounts.get(m.teacherId) ?? 0,
  }))

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-3.5" />
            Back to account
          </Link>
          <h1 className="font-serif text-3xl font-bold tracking-tight mt-3">
            School plan
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage student seats and the teachers your school covers.
          </p>
        </div>

        <SchoolPanel
          adminId={user.id}
          seatsPurchased={seat.allowance}
          seatsUsed={seat.used}
          members={members}
        />
      </div>
    </div>
  )
}
