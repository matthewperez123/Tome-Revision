import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { canUserReadBook } from "@/lib/entitlements/server"

/**
 * Server-side paywall for the reader. This is the authoritative gate: a free
 * account that asks for a book outside the foundational sampler is redirected
 * to /pricing before the (client) reader page ever renders. The reader page's
 * own `<PaywallGate>` remains for guests and as defense-in-depth, but the UI is
 * no longer the only thing standing between a free user and a paid book.
 *
 * Guests (no session) are left to the client gate / middleware — the money case
 * is a signed-in free account, which we resolve from the canonical subscription.
 */
export default async function ReadLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ bookId: string }>
}) {
  const { bookId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user && !(await canUserReadBook(user.id, bookId))) {
    redirect(`/pricing?gate=book&book=${encodeURIComponent(bookId)}`)
  }

  return <>{children}</>
}
