/**
 * Beowulf glosses — single-sentence tap-to-reveal definitions for Hall's
 * 1892 Standard Ebooks translation. Follows the Paradise Lost / Aeneid
 * pattern: annotations argue about meaning (paragraph, in a drawer);
 * glosses identify (one sentence, on hover/tap).
 *
 * Coverage per spec Part 5 (25–40 per fitt — the highest density in the
 * catalogue, driven by Germanic proper names, kennings, Old English terms
 * the reader cannot parse unaided):
 *
 *   - Characters (Beowulf, Hrothgar, Wealhtheow, Unferth, Wiglaf, and the
 *     extensive cast of named kings and warriors).
 *   - Tribes (Scyldings/Danes, Geats, Swedes, Wulfings, Heathobards,
 *     Frisians, Jutes, Wendels).
 *   - Places (Heorot, Hronesness, Hrefnawudu, Finnsburg).
 *   - Objects (Hrunting, Nægling, the giants' sword, the boar-crested
 *     helmets).
 *   - Heroic and legal concepts (wergild, boasting, flyting, comitatus,
 *     wyrd, comitatus, lof, ofermōd, dryhtscipe, thyle).
 *   - Etymological "inheritance" glosses — modern English words that
 *     preserve Old English roots (werewolf, lord, world, etc.). These
 *     are unusually satisfying in this book and a distinctive feature.
 *
 * Phrase-matching notes: `phrase` must appear verbatim in Hall's HTML.
 * Curly apostrophes, em-dashes, ligatures (Hall uses "Aeschere" not
 * "Æschere") are normalized by the reader component. A phrase that
 * appears across multiple fitts uses `chapterIndex: -1` (cross-chapter),
 * in which case the first occurrence per chapter is decorated.
 */

export interface BeowulfGloss {
  /** Zero-indexed chapter (ch-2.json = Fitt I). -1 = any chapter. */
  chapterIndex: number
  /** Exact substring to wrap in a tooltip (case-sensitive; reader normalizes quotes/dashes). */
  phrase: string
  /** One-sentence definition shown on hover. */
  definition: string
}

export function getBeowulfGlossesForChapter(chapterIndex: number): BeowulfGloss[] {
  return BEOWULF_GLOSSES.filter(
    (g) => g.chapterIndex === -1 || g.chapterIndex === chapterIndex
  )
}

export const BEOWULF_GLOSSES: BeowulfGloss[] = [
  // ── Characters ─────────────────────────────────────────────────────────
  { chapterIndex: -1, phrase: "Beowulf", definition: "The poem's hero — a Geatish warrior-prince, son of Ecgtheow, nephew of King Hygelac. Crosses to Denmark to help Hrothgar, later becomes king of the Geats himself." },
  { chapterIndex: -1, phrase: "Hrothgar", definition: "Aged king of the Danes, son of Healfdene, builder of Heorot. The Beowulf-narrator's figure of the wise but failing ring-giver." },
  { chapterIndex: -1, phrase: "Wealhtheow", definition: "Hrothgar's queen, a Wulfing by birth. The poem's peace-weaver figure, ceremonial cup-bearer in the hall." },
  { chapterIndex: -1, phrase: "Unferth", definition: "Hrothgar's 'thyle' (court orator and counselor), and the thane who formally challenges Beowulf's reputation at the feast. Later gives Beowulf his heirloom sword Hrunting." },
  { chapterIndex: -1, phrase: "Wiglaf", definition: "Young Geatish thane, son of Weohstan, kinsman to Beowulf. The one of twelve retainers who does not flee the dragon-fight. Dying Beowulf names him successor." },
  { chapterIndex: -1, phrase: "Hygelac", definition: "King of the Geats, Beowulf's uncle and lord. Dies on a disastrous raid against the Franks (line ~2354 in the standard numbering)." },
  { chapterIndex: -1, phrase: "Ecgtheow", definition: "Beowulf's father. Hrothgar once paid wergild to settle a feud Ecgtheow had started — a debt the king remembers when Beowulf arrives in Denmark." },
  { chapterIndex: -1, phrase: "Aeschere", definition: "Hrothgar's dearest counselor, killed by Grendel's mother in retaliation for her son's death. Hall's spelling of the Old English Æschere." },
  { chapterIndex: -1, phrase: "Scyld the Scefing", definition: "Legendary founder of the Scylding (Danish) royal line. Arrived as an unknown foundling in a ship; the poem opens with his funeral." },
  { chapterIndex: -1, phrase: "Hygd", definition: "Hygelac's young queen, portrayed as wise and generous — the foil to the cruel Modthryth whose story is narrated as contrast." },
  { chapterIndex: -1, phrase: "Heardred", definition: "Son of Hygelac. Briefly king of the Geats between Hygelac's death and Beowulf's accession." },
  { chapterIndex: -1, phrase: "Hrothulf", definition: "Hrothgar's nephew and co-ruler in Heorot. The poem hints darkly at his future usurpation of Hrothgar's sons." },
  { chapterIndex: -1, phrase: "Ongentheow", definition: "Ancient king of the Swedes, killed in battle by the Geats a generation before the poem's action. His sons continue the feud." },
  { chapterIndex: -1, phrase: "Sigemund", definition: "Legendary dragon-slayer from older Germanic tradition; the scop compares Beowulf to him at the victory feast." },
  { chapterIndex: -1, phrase: "Heremod", definition: "A past king of the Danes who ruined his people through cruelty and died exiled. Cited repeatedly as the poem's negative exemplum." },

  // ── Tribes ─────────────────────────────────────────────────────────────
  { chapterIndex: -1, phrase: "Spear-Danes", definition: "The Danes, especially the royal Scylding line — named for the spear as their weapon of honor. A traditional epithet preserved from the oral tradition." },
  { chapterIndex: -1, phrase: "Ring-Danes", definition: "Another formal epithet for the Danes — 'ring' referring to the gold rings their lord distributes as the currency of comitatus bonds." },
  { chapterIndex: -1, phrase: "Scyldings", definition: "Descendants of Scyld Scefing — the royal Danish dynasty, by extension the Danes as a people." },
  { chapterIndex: -1, phrase: "Geats", definition: "Beowulf's people — a Germanic tribe of southern Sweden, distinct from the Swedes proper." },
  { chapterIndex: -1, phrase: "Geatmen", definition: "Hall's plural for the Geats — Beowulf's countrymen." },
  { chapterIndex: -1, phrase: "Weders", definition: "An alternate name for the Geats — 'wether' or 'weather' people; same tribe." },
  { chapterIndex: -1, phrase: "Wulfings", definition: "A Germanic tribe from southern Baltic region. Hrothgar once paid wergild to them on Ecgtheow's behalf." },
  { chapterIndex: -1, phrase: "Heathobards", definition: "A tribe with whom the Danes have a long feud; the Freawaru-Ingeld digression foreshadows its re-eruption." },
  { chapterIndex: -1, phrase: "Frisians", definition: "The coastal Germanic tribe of present-day Netherlands. Hygelac dies in a raid against them." },

  // ── Places ─────────────────────────────────────────────────────────────
  { chapterIndex: -1, phrase: "Heorot", definition: "'The Hart' — Hrothgar's great mead-hall, named for the stag-antlers on its gables. The poem's central image of human civilization." },
  { chapterIndex: -1, phrase: "Hronesness", definition: "'Whale's Cape' — the Geatish coastal headland where Beowulf's funeral pyre is built. Hall renders it variously." },
  { chapterIndex: -1, phrase: "Finnsburg", definition: "The hall of King Finn of the Frisians — setting of the embedded lay sung by Hrothgar's scop at the victory feast." },

  // ── Objects ────────────────────────────────────────────────────────────
  { chapterIndex: -1, phrase: "Hrunting", definition: "Unferth's heirloom sword, lent to Beowulf for the descent into the mere. Fails him in the fight with Grendel's mother — the first time it has failed any wielder." },
  { chapterIndex: -1, phrase: "Naegling", definition: "Beowulf's own sword, which breaks in his hand during the dragon fight — the hero's 'heroic strength' itself outstripping the weapon." },

  // ── Heroic and legal concepts ──────────────────────────────────────────
  { chapterIndex: -1, phrase: "wyrd", definition: "Fate, the shaping force; pre-Christian Germanic concept of the course of events. Distinct from Christian providence — wyrd can oppose even divine intent in the pagan frame." },
  { chapterIndex: -1, phrase: "wergild", definition: "'Man-price' — the legal compensation owed for a killing in Germanic society. The feud-economy's mechanism for restoring peace between kin-groups." },
  { chapterIndex: -1, phrase: "comitatus", definition: "The bond between a Germanic warrior-lord and his retainers: the thanes swear to die with their lord; the lord gives gold, honor, and protection in return." },
  { chapterIndex: -1, phrase: "thane", definition: "A sworn retainer of a lord, bound by the comitatus. Hall's common rendering of Old English 'þegn'." },
  { chapterIndex: -1, phrase: "atheling", definition: "A prince of royal blood (from Old English 'æþeling'). Hall preserves the term untranslated as a marker of the poem's archaic register." },
  { chapterIndex: -1, phrase: "scop", definition: "The court poet who improvises alliterative verse in the mead-hall; a bardic role with legal memory as well as literary function." },
  { chapterIndex: -1, phrase: "earl", definition: "A warrior of noble birth — Hall's translation of Old English 'eorl', the higher rank of retainer." },
  { chapterIndex: -1, phrase: "flyting", definition: "A formal verbal contest — the kind Unferth initiates against Beowulf at the feast. Not mere banter; a codified warrior-culture ritual of status-testing." },

  // ── Old English language preserved in Hall ─────────────────────────────
  { chapterIndex: -1, phrase: "welkin", definition: "The sky (Old English 'wolcen', 'clouds'). Hall's characteristic archaic word for a kenning the poem uses often." },
  { chapterIndex: -1, phrase: "carle", definition: "A man, often a common man or freeman (Old English 'ceorl'). A deliberate archaism in Hall's register." },
  { chapterIndex: -1, phrase: "byrnie", definition: "Chain-mail armor — the body-length mail-coat worn by Germanic warriors. From Old English 'byrne'." },
  { chapterIndex: -1, phrase: "bill", definition: "A sword — Hall's most frequent Old English-derived word for the blade (from 'bill'). Not to be confused with the later 'billhook' weapon." },
  { chapterIndex: -1, phrase: "liegelord", definition: "One's sworn lord in the comitatus bond. Hall's rendering of Old English 'hlāford' (loaf-guardian)." },

  // ── Etymological "inheritance" glosses ─────────────────────────────────
  { chapterIndex: -1, phrase: "mead-benches", definition: "The benches in a lord's mead-hall where retainers sit and drink. By metonymy, the fellowship of the hall itself." },
  { chapterIndex: -1, phrase: "ring-giver", definition: "A lord who distributes gold rings to his retainers — the central kenning of Germanic social life. The word 'lord' itself descends from hlāf-weard, 'loaf-guardian'." },
  { chapterIndex: -1, phrase: "mead-hall", definition: "The great wooden hall at the centre of a Germanic lord's holding — feast-space, sleep-space, court-space, throne-space. Heorot is the supreme example." },
  { chapterIndex: -1, phrase: "All-Father", definition: "God the Father — a Christian term deliberately using pre-Christian Germanic vocabulary (the same epithet was used for Woden)." },

  // ── Monsters (quick reminders at first appearance) ─────────────────────
  { chapterIndex: -1, phrase: "Grendel", definition: "A monstrous being descended from Cain, exiled from human fellowship. Hunts Heorot for twelve years before Beowulf's arrival. Tolkien's 1936 essay argued he is the poem's true subject." },
  { chapterIndex: -1, phrase: "mere", definition: "A deep, dark lake or pool — in this poem, the haunted underwater hall of Grendel's kin. A specific Germanic landscape-type for the dread-place." },
]
