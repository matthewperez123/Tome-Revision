// Legacy scoped-assignment reader. The general reader (/read/[bookId]) is the
// only reader now — old links land here and are forwarded into it with full
// assignment context (?ch=&classroom=&assignment=).

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { assignmentDetailHref, assignmentReaderHref } from "@/lib/assignments/links"

export default async function ScopedAssignmentReaderRedirect({
  params,
}: {
  params: Promise<{ id: string; assignmentId: string }>
}) {
  const { id: classroomId, assignmentId } = await params

  const supabase = await createClient()
  // RLS scopes this select to classroom members — a non-member gets null.
  const { data: assignment } = await supabase
    .from("assignments")
    .select("id, classroom_id, book_id, chapter_range_start")
    .eq("id", assignmentId)
    .maybeSingle<{
      id: string
      classroom_id: string
      book_id: string | null
      chapter_range_start: number | null
    }>()

  if (!assignment) redirect(assignmentDetailHref(classroomId, assignmentId))
  redirect(assignmentReaderHref(assignment))
}
