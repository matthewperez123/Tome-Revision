import { Suspense } from "react"
import Link from "next/link"
import { AlertTriangle, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

const KNOWN_ERRORS: Record<string, string> = {
  auth_callback_failed:
    "We couldn't finish signing you in. The link may have expired — please try again.",
  session_missing:
    "Your session has expired. Please sign in again.",
  oauth_failed:
    "There was a problem signing you in with Google. Please try again.",
  default: "Something went wrong while signing you in. Please try again.",
}

interface AuthErrorPageProps {
  searchParams: Promise<{ code?: string; message?: string }>
}

async function ErrorContent({
  searchParams,
}: AuthErrorPageProps) {
  const { code, message } = await searchParams
  const display =
    message ||
    (code && KNOWN_ERRORS[code]) ||
    KNOWN_ERRORS.default

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-rose-600 text-white">
          <AlertTriangle className="size-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">Authentication error</h1>
        <p className="mt-2 text-sm text-muted-foreground">{display}</p>

        <div className="mt-8 flex flex-col gap-3">
          <Button render={<Link href="/login" />} className="w-full">
            Back to sign in
          </Button>
          <Button
            render={<Link href="/signup" />}
            variant="outline"
            className="w-full"
          >
            Create a new account
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

export default function AuthErrorPage(props: AuthErrorPageProps) {
  return (
    <Suspense fallback={null}>
      <ErrorContent {...props} />
    </Suspense>
  )
}
