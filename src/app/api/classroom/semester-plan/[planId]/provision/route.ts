import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { loadOwnedPlan } from "@/lib/semester-plan/mutations"
import { createAssignment } from "@/lib/actions/assignments"

/** Plan item types that map cleanly onto a classroom assignment. */
const ASSIGNABLE = new Set(["reading", "essay", "discussion"])

const bodySchema = z.object({ itemId: z.string().uuid() })

/**
 * POST /api/classroom/semester-plan/[planId]/provision
 *
 * Teacher-only bridge from a planned item to a real classroom assignment. The
 * item must belong to a draft plan the caller owns, the plan must be attached
 * to a class, and the item type must be assignable (reading / essay /
 * discussion). Creates the assignment as a DRAFT (never auto-published) and
 * back-links it to the item (assignment_id + status='provisioned'), so a plan
 * item is turned into coursework exactly once.
 */
export async function POST(request: Request, { params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const plan = await loadOwnedPlan(supabase, planId, user.id)
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 })
  if (!plan.class_id) {
    return NextResponse.json(
      { error: "Attach this plan to a class before creating assignments from it." },
      { status: 409 },
    )
  }

  const parsed = bodySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  // Load the item and confirm it belongs to a week of THIS plan (guards
  // cross-plan provisioning). RLS already scopes the read to the owner.
  const { data: itemRow } = await supabase
    .from("semester_plan_items")
    .select(
      "id, type, book_id, chapter_refs, title, description, due_date, assignment_id, semester_plan_weeks!inner(plan_id)",
    )
    .eq("id", parsed.data.itemId)
    .single()
  const item = itemRow as
    | {
        id: string
        type: string
        book_id: string | null
        chapter_refs: number[] | null
        title: string
        description: string | null
        due_date: string | null
        assignment_id: string | null
        semester_plan_weeks: { plan_id: string }
      }
    | null
  if (!item || item.semester_plan_weeks.plan_id !== planId) {
    return NextResponse.json({ error: "Item not in plan" }, { status: 404 })
  }

  if (item.assignment_id) {
    return NextResponse.json(
      { error: "This item already has an assignment.", assignmentId: item.assignment_id },
      { status: 409 },
    )
  }

  if (!ASSIGNABLE.has(item.type)) {
    return NextResponse.json(
      { error: `A ${item.type} item can't be turned into an assignment.` },
      { status: 422 },
    )
  }
  if (item.type === "reading" && !item.book_id) {
    return NextResponse.json(
      { error: "Attach a book to this reading before creating an assignment." },
      { status: 422 },
    )
  }

  const refs = item.chapter_refs ?? []
  const dueAt = item.due_date ? `${item.due_date}T23:59:59.000Z` : undefined

  const created = await createAssignment({
    classroomId: plan.class_id,
    title: item.title,
    description: item.description ?? undefined,
    type: item.type as "reading" | "essay" | "discussion",
    bookId: item.type === "reading" ? item.book_id ?? undefined : undefined,
    chapterRangeStart: refs.length ? Math.min(...refs) : undefined,
    chapterRangeEnd: refs.length ? Math.max(...refs) : undefined,
    discussionPrompt: item.type === "discussion" ? item.description ?? item.title : undefined,
    essayPrompt: item.type === "essay" ? item.description ?? item.title : undefined,
    dueAt,
    scope: "classroom",
  })
  if (!created.ok) {
    return NextResponse.json({ error: created.error }, { status: 400 })
  }

  const { error: linkErr } = await supabase
    .from("semester_plan_items")
    .update({ assignment_id: created.data.id, status: "provisioned" })
    .eq("id", item.id)
  if (linkErr) {
    return NextResponse.json({ error: linkErr.message }, { status: 500 })
  }

  return NextResponse.json({
    assignmentId: created.data.id,
    classroomId: plan.class_id,
  })
}
