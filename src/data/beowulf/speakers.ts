/**
 * Beowulf speaker palette — the voices of the oldest long poem in English,
 * in their approved reading-surface colors.
 *
 * Design rationale:
 *   - The narrator's "mead-hall fire" gold (#B8864D) honors the unironic
 *     gravity of the Beowulf-scop. It is warm, archaic, serious — distinct
 *     from Ariosto's Ferrara-red (courtly) and Byron's ink-blue (Regency
 *     satirical). The Beowulf-narrator's voice is northern firelight.
 *   - Beowulf himself is gold-and-iron (dugud): tried excellence, not
 *     Achilles's rage-ember, not Odysseus's cunning-pale-gold.
 *   - Hrothgar is silver with warm shadow — the aged lord who can no
 *     longer protect his people.
 *   - Wealhtheow is pearl with gold — the peace-weaver queen, ceremonial.
 *   - Unferth is muted steel with a crimson edge — jealous thane sharpening
 *     into mentor.
 *   - Grendel is obsidian with red-black — monstrous and Cain-damned,
 *     a darkness not entirely absent of sympathy.
 *   - Grendel's mother is deeper shadow with cold green — more formidable,
 *     avenging rather than predating.
 *   - The Dragon is ember and gold — ancient force, hoard-warm, implacable.
 *   - Wiglaf is pale gold with iron — inheritor of Beowulf's palette.
 *   - The Scop's voice-within-a-voice is soft amber.
 *   - Hygelac, Hygd, and the Geatish/Swedish/Danish royal lines get bronze
 *     variants — unified as "the northern kings," distinguished in glosses.
 *
 * Colors are chosen to work in both light and dark reader themes.
 */

export interface BeowulfSpeaker {
  id: string
  name: string
  color: string       // light-theme color
  darkColor: string   // dark-theme color
  group: "narrator" | "geats" | "danes" | "monsters" | "scop" | "royalty"
  note?: string
}

export const BEOWULF_SPEAKERS: BeowulfSpeaker[] = [
  // ── Narrator ─────────────────────────────────────────────────────────
  // Mead-hall fire gold. Applied as base text color for the narrator voice.
  {
    id: "Narrator",
    name: "The Beowulf-scop (narrator)",
    color: "#B8864D",
    darkColor: "#D9A86A",
    group: "narrator",
    note: "Mead-hall fire — warm, archaic, serious. The unironic gravity of the scop.",
  },

  // ── The Geats ────────────────────────────────────────────────────────
  {
    id: "Beowulf",
    name: "Beowulf",
    color: "#8B6B2F",
    darkColor: "#D4A74E",
    group: "geats",
    note: "Gold-and-iron — dugud, tried excellence. Not rage, not cunning: steadfast heroic virtue.",
  },
  {
    id: "Wiglaf",
    name: "Wiglaf",
    color: "#A58A5A",
    darkColor: "#C7B189",
    group: "geats",
    note: "Pale gold with iron — the young thane who stays. Inheritor of Beowulf's palette.",
  },
  {
    id: "Hygelac",
    name: "Hygelac",
    color: "#8C6840",
    darkColor: "#BF9669",
    group: "geats",
    note: "Bronze — king of the Geats, Beowulf's lord and uncle.",
  },
  {
    id: "Hygd",
    name: "Hygd",
    color: "#A6876A",
    darkColor: "#CFB395",
    group: "geats",
    note: "Soft bronze — Hygelac's young queen, foil to the Modthryth digression.",
  },
  {
    id: "Ecgtheow",
    name: "Ecgtheow",
    color: "#7A5B3A",
    darkColor: "#B89465",
    group: "geats",
    note: "Darker bronze — Beowulf's father; Hrothgar's past debt.",
  },

  // ── The Danes (Scyldings) ────────────────────────────────────────────
  {
    id: "Hrothgar",
    name: "Hrothgar",
    color: "#5A6373",
    darkColor: "#A8B0BE",
    group: "danes",
    note: "Silver with warm shadow — the aged lord who can no longer protect his people.",
  },
  {
    id: "Wealhtheow",
    name: "Wealhtheow",
    color: "#8F7F63",
    darkColor: "#D6C79E",
    group: "danes",
    note: "Pearl with gold — the peace-weaver queen. Dignified, ceremonial.",
  },
  {
    id: "Unferth",
    name: "Unferth",
    color: "#6B4A4A",
    darkColor: "#B08585",
    group: "danes",
    note: "Muted steel with a crimson edge — thyle, the jealous thane who challenges, then concedes.",
  },
  {
    id: "Aeschere",
    name: "Æschere",
    color: "#7A7F8B",
    darkColor: "#B6BCCB",
    group: "danes",
    note: "Silver-gray — Hrothgar's dearest counselor, taken by Grendel's mother.",
  },
  {
    id: "Hrothulf",
    name: "Hrothulf",
    color: "#525A66",
    darkColor: "#9CA5B5",
    group: "danes",
    note: "Cool gray — nephew in Heorot; the feast-scene's unspoken coming betrayal.",
  },

  // ── The Monsters ─────────────────────────────────────────────────────
  {
    id: "Grendel",
    name: "Grendel",
    color: "#2B1E1E",
    darkColor: "#7A3030",
    group: "monsters",
    note: "Obsidian and red-black — descendant of Cain, exile, grieving and terrible.",
  },
  {
    id: "GrendelsMother",
    name: "Grendel's Mother",
    color: "#2A2E28",
    darkColor: "#5E7A63",
    group: "monsters",
    note: "Deeper shadow with cold green — more formidable than her son, avenging rather than predating.",
  },
  {
    id: "Dragon",
    name: "The Dragon",
    color: "#9C4F1F",
    darkColor: "#E28A3C",
    group: "monsters",
    note: "Ember and gold — ancient, treasure-guarding, implacable. Hoard-warm. A force, not a fallen creature.",
  },

  // ── The Scop (voice-within-a-voice) ──────────────────────────────────
  {
    id: "Scop",
    name: "The Scop (court poet)",
    color: "#A17B3E",
    darkColor: "#D5A85F",
    group: "scop",
    note: "Soft amber — the voice-within-a-voice who sings the Finnsburg and Sigemund lays.",
  },

  // ── Named kings of the genealogical digressions ──────────────────────
  {
    id: "Sigemund",
    name: "Sigemund",
    color: "#8F6A3E",
    darkColor: "#C29659",
    group: "royalty",
    note: "Bronze — the dragon-slayer of the Volsung cycle; embedded lay compared to Beowulf.",
  },
  {
    id: "Heremod",
    name: "Heremod",
    color: "#6B4E2B",
    darkColor: "#A58150",
    group: "royalty",
    note: "Dark bronze — Danish king whose fall is the negative exemplum to Beowulf's virtue.",
  },
  {
    id: "Finn",
    name: "Finn",
    color: "#7F5E36",
    darkColor: "#B68B5B",
    group: "royalty",
    note: "Bronze — Frisian king of the embedded Finnsburg lay.",
  },
  {
    id: "Hildeburh",
    name: "Hildeburh",
    color: "#937B5E",
    darkColor: "#C5AC86",
    group: "royalty",
    note: "Ash-bronze — the grieving peace-weaver of the Finnsburg lay.",
  },
  {
    id: "Ongentheow",
    name: "Ongentheow",
    color: "#674A2A",
    darkColor: "#A17F53",
    group: "royalty",
    note: "Dark bronze — the Swedish king of the Geatish-Swedish war digressions.",
  },
  {
    id: "Heardred",
    name: "Heardred",
    color: "#8E7A5A",
    darkColor: "#C5AD85",
    group: "royalty",
    note: "Pale bronze — Hygelac's son, briefly king of the Geats before Beowulf.",
  },
  {
    id: "Freawaru",
    name: "Freawaru",
    color: "#A68A6A",
    darkColor: "#D1B48F",
    group: "royalty",
    note: "Soft bronze — Hrothgar's daughter; the Ingeld digression's foreshadowed peace-weaving.",
  },
  {
    id: "Messenger",
    name: "The Messenger",
    color: "#5E5146",
    darkColor: "#9A8A79",
    group: "royalty",
    note: "Muted bronze — the unnamed herald who prophesies the Geatish doom at Beowulf's death.",
  },
]

// Fast lookup by id.
export const BEOWULF_SPEAKERS_BY_ID = new Map(
  BEOWULF_SPEAKERS.map((s) => [s.id, s])
)

// Legend grouping for the UI, in the reader's emotional/dramatic order.
export const BEOWULF_LEGEND_GROUPS: Array<{
  id: BeowulfSpeaker["group"]
  label: string
  description: string
}> = [
  { id: "narrator", label: "Narrator", description: "The Beowulf-scop — mead-hall fire gold." },
  { id: "geats", label: "Geats", description: "Beowulf and his people — gold-and-iron." },
  { id: "danes", label: "Danes (Scyldings)", description: "Hrothgar's hall and court — silver and pearl." },
  { id: "monsters", label: "Monsters", description: "Grendel, his mother, the dragon — obsidian, shadow-green, ember." },
  { id: "scop", label: "The Scop", description: "The voice-within-a-voice — soft amber." },
  { id: "royalty", label: "Northern kings & queens", description: "Bronze variants — the genealogical and digression figures." },
]
