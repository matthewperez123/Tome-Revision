import type { Annotation } from "../types"

// ── Beowulf Sonnet Pass — intervening-fitt annotations ──────────────────
// A focused pass across the non-Opus material: Unferth flyting (IX–X),
// the Finnsburg lay (XVII–XVIII), Wealhtheow's admonition (XIX), the
// trophy return (XXV), and Beowulf's retrospective at Hygelac's court
// (XXX) with the Freawaru-Ingeld foreshadowing. Lower density than the
// Opus clusters by design; each annotation is a medium-weight scholarly
// note rather than the long-form Opus commentary.

export const BEOWULF_SONNET: Annotation[] = [
  // ── Fitt IX: Unferth's flyting ────────────────────────────────────
  {
    id: "beowulf-9-flyting",
    bookId: "beowulf",
    chapterNumber: 10,
    anchorText: "Unferth spoke up",
    anchorOccurrence: 1,
    title: "The flyting: a formal Germanic ritual",
    quotedPassage: "Unferth spoke up, Ecglaf his son, / Who sat at the feet of the lord of the Scyldings…",
    passageReference: "Fitt IX",
    commentary: `Unferth's challenge is not the personal resentment a modern reader hears. In Germanic warrior culture the *flyting* — a formal verbal contest — is a codified ritual, part of the etiquette of welcoming a heroic newcomer. The thyle (Unferth's court role) is expected to test the guest's reputation with sharpened words; the guest is expected to answer in kind. No one is dishonored by the exchange.

The stakes are social-legal. A warrior whose reputation cannot survive a flyting cannot be trusted with the defense of the hall. The ritual filters boasters from the genuinely heroic. Beowulf will answer Unferth with a version of the Breca swim-match in which his own reputation survives the scrutiny, and the two men are reconciled by Fitt XXII — where Unferth lends Beowulf the heirloom sword Hrunting for the descent into the mere.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
  {
    id: "beowulf-10-breca",
    bookId: "beowulf",
    chapterNumber: 11,
    anchorText: "So ill-meaning enemies",
    anchorOccurrence: 1,
    title: "The Breca swim: Beowulf's answer",
    quotedPassage: "So ill-meaning enemies often did cause me / Sorrow the sorest. I served them, in quittance, / With my dear-lovèd sword…",
    passageReference: "Fitt X",
    commentary: `Beowulf tells his version of the Breca match — a seven-day swim-contest against sea-monsters in his youth. Unferth's version (Fitt IX) had framed it as a reckless boyish challenge Beowulf lost. Beowulf's corrects the account: he killed nine sea-creatures, the waters were calmer than Unferth claims, and he emerged on the Finnish coast with the bodies as proof.

What matters about the two accounts is not which is historically true — the poem offers no arbiter. What matters is the *rhetorical* framework: warrior-culture honor is partly constituted by narrative. The two men are arguing over the shape of a reputation. After Beowulf's answer the hall falls back to laughter and mead; the flyting has been resolved not by fact but by rhetorical skill. This is the same logic that shapes the whole poem's embedded lays — what is said about a deed becomes part of the deed.`,
    crossReferences: [],
    tags: ["literary-influence", "historical"],
  },

  // ── Fitt XVII–XVIII: Finnsburg lay ────────────────────────────────
  {
    id: "beowulf-17-finnsburg",
    bookId: "beowulf",
    chapterNumber: 18,
    anchorText: "Finn and Hnaef",
    anchorOccurrence: 1,
    title: "The Finnsburg lay: a poem within the poem",
    quotedPassage: "…the Scop's Song of Finn and Hnaef…",
    passageReference: "Fitt XVII",
    commentary: `The scop at Heorot's victory feast improvises a lay about a separate heroic story: a feud between Danes and Frisians, a broken peace, a pyre, a winter of uneasy truce, a vengeance-killing in the spring. This is one of the longest embedded narratives in the poem, roughly 90 lines, and its relationship to the main plot is thematic rather than causal.

A second witness to this same material survives — *The Fight at Finnsburg*, a 48-line Old English fragment preserved separately. Comparing the two tells us something subtle: the scop at Heorot is *not* reciting a fixed text. He is improvising a version of a story his audience already knows from other performances. The Beowulf-poet is showing us how oral poetry worked — one shared tradition, many performances, each distinct. Notice what the Heorot performance chooses to emphasize: Hildeburh's grief (the Frisian queen who loses her brother and her son in the feud). The scop picks the detail that will most land on *this* audience, in which another queen, Wealhtheow, is listening.`,
    crossReferences: [],
    tags: ["literary-influence", "historical"],
  },
  {
    id: "beowulf-18-hildeburh",
    bookId: "beowulf",
    chapterNumber: 19,
    anchorText: "Hengest",
    anchorOccurrence: 1,
    title: "Hengest's winter: feud and peace-weaving",
    quotedPassage: "Hengest continued / Biding with Finn the blood-tainted winter…",
    passageReference: "Fitt XVIII",
    commentary: `The Finnsburg lay turns on the figure of Hengest — leader of the Danish survivors, obliged by the winter-truce to live in Finn's hall until spring. The audience understands, as Hengest does, that his position is intolerable: his lord has been killed by his host, and only the weather is keeping his vengeance sheathed. The spring thaw is the end of the pause, not a reconciliation.

This is the Germanic feud-world's most precise moral crystallization: peace is not a condition but a suspension. Wergild can be paid and settlements sworn, but the blood-memory of the slain waits under the ice. When spring breaks, so does the peace. The scop is telling this story to an audience — Wealhtheow, Hrothgar, Hrothulf — whose own peace is also only a pause, whose feuds in the Danish royal house are foreshadowed rather than resolved. The embedded lay is a mirror.`,
    crossReferences: [],
    tags: ["historical", "literary-influence", "philosophical"],
  },

  // ── Fitt XIX: Wealhtheow's speech ─────────────────────────────────
  {
    id: "beowulf-19-wealhtheow",
    bookId: "beowulf",
    chapterNumber: 20,
    anchorText: "A beaker was borne him",
    anchorOccurrence: 1,
    title: "Wealhtheow's admonition: the peace-weaver speaks",
    quotedPassage: "A beaker was borne him, and bidding to quaff it / Graciously given, and gold that was twisted / Pleasantly proffered…",
    passageReference: "Fitt XIX",
    commentary: `After the Finnsburg lay, Wealhtheow steps forward, pours for Hrothgar and Beowulf in turn, and speaks. Her speech is addressed to Hrothgar but everyone in the hall is her audience. She congratulates Beowulf, thanks him for the Grendel-killing, but — and this is the move — she asks Hrothgar not to bypass the royal bloodline: when the kingdom needs a guardian, he should trust Hrothulf (his nephew and co-ruler) and the Danish princes, not adopt Beowulf as his heir.

The poem's dramatic irony is heavy here. Later in the oral tradition (and perhaps implied by a scene the poem leaves tacit), Hrothulf is supposed to have usurped the throne from Hrothgar's sons after Hrothgar's death. Wealhtheow's confidence in Hrothulf is, if you know the tradition, misplaced. The peace-weaver queen — whose political function is to keep the dynasty intact through her own marriage and through counsel — is here weaving a peace that will not hold. The scene is one of the poem's darkest ironies, and shows how thoroughly the Beowulf-poet assumes his audience knows the larger Scandinavian legend-cycle.`,
    crossReferences: [],
    tags: ["historical", "philosophical", "literary-influence"],
  },

  // ── Fitt XXV: trophy return ──────────────────────────────────────
  {
    id: "beowulf-25-trophies",
    bookId: "beowulf",
    chapterNumber: 26,
    anchorText: "we blithely have brought thee",
    anchorOccurrence: 1,
    title: "Grendel's head: the trophy as proof",
    quotedPassage: "'Lo! we blithely have brought thee, bairn of Healfdene, / Prince of the Scyldings, these presents from ocean…'",
    passageReference: "Fitt XXV",
    commentary: `Beowulf presents Hrothgar with the trophies of the mere-fight: Grendel's severed head (so large it requires four men to carry it on a spear-shaft) and the melted-down hilt of the giants' sword. This is not ceremonial flourish; in Germanic warrior culture, the physical trophy *is* the proof. A boast without a corpse or a token is just words. The two objects are the material evidence that the feud with the Grendel-kin is settled.

Then the poem does something unusual. Hrothgar takes the sword-hilt in his hand and *reads* it — the poet uses the word that literally means "looks upon," but the sense is of decipherment. The hilt is engraved with runes telling of the Flood, the destruction of the giants, the origin of the race of monsters whose line Grendel and his mother descend from. Hrothgar reads, in essence, the cause of what just ended. The trophy is not only proof; it is explanation. This small passage is why the sermon that follows in Fitt XXVI is moral rather than merely grateful.`,
    crossReferences: [],
    tags: ["mythological", "historical", "literary-influence"],
  },

  // ── Fitt XXX: Beowulf's retrospective + Freawaru-Ingeld ─────────
  {
    id: "beowulf-30-freawaru",
    bookId: "beowulf",
    chapterNumber: 31,
    anchorText: "Heathobards",
    anchorOccurrence: 1,
    title: "The Freawaru-Ingeld digression: a peace that will not hold",
    quotedPassage: "It well may discomfit the prince of the Heathobards / And each of the thanemen of earls that attend him, / When he goes to the building escorting the woman…",
    passageReference: "Fitt XXX",
    commentary: `Back in Geatland, Beowulf retells his adventures to Hygelac — but he adds material we have not seen before. Among Hrothgar's recent decisions, Beowulf reports, was to give his daughter Freawaru in marriage to Ingeld, prince of the Heathobards, in the hope of ending an old feud through peace-weaving. Beowulf then *predicts* how the peace will fail: at a feast, an old Heathobard warrior will see the Danish escort wearing swords that once belonged to his father's generation (loot from the feud Ingeld is supposed to be forgetting); he will whisper in a young man's ear; a killing will follow; the old feud will reopen.

This is Beowulf at his most politically perceptive — the aged heroic instinct reading the mechanics of Germanic feud-economy with clinical precision. The passage also shows the poem's characteristic technique: it tells us what will happen in a key passage of later Scandinavian history as *prophecy* within a character's speech, rather than showing it directly. The Beowulf-poet assumes his audience knows that Ingeld eventually burned Heorot. Hrothgar's great hall, the poem's central image of civilization, is fated to fall — and the cause is already present, as a wedding gift, in the material the poem has just described.`,
    crossReferences: [],
    tags: ["historical", "philosophical", "literary-influence"],
  },

  // ── Fitt VI: Beowulf introduces himself ──────────────────────────
  {
    id: "beowulf-6-introduction",
    bookId: "beowulf",
    chapterNumber: 7,
    anchorText: "Beowulf Introduces Himself",
    anchorOccurrence: 1,
    title: "The hero's formal arrival: how to name yourself in a hall",
    quotedPassage: "VI: Beowulf Introduces Himself at the Palace",
    passageReference: "Fitt VI",
    commentary: `Beowulf's self-presentation at Hrothgar's door is a formal speech-act. He names his lord (Hygelac), his father (Ecgtheow), his people (the Geats), and — only then — his errand (the monster at Heorot). This is the Germanic etiquette of the hall: a hero is identified by his kin-bonds before his deeds are weighed.

Notice what the poem does NOT do: Beowulf never simply says "I am Beowulf" in these passages the way a Homeric hero might say "I am Odysseus, sacker of cities." His name comes late, embedded in genealogical context. The heroic self is not a solitary ego; it is a specific position in a web of kinship and allegiance. The later emphasis on Beowulf's kin-slaying *avoidance* — his dying boast that he has not killed his own — follows directly from this social grammar. You are your kin-network or you are nothing.`,
    crossReferences: [],
    tags: ["historical", "linguistic", "philosophical"],
  },

  // ── Fitt VII: Hrothgar recognizes Beowulf ────────────────────────
  {
    id: "beowulf-7-old-debt",
    bookId: "beowulf",
    chapterNumber: 8,
    anchorText: "Hrothgar and Beowulf",
    anchorOccurrence: 1,
    title: "The old debt: why Hrothgar welcomes Beowulf",
    quotedPassage: "VII: Hrothgar and Beowulf",
    passageReference: "Fitt VII",
    commentary: `Hrothgar recognizes Beowulf not by personal acquaintance (they have not met) but by a debt in the kinship-network: Beowulf's father Ecgtheow had once started a feud by killing a warrior of the Wulfings; Hrothgar, when Ecgtheow came to him as an exile, paid the wergild to the Wulfings on Ecgtheow's behalf and received him into the comitatus. That was a generation ago. Now Ecgtheow's son arrives offering to fight Hrothgar's monster — and the kinship-ledger is rebalanced.

This small exchange, compressed into a brief speech, encapsulates the moral physics of the Germanic hall. Help freely given creates an obligation that follows the kin-line across generations. A man does not repay his father's rescuer directly — but the rescuer's problem, when it comes, is now his. This is how the poem's moral economy works, and it will still be recognizable to Wiglaf at the dragon-fight fifty years later.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },

  // ── Fitt XI: Night in Heorot ─────────────────────────────────────
  {
    id: "beowulf-11-all-sleep",
    bookId: "beowulf",
    chapterNumber: 12,
    anchorText: "All Sleep Save One",
    anchorOccurrence: 1,
    title: "Nightfall in Heorot — the title's cold arithmetic",
    quotedPassage: "XI: All Sleep Save One",
    passageReference: "Fitt XI",
    commentary: `The fitt title is almost laconic, and the action matches. The Geats bed down among the Danish thanes. Hrothgar retires. The hall goes quiet. Grendel is coming tonight, and everyone in Heorot knows it. One man — Beowulf — stays awake.

The poem's rhetorical economy here is remarkable. No speeches, no elaborate descriptions, no summary: just the extinguishing of the feast, the night falling over the hall, a single waking figure. This is the same compression the poet will use at the moment before the dragon-fight — the hero alone as the dark closes. It is the shape of Beowulf's story at both ends: everyone sleeps; one man watches; the monster arrives.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical"],
  },

  // ── Fitt XXVIII: Return & the two queens ─────────────────────────
  {
    id: "beowulf-28-modthryth",
    bookId: "beowulf",
    chapterNumber: 29,
    anchorText: "The Two Queens",
    anchorOccurrence: 1,
    title: "The Modthryth digression: Hygd's foil",
    quotedPassage: "XXVIII: The Homeward Journey—The Two Queens",
    passageReference: "Fitt XXVIII",
    commentary: `Arriving back at Hygelac's court, Beowulf finds Hygd — Hygelac's young queen — presiding with wisdom and generosity. The poet then detours into the story of Modthryth, a different queen from a different tradition, who had young men killed for looking at her until marriage to Offa reformed her. The point of the Modthryth digression is contrast: this is what a queen in the Germanic imagination can go wrong as, and this is what Hygd is *not*.

Modthryth is cited nowhere else in surviving Old English literature in quite this form, and scholars disagree about what she originally was in the oral tradition — a Thracian princess, a Mercian queen, an abstraction. What matters is the use the Beowulf-poet makes of her: female rule comes with the same moral dangers and the same possibilities of virtue that male rule does, and the poem quietly refuses the lazy reading in which peace-weaving queens are merely decorative. Hygd, like Wealhtheow, is a political figure; Modthryth is a political failure; the contrast is structural.`,
    crossReferences: [],
    tags: ["historical", "philosophical", "literary-influence"],
  },

  // ── Fitt XXXI: the fifty-year compression ────────────────────────
  {
    id: "beowulf-31-fifty-years",
    bookId: "beowulf",
    chapterNumber: 32,
    anchorText: "Gift-Giving Is Mutual",
    anchorOccurrence: 1,
    title: "The poem's most compressed passage: a life passes in twenty lines",
    quotedPassage: "XXXI: Gift-Giving Is Mutual",
    passageReference: "Fitt XXXI",
    commentary: `After Beowulf has distributed Hrothgar's gifts at Hygelac's court, and Hygelac in turn has rewarded him with land and heirlooms, the poem covers the next fifty years in a handful of lines. Hygelac dies in a raid on the Franks; his son Heardred takes the throne; Heardred is killed in the Swedish wars; Beowulf becomes king of the Geats and rules for fifty winters in peace.

This is the poem's most extraordinary narrative compression. An entire lifetime of kingship, a whole generation of Geatish-Swedish wars, the death of Hygelac's line and the transfer of the throne to Beowulf — all fit into the space a Greek epic might give to a single afternoon's feast. The poet is saving his attention for the dragon fight, which occupies roughly the final third of the poem. Everything between the Danish court and the dragon is distilled to setup. In ring-composition terms: the long summer is compressed so the long winter of the ending can be granted its full weight.`,
    crossReferences: [],
    tags: ["literary-influence", "historical", "philosophical"],
  },

  // ── Fitt XVI: gift-giving scene ──────────────────────────────────
  {
    id: "beowulf-16-gifts",
    bookId: "beowulf",
    chapterNumber: 17,
    anchorText: "Lavishes Gifts",
    anchorOccurrence: 1,
    title: "Ring-giver, ring-receiver: the comitatus economy made visible",
    quotedPassage: "XVI: Hrothgar Lavishes Gifts Upon His Deliverer",
    passageReference: "Fitt XVI",
    commentary: `Hrothgar's gifts to Beowulf — gold standard, helm, sword, mail-shirt, eight horses with jeweled saddle, the right to a share of the hall's treasure — are specific and itemized. In the Germanic hall economy, this is not reward *after* the victory; it is the *completion* of the victory. A monster-killing that does not end in ring-giving is an incomplete act in this social grammar.

Each gifted object carries genealogy. The sword, we are told, had been owned by so-and-so; the helm had been made by such-and-such a smith. The heroic personal possession is layered with prior ownership, and gifts add further layers. Notice that in this passage Beowulf's victory over Grendel is re-told *through objects*: the retelling is not what happened but what was given for it. This is why the poem spends so much text on catalogues of treasure. The economy of gift is how the poem understands deeds.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },

  // ── Fitt XXI: Hrothgar's mere description ──────────────────────
  {
    id: "beowulf-21-visio",
    bookId: "beowulf",
    chapterNumber: 22,
    anchorText: "Hrothgar’s Account of the Monsters",
    anchorOccurrence: 1,
    title: "The mere, and its literary ancestors",
    quotedPassage: "XXI: Hrothgar's Account of the Monsters",
    passageReference: "Fitt XXI",
    commentary: `Hrothgar's famous description of the mere — deer dying at its edge rather than swimming in, fire burning on the water at night, the roots of black trees hanging over — has a literary ancestor. The apocryphal *Visio Sancti Pauli*, a Latin text popular in the Anglo-Saxon monastic imagination, describes a hellish landscape with fiery waters that the Beowulf-poet may have known. The borrowing (if it is one) is not mere reuse; it is *graft*, a Christian landscape-of-damnation imported onto pagan territory where it marks the monstrous as also infernal.

But the landscape is not only borrowed. The dread of wet places — mires, meres, fens — is indigenous to the Germanic imagination, and Old English has a dense vocabulary for them. The *Visio* gives the Beowulf-poet a license; the Germanic image-world gives him the content. The result is a landscape a modern reader still feels as haunted, because it is a layered haunting — a Christian overlay of Germanic dread of drowning-places. Both traditions are in the line.`,
    crossReferences: [],
    tags: ["historical", "literary-influence", "mythological"],
  },
]
