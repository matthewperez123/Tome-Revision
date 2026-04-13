import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/login", "/signup", "/auth/callback"]
const PUBLIC_PREFIXES = ["/join/", "/learn/"]

// Routes that only teachers can access (when authenticated)
const TEACHER_ONLY_PREFIXES = [
  "/classroom/create",
  "/classroom/quiz-builder",
  "/classroom/grading",
  "/teacher/guided-learning",
]

function isTeacherOnlyRoute(pathname: string): boolean {
  if (TEACHER_ONLY_PREFIXES.some((p) => pathname.startsWith(p))) return true
  if (/^\/classroom\/[^/]+\/manage/.test(pathname)) return true
  return false
}

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return true
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Refresh the Supabase session and get the user
  const { supabaseResponse, user, supabase } = await updateSession(request)

  // Public routes — redirect authenticated users away from login/signup
  if (isPublicRoute(pathname)) {
    if (user && (pathname === "/login" || pathname === "/signup")) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return supabaseResponse
  }

  // When there's no authenticated user, allow access in demo mode.
  // The client-side useAuth hook handles demo mode via localStorage.
  // Only enforce auth redirects when Supabase Auth is actually configured
  // and the user explicitly logged out (not just browsing without auth).
  if (!user) {
    // Allow all app routes for demo/unauthenticated browsing
    return supabaseResponse
  }

  // ── Authenticated user checks below ──

  // Check onboarding status
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, onboarding_completed")
    .eq("id", user.id)
    .single()

  // Redirect to onboarding if not completed
  if (profile && !profile.onboarding_completed && !pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/onboarding", request.url))
  }

  // Already onboarded — redirect away from onboarding
  if (pathname.startsWith("/onboarding")) {
    if (profile?.onboarding_completed) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return supabaseResponse
  }

  // Role-based access control (only for authenticated users)
  if (profile && isTeacherOnlyRoute(pathname) && profile.role !== "teacher") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public assets (images, paintings, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
}
