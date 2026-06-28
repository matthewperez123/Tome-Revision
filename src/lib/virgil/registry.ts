import "server-only"

import type { VirgilSurfaceProfile } from "@/lib/virgil/profile"
import type { VirgilSurfaceKind } from "@/lib/virgil/types"
import { libraryProfile } from "@/lib/virgil/surfaces/library"
import { guidedSessionProfile } from "@/lib/virgil/surfaces/guided-session"

// kind → profile. Each entry is typed to its own surface; the route narrows by
// kind before dispatching, so the erased value type here is intentional.
export const VIRGIL_REGISTRY: Record<VirgilSurfaceKind, VirgilSurfaceProfile> = {
  library: libraryProfile as VirgilSurfaceProfile,
  "guided-session": guidedSessionProfile as VirgilSurfaceProfile,
}
