"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, Sparkles, GraduationCap } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"

interface SharedClassroom {
  id: string
  name: string
  myRole: "owner" | "co_teacher" | "ta" | "student"
}

interface StudyGroupSummary {
  id: string
  name: string
  isTeacherLed: boolean
}

interface RecentRec {
  id: string
  bookId: string
  bookTitle: string
  recipientDisplayName: string
}

const ROLE_LABEL: Record<SharedClassroom["myRole"], string> = {
  owner: "You teach",
  co_teacher: "Co-teaching",
  ta: "TA",
  student: "Classmate",
}

/**
 * Real-data social sections for a public profile.
 *
 * Renders nothing in demo mode (no auth) so the existing rich mock profile
 * page is undisturbed. When the viewer is authenticated, fetches:
 *
 *  - Classrooms the *viewer* shares with this profile (privacy-gated by
 *    membership intersection — strangers see nothing).
 *  - Study groups this profile belongs to (public by default).
 *  - The 5 most recent book recommendations this profile has sent (any
 *    recipient) that were accepted — a "they've been recommending..." feed.
 */
export function ProfileSocialSections({ username }: { username: string }) {
  const { user, isDemoMode } = useAuth()
  const [profileId, setProfileId] = useState<string | null>(null)
  const [shared, setShared] = useState<SharedClassroom[]>([])
  const [groups, setGroups] = useState<StudyGroupSummary[]>([])
  const [recentRecs, setRecentRecs] = useState<RecentRec[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!user || isDemoMode) {
      setLoaded(true)
      return
    }
    let cancelled = false
    ;(async () => {
      const supabase = createClient()

      // 1. Resolve the username → profile id.
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle<{ id: string }>()
      if (!profile || cancelled) {
        setLoaded(true)
        return
      }
      setProfileId(profile.id)

      // 2. Shared classrooms: classrooms where BOTH viewer + target are members.
      const { data: sharedRows } = await supabase
        .from("classroom_members")
        .select(
          `
          role,
          classroom:classrooms!inner(id, name)
        `,
        )
        .eq("student_id", user.id)
        .in(
          "classroom_id",
          (
            await supabase
              .from("classroom_members")
              .select("classroom_id")
              .eq("student_id", profile.id)
          ).data?.map((r: { classroom_id: string }) => r.classroom_id) ?? [],
        )

      type SharedRow = {
        role: SharedClassroom["myRole"]
        classroom: { id: string; name: string } | null
      }
      const sharedList: SharedClassroom[] = ((sharedRows ?? []) as unknown as SharedRow[])
        .map((r) =>
          r.classroom
            ? { id: r.classroom.id, name: r.classroom.name, myRole: r.role }
            : null,
        )
        .filter((c): c is SharedClassroom => c !== null)

      // 3. Study groups the target belongs to.
      const { data: groupRows } = await supabase
        .from("study_group_members")
        .select(
          `
          group:study_groups!inner(id, name, is_teacher_led)
        `,
        )
        .eq("user_id", profile.id)

      type GroupRow = {
        group: { id: string; name: string; is_teacher_led: boolean } | null
      }
      const groupList: StudyGroupSummary[] = ((groupRows ?? []) as unknown as GroupRow[])
        .map((r) =>
          r.group
            ? {
                id: r.group.id,
                name: r.group.name,
                isTeacherLed: r.group.is_teacher_led,
              }
            : null,
        )
        .filter((g): g is StudyGroupSummary => g !== null)

      // 4. Recent recs sent by this profile.
      const { data: recRows } = await supabase
        .from("book_recommendations")
        .select(
          `
          id, created_at,
          book:books!book_recommendations_book_id_fkey(id, title),
          recipient:profiles!book_recommendations_recipient_id_fkey(display_name, username)
        `,
        )
        .eq("sender_id", profile.id)
        .eq("status", "accepted")
        .order("created_at", { ascending: false })
        .limit(5)

      type RecRow = {
        id: string
        created_at: string
        book: { id: string; title: string } | null
        recipient: { display_name: string | null; username: string | null } | null
      }
      const recsList: RecentRec[] = ((recRows ?? []) as unknown as RecRow[])
        .map((r) =>
          r.book
            ? {
                id: r.id,
                bookId: r.book.id,
                bookTitle: r.book.title,
                recipientDisplayName:
                  r.recipient?.display_name ??
                  r.recipient?.username ??
                  "a friend",
              }
            : null,
        )
        .filter((r): r is RecentRec => r !== null)

      if (cancelled) return
      setShared(sharedList)
      setGroups(groupList)
      setRecentRecs(recsList)
      setLoaded(true)
    })()
    return () => {
      cancelled = true
    }
  }, [user, isDemoMode, username])

  // Demo mode or unresolved profile → render nothing.
  if (isDemoMode || !user || !loaded || !profileId) return null

  // Real mode but every section is empty → also render nothing rather than
  // pollute the page with empty cards.
  if (shared.length === 0 && groups.length === 0 && recentRecs.length === 0) {
    return null
  }

  return (
    <>
      {shared.length > 0 && (
        <BlurFade delay={0.22} inView>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <GraduationCap className="size-4 text-indigo-500" />
              <h2 className="text-sm font-semibold">Classrooms in common</h2>
            </div>
            <div className="space-y-2">
              {shared.map((c) => (
                <Link
                  key={c.id}
                  href={`/classroom/${c.id}`}
                  className="flex items-center justify-between rounded-lg border border-transparent px-2 py-1.5 hover:border-border hover:bg-muted/50"
                >
                  <span className="text-sm">{c.name}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {ROLE_LABEL[c.myRole]}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </BlurFade>
      )}

      {groups.length > 0 && (
        <BlurFade delay={0.24} inView>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Users className="size-4 text-purple-500" />
              <h2 className="text-sm font-semibold">Study groups</h2>
            </div>
            <div className="space-y-2">
              {groups.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5"
                >
                  <span className="text-sm">{g.name}</span>
                  {g.isTeacherLed && (
                    <span className="text-[10px] uppercase tracking-wider text-[#D4A04C]">
                      Teacher-led
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </BlurFade>
      )}

      {recentRecs.length > 0 && (
        <BlurFade delay={0.26} inView>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="size-4 text-[#D4A04C]" />
              <h2 className="text-sm font-semibold">Recently recommending</h2>
            </div>
            <div className="space-y-1.5">
              {recentRecs.map((r) => (
                <Link
                  key={r.id}
                  href={`/book/${r.bookId}`}
                  className="block rounded-lg px-2 py-1.5 text-sm hover:bg-muted/50"
                >
                  <span className="font-medium">{r.bookTitle}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    → {r.recipientDisplayName}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </BlurFade>
      )}
    </>
  )
}
