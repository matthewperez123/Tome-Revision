import { Liveblocks } from "@liveblocks/node"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Secure Liveblocks auth endpoint.
 *
 * The browser never sees the Liveblocks secret — the client posts here, we
 * verify the Supabase session server-side, mint a session scoped to reader
 * rooms with READ-only (presence) access, and hand back the signed token.
 *
 * Access model: `reader:*` with READ_ACCESS = read + presence:write only.
 * Co-readers can broadcast/observe presence but cannot mutate shared storage,
 * which is all live reader presence needs.
 */
export async function POST() {
  // Construct lazily inside the handler: the Liveblocks constructor validates
  // the secret eagerly, so a module-level instance throws during `next build`
  // page-data collection when LIVEBLOCKS_SECRET_KEY is absent (e.g. on Vercel).
  if (!process.env.LIVEBLOCKS_SECRET_KEY) {
    return new NextResponse("Liveblocks not configured", { status: 501 })
  }

  const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY,
  })

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle()

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: profile?.display_name ?? "Reader",
      avatar: profile?.avatar_url ?? undefined,
    },
  })
  session.allow("reader:*", session.READ_ACCESS)

  const { status, body } = await session.authorize()
  return new NextResponse(body, { status })
}
