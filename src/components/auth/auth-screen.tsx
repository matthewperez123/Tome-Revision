"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { BookOpen, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TomeWordmark } from "@/components/brand/tome-wordmark"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

type AuthMode = "signin" | "signup"

/**
 * Only follow same-origin relative targets (a single leading "/") so a crafted
 * ?redirect= can't bounce the user to another site after auth.
 */
function safeRedirectTarget(raw: string | null): string | null {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw
  return null
}

/**
 * ONE combined auth screen with a Sign in / Sign up toggle. Both `/login` and
 * `/signup` render this, seeding the initial tab from `initialMode`, so the two
 * URLs still work (and their existing ?redirect=/?plan= intents are honored)
 * while the user can flip between the two forms without leaving the page.
 */
export function AuthScreen({ initialMode }: { initialMode: AuthMode }) {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()

  const [mode, setMode] = useState<AuthMode>(initialMode)

  // Intent carried in from a CTA / invite. A paid reader plan resumes at
  // checkout after sign-up; an explicit same-origin ?redirect= always wins.
  const plan = params.get("plan")
  const wantsCheckout = plan === "solo" || plan === "family"
  const redirectTarget = safeRedirectTarget(params.get("redirect"))

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(
    params.get("error") === "session_missing"
      ? "Your session has expired. Please sign in again."
      : null,
  )
  const [loading, setLoading] = useState(false)

  function switchMode(next: AuthMode) {
    if (next === mode) return
    setMode(next)
    setError(null)
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(redirectTarget ?? "/dashboard")
    router.refresh()
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/verified`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Email confirmation on → no session yet; send them to the interstitial,
    // carrying the plan intent so it survives verification.
    if (!data.session) {
      const planQuery = plan ? `&plan=${encodeURIComponent(plan)}` : ""
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}${planQuery}`)
      return
    }

    router.push(
      redirectTarget ?? (wantsCheckout ? `/pricing?plan=${plan}` : "/dashboard"),
    )
    router.refresh()
  }

  const isSignup = mode === "signup"

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-70"
          >
            <BookOpen className="size-6" />
            <TomeWordmark
              showBeta
              className="text-xl font-[var(--font-display)] font-semibold tracking-tight"
            />
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            {isSignup
              ? "Start your journey through the classics"
              : "Sign in to continue your journey"}
          </p>
        </div>

        {/* Sign in / Sign up toggle */}
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            aria-pressed={!isSignup}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              !isSignup
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            aria-pressed={isSignup}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              isSignup
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Sign up
          </button>
        </div>

        <form
          onSubmit={isSignup ? handleSignUp : handleSignIn}
          className="space-y-4"
        >
          {isSignup && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={isSignup ? "Password (6+ characters)" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              minLength={isSignup ? 6 : undefined}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {!isSignup && (
            <div className="flex justify-end -mt-1">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Forgot your password?
              </Link>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? isSignup
                ? "Creating account..."
                : "Signing in..."
              : isSignup
                ? "Create account"
                : "Sign in"}
          </Button>
        </form>

        {/* Student entry — code-only, no email. Shown on the sign-in tab. */}
        {!isSignup && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Are you a student?{" "}
            <Link
              href="/student-login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Use your class code
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  )
}
