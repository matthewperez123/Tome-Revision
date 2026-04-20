/**
 * Beowulf fitt-level metadata — the 43 editorial sections of Hall's 1892
 * translation, whose numbers and titles follow the modern scholarly
 * reconstruction of the manuscript's capitalization patterns (the
 * manuscript itself has no book/chapter divisions; fitts are the editorial
 * convention).
 *
 * Used by the FittHeaderBlock to render a short scholarly argument above
 * each fitt, and to help the digression tracker flag embedded lays.
 */

export interface FittMeta {
  /** 1-based fitt number (I .. XLIII). */
  number: number
  /** Editorial title (Hall's). */
  title: string
  /** One-sentence scholarly argument. */
  argument: string
  /** Whether this fitt sits inside a known narrative digression. */
  digression?:
    | "scyld-prologue"
    | "sigemund"
    | "heremod"
    | "finnsburg"
    | "modthryth"
    | "freawaru-ingeld"
    | "geatish-swedish"
    | "retrospective"
}

// Numbers match chapter-1.xhtml .. chapter-43.xhtml from SE Hall.
export const FITT_METADATA: Record<number, FittMeta> = {
  1: { number: 1, title: "The Life and Death of Scyld", argument: "The Scyld Scefing prologue: the founder of the Danish royal line arrives as a foundling and departs by ship-burial — the poem's opening frame.", digression: "scyld-prologue" },
  2: { number: 2, title: "Scyld's Successors — Hrothgar's Great Mead-Hall", argument: "The Scylding dynasty to Hrothgar; the building of Heorot and the scop's Creation song that provokes the monster." },
  3: { number: 3, title: "Grendel the Murderer", argument: "Grendel, descendant of Cain, begins his twelve-year war against the hall." },
  4: { number: 4, title: "Beowulf Goes to Hrothgar's Assistance", argument: "The young Geat hears of Hrothgar's plight and sets out with his hand-picked company." },
  5: { number: 5, title: "The Geats Reach Heorot", argument: "Arrival in Denmark; the coastguard's challenge and reluctant welcome." },
  6: { number: 6, title: "Beowulf Introduces Himself at the Palace", argument: "Wulfgar announces the Geats; Beowulf states his name, lineage, and errand." },
  7: { number: 7, title: "Hrothgar and Beowulf", argument: "Hrothgar recognizes Beowulf as Ecgtheow's son; past debt and present need." },
  8: { number: 8, title: "Hrothgar and Beowulf — Continued", argument: "Hrothgar concludes his welcome; the feast begins." },
  9: { number: 9, title: "Unferth Taunts Beowulf", argument: "The flyting: Unferth the thyle challenges Beowulf's reputation with the Breca story." },
  10: { number: 10, title: "Beowulf Silences Unferth — Glee Is High", argument: "Beowulf answers the taunt, tells the true Breca tale, and vows to cleanse Heorot." },
  11: { number: 11, title: "All Sleep Save One", argument: "Nightfall in Heorot; the Geats lie down to sleep, Beowulf alone waits unarmed." },
  12: { number: 12, title: "Grendel and Beowulf", argument: "Grendel approaches the hall, devours a sleeping Geat, and meets the grip he cannot escape." },
  13: { number: 13, title: "Grendel Is Vanquished", argument: "The fight ends with Grendel's arm torn from the socket; he flees mortally wounded to the fen." },
  14: { number: 14, title: "Rejoicing of the Danes", argument: "Morning celebration; a scop improvises a lay comparing Beowulf to Sigemund, contrasting him with Heremod.", digression: "sigemund" },
  15: { number: 15, title: "Hrothgar's Gratitude", argument: "The king thanks Beowulf, claims him as a son, promises rich reward." },
  16: { number: 16, title: "Hrothgar Lavishes Gifts Upon His Deliverer", argument: "Gift-giving: gold standard, helm, mail-shirt, sword, eight horses, saddle." },
  17: { number: 17, title: "Banquet (Continued) — The Scop's Song of Finn and Hnaef", argument: "The scop sings the Finnsburg lay: a feud of Danes and Frisians, a broken peace, a burning pyre.", digression: "finnsburg" },
  18: { number: 18, title: "The Finn Episode (Continued) — The Banquet Continues", argument: "Hildeburh's grief; the second outbreak; Hengest's vengeance; the song ends and mead resumes.", digression: "finnsburg" },
  19: { number: 19, title: "Beowulf Receives Further Honor", argument: "Wealhtheow steps forward, pours for her husband and guest, warns Hrothgar against naming Beowulf heir." },
  20: { number: 20, title: "The Mother of Grendel", argument: "Sleep in Heorot; Grendel's mother comes avenging, kills Hrothgar's counselor Æschere, flees with the arm-trophy." },
  21: { number: 21, title: "Hrothgar's Account of the Monsters", argument: "Hrothgar describes the mere — the haunted underwater hall of the Grendel-kin — and asks Beowulf to go there." },
  22: { number: 22, title: "Beowulf Seeks Grendel's Mother", argument: "The ride to the mere; the sight of Æschere's head; Beowulf arms for the descent." },
  23: { number: 23, title: "Beowulf's Fight with Grendel's Mother", argument: "Beowulf plunges into the mere; Hrunting fails; he is borne to an underwater hall where the fight begins in earnest." },
  24: { number: 24, title: "Beowulf Is Double-Conqueror", argument: "The giants' ancient sword on the wall; Beowulf kills the mother, beheads Grendel's corpse, the blade melts in the venom." },
  25: { number: 25, title: "Beowulf Brings His Trophies — Hrothgar's Gratitude", argument: "Return to Heorot bearing Grendel's head and the golden sword-hilt; Hrothgar reads the runes on it." },
  26: { number: 26, title: "Hrothgar Moralizes — Rest After Labor", argument: "The aged king's wisdom-speech on pride, the soul's guardian, Heremod's fall — the poem's moral centerpiece.", digression: "heremod" },
  27: { number: 27, title: "Sorrow at Parting", argument: "Leave-taking; Hrothgar weeps; Beowulf promises further aid if ever needed." },
  28: { number: 28, title: "The Homeward Journey — The Two Queens", argument: "Voyage to Geatland; a digression contrasts the wise young Hygd with the murderous Modthryth.", digression: "modthryth" },
  29: { number: 29, title: "Beowulf and Hygelac", argument: "Beowulf presents himself at Hygelac's court." },
  30: { number: 30, title: "Beowulf Narrates His Adventures to Hygelac", argument: "Retrospective narration: Beowulf retells the story to his uncle, adding the Freawaru-Ingeld foreshadowing.", digression: "freawaru-ingeld" },
  31: { number: 31, title: "Gift-Giving Is Mutual", argument: "Beowulf presents Hrothgar's gifts; Hygelac grants him land and heirloom swords. Fifty years pass in brief summary." },
  32: { number: 32, title: "The Hoard and the Dragon", argument: "A thief rouses the dragon from its ancient barrow; the creature begins burning the Geatish kingdom." },
  33: { number: 33, title: "Brave Though Aged — Reminiscences", argument: "The aged king Beowulf reflects on his youth, the Swedish wars, Hygelac's death.", digression: "geatish-swedish" },
  34: { number: 34, title: "Beowulf Seeks the Dragon — Beowulf's Reminiscences", argument: "Setting out for the barrow; more retrospective on Hrethel's sons, Heathcyn and Herebeald.", digression: "retrospective" },
  35: { number: 35, title: "Reminiscences (Continued) — Beowulf's Last Battle", argument: "The dragon fight begins; the Geatish king's sword fails; his companions flee save one." },
  36: { number: 36, title: "Wiglaf the Trusty — Beowulf Is Deserted by Friends and by Sword", argument: "Wiglaf remembers his vow, arms himself, runs into the flame to stand beside his lord." },
  37: { number: 37, title: "The Fatal Struggle — Beowulf's Last Moments", argument: "Together they kill the dragon; Beowulf is mortally bitten; the wound begins to burn." },
  38: { number: 38, title: "Wiglaf Plunders the Dragon's Den — Beowulf's Death", argument: "Beowulf bids Wiglaf bring the hoard; the dying king looks on the gold and commands his barrow." },
  39: { number: 39, title: "The Dead Foes — Wiglaf's Bitter Taunts", argument: "The cowardly thanes return; Wiglaf rebukes them, foretelling their exile and the kingdom's end." },
  40: { number: 40, title: "The Messenger of Death", argument: "An unnamed herald rides to the Geatish camp to announce the king's death." },
  41: { number: 41, title: "The Messenger's Retrospect", argument: "The herald prophesies the coming Swedish wars, the ruin of the kingdom, the exile of the people.", digression: "geatish-swedish" },
  42: { number: 42, title: "Wiglaf's Sad Story — The Hoard Carried Off", argument: "Wiglaf leads the thanes to the barrow; the hoard, declared accursed, is carried out to be buried with the king." },
  43: { number: 43, title: "The Burning of Beowulf", argument: "The funeral pyre on Hronesness; the women's lament; twelve thanes ride round the barrow. The poem ends as it began — with a funeral." },
}
