"use client"

import { useEffect, useRef } from "react"
import { useAudience } from "@/contexts/AudienceContext"

import { CarouselSection } from "./CarouselSection"
import { ReaderSection } from "./ReaderSection"
import { GamificationSection } from "./GamificationSection"
import { WorldMapSection } from "./WorldMapSection"
import { AnnotationShowcase } from "./AnnotationShowcase"
import { TrialsShowcase } from "./TrialsShowcase"
import { LibraryShowcase } from "./LibraryShowcase"
import { TimelinesShowcase } from "./TimelinesShowcase"
import { AuthorShowcase } from "./AuthorShowcase"
import { BookClubsShowcase } from "./BookClubsShowcase"
import { SearchShowcase } from "./SearchShowcase"
import { ReadingInsightsShowcase } from "./ReadingInsightsShowcase"
import { ReaderPricingSection } from "./ReaderPricingSection"
import { FinalCTA } from "./FinalCTA"

import { ClassRosterShowcase } from "./teacher/ClassRosterShowcase"
import { AssignmentBuilderShowcase } from "./teacher/AssignmentBuilderShowcase"
import { CustomTrialsShowcase } from "./teacher/CustomTrialsShowcase"
import { GradebookShowcase } from "./teacher/GradebookShowcase"
import { StudentDashboardShowcase } from "./teacher/StudentDashboardShowcase"
import { DiscussionThreadsShowcase } from "./teacher/DiscussionThreadsShowcase"
import { StandardsAlignmentShowcase } from "./teacher/StandardsAlignmentShowcase"
import { RosterImportShowcase } from "./teacher/RosterImportShowcase"
import { SemesterPlanShowcase } from "./teacher/SemesterPlanShowcase"
import { StudentProfileShowcase } from "./teacher/StudentProfileShowcase"
import { EssayGradingShowcase } from "./teacher/EssayGradingShowcase"
import { ParentsShowcase } from "./teacher/ParentsShowcase"
import { StudyGroupsShowcase } from "./teacher/StudyGroupsShowcase"
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
        <ClassRosterShowcase />
        <AssignmentBuilderShowcase />
        <CustomTrialsShowcase />
        <GradebookShowcase />
        <StudentDashboardShowcase />
        <DiscussionThreadsShowcase />
        <StandardsAlignmentShowcase />
        <RosterImportShowcase />
        <SemesterPlanShowcase />
        <StudentProfileShowcase />
        <EssayGradingShowcase />
        <ParentsShowcase />
        <StudyGroupsShowcase />
        <TeacherPricingSection />
        <TeacherCTA />
      </>
    )
  }

  return (
    <>
      <CarouselSection />
      <ReaderSection />
      <AnnotationShowcase />
      <TrialsShowcase />
      <GamificationSection />
      <LibraryShowcase />
      <WorldMapSection />
      <TimelinesShowcase />
      <AuthorShowcase />
      <BookClubsShowcase />
      <SearchShowcase />
      <ReadingInsightsShowcase />
      <ReaderPricingSection />
      <FinalCTA />
    </>
  )
}
