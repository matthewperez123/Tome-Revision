"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { BookOpen, Mail, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

function VerifyEmailContent() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()
  const email = params.get("email") ?? ""
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  )
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Edge case: if a user lands here while already verified, send them in.
  useEffect(() => {
    let cancelled = false
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (cancelled) return
      if (user?.email_confirmed_at) {
        router.replace("/auth/verified")
      }
    })
    return () => {
      cancelled = true
    }
  }, [router, supabase])

  async function handleResend() {
    if (!email) return
    setStatus("sending")
    setErrorMsg(null)
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/verified`,
      },
    })
    if (error) {
      setStatus("error")
      setErrorMsg(error.message)
      return
    }
    setStatus("sent")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm text-center"
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Mail className="size-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">Check your inbox</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {email ? (
            <>
              We sent a verification link to{" "}
              <span className="font-medium text-foreground">{email}</span>.
            </>
          ) : (
            <>We sent you a verification link.</>
          )}{" "}
          Click it to begin reading.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {email && (
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={status === "sending"}
            >
              {status === "sending"
                ? "Sending…"
                : status === "sent"
                  ? "Sent — check your inbox"
                  : "Resend email"}
            </Button>
          )}

          {status === "sent" && (
            <p className="flex items-center justify-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle2 className="size-4" />
              A new link is on its way.
            </p>
          )}
          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

          <p className="text-xs text-muted-foreground">
            Wrong email?{" "}
            <Link
              href="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Start over
            </Link>
          </p>
        </div>

        <p className="mt-10 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/60">
          <BookOpen className="size-3" />
          Tome
        </p>
      </motion.div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  )
}
