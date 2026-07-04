import type { AnimatedIconComponent } from "../types"
import HomeIcon from "./HomeIcon"
import DashboardIcon from "./DashboardIcon"
import LibraryIcon from "./LibraryIcon"
import BookmarksIcon from "./BookmarksIcon"
import ShelvesIcon from "./ShelvesIcon"
import AuthorsIcon from "./AuthorsIcon"
import ReadingIcon from "./ReadingIcon"
import TrialsIcon from "./TrialsIcon"
import ExploreIcon from "./ExploreIcon"
import TimelinesIcon from "./TimelinesIcon"
import ProfileIcon from "./ProfileIcon"

export const sharedIconRegistry: Record<string, AnimatedIconComponent> = {
  Home: HomeIcon,
  Dashboard: DashboardIcon,
  Library: LibraryIcon,
  Bookmarks: BookmarksIcon,
  "My Shelves": ShelvesIcon,
  Authors: AuthorsIcon,
  Reading: ReadingIcon,
  Quizzes: TrialsIcon,
  Explore: ExploreIcon,
  Timelines: TimelinesIcon,
  Profile: ProfileIcon,
}
