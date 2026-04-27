"use server"

/**
 * gradeReflection — PLACEHOLDER server action.
 *
 * In production this should call Claude (model `claude-sonnet-4-5`) with the
 * question's rubric + expected_themes and parse a JSON `{ score, feedback }`
 * response. For now it simulates a brief grading delay and returns a
 * deterministic stub so the Trial UI can be exercised end-to-end without
 * any external dependency.
 *
 * TODO(reflection-grader): replace with a real Anthropic SDK call.
 *  - import { anthropic } from "@/lib/anthropic/client"
 *  - system prompt as specified in the Trial brief (Phase 3, Type 7)
 *  - response_format: JSON
 *  - on parse error → return { score: 0, feedback: "...", status: "failed" }
 */

export interface GradeReflectionInput {
  questionId: string
  attemptId: string
  response: string
  rubric?: string
  expectedThemes?: string[]
  /** word_min from the question payload — used by the placeholder heuristic. */
  wordMin?: number
}

export interface GradeReflectionResult {
  questionId: string
  /** 0–10 inclusive. */
  score: number
  feedback: string
  /** "graded" on success, "failed" if the (real) API call errored. */
  status: "graded" | "failed"
  /** True for placeholder responses; remove when wired to Anthropic. */
  placeholder: boolean
}

const PLACEHOLDER_FEEDBACKS: Record<"strong" | "solid" | "thin", string[]> = {
  strong: [
    "A careful reading. You weighed the text on its own terms before reaching for a verdict — that restraint is what scholarship looks like.",
    "Your reasoning earns the conclusion it arrives at. Notice how the evidence shaped your judgement rather than the other way round.",
  ],
  solid: [
    "A solid response. The next pass might press harder on which words in the passage actually carry your reading.",
    "You have the shape of an argument here. Sharpen it by quoting more precisely and following one strand to the bottom.",
  ],
  thin: [
    "There is more in the passage than you have drawn out yet. Read it again and ask what surprises or resists you.",
    "Begin from the line that struck you most and work outward. Specifics will give your reading its weight.",
  ],
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Placeholder grading heuristic — purely word-count + theme-keyword based. */
function fakeGrade(
  response: string,
  expectedThemes: string[] = [],
  wordMin = 30
): { score: number; feedback: string } {
  const words = response.trim().split(/\s+/).filter(Boolean)
  const wc = words.length

  // Engagement (3): meets / approaches / under word_min
  const engagement = wc >= wordMin * 1.5 ? 3 : wc >= wordMin ? 2 : 1

  // Reasoning (3): basic prose-quality proxy — sentence count + connector words
  const sentences = response.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const connectors = (response.match(/\b(because|so that|whereas|although|therefore|yet|while|since)\b/gi) ?? []).length
  const reasoning = Math.min(3, Math.max(1, Math.round((sentences.length + connectors) / 3)))

  // Evidence (2): does it quote or reference specifics?
  const quotes = (response.match(/["']([^"']{6,})["']/g) ?? []).length
  const evidence = Math.min(2, quotes >= 2 ? 2 : quotes >= 1 ? 1 : 0)

  // Originality (2): theme-keyword hits as a crude proxy
  const lc = response.toLowerCase()
  const themeHits = expectedThemes.filter((t) => lc.includes(t.toLowerCase())).length
  const originality = Math.min(2, themeHits >= 2 ? 2 : themeHits >= 1 ? 1 : 0)

  const score = Math.min(10, engagement + reasoning + evidence + originality)
  const band = score >= 8 ? "strong" : score >= 5 ? "solid" : "thin"

  return { score, feedback: pick(PLACEHOLDER_FEEDBACKS[band]) }
}

export async function gradeReflection(
  input: GradeReflectionInput
): Promise<GradeReflectionResult> {
  // Simulate Virgil reading time (kept short for UX — real call would be longer).
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 600))

  const { score, feedback } = fakeGrade(
    input.response,
    input.expectedThemes ?? [],
    input.wordMin ?? 30
  )

  return {
    questionId: input.questionId,
    score,
    feedback,
    status: "graded",
    placeholder: true,
  }
}
