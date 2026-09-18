/**
 * test-teacher-quiz-grading.ts — the Phase 3 grading invariant guard.
 * Run: npx tsx scripts/test-teacher-quiz-grading.ts
 *
 * Exercises the single per-response decision (`resolveResponseGrade`) that
 * `submitQuizAttempt` routes every answer through. The headline assertion:
 * when the free-response grader THROWS (model error / unparseable JSON), the
 * result is PENDING — no score, no graded_at — never a graded zero.
 */
import assert from "node:assert/strict"
import {
  resolveResponseGrade,
  type FreeResponseGrader,
  type VirgilGrade,
} from "@/lib/teacher-quiz/objective"

let passed = 0
function check(label: string, cond: boolean) {
  assert.ok(cond, label)
  passed++
  console.log(`  ✓ ${label}`)
}

// A grader that always throws — stands in for a model outage / unparseable reply.
const throwingGrader: FreeResponseGrader = async () => {
  throw new Error("simulated model failure")
}

// A grader that returns a clean grade — stands in for a healthy Opus response.
const okGrader: FreeResponseGrader = async () =>
  ({
    score: 3,
    isCorrect: true,
    feedback: "Warm, specific feedback.",
    rubricBreakdown: [{ criterion: "Thesis", points: 3, note: "Clear." }],
    strengths: ["clarity"],
    improvements: [],
    truncated: false,
  }) satisfies VirgilGrade

const openQuestion = {
  questionType: "free_response",
  correctAnswer: null,
  options: null,
  questionText: "Explain Achilles' rage.",
  rubric: { max_points: 4 },
  referenceAnswer: null,
  maxPoints: 4,
  penalty: 0,
}

async function main() {
  console.log("\nGrader FAILURE never writes a zero (the headline invariant):")
  {
    const r = await resolveResponseGrade({
      ...openQuestion,
      rawAnswer: "A long, earnest essay about wrath.",
      grade: throwingGrader,
    })
    check("failed grade → gradedBy 'pending'", r.gradedBy === "pending")
    check("failed grade → score is null, NOT 0", r.score === null)
    check("failed grade → graded is false (no graded_at)", r.graded === false)
    check("failed grade → isCorrect null (no false verdict)", r.isCorrect === null)
    check("failed grade → no phantom ai_feedback", r.aiFeedback === null)
  }

  console.log("\nOpen-ended SUCCESS persists feedback + breakdown:")
  {
    const r = await resolveResponseGrade({
      ...openQuestion,
      rawAnswer: "An essay.",
      grade: okGrader,
    })
    check("success → gradedBy 'virgil'", r.gradedBy === "virgil")
    check("success → score is the model score", r.score === 3)
    check("success → graded true (stamps graded_at)", r.graded === true)
    check("success → carries non-empty feedback", !!r.aiFeedback)
    check("success → carries a rubric breakdown", Array.isArray(r.aiRubricBreakdown))
  }

  console.log("\nHint penalty is applied but never drives the score below zero:")
  {
    const r = await resolveResponseGrade({
      ...openQuestion,
      rawAnswer: "An essay.",
      penalty: 10,
      grade: okGrader,
    })
    check("success with heavy penalty → score clamped to 0", r.score === 0)
    check("penalized success still graded (not pending)", r.gradedBy === "virgil")
  }

  console.log("\ntf_with_reason is objective with a composite '<bool>|<reason>' key:")
  {
    const both = await resolveResponseGrade({
      questionType: "tf_with_reason",
      correctAnswer: "true|2",
      options: null,
      questionText: "True or false, and why?",
      rubric: null,
      referenceAnswer: null,
      maxPoints: 4,
      penalty: 0,
      rawAnswer: "true|2",
      grade: throwingGrader, // must never be called for objective
    })
    check("both parts match → auto, full points", both.gradedBy === "auto" && both.score === 4)

    const reasonWrong = await resolveResponseGrade({
      questionType: "tf_with_reason",
      correctAnswer: "true|2",
      options: null,
      questionText: "True or false, and why?",
      rubric: null,
      referenceAnswer: null,
      maxPoints: 4,
      penalty: 0,
      rawAnswer: "true|1",
      grade: throwingGrader,
    })
    check(
      "bool right, reason wrong → auto-graded (not full credit)",
      reasonWrong.gradedBy === "auto" && reasonWrong.isCorrect === false,
    )
  }

  console.log("\nshort_answer with meta.acceptedAnswers is objective (normalized match):")
  {
    const r = await resolveResponseGrade({
      questionType: "short_answer",
      correctAnswer: null,
      options: null,
      questionText: "Who leads the Greeks at Troy?",
      rubric: null,
      referenceAnswer: null,
      maxPoints: 2,
      penalty: 0,
      rawAnswer: "  AGAMEMNON. ",
      grade: throwingGrader, // must never be called for the objective form
      meta: { acceptedAnswers: ["Agamemnon", "King Agamemnon"] },
    })
    check(
      "accepted variant (case/punct/space) → auto, full points",
      r.gradedBy === "auto" && r.score === 2 && r.isCorrect === true,
    )
  }

  console.log("\nObjective auto-grade stays deterministic:")
  {
    const correct = await resolveResponseGrade({
      questionType: "multiple_choice",
      correctAnswer: "b",
      options: null,
      questionText: "Pick.",
      rubric: null,
      referenceAnswer: null,
      maxPoints: 1,
      penalty: 0,
      rawAnswer: "b",
      grade: throwingGrader, // must never be called for objective
    })
    check("correct MCQ → auto, full points", correct.gradedBy === "auto" && correct.score === 1)

    const wrong = await resolveResponseGrade({
      questionType: "multiple_choice",
      correctAnswer: "b",
      options: null,
      questionText: "Pick.",
      rubric: null,
      referenceAnswer: null,
      maxPoints: 1,
      penalty: 0,
      rawAnswer: "a",
      grade: throwingGrader,
    })
    check("wrong MCQ → auto, real (keyed) zero with graded_at", wrong.gradedBy === "auto" && wrong.score === 0 && wrong.graded === true)
  }

  console.log("\nObjective type with NO answer key → review, not a phantom zero:")
  {
    // This is the exact bug from evidence quiz cc29398a: an essay stored as a
    // keyless short_answer must not be auto-graded to 0.
    const r = await resolveResponseGrade({
      questionType: "short_answer",
      correctAnswer: null,
      options: null,
      questionText: "Discuss the theme.",
      rubric: null,
      referenceAnswer: null,
      maxPoints: 5,
      penalty: 0,
      rawAnswer: "A full paragraph of real analysis.",
      grade: throwingGrader,
    })
    check("keyless short_answer → pending (NOT a graded 0)", r.gradedBy === "pending" && r.score === null && r.graded === false)
  }

  console.log(`\n═══ ${passed} checks passed ═══\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
