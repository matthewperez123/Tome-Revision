/**
 * Le Morte d'Arthur — speaker color palette.
 *
 * Unlike the other Tome epics, Malory's dialogue is not block-structured
 * (no stage-direction drama, no epic indirect-address apostrophes). It is
 * a dense inline pattern: "…said Sir Launcelot," "…quoth the King," etc.
 *
 * Only 11 named characters receive distinct colors — the reader's eye
 * cannot track more. Every other named speaker shares the "neutral" stone
 * color. That constraint is deliberate; "everyone has a color" collapses
 * into visual noise by Book III.
 *
 * The enhancements overlay component detects `said [Name]` / `quoth
 * [Name]` / `answered [Name]` patterns and colorizes only the quoted
 * clause, leaving the attribution phrase in base text.
 */

export interface MalorySpeaker {
  /** Normalized ID used for lookups */
  id: string
  /** Canonical display name */
  canonical: string
  /**
   * Variant name spellings Malory uses for the same character, e.g.
   * "Isoud", "Iseult", "La Beale Isoud". Lowercased at match time.
   */
  aliases: readonly string[]
  /** Light-theme color (hex) */
  palette: string
  /** Dark-theme color (hex) */
  darkPalette: string
  /** Short gloss for the Cast-of-Characters UI */
  note: string
}

export const MALORY_SPEAKERS: readonly MalorySpeaker[] = [
  {
    id: "arthur",
    canonical: "King Arthur",
    aliases: ["King Arthur", "Arthur", "the King", "the king"],
    palette: "#D4A04C",
    darkPalette: "#F5C675",
    note: "The king. The center.",
  },
  {
    id: "launcelot",
    canonical: "Sir Launcelot",
    aliases: ["Sir Launcelot", "Launcelot", "Sir Lancelot", "Lancelot", "Launcelot du Lake"],
    palette: "#4F46E5",
    darkPalette: "#8B82F0",
    note: "Arthur's greatest knight. His love for Guenever is the tragedy's axis.",
  },
  {
    id: "guenever",
    canonical: "Queen Guenever",
    aliases: ["Guenever", "Queen Guenever", "the Queen", "Guinevere", "Gwenevere"],
    palette: "#BE185D",
    darkPalette: "#E05596",
    note: "The queen. Launcelot's love; the court's breaking point.",
  },
  {
    id: "merlin",
    canonical: "Merlin",
    aliases: ["Merlin"],
    palette: "#7C3AED",
    darkPalette: "#AF85F5",
    note: "The wizard. Departs in Book IV, entombed by Nyneve.",
  },
  {
    id: "morgan-le-fay",
    canonical: "Morgan le Fay",
    aliases: ["Morgan le Fay", "Morgan", "Queen Morgan", "Morgan la Fay"],
    palette: "#8B1A1A",
    darkPalette: "#C65555",
    note: "Arthur's sorcerous half-sister. The antagonist.",
  },
  {
    id: "gawain",
    canonical: "Sir Gawain",
    aliases: ["Sir Gawain", "Gawain", "Sir Gawaine", "Gawaine"],
    palette: "#EA580C",
    darkPalette: "#F59458",
    note: "Arthur's nephew. A complicated ally; drives the final war with Launcelot.",
  },
  {
    id: "tristram",
    canonical: "Sir Tristram",
    aliases: ["Sir Tristram", "Tristram", "Tristram de Lyones", "Tristram of Cornwall"],
    palette: "#0D9488",
    darkPalette: "#5FC7BD",
    note: "Cornish knight; dominates Books VIII–XII.",
  },
  {
    id: "isoud",
    canonical: "La Beale Isoud",
    aliases: ["La Beale Isoud", "Isoud", "Iseult", "Isolde", "Isolt"],
    palette: "#D97756",
    darkPalette: "#F0A88A",
    note: "Tristram's lover. Cornwall's queen by forced marriage to Mark.",
  },
  {
    id: "galahad",
    canonical: "Sir Galahad",
    aliases: ["Sir Galahad", "Galahad"],
    palette: "#E5E4E2",
    darkPalette: "#F8F8F8",
    note: "Launcelot's son; the Grail knight. Translated from earth in Book XVII.",
  },
  {
    id: "percivale",
    canonical: "Sir Percivale",
    aliases: ["Sir Percivale", "Percivale", "Sir Percival", "Percival"],
    palette: "#86EFAC",
    darkPalette: "#BEF5C5",
    note: "The second Grail knight; returns from Sarras to die a hermit.",
  },
  {
    id: "mordred",
    canonical: "Sir Mordred",
    aliases: ["Sir Mordred", "Mordred"],
    palette: "#6B7280",
    darkPalette: "#9CA3AF",
    note: "Arthur's son by Morgause; his rebellion ends the Round Table.",
  },
] as const

/**
 * Everyone not in the curated list renders in this neutral stone color.
 */
export const MALORY_NEUTRAL_SPEAKER = {
  palette: "#57534E",
  darkPalette: "#A8A29E",
} as const

const aliasToSpeaker = new Map<string, MalorySpeaker>()
for (const s of MALORY_SPEAKERS) {
  for (const a of s.aliases) aliasToSpeaker.set(a.toLowerCase(), s)
}

/**
 * Look up a speaker by a name variant as Malory spells it. Case-insensitive.
 */
export function lookupSpeaker(name: string): MalorySpeaker | null {
  return aliasToSpeaker.get(name.toLowerCase()) ?? null
}
