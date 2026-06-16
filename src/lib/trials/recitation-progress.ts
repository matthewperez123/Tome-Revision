/**
 * Recitation progress — highest progressive-cloze level a user reached for a
 * passage.
 *
 * The DB home for this is `public.recitation_progress` (per-user, RLS), but the
 * app has no real auth yet (economy runs under a GUEST_USER_ID in localStorage).
 * Writing through Supabase RLS would fail with a null `auth.uid()`, so for now
 * we persist to localStorage under a stable passage id — mirroring the economy
 * pattern. When auth lands, swap the get/set bodies to hit the table; the
 * passage-id seam and call sites do not change.
 */

const STORAGE_KEY = "tome-recitation-progress"

/** Stable id for a passage from its tokens (works for DB + content/json). */
export function passageIdFromTokens(tokens: string[]): string {
  const s = tokens.join(" ")
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i)
  }
  return `rec_${(h >>> 0).toString(36)}`
}

function readAll(): Record<string, number> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, number>) : {}
  } catch {
    return {}
  }
}

/** Highest round index the user completed from memory (0-based). */
export function getRecitationLevel(passageId: string): number {
  return readAll()[passageId] ?? 0
}

/** Record a newly reached level (monotonic — never lowers). */
export function setRecitationLevel(passageId: string, level: number): void {
  if (typeof window === "undefined") return
  const all = readAll()
  if ((all[passageId] ?? 0) >= level) return
  all[passageId] = level
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // ignore quota / serialization errors
  }
}
