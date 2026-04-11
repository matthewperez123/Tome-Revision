/**
 * Server-side auth helpers
 *
 * Use in Server Components, Route Handlers, and Server Actions.
 */

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { Profile } from "@/hooks/use-auth"

/**
 * Get the currently authenticated user (from Supabase Auth).
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Get the current user's profile from the profiles table.
 * Returns null if not authenticated or no profile exists.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("profiles")
    .select("id, role, display_name, username, avatar_url, school_name, subject, grade_levels, onboarding_completed")
    .eq("id", user.id)
    .single()

  return data as Profile | null
}

/**
 * Require authentication. Redirects to /login if not authenticated.
 * Returns the user if authenticated.
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

/**
 * Require a specific role. Redirects to /dashboard if wrong role.
 */
export async function requireRole(role: "reader" | "teacher") {
  const profile = await getCurrentProfile()
  if (!profile) {
    redirect("/login")
  }
  if (profile.role !== role) {
    redirect("/dashboard")
  }
  return profile
}
