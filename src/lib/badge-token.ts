/**
 * Badge tokens — the opaque secret printed as a QR on a student's bookplate
 * badge (Option B). It is INDEPENDENT of the typed XXXX-XXXX access code:
 * either one signs the same student in, and either can be rotated/revoked
 * without disturbing the other.
 *
 * COPPA / privacy rules baked into the format:
 *   * The token carries NO personal data — it is pure random. A leaked or
 *     photographed QR reveals nothing about the child (no name, no class, no
 *     email, no id).
 *   * Only the SHA-256 hash is ever stored (see student-badges.ts). The
 *     plaintext lives just long enough to draw the QR at print time, then is
 *     gone. A dumped database cannot reproduce a working badge.
 *   * Reprinting requires ROTATING (minting a new token) — an old printout can
 *     never silently keep working.
 *
 * This module is import-safe on both client and server: it only uses the
 * Web Crypto RNG (crypto.getRandomValues), never node:crypto. Hashing lives in
 * the server action layer.
 */

// Unambiguous uppercase alphabet — no O/0, I/1/L (same family as the typed
// code) so a wedge scanner or a human transcriber never confuses characters.
const TOKEN_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"

// 24 chars over a 31-symbol alphabet ≈ 118 bits of entropy — unguessable, and
// visibly distinct from the 8-character typed code so the verifier can tell a
// scanned token from a typed code by shape alone.
const TOKEN_LEN = 24

// A QR wrapper so a general phone-camera scan can recognise (and a foreign QR
// can be rejected) without any lookup. Stripped before verification; carries
// no data beyond the opaque token.
export const BADGE_QR_PREFIX = "TOME-BADGE:"

/** True if `s` is exactly a bare badge token (no wrapper). */
export function isBadgeTokenShape(s: string): boolean {
  return new RegExp(`^[${TOKEN_ALPHABET}]{${TOKEN_LEN}}$`).test(s)
}

/** Mint a fresh random badge token. Uniqueness vs. the table is the caller's job. */
export function generateBadgeToken(): string {
  const values = new Uint32Array(TOKEN_LEN)
  crypto.getRandomValues(values)
  return Array.from(
    values,
    (v) => TOKEN_ALPHABET[v % TOKEN_ALPHABET.length],
  ).join("")
}

/** First 4 chars — the rate-limit ledger key, mirroring the typed-code prefix. */
export function badgeTokenPrefix(token: string): string {
  return token.slice(0, 4)
}

/** The exact string encoded into the QR image on the printed badge. */
export function wrapBadgeQrPayload(token: string): string {
  return `${BADGE_QR_PREFIX}${token}`
}

/**
 * Pull a badge token out of scanned/typed input. Accepts either the wrapped QR
 * payload (`TOME-BADGE:XXXX…`) or a bare token (a wedge scanner may strip the
 * prefix). Returns null for anything that isn't one of ours — so foreign QRs
 * and typed access codes fall through to their own path.
 */
export function parseBadgeQrPayload(raw: string): string | null {
  const trimmed = raw.trim()
  const body = trimmed.startsWith(BADGE_QR_PREFIX)
    ? trimmed.slice(BADGE_QR_PREFIX.length)
    : trimmed
  return isBadgeTokenShape(body) ? body : null
}
