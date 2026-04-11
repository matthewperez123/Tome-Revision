/**
 * Classroom utilities — join code generation and validation.
 */

// Characters that won't be confused (no 0/O/I/1/l)
const JOIN_CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
const JOIN_CODE_LENGTH = 6

/**
 * Generate a random 6-character join code.
 * Uses crypto for randomness.
 */
export function generateJoinCode(): string {
  const values = new Uint32Array(JOIN_CODE_LENGTH)
  crypto.getRandomValues(values)
  return Array.from(values)
    .map((v) => JOIN_CODE_CHARS[v % JOIN_CODE_CHARS.length])
    .join("")
}

/**
 * Generate a unique join code, checking against existing codes in the database.
 */
export async function generateUniqueJoinCode(
  checkExists: (code: string) => Promise<boolean>,
  maxAttempts = 10,
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const code = generateJoinCode()
    const exists = await checkExists(code)
    if (!exists) return code
  }
  throw new Error("Failed to generate unique join code after max attempts")
}

/**
 * Validate a join code format.
 */
export function isValidJoinCode(code: string): boolean {
  if (code.length !== JOIN_CODE_LENGTH) return false
  return [...code].every((c) => JOIN_CODE_CHARS.includes(c.toUpperCase()))
}
