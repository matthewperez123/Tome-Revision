/**
 * Student access codes — the COPPA-safe, email-free credential a student types
 * (or scans) to enter. Format is XXXX-XXXX using an unambiguous alphabet (no
 * O/0, I/1/L, etc.) so a young reader can copy it from a printed badge without
 * confusion.
 *
 * The database column `student_access_codes.code_prefix` is a stored generated
 * column = left(code, 4), i.e. the FIRST block (no dash). The rate-limit ledger
 * (`login_attempts.code_prefix`) keys off that same 4-char prefix, so the code
 * is stored WITH its dash and the prefix is always the leading block.
 */

// Unambiguous uppercase alphabet — matches the join-code generators elsewhere.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
const BLOCK = 4

/** XXXX-XXXX, case-insensitive, only the unambiguous alphabet. */
export const STUDENT_CODE_RE = new RegExp(
  `^[${CODE_ALPHABET}]{${BLOCK}}-[${CODE_ALPHABET}]{${BLOCK}}$`,
  "i",
)

/**
 * Normalize raw input into the canonical stored form: uppercased, stripped of
 * spaces, and hyphenated as XXXX-XXXX. Accepts input with or without the dash
 * (a wedge scanner or a kid may omit it). Returns null if it can't be coerced
 * into a valid code.
 */
export function normalizeStudentCode(raw: string): string | null {
  const cleaned = raw
    .toUpperCase()
    .replace(/[\s-]+/g, "")
    .trim()
  if (cleaned.length !== BLOCK * 2) return null
  const candidate = `${cleaned.slice(0, BLOCK)}-${cleaned.slice(BLOCK)}`
  return STUDENT_CODE_RE.test(candidate) ? candidate : null
}

export function isValidStudentCode(raw: string): boolean {
  return normalizeStudentCode(raw) !== null
}

/** The 4-char lookup prefix (leading block) used for rate limiting. */
export function studentCodePrefix(code: string): string {
  return code.slice(0, BLOCK)
}

/**
 * Generate a fresh random XXXX-XXXX code using crypto. Uniqueness against the
 * table is the caller's job (retry on collision).
 */
export function generateStudentCode(): string {
  const values = new Uint32Array(BLOCK * 2)
  crypto.getRandomValues(values)
  const chars = Array.from(values, (v) => CODE_ALPHABET[v % CODE_ALPHABET.length])
  return `${chars.slice(0, BLOCK).join("")}-${chars.slice(BLOCK).join("")}`
}
