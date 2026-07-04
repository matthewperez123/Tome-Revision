import { AppShell } from "@/components/tome/app-shell"
import { getCurrentProfile } from "@/lib/auth"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Resolve the account role server-side so the authenticated tree renders with
  // the authoritative DB role from first paint — no client-side role guessing
  // that flips on hydration or auth events.
  const profile = await getCurrentProfile()
  return (
    <AppShell initialProfile={profile} initialUserId={profile?.id ?? null}>
      {children}
    </AppShell>
  )
}
