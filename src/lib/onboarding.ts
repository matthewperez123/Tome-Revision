// ── Tome Onboarding State ──
// Persists user's onboarding selections to localStorage + Supabase.

import { createClient } from "@/lib/supabase/client"

export interface OnboardingData {
  userType: "reader" | "teacher" | "student" | null
  classCode: string | null
  teacherSubject: string | null
  teacherLevel: string | null
  teacherClassSize: string | null
  intent: string | null
  traditions: string[]
  firstBookId: string | null
  dailyGoalMinutes: number
  completedAt: string | null
  // Teacher onboarding: first classroom
  firstClassroomName: string | null
  firstClassroomSubject: string | null
}

const STORAGE_KEY = "tome-onboarding"

const DEFAULT_DATA: OnboardingData = {
  userType: null,
  classCode: null,
  teacherSubject: null,
  teacherLevel: null,
  teacherClassSize: null,
  intent: null,
  traditions: [],
  firstBookId: null,
  dailyGoalMinutes: 15,
  completedAt: null,
  firstClassroomName: null,
  firstClassroomSubject: null,
}

export function getOnboardingData(): OnboardingData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_DATA, ...parsed }
    }
  } catch {}
  return { ...DEFAULT_DATA }
}

export function saveOnboardingData(data: Partial<OnboardingData>): void {
  try {
    const current = getOnboardingData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }))
  } catch {}
}

export function completeOnboarding(): void {
  saveOnboardingData({ completedAt: new Date().toISOString() })
}

export function isOnboardingComplete(): boolean {
  try {
    const data = getOnboardingData()
    return data.completedAt !== null
  } catch {
    return false
  }
}

/**
 * Sync onboarding data to Supabase profiles table.
 * Called after onboarding completion when authenticated.
 */
export async function syncOnboardingToSupabase(): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const data = getOnboardingData()

  await supabase
    .from("profiles")
    .update({
      role: data.userType ?? "reader",
      subject: data.teacherSubject,
      grade_levels: data.teacherLevel ? [data.teacherLevel] : null,
      onboarding_data: {
        intent: data.intent,
        traditions: data.traditions,
        firstBookId: data.firstBookId,
        dailyGoalMinutes: data.dailyGoalMinutes,
        teacherClassSize: data.teacherClassSize,
      },
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
}
