/**
 * Odyssey Speaker Palette — faction-coded colors for Homer's Odyssey
 * (William Cullen Bryant translation, 1871 — blank verse).
 *
 * Continuity with the Iliad is load-bearing: any character appearing in
 * both epics MUST display in identical colors so that a reader opening
 * Iliad Book 1 and Odyssey Book 1 side-by-side sees Athena, Odysseus,
 * Nestor, and Menelaus in the same hues. We enforce this structurally:
 * shared characters are imported by reference from `iliad-speakers`,
 * not copy-pasted. A palette change in one epic propagates to both.
 *
 * Odyssey-only cast gets distinct tones tuned to the poem's geography:
 *   - The house of Odysseus (Telemachus, Penelope, Laertes, Eurycleia,
 *     Eumaeus, Philoetius) — warm earth / bronze-family, cognate with
 *     the Iliad's Greek palette but slightly cooler and more domestic.
 *   - The suitors (Antinoüs, Eurymachus, and the collective) — muted
 *     slate, evoking corruption and the status of false guests.
 *   - The wanderings (Circe, Calypso, Nausicaä, Polyphemus, Tiresias,
 *     the shades) — cool liminal tones (pearl, sea-blue, dawn-gold,
 *     ember-red, ash-gray), distinct from both Greek and Trojan
 *     Iliad palettes to mark the apologoi as a world apart.
 *
 * Bryant uses the same Latinate / anglicized names (Jupiter, Juno,
 * Minerva, Ulysses, Phoebus, Neptune) across both translations, so the
 * Iliad alias table is reused directly with a small Odyssey-specific
 * extension for characters unique to the second poem.
 */

import {
  ILIAD_SPEAKERS,
  ILIAD_SPEAKER_ALIASES,
  type IliadSpeakerColor,
} from "./iliad-speakers"

export type OdysseyFaction =
  | "greek"           // Iliadic Greeks who reappear (Odysseus, Nestor, Menelaus…)
  | "god"             // Olympians
  | "house-ithaca"    // Odysseus's household
  | "suitor"          // The wooers besieging Penelope
  | "phaeacian"       // Alcinoüs, Arete, Nausicaä, Demodocus…
  | "wanderings"      // Circe, Calypso, Polyphemus, Aeolus, Tiresias…
  | "shade"           // The dead of Book XI (Elpenor, Anticlea, Tiresias…)
  | "narrator"

export interface OdysseySpeakerColor {
  /** Canonical Greek name */
  name: string
  faction: OdysseyFaction
  light: string
  dark: string
  /** Short scholium shown on hover / in a legend */
  note: string
}

// ── Iliadic cast who reappear in the Odyssey ──────────────────────────────
// Import-by-reference: these are the SAME objects as in iliad-speakers.ts,
// just re-typed to the Odyssey-faction vocabulary. Changing a hex in
// iliad-speakers updates both epics automatically.

const SHARED: Record<string, OdysseySpeakerColor> = {
  // Heroes who survive into the Odyssey (or whose shades speak in Book XI)
  Odysseus:   { ...ILIAD_SPEAKERS.Odysseus,   faction: "greek" },
  Nestor:     { ...ILIAD_SPEAKERS.Nestor,     faction: "greek" },
  Menelaus:   { ...ILIAD_SPEAKERS.Menelaus,   faction: "greek" },
  Helen:      { ...ILIAD_SPEAKERS.Helen,      faction: "greek" }, // re-faction'd: Helen is at Sparta with Menelaus, not Troy
  Agamemnon:  { ...ILIAD_SPEAKERS.Agamemnon,  faction: "shade" }, // speaks as a shade in XI, XXIV
  Achilles:   { ...ILIAD_SPEAKERS.Achilles,   faction: "shade" }, // shade in XI
  Patroclus:  { ...ILIAD_SPEAKERS.Patroclus,  faction: "shade" }, // implicit in XI
  Ajax:       { ...ILIAD_SPEAKERS.Ajax,       faction: "shade" }, // shade in XI (silent but present)
  Antilochus: { ...(ILIAD_SPEAKERS.Antilochus ?? { name: "Antilochus", light: "#6E5A3D", dark: "#A8926C", note: "Nestor's son; died at Troy; a shade in Book XI." }), faction: "shade" },

  // Gods — same colors, same meaning
  Zeus:       { ...ILIAD_SPEAKERS.Zeus,       faction: "god" },
  Hera:       { ...ILIAD_SPEAKERS.Hera,       faction: "god" },
  Athena:     { ...ILIAD_SPEAKERS.Athena,     faction: "god" },
  Apollo:     { ...ILIAD_SPEAKERS.Apollo,     faction: "god" },
  Aphrodite:  { ...ILIAD_SPEAKERS.Aphrodite,  faction: "god" },
  Poseidon:   { ...ILIAD_SPEAKERS.Poseidon,   faction: "god" },
  Ares:       { ...ILIAD_SPEAKERS.Ares,       faction: "god" },
  Hephaestus: { ...ILIAD_SPEAKERS.Hephaestus, faction: "god" },
  Hermes:     { ...ILIAD_SPEAKERS.Hermes,     faction: "god" },
  Artemis:    { ...ILIAD_SPEAKERS.Artemis,    faction: "god" },
  Thetis:     { ...ILIAD_SPEAKERS.Thetis,     faction: "god" }, // absent from the Odyssey, retained for alias safety
}

// ── The house of Odysseus ─────────────────────────────────────────────────
// Warm earth / domestic-bronze family, slightly cooler than the Iliad's
// battlefield Greeks. Odysseus (pale gold, imported) sits at the core of
// this palette — his household radiates outward from it.

const ITHACA: Record<string, OdysseySpeakerColor> = {
  Telemachus: {
    name: "Telemachus",
    faction: "house-ithaca",
    light: "#A87B3C", // soft bronze — lighter than Odysseus's pale gold
    dark: "#D4A870",
    note: "Odysseus's son; the Telemachy (Books I–IV) is his coming-of-age arc.",
  },
  Penelope: {
    name: "Penelope",
    faction: "house-ithaca",
    light: "#8C3A5A", // deep rose — circumspect (periphrōn)
    dark: "#C06A8C",
    note: "Wife of Odysseus; her weaving and un-weaving is the twenty-year holding-pattern of the plot.",
  },
  Laertes: {
    name: "Laertes",
    faction: "house-ithaca",
    light: "#6B5A3D", // faded bronze — age
    dark: "#A89778",
    note: "Odysseus's father; lives apart in the fields; reunited in Book XXIV.",
  },
  Eurycleia: {
    name: "Eurycleia",
    faction: "house-ithaca",
    light: "#8C6B4A", // warm umber — the nurse who recognized the scar
    dark: "#B89A78",
    note: "Nurse of Odysseus and Telemachus; recognizes the hero by his scar (XIX).",
  },
  Eurynome: {
    name: "Eurynome",
    faction: "house-ithaca",
    light: "#8C7A5A", // dusty bronze
    dark: "#B8A88C",
    note: "Housekeeper to Penelope.",
  },
  Eumaeus: {
    name: "Eumaeus",
    faction: "house-ithaca",
    light: "#6B4A2E", // earth-brown — pastoral
    dark: "#9E8560",
    note: "The loyal swineherd; embodies xenia in Book XIV; the only character Homer addresses in second person.",
  },
  Philoetius: {
    name: "Philoetius",
    faction: "house-ithaca",
    light: "#6B5A3D", // bronzed earth
    dark: "#9E8B70",
    note: "The cowherd; with Eumaeus, fights beside Odysseus in Book XXII.",
  },
  Melanthius: {
    name: "Melanthius",
    faction: "house-ithaca",
    light: "#5A4A3D", // muddy bronze — the traitor among the household
    dark: "#8B7E6E",
    note: "The goatherd who sides with the suitors; punished in XXII.",
  },
  Melantho: {
    name: "Melantho",
    faction: "house-ithaca",
    light: "#7A4A5A", // muted wine — disloyal maid
    dark: "#A87F8C",
    note: "A disloyal handmaid; hanged with the others in XXII.",
  },
  Phemius: {
    name: "Phemius",
    faction: "house-ithaca",
    light: "#8C7A4A", // bardic gold, dimmer than Odysseus
    dark: "#B8A878",
    note: "The bard of Ithaca; compelled to sing for the suitors; spared by Odysseus.",
  },
  Medon: {
    name: "Medon",
    faction: "house-ithaca",
    light: "#6E6B5A", // neutral gray-bronze
    dark: "#A39F8E",
    note: "A herald loyal to the house; spared in the slaughter.",
  },
  Dolius: {
    name: "Dolius",
    faction: "house-ithaca",
    light: "#6B5A3D",
    dark: "#A88560",
    note: "Old family retainer, father of the traitor Melanthius.",
  },
  Mentor: {
    name: "Mentor",
    faction: "house-ithaca",
    light: "#6B6B4A",
    dark: "#A3A380",
    note: "Old friend of Odysseus, whose shape Athena borrows.",
  },
  Mentes: {
    name: "Mentes",
    faction: "house-ithaca",
    light: "#5A6040",
    dark: "#A0A874",
    note: "Taphian guest-friend; Athena's first disguise (Book I) — deliberately the same olive-green as Athena herself.",
  },
  Anticlea: {
    name: "Anticlea",
    faction: "shade",
    light: "#7A8C9C", // pearl — her shade in XI
    dark: "#B0BFCE",
    note: "Odysseus's mother; her shade in Book XI is the Odyssey's single greatest moment of pathos.",
  },
  Theoclymenus: {
    name: "Theoclymenus",
    faction: "house-ithaca",
    light: "#6B8560", // seer-green
    dark: "#9EBE94",
    note: "Wandering seer received by Telemachus in XV; prophesies the suitors' doom in XX.",
  },
}

// ── The suitors ───────────────────────────────────────────────────────────
// Muted slate — legible but deliberately drab. They speak often but Homer
// denies them dignity; the palette enforces this.

const SUITORS: Record<string, OdysseySpeakerColor> = {
  Antinous: {
    name: "Antinous",
    faction: "suitor",
    light: "#4A5060", // dark slate — chief suitor, first to die
    dark: "#8A92A2",
    note: "Eupeithes's son; ringleader of the suitors; killed first (XXII).",
  },
  Eurymachus: {
    name: "Eurymachus",
    faction: "suitor",
    light: "#4A5560", // slate, marginally cooler than Antinous
    dark: "#8A95A2",
    note: "Polybus's son; the suitors' smooth talker; killed second in XXII.",
  },
  Amphinomus: {
    name: "Amphinomus",
    faction: "suitor",
    light: "#5A6070", // a paler slate — Homer marks him as the suitor with some honor
    dark: "#95A0B0",
    note: "A nobler suitor; receives Odysseus's warning in XVIII; still slain.",
  },
  Ctesippus:  { name: "Ctesippus",  faction: "suitor", light: "#4A5060", dark: "#8A92A2", note: "A wealthy suitor from Same; hurls an ox-hoof at Odysseus in XX." },
  Leiodes:    { name: "Leiodes",    faction: "suitor", light: "#4A5060", dark: "#8A92A2", note: "Priest-diviner among the suitors; pleads for his life, denied." },
  Agelaus:    { name: "Agelaus",    faction: "suitor", light: "#4A5060", dark: "#8A92A2", note: "A suitor who rallies the remainder in XXII." },
  Irus: {
    name: "Irus",
    faction: "suitor",
    light: "#5A4A4A", // a beggar's tone; not quite a suitor but in their circle
    dark: "#9A8A8A",
    note: "The beggar who challenges the disguised Odysseus in XVIII.",
  },
}

// ── The Phaeacians ────────────────────────────────────────────────────────
// Dawn-gold to soft sea-blue — the civilized mid-point between wandering
// and homecoming, Homer's utopia.

const PHAEACIANS: Record<string, OdysseySpeakerColor> = {
  Alcinous: {
    name: "Alcinous",
    faction: "phaeacian",
    light: "#8C6B2C", // warm dawn-gold — the king
    dark: "#D4A760",
    note: "King of the Phaeacians; host of the apologoi.",
  },
  Arete: {
    name: "Arete",
    faction: "phaeacian",
    light: "#7A5A7A", // amethyst
    dark: "#B090B0",
    note: "Queen of the Phaeacians; uniquely honored — Odysseus addresses her before the king.",
  },
  Nausicaa: {
    name: "Nausicaa",
    faction: "phaeacian",
    light: "#C87A5A", // dawn-rose — the princess at the river in Book VI
    dark: "#E6A080",
    note: "Princess of the Phaeacians; finds the shipwrecked Odysseus by the river (VI).",
  },
  Demodocus: {
    name: "Demodocus",
    faction: "phaeacian",
    light: "#8C7A4A", // bardic gold — the blind singer
    dark: "#B8A878",
    note: "Blind bard of the Phaeacians; sings the Trojan songs that make Odysseus weep (VIII).",
  },
  Euryalus: {
    name: "Euryalus",
    faction: "phaeacian",
    light: "#6E7A8C",
    dark: "#9AA8B8",
    note: "A young Phaeacian athlete; insults Odysseus, then apologizes (VIII).",
  },
  Laodamas: {
    name: "Laodamas",
    faction: "phaeacian",
    light: "#7A6B8C",
    dark: "#A89EBC",
    note: "Son of Alcinoüs; invites Odysseus into the games (VIII).",
  },
}

// ── The wanderings + shades ───────────────────────────────────────────────
// Cool, liminal, marked distinct from both Greek and Trojan Iliad palettes
// so the apologoi feel elsewhere.

const WANDERINGS: Record<string, OdysseySpeakerColor> = {
  Circe: {
    name: "Circe",
    faction: "wanderings",
    light: "#A89C5A", // pearl-gold — the enchantress with a human voice
    dark: "#D6CC90",
    note: "Enchantress of Aeaea; transforms Odysseus's men into swine; becomes his guide to the Nekyia.",
  },
  Calypso: {
    name: "Calypso",
    faction: "wanderings",
    light: "#4A7A8C", // deep sea-blue — the hidden one (kalyptō)
    dark: "#80B0C0",
    note: "Daughter of Atlas; holds Odysseus seven years on Ogygia until Zeus commands his release (V).",
  },
  Polyphemus: {
    name: "Polyphemus",
    faction: "wanderings",
    light: "#8C2E1E", // ember-red — the monster, deliberately aligned with Achilles's wrath-color
    dark: "#C96550",
    note: "Cyclops, Poseidon's son; eats six of Odysseus's men; his curse drives the rest of the poem.",
  },
  Aeolus: {
    name: "Aeolus",
    faction: "wanderings",
    light: "#5A8CB0", // wind-blue
    dark: "#90B8D4",
    note: "Keeper of the winds on his floating island; gives Odysseus the bag, which his men open (X).",
  },
  Tiresias: {
    name: "Tiresias",
    faction: "shade",
    light: "#6B6B6B", // ash-gray — the blind seer among the dead
    dark: "#ACACAC",
    note: "Theban seer; prophesies Odysseus's return and the oar-inland mystery (XI).",
  },
  Elpenor: {
    name: "Elpenor",
    faction: "shade",
    light: "#6B6B6B",
    dark: "#ACACAC",
    note: "Youngest of the crew; falls from Circe's roof; first shade to meet Odysseus in XI, begs for burial.",
  },
  Ino: {
    name: "Ino",
    faction: "wanderings",
    light: "#5A8C9C", // sea-foam
    dark: "#90B8C4",
    note: "Leucothea, sea-goddess; gives Odysseus her veil to survive Poseidon's storm (V).",
  },
  Proteus: {
    name: "Proteus",
    faction: "wanderings",
    light: "#4A6B7A",
    dark: "#7E9CAE",
    note: "Shape-shifting Old Man of the Sea; Menelaus wrests prophecy from him (IV).",
  },
}

// ── Pylos / Sparta secondary cast ─────────────────────────────────────────

const PYLOS_SPARTA: Record<string, OdysseySpeakerColor> = {
  Peisistratus: {
    name: "Peisistratus",
    faction: "greek",
    light: "#8C6B3D",
    dark: "#B8966C",
    note: "Youngest son of Nestor; Telemachus's travel-companion in III–IV, XV.",
  },
  Megapenthes: {
    name: "Megapenthes",
    faction: "greek",
    light: "#8C4A3D",
    dark: "#B87A6E",
    note: "Menelaus's son by a slave woman; present at Sparta in IV.",
  },
}

// ── Aggregate palette ─────────────────────────────────────────────────────

export const ODYSSEY_SPEAKERS: Record<string, OdysseySpeakerColor> = {
  ...SHARED,
  ...ITHACA,
  ...SUITORS,
  ...PHAEACIANS,
  ...WANDERINGS,
  ...PYLOS_SPARTA,
}

// ── Aliases ───────────────────────────────────────────────────────────────
// Extend the Iliad table with Odyssey-only Bryant forms. Multi-word
// aliases are listed here too; lookup is case-insensitive.

export const ODYSSEY_SPEAKER_ALIASES: Record<string, string> = {
  ...ILIAD_SPEAKER_ALIASES,

  // Odyssey-unique Bryant variants
  "antinoüs": "Antinous",
  "alcinoüs": "Alcinous",
  "aretè": "Arete",
  "nausicaä": "Nausicaa",
  "circè": "Circe",
  "euryclea": "Eurycleia",
  "leucothea": "Ino",
  "leucothoë": "Ino",
  "polypheme": "Polyphemus",
  "cyclops": "Polyphemus",
  "teiresias": "Tiresias",
  "anticleia": "Anticlea",
  "icarius' daughter": "Penelope",
  "daughter of icarius": "Penelope",
  "pisistratus": "Peisistratus",
  "leodes": "Leiodes",

  // "Ulysses" is already aliased to Odysseus in the Iliad table — reused.
  // "Pallas", "Jove", "Jupiter", "Minerva", "Neptune", "Mercury", "Phoebus",
  // "Vulcan", "Mars", "Diana" likewise come through from the Iliad aliases.
}

// ── Resolvers ─────────────────────────────────────────────────────────────

/**
 * Resolve a Bryant-style name to its canonical entry in the Odyssey
 * palette. Returns null if no match (narrator, or unknown).
 *
 * Identical in shape to `resolveIliadSpeaker` — a single component can
 * pass the raw `data-*-speaker` value through whichever resolver matches
 * the current book.
 */
export function resolveOdysseySpeaker(rawName: string): OdysseySpeakerColor | null {
  if (!rawName) return null
  const normalized = rawName.trim().toLowerCase()
  const canonical = ODYSSEY_SPEAKER_ALIASES[normalized] ?? rawName.trim()
  return (
    ODYSSEY_SPEAKERS[canonical] ??
    ODYSSEY_SPEAKERS[canonical.charAt(0).toUpperCase() + canonical.slice(1).toLowerCase()] ??
    null
  )
}

/**
 * Hex color for a speaker under the current theme, or null if not in
 * the palette. Mirrors `getIliadSpeakerColor` exactly.
 */
export function getOdysseySpeakerColor(
  rawName: string | null | undefined,
  isDark: boolean,
): string | null {
  if (!rawName) return null
  const entry = resolveOdysseySpeaker(rawName)
  if (!entry) return null
  return isDark ? entry.dark : entry.light
}

/**
 * The full list of canonical Odyssey speakers, in a display-friendly
 * order (shared Iliadic cast first, then household, suitors, Phaeacians,
 * wanderings & shades). Useful for the palette legend in the reader.
 */
export function listOdysseySpeakers(): OdysseySpeakerColor[] {
  return [
    ...Object.values(SHARED),
    ...Object.values(ITHACA),
    ...Object.values(SUITORS),
    ...Object.values(PHAEACIANS),
    ...Object.values(WANDERINGS),
    ...Object.values(PYLOS_SPARTA),
  ]
}

/**
 * Export re-read of the shared Iliadic subset for continuity tests.
 * A CI / audit script can assert that every hex value in SHARED matches
 * the corresponding value in ILIAD_SPEAKERS — guaranteeing the paired-
 * Homer reading experience is visually consistent across both epics.
 */
export function sharedIliadOdysseyContinuityReport(): Array<{
  name: string
  iliad: { light: string; dark: string } | null
  odyssey: { light: string; dark: string }
  matches: boolean
}> {
  return Object.entries(SHARED).map(([name, ody]) => {
    const ili = (ILIAD_SPEAKERS as Record<string, IliadSpeakerColor>)[name]
    return {
      name,
      iliad: ili ? { light: ili.light, dark: ili.dark } : null,
      odyssey: { light: ody.light, dark: ody.dark },
      matches: !!ili && ili.light === ody.light && ili.dark === ody.dark,
    }
  })
}
