import Link from "next/link"
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GoodbyePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted">
          <BookOpen className="size-6 text-muted-foreground" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">We&apos;re sorry to see you go.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your account and all associated data have been permanently deleted.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          The canon will be here whenever you choose to return.
        </p>

        <Button render={<Link href="/" />} className="mt-8 w-full">
          Back to Tome
        </Button>
      </div>
    </div>
  )
}
