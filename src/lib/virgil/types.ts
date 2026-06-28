/**
 * Virgil surface primitive — shared, client-safe types.
 *
 * One reusable Virgil chat surface, specialized per product surface by a
 * profile (see `lib/virgil/surfaces/*` + `lib/virgil/registry.ts`, both
 * server-only). This file is imported by the client `<VirgilSurface>`
 * component, so it must stay free of server-only imports.
 */

export type ModelTier = "haiku" | "sonnet" | "opus"
export type AllowedRole = "teacher" | "student" | "both"

/**
 * The surface payload the client sends with each turn. The reader Virgil keeps
 * its own (mock) chat, and Quiz Builder has its own bespoke assistant
 * (`VirgilSessionAssistant`); these are the surfaces served by the generalized
 * streaming primitive.
 */
export type VirgilSurface =
  | { kind: "library" } // student resolved from auth
  | { kind: "guided-session"; sessionId: string }

export type VirgilSurfaceKind = VirgilSurface["kind"]

export interface VirgilChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface VirgilRequestBody {
  messages: VirgilChatMessage[]
  surface: VirgilSurface
}

/** Map a model tier to a concrete Anthropic model id (kept in lockstep with the quiz pipeline). */
export const MODEL_BY_TIER: Record<ModelTier, string> = {
  haiku: "claude-haiku-4-5",
  sonnet: "claude-sonnet-4-6",
  opus: "claude-opus-4-8",
}

/** Virgil's established voice strings — identical across every surface. */
export const VIRGIL_VOICE = {
  wordmark: "Virgil",
  subtitle: "Your literary guide",
  empty: "Ask me anything about what you're reading.",
  error: "I seem to have lost my voice for a moment. Please try again.",
} as const
