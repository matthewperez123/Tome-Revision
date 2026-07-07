import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { JoinPoster } from "@/components/classroom/join-poster"

/**
 * Printable join-poster route. Staff-gated: only the classroom's owner or
 * co-teacher may open it, verified through the canonical
 * `user_has_classroom_role` RPC (never a raw classroom_members read). Loads the
 * class name + join code and hands them to the client poster, which renders the
 * QR locally.
 */
export default async function JoinPosterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: allowed } = await supabase.rpc("user_has_classroom_role", {
    p_user_id: user.id,
    p_classroom_id: id,
    p_roles: ["owner", "co_teacher"],
  })
  if (!allowed) notFound()

  const { data: classroom } = await supabase
    .from("classrooms")
    .select("name, join_code")
    .eq("id", id)
    .maybeSingle()
  if (!classroom) notFound()

  return <JoinPoster className={classroom.name} joinCode={classroom.join_code} />
}
