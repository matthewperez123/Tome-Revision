/**
 * Trial Type Registry — the single resolution point for the six question types.
 *
 * The quiz runner looks up `TRIAL_REGISTRY[type]` to get everything it needs:
 *   - component : the interactive body (mounted inside <QuestionCard>)  [Phase 3]
 *   - validate  : pure (content, response) -> boolean correctness check
 *   - schema    : zod schema validating the `content` payload on read
 *   - label     : human label for chips / authoring UI
 *   - icon      : lucide icon
 *
 * Adding a future type = add a variant in ./question-types, a validator in
 * ./validators, a body in src/components/trials/types, and ONE entry here.
 * Nothing else in the runner changes.
 */
import type { ComponentType } from "react"
import {
  Pilcrow,
  Search,
  BookMarked,
  ArrowRightLeft,
  Quote,
  Feather,
  type LucideIcon,
} from "lucide-react"
import type { z } from "zod"
import {
  TRIAL_QUESTION_TYPES,
  FillTheLineContentSchema,
  FindTheEvidenceContentSchema,
  WordInContextContentSchema,
  MatchPairsContentSchema,
  WhoSaidItContentSchema,
  RecitationContentSchema,
  type TrialQuestionType,
  type TrialContentFor,
  type TrialResponseFor,
} from "./question-types"
import {
  validateFillTheLine,
  validateFindTheEvidence,
  validateWordInContext,
  validateMatchPairs,
  validateWhoSaidIt,
  validateRecitation,
} from "./validators"
import { FillTheLineBody } from "@/components/trials/types/FillTheLineBody"
import { FindTheEvidenceBody } from "@/components/trials/types/FindTheEvidenceBody"
import { WordInContextBody } from "@/components/trials/types/WordInContextBody"
import { MatchPairsBody } from "@/components/trials/types/MatchPairsBody"
import { WhoSaidItBody } from "@/components/trials/types/WhoSaidItBody"
import { RecitationBody } from "@/components/trials/types/RecitationBody"

/** Props every type-body component receives from <QuestionCard> (Phase 2/3).
 *  The body owns only the interactive surface; chrome (prompt, Check/Continue
 *  button, feedback, explain reveal) lives in the shared card. */
export interface TrialBodyProps<T extends TrialQuestionType = TrialQuestionType> {
  content: TrialContentFor<T>
  /** Commit the user's response; the card runs it through `validate`. */
  onRespond: (response: TrialResponseFor<T>) => void
  /** True once the card has recorded the answer — show read-only feedback. */
  answered: boolean
  /** The response the user submitted (for post-answer display). */
  response: TrialResponseFor<T> | null
  /** Whether the recorded answer was correct. */
  isCorrect: boolean
  reduced: boolean
}

/** One registry entry. Content/response are erased to `unknown` at the registry
 *  boundary; the per-type functions below remain strongly typed at definition. */
export interface TrialTypeEntry {
  label: string
  icon: LucideIcon
  schema: z.ZodType
  validate: (content: unknown, response: unknown) => boolean
  /** The interactive body component, mounted inside <QuestionCard>. */
  component: ComponentType<TrialBodyProps> | null
}

export const TRIAL_REGISTRY: Record<TrialQuestionType, TrialTypeEntry> = {
  fill_the_line: {
    label: "Fill the Line",
    icon: Pilcrow,
    schema: FillTheLineContentSchema,
    validate: (c, r) => validateFillTheLine(c as never, r as never),
    component: FillTheLineBody as ComponentType<TrialBodyProps>,
  },
  find_the_evidence: {
    label: "Find the Evidence",
    icon: Search,
    schema: FindTheEvidenceContentSchema,
    validate: (c, r) => validateFindTheEvidence(c as never, r as never),
    component: FindTheEvidenceBody as ComponentType<TrialBodyProps>,
  },
  word_in_context: {
    label: "Word in Context",
    icon: BookMarked,
    schema: WordInContextContentSchema,
    validate: (c, r) => validateWordInContext(c as never, r as never),
    component: WordInContextBody as ComponentType<TrialBodyProps>,
  },
  match_pairs: {
    label: "Match the Pairs",
    icon: ArrowRightLeft,
    schema: MatchPairsContentSchema,
    validate: (c, r) => validateMatchPairs(c as never, r as never),
    component: MatchPairsBody as ComponentType<TrialBodyProps>,
  },
  who_said_it: {
    label: "Who Said It?",
    icon: Quote,
    schema: WhoSaidItContentSchema,
    validate: (c, r) => validateWhoSaidIt(c as never, r as never),
    component: WhoSaidItBody as ComponentType<TrialBodyProps>,
  },
  recitation: {
    label: "Recitation",
    icon: Feather,
    schema: RecitationContentSchema,
    validate: (c, r) => validateRecitation(c as never, r as never),
    component: RecitationBody as ComponentType<TrialBodyProps>,
  },
}

/** Convenience: list of all registered types (stable order). */
export const REGISTERED_TRIAL_TYPES = TRIAL_QUESTION_TYPES
