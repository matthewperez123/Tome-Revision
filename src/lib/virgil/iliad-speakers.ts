/**
 * Iliad Speaker Palette — faction-coded colors for Homer's Iliad
 * (William Cullen Bryant translation, 1870 — blank verse).
 *
 * Three factions, distinct in temperature:
 *   - Greeks (Achaeans) — warm bronze / ember / gold palette
 *   - Trojans            — cool rose / terracotta / silver palette
 *   - Gods               — distinctive mythic colors (one per deity)
 *
 * Bryant uses Latin / anglicized names throughout (Jupiter, Juno, Minerva,
 * Ulysses, Phoebus, Vulcan, Mars, Neptune, Venus). This module maps those
 * back to canonical Greek names for a single source of truth, with runtime
 * alias resolution via {@link resolveIliadSpeaker}.
 *
 * The palette is hand-tuned to:
 *   1. Remain legible against Tome's parchment / night backgrounds.
 *   2. Preserve the narrator's black base text (no color when speaker is null).
 *   3. Pair visually with the in-flight Odyssey palette (Odysseus = pale gold
 *      is reserved in both epics for thematic continuity).
 */

export type IliadFaction = "greek" | "trojan" | "god" | "narrator"

export interface IliadSpeakerColor {
  /** Canonical Greek name */
  name: string
  faction: IliadFaction
  light: string
  dark: string
  /** Short scholium shown on hover / in a legend */
  note: string
}

// ── Greeks (Achaeans): warm bronze palette ────────────────────────────────

const GREEKS: Record<string, IliadSpeakerColor> = {
  Achilles: {
    name: "Achilles",
    faction: "greek",
    light: "#9C3A1E", // deep ember — the wrath-color, thematically load-bearing
    dark: "#E26A46",
    note: "Swift-footed son of Peleus; his wrath (μῆνις) is the Iliad's first word and first theme.",
  },
  Agamemnon: {
    name: "Agamemnon",
    faction: "greek",
    light: "#A8782C", // imperial gold
    dark: "#D4A04A",
    note: "Atrides, king of men; commander of the Achaean host.",
  },
  // Ulysses/Odysseus is paler gold — reserved to match the Odyssey palette.
  Odysseus: {
    name: "Odysseus",
    faction: "greek",
    light: "#B89556", // pale gold
    dark: "#D9B97A",
    note: "Bryant calls him Ulysses. Polymētis — man of many devices.",
  },
  Nestor: {
    name: "Nestor",
    faction: "greek",
    light: "#6B4A2E", // dark bronze — age
    dark: "#A88560",
    note: "Pylian elder; the master of persuasive speech.",
  },
  Diomedes: {
    name: "Diomedes",
    faction: "greek",
    light: "#8C5A3D", // warm bronze
    dark: "#B88A6E",
    note: "Tydeus's son; in Book 5 his aristeia wounds two gods.",
  },
  Ajax: {
    name: "Ajax",
    faction: "greek",
    light: "#8C6B3D", // heavy bronze
    dark: "#B8966C",
    note: "Bulwark of the Achaeans; second only to Achilles in martial prowess.",
  },
  Patroclus: {
    name: "Patroclus",
    faction: "greek",
    light: "#A8782C", // warm bronze — tragic counterpart to Achilles' ember
    dark: "#D4A04A",
    note: "Achilles's dearest companion; his death in Book 16 turns the poem.",
  },
  Menelaus: {
    name: "Menelaus",
    faction: "greek",
    light: "#8C4A3D", // russet bronze
    dark: "#B87A6E",
    note: "Atrides; Spartan king whose abducted wife is the war's cause.",
  },
  Calchas: {
    name: "Calchas",
    faction: "greek",
    light: "#6E5A3D", // muted bronze — an augur, not a warrior
    dark: "#A8926C",
    note: "Thestor's son, chief of augurs; read Apollo's anger in Book 1.",
  },
}

// ── Trojans: cool rose / terracotta palette ───────────────────────────────

const TROJANS: Record<string, IliadSpeakerColor> = {
  Hector: {
    name: "Hector",
    faction: "trojan",
    light: "#8C4A3D", // warm terracotta — the Trojan wall in a person
    dark: "#C97160",
    note: "Priam's eldest; sole bulwark of Troy. His tenderness to Andromache (Book 6) balances his valor.",
  },
  Priam: {
    name: "Priam",
    faction: "trojan",
    light: "#6E7A8C", // silver-gray — age, sorrow
    dark: "#9AA8B8",
    note: "Aged king of Troy; his Book 24 ransom of Hector is the Iliad's moral climax.",
  },
  Paris: {
    name: "Paris",
    faction: "trojan",
    light: "#8C6B7E", // dusty rose — the seducer, aesthetic rather than martial
    dark: "#B89AAA",
    note: "Alexandros; his judgment on Ida and theft of Helen are the war's proximate cause.",
  },
  Aeneas: {
    name: "Aeneas",
    faction: "trojan",
    light: "#8C5A5A", // rose-terracotta
    dark: "#B88A8A",
    note: "Anchises's son; destined to survive Troy and found Rome (Virgil, Aeneid).",
  },
  Sarpedon: {
    name: "Sarpedon",
    faction: "trojan",
    light: "#6E3A5A", // wine-rose — Lycian ally, mortal son of Zeus
    dark: "#A87A94",
    note: "Lycian king, mortal son of Zeus; his death (Book 16) tests divine impartiality.",
  },
  Helen: {
    name: "Helen",
    faction: "trojan",
    light: "#A8782C", // soft rose-gold
    dark: "#D4A070",
    note: "Daughter of Zeus; cause of the war; in the Iliad she speaks her own self-reproach.",
  },
  Andromache: {
    name: "Andromache",
    faction: "trojan",
    light: "#6E3A3D", // wine
    dark: "#A87A7E",
    note: "Hector's wife; the Book 6 farewell and Book 24 lament are hers.",
  },
  Hecuba: {
    name: "Hecuba",
    faction: "trojan",
    light: "#5C3A5C", // aubergine
    dark: "#9C7A9C",
    note: "Queen of Troy; Priam's wife; mother of Hector and Paris.",
  },
  Glaucus: {
    name: "Glaucus",
    faction: "trojan",
    light: "#8C6B5A", // terracotta-umber
    dark: "#B8967E",
    note: "Lycian prince; his Book 6 exchange of armor with Diomedes is the Iliad's quietest scene.",
  },
}

// ── Gods: one distinctive mythic color each ──────────────────────────────

const GODS: Record<string, IliadSpeakerColor> = {
  Zeus: {
    name: "Zeus",
    faction: "god",
    light: "#8C7A2C", // white-gold (tuned for legibility on parchment)
    dark: "#E6D27A",
    note: "Bryant: Jupiter / Jove / Saturn's son / the Thunderer / cloud-compeller.",
  },
  Hera: {
    name: "Hera",
    faction: "god",
    light: "#2E5F6E", // peacock
    dark: "#6BA0B2",
    note: "Bryant: Juno / white-armed. Anti-Trojan after the Judgment of Paris.",
  },
  Athena: {
    name: "Athena",
    faction: "god",
    light: "#5A6040", // olive-green
    dark: "#A0A874",
    note: "Bryant: Pallas / Pallas Athene / Minerva / blue-eyed. Greek partisan.",
  },
  Apollo: {
    name: "Apollo",
    faction: "god",
    light: "#C8912A", // solar gold
    dark: "#F0C058",
    note: "Bryant: Phoebus / archer-god / far-shooter. Trojan partisan; his plague opens the poem.",
  },
  Aphrodite: {
    name: "Aphrodite",
    faction: "god",
    light: "#B86B88", // pale rose
    dark: "#E09AB0",
    note: "Bryant: Venus. Her partiality to Paris bends the war.",
  },
  Poseidon: {
    name: "Poseidon",
    faction: "god",
    light: "#2E5A7A", // sea-blue
    dark: "#6895B5",
    note: "Bryant: Neptune / earth-shaker. Greek partisan; Book 13 intervention.",
  },
  Ares: {
    name: "Ares",
    faction: "god",
    light: "#8C2E2E", // blood-red
    dark: "#C96464",
    note: "Bryant: Mars. Trojan partisan; wounded by Diomedes in Book 5.",
  },
  Hephaestus: {
    name: "Hephaestus",
    faction: "god",
    light: "#B8652A", // forge-orange
    dark: "#E09050",
    note: "Bryant: Vulcan. The lame artificer; forges the shield of Achilles (Book 18).",
  },
  Thetis: {
    name: "Thetis",
    faction: "god",
    light: "#7A8C9C", // pearl / silver-sea
    dark: "#B0BFCE",
    note: "Silver-footed sea-nymph; Achilles's mother; intercedes with Zeus in Book 1.",
  },
  Iris: {
    name: "Iris",
    faction: "god",
    light: "#8C6B7E", // dusty mauve — messenger, rainbow
    dark: "#B89AAA",
    note: "Golden-winged messenger of the gods.",
  },
  Hermes: {
    name: "Hermes",
    faction: "god",
    light: "#6B8560", // leaf-green — herald, guide
    dark: "#9EBE94",
    note: "Bryant: Mercury. Guides Priam to Achilles's tent in Book 24.",
  },
  Artemis: {
    name: "Artemis",
    faction: "god",
    light: "#5F8070", // pine
    dark: "#92B0A0",
    note: "Bryant: Dian / Diana. Apollo's sister; Trojan partisan.",
  },
  Dione: {
    name: "Dione",
    faction: "god",
    light: "#A88AA8", // faded lilac
    dark: "#C8B0C8",
    note: "Aphrodite's mother; comforts her in Book 5.",
  },
}

// ── Bryant name → canonical name aliases ─────────────────────────────────

/**
 * Bryant's Latinate / variant names mapped to the canonical Greek names
 * used as keys in the palette above. Case-insensitive match.
 * Multi-word aliases ("Pallas Athene") are matched before single-word ones.
 */
export const ILIAD_SPEAKER_ALIASES: Record<string, string> = {
  // Gods — Latin ↔ Greek
  jupiter: "Zeus",
  jove: "Zeus",
  "saturn's son": "Zeus",
  thunderer: "Zeus",
  "cloud-compeller": "Zeus",
  juno: "Hera",
  minerva: "Athena",
  pallas: "Athena",
  "pallas athene": "Athena",
  athene: "Athena",
  phoebus: "Apollo",
  "phoebus apollo": "Apollo",
  venus: "Aphrodite",
  neptune: "Poseidon",
  mars: "Ares",
  vulcan: "Hephaestus",
  mercury: "Hermes",
  dian: "Artemis",
  diana: "Artemis",
  // Heroes — Bryant variants
  ulysses: "Odysseus",
  atrides: "Agamemnon", // ambiguous (Menelaus is also Atrides) — default to Agamemnon
  pelides: "Achilles",
  "peleus's son": "Achilles",
  "son of peleus": "Achilles",
  diomed: "Diomedes",
  alexandros: "Paris",
  alexander: "Paris",
}

// ── Aggregate palette ─────────────────────────────────────────────────────

export const ILIAD_SPEAKERS: Record<string, IliadSpeakerColor> = {
  ...GREEKS,
  ...TROJANS,
  ...GODS,
}

/**
 * Resolve a Bryant-style name to its canonical entry, following the
 * alias table. Returns null if no match (the narrator, or unknown).
 */
export function resolveIliadSpeaker(rawName: string): IliadSpeakerColor | null {
  if (!rawName) return null
  const normalized = rawName.trim().toLowerCase()
  const canonical = ILIAD_SPEAKER_ALIASES[normalized] ?? rawName.trim()
  // Exact-case canonical lookup; also try capitalized-first form.
  return (
    ILIAD_SPEAKERS[canonical] ??
    ILIAD_SPEAKERS[canonical.charAt(0).toUpperCase() + canonical.slice(1).toLowerCase()] ??
    null
  )
}

/**
 * Returns the correctly-themed hex color for a speaker, or null if the
 * speaker is not in the palette (e.g. the narrator, a one-line minor
 * warrior who is not speech-tagged).
 */
export function getIliadSpeakerColor(
  rawName: string | null | undefined,
  isDark: boolean,
): string | null {
  if (!rawName) return null
  const entry = resolveIliadSpeaker(rawName)
  if (!entry) return null
  return isDark ? entry.dark : entry.light
}

/**
 * The full list of canonical speakers in display order (Greeks, Trojans,
 * Gods). Useful for legends and palette-audit tooling.
 */
export function listIliadSpeakers(): IliadSpeakerColor[] {
  return [
    ...Object.values(GREEKS),
    ...Object.values(TROJANS),
    ...Object.values(GODS),
  ]
}
