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
  /** Non-null when a signed-in account is PREVIEWING another role's UI. */
  rolePreview: Profile["role"] | null
}

type AuthValue = AuthState & {
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  /**
   * Demo/testing lens: view the app as another role without changing the
   * account. UI-only — the session, DB profile, and every server-side
   * authorization check keep the real identity. Pass null to reset.
   */
  setRolePreview: (role: Profile["role"] | null) => void
}

const ROLE_PREVIEW_KEY = "tome-role-preview"

function getRolePreview(): Profile["role"] | null {
  if (typeof window === "undefined") return null
  try {
    const v = localStorage.getItem(ROLE_PREVIEW_KEY)
    // Reader preview is paused for now — only teacher/student are switchable.
    return v === "teacher" || v === "student" ? v : null
  } catch {
    return null
  }
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
      const preview = getRolePreview()
      return {
        user: { id: seed.userId } as User,
        profile: seed.profile,
        role: preview ?? seed.profile.role,
        isLoading: false,
        isAuthenticated: true,
        isDemoMode: false,
        rolePreview: preview,
      }
    }
    return {
      user: null,
      profile: null,
      role: null,
      isLoading: active,
      isAuthenticated: false,
      isDemoMode: false,
      rolePreview: null,
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
        role: prev.rolePreview ?? profile.role,
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
        const preview = getRolePreview()
        setState({
          user: session.user,
          profile,
          role: preview ?? profile?.role ?? null,
          isLoading: false,
          isAuthenticated: true,
          isDemoMode: false,
          rolePreview: preview,
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
          rolePreview: null,
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
        rolePreview: null,
      })
    }

    initAuth()

    // Keep the DB profile fresh across auth events (sign-in, token refresh,
    // sign-out). Role continues to come only from the DB profile; there is no
    // route- or event-driven role reassignment.
    // IMPORTANT: the handler body is deferred out of the callback tick.
    // supabase-js invokes onAuthStateChange callbacks while HOLDING its auth
    // lock; awaiting a Supabase query inside the callback (fetchProfile needs
    // the same lock for its access token) deadlocks the whole client — every
    // later .from() query hangs before dispatching HTTP. setTimeout(0) lets
    // the callback return immediately so the lock is released first.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setTimeout(() => void handleAuthEvent(event, session), 0)
      },
    )

    async function handleAuthEvent(
      event: string,
      session: { user: User } | null,
    ) {
        if (session?.user) {
          const sessionUser = session.user
          const profile = await fetchProfile(sessionUser.id)
          const preview = getRolePreview()
          setState((prev) => ({
            // Keep the SAME user object reference when the id hasn't changed
            // (e.g. TOKEN_REFRESHED after every server action). Consumers key
            // effects on `user`; a fresh object per refresh event would
            // re-trigger their data fetches in a loop.
            user: prev.user && prev.user.id === sessionUser.id ? prev.user : sessionUser,
            profile,
            role: preview ?? profile?.role ?? null,
            isLoading: false,
            isAuthenticated: true,
            isDemoMode: false,
            rolePreview: preview,
          }))
        } else if (event === "SIGNED_OUT") {
          // ONLY a genuine sign-out clears auth. A signed-out visitor may then
          // fall back to the localStorage demo view. We gate on SIGNED_OUT so a
          // transient session-less event can never flip a logged-in account's
          // role to a localStorage-derived (demo) role.
          const demoProfile = getDemoProfile()
          setState({
            user: null,
            profile: demoProfile,
            role: demoProfile?.role ?? null,
            isLoading: false,
            isAuthenticated: false,
            isDemoMode: !!demoProfile,
            rolePreview: null,
          })
        }
        // Any other session-less event (e.g. INITIAL_SESSION before the session
        // hydrates) is ignored here — initAuth already established the correct
        // state, and we never downgrade a real role on a non-sign-out event.
    }

    return () => subscription.unsubscribe()
  }, [fetchProfile, active])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    // Clear the localStorage demo shell so the SIGNED_OUT handler can't
    // immediately re-hydrate a demo profile (same role) and mask the sign-out.
    try {
      localStorage.removeItem("tome-onboarding")
      localStorage.removeItem(ROLE_PREVIEW_KEY)
    } catch {
      // ignore (storage unavailable)
    }
    // Hard navigation to the sign-in page guarantees a clean, session-less
    // state and lets the user sign in as a different account.
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }, [])

  const setRolePreview = useCallback((role: Profile["role"] | null) => {
    try {
      // Reader preview is paused — only teacher/student may be previewed.
      if (role === "teacher" || role === "student") {
        localStorage.setItem(ROLE_PREVIEW_KEY, role)
      } else {
        localStorage.removeItem(ROLE_PREVIEW_KEY)
      }
    } catch {
      // ignore (storage unavailable)
    }
    // Hard navigation so every surface re-reads the preview consistently.
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard"
    }
  }, [])

  return { ...state, signOut, refreshProfile, setRolePreview }
}

const AuthContext = createContext<AuthValue | null>(null)

/**
 * Runs ONE shared auth machine for the whole authenticated app and exposes it
 * through context, so every surface (sidebar, dashboard, top bar, …) reads the
 * exact same role at the exact same time. Previously each `useAuth()` call ran
 * its own independent machine, so different components could momentarily resolve
 * to different roles — the source of the perceived teacher/student "switching".
 *
 * Role is ALWAYS the database profile's role; it is never inferred from the
 * route and never mutated as a side effect of navigation. An optional seed lets
 * a server surface pass an already-resolved profile in (kept null here to avoid
 * forcing the shared `(app)` layout dynamic, which would deopt the static
 * catalog/marketing pages).
 */
export function AuthProvider({
  children,
  initialProfile = null,
  initialUserId = null,
}: {
  children: ReactNode
  initialProfile?: Profile | null
  initialUserId?: string | null
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
