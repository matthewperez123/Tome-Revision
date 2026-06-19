"use client"

import { useEffect, useRef } from "react"
import { useAudience } from "@/contexts/AudienceContext"

import { ReaderFormDemo } from "./demo/ReaderFormDemo"
import { VirgilDrawerDemo } from "./demo/VirgilDrawerDemo"
import { TrialDemo } from "./demo/TrialDemo"
import { WorldMapSection } from "./WorldMapSection"
import { LibraryControlsDemo } from "./demo/LibraryControlsDemo"
import { TrendingBooksShowcase, RecommendationsShowcase } from "./ReaderDiscoveryShowcase"
import { MergedSocialBlock } from "./MergedSocialBlock"
import { ReadingInsightsShowcase } from "./ReadingInsightsShowcase"
import { ReaderPricingSection } from "./ReaderPricingSection"
import { FinalCTA } from "./FinalCTA"

import { ClassRosterShowcase } from "./teacher/ClassRosterShowcase"
import { AssignmentBuilderDemo } from "./demo/AssignmentBuilderDemo"
import { CustomTrialsShowcase } from "./teacher/CustomTrialsShowcase"
import { GradebookDemo } from "./demo/GradebookDemo"
import { ClassProgressDemo } from "./demo/ClassProgressDemo"
import { ParentDirectoryShowcase } from "./teacher/ParentDirectoryShowcase"
import { SemesterPlanShowcase } from "./teacher/SemesterPlanShowcase"
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
        {/* Teacher feature blocks: roster → assign → quiz builder → grading →
            progress → parent directory → curriculum → co-teachers → pricing */}
        <ClassRosterShowcase />
        <AssignmentBuilderDemo />
        <CustomTrialsShowcase />
        <div id="gradebook" className="scroll-mt-20">
          <GradebookDemo />
        </div>
        <ClassProgressDemo />
        <div id="parent-directory" className="scroll-mt-20">
          <ParentDirectoryShowcase />
        </div>
        <div id="curriculum" className="scroll-mt-20">
          <SemesterPlanShowcase />
        </div>
        <CoTeachersShowcase />
        <TeacherPricingSection />
        <TeacherCTA />
      </>
    )
  }

  return (
    <>
      {/* Student feature blocks */}
      <ReaderFormDemo />
      <VirgilDrawerDemo />
      <TrialDemo />
      <WorldMapSection />
      <LibraryControlsDemo />
      <TrendingBooksShowcase />
      <RecommendationsShowcase />
      <MergedSocialBlock />
      <ReadingInsightsShowcase />

      {/* Student pricing band */}
      <ReaderPricingSection />
      <FinalCTA />
    </>
  )
}
