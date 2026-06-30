"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export interface Profile {
  id: string
  role: "reader" | "teacher" | "student"
  display_name: string | null
  username: string | null
  avatar_url: string | null
  school_name: string | null
  subject: string | null
  grade_levels: string[] | null
  onboarding_completed: boolean
}

interface AuthState {
  user: User | null
  profile: Profile | null
  role: "reader" | "teacher" | "student" | null
  isLoading: boolean
  isAuthenticated: boolean
  /** True when using localStorage fallback instead of real auth */
  isDemoMode: boolean
}

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000"

/**
 * Build a demo profile from localStorage onboarding data.
 * This lets the app work without real Supabase Auth.
 */
function getDemoProfile(): Profile | null {
  try {
    const stored = localStorage.getItem("tome-onboarding")
    if (!stored) return null
    const data = JSON.parse(stored)
    if (!data.completedAt) return null
    const role: Profile["role"] =
      data.userType === "teacher"
        ? "teacher"
        : data.userType === "student"
        ? "student"
        : "reader"
    return {
      id: DEMO_USER_ID,
      role,
      display_name: "Matthew",
      username: "matthew",
      avatar_url: null,
      school_name: data.userType === "teacher" ? "Demo School" : null,
      subject: data.teacherSubject ?? null,
      grade_levels: data.teacherLevel ? [data.teacherLevel] : null,
      onboarding_completed: true,
    }
  } catch {
    return null
  }
}

const supabase = createClient()

export function useAuth(): AuthState & {
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
} {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    role: null,
    isLoading: true,
    isAuthenticated: false,
    isDemoMode: false,
  })

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("id, role, display_name, username, avatar_url, school_name, subject, grade_levels, onboarding_completed")
      .eq("id", userId)
      .single()

    return data as Profile | null
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!state.user) return
    const profile = await fetchProfile(state.user.id)
    if (profile) {
      setState((prev) => ({
        ...prev,
        profile,
        role: profile.role,
      }))
    }
  }, [state.user, fetchProfile])

  useEffect(() => {
    const initAuth = async () => {
      // Try real Supabase auth first
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setState({
          user: session.user,
          profile,
          role: profile?.role ?? null,
          isLoading: false,
          isAuthenticated: true,
          isDemoMode: false,
        })
        return
      }

      // Fall back to localStorage demo profile
      const demoProfile = getDemoProfile()
      if (demoProfile) {
        setState({
          user: null,
          profile: demoProfile,
          role: demoProfile.role,
          isLoading: false,
          isAuthenticated: false,
          isDemoMode: true,
        })
        return
      }

      // No auth, no demo
      setState({
        user: null,
        profile: null,
        role: null,
        isLoading: false,
        isAuthenticated: false,
        isDemoMode: false,
      })
    }

    initAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          setState({
            user: session.user,
            profile,
            role: profile?.role ?? null,
            isLoading: false,
            isAuthenticated: true,
            isDemoMode: false,
          })
        } else {
          // On sign out, fall back to demo
          const demoProfile = getDemoProfile()
          setState({
            user: null,
            profile: demoProfile,
            role: demoProfile?.role ?? null,
            isLoading: false,
            isAuthenticated: false,
            isDemoMode: !!demoProfile,
          })
        }
      },
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return { ...state, signOut, refreshProfile }
}
