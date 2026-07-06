import "server-only"

/**
 * Resilient transport for Virgil model calls. Retries only TRANSIENT failures —
 * rate limits (429), overloaded (529), and the 5xx/connection band — with
 * exponential backoff + jitter, bounded to a small number of attempts so cost
 * can never run away. Client aborts (the teacher navigated away / cancelled)
 * are NOT retried: they rethrow immediately.
 */

const RETRYABLE_STATUS = new Set([408, 409, 429, 500, 502, 503, 529])

/** Whether an aborted-request error should stop retrying immediately. */
function isAbort(err: unknown): boolean {
  if (err && typeof err === "object") {
    const name = (err as { name?: unknown }).name
    if (name === "AbortError") return true
  }
  return false
}

/** Whether this error is a transient one worth retrying. */
function isRetryable(err: unknown): boolean {
  if (isAbort(err)) return false
  if (err && typeof err === "object") {
    const status = (err as { status?: unknown }).status
    if (typeof status === "number" && RETRYABLE_STATUS.has(status)) return true
    // Anthropic SDK connection errors carry no status but should be retried.
    const name = (err as { name?: unknown }).name
    if (name === "APIConnectionError" || name === "APIConnectionTimeoutError") return true
  }
  return false
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Run `fn`, retrying transient failures with exponential backoff.
 * `attempts` is the TOTAL number of tries (default 3 = 1 call + 2 retries).
 */
export async function withAnthropicRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (isAbort(err)) throw err
      if (i === attempts - 1 || !isRetryable(err)) throw err
      // 0.5s, 1s, 2s … capped, plus up to 250ms jitter.
      const backoff = Math.min(500 * 2 ** i, 4000) + Math.floor(Math.random() * 250)
      await sleep(backoff)
    }
  }
  throw lastErr
}
