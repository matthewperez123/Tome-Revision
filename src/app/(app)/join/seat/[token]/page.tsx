import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SeatInviteAccept } from "@/components/school/seat-invite-accept"

export const dynamic = "force-dynamic"

/**
 * School seat invitation acceptance: /join/seat/[token]
 * Requires a signed-in account; the accept action claims the pending seat and
 * grants the teacher role. The token is validated server-side in the action.
 */
export default async function SeatInvitePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/join/seat/${token}`)}`)
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-24">
      <SeatInviteAccept token={token} />
    </main>
  )
}
