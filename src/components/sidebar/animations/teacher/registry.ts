import type { AnimatedIconComponent } from "../types"
import { sharedIconRegistry } from "../shared/registry"

// Nav-mapped teacher icons (match sidebar nav labels)
import ClassroomsIcon from "./ClassroomsIcon"
import ParentsIcon from "./ParentsIcon"
import QuizBuilderIcon from "./QuizBuilderIcon"
import GradingIcon from "./GradingIcon"
import GuidedSessionsIcon from "./GuidedSessionsIcon"

// Conceptual teacher icons ("The Scholar's Desk")
import ClassroomIcon from "./ClassroomIcon"
import AssignmentsIcon from "./AssignmentsIcon"
import CurriculumIcon from "./CurriculumIcon"
import RosterIcon from "./RosterIcon"
import GradingInkIcon from "./GradingInkIcon"
import AnalyticsIcon from "./AnalyticsIcon"
import DiscussionsIcon from "./DiscussionsIcon"
import CurationIcon from "./CurationIcon"
import SettingsIcon from "./SettingsIcon"

// Nav-mapped icons (active in sidebar)
const teacherNavIcons: Record<string, AnimatedIconComponent> = {
  "My Classrooms": ClassroomsIcon,
  Parents: ParentsIcon,
  "Quiz Builder": QuizBuilderIcon,
  Grading: GradingIcon,
  "Guided Sessions": GuidedSessionsIcon,
}

// Conceptual icons (available for future nav or demo)
export const teacherConceptIcons: Record<string, AnimatedIconComponent> = {
  Classroom: ClassroomIcon,
  Assignments: AssignmentsIcon,
  Curriculum: CurriculumIcon,
  Roster: RosterIcon,
  "Grading Ink": GradingInkIcon,
  Analytics: AnalyticsIcon,
  Discussions: DiscussionsIcon,
  Curation: CurationIcon,
  Settings: SettingsIcon,
}

// Merge shared + nav-mapped + conceptual for full teacher registry
export const teacherIconRegistry: Record<string, AnimatedIconComponent> = {
  ...sharedIconRegistry,
  ...teacherNavIcons,
  ...teacherConceptIcons,
}
