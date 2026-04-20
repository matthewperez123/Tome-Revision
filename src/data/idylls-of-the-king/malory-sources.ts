/**
 * Malory-source tracker for Idylls of the King.
 *
 * Tennyson's primary source for the Arthurian material is Sir Thomas
 * Malory's "Le Morte d'Arthur" (completed 1469–1470, printed by Caxton
 * 1485). The Geraint/Enid idylls derive from a secondary source:
 * Lady Charlotte Guest's 1838–45 translation of the medieval Welsh
 * Mabinogion. A handful of moments — Arthur's ambiguous parentage,
 * Gareth's specific allegorical knights, the framing of Modred — are
 * Tennyson's invention.
 *
 * The tracker surfaces, per idyll:
 *   1. The primary source work and its canonical reference
 *   2. The 3–8 most significant departures — what Malory has vs. what
 *      Tennyson does instead, with a short note on why the change matters
 *
 * When "Le Morte d'Arthur" is added to the Tome catalog, the
 * `malorySourceRef` strings here should become active cross-references.
 * Until then they are reference text (scholarly citation form:
 * Caxton book.chapter, e.g. "XVIII.9–20" for Book 18, chapters 9–20).
 */

export type SourceWork =
  | "malory-morte-darthur"
  | "mabinogion"
  | "mixed"
  | "tennyson-invention"

export interface MalorySourceDeparture {
  /** Short label naming the passage or moment */
  topic: string
  /** Approximate line range in Tennyson's idyll (purely advisory — exact
   *  anchoring will come when the tracker becomes clickable) */
  tennysonLines?: string
  /** What Malory has, stated in plain English */
  malorySource: string
  /** Caxton-book.chapter citation, or similar for Mabinogion */
  malorySourceRef: string
  /** What Tennyson does instead */
  tennysonVersion: string
  /** Why the change matters — the argument of the intervention */
  significance: string
}

export interface IdyllMalorySourceEntry {
  idyllIndex: number
  idyllTitle: string
  primarySource: SourceWork
  primarySourceRef: string
  primarySourceNote: string
  departures: MalorySourceDeparture[]
}

/**
 * The twelve idylls. The Dedication (ch-0) and To the Queen (ch-13) are
 * Tennyson's original framing verse and carry no Malory source.
 */
export const IDYLL_MALORY_SOURCES: Record<number, IdyllMalorySourceEntry> = {
  // ── Idyll I ───────────────────────────────────────────────────────
  1: {
    idyllIndex: 1,
    idyllTitle: "The Coming of Arthur",
    primarySource: "mixed",
    primarySourceRef:
      "Malory, Le Morte d'Arthur I.1–9 (Uther, Igraine, Arthur's birth; the sword in the stone) + Tennyson's own reframing",
    primarySourceNote:
      "Tennyson's opening idyll takes the Uther-and-Igraine material from the first chapters of Malory but deliberately clouds Arthur's parentage — a Tennysonian intervention that turns Malory's adultery-and-trickery origin into a mystic ambiguity.",
    departures: [
      {
        topic: "Arthur's parentage",
        tennysonLines: "~185–250",
        malorySource:
          "Arthur is Uther's son by Igraine, conceived through Merlin's enchantment while her husband Gorlois is still alive — an adulterous trick plainly narrated.",
        malorySourceRef: "I.1–3",
        tennysonVersion:
          "Arthur's parentage is the idyll's central puzzle. Bellicent recounts that Merlin saw an infant borne on a great wave and laid at Merlin's feet — a mythic birth. Bleys, Leodogran's rival seers, report conflicting accounts. Arthur's identity is adjudicated by spiritual testimony rather than genealogical fact.",
        significance:
          "Tennyson converts Malory's trickster-origin into a mystery that centers on sovereign legitimacy as a question of spiritual recognition, not of blood. Victorians read Arthur as an ideal king; Malory's origin story was an obstacle to that reading. Tennyson's ambiguity resolves the obstacle without denying it.",
      },
      {
        topic: "The sword in the stone",
        malorySource:
          "Arthur draws the sword from the stone before the astonished barons on a New Year's tournament day. The miracle is public and political.",
        malorySourceRef: "I.5–7",
        tennysonVersion:
          "Largely omitted. Tennyson's Arthur receives Excalibur from the Lady of the Lake in a later, mystic scene (reported rather than narrated) and wins his kingdom by twelve great battles against heathen hordes.",
        significance:
          "Tennyson wants Arthur's kingship visible as military-moral achievement rather than as a miracle observed by onlookers. The shift elevates Arthur's agency and fits the Victorian idealization of the hero as worker.",
      },
      {
        topic: "The marriage to Guinevere",
        malorySource:
          "Arthur falls in love at a distance, insists on marrying Guinevere despite Merlin's warning that she will love Lancelot. Merlin prophesies the ruin.",
        malorySourceRef: "III.1–3",
        tennysonVersion:
          "Arthur sees Guinevere once, decides immediately, and Leodogran consents only after his long night of doubt about Arthur's legitimacy. No prophetic warning about her future with Lancelot appears here — Tennyson withholds the doom-knowledge from the reader as carefully as from Arthur.",
        significance:
          "Suppressing Merlin's explicit prophecy makes Arthur's choice seem free rather than fated; the catastrophe that follows reads as moral tragedy rather than as the inevitable outworking of a known curse.",
      },
      {
        topic: "The oath-taking of the Round Table",
        malorySource:
          "The Round Table is given to Arthur by Leodogran (Guinevere's father) as her dowry; the knights swear a long oath of chivalric code at Pentecost (the 'high order of knighthood').",
        malorySourceRef: "III.1, XVIII.25 (full oath)",
        tennysonVersion:
          "Arthur institutes the Round Table at the opening of his reign as a binding civic ideal. The oath's content is compressed and reframed around Victorian virtues — chastity, obedience to conscience, reverence for the king as conscience-figure.",
        significance:
          "Tennyson makes the Round Table the kingdom's moral constitution. When the oath-breaking Guinevere-Lancelot affair comes, the breach is constitutional, not merely sexual. Victorian readers got a polity to mourn the unmaking of, not only a bedroom.",
      },
    ],
  },

  // ── Idyll II ──────────────────────────────────────────────────────
  2: {
    idyllIndex: 2,
    idyllTitle: "Gareth and Lynette",
    primarySource: "malory-morte-darthur",
    primarySourceRef: "Malory VII.1–36 (the Tale of Sir Gareth of Orkney)",
    primarySourceNote:
      "Malory's 'Tale of Sir Gareth,' also known as 'Beaumains' (Fair-hands), gives Tennyson the bones of the young-knight-in-disguise-as-kitchen-boy who wins the hand of a scornful lady. Tennyson makes the idyll allegorical — the four opposing knights become emblems of the stages of life, Morning-Star, Noonday-Sun, Evening-Star, Night — a Tennysonian superimposition on a Malory that is essentially a chivalric adventure.",
    departures: [
      {
        topic: "The four knights of the passage",
        malorySource:
          "Gareth defeats the Black, Green, Red, and Indigo (or Blue) Knights — Malory's colors are a straightforward chivalric sequence with no explicit allegory.",
        malorySourceRef: "VII.8–24",
        tennysonVersion:
          "The four knights become Morning-Star, Noonday-Sun, Evening-Star, and Night — an allegory of the stages of a human life and of the day's hours. The final knight (Night) unhelms to reveal a youth's face, cheating the reader's expectation of a grim enemy.",
        significance:
          "Tennyson converts a simple adventure-sequence into a moral-cosmological allegory. The trick of the final unhelming — a grinning boy where readers expected Death — is Tennyson's comic undercutting of his own solemnity, and signals that this idyll belongs to the cycle's bright morning.",
      },
      {
        topic: "Lynette's scorn",
        malorySource:
          "Lynet (Malory's spelling) mocks Beaumains throughout the journey, grows grudging respect, and eventually weds his brother Gaheris rather than Gareth himself.",
        malorySourceRef: "VII.4–7, VII.35",
        tennysonVersion:
          "Lynette comes to love Gareth openly across the idyll, softening from cold contempt to warmth. The marriage (if any) is left open — Tennyson's codas are deliberately unfixed.",
        significance:
          "Malory's narrative logic (young knight wins lady's respect but her sister) is a workable chivalric conclusion. Tennyson shifts to the romantic-comedy arc, matching the idyll's bright generous tone.",
      },
      {
        topic: "Gareth's disguise at court",
        malorySource:
          "Gareth serves a year in the kitchen, mocked by Kay as 'Beaumains' (fair-hands), and asks Arthur for the first adventure that may come — all essentially as in Malory.",
        malorySourceRef: "VII.1–3",
        tennysonVersion:
          "Retained closely; Kay's mockery is vividly reproduced. Tennyson slightly sharpens the moment of Gareth's revelation to Bellicent his mother, charging it with maternal emotion the chivalric Malory does not linger on.",
        significance:
          "Of the cycle's Malory-close idylls, this is the closest. Tennyson honors the Beaumains story as a showcase of the Round Table's humane generosity — a bright counter-image to the darker idylls.",
      },
    ],
  },

  // ── Idylls III & IV ───────────────────────────────────────────────
  3: {
    idyllIndex: 3,
    idyllTitle: "The Marriage of Geraint",
    primarySource: "mabinogion",
    primarySourceRef:
      "Lady Charlotte Guest, trans., 'Geraint son of Erbin' (The Mabinogion, 1838–45)",
    primarySourceNote:
      "The Geraint/Enid material is Welsh, not from Malory. Tennyson worked from Guest's then-recent English translation. Her edition presents the tale as a chivalric romance with distinctive Welsh features — the sparrow-hawk tournament, Geraint's devotion to Enid, the quiet pastoral passages — most of which Tennyson preserves.",
    departures: [
      {
        topic: "Enid's name",
        malorySource:
          "Guest's Enid is spelled 'Enid' — Tennyson preserves it. (In Chrétien de Troyes's older French Erec, she is 'Enide.') The Welsh tale does not moralize her to the same degree.",
        malorySourceRef: "Mabinogion, 'Geraint son of Erbin'",
        tennysonVersion:
          "Tennyson's Enid is recognizably the Mabinogion figure but invested with Victorian domestic-feminine virtue — patient, silent, loyal to the point of suffering.",
        significance:
          "The superposition of Victorian marriage-ideology onto the Welsh Enid is the source of the difficulty with these two idylls. The Welsh Enid is strong, clear-eyed, and less sacrificial. Tennyson makes her more explicitly the pattern of the long-suffering wife.",
      },
      {
        topic: "The sparrow-hawk tournament",
        malorySource:
          "Geraint fights Edyrn son of Nudd at a sparrow-hawk tournament to avenge a dwarf's insult to Guinevere's maid. The episode is central in Guest's Welsh source.",
        malorySourceRef: "Mabinogion, 'Geraint son of Erbin'",
        tennysonVersion:
          "Retained in detail; the sparrow-hawk contest, Edyrn's defeat and repentance, and Geraint's wooing of Enid in her father Yniol's ruined hall are all present. Tennyson heightens the pastoral melancholy of Yniol's hall.",
        significance:
          "This idyll is among the closest to its source. Tennyson's chief intervention is tonal — the ruined-hall ambiance is more elegiac than the Welsh source requires.",
      },
    ],
  },
  4: {
    idyllIndex: 4,
    idyllTitle: "Geraint and Enid",
    primarySource: "mabinogion",
    primarySourceRef:
      "Lady Charlotte Guest, trans., 'Geraint son of Erbin' (The Mabinogion)",
    primarySourceNote:
      "The second half of the Geraint/Enid diptych, continuing the Welsh source. The central intervention is Tennyson's reading of Enid's trial as a test of wifely patience.",
    departures: [
      {
        topic: "Geraint's jealousy",
        malorySource:
          "In the Mabinogion, Geraint's withdrawal from knightly life is a genuine domestic trouble; he overhears Enid lamenting and mistakes the cause. His ordering her to ride ahead in silence is a harsh test but not yet explicitly punitive.",
        malorySourceRef: "Mabinogion, 'Geraint son of Erbin'",
        tennysonVersion:
          "Tennyson's Geraint is a jealous husband almost in the Othello mold, convinced Enid has been unfaithful. The trial is more explicitly punitive, and Enid's patience more explicitly sacrificial.",
        significance:
          "The Victorian-marriage frame overlays a darker, more openly patriarchal dynamic onto the Welsh source. Modern readers often find this idyll's gender politics its most uncomfortable; Tennyson's Enid is patient to a degree that readers then and now have debated.",
      },
      {
        topic: "The famous opening reflection",
        malorySource:
          "No equivalent in the Welsh tale — the opening 'O purblind race of miserable men…' is Tennyson's own moralizing frame.",
        malorySourceRef: "—",
        tennysonVersion:
          "Tennyson opens with his own reflection on how men create suffering for themselves through error — the idyll's explicit moral. The Welsh source has no narrative frame of this kind.",
        significance:
          "Tennyson's editorial voice is unusually present here. The moralizing is part of the idyll's difficulty — it tells the reader how to feel about Geraint's behavior.",
      },
    ],
  },

  // ── Idyll V ───────────────────────────────────────────────────────
  5: {
    idyllIndex: 5,
    idyllTitle: "Balin and Balan",
    primarySource: "malory-morte-darthur",
    primarySourceRef:
      "Malory II.1–19 (The Tale of Balin le Savage)",
    primarySourceNote:
      "Malory's Balin is a long, bleak tale of violence escalating through misrecognition — the Dolorous Stroke, the death of the Lady of the Lake, and ultimately the fatal combat of Balin with his brother Balan, each failing to recognize the other. Tennyson wrote his 'Balin and Balan' in 1874 and published it in 1885, specifically to thicken the corruption-sequence leading to 'Merlin and Vivien.'",
    departures: [
      {
        topic: "The Dolorous Stroke",
        malorySource:
          "Balin wounds King Pellam with the spear that pierced Christ's side (the spear of Longinus), causing the kingdom to fall into waste and Pellam to lie in pain until healed by Galahad.",
        malorySourceRef: "II.14–15",
        tennysonVersion:
          "Omitted entirely. Tennyson's idyll concentrates on Balin's psychological deterioration and his fatal encounter with Vivien, not on the sacred-wound plot.",
        significance:
          "Excising the Dolorous Stroke removes one of Malory's most mythically loaded moments. Tennyson keeps the idyll focused on interior deterioration rather than cosmic wounding — the corruption here is moral and rumorous, not sacred.",
      },
      {
        topic: "Vivien's presence",
        malorySource:
          "Malory's Balin tale does not feature Vivien at all; his undoing is a series of mischances and escalating violence.",
        malorySourceRef: "II.1–19",
        tennysonVersion:
          "Vivien appears at the idyll's turning point, sowing rumor of Guinevere and Lancelot's adultery. Balin, already on the edge, takes the rumor as confirmation of the court's corruption — and his encounter with Balan is the final breaking.",
        significance:
          "Vivien's introduction here is Tennyson's structural achievement. It converts the Balin tragedy into an anticipation of 'Merlin and Vivien' and positions the kingdom's unmaking as a process of corrupting rumor rather than mythic violence.",
      },
      {
        topic: "The brothers' final combat",
        malorySource:
          "Balin and Balan fight each other unwittingly, both wearing unfamiliar shields and armor; they wound each other mortally and recognize each other only in dying.",
        malorySourceRef: "II.18–19",
        tennysonVersion:
          "Retained, with the recognition-in-death scene given full tragic weight. Tennyson makes this the idyll's climax rather than a concluding detail.",
        significance:
          "This is the one major Malory moment Tennyson keeps essentially intact — because the recognition-in-death fits his frame exactly: the cycle's knights destroy one another through failure to see what they are doing.",
      },
    ],
  },

  // ── Idyll VI — the critical test case ─────────────────────────────
  6: {
    idyllIndex: 6,
    idyllTitle: "Merlin and Vivien",
    primarySource: "malory-morte-darthur",
    primarySourceRef:
      "Malory IV.1 (Merlin's enchantment by Nimuë — the 'damsel of the lake')",
    primarySourceNote:
      "Malory devotes a single short chapter to Merlin's seduction and imprisonment by Nimuë, 'the damsel of the lake.' Tennyson expands the moment into a full-length idyll centered on Vivien — a character he largely constructs himself. The critical consensus (established by the late nineteenth century and confirmed by modern scholarship) treats this idyll as the weakest in character-handling.",
    departures: [
      {
        topic: "Vivien's identity",
        malorySource:
          "Malory's Nimuë is a figure of the lake-woman tradition, ambiguous but not explicitly demonized. Elsewhere in Malory she is a positive figure — she saves Arthur from Morgan le Fay's poisoned cloak and rescues Pelleas from Ettarde (see Idyll IX).",
        malorySourceRef: "IV.1; IV.23; IV.28",
        tennysonVersion:
          "Vivien is made into a near-pure figure of malice, introduced explicitly as a court enemy who has sworn to destroy Arthur's Round Table. She is given a backstory of hatred and a catalogue of court-slanders.",
        significance:
          "This is Tennyson's most disputed character invention. Contemporary and modern critics alike have read Vivien as a character flattened to serve the poem's moral scheme — she absorbs the misogynistic energy the rest of the cycle distributes more carefully. Reading her as a figure honestly requires acknowledging Tennyson's compositional failure here rather than repeating it.",
      },
      {
        topic: "The charm",
        malorySource:
          "Nimuë beguiles Merlin into teaching her a charm of his own, then uses it to seal him under a great stone (or a cave, or a hawthorn tree — Malory's version varies with manuscript).",
        malorySourceRef: "IV.1",
        tennysonVersion:
          "Vivien pursues Merlin to the forest of Broceliande, presses him for the charm through an elaborate seduction scene, and finally wrings it from him during a thunderstorm. The charm binds him in a hollow oak forever.",
        significance:
          "Tennyson's expansion makes the scene a staged moral drama of temptation. Burne-Jones's 1874 painting 'The Beguiling of Merlin' (the Idylls cover image) depicts precisely this moment — Vivien leaning over Merlin with the book of charms. The painting is contemporary with Tennyson's published idyll and visually canonical for it.",
      },
      {
        topic: "The seduction's content",
        malorySource:
          "Malory narrates the seduction as essentially a trick: Merlin is foolish, Nimuë is cunning, the outcome is accepted as fact.",
        malorySourceRef: "IV.1",
        tennysonVersion:
          "Tennyson spends ~500 lines on the seduction — Vivien's smears against every knight of the Round Table (Lancelot, Percivale, Galahad, Mark, even Arthur himself), Merlin's increasingly exhausted refutations, and the final yielding.",
        significance:
          "The expansion is the idyll's most deliberate structural move. Each slander Vivien lodges is a lens on the court — and half the slanders are, in the poem's own terms, true. Merlin's silencing is therefore not only his own fall but the silencing of truth-speaking at court.",
      },
      {
        topic: "Merlin's fatigue and decision",
        malorySource:
          "Malory's Merlin foresees his fate and still cannot avoid it — a brief and bleak note on foreknowledge vs. helplessness.",
        malorySourceRef: "IV.1",
        tennysonVersion:
          "Tennyson's Merlin is introduced as already old, already weary, already knowing he will fall. His telling Vivien the charm is a kind of consent-to-doom — the moment of a sage choosing exhaustion over further resistance.",
        significance:
          "The psychological portrait of Merlin is the idyll's strongest element and often survives the critical complaints about Vivien. Tennyson's sage is not duped but undone by fatigue — a Victorian anxiety about the exhaustion of prophecy in a disenchanted age.",
      },
    ],
  },

  // ── Idyll VII — demo-worthy ───────────────────────────────────────
  7: {
    idyllIndex: 7,
    idyllTitle: "Lancelot and Elaine",
    primarySource: "malory-morte-darthur",
    primarySourceRef:
      "Malory XVIII.9–20 (The Fair Maid of Astolat)",
    primarySourceNote:
      "Malory's Fair Maid of Astolat tale gives Tennyson the core: Lancelot wounded at the Winchester tournament, lodged at Astolat, Elaine tending him and dying of love. Tennyson's idyll is arguably the closest of the major idylls to its Malory source in plot, but adds substantial psychological texture, particularly to Lancelot's interior conflict.",
    departures: [
      {
        topic: "The Diamond Jousts",
        malorySource:
          "Malory's Lancelot wears the red sleeve of Elaine as a favor to disguise himself at the Winchester tournament (one tournament, not nine). His wound is received from his cousin Sir Bors.",
        malorySourceRef: "XVIII.9–11",
        tennysonVersion:
          "Tennyson invents the 'Diamond Jousts' — nine annual tournaments for nine diamonds found in the crown of a long-dead king, which Lancelot wins over the years and gives to Guinevere. The ninth tournament is the one he fights disguised with Elaine's token.",
        significance:
          "The Diamond Jousts are Tennyson's invention and bear the weight of the idyll's psychology. The diamonds are Lancelot's silent homage to Guinevere, and the nine-year pattern makes his relationship with her a long history. When Guinevere in jealousy throws the diamonds into the river at the end, the image is unforgettable and wholly Tennysonian.",
      },
      {
        topic: "Elaine's death",
        malorySource:
          "Elaine dies of love, having received Lancelot's respectful but definitive refusal. Her body is placed in a barge by her brother, with a letter on her breast, and floated down the Thames to Westminster where Arthur and the court discover her.",
        malorySourceRef: "XVIII.19–20",
        tennysonVersion:
          "Preserved closely. Tennyson gives the barge passage full visual weight — the black-barge, the silent oarsman, the lily in her dead hand, the letter on her breast. The funeral-barge image has been imitated and parodied for a hundred and fifty years.",
        significance:
          "This is one of the most famous passages in Victorian poetry and the closest Tennyson comes to ekphrastic painting. The barge is the visual seed for much of the Pre-Raphaelite Arthurian imagery (Waterhouse's 'Lady of Shalott,' which is a different Tennyson character, carries over the visual register).",
      },
      {
        topic: "Elaine's song of love",
        malorySource:
          "Malory's Elaine does not sing; her expression of love is through speech and letter only.",
        malorySourceRef: "XVIII.19",
        tennysonVersion:
          "Elaine sings 'Sweet is true love though given in vain, in vain' — one of the cycle's most quoted lyrics, inserted as a showpiece for Tennyson's lyric gifts within a narrative blank verse idyll.",
        significance:
          "Tennyson turns Malory's speech into a lyric. This is also an echo of his own earlier 'Lady of Shalott' (1832) — a different Elaine (the Lady of Shalott's model) but in the same imaginative family. The cross-reference is pedagogically useful.",
      },
      {
        topic: "Lancelot's divided self",
        malorySource:
          "Malory's Lancelot is internally conflicted but external in expression; his refusal of Elaine is chivalrous and firm.",
        malorySourceRef: "XVIII.19",
        tennysonVersion:
          "Tennyson spends extended passages on Lancelot's soliloquized interior — the sense of himself as 'the best of all the knights' and simultaneously the court's most hidden traitor. His refusal of Elaine is reluctant, guilty, and leaves him morally sickened.",
        significance:
          "This is the idyll's chief psychological achievement and distinguishes Tennyson's Lancelot from Malory's. The Victorian Lancelot is divided in a distinctly nineteenth-century way — the interior theater of guilt is larger than the exterior action.",
      },
      {
        topic: "Guinevere's jealousy",
        malorySource:
          "Malory's Guinevere rages at Lancelot's apparent betrayal (wearing another lady's token) in a jealous scene familiar from courtly-love convention.",
        malorySourceRef: "XVIII.7–8",
        tennysonVersion:
          "Preserved but made bitterer. When Lancelot brings Guinevere the diamonds he has won for her, she flings them out the window into the river below — a pure Tennyson invention, as the dead Elaine's body drifts down that same river at the same moment.",
        significance:
          "The simultaneity — Guinevere throwing the diamonds into the river, Elaine's body floating down the river — is one of the cycle's most architecturally powerful scenes. Tennyson invents the simultaneity; Malory has the two actions occur separately.",
      },
    ],
  },

  // ── Idyll VIII — the Grail ─────────────────────────────────────────
  8: {
    idyllIndex: 8,
    idyllTitle: "The Holy Grail",
    primarySource: "malory-morte-darthur",
    primarySourceRef:
      "Malory XIII.1–XVII.23 (The Sankgreal / Quest of the Holy Grail)",
    primarySourceNote:
      "Malory's Grail quest is roughly 100 chapters across five books — the longest sustained narrative arc in Le Morte d'Arthur. Tennyson condenses it radically into a single idyll of ~900 lines, narrated retrospectively by Percivale (now a monk) to a listening brother, Ambrosius. The narrative framing is Tennyson's invention.",
    departures: [
      {
        topic: "The narrative frame",
        malorySource:
          "Malory narrates the Grail quest from an omniscient third-person perspective, with the viewpoint shifting among Galahad, Percivale, Bors, Lancelot, and others as each pursues the quest.",
        malorySourceRef: "XIII–XVII",
        tennysonVersion:
          "Percivale — now retired to a monastery — tells the story of the quest to a monk named Ambrosius. The entire idyll is a first-person retrospective. Ambrosius's questions and responses shape the frame.",
        significance:
          "The retrospective frame distances the Grail material from direct narration, making the quest itself a kind of unrecoverable vision. Ambrosius, who asks about the ordinary world Percivale has renounced, provides a counter-voice that complicates the quest's meaning.",
      },
      {
        topic: "Galahad's success",
        malorySource:
          "Galahad achieves the Grail in a long and mystically detailed sequence — the Grail ship, the siege perilous, the miraculous vision at Corbenic, the Eucharistic climax, Galahad's death in ecstasy at Sarras.",
        malorySourceRef: "XVII.13–23",
        tennysonVersion:
          "Galahad's success is compressed and narrated at second hand by Percivale, who briefly witnesses a vision of Galahad in a chariot of fire. The theological apparatus is greatly simplified.",
        significance:
          "Malory's Grail is Catholic and Eucharistic. Tennyson — a Victorian Anglican navigating an age of religious doubt — renders the Grail more ambiguously, as a general figure for religious faith rather than a specific sacrament. The change is theologically load-bearing.",
      },
      {
        topic: "Percivale's temptation",
        malorySource:
          "Malory's Percivale is tempted by a beautiful woman in a rich pavilion (actually the devil in disguise) and saves himself by sight of his sword's cross-hilt.",
        malorySourceRef: "XIV.7–10",
        tennysonVersion:
          "Tennyson expands and reorders Percivale's temptations into a sequence of phantasmal appearances — each a vision of worldly consolation that dissolves into ruin when touched. The writing is among Tennyson's most sensuously charged and morally ambiguous.",
        significance:
          "Tennyson's Percivale temptation is the idyll's most intense passage. Critics have read it either as a defense of religious austerity or as a covert lament for the pleasures austerity forbids. The ambiguity is itself Tennysonian — Victorian religious doubt made lyrical.",
      },
      {
        topic: "Arthur's absence from the quest",
        malorySource:
          "Malory's Arthur laments the dispersal of his knights on the quest but gives his blessing. He sees the Grail's consequences for his court but does not oppose them.",
        malorySourceRef: "XIII.7–8",
        tennysonVersion:
          "Tennyson's Arthur is notably more skeptical. In a powerful passage at the idyll's end, he argues that the Grail-quest has unmanned his kingdom — that the visible work of justice in the world is holier than the invisible quest. The Grail is a temptation away from the work.",
        significance:
          "This is one of Tennyson's most original theological moves. Malory's Arthur yields to the quest; Tennyson's Arthur explicitly critiques it. Read one way, Tennyson is defending active civic virtue against monastic withdrawal; read another way, he is expressing doubt about the Grail itself. The idyll sustains both readings.",
      },
      {
        topic: "Lancelot's partial vision",
        malorySource:
          "Malory's Lancelot gets a partial glimpse of the Grail — enough to be knocked down in awe — but is refused full access because of his adultery with Guinevere.",
        malorySourceRef: "XVII.15–16",
        tennysonVersion:
          "Preserved with added psychological weight. Lancelot describes his failure to Percivale with shame; his knowledge that he alone of the great knights was kept from the Grail by a specific moral failure is made explicit.",
        significance:
          "This moment prepares 'Guinevere' — Lancelot's knowledge that the adultery has real cosmic cost is seeded here. The departure from Malory is one of psychological amplification rather than plot change.",
      },
    ],
  },

  // ── Idyll IX ──────────────────────────────────────────────────────
  9: {
    idyllIndex: 9,
    idyllTitle: "Pelleas and Ettarre",
    primarySource: "malory-morte-darthur",
    primarySourceRef: "Malory IV.21–23 (Sir Pelleas and Lady Ettarde)",
    primarySourceNote:
      "Malory gives Pelleas a brief, tragic-turning-happy episode: scorned by Ettarde, saved by Nimuë, and eventually enchanted to love Nimuë instead. Tennyson keeps the opening arc but makes the ending darker.",
    departures: [
      {
        topic: "The ending",
        malorySource:
          "Nimuë enchants Ettarde to love Pelleas (who no longer loves her) and enchants Pelleas to love Nimuë. Pelleas and Nimuë marry; Ettarde dies of unrequited love. A reversal of fortunes in the fairy-tale mode.",
        malorySourceRef: "IV.22–23",
        tennysonVersion:
          "Tennyson omits Nimuë entirely. Pelleas, disillusioned, becomes a bitter cynic who rides off cursing the Round Table. He returns as a hostile figure in later idylls.",
        significance:
          "Excising Malory's happy reversal is the decisive structural choice. Pelleas's disillusionment becomes the cycle's tonal turning-point into despair. Malory's ending would have undone the arc Tennyson was building.",
      },
      {
        topic: "Gawain's betrayal",
        malorySource:
          "Gawain promises to woo Ettarde on Pelleas's behalf and then beds her himself. Malory narrates the betrayal but does not dwell on its cosmic meaning.",
        malorySourceRef: "IV.21",
        tennysonVersion:
          "Tennyson amplifies the betrayal into a moral catastrophe. Gawain's disloyalty stands for the court's general corruption; Pelleas's disillusionment is therefore a rational response to real evidence.",
        significance:
          "The Gawain-Pelleas episode, read through Tennyson's frame, reveals that the court's moral center has collapsed — not merely in the Guinevere-Lancelot affair but in the ordinary conduct of its knights. Pelleas leaves because he has nothing left to admire.",
      },
    ],
  },

  // ── Idyll X ───────────────────────────────────────────────────────
  10: {
    idyllIndex: 10,
    idyllTitle: "The Last Tournament",
    primarySource: "malory-morte-darthur",
    primarySourceRef:
      "Malory VIII–XII (Tristram material; derived also from earlier Tristan romances)",
    primarySourceNote:
      "Tennyson's 'Last Tournament' draws loosely from Malory's long and discursive Tristram books. The idyll's material — Tristram's adulterous relationship with Isolt, his violent death at Mark's hand, the Tournament of the Dead Innocence — is chosen to mirror and intensify the central Lancelot-Guinevere adultery. The tournament itself is Tennyson's composition, assembled from suggestions in Malory rather than from any single source.",
    departures: [
      {
        topic: "The Tournament of the Dead Innocence",
        malorySource:
          "Malory describes many tournaments across the Tristram books but has no single 'Tournament of the Dead Innocence.' The rain, the cynicism, the empty form are all Tennyson's composition.",
        malorySourceRef: "(invention)",
        tennysonVersion:
          "An autumn tournament held in cold rain, ostensibly to mourn a dead infant found with a necklace; the knights fight cynically, the prizes are awarded to cheaters, and Tristram wins as if by default. Arthur is absent — he has ridden north to put down a bandit.",
        significance:
          "Tennyson's invented tournament is the cycle's most sustained mood-piece. The rain, the falling leaves, the court's moral exhaustion — all carry the idyll's argument: chivalry has become a form without substance.",
      },
      {
        topic: "Tristram's death",
        malorySource:
          "Malory's Tristram dies variously — in some versions at the hand of King Mark (his uncle and Isolt's husband), in some versions Mark is absent. The death is reported briefly.",
        malorySourceRef: "XII.14",
        tennysonVersion:
          "Tristram rides from the tournament to Isolt at Tintagel; King Mark, ambushing them, strikes Tristram down on his return. The death is narrated with bleak economy, offstage.",
        significance:
          "The cycle's internal parallel: Tristram-and-Isolt as a distorted mirror of Lancelot-and-Guinevere. Mark's murder of Tristram foreshadows the death-in-anger that will consume Camelot at Camlann.",
      },
      {
        topic: "Dagonet the fool",
        malorySource:
          "Malory's Dagonet is a minor figure, chiefly comic.",
        malorySourceRef: "IX.26 (brief mentions)",
        tennysonVersion:
          "Dagonet becomes a quasi-chorus figure whose bitter laughter frames the idyll. He dances like a withered leaf, mocks Tristram, and speaks some of the cycle's darkest lines.",
        significance:
          "Tennyson gives the fool a greater tonal weight than Malory does — Dagonet's perspective is the court looking at itself from outside its own ideals. The move is structurally Shakespearean.",
      },
    ],
  },

  // ── Idyll XI — the emotional climax ───────────────────────────────
  11: {
    idyllIndex: 11,
    idyllTitle: "Guinevere",
    primarySource: "malory-morte-darthur",
    primarySourceRef:
      "Malory XX.1–9 (Mordred's betrayal, Guinevere's flight to the Tower and then to Almesbury) + XXI.7 (her death as Abbess)",
    primarySourceNote:
      "The central Malory passage gives Tennyson the bare facts: Guinevere flees to the nunnery at Almesbury after the kingdom's fall, becomes an abbess, and eventually dies there. Tennyson's idyll radically changes what is shown. Malory's Guinevere is a strong political figure to the end; Tennyson's is domesticated in ways critics have long found troubling.",
    departures: [
      {
        topic: "The confrontation with Arthur",
        malorySource:
          "In Malory, Arthur and Guinevere never meet again after her flight. Her repentance is theological and interior; Arthur's death at Camlann happens separately; when Lancelot visits her at Almesbury much later, she refuses to see him and they part for the last time.",
        malorySourceRef: "XXI.9–11",
        tennysonVersion:
          "Tennyson invents a long scene in which Arthur, before riding west to his last battle, comes to Almesbury and confronts Guinevere in person. He delivers a ~150-line speech of forgiveness-with-judgment; Guinevere is prostrate at his feet, then rises, then sees him depart.",
        significance:
          "The invented scene is the cycle's emotional climax — and its most morally contested passage. Arthur's speech forgives Guinevere while also blaming her for the fall of the realm in terms many readers find disproportionate. Tennyson's own contemporaries (some) found it moving; many modern readers find it repellent. The annotations must hold both responses honestly.",
      },
      {
        topic: "Guinevere's interiority",
        malorySource:
          "Malory's Guinevere is given no extended interior life; her motives and feelings are inferred from her actions.",
        malorySourceRef: "XX–XXI",
        tennysonVersion:
          "Tennyson provides long passages of Guinevere's inner consciousness — her self-recrimination, her recognition of Arthur's 'blamelessness,' her shifting emotions across the confrontation. This is among Tennyson's most psychologically sustained writing in the cycle.",
        significance:
          "The psychological depth Tennyson gives Guinevere in her own idyll often exceeds the frame he has set for her. The poem's humanity toward her, in practice, contradicts the frame's stated judgment of her — Tennyson's practice is larger than his stated moral reading. Annotations should surface this.",
      },
      {
        topic: "Guinevere's eventual position",
        malorySource:
          "Malory's Guinevere becomes Abbess of Almesbury — a position of religious authority, achieved through her own spiritual capability.",
        malorySourceRef: "XXI.7",
        tennysonVersion:
          "Tennyson implies the Abbess position (she 'for three years' holds the nunnery), but the emphasis is on her continued contrition rather than on her spiritual authority. The political-religious independence Malory gives her is muted.",
        significance:
          "The diminution of Guinevere's independent spiritual standing is one of the idyll's clearest Victorian-domestications of the Malory figure. Readers comparing the two Guineveres often find Malory's the more adult character.",
      },
      {
        topic: "The novice's conversation",
        malorySource:
          "No equivalent in Malory.",
        malorySourceRef: "—",
        tennysonVersion:
          "Guinevere sits with a young novice who innocently gossips about the court's fall, asking questions the reader already knows the answers to. The device is Tennyson's — painful dramatic irony, the novice not yet knowing who she is speaking to.",
        significance:
          "The novice scene is one of Tennyson's most subtle dramatic constructions. The young woman's ignorance is the measure of how far the world has already moved past the ruin Guinevere is still living inside.",
      },
    ],
  },

  // ── Idyll XII — the bookend ──────────────────────────────────────
  12: {
    idyllIndex: 12,
    idyllTitle: "The Passing of Arthur",
    primarySource: "malory-morte-darthur",
    primarySourceRef:
      "Malory XXI.1–6 (the last battle at Salisbury / Camlann and Arthur's passing)",
    primarySourceNote:
      "Tennyson's closing idyll incorporates his 1833 'Morte d'Arthur' — his very first Arthurian poem, written when he was 24 — and frames it with new material at front and back. The idyll is therefore structurally the oldest passage in the cycle, wrapped in the cycle's latest writing. The poet spent fifty-two years writing toward his own earliest vision.",
    departures: [
      {
        topic: "The last battle",
        malorySource:
          "Malory's last battle is at Salisbury (or Camlann in some versions); Arthur kills Mordred with a spear-thrust and is himself mortally wounded by Mordred's return-stroke. The battlefield is strewn with the dead on both sides.",
        malorySourceRef: "XXI.3–4",
        tennysonVersion:
          "Tennyson's last battle is fought in a thick white mist on the western coast — 'a land of old upheaven from the abyss / By fire.' The mist obscures the combatants, and Arthur kills Modred without the scene being fully visible. The atmosphere is more important than the narrative action.",
        significance:
          "The mist is a major Tennyson invention — an image of moral and historical indistinctness. The reader cannot quite see the end of the kingdom. This is one of the cycle's most important tonal achievements.",
      },
      {
        topic: "Bedivere and Excalibur",
        malorySource:
          "Arthur orders Bedivere (Malory's 'Bedivere' / 'Bedwyr') to throw Excalibur into the lake; Bedivere twice hesitates and returns saying he saw nothing; Arthur sends him a third time, and the arm-rising-from-the-water returns the sword to its source.",
        malorySourceRef: "XXI.5",
        tennysonVersion:
          "Preserved in essentially Malory's form, narrated in Tennyson's most richly pictorial blank verse. This passage is from the 1833 'Morte d'Arthur' — the oldest material in the Idylls — and Tennyson incorporated it nearly unchanged when he built the final idyll around it.",
        significance:
          "The passage is famous in its own right and often anthologized separately. Its preservation is Tennyson honoring the young poet he had been. The cycle's ending is therefore also its oldest passage — a structural recursion.",
      },
      {
        topic: "The Avalon departure",
        malorySource:
          "Three queens (Morgan le Fay, the Queen of Northgalis, the Queen of the Wastelands) come in a black barge to bear Arthur away 'to the vale of Avalon.' Malory notes that 'some men say yet that King Arthur is not dead, but had by the will of our Lord Jesu into another place' — the once-and-future-king idea.",
        malorySourceRef: "XXI.5–7",
        tennysonVersion:
          "Preserved with heightened mystic register. The Three Queens are unnamed, their identities mythic rather than specific. Arthur's passing is narrated as a departure into light: 'from the great deep to the great deep he goes.'",
        significance:
          "Tennyson strips away Malory's specific mythography (Morgan le Fay etc.) to leave a more abstract departure. The famous line 'from the great deep to the great deep he goes' is Tennyson's own addition and has become the cycle's signature moment — a Victorian religious agnosticism rendered as numinous image.",
      },
      {
        topic: "The circular 'Old order changeth'",
        malorySource:
          "Malory does not frame the ending philosophically.",
        malorySourceRef: "—",
        tennysonVersion:
          "'The old order changeth, yielding place to new' — this line appears in 'The Coming of Arthur' at the kingdom's dawn and returns, slightly altered, at Arthur's passing. The cycle is structurally circular: it closes on the same historical-reflection language with which it opened.",
        significance:
          "Tennyson's philosophical framing converts a chivalric tragedy into a meditation on historical change. The same line, said by a rising king and a dying one, asks the reader to see continuity in ruin. This is the cycle's most characteristic Victorian move — finding consolation in process.",
      },
    ],
  },
}
