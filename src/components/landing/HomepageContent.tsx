"use client"

import { useEffect, useRef } from "react"
import { useAudience } from "@/contexts/AudienceContext"

import { CarouselSection } from "./CarouselSection"
import { FeatureGrid } from "./FeatureGrid"
import { ReaderSection } from "./ReaderSection"
import { QuizSection } from "./QuizSection"
import { GamificationSection } from "./GamificationSection"
import { WorldMapSection } from "./WorldMapSection"
import { ClassroomSection } from "./ClassroomSection"
import { VirgilSection } from "./VirgilSection"
import { AnnotationShowcase } from "./AnnotationShowcase"
import { TrialsShowcase } from "./TrialsShowcase"
import { SealsShowcase } from "./SealsShowcase"
import { LibraryShowcase } from "./LibraryShowcase"
import { FinalCTA } from "./FinalCTA"

import { ClassRosterShowcase } from "./teacher/ClassRosterShowcase"
import { AssignmentBuilderShowcase } from "./teacher/AssignmentBuilderShowcase"
import { CustomTrialsShowcase } from "./teacher/CustomTrialsShowcase"
import { GradebookShowcase } from "./teacher/GradebookShowcase"
import { StudentDashboardShowcase } from "./teacher/StudentDashboardShowcase"
import { DiscussionThreadsShowcase } from "./teacher/DiscussionThreadsShowcase"
import { StandardsAlignmentShowcase } from "./teacher/StandardsAlignmentShowcase"
import { RosterImportShowcase } from "./teacher/RosterImportShowcase"
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
        <TeacherCTA />
      </>
    )
  }

  return (
    <>
      <CarouselSection />
      <FeatureGrid />
      <ReaderSection />
      <QuizSection />
      <GamificationSection />
      <WorldMapSection />
      <ClassroomSection />
      <VirgilSection />
      <AnnotationShowcase />
      <TrialsShowcase />
      <SealsShowcase />
      <LibraryShowcase />
      <FinalCTA />
    </>
  )
}
