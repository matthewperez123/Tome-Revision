/**
 * Return a stable shuffled copy of `items` for a given seed.
 *
 * Trial bodies are prerendered on the server and then hydrated in the browser,
 * so render-time `Math.random()` produces different markup in each environment.
 * This tiny seeded generator keeps the word bank feeling shuffled while making
 * the first render deterministic.
 */
export function deterministicShuffle<T>(
  items: readonly T[],
  seed: string,
): T[] {
  const shuffled = [...items]
  let state = hashSeed(seed)

  for (let i = shuffled.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0
    const j = state % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

function hashSeed(seed: string): number {
  let hash = 2_166_136_261
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16_777_619)
  }
  return hash >>> 0
}
