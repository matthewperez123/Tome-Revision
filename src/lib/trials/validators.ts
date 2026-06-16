/**
 * Trial validators — pure correctness checks, one per question type.
 *
 * `validate(content, response)` returns whether the user's response is correct.
 * Kept framework-free so the registry, the quiz engine, and server-side
 * scoring can all share the exact same rule. No React, no DOM.
 */
import {
  normalizeText,
  type FillTheLineContent,
  type FindTheEvidenceContent,
  type WordInContextContent,
  type MatchPairsContent,
  type WhoSaidItContent,
  type RecitationContent,
  type TrialResponse,
} from "./question-types"

export function validateFillTheLine(
  content: FillTheLineContent,
  response: TrialResponse["fill_the_line"]
): boolean {
  const given = response.answers
  if (given.length !== content.blanks.length) return false
  return content.blanks.every(
    (blank, i) => normalizeText(given[i] ?? "") === normalizeText(blank.answer)
  )
}

export function validateFindTheEvidence(
  content: FindTheEvidenceContent,
  response: TrialResponse["find_the_evidence"]
): boolean {
  const [cs, ce] = content.correctRange
  const [rs, re] = response.range
  // Correct if the user's selected range overlaps the evidence range at all.
  return Math.max(cs, rs) <= Math.min(ce, re)
}

export function validateWordInContext(
  content: WordInContextContent,
  response: TrialResponse["word_in_context"]
): boolean {
  return content.choices[response.choiceIndex]?.correct === true
}

export function validateMatchPairs(
  content: MatchPairsContent,
  response: TrialResponse["match_pairs"]
): boolean {
  if (content.pairs.length === 0) return false
  return content.pairs.every(
    (p) => normalizeText(response.pairs[p.left] ?? "") === normalizeText(p.right)
  )
}

export function validateWhoSaidIt(
  content: WhoSaidItContent,
  response: TrialResponse["who_said_it"]
): boolean {
  return content.choices[response.choiceIndex]?.correct === true
}

export function validateRecitation(
  content: RecitationContent,
  response: TrialResponse["recitation"]
): boolean {
  // Fuzzy normalized match of the typed recall against the full passage.
  // (Each round shows fewer words; the user always produces the whole line.)
  const target = normalizeText(content.tokens.join(" "))
  const given = normalizeText(response.text)
  return given === target
}
