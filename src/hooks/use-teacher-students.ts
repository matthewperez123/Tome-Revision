"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

export interface TeacherStudent {
  id: string
  name: string
  avatarUrl: string | null
  avatarColor: string
  classroomNames: string[]
}

// Deterministic avatar color from a student id so initials render consistently
// without storing a color. Palette mirrors the classroom accent ramp.
const AVATAR_PALETTE = [
  "#4F46E5", "#0D9488", "#D4A04C", "#EA580C",
  "#7C3AED", "#16A34A", "#BE185D", "#0284C7",
]

function colorForId(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]
}

/**
 * Real roster of the signed-in teacher's students, de-duplicated across all of
 * their classrooms. Returns an empty list (never fabricated names) when the
 * teacher has no classrooms or no enrolled students yet.
 */
export function useTeacherStudents() {
  const { user, isDemoMode } = useAuth()
  const [students, setStudents] = useState<TeacherStudent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || isDemoMode) {
      setStudents([])
      setLoading(false)
      return
    }

    let cancelled = false
    ;(async () => {
      const supabase = createClient()

      const { data: classes } = await supabase
        .from("classrooms")
        .select("id, name")
        .eq("teacher_id", user.id)

      const classIds = (classes ?? []).map((c) => c.id)
      if (classIds.length === 0) {
        if (!cancelled) {
          setStudents([])
          setLoading(false)
        }
        return
      }

      const classNameById = new Map(
        (classes ?? []).map((c) => [c.id, c.name as string]),
      )

      const { data: members } = await supabase
        .from("classroom_members")
        .select("classroom_id, student_id, role, profiles(display_name, avatar_url)")
        .in("classroom_id", classIds)
        .eq("role", "student")

      if (cancelled) return

      const byId = new Map<string, TeacherStudent>()
      for (const m of members ?? []) {
        const rawProfile = (
          m as {
            profiles:
              | { display_name: string | null; avatar_url: string | null }
              | { display_name: string | null; avatar_url: string | null }[]
              | null
          }
        ).profiles
        const profile = Array.isArray(rawProfile) ? rawProfile[0] ?? null : rawProfile
        const existing = byId.get(m.student_id)
        const className = classNameById.get(m.classroom_id)
        if (existing) {
          if (className && !existing.classroomNames.includes(className)) {
            existing.classroomNames.push(className)
          }
        } else {
          byId.set(m.student_id, {
            id: m.student_id,
            name: profile?.display_name ?? "Student",
            avatarUrl: profile?.avatar_url ?? null,
            avatarColor: colorForId(m.student_id),
            classroomNames: className ? [className] : [],
          })
        }
      }

      setStudents([...byId.values()].sort((a, b) => a.name.localeCompare(b.name)))
      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [user, isDemoMode])

  return useMemo(() => ({ students, loading }), [students, loading])
}
