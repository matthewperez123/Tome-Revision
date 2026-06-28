import { SemesterPlanWizard } from "@/components/semester-plan/setup-wizard"

export default async function NewSemesterPlanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <SemesterPlanWizard classId={id} />
}
