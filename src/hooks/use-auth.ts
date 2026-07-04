"use client"

import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"
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

type AuthValue = AuthState & {
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000"

/**
 * Build a demo profile from localStorage onboarding data.
 * This lets the marketing/demo surfaces work without real Supabase Auth.
 * Demo mode is ONLY ever used for signed-out visitors — a real, logged-in
 * account's role never comes from localStorage.
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

interface Seed {
  profile: Profile | null
  userId: string | null
}

/**
 * The shared auth state machine.
 *
 * Role is ALWAYS sourced from the database profile — never inferred from the
 * current route and never mutated as a side effect of navigation. When `seed`
 * carries a server-resolved profile (SSR), the machine starts already
 * authenticated with the correct role so the UI never flips from a guessed
 * default to the real role on hydration. localStorage (demo mode) can only
 * ever supply a role for a genuinely signed-out visitor.
 *
 * `active` lets a consumer mount the machine inertly (no auth subscription)
 * when it is going to read a shared value from context instead.
 */
function useAuthMachine(seed: Seed | null, active: boolean): AuthValue {
  const [state, setState] = useState<AuthState>(() => {
    if (seed?.profile) {
      return {
        user: { id: seed.userId } as User,
        profile: seed.profile,
        role: seed.profile.role,
        isLoading: false,
        isAuthenticated: true,
        isDemoMode: false,
      }
    }
    return {
      user: null,
      profile: null,
      role: null,
      isLoading: active,
      isAuthenticated: false,
      isDemoMode: false,
    }
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
    const userId = state.user?.id
    if (!userId) return
    const profile = await fetchProfile(userId)
    if (profile) {
      setState((prev) => ({
        ...prev,
        profile,
        role: profile.role,
      }))
    }
  }, [state.user, fetchProfile])

  useEffect(() => {
    if (!active) return

    const initAuth = async () => {
      // Real Supabase auth is authoritative. A logged-in account's role is
      // whatever the DB profile says — full stop.
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

      // No real session → signed-out visitor. Only here may localStorage
      // (the marketing demo) supply a role.
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

    // Keep the DB profile fresh across auth events (sign-in, token refresh,
    // sign-out). Role continues to come only from the DB profile; there is no
    // route- or event-driven role reassignment.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
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
          // Genuine sign-out — fall back to the signed-out demo view if present.
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
  }, [fetchProfile, active])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return { ...state, signOut, refreshProfile }
}

const AuthContext = createContext<AuthValue | null>(null)

/**
 * Seeds the shared auth state with the server-resolved profile so every
 * authenticated surface reads one authoritative, non-flipping role. Mounted in
 * the app shell; the server layout passes the SSR profile in.
 */
export function AuthProvider({
  initialProfile,
  initialUserId,
  children,
}: {
  initialProfile: Profile | null
  initialUserId: string | null
  children: ReactNode
}) {
  const value = useAuthMachine({ profile: initialProfile, userId: initialUserId }, true)
  return createElement(AuthContext.Provider, { value }, children)
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  // When rendered under <AuthProvider> (the authenticated app), read the shared
  // SSR-seeded value. Standalone routes with no provider run their own machine.
  const standalone = useAuthMachine(null, ctx === null)
  return ctx ?? standalone
}
