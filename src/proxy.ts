import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

// ─── Route protection policy ────────────────────────────────────────────────
// Next.js 16 renamed "middleware" → "proxy"; this is the request gate that runs
// before every (non-static, non-asset) request. The previous root middleware.ts
// was deprecated by the Next 16 upgrade and silently stopped running, which is
// why auth had become client-side only.
//
// Deny-by-default: any route NOT in the public allow-list requires a real
// Supabase session. Unauthenticated visitors to a protected route are sent to
// /login?redirect=<path> and returned there after sign-in.
//
// Reading is intentionally NOT public: the free sampler (FREE_SAMPLE_BOOK_IDS)
// is a free *tier* that needs an account (server-authoritative progress lives
// in user_stats), so /read/* requires auth. Browsing the catalog, book and
// author detail stay public — the marketing copy invites logged-out browsing.
// Once signed in, read/[bookId]/layout.tsx is the entitlement gate that sorts
// free-sample (allowed) from paid (→ /pricing).

// Exact public paths (no session required).
const PUBLIC_ROUTES = new Set<string>([
  "/", // marketing landing
  "/login",
  "/signup",
  "/onboarding", // signup funnel / demo entry — a form, no protected data
  "/demo",
  "/goodbye",
  // Marketing surfaces
  "/readers",
  "/educators",
  "/virgil",
  "/pricing",
  "/faq",
  "/privacy",
  "/terms",
  "/security",
  "/contact",
  "/accessibility",
  // Public catalog browsing
  "/authors",
])

// Public path prefixes (no session required).
const PUBLIC_PREFIXES = [
  "/auth/", // sign-in funnel incl. OAuth + email callback (/auth/callback) — never gate this
  "/library", // public catalog (/library, /library/browse)
  "/book/", // public book detail
  "/author/", // public author detail
  "/join/", // class / group invite links
  "/learn/", // standalone guided-session links (own gate)
  "/hamlet-preview", // public preview surfaces
  "/work-preview",
  "/content/", // static public-domain chapter text the reader fetches (ch-*.json)
]

// Routes that only teachers can access (when authenticated).
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
  if (PUBLIC_ROUTES.has(pathname)) return true
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return true
  return false
}

/**
 * Only allow same-origin relative redirect targets (must start with a single
 * "/"), so a crafted ?redirect= can never bounce the user to another site.
 */
function safeRedirectTarget(raw: string | null): string | null {
  if (!raw) return null
  if (!raw.startsWith("/") || raw.startsWith("//")) return null
  return raw
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Refresh the Supabase session and get the user.
  const { supabaseResponse, user, supabase } = await updateSession(request)

  // API routes enforce their own auth/entitlement (and include public ones like
  // the Stripe webhook). Never redirect them — just carry refreshed cookies.
  if (pathname.startsWith("/api/")) {
    return supabaseResponse
  }

  // ── Public routes ──
  if (isPublicRoute(pathname)) {
    // Already-authenticated users have no business on login/signup; send them
    // to their intended destination (or the dashboard).
    if (user && (pathname === "/login" || pathname === "/signup")) {
      const dest =
        safeRedirectTarget(request.nextUrl.searchParams.get("redirect")) ??
        "/dashboard"
      return NextResponse.redirect(new URL(dest, request.url))
    }
    return supabaseResponse
  }

  // ── Demo mode (no session) ──
  //
  // Unauthenticated visitors run the app shell in client-side DEMO mode — the
  // "Use Beta" entry point. This mirrors the public demo at usetome.app: they
  // can browse the app and preview the Reader / Teacher / Student experiences
  // via the sidebar profile switcher (see use-auth.ts getDemoProfile()).
  //
  // This exposes NO server data: every read is RLS-scoped, so a session-less
  // request sees only demo/empty content. Real, entitlement-gated surfaces keep
  // their own guards — e.g. read/[bookId]/layout.tsx sorts free-sample from paid.
  // Only /read/* requires a real account (server-authoritative reading progress
  // lives in user_stats), so it stays gated to /login.
  if (!user) {
    if (pathname.startsWith("/read/") || pathname === "/read") {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname + search)
      return NextResponse.redirect(loginUrl)
    }
    return supabaseResponse
  }

  // ── Authenticated user checks below ──

  // Check onboarding status.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, onboarding_completed")
    .eq("id", user.id)
    .single()

  // Redirect to onboarding if not completed.
  if (profile && !profile.onboarding_completed && !pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/onboarding", request.url))
  }

  // Already onboarded — redirect away from onboarding.
  if (pathname.startsWith("/onboarding")) {
    if (profile?.onboarding_completed) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return supabaseResponse
  }

  // Role-based access control (only for authenticated users).
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
     * - content/ (static public-domain chapter text the reader fetches)
     * - Public assets (images, paintings, data files, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|content/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$).*)",
  ],
}
