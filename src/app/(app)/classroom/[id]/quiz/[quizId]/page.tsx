"use client"

import { use } from "react"
import { QuizAttemptRunner } from "@/components/classroom/quiz-attempt-runner"

export default function QuizTakePage({
  params,
}: {
  params: Promise<{ id: string; quizId: string }>
}) {
  const { id: classroomId, quizId } = use(params)
  return (
    <QuizAttemptRunner
      quizId={quizId}
      classroomId={classroomId}
      backHref={`/classroom/${classroomId}`}
    />
  )
}
