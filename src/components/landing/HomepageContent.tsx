"use client"

import { useEffect, useRef } from "react"
import { useAudience } from "@/contexts/AudienceContext"

import { MergedReaderBlock } from "./MergedReaderBlock"
import { MergedVirgilBlock } from "./MergedVirgilBlock"
import { MergedTrialsBlock } from "./MergedTrialsBlock"
import { WorldMapSection } from "./WorldMapSection"
import { MergedLibraryTimelineBlock } from "./MergedLibraryTimelineBlock"
import { MergedSocialBlock } from "./MergedSocialBlock"
import { ReadingInsightsShowcase } from "./ReadingInsightsShowcase"
import { ReaderPricingSection } from "./ReaderPricingSection"
import { FinalCTA } from "./FinalCTA"

import { ClassRosterShowcase } from "./teacher/ClassRosterShowcase"
import { AssignmentBuilderShowcase } from "./teacher/AssignmentBuilderShowcase"
import { GradebookShowcase } from "./teacher/GradebookShowcase"
import { ClassProgressShowcase } from "./teacher/ClassProgressShowcase"
import { CoTeachersShowcase } from "./teacher/CoTeachersShowcase"
import { TeacherPricingSection } from "./TeacherPricingSection"
import { TeacherCTA } from "./teacher/TeacherCTA"

export function HomepageContent() {
  const { audience } = useAudience()
  const prevAudience = useRef(audience)

  useEffect(() => {
    if (prevAudience.current !== audience) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
      prevAudience.current = audience
    }
  }, [audience])

  if (audience === "teacher") {
    return (
      <>
        {/* 5 teacher feature blocks + pricing band */}
        <ClassRosterShowcase />
        <AssignmentBuilderShowcase />
        <GradebookShowcase />
        <ClassProgressShowcase />
        <CoTeachersShowcase />
        <TeacherPricingSection />
        <TeacherCTA />
      </>
    )
  }

  return (
    <>
      {/* 7 student feature blocks */}
      <MergedReaderBlock />
      <MergedVirgilBlock />
      <MergedTrialsBlock />
      <WorldMapSection />
      <MergedLibraryTimelineBlock />
      <MergedSocialBlock />
      <ReadingInsightsShowcase />

      {/* Student pricing band */}
      <ReaderPricingSection />
      <FinalCTA />
    </>
  )
}
