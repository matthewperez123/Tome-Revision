import Link from "next/link"

export default function DemoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center max-w-sm">
        <h1 className="font-[var(--font-display)] text-3xl font-bold text-foreground mb-3">
          Coming soon
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          We&apos;re building the demo booking experience. In the meantime,
          reach out to us directly.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 rounded-full border border-border bg-card text-foreground text-sm font-semibold hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:border-indigo-400/40 transition-all duration-200"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
