"use client"

import { useEffect, useRef } from "react"
import { useAudience } from "@/contexts/AudienceContext"

import { CarouselSection } from "./CarouselSection"
import { ReaderSection } from "./ReaderSection"
import { VerseFormattingShowcase } from "./VerseFormattingShowcase"
import { PlaysFormattingShowcase } from "./PlaysFormattingShowcase"
import { MiddleEnglishGlossesShowcase } from "./MiddleEnglishGlossesShowcase"
import { AnnotationShowcase } from "./AnnotationShowcase"
import { PersonalAnnotationsShowcase } from "./PersonalAnnotationsShowcase"
import { TrialsShowcase } from "./TrialsShowcase"
import { GamificationSection } from "./GamificationSection"
import { LibraryShowcase } from "./LibraryShowcase"
import { WorldMapSection } from "./WorldMapSection"
import { TimelinesShowcase } from "./TimelinesShowcase"
import { AuthorShowcase } from "./AuthorShowcase"
import { BookClubsShowcase } from "./BookClubsShowcase"
import { FriendsProfilesShowcase } from "./FriendsProfilesShowcase"
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
import { GuidedLearningShowcase } from "./teacher/GuidedLearningShowcase"
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
        <GuidedLearningShowcase />
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
        <TimelinesShowcase audience="teacher" />
        <AuthorShowcase audience="teacher" />
        <TeacherPricingSection />
        <TeacherCTA />
      </>
    )
  }

  return (
    <>
      <CarouselSection />
      <ReaderSection />
      <VerseFormattingShowcase />
      <PlaysFormattingShowcase />
      <MiddleEnglishGlossesShowcase />
      <AnnotationShowcase />
      <PersonalAnnotationsShowcase />
      <GamificationSection />
      <TrialsShowcase />
      <WorldMapSection />
      <LibraryShowcase />
      <TimelinesShowcase />
      <AuthorShowcase />
      <BookClubsShowcase />
      <FriendsProfilesShowcase />
      <SearchShowcase />
      <ReadingInsightsShowcase />
      <ReaderPricingSection />
      <FinalCTA />
    </>
  )
}
