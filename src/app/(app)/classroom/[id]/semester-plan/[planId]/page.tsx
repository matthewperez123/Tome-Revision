import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { hydratePlan } from "@/lib/semester-plan/persist"
import { PlanBoardView } from "@/components/semester-plan/plan-board-view"
import { EditablePlanBoard } from "@/components/semester-plan/plan-board-editor"

export default async function SemesterPlanBoardPage({
  params,
}: {
  params: Promise<{ id: string; planId: string }>
}) {
  const { id, planId } = await params
  const supabase = await createClient()
  const plan = await hydratePlan(supabase, planId)

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Plan not found</p>
        <Link href={`/classroom/${id}/semester-plan`} className="mt-2 text-sm text-[#D4A04C] hover:underline">
          Back to semester plans
        </Link>
      </div>
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  // The owning teacher edits a draft; everyone else gets the read-only syllabus.
  const canEdit = !!user && user.id === plan.teacher_id && plan.status === "draft"

  return (
    <div>
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <Link
          href={`/classroom/${id}/semester-plan`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Semester plans
        </Link>
      </div>
      {canEdit ? <EditablePlanBoard plan={plan} /> : <PlanBoardView plan={plan} />}
    </div>
  )
}
