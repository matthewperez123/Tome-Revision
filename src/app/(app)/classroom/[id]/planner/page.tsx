import { TermPlanner } from "@/components/semester-plan/term-planner"

export default async function PlannerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <TermPlanner classroomId={id} />
}
