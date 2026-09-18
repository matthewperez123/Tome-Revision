import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { assignmentReaderHref } from "@/lib/assignments/links"

// Legacy route (1.8): nothing links here anymore — every surface builds links
// via src/lib/assignments/links.ts — but old bookmarks/notifications may still
// carry /assignments/{id}. Resolve the real row (RLS-scoped) and forward to
// the canonical destination: the general reader for book-backed assignments,
// else the classroom assignment detail page.
export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: a } = await supabase
    .from("assignments")
    .select("id, classroom_id, book_id, chapter_range_start")
    .eq("id", id)
    .maybeSingle<{
      id: string
      classroom_id: string
      book_id: string | null
      chapter_range_start: number | null
    }>()

  if (!a) notFound()
  redirect(assignmentReaderHref(a))
}
