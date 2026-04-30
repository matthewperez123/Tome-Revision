"use client"

import type { FC } from "react"
import {
  ListChecks,
  CheckSquare,
  Pilcrow,
  Quote,
  ListOrdered,
  ArrowRightLeft,
  Lightbulb,
  Link2,
  BookMarked,
  ScanLine,
  Feather,
  Search,
  Scale,
} from "lucide-react"
import type { QuestionType } from "@/lib/quiz-engine"
import { MultipleChoice } from "./MultipleChoice"
import { TrueFalse } from "./TrueFalse"
import { FillBlank } from "./FillBlank"
import { PassageIdentification } from "./PassageIdentification"
import { ThemeAnalysis } from "./ThemeAnalysis"
import { Ordering } from "./Ordering"
import { Matching } from "./Matching"
import { VocabularyInContext } from "./VocabularyInContext"
import { CrossReference } from "./CrossReference"
import { CloseReading } from "./CloseReading"
import { Reflection } from "./Reflection"
import { Identification } from "./Identification"
import { TrueFalseReason } from "./TrueFalseReason"
import type { QuestionRendererProps } from "./shared"

export const QUESTION_RENDERERS: Record<
  QuestionType,
  FC<QuestionRendererProps>
> = {
  multiple_choice: MultipleChoice,
  true_false: TrueFalse,
  fill_blank: FillBlank,
  passage_id: PassageIdentification,
  theme_analysis: ThemeAnalysis,
  ordering: Ordering,
  matching: Matching,
  vocabulary_in_context: VocabularyInContext,
  cross_reference: CrossReference,
  close_reading: CloseReading,
  reflection: Reflection,
  identification: Identification,
  tf_with_reason: TrueFalseReason,
}

export const QUESTION_TYPE_ICONS: Record<
  QuestionType,
  FC<{ className?: string }>
> = {
  multiple_choice: ListChecks,
  true_false: CheckSquare,
  fill_blank: Pilcrow,
  passage_id: Quote,
  theme_analysis: Lightbulb,
  ordering: ListOrdered,
  matching: ArrowRightLeft,
  vocabulary_in_context: BookMarked,
  cross_reference: Link2,
  close_reading: ScanLine,
  reflection: Feather,
  identification: Search,
  tf_with_reason: Scale,
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: "Multiple Choice",
  true_false: "True or False",
  fill_blank: "Fill in the Blank",
  passage_id: "Passage Identification",
  theme_analysis: "Theme Analysis",
  ordering: "Chronological Order",
  matching: "Matching",
  vocabulary_in_context: "Vocabulary in Context",
  cross_reference: "Cross-Reference",
  close_reading: "Close Reading",
  reflection: "Reflection",
  identification: "Identification",
  tf_with_reason: "True/False with Reason",
}
