/**
 * Aeneid Speaker Palette — faction-coded colors for Virgil's Aeneid
 * (John Dryden translation, 1697 — heroic couplets, Standard Ebooks edition).
 *
 * Three factions plus two mortal-exile groupings:
 *   - Trojan-exile (Aeneas and his band, after Troy falls) — imperial bronze
 *   - Carthaginian                                         — burning carmine
 *   - Italian                                              — iron and laurel
 *   - Gods (under Roman names)                             — mythic colors
 *
 * Virgil's gods share palette with Homer's gods (Juno is peacock, same as
 * Hera; Venus is pale rose, same as Aphrodite) so the classical triad
 * reads as one continuous palette across the library. The Homeric hues
 * are imported directly from iliad-speakers.ts — a single source of truth
 * for Olympian color.
 *
 * Dryden uses Roman god-names throughout (Juno, Venus, Jove, Vulcan);
 * canonical keys in this palette are likewise ROMAN, with Greek forms
 * listed as aliases so readers coming from the Iliad / Odyssey still
 * resolve. This is the one case where we invert the Iliad convention,
 * because the Aeneid is thematically a Roman poem and its speaker cards
 * should name the gods as Virgil names them.
 *
 * Shared HEROIC figures (Odysseus/Ulysses — cursed by Aeneas; Helen,
 * Priam, Hecuba, Andromache, Achilles, Pyrrhus) carry their Iliad /
 * Odyssey colors unchanged; they are re-exported rather than redefined.
 */

import { ILIAD_SPEAKERS, type IliadSpeakerColor } from "./iliad-speakers"

export type AeneidFaction =
  | "trojan-exile"   // Aeneas and his remnant
  | "carthaginian"   // Dido, Anna, Iarbas, the Tyrian refugees
  | "italian"        // Latinus, Turnus, Evander, Camilla, Mezentius, Lavinia…
  | "god"            // Olympians under Roman names
  | "greek"          // Homeric Greeks referenced (Ulysses, Pyrrhus)
  | "trojan"         // pre-fall Trojans recalled (Priam, Hector, Helen)
  | "underworld"     // the Sibyl, shades, Charon
  | "narrator"

export interface AeneidSpeakerColor {
  /** Canonical name — ROMAN for gods (Juno, Venus, Jove), regional otherwise. */
  name: string
  faction: AeneidFaction
  light: string
  dark: string
  /** Short scholium shown on hover / in a legend. */
  note: string
}

// ── Trojan exiles: imperial bronze, duty-weighted ────────────────────────

const TROJAN_EXILES: Record<string, AeneidSpeakerColor> = {
  Aeneas: {
    name: "Aeneas",
    faction: "trojan-exile",
    light: "#7A5A1F",  // imperial bronze with a gold undertone — duty, not brightness
    dark: "#D6B06A",
    note: "pius Aeneas — son of Anchises and Venus, bearer of the Trojan Penates into Italy.",
  },
  Anchises: {
    name: "Anchises",
    faction: "trojan-exile",
    light: "#6E6B5A",  // silver with a warm tinge — paternal, prophetic, Elysian
    dark: "#C8C2A8",
    note: "Father of Aeneas; dies at Drepanum (III); greets his son in the Fields of Elysium (VI).",
  },
  Ascanius: {
    name: "Ascanius",
    faction: "trojan-exile",
    light: "#B88A3C",  // soft dawn-gold — youth, futurity
    dark: "#E8C070",
    note: "Also Iulus; son of Aeneas and Creusa; ancestor of the gens Iulia. Wins his first kill in IX.",
  },
  Creusa: {
    name: "Creusa",
    faction: "trojan-exile",
    light: "#8A8898",  // pearl — the ghost-wife, seen once, lost forever
    dark: "#BEBCCA",
    note: "Wife of Aeneas; lost in the sack of Troy (II); her shade prophesies Italy before vanishing.",
  },
  Achates: {
    name: "Achates",
    faction: "trojan-exile",
    light: "#7C6B48",  // steadfast bronze, dimmer than Aeneas
    dark: "#BDA878",
    note: "fidus Achates — Aeneas's loyal companion; the epithet fidelitas personified.",
  },
  Ilioneus: {
    name: "Ilioneus",
    faction: "trojan-exile",
    light: "#6E5A3C",
    dark: "#B69670",
    note: "Elder Trojan; spokesman for the shipwrecked Trojans before Dido (I) and Latinus (VII).",
  },
  Palinurus: {
    name: "Palinurus",
    faction: "trojan-exile",
    light: "#4A5A6E",  // drowsy sea-blue
    dark: "#8EA2B8",
    note: "Helmsman of Aeneas's ship; lulled overboard by Sleep (V); his unburied shade begs passage at the Styx (VI).",
  },
  Panthus: {
    name: "Panthus",
    faction: "trojan-exile",
    light: "#6B5A4A",
    dark: "#B09A82",
    note: "Priest of Apollo on the Trojan citadel; brings the household gods to Aeneas as Troy burns (II).",
  },
  Deiphobus: {
    name: "Deiphobus",
    faction: "trojan-exile",
    light: "#7C4A52",  // wound-rose — he appears mutilated in Book VI
    dark: "#BE8890",
    note: "Son of Priam; Helen's husband after Paris's death; butchered on the last night of Troy; his shade tells Aeneas the truth (VI).",
  },
}

// ── Carthaginians: burning carmine, regal and doomed ─────────────────────

const CARTHAGINIANS: Record<string, AeneidSpeakerColor> = {
  Dido: {
    name: "Dido",
    faction: "carthaginian",
    light: "#8E1F2F",  // deep carmine with gold — regal, burning; hotter than any Homeric woman
    dark: "#E05068",
    note: "infelix Dido — Phoenician founder of Carthage; falls for Aeneas; ends on the pyre (IV).",
  },
  Anna: {
    name: "Anna",
    faction: "carthaginian",
    light: "#A85060",  // softer rose — her sister's confidante
    dark: "#D88898",
    note: "Dido's sister and confidante; her counsel in IV seals the tragedy.",
  },
  Iarbas: {
    name: "Iarbas",
    faction: "carthaginian",
    light: "#7A3A28",  // sun-burnt terracotta — African prince, Jupiter's son
    dark: "#C2725A",
    note: "African prince, rejected suitor of Dido; his prayer to Jupiter prompts Mercury's mission (IV).",
  },
  Sychaeus: {
    name: "Sychaeus",
    faction: "carthaginian",
    light: "#4A3040",  // funereal plum — he is a ghost before the poem begins
    dark: "#8E7080",
    note: "Dido's murdered first husband; his shade receives her in the underworld (VI).",
  },
}

// ── Italians: iron and laurel ────────────────────────────────────────────

const ITALIANS: Record<string, AeneidSpeakerColor> = {
  Turnus: {
    name: "Turnus",
    faction: "italian",
    light: "#8B1A1A",  // blood-red — the Italian Achilles, rage-driven, doomed
    dark: "#DD5252",
    note: "Rutulian prince, betrothed to Lavinia before Aeneas; his killing closes the poem on moral ambiguity (XII).",
  },
  Latinus: {
    name: "Latinus",
    faction: "italian",
    light: "#4E3E6C",  // imperial violet — the aged, overborne king
    dark: "#9A8AC8",
    note: "Aged king of the Latins; offers Lavinia to Aeneas; overruled by his wife and Juno's Fury.",
  },
  Amata: {
    name: "Amata",
    faction: "italian",
    light: "#6C2C48",  // stormy rose — maddened by Allecto's serpent
    dark: "#B06A88",
    note: "Queen of Latium; maddened by Allecto to oppose the Trojan match; takes her own life in XII.",
  },
  Lavinia: {
    name: "Lavinia",
    faction: "italian",
    light: "#C8A2B0",  // pale rose — barely a character; present as cause
    dark: "#E8C8D4",
    note: "Daughter of Latinus; future wife of Aeneas; Virgil gives her almost no speech — the palette reflects the restraint.",
  },
  Mezentius: {
    name: "Mezentius",
    faction: "italian",
    light: "#4E4E54",  // iron gray — the contemptor divum
    dark: "#9A9AA2",
    note: "Exiled Etruscan tyrant, contemptor divum (despiser of the gods); killed by Aeneas in X after his son Lausus dies for him.",
  },
  Lausus: {
    name: "Lausus",
    faction: "italian",
    light: "#A88848",  // gilded bronze — son who dies for father, inverting Aeneas
    dark: "#E0BC74",
    note: "Son of Mezentius; dies defending his father; Aeneas mourns him even as he kills him (X).",
  },
  Camilla: {
    name: "Camilla",
    faction: "italian",
    light: "#8E8C9E",  // silver and rose — the warrior-maiden of the Volsci
    dark: "#C4C2D6",
    note: "Virgin warrior of the Volsci; leads the cavalry; felled by Arruns's javelin (XI).",
  },
  Drances: {
    name: "Drances",
    faction: "italian",
    light: "#5C5248",  // ashen — the cowardly orator
    dark: "#A89888",
    note: "Latin senator; rhetorical opponent of Turnus; voices peace, scorned as a coward (XI).",
  },
  Evander: {
    name: "Evander",
    faction: "italian",
    light: "#4A6838",  // laurel green — Arcadian, pastoral, the good king
    dark: "#8CB07A",
    note: "Arcadian king settled at Pallanteum (the future Rome); Aeneas's host and ally (VIII).",
  },
  Pallas: {
    name: "Pallas",
    faction: "italian",
    light: "#D4B03A",  // bright gold — youth lost; his sword-belt closes the poem
    dark: "#F0D878",
    note: "Son of Evander; killed by Turnus in X; the stripped sword-belt becomes the poem's hinge-point in XII.",
  },
  Nisus: {
    name: "Nisus",
    faction: "italian",
    light: "#4A3A2C",  // night-raid umber
    dark: "#8A7058",
    note: "Trojan ally; lover and companion of Euryalus; dies avenging him in the night-raid (IX).",
  },
  Euryalus: {
    name: "Euryalus",
    faction: "italian",
    light: "#A8784C",  // youth-bronze, warmer than Nisus
    dark: "#E0B078",
    note: "Trojan ally, young beloved of Nisus; dies in the night-raid (IX) — fortunati ambo.",
  },
  Messapus: {
    name: "Messapus",
    faction: "italian",
    light: "#6E503A",
    dark: "#B08870",
    note: "Son of Neptune, Italian cavalry commander; fights for Turnus.",
  },
  Juturna: {
    name: "Juturna",
    faction: "italian",
    light: "#5A7888",  // Turnus-blue-gray — the river-nymph sister
    dark: "#9EBCCE",
    note: "Nymph-sister of Turnus, promoted by Juno; impersonates Metiscus to keep Turnus alive as long as fate allows (XII).",
  },
  "Tiberinus": {
    name: "Tiberinus",
    faction: "italian",
    light: "#3E5C68",  // Tiber-blue
    dark: "#86A4B2",
    note: "River-god of the Tiber; appears to Aeneas in a dream (VIII) and bids him seek Evander.",
  },
}

// ── The Sibyl and the underworld shades ──────────────────────────────────

const UNDERWORLD: Record<string, AeneidSpeakerColor> = {
  Sibyl: {
    name: "Sibyl",
    faction: "underworld",
    light: "#5A3A6A",  // prophetic violet
    dark: "#A482BA",
    note: "Sibyl of Cumae; Apollo's priestess; guides Aeneas through the underworld with the golden bough (VI).",
  },
  Charon: {
    name: "Charon",
    faction: "underworld",
    light: "#302A2E",  // stygian near-black
    dark: "#8C8488",
    note: "Ferryman of the Styx, horridus, with squalor on his cheeks (VI.298).",
  },
  Anchises_shade: {
    name: "Anchises",
    faction: "underworld",
    light: "#6E6B5A",
    dark: "#C8C2A8",
    note: "The Elysian Anchises; unfolds the parade of Roman heroes for his son (VI).",
  },
}

// ── Gods: Roman names, palette shared with Iliad/Odyssey ─────────────────

const GODS: Record<string, AeneidSpeakerColor> = {
  Jove: {
    name: "Jove",
    faction: "god",
    light: ILIAD_SPEAKERS.Zeus.light,
    dark: ILIAD_SPEAKERS.Zeus.dark,
    note: "Iuppiter / Jupiter — father of gods and men; the Aeneid's Olympian guarantor of fate.",
  },
  Juno: {
    name: "Juno",
    faction: "god",
    light: ILIAD_SPEAKERS.Hera.light,  // peacock — same as Hera
    dark: ILIAD_SPEAKERS.Hera.dark,
    note: "Iuno — the poem's hostile driver; saevae memorem Iunonis ob iram (I.4). Carries over from Hera.",
  },
  Venus: {
    name: "Venus",
    faction: "god",
    light: ILIAD_SPEAKERS.Aphrodite.light,  // pale rose — same as Aphrodite
    dark: ILIAD_SPEAKERS.Aphrodite.dark,
    note: "Aeneas's mother; protector of the Trojan line; her intercession shapes the poem's plot.",
  },
  Neptune: {
    name: "Neptune",
    faction: "god",
    light: ILIAD_SPEAKERS.Poseidon.light,
    dark: ILIAD_SPEAKERS.Poseidon.dark,
    note: "God of the sea; in the Aeneid unusually pro-Trojan — he calms Juno's storm (I) and saves the fleet.",
  },
  Mercury: {
    name: "Mercury",
    faction: "god",
    light: ILIAD_SPEAKERS.Hermes.light,
    dark: ILIAD_SPEAKERS.Hermes.dark,
    note: "Jupiter's messenger; his descent to Carthage (IV) triggers Aeneas's departure.",
  },
  Apollo: {
    name: "Apollo",
    faction: "god",
    light: ILIAD_SPEAKERS.Apollo.light,
    dark: ILIAD_SPEAKERS.Apollo.dark,
    note: "Phoebus Apollo; Trojan patron through the Delos oracle and the Sibyl.",
  },
  Mars: {
    name: "Mars",
    faction: "god",
    light: ILIAD_SPEAKERS.Ares.light,
    dark: ILIAD_SPEAKERS.Ares.dark,
    note: "Mavors / Gradivus; Roman war-god; his cult is older and weightier than Ares's was for Homer.",
  },
  Vulcan: {
    name: "Vulcan",
    faction: "god",
    light: ILIAD_SPEAKERS.Hephaestus.light,
    dark: ILIAD_SPEAKERS.Hephaestus.dark,
    note: "Forges Aeneas's shield (VIII) — Virgil's deliberate inversion of the Iliadic shield of Achilles.",
  },
  Diana: {
    name: "Diana",
    faction: "god",
    light: "#7A8898",  // silver-moon
    dark: "#BCC8D4",
    note: "Virgin huntress; Camilla's patron.",
  },
  Minerva: {
    name: "Minerva",
    faction: "god",
    light: ILIAD_SPEAKERS.Athena.light,
    dark: ILIAD_SPEAKERS.Athena.dark,
    note: "Pallas Minerva; appears briefly; her Trojan grievance (the Palladium, Laocoön) resounds in Book II.",
  },
  Aeolus: {
    name: "Aeolus",
    faction: "god",
    light: "#5A6070",  // storm-slate
    dark: "#9EA4B4",
    note: "King of the winds; unleashes the opening storm at Juno's bribe (I).",
  },
  Allecto: {
    name: "Allecto",
    faction: "god",
    light: "#3E1C28",  // fury-maroon
    dark: "#7E505C",
    note: "One of the three Furies; Juno sends her in VII to rouse Amata and Turnus.",
  },
  Cupid: {
    name: "Cupid",
    faction: "god",
    light: "#B86B88",  // Venus-rose
    dark: "#E09AB0",
    note: "Amor; disguised as Ascanius, kindles Dido's love (I).",
  },
  "Fame": {
    name: "Fame",
    faction: "god",
    light: "#5A4E3A",  // rumor-umber — for the Book IV personification of Fama
    dark: "#A89878",
    note: "Fama — Rumor; personified with a deliberate extended description in Book IV.",
  },
}

// ── Homeric cameos (pre-fall Trojans and Greek figures) ──────────────────
// These reuse Iliad palette exactly; Virgil names some by Latin form.

const HOMERIC_CAMEOS: Record<string, AeneidSpeakerColor> = {
  Priam: {
    name: "Priam",
    faction: "trojan",
    light: ILIAD_SPEAKERS.Priam.light,
    dark: ILIAD_SPEAKERS.Priam.dark,
    note: "Aged king of Troy; slaughtered by Pyrrhus at the altar in Book II.",
  },
  Hecuba: {
    name: "Hecuba",
    faction: "trojan",
    light: ILIAD_SPEAKERS.Hecuba.light,
    dark: ILIAD_SPEAKERS.Hecuba.dark,
    note: "Queen of Troy; witnesses Priam's death in Book II.",
  },
  Andromache: {
    name: "Andromache",
    faction: "trojan",
    light: ILIAD_SPEAKERS.Andromache.light,
    dark: ILIAD_SPEAKERS.Andromache.dark,
    note: "Hector's widow; encountered in Book III at Buthrotum, remarried to Helenus.",
  },
  Helenus: {
    name: "Helenus",
    faction: "trojan",
    light: "#6A5A78",  // prophetic dusk — son of Priam, Trojan seer
    dark: "#B0A0BE",
    note: "Son of Priam; Trojan seer; king of a little Troy-in-exile at Buthrotum (III).",
  },
  Helen: {
    name: "Helen",
    faction: "trojan",
    light: ILIAD_SPEAKERS.Helen.light,
    dark: ILIAD_SPEAKERS.Helen.dark,
    note: "Cause of the war; glimpsed hiding in the temple of Vesta on Troy's last night (II).",
  },
  Pyrrhus: {
    name: "Pyrrhus",
    faction: "greek",
    light: "#5E7A2E",  // harsh olive — Achilles's son at his worst
    dark: "#A2BE68",
    note: "Son of Achilles; kills Priam at the altar in II; the serpent-simile is Virgil's signature.",
  },
  Ulysses: {
    name: "Ulysses",
    faction: "greek",
    light: ILIAD_SPEAKERS.Odysseus.light,  // pale gold — same as Odysseus
    dark: ILIAD_SPEAKERS.Odysseus.dark,
    note: "Dryden's Latin form; in the Aeneid Ulysses never appears but is cursed — architect of the horse.",
  },
  Achilles: {
    name: "Achilles",
    faction: "greek",
    light: ILIAD_SPEAKERS.Achilles.light,
    dark: ILIAD_SPEAKERS.Achilles.dark,
    note: "Referenced throughout; his shade does not appear, but his presence shadows Turnus and Aeneas both.",
  },
  Sinon: {
    name: "Sinon",
    faction: "greek",
    light: "#6B6228",  // deceit-ochre
    dark: "#AFA462",
    note: "The Greek who tricks the Trojans into admitting the horse (II); perjury incarnate.",
  },
}

// ── Dryden name → canonical name aliases ─────────────────────────────────

/**
 * Dryden's variant names (and Greek alternatives for readers arriving
 * from the Iliad / Odyssey) mapped to canonical Roman entries. Multi-
 * word aliases are matched before single-word ones by the lookup loop.
 */
export const AENEID_SPEAKER_ALIASES: Record<string, string> = {
  // Gods: Greek name → Roman canonical (the Iliad convention inverted).
  // Readers arriving from Homer with "Zeus" / "Hera" still resolve.
  zeus: "Jove",
  jupiter: "Jove",
  "father jove": "Jove",
  "sire of gods": "Jove",
  hera: "Juno",
  "saturnian queen": "Juno",
  aphrodite: "Venus",
  "cytherean": "Venus",
  cytherea: "Venus",
  "queen of love": "Venus",
  poseidon: "Neptune",
  hermes: "Mercury",
  "cyllenian": "Mercury",
  phoebus: "Apollo",
  "phoebus apollo": "Apollo",
  delian: "Apollo",
  ares: "Mars",
  hephaestus: "Vulcan",
  "mulciber": "Vulcan",
  athena: "Minerva",
  pallas: "Minerva",
  "pallas athene": "Minerva",
  artemis: "Diana",
  "trivia": "Diana",
  // Heroic figures — Dryden variants
  odysseus: "Ulysses",
  "laertes' son": "Ulysses",
  neoptolemus: "Pyrrhus",
  iulus: "Ascanius",
  "anchises' son": "Aeneas",
  "son of anchises": "Aeneas",
  aeneides: "Aeneas",
  "trojan prince": "Aeneas",
  // Places / epithets occasionally used as attribution
  "cumaean maid": "Sibyl",
  "cumaean sibyl": "Sibyl",
  "deiphobé": "Sibyl",
  amor: "Cupid",
  "the queen": "Dido",
  "sidonian queen": "Dido",
  "tyrian queen": "Dido",
  fama: "Fame",
  // Italian epithets
  "daunian hero": "Turnus",
  "rutulian": "Turnus",
  "rutulian prince": "Turnus",
  "aged latinus": "Latinus",
  "latian king": "Latinus",
}

// ── Aggregate palette ────────────────────────────────────────────────────

export const AENEID_SPEAKERS: Record<string, AeneidSpeakerColor> = {
  ...TROJAN_EXILES,
  ...CARTHAGINIANS,
  ...ITALIANS,
  ...UNDERWORLD,
  ...GODS,
  ...HOMERIC_CAMEOS,
}

/**
 * Resolve a Dryden-style name to its canonical entry, following the
 * alias table. Returns null if no match (the narrator, or unknown).
 */
export function resolveAeneidSpeaker(rawName: string): AeneidSpeakerColor | null {
  if (!rawName) return null
  const normalized = rawName.trim().toLowerCase()
  const canonical = AENEID_SPEAKER_ALIASES[normalized] ?? rawName.trim()
  return (
    AENEID_SPEAKERS[canonical] ??
    AENEID_SPEAKERS[canonical.charAt(0).toUpperCase() + canonical.slice(1).toLowerCase()] ??
    null
  )
}

/**
 * Returns the correctly-themed hex color for a speaker, or null if the
 * speaker is not in the palette (e.g. the narrator, a one-line minor
 * warrior who is not speech-tagged).
 */
export function getAeneidSpeakerColor(
  rawName: string | null | undefined,
  isDark: boolean,
): string | null {
  if (!rawName) return null
  const entry = resolveAeneidSpeaker(rawName)
  if (!entry) return null
  return isDark ? entry.dark : entry.light
}

export type { IliadSpeakerColor }
