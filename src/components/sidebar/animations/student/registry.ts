import type { AnimatedIconComponent } from "../types"
import { sharedIconRegistry } from "../shared/registry"
import MyClassesIcon from "./MyClassesIcon"
import StudyGroupsIcon from "./StudyGroupsIcon"

// Student-specific icons (not shared with teacher)
const studentOnlyIcons: Record<string, AnimatedIconComponent> = {
  "My Classes": MyClassesIcon,
  "Study Groups": StudyGroupsIcon,
}

// Merge shared + student-specific for full student registry
export const studentIconRegistry: Record<string, AnimatedIconComponent> = {
  ...sharedIconRegistry,
  ...studentOnlyIcons,
}
