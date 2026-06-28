import "server-only"

import type Anthropic from "@anthropic-ai/sdk"
import type { createClient } from "@/lib/supabase/server"
import type { AllowedRole, ModelTier, VirgilSurface } from "@/lib/virgil/types"

export type VirgilDB = Awaited<ReturnType<typeof createClient>>

export interface GatherArgs<S extends VirgilSurface> {
  surface: S
  supabase: VirgilDB
  userId: string
  /** The caller's resolved platform role (`profiles.role`). */
  role: "teacher" | "student"
}

/**
 * A per-surface Virgil profile. Each surface is a thin profile: who may use it,
 * which model tier, an RLS-scoped context gatherer, and a system prompt in
 * Virgil's voice.
 */
export interface VirgilSurfaceProfile<S extends VirgilSurface = VirgilSurface, C = unknown> {
  kind: S["kind"]
  allowedRole: AllowedRole
  modelTier: ModelTier
  gatherContext: (args: GatherArgs<S>) => Promise<C>
  buildSystemPrompt: (ctx: C) => string
  /**
   * Optional Anthropic tools this surface exposes for the caller's role. When
   * present and non-empty, the route runs a tool-use loop instead of a plain
   * stream. Executors live in `lib/virgil/tools` (server-side, RLS-scoped).
   */
  tools?: (role: "teacher" | "student") => Anthropic.Tool[]
}
