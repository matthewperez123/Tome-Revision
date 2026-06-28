/**
 * Progressive hint ladder — shared shape, schema, and leak detection.
 *
 * Used by the quiz generation service (server), the reader quiz surface
 * (client), and the batch backfill. Kept free of server-only imports so it can
 * be imported from client components.
 *
 * Pedagogy — three progressive levels, none of which reveal the answer:
 *   L1 Orient   — where to look / what the question is really asking.
 *   L2 Scaffold — the approach or concept; for MC may eliminate one distractor.
 *   L3 Strong nudge — very close, but the student still commits.
 */

import { z } from "zod"

export const MAX_HINT_LEVEL = 3 as const
export type HintLevel = 1 | 2 | 3

export const HINT_LEVEL_META: Record<HintLevel, { label: string; aim: string }> = {
  1: { label: "Orient", aim: "where to look — no reasoning given away" },
  2: { label: "Scaffold", aim: "the approach or concept you need" },
  3: { label: "Strong nudge", aim: "very close — but you still commit" },
}

export const hintSchema = z.object({
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  text: z.string().min(1),
})
export type Hint = z.infer<typeof hintSchema>

export const hintLadderSchema = z.array(hintSchema).min(1).max(MAX_HINT_LEVEL)

/** Sort + de-dupe by level so reveal order is deterministic and L1 always first. */
export function normalizeLadder(hints: Hint[]): Hint[] {
  const byLevel = new Map<number, Hint>()
  for (const h of hints) if (!byLevel.has(h.level)) byLevel.set(h.level, h)
  return [...byLevel.values()].sort((a, b) => a.level - b.level)
}

/** Coerce an unknown jsonb value into a clean, ordered hint ladder (or []). */
export function parseHints(value: unknown): Hint[] {
  const parsed = z.array(hintSchema).safeParse(value)
  if (!parsed.success) return []
  return normalizeLadder(parsed.data)
}

// ── Leak detection ────────────────────────────────────────────────────────────
// A hint must never contain the literal correct answer, the correct option text,
// or the exact reference_answer. Enforced at generation time and re-checked on
// any live-generated hint before it reaches the client.

// Boolean / yes-no answers are skipped: a true_false hint legitimately uses the
// words "true"/"false" without giving the answer away.
const STOPWORD_ANSWERS = new Set(["true", "false", "yes", "no"])

export function normalizeForLeak(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * True if `hintText` contains any forbidden answer string as a normalized
 * substring. Forbidden strings shorter than 3 chars and boolean stopwords are
 * skipped to avoid false positives.
 */
export function hintLeaks(hintText: string, forbidden: (string | null | undefined)[]): boolean {
  const h = normalizeForLeak(hintText)
  if (!h) return false
  for (const raw of forbidden) {
    if (!raw) continue
    const f = normalizeForLeak(raw)
    if (f.length < 3) continue
    if (STOPWORD_ANSWERS.has(f)) continue
    if (h.includes(f)) return true
  }
  return false
}

/** Drop any leaking hint, returning a clean ladder (possibly fewer levels). */
export function stripLeakingHints(
  hints: Hint[],
  forbidden: (string | null | undefined)[],
): Hint[] {
  return normalizeLadder(hints.filter((h) => !hintLeaks(h.text, forbidden)))
}
