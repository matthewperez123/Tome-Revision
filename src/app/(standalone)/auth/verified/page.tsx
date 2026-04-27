import Link from "next/link"
import { redirect } from "next/navigation"
import { CheckCircle2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { sendWelcomeEmailIfNeeded } from "@/lib/email/welcome"

export const dynamic = "force-dynamic"

export default async function VerifiedPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // No session — they probably bounced here from a stale link.
    redirect("/login?error=session_missing")
  }

  // Best-effort welcome send. Failure is logged but doesn't block the page.
  await sendWelcomeEmailIfNeeded(user.id)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <CheckCircle2 className="size-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">You&apos;re in.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome to Tome. Three thousand years of literature, ready when you
          are.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Button render={<Link href="/library" />} className="w-full">
            Open my library
          </Button>
          <Button
            variant="outline"
            render={<Link href="/onboarding" />}
            className="w-full"
          >
            Set up my profile
          </Button>
        </div>

        <p className="mt-10 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/60">
          <BookOpen className="size-3" />
          Tome
        </p>
      </div>
    </div>
  )
}
